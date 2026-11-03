// node doc/design/placement-review/sample2.js [out-dir]
// The second sample of the placement review (doc/design/COVERAGE.md section 3f): every rule the placement file
// places ANYWHERE OTHER THAN visual-only, that is the medium-free rules and the rules named for another medium.
// Nothing is chosen. For each, the packet holds its number, title, avoid, solution and why, plus the diagnostics
// bound to it in conformance/violations.json (id, summary, decidable_from) and nothing else: no placement, no
// tier, no fixture. Writes packet2.json here, and, when an out-dir is given, reader-input-2.md there, which is
// the brief (the section 1 grid from COVERAGE.md, brief-order-2.md, the answer format) followed by the packet.
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..', '..', '..');
const place = require('../coverage-placement.json');
const law = require(path.join(ROOT, 'constitution/rules.json'));
const viol = require(path.join(ROOT, 'conformance/violations.json')).diagnostics;
const byNumber = {};
for (const k of Object.keys(law)) if (/^set\d+$/.test(k)) for (const r of law[k].rules) byNumber[r.number] = r;
const visualOnly = p => p.media !== 'any' && p.media.length === 1 && p.media[0] === 'visual';
const sample = Object.keys(place.rules).filter(n => !visualOnly(place.rules[n])).map(Number).sort((a, b) => a - b);
const packet = sample.map(n => {
  const r = byNumber[String(n)];
  const diagnostics = viol.filter(d => (d.rules || []).map(String).includes(String(n)))
    .map(d => ({ id: d.id, summary: d.summary, decidable_from: d.decidable_from }));
  return { number: n, title: r.title, avoid: r.avoid, solution: r.solution, why: r.why, diagnostics };
});
fs.writeFileSync(path.join(__dirname, 'packet2.json'), JSON.stringify(packet, null, 2) + '\n');
const named = sample.filter(n => place.rules[n].media !== 'any');
console.log(`${sample.length} rules placed other than visual-only: ${sample.length - named.length} medium-free, ${named.length} named for another medium`);
console.log('sample: ' + sample.join(' '));
console.log('named: ' + named.join(' '));
if (process.argv[2]) {
  const cov = fs.readFileSync(path.join(__dirname, '..', 'COVERAGE.md'), 'utf8').replace(/\r\n/g, '\n');
  const a = cov.indexOf('## 1. The axes'), b = cov.indexOf('---\n\n## 2.');
  const order = fs.readFileSync(path.join(__dirname, 'brief-order-2.md'), 'utf8');
  const text = order.replace('{{GRID}}', cov.slice(a, b).trim().replace('## 1. The axes', '### The axes')).replace('{{PACKET}}', JSON.stringify(packet, null, 2));
  fs.mkdirSync(process.argv[2], { recursive: true });
  fs.writeFileSync(path.join(process.argv[2], 'reader-input-2.md'), text);
  console.log('wrote ' + path.join(process.argv[2], 'reader-input-2.md') + ' (' + text.length + ' chars)');
}
