import type {
  EvaluationCategoryId,
  EvaluationRecord,
  EvaluationStatus,
  EvaluationViewportId,
} from './workspace.types';

/**
 * Evaluation service contract.
 *
 * Same shape as the auth and website services: async, discriminated results,
 * no thrown strings. The UI's loading and error states therefore keep working
 * unchanged if this is ever replaced by a real API.
 */
export type EvaluationErrorCode =
  | 'notFound'
  | 'forbidden'
  | 'noWebsite'
  | 'websiteNotFound'
  | 'noPages'
  | 'tooManyPages'
  | 'invalidPage'
  | 'foreignPage'
  | 'duplicatePage'
  | 'noCategories'
  | 'noViewports'
  | 'unknown';

export type EvaluationOutcome<T> =
  | { ok: true; data: T }
  | { ok: false; code: EvaluationErrorCode };

export type EvaluationResult = EvaluationOutcome<EvaluationRecord>;
export type EvaluationListResult = EvaluationOutcome<EvaluationRecord[]>;

/**
 * A complete configuration, as assembled by the wizard.
 *
 * This is what gets frozen into a record: pages, categories, and viewports are
 * copied in, never referenced, so later edits to a website cannot rewrite what
 * an evaluation was configured to check.
 */
export interface EvaluationConfig {
  websiteId: string;
  /** Normalised page URLs, already validated against the website's domain. */
  pages: string[];
  categories: EvaluationCategoryId[];
  viewports: EvaluationViewportId[];
}

export interface EvaluationQuery {
  /** Matches website name or URL. */
  search?: string;
  /** `linked` = still points at a registered website; `detached` = site removed. */
  link?: 'all' | 'linked' | 'detached';
  status?: EvaluationStatus | 'all';
  sort?: 'newest' | 'oldest';
}

/** Why a page URL cannot join the selection. `null` means it is fine. */
export type PageCheck = EvaluationErrorCode | null;

export type { EvaluationRecord, EvaluationStatus };
