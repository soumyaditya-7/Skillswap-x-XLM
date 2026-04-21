import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Wallet, Zap, BookOpen, Users, ArrowRight } from 'lucide-react';
import BgBlobs from '../components/BgBlobs';

const cards = [
  {
    icon: Zap,
    title: 'Skill Exchange',
    desc: 'Swap your skills with others — zero cost, full value.',
    to: '/exchange',
    color: 'from-brand-600 to-brand-700',
    glow: '#6366f1',
  },
  {
    icon: BookOpen,
    title: 'Learn from Professionals',
    desc: 'Book 1:1 sessions and pay with XLM.',
    to: '/learn',
    color: 'from-violet-600 to-purple-700',
    glow: '#7c3aed',
  },
  {
    icon: Users,
    title: 'Form a Team',
    desc: 'Build project teams with stake-based commitment.',
    to: '/teams',
    color: 'from-indigo-600 to-blue-700',
    glow: '#4f46e5',
  },
];

const DashboardPage = ({ wallet }) => {
  const navigate = useNavigate();

  return (
    <div className="page-wrapper">
      <BgBlobs />

      <main className="relative z-10 pt-28 pb-20 px-6 max-w-5xl mx-auto">
        {/* Wallet badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-800 border border-brand-500/30 text-brand-400 text-sm font-mono mb-10"
        >
          <Wallet size={15} /> {wallet || 'GD3K...X7F2'}
          <span className="ml-2 w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-5xl font-extrabold text-white mb-3"
        >
          Welcome back 👋
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-slate-400 text-lg mb-14"
        >
          What would you like to do today?
        </motion.p>

        {/* Action cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map(({ icon: Icon, title, desc, to, color, glow }, i) => (
            <motion.button
              key={title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 * i + 0.2 }}
              whileHover={{ y: -6, boxShadow: `0 0 40px ${glow}40` }}
              onClick={() => navigate(to)}
              className="glass-card p-7 text-left group transition-all duration-300"
            >
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center mb-5 shadow-lg`}>
                <Icon size={22} className="text-white" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">{title}</h2>
              <p className="text-sm text-slate-400 leading-relaxed mb-5">{desc}</p>
              <span className="inline-flex items-center gap-1 text-brand-400 text-sm font-semibold group-hover:gap-2 transition-all">
                Open <ArrowRight size={14} />
              </span>
            </motion.button>
          ))}
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
