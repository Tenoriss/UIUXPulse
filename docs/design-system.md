# UIUXPulse — Design System

Implementation-ready rules for UIUXPulse, derived from the Nuria · Product Designer
reference and adapted to this product's own brand direction
(Editorial Minimalism + Subtle Claymorphism).

Companion documents: `README.md` (project setup) and
`src/styles/index.css` (the machine-readable source of every token).

---

## 1. Context and goals

**Intent, one sentence:** a calm, editorial evaluation workspace where large serif
typography carries hierarchy, warm paper surfaces replace dashboard chrome, and muted
sage signals action without ever competing with content.

| Item | Value |
| --- | --- |
| Product surface | Marketing pages + authenticated workspace (`/app`) + internal tools (`/admin`) |
| Audience | Authenticated users (design leads, founders) and internal operators |
| Target | WCAG 2.2 AA, keyboard-first, no hidden focus |
| Non-goal | Dense "generic SaaS dashboard" aesthetics; decorative gradients; heavy shadows |

**Product rule that outranks visual choice:** UIUXPulse only analyses and
recommends. It must never modify, redesign, or auto-fix an evaluated website. Copy and
UI must never imply automatic changes.

---

## 2. Design tokens and foundations

Tokens live in `src/styles/index.css` in two layers. Components **must** consume the
semantic layer and **must not** reference raw brand values.

### 2.1 Colour — semantic layer

| Semantic token | Value | Use | Contrast |
| --- | --- | --- | --- |
| `canvas` | `#F7F6F2` | Page background | — |
| `surface` | `#FCFBF8` | Cards, panels, inputs | — |
| `surface-muted` | `#EEECE5` | Secondary bands, skeletons | — |
| `ink` | `#292A25` | Primary text, dark buttons | 13.37:1 on canvas |
| `ink-soft` | `#55564E` | Body copy | 6.87:1 |
| `ink-muted` | `#6B6B63` | Tertiary text, captions, meta | 4.97:1 (AA) |
| `ink-faint` | `#A9A89F` | Placeholder, decorative icon, numerals ≥24px **only** | 2.21:1 — never body text |
| `sage-deep` | `#5B6A53` | Links, focus ring, primary accent text | 5.35:1 |
| `sage-ink` | `#47523F` | Text on sage wash | 7.00:1 |
| `sage` | `#A5B29A` | Decorative fills and borders only | 2.06:1 — never text |
| `line` / `line-strong` | `#E4E1D9` / `#D6D2C7` | Hairline borders | — |
| `clay-ink` | `#8A4A38` | Error copy and error icons | 6.23:1 |
| `clay` | `#A9715F` | Error fills / large text only | 3.72:1 |
| `taupe` | `#C8C0B3` | Decoration, admin accent | 1.67:1 — never text |

`color-scheme: light` is set explicitly; there is no dark theme yet, and adding one must
be done by overriding layer 2 only.

### 2.2 Typography

- `font.sans` = Inter Variable (body + UI) — weights 400/500/600.
- `font.serif` = Instrument Serif 400 (+ italic) — headings, numerals, editorial voice.
- Base: 16px / 400 / 1.7 line height on `body`.

| Utility | Size (fluid) | Leading | Use |
| --- | --- | --- | --- |
| `text-hero` | clamp 3rem → 7rem | 0.86 | One per page, marketing hero only |
| `text-display` | clamp 3.25rem → 6.75rem | 0.92 | Inner-page `h1` |
| `text-mega` | clamp 2.75rem → 4.75rem | 0.85 | Statistic numerals |
| `text-h1` … `text-h4` | 2.5–4.25rem → 1.375rem | 0.98–1.3 | Section headings |
| `text-lead` | clamp 1.0625 → 1.25rem | 1.65 | Intro paragraphs |
| `text-body` | 0.9375rem | 1.7 | Default body |
| `text-micro` | 0.75rem | 1.4 | Captions, meta, helper text (must be `ink-muted` or darker) |
| `eyebrow` utility | 0.6875rem, 0.16em tracking, uppercase | — | Section labels |

**Rules**

- Headings **must** use `font-serif`; body and all UI **must** use `font-sans`.
- A page **must** contain exactly one `h1`.
- Serif headings **must not** be used below 20px.
- `text-micro` **must** use `ink-muted`, `ink-soft`, or `ink` — never `ink-faint`.

### 2.3 Spacing, radius, elevation, motion

| Family | Tokens |
| --- | --- |
| Spacing | 4px base scale; section rhythm via `--spacing-section` (7rem) / `--spacing-section-lg` (10rem) |
| Radius | `xs` 6 · `sm` 8 · `md` 12 · `lg` 16 · `xl` 22 · `2xl` 28 · `pill` 999 (pill **only** for buttons, badges, chips) |
| Elevation | `shadow-hairline`, `shadow-soft`, `shadow-clay` (default card), `shadow-clay-lg` (modal/menu), `shadow-clay-pressed` (inputs) |
| Motion | `--duration-instant` 150ms · `--duration-quick` 250ms · `--duration-calm` 400ms · `--ease-editorial` |
| Focus | `:focus-visible` → 2px `sage-deep` outline, 3px offset, never removed |

All animation **must** collapse under `prefers-reduced-motion: reduce` (already global).

---

## 3. Component rules

Shared acceptance criteria for **every** component: required states are
default / hover / focus-visible / active / disabled / loading / error where applicable;
targets **must** be ≥24×24px (2.5.8); long content **must** wrap or truncate
deliberately, never overlap.

### Button (`components/ui/Button.tsx`)

- **Anatomy:** optional leading icon → label → optional trailing icon; `IconButton` is label-only via `aria-label` + `title`.
- **Variants:** `dark` (primary), `sage` (confirm), `neutral` (secondary), `outline`, `ghost`, `destructive`.
- **Sizes:** `sm` 36px, `md` 44px, `lg` 52px tall; `iconOnly` is square at 36/44/52.
- **States:** hover shifts surface/border only; `active` translates 1px down; `loading` swaps the leading icon for a spinner, sets `aria-busy`, and disables the control; `disabled` at 45% opacity with `pointer-events: none`.
- **Keyboard:** native `button`, Space/Enter activate, focus ring via `:focus-visible`.
- **Rules:** exactly one `dark` button per view region; label **must** be a verb phrase ("Start an evaluation", not "Go"); icon-only buttons **must** have `label`.

### Input / Textarea / Checkbox / Field

- **Anatomy:** label row (label + optional marker) → control → hint **or** error (error wins).
- **States:** hover border `line-strong`; focus `sage` border + 2px `sage/35` ring; error `clay/60` border + `clay-ink` message with `role="alert"`; disabled muted fill at 50%.
- **Accessibility:** every control **must** have a programmatic label (`htmlFor`/`id` auto-paired via `useId`); errors **must** set `aria-invalid` and be announced; the error message **must** reach 4.5:1 (`clay-ink`).
- **Content:** hints and errors **must** be one short sentence; textarea **must** be resizable vertically.

### Card

- **Variants:** `surface` (default, clay shadow), `muted` (no shadow), `flush` (border only).
- **Rules:** `interactive` (hover lift) **must** only be used when the whole card is clickable; padding `sm|md|lg` — no ad-hoc padding.

### Badge / IndexBadge

- Display-only, non-interactive (may sit below 24px). Tones: `neutral`, `sage`, `taupe`, `clay`, `ochre`.
- A badge **must not** be the only way to convey state in a form.

### Modal

- **Anatomy:** overlay → panel → eyebrow/title/description → body → footer actions.
- **Behaviour:** portal to `body`; `role="dialog"` + `aria-modal`; initial focus moves into the panel; focus is trapped with Tab/Shift+Tab; Escape and overlay click close unless `dismissible=false`; focus returns to the trigger; body scroll locked.
- **Responsive:** bottom sheet below 640px, centred panel above.
- **Content:** body scrolls independently; footer stays visible.

### Dropdown

- `role="menu"`/`menuitem`, `aria-expanded` + `aria-controls` on the trigger.
- **Keyboard:** Enter/Space/↓ open, ↑/↓ cycle, Home/End jump, Tab closes, Escape closes and returns focus.
- Items **must** truncate long labels and keep the icon column fixed.

### Tabs

- `role="tablist"` with arrow-key navigation and roving `tabindex`; each panel is labelled by its tab.
- Variants: `underline` (editorial default), `pill` (dense panels). Counts render as non-interactive numerals.

### Toast

- `role="status"` + `aria-live="polite"`; auto-dismiss default 5000ms, `duration: 0` pins it; max 4 visible; dismiss button ≥32px with accessible name.
- **Rules:** toasts **must not** carry the only copy of an error — the inline error **must** also exist.

### Loading / Empty / Error states

- `LoadingState` sets `aria-busy` and shows a spinner plus skeleton rows; skeletons **must** mirror the final layout roughly.
- `EmptyState` states what will appear and offers exactly one primary action.
- `ErrorState` gives a retry and keeps the surrounding shell usable.
- **Rules:** pages **must not** invent data to avoid an empty state; empty states are the honest default in this phase.

### Layouts

| Layout | Structure | Responsive |
| --- | --- | --- |
| `PublicLayout` | sticky header (blur after 12px scroll) → main → footer | desktop nav ≥1024px; drawer below, scroll-locked, Escape closes, closes on navigation |
| `AuthLayout` | form column + editorial aside | aside hidden <1024px; single column, max 24rem form |
| `DashboardLayout` | fixed sidebar 256px + sticky topbar + content | sidebar becomes slide-over drawer <1024px |
| `AdminLayout` | same shell, taupe accent, "restricted" marker | same as dashboard |

Navigation items **must** live in `src/config/navigation.ts`; labels are translation
keys, never literals.

---

## 4. Accessibility — testable acceptance criteria

| # | Requirement | How to verify |
| --- | --- | --- |
| A1 | Body text ≥4.5:1, large text ≥3:1 | Recompute pair table in §2.1; any `text-micro` using `ink-faint` is a failure |
| A2 | Focus is always visible | Tab through every page: every interactive element shows the 2px sage-deep outline with offset |
| A3 | No keyboard traps | Open modal/menu, Tab cycles inside; Escape exits and returns focus to trigger |
| A4 | Targets ≥24×24px | Inspect `IconButton` (36px), toast close (32px), password reveal (36px) |
| A5 | Forms are labelled and announced | Submit empty form: `aria-invalid` set, message read by screen reader, focus moved to first error |
| A6 | Language is declared and switchable | `<html lang>` matches `locale`; toggling EN↔ID updates it without reload |
| A7 | Motion respects preference | Emulate `prefers-reduced-motion`: all transitions ≤0.01ms |
| A8 | One `h1` per page, logical heading order | DOM inspection per route |
| A9 | Skip link present and functional | First Tab on public pages reveals "Skip to content" |

---

## 5. Content and tone

- Voice: concise, confident, implementation-focused. Sentence case. British spelling in EN copy (`prioritise`, `artefact`).
- Buttons: verb + object ("Start an evaluation", "Submit a URL"). Never "Go", "Click here", "Learn more" alone.
- Errors: state what happened and what to do next, without blame ("Enter a valid email address.").
- Empty states: present tense, no exclamation marks, no fabricated counts.
- Never imply the product edits the site: use "evaluate", "recommend", "suggest" — never "fix automatically", "redesign", "apply changes".
- **Example (good):** "Recommendations are ordered by impact and effort."
- **Example (bad):** "Let our AI fix your website instantly!"

---

## 6. Anti-patterns and prohibited implementations

- ❌ Raw hex values inside components — resolve through semantic utilities.
- ❌ Removing focus outlines or replacing them with colour-only change.
- ❌ `ink-faint`, `sage`, or `taupe` for body copy or micro text.
- ❌ One-off font sizes, spacings, radii, or shadows that are not in §2.
- ❌ Pill radius on cards, panels, or inputs (pill is for buttons/badges only).
- ❌ Heavy drop shadows or gradients used as decoration.
- ❌ Numeric scores or evaluation results invented as placeholder content.
- ❌ Copy that suggests UIUXPulse modifies the evaluated site.
- ❌ Card grids where the reference rhythm calls for numbered hairline rows.

---

## 7. QA checklist

- [ ] `npm run typecheck` clean, `npm run build` clean.
- [ ] Every colour pair used for text passes A1.
- [ ] Tab order is logical on all four layouts; A2/A3 pass.
- [ ] Every interactive target ≥24×24px (A4).
- [ ] Forms announce errors and move focus (A5).
- [ ] EN and ID both render without missing-key warnings in console.
- [ ] No console errors on any route, including `/nope` and `/app/nope`.
- [ ] Reduced-motion emulation shows no animation (A7).
- [ ] No raw hex in `src/components/**`.
- [ ] Empty/loading/error states reachable and readable, with no fake data.

---

## Scope note: why some reference values were not adopted verbatim

The Nuria extraction describes a **dark** site (`surface.base=#000000`,
`text.primary=#f0e9f0`, `text.secondary=#0000ee`). UIUXPulse's brief mandates the warm
paper palette (`#F7F6F2` canvas, `#292A25` ink) with sage accents, so the palette is
**not** ported. What is ported is the structural language: oversized serif display type,
numbered hairline rows, numeral stat bands, and a 12/16px-plus radii family.

Two further deviations, both deliberate:

- **Type scale.** The extracted `4xl=60px` is a layout constant, not a heading size, and
  the reference's display headings are far larger. Fluid `text-hero`/`text-display`
  ranges are used instead of a fixed 60px.
- **Contrast corrections.** The extracted palette yields a 3.44:1 tertiary text colour,
  which fails the AA target the same spec demands. `ink-muted` was darkened to
  `#6B6B63` (4.97:1) and error text moved to `clay-ink` (6.23:1). Where spec and AA
  conflict, AA wins.
