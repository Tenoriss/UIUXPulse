/**
 * English dictionary — source of truth for translation keys.
 * `id.ts` is typed against this shape, so keys can never drift.
 *
 * Note: intentionally not `as const`, so values widen to `string` while keys
 * stay literal — which is exactly what `TranslationKey` needs.
 */
export const en = {
  meta: {
    localeName: 'English',
  },

  common: {
    appName: 'UIUXPulse',
    tagline: 'Editorial-grade UI/UX evaluation',
    loading: 'Loading',
    search: 'Search',
    close: 'Close',
    cancel: 'Cancel',
    confirm: 'Confirm',
    save: 'Save',
    submit: 'Submit',
    next: 'Next',
    back: 'Back',
    continue: 'Continue',
    comingSoon: 'Coming soon',
    readOnly: 'Read-only preview',
    or: 'or',
    previewNotice: 'Preview build — no real data is loaded in this phase.',
    optional: 'Optional',
    required: 'Required',
    all: 'All',
    none: 'None',
    skipToContent: 'Skip to content',
    toggleTheme: 'Toggle theme',
    language: 'Language',
    changeLanguage: 'Change language',
    menu: 'Menu',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    more: 'More',
    soon: 'Soon',
    you: 'You',
  },

  nav: {
    home: 'Home',
    about: 'About',
    howItWorks: 'How it works',
    criteria: 'Evaluation criteria',
    principles: 'Principles',
    signIn: 'Sign in',
    signUp: 'Create account',
    dashboard: 'Dashboard',
  },

  about: {
    problemsIndex: '04',
  },

  criteria: {
    eyebrow: 'Evaluation criteria',
    title: 'Six ways of looking at one page.',
    lede:
      'A short, published set of criteria applied the same way to every evaluation — so a report can be read, argued with, and compared.',
    indexLabel: 'The six categories',
    detailLabel: 'What each category covers',
    whatLabel: 'What is evaluated',
    whyLabel: 'Why it matters',
    problemsLabel: 'Potential problems',
    recommendationsLabel: 'Possible recommendations',
    exampleBadge: 'Example',
    disclaimer:
      'Examples only. No scoring formula is fixed yet, and no automated analysis is connected in this build — these categories describe what a UIUXPulse review is meant to look at.',
  },

  start: {
    eyebrow: 'Start an evaluation',
    title: 'This step needs an account.',
    lead:
      'An evaluation belongs to a workspace so it can be revisited later. Sign in to continue, or create an account first — you will be brought straight back here.',
    redirecting: 'Taking you to sign in…',
  },

  session: {
    signedIn: 'Signed in',
  },

  developer: {
    eyebrow: 'Built by',
    title: 'Built by one person, without compromise.',
    lead: 'UIUXPulse is designed and developed entirely in-house — from the frontend architecture and design system to the application logic. Every line of code and every visual detail comes from the same pair of hands, which keeps the design consistent, the performance fast, and the experience whole, with no seams.',
    purposeLabel: 'Purpose',
    purpose:
      'UIUXPulse exists to give product teams a second pair of eyes on the site they already own: clear findings, visual evidence, and recommendations they can act on themselves — without ever touching or changing the site being evaluated.',
    github: 'GitHub',
    instagram: 'Instagram',
    githubNote: 'Source, commits, and issues',
    instagramNote: 'Process notes and behind the scenes',
    visit: 'Open profile',
    backToTop: 'Back to top',
    madeWith: 'Designed and built in a boarding room',
  },

  profile: {
    eyebrow: 'Profile',
    title: 'Edit your profile',
    body: 'Your name and photo appear across the workspace. Everything stays in this browser.',
    edit: 'Edit profile',
    openMenu: 'Open profile',
    menuLabel: 'Profile menu',
    sectionTitle: 'Profile information',
    accountTitle: 'Account information',
    accountBody: 'Read-only details for the account you are signed in with.',
    fullName: 'Full name',
    email: 'Email address',
    photo: 'Profile photo',
    photoHint: 'PNG, JPEG, or WebP up to {max} MB. Images are resized in your browser.',
    uploadPhoto: 'Upload photo',
    changePhoto: 'Change photo',
    removePhoto: 'Remove',
    save: 'Save changes',
    savedTitle: 'Profile updated',
    savedBody: 'Your name, email, and photo are saved on this device.',
    avatarTypeError: 'Choose a PNG, JPEG, or WebP image.',
    avatarSizeError: 'That image is larger than the limit. Please choose a smaller file.',
    avatarDecodeError: 'That image could not be read. Try a different file.',
    accountId: 'Account ID',
    accountIdHint: 'Ties this session to the stored account. It never changes.',
    memberSince: 'Member since',
    passwordLabel: 'Password',
    passwordNote: 'Stored as a digest, never as text',
    demoBadge: 'Demo account',
    fallbackName: 'there',
    errors: {
      generic: 'Your profile could not be saved. Try again.',
    },
  },

  footer: {
    description:
      'An independent evaluation practice for teams who care how their websites feel, not only how they look.',
    product: 'Product',
    resources: 'Resources',
    company: 'Company',
    methodology: 'Methodology',
    documentation: 'Documentation',
    changelog: 'Changelog',
    about: 'About',
    contact: 'Contact',
    privacy: 'Privacy',
    terms: 'Terms',
    rights: 'All rights reserved.',
    disclaimer:
      'UIUXPulse evaluates and recommends. We never modify, redesign, or publish changes to the websites we review.',
  },

  home: {
    available: 'Accepting new evaluations',
    heroLineOne: 'Website',
    heroLineTwo: 'Evaluation',
    heroAccent: 'with intention',
    heroEyebrow: 'UI/UX evaluation studio',
    heroTitle: 'Clarity for the',
    heroTitleAccent: 'websites',
    heroTitleRest: 'you already own.',
    heroLead:
      'Submit a URL, choose the pages that matter, and receive a calm, structured read on usability, hierarchy, and craft — with visual evidence and recommendations you can act on yourself.',
    heroPrimary: 'Start an evaluation',
    heroSecondary: 'See how it works',
    heroMeta: 'Evaluation practice · Jakarta / remote',
    heroPortraitAlt: 'UIUXPulse pixel mascot',
    heroSupport: 'Scores, evidence, and recommendations — never changes to your site.',
    heroScroll: 'Selected sections',
    indexLabel: 'Report index',
    heroNote: 'No crawling of private spaces. No changes to your site. Ever.',
    statsLabel: 'At a glance',
    stats: {
      pages: { value: '06', label: 'Pages selectable per evaluation' },
      evidence: { value: '04', label: 'Fixed sections in every report' },
      languages: { value: '02', label: 'Report languages, EN and ID' },
    },
    marquee: 'Usability · Hierarchy · Typography · Accessibility · Motion · Trust',

    principlesEyebrow: 'Principles',
    principlesTitle: 'We read the site. We never rewrite it.',
    principlesLead:
      'Evaluation is a separate act from authorship. Everything we produce is an observation, an artefact, or a recommendation — never a change to your product.',
    principles: {
      observe: {
        title: 'Observe, don’t alter',
        body: 'The reviewed site stays exactly as it is. Findings are captured as evidence, screenshots, and annotations outside your codebase.',
      },
      explain: {
        title: 'Explain the reasoning',
        body: 'Every score carries the criteria behind it, so a designer can disagree with the judgement and still understand it.',
      },
      prioritise: {
        title: 'Prioritise what moves',
        body: 'Recommendations are ordered by impact and effort, so improvements can be sequenced instead of attempted all at once.',
      },
    },

    flowEyebrow: 'How it works',
    flowTitle: 'Three quiet steps.',
    flowLead:
      'A deliberately short path from submission to a report your team can read in one sitting.',
    flow: {
      submit: {
        title: 'Submit a URL',
        body: 'Add the site you want reviewed. One property per evaluation keeps findings legible.',
      },
      select: {
        title: 'Select pages',
        body: 'Pick the pages that carry the experience — landing, pricing, onboarding, the flow that matters.',
      },
      receive: {
        title: 'Receive the report',
        body: 'Scores, evidence, and recommendations arrive together, ordered by what to fix first.',
      },
    },

    scopeEyebrow: 'Scope',
    scopeTitle: 'What a Pulse report contains',
    scopeLead:
      'Fixed sections, consistent across every evaluation, so two reports can be compared honestly.',
    scope: {
      scores: { title: 'Composite scores', body: 'Overall and per-criterion signal with weighting shown.' },
      findings: { title: 'Findings', body: 'Specific observations, each tied to a criterion and a page.' },
      evidence: { title: 'Visual evidence', body: 'Annotated captures of the exact element being discussed.' },
      recommendations: {
        title: 'Recommendations',
        body: 'Suggested direction with impact, effort, and explicit ownership on your side.',
      },
    },

    ctaEyebrow: 'Begin',
    ctaTitle: 'Start with one page.',
    ctaLead:
      'The first evaluation is often the smallest. Submit a single landing page and see how the report reads.',
    ctaButton: 'Start an evaluation',
    ctaSecondary: 'Read the methodology',
  },

  auth: {
    eyebrow: 'Account',
    signInTitle: 'Welcome back.',
    signInLead: 'Sign in to review your evaluations and reports.',
    email: 'Email address',
    emailPlaceholder: 'you@studio.com',
    password: 'Password',
    passwordPlaceholder: 'At least 8 characters',
    confirmPassword: 'Confirm password',
    fullName: 'Full name',
    fullNamePlaceholder: 'Nadia Pratama',
    organization: 'Studio or company',
    organizationPlaceholder: 'Optional',
    remember: 'Keep me signed in',
    forgot: 'Forgot password?',
    signIn: 'Sign in',
    signUp: 'Create account',
    noAccount: 'No account yet?',
    hasAccount: 'Already have an account?',
    createOne: 'Create one',
    signInInstead: 'Sign in',
    terms: 'By continuing you agree to the evaluation terms and privacy note.',
    showPassword: 'Show password',
    hidePassword: 'Hide password',
    previewNotice:
      'Preview build — authentication is not connected yet. These forms validate input only.',
    registerTitle: 'Create your account.',
    registerLead: 'Set up a workspace for your evaluations in under a minute.',
    createAccount: 'Create account',
    confirmPlaceholder: 'Repeat your password',
    passwordHint: 'At least 8 characters.',
    acceptTerms: 'I agree to the evaluation terms and privacy note.',
    backToSignIn: 'Back to sign in',
    signedInTitle: 'Signed in as {name}',
    welcomeTitle: 'Welcome, {name}',
    signedOutTitle: 'Signed out',
    signedOutLead: 'Your demo session has been cleared on this device.',
    demoNotice: 'Frontend demo — accounts are stored in this browser only. Nothing is sent to a server.',
    forgotTitle: 'Reset your password.',
    forgotLead: 'Enter the account email and we will describe what a reset would do in the full product.',
    sendResetLink: 'Send reset link',
    resetSentTitle: 'Check your inbox.',
    resetSentLead: 'If an account exists for that address, a reset link would be on its way.',
    tryAnotherEmail: 'Use another email',
    continueToReset: 'Continue to reset password',
    resetTitle: 'Choose a new password.',
    resetLead: 'Set a new password for your demo account. No email is sent and nothing is verified.',
    newPassword: 'New password',
    resetPassword: 'Reset password',
    resetDoneTitle: 'Password updated.',
    resetDoneLead: 'Your demo password has been changed. Sign in again with the new one.',
    resetDoneNote: 'Demo only — no email was sent and this account lives in your browser.',
    errors: {
      invalidCredentials: 'Email or password is incorrect.',
      accountNotFound: 'No demo account uses that email address.',
      generic: 'Something went wrong. Try again.',
    },

    asideTitle: 'Evaluation is a second pair of eyes, not a second pair of hands.',
    asideBody:
      'Reports are written for the people who will do the work: designers, engineers, and the person who owns the roadmap.',
  },

  dashboard: {
    nav: {
      overview: 'Overview',
      evaluations: 'Evaluations',
      reports: 'Reports',
      settings: 'Settings',
      admin: 'Admin',
    },
    workspace: 'Workspace',
    greeting: 'Good to see you',
    welcome: 'Welcome back, {name}.',
    welcomeBody: "Here's an overview of your website evaluation workspace.",
    statsLabel: 'Workspace totals',
    statsEmpty:
      'These counters fill up as evaluations are submitted. Nothing is simulated here.',
    viewAll: 'View all',
    quickActions: 'Quick actions',
    quick: {
      newBody: 'Start from a website URL',
      evaluationsBody: 'Every submitted website',
      reportsBody: 'Completed evaluations',
      profileBody: 'Name, email, and photo',
    },
    scoreLabel: 'Overall score',
    status: {
      queued: 'Queued',
      inReview: 'In review',
      completed: 'Completed',
      failed: 'Failed',
    },
    greetingBody: 'Your evaluations and reports live here.',
    newEvaluation: 'New evaluation',
    overview: 'Overview',
    recent: 'Recent evaluations',
    recentEmptyTitle: 'No evaluations yet',
    recentEmptyBody:
      'Submit a website URL to start your first evaluation. Reports appear here once an evaluation is complete.',
    recentEmptyAction: 'Submit a URL',
    activity: 'Activity',
    activityEmptyTitle: 'Nothing to show yet',
    activityEmptyBody: 'Actions on your evaluations will be listed here.',
    stats: {
      websites: 'Websites',
      evaluations: 'Evaluations',
      completed: 'Completed',
      availableReports: 'Available reports',
      pages: 'Pages reviewed',
      pending: 'Awaiting review',
    },
    disclaimer:
      'UIUXPulse analyses and recommends only. Evaluated websites are never modified.',
    signOut: 'Sign out',
    urlLabel: 'Website URL',
    urlPlaceholder: 'https://studio-aria.com',
    reportPreview: 'What a report contains',
    settings: {
      title: 'Settings',
      body: 'Workspace preferences, language, and report defaults will be configured here.',
    },
    evaluations: {
      title: 'Evaluations',
      body: 'Every submitted website and its pages will be listed here once submission is enabled.',
    },
    reports: {
      title: 'Reports',
      body: 'Completed reports, scores, and evidence will be collected here.',
    },
  },

  admin: {
    nav: {
      overview: 'Overview',
      queue: 'Review queue',
      users: 'Users',
      criteria: 'Criteria',
      settings: 'Settings',
    },
    title: 'Administration',
    subtitle: 'Internal tools for the evaluation practice.',
    restricted: 'Restricted area',
    restrictedBody:
      'This shell is a structural preview. Access control is not enforced until authentication is connected.',
    metrics: {
      queue: 'In queue',
      active: 'In progress',
      published: 'Published',
      reviewers: 'Reviewers',
    },
    queueEmptyTitle: 'The queue is clear',
    queueEmptyBody: 'Submitted evaluations will appear here for assignment.',
    criteriaTitle: 'Criteria set',
    criteriaBody:
      'Scoring criteria, weights, and report templates are managed here in a later phase.',
  },

  states: {
    loading: 'Loading',
    loadingBody: 'Fetching the latest state of this view.',
    emptyTitle: 'Nothing here yet',
    emptyBody: 'When there is something to show, it will appear in this space.',
    errorTitle: 'Something broke quietly',
    errorBody: 'This section could not be loaded. Try again, or continue elsewhere.',
    retry: 'Try again',
    notFoundTitle: 'This page has wandered off',
    notFoundBody:
      'The link may be outdated, or the page may not exist in this preview build.',
    notFoundAction: 'Back to home',
    forbiddenTitle: 'Not available here',
    forbiddenBody: 'You do not have access to this area in the current preview.',
  },

  validation: {
    required: 'This field is required.',
    email: 'Enter a valid email address.',
    passwordMin: 'Use at least 8 characters.',
    passwordMatch: 'Passwords do not match.',
    url: 'Enter a valid URL, including https://',
    terms: 'Accept the terms to continue.',
    emailTaken: 'An account with this email already exists.',
  },

  toast: {
    dismiss: 'Dismiss notification',
    successTitle: 'Done',
    infoTitle: 'Heads up',
    errorTitle: 'Something went wrong',
  },

  guide: {
    open: 'Pip explains: {page}',
    hide: 'Hide Pip',
    show: 'Show Pip',
  },

  modal: {
    close: 'Close dialog',
  },

  dropdown: {
    openMenu: 'Open menu',
    noResults: 'No matches',
  },

  tabs: {
    label: 'Sections',
  },

  pagination: {
    label: 'Pagination',
    previous: 'Previous',
    next: 'Next',
  },
};

export type Dictionary = typeof en;
