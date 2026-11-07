#!/usr/bin/env node
'use strict';
/* ==========================================================================
   serve-test.js -- the gate of `zane serve` (doc/design/BINARY.md, stage S4): what the server answers, and what it refuses.

     node tools/zane/serve-test.js --bin PATH [--port N]

   It starts the binary three times, on free ports of 127.0.0.1: `zane serve` answering from the site embedded in it, `zane serve
   --root` answering from this repository's folder, and `zane serve --app` on a small folder it makes, and asks each for paths whose
   answer is known. The embedded site must answer as the folder does, and a file it does not embed must be 404. Every file is compared byte for byte with the file
   on disk. Every step out of the root, written plainly or percent-encoded, with a backslash or a NUL, must be 404; a method
   other than GET and HEAD must be 405; a folder without index.html must be 404 and never listed; and the server must not be
   reachable on any other address of this machine. A raw socket sends each request, so no client tidies a `..` away before
   the server sees it.

   The binary embeds only what the pages reach (build.zig; the author, 2026-11-07). So both servers of the repository are also
   crawled over HTTP from index.html and every page under site/, more broadly than the build crawls: every href, src, srcset,
   poster, action and data-* value that is a path, every CSS url(), and every quoted path to a file in a page's scripts or in a script it
   loads, read against the page and against the root. An address the folder serves and the binary does not is a failure: a page
   would reach a file the binary left out.

   The embedded text is stored as gzip (build.zig, zig/src/sitepack.zig). Every case above asks with no Accept-Encoding, so it is
   answered inflated, byte for byte the file on disk; the gzip cases ask with it, and the body, gunzipped, must be the file on
   disk again, with Content-Encoding: gzip and Vary: Accept-Encoding. A coding refused by q=0, or not offered, is answered
   inflated; a file stored as it is (a photograph, the wasm) never carries Content-Encoding; a folder's files never do.

   Exit 0 when every case holds, 1 when one does not, 2 when it cannot run.
   ========================================================================== */
const fs = require('fs'), path = require('path'), os = require('os'), net = require('net');
const { spawn } = require('child_process');
const zlib = require('zlib');

const ROOT = path.resolve(__dirname, '..', '..');
const args = process.argv.slice(2);
const opt = (name, dflt) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : dflt; };
const BIN = opt('--bin') && path.resolve(opt('--bin'));
const PORT = +opt('--port', 8791);
if (!BIN || !fs.existsSync(BIN)) { console.error('serve-test: --bin PATH names the zane binary'); process.exit(2); }

/* one raw request, the answer split into status, headers and body */
function ask(port, line, host = '127.0.0.1', extra = '') {
  return new Promise((resolve, reject) => {
    const s = net.connect(port, host);
    const chunks = [];
    s.setTimeout(5000, () => { s.destroy(); reject(new Error('timeout: ' + line)); });
    s.on('connect', () => s.write(line + '\r\nHost: 127.0.0.1\r\n' + extra + '\r\n'));
    s.on('data', d => chunks.push(d));
    s.on('error', reject);
    s.on('end', () => {
      const all = Buffer.concat(chunks), cut = all.indexOf('\r\n\r\n');
      const head = all.slice(0, cut).toString('latin1').split('\r\n');
      const headers = Object.fromEntries(head.slice(1).map(h => [h.slice(0, h.indexOf(':')).toLowerCase(), h.slice(h.indexOf(':') + 1).trim()]));
      resolve({ status: +head[0].split(' ')[1], headers, body: all.slice(cut + 4) });
    });
  });
}

function start(argv, port) {
  return new Promise((resolve, reject) => {
    const p = spawn(BIN, ['serve', ...argv, '--port', String(port)], { cwd: ROOT });
    let said = '';
    p.stdout.on('data', d => { said += d; if (said.includes('http://')) resolve(p); });
    p.stderr.on('data', d => { said += d; });
    p.on('exit', c => reject(new Error(`zane serve exited ${c}: ${said}`)));
    setTimeout(() => reject(new Error('zane serve did not start: ' + said)), 10000);
  });
}

/* ---- what the pages reach, crawled over HTTP ---- */
const EXT = 'json|wasm|html|css|js|svg|webp|png|jpe?g|gif|ico|md|zane|txt|csv|gbnf|stzu|pdf';
const PATHLIKE = new RegExp(`/|\\.(?:${EXT})$`);
function refsOf(text, html) {
  const out = [];
  if (html) {
    for (const m of text.matchAll(/\s(?:href|src|poster|action|data-[a-z-]+)\s*=\s*"([^"]*)"/g)) out.push(m[1]);
    for (const m of text.matchAll(/\ssrcset\s*=\s*"([^"]*)"/g)) for (const c of m[1].split(',')) out.push(c.trim().split(/\s+/)[0]);
  }
  for (const m of text.matchAll(/url\(\s*['"]?([^'")]+)/g)) out.push(m[1].trim());
  return out.filter(r => r && !/\s/.test(r) && PATHLIKE.test(r.replace(/[?#].*$/, '')));
}
const literalsOf = text => [...text.matchAll(new RegExp(`['"\`]([^'"\`\\s]+\\.(?:${EXT}))['"\`]`, 'g'))].map(m => m[1]);
function resolveUrl(base, ref) {
  if (/^(#|[a-z][a-z0-9+.-]*:|\/\/)/i.test(ref)) return null;
  ref = ref.replace(/[?#].*$/, '');
  if (!ref) return null;
  const parts = ref.startsWith('/') ? [] : base.split('/').filter(Boolean);
  for (const s of ref.split('/')) { if (!s || s === '.') continue; if (s === '..') { if (!parts.length) return null; parts.pop(); } else parts.push(s); }
  return '/' + parts.join('/') + (ref.endsWith('/') && parts.length ? '/' : '');
}
async function crawl(port) {
  const seen = new Map(), queue = [], scripts = new Map();
  const want = u => { if (u && !seen.has(u)) { seen.set(u, null); queue.push(u); } };
  want('/index.html');
  (function walk(d) { for (const e of fs.readdirSync(path.join(ROOT, d), { withFileTypes: true })) { const q = d + '/' + e.name; if (e.isDirectory()) walk(q); else if (q.endsWith('.html')) want('/' + q); } })('site');
  while (queue.length) {
    const u = queue.shift();
    const r = await ask(port, `GET ${u} HTTP/1.1`);
    seen.set(u, r.status);
    const html = /\.html$|\/$/.test(u), css = u.endsWith('.css');
    if (r.status !== 200 || !(html || css)) continue;
    const base = u.slice(0, u.lastIndexOf('/') + 1), text = r.body.toString('utf8');
    for (const ref of refsOf(text, html)) want(resolveUrl(base, ref));
    if (!html) continue;
    // a quoted path counts where a fetch is written, in script text: an attribute such as data-excerpt names a file to a check, not to a browser
    const lits = literalsOf([...text.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)].map(m => m[1]).join('\n'));
    for (const ref of refsOf(text, true)) {
      const s = resolveUrl(base, ref);
      if (!s || !s.endsWith('.js')) continue;
      if (!scripts.has(s)) { const j = await ask(port, `GET ${s} HTTP/1.1`); scripts.set(s, j.status === 200 ? literalsOf(j.body.toString('utf8')) : []); }
      lits.push(...scripts.get(s));
    }
    for (const l of lits) { want(resolveUrl(base, l)); want(resolveUrl('/', l)); }
  }
  return seen;
}
const crawled = {};

const failures = [];
let cases = 0;
const expect = (label, ok, why) => { cases++; if (!ok) failures.push(`${label}: ${why}`); };

async function file(port, url, disk, type) {
  const r = await ask(port, `GET ${url} HTTP/1.1`);
  const want = fs.readFileSync(disk);
  expect(`GET ${url}`, r.status === 200 && r.body.equals(want) && (!type || r.headers['content-type'].startsWith(type)),
    `status ${r.status}, ${r.body.length} bytes against ${want.length}, ${r.headers['content-type']}`);
}
async function status(port, line, code) {
  const r = await ask(port, line);
  expect(line, r.status === code, `status ${r.status}, expected ${code}`);
}

/* the paths that step out of the root, each of which must be 404 */
const OUT = ['/../README.md', '/site/../../README.md', '/%2e%2e/README.md', '/%2E%2E/README.md', '/site/%2e%2e/%2e%2e/README.md',
  '/..%2fREADME.md', '/%2e%2e%2fREADME.md', '/site/..%5c..%5cREADME.md', '/site%5c..%5c..%5cREADME.md', '/..\\README.md',
  '/site/stz.css%00.html', '/%2e%2e', '/..', '/site/..', '/C:/Windows/win.ini', '/C:%5cWindows%5cwin.ini', '//etc/passwd', '/%zz'];

(async () => {
  // ---- the repository: the site, the Reader, the audit; from the binary itself, then from the folder ----
  let p;
  for (const [mode, argv, port] of [['embedded', [], PORT], ['from the folder', ['--root', ROOT], PORT + 2]]) {
  p = await start(argv, port);
  const PORT_ = port;
  try {
    await file(PORT_, '/', path.join(ROOT, 'index.html'), 'text/html');
    await file(PORT_, '/index.html', path.join(ROOT, 'index.html'), 'text/html');
    await file(PORT_, '/site/stz.css?v=1', path.join(ROOT, 'site', 'stz.css'), 'text/css');
    await file(PORT_, '/site/zane.wasm', path.join(ROOT, 'site', 'zane.wasm'), 'application/wasm');
    await file(PORT_, '/constitution/reader/', path.join(ROOT, 'constitution', 'reader', 'index.html'), 'text/html');
    const moved = await ask(PORT_, 'GET /constitution/reader HTTP/1.1');   // a folder without its slash is sent to the address with one
    expect('GET /constitution/reader', moved.status === 301 && moved.headers.location === '/constitution/reader/', `status ${moved.status}, location ${moved.headers.location}`);
    await file(PORT_, '/tools/ui-audit.html', path.join(ROOT, 'tools', 'ui-audit.html'), 'text/html');
    await file(PORT_, '/site/assets/niamey-national-museum.webp', path.join(ROOT, 'site', 'assets', 'niamey-national-museum.webp'), 'image/webp');
    await file(PORT_, '/doc/language/GRAMMAR.md', path.join(ROOT, 'doc', 'language', 'GRAMMAR.md'), 'text/plain');
    await file(PORT_, '/site/how%2Ehtml', path.join(ROOT, 'site', 'how.html'), 'text/html');
    const h = await ask(PORT_, 'HEAD /site/stz.css HTTP/1.1');
    expect('HEAD /site/stz.css', h.status === 200 && h.body.length === 0 && +h.headers['content-length'] === fs.statSync(path.join(ROOT, 'site', 'stz.css')).size,
      `status ${h.status}, body ${h.body.length}, content-length ${h.headers['content-length']}`);
    for (const m of ['POST', 'PUT', 'DELETE', 'OPTIONS']) await status(PORT_, `${m} /index.html HTTP/1.1`, 405);
    await status(PORT_, 'GET /site/ HTTP/1.1', 404);           // a folder without index.html: never listed
    await status(PORT_, 'GET /site/no-such-page.html HTTP/1.1', 404);
    await status(PORT_, 'GET /__zane/ui-audit.html HTTP/1.1', 404); // the audit's --app address is not served here
    // ---- Accept-Encoding: the embedded text is stored as gzip and sent as gzip only to a client that takes it ----
    const GZ = 'Accept-Encoding: gzip, deflate, br\r\n';
    for (const [url, disk] of [['/index.html', 'index.html'], ['/site/stz.css', 'site/stz.css'], ['/constitution/rules.json', 'constitution/rules.json'], ['/site/law-numbers.js', 'site/law-numbers.js']]) {
      const want = fs.readFileSync(path.join(ROOT, disk));
      for (const [label, extra] of [['gzip accepted', GZ], ['x-gzip accepted', 'Accept-Encoding: x-gzip\r\n'], ['gzip refused by q=0', 'Accept-Encoding: gzip;q=0, br\r\n'], ['no Accept-Encoding', ''], ['br only', 'Accept-Encoding: br\r\n']]) {
        const r = await ask(PORT_, `GET ${url} HTTP/1.1`, '127.0.0.1', extra);
        const zipped = r.headers['content-encoding'] === 'gzip';
        const body = zipped ? zlib.gunzipSync(r.body) : r.body;
        const shouldZip = mode === 'embedded' && /accepted/.test(label);
        expect(`GET ${url} [${label}]`, r.status === 200 && zipped === shouldZip && body.equals(want) && +r.headers['content-length'] === r.body.length
          && (mode !== 'embedded' || r.headers['vary'] === 'Accept-Encoding'),
          `status ${r.status}, content-encoding ${r.headers['content-encoding']}, vary ${r.headers['vary']}, ${body.length} bytes against ${want.length}`);
      }
    }
    for (const [url, disk] of [['/site/zane.wasm', 'site/zane.wasm'], ['/site/assets/niamey-national-museum-800.webp', 'site/assets/niamey-national-museum-800.webp']]) {
      const r = await ask(PORT_, `GET ${url} HTTP/1.1`, '127.0.0.1', GZ);
      expect(`GET ${url} [gzip accepted, stored as it is]`, r.status === 200 && !r.headers['content-encoding'] && r.body.equals(fs.readFileSync(path.join(ROOT, disk))),
        `status ${r.status}, content-encoding ${r.headers['content-encoding']}`);
    }
    {
      const g = await ask(PORT_, 'GET /site/stz.css HTTP/1.1', '127.0.0.1', GZ), h = await ask(PORT_, 'HEAD /site/stz.css HTTP/1.1', '127.0.0.1', GZ);
      expect('HEAD /site/stz.css [gzip accepted]', h.status === 200 && h.body.length === 0 && h.headers['content-length'] === g.headers['content-length'] && h.headers['content-encoding'] === g.headers['content-encoding'],
        `status ${h.status}, content-length ${h.headers['content-length']} against ${g.headers['content-length']}, content-encoding ${h.headers['content-encoding']}`);
    }
    if (mode === 'embedded') {
      // a file of the repository the build does not embed does not exist for the embedded server: no page reaches these
      await status(PORT_, 'GET /zig/src/main.zig HTTP/1.1', 404);
      await status(PORT_, 'GET /CLAUDE.md HTTP/1.1', 404);
      await status(PORT_, 'GET /tools/zane/parity.js HTTP/1.1', 404);
      await status(PORT_, 'GET /tools/site-shell.js HTTP/1.1', 404);
    }
    crawled[mode] = await crawl(PORT_);
    for (const u of OUT) await status(PORT_, `GET ${u} HTTP/1.1`, 404);
    // reachable on 127.0.0.1 only: every other IPv4 address of this machine refuses
    const others = Object.values(os.networkInterfaces()).flat().filter(n => n && n.family === 'IPv4' && !n.internal).map(n => n.address);
    for (const addr of others) {
      const reached = await ask(PORT_, 'GET / HTTP/1.1', addr).then(() => true, () => false);
      expect(`GET / on ${addr}`, !reached, 'the server answered on an address other than 127.0.0.1');
    }
    if (!others.length) console.log('  bind         no other IPv4 address on this machine: the 127.0.0.1-only case was not exercised');
  } finally { p.kill(); }
  }

  // ---- every address the pages reach answers alike from the binary and from the folder ----
  const emb = crawled.embedded, dir = crawled['from the folder'];
  const reachedAll = [...new Set([...dir.keys(), ...emb.keys()])].sort();
  let reachedOk = 0;
  for (const u of reachedAll) {
    const d = dir.has(u) ? dir.get(u) : 'not reached', e = emb.has(u) ? emb.get(u) : 'not reached';
    expect(`reach ${u}`, d === e || (d !== 200 && e !== 200), `the folder answers ${d} and the binary ${e}: a page reaches a file the binary ${e === 200 ? 'has and the folder lacks' : 'does not embed'}`);
    if (d === 200 && e === 200) reachedOk++;
  }
  console.log(`  reach        ${reachedAll.length} addresses the pages reach, crawled from both servers; ${reachedOk} files answered alike, the rest 404 or 301 from both`);

  // ---- --app: another folder, read only, with the audit beside it ----
  const APP = fs.mkdtempSync(path.join(os.tmpdir(), 'zane-serve-app-'));
  fs.writeFileSync(path.join(APP, 'index.html'), '<!doctype html><title>app</title><p>the app');
  fs.mkdirSync(path.join(APP, 'site'));
  fs.writeFileSync(path.join(APP, 'site', 'page.html'), '<p>its own site/ folder');
  const port2 = PORT + 1;
  p = await start(['--app', APP], port2);
  try {
    await file(port2, '/', path.join(APP, 'index.html'), 'text/html');
    await file(port2, '/site/page.html', path.join(APP, 'site', 'page.html'), 'text/html');
    await file(port2, '/__zane/ui-audit.html', path.join(ROOT, 'tools', 'ui-audit.html'), 'text/html');
    await status(port2, 'GET /site/stz.css HTTP/1.1', 404);   // this repository's files are not the app's
    for (const u of OUT) await status(port2, `GET ${u} HTTP/1.1`, 404);
  } finally { p.kill(); fs.rmSync(APP, { recursive: true, force: true }); }

  for (const f of failures) console.log('  FAIL ' + f);
  console.log(`serve-test: ${cases - failures.length} of ${cases} cases hold (${OUT.length} paths out of the root, each asked of all three servers)`);
  process.exit(failures.length ? 1 : 0);
})().catch(e => { console.error('serve-test: ' + e.message); process.exit(2); });
