import React, { useLayoutEffect, useRef } from 'react';
import { gsap, EASING, prefersReducedMotion } from '../../animations';

interface SectionHeadingProps {
  badge?: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center' | 'right';
  className?: string;
  ochreAccent?: boolean;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  badge,
  title,
  subtitle,
  align = 'center',
  className = '',
  ochreAccent = false,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const badgeRef = useRef<HTMLDivElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const lineRef = useRef<HTMLDivElement | null>(null);
  const subtitleRef = useRef<HTMLParagraphElement | null>(null);

  useLayoutEffect(() => {
    if (!containerRef.current || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 85%',
          once: true,
        },
      });

      if (badgeRef.current) {
        gsap.set(badgeRef.current, { opacity: 0, scale: 0.92, y: 10 });
        tl.to(badgeRef.current, {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.5,
          ease: EASING.smooth,
        });
      }

      if (titleRef.current) {
        gsap.set(titleRef.current, { opacity: 0, y: 26 });
        tl.to(
          titleRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.65,
            ease: EASING.cinematic,
          },
          badgeRef.current ? '-=0.3' : '0'
        );
      }

      if (lineRef.current) {
        gsap.set(lineRef.current, { scaleX: 0, opacity: 0, transformOrigin: 'center center' });
        tl.to(
          lineRef.current,
          {
            scaleX: 1,
            opacity: 1,
            duration: 0.5,
            ease: EASING.medium,
          },
          '-=0.3'
        );
      }

      if (subtitleRef.current) {
        gsap.set(subtitleRef.current, { opacity: 0, y: 16 });
        tl.to(
          subtitleRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.55,
            ease: EASING.smooth,
          },
          '-=0.3'
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, [badge, title, subtitle]);

  const alignClass = {
    left: 'text-left items-start',
    center: 'text-center items-center',
    right: 'text-right items-end',
  }[align];

  return (
    <div
      ref={containerRef}
      className={`flex flex-col ${alignClass} mb-12 sm:mb-16 ${className}`}
    >
      {badge && (
        <div
          ref={badgeRef}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full pill-badge text-xs sm:text-sm font-bold mb-3.5 shadow-xs cursor-default select-none"
        >
          <span className="w-2 h-2 rounded-full pill-badge-dot animate-pulse" />
          <span className="pill-badge-text">{badge}</span>
        </div>
      )}

      <h2
        ref={titleRef}
        className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-heading-accent tracking-tight leading-tight"
      >
        {title}
      </h2>

      {/* Decorative Brand Accent Line */}
      <div
        ref={lineRef}
        className={`flex items-center gap-2 mt-3.5 mb-4 ${
          align === 'center'
            ? 'justify-center'
            : align === 'right'
            ? 'justify-end'
            : 'justify-start'
        }`}
      >
        <div className="w-10 sm:w-14 h-1 bg-brand-primary rounded-full" />
        <div
          className={`w-3 h-3 rounded-full ${
            ochreAccent ? 'bg-brand-primary' : 'bg-brand-hover'
          } rotate-45`}
        />
        <div className="w-6 sm:w-8 h-1 bg-brand-primary/60 rounded-full" />
      </div>

      {subtitle && (
        <p
          ref={subtitleRef}
          className="max-w-2xl text-base sm:text-lg text-theme-text leading-relaxed font-normal"
        >
          {subtitle}
        </p>
      )}
    </div>
  );
};
