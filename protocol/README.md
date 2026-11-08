# The Zane Protocol Pack

**What a participant downloads, pins, and can be held to.** **12 files, no runtime.**

```bash
zane pack --check     # do the bytes I have match the manifest?
zane conformance --level 4
zane cross-medium
```

---

## 1. What this is, and what it deliberately is not

**It is data and prose. There is no library here.** Nothing to install, nothing to link,
no framework to adopt, no language to write in. That is not minimalism for its own sake —
it is the only arrangement under which an implementation in **any** language can prove it
agrees, because agreement is proved by **running the fixtures**, never by sharing code.

A Zig verifier, a Python linter, a Rust language server and the JavaScript verifier in this
repository are peers. Each reads the same JSON, parses the same grammar, and reports the
same diagnostic ids on the same 77 fixtures — or it does not conform, and the suite says
which fixture disagreed.

**The pack is therefore the whole standard.** Everything else in this repository — the
site, the Reader, the audit, the verifier — is a *consumer* of it, including the tools
listed above.

## 2. What is in it

12 files in five roles. `MANIFEST.json` carries the hash of each, and
`zane pack --check` verifies the counts on this page against it — **this README's own numbers
are checked, not typed and trusted.**

| Role | Files | What it fixes |
|---|---|---|
| **the law** | `constitution/rules.json` | 123 rules, 7 articles, 6 rights, 17 forbidden patterns — the semantic layer every diagnostic cites |
| **the language** | `doc/language/` — README, GRAMMAR, DECLARATIONS, VIOLATIONS | the grammar in EBNF, the ten declaration types, the four closed enumerations, and every diagnostic bound to the rule it enforces |
| **the refusal contract** | `conformance/violations.json`, `doc/diagnostic-contract.md` + `.schema.json` | 40 diagnostics with severities, levels and bindings; and the envelope every finding travels in, `{code, severity, message, span, cites, language}`, carried in one object under `diagnostics` -- never a top-level array |
| **the axes** | `conformance/media.json`, `conformance/signal.json` | the ten media with their properties and per-verb carriage; the five semantic values with what each channel renders them as |
| **the proof** | `conformance/manifest.json`, `conformance/cross-medium/spec.json` | 77 fixtures with known verdicts at levels one to three (level four holds none by design: a painted layout is the audit's, not a declaration's); and the cross-medium cases |

**Prose that explains rather than binds is not pinned** — `doc/THE-SECOND-FOUNDING.md`,
the findings, the evidence ledger. They are worth reading and they are not the standard.

## 3. Pinning, and why a version number is not enough

> **A version number says which edition you meant. A hash says the bytes you have are that
> edition.**

Vendor the twelve files, record `MANIFEST.json` beside them, and make
`zane pack --check` a step in your build. Then *"conforms to Zane v3.16"* is a claim your CI
can refute.

This is not paranoia; it is this project's own history. A single trailing space added to a
title inside `rules.json` leaves the version at v3.16 and changes the law's bytes. Every
drift recorded in `doc/EVIDENCE-LEDGER.md` came from something being **described** rather
than **checked** — a hand-typed census under a heading claiming it was computed, a prose
catalogue two diagnostics behind the data, a spec whose own title lagged a version.

**The manifest never regenerates itself.** `zane pack` writes it only when you run it without
`--check`, because a manifest that follows the tree automatically pins nothing.

## 4. Proving conformance

**Declare the level you satisfy; do not claim the level you want.**

| Level | Needs | Sees |
|---|---|---|
| 1 | the file alone | the grammar parses; unknown verbs, kinds, enumerations |
| 2 | the file alone | **the honest target for a standalone verifier** — everything decidable from one declaration |
| 3 | a symbol table you supply | entities, actors, state, elements — what a `.zane` file cannot know |
| 4 | a rendered surface | what only a painted page reveals |

Comparison is by **diagnostic id only** — never line numbers, message wording, ordering or
severity phrasing. **Phrase your prose in whatever language your operator reads.** A fixture
above your level is *skipped and recorded*, never failed: undecidable is silence, and
silence is never a pass.

Three separate claims, and they are not the same claim:

- **Conformance** — the fixtures agree. `conformance.js`.
- **Envelope conformance** — your findings travel in the C2 shape. Validated per fixture.
- **Cross-medium** — one declaration renders into two media and every difference is one the
  axes predicted. `cross-medium.js`. **This one does not pass today**, and the pack ships
  it saying so: of the suite's two pairs, visual against auditory is proved (every difference
  predicted) and visual against print is not, because `signal.json` records no rendering for
  print, so three of its differences are undecided rather than wrong. No drift is reported.

That last sentence is in the pack on purpose. **An instrument that reports what is missing
is worth more than one that passes by not looking.**

## 5. What you may claim, and what you may not

**May**: *"conforms to Zane v3.16 at level 2, verified against manifest `<hash>`."*
**May**: your own diagnostic codes, in your own words, in any language.
**May not**: extend a closed set. The 22 verbs, the ten media, the five semantic values,
the four enumerations and the ten declaration types are closed. **Adding to one is a
language change or a constitutional amendment, not an implementation choice** — and an
implementation that adds a verb is not a superset of Zane, it is a different language that
fails the fixtures.

**Retired numbers are never reused.** Rule 79 means the same thing in ten years; diagnostic
ids are stable forever. That is what makes a citation durable enough to build a court on.

## 6. Contributing — the law grows one way only

**Article VII, verbatim:**

> *The law grows only from evidence: real usage, operator feedback, documented failure
> analysis. Removing a protection requires proof the harm is gone; adding one requires
> proof the harm is real and recurring. Trends, fashion, and developer convenience are not
> grounds. Retired numbers are never reused.*

So a proposal is not an opinion with a rationale. It is a record:

1. **What happened** — the surface, the operator, the date. Not a hypothetical.
2. **The offense, and its lawful twin** — the two versions, differing as little as possible.
3. **Why it generalises** — beyond your product, your framework, your industry.
4. **Whether a reviewer could decide it yes-or-no**, and which instrument could ever measure
   it. A rule nobody can adjudicate is a preference.
5. **Which existing rule already covers it.** *"Already covered"* is a good outcome and a
   better one than a near-duplicate. Two of the five candidates in the most recent
   amendment pass were rejected exactly this way, and the rules that already carried them
   were extended instead.

The worked example is `doc/AMENDMENT-DOCKET.md`: three passes, twenty-one rulings, including
the drafting errors each pass caught in itself.

## 7. The open question: what should this standard be called from outside?

**RULED 2026-08-18 by the Principal** (`STZZUI-IDENTITY-4`), and the ruling is a *trigger*
rather than a scheme:

> **The pack stays content-addressed. Buy a domain when the first outside citation is
> asked for.**

The reasoning, kept because it is the part that transfers: there is no outside consumer
yet and the pack's hashes already verify, so nothing is unresolved in practice; **a domain
is the cheapest upgrade and the only one that is also a standing commitment** — it must be
renewed forever and it dies with the payment; and a DOI needs a published artifact with an
institution behind it, which is a different decision taken at a different time.

**So this is now a condition to watch, not a question to re-ask.** The condition is
narrow and observable: *someone outside this family asks how to cite the law*. Until then
the section below stands as the analysis behind the ruling.

The URN recommendation is **not adopted** — it was offered and the ruling did not take it.
A URN that nothing resolves is a convention, and the pack already has one that verifies.

A standard other projects cite needs an identity that does not depend on one repository
host, one company, or one person's account. `constitution/rules.json` is currently cited by
path, which works inside the family and breaks the moment a stranger vendors it.

The shapes available, with the cost each carries:

| Option | Buys | Costs |
|---|---|---|
| a **URN** namespace, e.g. `urn:zane:law:3.16` | neutrality, no hosting, no renewal | needs registration to be more than a convention; nothing resolves it |
| a **domain** the artifacts resolve from | a real fetchable URL, versioned paths | someone owns and renews it forever; it dies with the payment |
| a **DOI** per version | citable in literature, permanent | a registration agency, a fee, and a workflow per release |
| **content addressing** — the manifest hash *is* the name | already true, costs nothing, cannot rot | unreadable, and says nothing about which edition is current |

**What this pack does today**: content addressing, because it is the only one already
paid for. `MANIFEST.json`'s hashes identify an edition exactly, and the version numbers
inside it say which edition a human meant.

**The recommendation as it was offered**, superseded above: a URN namespace for citation
plus content addressing for verification, and no domain until something outside this family
actually needs to fetch the law over HTTP. **The ruling kept the second half and declined
the first** — content addressing plus a trigger, and no URN. *A domain bought early is a
dependency acquired early* was the argument that survived.

## Honest boundaries

- **No implementation other than this repository's has ever run these fixtures.** The claim
  that any language can prove agreement is a claim about the pack's shape, not an
  observation. It stops being theoretical the first time someone else runs it.
- **Level 3 needs a symbol table nobody has standardised.** The pack says what the four
  cross-pillar checks need; it does not define the format you supply it in.
- **`LAYOUT_DISPLACEMENT` has no fixture** and never will: it is undecidable from a
  declaration. It is in the contract so an implementation knows it exists and knows it is
  the audit's, which is the enforcement ladder being honest rather than a gap.
- **The cross-medium claim is unproved**, per §4, and the pack states this rather than
  omitting the instrument.
- **Two of the ten media have an implementation.** Print, luminous, signage, haptic,
  spatial and voice are classified by property and have never rendered anything here.
