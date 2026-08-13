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

### S8 · SIGNAL in the visual channel · `stzzui` · **medium-large**

The first expression grammar written in full — the channel where the law is richest and
an engine already exists. It sets the pattern the other five strata copy, so it is worth
doing slowly.

### S9 · ROLE + MESSAGE · `stzzui` · **large**

The two strata carrying the most `judgment`-tier rules and the most daily pain. `ROLE` is
the load-bearing move of the whole vision and should be attacked before it is built.

### S8b · ZSS v0 — the semantic style sheet · `stzzui` + `stzlib` + `ringface` · **medium** · *added 2026-08-13*

Reflection written: [ZSS.md](ZSS.md). The serialization of *meaning → rendering*, which is
what makes the semantic system governable rather than merely implemented — the project's
signature move applied to rendering for the first time.

**v0 is deliberately tiny**: `SIGNAL` only, in `visual` and `auditory` only, because that
is the only part of the system that exists. Its whole job is three tests — round-trip the
seven existing colour themes with no loss, express the CJK financial inversion, and
serialize the earcon set — and if it cannot do them the idea is wrong and we learn cheaply.

**Do it with RingFace in the room, not near them.** `.face` shipped v0 and is hardening;
two composition-adjacent formats designed apart will grow into each other.

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

### S13 · The protocol pack · `stzzui` · **medium**

What a participant downloads and pins: the law, the grammars, the medium matrix, the C2
envelope, the fixtures, the contribution protocol. Plus the open question of a neutral,
citable identity for the standard.

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

| # | Track | Repo | Size | Gated on |
|---|---|---|---|---|
| S1 | 0 | stzzui + stzlib | small | one decision (§10.2) |
| S2 | 0 | stzzui | small | — |
| S3 | 0 | stzzui + stzlib | tiny | S1 |
| S4 | 0 | stzlib | tiny | — |
| S5 | A | stzzui | medium | ratification |
| S6 | A | stzzui | medium | ratification |
| S7 | A | stzzui + stzlib | medium | **S1** · before SN6 |
| S8 | A | stzzui | medium-large | S5 |
| S9 | A | stzzui | large | S8 |
| S10 | A | stzzui | large | S8 |
| S11 | B | stzzui | medium-large | ratification |
| S12 | B | stzzui + an app | medium | S11 |
| S13 | B | stzzui | medium | S5, S11 |
| S9b | A | stzzui | medium | ratification + S20 |
| S14–S19 | C | siblings | small each | their contract |
| S20 | C | stzlib | large | none hard |
| S4b, S4c | 0 | stzlib | tiny / small | — |

**Six sessions can run today**: S2, S4, S4b, **S4c** (the three defects), **S20** (the
culture module), and S1 now needing only ratification of docket A-5 rather than a
decision. Everything else waits on a ruling or a predecessor.

**S20 is the largest unblocked item in the programme** and the only one that is large
*and* ungated — worth knowing, because it will take longer than everything else in this
table put together.

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
