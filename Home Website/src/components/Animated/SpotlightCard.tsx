import React, { useRef, useLayoutEffect } from 'react';
import { gsap, fadeUp, prefersReducedMotion } from '../../animations';

interface SpotlightCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  index?: number;
  distance?: number;
  onClick?: () => void;
  spotlightColor?: string;
}

export const SpotlightCard: React.FC<SpotlightCardProps> = ({
  children,
  className = '',
  delay = 0,
  index = 0,
  distance = 35,
  onClick,
  spotlightColor = 'rgba(15, 23, 42, 0.05)',
}) => {
  const cardRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const el = cardRef.current;
    if (!el || prefersReducedMotion()) return;

    const calculatedDelay = delay + index * 0.08;

    const ctx = gsap.context(() => {
      fadeUp(el, {
        trigger: el,
        delay: calculatedDelay,
        distance,
        start: 'top 88%',
        once: true,
      });
    }, cardRef);

    return () => ctx.revert();
  }, [delay, index, distance]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion() || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    cardRef.current.style.setProperty('--mouse-x', `${x}px`);
    cardRef.current.style.setProperty('--mouse-y', `${y}px`);
  };

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      className={`relative group tech-card transition-all duration-300 overflow-hidden hover:-translate-y-1.5 ${className}`}
      style={{
        // @ts-expect-error custom CSS variable
        '--spotlight-color': spotlightColor,
      }}
    >
      {/* Smart Hover Radial Light */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-px rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(400px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), var(--spotlight-color), transparent 80%)`,
        }}
      />

      <div className="relative z-10 w-full h-full flex flex-col justify-between">
        {children}
      </div>
    </div>
  );
};
