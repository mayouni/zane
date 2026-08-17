# Implementing the Second Founding — the programme

**Derived from** [THE-SECOND-FOUNDING.md](THE-SECOND-FOUNDING.md) **v0.2**, which is
**proposed, not ratified**. This plan is therefore conditional in most of its length and
unconditional in one track — see §1.
**Genre**: the three-track dashboard the family already runs in
`softanza/prompts/README.md`. When the vision is ratified, the sessions below take
numbers 16+ in that program and this file becomes redundant.
**Date**: 2026-08-12.

---

## 1. What is gated, and what is not

The founding document makes two kinds of claim, and they have different standing.

- **Findings of drift** — Rule 3 vs Rule 118 vs the engine; Rule 62 marked `machine-later`
  while its instrument ships; the law and the two planes never citing each other. These
  are **defects observed in the tree**. They are true whether or not the vision is
  ratified, and fixing them is a correction, not a programme.
- **The vision** — the expression strata, the medium axis, the three-tier constitution,
  the protocol pack. These are **proposals**, and nothing large should start before the
  author's section-by-section pass.

So **Track 0 starts now and Tracks A–C wait.** That split is not a hedge: it happens to
put the one time-critical item on the unconditional side.

## 2. The critical path

> **One vocabulary for five meanings must be settled before sound acquires semantics, and
> sound must acquire semantics before SN6 opens the sound plane's outward doors.**

```
S1  reconcile the five semantic values      ──┐
    (law ↔ law ↔ engine)                      │
                                              ├─→  S7  sound semantics  ──→  SN6 may open
S2  Rule 62 → StzIsLegible                    │        (stzlib, co-authored)
S3  the documents cite each other           ──┘
```

Everything else in this plan can slip by a quarter without loss. **S1 → S7 cannot**, for
one reason: colour's vocabulary drifted because the engine shipped before the law had a
seam to bind to, and the sound plane is at the same moment with SN0–SN5 closed and SN6
not started. The cost of agreeing a vocabulary now is a document. The cost of agreeing it
after SN6 is a migration.

And S1 is the root of it — because sound reuses colour's five names, the sound work
cannot start until it is known what those five names *are*.

## 3. Track 0 — the drift corrections

Each is defensible on its own evidence even if the Second Founding is rejected entirely.

**Corrected 2026-08-12**: this track was written as "start now, unratified". That was half
right. Three of its four items turn out to be **constitutional acts** under the project's
own versioning rule — a rule canonized, amended, or *promoted up the enforcement ladder*
moves the law's substance — and are therefore the author's, not a session's. They are now
filed in [AMENDMENT-DOCKET.md](AMENDMENT-DOCKET.md) for a single ratification pass. What
is genuinely unblocked without any ruling is smaller, and is listed in that docket's §6.

### S1 · Reconcile the five semantic values · `stzzui` + `stzlib` · **small** · *now on the docket as A-5*

**Updated 2026-08-12: the evidence changed, and in the project's favour.** S7 ran ahead of
this session — and the sound plane, rather than inventing a vocabulary, deferred to the
law: *"the vocabulary is not this plane's to choose… a sixth value here would be a
constitutional amendment wearing a library's clothes."* It adopted
`danger · warning · info · success · muted`.

So **two of the three vocabularies now agree, and the colour engine is the outlier.** S1
is no longer "pick a winner"; it is "bring colour into line with the law and with sound."

The `muted` vs `:Neutral` question is likewise settled by evidence rather than by ruling:
forced to render `muted`, the sound plane found the answer is **silence**, on the ground
that muted means *waiting or inactive* and a sound announcing inactivity is a
contradiction. A state renders as silence; an absence of semantic charge does not. They
are two concepts, so reconciliation **adds a value rather than renaming one**.

- Rule as ruled in [AMENDMENT-DOCKET.md](AMENDMENT-DOCKET.md) A-5.
- `SOFTANZA_COLOR_SYSTEM.md` records which rule its semantic names serve.
- **Do not** change any computed colour. This settles names, not values.

**A note on the sequencing deviation.** S7 starting before S1 was the risk this plan named,
and it did not bite — because the ownership split held: the plane treated the vocabulary as
the law's to set. That is the split of founding §7.1 working under pressure, and it is
better evidence for the architecture than any argument in the founding document.

### S2 · Rule 62 off `machine-later` · `stzzui` · **small**

`StzIsLegible` exists, is CI-gated, and passes 42/42 theme/role pairs. Bind Rule 62's
`lint` field to it and promote the enforcement tier. Evidence per Article VII is the
measurement itself.

### S3 · The three documents cite each other · `stzzui` + `stzlib` · **tiny**

The constitution's colour rules gain an instrument pointer; the colour plan gains a "the
law this serves" line; the sound plan gains the same once S7 lands. Cheapest item in the
programme and the one that prevents the next drift.

### S4b · The colour table's hard-coded culture, filed · `stzlib` graphics · **tiny** · *added 2026-08-13*

`stzDiagramColor.ring:45` comments `$acColorsBySemanticMeaning` as an *"abstraction
layer"*, and it is one that stops a level too early: it abstracts hex → name, then
hard-codes name → **one culture's reading**. `:Success = "green"` and `:Danger = "red"`
are exactly the pair that inverts in Chinese, Japanese, Korean and Taiwanese financial
convention, where red is gain and green is loss — so a Softanza financial dashboard
shipped to Shanghai renders profit in the colour of loss.

File it as a cross-plane finding, in the genre that plane already uses. **No rule needs to
change for this to be a defect**, which is why it is here and not on the docket. The fix
is not a different table; it is one more lookup — meaning → *convention* → reading.

### S4 · The sound-plane finding, filed · `stzlib` · **tiny**

Rule 18 requires acknowledgement within 100 ms; the plane measures 112.6 ms output
latency of which ~60 ms is OS pipeline. File this as a cross-plane finding in the genre
that plane already uses — it produced one for the graphics plane about `stzCanvas`
lacking an image primitive. **A finding, not a demand**: the number may be fine once
decomposed, but nobody has checked.

### S4c · Three layer-one defects, repaired · `stzlib` quality session · **small** · *added 2026-08-13*

Prompt written: [`doc/prompts/locale-defects.md`](prompts/locale-defects.md). Found while
surveying for the culture module, by reading and not by running — so each is a report to
reproduce, not a diagnosis to act on.

Hebrew classified `Neutral` instead of RTL, with the Ring and Zig layers disagreeing about
the same string; a dead `:FractionalSeparator` option in `stzNumber` with unreachable code
after it; and a datetime guard asserting 1400 AH → 2021 when the year is 1979–80, because
a 365-day year was applied to a lunar calendar. **Repairs to what exists, not the locale
plan's unstarted L2–L4.**

Unconditional, independent of each other and of everything else here.

### S4d · Three regex divergences · `stzlib` quality session · **small** · *added 2026-08-13*

Prompt written: [`doc/prompts/regex-defects.md`](prompts/regex-defects.md). Found while
studying Scope-Oriented Programming in order to apply it to `stzSense`.

`MatchOneSegment()` is documented and does not exist — and *one* segment is not a synonym
for *first* segment, so it may be a missing act rather than a missing alias.
Greedy-versus-lazy-by-verb is the segment scope's stated payoff and is unimplemented, with
`:NonGreedy` never passed by any scope verb. And `MatchWord` permanently rewrites the
object's pattern, so calling it twice yields `\b\bpat\b\b`.

**Two of the three are decisions, not repairs** — the design document may be the thing that
is wrong. This matters beyond regex because `SCOPE_ORIENTED_PROGRAMMING.md` is what every
other domain cites when it adopts the paradigm, and `stzSense` is next in that queue.

## 4. Track A — StzZui's own work. Gated on ratification.

### S5 · The medium axis · `stzzui` · **medium** · *first, because everything leans on it*

- Close `SURFACE_AS` to the eight media. It is an unenumerated identifier today, written
  in the canonical clean fixture as `SURFACE_AS terminal`.
- Publish the **capability matrix as data**: which of the 22 verbs each medium carries,
  and at what cost. This is the artifact tool makers consume.
- Add the diagnostics the matrix makes decidable: a flow declaring `COMPARE` on a serial
  medium with no fallback; a right declared `ALWAYS_REACHABLE` in a non-persistent medium
  with no re-request path.
- Fixtures for each, with lawful twins, per the suite's own rule.
- **Do not** add a verb. The matrix exists *because* the verb set is closed.

### S6 · The constitution's medium amendments · `stzzui` · **medium** · *law work*

Amendments A–D of founding §7.2: Rule 82 → *Perceivable State*; Rule 60 restated
medium-neutrally with ARIA as its web realization; Rule 69 reconciled with its own title;
Rule 104 extended to three beneficiaries. Each needs evidence under Article VII and the
author's ratification — this is the one session that cannot be delegated to judgement.

### S7 · SIGNAL in sound · `stzzui` + `stzlib`, co-authored · **medium** · *time-critical*

The session prompt is written: [`doc/prompts/sound-semantics.md`](prompts/sound-semantics.md).
A semantic layer **above** the sound plane that changes no node, no sink, no callback.

### S8 · SIGNAL in the visual channel · `stzzui` · **medium-large** · *done 2026-08-16*

The first expression grammar written in full — the channel where the law is richest and
an engine already exists. It sets the pattern the other five strata copy, so it is worth
doing slowly.

**Done 2026-08-16 — the extraction half.** [`conformance/signal.json`](../conformance/signal.json)
v1.0 publishes the vocabulary as data, in the shape S5 used for media: the five values
quoted verbatim from Rule 118, what each channel actually renders them as (verified in the
stzlib tree, not remembered), and what is **not** law. M6's other two thirds were already
cashed — Rule 62 bound to `StzIsLegible` at v3.9, and the visual channel's missing `muted`
filed on 2026-08-13.

**Done 2026-08-16 — the reconciliation half.** M6 says *"Rules 3 ↔ 118"*, and putting the
two rules side by side for the first time found that **they disagreed**: `danger`'s scope,
`neutral`'s meaning, and whether `accent` was a third family Rule 118's closure clause
forbade. Filed as docket section S8 and **ruled the same day, delegated**, at **v3.11**:
*Rule 3 owns chrome; Rule 118 owns what a colour means about a record.* Neither restates
the other, and both now carry `see_also`. No rule was canonized or retired and no tier
moved.

**Done 2026-08-16 — the grammar half. Language v1.1 → v1.2.** `SIGNALS` is a closed
enumeration on any declaration, carrying Rule 118's five and nothing else. Two diagnostics:
**`UNKNOWN_SIGNAL`** (level 1) and **`EXPRESSION_ORPHAN`** (level 2) — the founding's own
rule that *every expression declaration traces to an intent*, and deliberately named for
the stratum family so `ROLE`, `MOTION`, `MESSAGE` and `TEMPO` raise the same one. Four
fixtures with lawful twins; suite **38/38**.

**The finding that shaped the design.** `FEEDBACK` already had `TONE` — *five* semantic
values, and **not the law's five**. `TONE danger` is refused and `TONE critical` is clean,
so the language was rejecting the law's own vocabulary. The ruling was **not** to reconcile
them: the founding puts `MESSAGE` and `SIGNAL` in different strata, `TONE` is the register
the system *speaks* in while `SIGNALS` is what a value *means* about a record, and two
subjects legitimately carry two vocabularies. Each enumeration now refuses the other's
words, with the boundary written into `DECLARATIONS.md` §5.2 so the pair cannot drift the
way Rules 3 and 118 did.

**Done 2026-08-16 — `SIGNAL_UNPERCEIVABLE`, and the medium axis earns its keep.** A surface
whose declared statuses *all* render as absence in its declared medium has promised a
perceptible status and emits nothing. **The first diagnostic needing two axes**, and
therefore the first evidence that closing `SURFACE_AS` bought a *check* rather than a
taxonomy. Declaring `muted` on a silent channel is not the defect — silence is the correct
rendering of *waiting, inactive*. Suite **40/40**; contract at 25.

**And it surfaced a cross-plane disagreement.** The sound plane states in writing that
muted renders as absence *"everywhere — nothing painted, nothing said"*, and that a
paintable `:Muted` *"would be the bug"*. StzZui accepts that for auditory and voice and
rejects it for visual: Rule 118 is titled *Two Families of **Colour*** and family one
includes `muted`, which in practice is the greyed row distinguishing waiting work from
active. The evidence the plane cites — `StzColorToNumber(:Muted)` refusing "by name" —
turns out to be the resolver's generic typo guard, the same path that refuses `:Blorp`.
Filed in [the sound finding](findings/sound-severity-order.md); **the 2026-08-13 graphics
finding stands.**

**S8 is complete.** The stratum's remaining work is S9's, not S8's.

**Two findings left the plane while doing this**: the sound plane attributes its severity
ordering to a law that states none ([finding](findings/sound-severity-order.md)), and the
constitution turns out to have **no precedence mechanism at all** — which is why nothing in
the law decides the four conflicts above.

### S9 · ROLE + MESSAGE · `stzzui` · **large**

The two strata carrying the most `judgment`-tier rules and the most daily pain. `ROLE` is
the load-bearing move of the whole vision and should be attacked before it is built.

### S8b · `stzSense` v0 — the semantic sheet · `stzzui` + `stzlib` + `ringface` · **medium** · *added 2026-08-13*

Reflection written: [STZSENSE.md](STZSENSE.md). The serialization of *meaning → rendering*, which is
what makes the semantic system governable rather than merely implemented — the project's
signature move applied to rendering for the first time.

**v0 is deliberately tiny**: `SIGNAL` only, in `visual` and `auditory` only, because that
is the only part of the system that exists. Its whole job is three tests — round-trip the
seven existing colour themes with no loss, express the CJK financial inversion, and
serialize the earcon set — and if it cannot do them the idea is wrong and we learn cheaply.

**Do it with RingFace in the room, not near them.** `.face` shipped v0 and is hardening;
two composition-adjacent formats designed apart will grow into each other.

### S21 · The GUI plane · `stzlib`, **new dedicated session** · **large — a programme** · *added 2026-08-13*

Prompt written: [`doc/prompts/gui-plane.md`](prompts/gui-plane.md). Engine chosen: **RmlUi**
(MIT, host-supplied renderer, no JS engine, pluggable `FontEngineInterface` with a
`TextShapingContext` hook, real input model). Survey and reasoning in
[GUI-SYSTEM.md](GUI-SYSTEM.md) §10.

**Gated on S21a**, and it is a real gate, not a courtesy.

**Not inside the graphics session.** That plane drew the boundary itself — *"a window is not
a widget toolkit… the rest is a different product"* — and this is that product: its own
directory, plan, phases and kill criteria, as every other plane has. It also depends on more
than graphics (AccessKit, platform IME, the reactive layer, the sense sheet), and the
graphics session is live with uncommitted work.

**Honest sizing**: layout is ~15% of a toolkit. Flutter's non-layout, non-paint surface
measures ~6.6 MB. IME is 1–3 engineer-years and accessibility 3–6 from scratch, of which
AccessKit removes the adapter half. **This is a programme, not a milestone**, and §6 of the
prompt starts it where the constitution binds least — the in-scene case — rather than at
business applications.

### S21a · Reversible text layout · `stzlib` graphics session · **small** · *added 2026-08-13*

The two primitives every platform IME demands: **screen rect for a character range**, and
**character index at a point**, with a leading/trailing affinity bit. `gpu_text.zig` must
answer both, or a Softanza GUI can never accept CJK input.

File as a cross-plane finding in the genre the sound plane already used for `stzCanvas`.
**Cheap while the pipeline is young; the eight-year Firefox story if retrofitted.** This is
the only time-sensitive item in the GUI programme.

### S8c · `stzCSS` — CSS governed · `stzlib` · **medium** · *added 2026-08-13*

Prompt written: [`doc/prompts/stzcss-design.md`](prompts/stzcss-design.md). The stzRegex
move applied to CSS: not replacing it, but making its invisible governing frame explicit at
the call site. **CSS is the textbook case of the disease Scope-Oriented Programming names.**

`stzCSS` does not exist today, and the one test that anticipated it is retired pending an
archive port that never happened. It is **not** `stzSense` and must never grow into it:
`stzSense` speaks meanings and emits *through* `stzCSS` for the web; `stzCSS` speaks CSS and
is the governed bridge to a world without semantics.

**A refusal is an acceptable outcome** — if the M1 pass finds CSS's frames are mostly noise
to dissolve, a thin emitter plus an auditor is the honest answer, and worth more than a
module nobody should use.

### S9b · The cultural axis in the law · `stzzui` · **medium** · *added 2026-08-13*

StzZui's half of culture, once `stzCulture` exists to inherit from (S20). It augments the
model rather than restating it: which meanings an interface **must** be able to express,
which cultural conflicts are **refusable** by the court, the `CONVENTION` field and its
enumeration, the medium × culture interaction — a sign's reading can differ by channel as
well as by reader — and the forbidden pattern of docket A-6.

**Gated on both** ratification and S20. Note one thing already in our favour: a `.zui`
file cannot name a colour, so the language is **already culture-safe on that axis by
construction**. The inversion protected us before we understood what it was protecting.

### S10 · STRUCTURE + MOTION + TEMPO, and the print and ambient media · `stzzui` · **large**

Print last on purpose: it has no time, no interaction and no undo, so it is the medium
that falsifies a sloppy model. If the strata survive it, they are real.

## 5. Track B — the commons

### S11 · Core / commons / local · `stzzui` · **medium-large** · *touches the crown jewel*

A schema change to `rules.json`: tier every rule, add the supremacy rule, make
`derived_from` the admission test. Every rule already carries `derived_from` and all 117
resolve to one of the seven articles, so the mechanism exists — this session formalises
it rather than inventing it. Highest-risk item in the programme because it edits the law's
own file; it must not lose a number, an evidence field or a lineage entry.

### S12 · The capture loop · `stzzui` + one Softanza app · **medium**

The gotcha intake schema (offense · lawful twin · evidence · **medium**), the capture form,
and the local-law file an app ships. One real app must carry it or the loop is theatre.

### S13 · The protocol pack · `stzzui` · **medium** · *done 2026-08-17*

What a participant downloads and pins: the law, the grammars, the medium matrix, the C2
envelope, the fixtures, the contribution protocol. Plus the open question of a neutral,
citable identity for the standard.

**Built as `protocol/`** — `README.md`, the participant-facing contract, and
`MANIFEST.json`, generated by `tools/zui/pack.js`. **12 files in five roles: the law, the
language, the refusal contract, the axes, the proof.** No runtime, no framework, no
library — which is the whole point, because it is the only arrangement under which an
implementation in any language can prove agreement by running the fixtures rather than by
sharing code.

**The move that makes a pin real is the hash.** A version number says which edition you
*meant*; a hash says the bytes you *have* are that edition. `pack.js --check` was proved
by adding one trailing space inside `rules.json`: the version stayed v3.11 and the check
failed, which is exactly the case a version pin misses. The manifest never regenerates
itself — a manifest that follows the tree pins nothing.

**And the pack checks its own prose.** Six counts stated in the README are compared against
the manifest on every run, because prose drifting from data is the most repeated finding in
the evidence ledger and this document should not be the next instance.

**The identity question is stated and NOT decided**, with the cost of each shape — URN,
domain, DOI, content addressing. The pack uses content addressing today because it is the
only one already paid for. The recommendation offered is a URN for citation plus hashes for
verification, and **no domain until something outside the family needs to fetch the law over
HTTP**: a domain bought early is a dependency acquired early. **The author's to decide, and
nothing blocks on it.**

**The pack ships the cross-medium instrument reporting NOT PROVED**, and says so in §4
rather than omitting it — an instrument that reports what is missing is worth more than one
that passes by not looking.

### S13b · The cross-medium fixture · `stzzui` · **small** · *added 2026-08-15* · **the keystone**

> **One declaration, rendered into two media, compared for what survived.**

Every instrument this project has built proves something about *one* artifact: the
verifier proves a `.zui` file's verdict, the envelope proves a diagnostic's shape, the
matrix records what a medium carries. **Nothing proves the sentence the whole second
founding rests on** — *one declaration, many renderings, one law.* Until something does,
that sentence is an argument rather than a test, and every drift this project has actually
suffered happened in exactly that gap: three colour vocabularies, a four-value engine
beside a five-value one, a hand-typed census under a heading claiming it was computed.

Not a pixel comparison — a **semantic** one. Render one declaration into two media and
assert that the same intents are served, the same meanings carried, the same rights
reachable, the same refusals raised. Where a medium legitimately cannot carry something,
`conformance/media.json` already says so and the comparison **expects the absence** — the
matrix is what makes the assertion decidable instead of aspirational.

**Small in code, large in consequence.** The hard part is not the harness; it is deciding
what *"the same meaning survived"* means mechanically, and that decision is the deliverable.
Reasoned in [THE-INTERACTION-MODEL.md](THE-INTERACTION-MODEL.md) §7.

**Wants S8** in practice, not in principle: the model has met two media in anger, visual
and auditory, and the visual expression grammar is what gives the comparison a second side
with enough substance to be worth comparing.

### Built 2026-08-17 — and it reports NOT PROVED, which is the result

`tools/zui/cross-medium.js` with `conformance/cross-medium/`. The mechanical definition of
*"the same meaning survived"* — the part the plan called the whole difficulty — turned out
to be this:

> **Every difference between the two renderings is one the published data already
> predicted.**

Not sameness, which would be false. Three verdicts: **predicted** (the data accounts for
it), **undecided** (the data is silent — nothing contradicted, nothing proved), **drift**
(the data is contradicted). Only the first passes.

**What it found.** **Zero drift**, and five intents crossing both pairs intact — including
`visual vs print`, the hardest honest case, put in the enumeration because print has no
time and no interaction. The four predicted differences are auditory's degradations of
`SCAN`, `LOCATE`, `COMPARE` and `READ`, each already in the matrix. **The model held.**

**And the claim is still not proved**, for exactly one reason: `signal.json` records no
rendering for the **visual** channel, because that channel implements four of the law's
five values. **The missing `:Muted` is no longer a tidiness finding** — it is the single
thing standing between this project and proving its central claim, and it blocks precisely
the pair where both channels shipped.

Two bugs were caught in the runner itself and both are recorded in its README: two silences
compared equal and vanished from the report (an unverified agreement passing as a proved
one — the exact failure the instrument exists to prevent), and `undecided` was first
collapsed into `drift`, which cries wolf.

## 6. Track C — adoption by the siblings

Each is small once its contract exists; none may start before it does.

| # | Repo | Adopts | Precondition |
|---|---|---|---|
| S14 | `stzlib` graphics | the reconciled SIGNAL vocabulary; theme export (their C5) and the light/dark switch they already flagged as needed by StzZui | S1 |
| S15 | `stzlib` sound | sound semantics, priority, ducking, the audibility floor | S7 |
| S16 | `ringface` | the expression vocabulary as `.face` bindings — `.face` already binds screens to entities and is the natural carrier | S5, S8 |
| S17 | `zing` | re-pin; `zing check` gains the expression diagnostics; delivery cites the medium | S8, S9 |
| S18 | `microring` | the `haptic` and device media | S5, S10 |
| S19 | `ringine` | the `spatial` medium; the game plane's own signal vocabulary | S5, S8 |
| **S20** | **`stzlib`** | **`base/culture/` — the culture model itself**, prompt at [`doc/prompts/culture-module.md`](prompts/culture-module.md) | none hard |

**S20 is not adoption of anything — it originates in stzlib**, and it is listed here only
because that is where the sibling work lives. It can start before StzZui ratifies
anything, because the model is general: *a locale formats, a culture interprets.* It docks
with `engine/SOFTANZA_LOCALE_PLAN.md` (L0–L1 done, L2–L4 open) and sits above `base/i18n/`,
which already exists and is partly a facade — hence the module's own first law, **no
facades: an operation either honours the culture it was given, or refuses.**

## 7. The dashboard

**Status as of 2026-08-13, end of day.** The ratification pass closed the gate that held
Track A, so the shape of this table has changed more in one day than in the week before it.

| # | Track | Repo | Status | Note |
|---|---|---|---|---|
| **S2** | 0 | stzzui | ✅ **done** | Rule 62 → `tool` (not `machine`; tier corrected at ratification) |
| **S5** | A | stzzui | ✅ **done** | `SURFACE_AS` closed to ten, matrix as data, 2 diagnostics, suite 34/34 |
| **S6** | A | stzzui | ✅ **done** | A-1…A-4 applied at v3.9; Rule 82 is *Perceivable State* |
| **S7** | A | stzlib | ✅ **done** | `stzEarcons` shipped, adopting the law's five values on principle |
| **S21a** | C | stzlib | ✅ **done** | `RectsOfRange` · `CaretRectAt` · `IndexAtPoint` — the G1 gate |
| **S4** | 0 | stzlib | ✅ **done** | the plane found it first; it became **Rule 125** |
| S1 | 0 | stzzui + stzlib | 🟡 **half** | law side done (A-5, `Error`→`Danger`); **the engine has not been told** |
| S3 | 0 | stzzui + stzlib | 🟡 **half** | law → instruments done (C-1); the reciprocal citation is not |
| S9b | A | stzzui | 🟡 **part** | A-6 and A-7 are law; `CONVENTION` and medium × culture unbuilt |
| **S21** | C | stzlib | 🔵 **running** | G1 cleared; `.stzui` v0.1 shipped; finding filed |
| S20 | C | stzlib | ⚪ ready | culture module — prompt refreshed for v3.9 |
| S4c | 0 | stzlib | ⚪ ready | locale defects — all three re-verified |
| S4d | 0 | stzlib | ⚪ ready | regex divergences — all three re-verified |
| S8c | A | stzlib | ⚪ ready | stzCSS — §5 corrected, already-done part removed |
| S4b | 0 | stzlib | ⚪ ready | the colour table's hard-coded culture, unfiled |
| **S8** | A | stzzui | ✅ **done** | `signal.json` v1.1; Rules 3 ↔ 118 ruled at law v3.11; `SIGNALS` + 3 diagnostics at language **v1.2**; suite 40/40 |
| S8b | A | stzzui + siblings | ⏸ waits | `stzSense` v0 — wants S8 |
| S9, S10 | A | stzzui | ⏸ waits | ROLE + MESSAGE, then STRUCTURE + MOTION + TEMPO |
| **S13** | B | stzzui | ✅ **done** | the protocol pack: `protocol/` + `pack.js`, 12 files hashed, prose checked against the manifest, identity question stated not decided |
| S11–S12 | B | stzzui | ⏸ open | the commons and the capture loop; ungated, untouched |
| **S13b** | B | stzzui | ✅ **built** | the keystone runs: **0 drift, 5 intents crossing both pairs**. Reports NOT PROVED — `signal.json` is silent on visual, because the colour plane lacks `muted` |
| S14–S19 | C | siblings | ⏸ waits | their contracts |

**Six done, three half, one running, five ready to launch.**

**The critical path is clear.** S1 → S7 was the one piece of timing that could not be
recovered, and it held: the sound plane deferred to the law rather than inventing a
vocabulary, so `stzEarcons` and Rule 118 agree without anyone having to reconcile them
afterwards.

**What now blocks most**: nothing is gated on a ruling any more. The three half-done items
are all *the same shape* — **the law moved and the engines have not been told.** S1's
reconciliation, S3's reciprocal citation and S4b's culture finding are three notes to
`stzlib`, and together they are less than a session.

**The largest ungated item is still S20**, the culture module. **The most valuable
unblocked one is S8** — SIGNAL in the visual channel — because it is the first expression
grammar written in full, and it sets the pattern the other five copy.

## 8. Where the work now lives — corrected 2026-08-13

**This plan is no longer the dispatcher, and should not act like one.** Session briefs live
in **`softanza/prompts/`**, numbered, where the Central session synchronises them. Writing
them into `stzzui/doc/prompts/` was this session working outside the family's own system.

Everything outstanding was filed there as **prompts 21–27**:

| # | Session | Carries | Detail lives in |
|---|---|---|---|
| 21 | StzLib — GUI implementation | the `.stzui` finding, 3 requests | `doc/findings/gui-stzui-v01.md` |
| 22 | StzLib — Graphics engine | the semantic colour seam, 4 items — **this is S1 + S3 + S4b, consolidated** | `doc/findings/graphics-semantic-colour.md` |
| 23 | StzLib — general tasks | six re-verified defects — **S4c + S4d** | `doc/prompts/locale-defects.md`, `regex-defects.md` |
| 24 | Zing | re-pin v3.7.3 → v3.9 — **not previously in this plan** | — |
| 25 | Softanza — Central | the two contract questions — **§10 decision 3, dispatched** | `THE-SECOND-FOUNDING.md` §7.3, §4.6.3 |
| 26 | *(new session)* | the culture module — **S20** | `doc/prompts/culture-module.md` |
| 27 | *(held)* | `stzCSS` — **S8c**, ready and deliberately not launched | `doc/prompts/stzcss-design.md` |

**Two things this changes about the plan's own status.** Track 0's three half-done items
are no longer half-done *here* — they are one consolidated finding, filed, and their
completion is the graphics session's. And **§10's decision 3 is no longer an open question
this document holds**; it is prompt 25, in the only repository that can answer it.

**The detailed findings stay in `stzzui`** and are referenced rather than copied, so there
is one source of truth per piece of work. The numbered prompt is the brief; the finding is
the evidence.

**What this plan is for now**: StzZui's own remaining work — **S8**, then S8b, S9, S10, and
Track B's untouched commons items. Everything addressed to another repository has left.

## 8. Six traps

1. **StzZui must not build a renderer.** Six strata is an invitation to implement. StzZui
   owns vocabulary, law and court; the planes own the engines. The moment this repository
   computes a colour or a waveform, the split that makes the vision safe is gone.
2. **Do not race the live sessions.** The sound session runs with cwd `softanza`; the
   graphics plane had uncommitted C3 work. Coordinate through the author, not through the
   tree.
3. **Do not edit ratified documents unilaterally.** `REFERENCE_DESIGN.md` is v1.3 and
   amends by its own process; the founding document proposes one row and applies nothing.
4. **Extract, never invent.** Every stratum must be drawn from rules that already exist —
   the discipline C2 was delivered under, and the reason it was uncontroversial.
5. **Never add a verb.** The closed 22 are what make the medium matrix finite.
6. **`.face` and SN6 harden on their own clocks.** Both reach outward soon. A vocabulary
   agreed before they do costs a document; agreed after, a migration.

## 9. What lands where

| Artifact | Home | Why |
|---|---|---|
| The strata grammars, the medium matrix, the law | `stzzui` | it owns the vocabulary and the court |
| Colour computation, themes, contrast | `stzlib` graphics | it owns the engine |
| Sound synthesis, timing, sinks, priority, ducking | `stzlib` sound | same |
| Composition and binding | `ringface` `.face` | already shipped v0 |
| Delivery | `zing` | already |
| Session prompts, once ratified | `softanza/prompts/` | the family's program home |
| The book | its own repo, later | §10.5 |

## 10. Decisions the author owes before Track A opens

1. **Ratify, amend or reject the Second Founding** — section by section, in the manner of
   the reference design. `ROLE` (§5) is the move most worth attacking: if a role is a
   widget wearing a disguise, the stratum falls and much of Track A shrinks.
2. ~~**The five semantic values.**~~ **Answered by evidence, 2026-08-12** — see S1 and
   docket A-5. The sound plane adopted the law's five and rendered `muted` as silence,
   which settles both sub-questions: `Error → danger` is a correction, and `muted` and
   `:Neutral` are two concepts rather than two spellings, so reconciliation adds a value.
   What remains for the author is ratifying A-5, not deciding it.
3. **Who owns the medium axis, and is culture a contract?** Two versions of one question.
   Either StzZui owns the medium axis as part of the interface vocabulary (this plan's
   assumption), or it is family-wide and belongs in the reference design as a **Medium
   Contract** — it bears on `.face`, both planes and the device family. **Culture is the
   stronger candidate of the two**: `stzCulture` would be consumed by StzZui, Zing and
   Bedrock (name models, workweeks, fiscal calendars carried in records), Narrations, both
   planes and the device family, and it originates in stzlib rather than here — which is
   the exact profile of C1 and C7. If either becomes a numbered contract it is
   **C8/C9 in `REFERENCE_DESIGN.md`, by that document's own amendment process, not ours.**
   Neither is a docket matter: the docket holds constitutional acts, and a horizontal
   contract is not one.
4. **Does Track 0 proceed before ratification?** This plan assumes yes, on the ground that
   its four items are corrections of observed drift. Say no and the critical path moves.
5. **When does the book start?** It should trail the artifacts, since its discipline is
   that every checkable claim is generated from them. Starting it early risks the book
   fixing a vocabulary the programme is still moving.

## Honest boundaries

- **This plan is derived from an unratified document** and inherits every one of its
  uncertainties. It is a decomposition, not a commitment.
- **The sizes are judgement, not estimates.** Nothing here has been prototyped; "medium"
  means "a session", not a measured quantity.
- **No sibling has agreed to anything.** Track C is written as though the siblings will
  adopt; each of them decides that in its own repository, by its own process.
- **Track 0 assumes the drift findings survive contact with their owners.** They were
  established by reading two plans and one rules file on 2026-08-12; the owners may have
  context that dissolves them.
