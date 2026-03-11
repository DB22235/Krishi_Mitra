// import { useState, useCallback, useMemo } from 'react';
// import {
//   ArrowLeft,
//   Settings,
//   Bell,
//   BellOff,
//   Check,
//   CheckCheck,
//   Trash2,
//   Filter,
//   RefreshCw,
//   ChevronRight,
//   X,
//   Clock,
//   AlertCircle,
//   CheckCircle,
//   Info,
//   Sparkles,
//   Construction,
//   Rocket,
//   Home,
//   Volume2,
//   VolumeX,
//   Smartphone,
//   Mail,
// } from 'lucide-react';
// import { useNavigate } from 'react-router';
// import { motion, AnimatePresence } from 'motion/react';
// import { BottomNav } from '../components/BottomNav';
// import { useLanguage } from '../../context/LanguageContext';


// // ─── Notification interface ─────────────────────────────────────
// interface Notification {
//   id: string;
//   type: 'urgent' | 'success' | 'info' | 'reminder' | 'system';
//   icon: string;
//   title: string;
//   titleHi: string;
//   message: string;
//   messageHi: string;
//   time: string;
//   timeHi: string;
//   unread: boolean;
//   actionLabel?: string;
//   actionLabelHi?: string;
//   actionKey?: string; // For coming soon handler
//   actionPath?: string;
// }


// // ─── Filter options ─────────────────────────────────────────────
// const filterOptions = [
//   { en: 'All', hi: 'सभी', key: 'all' },
//   { en: 'Unread', hi: 'अपठित', key: 'unread' },
//   { en: 'Urgent', hi: 'तत्काल', key: 'urgent' },
//   { en: 'Schemes', hi: 'योजनाएं', key: 'info' },
//   { en: 'System', hi: 'सिस्टम', key: 'system' },
// ];


// // ─── Coming Soon Features ───────────────────────────────────────
// interface ComingSoonFeature {
//   title: string;
//   titleHi: string;
//   description: string;
//   descriptionHi: string;
//   icon: string;
//   expectedDate: string;
//   expectedDateHi: string;
// }


// const comingSoonFeatures: Record<string, ComingSoonFeature> = {
//   'scheme-details': {
//     title: 'Scheme Details',
//     titleHi: 'योजना विवरण',
//     description: 'View complete scheme details, eligibility criteria, and apply directly.',
//     descriptionHi: 'पूर्ण योजना विवरण, पात्रता मानदंड देखें और सीधे आवेदन करें।',
//     icon: '📋',
//     expectedDate: 'Coming in v2.0',
//     expectedDateHi: 'v2.0 में आ रहा है',
//   },
//   'notification-settings': {
//     title: 'Notification Settings',
//     titleHi: 'सूचना सेटिंग्स',
//     description: 'Customize which notifications you receive and how you receive them.',
//     descriptionHi: 'अनुकूलित करें कि आपको कौन सी सूचनाएं मिलें और कैसे मिलें।',
//     icon: '⚙️',
//     expectedDate: 'Coming in v1.5',
//     expectedDateHi: 'v1.5 में आ रहा है',
//   },
//   'soil-health': {
//     title: 'Soil Health Card',
//     titleHi: 'मृदा स्वास्थ्य कार्ड',
//     description: 'Book soil tests and view your soil health reports.',
//     descriptionHi: 'मृदा परीक्षण बुक करें और अपनी मृदा स्वास्थ्य रिपोर्ट देखें।',
//     icon: '🧪',
//     expectedDate: 'Coming in v2.0',
//     expectedDateHi: 'v2.0 में आ रहा है',
//   },
// };


// // ─── Component ──────────────────────────────────────────────────
// export function Notifications() {
//   const navigate = useNavigate();
//   const { language } = useLanguage();
//   const isHindi = language === 'hi';


//   // State
//   const [activeFilter, setActiveFilter] = useState('all');
//   const [isRefreshing, setIsRefreshing] = useState(false);
//   const [showComingSoon, setShowComingSoon] = useState(false);
//   const [comingSoonFeature, setComingSoonFeature] = useState<ComingSoonFeature | null>(null);
//   const [notifyEmail, setNotifyEmail] = useState('');
//   const [notifySubmitted, setNotifySubmitted] = useState(false);
//   const [showSettingsPreview, setShowSettingsPreview] = useState(false);


//   // Notifications data
//   const [notifications, setNotifications] = useState<Notification[]>([
//     {
//       id: '1',
//       type: 'urgent',
//       icon: '🔴',
//       title: 'PM-Kisan deadline in 3 days!',
//       titleHi: 'PM-Kisan की समय सीमा 3 दिन में!',
//       message: 'Last date to apply: March 31, 2026',
//       messageHi: 'आवेदन की अंतिम तिथि: 31 मार्च 2026',
//       time: '9:15 AM',
//       timeHi: 'सुबह 9:15',
//       unread: true,
//       actionLabel: 'Apply Now',
//       actionLabelHi: 'अभी आवेदन करें',
//       actionKey: 'scheme-details',
//       actionPath: '/schemes/pm-kisan',
//     },
//     {
//       id: '2',
//       type: 'success',
//       icon: '✅',
//       title: 'PMFBY application approved!',
//       titleHi: 'आपका PMFBY आवेदन स्वीकृत हो गया!',
//       message: '₹5,200 will be credited to your account soon',
//       messageHi: '₹5,200 जल्द आपके खाते में आएगा',
//       time: '8:47 AM',
//       timeHi: 'सुबह 8:47',
//       unread: true,
//       actionLabel: 'View Details',
//       actionLabelHi: 'विवरण देखें',
//       actionPath: '/applications',
//     },
//     {
//       id: '3',
//       type: 'info',
//       icon: '🌟',
//       title: 'New scheme matched for you!',
//       titleHi: 'आपके लिए नई योजना मिली!',
//       message: 'Soil Health Card Scheme - You might be eligible',
//       messageHi: 'मृदा स्वास्थ्य कार्ड योजना - आप पात्र हो सकते हैं',
//       time: 'Yesterday, 4:30 PM',
//       timeHi: 'कल, शाम 4:30',
//       unread: false,
//       actionLabel: 'Check Eligibility',
//       actionLabelHi: 'पात्रता जांचें',
//       actionKey: 'scheme-details',
//     },
//     {
//       id: '4',
//       type: 'system',
//       icon: '👤',
//       title: 'Complete your profile',
//       titleHi: 'प्रोफ़ाइल पूरी करें',
//       message: 'Profile 78% complete - Update 2 fields for better matches',
//       messageHi: 'प्रोफ़ाइल 78% पूर्ण - बेहतर मिलान के लिए 2 फ़ील्ड अपडेट करें',
//       time: 'Yesterday, 11:00 AM',
//       timeHi: 'कल, सुबह 11:00',
//       unread: false,
//       actionLabel: 'Complete Profile',
//       actionLabelHi: 'प्रोफ़ाइल पूरी करें',
//       actionPath: '/profile',
//     },
//     {
//       id: '5',
//       type: 'success',
//       icon: '🔐',
//       title: 'Documents verified successfully',
//       titleHi: 'दस्तावेज़ सफलतापूर्वक सत्यापित',
//       message: 'Aadhaar and Bank details verified',
//       messageHi: 'आधार और बैंक विवरण सत्यापित हो गए',
//       time: '2 days ago',
//       timeHi: '2 दिन पहले',
//       unread: false,
//     },
//     {
//       id: '6',
//       type: 'reminder',
//       icon: '🧪',
//       title: 'Soil health test reminder',
//       titleHi: 'मृदा स्वास्थ्य परीक्षण अनुस्मारक',
//       message: 'Last test was 8 months ago - Book a new test',
//       messageHi: 'आखिरी परीक्षण 8 महीने पहले हुआ था - नया परीक्षण बुक करें',
//       time: '3 days ago',
//       timeHi: '3 दिन पहले',
//       unread: false,
//       actionLabel: 'Book Test',
//       actionLabelHi: 'परीक्षण बुक करें',
//       actionKey: 'soil-health',
//     },
//     {
//       id: '7',
//       type: 'info',
//       icon: '📢',
//       title: 'Kisan Samman Nidhi installment',
//       titleHi: 'किसान सम्मान निधि किस्त',
//       message: '17th installment released - Check your account',
//       messageHi: '17वीं किस्त जारी - अपना खाता जांचें',
//       time: '5 days ago',
//       timeHi: '5 दिन पहले',
//       unread: false,
//     },
//   ]);


//   // ─── Computed values ──────────────────────────────────────
//   const unreadCount = useMemo(() => notifications.filter((n) => n.unread).length, [notifications]);


//   const filteredNotifications = useMemo(() => {
//     if (activeFilter === 'all') return notifications;
//     if (activeFilter === 'unread') return notifications.filter((n) => n.unread);
//     return notifications.filter((n) => n.type === activeFilter);
//   }, [notifications, activeFilter]);


//   const groupedNotifications = useMemo(() => {
//     const today: Notification[] = [];
//     const yesterday: Notification[] = [];
//     const earlier: Notification[] = [];


//     filteredNotifications.forEach((n) => {
//       if (n.time.toLowerCase().includes('am') || n.time.toLowerCase().includes('pm')) {
//         if (!n.time.toLowerCase().includes('yesterday')) {
//           today.push(n);
//         } else {
//           yesterday.push(n);
//         }
//       } else if (n.time.toLowerCase().includes('yesterday')) {
//         yesterday.push(n);
//       } else {
//         earlier.push(n);
//       }
//     });


//     return { today, yesterday, earlier };
//   }, [filteredNotifications]);


//   // ─── Handlers ─────────────────────────────────────────────
//   const handleRefresh = useCallback(() => {
//     setIsRefreshing(true);
//     setTimeout(() => setIsRefreshing(false), 1500);
//   }, []);


//   const handleMarkAllRead = useCallback(() => {
//     setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
//   }, []);


//   const handleMarkRead = useCallback((id: string) => {
//     setNotifications((prev) =>
//       prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
//     );
//   }, []);


//   const handleDelete = useCallback((id: string) => {
//     setNotifications((prev) => prev.filter((n) => n.id !== id));
//   }, []);


//   const handleFeatureClick = useCallback(
//     (featureKey?: string, fallbackPath?: string) => {
//       // If there's a direct path and no feature key, navigate
//       if (fallbackPath && !featureKey) {
//         navigate(fallbackPath);
//         return;
//       }


//       // Check if feature exists in coming soon
//       const feature = featureKey ? comingSoonFeatures[featureKey] : null;


//       if (feature) {
//         setComingSoonFeature(feature);
//         setShowComingSoon(true);
//         setNotifySubmitted(false);
//         setNotifyEmail('');
//       } else if (fallbackPath) {
//         navigate(fallbackPath);
//       } else {
//         // Generic coming soon
//         setComingSoonFeature({
//           title: 'Feature Coming Soon',
//           titleHi: 'फीचर जल्द आ रहा है',
//           description: 'This feature is under development.',
//           descriptionHi: 'यह फीचर विकास में है।',
//           icon: '🚀',
//           expectedDate: 'Coming Soon',
//           expectedDateHi: 'जल्द आ रहा है',
//         });
//         setShowComingSoon(true);
//       }
//     },
//     [navigate]
//   );


//   const handleNotifySubmit = useCallback(() => {
//     if (notifyEmail.trim()) {
//       setNotifySubmitted(true);
//       setTimeout(() => setShowComingSoon(false), 2000);
//     }
//   }, [notifyEmail]);


//   // ─── Notification styles ──────────────────────────────────
//   const getNotificationStyle = (type: string, unread: boolean) => {
//     const base = unread ? 'ring-2 ring-[#F5A623]/30' : '';
//     switch (type) {
//       case 'urgent':
//         return { border: 'border-l-4 border-[#FB923C]', iconBg: 'bg-[#FB923C]/15', base };
//       case 'success':
//         return { border: 'border-l-4 border-[#97BC62]', iconBg: 'bg-[#97BC62]/15', base };
//       case 'info':
//         return { border: 'border-l-4 border-[#60A5FA]', iconBg: 'bg-[#60A5FA]/15', base };
//       case 'reminder':
//         return { border: 'border-l-4 border-[#F5A623]', iconBg: 'bg-[#F5A623]/15', base };
//       case 'system':
//         return { border: 'border-l-4 border-gray-300', iconBg: 'bg-gray-100', base };
//       default:
//         return { border: '', iconBg: 'bg-gray-100', base };
//     }
//   };


//   // ─── Notification Card ────────────────────────────────────
//   const NotificationCard = ({ notif, index }: { notif: Notification; index: number }) => {
//     const styles = getNotificationStyle(notif.type, notif.unread);


//     return (
//       <motion.div
//         initial={{ opacity: 0, y: 10 }}
//         animate={{ opacity: 1, y: 0 }}
//         exit={{ opacity: 0, x: -100 }}
//         transition={{ duration: 0.2, delay: index * 0.03 }}
//         className={`bg-white rounded-2xl p-4 shadow-sm ${styles.border} ${styles.base} relative overflow-hidden`}
//       >
//         {/* Swipe hint gradient */}
//         {notif.unread && (
//           <div className="absolute top-0 right-0 w-16 h-full bg-gradient-to-l from-[#F5A623]/5 to-transparent pointer-events-none" />
//         )}


//         <div className="flex items-start gap-3">
//           {/* Icon */}
//           <div
//             className={`w-11 h-11 rounded-2xl ${styles.iconBg} flex items-center justify-center text-xl flex-shrink-0`}
//           >
//             {notif.icon}
//           </div>


//           {/* Content */}
//           <div className="flex-1 min-w-0">
//             <div className="flex items-start justify-between gap-2 mb-1">
//               <h3 className="font-semibold text-[14px] text-[#1C1C1E] leading-tight">
//                 {isHindi ? notif.titleHi : notif.title}
//               </h3>
//               {notif.unread && (
//                 <span className="w-2.5 h-2.5 rounded-full bg-[#F5A623] flex-shrink-0 mt-1" />
//               )}
//             </div>
//             <p className="text-[13px] text-[#6B7280] mb-2 leading-relaxed">
//               {isHindi ? notif.messageHi : notif.message}
//             </p>
//             <div className="flex items-center gap-3">
//               <span className="text-[11px] text-[#9CA3AF] flex items-center gap-1">
//                 <Clock className="w-3 h-3" />
//                 {isHindi ? notif.timeHi : notif.time}
//               </span>
//               {notif.unread && (
//                 <button
//                   onClick={() => handleMarkRead(notif.id)}
//                   className="text-[11px] text-[#2D6A2D] font-medium flex items-center gap-1"
//                 >
//                   <Check className="w-3 h-3" />
//                   {isHindi ? 'पढ़ा गया' : 'Mark read'}
//                 </button>
//               )}
//             </div>
//           </div>
//         </div>


//         {/* Action Button */}
//         {(notif.actionLabel || notif.actionLabelHi) && (
//           <button
//             onClick={() => {
//               handleMarkRead(notif.id);
//               handleFeatureClick(notif.actionKey, notif.actionPath);
//             }}
//             className={`w-full mt-3 py-2.5 rounded-xl font-semibold text-[13px] flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${
//               notif.type === 'urgent'
//                 ? 'bg-[#F5A623] text-white shadow-sm shadow-[#F5A623]/20'
//                 : notif.type === 'success'
//                 ? 'bg-[#97BC62]/10 text-[#2D6A2D] border border-[#97BC62]/30'
//                 : 'bg-[#F7F3EE] text-[#1C1C1E]'
//             }`}
//           >
//             {isHindi ? notif.actionLabelHi : notif.actionLabel}
//             <ChevronRight className="w-4 h-4" />
//           </button>
//         )}
//       </motion.div>
//     );
//   };


//   // ─── Settings Preview Modal ───────────────────────────────
//   const renderSettingsPreview = () => (
//     <AnimatePresence>
//       {showSettingsPreview && (
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           exit={{ opacity: 0 }}
//           className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end justify-center"
//           onClick={() => setShowSettingsPreview(false)}
//         >
//           <motion.div
//             initial={{ y: '100%' }}
//             animate={{ y: 0 }}
//             exit={{ y: '100%' }}
//             transition={{ type: 'spring', damping: 25 }}
//             className="bg-white rounded-t-3xl w-full max-h-[80vh] overflow-hidden"
//             onClick={(e) => e.stopPropagation()}
//           >
//             {/* Header */}
//             <div className="px-6 pt-6 pb-4 border-b border-gray-100">
//               <div className="flex items-center justify-between mb-1">
//                 <h3 className="font-bold text-[18px] text-[#1C1C1E]">
//                   {isHindi ? 'सूचना सेटिंग्स' : 'Notification Settings'}
//                 </h3>
//                 <button
//                   onClick={() => setShowSettingsPreview(false)}
//                   className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center"
//                 >
//                   <X className="w-4 h-4 text-gray-500" />
//                 </button>
//               </div>
//               <p className="text-[12px] text-[#6B7280]">
//                 {isHindi ? 'सूचनाएं प्रबंधित करें' : 'Manage your notifications'}
//               </p>
//             </div>


//             {/* Settings List */}
//             <div className="p-6 space-y-4">
//               {/* Push Notifications */}
//               <div className="flex items-center justify-between p-4 bg-[#F7F3EE] rounded-2xl">
//                 <div className="flex items-center gap-3">
//                   <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
//                     <Bell className="w-5 h-5 text-[#2D6A2D]" />
//                   </div>
//                   <div>
//                     <p className="font-semibold text-[14px] text-[#1C1C1E]">
//                       {isHindi ? 'पुश सूचनाएं' : 'Push Notifications'}
//                     </p>
//                     <p className="text-[11px] text-[#6B7280]">
//                       {isHindi ? 'मोबाइल पर अलर्ट' : 'Alerts on mobile'}
//                     </p>
//                   </div>
//                 </div>
//                 <div className="w-12 h-7 bg-[#97BC62] rounded-full relative">
//                   <div className="absolute right-1 top-1 w-5 h-5 bg-white rounded-full shadow-sm" />
//                 </div>
//               </div>


//               {/* SMS Notifications */}
//               <div className="flex items-center justify-between p-4 bg-[#F7F3EE] rounded-2xl">
//                 <div className="flex items-center gap-3">
//                   <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
//                     <Smartphone className="w-5 h-5 text-[#2D6A2D]" />
//                   </div>
//                   <div>
//                     <p className="font-semibold text-[14px] text-[#1C1C1E]">
//                       {isHindi ? 'SMS सूचनाएं' : 'SMS Notifications'}
//                     </p>
//                     <p className="text-[11px] text-[#6B7280]">
//                       {isHindi ? 'महत्वपूर्ण अपडेट' : 'Important updates'}
//                     </p>
//                   </div>
//                 </div>
//                 <div className="w-12 h-7 bg-[#97BC62] rounded-full relative">
//                   <div className="absolute right-1 top-1 w-5 h-5 bg-white rounded-full shadow-sm" />
//                 </div>
//               </div>


//               {/* Sound */}
//               <div className="flex items-center justify-between p-4 bg-[#F7F3EE] rounded-2xl">
//                 <div className="flex items-center gap-3">
//                   <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
//                     <Volume2 className="w-5 h-5 text-[#2D6A2D]" />
//                   </div>
//                   <div>
//                     <p className="font-semibold text-[14px] text-[#1C1C1E]">
//                       {isHindi ? 'ध्वनि' : 'Sound'}
//                     </p>
//                     <p className="text-[11px] text-[#6B7280]">
//                       {isHindi ? 'अधिसूचना ध्वनि' : 'Notification sound'}
//                     </p>
//                   </div>
//                 </div>
//                 <div className="w-12 h-7 bg-gray-200 rounded-full relative">
//                   <div className="absolute left-1 top-1 w-5 h-5 bg-white rounded-full shadow-sm" />
//                 </div>
//               </div>


//               {/* Coming soon note */}
//               <div className="bg-[#F5A623]/10 rounded-2xl p-4 flex items-start gap-3">
//                 <Construction className="w-5 h-5 text-[#F5A623] flex-shrink-0 mt-0.5" />
//                 <div>
//                   <p className="text-[13px] font-semibold text-[#1C1C1E]">
//                     {isHindi ? 'पूर्ण सेटिंग्स जल्द आ रही हैं' : 'Full settings coming soon'}
//                   </p>
//                   <p className="text-[11px] text-[#6B7280] mt-0.5">
//                     {isHindi
//                       ? 'अधिक अनुकूलन विकल्प v1.5 में उपलब्ध होंगे'
//                       : 'More customization options will be available in v1.5'}
//                   </p>
//                 </div>
//               </div>
//             </div>


//             {/* Footer */}
//             <div className="px-6 py-4 border-t border-gray-100">
//               <button
//                 onClick={() => setShowSettingsPreview(false)}
//                 className="w-full py-3 bg-[#2D6A2D] text-white rounded-xl font-semibold text-[14px] active:scale-[0.98] transition-all"
//               >
//                 {isHindi ? 'हो गया' : 'Done'}
//               </button>
//             </div>
//           </motion.div>
//         </motion.div>
//       )}
//     </AnimatePresence>
//   );


//   // ─── Coming Soon Modal ────────────────────────────────────
//   const renderComingSoonModal = () => (
//     <AnimatePresence>
//       {showComingSoon && comingSoonFeature && (
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           exit={{ opacity: 0 }}
//           className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
//           onClick={() => setShowComingSoon(false)}
//         >
//           <motion.div
//             initial={{ scale: 0.9, opacity: 0, y: 20 }}
//             animate={{ scale: 1, opacity: 1, y: 0 }}
//             exit={{ scale: 0.9, opacity: 0, y: 20 }}
//             transition={{ type: 'spring', damping: 25, stiffness: 300 }}
//             className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl"
//             onClick={(e) => e.stopPropagation()}
//           >
//             {/* Header */}
//             <div className="bg-gradient-to-br from-[#2D6A2D] via-[#3D8A3D] to-[#97BC62] p-6 text-center relative overflow-hidden">
//               <div className="absolute top-0 left-0 w-20 h-20 bg-white/10 rounded-full -translate-x-10 -translate-y-10" />
//               <div className="absolute bottom-0 right-0 w-16 h-16 bg-white/10 rounded-full translate-x-8 translate-y-8" />


//               <button
//                 onClick={() => setShowComingSoon(false)}
//                 className="absolute top-4 right-4 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center"
//               >
//                 <X className="w-4 h-4 text-white" />
//               </button>


//               <motion.div
//                 initial={{ scale: 0 }}
//                 animate={{ scale: 1 }}
//                 transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
//                 className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg"
//               >
//                 <span className="text-4xl">{comingSoonFeature.icon}</span>
//               </motion.div>


//               <div className="flex items-center justify-center gap-2 mb-2">
//                 <Construction className="w-4 h-4 text-[#F5A623]" />
//                 <span className="text-[11px] font-bold text-[#F5A623] uppercase tracking-wider">
//                   {isHindi ? 'विकास में' : 'In Development'}
//                 </span>
//               </div>
//               <h3 className="text-white font-bold text-[20px] mb-1">
//                 {isHindi ? comingSoonFeature.titleHi : comingSoonFeature.title}
//               </h3>
//               <p className="text-white/70 text-[12px]">
//                 {isHindi ? comingSoonFeature.expectedDateHi : comingSoonFeature.expectedDate}
//               </p>
//             </div>


//             {/* Content */}
//             <div className="p-6">
//               <p className="text-[14px] text-[#6B7280] text-center leading-relaxed mb-6">
//                 {isHindi ? comingSoonFeature.descriptionHi : comingSoonFeature.description}
//               </p>


//               {/* Notify form */}
//               <AnimatePresence mode="wait">
//                 {!notifySubmitted ? (
//                   <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
//                     <p className="text-[12px] text-[#6B7280] text-center mb-3">
//                       {isHindi ? 'जब उपलब्ध हो तो सूचित करें:' : 'Get notified when available:'}
//                     </p>
//                     <div className="flex gap-2">
//                       <input
//                         type="email"
//                         value={notifyEmail}
//                         onChange={(e) => setNotifyEmail(e.target.value)}
//                         placeholder={isHindi ? 'आपका ईमेल' : 'Your email'}
//                         className="flex-1 px-4 py-3 bg-[#F7F3EE] rounded-xl text-[13px] outline-none focus:ring-2 focus:ring-[#F5A623]/30 border-2 border-transparent focus:border-[#F5A623]"
//                       />
//                       <button
//                         onClick={handleNotifySubmit}
//                         disabled={!notifyEmail.trim()}
//                         className={`px-4 py-3 rounded-xl font-semibold text-[13px] transition-all ${
//                           notifyEmail.trim()
//                             ? 'bg-[#F5A623] text-white active:scale-95'
//                             : 'bg-gray-200 text-gray-400 cursor-not-allowed'
//                         }`}
//                       >
//                         <Bell className="w-4 h-4" />
//                       </button>
//                     </div>
//                   </motion.div>
//                 ) : (
//                   <motion.div
//                     key="success"
//                     initial={{ opacity: 0, scale: 0.9 }}
//                     animate={{ opacity: 1, scale: 1 }}
//                     className="bg-[#97BC62]/10 rounded-2xl p-4 text-center"
//                   >
//                     <CheckCircle className="w-8 h-8 text-[#2D6A2D] mx-auto mb-2" />
//                     <p className="text-[14px] font-semibold text-[#2D6A2D]">
//                       {isHindi ? 'धन्यवाद!' : 'Thank you!'}
//                     </p>
//                     <p className="text-[12px] text-[#6B7280]">
//                       {isHindi ? 'हम आपको सूचित करेंगे।' : "We'll notify you."}
//                     </p>
//                   </motion.div>
//                 )}
//               </AnimatePresence>


//               {/* Actions */}
//               <div className="flex gap-3 mt-6">
//                 <button
//                   onClick={() => setShowComingSoon(false)}
//                   className="flex-1 py-3 border border-gray-200 text-[#1C1C1E] rounded-xl font-semibold text-[13px] active:scale-[0.97] transition-all"
//                 >
//                   {isHindi ? 'बंद करें' : 'Close'}
//                 </button>
//                 <button
//                   onClick={() => {
//                     setShowComingSoon(false);
//                     navigate('/dashboard');
//                   }}
//                   className="flex-1 py-3 bg-[#2D6A2D] text-white rounded-xl font-semibold text-[13px] flex items-center justify-center gap-2 active:scale-[0.97] transition-all"
//                 >
//                   <Home className="w-4 h-4" />
//                   {isHindi ? 'होम' : 'Home'}
//                 </button>
//               </div>
//             </div>
//           </motion.div>
//         </motion.div>
//       )}
//     </AnimatePresence>
//   );


//   return (
//     <div className="min-h-screen bg-[#F7F3EE] pb-24">
//       {/* ─── Header ──────────────────────────────────────────── */}
//       <div className="bg-gradient-to-b from-[#1A3C1A] to-[#2D6A2D] pt-10 pb-4 px-4 sticky top-0 z-20">
//         <div className="flex items-center justify-between mb-4">
//           <button
//             onClick={() => navigate('/dashboard')}
//             className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
//           >
//             <ArrowLeft className="w-5 h-5 text-white" />
//           </button>
//           <div className="text-center">
//             <h1 className="font-bold text-white text-[16px]">
//               {isHindi ? 'सूचनाएं' : 'Notifications'}
//             </h1>
//             {unreadCount > 0 && (
//               <p className="text-[11px] text-[#F5A623] font-medium">
//                 {unreadCount} {isHindi ? 'नई' : 'new'}
//               </p>
//             )}
//           </div>
//           <button
//             onClick={handleRefresh}
//             className={`w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors ${
//               isRefreshing ? 'animate-spin' : ''
//             }`}
//           >
//             <RefreshCw className="w-5 h-5 text-white" />
//           </button>
//         </div>


//         {/* Quick Actions */}
//         <div className="flex items-center justify-between bg-white/10 rounded-2xl px-4 py-2.5">
//           <button
//             onClick={handleMarkAllRead}
//             disabled={unreadCount === 0}
//             className={`flex items-center gap-2 text-[12px] font-medium ${
//               unreadCount > 0 ? 'text-white' : 'text-white/40'
//             }`}
//           >
//             <CheckCheck className="w-4 h-4" />
//             {isHindi ? 'सभी पढ़ें' : 'Mark all read'}
//           </button>
//           <div className="w-px h-4 bg-white/20" />
//           <button
//             onClick={() => setShowSettingsPreview(true)}
//             className="flex items-center gap-2 text-[12px] font-medium text-white"
//           >
//             <Settings className="w-4 h-4" />
//             {isHindi ? 'सेटिंग्स' : 'Settings'}
//           </button>
//         </div>
//       </div>


//       {/* Refreshing indicator */}
//       <AnimatePresence>
//         {isRefreshing && (
//           <motion.div
//             initial={{ height: 0, opacity: 0 }}
//             animate={{ height: 'auto', opacity: 1 }}
//             exit={{ height: 0, opacity: 0 }}
//             className="bg-[#F5A623]/10 py-2 text-center overflow-hidden"
//           >
//             <p className="text-[12px] text-[#F5A623] font-medium animate-pulse">
//               {isHindi ? 'रिफ्रेश हो रहा है...' : 'Refreshing...'}
//             </p>
//           </motion.div>
//         )}
//       </AnimatePresence>


//       <div className="px-4 pt-4">
//         {/* ─── Filter Chips ──────────────────────────────────── */}
//         <div className="flex gap-2 overflow-x-auto pb-3 mb-4 hide-scrollbar">
//           {filterOptions.map((filter) => (
//             <button
//               key={filter.key}
//               onClick={() => setActiveFilter(filter.key)}
//               className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-[12px] font-semibold whitespace-nowrap transition-all border ${
//                 activeFilter === filter.key
//                   ? 'bg-[#F5A623] text-white border-[#F5A623] shadow-sm shadow-[#F5A623]/30'
//                   : 'bg-white text-[#1C1C1E] border-gray-200'
//               }`}
//             >
//               <span>{isHindi ? filter.hi : filter.en}</span>
//               {filter.key === 'unread' && unreadCount > 0 && (
//                 <span
//                   className={`text-[10px] px-1.5 py-0.5 rounded-full ${
//                     activeFilter === filter.key ? 'bg-white/25 text-white' : 'bg-[#F5A623] text-white'
//                   }`}
//                 >
//                   {unreadCount}
//                 </span>
//               )}
//             </button>
//           ))}
//         </div>


//         {/* ─── Notification Stats ────────────────────────────── */}
//         <motion.div
//           initial={{ opacity: 0, y: 10 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="bg-white rounded-2xl p-4 mb-4 shadow-sm border border-gray-100 flex items-center gap-4"
//         >
//           <div className="w-12 h-12 rounded-2xl bg-[#F5A623]/10 flex items-center justify-center flex-shrink-0">
//             <Bell className="w-6 h-6 text-[#F5A623]" />
//           </div>
//           <div className="flex-1">
//             <p className="text-[14px] font-semibold text-[#1C1C1E]">
//               {filteredNotifications.length}{' '}
//               {isHindi ? 'सूचनाएं' : 'notifications'}
//             </p>
//             <p className="text-[12px] text-[#6B7280]">
//               {unreadCount > 0
//                 ? isHindi
//                   ? `${unreadCount} अपठित सूचनाएं`
//                   : `${unreadCount} unread notifications`
//                 : isHindi
//                 ? 'सभी पढ़ी गई'
//                 : 'All caught up!'}
//             </p>
//           </div>
//           {unreadCount === 0 && (
//             <div className="w-10 h-10 bg-[#97BC62]/10 rounded-full flex items-center justify-center">
//               <CheckCircle className="w-5 h-5 text-[#97BC62]" />
//             </div>
//           )}
//         </motion.div>


//         {/* ─── Notifications List ────────────────────────────── */}
//         {filteredNotifications.length === 0 ? (
//           <motion.div
//             initial={{ opacity: 0, y: 10 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center"
//           >
//             <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
//               <BellOff className="w-8 h-8 text-gray-300" />
//             </div>
//             <p className="text-[14px] text-[#1C1C1E] font-semibold mb-1">
//               {isHindi ? 'कोई सूचना नहीं' : 'No notifications'}
//             </p>
//             <p className="text-[12px] text-[#6B7280]">
//               {isHindi ? 'नई सूचनाएं यहां दिखेंगी' : 'New notifications will appear here'}
//             </p>
//           </motion.div>
//         ) : (
//           <div className="space-y-6">
//             {/* Today */}
//             {groupedNotifications.today.length > 0 && (
//               <div>
//                 <h2 className="font-bold text-[14px] text-[#1C1C1E] mb-3 flex items-center gap-2">
//                   <span className="w-2 h-2 bg-[#F5A623] rounded-full" />
//                   {isHindi ? 'आज' : 'Today'}
//                 </h2>
//                 <div className="space-y-3">
//                   {groupedNotifications.today.map((notif, index) => (
//                     <NotificationCard key={notif.id} notif={notif} index={index} />
//                   ))}
//                 </div>
//               </div>
//             )}


//             {/* Yesterday */}
//             {groupedNotifications.yesterday.length > 0 && (
//               <div>
//                 <h2 className="font-bold text-[14px] text-[#1C1C1E] mb-3 flex items-center gap-2">
//                   <span className="w-2 h-2 bg-gray-300 rounded-full" />
//                   {isHindi ? 'कल' : 'Yesterday'}
//                 </h2>
//                 <div className="space-y-3">
//                   {groupedNotifications.yesterday.map((notif, index) => (
//                     <NotificationCard key={notif.id} notif={notif} index={index} />
//                   ))}
//                 </div>
//               </div>
//             )}


//             {/* Earlier */}
//             {groupedNotifications.earlier.length > 0 && (
//               <div>
//                 <h2 className="font-bold text-[14px] text-[#1C1C1E] mb-3 flex items-center gap-2">
//                   <span className="w-2 h-2 bg-gray-200 rounded-full" />
//                   {isHindi ? 'पहले' : 'Earlier'}
//                 </h2>
//                 <div className="space-y-3">
//                   {groupedNotifications.earlier.map((notif, index) => (
//                     <NotificationCard key={notif.id} notif={notif} index={index} />
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>
//         )}


//         {/* ─── Settings Card ─────────────────────────────────── */}
//         <motion.button
//           initial={{ opacity: 0, y: 10 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.3 }}
//           onClick={() => setShowSettingsPreview(true)}
//           className="w-full bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-3 mt-6 active:scale-[0.98] transition-all"
//         >
//           <div className="w-11 h-11 rounded-2xl bg-[#2D6A2D]/10 flex items-center justify-center flex-shrink-0">
//             <Settings className="w-5 h-5 text-[#2D6A2D]" />
//           </div>
//           <div className="flex-1 text-left">
//             <h3 className="font-semibold text-[14px] text-[#1C1C1E]">
//               {isHindi ? 'सूचना सेटिंग्स' : 'Notification Settings'}
//             </h3>
//             <p className="text-[12px] text-[#6B7280]">
//               {isHindi ? 'प्राथमिकताएं प्रबंधित करें' : 'Manage preferences'}
//             </p>
//           </div>
//           <ChevronRight className="w-5 h-5 text-[#9CA3AF]" />
//         </motion.button>


//         {/* ─── Prototype Notice ──────────────────────────────── */}
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ delay: 0.5 }}
//           className="bg-[#F5A623]/5 border border-[#F5A623]/20 rounded-2xl p-4 mt-4 mb-4"
//         >
//           <div className="flex items-start gap-3">
//             <div className="w-8 h-8 bg-[#F5A623]/10 rounded-full flex items-center justify-center flex-shrink-0">
//               <Rocket className="w-4 h-4 text-[#F5A623]" />
//             </div>
//             <div>
//               <p className="text-[13px] font-semibold text-[#1C1C1E] mb-1">
//                 {isHindi ? '🚀 प्रोटोटाइप संस्करण' : '🚀 Prototype Version'}
//               </p>
//               <p className="text-[11px] text-[#6B7280] leading-relaxed">
//                 {isHindi
//                   ? 'यह डेमो डेटा है। वास्तविक सूचनाएं आपकी गतिविधि के आधार पर होंगी।'
//                   : 'This is demo data. Real notifications will be based on your activity.'}
//               </p>
//             </div>
//           </div>
//         </motion.div>
//       </div>


//       <BottomNav />


//       {/* Modals */}
//       {renderSettingsPreview()}
//       {renderComingSoonModal()}


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






import { useState, useCallback, useMemo } from 'react';
import {
  ArrowLeft,
  Settings,
  Bell,
  BellOff,
  Check,
  CheckCheck,
  Trash2,
  Filter,
  RefreshCw,
  ChevronRight,
  X,
  Clock,
  AlertCircle,
  CheckCircle,
  Info,
  Sparkles,
  Construction,
  Rocket,
  Home,
  Volume2,
  VolumeX,
  Smartphone,
  Mail,
} from 'lucide-react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { BottomNav } from '../components/BottomNav';
import { useLanguage } from '../../context/LanguageContext';


// ─── Notification interface ─────────────────────────────────────
interface Notification {
  id: string;
  type: 'urgent' | 'success' | 'info' | 'reminder' | 'system';
  icon: string;
  title: string;
  titleHi: string;
  titleMr: string;
  message: string;
  messageHi: string;
  messageMr: string;
  time: string;
  timeHi: string;
  timeMr: string;
  unread: boolean;
  actionLabel?: string;
  actionLabelHi?: string;
  actionLabelMr?: string;
  actionKey?: string;
  actionPath?: string;
}


// ─── Filter options ─────────────────────────────────────────────
const filterOptions = [
  { en: 'All', hi: 'सभी', mr: 'सर्व', key: 'all' },
  { en: 'Unread', hi: 'अपठित', mr: 'न वाचलेले', key: 'unread' },
  { en: 'Urgent', hi: 'तत्काल', mr: 'तातडीचे', key: 'urgent' },
  { en: 'Schemes', hi: 'योजनाएं', mr: 'योजना', key: 'info' },
  { en: 'System', hi: 'सिस्टम', mr: 'सिस्टम', key: 'system' },
];


// ─── Coming Soon Features ───────────────────────────────────────
interface ComingSoonFeature {
  title: string;
  titleHi: string;
  titleMr: string;
  description: string;
  descriptionHi: string;
  descriptionMr: string;
  icon: string;
  expectedDate: string;
  expectedDateHi: string;
  expectedDateMr: string;
}


const comingSoonFeatures: Record<string, ComingSoonFeature> = {
  'scheme-details': {
    title: 'Scheme Details',
    titleHi: 'योजना विवरण',
    titleMr: 'योजना तपशील',
    description: 'View complete scheme details, eligibility criteria, and apply directly.',
    descriptionHi: 'पूर्ण योजना विवरण, पात्रता मानदंड देखें और सीधे आवेदन करें।',
    descriptionMr: 'पूर्ण योजना तपशील, पात्रता निकष पहा आणि थेट अर्ज करा.',
    icon: '📋',
    expectedDate: 'Coming in v2.0',
    expectedDateHi: 'v2.0 में आ रहा है',
    expectedDateMr: 'v2.0 मध्ये येत आहे',
  },
  'notification-settings': {
    title: 'Notification Settings',
    titleHi: 'सूचना सेटिंग्स',
    titleMr: 'सूचना सेटिंग्ज',
    description: 'Customize which notifications you receive and how you receive them.',
    descriptionHi: 'अनुकूलित करें कि आपको कौन सी सूचनाएं मिलें और कैसे मिलें।',
    descriptionMr: 'तुम्हाला कोणत्या सूचना मिळतात आणि कशा मिळतात ते सानुकूलित करा.',
    icon: '⚙️',
    expectedDate: 'Coming in v1.5',
    expectedDateHi: 'v1.5 में आ रहा है',
    expectedDateMr: 'v1.5 मध्ये येत आहे',
  },
  'soil-health': {
    title: 'Soil Health Card',
    titleHi: 'मृदा स्वास्थ्य कार्ड',
    titleMr: 'मृदा आरोग्य कार्ड',
    description: 'Book soil tests and view your soil health reports.',
    descriptionHi: 'मृदा परीक्षण बुक करें और अपनी मृदा स्वास्थ्य रिपोर्ट देखें।',
    descriptionMr: 'मृदा चाचणी बुक करा आणि तुमचे मृदा आरोग्य अहवाल पहा.',
    icon: '🧪',
    expectedDate: 'Coming in v2.0',
    expectedDateHi: 'v2.0 में आ रहा है',
    expectedDateMr: 'v2.0 मध्ये येत आहे',
  },
};


// ─── Component ──────────────────────────────────────────────────
export function Notifications() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const isHindi = language === 'hi';
  const isMarathi = language === 'mr';

  // Helper to pick the right localized string
  const localize = (en: string, hi: string, mr: string) => {
    if (isMarathi) return mr;
    if (isHindi) return hi;
    return en;
  };


  // State
  const [activeFilter, setActiveFilter] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showComingSoon, setShowComingSoon] = useState(false);
  const [comingSoonFeature, setComingSoonFeature] = useState<ComingSoonFeature | null>(null);
  const [notifyEmail, setNotifyEmail] = useState('');
  const [notifySubmitted, setNotifySubmitted] = useState(false);
  const [showSettingsPreview, setShowSettingsPreview] = useState(false);


  // Notifications data
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'urgent',
      icon: '🔴',
      title: 'PM-Kisan deadline in 3 days!',
      titleHi: 'PM-Kisan की समय सीमा 3 दिन में!',
      titleMr: 'PM-Kisan ची अंतिम तारीख 3 दिवसांत!',
      message: 'Last date to apply: March 31, 2026',
      messageHi: 'आवेदन की अंतिम तिथि: 31 मार्च 2026',
      messageMr: 'अर्ज करण्याची अंतिम तारीख: 31 मार्च 2026',
      time: '9:15 AM',
      timeHi: 'सुबह 9:15',
      timeMr: 'सकाळी 9:15',
      unread: true,
      actionLabel: 'Apply Now',
      actionLabelHi: 'अभी आवेदन करें',
      actionLabelMr: 'आता अर्ज करा',
      actionKey: 'scheme-details',
      actionPath: '/schemes/pm-kisan',
    },
    {
      id: '2',
      type: 'success',
      icon: '✅',
      title: 'PMFBY application approved!',
      titleHi: 'आपका PMFBY आवेदन स्वीकृत हो गया!',
      titleMr: 'तुमचा PMFBY अर्ज मंजूर झाला!',
      message: '₹5,200 will be credited to your account soon',
      messageHi: '₹5,200 जल्द आपके खाते में आएगा',
      messageMr: '₹5,200 लवकरच तुमच्या खात्यात जमा होईल',
      time: '8:47 AM',
      timeHi: 'सुबह 8:47',
      timeMr: 'सकाळी 8:47',
      unread: true,
      actionLabel: 'View Details',
      actionLabelHi: 'विवरण देखें',
      actionLabelMr: 'तपशील पहा',
      actionPath: '/applications',
    },
    {
      id: '3',
      type: 'info',
      icon: '🌟',
      title: 'New scheme matched for you!',
      titleHi: 'आपके लिए नई योजना मिली!',
      titleMr: 'तुमच्यासाठी नवीन योजना जुळली!',
      message: 'Soil Health Card Scheme - You might be eligible',
      messageHi: 'मृदा स्वास्थ्य कार्ड योजना - आप पात्र हो सकते हैं',
      messageMr: 'मृदा आरोग्य कार्ड योजना - तुम्ही पात्र असू शकता',
      time: 'Yesterday, 4:30 PM',
      timeHi: 'कल, शाम 4:30',
      timeMr: 'काल, संध्याकाळी 4:30',
      unread: false,
      actionLabel: 'Check Eligibility',
      actionLabelHi: 'पात्रता जांचें',
      actionLabelMr: 'पात्रता तपासा',
      actionKey: 'scheme-details',
    },
    {
      id: '4',
      type: 'system',
      icon: '👤',
      title: 'Complete your profile',
      titleHi: 'प्रोफ़ाइल पूरी करें',
      titleMr: 'प्रोफाइल पूर्ण करा',
      message: 'Profile 78% complete - Update 2 fields for better matches',
      messageHi: 'प्रोफ़ाइल 78% पूर्ण - बेहतर मिलान के लिए 2 फ़ील्ड अपडेट करें',
      messageMr: 'प्रोफाइल 78% पूर्ण - चांगल्या जुळणीसाठी 2 फील्ड अपडेट करा',
      time: 'Yesterday, 11:00 AM',
      timeHi: 'कल, सुबह 11:00',
      timeMr: 'काल, सकाळी 11:00',
      unread: false,
      actionLabel: 'Complete Profile',
      actionLabelHi: 'प्रोफ़ाइल पूरी करें',
      actionLabelMr: 'प्रोफाइल पूर्ण करा',
      actionPath: '/profile',
    },
    {
      id: '5',
      type: 'success',
      icon: '🔐',
      title: 'Documents verified successfully',
      titleHi: 'दस्तावेज़ सफलतापूर्वक सत्यापित',
      titleMr: 'कागदपत्रे यशस्वीरीत्या सत्यापित',
      message: 'Aadhaar and Bank details verified',
      messageHi: 'आधार और बैंक विवरण सत्यापित हो गए',
      messageMr: 'आधार आणि बँक तपशील सत्यापित झाले',
      time: '2 days ago',
      timeHi: '2 दिन पहले',
      timeMr: '2 दिवसांपूर्वी',
      unread: false,
    },
    {
      id: '6',
      type: 'reminder',
      icon: '🧪',
      title: 'Soil health test reminder',
      titleHi: 'मृदा स्वास्थ्य परीक्षण अनुस्मारक',
      titleMr: 'मृदा आरोग्य चाचणी स्मरणपत्र',
      message: 'Last test was 8 months ago - Book a new test',
      messageHi: 'आखिरी परीक्षण 8 महीने पहले हुआ था - नया परीक्षण बुक करें',
      messageMr: 'शेवटची चाचणी 8 महिन्यांपूर्वी झाली - नवीन चाचणी बुक करा',
      time: '3 days ago',
      timeHi: '3 दिन पहले',
      timeMr: '3 दिवसांपूर्वी',
      unread: false,
      actionLabel: 'Book Test',
      actionLabelHi: 'परीक्षण बुक करें',
      actionLabelMr: 'चाचणी बुक करा',
      actionKey: 'soil-health',
    },
    {
      id: '7',
      type: 'info',
      icon: '📢',
      title: 'Kisan Samman Nidhi installment',
      titleHi: 'किसान सम्मान निधि किस्त',
      titleMr: 'किसान सन्मान निधी हप्ता',
      message: '17th installment released - Check your account',
      messageHi: '17वीं किस्त जारी - अपना खाता जांचें',
      messageMr: '17 वा हप्ता जारी - तुमचे खाते तपासा',
      time: '5 days ago',
      timeHi: '5 दिन पहले',
      timeMr: '5 दिवसांपूर्वी',
      unread: false,
    },
  ]);


  // ─── Computed values ──────────────────────────────────────
  const unreadCount = useMemo(() => notifications.filter((n) => n.unread).length, [notifications]);


  const filteredNotifications = useMemo(() => {
    if (activeFilter === 'all') return notifications;
    if (activeFilter === 'unread') return notifications.filter((n) => n.unread);
    return notifications.filter((n) => n.type === activeFilter);
  }, [notifications, activeFilter]);


  const groupedNotifications = useMemo(() => {
    const today: Notification[] = [];
    const yesterday: Notification[] = [];
    const earlier: Notification[] = [];


    filteredNotifications.forEach((n) => {
      if (n.time.toLowerCase().includes('am') || n.time.toLowerCase().includes('pm')) {
        if (!n.time.toLowerCase().includes('yesterday')) {
          today.push(n);
        } else {
          yesterday.push(n);
        }
      } else if (n.time.toLowerCase().includes('yesterday')) {
        yesterday.push(n);
      } else {
        earlier.push(n);
      }
    });


    return { today, yesterday, earlier };
  }, [filteredNotifications]);


  // ─── Handlers ─────────────────────────────────────────────
  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1500);
  }, []);


  const handleMarkAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  }, []);


  const handleMarkRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
    );
  }, []);


  const handleDelete = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);


  const handleFeatureClick = useCallback(
    (featureKey?: string, fallbackPath?: string) => {
      // If there's a direct path and no feature key, navigate
      if (fallbackPath && !featureKey) {
        navigate(fallbackPath);
        return;
      }


      // Check if feature exists in coming soon
      const feature = featureKey ? comingSoonFeatures[featureKey] : null;


      if (feature) {
        setComingSoonFeature(feature);
        setShowComingSoon(true);
        setNotifySubmitted(false);
        setNotifyEmail('');
      } else if (fallbackPath) {
        navigate(fallbackPath);
      } else {
        // Generic coming soon
        setComingSoonFeature({
          title: 'Feature Coming Soon',
          titleHi: 'फीचर जल्द आ रहा है',
          titleMr: 'फीचर लवकरच येत आहे',
          description: 'This feature is under development.',
          descriptionHi: 'यह फीचर विकास में है।',
          descriptionMr: 'हे फीचर विकासाधीन आहे.',
          icon: '🚀',
          expectedDate: 'Coming Soon',
          expectedDateHi: 'जल्द आ रहा है',
          expectedDateMr: 'लवकरच येत आहे',
        });
        setShowComingSoon(true);
      }
    },
    [navigate]
  );


  const handleNotifySubmit = useCallback(() => {
    if (notifyEmail.trim()) {
      setNotifySubmitted(true);
      setTimeout(() => setShowComingSoon(false), 2000);
    }
  }, [notifyEmail]);


  // ─── Notification styles ──────────────────────────────────
  const getNotificationStyle = (type: string, unread: boolean) => {
    const base = unread ? 'ring-2 ring-[#F5A623]/30' : '';
    switch (type) {
      case 'urgent':
        return { border: 'border-l-4 border-[#FB923C]', iconBg: 'bg-[#FB923C]/15', base };
      case 'success':
        return { border: 'border-l-4 border-[#97BC62]', iconBg: 'bg-[#97BC62]/15', base };
      case 'info':
        return { border: 'border-l-4 border-[#60A5FA]', iconBg: 'bg-[#60A5FA]/15', base };
      case 'reminder':
        return { border: 'border-l-4 border-[#F5A623]', iconBg: 'bg-[#F5A623]/15', base };
      case 'system':
        return { border: 'border-l-4 border-gray-300', iconBg: 'bg-gray-100', base };
      default:
        return { border: '', iconBg: 'bg-gray-100', base };
    }
  };


  // ─── Notification Card ────────────────────────────────────
  const NotificationCard = ({ notif, index }: { notif: Notification; index: number }) => {
    const styles = getNotificationStyle(notif.type, notif.unread);


    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, x: -100 }}
        transition={{ duration: 0.2, delay: index * 0.03 }}
        className={`bg-white rounded-2xl p-4 shadow-sm ${styles.border} ${styles.base} relative overflow-hidden`}
      >
        {/* Swipe hint gradient */}
        {notif.unread && (
          <div className="absolute top-0 right-0 w-16 h-full bg-gradient-to-l from-[#F5A623]/5 to-transparent pointer-events-none" />
        )}


        <div className="flex items-start gap-3">
          {/* Icon */}
          <div
            className={`w-11 h-11 rounded-2xl ${styles.iconBg} flex items-center justify-center text-xl flex-shrink-0`}
          >
            {notif.icon}
          </div>


          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 className="font-semibold text-[14px] text-[#1C1C1E] leading-tight">
                {localize(notif.title, notif.titleHi, notif.titleMr)}
              </h3>
              {notif.unread && (
                <span className="w-2.5 h-2.5 rounded-full bg-[#F5A623] flex-shrink-0 mt-1" />
              )}
            </div>
            <p className="text-[13px] text-[#6B7280] mb-2 leading-relaxed">
              {localize(notif.message, notif.messageHi, notif.messageMr)}
            </p>
            <div className="flex items-center gap-3">
              <span className="text-[11px] text-[#9CA3AF] flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {localize(notif.time, notif.timeHi, notif.timeMr)}
              </span>
              {notif.unread && (
                <button
                  onClick={() => handleMarkRead(notif.id)}
                  className="text-[11px] text-[#2D6A2D] font-medium flex items-center gap-1"
                >
                  <Check className="w-3 h-3" />
                  {localize('Mark read', 'पढ़ा गया', 'वाचले')}
                </button>
              )}
            </div>
          </div>
        </div>


        {/* Action Button */}
        {(notif.actionLabel || notif.actionLabelHi || notif.actionLabelMr) && (
          <button
            onClick={() => {
              handleMarkRead(notif.id);
              handleFeatureClick(notif.actionKey, notif.actionPath);
            }}
            className={`w-full mt-3 py-2.5 rounded-xl font-semibold text-[13px] flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${notif.type === 'urgent'
              ? 'bg-[#F5A623] text-white shadow-sm shadow-[#F5A623]/20'
              : notif.type === 'success'
                ? 'bg-[#97BC62]/10 text-[#2D6A2D] border border-[#97BC62]/30'
                : 'bg-[#F7F3EE] text-[#1C1C1E]'
              }`}
          >
            {localize(notif.actionLabel || '', notif.actionLabelHi || '', notif.actionLabelMr || '')}
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </motion.div>
    );
  };


  // ─── Settings Preview Modal ───────────────────────────────
  const renderSettingsPreview = () => (
    <AnimatePresence>
      {showSettingsPreview && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end justify-center"
          onClick={() => setShowSettingsPreview(false)}
        >
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25 }}
            className="bg-white rounded-t-3xl w-full max-h-[80vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-6 pt-6 pb-4 border-b border-gray-100">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-bold text-[18px] text-[#1C1C1E]">
                  {localize('Notification Settings', 'सूचना सेटिंग्स', 'सूचना सेटिंग्ज')}
                </h3>
                <button
                  onClick={() => setShowSettingsPreview(false)}
                  className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>
              <p className="text-[12px] text-[#6B7280]">
                {localize('Manage your notifications', 'सूचनाएं प्रबंधित करें', 'तुमच्या सूचना व्यवस्थापित करा')}
              </p>
            </div>


            {/* Settings List */}
            <div className="p-6 space-y-4">
              {/* Push Notifications */}
              <div className="flex items-center justify-between p-4 bg-[#F7F3EE] rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                    <Bell className="w-5 h-5 text-[#2D6A2D]" />
                  </div>
                  <div>
                    <p className="font-semibold text-[14px] text-[#1C1C1E]">
                      {localize('Push Notifications', 'पुश सूचनाएं', 'पुश सूचना')}
                    </p>
                    <p className="text-[11px] text-[#6B7280]">
                      {localize('Alerts on mobile', 'मोबाइल पर अलर्ट', 'मोबाइलवर अलर्ट')}
                    </p>
                  </div>
                </div>
                <div className="w-12 h-7 bg-[#97BC62] rounded-full relative">
                  <div className="absolute right-1 top-1 w-5 h-5 bg-white rounded-full shadow-sm" />
                </div>
              </div>


              {/* SMS Notifications */}
              <div className="flex items-center justify-between p-4 bg-[#F7F3EE] rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                    <Smartphone className="w-5 h-5 text-[#2D6A2D]" />
                  </div>
                  <div>
                    <p className="font-semibold text-[14px] text-[#1C1C1E]">
                      {localize('SMS Notifications', 'SMS सूचनाएं', 'SMS सूचना')}
                    </p>
                    <p className="text-[11px] text-[#6B7280]">
                      {localize('Important updates', 'महत्वपूर्ण अपडेट', 'महत्त्वाचे अपडेट्स')}
                    </p>
                  </div>
                </div>
                <div className="w-12 h-7 bg-[#97BC62] rounded-full relative">
                  <div className="absolute right-1 top-1 w-5 h-5 bg-white rounded-full shadow-sm" />
                </div>
              </div>


              {/* Sound */}
              <div className="flex items-center justify-between p-4 bg-[#F7F3EE] rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                    <Volume2 className="w-5 h-5 text-[#2D6A2D]" />
                  </div>
                  <div>
                    <p className="font-semibold text-[14px] text-[#1C1C1E]">
                      {localize('Sound', 'ध्वनि', 'ध्वनी')}
                    </p>
                    <p className="text-[11px] text-[#6B7280]">
                      {localize('Notification sound', 'अधिसूचना ध्वनि', 'सूचना ध्वनी')}
                    </p>
                  </div>
                </div>
                <div className="w-12 h-7 bg-gray-200 rounded-full relative">
                  <div className="absolute left-1 top-1 w-5 h-5 bg-white rounded-full shadow-sm" />
                </div>
              </div>


              {/* Coming soon note */}
              <div className="bg-[#F5A623]/10 rounded-2xl p-4 flex items-start gap-3">
                <Construction className="w-5 h-5 text-[#F5A623] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-[13px] font-semibold text-[#1C1C1E]">
                    {localize('Full settings coming soon', 'पूर्ण सेटिंग्स जल्द आ रही हैं', 'पूर्ण सेटिंग्ज लवकरच येत आहेत')}
                  </p>
                  <p className="text-[11px] text-[#6B7280] mt-0.5">
                    {localize(
                      'More customization options will be available in v1.5',
                      'अधिक अनुकूलन विकल्प v1.5 में उपलब्ध होंगे',
                      'अधिक सानुकूलन पर्याय v1.5 मध्ये उपलब्ध होतील'
                    )}
                  </p>
                </div>
              </div>
            </div>


            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-100">
              <button
                onClick={() => setShowSettingsPreview(false)}
                className="w-full py-3 bg-[#2D6A2D] text-white rounded-xl font-semibold text-[14px] active:scale-[0.98] transition-all"
              >
                {localize('Done', 'हो गया', 'झाले')}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );


  // ─── Coming Soon Modal ────────────────────────────────────
  const renderComingSoonModal = () => (
    <AnimatePresence>
      {showComingSoon && comingSoonFeature && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowComingSoon(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-br from-[#2D6A2D] via-[#3D8A3D] to-[#97BC62] p-6 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-20 h-20 bg-white/10 rounded-full -translate-x-10 -translate-y-10" />
              <div className="absolute bottom-0 right-0 w-16 h-16 bg-white/10 rounded-full translate-x-8 translate-y-8" />


              <button
                onClick={() => setShowComingSoon(false)}
                className="absolute top-4 right-4 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center"
              >
                <X className="w-4 h-4 text-white" />
              </button>


              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
                className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg"
              >
                <span className="text-4xl">{comingSoonFeature.icon}</span>
              </motion.div>


              <div className="flex items-center justify-center gap-2 mb-2">
                <Construction className="w-4 h-4 text-[#F5A623]" />
                <span className="text-[11px] font-bold text-[#F5A623] uppercase tracking-wider">
                  {localize('In Development', 'विकास में', 'विकासाधीन')}
                </span>
              </div>
              <h3 className="text-white font-bold text-[20px] mb-1">
                {localize(comingSoonFeature.title, comingSoonFeature.titleHi, comingSoonFeature.titleMr)}
              </h3>
              <p className="text-white/70 text-[12px]">
                {localize(comingSoonFeature.expectedDate, comingSoonFeature.expectedDateHi, comingSoonFeature.expectedDateMr)}
              </p>
            </div>


            {/* Content */}
            <div className="p-6">
              <p className="text-[14px] text-[#6B7280] text-center leading-relaxed mb-6">
                {localize(comingSoonFeature.description, comingSoonFeature.descriptionHi, comingSoonFeature.descriptionMr)}
              </p>


              {/* Notify form */}
              <AnimatePresence mode="wait">
                {!notifySubmitted ? (
                  <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <p className="text-[12px] text-[#6B7280] text-center mb-3">
                      {localize('Get notified when available:', 'जब उपलब्ध हो तो सूचित करें:', 'उपलब्ध झाल्यावर सूचित करा:')}
                    </p>
                    <div className="flex gap-2">
                      <input
                        type="email"
                        value={notifyEmail}
                        onChange={(e) => setNotifyEmail(e.target.value)}
                        placeholder={localize('Your email', 'आपका ईमेल', 'तुमचा ईमेल')}
                        className="flex-1 px-4 py-3 bg-[#F7F3EE] rounded-xl text-[13px] outline-none focus:ring-2 focus:ring-[#F5A623]/30 border-2 border-transparent focus:border-[#F5A623]"
                      />
                      <button
                        onClick={handleNotifySubmit}
                        disabled={!notifyEmail.trim()}
                        className={`px-4 py-3 rounded-xl font-semibold text-[13px] transition-all ${notifyEmail.trim()
                          ? 'bg-[#F5A623] text-white active:scale-95'
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          }`}
                      >
                        <Bell className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-[#97BC62]/10 rounded-2xl p-4 text-center"
                  >
                    <CheckCircle className="w-8 h-8 text-[#2D6A2D] mx-auto mb-2" />
                    <p className="text-[14px] font-semibold text-[#2D6A2D]">
                      {localize('Thank you!', 'धन्यवाद!', 'धन्यवाद!')}
                    </p>
                    <p className="text-[12px] text-[#6B7280]">
                      {localize("We'll notify you.", 'हम आपको सूचित करेंगे।', 'आम्ही तुम्हाला सूचित करू.')}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>


              {/* Actions */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowComingSoon(false)}
                  className="flex-1 py-3 border border-gray-200 text-[#1C1C1E] rounded-xl font-semibold text-[13px] active:scale-[0.97] transition-all"
                >
                  {localize('Close', 'बंद करें', 'बंद करा')}
                </button>
                <button
                  onClick={() => {
                    setShowComingSoon(false);
                    navigate('/dashboard');
                  }}
                  className="flex-1 py-3 bg-[#2D6A2D] text-white rounded-xl font-semibold text-[13px] flex items-center justify-center gap-2 active:scale-[0.97] transition-all"
                >
                  <Home className="w-4 h-4" />
                  {localize('Home', 'होम', 'होम')}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );


  return (
    <div className="min-h-screen bg-[#F7F3EE] pb-24">
      {/* ─── Header ──────────────────────────────────────────── */}
      <div className="bg-gradient-to-b from-[#1A3C1A] to-[#2D6A2D] pt-10 pb-4 px-4 sticky top-0 z-20">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div className="text-center">
            <h1 className="font-bold text-white text-[16px]">
              {localize('Notifications', 'सूचनाएं', 'सूचना')}
            </h1>
            {unreadCount > 0 && (
              <p className="text-[11px] text-[#F5A623] font-medium">
                {unreadCount} {localize('new', 'नई', 'नवीन')}
              </p>
            )}
          </div>
          <button
            onClick={handleRefresh}
            className={`w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors ${isRefreshing ? 'animate-spin' : ''
              }`}
          >
            <RefreshCw className="w-5 h-5 text-white" />
          </button>
        </div>


        {/* Quick Actions */}
        <div className="flex items-center justify-between bg-white/10 rounded-2xl px-4 py-2.5">
          <button
            onClick={handleMarkAllRead}
            disabled={unreadCount === 0}
            className={`flex items-center gap-2 text-[12px] font-medium ${unreadCount > 0 ? 'text-white' : 'text-white/40'
              }`}
          >
            <CheckCheck className="w-4 h-4" />
            {localize('Mark all read', 'सभी पढ़ें', 'सर्व वाचलेले')}
          </button>
          <div className="w-px h-4 bg-white/20" />
          <button
            onClick={() => setShowSettingsPreview(true)}
            className="flex items-center gap-2 text-[12px] font-medium text-white"
          >
            <Settings className="w-4 h-4" />
            {localize('Settings', 'सेटिंग्स', 'सेटिंग्ज')}
          </button>
        </div>
      </div>


      {/* Refreshing indicator */}
      <AnimatePresence>
        {isRefreshing && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-[#F5A623]/10 py-2 text-center overflow-hidden"
          >
            <p className="text-[12px] text-[#F5A623] font-medium animate-pulse">
              {localize('Refreshing...', 'रिफ्रेश हो रहा है...', 'रिफ्रेश होत आहे...')}
            </p>
          </motion.div>
        )}
      </AnimatePresence>


      <div className="px-4 pt-4">
        {/* ─── Filter Chips ──────────────────────────────────── */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-4 hide-scrollbar">
          {filterOptions.map((filter) => (
            <button
              key={filter.key}
              onClick={() => setActiveFilter(filter.key)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-[12px] font-semibold whitespace-nowrap transition-all border ${activeFilter === filter.key
                ? 'bg-[#F5A623] text-white border-[#F5A623] shadow-sm shadow-[#F5A623]/30'
                : 'bg-white text-[#1C1C1E] border-gray-200'
                }`}
            >
              <span>{localize(filter.en, filter.hi, filter.mr)}</span>
              {filter.key === 'unread' && unreadCount > 0 && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full ${activeFilter === filter.key ? 'bg-white/25 text-white' : 'bg-[#F5A623] text-white'
                    }`}
                >
                  {unreadCount}
                </span>
              )}
            </button>
          ))}
        </div>


        {/* ─── Notification Stats ────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-4 mb-4 shadow-sm border border-gray-100 flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-2xl bg-[#F5A623]/10 flex items-center justify-center flex-shrink-0">
            <Bell className="w-6 h-6 text-[#F5A623]" />
          </div>
          <div className="flex-1">
            <p className="text-[14px] font-semibold text-[#1C1C1E]">
              {filteredNotifications.length}{' '}
              {localize('notifications', 'सूचनाएं', 'सूचना')}
            </p>
            <p className="text-[12px] text-[#6B7280]">
              {unreadCount > 0
                ? localize(
                  `${unreadCount} unread notifications`,
                  `${unreadCount} अपठित सूचनाएं`,
                  `${unreadCount} न वाचलेल्या सूचना`
                )
                : localize('All caught up!', 'सभी पढ़ी गई', 'सर्व वाचल्या!')}
            </p>
          </div>
          {unreadCount === 0 && (
            <div className="w-10 h-10 bg-[#97BC62]/10 rounded-full flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-[#97BC62]" />
            </div>
          )}
        </motion.div>


        {/* ─── Notifications List ────────────────────────────── */}
        {filteredNotifications.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center"
          >
            <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <BellOff className="w-8 h-8 text-gray-300" />
            </div>
            <p className="text-[14px] text-[#1C1C1E] font-semibold mb-1">
              {localize('No notifications', 'कोई सूचना नहीं', 'कोणतीही सूचना नाही')}
            </p>
            <p className="text-[12px] text-[#6B7280]">
              {localize('New notifications will appear here', 'नई सूचनाएं यहां दिखेंगी', 'नवीन सूचना येथे दिसतील')}
            </p>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {/* Today */}
            {groupedNotifications.today.length > 0 && (
              <div>
                <h2 className="font-bold text-[14px] text-[#1C1C1E] mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-[#F5A623] rounded-full" />
                  {localize('Today', 'आज', 'आज')}
                </h2>
                <div className="space-y-3">
                  {groupedNotifications.today.map((notif, index) => (
                    <NotificationCard key={notif.id} notif={notif} index={index} />
                  ))}
                </div>
              </div>
            )}


            {/* Yesterday */}
            {groupedNotifications.yesterday.length > 0 && (
              <div>
                <h2 className="font-bold text-[14px] text-[#1C1C1E] mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-gray-300 rounded-full" />
                  {localize('Yesterday', 'कल', 'काल')}
                </h2>
                <div className="space-y-3">
                  {groupedNotifications.yesterday.map((notif, index) => (
                    <NotificationCard key={notif.id} notif={notif} index={index} />
                  ))}
                </div>
              </div>
            )}


            {/* Earlier */}
            {groupedNotifications.earlier.length > 0 && (
              <div>
                <h2 className="font-bold text-[14px] text-[#1C1C1E] mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-gray-200 rounded-full" />
                  {localize('Earlier', 'पहले', 'आधी')}
                </h2>
                <div className="space-y-3">
                  {groupedNotifications.earlier.map((notif, index) => (
                    <NotificationCard key={notif.id} notif={notif} index={index} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}


        {/* ─── Settings Card ─────────────────────────────────── */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          onClick={() => setShowSettingsPreview(true)}
          className="w-full bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-3 mt-6 active:scale-[0.98] transition-all"
        >
          <div className="w-11 h-11 rounded-2xl bg-[#2D6A2D]/10 flex items-center justify-center flex-shrink-0">
            <Settings className="w-5 h-5 text-[#2D6A2D]" />
          </div>
          <div className="flex-1 text-left">
            <h3 className="font-semibold text-[14px] text-[#1C1C1E]">
              {localize('Notification Settings', 'सूचना सेटिंग्स', 'सूचना सेटिंग्ज')}
            </h3>
            <p className="text-[12px] text-[#6B7280]">
              {localize('Manage preferences', 'प्राथमिकताएं प्रबंधित करें', 'प्राधान्ये व्यवस्थापित करा')}
            </p>
          </div>
          <ChevronRight className="w-5 h-5 text-[#9CA3AF]" />
        </motion.button>


        {/* ─── Prototype Notice ──────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-[#F5A623]/5 border border-[#F5A623]/20 rounded-2xl p-4 mt-4 mb-4"
        >
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-[#F5A623]/10 rounded-full flex items-center justify-center flex-shrink-0">
              <Rocket className="w-4 h-4 text-[#F5A623]" />
            </div>
            <div>
              <p className="text-[13px] font-semibold text-[#1C1C1E] mb-1">
                {localize('🚀 Prototype Version', '🚀 प्रोटोटाइप संस्करण', '🚀 प्रोटोटाइप आवृत्ती')}
              </p>
              <p className="text-[11px] text-[#6B7280] leading-relaxed">
                {localize(
                  'This is demo data. Real notifications will be based on your activity.',
                  'यह डेमो डेटा है। वास्तविक सूचनाएं आपकी गतिविधि के आधार पर होंगी।',
                  'हा डेमो डेटा आहे. वास्तविक सूचना तुमच्या क्रियाकलापांवर आधारित असतील.'
                )}
              </p>
            </div>
          </div>
        </motion.div>
      </div>


      <BottomNav />


      {/* Modals */}
      {renderSettingsPreview()}
      {renderComingSoonModal()}


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