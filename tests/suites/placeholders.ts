import { en } from '@/i18n/locales/en';
import { id } from '@/i18n/locales/id';

const flatten = (obj: unknown, prefix = ''): Record<string, string> => {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
    if (v && typeof v === 'object') Object.assign(out, flatten(v, `${prefix}${k}.`));
    else out[`${prefix}${k}`] = String(v);
  }
  return out;
};
const EN = flatten(en);
const ID = flatten(id);
const tokens = (s: string) => new Set([...s.matchAll(/\{(\w+)\}/g)].map((m) => m[1]));

let bad = 0;
for (const key of Object.keys(EN)) {
  const a = tokens(EN[key]);
  const b = tokens(ID[key] ?? '');
  const onlyEn = [...a].filter((t) => !b.has(t));
  const onlyId = [...b].filter((t) => !a.has(t));
  if (onlyEn.length || onlyId.length) {
    bad += 1;
    console.log(`MISMATCH ${key}: EN=${[...a].join(',')} ID=${[...b].join(',')} missing-en=${onlyEn.join(',')} missing-id=${onlyId.join(',')}`);
  }
}
console.log(`placeholder mismatches: ${bad} of ${Object.keys(EN).length}`);
process.exit(bad === 0 ? 0 : 1);
