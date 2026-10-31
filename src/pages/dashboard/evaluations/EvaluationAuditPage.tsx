import { useMemo, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { Badge, Button, EmptyState, Input } from '@/components/ui';
import { FindingCard } from '@/components/results/FindingCard';
import { criteriaContent } from '@/content/criteria';
import { demoResultsCopy } from '@/content/demoResults';
import { routes } from '@/config/site';
import { useI18n } from '@/i18n';
import { queryFindings, sortByPriority } from '@/services/evaluation-results.service';
import {
  priorityOrder,
  type EvaluationResults,
  type Finding,
  type ResultPriority,
} from '@/services/evaluation-results.types';
import type { EvaluationCategoryId } from '@/services/workspace.types';
import { cn } from '@/lib/cn';
import { ResultsLayout } from './ResultsLayout';

type CategoryFilter = EvaluationCategoryId | 'all';
type PriorityFilter = ResultPriority | 'all';

/**
 * Detailed audit.
 *
 * Grouped by category when unfiltered — that is how the six criteria are meant
 * to be read — and flattened into one priority-sorted list once a filter is
 * applied, because a category group containing two of ten results is noise.
 *
 * The category filter is seeded from `?category=` so the "n findings" links on
 * the results page land on the right subset.
 */
export function EvaluationAuditPage() {
  const { t } = useI18n();

  return (
    <ResultsLayout section="audit" title={t('results.audit.title')} description={t('results.audit.lead')}>
      {({ results }) => <AuditBody results={results} />}
    </ResultsLayout>
  );
}

function AuditBody({ results }: { results: EvaluationResults }) {
  const { t, locale } = useI18n();
  const { id = '' } = useParams();
  const [params] = useSearchParams();
  const criteria = criteriaContent[locale];
  const copy = demoResultsCopy[locale];

  const seededCategory = (params.get('category') ?? 'all') as CategoryFilter;
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<CategoryFilter>(
    seededCategory === 'all' || seededCategory in criteria ? seededCategory : 'all',
  );
  const [priority, setPriority] = useState<PriorityFilter>('all');

  const matchText = (finding: Finding) => {
    const text = copy.findings[finding.copyId];
    return `${text?.title ?? ''} ${text?.description ?? ''}`;
  };

  const filtered = useMemo(
    () => queryFindings(results, { search, category, priority }, matchText),
    // `matchText` is derived from locale only; the rest are the actual inputs.
    [results, search, category, priority, locale],
  );

  const isFiltered = search.trim().length > 0 || category !== 'all' || priority !== 'all';
  const resetFilters = () => {
    setSearch('');
    setCategory('all');
    setPriority('all');
  };

  const recommendationsHref = `${routes.evaluations}/${id}/recommendations?preview=demo`;

  // Recommendations keyed by the finding they answer, for the cross-link.
  const recommendationForFinding = useMemo(() => {
    const map = new Map<string, string>();
    results.recommendations.forEach((rec) =>
      rec.findingIds.forEach((findingId) => map.set(findingId, rec.id)),
    );
    return map;
  }, [results.recommendations]);

  const grouped = useMemo(
    () =>
      results.categoryResults
        .map((result) => ({
          category: result.category,
          items: filtered.filter((finding) => finding.category === result.category),
        }))
        .filter((group) => group.items.length > 0),
    [results.categoryResults, filtered],
  );

  return (
    <div className="flex flex-col gap-7">
      {/* ------------------------------------------------------- Controls */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="min-w-0 flex-1">
            <Input
              label={t('results.audit.search')}
              placeholder={t('results.audit.searchPlaceholder')}
              type="search"
              leadingIcon={<Search className="size-4" aria-hidden="true" />}
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              trailingSlot={
                search ? (
                  <button
                    type="button"
                    onClick={() => setSearch('')}
                    aria-label={t('results.audit.clearSearch')}
                    className="flex size-9 items-center justify-center rounded-full text-ink-muted transition-colors hover:bg-surface-muted hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-deep/45"
                  >
                    <X className="size-3.5" aria-hidden="true" />
                  </button>
                ) : undefined
              }
            />
          </div>

          <label className="flex flex-col gap-2 sm:w-52">
            <span className="text-[0.8125rem] font-medium text-ink">
              {t('results.audit.categoryFilter')}
            </span>
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value as CategoryFilter)}
              className="h-11 w-full rounded-md border border-line bg-surface-sunken px-3 text-body text-ink transition-colors hover:border-line-strong focus-visible:border-sage focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage/35"
            >
              <option value="all">{t('results.audit.all')}</option>
              {results.categoryResults.map((result) => (
                <option key={result.category} value={result.category}>
                  {criteria[result.category].name}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 text-micro uppercase tracking-[0.12em] text-ink-muted">
            {t('results.audit.priorityFilter')}
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
              {option === 'all' ? t('results.audit.all') : t(`results.priority.${option}`)}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
          <p className="text-micro tabular-nums text-ink-muted" aria-live="polite">
            {filtered.length === 1
              ? t('results.audit.totalOne')
              : t('results.audit.total', { count: String(filtered.length) })}
          </p>
          <div className="flex items-center gap-3">
            <span className="text-micro text-ink-faint">{t('results.audit.sortPriority')}</span>
            {isFiltered && (
              <Button type="button" tone="ghost" size="sm" onClick={resetFilters}>
                {t('results.audit.noResultsAction')}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* ----------------------------------------------------------- List */}
      {results.findings.length === 0 ? (
        <EmptyState
          title={t('results.audit.emptyTitle')}
          description={t('results.audit.emptyBody')}
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          title={t('results.audit.noResultsTitle')}
          description={t('results.audit.noResultsBody')}
          action={
            <Button size="sm" tone="neutral" onClick={resetFilters} disabled={!isFiltered}>
              {t('results.audit.noResultsAction')}
            </Button>
          }
        />
      ) : category !== 'all' || priority !== 'all' || search.trim() ? (
        // A filtered view is one flat, priority-sorted list.
        <ul className="flex flex-col gap-3">
          {sortByPriority(filtered).map((finding) => (
            <li key={finding.id}>
              <FindingCard
                finding={finding}
                recommendationsHref={recommendationsHref}
                recommendationId={recommendationForFinding.get(finding.id)}
                defaultOpen={false}
              />
            </li>
          ))}
        </ul>
      ) : (
        // The unfiltered view is grouped by category, the way the six criteria
        // are meant to be read.
        <div className="flex flex-col gap-8">
          {grouped.map((group) => (
            <section key={group.category} aria-labelledby={`audit-${group.category}`}>
              <div className="mb-3 flex items-baseline justify-between gap-3">
                <h2 id={`audit-${group.category}`} className="font-serif text-h4 text-ink">
                  {criteria[group.category].name}
                </h2>
                <Badge tone="neutral">{group.items.length}</Badge>
              </div>
              <p className="mb-3 text-micro text-ink-muted">{criteria[group.category].summary}</p>
              <ul className="flex flex-col gap-3">
                {group.items.map((finding) => (
                  <li key={finding.id}>
                    <FindingCard
                      finding={finding}
                      recommendationsHref={recommendationsHref}
                      recommendationId={recommendationForFinding.get(finding.id)}
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
