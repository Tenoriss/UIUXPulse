import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardDescription, CardHeader, CardTitle, EmptyState, Tabs } from '@/components/ui';
import { useI18n } from '@/i18n';

const metricKeys = ['queue', 'active', 'published', 'reviewers'] as const;

export function AdminOverviewPage() {
  const { t } = useI18n();

  return (
    <div className="flex flex-col gap-10">
      <PageHeader
        eyebrow={t('admin.restricted')}
        title={t('admin.title')}
        description={t('admin.subtitle')}
      />

      <div className="grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2 xl:grid-cols-4">
        {metricKeys.map((key) => (
          <div key={key} className="bg-surface px-5 py-6">
            <p className="text-micro uppercase tracking-[0.12em] text-ink-faint">
              {t(`admin.metrics.${key}`)}
            </p>
            <p className="mt-3 font-serif text-h1 leading-none text-ink-faint">—</p>
          </div>
        ))}
      </div>

      <Tabs
        ariaLabel={t('tabs.label')}
        variant="pill"
        items={[
          { value: 'queue', label: t('admin.nav.queue') },
          { value: 'criteria', label: t('admin.nav.criteria') },
        ]}
        panels={{
          queue: (
            <EmptyState
              title={t('admin.queueEmptyTitle')}
              description={t('admin.queueEmptyBody')}
            />
          ),
          criteria: (
            <Card padding="lg">
              <CardHeader>
                <CardTitle>{t('admin.criteriaTitle')}</CardTitle>
                <CardDescription>{t('admin.criteriaBody')}</CardDescription>
              </CardHeader>
            </Card>
          ),
        }}
      />
    </div>
  );
}
