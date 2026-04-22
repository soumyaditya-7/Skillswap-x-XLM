import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Plus, Wallet, CheckCircle, X, Lock } from 'lucide-react';
import BgBlobs from '../components/BgBlobs';

const openTeams = [
  { id: 1, name: 'DeFi Dashboard',    skills: ['React', 'Solidity', 'UI/UX'], stake: 10,  members: 2, max: 4 },
  { id: 2, name: 'NFT Marketplace',   skills: ['Next.js', 'IPFS', 'Rust'],    stake: 15,  members: 1, max: 3 },
  { id: 3, name: 'AI Learning Bot',   skills: ['Python', 'ML', 'Node.js'],    stake: 8,   members: 3, max: 5 },
  { id: 4, name: 'Web3 Freelance Hub',skills: ['Design', 'Marketing', 'PM'],  stake: 5,   members: 2, max: 4 },
];

const TeamFormationPage = () => {
  const [tab, setTab]           = useState('browse'); // 'browse' | 'create' | 'invite'
  const [joinedTeams, setJoinedTeams] = useState([]);
  const [recentJoin, setRecentJoin]   = useState(null);
  const [inviteSent, setInviteSent] = useState(false);
  const [walletInput, setWalletInput] = useState('');
  const [form, setForm]         = useState({ name: '', skills: '', stake: '' });
  const [created, setCreated]   = useState(false);

  return (
    <div className="page-wrapper">
      <BgBlobs />
      <main className="relative z-10 pt-28 pb-20 px-6 max-w-5xl mx-auto">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="section-title">Team Formation</h1>
          <p className="section-subtitle">Build teams with stake-based commitment. No flakers.</p>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 bg-surface-800 rounded-xl p-1.5 w-fit">
          {[['browse','Browse Open Teams'],['create','Create Team'],['invite','Invite by Wallet']].map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200
                ${tab === key ? 'bg-brand-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Notifications */}
        <AnimatePresence>
          {recentJoin && (
            <motion.div initial={{ opacity:0,y:-8 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0 }}
              className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-5 py-3 mb-6 text-emerald-400 text-sm font-medium">
              <CheckCircle size={15}/> Joined <strong>{recentJoin}</strong> · {openTeams.find(t=>t.name===recentJoin)?.stake} XLM staked!
              <button onClick={()=>setRecentJoin(null)} className="ml-auto"><X size={13}/></button>
            </motion.div>
          )}
          {inviteSent && (
            <motion.div initial={{ opacity:0,y:-8 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0 }}
              className="flex items-center gap-2 bg-brand-600/10 border border-brand-500/30 rounded-xl px-5 py-3 mb-6 text-brand-400 text-sm font-medium">
              <CheckCircle size={15}/> Invite sent to <strong>{walletInput || 'wallet address'}</strong>!
              <button onClick={()=>setInviteSent(false)} className="ml-auto"><X size={13}/></button>
            </motion.div>
          )}
          {created && (
            <motion.div initial={{ opacity:0,y:-8 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0 }}
              className="flex items-center gap-2 bg-violet-500/10 border border-violet-500/30 rounded-xl px-5 py-3 mb-6 text-violet-400 text-sm font-medium">
              <CheckCircle size={15}/> Team <strong>"{form.name}"</strong> created! Waiting for members…
              <button onClick={()=>setCreated(false)} className="ml-auto"><X size={13}/></button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* BROWSE TAB */}
        {tab === 'browse' && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {openTeams.map((team,i) => (
              <motion.div key={team.id} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:i*0.08}}
                whileHover={{y:-4,boxShadow:'0 0 30px #6366f118'}} className="glass-card p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-white">{team.name}</h3>
                  <span className="flex items-center gap-1 text-xs text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-full font-medium">
                    <Lock size={10}/> {team.stake} XLM stake
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {team.skills.map(s=><span key={s} className="tag">{s}</span>)}
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-xs text-slate-400">
                    <Users size={12}/> {team.members + (joinedTeams.includes(team.name) ? 1 : 0)}/{team.max} members
                  </span>
                  {joinedTeams.includes(team.name) ? (
                    <button disabled className="btn-outline text-xs px-4 py-2 border-emerald-500/30 text-emerald-400 cursor-default opacity-100 flex items-center gap-1.5 bg-emerald-500/5">
                      <CheckCircle size={13}/> Joined
                    </button>
                  ) : (
                    <button onClick={() => {
                      if (!joinedTeams.includes(team.name)) {
                        setJoinedTeams([...joinedTeams, team.name]);
                        setRecentJoin(team.name);
                      }
                    }} className="btn-primary text-xs px-4 py-2">
                      Join & Stake
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* CREATE TAB */}
        {tab === 'create' && (
          <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} className="glass-card p-7 max-w-lg">
            <h2 className="font-bold text-white mb-5 flex items-center gap-2"><Plus size={18}/> Create a New Team</h2>
            {[['Team Name','name','e.g. DeFi Dashboard'],['Skills Needed','skills','e.g. React, Solidity, UI/UX'],['Stake Amount (XLM)','stake','e.g. 10']].map(([label,key,ph])=>(
              <div key={key} className="mb-4">
                <label className="block text-xs text-slate-400 mb-1.5 font-medium">{label}</label>
                <input value={form[key]} onChange={e=>setForm({...form,[key]:e.target.value})} placeholder={ph}
                  className="w-full bg-surface-700 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-brand-500 transition-colors"/>
              </div>
            ))}
            <button onClick={()=>{if(form.name){setCreated(true);setTab('browse');}}} className="btn-primary w-full justify-center mt-2">
              <CheckCircle size={16}/> Create Team
            </button>
          </motion.div>
        )}

        {/* INVITE TAB */}
        {tab === 'invite' && (
          <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} className="glass-card p-7 max-w-lg">
            <h2 className="font-bold text-white mb-2 flex items-center gap-2"><Wallet size={18}/> Invite by Wallet Address</h2>
            <p className="text-sm text-slate-400 mb-6">Send a team invite directly to any wallet address.</p>
            <label className="block text-xs text-slate-400 mb-1.5 font-medium">Wallet Address</label>
            <input
              value={walletInput}
              onChange={e=>setWalletInput(e.target.value)}
              placeholder="e.g. GD3K7ZQ...X7F2"
              className="w-full bg-surface-700 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white font-mono placeholder-slate-500 outline-none focus:border-brand-500 transition-colors mb-4"
            />
            <label className="block text-xs text-slate-400 mb-1.5 font-medium">Team</label>
            <select className="w-full bg-surface-700 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-brand-500 transition-colors mb-5">
              {openTeams.map(t=><option key={t.id}>{t.name}</option>)}
            </select>
            <button
              onClick={()=>{ if(walletInput){ setInviteSent(true); setWalletInput(''); setTab('browse'); } }}
              className="btn-primary w-full justify-center"
            >
              <CheckCircle size={16}/> Send Invite
            </button>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default TeamFormationPage;
