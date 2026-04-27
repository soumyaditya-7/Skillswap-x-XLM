import { motion } from "framer-motion";
import { Zap } from "lucide-react";

export default function OrbBg() {
  return (
    <div className="fixed inset-0 flex items-center justify-center overflow-hidden pointer-events-none -z-10 bg-transparent">
      {/* Massive Faint Crypto Sign in Background */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.03, scale: 1 }}
        transition={{ duration: 2 }}
        className="absolute flex items-center justify-center text-white"
      >
        <Zap size={600} className="drop-shadow-[0_0_100px_rgba(255,255,255,1)]" />
      </motion.div>

      {/* Shining / Rotating Orbs */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="w-72 h-72 rounded-full border border-cyan-400/30 shadow-[0_0_80px_#06b6d4] absolute"
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="w-96 h-96 rounded-full border border-purple-500/20 absolute"
      />
    </div>
  );
}
