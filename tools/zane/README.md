# `zane` — the verifier

**Checks Zane declarations against the constitution, before anything is
rendered.** One file, `zane`, and nothing to install beside it.

```bash
zane check payments.zane
```

Version 0.1.0 is on [its release page](https://github.com/mayouni/zane/releases/tag/v0.1.0), one file for each
system and `zane-0.1.0.wasm` for a browser, each file's hash in `SHA256SUMS`
([doc/releases/v0.1.0.md](../../doc/releases/v0.1.0.md) says how to check one). `zane --version` names it.
`zane` is built from this repository with Zig (`zig build -Doptimize=ReleaseSmall` puts it in
`zig-out/bin/`, and `zig build release` builds every published file into `zig-out/release/`;
[doc/design/BINARY.md](../../doc/design/BINARY.md)). The JavaScript in this folder is its
**reference**: `zane.js` and `cli.js` are what [`parity.js`](parity.js) holds the binary to, byte for byte, and
`node tools/zane/cli.js check payments.zane` runs that reference with the same options and the same output.

```
payments.zane:2  error  MISSING_UNDO  approve_payment  [Rule 79 · The Undo Covenant · Article IV · the right to reverse]
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
| `zane.js` | the core: lexer, parser, checks. Pure functions over a string — no I/O. Runs in Node *and* in a browser (`window.Zane`). |
| `cli.js` | the command line: reads files, filters by level, formats findings. |
| `envelope.js` | the family envelope: builds `{code, severity, message, span, cites, language}` findings and validates them against [the Diagnostic Contract's shape](../../doc/diagnostic-contract.schema.json). |
| `conformance.js` | the suite runner — proves this implementation against [the fixtures](../../conformance/). |
| `parity.js` | the gate of the binary's stages ([BINARY.md](../../doc/design/BINARY.md) section 5): `zane check` against `cli.js` on every fixture and a seeded corpus, `zane conformance` against `conformance.js`, the other tools against their scripts, and, since S5, `zane site facts`, `site shell` and `site grid` against `tools/site-facts.js`, `site-shell.js` and `site-grid.js` on the tree, in their `--write` modes and on one break per check, byte for byte. `--only site` runs that last section alone and names what it skipped. Needs a built `zane` (`zig build -j2`, or `--bin PATH`). |

It implements [the Zane language specification v1.5](../../doc/language/README.md)
and is measured against [the conformance suite](../../conformance/README.md).

## Options

```
zane check <file.zane> [file.zane …]

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
zane check src/**/*.zane --level 3 --symbols build/symbols.json
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

## It conforms to the family Diagnostic Contract

Machine output (`--json`) travels in the family envelope —
`{code, severity, message, span{file,line}, cites[], language}` — defined by
[the Diagnostic Contract](../../doc/diagnostic-contract.md) **v1.2.0** (C2 of the
Softanza reference design). This verifier is the contract's **first conforming
implementation**: it *conforms to* the envelope, it does not define it, and the
conformance runner validates every diagnostic it emits against
[the machine-readable shape](../../doc/diagnostic-contract.schema.json). The
contract fixes the envelope only; this court's codes stay cataloged in
[`violations.json`](../../conformance/violations.json), as before.

Since **v1.2.0** the runner also scans every diagnostic and every report to full
depth for values that do not survive a JSON round trip — a bare `true`, `false`
or `null` anywhere is a conformance failure, per the contract's §2.8. The page
above said **v1.1.1** while the contract stood at v1.1.2: a version transcribed
by hand into a second file drifts from it, and this one did.

## Conformance

```bash
zane conformance --level 4
```

```
Zane conformance — level 4
  spec         doc/language/ v1.4
  contract     violations.json v1.8 (constitution v3.13)
  envelope     diagnostic-contract v1.2.0 — 40 diagnostics and 57 reports, all conform
  media        10 media — verifier agrees with media.json
  catalogue    37 diagnostics — contract agrees with VIOLATIONS.md
  fixtures     57 total
  pass 57 · fail 0 · skipped 0 (above level 4)

  conforms at level 4 — every fixture in the suite.
```

Per level: **L1** 12 pass, 45 skipped · **L2** 53 pass, 4 skipped · **L3** and
**L4** 57 pass. Comparison is by diagnostic id only — never line numbers,
wording or order.

**The `media` and `catalogue` lines are agreement checks, not counts.** Two
sources of one truth drift: the medium enumeration lives in the verifier *and*
in `media.json`, the SIGNAL vocabulary and its absence table in the verifier
*and* in `signal.json`, and the diagnostic list in `violations.json` *and* in
`VIOLATIONS.md`. Each pair is compared on every run and disagreement exits 1 —
added after the prose spec was found catalogueing 20 diagnostics while the
contract held 22, through three law versions, with nothing to notice.

## What it enforces, and what it does not

**36 of the 37 diagnostics** in the contract. Six of the ten named violations
are decidable from a single declaration and are enforced by default:
`SELECT_ACT_COLLAPSE`, `READ_ACT_COLLAPSE`, `MISSING_UNDO`, `MISSING_CANCEL`,
`TRAPPED_FLOW`, `DECORATIVE_ANIMATION` — plus the grammar checks, all **four**
enumerations, reference resolution and `VIBE_STRIPS_RIGHT`.

The contract has grown four times since this section was written: `UNKNOWN_MEDIUM`
and `VERB_NOT_CARRIED` when `SURFACE_AS` closed to ten media; `UNKNOWN_SIGNAL`,
`EXPRESSION_ORPHAN` and `SIGNAL_UNPERCEIVABLE` with `SIGNALS`, the first expression field;
`UNKNOWN_ROLE`, `ROLE_MISPLACED`, `ROLE_ACTS_WITHOUT_CONSEQUENCE`, `ROLE_PROMISE_BROKEN`,
`IRREVERSIBLE_CLAIMS_UNDO` and `PROPOSAL_COMMITS` with `ROLE`, the second; and
`ROLE_UNDECLARED` on 2026-08-20; and `FIELD_MISPLACED` on 2026-11-01, which closes the silence on every field but `ROLE`. **The numbers in this section were three growths stale
when the fourth arrived** — a README is not compared against anything on any run, which is
why the `media` and `catalogue` lines above exist for the sources that are. The one still
unenforced here is `LAYOUT_DISPLACEMENT`, which is undecidable from a declaration and
belongs to the UI audit.

**`ROLE_UNDECLARED` is the only diagnostic here that refuses nothing by design.** It is a
warning that measures how often a surface declares controls and gives none of them a
promise, so the question of *requiring* a role can be decided on numbers rather than on
taste. A run carrying only that diagnostic exits **0**.

Three more (`INTENT_ORPHAN`, `INVISIBLE_STATE`, `HIDDEN_AUTHORITY`, and
`UNRESOLVED_ENTITY`) work at Level 3 **when you supply the symbol table**.
Computing that table from a host project's other pillars is not this tool's
job and may never be — a standalone verifier accepts it as input.

**`LAYOUT_DISPLACEMENT` is not implemented and never will be here.** It is a
fact about a painted page, and it belongs to
[the UI audit](../ui-audit.html), which measures it today. The enforcement
ladder, working as designed.

## In a browser

The same core as `zane`, compiled to WebAssembly: `site/zane.wasm`, loaded by `site/zane-wasm.js`, which
the Build page's try-it box uses and `wasm-proof.html` proves against the native binary:

```html
<script src="site/zane-wasm.js"></script>
<script>
  ZaneWasm.load('site/zane.wasm').then(z => {
    const envelope = z.check('pay.zane', sourceText, { level: 2 });   // what `zane check pay.zane --json` prints
  });
</script>
```

`zane.js` still runs in a browser as `window.Zane`, with no dependency, and no page of the site loads it: since
stage S6 it is the reference the binary and the wasm are held to, not the route a reader takes.

## Implementation notes

- **The grammar is closed and so is the verb set.** `NAVIGATE` is not a verb;
  it is `LOCATE` or `DISCOVER`. See
  [GRAMMAR.md §4](../../doc/language/GRAMMAR.md#4-intent-verbs).
- **Declarations of other pillars are skipped whole**, by balanced-paren
  scanning. A Zane verifier has no standing over `DEFINE ENTITY`.
- **A UTF-8 BOM is consumed silently.** Editors on Windows add one routinely;
  a verifier that choked on it would be unusable there. (This was a real bug,
  found by running the tool rather than by reading it.)
- **Trailing commas are legal** in field lists and bracket lists.
- `MISSING_CANCEL` applies to flows that *act* — an `INTENT_FLOW` or `WIZARD`
  whose `SATISFIES` holds `ACT`. A read-only flow is not required to declare
  a cancel.

## Which implementation is this?

One of possibly several, and deliberately so. The
[M3 decision document](../../doc/decisions/M3-the-zane-verifier.md) left the
extract-versus-embed question open, and the conformance suite is what makes
that safe: **any future implementation, in any language, proves agreement
against the same 57 fixtures.** A Zig verifier living beside the reference implementation's compiler
would be measured exactly the way this one is. That is the point of writing
the fixtures first.
