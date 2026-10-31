import type {
  AuthOutcome,
  AuthUser,
  LoginPayload,
  ProfileUpdatePayload,
  RegisterPayload,
} from './auth.types';

/**
 * Auth context contract, kept in a plain `.ts` module so the provider file
 * exports only a component (React Fast Refresh requirement, same reason the
 * project keeps `buttonStyles` out of `Button.tsx`).
 */
export interface AuthContextValue {
  user: AuthUser | null;
  /** `loading` until the persisted session has been read on the client. */
  status: 'loading' | 'ready';
  isAuthenticated: boolean;
  /**
   * Centralised role predicate. Every admin gate — the route guard, the
   * navigation, the sidebar entry — reads this one property, so the rule is
   * written once. Frontend mock authorisation: it is a UI rule, not security.
   */
  isAdmin: boolean;
  login: (payload: LoginPayload) => Promise<AuthOutcome>;
  register: (payload: RegisterPayload) => Promise<AuthOutcome>;
  logout: () => Promise<void>;
  resetPassword: (email: string, password: string) => Promise<AuthOutcome>;
  /** Updates name, email, and avatar for the signed-in account. */
  updateProfile: (changes: ProfileUpdatePayload) => Promise<AuthOutcome>;
}
