import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { LoadingState } from '@/components/ui';
import { useAuth } from '@/services/auth.context';
import { routes } from '@/config/site';

/**
 * Route guard for `/admin`.
 *
 * Sits *inside* `<RequireAuth />`, so an unauthenticated visitor gets the
 * ordinary sign-in redirect (with `?next=` preserved) and never reaches the
 * role check at all. Beyond that there is exactly one rule:
 *
 *   `useAuth().isAdmin` — true only when the signed-in account's stored role
 *   is `admin`.
 *
 * The role is read from the account record on every render, not from a URL
 * parameter, a query string, or anything a visitor can set. Changing `/app` to
 * `/admin` in the address bar therefore does nothing for an ordinary account.
 *
 * This is frontend mock authorisation. It shapes the UI and demonstrates the
 * correct structure; it is not a security boundary, because everything running
 * in the browser can be modified by the person using it. Real enforcement has
 * to happen on a server that never trusts this value.
 */
export function RequireAdmin({ children }: { children?: React.ReactNode }) {
  const { status, isAuthenticated, isAdmin } = useAuth();
  const location = useLocation();

  if (status === 'loading') {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-canvas" role="status">
        <LoadingState />
      </div>
    );
  }

  // Not signed in: send to sign-in, keeping the intended destination so the
  // visitor lands on the page they asked for after signing in.
  if (!isAuthenticated) {
    return <Navigate to={routes.signIn} replace state={{ from: location.pathname }} />;
  }

  // Signed in, wrong role. No "you are not allowed" screen with a retry — that
  // would only invite guessing. The workspace is the honest destination.
  if (!isAdmin) {
    return <Navigate to={routes.dashboard} replace state={{ denied: location.pathname }} />;
  }

  return <>{children ?? <Outlet />}</>;
}

export default RequireAdmin;
