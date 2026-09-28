import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { CheckCircle2, Eye, ImagePlus, Loader2, Power, Trash2, Upload, X } from 'lucide-react';
import { api, ApiError } from '../services/api';
import type { AnnouncementItem } from '../types';
import { AnnouncementModal } from '../components/Announcement/AnnouncementPopup';
import { SectionCard, buttonGhost, buttonPrimary } from './ui';

interface Props {
  onAuthError: () => void;
}

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_BYTES = 5 * 1024 * 1024;

const formatDateTime = (iso?: string) =>
  iso ? new Date(iso).toLocaleString(undefined, { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit' }) : '';

export const AnnouncementPanel: React.FC<Props> = ({ onAuthError }) => {
  const [current, setCurrent] = useState<AnnouncementItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [preview, setPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleError = useCallback(
    (err: unknown) => {
      if (err instanceof ApiError && (err.status === 401 || err.status === 403)) return onAuthError();
      setError(err instanceof Error ? err.message : 'Something went wrong');
    },
    [onAuthError]
  );

  useEffect(() => {
    api
      .getAdminAnnouncement()
      .then(setCurrent)
      .catch(handleError)
      .finally(() => setLoading(false));
  }, [handleError]);

  // Free the temporary preview URL of the chosen file
  useEffect(
    () => () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    },
    [previewUrl]
  );

  const chooseFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = e.target.files?.[0];
    e.target.value = '';
    setError('');
    setSuccess('');
    if (!picked) return;
    if (!ALLOWED_TYPES.includes(picked.type)) return setError('Please choose a JPG, PNG or WEBP image.');
    if (picked.size > MAX_BYTES) return setError('The image is larger than 5 MB. Please choose a smaller one.');
    setFile(picked);
    setPreviewUrl(URL.createObjectURL(picked));
  };

  const clearFile = () => {
    setFile(null);
    setPreviewUrl('');
  };

  const run = async (action: () => Promise<{ message: string; announcement?: AnnouncementItem | null }>) => {
    setBusy(true);
    setError('');
    setSuccess('');
    try {
      const result = await action();
      if ('announcement' in result) setCurrent(result.announcement ?? null);
      setSuccess(result.message);
      return true;
    } catch (err) {
      handleError(err);
      return false;
    } finally {
      setBusy(false);
    }
  };

  const publish = async () => {
    if (!file) return;
    if (await run(() => api.publishAnnouncement(file))) clearFile();
  };

  const toggle = () => current && run(() => api.setAnnouncementActive(!current.isActive));

  const remove = () => {
    if (!window.confirm('Remove the announcement and delete its image?')) return;
    run(async () => ({ ...(await api.removeAnnouncement()), announcement: null }));
  };

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="w-7 h-7 animate-spin text-brand-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      {success && (
        <p className="flex items-center gap-2 text-sm font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 rounded-lg px-4 py-2.5">
          <CheckCircle2 className="w-4 h-4 shrink-0" /> {success}
        </p>
      )}
      {error && (
        <p className="text-sm font-medium text-red-600 dark:text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-2.5">{error}</p>
      )}

      <SectionCard title="Current announcement" description="What visitors see in the popup when they open the website.">
        {current ? (
          <>
            <div className="rounded-xl border border-theme-border bg-theme-secondary p-2 flex justify-center">
              <img src={current.imageUrl} alt="Current announcement" className="max-h-80 w-auto max-w-full rounded-lg object-contain" />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm font-semibold text-theme-text-secondary">Status</span>
              <span
                className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${
                  current.isActive ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400' : 'bg-slate-500/15 text-slate-600 dark:text-slate-300'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${current.isActive ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                {current.isActive ? 'Active — visible on the website' : 'Off — hidden from visitors'}
              </span>
              <span className="text-xs text-theme-text-muted sm:ml-auto">Updated {formatDateTime(current.updatedAt)}</span>
            </div>

            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={toggle} disabled={busy} className={buttonGhost}>
                <Power className="w-4 h-4" /> {current.isActive ? 'Disable' : 'Enable'}
              </button>
              <button type="button" onClick={() => setPreview(current.imageUrl)} className={buttonGhost}>
                <Eye className="w-4 h-4" /> Preview
              </button>
              <button type="button" onClick={remove} disabled={busy} className={`${buttonGhost} text-red-500`}>
                <Trash2 className="w-4 h-4" /> Remove
              </button>
            </div>
          </>
        ) : (
          <p className="text-sm text-theme-text-muted">No announcement yet. Upload an image below to create one.</p>
        )}
      </SectionCard>

      <SectionCard
        title={current ? 'Replace announcement' : 'Upload announcement'}
        description="JPG, PNG or WEBP, up to 5 MB. Publishing replaces the current announcement immediately."
      >
        <input ref={fileRef} type="file" accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp" className="hidden" onChange={chooseFile} />

        {previewUrl && (
          <div className="rounded-xl border border-brand-primary/40 bg-theme-secondary p-2 flex justify-center relative">
            <img src={previewUrl} alt="New announcement preview" className="max-h-80 w-auto max-w-full rounded-lg object-contain" />
            <button
              type="button"
              onClick={clearFile}
              aria-label="Remove chosen image"
              className="absolute top-3 right-3 w-7 h-7 rounded-full bg-theme-card border border-theme-border shadow flex items-center justify-center text-red-500"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
        {file && (
          <p className="text-xs text-theme-text-muted">
            {file.name} · {(file.size / 1024 / 1024).toFixed(2)} MB — not published yet
          </p>
        )}

        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => fileRef.current?.click()} disabled={busy} className={buttonGhost}>
            <ImagePlus className="w-4 h-4" /> {file ? 'Choose a different image' : 'Choose image'}
          </button>
          <button type="button" onClick={() => previewUrl && setPreview(previewUrl)} disabled={!file} className={buttonGhost}>
            <Eye className="w-4 h-4" /> Preview
          </button>
          <button type="button" onClick={publish} disabled={!file || busy} className={buttonPrimary}>
            {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            Publish announcement
          </button>
        </div>
      </SectionCard>

      <AnimatePresence>
        {preview && <AnnouncementModal key="preview" imageUrl={preview} onClose={() => setPreview(null)} alt="Announcement preview" />}
      </AnimatePresence>
    </div>
  );
};
