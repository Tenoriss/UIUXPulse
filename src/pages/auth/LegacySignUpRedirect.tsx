import { Navigate, useLocation } from 'react-router-dom';
import { routes } from '@/config/site';

/**
 * `/sign-up` predates `/register` and is linked from the header, the hero, and
 * older bookmarks. Rather than delete the route (and break every existing
 * link), it forwards to the canonical registration page, carrying any `?next=`
 * destination with it.
 */
export function LegacySignUpRedirect() {
  const { search } = useLocation();
  return <Navigate to={{ pathname: routes.register, search }} replace />;
}
