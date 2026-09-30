import React, { useLayoutEffect, useRef } from 'react';
import { Heart, PhoneCall, Sparkles } from 'lucide-react';
import { CTA_DATA } from '../data/siteData';
import { useLanguage } from '../context/LanguageContext';
import { gsap, EASING, prefersReducedMotion } from '../animations';
import { AnimatedButton } from '../components/Animated/AnimatedButton';

interface CallToActionProps {
  onOpenSupport: () => void;
}

export const CallToAction: React.FC<CallToActionProps> = ({ onOpenSupport }) => {
  const { isTamil } = useLanguage();

  const sectionRef = useRef<HTMLElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (!cardRef.current || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.set(cardRef.current, { opacity: 0, scale: 0.94, y: 35 });
      gsap.to(cardRef.current, {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.85,
        ease: EASING.cinematic,
        scrollTrigger: {
          trigger: cardRef.current,
          start: 'top 85%',
          once: true,
        },
      });

      const elements = contentRef.current?.children;
      if (elements && elements.length > 0) {
        gsap.set(elements, { opacity: 0, y: 20 });
        gsap.to(elements, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          delay: 0.2,
          ease: EASING.smooth,
          scrollTrigger: {
            trigger: cardRef.current,
            start: 'top 85%',
            once: true,
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

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
    <section ref={sectionRef} className="py-20 sm:py-28 bg-theme-bg relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div
          ref={cardRef}
          className="relative rounded-[36px] bg-gradient-to-br from-brand-bg via-theme-card to-brand-bg text-card-heading p-8 sm:p-14 lg:p-16 shadow-card hover:shadow-hover overflow-hidden border-2 border-brand-primary/20 transition-all duration-300"
        >
          {/* Decorative Radial Lighting */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-primary/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-brand-primary/8 rounded-full blur-2xl pointer-events-none" />

          <div
            ref={contentRef}
            className="relative z-10 max-w-3xl mx-auto text-center flex flex-col items-center"
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-theme-card/80 backdrop-blur-md border border-brand-primary/40 text-xs sm:text-sm font-bold text-brand-primary mb-6">
              <Sparkles className="w-4 h-4" />
              <span>{isTamil ? CTA_DATA.badgeTa : CTA_DATA.badgeEn}</span>
            </div>

            {/* Title */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight mb-6 font-tamil text-card-heading">
              {isTamil ? CTA_DATA.titleTa : CTA_DATA.titleEn}
            </h2>

            {/* Description */}
            <p className="text-base sm:text-lg text-card-text leading-relaxed mb-10 max-w-2xl font-normal">
              {isTamil ? CTA_DATA.descTa : CTA_DATA.descEn}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4 w-full sm:w-auto">
              <AnimatedButton
                onClick={onOpenSupport}
                className="w-full sm:w-auto px-8 py-4 bg-brand-primary text-on-primary font-extrabold"
              >
                <Heart className="w-5 h-5 text-red-500 fill-red-500 animate-pulse" />
                <span>{isTamil ? CTA_DATA.btnSupportTa : CTA_DATA.btnSupportEn}</span>
              </AnimatedButton>

              <AnimatedButton
                variant="secondary"
                onClick={scrollToContact}
                className="w-full sm:w-auto px-8 py-4 border-2 border-brand-primary text-brand-primary"
              >
                <PhoneCall className="w-4 h-4" />
                <span>{isTamil ? CTA_DATA.btnContactTa : CTA_DATA.btnContactEn}</span>
              </AnimatedButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
