#!/usr/bin/env node
'use strict';
/* ==========================================================================
   site-facts.js -- every figure on the site has a file, or it is not on the page.

     node tools/site-facts.js            check
     node tools/site-facts.js --write    rewrite site/facts.json from the tree
     node tools/site-facts.js --unchecked  also list the typed numbers outside any span

   doc/design/SITE.md section 4. The site argues about drift, so it must not drift: a figure on a page
   is a span carrying data-law="..." (read live from the law or the contract) or data-fact="..." (read
   live from site/facts.json), with a static fallback the reader sees when the file is not reachable.
   This script derives every figure from the tree and fails when
     - site/facts.json differs from what the tree gives now,
     - any span's fallback differs from the derived value,
     - a declaration shown on a page, with the terminal that checked it ($ zayn check NAME.zayn), no longer matches a real run of
       the verifier, here its JavaScript reference tools/zayn/cli.js
       (the home page's "ninety seconds" and every pair like it).
   A typed number outside a span is invisible to the first two, so it fails too (SITE-3 piece E): a rule's
   number links to the rule, and a figure inside a mock interface is marked data-specimen.
   ========================================================================== */
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const ROOT = path.join(__dirname, '..');
const R = p => path.join(ROOT, p);
const json = p => JSON.parse(fs.readFileSync(R(p), 'utf8'));

// ---- derive ---------------------------------------------------------------------------------------
function derive(prev) {
  const f = {}, src = {};
  const put = (k, v, from) => { f[k] = v; src[k] = from; };

  const law = json('constitution/rules.json');
  const sets = Object.keys(law).filter(k => /^set\d+$/.test(k));
  const rules = sets.flatMap(k => law[k].rules);
  put('law.rules', rules.length, 'constitution/rules.json');
  put('law.version', law.metadata.version, 'constitution/rules.json metadata.version');
  put('law.articles', Object.keys(law.articles).length, 'constitution/rules.json articles');
  put('law.retired', (Array.isArray(law.retired) ? law.retired.length : Object.keys(law.retired).length), 'constitution/rules.json retired');
  put('law.burned', (Array.isArray(law.burned) ? law.burned.length : Object.keys(law.burned).length), 'constitution/rules.json burned');
  put('law.rights', Object.keys(law.rights).length, 'constitution/rules.json rights');
  put('law.forbidden', law.forbidden.length, 'constitution/rules.json forbidden');
  put('law.sets', sets.length, 'constitution/rules.json set*');
  for (const t of ['machine', 'tool', 'machine-later', 'judgment']) put('law.tier.' + t, rules.filter(r => r.enforcement === t).length, 'constitution/rules.json enforcement');
  put('verbs', Object.values(law.intents.families).reduce((n, fam) => n + (fam.verbs || []).length, 0), 'constitution/rules.json intents.families');
  put('kinds', require(R('tools/zayn/zayn.js')).ZAYN_KINDS.size, 'tools/zayn/zayn.js ZAYN_KINDS');

  const v = json('conformance/violations.json');
  put('diag.total', v.diagnostics.length, 'conformance/violations.json diagnostics');
  put('diag.errors', v.diagnostics.filter(d => d.severity === 'error').length, 'conformance/violations.json severity');
  put('diag.warnings', v.diagnostics.filter(d => d.severity === 'warning').length, 'conformance/violations.json severity');
  put('diag.contract', v.metadata.version, 'conformance/violations.json metadata.version');
  put('diag.levels', Object.keys(v.levels).length, 'conformance/violations.json levels');
  put('diag.citingRules', v.diagnostics.filter(d => (d.rules || []).length).length, 'conformance/violations.json rules');
  put('diag.articleOnly', v.diagnostics.filter(d => !(d.rules || []).length && (d.articles || []).length).length, 'conformance/violations.json articles with no rule');
  put('diag.citeNothing', v.diagnostics.filter(d => !(d.rules || []).length && !(d.articles || []).length && !(d.rights || []).length && !(d.forbidden_patterns || []).length).length, 'conformance/violations.json bindings empty');
  for (const l of [1, 2, 3, 4]) put('diag.level' + l, v.diagnostics.filter(d => d.level === l).length, 'conformance/violations.json level');

  const m = json('conformance/manifest.json');
  const twins = m.fixtures.filter(x => /-lawful\.zayn$/.test(x.file)).length;
  const refused = m.fixtures.filter(x => x.expect_ids.length).length;
  put('fixtures.total', m.fixtures.length, 'conformance/manifest.json fixtures');
  put('fixtures.refused', refused, 'conformance/manifest.json expect_ids');
  put('fixtures.twins', twins, 'conformance/manifest.json (files named -lawful)');
  put('fixtures.clean', m.fixtures.length - refused - twins, 'conformance/manifest.json');
  for (const l of [1, 2, 3, 4]) put('fixtures.level' + l, m.fixtures.filter(x => x.level === l).length, 'conformance/manifest.json level');
  put('fixtures.unfixtured', m.unfixtured.length, 'conformance/manifest.json unfixtured');

  put('media.count', json('conformance/media.json').media.length, 'conformance/media.json media');
  /* how a medium carries a verb: absent / degraded / native, by the same reading the verifier makes of media.json */
  const carriage = (mm, v) => { const c = mm.carries || {}; return (c.absent || []).includes(v) ? 'absent' : (c.degraded || []).includes(v) ? 'degraded' : (c.native || []).includes(v) ? 'native' : (c.default || 'native'); };
  put('media.actAbsent', json('conformance/media.json').media.filter(mm => carriage(mm, 'ACT') === 'absent').length, 'conformance/media.json media carriage of ACT');
  put('pack.files', json('protocol/MANIFEST.json').pinned.length, 'protocol/MANIFEST.json pinned');
  put('signals.count', json('conformance/signal.json').values.length, 'conformance/signal.json values');

  const stzu = fs.readFileSync(R('haro/zayn.stzu'), 'utf8');
  put('haro.constraints', (stzu.match(/^DEFINE CONSTRAINT /gm) || []).length, 'haro/zayn.stzu (DEFINE CONSTRAINT)');
  const csv = fs.readFileSync(R('haro/twin-expected.csv'), 'utf8').split(/\r?\n/).filter(l => l.trim() && !l.startsWith('#') && !l.startsWith('fixture,'));
  put('twin.differences', csv.length, 'haro/twin-expected.csv rows');
  put('twin.agree', m.fixtures.length - csv.length, 'conformance/manifest.json fixtures minus haro/twin-expected.csv rows');
  put('twin.seams', new Set(csv.map(l => l.split(',')[3])).size, 'haro/twin-expected.csv seam column');
  for (const [k, name] of [['other-code', 'otherCode'], ['not-refused', 'notRefused'], ['court-only', 'courtOnly']])
    put('twin.' + name, csv.filter(l => l.split(',')[4] === k).length, 'haro/twin-expected.csv class column');
  put('haro.gbnfBytes', fs.existsSync(R('haro/zayn.gbnf')) ? fs.statSync(R('haro/zayn.gbnf')).size : 0, 'haro/zayn.gbnf');
  const gb = fs.readFileSync(R('haro/zayn.gbnf'), 'utf8');
  put('gbnf.kinds', (gb.match(/^decl_[A-Z_]+ ::=/gm) || []).length, 'haro/zayn.gbnf (decl_* productions)');

  const g = spawnSync(process.execPath, [R('doc/design/coverage-count.js'), '--json'], { encoding: 'utf8', maxBuffer: 1 << 26 });
  const s = JSON.parse(g.stdout).sum;
  put('grid.activities', s.axes.activities, 'doc/design/coverage-count.js');
  put('grid.media', s.axes.media, 'doc/design/coverage-count.js');
  put('grid.closed', s.closed_by_media_json, 'doc/design/coverage-count.js');
  put('grid.cellsLive', s.open_cells + s.axes.medium_free_cells, 'doc/design/coverage-count.js open + medium-free cells');
  put('grid.cellsWithRule', s.open_cells_with_a_rule_written_for_the_medium + s.medium_free_cells_with_a_rule, 'doc/design/coverage-count.js');
  put('grid.cellsNone', s.open_cells_with_none, 'doc/design/coverage-count.js');
  put('grid.rulesScreenOnly', s.rules.visual_only, 'doc/design/coverage-count.js');
  put('grid.rulesMediumFree', s.rules.medium_free, 'doc/design/coverage-count.js');
  put('grid.rulesNamedOther', s.rules.other_media, 'doc/design/coverage-count.js');
  put('grid.rulesOffGrid', s.rules.on_no_cell, 'doc/design/coverage-count.js');
  put('grid.rulesOnVisual', s.rules_on_the_visual_column, 'doc/design/coverage-count.js');
  put('grid.channelsNoRule', s.media_with_no_rule_written_for_them.length, 'doc/design/coverage-count.js media_with_no_rule_written_for_them');
  put('grid.rulesPlaced', s.rules.placed, 'doc/design/coverage-count.js');
  /* the two blind reads: as measured when each was made, from the outputs saved beside them (COVERAGE.md says so; re-running today gives other figures) */
  for (const [k, f] of [['read1', 'compare-output.txt'], ['read2', 'compare2-output.txt']]) {
    const o = fs.readFileSync(R('doc/design/placement-review/' + f), 'utf8');
    const m = /BOTH exact and same: (\d+) of (\d+)/.exec(o);
    if (m) { put('grid.' + k + '.both', +m[1], 'doc/design/placement-review/' + f); put('grid.' + k + '.of', +m[2], 'doc/design/placement-review/' + f); }
  }

  const d = json('doc/design/audit/decides.json');
  put('audit.decides', d.rules.length, 'doc/design/audit/decides.json');
  put('audit.contrastFloor', d.thresholds.contrast_floor, 'doc/design/audit/decides.json thresholds');
  put('audit.sizeFloorPt', d.thresholds.size_floor_pt, 'doc/design/audit/decides.json thresholds');
  put('audit.minOcrScore', d.thresholds.min_ocr_score, 'doc/design/audit/decides.json thresholds');
  put('audit.spreadLimit', d.thresholds.spread_limit, 'doc/design/audit/decides.json thresholds');

  put('site.verifierRuns', pairs().length, 'the declaration and terminal pairs on the site pages (re-run by this script)');
  put('tour.scenes', (fs.readFileSync(path.join(ROOT, 'site', 'tour.html'), 'utf8').match(/class="scene-card"/g) || []).length, 'site/tour.html scene cards');

  /* the corpus of the Principal's UI corrections (doc/design/DESIGN-SYSTEM.md section 3), which the Why section cites */
  const corpus = json('doc/design/corpus/corpus.json');
  put('corpus.corrections', corpus.records.length, 'doc/design/corpus/corpus.json records');
  put('corpus.projects', new Set(corpus.records.map(r => r.project)).size, 'doc/design/corpus/corpus.json records, their projects');
  put('corpus.repeats', corpus.records.filter(r => r.repeat === true).length, 'doc/design/corpus/corpus.json records that name an earlier one');
  put('corpus.causes', Object.keys(corpus.causes).length, 'doc/design/corpus/corpus.json causes');
  put('corpus.oneDay', corpus.records.filter(r => String(r.date).startsWith('2026-11-09')).length, 'doc/design/corpus/corpus.json records of 2026-11-09');


  const sorted = {}, sources = {};
  for (const k of Object.keys(f).sort()) { sorted[k] = f[k]; sources[k] = src[k]; }
  return { _about: 'Generated by tools/site-facts.js from the tree; do not edit. node tools/site-facts.js --write rewrites it, and the check fails when it is stale.', facts: sorted, sources };
}

// ---- the spans in the pages ------------------------------------------------------------------------
function pages() {
  const out = [];
  const walk = d => { for (const e of fs.readdirSync(R(d), { withFileTypes: true })) { const p = path.posix.join(d, e.name); if (e.isDirectory()) walk(p); else if (p.endsWith('.html')) out.push(p); } };
  out.push('index.html'); walk('site');
  return out;
}
/* a data-law key names a figure of the law or the contract; map it to a fact */
function lawKey(k) { return k === 'diagnostics' ? 'diag.total' : k.startsWith('tier:') ? 'law.tier.' + k.slice(5) : 'law.' + k; }
function spansOf(html) {
  const spans = [];
  const re = /<([a-z0-9]+)\b[^>]*?\sdata-(law-share|law|fact)="([^"]*)"[^>]*>([^<]*)<\/\1>/g;
  let m;
  while ((m = re.exec(html))) spans.push({ kind: m[2], key: m[3], text: m[4].trim() });
  return spans;
}
const decode = s => s.replace(/<[^>]+>/g, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&');

// ---- every declaration and terminal pair on a page against a real run -----------------------------------------
/* A page shows a declaration (<pre class="shot">) and, right after it, the terminal that checked it (<pre class="term">) whose first
   line is "$ zayn check NAME.zayn" (S6: the site names the one file, never node). This writes the declaration to NAME.zayn, runs the
   verifier's JavaScript reference on it (tools/zayn/cli.js, which tools/zayn/parity.js proves prints what zayn prints), and compares
   what it prints with what the page says, so "copied from a real run" is verified, not asserted. */
function pairs() {
  const out = [];
  for (const p of pages()) {
    const html = fs.readFileSync(R(p), 'utf8').replace(/\r\n/g, '\n');
    /* the sentence that says the declaration in plain words ("In words", ZAYN-SITE-RETHINK-01 addendum, rule 3) and a plate's cell label
       may stand between the two, each a paragraph of text with at most a bold head, so a reader meets the declaration, what it says, and
       then the report (the plate, site/stz.css) */
    const re = /<pre class="shot">([\s\S]*?)<\/pre>\s*(?:<p class="(?:label|gloss)[^"]*">(?:<b>[^<]*<\/b>)?[^<]*<\/p>\s*)*<pre class="term">([\s\S]*?)<\/pre>/g;
    let m;
    while ((m = re.exec(html))) {
      const lines = decode(m[2]).split('\n');
      const cmd = /^\$\s*zayn check (\S+\.zayn)\s*$/.exec(lines[0]);
      if (!cmd) continue;                           /* a terminal that is not a verifier run is not claimed to be one */
      out.push({ page: p, file: cmd[1], declaration: decode(m[1]).replace(/\s+$/, '') + '\n', output: lines.slice(1).join('\n') });
    }
  }
  return out;
}
function verifyRuns(problems) {
  const tmp = fs.mkdtempSync(path.join(require('os').tmpdir(), 'site-facts-'));
  const norm = t => t.replace(/\r\n/g, '\n').split('\n').map(l => l.replace(/\s+$/, '')).join('\n').replace(/\n+$/, '');
  const per = {};
  const all = pairs();
  for (const q of all) {
    fs.writeFileSync(path.join(tmp, q.file), q.declaration);
    const r = spawnSync(process.execPath, [R('tools/zayn/cli.js'), 'check', q.file], { cwd: tmp, encoding: 'utf8' });
    const got = norm(r.stdout || ''), want = norm(q.output);
    per[q.page] = (per[q.page] || 0) + 1;
    if (got !== want) problems.push(`${q.page}: the terminal for ${q.file} is not what a real run prints.\n--- the page\n${want}\n--- a real run\n${got}`);
  }
  if (!per['site/how.html']) problems.push('site/how.html: its pair has no declaration and terminal to verify');
  return all.length;
}

// ---- an excerpt shown on a page is a passage of the file it names --------------------------------------------
/* <pre class="excerpt" data-excerpt="haro/zayn.stzu"> ... </pre>: its text, with the highlighting spans removed and whitespace collapsed,
   must appear in that file. A page cannot show a passage of the language's declaration that the declaration does not contain. */
function verifyExcerpts(problems) {
  let n = 0;
  const squash = t => t.replace(/\s+/g, ' ').trim();
  for (const p of pages()) {
    const html = fs.readFileSync(R(p), 'utf8').replace(/\r\n/g, '\n');
    const re = /<pre class="excerpt" data-excerpt="([^"]+)">([\s\S]*?)<\/pre>/g;
    let m;
    while ((m = re.exec(html))) {
      n++;
      if (!fs.existsSync(R(m[1]))) { problems.push(`${p}: excerpt of ${m[1]}, which does not exist`); continue; }
      const file = squash(fs.readFileSync(R(m[1]), 'utf8'));
      const shown = decode(m[2]).split('\n').filter(l => !/^\s*(\.\.\.|…)\s*$/.test(l)).map(squash).filter(Boolean);
      for (const line of shown) if (!file.includes(line)) { problems.push(`${p}: the excerpt of ${m[1]} shows a line the file does not contain: "${line.slice(0, 80)}"`); break; }
    }
  }
  return n;
}

// ---- a terminal that names its command is a real run of it ---------------------------------------------------
/* A terminal may show an excerpt of a real run (ZANE-AFFIRM-01, 2026-11-09): a line holding only "…" stands for lines cut, and every
   other line appears in the real output, in the same order and, between two cuts, on consecutive lines. A terminal with no "…" is
   the whole output, as before. Nothing is invented on a page; what a run records for its desk need not be shown to its reader. */
function sameRun(want, got) {
  const w = want.split('\n');
  if (!w.some(l => l.trim() === '…')) return want === got;
  const g = got.split('\n');
  const chunks = [[]];
  for (const l of w) { if (l.trim() === '…') chunks.push([]); else chunks[chunks.length - 1].push(l); }
  let at = 0;
  for (const c of chunks) {
    if (!c.length) continue;
    let found = -1;
    for (let i = at; i + c.length <= g.length; i++) if (c.every((l, k) => g[i + k] === l)) { found = i; break; }
    if (found < 0) return false;
    at = found + c.length;
  }
  return true;
}
/* <pre class="term" data-run="zayn conformance"> ... </pre>: the first line is "$ " and the command, the rest is what it printed. Only
   the binary's read-only commands of the pack are run (zayn check, conformance, pack, cross-medium, audit-facts), each through its
   JavaScript reference, which tools/zayn/parity.js proves prints what zayn prints; the output is compared with the page's. */
const REFERENCE = { check: ['tools/zayn/cli.js', 'check'], conformance: ['tools/zayn/conformance.js'], pack: ['tools/zayn/pack.js'],
  'cross-medium': ['tools/zayn/cross-medium.js'], 'audit-facts': ['doc/design/audit/check-facts.js'] };
function verifyCommands(problems) {
  let n = 0;
  const norm = t => t.replace(/\r\n/g, '\n').split('\n').map(l => l.replace(/\s+$/, '')).join('\n').replace(/\n+$/, '');
  for (const p of pages()) {
    const html = fs.readFileSync(R(p), 'utf8').replace(/\r\n/g, '\n');
    const re = /<pre class="term" data-run="([^"]+)">([\s\S]*?)<\/pre>/g;
    let m;
    while ((m = re.exec(html))) {
      const cmd = decode(m[1]).split(/\s+/);
      if (cmd[0] !== 'zayn' || !Object.prototype.hasOwnProperty.call(REFERENCE, cmd[1] || '')) { problems.push(`${p}: data-run "${m[1]}" is not a pack command (zayn check, conformance, pack, cross-medium or audit-facts)`); continue; }
      n++;
      const lines = decode(m[2]).split('\n');
      if (lines[0].replace(/^\$\s*/, '').trim() !== cmd.join(' ')) problems.push(`${p}: the first line of the terminal for "${cmd.join(' ')}" is not that command`);
      const [script, ...lead] = REFERENCE[cmd[1]];
      const r = spawnSync(process.execPath, [R(script), ...lead, ...cmd.slice(2)], { cwd: R('.'), encoding: 'utf8' });
      const got = norm(r.stdout || ''), want = norm(lines.slice(1).join('\n'));
      if (!sameRun(want, got)) problems.push(`${p}: the terminal for "${cmd.join(' ')}" is not what a real run prints.\n--- the page\n${want}\n--- a real run\n${got}`);
    }
  }
  return n;
}

// ---- the head of a reading page has no button --------------------------------------------------------------
/* A button in the head of a page that is read from top to bottom interrupts the reading and proposes a change of context (the author, 2026-11-04).
   Only the front page keeps its one action. A primary button anywhere else in a page body still may not point into its own page. */
function verifyCtas(problems) {
  let n = 0;
  for (const p of pages()) {
    const html = fs.readFileSync(R(p), 'utf8').replace(/\r\n/g, '\n');
    const head = /<header class="page">[\s\S]*?<\/header>/.exec(html);
    if (head && /\bbtn\b[^"]*\bprimary\b/.test(head[0])) problems.push(p + ': the head of a reading page carries a primary button; only the front page does');
    for (const m of html.matchAll(/<a\b[^>]*class="[^"]*\bbtn\b[^"]*\bprimary\b[^"]*"[^>]*href="([^"]*)"|<a\b[^>]*href="([^"]*)"[^>]*class="[^"]*\bbtn\b[^"]*\bprimary\b[^"]*"/g)) {
      n++;
      const href = m[1] !== undefined ? m[1] : m[2];
      if (href.startsWith('#')) problems.push(p + ': the primary button "' + href + '" scrolls within its own page; a call to action leaves it');
    }
  }
  return n;
}

// ---- a status word is one of three -------------------------------------------------------------------------
/* <td class="status WORD">WORD</td>: the class and the word must agree and must be exists, data only, designed or held (the words of "What
   exists today", ZAYN-SITE-RETHINK-01; "data only" is written in its class as data-only). The truth of a word cannot be checked; its
   vocabulary can, so a fifth word cannot appear beside the mark that goes with each of the four. */
function verifyStatuses(problems) {
  let n = 0;
  for (const p of pages()) {
    const html = fs.readFileSync(R(p), 'utf8').replace(/\r\n/g, '\n');
    const re = /<(\w+)\b[^>]*\bclass="status([^"]*)"[^>]*>([^<]*)<\/\1>/g;
    let m;
    while ((m = re.exec(html))) {
      n++;
      const cls = m[2].trim(), word = m[3].trim();
      if (!['exists', 'data only', 'designed', 'held'].includes(word)) problems.push(p + ': the status word "' + word + '" is not one of exists, data only, designed, held');
      else if (cls !== word.replace(' ', '-')) problems.push(p + ': the status "' + word + '" carries the class "' + cls + '", so its mark would be wrong');
    }
  }
  return n;
}

// ---- the typed numbers outside any span: none may remain (SITE-3 piece E) ------------------------------------
function unchecked(html) {
  html = html.replace(/<a [^>]*#rule-\d+[^>]*>\d+<\/a>/g, ' ');
  /* a table drawn from its data by tools/site-grid.js is checked there, against the files that hold its figures */
  html = html.replace(/<!-- (grid|channels|ideas):table -->[\s\S]*?<!-- \/\1:table -->/g, ' ');
  /* a figure inside a mock interface (the invoice a gotcha deletes, the tile it pokes) is a specimen, not a claim; it says so */
  html = html.replace(/<([a-z0-9]+)\b[^>]*\sdata-specimen\b[^>]*>[^<]*<\/\1>/g, ' ');
  let t = html.replace(/\r\n/g, '\n').replace(/<(script|style|pre|code)\b[\s\S]*?<\/\1>/g, ' ')
    .replace(/<([a-z0-9]+)\b[^>]*?\sdata-(law-share|law|fact)="[^"]*"[^>]*>[^<]*<\/\1>/g, ' ');
  t = t.replace(/<[^>]+>/g, ' ').replace(/&[a-z#0-9]+;/g, ' ');
  /* a rule number is a name, not a measured figure: "Rules 79, 26 and 51"; so is a version of another body's document: "WCAG 2.0 to 2.2", "UIML 4.0" */
  t = t.replace(/Rules?\s+\d+(?:\s*(?:,|and|to|through|-|\u2013)\s*\d+)*/g, ' ').replace(/\b(?:WCAG|UIML|XForms|VoiceXML|ISO(?:\/IEC)?)\s+[\d.]+(?:\s+(?:to|and)\s+[\d.]+)?/g, ' ');
  const found = [];
  const re = /(?<![\w.#/-])(\d{2,}|\d+\.\d+)(?![\w.:/-])/g;
  let m;
  while ((m = re.exec(t))) {
    const around = t.slice(Math.max(0, m.index - 12), m.index + m[0].length + 12);
    if (/Rule[s]?\s*$|rules?\s+\d|20\d\d|^\d{4}$|px|rem|ms|\bv\d/i.test(around) && !/(violations|fixtures|diagnostics|rules|verbs|media|declaration|checks)/i.test(around)) continue;
    found.push(m[0]);
  }
  return found;
}

// ---- the run ------------------------------------------------------------------------------------------
function main(argv) {
  const write = argv.includes('--write');
  const listUnchecked = argv.includes('--unchecked');
  const FILE = R('site/facts.json');
  const prev = fs.existsSync(FILE) ? (JSON.parse(fs.readFileSync(FILE, 'utf8')).facts || {}) : null;
  const now = derive(prev);
  const problems = [];
  const text = JSON.stringify(now, null, 2) + '\n';
  if (write) { fs.writeFileSync(FILE, text); console.log(`wrote site/facts.json: ${Object.keys(now.facts).length} figures`); }
  else {
    const have = fs.existsSync(FILE) ? fs.readFileSync(FILE, 'utf8').replace(/\r\n/g, '\n') : null;
    if (have === null) problems.push('site/facts.json is missing: run with --write');
    else if (have !== text) {
      const old = JSON.parse(have).facts || {};
      const diff = Object.keys(now.facts).filter(k => String(old[k]) !== String(now.facts[k])).map(k => `${k}: ${old[k]} -> ${now.facts[k]}`);
      problems.push('site/facts.json is stale: ' + (diff.length ? diff.join('; ') : 'its text differs') + ' (run with --write)');
    }
  }
  let spans = 0, bad = 0, total = 0;
  const per = [];
  for (const p of pages()) {
    const html = fs.readFileSync(R(p), 'utf8');
    for (const sp of spansOf(html)) {
      spans++;
      const key = sp.kind === 'fact' ? sp.key : sp.kind === 'law-share' ? null : lawKey(sp.key);
      let want;
      if (sp.kind === 'law-share') {
        const t = now.facts['law.tier.' + sp.key];
        want = t === undefined ? undefined : Math.round(t / now.facts['law.rules'] * 100) + '%';
      } else want = now.facts[key] === undefined ? undefined : String(now.facts[key]);
      if (want === undefined) { problems.push(`${p}: ${sp.kind} "${sp.key}" names a figure this script does not derive`); bad++; }
      else if (sp.text !== want) { problems.push(`${p}: ${sp.kind} "${sp.key}" reads "${sp.text}" and the tree says "${want}"`); bad++; }
    }
    const u = unchecked(html);
    total += u.length;
    if (u.length) per.push(`${p}: ${u.length} (${[...new Set(u)].slice(0, 8).join(', ')})`);
  }
  const ninety = verifyRuns(problems);
  const excerpts = verifyExcerpts(problems);
  const commands = verifyCommands(problems);
  { const g = spawnSync(process.execPath, [R('tools/site-grid.js')], { encoding: 'utf8' }); if (g.status !== 0) problems.push(...(g.stdout || '').split('\n').filter(l => l.startsWith('PROBLEM ')).map(l => l.slice(8))); }
  const statuses = verifyStatuses(problems);
  const ctas = verifyCtas(problems);
  console.log(`spans checked: ${spans}; wrong: ${bad}; verifier runs re-run: ${ninety}; commands re-run: ${commands}; status words checked: ${statuses}; buttons checked: ${ctas}; excerpts checked against their files: ${excerpts}`);
  console.log(`typed numbers outside a span, not checked: ${total} across ${per.length} page(s)${listUnchecked ? '' : ' (--unchecked lists them)'}`);
  if (listUnchecked || total) per.forEach(l => console.log('  ' + l));
  if (total) problems.push(`${total} typed number(s) outside a span: give each a data-fact or data-law span, a link to its rule, or, inside a mock interface, data-specimen`);
  if (problems.length) { problems.forEach(m => console.log('PROBLEM ' + m)); return 1; }
  console.log(write ? 'ok (facts.json written; nothing else to check against itself)' : 'site facts ok');
  return 0;
}
if (require.main === module) process.exitCode = main(process.argv.slice(2));
module.exports = { derive, spansOf };
