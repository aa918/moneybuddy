import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, AlertCircle, X } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const Toast = () => {
  const { toasts, removeToast } = useToast();

  return (
    <div className="absolute top-[72px] left-0 right-0 z-50 flex flex-col items-center gap-2 px-4 pointer-events-none">
      <AnimatePresence>
        {toasts.map(toast => (
          <motion.div
            key={toast.id}
            layout
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className={`pointer-events-auto flex items-center gap-2.5 px-4 py-3 rounded-2xl border shadow-xl text-xs font-bold w-full backdrop-blur-sm ${
              toast.type === 'success'
                ? 'bg-brand-mint/10 border-brand-mint/30 text-brand-mint'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
            }`}
          >
            {toast.type === 'success'
              ? <Check size={14} className="shrink-0 stroke-[3]" />
              : <AlertCircle size={14} className="shrink-0" />
            }
            <span className="flex-1">{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              className="p-0.5 hover:opacity-70 transition-opacity cursor-pointer shrink-0"
              aria-label="Dismiss"
            >
              <X size={12} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default Toast;
