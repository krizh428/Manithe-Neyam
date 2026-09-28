import React from 'react';
import { motion } from 'framer-motion';

export const SlidingPill: React.FC = () => {
  return (
    <motion.div
      layoutId="activeNavPill"
      className="absolute inset-0 bg-theme-bg rounded-full shadow-card hover:shadow-hover"
      transition={{
        type: 'spring',
        stiffness: 380,
        damping: 30,
      }}
    />
  );
};
