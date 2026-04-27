import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';

const SplashScreen = ({ onComplete }) => {
  useEffect(() => {
    // Automatically trigger completion after the animation sequence finishes
    const timer = setTimeout(() => {
      onComplete();
    }, 3800); // 3.8s total duration

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      key="splash"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="fixed inset-0 z-[9999] bg-[#09090b] flex flex-col items-center justify-center"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0, filter: "blur(10px)" }}
        animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
        transition={{
          duration: 1.5,
          ease: "easeOut",
        }}
        className="relative flex flex-col items-center"
      >
        {/* Glow behind the logo */}
        <div className="absolute inset-0 bg-brand-500/20 blur-3xl rounded-full scale-150"></div>

        {/* The Logo Image */}
        <motion.img
          src="/skillswap-logo.png"
          alt="SkillSwap Logo"
          className="h-24 md:h-32 w-auto object-contain relative z-10 drop-shadow-[0_0_20px_rgba(99,102,241,0.5)]"
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Loading / Startup Line */}
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: "150px", opacity: 1 }}
          transition={{ delay: 0.8, duration: 1, ease: "easeInOut" }}
          className="h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent mt-8"
        />
      </motion.div>
    </motion.div>
  );
};

export default SplashScreen;
