// node tools/ui-audit.test.js [path/to/ui-audit.html]   (default: tools/ui-audit.html)
// STZZUI-COLORPARSE-01. ui-audit.html read color(srgb 0..1) as 0..255, so every color-mix() background read as
// near-black and a real 14.80:1 was reported as 1.28:1. This takes the page's own colour functions out of the
// script and checks them. It fails on the old reading and passes on the new one: run it against the old file with
// `git show <commit before the fix>:tools/ui-audit.html > old.html` and pass old.html as the argument.
const fs = require('fs');
const path = require('path');
const file = process.argv[2] || path.join(__dirname, 'ui-audit.html');
const html = fs.readFileSync(file, 'utf8');
const a = html.indexOf('function parseColor'), b = html.indexOf('/* the background actually painted');
if (a < 0 || b < 0) { console.error('cannot find the colour functions in ' + file); process.exit(2); }
const span = html.slice(a, b);
const { parseColor, composite, luminance, contrast, readColor } = new Function(span + '\nreturn { parseColor, composite, luminance, contrast, readColor: typeof readColor === "function" ? readColor : null };')();

let failed = 0;
const near = (x, y, tol) => Math.abs(x - y) <= tol;
function check(name, ok, detail) { console.log((ok ? 'ok   ' : 'FAIL ') + name + (ok ? '' : '  ' + detail)); if (!ok) failed++; }

const rgb = parseColor('rgb(255, 255, 255)');
check('rgb() reads 0..255', rgb && rgb.r === 255 && rgb.g === 255 && rgb.b === 255 && rgb.a === 1, JSON.stringify(rgb));
const rgba = parseColor('rgba(0, 0, 0, 0.5)');
check('rgba() keeps its alpha', rgba && rgba.r === 0 && near(rgba.a, 0.5, 1e-9), JSON.stringify(rgba));
const mixed = parseColor('color(srgb 0.964706 0.972549 0.980392)');
check('color(srgb) reads 0..1 as 0..255', mixed && near(mixed.r, 246, 0.1) && near(mixed.g, 248, 0.1) && near(mixed.b, 250, 0.1), JSON.stringify(mixed));
const mixedA = parseColor('color(srgb 1 1 1 / 0.5)');
check('color(srgb) alpha after the slash', mixedA && near(mixedA.r, 255, 0.01) && near(mixedA.a, 0.5, 1e-9), JSON.stringify(mixedA));
const pct = parseColor('rgb(100% 0% 0% / 50%)');
check('space syntax with percentages', pct && near(pct.r, 255, 0.01) && pct.g === 0 && near(pct.a, 0.5, 1e-9), JSON.stringify(pct));
check('a colour in another space is unread, not misread', parseColor('oklch(0.7 0.1 200)') === null && parseColor('color(display-p3 1 0 0)') === null, 'got a colour');
check('not a colour is null', parseColor('transparent') === null && parseColor('') === null, 'got a colour');

// the case from the report: dark text on a color-mix() near-white background. Old reading: ~1.3:1. Real: ~16:1.
const fg = parseColor('rgb(17, 24, 39)'), bg = parseColor('color(srgb 0.95 0.96 0.98)');
const ratio = fg && bg ? contrast(fg, bg) : 0;
check('dark text on a color-mix() near-white background is above 14:1', ratio > 14 && ratio < 19, ratio.toFixed(2) + ':1');
const white = parseColor('color(srgb 1 1 1)'), black = parseColor('rgb(0, 0, 0)');
check('white against black is 21:1', white && black && near(contrast(white, black), 21, 0.01), white && black ? contrast(white, black).toFixed(2) : 'unparsed');
const half = parseColor('color(srgb 1 1 1 / 0.5)');
const comp = half && black ? composite(half, black) : null;
check('a translucent mixed colour composites over its background', comp && near(comp.r, 127.5, 0.1), JSON.stringify(comp));

// COLORPARSE-02: an unreadable colour is named, never silently skipped
check('readColor exists', typeof readColor === 'function', 'the audit has no way to say a colour is unreadable');
if (typeof readColor === 'function') {
  const un = readColor('oklch(0.7 0.1 200)');
  check('a colour in oklch is unreadable and carries its value', un.state === 'unreadable' && un.value === 'oklch(0.7 0.1 200)', JSON.stringify(un));
  const dp = readColor('color(display-p3 1 0 0)');
  check('a colour in display-p3 is unreadable', dp.state === 'unreadable' && /display-p3/.test(dp.value), JSON.stringify(dp));
  const ok = readColor('rgb(10, 20, 30)');
  check('a readable colour reads', ok.state === 'ok' && ok.color.r === 10, JSON.stringify(ok));
  check('transparent is transparent, not unreadable', readColor('transparent').state === 'transparent' && readColor('').state === 'transparent', 'wrong state');
  const mixed = readColor('color(srgb 0.5 0.5 0.5)');
  check('color(srgb) still reads', mixed.state === 'ok', JSON.stringify(mixed));
}

console.log(failed ? `\n${failed} check(s) failed in ${file}` : `\nall checks passed in ${file}`);
process.exitCode = failed ? 1 : 0;
