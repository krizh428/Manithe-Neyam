import React from 'react';
import { motion } from 'framer-motion';
import { Quote, Award, Heart } from 'lucide-react';
import { SectionHeading } from '../components/Common/SectionHeading';
import { useLanguage } from '../context/LanguageContext';
import { useAdminData } from '../context/AdminDataContext';

export const Founder: React.FC = () => {
  const { isTamil } = useLanguage();
  const { founder: FOUNDER_DATA } = useAdminData();

  return (
    <section id="founder" className="py-20 sm:py-28 bg-theme-bg/40 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeading
          badge={isTamil ? 'அர்ப்பணிப்பு' : 'Leadership & Vision'}
          title={isTamil ? FOUNDER_DATA.titleTa : FOUNDER_DATA.titleEn}
          subtitle={
            isTamil
              ? 'மனிதநேயத்தின் வழியில் இடைவிடாது பயணிக்கும் வழிகாட்டுதலின் குரல்.'
              : 'A voice of compassion, guiding our ongoing humanitarian journey.'
          }
        />

        <div className="bg-theme-bg rounded-3xl border border-theme-border shadow-soft p-8 sm:p-12 lg:p-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* Left: Dignified Founder Portrait with Organic Frame */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="lg:col-span-5 relative flex justify-center"
            >
              <div className="relative w-full max-w-sm aspect-[3.8/4.5] rounded-3xl overflow-hidden shadow-card hover:shadow-hover border-4 border-theme-border">
                <img
                  src={FOUNDER_DATA.image}
                  alt={isTamil ? FOUNDER_DATA.nameTa : FOUNDER_DATA.nameEn}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-theme-bg/70 via-transparent to-transparent" />
                
                {/* Overlay Name on Image bottom */}
                <div className="absolute bottom-4 left-5 right-5 text-theme-text">
                  <p className="text-xl font-extrabold font-tamil">
                    {isTamil ? FOUNDER_DATA.nameTa : FOUNDER_DATA.nameEn}
                  </p>
                  <p className="text-xs text-theme-text font-medium">
                    {isTamil ? FOUNDER_DATA.roleTa : FOUNDER_DATA.roleEn}
                  </p>
                </div>
              </div>

              {/* Decorative Badge */}
              <div className="absolute -bottom-4 -right-2 sm:right-4 bg-theme-bg text-theme-text p-3.5 rounded-2xl shadow-card hover:shadow-hover border-2 border-theme-border flex items-center gap-2 z-20">
                <Award className="w-5 h-5 text-theme-text" />
                <span className="text-xs font-bold font-tamil">
                  {isTamil ? '25+ ஆண்டுகள் சேவை' : '25+ Years Legacy'}
                </span>
              </div>
            </motion.div>

            {/* Right: Message & Bio */}
            <motion.div
              initial={{ opacity: 0, x: 25 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="lg:col-span-7 flex flex-col justify-center space-y-6"
            >
              {/* Quote Banner */}
              <div className="bg-theme-bg p-6 sm:p-7 rounded-2xl border border-theme-border relative">
                <Quote className="w-8 h-8 text-theme-text/20 absolute top-4 right-4" />
                <p className="text-base sm:text-lg lg:text-xl font-bold text-theme-text leading-relaxed italic font-tamil">
                  {isTamil ? FOUNDER_DATA.quoteTa : FOUNDER_DATA.quoteEn}
                </p>
              </div>

              {/* Bio Paragraphs */}
              <div className="space-y-4 text-sm sm:text-base text-theme-text leading-relaxed">
                {(isTamil ? FOUNDER_DATA.bioTa : FOUNDER_DATA.bioEn).map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>

              {/* Values pill list */}
              <div className="pt-3 flex flex-wrap gap-2">
                {[
                  { ta: 'அன்பு', en: 'Love' },
                  { ta: 'கருணை', en: 'Compassion' },
                  { ta: 'கல்வி', en: 'Education' },
                  { ta: 'பாதுகாப்பு', en: 'Protection' },
                  { ta: 'மரியாதை', en: 'Dignity' },
                ].map((val, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-theme-bg border border-theme-border text-xs font-bold text-theme-text"
                  >
                    <Heart className="w-3 h-3 text-red-500 fill-red-500" />
                    <span>{isTamil ? val.ta : val.en}</span>
                  </span>
                ))}
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  );
};
