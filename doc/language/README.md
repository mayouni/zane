# The Zui Language — Specification v1.0

**Status**: normative for the language; honest about implementations
**Date**: 2026-08-06
**Home**: StzZui, where the language and its constitution live
**Reference implementation**: a sibling platform's compiler — a consumer, not the owner

---

## 1. What this specifies

Zui is a **declarative language for intent-driven user interfaces**. A `.zui` file
declares what a human is trying to *do* on a surface — discover, select, confirm,
undo — and says nothing about how any medium draws it. Rendering is a consequence.

This specification defines the language completely enough that an implementation
in any language can be written against it, and its agreement proved by running
[the conformance suite](../../conformance/). It is in four parts:

| Document | Defines |
|---|---|
| **This file** | what the language is, the conformance levels, the status of every claim |
| [GRAMMAR.md](GRAMMAR.md) | the lexical and syntactic grammar, in EBNF |
| [DECLARATIONS.md](DECLARATIONS.md) | the ten declaration types, their fields and static semantics |
| [VIOLATIONS.md](VIOLATIONS.md) | every diagnostic, its definition, and the constitutional rule it enforces |

The machine-readable half lives outside `doc/`, because implementations *consume*
it rather than read it: [`conformance/violations.json`](../../conformance/violations.json)
is the diagnostic contract as data, and [`conformance/manifest.json`](../../conformance/manifest.json)
is the fixture suite.

## 2. The inversion, stated normatively

Every UI element must trace to at least one **intent**. An element that traces to
none is a structural error, not a style question. This single rule is what makes
interface correctness *compilable*, and it is the reason the intent grammar is
**closed**: a new medium adds renderings, never verbs.

The grammar holds **22 verbs** in six families:

```
DISCOVER  UNDERSTAND  LOCATE            orienting
FOCUS     FILTER      COMPARE           attention
READ      SCAN        SCROLL   ZOOM     information
SELECT    HIGHLIGHT   PREVIEW  MARK     selection
ACT       CONFIRM     CANCEL   UNDO     action
PAUSE     RESUME      RETRY    EXIT     continuity
```

Each family carries an invariant the verbs must satisfy, given in
[DECLARATIONS.md §2](DECLARATIONS.md#2-the-intent-grammar). The verb list is
normative and closed: `SATISFIES [NAVIGATE]` does not name a verb of this
language and is a `UNKNOWN_INTENT` diagnostic, however reasonable the word
sounds. Navigation is expressed by `LOCATE` and `DISCOVER`.

> **Correction of record.** Both this project's documents and the reference implementation's
> `ZUI_SPECIFICATION_v3_0.md` have described the grammar as "24 verbs" while
> enumerating 22. The enumerations agree with each other and with
> `constitution/rules.json`; only the count was wrong, in both projects, from the
> beginning. **22 is correct.** No verb was lost — the number was never right.
> StzZui's own documents are corrected in the commit that publishes this spec.

## 3. The constitution is the semantics

Zui is not a linter with opinions. Every diagnostic it raises cites a numbered
rule of [the Zui Constitution](../../constitution/rules.json), which is the
language's semantic layer: the compiler refuses a declaration *because* the law
forbids what it declares. [VIOLATIONS.md](VIOLATIONS.md) binds each diagnostic to
its rule, article, and operator right; the binding is also data, in
[`violations.json`](../../conformance/violations.json), so a verifier's output can
carry rule numbers without hardcoding prose.

A consumer pins a constitution version. This specification is written against
**v3.8.0**.

## 4. Conformance levels

A verifier's honest claim depends on what it can *see*. Four levels, each a strict
superset of the last. **The level is a property of the implementation, and the
suite reports which level a run satisfied.**

| Level | Name | Requires | Sees |
|---|---|---|---|
| **1** | Syntax | nothing but the file | the grammar parses; unknown verbs, unknown declaration kinds, malformed structure |
| **2** | Local semantics | nothing but the file | Level 1 + the six locally-decidable violations + enumeration and reference checks |
| **3** | Cross-pillar | a symbol table of entities, actors and state | Level 2 + `INVISIBLE_STATE`, `HIDDEN_AUTHORITY`, `INTENT_ORPHAN`, `VISIBLE_ENTITIES` resolution |
| **4** | Projection | a rendered surface | Level 3 + `LAYOUT_DISPLACEMENT` and everything only a painted page reveals |

**Level 2 is the meaningful target for a standalone verifier**, and the reason a
`.zui` file is worth checking alone: six of the ten named violations are decidable
from a single declaration, because `SATISFIES` and `ALWAYS_REACHABLE` are written
in the file itself.

Level 3 needs a symbol table that a standalone tool may **accept as an input**
rather than compute — the four cross-pillar violations are not out of reach, only
out of reach *without being told*. Level 4 belongs to a projection or to
[the UI audit](../../tools/ui-audit.html), which measures the painted page today.

## 5. Status: the language versus its implementations

The discipline this project exists to enforce applies first to itself, so:

| Capability | Specified here | Reference impl. | Standalone `zui` |
|---|---|---|---|
| The grammar, 10 declaration types | ✅ v1.0 | ✅ parses 12 (see §6) | not built |
| 22-verb closed grammar | ✅ normative | parsed as identifiers, **not validated** | not built |
| `INTENT_FLOW_NO_SATISFIES` | ✅ | ✅ `ZUI-W001` | — |
| `INVALID_PERSPECTIVE` | ✅ | ✅ `ZUI-E001` | — |
| `INVALID_TONE` | ✅ | ✅ `ZUI-E002` | — |
| Unresolved intent-flow reference | ✅ | ✅ `ZUI-W010` (cross-pillar direction only) | — |
| The ten named violations | ✅ | ❌ **none implemented** | — |
| Conformance fixtures | ✅ this repository | ❌ 19 inline tests, no fixtures | — |

**No implementation is at Level 2 today.** the reference implementation parses the whole grammar and
enforces four diagnostics; the ten named violations are specification everywhere
and code nowhere. That was established by reading the source and is recorded in
[the M3 decision document](../decisions/M3-the-zui-verifier.md) §1. This
specification exists so the implementation has something to be written *against*,
and the fixtures exist so agreement can be proved rather than asserted.

## 6. Two deliberate differences from the reference implementation

The reference implementation's parser accepts **twelve** `.zui` declaration kinds. This specification
defines **ten**, and excludes two on stated grounds:

- **`WIDGET`** is excluded on constitutional grounds. A widget is a *consequence*
  of intent, never a declared primitive; admitting `DEFINE WIDGET` into the
  language would let a declaration name a rendering and contradict the inversion
  in §2. The reference implementation recognizes it (`parser.zig:4275`); this language does not define it.
- **`USER`** is excluded as belonging to the actor model, not the interface
  language. It ties a member to an actor on a surface — a fact about *who*, which
  Zui consumes from a symbol table rather than declares.

Both are open questions for the reference implementation, raised in the decision document §7. An
implementation that accepts them is not thereby non-conforming — it is accepting
more than this language defines, and the suite reports the difference rather than
failing it. See [CONFORMANCE](../../conformance/README.md#extensions).

## 7. Credits

The three-layer model, the 22-verb grammar, the ten declaration types and the ten
named violations originate in **a sibling project's Zui pillar** (`ZUI_SPECIFICATION_v3_0.md`,
Session 27), whose compiler remains the reference implementation. The
constitution-as-data discipline, the enforcement tiers, the evidence requirement
and this specification's conformance machinery originate in **StzZui** and its
StzWeb lineage. The formal grammar in [GRAMMAR.md](GRAMMAR.md) is stated here for
the first time — the reference implementation's specification is prose and tables, with no EBNF.
