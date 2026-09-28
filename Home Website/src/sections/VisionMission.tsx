import React from 'react';
import { motion } from 'framer-motion';
import { Eye, Target, CheckCircle2 } from 'lucide-react';
import { SectionHeading } from '../components/Common/SectionHeading';
import { useAdminData } from '../context/AdminDataContext';
import { useLanguage } from '../context/LanguageContext';

export const VisionMission: React.FC = () => {
  const { isTamil } = useLanguage();
  const { vision: { vision, mission } } = useAdminData();

  return (
    <section id="vision" className="py-20 sm:py-28 bg-theme-bg relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeading
          badge={isTamil ? 'எங்கள் திசைவழி' : 'Guiding Principles'}
          title={isTamil ? 'தொலைநோக்கு & செயல் திட்டம்' : 'Vision & Mission'}
          subtitle={
            isTamil
              ? 'அன்பான சமூகத்தை உருவாக்கும் எங்கள் தொலைநோக்கும், அதை சாத்தியமாக்கும் செயல் திட்டமும்.'
              : 'Our clear aspiration for tomorrow and our everyday roadmap for humanitarian action.'
          }
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">

          {/* Card 1: Vision */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl bg-theme-card p-8 sm:p-10 border border-theme-border hover:border-brand-primary shadow-soft hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between relative overflow-hidden"
          >
            {/* Decorative Light Green Shimmer */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-brand-bg/60 rounded-full blur-2xl pointer-events-none" />

            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-brand-bg text-brand-primary flex items-center justify-center shadow-card hover:shadow-hover">
                  <Eye className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-extrabold uppercase tracking-wider text-brand-primary">
                    {isTamil ? vision.badgeTa : vision.badgeEn}
                  </span>
                  <h3 className="text-2xl font-extrabold text-card-heading">
                    {isTamil ? vision.titleTa : vision.titleEn}
                  </h3>
                </div>
              </div>

              <p className="text-base sm:text-lg text-card-text font-medium leading-relaxed mb-6">
                {isTamil ? vision.textTa : vision.textEn}
              </p>

              <div className="space-y-3 pt-4 border-t border-theme-border">
                {(isTamil ? vision.pointsTa : vision.pointsEn).map((point, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-brand-bg text-brand-primary flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-brand-primary" />
                    </div>
                    <span className="text-sm font-semibold text-card-text">{point}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-4 flex items-center gap-2 text-xs font-bold text-card-text-secondary">
              <span className="w-2 h-2 rounded-full bg-brand-primary" />
              <span>{isTamil ? 'அன்பால் வளரும் சமூகம்' : 'A Society Built on Love'}</span>
            </div>
          </motion.div>

          {/* Card 2: Mission */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15, duration: 0.6 }}
            className="rounded-3xl bg-theme-card p-8 sm:p-10 border border-theme-border hover:border-brand-primary shadow-soft hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between relative overflow-hidden"
          >
            {/* Decorative Light Green Shimmer */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-brand-bg/60 rounded-full blur-2xl pointer-events-none" />

            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-brand-bg text-brand-primary flex items-center justify-center shadow-card hover:shadow-hover">
                  <Target className="w-6 h-6 text-brand-primary" />
                </div>
                <div>
                  <span className="text-xs font-extrabold uppercase tracking-wider text-brand-primary">
                    {isTamil ? mission.badgeTa : mission.badgeEn}
                  </span>
                  <h3 className="text-2xl font-extrabold text-card-heading">
                    {isTamil ? mission.titleTa : mission.titleEn}
                  </h3>
                </div>
              </div>

              <p className="text-base sm:text-lg text-card-text font-medium leading-relaxed mb-6">
                {isTamil ? mission.textTa : mission.textEn}
              </p>

              <div className="space-y-3 pt-4 border-t border-theme-border">
                {(isTamil ? mission.pointsTa : mission.pointsEn).map((point, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-brand-bg text-brand-primary flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-brand-primary" />
                    </div>
                    <span className="text-sm font-semibold text-card-text">{point}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-4 flex items-center gap-2 text-xs font-bold text-card-text-secondary">
              <span className="w-2 h-2 rounded-full bg-brand-primary" />
              <span>{isTamil ? 'நேரடி மக்கள் சேவை' : 'Direct Humanitarian Upliftment'}</span>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
