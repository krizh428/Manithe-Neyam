import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Quote, HeartHandshake } from 'lucide-react';
import { SectionHeading } from '../components/Common/SectionHeading';
import { INTRODUCTION_DATA } from '../data/siteData';
import { useLanguage } from '../context/LanguageContext';
import { useAdminData } from '../context/AdminDataContext';
import { IMAGES } from '../assets/images';
import { ImageUploader } from '../components/Admin/ImageUploader';

export const Introduction: React.FC = () => {
  const { isTamil } = useLanguage();
  const { about, brand, isAdmin, updateAbout } = useAdminData();

  return (
    <section id="about" className="py-20 sm:py-28 bg-theme-bg relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeading
          badge={isTamil ? INTRODUCTION_DATA.badgeTa : INTRODUCTION_DATA.badgeEn}
          title={isTamil ? about.titleTa : about.titleEn}
          subtitle={
            isTamil
              ? 'அன்பும் அரவணைப்பும் தேடும் ஒவ்வொரு உள்ளத்திற்கும் நம்பிக்கையளிக்கும் உன்னத புகலிடம்.'
              : 'A compassionate haven rekindling hope, dignity, and warmth for vulnerable souls in Theni.'
          }
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          
          {/* Left Column: Image Card with Overlapping Quote */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-5 relative mb-12 lg:mb-0"
          >
            {/* Background Decorative Ochre Accent */}
            <div className="absolute -inset-3 bg-theme-bg rounded-3xl -rotate-2 border border-theme-border" />

            {/* Main Image Frame */}
            <div className="relative rounded-3xl overflow-hidden shadow-card hover:shadow-hover border-4 border-theme-border aspect-[4/4.5] bg-theme-bg group">
              <ImageUploader
                currentImageUrl={about.image || IMAGES.introduction}
                onUploadComplete={(newUrl) => updateAbout({ image: newUrl })}
                isAdmin={isAdmin}
                className="w-full h-full"
                imgClassName="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                alt="Manithaneyam Community Care"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />

              {/* Tag on bottom of image */}
              <div className="absolute bottom-5 left-5 right-5 text-theme-text pointer-events-none">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-theme-bg text-xs font-bold text-theme-text mb-1">
                  <HeartHandshake className="w-3.5 h-3.5" />
                  <span>{isTamil ? brand.fullNameTa : brand.fullNameEn}</span>
                </div>
                <p className="text-xs text-white/90 font-medium">
                  {isTamil ? brand.fullAddressTa : brand.fullAddressEn}
                </p>
              </div>
            </div>

            {/* Floating Quote Box */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="relative mx-auto mt-6 w-[92%] sm:w-[85%] max-w-md bg-theme-bg p-5 rounded-2xl shadow-card hover:shadow-hover border border-theme-border z-20"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-brand-bg text-brand-primary shrink-0">
                  <Quote className="w-5 h-5 text-brand-primary" />
                </div>
                <p className="text-xs sm:text-sm font-semibold text-theme-text leading-relaxed italic">
                  "{isTamil ? about.quoteTa : about.quoteEn}"
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column: Editorial Text & Highlights */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-7 flex flex-col justify-center space-y-6 pt-4 lg:pt-0"
          >
            <div className="space-y-4 text-base sm:text-lg text-theme-text leading-relaxed">
              {(isTamil ? about.paragraphsTa : about.paragraphsEn).map(
                (para, index) => (
                  <p key={index}>{para}</p>
                )
              )}
            </div>

            {/* Highlights Grid */}
            <div className="pt-4 border-t border-theme-border">
              <h4 className="text-sm font-bold text-theme-text uppercase tracking-wider mb-4">
                {isTamil ? 'எங்கள் அடிப்படை இல்லங்கள் & பணிகள்' : 'Our Residential Facilities & Mission'}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {INTRODUCTION_DATA.highlights.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 rounded-xl bg-theme-bg border border-theme-border text-theme-text transition-transform hover:translate-x-1"
                  >
                    <div className="w-6 h-6 rounded-full bg-brand-bg text-brand-primary flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-brand-primary" />
                    </div>
                    <span className="font-bold text-xs sm:text-sm">
                      {isTamil ? item.titleTa : item.titleEn}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </motion.div>
        </div>
      </div>
    </section>
  );
};
