#!/usr/bin/env node
'use strict';
/* ==========================================================================
   zane — the verifier CLI.

     zane check <file.zane> [file.zane …] [options]

   Options
     --level N          conformance level to run at (1-4, default 2)
     --symbols FILE     JSON symbol table for Level 3
                        {entities, actors, state, elements}
     --contract FILE    path to violations.json (default: ../../conformance)
     --json             machine-readable output
     --quiet            findings only, no summary
     -h, --help

   Exit codes: 0 clean · 1 violations found · 2 usage or read error.

   The severity, level and rule bindings of every diagnostic are LOADED from
   conformance/violations.json -- they are not hardcoded here. The tool cites
   the law by reading it, which is the same discipline the law demands of
   everything else in this project.
   ========================================================================== */

const fs = require('fs');
const path = require('path');
const { verify } = require('./zane.js');
const { toEnvelope } = require('./envelope.js');

/* ---- argument parsing ---- */

function parseArgs(argv) {
  const opts = { files: [], level: 2, symbols: null, contract: null, json: false, quiet: false, help: false };
  let command = null;

  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '-h' || a === '--help') { opts.help = true; }
    else if (a === '--json') opts.json = true;
    else if (a === '--quiet') opts.quiet = true;
    else if (a === '--level') opts.level = parseInt(argv[++i], 10);
    else if (a === '--symbols') opts.symbols = argv[++i];
    else if (a === '--contract') opts.contract = argv[++i];
    else if (a.startsWith('-')) { opts.unknown = a; }
    else if (!command) command = a;
    else opts.files.push(a);
  }
  opts.command = command;
  return opts;
}

const USAGE = `zane — the Zane verifier

  zane check <file.zane> [file.zane …] [options]

  --level N        conformance level, 1-4 (default 2)
  --symbols FILE   JSON symbol table for Level 3 checks
  --contract FILE  path to violations.json
  --json           machine-readable output
  --quiet          findings only
  -h, --help       this text

Level 2 is the honest default: everything decidable from one declaration.
Level 3 checks are SKIPPED unless --symbols supplies what they need --
undecidable is silence, never a pass.

Specification: doc/language/ · Conformance: conformance/`;

/* ---- the diagnostic contract ---- */

function loadContract(explicit) {
  const candidates = explicit ? [explicit] : [
    path.join(__dirname, '..', '..', 'conformance', 'violations.json'),
    path.join(process.cwd(), 'conformance', 'violations.json'),
    path.join(process.cwd(), 'violations.json')
  ];
  for (const c of candidates) {
    if (fs.existsSync(c)) {
      const data = JSON.parse(fs.readFileSync(c, 'utf8'));
      const byId = new Map();
      for (const d of data.diagnostics) byId.set(d.id, d);
      return { byId, path: c, version: data.metadata && data.metadata.version, constitution: data.metadata && data.metadata.constitution };
    }
  }
  return null;
}

/* Failures to read the file at all, always fatal. They are in the contract
   since 1.6 and meta() prefers it; this table is the fallback for a run that
   cannot find violations.json, which the tool is meant to survive. */
const STRUCTURAL = {
  SYNTAX_ERROR: { severity: 'error', level: 1 },
  UNKNOWN_FIELD: { severity: 'error', level: 1 },
  UNEXPECTED_CHARACTER: { severity: 'error', level: 1 },
  UNTERMINATED_STRING: { severity: 'error', level: 1 }
};

function meta(contract, id) {
  if (contract && contract.byId.has(id)) return contract.byId.get(id);
  return STRUCTURAL[id] || { severity: 'error', level: 1 };
}

/* The law itself, when it can be found: it turns "Article reversibility" into
   "Article IV" and gives every cited rule its title. Optional -- the verifier
   works without it, it simply cites less richly. */
function loadLaw(contractPath) {
  const candidates = [
    path.join(__dirname, '..', '..', 'constitution', 'rules.json'),
    path.join(process.cwd(), 'constitution', 'rules.json')
  ];
  if (contractPath) candidates.unshift(path.join(path.dirname(contractPath), '..', 'constitution', 'rules.json'));
  for (const c of candidates) {
    try {
      if (!fs.existsSync(c)) continue;
      const law = JSON.parse(fs.readFileSync(c, 'utf8'));
      const ruleTitles = new Map();
      for (const key of Object.keys(law)) {
        if (!/^set\d+$/.test(key)) continue;
        for (const r of law[key].rules || []) ruleTitles.set(String(r.number), r.title);
      }
      const articles = new Map();
      for (const [k, a] of Object.entries(law.articles || {})) articles.set(k, { numeral: a.numeral, title: a.title });
      return { ruleTitles, articles, version: law.metadata && law.metadata.version };
    } catch (e) { /* a malformed law is not this tool's business to report */ }
  }
  return null;
}

function citation(m, law) {
  const bits = [];
  if (m.rules && m.rules.length) {
    bits.push(m.rules.map(r => {
      const t = law && law.ruleTitles.get(String(r));
      return t ? `Rule ${r} · ${t}` : `Rule ${r}`;
    }).join(' · '));
  }
  if (m.articles && m.articles.length) {
    bits.push(m.articles.map(a => {
      const art = law && law.articles.get(a);
      return art ? `Article ${art.numeral}` : `Article ${a}`;
    }).join(', '));
  }
  if (m.rights && m.rights.length) bits.push(m.rights.map(r => 'the right to ' + r).join(', '));
  return bits.length ? '[' + bits.join(' · ') + ']' : '';
}

/* ---- main ---- */

function main(argv) {
  const opts = parseArgs(argv);

  if (opts.help || !opts.command) { console.log(USAGE); return opts.help ? 0 : 2; }
  if (opts.unknown) { console.error(`zane: unknown option ${opts.unknown}\n`); console.error(USAGE); return 2; }
  if (opts.command !== 'check') { console.error(`zane: unknown command "${opts.command}"\n`); console.error(USAGE); return 2; }
  if (!opts.files.length) { console.error('zane: no files given\n'); console.error(USAGE); return 2; }
  if (!(opts.level >= 1 && opts.level <= 4)) { console.error('zane: --level must be 1, 2, 3 or 4'); return 2; }

  const contract = loadContract(opts.contract);
  const law = loadLaw(contract && contract.path);
  if (!contract && !opts.json) {
    console.error('zane: warning — conformance/violations.json not found; findings will not cite the law.');
    console.error('     vendor it beside the verifier, or pass --contract PATH.\n');
  }

  let symbols = null;
  if (opts.symbols) {
    try { symbols = JSON.parse(fs.readFileSync(opts.symbols, 'utf8')); }
    catch (e) { console.error(`zane: cannot read symbols file ${opts.symbols}: ${e.message}`); return 2; }
  }

  const findings = [];
  for (const file of opts.files) {
    let src;
    try { src = fs.readFileSync(file, 'utf8'); }
    catch (e) { console.error(`zane: cannot read ${file}: ${e.message}`); return 2; }

    for (const d of verify(src, { symbols })) {
      const m = meta(contract, d.id);
      if ((m.level || 1) > opts.level) continue;         /* above the claimed level */
      findings.push({ file, ...d, severity: m.severity || 'error', level: m.level || 1, meta: m });
    }
  }

  const errors = findings.filter(f => f.severity === 'error').length;
  const warnings = findings.length - errors;

  /* Machine output is the family envelope — doc/diagnostic-contract.md v1.1.
     This court conforms to that contract; it does not define it.

     THE KEY IS "diagnostics", AND IT USED TO BE "findings". v1.1 states the
     outer shape the contract had left unspecified: one object, never a
     top-level array, carrying the diagnostics under that name. Two courts had
     already chosen an object and agreed by accident; this one had chosen a
     different key for the array inside it, which is the half of the guess the
     accident did not cover. Renamed here rather than legislated around, so the
     contract's normative home is not also the exception to it.

     level, contract, files and counts are this court's own outer keys, which
     v1.1 permits and which no consumer may assume of another court. */
  if (opts.json) {
    console.log(JSON.stringify({
      level: opts.level,
      contract: contract ? { version: contract.version, constitution: contract.constitution } : null,
      files: opts.files,
      counts: { errors, warnings },
      diagnostics: findings.map(f => toEnvelope(f, f.meta, 'zane'))
    }, null, 2));
    return errors > 0 ? 1 : 0;
  }

  /* One scannable line per finding, detail indented beneath it. The citation
     gets its own line: rich enough to be useful, it would otherwise push the
     header past any sane terminal width. */
  for (const f of findings) {
    const where = f.line ? `${f.file}:${f.line}` : f.file;
    console.log(`${where}  ${f.severity}  ${f.id}  ${f.subject || ''}`.replace(/\s+$/, ''));
    if (f.meta.summary) console.log(`    ${f.meta.summary}`);
    const cite = citation(f.meta, law);
    if (cite) console.log(`    ${cite.slice(1, -1)}`);
  }

  if (!opts.quiet) {
    if (!findings.length) {
      const against = contract && contract.constitution ? ` against Zane v${contract.constitution}` : '';
      console.log(`clean — ${opts.files.length} file(s), 0 violations at level ${opts.level}${against}`);
    } else {
      console.log(`\n${errors} error(s), ${warnings} warning(s) across ${opts.files.length} file(s) at level ${opts.level}`);
    }
  }

  return errors > 0 ? 1 : 0;
}

if (require.main === module) process.exit(main(process.argv.slice(2)));
module.exports = { main, parseArgs, loadContract };
