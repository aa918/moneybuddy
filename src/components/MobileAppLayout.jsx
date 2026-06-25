import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';
import Toast from './Toast';
import { ArrowLeft, Bell, Crown } from 'lucide-react';

const MobileAppLayout = ({ children }) => {
  const { isPremium, user, loading } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const isLoginPage = currentPath === '/login';
  const isOnboardingPage = currentPath === '/onboarding';
  const isLandingPage = currentPath === '/';
  const hideBars = isLoginPage || isOnboardingPage || isLandingPage || loading;

  const getHeaderTitle = () => {
    switch (currentPath) {
      case '/dashboard':
        return (
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              MoneyBuddy
            </span>
            <div className="w-2 h-2 rounded-full bg-brand-mint glow-mint animate-pulse" />
          </div>
        );
      case '/add-expense':
        return <span className="font-semibold text-lg text-white">Add Expense</span>;
      case '/profile':
        return <span className="font-semibold text-lg text-white">Profile & Settings</span>;
      case '/history':
        return <span className="font-semibold text-lg text-white">History</span>;
      case '/budgets':
        return <span className="font-semibold text-lg text-white">Budgets & Goals</span>;
      default:
        return <span className="font-semibold text-lg text-white">MoneyBuddy</span>;
    }
  };

  return (
    <div className="min-h-screen bg-[#0F1F35] flex">
      {/* Sidebar — desktop only (lg:) */}
      {!hideBars && <Sidebar />}

      {/* Main column — full width on mobile, flex-1 on desktop */}
      <div className="flex-1 flex flex-col min-h-screen relative overflow-hidden">

        {/* Top App Bar */}
        {!hideBars && (
          <header className="glassmorphism sticky top-0 left-0 right-0 h-16 px-5 lg:px-8 z-40 flex items-center justify-between shrink-0 select-none">

            {/* Left: back button on mobile sub-pages, hidden on desktop (sidebar handles nav) */}
            <div className="w-10">
              {currentPath !== '/dashboard' && (
                <button
                  onClick={() => navigate('/dashboard')}
                  className="lg:hidden p-2 -ml-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 active:scale-95 transition-all cursor-pointer"
                  aria-label="Go Back"
                >
                  <ArrowLeft size={20} />
                </button>
              )}
            </div>

            {/* Center: dynamic page title */}
            <div className="flex-1 flex justify-center text-center lg:justify-start lg:ml-0">
              {getHeaderTitle()}
            </div>

            {/* Right: profile avatar (dashboard) or bell icon (sub-pages) */}
            <div className="w-10 flex justify-end">
              {currentPath === '/dashboard' ? (
                <button
                  onClick={() => navigate('/profile')}
                  className="relative cursor-pointer group active:scale-95 transition-all"
                  aria-label="View Profile"
                >
                  <div className={`w-8 h-8 rounded-full overflow-hidden border-2 ${
                    isPremium ? 'border-amber-400' : 'border-slate-500'
                  }`}>
                    <svg viewBox="0 0 32 32" className="w-full h-full bg-slate-700 text-slate-300">
                      <path fill="currentColor" d="M16 8a5 5 0 1 0 5 5 5 5 0 0 0-5-5zm0 11c-6.13 0-11 3.25-11 7h22c0-3.75-4.87-7-11-7z" />
                    </svg>
                  </div>
                  {isPremium && (
                    <div className="absolute -top-1 -right-1 bg-amber-400 text-slate-950 p-0.5 rounded-full shadow-sm">
                      <Crown size={8} className="fill-amber-950" />
                    </div>
                  )}
                </button>
              ) : (
                <button
                  className="p-2 -mr-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 active:scale-95 transition-all cursor-pointer relative"
                  aria-label="Notifications"
                >
                  <Bell size={20} />
                  <div className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-mint" />
                </button>
              )}
            </div>
          </header>
        )}

        {/* Toast notification layer — absolute inside the column, below the header */}
        {!hideBars && <Toast />}

        {/* Page content */}
        <main className="flex-1 overflow-y-auto no-scrollbar relative flex flex-col bg-[#0F1F35]">
          {children}
        </main>

        {/* Bottom nav — mobile only (hidden on lg:) */}
        {!hideBars && <BottomNav />}
      </div>
    </div>
  );
};

export default MobileAppLayout;
