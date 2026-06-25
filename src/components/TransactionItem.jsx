import React from 'react';
import { 
  Utensils, 
  ShoppingBag, 
  Play, 
  Activity, 
  Home, 
  TrendingUp, 
  CreditCard 
} from 'lucide-react';

const getCategoryStyles = (category, type) => {
  if (type === 'income') {
    return {
      icon: TrendingUp,
      bgColor: 'bg-emerald-500/10',
      iconColor: 'text-brand-mint'
    };
  }

  switch (category.toLowerCase()) {
    case 'food':
      return {
        icon: Utensils,
        bgColor: 'bg-orange-500/10',
        iconColor: 'text-orange-400'
      };
    case 'shopping':
      return {
        icon: ShoppingBag,
        bgColor: 'bg-purple-500/10',
        iconColor: 'text-purple-400'
      };
    case 'entertainment':
      return {
        icon: Play,
        bgColor: 'bg-indigo-500/10',
        iconColor: 'text-indigo-400'
      };
    case 'health':
      return {
        icon: Activity,
        bgColor: 'bg-teal-500/10',
        iconColor: 'text-teal-400'
      };
    case 'housing':
      return {
        icon: Home,
        bgColor: 'bg-amber-500/10',
        iconColor: 'text-amber-400'
      };
    default:
      return {
        icon: CreditCard,
        bgColor: 'bg-slate-500/10',
        iconColor: 'text-slate-400'
      };
  }
};

const TransactionItem = ({ title, amount, category, type, date, onClick }) => {
  const styles = getCategoryStyles(category, type);
  const Icon = styles.icon;

  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });

  return (
    <div 
      onClick={onClick}
      className="flex items-center justify-between p-3.5 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 active:scale-[0.98] transition-all duration-200 cursor-pointer group select-none"
    >
      <div className="flex items-center gap-3">
        {/* Soft-colored rounded icon slot */}
        <div className={`p-2.5 rounded-xl ${styles.bgColor} ${styles.iconColor} transition-transform duration-250 group-hover:scale-105`}>
          <Icon size={16} className="stroke-[2.2]" />
        </div>
        <div>
          <h4 dir="auto" className="text-sm font-semibold text-white tracking-tight">{title}</h4>
          <span className="text-[10px] text-slate-400 font-medium">{category} • {formattedDate}</span>
        </div>
      </div>
      
      <div className="text-right">
        <span className={`text-sm font-bold tracking-tight ${
          type === 'income' ? 'text-brand-mint' : 'text-slate-200'
        }`}>
          {type === 'income' ? '+' : '-'}${(() => {
            const amountVal = typeof amount === 'number' && !isNaN(amount) ? amount : 0;
            return amountVal.toFixed(2);
          })()}
        </span>
      </div>
    </div>
  );
};

export default TransactionItem;
