import type { Locale } from './config';

type Leaves<T> = T extends Record<string, unknown>
  ? {
      [K in keyof T & string]: T[K] extends Record<string, unknown>
        ? `${K}.${Leaves<T[K]>}`
        : K;
    }[keyof T & string]
  : never;

export type TranslationDictionary = typeof import('./locales/en').en;
export type TranslationKey = Leaves<TranslationDictionary>;

export type Dictionaries = Record<Locale, TranslationDictionary>;
