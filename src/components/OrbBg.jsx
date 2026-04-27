import { motion } from "framer-motion";

export default function OrbBg() {
  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center overflow-hidden pointer-events-none -z-10">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="w-72 h-72 rounded-full border border-cyan-400/30 shadow-[0_0_80px_#06b6d4]"
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute w-96 h-96 rounded-full border border-purple-500/20"
      />
    </div>
  );
}
