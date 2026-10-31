import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  clearMockSession,
  readMockSession,
  writeMockSession,
  type MockUser,
} from '@/lib/mockAuth';
import type { SessionContextValue } from '@/types/session';

const SessionContext = createContext<SessionContextValue | null>(null);

/**
 * Holds the mock session for the whole app.
 *
 * Read lazily on mount rather than during render so server-side rendering and
 * the first client paint agree: no `localStorage` access until the browser has
 * hydrated.
 */
export function SessionProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<MockUser | null>(null);

  const hydrate = useCallback(() => setUser(readMockSession()), []);

  const signIn = useCallback((email: string) => {
    const next = writeMockSession(email);
    setUser(next);
    return next;
  }, []);

  const signOut = useCallback(() => {
    clearMockSession();
    setUser(null);
  }, []);

  const value = useMemo<SessionContextValue>(
    () => ({ user, isAuthenticated: user !== null, signIn, signOut, hydrate }),
    [user, signIn, signOut, hydrate],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession(): SessionContextValue {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
}
