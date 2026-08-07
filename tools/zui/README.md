# `zui` — the verifier

**Checks Zui declarations against the constitution, before anything is
rendered.** Zero dependencies, one runtime you already have.

```bash
node tools/zui/cli.js check payments.zui
```

```
payments.zui:2  error  MISSING_UNDO  approve_payment  [Rule 79 · The Undo Covenant · Article IV · the right to reverse]
    An act declares no way back: SATISFIES holds ACT, ALWAYS_REACHABLE lacks UNDO.

1 error(s), 0 warning(s) across 1 file(s) at level 2
```

Exit codes: **0** clean · **1** violations found · **2** usage or read error.
That is all a CI gate needs.

---

## What it is

Three files, no dependencies, nothing to install:

| File | What it is |
|---|---|
| `zui.js` | the core: lexer, parser, checks. Pure functions over a string — no I/O. Runs in Node *and* in a browser (`window.Zui`). |
| `cli.js` | the command line: reads files, filters by level, formats findings. |
| `conformance.js` | the suite runner — proves this implementation against [the fixtures](../../conformance/). |

It implements [the Zui language specification v1.0](../../doc/language/README.md)
and is measured against [the conformance suite](../../conformance/README.md).

## Options

```
zui check <file.zui> [file.zui …]

  --level N        conformance level, 1-4 (default 2)
  --symbols FILE   JSON symbol table for Level 3 checks
  --contract FILE  path to violations.json
  --json           machine-readable output
  --quiet          findings only, no summary
  -h, --help
```

**Level 2 is the default and the honest one**: everything decidable from a
single declaration. Level 3 checks are *skipped* unless `--symbols` supplies
what they need — undecidable is silence, never a pass.

```bash
# Level 3, with the symbol table your host project knows
node tools/zui/cli.js check src/**/*.zui --level 3 --symbols build/symbols.json
```

where `symbols.json` is `{"entities": [...], "actors": [...], "state": [...], "elements": [...]}`.

## It reads the law rather than repeating it

The verifier hardcodes **no** severities, levels or rule numbers. It loads
[`conformance/violations.json`](../../conformance/violations.json) for the
diagnostic contract, and [`constitution/rules.json`](../../constitution/rules.json)
for rule titles and article numerals. That is why a finding can say
*Rule 79 · The Undo Covenant · Article IV* without a single one of those
strings appearing in the source — and why the tool cannot drift from the law
it enforces.

Both are optional at runtime: without the contract it still detects, it just
cites less. Vendor both beside the verifier when you deploy it.

## Conformance

```bash
node tools/zui/conformance.js --level 4
```

```
Zui conformance — level 4
  spec         doc/language/ v1.0
  contract     violations.json v1.0 (constitution v3.7.3)
  fixtures     30 total
  pass 30 · fail 0 · skipped 0 (above level 4)

  conforms at level 4 — every fixture in the suite.
```

Per level: **L1** 6 pass, 24 skipped · **L2** 26 pass, 4 skipped · **L3** and
**L4** 30 pass. Comparison is by diagnostic id only — never line numbers,
wording or order.

## What it enforces, and what it does not

**19 of the 20 diagnostics** in the contract. Six of the ten named violations
are decidable from a single declaration and are enforced by default:
`SELECT_ACT_COLLAPSE`, `READ_ACT_COLLAPSE`, `MISSING_UNDO`, `MISSING_CANCEL`,
`TRAPPED_FLOW`, `DECORATIVE_ANIMATION` — plus the grammar checks, both
enumerations, reference resolution and `VIBE_STRIPS_RIGHT`.

Three more (`INTENT_ORPHAN`, `INVISIBLE_STATE`, `HIDDEN_AUTHORITY`, and
`UNRESOLVED_ENTITY`) work at Level 3 **when you supply the symbol table**.
Computing that table from a host project's other pillars is not this tool's
job and may never be — a standalone verifier accepts it as input.

**`LAYOUT_DISPLACEMENT` is not implemented and never will be here.** It is a
fact about a painted page, and it belongs to
[the UI audit](../ui-audit.html), which measures it today. The enforcement
ladder, working as designed.

## In a browser

`zui.js` has no Node dependencies and exports `window.Zui`:

```html
<script src="tools/zui/zui.js"></script>
<script>
  const findings = Zui.verify(sourceText);        // [{id, line, subject}, …]
</script>
```

Same core, same results — the browser page and the CI gate cannot disagree.

## Implementation notes

- **The grammar is closed and so is the verb set.** `NAVIGATE` is not a verb;
  it is `LOCATE` or `DISCOVER`. See
  [GRAMMAR.md §4](../../doc/language/GRAMMAR.md#4-intent-verbs).
- **Declarations of other pillars are skipped whole**, by balanced-paren
  scanning. A Zui verifier has no standing over `DEFINE ENTITY`.
- **A UTF-8 BOM is consumed silently.** Editors on Windows add one routinely;
  a verifier that choked on it would be unusable there. (This was a real bug,
  found by running the tool rather than by reading it.)
- **Trailing commas are legal** in field lists and bracket lists.
- `MISSING_CANCEL` applies to flows that *act* — an `INTENT_FLOW` or `WIZARD`
  whose `SATISFIES` holds `ACT`. A read-only flow is not required to declare
  a cancel.

## Which implementation is this?

One of possibly several, and deliberately so. The
[M3 decision document](../../doc/decisions/M3-the-zui-verifier.md) left the
extract-versus-embed question open, and the conformance suite is what makes
that safe: **any future implementation, in any language, proves agreement
against the same 30 fixtures.** A Zig verifier living beside Zin's compiler
would be measured exactly the way this one is. That is the point of writing
the fixtures first.
