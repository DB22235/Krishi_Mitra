

import { useState, useEffect } from 'react';
import { Bell, Menu, ArrowRight, Search, FileText, BarChart3, AlertCircle, Sparkles, ChevronRight, Calendar, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { BottomNav } from '../components/BottomNav';
import { useLanguage } from '../../context/LanguageContext';
import { useUser } from '../../context/UserContext';


export function Dashboard() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { userData, getProfileCompletion, getPendingTasks } = useUser();
  const isHindi = language === 'hi';


  const [animatedPercent, setAnimatedPercent] = useState(0);
  const profileCompletion = getProfileCompletion();
  const pendingTasks = getPendingTasks();


  // Animate profile completion
  useEffect(() => {
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        setAnimatedPercent((prev) => {
          if (prev >= profileCompletion) {
            clearInterval(interval);
            return profileCompletion;
          }
          return prev + 1;
        });
      }, 30);
      return () => clearInterval(interval);
    }, 300);
    return () => clearTimeout(timer);
  }, [profileCompletion]);


  // Get greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return isHindi ? 'सुप्रभात' : 'Good Morning';
    if (hour < 17) return isHindi ? 'नमस्कार' : 'Good Afternoon';
    if (hour < 20) return isHindi ? 'शुभ संध्या' : 'Good Evening';
    return isHindi ? 'शुभ रात्रि' : 'Good Night';
  };


  // Get user's first name
  const getFirstName = () => {
    if (!userData.name) return isHindi ? 'किसान' : 'Farmer';
    const firstName = userData.name.split(' ')[0];
    return firstName;
  };


  // Get matched schemes count based on profile
  const getMatchedSchemesCount = () => {
    let count = 5; // Base schemes
    if (userData.landOwnership) count += 3;
    if (userData.selectedCrops.length > 0) count += userData.selectedCrops.length;
    if (userData.irrigation.length > 0) count += 2;
    if (userData.annualIncome) count += 4;
    return Math.min(count, 25);
  };


  const schemes = [
    {
      id: 'pm-kisan',
      name: 'PM-Kisan Samman Nidhi',
      nameHi: 'प्रधानमंत्री किसान सम्मान निधि',
      amount: '₹6,000/year',
      amountHi: '₹6,000/वर्ष',
      type: isHindi ? 'केंद्र सरकार' : 'Central Govt',
      deadline: isHindi ? '31 मार्च' : 'March 31',
      daysLeft: 15,
      docsRequired: 3,
      eligible: true,
      logo: '🏛️',
      color: 'bg-green-500',
    },
    {
      id: 'pmfby',
      name: 'PM Fasal Bima Yojana',
      nameHi: 'प्रधानमंत्री फसल बीमा योजना',
      amount: 'Up to ₹2L',
      amountHi: '₹2 लाख तक',
      type: isHindi ? 'केंद्र सरकार' : 'Central Govt',
      deadline: isHindi ? '28 फरवरी' : 'Feb 28',
      daysLeft: 7,
      docsRequired: 4,
      eligible: true,
      logo: '🌾',
      color: 'bg-blue-500',
    },
    {
      id: 'soil-health',
      name: 'Soil Health Card Scheme',
      nameHi: 'मृदा स्वास्थ्य कार्ड योजना',
      amount: 'Free Testing',
      amountHi: 'मुफ्त जांच',
      type: isHindi ? 'राज्य सरकार' : 'State Govt',
      deadline: isHindi ? '15 मार्च' : 'March 15',
      daysLeft: 21,
      docsRequired: 2,
      eligible: true,
      logo: '🌱',
      color: 'bg-amber-500',
    },
  ];


  const quickActions = [
    {
      icon: Search,
      label: isHindi ? 'योजना खोजें' : 'Search Schemes',
      path: '/schemes',
      color: 'bg-blue-50',
      iconColor: 'text-blue-500',
    },
    {
      icon: FileText,
      label: isHindi ? 'आवेदन करें' : 'Apply Now',
      path: '/schemes',
      color: 'bg-green-50',
      iconColor: 'text-green-500',
    },
    {
      icon: BarChart3,
      label: isHindi ? 'स्थिति देखें' : 'Check Status',
      path: '/applications',
      color: 'bg-amber-50',
      iconColor: 'text-amber-500',
    },
    {
      icon: AlertCircle,
      label: isHindi ? 'रिमाइंडर' : 'Reminders',
      path: '/notifications',
      color: 'bg-red-50',
      iconColor: 'text-red-500',
    },
  ];


  const urgentAlerts = [
    {
      id: 1,
      title: isHindi ? 'PM-Kisan आवेदन की आखिरी तारीख' : 'PM-Kisan Application Deadline',
      subtitle: isHindi ? 'केवल 3 दिन बाकी हैं' : 'Only 3 days remaining',
      type: 'urgent',
      color: 'border-[#FB923C]',
      dotColor: 'bg-[#F87171]',
      action: isHindi ? 'अभी आवेदन करें' : 'Apply Now',
      path: '/schemes/pm-kisan',
    },
    {
      id: 2,
      title: isHindi ? 'PMFBY आवेदन अंडर रिव्यू में है' : 'PMFBY Application Under Review',
      subtitle: isHindi ? 'अनुमानित समय: 7 दिन' : 'Estimated time: 7 days',
      type: 'info',
      color: 'border-[#60A5FA]',
      dotColor: 'bg-[#60A5FA]',
      action: isHindi ? 'स्थिति देखें' : 'View Status',
      path: '/applications',
    },
  ];


  return (
    <div className="min-h-screen bg-[#F7F3EE] pb-24">
      {/* Header */}
      <div className="bg-gradient-to-b from-[#1A3C1A] to-[#2D6A2D] pt-10 pb-10 px-4">
        <div className="flex items-center justify-between mb-6">
          <motion.button
            onClick={() => navigate('/profile')}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center"
          >
            <Menu className="w-5 h-5 text-white" />
          </motion.button>
         
          {/* <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-bold text-white text-[18px]"
          >
            {isHindi ? 'कृषि मित्र' : 'Krishi Mitra'}
          </motion.h1> */}
            <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center"
    >
      <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center bg-white shadow-lg ring-2 ring-[#F5A623] mb-1">
        <img
          src="/logo.png"
          alt="Krishi Mitra Logo"
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
            e.currentTarget.parentElement!.innerHTML = '<span class="text-xl">🌾</span>';
          }}
        />
      </div>
      <h1 className="font-bold text-white text-[16px]">
        {isHindi ? 'कृषि मित्र' : 'Krishi Mitra'}
      </h1>
    </motion.div>
         
          <motion.button
            onClick={() => navigate('/notifications')}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="relative w-10 h-10 rounded-full bg-white/10 flex items-center justify-center"
          >
            <Bell className="w-5 h-5 text-white" />
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 w-5 h-5 bg-[#F87171] rounded-full flex items-center justify-center text-white text-[10px] font-bold border-2 border-[#1A3C1A]"
            >
              3
            </motion.div>
          </motion.button>
        </div>


        {/* Greeting Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/10 backdrop-blur-sm rounded-3xl p-5 border border-white/20"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              {/* Profile Image */}
              <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center overflow-hidden border-2 border-[#F5A623]">
                {userData.profileImage ? (
                  <img
                    src={userData.profileImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-3xl">👨‍🌾</span>
                )}
              </div>
              <div>
                <p className="text-[#97BC62] text-[13px] mb-0.5">{getGreeting()}</p>
                <h2 className="text-white font-bold text-[20px]">
                  {getFirstName()} {isHindi ? 'जी' : ''}! 👋
                </h2>
              </div>
            </div>
          </div>


          {/* Profile Completion */}
          <div className="bg-[#1A3C1A]/50 rounded-2xl p-4 mb-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[#C8D8C8] text-[12px]">
                {isHindi ? 'प्रोफ़ाइल पूर्णता' : 'Profile Completion'}
              </span>
              <motion.span
                key={animatedPercent}
                initial={{ scale: 1.3 }}
                animate={{ scale: 1 }}
                className={`text-[14px] font-bold ${
                  animatedPercent >= 80 ? 'text-green-400' :
                  animatedPercent >= 50 ? 'text-[#F5A623]' :
                  'text-red-400'
                }`}
              >
                {animatedPercent}%
              </motion.span>
            </div>
            <div className="w-full bg-[#1A3C1A] h-2 rounded-full overflow-hidden mb-3">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${animatedPercent}%` }}
                transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
                className={`h-full rounded-full ${
                  animatedPercent >= 80 ? 'bg-green-400' :
                  animatedPercent >= 50 ? 'bg-[#F5A623]' :
                  'bg-red-400'
                }`}
              />
            </div>
           
            {pendingTasks.length > 0 && animatedPercent < 100 && (
              <motion.button
                onClick={() => navigate('/onboarding/profile')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-[#F5A623] text-[#1A3C1A] py-2.5 rounded-xl font-bold text-[13px] flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                {isHindi ? 'प्रोफ़ाइल पूरा करें' : 'Complete Profile'}
              </motion.button>
            )}
          </div>


          {/* Location */}
          {(userData.district || userData.state) && (
            <div className="flex items-center gap-1 text-[#97BC62] text-[12px]">
              <span>📍</span>
              <span>
                {userData.district}{userData.district && userData.state ? ', ' : ''}{userData.state}
              </span>
            </div>
          )}


          {/* Farm Summary */}
          {userData.landSize > 0 && (
            <div className="flex items-center gap-3 mt-2 text-[12px]">
              <span className="text-[#C8D8C8] flex items-center gap-1">
                🌾 {userData.landSize} {userData.landUnit}
              </span>
              {userData.selectedCrops.length > 0 && (
                <span className="text-[#C8D8C8]">
                  • {userData.selectedCrops.length} {isHindi ? 'फसलें' : 'crops'}
                </span>
              )}
            </div>
          )}
        </motion.div>
      </div>


      {/* Scheme Match Banner */}
      <div className="px-4 -mt-5 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onClick={() => navigate('/schemes')}
          className="bg-white rounded-3xl p-5 shadow-lg border border-gray-100 cursor-pointer hover:shadow-xl transition-all"
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-10 h-10 rounded-2xl bg-[#F5A623]/10 flex items-center justify-center">
                  <span className="text-2xl">🎯</span>
                </div>
                <div>
                  <h3 className="font-bold text-[16px] text-[#1C1C1E]">
                    {isHindi
                      ? `आपके लिए ${getMatchedSchemesCount()} योजनाएं मिलीं!`
                      : `${getMatchedSchemesCount()} Schemes Found for You!`}
                  </h3>
                  <p className="text-[12px] text-[#6B7280]">
                    {isHindi ? 'आपकी प्रोफ़ाइल के आधार पर' : 'Based on your profile'}
                  </p>
                </div>
              </div>
              <div className="flex gap-2 flex-wrap mt-3">
                <span className="bg-[#F7F3EE] text-[#1C1C1E] px-3 py-1.5 rounded-xl text-[11px] font-semibold">
                  PM-Kisan
                </span>
                <span className="bg-[#F7F3EE] text-[#1C1C1E] px-3 py-1.5 rounded-xl text-[11px] font-semibold">
                  PMFBY
                </span>
                <span className="bg-[#F5A623]/10 text-[#F5A623] px-3 py-1.5 rounded-xl text-[11px] font-semibold">
                  +{getMatchedSchemesCount() - 2} {isHindi ? 'और' : 'more'}
                </span>
              </div>
            </div>
            <motion.div
              whileHover={{ x: 5 }}
              className="w-10 h-10 rounded-full bg-[#F5A623] flex items-center justify-center ml-3"
            >
              <ArrowRight className="w-5 h-5 text-white" />
            </motion.div>
          </div>
        </motion.div>
      </div>


      {/* Quick Actions */}
      <div className="px-4 mb-6">
        <motion.h3
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="font-bold text-[16px] text-[#1C1C1E] mb-3"
        >
          {isHindi ? 'त्वरित कार्य' : 'Quick Actions'}
        </motion.h3>
        <div className="grid grid-cols-4 gap-3">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <motion.button
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                onClick={() => navigate(action.path)}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="flex flex-col items-center gap-2 bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
              >
                <div className={`w-12 h-12 rounded-2xl ${action.color} flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${action.iconColor}`} />
                </div>
                <span className="text-[11px] text-[#1C1C1E] font-semibold text-center leading-tight">
                  {action.label}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>


      {/* Urgent Alerts */}
      <div className="px-4 mb-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex items-center justify-between mb-3"
        >
          <h3 className="font-bold text-[16px] text-[#1C1C1E] flex items-center gap-2">
            <span>⚠️</span>
            {isHindi ? 'जरूरी सूचनाएं' : 'Urgent Alerts'}
          </h3>
          <button
            onClick={() => navigate('/notifications')}
            className="text-[#F5A623] text-[12px] font-semibold flex items-center gap-1"
          >
            {isHindi ? 'सभी देखें' : 'View All'}
            <ChevronRight className="w-4 h-4" />
          </button>
        </motion.div>


        <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4">
          {urgentAlerts.map((alert, index) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className={`bg-white rounded-2xl p-4 min-w-[280px] border-l-4 ${alert.color} shadow-sm flex-shrink-0`}
            >
              <div className="flex items-start gap-2 mb-3">
                <div className={`w-2 h-2 ${alert.dotColor} rounded-full mt-1.5 flex-shrink-0`} />
                <div className="flex-1">
                  <h4 className="font-semibold text-[14px] text-[#1C1C1E] mb-1 leading-tight">
                    {alert.title}
                  </h4>
                  <p className="text-[12px] text-[#6B7280]">
                    {alert.subtitle}
                  </p>
                </div>
              </div>
              <motion.button
                onClick={() => navigate(alert.path)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full py-2.5 rounded-xl text-[13px] font-semibold ${
                  alert.type === 'urgent'
                    ? 'bg-[#F5A623] text-white'
                    : 'bg-[#F7F3EE] text-[#1C1C1E]'
                }`}
              >
                {alert.action}
              </motion.button>
            </motion.div>
          ))}
        </div>
      </div>


      {/* Recommended Schemes */}
      <div className="px-4 mb-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex items-center justify-between mb-3"
        >
          <h3 className="font-bold text-[16px] text-[#1C1C1E]">
            {isHindi ? 'आपके लिए अनुशंसित योजनाएं' : 'Recommended Schemes'}
          </h3>
          <button
            onClick={() => navigate('/schemes')}
            className="text-[#F5A623] text-[12px] font-semibold flex items-center gap-1"
          >
            {isHindi ? 'और देखें' : 'View More'}
            <ChevronRight className="w-4 h-4" />
          </button>
        </motion.div>


        <div className="space-y-3">
          {schemes.map((scheme, index) => (
            <motion.div
              key={scheme.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              onClick={() => navigate(`/schemes/${scheme.id}`)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 cursor-pointer"
            >
              <div className="flex items-start gap-3">
                {/* Scheme Icon */}
                <div className={`w-12 h-12 rounded-2xl ${scheme.color}/10 flex items-center justify-center flex-shrink-0`}>
                  <span className="text-2xl">{scheme.logo}</span>
                </div>


                {/* Scheme Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className="font-semibold text-[14px] text-[#1C1C1E] leading-tight">
                      {isHindi ? scheme.nameHi : scheme.name}
                    </h4>
                    {scheme.eligible && (
                      <div className="flex items-center gap-1 bg-green-50 px-2 py-0.5 rounded-full flex-shrink-0">
                        <CheckCircle className="w-3 h-3 text-green-500" />
                        <span className="text-[10px] text-green-600 font-semibold">
                          {isHindi ? 'पात्र' : 'Eligible'}
                        </span>
                      </div>
                    )}
                  </div>
                 
                  <p className="text-[12px] text-[#6B7280] mb-2">{scheme.type}</p>
                 
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-[#F5A623] font-bold text-[14px]">
                        {isHindi ? scheme.amountHi : scheme.amount}
                      </span>
                      <span className="text-[11px] text-[#6B7280] flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {scheme.deadline}
                      </span>
                    </div>
                    <div className={`px-2 py-1 rounded-lg text-[10px] font-semibold ${
                      scheme.daysLeft <= 7
                        ? 'bg-red-50 text-red-600'
                        : scheme.daysLeft <= 15
                        ? 'bg-amber-50 text-amber-600'
                        : 'bg-green-50 text-green-600'
                    }`}>
                      {scheme.daysLeft} {isHindi ? 'दिन' : 'days'}
                    </div>
                  </div>
                </div>


                <ChevronRight className="w-5 h-5 text-gray-300 flex-shrink-0" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>


      {/* Profile Completion Reminder (if less than 50%) */}
      <AnimatePresence>
        {profileCompletion < 50 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="px-4 mb-6"
          >
            <div className="bg-gradient-to-r from-[#F5A623]/10 to-[#97BC62]/10 rounded-2xl p-5 border border-dashed border-[#F5A623]/30">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#F5A623]/20 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-6 h-6 text-[#F5A623]" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-[14px] text-[#1C1C1E] mb-1">
                    {isHindi ? 'अपनी प्रोफ़ाइल पूरी करें' : 'Complete Your Profile'}
                  </h4>
                  <p className="text-[12px] text-[#6B7280] mb-3">
                    {isHindi
                      ? 'पूरी प्रोफ़ाइल के साथ आप अधिक योजनाओं के लिए पात्र हो सकते हैं।'
                      : 'Complete profile helps you find more eligible schemes.'}
                  </p>
                  <div className="flex gap-2">
                    {pendingTasks.slice(0, 2).map((task, index) => (
                      <span
                        key={index}
                        className="bg-white text-[10px] text-[#6B7280] px-2 py-1 rounded-lg font-medium"
                      >
                        {isHindi ? task.hi : task.en}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <motion.button
                onClick={() => navigate('/onboarding/profile')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full mt-4 bg-[#F5A623] text-white py-3 rounded-xl font-bold text-[14px] flex items-center justify-center gap-2"
              >
                {isHindi ? 'अभी पूरा करें' : 'Complete Now'}
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>


      <BottomNav />
    </div>
  );
}
