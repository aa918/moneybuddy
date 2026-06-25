import React from 'react';
import { motion } from 'framer-motion';
import {
  Utensils, ShoppingBag, Play, Activity, Home, CreditCard
} from 'lucide-react';

const iconMap = {
  Utensils, ShoppingBag, Play, Activity, Home, CreditCard
};

const getBarColor = (pct) => {
  if (pct >= 90) return 'bg-rose-500';
  if (pct >= 70) return 'bg-amber-400';
  return 'bg-brand-mint';
};

const getLabelColor = (pct) => {
  if (pct >= 90) return 'text-rose-400';
  if (pct >= 70) return 'text-amber-400';
  return 'text-brand-mint';
};

const CategoryBudgetBar = ({ category, spent, limit }) => {
  const Icon = iconMap[category.icon] || CreditCard;
  const pct = limit > 0 ? Math.min((spent / limit) * 100, 100) : 0;

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-white/5">
            <Icon size={13} className="text-slate-300" />
          </div>
          <span className="text-xs font-semibold text-slate-300">{category.name}</span>
        </div>
        <div className="flex items-baseline gap-1">
          <span className={`text-xs font-bold ${getLabelColor(pct)}`}>
            ${spent.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </span>
          <span className="text-[10px] text-slate-500 font-medium">
            / ${limit.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </span>
        </div>
      </div>

      <div className="w-full h-2 bg-slate-900/60 rounded-full overflow-hidden border border-white/5">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className={`h-full rounded-full transition-colors duration-500 ${getBarColor(pct)}`}
        />
      </div>

      <div className="flex justify-between items-center">
        <span className={`text-[10px] font-bold uppercase tracking-wider ${getLabelColor(pct)}`}>
          {pct.toFixed(0)}%
        </span>
        {pct >= 90 && (
          <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider">
            Almost exceeded
          </span>
        )}
        {pct >= 70 && pct < 90 && (
          <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
            Nearing limit
          </span>
        )}
      </div>
    </div>
  );
};

export default CategoryBudgetBar;
