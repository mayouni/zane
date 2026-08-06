# The Zui Conformance Suite

**Declarations with known verdicts, so any implementation in any language can
prove agreement rather than assert it.**

This is the StzWeb three-runtimes discipline applied to the verifier itself, and
it is the reason the language can have more than one implementation without
drifting — the failure this whole project exists to prevent.

- **The contract**: [`violations.json`](violations.json) — every diagnostic, its
  severity, its conformance level, and the constitutional rule it enforces.
- **The suite**: [`manifest.json`](manifest.json) — every fixture with its
  expected diagnostics.
- **The fixtures**: [`fixtures/`](fixtures/) — 30 `.zui` declarations.
- **The language**: [`doc/language/`](../doc/language/) — what all of this is
  checking against.

---

## What conformance means

An implementation **claims a level** (1–4, defined in
[the specification](../doc/language/README.md#4-conformance-levels)) and runs the
fixtures at or below it. For each fixture:

> **Pass** when the set of diagnostic ids reported equals `expect_ids` exactly.

Three deliberate looseness's, so that conformance measures agreement about *the
law* and not about presentation:

- **Line numbers are not compared.** Nor columns.
- **Message wording is not compared.** Phrase findings however your operators
  read best, in whatever language they read.
- **Order is not compared.** A set, not a sequence.

What *is* compared is the id — because the id is what carries the rule number,
and the rule number is what makes the finding an instrument of law rather than an
opinion.

## Levels, and why skipping is honest

A fixture above your claimed level is **skipped, not failed**. An implementation
that reads a single file cannot decide `HIDDEN_AUTHORITY` without an actor model,
and pretending otherwise would be the drift this suite exists to catch.

| Level | A run at this level | Fixtures |
|---|---|---|
| 1 | parses, checks the grammar and the closed verb set | 6 |
| 2 | + everything decidable from one declaration | 20 |
| 3 | + cross-pillar checks, given a symbol table | 4 |
| 4 | + rendered-surface facts | 0 — see below |

**Level 2 is the meaningful target for a standalone verifier.** Six of the ten
named violations live there, and they are the six that matter most in practice.

Level 3 fixtures **carry their own symbol table** in the manifest's `symbols`
field — the entities, actors, state or elements the check needs. That is
deliberate: it lets a standalone tool be tested at Level 3 without a host
language, by accepting the symbol table as an input rather than computing it.

Level 4 has no fixtures, and the manifest says why in its `unfixtured` section:
`LAYOUT_DISPLACEMENT` is a fact about a painted page. It is measured today by
[the UI audit](../tools/ui-audit.html). A fixture would be theatre.

## Running the suite

```bash
node tools/zui/conformance.js --level 4
```

That runs [the verifier in this repository](../tools/zui/README.md) against
every fixture. For an implementation of your own, a runner is ten lines in any
language:

```
for each fixture in manifest.fixtures:
    if fixture.level > claimed_level: skip
    actual = run_verifier(fixtures/ + fixture.file, fixture.symbols)
    actual = { d.id for d in actual if level_of(d.id) <= claimed_level }
    pass = (actual == set(fixture.expect_ids))
```

Report the claimed level, the pass/skip/fail counts, and every mismatch as
`fixture: expected {…} got {…}`.

## Extensions

An implementation may accept **more** than this language defines — Zin's compiler
accepts `WIDGET` and `USER`, which this specification excludes on stated grounds.
That is an extension, not a failure. It shows up as one fixture disagreeing
(`unspecified-declaration.zui`), and the honest way to report it is:

> *conforms at Level 2, with 1 declared extension (WIDGET)*

An implementation may **not** report fewer diagnostics at a level it claims. That
is the direction that matters: silence about a violation is what lets defects
ship.

## The state of play

| Implementation | Level | Result |
|---|---|---|
| [`tools/zui/`](../tools/zui/README.md) — this repository | 3 | **30 / 30 pass** (L1 6, L2 26, L3 30) |
| Zin's compiler — the reference implementation | subset of 2 | four diagnostics, none of the ten named violations |

The suite was written *before* either could pass it, which is the whole point:
once a suite exists, "two implementations drift" stops being a risk and becomes
a test result — and that is what makes the standalone-versus-embedded decision
reversible instead of fateful. A Zig verifier beside Zin's compiler would be
measured here exactly as the JavaScript one is.

Zin's four diagnostics (`ZUI-W001`, `ZUI-E001`, `ZUI-E002`, `ZUI-W010`) were
established by reading its source, and are recorded in
[the M3 decision document](../doc/decisions/M3-the-zui-verifier.md) §1.

## Adding a fixture

1. One fixture, one concern. Isolate: add whatever fields are needed so the
   declaration triggers **only** the diagnostic under test. Several fixtures here
   carry an `ACTOR` or an `ALWAYS_REACHABLE` purely to stay isolated.
2. Give every violation fixture a **lawful twin** where the defect is repaired
   and nothing else changes. The twin proves the check is not simply firing on
   everything — and it teaches, the same way [the Gotchas](../site/gotchas/) do.
3. Comment the fixture with what it demonstrates and why, in the file itself.
4. Add it to `manifest.json` with its level and `expect_ids`.
5. If it needs a symbol table, put that in the fixture's `symbols` field.
