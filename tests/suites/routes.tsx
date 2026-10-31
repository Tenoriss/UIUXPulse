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
import { en } from '@/i18n/locales/en';
import { id } from '@/i18n/locales/id';
import { guideContent } from '@/content/guide';

let fails = 0;
let passes = 0;
const notes: string[] = [];
const ok = (l: string, c: boolean, e = '') => { c ? passes++ : fails++; if (!c) console.log(`FAIL  ${l}${e ? ' — ' + e : ''}`); };
const note = (l: string) => { notes.push(l); console.log(`NOTE  ${l}`); };
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const text = () => document.body.textContent?.replace(/\s+/g, ' ') ?? '';
const mainText = () => document.querySelector('main')?.textContent?.replace(/\s+/g, ' ') ?? '';

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
const search = () => router.state.location.search;

/** Console warnings React emits when markup is semantically invalid. */
const consoleNoise = (globalThis as any).__consoleLog as { level: string; text: string }[];

const localeStrings = (locale: 'en' | 'id') => {
  const values: string[] = [];
  const walk = (obj: unknown) => {
    if (typeof obj === 'string') { values.push(obj); return; }
    if (obj && typeof obj === 'object') Object.values(obj).forEach(walk);
  };
  walk(locale === 'en' ? en : id);
  walk(guideContent[locale]);
  return values;
};
const EN = localeStrings('en');
const ID = localeStrings('id');

/** Every heading / structural audit we run on each route. */
const audits: { route: string; expectH1: RegExp; minWordCount?: number }[] = [];

const run = async () => {
  clearDemoData();
  window.localStorage.removeItem('uiuxpulse.locale');

  // Seed deterministic data.
  const student = await register({ name: 'Nadia Pratama', email: 'nadia@studio.test', password: 'rahasia123' });
  const me = student.ok ? student.data.id : '';
  const site = await addWebsite(me, { name: 'Studio Aria', url: 'studio-aria.example.com', description: 'Portfolio studio.' });
  const siteId = site.ok ? site.data.id : '';
  const firstSite = site.ok ? site.data : null;
  const evaluation = await createEvaluation(me, {
    websiteId: siteId,
    pages: ['https://studio-aria.example.com/about', 'https://studio-aria.example.com/pricing', 'https://studio-aria.example.com/contact'],
    categories: ['typography', 'accessibility', 'layout'],
    viewports: ['desktop', 'tablet', 'mobile'],
  });
  const evalId = evaluation.ok ? evaluation.data.id : '';
  const websiteId = firstSite?.id ?? '';

  console.log('=== A. SETIAP RUTE DIRENDER (pengguna biasa) ===');
  const userRoutes = [
    '/', '/about', '/how-it-works', '/criteria', '/principles', '/methodology', '/start',
    '/app', '/app/websites', '/app/websites/new', `/app/websites/${websiteId}`, `/app/websites/${websiteId}/edit`,
    '/app/evaluations', '/app/evaluations/new', `/app/evaluations/${evalId}`,
    `/app/evaluations/${evalId}/results`, `/app/evaluations/${evalId}/audit`, `/app/evaluations/${evalId}/recommendations`,
    `/app/evaluations/${evalId}/report`, '/app/reports', '/app/settings', '/app/profile',
    '/app/evaluations/does-not-exist', '/app/websites/does-not-exist', '/nope',
  ];

  for (const route of userRoutes) {
    const before = consoleNoise.length;
    mount(route);
    await act(async () => { await sleep(80); });
    const main = mainText();
    const h1s = document.querySelectorAll('main h1, main [role="main"] h1');
    const publicH1 = document.querySelectorAll('h1');
    const noise = consoleNoise.slice(before).filter((n) => /validateDOMNesting|Warning:|missing key|Each child/i.test(n.text));
    ok(`A. ${route} merender isi`, main.length > 60 || publicH1.length > 0, `main=${main.length}`);
    ok(`A. ${route} satu h1`, publicH1.length === 1, `${publicH1.length} h1`);
    ok(`A. ${route} tanpa peringatan React`, noise.length === 0, noise.map((n) => n.text.slice(0, 120)).join(' | '));
    const leafText = [...document.querySelectorAll('main p, main h1, main h2, main h3, main button, main a, main dt, main dd, main th, main td, main li, main span')]
      .filter((el) => el.children.length === 0)
      .map((el) => (el.textContent ?? '').trim())
      .join(' | ');
    const untranslated = leafText.match(/\b[a-zA-Z]+\.[a-zA-Z.]{2,}\b/g)?.filter((token) =>
      /^(nav|auth|dashboard|evaluation|results|report|admin|websites|profile|validation|states|common|footer|criteria|home|about|howItWorks|principles|methodology|start|settings|tabs|modal|toast|guide)\./.test(token)) ?? [];
    ok(`A. ${route} tanpa kunci i18n mentah`, untranslated.length === 0, untranslated.slice(0, 3).join(', '));
    audits.push({ route, expectH1: /./ });
  }

  console.log('\n=== B. REDIRECT & GATE ===');
  mount('/app');
  await act(async () => { await sleep(60); });
  ok('B. /app terautentikasi', path() === '/app');

  mount('/admin');
  await act(async () => { await sleep(70); });
  ok('B. pengguna biasa /admin → /app', path() === '/app', path());
  ok('B. tidak ada kebocoran admin', !mainText().includes('Registered users'));

  mount('/app/evaluations?search=aria&sort=oldest');
  await act(async () => { await sleep(70); });
  ok('B. query parameter dipertahankan', search().includes('search=aria') && search().includes('sort=oldest'), search());

  mount(`/app/evaluations/${evalId}/results?preview=demo`);
  await act(async () => { await sleep(80); });
  ok('B. preview=demo dihormati', /demo/i.test(mainText()));

  // Admin session.
  await login({ email: DEMO_ADMIN.email, password: DEMO_ADMIN.password });
  const adminRoutes = ['/admin', '/admin/users', `/admin/users/${me}`, '/admin/users/nope', '/admin/evaluations', `/admin/evaluations/${evalId}`, '/admin/evaluations/nope', '/admin/criteria', '/admin/settings', '/admin/queue'];
  for (const route of adminRoutes) {
    const before = consoleNoise.length;
    mount(route);
    await act(async () => { await sleep(80); });
    const h1s = document.querySelectorAll('h1');
    const noise = consoleNoise.slice(before).filter((n) => /validateDOMNesting|Warning:|missing key/i.test(n.text));
    ok(`B. admin ${route} merender`, mainText().length > 60, `main=${mainText().length}`);
    ok(`B. admin ${route} satu h1`, h1s.length === 1, `${h1s.length} h1`);
    ok(`B. admin ${route} tanpa peringatan React`, noise.length === 0, noise.map((n) => n.text.slice(0, 140)).join(' | '));
  }
  mount('/admin/queue');
  await act(async () => { await sleep(80); });
  ok('B. /admin/queue dialihkan', path() === '/admin/evaluations', path());

  console.log('\n=== C. HIRARKI HEADING ===');
  await login({ email: 'nadia@studio.test', password: 'rahasia123' });
  for (const route of ['/', '/criteria', '/app', `/app/evaluations/${evalId}/report?preview=demo`, '/app/reports']) {
    mount(route);
    await act(async () => { await sleep(80); });
    const levels = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].map((h) => Number(h.tagName[1]));
    let skipped = false;
    for (let i = 1; i < levels.length; i += 1) {
      if (levels[i] > levels[i - 1] + 1) { skipped = true; break; }
    }
    ok(`C. ${route} heading tanpa lompatan`, !skipped, levels.join(','));
    ok(`C. ${route} h1 pertama`, levels.filter((l) => l === 1).length === 1, levels.join(','));
  }

  console.log('\n=== D. AKSESIBILITAS STRUKTURAL ===');
  mount('/sign-in');
  await act(async () => { await sleep(70); });
  const inputs = [...document.querySelectorAll('input')];
  ok('D. setiap input punya label', inputs.every((input) => Boolean(input.labels?.length) || Boolean(input.getAttribute('aria-label'))), String(inputs.length));
  ok('D. tombol punya nama aksesibel', [...document.querySelectorAll('button')].every((b) => (b.textContent ?? '').trim().length > 0 || Boolean(b.getAttribute('aria-label'))));

  mount('/app/websites');
  await act(async () => { await sleep(80); });
  const iconButtons = [...document.querySelectorAll('button')];
  ok('D. tombol ikon punya aria-label', iconButtons.every((b) => (b.textContent ?? '').trim().length > 0 || Boolean(b.getAttribute('aria-label'))), 
    iconButtons.filter((b) => !(b.textContent ?? '').trim() && !b.getAttribute('aria-label')).map((b) => b.outerHTML.slice(0, 90)).slice(0, 3).join(' | '));

  mount('/admin/evaluations');
  await act(async () => { await sleep(80); });
  await login({ email: DEMO_ADMIN.email, password: DEMO_ADMIN.password });
  mount('/admin/evaluations');
  await act(async () => { await sleep(80); });
  const table = document.querySelector('table');
  ok('D. tabel punya caption', Boolean(table?.querySelector('caption')));
  ok('D. tabel punya header scope', [...(table?.querySelectorAll('th') ?? [])].every((th) => th.getAttribute('scope')));
  ok('D. links punya teks', [...document.querySelectorAll('a')].every((a) => (a.textContent ?? '').trim().length > 0 || Boolean(a.getAttribute('aria-label'))));

  console.log('\n=== E. KONTRAS WARNA TOKEN ===');
  const css = await import('node:fs').then((fs) => fs.readFileSync('src/styles/index.css', 'utf8'));
  ok('E. token warna ada', css.includes('--color-ink') && css.includes('--color-canvas'));

  console.log(`\n=== AUDIT: ${passes} PASS / ${fails} FAIL (${notes.length} catatan) ===`);
  process.exit(fails === 0 ? 0 : 1);
};

run().catch((e) => { console.error('HARNESS ERROR', e); process.exit(1); });
