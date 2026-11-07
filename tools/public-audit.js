// The pre-public audit of Central's ZANE-RELEASE-01, item 6 (doc/releases/PUBLIC-AUDIT.md): every commit reachable from every ref
// (git log -p --all), the lines each ADDS and its message, scanned for secrets, e-mail addresses other than the author's and local
// paths; every file named .env; every blob in history over 5 MB. A removed line was added by an earlier commit, so added lines and
// messages cover the whole history. Reads only; rewrites nothing. Each hit names the EARLIEST commit that added it to its path.
//   node tools/public-audit.js . OUT.json
'use strict';
const { spawn, execFileSync } = require('child_process');
const fs = require('fs');
const readline = require('readline');
const REPO = process.argv[2], OUT = process.argv[3];
const git = (...a) => execFileSync('git', ['-C', REPO, ...a], { encoding: 'utf8', maxBuffer: 1 << 30 });

const AUTHOR = new Set(['kalidianow@gmail.com']);
const PATTERNS = [
  ['github token ghp_', /\bghp_[A-Za-z0-9]{20,}/],
  ['github token github_pat_', /\bgithub_pat_[A-Za-z0-9_]{20,}/],
  ['github token gho_/ghu_/ghs_/ghr_', /\bgh[ousr]_[A-Za-z0-9]{20,}/],
  ['api key sk-', /\bsk-(?:ant-|proj-)?[A-Za-z0-9_-]{20,}/],
  ['aws key AKIA', /\bAKIA[0-9A-Z]{16}\b/],
  ['private key block', /BEGIN [A-Z ]*PRIVATE KEY/],
  ['slack token', /\bxox[abprs]-[A-Za-z0-9-]{10,}/],
  ['google api key', /\bAIza[0-9A-Za-z_-]{35}\b/],
  ['bearer header', /\bBearer\s+[A-Za-z0-9._~+/-]{20,}=*/],
  ['password', /password/i],
  ['secret', /secret/i],
  ['token', /\btoken\s*[:=]\s*["'][^"']{8,}/i],
];
const EMAIL = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g;
const LOCAL = [
  ['a local user path', /C:\\\\?Users\\\\?[^\\\s"'`]+|C:\/Users\/[^\/\s"'`]+|\/mnt\/[a-z]\/Users\//i],
];

const hits = { patterns: {}, emails: {}, local: {}, envFiles: [], big: [], centralFiles: new Set(), claudeFiles: new Set() };
const add = (bucket, key, rec) => { (bucket[key] = bucket[key] || []).push(rec); };

// files named .env, and paths under .central/ and .claude/, from every commit's file list
for (const line of git('log', '--all', '--format=COMMIT %H', '--name-only').split('\n')) {
  if (!line || line.startsWith('COMMIT ')) continue;
  if (/(^|\/)\.env(\.|$)/.test(line)) hits.envFiles.push(line);
  if (line.startsWith('.central/')) hits.centralFiles.add(line);
  if (line.startsWith('.claude/')) hits.claudeFiles.add(line);
}
// every blob over 5 MB
const objs = git('rev-list', '--objects', '--all').split('\n').filter(Boolean);
const cat = execFileSync('git', ['-C', REPO, 'cat-file', '--batch-check=%(objecttype) %(objectname) %(objectsize) %(rest)'], { input: objs.join('\n') + '\n', encoding: 'utf8', maxBuffer: 1 << 30 });
let biggest = [];
for (const l of cat.split('\n')) {
  const m = /^blob (\w+) (\d+) ?(.*)$/.exec(l);
  if (!m) continue;
  biggest.push({ blob: m[1], bytes: +m[2], path: m[3] });
  if (+m[2] > 5 * 1024 * 1024) hits.big.push({ blob: m[1], bytes: +m[2], path: m[3] });
}
biggest.sort((a, b) => b.bytes - a.bytes); biggest = biggest.slice(0, 5);
// identities
const ids = new Set(git('log', '--all', '--format=%an <%ae>|%cn <%ce>').split('\n').flatMap(l => l.split('|')).filter(Boolean));

// the patch stream: the message and the added lines of every commit
const p = spawn('git', ['-C', REPO, 'log', '-p', '--all', '-U0', '--no-color', '--no-ext-diff', '--format=COMMIT %H%n%B%nENDMSG']);
const rl = readline.createInterface({ input: p.stdout, crlfDelay: Infinity });
let commit = '', file = '(message)', inMsg = false, lines = 0;
rl.on('line', line => {
  lines++;
  if (line.startsWith('COMMIT ') && /^COMMIT [0-9a-f]{40}$/.test(line)) { commit = line.slice(7, 19); file = '(message)'; inMsg = true; return; }
  if (inMsg) { if (line === 'ENDMSG') { inMsg = false; return; } scan(line, '(message)'); return; }
  if (line.startsWith('+++ ')) { file = line.slice(4).replace(/^b\//, ''); return; }
  if (line.startsWith('+') && !line.startsWith('+++')) scan(line.slice(1), file);
});
function scan(text, where) {
  for (const [name, re] of PATTERNS) { const m = re.exec(text); if (m) add(hits.patterns, name, { commit, path: where, text: text.trim().slice(0, 160) }); }
  for (const m of text.matchAll(EMAIL)) { const e = m[0].toLowerCase(); if (!AUTHOR.has(e)) add(hits.emails, e, { commit, path: where }); }
  for (const [name, re] of LOCAL) { const m = re.exec(text); if (m) add(hits.local, m[0], { commit, path: where }); }
}
rl.on('close', () => {
  // git log lists the newest commit first, so the last record seen for a path is the earliest commit that added it there
  const firsts = recs => { const seen = new Map(); for (const r of recs) { const n = seen.has(r.path) ? seen.get(r.path).n : 0; seen.set(r.path, { ...r, n: n + 1 }); } return [...seen.values()]; };
  const out = {
    lines, identities: [...ids],
    patterns: Object.fromEntries(Object.entries(hits.patterns).map(([k, v]) => [k, { total: v.length, byPath: firsts(v) }])),
    emails: Object.fromEntries(Object.entries(hits.emails).map(([k, v]) => [k, { total: v.length, byPath: firsts(v) }])),
    local: Object.fromEntries(Object.entries(hits.local).map(([k, v]) => [k, { total: v.length, byPath: firsts(v).slice(0, 12), paths: new Set(v.map(r => r.path)).size }])),
    envFiles: [...new Set(hits.envFiles)], big: hits.big, biggest,
    centralFiles: [...hits.centralFiles].sort(), claudeFiles: [...hits.claudeFiles].sort(),
  };
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
  console.log('lines ' + lines + '; patterns ' + Object.entries(out.patterns).map(([k, v]) => k + ' ' + v.total).join(', ') + '; emails ' + Object.keys(out.emails).length + '; local ' + Object.keys(out.local).length + '; env ' + out.envFiles.length + '; big ' + out.big.length);
});
