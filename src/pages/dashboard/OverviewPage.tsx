import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Gauge,
  Globe,
  ListChecks,
  PenLine,
  Plus,
  ShieldCheck,
} from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, LinkButton } from '@/components/ui';
import { EditProfileDialog } from '@/components/profile';
import { routes } from '@/config/site';
import { useI18n } from '@/i18n';
import { useAuth } from '@/services/auth.context';
import { useWorkspace } from '@/hooks/useWorkspace';
import { cn } from '@/lib/cn';
import { RecentEvaluations } from './RecentEvaluations';

const scopeKeys = ['scores', 'findings', 'evidence', 'recommendations'] as const;

/**
 * Workspace overview.
 *
 * Every number comes from `useWorkspace()`, which reads the evaluation store
 * for this account. Nothing has been submitted yet, so the counters honestly
 * read zero and the recent list shows an empty state — no sample evaluations,
 * no invented scores.
 */
export function OverviewPage() {
  const { t } = useI18n();
  const { user } = useAuth();
  const { evaluations, summary, isEmpty } = useWorkspace();
  const [profileOpen, setProfileOpen] = useState(false);

  const firstName = (user?.name ?? '').trim().split(/\s+/)[0] || t('profile.fallbackName');

  const stats = [
    { key: 'websites', label: t('dashboard.stats.websites'), value: summary.websites, icon: Globe },
    { key: 'evaluations', label: t('dashboard.stats.evaluations'), value: summary.evaluations, icon: Gauge },
    { key: 'completed', label: t('dashboard.stats.completed'), value: summary.completed, icon: ListChecks },
    { key: 'reports', label: t('dashboard.stats.availableReports'), value: summary.reports, icon: FileText },
  ] as const;

  return (
    <div className="flex flex-col gap-10">
      {/* -------------------------------------------------------- Welcome */}
      <PageHeader
        eyebrow={t('dashboard.overview')}
        title={t('dashboard.welcome', { name: firstName })}
        description={t('dashboard.welcomeBody')}
        actions={
          <LinkButton to={routes.evaluations} tone="dark">
            <Plus className="size-4" aria-hidden="true" />
            {t('dashboard.newEvaluation')}
          </LinkButton>
        }
      />

      {/* ------------------------------------------------------ Statistics */}
      <section aria-labelledby="overview-stats">
        <h2 id="overview-stats" className="sr-only">
          {t('dashboard.statsLabel')}
        </h2>

        <div className="grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            const inner = (
              <>
                <div className="flex items-center justify-between gap-3">
                  <p className="text-micro uppercase tracking-[0.12em] text-ink-muted">
                    {stat.label}
                  </p>
                  <Icon className="size-3.5 text-ink-faint" strokeWidth={1.5} aria-hidden="true" />
                </div>
                <p
                  className={cn(
                    'mt-3 font-serif text-h1 leading-none tabular-nums',
                    stat.value === 0 ? 'text-ink-faint' : 'text-ink',
                  )}
                >
                  {stat.value}
                </p>
              </>
            );

            return stat.key === 'websites' ? (
              <Link
                key={stat.key}
                to={routes.websites}
                className="block bg-surface px-5 py-6 transition-colors hover:bg-surface-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-deep/45"
              >
                {inner}
              </Link>
            ) : (
              <div key={stat.key} className="bg-surface px-5 py-6">
                {inner}
              </div>
            );
          })}
        </div>

        {isEmpty && (
          <p className="mt-3 text-micro text-ink-muted">{t('dashboard.statsEmpty')}</p>
        )}
      </section>

      {/* -------------------------------------------------- Recent + actions */}
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)]">
        <section aria-labelledby="overview-recent">
          <div className="mb-4 flex items-baseline justify-between gap-4">
            <h2 id="overview-recent" className="font-serif text-h4 text-ink">
              {t('dashboard.recent')}
            </h2>
            <Link
              to={routes.evaluations}
              className="text-micro text-ink-soft underline decoration-line-strong underline-offset-4 transition-colors hover:text-ink hover:decoration-ink"
            >
              {t('dashboard.viewAll')}
            </Link>
          </div>

          <RecentEvaluations evaluations={evaluations} />
        </section>

        <section aria-labelledby="overview-actions">
          <h2 id="overview-actions" className="mb-4 font-serif text-h4 text-ink">
            {t('dashboard.quickActions')}
          </h2>

          <Card padding="sm" className="divide-y divide-line">
            <QuickAction
              icon={Plus}
              label={t('dashboard.newEvaluation')}
              description={t('dashboard.quick.newBody')}
              to={routes.evaluations}
            />
            <QuickAction
              icon={Globe}
              label={t('dashboard.nav.websites')}
              description={t('dashboard.quick.websitesBody')}
              to={routes.websites}
            />
            <QuickAction
              icon={Gauge}
              label={t('dashboard.nav.evaluations')}
              description={t('dashboard.quick.evaluationsBody')}
              to={routes.evaluations}
            />
            <QuickAction
              icon={FileText}
              label={t('dashboard.nav.reports')}
              description={t('dashboard.quick.reportsBody')}
              to={routes.reports}
            />
            <button
              type="button"
              onClick={() => setProfileOpen(true)}
              className="group flex w-full items-center gap-3 px-2 py-3.5 text-left transition-colors hover:bg-surface-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-deep/45"
            >
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-line bg-surface text-ink-soft transition-colors group-hover:text-ink">
                <PenLine className="size-3.5" strokeWidth={1.6} aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[0.8125rem] font-medium text-ink">
                  {t('profile.edit')}
                </span>
                <span className="block truncate text-micro text-ink-muted">
                  {t('dashboard.quick.profileBody')}
                </span>
              </span>
            </button>
          </Card>
        </section>
      </div>

      {/* ------------------------------------------------ Principles + scope */}
      <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
        <Card variant="muted" padding="lg">
          <div className="flex items-start gap-4">
            <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full border border-line bg-surface">
              <ShieldCheck className="size-4 text-sage-deep" strokeWidth={1.5} aria-hidden="true" />
            </span>
            <div>
              <h2 className="font-serif text-h4 text-ink">{t('home.principles.observe.title')}</h2>
              <p className="mt-1.5 max-w-lg text-body text-ink-soft">
                {t('home.principles.observe.body')}
              </p>
            </div>
          </div>
        </Card>

        <Card padding="lg">
          <div className="flex items-center justify-between gap-4">
            <p className="eyebrow">{t('dashboard.reportPreview')}</p>
            <Link
              to={routes.methodology}
              className="text-micro text-ink-soft underline decoration-line-strong underline-offset-4 transition-colors hover:text-ink"
            >
              {t('home.ctaSecondary')}
            </Link>
          </div>

          <ul className="mt-6 divide-y divide-line">
            {scopeKeys.map((key, index) => (
              <li key={key} className="flex items-baseline gap-4 py-3 first:pt-0 last:pb-0">
                <span className="text-micro tabular-nums text-ink-muted">0{index + 1}</span>
                <span className="text-[0.8125rem] font-medium text-ink">
                  {t(`home.scope.${key}.title`)}
                </span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <EditProfileDialog open={profileOpen} onClose={() => setProfileOpen(false)} />
    </div>
  );
}

/** Row inside the quick-actions card that behaves as a router link. */
function QuickAction({
  icon: Icon,
  label,
  description,
  to,
}: {
  icon: typeof Plus;
  label: string;
  description: string;
  to: string;
}) {
  return (
    <Link
      to={to}
      className="group flex items-center gap-3 px-2 py-3.5 transition-colors hover:bg-surface-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-deep/45"
    >
      <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-line bg-surface text-ink-soft transition-colors group-hover:text-ink">
        <Icon className="size-3.5" strokeWidth={1.6} aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[0.8125rem] font-medium text-ink">{label}</span>
        <span className="block truncate text-micro text-ink-muted">{description}</span>
      </span>
    </Link>
  );
}
