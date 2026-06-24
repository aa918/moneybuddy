import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { 
  ArrowRight, 
  ArrowLeft, 
  Target, 
  DollarSign, 
  TrendingUp, 
  Check,
  AlertCircle
} from 'lucide-react';

const Onboarding = () => {
  const { createProfile } = useApp();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Question 1: Goals (Multi-select)
  const availableGoals = [
    'Save money',
    'Invest more',
    'Better money management',
    'Reduce debt',
    'Plan big purchase'
  ];
  const [selectedGoals, setSelectedGoals] = useState([]);

  // Question 2: Income
  const [income, setIncome] = useState('');

  // Question 3: Investing
  const investingOptions = [
    { value: 'Yes', label: 'Yes, I invest' },
    { value: 'No', label: 'No, but not interested' },
    { value: 'Not Relevant', label: 'Not relevant for me' }
  ];
  const [investingPreference, setInvestingPreference] = useState('');

  const handleToggleGoal = (goal) => {
    setError('');
    setSelectedGoals(prev => 
      prev.includes(goal) 
        ? prev.filter(g => g !== goal) 
        : [...prev, goal]
    );
  };

  const handleIncomeChange = (e) => {
    const val = e.target.value;
    if (/^\d*\.?\d{0,2}$/.test(val) || val === '') {
      setIncome(val);
      setError('');
    }
  };

  const handleNext = () => {
    if (step === 1) {
      if (selectedGoals.length === 0) {
        setError('Please select at least one goal to continue.');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      const parsedIncome = parseFloat(income);
      if (!income || isNaN(parsedIncome) || parsedIncome <= 0) {
        setError('Please type in a valid monthly income greater than 0.');
        return;
      }
      setStep(3);
    }
  };

  const handleBack = () => {
    setError('');
    setStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!investingPreference) {
      setError('Please select your investing preference to complete setup.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    const profileData = {
      financial_goal: selectedGoals,
      monthly_income: parseFloat(income),
      investment_status: investingPreference,
      budget: parseFloat(income) // set initial budget equal to income
    };

    const res = await createProfile(profileData);
    setIsSubmitting(false);

    if (res.success) {
      navigate('/dashboard');
    } else {
      setError(res.error?.message || 'Failed to complete onboarding. Please try again.');
    }
  };

  const stepVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.35, ease: 'easeOut' } },
    exit: { opacity: 0, x: -50, transition: { duration: 0.25, ease: 'easeIn' } }
  };

  return (
    <div className="flex-1 flex flex-col justify-between bg-[#0F1F35] p-6 text-white overflow-y-auto no-scrollbar">
      {/* Top Section: Progress Bar */}
      <div className="w-full max-w-sm mx-auto select-none mt-2">
        <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">
          <span>Personalizing Account</span>
          <span>Step {step} of 3</span>
        </div>
        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden flex gap-1 p-[1px]">
          <div className={`h-full flex-1 rounded-full transition-all duration-300 ${step >= 1 ? 'bg-brand-mint glow-mint' : 'bg-slate-700'}`} />
          <div className={`h-full flex-1 rounded-full transition-all duration-300 ${step >= 2 ? 'bg-brand-mint glow-mint' : 'bg-slate-700'}`} />
          <div className={`h-full flex-1 rounded-full transition-all duration-300 ${step >= 3 ? 'bg-brand-mint glow-mint' : 'bg-slate-700'}`} />
        </div>
      </div>

      {/* Main Steps Content */}
      <div className="flex-1 flex items-center justify-center py-6 w-full max-w-sm mx-auto">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              variants={stepVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="w-full flex flex-col gap-5"
            >
              <div className="text-center select-none mb-2">
                <div className="mx-auto w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-brand-mint shadow-lg mb-3">
                  <Target size={24} className="stroke-[1.8]" />
                </div>
                <h2 className="text-xl font-extrabold tracking-tight">What are your primary goals?</h2>
                <p className="text-slate-400 text-xs mt-1">Select all options that apply to you</p>
              </div>

              <div className="flex flex-col gap-2.5">
                {availableGoals.map((goal) => {
                  const isSelected = selectedGoals.includes(goal);
                  return (
                    <button
                      key={goal}
                      onClick={() => handleToggleGoal(goal)}
                      className={`w-full p-4 rounded-2xl flex items-center justify-between text-left font-bold text-xs tracking-wide transition-all border duration-200 cursor-pointer ${
                        isSelected
                          ? 'bg-brand-blue-card border-transparent ring-2 ring-brand-mint text-white scale-[1.01]'
                          : 'bg-white/5 border-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <span>{goal}</span>
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                        isSelected 
                          ? 'bg-brand-mint border-transparent text-slate-950 scale-110' 
                          : 'border-slate-600'
                      }`}>
                        {isSelected && <Check size={12} className="stroke-[3]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              variants={stepVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="w-full flex flex-col gap-5"
            >
              <div className="text-center select-none mb-2">
                <div className="mx-auto w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-brand-mint shadow-lg mb-3">
                  <DollarSign size={24} className="stroke-[1.8]" />
                </div>
                <h2 className="text-xl font-extrabold tracking-tight">What is your monthly income?</h2>
                <p className="text-slate-400 text-xs mt-1">We will use this to set up your baseline budget</p>
              </div>

              <div className="flex flex-col items-center">
                <div className="relative w-full max-w-[280px] flex items-center border-b-2 border-white/10 focus-within:border-brand-mint transition-colors py-3">
                  <span className="text-slate-400 text-3xl font-extrabold mr-1">$</span>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={income}
                    onChange={handleIncomeChange}
                    placeholder="0.00"
                    className="w-full bg-transparent text-4xl font-black text-white focus:outline-none tracking-tight placeholder-slate-600"
                    autoFocus
                  />
                </div>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-4">
                  Average take-home pay per month
                </span>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              variants={stepVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="w-full flex flex-col gap-5"
            >
              <div className="text-center select-none mb-2">
                <div className="mx-auto w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-brand-mint shadow-lg mb-3">
                  <TrendingUp size={24} className="stroke-[1.8]" />
                </div>
                <h2 className="text-xl font-extrabold tracking-tight">Do you currently invest?</h2>
                <p className="text-slate-400 text-xs mt-1">Select the choice that best fits your state</p>
              </div>

              <div className="flex flex-col gap-2.5">
                {investingOptions.map((option) => {
                  const isSelected = investingPreference === option.value;
                  return (
                    <button
                      key={option.value}
                      onClick={() => {
                        setInvestingPreference(option.value);
                        setError('');
                      }}
                      className={`w-full p-4 rounded-2xl flex items-center justify-between text-left font-bold text-xs tracking-wide transition-all border duration-200 cursor-pointer ${
                        isSelected
                          ? 'bg-brand-blue-card border-transparent ring-2 ring-brand-mint text-white scale-[1.01]'
                          : 'bg-white/5 border-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <span>{option.label}</span>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                        isSelected 
                          ? 'border-brand-mint text-brand-mint bg-brand-mint/10' 
                          : 'border-slate-600'
                      }`}>
                        {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-brand-mint" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Section: Navigation Controls */}
      <div className="w-full max-w-sm mx-auto select-none mt-4 pb-4">
        {/* Error reporting banner */}
        {error && (
          <div className="flex items-center justify-center gap-1.5 text-center text-[11px] font-bold text-rose-400 bg-rose-500/10 py-3 px-4 rounded-xl border border-rose-500/20 mb-4 animate-shake">
            <AlertCircle size={14} />
            <span>{error}</span>
          </div>
        )}

        <div className="flex gap-4">
          {step > 1 && (
            <button
              onClick={handleBack}
              disabled={isSubmitting}
              className="p-4 rounded-2xl bg-white/5 border border-white/5 text-slate-300 hover:text-white hover:bg-white/10 active:scale-95 transition-all duration-200 cursor-pointer flex items-center justify-center"
            >
              <ArrowLeft size={16} className="stroke-[2.5]" />
            </button>
          )}
          
          {step < 3 ? (
            <button
              onClick={handleNext}
              className="flex-1 py-4 rounded-2xl bg-brand-mint text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-1.5 hover:bg-brand-mint-dark hover:scale-[1.01] active:scale-95 transition-all duration-200 cursor-pointer glow-button"
            >
              <span>Continue</span>
              <ArrowRight size={16} className="stroke-[2.5]" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`flex-1 py-4 rounded-2xl font-bold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer ${
                isSubmitting 
                  ? 'bg-slate-800 text-slate-500 cursor-wait'
                  : 'bg-brand-mint text-slate-950 glow-button hover:bg-brand-mint-dark hover:scale-[1.01] active:scale-95'
              }`}
            >
              <span>{isSubmitting ? 'Saving Profile...' : 'Complete Setup'}</span>
              {!isSubmitting && <Check size={16} className="stroke-[2.5]" />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
