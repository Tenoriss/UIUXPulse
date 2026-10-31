import { createRoot } from 'react-dom/client';
import { startTransition } from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { act } from 'react';
import { I18nProvider } from '@/i18n';
import { ToastProvider } from '@/providers/ToastProvider';
import { AuthProvider } from '@/services/auth.context';
import { appRoutes } from '@/router/routes';
import { clearDemoData, login, register } from '@/services/auth.service';
import { DEMO_ADMIN } from '@/services/auth.service';
import { addWebsite } from '@/services/website.service';
import { createEvaluation } from '@/services/evaluation.service';

let fails = 0;
let passes = 0;
const ok = (l: string, c: boolean, e = '') => { c ? passes++ : fails++; if (!c) console.log(`FAIL  ${l}${e ? ' — ' + e : ''}`); };
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

let router: any = null;
let root: any = null;
function mount(initial: string) {
  if (root) act(() => root.unmount());
  document.body.innerHTML = '<div id="root"></div>';
  router = createMemoryRouter(appRoutes, { initialEntries: [initial] });
  root = createRoot(document.getElementById('root')!);
  act(() => {
    startTransition(() => {
      root.render(<I18nProvider><ToastProvider><AuthProvider><RouterProvider router={router} /></AuthProvider></ToastProvider></I18nProvider>);
    });
  });
}
const path = () => router.state.location.pathname;
const click = (el: Element | null | undefined, what: string) => {
  if (!el) throw new Error(`not found: ${what}`);
  // Awaited inside act: a bare act() around a handler that navigates leaves an
  // outer async scope open and the next commit is swallowed.
  return act(async () => { (el as HTMLElement).click(); });
};
const pressEscape = () => {
  act(() => {
    document.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
  });
};
const byText = (label: string, sel = 'button, a') =>
  [...document.querySelectorAll(sel)].find((n) => (n.textContent ?? '').trim().includes(label)) as HTMLElement | undefined;

const run = async () => {
  clearDemoData();
  window.localStorage.removeItem('uiuxpulse.locale');
  const user = await register({ name: 'Nadia Pratama', email: 'nadia@studio.test', password: 'rahasia123' });
  const me = user.ok ? user.data.id : '';
  const site = await addWebsite(me, { name: 'Studio Aria', url: 'studio-aria.example.com', description: '' });
  const siteId = site.ok ? site.data.id : '';
  const evaluation = await createEvaluation(me, {
    websiteId: siteId,
    pages: ['https://studio-aria.example.com/about'],
    categories: ['typography'],
    viewports: ['desktop'],
  });
  const evalId = evaluation.ok ? evaluation.data.id : '';

  console.log('=== DIALOG & KEYBOARD ===');
  mount('/app/websites');
  await act(async () => { await sleep(80); });

  // Open the delete confirmation and exercise Escape + cancel.
  // The card's delete control is icon-only and named via aria-label.
  const deleteButton = document.querySelector('button[aria-label^="Delete"], button[aria-label*="Hapus"]');
  ok('tombol hapus situs ada', Boolean(deleteButton));
  await click(deleteButton, 'delete');
  await act(async () => { await sleep(80); });
  const dialog = document.querySelector('[role="dialog"]');
  ok('dialog konfirmasi terbuka', Boolean(dialog));
  ok('dialog punya aria-modal', dialog?.getAttribute('aria-modal') === 'true');
  ok('dialog punya judul tereferensi', Boolean(dialog?.getAttribute('aria-labelledby')));
  ok('fokus pindah ke dalam dialog', Boolean(dialog?.contains(document.activeElement)), document.activeElement?.tagName ?? '');
  pressEscape();
  await act(async () => { await sleep(80); });
  ok('Escape menutup dialog', !document.querySelector('[role="dialog"]'));

  console.log('\n=== TAB ORDER & FOKUS ===');
  mount('/sign-in');
  await act(async () => { await sleep(70); });
  const focusables = [
    ...document.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'),
  ] as HTMLElement[];
  ok('halaman masuk punya elemen fokus', focusables.length > 3, String(focusables.length));
  ok('tidak ada tabindex positif', focusables.every((el) => Number(el.getAttribute('tabindex') ?? 0) <= 0));
  // Structural only: jsdom cannot compute layout, so assert that every control
  // carries an explicit height utility (>= h-9 = 36px, clearing WCAG 2.5.8).
  // Height, padding or min-height all produce a real target; a control with
  // none of them cannot clear the 24px minimum on its text alone.
  const sized = (el: Element) =>
    /\bh-(8|9|10|11|12|13|14)\b|\bsize-(8|9|10|11|12|13|14)\b|\bmin-h-(8|9|10|11|12)\b|\bpy-(2|2\.5|3|3\.5|4)\b/.test(
      el.className,
    );
  const heightless = (root: ParentNode) => [...root.querySelectorAll('button')].filter((b) => !sized(b));
  ok('tidak ada tombol tanpa tinggi eksplisit di /sign-in', heightless(document).length === 0,
    heightless(document).map((b) => (b.textContent ?? '').trim().slice(0, 12)).join(' | '));
  for (const route of ['/', '/app', '/criteria', '/app/reports']) {
    mount(route);
    await act(async () => { await sleep(70); });
    const bad = heightless(document);
    ok(`${route}: tombol punya tinggi eksplisit`, bad.length === 0,
      bad.map((b) => (b.textContent ?? '').trim().slice(0, 14)).join(' | '));
  }

  console.log('\n=== SKIP LINK ===');
  mount('/');
  await act(async () => { await sleep(60); });
  const skip = document.querySelector('a[href="#main-content"]');
  ok('skip link ada di halaman publik', Boolean(skip));
  ok('target skip link ada', Boolean(document.querySelector('#main-content')));

  mount('/app');
  await act(async () => { await sleep(70); });
  ok('area aplikasi punya main-content', Boolean(document.querySelector('#main-content')));

  console.log('\n=== STATUS & LIVE REGION ===');
  mount('/app/websites/new');
  await act(async () => { await sleep(70); });
  const form = document.querySelector('form');
  ok('form situs punya label', Boolean(form) && [...form!.querySelectorAll('input, textarea')].every((el) => Boolean(el.labels?.length)));
  const submit = byText('Add website', 'button') ?? byText('Save', 'button');
  ok('tombol simpan ada', Boolean(submit));

  // Validation feedback must be announced, not only coloured.
  await click(submit, 'submit');
  await act(async () => { await sleep(120); });
  const invalid = document.querySelector('[aria-invalid="true"]');
  ok('input tidak sah ditandai aria-invalid', Boolean(invalid));
  ok('pesan galat memakai role alert atau describedby',
    Boolean(document.querySelector('[role="alert"]')) || Boolean(invalid?.getAttribute('aria-describedby')),
    invalid?.getAttribute('aria-describedby') ?? 'no alert');

  console.log('\n=== TABEL: SEMANTIK ===');
  await login({ email: DEMO_ADMIN.email, password: DEMO_ADMIN.password });
  for (const route of ['/admin/users', '/admin/evaluations']) {
    mount(route);
    await act(async () => { await sleep(80); });
    const table = document.querySelector('table');
    ok(`${route} tabel punya caption`, Boolean(table?.querySelector('caption')));
    ok(`${route} semua th punya scope`, [...(table?.querySelectorAll('th') ?? [])].every((th) => th.getAttribute('scope')));
    ok(`${route} tanpa gambar tanpa alt`, [...document.querySelectorAll('img')].every((img) => img.hasAttribute('alt')));
  }

  console.log('\n=== GAMBAR & IKON ===');
  await login({ email: 'nadia@studio.test', password: 'rahasia123' });
  mount(`/app/evaluations/${evalId}/results?preview=demo`);
  await act(async () => { await sleep(90); });
  ok('semua img punya atribut alt', [...document.querySelectorAll('img')].every((img) => img.hasAttribute('alt')));
  ok('tidak ada bukti tangkapan layar palsu', document.querySelectorAll('figure img, main img').length === 0);
  ok('advance ke audit tetap demo', (() => {
    const link = [...document.querySelectorAll('a')].find((a) => a.getAttribute('href')?.includes('/audit'));
    return Boolean(link) && (link!.getAttribute('href') ?? '').includes('preview=demo');
  })());

  console.log(`\n=== KEYS: ${passes} PASS / ${fails} FAIL ===`);
  process.exit(fails === 0 ? 0 : 1);
};

run().catch((e) => { console.error('HARNESS ERROR', e); process.exit(1); });
