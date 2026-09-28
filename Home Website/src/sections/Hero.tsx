import React from 'react';
import { motion } from 'framer-motion';
import { Heart, ArrowRight, ShieldCheck, Clock, Sparkles, MapPin } from 'lucide-react';
import { HERO_DATA } from '../data/siteData';
import { useLanguage } from '../context/LanguageContext';
import { useAdminData } from '../context/AdminDataContext';
import { IMAGES } from '../assets/images';
import { ImageUploader } from '../components/Admin/ImageUploader';

interface HeroProps {
  onOpenSupport: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenSupport }) => {
  const { isTamil } = useLanguage();
  const { hero, brand, isAdmin, updateHero } = useAdminData();

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 80;
      const elPosition = el.getBoundingClientRect().top;
      const offsetPosition = elPosition + window.pageYOffset - offset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  return (
    <section
      id="hero"
      className="relative min-h-[92vh] pt-28 pb-16 sm:pt-36 sm:pb-24 flex items-center justify-center overflow-hidden bg-gradient-to-b from-theme-bg via-transparent to-theme-secondary"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Editorial Heading & Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="lg:col-span-7 flex flex-col items-start"
          >
            {/* Humanitarian Trust Badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-theme-bg border border-theme-border shadow-xs text-xs sm:text-sm font-bold text-theme-text mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-theme-bg animate-ping" />
              <Sparkles className="w-3.5 h-3.5 text-theme-text" />
              <span>{isTamil ? HERO_DATA.badgeTa : HERO_DATA.badgeEn}</span>
            </motion.div>

            {/* Main Hero Heading */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-theme-text tracking-tight leading-[1.2] mb-6 font-tamil">
              <span className="text-theme-text">
                {isTamil ? hero.titleTa.split('—')[0] : hero.titleEn.split('—')[0]}
              </span>
              {hero.titleTa.includes('—') && (
                <span className="block text-theme-text mt-1 text-2xl sm:text-3xl lg:text-4xl text-theme-text">
                  — {isTamil ? hero.titleTa.split('—')[1] : hero.titleEn.split('—')[1]}
                </span>
              )}
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg lg:text-xl text-theme-text leading-relaxed mb-8 max-w-2xl font-normal">
              {isTamil ? hero.subtitleTa : hero.subtitleEn}
            </p>

            {/* Location & Quick Contact Indicator */}
            <div className="flex flex-wrap items-center gap-3 mb-8 text-xs sm:text-sm text-theme-text font-bold bg-theme-bg px-4 py-2 rounded-xl border border-theme-border">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-theme-text" />
                <span>கோடாங்கிபட்டி & எஸ். சமதர்மபுரம், தேனி</span>
              </span>
              <span>•</span>
              <a href={`tel:${brand.phone1.replace(/\s+/g, '')}`} className="hover:underline text-theme-text">
                📞 {brand.phone1}
              </a>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
              <button
                onClick={() => scrollToSection('about')}
                className="px-7 py-3.5 rounded-full bg-theme-bg text-theme-text font-bold text-sm sm:text-base hover:bg-theme-bg shadow-card hover:shadow-hover transition-all transform hover:-translate-y-0.5 cursor-pointer flex items-center justify-center gap-2.5 border border-theme-border/40 group"
              >
                <span>{isTamil ? HERO_DATA.ctaAboutTa : HERO_DATA.ctaAboutEn}</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={() => scrollToSection('locations')}
                className="px-6 py-3.5 rounded-full bg-theme-bg text-theme-text font-bold text-sm sm:text-base hover:bg-theme-bg hover:text-theme-text border border-theme-border shadow-xs transition-all transform hover:-translate-y-0.5 cursor-pointer flex items-center justify-center gap-2"
              >
                <span>{isTamil ? '3 இல்லங்கள்' : '3 Care Homes'}</span>
              </button>

              <button
                onClick={onOpenSupport}
                className="px-6 py-3.5 rounded-full bg-theme-bg text-theme-text font-extrabold text-sm sm:text-base hover:bg-theme-bg shadow-card hover:shadow-hover transition-all transform hover:-translate-y-0.5 cursor-pointer flex items-center justify-center gap-2"
              >
                <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                <span>{isTamil ? HERO_DATA.ctaSupportTa : HERO_DATA.ctaSupportEn}</span>
              </button>
            </div>

            {/* Trust Markers */}
            <div className="mt-10 pt-6 border-t border-theme-border/80 flex flex-wrap items-center gap-6 text-xs sm:text-sm text-theme-text">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-theme-text" />
                <span>{isTamil ? 'அங்கீகரிக்கப்பட்ட தொண்டு இல்லம்' : 'Registered Humanitarian Home'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-theme-text" />
                <span>{isTamil ? '25+ ஆண்டுகள் தொடர் அர்ப்பணிப்பு' : '25+ Years of Dedicated Service'}</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Asymmetric Organic Frame + Floating Info Badges */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.2, ease: 'easeOut' }}
            className="lg:col-span-5 relative flex items-center justify-center"
          >
            {/* Decorative Organic Shape in Background */}
            <div className="absolute -inset-4 bg-gradient-to-tr from-theme-bg/10 via-brand-primary/15 to-transparent rounded-[50px] transform -rotate-3 blur-md pointer-events-none" />
            <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full bg-theme-bg/20 blur-xl pointer-events-none" />



            {/* Animated Hero Image */}
            <motion.div
              animate={{ y: [-15, 15, -15] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              className="relative w-full max-w-md lg:max-w-none aspect-[4/3.8] flex items-center justify-center z-10"
            >
              <ImageUploader
                currentImageUrl={hero.image && hero.image !== IMAGES.hero ? hero.image : '/hero-image.png'}
                onUploadComplete={(newUrl) => updateHero({ image: newUrl })}
                isAdmin={isAdmin}
                className="w-full h-full drop-shadow-2xl"
                imgClassName="w-full h-full object-contain"
                alt="Manithaneyam Home Care"
              />
            </motion.div>

            {/* Floating Info Badge 1 - Safe Environment (Moved to Top Right) */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -top-4 -right-4 sm:-right-6 bg-theme-bg/95 backdrop-blur-md p-3.5 rounded-2xl shadow-card hover:shadow-hover border border-theme-border flex items-center gap-3 z-20"
            >
              <div className="w-10 h-10 rounded-xl bg-theme-bg border border-theme-border/40 flex items-center justify-center text-theme-text shrink-0">
                <Heart className="w-5 h-5 text-red-500 fill-red-500" />
              </div>
              <div>
                <p className="text-xs font-bold text-theme-text">
                  {isTamil ? HERO_DATA.floatingCard1.titleTa : HERO_DATA.floatingCard1.titleEn}
                </p>
                <p className="text-[11px] font-extrabold text-theme-text">
                  {HERO_DATA.floatingCard1.number} {isTamil ? 'பாதுகாப்பு' : 'Protection'}
                </p>
              </div>
            </motion.div>

            {/* Floating Info Badge 2 - Continuous Medical Care (Moved to Bottom Left) */}
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              className="absolute -bottom-5 -left-4 sm:-left-6 bg-theme-bg/95 backdrop-blur-md p-3.5 rounded-2xl shadow-card hover:shadow-hover border border-theme-border flex items-center gap-3 z-20"
            >
              <div className="w-10 h-10 rounded-xl bg-brand-bg text-brand-primary flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-theme-text">
                  {isTamil ? HERO_DATA.floatingCard2.titleTa : HERO_DATA.floatingCard2.titleEn}
                </p>
                <p className="text-[11px] font-bold text-theme-text">
                  {isTamil ? 'உணவு & சுகாதாரம்' : 'Nutritious & Healthcare'}
                </p>
              </div>
            </motion.div>

          </motion.div>
        </div>
      </div>
    </section>
  );
};
