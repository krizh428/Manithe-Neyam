import React, { useLayoutEffect, useRef } from 'react';
import {
  Heart,
  MapPin,
  Mail,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { NAV_ITEMS } from '../../data/siteData';
import { useLanguage } from '../../context/LanguageContext';
import { useAdminData } from '../../context/AdminDataContext';
import { WhatsAppIcon } from '../Common/WhatsAppIcon';
import { gsap, EASING, prefersReducedMotion } from '../../animations';

export const Footer: React.FC = () => {
  const { isTamil } = useLanguage();
  const { brand: SITE_BRAND, locations: HOME_LOCATIONS } = useAdminData();

  const footerRef = useRef<HTMLElement | null>(null);
  const colsRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (!colsRef.current || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const cols = colsRef.current?.children;
      if (cols && cols.length > 0) {
        gsap.set(cols, { opacity: 0, y: 30 });
        gsap.to(cols, {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.1,
          ease: EASING.cinematic,
          scrollTrigger: {
            trigger: colsRef.current,
            start: 'top 90%',
            once: true,
          },
        });
      }
    }, footerRef);

    return () => ctx.revert();
  }, []);

  const handleNavClick = (href: string) => {
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
    }
  };

  return (
    <footer ref={footerRef} className="bg-theme-footer text-theme-footer-text relative overflow-hidden border-t-4 border-theme-border">
      {/* Top Subtle Gradient Glow */}
      <div className="absolute top-0 left-1/4 right-1/4 h-[2px] bg-gradient-to-r from-transparent via-brand-primary to-transparent" />

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div ref={colsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          {/* Col 1: Brand & Tagline (5 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3 group">
              <div className="w-20 h-20 rounded-full bg-white p-1 border border-white/15 shadow-card hover:shadow-hover flex items-center justify-center transition-transform group-hover:scale-105">
                <img
                  src="/logo.png"
                  alt="Manithaneyam Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-theme-footer-heading font-tamil leading-tight">
                  {SITE_BRAND.fullNameTa}
                </h3>
                <p className="text-xs text-theme-footer-text font-english tracking-wider uppercase font-medium">
                  {SITE_BRAND.nameEn}
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-theme-footer-text leading-relaxed pt-2">
              {isTamil ? SITE_BRAND.taglineTa : SITE_BRAND.taglineEn}
            </p>

            <p className="text-xs text-theme-footer-text leading-relaxed">
              {isTamil
                ? 'குழந்தைகள், பெண்கள் மற்றும் முதியோருக்கு பாதுகாப்பான இல்லம், கல்வி மற்றும் அன்பான வாழ்வாதார ஆதரவு.'
                : 'Providing dignified shelter, education, nutrition, and compassionate care for vulnerable children and elders.'}
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-theme-footer-text shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-brand-primary" />
              <span>{isTamil ? 'கோடாங்கிபட்டி, தேனி மாவட்டம்' : 'Kodangipatti, Theni District'}</span>
            </div>
          </div>

          {/* Col 2: Quick Links (2.5 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-theme-footer-heading border-b border-white/10 pb-2.5">
              {isTamil ? 'முக்கிய இணைப்புகள்' : 'Quick Navigation'}
            </h4>
            <ul className="space-y-2.5">
              {NAV_ITEMS.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => handleNavClick(item.href)}
                    className="flex items-center gap-2 text-sm text-theme-footer-link hover:text-theme-footer-link-hover transition-all duration-200 cursor-pointer text-left hover:translate-x-1.5 group"
                  >
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                    <span>{isTamil ? item.labelTa : item.labelEn}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Our Homes (2.5 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-theme-footer-heading border-b border-white/10 pb-2.5">
              {isTamil ? 'எங்கள் இல்லங்கள்' : 'Our Homes'}
            </h4>
            <ul className="space-y-2.5 text-sm text-theme-footer-text">
              {HOME_LOCATIONS.map((home) => (
                <li key={home.id} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-primary shrink-0" />
                  <span>{isTamil ? home.titleTa : home.titleEn}</span>
                  {home.phone && (
                    <a
                      href={`tel:${home.phone.replace(/[^+\d]/g, '')}`}
                      className="text-theme-footer-link opacity-80 hover:opacity-100 hover:text-theme-footer-link-hover transition-colors text-xs"
                    >
                      · {home.phone}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Contact & Social (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-theme-footer-heading border-b border-white/10 pb-2.5">
              {isTamil ? 'தொடர்புக்கு' : 'Direct Contact'}
            </h4>

            <div className="space-y-3 text-xs sm:text-sm text-theme-footer-text">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-brand-primary" />
                <span>{isTamil ? SITE_BRAND.fullAddressTa : SITE_BRAND.fullAddressEn}</span>
              </div>

              <div className="flex items-center gap-2.5">
                <WhatsAppIcon className="w-4 h-4 shrink-0 text-emerald-400" />
                <div className="flex flex-col gap-1">
                  <a
                    href={`https://wa.me/${SITE_BRAND.phone1.replace(/\D/g, '')}?text=${encodeURIComponent(
                      isTamil
                        ? 'வணக்கம், மனிதநேய ஆதரவற்றோர் காப்பகம் பற்றிய தகவல்களை அறிய விரும்புகிறேன்.'
                        : 'Hello, I would like to get more information about Manithaneyam Orphanage Home.'
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-theme-footer-link hover:text-emerald-400 transition-colors inline-flex items-center gap-1.5"
                    title={isTamil ? 'வாட்ஸ்அப் மூலம் தொடர்புகொள்ள' : 'Chat on WhatsApp'}
                  >
                    <span>{SITE_BRAND.phone1}</span>
                  </a>
                  <a
                    href={`https://wa.me/${SITE_BRAND.phone2.replace(/\D/g, '')}?text=${encodeURIComponent(
                      isTamil
                        ? 'வணக்கம், மனிதநேய ஆதரவற்றோர் காப்பகம் பற்றிய தகவல்களை அறிய விரும்புகிறேன்.'
                        : 'Hello, I would like to get more information about Manithaneyam Orphanage Home.'
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-theme-footer-link hover:text-emerald-400 transition-colors inline-flex items-center gap-1.5"
                    title={isTamil ? 'வாட்ஸ்அப் மூலம் தொடர்புகொள்ள' : 'Chat on WhatsApp'}
                  >
                    <span>{SITE_BRAND.phone2}</span>
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 shrink-0 text-brand-primary" />
                <a
                  href={`mailto:${SITE_BRAND.email}`}
                  className="text-theme-footer-link hover:text-theme-footer-link-hover hover:underline transition-colors"
                >
                  {SITE_BRAND.email}
                </a>
              </div>
            </div>

            {/* Social Icons with Hover Micro-Interactions */}
            <div className="pt-2 flex items-center gap-3">
              {[
                { name: 'Facebook', icon: 'FB' },
                { name: 'Instagram', icon: 'IG' },
                { name: 'YouTube', icon: 'YT' },
                { name: 'WhatsApp', icon: 'WA' },
              ].map((soc, idx) => (
                <span
                  key={idx}
                  className="w-8 h-8 rounded-full bg-white/5 hover:bg-brand-primary text-theme-footer-text hover:text-on-primary flex items-center justify-center text-xs font-bold transition-all duration-200 cursor-pointer border border-white/10 hover:-translate-y-1 hover:shadow-xs active:scale-95"
                  title={soc.name}
                >
                  {soc.icon}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Dignity Statement */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-theme-footer-text">
          <p>© 2026 {SITE_BRAND.nameEn}. All Rights Reserved.</p>

          <p className="flex items-center gap-1 text-theme-footer-text">
            <span>{isTamil ? 'அன்பாலும் மனிதநேயத்தாலும் கட்டப்பட்டது' : 'Built with Love and Compassion'}</span>
            <Heart className="w-3.5 h-3.5 text-heart fill-heart animate-pulse" />
          </p>

          <p className="text-[11px] text-theme-footer-text">
            {isTamil ? 'கோடாங்கிபட்டி, தேனி • தமிழ்நாடு' : 'Kodangipatti, Theni • Tamil Nadu'}
          </p>
        </div>
      </div>
    </footer>
  );
};
