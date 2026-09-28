import { useTheme } from '../../context/ThemeContext';
import { Cloud, Sun, Moon, Star } from 'lucide-react';

export function ThemeToggle() {
  const { setTheme, activeTheme } = useTheme();
  const isDark = activeTheme === 'dark';

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  return (
    <button
      onClick={toggleTheme}
      className={`
        relative inline-flex items-center
        h-7 w-14 p-1 rounded-full
        transition-all duration-500 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2
        ${isDark ? 'bg-[#15234B]' : 'bg-[#73C0F4]'}
        shadow-inner
        hover:scale-105 active:scale-95
      `}
      aria-label="Toggle theme"
    >
      {/* Dark Mode Background Elements (Moon & Stars) */}
      <div className={`absolute inset-0 flex items-center px-1.5 pointer-events-none transition-opacity duration-500 ${isDark ? 'opacity-100' : 'opacity-0'}`}>
        <div className="relative w-full h-full flex items-center">
          <Moon className="w-3 h-3 text-[#F6F1D5] fill-[#F6F1D5] absolute left-0" />
          <Star className="w-1.5 h-1.5 text-white fill-white absolute left-3 top-1" />
          <Star className="w-1 h-1 text-white fill-white absolute left-4 bottom-1" />
          <Star className="w-1 h-1 text-white fill-white absolute left-1.5 bottom-0.5" />
        </div>
      </div>
      
      {/* Light Mode Background Elements (Sun & Cloud) */}
      <div className={`absolute inset-0 flex items-center px-1.5 pointer-events-none transition-opacity duration-500 ${isDark ? 'opacity-0' : 'opacity-100'}`}>
        <div className="relative w-full h-full flex items-center justify-end">
          <Sun className="w-3.5 h-3.5 text-[#FFD600] fill-[#FFD600] absolute right-0 top-0.5" />
          <Cloud className="w-4 h-4 text-white fill-white absolute -right-0.5 top-1 drop-shadow-sm" />
        </div>
      </div>
      
      {/* Sliding Thumb (The White Circle) */}
      <span
        className={`
          absolute top-1 bg-gradient-to-br from-white to-neutral-100 rounded-full h-5 w-5
          transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
          shadow-md border border-white/20
          ${isDark ? 'translate-x-7' : 'translate-x-0'}
        `}
      />
    </button>
  );
}
