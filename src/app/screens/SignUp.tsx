// src/app/screens/SignUp.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Eye, EyeOff, Phone, Mail, ArrowLeft, User, Lock, Calendar, CheckCircle2, XCircle } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { signUpWithEmail, signUpWithPhone, checkUsernameAvailability } from '../../lib/supabase';

type ContactMethod = 'phone' | 'email';

interface FormData {
  contact: string;
  username: string;
  password: string;
  confirmPassword: string;
  dob: string;
  name: string;
}

interface FormErrors {
  contact?: string;
  username?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
}

export function SignUp() {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  
  const [contactMethod, setContactMethod] = useState<ContactMethod>('phone');
  const [formData, setFormData] = useState<FormData>({
    contact: '',
    username: '',
    password: '',
    confirmPassword: '',
    dob: '',
    name: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Validate contact
    if (!formData.contact) {
      newErrors.contact = contactMethod === 'phone' 
        ? t('Phone number is required')
        : t('Email is required');
    } else if (contactMethod === 'phone' && !/^[6-9]\d{9}$/.test(formData.contact)) {
      newErrors.contact = t('Enter a valid 10-digit phone number');
    } else if (contactMethod === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contact)) {
      newErrors.contact = t('Enter a valid email address');
    }

    // Validate username
    if (!formData.username) {
      newErrors.username = t('Username is required');
    } else if (formData.username.length < 3) {
      newErrors.username = t('Username must be at least 3 characters');
    } else if (usernameStatus === 'taken') {
      newErrors.username = 'Username is already taken';
    }

    // Validate password
    if (!formData.password) {
      newErrors.password = t('Password is required');
    } else if (formData.password.length < 6) {
      newErrors.password = t('Password must be at least 6 characters');
    }

    // Validate confirm password
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t('Passwords do not match');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUsernameChange = async (username: string) => {
    setFormData(prev => ({ ...prev, username }));
    
    if (username.length >= 3) {
      setUsernameStatus('checking');
      const { available } = await checkUsernameAvailability(username);
      setUsernameStatus(available ? 'available' : 'taken');
    } else {
      setUsernameStatus('idle');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    setErrors({});

    try {
      const metadata = {
        name: formData.name || undefined,
        dob: formData.dob || undefined,
        contact: formData.contact,
        contact_type: contactMethod,
        username: formData.username,
        language: language,
      };

      let result;
      
      if (contactMethod === 'email') {
        result = await signUpWithEmail(formData.contact, formData.password, metadata);
      } else {
        // For phone signup, we need to create a dummy email or use phone auth
        const phoneEmail = `${formData.contact}@phone.krishimitra.app`;
        result = await signUpWithEmail(phoneEmail, formData.password, {
          ...metadata,
          contact: formData.contact,
          contact_type: 'phone' as const,
        });
      }

      if (result.error) {
        setErrors({ general: result.error.message || t('Sign up failed. Please try again.') });
      } else {
        // Success - navigate to onboarding
        navigate('/onboarding/profile');
      }
    } catch {
      setErrors({ general: t('Sign up failed. Please try again.') });
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
      <div className="px-6 pb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-white shadow-lg flex items-center justify-center">
            <img
              src="/logo.png"
              alt="Krishi Mitra"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.parentElement!.innerHTML = '<span class="text-2xl">🌾</span>';
              }}
            />
          </div>
          <div>
            <h1 className="text-white text-xl font-bold">{t('Create Account')}</h1>
            <p className="text-[#97BC62] text-sm">{t('Join Krishi Mitra')}</p>
          </div>
        </div>
        <p className="text-white/70 text-sm mt-2">
          {t('Get personalized government schemes for farmers')}
        </p>
      </div>

      {/* Form Card */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="flex-1 bg-[#F7F3EE] rounded-t-3xl px-6 py-8"
      >
        {/* Contact Method Toggle */}
        <div className="flex gap-2 mb-6">
          <button
            type="button"
            onClick={() => {
              setContactMethod('phone');
              setFormData(prev => ({ ...prev, contact: '' }));
              setErrors({});
            }}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-all ${
              contactMethod === 'phone'
                ? 'bg-[#1A3C1A] text-white'
                : 'bg-white text-[#1A3C1A] border-2 border-[#1A3C1A]/20'
            }`}
          >
            <Phone className="w-4 h-4" />
            {t('Use Phone')}
          </button>
          <button
            type="button"
            onClick={() => {
              setContactMethod('email');
              setFormData(prev => ({ ...prev, contact: '' }));
              setErrors({});
            }}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-all ${
              contactMethod === 'email'
                ? 'bg-[#1A3C1A] text-white'
                : 'bg-white text-[#1A3C1A] border-2 border-[#1A3C1A]/20'
            }`}
          >
            <Mail className="w-4 h-4" />
            {t('Use Email')}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Contact Field */}
          <div>
            <label className="block text-sm font-medium text-[#1C1C1E] mb-1.5">
              {contactMethod === 'phone' ? t('Phone Number') : t('Email Address')}
            </label>
            <div className="relative">
              {contactMethod === 'phone' && (
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7280]">+91</span>
              )}
              <input
                type={contactMethod === 'phone' ? 'tel' : 'email'}
                value={formData.contact}
                onChange={(e) => setFormData(prev => ({ ...prev, contact: e.target.value }))}
                placeholder={contactMethod === 'phone' ? t('Enter your phone number') : t('Enter your email')}
                className={`w-full px-4 py-3.5 bg-white rounded-xl border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-[#F5A623]/50 ${
                  contactMethod === 'phone' ? 'pl-14' : ''
                } ${errors.contact ? 'border-red-400' : 'border-transparent'}`}
              />
            </div>
            {errors.contact && (
              <p className="text-red-500 text-xs mt-1">{errors.contact}</p>
            )}
          </div>

          {/* Full Name (Optional) */}
          <div>
            <label className="block text-sm font-medium text-[#1C1C1E] mb-1.5">
              {t('Full Name')} <span className="text-[#6B7280]">({t('Skip')})</span>
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder={t('Enter your full name')}
                className="w-full pl-12 pr-4 py-3.5 bg-white rounded-xl border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-[#F5A623]/50"
              />
            </div>
          </div>

          {/* Date of Birth (Optional) */}
          <div>
            <label className="block text-sm font-medium text-[#1C1C1E] mb-1.5">
              {t('Date of Birth')} <span className="text-[#6B7280]">({t('Skip')})</span>
            </label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
              <input
                type="date"
                value={formData.dob}
                onChange={(e) => setFormData(prev => ({ ...prev, dob: e.target.value }))}
                className="w-full pl-12 pr-4 py-3.5 bg-white rounded-xl border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-[#F5A623]/50"
              />
            </div>
          </div>

          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-[#1C1C1E] mb-1.5">
              {t('Username')}
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7280]">@</span>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => handleUsernameChange(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                placeholder={t('Choose a username')}
                className={`w-full pl-10 pr-10 py-3.5 bg-white rounded-xl border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-[#F5A623]/50 ${
                  errors.username ? 'border-red-400' : usernameStatus === 'available' ? 'border-green-400' : 'border-transparent'
                }`}
              />
              {usernameStatus === 'checking' && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <div className="w-4 h-4 border-2 border-[#F5A623] border-t-transparent rounded-full animate-spin" />
                </div>
              )}
              {usernameStatus === 'available' && (
                <CheckCircle2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
              )}
              {usernameStatus === 'taken' && (
                <XCircle className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-red-500" />
              )}
            </div>
            {errors.username && (
              <p className="text-red-500 text-xs mt-1">{errors.username}</p>
            )}
          </div>

          {/* Password */}
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
                placeholder={t('Create password')}
                className={`w-full pl-12 pr-12 py-3.5 bg-white rounded-xl border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-[#F5A623]/50 ${
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

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-[#1C1C1E] mb-1.5">
              {t('Confirm Password')}
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                placeholder={t('Re-enter password')}
                className={`w-full pl-12 pr-12 py-3.5 bg-white rounded-xl border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-[#F5A623]/50 ${
                  errors.confirmPassword ? 'border-red-400' : 'border-transparent'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-[#1C1C1E]"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
            )}
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
            className="w-full bg-[#F5A623] text-[#1C1C1E] py-4 rounded-xl font-bold text-base hover:bg-[#E09515] transition-colors shadow-lg shadow-[#F5A623]/20 disabled:opacity-70 disabled:cursor-not-allowed mt-6"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-[#1C1C1E] border-t-transparent rounded-full animate-spin" />
                {t('Creating account...')}
              </span>
            ) : (
              t('Sign Up')
            )}
          </motion.button>

          {/* Login Link */}
          <p className="text-center text-[#6B7280] mt-4">
            {t('Already have an account?')}{' '}
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="text-[#1A3C1A] font-semibold hover:underline"
            >
              {t('Log In')}
            </button>
          </p>
        </form>
      </motion.div>
    </div>
  );
}
