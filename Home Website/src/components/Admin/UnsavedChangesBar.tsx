import React, { useEffect, useRef, useState } from 'react';
import { CheckCircle2, RotateCcw, Save } from 'lucide-react';
import { useAdminData } from '../../context/AdminDataContext';

/**
 * Floating "Save changes" bar for the admin. Edits stay as a draft until Save is pressed;
 * saving writes them and records what changed (with the optional note) in the Change history.
 */
export const UnsavedChangesBar: React.FC = () => {
  const { isAdmin, hasUnsavedChanges, saveChanges, discardChanges } = useAdminData();
  const [note, setNote] = useState('');
  const [message, setMessage] = useState('');
  const timer = useRef<number>(undefined);

  // Warn before closing / reloading the tab with unsaved edits
  useEffect(() => {
    if (!hasUnsavedChanges) return;
    const warn = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [hasUnsavedChanges]);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  if (!isAdmin) return null;

  const handleSave = () => {
    const count = saveChanges(note);
    setNote('');
    setMessage(count > 0 ? `Saved — ${count} change${count === 1 ? '' : 's'} recorded in the Change history.` : 'Saved.');
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setMessage(''), 3500);
  };

  const handleDiscard = () => {
    if (window.confirm('Discard all unsaved changes and go back to the last saved version?')) {
      discardChanges();
      setNote('');
    }
  };

  if (!hasUnsavedChanges) {
    return message ? (
      <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[90] flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 text-white text-sm font-medium shadow-xl">
        <CheckCircle2 className="w-4 h-4" /> {message}
      </div>
    ) : null;
  }

  return (
    <div className="fixed bottom-4 inset-x-4 z-[90] mx-auto max-w-3xl rounded-2xl border border-brand-primary/40 bg-theme-card text-theme-text shadow-2xl p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center gap-3">
      <div className="flex items-center gap-2 shrink-0">
        <span className="relative flex w-2.5 h-2.5">
          <span className="absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75 animate-ping" />
          <span className="relative inline-flex rounded-full w-2.5 h-2.5 bg-amber-500" />
        </span>
        <span className="text-sm font-semibold">Unsaved changes</span>
      </div>
      <input
        value={note}
        onChange={(e) => setNote(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSave()}
        placeholder="Describe what you changed (optional)"
        className="flex-1 min-w-0 px-3 py-2 rounded-lg border border-theme-border bg-theme-bg text-sm placeholder:text-theme-text-muted focus:outline-none focus:ring-2 focus:ring-brand-primary/40"
      />
      <div className="flex gap-2 shrink-0">
        <button
          type="button"
          onClick={handleDiscard}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-theme-border text-sm font-medium hover:bg-theme-secondary transition-colors"
        >
          <RotateCcw className="w-4 h-4" /> Discard
        </button>
        <button
          type="button"
          onClick={handleSave}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-brand-primary text-on-primary text-sm font-semibold hover:bg-brand-hover transition-colors"
        >
          <Save className="w-4 h-4" /> Save changes
        </button>
      </div>
    </div>
  );
};
