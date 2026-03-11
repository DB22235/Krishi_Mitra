import { useState } from 'react';
import {
  ArrowLeft,
  Calendar,
  FileText,
  Clock,
  IndianRupee,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../../context/LanguageContext';
import { useUser } from '../../context/UserContext';


export function SchemeDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { language } = useLanguage();
  const { userData } = useUser();
  const isHindi = language === 'hi';
  const isMarathi = language === 'mr';


  const [expandedSection, setExpandedSection] = useState<string>('at-a-glance');


  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? '' : section);
  };


  // Helper to pick the right localized string
  const localize = (en: string, hi: string, mr: string) => {
    if (isMarathi) return mr;
    if (isHindi) return hi;
    return en;
  };


  // For now hard-coded for PM-Kisan; you can later switch based on `id`
  const schemeTitle = localize(
    'PM-Kisan Samman Nidhi',
    'प्रधानमंत्री किसान सम्मान निधि',
    'प्रधानमंत्री किसान सन्मान निधी'
  );
  const schemeType = localize(
    'Central Govt • Direct Benefit',
    'केंद्र सरकार • प्रत्यक्ष लाभ',
    'केंद्र सरकार • थेट लाभ'
  );
  const deadline = localize('March 31', '31 मार्च', '31 मार्च');


  const eligibilityCriteria = [
    {
      met: true,
      textEn: 'Small/Marginal Farmer — Land < 2 hectares',
      textHi: 'लघु/सीमांत किसान — भूमि 2 हेक्टेयर से कम',
      textMr: 'अल्प/सीमांत शेतकरी — जमीन 2 हेक्टरपेक्षा कमी',
    },
    {
      met: true,
      textEn: 'Valid Aadhaar linked to bank',
      textHi: 'बैंक से लिंक आधार आवश्यक',
      textMr: 'बँकेशी लिंक केलेले वैध आधार',
    },
    {
      met: true,
      textEn: 'Active bank account',
      textHi: 'सक्रिय बैंक खाता',
      textMr: 'सक्रिय बँक खाते',
    },
    {
      met: 'warning' as const,
      textEn: 'Annual income below ₹1.5L — Update your profile to verify',
      textHi: 'वार्षिक आय ₹1.5 लाख से कम — सत्यापन के लिए प्रोफाइल अपडेट करें',
      textMr: 'वार्षिक उत्पन्न ₹1.5 लाखांपेक्षा कमी — पडताळणीसाठी प्रोफाइल अपडेट करा',
    },
    {
      met: false,
      textEn: 'Not a government employee',
      textHi: 'सरकारी कर्मचारी नहीं होना चाहिए',
      textMr: 'सरकारी कर्मचारी नसावा',
    },
  ];


  const documents = [
    {
      nameEn: 'Aadhaar Card',
      nameHi: 'आधार कार्ड',
      nameMr: 'आधार कार्ड',
      uploaded: userData.documents?.find((d) => d.id === 'aadhaar')?.status === 'uploaded',
    },
    {
      nameEn: 'Bank Passbook',
      nameHi: 'बैंक पासबुक',
      nameMr: 'बँक पासबुक',
      uploaded: userData.documents?.find((d) => d.id === 'bank')?.status === 'uploaded',
    },
    {
      nameEn: 'Land Records (7/12)',
      nameHi: 'भूमि रिकॉर्ड (7/12)',
      nameMr: 'जमीन नोंदी (7/12)',
      uploaded: userData.documents?.find((d) => d.id === 'land')?.status === 'uploaded',
    },
    {
      nameEn: 'Passport Photo',
      nameHi: 'पासपोर्ट फोटो',
      nameMr: 'पासपोर्ट फोटो',
      uploaded: userData.documents?.find((d) => d.id === 'photo')?.status === 'uploaded',
    },
  ];


  const steps = [
    {
      step: 1,
      textEn: 'Fill application form',
      textHi: 'आवेदन फॉर्म भरें',
      textMr: 'अर्ज भरा',
      timeEn: '5 minutes',
      timeHi: '5 मिनट',
      timeMr: '5 मिनिटे',
    },
    {
      step: 2,
      textEn: 'Upload 4 documents',
      textHi: '4 दस्तावेज़ अपलोड करें',
      textMr: '4 कागदपत्रे अपलोड करा',
      timeEn: '3 minutes',
      timeHi: '3 मिनट',
      timeMr: '3 मिनिटे',
    },
    {
      step: 3,
      textEn: 'Submit online / via CSC',
      textHi: 'ऑनलाइन / CSC के माध्यम से जमा करें',
      textMr: 'ऑनलाइन / CSC द्वारे सबमिट करा',
      timeEn: '2 minutes',
      timeHi: '2 मिनट',
      timeMr: '2 मिनिटे',
    },
    {
      step: 4,
      textEn: 'Track approval status',
      textHi: 'स्वीकृति स्थिति ट्रैक करें',
      textMr: 'मंजुरी स्थिती ट्रॅक करा',
      timeEn: 'Instant',
      timeHi: 'तुरंत',
      timeMr: 'तात्काळ',
    },
  ];


  const isEligibleText = localize('You are eligible', 'आप पात्र हैं', 'तुम्ही पात्र आहात');


  return (
    <div className="min-h-screen bg-[#F7F3EE] pb-24">
      {/* Header with gradient similar to Dashboard */}
      <div className="bg-gradient-to-b from-[#1A3C1A] to-[#2D6A2D] pt-10 pb-6 px-4">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <h2 className="text-white font-semibold text-[16px]">
            {localize('Scheme Details', 'योजना विवरण', 'योजना तपशील')}
          </h2>
          <div className="w-9" />
        </div>


        {/* Scheme Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="bg-white/10 backdrop-blur-sm rounded-3xl p-4 border border-white/10"
        >
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-2xl flex-shrink-0 border-2 border-[#F5A623]">
              🏛️
            </div>
            <div className="flex-1">
              <h1 className="font-bold text-white text-[18px] leading-snug">
                {schemeTitle}
              </h1>
              <p className="text-[#C8D8C8] text-[13px] mt-1">
                {schemeType}
              </p>
              <div className="flex gap-2 flex-wrap mt-2">
                <span className="bg-[#2D6A2D] text-white px-2.5 py-1 rounded-full text-[10px] font-semibold">
                  {localize('Central Govt', 'केंद्र सरकार', 'केंद्र सरकार')}
                </span>
                <span className="bg-[#2D6A2D] text-white px-2.5 py-1 rounded-full text-[10px] font-semibold">
                  {localize('Direct Benefit', 'प्रत्यक्ष लाभ', 'थेट लाभ')}
                </span>
              </div>
            </div>
            <div className="bg-[#97BC62] px-3 py-1 rounded-full text-[#1A3C1A] text-[10px] font-semibold whitespace-nowrap flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              {isEligibleText}
            </div>
          </div>
        </motion.div>
      </div>


      <div className="px-4 pt-4 space-y-4">
        {/* At a Glance Section */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-[15px] text-[#1C1C1E]">
              {localize('At a Glance', 'मुख्य जानकारी', 'एका नजरेत')}
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {/* Amount */}
            <div className="bg-[#F7F3EE] rounded-2xl p-3 text-center">
              <div className="w-10 h-10 rounded-full bg-[#F5A623]/20 flex items-center justify-center mx-auto mb-2">
                <IndianRupee className="w-5 h-5 text-[#F5A623]" />
              </div>
              <div className="font-bold text-[18px] text-[#1C1C1E]">₹6,000</div>
              <div className="text-[11px] text-[#6B7280]">
                {localize(
                  'Per year (3 installments)',
                  'प्रति वर्ष (3 किश्तों में)',
                  'दर वर्षी (3 हप्त्यांमध्ये)'
                )}
              </div>
            </div>


            {/* Deadline */}
            <div className="bg-[#F7F3EE] rounded-2xl p-3 text-center">
              <div className="w-10 h-10 rounded-full bg-[#FB923C]/20 flex items-center justify-center mx-auto mb-2">
                <Calendar className="w-5 h-5 text-[#FB923C]" />
              </div>
              <div className="font-bold text-[16px] text-[#1C1C1E]">
                {deadline}
              </div>
              <div className="text-[11px] text-[#6B7280]">
                {localize('Deadline', 'आखिरी तारीख', 'अंतिम तारीख')}
              </div>
            </div>


            {/* Documents */}
            <div className="bg-[#F7F3EE] rounded-2xl p-3 text-center">
              <div className="w-10 h-10 rounded-full bg-[#60A5FA]/20 flex items-center justify-center mx-auto mb-2">
                <FileText className="w-5 h-5 text-[#60A5FA]" />
              </div>
              <div className="font-bold text-[18px] text-[#1C1C1E]">3</div>
              <div className="text-[11px] text-[#6B7280]">
                {localize('Documents Required', 'जरूरी दस्तावेज़', 'आवश्यक कागदपत्रे')}
              </div>
            </div>


            {/* Processing */}
            <div className="bg-[#F7F3EE] rounded-2xl p-3 text-center">
              <div className="w-10 h-10 rounded-full bg-[#97BC62]/20 flex items-center justify-center mx-auto mb-2">
                <Clock className="w-5 h-5 text-[#97BC62]" />
              </div>
              <div className="font-bold text-[16px] text-[#1C1C1E]">
                {localize('15 days', '15 दिन', '15 दिवस')}
              </div>
              <div className="text-[11px] text-[#6B7280]">
                {localize('Processing Time', 'प्रोसेसिंग समय', 'प्रक्रिया कालावधी')}
              </div>
            </div>
          </div>
        </motion.div>


        {/* Eligibility Criteria */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100"
        >
          <button
            onClick={() => toggleSection('eligibility')}
            className="w-full flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-[15px] text-[#1C1C1E]">
                {localize('Eligibility Criteria', 'पात्रता मानदंड', 'पात्रता निकष')}
              </h2>
              <span className="bg-[#97BC62]/15 text-[#2D6A2D] px-2 py-0.5 rounded-full text-[11px] font-medium">
                {localize(
                  'You meet 5/6 criteria',
                  'आप 5/6 शर्तें पूरी करते हैं',
                  'तुम्ही 5/6 अटी पूर्ण करता'
                )}
              </span>
            </div>
            {expandedSection === 'eligibility' ? (
              <ChevronUp className="w-5 h-5 text-[#6B7280]" />
            ) : (
              <ChevronDown className="w-5 h-5 text-[#6B7280]" />
            )}
          </button>


          <AnimatePresence>
            {expandedSection === 'eligibility' && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="overflow-hidden"
              >
                <div className="space-y-2 mt-4">
                  {eligibilityCriteria.map((criteria, index) => {
                    const isMet = criteria.met === true;
                    const isWarn = criteria.met === 'warning';
                    const icon =
                      criteria.met === true ? '✅' : criteria.met === 'warning' ? '⚠️' : '❌';
                    const text = localize(criteria.textEn, criteria.textHi, criteria.textMr);


                    return (
                      <div key={index} className="flex items-start gap-2">
                        <span className="mt-0.5">{icon}</span>
                        <span
                          className={`text-[13px] ${isMet
                            ? 'text-[#1C1C1E]'
                            : isWarn
                              ? 'text-[#FB923C]'
                              : 'text-[#6B7280]'
                            }`}
                        >
                          {text}
                        </span>
                      </div>
                    );
                  })}


                  <div className="bg-[#FFF4E6] border border-[#FB923C] rounded-2xl p-3 mt-3 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-[#FB923C] mt-0.5" />
                    <div>
                      <p className="text-[12px] text-[#FB923C] font-medium">
                        {localize(
                          'Update your profile for accurate eligibility',
                          'सटीक पात्रता के लिए अपनी प्रोफ़ाइल अपडेट करें',
                          'अचूक पात्रतेसाठी तुमचे प्रोफाइल अपडेट करा'
                        )}
                      </p>
                      <button
                        onClick={() => navigate('/profile')}
                        className="text-[#FB923C] text-[12px] font-semibold mt-1 underline"
                      >
                        {localize('Update Profile →', 'प्रोफ़ाइल अपडेट करें →', 'प्रोफाइल अपडेट करा →')}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>


        {/* Required Documents */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100"
        >
          <button
            onClick={() => toggleSection('documents')}
            className="w-full flex items-center justify-between"
          >
            <h2 className="font-bold text-[15px] text-[#1C1C1E]">
              {localize('Required Documents', 'आवश्यक दस्तावेज़', 'आवश्यक कागदपत्रे')}
            </h2>
            {expandedSection === 'documents' ? (
              <ChevronUp className="w-5 h-5 text-[#6B7280]" />
            ) : (
              <ChevronDown className="w-5 h-5 text-[#6B7280]" />
            )}
          </button>


          <AnimatePresence>
            {expandedSection === 'documents' && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="overflow-hidden"
              >
                <div className="space-y-2 mt-4">
                  {documents.map((doc, index) => (
                    <div key={index} className="flex items-center gap-2 py-1.5">
                      <div
                        className={`w-4 h-4 rounded ${doc.uploaded ? 'bg-[#97BC62]' : 'border-2 border-gray-300'
                          } flex items-center justify-center`}
                      >
                        {doc.uploaded && (
                          <span className="text-white text-[10px] font-bold">✓</span>
                        )}
                      </div>
                      <span
                        className={`text-[13px] flex-1 ${doc.uploaded ? 'text-[#1C1C1E]' : 'text-[#6B7280]'
                          }`}
                      >
                        {localize(doc.nameEn, doc.nameHi, doc.nameMr)}
                      </span>
                      <span
                        className={`text-[11px] ${doc.uploaded ? 'text-[#97BC62]' : 'text-[#F5A623]'
                          }`}
                      >
                        {doc.uploaded
                          ? localize('Uploaded', 'अपलोडेड', 'अपलोड केले')
                          : localize('Upload', 'अपलोड करें', 'अपलोड करा')}
                      </span>
                    </div>
                  ))}
                  <button
                    onClick={() => navigate('/profile')}
                    className="w-full mt-3 py-2.5 border border-[#F5A623] text-[#F5A623] rounded-2xl font-semibold text-[13px]"
                  >
                    {localize('Upload Documents', 'दस्तावेज़ अपलोड करें', 'कागदपत्रे अपलोड करा')}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>


        {/* How to Apply */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100"
        >
          <button
            onClick={() => toggleSection('how-to-apply')}
            className="w-full flex items-center justify-between"
          >
            <h2 className="font-bold text-[15px] text-[#1C1C1E]">
              {localize('How to Apply', 'आवेदन कैसे करें', 'अर्ज कसा करावा')}
            </h2>
            {expandedSection === 'how-to-apply' ? (
              <ChevronUp className="w-5 h-5 text-[#6B7280]" />
            ) : (
              <ChevronDown className="w-5 h-5 text-[#6B7280]" />
            )}
          </button>


          <AnimatePresence>
            {expandedSection === 'how-to-apply' && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="overflow-hidden"
              >
                <div className="space-y-3 mt-4">
                  {steps.map((step) => (
                    <div key={step.step} className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#F5A623] text-white flex items-center justify-center font-bold text-[14px] flex-shrink-0">
                        {step.step}
                      </div>
                      <div className="flex-1">
                        <p className="text-[14px] text-[#1C1C1E] font-medium">
                          {localize(step.textEn, step.textHi, step.textMr)}
                        </p>
                        <p className="text-[12px] text-[#6B7280]">
                          {localize(step.timeEn, step.timeHi, step.timeMr)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>


        {/* Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 mb-4"
        >
          <h2 className="font-bold text-[15px] text-[#1C1C1E] mb-3">
            {localize('Benefits & Disbursement', 'लाभ और भुगतान', 'लाभ आणि वितरण')}
          </h2>
          <p className="text-[14px] text-[#1C1C1E] mb-2">
            {localize(
              '₹6,000 per year, in 3 installments of ₹2,000, directly to your bank account',
              '₹6,000 प्रति वर्ष, ₹2,000 की 3 किश्तों में सीधा बैंक खाते में',
              '₹6,000 दर वर्षी, ₹2,000 च्या 3 हप्त्यांमध्ये थेट तुमच्या बँक खात्यात'
            )}
          </p>
          <div className="bg-[#F7F3EE] rounded-2xl p-3 mb-2 flex items-center gap-2">
            <span className="text-[18px]">💳</span>
            <p className="text-[13px] text-[#2D6A2D] font-medium">
              {localize(
                'Direct Benefit Transfer (DBT)',
                'प्रत्यक्ष लाभ अंतरण (DBT)',
                'थेट लाभ हस्तांतरण (DBT)'
              )}
            </p>
          </div>
          <p className="text-[12px] text-[#97BC62]">
            {localize(
              'Last installment disbursed to 8.2 Cr farmers',
              'पिछली किस्त में 8.2 करोड़ किसानों को लाभ दिया गया',
              'शेवटचा हप्ता 8.2 कोटी शेतकऱ्यांना वितरित केला'
            )}
          </p>
        </motion.div>
      </div>


      {/* Sticky Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-200 p-4 flex gap-2 z-20">
        <button
          onClick={() => {/* save scheme / bookmark later */ }}
          className="flex-1 py-3 border border-gray-300 text-[#1C1C1E] rounded-xl font-medium text-[13px] flex items-center justify-center gap-1"
        >
          💾 {localize('Save', 'सेव करें', 'जतन करा')}
        </button>
        <button
          onClick={() => navigate(`/apply/${id}`)}
          className="flex-1 py-3 bg-[#F5A623] text-white rounded-xl font-bold text-[14px]"
        >
          {localize('Apply Now', 'आवेदन करें', 'आता अर्ज करा')}
        </button>
      </div>
    </div>
  );
}
