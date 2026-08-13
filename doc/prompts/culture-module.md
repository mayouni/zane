# The culture module — culture as a first-class citizen of stzlib

**Run in**: `D:\GitHub\stzlib`

**Precondition**: none hard. StzZui's case for this is unratified, so **build a general
model, not a UI law.** If this module ends up encoding interface rules, it has been built
in the wrong repository.

**Standing**: proposed. `base/culture/` does not exist; nothing here is agreed.

---

You are opening the culture session. Read, in this order:

1. `D:\GitHub\stzzui\doc\THE-SECOND-FOUNDING.md` — **§4.6 only**, including §4.6.3. That
   is the case for the module and the statement of what it must not become. It is a
   proposal to you, not a specification of you.
2. `D:\GitHub\stzlib\libraries\stzlib\base\graphics\SOFTANZA_COLOR_SYSTEM.md` and
   `base/sound/SOFTANZA_SOUND_PLAN.md` — **for house style, not content**: how a plane
   states a mission, writes kill criteria before the numbers, names faces and guards, and
   records outcomes. Match them exactly. You know that style better than this prompt does.
3. Whatever the library already has for dates, calendars, number formatting, string
   casing, sorting, Unicode and text direction. **Extract, never invent**: if collation or
   digit shaping already exists, this module consumes it and does not restate it.

---

## The founding law of the module

> **A locale formats. A culture interprets.**
>
> A locale says how something is written down; a culture says how it will be read. A
> locale can be derived from a published standard; **a culture must be contributed.**
> **No call in this module may return a *meaning* from a locale identifier alone.**

That last sentence is the guard rail. Without it this module becomes a re-implementation
of `System.Globalization.CultureInfo` with a different prefix, which the library does not
need and which answers none of the questions that motivated it.

**What Microsoft got right, and where it stops.** `CultureInfo` is excellent at layer one:
number and date formats, calendars, casing, collation, the parent-culture fallback chain,
and a genuinely good split between `CurrentCulture` (the culture you *format* in) and
`CurrentUICulture` (the culture you *read* in). It has no answer to **what does red mean
here**, because formatting standards do not carry meanings. Softanza needs a **third**:
the culture that *interprets* — the audience's, which may be neither of the other two.

---

## Deliver

### 1. `SOFTANZA_CULTURE_PLAN.md`, the plan of record

Phased, with kill criteria written before the numbers, in the house discipline. Phase 0
should be a spike that answers one question: *is there any defensible source of meaning
data, or must all of it be contributed?* The answer shapes everything after it.

### 2. The two layers, structurally separate

`stzLocale` (or whatever the library already calls this) is mechanical, tabular, derivable
from a standard. `stzCulture` is semantic, contributed, evidenced. **A culture may
reference locales; a locale must never reference a culture.** If the dependency ever
points the other way, the separation has failed.

### 3. The model — and it should be a model, not a lookup table

The concepts, offered as a starting vocabulary to improve or refuse:

- **Sign system** — a *closed* set of kinds: colour, sound, shape, gesture, number,
  direction, time, name. Closed because the signature move needs it closed; extended only
  deliberately.
- **Sign** — a value in a system: `red`, `rising-contour`, `octagon`, `thumbs-up`, `4`,
  `Friday`.
- **Meaning** — the semantic target: `danger`, `gain`, `mourning`, `rest-day`.
- **Reading** — sign + culture → meaning, carrying a **strength** (`settled` ·
  `common` · `contested`) and its **evidence**. Strength is not optional: a culture is not
  monolithic, and a model that cannot say *contested* commits the essentialism it exists
  to prevent.
- **Inversion** — a first-class relation: two cultures assigning **opposite** meanings to
  one sign. This is the highest-value data in the module, because inversion is where harm
  concentrates. `:Success = green` and `:Danger = red` invert in Chinese, Japanese, Korean
  and Taiwanese financial convention, where red is gain — which is a live defect in
  `base/graph/stzDiagramColor.ring:45` today.
- **Hazard** — a sign that must not be used, or must not be *conscripted*, with a severity
  (`offensive` · `unlawful` · `diplomatic`).
- **Norm** — the boundary items that are half locale and half culture: workweek, calendar
  system, name model, address model, honorifics. **Say which half each is.**

### 4. The operations

```
ReadingOf(sign, culture)              -> meanings + strength + evidence
SignFor(meaning, culture, system)     -> the rendering        <- what StzZui needs
Inversions(cultureA, cultureB)        -> the conflict set
IsHazardous(sign, culture, usedAs)    -> severity or none
Invariant()                           -> the culture-free baseline
Parent(culture)                       -> the fallback chain
```

**`usedAs` is load-bearing and is the whole design of hazard.** A national flag is the
*correct* sign for country of registration on a customs form and a political claim when
conscripted to mean a language. The API must be able to answer differently for
`:asLanguageLabel` and `:asCountryOfRegistration`, or it will forbid legitimate use and be
rightly ignored.

### 5. The invariant culture, and the identifier rule

Mirror `InvariantCulture`, and state the rule it exists to enforce:

> **Identifiers and stored data use the invariant. Only human-facing text uses a culture.**

This is not theory. Culture-sensitive casing breaks identifier comparison — the Turkish
dotless *i* is the canonical case, where uppercasing and lowercasing an ASCII identifier
does not round-trip. Anything written to Bedrock, to `world.json`, to a `.zql` literal or
to a file format is invariant by construction.

### 6. The governance of the data

There is no CLDR for meanings. So this module's data **cannot be bought, scraped or
generated** — it must be contributed and evidenced, which means it inherits the commons
governance StzZui proposes, by necessity rather than by choice:

- Every reading carries evidence and a strength.
- **A reading contributed by someone outside the culture it describes is inadmissible.**
- A refusal, recorded with its reason, is as valuable as an admission.

### 7. Guards

In the plane's own narrated-Ring genre. At minimum: the two-layer separation holds (no
meaning derivable from a locale id), the invariant round-trips identifiers under hostile
casing, `usedAs` distinguishes conscription from use, and inversions are symmetric.

---

## The first finding the model should be able to express

Use this as the worked example, because it is real, live, and in this library.

`base/sound/stzEarcons.ring:354` states: *"Rising means good and falling means bad, which
is the one mapping that is close to universal across musical cultures."* The motifs then
use fourths and fifths — the intervals most widely shared across musical systems —
deliberately avoiding the major/minor third that carries most of the Western affective
loading. **That is a good instinct and a defensible call.**

Two residual questions the culture model should be able to *hold*, not settle:

1. The universality claim is asserted rather than cited. Under Article VII discipline that
   is exactly the kind of claim that wants evidence — and `strength: common` may be the
   honest value rather than `settled`.
2. **In tonal languages — Mandarin, Cantonese, Yoruba, Vietnamese, Thai — pitch contour
   carries lexical meaning.** A rising contour is not perceptually neutral for a listener
   whose language uses contour to distinguish words. Whether that interferes with earcon
   recognition is an *empirical question*, not a known defect.

The sound plan already carries kill criterion SS1 on which of contour, interval, duration
and timbre actually carries identity. **That measurement can answer this at no extra cost
by running across listener populations rather than one.** Hand this to that session as a
cross-plane finding in the genre it already uses; do not change their motifs.

---

## Do not

- **Do not return a meaning from a locale identifier.** `ar-SA` and `ar-AE` format
  identically and are not the same culture; `zh-CN` does not tell you whether red is gain.
- **Do not model a culture as monolithic.** `contested` must be expressible.
- **Do not ship readings for cultures nobody in the loop belongs to.** An empty module
  that admits what it does not know is worth more than a full one that guesses. A model of
  culture written from outside every culture it describes is the failure it exists to
  prevent.
- **Do not vendor a "meanings" dataset.** There is no authoritative one; anything claiming
  to be is someone's guess with a version number.
- **Do not put UI law here.** Which meanings an interface *must* express, and which
  conflicts are *refusable*, are StzZui's. This module answers what things mean; it never
  says what an interface owes.
- **Do not restate what the library already does.** Casing, collation, dates, Unicode: if
  it exists, consume it.

---

Commit locally, plain factual messages, push nothing without my review. If the two-layer
split turns out to be wrong — if locale and culture cannot be separated cleanly in
practice — say so and say why. That refusal would be the most valuable outcome available
to this session, because the entire design rests on the separation holding.
