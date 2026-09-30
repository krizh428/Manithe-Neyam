import React, { useLayoutEffect, useRef } from 'react';
import {
  GraduationCap,
  Utensils,
  HeartPulse,
  Shirt,
  HeartHandshake,
  Users,
  Sparkles,
  Dumbbell,
  Flower2,
  Palette,
  Droplets,
  Compass,
  Star,
} from 'lucide-react';
import { SectionHeading } from '../components/Common/SectionHeading';
import { useLanguage } from '../context/LanguageContext';
import { useAdminData } from '../context/AdminDataContext';
import { gsap, EASING, prefersReducedMotion } from '../animations';

export const Services: React.FC = () => {
  const { isTamil } = useLanguage();
  const { services } = useAdminData();

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
          stagger: 0.1,
          ease: EASING.cinematic,
          scrollTrigger: {
            trigger: gridRef.current,
            start: 'top 82%',
            once: true,
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [services]);

  const getIcon = (name: string) => {
    switch (name) {
      case 'GraduationCap':
        return <GraduationCap className="w-7 h-7" />;
      case 'Utensils':
        return <Utensils className="w-7 h-7" />;
      case 'HeartPulse':
        return <HeartPulse className="w-7 h-7" />;
      case 'Shirt':
        return <Shirt className="w-7 h-7" />;
      case 'HeartHandshake':
        return <HeartHandshake className="w-7 h-7" />;
      case 'Users':
        return <Users className="w-7 h-7" />;
      case 'Dumbbell':
        return <Dumbbell className="w-7 h-7" />;
      case 'Flower2':
        return <Flower2 className="w-7 h-7" />;
      case 'Palette':
        return <Palette className="w-7 h-7" />;
      case 'Droplets':
        return <Droplets className="w-7 h-7" />;
      case 'Compass':
        return <Compass className="w-7 h-7" />;
      case 'Star':
        return <Star className="w-7 h-7" />;
      default:
        return <Sparkles className="w-7 h-7" />;
    }
  };

  return (
    <section ref={sectionRef} id="services" className="py-20 sm:py-28 bg-theme-bg relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeading
          badge={isTamil ? 'நமது பணிகள்' : 'What We Do'}
          title={isTamil ? 'எங்கள் சேவைகள்' : 'Our Humanitarian Services'}
          subtitle={
            isTamil
              ? 'குழந்தைகளின் எதிர்காலம், முதியோரின் ஆரோக்கியம் மற்றும் சமூகத்தின் வளர்ச்சிக்கான முழுமையான மனிதநேய சேவைகள்.'
              : 'Holistic care covering education, healthcare, nutrition, shelter, and community empowerment.'
          }
        />

        {/* Services Grid with GSAP Entrance and Interactive Cards */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
        >
          {services.map((service) => (
            <div
              key={service.id}
              className="p-7 sm:p-8 rounded-3xl bg-theme-card hover:bg-brand-bg/40 border border-theme-border hover:border-brand-primary shadow-xs hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1.5 spotlight-card relative"
            >
              <div>
                {/* Icon Container with Accent & Scale Animation */}
                <div className="w-14 h-14 rounded-2xl bg-brand-bg border border-theme-border shadow-xs flex items-center justify-center mb-6 group-hover:scale-110 text-brand-primary transition-transform duration-300">
                  <div className="transition-colors">
                    {getIcon(service.iconName)}
                  </div>
                </div>

                <h3 className="text-xl sm:text-2xl font-extrabold text-card-heading group-hover:text-brand-primary transition-colors mb-3">
                  {isTamil ? service.titleTa : service.titleEn}
                </h3>

                <p className="text-sm sm:text-base text-card-text leading-relaxed mb-4">
                  {isTamil ? service.descTa : service.descEn}
                </p>
              </div>

              <div className="pt-4 border-t border-theme-border/70 space-y-2">
                <div className="flex justify-between items-center text-[11px] sm:text-xs">
                  <span className="font-bold text-card-text-secondary bg-theme-bg px-2.5 py-1 rounded-lg border border-theme-border/50">
                    {isTamil ? service.whyTa : service.whyEn}
                  </span>
                  <span className="font-bold text-card-text-secondary bg-theme-bg px-2.5 py-1 rounded-lg border border-theme-border/50">
                    {isTamil ? service.whenTa : service.whenEn}
                  </span>
                </div>
                <div className="flex justify-between items-center text-[10px] sm:text-[11px] text-card-text-muted">
                  <p className="italic">
                    {isTamil ? service.longDescTa : service.longDescEn}
                  </p>
                  <span className="font-bold text-card-text-muted">
                    {isTamil ? service.dateTa : service.dateEn}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
