// src/context/LanguageContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type LanguageCode = 'en' | 'hi';

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string) => string;
  isLoading: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Manual translations (NO API CALLS)
const translations: Record<LanguageCode, Record<string, string>> = {
  en: {
    // Splash
    'Krishi Mitra': 'Krishi Mitra',
    'Your Government Scheme Assistant': 'Your Government Scheme Assistant',
    'Select Language': 'Select Language',
    'Continue': 'Continue',
    
    // Onboarding
    'Step 1 of 5 — Basic Details': 'Step 1 of 5 — Basic Details',
    "Let's get you started!": "Let's get you started!",
    'Tell us a bit about yourself to find the best schemes for you.': 'Tell us a bit about yourself to find the best schemes for you.',
    
    // Voice
    'Listening... Tap to stop': 'Listening... Tap to stop',
    'Tap to speak your details': 'Tap to speak your details',
    'Voice not supported — Fill manually': 'Voice not supported — Fill manually',
    'Stop': 'Stop',
    'Loading...': 'Loading...',
    'OR': 'OR',
    
    // Form Labels
    'Full Name': 'Full Name',
    'Enter your full name': 'Enter your full name',
    'Age': 'Age',
    'Your age': 'Your age',
    'Mobile Number': 'Mobile Number',
    'Enter mobile number': 'Enter mobile number',
    'Detecting number...': 'Detecting number...',
    '✓ Auto-detected': '✓ Auto-detected',
    'Gender': 'Gender',
    'Male': 'Male',
    'Female': 'Female',
    'Other': 'Other',
    
    // Voice Messages
    'You can also fill this form using your voice': 'You can also fill this form using your voice',
    'Tap the mic icon on each field to fill using voice': 'Tap the mic icon on each field to fill using voice',
    'Voice input not available. Please fill the form manually.': 'Voice input not available. Please fill the form manually.',
    
    // Error Messages
    'Voice Error': 'Voice Error',
    'Voice input not supported': 'Voice input not supported',
    'Your browser does not support voice input. Please fill the form manually.': 'Your browser does not support voice input. Please fill the form manually.',
    'Microphone access denied. Please allow microphone permission.': 'Microphone access denied. Please allow microphone permission.',
    'No speech detected. Please try again.': 'No speech detected. Please try again.',
    'Network error. Please check your connection.': 'Network error. Please check your connection.',
    'Voice input failed. Please type manually.': 'Voice input failed. Please type manually.',
    'Failed to start voice input. Please type manually.': 'Failed to start voice input. Please type manually.',
    
    // Auth - Sign Up Screen (Screen A)
    'Create Account': 'Create Account',
    'Join Krishi Mitra': 'Join Krishi Mitra',
    'Get personalized government schemes for farmers': 'Get personalized government schemes for farmers',
    'Phone Number': 'Phone Number',
    'Enter your phone number': 'Enter your phone number',
    'Email Address': 'Email Address',
    'Enter your email': 'Enter your email',
    'Username': 'Username',
    'Choose a username': 'Choose a username',
    'Password': 'Password',
    'Create password': 'Create password',
    'Confirm Password': 'Confirm Password',
    'Re-enter password': 'Re-enter password',
    'Date of Birth': 'Date of Birth',
    'Sign Up': 'Sign Up',
    'Already have an account?': 'Already have an account?',
    'Log In': 'Log In',
    'Use Phone': 'Use Phone',
    'Use Email': 'Use Email',
    'Phone number is required': 'Phone number is required',
    'Enter a valid 10-digit phone number': 'Enter a valid 10-digit phone number',
    'Email is required': 'Email is required',
    'Enter a valid email address': 'Enter a valid email address',
    'Username is required': 'Username is required',
    'Username must be at least 3 characters': 'Username must be at least 3 characters',
    'Password is required': 'Password is required',
    'Password must be at least 6 characters': 'Password must be at least 6 characters',
    'Passwords do not match': 'Passwords do not match',
    'Creating account...': 'Creating account...',
    'Account created successfully!': 'Account created successfully!',
    'Sign up failed. Please try again.': 'Sign up failed. Please try again.',
    
    // Auth - Login Screen (Screen B)
    'Welcome Back': 'Welcome Back',
    'Log in to continue': 'Log in to continue',
    'Phone or Email': 'Phone or Email',
    'Enter phone or email': 'Enter phone or email',
    'Enter your password': 'Enter your password',
    'Forgot Password?': 'Forgot Password?',
    'Logging in...': 'Logging in...',
    "Don't have an account?": "Don't have an account?",
    'Login successful!': 'Login successful!',
    'Invalid credentials. Please try again.': 'Invalid credentials. Please try again.',
    'Back': 'Back',
    'Next': 'Next',
    'Skip': 'Skip',
  },

  hi: {
    // Splash
    'Krishi Mitra': 'कृषि मित्र',
    'Your Government Scheme Assistant': 'आपका सरकारी योजना सहायक',
    'Select Language': 'भाषा चुनें',
    'Continue': 'जारी रखें',
    
    // Onboarding
    'Step 1 of 5 — Basic Details': 'चरण 1 / 5 — बुनियादी जानकारी',
    "Let's get you started!": 'आपका स्वागत है!',
    'Tell us a bit about yourself to find the best schemes for you.': 'आपके लिए सबसे अच्छी योजनाएं खोजने के लिए कुछ जानकारी दें।',
    
    // Voice
    'Listening... Tap to stop': 'सुन रहा हूँ... रोकने के लिए टैप करें',
    'Tap to speak your details': 'अपनी जानकारी बोलने के लिए टैप करें',
    'Voice not supported — Fill manually': 'वॉइस उपलब्ध नहीं — मैन्युअल भरें',
    'Stop': 'रोकें',
    'Loading...': 'लोड हो रहा है...',
    'OR': 'या',
    
    // Form Labels
    'Full Name': 'पूरा नाम',
    'Enter your full name': 'अपना पूरा नाम लिखें',
    'Age': 'उम्र',
    'Your age': 'आपकी उम्र',
    'Mobile Number': 'मोबाइल नंबर',
    'Enter mobile number': 'मोबाइल नंबर दर्ज करें',
    'Detecting number...': 'नंबर पहचान रहा है...',
    '✓ Auto-detected': '✓ स्वतः पहचाना गया',
    'Gender': 'लिंग',
    'Male': 'पुरुष',
    'Female': 'महिला',
    'Other': 'अन्य',
    
    // Voice Messages
    'You can also fill this form using your voice': 'आप इस फॉर्म को आवाज़ से भी भर सकते हैं',
    'Tap the mic icon on each field to fill using voice': 'वॉइस से भरने के लिए प्रत्येक फ़ील्ड पर माइक आइकन टैप करें',
    'Voice input not available. Please fill the form manually.': 'वॉइस इनपुट उपलब्ध नहीं। कृपया फॉर्म मैन्युअ��� रूप से भरें।',
    
    // Error Messages
    'Voice Error': 'वॉइस त्रुटि',
    'Voice input not supported': 'वॉइस इनपुट उपलब्ध नहीं',
    'Your browser does not support voice input. Please fill the form manually.': 'आपका ब्राउज़र वॉइस इनपुट का समर्थन नहीं करता। कृपया फॉर्म मैन्युअल रूप से भरें।',
    'Microphone access denied. Please allow microphone permission.': 'माइक्रोफ़ोन एक्सेस अस्वीकृत। कृपया माइक्रोफ़ोन अनुमति दें।',
    'No speech detected. Please try again.': 'कोई आवाज़ नहीं मिली। कृपया पुनः प्रयास करें।',
    'Network error. Please check your connection.': 'नेटवर्क त्रुटि। कृपया अपना कनेक्शन जांचें।',
    'Voice input failed. Please type manually.': 'वॉइस इनपुट विफल। कृपया मैन्युअल टाइप करें।',
    'Failed to start voice input. Please type manually.': 'वॉइस शुरू नहीं हो सका। कृपया मैन्युअल टाइप करें।',

    // Auth - Sign Up Screen (Screen A)
    'Create Account': 'खाता बनाएं',
    'Join Krishi Mitra': 'कृषि मित्र से जुड़ें',
    'Get personalized government schemes for farmers': 'किसानों के लिए व्यक्तिगत सरकारी योजनाएं प्राप्त करें',
    'Phone Number': 'फ़ोन नंबर',
    'Enter your phone number': 'अपना फ़ोन नंबर दर्ज करें',
    'Email Address': 'ईमेल पता',
    'Enter your email': 'अपना ईमेल दर्ज करें',
    'Username': 'यूजरनेम',
    'Choose a username': 'यूजरनेम चुनें',
    'Password': 'पासवर्ड',
    'Create password': 'पासवर्ड बनाएं',
    'Confirm Password': 'पासवर्ड की पुष्टि करें',
    'Re-enter password': 'पासवर्ड दोबारा दर्ज करें',
    'Date of Birth': 'जन्म तिथि',
    'Sign Up': 'साइन अप करें',
    'Already have an account?': 'पहले से खाता है?',
    'Log In': 'लॉग इन करें',
    'Use Phone': 'फ़ोन से',
    'Use Email': 'ईमेल से',
    'Phone number is required': 'फ़ोन नंबर आवश्यक है',
    'Enter a valid 10-digit phone number': 'एक मान्य 10-अंकीय फ़ोन नंबर दर्ज करें',
    'Email is required': 'ईमेल आवश्यक है',
    'Enter a valid email address': 'एक मान्य ईमेल पता दर्ज करें',
    'Username is required': 'यूजरनेम आवश्यक है',
    'Username must be at least 3 characters': 'यूजरनेम कम से कम 3 अक्षर का होना चाहिए',
    'Password is required': 'पासवर्ड आवश्यक है',
    'Password must be at least 6 characters': 'पासवर्ड कम से कम 6 अक्षर का होना चाहिए',
    'Passwords do not match': 'पासवर्ड मेल नहीं खाते',
    'Creating account...': 'खाता बना रहा है...',
    'Account created successfully!': 'खाता सफलतापूर्वक बन गया!',
    'Sign up failed. Please try again.': 'साइन अप विफल। कृपया पुनः प्रयास करें।',
    
    // Auth - Login Screen (Screen B)
    'Welcome Back': 'वापसी पर स्वागत है',
    'Log in to continue': 'जारी रखने के लिए लॉग इन करें',
    'Phone or Email': 'फ़ोन या ईमेल',
    'Enter phone or email': 'फ़ोन या ईमेल दर्ज करें',
    'Enter your password': 'अपना पासवर्ड दर्ज करें',
    'Forgot Password?': 'पासवर्ड भूल गए?',
    'Logging in...': 'लॉग इन हो रहा है...',
    "Don't have an account?": 'खाता नहीं है?',
    'Login successful!': 'लॉगिन सफल!',
    'Invalid credentials. Please try again.': 'अमान्य क्रेडेंशियल। कृपया पुनः प्रयास करें।',
    'Back': 'वापस',
    'Next': 'अगला',
    'Skip': 'छोड़ें',
  },
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    return (localStorage.getItem('app-language') as LanguageCode) || 'hi';
  });

  // Save language preference
  useEffect(() => {
    localStorage.setItem('app-language', language);
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
  };

  // Simple translation function (NO API)
  const t = (key: string): string => {
    return translations[language]?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isLoading: false }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
