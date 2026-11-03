// node doc/design/audit/check-facts.js [facts.json]   (default: example.facts.json)
// Proves a facts file keeps its own schema and its own arithmetic, then prints the two decisions the facts
// can make (doc/design/AUDIT-FACTS.md section 4). It is a reference for the decisions, not the audit.
// Exit 0: valid, and for the example the verdicts are the ones the document states. Exit 1: not.
const fs = require('fs');
const path = require('path');
// node doc/design/audit/check-facts.js [facts.json] [--rules 62,105]   --rules asks for decisions on those rules only
// and is REFUSED (exit 1) for any rule that decides.json does not name: a screenshot does not decide it.
const args = process.argv.slice(2);
const file = args.find((a, i) => !a.startsWith('--') && args[i - 1] !== '--rules') || path.join(__dirname, 'example.facts.json');
const schema = JSON.parse(fs.readFileSync(path.join(__dirname, 'facts.schema.json'), 'utf8'));
const facts = JSON.parse(fs.readFileSync(file, 'utf8'));
const problems = [];

// ---- what the audit may decide, and by what thresholds: doc/design/audit/decides.json is the one place
const decides = JSON.parse(fs.readFileSync(path.join(__dirname, 'decides.json'), 'utf8'));
{
  const law = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', '..', 'constitution', 'rules.json'), 'utf8'));
  const numbers = new Set();
  for (const k of Object.keys(law)) if (/^set\d+$/.test(k)) for (const r of law[k].rules) numbers.add(r.number);
  const named = [...new Set(decides.decisions.flatMap(d => d.rules))].sort();
  if (named.join() !== [...decides.rules].sort().join()) problems.push(`decides.json: "rules" (${decides.rules}) is not the union of its decisions (${named})`);
  for (const r of decides.rules) if (!numbers.has(r)) problems.push(`decides.json: rule ${r} is not in the law`);
  const i = args.indexOf('--rules');
  if (i >= 0) for (const r of String(args[i + 1] || '').split(',').filter(Boolean)) if (!decides.rules.includes(r))
    problems.push(`rule ${r} is not decidable from these facts: decides.json names only ${decides.rules.join(', ')}`);
}
const T = decides.thresholds;
const ruleList = rs => (rs.length === 1 ? 'rule ' : 'rules ') + rs.join(', ');
const label = id => ruleList(decides.decisions.find(d => d.id === id).rules);

// ---- a validator for exactly the schema keywords facts.schema.json uses
const typeOf = v => v === null ? 'null' : Array.isArray(v) ? 'array' : Number.isInteger(v) ? 'integer' : typeof v;
const isType = (v, t) => t === 'number' ? typeof v === 'number' : typeOf(v) === t;
function validate(v, s, at) {
  if (s.const !== undefined && v !== s.const) problems.push(`${at}: must be ${JSON.stringify(s.const)}`);
  if (s.enum && !s.enum.includes(v)) problems.push(`${at}: must be one of ${s.enum.join(', ')}`);
  if (s.type) {
    const ts = [].concat(s.type);
    if (!ts.some(t => isType(v, t))) { problems.push(`${at}: must be ${ts.join(' or ')}, is ${typeOf(v)}`); return; }
  }
  if (typeof v === 'number') {
    if (s.minimum !== undefined && v < s.minimum) problems.push(`${at}: below ${s.minimum}`);
    if (s.maximum !== undefined && v > s.maximum) problems.push(`${at}: above ${s.maximum}`);
    if (s.exclusiveMinimum !== undefined && v <= s.exclusiveMinimum) problems.push(`${at}: must exceed ${s.exclusiveMinimum}`);
  }
  if (typeof v === 'string') {
    if (s.minLength !== undefined && v.length < s.minLength) problems.push(`${at}: empty`);
    if (s.pattern && !new RegExp(s.pattern).test(v)) problems.push(`${at}: does not match ${s.pattern}`);
  }
  if (Array.isArray(v)) {
    if (s.minItems !== undefined && v.length < s.minItems) problems.push(`${at}: fewer than ${s.minItems} items`);
    if (s.maxItems !== undefined && v.length > s.maxItems) problems.push(`${at}: more than ${s.maxItems} items`);
    if (s.items) v.forEach((x, i) => validate(x, s.items, `${at}[${i}]`));
  }
  if (v && typeof v === 'object' && !Array.isArray(v)) {
    for (const k of s.required || []) if (!(k in v)) problems.push(`${at}: missing ${k}`);
    for (const k of Object.keys(v)) {
      if (s.properties && s.properties[k]) validate(v[k], s.properties[k], `${at}.${k}`);
      else if (s.additionalProperties === false) problems.push(`${at}: unknown field ${k}`);
    }
  }
}
validate(facts, schema, '$');

// ---- the arithmetic the schema cannot state
const rel = (a, b) => Math.round(((Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)) * 100) / 100;
const round2 = x => Math.round(x * 100) / 100;
if (!problems.length) {
  const { width_px: W, height_px: H, scale } = facts.capture;
  const seen = new Set();
  for (const l of facts.lines) {
    if (seen.has(l.id)) problems.push(`${l.id}: id repeated`);
    seen.add(l.id);
    const [x0, y0, x1, y1] = l.box;
    if (!(x1 > x0 && y1 > y0)) problems.push(`${l.id}: box is empty or reversed`);
    if (x1 > W || y1 > H) problems.push(`${l.id}: box leaves the ${W}x${H} image`);
    if (l.line_height_px !== y1 - y0) problems.push(`${l.id}: line_height_px ${l.line_height_px} is not y1 - y0 = ${y1 - y0}`);
    const pt = round2(l.line_height_px * 72 / (96 * scale));
    if (Math.abs(pt - l.line_height_pt) > 0.01) problems.push(`${l.id}: line_height_pt ${l.line_height_pt} is not ${pt} at scale ${scale}`);
    if ((l.fg_luminance === null || l.bg_luminance === null) !== (l.contrast_ratio === null)) problems.push(`${l.id}: contrast_ratio must be null exactly when a luminance is`);
    else if (l.contrast_ratio !== null && Math.abs(rel(l.fg_luminance, l.bg_luminance) - l.contrast_ratio) > 0.01)
      problems.push(`${l.id}: contrast_ratio ${l.contrast_ratio} is not ${rel(l.fg_luminance, l.bg_luminance)}`);
  }
}

// ---- the two decisions. Three outcomes: fail, pass, not_decided. A size is never "pass": see section 4.
const MIN_SCORE = T.min_ocr_score, SPREAD_LIMIT = T.spread_limit, CONTRAST_FLOOR = T.contrast_floor, SIZE_FLOOR_PT = T.size_floor_pt; // 1rem = 16 CSS px = 12 pt
// The WORST END of the background: bg_luminance moved by bg_spread toward the text colour. A pass must hold there.
function worstEnd(l) {
  const bg = l.fg_luminance > l.bg_luminance ? Math.min(1, l.bg_luminance + l.bg_spread) : Math.max(0, l.bg_luminance - l.bg_spread);
  return { bg, ratio: rel(l.fg_luminance, bg) };
}
function contrast(l) {
  if (l.score < MIN_SCORE) return ['not_decided', `OCR score ${l.score} is below ${MIN_SCORE}`];
  if (l.contrast_ratio === null) return ['not_decided', 'luminance was not measured'];
  if (l.bg_spread !== undefined && l.bg_spread !== null && l.bg_spread > SPREAD_LIMIT) return ['not_decided', `background spread ${l.bg_spread} is above ${SPREAD_LIMIT}: text over a gradient or an image`];
  if (l.contrast_ratio < CONTRAST_FLOOR) return ['fail', `${l.contrast_ratio}:1 is below ${CONTRAST_FLOOR}:1${(l.bg_spread === undefined || l.bg_spread === null) ? ' (an estimate: background spread not measured)' : ''}`];
  if (l.bg_spread === undefined || l.bg_spread === null) return ['pass', `${l.contrast_ratio}:1 is at least ${CONTRAST_FLOOR}:1 (an estimate: background spread not measured, so the worst end of the background is unknown)`];
  if (l.bg_spread === 0) return ['pass', `${l.contrast_ratio}:1 is at least ${CONTRAST_FLOOR}:1, background uniform`];
  const w = worstEnd(l);
  return w.ratio >= CONTRAST_FLOOR
    ? ['pass', `${l.contrast_ratio}:1, and ${w.ratio}:1 at the worst end of the background: at least ${CONTRAST_FLOOR}:1 at both`]
    : ['not_decided', `${l.contrast_ratio}:1 at the typical background but ${w.ratio}:1 at the worst end (background ${l.bg_luminance} moved ${l.bg_spread} toward the text colour): never a pass`];
}
function size(l, kind) {
  if (l.score < MIN_SCORE) return ['not_decided', `OCR score ${l.score} is below ${MIN_SCORE}`];
  if (kind !== 'line') return ['not_decided', 'boxes are ink boxes: they can be half an em tall, so they bound nothing'];
  return l.line_height_pt < SIZE_FLOOR_PT
    ? ['fail', `the line box is ${l.line_height_pt} pt, so the font is at most that: below the ${SIZE_FLOOR_PT} pt (16 CSS px) floor`]
    : ['not_decided', `a ${l.line_height_pt} pt line box does not show the font is large: line height can be generous around small text`];
}

let out = [];
if (!problems.length) {
  console.log(`${facts.lines.length} line${facts.lines.length === 1 ? '' : 's'} found; text the OCR did not find is not audited
`);
  for (const l of facts.lines) {
    const c = contrast(l), s = size(l, facts.capture.box_kind);
    out.push({ id: l.id, contrast: c[0], size: s[0] });
    console.log(`${l.id} "${l.text}"\n  ${('contrast (' + label('contrast') + ')').padEnd(26)}${c[0].padEnd(11)} ${c[1]}\n  ${('size floor (' + label('size') + ')').padEnd(26)}${s[0].padEnd(11)} ${s[1]}`);
  }
  console.log(`\nNOT AUDITED: every rule other than ${decides.rules.join(', ')} (rule 105 only for its contrast half). A screenshot does not decide them, and "not audited" is not "passed".`);
  console.log('PROJECTED, NOT VERIFIED BY A PERSON (CENTRAL-PERCEPTGATE-01): nobody looked at the screenshot these facts describe.');
  if (path.resolve(file) === path.resolve(__dirname, 'example.facts.json')) {
    const want = { L1: ['fail', 'fail'], L2: ['pass', 'not_decided'], L3: ['not_decided', 'not_decided'] };
    for (const r of out) if (want[r.id][0] !== r.contrast || want[r.id][1] !== r.size) problems.push(`${r.id}: the document states ${want[r.id]}, the decision gave ${[r.contrast, r.size]}`);
  }
}
if (problems.length) { console.log('\nPROBLEMS'); for (const p of problems) console.log('  ' + p); }
else console.log(`\n${file}: valid; ${facts.lines.length} line(s)`);
process.exitCode = problems.length ? 1 : 0;
