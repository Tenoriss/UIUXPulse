import { useMemo, useState } from 'react';
import { Globe, Plus, Search, X } from 'lucide-react';
import { LinkButton } from '@/components/ui';
import { Badge, Button, EmptyState, Input } from '@/components/ui';
import { PageHeader } from '@/components/layout/PageHeader';
import { DeleteWebsiteDialog } from '@/components/websites/DeleteWebsiteDialog';
import { useI18n } from '@/i18n';
import { useAuth } from '@/services/auth.context';
import { countEvaluationsByWebsite } from '@/services/evaluation.service';
import { queryWebsites } from '@/services/website.service';
import type { WebsiteRecord, WebsiteStatus } from '@/services/workspace.types';
import { cn } from '@/lib/cn';
import { WebsiteCard } from './WebsiteCard';

type SortKey = 'newest' | 'oldest' | 'name';
type StatusFilter = WebsiteStatus | 'all';

const statusFilters: StatusFilter[] = ['all', 'ready', 'archived'];
const sortOptions: SortKey[] = ['newest', 'oldest', 'name'];

export function WebsitesPage() {
  const { t } = useI18n();
  const { user } = useAuth();

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<StatusFilter>('all');
  const [sort, setSort] = useState<SortKey>('newest');
  const [pendingDelete, setPendingDelete] = useState<WebsiteRecord | null>(null);
  const [revision, setRevision] = useState(0);

  // `revision` re-runs the read after a delete without a full remount.
  const { all, results, counts } = useMemo(() => {
    void revision;
    const everyWebsite = queryWebsites(user?.id, { sort: 'newest' });
    return {
      all: everyWebsite,
      results: queryWebsites(user?.id, { search, status, sort }),
      counts: countEvaluationsByWebsite(user?.id),
    };
  }, [user?.id, search, status, sort, revision]);

  const hasAny = all.length > 0;
  const isFiltered = search.trim().length > 0 || status !== 'all';

  const resetFilters = () => {
    setSearch('');
    setStatus('all');
  };

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        eyebrow={t('websites.eyebrow')}
        title={t('websites.title')}
        description={t('websites.lead')}
        actions={
          <LinkButton to="/app/websites/new" tone="dark">
            <Plus className="size-4" aria-hidden="true" />
            {t('websites.add')}
          </LinkButton>
        }
      />

      {/* --------------------------------------------------------- Totals */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-b border-line pb-5">
        <p className="flex items-baseline gap-2">
          <span className="font-serif text-h3 tabular-nums text-ink">{all.length}</span>
          <span className="text-micro text-ink-muted">
            {all.length === 1
              ? t('websites.countOne', { count: String(all.length) })
              : t('websites.countMany', { count: String(all.length) })}
          </span>
        </p>
        <p className="text-micro text-ink-muted">{t('websites.noEvaluationNote')}</p>
      </div>

      {/* ------------------------------------------------ Search + filters */}
      {hasAny && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="min-w-0 flex-1">
              <Input
                label={t('websites.search')}
                placeholder={t('websites.searchPlaceholder')}
                type="search"
                leadingIcon={<Search className="size-4" aria-hidden="true" />}
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                trailingSlot={
                  search ? (
                    <button
                      type="button"
                      onClick={() => setSearch('')}
                      aria-label={t('websites.clearSearch')}
                      className="flex size-9 items-center justify-center rounded-full text-ink-muted transition-colors hover:bg-surface-muted hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-deep/45"
                    >
                      <X className="size-3.5" aria-hidden="true" />
                    </button>
                  ) : undefined
                }
              />
            </div>

            <label className="flex flex-col gap-2 sm:w-40">
              <span className="text-[0.8125rem] font-medium text-ink">
                {t('websites.sortLabel')}
              </span>
              <select
                value={sort}
                onChange={(event) => setSort(event.target.value as SortKey)}
                className="h-11 rounded-md border border-line bg-surface-sunken px-3 text-body text-ink transition-colors hover:border-line-strong focus-visible:border-sage focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage/35"
              >
                {sortOptions.map((option) => (
                  <option key={option} value={option}>
                    {t(`websites.sort${option === 'newest' ? 'Newest' : option === 'oldest' ? 'Oldest' : 'Name'}`)}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {/* Status chips: only meaningful because records carry a status. */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-1 text-micro uppercase tracking-[0.12em] text-ink-muted">
              {t('websites.filterLabel')}
            </span>
            {statusFilters.map((option) => (
              <button
                key={option}
                type="button"
                aria-pressed={status === option}
                onClick={() => setStatus(option)}
                className={cn(
                  'rounded-pill border px-3 py-1 text-[0.75rem] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-deep/45',
                  status === option
                    ? 'border-sage/50 bg-sage-wash text-sage-ink'
                    : 'border-line bg-surface text-ink-soft hover:border-line-strong hover:text-ink',
                )}
              >
                {option === 'all'
                  ? t('websites.statusAll')
                  : t(`websites.statuses.${option}`)}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ----------------------------------------------------------- List */}
      {!hasAny ? (
        <EmptyState
          icon={Globe}
          title={t('websites.emptyTitle')}
          description={t('websites.emptyBody')}
          action={
            <LinkButton to="/app/websites/new" tone="dark" size="sm">
              <Plus className="size-3.5" aria-hidden="true" />
              {t('websites.emptyAction')}
            </LinkButton>
          }
        />
      ) : results.length === 0 ? (
        <EmptyState
          icon={Search}
          title={t('websites.noResultsTitle')}
          description={t('websites.noResultsBody')}
          action={
            <Button size="sm" tone="neutral" onClick={resetFilters} disabled={!isFiltered}>
              {t('websites.noResultsAction')}
            </Button>
          }
        />
      ) : (
        <>
          <p className="sr-only" aria-live="polite">
            {results.length} {t('websites.eyebrow')}
          </p>
          <ul className="flex flex-col gap-3">
            {results.map((website) => (
              <WebsiteCard
                key={website.id}
                website={website}
                evaluationCount={counts[website.id] ?? 0}
                onDelete={setPendingDelete}
              />
            ))}
          </ul>
          <Badge tone="neutral" className="self-start">
            {t('websites.total')}: {all.length}
          </Badge>
        </>
      )}

      <DeleteWebsiteDialog
        website={pendingDelete}
        relatedCount={pendingDelete ? counts[pendingDelete.id] ?? 0 : 0}
        onClose={() => setPendingDelete(null)}
        onDeleted={() => setRevision((value) => value + 1)}
      />
    </div>
  );
}
