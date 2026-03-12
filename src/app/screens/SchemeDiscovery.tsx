// src/screens/SchemeDiscovery.tsx
import { useState, useMemo } from 'react';
import { ArrowLeft, Search, Mic, Filter, Sparkles, ChevronDown, X } from 'lucide-react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { BottomNav } from '../components/BottomNav';
import { SchemeCard } from '../components/SchemeCard';
import { useLanguage } from '../../context/LanguageContext';
import { useUser } from '../../context/UserContext';


// ─── Types ─────────────────────────────────────────────────────────────────────
type CasteCategory = 'All' | 'SC' | 'ST' | 'OBC' | 'General';


interface Scheme {
  id: string;
  name: string;
  nameHi: string;
  shortTitle: string;
  amount: string;
  amountHi: string;
  type: 'Central Govt' | 'State Govt';
  deadline: string;
  deadlineHi: string;
  docsRequired: number;
  eligible: boolean;
  logo: string;
  state: string[];        // which states this scheme applies to
  casteCategories: CasteCategory[];  // which castes can avail
  tags: string[];
  ministry: string;
  briefDescription: string;
}


// ─── Filter Options ─────────────────────────────────────────────────────────────
const schemeTypeFilters = [
  { en: 'All', hi: 'सभी' },
  { en: 'Central Govt', hi: 'केंद्र सरकार' },
  { en: 'State Govt', hi: 'राज्य सरकार' },
  { en: 'Subsidy', hi: 'सब्सिडी' },
  { en: 'Loan', hi: 'ऋण' },
  { en: 'Insurance', hi: 'बीमा' },
  { en: 'Pension', hi: 'पेंशन' },
  { en: 'Training', hi: 'प्रशिक्षण' },
  { en: 'Scholarship', hi: 'छात्रवृत्ति' },
];


const casteFilters: { key: CasteCategory; label: string; labelHi: string; color: string }[] = [
  { key: 'All', label: 'All', labelHi: 'सभी', color: '#1A3C1A' },
  { key: 'SC', label: 'SC', labelHi: 'SC', color: '#7C3AED' },
  { key: 'ST', label: 'ST', labelHi: 'ST', color: '#0369A1' },
  { key: 'OBC', label: 'OBC', labelHi: 'OBC', color: '#B45309' },
  { key: 'General', label: 'General', labelHi: 'सामान्य', color: '#374151' },
];


const stateOptions = [
  { en: 'All States', hi: 'सभी राज्य' },
  { en: 'Andhra Pradesh', hi: 'आंध्र प्रदेश' },
  { en: 'Arunachal Pradesh', hi: 'अरुणाचल प्रदेश' },
  { en: 'Assam', hi: 'असम' },
  { en: 'Bihar', hi: 'बिहार' },
  { en: 'Gujarat', hi: 'गुजरात' },
  { en: 'Jharkhand', hi: 'झारखंड' },
  { en: 'Kerala', hi: 'केरल' },
  { en: 'Maharashtra', hi: 'महाराष्ट्र' },
];


// ─── Scheme Data ────────────────────────────────────────────────────────────────
// Caste assignment logic:
//   SC  → schemes explicitly for Dalits, poverty upliftment, disabilities scholarship
//   ST  → tribal/NE region schemes, forest/artisan/indigenous farmers
//   OBC → skill training, small traders, vocational, handloom artisans, small farmers
//   General → universal, ex-servicemen, science/research, insurance for all
const allSchemes: Scheme[] = [


  // ── Central / All-State schemes ─────────────────────────────────────────────


  {
    id: 'pm-kisan',
    name: 'PM-Kisan Samman Nidhi',
    nameHi: 'प्रधानमंत्री किसान सम्मान निधि',
    shortTitle: 'PM-KISAN',
    amount: '₹6,000/year',
    amountHi: '₹6,000/वर्ष',
    type: 'Central Govt',
    deadline: 'Ongoing',
    deadlineHi: 'चालू',
    docsRequired: 3,
    eligible: true,
    logo: '🏛️',
    state: ['All States', 'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Gujarat', 'Jharkhand', 'Kerala', 'Maharashtra'],
    casteCategories: ['All', 'SC', 'ST', 'OBC', 'General'],
    tags: ['Farmer', 'Income Support', 'Agriculture'],
    ministry: 'Ministry of Agriculture',
    briefDescription: 'Income support of ₹6,000/year to all farmer families across India.',
  },
  {
    id: 'pmfby',
    name: 'Pradhan Mantri Fasal Bima Yojana',
    nameHi: 'प्रधानमंत्री फसल बीमा योजना',
    shortTitle: 'PMFBY',
    amount: 'Up to ₹2L',
    amountHi: '₹2 लाख तक',
    type: 'Central Govt',
    deadline: 'Feb 28',
    deadlineHi: '28 फरवरी',
    docsRequired: 4,
    eligible: true,
    logo: '🌾',
    state: ['All States', 'Andhra Pradesh', 'Assam', 'Bihar', 'Gujarat', 'Jharkhand', 'Kerala', 'Maharashtra'],
    casteCategories: ['All', 'SC', 'ST', 'OBC', 'General'],
    tags: ['Crop', 'Farmer', 'Insurance'],
    ministry: 'Ministry of Agriculture',
    briefDescription: 'Crop insurance scheme providing financial support to farmers suffering crop loss/damage.',
  },
  {
    id: 'supi',
    name: 'Stand-Up India',
    nameHi: 'स्टैंड-अप इंडिया',
    shortTitle: 'SUPI',
    amount: '₹10L – ₹1Cr',
    amountHi: '₹10 लाख – ₹1 करोड़',
    type: 'Central Govt',
    deadline: 'March 31',
    deadlineHi: '31 मार्च',
    docsRequired: 5,
    eligible: true,
    logo: '💼',
    state: ['All States', 'Andhra Pradesh', 'Assam', 'Bihar', 'Jharkhand', 'Kerala'],
    casteCategories: ['SC', 'ST'],
    tags: ['Loan', 'Entrepreneur', 'Finance', 'Business'],
    ministry: 'Ministry of Finance',
    briefDescription: 'Bank loans for SC/ST and women entrepreneurs to set up greenfield enterprises in manufacturing, services or trade.',
  },
  {
    id: 'pmsby',
    name: 'Pradhan Mantri Suraksha Bima Yojana',
    nameHi: 'प्रधानमंत्री सुरक्षा बीमा योजना',
    shortTitle: 'PMSBY',
    amount: '₹2L cover',
    amountHi: '₹2 लाख कवर',
    type: 'Central Govt',
    deadline: 'Ongoing',
    deadlineHi: 'चालू',
    docsRequired: 2,
    eligible: true,
    logo: '🛡️',
    state: ['All States', 'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Gujarat', 'Jharkhand', 'Kerala', 'Maharashtra'],
    casteCategories: ['All', 'SC', 'ST', 'OBC', 'General'],
    tags: ['Bank Account Holders', 'Insurance', 'Accident Insurance'],
    ministry: 'Ministry of Finance',
    briefDescription: 'Accidental death and disability insurance at just ₹20/year premium for bank account holders.',
  },
  {
    id: 'post-dis',
    name: 'Post Matric Scholarship (Disabilities)',
    nameHi: 'पोस्ट मैट्रिक छात्रवृत्ति (दिव्यांग)',
    shortTitle: 'POST-DIS',
    amount: 'Full Scholarship',
    amountHi: 'पूर्ण छात्रवृत्ति',
    type: 'Central Govt',
    deadline: 'Oct 31',
    deadlineHi: '31 अक्टूबर',
    docsRequired: 4,
    eligible: true,
    logo: '🎓',
    state: ['All States', 'Andhra Pradesh', 'Assam', 'Bihar', 'Jharkhand', 'Kerala'],
    casteCategories: ['SC', 'ST', 'OBC'],
    tags: ['Persons With Disability', 'Post-Matric', 'Student', 'Scholarship'],
    ministry: 'Ministry of Social Justice and Empowerment',
    briefDescription: 'Scholarship for students with disabilities pursuing post-matric education at UGC/AICTE recognized institutions.',
  },
  {
    id: 'nos-swd',
    name: 'National Overseas Scholarship (Disabilities)',
    nameHi: 'राष्ट्रीय विदेश छात्रवृत्ति (दिव्यांग)',
    shortTitle: 'NOS-SWD',
    amount: 'Full Foreign Study',
    amountHi: 'विदेश अध्ययन सहायता',
    type: 'Central Govt',
    deadline: 'April 30',
    deadlineHi: '30 अप्रैल',
    docsRequired: 6,
    eligible: true,
    logo: '✈️',
    state: ['All States', 'Andhra Pradesh', 'Assam', 'Bihar', 'Jharkhand', 'Kerala'],
    casteCategories: ['SC'],
    tags: ['Scholarship', 'Student', 'Person With Disability', 'Overseas'],
    ministry: 'Ministry of Social Justice and Empowerment',
    briefDescription: 'Overseas scholarship for SC students with disabilities for Masters/PhD abroad.',
  },
  {
    id: 'sl',
    name: 'Skill Loan Scheme',
    nameHi: 'कौशल ऋण योजना',
    shortTitle: 'SL',
    amount: 'Up to ₹1.5L',
    amountHi: '₹1.5 लाख तक',
    type: 'Central Govt',
    deadline: 'Ongoing',
    deadlineHi: 'चालू',
    docsRequired: 3,
    eligible: true,
    logo: '🛠️',
    state: ['All States', 'Andhra Pradesh', 'Assam', 'Bihar', 'Jharkhand', 'Kerala'],
    casteCategories: ['OBC', 'SC', 'ST'],
    tags: ['Skill Development', 'Student', 'ITI', 'Polytechnics'],
    ministry: 'Ministry of Skill Development and Entrepreneurship',
    briefDescription: 'Loan up to ₹1.5L for students admitted to ITIs, polytechnics, or skill development courses.',
  },
  {
    id: 'nps-tsep',
    name: 'National Pension Scheme (Traders)',
    nameHi: 'राष्ट्रीय पेंशन योजना (व्यापारी)',
    shortTitle: 'NPS-TSEP',
    amount: '₹3,000/month',
    amountHi: '₹3,000/माह',
    type: 'Central Govt',
    deadline: 'Ongoing',
    deadlineHi: 'चालू',
    docsRequired: 3,
    eligible: true,
    logo: '🏪',
    state: ['All States', 'Andhra Pradesh', 'Assam', 'Bihar', 'Jharkhand', 'Kerala'],
    casteCategories: ['OBC', 'General'],
    tags: ['Pension', 'Traders', 'Self Employment', 'Retirement'],
    ministry: 'Ministry of Labour and Employment',
    briefDescription: 'Pension of ₹3,000/month after age 60 for small traders and self-employed persons.',
  },
  {
    id: 'wos-c',
    name: 'Women Scientist Scheme-C',
    nameHi: 'महिला वैज्ञानिक योजना-C',
    shortTitle: 'WOS-C',
    amount: 'Project Funding',
    amountHi: 'परियोजना वित्त पोषण',
    type: 'Central Govt',
    deadline: 'Rolling',
    deadlineHi: 'रोलिंग',
    docsRequired: 5,
    eligible: true,
    logo: '🔬',
    state: ['All States', 'Andhra Pradesh', 'Assam', 'Bihar', 'Jharkhand', 'Kerala'],
    casteCategories: ['OBC', 'General'],
    tags: ['Women', 'Scientist', 'Science', 'Research'],
    ministry: 'Ministry of Science and Technology',
    briefDescription: 'Supports women scientists to work as intellectual property professionals and pursue research.',
  },
  {
    id: 'rmewf',
    name: 'RMEWF - Medical Treatment (Ex-Servicemen)',
    nameHi: 'RMEWF - चिकित्सा सहायता',
    shortTitle: 'RMEWF',
    amount: 'Medical Expenses',
    amountHi: 'चिकित्सा व्यय',
    type: 'Central Govt',
    deadline: 'Ongoing',
    deadlineHi: 'चालू',
    docsRequired: 3,
    eligible: true,
    logo: '🏥',
    state: ['All States', 'Andhra Pradesh', 'Assam', 'Bihar', 'Jharkhand', 'Kerala'],
    casteCategories: ['General'],
    tags: ['Ex-Servicemen', 'Health', 'Medical Expenses'],
    ministry: 'Ministry of Defence',
    briefDescription: 'Financial assistance for medical treatment of ex-servicemen and their dependents.',
  },
  {
    id: 'rmewf-voc',
    name: 'RMEWF - Vocational Training (Widows)',
    nameHi: 'RMEWF - व्यावसायिक प्रशिक्षण (विधवाएं)',
    shortTitle: 'RMEWF-VOC',
    amount: 'Training Grant',
    amountHi: 'प्रशिक्षण अनुदान',
    type: 'Central Govt',
    deadline: 'Ongoing',
    deadlineHi: 'चालू',
    docsRequired: 3,
    eligible: true,
    logo: '👩‍💼',
    state: ['All States', 'Andhra Pradesh', 'Assam', 'Bihar', 'Jharkhand', 'Kerala'],
    casteCategories: ['General', 'OBC'],
    tags: ['Widows Of Ex-Servicemen', 'Vocational Training', 'Grant'],
    ministry: 'Ministry of Defence',
    briefDescription: 'Financial assistance for vocational training to help widows of ex-servicemen become self-reliant.',
  },
  {
    id: 'rmewf-disabled',
    name: 'RMEWF - 100% Disabled Child (Ex-Servicemen)',
    nameHi: 'RMEWF - दिव्यांग बच्चे सहायता',
    shortTitle: 'RMEWF-DC',
    amount: 'Monthly Assistance',
    amountHi: 'मासिक सहायता',
    type: 'Central Govt',
    deadline: 'Ongoing',
    deadlineHi: 'चालू',
    docsRequired: 4,
    eligible: true,
    logo: '👶',
    state: ['All States', 'Andhra Pradesh', 'Assam', 'Bihar', 'Jharkhand', 'Kerala'],
    casteCategories: ['General'],
    tags: ['Ex-Servicemen', 'Differently Abled', 'Child'],
    ministry: 'Ministry of Defence',
    briefDescription: 'Financial assistance to ex-servicemen or widows for their 100% disabled child.',
  },


  // ── Arunachal Pradesh focused ────────────────────────────────────────────────


  {
    id: 'rgsaip',
    name: 'Rashtriya Gram Swaraj Abhiyan - Internship',
    nameHi: 'राष्ट्रीय ग्राम स्वराज अभियान - इंटर्नशिप',
    shortTitle: 'RGSAIP',
    amount: '₹15,000 stipend',
    amountHi: '₹15,000 वजीफ़ा',
    type: 'Central Govt',
    deadline: 'March 31',
    deadlineHi: '31 मार्च',
    docsRequired: 3,
    eligible: true,
    logo: '🏘️',
    state: ['All States', 'Arunachal Pradesh', 'Assam', 'Jharkhand'],
    casteCategories: ['ST', 'OBC', 'General'],
    tags: ['Internship', 'Research', 'Students', 'Rural'],
    ministry: 'Ministry of Panchayati Raj',
    briefDescription: 'Internship program for students/researchers to study Panchayati Raj institutions and rural governance.',
  },
  {
    id: 'nhdp-artisan',
    name: 'NHDP: Support to Artisans in Indigent Circumstances',
    nameHi: 'NHDP: जरूरतमंद दस्तकारों को सहायता',
    shortTitle: 'NHDP-DBA',
    amount: '₹2,000/month',
    amountHi: '₹2,000/माह',
    type: 'Central Govt',
    deadline: 'Ongoing',
    deadlineHi: 'चालू',
    docsRequired: 3,
    eligible: true,
    logo: '🪡',
    state: ['All States', 'Arunachal Pradesh', 'Assam', 'Jharkhand', 'Maharashtra'],
    casteCategories: ['OBC', 'ST'],
    tags: ['Pension', 'Artisan', 'Handicraft', 'Welfare'],
    ministry: 'Ministry of Textiles',
    briefDescription: 'Monthly pension-like support to aged and needy traditional handicraft artisans.',
  },
  {
    id: 'lokpal-internship',
    name: 'The Lokpal of India Internship Scheme',
    nameHi: 'लोकपाल इंटर्नशिप योजना',
    shortTitle: 'TLOIIS',
    amount: '₹10,000 stipend',
    amountHi: '₹10,000 वजीफ़ा',
    type: 'Central Govt',
    deadline: 'Ongoing',
    deadlineHi: 'चालू',
    docsRequired: 2,
    eligible: true,
    logo: '⚖️',
    state: ['All States', 'Arunachal Pradesh', 'Gujarat', 'Maharashtra'],
    casteCategories: ['General', 'OBC'],
    tags: ['Financial Assistance', 'Student', 'Internship', 'Law'],
    ministry: 'Lokpal of India',
    briefDescription: 'Internship for law/public administration students at Lokpal of India with monthly stipend.',
  },
  {
    id: 'ncessis',
    name: 'National Centre for Earth Science Studies - Internship',
    nameHi: 'NCESS इंटर्नशिप योजना',
    shortTitle: 'NCESSIS',
    amount: '₹12,000 stipend',
    amountHi: '₹12,000 वजीफ़ा',
    type: 'Central Govt',
    deadline: 'Ongoing',
    deadlineHi: 'चालू',
    docsRequired: 2,
    eligible: true,
    logo: '🌍',
    state: ['All States', 'Arunachal Pradesh', 'Kerala', 'Assam'],
    casteCategories: ['ST', 'General'],
    tags: ['Internship', 'Student', 'Research Scholar', 'Science'],
    ministry: 'Ministry of Earth Sciences',
    briefDescription: 'Research internship at National Centre for Earth Science Studies for students and research scholars.',
  },
  {
    id: 'tnsfdcis',
    name: 'NSFDC Internship Scheme',
    nameHi: 'NSFDC इंटर्नशिप योजना',
    shortTitle: 'TNSFDCIS',
    amount: '₹8,000 stipend',
    amountHi: '₹8,000 वजीफ़ा',
    type: 'Central Govt',
    deadline: 'Ongoing',
    deadlineHi: 'चालू',
    docsRequired: 2,
    eligible: true,
    logo: '📚',
    state: ['All States', 'Arunachal Pradesh', 'Bihar', 'Jharkhand'],
    casteCategories: ['SC', 'ST'],
    tags: ['Internship', 'Student', 'SC/ST', 'Finance'],
    ministry: 'Ministry of Social Justice and Empowerment',
    briefDescription: 'Internship for SC/ST students at National Scheduled Castes Finance & Development Corporation.',
  },
  {
    id: 'eps',
    name: "Employees' Pension Scheme",
    nameHi: 'कर्मचारी पेंशन योजना',
    shortTitle: 'EPS',
    amount: '₹1,000–₹7,500/month',
    amountHi: '₹1,000–₹7,500/माह',
    type: 'Central Govt',
    deadline: 'Ongoing',
    deadlineHi: 'चालू',
    docsRequired: 3,
    eligible: true,
    logo: '💰',
    state: ['All States', 'Arunachal Pradesh', 'Gujarat', 'Maharashtra', 'Bihar'],
    casteCategories: ['All', 'SC', 'ST', 'OBC', 'General'],
    tags: ['Employment', 'Pension', 'Retirement', 'EPFO'],
    ministry: 'Ministry of Labour and Employment',
    briefDescription: 'Monthly pension for organised sector employees after retirement or superannuation via EPFO.',
  },
  {
    id: 'icssr-doctoral',
    name: 'ICSSR Doctoral Fellowship',
    nameHi: 'ICSSR डॉक्टरल फेलोशिप',
    shortTitle: 'ICSSR-DF',
    amount: '₹28,000/month',
    amountHi: '₹28,000/माह',
    type: 'Central Govt',
    deadline: 'July 31',
    deadlineHi: '31 जुलाई',
    docsRequired: 5,
    eligible: true,
    logo: '🔭',
    state: ['All States', 'Arunachal Pradesh', 'Gujarat', 'Kerala', 'Maharashtra'],
    casteCategories: ['OBC', 'General'],
    tags: ['Fellowship', 'Doctoral', 'Social Science', 'Research'],
    ministry: 'Ministry of Education',
    briefDescription: 'Doctoral fellowship for social science research with ₹28,000/month and contingency grant.',
  },
  {
    id: 'mi-hma-nhdp',
    name: 'Marketing Incentive under Handloom Marketing Assistance',
    nameHi: 'हथकरघा विपणन सहायता - मार्केटिंग प्रोत्साहन',
    shortTitle: 'MI-HMA',
    amount: 'Up to 10% incentive',
    amountHi: '10% तक प्रोत्साहन',
    type: 'Central Govt',
    deadline: 'Ongoing',
    deadlineHi: 'चालू',
    docsRequired: 3,
    eligible: true,
    logo: '🧵',
    state: ['All States', 'Arunachal Pradesh', 'Assam', 'Bihar'],
    casteCategories: ['OBC', 'ST'],
    tags: ['Marketing', 'Handloom', 'Incentive', 'Weaver'],
    ministry: 'Ministry of Textiles',
    briefDescription: 'Marketing incentive to handloom weavers under National Handloom Development Programme.',
  },
  {
    id: 'vphd-ft',
    name: 'Visvesvaraya PhD Scheme (Full Time)',
    nameHi: 'विश्वेश्वरया PhD योजना (पूर्णकालिक)',
    shortTitle: 'VPHD-FT',
    amount: '₹25,000/month',
    amountHi: '₹25,000/माह',
    type: 'Central Govt',
    deadline: 'Rolling',
    deadlineHi: 'रोलिंग',
    docsRequired: 4,
    eligible: true,
    logo: '💻',
    state: ['All States', 'Arunachal Pradesh', 'Gujarat', 'Kerala', 'Maharashtra'],
    casteCategories: ['General', 'OBC'],
    tags: ['PhD', 'Electronics', 'IT', 'Research'],
    ministry: 'Ministry of Electronics and IT',
    briefDescription: 'PhD fellowship for full-time candidates in Electronics & IT disciplines under Visvesvaraya scheme.',
  },


  // ── Gujarat specific ─────────────────────────────────────────────────────────


  {
    id: 'pmfdr',
    name: "Prime Minister's Fellowship for Doctoral Research",
    nameHi: 'प्रधानमंत्री डॉक्टरल अनुसंधान फेलोशिप',
    shortTitle: 'PMFDR',
    amount: '₹80,000/month',
    amountHi: '₹80,000/माह',
    type: 'Central Govt',
    deadline: 'Oct 15',
    deadlineHi: '15 अक्टूबर',
    docsRequired: 5,
    eligible: true,
    logo: '🏅',
    state: ['All States', 'Gujarat', 'Maharashtra', 'Kerala'],
    casteCategories: ['General', 'OBC'],
    tags: ['Fellowship', 'Doctoral', 'Research', 'Innovation'],
    ministry: 'Ministry of Education',
    briefDescription: 'Prestigious doctoral fellowship of ₹80,000/month for industry-relevant research projects.',
  },
  {
    id: 'gbs',
    name: 'Green Business Scheme',
    nameHi: 'ग्रीन बिज़नेस स्कीम',
    shortTitle: 'GBS',
    amount: 'Subsidy on EV',
    amountHi: 'EV पर सब्सिडी',
    type: 'Central Govt',
    deadline: 'March 31',
    deadlineHi: '31 मार्च',
    docsRequired: 4,
    eligible: true,
    logo: '🚗',
    state: ['All States', 'Gujarat', 'Maharashtra', 'Kerala'],
    casteCategories: ['OBC', 'General'],
    tags: ['Battery Electric Vehicle', 'Green', 'Business', 'Income'],
    ministry: 'Ministry of New and Renewable Energy',
    briefDescription: 'Subsidy support for setting up green businesses using battery electric vehicles.',
  },
  {
    id: 'big',
    name: 'Biotechnology Ignition Grant Scheme',
    nameHi: 'बायोटेक्नोलॉजी इग्नीशन ग्रांट',
    shortTitle: 'BIG',
    amount: 'Up to ₹50L',
    amountHi: '₹50 लाख तक',
    type: 'Central Govt',
    deadline: 'Rolling',
    deadlineHi: 'रोलिंग',
    docsRequired: 6,
    eligible: true,
    logo: '🧬',
    state: ['All States', 'Gujarat', 'Maharashtra', 'Kerala'],
    casteCategories: ['General'],
    tags: ['Biotechnology', 'Startup', 'Grant', 'Innovation'],
    ministry: 'Department of Biotechnology',
    briefDescription: 'Ignition grant up to ₹50L for early-stage biotech startups and innovators in India.',
  },
  {
    id: 'vetls',
    name: 'Vocational Education and Training Loan Scheme',
    nameHi: 'व्यावसायिक शिक्षा एवं प्रशिक्षण ऋण योजना',
    shortTitle: 'VETLS',
    amount: 'Up to ₹1.5L',
    amountHi: '₹1.5 लाख तक',
    type: 'Central Govt',
    deadline: 'Ongoing',
    deadlineHi: 'चालू',
    docsRequired: 3,
    eligible: true,
    logo: '📐',
    state: ['All States', 'Gujarat', 'Maharashtra', 'Bihar', 'Jharkhand'],
    casteCategories: ['OBC', 'SC'],
    tags: ['Education', 'Training', 'Loan', 'Skill'],
    ministry: 'Ministry of Skill Development',
    briefDescription: 'Education loan for vocational and technical training programs across ITIs and polytechnics.',
  },
  {
    id: 'ala',
    name: 'AICTE Lilavati Award',
    nameHi: 'AICTE लीलावती पुरस्कार',
    shortTitle: 'ALA',
    amount: '₹1L prize',
    amountHi: '₹1 लाख पुरस्कार',
    type: 'Central Govt',
    deadline: 'Dec 31',
    deadlineHi: '31 दिसंबर',
    docsRequired: 3,
    eligible: true,
    logo: '🏆',
    state: ['All States', 'Gujarat', 'Maharashtra', 'Kerala'],
    casteCategories: ['General', 'OBC'],
    tags: ['Women Empowerment', 'AICTE', 'Award', 'Education'],
    ministry: 'Ministry of Education (AICTE)',
    briefDescription: 'National award recognizing technical institutions for exceptional work in women empowerment.',
  },
  {
    id: 'serb-power',
    name: 'SERB POWER Research Grants',
    nameHi: 'SERB POWER अनुसंधान अनुदान',
    shortTitle: 'SERB-POWER',
    amount: 'Up to ₹60L',
    amountHi: '₹60 लाख तक',
    type: 'Central Govt',
    deadline: 'Rolling',
    deadlineHi: 'रोलिंग',
    docsRequired: 5,
    eligible: true,
    logo: '⚡',
    state: ['All States', 'Gujarat', 'Maharashtra', 'Kerala'],
    casteCategories: ['General'],
    tags: ['SERB', 'Research Grant', 'Women Scientists', 'Science'],
    ministry: 'Department of Science and Technology',
    briefDescription: 'Research grants up to ₹60L for women scientists as Promoting Opportunities for Women in Exploratory Research.',
  },
  {
    id: 'rvp',
    name: 'Rashtriya Vigyan Puraskar',
    nameHi: 'राष्ट्रीय विज्ञान पुरस्कार',
    shortTitle: 'RVP',
    amount: 'Cash Prize + Medal',
    amountHi: 'नकद पुरस्कार + पदक',
    type: 'Central Govt',
    deadline: 'Jan 14',
    deadlineHi: '14 जनवरी',
    docsRequired: 4,
    eligible: true,
    logo: '🥇',
    state: ['All States', 'Gujarat', 'Maharashtra', 'Kerala'],
    casteCategories: ['General'],
    tags: ['Science', 'Technology', 'Scientists', 'Award'],
    ministry: 'Ministry of Science and Technology',
    briefDescription: 'National science award recognizing outstanding contributions to science, technology, and innovation.',
  },


  // ── Jharkhand/Kerala specific ─────────────────────────────────────────────────


  {
    id: 'sfava',
    name: 'Scheme for Financial Assistance for Veteran Artists',
    nameHi: 'वयोवृद्ध कलाकार वित्तीय सहायता योजना',
    shortTitle: 'SFAVA',
    amount: '₹6,000/month',
    amountHi: '₹6,000/माह',
    type: 'Central Govt',
    deadline: 'Ongoing',
    deadlineHi: 'चालू',
    docsRequired: 4,
    eligible: true,
    logo: '🎨',
    state: ['All States', 'Jharkhand', 'Kerala', 'Assam', 'Arunachal Pradesh'],
    casteCategories: ['OBC', 'General'],
    tags: ['Artists', 'Pension', 'Veteran', 'Culture'],
    ministry: 'Ministry of Culture',
    briefDescription: 'Monthly financial support of ₹6,000 to veteran artists who are aged and in financial distress.',
  },
  {
    id: 'pmkvy-stt',
    name: 'Pradhan Mantri Kaushal Vikas Yojana - Short Term Training',
    nameHi: 'प्रधानमंत्री कौशल विकास योजना - अल्पकालिक प्रशिक्षण',
    shortTitle: 'PMKVY-STT',
    amount: 'Free + ₹8,000 reward',
    amountHi: 'मुफ़्त + ₹8,000 पुरस्कार',
    type: 'Central Govt',
    deadline: 'Ongoing',
    deadlineHi: 'चालू',
    docsRequired: 2,
    eligible: true,
    logo: '🎯',
    state: ['All States', 'Jharkhand', 'Kerala', 'Bihar', 'Assam', 'Arunachal Pradesh'],
    casteCategories: ['OBC', 'SC', 'ST'],
    tags: ['Placement', 'Training', 'Skill', 'Counselling'],
    ministry: 'Ministry of Skill Development and Entrepreneurship',
    briefDescription: 'Free short-term skill training with ₹8,000 reward on assessment pass and industry placement support.',
  },


  // ── Maharashtra / Agriculture specific ───────────────────────────────────────


  {
    id: 'coffee-dev-pulpers',
    name: 'Coffee Development Programme NE: Baby Pulpers Subsidy',
    nameHi: 'कॉफी विकास कार्यक्रम NE: पल्पर सब्सिडी',
    shortTitle: 'CDP-BP',
    amount: '25% subsidy',
    amountHi: '25% सब्सिडी',
    type: 'Central Govt',
    deadline: 'March 31',
    deadlineHi: '31 मार्च',
    docsRequired: 4,
    eligible: true,
    logo: '☕',
    state: ['All States', 'Maharashtra', 'Arunachal Pradesh', 'Assam'],
    casteCategories: ['ST', 'OBC'],
    tags: ['Agriculture', 'Farmer', 'Subsidy', 'Coffee'],
    ministry: 'Coffee Board of India',
    briefDescription: 'Subsidy on baby pulpers for NE region coffee farmers to improve quality and processing.',
  },
  {
    id: 'coffee-dev-drying',
    name: 'Coffee Development Programme NE: Drying Yards',
    nameHi: 'कॉफी विकास कार्यक्रम NE: सुखाई आँगन',
    shortTitle: 'CDP-DY',
    amount: '50% subsidy',
    amountHi: '50% सब्सिडी',
    type: 'Central Govt',
    deadline: 'March 31',
    deadlineHi: '31 मार्च',
    docsRequired: 4,
    eligible: true,
    logo: '🌿',
    state: ['All States', 'Maharashtra', 'Arunachal Pradesh', 'Assam'],
    casteCategories: ['ST', 'OBC'],
    tags: ['Agriculture', 'Farmer', 'Subsidy', 'Coffee'],
    ministry: 'Coffee Board of India',
    briefDescription: 'Subsidy on construction of drying yards for coffee farmers in NE region.',
  },
  {
    id: 'cpis',
    name: 'Coconut Palm Insurance Scheme',
    nameHi: 'नारियल पाम बीमा योजना',
    shortTitle: 'CPIS',
    amount: 'Up to ₹900/palm',
    amountHi: 'प्रति पेड़ ₹900 तक',
    type: 'Central Govt',
    deadline: 'Ongoing',
    deadlineHi: 'चालू',
    docsRequired: 3,
    eligible: true,
    logo: '🥥',
    state: ['All States', 'Maharashtra', 'Kerala', 'Assam'],
    casteCategories: ['OBC', 'ST', 'SC'],
    tags: ['Coconut', 'Palm', 'Insurance', 'Farmer'],
    ministry: 'Ministry of Agriculture',
    briefDescription: 'Insurance coverage for coconut palms against natural calamities for coconut farmers.',
  },
  {
    id: 'pmksy-pdmc',
    name: 'PM Krishi Sinchayee Yojana - Per Drop More Crop',
    nameHi: 'PM कृषि सिंचाई योजना - प्रति बूंद अधिक फसल',
    shortTitle: 'PMKSY-PDMC',
    amount: '55–90% subsidy',
    amountHi: '55–90% सब्सिडी',
    type: 'Central Govt',
    deadline: 'March 31',
    deadlineHi: '31 मार्च',
    docsRequired: 4,
    eligible: true,
    logo: '💧',
    state: ['All States', 'Maharashtra', 'Gujarat', 'Andhra Pradesh', 'Bihar'],
    casteCategories: ['All', 'SC', 'ST', 'OBC', 'General'],
    tags: ['Agriculture', 'Crop', 'Irrigation', 'Water'],
    ministry: 'Ministry of Agriculture',
    briefDescription: 'Drip and sprinkler irrigation subsidy for farmers to promote micro-irrigation and water efficiency.',
  },
  {
    id: 'pmkmdy',
    name: 'Pradhan Mantri Kisan Maandhan Yojana',
    nameHi: 'प्रधानमंत्री किसान मानधन योजना',
    shortTitle: 'PMKMDY',
    amount: '₹3,000/month',
    amountHi: '₹3,000/माह',
    type: 'Central Govt',
    deadline: 'Ongoing',
    deadlineHi: 'चालू',
    docsRequired: 3,
    eligible: true,
    logo: '🌱',
    state: ['All States', 'Maharashtra', 'Bihar', 'Jharkhand', 'Assam'],
    casteCategories: ['SC', 'OBC', 'ST'],
    tags: ['Small Farmer', 'Pension', 'Old Age', 'Social Security'],
    ministry: 'Ministry of Agriculture',
    briefDescription: 'Pension of ₹3,000/month for small and marginal farmers after age 60 years.',
  },
  {
    id: 'dscta-water',
    name: 'Coffee Development - Traditional Areas: Water Augmentation',
    nameHi: 'पारंपरिक कॉफी क्षेत्र: जल संवर्धन',
    shortTitle: 'DSCTA-WA',
    amount: '50% subsidy',
    amountHi: '50% सब्सिडी',
    type: 'Central Govt',
    deadline: 'March 31',
    deadlineHi: '31 मार्च',
    docsRequired: 4,
    eligible: true,
    logo: '🌊',
    state: ['All States', 'Maharashtra', 'Kerala'],
    casteCategories: ['ST', 'OBC'],
    tags: ['Coffee', 'Farmer', 'Water', 'Subsidy'],
    ministry: 'Coffee Board of India',
    briefDescription: 'Water augmentation subsidy for coffee farmers in traditional coffee growing areas of India.',
  },
  {
    id: 'cardamom-nursery',
    name: 'Spice Export Promotion: Large Cardamom Certified Nursery',
    nameHi: 'मसाला निर्यात: इलायची प्रमाणित नर्सरी',
    shortTitle: 'SEPCN',
    amount: '50% subsidy',
    amountHi: '50% सब्सिडी',
    type: 'Central Govt',
    deadline: 'March 31',
    deadlineHi: '31 मार्च',
    docsRequired: 5,
    eligible: true,
    logo: '🌱',
    state: ['All States', 'Maharashtra', 'Kerala', 'Arunachal Pradesh'],
    casteCategories: ['ST', 'OBC'],
    tags: ['Farmer', 'Nursery', 'Export', 'Spice', 'Cardamom'],
    ministry: 'Spices Board of India',
    briefDescription: 'Subsidy for setting up large cardamom certified nurseries to boost export-oriented spice production.',
  },


  // ── KCC & Soil Health (existing) ──────────────────────────────────────────────


  {
    id: 'kcc',
    name: 'Kisan Credit Card',
    nameHi: 'किसान क्रेडिट कार्ड',
    shortTitle: 'KCC',
    amount: 'Up to ₹3L',
    amountHi: '₹3 लाख तक',
    type: 'Central Govt',
    deadline: 'Ongoing',
    deadlineHi: 'चालू',
    docsRequired: 5,
    eligible: true,
    logo: '💳',
    state: ['All States', 'Andhra Pradesh', 'Assam', 'Bihar', 'Gujarat', 'Jharkhand', 'Kerala', 'Maharashtra'],
    casteCategories: ['All', 'SC', 'ST', 'OBC', 'General'],
    tags: ['Loan', 'Farmer', 'Credit', 'Agriculture'],
    ministry: 'Ministry of Agriculture',
    briefDescription: 'Short-term credit up to ₹3L for farmers to meet agriculture and allied activities needs.',
  },
  {
    id: 'soil-health',
    name: 'Soil Health Card Scheme',
    nameHi: 'मृदा स्वास्थ्य कार्ड योजना',
    shortTitle: 'SHC',
    amount: 'Free Testing',
    amountHi: 'मुफ़्त जांच',
    type: 'State Govt',
    deadline: 'March 15',
    deadlineHi: '15 मार्च',
    docsRequired: 2,
    eligible: true,
    logo: '🧪',
    state: ['All States', 'Andhra Pradesh', 'Assam', 'Bihar', 'Gujarat', 'Jharkhand', 'Kerala', 'Maharashtra'],
    casteCategories: ['All', 'SC', 'ST', 'OBC', 'General'],
    tags: ['Soil', 'Farmer', 'Free', 'Agriculture'],
    ministry: 'Ministry of Agriculture',
    briefDescription: 'Free soil health testing and personalised fertiliser recommendations for every farmer.',
  },
  {
    id: 'pm-kusum',
    name: 'PM-KUSUM Solar Pump',
    nameHi: 'PM कुसुम सोलर पंप योजना',
    shortTitle: 'PM-KUSUM',
    amount: '90% subsidy',
    amountHi: '90% सब्सिडी',
    type: 'Central Govt',
    deadline: 'April 15',
    deadlineHi: '15 अप्रैल',
    docsRequired: 4,
    eligible: true,
    logo: '☀️',
    state: ['All States', 'Andhra Pradesh', 'Bihar', 'Gujarat', 'Jharkhand', 'Maharashtra'],
    casteCategories: ['All', 'SC', 'ST', 'OBC', 'General'],
    tags: ['Solar', 'Pump', 'Subsidy', 'Farmer'],
    ministry: 'Ministry of New and Renewable Energy',
    briefDescription: '90% subsidy on solar pumps for farmers to reduce irrigation electricity costs.',
  },
];


// ─── Caste badge config ─────────────────────────────────────────────────────────
const casteBadgeConfig: Record<string, { bg: string; text: string; label: string }> = {
  SC: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'SC' },
  ST: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'ST' },
  OBC: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'OBC' },
  General: { bg: 'bg-gray-100', text: 'text-gray-600', label: 'General' },
};


// ─── Component ──────────────────────────────────────────────────────────────────
export function SchemeDiscovery() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { userData, getProfileCompletion } = useUser();
  const isHindi = language === 'hi';


  const [activeTypeFilter, setActiveTypeFilter] = useState<string>('All');
  const [activeCaste, setActiveCaste] = useState<CasteCategory>('All');
  const [selectedState, setSelectedState] = useState<string>('All States');
  const [searchQuery, setSearchQuery] = useState('');
  const [showStateDropdown, setShowStateDropdown] = useState(false);


  const matchedSchemesCount = useMemo(() => {
    let count = 5;
    if (userData.landOwnership) count += 3;
    if (userData.selectedCrops?.length) count += userData.selectedCrops.length;
    if (userData.irrigation?.length) count += 2;
    if (userData.annualIncome) count += 4;
    return Math.min(count, 25);
  }, [userData]);


  const profileCompletion = getProfileCompletion();


  // ── Filtering ─────────────────────────────────────────────────────────────────
  const filteredSchemes = useMemo(() => {
    return allSchemes.filter((scheme) => {
      // State filter
      if (selectedState !== 'All States' && !scheme.state.includes(selectedState)) return false;


      // Caste filter
      if (activeCaste !== 'All' && !scheme.casteCategories.includes(activeCaste) && !scheme.casteCategories.includes('All')) return false;


      // Type / tag filter
      if (activeTypeFilter !== 'All') {
        const tagMatch = scheme.tags.some((t) =>
          t.toLowerCase().includes(activeTypeFilter.toLowerCase())
        );
        const typeMatch = scheme.type === activeTypeFilter;
        if (!tagMatch && !typeMatch) return false;
      }


      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          scheme.name.toLowerCase().includes(q) ||
          scheme.nameHi.toLowerCase().includes(q) ||
          scheme.shortTitle.toLowerCase().includes(q) ||
          scheme.tags.some((t) => t.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [activeTypeFilter, activeCaste, selectedState, searchQuery]);


  // current state label
  const stateLabel = stateOptions.find((s) => s.en === selectedState);


  return (
    <div className="min-h-screen bg-[#F7F3EE] pb-24">
      {/* ── Top Bar ──────────────────────────────────────────────────────────── */}
      <div className="bg-gradient-to-b from-[#1A3C1A] to-[#2D6A2D] pt-10 pb-4 px-4 sticky top-0 z-20">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <h1 className="font-bold text-white text-[16px]">
            {isHindi ? 'योजना खोजें' : 'Find Schemes'}
          </h1>
          <div className="w-9 h-9" />
        </div>


        {/* Search Bar */}
        <div className="bg-white rounded-2xl p-3 shadow-sm border border-[#F5A623]/60 mb-3">
          <div className="flex items-center gap-3">
            <Search className="w-5 h-5 text-[#6B7280] flex-shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isHindi ? 'योजना का नाम, फसल, या ज़रूरत लिखें...' : 'Type scheme name, tag, or ministry...'}
              className="flex-1 bg-transparent border-none outline-none text-[14px] placeholder:text-[#9CA3AF] text-[#111827]"
            />
            {searchQuery ? (
              <button onClick={() => setSearchQuery('')} className="w-7 h-7 flex items-center justify-center">
                <X className="w-4 h-4 text-gray-400" />
              </button>
            ) : (
              <button className="w-8 h-8 rounded-full bg-[#F5A623]/10 flex items-center justify-center">
                <Mic className="w-4 h-4 text-[#F5A623]" />
              </button>
            )}
          </div>
        </div>


        {/* ── State Dropdown ─────────────────────────────────────────────────── */}
        <div className="relative mb-1">
          <button
            onClick={() => setShowStateDropdown((v) => !v)}
            className="w-full flex items-center justify-between bg-white/15 border border-white/30 rounded-2xl px-4 py-2.5"
          >
            <div className="flex items-center gap-2">
              <span className="text-[13px] text-white/70 font-medium">
                {isHindi ? 'राज्य:' : 'State:'}
              </span>
              <span className="text-[13px] text-white font-bold">
                {isHindi ? (stateLabel?.hi ?? selectedState) : selectedState}
              </span>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-white/80 transition-transform ${showStateDropdown ? 'rotate-180' : ''}`}
            />
          </button>


          <AnimatePresence>
            {showStateDropdown && (
              <motion.div
                initial={{ opacity: 0, y: -6, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.97 }}
                transition={{ duration: 0.15 }}
                className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-30"
              >
                {stateOptions.map((state) => (
                  <button
                    key={state.en}
                    onClick={() => { setSelectedState(state.en); setShowStateDropdown(false); }}
                    className={`w-full text-left px-4 py-3 text-[13px] font-medium flex items-center justify-between transition-colors
                      ${selectedState === state.en
                        ? 'bg-[#F5A623]/10 text-[#F5A623] font-semibold'
                        : 'text-[#1C1C1E] hover:bg-gray-50'
                      }`}
                  >
                    <span>{isHindi ? state.hi : state.en}</span>
                    {selectedState === state.en && <div className="w-2 h-2 rounded-full bg-[#F5A623]" />}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>


      {/* ── Dismiss dropdown on outside click ─────────────────────────────────── */}
      {showStateDropdown && (
        <div className="fixed inset-0 z-10" onClick={() => setShowStateDropdown(false)} />
      )}


      <div className="px-4 pt-3">
        {/* ── Caste Filter Buttons ──────────────────────────────────────────────── */}
        <div className="mb-3">
          <p className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider mb-2">
            {isHindi ? 'जाति श्रेणी' : 'Caste Category'}
          </p>
          <div className="flex gap-2 flex-wrap">
            {casteFilters.map((cf) => (
              <motion.button
                key={cf.key}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveCaste(cf.key)}
                style={activeCaste === cf.key ? { backgroundColor: cf.color } : {}}
                className={`px-4 py-2 rounded-full text-[12px] font-bold transition-all border-2
                  ${activeCaste === cf.key
                    ? 'text-white border-transparent shadow-md'
                    : 'bg-white text-[#374151] border-gray-200 hover:border-gray-300'
                  }`}
              >
                {isHindi ? cf.labelHi : cf.label}
              </motion.button>
            ))}
          </div>
        </div>


        {/* ── Scheme Type Filter Chips ──────────────────────────────────────────── */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-3 hide-scrollbar">
          {schemeTypeFilters.map((filter) => (
            <button
              key={filter.en}
              onClick={() => setActiveTypeFilter(filter.en)}
              className={`px-4 py-2 rounded-full text-[12px] font-semibold whitespace-nowrap transition-all border
                ${activeTypeFilter === filter.en
                  ? 'bg-[#F5A623] text-white border-[#F5A623] shadow-sm shadow-[#F5A623]/30'
                  : 'bg-white text-[#1C1C1E] border-gray-200'
                }`}
            >
              {isHindi ? filter.hi : filter.en}
            </button>
          ))}
        </div>


        {/* ── Match Banner ──────────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-3xl p-4 mb-4 shadow-sm border border-gray-100 flex items-start gap-3"
        >
          <div className="w-10 h-10 rounded-2xl bg-[#F5A623]/10 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-5 h-5 text-[#F5A623]" />
          </div>
          <div className="flex-1">
            <p className="text-[14px] font-semibold text-[#1C1C1E] mb-1">
              {isHindi
                ? `${filteredSchemes.length} योजनाएं मिलीं`
                : `${filteredSchemes.length} schemes found`}
              {activeCaste !== 'All' && (
                <span
                  className="ml-2 text-[11px] font-bold px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: casteFilters.find((c) => c.key === activeCaste)?.color + '20', color: casteFilters.find((c) => c.key === activeCaste)?.color }}
                >
                  {activeCaste}
                </span>
              )}
            </p>
            <p className="text-[12px] text-[#6B7280]">
              {isHindi
                ? `प्रोफ़ाइल ${profileCompletion}% पूरी • अधिक योजनाओं के लिए प्रोफ़ाइल अपडेट करें`
                : `Profile ${profileCompletion}% complete • Complete profile to unlock more`}
            </p>
          </div>
          <button
            onClick={() => navigate('/onboarding/profile')}
            className="ml-2 text-[11px] font-semibold text-[#F5A623] underline"
          >
            {isHindi ? 'प्रोफ़ाइल' : 'Profile'}
          </button>
        </motion.div>


        {/* ── Scheme List ───────────────────────────────────────────────────────── */}
        <div className="space-y-3 mb-4">
          {filteredSchemes.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center"
            >
              <p className="text-2xl mb-3">🔍</p>
              <p className="text-[14px] text-[#1C1C1E] font-semibold mb-1">
                {isHindi ? 'कोई योजना नहीं मिली' : 'No schemes found'}
              </p>
              <p className="text-[12px] text-[#6B7280]">
                {isHindi
                  ? 'फिल्टर बदलकर फिर से प्रयास करें'
                  : 'Try changing filters, state, or caste category'}
              </p>
            </motion.div>
          ) : (
            filteredSchemes.map((scheme, idx) => (
              <motion.div
                key={scheme.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.18, delay: idx * 0.04 }}
              >
                {/* Caste eligibility badges on top of SchemeCard */}
                <div className="flex gap-1.5 mb-1 px-1">
                  {scheme.casteCategories
                    .filter((c) => c !== 'All')
                    .map((c) => (
                      <span
                        key={c}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${casteBadgeConfig[c]?.bg} ${casteBadgeConfig[c]?.text}`}
                      >
                        {casteBadgeConfig[c]?.label}
                      </span>
                    ))}
                </div>
                <SchemeCard
                  id={scheme.id}
                  name={scheme.name}
                  nameHi={scheme.nameHi}
                  nameMr={scheme.nameHi}
                  amount={scheme.amount}
                  amountHi={scheme.amountHi}
                  amountMr={scheme.amountHi}
                  type={scheme.type}
                  deadline={scheme.deadline}
                  deadlineHi={scheme.deadlineHi}
                  deadlineMr={scheme.deadlineHi}
                  docsRequired={scheme.docsRequired}
                  eligible={scheme.eligible}
                  logo={scheme.logo}
                />
              </motion.div>
            ))
          )}
        </div>
      </div>


      <BottomNav />


      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}

