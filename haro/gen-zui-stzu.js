// Generates haro/zui.stzu from the pack's own data:  node haro/gen-zui-stzu.js
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const R = p => path.join(ROOT, p);
const Z = require(R('tools/zui/zui.js'));
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
w('-- zui.stzu -- StzZui, declared as a Haro language');
w('--');
w('-- The first artifact of the re-declaration ruled on 2026-10-31. Written FROM the pack\'s own');
w('-- data (conformance/media.json, signal.json, violations.json, doc/language/DECLARATIONS.md)');
w('-- and judged by the stzu meta-court:');
w('--     rnxc haro.ring zui.stzu       (ringpp/haro/spike)');
w('-- The verifier (tools/zui/zui.js) is NOT changed and NOT replaced by this file. This file');
w('-- declares what the meta-language can carry; the SEAMS below count what it cannot.');
w('--');
w('-- Words are lower_snake here and UPPER in a .zui file (DISCOVER, SATISFIES): the meta-language');
w('-- reserves UPPER_SNAKE for its own keywords, and Z made the same trade ("a step is lower_snake');
w('-- here where ZQL names it UPPER"). Case is the forge\'s printer to restore, not a declaration.');
w('--');
w('-- SEAMS -- what the stzu of 2026-10-31 cannot carry, counted against violations.json (32):');
w('--   S1  severity: every refusal a court speaks is an error. Five diagnostics are warnings in');
w('--       zui.js (UNSPECIFIED_DECLARATION, INTENT_FLOW_NO_SATISFIES, UNRESOLVED_INTENT_FLOW,');
w('--       UNRESOLVED_ENTITY, ROLE_UNDECLARED) and are NOT declared here, so the court does not');
w('--       over-refuse. The exception is WIDGET and USER, see D2.');
w('--   S2  cites: CONSTRAINT carries CODE and no CITES, so a refusal cites rule:<element name>');
w('--       and not rule:16 / article:intent / pattern:select-silently-acts. REFUSAL and SYMBOL');
w('--       have CITES; CONSTRAINT, MENU, RANGE, FORMAT and UNION do not.');
w('--   S3  the world: INTENT_ORPHAN, INVISIBLE_STATE, HIDDEN_AUTHORITY check a host world in the');
w('--       direction "everything the world holds is declared", which SYMBOL (a declared name');
w('--       resolves) does not say. Level 3 is not carried.');
w('--   S4  the rendered surface: LAYOUT_DISPLACEMENT (level 4) is judged on a pixel, not a');
w('--       declaration. It stays with the tool tier of the enforcement ladder.');
w('--   S5  a universal field: SATISFIES, ALWAYS_REACHABLE, SIGNALS and ACTOR belong to every');
w('--       kind and the meta-language has no "on every declaration", so they repeat on all ten.');
w('--   S6  the media matrix: 77 cells are "absent" in media.json; two are carried below as the');
w('--       proof that a cross-declaration cell can be said (zoom on auditory and voice). The');
w('--       other 75 are sayable the same way and are the forge\'s to generate, not hand-written.');
w('--   S7  VIBE_STRIPS_RIGHT needs "a suppressed verb that ANY declaration guarantees": a join of');
w('--       the values of one list against the lists of other declarations. I found no such form in the');
w('--       condition language of 2026-10-31; that is not a proof that none can be made.');
w('--   S8  ROLE_MISPLACED: a seat that exists on one kind only is, elsewhere, an unknown clause');
w('--       and refuses as PARSE; the code and the sentence "a role belongs to an INTERACTION"');
w('--       are lost.');
w('--   S9  the multi-pillar file: zui.js ignores other pillars\' declarations silently; a');
w('--       declared language refuses what it does not know. Ruling needed (D3).');
w('--   S10 RATIONALE: the Commons (stzu GRAMMAR, C6 3.8) makes RATIONALE mandatory on every');
w('--       declaration of a language the forge makes; a .zui declaration has none. Adopting the');
w('--       court means every .zui declaration says why. That is a language change, not a');
w('--       translation, and it is the author\'s to rule (D4).');
w('--   S11 duplicates: DUPLICATE_FIELD is refused as PARSE and DUPLICATE_DECLARATION as');
w('--       DUPLICATE_NAME. Both are refused; the codes StzZui published are not the ones spoken.');
w('--   S12 first refusal: the forged court\'s diagnose speaks the first refusal it meets;');
w('--       zui.js reports every one. The collecting court exists (haro.ring all) and is not');
w('--       what a forged court does yet.');
w('--');
w('-- DIVERGENCES from zui.js that this declaration makes by being closed (each is a ruling for');
w('-- the author, not a decision taken here):');
w('--   D1  fields are declared per kind from DECLARATIONS.md. zui.js accepts any field on any');
w('--       kind and ignores a misplaced TONE or PERSPECTIVE silently; a closed declaration refuses');
w('--       it. The declaration is the stricter of the two and the prose is on its side.');
w('--   D2  WIDGET and USER are named and refused as errors; zui.js reports them as a warning.');
w('--   D3  other pillars\' kinds are refused, not ignored (S9).');
w('--   D4  every declaration gains a RATIONALE (S10).');
w('--');
w('-- MEASURED 2026-10-31 by haro/judge-zui-court.js: the 50 fixtures of conformance/manifest.json, each');
w('-- translated mechanically into the Commons shape (AS, lower_snake words, RATIONALE) and judged by');
w('-- the court forged from this file. 38 agree with the manifest (19 of them lawful twins judged');
w('-- clean). 12 differ, and each is a named seam: 4 are warnings not declared (S1), 3 need the host');
w('-- world (S3), 2 are refused under another code (S11), and one each is VIBE_STRIPS_RIGHT (S7),');
w('-- VERB_NOT_CARRIED on print x ACT (S6) and a foreign pillar refused (S9).');

w('');
w('DEFINE LANGUAGE zui AS (');
w(`  VERSION ${q('1.3')}, GRAMMAR ${q('1.3')},`);
w(`  COURT ${q('conformance/manifest.json')},`);
w(`  EXTENSION ${q('.zui')}`);
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
  ['entity', 'name', 'One entity a world view shows; the host world resolves it, and in zui.js an unresolved one is a warning (S1, S3)']
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
w('-- CODE is the C2 stable identifier; a cite is not declarable here (S2).');
w('');
const sum = {};
for (const d of contract.diagnostics) sum[d.id] = d.summary;
let nCons = 0;
const cons = (name, on, when, code, msg, why) => {
  w(`DEFINE CONSTRAINT ${name} AS (`);
  w(`  ON ${on}, WHEN ${q(when)},`);
  w(`  MESSAGE ${q(msg)},`);
  w(`  CODE ${q(code)}`);
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
w('-- ---- the medium axis: two cells of the matrix, as proof (S6) ----------------------------');
w('');
const anyKind = cond => KINDS.filter(k => k !== 'form' || true).map(k => `(some ${k} where ${cond})`).join(' or ');
cons('verb_not_carried_zoom', 'vibe', `(surface_as = auditory or surface_as = voice) and (${anyKind('satisfies contains zoom')})`,
  'VERB_NOT_CARRIED', '{name} projects to a medium that has no ZOOM, and a declaration of this file promises it', 'Rule 82; media.json absent');
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
w('  MESSAGE "The Zui declaration is DEFINE <KIND> <name> ( ... ); nothing else opens a declaration."');
w(') RATIONALE "A verb outside the grammar is not forbidden, it is unparseable"');
w('');
w('DEFINE REFUSAL unknown_declaration AS (');
w('  MESSAGE "The ten kinds are INTENT_FLOW, FORM, WIZARD, SCREEN, COMPONENT, NAV_GRAPH, WORLD_VIEW, INTERACTION, FEEDBACK and VIBE.",');
w('  NAMED [widget: "WIDGET names a rendering, and a declaration that needs to say card has stopped describing intent", user: "USER is not a kind this language defines"],');
w('  CODES [widget: "UNSPECIFIED_DECLARATION", user: "UNSPECIFIED_DECLARATION"]');
w(') RATIONALE "Two kinds the reference implementation recognises and the language does not define (D2). Warnings in zui.js; errors here"');
w('');
CARRIED.add('UNSPECIFIED_DECLARATION');

fs.writeFileSync(R('haro/zui.stzu'), out.join('\n') + '\n');
const all = contract.diagnostics.map(d => d.id);
console.log('constraints', nCons, 'lines', out.length);
console.log('diagnostics', all.length, 'carried-by-declaration', all.filter(x => CARRIED.has(x)).length);
console.log('not carried:', all.filter(x => !CARRIED.has(x)).join(' '));
