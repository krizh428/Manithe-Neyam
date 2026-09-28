import type { FieldChange } from '../types';

/** "titleTa" -> "Title (Tamil)", "vision.textEn" -> "Vision › Text (English)" */
export function humanizeKey(path: string): string {
  return path
    .split('.')
    .map((part) => {
      let lang = '';
      let base = part;
      if (/[a-z]Ta$/.test(part)) {
        base = part.slice(0, -2);
        lang = ' (Tamil)';
      } else if (/[a-z]En$/.test(part)) {
        base = part.slice(0, -2);
        lang = ' (English)';
      }
      const words = base.replace(/([a-z0-9])([A-Z])/g, '$1 $2').toLowerCase();
      return words.charAt(0).toUpperCase() + words.slice(1) + lang;
    })
    .join(' › ');
}

export const isImageKey = (path: string): boolean => /image$/i.test(path.split('.').pop() || '');

const stringify = (value: unknown): string => {
  if (value === undefined || value === null) return '';
  if (Array.isArray(value)) return value.map(String).join('  |  ');
  return String(value);
};

const isPlainObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v);

/** Field-by-field differences between two plain objects (recurses into nested objects). */
export function diffObjects(before: unknown, after: unknown, prefix = ''): FieldChange[] {
  const out: FieldChange[] = [];
  const b = isPlainObject(before) ? before : {};
  const a = isPlainObject(after) ? after : {};
  const keys = Array.from(new Set([...Object.keys(b), ...Object.keys(a)]));

  for (const key of keys) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (isPlainObject(b[key]) || isPlainObject(a[key])) {
      out.push(...diffObjects(b[key], a[key], path));
      continue;
    }
    // Photo lists are summarised ("3 photos") instead of dumping every url into the history
    if (/images$/i.test(key) && (Array.isArray(b[key]) || Array.isArray(a[key]))) {
      // A home without an `images` list still shows its single cover `image` as one photo
      const photos = (list: Record<string, unknown>) =>
        Array.isArray(list[key]) ? (list[key] as unknown[]) : typeof list.image === 'string' && list.image ? [list.image] : [];
      const before = photos(b);
      const after = photos(a);
      if (JSON.stringify(before) !== JSON.stringify(after)) {
        const count = (n: number) => `${n} photo${n === 1 ? '' : 's'}`;
        const added = after.filter((u) => !before.includes(u)).length;
        const removed = before.filter((u) => !after.includes(u)).length;
        const detail = [added && `${added} added`, removed && `${removed} removed`].filter(Boolean).join(', ') || 'reordered';
        out.push({ field: humanizeKey(path.replace(/images$/i, 'photos')), from: count(before.length), to: `${count(after.length)} (${detail})`, kind: 'text' });
      }
      continue;
    }
    const from = stringify(b[key]);
    const to = stringify(a[key]);
    if (from !== to) {
      out.push({
        field: humanizeKey(path),
        from,
        to,
        kind: isImageKey(path) ? 'image' : 'text',
      });
    }
  }
  return out;
}

/**
 * Merges a new edit into an earlier one for the same item, so typing a sentence
 * produces one change (original -> final) instead of one entry per keystroke.
 * Fields that end up back at their original value are dropped.
 */
export function mergeFieldChanges(older: FieldChange[], newer: FieldChange[]): FieldChange[] {
  const merged = new Map<string, FieldChange>();
  older.forEach((c) => merged.set(c.field, c));
  newer.forEach((c) => {
    const prior = merged.get(c.field);
    merged.set(c.field, prior ? { ...c, from: prior.from } : c);
  });
  return Array.from(merged.values()).filter((c) => (c.from ?? '') !== (c.to ?? ''));
}
