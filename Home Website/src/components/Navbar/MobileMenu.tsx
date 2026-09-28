import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, HeartHandshake, Globe, Lock } from 'lucide-react';
import type { NavItem, SectionId } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { useAdminData } from '../../context/AdminDataContext';

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

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs lg:hidden"
          />

          {/* Drawer Content */}
          <motion.div
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed top-0 left-0 right-0 z-50 bg-theme-bg border-b border-theme-border shadow-card hover:shadow-hover p-6 lg:hidden max-h-[90vh] overflow-y-auto"
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
                className="p-2 rounded-full text-theme-text hover:bg-theme-bg transition-colors focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]"
                aria-label="Close menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Navigation Links */}
            <div className="flex flex-col gap-2 py-4">
              {navItems.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onNavigate(item.href);
                      onClose();
                    }}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl text-left font-semibold text-base transition-all ${
                      isActive
                        ? 'bg-theme-bg text-theme-text shadow-card hover:shadow-hover'
                        : 'text-theme-text hover:bg-theme-bg'
                    }`}
                  >
                    <span>{isTamil ? item.labelTa : item.labelEn}</span>
                    {isActive && <span className="w-2 h-2 rounded-full bg-theme-bg" />}
                  </button>
                );
              })}
            </div>

            {/* Language Switcher & Quick Actions */}
            <div className="pt-4 border-t border-theme-border flex flex-col gap-3">
              {/* Language Toggle */}
              <button
                onClick={toggleLanguage}
                className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-full bg-theme-bg border border-theme-border text-theme-text font-medium text-sm hover:bg-theme-bg transition-colors"
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
                className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-full bg-theme-bg border border-theme-border/30 text-theme-text font-semibold text-xs hover:bg-theme-bg transition-colors"
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
                className="flex items-center justify-center gap-2 py-3 px-6 rounded-full bg-theme-bg text-theme-text font-bold text-sm shadow-card hover:shadow-hover hover:bg-theme-bg transition-colors"
              >
                <HeartHandshake className="w-4 h-4 text-theme-text" />
                <span>{isTamil ? 'ஆதரிக்க விரும்புகிறேன்' : 'Support Our Cause'}</span>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
