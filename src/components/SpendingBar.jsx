import React from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  CartesianGrid, ResponsiveContainer
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length && payload[0].value > 0) {
    return (
      <div className="bg-[#0F1F35]/95 border border-white/10 px-3 py-2.5 rounded-2xl shadow-xl backdrop-blur-md">
        <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-0.5">{label}</p>
        <p className="text-xs font-black text-white">${payload[0].value.toFixed(2)}</p>
      </div>
    );
  }
  return null;
};

const SpendingBar = () => {
  const { transactions } = useApp();

  const barData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - (6 - i));

    const amount = transactions
      .filter(tx => {
        const txDate = new Date(tx.date);
        return (
          txDate.getDate() === d.getDate() &&
          txDate.getMonth() === d.getMonth() &&
          txDate.getFullYear() === d.getFullYear()
        );
      })
      .reduce((sum, tx) => sum + tx.amount, 0);

    return {
      day: d.toLocaleDateString('en-US', { weekday: 'short' }),
      amount,
    };
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="bg-brand-blue-card rounded-3xl p-5 border border-white/5 flex flex-col gap-3 select-none"
    >
      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
        Daily Spending · Last 7 Days
      </h3>

      <div className="h-[130px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={barData}
            barSize={20}
            margin={{ top: 4, right: 4, bottom: 0, left: -24 }}
          >
            <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.04)" />
            <XAxis
              dataKey="day"
              tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis hide />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: 'rgba(255,255,255,0.04)', radius: 6 }}
            />
            <Bar
              dataKey="amount"
              fill="#34D399"
              radius={[6, 6, 0, 0]}
              isAnimationActive
              animationBegin={0}
              animationDuration={600}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default SpendingBar;
