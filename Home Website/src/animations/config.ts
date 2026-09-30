import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register plugins once
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

export const EASING = {
  smooth: 'power2.out',
  medium: 'power3.out',
  cinematic: 'power4.out',
  expo: 'expo.out',
  circ: 'circ.out',
  elastic: 'elastic.out(1, 0.75)',
};

export const TIMING = {
  fast: 0.35,
  normal: 0.6,
  slow: 0.9,
  stagger: 0.1,
  cardStagger: 0.12,
};

export { gsap, ScrollTrigger };
