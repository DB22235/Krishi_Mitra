// src/screens/SchemeMatcher.tsx
import { useState, useEffect, useRef } from 'react';
import {
    ArrowLeft, Sparkles, RefreshCw, ExternalLink,
    CheckCircle, AlertCircle, XCircle,
    Wheat, Droplets, MapPin, User, Wallet, Shield,
    TrendingUp, FileText, Clock, BookmarkPlus, Calendar,
    ChevronDown, ChevronUp, Brain, BarChart3, Edit3,
} from 'lucide-react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../../context/LanguageContext';
import { useUser } from '../../context/UserContext';
import { BottomNav } from '../components/BottomNav';

// ─── Types ────────────────────────────────────────────────────────────────────
export interface MatchedScheme {
    schemeId: string;
    schemeName: string;
    schemeNameHi: string;
    schemeNameMr: string;
    matchPercent: number;
    approvalPercent: number;
    reasons: string[];
    reasonsHi: string[];
    reasonsMr: string[];
    warnings: string[];
    warningsHi: string[];
    warningsMr: string[];
    applyUrl: string;
    amount: string;
    deadline: string;
    tag: string;
    tagHi: string;
    tagMr: string;
    logo: string;
    documentsNeeded: string[];
    steps: string[];
}

export interface TrackedApplication {
    schemeId: string;
    schemeName: string;
    schemeNameHi: string;
    schemeNameMr: string;
    amount: string;
    logo: string;
    status: 'saved' | 'applied' | 'under-review' | 'approved' | 'disbursed';
    appliedDate: string;
    deadline: string;
    notes: string;
}

interface FormData {
    name: string;
    age: string;
    gender: string;
    state: string;
    district: string;
    landSize: string;
    landUnit: string;
    crops: string;
    seasons: string;
    irrigation: string;
    category: string;
    annualIncome: string;
    incomeSource: string;
    bankAccount: boolean;
    aadhaarVerified: boolean;
}

// ─── LocalStorage helpers ─────────────────────────────────────────────────────
const STORAGE_KEY = 'krishi_tracked_applications';

export function getTrackedApps(): TrackedApplication[] {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch { return []; }
}

export function saveTrackedApps(apps: TrackedApplication[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(apps));
}

// ─── Component ────────────────────────────────────────────────────────────────
export function SchemeMatcher() {
    const navigate = useNavigate();
    const { language } = useLanguage();
    const isHindi = language === 'hi';
    const isMarathi = language === 'mr';

    const getText = (en: string, hi: string, mr: string) => {
        if (isMarathi) return mr;
        if (isHindi) return hi;
        return en;
    };

    const { userData } = useUser();
    const scrollRef = useRef<HTMLDivElement>(null);


    // ── State ─────────────────────────────────────────────────────────────────
    const [form, setForm] = useState<FormData>({
        name: userData?.name || '',
        age: userData?.age?.toString() || '',
        gender: userData?.gender || '',
        state: userData?.state || '',
        district: userData?.district || '',
        landSize: userData?.landSize?.toString() || '',
        landUnit: userData?.landUnit || 'acres',
        crops: Array.isArray(userData?.crops) ? userData.crops.join(', ') : (userData?.crops || ''),
        seasons: Array.isArray(userData?.seasons) ? userData.seasons.join(', ') : (userData?.seasons || ''),
        irrigation: Array.isArray(userData?.irrigation) ? userData.irrigation.join(', ') : (userData?.irrigation || ''),
        category: userData?.category || '',
        annualIncome: userData?.annualIncome || '',
        incomeSource: userData?.incomeSource || 'Farming',
        bankAccount: userData?.bankAccount ?? false,
        aadhaarVerified: userData?.aadhaarVerified ?? false,
    });

    const [schemes, setSchemes] = useState<MatchedScheme[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(true);
    const [hasRun, setHasRun] = useState(false);
    const [trackedIds, setTrackedIds] = useState<Set<string>>(new Set());
    const [expandedCard, setExpandedCard] = useState<string | null>(null);
    const [animatingBars, setAnimatingBars] = useState(false);
    const [loadingStep, setLoadingStep] = useState(0);
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

    // ── Init tracked IDs ──────────────────────────────────────────────────────
    useEffect(() => {
        const apps = getTrackedApps();
        setTrackedIds(new Set(apps.map(a => a.schemeId)));
    }, []);

    // ── Update field helper ───────────────────────────────────────────────────
    const updateField = (field: keyof FormData, value: string | boolean) => {
        setForm(prev => ({ ...prev, [field]: value }));
        if (validationErrors[field]) {
            setValidationErrors(prev => {
                const next = { ...prev };
                delete next[field];
                return next;
            });
        }
    };

    // ── Validation ────────────────────────────────────────────────────────────
    const requiredFields: { key: keyof FormData; label: string }[] = [
        { key: 'name', label: getText('Name is required', 'नाम आवश्यक है', 'नाव आवश्यक आहे') },
        { key: 'state', label: getText('State is required', 'राज्य आवश्यक है', 'राज्य आवश्यक आहे') },
        { key: 'landSize', label: getText('Land Size is required', 'भूमि आकार आवश्यक है', 'जमीन आकार आवश्यक आहे') },
        { key: 'crops', label: getText('Crops are required', 'फसलें आवश्यक हैं', 'पिके आवश्यक आहेत') },
        { key: 'annualIncome', label: getText('Income is required', 'आय आवश्यक है', 'उत्पन्न आवश्यक आहे') },
    ];

    const isFormValid = requiredFields.every(f => {
        const val = form[f.key];
        return typeof val === 'string' ? val.trim().length > 0 : !!val;
    });

    const validateAndSubmit = () => {
        const errors: Record<string, string> = {};
        requiredFields.forEach(f => {
            const val = form[f.key];
            if (typeof val === 'string' ? !val.trim() : !val) {
                errors[f.key] = f.label;
            }
        });
        setValidationErrors(errors);
        if (Object.keys(errors).length === 0) fetchSchemes();
    };

    // ── Eligibility badge ─────────────────────────────────────────────────────
    const getEligibilityBadge = (pct: number) => {
        if (pct >= 80) return { label: getText('Eligible', 'पात्र', 'पात्र'), color: 'bg-green-100 text-green-700', icon: <CheckCircle className="w-3 h-3" /> };
        if (pct >= 50) return { label: getText('Partially Eligible', 'आंशिक पात्र', 'अंशतः पात्र'), color: 'bg-amber-100 text-amber-700', icon: <AlertCircle className="w-3 h-3" /> };
        return { label: getText('Low Match', 'कम मिलान', 'कमी जुळणी'), color: 'bg-red-100 text-red-700', icon: <XCircle className="w-3 h-3" /> };
    };

    // ── Profile pills ─────────────────────────────────────────────────────────
    const profilePills = [
        form.state && { icon: <MapPin className="w-3 h-3" />, value: form.state },
        form.landSize && { icon: <Wheat className="w-3 h-3" />, value: `${form.landSize} ${form.landUnit}` },
        form.crops && { icon: <Droplets className="w-3 h-3" />, value: form.crops.split(',')[0]?.trim() || '' },
        form.category && { icon: <Shield className="w-3 h-3" />, value: form.category },
        form.annualIncome && { icon: <Wallet className="w-3 h-3" />, value: form.annualIncome },
    ].filter(Boolean) as { icon: React.ReactNode; value: string }[];

    // ── Loading steps ─────────────────────────────────────────────────────────
    const loadingSteps = [
        getText('Reading your profile data...', 'आपकी प्रोफाइल पढ़ रहे हैं...', 'तुमची प्रोफाइल वाचत आहे...'),
        getText('Checking eligibility criteria...', 'पात्रता मानदंड जांच रहे हैं...', 'पात्रता निकष तपासत आहे...'),
        getText('Analyzing 50+ government schemes...', '50+ सरकारी योजनाओं का विश्लेषण...', '50+ सरकारी योजनांचे विश्लेषण...'),
        getText('Calculating match & approval %...', 'मिलान और स्वीकृति % गणना...', 'जुळणी आणि मंजुरी % मोजत आहे...'),
        getText('Filtering by active deadlines...', 'सक्रिय समय सीमा से फ़िल्टर...', 'सक्रिय मुदतीनुसार फिल्टर...'),
    ];

    // ── Track ─────────────────────────────────────────────────────────────────
    const trackScheme = (scheme: MatchedScheme) => {
        const apps = getTrackedApps();
        if (apps.find(a => a.schemeId === scheme.schemeId)) return;
        const newApp: TrackedApplication = {
            schemeId: scheme.schemeId,
            schemeName: scheme.schemeName,
            schemeNameHi: scheme.schemeNameHi,
            schemeNameMr: scheme.schemeNameMr,
            amount: scheme.amount,
            logo: scheme.logo,
            status: 'saved',
            appliedDate: new Date().toISOString().split('T')[0],
            deadline: scheme.deadline,
            notes: '',
        };
        apps.push(newApp);
        saveTrackedApps(apps);
        setTrackedIds(prev => new Set([...prev, scheme.schemeId]));
    };

    // ── Fetch from Groq ───────────────────────────────────────────────────────
    const fetchSchemes = async () => {
        setLoading(true);
        setError('');
        setSchemes([]);
        setAnimatingBars(false);
        setLoadingStep(0);
        setShowForm(false);

        const stepInterval = setInterval(() => {
            setLoadingStep(prev => (prev < loadingSteps.length - 1 ? prev + 1 : prev));
        }, 800);

        try {
            const buildPrompt = () => {
                const crops = form.crops || 'Not specified';
                const seasons = form.seasons || 'Not specified';
                const irrigation = form.irrigation || 'Not specified';

                return `You are an expert advisor on ALL Indian government schemes (Central, State, and District level).

Your task: analyze farmer profile and return the TOP 8 best matching schemes as a JSON array.

FARMER PROFILE:
- Name: ${form.name || 'Unknown'}
- Age: ${form.age || 'Unknown'} years
- Gender: ${form.gender || 'Unknown'}
- State: ${form.state || 'Unknown'}, District: ${form.district || 'Unknown'}
- Land Size: ${form.landSize || 0} ${form.landUnit || 'acres'}
- Crops Grown: ${crops}
- Crop Seasons: ${seasons}
- Irrigation Sources: ${irrigation}
- Social Category: ${form.category || 'General'}
- Annual Income: ${form.annualIncome || 'Not specified'}
- Income Source: ${form.incomeSource || 'Farming'}
- Bank Account: ${form.bankAccount ? 'Yes, linked' : 'Not linked'}
- Aadhaar Status: ${form.aadhaarVerified ? 'Verified' : 'Not verified'}

Return ONLY a valid JSON array of objects with this exact structure (no extra text):
[{
  "schemeId": "unique_id",
  "schemeName": "English Name",
  "schemeNameHi": "Hindi Name",
  "schemeNameMr": "Marathi Name",
  "matchPercent": 85,
  "approvalPercent": 70,
  "reasons": ["English reason 1", "English reason 2"],
  "reasonsHi": ["Hindi reason 1", "Hindi reason 2"],
  "reasonsMr": ["Marathi reason 1", "Marathi reason 2"],
  "warnings": ["English warning if any"],
  "warningsHi": ["Hindi warning"],
  "warningsMr": ["Marathi warning"],
  "applyUrl": "https://...",
  "amount": "₹6,000/year",
  "deadline": "2025-12-31",
  "tag": "Central Govt",
  "tagHi": "केंद्र सरकार",
  "tagMr": "केंद्र सरकार",
  "logo": "🌾",
  "documentsNeeded": ["Aadhaar Card", "Land Record"],
  "steps": ["Step 1", "Step 2"]
}]

IMPORTANT RULES:
1. Match real, currently active Indian government schemes
2. Sort by matchPercent descending
3. matchPercent = how well the farmer profile matches the scheme criteria (0-100)
4. approvalPercent = estimated chance of approval/disbursement (0-100)
5. Include both Central and State-specific schemes for ${form.state || 'India'}
6. deadline must be a future date
7. Each scheme must have a real apply URL
8. Return ONLY the JSON array, NO markdown, NO explanation`;
            };

            const apiKey = import.meta.env.VITE_GROQ_API_KEY;
            if (!apiKey) throw new Error('VITE_GROQ_API_KEY is not set');

            const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${apiKey}`,
                },
                body: JSON.stringify({
                    model: 'llama-3.3-70b-versatile',
                    max_tokens: 5000,
                    temperature: 0.6,
                    messages: [
                        {
                            role: 'system',
                            content: 'You are a JSON API. Return only valid JSON arrays. No markdown formatting, no explanation text, no code blocks.',
                        },
                        { role: 'user', content: buildPrompt() },
                    ],
                }),
            });

            if (!response.ok) {
                const err = await response.text();
                throw new Error(`Groq API error ${response.status}: ${err}`);
            }

            const data = await response.json();
            let content = data.choices?.[0]?.message?.content?.trim() || '[]';

            // Strip markdown code fences if present
            content = content.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();

            const parsed: MatchedScheme[] = JSON.parse(content);
            const sorted = parsed.sort((a, b) => b.matchPercent - a.matchPercent);

            setSchemes(sorted);
            setHasRun(true);
            setTimeout(() => setAnimatingBars(true), 200);
        } catch (err) {
            console.error('[SchemeMatcher]', err);
            setError(err instanceof Error ? err.message : 'Something went wrong');
        } finally {
            clearInterval(stepInterval);
            setLoading(false);
        }
    };

    // ── Helpers ────────────────────────────────────────────────────────────────
    const getMatchColor = (pct: number) => {
        if (pct >= 80) return { bar: 'bg-[#2D6A2D]', text: 'text-[#2D6A2D]', bg: 'bg-[#F0F7F0]', border: 'border-[#2D6A2D]/20' };
        if (pct >= 60) return { bar: 'bg-[#F5A623]', text: 'text-[#B8740A]', bg: 'bg-[#FFF8EE]', border: 'border-[#F5A623]/20' };
        return { bar: 'bg-[#FB923C]', text: 'text-[#C2410C]', bg: 'bg-[#FFF4EE]', border: 'border-[#FB923C]/20' };
    };

    const getMatchLabel = (pct: number) =>
        pct >= 80
            ? getText('High Match', 'उच्च मिलान', 'उच्च जुळणी')
            : pct >= 60
                ? getText('Good Match', 'अच्छा मिलान', 'चांगली जुळणी')
                : getText('Partial Match', 'आंशिक मिलान', 'आंशिक जुळणी');

    const getDaysLeft = (deadline: string) => {
        if (!deadline) return null;
        const diff = Math.ceil((new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
        return diff > 0 ? diff : null;
    };

    // ── Select options ────────────────────────────────────────────────────────
    const genderOptions = ['Male', 'Female', 'Other'];
    const stateOptions = [
        'Andhra Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana',
        'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra',
        'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan',
        'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
    ];
    const categoryOptions = ['General', 'OBC', 'SC', 'ST', 'EWS'];
    const incomeOptions = ['Below ₹1 Lakh', '₹1-2.5 Lakh', '₹2.5-5 Lakh', '₹5-10 Lakh', 'Above ₹10 Lakh'];



    // â”€â”€ Stats calculation â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    const highMatchCount = schemes.filter(s => s.matchPercent >= 80).length;
    const avgMatch = schemes.length > 0 ? Math.round(schemes.reduce((a, b) => a + b.matchPercent, 0) / schemes.length) : 0;

    // â”€â”€â”€ Render â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    return (
        <div className="min-h-screen bg-[#F7F3EE] pb-24">
            {/* â”€â”€ Header â”€â”€ */}
            <div className="bg-gradient-to-b from-[#1A3C1A] to-[#2D6A2D] pt-10 pb-20 px-4">
                <div className="flex items-center justify-between mb-5">
                    <button
                        onClick={() => navigate(-1)}
                        className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 text-white" />
                    </button>
                    <h2 className="text-white font-semibold text-[16px]">
                        {getText('AI Scheme Matcher', 'AI à¤¯à¥‹à¤œà¤¨à¤¾ à¤®à¤¿à¤²à¤¾à¤¨', 'AI à¤¯à¥‹à¤œà¤¨à¤¾ à¤œà¥à¤³à¤£à¥€')}
                    </h2>
                    {hasRun && !loading ? (
                        <button
                            onClick={() => setShowForm(true)}
                            className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                        >
                            <RefreshCw className="w-4 h-4 text-white" />
                        </button>
                    ) : (
                        <div className="w-9" />
                    )}
                </div>

                {/* Hero */}
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-4"
                >
                    <div className="w-16 h-16 rounded-full overflow-hidden flex items-center justify-center mx-auto mb-3 bg-white shadow-lg ring-2 ring-[#F5A623]">
                        <img src="/logo.png" alt="Krishi Mitra" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.parentElement!.innerHTML = '<span class="text-3xl">ðŸŒ¾</span>'; }} />
                    </div>
                    <h1 className="text-white font-bold text-[20px] mb-1">
                        {getText('Smart Scheme Finder', 'à¤¸à¥à¤®à¤¾à¤°à¥à¤Ÿ à¤¯à¥‹à¤œà¤¨à¤¾ à¤–à¥‹à¤œà¤•', 'à¤¸à¥à¤®à¤¾à¤°à¥à¤Ÿ à¤¯à¥‹à¤œà¤¨à¤¾ à¤¶à¥‹à¤§à¤•')}
                    </h1>
                    <p className="text-[#C8D8C8] text-[13px] leading-relaxed px-4">
                        {showForm
                            ? getText(
                                'Fill your details below and AI will find the best matching government schemes',
                                'à¤¨à¥€à¤šà¥‡ à¤…à¤ªà¤¨à¥‡ à¤µà¤¿à¤µà¤°à¤£ à¤­à¤°à¥‡à¤‚ à¤”à¤° AI à¤†à¤ªà¤•à¥‡ à¤²à¤¿à¤ à¤¸à¤¬à¤¸à¥‡ à¤…à¤šà¥à¤›à¥€ à¤¸à¤°à¤•à¤¾à¤°à¥€ à¤¯à¥‹à¤œà¤¨à¤¾à¤à¤‚ à¤–à¥‹à¤œà¥‡à¤—à¤¾',
                                'à¤–à¤¾à¤²à¥€ à¤¤à¥à¤®à¤šà¥‡ à¤¤à¤ªà¤¶à¥€à¤² à¤­à¤°à¤¾ à¤†à¤£à¤¿ AI à¤¤à¥à¤®à¤šà¥à¤¯à¤¾à¤¸à¤¾à¤ à¥€ à¤¸à¤°à¥à¤µà¥‹à¤¤à¥à¤¤à¤® à¤¸à¤°à¤•à¤¾à¤°à¥€ à¤¯à¥‹à¤œà¤¨à¤¾ à¤¶à¥‹à¤§à¥‡à¤²'
                            )
                            : getText(
                                'AI analyzes your profile and finds the best matching government schemes',
                                'AI à¤†à¤ªà¤•à¥€ à¤ªà¥à¤°à¥‹à¤«à¤¾à¤‡à¤² à¤•à¤¾ à¤µà¤¿à¤¶à¥à¤²à¥‡à¤·à¤£ à¤•à¤° à¤¸à¤°à¥à¤µà¥‹à¤¤à¥à¤¤à¤® à¤¸à¤°à¤•à¤¾à¤°à¥€ à¤¯à¥‹à¤œà¤¨à¤¾à¤à¤‚ à¤–à¥‹à¤œà¤¤à¤¾ à¤¹à¥ˆ',
                                'AI à¤¤à¥à¤®à¤šà¥à¤¯à¤¾ à¤ªà¥à¤°à¥‹à¤«à¤¾à¤‡à¤²à¤šà¥‡ à¤µà¤¿à¤¶à¥à¤²à¥‡à¤·à¤£ à¤•à¤°à¥‚à¤¨ à¤¸à¤°à¥à¤µà¥‹à¤¤à¥à¤¤à¤® à¤¸à¤°à¤•à¤¾à¤°à¥€ à¤¯à¥‹à¤œà¤¨à¤¾ à¤¶à¥‹à¤§à¤¤à¥‹'
                            )}
                    </p>
                </motion.div>

                {/* Profile pills (show when results are visible) */}
                {!showForm && !loading && profilePills.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="flex flex-wrap gap-2 justify-center"
                    >
                        {profilePills.map((pill, i) => (
                            <div key={i} className="flex items-center gap-1 bg-white/15 rounded-full px-3 py-1">
                                <span className="text-[#C8D8C8]">{pill.icon}</span>
                                <span className="text-white text-[11px] font-medium">{pill.value}</span>
                            </div>
                        ))}
                    </motion.div>
                )}
            </div>

            <div className="px-4 -mt-12">
                {/* â”€â”€ INPUT FORM â”€â”€ */}
                <AnimatePresence>
                    {showForm && !loading && (
                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            className="bg-white rounded-3xl p-5 shadow-lg border border-gray-100 mb-4"
                        >
                            <h3 className="font-bold text-[16px] text-[#1C1C1E] mb-4 flex items-center gap-2">
                                <div className="w-8 h-8 rounded-xl bg-[#F5A623]/20 flex items-center justify-center">
                                    <User className="w-4 h-4 text-[#F5A623]" />
                                </div>
                                {getText('Farmer Profile', 'à¤•à¤¿à¤¸à¤¾à¤¨ à¤ªà¥à¤°à¥‹à¤«à¤¾à¤‡à¤²', 'à¤¶à¥‡à¤¤à¤•à¤°à¥€ à¤ªà¥à¤°à¥‹à¤«à¤¾à¤‡à¤²')}
                            </h3>

                            <div className="space-y-4">
                                {/* Section: Personal Details */}
                                <div className="bg-[#F7F3EE] rounded-2xl p-4">
                                    <p className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wide mb-3">
                                        {getText('Personal Details', 'à¤µà¥à¤¯à¤•à¥à¤¤à¤¿à¤—à¤¤ à¤µà¤¿à¤µà¤°à¤£', 'à¤µà¥ˆà¤¯à¤•à¥à¤¤à¤¿à¤• à¤¤à¤ªà¤¶à¥€à¤²')}
                                    </p>
                                    <div className="space-y-3">
                                        {/* Row: Name + Age */}
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="text-[11px] font-medium text-[#1C1C1E] mb-1 block">
                                                    {getText('Name', 'à¤¨à¤¾à¤®', 'à¤¨à¤¾à¤µ')} <span className="text-red-400">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    value={form.name}
                                                    onChange={e => updateField('name', e.target.value)}
                                                    placeholder="e.g. Ramesh Kumar"
                                                    className={`w-full px-3 py-2.5 bg-white rounded-xl text-[13px] outline-none border ${validationErrors.name ? 'border-red-400' : 'border-gray-200'} focus:border-[#F5A623] focus:ring-2 focus:ring-[#F5A623]/20 transition-all`}
                                                />
                                                {validationErrors.name && <p className="text-[10px] text-red-500 mt-0.5">{validationErrors.name}</p>}
                                            </div>
                                            <div>
                                                <label className="text-[11px] font-medium text-[#1C1C1E] mb-1 block">
                                                    {getText('Age', 'à¤‰à¤®à¥à¤°', 'à¤µà¤¯')}
                                                </label>
                                                <input
                                                    type="number"
                                                    value={form.age}
                                                    onChange={e => updateField('age', e.target.value)}
                                                    placeholder="e.g. 35"
                                                    className="w-full px-3 py-2.5 bg-white rounded-xl text-[13px] outline-none border border-gray-200 focus:border-[#F5A623] focus:ring-2 focus:ring-[#F5A623]/20 transition-all"
                                                />
                                            </div>
                                        </div>

                                        {/* Row: Gender + Category */}
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="text-[11px] font-medium text-[#1C1C1E] mb-1 block">
                                                    {getText('Gender', 'à¤²à¤¿à¤‚à¤—', 'à¤²à¤¿à¤‚à¤—')}
                                                </label>
                                                <select
                                                    value={form.gender}
                                                    onChange={e => updateField('gender', e.target.value)}
                                                    className="w-full px-3 py-2.5 bg-white rounded-xl text-[13px] outline-none border border-gray-200 focus:border-[#F5A623] focus:ring-2 focus:ring-[#F5A623]/20 transition-all"
                                                >
                                                    <option value="">{getText('Select', 'à¤šà¥à¤¨à¥‡à¤‚', 'à¤¨à¤¿à¤µà¤¡à¤¾')}</option>
                                                    {genderOptions.map(g => (
                                                        <option key={g} value={g}>{g}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="text-[11px] font-medium text-[#1C1C1E] mb-1 block">
                                                    {getText('Category', 'à¤¶à¥à¤°à¥‡à¤£à¥€', 'à¤¶à¥à¤°à¥‡à¤£à¥€')}
                                                </label>
                                                <select
                                                    value={form.category}
                                                    onChange={e => updateField('category', e.target.value)}
                                                    className="w-full px-3 py-2.5 bg-white rounded-xl text-[13px] outline-none border border-gray-200 focus:border-[#F5A623] focus:ring-2 focus:ring-[#F5A623]/20 transition-all"
                                                >
                                                    <option value="">{getText('Select', 'à¤šà¥à¤¨à¥‡à¤‚', 'à¤¨à¤¿à¤µà¤¡à¤¾')}</option>
                                                    {categoryOptions.map(c => (
                                                        <option key={c} value={c}>{c}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Section: Location */}
                                <div className="bg-[#F7F3EE] rounded-2xl p-4">
                                    <p className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wide mb-3">
                                        {getText('Location', 'à¤¸à¥à¤¥à¤¾à¤¨', 'à¤¸à¥à¤¥à¤¾à¤¨')}
                                    </p>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="text-[11px] font-medium text-[#1C1C1E] mb-1 block">
                                                {getText('State', 'à¤°à¤¾à¤œà¥à¤¯', 'à¤°à¤¾à¤œà¥à¤¯')} <span className="text-red-400">*</span>
                                            </label>
                                            <select
                                                value={form.state}
                                                onChange={e => updateField('state', e.target.value)}
                                                className={`w-full px-3 py-2.5 bg-white rounded-xl text-[13px] outline-none border ${validationErrors.state ? 'border-red-400' : 'border-gray-200'} focus:border-[#F5A623] focus:ring-2 focus:ring-[#F5A623]/20 transition-all`}
                                            >
                                                <option value="">{getText('Select State', 'à¤°à¤¾à¤œà¥à¤¯ à¤šà¥à¤¨à¥‡à¤‚', 'à¤°à¤¾à¤œà¥à¤¯ à¤¨à¤¿à¤µà¤¡à¤¾')}</option>
                                                {stateOptions.map(s => (
                                                    <option key={s} value={s}>{s}</option>
                                                ))}
                                            </select>
                                            {validationErrors.state && <p className="text-[10px] text-red-500 mt-0.5">{validationErrors.state}</p>}
                                        </div>
                                        <div>
                                            <label className="text-[11px] font-medium text-[#1C1C1E] mb-1 block">
                                                {getText('District', 'à¤œà¤¿à¤²à¤¾', 'à¤œà¤¿à¤²à¥à¤¹à¤¾')}
                                            </label>
                                            <input
                                                type="text"
                                                value={form.district}
                                                onChange={e => updateField('district', e.target.value)}
                                                placeholder="e.g. Pune"
                                                className="w-full px-3 py-2.5 bg-white rounded-xl text-[13px] outline-none border border-gray-200 focus:border-[#F5A623] focus:ring-2 focus:ring-[#F5A623]/20 transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Section: Land & Farming */}
                                <div className="bg-[#F7F3EE] rounded-2xl p-4">
                                    <p className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wide mb-3">
                                        {getText('Land & Farming', 'à¤­à¥‚à¤®à¤¿ à¤”à¤° à¤–à¥‡à¤¤à¥€', 'à¤œà¤®à¥€à¤¨ à¤†à¤£à¤¿ à¤¶à¥‡à¤¤à¥€')}
                                    </p>
                                    <div className="space-y-3">
                                        {/* Land size + Unit */}
                                        <div className="grid grid-cols-3 gap-3">
                                            <div className="col-span-2">
                                                <label className="text-[11px] font-medium text-[#1C1C1E] mb-1 block">
                                                    {getText('Land Size', 'à¤­à¥‚à¤®à¤¿ à¤†à¤•à¤¾à¤°', 'à¤œà¤®à¥€à¤¨ à¤†à¤•à¤¾à¤°')} <span className="text-red-400">*</span>
                                                </label>
                                                <input
                                                    type="number"
                                                    value={form.landSize}
                                                    onChange={e => updateField('landSize', e.target.value)}
                                                    placeholder="e.g. 5"
                                                    className={`w-full px-3 py-2.5 bg-white rounded-xl text-[13px] outline-none border ${validationErrors.landSize ? 'border-red-400' : 'border-gray-200'} focus:border-[#F5A623] focus:ring-2 focus:ring-[#F5A623]/20 transition-all`}
                                                />
                                                {validationErrors.landSize && <p className="text-[10px] text-red-500 mt-0.5">{validationErrors.landSize}</p>}
                                            </div>
                                            <div>
                                                <label className="text-[11px] font-medium text-[#1C1C1E] mb-1 block">
                                                    {getText('Unit', 'à¤‡à¤•à¤¾à¤ˆ', 'à¤à¤•à¤•')}
                                                </label>
                                                <select
                                                    value={form.landUnit}
                                                    onChange={e => updateField('landUnit', e.target.value)}
                                                    className="w-full px-3 py-2.5 bg-white rounded-xl text-[13px] outline-none border border-gray-200 focus:border-[#F5A623] focus:ring-2 focus:ring-[#F5A623]/20 transition-all"
                                                >
                                                    <option value="acres">Acres</option>
                                                    <option value="hectares">Hectares</option>
                                                    <option value="bigha">Bigha</option>
                                                </select>
                                            </div>
                                        </div>

                                        {/* Crops */}
                                        <div>
                                            <label className="text-[11px] font-medium text-[#1C1C1E] mb-1 block">
                                                {getText('Crops Grown (comma separated)', 'à¤‰à¤—à¤¾à¤ˆ à¤—à¤ˆ à¤«à¤¸à¤²à¥‡à¤‚ (à¤…à¤²à¥à¤ªà¤µà¤¿à¤°à¤¾à¤® à¤¸à¥‡ à¤…à¤²à¤—)', 'à¤ªà¤¿à¤•à¤µà¤²à¥‡à¤²à¥€ à¤ªà¤¿à¤•à¥‡ (à¤¸à¥à¤µà¤²à¥à¤ªà¤µà¤¿à¤°à¤¾à¤®à¤¾à¤¨à¥‡ à¤µà¥‡à¤—à¤³à¥‡)')} <span className="text-red-400">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={form.crops}
                                                onChange={e => updateField('crops', e.target.value)}
                                                placeholder="e.g. Wheat, Rice, Cotton"
                                                className={`w-full px-3 py-2.5 bg-white rounded-xl text-[13px] outline-none border ${validationErrors.crops ? 'border-red-400' : 'border-gray-200'} focus:border-[#F5A623] focus:ring-2 focus:ring-[#F5A623]/20 transition-all`}
                                            />
                                            {validationErrors.crops && <p className="text-[10px] text-red-500 mt-0.5">{validationErrors.crops}</p>}
                                        </div>

                                        {/* Seasons + Irrigation */}
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="text-[11px] font-medium text-[#1C1C1E] mb-1 block">
                                                    {getText('Seasons', 'à¤®à¥Œà¤¸à¤®', 'à¤¹à¤‚à¤—à¤¾à¤®')}
                                                </label>
                                                <input
                                                    type="text"
                                                    value={form.seasons}
                                                    onChange={e => updateField('seasons', e.target.value)}
                                                    placeholder="Kharif, Rabi"
                                                    className="w-full px-3 py-2.5 bg-white rounded-xl text-[13px] outline-none border border-gray-200 focus:border-[#F5A623] focus:ring-2 focus:ring-[#F5A623]/20 transition-all"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[11px] font-medium text-[#1C1C1E] mb-1 block">
                                                    {getText('Irrigation', 'à¤¸à¤¿à¤‚à¤šà¤¾à¤ˆ', 'à¤¸à¤¿à¤‚à¤šà¤¨')}
                                                </label>
                                                <input
                                                    type="text"
                                                    value={form.irrigation}
                                                    onChange={e => updateField('irrigation', e.target.value)}
                                                    placeholder="Borewell, Canal"
                                                    className="w-full px-3 py-2.5 bg-white rounded-xl text-[13px] outline-none border border-gray-200 focus:border-[#F5A623] focus:ring-2 focus:ring-[#F5A623]/20 transition-all"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Section: Financial */}
                                <div className="bg-[#F7F3EE] rounded-2xl p-4">
                                    <p className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wide mb-3">
                                        {getText('Financial Info', 'à¤µà¤¿à¤¤à¥à¤¤à¥€à¤¯ à¤œà¤¾à¤¨à¤•à¤¾à¤°à¥€', 'à¤†à¤°à¥à¤¥à¤¿à¤• à¤®à¤¾à¤¹à¤¿à¤¤à¥€')}
                                    </p>
                                    <div className="space-y-3">
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="text-[11px] font-medium text-[#1C1C1E] mb-1 block">
                                                    {getText('Annual Income', 'à¤µà¤¾à¤°à¥à¤·à¤¿à¤• à¤†à¤¯', 'à¤µà¤¾à¤°à¥à¤·à¤¿à¤• à¤‰à¤¤à¥à¤ªà¤¨à¥à¤¨')} <span className="text-red-400">*</span>
                                                </label>
                                                <select
                                                    value={form.annualIncome}
                                                    onChange={e => updateField('annualIncome', e.target.value)}
                                                    className={`w-full px-3 py-2.5 bg-white rounded-xl text-[13px] outline-none border ${validationErrors.annualIncome ? 'border-red-400' : 'border-gray-200'} focus:border-[#F5A623] focus:ring-2 focus:ring-[#F5A623]/20 transition-all`}
                                                >
                                                    <option value="">{getText('Select', 'à¤šà¥à¤¨à¥‡à¤‚', 'à¤¨à¤¿à¤µà¤¡à¤¾')}</option>
                                                    {incomeOptions.map(i => (
                                                        <option key={i} value={i}>{i}</option>
                                                    ))}
                                                </select>
                                                {validationErrors.annualIncome && <p className="text-[10px] text-red-500 mt-0.5">{validationErrors.annualIncome}</p>}
                                            </div>
                                            <div>
                                                <label className="text-[11px] font-medium text-[#1C1C1E] mb-1 block">
                                                    {getText('Income Source', 'à¤†à¤¯ à¤¸à¥à¤°à¥‹à¤¤', 'à¤‰à¤¤à¥à¤ªà¤¨à¥à¤¨ à¤¸à¥à¤°à¥‹à¤¤')}
                                                </label>
                                                <select
                                                    value={form.incomeSource}
                                                    onChange={e => updateField('incomeSource', e.target.value)}
                                                    className="w-full px-3 py-2.5 bg-white rounded-xl text-[13px] outline-none border border-gray-200 focus:border-[#F5A623] focus:ring-2 focus:ring-[#F5A623]/20 transition-all"
                                                >
                                                    <option value="Farming">Farming</option>
                                                    <option value="Farming + Labour">Farming + Labour</option>
                                                    <option value="Mixed">Mixed</option>
                                                </select>
                                            </div>
                                        </div>

                                        {/* Toggles */}
                                        <div className="flex gap-3">
                                            <label className="flex-1 flex items-center gap-3 bg-white rounded-xl px-3 py-3 cursor-pointer border border-gray-200 hover:border-[#2D6A2D] transition-colors">
                                                <input
                                                    type="checkbox"
                                                    checked={form.bankAccount}
                                                    onChange={e => updateField('bankAccount', e.target.checked)}
                                                    className="w-4 h-4 rounded accent-[#2D6A2D]"
                                                />
                                                <span className="text-[12px] font-medium text-[#1C1C1E]">
                                                    {getText('Bank Linked', 'à¤¬à¥ˆà¤‚à¤• à¤œà¥à¤¡à¤¼à¤¾', 'à¤¬à¤à¤• à¤œà¥‹à¤¡à¤²à¥‡à¤²à¥‡')}
                                                </span>
                                            </label>
                                            <label className="flex-1 flex items-center gap-3 bg-white rounded-xl px-3 py-3 cursor-pointer border border-gray-200 hover:border-[#2D6A2D] transition-colors">
                                                <input
                                                    type="checkbox"
                                                    checked={form.aadhaarVerified}
                                                    onChange={e => updateField('aadhaarVerified', e.target.checked)}
                                                    className="w-4 h-4 rounded accent-[#2D6A2D]"
                                                />
                                                <span className="text-[12px] font-medium text-[#1C1C1E]">
                                                    {getText('Aadhaar Verified', 'à¤†à¤§à¤¾à¤° à¤¸à¤¤à¥à¤¯à¤¾à¤ªà¤¿à¤¤', 'à¤†à¤§à¤¾à¤° à¤¸à¤¤à¥à¤¯à¤¾à¤ªà¤¿à¤¤')}
                                                </span>
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <motion.button
                                    whileHover={isFormValid ? { scale: 1.01 } : {}}
                                    whileTap={isFormValid ? { scale: 0.97 } : {}}
                                    onClick={validateAndSubmit}
                                    disabled={!isFormValid}
                                    className={`w-full py-4 rounded-2xl font-bold text-[16px] shadow-lg flex items-center justify-center gap-2 mt-2 transition-all ${isFormValid ? 'bg-[#F5A623] text-white shadow-[#F5A623]/30 cursor-pointer' : 'bg-gray-300 text-gray-500 shadow-gray-200/30 cursor-not-allowed'}`}
                                >
                                    <Sparkles className="w-5 h-5" />
                                    {getText('Find My Schemes', 'à¤®à¥‡à¤°à¥€ à¤¯à¥‹à¤œà¤¨à¤¾à¤à¤‚ à¤–à¥‹à¤œà¥‡à¤‚', 'à¤®à¤¾à¤à¥à¤¯à¤¾ à¤¯à¥‹à¤œà¤¨à¤¾ à¤¶à¥‹à¤§à¤¾')}
                                </motion.button>
                                {!isFormValid && <p className="text-[10px] text-red-400 text-center mt-1.5">{getText('Please fill all required (*) fields', 'à¤•à¥ƒà¤ªà¤¯à¤¾ à¤¸à¤­à¥€ à¤†à¤µà¤¶à¥à¤¯à¤• (*) à¤«à¤¼à¥€à¤²à¥à¤¡ à¤­à¤°à¥‡à¤‚', 'à¤•à¥ƒà¤ªà¤¯à¤¾ à¤¸à¤°à¥à¤µ à¤†à¤µà¤¶à¥à¤¯à¤• (*) à¤«à¥€à¤²à¥à¤¡ à¤­à¤°à¤¾')}</p>}
                                <p className="text-[11px] text-[#9CA3AF] text-center mt-2">
                                    {getText('Powered by AI â€¢ Takes ~5 seconds', 'AI à¤¦à¥à¤µà¤¾à¤°à¤¾ à¤¸à¤‚à¤šà¤¾à¤²à¤¿à¤¤ â€¢ ~5 à¤¸à¥‡à¤•à¤‚à¤¡', 'AI à¤¦à¥à¤µà¤¾à¤°à¥‡ à¤šà¤¾à¤²à¤¿à¤¤ â€¢ ~5 à¤¸à¥‡à¤•à¤‚à¤¦')}
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* â”€â”€ Loading State â”€â”€ */}
                <AnimatePresence>
                    {loading && (
                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100 mb-4"
                        >
                            <div className="flex flex-col items-center text-center">
                                {/* Animated AI brain */}
                                <div className="relative w-24 h-24 mb-5">
                                    <motion.div
                                        className="absolute inset-0 rounded-full bg-[#F5A623]/20"
                                        animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.2, 0.5] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                    />
                                    <motion.div
                                        className="absolute inset-3 rounded-full bg-[#F5A623]/30"
                                        animate={{ scale: [1, 1.2, 1], opacity: [0.6, 0.3, 0.6] }}
                                        transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
                                    />
                                    <div className="absolute inset-0 w-24 h-24 rounded-full bg-gradient-to-br from-[#F5A623] to-[#E09000] flex items-center justify-center shadow-lg shadow-[#F5A623]/40">
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                                        >
                                            <Sparkles className="w-10 h-10 text-white" />
                                        </motion.div>
                                    </div>
                                </div>

                                <h3 className="font-bold text-[18px] text-[#1C1C1E] mb-1">
                                    {getText('AI is Analyzing...', 'AI à¤µà¤¿à¤¶à¥à¤²à¥‡à¤·à¤£ à¤•à¤° à¤°à¤¹à¤¾ à¤¹à¥ˆ...', 'AI à¤µà¤¿à¤¶à¥à¤²à¥‡à¤·à¤£ à¤•à¤°à¤¤ à¤†à¤¹à¥‡...')}
                                </h3>
                                <p className="text-[13px] text-[#6B7280] mb-6">
                                    {getText(
                                        'Matching your profile with government schemes',
                                        'à¤¸à¤°à¤•à¤¾à¤°à¥€ à¤¯à¥‹à¤œà¤¨à¤¾à¤“à¤‚ à¤¸à¥‡ à¤ªà¥à¤°à¥‹à¤«à¤¾à¤‡à¤² à¤®à¤¿à¤²à¤¾à¤¨ à¤¹à¥‹ à¤°à¤¹à¤¾ à¤¹à¥ˆ',
                                        'à¤¸à¤°à¤•à¤¾à¤°à¥€ à¤¯à¥‹à¤œà¤¨à¤¾à¤‚à¤¶à¥€ à¤ªà¥à¤°à¥‹à¤«à¤¾à¤‡à¤² à¤œà¥à¤³à¤µà¤¤ à¤†à¤¹à¥‡'
                                    )}
                                </p>

                                {/* Step indicators */}
                                <div className="w-full space-y-2">
                                    {loadingSteps.map((step, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0.3 }}
                                            animate={{ opacity: i <= loadingStep ? 1 : 0.3 }}
                                            className="flex items-center gap-3"
                                        >
                                            <motion.div
                                                initial={{ scale: 0, backgroundColor: '#E5E7EB' }}
                                                animate={{
                                                    scale: i <= loadingStep ? 1 : 0.8,
                                                    backgroundColor: i <= loadingStep ? '#2D6A2D' : '#E5E7EB',
                                                }}
                                                transition={{ delay: i * 0.1, duration: 0.3 }}
                                                className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                                            >
                                                {i <= loadingStep ? (
                                                    <CheckCircle className="w-4 h-4 text-white" />
                                                ) : (
                                                    <div className="w-2 h-2 rounded-full bg-gray-400" />
                                                )}
                                            </motion.div>
                                            <span
                                                className={`text-[13px] ${i <= loadingStep ? 'text-[#1C1C1E] font-medium' : 'text-[#9CA3AF]'
                                                    }`}
                                            >
                                                {step}
                                            </span>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* â”€â”€ Error State â”€â”€ */}
                {error && !loading && (
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-3xl p-5 shadow-lg border border-red-100 mb-4"
                    >
                        <div className="flex items-start gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center flex-shrink-0">
                                <XCircle className="w-6 h-6 text-red-500" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-[15px] text-[#1C1C1E] mb-1">
                                    {getText('Something went wrong', 'à¤•à¥à¤› à¤—à¤²à¤¤ à¤¹à¥à¤†', 'à¤•à¤¾à¤¹à¥€à¤¤à¤°à¥€ à¤šà¥à¤•à¤²à¥‡')}
                                </h3>
                                <p className="text-[12px] text-red-500 mb-4">{error}</p>
                                <motion.button
                                    whileTap={{ scale: 0.97 }}
                                    onClick={() => {
                                        setShowForm(true);
                                        setError('');
                                    }}
                                    className="bg-red-500 text-white px-5 py-2.5 rounded-xl text-[13px] font-semibold flex items-center gap-2"
                                >
                                    <RefreshCw className="w-4 h-4" />
                                    {getText('Try Again', 'à¤ªà¥à¤¨à¤ƒ à¤ªà¥à¤°à¤¯à¤¾à¤¸ à¤•à¤°à¥‡à¤‚', 'à¤ªà¥à¤¨à¥à¤¹à¤¾ à¤ªà¥à¤°à¤¯à¤¤à¥à¤¨ à¤•à¤°à¤¾')}
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* â”€â”€ Results â”€â”€ */}
                {!loading && schemes.length > 0 && (
                    <div className="space-y-4">
                        {/* Stats Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100"
                        >
                            <div className="grid grid-cols-3 gap-3">
                                <div className="text-center">
                                    <div className="w-10 h-10 rounded-full bg-[#F5A623]/20 flex items-center justify-center mx-auto mb-2">
                                        <TrendingUp className="w-5 h-5 text-[#F5A623]" />
                                    </div>
                                    <div className="font-bold text-[20px] text-[#1C1C1E]">{schemes.length}</div>
                                    <div className="text-[10px] text-[#6B7280]">
                                        {getText('Active Schemes', 'à¤¸à¤•à¥à¤°à¤¿à¤¯ à¤¯à¥‹à¤œà¤¨à¤¾à¤à¤‚', 'à¤¸à¤•à¥à¤°à¤¿à¤¯ à¤¯à¥‹à¤œà¤¨à¤¾')}
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className="w-10 h-10 rounded-full bg-[#2D6A2D]/20 flex items-center justify-center mx-auto mb-2">
                                        <CheckCircle className="w-5 h-5 text-[#2D6A2D]" />
                                    </div>
                                    <div className="font-bold text-[20px] text-[#1C1C1E]">{highMatchCount}</div>
                                    <div className="text-[10px] text-[#6B7280]">
                                        {getText('High Match', 'à¤‰à¤šà¥à¤š à¤®à¤¿à¤²à¤¾à¤¨', 'à¤‰à¤šà¥à¤š à¤œà¥à¤³à¤£à¥€')}
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className="w-10 h-10 rounded-full bg-[#60A5FA]/20 flex items-center justify-center mx-auto mb-2">
                                        <FileText className="w-5 h-5 text-[#60A5FA]" />
                                    </div>
                                    <div className="font-bold text-[20px] text-[#1C1C1E]">{avgMatch}%</div>
                                    <div className="text-[10px] text-[#6B7280]">
                                        {getText('Avg Match', 'à¤”à¤¸à¤¤ à¤®à¤¿à¤²à¤¾à¤¨', 'à¤¸à¤°à¤¾à¤¸à¤°à¥€ à¤œà¥à¤³à¤£à¥€')}
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Edit profile button */}
                        <motion.button
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            onClick={() => setShowForm(true)}
                            className="w-full bg-white border border-gray-200 rounded-2xl py-3.5 flex items-center justify-center gap-2 text-[#2D6A2D] text-[13px] font-semibold hover:bg-[#F0F7F0] transition-colors shadow-sm"
                        >
                            <Edit3 className="w-4 h-4" />
                            {getText('Edit Profile & Re-match', 'à¤ªà¥à¤°à¥‹à¤«à¤¾à¤‡à¤² à¤¸à¤‚à¤ªà¤¾à¤¦à¤¿à¤¤ à¤•à¤°à¥‡à¤‚', 'à¤ªà¥à¤°à¥‹à¤«à¤¾à¤‡à¤² à¤¸à¤‚à¤ªà¤¾à¤¦à¤¿à¤¤ à¤•à¤°à¤¾')}
                        </motion.button>

                        {/* Result header */}
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-bold text-[16px] text-[#1C1C1E]">
                                    {getText('Your Matched Schemes', 'à¤†à¤ªà¤•à¥€ à¤®à¤¿à¤²à¤¾à¤¨ à¤¯à¥‹à¤œà¤¨à¤¾à¤à¤‚', 'à¤¤à¥à¤®à¤šà¥à¤¯à¤¾ à¤œà¥à¤³à¤²à¥‡à¤²à¥à¤¯à¤¾ à¤¯à¥‹à¤œà¤¨à¤¾')}
                                </h3>
                                <p className="text-[12px] text-[#6B7280]">
                                    {getText('Sorted by match percentage', 'à¤®à¤¿à¤²à¤¾à¤¨ à¤ªà¥à¤°à¤¤à¤¿à¤¶à¤¤ à¤•à¥‡ à¤…à¤¨à¥à¤¸à¤¾à¤°', 'à¤œà¥à¤³à¤£à¥€ à¤Ÿà¤•à¥à¤•à¥‡à¤µà¤¾à¤°à¥€à¤¨à¥à¤¸à¤¾à¤°')}
                                </p>
                            </div>
                        </div>

                        {/* Scheme Cards */}
                        {schemes.map((scheme, idx) => {
                            const colors = getMatchColor(scheme.matchPercent);
                            const reasons = getText(
                                scheme.reasons?.join('|') || '',
                                scheme.reasonsHi?.join('|') || '',
                                scheme.reasonsMr?.join('|') || ''
                            )
                                .split('|')
                                .filter(Boolean);
                            const warnings = getText(
                                scheme.warnings?.join('|') || '',
                                scheme.warningsHi?.join('|') || '',
                                scheme.warningsMr?.join('|') || ''
                            )
                                .split('|')
                                .filter(Boolean);
                            const daysLeft = getDaysLeft(scheme.deadline);
                            const isTracked = trackedIds.has(scheme.schemeId);
                            const isExpanded = expandedCard === scheme.schemeId;

                            return (
                                <motion.div
                                    key={scheme.schemeId}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.08 + 0.2 }}
                                    className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden"
                                >
                                    {/* Card header */}
                                    <div className="p-4 pb-3">
                                        <div className="flex items-start gap-3 mb-3">
                                            {/* Logo + rank */}
                                            <div className="relative flex-shrink-0">
                                                <div className="w-14 h-14 rounded-2xl bg-[#F7F3EE] flex items-center justify-center text-2xl border-2 border-[#F5A623]/20">
                                                    {scheme.logo}
                                                </div>
                                                {idx < 3 && (
                                                    <div
                                                        className={`absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full flex items-center justify-center shadow-md ${idx === 0
                                                            ? 'bg-[#F5A623]'
                                                            : idx === 1
                                                                ? 'bg-[#9CA3AF]'
                                                                : 'bg-[#CD7F32]'
                                                            }`}
                                                    >
                                                        <span className="text-white text-[10px] font-bold">{idx + 1}</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Name + tag */}
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-bold text-[15px] text-[#1C1C1E] leading-snug mb-1">
                                                    {getText(scheme.schemeName, scheme.schemeNameHi, scheme.schemeNameMr)}
                                                </h3>
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <span className="bg-[#F0F7F0] text-[#2D6A2D] px-2 py-0.5 rounded-full text-[10px] font-semibold">
                                                        {getText(scheme.tag, scheme.tagHi, scheme.tagMr)}
                                                    </span>
                                                    <span className="text-[#F5A623] font-bold text-[12px]">{scheme.amount}</span>
                                                </div>
                                            </div>

                                            {/* Match % badge */}
                                            <div
                                                className={`${colors.bg} border-2 ${colors.border} rounded-2xl px-3 py-2 text-center flex-shrink-0`}
                                            >
                                                <div className={`font-bold text-[20px] leading-none ${colors.text}`}>
                                                    {scheme.matchPercent}%
                                                </div>
                                                <div className={`text-[9px] font-semibold ${colors.text} opacity-80 mt-0.5`}>
                                                    {getText('match', 'à¤®à¤¿à¤²à¤¾à¤¨', 'à¤œà¥à¤³à¤£à¥€')}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Approval + Deadline row */}
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="flex-1 bg-blue-50 rounded-xl px-3 py-2 flex items-center gap-2">
                                                <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
                                                <span className="text-[11px] font-semibold text-blue-800">
                                                    {getText('Approval', 'à¤¸à¥à¤µà¥€à¤•à¥ƒà¤¤à¤¿', 'à¤®à¤‚à¤œà¥à¤°à¥€')}: {scheme.approvalPercent}%
                                                </span>
                                            </div>
                                            {daysLeft && (
                                                <div
                                                    className={`flex-1 rounded-xl px-3 py-2 flex items-center gap-2 ${daysLeft <= 7
                                                        ? 'bg-red-50'
                                                        : daysLeft <= 30
                                                            ? 'bg-amber-50'
                                                            : 'bg-green-50'
                                                        }`}
                                                >
                                                    <Calendar
                                                        className={`w-3.5 h-3.5 ${daysLeft <= 7
                                                            ? 'text-red-600'
                                                            : daysLeft <= 30
                                                                ? 'text-amber-600'
                                                                : 'text-green-600'
                                                            }`}
                                                    />
                                                    <span
                                                        className={`text-[11px] font-semibold ${daysLeft <= 7
                                                            ? 'text-red-800'
                                                            : daysLeft <= 30
                                                                ? 'text-amber-800'
                                                                : 'text-green-800'
                                                            }`}
                                                    >
                                                        {daysLeft} {getText('days left', 'à¤¦à¤¿à¤¨ à¤¶à¥‡à¤·', 'à¤¦à¤¿à¤µà¤¸ à¤¶à¤¿à¤²à¥à¤²à¤•')}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Match bar */}
                                        <div className="mb-3">
                                            <div className="flex justify-between items-center mb-1.5">
                                                <span className={`text-[11px] font-medium ${colors.text}`}>
                                                    {getMatchLabel(scheme.matchPercent)}
                                                </span>
                                                <span className="text-[11px] text-[#6B7280]">
                                                    {scheme.matchPercent}% {getText('eligible', 'à¤ªà¤¾à¤¤à¥à¤°', 'à¤ªà¤¾à¤¤à¥à¤°')}
                                                </span>
                                            </div>
                                            <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: animatingBars ? `${scheme.matchPercent}%` : 0 }}
                                                    transition={{ duration: 1, ease: 'easeOut', delay: idx * 0.1 + 0.3 }}
                                                    className={`h-full rounded-full ${colors.bar}`}
                                                />
                                            </div>
                                        </div>

                                        {/* Reasons */}
                                        {reasons.length > 0 && (
                                            <div className="space-y-2 mb-3">
                                                {reasons.map((r, i) => (
                                                    <div key={i} className="flex items-start gap-2">
                                                        <div className="w-5 h-5 rounded-full bg-[#F0F7F0] flex items-center justify-center flex-shrink-0 mt-0.5">
                                                            <CheckCircle className="w-3 h-3 text-[#2D6A2D]" />
                                                        </div>
                                                        <span className="text-[13px] text-[#1C1C1E]">{r}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* Warnings */}
                                        {warnings.length > 0 && (
                                            <div className="space-y-2 mb-2">
                                                {warnings.map((w, i) => (
                                                    <div key={i} className="flex items-start gap-2">
                                                        <div className="w-5 h-5 rounded-full bg-amber-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                            <AlertCircle className="w-3 h-3 text-[#F5A623]" />
                                                        </div>
                                                        <span className="text-[12px] text-[#B8740A]">{w}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* Expand/Collapse for documents & steps */}
                                        <button
                                            onClick={() => setExpandedCard(isExpanded ? null : scheme.schemeId)}
                                            className="w-full mt-2 flex items-center justify-center gap-1 text-[#2D6A2D] text-[12px] font-medium"
                                        >
                                            {isExpanded ? (
                                                <>
                                                    {getText('Show Less', 'à¤•à¤® à¤¦à¤¿à¤–à¤¾à¤à¤‚', 'à¤•à¤®à¥€ à¤¦à¤¾à¤–à¤µà¤¾')}
                                                    <ChevronUp className="w-4 h-4" />
                                                </>
                                            ) : (
                                                <>
                                                    {getText('Documents & Steps', 'à¤¦à¤¸à¥à¤¤à¤¾à¤µà¥‡à¤œà¤¼ à¤”à¤° à¤šà¤°à¤£', 'à¤•à¤¾à¤—à¤¦à¤ªà¤¤à¥à¤°à¥‡ à¤†à¤£à¤¿ à¤ªà¤¾à¤¯à¤±à¥à¤¯à¤¾')}
                                                    <ChevronDown className="w-4 h-4" />
                                                </>
                                            )}
                                        </button>

                                        {/* Expanded content */}
                                        <AnimatePresence>
                                            {isExpanded && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.2 }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="pt-3 mt-3 border-t border-gray-100 space-y-3">
                                                        {/* Documents needed */}
                                                        {scheme.documentsNeeded?.length > 0 && (
                                                            <div>
                                                                <p className="text-[11px] font-bold text-[#6B7280] uppercase mb-2">
                                                                    {getText('Documents Needed', 'à¤†à¤µà¤¶à¥à¤¯à¤• à¤¦à¤¸à¥à¤¤à¤¾à¤µà¥‡à¤œà¤¼', 'à¤†à¤µà¤¶à¥à¤¯à¤• à¤•à¤¾à¤—à¤¦à¤ªà¤¤à¥à¤°à¥‡')}
                                                                </p>
                                                                <div className="flex flex-wrap gap-1.5">
                                                                    {scheme.documentsNeeded.map((doc, i) => (
                                                                        <span
                                                                            key={i}
                                                                            className="bg-[#F7F3EE] text-[#1C1C1E] px-2.5 py-1 rounded-lg text-[11px] font-medium"
                                                                        >
                                                                            {doc}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}

                                                        {/* Steps */}
                                                        {scheme.steps?.length > 0 && (
                                                            <div>
                                                                <p className="text-[11px] font-bold text-[#6B7280] uppercase mb-2">
                                                                    {getText('How to Apply', 'à¤†à¤µà¥‡à¤¦à¤¨ à¤•à¥ˆà¤¸à¥‡ à¤•à¤°à¥‡à¤‚', 'à¤…à¤°à¥à¤œ à¤•à¤¸à¤¾ à¤•à¤°à¤¾à¤µà¤¾')}
                                                                </p>
                                                                <div className="space-y-2">
                                                                    {scheme.steps.map((step, i) => (
                                                                        <div key={i} className="flex items-start gap-2">
                                                                            <div className="w-5 h-5 rounded-full bg-[#F5A623] text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                                                                                {i + 1}
                                                                            </div>
                                                                            <span className="text-[12px] text-[#1C1C1E]">{step}</span>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>

                                    {/* Card footer â€” buttons */}
                                    <div className="flex border-t border-gray-100">
                                        <button
                                            onClick={() => trackScheme(scheme)}
                                            disabled={isTracked}
                                            className={`flex-1 py-3.5 flex items-center justify-center gap-1.5 text-[13px] font-semibold border-r border-gray-100 transition-colors ${isTracked
                                                ? 'bg-green-50 text-green-700'
                                                : 'text-[#2D6A2D] hover:bg-[#F0F7F0]'
                                                }`}
                                        >
                                            {isTracked ? (
                                                <>
                                                    <CheckCircle className="w-4 h-4" />
                                                    {getText('Tracked', 'à¤Ÿà¥à¤°à¥ˆà¤• à¤•à¤¿à¤¯à¤¾', 'à¤Ÿà¥à¤°à¥…à¤• à¤•à¥‡à¤²à¥‡')}
                                                </>
                                            ) : (
                                                <>
                                                    <BookmarkPlus className="w-4 h-4" />
                                                    {getText('Track', 'à¤Ÿà¥à¤°à¥ˆà¤• à¤•à¤°à¥‡à¤‚', 'à¤Ÿà¥à¤°à¥…à¤• à¤•à¤°à¤¾')}
                                                </>
                                            )}
                                        </button>
                                        <a
                                            href={scheme.applyUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            onClick={() => trackScheme(scheme)}
                                            className="flex-1 py-3.5 flex items-center justify-center gap-1.5 bg-[#F5A623] text-white text-[13px] font-bold hover:bg-[#E09000] transition-colors"
                                        >
                                            {getText('Apply Now', 'à¤…à¤­à¥€ à¤†à¤µà¥‡à¤¦à¤¨ à¤•à¤°à¥‡à¤‚', 'à¤†à¤¤à¤¾ à¤…à¤°à¥à¤œ à¤•à¤°à¤¾')}
                                            <ExternalLink className="w-4 h-4" />
                                        </a>
                                    </div>
                                </motion.div>
                            );
                        })}

                        {/* Bottom note */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8 }}
                            className="bg-[#F0F7F0] rounded-2xl p-4 flex items-start gap-3"
                        >
                            <div className="w-10 h-10 rounded-full bg-[#2D6A2D]/10 flex items-center justify-center flex-shrink-0">
                                <span className="text-lg">ðŸ’¡</span>
                            </div>
                            <div>
                                <p className="font-semibold text-[13px] text-[#2D6A2D] mb-1">
                                    {getText('Important Note', 'à¤®à¤¹à¤¤à¥à¤µà¤ªà¥‚à¤°à¥à¤£ à¤¨à¥‹à¤Ÿ', 'à¤®à¤¹à¤¤à¥à¤¤à¥à¤µà¤¾à¤šà¥€ à¤¨à¥‹à¤‚à¤¦')}
                                </p>
                                <p className="text-[12px] text-[#6B7280] leading-relaxed">
                                    {getText(
                                        'Match % and Approval % are AI-estimated. Click "Track" to monitor deadlines in Applications tab. Click "Apply Now" to be redirected to the official portal.',
                                        'à¤®à¤¿à¤²à¤¾à¤¨ % à¤”à¤° à¤¸à¥à¤µà¥€à¤•à¥ƒà¤¤à¤¿ % AI à¤…à¤¨à¥à¤®à¤¾à¤¨ à¤¹à¥ˆà¤‚à¥¤ à¤†à¤µà¥‡à¤¦à¤¨ à¤Ÿà¥ˆà¤¬ à¤®à¥‡à¤‚ à¤¸à¤®à¤¯ à¤¸à¥€à¤®à¤¾à¤“à¤‚ à¤•à¥€ à¤¨à¤¿à¤—à¤°à¤¾à¤¨à¥€ à¤•à¥‡ à¤²à¤¿à¤ "à¤Ÿà¥à¤°à¥ˆà¤• à¤•à¤°à¥‡à¤‚" à¤ªà¤° à¤•à¥à¤²à¤¿à¤• à¤•à¤°à¥‡à¤‚à¥¤ à¤†à¤§à¤¿à¤•à¤¾à¤°à¤¿à¤• à¤ªà¥‹à¤°à¥à¤Ÿà¤² à¤ªà¤° à¤œà¤¾à¤¨à¥‡ à¤•à¥‡ à¤²à¤¿à¤ "à¤…à¤­à¥€ à¤†à¤µà¥‡à¤¦à¤¨ à¤•à¤°à¥‡à¤‚" à¤ªà¤° à¤•à¥à¤²à¤¿à¤• à¤•à¤°à¥‡à¤‚à¥¤',
                                        'à¤œà¥à¤³à¤£à¥€ % à¤†à¤£à¤¿ à¤®à¤‚à¤œà¥à¤°à¥€ % AI à¤…à¤‚à¤¦à¤¾à¤œ à¤†à¤¹à¥‡à¤¤. à¤…à¤°à¥à¤œ à¤Ÿà¥…à¤¬à¤®à¤§à¥à¤¯à¥‡ à¤®à¥à¤¦à¤¤à¥€à¤‚à¤šà¥‡ à¤¨à¤¿à¤°à¥€à¤•à¥à¤·à¤£ à¤•à¤°à¤£à¥à¤¯à¤¾à¤¸à¤¾à¤ à¥€ "à¤Ÿà¥à¤°à¥…à¤• à¤•à¤°à¤¾" à¤µà¤° à¤•à¥à¤²à¤¿à¤• à¤•à¤°à¤¾. à¤…à¤§à¤¿à¤•à¥ƒà¤¤ à¤ªà¥‹à¤°à¥à¤Ÿà¤²à¤µà¤° à¤œà¤¾à¤£à¥à¤¯à¤¾à¤¸à¤¾à¤ à¥€ "à¤†à¤¤à¤¾ à¤…à¤°à¥à¤œ à¤•à¤°à¤¾" à¤µà¤° à¤•à¥à¤²à¤¿à¤• à¤•à¤°à¤¾.'
                                    )}
                                </p>
                            </div>
                        </motion.div>
                    </div>
                )}
            </div>

            <BottomNav />
        </div>
    );
}
