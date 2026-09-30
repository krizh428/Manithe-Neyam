import React, { useLayoutEffect, useRef } from 'react';
import { gsap, fadeUp, prefersReducedMotion } from '../../animations';

interface AnimatedSectionProps {
  children: React.ReactNode;
  id?: string;
  className?: string;
  delay?: number;
  distance?: number;
}

export const AnimatedSection: React.FC<AnimatedSectionProps> = ({
  children,
  id,
  className = '',
  delay = 0,
  distance = 35,
}) => {
  const sectionRef = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    const el = sectionRef.current;
    if (!el || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      fadeUp(el, {
        trigger: el,
        delay,
        distance,
        start: 'top 88%',
        once: true,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [delay, distance]);

  return (
    <section id={id} ref={sectionRef} className={className}>
      {children}
    </section>
  );
};
