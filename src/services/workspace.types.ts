/** Evaluation lifecycle. Only states the product actually defines. */
export type EvaluationStatus = 'queued' | 'inReview' | 'completed' | 'failed';

export interface EvaluationRecord {
  id: string;
  /** Website label or host, whichever the submission captured. */
  website: string;
  url: string;
  /** ISO timestamp of submission. */
  createdAt: string;
  status: EvaluationStatus;
  /** Overall score 0–100. Present *only* once an evaluation actually scored. */
  overallScore?: number;
}

/** Numbers shown on the dashboard, derived — never hand-written. */
export interface WorkspaceSummary {
  websites: number;
  evaluations: number;
  completed: number;
  reports: number;
  pending: number;
}
