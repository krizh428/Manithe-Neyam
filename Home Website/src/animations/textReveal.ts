import { gsap, EASING, prefersReducedMotion } from './config';

export interface TextRevealOptions {
  trigger?: Element | string;
  delay?: number;
  duration?: number;
  stagger?: number;
  ease?: string;
  start?: string;
  once?: boolean;
}

export const textReveal = (
  container: HTMLElement | string,
  options: TextRevealOptions = {}
): gsap.core.Timeline | null => {
  if (prefersReducedMotion()) {
    gsap.set(container, { opacity: 1, y: 0 });
    return null;
  }

  const {
    trigger = container,
    delay = 0,
    duration = 0.85,
    stagger = 0.08,
    ease = EASING.cinematic,
    start = 'top 85%',
    once = true,
  } = options;

  const targetEl = typeof container === 'string' ? document.querySelector(container) : container;
  if (!targetEl) return null;

  // Find direct split line/word children or revealable elements
  const children = targetEl.querySelectorAll('[data-reveal-part]');
  const itemsToAnimate = children.length > 0 ? children : [targetEl];

  gsap.set(itemsToAnimate, { opacity: 0, y: 35 });

  const tl = gsap.timeline({
    delay,
    scrollTrigger: trigger ? { trigger, start, once } : undefined,
  });

  tl.to(itemsToAnimate, {
    opacity: 1,
    y: 0,
    duration,
    stagger,
    ease,
  });

  return tl;
};
