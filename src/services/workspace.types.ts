/**
 * Evaluation lifecycle. Only states the product actually defines.
 *
 * There is no analysis engine, so no record can ever reach `completed`: that
 * value exists only so historical data and the status map stay total. A saved
 * configuration is `created` — configuration saved, awaiting analysis.
 */
export type EvaluationStatus = 'created' | 'inReview' | 'completed' | 'failed';

/** The six categories an evaluation can be configured to look at. */
export type EvaluationCategoryId =
  | 'visualConsistency'
  | 'typography'
  | 'layout'
  | 'usability'
  | 'responsiveness'
  | 'accessibility';

/** Intended viewports. Configuration only — nothing is rendered or captured. */
export type EvaluationViewportId = 'desktop' | 'tablet' | 'mobile';

export interface EvaluationRecord {
  id: string;
  /** Account that owns this evaluation. Every read filters on it. */
  ownerId: string;
  /**
   * Owning website, when the evaluation was started from a registered site.
   * Optional because an evaluation can outlive the website it came from — see
   * `detachEvaluations` in the website service.
   */
  websiteId?: string;
  /** Website label, snapshotted at submission time. */
  website: string;
  /** Website URL, snapshotted at submission time. */
  url: string;
  /**
   * Selected pages, as normalised absolute URLs. Frozen at submission: editing
   * the website afterwards must not rewrite what was configured.
   */
  pages: string[];
  categories: EvaluationCategoryId[];
  viewports: EvaluationViewportId[];
  /** ISO timestamp of submission. */
  createdAt: string;
  status: EvaluationStatus;
  /**
   * Overall score 0–100. Present *only* once an evaluation was really scored,
   * which today it never is — the field exists so a future scored record does
   * not need a schema change.
   */
  overallScore?: number;
}

/**
 * Website records as the user manages them. Evaluation counts and scores are
 * never stored here: they are looked up from evaluation records, so a counter
 * can never drift from the thing it counts.
 */
export type WebsiteStatus = 'ready' | 'archived';

export interface WebsiteRecord {
  id: string;
  /** Account that owns this website. Every read filters on it. */
  ownerId: string;
  name: string;
  /** Normalised absolute URL, used for duplicate detection. */
  url: string;
  /** Host without `www.`, used as the default name and favicon target. */
  domain: string;
  description: string;
  status: WebsiteStatus;
  createdAt: string;
  updatedAt: string;
}

export interface WebsiteInput {
  name: string;
  url: string;
  description: string;
}

/** A website plus the numbers derived from real evaluation records. */
export interface WebsiteWithStats extends WebsiteRecord {
  evaluationCount: number;
  completedCount: number;
}

/** Numbers shown on the dashboard, derived — never hand-written. */
export interface WorkspaceSummary {
  /** Registered websites, not distinct hosts seen in evaluations. */
  websites: number;
  evaluations: number;
  completed: number;
  reports: number;
  pending: number;
}
