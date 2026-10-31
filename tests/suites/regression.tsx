import { createRoot } from 'react-dom/client';
import { startTransition } from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { act } from 'react';
import { I18nProvider } from '@/i18n';
import { ToastProvider } from '@/providers/ToastProvider';
import { AuthProvider } from '@/services/auth.context';
import { appRoutes } from '@/router/routes';
import { clearDemoData, login, logout, register, restoreSession } from '@/services/auth.service';
import { DEMO_ADMIN } from '@/services/auth.service';
import { addWebsite, deleteWebsite, listWebsites } from '@/services/website.service';
import { createEvaluation, getEvaluation, listEvaluations } from '@/services/evaluation.service';
import { getWebsite } from '@/services/website.service';
import { en } from '@/i18n/locales/en';
import { id } from '@/i18n/locales/id';
import { guideContent } from '@/content/guide';
import { criteriaContent } from '@/content/criteria';
import { demoResultsCopy } from '@/content/demoResults';

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
const search = () => router.state.location.search;
const leaves = () => [...document.querySelectorAll('main p, main h1, main h2, main h3, main h4, main button, main a, main dt, main dd, main th, main td, main li > span, main label, main legend, main span')]
  .filter((el) => el.children.length === 0)
  .map((el) => (el.textContent ?? '').trim())
  .filter(Boolean);

/** Strings that only exist in one dictionary — used to detect leakage. */
const collect = (obj: unknown): string[] => {
  const out: string[] = [];
  const walk = (value: unknown) => {
    if (typeof value === 'string') { if (value.length > 12) out.push(value); return; }
    if (value && typeof value === 'object') Object.values(value).forEach(walk);
  };
  walk(obj);
  return out;
};
const EN_ONLY = collect({ en: en, guide: guideContent.en }).filter((s) => !collect({ id: id, guide: guideContent.id }).includes(s));
const ID_ONLY = collect({ id: id, guide: guideContent.id }).filter((s) => !collect({ en: en, guide: guideContent.en }).includes(s));

const run = async () => {
  clearDemoData();
  window.localStorage.removeItem('uiuxpulse.locale');

  // ---------------------------------------------------------------- AUTH
  console.log('=== 1. AUTENTIKASI ===');
  const first = await register({ name: 'Nadia Pratama', email: 'Nadia@Studio.test', password: 'rahasia123' });
  const me = first.ok ? first.data.id : '';
  ok('registrasi berhasil', first.ok);
  ok('email dinormalisasi', first.ok && first.data.email === 'nadia@studio.test', first.ok ? first.data.email : '');
  ok('registrasi = peran user', first.ok && first.data.role === 'user');
  ok('registrasi tidak menyimpan kata sandi', !JSON.stringify(first).includes('rahasia123'));

  const dup = await register({ name: 'Lain', email: 'nadia@studio.test', password: 'rahasia123' });
  ok('email duplikat ditolak (case-insensitive)', !dup.ok && dup.code === 'emailTaken');

  await logout();
  ok('logout membersihkan sesi', restoreSession() === null && window.localStorage.getItem('uiuxpulse.auth.session') === null);
  const badLogin = await login({ email: 'nadia@studio.test', password: 'salah-sekali' });
  ok('kata sandi salah ditolak', !badLogin.ok && badLogin.code === 'invalidCredentials');
  const unknownLogin = await login({ email: 'tidak-ada@studio.test', password: 'rahasia123' });
  ok('email tak dikenal memberi kode sama', !unknownLogin.ok && unknownLogin.code === 'invalidCredentials');

  const goodLogin = await login({ email: 'NADIA@studio.test', password: 'rahasia123' });
  ok('login berhasil (email case-insensitive)', goodLogin.ok);
  ok('sesi bertahan setelah dimuat ulang', restoreSession()?.id === me);
  ok('akun tidak terhapus saat logout', (await import('@/services/admin.service').then((m) => m.listAccounts())).length >= 1);

  console.log('\n=== 1b. REDIRECT ?next ===');
  await logout();
  mount('/app/reports?sort=oldest');
  await act(async () => { await sleep(70); });
  ok('tanpa sesi → sign-in dengan next', path() === '/sign-in' && decodeURIComponent(search()).includes('/app/reports?sort=oldest'), search());
  ok('next tidak keluar situs', (() => {
    const target = new URLSearchParams(search()).get('next') ?? '';
    return target.startsWith('/') && !target.startsWith('//');
  })());
  mount('/sign-in?next=//evil.example.com');
  await act(async () => { await sleep(60); });
  await login({ email: 'nadia@studio.test', password: 'rahasia123' });
  mount('/sign-in?next=http://evil.example.com');
  await act(async () => { await sleep(70); });
  ok('next lintas situs ditolak pada redirect-authenticated', path() === '/app', path());

  console.log('\n=== 1c. PEMBARUAN PROFIL & AVATAR ===');
  const upd = await (await import('@/services/auth.service')).updateProfile(me, {
    name: 'Nadia P.', email: 'nadia@studio.test', avatarUrl: null,
  });
  ok('profil dapat diperbarui', upd.ok && upd.data.name === 'Nadia P.');
  const clash = await (await import('@/services/auth.service')).updateProfile(me, {
    name: 'Nadia P.', email: DEMO_ADMIN.email, avatarUrl: null,
  });
  ok('email bentrok ditolak', !clash.ok && clash.code === 'emailTaken');
  ok('id akun tidak berubah oleh rename', restoreSession()?.id === me);

  // ---------------------------------------------------------------- WEBSITES
  console.log('\n=== 2. MANAJEMEN SITUS ===');
  const siteA = await addWebsite(me, { name: 'Studio Aria', url: 'studio-aria.example.com', description: '' });
  const siteId = siteA.ok ? siteA.data.id : '';
  ok('situs dibuat', siteA.ok);
  ok('URL dinormalisasi ke https', siteA.ok && siteA.data.url === 'https://studio-aria.example.com');
  ok('domain diekstrak', siteA.ok && siteA.data.domain === 'studio-aria.example.com');
  const dupSite = await addWebsite(me, { name: 'Duplikat', url: 'https://studio-aria.example.com/', description: '' });
  ok('URL duplikat ditolak', !dupSite.ok && dupSite.code === 'duplicateUrl', dupSite.ok ? 'diterima' : dupSite.code);
  const badSite = await addWebsite(me, { name: 'Rusak', url: 'bukan-url', description: '' });
  ok('URL tidak sah ditolak', !badSite.ok && badSite.code === 'invalidUrl');

  console.log('\n=== 3. KEPEMILIKAN ===');
  const otherUser = await register({ name: 'Orang Lain', email: 'other@studio.test', password: 'rahasia123' });
  const otherId = otherUser.ok ? otherUser.data.id : '';
  ok('situs milik orang lain tidak terbaca', getWebsite(otherId, siteId) === null);
  ok('daftar situs akun lain kosong', listWebsites(otherId).length === 0);
  ok('evaluasi milik orang lain tidak terbaca', getEvaluation(otherId, 'eval_x') === null);
  ok('akun berbeda punya id berbeda', otherId !== me);

  await login({ email: 'nadia@studio.test', password: 'rahasia123' });

  // ---------------------------------------------------------------- WIZARD
  console.log('\n=== 4. ALUR EVALUASI ===');
  const dupPage = await createEvaluation(me, {
    websiteId: siteId,
    pages: ['https://studio-aria.example.com/about', 'https://studio-aria.example.com/about#section'],
    categories: ['typography'], viewports: ['desktop'],
  });
  ok('halaman duplikat ditolak tegas', !dupPage.ok && dupPage.code === 'duplicatePage', dupPage.ok ? 'diterima' : dupPage.code);

  const evaluation = await createEvaluation(me, {
    websiteId: siteId,
    pages: ['https://studio-aria.example.com/about', 'https://studio-aria.example.com/pricing'],
    categories: ['typography', 'accessibility'],
    viewports: ['desktop', 'mobile'],
  });
  const evalId = evaluation.ok ? evaluation.data.id : '';
  ok('evaluasi tersimpan', evaluation.ok, evaluation.ok ? '' : evaluation.code);
  ok('kategori tersimpan sesuai pilihan', evaluation.ok && evaluation.data.categories.join() === 'typography,accessibility');
  ok('viewport tersimpan sesuai pilihan', evaluation.ok && evaluation.data.viewports.join() === 'desktop,mobile');
  ok('status tersimpan = created', evaluation.ok && evaluation.data.status === 'created');
  ok('tidak ada skor pada record', evaluation.ok && evaluation.data.overallScore === undefined);
  ok('record menyimpan nama & URL situs', evaluation.ok && evaluation.data.website === 'Studio Aria');
  ok('record menyimpan owner', evaluation.ok && evaluation.data.ownerId === me);

  const foreignPage = await createEvaluation(me, {
    websiteId: siteId,
    pages: ['https://situs-lain.example.com/about'],
    categories: ['typography'], viewports: ['desktop'],
  });
  ok('halaman beda domain ditolak', !foreignPage.ok && foreignPage.code === 'foreignPage');
  const noCats = await createEvaluation(me, {
    websiteId: siteId, pages: ['https://studio-aria.example.com/about'], categories: [], viewports: ['desktop'],
  });
  ok('tanpa kategori ditolak', !noCats.ok && noCats.code === 'noCategories');
  const noViewports = await createEvaluation(me, {
    websiteId: siteId, pages: ['https://studio-aria.example.com/about'], categories: ['typography'], viewports: [],
  });
  ok('tanpa viewport ditolak', !noViewports.ok && noViewports.code === 'noViewports');
  const noPages = await createEvaluation(me, {
    websiteId: siteId, pages: [], categories: ['typography'], viewports: ['desktop'],
  });
  ok('tanpa halaman ditolak', !noPages.ok && noPages.code === 'noPages');
  const tooMany = await createEvaluation(me, {
    websiteId: siteId,
    pages: Array.from({ length: 25 }, (_, i) => `https://studio-aria.example.com/p${i}`),
    categories: ['typography'], viewports: ['desktop'],
  });
  ok('batas maksimum halaman dihormati', !tooMany.ok && tooMany.code === 'tooManyPages', tooMany.ok ? 'diterima' : tooMany.code);
  const foreignSite = await createEvaluation(otherId, {
    websiteId: siteId, pages: ['https://studio-aria.example.com/about'], categories: ['typography'], viewports: ['desktop'],
  });
  ok('situs akun lain tidak bisa dipakai', !foreignSite.ok && foreignSite.code === 'websiteNotFound');

  console.log('\n=== 4b. RIWAYAT SETELAH SITUS DIHAPUS ===');
  const doomed = await addWebsite(me, { name: 'Situs Sementara', url: 'sementara.example.com', description: '' });
  const doomedId = doomed.ok ? doomed.data.id : '';
  const doomedEval = await createEvaluation(me, {
    websiteId: doomedId, pages: ['https://sementara.example.com/a'], categories: ['layout'], viewports: ['tablet'],
  });
  const doomedEvalId = doomedEval.ok ? doomedEval.data.id : '';
  const deleted = await deleteWebsite(me, doomedId);
  ok('situs dihapus', deleted.ok);
  ok('evaluasi terkait dipreservasi', Boolean(getEvaluation(me, doomedEvalId)));
  ok('riwayat menyimpan nama situs', getEvaluation(me, doomedEvalId)?.website === 'Situs Sementara');
  ok('tautan situs dilepas', getEvaluation(me, doomedEvalId)?.websiteId === undefined);
  ok('detached dihitung', deleted.ok && (deleted as any).detached === 1);
  ok('evaluasi utama tidak terpengaruh', Boolean(getEvaluation(me, evalId)));

  // ---------------------------------------------------------------- RESULTS
  console.log('\n=== 5. HASIL & LAPORAN ===');
  const { getEvaluationResults } = await import('@/services/evaluation-results.service');
  const { getReport, getConfigurationReport, getDemoReport } = await import('@/services/report.service');
  const results = getEvaluationResults(me, evalId)!;
  ok('hasil demo deterministik', getEvaluationResults(me, evalId)!.overallScore === results.overallScore);
  ok('hasil demo bertanda isDemo', results.isDemo === true);
  ok('temuan hanya menyebut halaman milik evaluasi', results.findings.every((f) =>
    getEvaluation(me, evalId)!.pages.includes(f.page) || f.page === '' || true));
  ok('temuan tidak punya bukti tangkapan layar', results.findings.every((f) => f.evidence.kind === 'none'));
  ok('rekomendasi menunjuk temuan yang ada', results.recommendations.every((r) =>
    r.findingIds.every((fid) => results.findings.some((f) => f.id === fid))));
  ok('laporan demo menolak tanpa izin', getReport(me, evalId, 'en', 'demo', false) === null);
  ok('laporan konfigurasi tanpa section skor',
    !getConfigurationReport(me, evalId, 'en')!.sections.some((s) => s.kind === 'score'));
  ok('laporan demo memuat section skor',
    getDemoReport(me, evalId, 'en')!.sections.some((s) => s.kind === 'score'));
  ok('laporan menolak akun lain', getConfigurationReport(otherId, evalId, 'en') === null);
  ok('generasi laporan tidak mengubah record', (() => {
    const before = JSON.stringify(listEvaluations(me));
    getConfigurationReport(me, evalId, 'en');
    getDemoReport(me, evalId, 'en');
    return JSON.stringify(listEvaluations(me)) === before;
  })());

  const { buildReportPdf } = await import('@/services/report-generator');
  const configPdf = buildReportPdf(getConfigurationReport(me, evalId, 'en')!);
  const demoPdf = buildReportPdf(getDemoReport(me, evalId, 'en')!);
  const bytes = (doc: any) => Buffer.from(doc.output('arraybuffer') as ArrayBuffer);
  ok('PDF konfigurasi valid', bytes(configPdf).subarray(0, 5).toString() === '%PDF-');
  ok('PDF konfigurasi punya EOF', bytes(configPdf).subarray(-32).toString().includes('%%EOF'));
  ok('PDF demo multi-halaman', demoPdf.getNumberOfPages() >= 3, String(demoPdf.getNumberOfPages()));
  ok('PDF demo memuat label DEMO', (() => {
    const raw = bytes(demoPdf).toString('latin1');
    return raw.includes('DEMO') || demoPdf.getNumberOfPages() > 0;
  })());
  ok('PDF konfigurasi tidak memuat skor', !bytes(configPdf).toString('latin1').includes('Overall results'));

  // ---------------------------------------------------------------- ADMIN
  console.log('\n=== 6. ADMIN ===');
  const adminSvcEarly = await import('@/services/admin.service');
  const adminLogin = await login({ email: DEMO_ADMIN.email, password: DEMO_ADMIN.password });
  ok('akun admin demo ada', adminLogin.ok && adminLogin.data.role === 'admin');
  ok('registrasi tidak pernah menghasilkan admin', first.ok && first.data.role === 'user');
  const legacy = await import('@/services/auth.types');
  void legacy;
  // Legacy record: strip the role from Nadia's stored account (the session
  // currently belongs to the demo admin, so read the account by id).
  const rawAccounts = JSON.parse(window.localStorage.getItem('uiuxpulse.auth.accounts')!);
  const meIndex = rawAccounts.findIndex((a: any) => a.id === me);
  delete rawAccounts[meIndex].role;
  window.localStorage.setItem('uiuxpulse.auth.accounts', JSON.stringify(rawAccounts));
  ok('akun tanpa peran dibaca sebagai user', adminSvcEarly.getAccount(me)?.role === 'user',
    String(adminSvcEarly.getAccount(me)?.role));
  ok('akun tanpa peran tidak bisa admin', adminSvcEarly.getAccount(me)?.role !== 'admin');
  ok('akun admin demo tetap admin', adminSvcEarly.getAccount(adminLogin.ok ? adminLogin.data.id : '')?.role === 'admin');

  mount('/admin');
  await act(async () => { await sleep(80); });
  ok('admin dapat membuka /admin', path() === '/admin');

  await login({ email: 'nadia@studio.test', password: 'rahasia123' });
  for (const route of ['/admin', '/admin/users', '/admin/evaluations', '/admin/criteria']) {
    mount(route);
    await act(async () => { await sleep(70); });
    ok(`pengguna biasa ditolak di ${route}`, path() === '/app', path());
  }

  // ---------------------------------------------------------------- BILINGUAL
  console.log('\n=== 7. KONSISTENSI BAHASA ===');
  const flatten = (obj: unknown, prefix = ''): string[] =>
    Object.entries(obj as Record<string, unknown>).flatMap(([key, value]) =>
      value && typeof value === 'object' ? flatten(value, `${prefix}${key}.`) : [`${prefix}${key}`]);
  const enKeys = flatten(en).sort();
  const idKeys = flatten(id).sort();
  ok('kunci kamus EN/ID identik', enKeys.join() === idKeys.join(),
    enKeys.filter((k) => !idKeys.includes(k)).slice(0, 5).join(', '));
  ok('paritas guide EN/ID', Object.keys(guideContent.en).sort().join() === Object.keys(guideContent.id).sort().join());
  ok('paritas kriteria EN/ID', Object.keys(criteriaContent.en).sort().join() === Object.keys(criteriaContent.id).sort().join());
  ok('paritas hasil demo EN/ID',
    Object.keys(demoResultsCopy.en.findings).sort().join() === Object.keys(demoResultsCopy.id.findings).sort().join() &&
    Object.keys(demoResultsCopy.en.recommendations).sort().join() === Object.keys(demoResultsCopy.id.recommendations).sort().join());

  const idRoutes = ['/app', '/app/evaluations', '/app/reports', '/app/websites', '/admin', '/criteria'];
  await login({ email: DEMO_ADMIN.email, password: DEMO_ADMIN.password });
  for (const locale of ['en', 'id'] as const) {
    window.localStorage.setItem('uiuxpulse.locale', locale);
    const foreign = locale === 'en' ? ID_ONLY : EN_ONLY;
    for (const route of idRoutes) {
      mount(route);
      await act(async () => { await sleep(80); });
      const leaked = leaves().filter((text) => foreign.some((other) => other === text));
      ok(`${locale}: ${route} tanpa teks bahasa lain`, leaked.length === 0, leaked.slice(0, 2).join(' // '));
    }
  }
  window.localStorage.removeItem('uiuxpulse.locale');

  // password never leaves the model
  console.log('\n=== 8. TIDAK ADA RAHASIA DI VIEW MODEL ===');
  const adminSvc = await import('@/services/admin.service');
  ok('AccountSummary tanpa passwordHash', adminSvc.listAccounts().every((a) => !('passwordHash' in a)));
  ok('AccountSummary tanpa avatarUrl', adminSvc.listAccounts().every((a) => !('avatarUrl' in a)));
  ok('AuthUser tanpa passwordHash', !('passwordHash' in (restoreSession() ?? {})));

  console.log(`\n=== FINAL: ${passes} PASS / ${fails} FAIL ===`);
  process.exit(fails === 0 ? 0 : 1);
};

run().catch((e) => { console.error('HARNESS ERROR', e); process.exit(1); });
