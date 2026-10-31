import { normaliseUrl, urlKey, domainOf } from '@/lib/url';
import { criterionOrder, type CriterionKey } from '@/content/criteria';
import type { EvaluationCategoryId, EvaluationViewportId } from '@/services/workspace.types';

/**
 * Configuration vocabulary for the evaluation wizard.
 *
 * Kept apart from the service so the UI, the service, and the store all agree
 * on the legal values without importing each other's concerns.
 */

/** A configuration may cover at most this many pages. */
export const MAX_PAGES = 10;

/**
 * The six categories map 1:1 onto the public criteria content, so the wizard
 * reuses the same names and summaries the marketing site already explains —
 * one source of truth, already bilingual, no second copy to drift.
 */
export const categoryIds = criterionOrder as readonly CriterionKey[] satisfies readonly EvaluationCategoryId[];

export function isCategoryId(value: string): value is EvaluationCategoryId {
  return (categoryIds as readonly string[]).includes(value);
}

export interface ViewportOption {
  id: EvaluationViewportId;
  /** Intended reference width, in CSS pixels. */
  width: number;
}

/** Order matters: desktop, tablet, mobile reads like the design process. */
export const viewportOptions: readonly ViewportOption[] = [
  { id: 'desktop', width: 1440 },
  { id: 'tablet', width: 768 },
  { id: 'mobile', width: 390 },
];

export const viewportIds = viewportOptions.map((option) => option.id);

export function isViewportId(value: string): value is EvaluationViewportId {
  return (viewportIds as readonly string[]).includes(value);
}

/** Keep only known ids, in canonical order, with duplicates removed. */
export function normaliseCategories(values: readonly string[]): EvaluationCategoryId[] {
  return categoryIds.filter((id) => values.includes(id));
}

export function normaliseViewports(values: readonly string[]): EvaluationViewportId[] {
  return viewportIds.filter((id) => values.includes(id));
}

/**
 * Example internal paths used by the simulated discovery panel.
 *
 * This is demo data: nothing here is fetched, crawled, or read from a sitemap.
 * Paths are generic enough to look plausible on any site, and the UI labels
 * them as examples at every point they appear.
 */
export const demoPagePaths = [
  '/',
  '/about',
  '/services',
  '/projects',
  '/pricing',
  '/journal',
  '/contact',
];

/** Absolute URLs for the demo suggestions on a given site. */
export function demoPagesFor(websiteUrl: string): string[] {
  const base = normaliseUrl(websiteUrl);
  if (!base) return [];
  const origin = new URL(base).origin;
  return demoPagePaths.map((path) => normaliseUrl(`${origin}${path}`) ?? `${origin}${path}`);
}

/**
 * Why a page cannot be added, or `null` when it can.
 *
 * A page must be a usable http(s) URL, must live on the selected website's
 * host, and must not already be in the list. The comparison is scheme-less so
 * `http://site.com/x` cannot be added next to `https://site.com/x`.
 */
export function checkPage(
  input: string,
  websiteUrl: string,
  selected: readonly string[],
): { page: string | null; error: PageErrorCode | null } {
  const trimmed = input.trim();
  if (!trimmed) return { page: null, error: 'invalidPage' };

  const normalised = normaliseUrl(trimmed);
  if (!normalised) return { page: null, error: 'invalidPage' };

  const key = urlKey(normalised);
  const siteKey = urlKey(websiteUrl);
  if (!key || !siteKey) return { page: null, error: 'invalidPage' };

  // Compare hosts rather than string prefixes: `site.com.evil.test` must fail.
  const pageHost = domainOf(normalised);
  const siteHost = domainOf(websiteUrl);
  if (pageHost !== siteHost) return { page: null, error: 'foreignPage' };

  if (selected.some((page) => urlKey(page) === key)) {
    return { page: null, error: 'duplicatePage' };
  }

  return { page: normalised, error: null };
}

/** Errors produced by page validation, named once for the wizard's i18n map. */
export type PageErrorCode = 'invalidPage' | 'foreignPage' | 'duplicatePage' | 'tooManyPages';

/** Path shown for a page, so long URLs stay readable in tight layouts. */
export function pagePathLabel(page: string): string {
  try {
    const url = new URL(page);
    return `${url.pathname}${url.search}`;
  } catch {
    return page;
  }
}

export type { EvaluationCategoryId, EvaluationViewportId };
