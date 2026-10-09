import React from 'react';
import { SectionHeading } from '../components/Common/SectionHeading';
import { useLanguage } from '../context/LanguageContext';
import { useAdminData } from '../context/AdminDataContext';
import { TalentServiceCard } from '../components/Cards/TalentServiceCard';

export const Services: React.FC = () => {
  const { isTamil } = useLanguage();
  const { services } = useAdminData();

  return (
    <section id="services" className="py-20 sm:py-28 bg-theme-bg relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeading
          badge={isTamil ? 'நமது பணிகள்' : 'What We Do'}
          title={isTamil ? 'எங்கள் சேவைகள்' : 'Our Humanitarian Services'}
          enableGlitch={true}
          useBrushFont={!isTamil}
          isTamil={isTamil}
          subtitle={
            isTamil
              ? 'குழந்தைகளின் எதிர்காலம், முதியோரின் ஆரோக்கியம் மற்றும் சமூகத்தின் வளர்ச்சிக்கான முழுமையான மனிதநேய சேவைகள்.'
              : 'Holistic care covering education, healthcare, nutrition, shelter, and community empowerment.'
          }
        />

        {/* Premium Services Grid with Talent Development Design and Staggered Animations */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mt-12">
          {services.map((service, index) => (
            <TalentServiceCard
              key={service.id}
              service={service}
              isTamil={isTamil}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

