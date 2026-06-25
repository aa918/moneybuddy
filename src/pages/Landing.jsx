import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { Wallet, Zap, PiggyBank, Bell, TrendingUp, Check, ChevronDown } from 'lucide-react';

const features = [
  { icon: Zap, title: 'הוספת הוצאה בשתי קליקות', desc: 'גע, בחר קטגוריה ושמור — פחות מ-10 שניות' },
  { icon: PiggyBank, title: 'תקציב לפי קטגוריה', desc: 'קבע גבולות ועקוב אחר ההתקדמות בזמן אמת' },
  { icon: Bell, title: 'התראות חכמות', desc: 'קבל התראה לפני שאתה חורג מהתקציב' },
  { icon: TrendingUp, title: 'תובנות AI', desc: 'ניתוח מתקדם של דפוסי ההוצאות שלך' },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

const sectionAnim = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
};

const Landing = () => {
  const navigate = useNavigate();

  const counterRef = useRef(null);
  const isInView = useInView(counterRef, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let current = 0;
    const target = 800;
    const step = Math.ceil(target / (1800 / 16));
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      setCount(current);
      if (current >= target) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [isInView]);

  return (
    <div dir="rtl" className="min-h-screen bg-[#0F1F35] text-white overflow-x-hidden">

      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-50 glassmorphism border-b border-white/5 px-6 lg:px-16 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-white/5 border border-white/10 rounded-2xl text-brand-mint glow-mint">
            <Wallet size={20} className="stroke-[1.8]" />
          </div>
          <span className="font-extrabold text-lg tracking-tight text-brand-mint">MoneyBuddy</span>
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate('/login')}
          className="px-4 py-2 rounded-xl border border-white/20 text-white text-sm font-bold hover:bg-white/5 transition-all cursor-pointer"
        >
          התחברות
        </motion.button>
      </nav>

      {/* ── Hero ── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 lg:px-16 py-24 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-mint/8 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/8 rounded-full blur-3xl pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 max-w-3xl mx-auto flex flex-col items-center gap-6"
        >
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-brand-mint/30 text-brand-mint text-xs font-bold uppercase tracking-wider">
            <div className="w-1.5 h-1.5 rounded-full bg-brand-mint animate-pulse" />
            הניהול הפיננסי החכם
          </span>

          <h1 className="text-4xl lg:text-6xl font-black tracking-tight leading-tight">
            נהל את הכסף שלך<br />
            <span className="text-brand-mint">בשניות, לא בשעות</span>
          </h1>

          <p className="text-slate-400 text-lg leading-relaxed max-w-xl">
            עקוב אחרי הוצאות, הגדר תקציבים לפי קטגוריה וצור יעדי חיסכון — הכל במקום אחד
          </p>

          <div className="flex items-center gap-4 flex-wrap justify-center">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/login', { state: { mode: 'register' } })}
              className="px-7 py-3.5 bg-brand-mint text-slate-950 rounded-2xl font-extrabold text-sm uppercase tracking-wider glow-button cursor-pointer shadow-lg"
            >
              התחל עכשיו
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/login')}
              className="px-7 py-3.5 border border-white/20 text-white rounded-2xl font-bold text-sm hover:bg-white/5 transition-all cursor-pointer"
            >
              התחברות
            </motion.button>
          </div>
        </motion.div>

        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
          className="absolute bottom-10 text-slate-500"
        >
          <ChevronDown size={24} />
        </motion.div>
      </section>

      {/* ── Features ── */}
      <motion.section {...sectionAnim} className="py-24 px-6 lg:px-16">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl lg:text-3xl font-black text-white">למה MoneyBuddy?</h2>
            <p className="text-slate-400 mt-2 text-sm">כלים חכמים שמשנים את הדרך שבה אתה מנהל כסף</p>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {features.map(({ icon: Icon, title, desc }) => (
              <motion.div
                key={title}
                variants={cardVariants}
                className="bg-brand-blue-card border border-white/5 rounded-3xl p-6 flex flex-col gap-4 hover:border-white/10 transition-colors"
              >
                <div className="w-10 h-10 rounded-2xl bg-brand-mint/10 border border-brand-mint/20 flex items-center justify-center text-brand-mint">
                  <Icon size={20} className="stroke-[1.8]" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm leading-snug">{title}</h3>
                  <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">{desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* ── App Mockup ── */}
      <motion.section {...sectionAnim} className="py-24 px-6 lg:px-16">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl lg:text-3xl font-black text-white">הדשבורד שלך, בזמן אמת</h2>
            <p className="text-slate-400 mt-2 text-sm">כל מה שצריך לדעת על הכסף שלך — במבט אחד</p>
          </div>

          <div className="bg-brand-blue-card rounded-3xl border border-white/10 shadow-2xl overflow-hidden max-w-2xl mx-auto">
            {/* Fake browser chrome */}
            <div className="bg-[#162D4A]/80 border-b border-white/5 px-4 py-3 flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-rose-500/60" />
                <div className="w-3 h-3 rounded-full bg-amber-400/60" />
                <div className="w-3 h-3 rounded-full bg-brand-mint/60" />
              </div>
              <div className="flex-1 bg-white/5 rounded-lg px-3 py-1.5 text-[11px] text-slate-500 font-mono">
                app.moneybuddy.io/dashboard
              </div>
            </div>

            {/* Dashboard preview */}
            <div className="p-5 flex flex-col gap-4 bg-[#0F1F35]">
              {/* Welcome row */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Account Balance</p>
                  <h3 className="text-lg font-black text-white mt-0.5">Hey, Daniel 👋</h3>
                </div>
                <div className="bg-brand-blue-card rounded-2xl px-4 py-2.5 border border-white/5 flex items-center gap-2.5">
                  <div>
                    <p className="text-[9px] text-slate-400 uppercase tracking-wider">Total Income</p>
                    <p className="text-base font-black text-brand-mint">$5,200.00</p>
                  </div>
                  <div className="p-2 bg-brand-mint/10 rounded-xl text-brand-mint">
                    <TrendingUp size={14} />
                  </div>
                </div>
              </div>

              {/* Budget bars */}
              <div className="bg-brand-blue-card rounded-2xl p-4 border border-white/5 flex flex-col gap-3">
                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Category Budgets</p>
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between text-[11px]">
                    <span className="font-semibold text-white">אוכל</span>
                    <span className="text-slate-400">$340 / $500</span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-brand-mint rounded-full" style={{ width: '68%' }} />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between text-[11px]">
                    <span className="font-semibold text-white">בילויים</span>
                    <span className="text-rose-400">$184 / $200</span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-rose-500 rounded-full" style={{ width: '92%' }} />
                  </div>
                </div>
              </div>

              {/* Recent transactions */}
              <div className="flex flex-col gap-2">
                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Recent Activity</p>
                {[
                  { name: 'Wolt', cat: 'אוכל', amt: '-₪45', color: 'text-rose-400' },
                  { name: 'Netflix', cat: 'בילויים', amt: '-₪37', color: 'text-rose-400' },
                  { name: 'Salary', cat: 'הכנסה', amt: '+₪8,500', color: 'text-brand-mint' },
                ].map(tx => (
                  <div key={tx.name} className="flex items-center justify-between bg-white/3 rounded-xl px-3 py-2.5 border border-white/5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-slate-400">
                        <span className="text-xs font-bold">{tx.name[0]}</span>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-white">{tx.name}</p>
                        <p className="text-[10px] text-slate-500">{tx.cat}</p>
                      </div>
                    </div>
                    <span className={`text-xs font-black ${tx.color}`}>{tx.amt}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ── Savings Highlight ── */}
      <motion.section {...sectionAnim} className="py-24 px-6 lg:px-16">
        <div
          ref={counterRef}
          className="max-w-3xl mx-auto text-center bg-gradient-to-br from-brand-blue-card to-[#0F1F35] border border-brand-mint/20 rounded-3xl p-10 lg:p-16 shadow-xl"
        >
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-brand-mint/30 text-brand-mint text-xs font-bold uppercase tracking-wider mb-6">
            <div className="w-1.5 h-1.5 rounded-full bg-brand-mint" />
            חיסכון ממוצע
          </span>

          <p className="text-slate-300 text-lg font-semibold mb-2">משתמשים חוסכים בממוצע</p>

          <div className="text-5xl lg:text-7xl font-black text-brand-mint my-4">
            {count.toLocaleString('he-IL')} ₪
          </div>

          <p className="text-slate-400 text-lg mb-8">בחודש</p>

          <div className="flex flex-col gap-3 text-sm text-right max-w-xs mx-auto">
            {[
              'מעקב אחרי הוצאות מדויק יותר',
              'התראות שמונעות חריגה מהתקציב',
              'יעדי חיסכון שמניעים לפעולה',
            ].map(point => (
              <div key={point} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-brand-mint/10 border border-brand-mint/30 flex items-center justify-center shrink-0">
                  <Check size={11} className="text-brand-mint stroke-[3]" />
                </div>
                <span className="text-slate-300 font-medium">{point}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ── Final CTA ── */}
      <motion.section {...sectionAnim} className="py-24 px-6 text-center">
        <div className="max-w-xl mx-auto flex flex-col items-center gap-6">
          <h2 className="text-3xl lg:text-4xl font-black text-white">מוכן להתחיל לחסוך?</h2>
          <p className="text-slate-400 text-base leading-relaxed">
            הצטרף למאות משתמשים שכבר מנהלים את הכסף שלהם בצורה חכמה
          </p>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/login', { state: { mode: 'register' } })}
            className="px-8 py-4 bg-brand-mint text-slate-950 rounded-2xl font-extrabold text-sm uppercase tracking-wider glow-button cursor-pointer shadow-xl"
          >
            התחל חינם עכשיו
          </motion.button>
          <p className="text-slate-500 text-xs">ללא כרטיס אשראי • 100% חינמי</p>
        </div>
      </motion.section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/5 py-8 px-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="p-1.5 bg-white/5 border border-white/10 rounded-xl text-brand-mint">
            <Wallet size={16} className="stroke-[1.8]" />
          </div>
          <span className="font-extrabold text-sm text-brand-mint">MoneyBuddy</span>
        </div>
        <p className="text-slate-500 text-xs mb-4">© 2026 MoneyBuddy. כל הזכויות שמורות.</p>
        <div className="flex items-center justify-center gap-6">
          {['פרטיות', 'תנאי שימוש', 'יצירת קשר'].map(link => (
            <button key={link} className="text-slate-500 hover:text-slate-300 text-xs font-medium transition-colors cursor-pointer">
              {link}
            </button>
          ))}
        </div>
      </footer>
    </div>
  );
};

export default Landing;
