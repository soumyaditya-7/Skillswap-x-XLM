import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Wallet, Zap, Users, BookOpen, Shield } from 'lucide-react';
import BgBlobs from '../components/BgBlobs';

const features = [
  { icon: Zap,      title: 'Skill Exchange',       desc: 'Swap skills peer-to-peer, completely free.' },
  { icon: BookOpen, title: 'Learn from Pros',       desc: 'Book paid sessions with verified experts.' },
  { icon: Users,    title: 'Team Formation',        desc: 'Build project teams with stake-based commitment.' },
  { icon: Shield,   title: 'Reputation System',     desc: 'On-chain ratings you own forever.' },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};
const item = {
  hidden: { opacity: 0, y: 30 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
};

const LandingPage = ({ onConnectClick }) => {
  const navigate = useNavigate();

  const handleConnect = () => {
    onConnectClick();
  };

  return (
    <div className="page-wrapper">
      <BgBlobs />

      <main className="relative z-10 flex flex-col items-center text-center pt-36 pb-24 px-6">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="tag mb-6"
        >
          🚀 Decentralized Skill Exchange · Powered by XLM
        </motion.div>

        {/* Hero headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.1 }}
          className="text-5xl md:text-7xl font-extrabold text-white leading-tight max-w-4xl"
        >
          Exchange Skills.{' '}
          <span className="bg-gradient-to-r from-brand-400 to-accent bg-clip-text text-transparent">
            Grow Together.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mt-6 text-lg text-slate-400 max-w-xl leading-relaxed"
        >
          A Web3 marketplace to swap skills for free, learn from professionals,
          and build teams — all with decentralized trust.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.38 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <button onClick={() => navigate('/exchange')} className="btn-primary text-base px-8 py-3.5">
            Get Started <ArrowRight size={18} />
          </button>
          <button onClick={handleConnect} className="btn-outline text-base px-8 py-3.5">
            <Wallet size={18} /> Connect Wallet
          </button>
        </motion.div>

        {/* Floating skill chips */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mt-20 flex flex-wrap justify-center gap-3 max-w-2xl"
        >
          {['React', 'Solidity', 'Design', 'Python', 'Marketing', 'Figma', 'Node.js', 'Blockchain'].map((s, i) => (
            <motion.span
              key={s}
              className="tag animate-float cursor-default"
              style={{ animationDelay: `${i * 0.4}s` }}
              whileHover={{ scale: 1.1 }}
            >
              {s}
            </motion.span>
          ))}
        </motion.div>

        {/* Feature cards */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="mt-28 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-5xl w-full text-left"
        >
          {features.map(({ icon: Icon, title, desc }) => (
            <motion.div
              key={title}
              variants={item}
              whileHover={{ y: -4, boxShadow: '0 0 30px #6366f120' }}
              className="glass-card p-6 cursor-default"
            >
              <div className="w-10 h-10 rounded-xl bg-brand-600/20 flex items-center justify-center mb-4">
                <Icon size={20} className="text-brand-400" />
              </div>
              <h3 className="font-semibold text-white mb-1">{title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-24 grid grid-cols-3 gap-10 text-center"
        >
          {[['1,200+', 'Skills Listed'], ['840+', 'Swaps Done'], ['320+', 'Teams Formed']].map(([val, label]) => (
            <div key={label}>
              <p className="text-4xl font-extrabold bg-gradient-to-r from-brand-400 to-accent bg-clip-text text-transparent">{val}</p>
              <p className="text-sm text-slate-400 mt-1">{label}</p>
            </div>
          ))}
        </motion.div>
      </main>
    </div>
  );
};

export default LandingPage;
