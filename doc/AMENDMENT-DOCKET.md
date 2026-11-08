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
**Law as it stands**: **v3.13, 123 rules** — updated 2026-11-03 (v3.12 until then; v3.11, 122 rules, before 2026-11-02). This line has now been
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

---

## RULED — 2026-11-03, navigation, shadow and toggle: one pass, `rules.json` v3.12 → v3.13 in several commits

**Ruled on the Principal's word** (*"close all the pending points on my behalf"*), after nine proposals were put beside the rules'
own words (outbox memo of 2026-11-03). The pass lands as separate commits, one per law change, and **the version moves to v3.13 once, in the last law commit**; until then the
law reads v3.12 and each commit passes conformance and `pack.js --check`. Rules 27, 106, 108, 10, 115, 116 and 120 change.

### Item 1 — four levels of navigation (STZZUI-FOURLEVELS-01): Rules 120, 27, 115

The author's ruling (prompt 53, 2026-10-16): level 1 the main top menu, level 2 a horizontal bar fixed on scroll, level 3 a left bar, level 4 (when needed) a right bar, no more
than five short labels in any horizontal menu.

- **Rule 120** now states its invariant, *the operator can tell at a glance which bar owns the page*, keeps the vertical turn as the default, and allows two horizontal levels where the second
  is a visibly distinct, fixed surface of at most five entries; the third level turns vertical on the left, a fourth stands on the right.
  **This reverses the literal text of Rule 120** ("the first level runs horizontal, the second runs vertical"), **on the author's own request (prompt 53)**, and is recorded as such here.
- **Rule 27** keeps 6-8 for application menus and states **five as the reading-site value**, for the main menu and any second horizontal bar.
- **Rule 115** says the path may be **distributed across the bars** if every depth sits on exactly one always-visible surface.

**The tool follows.** `tools/ui-audit.html` read the path only as a breadcrumb, where Rule 115 says "a path". It now also reads every always-visible navigation bar and checks that a bar
which lists an audited page is still shown, with the same entries, on that page. The finding quotes Rule 115 and says it is a judgment of the check, not a certainty. Run on
17 pages of the stzsite site the audit went from 27 findings to 29 (two new Rule 115 findings, both a family's head page that does not show the rail its children show); on the 15 pages of this
repository's site it stayed at 0. The Principal's desk ruled that the check ships as it is.

### Item 2 — a trail only where it names a level no bar marks (STZZUI-TRAILSCOPE-01): Rule 108

The author's ruling (prompt 54, 2026-10-16): *"The path should not be present in the case where only 3 levels are there (unnecessary duplication), just where it is needed."*

- **Rule 108**: a trail is owed on a page where it names a level that no always-visible bar marks, and not owed where every step it would show is already marked. The flat-surface exception was
  the same reasoning, and is now its plainest case. The avoid entry that named "Breadcrumbs that appear only on deep pages" is reworded, and the flat-surface entry generalised.
- **A condition, accepted from the Principal's desk:** where the visible trail is omitted, the path stays available to assistive technology as a labelled navigation landmark (Rules 60, 104). A breadcrumb is also a landmark
  a screen-reader user navigates by, so omitting it costs the sighted reader chrome and the screen-reader user nothing.

**The tool follows.** `tools/ui-audit.html` no longer reports a missing trail on a page that an always-visible bar marks; it reports instead that the path is not carried by a labelled navigation landmark. A page that no visible bar marks
still owes the trail. A trail hidden from assistive technology (`display:none`, `aria-hidden`) is not a landmark. **Limit:** a page with no trail shows no steps, so the audit cannot see a level that no bar marks on it;
what it tests is whether a visible bar marks the page itself. On the 17 stzsite pages the five findings on `en/book`, `areas`, `craft`, `applications` and `architecture` stay findings, with the new reason: those pages
omit the trail and carry no landmark. The count stays at 29; the stzzui site stays at 0.

### Item 3 — the depth and breadth of a reading site (STZZUI-READINGDEPTH-01): Rules 27, 114, 120, 116

Prompt 52 (2026-10-15), from six readers of the Softanza website. Ruled part by part:

| part | ruling |
|---|---|
| **A** the 114 / 27 / 120 collision | **see_also among Rules 27, 114 and 120**, no normative words: the repair for 114 (a block widens while the page has room) made a second row wrap, which breaks 27, and 120 is the rule that dissolves it |
| **B1** a budget for depth and breadth | **Held**: superseded by item 1, which sets the number of levels and the five-entry cap |
| **B2** a section answers one question | **Refused as new law**: already Rule 123 ("each section carries one message") and Rule 116 |
| **B3** one subject, one page | **HELD, and open.** The evidence is one author's reading of one site, not a measurement; it is not ratified now. Rule 116 forbids one page under two names and nothing forbids one subject under two pages, which is a real gap, recorded here as open |
| **B4** labels say what is inside | **Amended**: the last sentence of Rule 116 now says a label names what the reader will find there, not the author's metaphor; one avoid entry follows |
| **C** the audit compares breadcrumbs where Rule 115 says "path" | **A tool change, done with item 1** (the audit reads the bars) |

### Item 4 — a resting shadow (STZZUI-RESTINGSHADOW-01): Rule 10

The question was whether a light tint under a page head and a light shadow under cards, neither used for emphasis, sit inside **"Rule 5"**.
**The citation is corrected here: the words quoted, "no gradients, no shadows used as emphasis", are Rule 3 (Color Is a Signal)**, not Rule 5, whose avoid list is empty and which is about paper tones.

- The **tint** is lawful as written: Rule 10 "depth through shades", Rule 5 paper tones.
- A **light shadow under cards** passes the literal words of Rule 3 (it forbids shadows used as emphasis) and meets Rule 10 head on: its title says "Elevation without shadows" and it names "blurry drop-shadows for depth".
  **Rule 10 is amended by one clause**: one resting shadow is lawful, if it separates and never ranks, the same on every card, unchanged by hover or state, such that removing it loses no information. Judgment tier; no number is invented for blur or opacity.
- **A three-way tension, recorded:** Rule 3 forbids shadows as emphasis, Rule 10 says elevation without shadows, and **Rule 52 (The Scrim) prescribes "a subtle border and box-shadow to enhance the spotlight effect"**. They had never been
  put side by side. **Rule 52's text is not changed**; Rules 3, 10 and 52 now carry see_also to each other, so a reader of one finds the other two.

### Item 5 — the two-state control: Rule 106

The author's finding on a screenshot of the Softanza book reader (2026-10-15): a single toggle whose label named the action it would take ("Show every chapter" while the spine was shown, "Read the spine only"
otherwise), so the reader could not see which state was current. *"This button is confusing, never use it like that, make the two states visible in sliding button or in a combo box."*
Rule 106 does not forbid it as written: the label was verb-led, and the rule's avoid list names a toggle labelled with the current state or with a target state *and no verb*.

**Rule 106 is amended**: a control with exactly two states shows both, as a segmented switch or a select, the current one marked in more than colour, and is never one button whose label names the other state; a switch that shows both
states answers the quiz Rule 106 already named, and a verb-led button stays right for a one-shot action. One avoid entry follows. Tier stays machine-later. This item was the first answer the finding received: it had sat in the mailbox since 2026-10-15.

### Version arithmetic

Seven rules amended (10, 27, 106, 108, 115, 116, 120), seven carrying see_also. No rule canonized, retired or moved a tier.

> **`rules.json` v3.12 → v3.13 · 123 rules unchanged · 17 forbidden patterns unchanged · every tier count unchanged.**

**Does anything lawful become unlawful?** For three rules, yes, and it is said plainly: a two-state control drawn as one verb-led button (106), a label that names the author's metaphor (116), and, on a reading surface, a horizontal menu of six to eight items (27); all three are judgment-tier and no verifier decides them.
Everything else widens or states what was already meant: a second horizontal bar, an omitted trail, a distributed path, a resting shadow. **Rule 120's literal text is reversed on the author's own request (prompt 53).**
The conformance suite is untouched and **no fixture changed its verdict** (73 of 73 at every commit of the pass). The audit tool follows Rules 115 and 108: on 17 stzsite pages 27 findings became 29 (two true new Rule 115 findings, and the five Rule 108 findings now say
a landmark is missing); on the 15 pages of this site, 0 stayed 0. All conformance artifacts re-pinned to 3.13 after the suite was run.

**Held, not refused:** one subject on one page (READINGDEPTH B3); a reason carrier for `ROLE irreversible` (ROLE-REASON-01); rules for haptic, luminous, signage, spatial and terminal.


---

## Pass 5 — proposed 2026-11-05: the author's look at the Zane site · *proposed, not ruled*

**Status: proposed, not ruled. Nothing here is applied to `rules.json`.** The author asked, on 2026-11-05, that every remark
made while looking at the site be documented so that it can be included in the Constitution: *"ALL THSE REMARKS MUST BE
DOCUMENTED TO BE INCLUDED IN THE CONSTITUION"*. Each item below quotes the remark as written, states the defect, the repair
the site received and the check that now holds it, and proposes what the law would say. The Principal rules each item through
Central; a ruled item enters `rules.json` in the next minor version, with its evidence.

**Why these belong in the law and not only in the site's own rules.** Every remark was made about a page that an AI produced
while building this site under the Constitution, and every one names a defect the law does not yet forbid in words, or
forbids in words that pull the other way. That is the evidence Article VII asks for: real use, a person's report, a
documented failure.

### F-1 · A title balances its own lines — *new rule candidate*

- **The remarks.** 2026-11-04, on the old home page: *"'FEATURES' must be in the same line as the sentence and 'IS' must go on
  the line after. Check that all the titles are esthetiucally equilibrated through lines"*. 2026-11-05, on the front page:
  *"the issue of equilibrated text on a line again and again!"*
- **The defect.** A title broke as *"Zane is the / compilable language / for user interfaces."*: a short first line beside a
  wide empty panel. Its cause was a line break placed by hand (two spans set as blocks), which the browser's balancing could
  not cross; and, once that was removed, a panel too narrow for the title's two lines.
- **The repair and its check.** Titles are one element, balanced by the browser (`text-wrap: balance`); paragraphs use
  `text-wrap: pretty`; the hero's panel is sized from the title's own width. `node tools/site-shell.js` refuses a title that
  holds a `<br>` or a piece set as a block, and a stylesheet that stops balancing h1, h2 and h3.
- **Proposed rule.** *A title breaks where its lines come out of even length, and nowhere else. No line of a title or a short
  paragraph holds one word alone, and no break is placed by hand; the renderer balances the lines.* Derived from the calm
  article (legibility). Tier: tool for the hand-placed break (the site's check), judgment for the evenness a person sees.

### F-2 · A title says what it is — *new rule candidate*

- **The remark.** 2026-11-05, on the grid page: *"i todl you befeore several time to avoid the narrative, sucinet, non
  declarative style of writing. Here for example, you describe the grid without citing it, neither in the titles nor in the
  text. use a dead simple clear descriptive full sentence from the kind : Zane is designed around a conceptual grid with ....
  snusre systeatic coverage etc"*. And on the front page, the same day: *"The hero contains a duplication ... don't apply the
  strict sentence style to the hero zones"*.
- **The defect.** Titles written as metaphors, teasers and fragments (*"The rows of a person's day"*, *"The gap, as a
  finding"*), leads that never named their subject, narrative (*"so it was measured"*), aphorisms. And, applied to a hero,
  the strict register made the title and the line under it say the same thing twice.
- **The repair and its check.** `doc/design/WRITING.md`; all 38 pages rewritten; `node tools/site-shell.js` refuses a page whose
  title, or the first sentence of whose lead, does not name the page's subject. A hero zone holds a short tagline and one line
  that does not repeat it, and is judged below it.
- **Proposed rule.** *A page's title names its subject and says what it is, in one declarative sentence; the first sentence
  under it says what the subject is for; a section title says what the section contains. A hero zone is the one exception: a
  short tagline and one line that does not repeat it.* Derived from the intent article (a reader knows what a surface is for).
  Tier: tool for the subject term, judgment for the register.

### F-3 · Space says something, or it is not there — *amendment to Rule 2*

- **The remarks.** 2026-11-05, on the front page's panel: *"the space to the right is not necessary! Space is a functional
  communication tool that we must use with care"*. And, on the next attempt, which had narrowed the panel around a two-line
  title: *"I'm tired of talking to you of visual equlibrium! the hero zone must be rectangyular and you have space : put the
  title on one line and strech the text to the right!"*. And on the wide rectangle that followed: *"npw it is so larg and hides
  the door! please think in terms of visual equilibrium : put the title on two lines if necessary and fix this mess"*
- **The defect.** The hero panel was 48rem wide and its balanced title and line left a band of empty space beside them,
  about two fifths of the panel, which separated nothing and ranked nothing.
- **The repair.** The hero's panel is a rectangle on the left half of the photograph, and its right edge stops short of the
  museum's door at the photograph's centre (measured against the door frame at seven window sizes, from 900 to 1920 wide). Inside
  it the title takes two balanced lines sized from the panel's own width, so they fill it, and the text under it takes three even
  lines. Three attempts came before it: a panel with an empty band beside its text, a tall narrow box, and a rectangle as wide as
  a one-line title that covered the door.
- **What the attempts teach.** Balance, fit and width are not ends in themselves, and none of them can be judged on the text
  alone. A text over a picture takes its shape from the picture: it leaves the picture's subject visible, it fills the box it
  is given, and its lines are even. The rule proposed below gains that clause.
- **Tension, stated.** Rule 2 (*White Space Is Structural*) says white space is mandatory and that dense interfaces are
  errors. The remark is the other half of the same idea: space that separates or orders is required, and space that does
  neither is a defect too.
- **Proposed amendment to Rule 2.** One clause and one avoid entry: *space is functional: it is present where it separates,
  groups or ranks, and absent where it says nothing. A box wider than what it holds, or an empty band beside a text, is a
  defect; and a text set over a picture leaves the picture's subject in view.* Tier stays judgment.

### F-4 · The line under a hero title is part of the hero voice — *amendment to Rule 107, needs a ruling*

- **The remarks.** 2026-11-05: *"the secondary text must be bigger!"*. And 2026-11-04, the other direction: *"the text of the
  main titles are excessively big compared to normal text and other titles"*, and *"Generally the main text size is small and
  some narratives are very dense in terms of text which does not help in reading"*.
- **The repairs.** The page title came down to one step above the section titles (clamp to 2.5rem); the reading size went up
  (1.25rem, a 42rem measure); the line under the hero title is 0.62 of the title, larger than the reading size.
- **Tension, stated.** Rule 107 (*Hierarchy Is Not Miniaturization*) says three sizes suffice: a hero voice, a title voice and
  one reading size. The line under the hero title is now a fourth size, between the hero voice and the reading size.
- **Proposed amendment to Rule 107, for the Principal to choose.** Either (a) the hero voice is a pair, a title and the one
  line under it, each larger than the reading size; or (b) the line under a hero title is set at the title voice, which keeps
  three sizes. The site follows (a) today.

### F-5 · The action follows understanding — *new rule candidate*

- **The remarks.** 2026-11-04: *"there absolutely no meaning to a button that brings the reader to the section that it is right
  under it !!!"*; and *"I find this call to action to be mis-placed! because it interrupts the logical flow fo reading and propose
  an intrusive change of context"*. 2026-11-05, on the front page's button "See a refusal, line by line": *"the theme proposed in
  the call to action is intrusive and dispruptive : obly after reading and understanding what the language is one can deal with
  it. See how the Softanza site does and think of a button CTA"*. And, on the copy that followed (two buttons, *Learn* and *Start*):
  *"you don't need to copy the stzsite blindly! we don't have a Learn page nor Start one! Think of a solution to this ansd make
  a fluend CTA to propose"*.
- **The defects.** A button that scrolled to the section beneath it; a call to action in the head of every reading page,
  interrupting the reading; and an entry page whose one action asked the reader to judge a refusal before knowing what the
  language is.
- **The repairs and their check.** No button in the head of a reading page; the front page has one action, *Discover how Zane
  works*, which opens the Language page, the page that explains the language step by step before anything is asked of the
  reader. Its words name what it opens: there is no page called *Learn* or *Start* on this site. `node tools/site-facts.js` refuses a
  primary button in the head of a reading page and a primary button that points into its own page.
- **Proposed rule.** *An action follows understanding. A surface proposes an action only where the person can already tell what
  it does and why they would take it: never in the head of a page that is read from top to bottom, never ahead of the
  explanation the action depends on, and never as a control that only moves the reader to what is already below it. On an
  entry surface the first action leads to understanding and the next to doing, and an action's words name what it opens.* Derived from the intent and operator articles.
  Relation, stated: Rule 90 (*One Action Per Screen*) asks for one clear next action and does not say when it may be asked for;
  Rule 16 (*Intentional Clicks*) asks that a control look like one. This rule says when. Tier: tool for the two machine-checkable
  cases (the site's check), judgment for the rest.

### F-6 · Remarks that are evidence for existing rules, not new rules

Each remark below is documented as evidence; the rule it supports already says enough.

| date | remark, as written | defect | rule it supports | repair |
|---|---|---|---|---|
| 2026-11-04 | *"the arrows are not well painted and the text goes out of the box !!"* | a figure whose labels overflowed their boxes | Rule 2 (structure), Rule 107 (reading size) | the figure redrawn with text inside its shapes |
| 2026-11-04 | *"there is no offset to the left of text !!!"* | text touching the page edge | Rule 2 | a 1.4rem gutter on every container |
| 2026-11-04 | *"at the bottom the page turned to a mess !!!"* | the footer laid out inside the page's grid | Rule 2 (structure) | the layout closed before the footer, on every page |
| 2026-11-04 | *"look at the e trancated from the coulum text !!!"* | a table cell clipping a letter | Rule 105 (the legibility floor), Rule 48 (tables) | the column no longer clips; tables scroll inside themselves on a phone |
| 2026-11-04 | *"Move the 'On this page' submenu to the right of the page"* | the page's section list on the left, where the family lists are | Rule 24 (navigation as orientation) | the section list on the right; a family list stays on the left |
| 2026-11-05 | *"the menu must be a bit transparent and the image dispalyed on the full visible browser suth as softanza site"* | a solid bar above the photograph | Rules 62 and 105 (contrast) bound it | the menu over the photograph at 75%, measured at 7.0 to 1 against the photograph's brightest pixel; recorded as a choice of style, not a rule |
| 2026-11-06 | *"I don't like how this lateral menue appears! first it adds a second vertical scroll bar which is forbidden, and then it contains long titles and not a beautiful visual them (make it dead simple like in github lateral menu for the markdown docs with a strict line separating it from the content of the page"* | the "On this page" list scrolled inside itself (a capped height with its own scroll bar), and drew long titles wrapped over several lines in a card | Rule 14 (*No App-Squeezing*: internal scroll bars), Rule 12 (*The Law of the Eternal Scroll*) | no card and no scroll of its own; one thin line between the list and the page; one line per entry, cut with an ellipsis, the whole title in its tooltip; measured shorter than the window on every page at 1280x720 |
| 2026-11-06 | *"yes, give each section a short outline label"*; then *"remove the interative arrow that hides the menu. the text is small so enlarge it a bit"* | the outline cut long titles into fragments, folded behind a disclosure arrow, and set its entries at the smallest size | Rule 105 (the legibility floor), Rule 107 | each section carries a short outline label of 20 characters at most (checked by site-shell.js), the whole title in its tooltip; no disclosure, the list is always open; entries set at 1.1rem in a 16rem column, none cut in either culture |
| 2026-11-06 | *"never use a horizontal scroll bar on an image or code snippet!"* | five drawings carried a fixed minimum width of 780 px inside a scrolling wrapper, and the column was a few pixels narrower | Rule 14 (internal scroll bars) | a drawing scales to its column and never under 1:1 down to 857 px wide, because a page with a drawing puts its outline above the text below 1152 px (Rule 105 holds with Rule 14); site-shell.js refuses an svg with a fixed min-width or in a scrolling wrapper; code panels already wrap. Open: under 857 px (a phone) a drawing still shrinks below the floor; a drawing that reflows is not designed |
| 2026-11-06 | *"the titles are long and the paragraphs are short, and the size of the titles are exaggeratedly big with the uppercase+bold on many lines making it hard to read and disturbing"* | page titles were set in capitals at up to 2.5rem over three lines, beside a lead held to 42rem | Rule 107 (hierarchy is not miniaturisation, read the other way: size is not hierarchy either) | titles in sentence case (site-shell.js refuses a title set in capitals); the page title at most 2.1rem, section titles at most 1.6rem with a tight line height; the kicker, title and lead share one 50rem measure |
| 2026-11-06 | *"since they are 4 cards, put 2 per line and avoid the issue of empty space!!"* | four cards in three columns left a row of one card and two holes | Rule 2 amendment (F-3, space is functional) | two or four cards go two to a row; three or six stay three to a row |
| 2026-11-06 | *"the alternation between white background and page background is not successful and leaves holes in the page and visual disruption in the reading flow"* | every other section was a white band, cut short beside the outline column | Rule 12 (*The Law of the Eternal Scroll*), F-3 | one background for the whole reading column; one gap between sections, the page's margin at both ends |
| 2026-11-06 | *"some lateral menus are still in the left, move them to the right"* | a family list (the pages of one family) sat on the left of the text while a page's outline sat on its right, so the text began at two different edges | Rule 116 (a page reads as the menu names it), F-3 | every list beside a page sits on its right, family and outline alike; the text starts at the page's left edge, under its title; this turns the earlier ruling that kept a family on the left |
| 2026-11-06 | *"You mean 'Zane is implementable in other languages' or 'can be implemented in other languages' and avoid using 'implement' twice"* | the Other languages title read "Zane is implemented in other languages by implementing its language": a capability stated as a fact, and one verb used twice | WRITING.md rule 1 (the title says what the subject is) | the title states the capability ("can be implemented") and uses the verb once: "Zane can be implemented in other languages by writing its verifier and running its fixtures, not by adopting a library." |
| 2026-11-06 | *"On this page seems like a clickable option in the menu. Differenciate it (in gray sufficently readbale and not in bold)"* | the outline's heading was set in bold ink at the entries' size, so it read as one more entry | Rule 116 (the menu tells the truth), Rule 105 (the legibility floor) | the heading is a label: the muted gray, normal weight, one step smaller (1rem) than the entries; its contrast measured by the UI audit in both cultures |
| 2026-11-06 | *"Separate 'On this page' by a space and push it slitlyt to the left at the same level of the vertical line so the reader does not take it for a first option in the menu!!!"* | the heading sat inside the list, indented like its entries and on the same line's side, so it still read as the first entry | Rule 116 | the outline's line starts under the heading; the heading stands on the line's own left edge with a 1rem space below it, outside the list |
| 2026-11-06 | *"to beautify the internal pages, add a graphity inspired from the main imagge (the building and it's geometric forms) as clean lightweight (vectorised) small filigran starting forom the bottom right corner of the hero sections"* | the page heads were a flat tint with an empty band right of the text | F-3 (space is functional: decoration lives where it costs the reader nothing) | a thin-line SVG (site/assets/filigree.svg, about 2 KB) from the museum's façade (the nested lozenge, the scrolls, an arched curve, a rosette, the roof's steps), drawn as a mask in each culture's accent at low strength from the head's bottom-right corner; sized to the space right of the text and hidden under 1121 px; measured clear of the text by 8 px or more on 30 page heads at six widths |
| 2026-11-06 | *"the menu bar texts are small! Add Github icon to the right along with the combo of the vibe"* | the top bar's words were at 1rem, and GitHub and the style select sat in the footer | Rule 105 (the legibility floor), Rule 106 | the bar's words at 1.2rem (the brand at 1.3rem, the band at 1.1rem); the GitHub mark and the style select at the right of the top bar, gone from the footer |
| 2026-11-06 | *"hyperlinks are polluting the page with their intrusives underlines+bold, rethink it and let it change them on mous survol"* | every link was underlined, and the links of cards and lists were bold | Rule 105 (open: a link told by colour alone, WCAG 1.4.1) | a link is told by its colour and underlined only under the pointer or the keyboard's focus; no link is bold. Open: whether colour alone is enough to tell a link from text is not measured |
| 2026-11-06 | *"Zane is a Softanza project. must be added to the footer in all pages"* | the sentence stood once, in the front page's body | none | the footer of every page carries it; the front page's body no longer repeats it |
| 2026-11-06 | *"avoid info bulles altogethor because they complexify the redaing by a volatile additional layer! just make small experive titles"* | the outline's entries, the style select, two mock buttons, the Reader's badges and five drawings carried tooltips | Rule 116 (the menu tells the truth) | no title attribute anywhere and one <title> per page; a drawing names itself with <desc>; site-shell.js fails on either (WRITING.md rule 11) |
| 2026-11-06 | *"also avoid this bad habit of having a backoudrounh colr for the selected item and the hovered item!!!"* | the outline drew a tinted background under the entry being read and under the pointer | Rule 115 | no background: the entry being read is set in bold ink, the one under the pointer turns to the link colour |
| 2026-11-06 | *"the graphity should not be added in the retro vibe! did you see any retro UI containing one??!"* | the filigree was drawn in Retro too, in the terminal green | Article VI (two cultures, one truth) | the filigree belongs to Modern only; Retro draws none |
| 2026-11-06 | *"what's the hell is this!!! the same complexity of the inofbulle level, nonw not volatile and adding a whole new square of navigation the reader should think about!!!!"* | a family's head page showed its outline and, below it, a second list of its family's pages | F-3 (space is functional) | a family's head page shows its own outline and nothing more; its family's pages are reached from its body |
| 2026-11-06 | *"do you removed the filigree from the modern vibe also???"* | a 1120 px rule hid the filigree in both cultures, and the author's window is about 1085 px | F-3 | the filigree shows in Modern wherever the band right of the text holds 8rem of it (from a 62.4rem window, about 998 px); measured 150 to 424 px wide at 1024 to 1440 px, 46 px or more clear of the text |
| 2026-11-06 | *"add the Github text left tho the icon and separate it from the Style combo (use Theme instead of Style)"* | the bar's right side held a bare GitHub mark beside a select labelled Style | Rule 106, Rule 116 | the link reads GitHub then its mark, one target; a thin rule and 1.5rem set it apart from the select, now labelled Theme everywhere |
| 2026-11-06 | the author's screenshot at about 548 px: "Language" cut to "Lar" and Approach under the select (Central, 13:15) | the menu was one row that scrolled sideways under GitHub and the select | Rule 14, Rule 27 | the bar wraps: GitHub and Theme move to a row of their own, and the menu wraps its words; measured at 390, 548, 768, 1024, 1085, 1280 and 1440 px: no overlap, no cut word, nothing past the window; the band wraps too |
| 2026-11-06 | *"use this version for the retro vibe, while optimising thewiegts of the two images for better speed of display"* | one photograph by day for both cultures, 382,022 bytes at every width | Rule 105, Article VI (two cultures, one truth) | Retro shows the museum by night; both photographs come in widths the browser chooses from (by day 800, 1280 and 1699 px: 94,424, 200,812 and 318,130 bytes; by night 800 and 1380 px: 24,680 and 48,156 bytes) and both are lazy, so only the one the theme shows is fetched (measured: Retro fetched the night file only, Modern the day file only); the night door is kept 32 to 255 px clear of the panel from 900 to 1920 px |
| 2026-11-06 | *"Not only 'aournd a person' but around a user being person or agent, review this in all the site"* | the site named a person where it meant whoever acts through an interface | WRITING.md rule 12 | 240 occurrences read one by one: 112 became user, 0 agent, 128 stayed person or people (the site's readers, human judgement, sight, reading, motion and rights a culture concerns); each page says once, at its first user, that a user is a person or an agent |
| 2026-11-06 | *"the selected background of the combo should embrace the current theme (retro or modern) not the standard browser them (that ugly blue)"* | the open Theme list was the operating system's, with its blue highlight | Article VI (two cultures, one truth) | a customizable select (appearance: base-select) draws the open list in the bar's colours and the option under the pointer or the keyboard in the theme's accent: raspberry in Modern, terminal green in Retro; a browser without the feature keeps its native list |

### What ruling this pass needs

1. F-1, F-2, F-5: canonize as new rules (three numbers), or hold.
2. F-3: amend Rule 2 by one clause and one avoid entry.
3. F-4: choose (a) or (b) for Rule 107.
4. F-6: add the remarks to the evidence of the rules named, or leave them in this docket.

**Version arithmetic, if every item is ruled as proposed:** three rules canonized, two amended (2, 107), a handful of evidence
lines added. *`rules.json` v3.14 → v3.15, minor.* No fixture would change its verdict: none of these is decided by the
verifier, and the two tool-tier checks live in the site's own build.

## RULED — 2026-11-07, Pass 5's F-6 rows sent as DOCKET-PASS5-01, `rules.json` **v3.14 → v3.15**

The Principal, relayed by Central on 2026-11-07 10:49: *"yes to all six"*, on the six recommendations of DOCKET-PASS5-01
(outbox, b7e103f). Pass 5's other items (F-1 to F-5) are not ruled by this answer and stay proposed.

| row | ruling | where it landed |
|---|---|---|
| F6-FILIGREE | stays in the docket: an ornament is a culture's choice under Article VI | this docket only |
| F6-NAMED-LINK | evidence for Rule 116 | Rule 116's evidence |
| F6-BAR-WRAPS | Rule 27 amended: a menu never cuts a word and never scrolls sideways; where one row is too narrow, it wraps | Rule 27's avoid list, solution, why and evidence |
| F6-NIGHT | the picture stays in the docket; the practice is a candidate rule, written up below and not enacted | below |
| F6-USER | the law's prose names the actor as the user, a person or an agent, never where it names human perception | the preamble (one definition for every "operator" and "user"), Rule 116's why, Rule 130's avoid list and solution |
| F6-THEME-LIST | evidence for Article VI: a culture owns every state of its controls, the open one included | Article VI gains an evidence field; its statement is unchanged |

**What changed in the law, object by object.** Rule 27: two avoid entries (one replaced), the solution's last sentence, the why, the
evidence. Rule 116: the why's first sentence, the evidence. Rule 130: two avoid entries and the solution's first sentence. The preamble:
one sentence added. Article VI: an evidence field added. Metadata: version, lastUpdated, lineage. No rule's number, title or tier
changes, no rule is added or retired, and no fixture changes its verdict (conformance 73 of 73).

**Why "operator" was not rewritten.** The law says operator 103 times, and Article VI is titled *Operator Primacy*: it is the law's role
word, not a description of a human. One definition in the preamble makes every use of it mean the user, a person or an agent, as Rule
104's three beneficiaries already said, without rewriting a title. The 10 places where the law said person or people were read one by
one: 4 named the actor and now say user; 6 stay, because they name reaching a human (the sixth right, Rule 102's why), the people an
application manages (Set 23, Rule 74) or attention a person spends (Rule 130's why).

### A candidate rule, written up and not enacted (from F6-NIGHT)

**A page fetches only what its culture shows, at the width the screen needs.** An image, a font or a script that the active culture
does not display is not fetched, and an image comes in widths the browser chooses from. *Avoid*: a second culture's picture fetched
and hidden; one width for every screen. *Why*: what is fetched and not shown costs the person on a slow line, and costs nothing to
avoid. *Evidence*: on the Zane site, the night photograph Retro shows is 48,156 bytes, and Modern's day photograph 318,130 at full
width and 94,424 at 800 px; with both lazy, Modern fetched the day file only and Retro the night file only (cac3e98). *Open*: it
is measured on one page of one site; it would want a second site before a ruling.

## RULED — 2026-11-08, ZANE-MENU-LANDING-01, `rules.json` **v3.15 → v3.16**

The Principal, on a screenshot of `site/thinking.html` (the band under *Approach* read *The grid, Channels, Comparison, Claims*, its
first slot empty), relayed by Central on 2026-11-08 11:18: *"You misutertood me when i told you to avoid dupplication of the main menu
and the first option in the submenu you must bring bakc the frist option but find an other lable for it that is different from the
main option(Approach in our case), be it "Intro" or any better experssive term! I need you to deal with menu strcture as a logical
apsect, and i'ts not logical to get the main title "Approach" then find it also as an option of it's cibling menus!!! you must add this
as an issue that is statically checked in Zane and notify all other sites to fix it!"*

It reverses the reading of 2026-11-06, under which a section's head page took the section's name in the main menu and left the band.
The reading that keeps Rule 116's *one page, one name*: the main menu's entry names the SECTION, the band's first entry names the
section's LANDING PAGE; they are two things, so each keeps one name.

**What changed in the law, object by object.** Rule 116: the fifth avoid entry extended (*"..., or a section called by its landing
page's name"*), two avoid entries added (a section whose landing page is missing from the level under it or listed after the pages it
leads to; a child carrying its parent's label, or two entries at one level carrying one label), one sentence added to the solution, the
ruling added to the evidence. Metadata: version, lastUpdated, lineage. No rule's number, title or tier changes, no rule is added or
retired, and no earlier fixture changes its verdict.

**Where it is checked.** The language (1.6) lets a `NAV_GRAPH` state a menu: `LABEL`, `TARGET`, `ENTRIES`. `zane check` refuses
`MENU_LABEL_REPEATS_PARENT`, `MENU_LANDING_NOT_FIRST` and `MENU_LABEL_DUPLICATE` (contract 1.10, 40 diagnostics), with one fixture
each and a lawful one (77 fixtures). The site declares its own menu in `site/menu.zane`, and `zane site shell` refuses the same three
there. Rule 116's tier stays *tool*: the verifier now decides three of its demands from a declaration, and the UI audit the rest on a
painted page; whether that moves the tier is a ruling, not this desk's.
