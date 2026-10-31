import { Outlet, useLocation } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { dashboardNav } from '@/config/navigation';
import { routes } from '@/config/site';
import { useI18n } from '@/i18n';
import { useAuth } from '@/services/auth.context';

const sectionKeys = [
  { path: routes.evaluations, key: 'dashboard.nav.evaluations' },
  { path: routes.reports, key: 'dashboard.nav.reports' },
  { path: routes.settings, key: 'dashboard.nav.settings' },
  { path: routes.dashboard, key: 'dashboard.nav.overview' },
] as const;

/**
 * Authenticated workspace shell. The auth gate lives above this in the route
 * tree (`<RequireAuth />`), so by the time it renders there is always a user.
 */
export function DashboardLayout() {
  const { t } = useI18n();
  const { user } = useAuth();
  const location = useLocation();

  const current =
    sectionKeys.find(
      (entry) => location.pathname === entry.path || location.pathname.startsWith(`${entry.path}/`),
    )?.key ?? 'dashboard.nav.overview';

  return (
    <AppShell
      items={dashboardNav}
      sectionLabel={t('dashboard.workspace')}
      workspaceName={user?.name || t('dashboard.workspace')}
      accent="sage"
      topbar={{ sectionLabel: t(current) }}
    >
      <div key={location.pathname} className="mx-auto w-full max-w-6xl animate-fade-in">
        <Outlet />
      </div>
    </AppShell>
  );
}
