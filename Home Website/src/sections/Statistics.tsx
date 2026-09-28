import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Award, Users, HeartHandshake, CalendarCheck } from 'lucide-react';
import { SectionHeading } from '../components/Common/SectionHeading';
import type { StatisticItem } from '../types';
import { useAdminData } from '../context/AdminDataContext';
import { useLanguage } from '../context/LanguageContext';
import { useCountUp } from '../hooks/useCountUp';

const StatCard: React.FC<{
  stat: StatisticItem;
  inView: boolean;
  index: number;
  isTamil: boolean;
}> = ({ stat, inView, index, isTamil }) => {
  const count = useCountUp(stat.value, 2000, inView);

  const getIcon = (id: string) => {
    switch (id) {
      case 'stat-years':
        return <Award className="w-6 h-6" />;
      case 'stat-residents':
        return <Users className="w-6 h-6" />;
      case 'stat-community':
        return <HeartHandshake className="w-6 h-6" />;
      case 'stat-camps':
        return <CalendarCheck className="w-6 h-6" />;
      default:
        return <Award className="w-6 h-6" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.12, duration: 0.6 }}
      className="p-8 rounded-3xl bg-theme-bg border border-theme-border shadow-soft hover:shadow-card-hover transition-all duration-300 flex flex-col items-center text-center group relative overflow-hidden"
    >
      <div className="w-14 h-14 rounded-2xl bg-theme-bg text-theme-text flex items-center justify-center mb-6 shadow-card hover:shadow-hover group-hover:scale-110 transition-transform duration-300">
        {getIcon(stat.id)}
      </div>

      <div className="flex items-baseline justify-center gap-1 mb-2 font-poppins">
        <span className="text-4xl sm:text-5xl font-black text-theme-text tracking-tight">
          {count}
        </span>
        <span className="text-3xl sm:text-4xl font-black text-theme-text">
          {stat.suffix}
        </span>
      </div>

      <h4 className="text-base sm:text-lg font-bold text-theme-text mb-1 font-tamil">
        {isTamil ? stat.labelTa : stat.labelEn}
      </h4>

      <p className="text-xs text-theme-text font-normal max-w-[220px]">
        {isTamil ? stat.descTa : stat.descEn}
      </p>

      {/* Bottom Ochre Accent Bar */}
      <div className="w-12 h-1 bg-theme-bg rounded-full mt-5 group-hover:w-20 transition-all duration-300" />
    </motion.div>
  );
};

export const Statistics: React.FC = () => {
  const { isTamil } = useLanguage();
  const { statistics } = useAdminData();
  const [inView, setInView] = useState(false);

  return (
    <section id="stats" className="py-20 sm:py-28 bg-theme-bg/60 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeading
          badge={isTamil ? 'தாக்கம் & நம்பிக்கை' : 'Our Impact & Reach'}
          title={isTamil ? 'மனிதநேயத்தின் மைல்கற்கள்' : 'Milestones of Compassion'}
          subtitle={
            isTamil
              ? 'பல ஆண்டுகால தொடர் சேவையில் மக்களின் நம்பிக்கையுடனும் ஆதரவுடனும் நாம் கடந்து வந்த பாதை.'
              : 'Measurable impact created by collective goodwill, generous donors, and selfless volunteers.'
          }
        />

        <motion.div
          onViewportEnter={() => setInView(true)}
          viewport={{ once: true, margin: '-80px' }}
          className="grid gap-6 sm:gap-8"
          style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 240px), 1fr))" }}
        >
          {statistics.map((stat, index) => (
            <StatCard
              key={stat.id}
              stat={stat}
              inView={inView}
              index={index}
              isTamil={isTamil}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
};
