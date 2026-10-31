import type { Locale } from '@/i18n/config';

/**
 * Report model.
 *
 * A report is a *rendering* of data that already exists: either a saved
 * evaluation configuration, or the demo results fixture. Nothing here is
 * stored, and nothing here writes — a report is derived every time it is asked
 * for, so it can never drift from the record it describes.
 *
 * The same document feeds the on-screen preview and the PDF generator. That is
 * deliberate: the preview promises to look like the exported file, and sharing
 * one resolved document is the only way to keep that promise as the two drift.
 */

export type ReportMode = 'configuration' | 'demo';

/** A label/value pair on the overview page. */
export interface ReportFact {
  label: string;
  value: string;
}

/** One titled list, e.g. "Selected pages". */
export interface ReportGroup {
  label: string;
  items: string[];
}

export interface ReportPriorityCount {
  label: string;
  count: number;
}

export interface ReportFinding {
  title: string;
  category: string;
  priority: string;
  page: string;
  viewport: string;
  assessment: string;
  description: string;
  whyItMatters: string;
}

export interface ReportRecommendation {
  title: string;
  priority: string;
  category: string;
  relatedFinding: string;
  explanation: string;
  improvement: string;
  benefit: string;
}

/**
 * Section union.
 *
 * Each variant is a data shape, not markup: the preview maps it to HTML and the
 * generator maps it to PDF primitives. Adding a section means adding one
 * variant, one renderer, one draw call — and both outputs stay in step.
 */
export type ReportSection =
  | { id: 'overview'; kind: 'facts'; heading: string; items: ReportFact[] }
  | { id: 'configuration'; kind: 'groups'; heading: string; groups: ReportGroup[] }
  | {
      id: 'results';
      kind: 'score';
      heading: string;
      score: number;
      explanation: string;
      priorities: ReportPriorityCount[];
    }
  | { id: 'categories'; kind: 'table'; heading: string; columns: string[]; rows: string[][] }
  | { id: 'findings'; kind: 'findings'; heading: string; items: ReportFinding[] }
  | { id: 'recommendations'; kind: 'recommendations'; heading: string; items: ReportRecommendation[] }
  | { id: 'notice'; kind: 'callout'; heading: string; body: string };

export interface ReportMeta {
  /** Evaluation this report describes — also its ownership key. */
  evaluationId: string;
  mode: ReportMode;
  /** True only for the demo report. Drives every DEMO label. */
  isDemo: boolean;
  title: string;
  subtitle: string;
  /** "Configuration Report" / "Demo results report". */
  typeLabel: string;
  websiteName: string;
  websiteUrl: string;
  statusLabel: string;
  /** When the evaluation was created. */
  createdAt: string;
  /** When this report was generated — display only, never stored. */
  generatedAt: string;
  locale: Locale;
  /** Suggested download name, already slugged. */
  fileName: string;
}

export interface ReportDocument {
  meta: ReportMeta;
  sections: ReportSection[];
  disclaimer: string;
}

/** Why a report could not be produced. */
export type ReportErrorCode = 'notFound' | 'forbidden' | 'demoNotAuthorised' | 'unknown';
