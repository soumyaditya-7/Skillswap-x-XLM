import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useMemo } from 'react';
import { CircleDollarSign, Bitcoin, Coins } from 'lucide-react';

// Generate random coin data outside the component to avoid ESLint purity warnings
const coins = Array.from({ length: 15 }).map((_, i) => ({
  id: i,
  x: Math.random() * 100, // percentage across width
  delay: Math.random() * 2, // delay up to 2 seconds
  duration: 1.5 + Math.random() * 2, // fall duration 1.5 - 3.5s
  scale: 0.5 + Math.random() * 1, // scale 0.5 - 1.5
  icon: [CircleDollarSign, Bitcoin, Coins][Math.floor(Math.random() * 3)],
}));

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
      className="fixed inset-0 z-[9999] bg-[#09090b] flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Falling Coins Background */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        {coins.map((coin) => {
          const Icon = coin.icon;
          return (
            <motion.div
              key={coin.id}
              className="absolute text-brand-400"
              initial={{ y: -100, x: `${coin.x}vw`, opacity: 0, rotate: 0 }}
              animate={{ 
                y: "110vh", 
                opacity: [0, 1, 1, 0], 
                rotate: 360 
              }}
              transition={{
                duration: coin.duration,
                delay: coin.delay,
                repeat: Infinity,
                ease: "linear"
              }}
              style={{ scale: coin.scale }}
            >
              <Icon size={32} />
            </motion.div>
          );
        })}
      </div>

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
          className="h-40 md:h-56 w-auto object-contain relative z-10 drop-shadow-[0_0_20px_rgba(99,102,241,0.5)]"
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
