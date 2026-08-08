# Alignment — StzZui against the Softanza reference design

**Reference**: `softanza/REFERENCE_DESIGN.md` v0.1 (draft, unratified) · 2026-08-08
**Status**: obligations-if-ratified.

## What StzZui owns in the reference design

The law (unchanged), and — newly promoted — **the Diagnostic Contract (C2)**: the
refusal format every court in the family speaks.

## What changes here

1. **C2 — extract and version the diagnostic shape.** The verifier's convention
   (`ZUI-Wxxx`/`ZUI-Exxx` codes, severities, spans, rule citations) becomes a standalone
   versioned artifact — `doc/diagnostic-contract.md` plus a JSON shape — governed like
   the law: versioned, substance-tested, consumed by pin. The zui verifier becomes its
   first conforming implementation rather than its definition.
2. **C1 — the verifier's cross-pillar seam binds to the World Contract.** M3 already
   decided the verifier *accepts a symbol table as input*; that input becomes the
   `world.json` artifact instead of an ad-hoc table. No verifier logic changes — only
   the provenance of the table it already accepts.
3. **C6 — lexical alignment, documented not forced.** When Ringuist publishes the
   commons, `.zui`'s divergences are recorded the way the law records burned numbers:
   named, dated, never silently rewritten.

## What must not change

Rule numbers, evidence, lineage, the versioning discipline, the substance test, the
patch component. The law's independence from every product — including from this
reference design: if the design ever conflicts with the law, the law wins on its own
ground.

## Order and gates

C2 is this repository's first and cheapest act after ratification, and it unblocks every
other court's adoption. Item 2 waits on stzlib's world schema; item 3 waits on Ringuist.

## Honest boundaries

Promoting the diagnostic shape family-wide widens its consumers, not its authority: each
court chooses its own codes; the contract fixes only the envelope. The three reading-arc
overruns in the law's own prose remain open findings against this repository,
independent of this alignment.
