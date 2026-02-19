import { useState, useMemo, useCallback } from 'react';
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Phone,
  ChevronDown,
  ChevronUp,
  Download,
  Upload,
  Search,
  ArrowLeft,
  RefreshCw,
  Copy,
  Share2,
  MessageSquare,
  Mic,
  Sparkles,
  AlertTriangle,
  Construction,
  Rocket,
  Bell,
  X,
  Home,
} from 'lucide-react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { BottomNav } from '../components/BottomNav';
import { useLanguage } from '../../context/LanguageContext';


// ─── Filter options ─────────────────────────────────────────────
const filterOptions = [
  { en: 'All', hi: 'सभी' },
  { en: 'Pending', hi: 'लंबित' },
  { en: 'Action Required', hi: 'कार्रवाई आवश्यक' },
  { en: 'Approved', hi: 'स्वीकृत' },
  { en: 'Rejected', hi: 'अस्वीकृत' },
  { en: 'Disbursed', hi: 'वितरित' },
];


// ─── Application interface ──────────────────────────────────────
interface Application {
  id: string;
  scheme: string;
  schemeHi: string;
  refNumber: string;
  status: 'pending' | 'action-required' | 'approved' | 'rejected' | 'under-review' | 'disbursed';
  submittedDate: string;
  submittedDateHi: string;
  expectedDate: string;
  expectedDateHi: string;
  currentStep: number;
  totalSteps: number;
  message?: string;
  messageHi?: string;
  amount?: string;
  accountEnding?: string;
  transferDate?: string;
  transferDateHi?: string;
  isUrgent?: boolean;
  logo: string;
}


const allApplications: Application[] = [
  {
    id: '1',
    scheme: 'PM-Kisan Samman Nidhi',
    schemeHi: 'प्रधानमंत्री किसान सम्मान निधि',
    refNumber: 'REF#84729',
    status: 'under-review',
    submittedDate: 'Jan 15, 2026',
    submittedDateHi: '15 जनवरी, 2026',
    expectedDate: 'Feb 15, 2026',
    expectedDateHi: '15 फरवरी, 2026',
    currentStep: 3,
    totalSteps: 5,
    logo: '🏛️',
  },
  {
    id: '2',
    scheme: 'PM Fasal Bima Yojana',
    schemeHi: 'प्रधानमंत्री फसल बीमा योजना',
    refNumber: 'REF#84512',
    status: 'action-required',
    submittedDate: 'Jan 10, 2026',
    submittedDateHi: '10 जनवरी, 2026',
    expectedDate: 'Today',
    expectedDateHi: 'आज',
    currentStep: 2,
    totalSteps: 5,
    message: 'Land Records document is missing',
    messageHi: 'भूमि अभिलेख दस्तावेज़ गायब है',
    isUrgent: true,
    logo: '🌾',
  },
  {
    id: '3',
    scheme: 'Soil Health Card Scheme',
    schemeHi: 'मृदा स्वास्थ्य कार्ड योजना',
    refNumber: 'REF#83991',
    status: 'approved',
    submittedDate: 'Jan 5, 2026',
    submittedDateHi: '5 जनवरी, 2026',
    expectedDate: 'Jan 20, 2026',
    expectedDateHi: '20 जनवरी, 2026',
    currentStep: 5,
    totalSteps: 5,
    amount: '₹2,000',
    accountEnding: '234',
    transferDate: 'Jan 20, 2026',
    transferDateHi: '20 जनवरी, 2026',
    logo: '🧪',
  },
  {
    id: '4',
    scheme: 'Kisan Credit Card',
    schemeHi: 'किसान क्रेडिट कार्ड',
    refNumber: 'REF#83245',
    status: 'rejected',
    submittedDate: 'Dec 28, 2025',
    submittedDateHi: '28 दिसंबर, 2025',
    expectedDate: 'Jan 12, 2026',
    expectedDateHi: '12 जनवरी, 2026',
    currentStep: 4,
    totalSteps: 5,
    message: 'Income certificate mismatch',
    messageHi: 'आय प्रमाणपत्र में विसंगति',
    logo: '💳',
  },
  {
    id: '5',
    scheme: 'PM-KUSUM Solar Pump',
    schemeHi: 'प्रधानमंत्री कुसुम योजना',
    refNumber: 'REF#85100',
    status: 'disbursed',
    submittedDate: 'Dec 10, 2025',
    submittedDateHi: '10 दिसंबर, 2025',
    expectedDate: 'Jan 5, 2026',
    expectedDateHi: '5 जनवरी, 2026',
    currentStep: 5,
    totalSteps: 5,
    amount: '₹15,000',
    accountEnding: '234',
    transferDate: 'Jan 5, 2026',
    transferDateHi: '5 जनवरी, 2026',
    logo: '☀️',
  },
];


// ─── Feature Coming Soon Modal Data ─────────────────────────────
interface ComingSoonFeature {
  title: string;
  titleHi: string;
  description: string;
  descriptionHi: string;
  icon: string;
  expectedDate?: string;
  expectedDateHi?: string;
}


const comingSoonFeatures: Record<string, ComingSoonFeature> = {
  'application-details': {
    title: 'Application Details',
    titleHi: 'आवेदन विवरण',
    description: 'View complete application details, documents, and full timeline history.',
    descriptionHi: 'पूर्ण आवेदन विवरण, दस्तावेज़ और पूरी टाइमलाइन इतिहास देखें।',
    icon: '📋',
    expectedDate: 'Coming in v2.0',
    expectedDateHi: 'v2.0 में आ रहा है',
  },
  'grievance': {
    title: 'Grievance Portal',
    titleHi: 'शिकायत पोर्टल',
    description: 'File and track grievances related to your applications directly with the concerned department.',
    descriptionHi: 'संबंधित विभाग के साथ सीधे अपने आवेदनों से संबंधित शिकायतें दर्ज करें और ट्रैक करें।',
    icon: '📝',
    expectedDate: 'Coming in v2.0',
    expectedDateHi: 'v2.0 में आ रहा है',
  },
  'upload-documents': {
    title: 'Document Upload',
    titleHi: 'दस्तावेज़ अपलोड',
    description: 'Upload missing documents directly from this screen with smart OCR verification.',
    descriptionHi: 'स्मार्ट OCR सत्यापन के साथ इस स्क्रीन से सीधे गायब दस्तावेज़ अपलोड करें।',
    icon: '📤',
    expectedDate: 'Coming in v1.5',
    expectedDateHi: 'v1.5 में आ रहा है',
  },
  'receipt': {
    title: 'Download Receipt',
    titleHi: 'रसीद डाउनलोड',
    description: 'Download official payment receipts and application acknowledgments as PDF.',
    descriptionHi: 'आधिकारिक भुगतान रसीदें और आवेदन पावती PDF के रूप में डाउनलोड करें।',
    icon: '🧾',
    expectedDate: 'Coming in v1.5',
    expectedDateHi: 'v1.5 में आ रहा है',
  },
  'schemes': {
    title: 'Explore Schemes',
    titleHi: 'योजनाएं खोजें',
    description: 'Discover all government schemes you are eligible for based on your profile.',
    descriptionHi: 'अपनी प्रोफ़ाइल के आधार पर उन सभी सरकारी योजनाओं की खोज करें जिनके लिए आप पात्र हैं।',
    icon: '🔍',
    expectedDate: 'Available Now',
    expectedDateHi: 'अभी उपलब्ध',
  },
};


// ─── Component ──────────────────────────────────────────────────
export function ApplicationTracking() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const isHindi = language === 'hi';


  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
  const [copiedRef, setCopiedRef] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
 
  // Coming Soon Modal State
  const [showComingSoon, setShowComingSoon] = useState(false);
  const [comingSoonFeature, setComingSoonFeature] = useState<ComingSoonFeature | null>(null);
  const [notifyEmail, setNotifyEmail] = useState('');
  const [notifySubmitted, setNotifySubmitted] = useState(false);


  // ─── Stats ────────────────────────────────────────────────
  const stats = useMemo(() => {
    const pending = allApplications.filter(
      (a) => a.status === 'under-review' || a.status === 'pending' || a.status === 'action-required'
    ).length;
    const approved = allApplications.filter(
      (a) => a.status === 'approved' || a.status === 'disbursed'
    ).length;
    const rejected = allApplications.filter((a) => a.status === 'rejected').length;


    return [
      { label: 'Total', labelHi: 'कुल', count: allApplications.length, icon: FileText, color: '#2D6A2D', filterKey: 'All' },
      { label: 'Pending', labelHi: 'लंबित', count: pending, icon: Clock, color: '#FB923C', filterKey: 'Pending' },
      { label: 'Approved', labelHi: 'स्वीकृत', count: approved, icon: CheckCircle, color: '#97BC62', filterKey: 'Approved' },
      { label: 'Rejected', labelHi: 'अस्वीकृत', count: rejected, icon: XCircle, color: '#F87171', filterKey: 'Rejected' },
    ];
  }, []);


  // ─── Filter + Search ──────────────────────────────────────
  const filteredApplications = useMemo(() => {
    return allApplications.filter((app) => {
      if (activeFilter !== 'All') {
        switch (activeFilter) {
          case 'Pending':
            if (app.status !== 'under-review' && app.status !== 'pending') return false;
            break;
          case 'Action Required':
            if (app.status !== 'action-required') return false;
            break;
          case 'Approved':
            if (app.status !== 'approved') return false;
            break;
          case 'Rejected':
            if (app.status !== 'rejected') return false;
            break;
          case 'Disbursed':
            if (app.status !== 'disbursed') return false;
            break;
        }
      }


      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        app.scheme.toLowerCase().includes(q) ||
        app.schemeHi.includes(searchQuery) ||
        app.refNumber.toLowerCase().includes(q)
      );
    });
  }, [activeFilter, searchQuery]);


  // ─── Filter counts ────────────────────────────────────────
  const filterCounts = useMemo(() => {
    const counts: Record<string, number> = { All: allApplications.length };
    filterOptions.forEach((f) => {
      if (f.en === 'All') return;
      counts[f.en] = allApplications.filter((app) => {
        switch (f.en) {
          case 'Pending': return app.status === 'under-review' || app.status === 'pending';
          case 'Action Required': return app.status === 'action-required';
          case 'Approved': return app.status === 'approved';
          case 'Rejected': return app.status === 'rejected';
          case 'Disbursed': return app.status === 'disbursed';
          default: return false;
        }
      }).length;
    });
    return counts;
  }, []);


  // ─── Handlers ─────────────────────────────────────────────
  const toggleExpand = useCallback((id: string) => {
    setExpandedCards((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);


  const handleCopyRef = useCallback((ref: string) => {
    navigator.clipboard?.writeText(ref).catch(() => {});
    setCopiedRef(ref);
    setTimeout(() => setCopiedRef(null), 2000);
  }, []);


  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1500);
  }, []);


  const handleShare = useCallback((app: Application) => {
    const text = isHindi
      ? `${app.schemeHi} आवेदन (${app.refNumber}) - स्थिति: ${getStatusLabel(app.status)}`
      : `${app.scheme} Application (${app.refNumber}) - Status: ${getStatusLabel(app.status)}`;
    if (navigator.share) {
      navigator.share({ title: app.scheme, text }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(text).catch(() => {});
    }
  }, [isHindi]);


  const handleCall = useCallback(() => {
    window.location.href = 'tel:1800-180-1551';
  }, []);


  // ─── Coming Soon Handler ──────────────────────────────────
  const handleFeatureClick = useCallback((featureKey: string, fallbackRoute?: string) => {
    const feature = comingSoonFeatures[featureKey];
   
    // If feature is available now, navigate
    if (feature?.expectedDate === 'Available Now' && fallbackRoute) {
      navigate(fallbackRoute);
      return;
    }
   
    // Otherwise show coming soon modal
    if (feature) {
      setComingSoonFeature(feature);
      setShowComingSoon(true);
      setNotifySubmitted(false);
      setNotifyEmail('');
    } else {
      // Generic coming soon for unknown features
      setComingSoonFeature({
        title: 'Feature Coming Soon',
        titleHi: 'फीचर जल्द आ रहा है',
        description: 'This feature is currently under development. We are working hard to bring it to you soon!',
        descriptionHi: 'यह फीचर वर्तमान में विकास के अधीन है। हम इसे जल्द ही आपके लिए लाने के लिए कड़ी मेहनत कर रहे हैं!',
        icon: '🚀',
        expectedDate: 'Coming Soon',
        expectedDateHi: 'जल्द आ रहा है',
      });
      setShowComingSoon(true);
      setNotifySubmitted(false);
      setNotifyEmail('');
    }
  }, [navigate]);


  const handleNotifySubmit = useCallback(() => {
    if (notifyEmail.trim()) {
      setNotifySubmitted(true);
      // In real app, this would send to backend
      setTimeout(() => {
        setShowComingSoon(false);
      }, 2000);
    }
  }, [notifyEmail]);


  // ─── Helpers ──────────────────────────────────────────────
  function getStatusLabel(status: string) {
    const map: Record<string, { en: string; hi: string }> = {
      'under-review': { en: 'Under Review', hi: 'समीक्षाधीन' },
      'action-required': { en: 'Action Required', hi: 'कार्रवाई आवश्यक' },
      approved: { en: 'Approved', hi: 'स्वीकृत' },
      rejected: { en: 'Rejected', hi: 'अस्वीकृत' },
      disbursed: { en: 'Disbursed', hi: 'वितरित' },
      pending: { en: 'Pending', hi: 'लंबित' },
    };
    const entry = map[status];
    return entry ? (isHindi ? entry.hi : entry.en) : status;
  }


  function getStatusStyle(status: string) {
    switch (status) {
      case 'under-review':
        return { bg: 'bg-[#60A5FA]/10', text: 'text-[#2563EB]', border: 'border-[#60A5FA]', dot: 'bg-[#60A5FA]', pill: 'bg-[#60A5FA]/15 text-[#2563EB]' };
      case 'action-required':
        return { bg: 'bg-[#FB923C]/10', text: 'text-[#EA580C]', border: 'border-[#FB923C]', dot: 'bg-[#FB923C]', pill: 'bg-[#FB923C]/15 text-[#EA580C]' };
      case 'approved':
        return { bg: 'bg-[#97BC62]/10', text: 'text-[#2D6A2D]', border: 'border-[#97BC62]', dot: 'bg-[#97BC62]', pill: 'bg-[#97BC62]/15 text-[#2D6A2D]' };
      case 'rejected':
        return { bg: 'bg-[#F87171]/10', text: 'text-[#DC2626]', border: 'border-[#F87171]', dot: 'bg-[#F87171]', pill: 'bg-[#F87171]/15 text-[#DC2626]' };
      case 'disbursed':
        return { bg: 'bg-[#34D399]/10', text: 'text-[#059669]', border: 'border-[#34D399]', dot: 'bg-[#34D399]', pill: 'bg-[#34D399]/15 text-[#059669]' };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-300', dot: 'bg-gray-400', pill: 'bg-gray-100 text-gray-600' };
    }
  }


  const stepLabels = isHindi
    ? ['जमा', 'प्राप्त', 'समीक्षा', 'निर्णय', 'वितरित']
    : ['Submitted', 'Received', 'Review', 'Decision', 'Disbursed'];


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
            {/* Header with gradient */}
            <div className="bg-gradient-to-br from-[#2D6A2D] via-[#3D8A3D] to-[#97BC62] p-6 text-center relative overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-0 left-0 w-20 h-20 bg-white/10 rounded-full -translate-x-10 -translate-y-10" />
              <div className="absolute bottom-0 right-0 w-16 h-16 bg-white/10 rounded-full translate-x-8 translate-y-8" />
             
              <button
                onClick={() => setShowComingSoon(false)}
                className="absolute top-4 right-4 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
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


              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Construction className="w-4 h-4 text-[#F5A623]" />
                  <span className="text-[11px] font-bold text-[#F5A623] uppercase tracking-wider">
                    {isHindi ? 'विकास में' : 'In Development'}
                  </span>
                </div>
                <h3 className="text-white font-bold text-[20px] mb-1">
                  {isHindi ? comingSoonFeature.titleHi : comingSoonFeature.title}
                </h3>
                <p className="text-white/70 text-[12px]">
                  {isHindi ? comingSoonFeature.expectedDateHi : comingSoonFeature.expectedDate}
                </p>
              </motion.div>
            </div>


            {/* Content */}
            <div className="p-6">
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-[14px] text-[#6B7280] text-center leading-relaxed mb-6"
              >
                {isHindi ? comingSoonFeature.descriptionHi : comingSoonFeature.description}
              </motion.p>


              {/* Features list */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-[#F7F3EE] rounded-2xl p-4 mb-6"
              >
                <p className="text-[12px] font-semibold text-[#1C1C1E] mb-3">
                  {isHindi ? 'इस फीचर में होगा:' : 'This feature will include:'}
                </p>
                <div className="space-y-2">
                  {[
                    isHindi ? '✨ सरल और तेज़ प्रक्रिया' : '✨ Simple and fast process',
                    isHindi ? '🔒 सुरक्षित डेटा हैंडलिंग' : '🔒 Secure data handling',
                    isHindi ? '📱 मोबाइल-फ्रेंडली डिज़ाइन' : '📱 Mobile-friendly design',
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-[12px] text-[#6B7280]">
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </motion.div>


              {/* Notify form */}
              <AnimatePresence mode="wait">
                {!notifySubmitted ? (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <p className="text-[12px] text-[#6B7280] text-center mb-3">
                      {isHindi
                        ? 'जब यह उपलब्ध हो तो सूचित करें:'
                        : 'Get notified when this is available:'}
                    </p>
                    <div className="flex gap-2">
                      <input
                        type="email"
                        value={notifyEmail}
                        onChange={(e) => setNotifyEmail(e.target.value)}
                        placeholder={isHindi ? 'आपका ईमेल' : 'Your email'}
                        className="flex-1 px-4 py-3 bg-[#F7F3EE] rounded-xl text-[13px] outline-none focus:ring-2 focus:ring-[#F5A623]/30 border-2 border-transparent focus:border-[#F5A623]"
                      />
                      <button
                        onClick={handleNotifySubmit}
                        disabled={!notifyEmail.trim()}
                        className={`px-4 py-3 rounded-xl font-semibold text-[13px] flex items-center gap-2 transition-all ${
                          notifyEmail.trim()
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
                      {isHindi ? 'धन्यवाद!' : 'Thank you!'}
                    </p>
                    <p className="text-[12px] text-[#6B7280]">
                      {isHindi
                        ? 'हम आपको सूचित करेंगे जब यह उपलब्ध होगा।'
                        : "We'll notify you when it's available."}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>


              {/* Action buttons */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowComingSoon(false)}
                  className="flex-1 py-3 border border-gray-200 text-[#1C1C1E] rounded-xl font-semibold text-[13px] hover:bg-gray-50 active:scale-[0.97] transition-all"
                >
                  {isHindi ? 'बंद करें' : 'Close'}
                </button>
                <button
                  onClick={() => {
                    setShowComingSoon(false);
                    navigate('/dashboard');
                  }}
                  className="flex-1 py-3 bg-[#2D6A2D] text-white rounded-xl font-semibold text-[13px] flex items-center justify-center gap-2 active:scale-[0.97] transition-all"
                >
                  <Home className="w-4 h-4" />
                  {isHindi ? 'होम' : 'Go Home'}
                </button>
              </div>
            </div>


            {/* Footer */}
            <div className="bg-[#F7F3EE] px-6 py-3 text-center">
              <p className="text-[10px] text-[#9CA3AF]">
                {isHindi
                  ? '🌱 Kisan Sathi - किसानों के लिए, किसानों द्वारा'
                  : '🌱 Kisan Sathi - For Farmers, By Farmers'}
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );


  return (
    <div className="min-h-screen bg-[#F7F3EE] pb-24">
      {/* ─── Top Bar ─────────────────────────────────────────── */}
      <div className="bg-gradient-to-b from-[#1A3C1A] to-[#2D6A2D] pt-10 pb-4 px-4 sticky top-0 z-20">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <h1 className="font-bold text-white text-[16px]">
            {isHindi ? 'मेरे आवेदन' : 'My Applications'}
          </h1>
          <button
            onClick={handleRefresh}
            className={`w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors ${
              isRefreshing ? 'animate-spin' : ''
            }`}
          >
            <RefreshCw className="w-5 h-5 text-white" />
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
              placeholder={
                isHindi
                  ? 'योजना का नाम या संदर्भ संख्या खोजें...'
                  : 'Search scheme name or reference...'
              }
              className="flex-1 bg-transparent border-none outline-none text-[14px] placeholder:text-[#9CA3AF] text-[#111827]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-[#9CA3AF] hover:text-[#6B7280] text-[16px]"
              >
                ✕
              </button>
            )}
            <button className="w-8 h-8 rounded-full bg-[#F5A623]/10 flex items-center justify-center">
              <Mic className="w-4 h-4 text-[#F5A623]" />
            </button>
          </div>
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
              {isHindi ? 'रिफ्रेश हो रहा है...' : 'Refreshing...'}
            </p>
          </motion.div>
        )}
      </AnimatePresence>


      <div className="px-4 pt-3">
        {/* ─── Filter Chips ──────────────────────────────────── */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-2 hide-scrollbar">
          {filterOptions.map((filter) => (
            <button
              key={filter.en}
              onClick={() => setActiveFilter(filter.en)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-[12px] font-semibold whitespace-nowrap transition-all border ${
                activeFilter === filter.en
                  ? 'bg-[#F5A623] text-white border-[#F5A623] shadow-sm shadow-[#F5A623]/30'
                  : 'bg-white text-[#1C1C1E] border-gray-200'
              }`}
            >
              <span>{isHindi ? filter.hi : filter.en}</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  activeFilter === filter.en
                    ? 'bg-white/25 text-white'
                    : 'bg-gray-100 text-[#6B7280]'
                }`}
              >
                {filterCounts[filter.en] || 0}
              </span>
            </button>
          ))}
        </div>


        {/* ─── Summary Stats ─────────────────────────────────── */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <button
                key={stat.label}
                onClick={() => setActiveFilter(stat.filterKey)}
                className={`bg-white rounded-2xl p-3 text-center shadow-sm border transition-all active:scale-[0.97] ${
                  activeFilter === stat.filterKey
                    ? 'border-[#F5A623] ring-1 ring-[#F5A623]/30'
                    : 'border-gray-100'
                }`}
              >
                <div
                  className="w-9 h-9 rounded-full mx-auto mb-2 flex items-center justify-center"
                  style={{ backgroundColor: `${stat.color}18` }}
                >
                  <Icon className="w-4 h-4" style={{ color: stat.color }} />
                </div>
                <div className="font-bold text-[20px] text-[#1C1C1E] leading-none">
                  {stat.count}
                </div>
                <div className="text-[10px] text-[#6B7280] leading-tight mt-1">
                  {isHindi ? stat.labelHi : stat.label}
                </div>
              </button>
            );
          })}
        </div>


        {/* ─── Info Banner ───────────────────────────────────── */}
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
              {isHindi
                ? `${filteredApplications.length} आवेदन दिख रहे हैं`
                : `Showing ${filteredApplications.length} applications`}
            </p>
            <p className="text-[12px] text-[#6B7280]">
              {isHindi
                ? 'सभी आवेदनों की स्थिति यहां देखें • हेल्पलाइन: 1800-180-1551'
                : 'Track all your application statuses here • Helpline: 1800-180-1551'}
            </p>
          </div>
          <button
            onClick={handleCall}
            className="ml-2 text-[11px] font-semibold text-[#F5A623] underline flex-shrink-0"
          >
            <Phone className="w-4 h-4" />
          </button>
        </motion.div>


        {/* ─── Application Cards ─────────────────────────────── */}
        <div className="space-y-3 mb-4">
          {filteredApplications.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center"
            >
              <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <FileText className="w-8 h-8 text-gray-300" />
              </div>
              <p className="text-[14px] text-[#1C1C1E] font-semibold mb-1">
                {isHindi ? 'कोई आवेदन नहीं मिला' : 'No applications found'}
              </p>
              <p className="text-[12px] text-[#6B7280] mb-4">
                {isHindi
                  ? 'फ़िल्टर बदलें या नई योजनाएं देखें'
                  : 'Try changing filters or explore new schemes'}
              </p>
              <button
                onClick={() => handleFeatureClick('schemes', '/schemes')}
                className="bg-[#2D6A2D] text-white px-6 py-2.5 rounded-xl text-[13px] font-semibold active:scale-95 transition-all"
              >
                {isHindi ? 'योजनाएं देखें' : 'Explore Schemes'}
              </button>
            </motion.div>
          ) : (
            filteredApplications.map((app, index) => {
              const style = getStatusStyle(app.status);
              const expanded = expandedCards.has(app.id);


              return (
                <motion.div
                  key={app.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: index * 0.05 }}
                  className={`bg-white rounded-2xl shadow-sm border-l-4 ${style.border} overflow-hidden`}
                >
                  {/* Urgent badge */}
                  {app.isUrgent && (
                    <div className="bg-[#FB923C] text-white text-[11px] font-bold py-1.5 px-4 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      {isHindi ? 'तत्काल कार्रवाई आवश्यक!' : 'Urgent Action Required!'}
                    </div>
                  )}


                  <div className="p-4">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center flex-shrink-0 text-[20px]">
                          {app.logo}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-[15px] text-[#1C1C1E] leading-tight mb-1">
                            {isHindi ? app.schemeHi : app.scheme}
                          </h3>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleCopyRef(app.refNumber)}
                              className="flex items-center gap-1 text-[11px] text-[#9CA3AF] hover:text-[#6B7280] transition-colors font-mono"
                            >
                              {app.refNumber}
                              <Copy className="w-3 h-3" />
                            </button>
                            <AnimatePresence>
                              {copiedRef === app.refNumber && (
                                <motion.span
                                  initial={{ opacity: 0, x: -5 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  exit={{ opacity: 0 }}
                                  className="text-[10px] text-[#97BC62] font-medium"
                                >
                                  ✓ {isHindi ? 'कॉपी हुआ' : 'Copied!'}
                                </motion.span>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>
                      </div>
                      <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${style.pill}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                        {getStatusLabel(app.status)}
                      </div>
                    </div>


                    {/* Progress Bar */}
                    <div className="mb-3">
                      <div className="flex items-center gap-0.5 mb-1.5">
                        {[1, 2, 3, 4, 5].map((step) => (
                          <div key={step} className="flex-1 relative">
                            <div
                              className={`h-1.5 rounded-full transition-all duration-500 ${
                                step <= app.currentStep
                                  ? app.status === 'rejected' && step === app.currentStep
                                    ? 'bg-[#F87171]'
                                    : 'bg-[#F5A623]'
                                  : 'bg-gray-100'
                              }`}
                            />
                            {step === app.currentStep && step < 5 && app.status !== 'rejected' && (
                              <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-3 h-3 bg-[#F5A623] rounded-full border-2 border-white shadow-sm animate-pulse" />
                            )}
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center justify-between">
                        {stepLabels.map((label, i) => (
                          <span
                            key={i}
                            className={`text-[9px] font-medium ${
                              i + 1 <= app.currentStep ? 'text-[#2D6A2D]' : 'text-[#D1D5DB]'
                            }`}
                          >
                            {label}
                          </span>
                        ))}
                      </div>
                    </div>


                    {/* Date Row */}
                    <div className="flex items-center justify-between text-[11px] mb-3 bg-[#F7F3EE] rounded-xl px-3 py-2">
                      <span className="text-[#6B7280]">
                        {isHindi ? 'जमा:' : 'Submitted:'}{' '}
                        <span className="font-medium text-[#1C1C1E]">
                          {isHindi ? app.submittedDateHi : app.submittedDate}
                        </span>
                      </span>
                      <div className="flex items-center gap-2">
                        {app.status === 'under-review' && (
                          <span className="text-[#97BC62] font-medium flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            {isHindi ? 'सही दिशा में' : 'On Track'}
                          </span>
                        )}
                        {app.status === 'action-required' && (
                          <span className="text-[#FB923C] font-medium flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {isHindi ? 'समय सीमा: आज' : 'Deadline: Today'}
                          </span>
                        )}
                      </div>
                    </div>


                    {/* Message */}
                    {app.message && (
                      <div className={`${style.bg} rounded-xl p-3 mb-3`}>
                        <div className="flex items-start gap-2">
                          <span className="text-[14px] mt-0.5">
                            {app.status === 'action-required' ? '📎' : '❌'}
                          </span>
                          <p className={`text-[12px] font-medium ${style.text}`}>
                            {isHindi ? app.messageHi : app.message}
                          </p>
                        </div>
                      </div>
                    )}


                    {/* Amount */}
                    {app.amount && (app.status === 'approved' || app.status === 'disbursed') && (
                      <div className="bg-[#F0FDF4] rounded-xl p-3 mb-3 border border-[#97BC62]/20">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-[14px] font-bold text-[#2D6A2D]">
                              {app.amount}{' '}
                              <span className="text-[11px] font-normal text-[#6B7280]">
                                {isHindi ? 'खाते में' : 'transferred to'} XXXXXXX{app.accountEnding}
                              </span>
                            </p>
                            <p className="text-[10px] text-[#6B7280] mt-0.5">
                              {isHindi ? 'बैंक हस्तांतरण:' : 'Bank transfer:'}{' '}
                              {isHindi ? app.transferDateHi : app.transferDate}
                            </p>
                          </div>
                          <div className="w-8 h-8 bg-[#97BC62]/15 rounded-full flex items-center justify-center flex-shrink-0">
                            <CheckCircle className="w-4 h-4 text-[#2D6A2D]" />
                          </div>
                        </div>
                      </div>
                    )}


                    {/* Expanded Timeline */}
                    <AnimatePresence>
                      {expanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          className="overflow-hidden"
                        >
                          <div className="mb-3 bg-[#F7F3EE] rounded-xl p-4">
                            {stepLabels.map((label, i) => {
                              const isCompleted = i + 1 <= app.currentStep;
                              const isCurrent = i + 1 === app.currentStep;
                              return (
                                <div key={i} className="flex items-start gap-3">
                                  <div className="flex flex-col items-center">
                                    <div
                                      className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                                        isCompleted
                                          ? app.status === 'rejected' && isCurrent
                                            ? 'bg-[#F87171] text-white'
                                            : 'bg-[#2D6A2D] text-white'
                                          : 'bg-gray-200 text-[#9CA3AF]'
                                      }`}
                                    >
                                      {isCompleted ? '✓' : i + 1}
                                    </div>
                                    {i < 4 && (
                                      <div
                                        className={`w-0.5 h-6 ${
                                          i + 1 < app.currentStep ? 'bg-[#2D6A2D]' : 'bg-gray-200'
                                        }`}
                                      />
                                    )}
                                  </div>
                                  <div className="pb-3">
                                    <p
                                      className={`text-[13px] font-medium ${
                                        isCompleted ? 'text-[#1C1C1E]' : 'text-[#9CA3AF]'
                                      }`}
                                    >
                                      {label}
                                    </p>
                                    {isCurrent && app.status !== 'approved' && app.status !== 'disbursed' && (
                                      <p className="text-[10px] text-[#F5A623] font-medium mt-0.5">
                                        ← {isHindi ? 'वर्तमान चरण' : 'Current Step'}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>


                    {/* Toggle timeline */}
                    <button
                      onClick={() => toggleExpand(app.id)}
                      className="w-full flex items-center justify-center gap-1.5 text-[11px] text-[#9CA3AF] hover:text-[#6B7280] mb-3 transition-colors py-1"
                    >
                      {expanded ? (
                        <>
                          <ChevronUp className="w-3.5 h-3.5" />
                          {isHindi ? 'टाइमलाइन छुपाएं' : 'Hide Timeline'}
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-3.5 h-3.5" />
                          {isHindi ? 'टाइमलाइन दिखाएं' : 'Show Timeline'}
                        </>
                      )}
                    </button>


                    {/* ─── Action Buttons ─────────────────────── */}
                    <div className="flex gap-2">
                      {app.status === 'action-required' ? (
                        <>
                          <button
                            onClick={() => handleFeatureClick('upload-documents')}
                            className="flex-1 bg-[#F5A623] text-white py-2.5 rounded-xl text-[13px] font-semibold flex items-center justify-center gap-2 active:scale-[0.97] transition-all shadow-sm shadow-[#F5A623]/30"
                          >
                            <Upload className="w-4 h-4" />
                            {isHindi ? 'अभी अपलोड करें' : 'Upload Now'}
                          </button>
                          <button
                            onClick={() => handleFeatureClick('application-details')}
                            className="w-11 h-11 border border-gray-200 text-[#6B7280] rounded-xl flex items-center justify-center hover:bg-gray-50 active:scale-95 transition-all"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleShare(app)}
                            className="w-11 h-11 border border-gray-200 text-[#6B7280] rounded-xl flex items-center justify-center hover:bg-gray-50 active:scale-95 transition-all"
                          >
                            <Share2 className="w-4 h-4" />
                          </button>
                        </>
                      ) : app.status === 'approved' || app.status === 'disbursed' ? (
                        <>
                          <button
                            onClick={() => handleFeatureClick('receipt')}
                            className="flex-1 bg-[#97BC62]/10 border border-[#97BC62]/30 text-[#2D6A2D] py-2.5 rounded-xl text-[13px] font-semibold flex items-center justify-center gap-2 active:scale-[0.97] transition-all"
                          >
                            <Download className="w-4 h-4" />
                            {isHindi ? 'रसीद देखें' : 'View Receipt'}
                          </button>
                          <button
                            onClick={() => handleFeatureClick('schemes', '/schemes')}
                            className="flex-1 border border-gray-200 text-[#1C1C1E] py-2.5 rounded-xl text-[13px] font-semibold flex items-center justify-center gap-2 hover:bg-gray-50 active:scale-[0.97] transition-all"
                          >
                            <RefreshCw className="w-4 h-4" />
                            {isHindi ? 'फिर से आवेदन' : 'Apply Again'}
                          </button>
                        </>
                      ) : app.status === 'rejected' ? (
                        <>
                          <button
                            onClick={() => handleFeatureClick('grievance')}
                            className="flex-1 bg-[#F87171]/10 border border-[#F87171]/30 text-[#DC2626] py-2.5 rounded-xl text-[13px] font-semibold flex items-center justify-center gap-2 active:scale-[0.97] transition-all"
                          >
                            <MessageSquare className="w-4 h-4" />
                            {isHindi ? 'शिकायत दर्ज करें' : 'Raise Grievance'}
                          </button>
                          <button
                            onClick={() => handleFeatureClick('application-details')}
                            className="flex-1 border border-gray-200 text-[#1C1C1E] py-2.5 rounded-xl text-[13px] font-semibold flex items-center justify-center gap-2 hover:bg-gray-50 active:scale-[0.97] transition-all"
                          >
                            <Eye className="w-4 h-4" />
                            {isHindi ? 'कारण देखें' : 'View Reason'}
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleFeatureClick('application-details')}
                            className="flex-1 bg-[#2D6A2D] text-white py-2.5 rounded-xl text-[13px] font-semibold flex items-center justify-center gap-2 active:scale-[0.97] transition-all"
                          >
                            <Eye className="w-4 h-4" />
                            {isHindi ? 'विवरण देखें' : 'View Details'}
                          </button>
                          <button
                            onClick={handleCall}
                            className="w-11 h-11 border border-gray-200 text-[#6B7280] rounded-xl flex items-center justify-center hover:bg-gray-50 active:scale-95 transition-all"
                          >
                            <Phone className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleShare(app)}
                            className="w-11 h-11 border border-gray-200 text-[#6B7280] rounded-xl flex items-center justify-center hover:bg-gray-50 active:scale-95 transition-all"
                          >
                            <Share2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>


        {/* ─── Help Card ─────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="bg-gradient-to-r from-[#1A3C1A] to-[#2D6A2D] rounded-2xl p-4 mb-4 shadow-lg"
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-white/15 rounded-full flex items-center justify-center flex-shrink-0">
              <Phone className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold text-[14px]">
                {isHindi ? 'मदद चाहिए?' : 'Need Help?'}
              </p>
              <p className="text-white/60 text-[11px] mt-0.5">
                {isHindi
                  ? 'आवेदन सम्बंधित प्रश्नों के लिए कॉल करें'
                  : 'Call helpline for application queries'}
              </p>
            </div>
            <button
              onClick={handleCall}
              className="bg-white text-[#2D6A2D] px-4 py-2.5 rounded-xl text-[12px] font-bold flex items-center gap-1.5 active:scale-95 transition-all flex-shrink-0"
            >
              <Phone className="w-3.5 h-3.5" />
              {isHindi ? 'कॉल करें' : 'Call Now'}
            </button>
          </div>
        </motion.div>


        {/* ─── Prototype Notice ──────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-[#F5A623]/5 border border-[#F5A623]/20 rounded-2xl p-4 mb-4"
        >
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-[#F5A623]/10 rounded-full flex items-center justify-center flex-shrink-0">
              <Rocket className="w-4 h-4 text-[#F5A623]" />
            </div>
            <div>
              <p className="text-[13px] font-semibold text-[#1C1C1E] mb-1">
                {isHindi ? '🚀 प्रोटोटाइप संस्करण' : '🚀 Prototype Version'}
              </p>
              <p className="text-[11px] text-[#6B7280] leading-relaxed">
                {isHindi
                  ? 'यह Kisan Sathi का प्रारंभिक संस्करण है। कुछ फीचर्स विकास में हैं और जल्द ही उपलब्ध होंगे।'
                  : 'This is an early version of Kisan Sathi. Some features are under development and will be available soon.'}
              </p>
            </div>
          </div>
        </motion.div>
      </div>


      <BottomNav />


      {/* Coming Soon Modal */}
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





















