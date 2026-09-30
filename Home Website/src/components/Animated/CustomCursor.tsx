import React, { useEffect, useRef, useState } from 'react';
import { gsap, prefersReducedMotion } from '../../animations';

export const CustomCursor: React.FC = () => {
  const [cursorText, setCursorText] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Disable on touch devices or if reduced motion is requested
    const isTouch =
      typeof window !== 'undefined' &&
      (window.matchMedia('(pointer: coarse)').matches ||
        !window.matchMedia('(hover: hover)').matches);

    if (isTouch || prefersReducedMotion()) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    // Initialize cursor off-screen to prevent (0, 0) ghost circle on load
    gsap.set([dot, ring], { x: -100, y: -100 });

    // Use GSAP quickTo for high-performance 60fps tracking
    const xDot = gsap.quickTo(dot, 'x', { duration: 0.1, ease: 'power3' });
    const yDot = gsap.quickTo(dot, 'y', { duration: 0.1, ease: 'power3' });
    const xRing = gsap.quickTo(ring, 'x', { duration: 0.35, ease: 'power2.out' });
    const yRing = gsap.quickTo(ring, 'y', { duration: 0.35, ease: 'power2.out' });

    const handleMouseMove = (e: MouseEvent) => {
      setIsVisible(true);
      xDot(e.clientX);
      yDot(e.clientY);
      xRing(e.clientX);
      yRing(e.clientY);

      const target = e.target as HTMLElement | null;
      if (!target) return;

      // Smart Hover Light tracking for .spotlight-card
      const spotlightCard = target.closest('.spotlight-card') as HTMLElement | null;
      if (spotlightCard) {
        const rect = spotlightCard.getBoundingClientRect();
        spotlightCard.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
        spotlightCard.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
      }

      // Check for custom cursor targets
      const cursorTarget = target.closest('[data-cursor]') as HTMLElement | null;
      if (cursorTarget) {
        const text = cursorTarget.getAttribute('data-cursor');
        setCursorText(text && text !== 'pointer' ? text : null);
        setIsHovered(true);
      } else {
        const isInteractive = target.closest('button, a, input, select, textarea, [role="button"]');
        setIsHovered(!!isInteractive);
        setCursorText(null);
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 pointer-events-none z-[9999] transition-opacity duration-300 hidden md:block ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Central Cursor Dot */}
      <div
        ref={dotRef}
        style={{ transform: 'translate(-100px, -100px)' }}
        className={`fixed top-0 left-0 w-2.5 h-2.5 -ml-[5px] -mt-[5px] rounded-full bg-brand-primary pointer-events-none transition-transform duration-150 ${
          isHovered ? 'scale-0' : 'scale-100'
        }`}
      />

      {/* Trailing Ring / Pill Capsule */}
      <div
        ref={ringRef}
        style={{ transform: 'translate(-100px, -100px)' }}
        className={`fixed top-0 left-0 flex items-center justify-center pointer-events-none transition-all duration-300 ease-out ${
          cursorText
            ? 'w-auto px-3.5 py-1.5 -ml-8 -mt-5 rounded-full bg-brand-primary text-on-primary text-[10px] font-extrabold uppercase tracking-widest shadow-card'
            : isHovered
            ? 'w-10 h-10 -ml-5 -mt-5 rounded-full border-2 border-brand-primary bg-brand-primary/10 shadow-xs'
            : 'w-7 h-7 -ml-3.5 -mt-3.5 rounded-full border border-brand-primary/40 bg-transparent'
        }`}
      >
        {cursorText && <span className="whitespace-nowrap">{cursorText}</span>}
      </div>
    </div>
  );
};
