import type { EvaluationRecord, WorkspaceSummary } from './workspace.types';

/**
 * Evaluation storage.
 *
 * There is no scanning engine, so nothing writes evaluations yet: the dashboard
 * reads this store and honestly reports zero. When submission is implemented it
 * will write to `uiuxpulse.evaluations`, keyed by the owning account, and every
 * counter on the overview will start moving without the UI changing.
 *
 * Records may carry a `websiteId`. Deleting a website never deletes them — see
 * `detachEvaluations`.
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

/** Evaluations belonging to one website. */
export function listEvaluationsForWebsite(
  userId: string | undefined,
  websiteId: string,
): EvaluationRecord[] {
  return listEvaluations(userId).filter((record) => record.websiteId === websiteId);
}

/** How many evaluations each website has, in one pass. */
export function countEvaluationsByWebsite(
  userId: string | undefined,
): Record<string, number> {
  return listEvaluations(userId).reduce<Record<string, number>>((totals, record) => {
    if (record.websiteId) {
      totals[record.websiteId] = (totals[record.websiteId] ?? 0) + 1;
    }
    return totals;
  }, {});
}

/**
 * Unlink evaluations from a deleted website without destroying them.
 *
 * The website name is copied into the record first, so history still reads
 * sensibly after the site is gone. Returns how many records were touched.
 */
export function detachEvaluations(
  userId: string | undefined,
  websiteId: string,
  websiteName: string,
): number {
  if (!userId) return 0;
  const store = getStore();
  if (!store) return 0;

  try {
    const raw = store.getItem(EVALUATIONS_KEY);
    if (!raw) return 0;
    const parsed = JSON.parse(raw) as Record<string, EvaluationRecord[]>;
    const records = parsed?.[userId];
    if (!Array.isArray(records)) return 0;

    let touched = 0;
    parsed[userId] = records.map((record) => {
      if (record.websiteId !== websiteId) return record;
      touched += 1;
      const { websiteId: _removed, ...rest } = record;
      return { ...rest, website: websiteName || record.website };
    });

    if (touched > 0) store.setItem(EVALUATIONS_KEY, JSON.stringify(parsed));
    return touched;
  } catch {
    return 0;
  }
}

/**
 * Totals derived from the stored data, so no number on the dashboard is
 * invented. `websites` is passed in from the website store — registered sites,
 * not distinct hosts guessed from evaluation URLs. A "report" is a completed
 * evaluation.
 */
export function summarise(
  records: EvaluationRecord[],
  websiteCount = 0,
): WorkspaceSummary {
  const completed = records.filter((record) => record.status === 'completed').length;
  const websites = websiteCount;

  return {
    websites,
    evaluations: records.length,
    completed,
    reports: completed,
    pending: records.length - completed,
  };
}
