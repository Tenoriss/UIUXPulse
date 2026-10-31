import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/services/auth.context';
import { routes } from '@/config/site';
import { readReturnTo } from '@/lib/redirect';

/**
 * Keeps signed-in visitors out of the auth pages.
 *
 * Applied only to sign-in, register and forgot-password. The reset page is
 * deliberately excluded: reaching it means the visitor asked to change a
 * password, which is legitimate even while signed in.
 */
export function RedirectIfAuthenticated({ children }: { children?: React.ReactNode }) {
  const { status, isAuthenticated } = useAuth();
  const location = useLocation();

  // No browser (server render): show the form rather than an empty page — the
  // client resolves the real session on its first render.
  if (status === 'loading') return <>{children ?? <Outlet />}</>;

  if (isAuthenticated) {
    return <Navigate to={readReturnTo(location.search, routes.dashboard)} replace />;
  }

  return <>{children ?? <Outlet />}</>;
}
