import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Gauge, Search, X } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge, Button, EmptyState, Input } from '@/components/ui';
import { routes } from '@/config/site';
import { useI18n } from '@/i18n';
import { ADMIN_STATUSES, listEvaluationRows } from '@/services/admin.service';
import type { AdminEvaluationRow } from '@/services/admin.types';
import type { EvaluationStatus } from '@/services/workspace.types';

type StatusFilter = EvaluationStatus | 'all';
type SortKey = 'newest' | 'oldest';

/** Status → badge tone. `created` is the only state a real record reaches. */
const statusTone = {
  created: 'sage',
  inReview: 'ochre',
  completed: 'taupe',
  failed: 'clay',
} as const;

/**
 * Evaluation management.
 *
 * A read-only index over every saved configuration in every account. There are
 * no scores to sort by and no "rescan" action, because there is no analysis
 * engine — the columns are the configuration facts that genuinely exist.
 */
export function AdminEvaluationsPage() {
  const { t, formatDate } = useI18n();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<StatusFilter>('all');
  const [sort, setSort] = useState<SortKey>('newest');

  const all = useMemo(() => listEvaluationRows(), []);
  const rows = useMemo(
    () => listEvaluationRows({ search, status, sort }),
    [search, status, sort],
  );

  const isFiltered = search.trim().length > 0 || status !== 'all';
  const clearFilters = () => {
    setSearch('');
    setStatus('all');
  };

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        eyebrow={t('admin.title')}
        title={t('admin.evaluations.title')}
        description={t('admin.evaluations.lead')}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="neutral">
              {all.length === 1
                ? t('admin.evaluations.countOne')
                : t('admin.evaluations.countMany', { count: String(all.length) })}
            </Badge>
            <Badge tone="ochre">{t('admin.evaluations.readOnly')}</Badge>
          </div>
        }
      />

      <p className="rounded-md border border-line bg-surface-muted/50 px-3 py-2.5 text-[0.75rem] leading-relaxed text-ink-muted">
        {t('admin.evaluations.readOnlyBody')}
      </p>

      {all.length > 0 && (
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
          <div className="min-w-0 flex-1">
            <Input
              label={t('admin.evaluations.search')}
              placeholder={t('admin.evaluations.searchPlaceholder')}
              type="search"
              leadingIcon={<Search className="size-4" aria-hidden="true" />}
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              trailingSlot={
                search ? (
                  <button
                    type="button"
                    onClick={() => setSearch('')}
                    aria-label={t('admin.evaluations.clearFilters')}
                    className="flex size-9 items-center justify-center rounded-full text-ink-muted transition-colors hover:bg-surface-muted hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-deep/45"
                  >
                    <X className="size-3.5" aria-hidden="true" />
                  </button>
                ) : undefined
              }
            />
          </div>

          <label className="flex flex-col gap-2 lg:w-52">
            <span className="text-[0.8125rem] font-medium text-ink">
              {t('admin.evaluations.statusFilter')}
            </span>
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value as StatusFilter)}
              className="h-11 rounded-md border border-line bg-surface-sunken px-3 text-body text-ink transition-colors hover:border-line-strong focus-visible:border-sage focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage/35"
            >
              <option value="all">{t('admin.evaluations.statusAll')}</option>
              {ADMIN_STATUSES.map((value) => (
                <option key={value} value={value}>
                  {t(`evaluation.status.${value}`)}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-2 lg:w-44">
            <span className="text-[0.8125rem] font-medium text-ink">
              {t('admin.evaluations.sortLabel')}
            </span>
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value as SortKey)}
              className="h-11 rounded-md border border-line bg-surface-sunken px-3 text-body text-ink transition-colors hover:border-line-strong focus-visible:border-sage focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage/35"
            >
              <option value="newest">{t('admin.evaluations.sortNewest')}</option>
              <option value="oldest">{t('admin.evaluations.sortOldest')}</option>
            </select>
          </label>
        </div>
      )}

      {all.length === 0 ? (
        <EmptyState
          icon={Gauge}
          title={t('admin.evaluations.emptyTitle')}
          description={t('admin.evaluations.emptyBody')}
        />
      ) : rows.length === 0 ? (
        <EmptyState
          icon={Search}
          title={t('admin.evaluations.noResultsTitle')}
          description={t('admin.evaluations.noResultsBody')}
          action={
            <Button size="sm" tone="neutral" onClick={clearFilters} disabled={!isFiltered}>
              {t('admin.evaluations.clearFilters')}
            </Button>
          }
        />
      ) : (
        <EvaluationTable rows={rows} formatDate={formatDate} />
      )}
    </div>
  );
}

function EvaluationTable({
  rows,
  formatDate,
}: {
  rows: AdminEvaluationRow[];
  formatDate: (value: string) => string;
}) {
  const { t } = useI18n();
  const statusLabel = (value: EvaluationStatus) => t(`evaluation.status.${value}`);

  return (
    <div className="overflow-hidden rounded-lg border border-line bg-surface">
      <table className="hidden w-full table-fixed border-collapse text-left lg:table">
        <caption className="sr-only">{t('admin.evaluations.title')}</caption>
        <thead>
          <tr className="border-b border-line bg-surface-muted/50">
            {[
              { key: 'columnId', width: '24%' },
              { key: 'columnOwner', width: '20%' },
              { key: 'columnWebsite', width: '18%' },
              { key: 'columnCreated', width: '13%' },
              { key: 'columnStatus', width: '13%' },
              { key: 'columnPages', width: '6%' },
              { key: 'columnCategories', width: '6%' },
            ].map((column) => (
              <th
                key={column.key}
                scope="col"
                style={{ width: column.width }}
                className="px-3 py-3 text-micro font-medium uppercase tracking-[0.1em] text-ink-muted first:pl-4 last:pr-4"
              >
                {t(`admin.evaluations.${column.key}`)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {rows.map((row) => (
            <tr key={row.id} className="group transition-colors hover:bg-surface-muted/40">
              <td className="min-w-0 px-3 py-3.5 pl-4">
                <Link
                  to={`${routes.adminEvaluations}/${row.id}`}
                  className="block truncate font-mono text-[0.6875rem] text-ink underline decoration-transparent underline-offset-4 hover:decoration-line-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-deep/45"
                >
                  {row.id}
                </Link>
              </td>
              <td className="min-w-0 px-3 py-3.5">
                <p className="truncate text-[0.8125rem] text-ink">{row.ownerName}</p>
                <p className="truncate text-[0.6875rem] text-ink-muted">{row.ownerEmail}</p>
              </td>
              <td className="min-w-0 px-3 py-3.5">
                <p className="truncate text-[0.8125rem] text-ink">{row.website}</p>
                <p className="truncate text-[0.6875rem] text-ink-muted">{row.url}</p>
              </td>
              <td className="px-3 py-3.5 text-[0.6875rem] tabular-nums text-ink-soft">
                {formatDate(row.createdAt)}
              </td>
              <td className="px-3 py-3.5">
                <Badge tone={statusTone[row.status]} dot>
                  {statusLabel(row.status)}
                </Badge>
              </td>
              <td className="px-3 py-3.5 text-right text-[0.6875rem] tabular-nums text-ink-soft">
                {row.pageCount}
              </td>
              <td className="px-3 py-3.5 pr-4 text-right">
                <Link
                  to={`${routes.adminEvaluations}/${row.id}`}
                  className="inline-flex items-center gap-1 text-[0.6875rem] tabular-nums text-ink-muted transition-colors group-hover:text-ink"
                  aria-label={`${t('admin.evaluations.view')} — ${row.website}`}
                >
                  {row.categoryCount}
                  <ChevronRight className="size-3.5" aria-hidden="true" />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Tablet + mobile: stacked rows that keep every column labelled. */}
      <ul className="divide-y divide-line lg:hidden">
        {rows.map((row) => (
          <li key={row.id}>
            <Link
              to={`${routes.adminEvaluations}/${row.id}`}
              className="flex flex-col gap-2 px-4 py-4 transition-colors hover:bg-surface-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-deep/45"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[0.875rem] font-medium text-ink">{row.website}</span>
                <Badge tone={statusTone[row.status]} dot>
                  {statusLabel(row.status)}
                </Badge>
              </div>
              <p className="break-all text-micro text-ink-muted">{row.url}</p>
              <p className="font-mono text-[0.6875rem] text-ink-muted">{row.id}</p>
              <dl className="mt-1 grid grid-cols-2 gap-2 text-micro sm:grid-cols-4">
                <div>
                  <dt className="text-ink-faint">{t('admin.evaluations.columnOwner')}</dt>
                  <dd className="truncate text-ink-soft">{row.ownerEmail}</dd>
                </div>
                <div>
                  <dt className="text-ink-faint">{t('admin.evaluations.columnCreated')}</dt>
                  <dd className="tabular-nums text-ink-soft">{formatDate(row.createdAt)}</dd>
                </div>
                <div>
                  <dt className="text-ink-faint">{t('admin.evaluations.columnPages')}</dt>
                  <dd className="tabular-nums text-ink-soft">{row.pageCount}</dd>
                </div>
                <div>
                  <dt className="text-ink-faint">{t('admin.evaluations.columnCategories')}</dt>
                  <dd className="tabular-nums text-ink-soft">{row.categoryCount}</dd>
                </div>
              </dl>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
