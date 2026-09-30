import { gsap, EASING, prefersReducedMotion } from './config';

export interface CounterOptions {
  trigger?: Element | string;
  duration?: number;
  delay?: number;
  ease?: string;
  start?: string;
  onUpdate?: (value: number) => void;
}

export const animateCounter = (
  from: number,
  to: number,
  options: CounterOptions = {}
): gsap.core.Tween | null => {
  const {
    trigger,
    duration = 2,
    delay = 0,
    ease = EASING.cinematic,
    start = 'top 85%',
    onUpdate,
  } = options;

  if (prefersReducedMotion()) {
    if (onUpdate) onUpdate(to);
    return null;
  }

  const obj = { val: from };

  return gsap.to(obj, {
    val: to,
    duration,
    delay,
    ease,
    scrollTrigger: trigger
      ? {
          trigger: trigger,
          start,
          once: true,
        }
      : undefined,
    onUpdate: () => {
      if (onUpdate) onUpdate(Math.round(obj.val));
    },
  });
};
