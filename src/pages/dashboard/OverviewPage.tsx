import { Link } from 'react-router-dom';
import { Plus, ShieldCheck } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button, Card, EmptyState, Tabs } from '@/components/ui';
import { routes } from '@/config/site';
import { useI18n } from '@/i18n';
import { useToast } from '@/providers/ToastProvider';
import { LinkButton } from '@/components/ui/LinkButton';

const statKeys = ['evaluations', 'reports', 'pages', 'pending'] as const;
const scopeKeys = ['scores', 'findings', 'evidence', 'recommendations'] as const;

/**
 * The overview deliberately renders zero-value counters and empty states:
 * this phase has no data model, and inventing sample evaluations would
 * misrepresent the product.
 */
export function OverviewPage() {
  const { t } = useI18n();
  const { toast } = useToast();

  return (
    <div className="flex flex-col gap-10">
      <PageHeader
        eyebrow={t('dashboard.overview')}
        title={t('dashboard.greeting')}
        description={t('dashboard.greetingBody')}
        actions={
          <Button
            tone="dark"
            leadingIcon={<Plus className="size-4" aria-hidden="true" />}
            onClick={() =>
              toast({
                title: t('common.comingSoon'),
                description: t('dashboard.evaluations.body'),
                variant: 'info',
              })
            }
          >
            {t('dashboard.newEvaluation')}
          </Button>
        }
      />

      <div className="grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2 xl:grid-cols-4">
        {statKeys.map((key) => (
          <div key={key} className="bg-surface px-5 py-6">
            <p className="text-micro uppercase tracking-[0.12em] text-ink-muted">
              {t(`dashboard.stats.${key}`)}
            </p>
            <p className="mt-3 font-serif text-h1 leading-none text-ink-faint">0</p>
          </div>
        ))}
      </div>

      <Tabs
        ariaLabel={t('tabs.label')}
        items={[
          { value: 'recent', label: t('dashboard.recent') },
          { value: 'activity', label: t('dashboard.activity') },
        ]}
        panels={{
          recent: (
            <EmptyState
              title={t('dashboard.recentEmptyTitle')}
              description={t('dashboard.recentEmptyBody')}
              action={
                <LinkButton to={routes.evaluations} size="sm" tone="dark">
                  {t('dashboard.recentEmptyAction')}
                </LinkButton>
              }
            />
          ),
          activity: (
            <EmptyState
              title={t('dashboard.activityEmptyTitle')}
              description={t('dashboard.activityEmptyBody')}
            />
          ),
        }}
      />

      <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
        <Card variant="muted" padding="lg">
          <div className="flex items-start gap-4">
            <span className="mt-0.5 flex size-8 items-center justify-center rounded-full border border-line bg-surface">
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
                <span className="text-micro tabular-nums text-ink-muted">
                  0{index + 1}
                </span>
                <span className="text-[0.8125rem] font-medium text-ink">
                  {t(`home.scope.${key}.title`)}
                </span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
