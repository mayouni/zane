#!/usr/bin/env node
'use strict';
/* ==========================================================================
   parity.js -- the gate of stage S1 (doc/design/BINARY.md section 5): the binary's `zui check` against
   `node tools/zui/cli.js check`, byte for byte.

     node tools/zui/parity.js [--bin PATH] [--seed N] [--per N] [--quiet]

   1. THE FIXTURES. Every fixture of conformance/manifest.json, run by both under four argument sets (--json at
      level 4, text at level 4, text at the default level, --quiet at level 1), with the fixture's symbols when it
      has any. Standard output, standard error and the exit code must be identical, byte for byte.
   2. THE ARGUMENTS. A handful of command lines that are not a check: no command, help, an unknown option, a bad
      level, no file. (`version` is not compared: it names the build, and the JavaScript has none.)
   3. THE CORPUS. A deterministic generator (the seed is the artefact, the corpus is run and never stored) makes
      mutations of the fixtures: a line dropped, a line or the whole declaration duplicated, a verb, a kind, a
      medium or a role swapped, an invalid byte inserted, a character the language lacks inserted (one outside
      the Basic Multilingual Plane among them), line endings changed, and every truncation of the smallest files.
      Both run them in batches; a batch that differs is split until the files are named.

   There are NO allowed differences. One that cannot be removed is written down as a named row and this check
   fails on any other, as haro/twin-expected.csv does; today the list is empty.
   Parity is sameness, not rightness (CENTRAL-PERCEPTGATE-01): a binary that agrees on every input inherits
   every mistake of the JavaScript.

   Exit 0 when everything is identical, 1 when anything differs, 2 when it cannot run.
   ========================================================================== */
const fs = require('fs'), path = require('path'), os = require('os');
const { spawnSync } = require('child_process');
const Z = require('./zui.js');

const ROOT = path.resolve(__dirname, '..', '..');
const CLI = path.join(__dirname, 'cli.js');
const args = process.argv.slice(2);
const opt = (name, dflt) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : dflt; };
const BIN = path.resolve(opt('--bin', path.join(ROOT, 'zig-out', 'bin', process.platform === 'win32' ? 'zui.exe' : 'zui')));
const SEED = +opt('--seed', 20261105);
const PER = +opt('--per', 24);
const QUIET = args.includes('--quiet');
if (!fs.existsSync(BIN)) { console.error(`parity: no binary at ${BIN} (zig build -j2, or --bin PATH)`); process.exit(2); }

const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, 'conformance', 'manifest.json'), 'utf8'));
const FIX = path.join(ROOT, 'conformance', 'fixtures');
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'zui-parity-'));

function run(cmd, argv) {
  const t = process.hrtime.bigint();
  const r = cmd === 'js'
    ? spawnSync(process.execPath, [CLI, ...argv], { cwd: ROOT, encoding: 'buffer', maxBuffer: 1 << 28 })
    : spawnSync(BIN, argv, { cwd: ROOT, encoding: 'buffer', maxBuffer: 1 << 28 });
  if (r.error) throw r.error;
  return { out: r.stdout, err: r.stderr, code: r.status, ms: Number(process.hrtime.bigint() - t) / 1e6 };
}
const same = (a, b) => a.code === b.code && a.out.equals(b.out) && a.err.equals(b.err);
function firstDiff(a, b) {
  for (const k of ['out', 'err']) {
    if (a[k].equals(b[k])) continue;
    let i = 0;
    while (i < a[k].length && i < b[k].length && a[k][i] === b[k][i]) i++;
    const show = buf => JSON.stringify(buf.slice(Math.max(0, i - 40), i + 40).toString('latin1'));
    return `${k === 'out' ? 'stdout' : 'stderr'} differs at byte ${i}: js ${show(a[k])} / zui ${show(b[k])}`;
  }
  return `exit code js ${a.code} / zui ${b.code}`;
}

const differences = [];
const timing = { js: [], zui: [] };
function compare(label, argv, time) {
  const a = run('js', argv), b = run('zui', argv);
  if (time) { timing.js.push(a.ms); timing.zui.push(b.ms); }
  if (!same(a, b)) differences.push(`${label}: ${firstDiff(a, b)}`);
  return same(a, b);
}

// ---- 1. the fixtures ------------------------------------------------------------------------------------
let fixtureRuns = 0;
for (const fx of manifest.fixtures) {
  const file = path.join('conformance', 'fixtures', fx.file);
  const sym = [];
  if (fx.symbols) {
    const s = path.join(TMP, fx.file + '.symbols.json');
    fs.writeFileSync(s, JSON.stringify(fx.symbols));
    sym.push('--symbols', s);
  }
  const sets = [['--json', '--level', '4', ...sym], ['--level', '4', ...sym], [], ['--quiet', '--level', '1']];
  sets.forEach((extra, k) => { compare(`${fx.file} [${extra.join(' ') || 'default'}]`, ['check', file, ...extra], k === 0); fixtureRuns++; });
}
const all = manifest.fixtures.map(f => path.join('conformance', 'fixtures', f.file));
compare('all fixtures in one call, --json', ['check', ...all, '--json', '--level', '4']); fixtureRuns++;
compare('all fixtures in one call, text', ['check', ...all, '--level', '4']); fixtureRuns++;

// ---- 2. the arguments -----------------------------------------------------------------------------------
const argCases = [[], ['--help'], ['check'], ['check', all[0], '--level', '0'], ['check', all[0], '--level', 'x'],
  ['check', all[0], '--level', ' 3abc'], ['check', all[0], '--bogus'], ['frobnicate', all[0]], ['check', all[0], '--level']];
for (const c of argCases) compare(`arguments [${c.join(' ')}]`, c);

// ---- 3. the corpus --------------------------------------------------------------------------------------
function mulberry32(a) { return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const rnd = mulberry32(SEED);
const pick = xs => xs[Math.floor(rnd() * xs.length)];
const VOCAB = [Z.INTENT_VERBS, Z.ZUI_KINDS, Z.MEDIA, Z.TONES, Z.SIGNALS, Z.PERSPECTIVES,
  new Set(['inert', 'navigate', 'reversible', 'irreversible', 'proposal'])].map(s => [...s]);
function swapWord(text) {
  const set = pick(VOCAB);
  const hits = [...text.matchAll(new RegExp(`\\b(${set.join('|')})\\b`, 'g'))];
  if (!hits.length) return null;
  const h = pick(hits);
  const to = rnd() < 0.15 ? h[0].toLowerCase() + 'x' : pick(set);
  return text.slice(0, h.index) + to + text.slice(h.index + h[0].length);
}
const BAD = [[0xFF], [0x80], [0xC3], [0xE2, 0x82], [0xED, 0xA0, 0x80], [0xC0, 0xAF], [0xF4, 0x90, 0x80, 0x80], [0xF0, 0x9F, 0x98]];
const CHARS = ['@', '#', 'é', '€', '😀', ' ', ' ', '﻿', '　', '"'];
function mutate(buf) {
  const text = buf.toString('latin1');
  const lines = text.split('\n');
  switch (Math.floor(rnd() * 8)) {
    case 7: { const at = Math.floor(rnd() * (buf.length + 1)); return ['char', Buffer.concat([buf.slice(0, at), Buffer.from(pick(CHARS)), buf.slice(at)])]; }
    case 0: { lines.splice(Math.floor(rnd() * lines.length), 1); return ['drop', Buffer.from(lines.join('\n'), 'latin1')]; }
    case 1: { const i = Math.floor(rnd() * lines.length); lines.splice(i, 0, lines[i]); return ['dup-line', Buffer.from(lines.join('\n'), 'latin1')]; }
    case 2: return ['dup-all', Buffer.concat([buf, Buffer.from('\n'), buf])];
    case 3: case 4: { const t = swapWord(text); return t ? ['swap', Buffer.from(t, 'latin1')] : null; }
    case 5: { const at = Math.floor(rnd() * (buf.length + 1)); return ['bad-byte', Buffer.concat([buf.slice(0, at), Buffer.from(pick(BAD)), buf.slice(at)])]; }
    default: return ['crlf', Buffer.from(text.replace(/\r?\n/g, rnd() < 0.5 ? '\r\n' : '\r'), 'latin1')];
  }
}
const corpus = [];
for (const fx of manifest.fixtures) {
  const buf = fs.readFileSync(path.join(FIX, fx.file));
  for (let k = 0; k < PER; k++) {
    let m = null;
    for (let tries = 0; !m && tries < 8; tries++) m = mutate(buf);
    if (m) corpus.push({ name: `${fx.file}~${k}-${m[0]}`, data: m[1] });
  }
}
const smallest = manifest.fixtures.map(f => ({ f: f.file, n: fs.statSync(path.join(FIX, f.file)).size })).sort((a, b) => a.n - b.n).slice(0, 4);
for (const s of smallest) {
  const buf = fs.readFileSync(path.join(FIX, s.f));
  for (let i = 0; i < buf.length; i++) corpus.push({ name: `${s.f}~cut${i}`, data: buf.slice(0, i) });
}
const kinds = {};
for (const c of corpus) { const k = c.name.includes('~cut') ? 'truncation' : c.name.split('~')[1].replace(/^\d+-/, ''); kinds[k] = (kinds[k] || 0) + 1; }
corpus.forEach((c, i) => { c.file = path.join(TMP, String(i).padStart(5, '0') + '.zui'); fs.writeFileSync(c.file, c.data); });

function batch(items, extra, label) {
  const argv = ['check', ...items.map(c => c.file), ...extra];
  const a = run('js', argv), b = run('zui', argv);
  if (same(a, b)) return;
  if (items.length === 1) { differences.push(`corpus ${items[0].name} [${extra.join(' ')}] (${items[0].file}): ${firstDiff(a, b)}`); return; }
  const h = items.length >> 1;
  batch(items.slice(0, h), extra, label); batch(items.slice(h), extra, label);
}
const B = 100;
for (let i = 0; i < corpus.length; i += B) {
  batch(corpus.slice(i, i + B), ['--json', '--level', '4']);
  batch(corpus.slice(i, i + B), ['--level', '2']);
}

// ---- the report -----------------------------------------------------------------------------------------
const dist = xs => {
  const s = [...xs].sort((a, b) => a - b), q = p => s[Math.min(s.length - 1, Math.floor(p * s.length))];
  return `min ${s[0].toFixed(1)} · median ${q(0.5).toFixed(1)} · p90 ${q(0.9).toFixed(1)} · max ${s[s.length - 1].toFixed(1)} ms (n=${s.length})`;
};
const kept = differences.length;
if (!QUIET || kept) for (const d of differences.slice(0, 40)) console.log('  DIFF ' + d);
if (kept > 40) console.log(`  ... and ${kept - 40} more`);
console.log(`parity: ${path.relative(ROOT, BIN) || BIN} against tools/zui/cli.js`);
console.log(`  fixtures     ${manifest.fixtures.length}, ${fixtureRuns} command lines`);
console.log(`  arguments    ${argCases.length} command lines`);
console.log(`  corpus       seed ${SEED}, ${corpus.length} inputs (${Object.entries(kinds).map(([k, n]) => `${k} ${n}`).join(', ')}), each in --json at level 4 and in text at level 2`);
console.log(`  timing, one fixture per process, --json at level 4, wall time with process start:`);
console.log(`    node cli.js  ${dist(timing.js)}`);
console.log(`    zui          ${dist(timing.zui)}`);
fs.rmSync(TMP, { recursive: true, force: true });
console.log(kept ? `  ${kept} difference(s); the allowed list is empty` : '  identical -- every byte of stdout and stderr, and every exit code');
process.exit(kept ? 1 : 0);
