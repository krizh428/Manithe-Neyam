import { gsap, EASING, prefersReducedMotion } from './config';

export interface RevealOptions {
  trigger?: Element | string;
  delay?: number;
  duration?: number;
  distance?: number;
  ease?: string;
  start?: string;
  once?: boolean;
}

export const slideLeft = (
  target: gsap.TweenTarget,
  options: RevealOptions = {}
): gsap.core.Tween | null => {
  if (prefersReducedMotion()) {
    gsap.set(target, { opacity: 1, x: 0 });
    return null;
  }

  const {
    trigger,
    delay = 0,
    duration = 0.8,
    distance = 45,
    ease = EASING.cinematic,
    start = 'top 85%',
    once = true,
  } = options;

  gsap.set(target, { opacity: 0, x: -distance });

  return gsap.to(target, {
    opacity: 1,
    x: 0,
    duration,
    delay,
    ease,
    scrollTrigger: trigger ? { trigger, start, once } : undefined,
  });
};

export const slideRight = (
  target: gsap.TweenTarget,
  options: RevealOptions = {}
): gsap.core.Tween | null => {
  if (prefersReducedMotion()) {
    gsap.set(target, { opacity: 1, x: 0 });
    return null;
  }

  const {
    trigger,
    delay = 0,
    duration = 0.8,
    distance = 45,
    ease = EASING.cinematic,
    start = 'top 85%',
    once = true,
  } = options;

  gsap.set(target, { opacity: 0, x: distance });

  return gsap.to(target, {
    opacity: 1,
    x: 0,
    duration,
    delay,
    ease,
    scrollTrigger: trigger ? { trigger, start, once } : undefined,
  });
};

export const scaleIn = (
  target: gsap.TweenTarget,
  options: RevealOptions & { initialScale?: number } = {}
): gsap.core.Tween | null => {
  if (prefersReducedMotion()) {
    gsap.set(target, { opacity: 1, scale: 1 });
    return null;
  }

  const {
    trigger,
    delay = 0,
    duration = 0.75,
    initialScale = 0.92,
    ease = EASING.medium,
    start = 'top 85%',
    once = true,
  } = options;

  gsap.set(target, { opacity: 0, scale: initialScale });

  return gsap.to(target, {
    opacity: 1,
    scale: 1,
    duration,
    delay,
    ease,
    scrollTrigger: trigger ? { trigger, start, once } : undefined,
  });
};
