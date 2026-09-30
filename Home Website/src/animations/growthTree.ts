import { gsap, EASING, prefersReducedMotion } from './config';

export interface GrowthTreeOptions {
  trigger?: Element | string;
  delay?: number;
  duration?: number;
}

export const animateGrowthTree = (
  container: SVGElement | HTMLElement,
  options: GrowthTreeOptions = {}
): gsap.core.Timeline | null => {
  if (prefersReducedMotion()) {
    gsap.set(container.querySelectorAll('*'), { opacity: 1, strokeDashoffset: 0, scale: 1 });
    return null;
  }

  const { trigger = container, delay = 0.2 } = options;

  const tl = gsap.timeline({
    delay,
    scrollTrigger: {
      trigger: trigger as Element,
      start: 'top 80%',
      once: true,
    },
  });

  const centerNode = container.querySelector('.tree-center-node');
  const branches = container.querySelectorAll('.tree-branch');
  const leafNodes = container.querySelectorAll('.tree-leaf-node');

  // Center node scales and blooms
  if (centerNode) {
    gsap.set(centerNode, { scale: 0, opacity: 0, transformOrigin: 'center center' });
    tl.to(centerNode, {
      scale: 1,
      opacity: 1,
      duration: 0.8,
      ease: EASING.cinematic,
    });
  }

  // Branch paths draw out
  if (branches.length > 0) {
    branches.forEach((b) => {
      const path = b as SVGPathElement;
      const length = path.getTotalLength ? path.getTotalLength() : 150;
      gsap.set(path, {
        strokeDasharray: length,
        strokeDashoffset: length,
        opacity: 0.85,
      });
    });

    tl.to(
      branches,
      {
        strokeDashoffset: 0,
        duration: 1.2,
        stagger: 0.12,
        ease: 'power2.inOut',
      },
      '-=0.4'
    );
  }

  // Leaf nodes bloom organically upward from branch tips
  if (leafNodes.length > 0) {
    gsap.set(leafNodes, { scale: 0, opacity: 0, transformOrigin: '50% 100%' });
    tl.to(
      leafNodes,
      {
        scale: 1,
        opacity: 1,
        duration: 0.75,
        stagger: 0.1,
        ease: 'back.out(1.4)',
      },
      '-=0.5'
    );
  }

  return tl;
};
