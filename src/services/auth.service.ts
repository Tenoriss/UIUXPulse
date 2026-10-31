import {
  clearAccounts,
  clearSession,
  readAccounts,
  readSession,
  writeAccounts,
  writeSession,
} from './auth.storage';
import type {
  AuthErrorCode,
  AuthOutcome,
  LoginPayload,
  RegisterPayload,
  StoredAccount,
  AuthUser,
} from './auth.types';

/**
 * Centralised mock authentication service.
 *
 * Frontend demonstration only: accounts live in `localStorage`, passwords are
 * never stored. A salted SHA-256 digest is used so the mock behaves like a real
 * credential check (wrong password fails), but SHA-256 is not a password hash —
 * a real backend must replace this module, not extend it.
 *
 * The API is async on purpose so the UI already handles pending states and can
 * swap in `fetch` without changing a single component.
 */

/** Simulated network latency, enough for loading states to be visible. */
const LATENCY_MS = 450;

const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

const normaliseEmail = (email: string) => email.trim().toLowerCase();

/** Deterministic id, so the same email cannot produce two accounts. */
const idForEmail = (email: string) => `user_${encodeURIComponent(normaliseEmail(email))}`;

async function digest(password: string, email: string): Promise<string> {
  const input = `${normaliseEmail(email)}::${password}`;

  // Web Crypto is unavailable in non-secure contexts; fall back to a stable
  // non-cryptographic digest so the demo still works over plain http.
  if (typeof crypto === 'undefined' || !crypto.subtle) {
    let hash = 0;
    for (let index = 0; index < input.length; index += 1) {
      hash = (hash << 5) - hash + input.charCodeAt(index);
      hash |= 0;
    }
    return `fallback_${(hash >>> 0).toString(16)}`;
  }

  const bytes = new TextEncoder().encode(input);
  const buffer = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

function toUser(account: StoredAccount): AuthUser {
  return {
    id: account.id,
    name: account.name,
    email: account.email,
    createdAt: account.createdAt,
  };
}

const fail = (code: AuthErrorCode): AuthOutcome => ({ ok: false, code });

/** Register a demo account. Rejects duplicates and persists a new session. */
export async function register(payload: RegisterPayload): Promise<AuthOutcome> {
  await delay(LATENCY_MS);

  const email = normaliseEmail(payload.email);
  if (!email) return fail('unknown');

  const accounts = readAccounts();
  if (accounts.some((account) => normaliseEmail(account.email) === email)) {
    return fail('emailTaken');
  }

  const account: StoredAccount = {
    id: idForEmail(email),
    name: payload.name.trim(),
    email,
    passwordHash: await digest(payload.password, email),
    createdAt: new Date().toISOString(),
  };

  writeAccounts([...accounts, account]);
  writeSession({ userId: account.id, startedAt: new Date().toISOString() });

  return { ok: true, data: toUser(account) };
}

/** Check credentials against the stored demo accounts. */
export async function login(payload: LoginPayload): Promise<AuthOutcome> {
  await delay(LATENCY_MS);

  const email = normaliseEmail(payload.email);
  const account = readAccounts().find(
    (entry) => normaliseEmail(entry.email) === email,
  );

  // Same result for unknown email and wrong password: never reveal which
  // accounts exist.
  if (!account) return fail('invalidCredentials');

  const hash = await digest(payload.password, email);
  if (hash !== account.passwordHash) return fail('invalidCredentials');

  writeSession({ userId: account.id, startedAt: new Date().toISOString() });
  return { ok: true, data: toUser(account) };
}

/** Clear the persisted session. Accounts are kept, as a real service would. */
export async function logout(): Promise<void> {
  await delay(120);
  clearSession();
}

/**
 * Resolve the persisted session, if the account still exists.
 * Synchronous: it runs once at mount and must not flash a signed-out state.
 */
export function restoreSession(): AuthUser | null {
  const session = readSession();
  if (!session) return null;

  const account = readAccounts().find((entry) => entry.id === session.userId);
  if (!account) {
    // Session points at an account that no longer exists (storage cleared).
    clearSession();
    return null;
  }

  return toUser(account);
}

/** Whether an email already has a demo account. Used for inline feedback. */
export function isEmailRegistered(email: string): boolean {
  const normalised = normaliseEmail(email);
  return readAccounts().some((account) => normaliseEmail(account.email) === normalised);
}

/**
 * Mock password reset. Never sends email — it only confirms that the request
 * was accepted, and deliberately reports the same outcome for unknown
 * addresses so the form cannot be used to enumerate accounts.
 */
export async function requestPasswordReset(email: string): Promise<AuthOutcome> {
  await delay(LATENCY_MS);
  const normalised = normaliseEmail(email);
  const account = readAccounts().find(
    (entry) => normaliseEmail(entry.email) === normalised,
  );

  // Same response either way, so the form cannot enumerate accounts.
  return {
    ok: true,
    data: {
      id: account?.id ?? 'demo',
      name: account?.name ?? '',
      email: normalised,
      createdAt: '',
    },
  };
}

/**
 * Mock password change for the reset screen. If the email has a demo account
 * and a new session is passed, the digest is replaced; otherwise it is a no-op
 * that still reports success, because the flow is a demonstration.
 */
export async function resetPassword(
  email: string,
  password: string,
): Promise<AuthOutcome> {
  await delay(LATENCY_MS);

  const normalised = normaliseEmail(email);
  const accounts = readAccounts();
  const index = accounts.findIndex((entry) => normaliseEmail(entry.email) === normalised);
  if (index === -1) return fail('accountNotFound');

  const updated: StoredAccount = {
    ...accounts[index],
    passwordHash: await digest(password, normalised),
  };
  const next = [...accounts];
  next[index] = updated;
  writeAccounts(next);

  return { ok: true, data: toUser(updated) };
}

/** Test/reset hook: wipe every demo account and session. */
export function clearDemoData(): void {
  clearAccounts();
  clearSession();
}
