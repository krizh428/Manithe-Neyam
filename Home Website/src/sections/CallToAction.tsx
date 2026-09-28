import React from 'react';
import { motion } from 'framer-motion';
import { Heart, PhoneCall, Sparkles } from 'lucide-react';
import { CTA_DATA } from '../data/siteData';
import { useLanguage } from '../context/LanguageContext';

interface CallToActionProps {
  onOpenSupport: () => void;
}

export const CallToAction: React.FC<CallToActionProps> = ({ onOpenSupport }) => {
  const { isTamil } = useLanguage();

  const scrollToContact = () => {
    const el = document.getElementById('contact');
    if (el) {
      const offset = 80;
      const elPosition = el.getBoundingClientRect().top;
      const offsetPosition = elPosition + window.pageYOffset - offset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-20 sm:py-28 bg-theme-bg relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative rounded-[36px] bg-gradient-to-br from-theme-bg/40 via-[#0B1120] to-theme-secondary text-theme-text p-8 sm:p-14 lg:p-16 shadow-card hover:shadow-hover overflow-hidden border-2 border-theme-border/40"
        >
          {/* Decorative Ochre & Radial Lighting */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-theme-bg/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-black/30 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto text-center flex flex-col items-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-theme-bg/10 backdrop-blur-md border border-theme-border/20 text-xs sm:text-sm font-bold text-theme-text mb-6">
              <Sparkles className="w-4 h-4 text-theme-text" />
              <span>{isTamil ? CTA_DATA.badgeTa : CTA_DATA.badgeEn}</span>
            </div>

            {/* Title */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight mb-6 font-tamil text-theme-text">
              {isTamil ? CTA_DATA.titleTa : CTA_DATA.titleEn}
            </h2>

            {/* Description */}
            <p className="text-base sm:text-lg text-theme-text/85 leading-relaxed mb-10 max-w-2xl font-normal">
              {isTamil ? CTA_DATA.descTa : CTA_DATA.descEn}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4 w-full sm:w-auto">
              <button
                onClick={onOpenSupport}
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-theme-bg text-theme-text font-extrabold text-sm sm:text-base hover:bg-theme-bg shadow-card hover:shadow-hover transition-all transform hover:-translate-y-0.5 cursor-pointer flex items-center justify-center gap-2.5"
              >
                <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                <span>{isTamil ? CTA_DATA.btnSupportTa : CTA_DATA.btnSupportEn}</span>
              </button>

              <button
                onClick={scrollToContact}
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-theme-bg/10 hover:bg-theme-bg/20 text-theme-text font-bold text-sm sm:text-base border border-theme-border/30 backdrop-blur-xs transition-all transform hover:-translate-y-0.5 cursor-pointer flex items-center justify-center gap-2.5"
              >
                <PhoneCall className="w-4 h-4 text-theme-text" />
                <span>{isTamil ? CTA_DATA.btnContactTa : CTA_DATA.btnContactEn}</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
