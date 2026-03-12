import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { loadProfile } from '../utils/api';

export interface UserData {
  // Basic Info (from OnboardingProfile)
  name: string;
  age: string;
  gender: string;
  mobile: string;
  profileImage: string;

  // Farm Details (from OnboardingFarmDetails)
  landOwnership: string;
  landSize: number;
  landUnit: string;
  selectedCrops: string[];
  selectedSeasons: string[];
  irrigation: string[];

  // Financial Info
  annualIncome: string;
  incomeSource: string;
  category: string;
  bankName: string;
  bankAccount: string;
  ifscCode: string;
  pmKisanStatus: string;
  financialLedger: {
    id: string;
    scheme: string;
    schemeHi: string;
    schemeMr: string;
    amount: number;
    date: string;
    year: number;
    category: string;
  }[];

  // Documents
  documents: DocumentInfo[];

  // Location
  state: string;
  district: string;
  village: string;

  // Additional
  aadhaar: string;
  aadhaarVerified: boolean;
  memberSince: string;
  soilType: string;
  livestock: string;
}

export interface DocumentInfo {
  id: string;
  name: string;
  nameHi: string;
  nameMr: string;
  status: 'uploaded' | 'pending' | 'expired';
  verified: boolean;
  warning?: string;
  file?: string;
}

interface UserContextType {
  userData: UserData;
  updateUserData: (data: Partial<UserData>) => void;
  clearUserData: () => void;
  syncWithBackend: () => Promise<void>;
  getProfileCompletion: () => number;
  getPendingTasks: () => { en: string; hi: string; mr: string }[];
}

const defaultUserData: UserData = {
  name: '',
  age: '',
  gender: '',
  mobile: '',
  profileImage: '',
  landOwnership: '',
  landSize: 0,
  landUnit: 'Acre',
  selectedCrops: [],
  selectedSeasons: [],
  irrigation: [],
  annualIncome: '',
  incomeSource: '',
  category: '',
  bankName: '',
  bankAccount: '',
  ifscCode: '',
  pmKisanStatus: '',
  financialLedger: [],
  documents: [
    { id: 'aadhaar', name: 'Aadhaar Card', nameHi: 'आधार कार्ड', nameMr: 'आधार कार्ड', status: 'pending', verified: false },
    { id: 'land', name: 'Land Records', nameHi: 'भूमि रिकॉर्ड', nameMr: 'जमीन नोंदी', status: 'pending', verified: false },
    { id: 'bank', name: 'Bank Passbook', nameHi: 'बैंक पासबुक', nameMr: 'बँक पासबुक', status: 'pending', verified: false },
    { id: 'photo', name: 'Passport Photo', nameHi: 'पासपोर्ट फोटो', nameMr: 'पासपोर्ट फोटो', status: 'pending', verified: false },
  ],
  state: '',
  district: '',
  village: '',
  aadhaar: '',
  aadhaarVerified: false,
  memberSince: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
  soilType: '',
  livestock: '',
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [userData, setUserData] = useState<UserData>(() => {
    const saved = localStorage.getItem('user-data');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Ensure documents is always an array (could be an object from backend/corrupted data)
        if (parsed.documents && Array.isArray(parsed.documents)) {
          const mrNames: Record<string, string> = {
            aadhaar: 'आधार कार्ड',
            land: 'जमीन नोंदी',
            bank: 'बँक पासबुक',
            photo: 'पासपोर्ट फोटो',
          };
          parsed.documents = parsed.documents.map((doc: DocumentInfo) => ({
            ...doc,
            nameMr: doc.nameMr || mrNames[doc.id] || doc.name,
          }));
        } else {
          // Reset to default if documents is not an array
          parsed.documents = defaultUserData.documents;
        }
        return { ...defaultUserData, ...parsed };
      } catch {
        // If parsing fails, use defaults
        return defaultUserData;
      }
    }
    return defaultUserData;
  });

  useEffect(() => {
    localStorage.setItem('user-data', JSON.stringify(userData));
  }, [userData]);

  const updateUserData = (data: Partial<UserData>) => {
    setUserData((prev) => ({ ...prev, ...data }));
  };

  const clearUserData = () => {
    localStorage.removeItem('user-data');
    localStorage.removeItem('token');
    localStorage.removeItem('user-name');
    setUserData(defaultUserData);
  };

  // Sync local state with the backend profile (call after login/signup)
  const syncWithBackend = useCallback(async () => {
    try {
      const data = await loadProfile();
      if (data.exists && data.profile) {
        const p = data.profile;
        const backendData: Partial<UserData> = {};
        if (p.name) backendData.name = p.name;
        if (p.mobile) backendData.mobile = p.mobile;
        if (p.age) backendData.age = String(p.age);
        if (p.gender) backendData.gender = p.gender;
        if (p.state) backendData.state = p.state;
        if (p.district) backendData.district = p.district;
        if (p.village) backendData.village = p.village;
        if (p.profileImage) backendData.profileImage = p.profileImage;
        if (p.category) backendData.category = p.category;
        if (p.annualIncome) backendData.annualIncome = p.annualIncome;
        if (p.incomeSource) backendData.incomeSource = p.incomeSource;
        if (p.bankName) backendData.bankName = p.bankName;
        if (p.bankAccount) backendData.bankAccount = p.bankAccount;
        if (p.ifscCode) backendData.ifscCode = p.ifscCode;
        if (p.pmKisanStatus) backendData.pmKisanStatus = p.pmKisanStatus;
        if (p.landSize !== undefined) backendData.landSize = p.landSize;
        if (p.landUnit) backendData.landUnit = p.landUnit;
        if (p.landOwnership) backendData.landOwnership = p.landOwnership;
        if (p.soilType) backendData.soilType = p.soilType;
        if (p.livestock) backendData.livestock = p.livestock;
        if (Array.isArray(p.selectedCrops)) backendData.selectedCrops = p.selectedCrops;
        if (Array.isArray(p.selectedSeasons)) backendData.selectedSeasons = p.selectedSeasons;
        if (Array.isArray(p.irrigation)) backendData.irrigation = p.irrigation;
        if (p.aadhaar) backendData.aadhaar = p.aadhaar;
        if (p.aadhaarVerified !== undefined) backendData.aadhaarVerified = p.aadhaarVerified;
        if (p.memberSince) backendData.memberSince = p.memberSince;

        setUserData((prev) => ({ ...prev, ...backendData }));
      }
    } catch (err) {
      console.warn('Could not sync profile from backend:', err);
      // Not critical — local data is still usable
    }
  }, []);

  const getProfileCompletion = (): number => {
    let total = 0;
    let filled = 0;

    // Basic (30%)
    const basicFields = ['name', 'age', 'gender', 'mobile'] as const;
    basicFields.forEach((field) => {
      total += 7.5;
      if (userData[field]) filled += 7.5;
    });

    // Farm (30%)
    total += 7.5;
    if (userData.landOwnership) filled += 7.5;
    total += 7.5;
    if (userData.landSize > 0) filled += 7.5;
    total += 7.5;
    if (userData.selectedCrops.length > 0) filled += 7.5;
    total += 7.5;
    if (userData.irrigation.length > 0) filled += 7.5;

    // Financial (20%)
    const finFields = ['annualIncome', 'bankName', 'bankAccount', 'ifscCode'] as const;
    finFields.forEach((field) => {
      total += 5;
      if (userData[field]) filled += 5;
    });

    // Documents (20%)
    userData.documents.forEach(() => {
      total += 5;
    });
    userData.documents.forEach((doc) => {
      if (doc.status === 'uploaded') filled += 5;
    });

    return Math.round((filled / total) * 100);
  };

  const getPendingTasks = () => {
    const tasks: { en: string; hi: string; mr: string }[] = [];

    if (!userData.name)
      tasks.push({ en: 'Add your name', hi: 'अपना नाम जोड़ें', mr: 'तुमचे नाव टाका' });
    if (!userData.mobile)
      tasks.push({ en: 'Add mobile number', hi: 'मोबाइल नंबर जोड़ें', mr: 'मोबाइल नंबर टाका' });
    if (!userData.annualIncome)
      tasks.push({ en: 'Add annual income', hi: 'वार्षिक आय जोड़ें', mr: 'वार्षिक उत्पन्न टाका' });
    if (!userData.bankAccount)
      tasks.push({ en: 'Add bank details', hi: 'बैंक विवरण जोड़ें', mr: 'बँक तपशील टाका' });
    if (userData.selectedCrops.length === 0)
      tasks.push({ en: 'Add crop details', hi: 'फसल विवरण जोड़ें', mr: 'पीक तपशील टाका' });
    if (!userData.profileImage)
      tasks.push({ en: 'Upload profile photo', hi: 'प्रोफाइल फोटो अपलोड करें', mr: 'प्रोफाइल फोटो अपलोड करा' });

    const pendingDocs = userData.documents.filter((d) => d.status === 'pending');
    if (pendingDocs.length > 0) {
      tasks.push({
        en: `Upload ${pendingDocs.length} documents`,
        hi: `${pendingDocs.length} दस्तावेज़ अपलोड करें`,
        mr: `${pendingDocs.length} कागदपत्रे अपलोड करा`,
      });
    }

    return tasks;
  };

  return (
    <UserContext.Provider value={{ userData, updateUserData, clearUserData, syncWithBackend, getProfileCompletion, getPendingTasks }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within UserProvider');
  return context;
}

