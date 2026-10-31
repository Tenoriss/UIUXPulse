import { ChevronRight, Globe, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge, EmptyState } from '@/components/ui';
import type { BadgeProps } from '@/components/ui';
import { routes } from '@/config/site';
import { useI18n } from '@/i18n';
import { cn } from '@/lib/cn';
import type { EvaluationRecord, EvaluationStatus } from '@/services/workspace.types';

const statusTone: Record<EvaluationStatus, NonNullable<BadgeProps['tone']>> = {
  queued: 'neutral',
  inReview: 'ochre',
  completed: 'sage',
  failed: 'clay',
};

/**
 * Recent submissions for the account.
 *
 * Renders nothing fabricated: a record only shows a score when the record
 * itself carries one, which today it never does because no evaluation has been
 * scored. With no records at all, the empty state offers the one action that
 * can change that — starting an evaluation.
 */
export function RecentEvaluations({ evaluations }: { evaluations: EvaluationRecord[] }) {
  const { t, formatDate } = useI18n();

  if (evaluations.length === 0) {
    return (
      <EmptyState
        icon={Globe}
        title={t('dashboard.recentEmptyTitle')}
        description={t('dashboard.recentEmptyBody')}
        action={
          <Link
            to={routes.evaluations}
            className="group inline-flex items-center gap-2 rounded-pill border border-ink bg-ink px-5 py-2.5 text-[0.8125rem] font-medium text-canvas shadow-clay transition-colors hover:bg-ink-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-deep/45 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
          >
            <Plus className="size-3.5" aria-hidden="true" />
            {t('dashboard.newEvaluation')}
          </Link>
        }
      />
    );
  }

  return (
    <ul className="divide-y divide-line border-y border-line">
      {evaluations.map((record) => {
        const hasScore = typeof record.overallScore === 'number';

        return (
          <li key={record.id}>
            <Link
              to={routes.evaluations}
              className="group flex items-center gap-4 py-4 transition-colors hover:bg-surface/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-deep/45"
            >
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[0.875rem] font-medium text-ink">
                  {record.website}
                </span>
                <span className="mt-0.5 block truncate text-micro text-ink-muted">
                  {record.url}
                </span>
              </span>

              <span className="hidden shrink-0 text-micro tabular-nums text-ink-muted sm:block">
                {formatDate(record.createdAt)}
              </span>

              <Badge tone={statusTone[record.status]} dot className="shrink-0">
                {t(`dashboard.status.${record.status}`)}
              </Badge>

              <span
                className={cn(
                  'w-10 shrink-0 text-right font-serif text-[1.125rem] tabular-nums',
                  hasScore ? 'text-ink' : 'text-ink-faint',
                )}
                aria-label={hasScore ? t('dashboard.scoreLabel') : undefined}
              >
                {hasScore ? record.overallScore : '—'}
              </span>

              <ChevronRight
                className="size-4 shrink-0 text-ink-faint transition-transform duration-300 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
