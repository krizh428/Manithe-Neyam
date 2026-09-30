import { gsap, EASING, prefersReducedMotion } from './config';

export interface ImageRevealOptions {
  trigger?: Element | string;
  delay?: number;
  duration?: number;
  direction?: 'left' | 'right' | 'up' | 'down';
  ease?: string;
  start?: string;
  once?: boolean;
}

export const imageReveal = (
  container: HTMLElement | string,
  image?: HTMLElement | string | null,
  options: ImageRevealOptions = {}
): gsap.core.Timeline | null => {
  if (prefersReducedMotion()) {
    gsap.set(container, { clipPath: 'inset(0% 0% 0% 0%)', opacity: 1 });
    if (image) gsap.set(image, { scale: 1 });
    return null;
  }

  const {
    trigger = container,
    delay = 0,
    duration = 1.1,
    direction = 'up',
    ease = EASING.cinematic,
    start = 'top 85%',
    once = true,
  } = options;

  let initialClip = 'inset(100% 0% 0% 0%)';
  if (direction === 'left') initialClip = 'inset(0% 0% 0% 100%)';
  if (direction === 'right') initialClip = 'inset(0% 100% 0% 0%)';
  if (direction === 'down') initialClip = 'inset(0% 0% 100% 0%)';

  const tl = gsap.timeline({
    delay,
    scrollTrigger: trigger ? { trigger, start, once } : undefined,
  });

  gsap.set(container, { clipPath: initialClip, opacity: 0 });
  if (image) gsap.set(image, { scale: 1.12 });

  tl.to(container, {
    clipPath: 'inset(0% 0% 0% 0%)',
    opacity: 1,
    duration,
    ease,
  });

  if (image) {
    tl.to(
      image,
      {
        scale: 1,
        duration: duration * 1.15,
        ease: EASING.medium,
      },
      '<0.05'
    );
  }

  return tl;
};
