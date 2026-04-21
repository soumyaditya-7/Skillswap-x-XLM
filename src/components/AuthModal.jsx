import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, Wallet, Loader2, AlertCircle } from 'lucide-react';
import { authAPI, setToken } from '../services/api';

const InputField = ({ icon: Icon, ...props }) => (
  <div className="relative">
    <Icon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
    <input
      {...props}
      className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3
                 text-sm text-white placeholder-slate-500
                 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/40
                 transition-all duration-200"
    />
  </div>
);

const AuthModal = ({ onClose, onSuccess }) => {
  const [mode,    setMode]    = useState('login'); // 'login' | 'register'
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');
  const [form,    setForm]    = useState({
    username: '', email: '', password: '', wallet_address: '',
  });

  const set = (key) => (e) => {
    setError('');
    setForm(f => ({ ...f, [key]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = mode === 'login'
        ? { email: form.email, password: form.password }
        : { username: form.username, email: form.email, password: form.password, wallet_address: form.wallet_address };

      const data = await (mode === 'login' ? authAPI.login(payload) : authAPI.register(payload));

      setToken(data.token);
      onSuccess(data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
      >
        {/* Modal panel */}
        <motion.div
          key="modal"
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative w-full max-w-md glass-card p-8"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>

          {/* Logo / Title */}
          <div className="text-center mb-8">
            <p className="text-xs text-brand-400 font-semibold tracking-widest uppercase mb-1">
              Skill Swap
            </p>
            <h2 className="text-2xl font-bold text-white">
              {mode === 'login' ? 'Welcome back' : 'Create account'}
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              {mode === 'login'
                ? 'Sign in to access your profile'
                : 'Join the decentralized skill economy'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <InputField
                icon={User}
                type="text"
                placeholder="Username"
                value={form.username}
                onChange={set('username')}
                required
              />
            )}

            <InputField
              icon={Mail}
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={set('email')}
              required
            />

            <InputField
              icon={Lock}
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={set('password')}
              required
            />

            {mode === 'register' && (
              <InputField
                icon={Wallet}
                type="text"
                placeholder="Stellar wallet address (optional)"
                value={form.wallet_address}
                onChange={set('wallet_address')}
              />
            )}

            {/* Error message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 bg-red-500/10 border border-red-500/20
                           rounded-xl px-4 py-3 text-sm text-red-400"
              >
                <AlertCircle size={16} />
                {error}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center py-3 text-sm font-semibold mt-2
                         disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading
                ? <><Loader2 size={16} className="animate-spin" /> {mode === 'login' ? 'Signing in…' : 'Creating account…'}</>
                : mode === 'login' ? 'Sign In' : 'Create Account'
              }
            </button>
          </form>

          {/* Mode toggle */}
          <p className="text-center text-sm text-slate-400 mt-6">
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={() => { setMode(m => m === 'login' ? 'register' : 'login'); setError(''); }}
              className="text-brand-400 hover:text-brand-300 font-medium transition-colors"
            >
              {mode === 'login' ? 'Register' : 'Sign in'}
            </button>
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AuthModal;
