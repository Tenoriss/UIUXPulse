# UIUXPulse — Frontend Foundation

Website UI/UX evaluation platform. This repository contains the **frontend foundation only**:
design system, reusable components, layouts, routing, and bilingual (EN/ID) architecture.

> **Product rule:** UIUXPulse analyses websites and returns scores, findings, visual evidence,
> and recommendations. It never modifies, redesigns, or auto-fixes the websites it evaluates.
> There is no backend, database, authentication service, or scanning engine in this phase.

## Stack

| Concern    | Choice                                        |
| ---------- | --------------------------------------------- |
| Runtime    | React 19 + TypeScript (strict)                |
| Bundler    | Vite 8                                        |
| Styling    | Tailwind CSS v4 (CSS-first `@theme` tokens)   |
| Routing    | React Router 7 (`createBrowserRouter`)        |
| Icons      | Lucide React                                  |
| Fonts      | Fraunces (SOFT) + Bricolage Grotesque + Plus Jakarta Sans (Fontsource) |

## Commands

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + production build
npm run preview    # serve the production build
npm run typecheck  # tsc project references, no emit
```

## Structure

```
src/
├── components/
│   ├── auth/          AuthHeading, AuthFooterLinks
│   ├── brand/         Logo, LanguageSwitcher
│   ├── layout/        Container, PublicHeader/Footer, AppShell, AppSidebar,
│   │                  AppTopbar, PageHeader, SectionHeader, NavLink, ScrollToTop
│   ├── shared/        PageIntro, CtaBand
│   └── ui/            Button, Input, Card, Badge, Modal, Dropdown, Tabs,
│                      Toast, Loading, EmptyState, ErrorState
├── components/mascot/ Pip — the per-page guide (floating, bilingual)
├── config/            site routes + navigation trees
├── content/           long-form bilingual copy: guide per route, about, how-it-works,
│                      criteria (en + id)
├── hooks/             useMediaQuery, useDismissable, useLockBodyScroll, useScrolled, useMounted
├── i18n/              provider, typed dictionaries (en/id), translate helpers
├── layouts/           PublicLayout, AuthLayout, DashboardLayout, AdminLayout
├── lib/               cn (class composition), validation, redirect guards, mock auth
├── pages/             public/ auth/ dashboard/ admin/ errors/
├── providers/         ToastProvider, SessionProvider (mock session)
├── styles/            index.css — design tokens, base layer, keyframes, utilities
└── types/             ui.ts, navigation.ts, session.ts
```

## Design system documentation

Behavioural and accessibility rules (component states, keyboard contracts, contrast
requirements, anti-patterns, QA checklist) live in [`docs/design-system.md`](docs/design-system.md).
That document is the contract; this README only covers setup.

## Public routes

| Route           | Page                                                              |
| --------------- | ----------------------------------------------------------------- |
| `/`             | Home                                                              |
| `/how-it-works` | Intended workflow, eight steps, current vs. intended capabilities |
| `/criteria`     | Six evaluation categories, with example problems and recommendations |
| `/about`        | What the product is, its purpose, problems, and four principles   |
| `/principles`   | Editorial principles                                              |
| `/methodology`  | What a report contains                                            |
| `/start`        | Start-an-evaluation gate (redirects to sign-in when signed out)   |
| `/sign-in`      | Sign in (mock credentials, `?next=` destination preserved)        |
| `/register`     | Create a demo account (canonical; `/sign-up` forwards here)       |
| `/forgot-password` | Mock reset request — no email is sent                          |
| `/reset-password`  | Mock reset form — updates the demo account's password          |

## Authentication (frontend mock)

Everything lives in `src/services/`: `auth.storage.ts` is the only module that touches
`localStorage`, `auth.service.ts` holds the register/login/logout/reset logic, and
`auth.context.tsx` exposes it through `useAuth()`.

- **Register** a demo account, then sign in with it. Accounts are per-browser; the demo
  starts empty, so there is no seeded password to guess.
- Passwords are **never stored** — only a salted SHA-256 digest, so a wrong password really
  fails. That is a demo substitute, not a password hash.
- The session persists across refreshes; logout clears it and returns to the homepage.
- `/app/**` and `/admin/**` are guarded by `RequireAuth`; the intended destination survives
  the sign-in round trip.
- Forgot/reset password never send email and never verify a token — they change the local
  demo account only.

Clearing site data resets everything. There is no backend, no OAuth, and no email delivery.

## Dashboard and profile

`/app` shows a greeting for the signed-in account, four totals derived from the evaluation
store (`services/workspace.service.ts`), recent submissions, and quick actions. No evaluation
has been submitted yet, so the totals read zero and the recent list shows an empty state —
nothing is fabricated.

Profile editing lives in `components/profile/`. The same form is used by the dashboard
dialog (sidebar identity row, topbar menu, quick action) and by the settings page. Name,
email, and photo persist to the demo account in `localStorage`:

- images must be PNG, JPEG, or WebP and at most 2 MB;
- each upload is centre-cropped and re-encoded to a 256px JPEG data URL in the browser;
- removing the photo restores the default pixel mascot;
- the account id never changes, so an email change cannot orphan the session.

## Websites

Registered sites live in their own store (`uiuxpulse.websites`, keyed by owner id),
managed through `services/website.service.ts` — the only place that reads or writes it.
Routes: `/app/websites`, `/app/websites/new`, `/app/websites/:id`,
`/app/websites/:id/edit`, all behind the existing auth guard.

- **Normalisation** (`lib/url.ts`): a bare domain gains `https://`; the host is lowercased
  and stripped of `www.`; a trailing slash and the fragment are dropped; **path and query
  are preserved**, so `/shop` and `/` are different records. `http` and `https` stay distinct.
- **Ownership**: every service call takes the owner id from `useAuth()`. A record belonging
  to another account resolves to "not found" rather than a permission error.
- **Duplicates**: one account cannot register the same normalised URL twice.
- **Deletion** removes the row and **keeps every evaluation**. Related evaluations are
  detached (`websiteId` cleared, the site name copied into `record.website`) and the count
  is shown in the confirmation and the success toast. Nothing unrelated is touched.
- **No scanning.** The detail page shows evaluation history only when real records exist,
  and counts are read from the store; nothing is invented.

## Design tokens

All tokens live in `src/styles/index.css` under `@theme`, so every value is both a CSS
variable and a Tailwind utility.

- **Palette (dark)** — `canvas #111110`, `surface #191917`, `surface-muted #21211E`,
  `ink #F3F1EA`, `ink-soft #C6C4BA`, `ink-muted #9C9A90`, `sage-wash #1C221A`,
  `sage-deep #8FA084`, `line #2A2A26`, plus muted clay/ochre feedback tones.
  Raw values live in `--brand-*`; utilities are generated from the `--color-*`
  aliases registered in `@theme`.
- **Type** — `font-serif` (Instrument Serif) for editorial headings, `font-sans` (Inter) for UI.
  Fluid display scale: `text-display`, `text-h1…h4`, `text-lead`, `text-body`, `text-micro`, `eyebrow`.
- **Radius** — `xs … 2xl` plus `pill` (used only for buttons, badges, and chips).
- **Depth (claymorphism)** — on a dark canvas a drop shadow reads as mud, so clay depth
  is a 1px rim highlight on the top edge plus a wide, very low-opacity ambient shadow:
  `clay-surface` (raised), `clay-inset` (recessed inputs/wells), `shadow-clay`,
  `shadow-clay-lg`, `shadow-clay-pressed`.
- **Motion** — `animate-float` / `animate-float-slow` / `animate-float-fast` drive the
  floating app-tile field, with per-icon `delay` and `--icon-rotate`; `animate-pulse-dot`
  marks live availability. Everything collapses under `prefers-reduced-motion`.
- **Motion** — one easing (`--ease-editorial`) and a small set of entrance animations;
  all disabled under `prefers-reduced-motion`.

## Internationalisation

- `en` is the source of truth; `id` is typed against it, so a missing or renamed key fails the build.
- `useI18n()` exposes `t`, `locale`, `setLocale`, `formatNumber`, `formatDate`.
- Locale is persisted in `localStorage` (`uiuxpulse.locale`) and falls back to the browser language.
- `<html lang>` and `dir` are kept in sync; switch from the header, mobile drawer, or settings.

## Conventions

- No repeated one-off styling in pages: use the components in `components/ui`.
- Variants come from props (`tone`, `size`, `variant`), not from ad-hoc class strings.
- Pages never invent evaluation data — empty, loading, and error states are the honest default.
