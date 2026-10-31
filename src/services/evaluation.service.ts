import { checkPage, MAX_PAGES, normaliseCategories, normaliseViewports } from './evaluation.constants';
import type {
  EvaluationConfig,
  EvaluationErrorCode,
  EvaluationQuery,
  EvaluationResult,
} from './evaluation.types';
import { getWebsite } from './website.service';
import type { EvaluationRecord } from './workspace.types';

/**
 * Evaluation storage and configuration rules.
 *
 * Records live under `uiuxpulse.evaluations`, keyed by owner id — the same key
 * the dashboard has read since Phase 4, so this service fills a store that
 * already existed rather than introducing a second one. Every read is filtered
 * by the signed-in account.
 *
 * What is stored is a *configuration*: which pages, which categories, which
 * viewports. Nothing here analyses, scores, or fetches a website.
 */
const EVALUATIONS_KEY = 'uiuxpulse.evaluations';
const LATENCY_MS = 240;

const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

function getStore(): Storage | null {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return null;
    return window.localStorage;
  } catch {
    return null;
  }
}

type EvaluationStore = Record<string, EvaluationRecord[]>;

function readStore(): EvaluationStore {
  const store = getStore();
  if (!store) return {};
  try {
    const raw = store.getItem(EVALUATIONS_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as EvaluationStore;
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

function writeStore(value: EvaluationStore): void {
  const store = getStore();
  if (!store) return;
  try {
    store.setItem(EVALUATIONS_KEY, JSON.stringify(value));
  } catch {
    // Storage full or blocked: the record survives only until reload.
  }
}

/** `eval_` prefix, so an id is recognisable in storage and in the URL. */
function createId(): string {
  return `eval_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * Tolerate records written by an earlier phase (website/url/createdAt only).
 * Missing arrays become empty ones rather than `undefined`, so every renderer
 * can count them without a guard.
 */
function hydrate(value: unknown): EvaluationRecord | null {
  const record = value as EvaluationRecord;
  if (!record || typeof record.id !== 'string') return null;
  if (typeof record.url !== 'string' || typeof record.website !== 'string') return null;

  return {
    ...record,
    ownerId: typeof record.ownerId === 'string' ? record.ownerId : '',
    pages: Array.isArray(record.pages) ? record.pages.filter((p) => typeof p === 'string') : [],
    categories: Array.isArray(record.categories) ? normaliseCategories(record.categories) : [],
    viewports: Array.isArray(record.viewports) ? normaliseViewports(record.viewports) : [],
    status: record.status ?? 'created',
  };
}

function sortNewestFirst(records: EvaluationRecord[]): EvaluationRecord[] {
  return [...records].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

/** Every evaluation owned by one account, newest first. */
export function listEvaluations(ownerId: string | undefined): EvaluationRecord[] {
  if (!ownerId) return [];
  const records = readStore()[ownerId];
  if (!Array.isArray(records)) return [];
  return sortNewestFirst(
    records.map(hydrate).filter((record): record is EvaluationRecord => record !== null),
  );
}

/** One evaluation, only if this account owns it. */
export function getEvaluation(ownerId: string | undefined, id: string): EvaluationRecord | null {
  if (!ownerId) return null;
  return listEvaluations(ownerId).find((record) => record.id === id) ?? null;
}

/** Search, link filter, and sort, applied to the account's own records. */
export function queryEvaluations(
  ownerId: string | undefined,
  query: EvaluationQuery = {},
): EvaluationRecord[] {
  const { search = '', link = 'all', status = 'all', sort = 'newest' } = query;
  const needle = search.trim().toLowerCase();

  const filtered = listEvaluations(ownerId).filter((record) => {
    if (status !== 'all' && record.status !== status) return false;
    if (link === 'linked' && !record.websiteId) return false;
    if (link === 'detached' && record.websiteId) return false;
    if (!needle) return true;
    return (
      record.website.toLowerCase().includes(needle) || record.url.toLowerCase().includes(needle)
    );
  });

  return sort === 'oldest' ? [...filtered].reverse() : filtered;
}

/**
 * Fields the wizard may change before submission.
 *
 * Deliberately no `id`, `ownerId`, `createdAt`, or `status`: a saved record's
 * identity and creation date must not be rewritable through the config path.
 */
export interface EvaluationSaveInput {
  websiteId: string;
  pages: string[];
  categories: string[];
  viewports: string[];
}

function errorKeyFor(code: EvaluationErrorCode): EvaluationErrorCode {
  return code;
}

/**
 * Validate a configuration against the account's own websites.
 *
 * Everything that can make a configuration invalid is checked here rather than
 * in the wizard, so the same rules apply however the config was assembled.
 */
export function validateConfig(
  ownerId: string | undefined,
  input: EvaluationSaveInput,
): EvaluationErrorCode | null {
  if (!ownerId) return 'forbidden';
  if (!input.websiteId) return 'noWebsite';

  // Ownership is enforced by the lookup: another account's id resolves to null.
  const website = getWebsite(ownerId, input.websiteId);
  if (!website) return 'websiteNotFound';

  if (input.pages.length === 0) return 'noPages';
  if (input.pages.length > MAX_PAGES) return 'tooManyPages';

  const unique = new Set<string>();
  for (const raw of input.pages) {
    const { page, error } = checkPage(raw, website.url, []);
    if (error || !page) return error ?? 'invalidPage';
    if (unique.has(page)) return 'duplicatePage';
    unique.add(page);
  }

  if (normaliseCategories(input.categories).length === 0) return 'noCategories';
  if (normaliseViewports(input.viewports).length === 0) return 'noViewports';

  return null;
}

/**
 * Save a configuration as an evaluation record.
 *
 * The website's name and URL are snapshotted, so the record still reads
 * correctly after the site is renamed or deleted. The status is `created`:
 * configuration saved, nothing analysed.
 */
export async function createEvaluation(
  ownerId: string | undefined,
  input: EvaluationSaveInput,
): Promise<EvaluationResult> {
  await delay(LATENCY_MS);

  const error = validateConfig(ownerId, input);
  if (error) return { ok: false, code: errorKeyFor(error) };

  const website = getWebsite(ownerId, input.websiteId);
  if (!website) return { ok: false, code: 'websiteNotFound' };

  const record: EvaluationRecord = {
    id: createId(),
    ownerId: ownerId as string,
    websiteId: website.id,
    website: website.name,
    url: website.url,
    pages: input.pages.map((page) => checkPage(page, website.url, []).page ?? page),
    categories: normaliseCategories(input.categories),
    viewports: normaliseViewports(input.viewports),
    createdAt: new Date().toISOString(),
    status: 'created',
  };

  const store = readStore();
  store[ownerId as string] = [record, ...(store[ownerId as string] ?? [])];
  writeStore(store);

  return { ok: true, data: record };
}

/**
 * Count evaluations per website, for the website list and detail page.
 *
 * Derived on read, never stored on the website, so a counter cannot drift from
 * the records it counts.
 */
export function countEvaluationsByWebsite(
  ownerId: string | undefined,
): Record<string, number> {
  return listEvaluations(ownerId).reduce<Record<string, number>>((totals, record) => {
    if (record.websiteId) totals[record.websiteId] = (totals[record.websiteId] ?? 0) + 1;
    return totals;
  }, {});
}

/** Evaluations that still point at one website. */
export function listEvaluationsForWebsite(
  ownerId: string | undefined,
  websiteId: string,
): EvaluationRecord[] {
  return listEvaluations(ownerId).filter((record) => record.websiteId === websiteId);
}

/**
 * Unlink evaluations from a deleted website without destroying them.
 *
 * The website name is copied into the record first, so history still reads
 * sensibly after the site is gone. Returns how many records were touched.
 */
export function detachEvaluations(
  ownerId: string | undefined,
  websiteId: string,
  websiteName: string,
): number {
  if (!ownerId) return 0;
  const store = readStore();
  const records = store[ownerId];
  if (!Array.isArray(records)) return 0;

  let touched = 0;
  store[ownerId] = records.map((record) => {
    if (record.websiteId !== websiteId) return record;
    touched += 1;
    const { websiteId: _removed, ...rest } = record;
    return { ...rest, website: websiteName || record.website };
  });

  if (touched > 0) writeStore(store);
  return touched;
}

/** Totals for the dashboard, derived from records — never hand-written. */
export interface EvaluationSummary {
  total: number;
  created: number;
  completed: number;
  /** Pages across every evaluation, for the "pages reviewed" total. */
  pages: number;
}

export function summariseEvaluations(records: EvaluationRecord[]): EvaluationSummary {
  return {
    total: records.length,
    created: records.filter((record) => record.status === 'created').length,
    completed: records.filter((record) => record.status === 'completed').length,
    pages: records.reduce((total, record) => total + record.pages.length, 0),
  };
}

/** Build the exact shape the wizard hands to `createEvaluation`. */
export function toSaveInput(
  config: Omit<EvaluationConfig, 'websiteId'> & { websiteId: string },
): EvaluationSaveInput {
  return {
    websiteId: config.websiteId,
    pages: [...config.pages],
    categories: [...config.categories],
    viewports: [...config.viewports],
  };
}
