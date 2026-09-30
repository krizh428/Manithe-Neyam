import { gsap, EASING, prefersReducedMotion } from './config';

export interface FadeInOptions {
  trigger?: Element | string;
  delay?: number;
  duration?: number;
  ease?: string;
  start?: string;
  once?: boolean;
}

export const fadeIn = (
  target: gsap.TweenTarget,
  options: FadeInOptions = {}
): gsap.core.Tween | null => {
  if (prefersReducedMotion()) {
    gsap.set(target, { opacity: 1 });
    return null;
  }

  const {
    trigger,
    delay = 0,
    duration = 0.65,
    ease = EASING.smooth,
    start = 'top 85%',
    once = true,
  } = options;

  gsap.set(target, { opacity: 0 });

  return gsap.to(target, {
    opacity: 1,
    duration,
    delay,
    ease,
    scrollTrigger: trigger
      ? {
          trigger: trigger,
          start,
          once,
        }
      : undefined,
  });
};
