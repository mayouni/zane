// node doc/design/placement-review/sample.js
// The mechanical sample of the placement review (doc/design/COVERAGE.md section 3e). Takes the rules the
// placement file PLACES (not the two off-grid ones), sorts them by number, and keeps the 1st, 5th, 9th, ...
// (every 4th by position), then adds the two off-grid rules, 78 and 124, as a check on the off-grid pair.
// Nothing about a rule is chosen. Writes packet.json: for each sampled rule its number, title, avoid,
// solution and why, and nothing else, so a reader sees no placement, tier, diagnostic or fixture.
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..', '..', '..');
const place = require('../coverage-placement.json');
const law = require(path.join(ROOT, 'constitution/rules.json'));
const byNumber = {};
for (const k of Object.keys(law)) if (/^set\d+$/.test(k)) for (const r of law[k].rules) byNumber[r.number] = r;
const placed = Object.keys(place.rules).map(Number).sort((a, b) => a - b);
const sample = placed.filter((n, i) => i % 4 === 0);
const offGrid = Object.keys(place.off).map(Number).sort((a, b) => a - b);
const all = [...sample, ...offGrid].sort((a, b) => a - b);
const packet = all.map(n => { const r = byNumber[String(n)]; return { number: n, title: r.title, avoid: r.avoid, solution: r.solution, why: r.why }; });
fs.writeFileSync(path.join(__dirname, 'packet.json'), JSON.stringify(packet, null, 2) + '\n');
console.log(`placed ${placed.length}; sampled ${sample.length} (every 4th by position) + ${offGrid.length} off-grid = ${packet.length}`);
console.log('sample: ' + sample.join(' '));
console.log('off-grid: ' + offGrid.join(' '));
