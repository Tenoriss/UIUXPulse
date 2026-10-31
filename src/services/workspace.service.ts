import type { EvaluationRecord, WorkspaceSummary } from './workspace.types';

/**
 * Evaluation storage.
 *
 * There is no scanning engine, so nothing writes here yet: the dashboard reads
 * this store and honestly reports zero. When submission is implemented it will
 * write to `uiuxpulse.evaluations`, keyed by the owning account, and every
 * counter on the overview will start moving without the UI changing.
 */
const EVALUATIONS_KEY = 'uiuxpulse.evaluations';

function getStore(): Storage | null {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return null;
    return window.localStorage;
  } catch {
    return null;
  }
}

/** Every evaluation owned by one account. Defensive against bad payloads. */
export function listEvaluations(userId: string | undefined): EvaluationRecord[] {
  if (!userId) return [];
  const store = getStore();
  if (!store) return [];

  try {
    const raw = store.getItem(EVALUATIONS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Record<string, EvaluationRecord[]>;
    const records = parsed?.[userId];
    if (!Array.isArray(records)) return [];
    return records
      .filter(
        (record): record is EvaluationRecord =>
          Boolean(record) && typeof record.id === 'string' && typeof record.url === 'string',
      )
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  } catch {
    return [];
  }
}

/** Most recent submissions, newest first. */
export function listRecentEvaluations(userId: string | undefined, limit = 5): EvaluationRecord[] {
  return listEvaluations(userId).slice(0, limit);
}

/**
 * Totals derived from the stored records, so no number on the dashboard is
 * invented. A "report" is a completed evaluation; "websites" counts distinct
 * hosts, because one site can have several evaluations.
 */
export function summarise(records: EvaluationRecord[]): WorkspaceSummary {
  const completed = records.filter((record) => record.status === 'completed').length;
  const websites = new Set(
    records.map((record) => {
      try {
        return new URL(record.url).host;
      } catch {
        return record.website;
      }
    }),
  ).size;

  return {
    websites,
    evaluations: records.length,
    completed,
    reports: completed,
    pending: records.length - completed,
  };
}
