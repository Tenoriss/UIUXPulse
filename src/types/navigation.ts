import type { LucideIcon } from 'lucide-react';
import type { TranslationKey } from '@/i18n/types';

export interface NavItem {
  /** Route path. Externally absolute URLs are allowed for docs links. */
  to: string;
  /** Dotted translation key resolved at render time. */
  labelKey: TranslationKey;
  icon?: LucideIcon;
  /** Render as an external anchor and open in a new tab. */
  external?: boolean;
  /** Small suffix label, e.g. "Soon" for unreleased areas. */
  badgeKey?: TranslationKey;
  /** Hide from the mobile drawer (rarely needed). */
  hideOnMobile?: boolean;
}

export interface NavGroup {
  titleKey?: TranslationKey;
  items: NavItem[];
}

export type NavTree = NavGroup[];
