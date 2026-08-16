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

  /* The medium enumeration is hardcoded in the verifier (the grammar is
     closed) and published in media.json (implementations consume it).
     Two sources means drift, so prove they agree before running anything. */
  const mediaProblems = [];
  try {
    const spec = JSON.parse(fs.readFileSync(path.join(CONF, 'media.json'), 'utf8'));
    const { MEDIA_CARRIAGE } = require('./zui.js');
    const specIds = spec.media.map(m => m.id).sort();
    const implIds = Object.keys(MEDIA_CARRIAGE).sort();
    if (specIds.join(',') !== implIds.join(',')) {
      mediaProblems.push(`enumeration differs — media.json {${specIds}} vs verifier {${implIds}}`);
    }
    for (const m of spec.media) {
      const impl = MEDIA_CARRIAGE[m.id];
      if (!impl) continue;
      const sd = m.carries.default, id_ = impl.default;
      if (sd !== id_) mediaProblems.push(`${m.id}: default carriage — media.json "${sd}" vs verifier "${id_}"`);
      /* when the default is absent, everything CARRIED is listed -- whether
         natively or degraded. The verifier keeps one set because only
         absence raises; media.json keeps the distinction because tools and
         designers need to know which verbs cost something. */
      const sKeep = [...(m.carries.native || []), ...(m.carries.degraded || [])].sort().join(',');
      const iKeep = (impl.keep || []).slice().sort().join(',');
      if (sd === 'absent' && sKeep !== iKeep) mediaProblems.push(`${m.id}: carried set — media.json {${sKeep}} vs verifier {${iKeep}}`);
      const sAbs = (m.carries.absent || []).slice().sort().join(',');
      const iAbs = (impl.absent || []).slice().sort().join(',');
      if (sd !== 'absent' && sAbs !== iAbs) mediaProblems.push(`${m.id}: absent set — media.json {${sAbs}} vs verifier {${iAbs}}`);
    }
  } catch (e) { mediaProblems.push('cannot read media.json: ' + e.message); }

  /* The prose specification catalogues the same diagnostics the contract holds.
     It drifted: UNKNOWN_MEDIUM and VERB_NOT_CARRIED were added to violations.json
     and to the verifier and never to VIOLATIONS.md, so the table described 20
     while the contract held 22, and nothing noticed for three law versions.
     Same discipline as the media check -- two sources means prove they agree. */
  /* Read rather than hardcode: this line printed v1.0 through the whole of the
     language's v1.1, because a number in a console.log is not attached to
     anything that could contradict it. */
  let specVersion = '(unreadable)';
  try {
    const rm = fs.readFileSync(path.join(__dirname, '..', '..', 'doc', 'language', 'README.md'), 'utf8');
    const mm = rm.match(/^#\s+The Zui Language\s+—\s+Specification\s+v(\S+)/m);
    if (mm) specVersion = mm[1];
  } catch (e) { /* reported as (unreadable) rather than guessed */ }

  const specProblems = [];
  try {
    const md = fs.readFileSync(path.join(__dirname, '..', '..', 'doc', 'language', 'VIOLATIONS.md'), 'utf8');
    const documented = new Set();
    /* Two shapes carry a catalogue entry: a row of the grammar-diagnostics
       table, and the bolded heading each of the ten named violations opens
       with. A bare mention in prose does not count as documenting one. */
    for (const mm of md.matchAll(/^\|\s*`([A-Z][A-Z0-9_]+)`\s*\|/gm)) documented.add(mm[1]);
    for (const mm of md.matchAll(/^\*\*`([A-Z][A-Z0-9_]+)`/gm)) documented.add(mm[1]);
    for (const d of contract.diagnostics) {
      if (!documented.has(d.id)) specProblems.push(`${d.id} is in the contract and not in VIOLATIONS.md`);
    }
    for (const id of documented) {
      if (!metaOf.has(id)) specProblems.push(`${id} is in VIOLATIONS.md and not in the contract`);
    }
  } catch (e) { specProblems.push('cannot read VIOLATIONS.md: ' + e.message); }

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
  console.log(`  spec         doc/language/ v${specVersion}`);
  console.log(`  contract     violations.json v${contract.metadata.version} (constitution v${contract.metadata.constitution})`);
  console.log(`  envelope     diagnostic-contract v${shape.version} — ${envelopes} diagnostics, ${envelopeProblems.length ? envelopeProblems.length + ' nonconforming' : 'all conform'}`);
  console.log(`  media        ${Object.keys(require('./zui.js').MEDIA_CARRIAGE).length} media — ${mediaProblems.length ? mediaProblems.length + ' disagreements with media.json' : 'verifier agrees with media.json'}`);
  console.log(`  catalogue    ${contract.diagnostics.length} diagnostics — ${specProblems.length ? specProblems.length + ' disagreements with VIOLATIONS.md' : 'contract agrees with VIOLATIONS.md'}`);
  console.log(`  fixtures     ${manifest.fixtures.length} total`);
  console.log(`  pass ${pass} · fail ${fail} · skipped ${skip} (above level ${level})`);

  if (mediaProblems.length) {
    console.log('\nMedium enumeration disagreements (conformance/media.json vs the verifier):');
    for (const p of mediaProblems) console.log(`  ${p}`);
    return 1;
  }

  if (specProblems.length) {
    console.log('\nCatalogue disagreements (conformance/violations.json vs doc/language/VIOLATIONS.md):');
    for (const p of specProblems) console.log(`  ${p}`);
    return 1;
  }

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
