import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertTriangle,
  Download,
  Eye,
  FileText,
  History,
  ImagePlus,
  Loader2,
  Pencil,
  Plus,
  Search,
  Trash2,
  Undo2,
  UploadCloud,
  X,
} from 'lucide-react';
import { api, ApiError } from '../services/api';
import { useAdminData } from '../context/AdminDataContext';
import type { DocumentChange, DocumentItem } from '../types';
import { AttachmentList, FieldChangeRows, formatDateTime } from './ChangeHistory';
import { NO_SECTION, useDocumentSections, type SectionOption } from '../hooks/useDocumentSections';
import { buttonGhost, buttonPrimary, cardClass, FieldLabel, inputClass } from './ui';

interface Props {
  onAuthError: () => void;
}

const STATUS_STYLE: Record<DocumentItem['status'], string> = {
  published: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
  draft: 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
  archived: 'bg-slate-500/15 text-slate-600 dark:text-slate-300',
};

const formatSize = (bytes?: number) => {
  if (!bytes) return '';
  return bytes > 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`;
};

interface FormState {
  title: string;
  description: string;
  status: DocumentItem['status'];
  section: string;
  displayOrder: number;
  changeNote: string;
  pdf: File | null;
  newImages: File[];
  removeImages: string[];
}

const emptyForm = (order: number, section: string): FormState => ({
  title: '',
  description: '',
  status: 'published',
  section,
  displayOrder: order,
  changeNote: '',
  pdf: null,
  newImages: [],
  removeImages: [],
});

const DocumentForm: React.FC<{
  document: DocumentItem | null;
  nextOrder: number;
  defaultSection: string;
  sections: SectionOption[];
  onCancel: () => void;
  onSaved: (doc: DocumentItem, isNew: boolean) => void;
  onError: (message: string) => void;
}> = ({ document: editing, nextOrder, defaultSection, sections, onCancel, onSaved, onError }) => {
  const [form, setForm] = useState<FormState>(() =>
    editing
      ? {
          title: editing.title,
          description: editing.description || '',
          status: editing.status,
          section: sections.some((s) => s.id === editing.section) ? (editing.section as string) : NO_SECTION,
          displayOrder: editing.displayOrder,
          changeNote: '',
          pdf: null,
          newImages: [],
          removeImages: [],
        }
      : emptyForm(nextOrder, defaultSection)
  );
  const [saving, setSaving] = useState(false);
  const pdfRef = useRef<HTMLInputElement>(null);
  const imagesRef = useRef<HTMLInputElement>(null);

  const previews = useMemo(() => form.newImages.map((f) => URL.createObjectURL(f)), [form.newImages]);
  useEffect(() => () => previews.forEach((u) => URL.revokeObjectURL(u)), [previews]);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => setForm((f) => ({ ...f, [key]: value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    setSaving(true);
    try {
      const data = new FormData();
      data.append('title', form.title.trim());
      data.append('description', form.description);
      data.append('status', form.status);
      data.append('section', form.section);
      data.append('displayOrder', String(form.displayOrder));
      data.append('changeNote', form.changeNote);
      if (form.pdf) data.append('pdf', form.pdf);
      form.newImages.forEach((img) => data.append('images', img));
      if (editing) data.append('removeImages', JSON.stringify(form.removeImages));

      const result = editing ? await api.updateDocument(editing._id, data) : await api.createDocument(data);
      onSaved(result.document, !editing);
    } catch (err) {
      onError(err instanceof Error ? err.message : 'Could not save the document');
    } finally {
      setSaving(false);
    }
  };

  const addImages = (files: FileList | null) => {
    if (!files) return;
    const valid = Array.from(files).filter((f) => f.type.startsWith('image/') && f.size <= 5 * 1024 * 1024);
    if (valid.length < files.length) onError('Some files were skipped: attachments must be images up to 5 MB.');
    set('newImages', [...form.newImages, ...valid].slice(0, 10));
  };

  return (
    <form onSubmit={submit} className={`${cardClass} p-5 space-y-5 border-brand-primary/40`}>
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-theme-text">{editing ? `Edit document — ${editing.title}` : 'Add a new document'}</h3>
        <button type="button" onClick={onCancel} className="p-1.5 rounded-lg hover:bg-theme-secondary text-theme-text-muted">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div>
        <FieldLabel>Title</FieldLabel>
        <input required value={form.title} onChange={(e) => set('title', e.target.value)} className={inputClass} />
      </div>
      <div>
        <FieldLabel>Description</FieldLabel>
        <textarea rows={3} value={form.description} onChange={(e) => set('description', e.target.value)} className={`${inputClass} resize-y`} />
      </div>
      <div>
        <FieldLabel hint="add new sections with “New section” above the list">Section</FieldLabel>
        <select value={form.section} onChange={(e) => set('section', e.target.value)} className={inputClass}>
          <option value={NO_SECTION}>No section</option>
          {sections.map((s) => (
            <option key={s.id} value={s.id}>
              {s.labelEn}
            </option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <FieldLabel>Status</FieldLabel>
          <select value={form.status} onChange={(e) => set('status', e.target.value as FormState['status'])} className={inputClass}>
            <option value="published">Published (visible on the website)</option>
            <option value="draft">Draft (hidden)</option>
            <option value="archived">Archived (hidden)</option>
          </select>
        </div>
        <div>
          <FieldLabel hint="lower numbers appear first">Display order</FieldLabel>
          <input
            type="number"
            value={form.displayOrder}
            onChange={(e) => set('displayOrder', Number(e.target.value) || 0)}
            className={inputClass}
          />
        </div>
      </div>

      {/* PDF */}
      <div>
        <FieldLabel>PDF document</FieldLabel>
        <input
          ref={pdfRef}
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0] || null;
            if (file && file.size > 10 * 1024 * 1024) {
              onError('PDF is larger than 10 MB.');
            } else {
              set('pdf', file);
            }
            e.target.value = '';
          }}
        />
        <div className="flex flex-wrap items-center gap-3">
          <button type="button" onClick={() => pdfRef.current?.click()} className={buttonGhost}>
            <UploadCloud className="w-4 h-4" /> {editing?.fileUrl ? 'Replace PDF' : 'Choose PDF'}
          </button>
          {form.pdf ? (
            <span className="inline-flex items-center gap-2 text-sm text-theme-text">
              <FileText className="w-4 h-4 text-red-500" /> {form.pdf.name} ({formatSize(form.pdf.size)}) — new
              <button type="button" onClick={() => set('pdf', null)} className="text-red-500">
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          ) : editing?.fileUrl ? (
            <span className="inline-flex items-center gap-2 text-sm text-theme-text-secondary">
              <FileText className="w-4 h-4 text-red-500" /> {editing.fileName} ({formatSize(editing.fileSize)}) — current file
            </span>
          ) : (
            <span className="text-sm text-theme-text-muted">No PDF attached yet</span>
          )}
        </div>
      </div>

      {/* Images */}
      <div>
        <FieldLabel hint="photos of the document, certificates, events… up to 10, 5 MB each">Attached images</FieldLabel>
        <input ref={imagesRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => { addImages(e.target.files); e.target.value = ''; }} />
        <div className="flex flex-wrap gap-3">
          {editing?.images?.map((img) => {
            const removed = form.removeImages.includes(img.url);
            return (
              <div key={img.url} className="relative w-24">
                <img
                  src={img.url}
                  alt={img.name}
                  className={`w-24 h-20 object-cover rounded-lg border border-theme-border ${removed ? 'opacity-30 grayscale' : ''}`}
                />
                <button
                  type="button"
                  title={removed ? 'Keep this image' : 'Remove this image'}
                  onClick={() =>
                    set('removeImages', removed ? form.removeImages.filter((u) => u !== img.url) : [...form.removeImages, img.url])
                  }
                  className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-theme-card border border-theme-border shadow flex items-center justify-center text-red-500"
                >
                  {removed ? <Undo2 className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                </button>
                <p className="text-[10px] text-theme-text-muted truncate mt-1">{removed ? 'will be removed' : img.name}</p>
              </div>
            );
          })}
          {previews.map((src, i) => (
            <div key={src} className="relative w-24">
              <img src={src} alt="" className="w-24 h-20 object-cover rounded-lg border-2 border-brand-primary/60" />
              <button
                type="button"
                onClick={() => set('newImages', form.newImages.filter((_, idx) => idx !== i))}
                className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-theme-card border border-theme-border shadow flex items-center justify-center text-red-500"
              >
                <X className="w-3.5 h-3.5" />
              </button>
              <p className="text-[10px] text-brand-primary truncate mt-1">new · {form.newImages[i].name}</p>
            </div>
          ))}
          <button
            type="button"
            onClick={() => imagesRef.current?.click()}
            className="w-24 h-20 rounded-lg border-2 border-dashed border-theme-border text-theme-text-muted hover:border-brand-primary hover:text-brand-primary flex flex-col items-center justify-center gap-1 text-[11px] transition-colors"
          >
            <ImagePlus className="w-5 h-5" /> Add images
          </button>
        </div>
      </div>

      <div>
        <FieldLabel hint="saved in this document's history so everyone can see what changed and why">
          Describe your changes
        </FieldLabel>
        <textarea
          rows={2}
          value={form.changeNote}
          onChange={(e) => set('changeNote', e.target.value)}
          placeholder={editing ? 'e.g. Replaced with the 2026 audited report; added photos of the signed copy' : 'e.g. First upload of the trust registration certificate'}
          className={`${inputClass} resize-y`}
        />
      </div>

      <div className="flex justify-end gap-2">
        <button type="button" onClick={onCancel} className={buttonGhost}>
          Cancel
        </button>
        <button type="submit" disabled={saving || !form.title.trim()} className={buttonPrimary}>
          {saving && <Loader2 className="w-4 h-4 animate-spin" />}
          {saving ? 'Saving…' : editing ? 'Save changes' : 'Upload document'}
        </button>
      </div>
    </form>
  );
};

const HistoryList: React.FC<{ log: DocumentChange[] }> = ({ log }) => (
  <ol className="space-y-3 mt-3 border-l-2 border-theme-border pl-4">
    {[...log].reverse().map((entry, i) => (
      <li key={`${entry.at}-${i}`} className="space-y-2">
        <div className="text-xs text-theme-text-muted">
          <span className="font-semibold text-theme-text">{entry.action === 'created' ? 'Created' : 'Updated'}</span> ·{' '}
          {formatDateTime(entry.at)} · {entry.by}
        </div>
        {entry.note && <p className="text-sm text-theme-text bg-theme-secondary rounded-lg px-3 py-2">“{entry.note}”</p>}
        {entry.changes.length > 0 && <FieldChangeRows changes={entry.changes} />}
        <AttachmentList attachments={entry.attachments} />
      </li>
    ))}
  </ol>
);

export const DocumentsManager: React.FC<Props> = ({ onAuthError }) => {
  const { logExternalChange } = useAdminData();
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [toast, setToast] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sectionFilter, setSectionFilter] = useState('all');
  const { sections, sectionOf, labelFor, reload: reloadSections } = useDocumentSections();
  const [addingSection, setAddingSection] = useState(false);
  const [newSectionName, setNewSectionName] = useState('');
  const [savingSection, setSavingSection] = useState(false);
  const [formTarget, setFormTarget] = useState<DocumentItem | 'new' | null>(null);
  const [historyOpen, setHistoryOpen] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<DocumentItem | null>(null);
  const toastTimer = useRef<number>(undefined);

  const showToast = useCallback((type: 'success' | 'error', text: string) => {
    setToast({ type, text });
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 4000);
  }, []);

  const handleError = useCallback(
    (err: unknown) => {
      if (err instanceof ApiError && (err.status === 401 || err.status === 403)) {
        onAuthError();
        return;
      }
      showToast('error', err instanceof Error ? err.message : 'Something went wrong');
    },
    [onAuthError, showToast]
  );

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError('');
    try {
      setDocuments(await api.getAdminDocuments());
    } catch (err) {
      if (err instanceof ApiError && (err.status === 401 || err.status === 403)) return onAuthError();
      setLoadError(err instanceof Error ? err.message : 'Could not load documents');
    } finally {
      setLoading(false);
    }
  }, [onAuthError]);

  useEffect(() => {
    load();
  }, [load]);

  const unsortedCount = documents.filter((d) => sectionOf(d.section) === NO_SECTION).length;

  const filtered = documents.filter(
    (d) =>
      (sectionFilter === 'all' || sectionOf(d.section) === sectionFilter) &&
      (statusFilter === 'all' || d.status === statusFilter) &&
      `${d.title} ${d.description || ''} ${d.fileName || ''}`.toLowerCase().includes(search.trim().toLowerCase())
  );

  const handleSaved = (doc: DocumentItem, isNew: boolean) => {
    const latest = doc.changeLog?.[doc.changeLog.length - 1];
    if (latest) {
      logExternalChange({
        section: 'documents',
        sectionLabel: `Documents › ${labelFor(doc.section)}`,
        target: doc.title,
        targetId: doc._id,
        action: 'document',
        note: latest.note,
        changes: latest.changes,
        attachments: latest.attachments,
        by: latest.by,
        at: latest.at,
      });
    }
    setFormTarget(null);
    showToast('success', isNew ? 'Document uploaded.' : 'Changes saved and recorded in the history.');
    load();
  };

  const addSection = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSection(true);
    try {
      const created = await api.createDocumentSection(newSectionName.trim());
      await reloadSections();
      setSectionFilter(created.key);
      setNewSectionName('');
      setAddingSection(false);
      showToast('success', `Section “${created.name}” added. Upload documents to it with “Add document”.`);
    } catch (err) {
      handleError(err);
    } finally {
      setSavingSection(false);
    }
  };

  const deleteSection = async () => {
    const target = sections.find((s) => s.id === sectionFilter);
    if (!target?.custom) return;
    const count = documents.filter((d) => d.section === target.id).length;
    const warning = count
      ? `Delete the section “${target.labelEn}”? Its ${count} document(s) will move to “General”.`
      : `Delete the section “${target.labelEn}”?`;
    if (!window.confirm(warning)) return;
    try {
      await api.deleteDocumentSection(target.id);
      setSectionFilter('all');
      await reloadSections();
      showToast('success', 'Section deleted.');
      load();
    } catch (err) {
      handleError(err);
    }
  };

  const confirmDelete = async () => {
    if (!deleting) return;
    try {
      await api.deleteDocument(deleting._id);
      logExternalChange({
        section: 'documents',
        sectionLabel: 'Documents',
        target: deleting.title,
        targetId: deleting._id,
        action: 'delete',
        changes: [{ field: 'Removed document', from: deleting.title }],
        attachments: [
          ...(deleting.fileName ? [{ type: 'pdf' as const, name: deleting.fileName }] : []),
          ...(deleting.images || []).map((i) => ({ type: 'image' as const, name: i.name })),
        ],
      });
      showToast('success', 'Document deleted.');
      load();
    } catch (err) {
      handleError(err);
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="space-y-5">
      {toast && (
        <div
          className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[70] px-5 py-3 rounded-lg shadow-xl text-sm font-medium text-white ${
            toast.type === 'success' ? 'bg-emerald-600' : 'bg-red-600'
          }`}
        >
          {toast.text}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-theme-text-muted" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search documents…" className={`${inputClass} pl-9`} />
        </div>
        <select value={sectionFilter} onChange={(e) => setSectionFilter(e.target.value)} className={`${inputClass} sm:w-52`}>
          <option value="all">All sections ({documents.length})</option>
          {unsortedCount > 0 && <option value={NO_SECTION}>No section ({unsortedCount})</option>}
          {sections.map((s) => (
            <option key={s.id} value={s.id}>
              {s.labelEn} ({documents.filter((d) => d.section === s.id).length})
            </option>
          ))}
        </select>
        <button type="button" onClick={() => setAddingSection(!addingSection)} className={buttonGhost} title="Type a new section name">
          <Plus className="w-4 h-4" /> New section
        </button>
        {sections.find((s) => s.id === sectionFilter)?.custom && (
          <button type="button" onClick={deleteSection} className={`${buttonGhost} text-red-500`} title="Delete this section">
            <Trash2 className="w-4 h-4" />
          </button>
        )}
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={`${inputClass} sm:w-44`}>
          <option value="all">All statuses</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="archived">Archived</option>
        </select>
        <button type="button" onClick={() => setFormTarget('new')} className={buttonPrimary}>
          <Plus className="w-4 h-4" /> Add document
        </button>
      </div>

      {addingSection && (
        <form onSubmit={addSection} className={`${cardClass} p-4 flex flex-col sm:flex-row gap-3 sm:items-end`}>
          <div className="flex-1">
            <FieldLabel hint="e.g. Awards, Certificates, Reports 2026">New section name</FieldLabel>
            <input
              autoFocus
              value={newSectionName}
              onChange={(e) => setNewSectionName(e.target.value)}
              placeholder="Type a section name…"
              maxLength={60}
              className={inputClass}
            />
          </div>
          <div className="flex gap-2">
            <button type="submit" disabled={savingSection || newSectionName.trim().length < 2} className={buttonPrimary}>
              {savingSection ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              Add section
            </button>
            <button type="button" onClick={() => { setAddingSection(false); setNewSectionName(''); }} className={buttonGhost}>
              Cancel
            </button>
          </div>
        </form>
      )}

      {formTarget && (
        <DocumentForm
          key={formTarget === 'new' ? 'new' : formTarget._id}
          document={formTarget === 'new' ? null : formTarget}
          nextOrder={documents.length ? Math.max(...documents.map((d) => d.displayOrder)) + 1 : 1}
          defaultSection={sectionFilter !== 'all' ? sectionFilter : NO_SECTION}
          sections={sections}
          onCancel={() => setFormTarget(null)}
          onSaved={handleSaved}
          onError={(m) => showToast('error', m)}
        />
      )}

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-7 h-7 animate-spin text-brand-primary" />
        </div>
      ) : loadError ? (
        <div className={`${cardClass} p-8 text-center space-y-3`}>
          <AlertTriangle className="w-8 h-8 mx-auto text-amber-500" />
          <p className="text-sm text-theme-text">{loadError}</p>
          <button type="button" onClick={load} className={buttonGhost}>
            Try again
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className={`${cardClass} p-10 text-center`}>
          <FileText className="w-8 h-8 mx-auto text-theme-text-muted mb-3" />
          <p className="font-semibold text-theme-text">
            {documents.length === 0 ? 'No documents yet' : 'No documents match'}
          </p>
          <p className="text-sm text-theme-text-muted mt-1">Use “Add document” to upload a PDF and attach images.</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {filtered.map((doc) => (
            <li key={doc._id} className={`${cardClass} p-4`}>
              <div className="flex flex-col md:flex-row md:items-start gap-4">
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="font-semibold text-theme-text">{doc.title}</h4>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${STATUS_STYLE[doc.status]}`}>{doc.status}</span>
                    {sectionOf(doc.section) !== NO_SECTION && (
                      <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-brand-primary/10 text-brand-primary">
                        {labelFor(doc.section)}
                      </span>
                    )}
                    <span className="text-xs text-theme-text-muted">order {doc.displayOrder}</span>
                  </div>
                  {doc.description && <p className="text-sm text-theme-text-secondary whitespace-pre-wrap">{doc.description}</p>}
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    {doc.fileUrl ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-theme-border text-theme-text">
                        <FileText className="w-3.5 h-3.5 text-red-500" />
                        <span className="max-w-[220px] truncate">{doc.fileName}</span>
                        <span className="text-theme-text-muted">{formatSize(doc.fileSize)}</span>
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400">No PDF attached</span>
                    )}
                    <span className="text-theme-text-muted">Updated {formatDateTime(doc.updatedAt)}</span>
                  </div>
                  {doc.images && doc.images.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {doc.images.map((img) => (
                        <a key={img.url} href={img.url} target="_blank" rel="noreferrer" title={img.name}>
                          <img src={img.url} alt={img.name} className="w-16 h-12 rounded-md object-cover border border-theme-border" />
                        </a>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap md:flex-col gap-2 md:items-stretch shrink-0">
                  <div className="flex gap-2">
                    {doc.fileUrl && (
                      <>
                        <a href={api.viewDocumentUrl(doc._id)} target="_blank" rel="noreferrer" title="View PDF" className={buttonGhost}>
                          <Eye className="w-4 h-4" />
                        </a>
                        <a href={api.downloadDocumentUrl(doc._id)} title="Download PDF" className={buttonGhost}>
                          <Download className="w-4 h-4" />
                        </a>
                      </>
                    )}
                    <button type="button" onClick={() => setFormTarget(doc)} className={buttonGhost}>
                      <Pencil className="w-4 h-4" /> Edit
                    </button>
                    <button type="button" onClick={() => setDeleting(doc)} title="Delete" className={`${buttonGhost} text-red-500`}>
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => setHistoryOpen(historyOpen === doc._id ? null : doc._id)}
                    className={buttonGhost}
                  >
                    <History className="w-4 h-4" /> History ({doc.changeLog?.length || 0})
                  </button>
                </div>
              </div>

              {historyOpen === doc._id &&
                (doc.changeLog && doc.changeLog.length > 0 ? (
                  <HistoryList log={doc.changeLog} />
                ) : (
                  <p className="mt-3 text-sm text-theme-text-muted">No recorded changes for this document.</p>
                ))}
            </li>
          ))}
        </ul>
      )}

      {deleting && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className={`${cardClass} max-w-sm w-full p-6 text-center space-y-4`}>
            <AlertTriangle className="w-10 h-10 mx-auto text-red-500" />
            <h3 className="font-bold text-theme-text">Delete “{deleting.title}”?</h3>
            <p className="text-sm text-theme-text-secondary">The PDF and all attached images will be permanently removed.</p>
            <div className="flex gap-3">
              <button type="button" onClick={() => setDeleting(null)} className={`${buttonGhost} flex-1 justify-center`}>
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="flex-1 px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
