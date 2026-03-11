import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { useLanguage } from '../../context/LanguageContext';
import '../../styles/auth.css';
import { signUp } from '../../utils/api';
import { useUser } from '../../context/UserContext';

const translations = {
  'Krishi Mitra': { en: 'Krishi Mitra', hi: 'कृषि मित्र', mr: 'कृषी मित्र' },
  'Create Account': { en: 'Create Account', hi: 'खाता बनाएं', mr: 'खाते तयार करा' },
  'Full Name': { en: 'Full Name', hi: 'पूरा नाम', mr: 'पूर्ण नाव' },
  'Email Address': { en: 'Email Address', hi: 'ईमेल पता', mr: 'ईमेल पत्ता' },
  'Password': { en: 'Password', hi: 'पासवर्ड', mr: 'पासवर्ड' },
  'Confirm Password': { en: 'Confirm Password', hi: 'पासवर्ड की पुष्टि करें', mr: 'पासवर्डची पुष्टी करा' },
  "Passwords don't match": { en: "Passwords don't match", hi: 'पासवर्ड मेल नहीं खाते', mr: 'पासवर्ड जुळत नाहीत' },
  'By continuing you agree to our Terms of Service': {
    en: 'By continuing you agree to our Terms of Service',
    hi: 'जारी रखकर आप हमारी सेवा की शर्तों से सहमत हैं',
    mr: 'पुढे चालू ठेवून तुम्ही आमच्या सेवा अटींशी सहमत आहात'
  },
  'Sign Up': { en: 'Sign Up', hi: 'साइन अप करें', mr: 'साइन अप करा' },
  'Already have an account?': { en: 'Already have an account?', hi: 'पहले से खाता है?', mr: 'आधीच खाते आहे?' },
  'Login': { en: 'Login', hi: 'लॉगिन करें', mr: 'लॉगिन करा' },
  'User already exists': { en: 'User already exists', hi: 'उपयोगकर्ता पहले से मौजूद है', mr: 'वापरकर्ता आधीच अस्तित्वात आहे' },
  'Something went wrong. Please try again.': {
    en: 'Something went wrong. Please try again.',
    hi: 'कुछ गलत हो गया। कृपया पुनः प्रयास करें।',
    mr: 'काहीतरी चूक झाली. कृपया पुन्हा प्रयत्न करा.'
  },
  'Phone Number': { en: 'Phone Number', hi: 'फ़ोन नंबर', mr: 'फोन नंबर' },
  'Or continue with': { en: 'Or continue with', hi: 'या इसके साथ जारी रखें', mr: 'किंवा यासह सुरू ठेवा' },
  'Creating account...': { en: 'Creating account...', hi: 'खाता बनाया जा रहा है...', mr: 'खाते तयार होत आहे...' },
};

const languageNames: Record<string, string> = {
  en: 'English',
  hi: 'हिंदी',
  mr: 'मराठी',
};

export function SignUp() {
  const { language, t: contextT } = useLanguage();
  const navigate = useNavigate();
  const { syncWithBackend } = useUser();
  const isHindi = language === 'hi';
  const isMarathi = language === 'mr';

  const t = (key: string): string => {
    const translation = translations[key as keyof typeof translations];
    if (translation) {
      if (isMarathi && 'mr' in translation) return translation.mr;
      if (isHindi && 'hi' in translation) return translation.hi;
      return translation.en;
    }
    return contextT(key);
  };

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const passwordsMatch = confirmPassword.length === 0 || password === confirmPassword;

  const canSubmit =
    name.trim() &&
    email.trim() &&
    password.trim() &&
    confirmPassword.trim() &&
    password === confirmPassword &&
    !loading;

  const handleSignUp = async () => {
    if (!canSubmit) return;
    setError('');
    setLoading(true);

    try {
      const data = await signUp(name.trim(), email.trim(), password);
      localStorage.setItem('token', data.token);
      if (data.user?.name) {
        localStorage.setItem('user-name', data.user.name);
      }
      await syncWithBackend();
      setLoading(false);
      setSuccess(true);
      setTimeout(() => navigate('/profile?autoOpen=true'), 600);
    } catch (err: any) {
      setError(t(err.message || 'Something went wrong. Please try again.'));
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1A3C1A] flex flex-col" style={{ fontFamily: "'Noto Sans', sans-serif" }}>
      <div className="flex items-center justify-between px-5 pt-4 pb-2">
        <button onClick={() => navigate('/')} className="text-white p-2 -ml-2" aria-label="Back">
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] font-medium"
          style={{ backgroundColor: '#97BC62', color: '#1A3C1A' }}
        >
          🌐 {languageNames[language] || 'English'}
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center pt-4 pb-6"
      >
        <div className="w-14 h-14 mb-3 rounded-full overflow-hidden flex items-center justify-center bg-white shadow-lg ring-2 ring-[#F5A623]">
          <img
            src="/logo.png"
            alt="Logo"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.parentElement!.innerHTML = '<span class="text-3xl">🌾</span>';
            }}
          />
        </div>
        <h1 className="font-display font-bold text-white text-[26px] leading-tight" style={{ fontFamily: "'Poppins', sans-serif" }}>
          {t('Krishi Mitra')}
        </h1>
        <p className="text-[#97BC62] text-[14px] mt-1">{t('Create Account')}</p>
      </motion.div>

      <div className="flex-1 overflow-y-auto px-5 pb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-white rounded-2xl p-6 shadow-md"
          style={{ boxShadow: '0px 4px 16px rgba(0,0,0,0.08)' }}
        >
          <div className="flex flex-col gap-4">
            <div className="auth-field">
              <input
                type="text"
                id="signup-name"
                placeholder=" "
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
              />
              <label htmlFor="signup-name">{t('Full Name')}</label>
            </div>

            <div className="auth-field">
              <input
                type="email"
                id="signup-email"
                placeholder=" "
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                inputMode="email"
              />
              <label htmlFor="signup-email">{t('Email Address')}</label>
            </div>

            <div className="auth-field">
              <input
                type={showPassword ? 'text' : 'password'}
                id="signup-password"
                placeholder=" "
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                style={{ paddingRight: 48 }}
              />
              <label htmlFor="signup-password">{t('Password')}</label>
              <button
                type="button"
                className="field-icon"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Toggle password"
                tabIndex={-1}
              >
                {showPassword ? (
                  <svg width="20" height="20" fill="none" stroke="#6B7280" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                ) : (
                  <svg width="20" height="20" fill="none" stroke="#6B7280" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" /><circle cx="12" cy="12" r="3" /></svg>
                )}
              </button>
            </div>

            <div className="auth-field">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="signup-confirm-password"
                placeholder=" "
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                style={{
                  paddingRight: 48,
                  borderColor: confirmPassword.length > 0 ? (passwordsMatch ? '#97BC62' : '#F87171') : undefined,
                }}
              />
              <label htmlFor="signup-confirm-password">{t('Confirm Password')}</label>
              <div className="field-icon">
                {confirmPassword.length > 0 && passwordsMatch ? (
                  <svg width="20" height="20" fill="none" stroke="#97BC62" strokeWidth="2.2" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5" /></svg>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label="Toggle confirm password"
                    tabIndex={-1}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}
                  >
                    {showConfirmPassword ? (
                      <svg width="20" height="20" fill="none" stroke="#6B7280" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                    ) : (
                      <svg width="20" height="20" fill="none" stroke="#6B7280" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" /><circle cx="12" cy="12" r="3" /></svg>
                    )}
                  </button>
                )}
              </div>
            </div>
            {confirmPassword.length > 0 && !passwordsMatch && (
              <p className="text-[13px] -mt-2 ml-1" style={{ color: '#F87171', fontFamily: "'Noto Sans', sans-serif" }}>
                {t("Passwords don't match")}
              </p>
            )}
          </div>
        </motion.div>

        <p className="text-center text-[12px] mt-4 px-4" style={{ color: '#6B7280' }}>
          {t('By continuing you agree to our Terms of Service')}
        </p>

        <motion.button
          onClick={handleSignUp}
          disabled={!canSubmit}
          whileTap={canSubmit ? { scale: 0.97 } : {}}
          className="w-full mt-4 flex items-center justify-center gap-2 rounded-xl font-bold text-[16px] transition-all duration-200"
          style={{
            height: 56,
            borderRadius: 12,
            background: success ? '#97BC62' : '#F5A623',
            color: '#1C1C1E',
            opacity: canSubmit || loading || success ? 1 : 0.5,
            fontFamily: "'Poppins', sans-serif",
            border: 'none',
            cursor: canSubmit ? 'pointer' : 'not-allowed',
          }}
        >
          {loading ? (
            <div className="auth-spinner" />
          ) : success ? (
            <svg className="auth-check-pop" width="24" height="24" fill="none" stroke="#1C1C1E" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5" /></svg>
          ) : (
            t('Sign Up')
          )}
        </motion.button>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="auth-error-card mt-3"
          >
            ❌ {error}
          </motion.div>
        )}

        <p className="text-center mt-6 text-[14px]" style={{ color: '#FFFFFF', fontFamily: "'Noto Sans', sans-serif" }}>
          {t('Already have an account?')}{' '}
          <button
            onClick={() => navigate('/login')}
            className="font-semibold"
            style={{ color: '#F5A623', background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'Noto Sans', sans-serif", fontSize: 14 }}
          >
            {t('Login')}
          </button>
        </p>
      </div>
    </div>
  );
}
