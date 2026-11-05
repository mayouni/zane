// node haro/judge-zane-court.js  (needs rnxc and the Haro spike: RNXC, HARO_SPIKE)
// Runs every StzZui fixture through the court forged from haro/zane.stzu and compares it with the
// manifest. A .zane file is translated MECHANICALLY into the Commons shape (AS, lower_snake words,
// RATIONALE) -- nothing else is touched.
//
// A RATCHET: haro/twin-expected.csv lists every fixture on which the court and zane.js differ today
// (fixture, what zane.js says, what the court says, the seam, a class). The run exits 1 on a difference
// that is NOT in the file, on a listed row whose values changed, and on a listed difference that now
// agrees -- so the list shrinks only when someone deletes a row on purpose, and never grows by accident.
// Exit 2: the court could not be forged.
const fs = require('fs');
const path = require('path');
const os = require('os');
const ROOT = path.join(__dirname, '..');
const R = p => path.join(ROOT, p);
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'zane-judge-'));
const { spawnSync } = require('child_process');
const FX = R('conformance/fixtures');
const man = require(R('conformance/manifest.json'));
const Z = require(R('tools/zane/zane.js'));
const SPIKE = process.env.HARO_SPIKE || 'D:/GitHub/ringpp/haro/spike';
const OUT = path.join(TMP, 'court');
const RNXC = process.env.RNXC || 'D:/ringpp/ringpp-win64/bin/rnxc.exe';
const viol = require(R('conformance/violations.json')).diagnostics;
const sev = Object.fromEntries(viol.map(d => [d.id, d.severity]));

function translate(src) {
  // comments: // -> --
  const lines = src.split(/\r?\n/).map(l => l.replace(/\/\/.*$/, ''));
  let s = lines.join('\n');
  // DEFINE KIND name (  ->  DEFINE KIND name AS (
  s = s.replace(/^(\s*DEFINE\s+[A-Z_]+\s+[A-Za-z0-9_]+)\s*\(/gm, '$1 AS (');
  // lower-case the values: list items and scalars after a KEY
  s = s.replace(/(^|[,(\n])(\s*)([A-Z_]+)\s+(\[[^\]]*\]|[^,)\n]+)/g, (m0, pre, ws, key, val) => {
    if (key === 'DEFINE' || key === 'AS') return m0;
    const v = val.trim().startsWith('[')
      ? val.replace(/[A-Za-z0-9_]+/g, w => w.toLowerCase())
      : val.trim().toLowerCase() === val.trim() ? val : val;
    return pre + ws + key + ' ' + v;
  });
  // close each declaration with RATIONALE. A .zane declaration carries none (D4, 2026-10-31), so the
  // court is told so in words; the old text, "translated from a .zane fixture", was a reason the
  // fixtures never gave.
  s = s.replace(/\)(\s*)(?=\n\s*DEFINE|\s*$)/g, ') RATIONALE "none given"$1');
  return s;
}

function run(file, verb) {
  const r = spawnSync(RNXC, ['zane_court.ring', verb, file], { cwd: OUT, encoding: 'utf8' });
  return (r.stdout || '') + (r.stderr || '');
}

fs.mkdirSync(OUT, { recursive: true });
{
  const fg = spawnSync(RNXC, ['forge.ring', R('haro/zane.stzu'), OUT], { cwd: SPIKE, encoding: 'utf8' });
  if (!/forged zane/.test(fg.stdout || '')) { console.error('forge failed:', fg.stdout, fg.stderr); process.exit(2); }
  for (const f of fs.readdirSync(SPIKE)) if (/_lib\.ring$|world_stub\.ring$/.test(f)) fs.copyFileSync(path.join(SPIKE, f), path.join(OUT, f));
}
const rows = [];
for (const f of man.fixtures) {
  const src = fs.readFileSync(path.join(FX, f.file), 'utf8');
  const tr = translate(src);
  const tmp = path.join(TMP, f.file.replace(/\.zane$/, '.z'));
  fs.writeFileSync(tmp, tr);
  const raw = run(tmp, 'diagnose');
  let code = '(clean)', parsed = null;
  try {
    parsed = JSON.parse(raw.trim().split('\n').pop());
    const d = parsed.diagnostics || [];
    code = d.length ? d[0].code : '(clean)';
  } catch (e) { code = 'UNREADABLE:' + raw.trim().slice(0, 80); }
  // ground truth: what zane.js says on the original, with the fixture's own symbols
  const truth = [...new Set(Z.verify(src, { symbols: f.symbols || null }).map(d => d.id))].sort();
  rows.push({ file: f.file, level: f.level, expect: f.expect_ids, truth, got: code, cites: (parsed && parsed.diagnostics && parsed.diagnostics[0] && parsed.diagnostics[0].cites) || null, msg: parsed && parsed.diagnostics && parsed.diagnostics[0] ? parsed.diagnostics[0].message : '' });
}

const warnOnly = r => r.expect.length > 0 && r.expect.every(id => sev[id] === 'warning');
let agree = 0, disagree = [], notcarried = [], lawfulOK = 0, lawfulBad = [];
for (const r of rows) {
  if (r.expect.length === 0) {
    if (r.got === '(clean)') { lawfulOK++; agree++; } else lawfulBad.push(r);
  } else if (r.expect.includes(r.got)) agree++;
  else if (r.got === '(clean)' && warnOnly(r)) notcarried.push(r);
  else disagree.push(r);
}
console.log(`fixtures ${rows.length}: agree ${agree} (lawful clean ${lawfulOK}), warning-only unrefused ${notcarried.length}, disagree ${disagree.length}, lawful refused ${lawfulBad.length}`);
console.log('\n-- disagree (expected -> got) --');
for (const r of disagree) console.log(`${r.file.padEnd(40)} L${r.level} ${r.expect.join('+')} -> ${r.got}  ${r.msg.slice(0, 90)}`);
console.log('\n-- lawful twins the court refused --');
for (const r of lawfulBad) console.log(`${r.file.padEnd(40)} -> ${r.got}  ${r.msg.slice(0, 110)}`);
console.log('\n-- warning-only fixtures the court did not refuse --');
for (const r of notcarried) console.log(`${r.file.padEnd(40)} ${r.expect.join('+')}`);
const csv = ['file,level,expected,got'].concat(rows.map(r => [r.file, r.level, r.expect.join('+'), r.got].join(','))).join('\n') + '\n';
fs.writeFileSync(path.join(__dirname, 'judge-rows.csv'), csv);

// ---- a measurement, not a ratchet: what the court's envelope cites against the contract's bindings (S2)
// Every fixture the court refuses under the code the contract names is compared; a refusal under another
// code (S11, S8) has no binding of the same name to compare with and is left out.
{
  const bound = c => { const d = viol.find(x => x.id === c); return d ? [...(d.rules || []).map(x => 'rule:' + x), ...(d.articles || []).map(x => 'article:' + x), ...(d.rights || []).map(x => 'right:' + x), ...(d.forbidden_patterns || []).map(x => 'pattern:' + x)] : null; };
  const cmp = rows.filter(r => r.got !== '(clean)' && r.cites && bound(r.got));
  const same = cmp.filter(r => JSON.stringify([...r.cites].sort()) === JSON.stringify(bound(r.got).sort()));
  console.log(`\n-- cites: ${same.length} of ${cmp.length} envelopes cite exactly what violations.json binds to their code`);
  for (const r of cmp) if (!same.includes(r)) console.log(`  ${r.file}: ${r.got} cites [${r.cites.join(', ')}], contract binds [${bound(r.got).join(', ')}]`);
}

// ---- the ratchet ---------------------------------------------------------------------------
const says = ids => ids.length ? ids.join('+') : '(clean)';
const current = new Map([...disagree, ...notcarried, ...lawfulBad].map(r => [r.file, { zanejs: says(r.truth), court: r.got }]));
const listed = new Map();
for (const line of fs.readFileSync(path.join(__dirname, 'twin-expected.csv'), 'utf8').split(/\r?\n/)) {
  if (line.startsWith('# baseline')) console.log('\n-- ' + line.slice(2));
  if (!line.trim() || line.startsWith('#') || line.startsWith('fixture,')) continue;
  const [fixture, zanejs, court, seam, cls] = line.split(',');
  listed.set(fixture, { zanejs, court, seam, cls });
}
const problems = [];
for (const r of rows) {
  const want = [...r.expect].sort();
  if (want.join('+') !== r.truth.join('+'))
    problems.push(`zane.js says ${says(r.truth)} on ${r.file} and the manifest says ${says(want)}: the "zane.js says" column cannot be trusted until they agree`);
}
for (const [file, c] of current) {
  const l = listed.get(file);
  if (!l) problems.push(`NEW difference, not in twin-expected.csv: ${file}  zane.js ${c.zanejs}, court ${c.court}`);
  else if (l.zanejs !== c.zanejs || l.court !== c.court)
    problems.push(`CHANGED difference: ${file}  listed zane.js ${l.zanejs}, court ${l.court}; now zane.js ${c.zanejs}, court ${c.court}`);
}
for (const [file, l] of listed) {
  if (!current.has(file)) problems.push(`listed difference now AGREES, delete its row: ${file} (${l.seam})`);
}
// ---- the grammar the forge writes, checked in so a page can link a file (SITE-GBNF-01) ---------------------
// haro/zane.gbnf is what the forge writes from haro/zane.stzu, behind one header line naming the forge commit (the baseline of
// twin-expected.csv). The judge regenerates it on every run and fails if the checked-in copy differs; --write-gbnf rewrites it.
// What it holds is the SHAPE of a declaration: the ten kinds, the clauses each takes, the lexical form. The verbs are an identifier
// list and the semantic refusals stay the court's.
{
  const baseline = fs.readFileSync(path.join(__dirname, 'twin-expected.csv'), 'utf8').split(/\r?\n/).find(l => l.startsWith('# baseline')) || '';
  const commit = (/ringpp commit ([0-9a-f]{7,40})/.exec(baseline) || [])[1] || 'unknown';
  const made = fs.readFileSync(path.join(OUT, 'zane.gbnf'), 'utf8').replace(/\r\n/g, '\n');
  const want = `# haro/zane.gbnf -- written by haro/judge-zane-court.js from the forge at ringpp commit ${commit}. The judge fails when this file differs from what the forge writes now.\n` + made;
  const GBNF = path.join(__dirname, 'zane.gbnf');
  if (process.argv.includes('--write-gbnf')) { fs.writeFileSync(GBNF, want); console.log(`\n-- wrote haro/zane.gbnf (${want.length} bytes, forge ${commit})`); }
  else {
    const have = fs.existsSync(GBNF) ? fs.readFileSync(GBNF, 'utf8').replace(/\r\n/g, '\n') : null;
    if (have === null) problems.push('haro/zane.gbnf is missing: run the judge with --write-gbnf');
    else if (have !== want) problems.push('haro/zane.gbnf differs from the grammar the forge writes now: run the judge with --write-gbnf and read the difference');
    else console.log(`\n-- haro/zane.gbnf matches the forge's output (${want.length} bytes, forge ${commit})`);
  }
}
const byClass = {};
for (const l of listed.values()) byClass[l.cls] = (byClass[l.cls] || 0) + 1;
console.log(`\n-- ratchet: ${listed.size} listed (${Object.entries(byClass).map(([k, v]) => k + ' ' + v).join(', ')}), ${current.size} differing now, ${problems.length} problem(s)`);
for (const m of problems) console.log('  RATCHET: ' + m);
process.exitCode = problems.length ? 1 : 0;
