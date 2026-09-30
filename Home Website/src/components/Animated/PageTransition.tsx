import React, { useLayoutEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { gsap, EASING, prefersReducedMotion } from '../../animations';

interface PageTransitionProps {
  children: React.ReactNode;
}

export const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const location = useLocation();
  const elRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (!elRef.current || prefersReducedMotion()) return;

    // Soft entrance transition on route change
    gsap.fromTo(
      elRef.current,
      { opacity: 0, y: 16 },
      {
        opacity: 1,
        y: 0,
        duration: 0.45,
        ease: EASING.medium,
        clearProps: 'all',
      }
    );
  }, [location.pathname]);

  return (
    <div ref={elRef} className="w-full flex-grow flex flex-col">
      {children}
    </div>
  );
};
