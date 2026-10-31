import { useEffect } from 'react';
import { useSession } from '@/providers/SessionProvider';

/**
 * Reads the stored mock session once after mount.
 *
 * Kept out of the provider's initial state on purpose: reading `localStorage`
 * during render would make the server-rendered markup and the first client
 * paint disagree about whether the visitor is signed in.
 */
export function useHydrateSession(): void {
  const { hydrate } = useSession();

  useEffect(() => {
    hydrate();
  }, [hydrate]);
}
