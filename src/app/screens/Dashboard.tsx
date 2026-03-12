import { useState, useEffect } from 'react';
import { Bell, Menu, ArrowRight, Search, FileText, BarChart3, AlertCircle, Sparkles, ChevronRight, Calendar, CheckCircle, Wallet } from 'lucide-react';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
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
  const isMarathi = language === 'mr';

  // Helper to pick the right localized string
  const localize = (en: string, hi: string, mr: string) => {
    if (isMarathi) return mr;
    if (isHindi) return hi;
    return en;
  };


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
    if (hour < 12) return localize('Good Morning', 'सुप्रभात', 'सुप्रभात');
    if (hour < 17) return localize('Good Afternoon', 'नमस्कार', 'नमस्कार');
    if (hour < 20) return localize('Good Evening', 'शुभ संध्या', 'शुभ संध्याकाळ');
    return localize('Good Night', 'शुभ रात्रि', 'शुभ रात्री');
  };


  // Get user's first name
  const getFirstName = () => {
    if (!userData.name) return localize('Farmer', 'किसान', 'शेतकरी');
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


  // Financial Ledger calculations
  const totalReceived = userData.financialLedger
    ? userData.financialLedger.reduce((sum, tx) => sum + tx.amount, 0)
    : 0;

  // Format data for Recharts (Cumulative sum for stock-like graph)
  const sortedLedger = userData.financialLedger
    ? [...userData.financialLedger].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    : [];

  let cumulative = 0;
  // Initialize with a starting point if transactions exist
  const chartData: any[] = sortedLedger.length > 0 ? [{ date: 'Start', amount: 0, schemeName: '' }] : [];

  sortedLedger.forEach(tx => {
    cumulative += tx.amount;
    const dateObj = new Date(tx.date);
    chartData.push({
      date: dateObj.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
      amount: cumulative,
      schemeName: localize(tx.scheme, tx.schemeHi, tx.schemeMr)
    });
  });


  const quickActions = [
    {
      icon: Search,
      label: localize('Search Schemes', 'योजना खोजें', 'योजना शोधा'),
      path: '/schemes',
      color: 'bg-blue-50',
      iconColor: 'text-blue-500',
    },
    {
      icon: FileText,
      label: localize('Apply Now', 'आवेदन करें', 'अर्ज करा'),
      path: '/schemes',
      color: 'bg-green-50',
      iconColor: 'text-green-500',
    },
    {
      icon: BarChart3,
      label: localize('Check Status', 'स्थिति देखें', 'स्थिती पहा'),
      path: '/applications',
      color: 'bg-amber-50',
      iconColor: 'text-amber-500',
    },
    {
      icon: AlertCircle,
      label: localize('Reminders', 'रिमाइंडर', 'स्मरणपत्रे'),
      path: '/notifications',
      color: 'bg-red-50',
      iconColor: 'text-red-500',
    },
  ];





  // Get pending task text based on language
  const getPendingTaskText = (task: { en: string; hi: string; mr?: string }) => {
    return localize(task.en, task.hi, task.mr || task.en);
  };


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
              {localize('Krishi Mitra', 'कृषि मित्र', 'कृषी मित्र')}
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
                  <span className="text-3xl">🌱</span>
                )}
              </div>
              <div>
                <p className="text-[#97BC62] text-[13px] mb-0.5">{getGreeting()}</p>
                <h2 className="text-white font-bold text-[20px]">
                  {getFirstName()} {localize('', 'जी', 'जी')}! 👋
                </h2>
              </div>
            </div>
          </div>


          {/* Profile Completion */}
          <div className="bg-[#1A3C1A]/50 rounded-2xl p-4 mb-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[#C8D8C8] text-[12px]">
                {localize('Profile Completion', 'प्रोफ़ाइल पूर्णता', 'प्रोफाइल पूर्णता')}
              </span>
              <motion.span
                key={animatedPercent}
                initial={{ scale: 1.3 }}
                animate={{ scale: 1 }}
                className={`text-[14px] font-bold ${animatedPercent >= 80 ? 'text-green-400' :
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
                className={`h-full rounded-full ${animatedPercent >= 80 ? 'bg-green-400' :
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
                {localize('Complete Profile', 'प्रोफ़ाइल पूरा करें', 'प्रोफाइल पूर्ण करा')}
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
                  • {userData.selectedCrops.length} {localize('crops', 'फसलें', 'पिके')}
                </span>
              )}
            </div>
          )}
        </motion.div>
      </div>





      {/* Quick Actions */}
      <div className="px-4 mt-6 mb-6">
        <motion.h3
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="font-bold text-[16px] text-[#1C1C1E] mb-3"
        >
          {localize('Quick Actions', 'त्वरित कार्य', 'जलद कृती')}
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


      {/* Financial Ledger Section */}
      <div className="px-4 mb-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex items-center justify-between mb-3"
        >
          <h3 className="font-bold text-[16px] text-[#1C1C1E] flex items-center gap-2">
            <Wallet className="w-5 h-5 text-[#F5A623]" />
            {localize('Your Financial Ledger', 'आपकी वित्तीय खाता-बही', 'तुमची आर्थिक नोंदवही')}
          </h3>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100"
        >
          <div className="mb-6">
            <p className="text-[13px] text-[#6B7280] font-medium mb-1">
              {localize('Total Direct Benefits Received', 'प्राप्त कुल प्रत्यक्ष लाभ', 'मिळालेले एकूण थेट लाभ')}
            </p>
            <h2 className="text-3xl font-black text-[#1A3C1A]">
              ₹{totalReceived.toLocaleString('en-IN')}
            </h2>
          </div>

          {/* Stock-style Area Chart */}
          <div className="h-48 w-full mb-6 mt-2 relative">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: '#9CA3AF' }}
                  dy={10}
                  minTickGap={15}
                />
                <Tooltip
                  cursor={{ stroke: '#9CA3AF', strokeWidth: 1, strokeDasharray: '4 4' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', backgroundColor: '#1C1C1E', color: 'white' }}
                  itemStyle={{ color: '#22c55e', fontWeight: 'bold' }}
                  labelStyle={{ color: '#9CA3AF', marginBottom: '4px', fontSize: '12px' }}
                  formatter={(value: number, name: string, props: any) => [
                    `₹${value.toLocaleString('en-IN')}`,
                    props.payload.schemeName || localize('Total Balance', 'कुल बैलेंस', 'एकूण शिल्लक')
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="#22c55e"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorAmount)"
                  activeDot={{ r: 6, fill: '#22c55e', stroke: 'white', strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Ledger List */}
          <div className="space-y-4">
            <h4 className="font-bold text-[14px] text-[#1C1C1E] mb-2">
              {localize('Recent Deposits', 'हाल के जमा', 'नुकत्याच झालेल्या जमा')}
            </h4>

            {userData.financialLedger && userData.financialLedger.map((tx, index) => (
              <div key={tx.id} className="flex flex-col gap-1 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0">
                      <span className="text-lg">🏛️</span>
                    </div>
                    <div>
                      <h5 className="font-semibold text-[14px] text-[#1C1C1E]">
                        {localize(tx.scheme, tx.schemeHi, tx.schemeMr)}
                      </h5>
                      <span className="text-[12px] text-[#6B7280]">{tx.category}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-[14px] text-green-600">
                      +₹{tx.amount.toLocaleString('en-IN')}
                    </p>
                    <span className="text-[11px] text-[#6B7280]">
                      {new Date(tx.date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
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
                    {localize('Complete Your Profile', 'अपनी प्रोफ़ाइल पूरी करें', 'तुमचे प्रोफाइल पूर्ण करा')}
                  </h4>
                  <p className="text-[12px] text-[#6B7280] mb-3">
                    {localize(
                      'Complete profile helps you find more eligible schemes.',
                      'पूरी प्रोफ़ाइल के साथ आप अधिक योजनाओं के लिए पात्र हो सकते हैं।',
                      'पूर्ण प्रोफाइलने तुम्हाला अधिक पात्र योजना शोधण्यात मदत होते.'
                    )}
                  </p>
                  <div className="flex gap-2">
                    {pendingTasks.slice(0, 2).map((task, index) => (
                      <span
                        key={index}
                        className="bg-white text-[10px] text-[#6B7280] px-2 py-1 rounded-lg font-medium"
                      >
                        {getPendingTaskText(task)}
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
                {localize('Complete Now', 'अभी पूरा करें', 'आता पूर्ण करा')}
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

