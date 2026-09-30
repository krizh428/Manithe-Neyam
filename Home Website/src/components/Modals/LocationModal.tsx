import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, CheckCircle2, Users, Phone, Mail, Heart } from 'lucide-react';
import type { HomeLocation } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { PhotoSlider, photosOf } from '../Common/PhotoSlider';

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

  const photos = photosOf(location);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/65 backdrop-blur-xs"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="relative w-full max-w-2xl bg-theme-card rounded-3xl shadow-card overflow-hidden z-10 border border-theme-border my-8"
        >
          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 z-30 p-2.5 rounded-full bg-black/50 text-white hover:bg-black/75 transition-all focus:outline-none focus:ring-2 focus:ring-brand-primary cursor-pointer hover:scale-105"
            aria-label={isTamil ? 'மூடவும்' : 'Close details'}
          >
            <X className="w-5 h-5" />
          </button>

          {/* Top Image Banner */}
          <div className="relative h-64 sm:h-76 w-full overflow-hidden bg-theme-bg">
            {photos.length > 1 ? (
              <PhotoSlider
                id={`modal-${location.id}`}
                titleTa={location.titleTa}
                titleEn={location.titleEn}
                photos={photos}
              />
            ) : (
              <img
                src={location.image}
                alt={isTamil ? location.titleTa : location.titleEn}
                className="w-full h-full object-cover"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent pointer-events-none" />

            <div className="absolute bottom-5 left-6 right-6 text-white pointer-events-none z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-xs font-bold text-white mb-2.5 border border-white/20 shadow-xs">
                <span className="font-extrabold">{location.number}</span>
                <span className="opacity-60">•</span>
                <span className="flex items-center gap-1.5 text-white">
                  <MapPin className="w-3.5 h-3.5 text-brand-primary" />
                  {isTamil ? location.locationTa : location.locationEn}
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold font-tamil leading-tight drop-shadow-sm">
                {isTamil ? location.titleTa : location.titleEn}
              </h3>
            </div>
          </div>

          {/* Content Body */}
          <div className="p-6 sm:p-8 space-y-6">
            <p className="text-sm sm:text-base text-card-text leading-relaxed font-normal">
              {isTamil ? location.descTa : location.descEn}
            </p>

            {/* Facilities & Capacity Box with Structured Layout */}
            <div className="bg-theme-bg/80 p-5 sm:p-6 rounded-2xl border border-theme-border shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3 pb-3 border-b border-theme-border/60">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary shrink-0">
                    <Users className="w-4.5 h-4.5" />
                  </div>
                  <span className="text-sm sm:text-base font-extrabold text-card-heading">
                    {isTamil ? 'வசதிகள் & கொள்ளளவு' : 'Facilities & Capacity'}
                  </span>
                </div>

                {/* Structured Capacity Stat Badge */}
                {(location.capacityTa || location.capacityEn) && (
                  <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-brand-primary text-on-primary text-xs font-bold w-fit shadow-xs">
                    <span>{isTamil ? location.capacityTa : location.capacityEn}</span>
                  </div>
                )}
              </div>

              {/* Details Description */}
              <p className="text-sm text-card-text leading-relaxed">
                {isTamil ? location.detailsTa : location.detailsEn}
              </p>
            </div>

            {/* Features Checklist Grid */}
            <div>
              <h4 className="text-xs sm:text-sm font-extrabold text-card-heading uppercase tracking-wider mb-3.5 flex items-center gap-2">
                <span className="w-1.5 h-4 rounded-full bg-brand-primary" />
                <span>{isTamil ? 'முக்கிய சிறப்பம்சங்கள்' : 'Key Highlights & Amenities'}</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                {(isTamil ? location.featuresTa : location.featuresEn).map((feat, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2.5 p-3 rounded-xl bg-theme-bg/60 border border-theme-border/60 text-xs sm:text-sm font-medium text-card-text hover:border-brand-primary/40 hover:bg-theme-bg transition-colors"
                  >
                    <CheckCircle2 className="w-4 h-4 text-brand-primary shrink-0 mt-0.5" />
                    <span className="leading-snug">{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Direct Contact for this Home */}
            {(location.phone || location.email) && (
              <div className="flex flex-wrap items-center gap-3 pt-1">
                {location.phone && (
                  <a
                    href={`tel:${location.phone.replace(/[^+\d]/g, '')}`}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-theme-bg border border-theme-border text-xs sm:text-sm font-semibold text-card-text hover:text-brand-primary hover:border-brand-primary transition-all shadow-xs"
                  >
                    <Phone className="w-3.5 h-3.5 text-brand-primary" />
                    <span>{location.phone}</span>
                  </a>
                )}
                {location.email && (
                  <a
                    href={`mailto:${location.email}`}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-theme-bg border border-theme-border text-xs sm:text-sm font-semibold text-card-text hover:text-brand-primary hover:border-brand-primary transition-all shadow-xs"
                  >
                    <Mail className="w-3.5 h-3.5 text-brand-primary" />
                    <span>{location.email}</span>
                  </a>
                )}
              </div>
            )}

            {/* Modal Action Buttons */}
            <div className="pt-5 border-t border-theme-border flex flex-col-reverse sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-2.5 rounded-full border border-theme-border text-card-text font-semibold text-sm hover:bg-theme-bg hover:text-card-heading transition-all cursor-pointer"
              >
                {isTamil ? 'மூடவும்' : 'Close'}
              </button>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  onSupportClick();
                }}
                className="w-full sm:w-auto px-7 py-2.5 rounded-full bg-brand-primary hover:bg-brand-hover text-on-primary font-bold text-sm shadow-card hover:shadow-hover hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Heart className="w-4 h-4 fill-current text-heart" />
                <span>{isTamil ? 'இந்த இல்லத்திற்கு உதவ' : 'Support This Home'}</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
