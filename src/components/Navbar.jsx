import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, Menu, X, Wallet, LogOut, User } from 'lucide-react';

const navLinks = [
  { label: 'Exchange', to: '/exchange' },
  { label: 'Learn',    to: '/learn'    },
  { label: 'Teams',    to: '/teams'    },
  { label: 'Profile',  to: '/profile'  },
];

// Truncate a long wallet address for display
const shortAddr = (addr) =>
  addr && addr.length > 12 ? `${addr.slice(0, 6)}…${addr.slice(-4)}` : addr;

const Navbar = ({ user, onConnectClick, onLogout }) => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate  = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/');
    setOpen(false);
  };

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0,   opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-6 md:px-12 h-16
                 bg-surface-900/80 backdrop-blur-lg border-b border-white/5"
    >
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2 group">
        <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-brand-600 group-hover:bg-brand-500 transition-colors">
          <Zap size={16} className="text-white" />
        </span>
        <span className="font-bold text-white text-lg tracking-tight">
          Skill<span className="text-brand-400">Swap</span>
        </span>
      </Link>

      {/* Desktop nav links */}
      <div className="hidden md:flex items-center gap-1">
        {navLinks.map(({ label, to }) => (
          <Link
            key={to}
            to={to}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200
              ${location.pathname === to
                ? 'bg-brand-600/20 text-brand-400'
                : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
          >
            {label}
          </Link>
        ))}
      </div>

      {/* Desktop auth area */}
      <div className="hidden md:flex items-center gap-3">
        {user ? (
          <div className="flex items-center gap-3">
            {/* Username badge */}
            <Link
              to="/profile"
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl
                         bg-surface-700 border border-brand-500/30
                         text-brand-400 text-sm font-medium hover:border-brand-400/50 transition-colors"
            >
              <User size={14} />
              {user.username}
            </Link>

            {/* Wallet address (if set) */}
            {user.wallet_address && (
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl
                               bg-surface-800 border border-white/10
                               text-slate-400 text-xs font-mono">
                <Wallet size={12} />
                {shortAddr(user.wallet_address)}
              </span>
            )}

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="btn-outline text-xs px-4 py-2 flex items-center gap-1.5"
            >
              <LogOut size={13} /> Sign out
            </button>
          </div>
        ) : (
          <button onClick={onConnectClick} className="btn-primary">
            <Wallet size={15} /> Connect Wallet
          </button>
        )}
      </div>

      {/* Mobile hamburger */}
      <button className="md:hidden text-slate-400 hover:text-white" onClick={() => setOpen(!open)}>
        {open ? <X size={22} /> : <Menu size={22} />}
      </button>

      {/* Mobile dropdown */}
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-16 inset-x-0 bg-surface-800/95 backdrop-blur-lg
                     border-b border-white/5 flex flex-col gap-1 p-4 md:hidden"
        >
          {navLinks.map(({ label, to }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              className="px-4 py-2.5 rounded-lg text-sm font-medium text-slate-300
                         hover:text-white hover:bg-white/5 transition-colors"
            >
              {label}
            </Link>
          ))}
          <div className="pt-2 border-t border-white/5">
            {user
              ? <button onClick={handleLogout} className="btn-outline w-full justify-center text-xs flex items-center gap-2">
                  <LogOut size={13} /> Sign out ({user.username})
                </button>
              : <button onClick={() => { onConnectClick(); setOpen(false); }}
                        className="btn-primary w-full justify-center">
                  <Wallet size={15} /> Connect Wallet
                </button>
            }
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;
