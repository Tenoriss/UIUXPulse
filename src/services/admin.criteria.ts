import { criteriaContent } from '@/content/criteria';
import type { CriterionKey } from '@/content/criteria';
import type { AdminCriterionErrorCode, AdminCriterionNoteOutcome } from './admin.types';

/**
 * Administrative annotations for the six criteria.
 *
 * **This is not where the criteria are defined.** `content/criteria.ts` remains
 * the single source of truth for every published definition, and nothing in
 * this module ever writes to it. What lives here is a separate, optional note
 * per category, stored under its own key, so an administrator can add context
 * without editing — or silently diverging from — the definitions the public
 * criteria page and the evaluator both read.
 *
 * Nothing here touches scoring. There is no scoring engine, and a note is not
 * a weight.
 */
export const CRITERIA_NOTES_KEY = 'uiuxpulse.admin.criteriaNotes';

const MAX_NOTE = 400;
const MIN_NOTE = 20;

export interface CriterionNote {
  en: string;
  id: string;
  updatedAt: string;
}

export type CriterionNoteStore = Partial<Record<CriterionKey, CriterionNote>>;

function getStore(): Storage | null {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return null;
    return window.localStorage;
  } catch {
    return null;
  }
}

export function readCriterionNotes(): CriterionNoteStore {
  const store = getStore();
  if (!store) return {};
  try {
    const raw = store.getItem(CRITERIA_NOTES_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as CriterionNoteStore;
    if (!parsed || typeof parsed !== 'object') return {};

    // Drop anything that is not a complete, well-typed note, so one corrupted
    // entry cannot break the whole page.
    const clean: CriterionNoteStore = {};
    for (const [key, value] of Object.entries(parsed)) {
      if (!value || typeof value !== 'object') continue;
      const note = value as CriterionNote;
      if (typeof note.en !== 'string' || typeof note.id !== 'string') continue;
      clean[key as CriterionKey] = {
        en: note.en,
        id: note.id,
        updatedAt: typeof note.updatedAt === 'string' ? note.updatedAt : '',
      };
    }
    return clean;
  } catch {
    return {};
  }
}

function writeCriterionNotes(next: CriterionNoteStore): void {
  const store = getStore();
  if (!store) return;
  try {
    store.setItem(CRITERIA_NOTES_KEY, JSON.stringify(next));
  } catch {
    // Blocked storage: the annotation does not persist.
  }
}

/** Trim and collapse runs of whitespace, so validation counts real characters. */
const clean = (value: string) => value.replace(/\s+/g, ' ').trim();

function validate(en: string, id: string): AdminCriterionErrorCode | null {
  if (!en || !id) return 'descriptionRequired';
  if (en.length < MIN_NOTE || id.length < MIN_NOTE) return 'descriptionTooShort';
  if (en.length > MAX_NOTE || id.length > MAX_NOTE) return 'descriptionTooLong';
  return null;
}

/**
 * Save an annotation for one category. Both languages are required: a note that
 * exists in only one language would produce a mixed-language screen.
 */
export function saveCriterionNote(
  key: CriterionKey,
  input: { en: string; id: string },
): AdminCriterionNoteOutcome {
  if (!(key in criteriaContent.en)) return { ok: false, code: 'notFound' };

  const en = clean(input.en);
  const id = clean(input.id);

  const error = validate(en, id);
  if (error) return { ok: false, code: error };

  const note: CriterionNote = { en, id, updatedAt: new Date().toISOString() };
  writeCriterionNotes({ ...readCriterionNotes(), [key]: note });

  // Returns the note, not a rebuilt row: the caller re-reads `listCriteria()`
  // so the page never holds two versions of the same category. Keeping the
  // row builder in `admin.service.ts` also avoids a circular import.
  return { ok: true, data: note };
}

/** Remove an annotation, restoring the source definition. */
export function clearCriterionNote(key: CriterionKey): void {
  const notes = readCriterionNotes();
  if (!(key in notes)) return;
  delete notes[key];
  writeCriterionNotes(notes);
}

export const CRITERION_NOTE_LIMITS = { min: MIN_NOTE, max: MAX_NOTE } as const;
