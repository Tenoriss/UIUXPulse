import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { LoadingState } from '@/components/ui';
import { useAuth } from '@/services/auth.context';
import { routes } from '@/config/site';
import { buildNextPath } from '@/lib/redirect';

/**
 * Route guard for the workspace and admin shells.
 *
 * While the persisted session is being read it renders a neutral loading state
 * rather than redirecting, so a refresh never bounces a signed-in visitor to
 * the login page. Once ready, unauthenticated visitors go to `/sign-in` with
 * the full intended destination — path, query, and hash — in `?next=`.
 */
export function RequireAuth({ children }: { children?: React.ReactNode }) {
  const { status, isAuthenticated } = useAuth();
  const location = useLocation();

  if (status === 'loading') {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-canvas" role="status">
        <LoadingState />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to={{ pathname: routes.signIn, search: `?${buildNextPath(location)}` }}
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  return <>{children ?? <Outlet />}</>;
}
