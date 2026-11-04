#!/usr/bin/env node
'use strict';
/* ==========================================================================
   serve-beside.js -- serve another site read-only, with this repository's UI audit beside it, on one origin.

     node examples/web-case/serve-beside.js <the other site's folder> [port]
     then open  http://127.0.0.1:<port>/tools/ui-audit.html  and list the other site's pages in it.

   The UI audit reads pages through same-origin frames, so a site that is not served from the audit's own origin
   cannot be audited. This is the smallest honest way past that for a site you are only allowed to read: it serves
   the other folder as it is, serves /tools/ui-audit.html and the /site/ assets it loads from this repository, binds
   127.0.0.1 only, answers GET only, refuses any path outside the two folders, and writes nothing, anywhere.
   (The single binary of doc/design/BINARY.md replaces it with `zui serve --app`.)
   ========================================================================== */
const http = require('http'), fs = require('fs'), path = require('path');
const other = process.argv[2];
const port = +(process.argv[3] || 8769);
if (!other || !fs.existsSync(other)) { console.error('usage: node examples/web-case/serve-beside.js <folder of the other site> [port]'); process.exit(2); }
const OTHER = path.resolve(other);
const OURS = path.resolve(__dirname, '..', '..');
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.webp': 'image/webp', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.woff': 'font/woff', '.txt': 'text/plain', '.xml': 'application/xml' };
http.createServer((req, res) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') { res.writeHead(405); return res.end(); }
  let u = decodeURIComponent(req.url.split('?')[0]);
  if (u.endsWith('/')) u += 'index.html';
  const ours = u === '/tools/ui-audit.html' || u.startsWith('/site/') || u.startsWith('/constitution/');
  const base = ours ? OURS : OTHER;
  const file = path.normalize(path.join(base, u));
  if (!file.startsWith(base + path.sep)) { res.writeHead(403); return res.end('outside the folder'); }
  fs.readFile(file, (e, data) => {
    if (e) { res.writeHead(404); return res.end('not found'); }
    res.writeHead(200, { 'content-type': types[path.extname(file)] || 'application/octet-stream', 'cache-control': 'no-store' });
    res.end(req.method === 'HEAD' ? undefined : data);
  });
}).listen(port, '127.0.0.1', () => console.log(`serving ${OTHER} and the UI audit on http://127.0.0.1:${port}/ (read only)`));
