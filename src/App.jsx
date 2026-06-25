import React from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AppProvider, useApp } from './context/AppContext';
import { ToastProvider } from './context/ToastContext';
import MobileAppLayout from './components/MobileAppLayout';
import { Wallet } from 'lucide-react';

import Login from './pages/Login';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import AddExpense from './pages/AddExpense';
import Profile from './pages/Profile';
import History from './pages/History';
import Budgets from './pages/Budgets';
import './App.css';

// AnimatedRoutes handles routing state, session checks, and redirection guards
const AnimatedRoutes = () => {
  const location = useLocation();
  const { user, loading, profile } = useApp();

  // 1. Initial auth check load screen (prevent flickers)
  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-[#0F1F35] text-white p-6 select-none">
        <div className="flex flex-col items-center gap-4">
          <div className="p-4 bg-white/5 border border-white/10 rounded-3xl text-brand-mint shadow-xl glow-mint animate-pulse">
            <Wallet size={36} className="stroke-[1.8]" />
          </div>
          <span className="text-[10px] text-slate-400 font-extrabold tracking-wider uppercase animate-pulse">
            Securing Connection...
          </span>
        </div>
      </div>
    );
  }

  const isAuthenticated = !!user;
  const isAuthPage = location.pathname === '/login';
  const isOnboardingPage = location.pathname === '/onboarding';
  const needsOnboarding = profile === null;

  // 2. Auth Access Guards
  if (!isAuthenticated) {
    if (!isAuthPage) {
      // Unauthenticated -> Login page
      return <Navigate to="/login" replace />;
    }
  } else {
    // Authenticated
    if (needsOnboarding) {
      if (!isOnboardingPage) {
        // Needs onboarding but not on page -> Onboarding page
        return <Navigate to="/onboarding" replace />;
      }
    } else {
      if (isOnboardingPage || isAuthPage) {
        // Already onboarded -> Dashboard page
        return <Navigate to="/dashboard" replace />;
      }
    }
  }

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/login" element={<Login />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/add-expense" element={<AddExpense />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/history" element={<History />} />
        <Route path="/budgets" element={<Budgets />} />
        {/* Dynamic redirection fallback */}
        <Route
          path="/"
          element={<Navigate to={isAuthenticated ? (needsOnboarding ? "/onboarding" : "/dashboard") : "/login"} replace />}
        />
        <Route
          path="*"
          element={<Navigate to={isAuthenticated ? (needsOnboarding ? "/onboarding" : "/dashboard") : "/login"} replace />}
        />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <AppProvider>
      <ToastProvider>
        <BrowserRouter>
          <MobileAppLayout>
            <AnimatedRoutes />
          </MobileAppLayout>
        </BrowserRouter>
      </ToastProvider>
    </AppProvider>
  );
}

export default App;
