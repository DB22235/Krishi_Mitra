// // src/app/screens/Login.tsx
// import { useState } from 'react';
// import { useNavigate } from 'react-router';
// import { motion } from 'motion/react';
// import { useLanguage } from '../../context/LanguageContext';
// import { useUser } from '../../context/UserContext';
// import '../../styles/auth.css';

// export function Login() {
//   const { language, t } = useLanguage();
//   const navigate = useNavigate();
//   const { loadAccount } = useUser();

//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [success, setSuccess] = useState(false);
//   const [error, setError] = useState('');
//   const [shaking, setShaking] = useState(false);

//   const canSubmit = email.trim() && password.trim() && !loading;

//   const handleLogin = async () => {
//     if (!canSubmit) return;
//     setError('');
//     setLoading(true);

//     try {
//       const res = await fetch('http://localhost:5000/api/auth/signin', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email: email.trim(), password }),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         setError(t('Incorrect credentials. Please try again.'));
//         setLoading(false);
//         setShaking(true);
//         setTimeout(() => setShaking(false), 350);
//         return;
//       }

//       // Save auth token
//       localStorage.setItem('token', data.token);

//       // Set active account key — used by UserContext to load the right profile
//       // Prefer mobile from response if available, otherwise fall back to email
//       const accountKey = data.mobile || data.user?.mobile || email.trim();

//       // Update global context immediately so we don't need a page reload
//       loadAccount(accountKey);

//       setLoading(false);
//       setSuccess(true);
//       setTimeout(() => navigate('/dashboard'), 600);
//     } catch {
//       setError(t('Something went wrong. Please try again.'));
//       setLoading(false);
//       setShaking(true);
//       setTimeout(() => setShaking(false), 350);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#1A3C1A] flex flex-col" style={{ fontFamily: "'Noto Sans', sans-serif" }}>
//       {/* Top bar */}
//       <div className="flex items-center justify-between px-5 pt-4 pb-2">
//         <button onClick={() => navigate('/')} className="text-white p-2 -ml-2" aria-label="Back">
//           <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
//             <path d="M19 12H5M12 19l-7-7 7-7" />
//           </svg>
//         </button>
//         <button
//           onClick={() => navigate('/')}
//           className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] font-medium"
//           style={{ backgroundColor: '#97BC62', color: '#1A3C1A' }}
//         >
//           🌐 {language === 'hi' ? 'हिंदी' : 'English'}
//         </button>
//       </div>

//       {/* Hero */}
//       <motion.div
//         initial={{ opacity: 0, y: -10 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.4 }}
//         className="flex flex-col items-center pt-6 pb-8"
//       >
//         <div className="w-14 h-14 mb-3 rounded-full overflow-hidden flex items-center justify-center bg-white shadow-lg ring-2 ring-[#F5A623]">
//           <img
//             src="/logo.png"
//             alt="Logo"
//             className="w-full h-full object-cover"
//             onError={(e) => {
//               e.currentTarget.style.display = 'none';
//               e.currentTarget.parentElement!.innerHTML = '<span class="text-3xl">🌾</span>';
//             }}
//           />
//         </div>
//         <h1 className="font-display font-bold text-white text-[26px] leading-tight" style={{ fontFamily: "'Poppins', sans-serif" }}>
//           {t('Krishi Mitra')}
//         </h1>
//         <p className="text-[#97BC62] text-[14px] mt-1">{t('Welcome Back')}</p>
//       </motion.div>

//       {/* Form area */}
//       <div className="flex-1 px-5 pb-6 flex flex-col">
//         {/* Form card */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.4, delay: 0.1 }}
//           className="bg-white rounded-2xl p-6 shadow-md"
//           style={{ boxShadow: '0px 4px 16px rgba(0,0,0,0.08)' }}
//         >
//           <div className="flex flex-col gap-4">
//             {/* Email */}
//             <div className="auth-field">
//               <input
//                 type="email"
//                 id="login-email"
//                 placeholder=" "
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 autoComplete="email"
//                 inputMode="email"
//               />
//               <label htmlFor="login-email">{t('Email Address')}</label>
//             </div>

//             {/* Password */}
//             <div className="auth-field">
//               <input
//                 type={showPassword ? 'text' : 'password'}
//                 id="login-password"
//                 placeholder=" "
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 autoComplete="current-password"
//                 style={{ paddingRight: 48 }}
//               />
//               <label htmlFor="login-password">{t('Password')}</label>
//               <button
//                 type="button"
//                 className="field-icon"
//                 onClick={() => setShowPassword(!showPassword)}
//                 aria-label="Toggle password"
//                 tabIndex={-1}
//               >
//                 {showPassword ? (
//                   <svg width="20" height="20" fill="none" stroke="#6B7280" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
//                 ) : (
//                   <svg width="20" height="20" fill="none" stroke="#6B7280" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" /><circle cx="12" cy="12" r="3" /></svg>
//                 )}
//               </button>
//             </div>

//             {/* Forgot Password */}
//             <div className="flex justify-end -mt-1">
//               <button
//                 type="button"
//                 className="text-[13px] font-medium"
//                 style={{ color: '#F5A623', background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'Noto Sans', sans-serif" }}
//               >
//                 {t('Forgot Password?')}
//               </button>
//             </div>
//           </div>
//         </motion.div>

//         {/* Error card */}
//         {error && (
//           <motion.div
//             initial={{ opacity: 0, y: 8 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="auth-error-card mt-4"
//           >
//             ❌ {error}
//           </motion.div>
//         )}

//         {/* CTA Button */}
//         <motion.button
//           onClick={handleLogin}
//           disabled={!canSubmit}
//           whileTap={canSubmit ? { scale: 0.97 } : {}}
//           className={`w-full mt-5 flex items-center justify-center gap-2 rounded-xl font-bold text-[16px] transition-all duration-200 ${shaking ? 'auth-shake' : ''}`}
//           style={{
//             height: 56,
//             borderRadius: 12,
//             background: success ? '#97BC62' : '#F5A623',
//             color: '#1C1C1E',
//             opacity: canSubmit || loading || success ? 1 : 0.5,
//             fontFamily: "'Poppins', sans-serif",
//             border: 'none',
//             cursor: canSubmit ? 'pointer' : 'not-allowed',
//           }}
//         >
//           {loading ? (
//             <div className="auth-spinner" />
//           ) : success ? (
//             <svg className="auth-check-pop" width="24" height="24" fill="none" stroke="#1C1C1E" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5" /></svg>
//           ) : (
//             t('Login')
//           )}
//         </motion.button>

//         {/* Spacer */}
//         <div className="flex-1" />

//         {/* Bottom redirect */}
//         <p className="text-center mt-8 text-[14px]" style={{ color: '#FFFFFF', fontFamily: "'Noto Sans', sans-serif" }}>
//           <button
//             onClick={() => navigate('/signup')}
//             className="font-semibold"
//             style={{ color: '#F5A623', background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'Noto Sans', sans-serif", fontSize: 14 }}
//           >
//             {t('Create new account')}
//           </button>
//         </p>
//       </div>
//     </div>
//   );
// }


// src/app/screens/Login.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { useLanguage } from '../../context/LanguageContext';
import '../../styles/auth.css';

export function Login() {
  const { language, t } = useLanguage();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [shaking, setShaking] = useState(false);

  const canSubmit = email.trim() && password.trim() && !loading;

  // Helper to get language display name
  const getLanguageDisplay = () => {
    switch (language) {
      case 'hi':
        return 'हिंदी';
      case 'mr':
        return 'मराठी';
      default:
        return 'English';
    }
  };

  const handleLogin = async () => {
    if (!canSubmit) return;
    setError('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(t('Incorrect credentials. Please try again.'));
        setLoading(false);
        // Trigger shake
        setShaking(true);
        setTimeout(() => setShaking(false), 350);
        return;
      }

      localStorage.setItem('token', data.token);
      setLoading(false);
      setSuccess(true);
      setTimeout(() => navigate('/dashboard'), 600);
    } catch {
      setError(t('Something went wrong. Please try again.'));
      setLoading(false);
      setShaking(true);
      setTimeout(() => setShaking(false), 350);
    }
  };

  return (
    <div className="min-h-screen bg-[#1A3C1A] flex flex-col" style={{ fontFamily: "'Noto Sans', sans-serif" }}>
      {/* Top bar */}
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
          🌐 {getLanguageDisplay()}
        </button>
      </div>

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center pt-6 pb-8"
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
        <p className="text-[#97BC62] text-[14px] mt-1">{t('Welcome Back')}</p>
      </motion.div>

      {/* Form area */}
      <div className="flex-1 px-5 pb-6 flex flex-col">
        {/* Form card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-white rounded-2xl p-6 shadow-md"
          style={{ boxShadow: '0px 4px 16px rgba(0,0,0,0.08)' }}
        >
          <div className="flex flex-col gap-4">
            {/* Email */}
            <div className="auth-field">
              <input
                type="email"
                id="login-email"
                placeholder=" "
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                inputMode="email"
              />
              <label htmlFor="login-email">{t('Email Address')}</label>
            </div>

            {/* Password */}
            <div className="auth-field">
              <input
                type={showPassword ? 'text' : 'password'}
                id="login-password"
                placeholder=" "
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                style={{ paddingRight: 48 }}
              />
              <label htmlFor="login-password">{t('Password')}</label>
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

            {/* Forgot Password */}
            <div className="flex justify-end -mt-1">
              <button
                type="button"
                className="text-[13px] font-medium"
                style={{ color: '#F5A623', background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'Noto Sans', sans-serif" }}
              >
                {t('Forgot Password?')}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Error card */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="auth-error-card mt-4"
          >
            ❌ {error}
          </motion.div>
        )}

        {/* CTA Button */}
        <motion.button
          onClick={handleLogin}
          disabled={!canSubmit}
          whileTap={canSubmit ? { scale: 0.97 } : {}}
          className={`w-full mt-5 flex items-center justify-center gap-2 rounded-xl font-bold text-[16px] transition-all duration-200 ${shaking ? 'auth-shake' : ''}`}
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
            t('Login')
          )}
        </motion.button>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Bottom redirect */}
        <p className="text-center mt-8 text-[14px]" style={{ color: '#FFFFFF', fontFamily: "'Noto Sans', sans-serif" }}>
          <button
            onClick={() => navigate('/signup')}
            className="font-semibold"
            style={{ color: '#F5A623', background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'Noto Sans', sans-serif", fontSize: 14 }}
          >
            {t('Create new account')}
          </button>
        </p>
      </div>
    </div>
  );
}
