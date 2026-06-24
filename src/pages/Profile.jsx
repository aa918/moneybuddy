import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { supabase } from '../lib/supabase';
import { 
  ChevronRight, 
  Shield, 
  Bell, 
  Tags, 
  Link2, 
  LogOut, 
  Crown,
  Sparkles,
  DollarSign,
  TrendingUp,
  Target,
  Edit2,
  Check,
  X
} from 'lucide-react';

const Profile = () => {
  const { user, isPremium, togglePremium, profile, updateProfile, loading } = useApp();
  const navigate = useNavigate();

  const [isEditingIncome, setIsEditingIncome] = useState(false);
  const [editedIncome, setEditedIncome] = useState('');
  const [isSavingIncome, setIsSavingIncome] = useState(false);

  const settingsItems = [
    { id: 'security', label: 'Account Security', icon: Shield },
    { id: 'notifications', label: 'Push Notifications', icon: Bell },
    { id: 'categories', label: 'Manage Categories', icon: Tags },
    { id: 'accounts', label: 'Connected Bank Accounts', icon: Link2 }
  ];

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#0F1F35]">
        <div className="w-8 h-8 border-2 border-brand-mint border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const handleEditIncome = () => {
    setEditedIncome(profile?.monthly_income?.toString() || '');
    setIsEditingIncome(true);
  };

  const handleSaveIncome = async () => {
    const val = parseFloat(editedIncome);
    if (isNaN(val) || val <= 0) return;
    setIsSavingIncome(true);
    await updateProfile({ monthly_income: val, budget: val });
    setIsSavingIncome(false);
    setIsEditingIncome(false);
  };

  const handleUpdateInvesting = async (pref) => {
    await updateProfile({ investment_status: pref });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="flex-1 flex flex-col p-6 pb-32 gap-6 bg-[#0F1F35] overflow-y-auto no-scrollbar"
    >
      {/* Avatar details block */}
      <div className="flex flex-col items-center text-center mt-2 select-none">
        <div className="relative mb-3">
          <div className={`w-20 h-20 rounded-full overflow-hidden border-4 transition-all duration-300 ${
            isPremium ? 'border-amber-400 scale-105' : 'border-slate-700'
          } shadow-xl`}>
            {/* SVG Avatar to ensure proper assets display offline */}
            <svg viewBox="0 0 32 32" className="w-full h-full bg-slate-800 text-slate-400">
              <path fill="currentColor" d="M16 8a5 5 0 1 0 5 5 5 5 0 0 0-5-5zm0 11c-6.13 0-11 3.25-11 7h22c0-3.75-4.87-7-11-7z" />
            </svg>
          </div>
          {isPremium && (
            <div className="absolute bottom-0 right-0 bg-amber-400 text-slate-950 p-1.5 rounded-full shadow-md animate-bounce">
              <Crown size={11} className="fill-amber-950" />
            </div>
          )}
        </div>
        <h2 className="text-lg font-extrabold text-white tracking-tight">{user?.name || 'Valued User'}</h2>
        <p className="text-[11px] text-slate-400 mt-0.5 font-medium">{user?.email}</p>
      </div>

      {/* Premium upgrade card */}
      <div className="relative overflow-hidden rounded-3xl shadow-lg border border-white/5">
        <div className={`p-5 flex flex-col justify-between transition-all duration-300 ${
          isPremium 
            ? 'bg-gradient-to-br from-amber-500 via-yellow-400 to-amber-600 text-slate-950' 
            : 'bg-brand-blue-card text-white'
        }`}>
          {/* Ambient overlay vector */}
          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-28 h-28 bg-white/10 rounded-full blur-xl pointer-events-none" />

          <div className="flex justify-between items-start mb-3 select-none">
            <div>
              <span className={`text-[9px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                isPremium ? 'bg-amber-950 text-amber-300' : 'bg-brand-mint/10 text-brand-mint border border-brand-mint/20'
              }`}>
                {isPremium ? 'VIP Active' : 'Special Deal'}
              </span>
              <h3 className={`text-sm font-black tracking-tight mt-1.5 ${
                isPremium ? 'text-slate-950' : 'text-white'
              }`}>
                {isPremium ? 'MoneyBuddy Premium Gold' : 'Upgrade to Premium'}
              </h3>
            </div>
            <div className={`p-2 rounded-xl ${
              isPremium ? 'bg-amber-950/20 text-amber-950' : 'bg-brand-mint/10 text-brand-mint shadow-inner'
            }`}>
              <Sparkles size={18} className={isPremium ? 'animate-pulse' : ''} />
            </div>
          </div>

          <p className={`text-[11px] mb-4 font-semibold leading-relaxed ${
            isPremium ? 'text-amber-950/80' : 'text-slate-400'
          }`}>
            {isPremium 
              ? 'You have unlocked 1.5% APY cash back, custom categories, AI spending predictions, and dedicated live help.'
              : 'Unlock automated category allocations, 1.5% APY dividends, multi-bank syncing, and smart cash analytics.'
            }
          </p>

          <button
            onClick={togglePremium}
            className={`w-full py-3 rounded-2xl font-extrabold text-[10px] uppercase tracking-wider shadow-md transition-all active:scale-95 duration-250 cursor-pointer ${
              isPremium 
                ? 'bg-slate-950 hover:bg-slate-900 text-white' 
                : 'bg-brand-mint hover:bg-brand-mint-dark text-slate-950 glow-button'
            }`}
          >
            {isPremium ? 'Downgrade Subscription' : 'Unlock VIP for $4.99/mo'}
          </button>
        </div>
      </div>

      {/* Financial Profile Card */}
      <div className="flex flex-col gap-2.5 bg-brand-blue-card rounded-3xl p-5 border border-white/5">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider select-none pl-1">
          Financial Profile
        </h3>
        
        <div className="flex flex-col gap-4 mt-1.5">
          {/* Income Edit Row */}
          <div className="flex flex-col gap-1 px-4 py-3.5 rounded-2xl bg-slate-900/40 border border-white/5">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 text-slate-400">
                <DollarSign size={14} className="stroke-[2.2]" />
                <span className="text-[11px] font-bold">Monthly Income</span>
              </div>
              {!isEditingIncome && (
                <button
                  onClick={handleEditIncome}
                  className="p-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <Edit2 size={12} />
                </button>
              )}
            </div>

            <AnimatePresence mode="wait">
              {isEditingIncome ? (
                <motion.div 
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="flex items-center gap-2 mt-1"
                >
                  <div className="flex-1 flex items-center bg-[#0F1F35] border border-white/10 focus-within:border-brand-mint rounded-xl px-2.5 py-1.5 transition-colors">
                    <span className="text-slate-400 text-sm font-bold">$</span>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={editedIncome}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (/^\d*\.?\d{0,2}$/.test(val) || val === '') setEditedIncome(val);
                      }}
                      className="w-full bg-transparent border-none text-xs text-white font-bold outline-none pl-1"
                      autoFocus
                    />
                  </div>
                  <button
                    onClick={handleSaveIncome}
                    disabled={isSavingIncome}
                    className="p-2 bg-brand-mint text-slate-950 rounded-xl hover:bg-brand-mint-dark active:scale-95 transition-all cursor-pointer"
                  >
                    <Check size={12} className="stroke-[3]" />
                  </button>
                  <button
                    onClick={() => setIsEditingIncome(false)}
                    className="p-2 bg-slate-800 text-slate-300 rounded-xl hover:bg-slate-700 active:scale-95 transition-all cursor-pointer"
                  >
                    <X size={12} />
                  </button>
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-base font-extrabold text-white mt-1"
                >
                  ${(profile?.monthly_income || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Investment Status Interactive Form */}
          <div className="flex flex-col gap-3 px-4 py-3.5 rounded-2xl bg-slate-900/40 border border-white/5">
            <div className="flex items-center gap-2 text-slate-400 select-none">
              <TrendingUp size={14} className="stroke-[2.2]" />
              <span className="text-[11px] font-bold">Investment Status</span>
            </div>
            
            <div className="flex gap-2">
              {['Yes', 'No', 'Not Relevant'].map((option) => {
                const isSelected = profile?.investment_status === option;
                return (
                  <button
                    key={option}
                    onClick={() => handleUpdateInvesting(option)}
                    className={`flex-1 py-2.5 text-[10px] font-black rounded-xl transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-brand-mint text-slate-950 border-brand-mint shadow-md'
                        : 'bg-[#0F1F35] text-slate-400 hover:text-white hover:bg-white/5 border-white/10'
                    } active:scale-95`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Goals Row */}
          <div className="flex flex-col gap-2.5 px-4 py-3.5 rounded-2xl bg-slate-900/40 border border-white/5">
            <div className="flex items-center gap-2 text-slate-400 select-none">
              <Target size={14} className="stroke-[2.2]" />
              <span className="text-[11px] font-bold">Your Financial Goals</span>
            </div>
            
            <div className="flex flex-wrap gap-1.5 mt-0.5">
              {Array.isArray(profile?.financial_goal) && profile.financial_goal.length > 0 ? (
                profile.financial_goal.map((goal, index) => (
                  <span
                    key={index}
                    className="bg-white/5 border border-white/10 px-2.5 py-1 rounded-xl text-[10px] font-extrabold text-slate-300 select-none uppercase tracking-wide"
                  >
                    {goal}
                  </span>
                ))
              ) : (
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">No Goals Set</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Settings configuration buttons list */}
      <div className="flex flex-col gap-2">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider select-none pl-1">
          App Settings
        </h3>
        
        <div className="flex flex-col gap-1.5">
          {settingsItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 active:scale-[0.98] transition-all duration-200 cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-slate-900/40 text-slate-300">
                    <Icon size={14} className="stroke-[2.2]" />
                  </div>
                  <span className="text-xs font-bold text-white tracking-tight">{item.label}</span>
                </div>
                <ChevronRight size={14} className="text-slate-500 group-hover:text-slate-300 transition-colors" />
              </button>
            );
          })}

          {/* Logout operation button */}
          <button
            onClick={handleLogout}
            className="flex items-center justify-between p-4 rounded-2xl bg-rose-500/5 border border-rose-500/10 hover:bg-rose-500/10 active:scale-[0.98] transition-all duration-200 cursor-pointer group mt-2"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400">
                <LogOut size={14} className="stroke-[2.2]" />
              </div>
              <span className="text-xs font-bold text-rose-400 tracking-tight">Log Out</span>
            </div>
            <ChevronRight size={14} className="text-rose-500 group-hover:text-rose-400 transition-colors" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default Profile;
