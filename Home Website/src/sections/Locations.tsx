import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, ArrowRight, Check, Phone, Mail } from 'lucide-react';
import { SectionHeading } from '../components/Common/SectionHeading';
import type { HomeLocation } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useAdminData } from '../context/AdminDataContext';
import { LocationModal } from '../components/Modals/LocationModal';
import { PhotoSlider, photosOf } from '../components/Common/PhotoSlider';

interface LocationsProps {
  onOpenSupport: () => void;
}

export const Locations: React.FC<LocationsProps> = ({ onOpenSupport }) => {
  const { isTamil } = useLanguage();
  const { locations } = useAdminData();
  const [selectedLocation, setSelectedLocation] = useState<HomeLocation | null>(null);

  return (
    <section id="locations" className="py-20 sm:py-28 bg-theme-bg relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeading
          badge={isTamil ? 'எங்கள் பாதுகாப்பு இல்லங்கள்' : 'Our Residential Facilities'}
          title={isTamil ? 'ஒவ்வொரு குழந்தைக்கும் பாதுகாப்பான அன்பான இல்லம்' : 'A Safe and Caring Home for Every Child'}
          subtitle={
            isTamil
              ? 'எங்கள் இல்லங்கள் குழந்தைகளுக்கு பாதுகாப்பான, சுகாதாரமான மற்றும் அன்பான சூழலை வழங்கும் வகையில் அமைக்கப்பட்டுள்ளன. குழந்தைகள் கல்வி கற்கவும், விளையாடவும், ஓய்வெடுக்கவும், தங்களின் தனிப்பட்ட திறமைகளை வளர்த்துக் கொள்ளவும் ஏற்ற சூழலை உருவாக்குவதில் நாங்கள் கவனம் செலுத்துகிறோம்.'
              : 'Our homes are designed to provide children with a safe, hygienic and supportive environment. We focus on creating a comfortable atmosphere where children can study, play, rest and develop their individual talents.'
          }
        />

        {/* 3 Home Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          {locations.map((home, index) => (
            <motion.div
              key={home.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: index * 0.15, duration: 0.6 }}
              whileHover={{ y: -6 }}
              className="bg-theme-card hover:bg-brand-bg rounded-3xl border border-theme-border hover:border-brand-primary shadow-soft hover:shadow-card-hover transition-all duration-300 flex flex-col overflow-hidden group"
            >
              {/* Image Frame */}
              <div className="relative h-56 w-full overflow-hidden bg-theme-bg">
                <PhotoSlider id={home.id} titleTa={home.titleTa} titleEn={home.titleEn} photos={photosOf(home)} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                {/* Number Badge */}
                <div className="absolute top-4 left-4 w-11 h-11 rounded-2xl bg-theme-bg/95 backdrop-blur-xs text-theme-text font-extrabold text-base flex items-center justify-center shadow-card hover:shadow-hover border border-theme-border pointer-events-none">
                  {home.number}
                </div>

                {/* Location Badge */}
                <div className="absolute bottom-3 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4AF37] backdrop-blur-xs text-[#5C3A21] text-xs font-bold shadow-xs pointer-events-none">
                  <MapPin className="w-3.5 h-3.5 text-[#5C3A21]" />
                  <span>{isTamil ? home.locationTa : home.locationEn}</span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 sm:p-7 flex flex-col flex-grow justify-between">
                <div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-card-heading transition-colors mb-2.5">
                    {isTamil ? home.titleTa : home.titleEn}
                  </h3>

                  <p className="text-sm text-card-text leading-relaxed mb-5">
                    {isTamil ? home.descTa : home.descEn}
                  </p>

                  {/* Highlights List */}
                  <div className="space-y-2 mb-6 border-t border-theme-border/80 pt-4">
                    {(isTamil ? home.featuresTa : home.featuresEn).slice(0, 3).map((feature, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-card-text-secondary">
                        <span className="w-4 h-4 rounded-full bg-brand-bg border border-theme-border flex items-center justify-center shrink-0">
                          <Check className="w-2.5 h-2.5 text-brand-primary" />
                        </span>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {(home.phone || home.email) && (
                  <div className="mb-4 flex flex-col gap-1.5">
                    {home.phone && (
                      <a
                        href={`tel:${home.phone.replace(/[^+\d]/g, '')}`}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-card-text hover:text-brand-primary transition-colors"
                      >
                        <Phone className="w-4 h-4" />
                        <span>{home.phone}</span>
                      </a>
                    )}
                    {home.email && (
                      <a
                        href={`mailto:${home.email}`}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-card-text hover:text-brand-primary transition-colors"
                      >
                        <Mail className="w-4 h-4" />
                        <span>{home.email}</span>
                      </a>
                    )}
                  </div>
                )}

                {/* Card Action Button */}
                <button
                  onClick={() => setSelectedLocation(home)}
                  className="w-full py-3 px-5 rounded-full bg-theme-bg border border-theme-border group-hover:bg-theme-bg group-hover:text-theme-text group-hover:border-theme-border text-theme-text font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <span>{isTamil ? 'விவரங்களை காண்க' : 'View Full Details'}</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </motion.div>
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
