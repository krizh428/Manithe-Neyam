import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import type { GalleryItem } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface LightboxModalProps {
  items: GalleryItem[];
  currentIndex: number | null;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({
  items,
  currentIndex,
  onClose,
  onNext,
  onPrev,
}) => {
  const { isTamil } = useLanguage();

  const isOpen = currentIndex !== null && currentIndex >= 0 && currentIndex < items.length;
  const currentItem = isOpen ? items[currentIndex] : null;

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'ArrowLeft') onPrev();
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, onNext, onPrev]);

  if (!isOpen || !currentItem) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 select-none">
        {/* Dark Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/90 backdrop-blur-md"
        />

        {/* Top Control Bar */}
        <div className="fixed top-4 left-4 right-4 z-50 flex items-center justify-between text-white px-2 sm:px-6">
          <div className="bg-black/40 px-3.5 py-1.5 rounded-full text-xs font-semibold backdrop-blur-xs border border-theme-border/10">
            <span>{currentIndex + 1}</span> / <span>{items.length}</span>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 rounded-full bg-black/50 hover:bg-black/80 text-white transition-colors border border-theme-border/20 focus:outline-none focus:ring-2 focus:ring-brand-primary"
            aria-label={isTamil ? 'மூடவும்' : 'Close lightbox'}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Prev Button */}
        <button
          onClick={onPrev}
          className="fixed left-4 sm:left-8 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-black/50 hover:bg-theme-bg text-white hover:text-brand-primary transition-all border border-theme-border/20 shadow-card hover:shadow-hover focus:outline-none focus:ring-2 focus:ring-brand-primary"
          aria-label={isTamil ? 'முந்தையது' : 'Previous image'}
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Next Button */}
        <button
          onClick={onNext}
          className="fixed right-4 sm:right-8 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-black/50 hover:bg-theme-bg text-white hover:text-brand-primary transition-all border border-theme-border/20 shadow-card hover:shadow-hover focus:outline-none focus:ring-2 focus:ring-brand-primary"
          aria-label={isTamil ? 'அடுத்தது' : 'Next image'}
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Main Image View & Caption */}
        <motion.div
          key={currentItem.id}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.25 }}
          className="relative z-10 max-w-4xl max-h-[85vh] flex flex-col items-center justify-center pointer-events-auto"
        >
          <div className="relative rounded-2xl overflow-hidden shadow-card hover:shadow-hover border border-theme-border/15 bg-black">
            <img
              src={currentItem.image}
              alt={isTamil ? currentItem.altTa : currentItem.altEn}
              className="max-h-[70vh] w-auto max-w-full object-contain rounded-xl"
            />
          </div>

          {/* Caption Box */}
          <div className="mt-4 text-center max-w-xl px-4 py-2 bg-black/60 rounded-xl backdrop-blur-xs border border-theme-border/10 text-white">
            <h4 className="text-base sm:text-lg font-bold">
              {isTamil ? currentItem.titleTa : currentItem.titleEn}
            </h4>
            <p className="text-xs sm:text-sm text-white/90 mt-0.5 font-normal">
              {isTamil ? currentItem.captionTa : currentItem.captionEn}
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
