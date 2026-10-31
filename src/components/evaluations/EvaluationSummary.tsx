import { Globe, Link2, ShieldAlert } from 'lucide-react';
import { Badge } from '@/components/ui';
import type { BadgeProps } from '@/components/ui';
import { criteriaContent } from '@/content/criteria';
import { useI18n } from '@/i18n';
import { pagePathLabel, viewportOptions } from '@/services/evaluation.constants';
import type {
  EvaluationRecord,
  EvaluationStatus,
  EvaluationViewportId,
} from '@/services/workspace.types';

/**
 * Status → tone. Deliberately conservative: only `completed` reads as success,
 * and nothing can reach it while there is no analysis engine.
 */
export const statusTone: Record<EvaluationStatus, NonNullable<BadgeProps['tone']>> = {
  created: 'neutral',
  inReview: 'ochre',
  completed: 'sage',
  failed: 'clay',
};

/**
 * A saved configuration, read back.
 *
 * Shared by the success screen and the evaluation detail page so a record is
 * always described the same way. There is no score row and no findings block,
 * because no record has either.
 */
export function EvaluationSummary({ record }: { record: EvaluationRecord }) {
  const { t, locale, formatDate } = useI18n();
  const copy = criteriaContent[locale];

  const viewportLabel = (id: EvaluationViewportId) => {
    const option = viewportOptions.find((item) => item.id === id);
    const name = t(`evaluation.viewports.${id}`);
    return option ? `${name} · ${option.width}px` : name;
  };

  return (
    <div className="flex flex-col gap-6">
      <dl className="divide-y divide-line border-y border-line">
        <div className="flex flex-col gap-2 py-4 sm:flex-row sm:items-start sm:justify-between">
          <dt className="text-micro uppercase tracking-[0.12em] text-ink-muted">
            {t('evaluation.detail.websiteTitle')}
          </dt>
          <dd className="flex min-w-0 flex-col items-start gap-1 sm:max-w-[62%] sm:items-end sm:text-right">
            <span className="flex items-center gap-2 text-[0.9375rem] font-medium text-ink">
              <Globe className="size-3.5 shrink-0 text-ink-faint" aria-hidden="true" />
              {record.website}
            </span>
            <span className="max-w-full truncate text-micro text-ink-muted">{record.url}</span>
            {!record.websiteId && (
              <Badge tone="taupe">{t('evaluation.detail.removedWebsite')}</Badge>
            )}
          </dd>
        </div>

        <div className="flex flex-col gap-2 py-4 sm:flex-row sm:items-start sm:justify-between">
          <dt className="text-micro uppercase tracking-[0.12em] text-ink-muted">
            {t('evaluation.detail.statusLabel')}
          </dt>
          <dd className="flex flex-wrap items-center gap-2 sm:justify-end">
            <Badge tone={statusTone[record.status]} dot>
              {t(`evaluation.status.${record.status}`)}
            </Badge>
            <span className="text-micro tabular-nums text-ink-muted">
              {formatDate(record.createdAt)}
            </span>
          </dd>
        </div>

        <div className="flex flex-col gap-2 py-4 sm:flex-row sm:items-start sm:justify-between">
          <dt className="text-micro uppercase tracking-[0.12em] text-ink-muted">
            {t('evaluation.detail.pagesTitle')}
            <span className="ml-2 normal-case tracking-normal text-ink-faint">
              {t('evaluation.review.pagesCount', { count: String(record.pages.length) })}
            </span>
          </dt>
          <dd className="flex min-w-0 flex-col items-start gap-1 sm:max-w-[62%] sm:items-end">
            {record.pages.length === 0 ? (
              <span className="text-micro text-ink-muted">—</span>
            ) : (
              <ul className="flex flex-wrap gap-x-3 gap-y-1 sm:justify-end">
                {record.pages.map((page) => (
                  <li
                    key={page}
                    className="flex items-center gap-1.5 text-[0.8125rem] text-ink-soft"
                    title={page}
                  >
                    <Link2 className="size-3 shrink-0 text-ink-faint" aria-hidden="true" />
                    <span className="break-all font-mono text-[0.75rem]">{pagePathLabel(page)}</span>
                  </li>
                ))}
              </ul>
            )}
          </dd>
        </div>

        <div className="flex flex-col gap-2 py-4 sm:flex-row sm:items-start sm:justify-between">
          <dt className="text-micro uppercase tracking-[0.12em] text-ink-muted">
            {t('evaluation.detail.categoriesTitle')}
          </dt>
          <dd className="flex flex-wrap gap-1.5 sm:justify-end">
            {record.categories.length === 0 ? (
              <span className="text-micro text-ink-muted">—</span>
            ) : (
              record.categories.map((id) => (
                <Badge key={id} tone="sage">
                  {copy[id]?.name ?? id}
                </Badge>
              ))
            )}
          </dd>
        </div>

        <div className="flex flex-col gap-2 py-4 sm:flex-row sm:items-start sm:justify-between">
          <dt className="text-micro uppercase tracking-[0.12em] text-ink-muted">
            {t('evaluation.detail.viewportsTitle')}
          </dt>
          <dd className="flex flex-wrap gap-1.5 sm:justify-end">
            {record.viewports.length === 0 ? (
              <span className="text-micro text-ink-muted">—</span>
            ) : (
              record.viewports.map((id) => (
                <Badge key={id} tone="neutral">
                  {viewportLabel(id)}
                </Badge>
              ))
            )}
          </dd>
        </div>
      </dl>

      <div className="flex items-start gap-3 rounded-md border border-line bg-surface-muted/40 px-4 py-3">
        <ShieldAlert className="mt-0.5 size-4 shrink-0 text-sage-deep" strokeWidth={1.6} aria-hidden="true" />
        <div className="min-w-0">
          <p className="text-[0.8125rem] font-medium text-ink">{t('evaluation.detail.noAnalysisTitle')}</p>
          <p className="mt-1 text-micro text-ink-muted">{t('evaluation.detail.noAnalysisBody')}</p>
        </div>
      </div>
    </div>
  );
}
