import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { api } from '../../services/api';
import type { AnnouncementItem } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

const DISMISSED_KEY = 'manithaneyam_announcement_dismissed';

interface ModalProps {
  imageUrl: string;
  onClose: () => void;
  alt?: string;
}

/** The popup itself: dark blurred overlay, rounded white frame, the image at its natural aspect ratio, and an X. */
export const AnnouncementModal: React.FC<ModalProps> = ({ imageUrl, onClose, alt }) => {
  const closeRef = useRef<HTMLButtonElement>(null);
  const { isTamil } = useLanguage();
  const resolvedAlt = alt ?? (isTamil ? 'அறிவிப்பு' : 'Announcement');

  useEffect(() => {
    // Keep the page behind the popup from scrolling
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={resolvedAlt}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onClose}
      className="fixed inset-0 z-[300] flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 12 }}
        transition={{ duration: 0.25 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-fit max-w-[850px] max-h-full overflow-auto rounded-2xl bg-white p-1.5 sm:p-2 shadow-2xl"
      >
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label={isTamil ? 'அறிவிப்பை மூடவும்' : 'Close announcement'}
          className="absolute top-2.5 right-2.5 sm:top-3.5 sm:right-3.5 z-10 w-9 h-9 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center shadow-lg ring-2 ring-white/80 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        <img
          src={imageUrl}
          alt={resolvedAlt}
          decoding="async"
          className="block w-auto h-auto max-w-full max-h-[calc(100dvh-4.5rem)] sm:max-h-[calc(100dvh-5.5rem)] rounded-xl object-contain"
        />
      </motion.div>
    </motion.div>
  );
};

const wasDismissed = (a: AnnouncementItem) => {
  try {
    return sessionStorage.getItem(DISMISSED_KEY) === `${a.imageUrl}|${a.updatedAt}`;
  } catch {
    return false;
  }
};

/**
 * Homepage popup. After the page has loaded it asks the backend for the active announcement;
 * if there is one (and its image really loads) it is shown once the preloader is done (`ready`), otherwise nothing happens.
 * Once closed it stays closed for the rest of the browser session, until a new announcement is published.
 */
export const AnnouncementPopup: React.FC<{ ready?: boolean }> = ({ ready = true }) => {
  // `pending` is fetched and preloaded in the background; it is shown only once the site is ready
  const [pending, setPending] = useState<AnnouncementItem | null>(null);
  const [announcement, setAnnouncement] = useState<AnnouncementItem | null>(null);

  useEffect(() => {
    let cancelled = false;

    const check = async () => {
      const active = await api.getAnnouncement();
      if (!active || cancelled || wasDismissed(active)) return;

      // Preload first: the popup only opens if the image is valid, and the image is downloaded only once
      const probe = new Image();
      probe.onload = () => !cancelled && setPending(active);
      probe.src = active.imageUrl;
    };

    if (document.readyState === 'complete') {
      check();
    } else {
      window.addEventListener('load', check, { once: true });
    }

    return () => {
      cancelled = true;
      window.removeEventListener('load', check);
    };
  }, []);

  // Open only after the site's preloader has finished (plus its 0.5s fade-out), so the popup never overlaps it
  useEffect(() => {
    if (!ready || !pending) return;
    const timer = window.setTimeout(() => setAnnouncement(pending), 600);
    return () => window.clearTimeout(timer);
  }, [ready, pending]);

  const close = () => {
    if (announcement) {
      try {
        sessionStorage.setItem(DISMISSED_KEY, `${announcement.imageUrl}|${announcement.updatedAt}`);
      } catch {
        /* private mode: it will simply show again on the next visit */
      }
    }
    setAnnouncement(null);
    setPending(null);
  };

  return (
    <AnimatePresence>
      {announcement && <AnnouncementModal key={announcement.imageUrl} imageUrl={announcement.imageUrl} onClose={close} />}
    </AnimatePresence>
  );
};
