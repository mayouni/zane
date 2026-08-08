'use strict';
/* ==========================================================================
   envelope.js — the family Diagnostic Contract (C2), as code.

   Every diagnostic this court emits in machine form travels in the family
   envelope: {code, severity, message, span{file,line,col}, cites[], language}
   — governed by doc/diagnostic-contract.md v1.0, validated against
   doc/diagnostic-contract.schema.json. This court CONFORMS to that contract;
   it does not define it.

   The schema file is the authority. validate() interprets it rather than
   restating it, so the shape and the check cannot drift apart. No
   dependencies, same as the rest of the verifier.
   ========================================================================== */

const fs = require('fs');
const path = require('path');

const SCHEMA_PATH = path.join(__dirname, '..', '..', 'doc', 'diagnostic-contract.schema.json');

function loadShape(explicit) {
  return JSON.parse(fs.readFileSync(explicit || SCHEMA_PATH, 'utf8'));
}

/* The four binding kinds the catalog carries, flattened to kind:value cites. */
function cites(meta) {
  const out = [];
  for (const r of meta.rules || []) out.push('rule:' + r);
  for (const a of meta.articles || []) out.push('article:' + a);
  for (const r of meta.rights || []) out.push('right:' + r);
  for (const p of meta.forbidden_patterns || []) out.push('pattern:' + p);
  return out;
}

/**
 * Build the envelope for one finding.
 * @param finding  {file, id, line, subject, [severity], [level]} — from verify()
 * @param meta     the catalog entry from violations.json, or a structural stub
 * @param language the court's language id (default 'zui')
 */
function toEnvelope(finding, meta, language) {
  const m = meta || {};
  const env = {
    code: finding.id,
    severity: finding.severity || m.severity || 'error',
    message: m.summary || (finding.subject ? `${finding.id}: ${finding.subject}` : finding.id),
    span: { file: finding.file, line: finding.line || 0 },
    cites: cites(m),
    language: language || 'zui',
    /* extension fields — this court's own, permitted by the contract */
    level: finding.level || m.level || 1
  };
  if (finding.subject !== undefined) env.subject = finding.subject;
  return env;
}

/* ---- a small validator for the subset of JSON Schema the shape uses ---- */

function walk(v, s, at, out) {
  if (s.enum) {
    if (!s.enum.includes(v)) out.push(`${at}: ${JSON.stringify(v)} is not one of ${JSON.stringify(s.enum)}`);
    return;
  }
  switch (s.type) {
    case 'object':
      if (typeof v !== 'object' || v === null || Array.isArray(v)) { out.push(`${at}: expected an object`); return; }
      for (const k of s.required || []) if (!(k in v)) out.push(`${at}: missing required field "${k}"`);
      for (const [k, sub] of Object.entries(s.properties || {})) if (k in v) walk(v[k], sub, `${at}.${k}`, out);
      if (s.additionalProperties === false) {
        for (const k of Object.keys(v)) {
          if (!(s.properties && k in s.properties)) out.push(`${at}: unexpected field "${k}"`);
        }
      }
      return;
    case 'array':
      if (!Array.isArray(v)) { out.push(`${at}: expected an array`); return; }
      if (s.items) v.forEach((item, i) => walk(item, s.items, `${at}[${i}]`, out));
      return;
    case 'string':
      if (typeof v !== 'string') { out.push(`${at}: expected a string`); return; }
      if (s.minLength && v.length < s.minLength) out.push(`${at}: shorter than minLength ${s.minLength}`);
      if (s.pattern && !new RegExp(s.pattern).test(v)) out.push(`${at}: "${v}" does not match ${s.pattern}`);
      return;
    case 'integer':
      if (!Number.isInteger(v)) { out.push(`${at}: expected an integer`); return; }
      if (typeof s.minimum === 'number' && v < s.minimum) out.push(`${at}: ${v} is below minimum ${s.minimum}`);
      return;
  }
}

/** Validate one envelope against the shape. Returns an array of problems, empty when it conforms. */
function validate(envelope, shape, where) {
  const problems = [];
  walk(envelope, shape, where || 'diagnostic', problems);
  return problems;
}

module.exports = { toEnvelope, validate, loadShape, SCHEMA_PATH };
