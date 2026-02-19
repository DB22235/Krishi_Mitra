<<<<<<< HEAD


// import { useState, useRef, useEffect } from 'react';
// import {
//   ArrowLeft, ChevronDown, ChevronUp, Edit2, Camera,
//   AlertCircle, LogOut, User, Sprout, Wallet, FileText,
//   Globe, Upload, X, Check, Plus, Sparkles, Shield,
// } from 'lucide-react';
// import { useNavigate } from 'react-router';
// import { motion, AnimatePresence } from 'motion/react';
// import { BottomNav } from '../components/BottomNav';
// import { useLanguage } from '../../context/LanguageContext';
// import { useUser } from '../../context/UserContext';

// export function Profile() {
//   const navigate = useNavigate();
//   const { language, setLanguage, t } = useLanguage();
//   const { userData, updateUserData, getProfileCompletion, getPendingTasks } = useUser();
//   const isHindi = language === 'hi';

//   const [expandedSection, setExpandedSection] = useState<string>('');
//   const [showFinanceModal, setShowFinanceModal] = useState(false);
//   const [showLanguageModal, setShowLanguageModal] = useState(false);
//   const [animatedPercent, setAnimatedPercent] = useState(0);
//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const docInputRef = useRef<HTMLInputElement>(null);
//   const [activeDocId, setActiveDocId] = useState('');

//   // Refs for each section to scroll into view
//   const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

//   const [financeForm, setFinanceForm] = useState({
//     annualIncome: userData.annualIncome || '',
//     incomeSource: userData.incomeSource || '',
//     category: userData.category || '',
//     bankName: userData.bankName || '',
//     bankAccount: userData.bankAccount || '',
//     ifscCode: userData.ifscCode || '',
//     pmKisanStatus: userData.pmKisanStatus || '',
//   });

//   const profileCompletion = getProfileCompletion();
//   const pendingTasks = getPendingTasks();

//   // Animate profile completion
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       const interval = setInterval(() => {
//         setAnimatedPercent((prev) => {
//           if (prev >= profileCompletion) {
//             clearInterval(interval);
//             return profileCompletion;
//           }
//           return prev + 1;
//         });
//       }, 20);
//       return () => clearInterval(interval);
//     }, 500);
//     return () => clearTimeout(timer);
//   }, [profileCompletion]);

//   const toggleSection = (section: string) => {
//     const isOpening = expandedSection !== section;
//     setExpandedSection(isOpening ? section : '');

//     if (isOpening) {
//       // Wait for the animation to start, then scroll the section into view
//       setTimeout(() => {
//         sectionRefs.current[section]?.scrollIntoView({
//           behavior: 'smooth',
//           block: 'start',
//         });
//       }, 100);
//     }
//   };

//   // Handle profile image upload
//   const handleProfileImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         updateUserData({ profileImage: reader.result as string });
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   // Handle document upload
//   const handleDocUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file && activeDocId) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         const updatedDocs = userData.documents.map((doc) =>
//           doc.id === activeDocId
//             ? { ...doc, status: 'uploaded' as const, file: reader.result as string }
//             : doc
//         );
//         updateUserData({ documents: updatedDocs });
//       };
//       reader.readAsDataURL(file);
//     }
//     setActiveDocId('');
//   };

//   // Save finance form
//   const handleSaveFinance = () => {
//     updateUserData(financeForm);
//     setShowFinanceModal(false);
//   };

//   // Get crop names
//   const getCropNames = () => {
//     const cropMap: Record<string, { en: string; hi: string }> = {
//       wheat: { en: 'Wheat', hi: 'गेहूँ' },
//       rice: { en: 'Rice', hi: 'धान' },
//       maize: { en: 'Maize', hi: 'मक्का' },
//       soybean: { en: 'Soybean', hi: 'सोयाबीन' },
//       cotton: { en: 'Cotton', hi: 'कपास' },
//       sugarcane: { en: 'Sugarcane', hi: 'गन्ना' },
//       vegetables: { en: 'Vegetables', hi: 'सब्जियां' },
//       pulses: { en: 'Pulses', hi: 'दालें' },
//       fruits: { en: 'Fruits', hi: 'फल' },
//       spices: { en: 'Spices', hi: 'मसाले' },
//     };
//     return userData.selectedCrops
//       .map((c) => (isHindi ? cropMap[c]?.hi : cropMap[c]?.en) || c)
//       .join(', ') || (isHindi ? 'जोड़ें' : 'Add');
//   };

//   // Get irrigation names
//   const getIrrigationNames = () => {
//     const irrMap: Record<string, { en: string; hi: string }> = {
//       borewell: { en: 'Borewell', hi: 'बोरवेल' },
//       canal: { en: 'Canal', hi: 'नहर' },
//       rainfed: { en: 'Rain-fed', hi: 'वर्षा आधारित' },
//       river: { en: 'River', hi: 'नदी' },
//       pond: { en: 'Pond', hi: 'तालाब' },
//       drip: { en: 'Drip', hi: 'ड्रिप' },
//     };
//     return userData.irrigation
//       .map((i) => (isHindi ? irrMap[i]?.hi : irrMap[i]?.en) || i)
//       .join(', ') || (isHindi ? 'जोड़ें' : 'Add');
//   };

//   const getOwnership = () => {
//     const map: Record<string, { en: string; hi: string }> = {
//       owner: { en: 'Owner', hi: 'मालिक' },
//       tenant: { en: 'Tenant', hi: 'किरायेदार' },
//       sharecropper: { en: 'Sharecropper', hi: 'बटाईदार' },
//     };
//     return isHindi
//       ? map[userData.landOwnership]?.hi || 'जोड़ें'
//       : map[userData.landOwnership]?.en || 'Add';
//   };

//   const getGender = () => {
//     const map: Record<string, { en: string; hi: string }> = {
//       Male: { en: 'Male', hi: 'पुरुष' },
//       Female: { en: 'Female', hi: 'महिला' },
//       Other: { en: 'Other', hi: 'अन्य' },
//     };
//     return isHindi
//       ? map[userData.gender]?.hi || 'जोड़ें'
//       : map[userData.gender]?.en || 'Add';
//   };

//   const inputClass =
//     'w-full px-4 py-3 bg-[#F7F3EE] rounded-2xl border-2 border-transparent outline-none focus:border-[#F5A623] focus:bg-white transition-all text-[14px]';

//   return (
//     <div className="min-h-screen bg-[#F7F3EE] pb-24">
//       {/* Hidden file inputs */}
//       <input
//         ref={fileInputRef}
//         type="file"
//         accept="image/*"
//         className="hidden"
//         onChange={handleProfileImageUpload}
//       />
//       <input
//         ref={docInputRef}
//         type="file"
//         accept="image/*,.pdf"
//         className="hidden"
//         onChange={handleDocUpload}
//       />

//       {/* Header */}
//       <div className="bg-gradient-to-b from-[#1A3C1A] to-[#2D6A2D] pt-10 pb-16 px-4">
//         <div className="flex items-center justify-between mb-6">
//           <button
//             onClick={() => navigate('/dashboard')}
//             className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
//           >
//             <ArrowLeft className="w-5 h-5 text-white" />
//           </button>
//           <h2 className="text-white font-semibold text-[16px]">
//             {isHindi ? 'मेरी प्रोफ़ाइल' : 'My Profile'}
//           </h2>
//           <div className="w-9" />
//         </div>

//         <div className="flex flex-col items-center">
//           {/* Profile Image */}
//           <motion.div
//             initial={{ scale: 0.8, opacity: 0 }}
//             animate={{ scale: 1, opacity: 1 }}
//             className="relative mb-3"
//           >
//             <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center overflow-hidden border-4 border-[#F5A623] shadow-lg shadow-[#F5A623]/30">
//               {userData.profileImage ? (
//                 <img
//                   src={userData.profileImage}
//                   alt="Profile"
//                   className="w-full h-full object-cover"
//                 />
//               ) : (
//                 <span className="text-5xl">👤</span>
//               )}
//             </div>
//             <button
//               onClick={() => fileInputRef.current?.click()}
//               className="absolute bottom-0 right-0 w-8 h-8 bg-[#F5A623] rounded-full flex items-center justify-center shadow-md border-2 border-white"
//             >
//               <Camera className="w-4 h-4 text-white" />
//             </button>
//           </motion.div>

//           {/* Name */}
//           <motion.h1
//             initial={{ opacity: 0, y: 10 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="font-bold text-white text-[22px] mb-1"
//           >
//             {userData.name || (isHindi ? 'नाम जोड़ें' : 'Add Name')}
//           </motion.h1>

//           {/* Location */}
//           {(userData.state || userData.district) && (
//             <div className="flex items-center gap-1 text-[#97BC62] text-[14px] mb-1">
//               <span>📍</span>
//               <span>{userData.district}{userData.district && userData.state ? ', ' : ''}{userData.state}</span>
//             </div>
//           )}

//           <p className="text-[#C8D8C8] text-[12px] mb-2">
//             {isHindi ? `सदस्य: ${userData.memberSince}` : `Member since ${userData.memberSince}`}
//           </p>

//           {userData.aadhaarVerified && (
//             <motion.div
//               initial={{ scale: 0 }}
//               animate={{ scale: 1 }}
//               className="flex items-center gap-1 bg-[#97BC62]/20 px-3 py-1 rounded-full"
//             >
//               <Shield className="w-3 h-3 text-[#97BC62]" />
//               <span className="text-[#97BC62] text-[11px] font-semibold">
//                 {isHindi ? 'आधार सत्यापित' : 'Aadhaar Verified'}
//               </span>
//             </motion.div>
//           )}
//         </div>
//       </div>

//       {/* Profile Completion Card */}
//       <div className="px-4 -mt-10 mb-6">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.2 }}
//           className="bg-white rounded-3xl p-5 shadow-lg border border-gray-100"
//         >
//           <div className="flex items-center justify-between mb-3">
//             <div className="flex items-center gap-2">
//               <Sparkles className="w-5 h-5 text-[#F5A623]" />
//               <h3 className="font-bold text-[15px] text-[#1C1C1E]">
//                 {isHindi ? 'प्रोफ़ाइल पूर्णता' : 'Profile Completion'}
//               </h3>
//             </div>
//             <motion.span
//               key={animatedPercent}
//               initial={{ scale: 1.3 }}
//               animate={{ scale: 1 }}
//               className={`text-[22px] font-bold ${
//                 animatedPercent >= 80 ? 'text-green-500' :
//                 animatedPercent >= 50 ? 'text-[#F5A623]' :
//                 'text-red-500'
//               }`}
//             >
//               {animatedPercent}%
//             </motion.span>
//           </div>

//           {/* Progress Bar */}
//           <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden mb-4">
//             <motion.div
//               initial={{ width: 0 }}
//               animate={{ width: `${animatedPercent}%` }}
//               transition={{ duration: 1.5, ease: 'easeOut', delay: 0.5 }}
//               className={`h-full rounded-full ${
//                 animatedPercent >= 80 ? 'bg-green-500' :
//                 animatedPercent >= 50 ? 'bg-[#F5A623]' :
//                 'bg-red-500'
//               }`}
//             />
//           </div>

//           {/* Pending Tasks */}
//           {pendingTasks.length > 0 && (
//             <div className="mb-4">
//               <p className="text-[12px] text-[#6B7280] mb-2 font-medium">
//                 {isHindi ? `${pendingTasks.length} चीज़ें बाकी हैं:` : `${pendingTasks.length} items remaining:`}
//               </p>
//               <div className="space-y-1.5">
//                 {pendingTasks.slice(0, 3).map((task, index) => (
//                   <motion.div
//                     key={index}
//                     initial={{ opacity: 0, x: -10 }}
//                     animate={{ opacity: 1, x: 0 }}
//                     transition={{ delay: 0.8 + index * 0.1 }}
//                     className="flex items-center gap-2"
//                   >
//                     <div className="w-4 h-4 border-2 border-[#F5A623]/50 rounded flex-shrink-0" />
//                     <span className="text-[12px] text-[#1C1C1E]">
//                       {isHindi ? task.hi : task.en}
//                     </span>
//                   </motion.div>
//                 ))}
//               </div>
//             </div>
//           )}

//           <motion.button
//             onClick={() => navigate('/onboarding/profile')}
//             whileHover={{ scale: 1.02 }}
//             whileTap={{ scale: 0.98 }}
//             className="w-full bg-[#F5A623] text-white py-3 rounded-2xl font-bold text-[14px] shadow-md shadow-[#F5A623]/20"
//           >
//             {isHindi ? 'प्रोफ़ाइल पूरा करें' : 'Complete Profile'}
//           </motion.button>
//         </motion.div>
//       </div>

//       {/* Sections */}
//       <div className="px-4 space-y-3">

//         {/* Personal Information */}
//         <motion.div
//           ref={(el) => { sectionRefs.current['personal'] = el; }}
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.3 }}
//           className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden"
//         >
//           <button
//             onClick={() => toggleSection('personal')}
//             className="w-full px-5 py-4 flex items-center justify-between"
//           >
//             <div className="flex items-center gap-3">
//               <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center">
//                 <User className="w-5 h-5 text-blue-500" />
//               </div>
//               <div className="text-left">
//                 <h3 className="font-semibold text-[15px] text-[#1C1C1E]">
//                   {isHindi ? 'व्यक्तिगत जानकारी' : 'Personal Information'}
//                 </h3>
//                 <p className="text-[11px] text-[#6B7280]">
//                   {userData.name || (isHindi ? 'जानकारी जोड़ें' : 'Add info')}
//                 </p>
//               </div>
//             </div>
//             <div className="flex items-center gap-2">
//               <button
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   navigate('/onboarding/profile');
//                 }}
//                 className="w-8 h-8 rounded-full bg-[#F5A623]/10 flex items-center justify-center"
//               >
//                 <Edit2 className="w-3.5 h-3.5 text-[#F5A623]" />
//               </button>
//               {expandedSection === 'personal' ? (
//                 <ChevronUp className="w-5 h-5 text-[#6B7280]" />
//               ) : (
//                 <ChevronDown className="w-5 h-5 text-[#6B7280]" />
//               )}
//             </div>
//           </button>

//           <AnimatePresence>
//             {expandedSection === 'personal' && (
//               <motion.div
//                 initial={{ height: 0, opacity: 0 }}
//                 animate={{ height: 'auto', opacity: 1 }}
//                 exit={{ height: 0, opacity: 0 }}
//                 transition={{ duration: 0.3 }}
//                 className="overflow-hidden"
//               >
//                 <div className="px-5 pb-5 space-y-3 border-t border-gray-50 pt-3">
//                   {/* Profile Image Upload */}
//                   <div className="flex items-center gap-4 bg-[#F7F3EE] rounded-2xl p-4">
//                     <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center overflow-hidden border-2 border-dashed border-[#F5A623]/40">
//                       {userData.profileImage ? (
//                         <img src={userData.profileImage} alt="Profile" className="w-full h-full object-cover" />
//                       ) : (
//                         <Camera className="w-6 h-6 text-gray-300" />
//                       )}
//                     </div>
//                     <div className="flex-1">
//                       <p className="text-[13px] font-semibold text-[#1C1C1E]">
//                         {isHindi ? 'प्रोफ़ाइल फोटो' : 'Profile Photo'}
//                       </p>
//                       <button
//                         onClick={() => fileInputRef.current?.click()}
//                         className="text-[12px] text-[#F5A623] font-medium mt-1 flex items-center gap-1"
//                       >
//                         <Upload className="w-3 h-3" />
//                         {userData.profileImage
//                           ? (isHindi ? 'बदलें' : 'Change')
//                           : (isHindi ? 'अपलोड करें' : 'Upload')}
//                       </button>
//                     </div>
//                   </div>

//                   {/* Info Rows */}
//                   {[
//                     { label: isHindi ? 'नाम' : 'Name', value: userData.name },
//                     { label: isHindi ? 'उम्र' : 'Age', value: userData.age ? `${userData.age} ${isHindi ? 'वर्ष' : 'years'}` : '' },
//                     { label: isHindi ? 'लिंग' : 'Gender', value: getGender() },
//                     { label: isHindi ? 'मोबाइल' : 'Mobile', value: userData.mobile ? `+91 ${userData.mobile}` : '' },
//                     { label: isHindi ? 'आधार' : 'Aadhaar', value: userData.aadhaar || '' },
//                   ].map((info, index) => (
//                     <div key={index} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
//                       <span className="text-[13px] text-[#6B7280]">{info.label}</span>
//                       <span className={`text-[13px] font-medium ${info.value ? 'text-[#1C1C1E]' : 'text-[#F5A623]'}`}>
//                         {info.value || (isHindi ? '+ जोड़ें' : '+ Add')}
//                       </span>
//                     </div>
//                   ))}
//                 </div>
//               </motion.div>
//             )}
//           </AnimatePresence>
//         </motion.div>

//         {/* Farming Details */}
//         <motion.div
//           ref={(el) => { sectionRefs.current['farming'] = el; }}
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.35 }}
//           className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden"
//         >
//           <button
//             onClick={() => toggleSection('farming')}
//             className="w-full px-5 py-4 flex items-center justify-between"
//           >
//             <div className="flex items-center gap-3">
//               <div className="w-10 h-10 rounded-2xl bg-green-50 flex items-center justify-center">
//                 <Sprout className="w-5 h-5 text-green-500" />
//               </div>
//               <div className="text-left">
//                 <h3 className="font-semibold text-[15px] text-[#1C1C1E]">
//                   {isHindi ? 'कृषि विवरण' : 'Farm Details'}
//                 </h3>
//                 <p className="text-[11px] text-[#6B7280]">
//                   {userData.landSize > 0
//                     ? `${userData.landSize} ${userData.landUnit}`
//                     : (isHindi ? 'जानकारी जोड़ें' : 'Add info')}
//                 </p>
//               </div>
//             </div>
//             <div className="flex items-center gap-2">
//               <button
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   navigate('/onboarding/farm-details');
//                 }}
//                 className="w-8 h-8 rounded-full bg-[#F5A623]/10 flex items-center justify-center"
//               >
//                 <Edit2 className="w-3.5 h-3.5 text-[#F5A623]" />
//               </button>
//               {expandedSection === 'farming' ? (
//                 <ChevronUp className="w-5 h-5 text-[#6B7280]" />
//               ) : (
//                 <ChevronDown className="w-5 h-5 text-[#6B7280]" />
//               )}
//             </div>
//           </button>

//           <AnimatePresence>
//             {expandedSection === 'farming' && (
//               <motion.div
//                 initial={{ height: 0, opacity: 0 }}
//                 animate={{ height: 'auto', opacity: 1 }}
//                 exit={{ height: 0, opacity: 0 }}
//                 className="overflow-hidden"
//               >
//                 <div className="px-5 pb-5 space-y-3 border-t border-gray-50 pt-3">
//                   {[
//                     { label: isHindi ? 'भूमि आकार' : 'Land Size', value: userData.landSize > 0 ? `${userData.landSize} ${userData.landUnit}` : '' },
//                     { label: isHindi ? 'स्वामित्व' : 'Ownership', value: getOwnership() },
//                     { label: isHindi ? 'फसलें' : 'Crops', value: getCropNames() },
//                     { label: isHindi ? 'सिंचाई' : 'Irrigation', value: getIrrigationNames() },
//                     { label: isHindi ? 'मौसम' : 'Seasons', value: userData.selectedSeasons.join(', ') || (isHindi ? 'जोड़ें' : 'Add') },
//                   ].map((info, index) => (
//                     <div key={index} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
//                       <span className="text-[13px] text-[#6B7280]">{info.label}</span>
//                       <span className={`text-[13px] font-medium text-right max-w-[55%] ${info.value && info.value !== (isHindi ? 'जोड़ें' : 'Add') ? 'text-[#1C1C1E]' : 'text-[#F5A623]'}`}>
//                         {info.value || (isHindi ? '+ जोड़ें' : '+ Add')}
//                       </span>
//                     </div>
//                   ))}
//                 </div>
//               </motion.div>
//             )}
//           </AnimatePresence>
//         </motion.div>

//         {/* Financial Info */}
//         <motion.div
//           ref={(el) => { sectionRefs.current['economic'] = el; }}
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.4 }}
//           className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden"
//         >
//           <button
//             onClick={() => toggleSection('economic')}
//             className="w-full px-5 py-4 flex items-center justify-between"
//           >
//             <div className="flex items-center gap-3">
//               <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center">
//                 <Wallet className="w-5 h-5 text-amber-500" />
//               </div>
//               <div className="text-left">
//                 <h3 className="font-semibold text-[15px] text-[#1C1C1E]">
//                   {isHindi ? 'आर्थिक जानकारी' : 'Financial Information'}
//                 </h3>
//                 <p className="text-[11px] text-[#6B7280]">
//                   {userData.annualIncome || (isHindi ? 'जानकारी जोड़ें' : 'Add info')}
//                 </p>
//               </div>
//             </div>
//             <div className="flex items-center gap-2">
//               <button
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   setShowFinanceModal(true);
//                 }}
//                 className="w-8 h-8 rounded-full bg-[#F5A623]/10 flex items-center justify-center"
//               >
//                 <Edit2 className="w-3.5 h-3.5 text-[#F5A623]" />
//               </button>
//               {expandedSection === 'economic' ? (
//                 <ChevronUp className="w-5 h-5 text-[#6B7280]" />
//               ) : (
//                 <ChevronDown className="w-5 h-5 text-[#6B7280]" />
//               )}
//             </div>
//           </button>

//           <AnimatePresence>
//             {expandedSection === 'economic' && (
//               <motion.div
//                 initial={{ height: 0, opacity: 0 }}
//                 animate={{ height: 'auto', opacity: 1 }}
//                 exit={{ height: 0, opacity: 0 }}
//                 className="overflow-hidden"
//               >
//                 <div className="px-5 pb-5 space-y-3 border-t border-gray-50 pt-3">
//                   {[
//                     { label: isHindi ? 'वार्षिक आय' : 'Annual Income', value: userData.annualIncome },
//                     { label: isHindi ? 'आय स्रोत' : 'Income Source', value: userData.incomeSource },
//                     { label: isHindi ? 'श्रेणी' : 'Category', value: userData.category },
//                     { label: isHindi ? 'बैंक' : 'Bank', value: userData.bankName },
//                     { label: isHindi ? 'खाता संख्या' : 'Account No.', value: userData.bankAccount ? `XXXXXX${userData.bankAccount.slice(-4)}` : '' },
//                     { label: isHindi ? 'IFSC कोड' : 'IFSC Code', value: userData.ifscCode },
//                     { label: isHindi ? 'PM-किसान' : 'PM-Kisan', value: userData.pmKisanStatus },
//                   ].map((info, index) => (
//                     <div key={index} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
//                       <span className="text-[13px] text-[#6B7280]">{info.label}</span>
//                       <span className={`text-[13px] font-medium ${info.value ? 'text-[#1C1C1E]' : 'text-[#F5A623]'}`}>
//                         {info.value || (isHindi ? '+ जोड़ें' : '+ Add')}
//                       </span>
//                     </div>
//                   ))}

//                   {!userData.annualIncome && (
//                     <motion.button
//                       onClick={() => setShowFinanceModal(true)}
//                       whileHover={{ scale: 1.02 }}
//                       whileTap={{ scale: 0.98 }}
//                       className="w-full bg-[#F5A623]/10 text-[#F5A623] py-3 rounded-2xl font-semibold text-[13px] flex items-center justify-center gap-2 mt-2"
//                     >
//                       <Plus className="w-4 h-4" />
//                       {isHindi ? 'आर्थिक जानकारी जोड़ें' : 'Add Financial Information'}
//                     </motion.button>
//                   )}
//                 </div>
//               </motion.div>
//             )}
//           </AnimatePresence>
//         </motion.div>

//         {/* Documents */}
//         <motion.div
//           ref={(el) => { sectionRefs.current['documents'] = el; }}
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.45 }}
//           className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden"
//         >
//           <button
//             onClick={() => toggleSection('documents')}
//             className="w-full px-5 py-4 flex items-center justify-between"
//           >
//             <div className="flex items-center gap-3">
//               <div className="w-10 h-10 rounded-2xl bg-purple-50 flex items-center justify-center">
//                 <FileText className="w-5 h-5 text-purple-500" />
//               </div>
//               <div className="text-left">
//                 <h3 className="font-semibold text-[15px] text-[#1C1C1E]">
//                   {isHindi ? 'मेरे दस्तावेज़' : 'My Documents'}
//                 </h3>
//                 <p className="text-[11px] text-[#6B7280]">
//                   {userData.documents.filter((d) => d.status === 'uploaded').length}/{userData.documents.length} {isHindi ? 'अपलोड' : 'uploaded'}
//                 </p>
//               </div>
//             </div>
//             {expandedSection === 'documents' ? (
//               <ChevronUp className="w-5 h-5 text-[#6B7280]" />
//             ) : (
//               <ChevronDown className="w-5 h-5 text-[#6B7280]" />
//             )}
//           </button>

//           <AnimatePresence>
//             {expandedSection === 'documents' && (
//               <motion.div
//                 initial={{ height: 0, opacity: 0 }}
//                 animate={{ height: 'auto', opacity: 1 }}
//                 exit={{ height: 0, opacity: 0 }}
//                 className="overflow-hidden"
//               >
//                 <div className="px-5 pb-5 border-t border-gray-50 pt-3">
//                   <div className="grid grid-cols-2 gap-3 mb-4">
//                     {userData.documents.map((doc) => (
//                       <motion.button
//                         key={doc.id}
//                         onClick={() => {
//                           setActiveDocId(doc.id);
//                           docInputRef.current?.click();
//                         }}
//                         whileHover={{ scale: 1.02 }}
//                         whileTap={{ scale: 0.97 }}
//                         className={`rounded-2xl p-4 text-center border-2 transition-all ${
//                           doc.status === 'uploaded'
//                             ? 'bg-green-50 border-green-200'
//                             : 'bg-gray-50 border-dashed border-gray-200 hover:border-[#F5A623]'
//                         }`}
//                       >
//                         <div className="text-3xl mb-2">
//                           {doc.status === 'uploaded' ? '✅' : '📄'}
//                         </div>
//                         <p className="text-[12px] text-[#1C1C1E] font-semibold">
//                           {isHindi ? doc.nameHi : doc.name}
//                         </p>
//                         <p className={`text-[10px] mt-1 font-medium ${
//                           doc.status === 'uploaded' ? 'text-green-600' : 'text-[#F5A623]'
//                         }`}>
//                           {doc.status === 'uploaded'
//                             ? (isHindi ? 'अपलोड ✓' : 'Uploaded ✓')
//                             : (isHindi ? '+ अपलोड करें' : '+ Upload')}
//                         </p>
//                       </motion.button>
//                     ))}
//                   </div>
//                 </div>
//               </motion.div>
//             )}
//           </AnimatePresence>
//         </motion.div>

//         {/* Language */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.5 }}
//           className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden"
//         >
//           <button
//             onClick={() => setShowLanguageModal(true)}
//             className="w-full px-5 py-4 flex items-center justify-between"
//           >
//             <div className="flex items-center gap-3">
//               <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center">
//                 <Globe className="w-5 h-5 text-indigo-500" />
//               </div>
//               <div className="text-left">
//                 <h3 className="font-semibold text-[15px] text-[#1C1C1E]">
//                   {isHindi ? 'भाषा' : 'Language'}
//                 </h3>
//                 <p className="text-[11px] text-[#6B7280]">
//                   {isHindi ? 'हिंदी' : 'English'}
//                 </p>
//               </div>
//             </div>
//             <div className="flex items-center gap-2 bg-[#F7F3EE] px-3 py-1.5 rounded-full">
//               <span className="text-[12px] font-semibold text-[#1C1C1E]">
//                 {isHindi ? 'हिं' : 'EN'}
//               </span>
//             </div>
//           </button>
//         </motion.div>

//         {/* Sign Out */}
//         <motion.button
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.55 }}
//           whileHover={{ scale: 1.01 }}
//           whileTap={{ scale: 0.99 }}
//           className="w-full bg-white rounded-3xl shadow-sm border border-gray-100 px-5 py-4 flex items-center gap-3"
//         >
//           <div className="w-10 h-10 rounded-2xl bg-red-50 flex items-center justify-center">
//             <LogOut className="w-5 h-5 text-red-500" />
//           </div>
//           <span className="font-semibold text-[15px] text-red-500">
//             {isHindi ? 'साइन आउट' : 'Sign Out'}
//           </span>
//         </motion.button>
//       </div>

//       {/* Finance Modal */}
//       <AnimatePresence>
//         {showFinanceModal && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black/50 z-50 flex items-end"
//             onClick={() => setShowFinanceModal(false)}
//           >
//             <motion.div
//               initial={{ y: '100%' }}
//               animate={{ y: 0 }}
//               exit={{ y: '100%' }}
//               transition={{ type: 'spring', damping: 25 }}
//               onClick={(e) => e.stopPropagation()}
//               className="w-full bg-white rounded-t-3xl max-h-[85vh] overflow-y-auto"
//             >
//               {/* Modal Header */}
//               <div className="sticky top-0 bg-white px-6 pt-6 pb-4 border-b border-gray-100 z-10">
//                 <div className="flex items-center justify-between mb-1">
//                   <h2 className="text-[18px] font-bold text-[#1C1C1E]">
//                     {isHindi ? 'आर्थिक जानकारी' : 'Financial Information'}
//                   </h2>
//                   <button
//                     onClick={() => setShowFinanceModal(false)}
//                     className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
//                   >
//                     <X className="w-4 h-4 text-gray-500" />
//                   </button>
//                 </div>
//                 <p className="text-[12px] text-[#6B7280]">
//                   {isHindi ? 'सही योजनाओं के लिए यह जानकारी ज़रूरी है' : 'This info is needed for matching schemes'}
//                 </p>
//               </div>

//               {/* Modal Content */}
//               <div className="px-6 py-5 space-y-5">
//                 {/* Annual Income */}
//                 <div>
//                   <label className="text-[12px] font-semibold text-[#6B7280] uppercase tracking-wider mb-2 block">
//                     {isHindi ? 'वार्षिक आय' : 'Annual Income'}
//                   </label>
//                   <select
//                     value={financeForm.annualIncome}
//                     onChange={(e) => setFinanceForm({ ...financeForm, annualIncome: e.target.value })}
//                     className={inputClass}
//                   >
//                     <option value="">{isHindi ? 'चुनें' : 'Select'}</option>
//                     <option value="Below ₹50,000">{isHindi ? '₹50,000 से कम' : 'Below ₹50,000'}</option>
//                     <option value="₹50,000 - ₹1,00,000">₹50,000 - ₹1,00,000</option>
//                     <option value="₹1,00,000 - ₹2,50,000">₹1,00,000 - ₹2,50,000</option>
//                     <option value="₹2,50,000 - ₹5,00,000">₹2,50,000 - ₹5,00,000</option>
//                     <option value="Above ₹5,00,000">{isHindi ? '₹5,00,000 से अधिक' : 'Above ₹5,00,000'}</option>
//                   </select>
//                 </div>

//                 {/* Income Source */}
//                 <div>
//                   <label className="text-[12px] font-semibold text-[#6B7280] uppercase tracking-wider mb-2 block">
//                     {isHindi ? 'आय का स्रोत' : 'Income Source'}
//                   </label>
//                   <div className="flex flex-wrap gap-2">
//                     {[
//                       { en: 'Farming', hi: 'खेती' },
//                       { en: 'Labour', hi: 'मजदूरी' },
//                       { en: 'Business', hi: 'व्यापार' },
//                       { en: 'Govt Job', hi: 'सरकारी नौकरी' },
//                       { en: 'Other', hi: 'अन्य' },
//                     ].map((src) => (
//                       <button
//                         key={src.en}
//                         onClick={() => setFinanceForm({ ...financeForm, incomeSource: src.en })}
//                         className={`px-4 py-2 rounded-full text-[12px] font-medium border-2 transition-all ${
//                           financeForm.incomeSource === src.en
//                             ? 'bg-[#F5A623] text-white border-[#F5A623]'
//                             : 'bg-[#F7F3EE] text-[#6B7280] border-transparent'
//                         }`}
//                       >
//                         {isHindi ? src.hi : src.en}
//                       </button>
//                     ))}
//                   </div>
//                 </div>

//                 {/* Category */}
//                 <div>
//                   <label className="text-[12px] font-semibold text-[#6B7280] uppercase tracking-wider mb-2 block">
//                     {isHindi ? 'श्रेणी' : 'Category'}
//                   </label>
//                   <div className="flex gap-2">
//                     {[
//                       { en: 'BPL', hi: 'BPL' },
//                       { en: 'APL', hi: 'APL' },
//                       { en: 'General', hi: 'सामान्य' },
//                     ].map((cat) => (
//                       <button
//                         key={cat.en}
//                         onClick={() => setFinanceForm({ ...financeForm, category: cat.en })}
//                         className={`flex-1 py-3 rounded-2xl text-[13px] font-semibold border-2 transition-all ${
//                           financeForm.category === cat.en
//                             ? 'bg-[#F5A623] text-white border-[#F5A623]'
//                             : 'bg-[#F7F3EE] text-[#6B7280] border-transparent'
//                         }`}
//                       >
//                         {isHindi ? cat.hi : cat.en}
//                       </button>
//                     ))}
//                   </div>
//                 </div>

//                 {/* Bank Name */}
//                 <div>
//                   <label className="text-[12px] font-semibold text-[#6B7280] uppercase tracking-wider mb-2 block">
//                     {isHindi ? 'बैंक का नाम' : 'Bank Name'}
//                   </label>
//                   <input
//                     type="text"
//                     value={financeForm.bankName}
//                     onChange={(e) => setFinanceForm({ ...financeForm, bankName: e.target.value })}
//                     placeholder={isHindi ? 'जैसे: State Bank of India' : 'e.g. State Bank of India'}
//                     className={inputClass}
//                   />
//                 </div>

//                 {/* Account + IFSC */}
//                 <div className="grid grid-cols-2 gap-3">
//                   <div>
//                     <label className="text-[12px] font-semibold text-[#6B7280] uppercase tracking-wider mb-2 block">
//                       {isHindi ? 'खाता संख्या' : 'Account No.'}
//                     </label>
//                     <input
//                       type="text"
//                       value={financeForm.bankAccount}
//                       onChange={(e) => setFinanceForm({ ...financeForm, bankAccount: e.target.value })}
//                       placeholder="XXXXXXXXXXXX"
//                       className={inputClass}
//                     />
//                   </div>
//                   <div>
//                     <label className="text-[12px] font-semibold text-[#6B7280] uppercase tracking-wider mb-2 block">
//                       IFSC
//                     </label>
//                     <input
//                       type="text"
//                       value={financeForm.ifscCode}
//                       onChange={(e) => setFinanceForm({ ...financeForm, ifscCode: e.target.value.toUpperCase() })}
//                       placeholder="SBIN0001234"
//                       className={inputClass}
//                     />
//                   </div>
//                 </div>

//                 {/* PM Kisan */}
//                 <div>
//                   <label className="text-[12px] font-semibold text-[#6B7280] uppercase tracking-wider mb-2 block">
//                     {isHindi ? 'PM-किसान स्थिति' : 'PM-Kisan Status'}
//                   </label>
//                   <div className="flex gap-2">
//                     {[
//                       { en: 'Active', hi: 'सक्रिय' },
//                       { en: 'Inactive', hi: 'निष्क्रिय' },
//                       { en: 'Not Enrolled', hi: 'नामांकित नहीं' },
//                     ].map((status) => (
//                       <button
//                         key={status.en}
//                         onClick={() => setFinanceForm({ ...financeForm, pmKisanStatus: status.en })}
//                         className={`flex-1 py-2.5 rounded-2xl text-[12px] font-semibold border-2 transition-all ${
//                           financeForm.pmKisanStatus === status.en
//                             ? 'bg-[#F5A623] text-white border-[#F5A623]'
//                             : 'bg-[#F7F3EE] text-[#6B7280] border-transparent'
//                         }`}
//                       >
//                         {isHindi ? status.hi : status.en}
//                       </button>
//                     ))}
//                   </div>
//                 </div>
//               </div>

//               {/* Modal Footer */}
//               <div className="sticky bottom-0 bg-white px-6 py-4 border-t border-gray-100">
//                 <motion.button
//                   onClick={handleSaveFinance}
//                   whileHover={{ scale: 1.02 }}
//                   whileTap={{ scale: 0.98 }}
//                   className="w-full bg-[#F5A623] text-white py-4 rounded-2xl font-bold text-[15px] shadow-lg shadow-[#F5A623]/30 flex items-center justify-center gap-2"
//                 >
//                   <Check className="w-5 h-5" />
//                   {isHindi ? 'सहेजें' : 'Save'}
//                 </motion.button>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Language Modal */}
//       <AnimatePresence>
//         {showLanguageModal && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-6"
//             onClick={() => setShowLanguageModal(false)}
//           >
//             <motion.div
//               initial={{ scale: 0.9, opacity: 0 }}
//               animate={{ scale: 1, opacity: 1 }}
//               exit={{ scale: 0.9, opacity: 0 }}
//               onClick={(e) => e.stopPropagation()}
//               className="w-full max-w-sm bg-white rounded-3xl p-6"
//             >
//               <h3 className="text-[18px] font-bold text-[#1C1C1E] text-center mb-5">
//                 {isHindi ? 'भाषा चुनें' : 'Select Language'}
//               </h3>
//               <div className="space-y-3">
//                 {[
//                   { code: 'hi' as const, name: 'हिंदी', nameEn: 'Hindi' },
//                   { code: 'en' as const, name: 'English', nameEn: 'English' },
//                 ].map((lang) => (
//                   <motion.button
//                     key={lang.code}
//                     onClick={() => {
//                       setLanguage(lang.code);
//                       setShowLanguageModal(false);
//                     }}
//                     whileHover={{ scale: 1.02 }}
//                     whileTap={{ scale: 0.98 }}
//                     className={`w-full py-4 rounded-2xl font-semibold text-[16px] transition-all border-2 flex items-center justify-center gap-2 ${
//                       language === lang.code
//                         ? 'bg-[#F5A623] text-white border-[#F5A623]'
//                         : 'bg-[#F7F3EE] text-[#1C1C1E] border-transparent'
//                     }`}
//                   >
//                     {lang.name}
//                     {language === lang.code && <Check className="w-5 h-5" />}
//                   </motion.button>
//                 ))}
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       <BottomNav />
//     </div>
//   );
// }

import { useState, useRef, useEffect } from 'react';
import {
  ArrowLeft, ChevronDown, ChevronUp, Edit2, Camera,
  LogOut, User, Sprout, Wallet, FileText,
  Globe, Upload, X, Check, Plus, Sparkles, Shield,
} from 'lucide-react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { BottomNav } from '../components/BottomNav';
import { useLanguage } from '../../context/LanguageContext';
import { useUser } from '../../context/UserContext';

export function Profile() {
  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguage();
  const { userData, updateUserData, getProfileCompletion, getPendingTasks } = useUser();
  const isHindi = language === 'hi';

  const [expandedSection, setExpandedSection] = useState<string>('');
  const [showFinanceModal, setShowFinanceModal] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [animatedPercent, setAnimatedPercent] = useState(0);
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

  const toggleSection = (section: string) => {
    const isOpening = expandedSection !== section;
    setExpandedSection(isOpening ? section : '');
    if (isOpening) {
      setTimeout(() => {
        sectionRefs.current[section]?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }, 100);
    }
=======
import { useCallback, useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Edit2,
  LogOut,
} from "lucide-react";
import { useNavigate } from "react-router";
import { BottomNav } from "../components/BottomNav";
import { useDocumentUpload, type DocumentKey } from "../hooks/useDocumentUpload";
import { Toaster } from "../components/ui/sonner";
import { toast } from "sonner";

export function Profile() {
  const navigate = useNavigate();
  const [expandedSection, setExpandedSection] = useState<string>("");

  const handleValidationError = useCallback((message: string) => {
    toast.error(message);
  }, []);

  const { documents, inputRefs, handleCardClick, handleFileChange } =
    useDocumentUpload(handleValidationError);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? "" : section);
>>>>>>> 7b4431a7924aeb4c3ea7a2dcf97dad9c58e4f828
  };

  const handleProfileImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateUserData({ profileImage: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDocUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && activeDocId) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const updatedDocs = userData.documents.map((doc) =>
          doc.id === activeDocId
            ? { ...doc, status: 'uploaded' as const, file: reader.result as string }
            : doc
        );
        updateUserData({ documents: updatedDocs });
      };
      reader.readAsDataURL(file);
    }
    setActiveDocId('');
  };

  const handleSaveFinance = () => {
    updateUserData(financeForm);
    setShowFinanceModal(false);
  };

  const getCropNames = () => {
    const cropMap: Record<string, { en: string; hi: string }> = {
      wheat: { en: 'Wheat', hi: 'गेहूँ' },
      rice: { en: 'Rice', hi: 'धान' },
      maize: { en: 'Maize', hi: 'मक्का' },
      soybean: { en: 'Soybean', hi: 'सोयाबीन' },
      cotton: { en: 'Cotton', hi: 'कपास' },
      sugarcane: { en: 'Sugarcane', hi: 'गन्ना' },
      vegetables: { en: 'Vegetables', hi: 'सब्जियां' },
      pulses: { en: 'Pulses', hi: 'दालें' },
      fruits: { en: 'Fruits', hi: 'फल' },
      spices: { en: 'Spices', hi: 'मसाले' },
    };
    return userData.selectedCrops
      .map((c) => (isHindi ? cropMap[c]?.hi : cropMap[c]?.en) || c)
      .join(', ') || (isHindi ? 'जोड़ें' : 'Add');
  };

<<<<<<< HEAD
  const getIrrigationNames = () => {
    const irrMap: Record<string, { en: string; hi: string }> = {
      borewell: { en: 'Borewell', hi: 'बोरवेल' },
      canal: { en: 'Canal', hi: 'नहर' },
      rainfed: { en: 'Rain-fed', hi: 'वर्षा आधारित' },
      river: { en: 'River', hi: 'नदी' },
      pond: { en: 'Pond', hi: 'तालाब' },
      drip: { en: 'Drip', hi: 'ड्रिप' },
    };
    return userData.irrigation
      .map((i) => (isHindi ? irrMap[i]?.hi : irrMap[i]?.en) || i)
      .join(', ') || (isHindi ? 'जोड़ें' : 'Add');
  };

  const getOwnership = () => {
    const map: Record<string, { en: string; hi: string }> = {
      owner: { en: 'Owner', hi: 'मालिक' },
      tenant: { en: 'Tenant', hi: 'किरायेदार' },
      sharecropper: { en: 'Sharecropper', hi: 'बटाईदार' },
    };
    return isHindi ? map[userData.landOwnership]?.hi || 'जोड़ें' : map[userData.landOwnership]?.en || 'Add';
  };

  const getGender = () => {
    const map: Record<string, { en: string; hi: string }> = {
      Male: { en: 'Male', hi: 'पुरुष' },
      Female: { en: 'Female', hi: 'महिला' },
      Other: { en: 'Other', hi: 'अन्य' },
    };
    return isHindi ? map[userData.gender]?.hi || 'जोड़ें' : map[userData.gender]?.en || 'Add';
  };

  const inputClass =
    'w-full px-4 py-3 bg-[#F7F3EE] rounded-2xl border-2 border-transparent outline-none focus:border-[#F5A623] focus:bg-white transition-all text-[14px]';

  return (
    <div className="min-h-screen bg-[#F7F3EE] pb-24">
      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleProfileImageUpload} />
      <input ref={docInputRef} type="file" accept="image/*,.pdf" className="hidden" onChange={handleDocUpload} />

=======
  const documentMeta: {
    key: DocumentKey;
    name: string;
    nameHi: string;
    warning?: string;
  }[] = [
    { key: "aadhaar", name: "Aadhaar Card", nameHi: "आधार कार्ड" },
    { key: "land", name: "Land Records", nameHi: "भूमि रिकॉर्ड" },
    {
      key: "bank",
      name: "Bank Passbook",
      nameHi: "बैंक पासबुक",
      warning: "Expired?",
    },
    { key: "photo", name: "Passport Photo", nameHi: "पासपोर्ट फोटो" },
  ];

  return (
    <div className="min-h-screen bg-[#F7F3EE] pb-20">
      <Toaster richColors closeButton />
>>>>>>> 7b4431a7924aeb4c3ea7a2dcf97dad9c58e4f828
      {/* Header */}
      <div className="bg-gradient-to-b from-[#1A3C1A] to-[#2D6A2D] pt-10 pb-16 px-4">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <h2 className="text-white font-semibold text-[16px]">
            {isHindi ? 'मेरी प्रोफ़ाइल' : 'My Profile'}
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
            {userData.name || (isHindi ? 'नाम जोड़ें' : 'Add Name')}
          </motion.h1>

          {(userData.state || userData.district) && (
            <div className="flex items-center gap-1 text-[#97BC62] text-[14px] mb-1">
              <span>📍</span>
              <span>{userData.district}{userData.district && userData.state ? ', ' : ''}{userData.state}</span>
            </div>
          )}

          <p className="text-[#C8D8C8] text-[12px] mb-2">
            {isHindi ? `सदस्य: ${userData.memberSince}` : `Member since ${userData.memberSince}`}
          </p>

          {userData.aadhaarVerified && (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-1 bg-[#97BC62]/20 px-3 py-1 rounded-full">
              <Shield className="w-3 h-3 text-[#97BC62]" />
              <span className="text-[#97BC62] text-[11px] font-semibold">
                {isHindi ? 'आधार सत्यापित' : 'Aadhaar Verified'}
              </span>
            </motion.div>
          )}
        </div>
      </div>

      {/* Profile Completion Card */}
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
                {isHindi ? 'प्रोफ़ाइल पूर्णता' : 'Profile Completion'}
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
                {isHindi ? `${pendingTasks.length} चीज़ें बाकी हैं:` : `${pendingTasks.length} items remaining:`}
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
                    <span className="text-[12px] text-[#1C1C1E]">{isHindi ? task.hi : task.en}</span>
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
            {isHindi ? 'प्रोफ़ाइल पूरा करें' : 'Complete Profile'}
          </motion.button>
        </motion.div>
      </div>

      {/* Sections */}
      <div className="px-4 space-y-3">

        {/* ── Personal Information ── */}
        <motion.div
          ref={(el) => { sectionRefs.current['personal'] = el; }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden"
        >
          <button
            onClick={() => toggleSection('personal')}
            className="w-full px-5 py-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center">
                <User className="w-5 h-5 text-blue-500" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-[15px] text-[#1C1C1E]">
                  {isHindi ? 'व्यक्तिगत जानकारी' : 'Personal Information'}
                </h3>
                <p className="text-[11px] text-[#6B7280]">
                  {userData.name || (isHindi ? 'जानकारी जोड़ें' : 'Add info')}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => { e.stopPropagation(); navigate('/onboarding/profile'); }}
                className="w-8 h-8 rounded-full bg-[#F5A623]/10 flex items-center justify-center"
              >
                <Edit2 className="w-3.5 h-3.5 text-[#F5A623]" />
              </button>
              {expandedSection === 'personal'
                ? <ChevronUp className="w-5 h-5 text-[#6B7280]" />
                : <ChevronDown className="w-5 h-5 text-[#6B7280]" />}
            </div>
          </button>

          <AnimatePresence>
            {expandedSection === 'personal' && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                style={{ overflow: 'visible' }}
              >
                <div className="px-5 pb-5 space-y-3 border-t border-gray-50 pt-3">
                  {/* Profile Image Upload */}
                  <div className="flex items-center gap-4 bg-[#F7F3EE] rounded-2xl p-4">
                    <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center overflow-hidden border-2 border-dashed border-[#F5A623]/40">
                      {userData.profileImage
                        ? <img src={userData.profileImage} alt="Profile" className="w-full h-full object-cover" />
                        : <Camera className="w-6 h-6 text-gray-300" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-[13px] font-semibold text-[#1C1C1E]">
                        {isHindi ? 'प्रोफ़ाइल फोटो' : 'Profile Photo'}
                      </p>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="text-[12px] text-[#F5A623] font-medium mt-1 flex items-center gap-1"
                      >
                        <Upload className="w-3 h-3" />
                        {userData.profileImage ? (isHindi ? 'बदलें' : 'Change') : (isHindi ? 'अपलोड करें' : 'Upload')}
                      </button>
                    </div>
                  </div>

                  {[
                    { label: isHindi ? 'नाम' : 'Name', value: userData.name },
                    { label: isHindi ? 'उम्र' : 'Age', value: userData.age ? `${userData.age} ${isHindi ? 'वर्ष' : 'years'}` : '' },
                    { label: isHindi ? 'लिंग' : 'Gender', value: getGender() },
                    { label: isHindi ? 'मोबाइल' : 'Mobile', value: userData.mobile ? `+91 ${userData.mobile}` : '' },
                    { label: isHindi ? 'आधार' : 'Aadhaar', value: userData.aadhaar || '' },
                  ].map((info, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                      <span className="text-[13px] text-[#6B7280]">{info.label}</span>
                      <span className={`text-[13px] font-medium ${info.value ? 'text-[#1C1C1E]' : 'text-[#F5A623]'}`}>
                        {info.value || (isHindi ? '+ जोड़ें' : '+ Add')}
                      </span>
                    </div>
                  ))}

                  <motion.button
                    onClick={() => navigate('/onboarding/profile')}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-[#F5A623] text-white py-3 rounded-2xl font-bold text-[14px] shadow-md shadow-[#F5A623]/20 flex items-center justify-center gap-2 mt-2"
                  >
                    <Edit2 className="w-4 h-4" />
                    {isHindi ? 'संपादित करें' : 'Edit Details'}
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ── Farming Details ── */}
        <motion.div
          ref={(el) => { sectionRefs.current['farming'] = el; }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden"
        >
          <button
            onClick={() => toggleSection('farming')}
            className="w-full px-5 py-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-green-50 flex items-center justify-center">
                <Sprout className="w-5 h-5 text-green-500" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-[15px] text-[#1C1C1E]">
                  {isHindi ? 'कृषि विवरण' : 'Farm Details'}
                </h3>
                <p className="text-[11px] text-[#6B7280]">
                  {userData.landSize > 0 ? `${userData.landSize} ${userData.landUnit}` : (isHindi ? 'जानकारी जोड़ें' : 'Add info')}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => { e.stopPropagation(); navigate('/onboarding/farm-details'); }}
                className="w-8 h-8 rounded-full bg-[#F5A623]/10 flex items-center justify-center"
              >
                <Edit2 className="w-3.5 h-3.5 text-[#F5A623]" />
              </button>
              {expandedSection === 'farming'
                ? <ChevronUp className="w-5 h-5 text-[#6B7280]" />
                : <ChevronDown className="w-5 h-5 text-[#6B7280]" />}
            </div>
          </button>

          <AnimatePresence>
            {expandedSection === 'farming' && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                style={{ overflow: 'visible' }}
              >
                <div className="px-5 pb-5 space-y-3 border-t border-gray-50 pt-3">
                  {[
                    { label: isHindi ? 'भूमि आकार' : 'Land Size', value: userData.landSize > 0 ? `${userData.landSize} ${userData.landUnit}` : '' },
                    { label: isHindi ? 'स्वामित्व' : 'Ownership', value: getOwnership() },
                    { label: isHindi ? 'फसलें' : 'Crops', value: getCropNames() },
                    { label: isHindi ? 'सिंचाई' : 'Irrigation', value: getIrrigationNames() },
                    { label: isHindi ? 'मौसम' : 'Seasons', value: userData.selectedSeasons.join(', ') || (isHindi ? 'जोड़ें' : 'Add') },
                  ].map((info, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                      <span className="text-[13px] text-[#6B7280]">{info.label}</span>
                      <span className={`text-[13px] font-medium text-right max-w-[55%] ${info.value && info.value !== (isHindi ? 'जोड़ें' : 'Add') ? 'text-[#1C1C1E]' : 'text-[#F5A623]'}`}>
                        {info.value || (isHindi ? '+ जोड़ें' : '+ Add')}
                      </span>
                    </div>
                  ))}

                  <motion.button
                    onClick={() => navigate('/onboarding/farm-details')}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-[#F5A623] text-white py-3 rounded-2xl font-bold text-[14px] shadow-md shadow-[#F5A623]/20 flex items-center justify-center gap-2 mt-2"
                  >
                    <Edit2 className="w-4 h-4" />
                    {isHindi ? 'संपादित करें' : 'Edit Details'}
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ── Financial Info ── */}
        <motion.div
          ref={(el) => { sectionRefs.current['economic'] = el; }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden"
        >
          <button
            onClick={() => toggleSection('economic')}
            className="w-full px-5 py-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center">
                <Wallet className="w-5 h-5 text-amber-500" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-[15px] text-[#1C1C1E]">
                  {isHindi ? 'आर्थिक जानकारी' : 'Financial Information'}
                </h3>
                <p className="text-[11px] text-[#6B7280]">
                  {userData.annualIncome || (isHindi ? 'जानकारी जोड़ें' : 'Add info')}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => { e.stopPropagation(); setShowFinanceModal(true); }}
                className="w-8 h-8 rounded-full bg-[#F5A623]/10 flex items-center justify-center"
              >
                <Edit2 className="w-3.5 h-3.5 text-[#F5A623]" />
              </button>
              {expandedSection === 'economic'
                ? <ChevronUp className="w-5 h-5 text-[#6B7280]" />
                : <ChevronDown className="w-5 h-5 text-[#6B7280]" />}
            </div>
          </button>

<<<<<<< HEAD
          <AnimatePresence>
            {expandedSection === 'economic' && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                style={{ overflow: 'visible' }}
              >
                <div className="px-5 pb-5 space-y-3 border-t border-gray-50 pt-3">
                  {[
                    { label: isHindi ? 'वार्षिक आय' : 'Annual Income', value: userData.annualIncome },
                    { label: isHindi ? 'आय स्रोत' : 'Income Source', value: userData.incomeSource },
                    { label: isHindi ? 'श्रेणी' : 'Category', value: userData.category },
                    { label: isHindi ? 'बैंक' : 'Bank', value: userData.bankName },
                    { label: isHindi ? 'खाता संख्या' : 'Account No.', value: userData.bankAccount ? `XXXXXX${userData.bankAccount.slice(-4)}` : '' },
                    { label: isHindi ? 'IFSC कोड' : 'IFSC Code', value: userData.ifscCode },
                    { label: isHindi ? 'PM-किसान' : 'PM-Kisan', value: userData.pmKisanStatus },
                  ].map((info, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                      <span className="text-[13px] text-[#6B7280]">{info.label}</span>
                      <span className={`text-[13px] font-medium ${info.value ? 'text-[#1C1C1E]' : 'text-[#F5A623]'}`}>
                        {info.value || (isHindi ? '+ जोड़ें' : '+ Add')}
                      </span>
                    </div>
                  ))}
=======
          {expandedSection === 'documents' && (
            <div className="px-4 pb-4 border-t border-gray-100 pt-3">
              <div className="grid grid-cols-2 gap-2 mb-3">
                {documentMeta.map((meta) => {
                  const state = documents[meta.key];
                  const isUploading = state.status === "uploading";
                  const isSuccess = state.status === "success";
                  const isError = state.status === "error";
                  const isExpired = !!meta.warning && isSuccess;
                  const borderColor = isError
                    ? "border-red-400 bg-red-50"
                    : isExpired
                    ? "border-[#FB923C] bg-[#FFF4E6]"
                    : isSuccess
                    ? "border-[#97BC62] bg-[#F0FDF4]"
                    : "border-gray-200 bg-gray-50";

                  const icon = isUploading
                    ? "⏳"
                    : isError
                    ? "⚠️"
                    : isSuccess
                    ? "✅"
                    : "📷";

                  const isImagePreview = !!state.previewUrl;

                  const fileSizeMb =
                    state.file && state.file.size
                      ? (state.file.size / (1024 * 1024)).toFixed(1)
                      : undefined;

                  return (
                    <div key={meta.key} className="space-y-1">
                      <button
                        type="button"
                        onClick={() => handleCardClick(meta.key)}
                        className={`w-full rounded-xl p-3 text-left border transition hover:shadow-sm hover:border-[#1A3C1A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#1A3C1A] ${borderColor}`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-1.5 mb-1">
                              <span className="text-lg">{icon}</span>
                              <p className="text-[11px] text-[#1C1C1E] font-medium">
                                {meta.nameHi}
                              </p>
                            </div>

                            {!state.file && (
                              <p className="text-[10px] text-[#6B7280]">
                                Tap to upload {meta.name}. JPG, PNG or PDF (max
                                5MB)
                              </p>
                            )}

                            {state.file && (
                              <div className="mt-1">
                                <p className="text-[10px] text-[#374151] truncate">
                                  {state.file.name}
                                </p>
                                {fileSizeMb && (
                                  <p className="text-[9px] text-[#6B7280]">
                                    {fileSizeMb} MB
                                  </p>
                                )}
                              </div>
                            )}

                            {isUploading && (
                              <div className="mt-2">
                                <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-[#F5A623] transition-all"
                                    style={{ width: `${state.progress}%` }}
                                  />
                                </div>
                                <p className="text-[9px] text-[#6B7280] mt-1">
                                  Uploading... {state.progress}%
                                </p>
                              </div>
                            )}

                            {isSuccess && (
                              <p className="text-[9px] text-[#16A34A] mt-1">
                                Uploaded successfully
                                {state.uploadedAt
                                  ? ` • ${state.uploadedAt.toLocaleTimeString([], {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}`
                                  : ""}
                              </p>
                            )}

                            {isError && state.error && (
                              <p className="text-[9px] text-red-500 mt-1">
                                {state.error}
                              </p>
                            )}

                            {meta.warning && isSuccess && (
                              <p className="text-[9px] text-[#FB923C] mt-1 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />
                                {meta.warning}
                              </p>
                            )}
                          </div>

                          {isImagePreview && (
                            <div className="w-12 h-12 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={state.previewUrl}
                                alt={meta.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                        </div>

                        {state.file && !isUploading && (
                          <div className="mt-2 flex justify-end">
                            <span className="text-[10px] text-[#1A3C1A] font-medium underline">
                              Change
                            </span>
                          </div>
                        )}
                      </button>

                      <input
                        ref={inputRefs[meta.key]}
                        type="file"
                        accept="image/*,application/pdf"
                        className="hidden"
                        onChange={(e) => handleFileChange(meta.key, e)}
                      />
                    </div>
                  );
                })}
              </div>
              <button className="w-full border-2 border-dashed border-gray-300 rounded-xl py-3 text-[13px] text-[#6B7280] font-medium">
                + Add Document
              </button>
            </div>
          )}
        </div>
>>>>>>> 7b4431a7924aeb4c3ea7a2dcf97dad9c58e4f828

                  <motion.button
                    onClick={() => setShowFinanceModal(true)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-[#F5A623] text-white py-3 rounded-2xl font-bold text-[14px] shadow-md shadow-[#F5A623]/20 flex items-center justify-center gap-2 mt-2"
                  >
                    <Edit2 className="w-4 h-4" />
                    {isHindi ? 'जानकारी अपडेट करें' : 'Update Financial Info'}
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ── Documents ── */}
        <motion.div
          ref={(el) => { sectionRefs.current['documents'] = el; }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden"
        >
          <button
            onClick={() => toggleSection('documents')}
            className="w-full px-5 py-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-50 flex items-center justify-center">
                <FileText className="w-5 h-5 text-purple-500" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-[15px] text-[#1C1C1E]">
                  {isHindi ? 'मेरे दस्तावेज़' : 'My Documents'}
                </h3>
                <p className="text-[11px] text-[#6B7280]">
                  {userData.documents.filter((d) => d.status === 'uploaded').length}/{userData.documents.length} {isHindi ? 'अपलोड' : 'uploaded'}
                </p>
              </div>
            </div>
            {expandedSection === 'documents'
              ? <ChevronUp className="w-5 h-5 text-[#6B7280]" />
              : <ChevronDown className="w-5 h-5 text-[#6B7280]" />}
          </button>

          <AnimatePresence>
            {expandedSection === 'documents' && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                style={{ overflow: 'visible' }}
              >
                <div className="px-5 pb-5 border-t border-gray-50 pt-3">
                  <div className="grid grid-cols-2 gap-3">
                    {userData.documents.map((doc) => (
                      <motion.button
                        key={doc.id}
                        onClick={() => {
                          setActiveDocId(doc.id);
                          docInputRef.current?.click();
                        }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        className={`rounded-2xl p-4 text-center border-2 transition-all ${
                          doc.status === 'uploaded'
                            ? 'bg-green-50 border-green-200'
                            : 'bg-gray-50 border-dashed border-gray-200 hover:border-[#F5A623]'
                        }`}
                      >
                        <div className="text-3xl mb-2">{doc.status === 'uploaded' ? '✅' : '📄'}</div>
                        <p className="text-[12px] text-[#1C1C1E] font-semibold">
                          {isHindi ? doc.nameHi : doc.name}
                        </p>
                        <p className={`text-[10px] mt-1 font-medium ${doc.status === 'uploaded' ? 'text-green-600' : 'text-[#F5A623]'}`}>
                          {doc.status === 'uploaded'
                            ? (isHindi ? 'अपलोड ✓' : 'Uploaded ✓')
                            : (isHindi ? '+ अपलोड करें' : '+ Upload')}
                        </p>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Language */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden"
        >
          <button
            onClick={() => setShowLanguageModal(true)}
            className="w-full px-5 py-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center">
                <Globe className="w-5 h-5 text-indigo-500" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-[15px] text-[#1C1C1E]">{isHindi ? 'भाषा' : 'Language'}</h3>
                <p className="text-[11px] text-[#6B7280]">{isHindi ? 'हिंदी' : 'English'}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-[#F7F3EE] px-3 py-1.5 rounded-full">
              <span className="text-[12px] font-semibold text-[#1C1C1E]">{isHindi ? 'हिं' : 'EN'}</span>
            </div>
          </button>
        </motion.div>

        {/* Sign Out */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className="w-full bg-white rounded-3xl shadow-sm border border-gray-100 px-5 py-4 flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-2xl bg-red-50 flex items-center justify-center">
            <LogOut className="w-5 h-5 text-red-500" />
          </div>
          <span className="font-semibold text-[15px] text-red-500">
            {isHindi ? 'साइन आउट' : 'Sign Out'}
          </span>
        </motion.button>
      </div>

      {/* ════════════════════════════════
          Finance Modal
          KEY FIX: flex-col layout so the
          scrollable body sits between a
          fixed header and fixed footer.
      ════════════════════════════════ */}
      <AnimatePresence>
        {showFinanceModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-end"
            onClick={() => setShowFinanceModal(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full bg-white rounded-t-3xl flex flex-col"
              style={{ maxHeight: '90vh' }}
            >
              {/* Fixed Header */}
              <div className="flex-shrink-0 px-6 pt-6 pb-4 border-b border-gray-100">
                <div className="flex items-center justify-between mb-1">
                  <h2 className="text-[18px] font-bold text-[#1C1C1E]">
                    {isHindi ? 'आर्थिक जानकारी' : 'Financial Information'}
                  </h2>
                  <button
                    onClick={() => setShowFinanceModal(false)}
                    className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
                  >
                    <X className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
                <p className="text-[12px] text-[#6B7280]">
                  {isHindi ? 'सही योजनाओं के लिए यह जानकारी ज़रूरी है' : 'This info is needed for matching schemes'}
                </p>
              </div>

              {/* Scrollable Body */}
              <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
                {/* Annual Income */}
                <div>
                  <label className="text-[12px] font-semibold text-[#6B7280] uppercase tracking-wider mb-2 block">
                    {isHindi ? 'वार्षिक आय' : 'Annual Income'}
                  </label>
                  <select
                    value={financeForm.annualIncome}
                    onChange={(e) => setFinanceForm({ ...financeForm, annualIncome: e.target.value })}
                    className={inputClass}
                  >
                    <option value="">{isHindi ? 'चुनें' : 'Select'}</option>
                    <option value="Below ₹50,000">{isHindi ? '₹50,000 से कम' : 'Below ₹50,000'}</option>
                    <option value="₹50,000 - ₹1,00,000">₹50,000 - ₹1,00,000</option>
                    <option value="₹1,00,000 - ₹2,50,000">₹1,00,000 - ₹2,50,000</option>
                    <option value="₹2,50,000 - ₹5,00,000">₹2,50,000 - ₹5,00,000</option>
                    <option value="Above ₹5,00,000">{isHindi ? '₹5,00,000 से अधिक' : 'Above ₹5,00,000'}</option>
                  </select>
                </div>

                {/* Income Source */}
                <div>
                  <label className="text-[12px] font-semibold text-[#6B7280] uppercase tracking-wider mb-2 block">
                    {isHindi ? 'आय का स्रोत' : 'Income Source'}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { en: 'Farming', hi: 'खेती' },
                      { en: 'Labour', hi: 'मजदूरी' },
                      { en: 'Business', hi: 'व्यापार' },
                      { en: 'Govt Job', hi: 'सरकारी नौकरी' },
                      { en: 'Other', hi: 'अन्य' },
                    ].map((src) => (
                      <button
                        key={src.en}
                        onClick={() => setFinanceForm({ ...financeForm, incomeSource: src.en })}
                        className={`px-4 py-2 rounded-full text-[12px] font-medium border-2 transition-all ${
                          financeForm.incomeSource === src.en
                            ? 'bg-[#F5A623] text-white border-[#F5A623]'
                            : 'bg-[#F7F3EE] text-[#6B7280] border-transparent'
                        }`}
                      >
                        {isHindi ? src.hi : src.en}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className="text-[12px] font-semibold text-[#6B7280] uppercase tracking-wider mb-2 block">
                    {isHindi ? 'श्रेणी' : 'Category'}
                  </label>
                  <div className="flex gap-2">
                    {[
                      { en: 'BPL', hi: 'BPL' },
                      { en: 'APL', hi: 'APL' },
                      { en: 'General', hi: 'सामान्य' },
                    ].map((cat) => (
                      <button
                        key={cat.en}
                        onClick={() => setFinanceForm({ ...financeForm, category: cat.en })}
                        className={`flex-1 py-3 rounded-2xl text-[13px] font-semibold border-2 transition-all ${
                          financeForm.category === cat.en
                            ? 'bg-[#F5A623] text-white border-[#F5A623]'
                            : 'bg-[#F7F3EE] text-[#6B7280] border-transparent'
                        }`}
                      >
                        {isHindi ? cat.hi : cat.en}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Bank Name */}
                <div>
                  <label className="text-[12px] font-semibold text-[#6B7280] uppercase tracking-wider mb-2 block">
                    {isHindi ? 'बैंक का नाम' : 'Bank Name'}
                  </label>
                  <input
                    type="text"
                    value={financeForm.bankName}
                    onChange={(e) => setFinanceForm({ ...financeForm, bankName: e.target.value })}
                    placeholder={isHindi ? 'जैसे: State Bank of India' : 'e.g. State Bank of India'}
                    className={inputClass}
                  />
                </div>

                {/* Account + IFSC */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[12px] font-semibold text-[#6B7280] uppercase tracking-wider mb-2 block">
                      {isHindi ? 'खाता संख्या' : 'Account No.'}
                    </label>
                    <input
                      type="text"
                      value={financeForm.bankAccount}
                      onChange={(e) => setFinanceForm({ ...financeForm, bankAccount: e.target.value })}
                      placeholder="XXXXXXXXXXXX"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="text-[12px] font-semibold text-[#6B7280] uppercase tracking-wider mb-2 block">
                      IFSC
                    </label>
                    <input
                      type="text"
                      value={financeForm.ifscCode}
                      onChange={(e) => setFinanceForm({ ...financeForm, ifscCode: e.target.value.toUpperCase() })}
                      placeholder="SBIN0001234"
                      className={inputClass}
                    />
                  </div>
                </div>

                {/* PM Kisan */}
                <div>
                  <label className="text-[12px] font-semibold text-[#6B7280] uppercase tracking-wider mb-2 block">
                    {isHindi ? 'PM-किसान स्थिति' : 'PM-Kisan Status'}
                  </label>
                  <div className="flex gap-2">
                    {[
                      { en: 'Active', hi: 'सक्रिय' },
                      { en: 'Inactive', hi: 'निष्क्रिय' },
                      { en: 'Not Enrolled', hi: 'नामांकित नहीं' },
                    ].map((status) => (
                      <button
                        key={status.en}
                        onClick={() => setFinanceForm({ ...financeForm, pmKisanStatus: status.en })}
                        className={`flex-1 py-2.5 rounded-2xl text-[12px] font-semibold border-2 transition-all ${
                          financeForm.pmKisanStatus === status.en
                            ? 'bg-[#F5A623] text-white border-[#F5A623]'
                            : 'bg-[#F7F3EE] text-[#6B7280] border-transparent'
                        }`}
                      >
                        {isHindi ? status.hi : status.en}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Fixed Footer — Save button always visible */}
              <div className="flex-shrink-0 px-6 py-4 border-t border-gray-100 bg-white">
                <motion.button
                  onClick={handleSaveFinance}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-[#F5A623] text-white py-4 rounded-2xl font-bold text-[15px] shadow-lg shadow-[#F5A623]/30 flex items-center justify-center gap-2"
                >
                  <Check className="w-5 h-5" />
                  {isHindi ? 'सहेजें' : 'Save'}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Language Modal */}
      <AnimatePresence>
        {showLanguageModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-6"
            onClick={() => setShowLanguageModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm bg-white rounded-3xl p-6"
            >
              <h3 className="text-[18px] font-bold text-[#1C1C1E] text-center mb-5">
                {isHindi ? 'भाषा चुनें' : 'Select Language'}
              </h3>
              <div className="space-y-3">
                {[
                  { code: 'hi' as const, name: 'हिंदी' },
                  { code: 'en' as const, name: 'English' },
                ].map((lang) => (
                  <motion.button
                    key={lang.code}
                    onClick={() => { setLanguage(lang.code); setShowLanguageModal(false); }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full py-4 rounded-2xl font-semibold text-[16px] transition-all border-2 flex items-center justify-center gap-2 ${
                      language === lang.code
                        ? 'bg-[#F5A623] text-white border-[#F5A623]'
                        : 'bg-[#F7F3EE] text-[#1C1C1E] border-transparent'
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

      <BottomNav />
    </div>
  );
}