import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import TransactionItem from '../components/TransactionItem';
import { Layers, Plus } from 'lucide-react';

const listVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25 } }
};

const History = () => {
  const { transactions, isFetching } = useApp();
  const navigate = useNavigate();

  // Group transactions by formatted date label, newest first
  const grouped = transactions.reduce((acc, tx) => {
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
      className="flex-1 flex flex-col p-6 pb-32 gap-4 bg-[#0F1F35] overflow-y-auto no-scrollbar"
    >
      {/* Shimmer skeletons while refreshing */}
      {isFetching && (
        <div className="flex flex-col gap-2.5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="skeleton h-14 w-full" />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isFetching && transactions.length === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center text-center py-16 select-none gap-4">
          <div className="p-5 bg-white/5 border border-white/10 rounded-3xl text-slate-500">
            <Layers size={36} className="stroke-[1.5]" />
          </div>
          <div>
            <p className="text-sm font-bold text-white">Your transaction history is empty</p>
            <p className="text-xs text-slate-400 mt-1">Start by logging your first expense</p>
          </div>
          <button
            onClick={() => navigate('/add-expense')}
            className="flex items-center gap-2 px-5 py-3 bg-brand-mint text-slate-950 rounded-2xl font-bold text-xs uppercase tracking-wider glow-button active:scale-95 transition-all cursor-pointer"
          >
            <Plus size={14} className="stroke-[2.5]" />
            Add First Expense
          </button>
        </div>
      )}

      {/* Transaction groups */}
      {!isFetching && transactions.length > 0 && (
        <motion.div
          className="flex flex-col gap-4"
          variants={listVariants}
          initial="hidden"
          animate="visible"
        >
          {Object.entries(grouped).map(([label, txs]) => (
            <div key={label} className="flex flex-col gap-2">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider px-1">
                {label}
              </span>
              {txs.map(tx => (
                <motion.div key={tx.id} variants={itemVariants}>
                  <TransactionItem
                    title={tx.title}
                    amount={tx.amount}
                    category={tx.category}
                    type={tx.type}
                    date={tx.date}
                  />
                </motion.div>
              ))}
            </div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

export default History;
