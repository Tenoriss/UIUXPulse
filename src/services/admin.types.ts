import type { AccountSummary } from './auth.types';
import type {
  EvaluationCategoryId,
  EvaluationStatus,
  EvaluationViewportId,
} from './workspace.types';

/**
 * Administrative view models.
 *
 * These are read-only projections assembled from the services that already own
 * the data. Nothing here duplicates storage: an admin row is a *view* over a
 * real account, website, or evaluation record.
 */

/** Filters shared by the admin listings. */
export interface AdminQuery {
  search?: string;
  sort?: 'newest' | 'oldest';
}

export interface AdminUserQuery extends AdminQuery {
  role?: 'all' | 'user' | 'admin';
}

export interface AdminEvaluationQuery extends AdminQuery {
  status?: EvaluationStatus | 'all';
}

/**
 * One account, plus the numbers derived from its own records.
 *
 * `websites` and `evaluations` are counts, not copies: the detail panel reads
 * the records through the owning services so it cannot show a stale list.
 */
export interface AdminUserRow extends AccountSummary {
  websiteCount: number;
  evaluationCount: number;
}

/** An evaluation record seen from the administration side. */
export interface AdminEvaluationRow {
  id: string;
  ownerId: string;
  /** Resolved from the account list; falls back to the stored owner id. */
  ownerName: string;
  ownerEmail: string;
  website: string;
  url: string;
  createdAt: string;
  status: EvaluationStatus;
  pageCount: number;
  categoryCount: number;
  viewportCount: number;
}

/** Read-only configuration detail for one evaluation. */
export interface AdminEvaluationDetail extends AdminEvaluationRow {
  pages: string[];
  categories: EvaluationCategoryId[];
  viewports: EvaluationViewportId[];
  /**
   * Always `false` today. There is no analysis engine, so an admin view must
   * never present a score — this flag exists so that stays explicit.
   */
  hasRealResults: boolean;
}

/**
 * Totals for the overview.
 *
 * Every field is derived from a real store at read time. There is no
 * historical series because nothing in the mock keeps one — see
 * `AdminOverview.activityAvailable`.
 */
export interface AdminSummary {
  users: number;
  admins: number;
  websites: number;
  evaluations: number;
  /** Accounts registered in the last seven days — derivable, so it is shown. */
  newThisWeek: number;
  /** Evaluations still in `created`. */
  awaitingAnalysis: number;
  /** Pages configured across every evaluation. */
  configuredPages: number;
}

export interface AdminOverview {
  summary: AdminSummary;
  recentUsers: AdminUserRow[];
  recentEvaluations: AdminEvaluationRow[];
  /**
   * `false` because the mock stores no event log. The overview therefore shows
   * a single honest sentence instead of a fabricated trend chart.
   */
  activityAvailable: boolean;
  /**
   * Demo previews cannot be counted: no store records that a preview was
   * opened, and inventing a number would be fabricated analytics.
   */
  demoPreviewsTracked: boolean;
}

/** A criterion category as the admin screen renders it. */
export interface AdminCriterionRow {
  id: EvaluationCategoryId;
  /** Name in each locale, straight from `content/criteria.ts`. */
  name: { en: string; id: string };
  summary: { en: string; id: string };
  /** Full description used for the detail panel. */
  description: { en: string; id: string };
  /** Whether the category can be selected in a new evaluation today. */
  available: boolean;
  /**
   * True when either description comes from the admin note store rather than
   * `content/criteria.ts`. The UI labels those rows so an annotation is never
   * mistaken for the published definition.
   */
  annotated: boolean;
}

export type AdminCriterionErrorCode =
  | 'notFound'
  | 'descriptionRequired'
  | 'descriptionTooShort'
  | 'descriptionTooLong';

/** A saved annotation. The page re-reads the row from `listCriteria()`. */
export type AdminCriterionNote = { en: string; id: string; updatedAt: string };

export type AdminCriterionNoteOutcome =
  | { ok: true; data: AdminCriterionNote }
  | { ok: false; code: AdminCriterionErrorCode };
