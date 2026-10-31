/**
 * Mock authentication types.
 *
 * The shape mirrors what a real service would expose (user, credentials,
 * result objects) so swapping `auth.service.ts` for a backend later does not
 * ripple through the UI.
 */
export interface AuthUser {
  /** Stable id, assigned once at registration and never derived from email. */
  id: string;
  name: string;
  email: string;
  /** ISO timestamp — when the demo account was registered. */
  createdAt: string;
  /**
   * Custom avatar as a compressed data URL. `null` means "use the default
   * pixel mascot". Never a remote URL — images stay in this browser.
   */
  avatarUrl: string | null;
}

/** Fields the profile form may change. */
export interface ProfileUpdatePayload {
  name: string;
  email: string;
  avatarUrl: string | null;
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
  /** Optional so accounts created before Phase 4 keep loading. */
  avatarUrl?: string | null;
}

/** The persisted session — a user id and when it started. No secrets. */
export interface StoredSession {
  userId: string;
  startedAt: string;
}
