import React, { useLayoutEffect, useRef } from 'react';
import { gsap, prefersReducedMotion } from '../../animations';

interface SectionDividerProps {
  variant?: 'curve' | 'wave' | 'slope';
  className?: string;
  flip?: boolean;
}

export const SectionDivider: React.FC<SectionDividerProps> = ({
  variant = 'curve',
  className = '',
  flip = false,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useLayoutEffect(() => {
    if (!svgRef.current || prefersReducedMotion()) return;

    const path = svgRef.current.querySelector('path');
    if (!path) return;

    const length = path.getTotalLength ? path.getTotalLength() : 400;
    gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });

    const ctx = gsap.context(() => {
      gsap.to(path, {
        strokeDashoffset: 0,
        duration: 1.4,
        ease: 'power2.inOut',
        scrollTrigger: {
          trigger: svgRef.current,
          start: 'top 92%',
          once: true,
        },
      });
    }, svgRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      aria-hidden="true"
      className={`w-full overflow-hidden leading-none pointer-events-none select-none my-2 opacity-35 ${
        flip ? 'rotate-180' : ''
      } ${className}`}
    >
      <svg
        ref={svgRef}
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        className="relative block w-full h-8 sm:h-12"
      >
        {variant === 'curve' && (
          <path
            d="M0,0 C300,90 900,90 1200,0"
            fill="none"
            className="stroke-brand-primary/40"
            strokeWidth="2"
          />
        )}
        {variant === 'wave' && (
          <path
            d="M0,40 C150,90 350,-10 500,40 C650,90 850,-10 1000,40 C1100,60 1150,50 1200,40"
            fill="none"
            className="stroke-brand-primary/40"
            strokeWidth="2"
          />
        )}
        {variant === 'slope' && (
          <path
            d="M0,80 L600,20 L1200,80"
            fill="none"
            className="stroke-brand-primary/40"
            strokeWidth="2"
          />
        )}
      </svg>
    </div>
  );
};
