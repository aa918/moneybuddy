import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { useToast } from '../context/ToastContext';
import SavingsGoalCard from '../components/SavingsGoalCard';
import {
  Utensils, ShoppingBag, Play, Activity, Home, CreditCard,
  PiggyBank, Target, Plus, Check, Loader
} from 'lucide-react';

const iconMap = {
  Utensils, ShoppingBag, Play, Activity, Home, CreditCard
};

const listVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25 } }
};

// Inline category budget row
const BudgetRow = ({ category, currentLimit, onSave }) => {
  const [value, setValue] = useState(
    currentLimit > 0 ? String(currentLimit) : ''
  );
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const Icon = iconMap[category.icon] || CreditCard;

  const handleBlur = async () => {
    const parsed = parseFloat(value);
    if (isNaN(parsed) || parsed < 0) return;
    if (parsed === currentLimit) return;
    setSaving(true);
    await onSave(category.id, parsed);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <motion.div variants={itemVariants} className="flex items-center gap-3 py-3 border-b border-white/5 last:border-0">
      <div className="p-2 bg-white/5 rounded-xl text-slate-300 shrink-0">
        <Icon size={16} />
      </div>
      <span className="flex-1 text-sm font-semibold text-white">{category.name}</span>
      <div className="flex items-center gap-2">
        <div className="flex items-center bg-slate-900/60 border border-white/10 rounded-xl px-3 py-2 gap-1 w-28">
          <span className="text-slate-400 text-xs font-bold">$</span>
          <input
            type="text"
            inputMode="decimal"
            placeholder="0"
            value={value}
            onChange={e => {
              if (/^\d*\.?\d{0,2}$/.test(e.target.value)) setValue(e.target.value);
            }}
            onBlur={handleBlur}
            className="flex-1 bg-transparent text-white text-xs font-bold outline-none placeholder-slate-500 w-full"
          />
        </div>
        <AnimatePresence>
          {saving && (
            <motion.div key="spin" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Loader size={14} className="animate-spin text-slate-400" />
            </motion.div>
          )}
          {saved && !saving && (
            <motion.div
              key="check"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              className="p-1 bg-brand-mint/10 rounded-lg text-brand-mint"
            >
              <Check size={12} className="stroke-[3]" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

const Budgets = () => {
  const { categories, budgets, savingsGoals, setBudget, createSavingsGoal, updateSavingsGoal, deleteSavingsGoal } = useApp();
  const { addToast } = useToast();

  // Savings goal form state
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [goalTitle, setGoalTitle] = useState('');
  const [goalTarget, setGoalTarget] = useState('');
  const [goalDeadline, setGoalDeadline] = useState('');
  const [creatingGoal, setCreatingGoal] = useState(false);
  const [goalError, setGoalError] = useState('');

  const handleSaveBudget = async (categoryId, limit) => {
    const result = await setBudget(categoryId, limit);
    if (result.success) {
      addToast('Budget limit saved!', 'success');
    } else {
      addToast('Failed to save budget. Try again.', 'error');
    }
  };

  const handleCreateGoal = async () => {
    if (!goalTitle.trim()) { setGoalError('Please enter a goal title.'); return; }
    const amount = parseFloat(goalTarget);
    if (!amount || amount <= 0) { setGoalError('Please enter a valid target amount.'); return; }
    setGoalError('');
    setCreatingGoal(true);
    const result = await createSavingsGoal({
      title: goalTitle,
      target_amount: amount,
      deadline: goalDeadline || null
    });
    setCreatingGoal(false);
    if (result.success) {
      setGoalTitle('');
      setGoalTarget('');
      setGoalDeadline('');
      setShowGoalForm(false);
      addToast('Savings goal created!', 'success');
    } else {
      addToast('Failed to create goal. Try again.', 'error');
    }
  };

  const handleUpdateGoal = async (id, updates) => {
    const result = await updateSavingsGoal(id, updates);
    if (!result.success) addToast('Failed to update goal.', 'error');
  };

  const handleDeleteGoal = async (id) => {
    const result = await deleteSavingsGoal(id);
    if (result.success) {
      addToast('Goal deleted.', 'success');
    } else {
      addToast('Failed to delete goal.', 'error');
    }
  };

  // Map category_id → monthly_limit for quick lookup
  const budgetMap = Object.fromEntries(budgets.map(b => [b.category_id, b.monthly_limit]));

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="flex-1 flex flex-col p-6 pb-32 gap-6 bg-[#0F1F35] overflow-y-auto no-scrollbar lg:px-8 lg:pb-8"
    >
      {/* Desktop 2-col wrapper */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:items-start">

      {/* Section A: Monthly Budgets */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 bg-brand-mint/10 rounded-xl text-brand-mint border border-brand-mint/20">
            <PiggyBank size={16} />
          </div>
          <div>
            <h2 className="text-sm font-extrabold text-white">Monthly Budgets</h2>
            <p className="text-[10px] text-slate-400 font-medium">Set a spending limit per category</p>
          </div>
        </div>

        <div className="bg-brand-blue-card rounded-3xl px-5 py-2 border border-white/5 shadow-xl">
          <motion.div variants={listVariants} initial="hidden" animate="visible">
            {categories.map(cat => (
              <BudgetRow
                key={cat.id}
                category={cat}
                currentLimit={parseFloat(budgetMap[cat.id] || 0)}
                onSave={handleSaveBudget}
              />
            ))}
          </motion.div>
        </div>

        <p className="text-[10px] text-slate-500 text-center mt-2 font-medium">
          Tap a field, enter amount, then tap away to save
        </p>
      </div>

      {/* Section B: Savings Goals */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-brand-mint/10 rounded-xl text-brand-mint border border-brand-mint/20">
              <Target size={16} />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-white">Savings Goals</h2>
              <p className="text-[10px] text-slate-400 font-medium">Track progress toward your targets</p>
            </div>
          </div>
          <button
            onClick={() => setShowGoalForm(v => !v)}
            className="flex items-center gap-1.5 px-3 py-2 bg-brand-mint text-slate-950 rounded-xl text-[11px] font-bold uppercase tracking-wider glow-button active:scale-95 transition-all cursor-pointer"
          >
            <Plus size={12} className="stroke-[2.5]" />
            New Goal
          </button>
        </div>

        {/* New goal form */}
        <AnimatePresence>
          {showGoalForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden mb-4"
            >
              <div className="bg-brand-blue-card rounded-3xl p-5 border border-white/5 shadow-xl flex flex-col gap-3">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">New Savings Goal</h3>

                <input
                  type="text"
                  dir="auto"
                  placeholder="Goal title (e.g. Emergency Fund)"
                  value={goalTitle}
                  onChange={e => { setGoalTitle(e.target.value); setGoalError(''); }}
                  className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:border-brand-mint/50 transition-colors font-medium"
                />

                <div className="flex items-center bg-slate-900/60 border border-white/10 rounded-xl px-4 py-3 gap-2">
                  <span className="text-slate-400 text-sm font-bold">$</span>
                  <input
                    type="text"
                    inputMode="decimal"
                    placeholder="Target amount"
                    value={goalTarget}
                    onChange={e => {
                      if (/^\d*\.?\d{0,2}$/.test(e.target.value)) { setGoalTarget(e.target.value); setGoalError(''); }
                    }}
                    className="flex-1 bg-transparent text-white text-sm font-bold outline-none placeholder-slate-500"
                  />
                </div>

                <input
                  type="date"
                  value={goalDeadline}
                  onChange={e => setGoalDeadline(e.target.value)}
                  className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-300 outline-none focus:border-brand-mint/50 transition-colors font-medium [color-scheme:dark]"
                />

                {goalError && (
                  <motion.p
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs text-rose-400 font-semibold text-center bg-rose-500/10 py-2 rounded-xl border border-rose-500/20"
                  >
                    {goalError}
                  </motion.p>
                )}

                <button
                  onClick={handleCreateGoal}
                  disabled={creatingGoal}
                  className="w-full py-3.5 bg-brand-mint text-slate-950 rounded-2xl font-bold text-xs uppercase tracking-wider glow-button active:scale-95 transition-all cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {creatingGoal
                    ? <><Loader size={14} className="animate-spin" /> Creating...</>
                    : <><Check size={14} className="stroke-[3]" /> Create Goal</>
                  }
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Goals list */}
        <AnimatePresence mode="popLayout">
          {savingsGoals.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-10 gap-3 text-center"
            >
              <div className="p-4 bg-white/5 border border-white/10 rounded-2xl text-slate-500">
                <Target size={28} className="stroke-[1.5]" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">No savings goals yet</p>
                <p className="text-xs text-slate-400 mt-0.5">Tap "New Goal" to get started</p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="list"
              className="flex flex-col gap-3"
              variants={listVariants}
              initial="hidden"
              animate="visible"
            >
              {savingsGoals.map(goal => (
                <motion.div key={goal.id} variants={itemVariants} layout>
                  <SavingsGoalCard
                    goal={goal}
                    onUpdate={handleUpdateGoal}
                    onDelete={handleDeleteGoal}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      </div>{/* end desktop grid */}
    </motion.div>
  );
};

export default Budgets;
