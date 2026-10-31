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
  enforces parity, currently 20 entries).
- Pip is a helper, never a gate: it must not cover the primary action on mobile, must be
  dismissible, closes on navigation and on Escape, and exposes its text through
  `role="status"`.
- **Dismissal must be reversible.** Hiding Pip leaves a compact "Show Pip" pill in the same
  corner (`guide.show`); clicking it clears the stored flag. Never return `null` from a
  hidden state — that strands the visitor with no way back except DevTools.
- The container is `position: fixed` with `pointer-events-none` on the wrapper, so it never
  intercepts clicks on the page beneath.
- The guide mounts through the pathless `GuideLayout`, never outside `RouterProvider` —
  it calls `useLocation()`.

**Developer credits.** The last section before the footer on public pages states who built
the product and why it exists (the "Purpose" block). Handles and URLs live in
`src/config/developers.ts` (content), while the labels are translation keys. There is
deliberately no tech-stack list or process manifesto here — the section is a credit and a
statement of intent, not marketing collateral. Brand marks are inline SVG in
`components/brand/SocialIcons.tsx` because lucide-react v1 no longer ships brand icons —
do **not** add a dependency for two glyphs. External profile links **must** carry
`target="_blank"` with `rel="noreferrer noopener"`, and every link **must** have a visible
handle plus an accessible "open profile" label.

**Public content modules.** Long-form bilingual copy for the public pages lives in
`src/content/` (`about.ts`, `howItWorks.ts`, `criteria.ts`), typed per locale and rendered by
the page — not in `locales/en.ts`. Reason: those pages carry nested lists (problems,
recommendations, workflow steps) that would turn the flat dictionaries into unreadable
mounds, and the copy has to stay in sync across two languages as structured data. Short
labels and buttons stay in the dictionaries; only the recognisably long-form prose moves.

**Evaluation criteria.** `src/content/criteria.ts` is the single source of truth for the six
categories (`criterionOrder` fixes the order). `/criteria` renders them; any future scoring
surface should import from there rather than restating the taxonomy. The copy is
deliberately illustrative — examples are labelled "Example" and the page states that no
formula is fixed and no analysis runs yet. **Never** describe a scoring formula or imply
automated analysis in this build.

**Start an evaluation gate.** Every "Start an evaluation" CTA renders
`components/layout/StartEvaluationLink`, which points at `/start` with
`?next=/app/evaluations`. `/start` redirects unauthenticated visitors to `/sign-in`
carrying the same `next`, while authenticated visitors go straight to the workspace. Do not
link a new CTA directly to `/sign-up` or `/app` — route it through the gate so the auth
requirement can never be bypassed by a copy-pasted link.

**Mock authentication.** `src/services/` holds the whole auth layer and is the only thing
the UI talks to:

| File | Role |
| --- | --- |
| `auth.types.ts` | `AuthUser`, payloads, `AuthResult<T>`, stored record shapes |
| `auth.storage.ts` | the **only** module that touches `localStorage` |
| `auth.service.ts` | register / login / logout / restoreSession / requestPasswordReset / resetPassword |
| `auth.context.tsx` | `AuthProvider` + `useAuth()`; owns `user`, `status`, `isAuthenticated` |
| `auth.context.types.ts` | the context contract, kept out of the provider file (Fast Refresh) |

Rules:

- **Passwords are never stored.** Accounts persist a salted SHA-256 digest
  (`email::password`) so a wrong password really fails, but SHA-256 is *not* a password
  hash — a real backend replaces `auth.service.ts`, it does not extend it.
- **Never claim this is authentication.** Every auth screen says the account lives in this
  browser; the sign-in/sign-up toasts say it again.
- Login failures return `invalidCredentials` for both an unknown email and a wrong
  password, and `requestPasswordReset` answers identically for unknown addresses, so no
  form can be used to enumerate accounts. The reset screen is the one exception: it must
  tell the visitor the address is unknown, because the next step is to sign in with it.
- The session is read **lazily in `useState`**, not in an effect, so a refresh lands on the
  right state on the first render and never flashes the wrong shell. `status` is `loading`
  only where there is no browser (SSR).
- The auth API is async and returns a discriminated `AuthResult`, so loading states already
  exist and a real `fetch` can drop in without touching components.

**Workspace data.** `services/workspace.service.ts` owns evaluation records under
`uiuxpulse.evaluations`, keyed by account id, and derives every dashboard total in
`summarise()`. Nothing writes to that store yet — there is no scanning engine — so the
overview honestly reports zero. **Never seed sample evaluations or scores** to make the
dashboard look populated; the counters and the recent list fill in on their own once
submission exists. `useWorkspace()` is the single reader, so the overview, the evaluations
list, and future report screens cannot disagree about what a total means.

**Profile management.** `services/auth.service.ts → updateProfile()` changes only `name`,
`email`, and `avatarUrl` on the stored account. The password digest and the session are left
alone, so saving a profile never signs anyone out; the session points at a stable account id
that is **not** derived from the email, precisely because the email can change. A second
account already using the address is rejected case-insensitively.

- `components/profile/EditProfileForm.tsx` is the one form, mounted in the dashboard dialog
  and the settings card. Do not create a second editor.
- `lib/avatar.ts` validates type (`png`/`jpeg`/`webp`) and size (≤2 MB), centre-crops to a
  square, and re-encodes to a 256px JPEG data URL before anything is persisted. It never
  uploads: `localStorage` is the only destination. Reject the file *before* reading it so a
  huge image never enters memory.
- `components/profile/UserAvatar.tsx` is the single avatar renderer: the pixel mascot stays
  the default, initials sit underneath for accessibility, and a custom photo replaces it
  everywhere (topbar, sidebar, settings, dashboard) because it reads from `useAuth()`.
- Every entry point — sidebar identity row, topbar menu, dashboard quick action, settings –
  opens the same dialog or form.

**Route guards.** `components/auth/RequireAuth.tsx` and `RedirectIfAuthenticated.tsx`.

- `RequireAuth` wraps the workspace and admin branches. It must sit **above** the layout
  route (`element: <RequireAuth />` → child `element: <DashboardLayout />`); putting it on
  the same node as the layout replaces the layout and its `Outlet`, which silently drops
  the whole shell.
- Unauthenticated access to `/app/**` or `/admin/**` redirects to `/sign-in?next=…` with
  the full destination (path, query, hash). After login the visitor is sent there.
- Signed-in visitors are bounced from `/sign-in`, `/register`, and `/forgot-password` to
  their `?next=` target or the dashboard. `/reset-password` stays reachable on purpose.
- `lib/redirect.ts` is the only place that validates a `?next=` destination — same-origin
  relative paths only, rejecting absolute, protocol-relative, and backslash forms.
- Logout navigates away **before** clearing the session, otherwise the guard redirects at
  the same moment and the two navigations race.

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

### ConfirmDialog (`components/ui/ConfirmDialog.tsx`)

- Wraps `Modal`; **anatomy:** title naming the exact object → consequence paragraph →
  optional warning → `Cancel` + destructive confirm.
- `tone="destructive"` is only for irreversible actions; the confirm label **must** be a verb
  phrase ("Delete website"), never "OK".
- The consequence text **must** state what survives the action (e.g. "its evaluation history
  is kept"), because the destructive button alone does not communicate it.
- Cancel is the first focusable element; Escape cancels.

### Wizard (`components/evaluations/`)

- **Anatomy:** step rail → one step per panel → sticky configuration aside →
  navigation row (`Back` / `Cancel` … primary action). The primary action is the
  last element in the row on mobile, first visually on desktop.
- **Step rail:** numbered, hairline-separated, `aria-current="step"`. Wraps to
  two columns below `sm` rather than scrolling horizontally.
- **Selection controls:** radios and checkboxes are visually replaced
  (`sr-only` input + styled span) but remain real inputs, so keyboard, screen
  reader, and form semantics are intact. The selected state is never colour-only —
  a check glyph and a border change carry it too.
- **Truthfulness rule:** any panel that could be mistaken for real analysis
  carries a visible label (`Demo data`, `Demonstration`, `No analysis performed`).
  Progress labels describe what the app does with the record, never what it does
  to the website.
- **Counters:** page counts always read `n / 10`, category counts `n / 6`. A limit
  is stated before it is hit, and the control that would exceed it is disabled
  rather than erroring after the fact.

### Website picker row (`WebsiteStep`)

- One row per site: icon, name, URL, date added, radio affordance.
- The whole row is the label; there is no separate "select" button, so the tap
  target is the full row on mobile.

### Results surfaces (`components/results/`)

- **Score gauge:** one SVG ring with a text readout — the arc is decoration, the
  number is the content. Bands are three (`strong | fair | weak`), not five, and
  each band is a plain statement about the design, never about the team.
- **Demo marking:** anything fixture-derived carries the same ochre `Demo data`
  chip plus one banner per section. Demo marking is *not* optional on results
  surfaces, and it is never reduced to a footnote.
- **Priority tone:** clay → ochre → taupe → neutral, hottest first. Colour is
  never the only signal; the badge always carries the word.
- **Findings:** a `<details>` disclosure per finding. The summary row must carry
  title, category, priority, assessment, and page, so the list is triageable
  without opening anything.
- **Evidence viewer:** fixed aspect-ratio placeholder, never an unrelated image.
  A screenshot region that is not a capture of the evaluated page would be
  fabricated evidence, which is worse than an empty state.
- **Progress indicators:** plain bars, not a second gauge — one score arc per
  screen, at the top.

### Report document surface (`components/reports/`)

- **One visual language, two materials.** The preview page is a *paper* surface
  on the app canvas: serif headings, hairline rules, generous leading, a single
  sage accent. It is not a dashboard, and it never borrows card shadows or
  gradients — an audit document should read like a document.
- **The preview must equal the export.** Sections, order, labels and numbers
  come from the same `ReportDocument` the PDF generator consumes, so the two can
  drift only by a rendering bug, not by design.
- **Score visualisation:** a ring plus the number in tabular figures, one per
  report. Priority counts are a plain legend, not a second chart.
- **Demo marking:** a clay cover band, a ribbon across the document, and the
  words `DEMO DATA` on every PDF page. It is never a footnote, never a
  low-contrast hint, and never absent from an exported file.
- **Disclaimers:** the configuration report says analysis has not been
  performed; the demo report says the data is illustrative. Both statements are
  in the document body *and* in the PDF, in the reader's own language.
- **Empty states:** an empty page list, category list or viewport list prints a
  sentence, never a blank gap. Nothing is invented to fill a section.

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
| `PublicLayout` | sticky header (blur after 12px scroll) → main → footer | desktop nav ≥1024px; below that a `MobileNavDrawer` **portalled to `document.body`** — inside the header it would inherit the sticky header's stacking context and any ancestor `overflow-hidden`/`backdrop-filter`, which silently breaks `position: fixed` scrolling |
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
