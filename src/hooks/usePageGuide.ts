import { useLocation } from 'react-router-dom';
import { useI18n } from '@/i18n';
import { guideContent, type GuidePage } from '@/content/guide';

/**
 * Map the current URL to its guide entry.
 *
 * Routes are matched longest-first so `/app/evaluations` never resolves to
 * `/app`, and unknown paths fall back to the 404 entry.
 */
const ROUTE_KEYS: Array<[pattern: RegExp, key: string]> = [
  [/^\/app\/websites\/(?:new|[^/]+\/edit|[^/]+)/, 'websiteDetail'],
  [/^\/app\/websites/, 'websites'],
  [/^\/app\/evaluations\/new/, 'evaluationWizard'],
  [/^\/app\/evaluations\/[^/]+/, 'evaluationDetail'],
  [/^\/app\/evaluations/, 'evaluations'],
  [/^\/app\/reports/, 'reports'],
  [/^\/app\/settings/, 'settings'],
  [/^\/app$/, 'dashboard'],
  [/^\/admin\/queue/, 'adminQueue'],
  [/^\/admin\/users/, 'adminUsers'],
  [/^\/admin\/criteria/, 'adminCriteria'],
  [/^\/admin\/settings/, 'settings'],
  [/^\/admin$/, 'admin'],
  [/^\/sign-in/, 'signIn'],
  [/^\/(?:sign-up|register)/, 'register'],
  [/^\/forgot-password/, 'forgotPassword'],
  [/^\/reset-password/, 'resetPassword'],
  [/^\/about/, 'about'],
  [/^\/criteria/, 'criteria'],
  [/^\/start/, 'start'],
  [/^\/how-it-works/, 'howItWorks'],
  [/^\/principles/, 'principles'],
  [/^\/methodology/, 'methodology'],
  [/^\/$/, 'home'],
];

export function resolveGuideKey(pathname: string): string {
  const match = ROUTE_KEYS.find(([pattern]) => pattern.test(pathname));
  return match ? match[1] : 'notFound';
}

export function usePageGuide(): GuidePage {
  const { pathname } = useLocation();
  const { locale } = useI18n();

  const key = resolveGuideKey(pathname);
  const dictionary = guideContent[locale];

  return dictionary[key] ?? guideContent.en.notFound;
}
