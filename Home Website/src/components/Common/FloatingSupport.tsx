import React from 'react';
import { Heart } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface FloatingSupportProps {
  onClick: () => void;
}

export const FloatingSupport: React.FC<FloatingSupportProps> = ({ onClick }) => {
  const { isTamil } = useLanguage();

  return (
    <button
      onClick={onClick}
      className="fixed bottom-24 right-6 sm:bottom-28 sm:right-6 z-40 p-4 bg-white hover:bg-brand-primary rounded-full shadow-card hover:shadow-hover border border-theme-border transition-all duration-300 hover:-translate-y-1 group focus:outline-none focus:ring-4 focus:ring-red-500/50 cursor-pointer flex items-center justify-center"
      aria-label={isTamil ? 'ஆதரிக்க' : 'Support Us'}
      title={isTamil ? 'ஆதரிக்க' : 'Support Us'}
    >
      <Heart className="w-6 h-6 text-red-500 fill-red-500 group-hover:text-white group-hover:fill-white group-hover:scale-110 transition-transform" />
    </button>
  );
};
