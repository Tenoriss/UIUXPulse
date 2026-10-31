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
import { createEvaluation, getEvaluation } from '@/services/evaluation.service';

let fails = 0;
let passes = 0;
const ok = (l: string, c: boolean, e = '') => { c ? passes++ : fails++; if (!c) console.log(`FAIL  ${l}${e ? ' — ' + e : ''}`); };
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

let router: any = null;
let root: any = null;

/** Mount a router at a deep URL, the way a browser refresh does. */
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
const search = () => router.state.location.search;
const clickAct = async (el: Element | null | undefined) => {
  if (!el) throw new Error('element not found');
  await act(async () => { (el as HTMLElement).click(); });
};
const main = () => document.querySelector('main')?.textContent?.replace(/\s+/g, ' ') ?? '';

const run = async () => {
  clearDemoData();
  window.localStorage.removeItem('uiuxpulse.locale');
  const user = await register({ name: 'Nadia Pratama', email: 'nadia@studio.test', password: 'rahasia123' });
  const me = user.ok ? user.data.id : '';
  const site = await addWebsite(me, { name: 'Studio Aria', url: 'studio-aria.example.com', description: '' });
  const siteId = site.ok ? site.data.id : '';
  const evaluation = await createEvaluation(me, {
    websiteId: siteId,
    pages: ['https://studio-aria.example.com/about', 'https://studio-aria.example.com/pricing'],
    categories: ['typography', 'accessibility'],
    viewports: ['desktop', 'mobile'],
  });
  const evalId = evaluation.ok ? evaluation.data.id : '';

  console.log('=== DEEP LINK / MUAT ULANG ===');
  // A refresh on a nested route means "mount the router straight at that URL".
  for (const route of [
    '/app/evaluations', `/app/evaluations/${evalId}`, `/app/evaluations/${evalId}/report`,
    `/app/websites/${siteId}`, '/app/reports', '/admin/users',
  ]) {
    mount(route);
    await act(async () => { await sleep(90); });
    const expected = route.startsWith('/admin') ? '/app' : route;
    ok(`muat ulang ${route} mendarat di tempat yang sama`, path() === expected, `→ ${path()}`);
  }

  console.log('\n=== MAJU / MUNDUR ===');
  mount('/app/evaluations');
  await act(async () => { await sleep(90); });
  ok('mulai di daftar evaluasi', path() === '/app/evaluations');

  const detailLink = [...document.querySelectorAll('a')].find((a) => a.getAttribute('href')?.startsWith(`/app/evaluations/${evalId}`));
  await clickAct(detailLink);
  await act(async () => { await sleep(110); });
  ok('klik menuju detail', path() === `/app/evaluations/${evalId}`, path());

  await act(async () => { await router.navigate(-1); });
  await act(async () => { await sleep(90); });
  ok('kembali ke daftar', path() === '/app/evaluations', path());

  await act(async () => { await router.navigate(1); });
  await act(async () => { await sleep(90); });
  ok('maju ke detail lagi', path() === `/app/evaluations/${evalId}`, path());

  console.log('\n=== HREF HANYA MENUNJUK RUTE YANG ADA ===');
  const known = [
    '/', '/about', '/how-it-works', '/criteria', '/principles', '/methodology', '/start',
    '/sign-in', '/register', '/forgot-password', '/reset-password', '/sign-up',
    '/app', '/app/websites', '/app/websites/new', '/app/evaluations', '/app/evaluations/new',
    '/app/reports', '/app/settings', '/app/profile',
    '/admin', '/admin/users', '/admin/evaluations', '/admin/criteria', '/admin/settings',
  ];
  const hrefs = new Set<string>();
  await login({ email: DEMO_ADMIN.email, password: DEMO_ADMIN.password });
  for (const route of ['/', '/app', '/app/websites', '/app/evaluations', '/app/reports', '/admin', '/admin/users', '/admin/evaluations', '/admin/criteria', `/app/evaluations/${evalId}`, `/app/evaluations/${evalId}/report?preview=demo`]) {
    mount(route);
    await act(async () => { await sleep(85); });
    for (const a of document.querySelectorAll('a[href]')) {
      const href = a.getAttribute('href') ?? '';
      if (!href.startsWith('/')) continue;
      hrefs.add(href.split('?')[0].split('#')[0]);
    }
  }
  const unknown = [...hrefs].filter((href) => {
    if (known.includes(href)) return false;
    if (/^\/(app\/websites|app\/evaluations|admin\/users|admin\/evaluations)\/[^/]+(\/(edit|results|audit|recommendations|report))?$/.test(href)) return false;
    return true;
  });
  ok('tidak ada tautan internal menuju rute tak dikenal', unknown.length === 0, unknown.slice(0, 6).join(', '));

  // Admin cannot see another account's results: the per-owner services return
  // nothing, so the shell reports "not found" rather than another user's data.
  mount(`/app/evaluations/${evalId}/results?preview=demo`);
  await act(async () => { await sleep(90); });
  ok('admin tidak melihat hasil milik pengguna lain', !/\d{2}out of 100/.test(main()));

  // Back to the owner for the remaining route-consistency checks.
  await login({ email: 'nadia@studio.test', password: 'rahasia123' });

  console.log('\n=== KONSISTENSI RUTE HASIL ===');
  mount(`/app/evaluations/${evalId}/results`);
  await act(async () => { await sleep(150); });
  ok('tanpa preview: menyatakan hasil belum tersedia', main().includes('not available') || main().includes('Results are not yet available') || main().includes('Configuration saved'), main().slice(0, 120));
  ok('tanpa preview: tidak ada skor', !/\b\d{2}\s*out of 100\b/.test(main()));

  mount(`/app/evaluations/${evalId}/results?preview=demo`);
  await act(async () => { await sleep(150); });
  ok('dengan preview: skor demo tampil', /\d{2}out of 100/.test(main()));
  ok('dengan preview: label demo tampil', /demo/i.test(main()));

  mount(`/app/evaluations/${evalId}/audit?preview=demo`);
  await act(async () => { await sleep(150); });
  ok('audit mempertahankan preview', main().toLowerCase().includes('demo'));
  const backToResults = [...document.querySelectorAll('a')].find((a) => (a.getAttribute('href') ?? '').includes('/results'));
  ok('tautan antar bagian membawa preview=demo', !backToResults || (backToResults.getAttribute('href') ?? '').includes('preview=demo'));

  mount(`/app/evaluations/${evalId}/report`);
  await act(async () => { await sleep(150); });
  ok('laporan konfigurasi tanpa skor', !/\b\d{2}\s*\/\s*100\b/.test(main()));
  mount(`/app/evaluations/${evalId}/report?preview=demo`);
  await act(async () => { await sleep(150); });
  ok('laporan demo memuat skor', /\b\d{2}\b/.test(main()) && main().includes('Overall results'));

  console.log('\n=== PEMBARUAN RECORD TIDAK TERJADI SAAT NAVIGASI ===');
  const before = JSON.stringify(getEvaluation(me, evalId));
  for (const route of [`/app/evaluations/${evalId}`, `/app/evaluations/${evalId}/results?preview=demo`, `/app/evaluations/${evalId}/report?preview=demo`, '/app/reports']) {
    mount(route);
    await act(async () => { await sleep(85); });
  }
  ok('record identik setelah menelusuri semua rute', JSON.stringify(getEvaluation(me, evalId)) === before);

  console.log(`\n=== NAVIGASI: ${passes} PASS / ${fails} FAIL ===`);
  process.exit(fails === 0 ? 0 : 1);
};

run().catch((e) => { console.error('HARNESS ERROR', e); process.exit(1); });
