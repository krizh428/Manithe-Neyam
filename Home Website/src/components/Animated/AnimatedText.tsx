import React, { useLayoutEffect, useRef } from 'react';
import { gsap, EASING, prefersReducedMotion } from '../../animations';

interface AnimatedTextProps {
  text: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div';
  className?: string;
  delay?: number;
  duration?: number;
  stagger?: number;
  mode?: 'words' | 'lines' | 'fade';
  triggerOnce?: boolean;
}

export const AnimatedText: React.FC<AnimatedTextProps> = ({
  text,
  as: Component = 'h2',
  className = '',
  delay = 0,
  duration = 0.75,
  stagger = 0.05,
  mode = 'words',
  triggerOnce = true,
}) => {
  const containerRef = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    if (!containerRef.current || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const parts = containerRef.current?.querySelectorAll('[data-reveal-word]');
      if (parts && parts.length > 0) {
        gsap.set(parts, { opacity: 0, y: 28 });

        gsap.to(parts, {
          opacity: 1,
          y: 0,
          duration,
          delay,
          stagger,
          ease: EASING.cinematic,
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 88%',
            once: triggerOnce,
          },
        });
      } else {
        gsap.set(containerRef.current, { opacity: 0, y: 24 });
        gsap.to(containerRef.current, {
          opacity: 1,
          y: 0,
          duration,
          delay,
          ease: EASING.medium,
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 88%',
            once: triggerOnce,
          },
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, [text, delay, duration, stagger, triggerOnce]);

  const words = text.split(' ');

  return (
    // @ts-expect-error dynamic component type
    <Component ref={containerRef} className={className}>
      {/* Screen-reader full uninterrupted text */}
      <span className="sr-only">{text}</span>

      {/* Visual animated words/lines */}
      <span aria-hidden="true" className="inline-block">
        {mode === 'words' ? (
          words.map((word, idx) => (
            <span key={idx} className="inline-block overflow-hidden mr-[0.28em] align-top">
              <span data-reveal-word className="inline-block will-change-transform">
                {word}
              </span>
            </span>
          ))
        ) : (
          <span data-reveal-word className="inline-block will-change-transform">
            {text}
          </span>
        )}
      </span>
    </Component>
  );
};
