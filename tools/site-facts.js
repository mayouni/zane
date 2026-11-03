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
     - the home page's "ninety seconds" no longer matches a real run of tools/zui/cli.js.
   A typed number outside a span is invisible to the first two; --unchecked counts them so they can
   be driven to zero as the pages are rewritten.
   ========================================================================== */
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const ROOT = path.join(__dirname, '..');
const R = p => path.join(ROOT, p);
const json = p => JSON.parse(fs.readFileSync(R(p), 'utf8'));

// ---- derive ---------------------------------------------------------------------------------------
function derive() {
  const f = {}, src = {};
  const put = (k, v, from) => { f[k] = v; src[k] = from; };

  const law = json('constitution/rules.json');
  const sets = Object.keys(law).filter(k => /^set\d+$/.test(k));
  const rules = sets.flatMap(k => law[k].rules);
  put('law.rules', rules.length, 'constitution/rules.json');
  put('law.version', law.metadata.version, 'constitution/rules.json metadata.version');
  put('law.articles', Object.keys(law.articles).length, 'constitution/rules.json articles');
  put('law.rights', Object.keys(law.rights).length, 'constitution/rules.json rights');
  put('law.forbidden', law.forbidden.length, 'constitution/rules.json forbidden');
  put('law.sets', sets.length, 'constitution/rules.json set*');
  for (const t of ['machine', 'tool', 'machine-later', 'judgment']) put('law.tier.' + t, rules.filter(r => r.enforcement === t).length, 'constitution/rules.json enforcement');
  put('verbs', Object.values(law.intents.families).reduce((n, fam) => n + (fam.verbs || []).length, 0), 'constitution/rules.json intents.families');
  put('kinds', require(R('tools/zui/zui.js')).ZUI_KINDS.size, 'tools/zui/zui.js ZUI_KINDS');

  const v = json('conformance/violations.json');
  put('diag.total', v.diagnostics.length, 'conformance/violations.json diagnostics');
  put('diag.errors', v.diagnostics.filter(d => d.severity === 'error').length, 'conformance/violations.json severity');
  put('diag.warnings', v.diagnostics.filter(d => d.severity === 'warning').length, 'conformance/violations.json severity');
  put('diag.contract', v.metadata.version, 'conformance/violations.json metadata.version');
  put('diag.levels', Object.keys(v.levels).length, 'conformance/violations.json levels');
  put('diag.citingRules', v.diagnostics.filter(d => (d.rules || []).length).length, 'conformance/violations.json rules');

  const m = json('conformance/manifest.json');
  const twins = m.fixtures.filter(x => /-lawful\.zui$/.test(x.file)).length;
  const refused = m.fixtures.filter(x => x.expect_ids.length).length;
  put('fixtures.total', m.fixtures.length, 'conformance/manifest.json fixtures');
  put('fixtures.refused', refused, 'conformance/manifest.json expect_ids');
  put('fixtures.twins', twins, 'conformance/manifest.json (files named -lawful)');
  put('fixtures.clean', m.fixtures.length - refused - twins, 'conformance/manifest.json');
  for (const l of [1, 2, 3, 4]) put('fixtures.level' + l, m.fixtures.filter(x => x.level === l).length, 'conformance/manifest.json level');
  put('fixtures.unfixtured', m.unfixtured.length, 'conformance/manifest.json unfixtured');

  put('media.count', json('conformance/media.json').media.length, 'conformance/media.json media');
  put('signals.count', json('conformance/signal.json').values.length, 'conformance/signal.json values');

  const stzu = fs.readFileSync(R('haro/zui.stzu'), 'utf8');
  put('haro.constraints', (stzu.match(/^DEFINE CONSTRAINT /gm) || []).length, 'haro/zui.stzu (DEFINE CONSTRAINT)');
  const csv = fs.readFileSync(R('haro/twin-expected.csv'), 'utf8').split(/\r?\n/).filter(l => l.trim() && !l.startsWith('#') && !l.startsWith('fixture,'));
  put('twin.differences', csv.length, 'haro/twin-expected.csv rows');
  put('twin.seams', new Set(csv.map(l => l.split(',')[3])).size, 'haro/twin-expected.csv seam column');
  put('haro.gbnfBytes', fs.existsSync(R('haro/zui.gbnf')) ? fs.statSync(R('haro/zui.gbnf')).size : 0, 'haro/zui.gbnf');

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

  const d = json('doc/design/audit/decides.json');
  put('audit.decides', d.rules.length, 'doc/design/audit/decides.json');
  put('audit.contrastFloor', d.thresholds.contrast_floor, 'doc/design/audit/decides.json thresholds');
  put('audit.sizeFloorPt', d.thresholds.size_floor_pt, 'doc/design/audit/decides.json thresholds');
  put('audit.minOcrScore', d.thresholds.min_ocr_score, 'doc/design/audit/decides.json thresholds');
  put('audit.spreadLimit', d.thresholds.spread_limit, 'doc/design/audit/decides.json thresholds');

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

// ---- the home page's "ninety seconds" against a real run ----------------------------------------------
function ninetySeconds(problems) {
  const html = fs.readFileSync(R('index.html'), 'utf8').replace(/\r\n/g, '\n');
  const a = html.indexOf('Ninety seconds of Zui');
  if (a < 0) { problems.push('index.html: no "Ninety seconds of Zui" section to verify'); return 0; }
  const rest = html.slice(a, html.indexOf('</section>', a));
  const shots = [...rest.matchAll(/<pre class="shot">([\s\S]*?)<\/pre>/g)].map(x => decode(x[1]));
  const terms = [...rest.matchAll(/<pre class="term">([\s\S]*?)<\/pre>/g)].map(x => decode(x[1]));
  if (!shots.length || shots.length !== terms.length) { problems.push(`index.html: the ninety seconds has ${shots.length} declaration(s) and ${terms.length} terminal(s)`); return 0; }
  const tmp = fs.mkdtempSync(path.join(require('os').tmpdir(), 'site-facts-'));
  let n = 0;
  shots.forEach((src, i) => {
    const lines = terms[i].split('\n');
    const cmd = lines[0].replace(/^\$\s*/, '');
    if (!/^node tools\/zui\/cli\.js check payments\.zui$/.test(cmd)) { problems.push(`index.html: terminal ${i + 1} runs "${cmd}", which this check does not know how to re-run`); return; }
    fs.writeFileSync(path.join(tmp, 'payments.zui'), src.replace(/\s+$/, '') + '\n');
    const r = spawnSync(process.execPath, [R('tools/zui/cli.js'), 'check', 'payments.zui'], { cwd: tmp, encoding: 'utf8' });
    const norm = t => t.replace(/\r\n/g, '\n').split('\n').map(l => l.replace(/\s+$/, '')).join('\n').replace(/\n+$/, '');
    const got = norm(r.stdout || ''), want = norm(lines.slice(1).join('\n'));
    n++;
    if (got !== want) problems.push(`index.html: the ninety seconds, terminal ${i + 1}, is not what a real run prints.\n--- the page\n${want}\n--- a real run\n${got}`);
  });
  return n;
}

// ---- the typed numbers outside any span (informational) -----------------------------------------------------
function unchecked(html) {
  let t = html.replace(/\r\n/g, '\n').replace(/<(script|style|pre|code)\b[\s\S]*?<\/\1>/g, ' ')
    .replace(/<([a-z0-9]+)\b[^>]*?\sdata-(law-share|law|fact)="[^"]*"[^>]*>[^<]*<\/\1>/g, ' ');
  t = t.replace(/<[^>]+>/g, ' ').replace(/&[a-z#0-9]+;/g, ' ');
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
  const now = derive();
  const FILE = R('site/facts.json');
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
  const ninety = ninetySeconds(problems);
  console.log(`spans checked: ${spans}; wrong: ${bad}; ninety seconds re-run: ${ninety} of the page's terminals`);
  console.log(`typed numbers outside a span, not checked: ${total} across ${per.length} page(s)${listUnchecked ? '' : ' (--unchecked lists them)'}`);
  if (listUnchecked) per.forEach(l => console.log('  ' + l));
  if (problems.length) { problems.forEach(m => console.log('PROBLEM ' + m)); return 1; }
  console.log(write ? 'ok (facts.json written; nothing else to check against itself)' : 'site facts ok');
  return 0;
}
if (require.main === module) process.exitCode = main(process.argv.slice(2));
module.exports = { derive, spansOf };
