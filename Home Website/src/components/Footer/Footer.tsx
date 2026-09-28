import React from 'react';
import {
  Heart,
  MapPin,
  Phone,
  Mail,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { NAV_ITEMS } from '../../data/siteData';
import { useLanguage } from '../../context/LanguageContext';
import { useAdminData } from '../../context/AdminDataContext';

export const Footer: React.FC = () => {
  const { isTamil } = useLanguage();
  const { brand: SITE_BRAND, locations: HOME_LOCATIONS } = useAdminData();

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
    <footer className="bg-theme-bg text-theme-text relative overflow-hidden border-t-4 border-theme-border">
      {/* Top Ochre Subtle Gradient Glow */}
      <div className="absolute top-0 left-1/4 right-1/4 h-[2px] bg-gradient-to-r from-transparent via-[#3B82F6] to-transparent" />

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          
          {/* Col 1: Brand & Tagline (5 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-20 h-20 rounded-full bg-theme-bg p-1 border border-theme-border/50 shadow-card hover:shadow-hover flex items-center justify-center">
                <img
                  src="/logo.png"
                  alt="Manithaneyam Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-theme-text font-tamil leading-tight">
                  {SITE_BRAND.fullNameTa}
                </h3>
                <p className="text-xs text-theme-text font-english tracking-wider uppercase font-medium">
                  {SITE_BRAND.nameEn}
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-theme-text leading-relaxed pt-2">
              {isTamil ? SITE_BRAND.taglineTa : SITE_BRAND.taglineEn}
            </p>

            <p className="text-xs text-theme-text leading-relaxed">
              {isTamil
                ? 'குழந்தைகள், பெண்கள் மற்றும் முதியோருக்கு பாதுகாப்பான இல்லம், கல்வி மற்றும் அன்பான வாழ்வாதார ஆதரவு.'
                : 'Providing dignified shelter, education, nutrition, and compassionate care for vulnerable children and elders.'}
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-theme-bg/60 border border-theme-border/30 text-xs text-theme-text">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isTamil ? 'கோடாங்கிபட்டி, தேனி மாவட்டம்' : 'Kodangipatti, Theni District'}</span>
            </div>
          </div>

          {/* Col 2: Quick Links (2.5 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-theme-text border-b border-theme-border/10 pb-2.5">
              {isTamil ? 'முக்கிய இணைப்புகள்' : 'Quick Navigation'}
            </h4>
            <ul className="space-y-2.5">
              {NAV_ITEMS.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => handleNavClick(item.href)}
                    className="flex items-center gap-2 text-sm text-theme-text hover:text-theme-text transition-colors cursor-pointer text-left"
                  >
                    <ArrowRight className="w-3.5 h-3.5 text-theme-text" />
                    <span>{isTamil ? item.labelTa : item.labelEn}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Our Homes (2.5 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-theme-text border-b border-theme-border/10 pb-2.5">
              {isTamil ? 'எங்கள் இல்லங்கள்' : 'Our Homes'}
            </h4>
            <ul className="space-y-2.5 text-sm text-theme-text">
              {HOME_LOCATIONS.map((home) => (
                <li key={home.id} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-theme-bg" />
                  <span>{isTamil ? home.titleTa : home.titleEn}</span>
                  {home.phone && (
                    <a href={`tel:${home.phone.replace(/[^+\d]/g, '')}`} className="opacity-80 hover:opacity-100">
                      · {home.phone}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Contact & Social (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-theme-text border-b border-theme-border/10 pb-2.5">
              {isTamil ? 'தொடர்புக்கு' : 'Direct Contact'}
            </h4>
            
            <div className="space-y-3 text-xs sm:text-sm text-theme-text">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-theme-text shrink-0 mt-0.5" />
                <span>{isTamil ? SITE_BRAND.fullAddressTa : SITE_BRAND.fullAddressEn}</span>
              </div>

              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-theme-text shrink-0" />
                <div className="flex flex-col">
                  <a href={`tel:${SITE_BRAND.phone1.replace(/\s+/g, '')}`} className="hover:text-theme-text">
                    {SITE_BRAND.phone1}
                  </a>
                  <a href={`tel:${SITE_BRAND.phone2.replace(/\s+/g, '')}`} className="hover:text-theme-text">
                    {SITE_BRAND.phone2}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-theme-text shrink-0" />
                <a href={`mailto:${SITE_BRAND.email}`} className="text-theme-text hover:underline">
                  {SITE_BRAND.email}
                </a>
              </div>
            </div>

            {/* Social Icons Placeholder */}
            <div className="pt-2 flex items-center gap-3">
              {[
                { name: 'Facebook', icon: 'FB' },
                { name: 'Instagram', icon: 'IG' },
                { name: 'YouTube', icon: 'YT' },
                { name: 'WhatsApp', icon: 'WA' },
              ].map((soc, idx) => (
                <span
                  key={idx}
                  className="w-8 h-8 rounded-full bg-theme-bg/10 hover:bg-theme-bg text-theme-text flex items-center justify-center text-xs font-bold transition-colors cursor-pointer border border-theme-border/10"
                  title={soc.name}
                >
                  {soc.icon}
                </span>
              ))}
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Dignity Statement */}
        <div className="mt-12 pt-8 border-t border-theme-border/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-theme-text">
          <p>© 2026 {SITE_BRAND.nameEn}. All Rights Reserved.</p>

          <p className="flex items-center gap-1 text-theme-text">
            <span>{isTamil ? 'அன்பாலும் மனிதநேயத்தாலும் கட்டப்பட்டது' : 'Built with Love and Compassion'}</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
          </p>

          <p className="text-[11px] text-theme-text">
            {isTamil ? 'கோடாங்கிபட்டி, தேனி • தமிழ்நாடு' : 'Kodangipatti, Theni • Tamil Nadu'}
          </p>
        </div>
      </div>
    </footer>
  );
};
