import {
  FileText,
  Gauge,
  Globe,
  LayoutDashboard,
  Layers,
  ListChecks,
  Settings,
  SlidersHorizontal,
  Users,
} from 'lucide-react';
import type { NavItem, NavTree } from '@/types/navigation';
import { routes } from './site';

/** Primary public header navigation. */
export const publicNav: NavItem[] = [
  { to: routes.howItWorks, labelKey: 'nav.howItWorks' },
  { to: routes.criteria, labelKey: 'nav.criteria' },
  { to: routes.about, labelKey: 'nav.about' },
  { to: routes.principles, labelKey: 'nav.principles' },
];

/** Public footer link groups. */
export const footerNav: NavTree = [
  {
    titleKey: 'footer.product',
    items: [
      { to: routes.howItWorks, labelKey: 'nav.howItWorks' },
      { to: routes.criteria, labelKey: 'nav.criteria' },
      { to: routes.principles, labelKey: 'nav.principles' },
      { to: routes.methodology, labelKey: 'footer.methodology' },
    ],
  },
  {
    titleKey: 'footer.resources',
    items: [
      { to: routes.methodology, labelKey: 'footer.methodology', badgeKey: 'common.soon' },
      { to: routes.methodology, labelKey: 'footer.documentation', badgeKey: 'common.soon' },
    ],
  },
  {
    titleKey: 'footer.company',
    items: [
      { to: routes.about, labelKey: 'footer.about' },
      { to: `mailto:${'hello@uiuxpulse.com'}`, labelKey: 'footer.contact', external: true },
      { to: routes.methodology, labelKey: 'footer.privacy', badgeKey: 'common.soon' },
    ],
  },
];

/** Dashboard sidebar navigation. */
export const dashboardNav: NavItem[] = [
  { to: routes.dashboardOverview, labelKey: 'dashboard.nav.overview', icon: LayoutDashboard },
  { to: routes.websites, labelKey: 'dashboard.nav.websites', icon: Globe },
  { to: routes.evaluations, labelKey: 'dashboard.nav.evaluations', icon: Gauge },
  { to: routes.reports, labelKey: 'dashboard.nav.reports', icon: FileText },
  { to: routes.settings, labelKey: 'dashboard.nav.settings', icon: Settings },
];

/** Admin sidebar navigation. */
export const adminNav: NavItem[] = [
  { to: routes.admin, labelKey: 'admin.nav.overview', icon: Layers },
  { to: routes.adminQueue, labelKey: 'admin.nav.queue', icon: ListChecks },
  { to: routes.adminUsers, labelKey: 'admin.nav.users', icon: Users },
  { to: routes.adminCriteria, labelKey: 'admin.nav.criteria', icon: SlidersHorizontal },
  { to: routes.adminSettings, labelKey: 'admin.nav.settings', icon: Settings },
];

export const languagesNavLabel = 'common.language' as const;
