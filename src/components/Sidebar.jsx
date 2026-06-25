import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard, Clock, Plus, PiggyBank, User, Wallet, Crown
} from 'lucide-react';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/history',   label: 'History',   icon: Clock },
  { path: '/budgets',   label: 'Budgets & Goals', icon: PiggyBank },
  { path: '/profile',   label: 'Profile',   icon: User },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isPremium } = useApp();

  return (
    <aside className="hidden lg:flex flex-col w-60 shrink-0 bg-brand-blue-card border-r border-white/5 min-h-screen sticky top-0 z-30">

      {/* Logo */}
      <div className="px-6 py-5 border-b border-white/5 flex items-center gap-2.5 select-none">
        <div className="p-2 bg-brand-mint/10 rounded-xl text-brand-mint border border-brand-mint/20 shrink-0">
          <Wallet size={16} />
        </div>
        <span className="font-extrabold text-base tracking-tight bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
          MoneyBuddy
        </span>
        <div className="w-1.5 h-1.5 rounded-full bg-brand-mint glow-mint animate-pulse shrink-0" />
      </div>

      {/* Navigation items */}
      <nav className="flex-1 p-3 flex flex-col gap-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="relative flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all active:scale-[0.98] group w-full text-left"
            >
              {isActive && (
                <motion.div
                  layoutId="sidebarActiveIndicator"
                  className="absolute inset-0 bg-white/5 rounded-xl border border-white/5"
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
              )}
              <Icon
                size={18}
                className={`relative z-10 shrink-0 transition-colors duration-200 ${
                  isActive ? 'text-brand-mint' : 'text-slate-400 group-hover:text-white'
                }`}
              />
              <span
                className={`relative z-10 text-sm font-semibold transition-colors duration-200 ${
                  isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}

        {/* Add Expense — special mint CTA */}
        <div className="mt-2">
          <button
            onClick={() => navigate('/add-expense')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all active:scale-[0.98] group ${
              location.pathname === '/add-expense'
                ? 'bg-brand-mint text-slate-950 glow-button'
                : 'bg-brand-mint/10 text-brand-mint border border-brand-mint/20 hover:bg-brand-mint hover:text-slate-950 hover:glow-button'
            }`}
          >
            <Plus size={18} className="shrink-0 stroke-[2.5]" />
            <span className="text-sm font-bold">Add Expense</span>
          </button>
        </div>
      </nav>

      {/* User footer */}
      <div className="p-4 border-t border-white/5 select-none">
        <div className="flex items-center gap-3">
          <div className="relative shrink-0">
            <div className={`w-9 h-9 rounded-full overflow-hidden border-2 ${
              isPremium ? 'border-amber-400' : 'border-slate-600'
            }`}>
              <svg viewBox="0 0 32 32" className="w-full h-full bg-slate-700 text-slate-300">
                <path fill="currentColor" d="M16 8a5 5 0 1 0 5 5 5 5 0 0 0-5-5zm0 11c-6.13 0-11 3.25-11 7h22c0-3.75-4.87-7-11-7z" />
              </svg>
            </div>
            {isPremium && (
              <div className="absolute -top-0.5 -right-0.5 bg-amber-400 text-slate-950 p-0.5 rounded-full shadow-sm">
                <Crown size={7} className="fill-amber-950" />
              </div>
            )}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-white truncate">
              {user?.name || 'Valued User'}
            </p>
            <p className="text-[10px] text-slate-400 font-medium truncate">
              {isPremium ? 'Premium Gold' : 'Standard Member'}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
