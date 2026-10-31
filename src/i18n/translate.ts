import type { Locale, TranslationVars } from './config';
import { DEFAULT_LOCALE, LOCALE_META, SUPPORTED_LOCALES } from './config';
import { dictionaries } from './dictionaries';
import type { TranslationKey } from './types';

function getPath(source: unknown, path: string): unknown {
  return path.split('.').reduce<unknown>((acc, segment) => {
    if (acc && typeof acc === 'object' && segment in (acc as Record<string, unknown>)) {
      return (acc as Record<string, unknown>)[segment];
    }
    return undefined;
  }, source);
}

function interpolate(template: string, vars?: TranslationVars): string {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (match, token: string) =>
    token in vars ? String(vars[token]) : match,
  );
}

/**
 * Translate a dotted key for a locale, falling back to the default locale and
 * finally to the key itself. Safe to call outside React (e.g. in loaders).
 */
export function translate(
  locale: Locale,
  key: TranslationKey | string,
  vars?: TranslationVars,
): string {
  const value =
    getPath(dictionaries[locale], key) ?? getPath(dictionaries[DEFAULT_LOCALE], key);

  if (typeof value !== 'string') {
    if (import.meta.env.DEV) {
      console.warn(`[i18n] Missing translation for "${key}" (${locale})`);
    }
    return key;
  }

  return interpolate(value, vars);
}

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (SUPPORTED_LOCALES as readonly string[]).includes(value);
}

/** Best-effort match for a browser language such as `id-ID` or `en-GB`. */
export function resolveBrowserLocale(): Locale | null {
  if (typeof navigator === 'undefined') return null;
  const preferred = navigator.languages?.length ? navigator.languages : [navigator.language];
  for (const candidate of preferred) {
    const base = candidate.toLowerCase().split('-')[0];
    if (isLocale(base)) return base;
  }
  return null;
}

export function formatNumber(locale: Locale, value: number, options?: Intl.NumberFormatOptions) {
  return new Intl.NumberFormat(LOCALE_META[locale].intl, options).format(value);
}

export function formatDate(
  locale: Locale,
  value: Date | number | string,
  options: Intl.DateTimeFormatOptions = { dateStyle: 'medium' },
) {
  return new Intl.DateTimeFormat(LOCALE_META[locale].intl, options).format(new Date(value));
}
