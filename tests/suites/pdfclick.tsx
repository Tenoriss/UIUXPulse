import { createRoot } from 'react-dom/client';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { act, startTransition } from 'react';
import { I18nProvider } from '@/i18n';
import { ToastProvider } from '@/providers/ToastProvider';
import { AuthProvider } from '@/services/auth.context';
import { appRoutes } from '@/router/routes';
import { clearDemoData, register } from '@/services/auth.service';
import { addWebsite } from '@/services/website.service';
import { createEvaluation } from '@/services/evaluation.service';
import { mkdirSync, readFileSync, rmSync, readdirSync } from 'node:fs';

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
let pass = 0, fail = 0;
const ok = (l: string, c: boolean, e = '') => { c ? pass++ : fail++; console.log(`${c ? 'PASS' : 'FAIL'}  ${l}${e ? ' — ' + e : ''}`); };

(async () => {
  clearDemoData();
  const u = await register({ name: 'Nadia', email: 'nadia@studio.test', password: 'rahasia123' });
  const me = u.ok ? u.data.id : '';
  const s = await addWebsite(me, { name: 'Studio Aria', url: 'studio-aria.example.com', description: '' });
  const e = await createEvaluation(me, { websiteId: s.ok ? s.data.id : '', pages: ['https://studio-aria.example.com/about'], categories: ['typography'], viewports: ['desktop'] });
  const id = e.ok ? e.data.id : '';

  const router = createMemoryRouter(appRoutes, { initialEntries: [`/app/evaluations/${id}/report`] });
  document.body.innerHTML = '<div id="root"></div>';
  const root = createRoot(document.getElementById('root')!);
  act(() => { startTransition(() => { root.render(<I18nProvider><ToastProvider><AuthProvider><RouterProvider router={router} /></AuthProvider></ToastProvider></I18nProvider>); }); });
  await act(async () => { await sleep(120); });

  const btn = [...document.querySelectorAll('button')].find((b) => (b.textContent ?? '').includes('Download'));
  ok('tombol unduh ada', Boolean(btn));

  const tmp = '/tmp/pdfclick';
  rmSync(tmp, { recursive: true, force: true });
  mkdirSync(tmp, { recursive: true });
  const cwd = process.cwd();
  process.chdir(tmp);
  await act(async () => { (btn as HTMLElement).click(); await sleep(700); });
  process.chdir(cwd);

  const files = readdirSync(tmp);
  ok('klik mengunduh berkas', files.length > 0, files.join(','));
  if (files.length) {
    const buf = readFileSync(`${tmp}/${files[0]}`);
    ok('berkas adalah PDF valid', buf.subarray(0, 5).toString() === '%PDF-');
    ok('nama berkas bermakna', /^uiuxpulse-.*\.pdf$/.test(files[0]), files[0]);
  }
  rmSync(tmp, { recursive: true, force: true });
  console.log(`\n=== PDFCLICK: ${pass} PASS / ${fail} FAIL ===`);
  process.exit(fail === 0 ? 0 : 1);
})();
