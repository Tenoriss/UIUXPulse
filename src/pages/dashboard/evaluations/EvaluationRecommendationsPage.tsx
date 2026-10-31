import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Badge, Button, EmptyState } from '@/components/ui';
import { RecommendationCard } from '@/components/results/RecommendationCard';
import { routes } from '@/config/site';
import { useI18n } from '@/i18n';
import { groupRecommendations } from '@/services/evaluation-results.service';
import {
  priorityOrder,
  type EvaluationResults,
  type ResultPriority,
} from '@/services/evaluation-results.types';
import { cn } from '@/lib/cn';
import { ResultsLayout } from './ResultsLayout';

type PriorityFilter = ResultPriority | 'all';

/**
 * Recommendations.
 *
 * Grouped by priority, since urgency is the only axis that changes what someone
 * reads first. Each card links back to the finding it answers. There is no
 * "apply" or "fix" control anywhere on this page — the product analyses and
 * advises, and the copy says so twice.
 */
export function EvaluationRecommendationsPage() {
  const { t } = useI18n();

  return (
    <ResultsLayout
      section="recommendations"
      title={t('results.recommendations.title')}
      description={t('results.recommendations.lead')}
    >
      {({ results }) => <RecommendationsBody results={results} />}
    </ResultsLayout>
  );
}

function RecommendationsBody({ results }: { results: EvaluationResults }) {
  const { t } = useI18n();
  const { id = '' } = useParams();
  const [priority, setPriority] = useState<PriorityFilter>('all');

  const groups = useMemo(() => groupRecommendations(results), [results]);
  const visible = priority === 'all' ? groups : groups.filter((group) => group.priority === priority);

  const auditHref = (findingId: string) =>
    `${routes.evaluations}/${id}/audit?preview=demo#${findingId}`;

  return (
    <div className="flex flex-col gap-7">
      {/* -------------------------------------------------------- Controls */}
      <div className="flex flex-wrap items-center gap-2 border-b border-line pb-4">
        <span className="mr-1 text-micro uppercase tracking-[0.12em] text-ink-muted">
          {t('results.recommendations.filterLabel')}
        </span>
        {(['all', ...priorityOrder] as PriorityFilter[]).map((option) => (
          <button
            key={option}
            type="button"
            aria-pressed={priority === option}
            onClick={() => setPriority(option)}
            className={cn(
              'rounded-pill border px-3 py-1 text-[0.75rem] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-deep/45',
              priority === option
                ? 'border-sage/50 bg-sage-wash text-sage-ink'
                : 'border-line bg-surface text-ink-soft hover:border-line-strong hover:text-ink',
            )}
          >
            {option === 'all' ? t('results.recommendations.all') : t(`results.priority.${option}`)}
          </button>
        ))}

        <span className="ml-auto text-micro tabular-nums text-ink-muted" aria-live="polite">
          {results.recommendations.length === 1
            ? t('results.recommendations.totalOne')
            : t('results.recommendations.total', {
                count: String(results.recommendations.length),
              })}
        </span>
      </div>

      <p className="flex items-start gap-2 rounded-md border border-line bg-surface-muted/40 px-4 py-3 text-micro text-ink-muted">
        {t('results.recommendations.advisory')}
      </p>

      {/* ----------------------------------------------------------- List */}
      {results.recommendations.length === 0 ? (
        <EmptyState
          title={t('results.recommendations.emptyTitle')}
          description={t('results.recommendations.emptyBody')}
        />
      ) : visible.length === 0 ? (
        <EmptyState
          title={t('results.recommendations.noResultsTitle')}
          description={t('results.recommendations.noResultsBody')}
          action={
            <Button size="sm" tone="neutral" onClick={() => setPriority('all')}>
              {t('results.recommendations.noResultsAction')}
            </Button>
          }
        />
      ) : (
        <div className="flex flex-col gap-9">
          {visible.map((group) => (
            <section key={group.priority} aria-labelledby={`rec-${group.priority}`}>
              <div className="mb-3 flex items-baseline justify-between gap-3 border-b border-line pb-2">
                <h2 id={`rec-${group.priority}`} className="font-serif text-h4 text-ink">
                  {t(`results.priority.${group.priority}`)}
                </h2>
                <Badge tone="neutral">{group.items.length}</Badge>
              </div>

              <ul className="flex flex-col gap-4">
                {group.items.map((recommendation) => (
                  <li key={recommendation.id}>
                    <RecommendationCard
                      recommendation={recommendation}
                      findings={recommendation.findingIds
                        .map((findingId) =>
                          results.findings.find((finding) => finding.id === findingId),
                        )
                        .filter((finding): finding is NonNullable<typeof finding> => Boolean(finding))}
                      auditHref={auditHref}
                    />
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
