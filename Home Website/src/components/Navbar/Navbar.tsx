import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { Menu, Lock, ShieldCheck } from 'lucide-react';
import { NAV_ITEMS } from '../../data/siteData';
import type { SectionId } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { useAdminData } from '../../context/AdminDataContext';
import { SlidingPill } from './SlidingPill';
import { MobileMenu } from './MobileMenu';
import { ThemeToggle } from '../Theme/ThemeToggle';
import { IconTranslate } from './IconTranslate';
import { gsap, EASING, prefersReducedMotion } from '../../animations';

interface NavbarProps {
  activeSection: SectionId;
  onOpenSupport: () => void;
  onOpenAdmin: () => void;
  onReplayOrgTree?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeSection,
  onOpenSupport,
  onOpenAdmin,
  onReplayOrgTree,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { language, setLanguage, isTamil } = useLanguage();
  const { brand, isAdmin } = useAdminData();

  const headerRef = useRef<HTMLElement | null>(null);
  const logoRef = useRef<HTMLAnchorElement | null>(null);
  const navRef = useRef<HTMLElement | null>(null);
  const actionsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // GSAP Initial Load Stagger Animation
  useLayoutEffect(() => {
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.1 });

      if (logoRef.current) {
        gsap.set(logoRef.current, { opacity: 0, x: -24 });
        tl.to(logoRef.current, {
          opacity: 1,
          x: 0,
          duration: 0.6,
          ease: EASING.cinematic,
        });
      }

      const navButtons = navRef.current?.querySelectorAll('button');
      if (navButtons && navButtons.length > 0) {
        gsap.set(navButtons, { opacity: 0, y: -12 });
        tl.to(
          navButtons,
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.08,
            ease: EASING.medium,
          },
          '-=0.4'
        );
      }

      if (actionsRef.current) {
        gsap.set(actionsRef.current.children, { opacity: 0, scale: 0.9 });
        tl.to(
          actionsRef.current.children,
          {
            opacity: 1,
            scale: 1,
            duration: 0.5,
            stagger: 0.08,
            ease: EASING.smooth,
          },
          '-=0.3'
        );
      }
    }, headerRef);

    return () => ctx.revert();
  }, []);

  const handleNavClick = (href: string) => {
    if (href === '#hero' || href === '#') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
      if (onReplayOrgTree) {
        onReplayOrgTree();
      }
      return;
    }

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
        window.location.href = '/' + href;
      }
    } else {
      window.location.href = href;
    }
  };

  return (
    <>
      <header
        ref={headerRef}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'py-2.5 glass-nav border-b border-theme-border/80 shadow-soft'
            : 'py-4 sm:py-5 bg-theme-bg/90 backdrop-blur-md'
        }`}
      >
        <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 lg:px-4 xl:px-8 flex items-center justify-between gap-1.5 lg:gap-2 xl:gap-6">
          {/* Logo & Brand Identity */}
          <a
            ref={logoRef}
            href="#hero"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('#hero');
            }}
            className="flex items-center gap-2 sm:gap-2.5 xl:gap-3 shrink-0 group focus:outline-none focus:ring-2 focus:ring-brand-primary rounded-lg p-1 transition-transform hover:scale-[1.02]"
          >
            <div className="relative w-11 h-11 sm:w-12 sm:h-12 xl:w-14 xl:h-14 rounded-full bg-theme-bg p-1 shadow-card hover:shadow-hover border border-theme-border/20 flex items-center justify-center transition-transform group-hover:scale-105 shrink-0">
              <img
                src="/logo.png"
                alt="Manithaneyam Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col whitespace-nowrap">
              <span className="font-extrabold text-sm sm:text-base xl:text-xl text-theme-text font-tamil tracking-tight leading-none group-hover:text-brand-primary transition-colors">
                {brand.nameTa}
              </span>
              <span className="text-[10px] xl:text-[11px] font-medium text-theme-text font-english tracking-wider uppercase mt-0.5 hidden xl:block">
                {brand.nameEn}
              </span>
            </div>
          </a>

          {/* Desktop Navigation with Animated Sliding Pill */}
          <nav
            ref={navRef}
            className="hidden lg:flex items-center bg-theme-bg/90 px-1.5 xl:px-2 py-1 xl:py-1.5 rounded-full border border-theme-border shadow-xs shrink-0"
          >
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.href)}
                  className={`relative px-2 xl:px-3.5 py-1.5 xl:py-2 rounded-full text-xs xl:text-sm font-semibold transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary hover:-translate-y-0.5 whitespace-nowrap ${
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
          <div ref={actionsRef} className="hidden lg:flex items-center gap-1.5 xl:gap-3 shrink-0">
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Language Switcher Icon */}
            <button
              onClick={() => setLanguage(language === 'ta' ? 'en' : 'ta')}
              className="p-1.5 xl:p-2 rounded-full bg-theme-bg border border-theme-border text-theme-text hover:bg-theme-bg shadow-card hover:shadow-hover transition-all focus:outline-none focus:ring-2 focus:ring-brand-primary hover:scale-105 active:scale-95 shrink-0"
              aria-label={isTamil ? 'மொழியை மாற்றவும்' : 'Change language'}
              title={language === 'ta' ? 'Switch to English' : 'தமிழுக்கு மாற்றவும்'}
            >
              <IconTranslate className="w-4 h-4 xl:w-5 xl:h-5" />
            </button>

            {/* Admin Login Button */}
            <button
              onClick={onOpenAdmin}
              className={`inline-flex items-center gap-1.5 px-2.5 xl:px-3 py-1.5 xl:py-2 rounded-full text-xs font-bold border transition-all cursor-pointer hover:scale-105 active:scale-95 shrink-0 whitespace-nowrap shadow-xs ${
                isAdmin
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                  : 'bg-theme-bg text-theme-text border-theme-border hover:text-theme-text hover:border-theme-border/40'
              }`}
              title={isAdmin ? 'Admin Mode Active' : 'Admin Login'}
            >
              {isAdmin ? (
                <>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="whitespace-nowrap">Admin</span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5 text-theme-text shrink-0" />
                  <span className="whitespace-nowrap">{isTamil ? 'நிர்வாக உள்நுழைவு' : 'Admin Login'}</span>
                </>
              )}
            </button>
          </div>

          {/* Mobile Menu & Theme/Language Toggle */}
          <div className="flex items-center gap-2.5 sm:gap-3 lg:hidden shrink-0">
            <ThemeToggle />

            <button
              onClick={() => setLanguage(language === 'ta' ? 'en' : 'ta')}
              className="p-2 rounded-full bg-theme-bg border border-theme-border text-theme-text hover:bg-theme-bg shadow-xs focus:outline-none focus:ring-2 focus:ring-brand-primary active:scale-95 shrink-0"
              aria-label={isTamil ? 'மொழியை மாற்றவும்' : 'Change language'}
            >
              <IconTranslate className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenAdmin}
              className="p-2 rounded-full bg-theme-bg border border-theme-border text-theme-text text-xs font-bold shadow-xs active:scale-95 shrink-0"
              aria-label={isTamil ? 'நிர்வாக உள்நுழைவு' : 'Admin Login'}
            >
              <Lock className="w-3.5 h-3.5 text-theme-text" />
            </button>

            <button
              onClick={() => setIsMobileOpen(true)}
              className="p-2.5 rounded-full bg-theme-bg border border-theme-border text-theme-text hover:bg-theme-bg shadow-xs focus:outline-none focus:ring-2 focus:ring-brand-primary active:scale-95 shrink-0"
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
