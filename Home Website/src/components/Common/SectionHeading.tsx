import React from 'react';
import { motion } from 'framer-motion';

interface SectionHeadingProps {
  badge?: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center' | 'right';
  className?: string;
  ochreAccent?: boolean;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  badge,
  title,
  subtitle,
  align = 'center',
  className = '',
  ochreAccent = false,
}) => {
  const alignClass = {
    left: 'text-left items-start',
    center: 'text-center items-center',
    right: 'text-right items-end',
  }[align];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`flex flex-col ${alignClass} mb-12 sm:mb-16 ${className}`}
    >
      {badge && (
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-theme-bg border border-theme-border text-theme-text text-xs sm:text-sm font-semibold mb-3.5 shadow-xs">
          <span className="w-2 h-2 rounded-full bg-theme-bg animate-pulse" />
          <span>{badge}</span>
        </div>
      )}

      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-theme-text tracking-tight leading-tight">
        {title}
      </h2>

      {/* Decorative Brand Accent Line */}
      <div className={`flex items-center gap-2 mt-3.5 mb-4 ${align === 'center' ? 'justify-center' : align === 'right' ? 'justify-end' : 'justify-start'}`}>
        <div className="w-10 sm:w-14 h-1 bg-theme-bg rounded-full" />
        <div className={`w-3 h-3 rounded-full ${ochreAccent ? 'bg-theme-bg' : 'bg-theme-bg'} rotate-45`} />
        <div className="w-6 sm:w-8 h-1 bg-theme-bg rounded-full" />
      </div>

      {subtitle && (
        <p className="max-w-2xl text-base sm:text-lg text-theme-text leading-relaxed font-normal">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
};
