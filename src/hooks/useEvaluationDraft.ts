import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  categoryIds,
  MAX_PAGES,
  normaliseCategories,
  normaliseViewports,
  viewportIds,
} from '@/services/evaluation.constants';
import type { EvaluationCategoryId, EvaluationViewportId } from '@/services/workspace.types';

/**
 * Wizard draft state.
 *
 * The record itself is only written at the final step — this is in-progress
 * configuration, not an evaluation. That distinction is why it lives in the URL
 * (`?draft=`) instead of in storage: a half-finished wizard must never appear
 * in the evaluation list or the dashboard totals, and a reload on step 3 should
 * not silently create an orphan record.
 *
 * Encoded as comma-separated ids and repeated `page=` params so the whole draft
 * stays readable and shareable within the session.
 */

const PAGE_PREFIX = 'p_';

export interface EvaluationDraft {
  websiteId: string;
  pages: string[];
  categories: EvaluationCategoryId[];
  viewports: EvaluationViewportId[];
}

const EMPTY_DRAFT: EvaluationDraft = {
  websiteId: '',
  pages: [],
  categories: [],
  viewports: [],
};

export function serializeDraft(draft: EvaluationDraft): URLSearchParams {
  const params = new URLSearchParams();
  if (draft.websiteId) params.set('website', draft.websiteId);
  draft.pages.forEach((page, index) => params.set(`${PAGE_PREFIX}${index}`, page));
  if (draft.categories.length) params.set('categories', draft.categories.join(','));
  if (draft.viewports.length) params.set('viewports', draft.viewports.join(','));
  return params;
}

function readDraft(params: URLSearchParams): EvaluationDraft {
  const pages: string[] = [];
  // Pages are numbered rather than repeated so the order the person chose is
  // preserved exactly, including across a reload.
  for (let index = 0; index < MAX_PAGES * 2; index += 1) {
    const value = params.get(`${PAGE_PREFIX}${index}`);
    if (value && !pages.includes(value)) pages.push(value);
  }

  return {
    websiteId: params.get('website') ?? '',
    pages: pages.slice(0, MAX_PAGES),
    categories: normaliseCategories((params.get('categories') ?? '').split(',')),
    viewports: normaliseViewports((params.get('viewports') ?? '').split(',')),
  };
}

export interface UseEvaluationDraftResult {
  draft: EvaluationDraft;
  /** True once at least one choice exists; drives the "dirty" UI hints. */
  isDirty: boolean;
  setWebsite: (websiteId: string) => void;
  setPages: (pages: string[]) => void;
  toggleCategory: (id: EvaluationCategoryId) => void;
  setCategories: (ids: EvaluationCategoryId[]) => void;
  toggleViewport: (id: EvaluationViewportId) => void;
  reset: () => void;
}

/**
 * @param initialWebsiteId preselected site, e.g. from a website detail page.
 * Only applied when the URL does not already carry a website.
 */
export function useEvaluationDraft(initialWebsiteId?: string): UseEvaluationDraftResult {
  const [params, setParams] = useSearchParams();
  const draft = useMemo(() => {
    const parsed = readDraft(params);
    if (!parsed.websiteId && initialWebsiteId) return { ...parsed, websiteId: initialWebsiteId };
    return parsed;
  }, [params, initialWebsiteId]);

  const commit = useCallback(
    (next: EvaluationDraft) => {
      const encoded = serializeDraft(next);
      setParams(encoded, { replace: true });
    },
    [setParams],
  );

  const setWebsite = useCallback((websiteId: string) => commit({ ...draft, websiteId }), [commit, draft]);
  const setPages = useCallback((pages: string[]) => commit({ ...draft, pages }), [commit, draft]);

  const toggleCategory = useCallback(
    (id: EvaluationCategoryId) => {
      const next = draft.categories.includes(id)
        ? draft.categories.filter((item) => item !== id)
        : [...draft.categories, id];
      // Canonical order, so the review page never depends on click order.
      commit({ ...draft, categories: categoryIds.filter((item) => next.includes(item)) });
    },
    [commit, draft],
  );

  const setCategories = useCallback(
    (ids: EvaluationCategoryId[]) => commit({ ...draft, categories: ids }),
    [commit, draft],
  );

  const toggleViewport = useCallback(
    (id: EvaluationViewportId) => {
      const next = draft.viewports.includes(id)
        ? draft.viewports.filter((item) => item !== id)
        : [...draft.viewports, id];
      commit({ ...draft, viewports: viewportIds.filter((item) => next.includes(item)) });
    },
    [commit, draft],
  );

  const reset = useCallback(() => setParams(new URLSearchParams(), { replace: true }), [setParams]);

  return {
    draft,
    isDirty: Boolean(draft.websiteId || draft.pages.length || draft.categories.length || draft.viewports.length),
    setWebsite,
    setPages,
    toggleCategory,
    setCategories,
    toggleViewport,
    reset,
  };
}

export { EMPTY_DRAFT };
