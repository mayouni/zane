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
3. `engine/SOFTANZA_LOCALE_PLAN.md` — **the active plan for layer one.** L0 and L1 are
   done; **L2, L3 and L4 are not started.** This module docks with that plan; it does not
   compete with it or route around it.
4. `base/i18n/` — `stzLocale.ring`, `stzCountry.ring`, `stzLanguage.ring`,
   `stzScript.ring`, `stzCurrency.ring`, and `base/data/stzLocaleData.ring`.
   **Extract, never invent**: whatever is real there, this module consumes.

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

### 1. `base/culture/SOFTANZA_CULTURE_PLAN.md`, the plan of record

Beside the code, as the graphics and sound plans are — with a session bootstrap, numbered
FACTs *surveyed rather than assumed*, lessons inherited from the sibling planes, the
vendor decision as a comparison table with kills recorded in writing, phases, "Risks,
named now", and one STATUS section per phase carrying measured numbers and what it did
**not** measure. Kill criteria written before the numbers. A **challenge pass before the
faces**, as GR4 and SN4 both did.

Phase 0 is a spike answering one question: **is there any defensible source of meaning
data, or must all of it be contributed?** The answer shapes everything after it, and the
honest expectation is *contributed* — there is no CLDR for meanings.

Register the module in `base/stzBase.ring` with the house comment naming its phase and
plan. Guards go in `base/test/culture/` as narrated scenarios. Follow the naming law
verbatim: a method is an explicit verb, `...Q()` returns the main object, `To...()`
returns data.

### 2. The two layers, structurally separate — and layer one already exists

**`stzLocale` is not yours to create.** `base/i18n/` is ~3,500 lines across five classes,
and `engine/SOFTANZA_LOCALE_PLAN.md` governs it. `stzCulture` sits *above* it.

> **A culture may reference locales; a locale must never reference a culture.** If the
> dependency ever points the other way, the separation has failed.

**But survey layer one before you build on it, because parts of it are a facade.** What a
read of the tree on 2026-08-13 found — verify each yourself rather than taking this list
on faith:

| Capability | State |
|---|---|
| Locale/country/language/script/currency tables | real, broad, Qt-shaped (`QtNumber` still column 1) |
| Unicode normalization (all four forms, utf8proc) | **done properly** |
| First-day-of-week, decimal point, group separator | genuinely locale-derived in `stzLocale` |
| Number formatting | **hardcodes `.` and `,`; never consults `stzLocale`** — and the Ring and Zig layers disagree with each other |
| Locale casing | **facade at three levels** — the locale argument is accepted and discarded; no `tr`/`az` path; the Turkish dotless *i* is a documented `#TODO` |
| Collation / locale-aware sort | **does not exist** — every sort is byte or codepoint ordinal |
| Digit shaping (Arabic-Indic, Devanagari) | **does not exist**; recognition only |
| Non-Gregorian calendars | **do not exist** — the engine states proleptic Gregorian; `stzCalendar` is a business planner, not a calendar system |
| Time zones | **do not exist** |
| Bidi + Arabic shaping | excellent — **and only inside GPU glyph layout**; there is no bidi service for a plain string |

### 2.1 The law that follows from that table

> **No facades. An operation either honours the culture it was given, or refuses.**

This is the single most important rule for this module, and it is not a style preference.
The library today has APIs that *accept* a locale and *discard* it — a caller believes they
received locale-sensitive casing and did not. That is the code equivalent of the fake
progress bar Rule 18 forbids: *"a fake progress bar is a lie."*

For a culture module the failure mode is worse than useless. **A module about not getting
culture wrong, built on facades, gets culture wrong while reporting success** — and the
caller ships it. So: any operation that resolves through layer one must either work or
raise. `UnsupportedCulture` is a good answer. Silently returning the invariant is not.

Where this module needs something layer one has not built — collation, digit shaping, a
Hijri calendar — **that is a finding for the locale plan's L2–L4, not work to duplicate
here.** File it and refuse; do not quietly reimplement.

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
- **Do not restate what the library already does** — and do not assume it does. Unicode
  normalization is real; collation, digit shaping, time zones and non-Gregorian calendars
  are not. Consume the first, file the rest.
- **Do not reach for ICU or CLDR-at-runtime.** L0 already decided this and the reasoning
  stands: the library dropped libcurl for a Zig HTTP client, chose SheenBidi + HarfBuzz
  over ICU for bidi and shaping, and built regex on PCRE2. If this module needs external
  data, follow the established path — *generate offline, commit the output* with a
  provenance header, sized by what the library answers today, and own the refresh.

## Three defects found in passing — file them, do not fix them here

None is culture's work. All three sit in layer one, and each is a finding for the locale
plan in the genre this library already uses for cross-plane findings.

1. **Hebrew is reported `Neutral`, not RTL.** `engine/src/string/locale.zig:110-114` uses
   the wrong utf8proc constants — it treats RLE and CS as RTL, NSM as LTR, and misses R
   entirely. The Ring layer uses the correct numbering, so **the two layers disagree**.
   Two-line fix, and it is squarely in this module's blast radius.
2. **`stzNumber.ApplyFormatXT` has a dead option.** It reads `:FractionalSeparator` into
   one variable and emits a different, unassigned one (~lines 7622, 7629), so the option
   does nothing; lines after the `return` are unreachable.
3. **A wrong answer is enshrined in a test.**
   `base/test/datetime/76_example_15_counting_from_islamic_calendar.ring` records
   1400 AH → 2021-08-13. 1400 AH is 1979–80 CE. The arithmetic treats the Hijri year as
   365 days. **A guard that asserts a wrong answer is worse than no guard**, and this one
   sits exactly where culture and calendar meet.

---

Commit locally, plain factual messages, push nothing without my review. If the two-layer
split turns out to be wrong — if locale and culture cannot be separated cleanly in
practice — say so and say why. That refusal would be the most valuable outcome available
to this session, because the entire design rests on the separation holding.
