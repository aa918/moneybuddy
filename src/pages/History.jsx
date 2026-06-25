import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { useToast } from '../context/ToastContext';
import TransactionItem from '../components/TransactionItem';
import { 
  Utensils, 
  ShoppingBag, 
  Play, 
  Activity, 
  Home, 
  CreditCard,
  Plus,
  Loader,
  Check,
  X,
  Trash2,
  AlertCircle,
  Calendar,
  ChevronDown,
  Filter,
  Layers
} from 'lucide-react';

// Dynamic icon mapping helper for category selector
const iconMap = {
  Utensils: Utensils,
  ShoppingBag: ShoppingBag,
  Play: Play,
  Activity: Activity,
  Home: Home,
  CreditCard: CreditCard
};

// Formatting date helper for the HTML date picker input (local timezone)
const getYYYYMMDD = (isoString) => {
  if (!isoString) return '';
  const d = new Date(isoString);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const History = () => {
  const { 
    transactions, 
    categories, 
    isFetching, 
    updateExpense, 
    deleteExpense 
  } = useApp();
  
  const { addToast } = useToast();
  const navigate = useNavigate();

  // Filters State
  const [selectedMonth, setSelectedMonth] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Editing Drawer State
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [editAmount, setEditAmount] = useState('');
  const [editCategory, setEditCategory] = useState(null);
  const [editDescription, setEditDescription] = useState('');
  const [editDate, setEditDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Delete Dialog State
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Auto-generate month options dynamically from active ledger data
  const availableMonths = useMemo(() => {
    const months = new Set();
    // Sort transactions chronologically to keep months list sorted
    const sortedTxs = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date));
    sortedTxs.forEach(tx => {
      if (tx.date) {
        const d = new Date(tx.date);
        const label = d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        months.add(label);
      }
    });
    return Array.from(months);
  }, [transactions]);

  // Handle Amount change validation
  const handleAmountChange = (e) => {
    const val = e.target.value;
    if (/^\d*\.?\d{0,2}$/.test(val)) {
      setEditAmount(val);
      setError('');
    }
  };

  // Populate Edit Drawer on Row Click
  const handleEditClick = (tx) => {
    // Find matching category object
    const matchedCategory = categories.find(c => c.name.toLowerCase() === tx.category.toLowerCase()) || categories[categories.length - 1];
    
    setEditingTransaction(tx);
    setEditAmount(tx.amount.toString());
    setEditCategory(matchedCategory);
    setEditDescription(tx.rawDescription || tx.title || '');
    setEditDate(getYYYYMMDD(tx.date));
    setError('');
  };

  // Close Edit Drawer
  const closeEditDrawer = () => {
    if (!isSubmitting) {
      setEditingTransaction(null);
      setShowDeleteConfirm(false);
    }
  };

  // Update Expense Handler
  const handleUpdate = async () => {
    const parsedAmount = parseFloat(editAmount);
    if (!editAmount || isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Please type in a valid payment amount.');
      return;
    }
    if (!editCategory) {
      setError('Please select an expense category.');
      return;
    }
    if (!editDate) {
      setError('Please select a transaction date.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // Keep local timezone time components if editing date only
      const originalTime = new Date(editingTransaction.date);
      const selectedDay = new Date(editDate);
      
      // Merge date picker calendar date with original transaction timestamp details
      const newTimestamp = new Date(
        selectedDay.getFullYear(),
        selectedDay.getMonth(),
        selectedDay.getDate(),
        originalTime.getHours(),
        originalTime.getMinutes(),
        originalTime.getSeconds(),
        originalTime.getMilliseconds()
      ).toISOString();

      const res = await updateExpense(editingTransaction.id, {
        amount: parsedAmount,
        category_id: editCategory.id,
        description: editDescription.trim(),
        created_at: newTimestamp
      });

      if (res.success) {
        addToast('Expense updated successfully', 'success');
        closeEditDrawer();
      } else {
        setError('Failed to update expense. Try again.');
        addToast('Failed to update expense', 'error');
      }
    } catch (err) {
      console.error(err);
      setError('An unexpected connection error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Expense Handler
  const handleDelete = async () => {
    setIsSubmitting(true);
    try {
      const res = await deleteExpense(editingTransaction.id);
      if (res.success) {
        addToast('Expense deleted', 'success');
        closeEditDrawer();
      } else {
        addToast('Failed to delete expense', 'error');
      }
    } catch (err) {
      console.error(err);
      addToast('An unexpected error occurred', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter computation
  const filteredTransactions = useMemo(() => {
    return transactions.filter(tx => {
      // Month selection check
      if (selectedMonth !== 'all') {
        const txMonth = new Date(tx.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        if (txMonth !== selectedMonth) return false;
      }
      // Category selection check
      if (selectedCategory !== 'all') {
        if (tx.category.toLowerCase() !== selectedCategory.toLowerCase()) return false;
      }
      return true;
    });
  }, [transactions, selectedMonth, selectedCategory]);

  // Compute filtered sum
  const filteredSum = useMemo(() => {
    return filteredTransactions.reduce((sum, tx) => sum + tx.amount, 0);
  }, [filteredTransactions]);

  // Group transactions by date label
  const grouped = filteredTransactions.reduce((acc, tx) => {
    const label = new Date(tx.date).toLocaleDateString('en-US', {
      weekday: 'short', month: 'short', day: 'numeric'
    });
    if (!acc[label]) acc[label] = [];
    acc[label].push(tx);
    return acc;
  }, {});

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="flex-1 flex flex-col p-5 pb-32 gap-4 bg-[#0F1F35] overflow-y-auto no-scrollbar relative"
    >
      {/* Filters Selectors Row */}
      <div className="grid grid-cols-2 gap-3 shrink-0">
        {/* Month Selector dropdown */}
        <div className="relative group">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="w-full bg-brand-blue-card hover:bg-white/10 text-slate-300 hover:text-white font-bold text-xs uppercase tracking-wider py-3.5 pl-4 pr-10 rounded-2xl border border-white/5 focus:border-brand-mint/30 transition-all outline-none appearance-none cursor-pointer"
          >
            <option value="all" className="bg-[#162D4A] text-white">All Months</option>
            {availableMonths.map(m => (
              <option key={m} value={m} className="bg-[#162D4A] text-white">{m}</option>
            ))}
          </select>
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-white pointer-events-none transition-colors">
            <ChevronDown size={14} />
          </div>
        </div>

        {/* Category Selector dropdown */}
        <div className="relative group">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full bg-brand-blue-card hover:bg-white/10 text-slate-300 hover:text-white font-bold text-xs uppercase tracking-wider py-3.5 pl-4 pr-10 rounded-2xl border border-white/5 focus:border-brand-mint/30 transition-all outline-none appearance-none cursor-pointer"
          >
            <option value="all" className="bg-[#162D4A] text-white">All Categories</option>
            {categories.map(c => (
              <option key={c.id} value={c.name} className="bg-[#162D4A] text-white">{c.name}</option>
            ))}
          </select>
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-white pointer-events-none transition-colors">
            <ChevronDown size={14} />
          </div>
        </div>
      </div>

      {/* Filtered Running Total Card */}
      <div className="bg-gradient-to-br from-brand-blue-card to-[#122B4D] rounded-3xl p-5 border border-white/5 shadow-md flex items-center justify-between shrink-0 select-none">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Filtered Spending</span>
          <span className="text-3xl font-black text-brand-mint mt-1">
            ${filteredSum.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl px-3 py-2 text-right">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Expenses</span>
          <span className="text-sm font-black text-white">{filteredTransactions.length} items</span>
        </div>
      </div>

      {/* Shimmer skeletons while refreshing */}
      {isFetching && (
        <div className="flex flex-col gap-2.5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="skeleton h-14 w-full" />
          ))}
        </div>
      )}

      {/* Empty state when no transactions match filters */}
      {!isFetching && filteredTransactions.length === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center text-center py-16 select-none gap-4">
          <div className="p-5 bg-white/5 border border-white/10 rounded-3xl text-slate-500">
            <Layers size={36} className="stroke-[1.5]" />
          </div>
          <div>
            <p className="text-sm font-bold text-white">No expenses match filters</p>
            <p className="text-xs text-slate-400 mt-1">Try resetting category or month filters</p>
          </div>
          {(selectedMonth !== 'all' || selectedCategory !== 'all') && (
            <button
              onClick={() => {
                setSelectedMonth('all');
                setSelectedCategory('all');
              }}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl font-bold text-xs uppercase tracking-wider active:scale-95 transition-all cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>
      )}

      {/* Transaction groups */}
      {!isFetching && filteredTransactions.length > 0 && (
        <div className="flex flex-col gap-5">
          <AnimatePresence initial={false}>
            {Object.entries(grouped).map(([label, txs]) => (
              <motion.div 
                key={label}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col gap-2"
              >
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider px-1">
                  {label}
                </span>
                <div className="flex flex-col gap-2">
                  {txs.map(tx => (
                    <motion.div
                      key={tx.id}
                      layout
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ duration: 0.25 }}
                    >
                      <TransactionItem
                        title={tx.title}
                        amount={tx.amount}
                        category={tx.category}
                        type={tx.type}
                        date={tx.date}
                        onClick={() => handleEditClick(tx)}
                      />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Slide-up Edit Drawer Overlay */}
      <AnimatePresence>
        {editingTransaction && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeEditDrawer}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm z-40 cursor-pointer"
            />

            {/* Slide up Drawer */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 260 }}
              className="absolute bottom-0 left-0 right-0 bg-[#0F1F35] border-t border-white/10 rounded-t-[32px] p-6 pb-8 z-50 flex flex-col gap-4 select-none max-h-[92%] overflow-y-auto no-scrollbar"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-2 border-b border-white/5">
                <span className="font-bold text-sm text-white uppercase tracking-wider">Edit Expense</span>
                <button 
                  onClick={closeEditDrawer}
                  className="p-1 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Amount form input (RTL compatible alignment) */}
              <div className="flex flex-col items-center py-2">
                <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">
                  Amount
                </span>
                <div className="flex items-baseline justify-center">
                  <span className="text-xl font-extrabold text-brand-mint mr-1">$</span>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={editAmount}
                    onChange={handleAmountChange}
                    className="bg-transparent text-white text-3xl font-black tracking-tight outline-none w-36 text-center border-b border-white/10 focus:border-brand-mint transition-colors"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {/* Description Input (dir="auto" for full RTL Hebrew support) */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Description / Vendor
                </label>
                <input
                  type="text"
                  dir="auto"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:border-brand-mint transition-colors outline-none font-semibold"
                  placeholder="Enter vendor description"
                  disabled={isSubmitting}
                />
              </div>

              {/* Date Input */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Transaction Date
                </label>
                <input
                  type="date"
                  value={editDate}
                  onChange={(e) => setEditDate(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-xs text-white focus:border-brand-mint transition-colors outline-none font-semibold"
                  disabled={isSubmitting}
                />
              </div>

              {/* Category Grid selection */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Category
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {categories.map((cat) => {
                    const Icon = iconMap[cat.icon] || CreditCard;
                    const isSelected = editCategory?.id === cat.id;

                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setEditCategory(cat)}
                        disabled={isSubmitting}
                        className={`py-2 px-1 rounded-xl flex flex-col items-center justify-center gap-1 cursor-pointer border transition-all duration-200 ${
                          isSelected
                            ? 'bg-brand-blue-card border-brand-mint text-white scale-[1.03] ring-1 ring-brand-mint/35 shadow-md'
                            : 'bg-white/5 border-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        <Icon size={14} className="stroke-[2.2]" />
                        <span className="text-[9px] font-bold tracking-tight">{cat.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Error messages banner */}
              {error && (
                <div className="text-center text-[11px] font-bold text-rose-400 bg-rose-500/10 py-2 px-4 rounded-xl border border-rose-500/20">
                  {error}
                </div>
              )}

              {/* Submit Actions */}
              <div className="flex flex-col gap-2 mt-2">
                <button
                  type="button"
                  onClick={handleUpdate}
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-brand-mint text-slate-950 rounded-2xl font-bold text-xs uppercase tracking-wider glow-button active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  {isSubmitting ? (
                    <>
                      <Loader size={14} className="animate-spin text-slate-950" />
                      Saving changes...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  disabled={isSubmitting}
                  className="w-full py-3.5 border border-rose-500/20 text-rose-400 hover:bg-rose-500/10 rounded-2xl font-bold text-xs uppercase tracking-wider active:scale-95 transition-all cursor-pointer"
                >
                  Delete Expense
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal Overlay */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <>
            {/* Dark blur backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDeleteConfirm(false)}
              className="absolute inset-0 bg-slate-950/75 backdrop-blur-md z-55 cursor-pointer"
            />

            {/* Modal Card container */}
            <div className="absolute inset-0 z-55 flex items-center justify-center p-6 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                className="bg-brand-blue-card border border-white/10 rounded-3xl p-6 w-full max-w-sm flex flex-col gap-4 text-center pointer-events-auto shadow-2xl select-none"
              >
                <div className="p-3.5 bg-rose-500/10 border border-rose-500/20 rounded-full text-rose-400 mx-auto w-fit shadow-md">
                  <AlertCircle size={28} className="stroke-[2.2]" />
                </div>
                <div>
                  <h4 className="text-base font-black text-white">Delete Expense?</h4>
                  <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                    Are you sure you want to delete this expense? This action cannot be undone.
                  </p>
                </div>
                <div className="flex flex-col gap-2 mt-2">
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={isSubmitting}
                    className="w-full py-3 bg-rose-500 hover:bg-rose-600 text-white rounded-xl font-bold text-xs uppercase tracking-wider active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    {isSubmitting ? (
                      <Loader size={14} className="animate-spin text-white" />
                    ) : (
                      'Confirm Delete'
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(false)}
                    disabled={isSubmitting}
                    className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/5 text-slate-300 hover:text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default History;
