# M3 — The `zui` Verifier: Where It Should Live

**Status**: open for decision · written with the reference implementation's project, not imposed on it
**Date**: 2026-08-06
**Author**: StzZui (the language's home) · addressed to its reference implementation
**Decides**: how a standalone `zui` verifier comes to exist — by extraction, by
embedding, or by construction — and what StzZui owes the language regardless of
the answer.

---

## 1. The finding that reframes this decision

The roadmap said M3 would be a *lift*: "a standalone CLI that checks declarations
against the law — lifted from the reference compiler's existing implementation, not
rebuilt." That premise does not survive contact with the code.

**The ten named violations are not implemented there.** A search across all of
`D:\GitHub\zin\src` for `INTENT_ORPHAN`, `SELECT_ACT_COLLAPSE`,
`READ_ACT_COLLAPSE`, `MISSING_UNDO`, `MISSING_CANCEL`, `TRAPPED_FLOW`,
`INVISIBLE_STATE`, `HIDDEN_AUTHORITY`, `LAYOUT_DISPLACEMENT`, and
`DECORATIVE_ANIMATION` returns **zero occurrences**. They exist as a table in
`doc/spec/dsl/ZUI_SPECIFICATION_v3_0.md` §10.1, and the reference implementation's own §14 roadmap still
lists them as future work. They were specification, and both projects' documents
have been describing them as implementation.

What *does* exist in the reference implementation today is real, and worth stating precisely:

| Capability | Where | Status |
|---|---|---|
| The 13 Zui declaration keywords parse (`SCREEN, WIDGET, INTENT_FLOW, FORM, WIZARD, WORLD_VIEW, INTERACTION, FEEDBACK, COMPONENT, NAV_GRAPH, VIBE, USER`) | `src/compiler/parser.zig:4273-4295` | Works |
| Zui field keywords (`SATISFIES, ALWAYS_REACHABLE, VISIBLE_ENTITIES, VISIBLE_STATE, PERSPECTIVE, TONE, SURFACE_AS, INTENT_FLOW`) | `parser.zig:586-591, 1106-1110` | Works |
| `ZUI-W001` — `INTENT_FLOW` with no `SATISFIES` | `src/compiler/semantic.zig:645-677` | Works |
| `ZUI-E001` — invalid `PERSPECTIVE` on `WORLD_VIEW` | `semantic.zig:679-706` | Works |
| `ZUI-E002` — invalid `TONE` on `FEEDBACK` | `semantic.zig:707-737` | Works |
| `ZUI-W010` — unresolved `INTENT_FLOWS` reference | `semantic.zig:3583-3605` | Works |
| IR emission for Zui declarations | `src/ir/types.zig`, `ir_emitter.zig` | Works |
| The ten named violations | — | **Not implemented** |

Four diagnostics, roughly 148 non-test lines of Zui-specific semantic code. The
grammar is real; the jurisprudence is not yet written.

**Consequence: M3 is not a lift. It is mostly new implementation.** That is not a
setback — the design work is done and the evidence trail is complete — but it
changes the decision, because you do not choose an extraction strategy for code
that does not exist yet.

## 2. What Zui actually is inside the reference implementation

The reference implementation's compiler is **pillar-generic**, and this is its defining architectural fact.
One lexer, one recursive-descent parser, one `verify()`, one IR emitter — all
driven by table lookups keyed on a 62-variant `PillarCode` enum. Zui is one
variant. There is no `parseZui`, no `checkZui`, no Zui module.

- **The lexer** (`src/compiler/lexer.zig`, 692 lines) contains **zero** Zui
  references. Every Zui block name lexes as a generic identifier; the parser
  classifies it. This is the cleanest boundary in the codebase — a `std`-only file
  that any implementation could adopt unchanged.
- **The parser** is ~9,400 lines, of which ~40 non-test lines are Zui-attributable
  — table rows, not functions.
- **`semantic.verify()`** is the single public entry point: 39 numbered pillar
  checks in one `if (node.pillar == .X)` chain inside one node loop.
- **Shared types** are pillar-agnostic throughout: `AstNode` / `AstTree`
  (`src/ast/nodes.zig:156,172`), `PillarCode` and `Diagnostic`
  (`src/diagnostics/types.zig:19`), `ZirDecl` (`src/ir/types.zig`). No Zui-specific
  type exists anywhere.

So "extracting Zui" is not extracting a feature. **It is deleting 61 of 62 pillars
from a monolith** — and whatever remains, you still carry the entire generic
engine. The Zui-specific part is a rounding error on top of it.

## 3. The cross-pillar question, answered precisely

The decisive technical question is whether a `.zui` file can be checked *alone*.
The answer is: **mostly yes — and the exceptions are knowable in advance.**

Take the ten violations and ask what each needs. Six are decidable from a single
declaration, because `SATISFIES` and `ALWAYS_REACHABLE` are written in the `.zui`
file itself:

| Violation | Decidable from | Local? |
|---|---|---|
| `SELECT_ACT_COLLAPSE` | `SATISFIES` holds SELECT and ACT, lacks CONFIRM | **local** |
| `READ_ACT_COLLAPSE` | `SATISFIES` holds READ and ACT | **local** |
| `MISSING_UNDO` | `SATISFIES` holds ACT, `ALWAYS_REACHABLE` lacks UNDO | **local** |
| `MISSING_CANCEL` | a flow whose `ALWAYS_REACHABLE` lacks CANCEL | **local** |
| `TRAPPED_FLOW` | a multi-step flow with no reachable EXIT | **local** |
| `DECORATIVE_ANIMATION` | motion declared with no reported state | **local** |
| `INTENT_ORPHAN` | every element traces to ≥1 intent — needs the element inventory | scope-dependent |
| `LAYOUT_DISPLACEMENT` | arriving content reserves no space — needs render facts | **projection** |
| `INVISIBLE_STATE` | the system knows X, the surface shows X — needs the state model | **cross-pillar** |
| `HIDDEN_AUTHORITY` | a consequential act names an ACTOR — needs actors from `.zom` | **cross-pillar** |

Plus the already-shipping `ZUI-W010`, which resolves `INTENT_FLOWS` refs written
in `.zpf`/`.zql` against names harvested from `.zui` — note the direction: that is
the *data* pillar reaching into Zui, not Zui depending on data.

And one already-parsed field that is **never semantically resolved today**:
`VISIBLE_ENTITIES` (`ir_emitter.zig:1454`) is emitted to IR but never checked
against `entity_names`, which `semantic.zig:104-108` populates exclusively from
`DEFINE ENTITY` in `.zml`/`.zin`. Implementing that check is a hard dependency on
the data pillar.

**The shape of the answer**: a Zui-only verifier can honestly own six of ten
violations plus the four shipping diagnostics, with no knowledge of any other
pillar. The remaining four need a symbol table — which a standalone tool can
*accept as an input* rather than compute, and which the reference implementation can supply natively.

This is the fact the decision turns on, and it was not knowable before reading the
code.

## 4. The options

### Option A — Extract a standalone `zui` CLI

A new Zig project carrying the lexer unchanged, the parser with its keyword tables
pruned to Zui, and a `verify()` reduced to the Zui checks.

- **For**: no dependency on the reference implementation's release cadence, build, or `sqlite3`; a small
  fast binary; honors StzZui's product promise — *deployable inside any software
  project, no framework to swap*. The mechanical work is deletion, not
  refactoring, because `verify()`'s 39 checks are independent blocks in one
  function.
- **Against**: two implementations of one grammar, which can drift — and drift is
  the exact failure StzZui exists to prevent. Cross-pillar checks are structurally
  out of reach without an imported symbol table.

### Option B — Make the reference implementation's compiler embeddable, wrap it in a thin CLI

Add `b.addLibrary` / `b.addModule` to the reference implementation's `build.zig` (which today exports
nothing but the `zin` executable) and have `zui` link it.

- **For**: one grammar implementation forever; cross-pillar checks free; the
  entry points are already clean — `parseSource` and `verify` are
  allocator-passing, non-global, I/O-free functions. The build change is additive;
  no monolith refactoring required.
- **Against**: every consumer inherits the whole the reference implementation compiler, Zig 0.15.0, and
  the reference implementation's release cadence. A React team wanting to check `.zui` files must adopt a
  Zig toolchain. `verify()` is all-or-nothing — no way to request Zui-only checks —
  and `pipeline.run()` is coupled to stdout formatting, project layout, and
  sqlite, so a thin CLI needs a new narrower entry point regardless.

### Option C — The pillar filter (not an alternative; a prerequisite)

Add an options parameter to `semantic.verify()` carrying an enabled-pillar set.
Roughly ten lines, no restructuring, because the checks are already independent
`if (node.pillar == .X)` blocks.

- Gives Zui-only checking **inside the existing `zin` binary, today**.
- Makes either A or B materially cheaper afterwards.
- **Answers §3 empirically**: run Zui-only against `examples/bookstore` and
  `projects/restolean` and observe exactly what degrades when the other pillars
  are absent. That converts the cross-pillar question from analysis into
  measurement.
- Is independently useful to the reference implementation — any pillar becomes separately checkable.

## 5. Recommendation

**Sequence, don't choose yet. Three moves, in this order.**

**First — StzZui writes the conformance fixtures and the language spec.** This
requires no decision and no dependency on the reference implementation, and it is the move that makes
everything after it reversible. A fixture is a `.zui` declaration plus its known
verdict; the suite is the definition of agreement. Once it exists, "two
implementations drift" — Option A's one serious objection — stops being a risk and
becomes a test result. This is StzWeb's three-runtimes discipline applied to the
verifier, and it is StzZui's own work as the language's home.

**Second — the reference implementation adds the pillar filter (Option C).** Ten lines, useful to it on
its own terms, and it produces the evidence the A-vs-B choice actually needs.

**Third — decide A or B against that evidence.** Stated plainly, the present lean
is **A, with a declared symbol-table input for the four cross-pillar violations**
— because StzZui now sells itself as deployable in *any* project, and a verifier
that requires the reference implementation's toolchain contradicts that promise at the front door. But
this lean is held loosely: it is their compiler and their maintenance burden, and if
The reference implementation's author judges that one grammar implementation is worth more than
dependency-freedom, Option B is a defensible answer and the fixtures make it
equally safe.

What should **not** happen is choosing today on the strength of a premise (§1)
that turned out to be false.

## 6. What StzZui commits to regardless of the answer

These are owed by the language's home whichever implementation path wins:

1. **The language spec** published at `doc/language/` — the grammar stated
   formally. The reference implementation's `ZUI_SPECIFICATION_v3_0.md` (1,046 lines) is prose and tables
   with no EBNF; roughly 80% of it describes language that is not implemented. The
   spec must separate *what the language is* from *what any implementation has
   reached*, and credit that compiler as the reference implementation.
2. **The conformance fixtures** — declarations with known verdicts, so any
   implementation in any language can prove agreement.
3. **The violation-to-rule mapping** — each named violation bound to the
   constitutional rule it enforces, so a verifier's output cites the law. The
   binding for the six locally-decidable violations is already unambiguous:
   `MISSING_UNDO` → Rule 79 (The Undo Covenant), `SELECT_ACT_COLLAPSE` → Article II
   via Rule 16, `TRAPPED_FLOW` → the Right to Leave, `DECORATIVE_ANIMATION` →
   Rule 112. This mapping is what makes the verifier an instrument of the law
   rather than a linter with opinions.
4. **Honest status in every StzZui document** — corrected in the same commit as
   this one (§8).

## 7. Open questions for the reference implementation

The parts that are the reference implementation's call, not StzZui's:

1. **Is the pillar filter welcome?** It is ~10 lines in `semantic.verify()` and
   useful beyond Zui — but it is the reference implementation's function.
2. **Would the reference implementation accept `build.zig` exporting a module?** Additive, but it creates a
   public surface the reference implementation then owns and must keep stable.
3. **Where should the ten violations be implemented first** — in the reference implementation (so the
   reference implementation stays ahead and StzZui's standalone tool follows the
   fixtures), or in a standalone tool (so the reference implementation's monolith does not grow)? This is
   the real fork; the A/B question is downstream of it.
4. **Does the reference implementation want `VISIBLE_ENTITIES` resolved** against `entity_names`? It is
   parsed and emitted but never checked — a genuine gap in the reference implementation today, independent
   of everything else here.
5. **Two known hazards** for any extraction or embedding, flagged rather than
   assumed: `build.zig` writes `src/auto_tests.zig` into the source tree during
   `zig build test` (a consumer inherits that side effect), and
   `.claude/worktrees/` holds ~141 stale copies of the `.zui` files that any
   grep-based tooling must exclude.

## 8. What this document changes in StzZui, immediately

Three of our own documents asserted the false premise and are corrected in the
commit that lands this file:

- `ROADMAP.md` M3 — "lifted from the reference compiler's existing implementation… not
  rebuilt" → M3 restated as new implementation against a published spec and
  fixtures, with the sequence in §5.
- `doc/ARCHITECTURE.md` — the ten named violations listed under "Today" as the reference implementation
  `semantic.zig` behavior → corrected to the four diagnostics that exist, with the
  ten named as the specified contract.
- `site/how.html` and `index.html` — the `zui check` output was captioned as
  running today. The demonstrations stay (design documents may show designed
  behavior), but the labels now say what is specified versus what compiles.

That correction is not incidental to this decision; it is the same discipline.
A project whose thesis is *documentation and enforcement cannot drift apart* does
not get to let its own documents drift from its own implementation.

---

## Appendix — how this was established

Read against `D:\GitHub\zin` at 2026-08-06: `src/compiler/{lexer,parser,semantic,
ir_emitter,pipeline}.zig`, `src/ast/nodes.zig`, `src/diagnostics/types.zig`,
`src/ir/{types,bkg}.zig`, `build.zig`, `build.zig.zon`,
`doc/spec/dsl/ZUI_SPECIFICATION_v3_0.md`. The reference implementation at version 0.33.0, minimum Zig
0.15.0. Its Zui test coverage: ~19 inline tests, no fixture files. Real `.zui`
files on disk outside worktrees: three (`examples/bookstore/src/bookstore.zui`,
`projects/restolean/src/model/restaurant.zui`,
`projects/restolean/vision/restaurant-full.zui`).
