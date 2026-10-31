import type {
  AssessmentType,
  ResultPriority,
} from './evaluation-results.types';
import type { EvaluationCategoryId, EvaluationViewportId } from './workspace.types';

/**
 * Demo results fixtures.
 *
 * Fixed data, no randomness, no dates: the same evaluation always produces the
 * same demo set, so a screenshot of the results page stays true across reloads.
 *
 * Paths are relative (`/about`) and are mapped onto the evaluation's own first
 * page origin at read time, so a demo finding can never point at a page the
 * evaluation did not select.
 */

export interface FixtureFinding {
  /** Stable across locales: the copy table is keyed by this. */
  id: string;
  category: EvaluationCategoryId;
  priority: ResultPriority;
  assessment: AssessmentType;
  /** Relative page path — resolved against the evaluation's own pages. */
  path: string;
  viewport?: EvaluationViewportId;
}

export interface FixtureRecommendation {
  id: string;
  priority: ResultPriority;
  category: EvaluationCategoryId;
  findingIds: string[];
}

export interface FixtureSet {
  /** Category scores, in the canonical category order. Deterministic. */
  scores: Record<EvaluationCategoryId, number>;
  findings: FixtureFinding[];
  recommendations: FixtureRecommendation[];
}

/**
 * Ten findings across the six categories, weighted toward the issues a real
 * audit would rank first. Counts by priority: 2 critical, 3 high, 3 medium,
 * 2 low — the priority summary is derived from this list, never typed twice.
 */
export const demoFixture: FixtureSet = {
  scores: {
    visualConsistency: 74,
    typography: 68,
    layout: 71,
    usability: 80,
    responsiveness: 62,
    accessibility: 54,
  },

  findings: [
    {
      id: 'contrast-body',
      category: 'accessibility',
      priority: 'critical',
      assessment: 'measured',
      path: '/',
    },
    {
      id: 'focus-invisible',
      category: 'accessibility',
      priority: 'critical',
      assessment: 'manual',
      path: '/contact',
      viewport: 'desktop',
    },
    {
      id: 'overflow-mobile',
      category: 'responsiveness',
      priority: 'high',
      assessment: 'measured',
      path: '/pricing',
      viewport: 'mobile',
    },
    {
      id: 'img-no-alt',
      category: 'accessibility',
      priority: 'high',
      assessment: 'measured',
      path: '/projects',
    },
    {
      id: 'nav-no-current',
      category: 'usability',
      priority: 'high',
      assessment: 'heuristic',
      path: '/',
      viewport: 'desktop',
    },
    {
      id: 'line-length',
      category: 'typography',
      priority: 'medium',
      assessment: 'measured',
      path: '/about',
      viewport: 'desktop',
    },
    {
      id: 'type-scale-jump',
      category: 'typography',
      priority: 'medium',
      assessment: 'heuristic',
      path: '/',
    },
    {
      id: 'tap-targets',
      category: 'usability',
      priority: 'medium',
      assessment: 'measured',
      path: '/contact',
      viewport: 'mobile',
    },
    {
      id: 'spacing-inconsistent',
      category: 'layout',
      priority: 'low',
      assessment: 'heuristic',
      path: '/',
      viewport: 'desktop',
    },
    {
      id: 'button-inconsistent',
      category: 'visualConsistency',
      priority: 'low',
      assessment: 'heuristic',
      path: '/projects',
    },
  ],

  /**
   * One recommendation per finding, each pointing at findings that exist.
   * Grouping and ordering happen in the service.
   */
  recommendations: [
    { id: 'rec-contrast', priority: 'critical', category: 'accessibility', findingIds: ['contrast-body'] },
    { id: 'rec-focus', priority: 'critical', category: 'accessibility', findingIds: ['focus-invisible'] },
    { id: 'rec-overflow', priority: 'high', category: 'responsiveness', findingIds: ['overflow-mobile'] },
    { id: 'rec-alt', priority: 'high', category: 'accessibility', findingIds: ['img-no-alt'] },
    { id: 'rec-current', priority: 'high', category: 'usability', findingIds: ['nav-no-current'] },
    { id: 'rec-measure', priority: 'medium', category: 'typography', findingIds: ['line-length'] },
    { id: 'rec-scale', priority: 'medium', category: 'typography', findingIds: ['type-scale-jump'] },
    { id: 'rec-targets', priority: 'medium', category: 'usability', findingIds: ['tap-targets'] },
    { id: 'rec-rhythm', priority: 'low', category: 'layout', findingIds: ['spacing-inconsistent'] },
    { id: 'rec-buttons', priority: 'low', category: 'visualConsistency', findingIds: ['button-inconsistent'] },
  ],
};
