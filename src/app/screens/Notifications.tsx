import { useState, useEffect, useMemo } from 'react';
import {
  ArrowLeft, Bell, CheckCheck, Trash2,
  AlertCircle, CheckCircle, Clock, Calendar,
  Sparkles, ExternalLink, Filter,
} from 'lucide-react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../../context/LanguageContext';
import { type TrackedApplication, getTrackedApps } from './SchemeMatcher';
import { BottomNav } from '../components/BottomNav';

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
  const isHindi = language === 'hi';
  const isMarathi = language === 'mr';

  const getText = (en: string, hi: string, mr: string) => {
    if (isMarathi) return mr;
    if (isHindi) return hi;
    return en;
  };

  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  // ── Generate notifications from tracked apps ──────────────────────────────
  useEffect(() => {
    const apps = getTrackedApps();
    const notifs: AppNotification[] = [];
    const today = new Date();

    apps.forEach((app: TrackedApplication) => {
      const deadline = app.deadline ? new Date(app.deadline) : null;
      const daysLeft = deadline ? Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)) : null;

      // Urgent deadline (≤7 days)
      if (daysLeft !== null && daysLeft > 0 && daysLeft <= 7) {
        notifs.push({
          id: `deadline-urgent-${app.schemeId}`,
          type: 'deadline-urgent',
          icon: '🔴',
          color: 'text-red-700',
          bg: 'bg-red-50',
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

      // Reminder (8-30 days)
      if (daysLeft !== null && daysLeft > 7 && daysLeft <= 30) {
        notifs.push({
          id: `deadline-reminder-${app.schemeId}`,
          type: 'deadline-reminder',
          icon: '🟡',
          color: 'text-amber-700',
          bg: 'bg-amber-50',
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

      // Expired deadline
      if (daysLeft !== null && daysLeft <= 0 && app.status === 'saved') {
        notifs.push({
          id: `expired-${app.schemeId}`,
          type: 'deadline-urgent',
          icon: '⚫',
          color: 'text-gray-700',
          bg: 'bg-gray-100',
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

      // Status notification
      if (app.status !== 'saved') {
        const statusLabels: Record<string, { en: string; hi: string; mr: string }> = {
          applied: { en: 'Applied', hi: 'आवेदन किया', mr: 'अर्ज केला' },
          'under-review': { en: 'Under Review', hi: 'समीक्षाधीन', mr: 'पुनरावलोकनाखाली' },
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

      // Saved notification
      if (app.status === 'saved') {
        notifs.push({
          id: `saved-${app.schemeId}`,
          type: 'saved',
          icon: '📌',
          color: 'text-purple-700',
          bg: 'bg-purple-50',
          title: `Scheme Saved`,
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

    // Tip notification (always show one)
    if (apps.length > 0) {
      notifs.push({
        id: 'tip-1',
        type: 'tip',
        icon: '💡',
        color: 'text-[#2D6A2D]',
        bg: 'bg-[#F0F7F0]',
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

    // Sort: urgent first, then by type priority
    const priority: Record<string, number> = { 'deadline-urgent': 0, 'deadline-reminder': 1, status: 2, saved: 3, tip: 4 };
    notifs.sort((a, b) => (priority[a.type] ?? 5) - (priority[b.type] ?? 5));

    // Load read state from localStorage
    const readIds: string[] = JSON.parse(localStorage.getItem('notification-read') || '[]');
    notifs.forEach(n => { if (readIds.includes(n.id)) n.read = true; });

    setNotifications(notifs);
  }, []);

  // ── Actions ───────────────────────────────────────────────────────────────
  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    const readIds: string[] = JSON.parse(localStorage.getItem('notification-read') || '[]');
    if (!readIds.includes(id)) { readIds.push(id); localStorage.setItem('notification-read', JSON.stringify(readIds)); }
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    localStorage.setItem('notification-read', JSON.stringify(notifications.map(n => n.id)));
  };

  const deleteNotif = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // ── Filter ────────────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    if (filter === 'all') return notifications;
    if (filter === 'unread') return notifications.filter(n => !n.read);
    return notifications.filter(n => n.type === filter);
  }, [notifications, filter]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const filterOptions = [
    { key: 'all', label: getText('All', 'सभी', 'सर्व'), count: notifications.length },
    { key: 'unread', label: getText('Unread', 'अपठित', 'न वाचलेले'), count: unreadCount },
    { key: 'deadline-urgent', label: getText('Urgent', 'तत्काल', 'तातडीचे'), count: notifications.filter(n => n.type === 'deadline-urgent').length },
    { key: 'deadline-reminder', label: getText('Reminders', 'अनुस्मारक', 'स्मरणपत्रे'), count: notifications.filter(n => n.type === 'deadline-reminder').length },
    { key: 'status', label: getText('Status', 'स्थिति', 'स्थिती'), count: notifications.filter(n => n.type === 'status').length },
  ];

  return (
    <div className="min-h-screen bg-[#F7F3EE] pb-24">

      {/* ── Header ── */}
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
                      }`}>
                      {f.count}
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Empty state ── */}
        {notifications.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 text-center mt-4"
          >
            <div className="w-20 h-20 rounded-3xl bg-[#2D6A2D]/10 flex items-center justify-center mx-auto mb-4">
              <Bell className="w-10 h-10 text-[#2D6A2D]" />
            </div>
            <h3 className="font-bold text-[18px] text-[#1C1C1E] mb-2">
              {getText('No Notifications', 'कोई सूचना नहीं', 'सूचना नाहीत')}
            </h3>
            <p className="text-[14px] text-[#6B7280] mb-6">
              {getText(
                'Track schemes to get deadline alerts and updates',
                'समय सीमा अलर्ट पाने के लिए योजनाएं ट्रैक करें',
                'मुदत सूचना मिळवण्यासाठी योजना ट्रॅक करा'
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
        <div className="space-y-3">
          {filtered.map((notif, idx) => (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: idx * 0.04 }}
              onClick={() => {
                markAsRead(notif.id);
                if (notif.schemeId) navigate('/applications');
              }}
              className={`rounded-3xl p-4 border transition-all cursor-pointer shadow-sm ${notif.read
                ? 'bg-white border-gray-100'
                : `${notif.bg} border-gray-100`
                }`}
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
                      {!notif.read && (
                        <div className="w-2 h-2 rounded-full bg-[#F5A623]" />
                      )}
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          deleteNotif(notif.id);
                        }}
                        className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors"
                      >
                        <Trash2 className="w-3 h-3 text-gray-400" />
                      </button>
                    </div>
                  </div>
                  <p className={`text-[12px] mt-1 leading-relaxed ${notif.read ? 'text-[#9CA3AF]' : 'text-[#6B7280]'
                    }`}>
                    {getText(notif.message, notif.messageHi, notif.messageMr)}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <Clock className="w-3 h-3 text-[#9CA3AF]" />
                    <span className="text-[10px] text-[#9CA3AF]">{notif.time}</span>
                    {notif.type === 'deadline-urgent' && (
                      <span className="bg-red-100 text-red-700 text-[9px] font-bold px-2 py-0.5 rounded-full">
                        {getText('URGENT', 'तत्काल', 'तातडीचे')}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── Filtered empty state ── */}
        {notifications.length > 0 && filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 text-center"
          >
            <div className="w-14 h-14 rounded-2xl bg-[#F7F3EE] flex items-center justify-center mx-auto mb-3">
              <Bell className="w-7 h-7 text-[#9CA3AF]" />
            </div>
            <h3 className="font-bold text-[15px] text-[#1C1C1E] mb-1">
              {getText('No matching notifications', 'कोई मेल खाती सूचना नहीं', 'जुळणारी सूचना नाही')}
            </h3>
            <p className="text-[12px] text-[#6B7280]">
              {getText(
                'Try a different filter to see more',
                'अधिक देखने के लिए अलग फ़िल्टर आज़माएं',
                'अधिक पाहण्यासाठी वेगळा फिल्टर वापरा'
              )}
            </p>
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
            <div className="w-10 h-10 rounded-2xl bg-[#2D6A2D]/10 flex items-center justify-center flex-shrink-0">
              <span className="text-[16px]">ℹ️</span>
            </div>
            <p className="text-[12px] text-[#6B7280] leading-relaxed">
              {getText(
                'Notifications are auto-generated from your tracked applications. Track more schemes to stay updated!',
                'सूचनाएं आपके ट्रैक किए गए आवेदनों से स्वतः उत्पन्न होती हैं। अपडेट रहने के लिए और योजनाएं ट्रैक करें!',
                'सूचना तुमच्या ट्रॅक केलेल्या अर्जांमधून स्वयंचलितपणे तयार होतात. अपडेट राहण्यासाठी अधिक योजना ट्रॅक करा!'
              )}
            </p>
          </motion.div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}