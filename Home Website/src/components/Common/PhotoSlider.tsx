import React, { useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { LightboxModal } from '../Lightbox/LightboxModal';
import type { GalleryItem } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

/** Photos of an item: up to 6. Falls back to the single `image` for items saved before multi-photo existed. */
export const photosOf = (item: { image?: string; images?: string[] }): string[] => {
  const photos = (item.images ?? []).filter(Boolean);
  return photos.length ? photos.slice(0, 6) : item.image ? [item.image] : [];
};

const SWIPE_DISTANCE = 60;

/**
 * Slide view for a card image: arrows, swipe, dots and a counter. Tapping a photo opens the same
 * full-size viewer the Gallery uses. Fills its (relatively positioned) parent.
 */
export const PhotoSlider: React.FC<{ id: string; titleTa: string; titleEn: string; photos: string[] }> = ({
  id,
  titleTa,
  titleEn,
  photos,
}) => {
  const { isTamil } = useLanguage();
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);

  const title = isTamil ? titleTa : titleEn;
  const count = photos.length;
  const current = Math.min(index, Math.max(count - 1, 0));
  // Gesture handlers can outlive a render, so they read the live index from a ref
  const currentRef = useRef(current);
  currentRef.current = current;
  // A swipe also ends with a "tap" event; it must not open the full-size viewer
  const dragging = useRef(false);

  const go = (delta: number) => {
    if (count < 2) return;
    setDirection(delta);
    setIndex((currentRef.current + delta + count) % count);
  };

  // The gallery viewer expects gallery items, so each photo is described as one
  const viewerItems: GalleryItem[] = photos.map((image, i) => ({
    id: `${id}-photo-${i}`,
    category: 'all',
    titleTa,
    titleEn,
    captionTa: `${i + 1} / ${count}`,
    captionEn: `${i + 1} / ${count}`,
    momentDateTa: '',
    momentDateEn: '',
    detailedStoryTa: '',
    detailedStoryEn: '',
    image,
    altTa: titleTa,
    altEn: titleEn,
  }));

  if (count === 0) return <div className="absolute inset-0 bg-theme-secondary" />;

  return (
    <>
      <div className="absolute inset-0 overflow-hidden">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.img
            key={photos[current]}
            src={photos[current]}
            alt={`${title} — ${current + 1}/${count}`}
            custom={direction}
            variants={{
              enter: (d: number) => ({ x: d > 0 ? '100%' : '-100%', opacity: 0.6 }),
              center: { x: 0, opacity: 1 },
              exit: (d: number) => ({ x: d > 0 ? '-100%' : '100%', opacity: 0.6 }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35, ease: 'easeOut' }}
            drag={count > 1 ? 'x' : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragStart={() => {
              dragging.current = true;
            }}
            onDragEnd={(_, info) => {
              window.setTimeout(() => {
                dragging.current = false;
              }, 100);
              if (info.offset.x < -SWIPE_DISTANCE) go(1);
              else if (info.offset.x > SWIPE_DISTANCE) go(-1);
            }}
            onTap={() => !dragging.current && setViewerIndex(currentRef.current)}
            className="absolute inset-0 w-full h-full object-cover cursor-zoom-in"
          />
        </AnimatePresence>
      </div>

      {count > 1 && (
        <>
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous photo"
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/45 hover:bg-black/70 text-white flex items-center justify-center opacity-90 sm:opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next photo"
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/45 hover:bg-black/70 text-white flex items-center justify-center opacity-90 sm:opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <span className="absolute top-3 right-3 z-20 px-2 py-0.5 rounded-full bg-black/55 text-white text-xs font-semibold pointer-events-none">
            {current + 1} / {count}
          </span>

          <div className="absolute bottom-3.5 right-4 z-20 flex gap-1.5">
            {photos.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Show photo ${i + 1}`}
                onClick={() => {
                  setDirection(i > current ? 1 : -1);
                  setIndex(i);
                }}
                className={`h-1.5 rounded-full transition-all ${i === current ? 'w-4 bg-white' : 'w-1.5 bg-white/55 hover:bg-white/80'}`}
              />
            ))}
          </div>
        </>
      )}

      {/* Portal: the card has a hover transform, which would otherwise trap the full-screen viewer inside it */}
      {createPortal(
        <LightboxModal
          items={viewerItems}
          currentIndex={viewerIndex}
          onClose={() => setViewerIndex(null)}
          onNext={() => setViewerIndex((i) => (i === null ? null : (i + 1) % count))}
          onPrev={() => setViewerIndex((i) => (i === null ? null : (i - 1 + count) % count))}
        />,
        document.body
      )}
    </>
  );
};
