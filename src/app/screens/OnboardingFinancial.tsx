// src/app/screens/OnboardingFinancial.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Wallet, Building2, CreditCard, Sparkles, CheckCircle, AlertCircle, X, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../../context/LanguageContext';
import { useUser } from '../../context/UserContext';

const INCOME_RANGES = [
  { id: 'below-50k', en: 'Below ₹50,000', hi: '₹50,000 से कम', mr: '₹50,000 पेक्षा कमी' },
  { id: '50k-1l', en: '₹50,000 – ₹1 Lakh', hi: '₹50,000 – ₹1 लाख', mr: '₹50,000 – ₹1 लाख' },
  { id: '1l-2l', en: '₹1 – ₹2 Lakh', hi: '₹1 – ₹2 लाख', mr: '₹1 – ₹2 लाख' },
  { id: '2l-5l', en: '₹2 – ₹5 Lakh', hi: '₹2 – ₹5 लाख', mr: '₹2 – ₹5 लाख' },
  { id: 'above-5l', en: 'Above ₹5 Lakh', hi: '₹5 लाख से ज़्यादा', mr: '₹5 लाखांपेक्षा जास्त' },
];

const CATEGORIES = [
  { id: 'BPL', en: 'BPL', hi: 'BPL (गरीबी रेखा से नीचे)', mr: 'BPL (दारिद्र्यरेषेखाली)' },
  { id: 'APL', en: 'APL', hi: 'APL (गरीबी रेखा से ऊपर)', mr: 'APL (दारिद्र्यरेषेवरील)' },
  { id: 'General', en: 'General', hi: 'सामान्य', mr: 'सामान्य' },
  { id: 'SC', en: 'SC', hi: 'अनुसूचित जाति', mr: 'अनुसूचित जाती' },
  { id: 'ST', en: 'ST', hi: 'अनुसूचित जनजाति', mr: 'अनुसूचित जमाती' },
  { id: 'OBC', en: 'OBC', hi: 'अन्य पिछड़ा वर्ग', mr: 'इतर मागासवर्गीय' },
];

export function OnboardingFinancial() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { userData, updateUserData } = useUser();
  const isHindi = language === 'hi';
  const isMarathi = language === 'mr';

  const loc = (en: string, hi: string, mr: string) =>
    isMarathi ? mr : isHindi ? hi : en;

  const [form, setForm] = useState({
    annualIncome: userData.annualIncome || '',
    category: userData.category || '',
    bankName: userData.bankName || '',
    bankAccount: userData.bankAccount || '',
    ifscCode: userData.ifscCode || '',
  });

  const [showError, setShowError] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const isComplete =
    form.annualIncome &&
    form.category &&
    form.bankName.trim() &&
    form.bankAccount.trim() &&
    form.ifscCode.trim();

  const validate = () => {
    const errs: string[] = [];
    if (!form.annualIncome) errs.push(loc('Select annual income', 'वार्षिक आय चुनें', 'वार्षिक उत्पन्न निवडा'));
    if (!form.category) errs.push(loc('Select category', 'वर्ग चुनें', 'श्रेणी निवडा'));
    if (!form.bankName.trim()) errs.push(loc('Enter bank name', 'बैंक का नाम दर्ज करें', 'बँकेचे नाव टाका'));
    if (!form.bankAccount.trim()) errs.push(loc('Enter account number', 'खाता नंबर दर्ज करें', 'खाते क्रमांक टाका'));
    if (!form.ifscCode.trim()) errs.push(loc('Enter IFSC code', 'IFSC कोड दर्ज करें', 'IFSC कोड टाका'));
    return errs;
  };

  const handleContinue = async () => {
    const errs = validate();
    if (errs.length > 0) {
      setErrors(errs);
      setShowError(true);
      setTimeout(() => setShowError(false), 5000);
      return;
    }
    await updateUserData({ ...form });
    navigate('/dashboard');
  };

  const inputClass =
    'w-full px-4 py-3.5 bg-[#F7F3EE] rounded-2xl border-2 border-transparent outline-none focus:border-[#F5A623] focus:bg-white transition-all duration-200 text-[15px] text-[#1C1C1E] placeholder:text-gray-400';

  const completionStep = (() => {
    let c = 0;
    if (form.annualIncome) c++;
    if (form.category) c++;
    if (form.bankName.trim()) c++;
    if (form.bankAccount.trim()) c++;
    if (form.ifscCode.trim()) c++;
    return Math.round((c / 5) * 100);
  })();

  return (
    <div className="min-h-screen bg-[#F7F3EE] flex flex-col">
      {/* Top Bar */}
      <div className="bg-white px-4 pt-10 pb-3 flex items-center gap-3 border-b border-gray-100 shadow-sm">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 flex items-center justify-center rounded-full bg-[#F7F3EE] hover:bg-gray-200 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-[#1C1C1E]" />
        </button>
        <div className="flex-1 text-center">
          <p className="text-[13px] font-medium text-[#6B7280]">
            {loc('Step 3 of 3 — Financial Details', 'चरण 3 / 3 — वित्तीय जानकारी', 'टप्पा 3 / 3 — आर्थिक माहिती')}
          </p>
        </div>
        <div className="w-9" />
      </div>

      {/* Progress Bar */}
      <div className="bg-white px-4 pb-4">
        <div className="flex gap-1.5">
          {[1, 2, 3].map((step) => (
            <motion.div
              key={step}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.4, delay: step * 0.1 }}
              className={`flex-1 h-1.5 rounded-full ${step <= 3 ? 'bg-[#F5A623]' : 'bg-gray-100'}`}
            />
          ))}
        </div>
      </div>

      {/* Validation Error */}
      <AnimatePresence>
        {showError && errors.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mx-4 mt-3 bg-red-50 border border-red-200 rounded-2xl p-4"
          >
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-[13px] font-semibold text-red-700 mb-1">
                  {loc('Please fill all details', 'कृपया सभी जानकारी भरें', 'कृपया सर्व माहिती भरा')}
                </p>
                <ul className="space-y-0.5">
                  {errors.map((err, i) => (
                    <li key={i} className="text-[12px] text-red-600 flex items-center gap-1">
                      <span>•</span> {err}
                    </li>
                  ))}
                </ul>
              </div>
              <button onClick={() => setShowError(false)}>
                <X className="w-4 h-4 text-red-400" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-32">
        <div className="px-6 py-6">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-5 h-5 text-[#F5A623]" />
            <h1 className="text-[22px] font-bold text-[#1C1C1E]">
              {loc('Financial Details', 'वित्तीय जानकारी', 'आर्थिक माहिती')}
            </h1>
          </div>
          <p className="text-[14px] text-[#6B7280] leading-relaxed">
            {loc(
              'Help us find eligible schemes based on your income.',
              'आय के अनुसार सही योजनाएं ढूंढने में मदद करें।',
              'उत्पन्नानुसार योग्य योजना शोधण्यासाठी माहिती द्या.'
            )}
          </p>

          {/* Progress */}
          <div className="mt-4 bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[12px] font-medium text-[#6B7280]">
                {loc('Completion', 'पूर्णता', 'पूर्णता')}
              </span>
              <span className={`text-[14px] font-bold ${completionStep === 100 ? 'text-green-500' : 'text-[#F5A623]'}`}>
                {completionStep}%
              </span>
            </div>
            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${completionStep}%` }}
                transition={{ duration: 0.5 }}
                className={`h-full rounded-full ${completionStep === 100 ? 'bg-green-500' : 'bg-[#F5A623]'}`}
              />
            </div>
          </div>
        </div>

        <div className="px-6 space-y-4">
          {/* Annual Income */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`bg-white rounded-3xl p-5 shadow-sm border-2 transition-all ${form.annualIncome ? 'border-green-200' : 'border-gray-100'}`}
          >
            <div className="flex items-center gap-2 mb-4">
              <Wallet className="w-5 h-5 text-[#F5A623]" />
              <h3 className="font-semibold text-[16px] text-[#1C1C1E]">
                {loc('Annual Income', 'वार्षिक आय', 'वार्षिक उत्पन्न')}
                <span className="text-red-500 ml-1">*</span>
              </h3>
              {form.annualIncome && <CheckCircle className="w-5 h-5 text-green-500 ml-auto" />}
            </div>
            <div className="grid grid-cols-1 gap-2">
              {INCOME_RANGES.map((r) => (
                <motion.button
                  key={r.id}
                  onClick={() => setForm({ ...form, annualIncome: r.id })}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl font-medium text-[14px] transition-all duration-200 border-2 ${
                    form.annualIncome === r.id
                      ? 'bg-[#F5A623] text-white border-[#F5A623] shadow-md shadow-[#F5A623]/20'
                      : 'bg-[#F7F3EE] text-[#1C1C1E] border-transparent hover:border-[#F5A623]/30'
                  }`}
                >
                  <span>{isMarathi ? r.mr : isHindi ? r.hi : r.en}</span>
                  {form.annualIncome === r.id && <CheckCircle className="w-4 h-4 text-white" />}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Category */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className={`bg-white rounded-3xl p-5 shadow-sm border-2 transition-all ${form.category ? 'border-green-200' : 'border-gray-100'}`}
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">🪪</span>
              <h3 className="font-semibold text-[16px] text-[#1C1C1E]">
                {loc('Social Category', 'सामाजिक वर्ग', 'सामाजिक श्रेणी')}
                <span className="text-red-500 ml-1">*</span>
              </h3>
              {form.category && <CheckCircle className="w-5 h-5 text-green-500 ml-auto" />}
            </div>
            <div className="grid grid-cols-3 gap-2">
              {CATEGORIES.map((cat) => (
                <motion.button
                  key={cat.id}
                  onClick={() => setForm({ ...form, category: cat.id })}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className={`py-3 rounded-2xl font-semibold text-[13px] transition-all duration-200 border-2 ${
                    form.category === cat.id
                      ? 'bg-[#F5A623] text-white border-[#F5A623] shadow-md shadow-[#F5A623]/20'
                      : 'bg-[#F7F3EE] text-[#6B7280] border-transparent hover:border-[#F5A623]/30'
                  }`}
                >
                  {cat.id}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Bank Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`bg-white rounded-3xl p-5 shadow-sm border-2 transition-all ${
              form.bankName && form.bankAccount && form.ifscCode ? 'border-green-200' : 'border-gray-100'
            }`}
          >
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="w-5 h-5 text-[#F5A623]" />
              <h3 className="font-semibold text-[16px] text-[#1C1C1E]">
                {loc('Bank Details', 'बैंक विवरण', 'बँक तपशील')}
                <span className="text-red-500 ml-1">*</span>
              </h3>
              {form.bankName && form.bankAccount && form.ifscCode && (
                <CheckCircle className="w-5 h-5 text-green-500 ml-auto" />
              )}
            </div>

            <div className="space-y-4">
              <div>
                <label className="flex items-center gap-1.5 text-[12px] font-semibold text-[#6B7280] uppercase tracking-wider mb-2">
                  <Building2 className="w-3.5 h-3.5" />
                  {loc('Bank Name', 'बैंक का नाम', 'बँकेचे नाव')} *
                </label>
                <input
                  type="text"
                  value={form.bankName}
                  onChange={(e) => setForm({ ...form, bankName: e.target.value })}
                  placeholder={loc('e.g. State Bank of India', 'जैसे: स्टेट बैंक ऑफ इंडिया', 'उदा. स्टेट बँक ऑफ इंडिया')}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="flex items-center gap-1.5 text-[12px] font-semibold text-[#6B7280] uppercase tracking-wider mb-2">
                  <CreditCard className="w-3.5 h-3.5" />
                  {loc('Account Number', 'खाता नंबर', 'खाते क्रमांक')} *
                </label>
                <input
                  type="number"
                  value={form.bankAccount}
                  onChange={(e) => setForm({ ...form, bankAccount: e.target.value })}
                  placeholder={loc('Enter account number', 'खाता नंबर दर्ज करें', 'खाते क्रमांक टाका')}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="flex items-center gap-1.5 text-[12px] font-semibold text-[#6B7280] uppercase tracking-wider mb-2">
                  {loc('IFSC Code', 'IFSC कोड', 'IFSC कोड')} *
                </label>
                <input
                  type="text"
                  value={form.ifscCode}
                  onChange={(e) => setForm({ ...form, ifscCode: e.target.value.toUpperCase() })}
                  placeholder="e.g. SBIN0001234"
                  maxLength={11}
                  className={`${inputClass} font-mono`}
                />
              </div>
            </div>
          </motion.div>

          {/* Skip note */}
          <p className="text-center text-[12px] text-[#9CA3AF] px-4">
            {loc(
              'You can update these details later in your profile.',
              'आप बाद में प्रोफ़ाइल में ये जानकारी अपडेट कर सकते हैं।',
              'हे तपशील नंतर प्रोफाइलमध्ये अपडेट करता येतील.'
            )}
          </p>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-100 p-4">
        <motion.button
          onClick={handleContinue}
          whileHover={{ scale: isComplete ? 1.02 : 1 }}
          whileTap={{ scale: isComplete ? 0.98 : 1 }}
          className={`w-full py-4 rounded-2xl font-bold text-[16px] transition-all flex items-center justify-center gap-2 ${
            isComplete
              ? 'bg-[#F5A623] text-white shadow-lg shadow-[#F5A623]/30'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          {isComplete ? (
            <>
              {loc('Continue', 'आगे बढ़ें', 'पुढे जा')}
              <ChevronRight className="w-5 h-5" />
            </>
          ) : (
            <>
              {loc('Fill all details', 'सभी जानकारी भरें', 'सर्व माहिती भरा')}
              <span className="text-[12px] bg-white/20 px-2 py-0.5 rounded-full">{completionStep}%</span>
            </>
          )}
        </motion.button>

        <button
          onClick={() => navigate('/dashboard')}
          className="w-full mt-2 py-2 text-[13px] text-[#9CA3AF] text-center"
        >
          {loc('Skip for now →', 'अभी छोड़ें →', 'आत्ता वगळा →')}
        </button>
      </div>
    </div>
  );
}
