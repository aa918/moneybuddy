import React from 'react';

const InsightCard = ({ title, description, borderColor = 'border-brand-mint', icon: Icon }) => {
  return (
    <div className={`p-4 bg-brand-blue-card rounded-2xl border-l-4 ${borderColor} shadow-md flex items-start gap-3 hover:translate-x-1 transition-all duration-200 cursor-pointer select-none`}>
      {Icon && (
        <div className="p-2 bg-white/5 rounded-xl text-slate-300">
          <Icon size={16} className="stroke-[2.2]" />
        </div>
      )}
      <div className="flex-1">
        <h4 className="text-xs font-bold text-white tracking-wide uppercase mb-0.5">{title}</h4>
        <p className="text-xs text-slate-400 leading-relaxed font-medium">{description}</p>
      </div>
    </div>
  );
};

export default InsightCard;
