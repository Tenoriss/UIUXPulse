import { Outlet, useLocation } from 'react-router-dom';
import { Badge } from '@/components/ui';
import { AppShell } from '@/components/layout/AppShell';
import { adminNav } from '@/config/navigation';
import { routes } from '@/config/site';
import { useI18n } from '@/i18n';

const sectionKeys = [
  { path: routes.adminQueue, key: 'admin.nav.queue' },
  { path: routes.adminUsers, key: 'admin.nav.users' },
  { path: routes.adminCriteria, key: 'admin.nav.criteria' },
  { path: routes.adminSettings, key: 'admin.nav.settings' },
  { path: routes.admin, key: 'admin.nav.overview' },
] as const;

/**
 * Internal administration shell. Shares the AppShell primitives with the
 * dashboard but uses a taupe accent and a visible "restricted" marker so the
 * two areas never read as the same product surface.
 */
export function AdminLayout() {
  const { t } = useI18n();
  const location = useLocation();

  const current =
    sectionKeys.find(
      (entry) => location.pathname === entry.path || location.pathname.startsWith(`${entry.path}/`),
    )?.key ?? 'admin.nav.overview';

  return (
    <AppShell
      items={adminNav}
      sectionLabel={t('admin.title')}
      workspaceName="UIUXPulse"
      accent="taupe"
      topbar={{ sectionLabel: t(current), showNewEvaluation: false }}
    >
      <div key={location.pathname} className="mx-auto w-full max-w-6xl animate-fade-in">
        <div className="mb-8 flex items-center gap-3">
          <Badge tone="taupe">{t('admin.restricted')}</Badge>
          <span className="text-micro text-ink-faint">{t('admin.restrictedBody')}</span>
        </div>
        <Outlet />
      </div>
    </AppShell>
  );
}
