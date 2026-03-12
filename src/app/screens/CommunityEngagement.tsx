// src/app/screens/CommunityEngagement.tsx


// import { useState, useMemo, useCallback } from 'react';
// import {
//     ArrowLeft,
//     Search,
//     Filter,
//     Heart,
//     MessageCircle,
//     Share2,
//     Play,
//     ChevronRight,
//     Star,
//     TrendingUp,
//     Users,
//     Award,
//     Sparkles,
//     MapPin,
//     Wheat,
//     Calendar,
//     IndianRupee,
//     ThumbsUp,
//     BookOpen,
//     Video,
//     Mic,
//     ChevronDown,
//     ChevronUp,
//     X,
//     Plus,
//     Clock,
//     CheckCircle,
//     Bookmark,
//     Eye,
// } from 'lucide-react';
// import { useNavigate } from 'react-router';
// import { motion, AnimatePresence } from 'motion/react';
// import { BottomNav } from '../components/BottomNav';
// import { useLanguage } from '../../context/LanguageContext';
// import { useUser } from '../../context/UserContext';


// // ─── Translations ───────────────────────────────────────────────
// const translations = {
//     // Page titles
//     communityStories: { en: 'Community Stories', hi: 'समुदाय की कहानियां', mr: 'समुदायाच्या कथा' },
//     successStories: { en: 'Success Stories', hi: 'सफलता की कहानियां', mr: 'यशोगाथा' },
//     farmerExperiences: { en: 'Farmer Experiences', hi: 'किसानों के अनुभव', mr: 'शेतकऱ्यांचे अनुभव' },


//     // Search
//     searchPlaceholder: {
//         en: 'Search stories, schemes, crops...',
//         hi: 'कहानियां, योजनाएं, फसलें खोजें...',
//         mr: 'कथा, योजना, पिके शोधा...'
//     },


//     // Stats
//     happyFarmers: { en: 'Happy Farmers', hi: 'खुश किसान', mr: 'आनंदी शेतकरी' },
//     successRate: { en: 'Success Rate', hi: 'सफलता दर', mr: 'यश दर' },
//     schemesAvailed: { en: 'Schemes Availed', hi: 'योजनाएं लाभान्वित', mr: 'योजना लाभ' },
//     totalBenefits: { en: 'Total Benefits', hi: 'कुल लाभ', mr: 'एकूण लाभ' },


//     // Filters
//     allStories: { en: 'All Stories', hi: 'सभी कहानियां', mr: 'सर्व कथा' },
//     recommended: { en: 'For You', hi: 'आपके लिए', mr: 'तुमच्यासाठी' },
//     trending: { en: 'Trending', hi: 'ट्रेंडिंग', mr: 'ट्रेंडिंग' },
//     recent: { en: 'Recent', hi: 'हाल की', mr: 'अलीकडील' },


//     // Crop types
//     allCrops: { en: 'All Crops', hi: 'सभी फसलें', mr: 'सर्व पिके' },
//     wheat: { en: 'Wheat', hi: 'गेहूं', mr: 'गहू' },
//     rice: { en: 'Rice', hi: 'धान', mr: 'तांदूळ' },
//     cotton: { en: 'Cotton', hi: 'कपास', mr: 'कापूस' },
//     sugarcane: { en: 'Sugarcane', hi: 'गन्ना', mr: 'ऊस' },
//     vegetables: { en: 'Vegetables', hi: 'सब्जियां', mr: 'भाज्या' },
//     fruits: { en: 'Fruits', hi: 'फल', mr: 'फळे' },
//     pulses: { en: 'Pulses', hi: 'दालें', mr: 'डाळी' },
//     oilseeds: { en: 'Oilseeds', hi: 'तिलहन', mr: 'तेलबिया' },


//     // Land size
//     allSizes: { en: 'All Sizes', hi: 'सभी आकार', mr: 'सर्व आकार' },
//     marginal: { en: 'Marginal (<1 ha)', hi: 'सीमांत (<1 हे)', mr: 'अल्प (<1 हे)' },
//     small: { en: 'Small (1-2 ha)', hi: 'छोटा (1-2 हे)', mr: 'लहान (1-2 हे)' },
//     medium: { en: 'Medium (2-4 ha)', hi: 'मध्यम (2-4 हे)', mr: 'मध्यम (2-4 हे)' },
//     large: { en: 'Large (>4 ha)', hi: 'बड़ा (>4 हे)', mr: 'मोठा (>4 हे)' },


//     // Schemes
//     allSchemes: { en: 'All Schemes', hi: 'सभी योजनाएं', mr: 'सर्व योजना' },
//     pmKisan: { en: 'PM-Kisan', hi: 'पीएम-किसान', mr: 'पीएम-किसान' },
//     pmfby: { en: 'PM Fasal Bima', hi: 'पीएम फसल बीमा', mr: 'पीएम पीक विमा' },
//     kcc: { en: 'Kisan Credit Card', hi: 'किसान क्रेडिट कार्ड', mr: 'किसान क्रेडिट कार्ड' },
//     soilHealth: { en: 'Soil Health Card', hi: 'मृदा स्वास्थ्य कार्ड', mr: 'मृदा आरोग्य कार्ड' },
//     pmKusum: { en: 'PM-KUSUM', hi: 'पीएम-कुसुम', mr: 'पीएम-कुसुम' },


//     // Regions
//     allRegions: { en: 'All Regions', hi: 'सभी क्षेत्र', mr: 'सर्व प्रदेश' },
//     maharashtra: { en: 'Maharashtra', hi: 'महाराष्ट्र', mr: 'महाराष्ट्र' },
//     punjab: { en: 'Punjab', hi: 'पंजाब', mr: 'पंजाब' },
//     up: { en: 'Uttar Pradesh', hi: 'उत्तर प्रदेश', mr: 'उत्तर प्रदेश' },
//     mp: { en: 'Madhya Pradesh', hi: 'मध्य प्रदेश', mr: 'मध्य प्रदेश' },
//     rajasthan: { en: 'Rajasthan', hi: 'राजस्थान', mr: 'राजस्थान' },
//     gujarat: { en: 'Gujarat', hi: 'गुजरात', mr: 'गुजरात' },
//     karnataka: { en: 'Karnataka', hi: 'कर्नाटक', mr: 'कर्नाटक' },


//     // Story elements
//     readMore: { en: 'Read More', hi: 'और पढ़ें', mr: 'अधिक वाचा' },
//     readFull: { en: 'Read Full Story', hi: 'पूरी कहानी पढ़ें', mr: 'संपूर्ण कथा वाचा' },
//     viewDetails: { en: 'View Details', hi: 'विवरण देखें', mr: 'तपशील पहा' },
//     likes: { en: 'Likes', hi: 'पसंद', mr: 'आवडले' },
//     comments: { en: 'Comments', hi: 'टिप्पणियां', mr: 'प्रतिक्रिया' },
//     shares: { en: 'Shares', hi: 'शेयर', mr: 'शेअर' },
//     views: { en: 'Views', hi: 'व्यूज', mr: 'दृश्ये' },
//     verified: { en: 'Verified', hi: 'सत्यापित', mr: 'सत्यापित' },


//     // Benefits
//     benefitReceived: { en: 'Benefit Received', hi: 'प्राप्त लाभ', mr: 'मिळालेला लाभ' },
//     incomeIncrease: { en: 'Income Increase', hi: 'आय में वृद्धि', mr: 'उत्पन्न वाढ' },
//     yieldImprovement: { en: 'Yield Improvement', hi: 'उपज में सुधार', mr: 'उत्पादन सुधारणा' },
//     costSaving: { en: 'Cost Saving', hi: 'लागत बचत', mr: 'खर्च बचत' },


//     // Sections
//     featuredStories: { en: 'Featured Stories', hi: 'विशेष कहानियां', mr: 'विशेष कथा' },
//     recommendedForYou: { en: 'Recommended For You', hi: 'आपके लिए अनुशंसित', mr: 'तुमच्यासाठी शिफारस' },
//     similarFarmers: { en: 'From Similar Farmers', hi: 'समान किसानों से', mr: 'समान शेतकऱ्यांकडून' },
//     caseStudies: { en: 'Case Studies', hi: 'केस स्टडी', mr: 'केस स्टडी' },
//     videoTestimonials: { en: 'Video Testimonials', hi: 'वीडियो प्रशंसापत्र', mr: 'व्हिडिओ साक्षांश' },
//     schemeBenefits: { en: 'Scheme Benefits', hi: 'योजना लाभ', mr: 'योजना फायदे' },


//     // Actions
//     shareYourStory: { en: 'Share Your Story', hi: 'अपनी कहानी साझा करें', mr: 'तुमची कथा शेअर करा' },
//     applyNow: { en: 'Apply Now', hi: 'अभी आवेदन करें', mr: 'आता अर्ज करा' },
//     learnMore: { en: 'Learn More', hi: 'और जानें', mr: 'अधिक जाणून घ्या' },
//     watchVideo: { en: 'Watch Video', hi: 'वीडियो देखें', mr: 'व्हिडिओ पहा' },
//     save: { en: 'Save', hi: 'सेव करें', mr: 'सेव्ह करा' },
//     saved: { en: 'Saved', hi: 'सेव हुआ', mr: 'सेव्ह केले' },


//     // Time
//     daysAgo: { en: 'days ago', hi: 'दिन पहले', mr: 'दिवसांपूर्वी' },
//     weeksAgo: { en: 'weeks ago', hi: 'सप्ताह पहले', mr: 'आठवड्यांपूर्वी' },
//     monthsAgo: { en: 'months ago', hi: 'महीने पहले', mr: 'महिन्यांपूर्वी' },


//     // Info banners
//     basedOnProfile: {
//         en: 'Stories matching your profile',
//         hi: 'आपकी प्रोफ़ाइल से मेल खाती कहानियां',
//         mr: 'तुमच्या प्रोफाइलशी जुळणाऱ्या कथा'
//     },
//     helplineInfo: {
//         en: 'Need help? Call: 1800-180-1551',
//         hi: 'मदद चाहिए? कॉल करें: 1800-180-1551',
//         mr: 'मदत हवी? कॉल करा: 1800-180-1551'
//     },


//     // Empty states
//     noStoriesFound: { en: 'No stories found', hi: 'कोई कहानी नहीं मिली', mr: 'कोणतीही कथा सापडली नाही' },
//     tryDifferentFilters: {
//         en: 'Try different filters to find stories',
//         hi: 'कहानियां खोजने के लिए अलग फिल्टर आज़माएं',
//         mr: 'कथा शोधण्यासाठी वेगळे फिल्टर वापरा'
//     },


//     // Share story form
//     tellYourStory: { en: 'Tell Your Story', hi: 'अपनी कहानी बताएं', mr: 'तुमची कथा सांगा' },
//     inspireOthers: {
//         en: 'Inspire other farmers with your experience',
//         hi: 'अपने अनुभव से अन्य किसानों को प्रेरित करें',
//         mr: 'तुमच्या अनुभवाने इतर शेतकऱ्यांना प्रेरित करा'
//     },


//     // Coming soon
//     comingSoon: { en: 'Coming Soon', hi: 'जल्द आ रहा है', mr: 'लवकरच येत आहे' },
//     featureInDevelopment: {
//         en: 'This feature is under development',
//         hi: 'यह फीचर विकास के अधीन है',
//         mr: 'हे वैशिष्ट्य विकासाधीन आहे'
//     },


//     // Filters modal
//     filterStories: { en: 'Filter Stories', hi: 'कहानियां फ़िल्टर करें', mr: 'कथा फिल्टर करा' },
//     cropType: { en: 'Crop Type', hi: 'फसल प्रकार', mr: 'पीक प्रकार' },
//     landSize: { en: 'Land Size', hi: 'भूमि आकार', mr: 'जमीन क्षेत्र' },
//     scheme: { en: 'Scheme', hi: 'योजना', mr: 'योजना' },
//     region: { en: 'Region', hi: 'क्षेत्र', mr: 'प्रदेश' },
//     applyFilters: { en: 'Apply Filters', hi: 'फ़िल्टर लागू करें', mr: 'फिल्टर लागू करा' },
//     clearAll: { en: 'Clear All', hi: 'सब हटाएं', mr: 'सर्व काढा' },


//     // Placeholder texts - for future scheme info updates
//     schemeInfoPlaceholder: {
//         en: 'Scheme details will be updated soon',
//         hi: 'योजना विवरण जल्द ही अपडेट होगा',
//         mr: 'योजना तपशील लवकरच अपडेट होईल'
//     },
//     benefitsUpdating: {
//         en: 'Benefits information updating...',
//         hi: 'लाभ जानकारी अपडेट हो रही है...',
//         mr: 'लाभ माहिती अपडेट होत आहे...'
//     },
// };


// // ─── Story interface ────────────────────────────────────────────
// interface SuccessStory {
//     id: string;
//     farmerName: string;
//     farmerNameHi: string;
//     farmerNameMr: string;
//     farmerImage?: string;
//     location: string;
//     locationHi: string;
//     locationMr: string;
//     state: string;
//     cropType: string;
//     cropTypeHi: string;
//     cropTypeMr: string;
//     landSize: number;
//     landUnit: string;
//     landCategory: 'marginal' | 'small' | 'medium' | 'large';
//     scheme: string;
//     schemeHi: string;
//     schemeMr: string;
//     schemeId: string;
//     title: string;
//     titleHi: string;
//     titleMr: string;
//     summary: string;
//     summaryHi: string;
//     summaryMr: string;
//     fullStory?: string;
//     fullStoryHi?: string;
//     fullStoryMr?: string;
//     benefitAmount: string;
//     incomeIncrease?: string;
//     yieldImprovement?: string;
//     costSaving?: string;
//     likes: number;
//     comments: number;
//     shares: number;
//     views: number;
//     isVerified: boolean;
//     isFeatured: boolean;
//     postedDaysAgo: number;
//     videoUrl?: string;
//     images?: string[];
//     tags: string[];
// }


// // ─── Case Study interface ───────────────────────────────────────
// interface CaseStudy {
//     id: string;
//     title: string;
//     titleHi: string;
//     titleMr: string;
//     description: string;
//     descriptionHi: string;
//     descriptionMr: string;
//     scheme: string;
//     schemeHi: string;
//     schemeMr: string;
//     farmersImpacted: number;
//     totalBenefits: string;
//     region: string;
//     regionHi: string;
//     regionMr: string;
//     duration: string;
//     durationHi: string;
//     durationMr: string;
//     icon: string;
// }


// // ─── Scheme Benefit Placeholder interface ───────────────────────
// // This structure is designed to be easily updatable when scheme info changes
// interface SchemeBenefitInfo {
//     id: string;
//     schemeName: string;
//     schemeNameHi: string;
//     schemeNameMr: string;
//     icon: string;
//     // Primary benefits - easily updatable
//     benefits: {
//         title: string;
//         titleHi: string;
//         titleMr: string;
//         value: string;
//         valueHi: string;
//         valueMr: string;
//     }[];
//     // Statistics - easily updatable
//     stats: {
//         label: string;
//         labelHi: string;
//         labelMr: string;
//         value: string;
//     }[];
//     // Last updated timestamp for tracking
//     lastUpdated: string;
//     // Placeholder flag for incomplete data
//     isPlaceholder?: boolean;
// }


// // ─── Sample Success Stories Data ────────────────────────────────
// const successStoriesData: SuccessStory[] = [
//     {
//         id: '1',
//         farmerName: 'Ramesh Patil',
//         farmerNameHi: 'रमेश पाटिल',
//         farmerNameMr: 'रमेश पाटील',
//         farmerImage: '',
//         location: 'Nashik, Maharashtra',
//         locationHi: 'नासिक, महाराष्ट्र',
//         locationMr: 'नाशिक, महाराष्ट्र',
//         state: 'maharashtra',
//         cropType: 'Grapes & Vegetables',
//         cropTypeHi: 'अंगूर और सब्जियां',
//         cropTypeMr: 'द्राक्षे आणि भाज्या',
//         landSize: 2.5,
//         landUnit: 'Hectares',
//         landCategory: 'medium',
//         scheme: 'PM-Kisan Samman Nidhi',
//         schemeHi: 'प्रधानमंत्री किसान सम्मान निधि',
//         schemeMr: 'प्रधानमंत्री किसान सन्मान निधी',
//         schemeId: 'pm-kisan',
//         title: 'From Struggling to Thriving: My PM-Kisan Journey',
//         titleHi: 'संघर्ष से सफलता तक: मेरी पीएम-किसान यात्रा',
//         titleMr: 'संघर्षातून यशाकडे: माझा पीएम-किसान प्रवास',
//         summary: 'With ₹6,000 annual support from PM-Kisan, I invested in quality seeds and fertilizers. My grape yield increased by 40% in just two seasons.',
//         summaryHi: 'पीएम-किसान से ₹6,000 वार्षिक सहायता के साथ, मैंने गुणवत्ता वाले बीज और उर्वरकों में निवेश किया। मेरी अंगूर की उपज सिर्फ दो सीजन में 40% बढ़ गई।',
//         summaryMr: 'पीएम-किसान मधून ₹6,000 वार्षिक मदतीने, मी दर्जेदार बियाणे आणि खतांमध्ये गुंतवणूक केली. माझ्या द्राक्षांचे उत्पादन फक्त दोन हंगामात 40% वाढले.',
//         benefitAmount: '₹18,000',
//         incomeIncrease: '45%',
//         yieldImprovement: '40%',
//         likes: 234,
//         comments: 45,
//         shares: 89,
//         views: 1250,
//         isVerified: true,
//         isFeatured: true,
//         postedDaysAgo: 3,
//         tags: ['pm-kisan', 'grapes', 'success', 'maharashtra'],
//     },
//     {
//         id: '2',
//         farmerName: 'Gurpreet Singh',
//         farmerNameHi: 'गुरप्रीत सिंह',
//         farmerNameMr: 'गुरप्रीत सिंग',
//         farmerImage: '',
//         location: 'Ludhiana, Punjab',
//         locationHi: 'लुधियाना, पंजाब',
//         locationMr: 'लुधियाना, पंजाब',
//         state: 'punjab',
//         cropType: 'Wheat & Rice',
//         cropTypeHi: 'गेहूं और धान',
//         cropTypeMr: 'गहू आणि तांदूळ',
//         landSize: 5,
//         landUnit: 'Hectares',
//         landCategory: 'large',
//         scheme: 'PM Fasal Bima Yojana',
//         schemeHi: 'प्रधानमंत्री फसल बीमा योजना',
//         schemeMr: 'प्रधानमंत्री पीक विमा योजना',
//         schemeId: 'pmfby',
//         title: 'Crop Insurance Saved My Family After Floods',
//         titleHi: 'बाढ़ के बाद फसल बीमा ने मेरे परिवार को बचाया',
//         titleMr: 'पुरानंतर पीक विम्याने माझ्या कुटुंबाला वाचवले',
//         summary: 'When unexpected floods destroyed 80% of my wheat crop, PMFBY claim of ₹1.2 lakh helped me recover and replant for the next season.',
//         summaryHi: 'जब अचानक बाढ़ ने मेरी 80% गेहूं की फसल नष्ट कर दी, तो PMFBY दावे से ₹1.2 लाख ने मुझे अगले सीजन के लिए ठीक होने और फिर से बुवाई करने में मदद की।',
//         summaryMr: 'जेव्हा अनपेक्षित पुराने माझ्या 80% गहू पिकाचा नाश केला, तेव्हा PMFBY दाव्यातून ₹1.2 लाख ने मला पुन्हा उभे राहण्यास आणि पुढच्या हंगामासाठी पेरणी करण्यास मदत केली.',
//         benefitAmount: '₹1,20,000',
//         costSaving: '₹85,000',
//         likes: 567,
//         comments: 123,
//         shares: 234,
//         views: 3400,
//         isVerified: true,
//         isFeatured: true,
//         postedDaysAgo: 7,
//         videoUrl: 'https://example.com/video1',
//         tags: ['pmfby', 'insurance', 'wheat', 'punjab', 'flood'],
//     },
//     {
//         id: '3',
//         farmerName: 'Lakshmi Devi',
//         farmerNameHi: 'लक्ष्मी देवी',
//         farmerNameMr: 'लक्ष्मी देवी',
//         farmerImage: '',
//         location: 'Jaipur, Rajasthan',
//         locationHi: 'जयपुर, राजस्थान',
//         locationMr: 'जयपूर, राजस्थान',
//         state: 'rajasthan',
//         cropType: 'Pulses & Oilseeds',
//         cropTypeHi: 'दालें और तिलहन',
//         cropTypeMr: 'डाळी आणि तेलबिया',
//         landSize: 1.5,
//         landUnit: 'Hectares',
//         landCategory: 'small',
//         scheme: 'Kisan Credit Card',
//         schemeHi: 'किसान क्रेडिट कार्ड',
//         schemeMr: 'किसान क्रेडिट कार्ड',
//         schemeId: 'kcc',
//         title: 'KCC Helped Me Become an Independent Farmer',
//         titleHi: 'KCC ने मुझे स्वतंत्र किसान बनने में मदद की',
//         titleMr: 'KCC ने मला स्वतंत्र शेतकरी बनण्यास मदत केली',
//         summary: 'As a woman farmer, getting credit was always difficult. KCC gave me ₹2 lakh at just 4% interest, helping me buy better equipment and seeds.',
//         summaryHi: 'एक महिला किसान के रूप में, क्रेडिट पाना हमेशा मुश्किल था। KCC ने मुझे सिर्फ 4% ब्याज पर ₹2 लाख दिए, जिससे मुझे बेहतर उपकरण और बीज खरीदने में मदद मिली।',
//         summaryMr: 'एक महिला शेतकरी म्हणून, कर्ज मिळवणे नेहमीच कठीण होते. KCC ने मला फक्त 4% व्याजावर ₹2 लाख दिले, ज्यामुळे मला चांगली उपकरणे आणि बियाणे खरेदी करण्यास मदत झाली.',
//         benefitAmount: '₹2,00,000',
//         incomeIncrease: '60%',
//         likes: 456,
//         comments: 89,
//         shares: 167,
//         views: 2100,
//         isVerified: true,
//         isFeatured: false,
//         postedDaysAgo: 12,
//         tags: ['kcc', 'women-farmer', 'pulses', 'rajasthan'],
//     },
//     {
//         id: '4',
//         farmerName: 'Suresh Kumar',
//         farmerNameHi: 'सुरेश कुमार',
//         farmerNameMr: 'सुरेश कुमार',
//         farmerImage: '',
//         location: 'Kanpur, Uttar Pradesh',
//         locationHi: 'कानपुर, उत्तर प्रदेश',
//         locationMr: 'कानपूर, उत्तर प्रदेश',
//         state: 'up',
//         cropType: 'Sugarcane',
//         cropTypeHi: 'गन्ना',
//         cropTypeMr: 'ऊस',
//         landSize: 0.8,
//         landUnit: 'Hectares',
//         landCategory: 'marginal',
//         scheme: 'Soil Health Card',
//         schemeHi: 'मृदा स्वास्थ्य कार्ड',
//         schemeMr: 'मृदा आरोग्य कार्ड',
//         schemeId: 'soil-health',
//         title: 'Soil Testing Changed How I Farm',
//         titleHi: 'मिट्टी परीक्षण ने मेरी खेती का तरीका बदल दिया',
//         titleMr: 'माती परीक्षणाने माझी शेती पद्धत बदलली',
//         summary: 'Free soil testing showed my land lacked specific nutrients. Following the recommendations, I reduced fertilizer costs by 30% while improving yield.',
//         summaryHi: 'मुफ्त मिट्टी परीक्षण से पता चला कि मेरी जमीन में विशेष पोषक तत्वों की कमी है। सिफारिशों का पालन करके, मैंने उपज में सुधार करते हुए उर्वरक लागत 30% कम की।',
//         summaryMr: 'मोफत माती परीक्षणाने दाखवले की माझ्या जमिनीत विशिष्ट पोषक तत्वांची कमतरता आहे. शिफारशींचे पालन करून, मी उत्पादन सुधारत खत खर्च 30% कमी केला.',
//         benefitAmount: '₹5,000',
//         costSaving: '₹12,000',
//         yieldImprovement: '25%',
//         likes: 189,
//         comments: 34,
//         shares: 56,
//         views: 890,
//         isVerified: true,
//         isFeatured: false,
//         postedDaysAgo: 21,
//         tags: ['soil-health', 'sugarcane', 'up', 'marginal-farmer'],
//     },
//     {
//         id: '5',
//         farmerName: 'Prakash Yadav',
//         farmerNameHi: 'प्रकाश यादव',
//         farmerNameMr: 'प्रकाश यादव',
//         farmerImage: '',
//         location: 'Bhopal, Madhya Pradesh',
//         locationHi: 'भोपाल, मध्य प्रदेश',
//         locationMr: 'भोपाळ, मध्य प्रदेश',
//         state: 'mp',
//         cropType: 'Cotton',
//         cropTypeHi: 'कपास',
//         cropTypeMr: 'कापूस',
//         landSize: 3,
//         landUnit: 'Hectares',
//         landCategory: 'medium',
//         scheme: 'PM-KUSUM Solar Pump',
//         schemeHi: 'पीएम-कुसुम सोलर पंप',
//         schemeMr: 'पीएम-कुसुम सोलर पंप',
//         schemeId: 'pm-kusum',
//         title: 'Solar Pump Ended My Electricity Worries',
//         titleHi: 'सोलर पंप ने मेरी बिजली की चिंताएं खत्म कीं',
//         titleMr: 'सोलर पंपाने माझ्या विजेच्या चिंता संपवल्या',
//         summary: 'With 60% subsidy on solar pump through PM-KUSUM, I now have reliable irrigation without depending on erratic electricity supply. Saving ₹15,000 yearly on electricity bills.',
//         summaryHi: 'पीएम-कुसुम के माध्यम से सोलर पंप पर 60% सब्सिडी के साथ, अब मेरे पास अनियमित बिजली आपूर्ति पर निर्भर हुए बिना विश्वसनीय सिंचाई है। बिजली बिलों पर सालाना ₹15,000 की बचत।',
//         summaryMr: 'पीएम-कुसुम द्वारे सोलर पंपावर 60% अनुदानासह, आता माझ्याकडे अनियमित वीज पुरवठ्यावर अवलंबून न राहता विश्वसनीय सिंचन आहे. वीज बिलांवर वार्षिक ₹15,000 बचत.',
//         benefitAmount: '₹90,000',
//         costSaving: '₹15,000/year',
//         likes: 345,
//         comments: 67,
//         shares: 123,
//         views: 1800,
//         isVerified: true,
//         isFeatured: true,
//         postedDaysAgo: 5,
//         tags: ['pm-kusum', 'solar', 'cotton', 'mp', 'irrigation'],
//     },
// ];


// // ─── Case Studies Data ──────────────────────────────────────────
// const caseStudiesData: CaseStudy[] = [
//     {
//         id: 'cs1',
//         title: 'PM-Kisan Impact in Maharashtra',
//         titleHi: 'महाराष्ट्र में पीएम-किसान का प्रभाव',
//         titleMr: 'महाराष्ट्रातील पीएम-किसान प्रभाव',
//         description: 'How direct benefit transfer transformed farming in Vidarbha region',
//         descriptionHi: 'कैसे प्रत्यक्ष लाभ हस्तांतरण ने विदर्भ क्षेत्र में खेती को बदल दिया',
//         descriptionMr: 'थेट लाभ हस्तांतरणाने विदर्भ प्रदेशातील शेती कशी बदलली',
//         scheme: 'PM-Kisan',
//         schemeHi: 'पीएम-किसान',
//         schemeMr: 'पीएम-किसान',
//         farmersImpacted: 125000,
//         totalBenefits: '₹75 Cr',
//         region: 'Vidarbha, Maharashtra',
//         regionHi: 'विदर्भ, महाराष्ट्र',
//         regionMr: 'विदर्भ, महाराष्ट्र',
//         duration: '2023-2024',
//         durationHi: '2023-2024',
//         durationMr: '2023-2024',
//         icon: '🏛️',
//     },
//     {
//         id: 'cs2',
//         title: 'PMFBY Success in Flood-Prone Areas',
//         titleHi: 'बाढ़ प्रवण क्षेत्रों में PMFBY सफलता',
//         titleMr: 'पूरप्रवण भागांत PMFBY यश',
//         description: 'Crop insurance coverage and claim settlement in Bihar & UP',
//         descriptionHi: 'बिहार और यूपी में फसल बीमा कवरेज और दावा निपटान',
//         descriptionMr: 'बिहार आणि यूपी मध्ये पीक विमा कव्हरेज आणि दावा निपटारा',
//         scheme: 'PMFBY',
//         schemeHi: 'पीएमएफबीवाई',
//         schemeMr: 'पीएमएफबीवाय',
//         farmersImpacted: 340000,
//         totalBenefits: '₹420 Cr',
//         region: 'Bihar & Uttar Pradesh',
//         regionHi: 'बिहार और उत्तर प्रदेश',
//         regionMr: 'बिहार आणि उत्तर प्रदेश',
//         duration: 'Kharif 2023',
//         durationHi: 'खरीफ 2023',
//         durationMr: 'खरीप 2023',
//         icon: '🌾',
//     },
// ];


// // ─── Scheme Benefits Placeholder Data ───────────────────────────
// // NOTE: This section is designed to be easily updated when scheme information changes
// // Each scheme has a lastUpdated timestamp and isPlaceholder flag
// const schemeBenefitsData: SchemeBenefitInfo[] = [
//     {
//         id: 'pm-kisan-benefits',
//         schemeName: 'PM-Kisan Samman Nidhi',
//         schemeNameHi: 'पीएम-किसान सम्मान निधि',
//         schemeNameMr: 'पीएम-किसान सन्मान निधी',
//         icon: '🏛️',
//         benefits: [
//             {
//                 title: 'Annual Support',
//                 titleHi: 'वार्षिक सहायता',
//                 titleMr: 'वार्षिक मदत',
//                 value: '₹6,000/year',
//                 valueHi: '₹6,000/वर्ष',
//                 valueMr: '₹6,000/वर्ष',
//             },
//             {
//                 title: 'Installments',
//                 titleHi: 'किश्तें',
//                 titleMr: 'हप्ते',
//                 value: '3 installments of ₹2,000',
//                 valueHi: '₹2,000 की 3 किश्तें',
//                 valueMr: '₹2,000 चे 3 हप्ते',
//             },
//         ],
//         stats: [
//             { label: 'Beneficiaries', labelHi: 'लाभार्थी', labelMr: 'लाभार्थी', value: '11 Cr+' },
//             { label: 'Total Disbursed', labelHi: 'कुल वितरित', labelMr: 'एकूण वितरित', value: '₹2.5 Lakh Cr+' },
//         ],
//         lastUpdated: '2024-01-15',
//         isPlaceholder: false,
//     },
//     {
//         id: 'pmfby-benefits',
//         schemeName: 'PM Fasal Bima Yojana',
//         schemeNameHi: 'पीएम फसल बीमा योजना',
//         schemeNameMr: 'पीएम पीक विमा योजना',
//         icon: '🌾',
//         benefits: [
//             {
//                 title: 'Premium (Kharif)',
//                 titleHi: 'प्रीमियम (खरीफ)',
//                 titleMr: 'प्रीमियम (खरीप)',
//                 value: '2% of sum insured',
//                 valueHi: 'बीमित राशि का 2%',
//                 valueMr: 'विमाकृत रकमेच्या 2%',
//             },
//             {
//                 title: 'Premium (Rabi)',
//                 titleHi: 'प्रीमियम (रबी)',
//                 titleMr: 'प्रीमियम (रब्बी)',
//                 value: '1.5% of sum insured',
//                 valueHi: 'बीमित राशि का 1.5%',
//                 valueMr: 'विमाकृत रकमेच्या 1.5%',
//             },
//         ],
//         stats: [
//             { label: 'Claims Settled', labelHi: 'दावे निपटाए', labelMr: 'दावे निकाली', value: '4 Cr+' },
//             { label: 'Coverage', labelHi: 'कवरेज', labelMr: 'कव्हरेज', value: '₹2 Lakh Cr+' },
//         ],
//         lastUpdated: '2024-01-10',
//         isPlaceholder: false,
//     },
//     // PLACEHOLDER: Add more schemes here when information is available
//     {
//         id: 'new-scheme-placeholder',
//         schemeName: 'New Scheme (Coming Soon)',
//         schemeNameHi: 'नई योजना (जल्द आ रही है)',
//         schemeNameMr: 'नवीन योजना (लवकरच येत आहे)',
//         icon: '🆕',
//         benefits: [],
//         stats: [],
//         lastUpdated: '',
//         isPlaceholder: true,
//     },
// ];


// // ─── Video Testimonials Placeholder ─────────────────────────────
// interface VideoTestimonial {
//     id: string;
//     title: string;
//     titleHi: string;
//     titleMr: string;
//     farmerName: string;
//     location: string;
//     locationHi: string;
//     locationMr: string;
//     thumbnail?: string;
//     duration: string;
//     views: number;
//     scheme: string;
// }


// const videoTestimonialsData: VideoTestimonial[] = [
//     {
//         id: 'v1',
//         title: 'My PM-Kisan Success Story',
//         titleHi: 'मेरी पीएम-किसान सफलता की कहानी',
//         titleMr: 'माझी पीएम-किसान यशोगाथा',
//         farmerName: 'Ramesh Patil',
//         location: 'Nashik, Maharashtra',
//         locationHi: 'नासिक, महाराष्ट्र',
//         locationMr: 'नाशिक, महाराष्ट्र',
//         duration: '3:45',
//         views: 12500,
//         scheme: 'PM-Kisan',
//     },
//     {
//         id: 'v2',
//         title: 'How Crop Insurance Saved My Farm',
//         titleHi: 'फसल बीमा ने कैसे मेरा खेत बचाया',
//         titleMr: 'पीक विम्याने माझी शेती कशी वाचवली',
//         farmerName: 'Gurpreet Singh',
//         location: 'Ludhiana, Punjab',
//         locationHi: 'लुधियाना, पंजाब',
//         locationMr: 'लुधियाना, पंजाब',
//         duration: '5:20',
//         views: 34000,
//         scheme: 'PMFBY',
//     },
// ];


// // ─── Component ──────────────────────────────────────────────────
// export function CommunityEngagement() {
//     const navigate = useNavigate();
//     const { language } = useLanguage();
//     const { userData } = useUser();
//     const isHindi = language === 'hi';
//     const isMarathi = language === 'mr';


//     // ─── Translation helper ───────────────────────────────────
//     const t = useCallback((key: keyof typeof translations) => {
//         const translation = translations[key];
//         if (translation) {
//             if (isMarathi && 'mr' in translation) return translation.mr;
//             if (isHindi && 'hi' in translation) return translation.hi;
//             return translation.en;
//         }
//         return key;
//     }, [isHindi, isMarathi]);


//     // ─── State ────────────────────────────────────────────────
//     const [searchQuery, setSearchQuery] = useState('');
//     const [activeTab, setActiveTab] = useState<'all' | 'recommended' | 'trending' | 'recent'>('all');
//     const [showFilters, setShowFilters] = useState(false);
//     const [selectedCropType, setSelectedCropType] = useState('all');
//     const [selectedLandSize, setSelectedLandSize] = useState('all');
//     const [selectedScheme, setSelectedScheme] = useState('all');
//     const [selectedRegion, setSelectedRegion] = useState('all');
//     const [expandedStory, setExpandedStory] = useState<string | null>(null);
//     const [savedStories, setSavedStories] = useState<Set<string>>(new Set());
//     const [likedStories, setLikedStories] = useState<Set<string>>(new Set());


//     // ─── Filter options ───────────────────────────────────────
//     const cropTypes = [
//         { key: 'all', en: 'All Crops', hi: 'सभी फसलें', mr: 'सर्व पिके' },
//         { key: 'wheat', en: 'Wheat', hi: 'गेहूं', mr: 'गहू' },
//         { key: 'rice', en: 'Rice', hi: 'धान', mr: 'तांदूळ' },
//         { key: 'cotton', en: 'Cotton', hi: 'कपास', mr: 'कापूस' },
//         { key: 'sugarcane', en: 'Sugarcane', hi: 'गन्ना', mr: 'ऊस' },
//         { key: 'vegetables', en: 'Vegetables', hi: 'सब्जियां', mr: 'भाज्या' },
//         { key: 'fruits', en: 'Fruits', hi: 'फल', mr: 'फळे' },
//         { key: 'pulses', en: 'Pulses', hi: 'दालें', mr: 'डाळी' },
//     ];


//     const landSizes = [
//         { key: 'all', en: 'All Sizes', hi: 'सभी आकार', mr: 'सर्व आकार' },
//         { key: 'marginal', en: 'Marginal (<1 ha)', hi: 'सीमांत (<1 हे)', mr: 'अल्प (<1 हे)' },
//         { key: 'small', en: 'Small (1-2 ha)', hi: 'छोटा (1-2 हे)', mr: 'लहान (1-2 हे)' },
//         { key: 'medium', en: 'Medium (2-4 ha)', hi: 'मध्यम (2-4 हे)', mr: 'मध्यम (2-4 हे)' },
//         { key: 'large', en: 'Large (>4 ha)', hi: 'बड़ा (>4 हे)', mr: 'मोठा (>4 हे)' },
//     ];


//     const schemes = [
//         { key: 'all', en: 'All Schemes', hi: 'सभी योजनाएं', mr: 'सर्व योजना' },
//         { key: 'pm-kisan', en: 'PM-Kisan', hi: 'पीएम-किसान', mr: 'पीएम-किसान' },
//         { key: 'pmfby', en: 'PM Fasal Bima', hi: 'पीएम फसल बीमा', mr: 'पीएम पीक विमा' },
//         { key: 'kcc', en: 'Kisan Credit Card', hi: 'किसान क्रेडिट कार्ड', mr: 'किसान क्रेडिट कार्ड' },
//         { key: 'soil-health', en: 'Soil Health Card', hi: 'मृदा स्वास्थ्य कार्ड', mr: 'मृदा आरोग्य कार्ड' },
//         { key: 'pm-kusum', en: 'PM-KUSUM', hi: 'पीएम-कुसुम', mr: 'पीएम-कुसुम' },
//     ];


//     const regions = [
//         { key: 'all', en: 'All Regions', hi: 'सभी क्षेत्र', mr: 'सर्व प्रदेश' },
//         { key: 'maharashtra', en: 'Maharashtra', hi: 'महाराष्ट्र', mr: 'महाराष्ट्र' },
//         { key: 'punjab', en: 'Punjab', hi: 'पंजाब', mr: 'पंजाब' },
//         { key: 'up', en: 'Uttar Pradesh', hi: 'उत्तर प्रदेश', mr: 'उत्तर प्रदेश' },
//         { key: 'mp', en: 'Madhya Pradesh', hi: 'मध्य प्रदेश', mr: 'मध्य प्रदेश' },
//         { key: 'rajasthan', en: 'Rajasthan', hi: 'राजस्थान', mr: 'राजस्थान' },
//     ];


//     // ─── Helper functions ─────────────────────────────────────
//     const getOptionLabel = (option: { key: string; en: string; hi: string; mr: string }) => {
//         if (isMarathi) return option.mr;
//         if (isHindi) return option.hi;
//         return option.en;
//     };


//     const getStoryTitle = (story: SuccessStory) => {
//         if (isMarathi) return story.titleMr;
//         if (isHindi) return story.titleHi;
//         return story.title;
//     };


//     const getStorySummary = (story: SuccessStory) => {
//         if (isMarathi) return story.summaryMr;
//         if (isHindi) return story.summaryHi;
//         return story.summary;
//     };


//     const getFarmerName = (story: SuccessStory) => {
//         if (isMarathi) return story.farmerNameMr;
//         if (isHindi) return story.farmerNameHi;
//         return story.farmerName;
//     };


//     const getLocation = (story: SuccessStory) => {
//         if (isMarathi) return story.locationMr;
//         if (isHindi) return story.locationHi;
//         return story.location;
//     };


//     const getCropType = (story: SuccessStory) => {
//         if (isMarathi) return story.cropTypeMr;
//         if (isHindi) return story.cropTypeHi;
//         return story.cropType;
//     };


//     const getSchemeName = (story: SuccessStory) => {
//         if (isMarathi) return story.schemeMr;
//         if (isHindi) return story.schemeHi;
//         return story.scheme;
//     };


//     const getTimeAgo = (days: number) => {
//         if (days < 7) {
//             return `${days} ${t('daysAgo')}`;
//         } else if (days < 30) {
//             const weeks = Math.floor(days / 7);
//             return `${weeks} ${t('weeksAgo')}`;
//         } else {
//             const months = Math.floor(days / 30);
//             return `${months} ${t('monthsAgo')}`;
//         }
//     };


//     // ─── Filtered stories ─────────────────────────────────────
//     const filteredStories = useMemo(() => {
//         let stories = [...successStoriesData];


//         // Apply filters
//         if (selectedCropType !== 'all') {
//             stories = stories.filter(s => s.tags.some(tag => tag.includes(selectedCropType)));
//         }
//         if (selectedLandSize !== 'all') {
//             stories = stories.filter(s => s.landCategory === selectedLandSize);
//         }
//         if (selectedScheme !== 'all') {
//             stories = stories.filter(s => s.schemeId === selectedScheme);
//         }
//         if (selectedRegion !== 'all') {
//             stories = stories.filter(s => s.state === selectedRegion);
//         }


//         // Apply search
//         if (searchQuery.trim()) {
//             const q = searchQuery.toLowerCase();
//             stories = stories.filter(s =>
//                 s.title.toLowerCase().includes(q) ||
//                 s.titleHi.includes(searchQuery) ||
//                 s.titleMr.includes(searchQuery) ||
//                 s.scheme.toLowerCase().includes(q) ||
//                 s.cropType.toLowerCase().includes(q) ||
//                 s.farmerName.toLowerCase().includes(q)
//             );
//         }


//         // Apply tab filter
//         switch (activeTab) {
//             case 'recommended':
//                 // Filter based on user's profile (land size, state, crop preferences)
//                 stories = stories.filter(s => {
//                     const matchesState = !userData.state || s.state === userData.state.toLowerCase();
//                     const matchesLandSize = !userData.landSize ||
//                         (userData.landSize < 1 && s.landCategory === 'marginal') ||
//                         (userData.landSize >= 1 && userData.landSize < 2 && s.landCategory === 'small') ||
//                         (userData.landSize >= 2 && userData.landSize < 4 && s.landCategory === 'medium') ||
//                         (userData.landSize >= 4 && s.landCategory === 'large');
//                     return matchesState || matchesLandSize;
//                 });
//                 break;
//             case 'trending':
//                 stories = stories.sort((a, b) => (b.likes + b.shares * 2) - (a.likes + a.shares * 2));
//                 break;
//             case 'recent':
//                 stories = stories.sort((a, b) => a.postedDaysAgo - b.postedDaysAgo);
//                 break;
//         }


//         return stories;
//     }, [selectedCropType, selectedLandSize, selectedScheme, selectedRegion, searchQuery, activeTab, userData]);


//     // Featured stories
//     const featuredStories = useMemo(() => {
//         return successStoriesData.filter(s => s.isFeatured).slice(0, 3);
//     }, []);


//     // ─── Handlers ─────────────────────────────────────────────
//     const handleLike = useCallback((storyId: string) => {
//         setLikedStories(prev => {
//             const next = new Set(prev);
//             if (next.has(storyId)) {
//                 next.delete(storyId);
//             } else {
//                 next.add(storyId);
//             }
//             return next;
//         });
//     }, []);


//     const handleSave = useCallback((storyId: string) => {
//         setSavedStories(prev => {
//             const next = new Set(prev);
//             if (next.has(storyId)) {
//                 next.delete(storyId);
//             } else {
//                 next.add(storyId);
//             }
//             return next;
//         });
//     }, []);


//     const handleShare = useCallback((story: SuccessStory) => {
//         const text = isMarathi
//             ? `${getFarmerName(story)} यांची यशोगाथा वाचा: ${getStoryTitle(story)}`
//             : isHindi
//                 ? `${getFarmerName(story)} की सफलता की कहानी पढ़ें: ${getStoryTitle(story)}`
//                 : `Read ${getFarmerName(story)}'s success story: ${getStoryTitle(story)}`;


//         if (navigator.share) {
//             navigator.share({ title: getStoryTitle(story), text }).catch(() => { });
//         } else {
//             navigator.clipboard?.writeText(text).catch(() => { });
//         }
//     }, [isHindi, isMarathi]);


//     const clearFilters = useCallback(() => {
//         setSelectedCropType('all');
//         setSelectedLandSize('all');
//         setSelectedScheme('all');
//         setSelectedRegion('all');
//     }, []);


//     const activeFiltersCount = useMemo(() => {
//         let count = 0;
//         if (selectedCropType !== 'all') count++;
//         if (selectedLandSize !== 'all') count++;
//         if (selectedScheme !== 'all') count++;
//         if (selectedRegion !== 'all') count++;
//         return count;
//     }, [selectedCropType, selectedLandSize, selectedScheme, selectedRegion]);


//     // ─── Render Success Story Card ────────────────────────────
//     const renderStoryCard = (story: SuccessStory, index: number, isFeatured = false) => {
//         const isExpanded = expandedStory === story.id;
//         const isLiked = likedStories.has(story.id);
//         const isSaved = savedStories.has(story.id);


//         return (
//             <motion.div
//                 key={story.id}
//                 initial={{ opacity: 0, y: 15 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.25, delay: index * 0.05 }}
//                 className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden ${isFeatured ? 'border-l-4 border-l-[#F5A623]' : ''
//                     }`}
//             >
//                 {/* Featured badge */}
//                 {story.isFeatured && (
//                     <div className="bg-gradient-to-r from-[#F5A623] to-[#FFD93D] px-4 py-1.5 flex items-center gap-2">
//                         <Star className="w-3.5 h-3.5 text-white" fill="white" />
//                         <span className="text-[11px] font-bold text-white uppercase tracking-wide">
//                             {t('featuredStories')}
//                         </span>
//                     </div>
//                 )}


//                 <div className="p-4">
//                     {/* Farmer info header */}
//                     <div className="flex items-start gap-3 mb-3">
//                         <div className="w-12 h-12 rounded-full bg-[#2D6A2D]/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
//                             {story.farmerImage ? (
//                                 <img src={story.farmerImage} alt="" className="w-full h-full object-cover" />
//                             ) : (
//                                 <span className="text-[20px]">👨‍🌾</span>
//                             )}
//                         </div>
//                         <div className="flex-1 min-w-0">
//                             <div className="flex items-center gap-2 mb-0.5">
//                                 <h4 className="font-semibold text-[14px] text-[#1C1C1E] truncate">
//                                     {getFarmerName(story)}
//                                 </h4>
//                                 {story.isVerified && (
//                                     <div className="flex items-center gap-1 bg-[#97BC62]/10 px-1.5 py-0.5 rounded-full">
//                                         <CheckCircle className="w-3 h-3 text-[#2D6A2D]" />
//                                         <span className="text-[9px] font-medium text-[#2D6A2D]">{t('verified')}</span>
//                                     </div>
//                                 )}
//                             </div>
//                             <div className="flex items-center gap-2 text-[11px] text-[#6B7280]">
//                                 <MapPin className="w-3 h-3" />
//                                 <span>{getLocation(story)}</span>
//                                 <span>•</span>
//                                 <Clock className="w-3 h-3" />
//                                 <span>{getTimeAgo(story.postedDaysAgo)}</span>
//                             </div>
//                         </div>
//                         <button
//                             onClick={() => handleSave(story.id)}
//                             className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isSaved ? 'bg-[#F5A623]/10' : 'bg-gray-50 hover:bg-gray-100'
//                                 }`}
//                         >
//                             <Bookmark
//                                 className={`w-4 h-4 ${isSaved ? 'text-[#F5A623] fill-[#F5A623]' : 'text-gray-400'}`}
//                             />
//                         </button>
//                     </div>


//                     {/* Tags */}
//                     <div className="flex flex-wrap gap-1.5 mb-3">
//                         <span className="px-2 py-0.5 bg-[#2D6A2D]/10 text-[#2D6A2D] rounded-full text-[10px] font-medium">
//                             {getSchemeName(story)}
//                         </span>
//                         <span className="px-2 py-0.5 bg-[#F5A623]/10 text-[#F5A623] rounded-full text-[10px] font-medium flex items-center gap-1">
//                             <Wheat className="w-3 h-3" />
//                             {getCropType(story)}
//                         </span>
//                         <span className="px-2 py-0.5 bg-gray-100 text-[#6B7280] rounded-full text-[10px] font-medium">
//                             {story.landSize} {story.landUnit}
//                         </span>
//                     </div>


//                     {/* Story title */}
//                     <h3 className="font-semibold text-[15px] text-[#1C1C1E] mb-2 leading-tight">
//                         {getStoryTitle(story)}
//                     </h3>


//                     {/* Story summary */}
//                     <p className={`text-[13px] text-[#6B7280] leading-relaxed ${!isExpanded ? 'line-clamp-3' : ''}`}>
//                         {getStorySummary(story)}
//                     </p>


//                     {/* Expand/collapse */}
//                     <button
//                         onClick={() => setExpandedStory(isExpanded ? null : story.id)}
//                         className="flex items-center gap-1 text-[#F5A623] text-[12px] font-medium mt-2"
//                     >
//                         {isExpanded ? (
//                             <>
//                                 <ChevronUp className="w-4 h-4" />
//                                 {isMarathi ? 'कमी दाखवा' : isHindi ? 'कम दिखाएं' : 'Show Less'}
//                             </>
//                         ) : (
//                             <>
//                                 <ChevronDown className="w-4 h-4" />
//                                 {t('readMore')}
//                             </>
//                         )}
//                     </button>


//                     {/* Benefits stats */}
//                     {(story.benefitAmount || story.incomeIncrease || story.yieldImprovement || story.costSaving) && (
//                         <div className="grid grid-cols-2 gap-2 mt-3 bg-[#F7F3EE] rounded-xl p-3">
//                             {story.benefitAmount && (
//                                 <div className="flex items-center gap-2">
//                                     <div className="w-8 h-8 rounded-lg bg-[#97BC62]/20 flex items-center justify-center">
//                                         <IndianRupee className="w-4 h-4 text-[#2D6A2D]" />
//                                     </div>
//                                     <div>
//                                         <p className="text-[10px] text-[#6B7280]">{t('benefitReceived')}</p>
//                                         <p className="text-[13px] font-bold text-[#2D6A2D]">{story.benefitAmount}</p>
//                                     </div>
//                                 </div>
//                             )}
//                             {story.incomeIncrease && (
//                                 <div className="flex items-center gap-2">
//                                     <div className="w-8 h-8 rounded-lg bg-[#F5A623]/20 flex items-center justify-center">
//                                         <TrendingUp className="w-4 h-4 text-[#F5A623]" />
//                                     </div>
//                                     <div>
//                                         <p className="text-[10px] text-[#6B7280]">{t('incomeIncrease')}</p>
//                                         <p className="text-[13px] font-bold text-[#F5A623]">+{story.incomeIncrease}</p>
//                                     </div>
//                                 </div>
//                             )}
//                             {story.yieldImprovement && (
//                                 <div className="flex items-center gap-2">
//                                     <div className="w-8 h-8 rounded-lg bg-[#60A5FA]/20 flex items-center justify-center">
//                                         <Wheat className="w-4 h-4 text-[#2563EB]" />
//                                     </div>
//                                     <div>
//                                         <p className="text-[10px] text-[#6B7280]">{t('yieldImprovement')}</p>
//                                         <p className="text-[13px] font-bold text-[#2563EB]">+{story.yieldImprovement}</p>
//                                     </div>
//                                 </div>
//                             )}
//                             {story.costSaving && (
//                                 <div className="flex items-center gap-2">
//                                     <div className="w-8 h-8 rounded-lg bg-[#34D399]/20 flex items-center justify-center">
//                                         <IndianRupee className="w-4 h-4 text-[#059669]" />
//                                     </div>
//                                     <div>
//                                         <p className="text-[10px] text-[#6B7280]">{t('costSaving')}</p>
//                                         <p className="text-[13px] font-bold text-[#059669]">{story.costSaving}</p>
//                                     </div>
//                                 </div>
//                             )}
//                         </div>
//                     )}


//                     {/* Video indicator */}
//                     {story.videoUrl && (
//                         <button className="w-full mt-3 py-2.5 bg-[#2D6A2D]/5 border border-[#2D6A2D]/20 rounded-xl flex items-center justify-center gap-2 hover:bg-[#2D6A2D]/10 transition-colors">
//                             <Play className="w-4 h-4 text-[#2D6A2D]" />
//                             <span className="text-[12px] font-medium text-[#2D6A2D]">{t('watchVideo')}</span>
//                         </button>
//                     )}


//                     {/* Engagement stats */}
//                     <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
//                         <div className="flex items-center gap-4">
//                             <button
//                                 onClick={() => handleLike(story.id)}
//                                 className={`flex items-center gap-1.5 ${isLiked ? 'text-[#F87171]' : 'text-[#6B7280]'}`}
//                             >
//                                 <Heart className={`w-4 h-4 ${isLiked ? 'fill-[#F87171]' : ''}`} />
//                                 <span className="text-[12px] font-medium">
//                                     {story.likes + (isLiked ? 1 : 0)}
//                                 </span>
//                             </button>
//                             <button className="flex items-center gap-1.5 text-[#6B7280]">
//                                 <MessageCircle className="w-4 h-4" />
//                                 <span className="text-[12px] font-medium">{story.comments}</span>
//                             </button>
//                             <button
//                                 onClick={() => handleShare(story)}
//                                 className="flex items-center gap-1.5 text-[#6B7280]"
//                             >
//                                 <Share2 className="w-4 h-4" />
//                                 <span className="text-[12px] font-medium">{story.shares}</span>
//                             </button>
//                         </div>
//                         <div className="flex items-center gap-1 text-[#9CA3AF]">
//                             <Eye className="w-3.5 h-3.5" />
//                             <span className="text-[11px]">{story.views.toLocaleString()} {t('views')}</span>
//                         </div>
//                     </div>
//                 </div>
//             </motion.div>
//         );
//     };


//     // ─── Render Case Study Card ───────────────────────────────
//     const renderCaseStudyCard = (caseStudy: CaseStudy) => (
//         <div key={caseStudy.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 min-w-[280px] snap-start">
//             <div className="flex items-start gap-3 mb-3">
//                 <div className="w-12 h-12 rounded-2xl bg-[#2D6A2D]/10 flex items-center justify-center flex-shrink-0">
//                     <span className="text-[24px]">{caseStudy.icon}</span>
//                 </div>
//                 <div className="flex-1">
//                     <h4 className="font-semibold text-[14px] text-[#1C1C1E] line-clamp-2">
//                         {isMarathi ? caseStudy.titleMr : isHindi ? caseStudy.titleHi : caseStudy.title}
//                     </h4>
//                     <p className="text-[11px] text-[#6B7280] mt-0.5">
//                         {isMarathi ? caseStudy.regionMr : isHindi ? caseStudy.regionHi : caseStudy.region}
//                     </p>
//                 </div>
//             </div>


//             <p className="text-[12px] text-[#6B7280] mb-3 line-clamp-2">
//                 {isMarathi ? caseStudy.descriptionMr : isHindi ? caseStudy.descriptionHi : caseStudy.description}
//             </p>


//             <div className="grid grid-cols-2 gap-2 mb-3">
//                 <div className="bg-[#F7F3EE] rounded-lg px-3 py-2">
//                     <p className="text-[10px] text-[#6B7280]">{t('happyFarmers')}</p>
//                     <p className="text-[14px] font-bold text-[#2D6A2D]">
//                         {caseStudy.farmersImpacted.toLocaleString()}+
//                     </p>
//                 </div>
//                 <div className="bg-[#F7F3EE] rounded-lg px-3 py-2">
//                     <p className="text-[10px] text-[#6B7280]">{t('totalBenefits')}</p>
//                     <p className="text-[14px] font-bold text-[#F5A623]">{caseStudy.totalBenefits}</p>
//                 </div>
//             </div>


//             <button className="w-full py-2 border border-[#2D6A2D]/30 text-[#2D6A2D] rounded-xl text-[12px] font-medium flex items-center justify-center gap-1.5 hover:bg-[#2D6A2D]/5 transition-colors">
//                 {t('readFull')}
//                 <ChevronRight className="w-4 h-4" />
//             </button>
//         </div>
//     );


//     // ─── Render Video Testimonial Card ────────────────────────
//     const renderVideoCard = (video: VideoTestimonial) => (
//         <div key={video.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden min-w-[200px] snap-start">
//             <div className="relative h-28 bg-gradient-to-br from-[#1A3C1A] to-[#2D6A2D] flex items-center justify-center">
//                 <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
//                     <Play className="w-6 h-6 text-white fill-white" />
//                 </div>
//                 <div className="absolute bottom-2 right-2 bg-black/60 px-2 py-0.5 rounded text-white text-[10px] font-medium">
//                     {video.duration}
//                 </div>
//             </div>
//             <div className="p-3">
//                 <h4 className="font-semibold text-[12px] text-[#1C1C1E] line-clamp-2 mb-1">
//                     {isMarathi ? video.titleMr : isHindi ? video.titleHi : video.title}
//                 </h4>
//                 <p className="text-[10px] text-[#6B7280]">
//                     {video.farmerName} • {video.views.toLocaleString()} {t('views')}
//                 </p>
//             </div>
//         </div>
//     );


//     // ─── Render Scheme Benefits Card ──────────────────────────
//     const renderSchemeBenefitCard = (benefit: SchemeBenefitInfo) => {
//         if (benefit.isPlaceholder) {
//             return (
//                 <div key={benefit.id} className="bg-gray-50 rounded-2xl p-4 border-2 border-dashed border-gray-200 min-w-[260px] snap-start">
//                     <div className="flex items-center gap-3 mb-3">
//                         <span className="text-[24px]">{benefit.icon}</span>
//                         <div>
//                             <p className="font-medium text-[13px] text-[#6B7280]">
//                                 {isMarathi ? benefit.schemeNameMr : isHindi ? benefit.schemeNameHi : benefit.schemeName}
//                             </p>
//                             <p className="text-[10px] text-[#9CA3AF]">{t('comingSoon')}</p>
//                         </div>
//                     </div>
//                     <p className="text-[11px] text-[#9CA3AF] text-center py-4">
//                         {t('schemeInfoPlaceholder')}
//                     </p>
//                 </div>
//             );
//         }


//         return (
//             <div key={benefit.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 min-w-[260px] snap-start">
//                 <div className="flex items-center gap-3 mb-3">
//                     <span className="text-[24px]">{benefit.icon}</span>
//                     <div>
//                         <p className="font-semibold text-[14px] text-[#1C1C1E]">
//                             {isMarathi ? benefit.schemeNameMr : isHindi ? benefit.schemeNameHi : benefit.schemeName}
//                         </p>
//                         {benefit.lastUpdated && (
//                             <p className="text-[9px] text-[#9CA3AF]">
//                                 {isMarathi ? 'अपडेट:' : isHindi ? 'अपडेट:' : 'Updated:'} {benefit.lastUpdated}
//                             </p>
//                         )}
//                     </div>
//                 </div>


//                 <div className="space-y-2 mb-3">
//                     {benefit.benefits.map((b, i) => (
//                         <div key={i} className="flex justify-between items-center bg-[#F7F3EE] rounded-lg px-3 py-2">
//                             <span className="text-[11px] text-[#6B7280]">
//                                 {isMarathi ? b.titleMr : isHindi ? b.titleHi : b.title}
//                             </span>
//                             <span className="text-[12px] font-semibold text-[#2D6A2D]">
//                                 {isMarathi ? b.valueMr : isHindi ? b.valueHi : b.value}
//                             </span>
//                         </div>
//                     ))}
//                 </div>


//                 <div className="grid grid-cols-2 gap-2">
//                     {benefit.stats.map((stat, i) => (
//                         <div key={i} className="text-center">
//                             <p className="text-[16px] font-bold text-[#F5A623]">{stat.value}</p>
//                             <p className="text-[9px] text-[#6B7280]">
//                                 {isMarathi ? stat.labelMr : isHindi ? stat.labelHi : stat.label}
//                             </p>
//                         </div>
//                     ))}
//                 </div>
//             </div>
//         );
//     };


//     // ─── Render Filters Modal ─────────────────────────────────
//     const renderFiltersModal = () => (
//         <AnimatePresence>
//             {showFilters && (
//                 <motion.div
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: 1 }}
//                     exit={{ opacity: 0 }}
//                     className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center"
//                     onClick={() => setShowFilters(false)}
//                 >
//                     <motion.div
//                         initial={{ y: '100%' }}
//                         animate={{ y: 0 }}
//                         exit={{ y: '100%' }}
//                         transition={{ type: 'spring', damping: 25 }}
//                         className="bg-white rounded-t-3xl w-full max-h-[80vh] overflow-y-auto p-6"
//                         onClick={(e) => e.stopPropagation()}
//                     >
//                         <div className="flex items-center justify-between mb-6">
//                             <h3 className="font-bold text-[18px] text-[#1C1C1E]">{t('filterStories')}</h3>
//                             <button
//                                 onClick={() => setShowFilters(false)}
//                                 className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
//                             >
//                                 <X className="w-4 h-4" />
//                             </button>
//                         </div>


//                         {/* Crop Type */}
//                         <div className="mb-5">
//                             <p className="text-[13px] font-semibold text-[#1C1C1E] mb-2">{t('cropType')}</p>
//                             <div className="flex flex-wrap gap-2">
//                                 {cropTypes.map(crop => (
//                                     <button
//                                         key={crop.key}
//                                         onClick={() => setSelectedCropType(crop.key)}
//                                         className={`px-3 py-1.5 rounded-full text-[12px] font-medium transition-all ${selectedCropType === crop.key
//                                             ? 'bg-[#2D6A2D] text-white'
//                                             : 'bg-gray-100 text-[#6B7280]'
//                                             }`}
//                                     >
//                                         {getOptionLabel(crop)}
//                                     </button>
//                                 ))}
//                             </div>
//                         </div>


//                         {/* Land Size */}
//                         <div className="mb-5">
//                             <p className="text-[13px] font-semibold text-[#1C1C1E] mb-2">{t('landSize')}</p>
//                             <div className="flex flex-wrap gap-2">
//                                 {landSizes.map(size => (
//                                     <button
//                                         key={size.key}
//                                         onClick={() => setSelectedLandSize(size.key)}
//                                         className={`px-3 py-1.5 rounded-full text-[12px] font-medium transition-all ${selectedLandSize === size.key
//                                             ? 'bg-[#2D6A2D] text-white'
//                                             : 'bg-gray-100 text-[#6B7280]'
//                                             }`}
//                                     >
//                                         {getOptionLabel(size)}
//                                     </button>
//                                 ))}
//                             </div>
//                         </div>


//                         {/* Scheme */}
//                         <div className="mb-5">
//                             <p className="text-[13px] font-semibold text-[#1C1C1E] mb-2">{t('scheme')}</p>
//                             <div className="flex flex-wrap gap-2">
//                                 {schemes.map(scheme => (
//                                     <button
//                                         key={scheme.key}
//                                         onClick={() => setSelectedScheme(scheme.key)}
//                                         className={`px-3 py-1.5 rounded-full text-[12px] font-medium transition-all ${selectedScheme === scheme.key
//                                             ? 'bg-[#2D6A2D] text-white'
//                                             : 'bg-gray-100 text-[#6B7280]'
//                                             }`}
//                                     >
//                                         {getOptionLabel(scheme)}
//                                     </button>
//                                 ))}
//                             </div>
//                         </div>


//                         {/* Region */}
//                         <div className="mb-6">
//                             <p className="text-[13px] font-semibold text-[#1C1C1E] mb-2">{t('region')}</p>
//                             <div className="flex flex-wrap gap-2">
//                                 {regions.map(region => (
//                                     <button
//                                         key={region.key}
//                                         onClick={() => setSelectedRegion(region.key)}
//                                         className={`px-3 py-1.5 rounded-full text-[12px] font-medium transition-all ${selectedRegion === region.key
//                                             ? 'bg-[#2D6A2D] text-white'
//                                             : 'bg-gray-100 text-[#6B7280]'
//                                             }`}
//                                     >
//                                         {getOptionLabel(region)}
//                                     </button>
//                                 ))}
//                             </div>
//                         </div>


//                         {/* Action buttons */}
//                         <div className="flex gap-3">
//                             <button
//                                 onClick={clearFilters}
//                                 className="flex-1 py-3 border border-gray-200 text-[#1C1C1E] rounded-xl font-medium text-[14px]"
//                             >
//                                 {t('clearAll')}
//                             </button>
//                             <button
//                                 onClick={() => setShowFilters(false)}
//                                 className="flex-1 py-3 bg-[#F5A623] text-white rounded-xl font-bold text-[14px]"
//                             >
//                                 {t('applyFilters')}
//                             </button>
//                         </div>
//                     </motion.div>
//                 </motion.div>
//             )}
//         </AnimatePresence>
//     );


//     // ─── Main Render ──────────────────────────────────────────
//     return (
//         <div className="min-h-screen bg-[#F7F3EE] pb-24">
//             {/* ─── Top Bar ─────────────────────────────────────────── */}
//             <div className="bg-gradient-to-b from-[#1A3C1A] to-[#2D6A2D] pt-10 pb-4 px-4 sticky top-0 z-20">
//                 <div className="flex items-center justify-between mb-4">
//                     <button
//                         onClick={() => navigate('/dashboard')}
//                         className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
//                     >
//                         <ArrowLeft className="w-5 h-5 text-white" />
//                     </button>
//                     <h1 className="font-bold text-white text-[16px]">
//                         {t('communityStories')}
//                     </h1>
//                     <div className="w-9" />
//                 </div>


//                 {/* Search Bar */}
//                 <div className="bg-white rounded-2xl p-3 shadow-sm flex items-center gap-3">
//                     <Search className="w-5 h-5 text-[#6B7280] flex-shrink-0" />
//                     <input
//                         type="text"
//                         value={searchQuery}
//                         onChange={(e) => setSearchQuery(e.target.value)}
//                         placeholder={t('searchPlaceholder') as string}
//                         className="flex-1 bg-transparent border-none outline-none text-[14px] placeholder:text-[#9CA3AF] text-[#111827]"
//                     />
//                     <button
//                         onClick={() => setShowFilters(true)}
//                         className={`relative w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${activeFiltersCount > 0 ? 'bg-[#F5A623]' : 'bg-[#F7F3EE]'
//                             }`}
//                     >
//                         <Filter className={`w-4 h-4 ${activeFiltersCount > 0 ? 'text-white' : 'text-[#6B7280]'}`} />
//                         {activeFiltersCount > 0 && (
//                             <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#2D6A2D] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
//                                 {activeFiltersCount}
//                             </span>
//                         )}
//                     </button>
//                 </div>
//             </div>


//             <div className="px-4 pt-4">
//                 {/* ─── Community Stats ───────────────────────────────── */}
//                 <div className="grid grid-cols-4 gap-2 mb-4">
//                     {[
//                         { icon: Users, label: t('happyFarmers'), value: '2.5L+', color: '#2D6A2D' },
//                         { icon: TrendingUp, label: t('successRate'), value: '94%', color: '#F5A623' },
//                         { icon: Award, label: t('schemesAvailed'), value: '15+', color: '#60A5FA' },
//                         { icon: IndianRupee, label: t('totalBenefits'), value: '₹500Cr', color: '#97BC62' },
//                     ].map((stat, i) => {
//                         const Icon = stat.icon;
//                         return (
//                             <div key={i} className="bg-white rounded-2xl p-3 text-center shadow-sm border border-gray-100">
//                                 <div
//                                     className="w-8 h-8 rounded-full mx-auto mb-1.5 flex items-center justify-center"
//                                     style={{ backgroundColor: `${stat.color}15` }}
//                                 >
//                                     <Icon className="w-4 h-4" style={{ color: stat.color }} />
//                                 </div>
//                                 <p className="text-[14px] font-bold text-[#1C1C1E]">{stat.value}</p>
//                                 <p className="text-[9px] text-[#6B7280] leading-tight">{stat.label}</p>
//                             </div>
//                         );
//                     })}
//                 </div>


//                 {/* ─── Tab Filters ───────────────────────────────────── */}
//                 <div className="flex gap-2 overflow-x-auto pb-3 mb-2 hide-scrollbar">
//                     {[
//                         { key: 'all' as const, label: t('allStories') },
//                         { key: 'recommended' as const, label: t('recommended'), icon: Sparkles },
//                         { key: 'trending' as const, label: t('trending'), icon: TrendingUp },
//                         { key: 'recent' as const, label: t('recent'), icon: Clock },
//                     ].map((tab) => {
//                         const Icon = tab.icon;
//                         return (
//                             <button
//                                 key={tab.key}
//                                 onClick={() => setActiveTab(tab.key)}
//                                 className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-[12px] font-semibold whitespace-nowrap transition-all ${activeTab === tab.key
//                                     ? 'bg-[#2D6A2D] text-white'
//                                     : 'bg-white text-[#6B7280] border border-gray-200'
//                                     }`}
//                             >
//                                 {Icon && <Icon className="w-3.5 h-3.5" />}
//                                 {tab.label}
//                             </button>
//                         );
//                     })}
//                 </div>


//                 {/* Recommended banner */}
//                 {activeTab === 'recommended' && (
//                     <motion.div
//                         initial={{ opacity: 0, y: 10 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         className="bg-[#97BC62]/10 border border-[#97BC62]/30 rounded-2xl p-3 mb-4 flex items-center gap-3"
//                     >
//                         <div className="w-8 h-8 rounded-full bg-[#97BC62]/20 flex items-center justify-center flex-shrink-0">
//                             <Sparkles className="w-4 h-4 text-[#2D6A2D]" />
//                         </div>
//                         <div className="flex-1">
//                             <p className="text-[12px] text-[#2D6A2D] font-medium">{t('basedOnProfile')}</p>
//                             <p className="text-[10px] text-[#6B7280]">
//                                 {userData.state && userData.landSize
//                                     ? `${userData.state} • ${userData.landSize} ${userData.landUnit}`
//                                     : t('helplineInfo')}
//                             </p>
//                         </div>
//                     </motion.div>
//                 )}


//                 {/* ─── Featured Stories Section ──────────────────────── */}
//                 {activeTab === 'all' && featuredStories.length > 0 && (
//                     <div className="mb-6">
//                         <h2 className="font-bold text-[16px] text-[#1C1C1E] mb-3 flex items-center gap-2">
//                             <Star className="w-4 h-4 text-[#F5A623]" />
//                             {t('featuredStories')}
//                         </h2>
//                         <div className="space-y-3">
//                             {featuredStories.map((story, index) => renderStoryCard(story, index, true))}
//                         </div>
//                     </div>
//                 )}


//                 {/* ─── Case Studies Section ──────────────────────────── */}
//                 {activeTab === 'all' && (
//                     <div className="mb-6">
//                         <h2 className="font-bold text-[16px] text-[#1C1C1E] mb-3 flex items-center gap-2">
//                             <BookOpen className="w-4 h-4 text-[#2D6A2D]" />
//                             {t('caseStudies')}
//                         </h2>
//                         <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar snap-x snap-mandatory">
//                             {caseStudiesData.map(caseStudy => renderCaseStudyCard(caseStudy))}
//                         </div>
//                     </div>
//                 )}


//                 {/* ─── Video Testimonials Section ────────────────────── */}
//                 {activeTab === 'all' && (
//                     <div className="mb-6">
//                         <h2 className="font-bold text-[16px] text-[#1C1C1E] mb-3 flex items-center gap-2">
//                             <Video className="w-4 h-4 text-[#F5A623]" />
//                             {t('videoTestimonials')}
//                         </h2>
//                         <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar snap-x snap-mandatory">
//                             {videoTestimonialsData.map(video => renderVideoCard(video))}
//                             {/* Placeholder for more videos */}
//                             <div className="bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 min-w-[200px] h-[180px] flex flex-col items-center justify-center snap-start">
//                                 <Plus className="w-6 h-6 text-gray-300 mb-2" />
//                                 <p className="text-[11px] text-[#9CA3AF] text-center px-4">{t('comingSoon')}</p>
//                             </div>
//                         </div>
//                     </div>
//                 )}


//                 {/* ─── Scheme Benefits Section (Placeholder-ready) ───── */}
//                 {activeTab === 'all' && (
//                     <div className="mb-6">
//                         <h2 className="font-bold text-[16px] text-[#1C1C1E] mb-3 flex items-center gap-2">
//                             <Award className="w-4 h-4 text-[#97BC62]" />
//                             {t('schemeBenefits')}
//                         </h2>
//                         <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar snap-x snap-mandatory">
//                             {schemeBenefitsData.map(benefit => renderSchemeBenefitCard(benefit))}
//                         </div>
//                         {/* Note for developers */}
//                         <p className="text-[10px] text-[#9CA3AF] mt-2 text-center italic">
//                             {/* This section is designed to be easily updated when scheme information changes */}
//                         </p>
//                     </div>
//                 )}


//                 {/* ─── All Stories Section ───────────────────────────── */}
//                 <div className="mb-6">
//                     {activeTab !== 'all' && (
//                         <h2 className="font-bold text-[16px] text-[#1C1C1E] mb-3">
//                             {activeTab === 'recommended' ? t('recommendedForYou') :
//                                 activeTab === 'trending' ? t('trending') : t('recent')}
//                         </h2>
//                     )}


//                     {filteredStories.length === 0 ? (
//                         <motion.div
//                             initial={{ opacity: 0, y: 10 }}
//                             animate={{ opacity: 1, y: 0 }}
//                             className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center"
//                         >
//                             <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
//                                 <Search className="w-8 h-8 text-gray-300" />
//                             </div>
//                             <p className="text-[14px] text-[#1C1C1E] font-semibold mb-1">
//                                 {t('noStoriesFound')}
//                             </p>
//                             <p className="text-[12px] text-[#6B7280] mb-4">
//                                 {t('tryDifferentFilters')}
//                             </p>
//                             <button
//                                 onClick={clearFilters}
//                                 className="bg-[#2D6A2D] text-white px-6 py-2.5 rounded-xl text-[13px] font-semibold"
//                             >
//                                 {t('clearAll')}
//                             </button>
//                         </motion.div>
//                     ) : (
//                         <div className="space-y-3">
//                             {filteredStories.map((story, index) => renderStoryCard(story, index))}
//                         </div>
//                     )}
//                 </div>


//                 {/* ─── Share Your Story CTA ──────────────────────────── */}
//                 <motion.div
//                     initial={{ opacity: 0, y: 10 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     className="bg-gradient-to-r from-[#1A3C1A] to-[#2D6A2D] rounded-2xl p-5 mb-4 text-center"
//                 >
//                     <div className="w-14 h-14 bg-white/15 rounded-full mx-auto mb-3 flex items-center justify-center">
//                         <Mic className="w-7 h-7 text-white" />
//                     </div>
//                     <h3 className="font-bold text-[18px] text-white mb-1">
//                         {t('shareYourStory')}
//                     </h3>
//                     <p className="text-[12px] text-white/70 mb-4">
//                         {t('inspireOthers')}
//                     </p>
//                     <button className="bg-[#F5A623] text-[#1C1C1E] px-6 py-3 rounded-xl font-bold text-[14px] flex items-center justify-center gap-2 mx-auto active:scale-95 transition-all">
//                         <Plus className="w-4 h-4" />
//                         {t('shareYourStory')}
//                     </button>
//                 </motion.div>


//                 {/* ─── Placeholder Section for Future Updates ────────── */}
//                 {/* 
//           NOTE FOR DEVELOPERS:
//           This section is reserved for future scheme information updates.
//           When new scheme data is available, update the schemeBenefitsData array above.
//           Each scheme entry has:
//           - isPlaceholder: boolean - set to false when real data is available
//           - lastUpdated: string - track when data was last updated
//           - benefits: array - easily add/remove/modify benefit items
//           - stats: array - easily update statistics
//         */}
//             </div>


//             <BottomNav />


//             {/* Filters Modal */}
//             {renderFiltersModal()}


//             <style>{`
//         .hide-scrollbar::-webkit-scrollbar {
//           display: none;
//         }
//         .hide-scrollbar {
//           -ms-overflow-style: none;
//           scrollbar-width: none;
//         }
//         .line-clamp-2 {
//           display: -webkit-box;
//           -webkit-line-clamp: 2;
//           -webkit-box-orient: vertical;
//           overflow: hidden;
//         }
//         .line-clamp-3 {
//           display: -webkit-box;
//           -webkit-line-clamp: 3;
//           -webkit-box-orient: vertical;
//           overflow: hidden;
//         }
//       `}</style>
//         </div>
//     );
// }

import { useState, useMemo, useCallback, useRef } from 'react';
import {
    ArrowLeft,
    Search,
    Filter,
    Heart,
    MessageCircle,
    Share2,
    Play,
    ChevronRight,
    Star,
    TrendingUp,
    Award,
    Sparkles,
    MapPin,
    Wheat,
    Calendar,
    IndianRupee,
    ThumbsUp,
    BookOpen,
    Video,
    Mic,
    ChevronDown,
    ChevronUp,
    X,
    Plus,
    Clock,
    CheckCircle,
    Bookmark,
    Eye,
    Send,
} from 'lucide-react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { BottomNav } from '../components/BottomNav';
import { useLanguage } from '../../context/LanguageContext';
import { useUser } from '../../context/UserContext';


// ─── Translations ───────────────────────────────────────────────
const translations = {
    // Page titles
    communityStories: { en: 'Community Stories', hi: 'समुदाय की कहानियां', mr: 'समुदायाच्या कथा' },
    successStories: { en: 'Success Stories', hi: 'सफलता की कहानियां', mr: 'यशोगाथा' },
    farmerExperiences: { en: 'Farmer Experiences', hi: 'किसानों के अनुभव', mr: 'शेतकऱ्यांचे अनुभव' },

    // Search
    searchPlaceholder: {
        en: 'Search stories, schemes, crops...',
        hi: 'कहानियां, योजनाएं, फसलें खोजें...',
        mr: 'कथा, योजना, पिके शोधा...'
    },

    // Stats
    happyFarmers: { en: 'Happy Farmers', hi: 'खुश किसान', mr: 'आनंदी शेतकरी' },
    successRate: { en: 'Success Rate', hi: 'सफलता दर', mr: 'यश दर' },
    schemesAvailed: { en: 'Schemes Availed', hi: 'योजनाएं लाभान्वित', mr: 'योजना लाभ' },
    totalBenefits: { en: 'Total Benefits', hi: 'कुल लाभ', mr: 'एकूण लाभ' },

    // Filters
    allStories: { en: 'All Stories', hi: 'सभी कहानियां', mr: 'सर्व कथा' },
    recommended: { en: 'For You', hi: 'आपके लिए', mr: 'तुमच्यासाठी' },
    trending: { en: 'Trending', hi: 'ट्रेंडिंग', mr: 'ट्रेंडिंग' },
    recent: { en: 'Recent', hi: 'हाल की', mr: 'अलीकडील' },

    // Crop types
    allCrops: { en: 'All Crops', hi: 'सभी फसलें', mr: 'सर्व पिके' },
    wheat: { en: 'Wheat', hi: 'गेहूं', mr: 'गहू' },
    rice: { en: 'Rice', hi: 'धान', mr: 'तांदूळ' },
    cotton: { en: 'Cotton', hi: 'कपास', mr: 'कापूस' },
    sugarcane: { en: 'Sugarcane', hi: 'गन्ना', mr: 'ऊस' },
    vegetables: { en: 'Vegetables', hi: 'सब्जियां', mr: 'भाज्या' },
    fruits: { en: 'Fruits', hi: 'फल', mr: 'फळे' },
    pulses: { en: 'Pulses', hi: 'दालें', mr: 'डाळी' },
    oilseeds: { en: 'Oilseeds', hi: 'तिलहन', mr: 'तेलबिया' },

    // Land size
    allSizes: { en: 'All Sizes', hi: 'सभी आकार', mr: 'सर्व आकार' },
    marginal: { en: 'Marginal (<1 ha)', hi: 'सीमांत (<1 हे)', mr: 'अल्प (<1 हे)' },
    small: { en: 'Small (1-2 ha)', hi: 'छोटा (1-2 हे)', mr: 'लहान (1-2 हे)' },
    medium: { en: 'Medium (2-4 ha)', hi: 'मध्यम (2-4 हे)', mr: 'मध्यम (2-4 हे)' },
    large: { en: 'Large (>4 ha)', hi: 'बड़ा (>4 हे)', mr: 'मोठा (>4 हे)' },

    // Schemes
    allSchemes: { en: 'All Schemes', hi: 'सभी योजनाएं', mr: 'सर्व योजना' },
    pmKisan: { en: 'PM-Kisan', hi: 'पीएम-किसान', mr: 'पीएम-किसान' },
    pmfby: { en: 'PM Fasal Bima', hi: 'पीएम फसल बीमा', mr: 'पीएम पीक विमा' },
    kcc: { en: 'Kisan Credit Card', hi: 'किसान क्रेडिट कार्ड', mr: 'किसान क्रेडिट कार्ड' },
    soilHealth: { en: 'Soil Health Card', hi: 'मृदा स्वास्थ्य कार्ड', mr: 'मृदा आरोग्य कार्ड' },
    pmKusum: { en: 'PM-KUSUM', hi: 'पीएम-कुसुम', mr: 'पीएम-कुसुम' },

    // Regions
    allRegions: { en: 'All Regions', hi: 'सभी क्षेत्र', mr: 'सर्व प्रदेश' },
    maharashtra: { en: 'Maharashtra', hi: 'महाराष्ट्र', mr: 'महाराष्ट्र' },
    punjab: { en: 'Punjab', hi: 'पंजाब', mr: 'पंजाब' },
    up: { en: 'Uttar Pradesh', hi: 'उत्तर प्रदेश', mr: 'उत्तर प्रदेश' },
    mp: { en: 'Madhya Pradesh', hi: 'मध्य प्रदेश', mr: 'मध्य प्रदेश' },
    rajasthan: { en: 'Rajasthan', hi: 'राजस्थान', mr: 'राजस्थान' },
    gujarat: { en: 'Gujarat', hi: 'गुजरात', mr: 'गुजरात' },
    karnataka: { en: 'Karnataka', hi: 'कर्नाटक', mr: 'कर्नाटक' },

    // Story elements
    readMore: { en: 'Read More', hi: 'और पढ़ें', mr: 'अधिक वाचा' },
    readFull: { en: 'Read Full Story', hi: 'पूरी कहानी पढ़ें', mr: 'संपूर्ण कथा वाचा' },
    viewDetails: { en: 'View Details', hi: 'विवरण देखें', mr: 'तपशील पहा' },
    likes: { en: 'Likes', hi: 'पसंद', mr: 'आवडले' },
    comments: { en: 'Comments', hi: 'टिप्पणियां', mr: 'प्रतिक्रिया' },
    shares: { en: 'Shares', hi: 'शेयर', mr: 'शेअर' },
    views: { en: 'Views', hi: 'व्यूज', mr: 'दृश्ये' },
    verified: { en: 'Verified', hi: 'सत्यापित', mr: 'सत्यापित' },

    // Benefits
    benefitReceived: { en: 'Benefit Received', hi: 'प्राप्त लाभ', mr: 'मिळालेला लाभ' },
    incomeIncrease: { en: 'Income Increase', hi: 'आय में वृद्धि', mr: 'उत्पन्न वाढ' },
    yieldImprovement: { en: 'Yield Improvement', hi: 'उपज में सुधार', mr: 'उत्पादन सुधारणा' },
    costSaving: { en: 'Cost Saving', hi: 'लागत बचत', mr: 'खर्च बचत' },

    // Sections
    featuredStories: { en: 'Featured Stories', hi: 'विशेष कहानियां', mr: 'विशेष कथा' },
    recommendedForYou: { en: 'Recommended For You', hi: 'आपके लिए अनुशंसित', mr: 'तुमच्यासाठी शिफारस' },
    similarFarmers: { en: 'From Similar Farmers', hi: 'समान किसानों से', mr: 'समान शेतकऱ्यांकडून' },
    caseStudies: { en: 'Case Studies', hi: 'केस स्टडी', mr: 'केस स्टडी' },
    videoTestimonials: { en: 'Video Testimonials', hi: 'वीडियो प्रशंसापत्र', mr: 'व्हिडिओ साक्षांश' },
    schemeBenefits: { en: 'Scheme Benefits', hi: 'योजना लाभ', mr: 'योजना फायदे' },

    // Actions
    shareYourStory: { en: 'Share Your Story', hi: 'अपनी कहानी साझा करें', mr: 'तुमची कथा शेअर करा' },
    applyNow: { en: 'Apply Now', hi: 'अभी आवेदन करें', mr: 'आता अर्ज करा' },
    learnMore: { en: 'Learn More', hi: 'और जानें', mr: 'अधिक जाणून घ्या' },
    watchVideo: { en: 'Watch Video', hi: 'वीडियो देखें', mr: 'व्हिडिओ पहा' },
    save: { en: 'Save', hi: 'सेव करें', mr: 'सेव्ह करा' },
    saved: { en: 'Saved', hi: 'सेव हुआ', mr: 'सेव्ह केले' },

    // Time
    daysAgo: { en: 'days ago', hi: 'दिन पहले', mr: 'दिवसांपूर्वी' },
    weeksAgo: { en: 'weeks ago', hi: 'सप्ताह पहले', mr: 'आठवड्यांपूर्वी' },
    monthsAgo: { en: 'months ago', hi: 'महीने पहले', mr: 'महिन्यांपूर्वी' },

    // Info banners
    basedOnProfile: {
        en: 'Stories matching your profile',
        hi: 'आपकी प्रोफ़ाइल से मेल खाती कहानियां',
        mr: 'तुमच्या प्रोफाइलशी जुळणाऱ्या कथा'
    },
    helplineInfo: {
        en: 'Need help? Call: 1800-180-1551',
        hi: 'मदद चाहिए? कॉल करें: 1800-180-1551',
        mr: 'मदत हवी? कॉल करा: 1800-180-1551'
    },

    // Empty states
    noStoriesFound: { en: 'No stories found', hi: 'कोई कहानी नहीं मिली', mr: 'कोणतीही कथा सापडली नाही' },
    tryDifferentFilters: {
        en: 'Try different filters to find stories',
        hi: 'कहानियां खोजने के लिए अलग फिल्टर आज़माएं',
        mr: 'कथा शोधण्यासाठी वेगळे फिल्टर वापरा'
    },

    // Share story form
    tellYourStory: { en: 'Tell Your Story', hi: 'अपनी कहानी बताएं', mr: 'तुमची कथा सांगा' },
    inspireOthers: {
        en: 'Inspire other farmers with your experience',
        hi: 'अपने अनुभव से अन्य किसानों को प्रेरित करें',
        mr: 'तुमच्या अनुभवाने इतर शेतकऱ्यांना प्रेरित करा'
    },

    // Coming soon
    comingSoon: { en: 'Coming Soon', hi: 'जल्द आ रहा है', mr: 'लवकरच येत आहे' },
    featureInDevelopment: {
        en: 'This feature is under development',
        hi: 'यह फीचर विकास के अधीन है',
        mr: 'हे वैशिष्ट्य विकासाधीन आहे'
    },

    // Filters modal
    filterStories: { en: 'Filter Stories', hi: 'कहानियां फ़िल्टर करें', mr: 'कथा फिल्टर करा' },
    cropType: { en: 'Crop Type', hi: 'फसल प्रकार', mr: 'पीक प्रकार' },
    landSize: { en: 'Land Size', hi: 'भूमि आकार', mr: 'जमीन क्षेत्र' },
    scheme: { en: 'Scheme', hi: 'योजना', mr: 'योजना' },
    region: { en: 'Region', hi: 'क्षेत्र', mr: 'प्रदेश' },
    applyFilters: { en: 'Apply Filters', hi: 'फ़िल्टर लागू करें', mr: 'फिल्टर लागू करा' },
    clearAll: { en: 'Clear All', hi: 'सब हटाएं', mr: 'सर्व काढा' },

    // Placeholder texts
    schemeInfoPlaceholder: {
        en: 'Scheme details will be updated soon',
        hi: 'योजना विवरण जल्द ही अपडेट होगा',
        mr: 'योजना तपशील लवकरच अपडेट होईल'
    },
    benefitsUpdating: {
        en: 'Benefits information updating...',
        hi: 'लाभ जानकारी अपडेट हो रही है...',
        mr: 'लाभ माहिती अपडेट होत आहे...'
    },

    // New translations for story input
    writeYourStory: {
        en: 'Write your story here...',
        hi: 'अपनी कहानी यहां लिखें...',
        mr: 'तुमची कथा इथे लिहा...'
    },
    postStory: { en: 'Post Story', hi: 'कहानी पोस्ट करें', mr: 'कथा पोस्ट करा' },
    recording: { en: 'Recording...', hi: 'रिकॉर्डिंग...', mr: 'रेकॉर्डिंग...' },
    justNow: { en: 'Just now', hi: 'अभी', mr: 'आत्ताच' },
    keyHighlight: { en: 'Key Highlight', hi: 'मुख्य विशेषता', mr: 'मुख्य ठळक' },
};


// ─── Story interface ────────────────────────────────────────────
interface SuccessStory {
    id: string;
    farmerName: string;
    farmerNameHi: string;
    farmerNameMr: string;
    farmerImage?: string;
    location: string;
    locationHi: string;
    locationMr: string;
    state: string;
    cropType: string;
    cropTypeHi: string;
    cropTypeMr: string;
    landSize: number;
    landUnit: string;
    landCategory: 'marginal' | 'small' | 'medium' | 'large';
    scheme: string;
    schemeHi: string;
    schemeMr: string;
    schemeId: string;
    title: string;
    titleHi: string;
    titleMr: string;
    summary: string;
    summaryHi: string;
    summaryMr: string;
    fullStory?: string;
    fullStoryHi?: string;
    fullStoryMr?: string;
    benefitAmount: string;
    incomeIncrease?: string;
    yieldImprovement?: string;
    costSaving?: string;
    likes: number;
    comments: number;
    shares: number;
    views: number;
    isVerified: boolean;
    isFeatured: boolean;
    postedDaysAgo: number;
    videoUrl?: string;
    images?: string[];
    tags: string[];
}


// ─── Case Study interface ───────────────────────────────────────
interface CaseStudy {
    id: string;
    title: string;
    titleHi: string;
    titleMr: string;
    description: string;
    descriptionHi: string;
    descriptionMr: string;
    scheme: string;
    schemeHi: string;
    schemeMr: string;
    farmersImpacted: number;
    totalBenefits: string;
    region: string;
    regionHi: string;
    regionMr: string;
    duration: string;
    durationHi: string;
    durationMr: string;
    icon: string;
}


// ─── Scheme Benefit Placeholder interface ───────────────────────
interface SchemeBenefitInfo {
    id: string;
    schemeName: string;
    schemeNameHi: string;
    schemeNameMr: string;
    icon: string;
    benefits: {
        title: string;
        titleHi: string;
        titleMr: string;
        value: string;
        valueHi: string;
        valueMr: string;
    }[];
    stats: {
        label: string;
        labelHi: string;
        labelMr: string;
        value: string;
    }[];
    lastUpdated: string;
    isPlaceholder?: boolean;
}


// ─── Avatar Color Palette ───────────────────────────────────────
const avatarColors = [
    '#2D6A2D', // Forest green
    '#B45309', // Amber brown
    '#0F766E', // Teal
    '#C2410C', // Burnt orange
    '#1E6091', // Ocean blue
    '#7C3AED', // Deep violet
    '#9F580A', // Earth brown
    '#047857', // Emerald
];

function getAvatarColor(name: string): string {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return avatarColors[Math.abs(hash) % avatarColors.length];
}

function getInitials(name: string): string {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return (parts[0]?.[0] || '?').toUpperCase();
}


// ─── Key Highlight Helper ───────────────────────────────────────
function getKeyHighlight(story: SuccessStory): { label: string; value: string; type: string } | null {
    if (story.incomeIncrease) {
        return { label: 'incomeIncrease', value: `+${story.incomeIncrease}`, type: 'income' };
    }
    if (story.yieldImprovement) {
        return { label: 'yieldImprovement', value: `+${story.yieldImprovement}`, type: 'yield' };
    }
    if (story.costSaving) {
        return { label: 'costSaving', value: story.costSaving, type: 'saving' };
    }
    if (story.benefitAmount) {
        return { label: 'benefitReceived', value: story.benefitAmount, type: 'benefit' };
    }
    return null;
}


// ─── Stat border color mapping ──────────────────────────────────
const statBorderColors: Record<string, string> = {
    benefitAmount: '#2D6A2D',
    incomeIncrease: '#F5A623',
    yieldImprovement: '#2563EB',
    costSaving: '#059669',
};


// ─── Sample Success Stories Data ────────────────────────────────
const initialSuccessStoriesData: SuccessStory[] = [
    {
        id: '1',
        farmerName: 'Ramesh Patil',
        farmerNameHi: 'रमेश पाटिल',
        farmerNameMr: 'रमेश पाटील',
        farmerImage: '',
        location: 'Nashik, Maharashtra',
        locationHi: 'नासिक, महाराष्ट्र',
        locationMr: 'नाशिक, महाराष्ट्र',
        state: 'maharashtra',
        cropType: 'Grapes & Vegetables',
        cropTypeHi: 'अंगूर और सब्जियां',
        cropTypeMr: 'द्राक्षे आणि भाज्या',
        landSize: 2.5,
        landUnit: 'Hectares',
        landCategory: 'medium',
        scheme: 'PM-Kisan Samman Nidhi',
        schemeHi: 'प्रधानमंत्री किसान सम्मान निधि',
        schemeMr: 'प्रधानमंत्री किसान सन्मान निधी',
        schemeId: 'pm-kisan',
        title: 'From Struggling to Thriving: My PM-Kisan Journey',
        titleHi: 'संघर्ष से सफलता तक: मेरी पीएम-किसान यात्रा',
        titleMr: 'संघर्षातून यशाकडे: माझा पीएम-किसान प्रवास',
        summary: 'With ₹6,000 annual support from PM-Kisan, I invested in quality seeds and fertilizers. My grape yield increased by 40% in just two seasons.',
        summaryHi: 'पीएम-किसान से ₹6,000 वार्षिक सहायता के साथ, मैंने गुणवत्ता वाले बीज और उर्वरकों में निवेश किया। मेरी अंगूर की उपज सिर्फ दो सीजन में 40% बढ़ गई।',
        summaryMr: 'पीएम-किसान मधून ₹6,000 वार्षिक मदतीने, मी दर्जेदार बियाणे आणि खतांमध्ये गुंतवणूक केली. माझ्या द्राक्षांचे उत्पादन फक्त दोन हंगामात 40% वाढले.',
        benefitAmount: '₹18,000',
        incomeIncrease: '45%',
        yieldImprovement: '40%',
        likes: 234,
        comments: 45,
        shares: 89,
        views: 1250,
        isVerified: true,
        isFeatured: true,
        postedDaysAgo: 3,
        tags: ['pm-kisan', 'grapes', 'success', 'maharashtra'],
    },
    {
        id: '2',
        farmerName: 'Gurpreet Singh',
        farmerNameHi: 'गुरप्रीत सिंह',
        farmerNameMr: 'गुरप्रीत सिंग',
        farmerImage: '',
        location: 'Ludhiana, Punjab',
        locationHi: 'लुधियाना, पंजाब',
        locationMr: 'लुधियाना, पंजाब',
        state: 'punjab',
        cropType: 'Wheat & Rice',
        cropTypeHi: 'गेहूं और धान',
        cropTypeMr: 'गहू आणि तांदूळ',
        landSize: 5,
        landUnit: 'Hectares',
        landCategory: 'large',
        scheme: 'PM Fasal Bima Yojana',
        schemeHi: 'प्रधानमंत्री फसल बीमा योजना',
        schemeMr: 'प्रधानमंत्री पीक विमा योजना',
        schemeId: 'pmfby',
        title: 'Crop Insurance Saved My Family After Floods',
        titleHi: 'बाढ़ के बाद फसल बीमा ने मेरे परिवार को बचाया',
        titleMr: 'पुरानंतर पीक विम्याने माझ्या कुटुंबाला वाचवले',
        summary: 'When unexpected floods destroyed 80% of my wheat crop, PMFBY claim of ₹1.2 lakh helped me recover and replant for the next season.',
        summaryHi: 'जब अचानक बाढ़ ने मेरी 80% गेहूं की फसल नष्ट कर दी, तो PMFBY दावे से ₹1.2 लाख ने मुझे अगले सीजन के लिए ठीक होने और फिर से बुवाई करने में मदद की।',
        summaryMr: 'जेव्हा अनपेक्षित पुराने माझ्या 80% गहू पिकाचा नाश केला, तेव्हा PMFBY दाव्यातून ₹1.2 लाख ने मला पुन्हा उभे राहण्यास आणि पुढच्या हंगामासाठी पेरणी करण्यास मदत केली.',
        benefitAmount: '₹1,20,000',
        costSaving: '₹85,000',
        likes: 567,
        comments: 123,
        shares: 234,
        views: 3400,
        isVerified: true,
        isFeatured: true,
        postedDaysAgo: 7,
        videoUrl: 'https://example.com/video1',
        tags: ['pmfby', 'insurance', 'wheat', 'punjab', 'flood'],
    },
    {
        id: '3',
        farmerName: 'Lakshmi Devi',
        farmerNameHi: 'लक्ष्मी देवी',
        farmerNameMr: 'लक्ष्मी देवी',
        farmerImage: '',
        location: 'Jaipur, Rajasthan',
        locationHi: 'जयपुर, राजस्थान',
        locationMr: 'जयपूर, राजस्थान',
        state: 'rajasthan',
        cropType: 'Pulses & Oilseeds',
        cropTypeHi: 'दालें और तिलहन',
        cropTypeMr: 'डाळी आणि तेलबिया',
        landSize: 1.5,
        landUnit: 'Hectares',
        landCategory: 'small',
        scheme: 'Kisan Credit Card',
        schemeHi: 'किसान क्रेडिट कार्ड',
        schemeMr: 'किसान क्रेडिट कार्ड',
        schemeId: 'kcc',
        title: 'KCC Helped Me Become an Independent Farmer',
        titleHi: 'KCC ने मुझे स्वतंत्र किसान बनने में मदद की',
        titleMr: 'KCC ने मला स्वतंत्र शेतकरी बनण्यास मदत केली',
        summary: 'As a woman farmer, getting credit was always difficult. KCC gave me ₹2 lakh at just 4% interest, helping me buy better equipment and seeds.',
        summaryHi: 'एक महिला किसान के रूप में, क्रेडिट पाना हमेशा मुश्किल था। KCC ने मुझे सिर्फ 4% ब्याज पर ₹2 लाख दिए, जिससे मुझे बेहतर उपकरण और बीज खरीदने में मदद मिली।',
        summaryMr: 'एक महिला शेतकरी म्हणून, कर्ज मिळवणे नेहमीच कठीण होते. KCC ने मला फक्त 4% व्याजावर ₹2 लाख दिले, ज्यामुळे मला चांगली उपकरणे आणि बियाणे खरेदी करण्यास मदत झाली.',
        benefitAmount: '₹2,00,000',
        incomeIncrease: '60%',
        likes: 456,
        comments: 89,
        shares: 167,
        views: 2100,
        isVerified: true,
        isFeatured: false,
        postedDaysAgo: 12,
        tags: ['kcc', 'women-farmer', 'pulses', 'rajasthan'],
    },
    {
        id: '4',
        farmerName: 'Suresh Kumar',
        farmerNameHi: 'सुरेश कुमार',
        farmerNameMr: 'सुरेश कुमार',
        farmerImage: '',
        location: 'Kanpur, Uttar Pradesh',
        locationHi: 'कानपुर, उत्तर प्रदेश',
        locationMr: 'कानपूर, उत्तर प्रदेश',
        state: 'up',
        cropType: 'Sugarcane',
        cropTypeHi: 'गन्ना',
        cropTypeMr: 'ऊस',
        landSize: 0.8,
        landUnit: 'Hectares',
        landCategory: 'marginal',
        scheme: 'Soil Health Card',
        schemeHi: 'मृदा स्वास्थ्य कार्ड',
        schemeMr: 'मृदा आरोग्य कार्ड',
        schemeId: 'soil-health',
        title: 'Soil Testing Changed How I Farm',
        titleHi: 'मिट्टी परीक्षण ने मेरी खेती का तरीका बदल दिया',
        titleMr: 'माती परीक्षणाने माझी शेती पद्धत बदलली',
        summary: 'Free soil testing showed my land lacked specific nutrients. Following the recommendations, I reduced fertilizer costs by 30% while improving yield.',
        summaryHi: 'मुफ्त मिट्टी परीक्षण से पता चला कि मेरी जमीन में विशेष पोषक तत्वों की कमी है। सिफारिशों का पालन करके, मैंने उपज में सुधार करते हुए उर्वरक लागत 30% कम की।',
        summaryMr: 'मोफत माती परीक्षणाने दाखवले की माझ्या जमिनीत विशिष्ट पोषक तत्वांची कमतरता आहे. शिफारशींचे पालन करून, मी उत्पादन सुधारत खत खर्च 30% कमी केला.',
        benefitAmount: '₹5,000',
        costSaving: '₹12,000',
        yieldImprovement: '25%',
        likes: 189,
        comments: 34,
        shares: 56,
        views: 890,
        isVerified: true,
        isFeatured: false,
        postedDaysAgo: 21,
        tags: ['soil-health', 'sugarcane', 'up', 'marginal-farmer'],
    },
    {
        id: '5',
        farmerName: 'Prakash Yadav',
        farmerNameHi: 'प्रकाश यादव',
        farmerNameMr: 'प्रकाश यादव',
        farmerImage: '',
        location: 'Bhopal, Madhya Pradesh',
        locationHi: 'भोपाल, मध्य प्रदेश',
        locationMr: 'भोपाळ, मध्य प्रदेश',
        state: 'mp',
        cropType: 'Cotton',
        cropTypeHi: 'कपास',
        cropTypeMr: 'कापूस',
        landSize: 3,
        landUnit: 'Hectares',
        landCategory: 'medium',
        scheme: 'PM-KUSUM Solar Pump',
        schemeHi: 'पीएम-कुसुम सोलर पंप',
        schemeMr: 'पीएम-कुसुम सोलर पंप',
        schemeId: 'pm-kusum',
        title: 'Solar Pump Ended My Electricity Worries',
        titleHi: 'सोलर पंप ने मेरी बिजली की चिंताएं खत्म कीं',
        titleMr: 'सोलर पंपाने माझ्या विजेच्या चिंता संपवल्या',
        summary: 'With 60% subsidy on solar pump through PM-KUSUM, I now have reliable irrigation without depending on erratic electricity supply. Saving ₹15,000 yearly on electricity bills.',
        summaryHi: 'पीएम-कुसुम के माध्यम से सोलर पंप पर 60% सब्सिडी के साथ, अब मेरे पास अनियमित बिजली आपूर्ति पर निर्भर हुए बिना विश्वसनीय सिंचाई है। बिजली बिलों पर सालाना ₹15,000 की बचत।',
        summaryMr: 'पीएम-कुसुम द्वारे सोलर पंपावर 60% अनुदानासह, आता माझ्याकडे अनियमित वीज पुरवठ्यावर अवलंबून न राहता विश्वसनीय सिंचन आहे. वीज बिलांवर वार्षिक ₹15,000 बचत.',
        benefitAmount: '₹90,000',
        costSaving: '₹15,000/year',
        likes: 345,
        comments: 67,
        shares: 123,
        views: 1800,
        isVerified: true,
        isFeatured: true,
        postedDaysAgo: 5,
        tags: ['pm-kusum', 'solar', 'cotton', 'mp', 'irrigation'],
    },
];


// ─── Case Studies Data ──────────────────────────────────────────
const caseStudiesData: CaseStudy[] = [
    {
        id: 'cs1',
        title: 'PM-Kisan Impact in Maharashtra',
        titleHi: 'महाराष्ट्र में पीएम-किसान का प्रभाव',
        titleMr: 'महाराष्ट्रातील पीएम-किसान प्रभाव',
        description: 'How direct benefit transfer transformed farming in Vidarbha region',
        descriptionHi: 'कैसे प्रत्यक्ष लाभ हस्तांतरण ने विदर्भ क्षेत्र में खेती को बदल दिया',
        descriptionMr: 'थेट लाभ हस्तांतरणाने विदर्भ प्रदेशातील शेती कशी बदलली',
        scheme: 'PM-Kisan',
        schemeHi: 'पीएम-किसान',
        schemeMr: 'पीएम-किसान',
        farmersImpacted: 125000,
        totalBenefits: '₹75 Cr',
        region: 'Vidarbha, Maharashtra',
        regionHi: 'विदर्भ, महाराष्ट्र',
        regionMr: 'विदर्भ, महाराष्ट्र',
        duration: '2023-2024',
        durationHi: '2023-2024',
        durationMr: '2023-2024',
        icon: '🏛️',
    },
    {
        id: 'cs2',
        title: 'PMFBY Success in Flood-Prone Areas',
        titleHi: 'बाढ़ प्रवण क्षेत्रों में PMFBY सफलता',
        titleMr: 'पूरप्रवण भागांत PMFBY यश',
        description: 'Crop insurance coverage and claim settlement in Bihar & UP',
        descriptionHi: 'बिहार और यूपी में फसल बीमा कवरेज और दावा निपटान',
        descriptionMr: 'बिहार आणि यूपी मध्ये पीक विमा कव्हरेज आणि दावा निपटारा',
        scheme: 'PMFBY',
        schemeHi: 'पीएमएफबीवाई',
        schemeMr: 'पीएमएफबीवाय',
        farmersImpacted: 340000,
        totalBenefits: '₹420 Cr',
        region: 'Bihar & Uttar Pradesh',
        regionHi: 'बिहार और उत्तर प्रदेश',
        regionMr: 'बिहार आणि उत्तर प्रदेश',
        duration: 'Kharif 2023',
        durationHi: 'खरीफ 2023',
        durationMr: 'खरीप 2023',
        icon: '🌾',
    },
];


// ─── Scheme Benefits Placeholder Data ───────────────────────────
const schemeBenefitsData: SchemeBenefitInfo[] = [
    {
        id: 'pm-kisan-benefits',
        schemeName: 'PM-Kisan Samman Nidhi',
        schemeNameHi: 'पीएम-किसान सम्मान निधि',
        schemeNameMr: 'पीएम-किसान सन्मान निधी',
        icon: '🏛️',
        benefits: [
            {
                title: 'Annual Support',
                titleHi: 'वार्षिक सहायता',
                titleMr: 'वार्षिक मदत',
                value: '₹6,000/year',
                valueHi: '₹6,000/वर्ष',
                valueMr: '₹6,000/वर्ष',
            },
            {
                title: 'Installments',
                titleHi: 'किश्तें',
                titleMr: 'हप्ते',
                value: '3 installments of ₹2,000',
                valueHi: '₹2,000 की 3 किश्तें',
                valueMr: '₹2,000 चे 3 हप्ते',
            },
        ],
        stats: [
            { label: 'Beneficiaries', labelHi: 'लाभार्थी', labelMr: 'लाभार्थी', value: '11 Cr+' },
            { label: 'Total Disbursed', labelHi: 'कुल वितरित', labelMr: 'एकूण वितरित', value: '₹2.5 Lakh Cr+' },
        ],
        lastUpdated: '2024-01-15',
        isPlaceholder: false,
    },
    {
        id: 'pmfby-benefits',
        schemeName: 'PM Fasal Bima Yojana',
        schemeNameHi: 'पीएम फसल बीमा योजना',
        schemeNameMr: 'पीएम पीक विमा योजना',
        icon: '🌾',
        benefits: [
            {
                title: 'Premium (Kharif)',
                titleHi: 'प्रीमियम (खरीफ)',
                titleMr: 'प्रीमियम (खरीप)',
                value: '2% of sum insured',
                valueHi: 'बीमित राशि का 2%',
                valueMr: 'विमाकृत रकमेच्या 2%',
            },
            {
                title: 'Premium (Rabi)',
                titleHi: 'प्रीमियम (रबी)',
                titleMr: 'प्रीमियम (रब्बी)',
                value: '1.5% of sum insured',
                valueHi: 'बीमित राशि का 1.5%',
                valueMr: 'विमाकृत रकमेच्या 1.5%',
            },
        ],
        stats: [
            { label: 'Claims Settled', labelHi: 'दावे निपटाए', labelMr: 'दावे निकाली', value: '4 Cr+' },
            { label: 'Coverage', labelHi: 'कवरेज', labelMr: 'कव्हरेज', value: '₹2 Lakh Cr+' },
        ],
        lastUpdated: '2024-01-10',
        isPlaceholder: false,
    },
    {
        id: 'new-scheme-placeholder',
        schemeName: 'New Scheme (Coming Soon)',
        schemeNameHi: 'नई योजना (जल्द आ रही है)',
        schemeNameMr: 'नवीन योजना (लवकरच येत आहे)',
        icon: '🆕',
        benefits: [],
        stats: [],
        lastUpdated: '',
        isPlaceholder: true,
    },
];


// ─── Video Testimonials Placeholder ─────────────────────────────
interface VideoTestimonial {
    id: string;
    title: string;
    titleHi: string;
    titleMr: string;
    farmerName: string;
    location: string;
    locationHi: string;
    locationMr: string;
    thumbnail?: string;
    duration: string;
    views: number;
    scheme: string;
    videoUrl?: string;
}


const videoTestimonialsData: VideoTestimonial[] = [
    {
        id: 'v1',
        title: 'Krishi Mitra: Farmer Testimonial',
        titleHi: 'कृषि मित्र: किसान प्रशंसापत्र',
        titleMr: 'कृषी मित्र: शेतकरी प्रशंसापत्र',
        farmerName: 'Namdev Rao',
        location: 'Solapur, Maharashtra',
        locationHi: 'सोलापुर, महाराष्ट्र',
        locationMr: 'सोलापूर, महाराष्ट्र',
        duration: '0:45',
        views: 4500,
        scheme: 'AgroAI',
        videoUrl: '/videos/testimonial.mp4',
    },
    {
        id: 'v2',
        title: 'My PM-Kisan Success Story',
        titleHi: 'मेरी पीएम-किसान सफलता की कहानी',
        titleMr: 'माझी पीएम-किसान यशोगाथा',
        farmerName: 'Ramesh Patil',
        location: 'Nashik, Maharashtra',
        locationHi: 'नासिक, महाराष्ट्र',
        locationMr: 'नाशिक, महाराष्ट्र',
        duration: '3:45',
        views: 12500,
        scheme: 'PM-Kisan',
    },
    {
        id: 'v3',
        title: 'How Crop Insurance Saved My Farm',
        titleHi: 'फसल बीमा ने कैसे मेरा खेत बचाया',
        titleMr: 'पीक विम्याने माझी शेती कशी वाचवली',
        farmerName: 'Gurpreet Singh',
        location: 'Ludhiana, Punjab',
        locationHi: 'लुधियाना, पंजाब',
        locationMr: 'लुधियाना, पंजाब',
        duration: '5:20',
        views: 34000,
        scheme: 'PMFBY',
    },
];


// ─── SpeechRecognition type augmentation ────────────────────────
interface ISpeechRecognition extends EventTarget {
    lang: string;
    interimResults: boolean;
    continuous: boolean;
    start: () => void;
    stop: () => void;
    onresult: ((event: ISpeechRecognitionEvent) => void) | null;
    onerror: ((event: { error: string }) => void) | null;
    onend: (() => void) | null;
}

interface ISpeechRecognitionEvent {
    results: {
        [index: number]: {
            [index: number]: {
                transcript: string;
            };
        };
        length: number;
    };
    resultIndex: number;
}


// ─── Component ──────────────────────────────────────────────────
export function CommunityEngagement() {
    const navigate = useNavigate();
    const { language } = useLanguage();
    const { userData } = useUser();
    const isHindi = language === 'hi';
    const isMarathi = language === 'mr';


    // ─── Translation helper ───────────────────────────────────
    const t = useCallback((key: keyof typeof translations) => {
        const translation = translations[key];
        if (translation) {
            if (isMarathi && 'mr' in translation) return translation.mr;
            if (isHindi && 'hi' in translation) return translation.hi;
            return translation.en;
        }
        return key;
    }, [isHindi, isMarathi]);


    // ─── State ────────────────────────────────────────────────
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedVideo, setSelectedVideo] = useState<VideoTestimonial | null>(null);
    const [activeTab, setActiveTab] = useState<'all' | 'recommended' | 'trending' | 'recent'>('all');
    const [showFilters, setShowFilters] = useState(false);
    const [selectedCropType, setSelectedCropType] = useState('all');
    const [selectedLandSize, setSelectedLandSize] = useState('all');
    const [selectedScheme, setSelectedScheme] = useState('all');
    const [selectedRegion, setSelectedRegion] = useState('all');
    const [expandedStory, setExpandedStory] = useState<string | null>(null);
    const [savedStories, setSavedStories] = useState<Set<string>>(new Set());
    const [likedStories, setLikedStories] = useState<Set<string>>(new Set());

    // Change 4, 5, 6: New state for story input
    const [showStoryInput, setShowStoryInput] = useState(false);
    const [storyText, setStoryText] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const [shakeTextarea, setShakeTextarea] = useState(false);
    const recognitionRef = useRef<ISpeechRecognition | null>(null);

    // Change 6: Lift stories into state
    const [storiesData, setStoriesData] = useState<SuccessStory[]>(initialSuccessStoriesData);


    // ─── Filter options ───────────────────────────────────────
    const cropTypes = [
        { key: 'all', en: 'All Crops', hi: 'सभी फसलें', mr: 'सर्व पिके' },
        { key: 'wheat', en: 'Wheat', hi: 'गेहूं', mr: 'गहू' },
        { key: 'rice', en: 'Rice', hi: 'धान', mr: 'तांदूळ' },
        { key: 'cotton', en: 'Cotton', hi: 'कपास', mr: 'कापूस' },
        { key: 'sugarcane', en: 'Sugarcane', hi: 'गन्ना', mr: 'ऊस' },
        { key: 'vegetables', en: 'Vegetables', hi: 'सब्जियां', mr: 'भाज्या' },
        { key: 'fruits', en: 'Fruits', hi: 'फल', mr: 'फळे' },
        { key: 'pulses', en: 'Pulses', hi: 'दालें', mr: 'डाळी' },
    ];

    const landSizes = [
        { key: 'all', en: 'All Sizes', hi: 'सभी आकार', mr: 'सर्व आकार' },
        { key: 'marginal', en: 'Marginal (<1 ha)', hi: 'सीमांत (<1 हे)', mr: 'अल्प (<1 हे)' },
        { key: 'small', en: 'Small (1-2 ha)', hi: 'छोटा (1-2 हे)', mr: 'लहान (1-2 हे)' },
        { key: 'medium', en: 'Medium (2-4 ha)', hi: 'मध्यम (2-4 हे)', mr: 'मध्यम (2-4 हे)' },
        { key: 'large', en: 'Large (>4 ha)', hi: 'बड़ा (>4 हे)', mr: 'मोठा (>4 हे)' },
    ];

    const schemes = [
        { key: 'all', en: 'All Schemes', hi: 'सभी योजनाएं', mr: 'सर्व योजना' },
        { key: 'pm-kisan', en: 'PM-Kisan', hi: 'पीएम-किसान', mr: 'पीएम-किसान' },
        { key: 'pmfby', en: 'PM Fasal Bima', hi: 'पीएम फसल बीमा', mr: 'पीएम पीक विमा' },
        { key: 'kcc', en: 'Kisan Credit Card', hi: 'किसान क्रेडिट कार्ड', mr: 'किसान क्रेडिट कार्ड' },
        { key: 'soil-health', en: 'Soil Health Card', hi: 'मृदा स्वास्थ्य कार्ड', mr: 'मृदा आरोग्य कार्ड' },
        { key: 'pm-kusum', en: 'PM-KUSUM', hi: 'पीएम-कुसुम', mr: 'पीएम-कुसुम' },
    ];

    const regions = [
        { key: 'all', en: 'All Regions', hi: 'सभी क्षेत्र', mr: 'सर्व प्रदेश' },
        { key: 'maharashtra', en: 'Maharashtra', hi: 'महाराष्ट्र', mr: 'महाराष्ट्र' },
        { key: 'punjab', en: 'Punjab', hi: 'पंजाब', mr: 'पंजाब' },
        { key: 'up', en: 'Uttar Pradesh', hi: 'उत्तर प्रदेश', mr: 'उत्तर प्रदेश' },
        { key: 'mp', en: 'Madhya Pradesh', hi: 'मध्य प्रदेश', mr: 'मध्य प्रदेश' },
        { key: 'rajasthan', en: 'Rajasthan', hi: 'राजस्थान', mr: 'राजस्थान' },
    ];


    // ─── Helper functions ─────────────────────────────────────
    const getOptionLabel = (option: { key: string; en: string; hi: string; mr: string }) => {
        if (isMarathi) return option.mr;
        if (isHindi) return option.hi;
        return option.en;
    };

    const getStoryTitle = (story: SuccessStory) => {
        if (isMarathi) return story.titleMr;
        if (isHindi) return story.titleHi;
        return story.title;
    };

    const getStorySummary = (story: SuccessStory) => {
        if (isMarathi) return story.summaryMr;
        if (isHindi) return story.summaryHi;
        return story.summary;
    };

    const getFarmerName = (story: SuccessStory) => {
        if (isMarathi) return story.farmerNameMr;
        if (isHindi) return story.farmerNameHi;
        return story.farmerName;
    };

    const getLocation = (story: SuccessStory) => {
        if (isMarathi) return story.locationMr;
        if (isHindi) return story.locationHi;
        return story.location;
    };

    const getCropType = (story: SuccessStory) => {
        if (isMarathi) return story.cropTypeMr;
        if (isHindi) return story.cropTypeHi;
        return story.cropType;
    };

    const getSchemeName = (story: SuccessStory) => {
        if (isMarathi) return story.schemeMr;
        if (isHindi) return story.schemeHi;
        return story.scheme;
    };

    const getTimeAgo = (days: number) => {
        if (days === 0) {
            return t('justNow');
        }
        if (days < 7) {
            return `${days} ${t('daysAgo')}`;
        } else if (days < 30) {
            const weeks = Math.floor(days / 7);
            return `${weeks} ${t('weeksAgo')}`;
        } else {
            const months = Math.floor(days / 30);
            return `${months} ${t('monthsAgo')}`;
        }
    };


    // ─── Filtered stories (now uses storiesData state) ────────
    const filteredStories = useMemo(() => {
        let stories = [...storiesData];

        if (selectedCropType !== 'all') {
            stories = stories.filter(s => s.tags.some(tag => tag.includes(selectedCropType)));
        }
        if (selectedLandSize !== 'all') {
            stories = stories.filter(s => s.landCategory === selectedLandSize);
        }
        if (selectedScheme !== 'all') {
            stories = stories.filter(s => s.schemeId === selectedScheme);
        }
        if (selectedRegion !== 'all') {
            stories = stories.filter(s => s.state === selectedRegion);
        }

        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            stories = stories.filter(s =>
                s.title.toLowerCase().includes(q) ||
                s.titleHi.includes(searchQuery) ||
                s.titleMr.includes(searchQuery) ||
                s.scheme.toLowerCase().includes(q) ||
                s.cropType.toLowerCase().includes(q) ||
                s.farmerName.toLowerCase().includes(q)
            );
        }

        switch (activeTab) {
            case 'recommended':
                stories = stories.filter(s => {
                    const matchesState = !userData.state || s.state === userData.state.toLowerCase();
                    const matchesLandSize = !userData.landSize ||
                        (userData.landSize < 1 && s.landCategory === 'marginal') ||
                        (userData.landSize >= 1 && userData.landSize < 2 && s.landCategory === 'small') ||
                        (userData.landSize >= 2 && userData.landSize < 4 && s.landCategory === 'medium') ||
                        (userData.landSize >= 4 && s.landCategory === 'large');
                    return matchesState || matchesLandSize;
                });
                break;
            case 'trending':
                stories = stories.sort((a, b) => (b.likes + b.shares * 2) - (a.likes + a.shares * 2));
                break;
            case 'recent':
                stories = stories.sort((a, b) => a.postedDaysAgo - b.postedDaysAgo);
                break;
        }

        return stories;
    }, [selectedCropType, selectedLandSize, selectedScheme, selectedRegion, searchQuery, activeTab, userData, storiesData]);

    // Featured stories (now uses storiesData state)
    const featuredStories = useMemo(() => {
        return storiesData.filter(s => s.isFeatured).slice(0, 3);
    }, [storiesData]);


    // ─── Handlers ─────────────────────────────────────────────
    const handleLike = useCallback((storyId: string) => {
        setLikedStories(prev => {
            const next = new Set(prev);
            if (next.has(storyId)) {
                next.delete(storyId);
            } else {
                next.add(storyId);
            }
            return next;
        });
    }, []);

    const handleSave = useCallback((storyId: string) => {
        setSavedStories(prev => {
            const next = new Set(prev);
            if (next.has(storyId)) {
                next.delete(storyId);
            } else {
                next.add(storyId);
            }
            return next;
        });
    }, []);

    const handleShare = useCallback((story: SuccessStory) => {
        const text = isMarathi
            ? `${getFarmerName(story)} यांची यशोगाथा वाचा: ${getStoryTitle(story)}`
            : isHindi
                ? `${getFarmerName(story)} की सफलता की कहानी पढ़ें: ${getStoryTitle(story)}`
                : `Read ${getFarmerName(story)}'s success story: ${getStoryTitle(story)}`;

        if (navigator.share) {
            navigator.share({ title: getStoryTitle(story), text }).catch(() => { });
        } else {
            navigator.clipboard?.writeText(text).catch(() => { });
        }
    }, [isHindi, isMarathi]);

    const clearFilters = useCallback(() => {
        setSelectedCropType('all');
        setSelectedLandSize('all');
        setSelectedScheme('all');
        setSelectedRegion('all');
    }, []);

    const activeFiltersCount = useMemo(() => {
        let count = 0;
        if (selectedCropType !== 'all') count++;
        if (selectedLandSize !== 'all') count++;
        if (selectedScheme !== 'all') count++;
        if (selectedRegion !== 'all') count++;
        return count;
    }, [selectedCropType, selectedLandSize, selectedScheme, selectedRegion]);


    // ─── Change 5: Speech Recognition Handler ────────────────
    const handleMicClick = useCallback(() => {
        if (isRecording) {
            // Stop recording
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
            setIsRecording(false);
            return;
        }

        const SpeechRecognitionAPI = (window as unknown as Record<string, unknown>).SpeechRecognition ||
            (window as unknown as Record<string, unknown>).webkitSpeechRecognition;

        if (!SpeechRecognitionAPI) {
            console.warn('SpeechRecognition API is not supported in this browser.');
            return;
        }

        try {
            const recognition = new (SpeechRecognitionAPI as new () => ISpeechRecognition)();
            recognition.lang = 'en-IN';
            recognition.interimResults = false;
            recognition.continuous = false;
            recognitionRef.current = recognition;

            recognition.onresult = (event: ISpeechRecognitionEvent) => {
                const transcript = event.results[event.results.length - 1][0].transcript;
                setStoryText(prev => prev ? `${prev} ${transcript}` : transcript);
            };

            recognition.onerror = (event: { error: string }) => {
                console.warn('Speech recognition error:', event.error);
                setIsRecording(false);
            };

            recognition.onend = () => {
                setIsRecording(false);
            };

            recognition.start();
            setIsRecording(true);
        } catch (err) {
            console.warn('Failed to start speech recognition:', err);
            setIsRecording(false);
        }
    }, [isRecording]);


    // ─── Change 6: Post Story Handler ─────────────────────────
    const handlePostStory = useCallback(() => {
        if (!storyText.trim()) {
            setShakeTextarea(true);
            setTimeout(() => setShakeTextarea(false), 600);
            return;
        }

        const trimmedText = storyText.trim();
        const titleText = trimmedText.length > 60
            ? trimmedText.substring(0, 60) + '...'
            : trimmedText;

        const farmerName = userData.name || 'You';
        const farmerLocation = userData.state || 'Your Location';

        const newStory: SuccessStory = {
            id: Date.now().toString(),
            farmerName: farmerName,
            farmerNameHi: farmerName,
            farmerNameMr: farmerName,
            farmerImage: '',
            location: farmerLocation,
            locationHi: '',
            locationMr: '',
            state: '',
            cropType: 'General',
            cropTypeHi: 'General',
            cropTypeMr: 'General',
            landSize: 1,
            landUnit: 'Hectares',
            landCategory: 'small',
            scheme: 'Community Post',
            schemeHi: 'Community Post',
            schemeMr: 'Community Post',
            schemeId: 'community',
            title: titleText,
            titleHi: titleText,
            titleMr: titleText,
            summary: trimmedText,
            summaryHi: trimmedText,
            summaryMr: trimmedText,
            benefitAmount: '',
            likes: 0,
            comments: 0,
            shares: 0,
            views: 0,
            isVerified: false,
            isFeatured: false,
            postedDaysAgo: 0,
            tags: ['community', 'user-post'],
        };

        setStoriesData(prev => [newStory, ...prev]);
        setStoryText('');
        setShowStoryInput(false);
    }, [storyText, userData]);


    // ─── Render Story Card (Changes 1, 2, 3 applied) ─────────
    const renderStoryCard = (story: SuccessStory, index: number, isFeatured = false) => {
        const isExpanded = expandedStory === story.id;
        const isLiked = likedStories.has(story.id);
        const isSaved = savedStories.has(story.id);
        const keyHighlight = getKeyHighlight(story);

        // Change 1: Generate initials and color
        const initials = getInitials(story.farmerName);
        const avatarColor = getAvatarColor(story.farmerName);

        return (
            <motion.div
                key={story.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: index * 0.05 }}
                className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden 
                    hover:shadow-md transition-shadow duration-200
                    ${isFeatured ? 'border-l-4 border-l-[#F5A623]' : ''}`}
            >
                {/* Featured badge */}
                {story.isFeatured && (
                    <div className="bg-gradient-to-r from-[#F5A623] to-[#FFD93D] px-4 py-1.5 flex items-center gap-2">
                        <Star className="w-3.5 h-3.5 text-white" fill="white" />
                        <span className="text-[11px] font-bold text-white uppercase tracking-wide">
                            {t('featuredStories')}
                        </span>
                    </div>
                )}

                <div className="p-4">
                    {/* Farmer info header - Change 1: Initials avatar */}
                    <div className="flex items-start gap-3 mb-3">
                        <div
                            className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden"
                            style={{ backgroundColor: avatarColor }}
                        >
                            {story.farmerImage ? (
                                <img src={story.farmerImage} alt="" className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-white font-bold text-[16px] select-none">
                                    {initials}
                                </span>
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                                <h4 className="font-semibold text-[14px] text-[#1C1C1E] truncate">
                                    {getFarmerName(story)}
                                </h4>
                                {story.isVerified && (
                                    <div className="flex items-center gap-1 bg-[#97BC62]/10 px-1.5 py-0.5 rounded-full">
                                        <CheckCircle className="w-3 h-3 text-[#2D6A2D]" />
                                        <span className="text-[9px] font-medium text-[#2D6A2D]">{t('verified')}</span>
                                    </div>
                                )}
                            </div>
                            <div className="flex items-center gap-2 text-[11px] text-[#6B7280]">
                                <MapPin className="w-3 h-3" />
                                <span>{getLocation(story)}</span>
                                <span>•</span>
                                <Clock className="w-3 h-3" />
                                <span>{getTimeAgo(story.postedDaysAgo)}</span>
                            </div>
                        </div>
                        <button
                            onClick={() => handleSave(story.id)}
                            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isSaved ? 'bg-[#F5A623]/10' : 'bg-gray-50 hover:bg-gray-100'
                                }`}
                        >
                            <Bookmark
                                className={`w-4 h-4 ${isSaved ? 'text-[#F5A623] fill-[#F5A623]' : 'text-gray-400'}`}
                            />
                        </button>
                    </div>

                    {/* Tags - Change 2: More pill-shaped with bolder text */}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                        <span className="px-3 py-1 bg-[#2D6A2D]/10 text-[#2D6A2D] rounded-full text-[10px] font-bold tracking-wide">
                            {getSchemeName(story)}
                        </span>
                        <span className="px-3 py-1 bg-[#F5A623]/10 text-[#F5A623] rounded-full text-[10px] font-bold flex items-center gap-1 tracking-wide">
                            <Wheat className="w-3 h-3" />
                            {getCropType(story)}
                        </span>
                        <span className="px-3 py-1 bg-gray-100 text-[#6B7280] rounded-full text-[10px] font-bold tracking-wide">
                            {story.landSize} {story.landUnit}
                        </span>
                    </div>

                    {/* Story title */}
                    <h3 className="font-semibold text-[15px] text-[#1C1C1E] mb-2 leading-tight">
                        {getStoryTitle(story)}
                    </h3>

                    {/* Story summary */}
                    <p className={`text-[13px] text-[#6B7280] leading-relaxed ${!isExpanded ? 'line-clamp-3' : ''}`}>
                        {getStorySummary(story)}
                    </p>

                    {/* Expand/collapse */}
                    <button
                        onClick={() => setExpandedStory(isExpanded ? null : story.id)}
                        className="flex items-center gap-1 text-[#F5A623] text-[12px] font-medium mt-2"
                    >
                        {isExpanded ? (
                            <>
                                <ChevronUp className="w-4 h-4" />
                                {isMarathi ? 'कमी दाखवा' : isHindi ? 'कम दिखाएं' : 'Show Less'}
                            </>
                        ) : (
                            <>
                                <ChevronDown className="w-4 h-4" />
                                {t('readMore')}
                            </>
                        )}
                    </button>

                    {/* Benefits stats - Changes 2 & 3: Polished look + Key Highlight */}
                    {(story.benefitAmount || story.incomeIncrease || story.yieldImprovement || story.costSaving) && (
                        <div className="relative mt-3 bg-[#F7F3EE] rounded-xl p-3">
                            {/* Change 3: Key Highlight badge */}
                            {keyHighlight && (
                                <div className="absolute -top-2.5 right-3 bg-[#F5A623] text-[#1C1C1E] px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 shadow-sm">
                                    <span>✨</span>
                                    <span>{t('keyHighlight')}: {keyHighlight.value}</span>
                                </div>
                            )}

                            <div className={`grid grid-cols-2 gap-2 ${keyHighlight ? 'mt-2' : ''}`}>
                                {story.benefitAmount && (
                                    <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 border-l-[3px]" style={{ borderLeftColor: statBorderColors.benefitAmount }}>
                                        <div className="w-8 h-8 rounded-lg bg-[#97BC62]/20 flex items-center justify-center">
                                            <IndianRupee className="w-4 h-4 text-[#2D6A2D]" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-[#6B7280]">{t('benefitReceived')}</p>
                                            <p className="text-[13px] font-bold text-[#2D6A2D]">{story.benefitAmount}</p>
                                        </div>
                                    </div>
                                )}
                                {story.incomeIncrease && (
                                    <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 border-l-[3px]" style={{ borderLeftColor: statBorderColors.incomeIncrease }}>
                                        <div className="w-8 h-8 rounded-lg bg-[#F5A623]/20 flex items-center justify-center">
                                            <TrendingUp className="w-4 h-4 text-[#F5A623]" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-[#6B7280]">{t('incomeIncrease')}</p>
                                            <p className="text-[13px] font-bold text-[#F5A623]">+{story.incomeIncrease}</p>
                                        </div>
                                    </div>
                                )}
                                {story.yieldImprovement && (
                                    <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 border-l-[3px]" style={{ borderLeftColor: statBorderColors.yieldImprovement }}>
                                        <div className="w-8 h-8 rounded-lg bg-[#60A5FA]/20 flex items-center justify-center">
                                            <Wheat className="w-4 h-4 text-[#2563EB]" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-[#6B7280]">{t('yieldImprovement')}</p>
                                            <p className="text-[13px] font-bold text-[#2563EB]">+{story.yieldImprovement}</p>
                                        </div>
                                    </div>
                                )}
                                {story.costSaving && (
                                    <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 border-l-[3px]" style={{ borderLeftColor: statBorderColors.costSaving }}>
                                        <div className="w-8 h-8 rounded-lg bg-[#34D399]/20 flex items-center justify-center">
                                            <IndianRupee className="w-4 h-4 text-[#059669]" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-[#6B7280]">{t('costSaving')}</p>
                                            <p className="text-[13px] font-bold text-[#059669]">{story.costSaving}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Video indicator */}
                    {story.videoUrl && (
                        <button className="w-full mt-3 py-2.5 bg-[#2D6A2D]/5 border border-[#2D6A2D]/20 rounded-xl flex items-center justify-center gap-2 hover:bg-[#2D6A2D]/10 transition-colors">
                            <Play className="w-4 h-4 text-[#2D6A2D]" />
                            <span className="text-[12px] font-medium text-[#2D6A2D]">{t('watchVideo')}</span>
                        </button>
                    )}

                    {/* Engagement stats */}
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => handleLike(story.id)}
                                className={`flex items-center gap-1.5 ${isLiked ? 'text-[#F87171]' : 'text-[#6B7280]'}`}
                            >
                                <Heart className={`w-4 h-4 ${isLiked ? 'fill-[#F87171]' : ''}`} />
                                <span className="text-[12px] font-medium">
                                    {story.likes + (isLiked ? 1 : 0)}
                                </span>
                            </button>
                            <button className="flex items-center gap-1.5 text-[#6B7280]">
                                <MessageCircle className="w-4 h-4" />
                                <span className="text-[12px] font-medium">{story.comments}</span>
                            </button>
                            <button
                                onClick={() => handleShare(story)}
                                className="flex items-center gap-1.5 text-[#6B7280]"
                            >
                                <Share2 className="w-4 h-4" />
                                <span className="text-[12px] font-medium">{story.shares}</span>
                            </button>
                        </div>
                        <div className="flex items-center gap-1 text-[#9CA3AF]">
                            <Eye className="w-3.5 h-3.5" />
                            <span className="text-[11px]">{story.views.toLocaleString()} {t('views')}</span>
                        </div>
                    </div>
                </div>
            </motion.div>
        );
    };


    // ─── Render Case Study Card ───────────────────────────────
    const renderCaseStudyCard = (caseStudy: CaseStudy) => (
        <div key={caseStudy.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 min-w-[280px] snap-start hover:shadow-md transition-shadow duration-200">
            <div className="flex items-start gap-3 mb-3">
                <div className="w-12 h-12 rounded-2xl bg-[#2D6A2D]/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-[24px]">{caseStudy.icon}</span>
                </div>
                <div className="flex-1">
                    <h4 className="font-semibold text-[14px] text-[#1C1C1E] line-clamp-2">
                        {isMarathi ? caseStudy.titleMr : isHindi ? caseStudy.titleHi : caseStudy.title}
                    </h4>
                    <p className="text-[11px] text-[#6B7280] mt-0.5">
                        {isMarathi ? caseStudy.regionMr : isHindi ? caseStudy.regionHi : caseStudy.region}
                    </p>
                </div>
            </div>

            <p className="text-[12px] text-[#6B7280] mb-3 line-clamp-2">
                {isMarathi ? caseStudy.descriptionMr : isHindi ? caseStudy.descriptionHi : caseStudy.description}
            </p>

            <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="bg-[#F7F3EE] rounded-lg px-3 py-2">
                    <p className="text-[10px] text-[#6B7280]">{t('happyFarmers')}</p>
                    <p className="text-[14px] font-bold text-[#2D6A2D]">
                        {caseStudy.farmersImpacted.toLocaleString()}+
                    </p>
                </div>
                <div className="bg-[#F7F3EE] rounded-lg px-3 py-2">
                    <p className="text-[10px] text-[#6B7280]">{t('totalBenefits')}</p>
                    <p className="text-[14px] font-bold text-[#F5A623]">{caseStudy.totalBenefits}</p>
                </div>
            </div>

            <button className="w-full py-2 border border-[#2D6A2D]/30 text-[#2D6A2D] rounded-xl text-[12px] font-medium flex items-center justify-center gap-1.5 hover:bg-[#2D6A2D]/5 transition-colors">
                {t('readFull')}
                <ChevronRight className="w-4 h-4" />
            </button>
        </div>
    );


    // ─── Render Video Testimonial Card ────────────────────────
    const renderVideoCard = (video: VideoTestimonial) => (
        <div
            key={video.id}
            onClick={() => video.videoUrl && setSelectedVideo(video)}
            className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden min-w-[200px] snap-start hover:shadow-md transition-shadow duration-200 ${video.videoUrl ? 'cursor-pointer' : 'opacity-75'}`}
        >
            <div className="relative h-28 bg-gradient-to-br from-[#1A3C1A] to-[#2D6A2D] flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Play className="w-6 h-6 text-white fill-white" />
                </div>
                <div className="absolute bottom-2 right-2 bg-black/60 px-2 py-0.5 rounded text-white text-[10px] font-medium">
                    {video.duration}
                </div>
            </div>
            <div className="p-3">
                <h4 className="font-semibold text-[12px] text-[#1C1C1E] line-clamp-2 mb-1">
                    {isMarathi ? video.titleMr : isHindi ? video.titleHi : video.title}
                </h4>
                <div className="flex items-center justify-between">
                    <p className="text-[10px] text-[#6B7280]">
                        {video.farmerName} • {video.views.toLocaleString()} {t('views')}
                    </p>
                    {video.videoUrl && (
                        <span className="text-[9px] bg-[#2D6A2D]/10 text-[#2D6A2D] px-1.5 py-0.5 rounded-full font-bold">
                            WATCH
                        </span>
                    )}
                </div>
            </div>
        </div>
    );


    // ─── Render Video Modal ──────────────────────────────────
    const renderVideoModal = () => (
        <AnimatePresence>
            {selectedVideo && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-4 lg:p-8"
                    onClick={() => setSelectedVideo(null)}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="bg-white rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="relative aspect-video bg-black">
                            <video
                                src={selectedVideo.videoUrl}
                                controls
                                autoPlay
                                className="w-full h-full object-contain"
                            />
                            <button
                                onClick={() => setSelectedVideo(null)}
                                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center backdrop-blur-md hover:bg-black/70 transition-all border border-white/20"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="p-5 flex items-start justify-between gap-4">
                            <div>
                                <h3 className="font-bold text-[18px] text-[#1C1C1E] mb-1">
                                    {isMarathi ? selectedVideo.titleMr : isHindi ? selectedVideo.titleHi : selectedVideo.title}
                                </h3>
                                <p className="text-[13px] text-[#6B7280]">
                                    {selectedVideo.farmerName} • {selectedVideo.location}
                                </p>
                            </div>
                            <div className="bg-[#F5A623]/10 text-[#F5A623] px-3 py-1.5 rounded-xl text-[12px] font-bold">
                                {selectedVideo.scheme}
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );


    // ─── Render Scheme Benefits Card ──────────────────────────
    const renderSchemeBenefitCard = (benefit: SchemeBenefitInfo) => {
        if (benefit.isPlaceholder) {
            return (
                <div key={benefit.id} className="bg-gray-50 rounded-2xl p-4 border-2 border-dashed border-gray-200 min-w-[260px] snap-start">
                    <div className="flex items-center gap-3 mb-3">
                        <span className="text-[24px]">{benefit.icon}</span>
                        <div>
                            <p className="font-medium text-[13px] text-[#6B7280]">
                                {isMarathi ? benefit.schemeNameMr : isHindi ? benefit.schemeNameHi : benefit.schemeName}
                            </p>
                            <p className="text-[10px] text-[#9CA3AF]">{t('comingSoon')}</p>
                        </div>
                    </div>
                    <p className="text-[11px] text-[#9CA3AF] text-center py-4">
                        {t('schemeInfoPlaceholder')}
                    </p>
                </div>
            );
        }

        return (
            <div key={benefit.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 min-w-[260px] snap-start hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center gap-3 mb-3">
                    <span className="text-[24px]">{benefit.icon}</span>
                    <div>
                        <p className="font-semibold text-[14px] text-[#1C1C1E]">
                            {isMarathi ? benefit.schemeNameMr : isHindi ? benefit.schemeNameHi : benefit.schemeName}
                        </p>
                        {benefit.lastUpdated && (
                            <p className="text-[9px] text-[#9CA3AF]">
                                {isMarathi ? 'अपडेट:' : isHindi ? 'अपडेट:' : 'Updated:'} {benefit.lastUpdated}
                            </p>
                        )}
                    </div>
                </div>

                <div className="space-y-2 mb-3">
                    {benefit.benefits.map((b, i) => (
                        <div key={i} className="flex justify-between items-center bg-[#F7F3EE] rounded-lg px-3 py-2">
                            <span className="text-[11px] text-[#6B7280]">
                                {isMarathi ? b.titleMr : isHindi ? b.titleHi : b.title}
                            </span>
                            <span className="text-[12px] font-semibold text-[#2D6A2D]">
                                {isMarathi ? b.valueMr : isHindi ? b.valueHi : b.value}
                            </span>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-2 gap-2">
                    {benefit.stats.map((stat, i) => (
                        <div key={i} className="text-center">
                            <p className="text-[16px] font-bold text-[#F5A623]">{stat.value}</p>
                            <p className="text-[9px] text-[#6B7280]">
                                {isMarathi ? stat.labelMr : isHindi ? stat.labelHi : stat.label}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        );
    };


    // ─── Render Filters Modal ─────────────────────────────────
    const renderFiltersModal = () => (
        <AnimatePresence>
            {showFilters && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center"
                    onClick={() => setShowFilters(false)}
                >
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 25 }}
                        className="bg-white rounded-t-3xl w-full max-h-[80vh] overflow-y-auto p-6"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-bold text-[18px] text-[#1C1C1E]">{t('filterStories')}</h3>
                            <button
                                onClick={() => setShowFilters(false)}
                                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Crop Type */}
                        <div className="mb-5">
                            <p className="text-[13px] font-semibold text-[#1C1C1E] mb-2">{t('cropType')}</p>
                            <div className="flex flex-wrap gap-2">
                                {cropTypes.map(crop => (
                                    <button
                                        key={crop.key}
                                        onClick={() => setSelectedCropType(crop.key)}
                                        className={`px-3 py-1.5 rounded-full text-[12px] font-medium transition-all ${selectedCropType === crop.key
                                            ? 'bg-[#2D6A2D] text-white'
                                            : 'bg-gray-100 text-[#6B7280]'
                                            }`}
                                    >
                                        {getOptionLabel(crop)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Land Size */}
                        <div className="mb-5">
                            <p className="text-[13px] font-semibold text-[#1C1C1E] mb-2">{t('landSize')}</p>
                            <div className="flex flex-wrap gap-2">
                                {landSizes.map(size => (
                                    <button
                                        key={size.key}
                                        onClick={() => setSelectedLandSize(size.key)}
                                        className={`px-3 py-1.5 rounded-full text-[12px] font-medium transition-all ${selectedLandSize === size.key
                                            ? 'bg-[#2D6A2D] text-white'
                                            : 'bg-gray-100 text-[#6B7280]'
                                            }`}
                                    >
                                        {getOptionLabel(size)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Scheme */}
                        <div className="mb-5">
                            <p className="text-[13px] font-semibold text-[#1C1C1E] mb-2">{t('scheme')}</p>
                            <div className="flex flex-wrap gap-2">
                                {schemes.map(scheme => (
                                    <button
                                        key={scheme.key}
                                        onClick={() => setSelectedScheme(scheme.key)}
                                        className={`px-3 py-1.5 rounded-full text-[12px] font-medium transition-all ${selectedScheme === scheme.key
                                            ? 'bg-[#2D6A2D] text-white'
                                            : 'bg-gray-100 text-[#6B7280]'
                                            }`}
                                    >
                                        {getOptionLabel(scheme)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Region */}
                        <div className="mb-6">
                            <p className="text-[13px] font-semibold text-[#1C1C1E] mb-2">{t('region')}</p>
                            <div className="flex flex-wrap gap-2">
                                {regions.map(region => (
                                    <button
                                        key={region.key}
                                        onClick={() => setSelectedRegion(region.key)}
                                        className={`px-3 py-1.5 rounded-full text-[12px] font-medium transition-all ${selectedRegion === region.key
                                            ? 'bg-[#2D6A2D] text-white'
                                            : 'bg-gray-100 text-[#6B7280]'
                                            }`}
                                    >
                                        {getOptionLabel(region)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex gap-3">
                            <button
                                onClick={clearFilters}
                                className="flex-1 py-3 border border-gray-200 text-[#1C1C1E] rounded-xl font-medium text-[14px]"
                            >
                                {t('clearAll')}
                            </button>
                            <button
                                onClick={() => setShowFilters(false)}
                                className="flex-1 py-3 bg-[#F5A623] text-white rounded-xl font-bold text-[14px]"
                            >
                                {t('applyFilters')}
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );


    // ─── Main Render ──────────────────────────────────────────
    return (
        <div className="min-h-screen bg-[#F7F3EE] pb-24">
            {/* ─── Top Bar ─────────────────────────────────────────── */}
            <div className="bg-gradient-to-b from-[#1A3C1A] to-[#2D6A2D] pt-10 pb-4 px-4 sticky top-0 z-20">
                <div className="flex items-center justify-between mb-4">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 text-white" />
                    </button>
                    <h1 className="font-bold text-white text-[16px]">
                        {t('communityStories')}
                    </h1>
                    <div className="w-9" />
                </div>

                {/* Search Bar */}
                <div className="bg-white rounded-2xl p-3 shadow-sm flex items-center gap-3">
                    <Search className="w-5 h-5 text-[#6B7280] flex-shrink-0" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={t('searchPlaceholder') as string}
                        className="flex-1 bg-transparent border-none outline-none text-[14px] placeholder:text-[#9CA3AF] text-[#111827]"
                    />
                    <button
                        onClick={() => setShowFilters(true)}
                        className={`relative w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${activeFiltersCount > 0 ? 'bg-[#F5A623]' : 'bg-[#F7F3EE]'
                            }`}
                    >
                        <Filter className={`w-4 h-4 ${activeFiltersCount > 0 ? 'text-white' : 'text-[#6B7280]'}`} />
                        {activeFiltersCount > 0 && (
                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#2D6A2D] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                                {activeFiltersCount}
                            </span>
                        )}
                    </button>
                </div>
            </div>

            <div className="px-4 pt-4">
                {/* ─── Community Stats ───────────────────────────────── */}
                <div className="grid grid-cols-4 gap-2 mb-4">
                    {[
                        { icon: Heart, label: t('happyFarmers'), value: '2.5L+', color: '#2D6A2D' },
                        { icon: TrendingUp, label: t('successRate'), value: '94%', color: '#F5A623' },
                        { icon: Award, label: t('schemesAvailed'), value: '15+', color: '#60A5FA' },
                        { icon: IndianRupee, label: t('totalBenefits'), value: '₹500Cr', color: '#97BC62' },
                    ].map((stat, i) => {
                        const Icon = stat.icon;
                        return (
                            <div key={i} className="bg-white rounded-2xl p-3 text-center shadow-sm border border-gray-100">
                                <div
                                    className="w-8 h-8 rounded-full mx-auto mb-1.5 flex items-center justify-center"
                                    style={{ backgroundColor: `${stat.color}15` }}
                                >
                                    <Icon className="w-4 h-4" style={{ color: stat.color }} />
                                </div>
                                <p className="text-[14px] font-bold text-[#1C1C1E]">{stat.value}</p>
                                <p className="text-[9px] text-[#6B7280] leading-tight">{stat.label}</p>
                            </div>
                        );
                    })}
                </div>

                {/* ─── Tab Filters ───────────────────────────────────── */}
                <div className="flex gap-2 overflow-x-auto pb-3 mb-2 hide-scrollbar">
                    {[
                        { key: 'all' as const, label: t('allStories') },
                        { key: 'recommended' as const, label: t('recommended'), icon: Sparkles },
                        { key: 'trending' as const, label: t('trending'), icon: TrendingUp },
                        { key: 'recent' as const, label: t('recent'), icon: Clock },
                    ].map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-[12px] font-semibold whitespace-nowrap transition-all ${activeTab === tab.key
                                    ? 'bg-[#2D6A2D] text-white'
                                    : 'bg-white text-[#6B7280] border border-gray-200'
                                    }`}
                            >
                                {Icon && <Icon className="w-3.5 h-3.5" />}
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                {/* Recommended banner */}
                {activeTab === 'recommended' && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-[#97BC62]/10 border border-[#97BC62]/30 rounded-2xl p-3 mb-4 flex items-center gap-3"
                    >
                        <div className="w-8 h-8 rounded-full bg-[#97BC62]/20 flex items-center justify-center flex-shrink-0">
                            <Sparkles className="w-4 h-4 text-[#2D6A2D]" />
                        </div>
                        <div className="flex-1">
                            <p className="text-[12px] text-[#2D6A2D] font-medium">{t('basedOnProfile')}</p>
                            <p className="text-[10px] text-[#6B7280]">
                                {userData.state && userData.landSize
                                    ? `${userData.state} • ${userData.landSize} ${userData.landUnit}`
                                    : t('helplineInfo')}
                            </p>
                        </div>
                    </motion.div>
                )}

                {/* ─── Featured Stories Section ──────────────────────── */}
                {activeTab === 'all' && featuredStories.length > 0 && (
                    <div className="mb-6">
                        <h2 className="font-bold text-[16px] text-[#1C1C1E] mb-3 flex items-center gap-2">
                            <Star className="w-4 h-4 text-[#F5A623]" />
                            {t('featuredStories')}
                        </h2>
                        <div className="space-y-3">
                            {featuredStories.map((story, index) => renderStoryCard(story, index, true))}
                        </div>
                    </div>
                )}

                {/* ─── Case Studies Section ──────────────────────────── */}
                {activeTab === 'all' && (
                    <div className="mb-6">
                        <h2 className="font-bold text-[16px] text-[#1C1C1E] mb-3 flex items-center gap-2">
                            <BookOpen className="w-4 h-4 text-[#2D6A2D]" />
                            {t('caseStudies')}
                        </h2>
                        <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar snap-x snap-mandatory">
                            {caseStudiesData.map(caseStudy => renderCaseStudyCard(caseStudy))}
                        </div>
                    </div>
                )}

                {/* ─── Video Testimonials Section ────────────────────── */}
                {activeTab === 'all' && (
                    <div className="mb-6">
                        <h2 className="font-bold text-[16px] text-[#1C1C1E] mb-3 flex items-center gap-2">
                            <Video className="w-4 h-4 text-[#F5A623]" />
                            {t('videoTestimonials')}
                        </h2>
                        <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar snap-x snap-mandatory">
                            {videoTestimonialsData.map(video => renderVideoCard(video))}
                            <div className="bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 min-w-[200px] h-[180px] flex flex-col items-center justify-center snap-start">
                                <Plus className="w-6 h-6 text-gray-300 mb-2" />
                                <p className="text-[11px] text-[#9CA3AF] text-center px-4">{t('comingSoon')}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* ─── Scheme Benefits Section ──────────────────────── */}
                {activeTab === 'all' && (
                    <div className="mb-6">
                        <h2 className="font-bold text-[16px] text-[#1C1C1E] mb-3 flex items-center gap-2">
                            <Award className="w-4 h-4 text-[#97BC62]" />
                            {t('schemeBenefits')}
                        </h2>
                        <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar snap-x snap-mandatory">
                            {schemeBenefitsData.map(benefit => renderSchemeBenefitCard(benefit))}
                        </div>
                        <p className="text-[10px] text-[#9CA3AF] mt-2 text-center italic">
                        </p>
                    </div>
                )}

                {/* ─── All Stories Section ───────────────────────────── */}
                <div className="mb-6">
                    {activeTab !== 'all' && (
                        <h2 className="font-bold text-[16px] text-[#1C1C1E] mb-3">
                            {activeTab === 'recommended' ? t('recommendedForYou') :
                                activeTab === 'trending' ? t('trending') : t('recent')}
                        </h2>
                    )}

                    {filteredStories.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center"
                        >
                            <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                                <Search className="w-8 h-8 text-gray-300" />
                            </div>
                            <p className="text-[14px] text-[#1C1C1E] font-semibold mb-1">
                                {t('noStoriesFound')}
                            </p>
                            <p className="text-[12px] text-[#6B7280] mb-4">
                                {t('tryDifferentFilters')}
                            </p>
                            <button
                                onClick={clearFilters}
                                className="bg-[#2D6A2D] text-white px-6 py-2.5 rounded-xl text-[13px] font-semibold"
                            >
                                {t('clearAll')}
                            </button>
                        </motion.div>
                    ) : (
                        <div className="space-y-3">
                            {filteredStories.map((story, index) => renderStoryCard(story, index))}
                        </div>
                    )}
                </div>

                {/* ─── Share Your Story CTA ──────────────────────────── */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-r from-[#1A3C1A] to-[#2D6A2D] rounded-2xl p-5 mb-4 text-center"
                >
                    <div className="w-14 h-14 bg-white/15 rounded-full mx-auto mb-3 flex items-center justify-center">
                        <Mic className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="font-bold text-[18px] text-white mb-1">
                        {t('shareYourStory')}
                    </h3>
                    <p className="text-[12px] text-white/70 mb-4">
                        {t('inspireOthers')}
                    </p>
                    <button
                        onClick={() => setShowStoryInput(prev => !prev)}
                        className="bg-[#F5A623] text-[#1C1C1E] px-6 py-3 rounded-xl font-bold text-[14px] flex items-center justify-center gap-2 mx-auto active:scale-95 transition-all"
                    >
                        {showStoryInput ? (
                            <>
                                <X className="w-4 h-4" />
                                {isMarathi ? 'बंद करा' : isHindi ? 'बंद करें' : 'Close'}
                            </>
                        ) : (
                            <>
                                <Plus className="w-4 h-4" />
                                {t('shareYourStory')}
                            </>
                        )}
                    </button>
                </motion.div>

                {/* ─── Change 4, 5, 6: Story Input Panel ─────────────── */}
                <AnimatePresence>
                    {showStoryInput && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ duration: 0.25 }}
                            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-4"
                        >
                            <h4 className="font-semibold text-[14px] text-[#1C1C1E] mb-3 flex items-center gap-2">
                                <BookOpen className="w-4 h-4 text-[#2D6A2D]" />
                                {t('tellYourStory')}
                            </h4>

                            <div className="relative">
                                <textarea
                                    value={storyText}
                                    onChange={(e) => setStoryText(e.target.value)}
                                    placeholder={t('writeYourStory') as string}
                                    className={`w-full min-h-[120px] bg-[#F7F3EE] border border-gray-200 rounded-xl p-3 text-[14px] text-[#1C1C1E] placeholder:text-[#9CA3AF] outline-none focus:border-[#2D6A2D] focus:ring-1 focus:ring-[#2D6A2D]/20 resize-none transition-all ${shakeTextarea ? 'animate-shake border-red-400' : ''
                                        }`}
                                />
                            </div>

                            <div className="flex items-center justify-between mt-3">
                                {/* Mic button - Change 5 */}
                                <button
                                    onClick={handleMicClick}
                                    className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-all ${isRecording
                                        ? 'bg-red-100'
                                        : 'bg-[#F7F3EE] hover:bg-gray-200'
                                        }`}
                                >
                                    <Mic className={`w-5 h-5 ${isRecording ? 'text-red-500' : 'text-[#6B7280]'}`} />
                                    {isRecording && (
                                        <span className="absolute inset-0 rounded-full border-2 border-red-400 animate-pulse" />
                                    )}
                                </button>

                                {isRecording && (
                                    <span className="text-[11px] text-red-500 font-medium flex items-center gap-1.5">
                                        <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                                        {t('recording')}
                                    </span>
                                )}

                                {/* Post button - Change 6 */}
                                <button
                                    onClick={handlePostStory}
                                    className="bg-[#2D6A2D] text-white px-5 py-2.5 rounded-xl font-bold text-[13px] flex items-center gap-2 active:scale-95 transition-all hover:bg-[#245824]"
                                >
                                    <Send className="w-4 h-4" />
                                    {t('postStory')}
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <BottomNav />

            {/* Filters Modal */}
            {renderFiltersModal()}

            {/* Video Modal */}
            {renderVideoModal()}

            <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
          20%, 40%, 60%, 80% { transform: translateX(4px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
        </div>
    );
}