import React, { useState, useEffect } from 'react';
import { Menu, Lock, ShieldCheck } from 'lucide-react';
import { NAV_ITEMS } from '../../data/siteData';
import type { SectionId } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { useAdminData } from '../../context/AdminDataContext';
import { SlidingPill } from './SlidingPill';
import { MobileMenu } from './MobileMenu';
import { ThemeToggle } from '../Theme/ThemeToggle';
import { IconTranslate } from './IconTranslate';

interface NavbarProps {
  activeSection: SectionId;
  onOpenSupport: () => void;
  onOpenAdmin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeSection, onOpenSupport, onOpenAdmin }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { language, setLanguage, isTamil } = useLanguage();
  const { brand, isAdmin } = useAdminData();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    if (href.startsWith('#')) {
      const targetId = href.replace('#', '');
      const element = document.getElementById(targetId);
      if (element) {
        const offset = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });
      } else {
        // If we're not on the home page and clicked a hash link, go to home page with hash
        window.location.href = '/' + href;
      }
    } else {
      window.location.href = href;
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'py-2.5 glass-nav border-b border-theme-border/80 shadow-soft'
            : 'py-4 sm:py-5 bg-theme-bg/90 backdrop-blur-md'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 lg:gap-8">
          {/* Logo & Brand Identity */}
          <a
            href="#hero"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('#hero');
            }}
            className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-brand-primary rounded-lg p-1"
          >
            <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-theme-bg p-1 shadow-card hover:shadow-hover border border-theme-border/20 flex items-center justify-center transition-transform group-hover:scale-105">
              <img
                src="/logo.png"
                alt="Manithaneyam Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col whitespace-nowrap">
              <span className="font-extrabold text-lg sm:text-xl text-theme-text font-tamil tracking-tight leading-none group-hover:text-theme-text transition-colors">
                {brand.nameTa}
              </span>
              <span className="text-[11px] font-medium text-theme-text font-english tracking-wider uppercase mt-0.5">
                {brand.nameEn}
              </span>
            </div>
          </a>

          {/* Desktop Navigation with Animated Sliding Pill */}
          <nav className="hidden lg:flex items-center bg-theme-bg/90 px-2 py-1.5 rounded-full border border-theme-border shadow-xs">
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.href)}
                  className={`relative px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary ${
                    isActive ? 'text-brand-primary' : 'text-theme-text hover:text-brand-primary'
                  }`}
                >
                  {isActive && <SlidingPill />}
                  <span className="relative z-10 whitespace-nowrap">
                    {isTamil ? item.labelTa : item.labelEn}
                  </span>
                </button>
              );
            })}
          </nav>

          {/* Right Actions: Theme Toggle + Language Switcher + Admin Login */}
          <div className="hidden sm:flex items-center gap-4">
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Language Switcher Icon */}
            <button
              onClick={() => setLanguage(language === 'ta' ? 'en' : 'ta')}
              className="p-2 rounded-full bg-theme-bg border border-theme-border text-theme-text hover:bg-theme-bg shadow-card hover:shadow-hover transition-all focus:outline-none focus:ring-2 focus:ring-brand-primary"
              aria-label={isTamil ? 'மொழியை மாற்றவும்' : 'Change language'}
              title={language === 'ta' ? 'Switch to English' : 'தமிழுக்கு மாற்றவும்'}
            >
              <IconTranslate className="w-5 h-5" />
            </button>

            {/* Admin Login Button */}
            <button
              onClick={onOpenAdmin}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                isAdmin
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                  : 'bg-theme-bg text-theme-text border-theme-border hover:text-theme-text hover:border-theme-border/40'
              }`}
              title={isAdmin ? 'Admin Mode Active' : 'Admin Login'}
            >
              {isAdmin ? (
                <>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Admin</span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5 text-theme-text" />
                  <span>{isTamil ? 'உள்நுழைவு' : 'Login'}</span>
                </>
              )}
            </button>
          </div>

          {/* Mobile Menu & Theme/Language Toggle */}
          <div className="flex items-center gap-3 lg:hidden">
            <ThemeToggle />
            
            <button
              onClick={() => setLanguage(language === 'ta' ? 'en' : 'ta')}
              className="p-2 rounded-full bg-theme-bg border border-theme-border text-theme-text hover:bg-theme-bg shadow-xs focus:outline-none focus:ring-2 focus:ring-brand-primary"
              aria-label={isTamil ? 'மொழியை மாற்றவும்' : 'Change language'}
            >
              <IconTranslate className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenAdmin}
              className="p-2 rounded-full bg-theme-bg border border-theme-border text-theme-text text-xs font-bold shadow-xs"
              aria-label={isTamil ? 'நிர்வாக உள்நுழைவு' : 'Admin Login'}
            >
              <Lock className="w-3.5 h-3.5 text-theme-text" />
            </button>

            <button
              onClick={() => setIsMobileOpen(true)}
              className="p-2.5 rounded-full bg-theme-bg border border-theme-border text-theme-text hover:bg-theme-bg shadow-xs focus:outline-none focus:ring-2 focus:ring-brand-primary"
              aria-label={isTamil ? 'மெனுவைத் திறக்கவும்' : 'Open mobile menu'}
            >
              <Menu className="w-5 h-5 text-theme-text" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <MobileMenu
        isOpen={isMobileOpen}
        onClose={() => setIsMobileOpen(false)}
        navItems={NAV_ITEMS}
        activeSection={activeSection}
        onNavigate={handleNavClick}
        onOpenSupport={onOpenSupport}
        onOpenAdmin={onOpenAdmin}
      />
    </>
  );
};
