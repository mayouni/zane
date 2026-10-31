// node haro/judge-zui-court.js  (needs rnxc and the Haro spike: RNXC, HARO_SPIKE)
// Runs every StzZui fixture through the court forged from haro/zui.stzu and compares it with the
// manifest. A .zui file is translated MECHANICALLY into the Commons shape (AS, lower_snake words,
// RATIONALE) -- nothing else is touched. Scratch tool, not committed.
const fs = require('fs');
const path = require('path');
const os = require('os');
const ROOT = path.join(__dirname, '..');
const R = p => path.join(ROOT, p);
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'zui-judge-'));
const { spawnSync } = require('child_process');
const FX = R('conformance/fixtures');
const man = require(R('conformance/manifest.json'));
const Z = require(R('tools/zui/zui.js'));
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
  // close each declaration with RATIONALE
  s = s.replace(/\)(\s*)(?=\n\s*DEFINE|\s*$)/g, ') RATIONALE "translated from a .zui fixture"$1');
  return s;
}

function run(file, verb) {
  const r = spawnSync(RNXC, ['zui_court.ring', verb, file], { cwd: OUT, encoding: 'utf8' });
  return (r.stdout || '') + (r.stderr || '');
}

fs.mkdirSync(OUT, { recursive: true });
{
  const fg = spawnSync(RNXC, ['forge.ring', R('haro/zui.stzu'), OUT], { cwd: SPIKE, encoding: 'utf8' });
  if (!/forged zui/.test(fg.stdout || '')) { console.error('forge failed:', fg.stdout, fg.stderr); process.exit(2); }
  for (const f of fs.readdirSync(SPIKE)) if (/_lib\.ring$|world_stub\.ring$/.test(f)) fs.copyFileSync(path.join(SPIKE, f), path.join(OUT, f));
}
const rows = [];
for (const f of man.fixtures) {
  const src = fs.readFileSync(path.join(FX, f.file), 'utf8');
  const tr = translate(src);
  const tmp = path.join(TMP, f.file.replace(/\.zui$/, '.z'));
  fs.writeFileSync(tmp, tr);
  const raw = run(tmp, 'diagnose');
  let code = '(clean)', parsed = null;
  try {
    parsed = JSON.parse(raw.trim().split('\n').pop());
    const d = parsed.diagnostics || [];
    code = d.length ? d[0].code : '(clean)';
  } catch (e) { code = 'UNREADABLE:' + raw.trim().slice(0, 80); }
  // ground truth: what zui.js says on the original
  const truth = (Z.verify(src, {}).diagnostics || Z.verify(src, {})).map ? null : null;
  rows.push({ file: f.file, level: f.level, expect: f.expect_ids, got: code, msg: parsed && parsed.diagnostics && parsed.diagnostics[0] ? parsed.diagnostics[0].message : '' });
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
