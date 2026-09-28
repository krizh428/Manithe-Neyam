import { useState, useEffect } from 'react';

export const useCountUp = (target: number, duration: number = 2000, startNow: boolean = false): number => {
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    if (!startNow) return;

    let startTimestamp: number | null = null;
    let animationFrameId: number;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      // Ease out quartic for smooth slowing down at the end
      const easeOut = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeOut * target));

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      } else {
        setCount(target);
      }
    };

    animationFrameId = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [target, duration, startNow]);

  return count;
};
