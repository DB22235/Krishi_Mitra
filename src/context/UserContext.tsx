// // src/context/UserContext.tsx
// import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// export interface UserData {
//   // Basic Info (from OnboardingProfile)
//   name: string;
//   age: string;
//   gender: string;
//   mobile: string;
//   profileImage: string;

//   // Farm Details (from OnboardingFarmDetails)
//   landOwnership: string;
//   landSize: number;
//   landUnit: string;
//   selectedCrops: string[];
//   selectedSeasons: string[];
//   irrigation: string[];

//   // Financial Info
//   annualIncome: string;
//   incomeSource: string;
//   category: string;
//   bankName: string;
//   bankAccount: string;
//   ifscCode: string;
//   pmKisanStatus: string;

//   // Documents
//   documents: DocumentInfo[];

//   // Location
//   state: string;
//   district: string;
//   village: string;

//   // Additional
//   aadhaar: string;
//   aadhaarVerified: boolean;
//   memberSince: string;
//   soilType: string;
//   livestock: string;
// }

// export interface DocumentInfo {
//   id: string;
//   name: string;
//   nameHi: string;
//   status: 'uploaded' | 'pending' | 'expired';
//   verified: boolean;
//   warning?: string;
//   file?: string;
// }

// interface UserContextType {
//   userData: UserData;
//   updateUserData: (data: Partial<UserData>) => void;
//   clearUserData: () => void;
//   getProfileCompletion: () => number;
//   getPendingTasks: () => { en: string; hi: string }[];
//   loadAccount: (mobile: string) => void;
// }

// const defaultDocuments = [
//   { id: 'aadhaar', name: 'Aadhaar Card', nameHi: 'आधार कार्ड', status: 'pending' as const, verified: false },
//   { id: 'land', name: 'Land Records', nameHi: 'भूमि रिकॉर्ड', status: 'pending' as const, verified: false },
//   { id: 'bank', name: 'Bank Passbook', nameHi: 'बैंक पासबुक', status: 'pending' as const, verified: false },
//   { id: 'photo', name: 'Passport Photo', nameHi: 'पासपोर्ट फोटो', status: 'pending' as const, verified: false },
// ];

// const defaultUserData: UserData = {
//   name: '',
//   age: '',
//   gender: '',
//   mobile: '',
//   profileImage: '',
//   landOwnership: '',
//   landSize: 0,
//   landUnit: 'Acre',
//   selectedCrops: [],
//   selectedSeasons: [],
//   irrigation: [],
//   annualIncome: '',
//   incomeSource: '',
//   category: '',
//   bankName: '',
//   bankAccount: '',
//   ifscCode: '',
//   pmKisanStatus: '',
//   documents: defaultDocuments,
//   state: '',
//   district: '',
//   village: '',
//   aadhaar: '',
//   aadhaarVerified: false,
//   memberSince: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
//   soilType: '',
//   livestock: '',
// };

// // ─── Key helpers ────────────────────────────────────────────────────────────
// // Active session key — stores which account is currently logged in
// const SESSION_KEY = 'active-user-mobile';

// // Per-account data key
// const userDataKey = (mobile: string) => `user-data-${mobile}`;

// // Read the currently logged-in mobile from session
// const getActiveMobile = (): string => localStorage.getItem(SESSION_KEY) || '';

// // Load data for a specific mobile (or return defaults)
// const loadUserData = (mobile: string): UserData => {
//   if (!mobile) return defaultUserData;
//   const saved = localStorage.getItem(userDataKey(mobile));
//   return saved ? { ...defaultUserData, ...JSON.parse(saved) } : defaultUserData;
// };
// // ─────────────────────────────────────────────────────────────────────────────

// const UserContext = createContext<UserContextType | undefined>(undefined);

// export function UserProvider({ children }: { children: ReactNode }) {
//   const [userData, setUserData] = useState<UserData>(() => {
//     const mobile = getActiveMobile();
//     return loadUserData(mobile);
//   });

//   // Whenever userData changes, persist it under the correct per-account key
//   useEffect(() => {
//     const mobile = userData.mobile || getActiveMobile();
//     if (mobile) {
//       localStorage.setItem(userDataKey(mobile), JSON.stringify(userData));
//       // Keep session key in sync in case mobile was just set
//       localStorage.setItem(SESSION_KEY, mobile);
//     }
//   }, [userData]);

//   const updateUserData = (data: Partial<UserData>) => {
//     setUserData((prev) => ({ ...prev, ...data }));
//   };

//   const clearUserData = () => {
//     localStorage.removeItem(SESSION_KEY);
//     localStorage.removeItem('token');
//     setUserData(defaultUserData);
//   };

//   const loadAccount = (mobile: string) => {
//     if (!mobile) return;
//     localStorage.setItem(SESSION_KEY, mobile);
//     const data = loadUserData(mobile);
//     setUserData(data);
//   };

//   // ── Call this from your Login page after successful login ──────────────────
//   // e.g.  loginUser(mobile)  →  loads that account's saved data into context
//   // You can expose this via context if needed, or call it directly in Login.tsx
//   // by doing: localStorage.setItem('active-user-mobile', mobile) before mount,
//   // then the UserProvider init above will automatically pick it up.
//   // ──────────────────────────────────────────────────────────────────────────

//   const getProfileCompletion = (): number => {
//     let total = 0;
//     let filled = 0;

//     const basicFields = ['name', 'age', 'gender', 'mobile'] as const;
//     basicFields.forEach((field) => {
//       total += 7.5;
//       if (userData[field]) filled += 7.5;
//     });

//     total += 7.5;
//     if (userData.landOwnership) filled += 7.5;
//     total += 7.5;
//     if (userData.landSize > 0) filled += 7.5;
//     total += 7.5;
//     if (userData.selectedCrops.length > 0) filled += 7.5;
//     total += 7.5;
//     if (userData.irrigation.length > 0) filled += 7.5;

//     const finFields = ['annualIncome', 'bankName', 'bankAccount', 'ifscCode'] as const;
//     finFields.forEach((field) => {
//       total += 5;
//       if (userData[field]) filled += 5;
//     });

//     userData.documents.forEach(() => { total += 5; });
//     userData.documents.forEach((doc) => {
//       if (doc.status === 'uploaded') filled += 5;
//     });

//     return Math.round((filled / total) * 100);
//   };

//   const getPendingTasks = () => {
//     const tasks: { en: string; hi: string }[] = [];

//     if (!userData.name) tasks.push({ en: 'Add your name', hi: 'अपना नाम जोड़ें' });
//     if (!userData.mobile) tasks.push({ en: 'Add mobile number', hi: 'मोबाइल नंबर जोड़ें' });
//     if (!userData.annualIncome) tasks.push({ en: 'Add annual income', hi: 'वार्षिक आय जोड़ें' });
//     if (!userData.bankAccount) tasks.push({ en: 'Add bank details', hi: 'बैंक विवरण जोड़ें' });
//     if (userData.selectedCrops.length === 0) tasks.push({ en: 'Add crop details', hi: 'फसल विवरण जोड़ें' });
//     if (!userData.profileImage) tasks.push({ en: 'Upload profile photo', hi: 'प्रोफाइल फोटो अपलोड करें' });

//     const pendingDocs = userData.documents.filter((d) => d.status === 'pending');
//     if (pendingDocs.length > 0) {
//       tasks.push({ en: `Upload ${pendingDocs.length} documents`, hi: `${pendingDocs.length} दस्तावेज़ अपलोड करें` });
//     }

//     return tasks;
//   };

//   return (
//     <UserContext.Provider value={{ userData, updateUserData, clearUserData, getProfileCompletion, getPendingTasks, loadAccount }}>
//       {children}
//     </UserContext.Provider>
//   );
// }

// export function useUser() {
//   const context = useContext(UserContext);
//   if (!context) throw new Error('useUser must be used within UserProvider');
//   return context;
// }


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
      const parsed = JSON.parse(saved);
      // Migrate existing documents to include nameMr if missing
      if (parsed.documents) {
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
      }
      return { ...defaultUserData, ...parsed };
    }
    return defaultUserData;
  });

  useEffect(() => {
    localStorage.setItem('user-data', JSON.stringify(userData));
  }, [userData]);

  const updateUserData = (data: Partial<UserData>) => {
    setUserData((prev) => ({ ...prev, ...data }));
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
    <UserContext.Provider value={{ userData, updateUserData, getProfileCompletion, getPendingTasks }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within UserProvider');
  return context;
}

