import React, { useLayoutEffect, useRef } from 'react';
import { gsap, fadeUp, prefersReducedMotion } from '../../animations';

interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  index?: number;
  distance?: number;
  onClick?: () => void;
}

export const AnimatedCard: React.FC<AnimatedCardProps> = ({
  children,
  className = '',
  delay = 0,
  index = 0,
  distance = 35,
  onClick,
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
        start: 'top 90%',
        once: true,
      });
    }, cardRef);

    return () => ctx.revert();
  }, [delay, index, distance]);

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      className={`tech-card transition-all duration-300 ${className}`}
    >
      {children}
    </div>
  );
};
