import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Trash2, Plus, Calendar, Check, X } from 'lucide-react';

const SavingsGoalCard = ({ goal, onUpdate, onDelete }) => {
  const [adding, setAdding] = useState(false);
  const [addAmount, setAddAmount] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [saving, setSaving] = useState(false);

  const pct = goal.target_amount > 0
    ? Math.min((goal.current_amount / goal.target_amount) * 100, 100)
    : 0;

  const daysLeft = goal.deadline
    ? Math.ceil((new Date(goal.deadline) - new Date()) / 86400000)
    : null;

  const handleAddProgress = async () => {
    const val = parseFloat(addAmount);
    if (!val || val <= 0) return;
    setSaving(true);
    const newAmount = Math.min(
      parseFloat(goal.current_amount) + val,
      parseFloat(goal.target_amount)
    );
    await onUpdate(goal.id, { current_amount: newAmount });
    setAddAmount('');
    setAdding(false);
    setSaving(false);
  };

  return (
    <motion.div
      layout
      className="bg-brand-blue-card rounded-3xl p-5 border border-white/5 shadow-xl relative overflow-hidden"
    >
      {/* Ambient glow */}
      <div className="absolute top-0 right-0 -mr-4 -mt-4 w-20 h-20 rounded-full blur-2xl bg-brand-mint/8 pointer-events-none" />

      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-brand-mint/10 rounded-xl text-brand-mint border border-brand-mint/20">
            <Target size={15} />
          </div>
          <div>
            <h4 dir="auto" className="text-sm font-bold text-white leading-tight">
              {goal.title}
            </h4>
            {daysLeft !== null && (
              <div className={`flex items-center gap-1 mt-0.5 ${daysLeft < 30 ? 'text-amber-400' : 'text-slate-400'}`}>
                <Calendar size={10} />
                <span className="text-[10px] font-semibold">
                  {daysLeft > 0 ? `${daysLeft}d left` : 'Deadline passed'}
                </span>
              </div>
            )}
          </div>
        </div>

        <button
          onClick={() => setConfirmDelete(v => !v)}
          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all cursor-pointer active:scale-95"
          aria-label="Delete goal"
        >
          <Trash2 size={13} />
        </button>
      </div>

      {/* Progress bar */}
      <div className="mb-3">
        <div className="w-full h-2.5 bg-slate-900/60 rounded-full overflow-hidden border border-white/5">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            className="h-full rounded-full bg-brand-mint"
          />
        </div>
        <div className="flex justify-between items-center mt-1.5">
          <span className="text-[10px] font-bold text-brand-mint">{pct.toFixed(0)}%</span>
          <span className="text-[10px] text-slate-400 font-semibold">
            ${parseFloat(goal.current_amount).toLocaleString()} / ${parseFloat(goal.target_amount).toLocaleString()}
          </span>
        </div>
      </div>

      {/* Inline add-progress input */}
      <AnimatePresence>
        {adding ? (
          <motion.div
            key="add-input"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="flex gap-2 mt-1">
              <div className="flex-1 flex items-center bg-slate-900/60 border border-white/10 rounded-xl px-3 py-2 gap-1">
                <span className="text-slate-400 text-xs font-bold">$</span>
                <input
                  type="text"
                  inputMode="decimal"
                  placeholder="0.00"
                  value={addAmount}
                  onChange={e => {
                    if (/^\d*\.?\d{0,2}$/.test(e.target.value)) setAddAmount(e.target.value);
                  }}
                  className="flex-1 bg-transparent text-white text-xs font-bold outline-none placeholder-slate-500"
                  autoFocus
                />
              </div>
              <button
                onClick={handleAddProgress}
                disabled={saving || !addAmount}
                className="p-2.5 bg-brand-mint text-slate-950 rounded-xl font-bold cursor-pointer active:scale-95 disabled:opacity-50 transition-all"
              >
                <Check size={14} className="stroke-[3]" />
              </button>
              <button
                onClick={() => { setAdding(false); setAddAmount(''); }}
                className="p-2.5 bg-white/5 text-slate-400 rounded-xl cursor-pointer active:scale-95 transition-all"
              >
                <X size={14} />
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.button
            key="add-btn"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setAdding(true)}
            className="flex items-center gap-1.5 text-[11px] font-bold text-brand-mint hover:opacity-80 transition-opacity cursor-pointer active:scale-95 mt-1"
          >
            <Plus size={12} className="stroke-[2.5]" />
            Add Progress
          </motion.button>
        )}
      </AnimatePresence>

      {/* Delete confirmation */}
      <AnimatePresence>
        {confirmDelete && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            className="mt-3 flex items-center gap-2 bg-rose-500/10 border border-rose-500/20 rounded-xl p-3"
          >
            <span className="text-[11px] text-rose-400 font-semibold flex-1">
              Delete this goal?
            </span>
            <button
              onClick={() => { onDelete(goal.id); setConfirmDelete(false); }}
              className="text-[10px] font-bold text-rose-400 border border-rose-500/30 px-2.5 py-1 rounded-lg hover:bg-rose-500/20 cursor-pointer transition-all active:scale-95"
            >
              Yes, delete
            </button>
            <button
              onClick={() => setConfirmDelete(false)}
              className="text-[10px] font-bold text-slate-400 border border-white/10 px-2.5 py-1 rounded-lg hover:bg-white/5 cursor-pointer transition-all active:scale-95"
            >
              Cancel
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default SavingsGoalCard;
