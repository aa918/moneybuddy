import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { useToast } from '../context/ToastContext';
import { supabase } from '../lib/supabase';
import { 
  Utensils, 
  ShoppingBag, 
  Play, 
  Activity, 
  Home, 
  CreditCard,
  Plus,
  Loader,
  Check
} from 'lucide-react';

// Dynamic icon mapping helper
const iconMap = {
  Utensils: Utensils,
  ShoppingBag: ShoppingBag,
  Play: Play,
  Activity: Activity,
  Home: Home,
  CreditCard: CreditCard
};

const AddExpense = () => {
  const { categories, rawUser, refreshData } = useApp();
  const { addToast } = useToast();
  const navigate = useNavigate();
  
  const [amount, setAmount] = useState('');
  const [vendor, setVendor] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  
  const inputRef = useRef(null);

  // Focus input automatically on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleContainerClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleAmountChange = (e) => {
    const val = e.target.value;
    if (/^\d*\.?\d{0,2}$/.test(val)) {
      setAmount(val);
      setError('');
    }
  };

  const handleSave = async () => {
    const parsedAmount = parseFloat(amount);
    
    // Validations
    if (!amount || isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Please type in a valid payment amount.');
      return;
    }
    if (!selectedCategory) {
      setError('Please select an expense category.');
      return;
    }
    if (!rawUser) {
      setError('Active session not found. Please log in again.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // 1. Direct insert to Supabase expenses table
      const { data, error: insertErr } = await supabase
        .from('expenses')
        .insert({
          amount: parsedAmount,
          category_id: selectedCategory.id, // Correct foreign key category ID
          description: vendor.trim() || `${selectedCategory.name} Purchase`,
          user_id: rawUser.id // Explicit authenticated user ID
        })
        .select();

      if (insertErr) {
        console.error('Supabase expense insert failed:', insertErr);
        addToast('Failed to save expense. Please try again.', 'error');
        setIsSubmitting(false);
        return;
      }

      // 2. Refresh global state (only if insert succeeds)
      await refreshData();

      // 3. Show success overlay micro-interaction, delay before redirecting
      setIsSuccess(true);
      await new Promise(resolve => setTimeout(resolve, 1100));

      // 4. Return back to dashboard
      navigate('/dashboard');
    } catch (err) {
      console.error('Unexpected error inserting expense:', err);
      addToast('An unexpected error occurred. Please try again.', 'error');
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="flex-1 flex flex-col p-6 pb-36 justify-between bg-[#0F1F35] relative overflow-hidden"
    >
      {/* Success Animation Overlay */}
      <AnimatePresence>
        {isSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-[#0F1F35]/98 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-6 text-center select-none"
          >
            <motion.div
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: [0, 1.25, 1], rotate: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="p-5 bg-brand-mint/10 border border-brand-mint/20 rounded-full text-brand-mint mb-4 shadow-xl glow-mint"
            >
              <Check size={48} className="stroke-[3.5]" />
            </motion.div>
            
            <motion.h3
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.3 }}
              className="text-lg font-black tracking-tight text-white"
            >
              Expense Saved!
            </motion.h3>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45, duration: 0.3 }}
              className="text-xs text-slate-400 mt-1.5"
            >
              Updating your remaining budget...
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col gap-6">
        {/* Numeric amount display container */}
        <div 
          onClick={handleContainerClick}
          className="flex flex-col items-center justify-center py-6 cursor-text select-none"
        >
          <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-2">
            Expense Amount
          </span>
          
          {/* Hidden input to trigger native keyboard */}
          <input
            ref={inputRef}
            type="text"
            inputMode="decimal"
            value={amount}
            onChange={handleAmountChange}
            className="absolute opacity-0 w-0 h-0 pointer-events-none"
            placeholder="0"
            disabled={isSubmitting}
          />

          {/* Styled currency numbers */}
          <div className="flex items-baseline justify-center">
            <span className={`text-3xl font-extrabold mr-1 transition-colors ${
              amount ? 'text-brand-mint font-black' : 'text-slate-500'
            }`}>
              $
            </span>
            <div className={`text-5xl font-black tracking-tight select-none transition-all ${
              amount ? 'text-white pulsing-cursor' : 'text-slate-500 pulsing-cursor'
            }`}>
              {amount || '0.00'}
            </div>
          </div>

          {/* Description vendor input field */}
          <div className="mt-4 w-full max-w-[250px]">
            <input
              type="text"
              dir="auto"
              placeholder="Vendor description (e.g., Wolt, Uber)"
              value={vendor}
              onChange={(e) => setVendor(e.target.value)}
              className="w-full text-center bg-transparent border-b border-white/10 py-1 text-sm text-slate-300 placeholder-slate-500 focus:border-brand-mint transition-colors outline-none font-medium"
              disabled={isSubmitting}
            />
          </div>
        </div>

        {/* Dynamic Category Grid */}
        <div className="flex flex-col gap-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider select-none">
            Select Category
          </h3>
          
          <div className="grid grid-cols-3 gap-3">
            {categories.map((cat) => {
              const Icon = iconMap[cat.icon] || CreditCard;
              const isSelected = selectedCategory?.id === cat.id;

              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setError('');
                  }}
                  disabled={isSubmitting}
                  className={`aspect-square rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-all duration-200 border ${
                    isSelected
                      ? 'bg-brand-blue-card border-transparent ring-2 ring-brand-mint text-white scale-[1.04]'
                      : 'bg-white/5 border-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                  } active:scale-95`}
                >
                  <div className={`p-2.5 rounded-xl transition-all ${
                    isSelected ? 'bg-brand-mint/10 text-brand-mint scale-105' : 'bg-slate-900/40 text-slate-400'
                  }`}>
                    <Icon size={18} className="stroke-[2.2]" />
                  </div>
                  <span className="text-[11px] font-bold tracking-tight">{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Error reporting banner */}
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-xs font-semibold text-rose-400 bg-rose-500/10 py-2.5 px-4 rounded-xl border border-rose-500/20"
          >
            {error}
          </motion.div>
        )}
      </div>

      {/* Floating Save button */}
      <div className="absolute bottom-28 left-0 right-0 px-6 pointer-events-none">
        <div className="max-w-sm mx-auto pointer-events-auto">
          <button
            onClick={handleSave}
            className={`w-full py-4 rounded-2xl font-bold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-1.5 cursor-pointer transition-all duration-250 ${
              amount && selectedCategory && !isSubmitting
                ? 'bg-brand-mint text-slate-950 glow-button hover:bg-brand-mint-dark hover:scale-[1.01] active:scale-95'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
            disabled={!amount || !selectedCategory || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader size={16} className="animate-spin text-slate-950" />
                Saving to Database...
              </>
            ) : (
              <>
                <Plus size={16} className="stroke-[2.5]" />
                Save Expense
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default AddExpense;
