/** Evaluation lifecycle. Only states the product actually defines. */
export type EvaluationStatus = 'queued' | 'inReview' | 'completed' | 'failed';

export interface EvaluationRecord {
  id: string;
  /**
   * Owning website, when the evaluation was started from a registered site.
   * Optional because an evaluation can outlive the website it came from — see
   * `detachEvaluations` in the website service.
   */
  websiteId?: string;
  /** Website label or host, whichever the submission captured. */
  website: string;
  url: string;
  /** ISO timestamp of submission. */
  createdAt: string;
  status: EvaluationStatus;
  /** Overall score 0–100. Present *only* once an evaluation actually scored. */
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
