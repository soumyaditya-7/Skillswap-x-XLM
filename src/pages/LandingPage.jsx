import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Wallet, Zap, BookOpen, Users, ArrowRight, Shield, Star, Lock, CheckCircle2, MessageSquare } from 'lucide-react';
import Tilt from 'react-parallax-tilt';
import BgBlobs from '../components/BgBlobs';

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
      <BgBlobs />

      <main className="relative z-10 flex flex-col items-center pt-32 pb-24 px-6 w-full overflow-hidden">

        {/* ── 1. HERO SECTION ─────────────────────────────────────────────────── */}
        <section className="relative flex flex-col md:flex-row items-center justify-between text-left max-w-6xl mx-auto mb-40 w-full min-h-[70vh]">
          
          {/* Left Text Column */}
          <div className="md:w-1/2 z-10 flex flex-col items-start relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/60 border border-white/5 text-xs font-semibold text-brand-300 mb-8 backdrop-blur-md shadow-lg"
            >
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" style={{ boxShadow: '0 0 10px #22d3ee' }}></span>
              SkillSwap V2 is now live on Stellar Testnet
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-6xl md:text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-white/40 tracking-tight font-outfit mb-6 leading-[1.05]"
            >
              Swap Skills.<br />
              <span className="bg-gradient-to-r from-brand-400 to-cyan-400 bg-clip-text text-transparent">Learn. Build. Earn.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="text-lg md:text-xl text-slate-400 max-w-lg leading-relaxed mb-10 font-medium"
            >
              The decentralized platform where people exchange skills, book expert mentorship, 
              and build trusted project teams using Web3.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-wrap items-center gap-4"
            >
              <button onClick={() => navigate('/exchange')} className="relative inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white text-black font-bold text-base hover:scale-105 transition-all shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.5)] z-10 group overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-white via-brand-100 to-white opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <span className="relative z-10 flex items-center gap-2">Get Started <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></span>
              </button>
              <button onClick={onConnectClick} className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-secondary/50 text-white border border-white/10 font-semibold text-base hover:bg-white/5 hover:border-white/20 backdrop-blur-md transition-all z-10">
                <Wallet size={18} className="text-cyan-400" /> Connect Wallet
              </button>
            </motion.div>
          </div>

          {/* Right 3D Visual Abstract Element */}
          <div className="md:w-1/2 absolute md:relative right-0 opacity-20 md:opacity-100 pointer-events-none mt-20 md:mt-0 flex justify-center h-[500px] w-full z-0 perspective-1000">
             <motion.div 
               animate={{ 
                 rotateY: [0, 10, -10, 0],
                 rotateX: [0, -5, 5, 0],
                 y: [0, -20, 0]
               }}
               transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
               className="relative w-80 h-80"
             >
               {/* Glowing Sphere Core */}
               <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-brand-600/40 to-cyan-400/40 blur-3xl shadow-[0_0_100px_#6366f1]"></div>
               
               {/* 3D Glass Cards rotating around */}
               <motion.div 
                 animate={{ rotateZ: 360 }} 
                 transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                 className="absolute inset-0 w-full h-full"
               >
                 <div className="absolute -top-10 -left-10 w-48 h-32 rounded-2xl border border-white/20 bg-white/5 backdrop-blur-xl shadow-2xl p-4 transform -rotate-12">
                   <div className="flex items-center gap-3 mb-3"><div className="w-8 h-8 rounded-full bg-brand-500 flex items-center justify-center"><Zap size={14} className="text-white"/></div><div className="h-2 w-16 bg-white/20 rounded"></div></div>
                   <div className="space-y-2"><div className="h-2 w-full bg-white/10 rounded"></div><div className="h-2 w-3/4 bg-white/10 rounded"></div></div>
                 </div>
               </motion.div>

               <motion.div 
                 animate={{ rotateZ: -360 }} 
                 transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                 className="absolute inset-0 w-full h-full"
               >
                 <div className="absolute top-40 -right-20 w-56 h-40 rounded-2xl border border-cyan-400/30 bg-black/40 backdrop-blur-2xl shadow-[0_0_30px_rgba(6,182,212,0.2)] p-4 transform rotate-12 flex flex-col justify-between">
                   <div className="flex justify-between items-center"><div className="h-3 w-20 bg-cyan-400/50 rounded"></div><div className="h-3 w-8 bg-green-400/50 rounded"></div></div>
                   <div className="flex gap-2 items-end h-16">
                     {[40, 70, 45, 90, 60, 100].map((h, i) => <div key={i} className="w-full bg-gradient-to-t from-cyan-500/20 to-cyan-400/80 rounded-t-sm" style={{ height: `${h}%` }}></div>)}
                   </div>
                 </div>
               </motion.div>
             </motion.div>
          </div>
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
