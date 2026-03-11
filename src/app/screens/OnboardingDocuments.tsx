// src/app/screens/OnboardingDocuments.tsx
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Upload, CheckCircle, Sparkles, FileText, ChevronRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../../context/LanguageContext';
import { useUser } from '../../context/UserContext';

const DOC_LIST = [
  {
    id: 'aadhaar',
    en: 'Aadhaar Card',
    hi: 'आधार कार्ड',
    mr: 'आधार कार्ड',
    required: true,
    icon: '🪪',
    desc_en: 'Identity proof issued by UIDAI',
    desc_hi: 'UIDAI द्वारा जारी पहचान पत्र',
    desc_mr: 'UIDAI द्वारे जारी ओळखपत्र',
  },
  {
    id: 'land',
    en: 'Land Records',
    hi: 'भूमि रिकॉर्ड',
    mr: 'जमीन नोंदी',
    required: true,
    icon: '📋',
    desc_en: '7/12 extract or similar land document',
    desc_hi: '7/12 उतारा या समान भूमि दस्तावेज़',
    desc_mr: '7/12 उतारा किंवा तत्सम जमीन कागदपत्र',
  },
  {
    id: 'bank',
    en: 'Bank Passbook',
    hi: 'बैंक पासबुक',
    mr: 'बँक पासबुक',
    required: true,
    icon: '💳',
    desc_en: 'First page showing account details',
    desc_hi: 'खाता विवरण दिखाने वाला पहला पृष्ठ',
    desc_mr: 'खाते तपशील दर्शवणारे पहिले पान',
  },
  {
    id: 'photo',
    en: 'Passport Photo',
    hi: 'पासपोर्ट फोटो',
    mr: 'पासपोर्ट फोटो',
    required: false,
    icon: '🖼️',
    desc_en: 'Recent passport-size photograph',
    desc_hi: 'हाल की पासपोर्ट साइज फोटो',
    desc_mr: 'अलीकडील पासपोर्ट आकाराचा फोटो',
  },
];

export function OnboardingDocuments() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { userData, updateUserData } = useUser();
  const isHindi = language === 'hi';
  const isMarathi = language === 'mr';

  const loc = (en: string, hi: string, mr: string) =>
    isMarathi ? mr : isHindi ? hi : en;

  // Track uploaded files per document
  const [uploads, setUploads] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    userData.documents.forEach((d) => {
      if (d.file) initial[d.id] = d.file;
    });
    return initial;
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeDocId, setActiveDocId] = useState('');
  const [saving, setSaving] = useState(false);

  const uploadedCount = Object.keys(uploads).length;
  const requiredDone = DOC_LIST.filter((d) => d.required).every((d) => uploads[d.id]);

  const triggerUpload = (docId: string) => {
    setActiveDocId(docId);
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeDocId) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setUploads((prev) => ({ ...prev, [activeDocId]: result }));
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const removeUpload = (docId: string) => {
    setUploads((prev) => {
      const n = { ...prev };
      delete n[docId];
      return n;
    });
  };

  const handleFinish = async () => {
    setSaving(true);
    // Persist uploaded documents back into UserContext
    const updatedDocs = userData.documents.map((doc) => ({
      ...doc,
      status: uploads[doc.id] ? ('uploaded' as const) : doc.status,
      file: uploads[doc.id] || doc.file,
    }));
    await updateUserData({ documents: updatedDocs });

    // Format docs for backend (Record<string, string>)
    const docsForBackend: Record<string, string> = {};
    updatedDocs.forEach((d) => {
      if (d.status === 'uploaded' && d.file) {
        docsForBackend[d.id] = d.file as string; // assuming file is base64 string
      }
    });

    // Persist to backend
    try {
      const { saveProfile } = await import('../../utils/api');
      await saveProfile({ documents: docsForBackend });
    } catch (err) {
      console.warn('Could not save documents to backend:', err);
    }

    setSaving(false);
    navigate('/dashboard');
  };

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
            {loc('Step 4 of 4 — Documents', 'चरण 4 / 4 — दस्तावेज़', 'टप्पा 4 / 4 — कागदपत्रे')}
          </p>
        </div>
        <div className="w-9" />
      </div>

      {/* Progress Bar — all 4 filled */}
      <div className="bg-white px-4 pb-4">
        <div className="flex gap-1.5">
          {[1, 2, 3, 4].map((step) => (
            <motion.div
              key={step}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.4, delay: step * 0.1 }}
              className="flex-1 h-1.5 rounded-full bg-[#F5A623]"
            />
          ))}
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,application/pdf"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-36">
        <div className="px-6 py-6">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-5 h-5 text-[#F5A623]" />
            <h1 className="text-[22px] font-bold text-[#1C1C1E]">
              {loc('Upload Documents', 'दस्तावेज़ अपलोड करें', 'कागदपत्रे अपलोड करा')}
            </h1>
          </div>
          <p className="text-[14px] text-[#6B7280] leading-relaxed">
            {loc(
              'Upload required documents to apply for schemes instantly.',
              'योजनाओं में आवेदन के लिए आवश्यक दस्तावेज़ अपलोड करें।',
              'योजनांसाठी अर्ज करण्यासाठी आवश्यक कागदपत्रे अपलोड करा.'
            )}
          </p>

          {/* Progress badge */}
          <div className="mt-4 bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center justify-between">
            <span className="text-[13px] text-[#6B7280]">
              {loc('Documents uploaded', 'दस्तावेज़ अपलोड', 'कागदपत्रे अपलोड')}
            </span>
            <span className={`font-bold text-[15px] ${uploadedCount === DOC_LIST.length ? 'text-green-500' : 'text-[#F5A623]'}`}>
              {uploadedCount} / {DOC_LIST.length}
            </span>
          </div>
        </div>

        <div className="px-6 space-y-3">
          {DOC_LIST.map((doc, i) => {
            const uploaded = !!uploads[doc.id];
            return (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.07 }}
                className={`bg-white rounded-3xl p-5 shadow-sm border-2 transition-all ${
                  uploaded ? 'border-green-200' : 'border-gray-100'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 ${
                    uploaded ? 'bg-green-50' : 'bg-[#F7F3EE]'
                  }`}>
                    {uploaded ? '✅' : doc.icon}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="font-semibold text-[15px] text-[#1C1C1E]">
                        {loc(doc.en, doc.hi, doc.mr)}
                      </h3>
                      {doc.required && (
                        <span className="text-[10px] bg-red-50 text-red-500 px-1.5 py-0.5 rounded-full font-semibold">
                          {loc('Required', 'अनिवार्य', 'आवश्यक')}
                        </span>
                      )}
                    </div>
                    <p className="text-[12px] text-[#6B7280] leading-snug">
                      {loc(doc.desc_en, doc.desc_hi, doc.desc_mr)}
                    </p>

                    {uploaded ? (
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-[12px] font-semibold text-green-600 flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5" />
                          {loc('Uploaded', 'अपलोड हो गया', 'अपलोड झाले')}
                        </span>
                        <button
                          onClick={() => removeUpload(doc.id)}
                          className="text-[11px] text-red-400 flex items-center gap-0.5 ml-auto"
                        >
                          <X className="w-3 h-3" />
                          {loc('Remove', 'हटाएं', 'काढा')}
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => triggerUpload(doc.id)}
                        className="mt-2 flex items-center gap-1.5 text-[13px] font-semibold text-[#F5A623]"
                      >
                        <Upload className="w-4 h-4" />
                        {loc('Upload', 'अपलोड करें', 'अपलोड करा')}
                      </button>
                    )}
                  </div>

                  {/* Preview thumbnail */}
                  {uploaded && uploads[doc.id].startsWith('data:image') && (
                    <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 border border-gray-200">
                      <img src={uploads[doc.id]} alt="preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                  {uploaded && !uploads[doc.id].startsWith('data:image') && (
                    <div className="w-14 h-14 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-7 h-7 text-blue-400" />
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}

          <p className="text-center text-[12px] text-[#9CA3AF] px-4 mt-2">
            {loc(
              'You can upload or update documents later from your profile.',
              'आप बाद में प्रोफ़ाइल से दस्तावेज़ अपलोड या अपडेट कर सकते हैं।',
              'तुम्ही नंतर प्रोफाइलमधून कागदपत्रे अपलोड किंवा अपडेट करू शकता.'
            )}
          </p>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-100 p-4">
        <AnimatePresence>
          {!requiredDone && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 text-[12px] text-amber-700"
            >
              {loc(
                '⚠️ Upload the 3 required documents to get maximum scheme eligibility.',
                '⚠️ अधिकतम योजना पात्रता के लिए 3 अनिवार्य दस्तावेज़ अपलोड करें।',
                '⚠️ जास्तीत जास्त योजना पात्रतेसाठी 3 आवश्यक कागदपत्रे अपलोड करा.'
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          onClick={handleFinish}
          disabled={saving}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-4 rounded-2xl font-bold text-[16px] bg-[#2D6A2D] text-white shadow-lg shadow-green-800/20 flex items-center justify-center gap-2"
        >
          {saving ? (
            <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              {loc('Go to Dashboard 🎉', 'डैशबोर्ड पर जाएं 🎉', 'डॅशबोर्डवर जा 🎉')}
              <ChevronRight className="w-5 h-5" />
            </>
          )}
        </motion.button>

        {!requiredDone && (
          <button
            onClick={handleFinish}
            className="w-full mt-2 py-2 text-[13px] text-[#9CA3AF] text-center"
          >
            {loc('Skip for now →', 'अभी छोड़ें →', 'आत्ता वगळा →')}
          </button>
        )}
      </div>
    </div>
  );
}
