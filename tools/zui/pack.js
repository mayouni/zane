#!/usr/bin/env node
/* ==========================================================================
   pack.js — the protocol pack's manifest, generated and verified.

   S13. What a participant downloads and pins, with a hash for every file, so
   "we conform to Zui v3.11" is a checkable claim rather than a sentence in a
   README.

   THE POINT OF HASHING. A version number says which edition you meant. It does
   not say the bytes you have are that edition. Every drift this project has
   recorded came from something being *described* rather than *checked*, so the
   pack ships hashes and a verifier, and pinning means recording this manifest.

   WHAT IS DELIBERATELY NOT HERE. No runtime, no framework, no library. The pack
   is data and prose only, which is what makes an implementation in any language
   possible: agreement is proved by running the fixtures, not by linking code.

   Usage:  node tools/zui/pack.js            write protocol/MANIFEST.json
           node tools/zui/pack.js --check     verify without writing
   Exit:   0 written or verified · 1 a file drifted or is missing · 2 setup
   ========================================================================== */

'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = path.join(__dirname, '..', '..');
const OUT = path.join(ROOT, 'protocol', 'MANIFEST.json');

/* The pack, by role. A file earns a place by being something a participant
   must PIN -- not everything useful, only what a claim of conformance rests
   on. Prose that explains is linked from the README and not hashed here. */
const PACK = [
  { role: 'the law', files: [
    'constitution/rules.json'
  ]},
  { role: 'the language', files: [
    'doc/language/README.md',
    'doc/language/GRAMMAR.md',
    'doc/language/DECLARATIONS.md',
    'doc/language/VIOLATIONS.md'
  ]},
  { role: 'the refusal contract', files: [
    'conformance/violations.json',
    'doc/diagnostic-contract.md',
    'doc/diagnostic-contract.schema.json'
  ]},
  { role: 'the axes', files: [
    'conformance/media.json',
    'conformance/signal.json'
  ]},
  { role: 'the proof', files: [
    'conformance/manifest.json',
    'conformance/cross-medium/spec.json'
  ]}
];

const sha256 = (buf) => crypto.createHash('sha256').update(buf).digest('hex');

/* Line endings must not change a hash. This repository is checked out with
   CRLF on Windows and LF elsewhere, so a byte hash of the working tree would
   differ by platform and every pin would look drifted. Normalise, and say so
   in the manifest rather than leaving a stranger to discover it. */
const normalise = (buf) => Buffer.from(buf.toString('utf8').replace(/\r\n/g, '\n'), 'utf8');

function collect() {
  const entries = [];
  let missing = 0;
  for (const group of PACK) {
    for (const rel of group.files) {
      const abs = path.join(ROOT, rel);
      if (!fs.existsSync(abs)) { console.error(`  MISSING  ${rel}`); missing++; continue; }
      const raw = fs.readFileSync(abs);
      entries.push({
        file: rel,
        role: group.role,
        bytes: normalise(raw).length,
        sha256: sha256(normalise(raw))
      });
    }
  }
  return { entries, missing };
}

function versions() {
  const read = (rel) => JSON.parse(fs.readFileSync(path.join(ROOT, rel), 'utf8'));
  const law = read('constitution/rules.json');
  const sets = Object.keys(law).filter(k => /^set[0-9]+$/.test(k));
  let rules = 0; for (const s of sets) rules += (law[s].rules || []).length;

  const spec = fs.readFileSync(path.join(ROOT, 'doc/language/README.md'), 'utf8')
    .match(/^#\s+The Zui Language\s+—\s+Specification\s+v(\S+)/m);

  const contract = read('conformance/violations.json');
  const fixtures = read('conformance/manifest.json');

  return {
    constitution: law.metadata.version,
    rules,
    forbiddenPatterns: (law.forbidden || []).length,
    language: spec ? spec[1] : '(unreadable)',
    refusalContract: contract.metadata.version,
    diagnostics: contract.diagnostics.length,
    media: read('conformance/media.json').media.length,
    signalValues: read('conformance/signal.json').values.length,
    fixtures: fixtures.fixtures.length
  };
}

/* The pack's own README states counts in prose. Prose drifts -- that is the most
   repeated finding in this project's ledger -- so the numbers it claims are
   checked against the manifest rather than trusted. Each pattern below anchors
   on enough surrounding words to mean one thing. */
function readmeClaims(v, pinnedCount) {
  const p = path.join(ROOT, 'protocol', 'README.md');
  if (!fs.existsSync(p)) return ['protocol/README.md is missing'];
  const md = fs.readFileSync(p, 'utf8');
  const bad = [];
  const claim = (label, re, expect) => {
    const m = md.match(re);
    if (!m) { bad.push(`README states no ${label}`); return; }
    if (String(m[1]) !== String(expect)) bad.push(`README says ${label} is ${m[1]}, manifest says ${expect}`);
  };
  claim('the rule count',        /(\d+) rules, 7 articles/,             v.rules);
  claim('the forbidden count',   /(\d+) forbidden patterns/,            v.forbiddenPatterns);
  claim('the diagnostic count',  /(\d+) diagnostics with severities/,   v.diagnostics);
  claim('the fixture count',     /(\d+) fixtures with known verdicts/,  v.fixtures);
  claim('the pinned-file count', /\*\*(\d+) files, no runtime/,         pinnedCount);
  claim('the law version',       /conforms to Zui v(\S+?) at level/,    v.constitution);
  return bad;
}

function main(argv) {
  const check = argv.includes('--check');
  const { entries, missing } = collect();
  if (missing) { console.error(`\npack: ${missing} pinned file(s) missing`); return 1; }

  const v = versions();
  const manifest = {
    metadata: {
      title: 'The Zui Protocol Pack',
      version: '1.0',
      generated: 'by tools/zui/pack.js -- never hand-edited',
      note: 'Every file a participant pins, with a hash. Pinning means recording this manifest: a version number says which edition you MEANT, and a hash says the bytes you HAVE are that edition. Hashes are over content with CRLF normalised to LF, so a pin does not differ by platform.',
      hash: 'sha256 over LF-normalised content'
    },
    versions: v,
    pinned: entries
  };

  const text = JSON.stringify(manifest, null, 2) + '\n';

  console.log(`\nThe Zui protocol pack`);
  console.log(`  law          v${v.constitution} — ${v.rules} rules, ${v.forbiddenPatterns} forbidden patterns`);
  console.log(`  language     v${v.language} — ${v.diagnostics} diagnostics`);
  console.log(`  axes         ${v.media} media, ${v.signalValues} semantic values`);
  console.log(`  proof        ${v.fixtures} fixtures + the cross-medium spec`);
  console.log(`  pinned       ${entries.length} files, sha256 over LF-normalised content`);

  const claims = readmeClaims(v, entries.length);
  console.log(`  README       ${claims.length ? claims.length + ' claim(s) disagree with the manifest' : 'every count on the page matches the manifest'}`);
  if (claims.length) {
    console.log('');
    for (const c of claims) console.log(`    ${c}`);
    console.log(`\n  The pack's own prose must not drift from the pack.`);
    return 1;
  }

  if (check) {
    if (!fs.existsSync(OUT)) { console.error(`\n  no manifest at protocol/MANIFEST.json — run without --check`); return 1; }
    const have = JSON.parse(fs.readFileSync(OUT, 'utf8'));
    const byFile = new Map(have.pinned.map(p => [p.file, p]));
    const drift = [];
    for (const e of entries) {
      const was = byFile.get(e.file);
      if (!was) { drift.push(`${e.file}: not in the manifest`); continue; }
      if (was.sha256 !== e.sha256) drift.push(`${e.file}: content changed since the manifest was written`);
      byFile.delete(e.file);
    }
    for (const left of byFile.keys()) drift.push(`${left}: in the manifest and no longer in the pack`);

    if (drift.length) {
      console.log(`\n  ${drift.length} drift(s) between the tree and protocol/MANIFEST.json:`);
      for (const d of drift) console.log(`    ${d}`);
      console.log(`\n  Regenerate deliberately -- a manifest that follows the tree automatically`);
      console.log(`  pins nothing. Decide the version moved, then run without --check.`);
      return 1;
    }
    console.log(`\n  verified — every pinned file matches the manifest`);
    return 0;
  }

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, text, 'utf8');
  console.log(`\n  written — protocol/MANIFEST.json`);
  return 0;
}

if (require.main === module) process.exit(main(process.argv.slice(2)));
module.exports = { collect, versions, PACK };
