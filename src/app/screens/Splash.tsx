

// src/screens/Splash.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { useLanguage } from '../../context/LanguageContext';
// Logo is in public directory, referenced directly


const languages = [
  { code: 'hi' as const, name: 'हिंदी', nameEn: 'Hindi' },
  { code: 'en' as const, name: 'English', nameEn: 'English' },
];


export function Splash() {
  const { language, setLanguage, t } = useLanguage();
  const [currentTime, setCurrentTime] = useState(new Date());
  const navigate = useNavigate();


  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);


  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };


  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    });
  };


  const handleContinue = () => {
    navigate('/onboarding/profile');
  };


  return (
    <div className="min-h-screen bg-[#1A3C1A] flex flex-col items-center justify-between px-8 py-12">
      {/* Top status bar */}
      <div className="w-full text-white text-xs flex justify-start items-start mb-8">
        <div className="flex flex-col">
          <span className="font-bold text-[14px]">{formatTime(currentTime)}</span>
          <span className="text-[11px] text-[#97BC62]">{formatDate(currentTime)}</span>
        </div>
      </div>


      {/* Logo and branding */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center mb-12"
      >
        <div className="w-28 h-28 mb-4 rounded-full overflow-hidden flex items-center justify-center bg-white shadow-xl ring-4 ring-[#F5A623] ring-offset-2 ring-offset-[#1A3C1A]">
          <img
            src="/logo.png"
            alt="Krishi Mitra Logo"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.parentElement!.innerHTML = '<span class="text-5xl">🌾</span>';
            }}
          />
        </div>
        <h1 className="font-display font-bold text-white text-[32px] text-center mb-2">
          {t('Krishi Mitra')}
        </h1>
        <p className="text-[#97BC62] text-[16px] text-center">
          {t('Your Government Scheme Assistant')}
        </p>
      </motion.div>


      {/* Language selection */}
      <div className="w-full max-w-md flex-1 flex flex-col">
        <h3 className="text-white font-semibold text-[16px] text-center mb-6">
          {t('Select Language')}
        </h3>


        <div className="flex gap-6 justify-center mb-8">
          {languages.map((lang) => (
            <motion.button
              key={lang.code}
              onClick={() => setLanguage(lang.code)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`
                w-36 h-20 rounded-2xl flex flex-col items-center justify-center transition-all duration-300 relative
                ${
                  language === lang.code
                    ? 'bg-[#F5A623] text-[#1A3C1A] shadow-lg shadow-[#F5A623]/30'
                    : 'bg-[#2D6A2D]/50 border-2 border-[#2D6A2D] text-white hover:border-[#F5A623] hover:bg-[#2D6A2D]'
                }
              `}
            >
              {language === lang.code && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center"
                >
                  <span className="text-[#1A3C1A] text-sm">✓</span>
                </motion.div>
              )}


              <span
                className={`text-[20px] font-bold leading-tight ${
                  language === lang.code ? 'text-[#1A3C1A]' : 'text-white'
                }`}
              >
                {lang.name}
              </span>
              <span
                className={`text-[12px] mt-1 font-medium ${
                  language === lang.code ? 'text-[#1A3C1A]/70' : 'text-[#97BC62]'
                }`}
              >
                {lang.nameEn}
              </span>
            </motion.button>
          ))}
        </div>
      </div>


      {/* Continue button */}
      <motion.button
        onClick={handleContinue}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full max-w-md bg-[#F5A623] text-[#1C1C1E] py-4 rounded-xl font-bold text-[16px] hover:bg-[#E09515] transition-colors shadow-lg shadow-[#F5A623]/20"
      >
        {t('Continue')}
      </motion.button>
    </div>
  );
}
