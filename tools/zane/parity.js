#!/usr/bin/env node
'use strict';
/* ==========================================================================
   parity.js -- the gate of stages S1 and S2 (doc/design/BINARY.md section 5): the binary's `zane check` against
   `node tools/zane/cli.js check`, and its `conformance`, `pack`, `cross-medium` and `audit-facts` against the
   scripts they replace (conformance.js, pack.js, cross-medium.js, doc/design/audit/check-facts.js), byte for byte.

     node tools/zane/parity.js [--bin PATH] [--seed N] [--per N] [--quiet] [--write-wasm-proof] [--only site] [--list-site]

   1. THE FIXTURES. Every fixture of conformance/manifest.json, run by both under four argument sets (--json at
      level 4, text at level 4, text at the default level, --quiet at level 1), with the fixture's symbols when it
      has any. Standard output, standard error and the exit code must be identical, byte for byte.
   2. THE ARGUMENTS. A handful of command lines that are not a check: no command, help, an unknown option, a bad
      level, no file. (`version` and `--version` are not compared: they name the build, and the JavaScript has none.)
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
   7. THE SITE'S OWN TOOLS (stage S5). `zane site facts`, `zane site shell` and `zane site grid` against
      tools/site-facts.js, site-shell.js and site-grid.js: on the tree as it is, in their --write modes (what each
      wrote compared, then put back), and on the tree broken one input at a time, each break aimed at one check: both
      must fail, print the same bytes and leave the same files, and the JavaScript's output must hold the check's own
      words, so a case that fails for another reason is caught. Run FIRST; every file a case touches is read once
      before any case and written back after each run, and a file not back byte for byte at the end is a difference.
      --only site runs this section alone and names the six it skipped; --list-site prints one line per case.

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
const ONLY = opt('--only', null);
const LIST_SITE = args.includes('--list-site');
if (ONLY !== null && ONLY !== 'site') { console.error(`parity: --only takes "site", not "${ONLY}"`); process.exit(2); }
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

// ---- 7. this site's own tools (stage S5), run first ------------------------------------------------------
const wall = {};
let siteRuns = 0, siteCases = 0;
const siteLines = [];
{
  const t0 = Date.now();
  const P = rel => path.join(ROOT, rel);
  const TOOL = { facts: P('tools/site-facts.js'), shell: P('tools/site-shell.js'), grid: P('tools/site-grid.js') };
  const htmlUnder = d => { const out = []; const w = x => { for (const e of fs.readdirSync(P(x), { withFileTypes: true })) { const q = x + '/' + e.name; if (e.isDirectory()) w(q); else if (q.endsWith('.html')) out.push(q); } }; w(d); return out; };
  /* every file the three tools write (the pages, site/facts.json) and every file a case breaks, read once; and the one file a case creates */
  const KEEP = [...new Set(['index.html', ...htmlUnder('site'), ...htmlUnder('tools'), ...htmlUnder('constitution/reader'), 'site/facts.json',
    'site/stz.css', 'site/gotchas.css', 'site/stz.js', 'haro/twin-expected.csv', 'doc/design/coverage-placement.json', 'README.md', 'doc/releases/v0.1.0.md', 'site/menu.zane'])];
  const NEW = ['site/extra.html'];
  const ALL = [...KEEP, ...NEW];
  const missing = KEEP.filter(f => !fs.existsSync(P(f)));
  const present = NEW.filter(f => fs.existsSync(P(f)));
  if (missing.length || present.length) differences.push(`site tools not run: ${[...missing.map(f => f + ' missing'), ...present.map(f => f + ' present')].join(', ')} before the first case`);
  else {
    const ORIGINAL = new Map(KEEP.map(f => [f, fs.readFileSync(P(f))]));
    const state = () => ALL.map(f => fs.existsSync(P(f)) ? fs.readFileSync(P(f)) : null);
    const changed = (s0, s1) => ALL.filter((f, i) => s0[i] === null ? s1[i] !== null : s1[i] === null || !s0[i].equals(s1[i]));
    const restore = () => { for (const [f, b] of ORIGINAL) if (!fs.existsSync(P(f)) || !fs.readFileSync(P(f)).equals(b)) put(P(f), b); for (const f of NEW) if (fs.existsSync(P(f))) drop(P(f)); };
    const base = state();
    const edit = (rel, fn) => { const t = fs.readFileSync(P(rel), 'utf8'); const u = fn(t); if (u === t) throw new Error(`the break changed nothing in ${rel}`); put(P(rel), u); };
    const sub1 = (rel, re, to) => edit(rel, t => t.replace(re, to));
    const before = (rel, marker, ins) => edit(rel, t => { const i = t.indexOf(marker); return i < 0 ? t : t.slice(0, i) + ins + t.slice(i); });
    const gridCell = () => sub1('site/grid.html', /(<!-- grid:table -->[\s\S]*?<td class="g-has"><b>)(\d+)/, (m, k, n) => k + (+n + 1));
    const channelsRow = () => sub1('site/media.html', /(<!-- channels:table -->[\s\S]*?<td>)(\d+)( of \d+<\/td>)/, (m, k, n, r) => k + (+n + 1) + r);
    const placement = () => sub1('doc/design/coverage-placement.json', /("activities": ")PD(")/, '$1PDA$2');
    const CHECK = [[]];
    /* [tool, the break, how it is made, the command lines, 'pass' | 'fail' | 'any', the words of the check it aims at] */
    const CASES = [
      ['facts', 'the tree as it is', null, [[], ['--unchecked'], ['--write']], 'pass', ''],
      ['facts', 'site/facts.json stale by one figure', () => sub1('site/facts.json', /("law\.rules": )(\d+)/, (m, k, n) => k + (+n + 1)), [[], ['--write']], 'fail', 'site/facts.json is stale: law.rules'],
      ['facts', 'site/facts.json stale in its text only', () => sub1('site/facts.json', /\{\n  "_about"/, '{\n "_about"'), CHECK, 'fail', 'site/facts.json is stale: its text differs'],
      ['facts', 'site/facts.json missing', () => drop(P('site/facts.json')), [[], ['--write']], 'fail', 'site/facts.json is missing'],
      ['facts', 'a fact span reads a wrong figure', () => sub1('site/how.html', /(data-fact="[^"]*"[^>]*>)([^<]*)</, (m, k, v) => k + v + '9<'), CHECK, 'fail', 'and the tree says'],
      ['facts', 'a span names a figure nothing derives', () => sub1('site/thinking.html', /data-fact="[^"]*"/, 'data-fact="no.such.figure"'), CHECK, 'fail', 'names a figure this script does not derive'],
      ['facts', 'a law-share span reads a wrong share', () => sub1('site/rules.html', /(data-law-share="[^"]*">)(\d+)%/, (m, k, n) => k + (+n + 1) + '%'), CHECK, 'fail', 'law-share "'],
      ['facts', 'a typed number outside any span', () => before('site/web.html', '</main>', '<p>We counted 4242 things.</p>\n'), [[], ['--unchecked']], 'fail', 'typed number(s) outside a span'],
      ['facts', 'a verifier terminal differs from a real run', () => sub1('site/how.html', /(<pre class="term"><span class="dim">\$ zane check [^\n]*\n[^\n]*?)error/, '$1warning'), CHECK, 'fail', 'is not what a real run prints'],
      ['facts', 'site/how.html loses its declaration and terminal pairs', () => sub1('site/how.html', /<pre class="shot">/g, '<pre class="shot plain">'), CHECK, 'fail', 'site/how.html: its pair has no declaration and terminal to verify'],
      ['facts', 'an excerpt names a file that does not exist', () => sub1('site/haro.html', 'data-excerpt="haro/zane.stzu"', 'data-excerpt="haro/zane-gone.stzu"'), CHECK, 'fail', 'which does not exist'],
      ['facts', 'an excerpt shows a line its file lacks', () => sub1('site/haro.html', /(<pre class="excerpt" data-excerpt="[^"]*">)/, '$1DEFINE NOTHING AT ALL\n'), CHECK, 'fail', 'shows a line the file does not contain'],
      ['facts', 'a terminal names a command outside the pack', () => sub1('site/conformance.html', 'data-run="zane pack --check"', 'data-run="zane serve --port 8770"'), CHECK, 'fail', 'is not a pack command'],
      ['facts', 'a terminal whose first line is not its command', () => sub1('site/conformance.html', '<span class="dim">$ zane pack --check</span>', '<span class="dim">$ zane pack --chek</span>'), CHECK, 'fail', 'is not that command'],
      ['facts', 'an excerpt of a run with a line the run never prints', () => sub1('site/screenshots.html', 'doc/design/audit/example.facts.json: valid; 3 line(s)</pre>', 'doc/design/audit/example.facts.json: valid; 4 line(s)</pre>'), CHECK, 'fail', 'is not what a real run prints'],
      ['facts', 'an excerpt of a run in the wrong order', () => sub1('site/media.html', /(\n…\n)(  invoice-review\.zane  —  visual vs auditory\n(?:.*\n){3})…<\/pre>/, (m, x, blk) => '\n…\n' + blk.replace('5 total', '6 total') + '…</pre>'), CHECK, 'fail', 'is not what a real run prints'],
      ['facts', 'a terminal differs from what its command prints', () => sub1('site/conformance.html', /(data-run="zane conformance">[\s\S]*?)level 4/, '$1level 3'), CHECK, 'fail', 'the terminal for "zane conformance" is not what a real run prints'],
      ['facts', 'the grid table drifts from its data', gridCell, CHECK, 'fail', 'the grid:table differs from the data'],
      ['facts', 'the channels table drifts from its data', channelsRow, CHECK, 'fail', 'the channels:table differs from the data'],
      ['facts', 'a status word that is not one of three', () => sub1('site/conformance.html', 'class="status exists">exists<', 'class="status maybe">maybe<'), CHECK, 'fail', 'is not one of exists, designed, held'],
      ['facts', 'a status whose class disagrees with its word', () => sub1('site/conformance.html', 'class="status exists">exists<', 'class="status held">exists<'), CHECK, 'fail', 'so its mark would be wrong'],
      ['facts', 'a primary button in the head of a reading page', () => sub1('site/why.html', '<header class="page">', '<header class="page"><a class="btn primary" href="adopt.html">Adopt</a>'), CHECK, 'fail', 'the head of a reading page carries a primary button'],
      ['facts', 'a primary button that scrolls within its page', () => before('site/why.html', '</main>', '<a class="btn primary" href="#top">Up</a>\n'), CHECK, 'fail', 'scrolls within its own page'],
      ['facts', 'a row added to haro/twin-expected.csv', () => edit('haro/twin-expected.csv', t => t.replace(/\n?$/, '\n') + 'parity-made.zane,(clean),X,S99,other-code\n'), CHECK, 'fail', 'twin.differences'],
      ['facts', 'a rule placed on one more activity', placement, CHECK, 'fail', 'the grid:table differs from the data'],

      ['shell', 'the tree as it is', null, [[], ['--write']], 'pass', ''],
      ['shell', 'a culture line edited inside its fence', () => sub1('site/why.html', "==='guardian')document", "==='curator')document"), [[], ['--write']], 'fail', 'site/why.html: differs from the shell'],
      ['shell', 'a menu edited inside its fence', () => sub1('site/why.html', /(<!-- shell:menu -->[\s\S]*?)>Approach</, '$1>Approch<'), [[], ['--write']], 'fail', 'site/why.html: differs from the shell'],
      ['shell', 'an asset address with a stale hash', () => sub1('site/why.html', /stz\.css\?v=[0-9a-f]{8}/, 'stz.css?v=00000000'), [[], ['--write']], 'fail', 'site/why.html: differs from the shell'],
      ['shell', 'an asset address with no hash', () => sub1('site/why.html', /stz\.js\?v=[0-9a-f]{8}/, 'stz.js'), [[], ['--write']], 'fail', 'site/why.html: differs from the shell'],
      ['shell', 'a page in CRLF', () => edit('site/web.html', t => t.replace(/\r?\n/g, '\r\n')), [[], ['--write']], 'any', ''],
      ['shell', 'a page with a byte order mark', () => edit('site/web.html', t => '﻿' + t), [[], ['--write']], 'any', ''],
      ['shell', 'a page with no menu, fenced or old', () => sub1('site/web.html', /<!-- shell:menu -->[\s\S]*?<!-- \/shell:menu -->/, ''), [[], ['--write']], 'fail', 'site/web.html: no top bar to replace'],
      ['shell', 'a page in the old markup, migrated by --write', () => sub1('site/web.html', /<!-- shell:menu -->[\s\S]*?<!-- \/shell:menu -->/, '<nav class="site"><a href="x.html">old</a></nav>'), [[], ['--write']], 'fail', 'site/web.html: differs from the shell'],
      ['shell', 'a page with no trail', () => sub1('site/web.html', /<!-- shell:trail -->[\s\S]*?<!-- \/shell:trail -->/, ''), CHECK, 'fail', 'site/web.html: no trail to replace'],
      ['shell', 'a page with no footer', () => sub1('site/web.html', /<!-- shell:footer -->[\s\S]*?<!-- \/shell:footer -->/, ''), CHECK, 'fail', 'site/web.html: no footer to replace'],
      ['shell', 'a layout fence under its old name', () => edit('site/web.html', t => t.replace('<!-- shell:layout -->', '<!-- shell:rail -->').replace('<!-- /shell:layout -->', '<!-- /shell:rail -->')), [[], ['--write']], 'fail', 'site/web.html: differs from the shell'],
      ['shell', 'an h2 with no id, given one by --write', () => before('site/web.html', '</main>', '<section>\n<h2>A part added by parity &amp; more</h2>\n</section>\n'), [[], ['--write']], 'fail', 'site/web.html: differs from the shell'],
      ['shell', 'a tooltip', () => before('site/web.html', '</main>', '<p title="a tooltip">x</p>\n'), CHECK, 'fail', 'carries a title attribute'],
      ['shell', 'two <title> elements', () => before('site/web.html', '</main>', '<svg viewBox="0 0 1 1"><title>x</title></svg>\n'), CHECK, 'fail', '<title> elements'],
      ['shell', 'an h1 that does not name its subject', () => sub1('site/web.html', /(<h1\b[^>]*>)[\s\S]*?(<\/h1>)/, '$1Something else entirely$2'), CHECK, 'fail', 'the h1 does not name'],
      ['shell', 'a lead that does not name its subject', () => sub1('site/web.html', /(<p class="sub">)[\s\S]*?(<\/p>)/, '$1Nothing to see here. Truly.$2'), CHECK, 'fail', 'the lead\'s first sentence does not name'],
      ['shell', 'a page with no lead', () => sub1('site/web.html', '<p class="sub">', '<p class="subtitle">'), CHECK, 'fail', 'site/web.html: no lead'],
      ['shell', 'a title with a line break placed by hand', () => sub1('site/web.html', '</h2>', '<br>by hand</h2>'), CHECK, 'fail', 'holds a <br>'],
      ['shell', 'a title holding a block', () => sub1('site/web.html', '</h2>', '<div>a block</div></h2>'), CHECK, 'fail', 'holds a <div>, a block'],
      ['shell', 'stz.css stops balancing titles', () => edit('site/stz.css', t => t.replace(/text-wrap:\s*balance/g, 'text-wrap: wrap')), CHECK, 'fail', 'no rule declares text-wrap: balance'],
      ['shell', 'stz.css sets a title in capitals', () => edit('site/stz.css', t => t + '\nh2 { text-transform: uppercase; }\n'), CHECK, 'fail', 'sets a title in capitals'],
      ['shell', 'stz.css makes a child of a title a block', () => edit('site/stz.css', t => t + '\nh2 a { display: block; }\n'), CHECK, 'fail', 'that stz.css makes a block'],
      ['shell', 'an svg with a fixed min-width', () => before('site/web.html', '</main>', '<svg style="min-width: 600px" viewBox="0 0 1 1"></svg>\n'), CHECK, 'fail', 'an svg holds a fixed min-width'],
      ['shell', 'an svg in a scrolling wrapper', () => before('site/web.html', '</main>', '<div class="scroll"><svg viewBox="0 0 1 1"></svg></div>\n'), CHECK, 'fail', 'an svg sits in a scrolling wrapper'],
      ['shell', 'the site names Zing', () => edit('site/stz.js', t => t + '\n// Zing\n'), CHECK, 'fail', 'names Zing'],
      ['shell', 'an outline entry over twenty characters', () => sub1('site/audit.html', 'data-outline="Three ways to try"', 'data-outline="Three ways to try it out today"'), CHECK, 'fail', 'give its h2 a data-outline of 20 at most'],
      ['shell', 'an outline entry repeating its page\'s label', () => sub1('site/audit.html', 'data-outline="Three ways to try"', 'data-outline="Demo"'), CHECK, 'fail', 'repeats the label "Demo" above it'],
      ['shell', 'an outline entry repeating a band label', () => sub1('site/audit.html', 'data-outline="Three ways to try"', 'data-outline="Screenshots"'), CHECK, 'fail', 'name the same thing on one page'],
      ['shell', 'a page tells the reader to run node', () => before('site/web.html', '</main>', '<p>Run <code>node tools/zane/cli.js check x.zane</code>.</p>\n'), CHECK, 'fail', 'tells the reader to run Node ("node tools/zane/cli.js")'],
      ['shell', 'a page names Node as what it needs', () => before('site/web.html', '</main>', '<p>It needs Node and a browser.</p>\n'), CHECK, 'fail', 'tells the reader to run Node ("Node")'],
      ['shell', 'a variable named node in a script, not an instruction', () => before('site/web.html', '</main>', '<script>\nlet node = 1;\nnode = node + 1;\n</script>\n'), [[], ['--write']], 'pass', ''],
      ['shell', 'README.md tells the reader to run node', () => edit('README.md', t => t + '\nRun `node tools/zane/cli.js check x.zane`.\n'), CHECK, 'fail', 'README.md:'],
      ['shell', 'a page links a release with no notes', () => before('site/web.html', '</main>', '<p><a href="https://github.com/mayouni/zane/releases/tag/v9.9.9">The release</a>.</p>\n'), CHECK, 'fail', 'links the release v9.9.9 and doc/releases/v9.9.9.md does not exist'],
      ['shell', 'README.md links a file of a release with no notes', () => edit('README.md', t => t + '\n[zane](https://github.com/mayouni/zane/releases/download/v0.0.9/zane-0.0.9.wasm)\n'), CHECK, 'fail', 'README.md:'],
      ['shell', 'the notes of the release the site offers missing', () => drop(P('doc/releases/v0.1.0.md')), CHECK, 'fail', 'doc/releases/v0.1.0.md does not exist'],
      ['shell', 'the menu declaration missing', () => drop(P('site/menu.zane')), [[], ['--write']], 'fail', 'site/menu.zane: missing'],
      ['shell', 'the menu declaration edited away from the registry', () => sub1('site/menu.zane', '(LABEL "Channels",', '(LABEL "Media",'), [[], ['--write']], 'fail', 'site/menu.zane: differs from the menu'],
      ['shell', 'a landing label repeating its section', () => sub1('site/menu.zane', '(LABEL "Reasoning",', '(LABEL "approach",'), CHECK, 'fail', 'MENU_LABEL_REPEATS_PARENT'],
      ['shell', 'a family landing repeating its family', () => sub1('site/menu.zane', '(LABEL "Overview", TARGET positioning)', '(LABEL "The comparison", TARGET positioning)'), CHECK, 'fail', 'MENU_LABEL_REPEATS_PARENT'],
      ['shell', 'a landing page second in its band', () => sub1('site/menu.zane', 'ENTRIES [thinking, grid,', 'ENTRIES [grid, thinking,'), CHECK, 'fail', 'MENU_LANDING_NOT_FIRST'],
      ['shell', 'a landing page left out of its band', () => sub1('site/menu.zane', 'ENTRIES [thinking, grid,', 'ENTRIES [grid,'), CHECK, 'fail', 'no entry of approach leads to thinking'],
      ['shell', 'two siblings sharing a label', () => sub1('site/menu.zane', '(LABEL "Channels",', '(LABEL "Grid",'), CHECK, 'fail', 'MENU_LABEL_DUPLICATE'],
      ['shell', 'a page names the retired language', () => before('site/mobile.html', '</main>', '<p>The writer runs on Ring++.</p>\n'), CHECK, 'fail', 'names the retired language ("Ring++")'],
      ['shell', 'a page says what is not yet done', () => before('site/web.html', '</main>', '<p>The importer is not yet written.</p>\n'), CHECK, 'fail', 'says what the project lacks ("not yet")'],
      ['shell', 'a Limit paragraph', () => before('site/web.html', '</main>', '<p class="limit"><b>Limit:</b> it covers one site.</p>\n'), CHECK, 'fail', 'says what the project lacks ("Limit:")'],
      ['shell', 'a Not shown caption after a sentence', () => before('site/web.html', '</main>', '<figure><figcaption>The verifier checks it. <b>Not shown:</b> the rest.</figcaption></figure>\n'), CHECK, 'fail', 'says what the project lacks ("Not shown")'],
      ['shell', 'README.md says nobody has', () => edit('README.md', t => t + '\nNobody has run it on a phone.\n'), CHECK, 'fail', 'README.md:'],
      ['shell', 'the phrases in code, scripts and comments, not read', () => before('site/web.html', '</main>', '<pre>not yet</pre>\n<p>Run <code>never been</code>.</p>\n<!-- not built -->\n<script>\nlet a = "unverified";\n</script>\n'), [[], ['--write']], 'pass', ''],
      ['shell', 'an excused line gone, its entry left', () => sub1('site/gotchas/reading.html', 'not yet been articulated by your teams', 'been articulated by your teams'), CHECK, 'fail', 'AFFIRM_ALLOWED: site/gotchas/reading.html'],
      ['shell', 'an allowed line gone, its entry left', () => sub1('tools/zane/wasm-proof.html', 'node tools/zane/parity.js --write-wasm-proof', 'tools/zane/parity.js with --write-wasm-proof'), CHECK, 'fail', 'matches no line: the entry has outlived what it excused'],
      ['shell', 'a served page the registry does not list', () => put(P('site/extra.html'), '<!DOCTYPE html>\n<title>x</title>\n'), CHECK, 'fail', 'site/extra.html: a page the site serves that the registry does not list'],
      ['shell', 'a registered page missing', () => drop(P('site/vibes.html')), [[], ['--write']], 'fail', 'site/vibes.html: missing'],
      // the design system's tokens (ZANE-DESIGN-01 M2: K01, K09, K15 on the stylesheets; K21 on every page; K19, K20 counted)
      ['shell', 'a font size outside the tokens', () => edit('site/stz.css', t => t + '\nh2.extra { font-size: 1.4rem; }\n'), CHECK, 'fail', 'not a size token (K01 TYPE_SCALE)'],
      ['shell', 'a font size in a font shorthand', () => edit('site/stz.css', t => t + '\n.extra {\n  color: var(--ink);\n  font: 700 15px/1.2 var(--sans);\n}\n'), CHECK, 'fail', 'in its font shorthand, not a size token (K01 TYPE_SCALE)'],
      ['shell', 'a colour outside the tokens', () => edit('site/stz.css', t => t + '\n.extra { border: 1px solid rgba(1, 2, 3, .5); }\n'), CHECK, 'fail', 'not a colour token (K09 PALETTE)'],
      ['shell', 'a colour defined in a token block', () => edit('site/stz.css', t => t + '\n:root { --extra: #123456; }\n[data-vibe="guardian"] { --extra: #654321; }\n'), [['--write']], 'pass', ''],
      ['shell', 'an offending demo fenced, not read', () => edit('site/gotchas.css', t => t + '\n/* offense:start */\n.extra { color: #123456; font-size: 3px; }\n/* offense:end */\n'), [['--write']], 'pass', ''],
      ['shell', 'a hover that reaches another element', () => edit('site/gotchas.css', t => t + '\n.extra:hover .tip { display: block; }\n'), CHECK, 'fail', 'makes a :hover reach another element'],
      ['shell', 'a page without its archetype', () => sub1('site/web.html', ' data-archetype="article"', ''), [[], ['--write']], 'fail', 'site/web.html: differs from the shell'],
      ['shell', 'a long paragraph, counted for milestone 3', () => before('site/web.html', '</main>', '<p>' + 'word '.repeat(80) + '</p>\n'), [[], ['--write']], 'pass', ''],
      ['shell', 'an article section with a sample frame', () => sub1('site/web.html', '<section', '<section><figure class="sample">x</figure></section>\n<section'), [[], ['--write']], 'pass', ''],

      ['grid', 'the tree as it is', null, [[], ['--write']], 'pass', ''],
      ['grid', 'a cell of the grid table drifted', gridCell, [[], ['--write']], 'fail', 'the grid:table differs from the data'],
      ['grid', 'a row of the channels table drifted', channelsRow, [[], ['--write']], 'fail', 'the channels:table differs from the data'],
      ['grid', 'a drifted cell on a page in CRLF', () => { gridCell(); edit('site/grid.html', t => t.replace(/\r?\n/g, '\r\n')); }, [[], ['--write']], 'fail', 'the grid:table differs from the data'],
      ['grid', 'the grid fence gone', () => sub1('site/grid.html', '<!-- grid:table -->', '<!-- grid table -->'), CHECK, 'fail', 'no <!-- grid:table --> fence'],
      ['grid', 'a rule placed on one more activity', placement, [[], ['--write']], 'fail', 'the grid:table differs from the data'],
      ['grid', 'site/media.html missing', () => drop(P('site/media.html')), CHECK, 'fail', 'site/media.html: missing'],
    ];
    for (const [tool, name, breakIt, modes, expect, words] of CASES) {
      siteCases++;
      for (const argv of modes) {
        const label = `site ${tool} [${argv.join(' ') || 'check'}] ${name}`;
        try {
          if (breakIt) breakIt();
          const broken = state();
          const a = run('js', argv, TOOL[tool]), wa = state(); restore();
          if (breakIt) breakIt();
          const b = run('zane', ['site', tool, ...argv]), wb = state(); restore();
          siteRuns++;
          if (!same(a, b)) differences.push(`${label}: ${firstDiff(a, b)}`);
          else { const d = changed(wa, wb); if (d.length) differences.push(`${label}: the files left behind differ: ${d.join(', ')}`); }
          const text = a.out.toString('utf8');
          const checkMode = argv.length === 0;
          if (expect === 'pass' && a.code !== 0) differences.push(`${label}: fails on the tree as it is (exit ${a.code})`);
          if (expect === 'fail' && checkMode && a.code !== 1) differences.push(`${label}: the break did not fail the check (exit ${a.code})`);
          if (expect === 'fail' && checkMode && !text.includes(words)) differences.push(`${label}: the check it aims at did not speak (no "${words}" in the output)`);
          const said = words && text.split('\n').find(l => l.includes(words));
          const wrote = changed(broken, wa);
          siteLines.push(`    exit ${a.code}  ${label}${wrote.length ? '  [wrote ' + wrote.join(', ') + ']' : ''}${said ? '\n             ' + said.replace(/^PROBLEM /, '').slice(0, 150) : ''}`);
        } catch (e) { differences.push(`${label}: ${e.message}`); restore(); }
      }
    }
    restore();
    const off = changed(base, state());
    if (off.length) differences.push(`site tools: ${off.join(', ')} not back byte for byte after the cases`);
  }
  wall.site = Date.now() - t0;
}
const siteReport = () => {
  if (LIST_SITE) siteLines.forEach(l => console.log(l));
  console.log(`  site tools   ${siteCases} cases, ${siteRuns} command lines of zane site facts, shell and grid against tools/site-facts.js, site-shell.js and site-grid.js (the tree as it is, --write, and one break per check)`);
};
if (ONLY === 'site') {
  const kept = differences.length;
  for (const d of differences.slice(0, 40)) console.log('  DIFF ' + d);
  console.log(`parity --only site: ${path.relative(ROOT, BIN) || BIN} against tools/site-facts.js, site-shell.js and site-grid.js`);
  siteReport();
  console.log(`  skipped      the fixtures, the arguments, the suite, the tools (pack, cross-medium, audit-facts), the corpus and the wasm proof's record (--only site)`);
  console.log(`  wall time    site ${(wall.site / 1000).toFixed(1)} s`);
  fs.rmSync(TMP, { recursive: true, force: true });
  console.log(kept ? `  ${kept} difference(s); the allowed list is empty` : '  identical -- every byte of stdout and stderr, every exit code and every file left behind');
  process.exit(kept ? 1 : 0);
}

// ---- 1. the fixtures ------------------------------------------------------------------------------------
let fixtureRuns = 0;
let lap = Date.now();
const done = k => { wall[k] = Date.now() - lap; lap = Date.now(); };
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

done('fixtures');
// ---- 2. the arguments -----------------------------------------------------------------------------------
const argCases = [[], ['--help'], ['check'], ['check', all[0], '--level', '0'], ['check', all[0], '--level', 'x'],
  ['check', all[0], '--level', ' 3abc'], ['check', all[0], '--bogus'], ['frobnicate', all[0]], ['check', all[0], '--level']];
for (const c of argCases) compare(`arguments [${c.join(' ')}]`, c);

done('arguments');
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

done('suite');
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

done('tools');
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

done('corpus');
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

done('wasm proof');
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
siteReport();
console.log(`  timing, one fixture per process, --json at level 4, wall time with process start:`);
console.log(`    node cli.js  ${dist(timing.js)}`);
console.log(`    zane         ${dist(timing.zane)}`);
console.log(`  timing, the whole suite in one process, default level, wall time with process start:`);
console.log(`    node conformance.js  ${dist(confTiming.js)}`);
console.log(`    zane conformance     ${dist(confTiming.zane)}`);
console.log(`  wall time by section: ${Object.entries(wall).map(([k, ms]) => `${k} ${(ms / 1000).toFixed(1)} s`).join(' · ')}`);
fs.rmSync(TMP, { recursive: true, force: true });
console.log(kept ? `  ${kept} difference(s); the allowed list is empty` : '  identical -- every byte of stdout and stderr, every exit code, and every file the write modes left behind');
process.exit(kept ? 1 : 0);
