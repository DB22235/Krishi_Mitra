// src/context/UserContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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
  loggedInName: string;
  getProfileCompletion: () => number;
  getPendingTasks: () => { en: string; hi: string; mr: string }[];
  syncWithBackend: () => Promise<void>;
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
        if (parsed && typeof parsed === 'object') {
          let documents = Array.isArray(parsed.documents) ? parsed.documents : defaultUserData.documents;
          
          // Migrate existing documents to include nameMr if missing
          if (Array.isArray(documents)) {
            const mrNames: Record<string, string> = {
              aadhaar: 'आधार कार्ड',
              land: 'जमीन नोंदी',
              bank: 'बँक पासबुक',
              photo: 'पासपोर्ट फोटो',
            };
            documents = documents.map((doc: DocumentInfo) => ({
              ...doc,
              nameMr: doc.nameMr || mrNames[doc.id] || doc.name,
            }));
          }
          return { ...defaultUserData, ...parsed, documents };
        }
      } catch (e) {
        console.error('Error parsing saved user-data:', e);
      }
    }
    return defaultUserData;
  });

  // Derive the logged-in user's name: prefer context userData.name, then localStorage user-name
  const loggedInName: string =
    userData.name || localStorage.getItem('user-name') || '';

  useEffect(() => {
    localStorage.setItem('user-data', JSON.stringify(userData));
    // Keep user-name in sync with context
    if (userData.name) {
      localStorage.setItem('user-name', userData.name);
    }
  }, [userData]);

  const updateUserData = async (data: Partial<UserData>) => {
    // Update local state first for immediate UI response
    const newData = { ...userData, ...data };
    setUserData(newData);

    // Sync to backend if token exists
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const { saveProfile } = await import('../utils/api');
        
        // Transform data to match backend ProfileData if documents are present
        const backendData: any = { ...data };
        if (data.documents) {
          const docMap: Record<string, string> = {};
          data.documents.forEach(doc => {
            if (doc.file) docMap[doc.id] = doc.file;
          });
          backendData.documents = docMap;
        }

        await saveProfile(backendData);
        console.log('✅ Changes synced to backend');
      } catch (err) {
        console.error('❌ Failed to sync with backend:', err);
      }
    }
  };

  const syncWithBackend = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const { loadProfile } = await import('../utils/api');
      const response = await loadProfile();
      if (response.exists && response.profile) {
        setUserData((prev) => ({ ...prev, ...response.profile }));
        console.log('✅ User data synced from backend');
      }
    } catch (err) {
      console.error('❌ Failed to load profile from backend:', err);
    }
  };

  const clearUserData = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user-name');
    localStorage.removeItem('user-data');
    setUserData(defaultUserData);
  };

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
    <UserContext.Provider value={{ userData, updateUserData, clearUserData, loggedInName, getProfileCompletion, getPendingTasks, syncWithBackend }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within UserProvider');
  return context;
}

