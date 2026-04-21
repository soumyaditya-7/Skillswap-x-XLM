import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Wallet, Loader2, AlertCircle } from 'lucide-react';
import { isConnected, requestAccess } from '@stellar/freighter-api';
import { authAPI, setToken } from '../services/api';

const AuthModal = ({ onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');
  const [hasFreighter, setHasFreighter] = useState(true);

  useEffect(() => {
    // Check if Freighter is installed when modal opens
    const checkFreighter = async () => {
      const connected = await isConnected();
      setHasFreighter(connected);
    };
    checkFreighter();
  }, []);

  const handleFreighterConnect = async () => {
    setError('');
    
    if (!hasFreighter) {
      setError('Freighter extension not detected. Please install Freighter to connect.');
      return;
    }

    setLoading(true);

    try {
      // 1. Request access from Freighter Extension
      const accessResponse = await requestAccess();
      
      if (accessResponse.error) {
        throw new Error(accessResponse.error);
      }

      // Extract the wallet address
      const publicKey = accessResponse.address || accessResponse; // Depending on API version
      
      if (!publicKey || typeof publicKey !== 'string') {
        throw new Error('Failed to retrieve public key from Freighter');
      }

      // 2. Authenticate with backend using the public key
      const data = await authAPI.connectWallet(publicKey);

      // 3. Store token and update app state
      setToken(data.token);
      onSuccess(data.user);
      
    } catch (err) {
      console.error(err);
      setError(err.message || 'Connection rejected or failed.');
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
          className="relative w-full max-w-sm glass-card p-8 text-center"
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
          <div className="mb-8 mt-2">
            <div className="mx-auto w-16 h-16 bg-brand-600/20 text-brand-400 rounded-full flex items-center justify-center mb-5">
              <Wallet size={32} />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Web3 Authentication
            </h2>
            <p className="text-slate-400 text-sm">
              Connect your Freighter wallet to securely log into Skill Swap.
            </p>
          </div>

          {/* Error message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 bg-red-500/10 border border-red-500/20
                         rounded-xl px-4 py-3 text-sm text-red-400 mb-4 text-left"
            >
              <AlertCircle size={16} className="shrink-0" />
              <span className="leading-snug">{error}</span>
            </motion.div>
          )}

          {/* Connect Button */}
          <button
            onClick={handleFreighterConnect}
            disabled={loading}
            className="btn-primary w-full justify-center py-4 text-base font-semibold
                       disabled:opacity-60 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(99,102,241,0.3)]"
          >
            {loading ? (
              <><Loader2 size={18} className="animate-spin" /> Connecting Freighter…</>
            ) : (
              <><Wallet size={18} /> Connect Freighter Wallet</>
            )}
          </button>
          
          {!hasFreighter && !error && (
             <p className="text-xs text-amber-400/80 mt-4 font-medium">
               ⚠️ Freighter extension not detected.
             </p>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AuthModal;
