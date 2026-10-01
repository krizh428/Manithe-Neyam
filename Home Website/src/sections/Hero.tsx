import React, { useLayoutEffect, useRef } from 'react';
import { Heart, ArrowRight, ShieldCheck, Clock, Sparkles, MapPin } from 'lucide-react';
import { HERO_DATA } from '../data/siteData';
import { useLanguage } from '../context/LanguageContext';
import { useAdminData } from '../context/AdminDataContext';
import { IMAGES } from '../assets/images';
import { ImageUploader } from '../components/Admin/ImageUploader';
import { gsap, EASING, prefersReducedMotion } from '../animations';
import { AnimatedButton } from '../components/Animated/AnimatedButton';

interface HeroProps {
  onOpenSupport: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenSupport }) => {
  const { isTamil } = useLanguage();
  const { hero, brand, isAdmin, updateHero } = useAdminData();

  const heroRef = useRef<HTMLElement | null>(null);
  const badgeRef = useRef<HTMLDivElement | null>(null);
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const subtitleRef = useRef<HTMLParagraphElement | null>(null);
  const locationPillRef = useRef<HTMLDivElement | null>(null);
  const ctaGroupRef = useRef<HTMLDivElement | null>(null);
  const trustMarkersRef = useRef<HTMLDivElement | null>(null);
  const imageColumnRef = useRef<HTMLDivElement | null>(null);
  const floatingBadge1Ref = useRef<HTMLDivElement | null>(null);
  const floatingBadge2Ref = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.15 });

      // 1. Badge entrance
      if (badgeRef.current) {
        gsap.set(badgeRef.current, { opacity: 0, y: 14, scale: 0.95 });
        tl.to(badgeRef.current, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.55,
          ease: EASING.cinematic,
        });
      }

      // 2. Heading lines reveal
      const headingParts = headingRef.current?.querySelectorAll('[data-hero-part]');
      if (headingParts && headingParts.length > 0) {
        gsap.set(headingParts, { opacity: 0, y: 35 });
        tl.to(
          headingParts,
          {
            opacity: 1,
            y: 0,
            duration: 0.75,
            stagger: 0.12,
            ease: EASING.cinematic,
          },
          '-=0.3'
        );
      }

      // 3. Subtitle fade up
      if (subtitleRef.current) {
        gsap.set(subtitleRef.current, { opacity: 0, y: 20 });
        tl.to(
          subtitleRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: EASING.smooth,
          },
          '-=0.4'
        );
      }

      // 4. Location indicator
      if (locationPillRef.current) {
        gsap.set(locationPillRef.current, { opacity: 0, y: 16 });
        tl.to(
          locationPillRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: EASING.smooth,
          },
          '-=0.35'
        );
      }

      // 5. CTA buttons stagger
      if (ctaGroupRef.current) {
        gsap.set(ctaGroupRef.current.children, { opacity: 0, y: 20 });
        tl.to(
          ctaGroupRef.current.children,
          {
            opacity: 1,
            y: 0,
            duration: 0.55,
            stagger: 0.1,
            ease: EASING.medium,
          },
          '-=0.35'
        );
      }

      // 6. Trust markers
      if (trustMarkersRef.current) {
        gsap.set(trustMarkersRef.current, { opacity: 0, y: 15 });
        tl.to(
          trustMarkersRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: EASING.smooth,
          },
          '-=0.2'
        );
      }

      // 7. Right Hero Image & Frame entrance
      if (imageColumnRef.current) {
        gsap.set(imageColumnRef.current, { opacity: 0, scale: 0.94 });
        tl.to(
          imageColumnRef.current,
          {
            opacity: 1,
            scale: 1,
            duration: 0.85,
            ease: EASING.cinematic,
          },
          '-=0.7'
        );
      }

      // 8. Floating info badges bloom in
      if (floatingBadge1Ref.current && floatingBadge2Ref.current) {
        gsap.set([floatingBadge1Ref.current, floatingBadge2Ref.current], {
          opacity: 0,
          scale: 0.85,
          y: 12,
        });
        tl.to(
          [floatingBadge1Ref.current, floatingBadge2Ref.current],
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.15,
            ease: 'back.out(1.5)',
          },
          '-=0.3'
        );
      }

      // Scroll Parallax on Hero Image Container
      if (imageColumnRef.current) {
        gsap.to(imageColumnRef.current, {
          y: 35,
          ease: 'none',
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 1.2,
          },
        });
      }
    }, heroRef);

    return () => ctx.revert();
  }, [hero.titleTa, hero.titleEn]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 80;
      const elPosition = el.getBoundingClientRect().top;
      const offsetPosition = elPosition + window.pageYOffset - offset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  const titleSplit = (isTamil ? hero.titleTa : hero.titleEn).split('—');

  return (
    <section
      ref={heroRef}
      id="hero"
      className="relative min-h-[92vh] pt-28 pb-16 sm:pt-36 sm:pb-24 flex items-center justify-center overflow-hidden bg-gradient-to-b from-theme-bg via-transparent to-theme-secondary"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Editorial Heading & Content */}
          <div className="lg:col-span-7 flex flex-col items-start">
            {/* Humanitarian Trust Badge */}
            <div
              ref={badgeRef}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full pill-badge text-xs sm:text-sm font-bold mb-6 shadow-xs cursor-default select-none"
            >
              <span className="w-2 h-2 rounded-full pill-badge-dot animate-ping" />
              <Sparkles className="w-3.5 h-3.5 pill-badge-icon" />
              <span className="pill-badge-text">{isTamil ? HERO_DATA.badgeTa : HERO_DATA.badgeEn}</span>
            </div>

            {/* Main Hero Heading */}
            <h1
              ref={headingRef}
              className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-heading-accent tracking-tight leading-[1.2] mb-6 font-tamil"
            >
              <span data-hero-part className="block text-heading-accent">
                {titleSplit[0]}
              </span>
              {titleSplit.length > 1 && (
                <span
                  data-hero-part
                  className="block mt-1 text-2xl sm:text-3xl lg:text-4xl text-heading-accent/90"
                >
                  — {titleSplit[1]}
                </span>
              )}
            </h1>

            {/* Subtitle */}
            <p
              ref={subtitleRef}
              className="text-base sm:text-lg lg:text-xl text-theme-text leading-relaxed mb-8 max-w-2xl font-normal"
            >
              {isTamil ? hero.subtitleTa : hero.subtitleEn}
            </p>

            {/* Location & Quick Contact Indicator */}
            <div
              ref={locationPillRef}
              className="flex flex-wrap items-center gap-3 mb-8 text-xs sm:text-sm text-theme-text font-bold bg-theme-bg px-4 py-2 rounded-xl border border-theme-border shadow-xs"
            >
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-brand-primary" />
                <span>{isTamil ? hero.locationTa : hero.locationEn}</span>
              </span>
              <span>•</span>
              <a
                href={`tel:${brand.phone1.replace(/\s+/g, '')}`}
                className="hover:underline text-theme-text hover:text-brand-primary transition-colors"
              >
                📞 {brand.phone1}
              </a>
            </div>

            {/* CTA Buttons */}
            <div
              ref={ctaGroupRef}
              className="flex flex-wrap items-center gap-4 w-full sm:w-auto"
            >
              <AnimatedButton
                onClick={() => scrollToSection('about')}
                className="px-7 py-3.5 bg-brand-primary text-on-primary"
              >
                <span>{isTamil ? HERO_DATA.ctaAboutTa : HERO_DATA.ctaAboutEn}</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </AnimatedButton>

              <AnimatedButton
                variant="secondary"
                onClick={() => scrollToSection('locations')}
                className="px-6 py-3.5"
              >
                <span>{isTamil ? '3 இல்லங்கள்' : '3 Care Homes'}</span>
              </AnimatedButton>

              <AnimatedButton
                variant="heart"
                onClick={onOpenSupport}
                className="px-6 py-3.5"
              >
                <Heart className="w-4 h-4 text-red-500 fill-red-500 transition-transform group-hover:scale-110" />
                <span>{isTamil ? HERO_DATA.ctaSupportTa : HERO_DATA.ctaSupportEn}</span>
              </AnimatedButton>
            </div>

            {/* Trust Markers */}
            <div
              ref={trustMarkersRef}
              className="mt-10 pt-6 border-t border-theme-border/80 flex flex-wrap items-center gap-6 text-xs sm:text-sm text-theme-text"
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-brand-primary" />
                <span>
                  {isTamil ? 'அங்கீகரிக்கப்பட்ட தொண்டு இல்லம்' : 'Registered Humanitarian Home'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-brand-primary" />
                <span>
                  {isTamil ? '25+ ஆண்டுகள் தொடர் அர்ப்பணிப்பு' : '25+ Years of Dedicated Service'}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Asymmetric Organic Frame + Floating Info Badges */}
          <div
            ref={imageColumnRef}
            className="lg:col-span-5 relative flex items-center justify-center will-change-transform"
          >
            {/* Decorative Organic Shape in Background */}
            <div className="absolute -inset-4 bg-gradient-to-tr from-brand-primary/10 via-theme-secondary/40 to-transparent rounded-[50px] transform -rotate-3 blur-md pointer-events-none" />
            <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full bg-brand-primary/15 blur-xl pointer-events-none" />

            {/* Animated Hero Image */}
            <div className="relative w-full max-w-md lg:max-w-none aspect-[4/3.8] flex items-center justify-center z-10">
              <ImageUploader
                currentImageUrl={
                  hero.image && hero.image !== IMAGES.hero ? hero.image : '/hero-image.png'
                }
                onUploadComplete={(newUrl) => updateHero({ image: newUrl })}
                isAdmin={isAdmin}
                className="w-full h-full drop-shadow-2xl"
                imgClassName="w-full h-full object-contain"
                alt="Manithaneyam Home Care"
              />
            </div>

            {/* Floating Info Badge 1 - Safe Environment (Top Right) */}
            <div
              ref={floatingBadge1Ref}
              className="absolute -top-4 -right-4 sm:-right-6 bg-theme-card/95 backdrop-blur-md p-3.5 rounded-2xl shadow-card hover:shadow-hover border border-theme-border flex items-center gap-3 z-20 transition-transform duration-300 hover:scale-105"
            >
              <div className="w-10 h-10 rounded-xl bg-theme-bg border border-theme-border/40 flex items-center justify-center text-theme-text shrink-0">
                <Heart className="w-5 h-5 text-red-500 fill-red-500 animate-pulse" />
              </div>
              <div>
                <p className="text-xs font-bold text-card-heading">
                  {isTamil ? HERO_DATA.floatingCard1.titleTa : HERO_DATA.floatingCard1.titleEn}
                </p>
                <p className="text-[11px] font-extrabold text-card-text-secondary">
                  {HERO_DATA.floatingCard1.number} {isTamil ? 'பாதுகாப்பு' : 'Protection'}
                </p>
              </div>
            </div>

            {/* Floating Info Badge 2 - Continuous Medical Care (Bottom Left) */}
            <div
              ref={floatingBadge2Ref}
              className="absolute -bottom-5 -left-4 sm:-left-6 bg-theme-card/95 backdrop-blur-md p-3.5 rounded-2xl shadow-card hover:shadow-hover border border-theme-border flex items-center gap-3 z-20 transition-transform duration-300 hover:scale-105"
            >
              <div className="w-10 h-10 rounded-xl bg-brand-bg text-brand-primary flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-card-heading">
                  {isTamil ? HERO_DATA.floatingCard2.titleTa : HERO_DATA.floatingCard2.titleEn}
                </p>
                <p className="text-[11px] font-bold text-card-text-secondary">
                  {isTamil ? 'உணவு & சுகாதாரம்' : 'Nutritious & Healthcare'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
