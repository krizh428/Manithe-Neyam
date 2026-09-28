import React from 'react';
import { motion } from 'framer-motion';

export const AmbientGlow: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
      {/* Top Left Warm Cyan Aura */}
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.35, 0.5, 0.35],
          x: [0, 20, 0],
          y: [0, -20, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute -top-[15%] -left-[10%] w-[55vw] h-[55vw] max-w-[600px] max-h-[600px] rounded-full bg-radial from-theme-bg/8 via-brand-primary/3 to-transparent blur-3xl"
      />

      {/* Center Right Warm Ochre Aura */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.25, 0.45, 0.25],
          x: [0, -30, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 2,
        }}
        className="absolute top-[40%] -right-[15%] w-[60vw] h-[60vw] max-w-[650px] max-h-[650px] rounded-full bg-radial from-theme-bg/10 via-brand-primary/3 to-transparent blur-3xl"
      />

      {/* Bottom Center Slate Soft Light */}
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.4, 0.3],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 4,
        }}
        className="absolute -bottom-[10%] left-[25%] w-[50vw] h-[50vw] max-w-[500px] max-h-[500px] rounded-full bg-radial from-theme-bg/80 via-[#0B1120]/20 to-transparent blur-3xl"
      />
    </div>
  );
};
