import React, { useState, useLayoutEffect, useRef } from 'react';
import { Award, Users, HeartHandshake, CalendarCheck } from 'lucide-react';
import { SectionHeading } from '../components/Common/SectionHeading';
import type { StatisticItem } from '../types';
import { useAdminData } from '../context/AdminDataContext';
import { useLanguage } from '../context/LanguageContext';
import { useCountUp } from '../hooks/useCountUp';
import { gsap, EASING, prefersReducedMotion } from '../animations';

const StatCard: React.FC<{
  stat: StatisticItem;
  inView: boolean;
  isTamil: boolean;
}> = ({ stat, inView, isTamil }) => {
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
    <div className="p-8 rounded-3xl bg-theme-card hover:bg-brand-bg/40 border border-theme-border hover:border-brand-primary shadow-soft hover:shadow-card-hover transition-all duration-300 flex flex-col items-center text-center group relative overflow-hidden hover:-translate-y-1.5">
      <div className="w-14 h-14 rounded-2xl bg-brand-bg text-brand-primary flex items-center justify-center mb-6 shadow-card hover:shadow-hover group-hover:scale-110 transition-transform duration-300">
        {getIcon(stat.id)}
      </div>

      <div className="flex items-baseline justify-center gap-1 mb-2 font-poppins">
        <span className="text-4xl sm:text-5xl font-black text-card-heading tracking-tight">
          {count}
        </span>
        <span className="text-3xl sm:text-4xl font-black text-brand-primary">
          {stat.suffix}
        </span>
      </div>

      <h4 className="text-base sm:text-lg font-bold text-card-heading mb-1 font-tamil group-hover:text-brand-primary transition-colors">
        {isTamil ? stat.labelTa : stat.labelEn}
      </h4>

      <p className="text-xs text-card-text-secondary font-normal max-w-[220px]">
        {isTamil ? stat.descTa : stat.descEn}
      </p>

      {/* Bottom Accent Bar */}
      <div className="w-12 h-1 bg-brand-primary rounded-full mt-5 group-hover:w-20 transition-all duration-300" />
    </div>
  );
};

export const Statistics: React.FC = () => {
  const { isTamil } = useLanguage();
  const { statistics } = useAdminData();
  const [inView, setInView] = useState(() => prefersReducedMotion());

  const sectionRef = useRef<HTMLElement | null>(null);
  const gridRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (!gridRef.current || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const cards = gridRef.current?.children;
      if (cards && cards.length > 0) {
        gsap.set(cards, { opacity: 0, y: 35 });
        gsap.to(cards, {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.12,
          ease: EASING.cinematic,
          scrollTrigger: {
            trigger: gridRef.current,
            start: 'top 82%',
            once: true,
            onEnter: () => setInView(true),
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [statistics]);

  return (
    <section ref={sectionRef} id="stats" className="py-20 sm:py-28 bg-theme-bg/60 relative overflow-hidden">
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

        <div
          ref={gridRef}
          className="grid gap-6 sm:gap-8"
          style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))' }}
        >
          {statistics.map((stat) => (
            <StatCard
              key={stat.id}
              stat={stat}
              inView={inView}
              isTamil={isTamil}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
