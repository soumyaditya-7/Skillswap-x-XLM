import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Award, Zap, BookOpen, Users, Edit3, ExternalLink } from 'lucide-react';
import BgBlobs from '../components/BgBlobs';

const skillsOffered = ['React', 'Node.js', 'TypeScript'];
const skillsWanted  = ['Solidity', 'UI/UX Design', 'Data Science'];

const activity = [
  { icon: Zap,      text: 'Swapped React with Alex R.',           time: '2h ago',   color: 'text-brand-400' },
  { icon: Users,    text: 'Joined team "DeFi Dashboard"',          time: '3d ago',   color: 'text-indigo-400' },
  { icon: Star,     text: 'Received 5★ from Priya M.',             time: '5d ago',   color: 'text-amber-400' },
];

const stats = [
  { label: 'Swaps Done',       value: '12'   },
  { label: 'Sessions Booked',  value: '5'    },
  { label: 'Teams Joined',     value: '2'    },
  { label: 'Reputation Score', value: '94'   },
];

const ProfilePage = ({ wallet }) => {
  const [bookedSessions, setBookedSessions] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('bookedSessions') || '[]');
    setBookedSessions(saved);
  }, []);
  return (
    <div className="page-wrapper">
      <BgBlobs />
      <main className="relative z-10 pt-28 pb-20 px-6 max-w-4xl mx-auto">

        {/* Profile card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-8 mb-8 flex flex-col sm:flex-row items-center sm:items-start gap-6"
        >
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-brand-600 to-accent flex items-center justify-center text-white text-3xl font-bold animate-glow">
              Y
            </div>
            <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-400 rounded-full border-2 border-surface-800" />
          </div>

          {/* Info */}
          <div className="flex-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-3 mb-1">
              <h1 className="text-2xl font-bold text-white">You</h1>
              <span className="flex items-center gap-1 text-xs bg-amber-400/10 text-amber-400 border border-amber-400/20 px-2.5 py-0.5 rounded-full font-medium">
                <Award size={11} /> Top Swapper
              </span>
            </div>
            <p className="text-slate-400 text-sm mb-2 font-mono">{wallet || 'GD3K...X7F2'}</p>
            <div className="flex items-center justify-center sm:justify-start gap-1 mb-4">
              {[1,2,3,4,5].map(s => <Star key={s} size={14} className="text-amber-400 fill-amber-400" />)}
              <span className="text-xs text-slate-400 ml-1">4.9 · 17 reviews</span>
            </div>
            <button className="btn-outline text-xs px-4 py-2">
              <Edit3 size={13} /> Edit Profile
            </button>
          </div>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8"
        >
          {stats.map(({ label, value }) => (
            <div key={label} className="glass-card p-5 text-center">
              <p className="text-3xl font-extrabold bg-gradient-to-r from-brand-400 to-accent bg-clip-text text-transparent">{value}</p>
              <p className="text-xs text-slate-400 mt-1">{label}</p>
            </div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Skills Offered */}
          <motion.div initial={{ opacity:0, x:-15 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.15 }} className="glass-card p-6">
            <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
              <Zap size={16} className="text-brand-400" /> Skills I Offer
            </h2>
            <div className="flex flex-wrap gap-2">
              {skillsOffered.map(s => <span key={s} className="tag">{s}</span>)}
              <button className="tag border-dashed opacity-60 hover:opacity-100 transition-opacity">+ Add</button>
            </div>
          </motion.div>

          {/* Skills Wanted */}
          <motion.div initial={{ opacity:0, x:15 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.15 }} className="glass-card p-6">
            <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
              <Star size={16} className="text-violet-400" /> Skills I Want
            </h2>
            <div className="flex flex-wrap gap-2">
              {skillsWanted.map(s => (
                <span key={s} className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-violet-600/20 text-violet-400 border border-violet-500/30">
                  {s}
                </span>
              ))}
              <button className="tag border-dashed opacity-60 hover:opacity-100 transition-opacity">+ Add</button>
            </div>
          </motion.div>
        </div>

        {/* My Purchased Sessions */}
        {bookedSessions.length > 0 && (
          <motion.div initial={{ opacity:0, y:15 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2 }} className="glass-card p-6 mb-8">
            <h2 className="font-semibold text-white mb-5 flex items-center gap-2">
              <BookOpen size={16} className="text-violet-400" /> My Booked Sessions
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {bookedSessions.map((session, i) => (
                <div key={i} className="bg-surface-800/50 border border-white/5 rounded-xl p-4 flex flex-col">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${session.color} flex items-center justify-center text-white font-bold text-sm shadow-md`}>
                      {session.avatar}
                    </div>
                    <div>
                      <p className="font-bold text-white text-sm">{session.name}</p>
                      <p className="text-xs text-brand-400 font-medium">{session.price} XLM Paid</p>
                    </div>
                  </div>
                  <div className="mt-auto pt-3 border-t border-white/5 flex items-center justify-between">
                    <span className="text-[10px] text-slate-500 font-mono">
                      Tx: {session.txHash?.slice(0, 10)}...
                    </span>
                    <button className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors">
                      Join Call
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Recent Activity */}
        <motion.div initial={{ opacity:0, y:15 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2 }} className="glass-card p-6">
          <h2 className="font-semibold text-white mb-5">Recent Activity</h2>
          <div className="space-y-4">
            {activity.map(({ icon: Icon, text, time, color }, i) => (
              <motion.div
                key={i}
                initial={{ opacity:0, x:-10 }}
                animate={{ opacity:1, x:0 }}
                transition={{ delay: 0.25 + i * 0.07 }}
                className="flex items-center gap-4"
              >
                <div className={`w-8 h-8 rounded-xl bg-surface-700 flex items-center justify-center flex-shrink-0 ${color}`}>
                  <Icon size={14} />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-slate-300">{text}</p>
                </div>
                <span className="text-xs text-slate-500 flex-shrink-0">{time}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

      </main>
    </div>
  );
};

export default ProfilePage;
