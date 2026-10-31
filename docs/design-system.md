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
| `canvas` | `#111110` | Page background | — |
| `surface` | `#191917` | Cards, panels | — |
| `surface-muted` | `#21211E` | Secondary bands, skeletons | — |
| `surface-sunken` | `#0C0C0B` | Input wells, recessed clay | — |
| `ink` | `#F3F1EA` | Primary text, light buttons | 16.72:1 on canvas |
| `ink-soft` | `#C6C4BA` | Body copy | 10.80:1 |
| `ink-muted` | `#9C9A90` | Tertiary text, captions, meta | 6.69:1 (AA) |
| `ink-faint` | `#6E6C64` | Placeholder, decorative icon, numerals ≥24px **only** | 3.59:1 — never body text |
| `sage-deep` | `#8FA084` | Links, focus ring, accent text | 6.77:1 |
| `sage-ink` | `#D3DEC7` | Text on sage wash | 13.53:1 |
| `sage` | `#A5B29A` | Decorative fills, logo halo only | 9.09:1 — decoration |
| `sage-wash` | `#1C221A` | Tinted surface | — |
| `line` / `line-strong` | `#2A2A26` / `#3A3A34` | Hairline borders | — |
| `clay-ink` | `#E5A492` | Error copy and error icons | 9.05:1 |
| `clay` | `#C98A76` | Error fills | — |
| `taupe` | `#C8C0B3` | Decoration, admin accent | — |

`color-scheme: dark` is set explicitly. There is one theme; a light variant would be added
by overriding the `--brand-*` layer only.

> **Implementation pitfall (already hit once).** Tailwind v4 generates utilities for
> colour names registered in `@theme`. Declaring `--color-*` in `:root` instead produces
> **no utilities at all** — `bg-surface` silently disappears and the UI renders unstyled.
> The semantic layer must stay inside the `@theme` block, aliasing `--brand-*`.

### 2.2 Typography

- `font.sans` = **Plus Jakarta Sans Variable** (body + UI) — weights 400/500/600/700.
- `font.serif` = **Fraunces Variable** with `SOFT 60 / opsz 48` — headings, numerals,
  editorial voice; always `font-medium` (500) or heavier so the soft axis reads.
- `font.display` = **Bricolage Grotesque Variable** — poster display, eyebrows, labels,
  and the uppercase hero line.
- Base: 16px / 400 / 1.7 line height on `body`.

Fonts **must** be self-hosted through Fontsource (no runtime Google Fonts request):
`@fontsource-variable/fraunces/soft.css`, `.../soft-italic.css`,
`@fontsource-variable/bricolage-grotesque`, `@fontsource-variable/plus-jakarta-sans`.

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
| Elevation | `clay-surface` (raised panel), `clay-inset` (recessed well/input), `shadow-hairline`, `shadow-soft`, `shadow-clay`, `shadow-clay-lg`, `shadow-clay-pressed` |
| Motion | `--duration-instant` 150ms · `--duration-quick` 250ms · `--duration-calm` 400ms · `--ease-editorial` |
| Focus | `:focus-visible` → 2px `sage-deep` outline, 3px offset, never removed |

All animation **must** collapse under `prefers-reduced-motion: reduce` (already global).

**Claymorphism rule (pronounced).** Clay depth is built from three cues together, never a
single shadow:

1. **Lip** — `inset 0 1px 0 rgba(255,255,255,0.11)` on the top edge plus
   `inset 0 -2px 3px rgba(0,0,0,0.55)` underneath, so the slab looks pressed from putty.
2. **Putty gradient** — a vertical `linear-gradient` from ~7% white at the top to ~8% black
   at the bottom (`clay-surface`), which simulates a curved, light-catching surface.
3. **Ambient separation** — two stacked, very low-opacity, wide shadows.

Utilities: `clay-surface` (cards, buttons, tiles), `clay-surface-lg` (modals, hero panels,
menus), `clay-inset` (inputs, tab tracks, wells). Raised objects **must** use
`border-white/[0.06..0.08]` rather than `border-line`, because a warm grey hairline reads
as dirt against a lifted surface.

**Page guide (Pip).** Two characters share the pixel style: the site mascot in the header,
and **Pip**, the guide that explains each page. Pip lives bottom-right as a 56px clay
button; opening it reveals one short explanation, an optional action, and a "hide" control
that persists in `localStorage` (`uiuxpulse.guide.hidden`).

Rules:

- Copy lives in `src/content/guide.ts`, not in the i18n dictionaries, because it needs
  named props; **every** route must have an entry in **both** `en` and `id` (a smoke check
  enforces parity, currently 17 entries).
- Pip is a helper, never a gate: it must not cover the primary action on mobile, must be
  dismissible, closes on navigation and on Escape, and exposes its text through
  `role="status"`.
- The container is `position: fixed` with `pointer-events-none` on the wrapper, so it never
  intercepts clicks on the page beneath.
- The guide mounts through the pathless `GuideLayout`, never outside `RouterProvider` —
  it calls `useLocation()`.

**Developer credits.** The last section before the footer on public pages lists who built
the product. Handles and URLs live in `src/config/developers.ts` (content), while the
labels are translation keys. Brand marks are inline SVG in
`components/brand/SocialIcons.tsx` because lucide-react v1 no longer ships brand icons —
do **not** add a dependency for two glyphs. External profile links **must** carry
`target="_blank"` with `rel="noreferrer noopener"`, and every link **must** have a visible
handle plus an accessible "open profile" label.

**Pixel mascot.** The product mascot is a pixel sprite cropped from its source artwork to
a transparent PNG (`avatar-hero.png` 512², `avatar-tile.png` 192²). It **must** be rendered
with `image-rendering: pixelated`, **must** sit on a `clay-surface-lg` disc (`ClayAvatar`),
and **must not** be recoloured or blurred.

**Floating icon field.** Hero decoration uses `FloatingIcon`, a slow buoyant translate
with a 2° rotation change (`animate-float*`), each tile staggered by `delay` and given its
own `--icon-rotate`. Tiles **must** be `aria-hidden` (decorative) unless they carry a
`label`. The field **must** hide below `md` and animate at most ±14px.

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
| A1 | Body text ≥4.5:1, large text ≥3:1 | Recompute pair table in §2.1; any `text-micro` using `ink-faint` is a failure. On the dark palette: ink 16.72, ink-soft 10.80, ink-muted 6.69, sage-deep 6.77, clay-ink 9.05, ochre-ink 9.46 — all on `#111110` |
| A2 | Focus is always visible | Tab through every page: every interactive element shows the 2px sage-deep outline with offset |
| A3 | No keyboard traps | Open modal/menu, Tab cycles inside; Escape exits and returns focus to trigger |
| A4 | Targets ≥24×24px | Inspect `IconButton` (36px), toast close (32px), password reveal (36px) |
| A5 | Forms are labelled and announced | Submit empty form: `aria-invalid` set, message read by screen reader, focus moved to first error |
| A6 | Language is declared and switchable | `<html lang>` matches `locale`; toggling EN↔ID updates it without reload |
| A7 | Motion respects preference | Emulate `prefers-reduced-motion`: all transitions ≤0.01ms, floating icons stop |
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
- ❌ Declaring `--color-*` tokens outside `@theme` (silently removes every colour utility).
- ❌ Flat surfaces on a dark canvas: raised or recessed is always chosen deliberately.
- ❌ Extra illustration/icons added purely to fill space in hero or dashboard areas.
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
- [ ] Every colour utility present in the built CSS (`bg-surface`, `text-ink-muted`, …) —
      check after any token edit.
- [ ] Raised vs recessed clay chosen per §2.3 in every new surface.
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
