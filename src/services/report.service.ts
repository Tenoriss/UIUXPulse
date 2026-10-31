import { criteriaContent } from '@/content/criteria';
import { demoResultsCopy, priorityCopy, assessmentCopy, viewportCopy } from '@/content/demoResults';
import { translate } from '@/i18n/translate';
import type { Locale } from '@/i18n/config';
import { getEvaluation } from './evaluation.service';
import { getDemoResults } from './evaluation-results.service';
import { priorityOrder } from './evaluation-results.types';
import type { ReportDocument, ReportMode, ReportSection } from './report.types';
import type { EvaluationRecord } from './workspace.types';

/**
 * Report assembly.
 *
 * Two modes, one document shape:
 *
 * - `configuration` — built only from a saved record. No score block, no
 *   findings, no recommendations, because the record has none.
 * - `demo` — the demo preview, built exclusively from the existing demo results
 *   service. Requires explicit authorisation, and is refused otherwise.
 *
 * This module reads and formats; it never writes. Generating a report cannot
 * change a record, its status, or its timestamp.
 */

/** Slug for the download filename: lowercase, ascii, hyphenated. */
function slug(value: string): string {
  return (
    value
      .toLowerCase()
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 48) || 'report'
  );
}

function shortDate(iso: string, locale: Locale): string {
  try {
    return new Intl.DateTimeFormat(locale === 'id' ? 'id-ID' : 'en-GB', {
      dateStyle: 'medium',
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

/**
 * Resolve a report for an evaluation.
 *
 * @param demoAuthorised the caller must pass `true` only when the request came
 * from the demo preview. A missing flag means the demo report is unavailable —
 * the failure mode is "no report", never "a demo report that looks real".
 */
export function getReport(
  ownerId: string | undefined,
  evaluationId: string,
  locale: Locale,
  mode: ReportMode = 'configuration',
  demoAuthorised = false,
): ReportDocument | null {
  // Ownership: `getEvaluation` is scoped to the account, so a foreign id is
  // indistinguishable from a missing one.
  const record = getEvaluation(ownerId, evaluationId);
  if (!record) return null;
  if (mode === 'demo' && !demoAuthorised) return null;

  return mode === 'demo'
    ? buildDemoReport(ownerId, record, locale)
    : buildConfigurationReport(record, locale);
}

/** Shorthand used by the preview and the list. */
export function getConfigurationReport(
  ownerId: string | undefined,
  evaluationId: string,
  locale: Locale,
): ReportDocument | null {
  return getReport(ownerId, evaluationId, locale, 'configuration', false);
}

export function getDemoReport(
  ownerId: string | undefined,
  evaluationId: string,
  locale: Locale,
): ReportDocument | null {
  return getReport(ownerId, evaluationId, locale, 'demo', true);
}

function baseMeta(
  record: EvaluationRecord,
  locale: Locale,
  mode: ReportMode,
  generatedAt: string,
  titleKey: string,
  typeKey: string,
) {
  const isDemo = mode === 'demo';
  return {
    evaluationId: record.id,
    mode,
    isDemo,
    title: translate(locale, titleKey),
    subtitle: translate(locale, typeKey),
    typeLabel: translate(locale, typeKey),
    websiteName: record.website,
    websiteUrl: record.url,
    statusLabel: translate(locale, `evaluation.status.${record.status}`),
    createdAt: record.createdAt,
    generatedAt,
    locale,
    fileName: `${isDemo ? 'demo-' : ''}uiuxpulse-${slug(record.website)}-${record.id.slice(-6)}.pdf`,
  };
}

function overviewSection(record: EvaluationRecord, locale: Locale): ReportSection {
  return {
    id: 'overview',
    kind: 'facts',
    heading: translate(locale, 'report.section.overview'),
    items: [
      { label: translate(locale, 'report.field.evaluationId'), value: record.id },
      { label: translate(locale, 'report.field.website'), value: record.website },
      { label: translate(locale, 'report.field.websiteUrl'), value: record.url },
      { label: translate(locale, 'report.field.createdAt'), value: shortDate(record.createdAt, locale) },
      { label: translate(locale, 'report.field.status'), value: translate(locale, `evaluation.status.${record.status}`) },
      {
        label: translate(locale, 'report.field.pageCount'),
        value: String(record.pages.length),
      },
    ],
  };
}

function configurationSection(record: EvaluationRecord, locale: Locale): ReportSection {
  const criteria = criteriaContent[locale];
  const viewports = viewportCopy[locale];
  return {
    id: 'configuration',
    kind: 'groups',
    heading: translate(locale, 'report.section.configuration'),
    groups: [
      {
        label: translate(locale, 'report.field.pages'),
        items: record.pages.length > 0 ? record.pages : [translate(locale, 'report.empty.pages')],
      },
      {
        label: translate(locale, 'report.field.categories'),
        items:
          record.categories.length > 0
            ? record.categories.map((category) => criteria[category]?.name ?? category)
            : [translate(locale, 'report.empty.categories')],
      },
      {
        label: translate(locale, 'report.field.viewports'),
        items:
          record.viewports.length > 0
            ? record.viewports.map((viewport) => viewports[viewport] ?? viewport)
            : [translate(locale, 'report.empty.viewports')],
      },
    ],
  };
}

function buildConfigurationReport(record: EvaluationRecord, locale: Locale): ReportDocument {
  const generatedAt = new Date().toISOString();

  return {
    meta: baseMeta(
      record,
      locale,
      'configuration',
      generatedAt,
      'report.title.configuration',
      'report.type.configuration',
    ),
    sections: [
      overviewSection(record, locale),
      {
        id: 'notice',
        kind: 'callout',
        heading: translate(locale, 'report.section.notice'),
        body: translate(locale, 'report.notice.configuration'),
      },
      configurationSection(record, locale),
    ],
    disclaimer: translate(locale, 'report.disclaimer.configuration'),
  };
}

function buildDemoReport(
  ownerId: string | undefined,
  record: EvaluationRecord,
  locale: Locale,
): ReportDocument | null {
  // The demo report reads the demo results service — the same source the
  // on-screen results pages use, so the two can never disagree.
  const results = getDemoResults(ownerId, record.id);
  if (!results) return null;

  const generatedAt = new Date().toISOString();
  const copy = demoResultsCopy[locale];
  const criteria = criteriaContent[locale];
  const priorities = priorityCopy[locale];
  const assessments = assessmentCopy[locale];
  const viewports = viewportCopy[locale];

  const findings: ReportSection = {
    id: 'findings',
    kind: 'findings',
    heading: translate(locale, 'report.section.findings'),
    items: results.findings
      .slice()
      .sort(
        (a, b) => priorityOrder.indexOf(a.priority) - priorityOrder.indexOf(b.priority),
      )
      .map((finding) => {
        const text = copy.findings[finding.copyId];
        return {
          title: text?.title ?? finding.copyId,
          category: criteria[finding.category]?.name ?? finding.category,
          priority: priorities[finding.priority],
          page: finding.page,
          viewport: finding.viewport
            ? viewports[finding.viewport]
            : translate(locale, 'results.audit.finding.allViewports'),
          assessment: assessments[finding.assessment],
          description: text?.description ?? '',
          whyItMatters: text?.whyItMatters ?? '',
        };
      }),
  };

  const recommendations: ReportSection = {
    id: 'recommendations',
    kind: 'recommendations',
    heading: translate(locale, 'report.section.recommendations'),
    items: results.recommendations.map((recommendation) => {
      const text = copy.recommendations[recommendation.copyId];
      const related = results.findings.find((finding) => finding.id === recommendation.findingIds[0]);
      return {
        title: text?.title ?? recommendation.copyId,
        priority: priorities[recommendation.priority],
        category: criteria[recommendation.category]?.name ?? recommendation.category,
        relatedFinding: related
          ? copy.findings[related.copyId]?.title ?? related.id
          : translate(locale, 'results.recommendations.relatedFindingMissing'),
        explanation: text?.explanation ?? '',
        improvement: text?.improvement ?? '',
        benefit: text?.benefit ?? '',
      };
    }),
  };

  const categories: ReportSection = {
    id: 'categories',
    kind: 'table',
    heading: translate(locale, 'report.section.categories'),
    columns: [
      translate(locale, 'report.table.category'),
      translate(locale, 'report.table.score'),
      translate(locale, 'report.table.findings'),
    ],
    rows: results.categoryResults.map((result) => [
      criteria[result.category]?.name ?? result.category,
      String(result.score),
      String(result.findingCount),
    ]),
  };

  const overview = overviewSection(record, locale);
  if (overview.kind === 'facts') {
    overview.items.push({
      label: translate(locale, 'report.field.reportType'),
      value: translate(locale, 'report.type.demo'),
    });
  }

  return {
    meta: baseMeta(record, locale, 'demo', generatedAt, 'report.title.demo', 'report.type.demo'),
    sections: [
      overview,
      configurationSection(record, locale),
      {
        id: 'results',
        kind: 'score',
        heading: translate(locale, 'report.section.results'),
        score: results.overallScore,
        explanation: translate(locale, 'results.score.explain'),
        priorities: priorityOrder.map((priority) => ({
          label: priorities[priority],
          count: results.priorityCounts[priority],
        })),
      },
      categories,
      findings,
      recommendations,
    ],
    disclaimer: translate(locale, 'report.disclaimer.demo'),
  };
}
