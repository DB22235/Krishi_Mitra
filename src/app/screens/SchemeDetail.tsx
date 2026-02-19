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


  const [expandedSection, setExpandedSection] = useState<string>('at-a-glance');


  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? '' : section);
  };


  // For now hard-coded for PM-Kisan; you can later switch based on `id`
  const schemeTitleEn = 'PM-Kisan Samman Nidhi';
  const schemeTitleHi = 'प्रधानमंत्री किसान सम्मान निधि';
  const schemeTypeEn = 'Central Govt • Direct Benefit';
  const schemeTypeHi = 'केंद्र सरकार • प्रत्यक्ष लाभ';
  const deadlineEn = 'March 31';
  const deadlineHi = '31 मार्च';


  const eligibilityCriteria = [
    {
      met: true,
      textEn: 'Small/Marginal Farmer — Land < 2 hectares',
      textHi: 'लघु/सीमांत किसान — भूमि 2 हेक्टेयर से कम',
    },
    {
      met: true,
      textEn: 'Valid Aadhaar linked to bank',
      textHi: 'बैंक से लिंक आधार आवश्यक',
    },
    {
      met: true,
      textEn: 'Active bank account',
      textHi: 'सक्रिय बैंक खाता',
    },
    {
      met: 'warning' as const,
      textEn: 'Annual income below ₹1.5L — Update your profile to verify',
      textHi: 'वार्षिक आय ₹1.5 लाख से कम — सत्यापन के लिए प्रोफाइल अपडेट करें',
    },
    {
      met: false,
      textEn: 'Not a government employee',
      textHi: 'सरकारी कर्मचारी नहीं होना चाहिए',
    },
  ];


  const documents = [
    {
      nameEn: 'Aadhaar Card',
      nameHi: 'आधार कार्ड',
      uploaded: userData.documents?.find((d) => d.id === 'aadhaar')?.status === 'uploaded',
    },
    {
      nameEn: 'Bank Passbook',
      nameHi: 'बैंक पासबुक',
      uploaded: userData.documents?.find((d) => d.id === 'bank')?.status === 'uploaded',
    },
    {
      nameEn: 'Land Records (7/12)',
      nameHi: 'भूमि रिकॉर्ड (7/12)',
      uploaded: userData.documents?.find((d) => d.id === 'land')?.status === 'uploaded',
    },
    {
      nameEn: 'Passport Photo',
      nameHi: 'पासपोर्ट फोटो',
      uploaded: userData.documents?.find((d) => d.id === 'photo')?.status === 'uploaded',
    },
  ];


  const steps = [
    {
      step: 1,
      textEn: 'Fill application form',
      textHi: 'आवेदन फॉर्म भरें',
      timeEn: '5 minutes',
      timeHi: '5 मिनट',
    },
    {
      step: 2,
      textEn: 'Upload 4 documents',
      textHi: '4 दस्तावेज़ अपलोड करें',
      timeEn: '3 minutes',
      timeHi: '3 मिनट',
    },
    {
      step: 3,
      textEn: 'Submit online / via CSC',
      textHi: 'ऑनलाइन / CSC के माध्यम से जमा करें',
      timeEn: '2 minutes',
      timeHi: '2 मिनट',
    },
    {
      step: 4,
      textEn: 'Track approval status',
      textHi: 'स्वीकृति स्थिति ट्रैक करें',
      timeEn: 'Instant',
      timeHi: 'तुरंत',
    },
  ];


  const isEligibleText = isHindi ? 'आप पात्र हैं' : 'You are eligible';


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
            {isHindi ? 'योजना विवरण' : 'Scheme Details'}
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
                {isHindi ? schemeTitleHi : schemeTitleEn}
              </h1>
              <p className="text-[#C8D8C8] text-[13px] mt-1">
                {isHindi ? schemeTypeHi : schemeTypeEn}
              </p>
              <div className="flex gap-2 flex-wrap mt-2">
                <span className="bg-[#2D6A2D] text-white px-2.5 py-1 rounded-full text-[10px] font-semibold">
                  {isHindi ? 'केंद्र सरकार' : 'Central Govt'}
                </span>
                <span className="bg-[#2D6A2D] text-white px-2.5 py-1 rounded-full text-[10px] font-semibold">
                  {isHindi ? 'प्रत्यक्ष लाभ' : 'Direct Benefit'}
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
              {isHindi ? 'मुख्य जानकारी' : 'At a Glance'}
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
                {isHindi ? 'प्रति वर्ष (3 किश्तों में)' : 'Per year (3 installments)'}
              </div>
            </div>


            {/* Deadline */}
            <div className="bg-[#F7F3EE] rounded-2xl p-3 text-center">
              <div className="w-10 h-10 rounded-full bg-[#FB923C]/20 flex items-center justify-center mx-auto mb-2">
                <Calendar className="w-5 h-5 text-[#FB923C]" />
              </div>
              <div className="font-bold text-[16px] text-[#1C1C1E]">
                {isHindi ? deadlineHi : deadlineEn}
              </div>
              <div className="text-[11px] text-[#6B7280]">
                {isHindi ? 'आखिरी तारीख' : 'Deadline'}
              </div>
            </div>


            {/* Documents */}
            <div className="bg-[#F7F3EE] rounded-2xl p-3 text-center">
              <div className="w-10 h-10 rounded-full bg-[#60A5FA]/20 flex items-center justify-center mx-auto mb-2">
                <FileText className="w-5 h-5 text-[#60A5FA]" />
              </div>
              <div className="font-bold text-[18px] text-[#1C1C1E]">3</div>
              <div className="text-[11px] text-[#6B7280]">
                {isHindi ? 'जरूरी दस्तावेज़' : 'Documents Required'}
              </div>
            </div>


            {/* Processing */}
            <div className="bg-[#F7F3EE] rounded-2xl p-3 text-center">
              <div className="w-10 h-10 rounded-full bg-[#97BC62]/20 flex items-center justify-center mx-auto mb-2">
                <Clock className="w-5 h-5 text-[#97BC62]" />
              </div>
              <div className="font-bold text-[16px] text-[#1C1C1E]">
                {isHindi ? '15 दिन' : '15 days'}
              </div>
              <div className="text-[11px] text-[#6B7280]">
                {isHindi ? 'प्रोसेसिंग समय' : 'Processing Time'}
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
                {isHindi ? 'पात्रता मानदंड' : 'Eligibility Criteria'}
              </h2>
              <span className="bg-[#97BC62]/15 text-[#2D6A2D] px-2 py-0.5 rounded-full text-[11px] font-medium">
                {isHindi ? 'आप 5/6 शर्तें पूरी करते हैं' : 'You meet 5/6 criteria'}
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
                    const text = isHindi ? criteria.textHi : criteria.textEn;


                    return (
                      <div key={index} className="flex items-start gap-2">
                        <span className="mt-0.5">{icon}</span>
                        <span
                          className={`text-[13px] ${
                            isMet
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
                        {isHindi
                          ? 'सटीक पात्रता के लिए अपनी प्रोफ़ाइल अपडेट करें'
                          : 'Update your profile for accurate eligibility'}
                      </p>
                      <button
                        onClick={() => navigate('/profile')}
                        className="text-[#FB923C] text-[12px] font-semibold mt-1 underline"
                      >
                        {isHindi ? 'प्रोफ़ाइल अपडेट करें →' : 'Update Profile →'}
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
              {isHindi ? 'आवश्यक दस्तावेज़' : 'Required Documents'}
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
                        className={`w-4 h-4 rounded ${
                          doc.uploaded ? 'bg-[#97BC62]' : 'border-2 border-gray-300'
                        } flex items-center justify-center`}
                      >
                        {doc.uploaded && (
                          <span className="text-white text-[10px] font-bold">✓</span>
                        )}
                      </div>
                      <span
                        className={`text-[13px] flex-1 ${
                          doc.uploaded ? 'text-[#1C1C1E]' : 'text-[#6B7280]'
                        }`}
                      >
                        {isHindi ? doc.nameHi : doc.nameEn}
                      </span>
                      <span
                        className={`text-[11px] ${
                          doc.uploaded ? 'text-[#97BC62]' : 'text-[#F5A623]'
                        }`}
                      >
                        {doc.uploaded
                          ? isHindi
                            ? 'अपलोडेड'
                            : 'Uploaded'
                          : isHindi
                          ? 'अपलोड करें'
                          : 'Upload'}
                      </span>
                    </div>
                  ))}
                  <button
                    onClick={() => navigate('/profile')}
                    className="w-full mt-3 py-2.5 border border-[#F5A623] text-[#F5A623] rounded-2xl font-semibold text-[13px]"
                  >
                    {isHindi ? 'दस्तावेज़ अपलोड करें' : 'Upload Documents'}
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
              {isHindi ? 'आवेदन कैसे करें' : 'How to Apply'}
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
                          {isHindi ? step.textHi : step.textEn}
                        </p>
                        <p className="text-[12px] text-[#6B7280]">
                          {isHindi ? step.timeHi : step.timeEn}
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
            {isHindi ? 'लाभ और भुगतान' : 'Benefits & Disbursement'}
          </h2>
          <p className="text-[14px] text-[#1C1C1E] mb-2">
            {isHindi
              ? '₹6,000 प्रति वर्ष, ₹2,000 की 3 किश्तों में सीधा बैंक खाते में'
              : '₹6,000 per year, in 3 installments of ₹2,000, directly to your bank account'}
          </p>
          <div className="bg-[#F7F3EE] rounded-2xl p-3 mb-2 flex items-center gap-2">
            <span className="text-[18px]">💳</span>
            <p className="text-[13px] text-[#2D6A2D] font-medium">
              {isHindi ? 'प्रत्यक्ष लाभ अंतरण (DBT)' : 'Direct Benefit Transfer (DBT)'}
            </p>
          </div>
          <p className="text-[12px] text-[#97BC62]">
            {isHindi
              ? 'पिछली किस्त में 8.2 करोड़ किसानों को लाभ दिया गया'
              : 'Last installment disbursed to 8.2 Cr farmers'}
          </p>
        </motion.div>
      </div>


      {/* Sticky Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-200 p-4 flex gap-2 z-20">
        <button
          onClick={() => {/* save scheme / bookmark later */}}
          className="flex-1 py-3 border border-gray-300 text-[#1C1C1E] rounded-xl font-medium text-[13px] flex items-center justify-center gap-1"
        >
          💾 {isHindi ? 'सेव करें' : 'Save'}
        </button>
        <button
          onClick={() => navigate(`/apply/${id}`)}
          className="flex-1 py-3 bg-[#F5A623] text-white rounded-xl font-bold text-[14px]"
        >
          {isHindi ? 'आवेदन करें' : 'Apply Now'}
        </button>
      </div>
    </div>
  );
}
