import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const BackToTop: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const { isTamil } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 350);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.7, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.7, y: 20 }}
          whileHover={{ scale: 1.1, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-40 p-3.5 rounded-full bg-theme-bg text-theme-text shadow-card hover:shadow-hover hover:bg-brand-primary hover:text-on-primary hover:border-brand-hover border-2 border-theme-border transition-colors focus:outline-none focus:ring-4 focus:ring-brand-primary/50 cursor-pointer flex items-center justify-center group"
          aria-label={isTamil ? 'மேலே செல்லவும்' : 'Scroll to top'}
          title={isTamil ? 'மேலே செல்லவும்' : 'Scroll to top'}
        >
          <ArrowUp className="w-5 h-5 transition-transform group-hover:-translate-y-0.5" />
        </motion.button>
      )}
    </AnimatePresence>
  );
};
