import { useState, useEffect } from 'react';
import type { SectionId } from '../types';

export const useScrollSpy = (sectionIds: SectionId[], offsetPx: number = 100): SectionId => {
  const [activeSection, setActiveSection] = useState<SectionId>(sectionIds[0] || 'hero');

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + offsetPx;

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const id = sectionIds[i];
        const element = document.getElementById(id);
        if (element) {
          const top = element.offsetTop;
          if (scrollPosition >= top) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [sectionIds, offsetPx]);

  return activeSection;
};
