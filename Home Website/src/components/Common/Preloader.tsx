import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SITE_BRAND } from '../../data/siteData';

interface PreloaderProps {
  onComplete?: () => void;
}

export const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
      if (onComplete) onComplete();
    }, 1200);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.5, ease: 'easeInOut' } }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-theme-bg px-4 text-center select-none"
        >
          {/* Central Logo Emblem */}
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="relative mb-6"
          >
            <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-theme-bg shadow-card hover:shadow-hover p-2 border-2 border-theme-border/20 flex items-center justify-center">
              <img
                src="/logo.png"
                alt="Manithaneyam Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
              className="absolute -inset-2 rounded-full border border-dashed border-theme-border opacity-70 pointer-events-none"
            />
          </motion.div>

          {/* Titles */}
          <motion.h1
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-2xl sm:text-3xl font-extrabold text-theme-text tracking-tight font-tamil"
          >
            {SITE_BRAND.fullNameTa}
          </motion.h1>

          <motion.p
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.35, duration: 0.5 }}
            className="text-xs sm:text-sm font-medium text-theme-text mt-1 font-english tracking-wider uppercase"
          >
            {SITE_BRAND.nameEn}
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45, duration: 0.5 }}
            className="text-xs text-theme-text/80 mt-1 font-tamil font-medium"
          >
            {SITE_BRAND.locationBriefTa}
          </motion.p>

          {/* Expanding Ochre Indicator Line */}
          <div className="w-36 sm:w-48 h-1 bg-theme-bg rounded-full overflow-hidden mt-6">
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{
                repeat: Infinity,
                duration: 1,
                ease: 'easeInOut',
              }}
              className="w-full h-full bg-gradient-to-r from-theme-bg via-brand-primary to-theme-secondary rounded-full"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
