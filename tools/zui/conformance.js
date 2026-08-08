#!/usr/bin/env node
'use strict';
/* ==========================================================================
   The conformance runner.

     node tools/zui/conformance.js [--level N] [--verbose]

   Runs every fixture in conformance/manifest.json against the verifier and
   compares the SET OF DIAGNOSTIC IDS -- never line numbers, wording or
   order, so conformance measures agreement about the law and not about
   presentation.

   A fixture above the claimed level is SKIPPED, not failed. That is what
   makes a claim honest: an implementation reports the level it satisfies.

   Exit codes: 0 all pass · 1 mismatches · 2 setup error.
   ========================================================================== */

const fs = require('fs');
const path = require('path');
const { verify } = require('./zui.js');
const { toEnvelope, validate, loadShape } = require('./envelope.js');

const ROOT = path.join(__dirname, '..', '..');
const CONF = path.join(ROOT, 'conformance');

function main(argv) {
  let level = 4, verbose = false;
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--level') level = parseInt(argv[++i], 10);
    else if (argv[i] === '--verbose' || argv[i] === '-v') verbose = true;
  }
  if (!(level >= 1 && level <= 4)) { console.error('--level must be 1..4'); return 2; }

  let manifest, contract, shape;
  try {
    manifest = JSON.parse(fs.readFileSync(path.join(CONF, 'manifest.json'), 'utf8'));
    contract = JSON.parse(fs.readFileSync(path.join(CONF, 'violations.json'), 'utf8'));
    shape = loadShape();                     /* the family envelope, C2 */
  } catch (e) { console.error('conformance: cannot load the suite: ' + e.message); return 2; }

  const levelOf = new Map(contract.diagnostics.map(d => [d.id, d.level]));
  const metaOf = new Map(contract.diagnostics.map(d => [d.id, d]));

  let pass = 0, fail = 0, skip = 0;
  const failures = [];

  /* Every diagnostic this court emits must travel in the family envelope.
     Validated for every fixture run, regardless of level. */
  let envelopes = 0;
  const envelopeProblems = [];

  for (const fx of manifest.fixtures) {
    if (fx.level > level) { skip++; continue; }

    const file = path.join(CONF, 'fixtures', fx.file);
    let src;
    try { src = fs.readFileSync(file, 'utf8'); }
    catch (e) { failures.push({ file: fx.file, reason: 'unreadable: ' + e.message }); fail++; continue; }

    const raw = verify(src, { symbols: fx.symbols || null });

    for (const d of raw) {
      envelopes++;
      const env = toEnvelope({ ...d, file: fx.file }, metaOf.get(d.id), 'zui');
      envelopeProblems.push(...validate(env, shape, `${fx.file} · ${d.id}`));
    }

    /* filter to what this level can see; unknown ids are structural and always count */
    const actual = new Set(
      raw.filter(d => (levelOf.get(d.id) || 1) <= level).map(d => d.id)
    );
    const expected = new Set(fx.expect_ids);

    const missing = [...expected].filter(x => !actual.has(x));
    const extra = [...actual].filter(x => !expected.has(x));

    if (!missing.length && !extra.length) {
      pass++;
      if (verbose) console.log(`  pass  ${fx.file}  ${[...actual].join(', ') || '(clean)'}`);
    } else {
      fail++;
      failures.push({ file: fx.file, expected: [...expected], actual: [...actual], missing, extra });
    }
  }

  console.log(`\nZui conformance — level ${level}`);
  console.log(`  spec         doc/language/ v1.0`);
  console.log(`  contract     violations.json v${contract.metadata.version} (constitution v${contract.metadata.constitution})`);
  console.log(`  envelope     diagnostic-contract v${shape.version} — ${envelopes} diagnostics, ${envelopeProblems.length ? envelopeProblems.length + ' nonconforming' : 'all conform'}`);
  console.log(`  fixtures     ${manifest.fixtures.length} total`);
  console.log(`  pass ${pass} · fail ${fail} · skipped ${skip} (above level ${level})`);

  if (envelopeProblems.length) {
    console.log('\nEnvelope violations (doc/diagnostic-contract.schema.json):');
    for (const p of envelopeProblems) console.log(`  ${p}`);
    return 1;
  }

  if (failures.length) {
    console.log('\nMismatches:');
    for (const f of failures) {
      if (f.reason) { console.log(`  ${f.file}: ${f.reason}`); continue; }
      console.log(`  ${f.file}`);
      console.log(`    expected  {${f.expected.join(', ')}}`);
      console.log(`    got       {${f.actual.join(', ')}}`);
      if (f.missing.length) console.log(`    missing   ${f.missing.join(', ')}`);
      if (f.extra.length) console.log(`    extra     ${f.extra.join(', ')}`);
    }
    return 1;
  }

  const claim = skip
    ? `conforms at level ${level}; ${skip} fixture(s) above it were skipped`
    : `conforms at level ${level} — every fixture in the suite`;
  console.log(`\n  ${claim}.`);
  return 0;
}

if (require.main === module) process.exit(main(process.argv.slice(2)));
module.exports = { main };
