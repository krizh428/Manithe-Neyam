import React, { useRef } from 'react';
import { gsap, prefersReducedMotion } from '../../animations';

interface MagneticProps {
  children: React.ReactElement;
  strength?: number; // e.g. 0.25
  radius?: number; // max pixels to displace
}

export const Magnetic: React.FC<MagneticProps> = ({
  children,
  strength = 0.22,
  radius = 12,
}) => {
  const ref = useRef<HTMLDivElement | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion() || !ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    const clampedX = Math.max(-radius, Math.min(radius, x * strength));
    const clampedY = Math.max(-radius, Math.min(radius, y * strength));

    gsap.to(ref.current, {
      x: clampedX,
      y: clampedY,
      duration: 0.35,
      ease: 'power2.out',
    });
  };

  const handleMouseLeave = () => {
    if (!ref.current) return;
    gsap.to(ref.current, {
      x: 0,
      y: 0,
      duration: 0.6,
      ease: 'elastic.out(1, 0.4)',
    });
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="inline-block"
    >
      {children}
    </div>
  );
};
