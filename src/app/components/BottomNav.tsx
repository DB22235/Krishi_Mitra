
//src/components/BottomNav.tsx



// src/components/BottomNav.tsx

import { Home, Search, FileText, MessageCircle, User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router';
import { motion } from 'motion/react';
import { useLanguage } from '../../context/LanguageContext';


export function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { language } = useLanguage();
  const isHindi = language === 'hi';


  const navItems = [
    {
      icon: Home,
      label: 'Home',
      labelHi: 'होम',
      path: '/dashboard'
    },
    {
      icon: Search,
      label: 'Schemes',
      labelHi: 'योजनाएं',
      path: '/schemes'
    },
    {
      icon: FileText,
      label: 'Applications',
      labelHi: 'आवेदन',
      path: '/applications'
    },
    {
      icon: MessageCircle,
      label: 'Chat',
      labelHi: 'चैट',
      path: '/chat'
    },
    {
      icon: User,
      label: 'Profile',
      labelHi: 'प्रोफाइल',
      path: '/profile'
    },
  ];


  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-gray-100 h-20 flex items-center justify-around px-2 z-50 safe-area-bottom">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path ||
                        (item.path === '/schemes' && location.pathname.startsWith('/schemes/'));
       
        return (
          <motion.button
            key={item.path}
            onClick={() => navigate(item.path)}
            whileTap={{ scale: 0.9 }}
            className="relative flex flex-col items-center justify-center gap-1 min-w-[64px] py-2"
          >
            {/* Active Indicator */}
            {isActive && (
              <motion.div
                layoutId="activeTab"
                className="absolute -top-1 w-12 h-1 bg-[#F5A623] rounded-full"
                initial={false}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            )}


            {/* Icon Container */}
            <motion.div
              animate={{
                scale: isActive ? 1.1 : 1,
                y: isActive ? -2 : 0
              }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-colors ${
                isActive
                  ? 'bg-[#F5A623]/10'
                  : 'bg-transparent'
              }`}
            >
              <Icon
                className={`w-5 h-5 transition-colors ${
                  isActive ? 'text-[#F5A623]' : 'text-gray-400'
                }`}
                strokeWidth={isActive ? 2.5 : 2}
              />
            </motion.div>


            {/* Label */}
            <span
              className={`text-[10px] transition-colors ${
                isActive
                  ? 'text-[#F5A623] font-semibold'
                  : 'text-gray-400 font-medium'
              }`}
            >
              {isHindi ? item.labelHi : item.label}
            </span>
          </motion.button>
        );
      })}
    </nav>
  );
}
