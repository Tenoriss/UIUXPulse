import { normaliseUrl, domainOf, urlKey } from '@/lib/url';
import type {
  WebsiteInput,
  WebsiteQuery,
  WebsiteRecord,
  WebsiteResult,
  WebsiteListResult,
  WebsiteStatus,
} from './website.types';
import { listEvaluations, detachEvaluations } from './workspace.service';

/**
 * Website storage and CRUD.
 *
 * Records live under `uiuxpulse.websites`, keyed by owner id — one store, one
 * shape, no second storage system. Every read is filtered by the signed-in
 * account, so a website id from another account is indistinguishable from one
 * that does not exist.
 */
const WEBSITES_KEY = 'uiuxpulse.websites';
const LATENCY_MS = 320;

const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

function getStore(): Storage | null {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return null;
    return window.localStorage;
  } catch {
    return null;
  }
}

type WebsiteStore = Record<string, WebsiteRecord[]>;

function readStore(): WebsiteStore {
  const store = getStore();
  if (!store) return {};
  try {
    const raw = store.getItem(WEBSITES_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as WebsiteStore;
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

function writeStore(value: WebsiteStore): void {
  const store = getStore();
  if (!store) return;
  try {
    store.setItem(WEBSITES_KEY, JSON.stringify(value));
  } catch {
    // Storage full or blocked: the change survives only in memory.
  }
}

function createId(): string {
  return `site_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}

function isRecord(value: unknown): value is WebsiteRecord {
  const record = value as WebsiteRecord;
  return (
    Boolean(record) &&
    typeof record.id === 'string' &&
    typeof record.ownerId === 'string' &&
    typeof record.url === 'string'
  );
}

/**
 * Every website owned by an account, newest first by default.
 *
 * Also the ownership boundary: callers pass the id from `useAuth()`, never a
 * value typed into the URL.
 */
export function listWebsites(ownerId: string | undefined): WebsiteRecord[] {
  if (!ownerId) return [];
  const records = readStore()[ownerId];
  if (!Array.isArray(records)) return [];
  return records
    .filter(isRecord)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

/** One website, only if this account owns it. */
export function getWebsite(ownerId: string | undefined, id: string): WebsiteRecord | null {
  if (!ownerId) return null;
  return listWebsites(ownerId).find((record) => record.id === id) ?? null;
}

/** Search + status filter + sort, applied to the account's own records. */
export function queryWebsites(ownerId: string | undefined, query: WebsiteQuery = {}): WebsiteRecord[] {
  const { search = '', status = 'all', sort = 'newest' } = query;
  const needle = search.trim().toLowerCase();

  const filtered = listWebsites(ownerId).filter((record) => {
    if (status !== 'all' && record.status !== status) return false;
    if (!needle) return true;
    return (
      record.name.toLowerCase().includes(needle) ||
      record.url.toLowerCase().includes(needle) ||
      record.domain.toLowerCase().includes(needle)
    );
  });

  if (sort === 'oldest') return [...filtered].reverse();
  if (sort === 'name') {
    return [...filtered].sort((a, b) => a.name.localeCompare(b.name));
  }
  return filtered;
}

/** Duplicate check, scoped to the owner and ignoring the record being edited. */
export function isUrlTaken(
  ownerId: string | undefined,
  url: string,
  exceptId?: string,
): boolean {
  const key = urlKey(url);
  if (!key) return false;
  return listWebsites(ownerId).some(
    (record) => record.id !== exceptId && urlKey(record.url) === key,
  );
}

function cleanName(name: string): string {
  return name.trim().replace(/\s+/g, ' ');
}

export async function addWebsite(
  ownerId: string | undefined,
  input: WebsiteInput,
): Promise<WebsiteResult> {
  await delay(LATENCY_MS);
  if (!ownerId) return { ok: false, code: 'forbidden' };

  const name = cleanName(input.name);
  if (!name) return { ok: false, code: 'invalidName' };

  const url = normaliseUrl(input.url);
  if (!url) return { ok: false, code: 'invalidUrl' };

  if (isUrlTaken(ownerId, url)) return { ok: false, code: 'duplicateUrl' };

  const now = new Date().toISOString();
  const record: WebsiteRecord = {
    id: createId(),
    ownerId,
    name,
    url,
    domain: domainOf(url),
    description: input.description.trim(),
    status: 'ready',
    createdAt: now,
    updatedAt: now,
  };

  const store = readStore();
  store[ownerId] = [record, ...(store[ownerId] ?? [])];
  writeStore(store);

  return { ok: true, data: record };
}

/**
 * Update in place.
 *
 * The id and `createdAt` are copied from the stored record, so editing a
 * website can never change its identity or reorder the list — and every
 * evaluation that points at this id keeps pointing at it.
 */
export async function updateWebsite(
  ownerId: string | undefined,
  id: string,
  input: WebsiteInput,
): Promise<WebsiteResult> {
  await delay(LATENCY_MS);
  if (!ownerId) return { ok: false, code: 'forbidden' };

  const store = readStore();
  const records = store[ownerId] ?? [];
  const index = records.findIndex((record) => record.id === id);
  if (index === -1) return { ok: false, code: 'notFound' };

  const name = cleanName(input.name);
  if (!name) return { ok: false, code: 'invalidName' };

  const url = normaliseUrl(input.url);
  if (!url) return { ok: false, code: 'invalidUrl' };

  if (isUrlTaken(ownerId, url, id)) return { ok: false, code: 'duplicateUrl' };

  const current = records[index];
  const updated: WebsiteRecord = {
    ...current,
    name,
    url,
    domain: domainOf(url),
    description: input.description.trim(),
    updatedAt: new Date().toISOString(),
  };

  const next = [...records];
  next[index] = updated;
  store[ownerId] = next;
  writeStore(store);

  return { ok: true, data: updated };
}

/**
 * Delete a website.
 *
 * Related evaluations are **kept**, not deleted: they are the user's history and
 * a report must not vanish because a site was re-registered under a new URL.
 * `detachEvaluations` clears the link (and stores the website's name) so the
 * history reads as "Nadia's portfolio — removed website" instead of breaking.
 * The count returned tells the UI how many records were preserved.
 */
export async function deleteWebsite(
  ownerId: string | undefined,
  id: string,
): Promise<WebsiteResult & { detached: number }> {
  await delay(LATENCY_MS);
  if (!ownerId) return { ok: false, code: 'forbidden', detached: 0 };

  const store = readStore();
  const records = store[ownerId] ?? [];
  const record = records.find((entry) => entry.id === id);
  if (!record) return { ok: false, code: 'notFound', detached: 0 };

  const relatedCount = listEvaluations(ownerId).filter(
    (item) => item.websiteId === id,
  ).length;

  store[ownerId] = records.filter((entry) => entry.id !== id);
  writeStore(store);

  if (relatedCount > 0) detachEvaluations(ownerId, id, record.name);

  return { ok: true, data: record, detached: relatedCount };
}

/** How many evaluations point at this website. Used by the delete dialog. */
export function countEvaluationsFor(ownerId: string | undefined, id: string): number {
  return listEvaluations(ownerId).filter((item) => item.websiteId === id).length;
}

/** Total websites for the dashboard, derived from the store. */
export function countWebsites(ownerId: string | undefined): number {
  return listWebsites(ownerId).length;
}

export type { WebsiteStatus };
export type { WebsiteListResult };
