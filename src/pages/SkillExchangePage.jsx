import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Users, X, CheckCircle } from 'lucide-react';
import BgBlobs from '../components/BgBlobs';

const mockPosts = [
  { id: 1, user: 'Alex R.',    offer: 'React',      want: 'UI Design',   level: 'Intermediate', avatar: 'AR' },
  { id: 2, user: 'Priya M.',   offer: 'Python',     want: 'Blockchain',  level: 'Beginner',     avatar: 'PM' },
  { id: 3, user: 'James K.',   offer: 'Figma',      want: 'Node.js',     level: 'Advanced',     avatar: 'JK' },
  { id: 4, user: 'Sara L.',    offer: 'Marketing',  want: 'Data Science',level: 'Intermediate', avatar: 'SL' },
  { id: 5, user: 'Dev P.',     offer: 'Solidity',   want: 'React',       level: 'Advanced',     avatar: 'DP' },
  { id: 6, user: 'Nina T.',    offer: 'Data Science',want: 'Marketing',  level: 'Beginner',     avatar: 'NT' },
];

const levelColor = { Beginner: 'text-emerald-400 bg-emerald-400/10', Intermediate: 'text-amber-400 bg-amber-400/10', Advanced: 'text-rose-400 bg-rose-400/10' };

const SkillExchangePage = () => {
  const [showForm, setShowForm]       = useState(false);
  const [search, setSearch]           = useState('');
  const [matched, setMatched]         = useState(null);
  const [form, setForm]               = useState({ offer: '', want: '', level: 'Beginner' });

  const filtered = mockPosts.filter(p =>
    p.offer.toLowerCase().includes(search.toLowerCase()) ||
    p.want.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-wrapper">
      <BgBlobs />
      <main className="relative z-10 pt-28 pb-20 px-6 max-w-5xl mx-auto">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="section-title">Skill Exchange</h1>
            <p className="section-subtitle">Find a match — swap skills, grow together.</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setShowForm(!showForm)} className="btn-primary">
              <Plus size={16} /> Create Post
            </button>
            <button className="btn-outline">
              <Users size={16} /> Create Team
            </button>
          </div>
        </motion.div>

        {/* Create Post Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="glass-card p-6 mb-8 overflow-hidden"
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-semibold text-white">New Skill Post</h2>
                <button onClick={() => setShowForm(false)} className="text-slate-500 hover:text-white"><X size={18} /></button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[['I Offer', 'offer', 'e.g. React'], ['I Want', 'want', 'e.g. Design']].map(([label, key, ph]) => (
                  <div key={key}>
                    <label className="block text-xs text-slate-400 mb-1.5 font-medium">{label}</label>
                    <input
                      value={form[key]}
                      onChange={e => setForm({ ...form, [key]: e.target.value })}
                      placeholder={ph}
                      className="w-full bg-surface-700 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-brand-500 transition-colors"
                    />
                  </div>
                ))}
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5 font-medium">Level</label>
                  <select
                    value={form.level}
                    onChange={e => setForm({ ...form, level: e.target.value })}
                    className="w-full bg-surface-700 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-brand-500 transition-colors"
                  >
                    {['Beginner', 'Intermediate', 'Advanced'].map(l => <option key={l}>{l}</option>)}
                  </select>
                </div>
              </div>
              <button className="btn-primary mt-5" onClick={() => { setShowForm(false); setMatched(form.want); }}>
                <CheckCircle size={16} /> Post & Find Matches
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Match notification */}
        <AnimatePresence>
          {matched && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-5 py-3.5 mb-6 text-emerald-400 text-sm font-medium">
              <CheckCircle size={16} /> Match found for <strong>"{matched}"</strong>!
              <button onClick={() => setMatched(null)} className="ml-auto text-emerald-400/60 hover:text-emerald-400"><X size={14} /></button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search */}
        <div className="relative mb-8">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by skill…"
            className="w-full bg-surface-800 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:border-brand-500 transition-colors"
          />
        </div>

        {/* Cards grid */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {filtered.map((post, i) => (
            <motion.div
              key={post.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              whileHover={{ y: -4, boxShadow: '0 0 30px #6366f120' }}
              className="glass-card p-5"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-brand-600 flex items-center justify-center text-white text-xs font-bold">
                  {post.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{post.user}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${levelColor[post.level]}`}>{post.level}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 mb-4">
                <span className="tag">Offers: {post.offer}</span>
                <span className="text-slate-600">→</span>
                <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-violet-600/20 text-violet-400 border border-violet-500/30">Wants: {post.want}</span>
              </div>
              <button className="btn-primary w-full justify-center text-xs py-2">Request Swap</button>
            </motion.div>
          ))}
        </motion.div>
      </main>
    </div>
  );
};

export default SkillExchangePage;
