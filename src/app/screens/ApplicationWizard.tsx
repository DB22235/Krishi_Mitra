import { useState, useCallback, useMemo, useRef } from 'react';
import {
  ArrowLeft,
  Camera,
  Upload,
  Folder,
  CheckCircle,
  Copy,
  AlertCircle,
  Mic,
  Eye,
  FileText,
  User,
  Building2,
  MapPin,
  Shield,
  Share2,
  Download,
  Home,
  ChevronRight,
  X,
  Trash2,
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../../context/LanguageContext';
import { useUser } from '../../context/UserContext';

// ─── Document interface ─────────────────────────────────────────
interface DocumentItem {
  key: string;
  label: string;
  labelHi: string;
  labelMr: string;
  uploaded: boolean;
  quality: 'good' | 'poor' | '';
  required: boolean;
  autoExtracted?: Record<string, string>;
  autoExtractedHi?: Record<string, string>;
  autoExtractedMr?: Record<string, string>;
  icon: string;
  profileDocId?: string;
  file?: string;
}

// ─── Form field interface ───────────────────────────────────────
interface FormField {
  key: string;
  label: string;
  labelHi: string;
  labelMr: string;
  value: string;
  autoFilled: boolean;
  editable: boolean;
  type: 'text' | 'date' | 'number' | 'tel';
  placeholder: string;
  placeholderHi: string;
  placeholderMr: string;
  voiceEnabled?: boolean;
  halfWidth?: boolean;
}

// ─── Step type ──────────────────────────────────────────────────
type WizardStep = 'documents' | 'form' | 'review' | 'success';

// ─── Scheme names map ───────────────────────────────────────────
const schemeNames: Record<string, { en: string; hi: string; mr: string; logo: string }> = {
  'pm-kisan': {
    en: 'PM-Kisan Samman Nidhi',
    hi: 'प्रधानमंत्री किसान सम्मान निधि',
    mr: 'प्रधानमंत्री किसान सन्मान निधी',
    logo: '🏛️'
  },
  pmfby: {
    en: 'PM Fasal Bima Yojana',
    hi: 'प्रधानमंत्री फसल बीमा योजना',
    mr: 'प्रधानमंत्री पीक विमा योजना',
    logo: '🌾'
  },
  'soil-health': {
    en: 'Soil Health Card',
    hi: 'मृदा स्वास्थ्य कार्ड',
    mr: 'मृदा आरोग्य कार्ड',
    logo: '🧪'
  },
  kcc: {
    en: 'Kisan Credit Card',
    hi: 'किसान क्रेडिट कार्ड',
    mr: 'किसान क्रेडिट कार्ड',
    logo: '💳'
  },
  'pm-kusum': {
    en: 'PM-KUSUM Solar Pump',
    hi: 'पीएम कुसुम सोलर पंप',
    mr: 'पीएम कुसुम सोलर पंप',
    logo: '☀️'
  },
};

// ─── Translations ───────────────────────────────────────────────
const translations = {
  uploadDocuments: { en: 'Upload Documents', hi: 'दस्तावेज़ अपलोड करें', mr: 'कागदपत्रे अपलोड करा' },
  documentsUploaded: {
    en: (uploaded: number, total: number) => `${uploaded}/${total} uploaded • Upload all required documents`,
    hi: (uploaded: number, total: number) => `${uploaded}/${total} दस्तावेज़ अपलोड हुए • आवश्यक दस्तावेज़ अपलोड करें`,
    mr: (uploaded: number, total: number) => `${uploaded}/${total} अपलोड झाले • सर्व आवश्यक कागदपत्रे अपलोड करा`
  },
  documentsPreFilled: {
    en: (count: number) => `${count} documents pre-filled from your profile`,
    hi: (count: number) => `प्रोफ़ाइल से ${count} दस्तावेज़ पहले से अपलोड हैं`,
    mr: (count: number) => `तुमच्या प्रोफाइलमधून ${count} कागदपत्रे आधीच भरलेली आहेत`
  },
  profileComplete: {
    en: (percent: number) => `Profile ${percent}% complete`,
    hi: (percent: number) => `प्रोफ़ाइल ${percent}% पूर्ण`,
    mr: (percent: number) => `प्रोफाइल ${percent}% पूर्ण`
  },
  profile: { en: 'Profile', hi: 'प्रोफ़ाइल', mr: 'प्रोफाइल' },
  uploadProgress: { en: 'Upload Progress', hi: 'अपलोड प्रगति', mr: 'अपलोड प्रगती' },
  required: { en: 'Required', hi: 'आवश्यक', mr: 'आवश्यक' },
  remove: { en: 'Remove', hi: 'हटाएं', mr: 'काढा' },
  change: { en: 'Change', hi: 'बदलें', mr: 'बदला' },
  done: { en: 'Done', hi: 'अपलोड', mr: 'पूर्ण' },
  camera: { en: 'Camera', hi: 'फ़ोटो लें', mr: 'कॅमेरा' },
  gallery: { en: 'Gallery', hi: 'गैलरी', mr: 'गॅलरी' },
  fillApplicationForm: { en: 'Fill Application Form', hi: 'आवेदन फॉर्म भरें', mr: 'अर्ज फॉर्म भरा' },
  fillEmptyFields: {
    en: 'Fill empty fields, rest auto-filled from your profile',
    hi: 'खाली फ़ील्ड भरें, बाकी प्रोफ़ाइल से ऑटो-फिल हुए हैं',
    mr: 'रिकामी फील्ड भरा, बाकी प्रोफाइलमधून ऑटो-फिल झाले आहेत'
  },
  autoFilledFields: {
    en: (filled: number, total: number) => `Auto-filled ${filled}/${total} fields from profile 🎉`,
    hi: (filled: number, total: number) => `प्रोफ़ाइल से ${filled}/${total} फ़ील्ड ऑटो-फिल हुए 🎉`,
    mr: (filled: number, total: number) => `प्रोफाइलमधून ${filled}/${total} फील्ड ऑटो-फिल झाले 🎉`
  },
  completeProfile: {
    en: 'Complete your profile to auto-fill more fields',
    hi: 'प्रोफ़ाइल पूरा करके और फ़ील्ड ऑटो-फिल करवाएं',
    mr: 'अधिक फील्ड ऑटो-फिल करण्यासाठी तुमचे प्रोफाइल पूर्ण करा'
  },
  update: { en: 'Update', hi: 'अपडेट करें', mr: 'अपडेट करा' },
  fromProfile: { en: 'Profile', hi: 'प्रोफ़ाइल', mr: 'प्रोफाइल' },
  fill: { en: 'Fill', hi: 'भरें', mr: 'भरा' },
  voiceInput: { en: 'Voice input', hi: 'बोलकर भरें', mr: 'आवाजाने भरा' },
  reviewApplication: { en: 'Review Application', hi: 'आवेदन की समीक्षा करें', mr: 'अर्जाचे पुनरावलोकन करा' },
  verifyBeforeSubmit: {
    en: 'Verify all information before submitting',
    hi: 'सभी जानकारी जांचें और जमा करें',
    mr: 'सबमिट करण्यापूर्वी सर्व माहिती तपासा'
  },
  applicationComplete: {
    en: (percent: number) => `Application ${percent}% complete`,
    hi: (percent: number) => `आवेदन ${percent}% पूरा है`,
    mr: (percent: number) => `अर्ज ${percent}% पूर्ण`
  },
  applicationForm: { en: 'Application Form', hi: 'आवेदन फॉर्म', mr: 'अर्ज फॉर्म' },
  personalInfo: { en: 'Personal Information', hi: 'व्यक्तिगत जानकारी', mr: 'वैयक्तिक माहिती' },
  landLocation: { en: 'Land & Location', hi: 'भूमि एवं स्थान', mr: 'जमीन आणि स्थान' },
  bankDetails: { en: 'Bank Details', hi: 'बैंक विवरण', mr: 'बँक तपशील' },
  documents: { en: 'Documents', hi: 'दस्तावेज़', mr: 'कागदपत्रे' },
  edit: { en: 'Edit', hi: 'बदलें', mr: 'संपादित करा' },
  notFilled: { en: 'Not filled', hi: 'भरा नहीं', mr: 'भरलेले नाही' },
  fromProfileTag: { en: 'From profile', hi: 'प्रोफ़ाइल से', mr: 'प्रोफाइलमधून' },
  missing: { en: 'Missing', hi: 'गायब', mr: 'गहाळ' },
  disclaimer: {
    en: 'By submitting, I confirm all information is correct. Providing false information may lead to application rejection.',
    hi: 'जमा करने पर, मैं पुष्टि करता/करती हूं कि सभी जानकारी सही है। गलत जानकारी देने पर आवेदन रद्द हो सकता है।',
    mr: 'सबमिट करून, मी सर्व माहिती बरोबर असल्याची पुष्टी करतो. चुकीची माहिती दिल्यास अर्ज नाकारला जाऊ शकतो.'
  },
  preview: { en: 'Preview', hi: 'प्रीव्यू', mr: 'पूर्वावलोकन' },
  submitNow: { en: 'Submit Now', hi: 'अभी जमा करें', mr: 'आता सबमिट करा' },
  applicationSubmitted: { en: 'Application Submitted!', hi: 'आवेदन सफलतापूर्वक जमा हुआ!', mr: 'अर्ज यशस्वीरित्या सबमिट झाला!' },
  applicationRecorded: {
    en: (scheme: string) => `Your application for ${scheme} has been recorded`,
    hi: (scheme: string) => `${scheme} के लिए आपका आवेदन दर्ज हो गया है`,
    mr: (scheme: string) => `${scheme} साठी तुमचा अर्ज नोंदवला गेला आहे`
  },
  referenceNumber: { en: 'Reference Number', hi: 'संदर्भ संख्या', mr: 'संदर्भ क्रमांक' },
  copiedToClipboard: { en: 'Copied to clipboard!', hi: 'कॉपी हो गया!', mr: 'कॉपी झाले!' },
  applicant: { en: 'Applicant', hi: 'आवेदक', mr: 'अर्जदार' },
  mobile: { en: 'Mobile', hi: 'मोबाइल', mr: 'मोबाइल' },
  account: { en: 'Account', hi: 'खाता', mr: 'खाते' },
  estimatedTime: { en: 'Estimated: 15 working days', hi: 'अनुमानित समय: 15 कार्य दिवस', mr: 'अंदाजित: 15 कार्य दिवस' },
  estimatedProcessing: { en: 'Estimated processing time', hi: 'प्रसंस्करण का अनुमानित समय', mr: 'अंदाजित प्रक्रिया वेळ' },
  smsConfirmation: { en: 'SMS Confirmation Sent', hi: 'SMS पुष्टि भेजी गई', mr: 'SMS पुष्टी पाठवली' },
  sentTo: { en: 'Sent to', hi: 'आपके', mr: 'पाठवले' },
  toRegisteredNumber: { en: 'To your registered number', hi: 'आपके रजिस्टर्ड नंबर पर', mr: 'तुमच्या नोंदणीकृत क्रमांकावर' },
  nextSteps: { en: 'Next Steps', hi: 'अगला कदम', mr: 'पुढील पावले' },
  trackInApplications: {
    en: 'Track status in "My Applications" section',
    hi: 'आवेदन की स्थिति "मेरे आवेदन" में ट्रैक करें',
    mr: '"माझे अर्ज" विभागात स्थिती ट्रॅक करा'
  },
  trackApplication: { en: 'Track Application', hi: 'ट्रैक करें', mr: 'अर्ज ट्रॅक करा' },
  goHome: { en: 'Go Home', hi: 'होम', mr: 'मुख्यपृष्ठ' },
  downloadReceipt: { en: 'Download Receipt', hi: 'रसीद डाउनलोड करें', mr: 'पावती डाउनलोड करा' },
  applicationPreview: { en: 'Application Preview', hi: 'आवेदन प्रीव्यू', mr: 'अर्ज पूर्वावलोकन' },
  aadhaar: { en: 'Aadhaar:', hi: 'आधार:', mr: 'आधार:' },
  closePreview: { en: 'Close Preview', hi: 'बंद करें', mr: 'पूर्वावलोकन बंद करा' },
  step: {
    en: (current: number, total: number, name: string) => `Step ${current}/${total} — ${name}`,
    hi: (current: number, total: number, name: string) => `चरण ${current}/${total} — ${name}`,
    mr: (current: number, total: number, name: string) => `पाऊल ${current}/${total} — ${name}`
  },
  back: { en: 'Back', hi: 'पीछे', mr: 'मागे' },
  continue: { en: 'Continue', hi: 'आगे बढ़ें', mr: 'पुढे चला' },
  documentsRemaining: {
    en: (count: number) => `${count} documents remaining`,
    hi: (count: number) => `${count} दस्तावेज़ बाकी हैं`,
    mr: (count: number) => `${count} कागदपत्रे बाकी आहेत`
  },
  fillRequiredFields: { en: 'Please fill all required fields', hi: 'सभी खाली फ़ील्ड भरें', mr: 'कृपया सर्व आवश्यक फील्ड भरा' },
};

// ─── Progress steps ─────────────────────────────────────────────
const progressStepsData = [
  { en: 'Documents', hi: 'दस्तावेज़', mr: 'कागदपत्रे' },
  { en: 'Details', hi: 'विवरण', mr: 'तपशील' },
  { en: 'Review', hi: 'समीक्षा', mr: 'पुनरावलोकन' },
  { en: 'Submit', hi: 'जमा', mr: 'सबमिट' },
];

export function ApplicationWizard() {
  const navigate = useNavigate();
  const { schemeId } = useParams();
  const { language } = useLanguage();
  const { userData, getProfileCompletion } = useUser();
  const isHindi = language === 'hi';
  const isMarathi = language === 'mr';

  const scheme = schemeNames[schemeId || 'pm-kisan'] || schemeNames['pm-kisan'];
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeUploadKey, setActiveUploadKey] = useState('');

  // ─── Translation helper ───────────────────────────────────
  const t = useCallback((key: keyof typeof translations) => {
    const translation = translations[key];
    if (typeof translation === 'object' && 'en' in translation) {
      if (isMarathi && 'mr' in translation) return translation.mr;
      if (isHindi && 'hi' in translation) return translation.hi;
      return translation.en;
    }
    return '';
  }, [isHindi, isMarathi]);

  // Helper to get scheme name
  const getSchemeName = useCallback(() => {
    if (isMarathi) return scheme.mr;
    if (isHindi) return scheme.hi;
    return scheme.en;
  }, [isHindi, isMarathi, scheme]);

  // Helper to get progress step name
  const getProgressStepName = useCallback((index: number) => {
    const step = progressStepsData[index];
    if (isMarathi) return step.mr;
    if (isHindi) return step.hi;
    return step.en;
  }, [isHindi, isMarathi]);

  // ─── State ──────────────────────────────────────────────────
  const [currentStep, setCurrentStep] = useState<WizardStep>('documents');
  const [copiedRef, setCopiedRef] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // ─── Helper: mask aadhaar ─────────────────────────────────
  const maskAadhaar = (aadhaar: string) => {
    if (!aadhaar) return '';
    const cleaned = aadhaar.replace(/\s/g, '');
    if (cleaned.length >= 8) {
      return `XXXX-XXXX-${cleaned.slice(-4)}`;
    }
    return aadhaar;
  };

  // ─── Helper: mask bank account ────────────────────────────
  const maskBankAccount = (account: string) => {
    if (!account) return '';
    if (account.length >= 4) {
      return `XXXXXXX${account.slice(-4)}`;
    }
    return account;
  };

  // ─── Helper: find profile doc status ──────────────────────
  const getProfileDocStatus = (docId: string) => {
    const doc = userData.documents.find((d) => d.id === docId);
    return doc ? { uploaded: doc.status === 'uploaded', file: doc.file } : { uploaded: false, file: undefined };
  };

  // ─── Helper: get gender display ───────────────────────────
  const getGenderDisplay = useCallback(() => {
    const map: Record<string, { en: string; hi: string; mr: string }> = {
      Male: { en: 'Male', hi: 'पुरुष', mr: 'पुरुष' },
      Female: { en: 'Female', hi: 'महिला', mr: 'स्त्री' },
      Other: { en: 'Other', hi: 'अन्य', mr: 'इतर' },
    };
    if (isMarathi) return map[userData.gender]?.mr || '';
    if (isHindi) return map[userData.gender]?.hi || '';
    return map[userData.gender]?.en || '';
  }, [isHindi, isMarathi, userData.gender]);

  // ─── Helper: get ownership display ────────────────────────
  const getOwnershipDisplay = useCallback(() => {
    const map: Record<string, { en: string; hi: string; mr: string }> = {
      owner: { en: 'Owner', hi: 'मालिक', mr: 'मालक' },
      tenant: { en: 'Tenant', hi: 'किरायेदार', mr: 'भाडेकरू' },
      sharecropper: { en: 'Sharecropper', hi: 'बटाईदार', mr: 'वाटेकरी' },
    };
    if (isMarathi) return map[userData.landOwnership]?.mr || '';
    if (isHindi) return map[userData.landOwnership]?.hi || '';
    return map[userData.landOwnership]?.en || '';
  }, [isHindi, isMarathi, userData.landOwnership]);

  // ─── Initialize documents from profile ────────────────────
  const aadhaarDoc = getProfileDocStatus('aadhaar');
  const landDoc = getProfileDocStatus('land-records');
  const bankDoc = getProfileDocStatus('bank-passbook');
  const photoDoc = getProfileDocStatus('photo');

  const [documents, setDocuments] = useState<DocumentItem[]>([
    {
      key: 'aadhaar',
      label: 'Aadhaar Card',
      labelHi: 'आधार कार्ड',
      labelMr: 'आधार कार्ड',
      uploaded: aadhaarDoc.uploaded,
      quality: aadhaarDoc.uploaded ? 'good' : '',
      required: true,
      profileDocId: 'aadhaar',
      file: aadhaarDoc.file,
      autoExtracted: userData.name && userData.aadhaar
        ? { Name: userData.name, Aadhaar: maskAadhaar(userData.aadhaar) }
        : undefined,
      autoExtractedHi: userData.name && userData.aadhaar
        ? { नाम: userData.name, आधार: maskAadhaar(userData.aadhaar) }
        : undefined,
      autoExtractedMr: userData.name && userData.aadhaar
        ? { नाव: userData.name, आधार: maskAadhaar(userData.aadhaar) }
        : undefined,
      icon: '🪪',
    },
    {
      key: 'landRecords',
      label: 'Land Records (7/12)',
      labelHi: 'भूमि अभिलेख (7/12)',
      labelMr: 'जमीन नोंदी (7/12)',
      uploaded: landDoc.uploaded,
      quality: landDoc.uploaded ? 'good' : '',
      required: true,
      profileDocId: 'land-records',
      file: landDoc.file,
      autoExtracted: landDoc.uploaded && userData.landSize > 0
        ? { 'Land Size': `${userData.landSize} ${userData.landUnit}`, Ownership: getOwnershipDisplay() }
        : undefined,
      autoExtractedHi: landDoc.uploaded && userData.landSize > 0
        ? { 'भूमि आकार': `${userData.landSize} ${userData.landUnit}`, स्वामित्व: getOwnershipDisplay() }
        : undefined,
      autoExtractedMr: landDoc.uploaded && userData.landSize > 0
        ? { 'जमीन क्षेत्र': `${userData.landSize} ${userData.landUnit}`, मालकी: getOwnershipDisplay() }
        : undefined,
      icon: '📜',
    },
    {
      key: 'bankPassbook',
      label: 'Bank Passbook',
      labelHi: 'बैंक पासबुक',
      labelMr: 'बँक पासबुक',
      uploaded: bankDoc.uploaded,
      quality: bankDoc.uploaded ? 'good' : '',
      required: true,
      profileDocId: 'bank-passbook',
      file: bankDoc.file,
      autoExtracted: userData.bankAccount
        ? { 'A/C': maskBankAccount(userData.bankAccount), IFSC: userData.ifscCode || '', Bank: userData.bankName || '' }
        : undefined,
      autoExtractedHi: userData.bankAccount
        ? { खाता: maskBankAccount(userData.bankAccount), IFSC: userData.ifscCode || '', बैंक: userData.bankName || '' }
        : undefined,
      autoExtractedMr: userData.bankAccount
        ? { खाते: maskBankAccount(userData.bankAccount), IFSC: userData.ifscCode || '', बँक: userData.bankName || '' }
        : undefined,
      icon: '🏦',
    },
    {
      key: 'photo',
      label: 'Passport Photo',
      labelHi: 'पासपोर्ट फ़ोटो',
      labelMr: 'पासपोर्ट फोटो',
      uploaded: photoDoc.uploaded || !!userData.profileImage,
      quality: (photoDoc.uploaded || !!userData.profileImage) ? 'good' : '',
      required: true,
      profileDocId: 'photo',
      file: photoDoc.file || userData.profileImage || undefined,
      icon: '📷',
    },
  ]);

  // Helper to get document label
  const getDocLabel = useCallback((doc: DocumentItem) => {
    if (isMarathi) return doc.labelMr;
    if (isHindi) return doc.labelHi;
    return doc.label;
  }, [isHindi, isMarathi]);

  // Helper to get auto extracted data
  const getAutoExtracted = useCallback((doc: DocumentItem) => {
    if (isMarathi && doc.autoExtractedMr) return doc.autoExtractedMr;
    if (isHindi && doc.autoExtractedHi) return doc.autoExtractedHi;
    return doc.autoExtracted;
  }, [isHindi, isMarathi]);

  // ─── Initialize form fields from profile ──────────────────
  const [formFields, setFormFields] = useState<FormField[]>(() => {
    const hasName = !!userData.name;
    const hasAge = !!userData.age;
    const hasAadhaar = !!userData.aadhaar;
    const hasMobile = !!userData.mobile;
    const hasBank = !!userData.bankAccount;
    const hasIFSC = !!userData.ifscCode;
    const hasState = !!userData.state;
    const hasDistrict = !!userData.district;

    return [
      {
        key: 'name',
        label: 'Full Name',
        labelHi: 'पूरा नाम',
        labelMr: 'पूर्ण नाव',
        value: userData.name || '',
        autoFilled: hasName,
        editable: !hasName,
        type: 'text' as const,
        placeholder: 'Enter your full name',
        placeholderHi: 'अपना पूरा नाम दर्ज करें',
        placeholderMr: 'तुमचे पूर्ण नाव प्रविष्ट करा',
      },
      {
        key: 'fatherName',
        label: "Father's / Spouse Name",
        labelHi: 'पिता / पति का नाम',
        labelMr: 'वडील / जोडीदाराचे नाव',
        value: '',
        autoFilled: false,
        editable: true,
        type: 'text' as const,
        placeholder: "Enter father's or spouse name",
        placeholderHi: 'पिता या पति का नाम दर्ज करें',
        placeholderMr: 'वडील किंवा जोडीदाराचे नाव प्रविष्ट करा',
      },
      {
        key: 'age',
        label: 'Age',
        labelHi: 'उम्र',
        labelMr: 'वय',
        value: userData.age ? `${userData.age}` : '',
        autoFilled: hasAge,
        editable: !hasAge,
        type: 'number' as const,
        placeholder: 'e.g. 35',
        placeholderHi: 'जैसे 35',
        placeholderMr: 'उदा. 35',
        halfWidth: true,
      },
      {
        key: 'gender',
        label: 'Gender',
        labelHi: 'लिंग',
        labelMr: 'लिंग',
        value: getGenderDisplay(),
        autoFilled: !!userData.gender,
        editable: !userData.gender,
        type: 'text' as const,
        placeholder: 'Male / Female / Other',
        placeholderHi: 'पुरुष / महिला / अन्य',
        placeholderMr: 'पुरुष / स्त्री / इतर',
        halfWidth: true,
      },
      {
        key: 'mobile',
        label: 'Mobile Number',
        labelHi: 'मोबाइल नंबर',
        labelMr: 'मोबाइल क्रमांक',
        value: userData.mobile ? `+91 ${userData.mobile}` : '',
        autoFilled: hasMobile,
        editable: !hasMobile,
        type: 'tel' as const,
        placeholder: '+91 XXXXXXXXXX',
        placeholderHi: '+91 XXXXXXXXXX',
        placeholderMr: '+91 XXXXXXXXXX',
        halfWidth: true,
      },
      {
        key: 'aadhaar',
        label: 'Aadhaar Number',
        labelHi: 'आधार नंबर',
        labelMr: 'आधार क्रमांक',
        value: userData.aadhaar ? maskAadhaar(userData.aadhaar) : '',
        autoFilled: hasAadhaar,
        editable: !hasAadhaar,
        type: 'text' as const,
        placeholder: 'XXXX-XXXX-XXXX',
        placeholderHi: 'XXXX-XXXX-XXXX',
        placeholderMr: 'XXXX-XXXX-XXXX',
        halfWidth: true,
      },
      {
        key: 'state',
        label: 'State',
        labelHi: 'राज्य',
        labelMr: 'राज्य',
        value: userData.state || '',
        autoFilled: hasState,
        editable: !hasState,
        type: 'text' as const,
        placeholder: 'Enter state',
        placeholderHi: 'राज्य दर्ज करें',
        placeholderMr: 'राज्य प्रविष्ट करा',
        halfWidth: true,
      },
      {
        key: 'district',
        label: 'District',
        labelHi: 'जिला',
        labelMr: 'जिल्हा',
        value: userData.district || '',
        autoFilled: hasDistrict,
        editable: !hasDistrict,
        type: 'text' as const,
        placeholder: 'Enter district',
        placeholderHi: 'जिला दर्ज करें',
        placeholderMr: 'जिल्हा प्रविष्ट करा',
        halfWidth: true,
      },
      {
        key: 'village',
        label: 'Village / Gram',
        labelHi: 'गाँव / ग्राम',
        labelMr: 'गाव / ग्राम',
        value: '',
        autoFilled: false,
        editable: true,
        type: 'text' as const,
        placeholder: 'Enter village name',
        placeholderHi: 'गाँव का नाम दर्ज करें',
        placeholderMr: 'गावाचे नाव प्रविष्ट करा',
      },
      {
        key: 'landSize',
        label: 'Land Area',
        labelHi: 'भूमि क्षेत्र',
        labelMr: 'जमीन क्षेत्र',
        value: userData.landSize > 0 ? `${userData.landSize} ${userData.landUnit}` : '',
        autoFilled: userData.landSize > 0,
        editable: !(userData.landSize > 0),
        type: 'text' as const,
        placeholder: 'e.g. 2.5 Hectares',
        placeholderHi: 'जैसे 2.5 हेक्टेयर',
        placeholderMr: 'उदा. 2.5 हेक्टर',
        halfWidth: true,
      },
      {
        key: 'ownership',
        label: 'Ownership Type',
        labelHi: 'स्वामित्व प्रकार',
        labelMr: 'मालकी प्रकार',
        value: getOwnershipDisplay(),
        autoFilled: !!userData.landOwnership,
        editable: !userData.landOwnership,
        type: 'text' as const,
        placeholder: 'Owner / Tenant',
        placeholderHi: 'मालिक / किरायेदार',
        placeholderMr: 'मालक / भाडेकरू',
        halfWidth: true,
      },
      {
        key: 'surveyNumber',
        label: 'Land Survey Number',
        labelHi: 'भूमि सर्वे नंबर',
        labelMr: 'जमीन सर्वे क्रमांक',
        value: '',
        autoFilled: false,
        editable: true,
        type: 'text' as const,
        placeholder: 'Enter survey number',
        placeholderHi: 'सर्वे नंबर दर्ज करें',
        placeholderMr: 'सर्वे क्रमांक प्रविष्ट करा',
        voiceEnabled: true,
      },
      {
        key: 'bankName',
        label: 'Bank Name',
        labelHi: 'बैंक का नाम',
        labelMr: 'बँकेचे नाव',
        value: userData.bankName || '',
        autoFilled: !!userData.bankName,
        editable: !userData.bankName,
        type: 'text' as const,
        placeholder: 'e.g. State Bank of India',
        placeholderHi: 'जैसे भारतीय स्टेट बैंक',
        placeholderMr: 'उदा. स्टेट बँक ऑफ इंडिया',
      },
      {
        key: 'bankAccount',
        label: 'Bank Account Number',
        labelHi: 'बैंक खाता संख्या',
        labelMr: 'बँक खाते क्रमांक',
        value: userData.bankAccount ? maskBankAccount(userData.bankAccount) : '',
        autoFilled: hasBank,
        editable: !hasBank,
        type: 'text' as const,
        placeholder: 'XXXXXXXXXXXX',
        placeholderHi: 'XXXXXXXXXXXX',
        placeholderMr: 'XXXXXXXXXXXX',
        halfWidth: true,
      },
      {
        key: 'ifsc',
        label: 'IFSC Code',
        labelHi: 'IFSC कोड',
        labelMr: 'IFSC कोड',
        value: userData.ifscCode || '',
        autoFilled: hasIFSC,
        editable: !hasIFSC,
        type: 'text' as const,
        placeholder: 'SBIN0001234',
        placeholderHi: 'SBIN0001234',
        placeholderMr: 'SBIN0001234',
        halfWidth: true,
      },
    ];
  });

  // Helper to get field label
  const getFieldLabel = useCallback((field: FormField) => {
    if (isMarathi) return field.labelMr;
    if (isHindi) return field.labelHi;
    return field.label;
  }, [isHindi, isMarathi]);

  // Helper to get field placeholder
  const getFieldPlaceholder = useCallback((field: FormField) => {
    if (isMarathi) return field.placeholderMr;
    if (isHindi) return field.placeholderHi;
    return field.placeholder;
  }, [isHindi, isMarathi]);

  // ─── Computed values ────────────────────────────────────────
  const currentStepIndex =
    currentStep === 'documents' ? 0 :
      currentStep === 'form' ? 1 :
        currentStep === 'review' ? 2 : 3;

  const uploadedDocsCount = documents.filter((d) => d.uploaded).length;
  const totalDocsCount = documents.length;
  const allDocsUploaded = uploadedDocsCount === totalDocsCount;

  const autoFilledCount = formFields.filter((f) => f.autoFilled).length;
  const totalFieldsCount = formFields.length;
  const allFieldsFilled = formFields.every((f) => f.value.trim() !== '');
  const profilePercent = getProfileCompletion();

  const completionPercent = useMemo(() => {
    const docScore = (uploadedDocsCount / totalDocsCount) * 50;
    const fieldScore = (formFields.filter((f) => f.value.trim()).length / totalFieldsCount) * 50;
    return Math.round(docScore + fieldScore);
  }, [uploadedDocsCount, totalDocsCount, formFields, totalFieldsCount]);

  // Generate ref number based on scheme
  const refNumber = useMemo(() => {
    const schemeCode = (schemeId || 'pm-kisan').toUpperCase().replace(/-/g, '');
    const random = Math.floor(10000 + Math.random() * 90000);
    return `REF#2026-${schemeCode}-${random}`;
  }, [schemeId]);

  // ─── Handlers ───────────────────────────────────────────────
  const handleDocumentUpload = useCallback((docKey: string) => {
    setDocuments((prev) =>
      prev.map((d) =>
        d.key === docKey ? { ...d, uploaded: true, quality: 'good' } : d
      )
    );
  }, []);

  const handleDocumentRemove = useCallback((docKey: string) => {
    setDocuments((prev) =>
      prev.map((d) =>
        d.key === docKey
          ? { ...d, uploaded: false, quality: '' as const, file: undefined }
          : d
      )
    );
  }, []);

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && activeUploadKey) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setDocuments((prev) =>
          prev.map((d) =>
            d.key === activeUploadKey
              ? { ...d, uploaded: true, quality: 'good' as const, file: reader.result as string }
              : d
          )
        );
      };
      reader.readAsDataURL(file);
    }
    setActiveUploadKey('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, [activeUploadKey]);

  const triggerFileUpload = useCallback((docKey: string) => {
    setActiveUploadKey(docKey);
    fileInputRef.current?.click();
  }, []);

  const handleFieldChange = useCallback((key: string, value: string) => {
    setFormFields((prev) =>
      prev.map((f) => (f.key === key ? { ...f, value } : f))
    );
  }, []);

  const handleCopyRef = useCallback(() => {
    navigator.clipboard?.writeText(refNumber).catch(() => { });
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2000);
  }, [refNumber]);

  const handleShare = useCallback(() => {
    const schemeName = getSchemeName();
    const text = isMarathi
      ? `माझा ${schemeName} अर्ज यशस्वीरित्या सबमिट झाला! संदर्भ: ${refNumber}`
      : isHindi
        ? `मेरा ${schemeName} आवेदन सफलतापूर्वक जमा हुआ! संदर्भ: ${refNumber}`
        : `My ${schemeName} application submitted successfully! Ref: ${refNumber}`;
    if (navigator.share) {
      navigator.share({ title: scheme.en, text }).catch(() => { });
    } else {
      navigator.clipboard?.writeText(text).catch(() => { });
    }
  }, [isHindi, isMarathi, scheme, refNumber, getSchemeName]);

  const goNext = useCallback(() => {
    if (currentStep === 'documents') setCurrentStep('form');
    else if (currentStep === 'form') setCurrentStep('review');
    else if (currentStep === 'review') setCurrentStep('success');
  }, [currentStep]);

  const goBack = useCallback(() => {
    if (currentStep === 'form') setCurrentStep('documents');
    else if (currentStep === 'review') setCurrentStep('form');
    else navigate(-1);
  }, [currentStep, navigate]);

  const canProceed = useMemo(() => {
    if (currentStep === 'documents') return allDocsUploaded;
    if (currentStep === 'form') return allFieldsFilled;
    return true;
  }, [currentStep, allDocsUploaded, allFieldsFilled]);

  // ─── Documents Step ─────────────────────────────────────────
  const renderDocumentsStep = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-4"
    >
      <div className="mb-4">
        <h2 className="font-bold text-[22px] text-[#1C1C1E] mb-1">
          {t('uploadDocuments')}
        </h2>
        <p className="text-[13px] text-[#6B7280]">
          {typeof translations.documentsUploaded[isMarathi ? 'mr' : isHindi ? 'hi' : 'en'] === 'function'
            ? (translations.documentsUploaded[isMarathi ? 'mr' : isHindi ? 'hi' : 'en'] as (u: number, t: number) => string)(uploadedDocsCount, totalDocsCount)
            : ''}
        </p>
      </div>

      {/* Profile data banner */}
      {profilePercent > 0 && (
        <div className="bg-[#97BC62]/10 border border-[#97BC62]/30 rounded-2xl p-3 flex items-center gap-3">
          <div className="w-8 h-8 bg-[#97BC62]/20 rounded-full flex items-center justify-center flex-shrink-0">
            <CheckCircle className="w-4 h-4 text-[#2D6A2D]" />
          </div>
          <div className="flex-1">
            <p className="text-[12px] text-[#2D6A2D] font-medium">
              {typeof translations.documentsPreFilled[isMarathi ? 'mr' : isHindi ? 'hi' : 'en'] === 'function'
                ? (translations.documentsPreFilled[isMarathi ? 'mr' : isHindi ? 'hi' : 'en'] as (c: number) => string)(uploadedDocsCount)
                : ''}
            </p>
            <p className="text-[10px] text-[#6B7280] mt-0.5">
              {typeof translations.profileComplete[isMarathi ? 'mr' : isHindi ? 'hi' : 'en'] === 'function'
                ? (translations.profileComplete[isMarathi ? 'mr' : isHindi ? 'hi' : 'en'] as (p: number) => string)(profilePercent)
                : ''}
            </p>
          </div>
          <button
            onClick={() => navigate('/profile')}
            className="text-[11px] font-semibold text-[#F5A623] underline flex-shrink-0"
          >
            {t('profile')}
          </button>
        </div>
      )}

      {/* Upload Progress */}
      <div className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-[#F5A623]/10 flex items-center justify-center flex-shrink-0">
          <FileText className="w-5 h-5 text-[#F5A623]" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[13px] font-semibold text-[#1C1C1E]">
              {t('uploadProgress')}
            </span>
            <span className="text-[12px] font-bold text-[#F5A623]">
              {uploadedDocsCount}/{totalDocsCount}
            </span>
          </div>
          <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
            <motion.div
              className="bg-[#F5A623] h-full rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(uploadedDocsCount / totalDocsCount) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </div>

      {/* Document Cards */}
      {documents.map((doc, index) => (
        <motion.div
          key={doc.key}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className={`bg-white rounded-2xl p-4 shadow-sm border-2 transition-all ${doc.uploaded
            ? 'border-[#97BC62]'
            : 'border-dashed border-gray-300'
            }`}
        >
          {doc.uploaded ? (
            <div className="flex items-start gap-3">
              <div className="w-14 h-14 bg-[#97BC62]/10 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden">
                {doc.file ? (
                  <img
                    src={doc.file}
                    alt={doc.label}
                    className="w-full h-full object-cover rounded-xl"
                  />
                ) : (
                  <span className="text-[24px]">{doc.icon}</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle className="w-4 h-4 text-[#97BC62] flex-shrink-0" />
                  <h3 className="font-semibold text-[14px] text-[#2D6A2D] truncate">
                    {getDocLabel(doc)}
                  </h3>
                </div>
                {getAutoExtracted(doc) && (
                  <div className="mt-1.5 space-y-0.5">
                    {Object.entries(getAutoExtracted(doc) || {})
                      .filter(([, v]) => v)
                      .map(([k, v]) => (
                        <p key={k} className="text-[11px] text-[#6B7280]">
                          {k}: <span className="font-medium text-[#1C1C1E]">{v}</span>
                        </p>
                      ))}
                  </div>
                )}
                <div className="flex items-center gap-3 mt-2">
                  <button
                    onClick={() => handleDocumentRemove(doc.key)}
                    className="flex items-center gap-1 text-[#F87171] text-[11px] font-medium"
                  >
                    <Trash2 className="w-3 h-3" />
                    {t('remove')}
                  </button>
                  <button
                    onClick={() => triggerFileUpload(doc.key)}
                    className="flex items-center gap-1 text-[#F5A623] text-[11px] font-medium"
                  >
                    <Upload className="w-3 h-3" />
                    {t('change')}
                  </button>
                </div>
              </div>
              <div className="bg-[#97BC62]/10 px-2 py-1 rounded-full flex-shrink-0">
                <span className="text-[10px] font-semibold text-[#2D6A2D]">
                  ✓ {t('done')}
                </span>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[20px]">{doc.icon}</span>
                <h3 className="font-semibold text-[14px] text-[#1C1C1E]">
                  {getDocLabel(doc)}
                </h3>
                {doc.required && (
                  <span className="text-[10px] bg-[#F87171]/10 text-[#F87171] px-2 py-0.5 rounded-full font-medium">
                    {t('required')}
                  </span>
                )}
              </div>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => triggerFileUpload(doc.key)}
                  className="flex flex-col items-center gap-1.5 py-3 bg-[#F7F3EE] rounded-xl hover:bg-[#EDE8E0] active:scale-[0.97] transition-all"
                >
                  <Camera className="w-5 h-5 text-[#2D6A2D]" />
                  <span className="text-[11px] text-[#1C1C1E] font-medium">
                    {t('camera')}
                  </span>
                </button>
                <button
                  onClick={() => triggerFileUpload(doc.key)}
                  className="flex flex-col items-center gap-1.5 py-3 bg-[#F7F3EE] rounded-xl hover:bg-[#EDE8E0] active:scale-[0.97] transition-all"
                >
                  <Folder className="w-5 h-5 text-[#2D6A2D]" />
                  <span className="text-[11px] text-[#1C1C1E] font-medium">
                    {t('gallery')}
                  </span>
                </button>
                <button
                  onClick={() => handleDocumentUpload(doc.key)}
                  className="flex flex-col items-center gap-1.5 py-3 bg-[#F7F3EE] rounded-xl hover:bg-[#EDE8E0] active:scale-[0.97] transition-all"
                >
                  <Upload className="w-5 h-5 text-[#2D6A2D]" />
                  <span className="text-[11px] text-[#1C1C1E] font-medium">
                    DigiLocker
                  </span>
                </button>
              </div>
            </>
          )}
        </motion.div>
      ))}
    </motion.div>
  );

  // ─── Form Step ──────────────────────────────────────────────
  const renderFormStep = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-4"
    >
      <div className="mb-2">
        <h2 className="font-bold text-[22px] text-[#1C1C1E] mb-1">
          {t('fillApplicationForm')}
        </h2>
        <p className="text-[13px] text-[#6B7280]">
          {t('fillEmptyFields')}
        </p>
      </div>

      {/* Auto-fill banner */}
      <div className="bg-[#97BC62]/10 border border-[#97BC62]/30 rounded-2xl p-3 flex items-center gap-3">
        <div className="w-8 h-8 bg-[#97BC62]/20 rounded-full flex items-center justify-center flex-shrink-0">
          <CheckCircle className="w-4 h-4 text-[#2D6A2D]" />
        </div>
        <div className="flex-1">
          <p className="text-[13px] text-[#2D6A2D] font-medium">
            {typeof translations.autoFilledFields[isMarathi ? 'mr' : isHindi ? 'hi' : 'en'] === 'function'
              ? (translations.autoFilledFields[isMarathi ? 'mr' : isHindi ? 'hi' : 'en'] as (f: number, t: number) => string)(autoFilledCount, totalFieldsCount)
              : ''}
          </p>
        </div>
        <button
          onClick={() => navigate('/profile')}
          className="text-[11px] font-semibold text-[#F5A623] underline flex-shrink-0"
        >
          {t('profile')}
        </button>
      </div>

      {/* Form Fields */}
      <div className="space-y-3">
        {(() => {
          const rendered: JSX.Element[] = [];
          let i = 0;
          while (i < formFields.length) {
            const field = formFields[i];
            const nextField = formFields[i + 1];

            if (field.halfWidth && nextField?.halfWidth) {
              rendered.push(
                <div key={field.key} className="grid grid-cols-2 gap-3">
                  {renderField(field)}
                  {renderField(nextField)}
                </div>
              );
              i += 2;
            } else {
              rendered.push(
                <div key={field.key}>{renderField(field)}</div>
              );
              i += 1;
            }
          }
          return rendered;
        })()}
      </div>

      {/* Incomplete profile hint */}
      {profilePercent < 80 && (
        <div className="bg-[#F5A623]/10 border border-[#F5A623]/30 rounded-2xl p-3 flex items-center gap-3 mt-4">
          <AlertCircle className="w-5 h-5 text-[#F5A623] flex-shrink-0" />
          <div className="flex-1">
            <p className="text-[12px] text-[#1C1C1E] font-medium">
              {t('completeProfile')}
            </p>
          </div>
          <button
            onClick={() => navigate('/profile')}
            className="text-[11px] font-bold text-[#F5A623] bg-[#F5A623]/10 px-3 py-1.5 rounded-full flex-shrink-0"
          >
            {t('update')}
          </button>
        </div>
      )}
    </motion.div>
  );

  function renderField(field: FormField) {
    return (
      <div>
        <label className="block text-[12px] text-[#6B7280] mb-1.5 font-medium">
          {getFieldLabel(field)}
        </label>
        <div className="relative">
          <input
            type={field.type}
            value={field.value}
            readOnly={!field.editable}
            onChange={(e) => field.editable && handleFieldChange(field.key, e.target.value)}
            placeholder={getFieldPlaceholder(field)}
            className={`w-full px-4 py-3 rounded-xl text-[14px] outline-none transition-all ${field.editable
              ? 'bg-white border-2 border-[#F5A623] focus:ring-2 focus:ring-[#F5A623]/30 text-[#1C1C1E]'
              : 'bg-gray-50 border border-gray-100 text-[#1C1C1E]'
              }`}
          />
          {field.autoFilled && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <span className="text-[9px] bg-[#97BC62] text-white px-2 py-0.5 rounded-full font-semibold">
                ✓ {t('fromProfile')}
              </span>
            </div>
          )}
          {field.editable && !field.value && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <span className="text-[9px] bg-[#F5A623]/10 text-[#F5A623] px-2 py-0.5 rounded-full font-semibold">
                {t('fill')}
              </span>
            </div>
          )}
        </div>
        {field.voiceEnabled && (
          <button className="flex items-center gap-1.5 mt-1.5 text-[11px] text-[#2D6A2D] font-medium">
            <Mic className="w-3 h-3" />
            {t('voiceInput')}
          </button>
        )}
      </div>
    );
  }

  // ─── Review Step ────────────────────────────────────────────
  const renderReviewStep = () => {
    const reviewSections = [
      {
        title: t('personalInfo'),
        icon: <User className="w-4 h-4" />,
        fields: formFields.filter((f) =>
          ['name', 'fatherName', 'age', 'gender', 'mobile', 'aadhaar'].includes(f.key)
        ),
        editStep: 'form' as WizardStep,
      },
      {
        title: t('landLocation'),
        icon: <MapPin className="w-4 h-4" />,
        fields: formFields.filter((f) =>
          ['state', 'district', 'village', 'landSize', 'ownership', 'surveyNumber'].includes(f.key)
        ),
        editStep: 'form' as WizardStep,
      },
      {
        title: t('bankDetails'),
        icon: <Building2 className="w-4 h-4" />,
        fields: formFields.filter((f) =>
          ['bankName', 'bankAccount', 'ifsc'].includes(f.key)
        ),
        editStep: 'form' as WizardStep,
      },
    ];

    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.25 }}
        className="space-y-4"
      >
        <div className="mb-2">
          <h2 className="font-bold text-[22px] text-[#1C1C1E] mb-1">
            {t('reviewApplication')}
          </h2>
          <p className="text-[13px] text-[#6B7280]">
            {t('verifyBeforeSubmit')}
          </p>
        </div>

        {/* Completion Bar */}
        <div className="bg-gradient-to-r from-[#2D6A2D] to-[#97BC62] rounded-2xl p-4 text-white">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-5 h-5" />
            <span className="font-bold text-[15px]">
              {typeof translations.applicationComplete[isMarathi ? 'mr' : isHindi ? 'hi' : 'en'] === 'function'
                ? (translations.applicationComplete[isMarathi ? 'mr' : isHindi ? 'hi' : 'en'] as (p: number) => string)(completionPercent)
                : ''}
            </span>
          </div>
          <div className="w-full bg-white/30 h-2 rounded-full overflow-hidden">
            <motion.div
              className="bg-white h-full rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${completionPercent}%` }}
              transition={{ duration: 0.8 }}
            />
          </div>
        </div>

        {/* Scheme Info */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-3">
          <span className="text-[28px]">{scheme.logo}</span>
          <div>
            <p className="font-semibold text-[14px] text-[#1C1C1E]">
              {getSchemeName()}
            </p>
            <p className="text-[11px] text-[#6B7280]">
              {t('applicationForm')}
            </p>
          </div>
        </div>

        {/* Review Sections */}
        {reviewSections.map((section) => (
          <div key={section.title as string} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#2D6A2D]/10 flex items-center justify-center text-[#2D6A2D]">
                  {section.icon}
                </div>
                <h3 className="font-semibold text-[14px] text-[#2D6A2D]">
                  {section.title}
                </h3>
              </div>
              <button
                onClick={() => setCurrentStep(section.editStep)}
                className="flex items-center gap-1 text-[#F5A623] text-[12px] font-semibold"
              >
                ✏️ {t('edit')}
              </button>
            </div>
            <div className="space-y-2">
              {section.fields.map((field) => (
                <div key={field.key} className="flex justify-between text-[13px]">
                  <span className="text-[#6B7280]">
                    {getFieldLabel(field)}
                  </span>
                  <span className={`font-medium text-right max-w-[55%] ${field.value ? 'text-[#1C1C1E]' : 'text-[#F87171]'}`}>
                    {field.value || t('notFilled')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Documents Section */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#2D6A2D]/10 flex items-center justify-center text-[#2D6A2D]">
                <FileText className="w-4 h-4" />
              </div>
              <h3 className="font-semibold text-[14px] text-[#2D6A2D]">
                {t('documents')}
              </h3>
            </div>
            <button
              onClick={() => setCurrentStep('documents')}
              className="flex items-center gap-1 text-[#F5A623] text-[12px] font-semibold"
            >
              ✏️ {t('edit')}
            </button>
          </div>
          <div className="space-y-2">
            {documents.map((doc) => (
              <div key={doc.key} className="flex items-center gap-2 text-[13px]">
                {doc.uploaded ? (
                  <CheckCircle className="w-4 h-4 text-[#97BC62] flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-[#F87171] flex-shrink-0" />
                )}
                <span className={doc.uploaded ? 'text-[#1C1C1E]' : 'text-[#F87171]'}>
                  {getDocLabel(doc)}
                </span>
                {doc.uploaded && doc.file && (
                  <span className="text-[10px] bg-[#97BC62]/10 text-[#2D6A2D] px-1.5 py-0.5 rounded-full font-medium ml-auto">
                    {t('fromProfileTag')}
                  </span>
                )}
                {!doc.uploaded && (
                  <span className="text-[10px] bg-[#F87171]/10 text-[#F87171] px-1.5 py-0.5 rounded-full font-medium ml-auto">
                    {t('missing')}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="bg-[#F7F3EE] rounded-xl p-3 flex items-start gap-2">
          <Shield className="w-4 h-4 text-[#6B7280] mt-0.5 flex-shrink-0" />
          <p className="text-[11px] text-[#6B7280] leading-relaxed">
            {t('disclaimer')}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-2">
          <button
            onClick={() => setShowPreview(true)}
            className="flex-1 py-3 border border-gray-200 text-[#1C1C1E] rounded-xl font-semibold text-[14px] flex items-center justify-center gap-2 hover:bg-gray-50 active:scale-[0.97] transition-all"
          >
            <Eye className="w-4 h-4" />
            {t('preview')}
          </button>
          <button
            onClick={() => setCurrentStep('success')}
            disabled={completionPercent < 100}
            className={`flex-1 py-3 rounded-xl font-bold text-[14px] flex items-center justify-center gap-2 active:scale-[0.97] transition-all ${completionPercent >= 100
              ? 'bg-[#F5A623] text-white shadow-sm shadow-[#F5A623]/30'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
          >
            <CheckCircle className="w-4 h-4" />
            {t('submitNow')}
          </button>
        </div>
      </motion.div>
    );
  };

  // ─── Success Step ───────────────────────────────────────────
  const renderSuccessStep = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center min-h-[65vh] px-2"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
      >
        <div className="w-28 h-28 rounded-full bg-gradient-to-br from-[#97BC62] to-[#2D6A2D] flex items-center justify-center mb-6 shadow-lg shadow-[#97BC62]/30">
          <CheckCircle className="w-16 h-16 text-white" />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-center"
      >
        <h2 className="font-bold text-[22px] text-[#1C1C1E] mb-1">
          {t('applicationSubmitted')}
        </h2>
        <p className="text-[14px] text-[#6B7280] mb-6">
          {typeof translations.applicationRecorded[isMarathi ? 'mr' : isHindi ? 'hi' : 'en'] === 'function'
            ? (translations.applicationRecorded[isMarathi ? 'mr' : isHindi ? 'hi' : 'en'] as (s: string) => string)(getSchemeName())
            : ''}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="w-full space-y-3"
      >
        {/* Reference Number Card */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[12px] text-[#6B7280] font-medium">
              {t('referenceNumber')}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyRef}
                className="text-[#F5A623] hover:text-[#E09515] transition-colors"
              >
                <Copy className="w-4 h-4" />
              </button>
              <button
                onClick={handleShare}
                className="text-[#2D6A2D] hover:text-[#1A3C1A] transition-colors"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
          <p className="font-mono font-bold text-[18px] text-[#1C1C1E] text-center py-2 bg-[#F7F3EE] rounded-xl">
            {refNumber}
          </p>
          <AnimatePresence>
            {copiedRef && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-[11px] text-[#97BC62] font-medium text-center mt-2"
              >
                ✓ {t('copiedToClipboard')}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Applicant summary */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-[#2D6A2D]/10 flex items-center justify-center overflow-hidden">
              {userData.profileImage ? (
                <img src={userData.profileImage} alt="" className="w-full h-full object-cover" />
              ) : (
                <User className="w-5 h-5 text-[#2D6A2D]" />
              )}
            </div>
            <div>
              <p className="font-semibold text-[14px] text-[#1C1C1E]">
                {userData.name || t('applicant')}
              </p>
              <p className="text-[11px] text-[#6B7280]">
                {userData.district && userData.state
                  ? `${userData.district}, ${userData.state}`
                  : getSchemeName()}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {userData.mobile && (
              <div className="bg-[#F7F3EE] rounded-lg px-3 py-2">
                <p className="text-[10px] text-[#6B7280]">{t('mobile')}</p>
                <p className="text-[12px] font-medium text-[#1C1C1E]">+91 {userData.mobile}</p>
              </div>
            )}
            {userData.bankAccount && (
              <div className="bg-[#F7F3EE] rounded-lg px-3 py-2">
                <p className="text-[10px] text-[#6B7280]">{t('account')}</p>
                <p className="text-[12px] font-medium text-[#1C1C1E]">{maskBankAccount(userData.bankAccount)}</p>
              </div>
            )}
          </div>
        </div>

        {/* Info Cards */}
        <div className="bg-[#F7F3EE] rounded-2xl p-4 space-y-3">
          <div className="flex items-start gap-3">
            <span className="text-[20px]">⏱</span>
            <div>
              <p className="text-[14px] text-[#1C1C1E] font-semibold">
                {t('estimatedTime')}
              </p>
              <p className="text-[11px] text-[#6B7280]">
                {t('estimatedProcessing')}
              </p>
            </div>
          </div>
          <div className="h-px bg-gray-200" />
          <div className="flex items-start gap-3">
            <span className="text-[20px]">💬</span>
            <div>
              <p className="text-[14px] text-[#1C1C1E] font-semibold">
                {t('smsConfirmation')}
              </p>
              <p className="text-[11px] text-[#6B7280]">
                {userData.mobile
                  ? `${t('sentTo')} ${userData.mobile.slice(0, 4)}XXXXX${userData.mobile.slice(-1)}`
                  : t('toRegisteredNumber')}
              </p>
            </div>
          </div>
          <div className="h-px bg-gray-200" />
          <div className="flex items-start gap-3">
            <span className="text-[20px]">📋</span>
            <div>
              <p className="text-[14px] text-[#1C1C1E] font-semibold">
                {t('nextSteps')}
              </p>
              <p className="text-[11px] text-[#6B7280]">
                {t('trackInApplications')}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={() => navigate('/applications')}
            className="flex-1 py-3.5 bg-[#2D6A2D] text-white rounded-xl font-bold text-[14px] flex items-center justify-center gap-2 active:scale-[0.97] transition-all"
          >
            <FileText className="w-4 h-4" />
            {t('trackApplication')}
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="flex-1 py-3.5 border border-gray-200 text-[#1C1C1E] rounded-xl font-semibold text-[14px] flex items-center justify-center gap-2 hover:bg-gray-50 active:scale-[0.97] transition-all"
          >
            <Home className="w-4 h-4" />
            {t('goHome')}
          </button>
        </div>

        {/* Download receipt */}
        <button className="w-full py-3 bg-[#F7F3EE] text-[#2D6A2D] rounded-xl font-medium text-[13px] flex items-center justify-center gap-2 active:scale-[0.97] transition-all">
          <Download className="w-4 h-4" />
          {t('downloadReceipt')}
        </button>
      </motion.div>
    </motion.div>
  );

  // ─── Preview Modal ──────────────────────────────────────────
  const renderPreviewModal = () => (
    <AnimatePresence>
      {showPreview && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center"
          onClick={() => setShowPreview(false)}
        >
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25 }}
            className="bg-white rounded-t-3xl w-full max-h-[85vh] overflow-y-auto p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-[18px] text-[#1C1C1E]">
                {t('applicationPreview')}
              </h3>
              <button
                onClick={() => setShowPreview(false)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scheme header */}
            <div className="bg-[#2D6A2D]/5 rounded-xl p-3 mb-4 flex items-center gap-3">
              <span className="text-[24px]">{scheme.logo}</span>
              <div>
                <p className="font-semibold text-[14px] text-[#2D6A2D]">
                  {getSchemeName()}
                </p>
                <p className="text-[11px] text-[#6B7280]">
                  {t('applicationForm')}
                </p>
              </div>
            </div>

            {/* Applicant photo + name */}
            {userData.name && (
              <div className="flex items-center gap-3 mb-4 bg-[#F7F3EE] rounded-xl p-3">
                <div className="w-12 h-12 rounded-full bg-white overflow-hidden flex items-center justify-center">
                  {userData.profileImage ? (
                    <img src={userData.profileImage} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-6 h-6 text-gray-300" />
                  )}
                </div>
                <div>
                  <p className="font-semibold text-[14px] text-[#1C1C1E]">{userData.name}</p>
                  {userData.aadhaar && (
                    <p className="text-[11px] text-[#6B7280]">
                      {t('aadhaar')} {maskAadhaar(userData.aadhaar)}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* All fields */}
            <div className="space-y-2 mb-4">
              {formFields.map((field) => (
                <div key={field.key} className="flex justify-between text-[13px] py-1.5 border-b border-gray-50">
                  <span className="text-[#6B7280]">
                    {getFieldLabel(field)}
                  </span>
                  <span className="font-medium text-[#1C1C1E] text-right max-w-[55%]">
                    {field.value || '—'}
                  </span>
                </div>
              ))}
            </div>

            {/* Documents */}
            <h4 className="font-semibold text-[13px] text-[#2D6A2D] mb-2">
              {t('documents')}
            </h4>
            <div className="space-y-1.5 mb-4">
              {documents.map((doc) => (
                <div key={doc.key} className="flex items-center gap-2 text-[13px]">
                  {doc.uploaded ? (
                    <CheckCircle className="w-4 h-4 text-[#97BC62]" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-[#F87171]" />
                  )}
                  <span>{getDocLabel(doc)}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowPreview(false)}
              className="w-full py-3 bg-[#F5A623] text-white rounded-xl font-bold text-[14px] active:scale-[0.97] transition-all"
            >
              {t('closePreview')}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // ─── Main Render ────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#F7F3EE] flex flex-col">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,.pdf"
        className="hidden"
        onChange={handleFileUpload}
      />

      {/* ─── Top Bar ──────────────────────────────────────── */}
      <div className="bg-gradient-to-b from-[#1A3C1A] to-[#2D6A2D] pt-10 pb-4 px-4 sticky top-0 z-20">
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={goBack}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div className="text-center">
            <p className="text-white/70 text-[11px] font-medium">
              {getSchemeName()}
            </p>
            {currentStep !== 'success' && (
              <p className="text-white text-[13px] font-semibold">
                {typeof translations.step[isMarathi ? 'mr' : isHindi ? 'hi' : 'en'] === 'function'
                  ? (translations.step[isMarathi ? 'mr' : isHindi ? 'hi' : 'en'] as (c: number, t: number, n: string) => string)(
                    currentStepIndex + 1,
                    4,
                    getProgressStepName(currentStepIndex)
                  )
                  : ''}
              </p>
            )}
          </div>
          <div className="w-9" />
        </div>

        {/* Progress Bar */}
        {currentStep !== 'success' && (
          <div className="flex gap-1.5">
            {progressStepsData.map((_, index) => (
              <div key={index} className="flex-1 relative">
                <div
                  className={`h-1.5 rounded-full transition-all duration-500 ${index <= currentStepIndex
                    ? 'bg-[#F5A623]'
                    : 'bg-white/20'
                    }`}
                />
                {index === currentStepIndex && index < 3 && (
                  <div className="absolute -right-0.5 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-[#F5A623] rounded-full border-2 border-white/50 animate-pulse" />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Step Labels */}
        {currentStep !== 'success' && (
          <div className="flex justify-between mt-1.5">
            {progressStepsData.map((step, index) => (
              <span
                key={index}
                className={`text-[9px] font-medium ${index <= currentStepIndex ? 'text-[#F5A623]' : 'text-white/30'
                  }`}
              >
                {isMarathi ? step.mr : isHindi ? step.hi : step.en}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* ─── Content ──────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-4 py-5 pb-28">
        {currentStep === 'documents' && renderDocumentsStep()}
        {currentStep === 'form' && renderFormStep()}
        {currentStep === 'review' && renderReviewStep()}
        {currentStep === 'success' && renderSuccessStep()}
      </div>

      {/* ─── Bottom CTA ───────────────────────────────────── */}
      {currentStep !== 'success' && currentStep !== 'review' && (
        <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-100 p-4 z-10">
          <div className="flex gap-3">
            {currentStep !== 'documents' && (
              <button
                onClick={goBack}
                className="px-6 py-3.5 border border-gray-200 text-[#1C1C1E] rounded-xl font-semibold text-[14px] hover:bg-gray-50 active:scale-[0.97] transition-all"
              >
                {t('back')}
              </button>
            )}
            <button
              onClick={goNext}
              disabled={!canProceed}
              className={`flex-1 py-3.5 rounded-xl font-bold text-[15px] flex items-center justify-center gap-2 active:scale-[0.97] transition-all ${canProceed
                ? 'bg-[#F5A623] text-white shadow-sm shadow-[#F5A623]/30'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
            >
              {t('continue')}
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          {!canProceed && currentStep === 'documents' && (
            <p className="text-center text-[11px] text-[#FB923C] mt-2 font-medium">
              {typeof translations.documentsRemaining[isMarathi ? 'mr' : isHindi ? 'hi' : 'en'] === 'function'
                ? (translations.documentsRemaining[isMarathi ? 'mr' : isHindi ? 'hi' : 'en'] as (c: number) => string)(totalDocsCount - uploadedDocsCount)
                : ''}
            </p>
          )}
          {!canProceed && currentStep === 'form' && (
            <p className="text-center text-[11px] text-[#FB923C] mt-2 font-medium">
              {t('fillRequiredFields')}
            </p>
          )}
        </div>
      )}

      {/* Preview Modal */}
      {renderPreviewModal()}
    </div>
  );
}
