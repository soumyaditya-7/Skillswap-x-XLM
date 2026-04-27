import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Wallet, Zap, BookOpen, Users, ArrowRight, Activity, TrendingUp, Star } from 'lucide-react';
import Tilt from 'react-parallax-tilt';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import BgBlobs from '../components/BgBlobs';

const cards = [
  {
    icon: Zap,
    title: 'Skill Exchange',
    desc: 'Swap your skills with others — zero cost, full value.',
    to: '/exchange',
    color: 'from-brand-600 to-brand-700',
  },
  {
    icon: BookOpen,
    title: 'Learn from Professionals',
    desc: 'Book 1:1 sessions and pay with XLM.',
    to: '/learn',
    color: 'from-violet-600 to-purple-700',
  },
  {
    icon: Users,
    title: 'Form a Team',
    desc: 'Build project teams with stake-based commitment.',
    to: '/teams',
    color: 'from-indigo-600 to-blue-700',
  },
];

const mockChartData = [
  { name: 'Mon', volume: 120 },
  { name: 'Tue', volume: 200 },
  { name: 'Wed', volume: 150 },
  { name: 'Thu', volume: 380 },
  { name: 'Fri', volume: 290 },
  { name: 'Sat', volume: 450 },
  { name: 'Sun', volume: 520 },
];

const mockActivity = [
  { id: 1, user: 'Alice', action: 'completed swap with', target: 'Bob', time: '2m ago' },
  { id: 2, user: 'Charlie', action: 'staked 50 XLM in', target: 'DeFi Team', time: '15m ago' },
  { id: 3, user: 'Dave', action: 'booked session with', target: 'Eve', time: '1h ago' },
  { id: 4, user: 'Frank', action: 'earned a 5-star rating from', target: 'Grace', time: '3h ago' },
];

const statsRow = [
  { label: 'Reputation Score', value: '4.9', icon: Star, color: 'text-amber-400' },
  { label: 'XLM Earned', value: '128', icon: Zap, color: 'text-brand-400' },
  { label: 'Swaps Done', value: '24', icon: ArrowRight, color: 'text-emerald-400' },
];

const DashboardPage = ({ user }) => {
  const navigate = useNavigate();

  return (
    <div className="page-wrapper">
      <BgBlobs />

      <main className="relative z-10 pt-28 pb-20 px-6 max-w-6xl mx-auto">
        {/* Wallet badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-800 border border-brand-500/30 text-brand-400 text-sm font-mono mb-10"
        >
          <Wallet size={15} /> {user?.stellar_public_key ? `${user.stellar_public_key.slice(0, 6)}...${user.stellar_public_key.slice(-4)}` : 'GD3K...X7F2'}
          <span className="ml-2 w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{ fontFamily: 'Outfit, system-ui, sans-serif' }}
          className="text-4xl md:text-5xl font-extrabold text-white mb-2 tracking-tight"
        >
          Welcome back{user?.username ? `, ${user.username}` : ''} 👋
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-slate-400 text-lg mb-10"
        >
          Here's what's happening on the Skill Swap network today.
        </motion.p>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="grid grid-cols-3 gap-4 mb-10"
        >
          {statsRow.map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="glass-card p-5 text-center">
              <Icon size={20} className={`${color} mx-auto mb-2`} />
              <p style={{ fontFamily: 'Outfit, system-ui, sans-serif' }} className="text-3xl font-extrabold text-white">{value}</p>
              <p className="text-xs text-slate-500 mt-1">{label}</p>
            </div>
          ))}
        </motion.div>

        {/* Action cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {cards.map(({ icon: Icon, title, desc, to, color }, i) => (
            <Tilt key={title} tiltMaxAngleX={5} tiltMaxAngleY={5} scale={1.02} transitionSpeed={2000} gyroscope={false}>
              <motion.button
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 * i + 0.3 }}
                onClick={() => navigate(to)}
                className="glass-card-glow p-7 text-left group transition-all duration-300 w-full h-full"
              >
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <Icon size={22} className="text-white" />
                </div>
                <h2 style={{ fontFamily: 'Outfit, system-ui, sans-serif' }} className="text-xl font-bold text-white mb-2">{title}</h2>
                <p className="text-sm text-slate-400 leading-relaxed mb-5">{desc}</p>
                <span className="inline-flex items-center gap-1 text-brand-400 text-sm font-semibold group-hover:gap-2 transition-all">
                  Open <ArrowRight size={14} />
                </span>
              </motion.button>
            </Tilt>
          ))}
        </div>

        {/* Dashboard Metrics Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Chart Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="lg:col-span-2 glass-card p-6 flex flex-col"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 style={{ fontFamily: 'Outfit, system-ui, sans-serif' }} className="text-lg font-bold text-white flex items-center gap-2">
                  <TrendingUp size={18} className="text-brand-400" /> Network Volume (XLM)
                </h3>
                <p className="text-sm text-slate-500 mt-0.5">Live on-chain transaction volume this week</p>
              </div>
              <div className="px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-xs font-semibold border border-emerald-500/20">
                +24% this week
              </div>
            </div>

            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockChartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" vertical={false} />
                  <XAxis dataKey="name" stroke="#475569" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#475569" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#131625', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '10px', color: '#fff', fontSize: '13px' }}
                    itemStyle={{ color: '#818cf8' }}
                    cursor={{ stroke: 'rgba(99,102,241,0.3)', strokeWidth: 1 }}
                  />
                  <Area type="monotone" dataKey="volume" stroke="#6366f1" strokeWidth={2.5} fillOpacity={1} fill="url(#colorVolume)" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Live Activity Feed */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="glass-card p-6"
          >
            <h3 style={{ fontFamily: 'Outfit, system-ui, sans-serif' }} className="text-lg font-bold text-white flex items-center gap-2 mb-6">
              <Activity size={18} className="text-cyan-400" /> Live Activity
            </h3>

            <div className="space-y-5">
              {mockActivity.map((act) => (
                <div key={act.id} className="flex gap-3 items-start">
                  <div className="glow-dot" />
                  <div>
                    <p className="text-sm text-slate-300 leading-snug">
                      <span className="font-semibold text-white">{act.user}</span> {act.action} <span className="font-semibold text-brand-400">{act.target}</span>
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">{act.time}</p>
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full mt-6 py-2.5 rounded-xl bg-surface-900 border border-white/5 text-sm text-slate-400 hover:text-white hover:border-brand-500/30 transition-all duration-200">
              View All Transactions →
            </button>
          </motion.div>

        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
