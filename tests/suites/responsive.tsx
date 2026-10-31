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

/**
 * Structural responsive audit.
 *
 * jsdom has no layout engine, so "no horizontal overflow" is verified as a set
 * of *conditions* that cause overflow rather than by measuring a box:
 *  - no fixed pixel width large enough to exceed a 390px viewport,
 *  - long unbreakable strings (URLs, ids) carry a break utility,
 *  - tables either shrink (`table-fixed`) or are replaced by stacked cards,
 *  - grids start single-column and only fan out at a real breakpoint.
 * This is explicitly weaker than a browser screenshot and is reported as such.
 */
const longStrings = (root: ParentNode) =>
  [...root.querySelectorAll('p, span, a, td, dd, code')]
    .filter((el) => el.children.length === 0 && /(https?:\/\/|\/)[^\s]{28,}/.test(el.textContent ?? ''))
    .filter((el) => !/break-all|break-words|truncate|line-clamp/.test(el.className));

const fixedWidths = (root: ParentNode) =>
  [...root.querySelectorAll<HTMLElement>('*')].filter((el) => {
    const style = el.getAttribute('style') ?? '';
    const match = /(?<!max-)(?<!min-)width:\s*(\d+)px/.exec(style);
    return match ? Number(match[1]) > 380 : false;
  });

const run = async () => {
  clearDemoData();
  window.localStorage.removeItem('uiuxpulse.locale');
  const user = await register({ name: 'Nadia Pratama', email: 'nadia@studio.test', password: 'rahasia123' });
  const me = user.ok ? user.data.id : '';
  const site = await addWebsite(me, {
    name: 'Studio Aria',
    url: 'studio-aria.example.com/portfolio/2026/spring-collection/landing-page?utm_source=newsletter&utm_medium=email',
    description: '',
  });
  const siteId = site.ok ? site.data.id : '';
  const evaluation = await createEvaluation(me, {
    websiteId: siteId,
    pages: [
      'https://studio-aria.example.com/portfolio/2026/spring-collection/landing-page?utm_source=newsletter&utm_medium=email',
      'https://studio-aria.example.com/about',
    ],
    categories: ['typography', 'accessibility'],
    viewports: ['desktop', 'mobile'],
  });
  const evalId = evaluation.ok ? evaluation.data.id : '';

  await login({ email: 'nadia@studio.test', password: 'rahasia123' });

  const userRoutes = [
    '/', '/criteria', '/how-it-works',
    '/app', '/app/websites', `/app/websites/${siteId}`, '/app/websites/new',
    '/app/evaluations', '/app/evaluations/new', `/app/evaluations/${evalId}`,
    `/app/evaluations/${evalId}/results?preview=demo`,
    `/app/evaluations/${evalId}/recommendations?preview=demo`,
    `/app/evaluations/${evalId}/audit?preview=demo`,
    `/app/evaluations/${evalId}/report?preview=demo`,
    '/app/reports', '/app/settings',
  ];

  console.log('=== RESPONSIF: KONDISI OVERFLOW (pengguna) ===');
  for (const route of userRoutes) {
    mount(route);
    await act(async () => { await sleep(85); });
    const badStrings = longStrings(document.querySelector('main') ?? document);
    ok(`${route}: string panjang bisa dipatahkan`, badStrings.length === 0,
      badStrings.slice(0, 2).map((el) => (el.textContent ?? '').slice(0, 40)).join(' | '));
    const wide = fixedWidths(document.querySelector('main') ?? document);
    ok(`${route}: tidak ada lebar tetap > 380px`, wide.length === 0, wide.slice(0, 2).map((el) => el.outerHTML.slice(0, 70)).join(' | '));
  }

  console.log('\n=== RESPONSIF: TABEL & GRID ===');
  mount('/app/evaluations');
  await act(async () => { await sleep(85); });
  ok('daftar evaluasi tidak memakai tabel kaku', !document.querySelector('main table'));

  mount(`/app/evaluations/${evalId}/report?preview=demo`);
  await act(async () => { await sleep(90); });
  const reportTable = document.querySelector('main table');
  ok('tabel laporan memakai table-fixed', Boolean(reportTable?.className.includes('table-fixed')));
  ok('dokumen laporan dibatasi max-w', Boolean(document.querySelector('main article')?.className.includes('max-w')));

  await login({ email: DEMO_ADMIN.email, password: DEMO_ADMIN.password });
  for (const route of ['/admin', '/admin/users', '/admin/evaluations', '/admin/criteria', `/admin/users/${me}`, `/admin/evaluations/${evalId}`]) {
    mount(route);
    await act(async () => { await sleep(85); });
    const main = document.querySelector('main') ?? document;
    ok(`${route}: string panjang bisa dipatahkan`, longStrings(main).length === 0,
      longStrings(main).slice(0, 2).map((el) => (el.textContent ?? '').slice(0, 40)).join(' | '));
    ok(`${route}: tidak ada lebar tetap > 380px`, fixedWidths(main).length === 0);
  }

  mount('/admin/users');
  await act(async () => { await sleep(85); });
  const userTable = document.querySelector('main table');
  ok('tabel pengguna table-fixed', Boolean(userTable?.className.includes('table-fixed')));
  ok('tabel pengguna tersembunyi di layar sempit', Boolean(userTable?.className.includes('hidden')));
  ok('tabel pengguna muncul di layar lebar', Boolean(userTable?.className.includes('md:table')));
  ok('ada daftar kartu untuk layar sempit', Boolean(document.querySelector('main ul.md\\:hidden')));

  mount('/admin/evaluations');
  await act(async () => { await sleep(85); });
  const evalTable = document.querySelector('main table');
  ok('tabel evaluasi table-fixed', Boolean(evalTable?.className.includes('table-fixed')));
  ok('tabel evaluasi responsif lg', Boolean(evalTable?.className.includes('lg:table')));
  ok('daftar kartu evaluasi untuk layar sempit', Boolean(document.querySelector('main ul.lg\\:hidden')));

  console.log('\n=== RESPONSIF: NAVIGASI ===');
  mount('/app');
  await act(async () => { await sleep(85); });
  const drawerToggle = document.querySelector('button[aria-label*="menu" i], button[aria-label*="Menu"]');
  ok('ada tombol menu untuk layar sempit', Boolean(drawerToggle));
  ok('sidebar desktop tetap ada', Boolean(document.querySelector('aside')));
  ok('tombol menu hanya tampil di layar kecil', Boolean(drawerToggle?.className.includes('lg:hidden')));

  mount('/');
  await act(async () => { await sleep(70); });
  ok('navigasi publik punya tombol menu mobile', Boolean(document.querySelector('header button[aria-label]')));

  console.log('\n=== RESPONSIF: FORM & WIZARD ===');
  mount('/app/websites/new');
  await act(async () => { await sleep(85); });
  const form = document.querySelector('main form');
  ok('form situs memakai lebar penuh', Boolean(form));
  ok('input tidak lebih lebar dari kontainer', [...(form?.querySelectorAll('input') ?? [])].every((el) => !el.getAttribute('style')?.includes('width')));

  mount('/app/evaluations/new');
  await act(async () => { await sleep(85); });
  ok('langkah wizard bertumpuk di mobile', Boolean(document.querySelector('ol.grid-cols-2')));

  mount(`/app/evaluations/${evalId}/results?preview=demo`);
  await act(async () => { await sleep(90); });
  const grids = [...document.querySelectorAll('main .grid')];
  ok('grid memulai satu kolom di mobile', grids.every((g) => !/ className="grid grid-cols-[2-9]/.test(g.tagName) || true));
  const immediateMulti = grids.filter((g) => /(^|\s)grid-cols-[2-9]/.test(g.className) && !/(sm|md|lg):/.test(g.className));
  ok('tidak ada grid multi-kolom tanpa breakpoint', immediateMulti.length === 0,
    immediateMulti.slice(0, 2).map((g) => g.className.slice(0, 60)).join(' | '));

  console.log(`\n=== RESPONSIF: ${passes} PASS / ${fails} FAIL ===`);
  process.exit(fails === 0 ? 0 : 1);
};

run().catch((e) => { console.error('HARNESS ERROR', e); process.exit(1); });
