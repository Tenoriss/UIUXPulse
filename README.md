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

Authentication is a **frontend mock**: signing in or up writes a single `localStorage` flag
and returns the visitor to the `?next=` destination, defaulting to the workspace. There is
no backend, no real session, and no password handling beyond form validation.

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
