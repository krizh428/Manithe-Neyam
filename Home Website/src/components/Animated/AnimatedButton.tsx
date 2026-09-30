import React, { useRef } from 'react';
import { prefersReducedMotion } from '../../animations';

interface AnimatedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'heart';
  children: React.ReactNode;
  className?: string;
  withSweep?: boolean;
}

export const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  children,
  variant = 'primary',
  className = '',
  withSweep = true,
  onClick,
  ...props
}) => {
  const btnRef = useRef<HTMLButtonElement | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (prefersReducedMotion() || !btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    // Micro magnetic pull (very subtle, 3px max)
    btnRef.current.style.transform = `translate(${x * 0.08}px, ${y * 0.08 - 2}px)`;
  };

  const handleMouseLeave = () => {
    if (btnRef.current) {
      btnRef.current.style.transform = '';
    }
  };

  const baseStyles =
    'relative inline-flex items-center justify-center font-bold text-sm sm:text-base rounded-full transition-all duration-300 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary active:scale-[0.98] overflow-hidden group select-none';

  const variantStyles = {
    primary:
      'bg-brand-primary text-on-primary shadow-card hover:shadow-hover hover:bg-brand-hover border border-transparent',
    secondary:
      'bg-theme-bg text-theme-text border border-theme-border shadow-xs hover:border-brand-primary/60 hover:text-brand-primary',
    ghost:
      'bg-transparent text-theme-text hover:bg-theme-bg/80 border border-transparent',
    heart:
      'bg-theme-bg text-theme-text font-extrabold shadow-card hover:shadow-hover border border-theme-border hover:border-red-400',
  }[variant];

  return (
    <button
      ref={btnRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={`${baseStyles} ${variantStyles} ${className}`}
      {...props}
    >
      {/* Light sheen sweep on hover */}
      {withSweep && !prefersReducedMotion() && (
        <span
          aria-hidden="true"
          className="absolute inset-0 w-[200%] h-full bg-gradient-to-r from-transparent via-white/18 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none"
        />
      )}

      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </button>
  );
};
