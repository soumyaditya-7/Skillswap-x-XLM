import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Wallet, Loader2, AlertCircle } from 'lucide-react';
import { authAPI, setToken } from '../services/api';

const AuthModal = ({ onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');
  const [wallet,  setWallet]  = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!wallet.trim()) {
      setError('Please enter a wallet address');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Send wallet address to backend (creates user if new)
      const data = await authAPI.connectWallet(wallet);

      setToken(data.token);
      onSuccess(data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const simulateFreighter = () => {
    // Mocking a standard Stellar address
    setWallet('GBCV4...' + Math.random().toString(36).substring(2, 8).toUpperCase());
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
          className="relative w-full max-w-sm glass-card p-8"
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
            <div className="mx-auto w-12 h-12 bg-brand-600/20 text-brand-400 rounded-full flex items-center justify-center mb-4">
              <Wallet size={24} />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Connect Wallet
            </h2>
            <p className="text-slate-400 text-sm">
              Link your Stellar wallet to access Skill Swap.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Enter Stellar address (G...)"
                value={wallet}
                onChange={(e) => { setError(''); setWallet(e.target.value); }}
                className="w-full bg-surface-800 border border-white/10 rounded-xl px-4 py-3
                           text-sm text-white placeholder-slate-500 font-mono
                           focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/40
                           transition-all duration-200"
              />
            </div>

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
                ? <><Loader2 size={16} className="animate-spin" /> Connecting…</>
                : 'Connect'
              }
            </button>
            
            {/* Mock Freighter Helper */}
            <div className="mt-4 pt-4 border-t border-white/5 text-center">
              <button 
                type="button" 
                onClick={simulateFreighter}
                className="text-xs text-brand-400 hover:text-brand-300 font-medium transition-colors"
              >
                Simulate Freighter Extension
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AuthModal;
