import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Wallet, Zap, Users, BookOpen, Shield, Star, Globe, Lock, ChevronRight } from 'lucide-react';
import BgBlobs from '../components/BgBlobs';

const features = [
  { icon: Zap,      title: 'Skill Exchange',   desc: 'Swap skills peer-to-peer, completely free.' },
  { icon: BookOpen, title: 'Learn from Pros',   desc: 'Book paid sessions with verified experts.' },
  { icon: Users,    title: 'Team Formation',    desc: 'Build project teams with stake-based commitment.' },
  { icon: Shield,   title: 'Reputation System', desc: 'On-chain ratings you own forever.' },
];

const pillars = [
  {
    icon: Globe,
    color: 'from-violet-500 to-indigo-500',
    glow: '#6366f1',
    title: 'Open & Permissionless',
    desc: 'No central authority controls who can participate. Your skills, your terms. Anyone with a Stellar wallet can join instantly — no KYC, no gatekeeping.',
  },
  {
    icon: Star,
    color: 'from-amber-400 to-orange-500',
    glow: '#f59e0b',
    title: 'Reputation You Own',
    desc: 'Every rating, review, and completed swap is anchored to your on-chain identity. Your reputation is portable, permanent, and tamper-proof.',
  },
  {
    icon: Lock,
    color: 'from-teal-400 to-cyan-500',
    glow: '#06b6d4',
    title: 'Trustless by Design',
    desc: 'Smart contracts on Stellar hold escrow funds and enforce agreements automatically. No middlemen, no chargebacks — just code and consensus.',
  },
];

const steps = [
  { num: '01', title: 'Connect Wallet',  desc: 'Sign in with Freighter — no email or password needed.' },
  { num: '02', title: 'Post Your Skills', desc: 'List what you offer and what you want in return.' },
  { num: '03', title: 'Match & Transact', desc: 'Find a match, agree terms, and let the contract handle the rest.' },
  { num: '04', title: 'Build Your Rep',   desc: 'Rate each other on-chain and grow your decentralized portfolio.' },
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

        {/* ── HERO ─────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="tag mb-6"
        >
          🚀 Decentralized Skill Exchange · Powered by XLM
        </motion.div>

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

        {/* ── ABOUT SECTION ─────────────────────────────────────────── */}
        <section className="mt-36 w-full max-w-5xl text-left" id="about">

          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="tag mb-4 inline-block">✦ About Skill Swap</span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-white leading-tight">
              Built for the{' '}
              <span className="bg-gradient-to-r from-brand-400 to-accent bg-clip-text text-transparent">
                New Economy
              </span>
            </h2>
            <p className="mt-4 text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">
              Skill Swap reimagines how people learn and collaborate. Instead of paying platforms,
              you pay each other — directly, transparently, and without borders.
            </p>
          </motion.div>

          {/* Mission statement card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65 }}
            className="glass-card p-10 mb-10 relative overflow-hidden"
          >
            <div className="absolute -top-16 -left-16 w-56 h-56 rounded-full bg-brand-600/10 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-16 -right-16 w-56 h-56 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
            <p className="text-xl md:text-2xl font-semibold text-white leading-relaxed relative z-10">
              "We believe your skills are your most valuable asset.{' '}
              <span className="text-brand-400">Skill Swap</span> gives you a peer-to-peer marketplace
              to trade knowledge, earn XLM, and build real connections — governed by smart contracts,
              not corporations."
            </p>
            <div className="mt-6 flex items-center gap-3 relative z-10">
              <div className="w-8 h-0.5 bg-gradient-to-r from-brand-400 to-transparent" />
              <span className="text-sm text-slate-500">The Skill Swap Mission</span>
            </div>
          </motion.div>

          {/* Three pillars */}
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-20"
          >
            {pillars.map(({ icon: Icon, color, glow, title, desc }) => (
              <motion.div
                key={title}
                variants={item}
                whileHover={{ y: -6, boxShadow: `0 0 40px ${glow}25` }}
                className="glass-card p-7 cursor-default group"
              >
                <div
                  className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                >
                  <Icon size={22} className="text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* How It Works */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <span className="tag mb-4 inline-block">⚡ How It Works</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white">
              From Wallet to Skill — in 4 Steps
            </h2>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
          >
            {steps.map(({ num, title, desc }, idx) => (
              <motion.div
                key={num}
                variants={item}
                whileHover={{ y: -4 }}
                className="glass-card p-6 relative group cursor-default"
              >
                {idx < steps.length - 1 && (
                  <ChevronRight
                    size={16}
                    className="absolute -right-3 top-1/2 -translate-y-1/2 text-brand-500/50 hidden lg:block"
                  />
                )}
                <span className="text-4xl font-black bg-gradient-to-br from-brand-400 to-accent bg-clip-text text-transparent leading-none mb-4 block">
                  {num}
                </span>
                <h3 className="font-bold text-white mb-1">{title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Closing CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65 }}
            className="mt-16 glass-card p-10 text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-brand-600/10 via-transparent to-cyan-500/10 pointer-events-none" />
            <h3 className="text-2xl md:text-3xl font-extrabold text-white mb-3 relative z-10">
              Ready to swap your first skill?
            </h3>
            <p className="text-slate-400 mb-7 relative z-10 max-w-md mx-auto">
              Join thousands of learners and builders already on the Skill Swap network.
            </p>
            <div className="flex flex-wrap justify-center gap-4 relative z-10">
              <button onClick={() => navigate('/exchange')} className="btn-primary text-base px-8 py-3.5">
                Start Swapping <ArrowRight size={18} />
              </button>
              <button onClick={handleConnect} className="btn-outline text-base px-8 py-3.5">
                <Wallet size={18} /> Connect Wallet
              </button>
            </div>
          </motion.div>

        </section>
        {/* ── END ABOUT ─────────────────────────────────────────────── */}

      </main>
    </div>
  );
};

export default LandingPage;
