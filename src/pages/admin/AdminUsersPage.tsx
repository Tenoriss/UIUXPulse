import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Search, Users, X } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge, Button, EmptyState, Input } from '@/components/ui';
import { routes } from '@/config/site';
import { useI18n } from '@/i18n';
import { useAuth } from '@/services/auth.context';
import { listUserRows } from '@/services/admin.service';
import type { AdminUserRow } from '@/services/admin.types';

type RoleFilter = 'all' | 'user' | 'admin';
type SortKey = 'newest' | 'oldest';

/**
 * User management.
 *
 * Read-only, and intentionally so. The mock has no server to enforce a role
 * change, so offering an editable role control here would be a button that
 * lies: it would look like authorisation while only editing a value in the
 * visitor's own browser. Every account is listed from the single account
 * store, and no digest, session token or avatar payload is ever mapped into a
 * row.
 */
export function AdminUsersPage() {
  const { t, formatDate } = useI18n();
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [role, setRole] = useState<RoleFilter>('all');
  const [sort, setSort] = useState<SortKey>('newest');

  const all = useMemo(() => listUserRows(), []);
  const rows = useMemo(
    () => listUserRows({ search, role, sort }),
    [search, role, sort],
  );

  const isFiltered = search.trim().length > 0 || role !== 'all';
  const clearFilters = () => {
    setSearch('');
    setRole('all');
  };

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        eyebrow={t('admin.title')}
        title={t('admin.users.title')}
        description={t('admin.users.lead')}
        actions={
          <Badge tone="neutral">
            {all.length === 1
              ? t('admin.users.countOne')
              : t('admin.users.countMany', { count: String(all.length) })}
          </Badge>
        }
      />

      {all.length > 0 && (
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
          <div className="min-w-0 flex-1">
            <Input
              label={t('admin.users.search')}
              placeholder={t('admin.users.searchPlaceholder')}
              type="search"
              leadingIcon={<Search className="size-4" aria-hidden="true" />}
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              trailingSlot={
                search ? (
                  <button
                    type="button"
                    onClick={() => setSearch('')}
                    aria-label={t('admin.users.clearFilters')}
                    className="flex size-9 items-center justify-center rounded-full text-ink-muted transition-colors hover:bg-surface-muted hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-deep/45"
                  >
                    <X className="size-3.5" aria-hidden="true" />
                  </button>
                ) : undefined
              }
            />
          </div>

          <label className="flex flex-col gap-2 lg:w-44">
            <span className="text-[0.8125rem] font-medium text-ink">{t('admin.users.roleFilter')}</span>
            <select
              value={role}
              onChange={(event) => setRole(event.target.value as RoleFilter)}
              className="h-11 rounded-md border border-line bg-surface-sunken px-3 text-body text-ink transition-colors hover:border-line-strong focus-visible:border-sage focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage/35"
            >
              <option value="all">{t('admin.users.roleAll')}</option>
              <option value="admin">{t('admin.users.roleAdmin')}</option>
              <option value="user">{t('admin.users.roleUser')}</option>
            </select>
          </label>

          <label className="flex flex-col gap-2 lg:w-44">
            <span className="text-[0.8125rem] font-medium text-ink">{t('admin.users.sortLabel')}</span>
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value as SortKey)}
              className="h-11 rounded-md border border-line bg-surface-sunken px-3 text-body text-ink transition-colors hover:border-line-strong focus-visible:border-sage focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage/35"
            >
              <option value="newest">{t('admin.users.sortNewest')}</option>
              <option value="oldest">{t('admin.users.sortOldest')}</option>
            </select>
          </label>
        </div>
      )}

      {all.length === 0 ? (
        <EmptyState icon={Users} title={t('admin.users.emptyTitle')} description={t('admin.users.emptyBody')} />
      ) : rows.length === 0 ? (
        <EmptyState
          icon={Search}
          title={t('admin.users.noResultsTitle')}
          description={t('admin.users.noResultsBody')}
          action={
            <Button size="sm" tone="neutral" onClick={clearFilters} disabled={!isFiltered}>
              {t('admin.users.clearFilters')}
            </Button>
          }
        />
      ) : (
        <UserTable rows={rows} currentUserId={user?.id} formatDate={formatDate} />
      )}
    </div>
  );
}

function UserTable({
  rows,
  currentUserId,
  formatDate,
}: {
  rows: AdminUserRow[];
  currentUserId?: string;
  formatDate: (value: string) => string;
}) {
  const { t } = useI18n();

  return (
    <div className="overflow-hidden rounded-lg border border-line bg-surface">
      {/* Wide screens: a real table. Column headers are the only place the
          meaning of each number is stated, so they are always visible. */}
      <table className="hidden w-full table-fixed border-collapse text-left md:table">
        <caption className="sr-only">{t('admin.users.title')}</caption>
        <thead>
          <tr className="border-b border-line bg-surface-muted/50">
            <th scope="col" className="w-[38%] px-4 py-3 text-micro font-medium uppercase tracking-[0.1em] text-ink-muted">
              {t('admin.users.columnUser')}
            </th>
            <th scope="col" className="w-[14%] px-4 py-3 text-micro font-medium uppercase tracking-[0.1em] text-ink-muted">
              {t('admin.users.columnRole')}
            </th>
            <th scope="col" className="w-[18%] px-4 py-3 text-micro font-medium uppercase tracking-[0.1em] text-ink-muted">
              {t('admin.users.columnRegistered')}
            </th>
            <th scope="col" className="w-[10%] px-4 py-3 text-right text-micro font-medium uppercase tracking-[0.1em] text-ink-muted">
              {t('admin.users.columnWebsites')}
            </th>
            <th scope="col" className="w-[10%] px-4 py-3 text-right text-micro font-medium uppercase tracking-[0.1em] text-ink-muted">
              {t('admin.users.columnEvaluations')}
            </th>
            <th scope="col" className="w-[10%] px-4 py-3 text-right text-micro font-medium uppercase tracking-[0.1em] text-ink-muted">
              <span className="sr-only">{t('admin.users.columnActions')}</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {rows.map((row) => (
            <tr key={row.id} className="group transition-colors hover:bg-surface-muted/40">
              <td className="min-w-0 px-4 py-3.5">
                <div className="flex min-w-0 items-center gap-2">
                  <Link
                    to={`${routes.adminUsers}/${row.id}`}
                    className="truncate text-[0.875rem] font-medium text-ink underline decoration-transparent underline-offset-4 hover:decoration-line-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-deep/45"
                  >
                    {row.name}
                  </Link>
                  {row.id === currentUserId && <Badge tone="sage">{t('admin.users.you')}</Badge>}
                </div>
                <p className="truncate text-micro text-ink-muted">{row.email}</p>
              </td>
              <td className="px-4 py-3.5">
                <Badge tone={row.role === 'admin' ? 'taupe' : 'neutral'} dot>
                  {row.role === 'admin' ? t('admin.users.roleAdmin') : t('admin.users.roleUser')}
                </Badge>
              </td>
              <td className="px-4 py-3.5 text-micro tabular-nums text-ink-soft">
                {formatDate(row.createdAt)}
              </td>
              <td className="px-4 py-3.5 text-right text-micro tabular-nums text-ink-soft">
                {row.websiteCount}
              </td>
              <td className="px-4 py-3.5 text-right text-micro tabular-nums text-ink-soft">
                {row.evaluationCount}
              </td>
              <td className="px-4 py-3.5 text-right">
                <Link
                  to={`${routes.adminUsers}/${row.id}`}
                  className="inline-flex items-center gap-1 text-micro text-ink-muted transition-colors group-hover:text-ink"
                  aria-label={`${t('admin.users.view')} — ${row.name}`}
                >
                  <span className="hidden lg:inline">{t('admin.users.view')}</span>
                  <ChevronRight className="size-4" aria-hidden="true" />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Narrow screens: one card per account. The table's column headers are
          reproduced inline, because a stacked table without them is unreadable. */}
      <ul className="divide-y divide-line md:hidden">
        {rows.map((row) => (
          <li key={row.id}>
            <Link
              to={`${routes.adminUsers}/${row.id}`}
              className="flex flex-col gap-2 px-4 py-4 transition-colors hover:bg-surface-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-deep/45"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[0.875rem] font-medium text-ink">{row.name}</span>
                <Badge tone={row.role === 'admin' ? 'taupe' : 'neutral'} dot>
                  {row.role === 'admin' ? t('admin.users.roleAdmin') : t('admin.users.roleUser')}
                </Badge>
                {row.id === currentUserId && <Badge tone="sage">{t('admin.users.you')}</Badge>}
              </div>
              <p className="break-all text-micro text-ink-muted">{row.email}</p>
              <dl className="mt-1 grid grid-cols-3 gap-2 text-micro">
                <div>
                  <dt className="text-ink-faint">{t('admin.users.columnRegistered')}</dt>
                  <dd className="tabular-nums text-ink-soft">{formatDate(row.createdAt)}</dd>
                </div>
                <div>
                  <dt className="text-ink-faint">{t('admin.users.columnWebsites')}</dt>
                  <dd className="tabular-nums text-ink-soft">{row.websiteCount}</dd>
                </div>
                <div>
                  <dt className="text-ink-faint">{t('admin.users.columnEvaluations')}</dt>
                  <dd className="tabular-nums text-ink-soft">{row.evaluationCount}</dd>
                </div>
              </dl>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
