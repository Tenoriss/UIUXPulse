/**
 * Static product configuration: routes and external links in one place so
 * navigation, footer, and CTAs never drift apart.
 */
export const site = {
  name: 'UIUXPulse',
  url: 'https://uiuxpulse.com',
  email: 'hello@uiuxpulse.com',
} as const;

export const routes = {
  home: '/',
  about: '/about',
  startEvaluation: '/start',
  howItWorks: '/how-it-works',
  criteria: '/criteria',
  principles: '/principles',
  methodology: '/methodology',
  signIn: '/sign-in',
  /** Canonical registration page. */
  register: '/register',
  /** Legacy alias kept so existing links keep working; forwards to /register. */
  signUp: '/sign-up',
  forgotPassword: '/forgot-password',
  resetPassword: '/reset-password',
  profile: '/app/settings',
  dashboard: '/app',
  dashboardOverview: '/app',
  websites: '/app/websites',
  websiteNew: '/app/websites/new',
  evaluations: '/app/evaluations',
  evaluationNew: '/app/evaluations/new',
  reports: '/app/reports',
  settings: '/app/settings',
  admin: '/admin',
  /** Kept as an alias: earlier phases linked here, it now forwards. */
  adminQueue: '/admin/queue',
  adminEvaluations: '/admin/evaluations',
  adminUsers: '/admin/users',
  adminCriteria: '/admin/criteria',
  adminSettings: '/admin/settings',
} as const;

export type RouteKey = keyof typeof routes;
