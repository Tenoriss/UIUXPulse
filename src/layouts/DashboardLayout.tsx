import { Outlet, useLocation } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { dashboardNav } from '@/config/navigation';
import { routes } from '@/config/site';
import { useI18n } from '@/i18n';

const sectionKeys = [
  { path: routes.evaluations, key: 'dashboard.nav.evaluations' },
  { path: routes.reports, key: 'dashboard.nav.reports' },
  { path: routes.settings, key: 'dashboard.nav.settings' },
  { path: routes.dashboard, key: 'dashboard.nav.overview' },
] as const;

/** Authenticated workspace shell. No auth gate yet — this is the foundation. */
export function DashboardLayout() {
  const { t } = useI18n();
  const location = useLocation();

  const current =
    sectionKeys.find(
      (entry) => location.pathname === entry.path || location.pathname.startsWith(`${entry.path}/`),
    )?.key ?? 'dashboard.nav.overview';

  return (
    <AppShell
      items={dashboardNav}
      sectionLabel={t('dashboard.workspace')}
      workspaceName="Studio Aria"
      accent="sage"
      topbar={{ sectionLabel: t(current) }}
    >
      <div key={location.pathname} className="mx-auto w-full max-w-6xl animate-fade-in">
        <Outlet />
      </div>
    </AppShell>
  );
}
