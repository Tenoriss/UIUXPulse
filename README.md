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
| Fonts      | Instrument Serif + Inter Variable (self-hosted via Fontsource) |

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
├── config/            site routes + navigation trees
├── hooks/             useMediaQuery, useDismissable, useLockBodyScroll, useScrolled, useMounted
├── i18n/              provider, typed dictionaries (en/id), translate helpers
├── layouts/           PublicLayout, AuthLayout, DashboardLayout, AdminLayout
├── lib/               cn (class composition), validation
├── pages/             public/ auth/ dashboard/ admin/ errors/
├── providers/         ToastProvider
├── styles/            index.css — design tokens, base layer, keyframes, utilities
└── types/             ui.ts, navigation.ts
```

## Design system documentation

Behavioural and accessibility rules (component states, keyboard contracts, contrast
requirements, anti-patterns, QA checklist) live in [`docs/design-system.md`](docs/design-system.md).
That document is the contract; this README only covers setup.

## Design tokens

All tokens live in `src/styles/index.css` under `@theme`, so every value is both a CSS
variable and a Tailwind utility.

- **Palette** — `canvas #F7F6F2`, `surface #FCFBF8`, `surface-muted #EEECE5`,
  `ink #292A25`, `ink-muted #85857D`, `sage #A5B29A`, `sage-deep #65735C`,
  `taupe #C8C0B3`, `line #E4E1D9`, plus muted clay/ochre feedback tones.
- **Type** — `font-serif` (Instrument Serif) for editorial headings, `font-sans` (Inter) for UI.
  Fluid display scale: `text-display`, `text-h1…h4`, `text-lead`, `text-body`, `text-micro`, `eyebrow`.
- **Radius** — `xs … 2xl` plus `pill` (used only for buttons, badges, and chips).
- **Depth** — `shadow-soft`, `shadow-clay`, `shadow-clay-lg`, `shadow-clay-pressed`: soft inner
  highlight + long, low-opacity ambient shadow (claymorphism, never heavy drop shadows).
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
