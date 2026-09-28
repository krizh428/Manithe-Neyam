import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Image as ImageIcon } from 'lucide-react';
import { SectionHeading } from '../components/Common/SectionHeading';
import { ACTIVITY_CATEGORIES } from '../data/siteData';
import type { ActivityCategory } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useAdminData } from '../context/AdminDataContext';
import { LightboxModal } from '../components/Lightbox/LightboxModal';
import { photosOf } from '../components/Common/PhotoSlider';
import type { GalleryItem } from '../types';

export const GalleryPreview: React.FC = () => {
  const { isTamil } = useLanguage();
  const { gallery } = useAdminData();
  const [activeCategory, setActiveCategory] = useState<ActivityCategory>('all');
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);

  const filteredItems =
    activeCategory === 'all'
      ? gallery
      : gallery.filter((item) => item.category === activeCategory);

  // The full-screen viewer pages through every photo of every item (an item can have up to 6 photos)
  const slides: GalleryItem[] = filteredItems.flatMap((item) => {
    const photos = photosOf(item);
    return photos.map((image, i) => {
      const tag = photos.length > 1 ? ` (${i + 1}/${photos.length})` : '';
      return { ...item, id: `${item.id}-${i}`, image, captionTa: `${item.captionTa}${tag}`, captionEn: `${item.captionEn}${tag}` };
    });
  });
  const firstSlideOf = (index: number) =>
    filteredItems.slice(0, index).reduce((total, item) => total + Math.max(photosOf(item).length, 1), 0);

  const handleNext = () => {
    if (selectedPhotoIndex === null || slides.length === 0) return;
    setSelectedPhotoIndex((selectedPhotoIndex + 1) % slides.length);
  };

  const handlePrev = () => {
    if (selectedPhotoIndex === null || slides.length === 0) return;
    setSelectedPhotoIndex((selectedPhotoIndex - 1 + slides.length) % slides.length);
  };

  return (
    <section id="gallery" className="py-20 sm:py-28 bg-theme-bg relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeading
          badge={isTamil ? 'நினைவுகள்' : 'Visual Moments'}
          title={isTamil ? 'புகைப்பட கேலரி' : 'Moments of Love & Humanity'}
          subtitle={
            isTamil
              ? 'குழந்தைகளின் கல்வி, புன்னகை மற்றும் முதியோரின் அமைதியான வாழ்க்கையின் சில நிழற்பட தருணங்கள்.'
              : 'Glimpses into the daily life, smiles, learning, and celebration across our homes.'
          }
        />

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-10">
          {ACTIVITY_CATEGORIES.map((cat) => {
            const isSelected = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`relative px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-primary ${
                  isSelected
                    ? 'text-white shadow-xs'
                    : 'bg-theme-bg text-theme-text hover:text-brand-primary border border-theme-border'
                }`}
              >
                {isSelected && (
                  <motion.div
                    layoutId="galleryFilterPill"
                    className="absolute inset-0 bg-brand-primary rounded-full"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{isTamil ? cat.labelTa : cat.labelEn}</span>
              </button>
            );
          })}
        </div>

        {/* Gallery Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence>
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                onClick={() => setSelectedPhotoIndex(firstSlideOf(index))}
                className="group relative rounded-3xl overflow-hidden aspect-[4/3] bg-theme-bg cursor-pointer border border-theme-border shadow-soft hover:shadow-card-hover"
              >
                <img
                  src={item.image}
                  alt={isTamil ? item.altTa : item.altEn}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Dark Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-6">
                  <div className="flex justify-end">
                    <div className="w-10 h-10 rounded-full bg-theme-bg/30 backdrop-blur-md text-theme-text flex items-center justify-center shadow-card hover:shadow-hover">
                      <Eye className="w-5 h-5" />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-lg font-bold text-theme-text font-tamil">
                        {isTamil ? item.titleTa : item.titleEn}
                      </h4>
                      <span className="text-[10px] font-bold text-theme-text bg-black/40 px-2 py-0.5 rounded-full">
                        {isTamil ? item.momentDateTa : item.momentDateEn}
                      </span>
                    </div>
                    <p className="text-xs text-theme-text line-clamp-1">
                      {isTamil ? item.detailedStoryTa || item.captionTa : item.detailedStoryEn || item.captionEn}
                    </p>
                  </div>
                </div>

                {/* How many photos this moment has */}
                {photosOf(item).length > 1 && (
                  <div className="absolute top-3 left-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/60 text-white text-xs font-semibold backdrop-blur-xs">
                    <ImageIcon className="w-3.5 h-3.5" />
                    {photosOf(item).length}
                  </div>
                )}

                {/* Static indicator icon for mobile */}
                <div className="absolute bottom-3 right-3 p-1.5 rounded-full bg-black/40 text-theme-text group-hover:opacity-0 transition-opacity sm:hidden">
                  <ImageIcon className="w-3.5 h-3.5" />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Interactive Lightbox */}
      <LightboxModal
        items={slides}
        currentIndex={selectedPhotoIndex}
        onClose={() => setSelectedPhotoIndex(null)}
        onNext={handleNext}
        onPrev={handlePrev}
      />
    </section>
  );
};
