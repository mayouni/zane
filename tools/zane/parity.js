#!/usr/bin/env node
'use strict';
/* ==========================================================================
   parity.js -- the gate of stages S1 and S2 (doc/design/BINARY.md section 5): the binary's `zane check` against
   `node tools/zane/cli.js check`, and its `conformance`, `pack`, `cross-medium` and `audit-facts` against the
   scripts they replace (conformance.js, pack.js, cross-medium.js, doc/design/audit/check-facts.js), byte for byte.

     node tools/zane/parity.js [--bin PATH] [--seed N] [--per N] [--quiet] [--write-wasm-proof]

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
   4. THE SUITE. `zane conformance` against `node tools/zane/conformance.js` under every level, --verbose and -v,
      and the bad levels; and the time each takes, in one process each, as a distribution.
   5. THE TOOLS. `zane pack` (--check, and the manifest it writes, compared and put back; then its inputs broken one
      at a time and put back: a pinned file changed, in CRLF only, one and two missing, the README's counts wrong,
      absent and missing, the manifest missing, short an entry, long an entry, and a hash altered), `zane cross-medium` (the
      spec, --verbose, and generated specs pairing every channel), and `zane audit-facts` (the example, --rules, and
      facts files broken one way each: schema, pairing, arithmetic, and every branch of the two decisions).
   6. THE WASM PROOF'S RECORD. tools/zane/wasm-proof.json, the envelopes this binary prints for every fixture at every
      level with the sha256 of site/zane.wasm, which tools/zane/wasm-proof.html compares with the wasm in a browser.
      --write-wasm-proof writes it; otherwise a record that no longer matches is a difference.

   There are NO allowed differences. One that cannot be removed is written down as a named row and this check
   fails on any other, as haro/twin-expected.csv does; today the list is empty.
   Parity is sameness, not rightness (CENTRAL-PERCEPTGATE-01): a binary that agrees on every input inherits
   every mistake of the JavaScript.

   Exit 0 when everything is identical, 1 when anything differs, 2 when it cannot run.
   ========================================================================== */
const fs = require('fs'), path = require('path'), os = require('os');
const { spawnSync } = require('child_process');
const Z = require('./zane.js');

const ROOT = path.resolve(__dirname, '..', '..');
const CLI = path.join(__dirname, 'cli.js');
const args = process.argv.slice(2);
const opt = (name, dflt) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : dflt; };
const BIN = path.resolve(opt('--bin', path.join(ROOT, 'zig-out', 'bin', process.platform === 'win32' ? 'zane.exe' : 'zane')));
const SEED = +opt('--seed', 20261105);
const PER = +opt('--per', 24);
const QUIET = args.includes('--quiet');
if (!fs.existsSync(BIN)) { console.error(`parity: no binary at ${BIN} (zig build -j2, or --bin PATH)`); process.exit(2); }

/* One run at a time in one tree. The pack's failure paths and the wasm proof's record write into the tree, so two runs at once
   break each other's inputs: found 2026-11-06, when two overlapping runs left protocol/README.md deleted and made conformance.js
   read a media.json the other run was holding broken. The lock is a file in .git holding the run's pid; a lock whose process is
   gone is taken over, and a live one stops this run. */
const GIT = path.join(ROOT, '.git');
const LOCK = fs.existsSync(GIT) && fs.statSync(GIT).isDirectory() ? path.join(GIT, 'zane-parity.lock') : path.join(ROOT, '.zane-parity.lock');
for (let tries = 0; ; tries++) {
  try { fs.writeFileSync(LOCK, String(process.pid), { flag: 'wx' }); break; } catch (e) {
    if (e.code !== 'EEXIST' || tries > 0) throw e;
    const pid = +fs.readFileSync(LOCK, 'utf8');
    let alive = false;
    try { process.kill(pid, 0); alive = true; } catch (k) { alive = k.code === 'EPERM'; }
    if (alive) { console.error(`parity: another run (pid ${pid}) holds ${path.relative(ROOT, LOCK)}; two runs in one tree break each other's inputs, so this one stops`); process.exit(2); }
    fs.unlinkSync(LOCK);
  }
}
process.on('exit', () => { try { if (fs.readFileSync(LOCK, 'utf8') === String(process.pid)) fs.unlinkSync(LOCK); } catch { /* already gone */ } });

const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, 'conformance', 'manifest.json'), 'utf8'));
const FIX = path.join(ROOT, 'conformance', 'fixtures');
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'zane-parity-'));
/* Windows may refuse a file for a moment after a process has used it (a scanner reading a file just written): EBUSY, EPERM, EACCES
   or UNKNOWN. A write or a delete of a file of the tree is retried for up to two seconds before it fails (found 2026-11-06, when a
   refused write left protocol/MANIFEST.json broken). */
const pause = ms => Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
const firm = fn => { for (let i = 0; ; i++) { try { return fn(); } catch (e) { if (i >= 40 || !['EBUSY', 'EPERM', 'EACCES', 'UNKNOWN'].includes(e.code)) throw e; pause(50); } } };
const put = (file, data) => firm(() => fs.writeFileSync(file, data));
const drop = file => firm(() => fs.unlinkSync(file));

function run(cmd, argv, script) {
  const t = process.hrtime.bigint();
  const r = cmd === 'js'
    ? spawnSync(process.execPath, [script || CLI, ...argv], { cwd: ROOT, encoding: 'buffer', maxBuffer: 1 << 28 })
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
    return `${k === 'out' ? 'stdout' : 'stderr'} differs at byte ${i}: js ${show(a[k])} / zane ${show(b[k])}`;
  }
  return `exit code js ${a.code} / zane ${b.code}`;
}

const differences = [];
const timing = { js: [], zane: [] };
function compare(label, argv, time) {
  const a = run('js', argv), b = run('zane', argv);
  if (time) { timing.js.push(a.ms); timing.zane.push(b.ms); }
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

// ---- 4. the suite: zane conformance against conformance.js (run before the corpus, which loads the machine) ----
const CONF = path.join(__dirname, 'conformance.js');
const confCases = [[], ['--level', '1'], ['--level', '2'], ['--level', '3'], ['--level', '4'], ['--verbose'], ['-v', '--level', '2'],
  ['--level', '0'], ['--level', '5'], ['--level', 'x'], ['--level'], ['--level', ' 3abc'], ['stray', '--level', '3']];
const confTiming = { js: [], zane: [] };
for (const c of confCases) {
  const a = run('js', c, CONF), b = run('zane', ['conformance', ...c]);
  if (!same(a, b)) differences.push(`conformance [${c.join(' ') || 'default'}]: ${firstDiff(a, b)}`);
}
for (let k = 0; k < 10; k++) { confTiming.js.push(run('js', [], CONF).ms); confTiming.zane.push(run('zane', ['conformance']).ms); }

// ---- 5. the tools: pack, cross-medium, audit-facts ----
let toolRuns = 0;
function compareTool(label, script, sub, argv) {
  const a = run('js', argv, script), b = run('zane', [sub, ...argv]);
  if (!same(a, b)) differences.push(`${sub} [${argv.join(' ') || 'default'}]${label ? ' ' + label : ''}: ${firstDiff(a, b)}`);
  toolRuns++;
}
const PACK = path.join(__dirname, 'pack.js'), XM = path.join(__dirname, 'cross-medium.js'), FACTS = path.join(ROOT, 'doc', 'design', 'audit', 'check-facts.js');
compareTool('', PACK, 'pack', ['--check']);
compareTool('', PACK, 'pack', ['--check', 'stray']);
{ // the write mode: both write protocol/MANIFEST.json; compare what each wrote, then put the file back
  const M = path.join(ROOT, 'protocol', 'MANIFEST.json'), keep = fs.readFileSync(M);
  try {
    const a = run('js', [], PACK); const wa = fs.readFileSync(M);
    put(M, keep);
    const b = run('zane', ['pack']); const wb = fs.readFileSync(M);
    if (!same(a, b)) differences.push(`pack [write]: ${firstDiff(a, b)}`);
    if (!wa.equals(wb)) differences.push('pack [write]: the manifests written differ');
    toolRuns++;
  } finally { put(M, keep); }
}
{ // the failure paths: break one input, run both on it (each on a freshly broken tree), compare what each printed and left behind, put it back
  const P = rel => path.join(ROOT, rel), MAN = 'protocol/MANIFEST.json', RD = 'protocol/README.md';
  const edit = (rel, f) => put(P(rel), f(fs.readFileSync(P(rel), 'utf8')));
  const editMan = f => { const m = JSON.parse(fs.readFileSync(P(MAN), 'utf8')); f(m); put(P(MAN), JSON.stringify(m, null, 2) + '\n'); };
  const BOTH = [['--check'], []], CHECK = [['--check']];
  const CASES = [
    ['a pinned file changed', ['doc/language/VIOLATIONS.md'], () => edit('doc/language/VIOLATIONS.md', t => t + 'x\n'), BOTH],
    ['a pinned file in CRLF only', ['doc/language/GRAMMAR.md'], () => edit('doc/language/GRAMMAR.md', t => t.replace(/\r\n/g, '\n').replace(/\n/g, '\r\n')), BOTH],
    ['a pinned file missing', ['conformance/signal.json'], () => drop(P('conformance/signal.json')), BOTH],
    ['two pinned files missing', ['conformance/signal.json', 'doc/diagnostic-contract.md'], () => { drop(P('conformance/signal.json')); drop(P('doc/diagnostic-contract.md')); }, BOTH],
    ['the README with a wrong count', [RD], () => edit(RD, t => t.replace(/(\d+) rules, 7 articles/, (m, k) => (+k + 1) + ' rules, 7 articles')), BOTH],
    ['the README without a count', [RD], () => edit(RD, t => t.replace(/(\d+) fixtures with known verdicts/, 'fixtures with known verdicts')), BOTH],
    ['the README missing', [RD], () => drop(P(RD)), BOTH],
    ['the manifest missing', [MAN], () => drop(P(MAN)), CHECK],
    ['the manifest short an entry', [MAN], () => editMan(m => { m.pinned = m.pinned.filter(e => e.file !== 'conformance/media.json'); }), CHECK],
    ['the manifest long an entry', [MAN], () => editMan(m => { m.pinned.push({ file: 'doc/gone.md', role: 'x', bytes: 1, sha256: '0' }); }), CHECK],
    ['a hash altered', [MAN], () => editMan(m => { m.pinned[0].sha256 = (m.pinned[0].sha256[0] === '0' ? '1' : '0') + m.pinned[0].sha256.slice(1); }), CHECK],
  ];
  const left = () => fs.existsSync(P(MAN)) ? fs.readFileSync(P(MAN)) : null;
  /* every file a case breaks is read ONCE, before any case runs, and every restore writes those bytes back: a snapshot taken per
     case would record a file an earlier case failed to put back as absent, and its restore would then delete it (found
     2026-11-06, when protocol/README.md was left deleted). A file missing before the first case stops the block; a file not back
     byte for byte after the last is a difference. */
  const touched = [...new Set([MAN, ...CASES.flatMap(c => c[1])])];
  const missing = touched.filter(f => !fs.existsSync(P(f)));
  if (missing.length) { differences.push(`pack failure paths not run: ${missing.join(', ')} missing before the first case`); CASES.length = 0; }
  const ORIGINAL = new Map(touched.filter(f => fs.existsSync(P(f))).map(f => [f, fs.readFileSync(P(f))]));
  for (const [name, files, breakIt, modes] of CASES) {
    const restore = () => { for (const f of [...files, MAN]) put(P(f), ORIGINAL.get(f)); };
    try {
      for (const argv of modes) {
        breakIt(); const a = run('js', argv, PACK), wa = left(); restore();
        breakIt(); const b = run('zane', ['pack', ...argv]), wb = left(); restore();
        const label = `pack [${argv.join(' ') || 'write'}] ${name}`;
        if (!same(a, b)) differences.push(`${label}: ${firstDiff(a, b)}`);
        else if (wa === null ? wb !== null : wb === null || !wa.equals(wb)) differences.push(`${label}: the manifests left behind differ`);
        toolRuns++;
      }
    } finally { restore(); }
  }
  for (const [f, b] of ORIGINAL) if (!fs.existsSync(P(f)) || !fs.readFileSync(P(f)).equals(b)) {
    put(P(f), b);
    differences.push(`pack failure paths: ${f} was not back byte for byte after the cases (written back now)`);
  }
}
compareTool('', XM, 'cross-medium', []);
compareTool('', XM, 'cross-medium', ['--verbose']);
{ // generated specs: the one declaration under every pair of channels, the same channel twice, and one nobody enumerates
  const ids = JSON.parse(fs.readFileSync(path.join(ROOT, 'conformance', 'media.json'), 'utf8')).media.map(m => m.id);
  const pairs = [];
  for (const x of ids) for (const y of ids) if (x !== y) pairs.push([x, y]);
  pairs.push(['visual', 'visual'], ['visual', 'telepathy'], ['telepathy', 'print']);
  for (let i = 0; i < pairs.length; i += 15) {
    const s = path.join(TMP, `xm-${i}.json`);
    fs.writeFileSync(s, JSON.stringify({ cases: pairs.slice(i, i + 15).map(m => ({ file: 'invoice-review.zane', media: m })) }));
    compareTool('(generated)', XM, 'cross-medium', [s, '--verbose']);
  }
}
compareTool('', FACTS, 'audit-facts', []);
compareTool('', FACTS, 'audit-facts', ['doc/design/audit/example.facts.json']);
compareTool('', FACTS, 'audit-facts', ['--rules', '62,105']);
compareTool('', FACTS, 'audit-facts', ['--rules', '62,999,', 'doc/design/audit/example.facts.json']);
{ // facts files broken one way each
  const ex = JSON.parse(fs.readFileSync(path.join(ROOT, 'doc', 'design', 'audit', 'example.facts.json'), 'utf8'));
  const L = (i, f) => (e) => { f(e.lines[i]); };
  const breaks = {
    'old-name': e => { e.format = 'zui-audit-facts'; e.version = '1.0'; },
    'crossed-pair': e => { e.version = '1.0'; },
    'bad-format': e => { e.format = 'other'; },
    'no-capture': e => { delete e.capture; },
    'unknown-field': e => { e.extra = 1; },
    'bad-sha': e => { e.capture.image_sha256 = 'abc'; },
    'good-sha': e => { e.capture.image_sha256 = 'a'.repeat(64); },
    'bad-scale': e => { e.capture.scale = 0; },
    'string-width': e => { e.capture.width_px = '1280'; },
    'ink-boxes': e => { e.capture.box_kind = 'ink'; },
    'repeated-id': e => { e.lines[1].id = 'L1'; },
    'bad-id': e => { e.lines[0].id = 'X1'; },
    'short-box': e => { e.lines[0].box = [1, 2, 3]; },
    'reversed-box': L(0, l => { l.box = [396, 412, 120, 436]; }),
    'box-outside': L(0, l => { l.box = [120, 412, 1396, 436]; }),
    'line-height': L(0, l => { l.line_height_px = 25; }),
    'line-pt': L(0, l => { l.line_height_pt = 9.5; }),
    'ratio-wrong': L(0, l => { l.contrast_ratio = 3.1; }),
    'ratio-null': L(0, l => { l.contrast_ratio = null; }),
    'lum-null': L(0, l => { l.fg_luminance = null; l.contrast_ratio = null; }),
    'low-score': L(1, l => { l.score = 0.3; }),
    'score-above-1': L(1, l => { l.score = 1.2; }),
    'spread-high': L(1, l => { l.bg_spread = 0.3; }),
    'spread-null': L(1, l => { l.bg_spread = null; }),
    'spread-missing-fail': L(0, l => { delete l.bg_spread; }),
    'worst-end-pass': L(1, l => { l.bg_spread = 0.02; }),
    'big-text': L(0, l => { l.box = [120, 412, 396, 460]; l.line_height_px = 48; l.line_height_pt = 18; }),
    'one-line': e => { e.lines = e.lines.slice(0, 1); },
    'no-lines': e => { e.lines = []; },
  };
  for (const [name, f] of Object.entries(breaks)) {
    const e = JSON.parse(JSON.stringify(ex)); f(e);
    const file = path.join(TMP, `facts-${name}.json`); fs.writeFileSync(file, JSON.stringify(e, null, 2));
    compareTool(name, FACTS, 'audit-facts', [file]);
  }
}

// ---- 3. the corpus --------------------------------------------------------------------------------------
function mulberry32(a) { return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const rnd = mulberry32(SEED);
const pick = xs => xs[Math.floor(rnd() * xs.length)];
const VOCAB = [Z.INTENT_VERBS, Z.ZANE_KINDS, Z.MEDIA, Z.TONES, Z.SIGNALS, Z.PERSPECTIVES,
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
corpus.forEach((c, i) => { c.file = path.join(TMP, String(i).padStart(5, '0') + '.zane'); fs.writeFileSync(c.file, c.data); });

function batch(items, extra, label) {
  const argv = ['check', ...items.map(c => c.file), ...extra];
  const a = run('js', argv), b = run('zane', argv);
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

// ---- 6. the wasm proof's record: written from the binary under test, never typed ------------------------
/* tools/zane/wasm-proof.html runs every fixture at every level through site/zane.wasm in a browser and compares with what this
   binary prints for `check NAME --json --level N` (with the fixture's symbols). The record of those envelopes is made here: with
   --write-wasm-proof it is written, and without it a record that no longer matches the binary or the wasm is a difference. */
const PROOF = path.join(__dirname, 'wasm-proof.json'), WASM = path.join(ROOT, 'site', 'zane.wasm');
let proofNote = 'site/zane.wasm absent: the wasm proof\'s record not checked';
if (fs.existsSync(WASM)) {
  const proofFixtures = manifest.fixtures.map(fx => {
    const name = 'conformance/fixtures/' + fx.file;
    const sym = [];
    if (fx.symbols) { const s = path.join(TMP, fx.file + '.proof-symbols.json'); fs.writeFileSync(s, JSON.stringify(fx.symbols)); sym.push('--symbols', s); }
    const expect = {};
    for (const level of [1, 2, 3, 4]) expect[level] = run('zane', ['check', name, '--json', '--level', String(level), ...sym]).out.toString('utf8');
    return { name, symbols: fx.symbols || null, source: fs.readFileSync(path.join(ROOT, name), 'utf8'), expect };
  });
  const wasmBytes = fs.readFileSync(WASM);
  const record = {
    about: 'Written by node tools/zane/parity.js --write-wasm-proof from the native binary; never edited by hand. tools/zane/wasm-proof.html runs the same sources through site/zane.wasm and compares.',
    wasm: { file: 'site/zane.wasm', bytes: wasmBytes.length, sha256: require('crypto').createHash('sha256').update(wasmBytes).digest('hex') },
    fixtures: proofFixtures
  };
  const text = JSON.stringify(record, null, 1) + '\n';
  const what = `${proofFixtures.length} fixtures at 4 levels = ${proofFixtures.length * 4} envelopes, for zane.wasm ${record.wasm.sha256.slice(0, 12)} (${record.wasm.bytes} bytes)`;
  if (args.includes('--write-wasm-proof')) { fs.writeFileSync(PROOF, text); proofNote = 'written -- ' + what; }
  else if (!fs.existsSync(PROOF) || fs.readFileSync(PROOF, 'utf8').replace(/\r\n/g, '\n') !== text) {
    differences.push('tools/zane/wasm-proof.json is stale against this binary or site/zane.wasm (run with --write-wasm-proof)');
    proofNote = 'STALE';
  } else proofNote = 'current -- ' + what;
}

// ---- the report -----------------------------------------------------------------------------------------
const dist = xs => {
  const s = [...xs].sort((a, b) => a - b), q = p => s[Math.min(s.length - 1, Math.floor(p * s.length))];
  return `min ${s[0].toFixed(1)} · median ${q(0.5).toFixed(1)} · p90 ${q(0.9).toFixed(1)} · max ${s[s.length - 1].toFixed(1)} ms (n=${s.length})`;
};
const kept = differences.length;
if (!QUIET || kept) for (const d of differences.slice(0, 40)) console.log('  DIFF ' + d);
if (kept > 40) console.log(`  ... and ${kept - 40} more`);
console.log(`parity: ${path.relative(ROOT, BIN) || BIN} against tools/zane/cli.js`);
console.log(`  fixtures     ${manifest.fixtures.length}, ${fixtureRuns} command lines`);
console.log(`  arguments    ${argCases.length} command lines`);
console.log(`  suite        ${confCases.length} command lines of zane conformance against conformance.js`);
console.log(`  tools        ${toolRuns} command lines of zane pack, cross-medium and audit-facts against their scripts`);
console.log(`  corpus       seed ${SEED}, ${corpus.length} inputs (${Object.entries(kinds).map(([k, n]) => `${k} ${n}`).join(', ')}), each in --json at level 4 and in text at level 2`);
console.log(`  wasm proof   ${proofNote}`);
console.log(`  timing, one fixture per process, --json at level 4, wall time with process start:`);
console.log(`    node cli.js  ${dist(timing.js)}`);
console.log(`    zane         ${dist(timing.zane)}`);
console.log(`  timing, the whole suite in one process, default level, wall time with process start:`);
console.log(`    node conformance.js  ${dist(confTiming.js)}`);
console.log(`    zane conformance     ${dist(confTiming.zane)}`);
fs.rmSync(TMP, { recursive: true, force: true });
console.log(kept ? `  ${kept} difference(s); the allowed list is empty` : '  identical -- every byte of stdout and stderr, and every exit code');
process.exit(kept ? 1 : 0);
