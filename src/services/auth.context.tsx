import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  login as loginRequest,
  logout as logoutRequest,
  register as registerRequest,
  resetPassword as resetPasswordRequest,
  restoreSession,
  updateProfile as updateProfileRequest,
} from './auth.service';
import type {
  AuthOutcome,
  AuthUser,
  LoginPayload,
  ProfileUpdatePayload,
  RegisterPayload,
} from './auth.types';
import type { AuthContextValue } from './auth.context.types';

const AuthContext = createContext<AuthContextValue | null>(null);

/**
 * Holds the demo session for the whole app.
 *
 * `status` starts as `loading` so guards wait for the persisted session instead
 * of redirecting a signed-in visitor during the first frame. The read happens
 * in an effect, never during render, so server markup and the first client
 * paint agree.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  // The session is read once, lazily, so a refresh lands on the correct state
  // on the very first render — no flash of the sign-in form for a visitor who
  // is already signed in, and no flash of the workspace for one who is not.
  // `status` is only `loading` where there is no browser (SSR), so guards can
  // tell "not yet known" apart from "signed out".
  const [user, setUser] = useState<AuthUser | null>(() => restoreSession());
  const [status] = useState<AuthContextValue['status']>(() =>
    typeof window === 'undefined' ? 'loading' : 'ready',
  );

  const login = useCallback(async (payload: LoginPayload): Promise<AuthOutcome> => {
    const result = await loginRequest(payload);
    if (result.ok) setUser(result.data);
    return result;
  }, []);

  const register = useCallback(
    async (payload: RegisterPayload): Promise<AuthOutcome> => {
      const result = await registerRequest(payload);
      if (result.ok) setUser(result.data);
      return result;
    },
    [],
  );

  const logout = useCallback(async () => {
    await logoutRequest();
    setUser(null);
  }, []);

  const resetPassword = useCallback(
    async (email: string, password: string): Promise<AuthOutcome> => {
      const result = await resetPasswordRequest(email, password);
      if (result.ok) setUser(result.data);
      return result;
    },
    [],
  );

  /**
   * Profile edits keep the same account id and the same session, so the
   * visitor is never signed out by saving their own name.
   */
  const updateProfile = useCallback(
    async (changes: ProfileUpdatePayload): Promise<AuthOutcome> => {
      if (!user) return { ok: false, code: 'accountNotFound' };
      const result = await updateProfileRequest(user.id, changes);
      if (result.ok) setUser(result.data);
      return result;
    },
    [user],
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      status,
      isAuthenticated: status === 'ready' && user !== null,
      login,
      register,
      logout,
      resetPassword,
      updateProfile,
    }),
    [user, status, login, register, logout, resetPassword, updateProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
