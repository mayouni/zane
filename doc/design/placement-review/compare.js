// node doc/design/placement-review/compare.js
// Compares the blind second reader (second-reader.json) with the placement file on the sampled rules and
// reports the disagreements (doc/design/COVERAGE.md section 3e). It changes nothing: not the placement file,
// not any rule. It also bounds how far the three counts of the grid would move if the reader's placement
// replaced the sampled rules' placement, by running a copy of coverage-count.js on a temporary placement.
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');
const ROOT = path.join(__dirname, '..', '..', '..');
const place = require('../coverage-placement.json');
const reader = JSON.parse(fs.readFileSync(path.join(__dirname, 'second-reader.json'), 'utf8'));
const LETTER = { perceive: 'P', understand: 'U', decide: 'D', act: 'A', recover: 'R', trust: 'T' };
const NAME = Object.fromEntries(Object.entries(LETTER).map(([k, v]) => [v, k]));

const acts = n => [...place.rules[n].activities].map(L => NAME[L]).sort();
const med = n => place.rules[n].media === 'any' ? ['any'] : [...place.rules[n].media].sort();
const rmed = r => r.media === 'any' ? ['any'] : r.media === 'off' ? ['off'] : [...r.media].sort();
const rows = [];
for (const r of reader) {
  const n = String(r.number);
  if (n in place.off) {
    rows.push({ n, kind: 'off-grid', agree: r.media === 'off', r, theirs: 'off', mine: 'off' });
    continue;
  }
  const a = acts(n), b = [...r.activities].sort();
  const inter = a.filter(x => b.includes(x));
  const actClass = r.media === 'off' ? 'reader-says-off' : (a.join() === b.join() ? 'exact' : inter.length ? 'overlap' : 'disjoint');
  const mClass = r.media === 'off' ? 'reader-says-off' : (med(n).join() === rmed(r).join() ? 'same' : 'different');
  rows.push({ n, kind: 'placed', actClass, mClass, a, b, ma: med(n), mb: rmed(r), r });
}
const placedRows = rows.filter(x => x.kind === 'placed');
const offRows = rows.filter(x => x.kind === 'off-grid');
const count = (xs, k, v) => xs.filter(x => x[k] === v).length;

console.log(`sampled placed rules: ${placedRows.length}; off-grid check rules: ${offRows.length}`);
console.log('\nACTIVITIES  exact ' + count(placedRows, 'actClass', 'exact') + ', overlap ' + count(placedRows, 'actClass', 'overlap') + ', disjoint ' + count(placedRows, 'actClass', 'disjoint') + ', reader says off ' + count(placedRows, 'actClass', 'reader-says-off'));
console.log('MEDIUM      same ' + count(placedRows, 'mClass', 'same') + ', different ' + count(placedRows, 'mClass', 'different') + ', reader says off ' + count(placedRows, 'mClass', 'reader-says-off'));
const both = placedRows.filter(x => x.actClass === 'exact' && x.mClass === 'same').length;
console.log('BOTH exact and same: ' + both + ' of ' + placedRows.length);
console.log('OFF-GRID    ' + offRows.map(x => `${x.n}: reader says ${x.r.media === 'off' ? 'off' : 'placed'}`).join('; '));

console.log('\n-- disagreements --');
for (const x of placedRows) {
  if (x.actClass === 'exact' && x.mClass === 'same') continue;
  console.log(`${x.n}  mine ${x.a.join('+')} / ${x.ma.join('+')}   reader ${x.r.media === 'off' ? 'off' : x.b.join('+') + ' / ' + x.mb.join('+')}   [${x.actClass}, ${x.mClass}]`);
  console.log(`      reader: ${x.r.reason}`);
}

// ---- the bound: the three counts if the reader's placement replaced mine on the sampled rules
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'placement-bound-'));
const alt = JSON.parse(JSON.stringify(place));
for (const x of placedRows) {
  if (x.r.media === 'off') { alt.off[x.n] = 'reader says off'; delete alt.rules[x.n]; continue; }
  alt.rules[x.n] = { title: place.rules[x.n].title, activities: x.r.activities.map(a => LETTER[a]).join(''), media: x.r.media === 'any' ? 'any' : x.r.media };
}
for (const x of offRows) if (x.r.media !== 'off') { delete alt.off[x.n]; alt.rules[x.n] = { title: String(x.n), activities: x.r.activities.map(a => LETTER[a]).join(''), media: x.r.media === 'any' ? 'any' : x.r.media }; }
fs.writeFileSync(path.join(tmp, 'alt-placement.json'), JSON.stringify(alt));
const src = fs.readFileSync(path.join(ROOT, 'doc/design/coverage-count.js'), 'utf8')
  .replace("require('./coverage-placement.json')", `require(${JSON.stringify(path.join(tmp, 'alt-placement.json'))})`)
  .replace("path.join(__dirname, '..', '..')", JSON.stringify(ROOT));
fs.writeFileSync(path.join(tmp, 'count-alt.js'), src);
const run = f => JSON.parse(spawnSync(process.execPath, [f, '--json'], { encoding: 'utf8', maxBuffer: 1 << 26 }).stdout);
const base = run(path.join(ROOT, 'doc/design/coverage-count.js')).sum, other = run(path.join(tmp, 'count-alt.js')).sum;
const fig = s => ({ withRule: s.open_cells_with_a_rule_written_for_the_medium + s.medium_free_cells_with_a_rule, none: s.open_cells_with_none, offGrid: s.rules.on_no_cell });
const f0 = fig(base), f1 = fig(other);
console.log('\n-- the three counts, mine -> if the reader had placed the sampled rules --');
console.log(`cells with at least one rule: ${f0.withRule} -> ${f1.withRule}`);
console.log(`cells with none:              ${f0.none} -> ${f1.none}`);
console.log(`rules on no cell:             ${f0.offGrid} -> ${f1.offGrid}`);
console.log(`problems the reader's placement raises (rules on a closed cell and the like): ${other.problems}`);
console.log('(a bound on the sampled rules only: the other rules keep their placement)');
