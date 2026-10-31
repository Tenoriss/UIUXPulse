import { ArrowLeft, LogOut } from 'lucide-react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui';
import { AppShell } from '@/components/layout/AppShell';
import { adminNav } from '@/config/navigation';
import { routes } from '@/config/site';
import { useI18n } from '@/i18n';
import { useToast } from '@/providers/ToastProvider';
import { useAuth } from '@/services/auth.context';

const sectionKeys = [
  { path: routes.adminCriteria, key: 'admin.nav.criteria' },
  { path: routes.adminEvaluations, key: 'admin.nav.evaluations' },
  { path: routes.adminUsers, key: 'admin.nav.users' },
  { path: routes.adminSettings, key: 'admin.nav.settings' },
  { path: routes.admin, key: 'admin.nav.overview' },
] as const;

/**
 * Internal administration shell.
 *
 * Reached only through `<RequireAuth />` → `<RequireAdmin />`, so by the time
 * this renders the account is authenticated *and* carries the `admin` role.
 * Nothing here re-checks the role: a second, divergent check is how a UI ends
 * up disagreeing with its own guard.
 *
 * Shares the AppShell primitives with the dashboard but keeps the taupe accent
 * and the "restricted" marker, so the two areas never read as one surface.
 */
export function AdminLayout() {
  const { t } = useI18n();
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();

  const current =
    sectionKeys.find(
      (entry) => location.pathname === entry.path || location.pathname.startsWith(`${entry.path}/`),
    )?.key ?? 'admin.nav.overview';

  const footer = (
    <>
      <Link
        to={routes.dashboard}
        className="flex items-center gap-2 rounded-sm px-3 py-2 text-[0.8125rem] text-ink-soft transition-colors hover:bg-surface hover:text-ink"
      >
        <ArrowLeft className="size-3.5" aria-hidden="true" />
        {t('admin.nav.backToWorkspace')}
      </Link>

      <button
        type="button"
        onClick={() => {
          // Leave the guarded area before clearing the session, so the guard
          // and this navigation do not race.
          navigate(routes.home, { replace: true });
          void logout().then(() => {
            toast({
              title: t('auth.signedOutTitle'),
              description: t('auth.signedOutLead'),
              variant: 'info',
            });
          });
        }}
        className="flex w-full items-center gap-2 rounded-sm px-3 py-2 text-left text-[0.8125rem] text-ink-soft transition-colors hover:bg-surface hover:text-ink"
      >
        <LogOut className="size-3.5" aria-hidden="true" />
        {t('admin.nav.signOut')}
      </button>
    </>
  );

  return (
    <AppShell
      items={adminNav}
      sectionLabel={t('admin.title')}
      workspaceName={user?.name || t('admin.title')}
      accent="taupe"
      footer={footer}
      topbar={{ sectionLabel: t(current), showNewEvaluation: false }}
    >
      <div key={location.pathname} className="mx-auto w-full max-w-6xl animate-fade-in">
        <div className="mb-8 flex flex-wrap items-center gap-x-3 gap-y-2">
          <Badge tone="taupe">{t('admin.restricted')}</Badge>
          <span className="text-micro text-ink-muted">{t('admin.restrictedBody')}</span>
        </div>
        <Outlet />
      </div>
    </AppShell>
  );
}
