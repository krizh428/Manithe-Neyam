import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WhatsAppIcon } from './WhatsAppIcon';
import { useLanguage } from '../../context/LanguageContext';
import { SITE_BRAND } from '../../data/siteData';

export const FloatingWhatsApp: React.FC = () => {
  const { isTamil } = useLanguage();
  const [isHovered, setIsHovered] = useState(false);

  const cleanPhone = SITE_BRAND.phone1.replace(/\D/g, '');
  const message = isTamil
    ? 'வணக்கம், மனிதநேய அறக்கட்டளை மற்றும் காப்பகம் பற்றிய தகவல்களை அறிய விரும்புகிறேன்.'
    : 'Hello, I would like to get more information about Manithaneyam Orphanage & Destitute Home.';
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;

  return (
    <div
      className="fixed bottom-6 right-6 sm:bottom-7 sm:right-7 z-50 flex items-center gap-3"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Floating Tooltip / Label */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, x: 10, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 10, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="hidden sm:flex items-center gap-2 bg-theme-card/95 backdrop-blur-md px-3.5 py-2 rounded-2xl shadow-xl border border-theme-border/60 pointer-events-none"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-card-heading">
                {isTamil ? 'வாட்ஸ்அப் அரட்டை' : 'Chat on WhatsApp'}
              </span>
              <span className="text-[11px] text-card-text-secondary font-medium">
                {SITE_BRAND.phone1}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main WhatsApp Button with Right Corner Animation */}
      <motion.a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={isTamil ? 'வாட்ஸ்அப் மூலம் தொடர்புகொள்ள' : 'Chat on WhatsApp'}
        title={isTamil ? 'வாட்ஸ்அப் மூலம் தொடர்புகொள்ள' : 'Chat on WhatsApp'}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.92 }}
        className="relative group flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-[#128C7E] via-[#25D366] to-[#2ecc71] text-white shadow-xl shadow-emerald-500/40 hover:shadow-2xl hover:shadow-emerald-500/60 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-emerald-400/50 cursor-pointer"
      >
        {/* Animated pulse rings */}
        <span className="absolute -inset-1 rounded-full bg-[#25D366] opacity-40 animate-ping group-hover:opacity-70 -z-10 pointer-events-none" />
        <span className="absolute -inset-2 rounded-full bg-[#25D366]/20 blur-sm -z-20 pointer-events-none animate-pulse" />

        {/* WhatsApp Icon */}
        <WhatsAppIcon className="w-8 h-8 sm:w-9 sm:h-9 text-white drop-shadow-md transition-transform duration-300 group-hover:rotate-6" />

        {/* Online Status Dot */}
        <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-emerald-300 border-2 border-white rounded-full shadow-xs" />
      </motion.a>
    </div>
  );
};
