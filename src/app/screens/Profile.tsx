import { useState, useRef, useEffect } from 'react';
import {
  ArrowLeft, ChevronDown, ChevronUp, Edit2, Camera,
  LogOut, User, Sprout, Wallet, FileText,
  Globe, Upload, X, Check, Plus, Sparkles, Shield,
  AlertCircle,
} from 'lucide-react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { BottomNav } from '../components/BottomNav';
import { useLanguage } from '../../context/LanguageContext';
import { useUser } from '../../context/UserContext';


// ─── Types ────────────────────────────────────────────────────────────────────
type OcrStatus = 'idle' | 'loading' | 'matched' | 'mismatch' | 'error';


interface OcrVerification {
  status: OcrStatus;
  extractedNumber?: string;
  message?: string;
}


// // ─── Groq OCR helper ──────────────────────────────────────────────────────────
// async function extractAadhaarWithGroq(base64Image: string): Promise<string | null> {
//   const apiKey = import.meta.env.VITE_GROQ_API_KEY as string | undefined;


//   if (!apiKey) {
//     throw new Error(
//       'VITE_GROQ_API_KEY is not set. Add it to your .env file in the project root.'
//     );
//   }


//   const mimeType = base64Image.startsWith('data:image/png') ? 'image/png' : 'image/jpeg';
//   const imageData = base64Image.includes(',') ? base64Image.split(',')[1] : base64Image;


//   const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
//     method: 'POST',
//     headers: {
//       Authorization: `Bearer ${apiKey}`,
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({
//       model: 'meta-llama/llama-4-scout-17b-16e-instruct',
//       max_tokens: 60,
//       temperature: 0,
//       messages: [
//         {
//           role: 'user',
//           content: [
//             {
//               type: 'image_url',
//               image_url: { url: `data:${mimeType};base64,${imageData}` },
//             },
//             {
//               type: 'text',
//               text: `You are an OCR tool. Look at this Indian Aadhaar card image.
// Extract ONLY the 12-digit Aadhaar number (it usually appears as XXXX XXXX XXXX).
// Return ONLY the 12 digits with no spaces, dashes, or any other text.
// If you cannot find a valid 12-digit number, return exactly: NOT_FOUND`,
//             },
//           ],
//         },
//       ],
//     }),
//   });


//   if (!response.ok) {
//     const err = await response.text();
//     throw new Error(`Groq API error ${response.status}: ${err}`);
//   }


//   const data = await response.json();
//   const raw: string = data.choices?.[0]?.message?.content?.trim() ?? '';
//   const digits = raw.replace(/\D/g, '');
//   return digits.length === 12 ? digits : null;
// }
async function extractAadhaarWithGroq(base64Image: string): Promise<string | null> {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY as string | undefined;

  if (!apiKey) {
    throw new Error(
      'VITE_GROQ_API_KEY is not set. Add it to your .env file in the project root.'
    );
  }

  // ✅ FIX 1: Properly detect mime type from the data URL prefix
  let mimeType = 'image/jpeg'; // default
  if (base64Image.startsWith('data:image/png')) {
    mimeType = 'image/png';
  } else if (base64Image.startsWith('data:image/webp')) {
    mimeType = 'image/webp';
  } else if (base64Image.startsWith('data:image/gif')) {
    mimeType = 'image/gif';
  } else if (base64Image.startsWith('data:application/pdf')) {
    throw new Error('PDF format is not supported for OCR. Please upload a JPG or PNG image.');
  }

  // ✅ FIX 2: Properly strip the data URL prefix to get raw base64
  const imageData = base64Image.includes(',')
    ? base64Image.split(',')[1]
    : base64Image;

  // ✅ FIX 3: Validate that we actually have base64 data
  if (!imageData || imageData.length < 100) {
    throw new Error('Image data is too small or invalid.');
  }

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'meta-llama/llama-4-scout-17b-16e-instruct',
      max_tokens: 60,
      temperature: 0,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image_url',
              image_url: {
                // ✅ FIX 4: Send the FULL data URL (prefix + base64), not just base64
                url: `data:${mimeType};base64,${imageData}`,
              },
            },
            {
              type: 'text',
              text: `You are an OCR tool. Look at this Indian Aadhaar card image.
Extract ONLY the 12-digit Aadhaar number (it usually appears as XXXX XXXX XXXX).
Return ONLY the 12 digits with no spaces, dashes, or any other text.
If you cannot find a valid 12-digit number, return exactly: NOT_FOUND`,
            },
          ],
        },
      ],
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Groq API error ${response.status}: ${err}`);
  }

  const data = await response.json();
  const raw: string = data.choices?.[0]?.message?.content?.trim() ?? '';
  const digits = raw.replace(/\D/g, '');
  return digits.length === 12 ? digits : null;
}

// ─── Utility ──────────────────────────────────────────────────────────────────
function formatAadhaar(digits: string) {
  return digits.replace(/(\d{4})(\d{4})(\d{4})/, '$1 $2 $3');
}


// ─── Component ────────────────────────────────────────────────────────────────
export function Profile() {
  const navigate = useNavigate();
  const { language, setLanguage } = useLanguage();
  const { userData, updateUserData, clearUserData, getProfileCompletion, getPendingTasks } =
    useUser();
  const isHindi = language === 'hi';
  const isMarathi = language === 'mr';


  // Helper to pick the right localized string
  const localize = (en: string, hi: string, mr: string) => {
    if (isMarathi) return mr;
    if (isHindi) return hi;
    return en;
  };


  const [expandedSection, setExpandedSection] = useState<string>('');
  const [showFinanceModal, setShowFinanceModal] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showSignOutModal, setShowSignOutModal] = useState(false);
  const [animatedPercent, setAnimatedPercent] = useState(0);


  // ── OCR state ──────────────────────────────────────────────────────────────
  const [ocrVerification, setOcrVerification] = useState<OcrVerification>({
    status: 'idle',
  });


  // ── Aadhaar number input (lives inside Documents section) ──────────────────
  const [aadhaarInput, setAadhaarInput] = useState(
    (userData.aadhaar || '').replace(/\D/g, '')
  );
  const [aadhaarSaved, setAadhaarSaved] = useState(false);


  const fileInputRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);
  const [activeDocId, setActiveDocId] = useState('');


  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});


  const [financeForm, setFinanceForm] = useState({
    annualIncome: userData.annualIncome || '',
    incomeSource: userData.incomeSource || '',
    category: userData.category || '',
    bankName: userData.bankName || '',
    bankAccount: userData.bankAccount || '',
    ifscCode: userData.ifscCode || '',
    pmKisanStatus: userData.pmKisanStatus || '',
  });


  const profileCompletion = getProfileCompletion();
  const pendingTasks = getPendingTasks();


  // Animate profile completion percentage
  useEffect(() => {
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        setAnimatedPercent((prev) => {
          if (prev >= profileCompletion) {
            clearInterval(interval);
            return profileCompletion;
          }
          return prev + 1;
        });
      }, 20);
      return () => clearInterval(interval);
    }, 500);
    return () => clearTimeout(timer);
  }, [profileCompletion]);


  // Keep aadhaarInput in sync if userData.aadhaar changes (e.g. OCR auto-fill)
  useEffect(() => {
    setAadhaarInput((userData.aadhaar || '').replace(/\D/g, ''));
  }, [userData.aadhaar]);


  const toggleSection = (section: string) => {
    const isOpening = expandedSection !== section;
    setExpandedSection(isOpening ? section : '');
    if (isOpening) {
      setTimeout(() => {
        sectionRefs.current[section]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };

  // ── Helper to persist partial updates to backend ───────────────────────────
  const persistToBackend = async (data: any) => {
    try {
      const { saveProfile } = await import('../../utils/api');
      await saveProfile(data);
    } catch (err) {
      console.warn('Could not save to backend:', err);
    }
  };


  // ── Aadhaar input handler: digits only, max 12, auto-format display ────────
  const handleAadhaarInputChange = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 12);
    setAadhaarInput(digits);
    setAadhaarSaved(false);
    if (ocrVerification.status !== 'idle') setOcrVerification({ status: 'idle' });
  };


  // Display value with spaces: XXXX XXXX XXXX
  const aadhaarDisplay = aadhaarInput
    .replace(/(\d{4})(\d{1,4})?(\d{1,4})?/, (_m, a, b, c) =>
      [a, b, c].filter(Boolean).join(' ')
    );


  const handleSaveAadhaar = async () => {
    if (aadhaarInput.length !== 12) return;
    await updateUserData({ aadhaar: aadhaarInput, aadhaarVerified: false });
    persistToBackend({ aadhaar: aadhaarInput, aadhaarVerified: false });
    setAadhaarSaved(true);
    setTimeout(() => setAadhaarSaved(false), 2000);
  };


  // ── Profile image upload ───────────────────────────────────────────────────
  const handleProfileImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const data = { profileImage: reader.result as string };
        await updateUserData(data);
        persistToBackend(data);
      };
      reader.readAsDataURL(file);
    }
  };


  // ── Document upload + Aadhaar OCR ─────────────────────────────────────────
  const handleDocUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const docId = activeDocId;
    setActiveDocId('');


    if (!file || !docId) return;


    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result as string;


      // Mark doc uploaded immediately
      const updatedDocs = userData.documents.map((doc) =>
        doc.id === docId ? { ...doc, status: 'uploaded' as const, file: base64 } : doc
      );
      await updateUserData({ documents: updatedDocs });

      // Persist docs map to backend
      const docsForBackend: Record<string, string> = {};
      updatedDocs.forEach((d) => {
        if (d.status === 'uploaded' && d.file) {
          docsForBackend[d.id] = d.file as string;
        }
      });
      persistToBackend({ documents: docsForBackend });


      // Only run OCR for Aadhaar doc
      const isAadhaarDoc =
        docId.toLowerCase().includes('aadhaar') ||
        docId.toLowerCase().includes('aadhar');


      if (!isAadhaarDoc) return;


      setExpandedSection('documents');
      setOcrVerification({ status: 'loading' });


      try {
        const extractedNumber = await extractAadhaarWithGroq(base64);


        if (!extractedNumber) {
          setOcrVerification({
            status: 'error',
            message: localize(
              'Could not read Aadhaar number from image. Please upload a clearer photo.',
              'छवि से आधार नंबर नहीं पढ़ा जा सका। कृपया स्पष्ट फोटो अपलोड करें।',
              'प्रतिमेतून आधार क्रमांक वाचता आला नाही. कृपया स्पष्ट फोटो अपलोड करा.'
            ),
          });
          return;
        }


        // Cross-check against the input box value (typed by user)
        const storedAadhaar = aadhaarInput || (userData.aadhaar || '').replace(/\D/g, '');


        if (!storedAadhaar) {
          // No number entered yet — auto-fill from the card image
          await updateUserData({ aadhaar: extractedNumber, aadhaarVerified: true });
          persistToBackend({ aadhaar: extractedNumber, aadhaarVerified: true });
          setAadhaarInput(extractedNumber);
          setOcrVerification({
            status: 'matched',
            extractedNumber,
            message: localize(
              `Aadhaar number detected & saved: ${formatAadhaar(extractedNumber)}`,
              `आधार नंबर मिला और सहेजा गया: ${formatAadhaar(extractedNumber)}`,
              `आधार क्रमांक सापडला आणि जतन केला: ${formatAadhaar(extractedNumber)}`
            ),
          });
        } else if (extractedNumber === storedAadhaar) {
          await updateUserData({ aadhaarVerified: true });
          persistToBackend({ aadhaarVerified: true });
          setOcrVerification({
            status: 'matched',
            extractedNumber,
            message: localize(
              `Aadhaar verified! Number matches: ${formatAadhaar(extractedNumber)}`,
              `आधार सत्यापित! नंबर मेल खाता है: ${formatAadhaar(extractedNumber)}`,
              `आधार सत्यापित! क्रमांक जुळतो: ${formatAadhaar(extractedNumber)}`
            ),
          });
        } else {
          await updateUserData({ aadhaarVerified: false });
          persistToBackend({ aadhaarVerified: false });
          setOcrVerification({
            status: 'mismatch',
            extractedNumber,
            message: localize(
              `Mismatch. Entered: ${formatAadhaar(storedAadhaar)} · Found on card: ${formatAadhaar(extractedNumber)}`,
              `नंबर मेल नहीं खाता। दर्ज: ${formatAadhaar(storedAadhaar)} · मिला: ${formatAadhaar(extractedNumber)}`,
              `जुळत नाही. प्रविष्ट: ${formatAadhaar(storedAadhaar)} · कार्डवर: ${formatAadhaar(extractedNumber)}`
            ),
          });
        }
      } catch (err) {
        console.error('[Aadhaar OCR]', err);
        setOcrVerification({
          status: 'error',
          message: localize(
            `Verification failed: ${err instanceof Error ? err.message : 'Unknown error'}`,
            'सत्यापन में त्रुटि आई। दोबारा कोशिश करें।',
            'सत्यापन अयशस्वी. पुन्हा प्रयत्न करा.'
          ),
        });
      }
    };
    reader.readAsDataURL(file);
  };


  // ── Finance save ───────────────────────────────────────────────────────────
  const handleSaveFinance = async () => {
    updateUserData(financeForm);
    setShowFinanceModal(false);
    // Also persist to backend
    try {
      const { saveProfile } = await import('../../utils/api');
      await saveProfile(financeForm);
    } catch (err) {
      console.warn('Could not save financial info to backend:', err);
    }
  };


  // ── Sign out ───────────────────────────────────────────────────────────────
  const handleSignOut = () => {
    clearUserData();
    navigate('/login');
  };


  // ── Label helpers ──────────────────────────────────────────────────────────
  const getCropNames = () => {
    const cropMap: Record<string, { en: string; hi: string; mr: string }> = {
      wheat: { en: 'Wheat', hi: 'गेहूँ', mr: 'गहू' },
      rice: { en: 'Rice', hi: 'धान', mr: 'तांदूळ' },
      maize: { en: 'Maize', hi: 'मक्का', mr: 'मका' },
      soybean: { en: 'Soybean', hi: 'सोयाबीन', mr: 'सोयाबीन' },
      cotton: { en: 'Cotton', hi: 'कपास', mr: 'कापूस' },
      sugarcane: { en: 'Sugarcane', hi: 'गन्ना', mr: 'ऊस' },
      vegetables: { en: 'Vegetables', hi: 'सब्जियां', mr: 'भाज्या' },
      pulses: { en: 'Pulses', hi: 'दालें', mr: 'कडधान्ये' },
      fruits: { en: 'Fruits', hi: 'फल', mr: 'फळे' },
      spices: { en: 'Spices', hi: 'मसाले', mr: 'मसाले' },
    };
    return (
      userData.selectedCrops
        .map((c) => localize(cropMap[c]?.en, cropMap[c]?.hi, cropMap[c]?.mr) || c)
        .join(', ') || localize('Add', 'जोड़ें', 'जोडा')
    );
  };


  const getIrrigationNames = () => {
    const irrMap: Record<string, { en: string; hi: string; mr: string }> = {
      borewell: { en: 'Borewell', hi: 'बोरवेल', mr: 'बोअरवेल' },
      canal: { en: 'Canal', hi: 'नहर', mr: 'कालवा' },
      rainfed: { en: 'Rain-fed', hi: 'वर्षा आधारित', mr: 'पावसावर आधारित' },
      river: { en: 'River', hi: 'नदी', mr: 'नदी' },
      pond: { en: 'Pond', hi: 'तालाब', mr: 'तलाव' },
      drip: { en: 'Drip', hi: 'ड्रिप', mr: 'ठिबक' },
    };
    return (
      userData.irrigation
        .map((i) => localize(irrMap[i]?.en, irrMap[i]?.hi, irrMap[i]?.mr) || i)
        .join(', ') || localize('Add', 'जोड़ें', 'जोडा')
    );
  };


  const getOwnership = () => {
    const map: Record<string, { en: string; hi: string; mr: string }> = {
      owner: { en: 'Owner', hi: 'मालिक', mr: 'मालक' },
      tenant: { en: 'Tenant', hi: 'किरायेदार', mr: 'भाडेकरू' },
      sharecropper: { en: 'Sharecropper', hi: 'बटाईदार', mr: 'वाटेकरी' },
    };
    return localize(
      map[userData.landOwnership]?.en || 'Add',
      map[userData.landOwnership]?.hi || 'जोड़ें',
      map[userData.landOwnership]?.mr || 'जोडा'
    );
  };


  const getGender = () => {
    const map: Record<string, { en: string; hi: string; mr: string }> = {
      Male: { en: 'Male', hi: 'पुरुष', mr: 'पुरुष' },
      Female: { en: 'Female', hi: 'महिला', mr: 'स्त्री' },
      Other: { en: 'Other', hi: 'अन्य', mr: 'इतर' },
    };
    return localize(
      map[userData.gender]?.en || 'Add',
      map[userData.gender]?.hi || 'जोड़ें',
      map[userData.gender]?.mr || 'जोडा'
    );
  };


  // Get document name based on language
  const getDocName = (doc: { name: string; nameHi: string; nameMr?: string }) => {
    return localize(doc.name, doc.nameHi, doc.nameMr || doc.name);
  };


  // Get pending task text based on language
  const getPendingTaskText = (task: { en: string; hi: string; mr?: string }) => {
    return localize(task.en, task.hi, task.mr || task.en);
  };


  const inputClass =
    'w-full px-4 py-3 bg-[#F7F3EE] rounded-2xl border-2 border-transparent outline-none focus:border-[#F5A623] focus:bg-white transition-all text-[14px]';


  // ── OCR status colour map ──────────────────────────────────────────────────
  const ocrColors = {
    loading: { bg: 'bg-blue-50', border: 'border-blue-100', icon: 'bg-blue-100', text: 'text-blue-700', sub: 'text-blue-500' },
    matched: { bg: 'bg-green-50', border: 'border-green-200', icon: 'bg-green-100', text: 'text-green-700', sub: 'text-green-500' },
    mismatch: { bg: 'bg-red-50', border: 'border-red-200', icon: 'bg-red-100', text: 'text-red-700', sub: 'text-red-400' },
    error: { bg: 'bg-amber-50', border: 'border-amber-200', icon: 'bg-amber-100', text: 'text-amber-700', sub: 'text-amber-500' },
    idle: { bg: '', border: '', icon: '', text: '', sub: '' },
  };


  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#F7F3EE] pb-24">


      {/* Hidden file inputs */}
      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleProfileImageUpload} />
      <input ref={docInputRef} type="file" accept="image/*,.pdf" className="hidden" onChange={handleDocUpload} />


      {/* ── Header ── */}
      <div className="bg-gradient-to-b from-[#1A3C1A] to-[#2D6A2D] pt-10 pb-16 px-4">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <h2 className="text-white font-semibold text-[16px]">
            {localize('My Profile', 'मेरी प्रोफ़ाइल', 'माझे प्रोफाइल')}
          </h2>
          <div className="w-9" />
        </div>


        <div className="flex flex-col items-center">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative mb-3">
            <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center overflow-hidden border-4 border-[#F5A623] shadow-lg shadow-[#F5A623]/30">
              {userData.profileImage
                ? <img src={userData.profileImage} alt="Profile" className="w-full h-full object-cover" />
                : <span className="text-5xl">👤</span>}
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 w-8 h-8 bg-[#F5A623] rounded-full flex items-center justify-center shadow-md border-2 border-white"
            >
              <Camera className="w-4 h-4 text-white" />
            </button>
          </motion.div>


          <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="font-bold text-white text-[22px] mb-1">
            {userData.name || localize('Add Name', 'नाम जोड़ें', 'नाव जोडा')}
          </motion.h1>


          {(userData.state || userData.district) && (
            <div className="flex items-center gap-1 text-[#97BC62] text-[14px] mb-1">
              <span>📍</span>
              <span>{userData.district}{userData.district && userData.state ? ', ' : ''}{userData.state}</span>
            </div>
          )}


          <p className="text-[#C8D8C8] text-[12px] mb-2">
            {localize(
              `Member since ${userData.memberSince}`,
              `सदस्य: ${userData.memberSince}`,
              `सदस्य: ${userData.memberSince}`
            )}
          </p>


          {userData.aadhaarVerified && (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-1 bg-[#97BC62]/20 px-3 py-1 rounded-full">
              <Shield className="w-3 h-3 text-[#97BC62]" />
              <span className="text-[#97BC62] text-[11px] font-semibold">
                {localize('Aadhaar Verified', 'आधार सत्यापित', 'आधार सत्यापित')}
              </span>
            </motion.div>
          )}
        </div>
      </div>


      {/* ── Profile Completion Card ── */}
      <div className="px-4 -mt-10 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl p-5 shadow-lg border border-gray-100"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#F5A623]" />
              <h3 className="font-bold text-[15px] text-[#1C1C1E]">
                {localize('Profile Completion', 'प्रोफ़ाइल पूर्णता', 'प्रोफाइल पूर्णता')}
              </h3>
            </div>
            <motion.span
              key={animatedPercent}
              initial={{ scale: 1.3 }}
              animate={{ scale: 1 }}
              className={`text-[22px] font-bold ${animatedPercent >= 80 ? 'text-green-500' : animatedPercent >= 50 ? 'text-[#F5A623]' : 'text-red-500'}`}
            >
              {animatedPercent}%
            </motion.span>
          </div>


          <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden mb-4">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${animatedPercent}%` }}
              transition={{ duration: 1.5, ease: 'easeOut', delay: 0.5 }}
              className={`h-full rounded-full ${animatedPercent >= 80 ? 'bg-green-500' : animatedPercent >= 50 ? 'bg-[#F5A623]' : 'bg-red-500'}`}
            />
          </div>


          {pendingTasks.length > 0 && (
            <div className="mb-4">
              <p className="text-[12px] text-[#6B7280] mb-2 font-medium">
                {localize(
                  `${pendingTasks.length} items remaining:`,
                  `${pendingTasks.length} चीज़ें बाकी हैं:`,
                  `${pendingTasks.length} गोष्टी बाकी आहेत:`
                )}
              </p>
              <div className="space-y-1.5">
                {pendingTasks.slice(0, 3).map((task, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    className="flex items-center gap-2"
                  >
                    <div className="w-4 h-4 border-2 border-[#F5A623]/50 rounded flex-shrink-0" />
                    <span className="text-[12px] text-[#1C1C1E]">{getPendingTaskText(task)}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          )}


          <motion.button
            onClick={() => navigate('/onboarding/profile')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-[#F5A623] text-white py-3 rounded-2xl font-bold text-[14px] shadow-md shadow-[#F5A623]/20"
          >
            {localize('Complete Profile', 'प्रोफ़ाइल पूरा करें', 'प्रोफाइल पूर्ण करा')}
          </motion.button>
        </motion.div>
      </div>


      {/* ── Sections ── */}
      <div className="px-4 space-y-3">


        {/* Personal Information */}
        <motion.div
          ref={(el) => { sectionRefs.current['personal'] = el; }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden"
        >
          <button onClick={() => toggleSection('personal')} className="w-full px-5 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center">
                <User className="w-5 h-5 text-blue-500" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-[15px] text-[#1C1C1E]">
                  {localize('Personal Information', 'व्यक्तिगत जानकारी', 'वैयक्तिक माहिती')}
                </h3>
                <p className="text-[11px] text-[#6B7280]">
                  {userData.name || localize('Add info', 'जानकारी जोड़ें', 'माहिती जोडा')}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span
                role="button" tabIndex={0}
                onClick={(e) => { e.stopPropagation(); navigate('/onboarding/profile'); }}
                onKeyDown={(e) => e.key === 'Enter' && navigate('/onboarding/profile')}
                className="w-8 h-8 rounded-full bg-[#F5A623]/10 flex items-center justify-center cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5 text-[#F5A623]" />
              </span>
              {expandedSection === 'personal' ? <ChevronUp className="w-5 h-5 text-[#6B7280]" /> : <ChevronDown className="w-5 h-5 text-[#6B7280]" />}
            </div>
          </button>


          <AnimatePresence>
            {expandedSection === 'personal' && (
              <motion.div
                initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden"
              >
                <div className="px-5 pb-5 space-y-3 border-t border-gray-50 pt-3">
                  <div className="flex items-center gap-4 bg-[#F7F3EE] rounded-2xl p-4">
                    <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center overflow-hidden border-2 border-dashed border-[#F5A623]/40">
                      {userData.profileImage
                        ? <img src={userData.profileImage} alt="Profile" className="w-full h-full object-cover" />
                        : <Camera className="w-6 h-6 text-gray-300" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-[13px] font-semibold text-[#1C1C1E]">
                        {localize('Profile Photo', 'प्रोफ़ाइल फोटो', 'प्रोफाइल फोटो')}
                      </p>
                      <button onClick={() => fileInputRef.current?.click()} className="text-[12px] text-[#F5A623] font-medium mt-1 flex items-center gap-1">
                        <Upload className="w-3 h-3" />
                        {userData.profileImage
                          ? localize('Change', 'बदलें', 'बदला')
                          : localize('Upload', 'अपलोड करें', 'अपलोड करा')}
                      </button>
                    </div>
                  </div>


                  {[
                    { label: localize('Name', 'नाम', 'नाव'), value: userData.name },
                    { label: localize('Age', 'उम्र', 'वय'), value: userData.age ? `${userData.age} ${localize('years', 'वर्ष', 'वर्षे')}` : '' },
                    { label: localize('Gender', 'लिंग', 'लिंग'), value: getGender() },
                    { label: localize('Mobile', 'मोबाइल', 'मोबाइल'), value: userData.mobile ? `+91 ${userData.mobile}` : '' },
                    {
                      label: localize('Aadhaar', 'आधार', 'आधार'),
                      value: userData.aadhaar
                        ? `${formatAadhaar((userData.aadhaar || '').replace(/\D/g, ''))}${userData.aadhaarVerified ? ' ✅' : ''}`
                        : '',
                    },
                  ].map((info, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                      <span className="text-[13px] text-[#6B7280]">{info.label}</span>
                      <span className={`text-[13px] font-medium ${info.value ? 'text-[#1C1C1E]' : 'text-[#F5A623]'}`}>
                        {info.value || localize('+ Add', '+ जोड़ें', '+ जोडा')}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>


        {/* Farming Details */}
        <motion.div
          ref={(el) => { sectionRefs.current['farming'] = el; }}
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden"
        >
          <button onClick={() => toggleSection('farming')} className="w-full px-5 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-green-50 flex items-center justify-center">
                <Sprout className="w-5 h-5 text-green-500" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-[15px] text-[#1C1C1E]">
                  {localize('Farm Details', 'कृषि विवरण', 'शेती तपशील')}
                </h3>
                <p className="text-[11px] text-[#6B7280]">
                  {userData.landSize > 0 ? `${userData.landSize} ${userData.landUnit}` : localize('Add info', 'जानकारी जोड़ें', 'माहिती जोडा')}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span
                role="button" tabIndex={0}
                onClick={(e) => { e.stopPropagation(); navigate('/onboarding/farm-details'); }}
                onKeyDown={(e) => e.key === 'Enter' && navigate('/onboarding/farm-details')}
                className="w-8 h-8 rounded-full bg-[#F5A623]/10 flex items-center justify-center cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5 text-[#F5A623]" />
              </span>
              {expandedSection === 'farming' ? <ChevronUp className="w-5 h-5 text-[#6B7280]" /> : <ChevronDown className="w-5 h-5 text-[#6B7280]" />}
            </div>
          </button>


          <AnimatePresence>
            {expandedSection === 'farming' && (
              <motion.div
                initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden"
              >
                <div className="px-5 pb-5 space-y-3 border-t border-gray-50 pt-3">
                  {[
                    { label: localize('Land Size', 'भूमि आकार', 'जमिनीचा आकार'), value: userData.landSize > 0 ? `${userData.landSize} ${userData.landUnit}` : '' },
                    { label: localize('Ownership', 'स्वामित्व', 'मालकी'), value: getOwnership() },
                    { label: localize('Crops', 'फसलें', 'पिके'), value: getCropNames() },
                    { label: localize('Irrigation', 'सिंचाई', 'सिंचन'), value: getIrrigationNames() },
                    { label: localize('Seasons', 'मौसम', 'हंगाम'), value: userData.selectedSeasons.join(', ') || localize('Add', 'जोड़ें', 'जोडा') },
                  ].map((info, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                      <span className="text-[13px] text-[#6B7280]">{info.label}</span>
                      <span className={`text-[13px] font-medium text-right max-w-[55%] ${info.value && info.value !== localize('Add', 'जोड़ें', 'जोडा') ? 'text-[#1C1C1E]' : 'text-[#F5A623]'}`}>
                        {info.value || localize('+ Add', '+ जोड़ें', '+ जोडा')}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>


        {/* Financial Info */}
        <motion.div
          ref={(el) => { sectionRefs.current['economic'] = el; }}
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden"
        >
          <button onClick={() => toggleSection('economic')} className="w-full px-5 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center">
                <Wallet className="w-5 h-5 text-amber-500" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-[15px] text-[#1C1C1E]">
                  {localize('Financial Information', 'आर्थिक जानकारी', 'आर्थिक माहिती')}
                </h3>
                <p className="text-[11px] text-[#6B7280]">
                  {userData.annualIncome || localize('Add info', 'जानकारी जोड़ें', 'माहिती जोडा')}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span
                role="button" tabIndex={0}
                onClick={(e) => { e.stopPropagation(); setShowFinanceModal(true); }}
                onKeyDown={(e) => e.key === 'Enter' && setShowFinanceModal(true)}
                className="w-8 h-8 rounded-full bg-[#F5A623]/10 flex items-center justify-center cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5 text-[#F5A623]" />
              </span>
              {expandedSection === 'economic' ? <ChevronUp className="w-5 h-5 text-[#6B7280]" /> : <ChevronDown className="w-5 h-5 text-[#6B7280]" />}
            </div>
          </button>


          <AnimatePresence>
            {expandedSection === 'economic' && (
              <motion.div
                initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden"
              >
                <div className="px-5 pb-5 space-y-3 border-t border-gray-50 pt-3">
                  {[
                    { label: localize('Annual Income', 'वार्षिक आय', 'वार्षिक उत्पन्न'), value: userData.annualIncome },
                    { label: localize('Income Source', 'आय स्रोत', 'उत्पन्नाचा स्रोत'), value: userData.incomeSource },
                    { label: localize('Category', 'श्रेणी', 'श्रेणी'), value: userData.category },
                    { label: localize('Bank', 'बैंक', 'बँक'), value: userData.bankName },
                    { label: localize('Account No.', 'खाता संख्या', 'खाते क्र.'), value: userData.bankAccount ? `XXXXXX${userData.bankAccount.slice(-4)}` : '' },
                    { label: localize('IFSC Code', 'IFSC कोड', 'IFSC कोड'), value: userData.ifscCode },
                    { label: localize('PM-Kisan', 'PM-किसान', 'PM-किसान'), value: userData.pmKisanStatus },
                  ].map((info, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                      <span className="text-[13px] text-[#6B7280]">{info.label}</span>
                      <span className={`text-[13px] font-medium ${info.value ? 'text-[#1C1C1E]' : 'text-[#F5A623]'}`}>
                        {info.value || localize('+ Add', '+ जोड़ें', '+ जोडा')}
                      </span>
                    </div>
                  ))}
                  {!userData.annualIncome && (
                    <motion.button
                      onClick={() => setShowFinanceModal(true)}
                      whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      className="w-full bg-[#F5A623]/10 text-[#F5A623] py-3 rounded-2xl font-semibold text-[13px] flex items-center justify-center gap-2 mt-2"
                    >
                      <Plus className="w-4 h-4" />
                      {localize('Add Financial Information', 'आर्थिक जानकारी जोड़ें', 'आर्थिक माहिती जोडा')}
                    </motion.button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>


        {/* ── Documents ── */}
        <motion.div
          ref={(el) => { sectionRefs.current['documents'] = el; }}
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
          className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden"
        >
          <button onClick={() => toggleSection('documents')} className="w-full px-5 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-50 flex items-center justify-center">
                <FileText className="w-5 h-5 text-purple-500" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-[15px] text-[#1C1C1E]">
                  {localize('My Documents', 'मेरे दस्तावेज़', 'माझी कागदपत्रे')}
                </h3>
                <p className="text-[11px] text-[#6B7280]">
                  {userData.documents.filter((d) => d.status === 'uploaded').length}/{userData.documents.length}{' '}
                  {localize('uploaded', 'अपलोड', 'अपलोड')}
                </p>
              </div>
            </div>
            {expandedSection === 'documents' ? <ChevronUp className="w-5 h-5 text-[#6B7280]" /> : <ChevronDown className="w-5 h-5 text-[#6B7280]" />}
          </button>


          <AnimatePresence>
            {expandedSection === 'documents' && (
              <motion.div
                initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden"
              >
                <div className="px-5 pb-5 border-t border-gray-50 pt-4 space-y-4">


                  {/* ── Step 1: Aadhaar Number Input ── */}
                  <div className="bg-purple-50 rounded-2xl p-4 border border-purple-100">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-5 h-5 rounded-full bg-purple-500 text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">1</div>
                      <p className="text-[13px] font-bold text-purple-700">
                        {localize('Enter Aadhaar Number', 'आधार नंबर दर्ज करें', 'आधार क्रमांक प्रविष्ट करा')}
                      </p>
                      {userData.aadhaarVerified && (
                        <span className="ml-auto flex items-center gap-1 bg-green-100 text-green-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
                          <Check className="w-2.5 h-2.5" />
                          {localize('Verified', 'सत्यापित', 'सत्यापित')}
                        </span>
                      )}
                    </div>


                    <p className="text-[11px] text-purple-400 mb-3 ml-7">
                      {localize(
                        'Type your 12-digit number here first, then upload the card photo below.',
                        'पहले यहाँ 12 अंकों का नंबर डालें, फिर नीचे कार्ड फोटो अपलोड करें।',
                        'प्रथम येथे 12 अंकी क्रमांक टाइप करा, नंतर खाली कार्ड फोटो अपलोड करा.'
                      )}
                    </p>


                    <div className="flex gap-2">
                      <div className="flex-1 relative">
                        <input
                          type="tel"
                          inputMode="numeric"
                          maxLength={14}
                          value={aadhaarDisplay}
                          onChange={(e) => handleAadhaarInputChange(e.target.value)}
                          placeholder="XXXX XXXX XXXX"
                          className={`w-full px-4 py-3 rounded-2xl border-2 outline-none text-[15px] font-mono tracking-widest transition-all ${aadhaarInput.length === 12
                            ? userData.aadhaarVerified
                              ? 'bg-green-50 border-green-300 text-green-700'
                              : 'bg-white border-[#F5A623] text-[#1C1C1E]'
                            : 'bg-white border-gray-200 text-[#1C1C1E] focus:border-purple-400'
                            }`}
                        />
                        {/* digit counter */}
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 font-medium pointer-events-none">
                          {aadhaarInput.length}/12
                        </span>
                      </div>


                      {/* Save button appears only when 12 digits are filled and not yet verified */}
                      <AnimatePresence>
                        {aadhaarInput.length === 12 && !userData.aadhaarVerified && (
                          <motion.button
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            onClick={handleSaveAadhaar}
                            whileTap={{ scale: 0.95 }}
                            className={`px-4 py-3 rounded-2xl font-bold text-[13px] flex items-center gap-1 transition-all whitespace-nowrap ${aadhaarSaved
                              ? 'bg-green-500 text-white'
                              : 'bg-purple-500 text-white shadow-md shadow-purple-200'
                              }`}
                          >
                            {aadhaarSaved
                              ? <><Check className="w-4 h-4" />{localize('Saved', 'सहेजा', 'जतन केले')}</>
                              : localize('Save', 'सहेजें', 'जतन करा')}
                          </motion.button>
                        )}
                      </AnimatePresence>
                    </div>


                    {/* Helper hint below input */}
                    {aadhaarInput.length > 0 && aadhaarInput.length < 12 && (
                      <p className="text-[11px] text-amber-500 mt-2 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {localize(
                          `${12 - aadhaarInput.length} more digit${12 - aadhaarInput.length > 1 ? 's' : ''} needed`,
                          `${12 - aadhaarInput.length} अंक और चाहिए`,
                          `${12 - aadhaarInput.length} अंक अजून हवे`
                        )}
                      </p>
                    )}
                    {userData.aadhaar && aadhaarInput.length === 12 && userData.aadhaarVerified && (
                      <p className="text-[11px] text-green-600 mt-2 flex items-center gap-1">
                        <Shield className="w-3 h-3" />
                        {localize(
                          'Aadhaar number is AI-verified via card image.',
                          'आधार नंबर AI द्वारा सत्यापित है।',
                          'आधार क्रमांक AI द्वारे कार्ड प्रतिमेद्वारे सत्यापित आहे.'
                        )}
                      </p>
                    )}
                    {userData.aadhaar && aadhaarInput.length === 12 && !userData.aadhaarVerified && !aadhaarSaved && (
                      <p className="text-[11px] text-purple-400 mt-2">
                        {localize(
                          '👇 Now upload your Aadhaar card image below to verify.',
                          '👇 नीचे आधार कार्ड की फोटो अपलोड करें।',
                          '👇 आता खाली तुमचा आधार कार्ड फोटो अपलोड करा.'
                        )}
                      </p>
                    )}
                  </div>


                  {/* ── Step 2 label ── */}
                  <div className="flex items-center gap-2 px-1">
                    <div className="w-5 h-5 rounded-full bg-purple-500 text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">2</div>
                    <p className="text-[12px] font-semibold text-[#6B7280]">
                      {localize('Upload Documents', 'दस्तावेज़ अपलोड करें', 'कागदपत्रे अपलोड करा')}
                    </p>
                  </div>


                  {/* ── Document grid ── */}
                  <div className="grid grid-cols-2 gap-3">
                    {userData.documents.map((doc) => {
                      const isAadhaarDoc =
                        doc.id.toLowerCase().includes('aadhaar') ||
                        doc.id.toLowerCase().includes('aadhar');


                      return (
                        <motion.button
                          key={doc.id}
                          onClick={() => {
                            setActiveDocId(doc.id);
                            if (isAadhaarDoc) setOcrVerification({ status: 'idle' });
                            docInputRef.current?.click();
                          }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.97 }}
                          className={`rounded-2xl p-4 text-center border-2 transition-all relative ${doc.status === 'uploaded'
                            ? 'bg-green-50 border-green-200'
                            : 'bg-gray-50 border-dashed border-gray-200 hover:border-[#F5A623]'
                            }`}
                        >
                          {isAadhaarDoc && userData.aadhaarVerified && (
                            <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
                              <Check className="w-2.5 h-2.5 text-white" />
                            </div>
                          )}
                          <div className="text-3xl mb-2">{doc.status === 'uploaded' ? '✅' : '📄'}</div>
                          <p className="text-[12px] text-[#1C1C1E] font-semibold">{getDocName(doc)}</p>
                          <p className={`text-[10px] mt-1 font-medium ${doc.status === 'uploaded' ? 'text-green-600' : 'text-[#F5A623]'}`}>
                            {doc.status === 'uploaded'
                              ? localize('Uploaded ✓', 'अपलोड ✓', 'अपलोड ✓')
                              : localize('+ Upload', '+ अपलोड करें', '+ अपलोड करा')}
                          </p>
                          {isAadhaarDoc && (
                            <p className="text-[9px] text-purple-400 mt-1 font-medium">
                              {localize('🔍 AI Verify', '🔍 AI सत्यापन', '🔍 AI सत्यापन')}
                            </p>
                          )}
                        </motion.button>
                      );
                    })}
                  </div>


                  {/* ── OCR Verification Banner ── */}
                  <AnimatePresence>
                    {ocrVerification.status !== 'idle' && (
                      <motion.div
                        initial={{ opacity: 0, y: -6, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -6, scale: 0.98 }}
                        transition={{ duration: 0.25 }}
                        className={`rounded-2xl p-4 border ${ocrColors[ocrVerification.status].bg} ${ocrColors[ocrVerification.status].border}`}
                      >
                        {ocrVerification.status === 'loading' ? (
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                              <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                            </div>
                            <div>
                              <p className="text-[13px] font-bold text-blue-700">
                                {localize('Scanning Aadhaar card…', 'आधार कार्ड स्कैन हो रहा है…', 'आधार कार्ड स्कॅन होत आहे…')}
                              </p>
                              <p className="text-[11px] text-blue-500 mt-0.5">
                                {localize('Extracting number via Groq AI', 'Groq AI से नंबर पढ़ा जा रहा है', 'Groq AI द्वारे क्रमांक वाचत आहे')}
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-start gap-3">
                            <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${ocrColors[ocrVerification.status].icon}`}>
                              {ocrVerification.status === 'matched' && <Check className="w-4 h-4 text-green-600" />}
                              {ocrVerification.status === 'mismatch' && <X className="w-4 h-4 text-red-500" />}
                              {ocrVerification.status === 'error' && <AlertCircle className="w-4 h-4 text-amber-600" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`text-[13px] font-bold ${ocrColors[ocrVerification.status].text}`}>
                                {ocrVerification.status === 'matched' && localize('Aadhaar Verified ✅', 'आधार सत्यापित ✅', 'आधार सत्यापित ✅')}
                                {ocrVerification.status === 'mismatch' && localize('Number Mismatch ❌', 'नंबर मेल नहीं खाता ❌', 'क्रमांक जुळत नाही ❌')}
                                {ocrVerification.status === 'error' && localize('Verification Failed ⚠️', 'सत्यापन विफल ⚠️', 'सत्यापन अयशस्वी ⚠️')}
                              </p>
                              <p className={`text-[11px] mt-0.5 break-words ${ocrColors[ocrVerification.status].sub}`}>
                                {ocrVerification.message}
                              </p>
                              {(ocrVerification.status === 'mismatch' || ocrVerification.status === 'error') && (
                                <button
                                  onClick={() => {
                                    const aadhaarDoc = userData.documents.find(
                                      (d) => d.id.toLowerCase().includes('aadhaar') || d.id.toLowerCase().includes('aadhar')
                                    );
                                    if (aadhaarDoc) {
                                      setActiveDocId(aadhaarDoc.id);
                                      setOcrVerification({ status: 'idle' });
                                      docInputRef.current?.click();
                                    }
                                  }}
                                  className="mt-2 text-[11px] font-semibold text-[#F5A623] underline underline-offset-2"
                                >
                                  {localize('Re-upload image', 'दोबारा अपलोड करें', 'पुन्हा अपलोड करा')}
                                </button>
                              )}
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>


                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>


        {/* Language */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden"
        >
          <button onClick={() => setShowLanguageModal(true)} className="w-full px-5 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center">
                <Globe className="w-5 h-5 text-indigo-500" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-[15px] text-[#1C1C1E]">
                  {localize('Language', 'भाषा', 'भाषा')}
                </h3>
                <p className="text-[11px] text-[#6B7280]">
                  {localize('English', 'हिंदी', 'मराठी')}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-[#F7F3EE] px-3 py-1.5 rounded-full">
              <span className="text-[12px] font-semibold text-[#1C1C1E]">
                {localize('EN', 'हिं', 'मरा')}
              </span>
            </div>
          </button>
        </motion.div>


        {/* Sign Out */}
        <motion.button
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}
          whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
          onClick={() => setShowSignOutModal(true)}
          className="w-full bg-white rounded-3xl shadow-sm border border-gray-100 px-5 py-4 flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-2xl bg-red-50 flex items-center justify-center">
            <LogOut className="w-5 h-5 text-red-500" />
          </div>
          <span className="font-semibold text-[15px] text-red-500">
            {localize('Sign Out', 'साइन आउट', 'साइन आउट')}
          </span>
        </motion.button>
      </div>


      {/* ── Finance Modal ── */}
      <AnimatePresence>
        {showFinanceModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-end"
            onClick={() => setShowFinanceModal(false)}
          >
            <motion.div
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full bg-white rounded-t-3xl flex flex-col"
              style={{ maxHeight: '90vh' }}
            >
              <div className="flex-shrink-0 px-6 pt-6 pb-4 border-b border-gray-100">
                <div className="flex items-center justify-between mb-1">
                  <h2 className="text-[18px] font-bold text-[#1C1C1E]">
                    {localize('Financial Information', 'आर्थिक जानकारी', 'आर्थिक माहिती')}
                  </h2>
                  <button onClick={() => setShowFinanceModal(false)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                    <X className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
                <p className="text-[12px] text-[#6B7280]">
                  {localize(
                    'This info is needed for matching schemes',
                    'सही योजनाओं के लिए यह जानकारी ज़रूरी है',
                    'योग्य योजनांसाठी ही माहिती आवश्यक आहे'
                  )}
                </p>
              </div>


              <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
                <div>
                  <label className="text-[12px] font-semibold text-[#6B7280] uppercase tracking-wider mb-2 block">
                    {localize('Annual Income', 'वार्षिक आय', 'वार्षिक उत्पन्न')}
                  </label>
                  <select value={financeForm.annualIncome} onChange={(e) => setFinanceForm({ ...financeForm, annualIncome: e.target.value })} className={inputClass}>
                    <option value="">{localize('Select', 'चुनें', 'निवडा')}</option>
                    <option value="Below ₹50,000">{localize('Below ₹50,000', '₹50,000 से कम', '₹50,000 पेक्षा कमी')}</option>
                    <option value="₹50,000 - ₹1,00,000">₹50,000 - ₹1,00,000</option>
                    <option value="₹1,00,000 - ₹2,50,000">₹1,00,000 - ₹2,50,000</option>
                    <option value="₹2,50,000 - ₹5,00,000">₹2,50,000 - ₹5,00,000</option>
                    <option value="Above ₹5,00,000">{localize('Above ₹5,00,000', '₹5,00,000 से अधिक', '₹5,00,000 पेक्षा जास्त')}</option>
                  </select>
                </div>


                <div>
                  <label className="text-[12px] font-semibold text-[#6B7280] uppercase tracking-wider mb-2 block">
                    {localize('Income Source', 'आय का स्रोत', 'उत्पन्नाचा स्रोत')}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { en: 'Farming', hi: 'खेती', mr: 'शेती' },
                      { en: 'Labour', hi: 'मजदूरी', mr: 'मजुरी' },
                      { en: 'Business', hi: 'व्यापार', mr: 'व्यवसाय' },
                      { en: 'Govt Job', hi: 'सरकारी नौकरी', mr: 'सरकारी नोकरी' },
                      { en: 'Other', hi: 'अन्य', mr: 'इतर' },
                    ].map((src) => (
                      <button
                        key={src.en}
                        onClick={() => setFinanceForm({ ...financeForm, incomeSource: src.en })}
                        className={`px-4 py-2 rounded-full text-[12px] font-medium border-2 transition-all ${financeForm.incomeSource === src.en ? 'bg-[#F5A623] text-white border-[#F5A623]' : 'bg-[#F7F3EE] text-[#6B7280] border-transparent'}`}
                      >
                        {localize(src.en, src.hi, src.mr)}
                      </button>
                    ))}
                  </div>
                </div>


                <div>
                  <label className="text-[12px] font-semibold text-[#6B7280] uppercase tracking-wider mb-2 block">
                    {localize('Category', 'श्रेणी', 'श्रेणी')}
                  </label>
                  <div className="flex gap-2">
                    {[
                      { en: 'BPL', hi: 'BPL', mr: 'BPL' },
                      { en: 'APL', hi: 'APL', mr: 'APL' },
                      { en: 'General', hi: 'सामान्य', mr: 'सामान्य' },
                    ].map((cat) => (
                      <button
                        key={cat.en}
                        onClick={() => setFinanceForm({ ...financeForm, category: cat.en })}
                        className={`flex-1 py-3 rounded-2xl text-[13px] font-semibold border-2 transition-all ${financeForm.category === cat.en ? 'bg-[#F5A623] text-white border-[#F5A623]' : 'bg-[#F7F3EE] text-[#6B7280] border-transparent'}`}
                      >
                        {localize(cat.en, cat.hi, cat.mr)}
                      </button>
                    ))}
                  </div>
                </div>


                <div>
                  <label className="text-[12px] font-semibold text-[#6B7280] uppercase tracking-wider mb-2 block">
                    {localize('Bank Name', 'बैंक का नाम', 'बँकेचे नाव')}
                  </label>
                  <input
                    type="text" value={financeForm.bankName}
                    onChange={(e) => setFinanceForm({ ...financeForm, bankName: e.target.value })}
                    placeholder={localize('e.g. State Bank of India', 'जैसे: State Bank of India', 'उदा. State Bank of India')}
                    className={inputClass}
                  />
                </div>


                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[12px] font-semibold text-[#6B7280] uppercase tracking-wider mb-2 block">
                      {localize('Account No.', 'खाता संख्या', 'खाते क्र.')}
                    </label>
                    <input type="text" value={financeForm.bankAccount} onChange={(e) => setFinanceForm({ ...financeForm, bankAccount: e.target.value })} placeholder="XXXXXXXXXXXX" className={inputClass} />
                  </div>
                  <div>
                    <label className="text-[12px] font-semibold text-[#6B7280] uppercase tracking-wider mb-2 block">IFSC</label>
                    <input type="text" value={financeForm.ifscCode} onChange={(e) => setFinanceForm({ ...financeForm, ifscCode: e.target.value.toUpperCase() })} placeholder="SBIN0001234" className={inputClass} />
                  </div>
                </div>


                <div>
                  <label className="text-[12px] font-semibold text-[#6B7280] uppercase tracking-wider mb-2 block">
                    {localize('PM-Kisan Status', 'PM-किसान स्थिति', 'PM-किसान स्थिती')}
                  </label>
                  <div className="flex gap-2">
                    {[
                      { en: 'Active', hi: 'सक्रिय', mr: 'सक्रिय' },
                      { en: 'Inactive', hi: 'निष्क्रिय', mr: 'निष्क्रिय' },
                      { en: 'Not Enrolled', hi: 'नामांकित नहीं', mr: 'नोंदणी नाही' },
                    ].map((status) => (
                      <button
                        key={status.en}
                        onClick={() => setFinanceForm({ ...financeForm, pmKisanStatus: status.en })}
                        className={`flex-1 py-2.5 rounded-2xl text-[12px] font-semibold border-2 transition-all ${financeForm.pmKisanStatus === status.en ? 'bg-[#F5A623] text-white border-[#F5A623]' : 'bg-[#F7F3EE] text-[#6B7280] border-transparent'}`}
                      >
                        {localize(status.en, status.hi, status.mr)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>


              <div className="flex-shrink-0 px-6 py-4 border-t border-gray-100 bg-white">
                <motion.button
                  onClick={handleSaveFinance} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  className="w-full bg-[#F5A623] text-white py-4 rounded-2xl font-bold text-[15px] shadow-lg shadow-[#F5A623]/30 flex items-center justify-center gap-2"
                >
                  <Check className="w-5 h-5" />
                  {localize('Save', 'सहेजें', 'जतन करा')}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>


      {/* ── Language Modal ── */}
      <AnimatePresence>
        {showLanguageModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-6"
            onClick={() => setShowLanguageModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm bg-white rounded-3xl p-6"
            >
              <h3 className="text-[18px] font-bold text-[#1C1C1E] text-center mb-5">
                {localize('Select Language', 'भाषा चुनें', 'भाषा निवडा')}
              </h3>
              <div className="space-y-3">
                {[
                  { code: 'en' as const, name: 'English' },
                  { code: 'hi' as const, name: 'हिंदी' },
                  { code: 'mr' as const, name: 'मराठी' },
                ].map((lang) => (
                  <motion.button
                    key={lang.code}
                    onClick={() => { setLanguage(lang.code); setShowLanguageModal(false); }}
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    className={`w-full py-4 rounded-2xl font-semibold text-[16px] transition-all border-2 flex items-center justify-center gap-2 ${language === lang.code ? 'bg-[#F5A623] text-white border-[#F5A623]' : 'bg-[#F7F3EE] text-[#1C1C1E] border-transparent'
                      }`}
                  >
                    {lang.name}
                    {language === lang.code && <Check className="w-5 h-5" />}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>


      {/* ── Sign Out Modal ── */}
      <AnimatePresence>
        {showSignOutModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-6"
            onClick={() => setShowSignOutModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm bg-white rounded-3xl p-6"
            >
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <LogOut className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-[18px] font-bold text-[#1C1C1E] text-center mb-2">
                {localize('Sign Out?', 'साइन आउट करें?', 'साइन आउट करायचे?')}
              </h3>
              <p className="text-[13px] text-[#6B7280] text-center mb-6">
                {localize(
                  'Are you sure you want to sign out?',
                  'क्या आप वाकई साइन आउट करना चाहते हैं?',
                  'तुम्हाला खात्री आहे की तुम्ही साइन आउट करू इच्छिता?'
                )}
              </p>
              <div className="flex gap-3">
                <motion.button
                  onClick={() => setShowSignOutModal(false)} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  className="flex-1 py-3.5 rounded-2xl font-semibold text-[14px] bg-[#F7F3EE] text-[#1C1C1E]"
                >
                  {localize('Cancel', 'रद्द करें', 'रद्द करा')}
                </motion.button>
                <motion.button
                  onClick={handleSignOut} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  className="flex-1 py-3.5 rounded-2xl font-semibold text-[14px] bg-red-500 text-white shadow-lg shadow-red-500/30"
                >
                  {localize('Sign Out', 'साइन आउट', 'साइन आउट')}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>


      <BottomNav />
    </div>
  );
}