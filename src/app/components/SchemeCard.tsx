import { Calendar, FileText, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useLanguage } from '../../context/LanguageContext';

interface SchemeCardProps {
  id: string;
  name: string;
  nameHi: string;
  nameMr: string;
  amount: string;
  amountHi: string;
  amountMr: string;
  type: string;
  deadline: string;
  deadlineHi: string;
  deadlineMr: string;
  docsRequired: number;
  eligible: boolean;
  logo?: string;
  onClick?: () => void;
}

export function SchemeCard({
  id,
  name,
  nameHi,
  nameMr,
  amount,
  amountHi,
  amountMr,
  type,
  deadline,
  deadlineHi,
  deadlineMr,
  docsRequired,
  eligible,
  logo,
  onClick
}: SchemeCardProps) {
  const navigate = useNavigate();
  const { language } = useLanguage();

  const localize = (en: string, hi: string, mr: string) => {
    if (language === 'mr') return mr;
    if (language === 'hi') return hi;
    return en;
  };

  const localizedName = localize(name, nameHi, nameMr);
  const localizedAmount = localize(amount, amountHi, amountMr);
  const localizedDeadline = localize(deadline, deadlineHi, deadlineMr);

  return (
    <div
      onClick={onClick || (() => navigate(`/scheme-matcher/${id}`))}
      className="bg-white rounded-2xl p-4 shadow-sm border-l-4 border-[#2D6A2D] cursor-pointer hover:shadow-md transition-shadow"
    >
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-[#1A3C1A] flex items-center justify-center text-white text-lg flex-shrink-0">
          {logo || '🏛️'}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-[15px] text-[#1C1C1E] leading-tight mb-0.5">
                {localizedName}
              </h3>
              <p className="text-[13px] text-[#6B7280] leading-tight">
                {language === 'en' ? nameHi : name}
              </p>
            </div>
            {eligible && (
              <CheckCircle className="w-5 h-5 text-[#97BC62] flex-shrink-0" />
            )}
          </div>
        </div>
      </div>

      <div className="text-[13px] text-[#6B7280] mb-3">
        {localizedAmount} • {type} • <span className="text-[#97BC62] font-medium">
          {localize("You're Eligible!", "आप पात्र हैं!", "तुम्ही पात्र आहात!")}
        </span>
      </div>

      <div className="border-t border-gray-100 pt-3 flex items-center justify-between text-[12px]">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-[#6B7280]">
            <Calendar className="w-3.5 h-3.5" />
            <span>{localize('Deadline', 'समय सीमा', 'अंतिम तारीख')}: {localizedDeadline}</span>
          </div>
          <div className="flex items-center gap-1 text-[#6B7280]">
            <FileText className="w-3.5 h-3.5" />
            <span>{localize('Docs', 'दस्तावेज़', 'कागदपत्रे')}: {docsRequired}</span>
          </div>
        </div>
      </div>

      <div className="flex gap-2 mt-3">
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/apply/${id}`);
          }}
          className="flex-1 bg-[#F5A623] text-[#1C1C1E] py-2.5 rounded-xl font-medium text-[14px] hover:bg-[#E09515] transition-colors"
        >
          {localize('Apply Now', 'आवेदन करें', 'अर्ज करा')}
        </button>
        <button
          onClick={(e) => e.stopPropagation()}
          className="px-4 py-2.5 rounded-xl border border-gray-200 font-medium text-[14px] text-[#6B7280] hover:bg-gray-50 transition-colors"
        >
          {localize('Save', 'सेव करें', 'सेव्ह करा')}
        </button>
      </div>
    </div>
  );
}
