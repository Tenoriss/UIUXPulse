import { Link } from 'react-router-dom';
import { ChevronRight, Link2, Globe } from 'lucide-react';
import { Badge } from '@/components/ui';
import { statusTone } from '@/components/evaluations/EvaluationSummary';
import { useI18n } from '@/i18n';
import type { EvaluationRecord } from '@/services/workspace.types';

export interface EvaluationCardProps {
  record: EvaluationRecord;
}

/**
 * One row in the evaluation list.
 *
 * Shows the configuration only: which site, how many pages and categories, when
 * it was saved, and its status. There is no score column, because no record has
 * a score — the row would be inventing one.
 */
export function EvaluationCard({ record }: EvaluationCardProps) {
  const { t, formatDate } = useI18n();

  return (
    <li className="group relative overflow-hidden rounded-lg border border-line bg-surface transition-colors focus-within:border-line-strong hover:border-line-strong">
      <div className="flex items-start gap-4 p-4 sm:items-center sm:gap-5 sm:p-5">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-md border border-line bg-surface-muted text-ink-soft">
          <Link2 className="size-4" strokeWidth={1.6} aria-hidden="true" />
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
            <Link
              to={`/app/evaluations/${record.id}`}
              className="truncate text-[0.9375rem] font-medium text-ink after:absolute after:inset-0 focus-visible:outline-none"
            >
              {record.website}
            </Link>
            <Badge tone={statusTone[record.status]} dot>
              {t(`evaluation.status.${record.status}`)}
            </Badge>
            {!record.websiteId && (
              <Badge tone="taupe">{t('evaluation.list.removedWebsite')}</Badge>
            )}
          </div>

          <p className="mt-1 flex items-center gap-1.5 truncate text-micro text-ink-muted">
            <Globe className="size-3 shrink-0" aria-hidden="true" />
            <span className="truncate">{record.url}</span>
          </p>

          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-micro text-ink-muted">
            <span className="tabular-nums">{formatDate(record.createdAt)}</span>
            <span className="tabular-nums">
              {t('evaluation.list.pagesLabel')}: {record.pages.length}
            </span>
            <span className="tabular-nums">
              {t('evaluation.list.categoriesLabel')}: {record.categories.length}
            </span>
          </div>
        </div>

        <span className="flex shrink-0 items-center gap-1.5 self-center text-micro text-ink-muted transition-colors group-hover:text-ink">
          <span className="hidden sm:inline">{t('evaluation.list.viewLabel')}</span>
          <ChevronRight
            className="size-4 transition-transform duration-300 group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </span>
      </div>
    </li>
  );
}
