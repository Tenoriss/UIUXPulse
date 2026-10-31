import type { TranslationKey } from '@/i18n/types';

export interface DeveloperProfile {
  /** Internal id, also used as a React key. */
  id: 'github' | 'instagram';
  /** Display handle, exactly as it appears on the platform. */
  handle: string;
  /** Public profile URL. */
  href: string;
  /** Platform label, resolved through i18n. */
  platformKey: TranslationKey;
  /** One-line description of what this profile is used for. */
  noteKey: TranslationKey;
}

/**
 * Credits data lives here (not in i18n) because handles and URLs are content,
 * while the surrounding labels stay translatable.
 */
export const developers: DeveloperProfile[] = [
  {
    id: 'github',
    handle: '@SleepyDev',
    href: 'https://github.com/Tenoriss',
    platformKey: 'developer.github',
    noteKey: 'developer.githubNote',
  },
  {
    id: 'instagram',
    handle: '@AtennnnRawatJln',
    href: 'https://www.instagram.com/_atenntxs/',
    platformKey: 'developer.instagram',
    noteKey: 'developer.instagramNote',
  },
];
