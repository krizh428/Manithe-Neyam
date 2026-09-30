import React, { useLayoutEffect, useRef } from 'react';
import { X, HeartHandshake, Globe, Lock } from 'lucide-react';
import type { NavItem, SectionId } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { useAdminData } from '../../context/AdminDataContext';
import { gsap, EASING, prefersReducedMotion } from '../../animations';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navItems: NavItem[];
  activeSection: SectionId;
  onNavigate: (href: string) => void;
  onOpenSupport: () => void;
  onOpenAdmin: () => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  onClose,
  navItems,
  activeSection,
  onNavigate,
  onOpenSupport,
  onOpenAdmin,
}) => {
  const { language, toggleLanguage, isTamil } = useLanguage();
  const { brand, isAdmin } = useAdminData();

  const backdropRef = useRef<HTMLDivElement | null>(null);
  const drawerRef = useRef<HTMLDivElement | null>(null);
  const navContainerRef = useRef<HTMLDivElement | null>(null);
  const actionsRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (!isOpen) return;

    if (prefersReducedMotion()) {
      if (backdropRef.current) gsap.set(backdropRef.current, { opacity: 1 });
      if (drawerRef.current) gsap.set(drawerRef.current, { y: 0, opacity: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      // 1. Backdrop fades in
      if (backdropRef.current) {
        gsap.set(backdropRef.current, { opacity: 0 });
        tl.to(backdropRef.current, { opacity: 1, duration: 0.3, ease: 'power2.out' });
      }

      // 2. Drawer slides down
      if (drawerRef.current) {
        gsap.set(drawerRef.current, { y: -30, opacity: 0 });
        tl.to(
          drawerRef.current,
          {
            y: 0,
            opacity: 1,
            duration: 0.4,
            ease: EASING.cinematic,
          },
          '-=0.2'
        );
      }

      // 3. Stagger menu items
      const items = navContainerRef.current?.querySelectorAll('button');
      if (items && items.length > 0) {
        gsap.set(items, { opacity: 0, x: -16 });
        tl.to(
          items,
          {
            opacity: 1,
            x: 0,
            duration: 0.35,
            stagger: 0.05,
            ease: EASING.medium,
          },
          '-=0.2'
        );
      }

      // 4. CTA & actions appear last
      if (actionsRef.current) {
        gsap.set(actionsRef.current.children, { opacity: 0, y: 12 });
        tl.to(
          actionsRef.current.children,
          {
            opacity: 1,
            y: 0,
            duration: 0.35,
            stagger: 0.07,
            ease: EASING.smooth,
          },
          '-=0.15'
        );
      }
    });

    return () => ctx.revert();
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        ref={backdropRef}
        onClick={onClose}
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs lg:hidden"
      />

      {/* Drawer Content */}
      <div
        ref={drawerRef}
        className="fixed top-0 left-0 right-0 z-50 bg-theme-bg border-b border-theme-border shadow-card p-6 lg:hidden max-h-[92vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-theme-border">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-theme-bg p-1 border border-theme-border/30 shadow-xs flex items-center justify-center">
              <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-theme-text font-tamil leading-tight">
                {brand.nameTa}
              </h3>
              <p className="text-[10px] text-theme-text font-english tracking-wide uppercase">
                {brand.nameEn}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-theme-text hover:bg-theme-secondary transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary active:scale-95"
            aria-label={isTamil ? 'மெனுவை மூடவும்' : 'Close menu'}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation Links */}
        <div ref={navContainerRef} className="flex flex-col gap-2 py-4">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.href);
                  onClose();
                }}
                className={`flex items-center justify-between px-4 py-3 rounded-xl text-left font-semibold text-base transition-all active:scale-[0.99] ${
                  isActive
                    ? 'bg-brand-bg text-brand-primary shadow-xs font-bold'
                    : 'text-theme-text hover:bg-theme-secondary'
                }`}
              >
                <span>{isTamil ? item.labelTa : item.labelEn}</span>
                {isActive && <span className="w-2 h-2 rounded-full bg-brand-primary" />}
              </button>
            );
          })}
        </div>

        {/* Language Switcher & Quick Actions */}
        <div ref={actionsRef} className="pt-4 border-t border-theme-border flex flex-col gap-3">
          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-full bg-theme-bg border border-theme-border text-theme-text font-medium text-sm hover:bg-theme-secondary transition-colors active:scale-98"
          >
            <Globe className="w-4 h-4 text-theme-text" />
            <span>{language === 'ta' ? 'Switch to English' : 'தமிழுக்கு மாற்றவும்'}</span>
          </button>

          {/* Admin Login Button */}
          <button
            onClick={() => {
              onClose();
              onOpenAdmin();
            }}
            className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-full bg-theme-bg border border-theme-border/30 text-theme-text font-semibold text-xs hover:bg-theme-secondary transition-colors active:scale-98"
          >
            <Lock className="w-3.5 h-3.5 text-theme-text" />
            <span>{isAdmin ? 'நிர்வாக மையம் (Admin Panel)' : (isTamil ? 'நிர்வாக உள்நுழைவு (Login)' : 'Admin Login')}</span>
          </button>

          {/* Support CTA */}
          <button
            onClick={() => {
              onClose();
              onOpenSupport();
            }}
            className="flex items-center justify-center gap-2 py-3 px-6 rounded-full bg-brand-primary text-on-primary font-bold text-sm shadow-card hover:shadow-hover hover:bg-brand-hover transition-colors active:scale-98"
          >
            <HeartHandshake className="w-4 h-4" />
            <span>{isTamil ? 'ஆதரிக்க விரும்புகிறேன்' : 'Support Our Cause'}</span>
          </button>
        </div>
      </div>
    </>
  );
};
