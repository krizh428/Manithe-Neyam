import { gsap, EASING, TIMING, prefersReducedMotion } from './config';

export interface StaggerOptions {
  trigger?: Element | string;
  delay?: number;
  duration?: number;
  stagger?: number;
  distance?: number;
  ease?: string;
  start?: string;
  once?: boolean;
}

export const staggerChildren = (
  targets: gsap.TweenTarget,
  options: StaggerOptions = {}
): gsap.core.Tween | null => {
  if (prefersReducedMotion()) {
    gsap.set(targets, { opacity: 1, y: 0 });
    return null;
  }

  const {
    trigger,
    delay = 0,
    duration = 0.75,
    stagger = TIMING.cardStagger,
    distance = 40,
    ease = EASING.cinematic,
    start = 'top 85%',
    once = true,
  } = options;

  gsap.set(targets, { opacity: 0, y: distance });

  return gsap.to(targets, {
    opacity: 1,
    y: 0,
    duration,
    delay,
    stagger,
    ease,
    scrollTrigger: trigger ? { trigger, start, once } : undefined,
  });
};
