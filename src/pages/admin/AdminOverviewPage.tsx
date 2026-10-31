import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowUpRight,
  Database,
  FlaskConical,
  Gauge,
  Globe,
  ListChecks,
  ShieldAlert,
  SlidersHorizontal,
  Users,
} from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge, Card, CardDescription, CardHeader, CardTitle, EmptyState, LinkButton } from '@/components/ui';
import { routes } from '@/config/site';
import { useI18n } from '@/i18n';
import { getAdminOverview } from '@/services/admin.service';
import { useAuth } from '@/services/auth.context';

/**
 * Admin overview.
 *
 * Every number is counted from the stores this browser holds at render time —
 * accounts, websites, saved configurations. Nothing is a stored aggregate, so
 * none of it can drift.
 *
 * Two things are deliberately *absent* because the data to support them does
 * not exist: a registration trend (no event log) and a demo-preview count
 * (opening a preview is never recorded). Both are stated in words rather than
 * filled with a plausible-looking number.
 */
export function AdminOverviewPage() {
  const { t, formatDate } = useI18n();
  const { user } = useAuth();

  const overview = useMemo(() => getAdminOverview(), []);
  const { summary } = overview;

  const metrics = [
    { key: 'users', label: t('admin.metrics.users'), value: summary.users, icon: Users },
    { key: 'websites', label: t('admin.metrics.websites'), value: summary.websites, icon: Globe },
    { key: 'evaluations', label: t('admin.metrics.evaluations'), value: summary.evaluations, icon: Gauge },
    { key: 'pages', label: t('admin.metrics.pages'), value: summary.configuredPages, icon: ListChecks },
  ] as const;

  const quickNav = [
    { to: routes.adminUsers, label: t('admin.nav.users'), icon: Users, body: t('admin.users.lead') },
    { to: routes.adminEvaluations, label: t('admin.nav.evaluations'), icon: ListChecks, body: t('admin.evaluations.lead') },
    { to: routes.adminCriteria, label: t('admin.nav.criteria'), icon: SlidersHorizontal, body: t('admin.criteria.lead') },
  ];

  return (
    <div className="flex flex-col gap-10">
      <PageHeader
        eyebrow={t('admin.restricted')}
        title={t('admin.overview.title')}
        description={t('admin.overview.lead')}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="taupe" dot>
              {t('admin.signingInAs')}
            </Badge>
            <Badge tone="neutral" className="max-w-full truncate">
              {user?.email}
            </Badge>
          </div>
        }
      />

      {/* --------------------------------------------------------- Metrics */}
      <div className="grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <div key={metric.key} className="bg-surface px-5 py-6">
            <p className="flex items-center gap-2 text-micro uppercase tracking-[0.12em] text-ink-muted">
              <metric.icon className="size-3.5" aria-hidden="true" />
              {metric.label}
            </p>
            <p className="mt-3 font-serif text-h1 leading-none tabular-nums text-ink">
              {metric.value}
            </p>
          </div>
        ))}
      </div>

      <div className="grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-3">
        <div className="bg-surface px-5 py-4">
          <p className="text-micro text-ink-muted">{t('admin.metrics.admins')}</p>
          <p className="mt-1 text-[0.9375rem] tabular-nums text-ink">{summary.admins}</p>
        </div>
        <div className="bg-surface px-5 py-4">
          <p className="text-micro text-ink-muted">{t('admin.metrics.awaiting')}</p>
          <p className="mt-1 text-[0.9375rem] tabular-nums text-ink">{summary.awaitingAnalysis}</p>
        </div>
        <div className="bg-surface px-5 py-4">
          <p className="text-micro text-ink-muted">{t('admin.metrics.newThisWeek')}</p>
          <p className="mt-1 text-[0.9375rem] tabular-nums text-ink">{summary.newThisWeek}</p>
        </div>
      </div>

      {/* ------------------------------------------------------- Quick nav */}
      <section aria-labelledby="admin-quick-nav" className="flex flex-col gap-4">
        <div>
          <h2 id="admin-quick-nav" className="font-serif text-h3 text-ink">
            {t('admin.overview.quickNav')}
          </h2>
          <p className="mt-1 text-micro text-ink-muted">{t('admin.overview.quickNavBody')}</p>
        </div>
        <ul className="grid gap-3 md:grid-cols-3">
          {quickNav.map((item) => (
            <li key={item.to}>
              <Link
                to={item.to}
                className="group flex h-full flex-col gap-2 rounded-lg border border-line bg-surface p-5 transition-colors hover:border-line-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-deep/45"
              >
                <span className="flex items-center justify-between gap-3">
                  <span className="flex size-8 items-center justify-center rounded-md border border-line bg-surface-muted text-ink-soft">
                    <item.icon className="size-4" strokeWidth={1.6} aria-hidden="true" />
                  </span>
                  <ArrowUpRight
                    className="size-4 text-ink-faint transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </span>
                <span className="text-[0.9375rem] font-medium text-ink">{item.label}</span>
                <span className="text-micro leading-relaxed text-ink-muted">{item.body}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* --------------------------------------------- Recent activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        <section aria-labelledby="admin-recent-users" className="flex flex-col gap-3">
          <div className="flex items-baseline justify-between gap-3">
            <h2 id="admin-recent-users" className="font-serif text-h3 text-ink">
              {t('admin.overview.recentUsers')}
            </h2>
            <Link to={routes.adminUsers} className="text-micro text-ink-soft underline decoration-line-strong underline-offset-4 hover:text-ink">
              {t('admin.overview.viewAll')}
            </Link>
          </div>

          {overview.recentUsers.length === 0 ? (
            <EmptyState icon={Users} title={t('admin.overview.recentUsersEmpty')} />
          ) : (
            <ul className="divide-y divide-line overflow-hidden rounded-lg border border-line bg-surface">
              {overview.recentUsers.map((row) => (
                <li key={row.id}>
                  <Link
                    to={`${routes.adminUsers}/${row.id}`}
                    className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-surface-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-deep/45"
                  >
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2">
                        <span className="truncate text-[0.875rem] font-medium text-ink">{row.name}</span>
                        {row.role === 'admin' && <Badge tone="taupe">{t('admin.users.roleAdmin')}</Badge>}
                        {row.id === user?.id && <Badge tone="sage">{t('admin.users.you')}</Badge>}
                      </span>
                      <span className="block truncate text-micro text-ink-muted">{row.email}</span>
                    </span>
                    <span className="shrink-0 text-micro tabular-nums text-ink-muted">
                      {formatDate(row.createdAt)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section aria-labelledby="admin-recent-evals" className="flex flex-col gap-3">
          <div className="flex items-baseline justify-between gap-3">
            <h2 id="admin-recent-evals" className="font-serif text-h3 text-ink">
              {t('admin.overview.recentEvaluations')}
            </h2>
            <Link
              to={routes.adminEvaluations}
              className="text-micro text-ink-soft underline decoration-line-strong underline-offset-4 hover:text-ink"
            >
              {t('admin.overview.viewAll')}
            </Link>
          </div>

          {overview.recentEvaluations.length === 0 ? (
            <EmptyState icon={Gauge} title={t('admin.overview.recentEvaluationsEmpty')} />
          ) : (
            <ul className="divide-y divide-line overflow-hidden rounded-lg border border-line bg-surface">
              {overview.recentEvaluations.map((row) => (
                <li key={row.id}>
                  <Link
                    to={`${routes.adminEvaluations}/${row.id}`}
                    className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-surface-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-deep/45"
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[0.875rem] font-medium text-ink">{row.website}</span>
                      <span className="block truncate text-micro text-ink-muted">{row.ownerEmail}</span>
                    </span>
                    <span className="shrink-0 text-right">
                      <span className="block text-micro tabular-nums text-ink-muted">
                        {formatDate(row.createdAt)}
                      </span>
                      <span className="block text-[0.625rem] uppercase tracking-[0.1em] text-ink-faint">
                        {row.pageCount} · {row.categoryCount}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {/* ----------------------------------------------------- System info */}
      <section aria-labelledby="admin-system" className="flex flex-col gap-4">
        <h2 id="admin-system" className="font-serif text-h3 text-ink">
          {t('admin.overview.systemTitle')}
        </h2>

        <div className="grid gap-4 lg:grid-cols-2">
          <Card padding="lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="size-4 text-ink-muted" aria-hidden="true" />
                {t('admin.overview.systemMock')}
              </CardTitle>
              <CardDescription>{t('admin.overview.systemMockValue')}</CardDescription>
            </CardHeader>

            <dl className="mt-6 space-y-3 border-t border-line pt-4 text-micro">
              {[
                { term: t('admin.overview.systemEngine'), detail: t('admin.overview.systemEngineValue') },
                { term: t('admin.overview.systemScoring'), detail: t('admin.overview.systemScoringValue') },
                { term: t('admin.overview.systemAuth'), detail: t('admin.overview.systemAuthValue') },
              ].map((entry) => (
                <div key={entry.term} className="flex flex-col gap-0.5 sm:flex-row sm:gap-3">
                  <dt className="shrink-0 font-medium text-ink sm:w-40">{entry.term}</dt>
                  <dd className="text-ink-muted">{entry.detail}</dd>
                </div>
              ))}
            </dl>

            <p className="mt-5 flex items-start gap-2 rounded-md border border-ochre/25 bg-ochre-soft/50 px-3 py-2.5 text-[0.75rem] leading-relaxed text-ochre-ink">
              <ShieldAlert className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
              {t('admin.mockNotice')}
            </p>
          </Card>

          <div className="flex flex-col gap-4">
            <Card padding="lg">
              <CardHeader>
                <CardTitle>{t('admin.overview.activityTitle')}</CardTitle>
              </CardHeader>
              <p className="mt-3 text-micro leading-relaxed text-ink-muted">
                {t('admin.overview.activityUnavailable')}
              </p>
              <p className="mt-3 inline-flex items-center gap-2 rounded-pill border border-line bg-surface-muted px-2.5 py-1 text-[0.6875rem] text-ink-muted">
                {t('admin.overview.notAvailable')}
              </p>
            </Card>

            <Card padding="lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FlaskConical className="size-4 text-ink-muted" aria-hidden="true" />
                  {t('admin.overview.demoTitle')}
                </CardTitle>
              </CardHeader>
              <p className="mt-3 text-micro leading-relaxed text-ink-muted">
                {t('admin.overview.demoUntracked')}
              </p>
              <p className="mt-3 inline-flex items-center gap-2 rounded-pill border border-line bg-surface-muted px-2.5 py-1 text-[0.6875rem] text-ink-muted">
                {t('admin.overview.notAvailable')}
              </p>
            </Card>
          </div>
        </div>
      </section>

      <div className="flex flex-wrap gap-2">
        <LinkButton to={routes.dashboard} tone="neutral" size="sm">
          {t('admin.nav.backToWorkspace')}
        </LinkButton>
        <LinkButton to={routes.adminEvaluations} tone="dark" size="sm">
          {t('admin.nav.evaluations')}
        </LinkButton>
      </div>
    </div>
  );
}
