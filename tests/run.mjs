import { spawnSync } from 'node:child_process';
import { readdirSync } from 'node:fs';

const suites = process.argv.slice(2).length
  ? process.argv.slice(2)
  : readdirSync('tests/suites').filter((f) => f.endsWith('.tsx') || f.endsWith('.ts')).map((f) => `tests/suites/${f}`);

const totals = { pass: 0, fail: 0 };
let failed = 0;
for (const suite of suites) {
  console.log(`\n━━━ ${suite} ━━━`);
  const build = spawnSync('node', ['tests/harness/build.mjs', suite], { stdio: 'inherit' });
  if (build.status !== 0) {
    console.log(`BUILD FAILED: ${suite}`);
    failed += 1;
    continue;
  }
  const run = spawnSync('node', ['tests/harness/dom.mjs', '.verify/out/app.js'], { encoding: 'utf8' });
  process.stdout.write(run.stdout ?? '');
  process.stderr.write(run.stderr ?? '');
  const tally = /(\d+) PASS \/ (\d+) FAIL/.exec(run.stdout ?? '');
  if (tally) {
    totals.pass += Number(tally[1]);
    totals.fail += Number(tally[2]);
  }
  if (run.status !== 0) failed += 1;
}

console.log(`\n${'='.repeat(56)}`);
console.log(`TOTAL: ${totals.pass} PASS / ${totals.fail} FAIL across ${suites.length} suites`);
console.log(`${failed === 0 ? 'ALL SUITES PASSED' : `${failed} SUITE(S) FAILED`}`);
console.log('='.repeat(56));
process.exit(failed === 0 ? 0 : 1);
