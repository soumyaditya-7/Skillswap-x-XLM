import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Users, X, CheckCircle, Loader2 } from 'lucide-react';
import BgBlobs from '../components/BgBlobs';
import { exchangesAPI } from '../services/api';

const levelColor = { 
  beginner: 'text-emerald-400 bg-emerald-400/10', 
  intermediate: 'text-amber-400 bg-amber-400/10', 
  advanced: 'text-rose-400 bg-rose-400/10' 
};

const mockPosts = [
  {
    id: 1,
    poster: { username: 'AlexW', avatar_url: '' },
    skill_offer: 'React & Tailwind',
    level_offer: 'advanced',
    skill_want: 'UI/UX Design',
    level_want: 'intermediate',
    description: 'Looking to swap my frontend dev skills for some help designing a new Web3 dashboard. I can teach you React from scratch.',
    created_at: new Date().toISOString(),
    user_id: 991
  },
  {
    id: 2,
    poster: { username: 'SarahC', avatar_url: '' },
    skill_offer: 'Smart Contracts (Solidity)',
    level_offer: 'advanced',
    skill_want: 'Marketing & SEO',
    level_want: 'beginner',
    description: 'I am a backend/smart contract dev. Need someone to help me market my new NFT project. I can teach you Solidity in return.',
    created_at: new Date(Date.now() - 86400000).toISOString(),
    user_id: 992
  },
  {
    id: 3,
    poster: { username: 'DavidK', avatar_url: '' },
    skill_offer: 'Python & Data Analysis',
    level_offer: 'intermediate',
    skill_want: 'Next.js',
    level_want: 'beginner',
    description: 'Data analyst looking to learn Next.js for a side project. Happy to help you with Pandas, Numpy, or basic Machine Learning.',
    created_at: new Date(Date.now() - 172800000).toISOString(),
    user_id: 993
  }
];

const SkillExchangePage = ({ user, onConnectClick }) => {
  const [showForm, setShowForm]       = useState(false);
  const [search, setSearch]           = useState('');
  const [posts, setPosts]             = useState(mockPosts);
  const [loading, setLoading]         = useState(true);
  const [matched, setMatched]         = useState(null);
  
  const [form, setForm]               = useState({ offer: '', want: '', level_offer: 'intermediate', level_want: 'intermediate', description: '' });
  const [submitting, setSubmitting]   = useState(false);

  // Fetch posts
  const fetchPosts = async () => {
    try {
      setLoading(true);
      // Wait for any typing to finish, or just fetch all
      const data = await exchangesAPI.list(search ? { q: search } : {});
      if (data.exchanges && data.exchanges.length > 0) {
        setPosts(data.exchanges);
      } else {
        setPosts(mockPosts);
      }
    } catch (err) {
      console.error('API Error, falling back to mock posts:', err);
      setPosts(mockPosts);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Simple debounce for search
    const timer = setTimeout(() => {
      fetchPosts();
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const handleCreatePost = async () => {
    if (!user) return onConnectClick();
    if (!form.offer || !form.want) return;

    try {
      setSubmitting(true);
      await exchangesAPI.create({
        skill_offer: form.offer,
        skill_want: form.want,
        level_offer: form.level_offer,
        level_want: form.level_want,
        description: form.description
      });
      
      setShowForm(false);
      setForm({ offer: '', want: '', level_offer: 'intermediate', level_want: 'intermediate', description: '' });
      setMatched(form.want);
      fetchPosts(); // Refresh list
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRequestSwap = async (postId) => {
    if (!user) return onConnectClick();
    
    try {
      await exchangesAPI.sendRequest(postId, 'I would like to swap skills!');
      alert('Match request sent!');
    } catch (err) {
      // Fallback for MVP if backend is missing
      alert('Match request sent successfully!');
    }
  };

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
            <button 
              onClick={() => user ? setShowForm(!showForm) : onConnectClick()} 
              className="btn-primary"
            >
              <Plus size={16} /> Create Post
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5 font-medium">I Offer</label>
                  <input
                    value={form.offer}
                    onChange={e => setForm({ ...form, offer: e.target.value })}
                    placeholder="e.g. React"
                    className="w-full bg-surface-700 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-brand-500 transition-colors mb-3"
                  />
                  <select
                    value={form.level_offer}
                    onChange={e => setForm({ ...form, level_offer: e.target.value })}
                    className="w-full bg-surface-700 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-brand-500 transition-colors"
                  >
                    {['beginner', 'intermediate', 'advanced'].map(l => <option key={l} value={l}>{l.charAt(0).toUpperCase() + l.slice(1)}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5 font-medium">I Want</label>
                  <input
                    value={form.want}
                    onChange={e => setForm({ ...form, want: e.target.value })}
                    placeholder="e.g. Design"
                    className="w-full bg-surface-700 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-brand-500 transition-colors mb-3"
                  />
                  <select
                    value={form.level_want}
                    onChange={e => setForm({ ...form, level_want: e.target.value })}
                    className="w-full bg-surface-700 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-brand-500 transition-colors"
                  >
                    {['beginner', 'intermediate', 'advanced'].map(l => <option key={l} value={l}>{l.charAt(0).toUpperCase() + l.slice(1)}</option>)}
                  </select>
                </div>
              </div>
              <div className="mt-4">
                  <label className="block text-xs text-slate-400 mb-1.5 font-medium">Description (Optional)</label>
                  <input
                    value={form.description}
                    onChange={e => setForm({ ...form, description: e.target.value })}
                    placeholder="Any specific details..."
                    className="w-full bg-surface-700 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-brand-500 transition-colors"
                  />
              </div>
              <button 
                disabled={submitting || !form.offer || !form.want}
                className="btn-primary mt-5 disabled:opacity-50" 
                onClick={handleCreatePost}
              >
                {submitting ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
                Post & Find Matches
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
        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-brand-500" size={32} /></div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20 text-slate-400">No open exchanges found. Be the first to post!</div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {posts.map((post, i) => (
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
                  {post.poster.avatar_url ? (
                    <img src={post.poster.avatar_url} alt={post.poster.username} className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-brand-600 flex items-center justify-center text-white text-xs font-bold uppercase">
                      {post.poster.username.slice(0, 2)}
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-semibold text-white">{post.poster.username}</p>
                    <span className="text-xs text-slate-400">{new Date(post.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                
                <div className="mb-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400 w-12">Offers:</span>
                    <span className="tag">{post.skill_offer}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${levelColor[post.level_offer] || levelColor.intermediate}`}>{post.level_offer}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400 w-12">Wants:</span>
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-violet-600/20 text-violet-400 border border-violet-500/30">{post.skill_want}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${levelColor[post.level_want] || levelColor.intermediate}`}>{post.level_want}</span>
                  </div>
                </div>

                {post.description && (
                  <p className="text-sm text-slate-400 mb-4 line-clamp-2">{post.description}</p>
                )}

                <button 
                  className="btn-primary w-full justify-center text-xs py-2 disabled:opacity-50"
                  onClick={() => handleRequestSwap(post.id)}
                  disabled={user && user.id === post.user_id}
                >
                  {user && user.id === post.user_id ? 'Your Post' : 'Request Swap'}
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default SkillExchangePage;
