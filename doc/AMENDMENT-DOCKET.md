# Amendment docket — one ratification pass

**Status**: **three passes, all ruled and applied.** 2026-08-13 took twelve items to
`rules.json` v3.9; 2026-08-15 took the information-design harvest to **v3.10**; 2026-08-16
took the colour reconciliation to **v3.11**. Section S8 was opened *proposed and unruled*
and ruled the same day — its header is left as it was written, so the sequence is legible.
The *"nothing here is applied"* line this file carried until
2026-08-15 was true when written and false for two days after — noted rather than
smoothed, in keeping with the version-drift note that follows.
**Why a docket**: StzZui's core asset is a constitution, so most of its "refactoring" is
**legislation, not implementation**. Six scattered amendment requests is six interruptions;
this is one sitting. The genre follows the reference design's own ratification record.
**Date**: opened 2026-08-12; **C-2 added 2026-08-13**.
**Law as it stands**: **v3.12, 123 rules** — updated 2026-11-02 (v3.11, 122 rules, until then). This line has now been
wrong twice and is kept as its own record: it read *v3.8.0* while the law was still
v3.7.3, corrected 2026-08-12; it then read *v3.8, 118 rules* through the whole of v3.9.
The drift is noted rather than smoothed.

> **Numbering note, 2026-08-12.** Rule **126**, *Foreign Data Says It Is Foreign*, was
> canonized outside this docket on the author's direct ruling, and the law is now v3.8.
> It was renumbered from 125 to 126 because **N-1 below had already reserved 125** — a
> proposed number is not a free number. N-1 keeps 125. A canonization landing outside the
> docket is a departure from this document's own premise (one sitting, not six
> interruptions); it is recorded here so the pass on N-1 is not made against a stale
> picture of the law.

**How to rule**: per item — *adopt as written* · *adopt amended* · *defer* · *reject*.
A rejection with its reason on record is as useful as an adoption.

---

# RATIFICATION RECORD — 2026-08-13

**Ruled by the author, section by section, in one pass. Twelve items, twelve rulings.
Nothing deferred, nothing rejected.**

| # | Ruling | Class |
|---|---|---|
| **C-1** | **Adopted as written** — instrument pointers added to Rules 3, 87, 117, 118, 56 | correction |
| **C-2** | **Adopted as a commission** — the review is authorized; **nothing is written into `rules.json`** until the IEC 60073 / ISO 3864 / ISO 7010 editions are read and clauses recorded | correction, pending |
| **P-1** | **Adopted, tier corrected**: Rule 62 `machine-later` → **`tool`**, not `machine` | promotion |
| **A-1** | **Adopted now** — Rule 82 becomes **Perceivable State** | amendment |
| **A-2** | **Adopted as a correction** — Rule 60 restated medium-neutrally, ARIA named as its web realization | correction |
| **A-3** | **Adopted (a)** — Rule 69 renamed to what it governs; the haptic law waits for device evidence | correction |
| **A-4** | **Adopted as a correction** — Rule 104 extended to three beneficiaries | correction |
| **A-5** | **Adopted, without adding a value** — see below | correction |
| **A-6** | **Adopted, bound to Rule 122** — the sixteenth forbidden pattern, and the first cultural one | amendment |
| **A-7** | **Adopted, effective when `stzSense` can serve it** — Rule 56 across cultures | amendment, deferred effect |
| **A-8** | **Adopted as written** — Rule 64 gains what must *not* mirror | amendment |
| **N-1** | **Canonized, scoped** — Rule 125, narrowed to channels that demonstrably cannot meet Rule 18's budget | canonization |

## Two drafting errors the pass itself caught

Recorded because the point of a section-by-section pass is to find these, and both would
have entered the law had the docket been adopted wholesale.

**P-1 named the wrong tier.** I proposed `machine`, which means *the declaration checker
refuses it*. A `.zui` file contains no colours, so `zui check` can never enforce Rule 62.
`StzIsLegible` is a **runnable check in a repository** — the lineage's own definition of
`tool`, and where Rule 105 already sits. Adopting as drafted would have placed a rule in a
tier no instrument could serve.

**A-5 claimed a value had to be added.** It does not. Rule 118 is titled *Two Families of
Colour*: family one is the five semantic statuses, **family two is neutral metadata**. So
the engine's `:Neutral` is family two — already legislated — not a missing sixth status.
And `:Primary` maps to Rule 3's *"one primary accent color per application"*, which is a
**quantity** rule about identity colour, not a status semantic. The reconciliation is
therefore `Error` → `danger` and nothing more: **the closed set stays at five, and the
vocabulary `stzEarcons` already adopted needs no revision.**

## Version arithmetic

Substance moved — P-1, A-1, A-6, A-7, A-8 and N-1 — so this is not a patch.

> **`rules.json` v3.8 → v3.9 · 118 rules → 119 · 15 forbidden patterns → 16.**

A consumer pinned at v3.8 keeps everything it had; the corrections alone would have been
v3.8.1, and are carried inside v3.9.

## What is authorized, and what is not

**Authorized for application**: C-1, P-1, A-1, A-2, A-3, A-4, A-5, A-6, A-8, and N-1 as
scoped.

**Authorized but not yet writable**: **C-2** — adoption means *commission the review*, and
the `corroboration` field is written only after the editions are read. **A-7** — ruled, and
binding when a meaning→rendering path exists to obey it; recorded in the rule with its
effective condition, so the law does not oblige machinery nobody has built.

## APPLIED — 2026-08-13, `rules.json` **v3.8 → v3.9**

Twenty changes. **119 rules · 16 forbidden patterns · `tool` 5 → 6.** The conformance suite
still passes **30/30 at level 4**, and no diagnostic's verdict moved.

Four notes from the application, none of which needed a further ruling:

1. **Rule 117 deliberately received no instrument pointer.** C-1 named it, but nothing
   counts colour columns yet — and a pointer to an instrument that does not exist is worse
   than silence. Recorded rather than invented; it gets one when M4 builds the counter.
2. **`INVISIBLE_STATE` now names a concept its rule no longer uses.** The diagnostic cites
   Rule 82, whose title is now *Perceivable State*. Diagnostic ids are stable forever and
   are never renamed, so it stays — but the drift between id and rule title is real and is
   noted here rather than left to be rediscovered.
3. **`conformance/violations.json` still pins constitution 3.8**, and that is correct
   behaviour, not an oversight: a consumer moves its pin deliberately. The v3.8.0 lineage
   set the precedent by leaving manifests *"stamped at the version they were verified
   against."* Re-pinning is its own act.
4. **The two tier moves cancel.** Rule 62 left `machine-later` for `tool`; Rule 125 entered
   at `machine-later`. So `machine-later` stays at 25 and only `tool` changes — and the
   finding the whole Second Founding rests on is unmoved: **8% of the law is refusable
   before a pixel exists.**

**Wording applied, and open to revision** — the rulings fixed what each must *do*, not how
it reads. Rule 69's new title is **"The Hand Is Not a Mouse"**, echoing Rule 119's cadence
and covering targets and gestures both. Rule 60, Rule 104, Rule 56, Rule 64, Rule 125 and
the sixteenth forbidden pattern were drafted to the ruling and can be re-worded without
re-ruling.

---

## Why this is the bottleneck

The programme's Track 0 was written as "start now, unratified". That was half right. Of
its four items, three turn out to be **constitutional acts** under this project's own
versioning rule — *"`MAJOR.MINOR` moves when the law's substance moves — a rule canonized,
amended, retired, **or promoted up the enforcement ladder**"* — and therefore the author's,
not a session's. The genuinely unblocked work is smaller than the plan claimed, and it is
listed in §6.

**Meanwhile the debts have started running the other way.** The sound plane has shipped a
semantic layer that cites Rule 118 by number, adopts the law's five values on the stated
ground that *"the vocabulary is not this plane's to choose"*, and reports a measurement
against Rule 18. The law does not cite it back, does not know its instruments exist, and
has no rule for what it found.

---

## Part 1 — Corrections (no substance moves; patch component)

### C-1 · The reciprocal pointers

Rules 3, 87, 117, 118 and 56 legislate colour and name no instrument. Rules 62 and 105
name `tools/ui-audit.html`. Two instruments now exist elsewhere in the family and the law
is silent about both: `StzIsLegible` / `StzContrastOf` (`stzlib/…/graphics/stzColor.ring:324`)
and `stzEarcons` (`stzlib/…/sound/stzEarcons.ring`).

Add `lint`-style instrument pointers only. **No requirement changes** — this is the same
class of act as v3.7.1, which corrected a stale pointer and moved nothing else.

**Verdict**: correction. **Cost**: an hour. **Unblocks**: S3, and the next drift.

### C-2 · Rule 118 — the industrial-safety corroboration

**Gated on a standards review. Do not adopt on this document's word.**

**What.** Record that the machine-indicator and safety-sign standards — the IEC 60073 /
ISO 3864 / ISO 7010 family — independently assign meanings to indicator colours and sign
geometry that appear to land close to Rule 118's five semantic values: broadly red for
danger or emergency stop, amber or yellow for caution and abnormal conditions, green for
safe or normal, blue for mandatory.

**Why it is worth a docket entry.** Rule 118's evidence today is *one* source: a banking
supervision product's two coloured columns, April 2026 — one product, one domain, one
month. If the convergence holds, the rule gains support from an unrelated domain, derived
from different evidence (machine safety and injury data), settled decades earlier, and
enforced by inspection rather than by taste. **That would make Rule 118 the best-supported
rule in this constitution**, and it matters because Rule 118 is `invariant: true` and is
now carrying two channels — the colour engine and, since 2026-08-12, `stzEarcons`.

**The discipline problem, and how to avoid it.** The architecture is explicit: *"Evidence
is never corrected… rewriting it to match today's vocabulary would destroy the trail
Article VII depends on."* Two ways to record this:

- **(a)** Append a dated clause to `evidence`. Touches a protected field, and invites
  exactly the editing the rule forbids.
- **(b) — recommended.** A new `corroboration` field, leaving `evidence` **byte-identical**.
  Precedent exists: `lint`, `absorbs` and `note` already appear on some rules and not
  others, so the schema is additive by practice, and a consumer ignores fields it does not
  read. The trail stays intact and the support is still recorded.

**Verdict**: correction — no requirement changes, patch component — **conditional on
verification**.

**What verification means**, concretely: read the current editions; confirm the
colour-meaning assignments and, critically, their *scope* — indicators, actuators and
signage are governed differently and the distinction is load-bearing; record edition and
clause. **Nothing in this project may cite a statute it has not read**, and the claim
above is stated at the level of the scheme, which is the level of confidence actually
held.

**Both outcomes are useful, and that is why the item is safe to file.** If the values
converge, C-2 is adopted and Rule 118 is unusually well founded. If they diverge
materially, this is **not a failed item** — it is a *finding against Rule 118*, and
possibly a tier-0 statutory conflict under founding §8, which would be considerably more
important than the corroboration would have been. Either way the review pays.

**Scope note**: Rule 3 (*Color Is a Signal*) is arguably corroborated by the same source
and is deliberately left out. It is being amended anyway under A-5, and stacking a
second change on a rule mid-amendment is how records get tangled.

---

## Part 2 — Ladder promotion (MINOR)

### P-1 · Rule 62, Contrast & Legibility · `machine-later` → `machine`

The rule requires 4.5:1. `StzIsLegible(text, bg)` returns exactly that against
`StzContrastMinimumBodyText()` = 4.5, is CI-gated, and passes 42/42 theme/role pairs.

**No interface lawful before becomes unlawful after** — the requirement is unchanged and
only the tier claim moves. But the versioning rule names ladder promotion explicitly as a
substance move, so this is a **MINOR bump, not a patch**, and it is the author's act.

**Verdict**: promotion, MINOR. **Evidence**: the instrument and its gate.
**Risk**: none identified — the law would be claiming an enforcement it can now
demonstrate, which is the direction the enforcement ladder is built to travel.

---

## Part 3 — Amendments (MINOR)

Each fails the substance test — an interface lawful before becomes unlawful after — so
each needs evidence under Article VII, and each is genuinely contestable.

### A-1 · Rule 82: **Visible State → Perceivable State**

`machine` tier today, and medium-bound in both title and body (*"the user must see it"*).
A voice or audio-only surface escapes it entirely — it can hold state the operator must
know and satisfy the rule by rendering nothing, because there is nothing to see.

Proposed: the requirement becomes *perceivable in the medium the surface declares*, with
visibility as its visual realization. **Evidence**: the corpus scan — across 118 rules,
`sound`, `speech`, `earcon`, `tactile` and `ambient` never appear; the law has no
vocabulary for a state it cannot show.

**Cost**: real. Every non-visual surface acquires an obligation it did not have.
**This is the load-bearing amendment of the medium axis.** If it is rejected, the axis is
decorative and §6 of the founding document should be withdrawn rather than weakened.

### A-2 · Rule 60: Screen Reader Harmony, restated medium-neutrally

The only rule about how an interface is *heard* is written in `<main>`, `<nav>`,
`aria-label`, `aria-live` — one framework's vocabulary, inside a constitution whose
preamble promises *"framework-agnostic"*. It cannot govern a voice assistant, a phone
tree, a car, or any screen reader outside the web.

Proposed: the requirement stated in terms of semantic landmarks, labelled controls and
non-interrupting updates; ARIA named as its **web realization**, not as the rule.

**Verdict**: arguably a correction — the web requirement is unchanged — but it *widens*
who must comply, so it is filed as an amendment. **The author may reasonably rule it a
correction**, which would make it cheaper and faster.

### A-3 · Rule 69: Haptic Rhythm reconciled with itself

The title promises a haptic law; the body is 48px touch targets, overscroll bounce and
swipe actions. Two ways out, and they cost differently:

- **(a) Rename** the rule to what it does — *correction*, nothing required changes.
- **(b) Write the haptic body** it promises — *amendment*, and it needs evidence from a
  device the family actually ships.

**Recommended: (a) now, (b) when MicroRing has evidence.** A law should not hold a title
open for a rule it has not written.

### A-4 · Rule 104: Machine Legibility, extended to three beneficiaries

The rule already says *"accessibility law and agent-interop law are one body of law with
two beneficiaries… what a screen reader can operate, an agent can operate."* The medium
axis adds the third: **and a non-visual medium can render.**

**Verdict**: arguably a correction — the required structure is identical and only the
stated beneficiaries widen. Filed here because it is the sentence the whole
multi-modality argument rests on and deserves a deliberate ruling.

### A-5 · Rules 3 and 118 reconciled — **and the evidence has changed**

Three vocabularies existed for five values. **Two of the three now agree.** The sound
plane adopted the law's `danger · warning · info · success · muted` and refused to invent
its own. The outlier is the colour engine (`:Primary :Success :Warning :Danger :Info
:Neutral`) and Rule 3's own older `Neutral · Accent · Warning · Error`.

Two sub-rulings, and the second is no longer open research:

- **`Error` → `danger`.** Rule 3's wording predates Rule 118, which is the `invariant`
  rule and the richer one. Naming only. **Correction.**
- **`muted` vs `:Neutral` — settled by evidence as two concepts, not two spellings.**
  Forced to render `muted`, the sound plane found the answer is **silence**, reasoning
  that *"muted means waiting or inactive; a sound announcing inactivity is a
  contradiction."* A state renders as silence; an absence of semantic charge does not.
  So the colour engine's `:Neutral` is a **sixth thing** — the resting default — and
  reconciliation **adds a value rather than renaming one**. **Amendment.**

**Verdict**: one correction, one amendment. **This is the item to rule on first**, because
the sound session is building against it right now.

### A-6 · A forbidden pattern for conscripted signs · *added 2026-08-13*

The constitution carries **fifteen forbidden patterns and not one is cultural.** Propose a
sixteenth:

```
id:        sovereign-sign-as-label
title:     A sovereign sign conscripted as a convenience label
violates:  ["122"]        — or a companion rule; see below
```

**Statement.** A sign that denotes sovereignty, faith or political identity must never be
conscripted as a label for something else. The canonical instance names the class:
**a flag is not a language.**

**Evidence.** Arabic is official in some twenty-odd states; so with French, Spanish,
Portuguese and English. Choosing one flag to denote one language selects a *state* to
stand for a *tongue*, and the interface thereby makes a political claim on its owner's
behalf without anyone deciding to. Shipped to a ministry whose relations with that state
are poor, the software has issued a diplomatic statement its authors never wrote.
**This is the only forbidden pattern in the list whose violation can end a contract
rather than annoy an operator.**

**The wording must forbid conscription, not use.** A national flag is the *correct* sign
for country of registration on a customs form. The defect is using a sovereign sign to
mean something it does not denote. A pattern drafted loosely here would forbid legitimate
use and be rightly ignored — which is worse than not having it.

**Which rule does it violate?** Rule 122, *Language Is Data*, is closest: it already
requires a per-language dictionary and a *registered locale*, which implies a language is
identified by a locale code and not by a banner. Two options: bind the pattern to 122 as
an unstated consequence, or canonize a companion rule so the pattern points at something
written. **Recommended: bind to 122 now**, and let a companion rule follow if the capture
loop produces more instances of the class.

**Verdict**: amendment, MINOR. An interface lawful before — 122 nowhere says *flag* —
becomes unlawful after.

**Not filed, and why.** The wider hazard class (disputed borders and place names, religious
symbols as category icons, gestures and their emoji, sectarian colour, assumed weekends,
name models) is real and is deliberately **not** drafted here. It needs review by people
who live inside those readings; a hazard list written from outside is the failure it warns
about. The capture loop of founding §8.1 is the right instrument, and this pattern is the
one case confident enough to file today.

### A-7 · Rule 56: semantic preservation across **cultures**, not only themes · *added 2026-08-13*

Rule 56, *Semantic Preservation*, is `invariant: true` and already carries the whole
argument in its `why`: **"Meaning must survive theming, or color was never a signal."**

It says *theming*. Culture is the same claim one axis over: a meaning that survives dark
mode and does not survive a reader is equally not a signal. Proposed: the requirement
becomes *meaning survives theming and audience alike*, so that what a declaration fixes is
the **meaning**, and the rendering is derived per theme, per medium and per culture.

**Evidence.** `stzDiagramColor.ring:45` binds `:Success` to green and `:Danger` to red in
a table labelled an *"abstraction layer"* — the exact pair that inverts in Chinese,
Japanese, Korean and Taiwanese financial convention. Under Rule 56 as written, that table
is lawful, because nothing about theming is broken. Under the amendment it is not.

**Note in passing, and it is slightly awkward**: Rule 56's own text names *Gold* and
*Oxblood* as the renderings of warning and error. Those are renderings, in a rule about
meaning outliving renderings. Whether to lift them into examples is the author's call, and
it is the kind of thing this amendment will keep surfacing.

**Verdict**: amendment, MINOR. An interface lawful before — hard-coding a rendering that
themes correctly — becomes unlawful after. **Cost is real**: it obliges a derivation path
that does not exist yet, so it should probably be ruled *adopt, effective when `stzCulture`
can serve it* rather than adopted bare.

### A-8 · Rule 64: what must **not** mirror · *added 2026-08-13*

Rule 64, *Right-to-Left Logic*, mirrors the layout axis for RTL and reasons correctly that
*"calm that only flows left-to-right is not calm; it is locale bias."* It is silent on the
converse, which is where the real defects live: **some things must not mirror.** Clocks,
media transport controls, numerals within a number, and any progress that encodes a
physical direction stay as they are, in every script.

**Verdict**: amendment, MINOR — a mirrored clock was lawful before. Smaller and safer than
A-7, and independently useful whether or not the cultural axis is ratified at all.

### Not a docket matter

**Whether culture becomes a numbered horizontal contract (C8) is not a constitutional
act** and does not belong here. The docket holds acts against `rules.json`; a family
contract lands in `REFERENCE_DESIGN.md` by that document's own amendment process. It is
recorded as decision 3 of the programme plan.

### Candidates noted, not filed

- **Article VI's terminology.** *Culture* in this constitution means an interaction
  culture — a vibe. The cultural axis needs its own word (`CONVENTION` proposed) and
  Article VI may want a clarifying note so the two never merge. Core-level; the author's.
- **`stzDiagramColor.ring:45` — not a law item.** The engine's
  `$acColorsBySemanticMeaning` table hard-codes `:Success = "green"` and
  `:Danger = "red"`, the exact pair that inverts in Chinese, Japanese, Korean and
  Taiwanese financial convention. That is a finding for the graphics plane, filed in the
  programme rather than here, because no rule needs to change for it to be a defect.

---

## Part 4 — Canonization candidate (MINOR)

### N-1 · Rule 125 — *Sound Corroborates, It Does Not Acknowledge*

The first rule in this constitution proposed from **a sibling plane's measurement**. It is
the contribution loop of founding §8.1 working before the loop has been built, which is
itself worth recording.

```
id:           sound-corroborates
number:       125
title:        Sound Corroborates, It Does Not Acknowledge
derived_from: visible          (author's call — "calm" is defensible)
enforcement:  machine-later    (decidable once a surface declares its medium)
invariant:    true
```

**Solution (draft)** — An act is acknowledged in a channel that can meet Rule 18's
hundred milliseconds. On every audio pipeline measured, sound cannot: the earcon arrives
hundreds of milliseconds after the act, by which time it is heard as a separate event
rather than as the act landing. So a sound may **corroborate** an acknowledgement the
operator has already received elsewhere, and may never **be** it. A surface whose only
acknowledgement is audible has not acknowledged.

**Why** — Feedback that arrives after causality has faded is not feedback; it is news.

**Evidence** — The sound plane measured **419 ms** from `Fire()` to ear on a
Windows/WASAPI pipeline — 329 ms of ring plus ~90 ms of device and OS — against Rule 18's
100 ms, and concluded in its own words: *"the sound is not the acknowledgement. The screen
is. The sound corroborates."* (`stzEarcons.ring`, `SOFTANZA_SOUND_PLAN.md` §S.5,
2026-08-12.)

**Contest it here**: the measurement is one pipeline, one OS, one device class. A rule
canonized from a single platform's latency is exactly the kind of over-generalisation
Article VII exists to prevent. The honest options are to canonize it as written, to
canonize it scoped to pipelines that cannot meet the budget, or to **defer until a second
platform is measured** — and deferring costs nothing, because no one is shipping audio
acknowledgement today.

---

## Part 5 — Version arithmetic

| Adopted | Law becomes |
|---|---|
| Part 1 only (C-1, C-2) | **v3.8.1** — corrections, one file, consumers keep their pin |
| + any of P-1, A-1…A-8, N-1 | **v3.9.0** — substance moved |
| + A-6 | 16 forbidden patterns; the first cultural one |
| + N-1 | 118 rules; number 125 burned into use, never reused |

C-2 adds a field rather than changing one, and C-1 adds pointers. Neither moves a
requirement, so both sit in the patch component with v3.7.1's precedent.

Consumers pinned at v3.8.0 lose nothing by staying there through Part 1 alone. That is
what the patch component is for.

## Part 6 — What is genuinely unblocked without any ruling

Small, and worth naming honestly rather than padding:

1. **The book's evidence ledger.** Findings are arriving faster than they are being
   recorded — the 419 ms measurement, muted-as-silence, the three-way vocabulary drift.
   A ledger that captures each with its date and source costs nothing and prevents the
   book being reconstructed from memory later.
2. **The site telling the truth about enforcement.** The site says 118 rules and does not
   say that 9 are machine-enforced, 5 tool-enforced, 25 awaiting an instrument and 78
   judgement. Generated from `rules.json`, this changes no law and makes the project's
   central argument visible.
3. **Nothing in `tools/zui/`.** The verifier cannot express any of this until a stratum
   grammar exists, and inventing one before ratification would be the trap of founding
   §7.1. The codebase correctly waits.

## Honest boundaries

- **Nothing here is applied**, and the three sibling-derived items (C-1, A-5, N-1) rest on
  a plane whose owner has agreed to none of it.
- **C-2 is the only item resting on a source this project has not read.** It is filed as a
  review to commission, not a fact to adopt, and it is the one item that could return the
  opposite of what it proposes. Ruling "adopt" on it should mean "commission the review",
  never "write it in".
- **N-1 rests on one measurement, on one platform.** It is filed as a candidate because
  the evidence is real and dated, not because the case is closed.
- **A-1 is the amendment that matters.** The others are hygiene by comparison; A-1 is
  where the medium axis either becomes law or does not.
- **This docket assumes the Second Founding's direction** without assuming its ratification.
  If the vision is rejected, C-1, P-1, A-3(a) and A-5's correction still stand on their
  own evidence; A-1, A-4 and N-1 fall with it.

---

# SECOND PASS — 2026-08-15 · the information-design harvest

**Source**: [`softanza/prompts/28-stzzui-information-design-rules.md`](../../softanza/prompts/28-stzzui-information-design-rules.md).
Softanza Central built a status dashboard, had two versions rejected by its author, and
handed over the corrections as evidence. **Central edited nothing in the law and proposed
no wording** — it found the material, named five candidates, and said plainly that
rejecting a candidate as already-covered would be a good outcome.

**Applied to `rules.json` v3.9 → v3.10.** Five candidates, five rulings: **three canonized,
two rejected as already law and folded into the rules that carried them.**

| # | Candidate | Ruling |
|---|---|---|
| **1** | A data table declares its columns | **Canonized — Rule 127**, `machine` |
| **2** | A row names its subject before its state | **Rejected as new law — already Rule 113**, which is extended |
| **3** | A status row ends in the action it requires | **Rejected as new law — already Rule 82**, which is extended |
| **4** | One fact, one encoding | **Canonized — Rule 128**, `judgment` |
| **5** | The action survives width pressure | **Canonized — Rule 129**, `tool` |

## The two rejections, which are the more useful half

**Candidate 2 was already law, and better law than the candidate.** **Rule 113, Labels
Follow Their Subject**, already forbids *"status markers placed before the name they
qualify"* and already gives the reason in the stronger form: *"assistive technology hears
the name before the verdict."* The candidate was that principle at column scale. A new
number would have been a near-duplicate of a rule that says it better, so Rule 113 gains
the table-row case in its `avoid` list and one sentence in its solution. **The author's
correction and Rule 113 are the same law, reached twice.**

**Candidate 3 was already law, and Central guessed the right home.** Rule 82 became
*Perceivable State* at v3.9: *if the system knows something important, the operator must
be able to perceive it.* An outstanding obligation is state of exactly that kind. Rule 82's
solution now says so — every row of a summary surface states what it requires, or states
that it requires nothing.

This answers the question Central asked directly: **does the action column belong to the
constitution?** The *column* does not; a surface may express an obligation any way it
likes. What belongs is the **perceivability of the obligation** — the operator must never
have to deduce from a number whether a row is asking something of them.

## Two corrections to the prompt's own reading of the law

Recorded because Central asked to be told, and because both change what the evidence proves.

**Rule 95 does not reach a desktop dashboard.** It lives in **Set 30, The Field Vibe**,
whose description reads *"these rules govern the field/touch vibe"*, and its own solution
says *"in the field vibe"* and *"it is not a table **here**"*. Central cited it against a
desktop tool and reached the right outcome under a rule that does not bind. Rule 95 now
states its own scope and points to Rule 129 for the general case.

**Rule 14 already forbade the thing that caused the defect.** *No App-Squeezing* lists
`overflow: auto` on table containers in its `avoid` and calls internal scrollbars *"a
failure of information architecture"* — general law, not field-vibe law. Central's
`overflow-x:auto` wrapper violated **Rule 14** on the day it was written. The rule was read
as vertical-only, so it now says the prohibition covers the horizontal axis too, where the
consequence is worse.

**So the gap was narrower than the prompt supposed, and sharper.** The prohibition existed;
what no rule stated is **which column survives when width genuinely runs out** — and that
is the whole of Rule 129.

## Rule 129, and why it is `tool` rather than `judgment`

The measurable half is measurable: zero horizontally scrolling elements, and every cell of
the actionable column inside the viewport at 375 pixels. **Central ran exactly that check**
and reported 26 of 26 action cells fully visible. That is the lineage's own definition of
`tool` — a runnable check in a repository — and the precedent is Rule 62, moved to `tool`
in the first pass for the same reason.

Rule 129 also names the trap explicitly, on Central's advice. Rule 95's `avoid` entry
*"tables forced into phone lists"* is four words, and the pattern it forbids is the single
most common answer on the open web. **Central read that rule and walked into it anyway,
within an hour of being corrected for the opposite failure.** The wording now spells the
remedy out rather than trusting a four-word prohibition to hold against the industry
default.

## Version arithmetic

Substance moved — three canonizations and a forbidden pattern — so this is not a patch. A
table that was lawful yesterday without a header row is unlawful today.

> **`rules.json` v3.9 → v3.10 · 119 rules → 122 · 16 forbidden patterns → 17 ·
> `machine` 9 → 10 · `tool` 6 → 7 · `judgment` 79 → 80.**

**The two data artifacts were re-pinned to 3.10**, and that is a deliberate act rather than
a sweep: all 30 rule, article and forbidden-pattern references in
`conformance/violations.json` were resolved against the new law first, and no diagnostic's
binding moved. The first pass's note 3 set the rule — *"a consumer moves its pin
deliberately"* — and this is that act performed, not skipped.

**Suite 34/34 at level 4, unchanged.** No diagnostic, verb, medium or verdict moved.

## Honest boundaries on this pass

- **Three new numbers from one surface is a lot**, and the risk is corpus inflation. The
  defence is that two of five candidates were rejected, each survivor has a distinct
  documented failure, and the source is an operator correcting his own daily tool rather
  than a designer reasoning in the abstract. If any one is weakest it is **128**, whose
  principle Rule 1 and Rule 50 already imply — it is canonized because neither *states*
  it, and a reviewer citing Rule 50 against a progress bar would be stretching a
  widget-selection rule past its subject.
- **Rule 127 is `machine` on a lint nobody has written.** The check is trivial — a table
  with body rows and no `<th>` — but the instrument is the HTML linter, not `zui check`,
  and a `.zui` file has no tables. The tier is honest about which instrument owes the
  check; it is not a claim that the check runs today.
- **Rule 129's second half is not measurable without a declaration.** An auditor can prove
  nothing is clipped; proving *the actionable column* survived needs the surface to say
  which column that is. Rule 117 already names the concept; nothing declares it yet.
- **The evidence is one surface, one operator, one implementer.** It is unusually clean
  because nobody was consulting the law while the violations happened, but it is not a
  corpus.

---

# SECTION S8 — OPEN, PROPOSED, UNRULED · opened 2026-08-16

**Nothing in this section is applied.** It was found while doing S8's extraction work —
publishing the `SIGNAL` vocabulary as data, in the shape S5 used for media. The extraction
is committed as [`conformance/signal.json`](../conformance/signal.json); these four items
are what the extraction could not resolve without legislating.

**Why it surfaced now.** M6 in the founding's sequencing reads *"SIGNAL in the visual
channel, zero new design: Rules 3 ↔ 118 ↔ the engine."* Two thirds of that were cashed
already — Rule 62 was bound to `StzIsLegible` at v3.9, and the engine's missing `:Muted`
was filed on 2026-08-13. **The remaining third was Rules 3 ↔ 118, and nobody had actually
put the two rules side by side.** They disagree.

| # | Conflict | Class |
|---|---|---|
| **S8-1** | `danger`'s scope — *system failure only* vs *critical, exceeded, incident* | substantive |
| **S8-2** | `neutral` means two different things | substantive |
| **S8-3** | Is `accent` a third family Rule 118 forbids? | structural |
| **S8-4** | Neither rule points at the other | editorial |

## S8-1 · `danger` — the two rules give opposite verdicts on a common case

**Rule 3**: *"Danger → system failure only."* **Rule 118**: *"danger (critical, exceeded,
incident)."*

An exceeded business threshold — a credit limit passed, a tolerance breached — is an
**incident**, and it is emphatically **not a system failure**. So a surface colouring it
`danger` **obeys Rule 118 and violates Rule 3**. This is not a shade of emphasis; it is the
single most common use of the colour in business software, and the law answers it twice,
differently.

**Recommendation, offered not assumed**: Rule 118 wins on the merits. It is the specific,
later, five-value rule; it is the one both sibling planes implemented; and *"system failure
only"* would forbid the colour in exactly the domain this constitution was written for.
Rule 3's clause should narrow to identity and quantity — *one primary accent per
application* — and stop enumerating status meanings that Rule 118 owns.

## S8-2 · `neutral` — one word, two meanings, and the engine answers only one

**Rule 3**: *"Neutral → default state"* — chrome; the resting appearance of an untouched
control. **Rule 118, family two**: *"neutral metadata: channels, types, categories"* — data
colour that carries no urgency.

These are different things. A table cell tinted for *category* and a button at rest are not
the same use of the same word, and `StzThemeColor(theme, :neutral)` returns one colour for
both. An implementer reading both rules cannot tell which `:Neutral` they are building —
and the engine, having only one, has silently chosen.

## S8-3 · `accent` — the closure claim is the thing that is unclear

**Rule 118**: *"An interface's colours split into exactly two families and no more."*
**Rule 3**: *"Accent → intent (action, selection)"*, and *"one primary accent color per
application."*

Accent is neither a semantic status nor neutral metadata. So either it is a **third family
Rule 118 forbids**, or **Rule 118's "exactly two" silently means "exactly two families of
*data* colour"** and excludes chrome. **The law does not say which**, and this is the item
that matters most, because it is the closure claim itself — the same claim that makes the
vocabulary finite and therefore checkable.

The v3.9 pass touched the edge of this without settling it: A-5 ruled that the engine's
`:Primary` maps to Rule 3's accent and is *"a quantity rule about identity colour, not a
status semantic"*. **That resolved the engine's name. It did not resolve the taxonomy.**

## S8-4 · Neither rule points at the other

Rule 3 enumerates four colour usages and names none of `success`, `info` or `muted`.
Rule 118 enumerates five statuses and names no accent. **A reader arriving at either
believes they have the whole vocabulary** — which is why the three conflicts above survived
118 rules, two ratification passes and two implementing planes without being noticed.

Whatever is ruled on S8-1 to S8-3, both rules should cite the other. C-1 established the
pattern at v3.9 with instrument pointers; this is the same move between two rules that
legislate one subject.

## What is NOT proposed here

- **No sixth value.** The closed set stays at five, as A-5 ruled.
- **No change to the five meanings.** They are quoted verbatim into `signal.json` and both
  planes already implement against them.
- **No new rule.** Every item above is a conflict between two existing rules, and the fix
  in each case is a narrowing or a cross-reference, not a canonization.

## Honest boundaries

- **The recommendation on S8-1 is mine, not a finding.** The conflict is verified; which
  rule should yield is a judgement the author makes.
- **`invariant: true` does not settle any of this.** Rule 118 carries it and Rule 3 does
  not, which looks like precedence and is not: the Reader defines the badge as *"this rule
  never flexes across vibes"*. **The constitution has no precedence mechanism at all** —
  which is itself worth knowing, and is arguably the deeper finding in this section.
- **Nothing here blocks `signal.json`.** The artifact records the conflicts rather than
  resolving them, so it is publishable and useful today; a ruling would let it drop the
  `openConflicts` block, not rewrite the vocabulary.

## RULED — 2026-08-16, `rules.json` **v3.10 → v3.11**

**Four items, four rulings, delegated by the author** (*"I let you decide"*). Recorded as a
delegation rather than an authorial pass, because the difference matters to anyone reading
this record later.

| # | Ruling |
|---|---|
| **S8-1** | **Rule 118 governs.** Rule 3's status enumeration is removed |
| **S8-2** | **Both meanings are legitimate** and are now named apart inside Rule 118 |
| **S8-3** | **Rule 118's closure is over data colour**, and always was. Chrome is Rule 3's |
| **S8-4** | **Adopted** — both rules carry `see_also` |

### The division of labour, which is the whole ruling

> **Rule 3 owns chrome. Rule 118 owns what a colour means about a record.**

Everything else follows. Rule 3 keeps the resting palette, the single identity accent and
the restraint on gradients and shadows — and stops enumerating status meanings it was never
the right rule to hold. Rule 118 keeps the five statuses and family two, and now says what
its closure closes *over*.

**S8-1 went to Rule 118 on the merits, not by seniority.** It is the later and more
specific rule; it is what both implementing planes built against; and *"system failure
only"* forbade the colour in exactly the domain this constitution serves. A law for
business software that cannot colour an exceeded credit limit has mistaken its subject.

**S8-3 was the one that mattered**, and it is worth being plain about why. A closure claim
that does not say what it closes over cannot make a vocabulary checkable — and *checkable*
is the only thing this project has ever been trying to buy. Rule 118 said *"exactly two
families and no more"* while the engine shipped seven roles per theme, and both were right,
because they were closing over different sets. That is not a drafting slip; it is the
closure being unfalsifiable.

### Version arithmetic

Two rules amended. No rule canonized, retired or moved a tier.

> **`rules.json` v3.10 → v3.11 · 122 rules unchanged · 17 forbidden patterns unchanged ·
> every tier count unchanged.**

**Nothing lawful became unlawful.** The amendment widens where it moves at all: colouring
an exceeded threshold `danger` was forbidden by one rule and required by another, and is
now simply lawful. A consumer pinned at v3.10 loses nothing by moving.

**All four conformance artifacts re-pinned to 3.11** after the suite was run — and
`conformance/manifest.json` turned out to be pinned at **3.8**, three versions behind,
found only by grepping for the field. The suite it describes had passed against 3.9, 3.10
and 3.11 without anyone moving it. **Suite 34/34 at level 4**; no diagnostic, verb, medium
or verdict moved.

### What was deliberately not done

**No precedence mechanism was invented.** The four conflicts were settled by amending both
rules so they no longer overlap — *not* by deciding which outranks the other, because
nothing in this constitution can decide that. `invariant: true` looks like precedence and
is not; the Reader defines it as *"never flexes across vibes"*, and 46 of 122 rules carry
it.

**So the deeper finding survives this pass untouched**: two rules can still contradict each
other, and the only reason this pair was caught is that someone put them side by side by
hand. Whether the law should acquire a precedence rule — or a machine check for overlapping
subjects — is a constitutional question of a different order, and inventing one inside a
delegated ruling would be exactly the overreach this docket exists to prevent. **It is filed
here and nowhere else.**

---

## RULED — 2026-11-02, `rules.json` **v3.11 → v3.12**

**One item, ruled by the Principal's delegation** (D6, relayed by Central: *"decide"*, 2026-11-02 11:02).
Recorded as a delegation, as the v3.11 pass was.

| # | Ruling |
|---|---|
| **D6** | **`INTENT_ORPHAN` gets a rule.** `EXPRESSION_ORPHAN` and `VIBE_STRIPS_RIGHT` stay article-only |

### Where it came from

The coverage grid (`doc/design/COVERAGE.md`, 2026-11-01) found 37 diagnostics, of which 16 cite a rule, 9 cite an
article and no rule, and 12 cite nothing. Three of the article-only ones were worth asking about: the
founding check `INTENT_ORPHAN` (*every element traces to an intent*) and the two checks that guard the expression
strata. The Principal ruled that the first has a rule, and that the other two stay as they are.

### The rule

**Rule 130, Every Element Serves an Intent**, Set 29 (Declaration Governance), derived from Article II,
enforcement `machine` (Level 3: decided against an element inventory). Its evidence is the existing check and the
grid, not an observed defect, and the rule says so; that is the reverse of the usual order and is recorded
here for the same reason. It sits on the grid at **understand** and **decide**, medium scope **any**.
The ruling described the check as the *recover* row ("an intent nobody can reach"), which is the opposite direction
from what the check does (an element with no intent); the rule was written for the check, and
`COVERAGE.md` section 3c records the difference. An intent that no element carries is a separate defect, unchecked
today, and no rule is proposed for it.

### Version arithmetic

One rule canonized. No rule amended, retired or moved a tier. Number 130 is the next free one (129 was the last
in use; retired and burned numbers are never reused).

> **`rules.json` v3.11 → v3.12 · 122 rules → 123 · 17 forbidden patterns unchanged ·
> `machine` tier +1, every other tier count unchanged.**

**Nothing lawful became unlawful.** The verifier refused an element tracing to no intent before this rule existed;
the refusal now cites Rule 130 and Article II, where it cited Article II alone. `violations.json` v1.6 → v1.7
(the `INTENT_ORPHAN` binding), and the four other conformance artifacts re-pinned to 3.12 after the suite was run.
**Suite 71/71 at level 4**; no diagnostic, verb, medium or verdict moved.
