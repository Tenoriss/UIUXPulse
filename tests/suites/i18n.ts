import { en } from '@/i18n/locales/en';
import { id } from '@/i18n/locales/id';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const flatten = (obj: unknown, prefix = ''): string[] =>
  Object.entries(obj as Record<string, unknown>).flatMap(([k, v]) =>
    v && typeof v === 'object' ? flatten(v, `${prefix}${k}.`) : [`${prefix}${k}`]);
const enKeys = flatten(en).sort();
const idKeys = flatten(id).sort();
console.log('EN-only:', enKeys.filter((k) => !idKeys.includes(k)));
console.log('ID-only:', idKeys.filter((k) => !enKeys.includes(k)));
console.log('counts', enKeys.length, idKeys.length);

const walk = (dir: string): string[] =>
  readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
let src = '';
for (const f of walk('src')) if (/\.(ts|tsx)$/.test(f)) src += readFileSync(f, 'utf8');
const used = new Set([...src.matchAll(/\bt\('([a-zA-Z0-9_.]+)'/g)].map((m) => m[1]));
const missing = [...used].filter((k) => !enKeys.includes(k)).sort();
console.log('MISSING keys used via t():', missing);
process.exit(0);
