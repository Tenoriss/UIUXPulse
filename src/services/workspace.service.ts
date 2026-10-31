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
    reports: completed,
    pending: records.length - completed,
  };
}
