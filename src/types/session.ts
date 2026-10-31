import type { MockUser } from '@/lib/mockAuth';

export interface SessionContextValue {
  user: MockUser | null;
  isAuthenticated: boolean;
  /** Mock sign-in: stores the session and returns the created user. */
  signIn: (email: string) => MockUser;
  signOut: () => void;
  /** Re-read the stored session, called once after hydration. */
  hydrate: () => void;
}
