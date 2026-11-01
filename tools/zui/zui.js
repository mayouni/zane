'use strict';
/* ==========================================================================
   zui.js — the Zui verifier core.

   Lexer, parser and checks for the Zui language, implemented against
   doc/language/ v1.0 and proved against conformance/.

   No dependencies. No I/O. Pure functions over a source string, so the same
   file runs as a Node CLI, in a browser page, or inside any build step —
   which is the product promise: deployable inside any software project.

   The diagnostic CONTRACT (severity, level, rule bindings) is NOT hardcoded
   here. It lives in conformance/violations.json and is loaded by the caller.
   This file knows how to detect; the law says what a detection means.
   ========================================================================== */

/* ---- the language, from doc/language/GRAMMAR.md ---- */

const INTENT_VERBS = new Set([
  'DISCOVER', 'UNDERSTAND', 'LOCATE',
  'FOCUS', 'FILTER', 'COMPARE',
  'READ', 'SCAN', 'SCROLL', 'ZOOM',
  'SELECT', 'HIGHLIGHT', 'PREVIEW', 'MARK',
  'ACT', 'CONFIRM', 'CANCEL', 'UNDO',
  'PAUSE', 'RESUME', 'RETRY', 'EXIT'
]);                                             /* 22, closed */

const ZUI_KINDS = new Set([
  'INTENT_FLOW', 'FORM', 'WIZARD', 'SCREEN', 'COMPONENT',
  'NAV_GRAPH', 'WORLD_VIEW', 'INTERACTION', 'FEEDBACK', 'VIBE'
]);                                             /* the ten this language defines */

/* Recognized by the reference implementation, not defined here. Reported as
   UNSPECIFIED_DECLARATION so the difference is visible, never silent. */
const UNSPECIFIED_KINDS = new Set(['WIDGET', 'USER']);

const REF_LIST_KEYS = new Set([
  'SATISFIES', 'ALWAYS_REACHABLE', 'VISIBLE_ENTITIES', 'VISIBLE_STATE',
  'INTENT_FLOWS', 'STEPS', 'REPORTS', 'SUPPRESSES', 'SIGNALS'
]);
const KV_KEYS = new Set([
  'INTENT_FLOW', 'PERSPECTIVE', 'TONE', 'SURFACE_AS', 'DENSITY', 'MOTION', 'ACTOR', 'ROLE'
]);

const PERSPECTIVES = new Set(['top_down', 'isometric', 'first_person', 'side_scroll']);
const TONES = new Set(['celebratory', 'cautionary', 'critical', 'neutral', 'informational']);

/* The SIGNAL stratum's vocabulary: Rule 118's family one, closed at five.
   NOT the same axis as TONE, and deliberately not reconciled with it -- TONE is
   the register the system SPEAKS in (the MESSAGE stratum); SIGNALS is what a
   value MEANS about a record (the SIGNAL stratum). Two strata, two vocabularies,
   and each rule points at the other so the pair cannot drift unnoticed the way
   Rules 3 and 118 did before v3.11. Published as data in conformance/signal.json. */
const SIGNALS = new Set(['success', 'warning', 'danger', 'info', 'muted']);

/* Which semantic values a medium renders as NOTHING AT ALL. Not "quietly" --
   nothing. The sound plane discovered this by building it: `muted` means waiting
   or inactive, and a sound announcing inactivity is a contradiction, so muted
   renders as silence and the voice channel enqueues nothing for it.

   Only the two channels with a shipped implementation are listed. A medium
   absent from this table raises nothing, because nobody has built the renderer
   that would tell us -- silence here means UNDECIDED, never "perceptible".
   Published in conformance/signal.json; the runner proves the two agree. */
const SIGNAL_ABSENCE = {
  auditory: ['muted'],
  voice: ['muted']
};

/* Fields that carry an expression rather than an intent. Every one of them must
   trace to an intent or it is EXPRESSION_ORPHAN -- the founding's rule, and the
   reason the expression strata are intent's refinement rather than a second
   language beside it. SIGNALS is the first; ROLE, MOTION, MESSAGE and TEMPO join
   this set as their grammars land. */
const EXPRESSION_KEYS = ['SIGNALS', 'ROLE'];

/* The ROLE stratum: what happens when the operator acts. Five values, each
   extracted from a rule that legislates CONSEQUENCE -- never from Set 13, which
   prescribes widgets and would have delivered `card | button | table`, defeating
   the WIDGET exclusion by spelling. See doc/ROLE-DESIGN.md.

     inert         informs; acting on it does nothing        Rules 119, 16
     navigate      changes what is shown, never what is true Rule 112
     reversible    changes what is true, and can be undone   Rule 79
     irreversible  changes what is true, and cannot          Rule 79
     proposal      commits nothing until an authority accepts Rule 98

   Nothing here names a widget: a reversible role may be a button, a swipe, a
   spoken command or a physical switch, and the promise is the same. */
const ROLES = new Set(['inert', 'navigate', 'reversible', 'irreversible', 'proposal']);

/* A role is per-control, and INTERACTION is the only declaration that means
   "an act bound to an object" -- a control's referent without being a widget. */
const ROLE_HOST = 'INTERACTION';

/* The medium a VIBE projects to. Closed, like the verbs and the two
   enumerations above -- a new medium is a language change, not an
   implementation choice. Published as data in conformance/media.json for
   other implementations; the shape here mirrors it deliberately, and the
   conformance runner proves the two agree. */

const MEDIA_CARRIAGE = {
  visual:   { default: 'native' },
  auditory: { default: 'native', absent: ['ZOOM'] },
  voice:    { default: 'native', absent: ['ZOOM'] },
  haptic:   { default: 'absent', keep: ['CONFIRM', 'RETRY'] },
  print:    { default: 'absent', keep: ['DISCOVER', 'UNDERSTAND', 'LOCATE', 'READ', 'SCAN', 'COMPARE'] },
  luminous: { default: 'absent', keep: ['DISCOVER', 'UNDERSTAND'] },
  signage:  { default: 'absent', keep: ['LOCATE', 'DISCOVER', 'UNDERSTAND'] },
  machine:  { default: 'native' },
  spatial:  { default: 'native' },
  terminal: { default: 'native' }
};

const MEDIA = new Set(Object.keys(MEDIA_CARRIAGE));

/* medium -> the set of verbs it cannot carry at all. Only ABSENT is a
   diagnostic; "degraded" is recorded in media.json as data for tools,
   because a warning that fired on every serial surface would be noise. */
const NOT_CARRIED = {};
for (const [m, c] of Object.entries(MEDIA_CARRIAGE)) {
  const gone = new Set();
  if (c.default === 'absent') {
    const keep = new Set(c.keep || []);
    for (const v of INTENT_VERBS) if (!keep.has(v)) gone.add(v);
  } else {
    for (const v of c.absent || []) gone.add(v);
  }
  NOT_CARRIED[m] = gone;
}

/* Declarations that are flows: multi-step reachability applies to them. */
const FLOW_KINDS = new Set(['INTENT_FLOW', 'WIZARD']);

/* ==========================================================================
   Lexer
   ========================================================================== */

const T = { IDENT: 'ident', STRING: 'string', NUMBER: 'number', PUNCT: 'punct', EOF: 'eof' };

function lex(src) {
  const tokens = [];
  const diagnostics = [];
  let i = 0, line = 1;
  const isIdentStart = c => /[A-Za-z_]/.test(c);
  const isIdentPart = c => /[A-Za-z0-9_]/.test(c);

  /* A UTF-8 BOM is a byte-order mark, not content. Editors on Windows add
     one routinely; a verifier that choked on it would be unusable there. */
  if (src.charCodeAt(0) === 0xFEFF) i = 1;

  while (i < src.length) {
    const c = src[i];

    if (c === '\n') { line++; i++; continue; }
    if (c === ' ' || c === '\t' || c === '\r') { i++; continue; }

    /* comments run to end of line; there is no block comment */
    if (c === '/' && src[i + 1] === '/') {
      while (i < src.length && src[i] !== '\n') i++;
      continue;
    }

    if ('()[],'.includes(c)) { tokens.push({ t: T.PUNCT, v: c, line }); i++; continue; }

    if (c === '"') {
      const start = i, startLine = line;
      i++;
      while (i < src.length && src[i] !== '"') { if (src[i] === '\n') line++; i++; }
      if (i >= src.length) {
        diagnostics.push({ id: 'UNTERMINATED_STRING', line: startLine, subject: null });
        break;
      }
      tokens.push({ t: T.STRING, v: src.slice(start + 1, i), line: startLine });
      i++;
      continue;
    }

    if (/[0-9]/.test(c) || (c === '-' && /[0-9]/.test(src[i + 1] || ''))) {
      const start = i;
      if (c === '-') i++;
      while (i < src.length && /[0-9.]/.test(src[i])) i++;
      tokens.push({ t: T.NUMBER, v: src.slice(start, i), line });
      continue;
    }

    if (isIdentStart(c)) {
      const start = i;
      while (i < src.length && isIdentPart(src[i])) i++;
      tokens.push({ t: T.IDENT, v: src.slice(start, i), line });
      continue;
    }

    diagnostics.push({ id: 'UNEXPECTED_CHARACTER', line, subject: c });
    i++;
  }

  tokens.push({ t: T.EOF, v: null, line });
  return { tokens, diagnostics };
}

/* ==========================================================================
   Parser

   A declaration is DEFINE <KIND> <name> ( field, … ). Fields are flat: a
   scalar value or a bracketed identifier list. There is no nesting -- nesting
   is where widget trees creep back into an intent language.
   ========================================================================== */

function parse(src) {
  const { tokens, diagnostics } = lex(src);
  const decls = [];
  let p = 0;

  const peek = (n = 0) => tokens[Math.min(p + n, tokens.length - 1)];
  const isPunct = (tok, v) => tok.t === T.PUNCT && tok.v === v;

  /* A declaration of another pillar: skip its body without judging it. A Zui
     verifier has no standing over DEFINE ENTITY or DEFINE FLOW. */
  function skipBalanced() {
    let depth = 0;
    while (peek().t !== T.EOF) {
      const tok = peek();
      if (isPunct(tok, '(')) depth++;
      else if (isPunct(tok, ')')) { depth--; p++; if (depth === 0) return; continue; }
      p++;
    }
  }

  while (peek().t !== T.EOF) {
    const tok = peek();

    if (tok.t === T.IDENT && tok.v === 'DEFINE') {
      const defLine = tok.line;
      p++;
      const kindTok = peek();
      if (kindTok.t !== T.IDENT) {
        diagnostics.push({ id: 'SYNTAX_ERROR', line: kindTok.line, subject: 'expected a declaration kind after DEFINE' });
        p++;
        continue;
      }
      const kind = kindTok.v;
      p++;

      const nameTok = peek();
      const name = nameTok.t === T.IDENT ? nameTok.v : null;
      if (name === null) {
        diagnostics.push({ id: 'SYNTAX_ERROR', line: nameTok.line, subject: `expected a name after DEFINE ${kind}` });
      } else {
        p++;
      }

      /* Not ours, and not a near-miss we owe a warning for: skip it whole. */
      if (!ZUI_KINDS.has(kind) && !UNSPECIFIED_KINDS.has(kind)) {
        if (isPunct(peek(), '(')) skipBalanced();
        continue;
      }

      const decl = { kind, name, line: defLine, fields: [], fieldIndex: new Map() };

      if (!isPunct(peek(), '(')) {
        diagnostics.push({ id: 'SYNTAX_ERROR', line: peek().line, subject: `expected ( after ${kind} ${name || ''}`.trim() });
        decls.push(decl);
        continue;
      }
      p++;                                                   /* consume ( */

      while (peek().t !== T.EOF && !isPunct(peek(), ')')) {
        const keyTok = peek();
        if (keyTok.t !== T.IDENT) {
          diagnostics.push({ id: 'SYNTAX_ERROR', line: keyTok.line, subject: 'expected a field name' });
          p++;
          continue;
        }
        const key = keyTok.v;
        p++;

        let field;
        if (isPunct(peek(), '[')) {
          p++;
          const items = [];
          while (peek().t !== T.EOF && !isPunct(peek(), ']')) {
            const itemTok = peek();
            if (itemTok.t === T.IDENT) items.push({ v: itemTok.v, line: itemTok.line });
            else if (!isPunct(itemTok, ',')) {
              diagnostics.push({ id: 'SYNTAX_ERROR', line: itemTok.line, subject: `unexpected value in ${key} list` });
            }
            p++;
          }
          if (isPunct(peek(), ']')) p++;
          field = { key, kind: 'list', items, line: keyTok.line };
          if (!REF_LIST_KEYS.has(key)) {
            diagnostics.push({ id: 'UNKNOWN_FIELD', line: keyTok.line, subject: key });
          }
        } else {
          const valTok = peek();
          let value = null;
          if (valTok.t === T.IDENT || valTok.t === T.STRING || valTok.t === T.NUMBER) {
            value = valTok.v;
            p++;
          } else {
            diagnostics.push({ id: 'SYNTAX_ERROR', line: valTok.line, subject: `expected a value for ${key}` });
          }
          field = { key, kind: 'value', value, line: keyTok.line };
          if (!KV_KEYS.has(key)) {
            diagnostics.push({ id: 'UNKNOWN_FIELD', line: keyTok.line, subject: key });
          }
        }

        decl.fields.push(field);
        if (decl.fieldIndex.has(key)) {
          diagnostics.push({ id: 'DUPLICATE_FIELD', line: keyTok.line, subject: `${key} in ${kind} ${name || ''}`.trim() });
        } else {
          decl.fieldIndex.set(key, field);
        }

        if (isPunct(peek(), ',')) p++;                       /* trailing comma is legal */
      }

      if (isPunct(peek(), ')')) p++;
      else diagnostics.push({ id: 'SYNTAX_ERROR', line: peek().line, subject: `unclosed declaration ${kind} ${name || ''}`.trim() });

      decls.push(decl);
      continue;
    }

    /* Anything outside a declaration is noise we cannot interpret. */
    diagnostics.push({ id: 'SYNTAX_ERROR', line: tok.line, subject: `unexpected ${tok.v}` });
    p++;
  }

  return { decls, diagnostics };
}

/* ==========================================================================
   Fields per kind (ruling D1, 2026-10-31)

   Which fields each kind declares, from doc/language/DECLARATIONS.md and the
   per-kind seats of haro/zui.stzu. SATISFIES, ALWAYS_REACHABLE, SIGNALS and
   ACTOR belong to every kind; the rest belong to the kinds listed.
   ========================================================================== */

const UNIVERSAL_FIELDS = new Set(['SATISFIES', 'ALWAYS_REACHABLE', 'SIGNALS', 'ACTOR']);
const KIND_FIELDS = {
  INTENT_FLOW: [],
  FORM:        ['INTENT_FLOW'],
  WIZARD:      ['STEPS'],
  SCREEN:      [],
  COMPONENT:   [],
  NAV_GRAPH:   ['VISIBLE_STATE'],
  WORLD_VIEW:  ['PERSPECTIVE', 'VISIBLE_ENTITIES'],
  INTERACTION: ['ROLE'],
  FEEDBACK:    ['TONE', 'REPORTS', 'MOTION'],
  VIBE:        ['DENSITY', 'SURFACE_AS', 'MOTION', 'REPORTS', 'SUPPRESSES']
};

/* Fields the checks below already read on ANY kind. They are declared on one
   kind and not silent on another -- STEPS makes a flow multi-step (TRAPPED_FLOW),
   INTENT_FLOW is resolved (UNRESOLVED_INTENT_FLOW), VISIBLE_STATE and
   VISIBLE_ENTITIES are collected file-wide -- so the rule behind D1, that the
   verifier speaks where its silence HIDES an error, does not reach them. The
   court (haro/zui.stzu) still refuses them; that is a named seam. */
const READ_ON_ANY_KIND = new Set(['STEPS', 'INTENT_FLOW', 'VISIBLE_STATE', 'VISIBLE_ENTITIES']);

/* Every known field a declaration carries that its kind does not declare AND
   that zui.js would otherwise ignore there.
   Pure: returns {line, kind, name, field, owned} and raises nothing. `owned`
   names the diagnostic that already speaks for the field, or null. */
function misplacedFields(decls) {
  const hits = [];
  for (const d of decls) {
    const legal = KIND_FIELDS[d.kind];
    if (!legal) continue;                                    /* WIDGET, USER: UNSPECIFIED_DECLARATION owns them */
    for (const f of d.fields) {
      const known = f.kind === 'list' ? REF_LIST_KEYS.has(f.key) : KV_KEYS.has(f.key);
      if (!known) continue;                                  /* UNKNOWN_FIELD owns it */
      if (UNIVERSAL_FIELDS.has(f.key) || legal.includes(f.key) || READ_ON_ANY_KIND.has(f.key)) continue;
      hits.push({ line: f.line, kind: d.kind, name: d.name, field: f.key, owned: f.key === 'ROLE' ? 'ROLE_MISPLACED' : null });
    }
  }
  return hits;
}

/* ==========================================================================
   Checks
   ========================================================================== */

const listOf = (decl, key) => {
  const f = decl.fieldIndex.get(key);
  return f && f.kind === 'list' ? f.items.map(x => x.v) : null;
};
const valueOf = (decl, key) => {
  const f = decl.fieldIndex.get(key);
  return f && f.kind === 'value' ? f.value : null;
};

function check(decls, symbols) {
  const out = [];
  const add = (id, line, subject) => out.push({ id, line, subject });
  const seenNames = new Set();

  /* every ALWAYS_REACHABLE promise made anywhere in the file */
  const guaranteed = new Set();
  for (const d of decls) (listOf(d, 'ALWAYS_REACHABLE') || []).forEach(v => guaranteed.add(v));

  /* every medium a VIBE in this file projects to -- collected file-wide, the
     same shape VIBE_STRIPS_RIGHT already uses for guaranteed rights */
  const declaredMedia = [];
  for (const d of decls) {
    if (d.kind !== 'VIBE') continue;
    const m = valueOf(d, 'SURFACE_AS');
    if (m !== null && MEDIA.has(m)) declaredMedia.push(m);
  }
  const declaredFlows = new Set(decls.filter(d => d.kind === 'INTENT_FLOW').map(d => d.name));

  for (const decl of decls) {
    const { kind, name, line } = decl;
    const label = name || '(unnamed)';

    /* -- Level 1 -------------------------------------------------------- */

    if (UNSPECIFIED_KINDS.has(kind)) {
      add('UNSPECIFIED_DECLARATION', line, `${kind} ${label}`);
      continue;                        /* not ours to check further */
    }

    const nameKey = `${kind} ${name}`;
    if (name !== null) {
      if (seenNames.has(nameKey)) add('DUPLICATE_DECLARATION', line, nameKey);
      else seenNames.add(nameKey);
    }

    for (const key of ['SATISFIES', 'ALWAYS_REACHABLE', 'SUPPRESSES']) {
      const f = decl.fieldIndex.get(key);
      if (!f || f.kind !== 'list') continue;
      for (const item of f.items) {
        if (!INTENT_VERBS.has(item.v)) add('UNKNOWN_INTENT', item.line, `${item.v} in ${key} of ${label}`);
      }
    }

    /* The SIGNAL vocabulary is closed the way the verbs and the media are: a
       value outside the five is a language error, not a naming preference. */
    {
      const f = decl.fieldIndex.get('SIGNALS');
      if (f && f.kind === 'list') {
        for (const item of f.items) {
          if (!SIGNALS.has(item.v)) add('UNKNOWN_SIGNAL', item.line, `${item.v} in SIGNALS of ${label}`);
        }
      }
    }

    /* -- Level 2 -------------------------------------------------------- */

    const satisfies = new Set(listOf(decl, 'SATISFIES') || []);
    const reachable = new Set(listOf(decl, 'ALWAYS_REACHABLE') || []);
    const acts = satisfies.has('ACT');

    if (kind === 'INTENT_FLOW' && !decl.fieldIndex.has('SATISFIES')) {
      add('INTENT_FLOW_NO_SATISFIES', line, label);
    }

    /* Expression is intent's refinement, never a second language beside it. A
       declaration that says how something should be PERCEIVED without saying
       what the operator is DOING has inverted the whole model. */
    for (const key of EXPRESSION_KEYS) {
      const f = decl.fieldIndex.get(key);
      if (!f) continue;
      const nonEmpty = f.kind !== 'list' || (f.items && f.items.length > 0);
      if (nonEmpty && satisfies.size === 0) {
        add('EXPRESSION_ORPHAN', f.line, `${key} on ${label} traces to no intent`);
      }
    }

    if (satisfies.has('SELECT') && acts && !satisfies.has('CONFIRM')) {
      add('SELECT_ACT_COLLAPSE', line, label);
    }
    if (satisfies.has('READ') && acts) {
      add('READ_ACT_COLLAPSE', line, label);
    }
    /* Rule 79's invariant is "every act has a reachable undo, OR DECLARES WHY IT
       CANNOT", and VIOLATIONS.md has always said a genuinely irreversible
       declaration must say so explicitly rather than stay silent. Until ROLE
       existed the language had no way to say it, so the escape clause was prose
       and the only way past this check was to promise an UNDO that could not be
       honoured. `ROLE irreversible` IS the declaration the rule asks for. */
    if (acts && !reachable.has('UNDO') && valueOf(decl, 'ROLE') !== 'irreversible') {
      add('MISSING_UNDO', line, label);
    }
    if (FLOW_KINDS.has(kind) && acts && !reachable.has('CANCEL')) {
      add('MISSING_CANCEL', line, label);
    }

    const multiStep = kind === 'WIZARD' || decl.fieldIndex.has('STEPS');
    if (multiStep && !reachable.has('EXIT')) {
      add('TRAPPED_FLOW', line, label);
    }

    /* A field on a kind that does not declare it is ignored where it sits, and
       an author who wrote TONE on a SCREEN believes the tone is honoured. ROLE
       is left to ROLE_MISPLACED, which names the one kind it belongs to. */
    for (const h of misplacedFields([decl])) {
      if (h.owned) continue;
      const homes = Object.keys(KIND_FIELDS).filter(k => KIND_FIELDS[k].includes(h.field));
      add('FIELD_MISPLACED', h.line, `${h.field} on ${kind} ${label}; ${homes.length ? 'it belongs to ' + homes.join(', ') : 'no kind declares it'}`);
    }

    if (kind === 'WORLD_VIEW') {
      const persp = valueOf(decl, 'PERSPECTIVE');
      if (persp !== null && !PERSPECTIVES.has(persp)) add('INVALID_PERSPECTIVE', line, `${persp} on ${label}`);
    }

    /* -- ROLE: the promise a control makes ------------------------------
          Each check below is a promise the declaration cannot keep. None of
          them reads a widget, and none of them fires on a declaration that
          carries no ROLE -- which is the stratum's known weakness, recorded
          in doc/ROLE-DESIGN.md rather than papered over. */
    {
      const role = valueOf(decl, 'ROLE');
      if (role !== null) {
        const roleLine = (decl.fieldIndex.get('ROLE') || { line }).line;

        if (!ROLES.has(role)) {
          add('UNKNOWN_ROLE', roleLine, `${role} on ${label}`);
        } else if (kind !== ROLE_HOST) {
          /* Silently ignoring a misplaced enum is what TONE and PERSPECTIVE do
             today, and it is a gap: a field that does nothing where it sits
             reads as a declaration that was honoured. */
          add('ROLE_MISPLACED', roleLine, `ROLE on ${kind} ${label}; a role belongs to an ${ROLE_HOST}`);
        } else {
          if ((role === 'inert' || role === 'navigate') && acts) {
            add('ROLE_ACTS_WITHOUT_CONSEQUENCE', roleLine, `${role} ${label} satisfies ACT`);
          }
          /* MISSING_UNDO already covers "satisfies ACT, keeps no UNDO" and cites
             the same rule. Firing both would report one defect twice, so this
             takes only the case MISSING_UNDO cannot see: a control that promises
             reversibility without declaring that it acts at all. */
          if (role === 'reversible' && !reachable.has('UNDO') && !acts) {
            add('ROLE_PROMISE_BROKEN', roleLine, `reversible ${label} keeps no reachable UNDO`);
          }
          if (role === 'irreversible' && (reachable.has('UNDO') || satisfies.has('UNDO'))) {
            add('IRREVERSIBLE_CLAIMS_UNDO', roleLine, `irreversible ${label} declares UNDO`);
          }
          if (role === 'proposal' && acts && valueOf(decl, 'ACTOR') === null) {
            add('PROPOSAL_COMMITS', roleLine, `proposal ${label} acts and names no ACTOR`);
          }
        }
      }
    }

    if (kind === 'FEEDBACK') {
      const tone = valueOf(decl, 'TONE');
      if (tone !== null && !TONES.has(tone)) add('INVALID_TONE', line, `${tone} on ${label}`);
      const reports = listOf(decl, 'REPORTS');
      const saysSomething = tone !== null || valueOf(decl, 'MOTION') !== null;
      if (saysSomething && (!reports || reports.length === 0)) {
        add('DECORATIVE_ANIMATION', line, label);
      }
    }

    if (kind === 'VIBE') {
      const motion = valueOf(decl, 'MOTION');
      const reports = listOf(decl, 'REPORTS');
      /* MOTION none is lawful and common; motion that moves must report */
      if (motion !== null && motion !== 'none' && (!reports || reports.length === 0)) {
        add('DECORATIVE_ANIMATION', line, label);
      }
      for (const v of listOf(decl, 'SUPPRESSES') || []) {
        if (guaranteed.has(v)) add('VIBE_STRIPS_RIGHT', line, `${v} suppressed by ${label}`);
      }
      const surface = valueOf(decl, 'SURFACE_AS');
      if (surface !== null && !MEDIA.has(surface)) {
        add('UNKNOWN_MEDIUM', line, `${surface} on ${label}`);
      }
    }

    const flowRef = valueOf(decl, 'INTENT_FLOW');
    if (flowRef !== null && !declaredFlows.has(flowRef)) {
      add('UNRESOLVED_INTENT_FLOW', line, `${flowRef} referenced by ${label}`);
    }

    /* -- Level 3: only when the symbol table supplies what the check needs.
          Absent input means UNDECIDABLE, which is silence -- never a pass. -- */

    if (symbols && Array.isArray(symbols.actors) && acts && valueOf(decl, 'ACTOR') === null) {
      add('HIDDEN_AUTHORITY', line, label);
    }

    if (symbols && Array.isArray(symbols.entities)) {
      for (const item of (decl.fieldIndex.get('VISIBLE_ENTITIES') || { items: [] }).items || []) {
        if (!symbols.entities.includes(item.v)) add('UNRESOLVED_ENTITY', item.line, `${item.v} in ${label}`);
      }
    }
  }

  /* -- Level 2, file-wide: the medium axis ------------------------------
        A VIBE names the medium this file projects to. An intent that medium
        cannot carry AT ALL is a promise the surface cannot keep -- print has
        no UNDO, a lamp has no READ. Only absence raises; "degraded" is data
        in media.json, not a diagnostic, because a warning firing on every
        serial surface would be noise rather than law. */

  for (const m of declaredMedia) {
    const gone = NOT_CARRIED[m];
    if (!gone || gone.size === 0) continue;
    for (const decl of decls) {
      const label = decl.name || '(unnamed)';
      for (const v of listOf(decl, 'SATISFIES') || []) {
        if (gone.has(v)) out.push({ id: 'VERB_NOT_CARRIED', line: decl.line, subject: `${v} in ${label} on ${m}` });
      }
    }
  }

  /* Rule 82 meeting the medium axis, and the first check that needs both.
     A surface may declare `muted` on a silent channel all it likes -- silence
     is the CORRECT rendering of "waiting, inactive". The defect is narrower:
     when EVERY value a surface declares renders as absence in the medium it
     declared, the surface has promised a perceptible status and rendered
     nothing at all. That is imperceivable state in the declared medium, which
     is exactly what Rule 82 became at v3.9.

     Stated over "every declared value renders as absence" rather than over
     `muted` by name: today only muted does it, so the two are the same test,
     but the general form survives the next channel's data without a rewrite. */

  for (const m of declaredMedia) {
    const silent = new Set(SIGNAL_ABSENCE[m] || []);
    if (silent.size === 0) continue;
    for (const decl of decls) {
      const f = decl.fieldIndex.get('SIGNALS');
      if (!f || f.kind !== 'list' || !f.items || f.items.length === 0) continue;
      const declared = f.items.map(i => i.v).filter(v => SIGNALS.has(v));
      if (declared.length === 0) continue;              /* UNKNOWN_SIGNAL owns that */
      if (declared.every(v => silent.has(v))) {
        out.push({
          id: 'SIGNAL_UNPERCEIVABLE',
          line: f.line,
          subject: `${declared.join(', ')} in ${decl.name || '(unnamed)'} on ${m}`
        });
      }
    }
  }

  /* -- Level 2, file-wide: the counter-check, and it never refuses -------
        EXPRESSION_ORPHAN catches expression declared without intent. This is
        the other direction -- intent declared without expression -- and it is
        the failure doc/ROLE-DESIGN.md section 4 predicted and could not see:
        a surface with controls and no roles raises nothing, so the stratum
        passes by silence.

        ADVISORY, NOT A REFUSAL, and that is the whole design. The five values
        have not met a real surface. Requiring a role would buy a declared role
        rather than an accurate one -- an author who finds one INTERACTION per
        control tedious declares one, gives it a role, and the surface passes
        with a role that is WRONG. Invisible under-declaration would become
        invisible mis-declaration, which is worse: it turns a silent gap into a
        green check. So this MEASURES and does not gate, and the requirement is
        decided later on two numbers read together -- how much under-declaration
        there is, and whether the roles authors did declare are accurate.

        FILE-WIDE and once: the ruling's subject is a SURFACE with declared
        interactions and zero roles, not each roleless control. Counted over
        roles on INTERACTIONs, so a ROLE sitting on the wrong kind does not
        silence it -- that is ROLE_MISPLACED's error and not a role declared.

        WHAT IT STILL CANNOT SEE, stated because the measurement will be read as
        if it could: an author who declares no INTERACTION at all. Roles per
        interaction is what this counts; interactions per control is the deeper
        under-declaration, and .zui has no control primitive to count against. */

  {
    const interactions = decls.filter(d => d.kind === ROLE_HOST);
    const roled = decls.some(d => d.kind === ROLE_HOST && d.fieldIndex.has('ROLE'));
    if (interactions.length > 0 && !roled) {
      out.push({
        id: 'ROLE_UNDECLARED',
        line: 0,
        subject: `${interactions.length} INTERACTION${interactions.length === 1 ? '' : 's'}, no ROLE`
      });
    }
  }

  /* -- Level 3, file-wide ---------------------------------------------- */

  if (symbols && Array.isArray(symbols.elements)) {
    const traced = new Set(
      decls.filter(d => (listOf(d, 'SATISFIES') || []).length > 0).map(d => d.name)
    );
    for (const el of symbols.elements) {
      if (!traced.has(el)) out.push({ id: 'INTENT_ORPHAN', line: 0, subject: el });
    }
  }

  if (symbols && Array.isArray(symbols.state)) {
    const shown = new Set();
    for (const d of decls) (listOf(d, 'VISIBLE_STATE') || []).forEach(s => shown.add(s));
    for (const s of symbols.state) {
      if (!shown.has(s)) out.push({ id: 'INVISIBLE_STATE', line: 0, subject: s });
    }
  }

  return out;
}

/* ==========================================================================
   Public surface
   ========================================================================== */

/**
 * Verify one Zui source string.
 * @param {string} source        the .zui text
 * @param {object} [opts]
 * @param {object} [opts.symbols] {entities, actors, state, elements} — Level 3
 * @returns {Array<{id, line, subject}>} diagnostics, in source order
 */
function verify(source, opts) {
  const options = opts || {};
  const { decls, diagnostics } = parse(source);
  return diagnostics.concat(check(decls, options.symbols || null));
}

const API = { verify, parse, lex, misplacedFields, KIND_FIELDS,INTENT_VERBS, ZUI_KINDS, UNSPECIFIED_KINDS, PERSPECTIVES, TONES, MEDIA, MEDIA_CARRIAGE, NOT_CARRIED, SIGNALS, SIGNAL_ABSENCE };

if (typeof module !== 'undefined' && module.exports) module.exports = API;
if (typeof window !== 'undefined') window.Zui = API;
