// 
import { useState } from 'react';
import {
  ArrowLeft, Calendar, FileText, Clock, IndianRupee,
  ChevronDown, ChevronUp, CheckCircle, AlertCircle, ExternalLink,
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../../context/LanguageContext';
import { useUser } from '../../context/UserContext';

// ─── Types ───────────────────────────────────────────────────────────────────
interface EligibilityItem {
  met: true | false | 'warning';
  textEn: string;
  textHi: string;
  textMr: string;
}

interface DocumentItem {
  id: string;
  nameEn: string;
  nameHi: string;
  nameMr: string;
}

interface StepItem {
  step: number;
  textEn: string;
  textHi: string;
  textMr: string;
  timeEn: string;
  timeHi: string;
  timeMr: string;
}

interface SchemeData {
  id: string;
  logo: string;
  titleEn: string;
  titleHi: string;
  titleMr: string;
  shortTitle: string;
  typeEn: string;
  typeHi: string;
  typeMr: string;
  ministry: string;
  tags: string[];
  amount: string;
  amountHi: string;
  amountMr: string;
  amountLabel: string;
  amountLabelHi: string;
  amountLabelMr: string;
  deadline: string;
  deadlineHi: string;
  deadlineMr: string;
  processingTime: string;
  processingTimeHi: string;
  processingTimeMr: string;
  docsRequired: number;
  isEligible: boolean;
  eligibilityCriteria: EligibilityItem[];
  documents: DocumentItem[];
  steps: StepItem[];
  benefitEn: string;
  benefitHi: string;
  benefitMr: string;
  disbursementEn: string;
  disbursementHi: string;
  disbursementMr: string;
  applyUrl: string;
  casteCategories: string[];
}

// ─── Scheme Database ─────────────────────────────────────────────────────────
const schemeDatabase: Record<string, SchemeData> = {

  'pm-kisan': {
    id: 'pm-kisan',
    logo: '🏛️',
    titleEn: 'PM-Kisan Samman Nidhi',
    titleHi: 'प्रधानमंत्री किसान सम्मान निधि',
    titleMr: 'प्रधानमंत्री किसान सन्मान निधी',
    shortTitle: 'PM-KISAN',
    typeEn: 'Central Govt • Direct Benefit Transfer',
    typeHi: 'केंद्र सरकार • प्रत्यक्ष लाभ अंतरण',
    typeMr: 'केंद्र सरकार • थेट लाभ हस्तांतरण',
    ministry: 'Ministry of Agriculture & Farmers Welfare',
    tags: ['Central Govt', 'Direct Benefit'],
    amount: '₹6,000',
    amountHi: '₹6,000',
    amountMr: '₹6,000',
    amountLabel: 'Per year (3 installments of ₹2,000)',
    amountLabelHi: 'प्रति वर्ष (₹2,000 की 3 किश्तों में)',
    amountLabelMr: 'प्रति वर्ष (₹2,000 च्या 3 हप्त्यांमध्ये)',
    deadline: 'Ongoing',
    deadlineHi: 'चालू',
    deadlineMr: 'चालू',
    processingTime: '15 days',
    processingTimeHi: '15 दिन',
    processingTimeMr: '15 दिवस',
    docsRequired: 3,
    isEligible: true,
    eligibilityCriteria: [
      { met: true, textEn: 'Landholding farmer family with cultivable land in name', textHi: 'नाम पर खेती योग्य भूमि वाला किसान परिवार', textMr: 'नावावर शेतजमीन असलेले शेतकरी कुटुंब' },
      { met: true, textEn: 'Valid Aadhaar linked to bank account', textHi: 'बैंक खाते से लिंक वैध आधार', textMr: 'बँक खात्याशी जोडलेले वैध आधार' },
      { met: true, textEn: 'Active savings bank account', textHi: 'सक्रिय बचत बैंक खाता', textMr: 'सक्रिय बचत बँक खाते' },
      { met: 'warning', textEn: 'Annual income below ₹1.5L — Update profile to verify', textHi: 'वार्षिक आय ₹1.5 लाख से कम — सत्यापन हेतु प्रोफाइल अपडेट करें', textMr: 'वार्षिक उत्पन्न ₹1.5 लाखांपेक्षा कमी — पडताळणीसाठी प्रोफाइल अपडेट करा' },
      { met: false, textEn: 'Not a government employee or income tax payer', textHi: 'सरकारी कर्मचारी या आयकर दाता नहीं होना चाहिए', textMr: 'सरकारी कर्मचारी किंवा आयकर भरणारा नसावा' },
    ],
    documents: [
      { id: 'aadhaar', nameEn: 'Aadhaar Card', nameHi: 'आधार कार्ड', nameMr: 'आधार कार्ड' },
      { id: 'land', nameEn: 'Land Records / Khasra', nameHi: 'भूमि रिकॉर्ड / खसरा', nameMr: 'जमीन नोंदी / खसरा' },
      { id: 'bank', nameEn: 'Bank Passbook', nameHi: 'बैंक पासबुक', nameMr: 'बँक पासबुक' },
    ],
    steps: [
      { step: 1, textEn: 'Visit pmkisan.gov.in or nearest CSC', textHi: 'pmkisan.gov.in या नजदीकी CSC पर जाएं', textMr: 'pmkisan.gov.in किंवा जवळच्या CSC ला भेट द्या', timeEn: '5 min', timeHi: '5 मिनट', timeMr: '5 मिनिटे' },
      { step: 2, textEn: 'Fill farmer registration with Aadhaar & land details', textHi: 'आधार और जमीन का विवरण भरें', textMr: 'आधार आणि जमीन तपशील भरा', timeEn: '10 min', timeHi: '10 मिनट', timeMr: '10 मिनिटे' },
      { step: 3, textEn: 'Upload land, Aadhaar & bank passbook documents', textHi: 'जमीन, आधार और बैंक पासबुक अपलोड करें', textMr: 'जमीन, आधार आणि बँक पासबुक अपलोड करा', timeEn: '5 min', timeHi: '5 मिनट', timeMr: '5 मिनिटे' },
      { step: 4, textEn: 'Submit & check beneficiary status via Aadhaar', textHi: 'जमा करें और आधार से स्थिति जांचें', textMr: 'सबमिट करा आणि आधारद्वारे स्थिती तपासा', timeEn: 'Instant', timeHi: 'तुरंत', timeMr: 'त्वरित' },
    ],
    benefitEn: '₹6,000 per year per farmer family, paid as ₹2,000 every 4 months directly into bank account via DBT.',
    benefitHi: '₹6,000 प्रति वर्ष, ₹2,000 की 3 किश्तों में सीधे बैंक खाते में DBT द्वारा।',
    benefitMr: '₹6,000 प्रति वर्ष प्रति शेतकरी कुटुंब, DBT द्वारे थेट बँक खात्यात ₹2,000 दर 4 महिन्यांनी.',
    disbursementEn: 'Direct Benefit Transfer (DBT) — 8.2 crore farmers received last installment.',
    disbursementHi: 'प्रत्यक्ष लाभ अंतरण (DBT) — पिछली किश्त में 8.2 करोड़ किसानों को लाभ।',
    disbursementMr: 'थेट लाभ हस्तांतरण (DBT) — 8.2 कोटी शेतकऱ्यांना मागील हप्ता मिळाला.',
    applyUrl: 'https://pmkisan.gov.in',
    casteCategories: ['SC', 'ST', 'OBC', 'General'],
  },

  'pmfby': {
    id: 'pmfby',
    logo: '🌾',
    titleEn: 'Pradhan Mantri Fasal Bima Yojana',
    titleHi: 'प्रधानमंत्री फसल बीमा योजना',
    titleMr: 'प्रधानमंत्री पीक विमा योजना',
    shortTitle: 'PMFBY',
    typeEn: 'Central Govt • Crop Insurance',
    typeHi: 'केंद्र सरकार • फसल बीमा',
    typeMr: 'केंद्र सरकार • पीक विमा',
    ministry: 'Ministry of Agriculture & Farmers Welfare',
    tags: ['Central Govt', 'Insurance'],
    amount: 'Up to ₹2L',
    amountHi: '₹2 लाख तक',
    amountMr: '₹2 लाखांपर्यंत',
    amountLabel: 'Claim payout based on crop loss assessment',
    amountLabelHi: 'फसल हानि मूल्यांकन के आधार पर दावा भुगतान',
    amountLabelMr: 'पीक नुकसान मूल्यांकनावर आधारित दावा देयक',
    deadline: 'Feb 28',
    deadlineHi: '28 फरवरी',
    deadlineMr: '28 फेब्रुवारी',
    processingTime: '60 days',
    processingTimeHi: '60 दिन',
    processingTimeMr: '60 दिवस',
    docsRequired: 4,
    isEligible: true,
    eligibilityCriteria: [
      { met: true, textEn: 'Farmer growing notified crops in notified areas', textHi: 'अधिसूचित क्षेत्र में अधिसूचित फसल उगाने वाला किसान', textMr: 'अधिसूचित क्षेत्रात अधिसूचित पिके घेणारा शेतकरी' },
      { met: true, textEn: 'Insurable interest in the crop (owner/tenant/sharecropper)', textHi: 'फसल में बीमायोग्य हित (मालिक/किरायेदार/बटाईदार)', textMr: 'पिकामध्ये विमायोग्य हित (मालक/भाडेकरी/भागीदार)' },
      { met: true, textEn: 'Valid land ownership or tenancy agreement', textHi: 'वैध भूमि स्वामित्व या किरायेदारी समझौता', textMr: 'वैध जमीन मालकी किंवा भाडेकरार' },
      { met: 'warning', textEn: 'Must apply within 2 weeks of sowing season start', textHi: 'बुवाई सीजन शुरू होने के 2 सप्ताह के भीतर आवेदन करें', textMr: 'पेरणी हंगाम सुरू झाल्यापासून 2 आठवड्यांत अर्ज करणे आवश्यक' },
      { met: true, textEn: 'No prior compensation received for same crop loss', textHi: 'समान फसल हानि के लिए पूर्व में मुआवजा नहीं मिला हो', textMr: 'त्याच पीक नुकसानीसाठी आधी नुकसान भरपाई मिळालेली नसावी' },
    ],
    documents: [
      { id: 'aadhaar', nameEn: 'Aadhaar Card', nameHi: 'आधार कार्ड', nameMr: 'आधार कार्ड' },
      { id: 'land', nameEn: 'Land Records / 7-12 Extract', nameHi: 'भूमि रिकॉर्ड / 7-12 उतारा', nameMr: 'जमीन नोंदी / 7-12 उतारा' },
      { id: 'bank', nameEn: 'Bank Passbook', nameHi: 'बैंक पासबुक', nameMr: 'बँक पासबुक' },
      { id: 'crop', nameEn: 'Sowing Certificate', nameHi: 'बुवाई प्रमाण पत्र', nameMr: 'पेरणी प्रमाणपत्र' },
    ],
    steps: [
      { step: 1, textEn: 'Visit pmfby.gov.in and click "Farmer Corner"', textHi: 'pmfby.gov.in पर जाएं और "किसान कोना" पर क्लिक करें', textMr: 'pmfby.gov.in ला भेट द्या आणि "शेतकरी कोपरा" वर क्लिक करा', timeEn: '2 min', timeHi: '2 मिनट', timeMr: '2 मिनिटे' },
      { step: 2, textEn: 'Register as Guest Farmer with personal & land details', textHi: 'व्यक्तिगत और भूमि विवरण से Guest किसान के रूप में पंजीकरण करें', textMr: 'वैयक्तिक आणि जमीन तपशीलांसह Guest शेतकरी म्हणून नोंदणी करा', timeEn: '10 min', timeHi: '10 मिनट', timeMr: '10 मिनिटे' },
      { step: 3, textEn: 'Fill crop insurance application form & upload documents', textHi: 'फसल बीमा आवेदन फॉर्म भरें और दस्तावेज़ अपलोड करें', textMr: 'पीक विमा अर्ज फॉर्म भरा आणि कागदपत्रे अपलोड करा', timeEn: '10 min', timeHi: '10 मिनट', timeMr: '10 मिनिटे' },
      { step: 4, textEn: 'Pay applicable premium (2% Kharif / 1.5% Rabi)', textHi: 'लागू प्रीमियम चुकाएं (खरीफ 2% / रबी 1.5%)', textMr: 'लागू प्रीमियम भरा (खरीप 2% / रब्बी 1.5%)', timeEn: '5 min', timeHi: '5 मिनट', timeMr: '5 मिनिटे' },
    ],
    benefitEn: 'Crop insurance at minimal premium: 2% for Kharif, 1.5% for Rabi, 5% for horticulture. Covers yield loss, prevented sowing, post-harvest losses & localised calamities.',
    benefitHi: 'न्यूनतम प्रीमियम पर फसल बीमा: खरीफ 2%, रबी 1.5%, बागवानी 5%। उपज हानि, बुवाई रोकना, कटाई बाद हानि और स्थानीय आपदाएं कवर।',
    benefitMr: 'किमान प्रीमियमवर पीक विमा: खरीप 2%, रब्बी 1.5%, फलोत्पादन 5%. उत्पादन नुकसान, पेरणी रोखणे, काढणीनंतरचे नुकसान आणि स्थानिक आपत्ती कव्हर.',
    disbursementEn: 'Claims processed within 60 days of harvest. Technology (drones/satellites) used for loss assessment. 50+ crore farmers enrolled.',
    disbursementHi: 'कटाई के 60 दिनों के भीतर दावों का निपटान। हानि आकलन के लिए ड्रोन/उपग्रह तकनीक। 50+ करोड़ किसान नामांकित।',
    disbursementMr: 'काढणीच्या 60 दिवसांत दावे निकाली. नुकसान मूल्यांकनासाठी ड्रोन/उपग्रह तंत्रज्ञान. 50+ कोटी शेतकरी नोंदणीकृत.',
    applyUrl: 'https://pmfby.gov.in',
    casteCategories: ['SC', 'ST', 'OBC', 'General'],
  },

  'supi': {
    id: 'supi',
    logo: '💼',
    titleEn: 'Stand-Up India',
    titleHi: 'स्टैंड-अप इंडिया',
    titleMr: 'स्टँड-अप इंडिया',
    shortTitle: 'SUPI',
    typeEn: 'Central Govt • Business Loan',
    typeHi: 'केंद्र सरकार • व्यापार ऋण',
    typeMr: 'केंद्र सरकार • व्यवसाय कर्ज',
    ministry: 'Ministry of Finance — Department of Financial Services',
    tags: ['Central Govt', 'Loan'],
    amount: '₹10L – ₹1Cr',
    amountHi: '₹10 लाख – ₹1 करोड़',
    amountMr: '₹10 लाख – ₹1 कोटी',
    amountLabel: 'Composite loan (term loan + working capital)',
    amountLabelHi: 'संयुक्त ऋण (मियादी ऋण + कार्यशील पूंजी)',
    amountLabelMr: 'संयुक्त कर्ज (मुदत कर्ज + खेळते भांडवल)',
    deadline: 'March 31',
    deadlineHi: '31 मार्च',
    deadlineMr: '31 मार्च',
    processingTime: '30 days',
    processingTimeHi: '30 दिन',
    processingTimeMr: '30 दिवस',
    docsRequired: 5,
    isEligible: true,
    eligibilityCriteria: [
      { met: true, textEn: 'Finance for a Greenfield Enterprise (first-time venture)', textHi: 'ग्रीनफील्ड उद्यम (पहली बार का व्यवसाय) के लिए वित्त', textMr: 'ग्रीनफील्ड उद्योग (पहिल्यांदाचा व्यवसाय) साठी वित्त' },
      { met: true, textEn: 'Male applicant must be SC or ST category', textHi: 'पुरुष आवेदक SC या ST श्रेणी का होना चाहिए', textMr: 'पुरुष अर्जदार SC किंवा ST प्रवर्गाचा असणे आवश्यक' },
      { met: true, textEn: 'Minimum age of 18 years', textHi: 'न्यूनतम आयु 18 वर्ष', textMr: 'किमान वय 18 वर्षे' },
      { met: 'warning', textEn: 'Must not be in default to any bank/financial institution', textHi: 'किसी भी बैंक/वित्तीय संस्था में डिफॉल्टर नहीं होना चाहिए', textMr: 'कोणत्याही बँक/वित्तीय संस्थेचा थकबाकीदार नसावा' },
      { met: false, textEn: 'For non-individual enterprises: 51%+ SC/ST/Woman ownership', textHi: 'गैर-व्यक्तिगत उद्यम: 51%+ SC/ST/महिला स्वामित्व आवश्यक', textMr: 'गैर-वैयक्तिक उद्योगांसाठी: 51%+ SC/ST/महिला मालकी आवश्यक' },
    ],
    documents: [
      { id: 'aadhaar', nameEn: 'Aadhaar Card', nameHi: 'आधार कार्ड', nameMr: 'आधार कार्ड' },
      { id: 'caste', nameEn: 'Caste Certificate (SC/ST)', nameHi: 'जाति प्रमाण पत्र (SC/ST)', nameMr: 'जात प्रमाणपत्र (SC/ST)' },
      { id: 'business', nameEn: 'Business Plan / Project Report', nameHi: 'व्यवसाय योजना / परियोजना रिपोर्ट', nameMr: 'व्यवसाय योजना / प्रकल्प अहवाल' },
      { id: 'bank', nameEn: 'Bank Passbook / Statement', nameHi: 'बैंक पासबुक / विवरण', nameMr: 'बँक पासबुक / स्टेटमेंट' },
      { id: 'address', nameEn: 'Address Proof', nameHi: 'पता प्रमाण', nameMr: 'पत्ता पुरावा' },
    ],
    steps: [
      { step: 1, textEn: 'Visit standupmitra.in and register your profile', textHi: 'standupmitra.in पर जाएं और प्रोफाइल दर्ज करें', textMr: 'standupmitra.in ला भेट द्या आणि प्रोफाइल नोंदवा', timeEn: '10 min', timeHi: '10 मिनट', timeMr: '10 मिनिटे' },
      { step: 2, textEn: 'Enter business location, category (SC/ST/Woman), loan amount', textHi: 'व्यवसाय स्थान, श्रेणी (SC/ST/महिला), ऋण राशि दर्ज करें', textMr: 'व्यवसाय स्थान, प्रवर्ग (SC/ST/महिला), कर्ज रक्कम भरा', timeEn: '15 min', timeHi: '15 मिनट', timeMr: '15 मिनिटे' },
      { step: 3, textEn: 'Select handholding support if needed (mentoring, training)', textHi: 'यदि आवश्यक हो तो हैंडहोल्डिंग सहायता चुनें', textMr: 'आवश्यक असल्यास हँडहोल्डिंग सहाय्य निवडा', timeEn: '5 min', timeHi: '5 मिनट', timeMr: '5 मिनिटे' },
      { step: 4, textEn: 'Submit registration — bank will contact you for loan processing', textHi: 'पंजीकरण जमा करें — बैंक ऋण प्रक्रिया के लिए संपर्क करेगा', textMr: 'नोंदणी सबमिट करा — कर्ज प्रक्रियेसाठी बँक संपर्क करेल', timeEn: 'Instant', timeHi: 'तुरंत', timeMr: 'त्वरित' },
    ],
    benefitEn: 'Composite loan of ₹10L–₹1Cr for SC/ST and women entrepreneurs for greenfield projects. RuPay debit card issued. SIDBI portal provides mentoring, skill development, project report support.',
    benefitHi: 'SC/ST और महिला उद्यमियों के लिए ₹10L–₹1Cr तक का संयुक्त ऋण। RuPay डेबिट कार्ड मिलेगा। SIDBI पोर्टल से मेंटरिंग, कौशल विकास सहायता।',
    benefitMr: 'SC/ST आणि महिला उद्योजकांसाठी ग्रीनफील्ड प्रकल्पांसाठी ₹10L–₹1Cr संयुक्त कर्ज. RuPay डेबिट कार्ड मिळेल. SIDBI पोर्टलवरून मार्गदर्शन, कौशल्य विकास सहाय्य.',
    disbursementEn: 'Loan disbursed directly by participating bank branches. At least one SC/ST and one woman borrower per branch.',
    disbursementHi: 'भाग लेने वाली बैंक शाखाओं द्वारा सीधे ऋण वितरित। प्रत्येक शाखा से कम से कम एक SC/ST और एक महिला कर्जदार।',
    disbursementMr: 'सहभागी बँक शाखांद्वारे थेट कर्ज वितरण. प्रत्येक शाखेतून किमान एक SC/ST आणि एक महिला कर्जदार.',
    applyUrl: 'https://www.standupmitra.in',
    casteCategories: ['SC', 'ST'],
  },

  'pmsby': {
    id: 'pmsby',
    logo: '🛡️',
    titleEn: 'Pradhan Mantri Suraksha Bima Yojana',
    titleHi: 'प्रधानमंत्री सुरक्षा बीमा योजना',
    titleMr: 'प्रधानमंत्री सुरक्षा विमा योजना',
    shortTitle: 'PMSBY',
    typeEn: 'Central Govt • Accident Insurance',
    typeHi: 'केंद्र सरकार • दुर्घटना बीमा',
    typeMr: 'केंद्र सरकार • अपघात विमा',
    ministry: 'Ministry of Finance — Department of Financial Services',
    tags: ['Central Govt', 'Insurance'],
    amount: '₹2L cover',
    amountHi: '₹2 लाख कवर',
    amountMr: '₹2 लाख कव्हर',
    amountLabel: '₹20/year premium • Annual coverage June–May',
    amountLabelHi: '₹20/वर्ष प्रीमियम • वार्षिक कवरेज जून–मई',
    amountLabelMr: '₹20/वर्ष प्रीमियम • वार्षिक कव्हरेज जून–मे',
    deadline: 'May 31',
    deadlineHi: '31 मई',
    deadlineMr: '31 मे',
    processingTime: '30 days',
    processingTimeHi: '30 दिन',
    processingTimeMr: '30 दिवस',
    docsRequired: 2,
    isEligible: true,
    eligibilityCriteria: [
      { met: true, textEn: 'Individual bank account holder in a participating bank', textHi: 'भाग लेने वाले बैंक में व्यक्तिगत बैंक खाताधारक', textMr: 'सहभागी बँकेत वैयक्तिक बँक खातेधारक' },
      { met: true, textEn: 'Age between 18 years (completed) and 70 years', textHi: 'आयु 18 वर्ष (पूर्ण) और 70 वर्ष के बीच', textMr: 'वय 18 वर्षे (पूर्ण) ते 70 वर्षे दरम्यान' },
      { met: true, textEn: 'Consent given for auto-debit of ₹20 premium', textHi: 'ऑटो-डेबिट ₹20 प्रीमियम के लिए सहमति दी हो', textMr: '₹20 प्रीमियमच्या ऑटो-डेबिटसाठी संमती दिलेली असावी' },
      { met: false, textEn: 'Cover terminates at age 70 or account closure', textHi: 'आयु 70 वर्ष पर या खाता बंद होने पर कवर समाप्त', textMr: 'वय 70 वर्षे किंवा खाते बंद झाल्यावर कव्हर समाप्त' },
    ],
    documents: [
      { id: 'aadhaar', nameEn: 'Aadhaar Card', nameHi: 'आधार कार्ड', nameMr: 'आधार कार्ड' },
      { id: 'bank', nameEn: 'Bank Account Details', nameHi: 'बैंक खाता विवरण', nameMr: 'बँक खाते तपशील' },
    ],
    steps: [
      { step: 1, textEn: 'Visit your bank branch or download form from jansuraksha.gov.in', textHi: 'अपनी बैंक शाखा में जाएं या jansuraksha.gov.in से फॉर्म डाउनलोड करें', textMr: 'तुमच्या बँक शाखेला भेट द्या किंवा jansuraksha.gov.in वरून फॉर्म डाउनलोड करा', timeEn: '5 min', timeHi: '5 मिनट', timeMr: '5 मिनिटे' },
      { step: 2, textEn: 'Fill application form with bank & personal details', textHi: 'बैंक और व्यक्तिगत विवरण के साथ आवेदन पत्र भरें', textMr: 'बँक आणि वैयक्तिक तपशीलांसह अर्ज फॉर्म भरा', timeEn: '5 min', timeHi: '5 मिनट', timeMr: '5 मिनिटे' },
      { step: 3, textEn: 'Submit form to bank — auto-debit of ₹20 will be activated', textHi: 'बैंक को फॉर्म जमा करें — ₹20 का ऑटो-डेबिट सक्रिय होगा', textMr: 'बँकेला फॉर्म सबमिट करा — ₹20 चे ऑटो-डेबिट सक्रिय होईल', timeEn: '2 min', timeHi: '2 मिनट', timeMr: '2 मिनिटे' },
      { step: 4, textEn: 'Receive Acknowledgement Slip cum Certificate of Insurance', textHi: 'पावती पर्ची सह बीमा प्रमाण पत्र प्राप्त करें', textMr: 'पोचपावती स्लिप सह विमा प्रमाणपत्र प्राप्त करा', timeEn: 'Instant', timeHi: 'तुरंत', timeMr: 'त्वरित' },
    ],
    benefitEn: 'Death: ₹2L to nominee. Total disability (both eyes/hands/feet): ₹2L. Partial disability (one eye/hand/foot): ₹1L. Premium just ₹20/year via auto-debit.',
    benefitHi: 'मृत्यु: नॉमिनी को ₹2L। कुल अपंगता (दोनों आंख/हाथ/पैर): ₹2L। आंशिक अपंगता (एक आंख/हाथ/पैर): ₹1L। सिर्फ ₹20/वर्ष प्रीमियम ऑटो-डेबिट।',
    benefitMr: 'मृत्यू: नॉमिनीला ₹2L. संपूर्ण अपंगत्व (दोन्ही डोळे/हात/पाय): ₹2L. आंशिक अपंगत्व (एक डोळा/हात/पाय): ₹1L. फक्त ₹20/वर्ष प्रीमियम ऑटो-डेबिट.',
    disbursementEn: 'Claim paid directly to bank account / nominee. Toll free: 1800-180-1111 / 1800-110-001.',
    disbursementHi: 'दावा सीधे बैंक खाते / नॉमिनी को। टोल फ्री: 1800-180-1111 / 1800-110-001।',
    disbursementMr: 'दावा थेट बँक खाते / नॉमिनीला. टोल फ्री: 1800-180-1111 / 1800-110-001.',
    applyUrl: 'https://jansuraksha.gov.in/Forms-PMSBY.aspx',
    casteCategories: ['SC', 'ST', 'OBC', 'General'],
  },

  'post-dis': {
    id: 'post-dis',
    logo: '🎓',
    titleEn: 'Post Matric Scholarship (Disabilities)',
    titleHi: 'पोस्ट मैट्रिक छात्रवृत्ति (दिव्यांग)',
    titleMr: 'पोस्ट मॅट्रिक शिष्यवृत्ती (दिव्यांग)',
    shortTitle: 'POST-DIS',
    typeEn: 'Central Govt • Scholarship',
    typeHi: 'केंद्र सरकार • छात्रवृत्ति',
    typeMr: 'केंद्र सरकार • शिष्यवृत्ती',
    ministry: 'Ministry of Social Justice — Dept. of Empowerment of Persons with Disabilities',
    tags: ['Central Govt', 'Scholarship'],
    amount: 'Full Scholarship',
    amountHi: 'पूर्ण छात्रवृत्ति',
    amountMr: 'पूर्ण शिष्यवृत्ती',
    amountLabel: 'Maintenance + Disability + Book allowance',
    amountLabelHi: 'रखरखाव + विकलांगता + पुस्तक भत्ता',
    amountLabelMr: 'निर्वाह + अपंगत्व + पुस्तक भत्ता',
    deadline: 'Oct 31',
    deadlineHi: '31 अक्टूबर',
    deadlineMr: '31 ऑक्टोबर',
    processingTime: '45 days',
    processingTimeHi: '45 दिन',
    processingTimeMr: '45 दिवस',
    docsRequired: 4,
    isEligible: true,
    eligibilityCriteria: [
      { met: true, textEn: 'Student pursuing post-matric qualification (Class 11–Masters)', textHi: 'पोस्ट-मैट्रिक शिक्षा (कक्षा 11–मास्टर्स) में अध्ययनरत छात्र', textMr: 'पोस्ट-मॅट्रिक शिक्षण (इयत्ता 11–मास्टर्स) घेत असलेला विद्यार्थी' },
      { met: true, textEn: 'Disability percentage 40% or above', textHi: 'विकलांगता प्रतिशत 40% या अधिक', textMr: 'अपंगत्व टक्केवारी 40% किंवा त्याहून अधिक' },
      { met: 'warning', textEn: 'Family income must not exceed ₹2.5L per annum', textHi: 'पारिवारिक आय ₹2.5 लाख प्रति वर्ष से अधिक नहीं होनी चाहिए', textMr: 'कौटुंबिक उत्पन्न वार्षिक ₹2.5 लाखांपेक्षा जास्त नसावे' },
      { met: true, textEn: 'Not availing any other government scholarship', textHi: 'कोई अन्य सरकारी छात्रवृत्ति नहीं ले रहे', textMr: 'इतर कोणतीही सरकारी शिष्यवृत्ती घेत नसावा' },
      { met: false, textEn: 'Not the third or later sibling to receive this scholarship', textHi: 'तीसरे या बाद के भाई-बहन को यह छात्रवृत्ति नहीं मिल सकती', textMr: 'ही शिष्यवृत्ती मिळणारा तिसरा किंवा नंतरचा भावंड नसावा' },
    ],
    documents: [
      { id: 'aadhaar', nameEn: 'Aadhaar Card', nameHi: 'आधार कार्ड', nameMr: 'आधार कार्ड' },
      { id: 'disability', nameEn: 'Disability Certificate (40%+)', nameHi: 'विकलांगता प्रमाण पत्र (40%+)', nameMr: 'अपंगत्व प्रमाणपत्र (40%+)' },
      { id: 'income', nameEn: 'Income Certificate (< ₹2.5L)', nameHi: 'आय प्रमाण पत्र (₹2.5 लाख से कम)', nameMr: 'उत्पन्न प्रमाणपत्र (< ₹2.5 लाख)' },
      { id: 'marksheet', nameEn: 'Last Qualifying Marksheet', nameHi: 'अंतिम योग्यता अंकपत्र', nameMr: 'शेवटची पात्रता गुणपत्रिका' },
    ],
    steps: [
      { step: 1, textEn: 'Visit scholarships.gov.in and click New Registration', textHi: 'scholarships.gov.in पर जाएं और नया पंजीकरण क्लिक करें', textMr: 'scholarships.gov.in ला भेट द्या आणि नवीन नोंदणी क्लिक करा', timeEn: '5 min', timeHi: '5 मिनट', timeMr: '5 मिनिटे' },
      { step: 2, textEn: 'Complete registration form, get Application ID via SMS', textHi: 'पंजीकरण फॉर्म पूरा करें, SMS से Application ID पाएं', textMr: 'नोंदणी फॉर्म पूर्ण करा, SMS द्वारे Application ID मिळवा', timeEn: '10 min', timeHi: '10 मिनट', timeMr: '10 मिनिटे' },
      { step: 3, textEn: 'Login, fill application form & upload all documents', textHi: 'लॉगिन करें, आवेदन फॉर्म भरें और दस्तावेज़ अपलोड करें', textMr: 'लॉगिन करा, अर्ज फॉर्म भरा आणि सर्व कागदपत्रे अपलोड करा', timeEn: '15 min', timeHi: '15 मिनट', timeMr: '15 मिनिटे' },
      { step: 4, textEn: 'Click Final Submit and track status on portal', textHi: 'Final Submit क्लिक करें और पोर्टल पर स्थिति ट्रैक करें', textMr: 'Final Submit क्लिक करा आणि पोर्टलवर स्थिती ट्रॅक करा', timeEn: '2 min', timeHi: '2 मिनट', timeMr: '2 मिनिटे' },
    ],
    benefitEn: 'Group 1 (Medicine/Engg): ₹1,600 hosteller / ₹750 day scholar/month. Disability allowance ₹2,000–₹4,000/year. Book allowance ₹1,500/year.',
    benefitHi: 'ग्रुप 1 (चिकित्सा/इंजीनियरिंग): ₹1,600 होस्टलर / ₹750 डे स्कॉलर/माह। विकलांगता भत्ता ₹2,000–₹4,000/वर्ष। पुस्तक भत्ता ₹1,500/वर्ष।',
    benefitMr: 'गट 1 (वैद्यकीय/अभियांत्रिकी): ₹1,600 होस्टेलर / ₹750 डे स्कॉलर/महिना. अपंगत्व भत्ता ₹2,000–₹4,000/वर्ष. पुस्तक भत्ता ₹1,500/वर्ष.',
    disbursementEn: 'Scholarship credited via DBT to student bank account through National Scholarship Portal (NSP).',
    disbursementHi: 'राष्ट्रीय छात्रवृत्ति पोर्टल (NSP) के माध्यम से DBT द्वारा छात्र बैंक खाते में।',
    disbursementMr: 'राष्ट्रीय शिष्यवृत्ती पोर्टल (NSP) द्वारे DBT द्वारे विद्यार्थी बँक खात्यात.',
    applyUrl: 'https://scholarships.gov.in',
    casteCategories: ['SC', 'ST', 'OBC'],
  },

  'nos-swd': {
    id: 'nos-swd',
    logo: '✈️',
    titleEn: 'National Overseas Scholarship (Disabilities)',
    titleHi: 'राष्ट्रीय विदेश छात्रवृत्ति (दिव्यांग)',
    titleMr: 'राष्ट्रीय परदेश शिष्यवृत्ती (दिव्यांग)',
    shortTitle: 'NOS-SWD',
    typeEn: 'Central Govt • Overseas Scholarship',
    typeHi: 'केंद्र सरकार • विदेश छात्रवृत्ति',
    typeMr: 'केंद्र सरकार • परदेश शिष्यवृत्ती',
    ministry: 'Ministry of Social Justice — Dept. of Empowerment of Persons with Disabilities',
    tags: ['Central Govt', 'Scholarship'],
    amount: 'Full Foreign Study',
    amountHi: 'विदेश अध्ययन सहायता',
    amountMr: 'परदेश अभ्यास सहाय्य',
    amountLabel: 'Tuition + living allowance + travel for Masters/PhD abroad',
    amountLabelHi: 'विदेश में मास्टर्स/PhD के लिए ट्यूशन + जीवन भत्ता + यात्रा',
    amountLabelMr: 'परदेशात मास्टर्स/PhD साठी ट्यूशन + निर्वाह भत्ता + प्रवास',
    deadline: 'April 30',
    deadlineHi: '30 अप्रैल',
    deadlineMr: '30 एप्रिल',
    processingTime: '90 days',
    processingTimeHi: '90 दिन',
    processingTimeMr: '90 दिवस',
    docsRequired: 6,
    isEligible: true,
    eligibilityCriteria: [
      { met: true, textEn: 'SC student with disability of 40% or above', textHi: 'SC छात्र जिसकी विकलांगता 40% या अधिक हो', textMr: 'SC विद्यार्थी ज्याचे अपंगत्व 40% किंवा त्याहून अधिक' },
      { met: true, textEn: 'Secured admission in a foreign university (Masters/PhD)', textHi: 'विदेशी विश्वविद्यालय में मास्टर्स/PhD में प्रवेश मिला हो', textMr: 'परदेशी विद्यापीठात मास्टर्स/PhD साठी प्रवेश मिळालेला असावा' },
      { met: 'warning', textEn: 'Family income must not exceed ₹6L per annum', textHi: 'पारिवारिक आय ₹6 लाख प्रति वर्ष से अधिक नहीं होनी चाहिए', textMr: 'कौटुंबिक उत्पन्न वार्षिक ₹6 लाखांपेक्षा जास्त नसावे' },
      { met: false, textEn: 'Age below 35 years at time of application', textHi: 'आवेदन के समय आयु 35 वर्ष से कम होनी चाहिए', textMr: 'अर्ज करताना वय 35 वर्षांपेक्षा कमी असावे' },
      { met: true, textEn: 'Not availing any other government scholarship', textHi: 'कोई अन्य सरकारी छात्रवृत्ति नहीं ले रहे', textMr: 'इतर कोणतीही सरकारी शिष्यवृत्ती घेत नसावा' },
    ],
    documents: [
      { id: 'aadhaar', nameEn: 'Aadhaar Card', nameHi: 'आधार कार्ड', nameMr: 'आधार कार्ड' },
      { id: 'caste', nameEn: 'SC Caste Certificate', nameHi: 'SC जाति प्रमाण पत्र', nameMr: 'SC जात प्रमाणपत्र' },
      { id: 'disability', nameEn: 'Disability Certificate (40%+)', nameHi: 'विकलांगता प्रमाण पत्र (40%+)', nameMr: 'अपंगत्व प्रमाणपत्र (40%+)' },
      { id: 'admission', nameEn: 'University Admission Letter', nameHi: 'विश्वविद्यालय प्रवेश पत्र', nameMr: 'विद्यापीठ प्रवेश पत्र' },
      { id: 'income', nameEn: 'Income Certificate', nameHi: 'आय प्रमाण पत्र', nameMr: 'उत्पन्न प्रमाणपत्र' },
      { id: 'passport', nameEn: 'Passport Copy', nameHi: 'पासपोर्ट की प्रति', nameMr: 'पासपोर्ट प्रत' },
    ],
    steps: [
      { step: 1, textEn: 'Apply offline to DEPwD with all required documents', textHi: 'सभी आवश्यक दस्तावेजों के साथ DEPwD को ऑफलाइन आवेदन करें', textMr: 'सर्व आवश्यक कागदपत्रांसह DEPwD ला ऑफलाइन अर्ज करा', timeEn: '30 min', timeHi: '30 मिनट', timeMr: '30 मिनिटे' },
      { step: 2, textEn: 'Documents verified by Zila Sainik Board equivalent office', textHi: 'दस्तावेज जिला कार्यालय द्वारा सत्यापित किए जाएंगे', textMr: 'कागदपत्रे जिल्हा कार्यालयाद्वारे सत्यापित केली जातील', timeEn: '7–15 days', timeHi: '7–15 दिन', timeMr: '7–15 दिवस' },
      { step: 3, textEn: 'Selection committee reviews and shortlists candidates', textHi: 'चयन समिति समीक्षा कर उम्मीदवारों को शॉर्टलिस्ट करेगी', textMr: 'निवड समिती पुनरावलोकन करून उमेदवारांची शॉर्टलिस्ट करेल', timeEn: '30 days', timeHi: '30 दिन', timeMr: '30 दिवस' },
      { step: 4, textEn: 'Award letter issued; scholarship disbursed annually', textHi: 'पुरस्कार पत्र जारी; छात्रवृत्ति वार्षिक रूप से वितरित', textMr: 'पुरस्कार पत्र जारी; शिष्यवृत्ती वार्षिक वितरित', timeEn: 'After selection', timeHi: 'चयन के बाद', timeMr: 'निवडीनंतर' },
    ],
    benefitEn: 'Full tuition fee, living allowance, travel cost, visa fee and medical insurance for studying Masters or PhD abroad at recognized foreign universities.',
    benefitHi: 'विदेश में मान्यता प्राप्त विश्वविद्यालयों में मास्टर्स या PhD के लिए पूर्ण ट्यूशन फीस, जीवन भत्ता, यात्रा लागत, वीजा शुल्क और चिकित्सा बीमा।',
    benefitMr: 'मान्यताप्राप्त परदेशी विद्यापीठांमध्ये मास्टर्स किंवा PhD साठी पूर्ण ट्यूशन फी, निर्वाह भत्ता, प्रवास खर्च, व्हिसा शुल्क आणि वैद्यकीय विमा.',
    disbursementEn: 'Scholarship disbursed annually through DEPwD directly to student bank account for full duration of course.',
    disbursementHi: 'छात्रवृत्ति DEPwD के माध्यम से सीधे छात्र बैंक खाते में पाठ्यक्रम की पूरी अवधि के लिए वार्षिक रूप से वितरित।',
    disbursementMr: 'शिष्यवृत्ती DEPwD द्वारे थेट विद्यार्थी बँक खात्यात अभ्यासक्रमाच्या संपूर्ण कालावधीसाठी वार्षिक वितरित.',
    applyUrl: 'https://disabilityaffairs.gov.in',
    casteCategories: ['SC'],
  },

  'sl': {
    id: 'sl',
    logo: '🛠️',
    titleEn: 'Skill Loan Scheme',
    titleHi: 'कौशल ऋण योजना',
    titleMr: 'कौशल्य कर्ज योजना',
    shortTitle: 'SL',
    typeEn: 'Central Govt • Skill Loan',
    typeHi: 'केंद्र सरकार • कौशल ऋण',
    typeMr: 'केंद्र सरकार • कौशल्य कर्ज',
    ministry: 'Ministry of Skill Development and Entrepreneurship',
    tags: ['Central Govt', 'Loan'],
    amount: 'Up to ₹1.5L',
    amountHi: '₹1.5 लाख तक',
    amountMr: '₹1.5 लाखांपर्यंत',
    amountLabel: 'Loan for skill course fee + living expenses',
    amountLabelHi: 'कौशल पाठ्यक्रम शुल्क + जीवन व्यय के लिए ऋण',
    amountLabelMr: 'कौशल्य अभ्यासक्रम शुल्क + राहणीमान खर्चासाठी कर्ज',
    deadline: 'Ongoing',
    deadlineHi: 'चालू',
    deadlineMr: 'चालू',
    processingTime: '15 days',
    processingTimeHi: '15 दिन',
    processingTimeMr: '15 दिवस',
    docsRequired: 3,
    isEligible: true,
    eligibilityCriteria: [
      { met: true, textEn: 'Admission secured in ITI, Polytechnic or NSQF-aligned course', textHi: 'ITI, पॉलिटेक्निक या NSQF-अनुरूप पाठ्यक्रम में प्रवेश', textMr: 'ITI, पॉलिटेक्निक किंवा NSQF-अनुरूप अभ्यासक्रमात प्रवेश' },
      { met: true, textEn: 'Indian citizen aged 18 years or above', textHi: 'भारतीय नागरिक, आयु 18 वर्ष या उससे अधिक', textMr: 'भारतीय नागरिक, वय 18 वर्षे किंवा त्याहून अधिक' },
      { met: 'warning', textEn: 'Course duration: 30 days to 3 years (NSQF Level 5+)', textHi: 'पाठ्यक्रम अवधि: 30 दिन से 3 वर्ष (NSQF स्तर 5+)', textMr: 'अभ्यासक्रम कालावधी: 30 दिवस ते 3 वर्षे (NSQF स्तर 5+)' },
      { met: true, textEn: 'No collateral required for loans up to ₹1.5L', textHi: '₹1.5 लाख तक के ऋण के लिए कोई संपार्श्विक आवश्यक नहीं', textMr: '₹1.5 लाखांपर्यंतच्या कर्जासाठी कोणतेही तारण आवश्यक नाही' },
    ],
    documents: [
      { id: 'aadhaar', nameEn: 'Aadhaar Card', nameHi: 'आधार कार्ड', nameMr: 'आधार कार्ड' },
      { id: 'admission', nameEn: 'Course Admission Letter', nameHi: 'पाठ्यक्रम प्रवेश पत्र', nameMr: 'अभ्यासक्रम प्रवेश पत्र' },
      { id: 'bank', nameEn: 'Bank Account Details', nameHi: 'बैंक खाता विवरण', nameMr: 'बँक खाते तपशील' },
    ],
    steps: [
      { step: 1, textEn: 'Approach any scheduled commercial or cooperative bank', textHi: 'किसी भी अनुसूचित वाणिज्यिक या सहकारी बैंक से संपर्क करें', textMr: 'कोणत्याही अनुसूचित व्यावसायिक किंवा सहकारी बँकेशी संपर्क साधा', timeEn: '1 day', timeHi: '1 दिन', timeMr: '1 दिवस' },
      { step: 2, textEn: 'Fill skill loan application with course admission proof', textHi: 'पाठ्यक्रम प्रवेश प्रमाण के साथ कौशल ऋण आवेदन भरें', textMr: 'अभ्यासक्रम प्रवेश पुराव्यासह कौशल्य कर्ज अर्ज भरा', timeEn: '10 min', timeHi: '10 मिनट', timeMr: '10 मिनिटे' },
      { step: 3, textEn: 'Bank processes application — no collateral up to ₹1.5L', textHi: 'बैंक आवेदन प्रक्रिया करता है — ₹1.5L तक बिना गिरवी', textMr: 'बँक अर्ज प्रक्रिया करते — ₹1.5L पर्यंत तारण नाही', timeEn: '7 days', timeHi: '7 दिन', timeMr: '7 दिवस' },
      { step: 4, textEn: 'Loan disbursed directly to training institution', textHi: 'ऋण सीधे प्रशिक्षण संस्थान को वितरित', textMr: 'कर्ज थेट प्रशिक्षण संस्थेला वितरित', timeEn: '7 days', timeHi: '7 दिन', timeMr: '7 दिवस' },
    ],
    benefitEn: 'Loan up to ₹1.5L for skill development courses at ITIs, polytechnics and NSQF-aligned institutions. No collateral needed. Repayment starts after course completion.',
    benefitHi: 'ITIs, पॉलिटेक्निक और NSQF-अनुरूप संस्थानों में कौशल विकास पाठ्यक्रम के लिए ₹1.5L तक ऋण। कोई संपार्श्विक नहीं। पाठ्यक्रम पूरा होने के बाद पुनर्भुगतान।',
    benefitMr: 'ITIs, पॉलिटेक्निक आणि NSQF-अनुरूप संस्थांमध्ये कौशल्य विकास अभ्यासक्रमांसाठी ₹1.5L पर्यंत कर्ज. कोणतेही तारण नाही. अभ्यासक्रम पूर्ण झाल्यानंतर परतफेड.',
    disbursementEn: 'Loan disbursed by participating banks directly to training institution. Repayment tenure up to 7 years post-course.',
    disbursementHi: 'भाग लेने वाले बैंकों द्वारा सीधे प्रशिक्षण संस्थान को वितरित। पाठ्यक्रम के बाद 7 वर्ष तक चुकौती अवधि।',
    disbursementMr: 'सहभागी बँकांद्वारे थेट प्रशिक्षण संस्थेला वितरित. अभ्यासक्रमानंतर 7 वर्षांपर्यंत परतफेड कालावधी.',
    applyUrl: 'https://www.skillindia.gov.in',
    casteCategories: ['OBC', 'SC', 'ST'],
  },

  'nps-tsep': {
    id: 'nps-tsep',
    logo: '🏪',
    titleEn: 'National Pension Scheme for Traders',
    titleHi: 'राष्ट्रीय पेंशन योजना (व्यापारी)',
    titleMr: 'राष्ट्रीय पेन्शन योजना (व्यापारी)',
    shortTitle: 'NPS-TSEP',
    typeEn: 'Central Govt • Pension Scheme',
    typeHi: 'केंद्र सरकार • पेंशन योजना',
    typeMr: 'केंद्र सरकार • पेन्शन योजना',
    ministry: 'Ministry of Labour and Employment',
    tags: ['Central Govt', 'Pension'],
    amount: '₹3,000/month',
    amountHi: '₹3,000/माह',
    amountMr: '₹3,000/महिना',
    amountLabel: 'Guaranteed pension after age 60 years',
    amountLabelHi: '60 वर्ष की आयु के बाद गारंटीड पेंशन',
    amountLabelMr: '60 वर्षे वयानंतर हमी पेन्शन',
    deadline: 'Ongoing',
    deadlineHi: 'चालू',
    deadlineMr: 'चालू',
    processingTime: '30 days',
    processingTimeHi: '30 दिन',
    processingTimeMr: '30 दिवस',
    docsRequired: 3,
    isEligible: true,
    eligibilityCriteria: [
      { met: true, textEn: 'Small trader, shopkeeper or self-employed aged 18–40 years', textHi: 'छोटे व्यापारी, दुकानदार या स्व-रोजगार आयु 18–40 वर्ष', textMr: 'लहान व्यापारी, दुकानदार किंवा स्वयंरोजगार वय 18–40 वर्षे' },
      { met: true, textEn: 'Annual turnover below ₹1.5 crore', textHi: 'वार्षिक कारोबार ₹1.5 करोड़ से कम', textMr: 'वार्षिक उलाढाल ₹1.5 कोटींपेक्षा कमी' },
      { met: 'warning', textEn: 'Not covered under NPS, EPFO or ESIC', textHi: 'NPS, EPFO या ESIC में शामिल नहीं होना चाहिए', textMr: 'NPS, EPFO किंवा ESIC मध्ये समाविष्ट नसावे' },
      { met: true, textEn: 'Not an income tax payer', textHi: 'आयकर दाता नहीं होना चाहिए', textMr: 'आयकर भरणारा नसावा' },
    ],
    documents: [
      { id: 'aadhaar', nameEn: 'Aadhaar Card', nameHi: 'आधार कार्ड', nameMr: 'आधार कार्ड' },
      { id: 'bank', nameEn: 'Bank Account / IFSC', nameHi: 'बैंक खाता / IFSC', nameMr: 'बँक खाते / IFSC' },
      { id: 'trade', nameEn: 'Shop/Trade Proof (GST/Trade License)', nameHi: 'दुकान/व्यापार प्रमाण (GST/व्यापार लाइसेंस)', nameMr: 'दुकान/व्यापार पुरावा (GST/व्यापार परवाना)' },
    ],
    steps: [
      { step: 1, textEn: 'Visit the nearest CSC or maandhan.in portal', textHi: 'नजदीकी CSC या maandhan.in पोर्टल पर जाएं', textMr: 'जवळच्या CSC किंवा maandhan.in पोर्टलला भेट द्या', timeEn: '5 min', timeHi: '5 मिनट', timeMr: '5 मिनिटे' },
      { step: 2, textEn: 'Enter Aadhaar, bank details and trade information', textHi: 'आधार, बैंक विवरण और व्यापार जानकारी दर्ज करें', textMr: 'आधार, बँक तपशील आणि व्यापार माहिती भरा', timeEn: '10 min', timeHi: '10 मिनट', timeMr: '10 मिनिटे' },
      { step: 3, textEn: 'Select monthly contribution (₹55–₹200 based on age)', textHi: 'मासिक योगदान चुनें (आयु के अनुसार ₹55–₹200)', textMr: 'मासिक योगदान निवडा (वयानुसार ₹55–₹200)', timeEn: '5 min', timeHi: '5 मिनट', timeMr: '5 मिनिटे' },
      { step: 4, textEn: 'Auto-debit activated — pension payable from age 60', textHi: 'ऑटो-डेबिट सक्रिय — 60 वर्ष से पेंशन देय', textMr: 'ऑटो-डेबिट सक्रिय — 60 वर्षांपासून पेन्शन देय', timeEn: 'Instant', timeHi: 'तुरंत', timeMr: 'त्वरित' },
    ],
    benefitEn: 'Minimum pension of ₹3,000/month after age 60. Equal contribution matched by Central Government. On death: spouse gets ₹1,500/month family pension.',
    benefitHi: '60 वर्ष के बाद न्यूनतम ₹3,000/माह पेंशन। केंद्र सरकार का समान योगदान। मृत्यु पर: जीवनसाथी को ₹1,500/माह पारिवारिक पेंशन।',
    benefitMr: '60 वर्षांनंतर किमान ₹3,000/महिना पेन्शन. केंद्र सरकारचे समान योगदान. मृत्यूवर: जोडीदाराला ₹1,500/महिना कौटुंबिक पेन्शन.',
    disbursementEn: 'Pension credited to bank account on 1st of every month after retirement age. LIC manages the pension fund.',
    disbursementHi: 'सेवानिवृत्ति आयु के बाद हर माह की 1 तारीख को बैंक खाते में पेंशन। LIC पेंशन फंड का प्रबंधन करती है।',
    disbursementMr: 'निवृत्ती वयानंतर दर महिन्याच्या 1 तारखेला बँक खात्यात पेन्शन. LIC पेन्शन फंड व्यवस्थापित करते.',
    applyUrl: 'https://maandhan.in',
    casteCategories: ['OBC', 'General'],
  },

  'wos-c': {
    id: 'wos-c',
    logo: '🔬',
    titleEn: 'Women Scientist Scheme-C',
    titleHi: 'महिला वैज्ञानिक योजना-C',
    titleMr: 'महिला शास्त्रज्ञ योजना-C',
    shortTitle: 'WOS-C',
    typeEn: 'Central Govt • Research Fellowship',
    typeHi: 'केंद्र सरकार • शोध फेलोशिप',
    typeMr: 'केंद्र सरकार • संशोधन फेलोशिप',
    ministry: 'Ministry of Science and Technology — DST',
    tags: ['Central Govt', 'Research'],
    amount: 'Project Funding',
    amountHi: 'परियोजना वित्त पोषण',
    amountMr: 'प्रकल्प निधी',
    amountLabel: '₹25,000–₹55,000/month fellowship + project grant',
    amountLabelHi: '₹25,000–₹55,000/माह फेलोशिप + परियोजना अनुदान',
    amountLabelMr: '₹25,000–₹55,000/महिना फेलोशिप + प्रकल्प अनुदान',
    deadline: 'Rolling',
    deadlineHi: 'रोलिंग',
    deadlineMr: 'रोलिंग',
    processingTime: '60 days',
    processingTimeHi: '60 दिन',
    processingTimeMr: '60 दिवस',
    docsRequired: 5,
    isEligible: true,
    eligibilityCriteria: [
      { met: true, textEn: 'Indian woman scientist with a break in career', textHi: 'करियर में ब्रेक वाली भारतीय महिला वैज्ञानिक', textMr: 'कारकिर्दीत खंड असलेली भारतीय महिला शास्त्रज्ञ' },
      { met: true, textEn: 'MSc or equivalent qualification in science', textHi: 'विज्ञान में MSc या समकक्ष योग्यता', textMr: 'विज्ञानात MSc किंवा समकक्ष पात्रता' },
      { met: 'warning', textEn: 'Age limit: up to 57 years for PhD holders', textHi: 'आयु सीमा: PhD धारकों के लिए 57 वर्ष तक', textMr: 'वय मर्यादा: PhD धारकांसाठी 57 वर्षांपर्यंत' },
      { met: false, textEn: 'Must be working on IPR/patent-related research project', textHi: 'IPR/पेटेंट संबंधित शोध परियोजना पर काम करना होगा', textMr: 'IPR/पेटेंट संबंधित संशोधन प्रकल्पावर काम करणे आवश्यक' },
    ],
    documents: [
      { id: 'aadhaar', nameEn: 'Aadhaar Card', nameHi: 'आधार कार्ड', nameMr: 'आधार कार्ड' },
      { id: 'degree', nameEn: 'Degree Certificates (MSc/PhD)', nameHi: 'डिग्री प्रमाण पत्र (MSc/PhD)', nameMr: 'पदवी प्रमाणपत्रे (MSc/PhD)' },
      { id: 'research', nameEn: 'Research Proposal', nameHi: 'शोध प्रस्ताव', nameMr: 'संशोधन प्रस्ताव' },
      { id: 'cv', nameEn: 'Updated CV with publications', nameHi: 'प्रकाशनों सहित अद्यतन CV', nameMr: 'प्रकाशनांसह अद्ययावत CV' },
      { id: 'bank', nameEn: 'Bank Account Details', nameHi: 'बैंक खाता विवरण', nameMr: 'बँक खाते तपशील' },
    ],
    steps: [
      { step: 1, textEn: 'Visit onlinedst.gov.in and register as applicant', textHi: 'onlinedst.gov.in पर जाएं और आवेदक के रूप में पंजीकरण करें', textMr: 'onlinedst.gov.in ला भेट द्या आणि अर्जदार म्हणून नोंदणी करा', timeEn: '10 min', timeHi: '10 मिनट', timeMr: '10 मिनिटे' },
      { step: 2, textEn: 'Submit research proposal with project details online', textHi: 'परियोजना विवरण के साथ शोध प्रस्ताव ऑनलाइन जमा करें', textMr: 'प्रकल्प तपशीलांसह संशोधन प्रस्ताव ऑनलाइन सबमिट करा', timeEn: '2 hrs', timeHi: '2 घंटे', timeMr: '2 तास' },
      { step: 3, textEn: 'Expert committee reviews proposal (2–3 months)', textHi: 'विशेषज्ञ समिति प्रस्ताव की समीक्षा करती है (2–3 माह)', textMr: 'तज्ञ समिती प्रस्तावाचे पुनरावलोकन करते (2–3 महिने)', timeEn: '60–90 days', timeHi: '60–90 दिन', timeMr: '60–90 दिवस' },
      { step: 4, textEn: 'Selected candidates receive fellowship & project grant', textHi: 'चयनित उम्मीदवारों को फेलोशिप और परियोजना अनुदान', textMr: 'निवडलेल्या उमेदवारांना फेलोशिप आणि प्रकल्प अनुदान', timeEn: 'After selection', timeHi: 'चयन के बाद', timeMr: 'निवडीनंतर' },
    ],
    benefitEn: 'Monthly fellowship ₹25,000–₹55,000 based on qualification. Project contingency grant. Opportunity to work as IP professional and file patents. Duration: 3 years.',
    benefitHi: 'योग्यता के अनुसार मासिक फेलोशिप ₹25,000–₹55,000। परियोजना आकस्मिकता अनुदान। IP पेशेवर के रूप में काम करने और पेटेंट दाखिल करने का अवसर। अवधि: 3 वर्ष।',
    benefitMr: 'पात्रतेनुसार मासिक फेलोशिप ₹25,000–₹55,000. प्रकल्प आकस्मिक अनुदान. IP व्यावसायिक म्हणून काम करण्याची आणि पेटेंट दाखल करण्याची संधी. कालावधी: 3 वर्षे.',
    disbursementEn: 'Fellowship disbursed monthly through host institution. DST directly manages grants and reviews annually.',
    disbursementHi: 'होस्ट संस्थान के माध्यम से मासिक फेलोशिप। DST अनुदान का सीधा प्रबंधन और वार्षिक समीक्षा।',
    disbursementMr: 'होस्ट संस्थेद्वारे मासिक फेलोशिप. DST थेट अनुदान व्यवस्थापित करते आणि वार्षिक पुनरावलोकन करते.',
    applyUrl: 'https://onlinedst.gov.in',
    casteCategories: ['OBC', 'General'],
  },

  'rmewf': {
    id: 'rmewf',
    logo: '🏥',
    titleEn: 'RMEWF — Medical Treatment for Ex-Servicemen',
    titleHi: 'RMEWF — भूतपूर्व सैनिकों को चिकित्सा सहायता',
    titleMr: 'RMEWF — माजी सैनिकांसाठी वैद्यकीय सहाय्य',
    shortTitle: 'RMEWF',
    typeEn: 'Central Govt • Medical Assistance',
    typeHi: 'केंद्र सरकार • चिकित्सा सहायता',
    typeMr: 'केंद्र सरकार • वैद्यकीय सहाय्य',
    ministry: 'Ministry of Defence — Kendriya Sainik Board',
    tags: ['Central Govt', 'Health'],
    amount: 'Up to ₹30,000',
    amountHi: '₹30,000 तक',
    amountMr: '₹30,000 पर्यंत',
    amountLabel: 'Per year for medical expenses',
    amountLabelHi: 'प्रति वर्ष चिकित्सा व्यय के लिए',
    amountLabelMr: 'प्रति वर्ष वैद्यकीय खर्चासाठी',
    deadline: 'Ongoing',
    deadlineHi: 'चालू',
    deadlineMr: 'चालू',
    processingTime: '30 days',
    processingTimeHi: '30 दिन',
    processingTimeMr: '30 दिवस',
    docsRequired: 3,
    isEligible: true,
    eligibilityCriteria: [
      { met: true, textEn: 'Non-pensioner Ex-Serviceman or widow of ESM', textHi: 'गैर-पेंशनर भूतपूर्व सैनिक या ESM की विधवा', textMr: 'बिगर-पेन्शनर माजी सैनिक किंवा ESM ची विधवा' },
      { met: true, textEn: 'Rank of Havildar/equivalent or below (Navy/Air Force)', textHi: 'हवलदार/समकक्ष या उससे नीचे का रैंक', textMr: 'हवालदार/समकक्ष किंवा त्यापेक्षा कमी दर्जा' },
      { met: true, textEn: 'Recommended by respective Zila Sainik Board (ZSB)', textHi: 'संबंधित जिला सैनिक बोर्ड (ZSB) द्वारा अनुशंसित', textMr: 'संबंधित जिल्हा सैनिक मंडळ (ZSB) द्वारे शिफारस' },
      { met: 'warning', textEn: 'Treatment at CGHS/ECHS approved government hospitals', textHi: 'CGHS/ECHS अनुमोदित सरकारी अस्पतालों में उपचार', textMr: 'CGHS/ECHS मान्य सरकारी रुग्णालयांमध्ये उपचार' },
    ],
    documents: [
      { id: 'discharge', nameEn: 'Discharge Book / Service Record', nameHi: 'डिस्चार्ज बुक / सेवा रिकॉर्ड', nameMr: 'डिस्चार्ज बुक / सेवा रेकॉर्ड' },
      { id: 'medical', nameEn: 'Medical Bills / Receipts', nameHi: 'चिकित्सा बिल / रसीदें', nameMr: 'वैद्यकीय बिले / पावत्या' },
      { id: 'zsb', nameEn: 'ZSB Recommendation Letter', nameHi: 'ZSB सिफारिश पत्र', nameMr: 'ZSB शिफारस पत्र' },
    ],
    steps: [
      { step: 1, textEn: 'Register on ksb.gov.in with service details', textHi: 'ksb.gov.in पर सेवा विवरण के साथ पंजीकरण करें', textMr: 'ksb.gov.in वर सेवा तपशीलांसह नोंदणी करा', timeEn: '15 min', timeHi: '15 मिनट', timeMr: '15 मिनिटे' },
      { step: 2, textEn: 'Select RMEWF Medical scheme and fill application form', textHi: 'RMEWF मेडिकल योजना चुनें और आवेदन फॉर्म भरें', textMr: 'RMEWF वैद्यकीय योजना निवडा आणि अर्ज फॉर्म भरा', timeEn: '10 min', timeHi: '10 मिनट', timeMr: '10 मिनिटे' },
      { step: 3, textEn: 'Upload documents attested by ZSWO and submit', textHi: 'ZSWO द्वारा सत्यापित दस्तावेज़ अपलोड करें और जमा करें', textMr: 'ZSWO द्वारे साक्षांकित कागदपत्रे अपलोड करा आणि सबमिट करा', timeEn: '10 min', timeHi: '10 मिनट', timeMr: '10 मिनिटे' },
      { step: 4, textEn: 'KSB processes payment via ECS to your bank account', textHi: 'KSB ECS के माध्यम से आपके बैंक खाते में भुगतान करता है', textMr: 'KSB ECS द्वारे तुमच्या बँक खात्यात पेमेंट करते', timeEn: '30 days', timeHi: '30 दिन', timeMr: '30 दिवस' },
    ],
    benefitEn: 'Financial assistance up to ₹30,000 per year per eligible ESM/widow for routine medical expenses at government hospitals. Paid via ECS/cheque.',
    benefitHi: 'सरकारी अस्पतालों में नियमित चिकित्सा व्यय के लिए पात्र ESM/विधवा को ₹30,000 प्रति वर्ष तक वित्तीय सहायता। ECS/चेक द्वारा भुगतान।',
    benefitMr: 'सरकारी रुग्णालयांमध्ये नियमित वैद्यकीय खर्चासाठी पात्र ESM/विधवांना प्रति वर्ष ₹30,000 पर्यंत आर्थिक सहाय्य. ECS/चेकद्वारे देय.',
    disbursementEn: 'Payment processed quarterly by KSB Welfare Department. Credited via ECS directly to beneficiary bank account.',
    disbursementHi: 'KSB कल्याण विभाग द्वारा त्रैमासिक रूप से भुगतान। ECS के माध्यम से सीधे लाभार्थी बैंक खाते में।',
    disbursementMr: 'KSB कल्याण विभागाद्वारे तिमाही पेमेंट. ECS द्वारे थेट लाभार्थी बँक खात्यात.',
    applyUrl: 'https://ksb.gov.in',
    casteCategories: ['General'],
  },

  'rmewf-voc': {
    id: 'rmewf-voc',
    logo: '👩‍💼',
    titleEn: 'RMEWF — Vocational Training for Widows',
    titleHi: 'RMEWF — विधवाओं के लिए व्यावसायिक प्रशिक्षण',
    titleMr: 'RMEWF — विधवांसाठी व्यावसायिक प्रशिक्षण',
    shortTitle: 'RMEWF-VOC',
    typeEn: 'Central Govt • Vocational Grant',
    typeHi: 'केंद्र सरकार • व्यावसायिक अनुदान',
    typeMr: 'केंद्र सरकार • व्यावसायिक अनुदान',
    ministry: 'Ministry of Defence — Kendriya Sainik Board',
    tags: ['Central Govt', 'Training'],
    amount: 'Training Grant',
    amountHi: 'प्रशिक्षण अनुदान',
    amountMr: 'प्रशिक्षण अनुदान',
    amountLabel: 'Up to ₹20,000 for vocational training course',
    amountLabelHi: 'व्यावसायिक प्रशिक्षण पाठ्यक्रम के लिए ₹20,000 तक',
    amountLabelMr: 'व्यावसायिक प्रशिक्षण अभ्यासक्रमासाठी ₹20,000 पर्यंत',
    deadline: 'Ongoing',
    deadlineHi: 'चालू',
    deadlineMr: 'चालू',
    processingTime: '45 days',
    processingTimeHi: '45 दिन',
    processingTimeMr: '45 दिवस',
    docsRequired: 3,
    isEligible: true,
    eligibilityCriteria: [
      { met: true, textEn: 'Widow of an Ex-Serviceman of any rank', textHi: 'किसी भी रैंक के भूतपूर्व सैनिक की विधवा', textMr: 'कोणत्याही दर्जाच्या माजी सैनिकाची विधवा' },
      { met: true, textEn: 'Widow must be seeking vocational training for self-reliance', textHi: 'विधवा स्वावलंबन के लिए व्यावसायिक प्रशिक्षण लेना चाहती हो', textMr: 'स्वावलंबनासाठी व्यावसायिक प्रशिक्षण घेऊ इच्छिणारी विधवा' },
      { met: 'warning', textEn: 'Recommended by respective Zila Sainik Board', textHi: 'संबंधित जिला सैनिक बोर्ड द्वारा अनुशंसित', textMr: 'संबंधित जिल्हा सैनिक मंडळाद्वारे शिफारस' },
      { met: true, textEn: 'Not receiving similar benefit from any other source', textHi: 'किसी अन्य स्रोत से समान लाभ नहीं ले रही हों', textMr: 'इतर कोणत्याही स्रोतातून समान लाभ घेत नसावी' },
    ],
    documents: [
      { id: 'death', nameEn: 'ESM Death Certificate', nameHi: 'ESM मृत्यु प्रमाण पत्र', nameMr: 'ESM मृत्यू प्रमाणपत्र' },
      { id: 'discharge', nameEn: 'ESM Discharge Book', nameHi: 'ESM डिस्चार्ज बुक', nameMr: 'ESM डिस्चार्ज बुक' },
      { id: 'training', nameEn: 'Vocational Training Enrolment Proof', nameHi: 'व्यावसायिक प्रशिक्षण नामांकन प्रमाण', nameMr: 'व्यावसायिक प्रशिक्षण नोंदणी पुरावा' },
    ],
    steps: [
      { step: 1, textEn: 'Register on ksb.gov.in portal', textHi: 'ksb.gov.in पोर्टल पर पंजीकरण करें', textMr: 'ksb.gov.in पोर्टलवर नोंदणी करा', timeEn: '10 min', timeHi: '10 मिनट', timeMr: '10 मिनिटे' },
      { step: 2, textEn: 'Select RMEWF Vocational scheme and fill details', textHi: 'RMEWF व्यावसायिक योजना चुनें और विवरण भरें', textMr: 'RMEWF व्यावसायिक योजना निवडा आणि तपशील भरा', timeEn: '10 min', timeHi: '10 मिनट', timeMr: '10 मिनिटे' },
      { step: 3, textEn: 'Upload documents attested by ZSWO', textHi: 'ZSWO द्वारा सत्यापित दस्तावेज़ अपलोड करें', textMr: 'ZSWO द्वारे साक्षांकित कागदपत्रे अपलोड करा', timeEn: '5 min', timeHi: '5 मिनट', timeMr: '5 मिनिटे' },
      { step: 4, textEn: 'Grant credited after KSB approval', textHi: 'KSB अनुमोदन के बाद अनुदान जमा', textMr: 'KSB मान्यतेनंतर अनुदान जमा', timeEn: '45 days', timeHi: '45 दिन', timeMr: '45 दिवस' },
    ],
    benefitEn: 'Financial grant up to ₹20,000 to cover vocational training fees (tailoring, computer, beauty, etc.) enabling widows of ESM to become self-reliant.',
    benefitHi: 'सिलाई, कंप्यूटर, ब्यूटी आदि व्यावसायिक प्रशिक्षण शुल्क के लिए ₹20,000 तक का अनुदान, जिससे ESM की विधवाएं स्वावलंबी बन सकें।',
    benefitMr: 'शिवणकाम, संगणक, सौंदर्य इत्यादी व्यावसायिक प्रशिक्षण शुल्कासाठी ₹20,000 पर्यंत अनुदान, ज्यामुळे ESM च्या विधवा स्वावलंबी होऊ शकतात.',
    disbursementEn: 'Grant disbursed by KSB through bank transfer after training enrollment is verified.',
    disbursementHi: 'प्रशिक्षण नामांकन सत्यापित होने के बाद KSB द्वारा बैंक हस्तांतरण के माध्यम से अनुदान वितरित।',
    disbursementMr: 'प्रशिक्षण नोंदणी सत्यापित झाल्यानंतर KSB द्वारे बँक हस्तांतरणाद्वारे अनुदान वितरित.',
    applyUrl: 'https://ksb.gov.in',
    casteCategories: ['General', 'OBC'],
  },

  'rmewf-disabled': {
    id: 'rmewf-disabled',
    logo: '👶',
    titleEn: 'RMEWF — 100% Disabled Child of Ex-Servicemen',
    titleHi: 'RMEWF — भूतपूर्व सैनिकों के 100% दिव्यांग बच्चे',
    titleMr: 'RMEWF — माजी सैनिकांच्या 100% दिव्यांग मुलांसाठी',
    shortTitle: 'RMEWF-DC',
    typeEn: 'Central Govt • Financial Assistance',
    typeHi: 'केंद्र सरकार • वित्तीय सहायता',
    typeMr: 'केंद्र सरकार • आर्थिक सहाय्य',
    ministry: 'Ministry of Defence — Kendriya Sainik Board',
    tags: ['Central Govt', 'Disability'],
    amount: '₹3,000/month',
    amountHi: '₹3,000/माह',
    amountMr: '₹3,000/महिना',
    amountLabel: 'Paid annually per 100% disabled child',
    amountLabelHi: '100% दिव्यांग प्रति बच्चे पर वार्षिक भुगतान',
    amountLabelMr: '100% दिव्यांग प्रति मुलाला वार्षिक देय',
    deadline: 'Ongoing',
    deadlineHi: 'चालू',
    deadlineMr: 'चालू',
    processingTime: '45 days',
    processingTimeHi: '45 दिन',
    processingTimeMr: '45 दिवस',
    docsRequired: 4,
    isEligible: true,
    eligibilityCriteria: [
      { met: true, textEn: 'Child must be a legitimate offspring of ESM/Widow', textHi: 'बच्चा ESM/विधवा का कानूनी संतान होना चाहिए', textMr: 'मूल ESM/विधवाचे कायदेशीर अपत्य असणे आवश्यक' },
      { met: true, textEn: 'ESM must be of rank JCO/equivalent and below', textHi: 'ESM का रैंक JCO/समकक्ष और उससे नीचे होना चाहिए', textMr: 'ESM चा दर्जा JCO/समकक्ष किंवा त्यापेक्षा कमी असावा' },
      { met: true, textEn: 'Child must be 100% disabled', textHi: 'बच्चा 100% दिव्यांग होना चाहिए', textMr: 'मूल 100% दिव्यांग असणे आवश्यक' },
      { met: 'warning', textEn: 'Not receiving disability benefit from any other official agency', textHi: 'किसी अन्य आधिकारिक एजेंसी से विकलांगता लाभ नहीं', textMr: 'इतर कोणत्याही अधिकृत संस्थेकडून अपंगत्व लाभ नसावा' },
      { met: true, textEn: 'Recommended by respective Zila Sainik Board (ZSB)', textHi: 'संबंधित जिला सैनिक बोर्ड (ZSB) द्वारा अनुशंसित', textMr: 'संबंधित जिल्हा सैनिक मंडळ (ZSB) द्वारे शिफारस' },
    ],
    documents: [
      { id: 'discharge', nameEn: 'ESM Discharge Book', nameHi: 'ESM डिस्चार्ज बुक', nameMr: 'ESM डिस्चार्ज बुक' },
      { id: 'disability', nameEn: '100% Disability Certificate', nameHi: '100% विकलांगता प्रमाण पत्र', nameMr: '100% अपंगत्व प्रमाणपत्र' },
      { id: 'birth', nameEn: "Child's Birth Certificate", nameHi: 'बच्चे का जन्म प्रमाण पत्र', nameMr: 'मुलाचे जन्म प्रमाणपत्र' },
      { id: 'zsb', nameEn: 'ZSB Recommendation Letter', nameHi: 'ZSB सिफारिश पत्र', nameMr: 'ZSB शिफारस पत्र' },
    ],
    steps: [
      { step: 1, textEn: 'Register on ksb.gov.in and select RMEWF Disabled Child scheme', textHi: 'ksb.gov.in पर पंजीकरण करें और RMEWF दिव्यांग बच्चा योजना चुनें', textMr: 'ksb.gov.in वर नोंदणी करा आणि RMEWF दिव्यांग मूल योजना निवडा', timeEn: '15 min', timeHi: '15 मिनट', timeMr: '15 मिनिटे' },
      { step: 2, textEn: 'Fill application and upload ZSWO-attested documents', textHi: 'आवेदन भरें और ZSWO-सत्यापित दस्तावेज़ अपलोड करें', textMr: 'अर्ज भरा आणि ZSWO-साक्षांकित कागदपत्रे अपलोड करा', timeEn: '15 min', timeHi: '15 मिनट', timeMr: '15 मिनिटे' },
      { step: 3, textEn: 'ZSWO verifies and forwards to KSB via RSB', textHi: 'ZSWO सत्यापन कर RSB के माध्यम से KSB को अग्रेषित करता है', textMr: 'ZSWO सत्यापन करून RSB द्वारे KSB ला पाठवते', timeEn: '30 days', timeHi: '30 दिन', timeMr: '30 दिवस' },
      { step: 4, textEn: 'Renew annually by submitting Life & Disability Certificate by Jan 15', textHi: 'जनवरी 15 तक जीवन और विकलांगता प्रमाण पत्र जमा कर वार्षिक नवीनीकरण करें', textMr: 'जानेवारी 15 पर्यंत जीवन आणि अपंगत्व प्रमाणपत्र सबमिट करून वार्षिक नूतनीकरण करा', timeEn: 'Annual', timeHi: 'वार्षिक', timeMr: 'वार्षिक' },
    ],
    benefitEn: '₹3,000/month (paid annually as ₹36,000) per 100% disabled child of ESM/widow. Non-transferable; ceases automatically on death of child.',
    benefitHi: 'ESM/विधवा के 100% दिव्यांग बच्चे को ₹3,000/माह (वार्षिक ₹36,000)। हस्तांतरणीय नहीं; बच्चे की मृत्यु पर स्वतः समाप्त।',
    benefitMr: 'ESM/विधवाच्या 100% दिव्यांग मुलाला ₹3,000/महिना (वार्षिक ₹36,000). हस्तांतरणीय नाही; मुलाच्या मृत्यूवर आपोआप समाप्त.',
    disbursementEn: 'Payment made via ECS or account payee cheque by Accounts Section of KSB. Annual renewal required.',
    disbursementHi: 'KSB के लेखा अनुभाग द्वारा ECS या खाता आदाता चेक के माध्यम से भुगतान। वार्षिक नवीनीकरण आवश्यक।',
    disbursementMr: 'KSB च्या लेखा विभागाद्वारे ECS किंवा खाते प्राप्तकर्ता चेकद्वारे पेमेंट. वार्षिक नूतनीकरण आवश्यक.',
    applyUrl: 'https://ksb.gov.in',
    casteCategories: ['General'],
  },

  'rgsaip': {
    id: 'rgsaip',
    logo: '🏘️',
    titleEn: 'Rashtriya Gram Swaraj Abhiyan — Internship',
    titleHi: 'राष्ट्रीय ग्राम स्वराज अभियान — इंटर्नशिप',
    titleMr: 'राष्ट्रीय ग्राम स्वराज अभियान — इंटर्नशिप',
    shortTitle: 'RGSAIP',
    typeEn: 'Central Govt • Internship Program',
    typeHi: 'केंद्र सरकार • इंटर्नशिप कार्यक्रम',
    typeMr: 'केंद्र सरकार • इंटर्नशिप कार्यक्रम',
    ministry: 'Ministry of Panchayati Raj',
    tags: ['Central Govt', 'Internship'],
    amount: '₹15,000 stipend',
    amountHi: '₹15,000 वजीफ़ा',
    amountMr: '₹15,000 विद्यावेतन',
    amountLabel: 'Monthly stipend for duration of internship',
    amountLabelHi: 'इंटर्नशिप की अवधि के लिए मासिक वजीफा',
    amountLabelMr: 'इंटर्नशिपच्या कालावधीसाठी मासिक विद्यावेतन',
    deadline: 'March 31',
    deadlineHi: '31 मार्च',
    deadlineMr: '31 मार्च',
    processingTime: '21 days',
    processingTimeHi: '21 दिन',
    processingTimeMr: '21 दिवस',
    docsRequired: 3,
    isEligible: true,
    eligibilityCriteria: [
      { met: true, textEn: 'Student enrolled in postgraduate/doctoral programme', textHi: 'स्नातकोत्तर/डॉक्टरल कार्यक्रम में नामांकित छात्र', textMr: 'पदव्युत्तर/डॉक्टरल कार्यक्रमात नोंदणीकृत विद्यार्थी' },
      { met: true, textEn: 'Research focus on Panchayati Raj or rural governance', textHi: 'पंचायती राज या ग्रामीण शासन पर अनुसंधान केंद्रित', textMr: 'पंचायती राज किंवा ग्रामीण प्रशासनावर संशोधन केंद्रित' },
      { met: 'warning', textEn: 'NOC required from your institution/university', textHi: 'आपके संस्थान/विश्वविद्यालय से अनापत्ति प्रमाण पत्र आवश्यक', textMr: 'तुमच्या संस्था/विद्यापीठाकडून ना हरकत प्रमाणपत्र आवश्यक' },
    ],
    documents: [
      { id: 'aadhaar', nameEn: 'Aadhaar Card', nameHi: 'आधार कार्ड', nameMr: 'आधार कार्ड' },
      { id: 'enrolment', nameEn: 'University Enrolment Certificate', nameHi: 'विश्वविद्यालय नामांकन प्रमाण पत्र', nameMr: 'विद्यापीठ नोंदणी प्रमाणपत्र' },
      { id: 'noc', nameEn: 'NOC from University/Institution', nameHi: 'विश्वविद्यालय/संस्थान से NOC', nameMr: 'विद्यापीठ/संस्थेकडून NOC' },
    ],
    steps: [
      { step: 1, textEn: 'Apply online through RGSA official portal', textHi: 'RGSA आधिकारिक पोर्टल के माध्यम से ऑनलाइन आवेदन करें', textMr: 'RGSA अधिकृत पोर्टलद्वारे ऑनलाइन अर्ज करा', timeEn: '20 min', timeHi: '20 मिनट', timeMr: '20 मिनिटे' },
      { step: 2, textEn: 'Submit research proposal and university NOC', textHi: 'शोध प्रस्ताव और विश्वविद्यालय NOC जमा करें', textMr: 'संशोधन प्रस्ताव आणि विद्यापीठ NOC सबमिट करा', timeEn: '1 day', timeHi: '1 दिन', timeMr: '1 दिवस' },
      { step: 3, textEn: 'Shortlisting and interview by Ministry officials', textHi: 'मंत्रालय अधिकारियों द्वारा शॉर्टलिस्टिंग और साक्षात्कार', textMr: 'मंत्रालय अधिकाऱ्यांद्वारे शॉर्टलिस्टिंग आणि मुलाखत', timeEn: '14 days', timeHi: '14 दिन', timeMr: '14 दिवस' },
      { step: 4, textEn: 'Selected interns receive appointment letter and stipend', textHi: 'चयनित इंटर्न को नियुक्ति पत्र और वजीफा मिलता है', textMr: 'निवडलेल्या इंटर्नना नियुक्ती पत्र आणि विद्यावेतन मिळते', timeEn: '7 days', timeHi: '7 दिन', timeMr: '7 दिवस' },
    ],
    benefitEn: '₹15,000/month stipend. Opportunity to work with Gram Panchayats, study rural governance models, access ministry data for research. Certificate of completion.',
    benefitHi: '₹15,000/माह वजीफा। ग्राम पंचायतों के साथ काम करने, ग्रामीण शासन मॉडल का अध्ययन, शोध के लिए मंत्रालय डेटा का उपयोग। समापन प्रमाण पत्र।',
    benefitMr: '₹15,000/महिना विद्यावेतन. ग्रामपंचायतींसोबत काम करण्याची, ग्रामीण प्रशासन मॉडेलचा अभ्यास करण्याची, संशोधनासाठी मंत्रालय डेटा वापरण्याची संधी. पूर्णता प्रमाणपत्र.',
    disbursementEn: 'Stipend credited to intern bank account on monthly basis during internship tenure (typically 6 months).',
    disbursementHi: 'इंटर्नशिप अवधि (आमतौर पर 6 माह) के दौरान मासिक आधार पर इंटर्न के बैंक खाते में वजीफा जमा।',
    disbursementMr: 'इंटर्नशिप कालावधीत (साधारणतः 6 महिने) मासिक आधारावर इंटर्नच्या बँक खात्यात विद्यावेतन जमा.',
    applyUrl: 'https://rgsa.nic.in',
    casteCategories: ['ST', 'OBC', 'General'],
  },

  'eps': {
    id: 'eps',
    logo: '💰',
    titleEn: "Employees' Pension Scheme",
    titleHi: 'कर्मचारी पेंशन योजना',
    titleMr: 'कर्मचारी पेन्शन योजना',
    shortTitle: 'EPS',
    typeEn: 'Central Govt • Retirement Pension',
    typeHi: 'केंद्र सरकार • सेवानिवृत्ति पेंशन',
    typeMr: 'केंद्र सरकार • निवृत्ती पेन्शन',
    ministry: 'Ministry of Labour and Employment — EPFO',
    tags: ['Central Govt', 'Pension'],
    amount: '₹1,000–₹7,500/month',
    amountHi: '₹1,000–₹7,500/माह',
    amountMr: '₹1,000–₹7,500/महिना',
    amountLabel: 'Monthly pension after superannuation at 58 years',
    amountLabelHi: '58 वर्ष की आयु में सेवानिवृत्ति के बाद मासिक पेंशन',
    amountLabelMr: '58 वर्षे वयात निवृत्तीनंतर मासिक पेन्शन',
    deadline: 'Ongoing',
    deadlineHi: 'चालू',
    deadlineMr: 'चालू',
    processingTime: '30 days',
    processingTimeHi: '30 दिन',
    processingTimeMr: '30 दिवस',
    docsRequired: 3,
    isEligible: true,
    eligibilityCriteria: [
      { met: true, textEn: 'Employee working in EPFO-registered establishment', textHi: 'EPFO-पंजीकृत प्रतिष्ठान में काम करने वाला कर्मचारी', textMr: 'EPFO-नोंदणीकृत आस्थापनात काम करणारा कर्मचारी' },
      { met: true, textEn: 'Minimum 10 years of pensionable service', textHi: 'न्यूनतम 10 वर्ष की पेंशन योग्य सेवा', textMr: 'किमान 10 वर्षांची पेन्शनपात्र सेवा' },
      { met: 'warning', textEn: 'Monthly salary up to ₹15,000 to join (higher salary optional)', textHi: 'शामिल होने के लिए मासिक वेतन ₹15,000 तक (अधिक वेतन वैकल्पिक)', textMr: 'सामील होण्यासाठी मासिक पगार ₹15,000 पर्यंत (अधिक पगार ऐच्छिक)' },
      { met: true, textEn: 'UAN (Universal Account Number) must be active', textHi: 'UAN (यूनिवर्सल अकाउंट नंबर) सक्रिय होना चाहिए', textMr: 'UAN (युनिव्हर्सल अकाउंट नंबर) सक्रिय असणे आवश्यक' },
    ],
    documents: [
      { id: 'aadhaar', nameEn: 'Aadhaar Card linked to UAN', nameHi: 'UAN से लिंक आधार कार्ड', nameMr: 'UAN शी जोडलेले आधार कार्ड' },
      { id: 'bank', nameEn: 'Bank Account Details (IFSC)', nameHi: 'बैंक खाता विवरण (IFSC)', nameMr: 'बँक खाते तपशील (IFSC)' },
      { id: 'service', nameEn: 'Service / Employment Certificate', nameHi: 'सेवा / रोजगार प्रमाण पत्र', nameMr: 'सेवा / रोजगार प्रमाणपत्र' },
    ],
    steps: [
      { step: 1, textEn: 'Employer registers employee on EPFO portal at joining', textHi: 'नियोक्ता शामिल होने पर EPFO पोर्टल पर कर्मचारी को पंजीकृत करता है', textMr: 'नियोक्ता सामील होताना EPFO पोर्टलवर कर्मचाऱ्याची नोंदणी करतो', timeEn: 'At joining', timeHi: 'शामिल होने पर', timeMr: 'सामील होताना' },
      { step: 2, textEn: 'Contribute 8.33% of salary to EPS monthly (via employer)', textHi: '8.33% वेतन EPS में मासिक योगदान (नियोक्ता के माध्यम से)', textMr: '8.33% पगार EPS मध्ये मासिक योगदान (नियोक्त्याद्वारे)', timeEn: 'Monthly', timeHi: 'मासिक', timeMr: 'मासिक' },
      { step: 3, textEn: 'At retirement (58 yrs), apply for pension on epfindia.gov.in', textHi: 'सेवानिवृत्ति (58 वर्ष) पर epfindia.gov.in पर पेंशन आवेदन करें', textMr: 'निवृत्तीवर (58 वर्षे) epfindia.gov.in वर पेन्शन अर्ज करा', timeEn: '30 min', timeHi: '30 मिनट', timeMr: '30 मिनिटे' },
      { step: 4, textEn: 'Submit Form 10D; pension credited monthly from next month', textHi: 'फॉर्म 10D जमा करें; अगले माह से मासिक पेंशन जमा', textMr: 'फॉर्म 10D सबमिट करा; पुढच्या महिन्यापासून मासिक पेन्शन जमा', timeEn: '30 days', timeHi: '30 दिन', timeMr: '30 दिवस' },
    ],
    benefitEn: 'Monthly pension of ₹1,000–₹7,500 based on salary and service period. On death: spouse & children receive pension. Early withdrawal option after 10 years.',
    benefitHi: 'वेतन और सेवा अवधि के अनुसार ₹1,000–₹7,500/माह पेंशन। मृत्यु पर: पत्नी और बच्चों को पेंशन। 10 वर्ष के बाद जल्दी निकासी का विकल्प।',
    benefitMr: 'पगार आणि सेवा कालावधीनुसार ₹1,000–₹7,500/महिना पेन्शन. मृत्यूवर: पत्नी आणि मुलांना पेन्शन. 10 वर्षांनंतर लवकर काढणी पर्याय.',
    disbursementEn: 'Pension credited to bank account on 1st of every month by EPFO via NEFT/ECS.',
    disbursementHi: 'EPFO द्वारा NEFT/ECS के माध्यम से हर माह की 1 तारीख को बैंक खाते में पेंशन जमा।',
    disbursementMr: 'EPFO द्वारे NEFT/ECS द्वारे दर महिन्याच्या 1 तारखेला बँक खात्यात पेन्शन जमा.',
    applyUrl: 'https://epfindia.gov.in',
    casteCategories: ['SC', 'ST', 'OBC', 'General'],
  },

  'pmkvy-stt': {
    id: 'pmkvy-stt',
    logo: '🎯',
    titleEn: 'PMKVY — Short Term Training',
    titleHi: 'PMKVY — अल्पकालिक प्रशिक्षण',
    titleMr: 'PMKVY — अल्पकालीन प्रशिक्षण',
    shortTitle: 'PMKVY-STT',
    typeEn: 'Central Govt • Skill Training',
    typeHi: 'केंद्र सरकार • कौशल प्रशिक्षण',
    typeMr: 'केंद्र सरकार • कौशल्य प्रशिक्षण',
    ministry: 'Ministry of Skill Development and Entrepreneurship',
    tags: ['Central Govt', 'Training'],
    amount: 'Free + ₹8,000',
    amountHi: 'मुफ़्त + ₹8,000',
    amountMr: 'मोफत + ₹8,000',
    amountLabel: 'Free training + ₹8,000 reward on assessment pass',
    amountLabelHi: 'मुफ़्त प्रशिक्षण + मूल्यांकन पास पर ₹8,000 पुरस्कार',
    amountLabelMr: 'मोफत प्रशिक्षण + मूल्यांकन उत्तीर्णावर ₹8,000 पुरस्कार',
    deadline: 'Ongoing',
    deadlineHi: 'चालू',
    deadlineMr: 'चालू',
    processingTime: 'Immediate',
    processingTimeHi: 'तुरंत',
    processingTimeMr: 'त्वरित',
    docsRequired: 2,
    isEligible: true,
    eligibilityCriteria: [
      { met: true, textEn: 'Indian national aged 15 years and above', textHi: 'भारतीय नागरिक आयु 15 वर्ष और उससे अधिक', textMr: 'भारतीय नागरिक वय 15 वर्षे आणि त्याहून अधिक' },
      { met: true, textEn: 'Unemployed or seeking skill upgrade', textHi: 'बेरोजगार या कौशल उन्नयन की तलाश में', textMr: 'बेरोजगार किंवा कौशल्य वाढ शोधणारा' },
      { met: true, textEn: 'Enrolment at nearest PMKVY-empanelled training centre', textHi: 'नजदीकी PMKVY-पंजीकृत प्रशिक्षण केंद्र में नामांकन', textMr: 'जवळच्या PMKVY-नोंदणीकृत प्रशिक्षण केंद्रात नोंदणी' },
      { met: 'warning', textEn: 'Must not have received PMKVY training in the same sector before', textHi: 'उसी क्षेत्र में पहले PMKVY प्रशिक्षण नहीं लिया होना चाहिए', textMr: 'त्याच क्षेत्रात आधी PMKVY प्रशिक्षण घेतलेले नसावे' },
    ],
    documents: [
      { id: 'aadhaar', nameEn: 'Aadhaar Card', nameHi: 'आधार कार्ड', nameMr: 'आधार कार्ड' },
      { id: 'photo', nameEn: 'Passport Sized Photograph', nameHi: 'पासपोर्ट साइज फोटो', nameMr: 'पासपोर्ट आकाराचा फोटो' },
    ],
    steps: [
      { step: 1, textEn: 'Find nearest PMKVY training centre at pmkvyofficial.org', textHi: 'pmkvyofficial.org पर नजदीकी PMKVY प्रशिक्षण केंद्र खोजें', textMr: 'pmkvyofficial.org वर जवळचे PMKVY प्रशिक्षण केंद्र शोधा', timeEn: '10 min', timeHi: '10 मिनट', timeMr: '10 मिनिटे' },
      { step: 2, textEn: 'Enrol in preferred sector/course with Aadhaar & photo', textHi: 'आधार और फोटो के साथ पसंदीदा सेक्टर/पाठ्यक्रम में नामांकन', textMr: 'आधार आणि फोटोसह पसंतीच्या क्षेत्र/अभ्यासक्रमात नोंदणी', timeEn: '15 min', timeHi: '15 मिनट', timeMr: '15 मिनिटे' },
      { step: 3, textEn: 'Complete training (150–300 hours) and appear for assessment', textHi: 'प्रशिक्षण पूरा करें (150–300 घंटे) और मूल्यांकन में भाग लें', textMr: 'प्रशिक्षण पूर्ण करा (150–300 तास) आणि मूल्यांकनासाठी हजर व्हा', timeEn: '1–3 months', timeHi: '1–3 महीने', timeMr: '1–3 महिने' },
      { step: 4, textEn: 'Receive certificate + ₹8,000 monetary reward + placement support', textHi: 'प्रमाण पत्र + ₹8,000 पुरस्कार + प्लेसमेंट सहायता प्राप्त करें', textMr: 'प्रमाणपत्र + ₹8,000 पुरस्कार + प्लेसमेंट सहाय्य मिळवा', timeEn: '15 days', timeHi: '15 दिन', timeMr: '15 दिवस' },
    ],
    benefitEn: 'Free short-term skill training in 200+ job roles across 35+ sectors. ₹8,000 monetary reward on passing National Assessment. Industry-recognised certificate. Placement assistance.',
    benefitHi: '35+ सेक्टरों में 200+ जॉब रोल में मुफ़्त अल्पकालिक कौशल प्रशिक्षण। राष्ट्रीय मूल्यांकन पास करने पर ₹8,000 पुरस्कार। उद्योग-मान्यता प्राप्त प्रमाण पत्र। प्लेसमेंट सहायता।',
    benefitMr: '35+ क्षेत्रांमध्ये 200+ जॉब भूमिकांमध्ये मोफत अल्पकालीन कौशल्य प्रशिक्षण. राष्ट्रीय मूल्यांकन उत्तीर्ण झाल्यावर ₹8,000 पुरस्कार. उद्योग-मान्यताप्राप्त प्रमाणपत्र. प्लेसमेंट सहाय्य.',
    disbursementEn: '₹8,000 reward disbursed via DBT directly to Aadhaar-linked bank account after assessment results.',
    disbursementHi: 'मूल्यांकन परिणामों के बाद ₹8,000 पुरस्कार DBT के माध्यम से आधार-लिंक बैंक खाते में।',
    disbursementMr: 'मूल्यांकन निकालांनंतर ₹8,000 पुरस्कार DBT द्वारे आधार-लिंक बँक खात्यात.',
    applyUrl: 'https://pmkvyofficial.org',
    casteCategories: ['OBC', 'SC', 'ST'],
  },



  'kcc': {
    id: 'kcc',
    logo: '💳',
    titleEn: 'Kisan Credit Card',
    titleHi: 'किसान क्रेडिट कार्ड',
    titleMr: 'किसान क्रेडिट कार्ड',
    shortTitle: 'KCC',
    typeEn: 'Central Govt • Agricultural Credit',
    typeHi: 'केंद्र सरकार • कृषि ऋण',
    typeMr: 'केंद्र सरकार • कृषी कर्ज',
    ministry: 'Ministry of Agriculture & Farmers Welfare',
    tags: ['Central Govt', 'Loan'],
    amount: 'Up to ₹3L',
    amountHi: '₹3 लाख तक',
    amountMr: '₹3 लाखांपर्यंत',
    amountLabel: 'Short-term revolving credit at 7% interest',
    amountLabelHi: '7% ब्याज पर अल्पकालिक रिवॉल्विंग क्रेडिट',
    amountLabelMr: '7% व्याजावर अल्पकालीन रिव्हॉल्व्हिंग क्रेडिट',
    deadline: 'Ongoing',
    deadlineHi: 'चालू',
    deadlineMr: 'चालू',
    processingTime: '14 days',
    processingTimeHi: '14 दिन',
    processingTimeMr: '14 दिवस',
    docsRequired: 5,
    isEligible: true,
    eligibilityCriteria: [
      { met: true, textEn: 'Farmer / tenant farmer / sharecropper with land records', textHi: 'भूमि रिकॉर्ड वाला किसान / काश्तकार / बटाईदार', textMr: 'जमीन नोंदी असलेला शेतकरी / भाडेकरी / भागीदार' },
      { met: true, textEn: 'Age 18–75 years (co-borrower required if 60+ years)', textHi: 'आयु 18–75 वर्ष (60+ वर्ष होने पर सह-उधारकर्ता आवश्यक)', textMr: 'वय 18–75 वर्षे (60+ वर्षे असल्यास सह-कर्जदार आवश्यक)' },
      { met: true, textEn: 'Valid Aadhaar and land records', textHi: 'वैध आधार और भूमि रिकॉर्ड', textMr: 'वैध आधार आणि जमीन नोंदी' },
      { met: 'warning', textEn: 'Good credit history with bank (no NPA status)', textHi: 'बैंक के साथ अच्छा क्रेडिट इतिहास (NPA नहीं)', textMr: 'बँकेसोबत चांगला क्रेडिट इतिहास (NPA नाही)' },
      { met: true, textEn: 'Linked to PM-KISAN for auto-credit in KCC account', textHi: 'KCC खाते में ऑटो-क्रेडिट के लिए PM-KISAN से जुड़ा', textMr: 'KCC खात्यात ऑटो-क्रेडिटसाठी PM-KISAN शी जोडलेले' },
    ],
    documents: [
      { id: 'aadhaar', nameEn: 'Aadhaar Card', nameHi: 'आधार कार्ड', nameMr: 'आधार कार्ड' },
      { id: 'land', nameEn: 'Land Records / 7-12 Extract', nameHi: 'भूमि रिकॉर्ड / 7-12 उतारा', nameMr: 'जमीन नोंदी / 7-12 उतारा' },
      { id: 'bank', nameEn: 'Bank Passbook', nameHi: 'बैंक पासबुक', nameMr: 'बँक पासबुक' },
      { id: 'photo', nameEn: 'Passport Photo', nameHi: 'पासपोर्ट फोटो', nameMr: 'पासपोर्ट फोटो' },
      { id: 'income', nameEn: 'Income / Crop Details', nameHi: 'आय / फसल विवरण', nameMr: 'उत्पन्न / पीक तपशील' },
    ],
    steps: [
      { step: 1, textEn: 'Visit nearest bank branch (SBI, PNB, Cooperative etc.)', textHi: 'नजदीकी बैंक शाखा (SBI, PNB, सहकारी आदि) पर जाएं', textMr: 'जवळच्या बँक शाखेला (SBI, PNB, सहकारी इ.) भेट द्या', timeEn: '1 hour', timeHi: '1 घंटा', timeMr: '1 तास' },
      { step: 2, textEn: 'Fill KCC application with land and crop details', textHi: 'भूमि और फसल विवरण के साथ KCC आवेदन भरें', textMr: 'जमीन आणि पीक तपशीलांसह KCC अर्ज भरा', timeEn: '20 min', timeHi: '20 मिनट', timeMr: '20 मिनिटे' },
      { step: 3, textEn: 'Bank inspects land and processes application', textHi: 'बैंक भूमि का निरीक्षण करता है और आवेदन प्रक्रिया करता है', textMr: 'बँक जमिनीची तपासणी करते आणि अर्ज प्रक्रिया करते', timeEn: '7 days', timeHi: '7 दिन', timeMr: '7 दिवस' },
      { step: 4, textEn: 'KCC issued — use for seeds, fertilizers, equipment', textHi: 'KCC जारी — बीज, उर्वरक, उपकरण के लिए उपयोग करें', textMr: 'KCC जारी — बियाणे, खते, उपकरणांसाठी वापरा', timeEn: '7 days', timeHi: '7 दिन', timeMr: '7 दिवस' },
    ],
    benefitEn: 'Revolving credit up to ₹3L at 7% interest (4% with prompt repayment). Covers seeds, fertilizers, pesticides, farm equipment, post-harvest expenses. ATM-enabled RuPay card.',
    benefitHi: '7% ब्याज (समय पर चुकौती पर 4%) पर ₹3L तक का रिवॉल्विंग क्रेडिट। बीज, उर्वरक, कीटनाशक, कृषि उपकरण, कटाई के बाद के खर्च शामिल। ATM-सक्षम RuPay कार्ड।',
    benefitMr: '7% व्याजावर (वेळेवर परतफेडीवर 4%) ₹3L पर्यंत रिव्हॉल्व्हिंग क्रेडिट. बियाणे, खते, कीटकनाशके, शेती उपकरणे, काढणीनंतरचे खर्च समाविष्ट. ATM-सक्षम RuPay कार्ड.',
    disbursementEn: 'Credit available via RuPay KCC card or passbook withdrawal from bank. Limit renewed annually.',
    disbursementHi: 'RuPay KCC कार्ड या बैंक से पासबुक निकासी के माध्यम से क्रेडिट उपलब्ध। सीमा वार्षिक रूप से नवीनीकृत।',
    disbursementMr: 'RuPay KCC कार्ड किंवा बँकेतून पासबुक काढणीद्वारे क्रेडिट उपलब्ध. मर्यादा वार्षिक नूतनीकृत.',
    applyUrl: 'https://pmkisan.gov.in',
    casteCategories: ['SC', 'ST', 'OBC', 'General'],
  },

  'soil-health': {
    id: 'soil-health',
    logo: '🧪',
    titleEn: 'Soil Health Card Scheme',
    titleHi: 'मृदा स्वास्थ्य कार्ड योजना',
    titleMr: 'मृदा आरोग्य कार्ड योजना',
    shortTitle: 'SHC',
    typeEn: 'State Govt • Farmer Support',
    typeHi: 'राज्य सरकार • किसान सहायता',
    typeMr: 'राज्य सरकार • शेतकरी सहाय्य',
    ministry: 'Ministry of Agriculture & Farmers Welfare',
    tags: ['State Govt', 'Free'],
    amount: 'Free Testing',
    amountHi: 'मुफ़्त जांच',
    amountMr: 'मोफत चाचणी',
    amountLabel: 'Free soil testing + personalized fertiliser advice',
    amountLabelHi: 'मुफ़्त मिट्टी जांच + व्यक्तिगत उर्वरक सलाह',
    amountLabelMr: 'मोफत माती चाचणी + वैयक्तिक खत सल्ला',
    deadline: 'March 15',
    deadlineHi: '15 मार्च',
    deadlineMr: '15 मार्च',
    processingTime: '30 days',
    processingTimeHi: '30 दिन',
    processingTimeMr: '30 दिवस',
    docsRequired: 2,
    isEligible: true,
    eligibilityCriteria: [
      { met: true, textEn: 'Any farmer with agricultural land', textHi: 'कृषि भूमि वाला कोई भी किसान', textMr: 'शेतजमीन असलेला कोणताही शेतकरी' },
      { met: true, textEn: 'Land registered in farmer\'s name or family', textHi: 'किसान के नाम या परिवार में पंजीकृत भूमि', textMr: 'शेतकऱ्याच्या नावावर किंवा कुटुंबाच्या नावावर नोंदणीकृत जमीन' },
      { met: true, textEn: 'Valid Aadhaar for soil card registration', textHi: 'मृदा कार्ड पंजीकरण के लिए वैध आधार', textMr: 'मृदा कार्ड नोंदणीसाठी वैध आधार' },
    ],
    documents: [
      { id: 'aadhaar', nameEn: 'Aadhaar Card', nameHi: 'आधार कार्ड', nameMr: 'आधार कार्ड' },
      { id: 'land', nameEn: 'Land Records', nameHi: 'भूमि रिकॉर्ड', nameMr: 'जमीन नोंदी' },
    ],
    steps: [
      { step: 1, textEn: 'Contact nearest Krishi Vigyan Kendra or Agriculture Department', textHi: 'नजदीकी कृषि विज्ञान केंद्र या कृषि विभाग से संपर्क करें', textMr: 'जवळच्या कृषी विज्ञान केंद्र किंवा कृषी विभागाशी संपर्क साधा', timeEn: '1 visit', timeHi: '1 भ्रमण', timeMr: '1 भेट' },
      { step: 2, textEn: 'Soil sample collected from your farm by officials', textHi: 'अधिकारियों द्वारा आपके खेत से मिट्टी का नमूना एकत्र', textMr: 'अधिकाऱ्यांद्वारे तुमच्या शेतातून माती नमुना गोळा', timeEn: '1 day', timeHi: '1 दिन', timeMr: '1 दिवस' },
      { step: 3, textEn: 'Lab tests 12 soil parameters (N, P, K, pH, micronutrients)', textHi: 'प्रयोगशाला 12 मिट्टी मानकों की जांच (N, P, K, pH, सूक्ष्म पोषक)', textMr: 'प्रयोगशाळा 12 माती मानकांची चाचणी (N, P, K, pH, सूक्ष्म पोषक)', timeEn: '15–30 days', timeHi: '15–30 दिन', timeMr: '15–30 दिवस' },
      { step: 4, textEn: 'Receive Soil Health Card with crop-specific fertiliser advice', textHi: 'फसल-विशिष्ट उर्वरक सलाह के साथ मृदा स्वास्थ्य कार्ड प्राप्त करें', textMr: 'पीक-विशिष्ट खत सल्ल्यासह मृदा आरोग्य कार्ड प्राप्त करा', timeEn: '30 days', timeHi: '30 दिन', timeMr: '30 दिवस' },
    ],
    benefitEn: 'Free soil health testing for 12 parameters. Personalized crop-wise fertiliser recommendations. Updated every 2 years. Helps reduce input costs by 10–15%.',
    benefitHi: '12 मानकों के लिए मुफ़्त मिट्टी जांच। फसल-वार व्यक्तिगत उर्वरक सिफारिशें। हर 2 साल में अद्यतन। इनपुट लागत 10–15% कम करने में मदद।',
    benefitMr: '12 मानकांसाठी मोफत माती आरोग्य चाचणी. पीक-निहाय वैयक्तिक खत शिफारसी. दर 2 वर्षांनी अद्ययावत. इनपुट खर्च 10–15% कमी करण्यात मदत.',
    disbursementEn: 'Free card issued directly to farmer. Available in local language. Also accessible online at soilhealth.dac.gov.in.',
    disbursementHi: 'सीधे किसान को मुफ़्त कार्ड जारी। स्थानीय भाषा में उपलब्ध। soilhealth.dac.gov.in पर ऑनलाइन भी।',
    disbursementMr: 'थेट शेतकऱ्याला मोफत कार्ड जारी. स्थानिक भाषेत उपलब्ध. soilhealth.dac.gov.in वर ऑनलाइनही उपलब्ध.',
    applyUrl: 'https://soilhealth.dac.gov.in',
    casteCategories: ['SC', 'ST', 'OBC', 'General'],
  },

  'pm-kusum': {
    id: 'pm-kusum',
    logo: '☀️',
    titleEn: 'PM-KUSUM Solar Pump Scheme',
    titleHi: 'PM कुसुम सोलर पंप योजना',
    titleMr: 'PM कुसुम सोलर पंप योजना',
    shortTitle: 'PM-KUSUM',
    typeEn: 'Central Govt • Solar Subsidy',
    typeHi: 'केंद्र सरकार • सौर सब्सिडी',
    typeMr: 'केंद्र सरकार • सौर अनुदान',
    ministry: 'Ministry of New and Renewable Energy',
    tags: ['Central Govt', 'Subsidy'],
    amount: '90% subsidy',
    amountHi: '90% सब्सिडी',
    amountMr: '90% अनुदान',
    amountLabel: 'Up to 90% subsidy on solar pump installation',
    amountLabelHi: 'सौर पंप स्थापना पर 90% तक सब्सिडी',
    amountLabelMr: 'सौर पंप स्थापनेवर 90% पर्यंत अनुदान',
    deadline: 'April 15',
    deadlineHi: '15 अप्रैल',
    deadlineMr: '15 एप्रिल',
    processingTime: '60 days',
    processingTimeHi: '60 दिन',
    processingTimeMr: '60 दिवस',
    docsRequired: 4,
    isEligible: true,
    eligibilityCriteria: [
      { met: true, textEn: 'Individual farmer or group of farmers with agricultural land', textHi: 'कृषि भूमि वाला व्यक्तिगत किसान या किसानों का समूह', textMr: 'शेतजमीन असलेला वैयक्तिक शेतकरी किंवा शेतकऱ्यांचा गट' },
      { met: true, textEn: 'Land within 5 km of proposed solar pump location', textHi: 'प्रस्तावित सौर पंप स्थान के 5 किमी के भीतर भूमि', textMr: 'प्रस्तावित सौर पंप स्थानापासून 5 किमी आत जमीन' },
      { met: 'warning', textEn: 'Applicable only in states that have implemented PM-KUSUM', textHi: 'केवल उन राज्यों में लागू जहां PM-KUSUM लागू है', textMr: 'फक्त PM-KUSUM लागू असलेल्या राज्यांमध्ये लागू' },
      { met: true, textEn: 'Water source available at installation site', textHi: 'स्थापना स्थल पर जल स्रोत उपलब्ध', textMr: 'स्थापना स्थळी पाण्याचा स्रोत उपलब्ध' },
    ],
    documents: [
      { id: 'aadhaar', nameEn: 'Aadhaar Card', nameHi: 'आधार कार्ड', nameMr: 'आधार कार्ड' },
      { id: 'land', nameEn: 'Land Records', nameHi: 'भूमि रिकॉर्ड', nameMr: 'जमीन नोंदी' },
      { id: 'bank', nameEn: 'Bank Passbook', nameHi: 'बैंक पासबुक', nameMr: 'बँक पासबुक' },
      { id: 'photo', nameEn: 'Passport Photo', nameHi: 'पासपोर्ट फोटो', nameMr: 'पासपोर्ट फोटो' },
    ],
    steps: [
      { step: 1, textEn: 'Apply on state DISCOM portal or PM-KUSUM state portal', textHi: 'राज्य DISCOM पोर्टल या PM-KUSUM राज्य पोर्टल पर आवेदन करें', textMr: 'राज्य DISCOM पोर्टल किंवा PM-KUSUM राज्य पोर्टलवर अर्ज करा', timeEn: '15 min', timeHi: '15 मिनट', timeMr: '15 मिनिटे' },
      { step: 2, textEn: 'Site verification by state agriculture/energy department', textHi: 'राज्य कृषि/ऊर्जा विभाग द्वारा साइट सत्यापन', textMr: 'राज्य कृषी/ऊर्जा विभागाद्वारे साइट सत्यापन', timeEn: '15 days', timeHi: '15 दिन', timeMr: '15 दिवस' },
      { step: 3, textEn: 'Farmer pays 10% cost; state pays 30%; Centre pays 60%', textHi: 'किसान 10% लागत देता है; राज्य 30%; केंद्र 60% देता है', textMr: 'शेतकरी 10% खर्च देतो; राज्य 30%; केंद्र 60% देते', timeEn: '1 day', timeHi: '1 दिन', timeMr: '1 दिवस' },
      { step: 4, textEn: 'Solar pump installed & commissioned by empanelled vendor', textHi: 'पंजीकृत विक्रेता द्वारा सौर पंप स्थापित और चालू', textMr: 'नोंदणीकृत विक्रेत्याद्वारे सौर पंप स्थापित आणि सुरू', timeEn: '30 days', timeHi: '30 दिन', timeMr: '30 दिवस' },
    ],
    benefitEn: '90% subsidy (60% central + 30% state) on solar pump of 2–10 HP. Farmer pays only 10%. Saves ₹15,000–₹30,000/year on electricity bills. Excess power can be sold to grid.',
    benefitHi: '2–10 HP के सौर पंप पर 90% सब्सिडी (60% केंद्र + 30% राज्य)। किसान केवल 10% देता है। बिजली बिल में ₹15,000–₹30,000/वर्ष की बचत। अतिरिक्त बिजली ग्रिड को बेची जा सकती है।',
    benefitMr: '2–10 HP च्या सौर पंपवर 90% अनुदान (60% केंद्र + 30% राज्य). शेतकरी फक्त 10% देतो. वीज बिलात ₹15,000–₹30,000/वर्ष बचत. अतिरिक्त वीज ग्रिडला विकता येते.',
    disbursementEn: 'Subsidy adjusted in pump cost by vendor. Installation by empanelled DISCOM/vendor within 60 days of approval.',
    disbursementHi: 'विक्रेता द्वारा पंप लागत में सब्सिडी समायोजित। अनुमोदन के 60 दिनों के भीतर पंजीकृत DISCOM/विक्रेता द्वारा स्थापना।',
    disbursementMr: 'विक्रेत्याद्वारे पंप किंमतीत अनुदान समायोजित. मंजुरीच्या 60 दिवसांत नोंदणीकृत DISCOM/विक्रेत्याद्वारे स्थापना.',
    applyUrl: 'https://mnre.gov.in',
    casteCategories: ['SC', 'ST', 'OBC', 'General'],
  },

  'pmkmdy': {
    id: 'pmkmdy',
    logo: '👨‍🌾',
    titleEn: 'Pradhan Mantri Kisan Maandhan Yojana',
    titleHi: 'प्रधानमंत्री किसान मानधन योजना',
    titleMr: 'प्रधानमंत्री किसान मानधन योजना',
    shortTitle: 'PMKMDY',
    typeEn: 'Central Govt • Farmer Pension',
    typeHi: 'केंद्र सरकार • किसान पेंशन',
    typeMr: 'केंद्र सरकार • शेतकरी पेन्शन',
    ministry: 'Ministry of Agriculture & Farmers Welfare',
    tags: ['Central Govt', 'Pension'],
    amount: '₹3,000/month',
    amountHi: '₹3,000/माह',
    amountMr: '₹3,000/महिना',
    amountLabel: 'Monthly pension after 60 years of age',
    amountLabelHi: '60 वर्ष की आयु के बाद मासिक पेंशन',
    amountLabelMr: '60 वर्षे वयानंतर मासिक पेन्शन',
    deadline: 'Ongoing',
    deadlineHi: 'चालू',
    deadlineMr: 'चालू',
    processingTime: '15 days',
    processingTimeHi: '15 दिन',
    processingTimeMr: '15 दिवस',
    docsRequired: 3,
    isEligible: true,
    eligibilityCriteria: [
      { met: true, textEn: 'Small and marginal farmer with land up to 2 hectares', textHi: '2 हेक्टेयर तक की भूमि वाला लघु और सीमांत किसान', textMr: '2 हेक्टरपर्यंत जमीन असलेला अल्प आणि सीमांत शेतकरी' },
      { met: true, textEn: 'Age between 18 and 40 years at time of enrolment', textHi: 'नामांकन के समय 18 से 40 वर्ष के बीच आयु', textMr: 'नोंदणीच्या वेळी 18 ते 40 वर्षे वयोगट' },
      { met: 'warning', textEn: 'Not covered under other pension schemes (NPS, EPFO)', textHi: 'अन्य पेंशन योजनाओं (NPS, EPFO) में शामिल नहीं', textMr: 'इतर पेन्शन योजनांमध्ये (NPS, EPFO) समाविष्ट नसावे' },
      { met: true, textEn: 'Valid Aadhaar and bank account', textHi: 'वैध आधार और बैंक खाता', textMr: 'वैध आधार आणि बँक खाते' },
    ],
    documents: [
      { id: 'aadhaar', nameEn: 'Aadhaar Card', nameHi: 'आधार कार्ड', nameMr: 'आधार कार्ड' },
      { id: 'bank', nameEn: 'Bank Passbook (IFSC)', nameHi: 'बैंक पासबुक (IFSC)', nameMr: 'बँक पासबुक (IFSC)' },
      { id: 'land', nameEn: 'Land Records (up to 2 hectares)', nameHi: 'भूमि रिकॉर्ड (2 हेक्टेयर तक)', nameMr: 'जमीन नोंदी (2 हेक्टरपर्यंत)' },
    ],
    steps: [
      { step: 1, textEn: 'Visit nearest CSC centre or maandhan.in', textHi: 'नजदीकी CSC केंद्र या maandhan.in पर जाएं', textMr: 'जवळच्या CSC केंद्राला किंवा maandhan.in ला भेट द्या', timeEn: '5 min', timeHi: '5 मिनट', timeMr: '5 मिनिटे' },
      { step: 2, textEn: 'Enter Aadhaar, bank details and land information', textHi: 'आधार, बैंक विवरण और भूमि जानकारी दर्ज करें', textMr: 'आधार, बँक तपशील आणि जमीन माहिती भरा', timeEn: '10 min', timeHi: '10 मिनट', timeMr: '10 मिनिटे' },
      { step: 3, textEn: 'Monthly contribution of ₹55–₹200 based on entry age', textHi: 'प्रवेश आयु के अनुसार ₹55–₹200 का मासिक योगदान', textMr: 'प्रवेश वयानुसार ₹55–₹200 चे मासिक योगदान', timeEn: 'Monthly', timeHi: 'मासिक', timeMr: 'मासिक' },
      { step: 4, textEn: 'Pension of ₹3,000/month starts at age 60', textHi: '60 वर्ष की आयु में ₹3,000/माह पेंशन शुरू', textMr: '60 वर्षे वयात ₹3,000/महिना पेन्शन सुरू', timeEn: 'At age 60', timeHi: '60 वर्ष पर', timeMr: '60 वर्षांवर' },
    ],
    benefitEn: '₹3,000/month guaranteed pension for small farmers after age 60. Equal contribution by Central Government. Spouse gets ₹1,500/month on death of subscriber.',
    benefitHi: 'छोटे किसानों के लिए 60 वर्ष के बाद ₹3,000/माह गारंटीड पेंशन। केंद्र सरकार का समान योगदान। ग्राहक की मृत्यु पर जीवनसाथी को ₹1,500/माह।',
    benefitMr: 'लहान शेतकऱ्यांसाठी 60 वर्षांनंतर ₹3,000/महिना हमी पेन्शन. केंद्र सरकारचे समान योगदान. ग्राहकाच्या मृत्यूवर जोडीदाराला ₹1,500/महिना.',
    disbursementEn: 'Pension credited monthly to bank account. LIC manages the fund. Minimum 20 years of contribution required.',
    disbursementHi: 'मासिक रूप से बैंक खाते में पेंशन जमा। LIC फंड का प्रबंधन करती है। न्यूनतम 20 वर्ष का योगदान आवश्यक।',
    disbursementMr: 'मासिक बँक खात्यात पेन्शन जमा. LIC फंड व्यवस्थापित करते. किमान 20 वर्षांचे योगदान आवश्यक.',
    applyUrl: 'https://maandhan.in',
    casteCategories: ['SC', 'OBC', 'ST'],
  },

  'cpis': {
    id: 'cpis',
    logo: '🥥',
    titleEn: 'Coconut Palm Insurance Scheme',
    titleHi: 'नारियल पाम बीमा योजना',
    titleMr: 'नारळ पाम विमा योजना',
    shortTitle: 'CPIS',
    typeEn: 'Central Govt • Crop Insurance',
    typeHi: 'केंद्र सरकार • फसल बीमा',
    typeMr: 'केंद्र सरकार • पीक विमा',
    ministry: 'Ministry of Agriculture — Coconut Development Board',
    tags: ['Central Govt', 'Insurance'],
    amount: 'Up to ₹900/palm',
    amountHi: 'प्रति पेड़ ₹900 तक',
    amountMr: 'प्रति झाड ₹900 पर्यंत',
    amountLabel: 'Insurance payout per damaged/destroyed coconut palm',
    amountLabelHi: 'क्षतिग्रस्त/नष्ट प्रति नारियल पाम पर बीमा भुगतान',
    amountLabelMr: 'खराब/नष्ट झालेल्या प्रति नारळ पामवर विमा देयक',
    deadline: 'Ongoing',
    deadlineHi: 'चालू',
    deadlineMr: 'चालू',
    processingTime: '45 days',
    processingTimeHi: '45 दिन',
    processingTimeMr: '45 दिवस',
    docsRequired: 3,
    isEligible: true,
    eligibilityCriteria: [
      { met: true, textEn: 'Coconut farmer owning coconut palms', textHi: 'नारियल पाम का मालिक नारियल किसान', textMr: 'नारळ पाम मालक असलेला नारळ शेतकरी' },
      { met: true, textEn: 'Palm must be in productive age (4–60 years)', textHi: 'पेड़ उत्पादक आयु (4–60 वर्ष) में होना चाहिए', textMr: 'झाड उत्पादक वयात (4–60 वर्षे) असणे आवश्यक' },
      { met: 'warning', textEn: 'Must enroll before natural disaster occurs', textHi: 'प्राकृतिक आपदा से पहले नामांकन जरूरी', textMr: 'नैसर्गिक आपत्तीपूर्वी नोंदणी आवश्यक' },
      { met: true, textEn: 'Land records to prove ownership of palms', textHi: 'पेड़ों का स्वामित्व साबित करने के लिए भूमि रिकॉर्ड', textMr: 'झाडांची मालकी सिद्ध करण्यासाठी जमीन नोंदी' },
    ],
    documents: [
      { id: 'aadhaar', nameEn: 'Aadhaar Card', nameHi: 'आधार कार्ड', nameMr: 'आधार कार्ड' },
      { id: 'land', nameEn: 'Land Records with palm count', nameHi: 'पेड़ों की गणना के साथ भूमि रिकॉर्ड', nameMr: 'झाडांच्या संख्येसह जमीन नोंदी' },
      { id: 'bank', nameEn: 'Bank Account Details', nameHi: 'बैंक खाता विवरण', nameMr: 'बँक खाते तपशील' },
    ],
    steps: [
      { step: 1, textEn: 'Register with Coconut Development Board (CDB) office', textHi: 'नारियल विकास बोर्ड (CDB) कार्यालय में पंजीकरण करें', textMr: 'नारळ विकास मंडळ (CDB) कार्यालयात नोंदणी करा', timeEn: '1 day', timeHi: '1 दिन', timeMr: '1 दिवस' },
      { step: 2, textEn: 'Provide palm count, age and land details for enrolment', textHi: 'नामांकन के लिए पेड़ों की संख्या, आयु और भूमि विवरण दें', textMr: 'नोंदणीसाठी झाडांची संख्या, वय आणि जमीन तपशील द्या', timeEn: '15 min', timeHi: '15 मिनट', timeMr: '15 मिनिटे' },
      { step: 3, textEn: 'Pay premium: ₹10/palm/year (75% subsidised by Govt)', textHi: 'प्रीमियम ₹10/पेड़/वर्ष (सरकार द्वारा 75% अनुदानित)', textMr: 'प्रीमियम ₹10/झाड/वर्ष (सरकारकडून 75% अनुदानित)', timeEn: '10 min', timeHi: '10 मिनट', timeMr: '10 मिनिटे' },
      { step: 4, textEn: 'File claim after damage with CDB inspection', textHi: 'CDB निरीक्षण के साथ क्षति के बाद दावा दाखिल करें', textMr: 'CDB तपासणीसह नुकसानानंतर दावा दाखल करा', timeEn: '45 days', timeHi: '45 दिन', timeMr: '45 दिवस' },
    ],
    benefitEn: 'Insurance cover ₹900/palm for total loss. Premium ₹10/palm/year of which 75% (₹7.50) is subsidised by Government. Covers natural disasters, pests and diseases.',
    benefitHi: 'कुल हानि के लिए ₹900/पेड़ बीमा कवर। प्रीमियम ₹10/पेड़/वर्ष जिसमें से 75% (₹7.50) सरकार द्वारा अनुदानित। प्राकृतिक आपदाएं, कीट और रोग शामिल।',
    benefitMr: 'संपूर्ण नुकसानासाठी ₹900/झाड विमा कव्हर. प्रीमियम ₹10/झाड/वर्ष ज्यापैकी 75% (₹7.50) सरकारकडून अनुदानित. नैसर्गिक आपत्ती, कीड आणि रोग समाविष्ट.',
    disbursementEn: 'Claim settled within 45 days of verification by Coconut Development Board. Amount credited to bank account.',
    disbursementHi: 'नारियल विकास बोर्ड के सत्यापन के 45 दिनों के भीतर दावा निपटाया जाता है। राशि बैंक खाते में जमा।',
    disbursementMr: 'नारळ विकास मंडळाच्या सत्यापनाच्या 45 दिवसांत दावा निकाली. रक्कम बँक खात्यात जमा.',
    applyUrl: 'https://coconutboard.gov.in',
    casteCategories: ['OBC', 'ST', 'SC'],
  },

  'pmksy-pdmc': {
    id: 'pmksy-pdmc',
    logo: '💧',
    titleEn: 'PM Krishi Sinchayee Yojana — Per Drop More Crop',
    titleHi: 'PM कृषि सिंचाई योजना — प्रति बूंद अधिक फसल',
    titleMr: 'PM कृषी सिंचन योजना — प्रति थेंब अधिक पीक',
    shortTitle: 'PMKSY-PDMC',
    typeEn: 'Central Govt • Irrigation Subsidy',
    typeHi: 'केंद्र सरकार • सिंचाई सब्सिडी',
    typeMr: 'केंद्र सरकार • सिंचन अनुदान',
    ministry: 'Ministry of Agriculture & Farmers Welfare',
    tags: ['Central Govt', 'Subsidy'],
    amount: '55–90% subsidy',
    amountHi: '55–90% सब्सिडी',
    amountMr: '55–90% अनुदान',
    amountLabel: 'On drip/sprinkler irrigation system installation',
    amountLabelHi: 'ड्रिप/स्प्रिंकलर सिंचाई प्रणाली स्थापना पर',
    amountLabelMr: 'ड्रिप/स्प्रिंकलर सिंचन प्रणाली स्थापनेवर',
    deadline: 'March 31',
    deadlineHi: '31 मार्च',
    deadlineMr: '31 मार्च',
    processingTime: '30 days',
    processingTimeHi: '30 दिन',
    processingTimeMr: '30 दिवस',
    docsRequired: 4,
    isEligible: true,
    eligibilityCriteria: [
      { met: true, textEn: 'Farmer with cultivable land of any size', textHi: 'किसी भी आकार की खेती योग्य भूमि वाला किसान', textMr: 'कोणत्याही आकाराची शेतजमीन असलेला शेतकरी' },
      { met: true, textEn: 'SC/ST farmers: up to 90% subsidy', textHi: 'SC/ST किसान: 90% तक सब्सिडी', textMr: 'SC/ST शेतकरी: 90% पर्यंत अनुदान' },
      { met: true, textEn: 'Small/marginal farmers: up to 75% subsidy', textHi: 'लघु/सीमांत किसान: 75% तक सब्सिडी', textMr: 'अल्प/सीमांत शेतकरी: 75% पर्यंत अनुदान' },
      { met: 'warning', textEn: 'Must purchase from empanelled irrigation system supplier', textHi: 'पंजीकृत सिंचाई प्रणाली आपूर्तिकर्ता से खरीद आवश्यक', textMr: 'नोंदणीकृत सिंचन प्रणाली पुरवठादाराकडून खरेदी आवश्यक' },
    ],
    documents: [
      { id: 'aadhaar', nameEn: 'Aadhaar Card', nameHi: 'आधार कार्ड', nameMr: 'आधार कार्ड' },
      { id: 'land', nameEn: 'Land Records', nameHi: 'भूमि रिकॉर्ड', nameMr: 'जमीन नोंदी' },
      { id: 'bank', nameEn: 'Bank Passbook', nameHi: 'बैंक पासबुक', nameMr: 'बँक पासबुक' },
      { id: 'quotation', nameEn: 'Irrigation System Quotation', nameHi: 'सिंचाई प्रणाली का उद्धरण', nameMr: 'सिंचन प्रणाली कोटेशन' },
    ],
    steps: [
      { step: 1, textEn: 'Apply on state agriculture portal or visit district agriculture office', textHi: 'राज्य कृषि पोर्टल पर आवेदन या जिला कृषि कार्यालय जाएं', textMr: 'राज्य कृषी पोर्टलवर अर्ज करा किंवा जिल्हा कृषी कार्यालयाला भेट द्या', timeEn: '15 min', timeHi: '15 मिनट', timeMr: '15 मिनिटे' },
      { step: 2, textEn: 'Submit application with land records and quotation', textHi: 'भूमि रिकॉर्ड और उद्धरण के साथ आवेदन जमा करें', textMr: 'जमीन नोंदी आणि कोटेशनसह अर्ज सबमिट करा', timeEn: '20 min', timeHi: '20 मिनट', timeMr: '20 मिनिटे' },
      { step: 3, textEn: 'Site verification by agriculture department official', textHi: 'कृषि विभाग के अधिकारी द्वारा साइट सत्यापन', textMr: 'कृषी विभाग अधिकाऱ्याद्वारे साइट सत्यापन', timeEn: '7 days', timeHi: '7 दिन', timeMr: '7 दिवस' },
      { step: 4, textEn: 'Install system from empanelled vendor; subsidy credited', textHi: 'पंजीकृत विक्रेता से सिस्टम स्थापित करें; सब्सिडी जमा होगी', textMr: 'नोंदणीकृत विक्रेत्याकडून प्रणाली स्थापित करा; अनुदान जमा होईल', timeEn: '30 days', timeHi: '30 दिन', timeMr: '30 दिवस' },
    ],
    benefitEn: '55–90% subsidy on drip/sprinkler irrigation systems. Saves 30–50% water. Increases crop yield by 20–40%. SC/ST farmers get highest subsidy of up to 90%.',
    benefitHi: 'ड्रिप/स्प्रिंकलर सिंचाई प्रणाली पर 55–90% सब्सिडी। 30–50% पानी बचाता है। फसल उपज में 20–40% वृद्धि। SC/ST किसानों को 90% तक सर्वाधिक सब्सिडी।',
    benefitMr: 'ड्रिप/स्प्रिंकलर सिंचन प्रणालींवर 55–90% अनुदान. 30–50% पाणी वाचते. पीक उत्पादनात 20–40% वाढ. SC/ST शेतकऱ्यांना 90% पर्यंत सर्वाधिक अनुदान.',
    disbursementEn: 'Subsidy credited directly to farmer bank account after installation verification by agriculture department.',
    disbursementHi: 'कृषि विभाग के स्थापना सत्यापन के बाद सब्सिडी सीधे किसान बैंक खाते में जमा।',
    disbursementMr: 'कृषी विभागाच्या स्थापना सत्यापनानंतर अनुदान थेट शेतकरी बँक खात्यात जमा.',
    applyUrl: 'https://pmksy.gov.in',
    casteCategories: ['SC', 'ST', 'OBC', 'General'],
  },

};

// ─── Fallback generic data for schemes not in database ──────────────────────
function getFallbackScheme(id: string): SchemeData {
  return {
    id,
    logo: '📋',
    titleEn: id.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
    titleHi: 'योजना विवरण',
    titleMr: 'योजना तपशील',
    shortTitle: id.toUpperCase().slice(0, 10),
    typeEn: 'Central Govt • Government Scheme',
    typeHi: 'केंद्र सरकार • सरकारी योजना',
    typeMr: 'केंद्र सरकार • सरकारी योजना',
    ministry: 'Ministry of Government of India',
    tags: ['Central Govt'],
    amount: 'As per scheme',
    amountHi: 'योजना अनुसार',
    amountMr: 'योजनेनुसार',
    amountLabel: 'Benefits as per scheme guidelines',
    amountLabelHi: 'योजना दिशानिर्देश अनुसार लाभ',
    amountLabelMr: 'योजना मार्गदर्शक तत्त्वांनुसार लाभ',
    deadline: 'Ongoing',
    deadlineHi: 'चालू',
    deadlineMr: 'चालू',
    processingTime: '30 days',
    processingTimeHi: '30 दिन',
    processingTimeMr: '30 दिवस',
    docsRequired: 4,
    isEligible: true,
    eligibilityCriteria: [
      { met: true, textEn: 'Indian citizen meeting scheme criteria', textHi: 'योजना मानदंड पूरे करने वाला भारतीय नागरिक', textMr: 'योजना निकष पूर्ण करणारा भारतीय नागरिक' },
      { met: true, textEn: 'Valid Aadhaar card', textHi: 'वैध आधार कार्ड', textMr: 'वैध आधार कार्ड' },
      { met: 'warning', textEn: 'Complete your profile for accurate eligibility check', textHi: 'सटीक पात्रता जांच के लिए प्रोफाइल पूरी करें', textMr: 'अचूक पात्रता तपासणीसाठी प्रोफाइल पूर्ण करा' },
    ],
    documents: [
      { id: 'aadhaar', nameEn: 'Aadhaar Card', nameHi: 'आधार कार्ड', nameMr: 'आधार कार्ड' },
      { id: 'bank', nameEn: 'Bank Passbook', nameHi: 'बैंक पासबुक', nameMr: 'बँक पासबुक' },
      { id: 'photo', nameEn: 'Passport Photo', nameHi: 'पासपोर्ट फोटो', nameMr: 'पासपोर्ट फोटो' },
      { id: 'income', nameEn: 'Income Certificate', nameHi: 'आय प्रमाण पत्र', nameMr: 'उत्पन्न प्रमाणपत्र' },
    ],
    steps: [
      { step: 1, textEn: 'Visit scheme official portal or nearest CSC', textHi: 'योजना आधिकारिक पोर्टल या नजदीकी CSC पर जाएं', textMr: 'योजना अधिकृत पोर्टल किंवा जवळच्या CSC ला भेट द्या', timeEn: '5 min', timeHi: '5 मिनट', timeMr: '5 मिनिटे' },
      { step: 2, textEn: 'Register and fill application form', textHi: 'पंजीकरण करें और आवेदन फॉर्म भरें', textMr: 'नोंदणी करा आणि अर्ज फॉर्म भरा', timeEn: '15 min', timeHi: '15 मिनट', timeMr: '15 मिनिटे' },
      { step: 3, textEn: 'Upload required documents', textHi: 'आवश्यक दस्तावेज़ अपलोड करें', textMr: 'आवश्यक कागदपत्रे अपलोड करा', timeEn: '10 min', timeHi: '10 मिनट', timeMr: '10 मिनिटे' },
      { step: 4, textEn: 'Submit and track application status', textHi: 'जमा करें और आवेदन स्थिति ट्रैक करें', textMr: 'सबमिट करा आणि अर्ज स्थिती ट्रॅक करा', timeEn: 'Instant', timeHi: 'तुरंत', timeMr: 'त्वरित' },
    ],
    benefitEn: 'Benefits as per scheme guidelines. Please check official scheme portal for detailed benefit information.',
    benefitHi: 'योजना दिशानिर्देश अनुसार लाभ। विस्तृत जानकारी के लिए आधिकारिक योजना पोर्टल देखें।',
    benefitMr: 'योजना मार्गदर्शक तत्त्वांनुसार लाभ. तपशीलवार लाभ माहितीसाठी अधिकृत योजना पोर्टल पहा.',
    disbursementEn: 'Benefits disbursed via Direct Benefit Transfer (DBT) to registered bank account.',
    disbursementHi: 'पंजीकृत बैंक खाते में प्रत्यक्ष लाभ अंतरण (DBT) के माध्यम से लाभ वितरित।',
    disbursementMr: 'नोंदणीकृत बँक खात्यात थेट लाभ हस्तांतरण (DBT) द्वारे लाभ वितरित.',
    applyUrl: 'https://www.india.gov.in',
    casteCategories: ['SC', 'ST', 'OBC', 'General'],
  };
}

// ─── Component ────────────────────────────────────────────────────────────────
export function SchemeDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { language } = useLanguage();
  const { userData } = useUser();
  const isHindi = language === 'hi';
  const isMarathi = language === 'mr';

  const [expandedSection, setExpandedSection] = useState<string>('at-a-glance');

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? '' : section);
  };

  const scheme = id ? (schemeDatabase[id] ?? getFallbackScheme(id)) : getFallbackScheme('unknown');

  // Helper function to get text based on language
  const getText = (en: string, hi: string, mr: string) => {
    if (isMarathi) return mr;
    if (isHindi) return hi;
    return en;
  };

  const casteBadgeConfig: Record<string, { bg: string; text: string }> = {
    SC: { bg: 'bg-purple-100', text: 'text-purple-700' },
    ST: { bg: 'bg-blue-100', text: 'text-blue-700' },
    OBC: { bg: 'bg-amber-100', text: 'text-amber-700' },
    General: { bg: 'bg-gray-100', text: 'text-gray-600' },
  };

  return (
    <div className="min-h-screen bg-[#F7F3EE] pb-24">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="bg-gradient-to-b from-[#1A3C1A] to-[#2D6A2D] pt-10 pb-6 px-4">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <h2 className="text-white font-semibold text-[16px]">
            {getText('Scheme Details', 'योजना विवरण', 'योजना तपशील')}
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
              {scheme.logo}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="font-bold text-white text-[17px] leading-snug">
                {getText(scheme.titleEn, scheme.titleHi, scheme.titleMr)}
              </h1>
              <p className="text-[#C8D8C8] text-[12px] mt-0.5 truncate">
                {getText(scheme.typeEn, scheme.typeHi, scheme.typeMr)}
              </p>
              {/* Caste badges */}
              <div className="flex gap-1.5 flex-wrap mt-2">
                {scheme.casteCategories.map((c) => (
                  <span
                    key={c}
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${casteBadgeConfig[c]?.bg} ${casteBadgeConfig[c]?.text}`}
                  >
                    {c}
                  </span>
                ))}
                {scheme.tags.map((tag) => (
                  <span key={tag} className="bg-[#2D6A2D] text-white px-2 py-0.5 rounded-full text-[10px] font-semibold">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            {scheme.isEligible && (
              <div className="bg-[#97BC62] px-2.5 py-1 rounded-full text-[#1A3C1A] text-[10px] font-semibold flex items-center gap-1 flex-shrink-0">
                <CheckCircle className="w-3 h-3" />
                {getText('Eligible', 'पात्र', 'पात्र')}
              </div>
            )}
          </div>
        </motion.div>
      </div>

      <div className="px-4 pt-4 space-y-4">

        {/* ── At a Glance ──────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100"
        >
          <h2 className="font-bold text-[15px] text-[#1C1C1E] mb-3">
            {getText('At a Glance', 'मुख्य जानकारी', 'मुख्य माहिती')}
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#F7F3EE] rounded-2xl p-3 text-center">
              <div className="w-10 h-10 rounded-full bg-[#F5A623]/20 flex items-center justify-center mx-auto mb-2">
                <IndianRupee className="w-5 h-5 text-[#F5A623]" />
              </div>
              <div className="font-bold text-[17px] text-[#1C1C1E]">{getText(scheme.amount, scheme.amountHi, scheme.amountMr)}</div>
              <div className="text-[10px] text-[#6B7280] leading-tight mt-0.5">
                {getText(scheme.amountLabel, scheme.amountLabelHi, scheme.amountLabelMr)}
              </div>
            </div>
            <div className="bg-[#F7F3EE] rounded-2xl p-3 text-center">
              <div className="w-10 h-10 rounded-full bg-[#FB923C]/20 flex items-center justify-center mx-auto mb-2">
                <Calendar className="w-5 h-5 text-[#FB923C]" />
              </div>
              <div className="font-bold text-[16px] text-[#1C1C1E]">
                {getText(scheme.deadline, scheme.deadlineHi, scheme.deadlineMr)}
              </div>
              <div className="text-[10px] text-[#6B7280]">{getText('Deadline', 'अंतिम तिथि', 'अंतिम तारीख')}</div>
            </div>
            <div className="bg-[#F7F3EE] rounded-2xl p-3 text-center">
              <div className="w-10 h-10 rounded-full bg-[#60A5FA]/20 flex items-center justify-center mx-auto mb-2">
                <FileText className="w-5 h-5 text-[#60A5FA]" />
              </div>
              <div className="font-bold text-[18px] text-[#1C1C1E]">{scheme.docsRequired}</div>
              <div className="text-[10px] text-[#6B7280]">{getText('Documents', 'जरूरी दस्तावेज़', 'कागदपत्रे')}</div>
            </div>
            <div className="bg-[#F7F3EE] rounded-2xl p-3 text-center">
              <div className="w-10 h-10 rounded-full bg-[#97BC62]/20 flex items-center justify-center mx-auto mb-2">
                <Clock className="w-5 h-5 text-[#97BC62]" />
              </div>
              <div className="font-bold text-[15px] text-[#1C1C1E]">
                {getText(scheme.processingTime, scheme.processingTimeHi, scheme.processingTimeMr)}
              </div>
              <div className="text-[10px] text-[#6B7280]">{getText('Processing', 'प्रोसेसिंग समय', 'प्रक्रिया वेळ')}</div>
            </div>
          </div>
          {/* Ministry tag */}
          <div className="mt-3 bg-[#F0F7F0] rounded-2xl px-3 py-2 flex items-center gap-2">
            <span className="text-[14px]">🏛️</span>
            <p className="text-[11px] text-[#2D6A2D] font-medium">{scheme.ministry}</p>
          </div>
        </motion.div>

        {/* ── Eligibility Criteria ─────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.05 }}
          className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100"
        >
          <button onClick={() => toggleSection('eligibility')} className="w-full flex items-center justify-between">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <h2 className="font-bold text-[15px] text-[#1C1C1E]">
                {getText('Eligibility Criteria', 'पात्रता मानदंड', 'पात्रता निकष')}
              </h2>
              <span className="bg-[#97BC62]/15 text-[#2D6A2D] px-2 py-0.5 rounded-full text-[10px] font-medium whitespace-nowrap">
                {getText(
                  `${scheme.eligibilityCriteria.filter(e => e.met === true).length}/${scheme.eligibilityCriteria.length} met`,
                  `${scheme.eligibilityCriteria.filter(e => e.met === true).length}/${scheme.eligibilityCriteria.length} पूरी`,
                  `${scheme.eligibilityCriteria.filter(e => e.met === true).length}/${scheme.eligibilityCriteria.length} पूर्ण`
                )}
              </span>
            </div>
            {expandedSection === 'eligibility'
              ? <ChevronUp className="w-5 h-5 text-[#6B7280] flex-shrink-0" />
              : <ChevronDown className="w-5 h-5 text-[#6B7280] flex-shrink-0" />}
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
                  {scheme.eligibilityCriteria.map((criteria, index) => {
                    const icon = criteria.met === true ? '✅' : criteria.met === 'warning' ? '⚠️' : '❌';
                    const textColor = criteria.met === true
                      ? 'text-[#1C1C1E]'
                      : criteria.met === 'warning'
                        ? 'text-[#FB923C]'
                        : 'text-[#6B7280]';
                    return (
                      <div key={index} className="flex items-start gap-2">
                        <span className="mt-0.5 text-[14px]">{icon}</span>
                        <span className={`text-[13px] ${textColor}`}>
                          {getText(criteria.textEn, criteria.textHi, criteria.textMr)}
                        </span>
                      </div>
                    );
                  })}
                  <div className="bg-[#FFF4E6] border border-[#FB923C]/40 rounded-2xl p-3 mt-3 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-[#FB923C] mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-[12px] text-[#FB923C] font-medium">
                        {getText('Update profile for accurate eligibility', 'सटीक पात्रता के लिए प्रोफ़ाइल अपडेट करें', 'अचूक पात्रतेसाठी प्रोफाइल अपडेट करा')}
                      </p>
                      <button onClick={() => navigate('/profile')} className="text-[#FB923C] text-[12px] font-semibold mt-1 underline">
                        {getText('Update Profile →', 'प्रोफ़ाइल अपडेट करें →', 'प्रोफाइल अपडेट करा →')}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ── Required Documents ───────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.08 }}
          className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100"
        >
          <button onClick={() => toggleSection('documents')} className="w-full flex items-center justify-between">
            <h2 className="font-bold text-[15px] text-[#1C1C1E]">
              {getText('Required Documents', 'आवश्यक दस्तावेज़', 'आवश्यक कागदपत्रे')}
            </h2>
            {expandedSection === 'documents'
              ? <ChevronUp className="w-5 h-5 text-[#6B7280]" />
              : <ChevronDown className="w-5 h-5 text-[#6B7280]" />}
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
                  {scheme.documents.map((doc, index) => {
                    const uploaded = userData.documents?.find((d) => d.id === doc.id)?.status === 'uploaded';
                    return (
                      <div key={index} className="flex items-center gap-3 py-1">
                        <div className={`w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 ${uploaded ? 'bg-[#97BC62]' : 'border-2 border-gray-300'}`}>
                          {uploaded && <span className="text-white text-[10px] font-bold">✓</span>}
                        </div>
                        <span className={`text-[13px] flex-1 ${uploaded ? 'text-[#1C1C1E]' : 'text-[#6B7280]'}`}>
                          {getText(doc.nameEn, doc.nameHi, doc.nameMr)}
                        </span>
                        <span className={`text-[11px] font-medium ${uploaded ? 'text-[#97BC62]' : 'text-[#F5A623]'}`}>
                          {uploaded ? getText('Uploaded', 'अपलोडेड', 'अपलोड केले') : getText('Upload', 'अपलोड करें', 'अपलोड करा')}
                        </span>
                      </div>
                    );
                  })}
                  <button
                    onClick={() => navigate('/profile')}
                    className="w-full mt-3 py-2.5 border border-[#F5A623] text-[#F5A623] rounded-2xl font-semibold text-[13px] flex items-center justify-center gap-1"
                  >
                    <FileText className="w-4 h-4" />
                    {getText('Upload Documents', 'दस्तावेज़ अपलोड करें', 'कागदपत्रे अपलोड करा')}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ── How to Apply ─────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.1 }}
          className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100"
        >
          <button onClick={() => toggleSection('how-to-apply')} className="w-full flex items-center justify-between">
            <h2 className="font-bold text-[15px] text-[#1C1C1E]">
              {getText('How to Apply', 'आवेदन कैसे करें', 'अर्ज कसा करावा')}
            </h2>
            {expandedSection === 'how-to-apply'
              ? <ChevronUp className="w-5 h-5 text-[#6B7280]" />
              : <ChevronDown className="w-5 h-5 text-[#6B7280]" />}
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
                  {scheme.steps.map((step) => (
                    <div key={step.step} className="flex gap-3 items-start">
                      <div className="w-8 h-8 rounded-full bg-[#F5A623] text-white flex items-center justify-center font-bold text-[14px] flex-shrink-0">
                        {step.step}
                      </div>
                      <div className="flex-1">
                        <p className="text-[14px] text-[#1C1C1E] font-medium">
                          {getText(step.textEn, step.textHi, step.textMr)}
                        </p>
                        <p className="text-[12px] text-[#6B7280]">
                          ⏱ {getText(step.timeEn, step.timeHi, step.timeMr)}
                        </p>
                      </div>
                    </div>
                  ))}
                  {/* Apply portal link */}
                  <a
                    href={scheme.applyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full mt-2 py-2.5 border border-[#2D6A2D] text-[#2D6A2D] rounded-2xl font-semibold text-[13px] flex items-center justify-center gap-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    {getText('Official Portal', 'आधिकारिक पोर्टल', 'अधिकृत पोर्टल')}
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ── Benefits & Disbursement ──────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.12 }}
          className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 mb-4"
        >
          <h2 className="font-bold text-[15px] text-[#1C1C1E] mb-3">
            {getText('Benefits & Disbursement', 'लाभ और भुगतान', 'लाभ आणि वितरण')}
          </h2>
          <p className="text-[13px] text-[#1C1C1E] mb-3 leading-relaxed">
            {getText(scheme.benefitEn, scheme.benefitHi, scheme.benefitMr)}
          </p>
          <div className="bg-[#F0F7F0] rounded-2xl p-3 mb-2 flex items-start gap-2">
            <span className="text-[16px] mt-0.5">💳</span>
            <p className="text-[12px] text-[#2D6A2D] font-medium leading-relaxed">
              {getText(scheme.disbursementEn, scheme.disbursementHi, scheme.disbursementMr)}
            </p>
          </div>
        </motion.div>

      </div>

      {/* ── Sticky Bottom CTA ────────────────────────────────────────────────── */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-200 p-4 flex gap-3 z-20">
        <button
          onClick={() => {/* bookmark */ }}
          className="flex-1 py-3 border border-gray-300 text-[#1C1C1E] rounded-2xl font-medium text-[13px] flex items-center justify-center gap-1"
        >
          💾 {getText('Save', 'सेव करें', 'सेव्ह करा')}
        </button>
        <button
          onClick={() => navigate(`/apply/${id}`)}
          className="flex-[2] py-3 bg-[#F5A623] text-white rounded-2xl font-bold text-[15px] shadow-lg shadow-[#F5A623]/30"
        >
          {getText('Apply Now', 'अभी आवेदन करें', 'आता अर्ज करा')}
        </button>
      </div>
    </div>
  );
}

