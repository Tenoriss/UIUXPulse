import type { EvaluationRecord, WorkspaceSummary } from './workspace.types';

/**
 * Workspace totals.
 *
 * The only thing left in this module: aggregating evaluation records into the
 * dashboard numbers. Every read and write of a record lives in
 * `evaluation.service.ts` — there is one evaluation service, not two.
 */
export function summarise(records: EvaluationRecord[], websiteCount = 0): WorkspaceSummary {
  const completed = records.filter((record) => record.status === 'completed').length;

  return {
    websites: websiteCount,
    evaluations: records.length,
    completed,
    /**
     * A configuration report can be produced for every saved evaluation, so
     * "available reports" counts records — not completed analyses, which do not
     * exist yet. Demo previews are never counted: they describe no record.
     */
    reports: records.length,
    pending: records.length - completed,
  };
}
