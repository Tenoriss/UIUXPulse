import { useMemo } from 'react';
import { useAuth } from '@/services/auth.context';
import { listEvaluations, summarise } from '@/services/workspace.service';
import type { EvaluationRecord, WorkspaceSummary } from '@/services/workspace.types';

export interface WorkspaceState {
  evaluations: EvaluationRecord[];
  summary: WorkspaceSummary;
  /** True while there is genuinely nothing to show. */
  isEmpty: boolean;
}

/**
 * Reads the signed-in account's evaluations and derives the dashboard totals.
 *
 * Kept as a hook so the overview, the evaluations list, and any future report
 * screen all agree on what "total evaluations" means.
 */
export function useWorkspace(): WorkspaceState {
  const { user } = useAuth();

  return useMemo(() => {
    const evaluations = listEvaluations(user?.id);
    return {
      evaluations,
      summary: summarise(evaluations),
      isEmpty: evaluations.length === 0,
    };
  }, [user?.id]);
}
