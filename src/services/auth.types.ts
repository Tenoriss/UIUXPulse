/**
 * Mock authentication types.
 *
 * The shape mirrors what a real service would expose (user, credentials,
 * result objects) so swapping `auth.service.ts` for a backend later does not
 * ripple through the UI.
 */
export interface AuthUser {
  /** Stable id derived from the email address. */
  id: string;
  name: string;
  email: string;
  /** ISO timestamp — when the demo account was registered. */
  createdAt: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

/** Why an operation failed. Mapped to a translation key by the caller. */
export type AuthErrorCode =
  | 'invalidCredentials'
  | 'emailTaken'
  | 'accountNotFound'
  | 'unknown';

/**
 * Discriminated result so callers must handle both branches — no thrown
 * strings, no `undefined` returns.
 */
export type AuthResult<T> =
  | { ok: true; data: T }
  | { ok: false; code: AuthErrorCode };

export type AuthOutcome = AuthResult<AuthUser>;

/**
 * What is persisted for a demo account. Never contains the password: only a
 * salted SHA-256 digest, and only inside this mock.
 */
export interface StoredAccount {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: string;
}

/** The persisted session — a user id and when it started. No secrets. */
export interface StoredSession {
  userId: string;
  startedAt: string;
}
