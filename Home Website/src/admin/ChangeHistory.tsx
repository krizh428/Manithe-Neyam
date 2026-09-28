import React, { useMemo, useState } from 'react';
import { ArrowRight, FileText, History, Image as ImageIcon, Plus, Pencil, RotateCcw, Search, Trash2 } from 'lucide-react';
import { useAdminData } from '../context/AdminDataContext';
import type { Attachment, ChangeEntry, FieldChange } from '../types';
import { buttonGhost, cardClass, inputClass } from './ui';

export const formatDateTime = (iso: string) =>
  new Date(iso).toLocaleString(undefined, { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit' });

const ACTION_STYLE: Record<ChangeEntry['action'], { label: string; className: string; icon: React.ElementType }> = {
  edit: { label: 'Edited', className: 'bg-blue-500/15 text-blue-600 dark:text-blue-400', icon: Pencil },
  add: { label: 'Added', className: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400', icon: Plus },
  delete: { label: 'Deleted', className: 'bg-red-500/15 text-red-600 dark:text-red-400', icon: Trash2 },
  reset: { label: 'Reset', className: 'bg-amber-500/15 text-amber-600 dark:text-amber-400', icon: RotateCcw },
  document: { label: 'Document', className: 'bg-violet-500/15 text-violet-600 dark:text-violet-400', icon: FileText },
};

/** An image that may no longer exist (e.g. a later edit removed it): falls back to its name. */
const SafeImage: React.FC<{ src: string; label: string; className?: string }> = ({ src, label, className }) => {
  const [broken, setBroken] = useState(false);
  if (broken) {
    return (
      <span
        title={label}
        className="w-20 h-14 rounded-md border border-dashed border-theme-border flex flex-col items-center justify-center gap-0.5 px-1 text-center text-[10px] leading-tight text-theme-text-muted"
      >
        <ImageIcon className="w-3.5 h-3.5" />
        <span className="w-full truncate">{label}</span>
        <span>file removed</span>
      </span>
    );
  }
  return <img src={src} alt={label} onError={() => setBroken(true)} className={className} />;
};

const Thumb: React.FC<{ src?: string; label: string }> = ({ src, label }) =>
  src ? (
    <a href={src} target="_blank" rel="noreferrer" title={label} className="block">
      <SafeImage src={src} label={label} className="w-20 h-14 object-cover rounded-md border border-theme-border" />
    </a>
  ) : (
    <span className="w-20 h-14 rounded-md border border-dashed border-theme-border flex items-center justify-center text-[10px] text-theme-text-muted">
      none
    </span>
  );

const TextValue: React.FC<{ value?: string; tone: 'old' | 'new' }> = ({ value, tone }) => {
  if (!value) {
    return <span className="text-xs italic text-theme-text-muted">{tone === 'old' ? '(empty)' : '(removed)'}</span>;
  }
  return (
    <span
      className={`text-xs whitespace-pre-wrap break-words rounded px-1.5 py-0.5 ${
        tone === 'old' ? 'bg-red-500/10 text-theme-text-secondary line-through decoration-red-400/60' : 'bg-emerald-500/10 text-theme-text'
      }`}
    >
      {value.length > 400 ? `${value.slice(0, 400)}…` : value}
    </span>
  );
};

/** "Field: old value → new value" rows. Images are shown as before / after thumbnails. */
export const FieldChangeRows: React.FC<{ changes: FieldChange[] }> = ({ changes }) => (
  <ul className="space-y-2">
    {changes.map((c, i) => (
      <li key={`${c.field}-${i}`} className="text-sm">
        <div className="text-xs font-semibold text-theme-text-secondary mb-1">{c.field}</div>
        {c.kind === 'image' ? (
          <div className="flex items-center gap-2">
            {c.from !== undefined && <Thumb src={c.from} label={`${c.field} before`} />}
            {c.from !== undefined && c.to !== undefined && <ArrowRight className="w-4 h-4 text-theme-text-muted shrink-0" />}
            {c.to !== undefined && <Thumb src={c.to} label={`${c.field} after`} />}
          </div>
        ) : (
          <div className="flex flex-wrap items-start gap-2">
            {c.from !== undefined && <TextValue value={c.from} tone="old" />}
            {c.from !== undefined && c.to !== undefined && <ArrowRight className="w-4 h-4 mt-0.5 text-theme-text-muted shrink-0" />}
            {c.to !== undefined && <TextValue value={c.to} tone="new" />}
          </div>
        )}
      </li>
    ))}
  </ul>
);

/** Documents and images attached to a change. */
export const AttachmentList: React.FC<{ attachments?: Attachment[] }> = ({ attachments }) => {
  if (!attachments || attachments.length === 0) return null;
  return (
    <div>
      <div className="text-xs font-semibold text-theme-text-secondary mb-1.5">Attached files</div>
      <div className="flex flex-wrap gap-2">
        {attachments.map((a, i) =>
          a.type === 'image' && a.url ? (
            <a key={`${a.url}-${i}`} href={a.url} target="_blank" rel="noreferrer" title={a.name} className="block">
              <SafeImage src={a.url} label={a.name} className="w-20 h-14 object-cover rounded-md border border-theme-border" />
            </a>
          ) : (
            <a
              key={`${a.name}-${i}`}
              href={a.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-theme-border text-xs text-theme-text hover:bg-theme-secondary"
            >
              {a.type === 'pdf' ? <FileText className="w-3.5 h-3.5 text-red-500" /> : <ImageIcon className="w-3.5 h-3.5" />}
              <span className="max-w-[180px] truncate">{a.name}</span>
            </a>
          )
        )}
      </div>
    </div>
  );
};

const EntryCard: React.FC<{ entry: ChangeEntry; onNote: (note: string) => void }> = ({ entry, onNote }) => {
  const style = ACTION_STYLE[entry.action];
  const Icon = style.icon;
  const [note, setNote] = useState(entry.note || '');

  return (
    <li className={`${cardClass} p-4 space-y-3`}>
      <div className="flex flex-wrap items-center gap-2">
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${style.className}`}>
          <Icon className="w-3 h-3" />
          {style.label}
        </span>
        <span className="font-semibold text-sm text-theme-text">{entry.sectionLabel}</span>
        {entry.target !== entry.sectionLabel && (
          <>
            <span className="text-theme-text-muted">›</span>
            <span className="text-sm text-theme-text-secondary">{entry.target}</span>
          </>
        )}
        <span className="ml-auto text-xs text-theme-text-muted">
          {formatDateTime(entry.at)} · {entry.by}
        </span>
      </div>

      <FieldChangeRows changes={entry.changes} />
      <AttachmentList attachments={entry.attachments} />

      <div>
        <label className="block text-xs font-semibold text-theme-text-secondary mb-1">Description of this change</label>
        <textarea
          rows={2}
          value={note}
          placeholder="Add a note: why was this changed?"
          onChange={(e) => setNote(e.target.value)}
          onBlur={() => note !== (entry.note || '') && onNote(note)}
          className={`${inputClass} resize-y`}
        />
      </div>
    </li>
  );
};

export const ChangeHistory: React.FC = () => {
  const { changes, annotateChange, clearChanges } = useAdminData();
  const [query, setQuery] = useState('');
  const [section, setSection] = useState('all');

  const sections = useMemo(() => {
    const map = new Map<string, string>();
    changes.forEach((c) => map.set(c.section, c.sectionLabel));
    return Array.from(map.entries());
  }, [changes]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return changes.filter((c) => {
      if (section !== 'all' && c.section !== section) return false;
      if (!q) return true;
      const haystack = [c.sectionLabel, c.target, c.note, ...c.changes.flatMap((x) => [x.field, x.from, x.to])]
        .join(' ')
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [changes, query, section]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-theme-text-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search changes…"
            className={`${inputClass} pl-9`}
          />
        </div>
        <select value={section} onChange={(e) => setSection(e.target.value)} className={`${inputClass} sm:w-56`}>
          <option value="all">All sections</option>
          {sections.map(([id, label]) => (
            <option key={id} value={id}>
              {label}
            </option>
          ))}
        </select>
        <button
          type="button"
          disabled={changes.length === 0}
          onClick={() => window.confirm('Clear the entire change history?') && clearChanges()}
          className={buttonGhost}
        >
          <Trash2 className="w-4 h-4" /> Clear
        </button>
      </div>

      {visible.length === 0 ? (
        <div className={`${cardClass} p-10 text-center`}>
          <History className="w-8 h-8 mx-auto text-theme-text-muted mb-3" />
          <p className="font-semibold text-theme-text">{changes.length === 0 ? 'No changes yet' : 'No changes match your search'}</p>
          <p className="text-sm text-theme-text-muted mt-1">
            Everything you edit in the admin panel appears here, with the old and new values, images and attached documents.
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {visible.map((entry) => (
            <EntryCard key={entry.id} entry={entry} onNote={(note) => annotateChange(entry.id, note)} />
          ))}
        </ul>
      )}
    </div>
  );
};
