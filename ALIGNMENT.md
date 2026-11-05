# Alignment — StzZui against the Softanza reference design

**Reference**: `softanza/REFERENCE_DESIGN.md` **v1.3** — ratified 2026-08-08, amended
2026-08-10, 2026-08-11 (C7 added) and 2026-08-12. C2 is unchanged across all three
amendments; this alignment answers it as ratified.
**Status**: obligations in force. **C2 delivered** (2026-08-08, v1.0) — see item 1.

## What StzZui owns in the reference design

The law (unchanged), and — newly promoted — **the Diagnostic Contract (C2)**: the
refusal format every court in the family speaks.

## What changes here

1. **C2 — extract and version the diagnostic shape.** The verifier's convention
   (`ZUI-Wxxx`/`ZUI-Exxx` codes, severities, spans, rule citations) becomes a standalone
   versioned artifact — `doc/diagnostic-contract.md` plus a JSON shape — governed like
   the law: versioned, substance-tested, consumed by pin. The zui verifier becomes its
   first conforming implementation rather than its definition.

   **✅ Delivered 2026-08-08 as v1.0, amended 2026-08-20 to v1.1** (the outer shape: one object carrying `diagnostics`, never a top-level array), **corrected 2026-08-21 to v1.1.1 and v1.1.2** (§2.7's jsonlib justification re-measured, then its encoder table re-measured; no requirement moved at either), **amended 2026-08-23 to v1.2.0** (§2.8: no value in an envelope may be a bare `true`, `false` or `null`, because the family's JSON encoder returns all three as strings on a round trip and raises nothing): [`doc/diagnostic-contract.md`](doc/diagnostic-contract.md)
   (the envelope, code format, severity ladder and citation rule, governed by the
   law's own versioning discipline) with
   [`doc/diagnostic-contract.schema.json`](doc/diagnostic-contract.schema.json)
   beside it. The zui verifier is the first conforming implementation: `--json`
   emits the envelope, and the conformance runner validates every diagnostic it
   emits against the shape — the 30-fixture suite still passes 30/30, no verdict
   and no code's meaning changed. The extraction moved the envelope's ownership,
   not its content; the court's codes stay cataloged in
   `conformance/violations.json`.
2. **C1 — the verifier's cross-pillar seam binds to the World Contract.** M3 already
   decided the verifier *accepts a symbol table as input*; that input becomes the
   `world.json` artifact instead of an ad-hoc table. No verifier logic changes — only
   the provenance of the table it already accepts.
3. **C6 — lexical alignment, documented not forced.** When Ringua publishes the
   commons, `.zane`'s divergences are recorded the way the law records burned numbers:
   named, dated, never silently rewritten.

## What must not change

Rule numbers, evidence, lineage, the versioning discipline, the substance test, the
patch component. The law's independence from every product — including from this
reference design: if the design ever conflicts with the law, the law wins on its own
ground.

## Order and gates

C2 is this repository's first and cheapest act after ratification, and it unblocks every
other court's adoption. Item 2 waits on stzlib's world schema; item 3 waits on Ringua.

## Honest boundaries

Promoting the diagnostic shape family-wide widens its consumers, not its authority: each
court chooses its own codes; the contract fixes only the envelope. The three reading-arc
overruns in the law's own prose remain open findings against this repository,
independent of this alignment.
