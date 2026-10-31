import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, FileText, FlaskConical, Plus, Search, X } from 'lucide-react';
import { Badge, Button, EmptyState, Input, LinkButton } from '@/components/ui';
import { PageHeader } from '@/components/layout/PageHeader';
import { routes } from '@/config/site';
import { useI18n } from '@/i18n';
import { useAuth } from '@/services/auth.context';
import { listEvaluations } from '@/services/evaluation.service';
import { listWebsites } from '@/services/website.service';
import { cn } from '@/lib/cn';

type SortKey = 'newest' | 'oldest';

/**
 * Reports list.
 *
 * One row per saved evaluation, because a configuration report exists for every
 * one of them. Demo reports are advertised on the same row but marked
 * separately and never counted as a report of the account's analysis — the
 * badges say which is which without a legend.
 */
export function ReportsPage() {
  const { t, formatDate } = useI18n();
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortKey>('newest');

  const { rows, hasWebsites } = useMemo(() => {
    const evaluations = listEvaluations(user?.id);
    const needle = search.trim().toLowerCase();

    const filtered = evaluations.filter(
      (record) =>
        !needle ||
        record.website.toLowerCase().includes(needle) ||
        record.url.toLowerCase().includes(needle) ||
        record.id.toLowerCase().includes(needle),
    );

    const ordered = sort === 'oldest' ? [...filtered].reverse() : filtered;

    return {
      rows: ordered,
      hasWebsites: listWebsites(user?.id).length > 0,
    };
  }, [user?.id, search, sort]);

  const total = useMemo(() => listEvaluations(user?.id).length, [user?.id]);
  const isFiltered = search.trim().length > 0;

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        eyebrow={t('report.eyebrow')}
        title={t('report.list.title')}
        description={t('report.list.lead')}
        actions={
          <LinkButton to={routes.evaluationNew} tone="dark">
            <Plus className="size-4" aria-hidden="true" />
            {t('evaluation.list.newEvaluation')}
          </LinkButton>
        }
      />

      {total > 0 && (
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-b border-line pb-5">
          <p className="flex items-baseline gap-2">
            <span className="font-serif text-h3 tabular-nums text-ink">{total}</span>
            <span className="text-micro text-ink-muted">
              {total === 1
                ? t('report.list.countOne', { count: String(total) })
                : t('report.list.countMany', { count: String(total) })}
            </span>
          </p>
          <p className="max-w-md text-micro text-ink-muted">{t('report.list.demoNote')}</p>
        </div>
      )}

      {total > 0 && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="min-w-0 flex-1">
            <Input
              label={t('report.list.search')}
              placeholder={t('report.list.searchPlaceholder')}
              type="search"
              leadingIcon={<Search className="size-4" aria-hidden="true" />}
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              trailingSlot={
                search ? (
                  <button
                    type="button"
                    onClick={() => setSearch('')}
                    aria-label={t('report.list.clearSearch')}
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
              {t('report.list.sortLabel')}
            </span>
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value as SortKey)}
              className="h-11 rounded-md border border-line bg-surface-sunken px-3 text-body text-ink transition-colors hover:border-line-strong focus-visible:border-sage focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage/35"
            >
              <option value="newest">{t('report.list.sortNewest')}</option>
              <option value="oldest">{t('report.list.sortOldest')}</option>
            </select>
          </label>
        </div>
      )}

      {/* ------------------------------------------------------------ List */}
      {total === 0 ? (
        hasWebsites ? (
          <EmptyState
            icon={FileText}
            title={t('report.list.emptyTitle')}
            description={t('report.list.emptyBody')}
            action={
              <LinkButton to={routes.evaluationNew} tone="dark" size="sm">
                <Plus className="size-3.5" aria-hidden="true" />
                {t('report.list.emptyAction')}
              </LinkButton>
            }
          />
        ) : (
          <EmptyState
            icon={FileText}
            title={t('report.list.emptyNoWebsiteTitle')}
            description={t('report.list.emptyNoWebsiteBody')}
            action={
              <LinkButton to={routes.websites} tone="dark" size="sm">
                <Plus className="size-3.5" aria-hidden="true" />
                {t('report.list.emptyNoWebsiteAction')}
              </LinkButton>
            }
          />
        )
      ) : rows.length === 0 ? (
        <EmptyState
          icon={Search}
          title={t('report.list.noResultsTitle')}
          description={t('report.list.noResultsBody')}
          action={
            <Button size="sm" tone="neutral" onClick={() => setSearch('')} disabled={!isFiltered}>
              {t('report.list.noResultsAction')}
            </Button>
          }
        />
      ) : (
        <ul className="flex flex-col gap-3">
          {rows.map((record) => (
            <li
              key={record.id}
              className="group relative overflow-hidden rounded-lg border border-line bg-surface transition-colors focus-within:border-line-strong hover:border-line-strong"
            >
              <div className="flex items-start gap-4 p-4 sm:items-center sm:gap-5 sm:p-5">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-md border border-line bg-surface-muted text-ink-soft">
                  <FileText className="size-4" strokeWidth={1.6} aria-hidden="true" />
                </span>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                    <Link
                      to={`${routes.evaluations}/${record.id}/report`}
                      className="truncate text-[0.9375rem] font-medium text-ink after:absolute after:inset-0 focus-visible:outline-none"
                    >
                      {record.website}
                    </Link>
                    <Badge tone="sage" dot>
                      {t('report.list.available')}
                    </Badge>
                    <Badge tone="neutral">{t('report.type.configuration')}</Badge>
                  </div>

                  <p className="mt-1 break-all text-micro text-ink-muted">{record.url}</p>

                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-micro text-ink-muted">
                    <span className="font-mono text-[0.6875rem]">{record.id}</span>
                    <span className="tabular-nums">
                      {t('report.list.created')} {formatDate(record.createdAt)}
                    </span>
                  </div>

                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <Link
                      to={`${routes.evaluations}/${record.id}/report?preview=demo`}
                      className="relative z-10 inline-flex items-center gap-1.5 rounded-pill border border-line bg-surface px-2.5 py-0.5 text-[0.6875rem] text-ink-soft transition-colors hover:border-clay/40 hover:text-clay-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-deep/45"
                    >
                      <FlaskConical className="size-3" aria-hidden="true" />
                      {t('report.list.demoAvailable')}
                    </Link>
                    <span className="text-[0.625rem] uppercase tracking-[0.1em] text-ink-faint">
                      {t('results.demoLabel')}
                    </span>
                  </div>
                </div>

                <span className="flex shrink-0 items-center gap-1.5 self-center text-micro text-ink-muted transition-colors group-hover:text-ink">
                  <span className="hidden sm:inline">{t('report.list.view')}</span>
                  <ChevronRight
                    className="size-4 transition-transform duration-300 group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}

      {rows.length > 0 && (
        <Badge tone="neutral" className={cn('self-start')}>
          {t('report.list.total')}: {total}
        </Badge>
      )}
    </div>
  );
}
