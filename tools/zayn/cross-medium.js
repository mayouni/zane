#!/usr/bin/env node
/* ==========================================================================
   cross-medium.js — one declaration, two renderings, one law.

   The keystone instrument of the Second Founding (S13b). Every other tool
   here proves something about ONE artifact: the verifier proves a file's
   verdict, the envelope proves a diagnostic's shape, the matrix records what
   a medium carries. Nothing proved the sentence the whole design rests on:

       one declaration, many renderings, one law.

   THE DEFINITION THAT MAKES IT MECHANICAL. The test is not "the two
   renderings are the same" -- they are irreducibly different, and a model
   that hid that would promise portability it cannot deliver. The test is:

       EVERY DIFFERENCE BETWEEN THE TWO RENDERINGS IS ONE THE PUBLISHED DATA
       ALREADY PREDICTED.

   A difference media.json or signal.json accounts for is the model working.
   A difference neither accounts for is drift, and it fails the run. That is
   the whole instrument, and it is why the matrices had to be data first.

   Usage:  node tools/zayn/cross-medium.js [spec.json] [--verbose]
   Exit:   0 every difference predicted · 1 unpredicted difference · 2 setup
   ========================================================================== */

'use strict';

const fs = require('fs');
const path = require('path');
const { verify } = require('./zayn.js');

const ROOT = path.join(__dirname, '..', '..');
const CONF = path.join(ROOT, 'conformance');

const media = JSON.parse(fs.readFileSync(path.join(CONF, 'media.json'), 'utf8'));
const signal = JSON.parse(fs.readFileSync(path.join(CONF, 'signal.json'), 'utf8'));

const MEDIUM = new Map(media.media.map(m => [m.id, m]));

/* ---- what the published data predicts, per medium ---------------------- */

/* media.json states carriage two ways round, so read it rather than assume:
   a medium whose default is native lists what it LOSES; one whose default is
   absent lists what it KEEPS. */
function carriageOf(mediumId, verb) {
  const m = MEDIUM.get(mediumId);
  if (!m) return 'unknown';
  const c = m.carries || {};
  if ((c.absent || []).includes(verb)) return 'absent';
  if ((c.degraded || []).includes(verb)) return 'degraded';
  if ((c.native || []).includes(verb)) return 'native';
  return c.default === 'absent' ? 'absent' : (c.default || 'unknown');
}

/* signal.json lists rendersAsAbsence only for channels with a shipped
   renderer. A medium with no entry is UNDECIDED -- never "perceptible". */
function signalRendering(mediumId, value) {
  const r = (signal.renderings || {})[mediumId];
  if (!r || !('rendersAsAbsence' in r)) return 'undecided';
  return (r.rendersAsAbsence || []).includes(value) ? 'absence' : 'rendered';
}

/* ---- project one declaration into one medium --------------------------- */

function project(source, mediumId, vibeName) {
  /* The medium is declared on a VIBE, so the projection IS appending one.
     The declaration body itself is never edited -- that is the point. */
  const projected = `${source}\nDEFINE VIBE ${vibeName} (\n  SURFACE_AS ${mediumId}\n)\n`;
  const findings = verify(projected, null, 4);

  const verbs = new Set(), signals = new Set();
  for (const line of source.split('\n')) {
    const s = line.match(/SATISFIES\s*\[([^\]]*)\]/);
    if (s) s[1].split(',').map(x => x.trim()).filter(Boolean).forEach(v => verbs.add(v));
    const g = line.match(/SIGNALS\s*\[([^\]]*)\]/);
    if (g) g[1].split(',').map(x => x.trim()).filter(Boolean).forEach(v => signals.add(v));
  }

  const intents = {};
  for (const v of [...verbs].sort()) intents[v] = carriageOf(mediumId, v);
  const sigs = {};
  for (const v of [...signals].sort()) sigs[v] = signalRendering(mediumId, v);

  return {
    medium: mediumId,
    intents,
    signals: sigs,
    diagnostics: findings.map(f => f.id).sort()
  };
}

/* ---- compare two projections ------------------------------------------- */

/* Three verdicts, and the distinction is the instrument's whole honesty:

     predicted  the published data accounts for this difference. The model works.
     undecided  the data is SILENT about one side. Nothing is contradicted and
                nothing is proved -- a gap in coverage, not a defect in the model.
     drift      the data is CONTRADICTED. One declaration was judged two ways
                for a reason nothing published explains. This is the failure the
                instrument exists to catch.

   Collapsing undecided into drift would cry wolf; collapsing it into predicted
   would claim a proof that was never performed. Neither passes. */
function compare(a, b) {
  const diffs = [];
  const note = (kind, subject, av, bv, verdict, because) =>
    diffs.push({ kind, subject, [a.medium]: av, [b.medium]: bv, verdict, because });

  /* NOTE THE ORDER OF THESE TESTS. Silence is checked BEFORE equality, because
     two silences compare equal and would otherwise vanish from the report --
     an agreement nobody verified, passing as an agreement proved. That is the
     precise failure this whole instrument exists to make impossible, and it
     was in the first draft of this file. */

  for (const verb of new Set([...Object.keys(a.intents), ...Object.keys(b.intents)])) {
    const av = a.intents[verb], bv = b.intents[verb];
    const silentSides = [av === 'unknown' ? a.medium : null, bv === 'unknown' ? b.medium : null].filter(Boolean);
    if (silentSides.length) {
      note('intent', verb, av, bv, 'undecided',
        `media.json does not enumerate ${silentSides.join(' or ')}, so this verb's carriage is unproved`);
      continue;
    }
    if (av === bv) continue;
    note('intent', verb, av, bv, 'predicted',
      `media.json records this verb as ${av} on ${a.medium} and ${bv} on ${b.medium}`);
  }

  for (const val of new Set([...Object.keys(a.signals), ...Object.keys(b.signals)])) {
    const av = a.signals[val], bv = b.signals[val];
    const silentSides = [av === 'undecided' ? a.medium : null, bv === 'undecided' ? b.medium : null].filter(Boolean);
    if (silentSides.length) {
      note('signal', val, av, bv, 'undecided',
        `signal.json records no rendering for ${silentSides.join(' or ')}, so this value is unproved rather than wrong`);
      continue;
    }
    if (av === bv) continue;
    note('signal', val, av, bv, 'predicted',
      `signal.json records this value as ${av} on ${a.medium} and ${bv} on ${b.medium}`);
  }

  const da = new Set(a.diagnostics), db = new Set(b.diagnostics);
  for (const id of new Set([...da, ...db])) {
    if (da.has(id) === db.has(id)) continue;
    const only = da.has(id) ? a.medium : b.medium;
    /* A refusal appearing in one rendering and not the other is predicted only
       when it is a MEDIUM diagnostic -- one the axis exists to raise. Any other
       divergence means one declaration was judged differently for a reason
       nothing published explains, and that is drift by definition. */
    const isMediumDiagnostic = id === 'VERB_NOT_CARRIED' || id === 'SIGNAL_UNPERCEIVABLE';
    note('refusal', id, da.has(id) ? 'raised' : '-', db.has(id) ? 'raised' : '-',
      isMediumDiagnostic ? 'predicted' : 'drift',
      isMediumDiagnostic
        ? `${id} is a medium diagnostic; raising it on ${only} alone is the axis working`
        : `${id} is not a medium diagnostic, so one declaration was judged differently for a reason the data does not explain`);
  }

  return diffs;
}

/* ---- run --------------------------------------------------------------- */

function main(argv) {
  const verbose = argv.includes('--verbose');
  const specPath = argv.find(a => !a.startsWith('--')) ||
    path.join(CONF, 'cross-medium', 'spec.json');

  let spec;
  try { spec = JSON.parse(fs.readFileSync(specPath, 'utf8')); }
  catch (e) { console.error('cross-medium: cannot read the spec: ' + e.message); return 2; }

  console.log(`\nCross-medium conformance — ${spec.cases.length} case(s)`);
  console.log(`  media        ${media.media.length} enumerated, matrix v${media.metadata.version}`);
  console.log(`  signals      ${signal.values.length} values, vocabulary v${signal.metadata.version}`);

  let drifted = 0, undecided = 0;

  for (const c of spec.cases) {
    let source;
    try { source = fs.readFileSync(path.join(CONF, 'cross-medium', c.file), 'utf8'); }
    catch (e) { console.error(`  ${c.file}: cannot read — ${e.message}`); return 2; }

    const A = project(source, c.media[0], 'projection_a');
    const B = project(source, c.media[1], 'projection_b');
    const diffs = compare(A, B);

    const bad = diffs.filter(d => d.verdict === 'drift');
    const gaps = diffs.filter(d => d.verdict === 'undecided');
    const kept = Object.keys(A.intents).filter(v => A.intents[v] !== 'absent' && B.intents[v] !== 'absent');

    console.log(`\n  ${c.file}  —  ${c.media[0]} vs ${c.media[1]}`);
    console.log(`    intents      ${Object.keys(A.intents).length} declared · ${kept.length} carried by both`);
    console.log(`    signals      ${Object.keys(A.signals).length} declared`);
    console.log(`    differences  ${diffs.length} total · ${diffs.length - bad.length - gaps.length} predicted · ${gaps.length} undecided · ${bad.length} drift`);

    if (verbose) {
      for (const d of diffs) {
        const tag = d.verdict === 'predicted' ? 'ok   ' : d.verdict === 'undecided' ? 'gap  ' : 'DRIFT';
        console.log(`      ${tag} ${d.kind} ${d.subject}: ` +
          `${c.media[0]}=${d[c.media[0]]} ${c.media[1]}=${d[c.media[1]]}`);
        console.log(`             ${d.because}`);
      }
    }

    if (gaps.length) {
      undecided += gaps.length;
      console.log(`\n    UNDECIDED — nothing is contradicted; the data is silent, so this pair is not proved:`);
      for (const d of gaps) console.log(`      ${d.kind} ${d.subject}: ${d.because}`);
    }

    if (bad.length) {
      drifted += bad.length;
      console.log(`\n    DRIFT — one declaration judged two ways, unexplained:`);
      for (const d of bad) console.log(`      ${d.kind} ${d.subject}: ${d.because}`);
    }
  }

  console.log('');
  if (drifted) {
    console.log(`  ${drifted} drift(s) — one declaration produced two renderings that diverge`);
    console.log(`  for a reason media.json and signal.json do not explain. This is the failure.`);
    return 1;
  }
  if (undecided) {
    console.log(`  no drift, and ${undecided} difference(s) the data cannot yet speak to.`);
    console.log(`  Nothing here is wrong. The central claim is NOT PROVED for these pairs,`);
    console.log(`  and it will not be until the silent channel records what it renders.`);
    return 1;
  }
  console.log(`  every difference predicted — one declaration, two renderings, nothing lost`);
  console.log(`  that the law protects and the data did not already account for.`);
  return 0;
}

if (require.main === module) process.exit(main(process.argv.slice(2)));
module.exports = { project, compare, carriageOf, signalRendering };
