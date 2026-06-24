import React from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { Wallet, ArrowUpRight, ArrowDownRight, AlertTriangle } from 'lucide-react';

const BudgetCard = () => {
  const { remainingBudget, totalBudget, totalExpenses, totalIncome, budgetProgress, loading } = useApp();

  // 1. Graceful Loading Skeleton state
  if (loading) {
    return (
      <div className="bg-brand-blue-card rounded-3xl p-6 shadow-xl border border-white/5 relative overflow-hidden animate-pulse min-h-[195px] flex flex-col justify-between select-none">
        <div>
          <div className="h-3 bg-slate-700/60 rounded-full w-28 mb-3" />
          <div className="h-8 bg-slate-700/60 rounded-xl w-44" />
        </div>
        <div className="w-full">
          <div className="h-2 text-[10px] bg-slate-700/60 rounded-full w-full mb-3" />
          <div className="h-3 bg-slate-900/60 rounded-full w-full" />
        </div>
        <div className="grid grid-cols-2 gap-4 pt-3 border-t border-white/5">
          <div className="h-6 bg-slate-700/60 rounded-lg w-20" />
          <div className="h-6 bg-slate-700/60 rounded-lg w-20 pl-4 border-l border-white/5" />
        </div>
      </div>
    );
  }

  // 2. Safe Defaults defending against TypeErrors (null, undefined, NaN)
  const remainingVal = typeof remainingBudget === 'number' && !isNaN(remainingBudget) ? remainingBudget : 0;
  const totalVal = typeof totalBudget === 'number' && !isNaN(totalBudget) ? totalBudget : 0;
  const expensesVal = typeof totalExpenses === 'number' && !isNaN(totalExpenses) ? totalExpenses : 0;
  const incomeVal = typeof totalIncome === 'number' && !isNaN(totalIncome) ? totalIncome : 0;
  const progressVal = typeof budgetProgress === 'number' && !isNaN(budgetProgress) ? budgetProgress : 0;

  // Check if expenses exceed 80% of income
  const isWarning = expensesVal >= incomeVal * 0.8;

  return (
    <div className="bg-brand-blue-card rounded-3xl p-6 shadow-xl border border-white/5 relative overflow-hidden select-none">
      {/* Ambient background aura */}
      <div className={`absolute top-0 right-0 -mr-6 -mt-6 w-24 h-24 rounded-full blur-2xl pointer-events-none transition-colors duration-500 ${
        isWarning ? 'bg-rose-500/10' : 'bg-brand-mint/10'
      }`} />

      <div className="flex justify-between items-start mb-4">
        <div className="flex flex-col">
          <p className="text-slate-400 text-xs font-semibold tracking-wider uppercase mb-1">
            Remaining Budget
          </p>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            ${remainingVal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h2>
          {isWarning && (
            <div className="flex items-center gap-1.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-lg mt-1.5 self-start">
              <AlertTriangle size={10} className="shrink-0" />
              <span>Warning: Over 80% of Income Spent</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-2xl border transition-colors duration-500 shadow-inner ${
          isWarning 
            ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' 
            : 'bg-white/5 border-white/5 text-brand-mint'
        }`}>
          <Wallet size={20} />
        </div>
      </div>

      {/* Glow Progress Bar Section */}
      <div className="mb-5">
        <div className="flex justify-between items-center text-xs text-slate-400 mb-2">
          <span>{progressVal.toFixed(0)}% Spent</span>
          <span>Limit: ${totalVal.toLocaleString()}</span>
        </div>
        <div className="w-full h-3 bg-slate-900/60 rounded-full overflow-hidden p-[2px] border border-white/5">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressVal}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className={`h-full rounded-full transition-all duration-500 ${
              isWarning ? 'bg-rose-500 glow-rose' : 'bg-brand-mint glow-mint'
            }`}
          />
        </div>
      </div>

      {/* Income / Expense Breakdown Grid */}
      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-emerald-500/10 text-brand-mint rounded-xl">
            <ArrowUpRight size={16} />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-semibold uppercase">Income</p>
            <p className="text-sm font-bold text-white">${incomeVal.toLocaleString()}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 border-l border-white/5 pl-4">
          <div className={`p-2 rounded-xl transition-colors duration-500 ${
            isWarning ? 'bg-rose-500/10 text-rose-400' : 'bg-rose-500/10 text-rose-400'
          }`}>
            <ArrowDownRight size={16} />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-semibold uppercase">Expenses</p>
            <p className={`text-sm font-bold transition-colors duration-500 ${isWarning ? 'text-rose-400' : 'text-white'}`}>
              ${expensesVal.toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetCard;
