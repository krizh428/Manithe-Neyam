import { useCallback, useEffect, useMemo, useState } from 'react';
import { api } from '../services/api';

/** Section id of a document that is not filed under any section. */
export const NO_SECTION = 'general';

export interface SectionOption {
  id: string;
  labelEn: string;
  labelTa: string;
  custom: true;
}

/** The sections the admin has typed in. Documents can also be left without a section. */
export function useDocumentSections() {
  const [custom, setCustom] = useState<{ key: string; name: string }[]>([]);

  const reload = useCallback(async () => {
    setCustom(await api.getDocumentSections());
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const sections = useMemo<SectionOption[]>(
    () => custom.map((c) => ({ id: c.key, labelEn: c.name, labelTa: c.name, custom: true })),
    [custom]
  );

  /** The section a document really belongs to (unknown / removed sections count as "no section"). */
  const sectionOf = useCallback(
    (id?: string) => (sections.some((s) => s.id === id) ? (id as string) : NO_SECTION),
    [sections]
  );

  const labelFor = useCallback(
    (id?: string) => sections.find((s) => s.id === id)?.labelEn ?? 'No section',
    [sections]
  );

  return { sections, sectionOf, labelFor, reload };
}
