import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Users } from 'lucide-react';
import { SectionHeading } from '../components/Common/SectionHeading';
import { ACTIVITY_CATEGORIES } from '../data/siteData';
import type { ActivityCategory } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { PhotoSlider, photosOf } from '../components/Common/PhotoSlider';
import { useAdminData } from '../context/AdminDataContext';

export const Activities: React.FC = () => {
  const { isTamil } = useLanguage();
  const { activities } = useAdminData();
  const [activeCategory, setActiveCategory] = useState<ActivityCategory>('all');

  const filteredActivities =
    activeCategory === 'all'
      ? activities
      : activities.filter((act) => act.category === activeCategory);

  return (
    <section id="activities" className="py-20 sm:py-28 bg-theme-bg relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeading
          badge={isTamil ? 'நிகழ்வுகள் & பணிகள்' : 'Active Programs'}
          title={isTamil ? 'எங்கள் தொடர் செயல்பாடுகள்' : 'Service Activities & Programs'}
          subtitle={
            isTamil
              ? 'குழந்தைகளின் கல்வி, ஆரோக்கியம், முதியோர் நலம் மற்றும் சமூக மேம்பாட்டிற்கான களப்பணிகள்.'
              : 'Our dynamic grassroots initiatives in education, community food support, medical care, and wellness.'
          }
        />

        {/* Animated Filter Category Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-12">
          {ACTIVITY_CATEGORIES.map((cat) => {
            const isSelected = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`relative px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#0EA5E9] ${
                  isSelected
                    ? 'text-theme-text shadow-card hover:shadow-hover'
                    : 'bg-theme-bg text-theme-text hover:text-theme-text border border-theme-border hover:border-theme-border/40'
                }`}
              >
                {isSelected && (
                  <motion.div
                    layoutId="activityFilterPill"
                    className="absolute inset-0 bg-theme-bg rounded-full"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{isTamil ? cat.labelTa : cat.labelEn}</span>
              </button>
            );
          })}
        </div>

        {/* Activities Grid with Animated Layout */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence>
            {filteredActivities.map((act) => (
              <motion.div
                key={act.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.35 }}
                className="bg-theme-bg rounded-3xl border border-theme-border shadow-soft hover:shadow-card-hover overflow-hidden transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Image with overlay tags */}
                  <div className="relative h-52 w-full overflow-hidden bg-theme-bg">
                    <PhotoSlider id={act.id} titleTa={act.titleTa} titleEn={act.titleEn} photos={photosOf(act)} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                    {/* Date Pill */}
                    <div className="absolute top-3 left-3 z-10 pointer-events-none inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-theme-bg/90 backdrop-blur-xs text-theme-text text-xs font-bold shadow-xs">
                      <Calendar className="w-3.5 h-3.5 text-theme-text" />
                      <span>{isTamil ? act.dateTa : act.dateEn}</span>
                    </div>

                    {/* Beneficiaries Count Pill */}
                    <div className="absolute bottom-3 left-3 z-10 pointer-events-none inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-xs text-theme-text text-xs font-medium">
                      <Users className="w-3.5 h-3.5 text-theme-text" />
                      <span>{isTamil ? act.beneficiariesTa : act.beneficiariesEn}</span>
                    </div>
                  </div>

                  {/* Body Text */}
                  <div className="p-6">
                    <h3 className="text-lg sm:text-xl font-extrabold text-theme-text group-hover:text-theme-text transition-colors mb-2.5 line-clamp-2">
                      {isTamil ? act.titleTa : act.titleEn}
                    </h3>

                    <p className="text-sm text-theme-text leading-relaxed">
                      {isTamil ? act.descTa : act.descEn}
                    </p>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-2 border-t border-theme-border/60 flex items-center justify-between text-xs font-bold text-theme-text">
                  <span>{isTamil ? 'தொடர் நற்பணி' : 'Ongoing Initiative'}</span>
                  <span className="w-2 h-2 rounded-full bg-theme-bg" />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

      </div>
    </section>
  );
};
