import type {
  EvaluationCategoryId,
  EvaluationViewportId,
} from '@/services/workspace.types';

/**
 * Results presentation types.
 *
 * These describe what a *finished* evaluation would produce. Nothing in the app
 * can currently produce one — there is no analysis engine — so the only
 * implementation is the clearly-labelled demo fixture set. Keeping the shape
 * separate from `evaluation.service` means the real engine can adopt it later
 * without the configuration model changing.
 */

export type ResultPriority = 'critical' | 'high' | 'medium' | 'low';

/** Highest first. Every sort and grouping in the UI uses this order. */
export const priorityOrder: readonly ResultPriority[] = ['critical', 'high', 'medium', 'low'];

/**
 * How a finding would have been obtained.
 *
 * - `measured`  — a deterministic check (contrast ratio, element size, overflow)
 * - `heuristic` — a rule of thumb applied to the markup
 * - `manual`    — needs a human, and is never claimed automatically
 */
export type AssessmentType = 'measured' | 'heuristic' | 'manual';

/**
 * Evidence for a finding.
 *
 * `kind: 'none'` is the only variant any current fixture produces: there is no
 * screenshot engine, so the viewer shows an honest placeholder instead of an
 * image. The `screenshot` variant exists so a future engine can plug a real
 * capture in without changing the component.
 */
export type FindingEvidence =
  | { kind: 'none' }
  | { kind: 'screenshot'; src: string; alt: string; width: number; height: number };

export interface CategoryResult {
  category: EvaluationCategoryId;
  /** 0–100. Demo values only — see `isDemo` on the set. */
  score: number;
  /** Number of findings in this category within this result set. */
  findingCount: number;
}

export interface Finding {
  id: string;
  category: EvaluationCategoryId;
  priority: ResultPriority;
  assessment: AssessmentType;
  /** Page the finding applies to; always one of the evaluation's own pages. */
  page: string;
  /** Present when the finding is viewport-specific. */
  viewport?: EvaluationViewportId;
  evidence: FindingEvidence;
  /** Bilingual copy lives in `content/demoResults.ts`, keyed by `copyId`. */
  copyId: string;
}

export interface Recommendation {
  id: string;
  priority: ResultPriority;
  category: EvaluationCategoryId;
  /** Findings this recommendation answers. Always non-empty, always resolvable. */
  findingIds: string[];
  copyId: string;
}

export interface ActionableCopy {
  strengths: string[];
  improvements: string[];
  nextActions: string[];
}

export interface EvaluationResults {
  /** The evaluation this set was assembled for. Never a separate record. */
  evaluationId: string;
  /**
   * Always true today. A future engine returns the same shape with
   * `isDemo: false`, and every demo label disappears with it.
   */
  isDemo: boolean;
  overallScore: number;
  categoryResults: CategoryResult[];
  findings: Finding[];
  recommendations: Recommendation[];
  /** Counts by priority, derived from `findings` — never stored separately. */
  priorityCounts: Record<ResultPriority, number>;
  /** Ids are copy keys resolved per locale, so nothing is stored translated. */
  summary: ActionableCopy;
}

/** Results for one page/viewport pair, used by the page-detail section. */
export interface PageCoverage {
  page: string;
  viewports: EvaluationViewportId[];
  /** Findings that mention this page. */
  findingCount: number;
  /** False until an engine supplies captures. */
  hasEvidence: boolean;
}
