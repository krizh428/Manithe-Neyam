import React, { useState, useLayoutEffect, useRef } from 'react';
import { MapPin, ArrowRight, Check, Phone, Mail, Network, Sparkles } from 'lucide-react';
import { SectionHeading } from '../components/Common/SectionHeading';
import type { HomeLocation } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useAdminData } from '../context/AdminDataContext';
import { LocationModal } from '../components/Modals/LocationModal';
import { PhotoSlider, photosOf } from '../components/Common/PhotoSlider';
import { gsap, EASING, prefersReducedMotion } from '../animations';

interface LocationsProps {
  onOpenSupport: () => void;
  onReplayOrgTree?: () => void;
}

export const Locations: React.FC<LocationsProps> = ({ onOpenSupport, onReplayOrgTree }) => {
  const { isTamil } = useLanguage();
  const { locations } = useAdminData();
  const [selectedLocation, setSelectedLocation] = useState<HomeLocation | null>(null);

  const sectionRef = useRef<HTMLElement | null>(null);
  const gridRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (!gridRef.current || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const cards = gridRef.current?.children;
      if (cards && cards.length > 0) {
        gsap.set(cards, { opacity: 0, y: 45 });
        gsap.to(cards, {
          opacity: 1,
          y: 0,
          duration: 0.75,
          stagger: 0.15,
          ease: EASING.cinematic,
          scrollTrigger: {
            trigger: gridRef.current,
            start: 'top 82%',
            once: true,
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [locations]);

  return (
    <section ref={sectionRef} id="locations" className="py-14 sm:py-20 bg-theme-bg relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        <SectionHeading
          badge={isTamil ? 'எங்கள் பாதுகாப்பு இல்லங்கள்' : 'Our Residential Facilities'}
          title={isTamil ? 'ஒவ்வொரு குழந்தைக்கும் பாதுகாப்பான அன்பான இல்லம்' : 'A Safe and Caring Home for Every Child'}
          subtitle={
            isTamil
              ? 'எங்கள் இல்லங்கள் குழந்தைகளுக்கு பாதுகாப்பான, சுகாதாரமான மற்றும் அன்பான சூழலை வழங்கும் வகையில் அமைக்கப்பட்டுள்ளன.'
              : 'Our homes are designed to provide children with a safe, hygienic and supportive environment to study, grow, and flourish.'
          }
        />

        {/* Interactive Organization Network Replay Trigger */}
        {onReplayOrgTree && (
          <div className="flex justify-center -mt-6 sm:-mt-8 mb-8 sm:mb-10">
            <button
              type="button"
              onClick={onReplayOrgTree}
              className="inline-flex items-center gap-2 px-4.5 py-2 rounded-full pill-badge text-xs sm:text-sm font-bold cursor-pointer group shadow-xs hover:shadow-card hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
              title={isTamil ? 'அமைப்பு வரைபடத்தை மீண்டும் காண்க' : 'Explore Organization Tree Animation'}
            >
              <Network className="w-4 h-4 pill-badge-icon group-hover:scale-110 transition-transform" />
              <span className="pill-badge-text">{isTamil ? 'எங்கள் சேவைகளை காண (அமைப்பு வரைபடம்)' : 'Explore Our Homes (Organization Network)'}</span>
              <Sparkles className="w-3.5 h-3.5 pill-badge-icon animate-pulse" />
            </button>
          </div>
        )}

        {/* Responsive CSS Grid: 1 col on Mobile, 2 col on Tablet, 3 col on Desktop */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 items-stretch"
        >
          {locations.map((home) => (
            <div
              key={home.id}
              className="bg-theme-card hover:bg-brand-bg/30 rounded-2xl border border-theme-border hover:border-brand-primary/80 shadow-soft hover:shadow-card-hover transition-all duration-300 flex flex-col overflow-hidden group hover:-translate-y-1.5 spotlight-card relative h-full"
            >
              {/* Compact Proportional Image Frame */}
              <div className="relative w-full h-44 sm:h-48 md:h-52 overflow-hidden bg-theme-bg shrink-0">
                <div className="w-full h-full transition-transform duration-500 ease-out group-hover:scale-105">
                  <PhotoSlider id={home.id} titleTa={home.titleTa} titleEn={home.titleEn} photos={photosOf(home)} />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent pointer-events-none" />

                {/* Number Badge */}
                <div className="absolute top-3 left-3 w-9 h-9 rounded-xl bg-theme-bg/95 backdrop-blur-md text-theme-text font-extrabold text-xs sm:text-sm flex items-center justify-center shadow-card border border-theme-border pointer-events-none group-hover:scale-105 transition-transform duration-300">
                  {home.number}
                </div>

                {/* Location Badge */}
                <div className="absolute bottom-3 left-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-brand-primary text-on-primary text-[11px] sm:text-xs font-bold shadow-md pointer-events-none">
                  <MapPin className="w-3 h-3" />
                  <span>{isTamil ? home.locationTa : home.locationEn}</span>
                </div>
              </div>

              {/* Card Body: Compact and well-proportioned */}
              <div className="p-4 sm:p-5 flex flex-col flex-grow justify-between">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-card-heading group-hover:text-brand-primary transition-colors mb-1.5 leading-snug line-clamp-1">
                    {isTamil ? home.titleTa : home.titleEn}
                  </h3>

                  <p className="text-xs sm:text-sm text-card-text leading-relaxed mb-3 line-clamp-2 min-h-[36px]">
                    {isTamil ? home.descTa : home.descEn}
                  </p>

                  {/* Highlights List */}
                  <div className="space-y-1.5 mb-3 border-t border-theme-border/80 pt-3">
                    {(isTamil ? home.featuresTa : home.featuresEn).slice(0, 2).map((feature, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-card-text-secondary">
                        <span className="w-4 h-4 rounded-full bg-brand-bg border border-theme-border flex items-center justify-center shrink-0">
                          <Check className="w-2.5 h-2.5 text-brand-primary stroke-[2.5]" />
                        </span>
                        <span className="truncate">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-3.5 flex flex-col gap-1 justify-center text-xs">
                  {home.phone && (
                    <a
                      href={`tel:${home.phone.replace(/[^+\d]/g, '')}`}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-card-text hover:text-brand-primary transition-colors"
                    >
                      <Phone className="w-3 h-3 text-brand-primary shrink-0" />
                      <span>{home.phone}</span>
                    </a>
                  )}
                  {home.email && (
                    <a
                      href={`mailto:${home.email}`}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-card-text hover:text-brand-primary transition-colors truncate"
                    >
                      <Mail className="w-3 h-3 text-brand-primary shrink-0" />
                      <span className="truncate">{home.email}</span>
                    </a>
                  )}
                </div>

                {/* Card Action Button */}
                <button
                  type="button"
                  onClick={() => setSelectedLocation(home)}
                  className="w-full py-2.5 px-4 rounded-xl bg-theme-bg border border-theme-border group-hover:bg-brand-primary group-hover:text-on-primary group-hover:border-brand-primary text-theme-text font-bold text-xs sm:text-sm transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer shadow-xs group-hover:shadow-card active:scale-[0.99]"
                >
                  <span>{isTamil ? 'விவரங்களை காண்க' : 'View Full Details'}</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Location Details Modal */}
      <LocationModal
        location={selectedLocation}
        onClose={() => setSelectedLocation(null)}
        onSupportClick={onOpenSupport}
      />
    </section>
  );
};
