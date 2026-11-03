// node tools/ui-audit-paths.test.js [path/to/ui-audit.html]   (default: tools/ui-audit.html)
// The path logic of Rules 120, 115 and 108 as the audit reads it (the "pure" block of ui-audit.html: no DOM).
const fs = require('fs');
const path = require('path');
const file = process.argv[2] || path.join(__dirname, 'ui-audit.html');
const html = fs.readFileSync(file, 'utf8');
const a = html.indexOf('/* ---- pure:'), b = html.indexOf('/* ---- end pure');
if (a < 0 || b < 0) { console.error('no pure block in ' + file); process.exit(2); }
const block = html.slice(a, b);
const names = ['auditBarPersistence', 'trailOwed'].filter(n => block.includes('function ' + n + '('));
const fns = new Function(block + '\nreturn { ' + names.join(', ') + ' };')();
let failed = 0;
function check(name, ok, detail) { console.log((ok ? 'ok   ' : 'FAIL ') + name + (ok ? '' : '  ' + detail)); if (!ok) failed++; }
const mk = (name, labels) => ({ name, items: labels.map(l => ({ label: l, href: '/s/' + l.toLowerCase(), marked: false })) });
const page = (label, ...bars) => ({ label, href: '/s/' + label.toLowerCase(), bars });
const SECTION = ['Course', 'Reference', 'Guide'];

if (fns.auditBarPersistence) {
  const same = [page('Course', mk('Section', SECTION)), page('Reference', mk('Section', SECTION)), page('Guide', mk('Section', SECTION))];
  check('a bar that is on every page it lists is one path', fns.auditBarPersistence(same).length === 0, JSON.stringify(fns.auditBarPersistence(same)));

  const nested = [page('Course', mk('Main', ['Learn', 'Course']), mk('Section', SECTION)),
                  page('Reference', mk('Main', ['Learn', 'Course']), mk('Section', SECTION), mk('Family', ['Reference', 'Remove']))];
  check('a deeper page that shows one more bar, and keeps the others, is fine', fns.auditBarPersistence(nested).length === 0, JSON.stringify(fns.auditBarPersistence(nested)));

  const lost = [page('Course', mk('Section', SECTION)), page('Reference', mk('Section', SECTION.slice(0, 2))), page('Guide', mk('Section', SECTION))];
  const f = fns.auditBarPersistence(lost);
  check('a bar that loses an entry on the page it lists is a finding on that page', f.some(x => x.page === 'Reference' && /Rule 115/.test(x.issues)), JSON.stringify(f));

  const dropped = [page('Course', mk('Section', SECTION)), page('Reference'), page('Guide', mk('Section', SECTION))];
  const g = fns.auditBarPersistence(dropped);
  check('a bar that is not shown at all on a page it lists is a finding on that page', g.length === 1 && g[0].page === 'Reference', JSON.stringify(g));

  const reordered = [page('Course', mk('Section', ['Course', 'Guide'])), page('Guide', mk('Section', ['Guide', 'Course']))];
  check('a reordered bar is a different bar', fns.auditBarPersistence(reordered).length >= 1, 'no finding');

  const lonely = [page('Course', mk('Section', ['Course', 'Elsewhere']))];
  check('a bar naming a page that was not audited has nothing to compare', fns.auditBarPersistence(lonely).length === 0, JSON.stringify(fns.auditBarPersistence(lonely)));
}
if (fns.trailOwed) {
  const steps = labels => labels.map(l => ({ label: l, href: '/s/' + l.toLowerCase() }));
  const marked = labels => labels.map(l => ({ label: l, href: '/s/' + l.toLowerCase() }));
  const r1 = fns.trailOwed(steps(['Home', 'Learn', 'Course']), marked(['Learn', 'Course']));
  check('a trail whose every step above the root is marked by a bar is not owed', r1.owed === false, JSON.stringify(r1));
  const r2 = fns.trailOwed(steps(['Home', 'Platform', 'The areas', 'String']), marked(['Platform', 'String']));
  check('a trail naming a level no bar marks is owed, and says which', r2.owed === true && r2.unmarked.length === 1 && r2.unmarked[0] === 'The areas', JSON.stringify(r2));
  const r3 = fns.trailOwed(steps(['Home', 'Learn']), []);
  check('with no marking bar at all the trail is owed', r3.owed === true, JSON.stringify(r3));
  const r4 = fns.trailOwed(steps(['Home']), []);
  check('the root alone owes nothing', r4.owed === false, JSON.stringify(r4));
  const r5 = fns.trailOwed([{ label: 'Course page', href: '/s/course' }], [{ label: 'Course', href: '/s/course' }]);
  check('a step is marked if its address is marked, even under another label', r5.owed === false, JSON.stringify(r5));
}
console.log(failed ? `\n${failed} check(s) failed in ${file}` : `\nall checks passed in ${file}`);
process.exitCode = failed ? 1 : 0;
