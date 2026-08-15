# The interaction model — one declaration, many renderings, one law

**Status**: **v0.1 — a synthesis, not a proposal for ratification.** Written 2026-08-13.
**Synthesises**: [THE-SECOND-FOUNDING.md](THE-SECOND-FOUNDING.md),
[STZSENSE.md](STZSENSE.md), [SENSORS-AND-ACTUATORS.md](SENSORS-AND-ACTUATORS.md),
[GUI-SYSTEM.md](GUI-SYSTEM.md).
**Claims nothing new.** Everything here is already in those documents; what is new is that
it is one thing.

---

## 1. The question

*Can there be a unified mental, conceptual and computational model of user interaction —
one that holds whatever the system, the solution or the technology?*

The temptation is to answer by unifying everything. **That answer would be false**, and
worth refusing before starting: print has no time, haptic carries almost nothing, and
culture cannot be enumerated. The capability matrix exists precisely to record that
renderings are **irreducibly different**. A model that hid those differences would be
worse than no model, because it would promise portability it cannot deliver.

So the real question is narrower and answerable: **what is unified, what must stay
diverse, and is the seam between them declared or merely hoped for?**

## 2. The answer was already found — three times, by three planes that were not looking for it

This is the strongest evidence that the model is real rather than imposed.

| plane | what it said | for its own reasons |
|---|---|---|
| **sound** | *"the sink is a parameter, not a fork"* — buffer, file, device and WebAudio are one graph rendered four ways, *"so what you hear and what you export cannot drift"* | to keep offline and realtime honest |
| **RingFace** | the **two-surface doctrine** — a builder *emits* a closed artifact, re-judged on arrival | to keep authoring and shipping separable |
| **the family** | **contracts are the substrate** — an asset consumed by many lives in none of them | to keep ownership clean |

Three independent statements of one shape: **one description, many realisations, no drift
between them.** None cited the others. None was arguing about interaction design.

> When three parts of a system independently discover the same law for unrelated reasons,
> the law is a property of the system, not of the people who wrote it down.

## 3. The sentence

> **One declaration, many renderings, one law.**

- **One declaration** — what the human is trying to do, and what things mean. Medium-blind,
  culture-blind, technology-blind. This is the thing; the interface is its shadow.
- **Many renderings** — screen, sound, voice, lamp, page, sign, actuator; per medium, per
  culture, per device. **Genuinely different, and never pretending otherwise.**
- **One law** — the invariant that must survive every rendering, and the court that refuses
  when it does not.

The mental model is that short. The rest of this document is whether it is *computable*.

## 4. Stated as a function

```
        declare :                          → Meaning        (.zui, closed vocabularies)
        resolve : Meaning × Medium
                          × Culture
                          × Context        → Perceptible    (.sense, the engines)
        judge   : Declaration × Law        → Refusal | ()    (the courts, C2 envelope)
```

Four properties make this a computational system rather than a metaphor, and **each is
already built**:

1. **The input vocabularies are closed.** 22 verbs, six strata, ten media, five semantic
   values. Closure is what makes a coverage matrix finite — and finiteness is what makes
   *checkable* possible at all.
2. **Capability is data, not folklore.** `conformance/media.json` records what each medium
   carries, as `native`, `degraded` or `absent`. A rendering that cannot carry an intent is
   a fact a machine reads, not a thing a designer remembers.
3. **Refusal has one shape.** C2's envelope — `{code, severity, message, span, cites,
   language}` — so a programmer learns one refusal format and has learned them all.
4. **Agreement is proved, not asserted.** Fixtures with lawful twins; 34/34 today.

## 5. What is unified, and what must not be

The whole discipline is in this table. Getting it wrong in either direction breaks the
system — over-unify and it lies; under-unify and it is a pile of parts.

| unified — one, always | diverse — many, necessarily |
|---|---|
| the **intent** (22 verbs, closed) | how each medium *serves* an intent, or cannot |
| the **meaning** (semantic values) | what colour, timbre, waveform or word carries it |
| the **law** (119 rules) | which instrument can enforce which rule, and where |
| the **refusal envelope** (C2) | each court's own codes |
| the **ports** (render · sense · actuate) | every device's actual transducers |
| the **question** *"what does this mean, and to whom?"* | every answer to it |

**And the seam is declared, not hoped for.** `SURFACE_AS` names the medium. The matrix
names the capability. The culture axis names the reading. A rendering that silently assumed
any of these is exactly what the medium enumeration closed.

## 6. Four things missing before it is real

Honest accounting. The model is coherent; it is not yet *whole*.

**6.1 · The declaration is spread across four artifacts.** `.zui` carries intent, `.face`
composition, `.stzui` a projection, `.sense` the meaning-to-rendering resolution. *"One
declaration"* is currently a claim about four files that do not reference each other.
**This is the largest threat to the model**, and the cheapest moment to fix it is before
each grows a corpus — which is why the `.stzui` finding asks for an intent slot now.

**6.2 · Judgment is per-language, not per-system.** C2 unified the *envelope*; nothing
unified the *act*. There is no single question *"is this interface lawful?"* — only
`zui check`, then the `.stzui` court, then whatever `.face` does. A system whose parts are
each lawful can still be unlawful between them.

**6.3 · Context is unmodeled.** `resolve` takes a Context in §4 and nothing declares one.
Which media are available, which culture the operator reads in, what this device can
actually do — all implicit. Until it is declared it cannot be checked, and *"whatever the
technology"* stays aspirational.

**6.4 · Nothing proves cross-medium agreement.** Fixtures prove `.zui` verdicts. **Nothing
renders one declaration into two media and compares.** Every drift this project has
suffered — three colour vocabularies, a four-value engine beside a five-value one, a
hand-typed census under a heading claiming it was computed — happened in exactly that gap.

## 7. The keystone

Of the four, **6.4 is the one that converts the model from argued to proved.**

> **A fixture that renders one declaration into two media and compares what survives.**

Not pixel comparison — *semantic* comparison: the same intents served, the same meanings
carried, the same rights reachable, the same refusals raised. Where a medium legitimately
cannot carry something, the matrix already says so and the comparison expects the absence.

That single instrument would do what nothing else can: **prove that one declaration
produced two renderings and lost nothing the law protects.** Without it, *"one declaration,
many renderings"* is a good sentence. With it, it is a test that fails when someone breaks
it — which is the only difference this project has ever cared about.

## 8. "Whatever the technology" — that part has a name

The portability claim rests on nothing being shared *except data*:

- the law, as `rules.json`, pinned by hash
- the grammars, in EBNF and as fixtures
- the media enumeration and capability matrix, as JSON
- the refusal envelope, as a schema
- the sense sheet, when it lands

**No runtime, no framework, no library.** An implementation in any language proves
agreement by running the fixtures — which is exactly how a Zig verifier beside a JavaScript
one was made safe, and why writing the fixtures first was worth doing.

That bundle already has a name and a number in the programme: **the protocol pack, S13**,
and it is untouched. **The answer to "whatever the technology" is not a new idea — it is a
scheduled one nobody has started.**

## 9. What this changes about the roadmap

Nothing structural, and that is the point — but it does reorder what matters:

- **S13, the protocol pack**, rises. It is the answer to the portability half of the
  question, and it is sitting in Track B untouched.
- **A cross-medium conformance fixture** (§7) is not currently a numbered session and
  should be. It is small — one declaration, two renderings, one comparison — and it is the
  only thing that can prove the central claim.
- **The four-artifact problem (§6.1)** is a boundary question spanning StzZui, RingFace and
  the GUI plane. It belongs to Softanza Central, not here.

## Honest boundaries

- **This document invents nothing**, and if it reads as though it does, it is wrong.
  Everything is drawn from four existing documents and three planes' own words.
- **§5's table is the load-bearing claim** and the most contestable. If any row is on the
  wrong side, the model over-promises or under-delivers exactly there.
- **§7 has not been prototyped.** A cross-medium comparison sounds obvious and may prove
  hard: deciding what "the same meaning survived" means, mechanically, is the whole
  difficulty and is not solved by asserting it.
- **The model has met two media in anger** — visual and auditory. Print, luminous, signage
  and haptic exist on paper. A model that has not met a device has not been tested, and
  MicroRing is where that happens.
