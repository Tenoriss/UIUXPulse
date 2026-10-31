import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Gauge, Info } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge, Card, CardDescription, CardHeader, CardTitle, EmptyState, LinkButton } from '@/components/ui';
import { criteriaContent } from '@/content/criteria';
import { routes } from '@/config/site';
import { useI18n } from '@/i18n';
import { getEvaluationDetail } from '@/services/admin.service';

const statusTone = {
  created: 'sage',
  inReview: 'ochre',
  completed: 'taupe',
  failed: 'clay',
} as const;

/**
 * One evaluation configuration, read-only.
 *
 * There is no score panel, no findings list and no "run analysis" button. The
 * record is a configuration: pages, categories, viewports. Showing anything
 * beyond that would mean inventing results, and the absence is stated
 * explicitly rather than left as an empty area.
 *
 * The component never writes. It resolves the record through
 * `getEvaluationDetail()`, which reads the owner-keyed store and returns a
 * projection — so opening this page twice cannot change a record.
 */
export function AdminEvaluationDetailPage() {
  const { t, locale, formatDate } = useI18n();
  const { id = '' } = useParams();

  const record = useMemo(() => getEvaluationDetail(id), [id]);
  const criteria = criteriaContent[locale];

  if (!record) {
    return (
      <div className="flex flex-col gap-8">
        <BackLink label={t('admin.evaluations.detailBack')} />
        <h1 className="font-serif text-h2 text-ink">{t('admin.evaluations.detailNotFoundTitle')}</h1>
        <EmptyState
          icon={Gauge}
          title={t('admin.evaluations.detailNotFoundTitle')}
          description={t('admin.evaluations.detailNotFoundBody')}
          action={
            <LinkButton to={routes.adminEvaluations} tone="dark" size="sm">
              {t('admin.evaluations.detailBack')}
            </LinkButton>
          }
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <BackLink label={t('admin.evaluations.detailBack')} />

      <PageHeader
        eyebrow={t('admin.evaluations.detailTitle')}
        title={record.website}
        description={record.url}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone={statusTone[record.status]} dot>
              {t(`evaluation.status.${record.status}`)}
            </Badge>
            <Badge tone="ochre">{t('admin.evaluations.readOnly')}</Badge>
          </div>
        }
      />

      <dl className="grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-3">
        <div className="bg-surface px-5 py-4">
          <dt className="text-micro text-ink-muted">{t('admin.evaluations.columnOwner')}</dt>
          <dd className="mt-1 min-w-0">
            <span className="block truncate text-[0.9375rem] text-ink">{record.ownerName}</span>
            <span className="block truncate text-micro text-ink-muted">{record.ownerEmail}</span>
          </dd>
        </div>
        <div className="bg-surface px-5 py-4">
          <dt className="text-micro text-ink-muted">{t('admin.evaluations.detailCreated')}</dt>
          <dd className="mt-1 text-[0.9375rem] tabular-nums text-ink">{formatDate(record.createdAt)}</dd>
        </div>
        <div className="bg-surface px-5 py-4">
          <dt className="text-micro text-ink-muted">{t('admin.evaluations.columnId')}</dt>
          <dd className="mt-1 break-all font-mono text-[0.75rem] text-ink">{record.id}</dd>
        </div>
      </dl>

      <div className="flex items-start gap-2 rounded-md border border-ochre/25 bg-ochre-soft/50 px-3 py-2.5 text-[0.75rem] leading-relaxed text-ochre-ink">
        <Info className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
        {t('admin.evaluations.detailNoResults')}
      </div>

      <Card padding="lg">
        <CardHeader>
          <CardTitle>{t('admin.evaluations.detailPages')}</CardTitle>
          <CardDescription>
            {record.pageCount} · {t('admin.evaluations.columnPages')}
          </CardDescription>
        </CardHeader>

        {record.pages.length === 0 ? (
          <p className="mt-4 text-micro text-ink-muted">{t('admin.evaluations.detailPagesEmpty')}</p>
        ) : (
          <ul className="mt-4 flex flex-col divide-y divide-line border-t border-line">
            {record.pages.map((page) => (
              <li key={page} className="break-all py-2.5 font-mono text-[0.6875rem] text-ink-soft">
                {page}
              </li>
            ))}
          </ul>
        )}
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card padding="lg">
          <CardHeader>
            <CardTitle>{t('admin.evaluations.detailCategories')}</CardTitle>
            <CardDescription>{record.categoryCount}</CardDescription>
          </CardHeader>
          <ul className="mt-4 flex flex-wrap gap-2">
            {record.categories.map((category) => (
              <li key={category}>
                <Badge tone="sage">{criteria[category]?.name ?? category}</Badge>
              </li>
            ))}
          </ul>
        </Card>

        <Card padding="lg">
          <CardHeader>
            <CardTitle>{t('admin.evaluations.detailViewports')}</CardTitle>
            <CardDescription>{record.viewportCount}</CardDescription>
          </CardHeader>
          <ul className="mt-4 flex flex-wrap gap-2">
            {record.viewports.map((viewport) => (
              <li key={viewport}>
                <Badge tone="neutral">{t(`evaluation.viewports.${viewport}`)}</Badge>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}

function BackLink({ label }: { label: string }) {
  return (
    <Link
      to={routes.adminEvaluations}
      className="inline-flex w-fit items-center gap-1.5 text-micro text-ink-muted transition-colors hover:text-ink"
    >
      <ArrowLeft className="size-3.5" aria-hidden="true" />
      {label}
    </Link>
  );
}
