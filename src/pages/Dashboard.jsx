import React from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import BudgetCard from '../components/BudgetCard';
import TransactionItem from '../components/TransactionItem';
import InsightCard from '../components/InsightCard';
import CategoryBudgetBar from '../components/CategoryBudgetBar';
import { Sparkles, AlertTriangle, TrendingUp, Receipt, Plus, PiggyBank } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CategoryDonut from '../components/CategoryDonut';
import SpendingBar from '../components/SpendingBar';

const listVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25 } }
};

const Dashboard = () => {
  const { user, transactions, profile, isPremium, isFetching, budgets, categories } = useApp();
  const navigate = useNavigate();

  const recentTransactions = transactions.slice(0, 5);
  const incomeVal = profile ? parseFloat(profile.monthly_income || 0) : 0;

  // Compute current-month spending per category
  const now = new Date();
  const categorySpendThisMonth = transactions.reduce((acc, t) => {
    const d = new Date(t.date);
    if (d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth()) {
      acc[t.categoryId] = (acc[t.categoryId] || 0) + t.amount;
    }
    return acc;
  }, {});

  const activeBudgets = budgets.filter(b => parseFloat(b.monthly_limit) > 0);
  const categoryMap = Object.fromEntries(categories.map(c => [c.id, c]));

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="flex-1 flex flex-col bg-[#0F1F35] overflow-y-auto no-scrollbar"
    >
      {/* Inner content constrained for desktop */}
      <div className="flex-1 flex flex-col p-6 pb-32 gap-6 lg:px-8 lg:pb-8 lg:max-w-7xl lg:mx-auto lg:w-full">

        {/* ── Top row: Welcome + Total Income ─────────────────────── */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 select-none">
          {/* Welcome */}
          <div>
            <span className="text-slate-400 text-[10px] font-semibold uppercase tracking-wider">
              Account Balance
            </span>
            <h1 className="text-2xl font-extrabold text-white tracking-tight mt-0.5">
              Hey, {user?.name ? user.name.split(' ')[0] : 'Valued User'} 👋
            </h1>
          </div>

          {/* Income card — inline on desktop, stacked on mobile */}
          <div className="bg-brand-blue-card rounded-3xl p-5 border border-white/5 flex justify-between items-center shadow-md lg:min-w-[240px]">
            <div>
              <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                Total Income
              </span>
              <h2 className="text-2xl font-black text-[#10B981] mt-0.5">
                ${incomeVal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h2>
            </div>
            <div className="p-3 bg-[#10B981]/10 rounded-2xl text-[#10B981] border border-[#10B981]/20">
              <TrendingUp size={20} />
            </div>
          </div>

          {/* Tier badge — desktop shows alongside welcome, mobile shows here */}
          <div className="lg:hidden text-right">
            <span className={`text-[10px] border font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm ${
              isPremium
                ? 'bg-amber-400/10 border-amber-400/30 text-amber-400'
                : 'bg-white/5 border-white/10 text-slate-300'
            }`}>
              {user?.tier || 'Standard Member'}
            </span>
          </div>
        </div>

        {/* ── Middle two-column grid ────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-6">

          {/* Left column: budget overview */}
          <div className="flex flex-col gap-6">
            <BudgetCard />

            {/* Category Budget Progress Bars */}
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center select-none">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Category Budgets
                </h3>
                <button
                  onClick={() => navigate('/budgets')}
                  className="text-xs font-bold text-brand-mint hover:underline active:scale-95 transition-all cursor-pointer"
                >
                  Manage
                </button>
              </div>

              {activeBudgets.length === 0 ? (
                <button
                  onClick={() => navigate('/budgets')}
                  className="flex items-center justify-between bg-brand-blue-card rounded-2xl px-4 py-3.5 border border-white/5 border-dashed text-slate-400 hover:text-white hover:border-white/20 transition-all active:scale-[0.98] cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5">
                    <PiggyBank size={16} className="text-brand-mint/60 group-hover:text-brand-mint transition-colors" />
                    <span className="text-xs font-semibold">Set category budgets</span>
                  </div>
                  <span className="text-brand-mint text-xs font-bold">→</span>
                </button>
              ) : (
                <motion.div
                  className="bg-brand-blue-card rounded-3xl p-4 border border-white/5 shadow-xl flex flex-col gap-4"
                  variants={listVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {activeBudgets.map(b => {
                    const cat = categoryMap[b.category_id];
                    if (!cat) return null;
                    return (
                      <motion.div key={b.id} variants={itemVariants}>
                        <CategoryBudgetBar
                          category={cat}
                          spent={categorySpendThisMonth[b.category_id] || 0}
                          limit={parseFloat(b.monthly_limit)}
                        />
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}
            </div>
          </div>

          {/* Right column: charts */}
          <div className="flex flex-col gap-6">
            <CategoryDonut />
            <SpendingBar />
          </div>
        </div>

        {/* ── Weekly Insights — 3-col on desktop ───────────────────── */}
        <div className="flex flex-col gap-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider select-none">
            Weekly Insights
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-2.5">
            <InsightCard
              title="Savings Progress"
              description="You have saved $120.50 more this month compared to your past 30-day average."
              borderColor="border-brand-mint"
              icon={TrendingUp}
            />
            <InsightCard
              title="Dining Out Alert"
              description="Wolt and eating out makes up 38% of your weekly budget. Try preparing meals."
              borderColor="border-amber-400"
              icon={AlertTriangle}
            />
            {isPremium && (
              <InsightCard
                title="Premium Dividend Active"
                description="Your VIP tier yields an additional 1.5% APY cash back on selected vendors."
                borderColor="border-amber-400 animate-pulse"
                icon={Sparkles}
              />
            )}
          </div>
        </div>

        {/* ── Recent Activity ───────────────────────────────────────── */}
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center select-none">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Recent Activity
            </h3>
            <button
              onClick={() => navigate('/history')}
              className="text-xs font-bold text-brand-mint hover:underline active:scale-95 transition-all cursor-pointer"
            >
              View All
            </button>
          </div>

          {isFetching && (
            <div className="flex flex-col gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="skeleton h-14 w-full" />
              ))}
            </div>
          )}

          {!isFetching && recentTransactions.length === 0 && (
            <div className="flex flex-col items-center justify-center text-center py-10 gap-3 select-none">
              <div className="p-4 bg-white/5 border border-white/10 rounded-2xl text-slate-500">
                <Receipt size={28} className="stroke-[1.5]" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">No expenses yet</p>
                <p className="text-xs text-slate-400 mt-0.5">Click + to log your first expense</p>
              </div>
              <button
                onClick={() => navigate('/add-expense')}
                className="flex items-center gap-2 px-4 py-2.5 bg-brand-mint text-slate-950 rounded-xl font-bold text-[10px] uppercase tracking-wider glow-button active:scale-95 transition-all cursor-pointer"
              >
                <Plus size={12} className="stroke-[2.5]" />
                Add Expense
              </button>
            </div>
          )}

          {!isFetching && recentTransactions.length > 0 && (
            <motion.div
              className="flex flex-col gap-2"
              variants={listVariants}
              initial="hidden"
              animate="visible"
            >
              {recentTransactions.map((tx) => (
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
            </motion.div>
          )}
        </div>

      </div>
    </motion.div>
  );
};

export default Dashboard;
