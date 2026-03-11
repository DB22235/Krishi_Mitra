
// // src/screens/SchemeDiscovery.tsx
// import { useState, useMemo } from 'react';
// import { ArrowLeft, Search, Mic, Filter, Sparkles } from 'lucide-react';
// import { useNavigate } from 'react-router';
// import { motion } from 'motion/react';
// import { BottomNav } from '../components/BottomNav';
// import { SchemeCard } from '../components/SchemeCard';
// import { useLanguage } from '../../context/LanguageContext';
// import { useUser } from '../../context/UserContext';


// const filterOptions = [
//   { en: 'All', hi: 'सभी' },
//   { en: 'Central Govt', hi: 'केंद्र सरकार' },
//   { en: 'State Govt', hi: 'राज्य सरकार' },
//   { en: 'Subsidy', hi: 'सब्सिडी' },
//   { en: 'Loan', hi: 'ऋण' },
//   { en: 'Insurance', hi: 'बीमा' },
//   { en: 'Pension', hi: 'पेंशन' },
//   { en: 'Training', hi: 'प्रशिक्षण' },
//   { en: 'Equipment', hi: 'उपकरण' },
// ];


// const allSchemes = [
//   {
//     id: 'pm-kisan',
//     name: 'PM-Kisan Samman Nidhi',
//     nameHi: 'प्रधानमंत्री किसान सम्मान निधि',
//     amount: '₹6,000/year',
//     amountHi: '₹6,000/वर्ष',
//     type: 'Central Govt',
//     deadline: 'March 31',
//     deadlineHi: '31 मार्च',
//     docsRequired: 3,
//     eligible: true,
//     logo: '🏛️',
//   },
//   {
//     id: 'pmfby',
//     name: 'PM Fasal Bima Yojana',
//     nameHi: 'प्रधानमंत्री फसल बीमा योजना',
//     amount: 'Up to ₹2L',
//     amountHi: '₹2 लाख तक',
//     type: 'Central Govt',
//     deadline: 'Feb 28',
//     deadlineHi: '28 फरवरी',
//     docsRequired: 4,
//     eligible: true,
//     logo: '🌾',
//   },
//   {
//     id: 'soil-health',
//     name: 'Soil Health Card Scheme',
//     nameHi: 'मृदा स्वास्थ्य कार्ड योजना',
//     amount: 'Free Testing',
//     amountHi: 'मुफ़्त जांच',
//     type: 'State Govt',
//     deadline: 'March 15',
//     deadlineHi: '15 मार्च',
//     docsRequired: 2,
//     eligible: true,
//     logo: '🧪',
//   },
//   {
//     id: 'kcc',
//     name: 'Kisan Credit Card',
//     nameHi: 'किसान क्रेडिट कार्ड',
//     amount: 'Up to ₹3L',
//     amountHi: '₹3 लाख तक',
//     type: 'Central Govt',
//     deadline: 'Ongoing',
//     deadlineHi: 'चालू',
//     docsRequired: 5,
//     eligible: true,
//     logo: '💳',
//   },
//   {
//     id: 'pm-kusum',
//     name: 'PM-KUSUM Solar Pump',
//     nameHi: 'प्रधानमंत्री कुसुम योजना',
//     amount: '90% subsidy',
//     amountHi: '90% सब्सिडी',
//     type: 'Central Govt',
//     deadline: 'April 15',
//     deadlineHi: '15 अप्रैल',
//     docsRequired: 4,
//     eligible: true,
//     logo: '☀️',
//   },
// ];


// export function SchemeDiscovery() {
//   const navigate = useNavigate();
//   const { language } = useLanguage();
//   const { userData, getProfileCompletion } = useUser();
//   const isHindi = language === 'hi';


//   const [activeFilter, setActiveFilter] = useState<'All' | string>('All');
//   const [searchQuery, setSearchQuery] = useState('');


//   // Simple estimate of matched schemes based on profile (same idea as Dashboard)
//   const matchedSchemesCount = useMemo(() => {
//     let count = 5;
//     if (userData.landOwnership) count += 3;
//     if (userData.selectedCrops.length) count += userData.selectedCrops.length;
//     if (userData.irrigation.length) count += 2;
//     if (userData.annualIncome) count += 4;
//     return Math.min(count, 25);
//   }, [userData]);


//   const profileCompletion = getProfileCompletion();


//   // Filter + search
//   const filteredSchemes = useMemo(() => {
//     return allSchemes.filter((scheme) => {
//       // Filter by type
//       if (activeFilter !== 'All' && scheme.type !== activeFilter) return false;


//       // Search by name (both languages)
//       if (!searchQuery.trim()) return true;
//       const q = searchQuery.toLowerCase();
//       return (
//         scheme.name.toLowerCase().includes(q) ||
//         scheme.nameHi.toLowerCase().includes(q)
//       );
//     });
//   }, [activeFilter, searchQuery]);


//   return (
//     <div className="min-h-screen bg-[#F7F3EE] pb-24">
//       {/* Top Bar - match profile/dashboard style */}
//       <div className="bg-gradient-to-b from-[#1A3C1A] to-[#2D6A2D] pt-10 pb-4 px-4 sticky top-0 z-20">
//         <div className="flex items-center justify-between mb-4">
//           <button
//             onClick={() => navigate('/dashboard')}
//             className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
//           >
//             <ArrowLeft className="w-5 h-5 text-white" />
//           </button>
//           <h1 className="font-bold text-white text-[16px]">
//             {isHindi ? 'योजना खोजें' : 'Find Schemes'}
//           </h1>
//           <button className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10">
//             <Filter className="w-5 h-5 text-white" />
//           </button>
//         </div>


//         {/* Search Bar */}
//         <div className="bg-white rounded-2xl p-3 shadow-sm border border-[#F5A623]/60">
//           <div className="flex items-center gap-3">
//             <Search className="w-5 h-5 text-[#6B7280] flex-shrink-0" />
//             <input
//               type="text"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               placeholder={
//                 isHindi
//                   ? 'योजना का नाम, फसल, या ज़रूरत लिखें...'
//                   : 'Type scheme name, crop, or need...'
//               }
//               className="flex-1 bg-transparent border-none outline-none text-[14px] placeholder:text-[#9CA3AF] text-[#111827]"
//             />
//             <button className="w-8 h-8 rounded-full bg-[#F5A623]/10 flex items-center justify-center">
//               <Mic className="w-4 h-4 text-[#F5A623]" />
//             </button>
//           </div>
//         </div>
//       </div>


//       <div className="px-4 pt-3">
//         {/* Filter Chips */}
//         <div className="flex gap-2 overflow-x-auto pb-3 mb-2 hide-scrollbar">
//           {filterOptions.map((filter) => (
//             <button
//               key={filter.en}
//               onClick={() => setActiveFilter(filter.en)}
//               className={`px-4 py-2 rounded-full text-[12px] font-semibold whitespace-nowrap transition-all border ${
//                 activeFilter === filter.en
//                   ? 'bg-[#F5A623] text-white border-[#F5A623] shadow-sm shadow-[#F5A623]/30'
//                   : 'bg-white text-[#1C1C1E] border-gray-200'
//               }`}
//             >
//               {isHindi ? filter.hi : filter.en}
//             </button>
//           ))}
//         </div>


//         {/* Eligibility / Match Banner (similar to dashboard) */}
//         <motion.div
//           initial={{ opacity: 0, y: 10 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.2 }}
//           className="bg-white rounded-3xl p-4 mb-4 shadow-sm border border-gray-100 flex items-start gap-3"
//         >
//           <div className="w-10 h-10 rounded-2xl bg-[#F5A623]/10 flex items-center justify-center flex-shrink-0">
//             <Sparkles className="w-5 h-5 text-[#F5A623]" />
//           </div>
//           <div className="flex-1">
//             <p className="text-[14px] font-semibold text-[#1C1C1E] mb-1">
//               {isHindi
//                 ? `आपकी प्रोफ़ाइल के अनुसार ${matchedSchemesCount} योजनाएं`
//                 : `${matchedSchemesCount} schemes match your profile`}
//             </p>
//             <p className="text-[12px] text-[#6B7280]">
//               {isHindi
//                 ? `प्रोफ़ाइल ${profileCompletion}% पूरी • अधिक योजनाओं के लिए प्रोफ़ाइल अपडेट करें`
//                 : `Profile ${profileCompletion}% complete • Complete profile to unlock more schemes`}
//             </p>
//           </div>
//           <button
//             onClick={() => navigate('/onboarding/profile')}
//             className="ml-2 text-[11px] font-semibold text-[#F5A623] underline"
//           >
//             {isHindi ? 'प्रोफ़ाइल' : 'Profile'}
//           </button>
//         </motion.div>


//         {/* Scheme List */}
//         <div className="space-y-3 mb-4">
//           {filteredSchemes.length === 0 ? (
//             <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-center">
//               <p className="text-[14px] text-[#1C1C1E] font-semibold mb-1">
//                 {isHindi ? 'कोई योजना नहीं मिली' : 'No schemes found'}
//               </p>
//               <p className="text-[12px] text-[#6B7280]">
//                 {isHindi
//                   ? 'फिल्टर बदलकर फिर से प्रयास करें'
//                   : 'Try changing filters or search query'}
//               </p>
//             </div>
//           ) : (
//             filteredSchemes.map((scheme) => (
//               <SchemeCard
//                 key={scheme.id}
//                 {...scheme}
//                 // if your SchemeCard supports language, you can pass isHindi or language
//               />
//             ))
//           )}
//         </div>
//       </div>


//       <BottomNav />


//       {/* Hide scrollbars for filter row */}
//       <style>{`
//         .hide-scrollbar::-webkit-scrollbar {
//           display: none;
//         }
//         .hide-scrollbar {
//           -ms-overflow-style: none;
//           scrollbar-width: none;
//         }
//       `}</style>
//     </div>
//   );
// }


// src/screens/SchemeDiscovery.tsx
import { useState, useMemo } from 'react';
import { ArrowLeft, Search, Mic, Filter, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { BottomNav } from '../components/BottomNav';
import { SchemeCard } from '../components/SchemeCard';
import { useLanguage } from '../../context/LanguageContext';
import { useUser } from '../../context/UserContext';


const filterOptions = [
  { en: 'All', hi: 'सभी', mr: 'सर्व' },
  { en: 'Central Govt', hi: 'केंद्र सरकार', mr: 'केंद्र सरकार' },
  { en: 'State Govt', hi: 'राज्य सरकार', mr: 'राज्य सरकार' },
  { en: 'Subsidy', hi: 'सब्सिडी', mr: 'अनुदान' },
  { en: 'Loan', hi: 'ऋण', mr: 'कर्ज' },
  { en: 'Insurance', hi: 'बीमा', mr: 'विमा' },
  { en: 'Pension', hi: 'पेंशन', mr: 'निवृत्तीवेतन' },
  { en: 'Training', hi: 'प्रशिक्षण', mr: 'प्रशिक्षण' },
  { en: 'Equipment', hi: 'उपकरण', mr: 'उपकरणे' },
];


const allSchemes = [
  {
    id: 'pm-kisan',
    name: 'PM-Kisan Samman Nidhi',
    nameHi: 'प्रधानमंत्री किसान सम्मान निधि',
    nameMr: 'प्रधानमंत्री किसान सन्मान निधी',
    amount: '₹6,000/year',
    amountHi: '₹6,000/वर्ष',
    amountMr: '₹6,000/वर्ष',
    type: 'Central Govt',
    deadline: 'March 31',
    deadlineHi: '31 मार्च',
    deadlineMr: '31 मार्च',
    docsRequired: 3,
    eligible: true,
    logo: '🏛️',
  },
  {
    id: 'pmfby',
    name: 'PM Fasal Bima Yojana',
    nameHi: 'प्रधानमंत्री फसल बीमा योजना',
    nameMr: 'प्रधानमंत्री पीक विमा योजना',
    amount: 'Up to ₹2L',
    amountHi: '₹2 लाख तक',
    amountMr: '₹2 लाखांपर्यंत',
    type: 'Central Govt',
    deadline: 'Feb 28',
    deadlineHi: '28 फरवरी',
    deadlineMr: '28 फेब्रुवारी',
    docsRequired: 4,
    eligible: true,
    logo: '🌾',
  },
  {
    id: 'soil-health',
    name: 'Soil Health Card Scheme',
    nameHi: 'मृदा स्वास्थ्य कार्ड योजना',
    nameMr: 'मृदा आरोग्य कार्ड योजना',
    amount: 'Free Testing',
    amountHi: 'मुफ़्त जांच',
    amountMr: 'मोफत तपासणी',
    type: 'State Govt',
    deadline: 'March 15',
    deadlineHi: '15 मार्च',
    deadlineMr: '15 मार्च',
    docsRequired: 2,
    eligible: true,
    logo: '🧪',
  },
  {
    id: 'kcc',
    name: 'Kisan Credit Card',
    nameHi: 'किसान क्रेडिट कार्ड',
    nameMr: 'किसान क्रेडिट कार्ड',
    amount: 'Up to ₹3L',
    amountHi: '₹3 लाख तक',
    amountMr: '₹3 लाखांपर्यंत',
    type: 'Central Govt',
    deadline: 'Ongoing',
    deadlineHi: 'चालू',
    deadlineMr: 'सुरू आहे',
    docsRequired: 5,
    eligible: true,
    logo: '💳',
  },
  {
    id: 'pm-kusum',
    name: 'PM-KUSUM Solar Pump',
    nameHi: 'प्रधानमंत्री कुसुम योजना',
    nameMr: 'प्रधानमंत्री कुसुम सौर पंप योजना',
    amount: '90% subsidy',
    amountHi: '90% सब्सिडी',
    amountMr: '90% अनुदान',
    type: 'Central Govt',
    deadline: 'April 15',
    deadlineHi: '15 अप्रैल',
    deadlineMr: '15 एप्रिल',
    docsRequired: 4,
    eligible: true,
    logo: '☀️',
  },
];


export function SchemeDiscovery() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { userData, getProfileCompletion } = useUser();
  const isHindi = language === 'hi';
  const isMarathi = language === 'mr';


  const [activeFilter, setActiveFilter] = useState<'All' | string>('All');
  const [searchQuery, setSearchQuery] = useState('');


  // Helper to pick the right localized string
  const localize = (en: string, hi: string, mr: string) => {
    if (isMarathi) return mr;
    if (isHindi) return hi;
    return en;
  };


  // Simple estimate of matched schemes based on profile (same idea as Dashboard)
  const matchedSchemesCount = useMemo(() => {
    let count = 5;
    if (userData.landOwnership) count += 3;
    if (userData.selectedCrops.length) count += userData.selectedCrops.length;
    if (userData.irrigation.length) count += 2;
    if (userData.annualIncome) count += 4;
    return Math.min(count, 25);
  }, [userData]);


  const profileCompletion = getProfileCompletion();


  // Filter + search
  const filteredSchemes = useMemo(() => {
    return allSchemes.filter((scheme) => {
      // Filter by type
      if (activeFilter !== 'All' && scheme.type !== activeFilter) return false;


      // Search by name (all languages)
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        scheme.name.toLowerCase().includes(q) ||
        scheme.nameHi.toLowerCase().includes(q) ||
        scheme.nameMr.toLowerCase().includes(q)
      );
    });
  }, [activeFilter, searchQuery]);


  return (
    <div className="min-h-screen bg-[#F7F3EE] pb-24">
      {/* Top Bar - match profile/dashboard style */}
      <div className="bg-gradient-to-b from-[#1A3C1A] to-[#2D6A2D] pt-10 pb-4 px-4 sticky top-0 z-20">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <h1 className="font-bold text-white text-[16px]">
            {localize('Find Schemes', 'योजना खोजें', 'योजना शोधा')}
          </h1>
          <button className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10">
            <Filter className="w-5 h-5 text-white" />
          </button>
        </div>


        {/* Search Bar */}
        <div className="bg-white rounded-2xl p-3 shadow-sm border border-[#F5A623]/60">
          <div className="flex items-center gap-3">
            <Search className="w-5 h-5 text-[#6B7280] flex-shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={localize(
                'Type scheme name, crop, or need...',
                'योजना का नाम, फसल, या ज़रूरत लिखें...',
                'योजनेचे नाव, पीक किंवा गरज लिहा...'
              )}
              className="flex-1 bg-transparent border-none outline-none text-[14px] placeholder:text-[#9CA3AF] text-[#111827]"
            />
            <button className="w-8 h-8 rounded-full bg-[#F5A623]/10 flex items-center justify-center">
              <Mic className="w-4 h-4 text-[#F5A623]" />
            </button>
          </div>
        </div>
      </div>


      <div className="px-4 pt-3">
        {/* Filter Chips */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-2 hide-scrollbar">
          {filterOptions.map((filter) => (
            <button
              key={filter.en}
              onClick={() => setActiveFilter(filter.en)}
              className={`px-4 py-2 rounded-full text-[12px] font-semibold whitespace-nowrap transition-all border ${activeFilter === filter.en
                  ? 'bg-[#F5A623] text-white border-[#F5A623] shadow-sm shadow-[#F5A623]/30'
                  : 'bg-white text-[#1C1C1E] border-gray-200'
                }`}
            >
              {localize(filter.en, filter.hi, filter.mr)}
            </button>
          ))}
        </div>


        {/* Eligibility / Match Banner (similar to dashboard) */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-3xl p-4 mb-4 shadow-sm border border-gray-100 flex items-start gap-3"
        >
          <div className="w-10 h-10 rounded-2xl bg-[#F5A623]/10 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-5 h-5 text-[#F5A623]" />
          </div>
          <div className="flex-1">
            <p className="text-[14px] font-semibold text-[#1C1C1E] mb-1">
              {localize(
                `${matchedSchemesCount} schemes match your profile`,
                `आपकी प्रोफ़ाइल के अनुसार ${matchedSchemesCount} योजनाएं`,
                `तुमच्या प्रोफाइलनुसार ${matchedSchemesCount} योजना जुळतात`
              )}
            </p>
            <p className="text-[12px] text-[#6B7280]">
              {localize(
                `Profile ${profileCompletion}% complete • Complete profile to unlock more schemes`,
                `प्रोफ़ाइल ${profileCompletion}% पूरी • अधिक योजनाओं के लिए प्रोफ़ाइल अपडेट करें`,
                `प्रोफाइल ${profileCompletion}% पूर्ण • अधिक योजनांसाठी प्रोफाइल अपडेट करा`
              )}
            </p>
          </div>
          <button
            onClick={() => navigate('/onboarding/profile')}
            className="ml-2 text-[11px] font-semibold text-[#F5A623] underline"
          >
            {localize('Profile', 'प्रोफ़ाइल', 'प्रोफाइल')}
          </button>
        </motion.div>


        {/* Scheme List */}
        <div className="space-y-3 mb-4">
          {filteredSchemes.length === 0 ? (
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-center">
              <p className="text-[14px] text-[#1C1C1E] font-semibold mb-1">
                {localize('No schemes found', 'कोई योजना नहीं मिली', 'कोणतीही योजना सापडली नाही')}
              </p>
              <p className="text-[12px] text-[#6B7280]">
                {localize(
                  'Try changing filters or search query',
                  'फिल्टर बदलकर फिर से प्रयास करें',
                  'फिल्टर बदलून किंवा वेगळे शोधून पहा'
                )}
              </p>
            </div>
          ) : (
            filteredSchemes.map((scheme) => (
              <SchemeCard
                key={scheme.id}
                {...scheme}
              // if your SchemeCard supports language, you can pass isHindi or language
              />
            ))
          )}
        </div>
      </div>


      <BottomNav />


      {/* Hide scrollbars for filter row */}
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}

