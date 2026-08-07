# Diagnostics and the Law They Enforce

**Normative.** Part of [the Zui Language Specification v1.0](README.md). The
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
every diagnostic below carries a binding. Bindings cite
`constitution/rules.json` **v3.7.3**.

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
> `ALWAYS_REACHABLE` does not hold `EXIT`.

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

**Binds to** Article II, Intent Over Mechanics (the layer discipline itself).

---

**`INVISIBLE_STATE`** · error · Level 3
> The system holds state the operator must know, and no surface declares showing
> it. Requires the state model to know what the system holds.

**Binds to** Rule 82 (Visible State) · Article III, Visible Over Hidden · the
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

Beyond the ten, a conforming implementation raises these. The four marked ✅ ship
in the reference implementation today, under the codes shown.

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
