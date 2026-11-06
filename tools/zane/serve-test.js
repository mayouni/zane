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

   Exit 0 when every case holds, 1 when one does not, 2 when it cannot run.
   ========================================================================== */
const fs = require('fs'), path = require('path'), os = require('os'), net = require('net');
const { spawn } = require('child_process');

const ROOT = path.resolve(__dirname, '..', '..');
const args = process.argv.slice(2);
const opt = (name, dflt) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : dflt; };
const BIN = opt('--bin') && path.resolve(opt('--bin'));
const PORT = +opt('--port', 8791);
if (!BIN || !fs.existsSync(BIN)) { console.error('serve-test: --bin PATH names the zane binary'); process.exit(2); }

/* one raw request, the answer split into status, headers and body */
function ask(port, line, host = '127.0.0.1') {
  return new Promise((resolve, reject) => {
    const s = net.connect(port, host);
    const chunks = [];
    s.setTimeout(5000, () => { s.destroy(); reject(new Error('timeout: ' + line)); });
    s.on('connect', () => s.write(line + '\r\nHost: 127.0.0.1\r\n\r\n'));
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
    if (mode === 'embedded') {
      // a file of the repository the build does not embed does not exist for the embedded server
      await status(PORT_, 'GET /zig/src/main.zig HTTP/1.1', 404);
      await status(PORT_, 'GET /CLAUDE.md HTTP/1.1', 404);
    }
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
