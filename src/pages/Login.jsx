import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { Wallet, Mail, Lock, ArrowRight, Loader } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (location.state?.mode === 'register') setIsSignUp(true);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccessMessage('');
    const newErrors = {};

    // Standard client side validation rules
    if (!email) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please specify a valid email address';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      if (isSignUp) {
        // Supabase Signup Client Method
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) {
          setErrors({ api: error.message });
        } else {
          // If auto-confirm is enabled, it automatically signs in
          if (data?.session) {
            navigate('/dashboard');
          } else {
            setSuccessMessage('Sign up successful! Please check your email inbox to verify your account.');
            setEmail('');
            setPassword('');
          }
        }
      } else {
        // Supabase SignIn Client Method
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          setErrors({ api: error.message });
        } else {
          navigate('/dashboard');
        }
      }
    } catch (err) {
      setErrors({ api: 'An unexpected connection error occurred.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleAuthMode = () => {
    setIsSignUp(prev => !prev);
    setErrors({});
    setSuccessMessage('');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-1 flex flex-col h-full bg-[#0F1F35]"
    >
      {/* Top logo & emblem panel */}
      <div className="flex-[4] flex flex-col items-center justify-center p-6 text-center select-none">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
          className="p-4 bg-white/5 border border-white/10 rounded-3xl text-brand-mint shadow-xl mb-4 glow-mint"
        >
          <Wallet size={36} className="stroke-[1.8]" />
        </motion.div>

        <h2 className="text-2xl font-extrabold text-white tracking-tight">
          MoneyBuddy
        </h2>
        <p className="text-slate-400 text-xs mt-1 max-w-[200px] leading-relaxed font-medium">
          Premium personal finance at your fingertips.
        </p>
      </div>

      {/* Bottom inputs card container */}
      <motion.div
        initial={{ y: 200, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', damping: 25, stiffness: 180 }}
        className="flex-[6] bg-white rounded-t-[36px] p-8 flex flex-col shadow-[0_-15px_40px_rgba(0,0,0,0.15)] text-slate-800"
      >
        <div className="mb-6 select-none">
          <h3 className="text-lg font-bold tracking-tight text-slate-900">
            {isSignUp ? 'Create account' : 'Welcome back'}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5 font-semibold">
            {isSignUp
              ? 'Sign up to start tracking your budget and spendings.'
              : 'Log in to manage your budget and spendings.'}
          </p>
        </div>

        <form onSubmit={handleLogin} className="flex-1 flex flex-col justify-between">
          <div className="flex flex-col gap-4">

            {/* Signup confirmation banner */}
            {successMessage && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-2xl border border-emerald-100 leading-relaxed"
              >
                {successMessage}
              </motion.div>
            )}

            {/* Error notifications bar */}
            {errors.api && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-rose-50 text-rose-800 text-xs font-bold rounded-2xl border border-rose-100 leading-relaxed"
              >
                {errors.api}
              </motion.div>
            )}

            {/* Email Input */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-1">
                Email Address
              </label>
              <div className={`flex items-center gap-2.5 px-4 py-3.5 rounded-2xl border transition-all ${errors.email
                  ? 'border-rose-400 bg-rose-50/50 focus-within:ring-2 focus-within:ring-rose-400/20'
                  : 'border-slate-200 focus-within:border-brand-mint focus-within:ring-2 focus-within:ring-brand-mint/20'
                }`}>
                <Mail size={16} className={errors.email ? 'text-rose-400' : 'text-slate-400'} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrors((prev) => ({ ...prev, email: '' }));
                  }}
                  placeholder="name@example.com"
                  className="flex-1 bg-transparent text-sm text-slate-800 outline-none placeholder-slate-400 font-medium"
                  disabled={isSubmitting}
                />
              </div>
              {errors.email && (
                <span className="text-[10px] font-bold text-rose-500 pl-1">
                  {errors.email}
                </span>
              )}
            </div>

            {/* Password Input */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center pl-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Password
                </label>
                {!isSignUp && (
                  <a href="#forgot" className="text-[10px] font-bold text-brand-mint-dark hover:underline">
                    Forgot?
                  </a>
                )}
              </div>
              <div className={`flex items-center gap-2.5 px-4 py-3.5 rounded-2xl border transition-all ${errors.password
                  ? 'border-rose-400 bg-rose-50/50 focus-within:ring-2 focus-within:ring-rose-400/20'
                  : 'border-slate-200 focus-within:border-brand-mint focus-within:ring-2 focus-within:ring-brand-mint/20'
                }`}>
                <Lock size={16} className={errors.password ? 'text-rose-400' : 'text-slate-400'} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrors((prev) => ({ ...prev, password: '' }));
                  }}
                  placeholder="••••••••"
                  className="flex-1 bg-transparent text-sm text-slate-800 outline-none placeholder-slate-400 font-medium"
                  disabled={isSubmitting}
                />
              </div>
              {errors.password && (
                <span className="text-[10px] font-bold text-rose-500 pl-1">
                  {errors.password}
                </span>
              )}
            </div>
          </div>

          {/* Action button triggers */}
          <div className="mt-8 flex flex-col gap-4 select-none">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-4 bg-brand-blue-deep hover:bg-slate-900 text-white font-bold text-xs uppercase tracking-wider rounded-2xl shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all duration-200 cursor-pointer ${isSubmitting ? 'opacity-80 cursor-wait' : ''
                }`}
            >
              {isSubmitting ? (
                <>
                  <Loader size={14} className="animate-spin text-brand-mint" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>{isSignUp ? 'Create Account' : 'Log In'}</span>
                  <ArrowRight size={14} className="stroke-[2.5]" />
                </>
              )}
            </button>

            {/* Toggle log in/sign up page formats */}
            <button
              type="button"
              onClick={toggleAuthMode}
              disabled={isSubmitting}
              className="text-xs text-slate-500 font-bold hover:text-slate-800 transition-colors text-center w-full py-1 cursor-pointer"
            >
              {isSignUp ? (
                <span>Already have an account? <strong className="text-brand-mint-dark font-extrabold pl-0.5">Log In</strong></span>
              ) : (
                <span>Don't have an account? <strong className="text-brand-mint-dark font-extrabold pl-0.5">Sign Up</strong></span>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default Login;
