import React, { useEffect, useRef, useState } from 'react';
import { ImagePlus, Loader2, Trash2, ChevronDown, ChevronLeft, ChevronRight, Star, X } from 'lucide-react';
import { api } from '../services/api';

export const inputClass =
  'w-full px-3 py-2 rounded-lg border border-theme-border bg-theme-bg text-theme-text text-sm placeholder:text-theme-text-muted focus:outline-none focus:ring-2 focus:ring-brand-primary/40 focus:border-brand-primary transition';

export const cardClass = 'bg-theme-card border border-theme-border rounded-2xl shadow-sm';

export const buttonPrimary =
  'inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-primary text-on-primary text-sm font-semibold hover:bg-brand-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors';

export const buttonGhost =
  'inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-theme-border text-theme-text text-sm font-medium hover:bg-theme-secondary disabled:opacity-50 transition-colors';

export const FieldLabel: React.FC<{ children: React.ReactNode; hint?: string }> = ({ children, hint }) => (
  <label className="block text-xs font-semibold text-theme-text-secondary mb-1">
    {children}
    {hint && <span className="ml-1 font-normal text-theme-text-muted">— {hint}</span>}
  </label>
);

interface TextFieldProps {
  label: string;
  value: string | number | undefined;
  onChange: (value: string) => void;
  hint?: string;
  type?: 'text' | 'number' | 'email' | 'url';
  placeholder?: string;
}

export const TextField: React.FC<TextFieldProps> = ({ label, value, onChange, hint, type = 'text', placeholder }) => (
  <div>
    <FieldLabel hint={hint}>{label}</FieldLabel>
    <input
      type={type}
      value={value ?? ''}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className={inputClass}
    />
  </div>
);

interface AreaFieldProps {
  label: string;
  value: string | undefined;
  onChange: (value: string) => void;
  rows?: number;
  hint?: string;
}

export const AreaField: React.FC<AreaFieldProps> = ({ label, value, onChange, rows = 3, hint }) => (
  <div>
    <FieldLabel hint={hint}>{label}</FieldLabel>
    <textarea rows={rows} value={value ?? ''} onChange={(e) => onChange(e.target.value)} className={`${inputClass} resize-y`} />
  </div>
);

interface LinesFieldProps {
  label: string;
  value: string[] | undefined;
  onChange: (value: string[]) => void;
  rows?: number;
  hint?: string;
}

/** A list of strings edited as one line each. Blank lines are dropped when the field loses focus. */
export const LinesField: React.FC<LinesFieldProps> = ({ label, value, onChange, rows = 4, hint }) => {
  const external = (value || []).join('\n');
  const [text, setText] = useState(external);
  const focused = useRef(false);

  useEffect(() => {
    if (!focused.current) setText(external);
  }, [external]);

  return (
    <div>
      <FieldLabel hint={hint ?? 'one item per line'}>{label}</FieldLabel>
      <textarea
        rows={rows}
        value={text}
        onFocus={() => (focused.current = true)}
        onChange={(e) => {
          setText(e.target.value);
          onChange(e.target.value.split('\n'));
        }}
        onBlur={() => {
          focused.current = false;
          const cleaned = text.split('\n').map((l) => l.trim()).filter(Boolean);
          setText(cleaned.join('\n'));
          onChange(cleaned);
        }}
        className={`${inputClass} resize-y`}
      />
    </div>
  );
};

interface SelectFieldProps {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}

export const SelectField: React.FC<SelectFieldProps> = ({ label, value, options, onChange }) => (
  <div>
    <FieldLabel>{label}</FieldLabel>
    <select value={value} onChange={(e) => onChange(e.target.value)} className={inputClass}>
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  </div>
);

interface ImageFieldProps {
  label: string;
  value: string | undefined;
  onChange: (url: string) => void;
}

/** Shows the current image; upload a new one from your device or paste a link. */
export const ImageField: React.FC<ImageFieldProps> = ({ label, value, onChange }) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/')) return setError('Please choose an image file.');
    if (file.size > 5 * 1024 * 1024) return setError('Image is larger than 5 MB.');

    setError('');
    setUploading(true);
    try {
      onChange(await api.uploadImage(file));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <div className="flex gap-3 items-start">
        <div className="w-28 h-20 shrink-0 rounded-lg overflow-hidden border border-theme-border bg-theme-secondary flex items-center justify-center">
          {value ? (
            <img src={value} alt="" className="w-full h-full object-cover" />
          ) : (
            <ImagePlus className="w-6 h-6 text-theme-text-muted" />
          )}
        </div>
        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex gap-2">
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
            <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading} className={buttonGhost}>
              {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImagePlus className="w-4 h-4" />}
              {uploading ? 'Uploading…' : 'Upload image'}
            </button>
          </div>
          <input
            type="text"
            value={value?.startsWith('data:') ? '(uploaded image)' : value ?? ''}
            readOnly={value?.startsWith('data:')}
            placeholder="…or paste an image link"
            onChange={(e) => onChange(e.target.value)}
            className={`${inputClass} text-xs`}
          />
          {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
      </div>
    </div>
  );
};

/** Renders the Tamil field and the English field side by side. */
export const Bilingual: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
);

interface AccordionItemProps {
  title: string;
  subtitle?: string;
  image?: string;
  open: boolean;
  onToggle: () => void;
  onDelete?: () => void;
  children: React.ReactNode;
}

export const AccordionItem: React.FC<AccordionItemProps> = ({ title, subtitle, image, open, onToggle, onDelete, children }) => (
  <div className={`${cardClass} overflow-hidden`}>
    <div className="flex items-center gap-3 p-3">
      <button type="button" onClick={onToggle} className="flex-1 flex items-center gap-3 min-w-0 text-left">
        {image !== undefined && (
          <span className="w-12 h-12 rounded-lg overflow-hidden bg-theme-secondary shrink-0 border border-theme-border">
            {image && <img src={image} alt="" className="w-full h-full object-cover" />}
          </span>
        )}
        <span className="min-w-0 flex-1">
          <span className="block font-semibold text-sm text-theme-text truncate">{title || 'Untitled'}</span>
          {subtitle && <span className="block text-xs text-theme-text-muted truncate">{subtitle}</span>}
        </span>
        <ChevronDown className={`w-4 h-4 text-theme-text-muted transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {onDelete && (
        <button
          type="button"
          onClick={onDelete}
          title="Delete"
          className="p-2 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )}
    </div>
    {open && <div className="p-4 pt-2 border-t border-theme-border space-y-4">{children}</div>}
  </div>
);

export const SectionCard: React.FC<{ title: string; description?: string; children: React.ReactNode }> = ({
  title,
  description,
  children,
}) => (
  <div className={`${cardClass} p-5 space-y-4`}>
    <div>
      <h3 className="font-bold text-theme-text">{title}</h3>
      {description && <p className="text-xs text-theme-text-muted mt-0.5">{description}</p>}
    </div>
    {children}
  </div>
);

interface MultiImageFieldProps {
  label: string;
  value: string[];
  onChange: (urls: string[]) => void;
  max?: number;
}

/** Several photos (default up to 6). The first photo is the cover; any other photo can be made the cover. */
export const MultiImageField: React.FC<MultiImageFieldProps> = ({ label, value, onChange, max = 6 }) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const latest = useRef(value);
  latest.current = value;
  const [uploading, setUploading] = useState(0);
  const [error, setError] = useState('');

  const addFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = Array.from(e.target.files ?? []);
    e.target.value = '';
    if (picked.length === 0) return;

    setError('');
    const room = max - latest.current.length;
    const valid = picked.filter((f) => f.type.startsWith('image/') && f.size <= 5 * 1024 * 1024);
    if (valid.length < picked.length) setError('Some files were skipped: photos must be images up to 5 MB.');
    if (valid.length > room) setError(`Only ${max} photos are allowed, so some files were skipped.`);
    const files = valid.slice(0, Math.max(room, 0));
    if (files.length === 0) return;

    setUploading(files.length);
    try {
      const urls: string[] = [];
      for (const file of files) urls.push(await api.uploadImage(file));
      onChange([...latest.current, ...urls]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(0);
    }
  };

  const remove = (index: number) => onChange(value.filter((_, i) => i !== index));
  const makeCover = (index: number) => onChange([value[index], ...value.filter((_, i) => i !== index)]);
  const move = (index: number, delta: number) => {
    const target = index + delta;
    if (target < 0 || target >= value.length) return;
    const next = [...value];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  return (
    <div>
      <FieldLabel hint={`${value.length} of ${max} photos — use the arrows to set the order; the first photo is the cover`}>{label}</FieldLabel>
      <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={addFiles} />
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {value.map((url, i) => (
          <div key={`${url}-${i}`} className="relative group rounded-lg overflow-hidden border border-theme-border bg-theme-secondary">
            <img src={url} alt="" className="w-full h-24 object-cover" />
            {i === 0 && (
              <span className="absolute left-1.5 top-1.5 px-1.5 py-0.5 rounded bg-brand-primary text-on-primary text-[10px] font-semibold">Cover</span>
            )}
            {i !== 0 && (
              <span className="absolute left-1.5 top-1.5 w-5 h-5 rounded bg-black/60 text-white text-[10px] font-semibold flex items-center justify-center">
                {i + 1}
              </span>
            )}
            {value.length > 1 && (
              <div className="absolute inset-x-1.5 bottom-1.5 flex justify-between">
                <button
                  type="button"
                  title="Move earlier"
                  disabled={i === 0}
                  onClick={() => move(i, -1)}
                  className="w-6 h-6 rounded-full bg-theme-card/95 border border-theme-border shadow flex items-center justify-center text-theme-text disabled:opacity-30"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  title="Move later"
                  disabled={i === value.length - 1}
                  onClick={() => move(i, 1)}
                  className="w-6 h-6 rounded-full bg-theme-card/95 border border-theme-border shadow flex items-center justify-center text-theme-text disabled:opacity-30"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
            <div className="absolute right-1.5 top-1.5 flex gap-1">
              {i !== 0 && (
                <button
                  type="button"
                  title="Make this the cover photo"
                  onClick={() => makeCover(i)}
                  className="w-6 h-6 rounded-full bg-theme-card/95 border border-theme-border shadow flex items-center justify-center text-amber-500"
                >
                  <Star className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                type="button"
                title="Remove this photo"
                onClick={() => remove(i)}
                className="w-6 h-6 rounded-full bg-theme-card/95 border border-theme-border shadow flex items-center justify-center text-red-500"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
        {Array.from({ length: uploading }).map((_, i) => (
          <div key={`up-${i}`} className="h-24 rounded-lg border border-dashed border-theme-border flex items-center justify-center">
            <Loader2 className="w-5 h-5 animate-spin text-brand-primary" />
          </div>
        ))}
        {value.length + uploading < max && (
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="h-24 rounded-lg border-2 border-dashed border-theme-border text-theme-text-muted hover:border-brand-primary hover:text-brand-primary flex flex-col items-center justify-center gap-1 text-xs transition-colors"
          >
            <ImagePlus className="w-5 h-5" /> Add photos
          </button>
        )}
      </div>
      {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
    </div>
  );
};
