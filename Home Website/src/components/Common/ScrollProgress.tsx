import React from 'react';
import { useScrollProgress } from '../../hooks/useScrollProgress';
import { useLanguage } from '../../context/LanguageContext';

export const ScrollProgress: React.FC = () => {
  const progress = useScrollProgress();
  const { isTamil } = useLanguage();

  return (
    <div className="fixed top-0 left-0 right-0 h-[3px] z-[60] bg-transparent pointer-events-none">
      <div
        className="h-full bg-gradient-to-r from-theme-bg via-brand-primary to-theme-secondary transition-all duration-75 ease-out"
        style={{ width: `${progress}%` }}
        role="progressbar"
        aria-valuenow={Math.round(progress)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={isTamil ? 'பக்க வாசிப்பு முன்னேற்றம்' : 'Page reading progress'}
      />
    </div>
  );
};
