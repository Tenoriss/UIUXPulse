import { useMemo, useState } from 'react';
import { Globe, Plus, Search, X } from 'lucide-react';
import { Badge, Button, EmptyState, Input, LinkButton } from '@/components/ui';
import { PageHeader } from '@/components/layout/PageHeader';
import { routes } from '@/config/site';
import { useI18n } from '@/i18n';
import { useAuth } from '@/services/auth.context';
import { listEvaluations, queryEvaluations, summariseEvaluations } from '@/services/evaluation.service';
import { listWebsites } from '@/services/website.service';
import { cn } from '@/lib/cn';
import { EvaluationCard } from './EvaluationCard';

type SortKey = 'newest' | 'oldest';
type LinkFilter = 'all' | 'linked' | 'detached';

const linkFilters: LinkFilter[] = ['all', 'linked', 'detached'];
const sortOptions: SortKey[] = ['newest', 'oldest'];

/**
 * Evaluation list.
 *
 * Replaces the Phase 4 URL-capture placeholder: every row is a saved
 * configuration read from the account's own records, and the totals above the
 * list are derived from those records rather than counted by hand.
 */
export function EvaluationsPage() {
  const { t } = useI18n();
  const { user } = useAuth();

  const [search, setSearch] = useState('');
  const [link, setLink] = useState<LinkFilter>('all');
  const [sort, setSort] = useState<SortKey>('newest');

  const { all, results, summary, hasWebsites } = useMemo(() => {
    const every = listEvaluations(user?.id);
    return {
      all: every,
      results: queryEvaluations(user?.id, { search, link, sort }),
      summary: summariseEvaluations(every),
      hasWebsites: listWebsites(user?.id).length > 0,
    };
  }, [user?.id, search, link, sort]);

  const hasAny = all.length > 0;
  const isFiltered = search.trim().length > 0 || link !== 'all';

  const resetFilters = () => {
    setSearch('');
    setLink('all');
  };

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        eyebrow={t('evaluation.eyebrow')}
        title={t('evaluation.list.title')}
        description={t('evaluation.list.lead')}
        actions={
          <LinkButton to={routes.evaluationNew} tone="dark">
            <Plus className="size-4" aria-hidden="true" />
            {t('evaluation.list.newEvaluation')}
          </LinkButton>
        }
      />

      {/* --------------------------------------------------------- Totals */}
      {hasAny && (
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-b border-line pb-5">
          <p className="flex items-baseline gap-2">
            <span className="font-serif text-h3 tabular-nums text-ink">{summary.total}</span>
            <span className="text-micro text-ink-muted">
              {summary.total === 1
                ? t('evaluation.list.countOne', { count: String(summary.total) })
                : t('evaluation.list.countMany', { count: String(summary.total) })}
            </span>
          </p>
          <p className="text-micro text-ink-muted">{t('evaluation.status.created')}</p>
        </div>
      )}

      {/* ------------------------------------------------ Search + filters */}
      {hasAny && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="min-w-0 flex-1">
              <Input
                label={t('evaluation.list.search')}
                placeholder={t('evaluation.list.searchPlaceholder')}
                type="search"
                leadingIcon={<Search className="size-4" aria-hidden="true" />}
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                trailingSlot={
                  search ? (
                    <button
                      type="button"
                      onClick={() => setSearch('')}
                      aria-label={t('evaluation.list.clearSearch')}
                      className="flex size-9 items-center justify-center rounded-full text-ink-muted transition-colors hover:bg-surface-muted hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-deep/45"
                    >
                      <X className="size-3.5" aria-hidden="true" />
                    </button>
                  ) : undefined
                }
              />
            </div>

            <label className="flex flex-col gap-2 sm:w-44">
              <span className="text-[0.8125rem] font-medium text-ink">
                {t('evaluation.list.sortLabel')}
              </span>
              <select
                value={sort}
                onChange={(event) => setSort(event.target.value as SortKey)}
                className="h-11 rounded-md border border-line bg-surface-sunken px-3 text-body text-ink transition-colors hover:border-line-strong focus-visible:border-sage focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage/35"
              >
                {sortOptions.map((option) => (
                  <option key={option} value={option}>
                    {option === 'newest'
                      ? t('evaluation.list.sortNewest')
                      : t('evaluation.list.sortOldest')}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-1 text-micro uppercase tracking-[0.12em] text-ink-muted">
              {t('evaluation.list.filterLabel')}
            </span>
            {linkFilters.map((option) => (
              <button
                key={option}
                type="button"
                aria-pressed={link === option}
                onClick={() => setLink(option)}
                className={cn(
                  'rounded-pill border px-3 py-1 text-[0.75rem] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-deep/45',
                  link === option
                    ? 'border-sage/50 bg-sage-wash text-sage-ink'
                    : 'border-line bg-surface text-ink-soft hover:border-line-strong hover:text-ink',
                )}
              >
                {option === 'all'
                  ? t('evaluation.list.filterAll')
                  : option === 'linked'
                    ? t('evaluation.list.filterLinked')
                    : t('evaluation.list.filterDetached')}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ----------------------------------------------------------- List */}
      {!hasAny ? (
        hasWebsites ? (
          <EmptyState
            icon={Globe}
            title={t('evaluation.list.emptyTitle')}
            description={t('evaluation.list.emptyBody')}
            action={
              <LinkButton to={routes.evaluationNew} tone="dark" size="sm">
                <Plus className="size-3.5" aria-hidden="true" />
                {t('evaluation.list.emptyAction')}
              </LinkButton>
            }
          />
        ) : (
          <EmptyState
            icon={Globe}
            title={t('evaluation.list.emptyNoWebsiteTitle')}
            description={t('evaluation.list.emptyNoWebsiteBody')}
            action={
              <LinkButton to={routes.websites} tone="dark" size="sm">
                <Plus className="size-3.5" aria-hidden="true" />
                {t('evaluation.list.emptyNoWebsiteAction')}
              </LinkButton>
            }
          />
        )
      ) : results.length === 0 ? (
        <EmptyState
          icon={Search}
          title={t('evaluation.list.noResultsTitle')}
          description={t('evaluation.list.noResultsBody')}
          action={
            <Button size="sm" tone="neutral" onClick={resetFilters} disabled={!isFiltered}>
              {t('evaluation.list.noResultsAction')}
            </Button>
          }
        />
      ) : (
        <>
          <p className="sr-only" aria-live="polite">
            {results.length}
          </p>
          <ul className="flex flex-col gap-3">
            {results.map((record) => (
              <EvaluationCard key={record.id} record={record} />
            ))}
          </ul>
          <Badge tone="neutral" className="self-start">
            {t('evaluation.list.total')}: {all.length}
          </Badge>
        </>
      )}
    </div>
  );
}
