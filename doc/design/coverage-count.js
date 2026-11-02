// node doc/design/coverage-count.js [--grid] [--cells] [--json]
// Counts the coverage grid of doc/design/COVERAGE.md from its data. It reads the placement table
// (doc/design/coverage-placement.json), the law (constitution/rules.json), the media matrix
// (conformance/media.json), the diagnostics' rule bindings (conformance/violations.json) and the 57
// fixtures. It writes nothing and changes no rule, diagnostic or fixture. Exit 1 if the table and the
// law disagree about which rules exist.
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..', '..');
const R = p => path.join(ROOT, p);
const place = require('./coverage-placement.json');
const rules = require(R('constitution/rules.json'));
const media = require(R('conformance/media.json'));
const viol = require(R('conformance/violations.json')).diagnostics;
const man = require(R('conformance/manifest.json'));
const Z = require(R('tools/zui/zui.js'));

// ---- the axes -------------------------------------------------------------------------------
const ACTIVITIES = ['perceive', 'understand', 'decide', 'act', 'recover', 'trust'];
const LETTER = { P: 'perceive', U: 'understand', D: 'decide', A: 'act', R: 'recover', T: 'trust' };
// The intent verbs a person uses in each activity. Perceive and trust own none: a state is sensed
// before any verb is used, and trust is a property of every verb, not a verb. 22 verbs, each once.
const VERBS = {
  perceive: [],
  understand: ['DISCOVER', 'UNDERSTAND', 'LOCATE', 'READ', 'SCAN', 'SCROLL', 'ZOOM', 'COMPARE'],
  decide: ['FOCUS', 'FILTER', 'SELECT', 'HIGHLIGHT', 'PREVIEW', 'MARK'],
  act: ['ACT', 'CONFIRM'],
  recover: ['CANCEL', 'UNDO', 'PAUSE', 'RESUME', 'RETRY', 'EXIT'],
  trust: []
};
const MEDIA = media.media.map(m => m.id);
const COLS = ['any', ...MEDIA]; // 'any' is the law stated without a medium

const all = new Set(Object.values(VERBS).flat());
const problems = [];
if (all.size !== 22 || Object.values(VERBS).flat().length !== 22 || [...Z.INTENT_VERBS].some(v => !all.has(v)))
  problems.push('the verb map is not the 22 intent verbs, each once');

// a verb is absent from a medium the way zui.js derives it: default "absent" keeps only native and degraded
const absentIn = {};
for (const m of media.media) {
  const c = m.carries, keep = new Set([...(c.native || []), ...(c.degraded || [])]);
  absentIn[m.id] = new Set(c.default === 'absent' ? [...Z.INTENT_VERBS].filter(v => !keep.has(v)) : (c.absent || []));
}
// a cell is closed when its activity owns verbs and the medium lacks every one of them
const closed = (a, m) => m !== 'any' && VERBS[a].length > 0 && VERBS[a].every(v => absentIn[m].has(v));

// ---- the rules ------------------------------------------------------------------------------
const lawRules = [];
for (let i = 1; i <= 31; i++) for (const x of rules['set' + i].rules) lawRules.push(x.number);
for (const n of lawRules) if (!(n in place.rules) && !(n in place.off)) problems.push(`rule ${n} is neither placed nor off-grid`);
for (const n of Object.keys(place.rules).concat(Object.keys(place.off))) if (!lawRules.includes(n)) problems.push(`placement names rule ${n}, which the law does not have`);
if (lawRules.length !== rules.metadata.totalRules) problems.push(`the law lists ${lawRules.length} rules and its metadata says ${rules.metadata.totalRules}`);

const cellRules = {}, cellFix = {};
const key = (a, m) => a + '|' + m;
for (const a of ACTIVITIES) for (const m of COLS) { cellRules[key(a, m)] = []; cellFix[key(a, m)] = []; }
const stated = {}; // rule -> cells it is written for
for (const [n, p] of Object.entries(place.rules)) {
  const ms = p.media === 'any' ? ['any'] : p.media;
  stated[n] = [];
  for (const L of p.activities) {
    const a = LETTER[L];
    if (!a) { problems.push(`rule ${n}: unknown activity letter ${L}`); continue; }
    for (const m of ms) {
      if (!COLS.includes(m)) { problems.push(`rule ${n}: unknown medium ${m}`); continue; }
      if (closed(a, m)) problems.push(`rule ${n} is placed on ${a} x ${m}, which media.json closes`);
      cellRules[key(a, m)].push(n); stated[n].push(key(a, m));
    }
  }
}
// the ceiling: a medium-free rule can be projected into every open cell of its activities
const reach = {};
for (const a of ACTIVITIES) for (const m of MEDIA) reach[key(a, m)] = new Set();
for (const [n, p] of Object.entries(place.rules)) if (p.media === 'any')
  for (const L of p.activities) for (const m of MEDIA) if (!closed(LETTER[L], m)) reach[key(LETTER[L], m)].add(n);

// ---- the fixtures ---------------------------------------------------------------------------
const rulesOf = {};
for (const d of viol) rulesOf[d.id] = (d.rules || []).map(String);
const fxByStem = new Map(man.fixtures.map(f => [f.file.replace(/\.zui$/, ''), f]));
const fixtureRows = [];
for (const f of man.fixtures) {
  let ids = f.expect_ids, via = 'its own diagnostics';
  const stem = f.file.replace(/\.zui$/, '');
  if (!ids.length && /-lawful$/.test(stem)) { // a lawful twin is the other half of its pair: same rules, expected clean
    const base = stem.replace(/-lawful$/, '');
    const twin = fxByStem.get(base) || [...fxByStem.values()].find(t => t.expect_ids.length && t.file.replace(/\.zui$/, '').startsWith(base));
    if (twin) { ids = twin.expect_ids; via = 'its twin ' + twin.file; }
  }
  const src = fs.readFileSync(R('conformance/fixtures/' + f.file), 'utf8');
  const sm = /SURFACE_AS\s+([a-z_]+)/.exec(src.replace(/\/\/.*$/gm, ''));
  const medium = sm ? sm[1] : 'any';
  const rs = [...new Set(ids.flatMap(id => rulesOf[id] || []))].filter(n => n in place.rules);
  const acts = [...new Set(rs.flatMap(n => [...place.rules[n].activities].map(L => LETTER[L])))];
  const cells = acts.map(a => key(a, COLS.includes(medium) ? medium : 'any'));
  let why = '';
  if (!cells.length) why = !ids.length ? 'declares no rule (a clean or exemption fixture)' : 'its diagnostics cite no rule';
  fixtureRows.push({ file: f.file, ids, via, medium, rules: rs, cells, why });
  for (const c of cells) cellFix[c].push(f.file);
}

// ---- the counts -----------------------------------------------------------------------------
const mediumCells = ACTIVITIES.flatMap(a => MEDIA.map(m => [a, m]));
const closedCells = mediumCells.filter(([a, m]) => closed(a, m));
const openCells = mediumCells.filter(([a, m]) => !closed(a, m));
const withStated = openCells.filter(([a, m]) => cellRules[key(a, m)].length);
const noStated = openCells.filter(([a, m]) => !cellRules[key(a, m)].length);
const reachedOnly = noStated.filter(([a, m]) => reach[key(a, m)].size);
const nobody = noStated.filter(([a, m]) => !reach[key(a, m)].size);
const withFixture = openCells.filter(([a, m]) => cellFix[key(a, m)].length);
const anyCells = ACTIVITIES.map(a => [a, 'any']);
const onNoCell = Object.keys(place.off);
const placed = Object.keys(place.rules);
const visualOnly = placed.filter(n => JSON.stringify(place.rules[n].media) === '["visual"]');
const anyScope = placed.filter(n => place.rules[n].media === 'any');
const otherMedia = placed.filter(n => place.rules[n].media !== 'any' && !(place.rules[n].media.length === 1 && place.rules[n].media[0] === 'visual'));
const fxCell = fixtureRows.filter(r => r.cells.length), fxMedCol = fixtureRows.filter(r => r.cells.some(c => !c.endsWith('|any'))), fxNone = fixtureRows.filter(r => !r.cells.length);

const sum = {
  axes: { activities: ACTIVITIES.length, media: MEDIA.length, medium_cells: mediumCells.length, medium_free_cells: anyCells.length },
  closed_by_media_json: closedCells.length, open_cells: openCells.length,
  open_cells_with_a_rule_written_for_the_medium: withStated.length,
  open_cells_with_none: noStated.length,
  of_those_reached_only_by_a_medium_free_rule: reachedOnly.length,
  of_those_reached_by_nothing: nobody.length,
  medium_free_cells_with_a_rule: anyCells.filter(([a, m]) => cellRules[key(a, m)].length).length,
  rules: { total: lawRules.length, placed: placed.length, on_no_cell: onNoCell.length, visual_only: visualOnly.length, medium_free: anyScope.length, other_media: otherMedia.length },
  fixtures: { total: man.fixtures.length, on_a_cell: fxCell.length, on_a_medium_column: fxMedCol.length, on_no_cell: fxNone.length,
    no_rule_declared: fxNone.filter(r => !r.ids.length).length, diagnostics_cite_no_rule: fxNone.filter(r => r.ids.length).length,
    open_medium_cells_with_a_fixture: withFixture.length, medium_free_cells_with_a_fixture: anyCells.filter(([a, m]) => cellFix[key(a, m)].length).length,
    cells_with_a_rule_and_no_fixture: withStated.filter(([a, m]) => !cellFix[key(a, m)].length).length,
    cells_with_a_fixture_and_no_rule: withFixture.filter(([a, m]) => !cellRules[key(a, m)].length).length },
  rules_on_the_visual_column: placed.filter(n => place.rules[n].media !== 'any' && place.rules[n].media.includes('visual')).length,
  media_with_no_rule_written_for_them: MEDIA.filter(m => !ACTIVITIES.some(a => cellRules[key(a, m)].length)),
  problems: problems.length
};

const grid = () => {
  const w = 11;
  const head = 'activity'.padEnd(11) + COLS.map(c => c.slice(0, w - 1).padEnd(w)).join('');
  console.log('\ncell = rules written for it / fixtures on it   (x = closed by media.json, . = none; "any" = the law stated without a medium)');
  console.log(head);
  for (const a of ACTIVITIES) {
    console.log(a.padEnd(11) + COLS.map(m => {
      if (closed(a, m)) return 'x'.padEnd(w);
      const r = cellRules[key(a, m)].length, f = cellFix[key(a, m)].length;
      return (r || f ? `${r}/${f}` : '.').padEnd(w);
    }).join(''));
  }
};

if (process.argv.includes('--json')) { console.log(JSON.stringify({ sum, closed: closedCells, no_rule: noStated, fixtures: fixtureRows }, null, 1)); }
else {
  console.log('coverage grid:', sum.axes.activities, 'activities x', sum.axes.media, 'media =', sum.axes.medium_cells, 'cells, plus', sum.axes.medium_free_cells, 'medium-free cells');
  console.log('closed by media.json (the medium cannot carry the activity):', sum.closed_by_media_json, ' open:', sum.open_cells);
  console.log('open cells with at least one rule written for that medium:', sum.open_cells_with_a_rule_written_for_the_medium);
  console.log('open cells with none:', sum.open_cells_with_none, '  (reached only by a medium-free rule:', sum.of_those_reached_only_by_a_medium_free_rule + ', by nothing:', sum.of_those_reached_by_nothing + ')');
  console.log('medium-free cells with a rule:', sum.medium_free_cells_with_a_rule, 'of', sum.axes.medium_free_cells);
  console.log('rules:', JSON.stringify(sum.rules));
  console.log('rules on the visual column:', sum.rules_on_the_visual_column, ' media with no rule written for them:', sum.media_with_no_rule_written_for_them.join(' '));
  console.log('fixtures:', JSON.stringify(sum.fixtures));
  grid();
  if (process.argv.includes('--cells')) {
    console.log('\n-- open cells with no rule written for the medium --');
    for (const [a, m] of noStated) console.log(`  ${a} x ${m}: ${reach[key(a, m)].size ? 'reached by ' + reach[key(a, m)].size + ' medium-free rule(s)' : 'nothing'}`);
    console.log('\n-- closed cells --');
    for (const [a, m] of closedCells) console.log(`  ${a} x ${m}`);
    console.log('\n-- rules on no cell --');
    for (const n of onNoCell) console.log(`  ${n}: ${place.off[n]}`);
    console.log('\n-- fixtures on no cell --');
    for (const r of fxNone) console.log(`  ${r.file}: ${r.why}`);
  }
  for (const m of problems) console.log('PROBLEM: ' + m);
}
process.exitCode = problems.length ? 1 : 0;
