export const SUPPORTED_LOCALES = ['en', 'id'] as const;

export type Locale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'en';

export const LOCALE_STORAGE_KEY = 'uiuxpulse.locale';

export interface LocaleMeta {
  code: Locale;
  /** Native label, always shown in its own language. */
  label: string;
  /** Short code used in compact switchers. */
  short: string;
  /** BCP-47 tag passed to Intl formatters. */
  intl: string;
  dir: 'ltr' | 'rtl';
}

export const LOCALE_META: Record<Locale, LocaleMeta> = {
  en: { code: 'en', label: 'English', short: 'EN', intl: 'en-US', dir: 'ltr' },
  id: { code: 'id', label: 'Bahasa Indonesia', short: 'ID', intl: 'id-ID', dir: 'ltr' },
};

export type TranslationVars = Record<string, string | number>;
