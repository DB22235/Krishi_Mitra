import { useState, useEffect, useCallback } from 'react';
import {
  ArrowLeft, RefreshCw, Search, Filter,
  CheckCircle, Clock, AlertCircle, XCircle,
  Calendar, TrendingUp, FileText, Trash2,
  ChevronDown, ChevronUp, ExternalLink, Sparkles,
} from 'lucide-react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../../context/LanguageContext';
import { useUser } from '../../context/UserContext';
import { type TrackedApplication, getTrackedApps, saveTrackedApps } from './SchemeMatcher';
import { BottomNav } from '../components/BottomNav';

// ─── Status config ────────────────────────────────────────────────────────────
const STATUSES = ['saved', 'applied', 'under-review', 'approved', 'disbursed'] as const;

const statusConfig: Record<string, { en: string; hi: string; mr: string; color: string; bg: string; icon: typeof Clock }> = {
  saved: { en: 'Saved', hi: 'सहेजा', mr: 'जतन केले', color: 'text-gray-700', bg: 'bg-gray-100', icon: FileText },
  applied: { en: 'Applied', hi: 'आवेदन किया', mr: 'अर्ज केला', color: 'text-blue-700', bg: 'bg-blue-50', icon: Clock },
  'under-review': { en: 'Under Review', hi: 'समीक्षाधीन', mr: 'पुनरावलोकनाखाली', color: 'text-amber-700', bg: 'bg-amber-50', icon: AlertCircle },
  approved: { en: 'Approved', hi: 'स्वीकृत', mr: 'मंजूर', color: 'text-green-700', bg: 'bg-green-50', icon: CheckCircle },
  disbursed: { en: 'Disbursed', hi: 'वितरित', mr: 'वितरित', color: 'text-emerald-700', bg: 'bg-emerald-50', icon: TrendingUp },
};

// ─── Component ────────────────────────────────────────────────────────────────
const parseAmount = (amountStr: string) => {
  if (!amountStr) return 0;
  let s = amountStr.replace(/,/g, '');
  const match = s.match(/\d+(\.\d+)?/);
  if (!match) return 0;
  let num = parseFloat(match[0]);
  if (s.toLowerCase().includes('l') || s.toLowerCase().includes('lakh') || s.toLowerCase().includes('लाख')) {
    num *= 100000;
  }
  return num;
};

export function ApplicationTracking() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { userData, updateUserData } = useUser();
  const isHindi = language === 'hi';
  const isMarathi = language === 'mr';

  const getText = (en: string, hi: string, mr: string) => {
    if (isMarathi) return mr;
    if (isHindi) return hi;
    return en;
  };

  const [apps, setApps] = useState<TrackedApplication[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Load apps
  useEffect(() => {
    setApps(getTrackedApps());
  }, []);

  // ── Derived data ──────────────────────────────────────────────────────────
  const filtered = apps.filter(a => {
    if (filter !== 'all' && a.status !== filter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return a.schemeName.toLowerCase().includes(q) || a.schemeNameHi.includes(search) || a.schemeNameMr.includes(search);
    }
    return true;
  });

  const getDaysLeft = (deadline: string) => {
    if (!deadline) return null;
    const diff = Math.ceil((new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const getDeadlineColor = (days: number | null) => {
    if (days === null) return { text: 'text-gray-500', bg: 'bg-gray-50' };
    if (days <= 0) return { text: 'text-red-700', bg: 'bg-red-50' };
    if (days <= 7) return { text: 'text-red-600', bg: 'bg-red-50' };
    if (days <= 30) return { text: 'text-amber-600', bg: 'bg-amber-50' };
    return { text: 'text-green-600', bg: 'bg-green-50' };
  };

  // ── Actions ───────────────────────────────────────────────────────────────
  const updateStatus = useCallback((schemeId: string, newStatus: TrackedApplication['status']) => {
    if (newStatus === 'disbursed') {
      const targetApp = apps.find(a => a.schemeId === schemeId);
      if (targetApp && targetApp.status !== 'disbursed') {
        const amountToAdd = parseAmount(targetApp.amount);
        if (amountToAdd > 0) {
          const newTx = {
            id: `tx_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
            scheme: targetApp.schemeName,
            schemeHi: targetApp.schemeNameHi,
            schemeMr: targetApp.schemeNameMr,
            amount: amountToAdd,
            date: new Date().toISOString().split('T')[0],
            year: new Date().getFullYear(),
            category: 'Scheme Disbursement'
          };
          updateUserData({
            financialLedger: [...(userData.financialLedger || []), newTx]
          });
        }
      }
      setApps(prev => {
        const updated = prev.filter(a => a.schemeId !== schemeId);
        saveTrackedApps(updated);
        return updated;
      });
    } else {
      setApps(prev => {
        const updated = prev.map(a => {
          if (a.schemeId === schemeId) {
            return { ...a, status: newStatus };
          }
          return a;
        });
        saveTrackedApps(updated);
        return updated;
      });
    }
  }, [apps, userData, updateUserData]);

  const removeApp = useCallback((schemeId: string) => {
    setApps(prev => {
      const updated = prev.filter(a => a.schemeId !== schemeId);
      saveTrackedApps(updated);
      return updated;
    });
  }, []);

  // ── Stats ─────────────────────────────────────────────────────────────────
  const urgentCount = apps.filter(a => { const d = getDaysLeft(a.deadline); return d !== null && d > 0 && d <= 7; }).length;
  const activeCount = apps.filter(a => a.status !== 'disbursed').length;

  const filterOptions = [
    { key: 'all', en: 'All', hi: 'सभी', mr: 'सर्व', count: apps.length },
    ...STATUSES.map(s => ({
      key: s,
      en: statusConfig[s].en,
      hi: statusConfig[s].hi,
      mr: statusConfig[s].mr,
      count: apps.filter(a => a.status === s).length,
    })),
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
          <h2 className="font-semibold text-white text-[16px]">
            {getText('My Applications', 'मेरे आवेदन', 'माझे अर्ज')}
          </h2>
          <button
            onClick={() => setApps(getTrackedApps())}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <RefreshCw className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="grid grid-cols-3 gap-2 mb-4"
        >
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-3 text-center border border-white/10">
            <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center mx-auto mb-1.5">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <div className="font-bold text-[20px] text-white">{apps.length}</div>
            <div className="text-[10px] text-[#C8D8C8]">
              {getText('Total', 'कुल', 'एकूण')}
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-3 text-center border border-white/10">
            <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center mx-auto mb-1.5">
              <Clock className="w-4 h-4 text-white" />
            </div>
            <div className="font-bold text-[20px] text-white">{activeCount}</div>
            <div className="text-[10px] text-[#C8D8C8]">
              {getText('Active', 'सक्रिय', 'सक्रिय')}
            </div>
          </div>
          <div className={`backdrop-blur-sm rounded-3xl p-3 text-center border ${urgentCount > 0 ? 'bg-red-500/20 border-red-400/20' : 'bg-white/10 border-white/10'}`}>
            <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center mx-auto mb-1.5">
              <AlertCircle className={`w-4 h-4 ${urgentCount > 0 ? 'text-red-300' : 'text-white'}`} />
            </div>
            <div className={`font-bold text-[20px] ${urgentCount > 0 ? 'text-red-300' : 'text-white'}`}>
              {urgentCount}
            </div>
            <div className="text-[10px] text-[#C8D8C8]">
              {getText('Urgent', 'तत्काल', 'तातडीचे')}
            </div>
          </div>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.05 }}
          className="bg-white rounded-3xl p-3 shadow-sm flex items-center gap-3 border border-gray-100"
        >
          <Search className="w-5 h-5 text-[#6B7280] flex-shrink-0" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={getText('Search applications...', 'आवेदन खोजें...', 'अर्ज शोधा...')}
            className="flex-1 bg-transparent border-none outline-none text-[14px] placeholder:text-[#9CA3AF] text-[#111827]"
          />
          {search && (
            <button onClick={() => setSearch('')} className="text-[#9CA3AF] hover:text-[#6B7280]">
              ✕
            </button>
          )}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`w-8 h-8 rounded-full flex items-center justify-center ${showFilters ? 'bg-[#F5A623]/20' : 'bg-gray-100'}`}
          >
            <Filter className={`w-4 h-4 ${showFilters ? 'text-[#F5A623]' : 'text-[#6B7280]'}`} />
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
                    <span>{getText(f.en, f.hi, f.mr)}</span>
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
        {apps.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 text-center"
          >
            <div className="w-20 h-20 rounded-3xl bg-[#F5A623]/20 flex items-center justify-center mx-auto mb-4">
              <FileText className="w-10 h-10 text-[#F5A623]" />
            </div>
            <h3 className="font-bold text-[18px] text-[#1C1C1E] mb-2">
              {getText('No Applications Yet', 'अभी तक कोई आवेदन नहीं', 'अद्याप कोणतेही अर्ज नाहीत')}
            </h3>
            <p className="text-[14px] text-[#6B7280] mb-6">
              {getText(
                'Find and track government schemes from the Schemes tab',
                'योजना टैब से सरकारी योजनाएं खोजें और ट्रैक करें',
                'योजना टॅबमधून सरकारी योजना शोधा आणि ट्रॅक करा'
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

        {/* ── No results ── */}
        {apps.length > 0 && filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 text-center"
          >
            <div className="w-14 h-14 rounded-2xl bg-[#F7F3EE] flex items-center justify-center mx-auto mb-3">
              <Search className="w-7 h-7 text-[#9CA3AF]" />
            </div>
            <h3 className="font-bold text-[15px] text-[#1C1C1E] mb-1">
              {getText('No matching applications', 'कोई मिलान आवेदन नहीं', 'जुळणारे अर्ज नाहीत')}
            </h3>
            <p className="text-[12px] text-[#6B7280]">
              {getText(
                'Try a different filter or search term',
                'अलग फ़िल्टर या खोज शब्द आज़माएं',
                'वेगळा फिल्टर किंवा शोध शब्द वापरा'
              )}
            </p>
          </motion.div>
        )}

        {/* ── Application Cards ── */}
        <div className="space-y-3">
          {filtered.map((app, idx) => {
            const daysLeft = getDaysLeft(app.deadline);
            const deadlineColor = getDeadlineColor(daysLeft);
            const sc = statusConfig[app.status];
            const StatusIcon = sc.icon;
            const isExpanded = expandedId === app.schemeId;
            const currentStepIndex = STATUSES.indexOf(app.status as typeof STATUSES[number]);

            return (
              <motion.div
                key={app.schemeId}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: idx * 0.05 }}
                className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden"
              >
                {/* Card header */}
                <div
                  className="p-4 cursor-pointer"
                  onClick={() => setExpandedId(isExpanded ? null : app.schemeId)}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#F7F3EE] flex items-center justify-center text-xl flex-shrink-0 border-2 border-[#F5A623]/30">
                      {app.logo}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-[14px] text-[#1C1C1E] leading-snug mb-1">
                        {getText(app.schemeName, app.schemeNameHi, app.schemeNameMr)}
                      </h3>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`${sc.bg} ${sc.color} px-2 py-0.5 rounded-full text-[10px] font-semibold flex items-center gap-1`}>
                          <StatusIcon className="w-3 h-3" />
                          {getText(sc.en, sc.hi, sc.mr)}
                        </span>
                        <span className="text-[#F5A623] font-bold text-[11px]">
                          {app.amount}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                      <div className="bg-blue-50 border border-blue-100 rounded-2xl px-2.5 py-1.5 text-center">
                        <div className="font-bold text-[16px] text-blue-700 leading-none">
                          {app.approvalPercent}%
                        </div>
                        <div className="text-[8px] text-blue-600 mt-0.5">
                          {getText('approval', 'स्वीकृति', 'मंजुरी')}
                        </div>
                      </div>
                      {isExpanded
                        ? <ChevronUp className="w-4 h-4 text-gray-400" />
                        : <ChevronDown className="w-4 h-4 text-gray-400" />
                      }
                    </div>
                  </div>

                  {/* Deadline & match badges */}
                  <div className="flex items-center gap-2">
                    <div className={`flex-1 ${deadlineColor.bg} rounded-2xl px-3 py-2 flex items-center gap-2`}>
                      <Calendar className={`w-3.5 h-3.5 ${deadlineColor.text}`} />
                      <span className={`text-[11px] font-semibold ${deadlineColor.text}`}>
                        {daysLeft !== null
                          ? daysLeft <= 0
                            ? getText('Deadline Passed', 'समय सीमा बीत गई', 'मुदत संपली')
                            : `${daysLeft} ${getText('days left', 'दिन शेष', 'दिवस शिल्लक')}`
                          : getText('No deadline', 'कोई समय सीमा नहीं', 'मुदत नाही')
                        }
                      </span>
                    </div>
                    <div className="bg-[#F0F7F0] rounded-2xl px-3 py-2 flex items-center gap-2">
                      <TrendingUp className="w-3.5 h-3.5 text-[#2D6A2D]" />
                      <span className="text-[11px] font-semibold text-[#2D6A2D]">
                        {app.matchPercent}% {getText('match', 'मिलान', 'जुळणी')}
                      </span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-3">
                    <div className="flex justify-between mb-1.5">
                      {STATUSES.map((s, i) => (
                        <div
                          key={s}
                          className={`text-[8px] font-medium ${i <= currentStepIndex ? 'text-[#2D6A2D]' : 'text-gray-400'
                            } ${i === 0 ? 'text-left' : i === STATUSES.length - 1 ? 'text-right' : 'text-center'
                            }`}
                          style={{ flex: 1 }}
                        >
                          {getText(statusConfig[s].en, statusConfig[s].hi, statusConfig[s].mr)}
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-1">
                      {STATUSES.map((s, i) => (
                        <div
                          key={s}
                          className={`h-2 rounded-full flex-1 ${i <= currentStepIndex ? 'bg-[#2D6A2D]' : 'bg-gray-200'
                            }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Expanded details */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.18 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 border-t border-gray-100 pt-3 space-y-4">

                        {/* Documents needed */}
                        {app.documentsNeeded && app.documentsNeeded.length > 0 && (
                          <div>
                            <h4 className="text-[12px] font-bold text-[#1C1C1E] mb-2 flex items-center gap-1.5">
                              <FileText className="w-3.5 h-3.5 text-[#F5A623]" />
                              {getText('Documents Required', 'आवश्यक दस्तावेज', 'आवश्यक कागदपत्रे')}
                            </h4>
                            <div className="flex flex-wrap gap-1.5">
                              {app.documentsNeeded.map((doc, i) => (
                                <span
                                  key={i}
                                  className="bg-[#F7F3EE] text-[#4B5563] text-[11px] font-medium px-2.5 py-1.5 rounded-2xl"
                                >
                                  {doc}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Steps */}
                        {app.steps && app.steps.length > 0 && (
                          <div>
                            <h4 className="text-[12px] font-bold text-[#1C1C1E] mb-2 flex items-center gap-1.5">
                              <CheckCircle className="w-3.5 h-3.5 text-[#2D6A2D]" />
                              {getText('Application Steps', 'आवेदन चरण', 'अर्जाचे टप्पे')}
                            </h4>
                            <div className="space-y-2">
                              {app.steps.map((step, i) => (
                                <div key={i} className="flex items-start gap-2">
                                  <div className="w-6 h-6 rounded-full bg-[#F5A623] text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <span className="text-[10px] font-bold">{i + 1}</span>
                                  </div>
                                  <span className="text-[12px] text-[#4B5563] leading-relaxed">
                                    {step}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Update status */}
                        <div>
                          <h4 className="text-[12px] font-bold text-[#1C1C1E] mb-2">
                            {getText('Update Status', 'स्थिति अपडेट करें', 'स्थिती अपडेट करा')}
                          </h4>
                          <div className="flex gap-1.5 flex-wrap">
                            {STATUSES.map(s => (
                              <button
                                key={s}
                                onClick={() => updateStatus(app.schemeId, s)}
                                className={`px-3 py-1.5 rounded-full text-[11px] font-semibold border transition-all ${app.status === s
                                  ? 'bg-[#2D6A2D] text-white border-[#2D6A2D]'
                                  : 'bg-white text-[#6B7280] border-gray-200 hover:border-[#F5A623]'
                                  }`}
                              >
                                {getText(statusConfig[s].en, statusConfig[s].hi, statusConfig[s].mr)}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                          <a
                            href={app.applyUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 py-3 bg-[#F5A623] text-white rounded-2xl font-bold text-[13px] flex items-center justify-center gap-2 shadow-lg shadow-[#F5A623]/30"
                          >
                            {getText('Go to Portal', 'पोर्टल पर जाएं', 'पोर्टलवर जा')}
                            <ExternalLink className="w-4 h-4" />
                          </a>
                          <button
                            onClick={() => removeApp(app.schemeId)}
                            className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-red-500 hover:bg-red-100 transition-colors border border-red-100"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* ── Find more schemes CTA ── */}
        {apps.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-2 mb-4"
          >
            <button
              onClick={() => navigate('/schemes')}
              className="w-full bg-white border-2 border-dashed border-[#F5A623]/40 rounded-3xl py-4 flex items-center justify-center gap-2 text-[#F5A623] font-semibold text-[14px] hover:bg-[#F5A623]/5 transition-colors"
            >
              <Sparkles className="w-5 h-5" />
              {getText('Find More Schemes', 'और योजनाएं खोजें', 'अधिक योजना शोधा')}
            </button>
          </motion.div>
        )}

        {/* ── Info footer ── */}
        {apps.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="bg-[#F0F7F0] rounded-3xl p-4 flex items-start gap-3 mb-4"
          >
            <div className="w-10 h-10 rounded-2xl bg-[#2D6A2D]/10 flex items-center justify-center flex-shrink-0">
              <span className="text-[16px]">ℹ️</span>
            </div>
            <p className="text-[12px] text-[#6B7280] leading-relaxed">
              {getText(
                'Update your application status as it progresses. Tap on any application to see details and manage it.',
                'जैसे-जैसे आवेदन आगे बढ़े, स्थिति अपडेट करें। विवरण देखने और प्रबंधित करने के लिए किसी भी आवेदन पर टैप करें।',
                'अर्ज पुढे जात असताना स्थिती अपडेट करा. तपशील पाहण्यासाठी आणि व्यवस्थापित करण्यासाठी कोणत्याही अर्जावर टॅप करा.'
              )}
            </p>
          </motion.div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}