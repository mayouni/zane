# Diagnostics and the Law They Enforce

**Normative.** Part of [the Zui Language Specification v1.4](README.md). The
machine-readable form of this document is
[`conformance/violations.json`](../../conformance/violations.json) — that file is
the contract; this one explains it.

---

## 1. Why a verifier cites rule numbers

A diagnostic that says *"this is bad practice"* is an opinion, and opinions get
negotiated in the hallway. A diagnostic that says
**`MISSING_UNDO` — Rule 79, The Undo Covenant, Article IV** is a finding against a
law the project pinned, and it can only be answered by fixing the declaration or
amending the constitution with evidence.

That is the difference between a linter and an instrument of law, and it is why
a diagnostic that enforces a rule carries a binding. Bindings cite
`constitution/rules.json` **v3.12**.

Not every diagnostic enforces a rule. Of the 37, 17 cite one or more rules, 8 cite an article and no
rule, and 12 cite nothing. Fourteen of those 20 enforce the grammar (vocabularies, duplicates, fields,
parse failures) and three check declarations against each other; there the law has no rule, and a
citation would claim one that does not exist. `ROLE_UNDECLARED` cites nothing on purpose (see below).
`INTENT_ORPHAN` gained a rule at v3.12 (Rule 130). For `EXPRESSION_ORPHAN` and `VIBE_STRIPS_RIGHT`, which cite an
article only, the Principal ruled on 2026-11-02 that they stay so. An empty `rules` list therefore means "no rule is
cited", never "a binding is missing".

## 2. Severity and level

**Severity** is `error` (the declaration is unlawful; a build should fail) or
`warning` (lawful but suspect, or undecidable without more input).

**Level** is the conformance level at which the diagnostic becomes required —
see [README §4](README.md#4-conformance-levels). An implementation at Level 2 is
not failing because it stays silent on a Level 3 diagnostic; it is *reporting its
level honestly*, which the suite records.

## 3. The ten named violations

### Level 2 — decidable from a single declaration

These six read `SATISFIES` and `ALWAYS_REACHABLE`, which are written in the file.
**A standalone verifier owns all six with no knowledge of any other pillar.**

---

**`SELECT_ACT_COLLAPSE`** · error · Level 2
> A declaration whose `SATISFIES` holds both `SELECT` and `ACT` but not `CONFIRM`.

Selection has become execution: choosing a row deleted it. The selection family's
invariant — *selection expresses interest, never commitment* — is broken.

**Binds to** Rule 16 (Intentional Clicks) · Article II, Intent Over Mechanics ·
forbidden pattern `select-silently-acts`.

---

**`READ_ACT_COLLAPSE`** · error · Level 2
> A declaration whose `SATISFIES` holds both `READ` and `ACT`.

A reading surface mutates. There is no `CONFIRM` that repairs this one: reading
and acting are different intents on different surfaces, and the information
family's invariant says so — *a read surface that silently acts is an intent
violation*.

**Binds to** Rule 16 (Intentional Clicks) · Article II.

---

**`MISSING_UNDO`** · error · Level 2
> `SATISFIES` holds `ACT`, and `ALWAYS_REACHABLE` does not hold `UNDO`.

An act with no way back. The action family's invariant allows exactly one escape:
*every act has a reachable undo, **or declares why it cannot*** — so a declaration
that is genuinely irreversible must say so explicitly rather than stay silent.

**Binds to** Rule 79 (The Undo Covenant) · Article IV, Reversibility · the Right
to Reverse.

---

**`MISSING_CANCEL`** · error · Level 2
> A flow **that acts** — an `INTENT_FLOW` or `WIZARD` whose `SATISFIES` holds
> `ACT` — whose `ALWAYS_REACHABLE` does not hold `CANCEL`.

The human may begin but not stop. Distinct from `MISSING_UNDO`: undo reverses what
was done, cancel abandons what is being done.

**Binds to** Rule 26 (The Back Button is Holy) · Article IV · the Right to Leave.

---

**`TRAPPED_FLOW`** · error · Level 2
> A multi-step flow (`WIZARD`, or any declaration carrying `STEPS`) whose
> `ALWAYS_REACHABLE` does not hold `EXIT`. `STEPS` is read on any kind, so a `STEPS` on a
> kind other than `WIZARD` is not silent and is not `FIELD_MISPLACED`.

The continuity invariant is explicit that this is not a matter of degree: *a
trapped flow is unconstitutional*. Note the scope — a single-surface
`INTENT_FLOW` is not trapped by omitting `EXIT`; a wizard is.

**Binds to** Rule 51 (The Cognitive Tunnel) · Rule 53 (Interaction Lockdown) ·
Article II · the Right to Leave.

---

**`DECORATIVE_ANIMATION`** · error · Level 2
> Motion declared that reports no state — a `FEEDBACK` with a motion or `TONE`
> and an empty or absent `REPORTS`, or a `VIBE` declaring motion that reports
> nothing.

Motion that carries no information spends the operator's attention and returns
nothing.

**Binds to** Rule 112 (Motion Reports, It Never Decorates) · Article I, Calm ·
forbidden pattern `decorative-animation`.

---

### Level 3 — needs a symbol table

These three need facts a `.zui` file does not contain. A standalone verifier may
**accept the symbol table as an input** rather than compute it; the reference implementation supplies it
natively from the other pillars.

---

**`INTENT_ORPHAN`** · error · Level 3
> A declared element that traces to no intent.

The foundational rule of the language — *every UI element must trace to at least
one intent* — and the reason correctness is compilable at all. It is Level 3 only
because deciding it requires the **element inventory**: the set of things that
exist to be traced. Given a scope, it is mechanical.

**Binds to** Rule 130, Every Element Serves an Intent (canonized at v3.12 from this check), and Article II,
Intent Over Mechanics (the layer discipline itself).

---

**`INVISIBLE_STATE`** · error · Level 3
> The system holds state the operator must know, and no surface declares showing
> it. Requires the state model to know what the system holds.

**Binds to** Rule 82 (Perceivable State) · Article III, Visible Over Hidden · the
Right to Know · forbidden pattern `invisible-active-filters`.

---

**`HIDDEN_AUTHORITY`** · error · Level 3
> A consequential act names no actor. Requires the actor model.

**Binds to** Rule 83 (Predictable Authority) · Article V, Predictable Authority.

---

### Level 4 — needs a rendered surface

**`LAYOUT_DISPLACEMENT`** · error · Level 4
> Arriving content reserves no space, so it shoves the reading when it lands.

Undecidable from a declaration: it is a fact about a painted page. Today this is
measured by [the UI audit](../../tools/ui-audit.html), not by a verifier — the
enforcement ladder's honest position.

**Binds to** Rule 38 (Zero Displacement) · Article I · the Right to Act Without
Fear · forbidden pattern `layout-shift`.

## 4. Grammar and reference diagnostics

Beyond the ten, a conforming implementation raises these **twenty-seven**. The four marked ✅
ship in the reference implementation today, under the codes shown.

| Diagnostic | Sev. | Level | Meaning | Ref. impl. |
|---|---|---|---|---|
| `UNKNOWN_INTENT` | error | 1 | a verb in `SATISFIES`/`ALWAYS_REACHABLE` is not one of the 22 | ❌ |
| `UNSPECIFIED_DECLARATION` | warning | 1 | a `.zui` declaration kind outside the ten (`WIDGET`, `USER`) | ❌ |
| `DUPLICATE_FIELD` | error | 1 | a field key appears twice in one declaration | ❌ |
| `DUPLICATE_DECLARATION` | error | 1 | two declarations share a kind and a name | ❌ |
| `INTENT_FLOW_NO_SATISFIES` | warning | 2 | an `INTENT_FLOW` declares no intents | ✅ `ZUI-W001` |
| `INVALID_PERSPECTIVE` | error | 2 | `PERSPECTIVE` outside its enumeration | ✅ `ZUI-E001` |
| `INVALID_TONE` | error | 2 | `TONE` outside its enumeration | ✅ `ZUI-E002` |
| `UNRESOLVED_INTENT_FLOW` | warning | 2 | an `INTENT_FLOW` reference names no declared flow | ◐ `ZUI-W010` |
| `VIBE_STRIPS_RIGHT` | error | 2 | a `VIBE` suppresses an intent another declaration guarantees | ❌ |
| `UNRESOLVED_ENTITY` | warning | 3 | a `VISIBLE_ENTITIES` name resolves to no entity | ❌ |
| `UNKNOWN_MEDIUM` | error | 2 | `SURFACE_AS` names a medium outside the ten | ❌ |
| `VERB_NOT_CARRIED` | error | 2 | a declaration satisfies an intent the declared medium cannot carry at all | ❌ |
| `UNKNOWN_SIGNAL` | error | 1 | a value in `SIGNALS` is not one of Rule 118's five | ❌ |
| `EXPRESSION_ORPHAN` | error | 2 | an expression field on a declaration that satisfies no intent | ❌ |
| `SIGNAL_UNPERCEIVABLE` | error | 2 | every status a surface declares renders as absence in the medium it declared | ❌ |
| `UNKNOWN_ROLE` | error | 1 | a `ROLE` value is not one of the five promises | ❌ |
| `ROLE_MISPLACED` | error | 2 | `ROLE` declared on a kind that is not an `INTERACTION` | ❌ |
| `ROLE_ACTS_WITHOUT_CONSEQUENCE` | error | 2 | an `inert` or `navigate` control declares that it acts | ❌ |
| `ROLE_PROMISE_BROKEN` | error | 2 | a `reversible` control keeps no reachable `UNDO` | ❌ |
| `IRREVERSIBLE_CLAIMS_UNDO` | error | 2 | an `irreversible` control declares an `UNDO` it cannot honour | ❌ |
| `PROPOSAL_COMMITS` | error | 2 | a `proposal` acts without naming the authority that accepted it | ❌ |
| `ROLE_UNDECLARED` | warning | 2 | a surface declares interactions and gives none of them a role | ❌ |
| `FIELD_MISPLACED` | error | 2 | a known field on a kind that does not declare it (`ROLE` is `ROLE_MISPLACED`'s) | ❌ |
| `UNKNOWN_FIELD` | error | 1 | a field name the grammar does not define, or a known one written in the wrong form (`TONE [x]`, `SATISFIES x`) | ❌ |
| `SYNTAX_ERROR` | error | 1 | the source does not parse as `DEFINE <KIND> <name> ( field, … )` | ❌ |
| `UNEXPECTED_CHARACTER` | error | 1 | a character the lexer has no token for | ❌ |
| `UNTERMINATED_STRING` | error | 1 | a string is opened and the file ends before it closes | ❌ |

**The last seventeen are `zui`-verifier-only**, and the ❌ column means the *reference
implementation* (`parser.zig`, inside a consumer platform) does not raise them — not that
nothing does. `UNKNOWN_MEDIUM` and `VERB_NOT_CARRIED` arrived when `SURFACE_AS` closed to
ten media; `UNKNOWN_SIGNAL`, `EXPRESSION_ORPHAN` and `SIGNAL_UNPERCEIVABLE` arrived with
the first expression stratum.

### `FIELD_MISPLACED` closes the silence `ROLE_MISPLACED` named

`ROLE_MISPLACED` was added with the sentence *"a field that does nothing where it sits
reads as a declaration that was honoured. That silence is a gap in `TONE` and `PERSPECTIVE`,
not a precedent."* The gap stayed open for the other fields until **v1.4 (2026-11-01,
ruling D1 of 2026-10-31)**. It surfaced when the language was declared as a Haro language
(`haro/zui.stzu`): the court forged from that declaration refused a `TONE` or a `PERSPECTIVE`
on a `SCREEN` while the verifier said nothing, so an author believed a field was working
that nothing read.

**Each kind declares the fields [DECLARATIONS.md](DECLARATIONS.md) lists for it, plus the
four every kind carries** — `SATISFIES`, `ALWAYS_REACHABLE`, `SIGNALS`, `ACTOR`. Any other
*known* field on it is `FIELD_MISPLACED`, once per field, at that field's line — **except
the four the verifier reads on any kind**, below. The rule behind it is that the verifier
speaks where its silence *hides* an error; a field it already reads is not silent:

| Kind | Fields beyond the four |
|---|---|
| **INTENT_FLOW, SCREEN, COMPONENT** | none |
| **FORM** | `INTENT_FLOW` |
| **WIZARD** | `STEPS` |
| **NAV_GRAPH** | `VISIBLE_STATE` |
| **WORLD_VIEW** | `PERSPECTIVE`, `VISIBLE_ENTITIES` |
| **INTERACTION** | `ROLE` |
| **FEEDBACK** | `TONE`, `REPORTS`, `MOTION` |
| **VIBE** | `DENSITY`, `SURFACE_AS`, `MOTION`, `REPORTS`, `SUPPRESSES` |

**Not judged, because the verifier reads them on any kind:** `STEPS` (any declaration
carrying it is multi-step, `TRAPPED_FLOW`), `INTENT_FLOW` (resolved wherever it appears,
`UNRESOLVED_INTENT_FLOW`), `VISIBLE_STATE` and `VISIBLE_ENTITIES` (collected file-wide). A
`STEPS` on a `SCREEN` is therefore not `FIELD_MISPLACED`. The Haro court refuses all four off
their kind; that difference is a named seam in `haro/zui.stzu`, not a disagreement about the law.

Three more edges, stated so they are not rediscovered. **`ROLE` is left to `ROLE_MISPLACED`**,
which keeps its own id because ids are stable forever, so one defect is never reported
twice. **A name the grammar does not know is `UNKNOWN_FIELD`**, not this. **`WIDGET` and
`USER`** are `UNSPECIFIED_DECLARATION`'s and their fields are not judged. `INTENT_FLOWS`,
which the grammar admits as a list key, no kind declares and nothing reads, is
`FIELD_MISPLACED` on every kind.

### `ROLE` gives Rule 79's escape clause its first expressible form

The action family's invariant reads *"every act has a reachable undo, **or declares why it
cannot**"*, and §3 has always said a genuinely irreversible declaration **must say so
explicitly rather than stay silent**. Until `ROLE` existed **the language had no way to say
it**, so the escape clause was prose the grammar could not carry, and the only way past
`MISSING_UNDO` was to promise an `UNDO` that could not be honoured.

**`ROLE irreversible` is the declaration the rule asks for**, so `MISSING_UNDO` does not
fire on a declaration carrying it. This is not an exemption bolted on to make a fixture
pass — it is the second half of an invariant that has been in the law since v1 with nothing
able to express it. The pair `IRREVERSIBLE_CLAIMS_UNDO` and `MISSING_UNDO` now partition
the space: **promise the undo and keep it, or say plainly that you cannot.** Silence is
still refused.

**`ROLE_UNDECLARED` is the counter-check, and it is the only diagnostic in this
specification that measures rather than judges.** `EXPRESSION_ORPHAN` catches expression
declared without intent; this catches the other direction, and it is the failure
[the design pass](../ROLE-DESIGN.md) predicted of itself: *"a surface with no roles declared
raises nothing"*, so every role check above passes by silence on a surface that never met
the vocabulary.

**It is a warning, it cites nothing, and both of those are the point.** It cites nothing
because **nothing in the law requires a role** -- a citation would be claiming otherwise,
and the citation rule in [the Diagnostic Contract](../diagnostic-contract.md) exists so a
finding that cites can be answered only by fixing the artifact or amending the law. It is a
warning because requiring a role was ruled **not yet** on 2026-08-19, and this measurement
was ruled in its place: requiring an unproven vocabulary buys *a declared role* rather than
*an accurate one*. An author who finds one `INTERACTION` per control tedious declares one,
gives it a role, and the surface passes with a role that is **wrong** -- invisible
under-declaration becomes invisible **mis-declaration**, which is worse, because it turns a
silent gap into a green check. The requirement is decided later on two numbers read
together: how much under-declaration there is, **and** whether the roles authors did declare
are accurate. If they are inaccurate the vocabulary is wrong, and requiring it would have
entrenched the error.

**One role silences it**, file-wide, span `line: 0`. It reports a surface that has not met
the vocabulary **at all**, never a surface that roled some controls and not others: a
per-control count would be a requirement wearing a warning's clothes. Roles are counted on
`INTERACTION`s, so a `ROLE` sitting on the wrong kind does not silence it -- that is
`ROLE_MISPLACED`'s error, not a role declared.

**What it cannot see, stated because the number will be read as if it could**: an author who
declares no `INTERACTION` at all. This counts *roles per interaction*; *interactions per
control* is the deeper under-declaration, and `.zui` has no control primitive to count
against.

`ROLE_PROMISE_BROKEN` is scoped away from `MISSING_UNDO` for the same reason — it fires
only where `MISSING_UNDO` cannot see, on a control promising reversibility without
declaring that it acts at all. **Two diagnostics for one defect is noise**, and the first
draft of these checks produced exactly that.

**`SIGNAL_UNPERCEIVABLE` is the first diagnostic that needs two axes**, and therefore the
first evidence that closing `SURFACE_AS` bought a *check* rather than a taxonomy. Declaring
`muted` on a silent channel is not the defect — silence is the correct rendering of
*waiting, inactive*, and a sound announcing inactivity is a contradiction. The defect is
that **every** status the surface declares renders as absence there, so it promised a
perceptible status and emits nothing. Which values a medium renders as absence is data in
[`signal.json`](../../conformance/signal.json), recorded only for channels with a shipped
renderer: **a medium absent from that table is undecided and raises nothing**, never
"perceptible by default".

**The first two were added to `conformance/violations.json` and to the verifier and were
not added here**, so this table described 20 diagnostics while the contract held 22.
Recorded rather than quietly corrected: a specification that argues about drift is worth
nothing if its own table lags the data it describes, and nothing in the suite compares the
two.

◐ the reference implementation's `ZUI-W010` resolves the **cross-pillar** direction — `INTENT_FLOWS`
references written in other pillars' files, checked against flow names harvested
from `.zui`. The Zui-local direction specified here (a `FORM` whose `INTENT_FLOW`
names nothing) is not checked today.

`UNRESOLVED_ENTITY` is Level 3 and notable as a **gap in the reference
implementation**: `VISIBLE_ENTITIES` is parsed and emitted to IR
(`ir_emitter.zig:1454`) but never resolved against the entity model. Raised with
The reference implementation as decision-document §7.4.

## 5. Diagnostic output

Not normative, but conformance is easier to prove when implementations agree.
Recommended: one finding per line, machine-parseable first, prose after.

```
payments.zui:2  error  MISSING_UNDO  approve_payment
    An act declares no way back: SATISFIES holds ACT, ALWAYS_REACHABLE lacks UNDO.
    Rule 79 · The Undo Covenant · Article IV · the right to reverse
```

One scannable line per finding — location, severity, id, subject — with the
detail and the citation indented beneath it. The citation earns its own line:
rich enough to be useful, it would otherwise push the header past any sane
terminal width. (The [UI audit](../../tools/ui-audit.html) caught exactly that
overflow on this project's own front page, under Rule 114.)

The suite compares **`(fixture, code)` pairs only** — never line numbers, message
wording, or ordering. An implementation is free to phrase its prose however it
likes, in whatever language its operator reads. See
[the conformance README](../../conformance/README.md).

In **machine form**, a finding travels in the family envelope —
`{code, severity, message, span{file,line,col}, cites[], language}` — defined by
[the Diagnostic Contract](../diagnostic-contract.md) **v1.1**, which this court
*conforms to* and does not define. A run of the verifier emits **one object**,
never a top-level array, carrying its findings under the key `diagnostics` —
the outer shape v1.1 states. **That key was `findings` until 2026-08-20**, and
the rename is a breaking change for anything reading `zui check --json`. The contract fixes the envelope only; the
codes, severities and bindings above remain this specification's own, cataloged
in `conformance/violations.json`.
