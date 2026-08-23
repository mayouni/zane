'use strict';
/* ==========================================================================
   envelope.js — the family Diagnostic Contract (C2), as code.

   Every diagnostic this court emits in machine form travels in the family
   envelope: {code, severity, message, span{file,line,col}, cites[], language}
   — governed by doc/diagnostic-contract.md v1.1, validated against
   doc/diagnostic-contract.schema.json. This court CONFORMS to that contract;
   it does not define it.

   The schema file is the authority. validate() interprets it rather than
   restating it, so the shape and the check cannot drift apart. No
   dependencies, same as the rest of the verifier.

   v1.2.0 added ONE CONSTRAINT ON EXTENSION FIELDS: a court's own added
   field may be anything except a bare boolean or null, because Ring's
   jsonlib returns those three as STRINGS on a round trip and raises
   nothing. The schema states it one level deep, which is as far as the
   keyword reaches; scalarsThatDoNotSurvive() below enforces it at FULL
   depth, which is as far as the defect reaches. Two mechanisms because
   neither one alone covers the rule.

   v1.1 added the OUTER shape -- what carries a run's diagnostics. One object
   under the key "diagnostics", never a top-level array, because the family's
   JSON reader returns a one-element list for a bare array and fails quietly.
   It lives in the schema's definitions.report, so the pair of files the
   contract versions stays a pair.
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

function walk(v, s, at, out, root) {
  /* "$ref": "#" is the only reference the shape uses: definitions.report
     pointing back at the diagnostic itself. Resolved rather than restated, so
     the report check and the diagnostic check cannot disagree. */
  if (s.$ref === '#' && root) { walk(v, root, at, out, root); return; }
  /* "not" with a bare type list is the only negation the shape uses: v1.2.0's
     forbidding of boolean and null extension values. Interpreted rather than
     restated, same rule as everything else here. */
  if (s.not && s.not.type) {
    if (isOfType(v, s.not.type)) {
      out.push(`${at}: ${JSON.stringify(v)} is ${[].concat(s.not.type).join(' or ')}, which the contract forbids here -- ` +
               `the family's JSON encoder returns true, false and null as strings on a round trip`);
    }
    return;
  }
  if (s.enum) {
    if (!s.enum.includes(v)) out.push(`${at}: ${JSON.stringify(v)} is not one of ${JSON.stringify(s.enum)}`);
    return;
  }
  switch (s.type) {
    case 'object':
      if (typeof v !== 'object' || v === null || Array.isArray(v)) { out.push(`${at}: expected an object`); return; }
      for (const k of s.required || []) if (!(k in v)) out.push(`${at}: missing required field "${k}"`);
      for (const [k, sub] of Object.entries(s.properties || {})) if (k in v) walk(v[k], sub, `${at}.${k}`, out, root);
      if (s.additionalProperties === false) {
        for (const k of Object.keys(v)) {
          if (!(s.properties && k in s.properties)) out.push(`${at}: unexpected field "${k}"`);
        }
      } else if (s.additionalProperties && typeof s.additionalProperties === 'object') {
        /* v1.2.0: extras are permitted AND constrained. Every property the
           shape does not name is checked against that subschema. */
        for (const k of Object.keys(v)) {
          if (!(s.properties && k in s.properties)) walk(v[k], s.additionalProperties, `${at}.${k}`, out, root);
        }
      }
      return;
    case 'array':
      if (!Array.isArray(v)) { out.push(`${at}: expected an array`); return; }
      if (s.items) v.forEach((item, i) => walk(item, s.items, `${at}[${i}]`, out, root));
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

/* JSON's own type names, which are not JavaScript's: null is a type, an array
   is not an object, and an integer is a number that happens to be whole. */
function jsonTypeOf(v) {
  if (v === null) return 'null';
  if (Array.isArray(v)) return 'array';
  if (typeof v === 'number') return Number.isInteger(v) ? 'integer' : 'number';
  return typeof v;
}

function isOfType(v, type) {
  const want = [].concat(type), got = jsonTypeOf(v);
  return want.some(t => t === got || (t === 'number' && got === 'integer'));
}

/**
 * CENTRAL-JSONSCALAR-01, enforced at full depth. Ring's jsonlib round-trips
 * true, false and null into the strings "true", "false" and "null" -- in every
 * position, nested or not, with no error raised. Numbers survive. So a court
 * that emits one has emitted a document that will silently become a different
 * document, and the consumer testing it is wrong without knowing.
 *
 * The schema forbids it one level deep, which is all "additionalProperties"
 * reaches. This reaches everywhere, because the defect does.
 */
function scalarsThatDoNotSurvive(value, at, out) {
  out = out || [];
  at = at || 'document';
  if (value === null || typeof value === 'boolean') {
    out.push(`${at}: ${JSON.stringify(value)} does not survive a round trip through the family's ` +
             `JSON encoder -- it returns as the string "${String(value)}". Contract v1.2.0 §2.8`);
  } else if (Array.isArray(value)) {
    value.forEach((item, i) => scalarsThatDoNotSurvive(item, `${at}[${i}]`, out));
  } else if (value && typeof value === 'object') {
    for (const [k, sub] of Object.entries(value)) scalarsThatDoNotSurvive(sub, `${at}.${k}`, out);
  }
  return out;
}

/** Validate one envelope against the shape. Returns an array of problems, empty when it conforms. */
function validate(envelope, shape, where) {
  const problems = [];
  walk(envelope, shape, where || 'diagnostic', problems, shape);
  scalarsThatDoNotSurvive(envelope, where || 'diagnostic', problems);
  return problems;
}

/**
 * Validate a whole machine-form report -- the object that CARRIES the
 * diagnostics -- against definitions.report. A shape without that definition
 * is a pre-v1.1 contract, and the report shape is then unspecified rather than
 * satisfied: say so instead of passing.
 */
function validateReport(report, shape, where) {
  const def = shape.definitions && shape.definitions.report;
  if (!def) return ['report shape: the pinned contract predates v1.1 and specifies no outer shape'];
  const problems = [];
  walk(report, def, where || 'report', problems, shape);
  /* Scans the diagnostics too, so a caller running both checks on one failing
     run can see the same scalar named twice. Duplicated on failure is the
     right side to err on; a scan that stopped at the carrier would miss the
     nesting the schema keyword already misses. */
  scalarsThatDoNotSurvive(report, where || 'report', problems);
  return problems;
}

module.exports = { toEnvelope, validate, validateReport, loadShape, scalarsThatDoNotSurvive, SCHEMA_PATH };
