# Amendment docket — one ratification pass

**Status**: **proposed, awaiting the author's pass.** Nothing here is applied.
**Why a docket**: StzZui's core asset is a constitution, so most of its "refactoring" is
**legislation, not implementation**. Six scattered amendment requests is six interruptions;
this is one sitting. The genre follows the reference design's own ratification record.
**Date**: opened 2026-08-12; **C-2 added 2026-08-13**.
**Law as it stands**: **v3.8, 118 rules** — corrected 2026-08-12. This line previously read
*v3.8.0* while the law was still v3.7.3; the drift is noted rather than smoothed.

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

**Still owed by whoever applies this**: the drafted text for Rule 60's restatement, Rule
69's new title, Rule 104's third beneficiary, Rule 125's body, and the sixteenth forbidden
pattern. Wording is authorial; the rulings above fix what each must *do*, not how it reads.

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
