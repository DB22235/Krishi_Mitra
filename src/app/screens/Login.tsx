// src/app/screens/Login.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Eye, EyeOff, ArrowLeft, Lock, User } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { signInWithEmail } from '../../lib/supabase';

interface FormData {
  identifier: string;
  password: string;
}

interface FormErrors {
  identifier?: string;
  password?: string;
  general?: string;
}

export function Login() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<FormData>({
    identifier: '',
    password: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isPhone = (value: string) => /^[6-9]\d{9}$/.test(value);
  const isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.identifier) {
      newErrors.identifier = t('Phone or Email') + ' ' + t('is required').toLowerCase();
    } else if (!isPhone(formData.identifier) && !isEmail(formData.identifier)) {
      newErrors.identifier = t('Enter a valid email address') + ' / ' + t('Enter a valid 10-digit phone number');
    }

    if (!formData.password) {
      newErrors.password = t('Password is required');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    setErrors({});

    try {
      let email = formData.identifier;
      
      // If it's a phone number, convert to our phone email format
      if (isPhone(formData.identifier)) {
        email = `${formData.identifier}@phone.krishimitra.app`;
      }

      const { error } = await signInWithEmail(email, formData.password);

      if (error) {
        setErrors({ general: t('Invalid credentials. Please try again.') });
      } else {
        // Success - navigate to dashboard
        navigate('/dashboard');
      }
    } catch {
      setErrors({ general: t('Invalid credentials. Please try again.') });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1A3C1A] flex flex-col">
      {/* Header */}
      <div className="px-6 pt-8 pb-4">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm">{t('Back')}</span>
        </button>
      </div>

      {/* Logo and Title */}
      <div className="px-6 pb-8 flex flex-col items-center">
        <div className="w-24 h-24 rounded-full overflow-hidden bg-white shadow-xl flex items-center justify-center mb-4 ring-4 ring-[#F5A623] ring-offset-2 ring-offset-[#1A3C1A]">
          <img
            src="/logo.png"
            alt="Krishi Mitra"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.parentElement!.innerHTML = '<span class="text-4xl">🌾</span>';
            }}
          />
        </div>
        <h1 className="text-white text-2xl font-bold text-center">{t('Welcome Back')}</h1>
        <p className="text-[#97BC62] text-sm mt-1">{t('Log in to continue')}</p>
      </div>

      {/* Form Card */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="flex-1 bg-[#F7F3EE] rounded-t-3xl px-6 py-10"
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Phone/Email Field */}
          <div>
            <label className="block text-sm font-medium text-[#1C1C1E] mb-1.5">
              {t('Phone or Email')}
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
              <input
                type="text"
                value={formData.identifier}
                onChange={(e) => setFormData(prev => ({ ...prev, identifier: e.target.value }))}
                placeholder={t('Enter phone or email')}
                className={`w-full pl-12 pr-4 py-4 bg-white rounded-xl border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-[#F5A623]/50 ${
                  errors.identifier ? 'border-red-400' : 'border-transparent'
                }`}
              />
            </div>
            {errors.identifier && (
              <p className="text-red-500 text-xs mt-1">{errors.identifier}</p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-[#1C1C1E] mb-1.5">
              {t('Password')}
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                placeholder={t('Enter your password')}
                className={`w-full pl-12 pr-12 py-4 bg-white rounded-xl border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-[#F5A623]/50 ${
                  errors.password ? 'border-red-400' : 'border-transparent'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-[#1C1C1E]"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          {/* Forgot Password Link */}
          <div className="text-right">
            <button
              type="button"
              className="text-[#1A3C1A] text-sm font-medium hover:underline"
            >
              {t('Forgot Password?')}
            </button>
          </div>

          {/* General Error */}
          {errors.general && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3">
              <p className="text-red-600 text-sm text-center">{errors.general}</p>
            </div>
          )}

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-[#F5A623] text-[#1C1C1E] py-4 rounded-xl font-bold text-base hover:bg-[#E09515] transition-colors shadow-lg shadow-[#F5A623]/20 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-[#1C1C1E] border-t-transparent rounded-full animate-spin" />
                {t('Logging in...')}
              </span>
            ) : (
              t('Log In')
            )}
          </motion.button>

          {/* Sign Up Link */}
          <p className="text-center text-[#6B7280] mt-6">
            {t("Don't have an account?")}{' '}
            <button
              type="button"
              onClick={() => navigate('/signup')}
              className="text-[#1A3C1A] font-semibold hover:underline"
            >
              {t('Sign Up')}
            </button>
          </p>
        </form>
      </motion.div>
    </div>
  );
}
