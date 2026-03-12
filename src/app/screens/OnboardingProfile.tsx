
// src/screens/OnboardingProfile.tsx
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Mic, MicOff, Phone, FileText, Calendar, Globe, Sparkles, AlertCircle, X, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../../context/LanguageContext';
import { useUser } from '../../context/UserContext';

type VoiceField = 'name' | 'age' | 'mobile' | null;

export function OnboardingProfile() {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { userData, updateUserData } = useUser();
  const isHindi = language === 'hi';
  const isMarathi = language === 'mr';

  // Helper to pick the right localized string
  const localize = (en: string, hi: string, mr: string) => {
    if (isMarathi) return mr;
    if (isHindi) return hi;
    return en;
  };

  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [isVoiceSupported, setIsVoiceSupported] = useState(true);
  const [voiceError, setVoiceError] = useState('');
  const [activeVoiceField, setActiveVoiceField] = useState<VoiceField>(null);
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [isFetchingNumber, setIsFetchingNumber] = useState(false);
  const [numberDetected, setNumberDetected] = useState(false);
  const [showValidationError, setShowValidationError] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const recognitionRef = useRef<any>(null);
  const transcriptRef = useRef('');

  const [formData, setFormData] = useState({
    name: userData.name || '',
    age: userData.age || '',
    gender: userData.gender || '',
    mobile: userData.mobile || '',
  });

  // Check if form is complete
  const isFormComplete = () => {
    return (
      formData.name.trim() !== '' &&
      formData.age.trim() !== '' &&
      formData.gender !== '' &&
      formData.mobile.trim() !== '' &&
      formData.mobile.length >= 10
    );
  };

  // Get validation errors
  const getValidationErrors = () => {
    const errors: string[] = [];
    if (!formData.name.trim()) {
      errors.push(localize('Enter your name', 'नाम दर्ज करें', 'तुमचे नाव टाका'));
    }
    if (!formData.age.trim()) {
      errors.push(localize('Enter your age', 'उम्र दर्ज करें', 'तुमचे वय टाका'));
    } else if (parseInt(formData.age) < 18 || parseInt(formData.age) > 120) {
      errors.push(localize('Age must be between 18-120', 'उम्र 18-120 के बीच होनी चाहिए', 'वय 18-120 दरम्यान असावे'));
    }
    if (!formData.gender) {
      errors.push(localize('Select gender', 'लिंग चुनें', 'लिंग निवडा'));
    }
    if (!formData.mobile.trim()) {
      errors.push(localize('Enter mobile number', 'मोबाइल नंबर दर्ज करें', 'मोबाइल नंबर टाका'));
    } else if (formData.mobile.length < 10) {
      errors.push(localize('Mobile number must be 10 digits', 'मोबाइल नंबर 10 अंकों का होना चाहिए', 'मोबाइल नंबर 10 अंकी असावा'));
    }
    return errors;
  };

  // Get completion percentage
  const getCompletionPercent = () => {
    let filled = 0;
    if (formData.name.trim()) filled += 25;
    if (formData.age.trim()) filled += 25;
    if (formData.gender) filled += 25;
    if (formData.mobile.trim() && formData.mobile.length >= 10) filled += 25;
    return filled;
  };

  // Check if field is valid
  const isFieldValid = (field: string) => {
    switch (field) {
      case 'name':
        return formData.name.trim() !== '';
      case 'age':
        return formData.age.trim() !== '' && parseInt(formData.age) >= 18 && parseInt(formData.age) <= 120;
      case 'gender':
        return formData.gender !== '';
      case 'mobile':
        return formData.mobile.trim() !== '' && formData.mobile.length >= 10;
      default:
        return false;
    }
  };

  // Initialize Speech Recognition
  useEffect(() => {
    try {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (!SpeechRecognition) {
        setIsVoiceSupported(false);
        return;
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      // Set language for speech recognition
      recognition.lang = isMarathi ? 'mr-IN' : isHindi ? 'hi-IN' : 'en-US';

      recognition.onstart = () => setVoiceError('');

      recognition.onresult = (event: any) => {
        try {
          let interimTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              setVoiceTranscript(transcript);
              transcriptRef.current = transcript;
            } else {
              interimTranscript += transcript;
            }
          }
          if (interimTranscript) setVoiceTranscript(interimTranscript);
        } catch (e) {
          console.error('Error processing results:', e);
        }
      };

      recognition.onend = () => {
        setIsVoiceActive(false);
        if (transcriptRef.current) {
          processVoiceInput(transcriptRef.current);
          transcriptRef.current = '';
        }
      };

      recognition.onerror = (event: any) => {
        setIsVoiceActive(false);
        let errorMsg = '';
        switch (event.error) {
          case 'no-speech':
            errorMsg = localize('No speech detected', 'कोई आवाज़ नहीं मिली', 'आवाज ऐकू आला नाही');
            break;
          case 'not-allowed':
            errorMsg = localize('Allow microphone permission', 'माइक्रोफ़ोन की अनुमति दें', 'मायक्रोफोन परवानगी द्या');
            break;
          default:
            errorMsg = localize('Voice input failed', 'वॉइस इनपुट विफल', 'व्हॉइस इनपुट अयशस्वी');
        }
        setVoiceError(errorMsg);
        setTimeout(() => setVoiceError(''), 4000);
      };

      recognitionRef.current = recognition;
    } catch (error) {
      setIsVoiceSupported(false);
    }

    return () => {
      try {
        recognitionRef.current?.abort();
      } catch (e) { }
    };
  }, [language, isHindi, isMarathi]);

  // Process voice input
  const processVoiceInput = (transcript: string) => {
    if (!transcript.trim()) return;
    const cleanedText = transcript.trim();

    // Hindi and Marathi use the same Devanagari numerals
    const hindiNumbers: Record<string, string> = {
      '०': '0', '१': '1', '२': '2', '३': '3', '४': '4',
      '५': '5', '६': '6', '७': '7', '८': '8', '९': '9',
    };

    let converted = cleanedText;
    Object.entries(hindiNumbers).forEach(([hindi, english]) => {
      converted = converted.replace(new RegExp(hindi, 'g'), english);
    });

    switch (activeVoiceField) {
      case 'name':
        setFormData((prev) => ({ ...prev, name: cleanedText }));
        break;
      case 'age': {
        const ageMatch = converted.match(/\d+/);
        if (ageMatch) {
          const age = parseInt(ageMatch[0]);
          if (age > 0 && age < 150) {
            setFormData((prev) => ({ ...prev, age: age.toString() }));
          }
        }
        break;
      }
      case 'mobile': {
        const digits = converted.replace(/\D/g, '');
        if (digits.length >= 10) {
          setFormData((prev) => ({ ...prev, mobile: digits.slice(-10) }));
        } else if (digits.length > 0) {
          setFormData((prev) => ({ ...prev, mobile: digits }));
        }
        break;
      }
      default: {
        const numbers = converted.replace(/\D/g, '');
        if (numbers.length >= 10) {
          setFormData((prev) => ({ ...prev, mobile: numbers.slice(-10) }));
        } else if (numbers.length > 0 && parseInt(numbers) < 150) {
          setFormData((prev) => ({ ...prev, age: numbers }));
        } else {
          setFormData((prev) => ({ ...prev, name: cleanedText }));
        }
        break;
      }
    }

    setVoiceTranscript('');
    setActiveVoiceField(null);
  };

  // Start voice input
  const startVoiceInput = (field: VoiceField = null) => {
    if (!isVoiceSupported) {
      setVoiceError(localize('Voice input not available', 'वॉइस इनपुट उपलब्ध नहीं', 'व्हॉइस इनपुट उपलब्ध नाही'));
      setTimeout(() => setVoiceError(''), 4000);
      return;
    }

    if (isVoiceActive) {
      stopVoiceInput();
      return;
    }

    try {
      setActiveVoiceField(field);
      setVoiceTranscript('');
      setVoiceError('');
      transcriptRef.current = '';

      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then(() => {
          recognitionRef.current?.start();
          setIsVoiceActive(true);
        })
        .catch(() => {
          setVoiceError(localize('Allow microphone permission', 'माइक्रोफ़ोन की अनुमति दें', 'मायक्रोफोन परवानगी द्या'));
          setTimeout(() => setVoiceError(''), 4000);
        });
    } catch (error) {
      setVoiceError(localize('Failed to start voice', 'वॉइस शुरू नहीं हो सका', 'व्हॉइस सुरू होऊ शकले नाही'));
      setTimeout(() => setVoiceError(''), 4000);
    }
  };

  // Stop voice input
  const stopVoiceInput = () => {
    try {
      recognitionRef.current?.stop();
    } catch (e) { }
    setIsVoiceActive(false);
  };

  // Fetch phone number
  useEffect(() => {
    const tryFetchNumber = async () => {
      setIsFetchingNumber(true);
      try {
        if ('contacts' in navigator && 'ContactsManager' in window) {
          const contacts = await (navigator as any).contacts.select(['tel'], { multiple: false });
          if (contacts.length > 0 && contacts[0].tel?.length > 0) {
            setFormData((prev) => ({ ...prev, mobile: contacts[0].tel[0] }));
            setNumberDetected(true);
          }
        }
      } catch (err) { }
      finally {
        setIsFetchingNumber(false);
      }
    };
    tryFetchNumber();
  }, []);

  // Handle continue
  const handleContinue = async () => {
    const errors = getValidationErrors();
    if (errors.length > 0) {
      setValidationErrors(errors);
      setShowValidationError(true);
      setTimeout(() => setShowValidationError(false), 5000);
      return;
    }

    // Save to context
    const updatedData = {
      name: formData.name,
      age: formData.age,
      gender: formData.gender,
      mobile: formData.mobile,
    };
    await updateUserData(updatedData);

    // Persist to backend
    try {
      const { saveProfile } = await import('../../utils/api');
      await saveProfile(updatedData);
    } catch (err) {
      console.warn('Could not save profile to backend:', err);
    }

    navigate('/onboarding/farm-details');
  };

  const inputClass =
    'w-full px-4 py-3.5 bg-[#F7F3EE] rounded-2xl border-2 border-transparent outline-none focus:border-[#F5A623] focus:bg-white transition-all duration-200 text-[15px] text-[#1C1C1E] placeholder:text-gray-400';

  const labelClass =
    'flex items-center gap-1.5 text-[12px] font-semibold text-[#6B7280] uppercase tracking-wider mb-2';

  const completionPercent = getCompletionPercent();

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
            {localize('Step 1 of 3 — Basic Details', 'चरण 1 / 3 — बुनियादी जानकारी', 'पायरी 1 / 3 — मूलभूत माहिती')}
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
              className={`flex-1 h-1.5 rounded-full ${step === 1 ? 'bg-[#F5A623]' : 'bg-gray-100'
                }`}
            />
          ))}
        </div>
      </div>

      {/* Validation Error Toast */}
      <AnimatePresence>
        {showValidationError && validationErrors.length > 0 && (
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
                  {localize('Please fill all details', 'कृपया सभी जानकारी भरें', 'कृपया सर्व माहिती भरा')}
                </p>
                <ul className="space-y-0.5">
                  {validationErrors.map((error, index) => (
                    <li key={index} className="text-[12px] text-red-600 flex items-center gap-1">
                      <span>•</span> {error}
                    </li>
                  ))}
                </ul>
              </div>
              <button onClick={() => setShowValidationError(false)}>
                <X className="w-4 h-4 text-red-400" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Voice Error Toast */}
      <AnimatePresence>
        {voiceError && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mx-4 mt-3 bg-orange-50 border border-orange-200 rounded-2xl p-4 flex items-start gap-3"
          >
            <AlertCircle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
            <p className="text-[12px] text-orange-700 flex-1">{voiceError}</p>
            <button onClick={() => setVoiceError('')}>
              <X className="w-4 h-4 text-orange-400" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-28">

        {/* Header */}
        <div className="px-6 py-6">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-5 h-5 text-[#F5A623]" />
              <h1 className="text-[22px] font-bold text-[#1C1C1E]">
                {localize("Let's get you started!", 'आपका स्वागत है!', 'चला सुरू करूया!')}
              </h1>
            </div>
            <p className="text-[14px] text-[#6B7280] leading-relaxed">
              {localize(
                'Tell us a bit about yourself to find the best schemes for you.',
                'आपके लिए सबसे अच्छी योजनाएं खोजने के लिए कुछ जानकारी दें।',
                'तुमच्यासाठी सर्वोत्तम योजना शोधण्यासाठी थोडी माहिती द्या.'
              )}
            </p>
          </motion.div>

          {/* Completion Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-4 bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[12px] font-medium text-[#6B7280]">
                {localize('Completion', 'पूर्णता', 'पूर्णता')}
              </span>
              <span className={`text-[14px] font-bold ${completionPercent === 100 ? 'text-green-500' : 'text-[#F5A623]'
                }`}>
                {completionPercent}%
              </span>
            </div>
            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${completionPercent}%` }}
                transition={{ duration: 0.5 }}
                className={`h-full rounded-full ${completionPercent === 100 ? 'bg-green-500' : 'bg-[#F5A623]'
                  }`}
              />
            </div>
            <div className="flex justify-between mt-2">
              {['name', 'age', 'gender', 'mobile'].map((field) => (
                <div
                  key={field}
                  className={`w-6 h-6 rounded-full flex items-center justify-center ${isFieldValid(field)
                      ? 'bg-green-100'
                      : 'bg-gray-100'
                    }`}
                >
                  {isFieldValid(field) ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-gray-300" />
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Main Card */}
        <div className="px-6 mb-5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden"
          >
            {/* Voice Button */}
            <div className="px-6 pt-6 pb-5">
              <motion.button
                onClick={() => startVoiceInput(null)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 ${isVoiceActive && !activeVoiceField
                    ? 'bg-[#FFF4E0] border-2 border-[#F5A623]'
                    : 'bg-[#F7F3EE] border-2 border-transparent'
                  }`}
              >
                <motion.div
                  animate={
                    isVoiceActive && !activeVoiceField
                      ? {
                        scale: [1, 1.15, 1],
                        boxShadow: [
                          '0 0 0px #F5A62300',
                          '0 0 20px #F5A62366',
                          '0 0 0px #F5A62300',
                        ],
                      }
                      : {}
                  }
                  transition={{ repeat: Infinity, duration: 1.4 }}
                  className={`w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 ${isVoiceActive && !activeVoiceField
                      ? 'bg-[#F5A623]'
                      : isVoiceSupported
                        ? 'bg-white border-2 border-gray-200'
                        : 'bg-gray-100'
                    }`}
                >
                  {isVoiceActive && !activeVoiceField ? (
                    <Mic className="w-7 h-7 text-white" />
                  ) : (
                    <MicOff className="w-7 h-7 text-gray-400" />
                  )}
                </motion.div>

                <div className="text-left flex-1">
                  <p className={`text-[15px] font-semibold ${isVoiceActive && !activeVoiceField ? 'text-[#F5A623]' : 'text-[#1C1C1E]'
                    }`}>
                    {isVoiceActive && !activeVoiceField
                      ? localize('Listening... Tap to stop', 'सुन रहा हूँ... रोकने के लिए टैप करें', 'ऐकत आहे... थांबवण्यासाठी टॅप करा')
                      : isVoiceSupported
                        ? localize('Tap to speak your details', 'अपनी जानकारी बोलने के लिए टैप करें', 'तुमची माहिती बोलण्यासाठी टॅप करा')
                        : localize('Voice not available', 'वॉइस उपलब्ध नहीं', 'व्हॉइस उपलब्ध नाही')}
                  </p>

                  {isVoiceActive && !activeVoiceField && voiceTranscript && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-[13px] text-[#F5A623] mt-1 italic"
                    >
                      "{voiceTranscript}"
                    </motion.p>
                  )}

                  {isVoiceActive && !activeVoiceField && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex gap-1 mt-2"
                    >
                      {[1, 2, 3, 4, 5, 6, 7].map((bar) => (
                        <motion.div
                          key={bar}
                          animate={{ height: [4, 16, 4] }}
                          transition={{ repeat: Infinity, duration: 0.6, delay: bar * 0.08 }}
                          className="w-1 bg-[#F5A623] rounded-full"
                          style={{ height: 4 }}
                        />
                      ))}
                    </motion.div>
                  )}
                </div>

                {isVoiceActive && !activeVoiceField && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      stopVoiceInput();
                    }}
                  >
                    <div className="w-4 h-4 rounded-sm bg-white" />
                  </motion.div>
                )}
              </motion.button>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-4 px-6 mb-5">
              <div className="flex-1 h-px bg-gray-100" />
              <span className="text-[12px] font-medium text-gray-400">
                {localize('OR', 'या', 'किंवा')}
              </span>
              <div className="flex-1 h-px bg-gray-100" />
            </div>

            {/* Form Fields */}
            <div className="px-6 pb-6 space-y-5">

              {/* Name */}
              <div>
                <label className={labelClass}>
                  <FileText className="w-3.5 h-3.5" />
                  {localize('Full Name', 'पूरा नाम', 'पूर्ण नाव')}
                  <span className="text-red-500">*</span>
                  {isFieldValid('name') && <CheckCircle className="w-3.5 h-3.5 text-green-500 ml-auto" />}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder={localize('Enter your full name', 'अपना पूरा नाम लिखें', 'तुमचे पूर्ण नाव लिहा')}
                    className={`${inputClass} pr-12 ${!isFieldValid('name') && formData.name !== '' ? 'border-red-300' : ''
                      } ${isFieldValid('name') ? 'border-green-300 bg-green-50/30' : ''}`}
                  />
                  {isVoiceSupported && (
                    <button
                      onClick={() => startVoiceInput('name')}
                      className={`absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center transition-all ${isVoiceActive && activeVoiceField === 'name'
                          ? 'bg-[#F5A623]'
                          : 'bg-[#F7F3EE] hover:bg-[#F5A623]/20'
                        }`}
                    >
                      <Mic className={`w-4 h-4 ${isVoiceActive && activeVoiceField === 'name' ? 'text-white' : 'text-gray-400'
                        }`} />
                    </button>
                  )}
                </div>
              </div>

              {/* Age + Mobile */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>
                    <Calendar className="w-3.5 h-3.5" />
                    {localize('Age', 'उम्र', 'वय')}
                    <span className="text-red-500">*</span>
                    {isFieldValid('age') && <CheckCircle className="w-3.5 h-3.5 text-green-500 ml-auto" />}
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                      placeholder={localize('Your age', 'आपकी उम्र', 'तुमचे वय')}
                      min="18"
                      max="120"
                      className={`${inputClass} pr-12 ${formData.age && !isFieldValid('age') ? 'border-red-300' : ''
                        } ${isFieldValid('age') ? 'border-green-300 bg-green-50/30' : ''}`}
                    />
                    {isVoiceSupported && (
                      <button
                        onClick={() => startVoiceInput('age')}
                        className={`absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center transition-all ${isVoiceActive && activeVoiceField === 'age'
                            ? 'bg-[#F5A623]'
                            : 'bg-[#F7F3EE] hover:bg-[#F5A623]/20'
                          }`}
                      >
                        <Mic className={`w-4 h-4 ${isVoiceActive && activeVoiceField === 'age' ? 'text-white' : 'text-gray-400'
                          }`} />
                      </button>
                    )}
                  </div>
                </div>

                <div>
                  <label className={labelClass}>
                    <Phone className="w-3.5 h-3.5" />
                    {localize('Mobile', 'मोबाइल', 'मोबाइल')}
                    <span className="text-red-500">*</span>
                    {isFieldValid('mobile') && <CheckCircle className="w-3.5 h-3.5 text-green-500 ml-auto" />}
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      value={formData.mobile}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                        setFormData({ ...formData, mobile: value });
                      }}
                      placeholder={isFetchingNumber
                        ? localize('Detecting...', 'पता लगा रहा है...', 'शोधत आहे...')
                        : localize('Mobile number', 'मोबाइल नंबर', 'मोबाइल नंबर')}
                      autoComplete="tel"
                      maxLength={10}
                      className={`${inputClass} ${numberDetected ? 'pr-24' : 'pr-12'} ${formData.mobile && !isFieldValid('mobile') ? 'border-red-300' : ''
                        } ${isFieldValid('mobile') ? 'border-green-300 bg-green-50/30' : ''}`}
                    />
                    {isVoiceSupported && !numberDetected && !isFetchingNumber && (
                      <button
                        onClick={() => startVoiceInput('mobile')}
                        className={`absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center transition-all ${isVoiceActive && activeVoiceField === 'mobile'
                            ? 'bg-[#F5A623]'
                            : 'bg-[#F7F3EE] hover:bg-[#F5A623]/20'
                          }`}
                      >
                        <Mic className={`w-4 h-4 ${isVoiceActive && activeVoiceField === 'mobile' ? 'text-white' : 'text-gray-400'
                          }`} />
                      </button>
                    )}
                    <AnimatePresence>
                      {numberDetected && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] bg-[#97BC62] text-white px-2 py-1 rounded-full font-semibold"
                        >
                          {localize('✓ Detected', '✓ पहचाना', '✓ ओळखले')}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>

              {/* Gender */}
              <div>
                <label className={labelClass}>
                  <Globe className="w-3.5 h-3.5" />
                  {localize('Gender', 'लिंग', 'लिंग')}
                  <span className="text-red-500">*</span>
                  {isFieldValid('gender') && <CheckCircle className="w-3.5 h-3.5 text-green-500 ml-auto" />}
                </label>
                <div className="flex gap-2">
                  {[
                    { id: 'Male', en: 'Male', hi: 'पुरुष', mr: 'पुरुष' },
                    { id: 'Female', en: 'Female', hi: 'महिला', mr: 'स्त्री' },
                    { id: 'Other', en: 'Other', hi: 'अन्य', mr: 'इतर' },
                  ].map((gender) => (
                    <motion.button
                      key={gender.id}
                      onClick={() => setFormData({ ...formData, gender: gender.id })}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className={`flex-1 py-3 rounded-2xl font-semibold text-[14px] transition-all duration-200 border-2 ${formData.gender === gender.id
                          ? 'bg-[#F5A623] text-white border-[#F5A623] shadow-md shadow-[#F5A623]/20'
                          : 'bg-[#F7F3EE] text-[#6B7280] border-transparent hover:border-[#F5A623]/30'
                        }`}
                    >
                      {localize(gender.en, gender.hi, gender.mr)}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Info */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-[12px] text-center text-gray-400 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-[#F7F3EE]"
              >
                <AlertCircle className="w-3 h-3" />
                {localize(
                  'All fields marked (*) are required',
                  'सभी फ़ील्ड (*) अनिवार्य हैं',
                  'सर्व (*) चिन्हांकित फील्ड आवश्यक आहेत'
                )}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-gray-100 p-4 safe-area-bottom">
        <motion.button
          onClick={handleContinue}
          whileHover={{ scale: isFormComplete() ? 1.02 : 1 }}
          whileTap={{ scale: isFormComplete() ? 0.98 : 1 }}
          className={`w-full py-4 rounded-2xl font-bold text-[16px] transition-all flex items-center justify-center gap-2 ${isFormComplete()
              ? 'bg-[#F5A623] text-white shadow-lg shadow-[#F5A623]/30 hover:bg-[#E09515]'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
        >
          {isFormComplete() ? (
            <>
              {localize('Continue', 'आगे बढ़ें', 'पुढे चला')}
              <ArrowLeft className="w-5 h-5 rotate-180" />
            </>
          ) : (
            <>
              {localize('Fill all details', 'सभी जानकारी भरें', 'सर्व माहिती भरा')}
              <span className="text-[12px] bg-white/20 px-2 py-0.5 rounded-full">
                {completionPercent}%
              </span>
            </>
          )}
        </motion.button>
      </div>
    </div>
  );
}
