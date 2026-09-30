import { gsap, prefersReducedMotion } from './config';

export interface ParallaxOptions {
  speed?: number; // e.g. 0.15 for subtle background movement
  trigger?: Element | string;
  start?: string;
  end?: string;
}

export const parallax = (
  target: gsap.TweenTarget,
  options: ParallaxOptions = {}
): gsap.core.Tween | null => {
  if (prefersReducedMotion()) {
    gsap.set(target, { y: 0 });
    return null;
  }

  const {
    speed = 0.2,
    trigger = target as Element,
    start = 'top bottom',
    end = 'bottom top',
  } = options;

  const distance = speed * 100;

  return gsap.fromTo(
    target,
    { y: -distance / 2 },
    {
      y: distance / 2,
      ease: 'none',
      scrollTrigger: {
        trigger: trigger as Element,
        start,
        end,
        scrub: true,
      },
    }
  );
};
