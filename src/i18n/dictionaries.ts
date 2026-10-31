import type { Locale } from './config';
import type { Dictionaries } from './types';
import { en } from './locales/en';
import { id } from './locales/id';

export const dictionaries: Dictionaries = {
  en,
  id,
};

export type { Locale };
