import { criteriaContent, criterionOrder, type CriterionKey } from '@/content/criteria';
import { readAccounts } from './auth.storage';
import type { AccountSummary, AccountRole } from './auth.types';
import { listEvaluations } from './evaluation.service';
import { listWebsites } from './website.service';
import type { EvaluationRecord, EvaluationStatus } from './workspace.types';
import { readCriterionNotes } from './admin.criteria';
import type {
  AdminCriterionRow,
  AdminEvaluationDetail,
  AdminEvaluationQuery,
  AdminEvaluationRow,
  AdminOverview,
  AdminSummary,
  AdminUserQuery,
  AdminUserRow,
} from './admin.types';

/**
 * Administrative aggregation.
 *
 * Read-only by design. Every function here composes the services that already
 * own the data — `auth.storage` for accounts, `website.service` for sites,
 * `evaluation.service` for records — and none of them writes. There is no
 * admin store, no copy of the records, and no cached aggregate that could drift
 * from the source.
 *
 * The one exception is the criteria note store (`admin.criteria.ts`), which is
 * deliberately separate from `content/criteria.ts` for the same reason: an
 * editable annotation must never become the definition.
 *
 * Authorisation lives in `useAuth().isAdmin`; these functions assume the caller
 * has already been admitted. They cannot grant access, and a direct call from
 * the user workspace would only ever return the caller's own view of read-only
 * data.
 */

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

/** Accounts as the admin surface may see them — no digest, ever. */
export function listAccounts(): AccountSummary[] {
  return readAccounts()
    .map<AccountSummary>((account) => ({
      id: account.id,
      name: account.name,
      email: account.email,
      role: account.role === 'admin' ? 'admin' : 'user',
      createdAt: account.createdAt,
      hasAvatar: Boolean(account.avatarUrl),
    }))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

/** One account summary, by id. */
export function getAccount(id: string): AccountSummary | null {
  return listAccounts().find((account) => account.id === id) ?? null;
}

function withCounts(account: AccountSummary): AdminUserRow {
  return {
    ...account,
    websiteCount: listWebsites(account.id).length,
    evaluationCount: listEvaluations(account.id).length,
  };
}

/**
 * Every account with its own totals.
 *
 * Sorted newest first from `listAccounts()`; the sort here only re-applies the
 * requested direction so both listings behave the same way.
 */
export function listUserRows(query: AdminUserQuery = {}): AdminUserRow[] {
  const { search = '', role = 'all', sort = 'newest' } = query;
  const needle = search.trim().toLowerCase();

  const rows = listAccounts()
    .filter((account) => role === 'all' || account.role === role)
    .filter((account) => {
      if (!needle) return true;
      return (
        account.name.toLowerCase().includes(needle) ||
        account.email.toLowerCase().includes(needle)
      );
    })
    .map(withCounts);

  return sort === 'oldest' ? [...rows].reverse() : rows;
}

/** Every evaluation across every account, with the owner resolved. */
export function listEvaluationRows(query: AdminEvaluationQuery = {}): AdminEvaluationRow[] {
  const { search = '', status = 'all', sort = 'newest' } = query;
  const needle = search.trim().toLowerCase();
  const accounts = new Map(listAccounts().map((account) => [account.id, account]));

  const rows: AdminEvaluationRow[] = [];

  for (const [ownerId, account] of accounts) {
    for (const record of listEvaluations(ownerId)) {
      if (status !== 'all' && record.status !== status) continue;
      const row = toRow(record, account);
      if (needle) {
        const haystack = `${row.id} ${row.website} ${row.url} ${row.ownerEmail} ${row.ownerName}`.toLowerCase();
        if (!haystack.includes(needle)) continue;
      }
      rows.push(row);
    }
  }

  rows.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return sort === 'oldest' ? rows.reverse() : rows;
}

function toRow(record: EvaluationRecord, account: AccountSummary | undefined): AdminEvaluationRow {
  return {
    id: record.id,
    ownerId: record.ownerId,
    ownerName: account?.name ?? '—',
    ownerEmail: account?.email ?? record.ownerId,
    website: record.website,
    url: record.url,
    createdAt: record.createdAt,
    status: record.status,
    pageCount: record.pages.length,
    categoryCount: record.categories.length,
    viewportCount: record.viewports.length,
  };
}

/**
 * One evaluation's configuration, for the read-only detail panel.
 *
 * Resolved through `listEvaluations(ownerId)` rather than a global lookup, so
 * the same ownership rule the user workspace uses still applies even here: an
 * id that belongs to no account returns `null` instead of a partial record.
 */
export function getEvaluationDetail(id: string): AdminEvaluationDetail | null {
  for (const account of listAccounts()) {
    const record = listEvaluations(account.id).find((entry) => entry.id === id);
    if (!record) continue;
    return {
      ...toRow(record, account),
      pages: record.pages,
      categories: record.categories,
      viewports: record.viewports,
      // No engine exists, so a record can never carry real results. Stated as
      // a value rather than inferred at each call site.
      hasRealResults: false,
    };
  }
  return null;
}

/** Totals for the overview, all derived at read time. */
export function summariseAdmin(): AdminSummary {
  const accounts = listAccounts();
  const now = Date.now();

  let websites = 0;
  let evaluations = 0;
  let awaitingAnalysis = 0;
  let configuredPages = 0;

  for (const account of accounts) {
    websites += listWebsites(account.id).length;
    for (const record of listEvaluations(account.id)) {
      evaluations += 1;
      if (record.status === 'created') awaitingAnalysis += 1;
      configuredPages += record.pages.length;
    }
  }

  return {
    users: accounts.length,
    admins: accounts.filter((account) => account.role === 'admin').length,
    websites,
    evaluations,
    newThisWeek: accounts.filter((account) => {
      const created = Date.parse(account.createdAt);
      return Number.isFinite(created) && now - created <= WEEK_MS;
    }).length,
    awaitingAnalysis,
    configuredPages,
  };
}

/** Everything the overview renders, assembled once. */
export function getAdminOverview(): AdminOverview {
  return {
    summary: summariseAdmin(),
    recentUsers: listUserRows().slice(0, 5),
    recentEvaluations: listEvaluationRows().slice(0, 5),
    // No event log exists in the mock, so no series can honestly be drawn.
    activityAvailable: false,
    // Nothing records that a demo preview was opened, so this stays `false`
    // and the overview prints a sentence instead of a made-up count.
    demoPreviewsTracked: false,
  };
}

/**
 * The six categories, straight from `content/criteria.ts` plus any annotation
 * saved in `admin.criteria.ts`.
 *
 * Each session is a fresh read, so an edit made in another tab is not hidden
 * behind a stale import-time copy.
 */
export function listCriteria(): AdminCriterionRow[] {
  return criterionOrder.map((key) => buildCriterion(key));
}



function buildCriterion(key: CriterionKey): AdminCriterionRow {
  const en = criteriaContent.en[key];
  const id = criteriaContent.id[key];
  // A saved annotation, if one exists, is shown *in addition* to the
  // definition — it never replaces the source text. `isOverride` tells the
  // row which of the two it is displaying.
  const note = readCriterionNotes()[key];

  return {
    id: key,
    name: { en: en.name, id: id.name },
    summary: { en: en.summary, id: id.summary },
    description: { en: note?.en ?? en.what, id: note?.id ?? id.what },
    // Every category the wizard offers is selectable today; the flag is read
    // from the same order list the wizard uses, never hard-coded per row.
    available: criterionOrder.includes(key),
    annotated: Boolean(note),
  };
}

/** Statuses that exist in the data, for the filter control. */
export const ADMIN_STATUSES: EvaluationStatus[] = ['created', 'inReview', 'completed', 'failed'];

/** Roles, for the filter control. */
export const ADMIN_ROLES: AccountRole[] = ['admin', 'user'];
