import React, { useEffect, useRef, useState } from 'react';
import { SITE_BRAND } from '../../data/siteData';
import { gsap, EASING, prefersReducedMotion } from '../../animations';

interface PreloaderProps {
  onComplete?: () => void;
  onTransitionToTree?: () => void;
}

export const Preloader: React.FC<PreloaderProps> = ({ onComplete, onTransitionToTree }) => {
  const [visible, setVisible] = useState(() => {
    if (typeof window !== 'undefined') {
      return !sessionStorage.getItem('mn_preloader_seen');
    }
    return true;
  });

  const overlayRef = useRef<HTMLDivElement | null>(null);
  const logoWrapperRef = useRef<HTMLDivElement | null>(null);
  const textGroupRef = useRef<HTMLDivElement | null>(null);
  const barRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!visible) {
      if (onComplete) onComplete();
      return;
    }

    if (prefersReducedMotion()) {
      setVisible(false);
      sessionStorage.setItem('mn_preloader_seen', 'true');
      if (onComplete) onComplete();
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          setVisible(false);
          sessionStorage.setItem('mn_preloader_seen', 'true');
          if (onComplete) onComplete();
        },
      });

      // 1. Initial State
      gsap.set(logoWrapperRef.current, { scale: 0.85, opacity: 0 });
      gsap.set(textGroupRef.current, { opacity: 0, y: 12 });
      gsap.set(barRef.current, { scaleX: 0, transformOrigin: 'left center' });

      // 2. Entrance sequence
      tl.to(logoWrapperRef.current, {
        scale: 1,
        opacity: 1,
        duration: 0.65,
        ease: EASING.cinematic,
      })
        .to(
          textGroupRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: EASING.smooth,
          },
          '-=0.3'
        )
        .to(
          barRef.current,
          {
            scaleX: 1,
            duration: 0.85,
            ease: 'power2.inOut',
          },
          '-=0.2'
        )
        // 3. Pause briefly for branding
        .to({}, { duration: 0.25 })
        // 4. Smooth Exit: text & bar dissolve away
        .to([textGroupRef.current, barRef.current], {
          opacity: 0,
          y: -10,
          duration: 0.35,
          ease: EASING.smooth,
        });

      if (onTransitionToTree) {
        // Smooth cinematic handoff to Organization Tree
        tl.call(() => {
          sessionStorage.setItem('mn_preloader_seen', 'true');
          onTransitionToTree();
          setVisible(false);
        });
      } else {
        // Standard preloader exit
        tl.to(
          logoWrapperRef.current,
          {
            scale: 1.05,
            opacity: 0,
            duration: 0.45,
            ease: EASING.cinematic,
          },
          '-=0.2'
        ).to(
          overlayRef.current,
          {
            opacity: 0,
            scale: 1.02,
            duration: 0.5,
            ease: EASING.smooth,
          },
          '-=0.25'
        );
      }
    });

    return () => ctx.revert();
  }, [visible, onComplete, onTransitionToTree]);

  if (!visible) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-theme-bg px-4 text-center select-none"
    >
      {/* Central Logo Emblem */}
      <div ref={logoWrapperRef} className="relative mb-6">
        <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-theme-bg shadow-card p-2 border-2 border-theme-border/20 flex items-center justify-center">
          <img
            src="/logo.png"
            alt="Manithaneyam Logo"
            className="w-full h-full object-contain"
          />
        </div>
        <div className="absolute -inset-2 rounded-full border border-dashed border-theme-border opacity-70 pointer-events-none animate-spin" style={{ animationDuration: '10s' }} />
      </div>

      {/* Titles */}
      <div ref={textGroupRef} className="flex flex-col items-center">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-theme-text tracking-tight font-tamil">
          {SITE_BRAND.fullNameTa}
        </h1>

        <p className="text-xs sm:text-sm font-medium text-theme-text mt-1 font-english tracking-wider uppercase">
          {SITE_BRAND.nameEn}
        </p>

        <p className="text-xs text-theme-text/80 mt-1 font-tamil font-medium">
          {SITE_BRAND.locationBriefTa}
        </p>
      </div>

      {/* Expanding Ochre Indicator Line */}
      <div className="w-36 sm:w-48 h-1 bg-theme-border/30 rounded-full overflow-hidden mt-6">
        <div
          ref={barRef}
          className="w-full h-full bg-gradient-to-r from-brand-primary via-brand-hover to-theme-border rounded-full"
        />
      </div>
    </div>
  );
};
