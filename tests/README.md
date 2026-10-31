# Frontend test suite

Structural verification for a project that has no backend and no browser binary
in the build environment. Everything here runs against the **real** application
code — real router, real providers, real services, real `localStorage`-backed
stores — rendered into jsdom.

```bash
npm install --no-save jsdom   # not a project dependency on purpose
npm run test:frontend         # builds each suite, then runs it
```

## What this is, and is not

| Verified here | Not verified here |
| --- | --- |
| Every route renders, with exactly one `h1` | Pixel layout at 1440 / 768 / 390 |
| Redirects, guards, `?next=`, `?preview=demo` | Real browser paint, font loading |
| Form behaviour, validation, dialogs, Escape | Screen-reader output |
| Ownership and role isolation | Cross-browser behaviour |
| PDF bytes (`%PDF-`, `%%EOF`, page count) | Visual PDF appearance |
| Dictionary parity, placeholder parity | Translation quality |
| Structural responsive conditions | Computed geometry |

jsdom has no layout engine, so "no horizontal overflow" is asserted as the
*conditions* that cause overflow — no fixed width over 380px, long tokens carry
a break utility, tables are `table-fixed` or replaced by stacked cards, grids
start single-column — rather than by measuring a box. The suite says so in each
responsive assertion; it is not a substitute for a browser screenshot.

## Suites

| File | Covers |
| --- | --- |
| `suites/routes.tsx` | every route, redirects, gates, headings, console cleanliness |
| `suites/regression.tsx` | Phases 1–9 end to end: auth, sites, wizard, results, reports, PDF, admin |
| `suites/integrity.tsx` | ownership, data integrity, no credential exposure |
| `suites/i18n.ts` | dictionary key parity, missing keys, placeholder parity |
| `suites/a11y.tsx` | labels, dialogs, focus, tables, target sizes |
| `suites/responsive.tsx` | overflow conditions per surface |
