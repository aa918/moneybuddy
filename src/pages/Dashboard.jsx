import React from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import BudgetCard from '../components/BudgetCard';
import TransactionItem from '../components/TransactionItem';
import InsightCard from '../components/InsightCard';
import { Sparkles, AlertTriangle, TrendingUp, Receipt, Plus } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useNavigate } from 'react-router-dom';

const listVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25 } }
};

const Dashboard = () => {
  const { user, transactions, profile, totalExpenses, isPremium, isFetching } = useApp();
  const navigate = useNavigate();

  // Show only the 5 most recent transactions
  const recentTransactions = transactions.slice(0, 5);

  // Fetch monthly_income from profile (fallback to 0 if loading/unset)
  const incomeVal = profile ? parseFloat(profile.monthly_income || 0) : 0;
  const expensesVal = totalExpenses; // SUM(expenses)

  // Pie chart contains exactly two data points:
  // A) "Income" (value = monthly_income, color = #10B981)
  // B) "Expenses" (value = SUM(expenses), color = #EF4444)
  // If expenses are 0, render only the Income slice to show a full green circle.
  const chartData = expensesVal > 0
    ? [
        { name: 'Income', value: incomeVal, color: '#10B981' },
        { name: 'Expenses', value: expensesVal, color: '#EF4444' }
      ]
    : [
        { name: 'Income', value: incomeVal || 1, color: '#10B981' } // fallback to 1 to show a complete circle
      ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="flex-1 flex flex-col p-6 pb-32 gap-6 bg-[#0F1F35] overflow-y-auto no-scrollbar"
    >
      {/* User Welcome Row */}
      <div className="flex justify-between items-center select-none">
        <div>
          <span className="text-slate-400 text-[10px] font-semibold uppercase tracking-wider">
            Account Balance
          </span>
          <h1 className="text-2xl font-extrabold text-white tracking-tight mt-0.5">
            Hey, {user?.name ? user.name.split(' ')[0] : 'Valued User'} 👋
          </h1>
        </div>
        <div className="text-right">
          <span className={`text-[10px] border font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm ${
            isPremium 
              ? 'bg-amber-400/10 border-amber-400/30 text-amber-400' 
              : 'bg-white/5 border-white/10 text-slate-300'
          }`}>
            {user?.tier || 'Standard Member'}
          </span>
        </div>
      </div>

      {/* Prominent Total Income Card */}
      <div className="bg-brand-blue-card rounded-3xl p-5 border border-white/5 flex justify-between items-center select-none shadow-md">
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

      {/* Hero Budget Display */}
      <BudgetCard />

      {/* Expense Allocation Card */}
      <div className="bg-brand-blue-card rounded-3xl p-5 border border-white/5 flex flex-col gap-4 select-none relative">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Income vs Expenses
        </h3>
        
        <div className="h-[210px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="45%"
                innerRadius={55}
                outerRadius={75}
                paddingAngle={expensesVal > 0 ? 4 : 0}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} style={{ outline: 'none' }} />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    const totalVal = incomeVal + expensesVal;
                    const percentage = totalVal > 0 ? ((data.value / totalVal) * 100).toFixed(0) : 0;
                    return (
                      <div className="bg-[#0F1F35]/95 border border-white/10 px-3 py-2.5 rounded-2xl shadow-xl backdrop-blur-md">
                        <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-0.5">{data.name}</p>
                        <p className="text-xs font-black text-white">${data.value.toLocaleString()} ({percentage}%)</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend
                iconType="circle"
                iconSize={8}
                formatter={(value) => (
                  <span style={{ color: '#94a3b8', fontSize: '10px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {value}
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* AI Insights stack */}
      <div className="flex flex-col gap-3">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider select-none">
          Weekly Insights
        </h3>
        <div className="flex flex-col gap-2.5">
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

      {/* Recent Activity Log */}
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

        {/* Shimmer skeletons while data refreshes */}
        {isFetching && (
          <div className="flex flex-col gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="skeleton h-14 w-full" />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isFetching && recentTransactions.length === 0 && (
          <div className="flex flex-col items-center justify-center text-center py-10 gap-3 select-none">
            <div className="p-4 bg-white/5 border border-white/10 rounded-2xl text-slate-500">
              <Receipt size={28} className="stroke-[1.5]" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">No expenses yet</p>
              <p className="text-xs text-slate-400 mt-0.5">Tap + to log your first expense</p>
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

        {/* Stagger-animated transaction list */}
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
    </motion.div>
  );
};

export default Dashboard;
