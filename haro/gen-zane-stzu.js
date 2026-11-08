// Generates haro/zane.stzu from the pack's own data:  node haro/gen-zane-stzu.js
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const R = p => path.join(ROOT, p);
const Z = require(R('tools/zane/zane.js'));
const media = require(R('conformance/media.json'));
const sig = require(R('conformance/signal.json'));
const man = require(R('conformance/manifest.json'));
const spec = fs.readFileSync(R('doc/language/README.md'), 'utf8');
const contract = require(R('conformance/violations.json'));
const rules = require(R('constitution/rules.json'));

const lower = (a) => [...a].map(s => s.toLowerCase());
const verbs = lower(Z.INTENT_VERBS);
const mediaIds = media.media.map(m => m.id);
const signals = lower(Z.SIGNALS);
const roles = ['inert', 'navigate', 'reversible', 'irreversible', 'proposal'];
const tones = lower(Z.TONES);
const persp = lower(Z.PERSPECTIVES);

const KINDS = ['intent_flow', 'form', 'wizard', 'screen', 'component', 'nav_graph', 'world_view', 'interaction', 'feedback', 'vibe'];
const VERB = k => k.toUpperCase();
const extra = {
  intent_flow: [],
  form: ['intent_flow: name?'],
  wizard: ['steps: [step]?'],
  screen: [],
  component: [],
  nav_graph: ['visible_state: [state]?'],
  world_view: ['perspective: perspectives?', 'visible_entities: [entity]?'],
  interaction: ['role: roles?'],
  feedback: ['tone: tones?', 'reports: [report]?', 'motion: name?'],
  vibe: ['density: name?', 'surface_as: media?', 'motion: name?', 'reports: [report]?', 'suppresses: [intents]?']
};
const common = ['satisfies: [intents]?', 'always_reachable: [intents]?', 'signals: [signals]?', 'actor: name?'];

const out = [];
const w = (s = '') => out.push(s);
const q = s => '"' + s + '"';
const rule = (n, ti) => ({ name: n, ti });

// ------------------------------------------------------------------ header
const specVer = (spec.match(/v(\d+\.\d+(?:\.\d+)?)/) || [])[1] || '1.3';
const lawVer = rules.metadata ? (rules.metadata.version || rules.metadata.law_version) : rules.version;
w('-- zane.stzu -- StzZui, declared as a Haro language');
w('--');
w('-- The first artifact of the re-declaration ruled on 2026-10-31. Written FROM the pack\'s own');
w('-- data (conformance/media.json, signal.json, violations.json, doc/language/DECLARATIONS.md)');
w('-- and judged by the stzu meta-court:');
w('--     rnxc haro.ring zane.stzu       (ringpp/haro/spike)');
w('-- The verifier (tools/zane/zane.js) is NOT changed and NOT replaced by this file. This file');
w('-- declares what the meta-language can carry; the SEAMS below count what it cannot.');
w('--');
w('-- Words are lower_snake here and UPPER in a .zane file (DISCOVER, SATISFIES): the meta-language');
w('-- reserves UPPER_SNAKE for its own keywords, and Z made the same trade ("a step is lower_snake');
w('-- here where ZQL names it UPPER"). Case is the forge\'s printer to restore, not a declaration.');
w('--');
w('-- SEAMS -- what the stzu of 2026-10-31 cannot carry, counted against violations.json (37):');
w('--   S1  severity: every refusal a court speaks is an error. Five diagnostics are warnings in');
w('--       zane.js (UNSPECIFIED_DECLARATION, INTENT_FLOW_NO_SATISFIES, UNRESOLVED_INTENT_FLOW,');
w('--       UNRESOLVED_ENTITY, ROLE_UNDECLARED) and are NOT declared here, so the court does not');
w('--       over-refuse. The exception is WIDGET and USER, see D2.');
w('--   S2  cites: CLOSED for constraints at Haro v0.23 (ringpp 6611d18), 2026-11-02. Each constraint, and the');
w('--       unknown_declaration refusal, carries CITES written from its diagnostic in violations.json');
w('--       (rule:16, article:intent, pattern:select-silently-acts), and the envelope cites them. STILL OPEN');
w('--       for the six MENUs (UNKNOWN_INTENT, UNKNOWN_MEDIUM, UNKNOWN_SIGNAL, UNKNOWN_ROLE, INVALID_TONE,');
w('--       INVALID_PERSPECTIVE): a MENU has no CITES, so it cites the default rule:<CODE>, a rule that does');
w('--       not exist. RANGE, FORMAT and UNION have none either.');
w('--   S3  the world: INTENT_ORPHAN, INVISIBLE_STATE, HIDDEN_AUTHORITY check a host world in the');
w('--       direction "everything the world holds is declared", which SYMBOL (a declared name');
w('--       resolves) does not say. Level 3 is not carried.');
w('--   S4  the rendered surface: LAYOUT_DISPLACEMENT (level 4) is judged on a pixel, not a');
w('--       declaration. It stays with the tool tier of the enforcement ladder.');
w('--   S5  a universal field: SATISFIES, ALWAYS_REACHABLE, SIGNALS and ACTOR belong to every');
w('--       kind and the meta-language has no "on every declaration", so they repeat on all ten.');
w('--   S6  CLOSED 2026-11-01: the media matrix has 77 "absent" cells in media.json and the generator');
w('--       emits one VERB_NOT_CARRIED constraint for each, derived from the data the way zane.js derives it.');
w('--   S7  VIBE_STRIPS_RIGHT needs "a suppressed verb that ANY declaration guarantees": a join of');
w('--       the values of one list against the lists of other declarations. I found no such form in the');
w('--       condition language of 2026-10-31; that is not a proof that none can be made.');
w('--   S8  ROLE_MISPLACED: a seat that exists on one kind only is, elsewhere, an unknown clause');
w('--       and refuses as PARSE; the code and the sentence "a role belongs to an INTERACTION"');
w('--       are lost.');
w('--   S9  the multi-pillar file: zane.js ignores other pillars\' declarations silently; a');
w('--       declared language refuses what it does not know. Ruling needed (D3).');
w('--   S10 RATIONALE: the Commons (stzu GRAMMAR, C6 3.8) makes RATIONALE mandatory on every');
w('--       declaration of a language the forge makes; a .zane declaration has none. Adopting the');
w('--       court means every .zane declaration says why. That is a language change, not a');
w('--       translation. RULED 2026-10-31: .zane 1.3 gains no mandatory RATIONALE (D4); at the');
w('--       boundary a declaration with none reaches the court as "none given".');
w('--   S11 codes: DUPLICATE_FIELD is refused as PARSE, DUPLICATE_DECLARATION as DUPLICATE_NAME and');
w('--       FIELD_MISPLACED and UNKNOWN_FIELD as UNKNOWN_CLAUSE and UNEXPECTED_CHARACTER as PARSE. All are refused; the codes StzZui published are not');
w('--       the ones spoken. Recorded in haro/twin-expected.csv as class other-code (same refusal, another');
w('--       code), not fixed by renaming the court\'s codes.');
w('--   S12 first refusal: the forged court\'s diagnose speaks the first refusal it meets;');
w('--       zane.js reports every one. The collecting court exists (haro.ring all) and is not');
w('--       what a forged court does yet.');
w('--   S13 reads-anywhere fields: zane.js reads STEPS, INTENT_FLOW, VISIBLE_STATE and VISIBLE_ENTITIES on');
w('--       any kind, so off their own kind it is not silent and FIELD_MISPLACED does not judge them');
w('--       (D1, narrowed by ruling 2026-11-01). The court refuses them there as UNKNOWN_CLAUSE.');
w('--   S14 guarantees read against the medium: zane.js (PG-2, 2026-11-02) raises VERB_NOT_CARRIED for a verb in');
w('--       ALWAYS_REACHABLE as well as in SATISFIES. The 77 medium constraints read SATISFIES only, so the');
w('--       court is silent on projection-print-promise.zane. Listed in twin-expected.csv, not yet generated.');
w('--   S15 the menu (language 1.6, 2026-11-08): LABEL, TARGET and ENTRIES on NAV_GRAPH, and the three menu checks');
w('--       (MENU_LABEL_REPEATS_PARENT, MENU_LANDING_NOT_FIRST, MENU_LABEL_DUPLICATE), are not declared here: the seats');
w('--       are missing, and each check reads one declaration against the declarations its ENTRIES name, a join S7');
w('--       found no form for. The court is expected to refuse the three fields as UNKNOWN_CLAUSE; the four rows in');
w('--       twin-expected.csv are that expectation, written without running the judge.');
w('--');
w('-- DIVERGENCES from zane.js that this declaration makes by being closed (each is a ruling for');
w('-- the author, not a decision taken here):');
w('--   D1  CLOSED at language v1.4 (2026-11-01). Fields are declared per kind from DECLARATIONS.md;');
w('--       zane.js used to accept any field on any kind and ignore a misplaced TONE or PERSPECTIVE');
w('--       silently. It now refuses it as FIELD_MISPLACED (ROLE stays ROLE_MISPLACED), so court and');
w('--       verifier agree on which placements are refused; only the code spoken differs (S11).');
w('--   D2  WIDGET and USER are named and refused as errors; zane.js reports them as a warning.');
w('--       RULED 2026-10-31: the verifier keeps its warning, until Haro has a severity seat.');
w('--   D3  other pillars\' kinds are refused, not ignored (S9). RULED 2026-10-31: the verifier ignores.');
w('--   D4  every declaration gains a RATIONALE (S10). RULED 2026-10-31: .zane 1.3 is unchanged and the');
w('--       translator writes "none given"; RATIONALE stays mandatory in the agent\'s grammar.');
w('--');
w('-- MEASURED 2026-11-01 by haro/judge-zane-court.js: the 57 fixtures of conformance/manifest.json, each');
w('-- translated mechanically into the Commons shape (AS, lower_snake words, RATIONALE "none given") and');
w('-- judged by the court forged from this file. 41 agree with the manifest (20 of them lawful twins');
w('-- judged clean). 16 differ, and each is a named seam, one row each in haro/twin-expected.csv, which');
w('-- the judge enforces as a ratchet: 4 are warnings not declared (S1), 3 need the host world (S3), 5 are');
w('-- refused under another code (S11), ROLE_MISPLACED is refused as UNKNOWN_CLAUSE (S8), and one each is');
w('-- VIBE_STRIPS_RIGHT (S7), a foreign pillar refused (S9), and the fixture that pins the S13 exemption.');

w('');
w('DEFINE LANGUAGE zane AS (');
w(`  VERSION ${q('1.4')}, GRAMMAR ${q('1.4')},`);
w(`  COURT ${q('conformance/manifest.json')},`);
w(`  EXTENSION ${q('.zane')}`);
w(') RATIONALE "What a human is DOING, declared before anything is rendered: ten declaration kinds over twenty-two intent verbs, judged by a constitution -- the surface is a consequence and is never named"');
w('');

// ------------------------------------------------------------------ menus
w('-- ---- the closed vocabularies -----------------------------------------------------------');
w('');
const menu = (name, words, msg, code, why) => {
  w(`DEFINE MENU ${name} AS (`);
  w(`  WORDS [${words.join(', ')}],`);
  w(`  MESSAGE ${q(msg)},`);
  w(`  CODE ${q(code)}`);
  w(`) RATIONALE ${q(why)}`);
  w('');
};
menu('intents', verbs, 'An intent is one of the twenty-two verbs: ' + [...Z.INTENT_VERBS].join(', ') + ' -- the verb set is closed, and NAVIGATE is LOCATE or DISCOVER', 'UNKNOWN_INTENT',
  'Six families: orienting (discover understand locate), attention (focus filter compare), information (read scan scroll zoom), selection (select highlight preview mark), action (act confirm cancel undo), continuity (pause resume retry exit). The families carry the invariants; a menu has no seat for a family');
menu('media', mediaIds, 'A surface is projected to one of ten media: ' + mediaIds.join(', ') + ' -- a kiosk is a visual surface that happens to be unelected, which is a property and not a channel', 'UNKNOWN_MEDIUM',
  'Closed so that a coverage matrix over media is finite and checkable; a new channel is classified by its six properties, not argued about');
menu('signals', signals, 'A signal is what a value means about a record: ' + signals.join(', ') + ' -- a meaning, never a colour', 'UNKNOWN_SIGNAL',
  'Rule 118 family one; TONE is a different vocabulary and each refuses the other\'s words');
menu('roles', roles, 'A role is the promise a control makes: ' + roles.join(', '), 'UNKNOWN_ROLE',
  'The consequence of acting, in five values; irreversible is Rule 79\'s escape clause, or declares why it cannot');
menu('tones', tones, 'A tone is the register the system speaks in: ' + tones.join(', '), 'INVALID_TONE',
  'The MESSAGE stratum; deliberately a separate vocabulary from signals');
menu('perspectives', persp, 'A perspective is ' + persp.join(', ') + ' -- the vantage of a spatial surface', 'INVALID_PERSPECTIVE',
  'WORLD_VIEW only');

// ------------------------------------------------------------------ forms and symbols
w('-- ---- the forms and the world -----------------------------------------------------------');
w('');
for (const [n, t, d] of [
  ['step', 'name', 'One named step of a wizard'],
  ['state', 'name', 'One piece of state a navigation shows'],
  ['report', 'name', 'One piece of state a feedback or a moving vibe reports'],
  ['entity', 'name', 'One entity a world view shows; the host world resolves it, and in zane.js an unresolved one is a warning (S1, S3)']
]) {
  w(`DEFINE FORM ${n} AS (`);
  w(`  SEATS [value: ${t}]`);
  w(`) RATIONALE ${q(d + '; a list of names is a list of this form written as bare words')}`);
  w('');
}
w('');

// ------------------------------------------------------------------ declarations
w('-- ---- the ten kinds ---------------------------------------------------------------------');
w('');
const kindWhy = {
  intent_flow: 'The unit of intent: a named sequence of intents a human moves through; the one kind meant to carry SATISFIES',
  form: 'An input surface, bound to a flow rather than restating it',
  wizard: 'A multi-step flow; because it is multi-step, EXIT is always reachable or it is a trap',
  screen: 'An addressable surface; SATISFIES says why the human came',
  component: 'A reusable semantic unit; a component declares meaning, never appearance',
  nav_graph: 'How surfaces connect',
  world_view: 'A spatial surface: a dashboard or a game world seen from a stated vantage',
  interaction: 'An act bound to an object, and the host of ROLE because it is the only kind meaning a control\'s referent without naming a widget',
  feedback: 'What the system says back; feedback that reports nothing is decoration',
  vibe: 'An interaction culture: Article VI made declarable. It may set density, motion and surface and may never remove an intent another declaration guarantees'
};
for (const k of KINDS) {
  const seats = [...common, ...extra[k]];
  w(`DEFINE DECLARATION ${k} AS (`);
  w(`  VERB ${q(VERB(k))},`);
  w(`  SEATS [${seats.join(', ')}]`);
  w(`) RATIONALE ${q(kindWhy[k])}`);
  w('');
}

// ------------------------------------------------------------------ constraints
w('-- ---- the court: level 2, local semantics ------------------------------------------------');
w('-- Each constraint states the OFFENCE as its WHEN and speaks the diagnostic id as its CODE.');
w('-- CODE is the C2 stable identifier; CITES is what the diagnostic enforces, from violations.json (S2).');
w('');
const sum = {};
for (const d of contract.diagnostics) sum[d.id] = d.summary;
// What a diagnostic cites, from its binding in violations.json (S2, closed at Haro v0.23): the rules, the
// articles, the rights and the forbidden patterns it enforces, as kind:value strings.
const citesOf = {};
for (const d of contract.diagnostics) citesOf[d.id] = [
  ...(d.rules || []).map(x => 'rule:' + x),
  ...(d.articles || []).map(x => 'article:' + x),
  ...(d.rights || []).map(x => 'right:' + x),
  ...(d.forbidden_patterns || []).map(x => 'pattern:' + x)
];
let nCons = 0, nCited = 0;
const cons = (name, on, when, code, msg, why) => {
  w(`DEFINE CONSTRAINT ${name} AS (`);
  w(`  ON ${on}, WHEN ${q(when)},`);
  w(`  MESSAGE ${q(msg)},`);
  const cites = citesOf[code] || [];
  if (cites.length) { w(`  CODE ${q(code)},`); w(`  CITES [${cites.map(q).join(', ')}]`); nCited++; }
  else w(`  CODE ${q(code)}`);
  w(`) RATIONALE ${q(why)}`);
  w('');
  nCons++;
};
const CARRIED = new Set(['UNKNOWN_INTENT', 'UNKNOWN_MEDIUM', 'UNKNOWN_SIGNAL', 'UNKNOWN_ROLE', 'INVALID_TONE', 'INVALID_PERSPECTIVE']);

for (const k of KINDS) {
  cons(`select_act_collapse_${k}`, k, 'satisfies contains select and satisfies contains act and not satisfies contains confirm',
    'SELECT_ACT_COLLAPSE', '{name} selects and acts and never confirms: selection expresses interest, never commitment', 'Rule 16; level 2');
  CARRIED.add('SELECT_ACT_COLLAPSE');
}
for (const k of KINDS) {
  cons(`read_act_collapse_${k}`, k, 'satisfies contains read and satisfies contains act',
    'READ_ACT_COLLAPSE', '{name} reads and acts: a read surface that silently acts is an intent violation', 'Rule 16; level 2');
  CARRIED.add('READ_ACT_COLLAPSE');
}
for (const k of KINDS) {
  const when = k === 'interaction'
    ? 'satisfies contains act and not always_reachable contains undo and not role = irreversible'
    : 'satisfies contains act and not always_reachable contains undo';
  cons(`missing_undo_${k}`, k, when,
    'MISSING_UNDO', '{name} acts and keeps no reachable UNDO: every act has one, or declares why it cannot', 'Rule 79; level 2');
  CARRIED.add('MISSING_UNDO');
}
for (const k of ['intent_flow', 'wizard']) {
  cons(`missing_cancel_${k}`, k, 'satisfies contains act and not always_reachable contains cancel',
    'MISSING_CANCEL', '{name} acts and keeps no reachable CANCEL', 'Rule 26; level 2');
  CARRIED.add('MISSING_CANCEL');
}
cons('trapped_flow_wizard', 'wizard', 'not always_reachable contains exit',
  'TRAPPED_FLOW', '{name} is multi-step and EXIT is not always reachable: a trapped flow is unconstitutional', 'Rules 51, 53; level 2');
CARRIED.add('TRAPPED_FLOW');
for (const k of KINDS) {
  const when = k === 'interaction'
    ? '(signals nonempty or role present) and (satisfies absent or satisfies empty)'
    : 'signals nonempty and (satisfies absent or satisfies empty)';
  cons(`expression_orphan_${k}`, k, when,
    'EXPRESSION_ORPHAN', '{name} says how a value is perceived without saying what the operator is doing: expression is intent\'s refinement, never a second language', 'Article intent; level 2');
  CARRIED.add('EXPRESSION_ORPHAN');
}
cons('role_acts_without_consequence', 'interaction', '(role = inert or role = navigate) and satisfies contains act',
  'ROLE_ACTS_WITHOUT_CONSEQUENCE', '{name} declares a role that has no consequence and satisfies ACT', 'Rules 119, 112, 16');
cons('role_promise_broken', 'interaction', 'role = reversible and not always_reachable contains undo and not satisfies contains act',
  'ROLE_PROMISE_BROKEN', '{name} promises to be reversible and keeps no reachable UNDO', 'Rule 79');
cons('irreversible_claims_undo', 'interaction', 'role = irreversible and (always_reachable contains undo or satisfies contains undo)',
  'IRREVERSIBLE_CLAIMS_UNDO', '{name} declares itself irreversible and declares an UNDO: it cannot be both', 'Rule 79');
cons('proposal_commits', 'interaction', 'role = proposal and satisfies contains act and actor absent',
  'PROPOSAL_COMMITS', '{name} proposes and acts and names no ACTOR', 'Rules 98, 83');
['ROLE_ACTS_WITHOUT_CONSEQUENCE', 'ROLE_PROMISE_BROKEN', 'IRREVERSIBLE_CLAIMS_UNDO', 'PROPOSAL_COMMITS'].forEach(c => CARRIED.add(c));

cons('decorative_animation_feedback', 'feedback', '(tone present or motion present) and (reports absent or reports empty)',
  'DECORATIVE_ANIMATION', '{name} speaks or moves and reports nothing: feedback that reports nothing is decoration', 'Rule 112');
cons('decorative_animation_vibe', 'vibe', 'motion present and motion != none and (reports absent or reports empty)',
  'DECORATIVE_ANIMATION', '{name} moves and reports nothing: motion that moves must report', 'Rule 112');
CARRIED.add('DECORATIVE_ANIMATION');

// ---- the media axis: the proof cells
w('-- ---- the medium axis: every absent cell of the matrix (S6) ------------------------------');
w('-- One constraint per (medium, verb) cell that media.json marks absent, derived the way');
w('-- zane.js derives NOT_CARRIED: a medium whose default is "absent" keeps only its native and');
w('-- degraded verbs; any other medium loses its listed "absent" verbs.');
w('');
const anyKind = cond => KINDS.map(k => `(some ${k} where ${cond})`).join(' or ');
const absentCells = [];
for (const m of media.media) {
  const c = m.carries;
  const keep = new Set([...(c.native || []), ...(c.degraded || [])]);
  const gone = c.default === 'absent' ? [...Z.INTENT_VERBS].filter(v => !keep.has(v)) : (c.absent || []);
  for (const v of gone) absentCells.push([m.id, v.toLowerCase()]);
}
for (const [m, v] of absentCells) {
  cons(`verb_not_carried_${m}_${v}`, 'vibe', `surface_as = ${m} and (${anyKind(`satisfies contains ${v}`)})`,
    'VERB_NOT_CARRIED', `{name} projects to ${m}, a medium that has no ${v.toUpperCase()}, and a declaration of this file promises it`, 'Rule 82; media.json absent');
}
CARRIED.add('VERB_NOT_CARRIED');
for (const k of KINDS) {
  cons(`signal_unperceivable_${k}`, k,
    'signals contains muted and not signals contains success and not signals contains warning and not signals contains danger and not signals contains info and ' +
    '((some vibe where surface_as = auditory) or (some vibe where surface_as = voice))',
    'SIGNAL_UNPERCEIVABLE', '{name} carries only the muted signal on a medium where muted is silence', 'Rule 82; signal.json absence');
  CARRIED.add('SIGNAL_UNPERCEIVABLE');
}

// ------------------------------------------------------------------ refusals
w('-- ---- the refusals ----------------------------------------------------------------------');
w('');
w('DEFINE REFUSAL unknown_verb AS (');
w('  MESSAGE "The Zane declaration is DEFINE <KIND> <name> ( ... ); nothing else opens a declaration."');
w(') RATIONALE "A verb outside the grammar is not forbidden, it is unparseable"');
w('');
w('DEFINE REFUSAL unknown_declaration AS (');
w('  MESSAGE "The ten kinds are INTENT_FLOW, FORM, WIZARD, SCREEN, COMPONENT, NAV_GRAPH, WORLD_VIEW, INTERACTION, FEEDBACK and VIBE.",');
w('  NAMED [widget: "WIDGET names a rendering, and a declaration that needs to say card has stopped describing intent", user: "USER is not a kind this language defines"],');
w('  CODES [widget: "UNSPECIFIED_DECLARATION", user: "UNSPECIFIED_DECLARATION"],');
w(`  CITES [${citesOf.UNSPECIFIED_DECLARATION.map(q).join(', ')}]`);
w(') RATIONALE "Two kinds the reference implementation recognises and the language does not define (D2). Warnings in zane.js; errors here"');
w('');
CARRIED.add('UNSPECIFIED_DECLARATION');

fs.writeFileSync(R('haro/zane.stzu'), out.join('\n') + '\n');
const all = contract.diagnostics.map(d => d.id);
console.log('constraints', nCons, 'with CITES', nCited, 'lines', out.length);
console.log('diagnostics', all.length, 'carried-by-declaration', all.filter(x => CARRIED.has(x)).length);
console.log('not carried:', all.filter(x => !CARRIED.has(x)).join(' '));
