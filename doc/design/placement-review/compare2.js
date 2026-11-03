// node doc/design/placement-review/compare2.js
// Compares the second blind read (second-reader-2.json) of the rules placed other than visual-only with the
// placement file (doc/design/COVERAGE.md section 3f). It changes nothing. It also bounds the grid: it runs a copy of
// coverage-count.js on a temporary placement in which the reader's placement replaces mine on these rules, and says
// which of the empty cells would gain a rule and which cells that hold one would lose it.
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');
const ROOT = path.join(__dirname, '..', '..', '..');
const place = require('../coverage-placement.json');
const reader = JSON.parse(fs.readFileSync(path.join(__dirname, 'second-reader-2.json'), 'utf8'));
const LETTER = { perceive: 'P', understand: 'U', decide: 'D', act: 'A', recover: 'R', trust: 'T' };
const NAME = Object.fromEntries(Object.entries(LETTER).map(([k, v]) => [v, k]));
const acts = n => [...place.rules[n].activities].map(L => NAME[L]).sort();
const med = n => place.rules[n].media === 'any' ? ['any'] : [...place.rules[n].media].sort();
const rmed = r => r.media === 'any' ? ['any'] : [...r.media].sort();

const rows = reader.map(r => {
  const n = String(r.number), a = acts(n), b = [...r.activities].sort();
  const inter = a.filter(x => b.includes(x));
  return { n, a, b, ma: med(n), mb: rmed(r), r,
    actClass: a.join() === b.join() ? 'exact' : inter.length ? 'overlap' : 'disjoint',
    mClass: med(n).join() === rmed(r).join() ? 'same' : 'different' };
});
const c = (k, v) => rows.filter(x => x[k] === v).length;
console.log(`rules read: ${rows.length}`);
console.log(`ACTIVITIES  exact ${c('actClass', 'exact')}, overlap ${c('actClass', 'overlap')}, disjoint ${c('actClass', 'disjoint')}`);
console.log(`MEDIUM      same ${c('mClass', 'same')}, different ${c('mClass', 'different')}`);
console.log(`BOTH exact and same: ${rows.filter(x => x.actClass === 'exact' && x.mClass === 'same').length} of ${rows.length}`);
const named = rows.filter(x => !(x.ma.length === 1 && x.ma[0] === 'any'));
const free = rows.filter(x => x.ma.length === 1 && x.ma[0] === 'any');
for (const [label, xs] of [['medium-free (mine any)', free], ['named (mine a medium list)', named]]) {
  console.log(`  ${label}: ${xs.length}; medium same ${xs.filter(x => x.mClass === 'same').length}; activities exact ${xs.filter(x => x.actClass === 'exact').length}`);
}
console.log('\n-- disagreements --');
for (const x of rows) {
  if (x.actClass === 'exact' && x.mClass === 'same') continue;
  console.log(`${x.n}  mine ${x.a.join('+')} / ${x.ma.join('+')}   reader ${x.b.join('+')} / ${x.mb.join('+')}   [${x.actClass}, ${x.mClass}]`);
  console.log(`      reader: ${x.r.reason}`);
}

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'placement-bound2-'));
const alt = JSON.parse(JSON.stringify(place));
for (const x of rows) alt.rules[x.n] = { title: place.rules[x.n].title, activities: x.r.activities.map(a => LETTER[a]).join(''), media: x.r.media === 'any' ? 'any' : x.r.media };
fs.writeFileSync(path.join(tmp, 'alt-placement.json'), JSON.stringify(alt));
const src = fs.readFileSync(path.join(ROOT, 'doc/design/coverage-count.js'), 'utf8')
  .replace("require('./coverage-placement.json')", `require(${JSON.stringify(path.join(tmp, 'alt-placement.json'))})`)
  .replace("path.join(__dirname, '..', '..')", JSON.stringify(ROOT));
fs.writeFileSync(path.join(tmp, 'count-alt.js'), src);
const run = f => JSON.parse(spawnSync(process.execPath, [f, '--json'], { encoding: 'utf8', maxBuffer: 1 << 26 }).stdout);
const base = run(path.join(ROOT, 'doc/design/coverage-count.js')), other = run(path.join(tmp, 'count-alt.js'));
const fig = s => ({ withRule: s.open_cells_with_a_rule_written_for_the_medium + s.medium_free_cells_with_a_rule, none: s.open_cells_with_none, off: s.rules.on_no_cell });
const f0 = fig(base.sum), f1 = fig(other.sum);
const key = ([a, m]) => `${a} x ${m}`;
const b0 = new Set(base.no_rule.map(key)), b1 = new Set(other.no_rule.map(key));
const gained = [...b0].filter(k => !b1.has(k)), lost = [...b1].filter(k => !b0.has(k));
console.log('\n-- the three counts, mine -> if the reader had placed these rules --');
console.log(`cells with at least one rule: ${f0.withRule} -> ${f1.withRule}`);
console.log(`cells with none:              ${f0.none} -> ${f1.none}`);
console.log(`rules on no cell:             ${f0.off} -> ${f1.off}`);
console.log(`of the ${b0.size} cells with none, ${gained.length} would gain a rule${gained.length ? ': ' + gained.join('; ') : ''}`);
console.log(`of the cells that have a rule, ${lost.length} would lose every rule${lost.length ? ': ' + lost.join('; ') : ''}`);
console.log(`problems the reader's placement raises (a rule on a closed cell and the like): ${other.sum.problems}`);
console.log('(a bound on these rules only: the visual-only rules keep their placement)');
