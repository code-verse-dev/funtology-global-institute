import { motion } from "framer-motion";
import fgiLogo from "@/assets/fgi-logo.png";

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-hero"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      onAnimationComplete={() => {
        // Start fade out after logo animation completes
        setTimeout(onComplete, 2500);
      }}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, hsl(43 65% 59% / 0.1) 0%, transparent 50%),
                           radial-gradient(circle at 75% 75%, hsl(43 65% 59% / 0.1) 0%, transparent 50%)`
        }} />
      </div>

      {/* Logo Container */}
      <motion.div
        className="relative flex flex-col items-center"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          duration: 1,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
      >
        {/* Glow Effect */}
        <motion.div
          className="absolute inset-0 rounded-full blur-3xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.3, 0.2] }}
          transition={{ duration: 2, ease: "easeInOut" }}
          style={{
            background: "radial-gradient(circle, hsl(43 65% 59% / 0.4) 0%, transparent 70%)",
            transform: "scale(1.5)",
          }}
        />

        {/* Logo */}
        <motion.img
          src={fgiLogo}
          alt="Funtology Global Institute"
          className="relative w-64 h-64 md:w-80 md:h-80 object-contain drop-shadow-2xl"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
        />

        {/* Tagline */}
        <motion.p
          className="mt-8 text-gold-light font-heading text-xl md:text-2xl tracking-widest uppercase text-center"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
        >
          Advancing Levels. Elevating Futures.
        </motion.p>

        {/* Loading Indicator */}
        <motion.div
          className="mt-10 flex items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <motion.div
            className="w-2 h-2 rounded-full bg-gold"
            animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0 }}
          />
          <motion.div
            className="w-2 h-2 rounded-full bg-gold"
            animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
          />
          <motion.div
            className="w-2 h-2 rounded-full bg-gold"
            animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default SplashScreen;
