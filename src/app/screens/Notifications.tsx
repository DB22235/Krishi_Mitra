
// // src/screens/Notifications.tsx
// import { useState, useEffect, useMemo } from 'react';
// import {
//     ArrowLeft, Bell, CheckCheck, Trash2,
//     AlertCircle, CheckCircle, Clock, Calendar,
//     Sparkles, ExternalLink, Filter, AlertTriangle,
//     ShieldAlert, BellRing, MessageSquare, Phone,
//     Send, X,
// } from 'lucide-react';
// import { useNavigate } from 'react-router';
// import { motion, AnimatePresence } from 'motion/react';
// import { useLanguage } from '../../context/LanguageContext';
// import { useUser } from '../../context/UserContext';
// import { type TrackedApplication, getTrackedApps } from './SchemeMatcher';
// import { BottomNav } from '../components/BottomNav';

// // ─── Types ────────────────────────────────────────────────────────────────────
// interface AppNotification {
//     id: string;
//     type: 'deadline-urgent' | 'deadline-reminder' | 'status' | 'saved' | 'tip';
//     icon: string;
//     color: string;
//     bg: string;
//     title: string;
//     titleHi: string;
//     titleMr: string;
//     message: string;
//     messageHi: string;
//     messageMr: string;
//     schemeId?: string;
//     time: string;
//     read: boolean;
// }

// interface SmsRecord {
//     id: string;
//     phone: string;
//     message: string;
//     sentAt: string;
//     schemeId?: string;
//     type: 'urgent' | 'reminder';
// }

// // ─── SMS Helper ───────────────────────────────────────────────────────────────
// function getSentSmsRecords(): SmsRecord[] {
//     return JSON.parse(localStorage.getItem('sent-sms-alerts') || '[]');
// }

// function saveSmsRecord(record: SmsRecord) {
//     const records = getSentSmsRecords();
//     records.push(record);
//     localStorage.setItem('sent-sms-alerts', JSON.stringify(records));
// }

// function wasSmsAlreadySent(notifId: string): boolean {
//     const records = getSentSmsRecords();
//     return records.some(r => r.id === notifId);
// }

// // ─── Component ────────────────────────────────────────────────────────────────
// export function Notifications() {
//     const navigate = useNavigate();
//     const { language } = useLanguage();
//     const { userData } = useUser();
//     const isHindi = language === 'hi';
//     const isMarathi = language === 'mr';

//     const getText = (en: string, hi: string, mr: string) => {
//         if (isMarathi) return mr;
//         if (isHindi) return hi;
//         return en;
//     };

//     const [notifications, setNotifications] = useState<AppNotification[]>([]);
//     const [filter, setFilter] = useState<string>('all');
//     const [showFilters, setShowFilters] = useState(false);
//     const [dismissedAlert, setDismissedAlert] = useState(false);

//     // SMS states
//     const [showSmsPreview, setShowSmsPreview] = useState(false);
//     const [smsTarget, setSmsTarget] = useState<AppNotification | null>(null);
//     const [smsSending, setSmsSending] = useState(false);
//     const [smsToast, setSmsToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({
//         show: false, message: '', type: 'success',
//     });
//     const [sentSmsIds, setSentSmsIds] = useState<string[]>([]);

//     // Load sent SMS records
//     useEffect(() => {
//         const records = getSentSmsRecords();
//         setSentSmsIds(records.map(r => r.id));
//     }, []);

//     // Get user phone
//     const userPhone = userData?.mobile || '';
//     const maskedPhone = userPhone
//         ? userPhone.replace(/(\d{2})\d{6}(\d{2})/, '$1******$2')
//         : '';

//     // ── Generate notifications from tracked apps ──────────────────────────────
//     useEffect(() => {
//         const apps = getTrackedApps();
//         const notifs: AppNotification[] = [];
//         const today = new Date();

//         apps.forEach((app: TrackedApplication) => {
//             const deadline = app.deadline ? new Date(app.deadline) : null;
//             const daysLeft = deadline ? Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)) : null;

//             if (daysLeft !== null && daysLeft > 0 && daysLeft <= 7) {
//                 notifs.push({
//                     id: `deadline-urgent-${app.schemeId}`,
//                     type: 'deadline-urgent',
//                     icon: '🔴',
//                     color: 'text-red-700',
//                     bg: 'bg-red-50',
//                     title: `Deadline in ${daysLeft} days!`,
//                     titleHi: `${daysLeft} दिनों में समय सीमा!`,
//                     titleMr: `${daysLeft} दिवसांत मुदत!`,
//                     message: `${app.schemeName} deadline is ${app.deadline}. Apply before it expires.`,
//                     messageHi: `${app.schemeNameHi} की समय सीमा ${app.deadline} है। समाप्त होने से पहले आवेदन करें।`,
//                     messageMr: `${app.schemeNameMr} ची मुदत ${app.deadline} आहे. संपण्यापूर्वी अर्ज करा.`,
//                     schemeId: app.schemeId,
//                     time: getText('Now', 'अभी', 'आता'),
//                     read: false,
//                 });
//             }

//             if (daysLeft !== null && daysLeft > 7 && daysLeft <= 30) {
//                 notifs.push({
//                     id: `deadline-reminder-${app.schemeId}`,
//                     type: 'deadline-reminder',
//                     icon: '🟡',
//                     color: 'text-amber-700',
//                     bg: 'bg-amber-50',
//                     title: `${daysLeft} days until deadline`,
//                     titleHi: `समय सीमा तक ${daysLeft} दिन`,
//                     titleMr: `मुदतीपर्यंत ${daysLeft} दिवस`,
//                     message: `${app.schemeName} — don't miss this opportunity. Prepare your documents.`,
//                     messageHi: `${app.schemeNameHi} — यह अवसर न चूकें। अपने दस्तावेज तैयार करें।`,
//                     messageMr: `${app.schemeNameMr} — ही संधी चुकवू नका. कागदपत्रे तयार ठेवा.`,
//                     schemeId: app.schemeId,
//                     time: getText('Today', 'आज', 'आज'),
//                     read: false,
//                 });
//             }

//             if (daysLeft !== null && daysLeft <= 0 && app.status === 'saved') {
//                 notifs.push({
//                     id: `expired-${app.schemeId}`,
//                     type: 'deadline-urgent',
//                     icon: '⚫',
//                     color: 'text-gray-700',
//                     bg: 'bg-gray-100',
//                     title: 'Deadline has passed',
//                     titleHi: 'समय सीमा बीत गई है',
//                     titleMr: 'मुदत संपली आहे',
//                     message: `${app.schemeName} deadline was ${app.deadline}. Scheme may no longer accept applications.`,
//                     messageHi: `${app.schemeNameHi} की समय सीमा ${app.deadline} थी। योजना अब आवेदन स्वीकार नहीं कर सकती।`,
//                     messageMr: `${app.schemeNameMr} ची मुदत ${app.deadline} होती. योजना आता अर्ज स्वीकारत नसेल.`,
//                     schemeId: app.schemeId,
//                     time: app.deadline,
//                     read: false,
//                 });
//             }

//             if (app.status !== 'saved') {
//                 const statusLabels: Record<string, { en: string; hi: string; mr: string }> = {
//                     applied: { en: 'Applied', hi: 'आवेदन किया', mr: 'अर्ज केला' },
//                     'under-review': { en: 'Under Review', hi: 'समीक्षाधीन', mr: 'पुनरावलोकनाखाली' },
//                     approved: { en: 'Approved', hi: 'स्वीकृत', mr: 'मंजूर' },
//                     disbursed: { en: 'Disbursed', hi: 'वितरित', mr: 'वितरित' },
//                 };
//                 const sl = statusLabels[app.status];
//                 if (sl) {
//                     notifs.push({
//                         id: `status-${app.schemeId}`,
//                         type: 'status',
//                         icon: app.status === 'approved' || app.status === 'disbursed' ? '🟢' : '🔵',
//                         color: app.status === 'approved' || app.status === 'disbursed' ? 'text-green-700' : 'text-blue-700',
//                         bg: app.status === 'approved' || app.status === 'disbursed' ? 'bg-green-50' : 'bg-blue-50',
//                         title: `${sl.en}: ${app.schemeName}`,
//                         titleHi: `${sl.hi}: ${app.schemeNameHi}`,
//                         titleMr: `${sl.mr}: ${app.schemeNameMr}`,
//                         message: `Your application for ${app.schemeName} is now "${sl.en}".`,
//                         messageHi: `${app.schemeNameHi} के लिए आपका आवेदन अब "${sl.hi}" है।`,
//                         messageMr: `${app.schemeNameMr} साठी तुमचा अर्ज आता "${sl.mr}" आहे.`,
//                         schemeId: app.schemeId,
//                         time: app.appliedDate,
//                         read: false,
//                     });
//                 }
//             }

//             if (app.status === 'saved') {
//                 notifs.push({
//                     id: `saved-${app.schemeId}`,
//                     type: 'saved',
//                     icon: '📌',
//                     color: 'text-purple-700',
//                     bg: 'bg-purple-50',
//                     title: `Scheme Saved`,
//                     titleHi: 'योजना सहेजी गई',
//                     titleMr: 'योजना जतन केली',
//                     message: `You saved ${app.schemeName}. Don't forget to apply before the deadline!`,
//                     messageHi: `आपने ${app.schemeNameHi} सहेजी है। समय सीमा से पहले आवेदन करना न भूलें!`,
//                     messageMr: `तुम्ही ${app.schemeNameMr} जतन केली. मुदतीपूर्वी अर्ज करायला विसरू नका!`,
//                     schemeId: app.schemeId,
//                     time: app.appliedDate,
//                     read: false,
//                 });
//             }
//         });

//         if (apps.length > 0) {
//             notifs.push({
//                 id: 'tip-1',
//                 type: 'tip',
//                 icon: '💡',
//                 color: 'text-[#2D6A2D]',
//                 bg: 'bg-[#F0F7F0]',
//                 title: 'Pro Tip',
//                 titleHi: 'सुझाव',
//                 titleMr: 'उपयुक्त सूचना',
//                 message: 'Complete your profile 100% to get better scheme matching and higher approval chances!',
//                 messageHi: 'बेहतर योजना मिलान और उच्च स्वीकृति के लिए अपनी प्रोफाइल 100% पूरी करें!',
//                 messageMr: 'चांगल्या योजना जुळणी आणि उच्च मंजुरी शक्यतांसाठी प्रोफाइल 100% पूर्ण करा!',
//                 time: getText('Tip', 'सुझाव', 'उपयुक्त सूचना'),
//                 read: false,
//             });
//         }

//         const priority: Record<string, number> = { 'deadline-urgent': 0, 'deadline-reminder': 1, status: 2, saved: 3, tip: 4 };
//         notifs.sort((a, b) => (priority[a.type] ?? 5) - (priority[b.type] ?? 5));

//         const readIds: string[] = JSON.parse(localStorage.getItem('notification-read') || '[]');
//         notifs.forEach(n => { if (readIds.includes(n.id)) n.read = true; });

//         setNotifications(notifs);
//     }, []);

//     // ── Actions ───────────────────────────────────────────────────────────────
//     const markAsRead = (id: string) => {
//         setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
//         const readIds: string[] = JSON.parse(localStorage.getItem('notification-read') || '[]');
//         if (!readIds.includes(id)) { readIds.push(id); localStorage.setItem('notification-read', JSON.stringify(readIds)); }
//     };

//     const markAllRead = () => {
//         setNotifications(prev => prev.map(n => ({ ...n, read: true })));
//         localStorage.setItem('notification-read', JSON.stringify(notifications.map(n => n.id)));
//     };

//     const deleteNotif = (id: string) => {
//         setNotifications(prev => prev.filter(n => n.id !== id));
//     };

//     // ── SMS Actions ───────────────────────────────────────────────────────────
//     const buildSmsMessage = (notif: AppNotification): string => {
//         const title = getText(notif.title, notif.titleHi, notif.titleMr);
//         const msg = getText(notif.message, notif.messageHi, notif.messageMr);
//         return `[JanSahayak] ${title}\n${msg}\n\n${getText(
//             'Open app to apply now.',
//             'अभी आवेदन करने के लिए ऐप खोलें।',
//             'आत्ता अर्ज करण्यासाठी ॲप उघडा.'
//         )}`;
//     };

//     const handleSmsPreview = (notif: AppNotification) => {
//         setSmsTarget(notif);
//         setShowSmsPreview(true);
//     };

//     const handleDirectSms = (notif: AppNotification) => {
//         if (!userPhone || sentSmsIds.includes(notif.id)) return;

//         setSmsSending(true);

//         setTimeout(() => {
//             const record: SmsRecord = {
//                 id: notif.id,
//                 phone: userPhone,
//                 message: buildSmsMessage(notif),
//                 sentAt: new Date().toISOString(),
//                 schemeId: notif.schemeId,
//                 type: notif.type === 'deadline-urgent' ? 'urgent' : 'reminder',
//             };
//             saveSmsRecord(record);
//             setSentSmsIds(prev => [...prev, notif.id]);

//             setSmsSending(false);

//             setSmsToast({
//                 show: true,
//                 message: getText(
//                     `SMS alert sent to ${maskedPhone}`,
//                     `SMS अलर्ट ${maskedPhone} पर भेजा गया`,
//                     `SMS सूचना ${maskedPhone} वर पाठवली`
//                 ),
//                 type: 'success',
//             });

//             setTimeout(() => setSmsToast(prev => ({ ...prev, show: false })), 3500);
//         }, 1000);
//     };

//     const handleSendSms = () => {
//         if (!smsTarget || !userPhone) return;

//         setSmsSending(true);

//         // Simulate SMS sending with delay
//         setTimeout(() => {
//             const record: SmsRecord = {
//                 id: smsTarget.id,
//                 phone: userPhone,
//                 message: buildSmsMessage(smsTarget),
//                 sentAt: new Date().toISOString(),
//                 schemeId: smsTarget.schemeId,
//                 type: smsTarget.type === 'deadline-urgent' ? 'urgent' : 'reminder',
//             };
//             saveSmsRecord(record);
//             setSentSmsIds(prev => [...prev, smsTarget.id]);

//             setSmsSending(false);
//             setShowSmsPreview(false);
//             setSmsTarget(null);

//             setSmsToast({
//                 show: true,
//                 message: getText(
//                     `SMS alert sent to ${maskedPhone}`,
//                     `SMS अलर्ट ${maskedPhone} पर भेजा गया`,
//                     `SMS सूचना ${maskedPhone} वर पाठवली`
//                 ),
//                 type: 'success',
//             });

//             setTimeout(() => setSmsToast(prev => ({ ...prev, show: false })), 3500);
//         }, 1500);
//     };

//     const handleSendAllSms = () => {
//         const deadlineNotifs = [...urgentDeadlines, ...reminderDeadlines].filter(
//             n => !sentSmsIds.includes(n.id)
//         );

//         if (deadlineNotifs.length === 0 || !userPhone) return;

//         setSmsSending(true);

//         setTimeout(() => {
//             deadlineNotifs.forEach(notif => {
//                 const record: SmsRecord = {
//                     id: notif.id,
//                     phone: userPhone,
//                     message: buildSmsMessage(notif),
//                     sentAt: new Date().toISOString(),
//                     schemeId: notif.schemeId,
//                     type: notif.type === 'deadline-urgent' ? 'urgent' : 'reminder',
//                 };
//                 saveSmsRecord(record);
//             });

//             setSentSmsIds(prev => [...prev, ...deadlineNotifs.map(n => n.id)]);
//             setSmsSending(false);

//             setSmsToast({
//                 show: true,
//                 message: getText(
//                     `${deadlineNotifs.length} SMS alerts sent to ${maskedPhone}`,
//                     `${deadlineNotifs.length} SMS अलर्ट ${maskedPhone} पर भेजे गए`,
//                     `${deadlineNotifs.length} SMS सूचना ${maskedPhone} वर पाठवल्या`
//                 ),
//                 type: 'success',
//             });

//             setTimeout(() => setSmsToast(prev => ({ ...prev, show: false })), 3500);
//         }, 2000);
//     };

//     // ── Filter ────────────────────────────────────────────────────────────────
//     const filtered = useMemo(() => {
//         if (filter === 'all') return notifications;
//         if (filter === 'unread') return notifications.filter(n => !n.read);
//         return notifications.filter(n => n.type === filter);
//     }, [notifications, filter]);

//     const unreadCount = notifications.filter(n => !n.read).length;

//     const urgentDeadlines = useMemo(() => {
//         return notifications.filter(n => n.type === 'deadline-urgent' && !n.read);
//     }, [notifications]);

//     const reminderDeadlines = useMemo(() => {
//         return notifications.filter(n => n.type === 'deadline-reminder' && !n.read);
//     }, [notifications]);

//     const totalDeadlineAlerts = urgentDeadlines.length + reminderDeadlines.length;

//     const unsentSmsCount = [...urgentDeadlines, ...reminderDeadlines].filter(
//         n => !sentSmsIds.includes(n.id)
//     ).length;

//     const filterOptions = [
//         { key: 'all', label: getText('All', 'सभी', 'सर्व'), count: notifications.length },
//         { key: 'unread', label: getText('Unread', 'अपठित', 'न वाचलेले'), count: unreadCount },
//         { key: 'deadline-urgent', label: getText('Urgent', 'तत्काल', 'तातडीचे'), count: notifications.filter(n => n.type === 'deadline-urgent').length },
//         { key: 'deadline-reminder', label: getText('Reminders', 'अनुस्मारक', 'स्मरणपत्रे'), count: notifications.filter(n => n.type === 'deadline-reminder').length },
//         { key: 'status', label: getText('Status', 'स्थिति', 'स्थिती'), count: notifications.filter(n => n.type === 'status').length },
//     ];

//     return (
//         <div className="min-h-screen bg-[#F7F3EE] pb-24">

//             {/* ── SMS Toast ── */}
//             <AnimatePresence>
//                 {smsToast.show && (
//                     <motion.div
//                         initial={{ opacity: 0, y: 40 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         exit={{ opacity: 0, y: 40 }}
//                         transition={{ duration: 0.3 }}
//                         className="fixed bottom-28 left-4 right-4 z-50"
//                     >
//                         <div className={`rounded-2xl p-4 shadow-lg flex items-center gap-3 ${smsToast.type === 'success'
//                             ? 'bg-[#2D6A2D] text-white'
//                             : 'bg-red-600 text-white'
//                             }`}>
//                             <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
//                                 {smsToast.type === 'success'
//                                     ? <CheckCircle className="w-5 h-5" />
//                                     : <AlertCircle className="w-5 h-5" />
//                                 }
//                             </div>
//                             <div className="flex-1 min-w-0">
//                                 <p className="text-[13px] font-semibold">{smsToast.message}</p>
//                                 <p className="text-[11px] text-white/70 mt-0.5">
//                                     {getText(
//                                         'SMS will be delivered shortly',
//                                         'SMS शीघ्र ही डिलीवर होगा',
//                                         'SMS लवकरच वितरित होईल'
//                                     )}
//                                 </p>
//                             </div>
//                             <button
//                                 onClick={() => setSmsToast(prev => ({ ...prev, show: false }))}
//                                 className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center flex-shrink-0"
//                             >
//                                 <X className="w-3.5 h-3.5" />
//                             </button>
//                         </div>
//                     </motion.div>
//                 )}
//             </AnimatePresence>

//             {/* ── SMS Preview Modal ── */}
//             <AnimatePresence>
//                 {showSmsPreview && smsTarget && (
//                     <motion.div
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         exit={{ opacity: 0 }}
//                         className="fixed inset-0 bg-black/50 z-40 flex items-end justify-center"
//                         onClick={() => { setShowSmsPreview(false); setSmsTarget(null); }}
//                     >
//                         <motion.div
//                             initial={{ y: 300 }}
//                             animate={{ y: 0 }}
//                             exit={{ y: 300 }}
//                             transition={{ type: 'spring', damping: 25, stiffness: 300 }}
//                             onClick={e => e.stopPropagation()}
//                             className="bg-white rounded-t-3xl w-full max-w-md p-6 pb-8"
//                         >
//                             {/* Modal header */}
//                             <div className="flex items-center justify-between mb-4">
//                                 <div className="flex items-center gap-2">
//                                     <div className="w-10 h-10 rounded-2xl bg-[#2D6A2D]/10 flex items-center justify-center">
//                                         <MessageSquare className="w-5 h-5 text-[#2D6A2D]" />
//                                     </div>
//                                     <div>
//                                         <h3 className="font-bold text-[16px] text-[#1C1C1E]">
//                                             {getText('SMS Alert Preview', 'SMS अलर्ट पूर्वावलोकन', 'SMS सूचना पूर्वावलोकन')}
//                                         </h3>
//                                         <p className="text-[11px] text-[#6B7280]">
//                                             {getText('Review before sending', 'भेजने से पहले देखें', 'पाठवण्यापूर्वी पहा')}
//                                         </p>
//                                     </div>
//                                 </div>
//                                 <button
//                                     onClick={() => { setShowSmsPreview(false); setSmsTarget(null); }}
//                                     className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
//                                 >
//                                     <X className="w-4 h-4 text-gray-500" />
//                                 </button>
//                             </div>

//                             {/* Phone number */}
//                             <div className="bg-[#F7F3EE] rounded-2xl p-3 mb-3 flex items-center gap-3">
//                                 <div className="w-9 h-9 rounded-xl bg-[#2D6A2D]/10 flex items-center justify-center">
//                                     <Phone className="w-4 h-4 text-[#2D6A2D]" />
//                                 </div>
//                                 <div>
//                                     <p className="text-[11px] text-[#6B7280]">
//                                         {getText('Sending to', 'भेजा जाएगा', 'पाठवले जाईल')}
//                                     </p>
//                                     <p className="text-[14px] font-bold text-[#1C1C1E]">
//                                         {userPhone
//                                             ? `+91 ${maskedPhone}`
//                                             : getText('No phone number', 'फोन नंबर नहीं', 'फोन नंबर नाही')
//                                         }
//                                     </p>
//                                 </div>
//                             </div>

//                             {/* SMS message preview */}
//                             <div className="bg-[#F0F7F0] rounded-2xl p-4 mb-4 border border-[#2D6A2D]/10">
//                                 <div className="flex items-center gap-1.5 mb-2">
//                                     <MessageSquare className="w-3.5 h-3.5 text-[#2D6A2D]" />
//                                     <span className="text-[11px] font-semibold text-[#2D6A2D]">
//                                         {getText('Message Preview', 'संदेश पूर्वावलोकन', 'संदेश पूर्वावलोकन')}
//                                     </span>
//                                 </div>
//                                 <p className="text-[13px] text-[#1C1C1E] leading-relaxed whitespace-pre-line font-mono bg-white/60 rounded-xl p-3">
//                                     {buildSmsMessage(smsTarget)}
//                                 </p>
//                                 <p className="text-[10px] text-[#6B7280] mt-2 text-right">
//                                     {buildSmsMessage(smsTarget).length} {getText('characters', 'अक्षर', 'अक्षरे')}
//                                 </p>
//                             </div>

//                             {/* Action buttons */}
//                             <div className="flex gap-3">
//                                 <button
//                                     onClick={() => { setShowSmsPreview(false); setSmsTarget(null); }}
//                                     className="flex-1 py-3 border border-gray-300 text-[#1C1C1E] rounded-2xl font-medium text-[13px]"
//                                 >
//                                     {getText('Cancel', 'रद्द करें', 'रद्द करा')}
//                                 </button>
//                                 <button
//                                     onClick={handleSendSms}
//                                     disabled={smsSending || !userPhone}
//                                     className={`flex-[2] py-3 rounded-2xl font-bold text-[14px] flex items-center justify-center gap-2 shadow-lg transition-all ${smsSending || !userPhone
//                                         ? 'bg-gray-300 text-gray-500 shadow-none'
//                                         : 'bg-[#2D6A2D] text-white shadow-[#2D6A2D]/30'
//                                         }`}
//                                 >
//                                     {smsSending ? (
//                                         <>
//                                             <motion.div
//                                                 animate={{ rotate: 360 }}
//                                                 transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
//                                             >
//                                                 <Clock className="w-4 h-4" />
//                                             </motion.div>
//                                             {getText('Sending...', 'भेज रहे हैं...', 'पाठवत आहे...')}
//                                         </>
//                                     ) : (
//                                         <>
//                                             <Send className="w-4 h-4" />
//                                             {getText('Send SMS Alert', 'SMS अलर्ट भेजें', 'SMS सूचना पाठवा')}
//                                         </>
//                                     )}
//                                 </button>
//                             </div>

//                             {!userPhone && (
//                                 <div className="mt-3 bg-amber-50 border border-amber-200 rounded-2xl p-3 flex items-start gap-2">
//                                     <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
//                                     <div>
//                                         <p className="text-[12px] text-amber-800 font-medium">
//                                             {getText(
//                                                 'No phone number found in your profile',
//                                                 'आपकी प्रोफ़ाइल में फ़ोन नंबर नहीं मिला',
//                                                 'तुमच्या प्रोफाइलमध्ये फोन नंबर सापडला नाही'
//                                             )}
//                                         </p>
//                                         <button
//                                             onClick={() => { setShowSmsPreview(false); navigate('/profile'); }}
//                                             className="text-[#F5A623] text-[12px] font-semibold mt-1 underline"
//                                         >
//                                             {getText('Update Profile →', 'प्रोफ़ाइल अपडेट करें →', 'प्रोफाइल अपडेट करा →')}
//                                         </button>
//                                     </div>
//                                 </div>
//                             )}
//                         </motion.div>
//                     </motion.div>
//                 )}
//             </AnimatePresence>

//             {/* ── Header ── */}
//             <div className="bg-gradient-to-b from-[#1A3C1A] to-[#2D6A2D] pt-10 pb-6 px-4">
//                 <div className="flex items-center justify-between mb-4">
//                     <button
//                         onClick={() => navigate('/dashboard')}
//                         className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
//                     >
//                         <ArrowLeft className="w-5 h-5 text-white" />
//                     </button>
//                     <div className="flex items-center gap-2">
//                         <h2 className="font-semibold text-white text-[16px]">
//                             {getText('Notifications', 'सूचनाएं', 'सूचना')}
//                         </h2>
//                         {unreadCount > 0 && (
//                             <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
//                                 {unreadCount}
//                             </span>
//                         )}
//                     </div>
//                     <button
//                         onClick={markAllRead}
//                         className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
//                     >
//                         <CheckCheck className="w-4 h-4 text-white" />
//                     </button>
//                 </div>

//                 {/* Filter toggle */}
//                 <motion.div
//                     initial={{ opacity: 0, y: 12 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ duration: 0.25 }}
//                     className="bg-white/10 backdrop-blur-sm rounded-3xl border border-white/10"
//                 >
//                     <button
//                         onClick={() => setShowFilters(!showFilters)}
//                         className="w-full p-4 flex items-center justify-between"
//                     >
//                         <div className="flex items-center gap-3">
//                             <div className="w-10 h-10 rounded-2xl bg-white/15 flex items-center justify-center">
//                                 <Filter className="w-5 h-5 text-white" />
//                             </div>
//                             <div className="text-left">
//                                 <span className="text-white text-[14px] font-semibold block">
//                                     {getText('Filter notifications', 'सूचनाएं फ़िल्टर करें', 'सूचना फिल्टर करा')}
//                                 </span>
//                                 <span className="text-[#C8D8C8] text-[11px]">
//                                     {getText(
//                                         `${notifications.length} total • ${unreadCount} unread`,
//                                         `${notifications.length} कुल • ${unreadCount} अपठित`,
//                                         `${notifications.length} एकूण • ${unreadCount} न वाचलेले`
//                                     )}
//                                 </span>
//                             </div>
//                         </div>
//                         <Filter className={`w-4 h-4 text-white/70 ${showFilters ? 'rotate-180' : ''} transition-transform`} />
//                     </button>
//                 </motion.div>
//             </div>

//             <div className="px-4 pt-4 space-y-4">

//                 {/* ── Deadline Alert Banner ── */}
//                 <AnimatePresence>
//                     {totalDeadlineAlerts > 0 && !dismissedAlert && (
//                         <motion.div
//                             initial={{ opacity: 0, y: -8, scale: 0.98 }}
//                             animate={{ opacity: 1, y: 0, scale: 1 }}
//                             exit={{ opacity: 0, y: -8, scale: 0.98 }}
//                             transition={{ duration: 0.25 }}
//                             className={`rounded-3xl overflow-hidden shadow-sm border ${urgentDeadlines.length > 0
//                                 ? 'border-red-200 bg-gradient-to-r from-red-50 to-red-100/60'
//                                 : 'border-amber-200 bg-gradient-to-r from-amber-50 to-amber-100/60'
//                                 }`}
//                         >
//                             {/* Alert header */}
//                             <div className="p-4 pb-3">
//                                 <div className="flex items-start gap-3">
//                                     <div className={`w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 ${urgentDeadlines.length > 0 ? 'bg-red-500/15' : 'bg-amber-500/15'
//                                         }`}>
//                                         <ShieldAlert className={`w-6 h-6 ${urgentDeadlines.length > 0 ? 'text-red-600' : 'text-amber-600'
//                                             }`} />
//                                     </div>
//                                     <div className="flex-1 min-w-0">
//                                         <div className="flex items-center gap-2 mb-1">
//                                             <h3 className={`font-bold text-[14px] ${urgentDeadlines.length > 0 ? 'text-red-800' : 'text-amber-800'
//                                                 }`}>
//                                                 {urgentDeadlines.length > 0
//                                                     ? getText('⚠️ Urgent Deadline Alert!', '⚠️ तत्काल समय सीमा चेतावनी!', '⚠️ तातडीची मुदत सूचना!')
//                                                     : getText('📅 Upcoming Deadlines', '📅 आगामी समय सीमाएं', '📅 आगामी मुदती')
//                                                 }
//                                             </h3>
//                                             {urgentDeadlines.length > 0 && (
//                                                 <motion.div
//                                                     animate={{ scale: [1, 1.2, 1] }}
//                                                     transition={{ repeat: Infinity, duration: 1.5 }}
//                                                     className="w-2.5 h-2.5 rounded-full bg-red-500 flex-shrink-0"
//                                                 />
//                                             )}
//                                         </div>
//                                         <p className={`text-[12px] leading-relaxed ${urgentDeadlines.length > 0 ? 'text-red-700/80' : 'text-amber-700/80'
//                                             }`}>
//                                             {urgentDeadlines.length > 0
//                                                 ? getText(
//                                                     `You have ${urgentDeadlines.length} scheme${urgentDeadlines.length > 1 ? 's' : ''} with deadlines within 7 days!`,
//                                                     `आपकी ${urgentDeadlines.length} योजना${urgentDeadlines.length > 1 ? 'ओं' : ''} की समय सीमा 7 दिनों के भीतर है!`,
//                                                     `तुमच्या ${urgentDeadlines.length} योजन${urgentDeadlines.length > 1 ? 'ांची' : 'ेची'} मुदत 7 दिवसांत आहे!`
//                                                 )
//                                                 : getText(
//                                                     `${reminderDeadlines.length} scheme${reminderDeadlines.length > 1 ? 's have' : ' has'} deadlines approaching.`,
//                                                     `${reminderDeadlines.length} योजना${reminderDeadlines.length > 1 ? 'ओं' : ''} की समय सीमा निकट है।`,
//                                                     `${reminderDeadlines.length} योजन${reminderDeadlines.length > 1 ? 'ांची' : 'ेची'} मुदत जवळ येत आहे.`
//                                                 )
//                                             }
//                                         </p>
//                                     </div>
//                                     <button
//                                         onClick={() => setDismissedAlert(true)}
//                                         className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-black/5 transition-colors flex-shrink-0 mt-0.5"
//                                     >
//                                         <span className="text-[14px] text-gray-400">✕</span>
//                                     </button>
//                                 </div>
//                             </div>

//                             {/* Deadline scheme items */}
//                             <div className={`px-4 pb-2 space-y-1.5 ${urgentDeadlines.length > 0 ? 'border-t border-red-200/60' : 'border-t border-amber-200/60'
//                                 } pt-2.5`}>
//                                 {[...urgentDeadlines, ...reminderDeadlines].slice(0, 3).map((notif) => (
//                                     <motion.div
//                                         key={`alert-${notif.id}`}
//                                         whileTap={{ scale: 0.98 }}
//                                         onClick={() => {
//                                             markAsRead(notif.id);
//                                             if (notif.schemeId) navigate(`/scheme/${notif.schemeId}`);
//                                         }}
//                                         className={`flex items-center gap-2.5 p-2.5 rounded-2xl cursor-pointer transition-colors ${notif.type === 'deadline-urgent'
//                                             ? 'bg-white/70 hover:bg-white/90'
//                                             : 'bg-white/50 hover:bg-white/70'
//                                             }`}
//                                     >
//                                         <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${notif.type === 'deadline-urgent' ? 'bg-red-100' : 'bg-amber-100'
//                                             }`}>
//                                             <span className="text-[14px]">{notif.icon}</span>
//                                         </div>
//                                         <div className="flex-1 min-w-0">
//                                             <p className="text-[12px] font-semibold text-[#1C1C1E] truncate">
//                                                 {getText(notif.title, notif.titleHi, notif.titleMr)}
//                                             </p>
//                                         </div>
//                                         {/* SMS button on each item */}
//                                         <button
//                                             onClick={(e) => {
//                                                 e.stopPropagation();
//                                                 handleDirectSms(notif);
//                                             }}
//                                             className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${sentSmsIds.includes(notif.id)
//                                                 ? 'bg-green-100'
//                                                 : 'bg-[#2D6A2D]/10 hover:bg-[#2D6A2D]/20'
//                                                 }`}
//                                         >
//                                             {sentSmsIds.includes(notif.id)
//                                                 ? <CheckCircle className="w-3.5 h-3.5 text-green-600" />
//                                                 : <MessageSquare className="w-3.5 h-3.5 text-[#2D6A2D]" />
//                                             }
//                                         </button>
//                                         <div className={`px-2 py-0.5 rounded-full text-[9px] font-bold flex-shrink-0 ${notif.type === 'deadline-urgent'
//                                             ? 'bg-red-500 text-white'
//                                             : 'bg-amber-500 text-white'
//                                             }`}>
//                                             {notif.type === 'deadline-urgent'
//                                                 ? getText('URGENT', 'तत्काल', 'तातडी')
//                                                 : getText('SOON', 'जल्द', 'लवकर')
//                                             }
//                                         </div>
//                                     </motion.div>
//                                 ))}
//                             </div>

//                             {/* Action buttons */}
//                             <div className="px-4 pb-3 pt-1 flex gap-2">
//                                 <button
//                                     onClick={() => {
//                                         setFilter('deadline-urgent');
//                                         setShowFilters(true);
//                                         setDismissedAlert(true);
//                                     }}
//                                     className={`flex-1 py-2.5 rounded-2xl font-semibold text-[12px] flex items-center justify-center gap-1.5 transition-colors ${urgentDeadlines.length > 0
//                                         ? 'bg-red-600 text-white hover:bg-red-700'
//                                         : 'bg-amber-500 text-white hover:bg-amber-600'
//                                         }`}
//                                 >
//                                     <BellRing className="w-3.5 h-3.5" />
//                                     {getText('View All', 'सभी देखें', 'सर्व पहा')}
//                                 </button>
//                                 {unsentSmsCount > 0 && (
//                                     <button
//                                         onClick={handleSendAllSms}
//                                         disabled={smsSending || !userPhone}
//                                         className={`flex-1 py-2.5 rounded-2xl font-semibold text-[12px] flex items-center justify-center gap-1.5 transition-colors ${smsSending || !userPhone
//                                             ? 'bg-gray-200 text-gray-400'
//                                             : 'bg-[#2D6A2D] text-white hover:bg-[#1A3C1A]'
//                                             }`}
//                                     >
//                                         {smsSending ? (
//                                             <>
//                                                 <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
//                                                     <Clock className="w-3.5 h-3.5" />
//                                                 </motion.div>
//                                                 {getText('Sending...', 'भेज रहे...', 'पाठवत...')}
//                                             </>
//                                         ) : (
//                                             <>
//                                                 <Send className="w-3.5 h-3.5" />
//                                                 {getText(
//                                                     `SMS All (${unsentSmsCount})`,
//                                                     `सभी SMS (${unsentSmsCount})`,
//                                                     `सर्व SMS (${unsentSmsCount})`
//                                                 )}
//                                             </>
//                                         )}
//                                     </button>
//                                 )}
//                             </div>
//                         </motion.div>
//                     )}
//                 </AnimatePresence>

//                 {/* ── Filter chips ── */}
//                 <AnimatePresence>
//                     {showFilters && (
//                         <motion.div
//                             initial={{ height: 0, opacity: 0 }}
//                             animate={{ height: 'auto', opacity: 1 }}
//                             exit={{ height: 0, opacity: 0 }}
//                             transition={{ duration: 0.18 }}
//                             className="overflow-hidden"
//                         >
//                             <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
//                                 {filterOptions.map(f => (
//                                     <button
//                                         key={f.key}
//                                         onClick={() => setFilter(f.key)}
//                                         className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-[12px] font-semibold whitespace-nowrap border transition-all ${filter === f.key
//                                             ? 'bg-[#F5A623] text-white border-[#F5A623]'
//                                             : 'bg-white text-[#1C1C1E] border-gray-200'
//                                             }`}
//                                     >
//                                         <span>{f.label}</span>
//                                         <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${filter === f.key ? 'bg-white/25' : 'bg-gray-100'
//                                             }`}>
//                                             {f.count}
//                                         </span>
//                                     </button>
//                                 ))}
//                             </div>
//                         </motion.div>
//                     )}
//                 </AnimatePresence>

//                 {/* ── Summary cards ── */}
//                 {notifications.length > 0 && (
//                     <motion.div
//                         initial={{ opacity: 0, y: 12 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         transition={{ duration: 0.2 }}
//                         className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100"
//                     >
//                         <h3 className="font-bold text-[15px] text-[#1C1C1E] mb-3">
//                             {getText('Overview', 'सारांश', 'सारांश')}
//                         </h3>
//                         <div className="grid grid-cols-4 gap-2">
//                             <div className="bg-[#F7F3EE] rounded-2xl p-2.5 text-center">
//                                 <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-1">
//                                     <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
//                                 </div>
//                                 <div className="font-bold text-[16px] text-[#1C1C1E]">{urgentDeadlines.length}</div>
//                                 <div className="text-[9px] text-[#6B7280]">{getText('Urgent', 'तत्काल', 'तातडीचे')}</div>
//                             </div>
//                             <div className="bg-[#F7F3EE] rounded-2xl p-2.5 text-center">
//                                 <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-1">
//                                     <Calendar className="w-3.5 h-3.5 text-amber-600" />
//                                 </div>
//                                 <div className="font-bold text-[16px] text-[#1C1C1E]">{reminderDeadlines.length}</div>
//                                 <div className="text-[9px] text-[#6B7280]">{getText('Upcoming', 'आगामी', 'आगामी')}</div>
//                             </div>
//                             <div className="bg-[#F7F3EE] rounded-2xl p-2.5 text-center">
//                                 <div className="w-8 h-8 rounded-full bg-[#2D6A2D]/10 flex items-center justify-center mx-auto mb-1">
//                                     <MessageSquare className="w-3.5 h-3.5 text-[#2D6A2D]" />
//                                 </div>
//                                 <div className="font-bold text-[16px] text-[#1C1C1E]">{sentSmsIds.length}</div>
//                                 <div className="text-[9px] text-[#6B7280]">{getText('SMS Sent', 'SMS भेजे', 'SMS पाठवले')}</div>
//                             </div>
//                             <div className="bg-[#F7F3EE] rounded-2xl p-2.5 text-center">
//                                 <div className="w-8 h-8 rounded-full bg-[#97BC62]/20 flex items-center justify-center mx-auto mb-1">
//                                     <CheckCircle className="w-3.5 h-3.5 text-[#97BC62]" />
//                                 </div>
//                                 <div className="font-bold text-[16px] text-[#1C1C1E]">{notifications.filter(n => n.read).length}</div>
//                                 <div className="text-[9px] text-[#6B7280]">{getText('Read', 'पढ़ी', 'वाचलेले')}</div>
//                             </div>
//                         </div>
//                     </motion.div>
//                 )}

//                 {/* ── Empty state ── */}
//                 {notifications.length === 0 && (
//                     <motion.div
//                         initial={{ opacity: 0, y: 16 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         transition={{ duration: 0.2 }}
//                         className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 text-center mt-4"
//                     >
//                         <div className="w-20 h-20 rounded-3xl bg-[#2D6A2D]/10 flex items-center justify-center mx-auto mb-4">
//                             <Bell className="w-10 h-10 text-[#2D6A2D]" />
//                         </div>
//                         <h3 className="font-bold text-[18px] text-[#1C1C1E] mb-2">
//                             {getText('No Notifications', 'कोई सूचना नहीं', 'सूचना नाहीत')}
//                         </h3>
//                         <p className="text-[14px] text-[#6B7280] mb-6">
//                             {getText(
//                                 'Track schemes to get deadline alerts and updates',
//                                 'समय सीमा अलर्ट पाने के लिए योजनाएं ट्रैक करें',
//                                 'मुदत सूचना मिळवण्यासाठी योजना ट्रॅक करा'
//                             )}
//                         </p>
//                         <motion.button
//                             whileTap={{ scale: 0.97 }}
//                             onClick={() => navigate('/schemes')}
//                             className="bg-[#F5A623] text-white px-6 py-3.5 rounded-2xl font-bold text-[14px] shadow-lg shadow-[#F5A623]/30 flex items-center justify-center gap-2 mx-auto"
//                         >
//                             <Sparkles className="w-5 h-5" />
//                             {getText('Find Schemes', 'योजनाएं खोजें', 'योजना शोधा')}
//                         </motion.button>
//                     </motion.div>
//                 )}

//                 {/* ── Notification list ── */}
//                 {filtered.length > 0 && (
//                     <div>
//                         <h3 className="font-bold text-[15px] text-[#1C1C1E] mb-3">
//                             {getText('All Notifications', 'सभी सूचनाएं', 'सर्व सूचना')}
//                         </h3>
//                         <div className="space-y-3">
//                             {filtered.map((notif, idx) => {
//                                 const isDeadlineType = notif.type === 'deadline-urgent' || notif.type === 'deadline-reminder';
//                                 const alreadySent = sentSmsIds.includes(notif.id);

//                                 return (
//                                     <motion.div
//                                         key={notif.id}
//                                         initial={{ opacity: 0, y: 12 }}
//                                         animate={{ opacity: 1, y: 0 }}
//                                         transition={{ duration: 0.2, delay: idx * 0.04 }}
//                                         className={`rounded-3xl border transition-all shadow-sm overflow-hidden ${notif.read
//                                             ? 'bg-white border-gray-100'
//                                             : `${notif.bg} border-gray-100`
//                                             }`}
//                                     >
//                                         {/* Main notification content */}
//                                         <div
//                                             className="p-4 cursor-pointer"
//                                             onClick={() => {
//                                                 markAsRead(notif.id);
//                                                 if (notif.schemeId) navigate('/applications');
//                                             }}
//                                         >
//                                             <div className="flex items-start gap-3">
//                                                 <div className={`w-10 h-10 rounded-2xl ${notif.bg} flex items-center justify-center flex-shrink-0`}>
//                                                     <span className="text-lg">{notif.icon}</span>
//                                                 </div>
//                                                 <div className="flex-1 min-w-0">
//                                                     <div className="flex items-start justify-between gap-2">
//                                                         <h3 className={`font-bold text-[13px] leading-snug ${notif.read ? 'text-[#6B7280]' : 'text-[#1C1C1E]'
//                                                             }`}>
//                                                             {getText(notif.title, notif.titleHi, notif.titleMr)}
//                                                         </h3>
//                                                         <div className="flex items-center gap-1 flex-shrink-0">
//                                                             {!notif.read && (
//                                                                 <div className="w-2 h-2 rounded-full bg-[#F5A623]" />
//                                                             )}
//                                                             <button
//                                                                 onClick={e => {
//                                                                     e.stopPropagation();
//                                                                     deleteNotif(notif.id);
//                                                                 }}
//                                                                 className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors"
//                                                             >
//                                                                 <Trash2 className="w-3 h-3 text-gray-400" />
//                                                             </button>
//                                                         </div>
//                                                     </div>
//                                                     <p className={`text-[12px] mt-1 leading-relaxed ${notif.read ? 'text-[#9CA3AF]' : 'text-[#6B7280]'
//                                                         }`}>
//                                                         {getText(notif.message, notif.messageHi, notif.messageMr)}
//                                                     </p>
//                                                     <div className="flex items-center gap-2 mt-2">
//                                                         <Clock className="w-3 h-3 text-[#9CA3AF]" />
//                                                         <span className="text-[10px] text-[#9CA3AF]">{notif.time}</span>
//                                                         {notif.type === 'deadline-urgent' && (
//                                                             <span className="bg-red-100 text-red-700 text-[9px] font-bold px-2 py-0.5 rounded-full">
//                                                                 {getText('URGENT', 'तत्काल', 'तातडीचे')}
//                                                             </span>
//                                                         )}
//                                                         {notif.type === 'deadline-reminder' && (
//                                                             <span className="bg-amber-100 text-amber-700 text-[9px] font-bold px-2 py-0.5 rounded-full">
//                                                                 {getText('REMINDER', 'अनुस्मारक', 'स्मरणपत्र')}
//                                                             </span>
//                                                         )}
//                                                         {isDeadlineType && alreadySent && (
//                                                             <span className="bg-green-100 text-green-700 text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5">
//                                                                 <CheckCircle className="w-2.5 h-2.5" />
//                                                                 {getText('SMS Sent', 'SMS भेजा', 'SMS पाठवला')}
//                                                             </span>
//                                                         )}
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         </div>

//                                         {/* SMS action bar for deadline notifications */}
//                                         {isDeadlineType && !alreadySent && (
//                                             <div className={`px-4 py-2.5 border-t flex items-center justify-between ${notif.type === 'deadline-urgent'
//                                                 ? 'border-red-100 bg-red-50/50'
//                                                 : 'border-amber-100 bg-amber-50/50'
//                                                 }`}>
//                                                 <div className="flex items-center gap-2">
//                                                     <MessageSquare className={`w-3.5 h-3.5 ${notif.type === 'deadline-urgent' ? 'text-red-500' : 'text-amber-500'
//                                                         }`} />
//                                                     <span className="text-[11px] text-[#6B7280] font-medium">
//                                                         {getText(
//                                                             'Get SMS reminder on your phone',
//                                                             'अपने फोन पर SMS अनुस्मारक पाएं',
//                                                             'तुमच्या फोनवर SMS स्मरणपत्र मिळवा'
//                                                         )}
//                                                     </span>
//                                                 </div>
//                                                 <motion.button
//                                                     whileTap={{ scale: 0.95 }}
//                                                     onClick={(e) => {
//                                                         e.stopPropagation();
//                                                         handleDirectSms(notif);
//                                                     }}
//                                                     className={`px-3 py-1.5 rounded-xl text-[11px] font-bold flex items-center gap-1.5 transition-colors ${notif.type === 'deadline-urgent'
//                                                         ? 'bg-red-600 text-white hover:bg-red-700'
//                                                         : 'bg-amber-500 text-white hover:bg-amber-600'
//                                                         }`}
//                                                 >
//                                                     <Send className="w-3 h-3" />
//                                                     {getText('Send SMS', 'SMS भेजें', 'SMS पाठवा')}
//                                                 </motion.button>
//                                             </div>
//                                         )}

//                                         {/* SMS sent confirmation bar */}
//                                         {isDeadlineType && alreadySent && (
//                                             <div className="px-4 py-2 border-t border-green-100 bg-green-50/50 flex items-center gap-2">
//                                                 <CheckCircle className="w-3.5 h-3.5 text-green-600" />
//                                                 <span className="text-[11px] text-green-700 font-medium">
//                                                     {getText(
//                                                         `SMS alert sent to ${maskedPhone}`,
//                                                         `SMS अलर्ट ${maskedPhone} पर भेजा गया`,
//                                                         `SMS सूचना ${maskedPhone} वर पाठवली`
//                                                     )}
//                                                 </span>
//                                             </div>
//                                         )}
//                                     </motion.div>
//                                 );
//                             })}
//                         </div>
//                     </div>
//                 )}

//                 {/* ── Filtered empty state ── */}
//                 {notifications.length > 0 && filtered.length === 0 && (
//                     <motion.div
//                         initial={{ opacity: 0, y: 12 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         transition={{ duration: 0.2 }}
//                         className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 text-center"
//                     >
//                         <div className="w-14 h-14 rounded-2xl bg-[#F7F3EE] flex items-center justify-center mx-auto mb-3">
//                             <Bell className="w-7 h-7 text-[#9CA3AF]" />
//                         </div>
//                         <h3 className="font-bold text-[15px] text-[#1C1C1E] mb-1">
//                             {getText('No matching notifications', 'कोई मेल खाती सूचना नहीं', 'जुळणारी सूचना नाही')}
//                         </h3>
//                         <p className="text-[12px] text-[#6B7280]">
//                             {getText(
//                                 'Try a different filter to see more',
//                                 'अधिक देखने के लिए अलग फ़िल्टर आज़माएं',
//                                 'अधिक पाहण्यासाठी वेगळा फिल्टर वापरा'
//                             )}
//                         </p>
//                     </motion.div>
//                 )}

//                 {/* ── SMS History Section ── */}
//                 {sentSmsIds.length > 0 && (
//                     <motion.div
//                         initial={{ opacity: 0, y: 12 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         transition={{ duration: 0.2, delay: 0.1 }}
//                         className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100"
//                     >
//                         <div className="flex items-center justify-between mb-3">
//                             <h3 className="font-bold text-[15px] text-[#1C1C1E] flex items-center gap-2">
//                                 <MessageSquare className="w-4 h-4 text-[#2D6A2D]" />
//                                 {getText('SMS Alert History', 'SMS अलर्ट इतिहास', 'SMS सूचना इतिहास')}
//                             </h3>
//                             <span className="bg-[#2D6A2D]/10 text-[#2D6A2D] text-[10px] font-bold px-2 py-0.5 rounded-full">
//                                 {sentSmsIds.length} {getText('sent', 'भेजे', 'पाठवले')}
//                             </span>
//                         </div>
//                         <div className="space-y-2">
//                             {getSentSmsRecords().slice(-5).reverse().map((record, i) => (
//                                 <div key={i} className="bg-[#F7F3EE] rounded-2xl p-3 flex items-start gap-3">
//                                     <div className="w-8 h-8 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
//                                         <CheckCircle className="w-4 h-4 text-green-600" />
//                                     </div>
//                                     <div className="flex-1 min-w-0">
//                                         <p className="text-[12px] font-medium text-[#1C1C1E] truncate">
//                                             {record.message.split('\n')[0].replace('[JanSahayak] ', '')}
//                                         </p>
//                                         <div className="flex items-center gap-2 mt-1">
//                                             <Phone className="w-3 h-3 text-[#9CA3AF]" />
//                                             <span className="text-[10px] text-[#9CA3AF]">
//                                                 +91 {record.phone.replace(/(\d{2})\d{6}(\d{2})/, '$1******$2')}
//                                             </span>
//                                             <span className="text-[10px] text-[#9CA3AF]">•</span>
//                                             <span className="text-[10px] text-[#9CA3AF]">
//                                                 {new Date(record.sentAt).toLocaleDateString()}
//                                             </span>
//                                         </div>
//                                     </div>
//                                     <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${record.type === 'urgent'
//                                         ? 'bg-red-100 text-red-700'
//                                         : 'bg-amber-100 text-amber-700'
//                                         }`}>
//                                         {record.type === 'urgent'
//                                             ? getText('URGENT', 'तत्काल', 'तातडी')
//                                             : getText('REMINDER', 'अनुस्मारक', 'स्मरणपत्र')
//                                         }
//                                     </span>
//                                 </div>
//                             ))}
//                         </div>
//                     </motion.div>
//                 )}

//                 {/* ── Info footer ── */}
//                 {notifications.length > 0 && (
//                     <motion.div
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         transition={{ delay: 0.5 }}
//                         className="mt-2 bg-[#F0F7F0] rounded-3xl p-4 flex items-start gap-3 mb-4"
//                     >
//                         <div className="w-10 h-10 rounded-2xl bg-[#2D6A2D]/10 flex items-center justify-center flex-shrink-0">
//                             <span className="text-[16px]">ℹ️</span>
//                         </div>
//                         <div>
//                             <p className="text-[12px] text-[#6B7280] leading-relaxed">
//                                 {getText(
//                                     'Notifications are auto-generated from your tracked applications. SMS alerts are sent to your registered phone number for deadline reminders.',
//                                     'सूचनाएं आपके ट्रैक किए गए आवेदनों से स्वतः उत्पन्न होती हैं। समय सीमा अनुस्मारक के लिए SMS अलर्ट आपके पंजीकृत फोन नंबर पर भेजे जाते हैं।',
//                                     'सूचना तुमच्या ट्रॅक केलेल्या अर्जांमधून स्वयंचलितपणे तयार होतात. मुदत स्मरणपत्रांसाठी SMS सूचना तुमच्या नोंदणीकृत फोन नंबरवर पाठवल्या जातात.'
//                                 )}
//                             </p>
//                             {!userPhone && (
//                                 <button
//                                     onClick={() => navigate('/profile')}
//                                     className="text-[#F5A623] text-[12px] font-semibold mt-1.5 underline"
//                                 >
//                                     {getText(
//                                         'Add phone number in profile for SMS alerts →',
//                                         'SMS अलर्ट के लिए प्रोफ़ाइल में फ़ोन नंबर जोड़ें →',
//                                         'SMS सूचनांसाठी प्रोफाइलमध्ये फोन नंबर जोडा →'
//                                     )}
//                                 </button>
//                             )}
//                         </div>
//                     </motion.div>
//                 )}
//             </div>

//             <BottomNav />
//         </div>
//     );
// }

// src/screens/Notifications.tsx
import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  ArrowLeft, Bell, CheckCheck, Trash2,
  AlertCircle, CheckCircle, Clock, Calendar,
  Sparkles, Filter, AlertTriangle,
  ShieldAlert, BellRing, Phone,
  Send, X, ExternalLink, Share2,
} from 'lucide-react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../../context/LanguageContext';
import { useUser } from '../../context/UserContext';
import { type TrackedApplication, getTrackedApps, saveTrackedApps } from './SchemeMatcher';
import { BottomNav } from '../components/BottomNav';
import {
  extractPhone, maskPhone, isValidPhone,
  sendViaWhatsApp, sendToSelfWhatsApp, shareViaWhatsApp,
  buildWhatsAppMessage, getSentIds, getWhatsAppRecords,
  wasAlreadySent, type WhatsAppRecord, clearWhatsAppHistory
} from '../services/whatsappService';

// ─── WhatsApp Icon Component ──────────────────────────────────────────────────
function WhatsAppIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

// ─── Types ────────────────────────────────────────────────────────────────────
interface AppNotification {
  id: string;
  type: 'deadline-urgent' | 'deadline-reminder' | 'status' | 'saved' | 'tip';
  icon: string;
  color: string;
  bg: string;
  title: string;
  titleHi: string;
  titleMr: string;
  message: string;
  messageHi: string;
  messageMr: string;
  schemeId?: string;
  time: string;
  read: boolean;
}

// ─── Component ────────────────────────────────────────────────────────────────
export function Notifications() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { userData } = useUser();
  const isHindi = language === 'hi';
  const isMarathi = language === 'mr';

  const getText = useCallback((en: string, hi: string, mr: string) => {
    if (isMarathi) return mr;
    if (isHindi) return hi;
    return en;
  }, [isHindi, isMarathi]);

  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [dismissedAlert, setDismissedAlert] = useState(false);

  // WhatsApp states
  const [showWaPreview, setShowWaPreview] = useState(false);
  const [waTarget, setWaTarget] = useState<AppNotification | null>(null);
  const [sentWaIds, setSentWaIds] = useState<string[]>([]);
  const [waHistory, setWaHistory] = useState<WhatsAppRecord[]>([]);
  const [showWaHistory, setShowWaHistory] = useState(false);
  const [waToast, setWaToast] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error' | 'info';
  }>({ show: false, message: '', type: 'success' });

  // Phone from user profile
  const userPhone = extractPhone(userData);
  const maskedUserPhone = maskPhone(userPhone);
  const phoneValid = isValidPhone(userPhone);

  // Load WhatsApp history
  useEffect(() => {
    setSentWaIds(getSentIds());
    setWaHistory(getWhatsAppRecords());
  }, []);

  const refreshWaData = useCallback(() => {
    setSentWaIds(getSentIds());
    setWaHistory(getWhatsAppRecords());
  }, []);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info') => {
    setWaToast({ show: true, message, type });
    setTimeout(() => setWaToast(p => ({ ...p, show: false })), 4000);
  }, []);

  // ── Generate notifications ────────────────────────────────────────────────
  useEffect(() => {
    const apps = getTrackedApps();
    const notifs: AppNotification[] = [];
    const today = new Date();

    apps.forEach((app: TrackedApplication) => {
      const deadline = app.deadline ? new Date(app.deadline) : null;
      const daysLeft = deadline
        ? Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
        : null;

      if (daysLeft !== null && daysLeft > 0 && daysLeft <= 7) {
        notifs.push({
          id: `deadline-urgent-${app.schemeId}`,
          type: 'deadline-urgent',
          icon: '🔴', color: 'text-red-700', bg: 'bg-red-50',
          title: `Deadline in ${daysLeft} days!`,
          titleHi: `${daysLeft} दिनों में समय सीमा!`,
          titleMr: `${daysLeft} दिवसांत मुदत!`,
          message: `${app.schemeName} deadline is ${app.deadline}. Apply before it expires.`,
          messageHi: `${app.schemeNameHi} की समय सीमा ${app.deadline} है। समाप्त होने से पहले आवेदन करें।`,
          messageMr: `${app.schemeNameMr} ची मुदत ${app.deadline} आहे. संपण्यापूर्वी अर्ज करा.`,
          schemeId: app.schemeId,
          time: getText('Now', 'अभी', 'आता'),
          read: false,
        });
      }

      if (daysLeft !== null && daysLeft > 7 && daysLeft <= 30) {
        notifs.push({
          id: `deadline-reminder-${app.schemeId}`,
          type: 'deadline-reminder',
          icon: '🟡', color: 'text-amber-700', bg: 'bg-amber-50',
          title: `${daysLeft} days until deadline`,
          titleHi: `समय सीमा तक ${daysLeft} दिन`,
          titleMr: `मुदतीपर्यंत ${daysLeft} दिवस`,
          message: `${app.schemeName} — don't miss this opportunity. Prepare your documents.`,
          messageHi: `${app.schemeNameHi} — यह अवसर न चूकें। अपने दस्तावेज तैयार करें।`,
          messageMr: `${app.schemeNameMr} — ही संधी चुकवू नका. कागदपत्रे तयार ठेवा.`,
          schemeId: app.schemeId,
          time: getText('Today', 'आज', 'आज'),
          read: false,
        });
      }

      if (daysLeft !== null && daysLeft <= 0 && app.status === 'saved') {
        notifs.push({
          id: `expired-${app.schemeId}`,
          type: 'deadline-urgent',
          icon: '⚫', color: 'text-gray-700', bg: 'bg-gray-100',
          title: 'Deadline has passed',
          titleHi: 'समय सीमा बीत गई है',
          titleMr: 'मुदत संपली आहे',
          message: `${app.schemeName} deadline was ${app.deadline}. Scheme may no longer accept applications.`,
          messageHi: `${app.schemeNameHi} की समय सीमा ${app.deadline} थी। योजना अब आवेदन स्वीकार नहीं कर सकती।`,
          messageMr: `${app.schemeNameMr} ची मुदत ${app.deadline} होती. योजना आता अर्ज स्वीकारत नसेल.`,
          schemeId: app.schemeId,
          time: app.deadline,
          read: false,
        });
      }

      if (app.status !== 'saved') {
        const statusLabels: Record<string, { en: string; hi: string; mr: string }> = {
          applied: { en: 'Applied', hi: 'आवेदन किया', mr: 'अर्ज केला' },
          'under-review': { en: 'Under Review', hi: 'समीक्षाधीन', mr: 'पुनरावल��कनाखाली' },
          approved: { en: 'Approved', hi: 'स्वीकृत', mr: 'मंजूर' },
          disbursed: { en: 'Disbursed', hi: 'वितरित', mr: 'वितरित' },
        };
        const sl = statusLabels[app.status];
        if (sl) {
          notifs.push({
            id: `status-${app.schemeId}`,
            type: 'status',
            icon: app.status === 'approved' || app.status === 'disbursed' ? '🟢' : '🔵',
            color: app.status === 'approved' || app.status === 'disbursed' ? 'text-green-700' : 'text-blue-700',
            bg: app.status === 'approved' || app.status === 'disbursed' ? 'bg-green-50' : 'bg-blue-50',
            title: `${sl.en}: ${app.schemeName}`,
            titleHi: `${sl.hi}: ${app.schemeNameHi}`,
            titleMr: `${sl.mr}: ${app.schemeNameMr}`,
            message: `Your application for ${app.schemeName} is now "${sl.en}".`,
            messageHi: `${app.schemeNameHi} के लिए आपका आवेदन अब "${sl.hi}" है।`,
            messageMr: `${app.schemeNameMr} साठी तुमचा अर्ज आता "${sl.mr}" आहे.`,
            schemeId: app.schemeId,
            time: app.appliedDate,
            read: false,
          });
        }
      }

      if (app.status === 'saved') {
        notifs.push({
          id: `saved-${app.schemeId}`,
          type: 'saved',
          icon: '📌', color: 'text-purple-700', bg: 'bg-purple-50',
          title: 'Scheme Saved',
          titleHi: 'योजना सहेजी गई',
          titleMr: 'योजना जतन केली',
          message: `You saved ${app.schemeName}. Don't forget to apply before the deadline!`,
          messageHi: `आपने ${app.schemeNameHi} सहेजी है। समय सीमा से पहले आवेदन करना न भूलें!`,
          messageMr: `तुम्ही ${app.schemeNameMr} जतन केली. मुदतीपूर्वी अर्ज करायला विसरू नका!`,
          schemeId: app.schemeId,
          time: app.appliedDate,
          read: false,
        });
      }
    });

    if (apps.length > 0) {
      notifs.push({
        id: 'tip-1',
        type: 'tip',
        icon: '💡', color: 'text-[#2D6A2D]', bg: 'bg-[#F0F7F0]',
        title: 'Pro Tip',
        titleHi: 'सुझाव',
        titleMr: 'उपयुक्त सूचना',
        message: 'Complete your profile 100% to get better scheme matching and higher approval chances!',
        messageHi: 'बेहतर योजना मिलान और उच्च स्वीकृति के लिए अपनी प्रोफाइल 100% पूरी करें!',
        messageMr: 'चांगल्या योजना जुळणी आणि उच्च मंजुरी शक्यतांसाठी प्रोफाइल 100% पूर्ण करा!',
        time: getText('Tip', 'सुझाव', 'उपयुक्त सूचना'),
        read: false,
      });
    }

    const priority: Record<string, number> = {
      'deadline-urgent': 0, 'deadline-reminder': 1, status: 2, saved: 3, tip: 4,
    };
    notifs.sort((a, b) => (priority[a.type] ?? 5) - (priority[b.type] ?? 5));

    const readIds: string[] = JSON.parse(localStorage.getItem('notification-read') || '[]');
    notifs.forEach(n => { if (readIds.includes(n.id)) n.read = true; });

    setNotifications(notifs);
  }, [getText]);

  const handleSimulateAlerts = useCallback(() => {
    const apps = getTrackedApps();
    const today = new Date();
    const futureDate = (days: number) => {
      const d = new Date();
      d.setDate(today.getDate() + days);
      return d.toISOString().split('T')[0];
    };

    const mockApps: TrackedApplication[] = [
      {
        schemeId: 'sim-1',
        schemeName: 'PM-Kisan Maandhan Yojana',
        schemeNameHi: 'पीएम-किसान मानधन योजना',
        schemeNameMr: 'पीएम-किसान मानधन योजना',
        amount: '₹3,000/month',
        logo: '🌾',
        status: 'saved',
        appliedDate: today.toISOString().split('T')[0],
        deadline: futureDate(3),
        notes: 'Simulated urgent alert'
      },
      {
        schemeId: 'sim-2',
        schemeName: 'Sub-Mission on Agriculture Mechanization',
        schemeNameHi: 'कृषि यंत्रीकरण पर उप-मिशन',
        schemeNameMr: 'कृषी यांत्रिकीकरण उप-अभियान',
        amount: '50% Subsidy',
        logo: '🚜',
        status: 'saved',
        appliedDate: today.toISOString().split('T')[0],
        deadline: futureDate(15),
        notes: 'Simulated reminder'
      },
      {
        schemeId: 'sim-3',
        schemeName: 'PM Fasal Bima Yojana',
        schemeNameHi: 'पीएम फसल बीमा योजना',
        schemeNameMr: 'पीएम पीक विमा योजना',
        amount: 'Claim Settled',
        logo: '🛡️',
        status: 'approved',
        appliedDate: today.toISOString().split('T')[0],
        deadline: futureDate(60),
        notes: 'Simulated status update'
      }
    ];

    saveTrackedApps([...mockApps, ...apps]);
    window.location.reload();
  }, []);

  // ── Notification Actions ──────────────────────────────────────────────────
  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    const readIds: string[] = JSON.parse(localStorage.getItem('notification-read') || '[]');
    if (!readIds.includes(id)) {
      readIds.push(id);
      localStorage.setItem('notification-read', JSON.stringify(readIds));
    }
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    localStorage.setItem('notification-read', JSON.stringify(notifications.map(n => n.id)));
  };

  const deleteNotif = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // ── WhatsApp Actions ──────────────────────────────────────────────────────
  const getWaMessage = useCallback((notif: AppNotification): string => {
    const title = getText(notif.title, notif.titleHi, notif.titleMr);
    const body = getText(notif.message, notif.messageHi, notif.messageMr);
    return buildWhatsAppMessage(title, body, language, notif.schemeId);
  }, [getText, language]);

  const handleWaPreview = (notif: AppNotification) => {
    setWaTarget(notif);
    setShowWaPreview(true);
  };

  const handleSendWhatsApp = useCallback(() => {
    if (!waTarget) return;

    const message = getWaMessage(waTarget);
    const type = waTarget.type;
    let success: boolean;

    if (phoneValid) {
      success = sendViaWhatsApp(userPhone, message, waTarget.id, waTarget.schemeId, type);
    } else {
      success = sendToSelfWhatsApp(message, waTarget.id, waTarget.schemeId, type);
    }

    setShowWaPreview(false);
    setWaTarget(null);
    refreshWaData();

    if (success) {
      showToast(
        getText(
          'WhatsApp opened! Send the message to complete.',
          'WhatsApp खुला! भेजने के लिए संदेश भेजें।',
          'WhatsApp उघडले! पूर्ण करण्यासाठी संदेश पाठवा.'
        ),
        'success'
      );
    } else {
      showToast(
        getText('Failed to open WhatsApp', 'WhatsApp खोलने में विफल', 'WhatsApp उघडण्यात अयशस्वी'),
        'error'
      );
    }
  }, [waTarget, phoneValid, userPhone, getWaMessage, refreshWaData, showToast, getText]);

  const handleShareWhatsApp = useCallback(async (notif: AppNotification) => {
    const message = getWaMessage(notif);
    const shared = await shareViaWhatsApp(message);

    if (!shared) {
      // Fallback to wa.me link
      const type = notif.type;
      if (phoneValid) {
        sendViaWhatsApp(userPhone, message, notif.id, notif.schemeId, type);
      } else {
        sendToSelfWhatsApp(message, notif.id, notif.schemeId, type);
      }
    }

    refreshWaData();
    showToast(
      getText('WhatsApp opened!', 'WhatsApp खुला!', 'WhatsApp उघडले!'),
      'success'
    );
  }, [getWaMessage, phoneValid, userPhone, refreshWaData, showToast, getText]);

  // ── Filter & derived ──────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    if (filter === 'all') return notifications;
    if (filter === 'unread') return notifications.filter(n => !n.read);
    return notifications.filter(n => n.type === filter);
  }, [notifications, filter]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const urgentDeadlines = useMemo(
    () => notifications.filter(n => n.type === 'deadline-urgent' && !n.read),
    [notifications]
  );

  const reminderDeadlines = useMemo(
    () => notifications.filter(n => n.type === 'deadline-reminder' && !n.read),
    [notifications]
  );

  const totalDeadlineAlerts = urgentDeadlines.length + reminderDeadlines.length;

  const unsentWaCount = useMemo(
    () => [...urgentDeadlines, ...reminderDeadlines].filter(n => !sentWaIds.includes(n.id)).length,
    [urgentDeadlines, reminderDeadlines, sentWaIds]
  );

  const handleSendAllWhatsApp = useCallback(() => {
    const deadlineNotifs = [...urgentDeadlines, ...reminderDeadlines]
      .filter(n => !sentWaIds.includes(n.id));

    if (deadlineNotifs.length === 0) return;

    // Send first one immediately, rest user can do from list
    const first = deadlineNotifs[0];
    const message = getWaMessage(first);
    const type = first.type;

    if (phoneValid) {
      sendViaWhatsApp(userPhone, message, first.id, first.schemeId, type);
    } else {
      sendToSelfWhatsApp(message, first.id, first.schemeId, type);
    }

    refreshWaData();

    showToast(
      getText(
        `WhatsApp opened for 1/${deadlineNotifs.length} alerts. Send remaining from below.`,
        `1/${deadlineNotifs.length} अलर्ट के लिए WhatsApp खुला। बाकी नीचे से भेजें।`,
        `1/${deadlineNotifs.length} सूचनांसाठी WhatsApp उघडले. बाकीचे खालून पाठवा.`
      ),
      'info'
    );
  }, [urgentDeadlines, reminderDeadlines, sentWaIds, phoneValid, userPhone, getWaMessage, refreshWaData, showToast, getText]);

  const filterOptions = [
    { key: 'all', label: getText('All', 'सभी', 'सर्व'), count: notifications.length },
    { key: 'unread', label: getText('Unread', 'अपठित', 'न वाचलेले'), count: unreadCount },
    { key: 'deadline-urgent', label: getText('Urgent', 'तत्काल', 'तातडीचे'), count: notifications.filter(n => n.type === 'deadline-urgent').length },
    { key: 'deadline-reminder', label: getText('Reminders', 'अनुस्मारक', 'स्मरणपत्रे'), count: notifications.filter(n => n.type === 'deadline-reminder').length },
    { key: 'status', label: getText('Status', 'स्थिति', 'स्थिती'), count: notifications.filter(n => n.type === 'status').length },
  ];

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#F7F3EE] pb-24">

      {/* ══ Toast ══ */}
      <AnimatePresence>
        {waToast.show && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-32 left-4 right-4 z-[100] pointer-events-none"
          >
            <div className={`mx-auto max-w-sm px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border pointer-events-auto ${waToast.type === 'success' ? 'bg-[#25D366] text-white border-[#25D366]'
              : waToast.type === 'error' ? 'bg-red-600 text-white border-red-500'
                : 'bg-[#F5A623] text-white border-[#F5A623]'
              }`}>
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                {waToast.type === 'success' ? <WhatsAppIcon className="w-5 h-5" />
                  : waToast.type === 'error' ? <AlertCircle className="w-5 h-5" />
                    : <Bell className="w-5 h-5" />}
              </div>
              <p className="text-[13px] font-semibold flex-1 leading-tight">{waToast.message}</p>
              <button
                onClick={() => setWaToast(p => ({ ...p, show: false }))}
                className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center flex-shrink-0 hover:bg-white/25 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══ WhatsApp Preview Modal ══ */}
      <AnimatePresence>
        {showWaPreview && waTarget && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 flex items-end justify-center"
            onClick={() => { setShowWaPreview(false); setWaTarget(null); }}
          >
            <motion.div
              initial={{ y: 300 }}
              animate={{ y: 0 }}
              exit={{ y: 300 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-t-3xl w-full max-w-md p-6 pb-8"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-[#25D366]/10 flex items-center justify-center">
                    <WhatsAppIcon className="w-5 h-5 text-[#25D366]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[16px] text-[#1C1C1E]">
                      {getText('WhatsApp Alert', 'WhatsApp अलर्ट', 'WhatsApp सूचना')}
                    </h3>
                    <p className="text-[11px] text-[#6B7280]">
                      {getText('No API key needed', 'कोई API कुंजी नहीं', 'API कुंजी आवश्यक नाही')}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => { setShowWaPreview(false); setWaTarget(null); }}
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>

              {/* Phone info */}
              <div className={`rounded-2xl p-3 mb-3 flex items-center gap-3 ${phoneValid ? 'bg-[#25D366]/5 border border-[#25D366]/20' : 'bg-[#F7F3EE] border border-gray-200'
                }`}>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${phoneValid ? 'bg-[#25D366]/10' : 'bg-gray-100'
                  }`}>
                  <Phone className={`w-4 h-4 ${phoneValid ? 'text-[#25D366]' : 'text-gray-500'}`} />
                </div>
                <div className="flex-1">
                  <p className="text-[11px] text-[#6B7280]">
                    {phoneValid
                      ? getText('Sending to', 'भेजा जाएगा', 'पाठवले जाईल')
                      : getText('Send to yourself', 'खुद को भेजें', 'स्वतःला पाठवा')
                    }
                  </p>
                  <p className="text-[14px] font-bold text-[#1C1C1E]">
                    {phoneValid
                      ? `+91 ${maskedUserPhone}`
                      : getText('Your WhatsApp', 'आपका WhatsApp', 'तुमचा WhatsApp')
                    }
                  </p>
                </div>
                {phoneValid && <CheckCircle className="w-5 h-5 text-[#25D366] flex-shrink-0" />}
              </div>

              {/* Message preview */}
              <div className="rounded-2xl mb-4 overflow-hidden border border-gray-200">
                {/* WhatsApp-style header */}
                <div className="bg-[#075E54] px-4 py-2.5 flex items-center gap-2">
                  <WhatsAppIcon className="w-4 h-4 text-white" />
                  <span className="text-white text-[12px] font-semibold">
                    {getText('Message Preview', 'संदेश पूर्वावलोकन', 'संदेश पूर्वावलोकन')}
                  </span>
                </div>
                {/* WhatsApp-style chat bubble */}
                <div className="bg-[#ECE5DD] p-4">
                  <div className="bg-[#DCF8C6] rounded-xl rounded-tl-none p-3 shadow-sm max-w-[90%]">
                    <p className="text-[12px] text-[#1C1C1E] leading-relaxed whitespace-pre-line">
                      {getWaMessage(waTarget)}
                    </p>
                    <div className="flex items-center justify-end gap-1 mt-1.5">
                      <span className="text-[9px] text-[#6B7280]">
                        {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Already sent */}
              {sentWaIds.includes(waTarget.id) && (
                <div className="bg-[#25D366]/10 border border-[#25D366]/20 rounded-2xl p-3 mb-4 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#25D366] flex-shrink-0" />
                  <p className="text-[12px] text-[#25D366] font-medium">
                    {getText(
                      'WhatsApp message already sent for this alert',
                      'इस अलर्ट के लिए WhatsApp संदेश पहले ही भेजा गया',
                      'या सूचनेसाठी WhatsApp संदेश आधीच पाठवला'
                    )}
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => { setShowWaPreview(false); setWaTarget(null); }}
                  className="flex-1 py-3 border border-gray-300 text-[#1C1C1E] rounded-2xl font-medium text-[13px]"
                >
                  {getText('Cancel', 'रद्द करें', 'रद्द करा')}
                </button>
                <button
                  onClick={handleSendWhatsApp}
                  className="flex-[2] py-3 bg-[#25D366] text-white rounded-2xl font-bold text-[14px] flex items-center justify-center gap-2 shadow-lg shadow-[#25D366]/30"
                >
                  <WhatsAppIcon className="w-5 h-5" />
                  {phoneValid
                    ? getText('Send via WhatsApp', 'WhatsApp से भेजें', 'WhatsApp ने पाठवा')
                    : getText('Open WhatsApp', 'WhatsApp खोलें', 'WhatsApp उघडा')
                  }
                </button>
              </div>

              {/* Share option */}
              {typeof navigator.share === 'function' && (
                <button
                  onClick={() => handleShareWhatsApp(waTarget)}
                  className="w-full mt-3 py-2.5 border border-[#25D366]/30 text-[#25D366] rounded-2xl font-semibold text-[12px] flex items-center justify-center gap-2"
                >
                  <Share2 className="w-4 h-4" />
                  {getText('Share to anyone', 'किसी को भी शेयर करें', 'कोणालाही शेअर करा')}
                </button>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══ Header ══ */}
      <div className="bg-gradient-to-b from-[#1A3C1A] to-[#2D6A2D] pt-10 pb-6 px-4">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div className="flex items-center gap-2">
            <h2 className="font-semibold text-white text-[16px]">
              {getText('Notifications', 'सूचनाएं', 'सूचना')}
            </h2>
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          <button
            onClick={markAllRead}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <CheckCheck className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Filter toggle */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="bg-white/10 backdrop-blur-sm rounded-3xl border border-white/10"
        >
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="w-full p-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/15 flex items-center justify-center">
                <Filter className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <span className="text-white text-[14px] font-semibold block">
                  {getText('Filter notifications', 'सूचनाएं फ़िल्टर करें', 'सूचना फिल्टर करा')}
                </span>
                <span className="text-[#C8D8C8] text-[11px]">
                  {getText(
                    `${notifications.length} total • ${unreadCount} unread`,
                    `${notifications.length} कुल • ${unreadCount} अपठित`,
                    `${notifications.length} एकूण • ${unreadCount} न वाचलेले`
                  )}
                </span>
              </div>
            </div>
            <Filter className={`w-4 h-4 text-white/70 ${showFilters ? 'rotate-180' : ''} transition-transform`} />
          </button>
        </motion.div>
      </div>

      <div className="px-4 pt-4 space-y-4">

        {/* ── Deadline Alert Banner ── */}
        <AnimatePresence>
          {totalDeadlineAlerts > 0 && !dismissedAlert && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.25 }}
              className={`rounded-3xl overflow-hidden shadow-sm border ${urgentDeadlines.length > 0
                ? 'border-red-200 bg-gradient-to-r from-red-50 to-red-100/60'
                : 'border-amber-200 bg-gradient-to-r from-amber-50 to-amber-100/60'
                }`}
            >
              <div className="p-4 pb-3">
                <div className="flex items-start gap-3">
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 ${urgentDeadlines.length > 0 ? 'bg-red-500/15' : 'bg-amber-500/15'
                    }`}>
                    <ShieldAlert className={`w-6 h-6 ${urgentDeadlines.length > 0 ? 'text-red-600' : 'text-amber-600'
                      }`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className={`font-bold text-[14px] ${urgentDeadlines.length > 0 ? 'text-red-800' : 'text-amber-800'
                        }`}>
                        {urgentDeadlines.length > 0
                          ? getText('⚠️ Urgent Deadline!', '⚠️ तत्काल समय सीमा!', '⚠️ तातडीची मुदत!')
                          : getText('📅 Upcoming Deadlines', '📅 आगामी समय सीमाएं', '📅 आगामी मुदती')
                        }
                      </h3>
                      {urgentDeadlines.length > 0 && (
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ repeat: Infinity, duration: 1.5 }}
                          className="w-2.5 h-2.5 rounded-full bg-red-500 flex-shrink-0"
                        />
                      )}
                    </div>
                    <p className={`text-[12px] leading-relaxed ${urgentDeadlines.length > 0 ? 'text-red-700/80' : 'text-amber-700/80'
                      }`}>
                      {urgentDeadlines.length > 0
                        ? getText(
                          `${urgentDeadlines.length} scheme${urgentDeadlines.length > 1 ? 's' : ''} expiring within 7 days!`,
                          `${urgentDeadlines.length} योजना${urgentDeadlines.length > 1 ? 'ओं' : ''} की समय सीमा 7 दिनों में!`,
                          `${urgentDeadlines.length} योजन${urgentDeadlines.length > 1 ? 'ांची' : 'ेची'} मुदत 7 दिवसांत!`
                        )
                        : getText(
                          `${reminderDeadlines.length} deadline${reminderDeadlines.length > 1 ? 's' : ''} approaching.`,
                          `${reminderDeadlines.length} समय सीमा निकट।`,
                          `${reminderDeadlines.length} मुदत जवळ येत आहे.`
                        )
                      }
                    </p>
                  </div>
                  <button
                    onClick={() => setDismissedAlert(true)}
                    className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-black/5 flex-shrink-0"
                  >
                    <X className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Deadline items */}
              <div className={`px-4 pb-2 space-y-1.5 border-t pt-2.5 ${urgentDeadlines.length > 0 ? 'border-red-200/60' : 'border-amber-200/60'
                }`}>
                {[...urgentDeadlines, ...reminderDeadlines].slice(0, 3).map(notif => (
                  <motion.div
                    key={`alert-${notif.id}`}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      markAsRead(notif.id);
                      if (notif.schemeId) navigate(`/scheme/${notif.schemeId}`);
                    }}
                    className={`flex items-center gap-2.5 p-2.5 rounded-2xl cursor-pointer transition-colors ${notif.type === 'deadline-urgent'
                      ? 'bg-white/70 hover:bg-white/90'
                      : 'bg-white/50 hover:bg-white/70'
                      }`}
                  >
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${notif.type === 'deadline-urgent' ? 'bg-red-100' : 'bg-amber-100'
                      }`}>
                      <span className="text-[14px]">{notif.icon}</span>
                    </div>
                    <p className="text-[12px] font-semibold text-[#1C1C1E] truncate flex-1">
                      {getText(notif.title, notif.titleHi, notif.titleMr)}
                    </p>
                    <button
                      onClick={e => { e.stopPropagation(); handleWaPreview(notif); }}
                      className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${sentWaIds.includes(notif.id)
                        ? 'bg-[#25D366]/10'
                        : 'bg-[#25D366]/10 hover:bg-[#25D366]/20'
                        }`}
                    >
                      {sentWaIds.includes(notif.id)
                        ? <CheckCircle className="w-3.5 h-3.5 text-[#25D366]" />
                        : <WhatsAppIcon className="w-3.5 h-3.5 text-[#25D366]" />
                      }
                    </button>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${notif.type === 'deadline-urgent'
                      ? 'bg-red-500 text-white'
                      : 'bg-amber-500 text-white'
                      }`}>
                      {notif.type === 'deadline-urgent'
                        ? getText('URGENT', 'तत्काल', 'तातडी')
                        : getText('SOON', 'जल्द', 'लवकर')
                      }
                    </span>
                  </motion.div>
                ))}
              </div>

              {/* Banner actions */}
              <div className="px-4 pb-3 pt-1 flex gap-2">
                <button
                  onClick={() => {
                    setFilter('deadline-urgent');
                    setShowFilters(true);
                    setDismissedAlert(true);
                  }}
                  className={`flex-1 py-2.5 rounded-2xl font-semibold text-[12px] flex items-center justify-center gap-1.5 ${urgentDeadlines.length > 0
                    ? 'bg-red-600 text-white'
                    : 'bg-amber-500 text-white'
                    }`}
                >
                  <BellRing className="w-3.5 h-3.5" />
                  {getText('View All', 'सभी देखें', 'सर्व पहा')}
                </button>
                {unsentWaCount > 0 && (
                  <button
                    onClick={handleSendAllWhatsApp}
                    className="flex-1 py-2.5 rounded-2xl font-semibold text-[12px] flex items-center justify-center gap-1.5 bg-[#25D366] text-white"
                  >
                    <WhatsAppIcon className="w-3.5 h-3.5" />
                    {getText(`WhatsApp (${unsentWaCount})`, `WhatsApp (${unsentWaCount})`, `WhatsApp (${unsentWaCount})`)}
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Filter chips ── */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="overflow-hidden"
            >
              <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
                {filterOptions.map(f => (
                  <button
                    key={f.key}
                    onClick={() => setFilter(f.key)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-[12px] font-semibold whitespace-nowrap border transition-all ${filter === f.key
                      ? 'bg-[#F5A623] text-white border-[#F5A623]'
                      : 'bg-white text-[#1C1C1E] border-gray-200'
                      }`}
                  >
                    <span>{f.label}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${filter === f.key ? 'bg-white/25' : 'bg-gray-100'
                      }`}>{f.count}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Summary ── */}
        {notifications.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100"
          >
            <h3 className="font-bold text-[15px] text-[#1C1C1E] mb-3">
              {getText('Overview', 'सारांश', 'सारांश')}
            </h3>
            <div className="grid grid-cols-4 gap-2">
              <div className="bg-[#F7F3EE] rounded-2xl p-2.5 text-center">
                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                </div>
                <div className="font-bold text-[16px] text-[#1C1C1E]">{urgentDeadlines.length}</div>
                <div className="text-[9px] text-[#6B7280]">{getText('Urgent', 'तत्काल', 'तातडीचे')}</div>
              </div>
              <div className="bg-[#F7F3EE] rounded-2xl p-2.5 text-center">
                <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-1">
                  <Calendar className="w-3.5 h-3.5 text-amber-600" />
                </div>
                <div className="font-bold text-[16px] text-[#1C1C1E]">{reminderDeadlines.length}</div>
                <div className="text-[9px] text-[#6B7280]">{getText('Upcoming', 'आगामी', 'आगामी')}</div>
              </div>
              <div className="bg-[#F7F3EE] rounded-2xl p-2.5 text-center">
                <div className="w-8 h-8 rounded-full bg-[#25D366]/15 flex items-center justify-center mx-auto mb-1">
                  <WhatsAppIcon className="w-3.5 h-3.5 text-[#25D366]" />
                </div>
                <div className="font-bold text-[16px] text-[#1C1C1E]">{sentWaIds.length}</div>
                <div className="text-[9px] text-[#6B7280]">{getText('WA Sent', 'WA भेजे', 'WA पाठवले')}</div>
              </div>
              <div className="bg-[#F7F3EE] rounded-2xl p-2.5 text-center">
                <div className="w-8 h-8 rounded-full bg-[#97BC62]/20 flex items-center justify-center mx-auto mb-1">
                  <CheckCircle className="w-3.5 h-3.5 text-[#97BC62]" />
                </div>
                <div className="font-bold text-[16px] text-[#1C1C1E]">{notifications.filter(n => n.read).length}</div>
                <div className="text-[9px] text-[#6B7280]">{getText('Read', 'पढ़ी', 'वाचलेले')}</div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── Empty state ── */}
        {notifications.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 text-center"
          >
            <div className="w-20 h-20 rounded-3xl bg-[#2D6A2D]/10 flex items-center justify-center mx-auto mb-4">
              <Bell className="w-10 h-10 text-[#2D6A2D]" />
            </div>
            <h3 className="font-bold text-[18px] text-[#1C1C1E] mb-2">
              {getText('No Notifications', 'कोई सूचना नहीं', 'सूचना नाहीत')}
            </h3>
            <p className="text-[14px] text-[#6B7280] mb-6">
              {getText(
                'Track schemes to get deadline alerts via WhatsApp',
                'WhatsApp पर समय सीमा अलर्ट पाने के लिए योजनाएं ट्रैक करें',
                'WhatsApp वर मुदत सूचना मिळवण्यासाठी योजना ट्रॅक करा'
              )}
            </p>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/schemes')}
              className="bg-[#F5A623] text-white px-6 py-3.5 rounded-2xl font-bold text-[14px] shadow-lg shadow-[#F5A623]/30 flex items-center justify-center gap-2 mx-auto"
            >
              <Sparkles className="w-5 h-5" />
              {getText('Find Schemes', 'योजनाएं खोजें', 'योजना शोधा')}
            </motion.button>
          </motion.div>
        )}

        {/* ── Notification list ── */}
        {filtered.length > 0 && (
          <div>
            <h3 className="font-bold text-[15px] text-[#1C1C1E] mb-3">
              {getText('All Notifications', 'सभी सूचनाएं', 'सर्व सूचना')}
            </h3>
            <div className="space-y-3">
              {filtered.map((notif, idx) => {
                const isDeadline = notif.type === 'deadline-urgent' || notif.type === 'deadline-reminder';
                const alreadySent = sentWaIds.includes(notif.id);

                return (
                  <motion.div
                    key={notif.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: idx * 0.04 }}
                    className={`rounded-3xl border shadow-sm overflow-hidden ${notif.read ? 'bg-white border-gray-100' : `${notif.bg} border-gray-100`
                      }`}
                  >
                    <div
                      className="p-4 cursor-pointer"
                      onClick={() => {
                        markAsRead(notif.id);
                        if (notif.schemeId) navigate('/applications');
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-2xl ${notif.bg} flex items-center justify-center flex-shrink-0`}>
                          <span className="text-lg">{notif.icon}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className={`font-bold text-[13px] leading-snug ${notif.read ? 'text-[#6B7280]' : 'text-[#1C1C1E]'
                              }`}>
                              {getText(notif.title, notif.titleHi, notif.titleMr)}
                            </h3>
                            <div className="flex items-center gap-1 flex-shrink-0">
                              {!notif.read && <div className="w-2 h-2 rounded-full bg-[#F5A623]" />}
                              <button
                                onClick={e => { e.stopPropagation(); deleteNotif(notif.id); }}
                                className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-200"
                              >
                                <Trash2 className="w-3 h-3 text-gray-400" />
                              </button>
                            </div>
                          </div>
                          <p className={`text-[12px] mt-1 leading-relaxed ${notif.read ? 'text-[#9CA3AF]' : 'text-[#6B7280]'
                            }`}>
                            {getText(notif.message, notif.messageHi, notif.messageMr)}
                          </p>
                          <div className="flex items-center gap-2 mt-2 flex-wrap">
                            <Clock className="w-3 h-3 text-[#9CA3AF]" />
                            <span className="text-[10px] text-[#9CA3AF]">{notif.time}</span>
                            {notif.type === 'deadline-urgent' && (
                              <span className="bg-red-100 text-red-700 text-[9px] font-bold px-2 py-0.5 rounded-full">
                                {getText('URGENT', 'तत्काल', 'तातडीचे')}
                              </span>
                            )}
                            {notif.type === 'deadline-reminder' && (
                              <span className="bg-amber-100 text-amber-700 text-[9px] font-bold px-2 py-0.5 rounded-full">
                                {getText('REMINDER', 'अनुस्मारक', 'स्मरणपत्र')}
                              </span>
                            )}
                            {isDeadline && alreadySent && (
                              <span className="bg-[#25D366]/10 text-[#25D366] text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5">
                                <WhatsAppIcon className="w-2.5 h-2.5" />
                                {getText('WA Sent', 'WA भेजा', 'WA पाठवला')}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* WhatsApp action bar */}
                    {isDeadline && !alreadySent && (
                      <div className={`px-4 py-2.5 border-t flex items-center justify-between ${notif.type === 'deadline-urgent'
                        ? 'border-red-100 bg-red-50/50'
                        : 'border-amber-100 bg-amber-50/50'
                        }`}>
                        <div className="flex items-center gap-2">
                          <WhatsAppIcon className={`w-3.5 h-3.5 ${notif.type === 'deadline-urgent' ? 'text-red-500' : 'text-amber-500'
                            }`} />
                          <span className="text-[11px] text-[#6B7280] font-medium">
                            {getText(
                              'Send reminder via WhatsApp',
                              'WhatsApp से अनुस्मारक भेजें',
                              'WhatsApp ने स्मरणपत्र पाठवा'
                            )}
                          </span>
                        </div>
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={e => { e.stopPropagation(); handleWaPreview(notif); }}
                          className="px-3 py-1.5 rounded-xl text-[11px] font-bold flex items-center gap-1.5 bg-[#25D366] text-white"
                        >
                          <WhatsAppIcon className="w-3 h-3" />
                          {getText('WhatsApp', 'WhatsApp', 'WhatsApp')}
                        </motion.button>
                      </div>
                    )}

                    {isDeadline && alreadySent && (
                      <div className="px-4 py-2 border-t border-[#25D366]/10 bg-[#25D366]/5 flex items-center gap-2">
                        <CheckCircle className="w-3.5 h-3.5 text-[#25D366]" />
                        <span className="text-[11px] text-[#25D366] font-medium">
                          {getText(
                            'WhatsApp reminder sent',
                            'WhatsApp अनुस्मारक भेजा गया',
                            'WhatsApp स्मरणपत्र पाठवले'
                          )}
                        </span>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {notifications.length === 0 && (
          <div className="text-center py-12 px-6">
            <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-sm border border-gray-100">
              <Bell className="w-8 h-8 text-gray-300" />
            </div>
            <h3 className="text-gray-900 font-bold text-[18px] mb-2">
              {getText('No Notifications yet', 'कोई सूचना नहीं', 'अद्याप कोणतीही सूचना नाही')}
            </h3>
            <p className="text-gray-500 text-[14px] mb-8 max-w-[240px] mx-auto leading-relaxed">
              {getText('We will notify you about important deadlines and scheme updates here.', 'हम आपको महत्वपूर्ण समय सीमा और योजना अपडेट के बारे में यहां सूचित करेंगे।', 'आम्ही तुम्हाला महत्त्वाच्या मुदती आणि योजनेच्या अपडेट्सबद्दल येथे कळवू.')}
            </p>

            <button
              onClick={handleSimulateAlerts}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#1A3C1A] text-white rounded-2xl font-bold text-[14px] shadow-lg shadow-[#1A3C1A]/20 hover:bg-[#2D6A2D] transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              {getText('Simulate Demo Alerts', 'डेमो अलर्ट सिमुलेट करें', 'डेमो अलर्ट पहा')}
            </button>
          </div>
        )}

        {/* ── Filtered empty ── */}
        {notifications.length > 0 && filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 text-center"
          >
            <div className="w-14 h-14 rounded-2xl bg-[#F7F3EE] flex items-center justify-center mx-auto mb-3">
              <Bell className="w-7 h-7 text-[#9CA3AF]" />
            </div>
            <h3 className="font-bold text-[15px] text-[#1C1C1E] mb-1">
              {getText('No matching notifications', 'कोई मेल खाती सूचना नहीं', 'जुळणारी सूचना नाही')}
            </h3>
            <p className="text-[12px] text-[#6B7280]">
              {getText('Try a different filter', 'अलग फ़िल्टर आज़माएं', 'वेगळा फिल्टर वापरा')}
            </p>
          </motion.div>
        )}

        {/* ── WhatsApp History ── */}
        {waHistory.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.1 }}
            className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden"
          >
            <button
              onClick={() => setShowWaHistory(!showWaHistory)}
              className="w-full p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#25D366]/10 flex items-center justify-center">
                  <WhatsAppIcon className="w-4 h-4 text-[#25D366]" />
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-[14px] text-[#1C1C1E]">
                    {getText('WhatsApp History', 'WhatsApp इतिहास', 'WhatsApp इतिहास')}
                  </h3>
                  <p className="text-[11px] text-[#6B7280]">
                    {waHistory.length} {getText('messages opened', 'संदेश खोले गए', 'संदेश उघडले')}
                  </p>
                </div>
              </div>
              <motion.div animate={{ rotate: showWaHistory ? 180 : 0 }}>
                <Filter className="w-4 h-4 text-[#6B7280]" />
              </motion.div>
            </button>

            <AnimatePresence>
              {showWaHistory && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.18 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4 space-y-2 border-t border-gray-100 pt-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{getText('Recent Activity', 'हाल की गतिविधि', 'अलीकडील हालचाली')}</span>
                      <button
                        onClick={() => {
                          clearWhatsAppHistory();
                          refreshWaData();
                        }}
                        className="text-[10px] font-bold text-red-500 hover:text-red-600 transition-colors flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        {getText('Clear History', 'इतिहास साफ करें', 'इतिहास साफ करा')}
                      </button>
                    </div>
                    {waHistory.slice(-5).reverse().map((record, i) => (
                      <div key={i} className="bg-[#F7F3EE] rounded-2xl p-3 flex items-start gap-3">
                        <div className="w-8 h-8 rounded-xl bg-[#25D366]/10 flex items-center justify-center flex-shrink-0">
                          <WhatsAppIcon className="w-4 h-4 text-[#25D366]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[12px] font-medium text-[#1C1C1E] truncate">
                            {record.message.split('\n').find(l => l.startsWith('🔔'))?.replace('🔔 *', '').replace('*', '') || 'Deadline Alert'}
                          </p>
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <Phone className="w-3 h-3 text-[#9CA3AF]" />
                            <span className="text-[10px] text-[#9CA3AF]">
                              {record.phone === 'self'
                                ? getText('Self', 'स्वयं', 'स्वतः')
                                : `+91 ${maskPhone(record.phone)}`
                              }
                            </span>
                            <span className="text-[10px] text-[#9CA3AF]">•</span>
                            <span className="text-[10px] text-[#9CA3AF]">
                              {new Date(record.sentAt).toLocaleString(
                                isHindi ? 'hi-IN' : isMarathi ? 'mr-IN' : 'en-IN',
                                { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }
                              )}
                            </span>
                          </div>
                        </div>
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${record.type === 'urgent'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-amber-100 text-amber-700'
                          }`}>
                          {record.type === 'urgent'
                            ? getText('URGENT', 'तत्काल', 'तातडी')
                            : getText('REMINDER', 'अनुस्मारक', 'स्मरणपत्र')
                          }
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* ── Info footer ── */}
        {notifications.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-2 bg-[#F0F7F0] rounded-3xl p-4 flex items-start gap-3 mb-4"
          >
            <div className="w-10 h-10 rounded-2xl bg-[#25D366]/10 flex items-center justify-center flex-shrink-0">
              <WhatsAppIcon className="w-5 h-5 text-[#25D366]" />
            </div>
            <div>
              <p className="text-[12px] text-[#6B7280] leading-relaxed">
                {getText(
                  'Deadline reminders are sent via WhatsApp — no API key or registration needed. Messages open directly in your WhatsApp.',
                  'समय सीमा अनुस्मारक WhatsApp से भेजे जाते हैं — कोई API कुंजी या पंजीकरण आवश्यक नहीं। संदेश सीधे आपके WhatsApp में खुलते हैं।',
                  'मुदत स्मरणपत्रे WhatsApp द्वारे पाठवली जातात — कोणतीही API कुंजी किंवा नोंदणी आवश्यक नाही. संदेश थेट तुमच्या WhatsApp मध्ये उघडतात.'
                )}
              </p>
              {!phoneValid && (
                <button
                  onClick={() => navigate('/profile')}
                  className="text-[#F5A623] text-[12px] font-semibold mt-1.5 underline"
                >
                  {getText(
                    'Add phone number to send to specific contact →',
                    'विशिष्ट संपर्क को भेजने के लिए फ़ोन नंबर जोड़ें →',
                    'विशिष्ट संपर्कास पाठवण्यासाठी फोन नंबर जोडा →'
                  )}
                </button>
              )}
            </div>
          </motion.div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}