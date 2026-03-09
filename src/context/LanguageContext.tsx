// // src/context/LanguageContext.tsx
// import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// type LanguageCode = 'en' | 'hi';

// interface LanguageContextType {
//   language: LanguageCode;
//   setLanguage: (lang: LanguageCode) => void;
//   t: (text: string) => string;
//   isLoading: boolean;
// }

// const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// // Manual fallback translations for critical UI elements
// const fallbackTranslations: Record<string, string> = {
//   // Common
//   'Continue': 'जारी रखें',
//   'Next': 'अगला',
//   'Back': 'वापस',
//   'Submit': 'जमा करें',
//   'Cancel': 'रद्द करें',
//   'Loading...': 'लोड हो रहा है...',
//   'Save': 'सहेजें',
  
//   // Splash
//   'Krishi Mitra': 'कृषि मित्र',
//   'Your Government Scheme Assistant': 'आपका सरकारी योजना सहायक',
//   'Select Language': 'भाषा चुनें',
  
//   // Onboarding Profile
//   'Step 1 of 5 — Basic Details': 'चरण 1 / 5 — बुनियादी जानकारी',
//   'Let\'s get you started!': 'आपका स्वागत है!',
//   'Tell us a bit about yourself to find the best schemes for you.': 'आपके लिए सबसे अच्छी योजनाएं खोजने के लिए कुछ जानकारी दें।',
//   'Listening...': 'सुन रहा हूँ...',
//   'Tap to speak your details': 'अपनी जानकारी बोलने के लिए टैप करें',
//   'OR': 'या',
//   'Full Name': 'पूरा नाम',
//   'Enter your full name': 'अपना पूरा नाम लिखें',
//   'Age': 'उम्र',
//   'Your age': 'आपकी उम्र',
//   'Mobile Number': 'मोबाइल नंबर',
//   'Enter mobile number': 'मोबाइल नंबर दर्ज करें',
//   '✓ Auto-detected': '✓ स्वतः पहचाना गया',
//   'Gender': 'लिंग',
//   'Male': 'पुरुष',
//   'Female': 'महिला',
//   'Other': 'अन्य',
//   'You can also fill this form using your voice': 'आप इस फॉर्म को आवाज़ से भी भर सकते हैं',
//   'Detecting number...': 'नंबर पहचान रहा है...',


//  // Voice related
// 'Listening... Tap to stop': 'सुन रहा हूँ... रोकने के लिए टैप करें',
//   // 'Tap to speak your details': 'अपनी जानकारी बोलने के लिए टैप करें',
//   'Voice not supported — Fill manually': 'वॉइस उपलब्ध नहीं — मैन्युअल भरें',
//   'Stop': 'रोकें',
//   'Voice Error': 'वॉइस त्रुटि',
//   'Voice input not supported': 'वॉइस इनपुट उपलब्ध नहीं',
//   'Your browser does not support voice input. Please fill the form manually.': 'आपका ब्राउज़र वॉइस इनपुट का समर्थन नहीं करता। कृपया फॉर्म मैन्युअल रूप से भरें।',
//   'Microphone access denied. Please allow microphone permission.': 'माइक्रोफ़ोन एक्सेस अस्वीकृत। कृपया माइक्रोफ़ोन अनुमति दें।',
//   'No speech detected. Please try again.': 'कोई आवाज़ नहीं मिली। कृपया पुनः प्रयास करें।',
//   'Network error. Please check your connection.': 'नेटवर्क त्रुटि। कृपया अपना कनेक्शन जांचें।',
//   'Voice input failed. Please type manually.': 'वॉइस इनपुट विफल। कृपया मैन्युअल टाइप करें।',
//   'Failed to start voice input. Please type manually.': 'वॉइस शुरू नहीं हो सका। कृपया मैन्युअल टाइप करें।',
//   'Tap the mic icon on each field to fill using voice': 'वॉइस से भरने के लिए प्रत्येक फ़ील्ड पर माइक आइकन टैप करें',
//   'Voice input not available. Please fill the form manually.': 'वॉइस इनपुट उपलब्ध नहीं। कृपया फॉर्म मैन्युअल रूप से भरें।',
// };

// // Translation cache
// const cache: Record<string, Record<string, string>> = {
//   en: {},
//   hi: {},
// };

// export function LanguageProvider({ children }: { children: ReactNode }) {
//   const [language, setLanguageState] = useState<LanguageCode>(() => {
//     return (localStorage.getItem('app-language') as LanguageCode) || 'hi';
//   });
//   const [isLoading, setIsLoading] = useState(false);
//   const [, forceUpdate] = useState(0);

//   // Load cache from localStorage on mount
//   useEffect(() => {
//     localStorage.setItem('app-language', language);
//     document.documentElement.lang = language;

//     const savedCache = localStorage.getItem('translation-cache');
//     if (savedCache) {
//       try {
//         Object.assign(cache, JSON.parse(savedCache));
//       } catch (e) {
//         console.error('Failed to load translation cache:', e);
//       }
//     }
//   }, [language]);

//   const setLanguage = (lang: LanguageCode) => {
//     setLanguageState(lang);
//   };

//   const t = (text: string): string => {
//     if (!text) return '';

//     // If English, return as is
//     if (language === 'en') {
//       cache.en[text] = text;
//       return text;
//     }

//     // Check cache first
//     if (cache[language]?.[text]) {
//       return cache[language][text];
//     }

//     // Check fallback translations
//     if (fallbackTranslations[text]) {
//       cache.hi[text] = fallbackTranslations[text];
//       return fallbackTranslations[text];
//     }

//     // Trigger API translation asynchronously
//     translateAsync(text, language);

//     // Return original text while loading
//     return text;
//   };

//   const translateAsync = async (text: string, targetLang: LanguageCode) => {
//     if (cache[targetLang]?.[text]) return;

//     setIsLoading(true);
//     try {
//       const translated = await translateWithLibre(text, 'en', targetLang);

//       if (!cache[targetLang]) cache[targetLang] = {};
//       cache[targetLang][text] = translated;

//       // Save to localStorage
//       localStorage.setItem('translation-cache', JSON.stringify(cache));

//       // Trigger re-render
//       forceUpdate((prev) => prev + 1);
//     } catch (error) {
//       console.error('Translation failed:', error);
//       // Fallback to original text
//       cache[targetLang][text] = text;
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <LanguageContext.Provider value={{ language, setLanguage, t, isLoading }}>
//       {children}
//     </LanguageContext.Provider>
//   );
// }

// // LibreTranslate API call
// async function translateWithLibre(
//   text: string,
//   from: string,
//   to: string
// ): Promise<string> {
//   try {
//     const response = await fetch('https://libretranslate.com/translate', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         q: text,
//         source: from,
//         target: to,
//         format: 'text',
//       }),
//     });

//     if (!response.ok) {
//       throw new Error(`Translation API error: ${response.status}`);
//     }

//     const data = await response.json();
//     return data.translatedText || text;
//   } catch (error) {
//     console.error('LibreTranslate error:', error);
//     // Return original text on error
//     return text;
//   }
// }

// export function useLanguage() {
//   const context = useContext(LanguageContext);
//   if (!context) {
//     throw new Error('useLanguage must be used within a LanguageProvider');
//   }
//   return context;
// }

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

    // Auth Screens
    'Create Account': 'Create Account',
    'Welcome Back': 'Welcome Back',
    'Email Address': 'Email Address',
    'Confirm Password': 'Confirm Password',
    'Sign Up': 'Sign Up',
    'Login': 'Login',
    'Passwords don\'t match': 'Passwords don\'t match',
    'Something went wrong. Please try again.': 'Something went wrong. Please try again.',
    'Incorrect credentials. Please try again.': 'Incorrect credentials. Please try again.',
    'Already have an account?': 'Already have an account?',
    'Create new account': 'Create new account',
    'Forgot Password?': 'Forgot Password?',
    'By continuing you agree to our Terms of Service': 'By continuing you agree to our Terms of Service',
    'User already exists': 'User already exists',
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
    'Voice input not available. Please fill the form manually.': 'वॉइस इनपुट उपलब्ध नहीं। कृपया फॉर्म मैन्युअल रूप से भरें।',
    
    // Error Messages
    'Voice Error': 'वॉइस त्रुटि',
    'Voice input not supported': 'वॉइस इनपुट उपलब्ध नहीं',
    'Your browser does not support voice input. Please fill the form manually.': 'आपका ब्राउज़र वॉइस इनपुट का समर्थन नहीं करता। कृपया फॉर्म मैन्युअल रूप से भरें।',
    'Microphone access denied. Please allow microphone permission.': 'माइक्रोफ़ोन एक्सेस अस्वीकृत। कृपया माइक्रोफ़ोन अनुमति दें।',
    'No speech detected. Please try again.': 'कोई आवाज़ नहीं मिली। कृपया पुनः प्रयास करें।',
    'Network error. Please check your connection.': 'नेटवर्क त्रुटि। कृपया अपना कनेक्शन जांचें।',
    'Voice input failed. Please type manually.': 'वॉइस इनपुट विफल। कृपया मैन्युअल टाइप करें।',
    'Failed to start voice input. Please type manually.': 'वॉइस शुरू नहीं हो सका। कृपया मैन्युअल टाइप करें।',

    // Auth Screens
    'Create Account': 'नया खाता बनाएं',
    'Welcome Back': 'वापस आपका स्वागत है',
    'Email Address': 'ईमेल पता',
    'Confirm Password': 'पासवर्ड दोबारा',
    'Sign Up': 'खाता बनाएं',
    'Login': 'लॉगिन करें',
    'Passwords don\'t match': 'पासवर्ड मेल नहीं खाते',
    'Something went wrong. Please try again.': 'कुछ गलत हुआ। दोबारा कोशिश करें।',
    'Incorrect credentials. Please try again.': 'गलत जानकारी। दोबारा कोशिश करें।',
    'Already have an account?': 'पहले से खाता है?',
    'Create new account': 'नया खाता बनाएं',
    'Forgot Password?': 'पासवर्ड भूल गए?',
    'By continuing you agree to our Terms of Service': 'जारी रखकर आप हमारी शर्तों से सहमत हैं',
    'User already exists': 'यह खाता पहले से मौजूद है',


    // Add to translations.en
// 'Step 2 of 5 — Farm Details': 'Step 2 of 5 — Farm Details',
// 'Your Farm Details': 'Your Farm Details',
// 'This information helps us find the right schemes for you.': 'This information helps us find the right schemes for you.',
// 'Land Ownership': 'Land Ownership',
// 'Land Size': 'Land Size',
// 'What do you grow?': 'What do you grow?',
// 'Crop Season': 'Crop Season',
// 'Irrigation Source': 'Irrigation Source',
// 'Voice input coming soon!': 'Voice input coming soon!',

// // Add to translations.hi
// 'Step 2 of 5 — Farm Details': 'चरण 2 / 5 — खेती की जानकारी',
// 'Your Farm Details': 'आपकी खेती की जानकारी',
// 'This information helps us find the right schemes for you.': 'यह जानकारी आपके लिए सही योजनाएं ढूंढने में मदद करेगी।',
// 'Land Ownership': 'भूमि स्वामित्व',
// 'Land Size': 'जमीन का आकार',
// 'What do you grow?': 'आप क्या उगाते हैं?',
// 'Crop Season': 'फसल का मौसम',
// 'Irrigation Source': 'सिंचाई का स्रोत',
// 'Voice input coming soon!': 'वॉइस इनपुट जल्द आ रहा है!',
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