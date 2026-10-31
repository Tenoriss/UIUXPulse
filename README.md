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
| PDF        | jsPDF 4.2.1 (client-side report export)       |

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
│   ├── reports/       ReportDocumentView (paper preview), ReportUnavailable
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

## Evaluation workflow

`/app/evaluations/new` is a four-step configuration wizard; `/app/evaluations`
lists saved configurations and `/app/evaluations/:id` reads one back. All three
sit behind the existing auth guard.

1. **Website** — one of your registered sites. A website's *Start evaluation*
   link supplies it as `?website=<id>`, so that entry point lands pre-filled.
2. **Pages** — manual entry or the example-path picker. 1–10 pages, each
   validated against the website's own host, compared scheme-less for
   duplicates.
3. **Settings** — the six categories (names and summaries reused from
   `content/criteria.ts`) and the three viewports: 1440, 768, 390.
4. **Review** — the whole configuration, with a link back into the step that
   owns each part.

Saving is simulated in four visible steps and writes **one** record through
`services/evaluation.service.ts` into `uiuxpulse.evaluations` — the same key the
dashboard has read since Phase 4. The draft itself lives in the URL (`?website=`,
`p_0=`, `categories=`, `viewports=`), so an abandoned wizard leaves nothing in the
store and never reaches a dashboard total.

A record stores the owner, the website id, **snapshots** of the website name and
URL, the page list, categories, viewports, a creation timestamp, and the status
`created`. There is no score field in practice, no findings, and no analysis:
`created` means "configuration saved", and the UI says so on the review screen,
the progress screen, the success screen, and the detail page.

Deleting a website keeps its evaluations; they lose `websiteId`, keep the name
snapshot, and are labelled *Removed website* in the list, filterable separately.

## Results and recommendations (demo only)

`/app/evaluations/:id/results`, `.../audit` and `.../recommendations` present the
results interface. **No analysis engine exists**, so every one of those screens
renders fixture data behind an explicit `?preview=demo` opt-in, under a banner
that says so. Without the flag the section shows "Results are not available yet"
and names the reason.

- `services/evaluation-results.fixtures.ts` — a fixed, deterministic set: ten
  findings, ten recommendations, six category scores. No dates, no randomness.
- `services/evaluation-results.service.ts` — read-only. It resolves fixture
  paths onto the evaluation's **own** saved pages, derives the overall score as
  the mean of the six categories, and derives the priority counts from the
  finding list. It never writes, so opening a preview cannot change a record.
- `content/demoResults.ts` — the bilingual copy for every finding and
  recommendation, keyed by the same ids, so a missing translation is a type error.

Safeguards that keep previews from being mistaken for results:

- every demo id is prefixed `demo-`;
- `hasRealResults()` is the single switch, and it is `false` for every record;
- records keep `status: 'created'` and never gain an `overallScore`;
- findings carry `evidence: { kind: 'none' }` — there is no screenshot anywhere,
  and the evidence viewer shows a placeholder rather than stock imagery;
- the demo data lives in no store at all, so it cannot overwrite or collide with
  a saved evaluation.

## Reports and PDF export

`/app/evaluations/:id/report` previews a report; `/app/reports` lists every saved
evaluation with its available report. Both sit behind the existing auth and
ownership checks, and neither adds a second results store.

Two report modes, and they are not interchangeable:

- **Configuration report** — for any saved (`status: 'created'`) evaluation.
  Documents the website, evaluation id, creation date, selected pages,
  categories and viewports, and states plainly that no analysis has been
  performed. It has no score, no findings, and no recommendations, because
  there is nothing behind such a number.
- **Demo results report** — only opened through an explicit
  `?preview=demo`, and only when the caller passes `demoAuthorised`. It reads
  the existing demo set from `evaluation-results.service.ts`, carries a DEMO
  cover band on the preview and on every PDF page, and is never mixed with a
  real record.

- `services/report.types.ts` — the report model. A discriminant union
  (`facts | groups | score | table | findings | recommendations | callout`)
  means a configuration report cannot contain a score section without a type
  error.
- `services/report.service.ts` — assembles a `ReportDocument` from the
  evaluation record and, for demo mode, from the Phase 7 fixtures. It only
  reads; generating a report never writes a record, a status, or a timestamp.
  `getReport()` returns `null` for a missing or foreign id **and** for demo mode
  without authorisation, so the failure mode is "no report", never a demo report
  wearing a real record's identity.
- `services/report-generator.ts` — client-side PDF via **jsPDF 4.2.1**
  (`npm audit` reports zero vulnerabilities for this release; 3.x is unusable).
  Real A4 pages, real embedded text metrics, page numbers on every page after
  the cover, and a downloaded filename of the form
  `uiuxpulse-<website>-<id>.pdf` (prefixed `demo-` for demo reports).

Layout: cover → contents → §1 Evaluation overview → §2 Evaluation configuration
→ (demo only) §3 Overall results → §4 Category scores → §5 Detailed findings →
§6 Recommendations → disclaimer. Every section flows through one cursor that
starts a new page before writing past the bottom margin, so long URLs and long
finding copy wrap instead of clipping.

Limits of client-side PDF worth knowing: jsPDF's built-in fonts are WinAnsi, not
Unicode. `sanitise()` transliterates typographic punctuation and degrades
anything outside Latin-1 to `?` rather than emitting a NUL that would corrupt
the surrounding text run. The preview and the PDF therefore show the same
characters for Latin-script content, and a script outside Latin-1 is documented
as unsupported rather than silently garbled.

## Websites

Registered sites live in their own store (`uiuxpulse.websites`, keyed by owner id),
managed through `services/website.service.ts` — the only place that reads or writes it.
Routes: `/app/websites`, `/app/websites/new`, `/app/websites/:id`,
`/app/websites/:id/edit`, all behind the existing auth guard.

- **Normalisation** (`lib/url.ts`): a bare domain gains `https://`; the host is lowercased
  and stripped of `www.`; a trailing slash and the fragment are dropped; **path and query
  are preserved**, so `/shop` and `/` are different records. The stored URL keeps its
  scheme, but duplicate detection compares scheme-less keys (`urlKey`), so `http://studio.com`
  cannot be registered next to `https://studio.com`.
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
