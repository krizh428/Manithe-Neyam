import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, CheckCircle2, Users, Phone, Mail } from 'lucide-react';
import type { HomeLocation } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface LocationModalProps {
  location: HomeLocation | null;
  onClose: () => void;
  onSupportClick: () => void;
}

export const LocationModal: React.FC<LocationModalProps> = ({
  location,
  onClose,
  onSupportClick,
}) => {
  const { isTamil } = useLanguage();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (location) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [location, onClose]);

  if (!location) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="relative w-full max-w-2xl bg-theme-card rounded-3xl shadow-card hover:shadow-hover overflow-hidden z-10 border border-theme-border my-8"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/40 text-theme-text hover:bg-black/60 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary"
            aria-label={isTamil ? 'மூடவும்' : 'Close details'}
          >
            <X className="w-5 h-5" />
          </button>

          {/* Top Image Banner */}
          <div className="relative h-60 sm:h-72 w-full overflow-hidden">
            <img
              src={location.image}
              alt={isTamil ? location.titleTa : location.titleEn}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            
            <div className="absolute bottom-4 left-6 right-6 text-theme-text">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-theme-bg/90 text-xs font-bold text-theme-text mb-2 border border-theme-border/30">
                <span>{location.number}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {isTamil ? location.locationTa : location.locationEn}
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold">
                {isTamil ? location.titleTa : location.titleEn}
              </h3>
            </div>
          </div>

          {/* Content Body */}
          <div className="p-6 sm:p-8 space-y-6">
            <p className="text-base sm:text-lg text-theme-text leading-relaxed">
              {isTamil ? location.descTa : location.descEn}
            </p>

            <div className="bg-theme-bg p-5 rounded-2xl border border-theme-border">
              <div className="flex items-center gap-2 text-sm font-bold text-theme-text mb-2">
                <Users className="w-4 h-4 text-theme-text" />
                <span>{isTamil ? 'வசதிகள் & கொள்ளளவு' : 'Facilities & Capacity'}</span>
              </div>
              <p className="text-sm font-medium text-theme-text mb-2">
                {isTamil ? location.capacityTa : location.capacityEn}
              </p>
              <p className="text-sm text-theme-text">
                {isTamil ? location.detailsTa : location.detailsEn}
              </p>
            </div>

            {/* Features Checklist */}
            <div>
              <h4 className="text-sm font-bold text-theme-text uppercase tracking-wider mb-3">
                {isTamil ? 'முக்கிய சிறப்பம்சங்கள்' : 'Key Highlights & Amenities'}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {(isTamil ? location.featuresTa : location.featuresEn).map((feat, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-theme-text">
                    <CheckCircle2 className="w-4 h-4 text-brand-primary shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Direct Contact for this Home */}
            {(location.phone || location.email) && (
              <div className="flex flex-col sm:flex-row flex-wrap gap-3 pt-2">
                {location.phone && (
                  <a
                    href={`tel:${location.phone.replace(/[^+\d]/g, '')}`}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-theme-text hover:text-brand-primary transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    <span>{location.phone}</span>
                  </a>
                )}
                {location.email && (
                  <a
                    href={`mailto:${location.email}`}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-theme-text hover:text-brand-primary transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    <span>{location.email}</span>
                  </a>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="pt-4 border-t border-theme-border flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-2.5 rounded-full border border-theme-border text-theme-text font-semibold text-sm hover:bg-theme-bg transition-colors"
              >
                {isTamil ? 'மூடவும்' : 'Close'}
              </button>

              <button
                onClick={() => {
                  onClose();
                  onSupportClick();
                }}
                className="w-full sm:w-auto px-7 py-2.5 rounded-full bg-theme-bg text-theme-text font-bold text-sm shadow-card hover:shadow-hover hover:bg-theme-bg transition-colors border border-theme-border/40"
              >
                {isTamil ? 'இந்த இல்லத்திற்கு உதவ' : 'Support This Home'}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
