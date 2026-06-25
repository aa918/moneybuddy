import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
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
  const hideBars = isLoginPage || isOnboardingPage || loading;

  // Helper to determine page title
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
      default:
        return <span className="font-semibold text-lg text-white">MoneyBuddy</span>;
    }
  };

  return (
    // Centering desktop viewport page shell
    <div className="flex items-center justify-center min-h-screen bg-slate-950 p-0 sm:p-4 transition-all duration-300">
      {/* Sleek Mobile Device Frame Mockup */}
      <div className="w-full sm:max-w-[420px] h-screen sm:h-[850px] sm:rounded-[40px] sm:border-[8px] sm:border-slate-800 bg-[#0F1F35] sm:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] relative overflow-hidden flex flex-col transition-all duration-300">
        
        {/* Device Notch/Speaker for premium realism */}
        <div className="hidden sm:block absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-800 rounded-b-2xl z-50 overflow-hidden">
          <div className="w-12 h-1 bg-slate-900 rounded-full mx-auto mt-2" />
        </div>

        {/* Top Glassmorphic App Bar (Hidden on Login screen) */}
        {!hideBars && (
          <header className="glassmorphism sticky top-0 left-0 right-0 h-16 px-6 z-40 flex items-center justify-between shrink-0 select-none">
            {/* Left Button: Back button on sub-pages */}
            <div className="w-10">
              {currentPath !== '/dashboard' ? (
                <button
                  onClick={() => navigate('/dashboard')}
                  className="p-2 -ml-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 active:scale-95 transition-all cursor-pointer"
                  aria-label="Go Back"
                >
                  <ArrowLeft size={20} />
                </button>
              ) : null}
            </div>

            {/* Center Area: Dynamic Page Title */}
            <div className="flex-1 flex justify-center text-center">
              {getHeaderTitle()}
            </div>

            {/* Right Area: Profile / Premium status */}
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
                    {/* SVG Avatar illustration to avoid broken web-links offline */}
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

        {/* Toast notification layer — absolute inside the frame, below header */}
        {!hideBars && <Toast />}

        {/* Page Content Body (Scrollable with hidden scrollbars) */}
        <main className="flex-1 overflow-y-auto no-scrollbar relative flex flex-col bg-slate-950">
          {children}
        </main>

        {/* Bottom Floating Navigation (Hidden on Login screen) */}
        {!hideBars && <BottomNav />}
      </div>
    </div>
  );
};

export default MobileAppLayout;
