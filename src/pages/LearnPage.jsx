import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Clock, BookOpen, CheckCircle } from 'lucide-react';
import BgBlobs from '../components/BgBlobs';

const professionals = [
  { id: 1, name: 'Sarah Chen',    skill: 'Blockchain Dev',   price: 50,  rating: 4.9, sessions: 120, avatar: 'SC', tags: ['Solidity', 'Web3', 'DeFi'] },
  { id: 2, name: 'Marcus Lee',    skill: 'UI/UX Design',     price: 35,  rating: 4.8, sessions: 98,  avatar: 'ML', tags: ['Figma', 'Prototyping', 'Research'] },
  { id: 3, name: 'Ananya Roy',    skill: 'Data Science',     price: 45,  rating: 5.0, sessions: 210, avatar: 'AR', tags: ['Python', 'ML', 'Pandas'] },
  { id: 4, name: 'Tom Nguyen',    skill: 'React / Node.js',  price: 40,  rating: 4.7, sessions: 154, avatar: 'TN', tags: ['React', 'APIs', 'TypeScript'] },
  { id: 5, name: 'Lena Müller',   skill: 'Marketing Growth', price: 30,  rating: 4.6, sessions: 67,  avatar: 'LM', tags: ['SEO', 'Content', 'Analytics'] },
  { id: 6, name: 'Ravi Patel',    skill: 'Smart Contracts',  price: 60,  rating: 4.9, sessions: 88,  avatar: 'RP', tags: ['Rust', 'Stellar', 'XLM'] },
];

const avatarColors = ['bg-brand-600', 'bg-violet-600', 'bg-rose-600', 'bg-amber-600', 'bg-emerald-600', 'bg-cyan-600'];

const LearnPage = () => {
  const [booked, setBooked] = useState(null);

  return (
    <div className="page-wrapper">
      <BgBlobs />
      <main className="relative z-10 pt-28 pb-20 px-6 max-w-5xl mx-auto">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <h1 className="section-title">Learn from Professionals</h1>
          <p className="section-subtitle">Book 1:1 sessions. Pay with XLM or mock credits.</p>
        </motion.div>

        {/* Booking confirmation */}
        {booked && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-5 py-3.5 mb-8 text-emerald-400 text-sm font-medium"
          >
            <CheckCircle size={16} />
            Session with <strong>{booked}</strong> booked! Check your profile for details.
            <button onClick={() => setBooked(null)} className="ml-auto text-emerald-400/60 hover:text-emerald-400 text-lg leading-none">×</button>
          </motion.div>
        )}

        {/* Professional cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {professionals.map((pro, i) => (
            <motion.div
              key={pro.id}
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -5, boxShadow: '0 0 35px #6366f125' }}
              className="glass-card p-6 flex flex-col"
            >
              {/* Avatar + info */}
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-12 h-12 rounded-2xl ${avatarColors[i % avatarColors.length]} flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}>
                  {pro.avatar}
                </div>
                <div>
                  <p className="font-semibold text-white text-sm">{pro.name}</p>
                  <p className="text-xs text-slate-400">{pro.skill}</p>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-4 mb-4 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <Star size={12} className="text-amber-400 fill-amber-400" /> {pro.rating}
                </span>
                <span className="flex items-center gap-1">
                  <BookOpen size={12} /> {pro.sessions} sessions
                </span>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mb-5">
                {pro.tags.map(t => <span key={t} className="tag text-[11px]">{t}</span>)}
              </div>

              {/* Price + CTA */}
              <div className="mt-auto flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-white">{pro.price} <span className="text-sm font-normal text-brand-400">XLM</span></p>
                  <p className="text-xs text-slate-500 flex items-center gap-1"><Clock size={10} /> per hour</p>
                </div>
                <button
                  onClick={() => setBooked(pro.name)}
                  className="btn-primary text-xs px-4 py-2"
                >
                  Book Session
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default LearnPage;
