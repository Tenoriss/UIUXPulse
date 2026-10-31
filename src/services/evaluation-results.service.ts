import { criterionOrder } from '@/content/criteria';
import { demoFixture, type FixtureFinding } from './evaluation-results.fixtures';
import {
  priorityOrder,
  type CategoryResult,
  type EvaluationResults,
  type Finding,
  type PageCoverage,
  type Recommendation,
  type ResultPriority,
} from './evaluation-results.types';
import { getEvaluation } from './evaluation.service';
import type { EvaluationRecord } from './workspace.types';

/**
 * Results for an evaluation.
 *
 * There is no analysis engine, so this module does exactly two things:
 *
 * 1. It decides whether real results exist for a record — today, never. The
 *    check is explicit (`hasRealResults`) rather than implied by the fixture,
 *    so the day an engine lands, only that function changes.
 * 2. It assembles the **demo preview** from `evaluation-results.fixtures.ts`,
 *    deterministically, keyed to the evaluation's own configuration.
 *
 * It is deliberately read-only: nothing in this file writes to storage, so
 * opening a demo preview cannot alter a record, its status, or its timestamp.
 * The fixture ids are namespaced (`demo-…`) so a preview can never be mistaken
 * for, or collide with, a future real result row.
 */

/** Prefix on every id produced here. Also how the UI recognises a preview. */
export const DEMO_ID_PREFIX = 'demo-';

/**
 * Does this record have real analysis results?
 *
 * Always false in this build. The signature takes the record so a future engine
 * can answer from the stored data without callers changing.
 */
export function hasRealResults(_record: EvaluationRecord | null): boolean {
  return false;
}

/** Build the record's result set, or `null` when it is not the owner's record. */
export function getEvaluationResults(
  ownerId: string | undefined,
  evaluationId: string,
): EvaluationResults | null {
  // Ownership is enforced by the same read the detail page uses: a foreign id
  // resolves to null and the page shows "not found".
  const record = getEvaluation(ownerId, evaluationId);
  if (!record) return null;

  if (!hasRealResults(record)) {
    // No engine: expose the clearly-labelled preview instead of inventing a
    // result set for the record itself.
    return buildDemoResults(record);
  }

  // Unreachable today. A future engine returns its own set here.
  return buildDemoResults(record);
}

/** The evaluation a demo preview belongs to, or `null` if this account does not own it. */
export function getDemoResults(
  ownerId: string | undefined,
  evaluationId: string,
): EvaluationResults | null {
  const record = getEvaluation(ownerId, evaluationId);
  return record ? buildDemoResults(record) : null;
}

/**
 * Map a fixture's relative path onto the evaluation's own pages.
 *
 * If the evaluation did not select that path, the first selected page is used
 * instead — a finding must never reference a page outside the configuration it
 * claims to describe.
 */
function resolvePage(fixture: FixtureFinding, pages: string[]): string {
  if (pages.length === 0) return '';
  const origin = (() => {
    try {
      return new URL(pages[0]).origin;
    } catch {
      return '';
    }
  })();

  if (origin) {
    const candidate = `${origin}${fixture.path}`;
    if (pages.includes(candidate)) return candidate;
    // Compare without trailing slashes: the root page is stored both as
    // `https://site.com` and `https://site.com/` depending on what was typed.
    const normalise = (value: string) => value.replace(/\/+$/, '');
    const loose = pages.find((page) => normalise(page) === normalise(candidate));
    if (loose) return loose;
  }
  return pages[0];
}

function buildDemoResults(record: EvaluationRecord): EvaluationResults {
  const pages = record.pages.length > 0 ? record.pages : [record.url];

  const findings: Finding[] = demoFixture.findings.map((fixture) => ({
    id: `${DEMO_ID_PREFIX}${fixture.id}`,
    category: fixture.category,
    priority: fixture.priority,
    assessment: fixture.assessment,
    page: resolvePage(fixture, pages),
    viewport: fixture.viewport,
    // No capture exists anywhere in this build; the viewer renders its
    // placeholder for this variant.
    evidence: { kind: 'none' },
    copyId: fixture.id,
  }));

  const recommendations: Recommendation[] = demoFixture.recommendations.map((fixture) => ({
    id: `${DEMO_ID_PREFIX}${fixture.id}`,
    priority: fixture.priority,
    category: fixture.category,
    findingIds: fixture.findingIds.map((id) => `${DEMO_ID_PREFIX}${id}`),
    copyId: fixture.id,
  }));

  const priorityCounts = priorityOrder.reduce<Record<ResultPriority, number>>(
    (counts, priority) => {
      counts[priority] = findings.filter((finding) => finding.priority === priority).length;
      return counts;
    },
    { critical: 0, high: 0, medium: 0, low: 0 },
  );

  const categoryResults: CategoryResult[] = criterionOrder.map((category) => ({
    category,
    score: demoFixture.scores[category],
    findingCount: findings.filter((finding) => finding.category === category).length,
  }));

  return {
    evaluationId: record.id,
    isDemo: true,
    overallScore: overallFromCategories(categoryResults),
    categoryResults,
    findings,
    recommendations,
    priorityCounts,
    summary: {
      strengths: ['strength-1', 'strength-2', 'strength-3'],
      improvements: ['improvement-1', 'improvement-2', 'improvement-3'],
      nextActions: ['next-1', 'next-2', 'next-3'],
    },
  };
}

/**
 * The overall score is the equally-weighted mean of the category scores,
 * rounded — derived, never typed, so the number at the top can always be
 * explained by the six below it.
 */
export function overallFromCategories(categories: CategoryResult[]): number {
  if (categories.length === 0) return 0;
  const total = categories.reduce((sum, item) => sum + item.score, 0);
  return Math.round(total / categories.length);
}

/** Findings for one category, highest priority first. */
export function findingsByCategory(
  results: EvaluationResults,
  category: CategoryResult['category'],
): Finding[] {
  return sortByPriority(results.findings.filter((finding) => finding.category === category));
}

/** Stable priority sort: critical → low, ties keep fixture order. */
export function sortByPriority(findings: Finding[]): Finding[] {
  return [...findings].sort(
    (a, b) => priorityOrder.indexOf(a.priority) - priorityOrder.indexOf(b.priority),
  );
}

export interface FindingQuery {
  search?: string;
  category?: CategoryResult['category'] | 'all';
  priority?: ResultPriority | 'all';
}

/**
 * Search + filter for the audit list.
 *
 * Text matching is done by the caller, which has the copy for the active
 * locale — this only applies the structural filters and the sort.
 */
export function queryFindings(
  results: EvaluationResults,
  query: FindingQuery,
  matchText?: (finding: Finding) => string,
): Finding[] {
  const { search = '', category = 'all', priority = 'all' } = query;
  const needle = search.trim().toLowerCase();

  const filtered = results.findings.filter((finding) => {
    if (category !== 'all' && finding.category !== category) return false;
    if (priority !== 'all' && finding.priority !== priority) return false;
    if (!needle) return true;
    const haystack = `${matchText?.(finding) ?? ''} ${finding.page}`.toLowerCase();
    return haystack.includes(needle);
  });

  return sortByPriority(filtered);
}

/** Recommendations grouped by priority, in priority order. */
export function groupRecommendations(
  results: EvaluationResults,
): Array<{ priority: ResultPriority; items: Recommendation[] }> {
  return priorityOrder
    .map((priority) => ({
      priority,
      items: results.recommendations.filter((item) => item.priority === priority),
    }))
    .filter((group) => group.items.length > 0);
}

/** One finding by id, or `null`. */
export function findFinding(results: EvaluationResults, id: string): Finding | null {
  return results.findings.find((finding) => finding.id === id) ?? null;
}

/**
 * Per-page coverage, built from the evaluation's own configuration so the list
 * always matches what was saved — not from whatever the fixture mentions.
 */
export function pageCoverage(record: EvaluationRecord, results: EvaluationResults): PageCoverage[] {
  const pages = record.pages.length > 0 ? record.pages : [record.url];
  return pages.map((page) => ({
    page,
    viewports: record.viewports,
    findingCount: results.findings.filter((finding) => finding.page === page).length,
    hasEvidence: false,
  }));
}
