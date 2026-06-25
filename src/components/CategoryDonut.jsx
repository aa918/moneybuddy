import React from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const COLOR_MAP = {
  orange: '#f97316',
  purple: '#a855f7',
  indigo: '#6366f1',
  teal:   '#14b8a6',
  amber:  '#f59e0b',
  slate:  '#64748b',
};

const CustomTooltip = ({ active, payload, total }) => {
  if (active && payload && payload.length) {
    const { name, value } = payload[0].payload;
    const pct = total > 0 ? ((value / total) * 100).toFixed(0) : 0;
    return (
      <div className="bg-[#0F1F35]/95 border border-white/10 px-3 py-2.5 rounded-2xl shadow-xl backdrop-blur-md">
        <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-0.5">{name}</p>
        <p className="text-xs font-black text-white">${value.toFixed(2)} · {pct}%</p>
      </div>
    );
  }
  return null;
};

const CategoryDonut = () => {
  const { transactions, categories } = useApp();

  const now = new Date();
  const thisMonthTxs = transactions.filter(tx => {
    const d = new Date(tx.date);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });

  const grouped = thisMonthTxs.reduce((acc, tx) => {
    acc[tx.category] = (acc[tx.category] || 0) + tx.amount;
    return acc;
  }, {});

  const getCategoryColor = (name) => {
    const cat = categories.find(c => c.name.toLowerCase() === name.toLowerCase());
    return cat ? (COLOR_MAP[cat.color] || '#64748b') : '#64748b';
  };

  const chartData = Object.entries(grouped).map(([name, value]) => ({
    name,
    value,
    color: getCategoryColor(name),
  }));

  const total = chartData.reduce((sum, d) => sum + d.value, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-brand-blue-card rounded-3xl p-5 border border-white/5 flex flex-col gap-3 select-none"
    >
      <div className="flex justify-between items-center">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          This Month · By Category
        </h3>
        <span className="text-xs font-extrabold text-white">
          ${total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
      </div>

      {chartData.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 gap-2">
          <div className="w-24 h-24 rounded-full border-[6px] border-dashed border-white/10" />
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">
            No expenses this month
          </p>
        </div>
      ) : (
        <>
          <div className="relative h-[180px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={52}
                  outerRadius={72}
                  paddingAngle={3}
                  dataKey="value"
                  isAnimationActive
                  animationBegin={0}
                  animationDuration={700}
                >
                  {chartData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} style={{ outline: 'none' }} />
                  ))}
                </Pie>
                <Tooltip content={(props) => <CustomTooltip {...props} total={total} />} />
              </PieChart>
            </ResponsiveContainer>

            {/* Center label */}
            <div className="absolute flex flex-col items-center justify-center text-center pointer-events-none">
              <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-widest">Spent</span>
              <span className="text-sm font-black text-white tracking-tight">
                ${total.toLocaleString('en-US', { maximumFractionDigits: 0 })}
              </span>
            </div>
          </div>

          {/* Category legend */}
          <div className="flex flex-wrap gap-x-4 gap-y-1.5">
            {chartData.map((entry) => (
              <div key={entry.name} className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: entry.color }} />
                <span className="text-[10px] font-bold text-slate-300 uppercase tracking-tight">{entry.name}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </motion.div>
  );
};

export default CategoryDonut;
