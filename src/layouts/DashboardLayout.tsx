import { Link, Outlet, useLocation } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
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
  const { user, isAdmin } = useAuth();
  const location = useLocation();

  const current =
    sectionKeys.find(
      (entry) => location.pathname === entry.path || location.pathname.startsWith(`${entry.path}/`),
    )?.key ?? 'dashboard.nav.overview';

  // The admin entry is rendered from `isAdmin`, which is derived from the
  // stored account role — never from the URL and never from a fixed list. An
  // ordinary account therefore has no admin link anywhere in its chrome.
  const footer = isAdmin ? (
    <Link
      to={routes.admin}
      className="flex items-center gap-2 rounded-sm px-3 py-2 text-[0.8125rem] text-ink-soft transition-colors hover:bg-surface hover:text-ink"
    >
      <ShieldCheck className="size-3.5 text-taupe" aria-hidden="true" />
      {t('admin.nav.openAdmin')}
    </Link>
  ) : undefined;

  return (
    <AppShell
      items={dashboardNav}
      footer={footer}
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
