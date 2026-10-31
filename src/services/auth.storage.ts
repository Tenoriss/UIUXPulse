import type { StoredAccount, StoredSession } from './auth.types';

/**
 * The only module that touches `localStorage`.
 *
 * Two keys, both demo-only:
 * - `uiuxpulse.auth.accounts` — registered demo accounts (password digests)
 * - `uiuxpulse.auth.session`  — the active session (user id + timestamp)
 *
 * Every read is defensive: storage can be unavailable (private mode, SSR) or
 * corrupted by a previous build, and neither may break the app.
 */
export const ACCOUNTS_KEY = 'uiuxpulse.auth.accounts';
export const SESSION_KEY = 'uiuxpulse.auth.session';

function getStore(): Storage | null {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return null;
    return window.localStorage;
  } catch {
    return null;
  }
}

function readJson<T>(key: string): T | null {
  const store = getStore();
  if (!store) return null;
  try {
    const raw = store.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function writeJson(key: string, value: unknown): void {
  const store = getStore();
  if (!store) return;
  try {
    store.setItem(key, JSON.stringify(value));
  } catch {
    // Quota or blocked storage: the mock simply will not persist.
  }
}

function remove(key: string): void {
  const store = getStore();
  if (!store) return;
  try {
    store.removeItem(key);
  } catch {
    // Nothing to do.
  }
}

export function readAccounts(): StoredAccount[] {
  const value = readJson<StoredAccount[]>(ACCOUNTS_KEY);
  if (!Array.isArray(value)) return [];
  return value.filter(
    (item): item is StoredAccount =>
      Boolean(item) &&
      typeof item.email === 'string' &&
      typeof item.passwordHash === 'string' &&
      typeof item.id === 'string',
  );
}

export function writeAccounts(accounts: StoredAccount[]): void {
  writeJson(ACCOUNTS_KEY, accounts);
}

export function clearAccounts(): void {
  remove(ACCOUNTS_KEY);
}

export function readSession(): StoredSession | null {
  const value = readJson<StoredSession>(SESSION_KEY);
  if (!value || typeof value.userId !== 'string') return null;
  return { userId: value.userId, startedAt: value.startedAt ?? '' };
}

export function writeSession(session: StoredSession): void {
  writeJson(SESSION_KEY, session);
}

export function clearSession(): void {
  remove(SESSION_KEY);
}
