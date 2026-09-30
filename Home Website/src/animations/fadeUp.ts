import { gsap, EASING, prefersReducedMotion } from './config';

export interface FadeUpOptions {
  trigger?: Element | string;
  delay?: number;
  duration?: number;
  distance?: number;
  ease?: string;
  start?: string;
  once?: boolean;
}

export const fadeUp = (
  target: gsap.TweenTarget,
  options: FadeUpOptions = {}
): gsap.core.Tween | null => {
  if (prefersReducedMotion()) {
    gsap.set(target, { opacity: 1, y: 0 });
    return null;
  }

  const {
    trigger,
    delay = 0,
    duration = 0.75,
    distance = 36,
    ease = EASING.medium,
    start = 'top 85%',
    once = true,
  } = options;

  gsap.set(target, { opacity: 0, y: distance });

  const tween = gsap.to(target, {
    opacity: 1,
    y: 0,
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

  return tween;
};
