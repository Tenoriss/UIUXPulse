/**
 * Mock authentication.
 *
 * Frontend only by design: no backend, no tokens, no session service. The
 * session is a single flag in `localStorage` so the UI can demonstrate the
 * authenticated path (a Start an Evaluation click landing in the workspace)
 * and the sign-in redirect with its return destination. Swap the three
 * functions here for real calls later; nothing else needs to change.
 */
const SESSION_KEY = 'uiuxpulse.session.user';

export interface MockUser {
  name: string;
  email: string;
}

export function readMockSession(): MockUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<MockUser>;
    if (typeof parsed?.email !== 'string' || !parsed.email) return null;
    return { name: parsed.name ?? '', email: parsed.email };
  } catch {
    return null;
  }
}

export function writeMockSession(email: string): MockUser {
  const user: MockUser = { name: email.split('@')[0] ?? '', email };
  try {
    window.localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  } catch {
    // Storage can be unavailable (private mode); the session is cosmetic here.
  }
  return user;
}

export function clearMockSession(): void {
  try {
    window.localStorage.removeItem(SESSION_KEY);
  } catch {
    // Nothing to clean up if storage is blocked.
  }
}
