import React, { useLayoutEffect, useRef } from 'react';
import { Quote, Award, Heart } from 'lucide-react';
import { SectionHeading } from '../components/Common/SectionHeading';
import { useLanguage } from '../context/LanguageContext';
import { useAdminData } from '../context/AdminDataContext';
import { gsap, EASING, prefersReducedMotion } from '../animations';

export const Founder: React.FC = () => {
  const { isTamil } = useLanguage();
  const { founder: FOUNDER_DATA } = useAdminData();

  const sectionRef = useRef<HTMLElement | null>(null);
  const portraitRef = useRef<HTMLDivElement | null>(null);
  const badgeRef = useRef<HTMLDivElement | null>(null);
  const quoteBannerRef = useRef<HTMLDivElement | null>(null);
  const bioRef = useRef<HTMLDivElement | null>(null);
  const valuesRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (!sectionRef.current || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      // 1. Portrait entrance
      if (portraitRef.current) {
        gsap.set(portraitRef.current, { opacity: 0, scale: 0.94 });
        gsap.to(portraitRef.current, {
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: EASING.cinematic,
          scrollTrigger: {
            trigger: portraitRef.current,
            start: 'top 82%',
            once: true,
          },
        });
      }

      // 2. 25+ Years Legacy Badge
      if (badgeRef.current) {
        gsap.set(badgeRef.current, { opacity: 0, scale: 0.7, y: 12 });
        gsap.to(badgeRef.current, {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.6,
          delay: 0.3,
          ease: 'back.out(1.6)',
          scrollTrigger: {
            trigger: portraitRef.current,
            start: 'top 80%',
            once: true,
          },
        });
      }

      // 3. Quote banner slide up
      if (quoteBannerRef.current) {
        gsap.set(quoteBannerRef.current, { opacity: 0, y: 24 });
        gsap.to(quoteBannerRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.65,
          ease: EASING.medium,
          scrollTrigger: {
            trigger: quoteBannerRef.current,
            start: 'top 85%',
            once: true,
          },
        });
      }

      // 4. Bio paragraphs
      const paras = bioRef.current?.querySelectorAll('p');
      if (paras && paras.length > 0) {
        gsap.set(paras, { opacity: 0, y: 18 });
        gsap.to(paras, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.12,
          ease: EASING.smooth,
          scrollTrigger: {
            trigger: bioRef.current,
            start: 'top 85%',
            once: true,
          },
        });
      }

      // 5. Values pills
      const pills = valuesRef.current?.children;
      if (pills && pills.length > 0) {
        gsap.set(pills, { opacity: 0, scale: 0.9 });
        gsap.to(pills, {
          opacity: 1,
          scale: 1,
          duration: 0.45,
          stagger: 0.08,
          ease: EASING.smooth,
          scrollTrigger: {
            trigger: valuesRef.current,
            start: 'top 90%',
            once: true,
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [FOUNDER_DATA.nameTa, FOUNDER_DATA.nameEn]);

  return (
    <section ref={sectionRef} id="founder" className="py-20 sm:py-28 bg-theme-bg/40 relative overflow-hidden">
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

        <div className="bg-theme-card rounded-3xl border border-theme-border shadow-soft p-8 sm:p-12 lg:p-14 spotlight-card relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left: Dignified Founder Portrait with Organic Frame */}
            <div
              ref={portraitRef}
              className="lg:col-span-5 relative flex justify-center"
            >
              <div className="relative w-full max-w-sm aspect-[3.8/4.5] rounded-3xl overflow-hidden shadow-card hover:shadow-hover border-4 border-theme-border group">
                <img
                  src={FOUNDER_DATA.image}
                  alt={isTamil ? FOUNDER_DATA.nameTa : FOUNDER_DATA.nameEn}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                {/* Overlay Name on Image bottom */}
                <div className="absolute bottom-4 left-5 right-5 text-white">
                  <p className="text-xl font-extrabold font-tamil">
                    {isTamil ? FOUNDER_DATA.nameTa : FOUNDER_DATA.nameEn}
                  </p>
                  <p className="text-xs text-white/90 font-medium">
                    {isTamil ? FOUNDER_DATA.roleTa : FOUNDER_DATA.roleEn}
                  </p>
                </div>
              </div>

              {/* Decorative Badge */}
              <div
                ref={badgeRef}
                className="absolute -bottom-4 -right-2 sm:right-4 bg-theme-card text-card-heading p-3.5 rounded-2xl shadow-card hover:shadow-hover border-2 border-brand-primary flex items-center gap-2 z-20 transition-transform duration-300 hover:scale-105"
              >
                <Award className="w-5 h-5 text-brand-primary" />
                <span className="text-xs font-bold font-tamil">
                  {isTamil ? '25+ ஆண்டுகள் சேவை' : '25+ Years Legacy'}
                </span>
              </div>
            </div>

            {/* Right: Message & Bio */}
            <div className="lg:col-span-7 flex flex-col justify-center space-y-6">
              {/* Quote Banner */}
              <div
                ref={quoteBannerRef}
                className="bg-theme-bg p-6 sm:p-7 rounded-2xl border border-theme-border relative shadow-xs spotlight-card"
              >
                <Quote className="w-8 h-8 text-brand-primary/20 absolute top-4 right-4" />
                <p className="text-base sm:text-lg lg:text-xl font-bold text-theme-text leading-relaxed italic font-tamil">
                  "{isTamil ? FOUNDER_DATA.quoteTa : FOUNDER_DATA.quoteEn}"
                </p>
              </div>

              {/* Bio Paragraphs */}
              <div ref={bioRef} className="space-y-4 text-sm sm:text-base text-theme-text leading-relaxed">
                {(isTamil ? FOUNDER_DATA.bioTa : FOUNDER_DATA.bioEn).map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>

              {/* Values pill list */}
              <div ref={valuesRef} className="pt-3 flex flex-wrap gap-2">
                {[
                  { ta: 'அன்பு', en: 'Love' },
                  { ta: 'கருணை', en: 'Compassion' },
                  { ta: 'கல்வி', en: 'Education' },
                  { ta: 'பாதுகாப்பு', en: 'Protection' },
                  { ta: 'மரியாதை', en: 'Dignity' },
                ].map((val, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-theme-bg border border-theme-border text-xs font-bold text-theme-text shadow-xs hover:border-brand-primary transition-all duration-200 hover:-translate-y-0.5"
                  >
                    <Heart className="w-3 h-3 text-red-500 fill-red-500" />
                    <span>{isTamil ? val.ta : val.en}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
