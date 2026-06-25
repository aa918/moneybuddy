import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, Plus, User, Clock, PiggyBank } from 'lucide-react';

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', label: 'Home', icon: LayoutDashboard },
    { path: '/history', label: 'History', icon: Clock },
    { path: '/add-expense', label: 'Add', icon: Plus, isCenter: true },
    { path: '/budgets', label: 'Budgets', icon: PiggyBank },
    { path: '/profile', label: 'Profile', icon: User }
  ];
  
  // Hide BottomNav on login and onboarding pages
  if (location.pathname === '/login' || location.pathname === '/onboarding') {
    return null;
  }
  
  return (
    <div className="lg:hidden absolute bottom-6 left-0 right-0 px-6 z-30 pointer-events-none">
      <div className="bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-3xl py-3 px-6 shadow-xl flex justify-between items-center max-w-sm mx-auto pointer-events-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          if (item.isCenter) {
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`relative p-4 rounded-2xl bg-brand-mint text-slate-950 shadow-lg cursor-pointer transform transition-all active:scale-95 glow-button -mt-8 hover:bg-brand-mint-dark`}
                aria-label="Add Expense"
              >
                <Icon size={24} className="stroke-[2.5]" />
              </button>
            );
          }
          
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="relative py-2 px-4 rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all active:scale-95 group"
            >
              {isActive && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute inset-0 bg-white/5 rounded-xl border border-white/5"
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
              )}
              <Icon
                size={20}
                className={`relative z-10 transition-colors duration-200 ${
                  isActive ? 'text-brand-mint' : 'text-slate-400 group-hover:text-white'
                }`}
              />
              <span
                className={`relative z-10 text-[10px] font-medium mt-1 transition-colors duration-200 ${
                  isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;
