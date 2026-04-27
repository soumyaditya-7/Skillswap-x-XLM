import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Wallet, Zap, BookOpen, Users, ArrowRight, Shield, Star, Lock, CheckCircle2, MessageSquare } from 'lucide-react';
import Tilt from 'react-parallax-tilt';
import OrbBg from '../components/OrbBg';

const features = [
  { 
    icon: Zap,      
    title: 'Skill Exchange',   
    desc: 'Trade skills peer-to-peer for free. Example: Coding ↔ Guitar.',
    color: 'from-blue-500 to-cyan-400'
  },
  { 
    icon: BookOpen, 
    title: 'Learn from Professionals',   
    desc: 'Book paid sessions with verified mentors using XLM.',
    color: 'from-purple-500 to-indigo-500'
  },
  { 
    icon: Users,    
    title: 'Project Teams',    
    desc: 'Join hackathon/project teams with stake-based commitment.',
    color: 'from-emerald-400 to-teal-500'
  },
];

const timelineSteps = [
  { num: '01', title: 'Create Profile', desc: 'Connect wallet & set identity.' },
  { num: '02', title: 'Add Skills', desc: 'List what you know & what you want to learn.' },
  { num: '03', title: 'Match & Hire', desc: 'Find your perfect peer or professional mentor.' },
  { num: '04', title: 'Grow Reputation', desc: 'Earn on-chain ratings after every successful swap.' },
];

const trustFeatures = [
  { icon: Wallet, title: 'Wallet Login', desc: 'No passwords. Your keys, your identity.' },
  { icon: Lock, title: 'Smart Contracts', desc: 'Escrow ensures fair and trustless swaps.' },
  { icon: Shield, title: 'Secure Payments', desc: 'Instant XLM settlements globally.' },
  { icon: Star, title: 'Transparent Reputation', desc: 'Immutable reviews on the Stellar network.' },
];

const testimonials = [
  {
    name: 'Alex D.',
    role: 'Frontend Developer',
    text: 'SkillSwap allowed me to trade my React knowledge for Spanish lessons. The smart contract escrow made it completely stress-free.',
    avatar: 'https://i.pravatar.cc/150?img=11'
  },
  {
    name: 'Sarah M.',
    role: 'UI/UX Designer',
    text: 'I booked a mentor to learn Framer Motion. Paid seamlessly in XLM and the video session was incredibly high quality.',
    avatar: 'https://i.pravatar.cc/150?img=5'
  },
  {
    name: 'David K.',
    role: 'Smart Contract Auditor',
    text: 'Formed a hackathon team by staking XLM. Everyone actually showed up and delivered because of the financial commitment!',
    avatar: 'https://i.pravatar.cc/150?img=33'
  }
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const LandingPage = ({ onConnectClick }) => {
  const navigate = useNavigate();

  return (
    <div className="page-wrapper font-sans text-foreground">
      <OrbBg />

      <main className="relative z-10 flex flex-col items-center pt-32 pb-24 px-6 w-full overflow-hidden">

        {/* ── 1. HERO SECTION ─────────────────────────────────────────────────── */}
        <section className="relative flex flex-col items-center justify-center text-center max-w-5xl mx-auto mb-40 w-full min-h-[70vh] pt-20">
          
          {/* Subtle Ambient Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-brand-500/10 blur-[120px] rounded-full pointer-events-none -z-10"></div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/10 text-xs font-medium text-slate-300 mb-8 backdrop-blur-md"
          >
            <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.6)]"></span>
            SkillSwap V2 is live on Stellar
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl md:text-7xl font-bold text-white tracking-[-0.02em] font-outfit mb-6 leading-[1.1] max-w-4xl"
          >
            Swap Skills. Learn.<br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-300 to-slate-500"> Build. Earn.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-lg text-slate-400 max-w-2xl leading-relaxed mb-10 font-normal"
          >
            The decentralized platform where top talent exchanges skills, books expert mentorship, 
            and builds trusted project teams — powered by Web3.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            <button onClick={() => navigate('/exchange')} className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-white text-black font-medium text-sm hover:bg-slate-200 transition-colors">
              Get Started <ArrowRight size={16} />
            </button>
            <button onClick={onConnectClick} className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-transparent text-white border border-white/20 font-medium text-sm hover:bg-white/5 transition-colors">
              <Wallet size={16} className="text-slate-400" /> Connect Wallet
            </button>
          </motion.div>

        </section>

        {/* ── 2. CORE FEATURES SECTION ────────────────────────────────────────── */}
        <section className="w-full max-w-6xl mx-auto mb-32">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold font-outfit tracking-tight mb-4 text-foreground">A unified platform for growth</h2>
            <p className="text-muted-foreground text-lg">Everything you need to level up your career, powered by smart contracts.</p>
          </div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {features.map(({ icon: Icon, title, desc, color }) => (
              <Tilt key={title} tiltMaxAngleX={4} tiltMaxAngleY={4} scale={1.02} transitionSpeed={2000} gyroscope={false}>
                <motion.div variants={item} className="glass-card-glow p-8 h-full flex flex-col group text-left">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center mb-6 shadow-lg`}>
                    <Icon size={28} className="text-white" />
                  </div>
                  <h3 className="text-2xl font-bold font-outfit text-foreground mb-3">{title}</h3>
                  <p className="text-muted-foreground leading-relaxed flex-grow">{desc}</p>
                </motion.div>
              </Tilt>
            ))}
          </motion.div>
        </section>

        {/* ── 3. HOW IT WORKS (Timeline UI) ─────────────────────────────────── */}
        <section className="w-full max-w-5xl mx-auto mb-32">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="md:w-1/3 text-left">
              <h2 className="text-3xl md:text-5xl font-bold font-outfit tracking-tight mb-6">How it works</h2>
              <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                SkillSwap replaces traditional platform fees with a peer-to-peer network. Here's how you get started in minutes.
              </p>
              <button onClick={() => navigate('/exchange')} className="inline-flex items-center gap-2 text-brand-400 font-semibold hover:text-brand-300 transition-colors">
                Explore the marketplace <ArrowRight size={16} />
              </button>
            </div>

            <div className="md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-6 relative">
              {/* Animated connection line */}
              <div className="hidden sm:block absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-brand-500/30 to-transparent -translate-y-1/2 -z-10"></div>
              
              {timelineSteps.map(({ num, title, desc }, idx) => (
                <motion.div 
                  key={num}
                  initial={{ opacity: 0, y: 30, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ delay: idx * 0.15, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="glass-card-glow p-8 h-full"
                >
                  <span className="text-sm font-mono text-brand-500 font-bold mb-2 block">{num}</span>
                  <h4 className="text-lg font-bold text-foreground mb-2 font-outfit">{title}</h4>
                  <p className="text-sm text-muted-foreground">{desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 4. TRUST / WEB3 SECTION ───────────────────────────────────────── */}
        <section className="w-full max-w-6xl mx-auto mb-32 py-16 px-8 rounded-3xl bg-secondary/30 border border-white/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 blur-[100px] rounded-full pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 blur-[100px] rounded-full pointer-events-none"></div>
          
          <div className="text-center relative z-10 mb-16">
            <h2 className="text-3xl md:text-5xl font-bold font-outfit tracking-tight mb-4">Web3 Trust Layer</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">No middlemen. No corporate overlords. Just code ensuring you get exactly what was agreed upon.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {trustFeatures.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="text-center flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-background border border-border flex items-center justify-center mb-6">
                  <Icon size={24} className="text-foreground" />
                </div>
                <h4 className="text-lg font-bold font-outfit text-foreground mb-2">{title}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── 5. STATS SECTION ──────────────────────────────────────────────── */}
        <section className="w-full max-w-5xl mx-auto mb-32 text-center">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {[
              { val: '10K+', label: 'Skills Shared' },
              { val: '2K+', label: 'Verified Mentors' },
              { val: '500+', label: 'Teams Formed' },
              { val: '99%', label: 'Trust Score' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6"
              >
                <div className="text-4xl md:text-6xl font-extrabold font-outfit text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-cyan-400 mb-2">{stat.val}</div>
                <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── 6. TESTIMONIALS ───────────────────────────────────────────────── */}
        <section className="w-full max-w-6xl mx-auto mb-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold font-outfit tracking-tight mb-4">Loved by builders</h2>
            <p className="text-muted-foreground text-lg">See what the community is saying about SkillSwap.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((test, i) => (
              <motion.div
                key={test.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="glass-card p-8 flex flex-col justify-between"
              >
                <MessageSquare className="text-brand-500/40 mb-6" size={32} />
                <p className="text-foreground leading-relaxed mb-8 italic">"{test.text}"</p>
                <div className="flex items-center gap-4">
                  <img src={test.avatar} alt={test.name} className="w-12 h-12 rounded-full border border-border" />
                  <div>
                    <h4 className="font-bold text-foreground font-outfit">{test.name}</h4>
                    <p className="text-xs text-muted-foreground">{test.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── 7. CTA BANNER ─────────────────────────────────────────────────── */}
        <section className="w-full max-w-5xl mx-auto mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative rounded-[2rem] p-12 text-center overflow-hidden"
          >
            {/* Cinematic Gradient Background for CTA */}
            <div className="absolute inset-0 bg-gradient-to-br from-brand-600 via-indigo-900 to-black z-0"></div>
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')] opacity-10 mix-blend-overlay z-10 pointer-events-none"></div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-t from-black/80 to-transparent z-10"></div>
            
            <div className="relative z-20">
              <h2 className="text-4xl md:text-6xl font-extrabold font-outfit text-white tracking-tight mb-6 leading-tight">
                Start learning, teaching,<br/>and building today.
              </h2>
              <div className="flex flex-wrap justify-center gap-4 mt-8">
                <button onClick={() => navigate('/exchange')} className="px-8 py-4 rounded-xl bg-white text-black font-bold text-base hover:scale-105 transition-all shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:shadow-[0_0_50px_rgba(255,255,255,0.5)]">
                  Launch App
                </button>
                <button onClick={() => window.open('https://discord.com', '_blank')} className="px-8 py-4 rounded-xl bg-black/40 text-white border border-white/20 font-semibold text-base hover:bg-black/60 backdrop-blur-md transition-all">
                  Join Community
                </button>
              </div>
            </div>
          </motion.div>
        </section>

      </main>
    </div>
  );
};

export default LandingPage;
