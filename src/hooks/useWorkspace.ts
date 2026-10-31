import { useMemo } from 'react';
import { useAuth } from '@/services/auth.context';
import { listEvaluations } from '@/services/evaluation.service';
import { summarise } from '@/services/workspace.service';
import { listWebsites } from '@/services/website.service';
import type {
  EvaluationRecord,
  WebsiteRecord,
  WorkspaceSummary,
} from '@/services/workspace.types';

export interface WorkspaceState {
  evaluations: EvaluationRecord[];
  websites: WebsiteRecord[];
  summary: WorkspaceSummary;
  /** True while there is genuinely nothing to show. */
  isEmpty: boolean;
}

/**
 * Reads the signed-in account's websites and evaluations, then derives the
 * dashboard totals.
 *
 * Kept as a hook so the overview, the website list, and the evaluations list
 * all agree on what each total means. Nothing here is hard-coded: with an empty
 * store every number is zero.
 */
export function useWorkspace(): WorkspaceState {
  const { user } = useAuth();

  return useMemo(() => {
    const evaluations = listEvaluations(user?.id);
    const websites = listWebsites(user?.id);

    return {
      evaluations,
      websites,
      summary: summarise(evaluations, websites.length),
      isEmpty: evaluations.length === 0 && websites.length === 0,
    };
  }, [user?.id]);
}
