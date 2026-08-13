# The Second Founding — StzZui as a complete platform for interfaces

**Status**: **v0.4 — proposed, not ratified.** Written for the author's section-by-section
pass, in the manner of the reference design's own ratification.
**Supersedes** v0.1 (six strata, one medium assumed), v0.2 (eight media, enumerated) and
v0.3 (the physical media, and media classified by properties).
**v0.4 adds the third axis: culture.** A stratum says what an expression does, a medium
says where it is carried, and neither says what it *means to the person receiving it*.
With it come a principled Core/Commons boundary, a hazard class the fifteen forbidden
patterns do not cover, and a defect in this project's own colour table.
**Amends**: [ARCHITECTURE.md](ARCHITECTURE.md) (founding document, 2026-08-05), whose
three-layer model this restates rather than replaces.
**Touches**: `softanza/REFERENCE_DESIGN.md` v1.3 — amendments proposed in §7, **not
applied**; that document is ratified and amends by its own process.
**Preserves**: everything in §3. The inversion is not negotiable and is not negotiated here.

---

## 1. Two findings

StzZui inverted the order of interface design and made intent declarable. That work is
sound, it is finished, and it is the foundation everything below stands on. It is also,
today, a fraction of a platform — and the project's own data says so twice.

### 1.1 The law legislates a territory the language cannot declare

The constitution holds **119 rules**. Their enforcement tiers, **measured against
`rules.json` v3.9** — every figure in this document is anchored to a law version, because
a document that argues about drift and then drifts is worth nothing:

| Tier | Rules | Share | Meaning |
|---|---|---|---|
| `judgment` | 79 | 66% | a human decides, until an instrument is invented |
| `machine-later` | 25 | 21% | **the law's own admission that the instrument is missing** |
| `machine` | 9 | 8% | a declaration checker refuses it |
| `tool` | 6 | 5% | measured by a runnable instrument |

*(Measured at v3.7.3: 117 rules, 78 `judgment`, 5 `tool`. At v3.8, after Rule 126:
118 and 79. At **v3.9**, after the docket ratification of 2026-08-13: **119 rules**, Rule 62
promoted off `machine-later` to `tool`, and Rule 125 entering at `machine-later` — so the
two moves cancel and only `tool` changes. **The finding this table exists to support is
unmoved: 8% of the law is refusable before a pixel exists.**)*

**Eight percent of the law is refusable before a pixel exists.** That is not a failure of
the verifier, which enforces 19 of its 20 diagnostics and passes 30/30 fixtures. It is a
failure of *expressible surface*: there is nothing in a `.zui` file for the other rules to
bind to. [DECLARATIONS.md §6](language/DECLARATIONS.md) states the boundary — *"No
`WIDGET`, no layout, no colour"* — while Sets 2, 3, 10, 13, 15 and 17 legislate exactly
that territory anyway.

Of the 25 rules marked `machine-later`, **all but one are expression rules**: colour
(3, 87, 56, 62), layout (85, 90, 92, 93, 95), widget role (46, 47, 96, 104), message
(28, 29, 41, 86, 106, 99), motion and timing (15, 18, 19, 21, 100). The exception,
Rule 26, is already reachable from intent and *is* cited by `MISSING_CANCEL`.

**The law went where the language refused to follow.**

### 1.2 The law is monomodal, and believes it is medium-agnostic

The preamble promises a law that is *"framework-agnostic, trend-resistant, and
machine-checkable."* The intent grammar's own note promises more: *"A new medium adds
renderings, never verbs."* The architecture lists five projections — business web, game
worlds, CLI/TUI, **voice**, AI-agent surfaces.

Here is what the 118 rules actually contain, by word, across the whole corpus (v3.8):

| Term | Occurrences |
|---|---|
| `sound`, `earcon`, `sonification`, `speech`, `tactile`, `vibration`, `braille`, `chime`, `beep`, `ambient`, `aloud` | **zero** |
| `audio` | 3 — all inside Rule 73, which treats audio as a *document attachment* (*"no autoplay… provide captions"*) |
| `voice` | 2 — both **typographic metaphor** in Rule 107 (*"a hero voice, a title voice"*) |
| `haptic` | 2 — Rule 69, *"Haptic Rhythm"*, whose body is entirely about **48px touch targets, overscroll bounce and swipe** and says nothing about haptic feedback |
| `screen reader` | 4 — Rules 60 and 104 |

So: **not one rule governs sound. Not one rule governs voice.** The single haptic rule
reaches for the medium in its title and delivers a touch-target rule in its body. The
only law about how an interface is *heard* is Rule 60, and it is written entirely in one
framework's vocabulary — *"`<main>`, `<nav>`, `<section>`… `aria-label`… `aria-live`"* —
inside a constitution whose preamble forbids exactly that. It cannot govern a voice
assistant, a phone tree, a car, or any screen reader outside the web.

Meanwhile the law's core concepts are all defined in one channel's terms: Rule 82 is
**Visible** State; Rule 51 says *"Focus is spatial"*; Rule 112 governs **motion**;
Rule 107 governs **sizes**; Set 2 is **Visual** Principles.

> **The constitution is a monomodal law wearing a medium-agnostic preamble.** It has been
> writing law for the eye and calling it law for the operator.

This is not an oversight to patch with a set of sound rules. It is a structural finding:
the law has no **medium axis**, so every rule silently assumes the one medium its authors
were looking at.

### 1.3 The demonstration

Two payment-approval surfaces. One humane. One committing seven real violations: cards
that look like information (119), three competing primaries (8), red for both brand and
danger (3, 87, 117), *"Invalid input!"* (40), undo buried in a menu (79), 11px body text
(105), a wall of text (123). Declared in Zui they are **byte-identical once comments are
stripped**, and both run clean at **Level 4**, the highest the suite defines:

```
clean — 1 file(s), 0 violations at level 4 against Zui v3.7.3
clean — 1 file(s), 0 violations at level 4 against Zui v3.7.3
```

Now add a third surface: the same flow rendered by a voice agent that mishears
*"approve"*, acts, and offers no way back. It, too, declares identically. It, too, runs
clean. **The court is silent in every medium, and silent in the new ones twice over.**

## 2. The evidence the project produced without noticing

While this repository legislated colour, `stzlib` **built** it.

- The constitution, **Rule 118, "Two Families of Colour"** (`invariant: true`): *"success
  (OK, valid, under control), warning (watch this), danger (critical, exceeded,
  incident), info (in progress, neutral), muted (waiting, inactive)."*
- The graphics plane, `SOFTANZA_COLOR_SYSTEM.md`: *"an author writes a meaning and gets a
  colour."* Semantic names `:Primary :Success :Warning :Danger :Info :Neutral`; role steps
  `:Danger.Surface / .Border / .Solid / .Text` and `:OnDanger`; OKLCH ramps *"monotonic,
  evenly spaced and hue-stable BY CONSTRUCTION rather than by taste"*; contrast carried as
  a number under both WCAG 2 and APCA, with a stated refusal — *"a design system that
  cannot fail an accessibility check does not have one."* C1 and C2 committed, 42/42
  pairs passing.

Two parts of one project independently derived the same five semantic values — one as
**law that cannot be enforced**, one as **an engine that cannot be governed** — and
neither document cites the other.

**The drift is already three-way, and two of the three are inside the law itself:**

| Source | Vocabulary |
|---|---|
| Rule 3, *Color Is a Signal* | `Neutral` · `Accent` · `Warning` · **`Error`** |
| Rule 118, *Two Families of Colour* | `success` · `warning` · **`danger`** · `info` · **`muted`** |
| The graphics engine | `:Primary` · `:Success` · `:Warning` · `:Danger` · `:Info` · **`:Neutral`** |

Three names for the critical value (`Error`/`danger`/`:Danger`), three for the resting one
(`Neutral`/`muted`/`:Neutral`), and an `Accent` that became `:Primary` and never reached
Rule 118. This is the exact defect the project exists to prevent, occurring inside it,
because the seam between meaning and rendering was never declared — and it is the best
possible proof that the seam is real.

One consequence is cashable immediately: **Rule 62 (Contrast & Legibility) is marked
`machine-later` while `StzIsLegible` already exists and is CI-gated.** The instrument was
built; the law does not know.

### 2.1 It is already happening again, in sound — and this time early enough to prevent

The sound plane's plan of record (`stzlib/…/base/sound/SOFTANZA_SOUND_PLAN.md`; SN0–SN5
closed, SN6 not started) is the same story at an earlier hour. It is a serious piece of
engineering — kill criteria written before the numbers and then applied, a 128-voice mix
at 0.24% of its deadline, zero underruns over 289 callbacks — and it is **entirely
production-side**: nodes, sinks, buffers, latency, mixing, analysis.

Searched across the whole plane for `earcon`, `sonification`, `sound role`, `alert
sound`, `notification`, `chime`, `auditory`: **zero hits.** There is no notion of a sound
*for* something — no success or error sound, no alert taxonomy, no priority, no ducking,
no mapping from an application event to a sound. The plane's own mission says so plainly:
*"describe a sound or a graph of sounds; the engine realizes it."* **The sound plane and
the UI law have never referenced each other in either direction.**

Two numbers that have never been placed side by side:

- **Rule 18, The Speed of Thought**: *"Actions must acknowledge the user within 100ms."*
- **The sound plane, measured**: output latency **112.6 ms** by loopback — an upper bound
  the plan carefully decomposes as ~30 ms app buffer + ~22 ms measurement tap + ~60 ms OS
  pipeline, with the standing instruction *"quote the buffer, never the 112 ms."*

Take the honest decomposition and **the OS pipeline alone spends roughly 60% of the
constitutional budget before the application has done anything.** If a sound *is* the
acknowledgement — and on an eyes-free or voice surface it is the only acknowledgement —
Rule 18 sits at the edge of satisfiable, and nobody has checked, because the two
documents have never met.

And once more the instrument precedes the law: **SN5 already ships `Loudness` (LUFS)** —
the auditory analogue of a contrast ratio, and exactly the measurement an audibility floor
would bind to. The constitution has no rule about auditory loudness for it to serve.

## 3. What is preserved — and is not open

1. **The inversion.** Intent first; rendering is a consequence. Every element traces to
   at least one intent.
2. **The closed intent grammar.** 22 verbs, six families. §5 and §6 add no verb — and §6
   shows the closure was load-bearing all along.
3. **The constitution's independence** from every product, including this document.
4. **Evidence over fashion.** Article VII; numbers stable forever; evidence never
   corrected.
5. **The signature move**: closed language + court + fixtures + consumers that pin.
6. **The substance test and the patch component**, exactly as they stand.

## 4. The three axes

The founding architecture named three layers and left the middle to "projections", which
are per-medium, replaceable, and **not declarable**. So the ladder runs from intent
(checkable) straight to pixels (measurable only after painting), with nothing between.

```
LAYER 3 — PROJECTION      how one medium renders it       per-medium, replaceable
LAYER 2 — EXPRESSION      how intent is made perceivable  ← THE MISSING MIDDLE
LAYER 1 — INTENT          what the human is trying to do  closed, 22 verbs
```

**Expression is not appearance.** A declaration here never names a pixel, a hex value, a
font size, a component library — or a waveform. It names a **meaning, a promise, or a
relation**.

### 4.1 The rule that keeps the inversion intact

> **Every expression declaration traces to an intent, or it is an error.**

`INTENT_ORPHAN` extended one level down: `EXPRESSION_ORPHAN`. The expression stratum is
not a second language beside intent; it is intent's refinement, inheriting its
discipline. That is why this is a second founding and not scope creep.

### 4.2 The strata are functions. The media are channels.

v0.1 of this document named six strata and quietly defined three of them in visual terms —
`SIGNAL` as colour, `MOTION` as animation, `STRUCTURE` as layout. That was the same
monomodal error §1.2 finds in the law, committed one layer up. Adding `SOUND` as a
seventh stratum would compound it: **sound is not a peer of colour. It is the same
function in a different channel.**

The correct model has two axes — what an expression *does*, and where it is *carried*:

| Stratum (function) | Visual | Auditory | Voice | Haptic | Print |
|---|---|---|---|---|---|
| **SIGNAL** meaning made perceptible | colour | timbre | word choice, prosody | waveform identity | ink weight, rule |
| **STRUCTURE** relations among parts | spatial layout | figure/ground, sequence | turn structure | — *(too narrow)* | page, column |
| **ROLE** the promise a control makes | widget | — | utterance grammar | — | — *(no controls)* |
| **MOTION** change reporting state | animation | envelope, rhythm | pacing | pulse train | — *(no time)* |
| **MESSAGE** the system speaking | text | earcon | speech | — | text |
| **TEMPO** budgets and interruption | latency | inherently temporal | turn-taking, barge-in | latency | — *(no time)* |

The empty cells are the point. They are not gaps to fill; they are **refusals** — facts
about what a channel cannot carry, and therefore what a court must check.

**The sound plane already proved this axis one layer down.** Its central architectural
decision is *"the sink is a parameter, not a fork"* — buffer, WAV file, device, and (in
SN6) WebAudio are one graph rendered four ways, *"so 'what you hear' and 'what you export'
cannot drift."* That is the medium axis, discovered independently, for outputs. What the
sound plane does for four sinks, the expression stratum does for eight media, and for the
same stated reason: **one declaration, many renderings, no drift between them.** Three
parts of this project have now arrived at the same shape. None of them has written it
down as a shared law.

### 4.3 The medium axis already exists in the language

It need not be invented, only closed. `VIBE` already carries **`SURFACE_AS`** — *"the
medium this vibe projects to"* — and the canonical clean fixture already writes
`SURFACE_AS terminal`. The field is live, used, and **unenumerated**: any identifier
passes. Closing it, the way `PERSPECTIVE` and `TONE` are closed, turns the medium from a
comment into a contract.

### 4.4 The two laws that media impose

Both are structural, both are checkable, and neither has any visual analogue — which is
why a monomodal law could never have found them.

**The persistence law.** A colour stays until it is changed; a sound is gone the instant
it ends. `ALWAYS_REACHABLE` — the field that carries the operator's *rights* into the
structure — silently assumes persistence.

> **In a non-persistent medium, a right is kept by re-requestability, not by presence.**

A voice interface satisfies `ALWAYS_REACHABLE [UNDO]` not by displaying undo but by
*always accepting "undo" as an utterance and always being able to say what is undoable.*
A surface that plays a warning once and never again has not made it reachable; it has
made it **missable**. This is why Rule 82 must become **Perceivable State** (§7.2).

**The seriality law.** Vision is parallel — the eye chooses its own order. Audio is
serial — it arrives in one order at one rate. So the 22 verbs are not equally carriable:

| Verb | Visual | Serial media (audio, voice) |
|---|---|---|
| `SCAN` | native — the eye's own operation | degrades to sequential playback |
| `COMPARE` | native — two things held at once | becomes a **memory task** |
| `LOCATE` | native — spatial search | requires an index or menu |
| `ZOOM` | native | no analogue; maps to level of detail |
| `ACT`, `CONFIRM`, `UNDO`, `CANCEL` | native | native |

> **A medium declares which of the 22 verbs it carries, and at what cost.**

That is refusable: a flow declaring `SATISFIES [COMPARE]` on a voice-only surface, with no
declared fallback, is an error the court can name.

**The attention law.** A screen and a page are *elected* — the operator chose to look, in
a reading posture, with context. A status light, a road sign, a notification and a sound
are *ambient*: they must work when nobody is looking, at distance, at an angle, at speed,
often to someone who never opted in and has no training.

> **An ambient medium must carry its meaning peripherally, at a glance, without context.**

A safety sign that requires reading a paragraph has failed; a printed report that requires
reading a paragraph has not. Same fixity, same absence of interaction — opposite
obligations, because one was elected and the other was not.

**And here the founding decision pays off.** The 22 verbs are closed and medium-agnostic.
*Because* they are closed, a coverage matrix over media is finite and checkable. Had the
grammar been open — had every projection been free to add verbs — no such matrix could
exist. The closure that looked like an aesthetic constraint turns out to be the precise
precondition for multi-modal correctness.

### 4.5 Media are classified, not enumerated

A list of media is a list, and lists go stale — the next channel always arrives. What does
not go stale is the set of **properties** that decide what a channel can carry. The
capability matrix should be *computed* from these, so a new medium is classified rather
than argued about:

| Property | Question | Screen | Light | Sound | Sign | Print |
|---|---|---|---|---|---|---|
| **Persistence** | does the rendering remain? | yes | yes | **no** | permanently | yes |
| **Seriality** | parallel or serial access? | parallel | parallel | **serial** | parallel | parallel |
| **Election** | did the operator choose to attend? | yes | **no** | **no** | **no** | yes |
| **Bandwidth** | meaning per glance | high | **1–3 bits** | low | one message | high |
| **Mutability** | can it change at all? | yes | yes | yes | **no** | **no** |

The five media that started this document differ on two rows. **Light and signage differ
on four**, which is why adding them is not padding — they are the cases that prove the
axis is about properties and not about a taxonomy of gadgets.

Note what the `Election` row does to the earlier list: `ambient` was filed in §6 as a
medium, and it is better read as **a property that light, signage, sound and notification
all share**. That is a correction to §6's Tier 2, not a refinement of it.

### 4.6 The cultural axis — the reading a sign gets

A stratum says what an expression *does*. A medium says where it is *carried*. Neither
says what it **means to the person receiving it** — and meaning is not a property of the
sign. It is a property of the sign *and its reader*.

**The law has language. It does not have culture.** Set 18 holds three rules, all
`judgment`: dialect switching (63), right-to-left logic (64), and language as data (122) —
the last naming Wolof, Hausa, Bambara and Zarma, which is more global than most standards
manage. Rule 64's reasoning is already exactly right: *"Calm that only flows left-to-right
is not calm; it is locale bias."* But **translating every string does not fix a sign whose
meaning inverts.** Language is data; meaning is convention.

**A terminology collision to settle first.** The word *culture* is already taken in this
constitution. Article VI: *"their culture deserves architectural respect: vibes,
densities, dialects, and surfaces."* Here culture means **interaction culture** — a vibe.
The axis below needs its own word; `CONVENTION` is proposed and the naming is the
author's. Quietly overloading Article VI's term would be the worst option.

**The defect, in this project's own code.** `stzlib/…/graph/stzDiagramColor.ring:45`:

```ring
# Semantic color meanings (abstraction layer)
$acColorsBySemanticMeaning = [
    :Success = "green",  :Warning = "yellow",  :Danger = "red",
    :Info    = "blue",   :Primary = "blue",    :Neutral = "gray"
]
```

The comment calls it an abstraction layer, and it is one — **that stops exactly one level
too early.** It abstracts hex → name, then hard-codes name → *one culture's reading* as if
that were the meaning. And it picks the worst possible pair to hard-code:
`:Success = "green"` and `:Danger = "red"` **invert** in Chinese, Japanese, Korean and
Taiwanese financial convention, where red is gain and green is loss. **A Softanza
financial dashboard shipped to Shanghai renders profit in the colour of loss** — in a
domain where the operator is moving money under time pressure.

**And this is the semantic layer's vindication, not its embarrassment.** An author who
writes `#00FF00` has hard-coded a cultural reading and cannot be helped by anything. An
author who writes `:Success` has declared a *meaning*, and the renderer can be taught.
The founding sentence simply grows one axis: **declare the meaning once, and every medium
and every culture renders it.**

#### 4.6.1 Two problems, and conflating them would be the error

**(a) Variance — parameterisable.** The same meaning renders differently: red for danger
versus red for prosperity; white for weddings versus white for mourning; green's religious
weight; the financial inversion above. This is what the cultural axis is *for*. The five
semantic values of Rule 118 are meanings and survive; the seed hexes are readings and do
not.

**(b) Hazard — not parameterisable.** Some signs carry sovereignty, religion or political
identity, and conscripting them as convenience labels is an act with consequences the
software never intended. There is no correct rendering to select. The answer is **don't**,
and the machinery for that already exists: the constitution carries fifteen
`forbidden` patterns and **not one of them is cultural.**

> **A sign that denotes sovereignty, faith or political identity must never be conscripted
> as a label for something else.**

The canonical case is the one that names the whole class: **a flag is not a language.**
Arabic is official in some twenty-odd states; Spanish, Portuguese, English, French, Arabic
each span many. Choosing one flag to mean one language is choosing a *state* to stand for
a *tongue* — a political claim the interface makes on its owner's behalf, silently. Ship
an interface to a ministry whose relations with that state are poor and the software has
issued a diplomatic statement its authors never wrote. That is not a design defect to be
apologised for in the next release; it is the kind that ends a contract.

Other members of the class, offered as a starting list and not a survey: disputed borders
and place names on maps; religious symbols used as category icons; gestures whose emoji
are obscene in some regions and friendly in others; colours with sectarian charge in
specific places; numbers carrying strong associations; assumed weekends and week-start
days; personal-name models that assume a given/family pair.

**And part of this class is statutory, not stylistic.** Map borders are legally mandated
to differ by jurisdiction. That is tier 0 of §8 — the organ this document grew one
revision ago for physical media turns out to be load-bearing here too, which is mild
evidence it was the right organ.

#### 4.6.2 What the cultural axis fixes in the governance model

§8 proposed a Core that is non-negotiable and a Commons that is contributed, with the
boundary drawn by the author's judgement. Culture supplies a **principled** boundary
instead:

> **What is non-negotiable is what is true of human beings. What is contributed is what is
> true of a place.**

Tested against the corpus, that boundary holds up well. The seven articles rest largely on
physiology and ethics — finite attention, working memory, error recovery, the dignity of
undo — and travel. The *rules* are where locality enters: the monastic palette, paper
tones, one accent per screen, density preferences, and every colour assignment. Article I
even anticipates the objection — *"Calm is a functional requirement, not an aesthetic
choice"* — and that defence holds for the article and is thinner for some rules beneath it.

This also gives the **Local** tier a much better justification than preference. For a
ministry, a local law forbidding a sign class may be a political necessity, not a taste.

#### 4.6.3 The model belongs in stzlib, not here

Culture is not a UI concern that leaked outward; it is a **computational model** that UI
happens to need. Business records carry name models, workweeks and fiscal calendars;
narrations read differently by audience; both planes render meaning; an agent generating
anything needs the constraints. So the model belongs in `stzlib` as a first-class module —
`stzCulture` and its companions — and **StzZui inherits it and augments what is specific
to a UI law**, exactly as it consumes the colour and sound engines rather than owning them.

The split that keeps it honest, and it is the module's founding law:

> **A locale formats. A culture interprets.** A locale says how something is written down;
> a culture says how it will be read. A locale can be derived from a published standard;
> **a culture must be contributed.** No call may return a *meaning* from a locale
> identifier alone.

That guard rail is what stops the module collapsing into a re-implementation of
`CultureInfo`. Microsoft's design is excellent at layer one — number and date formats,
calendars, casing, collation, the parent-culture fallback chain, and the genuinely good
`CurrentCulture` / `CurrentUICulture` split between the culture you *format* in and the
culture you *read* in. It has no answer at all to *what does red mean here*, because
formatting standards do not carry meanings. Softanza needs a third: the culture that
**interprets** — the audience's, which may be none of the above.

**And this is the answer to §4.6's own honest limit.** There is no CLDR for meanings, so
the data cannot be bought or scraped; it must be contributed and evidenced. Which means
`stzCulture`'s data inherits the commons governance of §8 by necessity rather than by
choice — including the admission rule that writes itself: **a reading contributed by
someone outside the culture it describes is inadmissible**, and every reading carries a
strength, because *contested* must be expressible or the model commits the essentialism it
exists to prevent.

Whether this is family-wide enough to be **C8, a Culture Contract** in the reference design
— it is consumed by StzZui, Zing, Narrations, both planes and the device family — is the
author's call, and it is the same question the medium axis raised.

## 5. The six strata, stated modality-neutrally

Each is a closed vocabulary with a court and fixtures, drawn from rules that **already
exist** — extracted from the law's practice, never invented fresh.

- **`STRUCTURE`** — what is grouped, subordinate, ordered, dense, deep. Spatially in
  vision; as figure/ground and sequence in audio; as turn structure in voice.
  *Reaches*: Set 3 (9), Set 4 (3), Set 9 (4), Rules 90/92/93/95, 107, 111, 113, 114.
- **`SIGNAL`** — a meaning bound to a perceptible quality. Rule 3 already names the
  stratum: *"Color is a signal, not an identity."* Colour in vision, timbre in audio,
  waveform in haptics. *Reaches*: Set 2 (11), Set 15 (3), Set 17 (3), Rules 117, 118.
- **`ROLE`** — the promise a control makes: *instant, reversible, binary state* — a
  contract a projection keeps with any widget it likes. The resolution of the `WIDGET`
  exclusion: a declaration still may not name a widget; it may name a promise. Rule 119
  already says *"form follows role."* *Reaches*: Set 13 (7), Set 11 (2), Rule 119.
- **`MOTION`** — change that reports state. Rule 112 already says *motion reports, it
  never decorates*; §6.1 shows the auditory form of that rule is **stronger**.
  *Reaches*: Rules 19, 21, 38, 112, Set 28 (2).
- **`MESSAGE`** — what the system owes the operator when it speaks: cause, remedy, actor
  — not the wording. *Reaches*: Set 10 (6), Set 8 (4), Set 18 (3), Rules 106, 99.
  Extends the existing `FEEDBACK` declaration rather than replacing it.
- **`TEMPO`** — budgets, interruption, resumption. Rule 18's hundred milliseconds as a
  declared class. *Reaches*: Set 5 (9), Set 6 (3), Set 14 (3), Set 28 (2), Rule 100.

## 6. The media

Eight, in three tiers. `SURFACE_AS`'s enumeration is exactly this list.

**Tier 1 — unlegislated and consequential. Add now.**

### 6.1 `auditory` — sound as signal

Zero rules in the law; zero semantics in the plane (§2.1). The engine is built and the
meaning layer does not exist on either side — which is the one genuinely recoverable
situation in this document, because **SN6 is not started and nothing has hardened yet.**

The coherent design is not a guess. It is the colour system's own structure, transposed —
and the sound plane already speaks the same `:Name` convention its named nodes use
(`:tone`, `:bell`), so the five semantic values slot into a syntax that exists. This is
the whole argument for a semantic layer in one line: *declare the meaning once, and every
channel renders it.*

| Colour — built and proven | Sound — the analogue |
|---|---|
| the five semantic names | **the same five names.** One vocabulary, two channels |
| hue = identity | **timbre** = identity |
| lightness = prominence | **salience** = loudness × spectral brightness × repetition |
| the sRGB gamut = what can be shown | **the band between the ambient noise floor and the discomfort ceiling** |
| chroma searched to fit the gamut | salience **fitted to the room**, never chosen |
| role steps `.Surface .Border .Solid .Text` | `.Ambient` · `.Cue` · `.Alert` |
| `:OnDanger` — what can be *read on* it | `:OverDanger` — what can be *heard over* it |
| contrast as a number, floor 4.5 | **audibility margin over the measured floor** — and `Loudness` (LUFS) already ships |
| *"a design system that cannot fail an accessibility check does not have one"* | *"a sound system that cannot fail an audibility check does not have one"* |

Two mechanisms the plane does not have and a semantic layer requires: **priority** (which
alert wins when two fire) and **ducking** (what gets quieter when one does). There is no
bus or priority concept today beyond the mix node — so `:OverDanger` is genuinely new
work, not a relabelling.

Three laws sound needs that colour does not:

1. **Sound is interruptive by default; colour is not.** A colour waits to be looked at; a
   sound seizes attention and cannot be looked away from. Rule 112 becomes **"sound
   reports, it never decorates"** — and in its auditory form it is the *stronger* rule,
   because the operator has no eyelid for the ear.
2. **Silence is the default, and must remain sufficient.** Sound is the first thing
   switched off, and it is unavailable in open-plan offices, in meetings, and to deaf
   operators. **Sound is always redundant, never the sole carrier of a state.** One
   sentence that is simultaneously the accessibility law and the practicality law.
3. **Auditory feedback is causal only inside Rule 18's hundred milliseconds.** Later than
   that a sound is not felt as *caused by* the act; it is heard as a separate event. This
   is where the plane's engineering meets the constitution, and the meeting is overdue:
   §2.1's decomposition leaves little headroom, and the plane's own finding — *"what has
   a deadline is the WAKE-UP; what must fit inside it is the burst's TOTAL work"* — is
   the kind of fact a latency budget in the law must be written against. The plane's
   calibrated refusal of exclusive mode by default (up to 78,020 frames dropped, 1.6 s
   missing from a 3 s run) is already Rule 18 reasoning; it simply has no rule to cite.

### 6.2 `voice` — speech in and out

Named as a projection since the founding; zero rules. It is not "audio with words" — it
is a distinct paradigm, and the one being deployed fastest into exactly the high-stakes
business contexts this constitution was written for.

**Voice is not the sound plane's job, and should not be handed to it.** That plane rules
speech synthesis and recognition explicitly out of scope — *"OUT until asked, in writing…
the last two would be NEURAL-tier work riding ggml, not this plane's."* That boundary is
theirs to hold and this document does not contest it. What follows is law for whoever
eventually renders voice; the sound plane owes it nothing.

- **Recognition is probabilistic**, so voice has a failure mode vision does not: *the
  system misheard.* Every argument for `CONFIRM` gets stronger — `SELECT_ACT_COLLAPSE` is
  not a style error here, it is how money moves on a mishearing.
- **Nothing persists**, so §4.4's persistence law binds hardest: every right must be
  re-requestable, and the system must always be able to answer *"what did I just do?"*
- **Undo has no toast.** The ten-second toast of Rule 79 has no auditory form that does
  not nag. Voice needs its own mechanism — a permanently accepted "undo" utterance and a
  stated window — or Rule 79 is simply unmet in the medium.
- **Barge-in is the right to leave, in time rather than space.** An interface that cannot
  be interrupted mid-utterance is a trapped flow with no `EXIT`.

### 6.3 `haptic`

Rule 69 promises this medium in its title and delivers touch targets. Real for the device
family. Narrow-band: it carries `SIGNAL` and `MOTION` well, `STRUCTURE` and `ROLE` not at
all — which is precisely why it must never be a sole carrier.

### 6.4 `print` — the fixed record

Sets 22 and 24 exist; the colour system already ships a `print` theme; business runs on
printed records. Include it **because it is the hardest case**: print has no time, no
interaction, no undo, no state change. `MOTION` and `TEMPO` are structurally
unrenderable; `ROLE` has nothing to promise. It is the medium that falsifies a sloppy
model, and if the strata survive it they are real.

### 6.5 `luminous` — light as a signal

Indicator lamps, status LEDs, beacons, light bars, a robot's turn signal. Visual, and
**not a screen** — a distinction that matters more than it sounds, because the `visual`
column of §4.2 silently means *a page*. A status light shares almost nothing with one: no
layout, no text, no widget, no reading posture.

- **Bandwidth is one to three bits**: identity (which lamp, which colour), salience
  (brightness, blink rate), and position. That is the whole channel.
- It carries `SIGNAL` supremely — this is where semantic colour *came from*, long before
  screens — and `MOTION` natively, because a blink or a pulse **is** a state change rather
  than a depiction of one. It carries `STRUCTURE` barely, `MESSAGE` not at all, and `ROLE`
  only when the lamp is inside a control.
- It is **persistent and unelected**: readable across a room, at an angle, while the
  operator's hands and eyes are on the work. That combination is its superpower and no
  screen has it.

**The refusal that matters, and it is concrete.** The colour plane's role steps do not
survive here. A single-colour emitter emits what it emits; an RGB LED's gamut is not
sRGB; there is no surface to tint and no border to draw. So in this medium `SIGNAL`
collapses to *identity + salience* and the four-step `.Surface/.Border/.Solid/.Text` ramp
is **unrenderable**. That is a matrix cell the court must know and the colour engine must
not be asked to fill.

### 6.6 `signage` — the fixed physical marking

Traffic signs, safety placards, floor markings, hazard labels, the diamond on a tanker.
Fixed like print — and a different medium, because it is **encountered rather than read**.

- Distinguished from `print` by **election**, not by fixity. Same immutability, opposite
  obligation: it must land at distance, at speed, peripherally, on someone who did not
  choose to read it.
- **Shape is a carrier with no screen equivalent.** The sign vocabulary is a closed
  grammar of shapes — octagon, triangle, circle, diamond — as much as of colours, and it
  works for people who cannot read the legend at all.
- Cannot carry `MOTION`, `TEMPO` or `ROLE`, and carries `MESSAGE` only as a fixed legend.
- **Maximally persistent**: it is there for years, whether anyone looks or not.

### 6.7 What light and signage change about the law

Two findings, and both are larger than the media that produced them.

**The law assumes an operator; physical media address bystanders.** The preamble is
explicit that this constitution serves *"business users [who] operate under pressure,
responsibility, fatigue, and risk."* A pedestrian near a warehouse AGV is under risk and
is **not an operator**: no account, no training, no manual, no consent, and no second
attempt. A delivery robot signalling a turn is addressing someone who never opted into the
system. **The constitution has no vocabulary for the person an interface addresses but
does not serve** — and this is the class of interface where a misread signal is an injury
rather than an annoyance. That is a Core-level gap, not a rule-level one, and it is filed
here rather than drafted.

**The prior art is not merely relevant — it is the thesis, already proven.** Road signage
is the most successful interface standard in human history: a closed vocabulary of shapes
and colours, legislated by treaty, enforced by inspection, amended slowly on crash
evidence, working across languages, cultures, literacy levels and speeds, for sixty years.
Everything this project argues an interface law should be, traffic signage already **is**.
The machine-indicator and safety-sign standards (the IEC 60073 / ISO 3864 / ISO 7010
family) do the same for exactly the media in §6.5 and §6.6, assigning settled meanings to
indicator colours and sign geometry — broadly red for danger or emergency stop, yellow or
amber for caution and abnormal conditions, green for safe or normal, blue for mandatory.

Two consequences follow, and the second is a governance change:

1. **Independent convergence, and it validates Rule 118.** Five semantic values derived
   from business software land close to the values industrial safety derived from
   machines, a century apart, from unrelated evidence. That is the strongest support
   Rule 118 has ever had, and it should be recorded in the rule's own evidence field.
2. **In physical media, the external standard outranks this constitution** — see §8.
   *Exact clause numbers and colour assignments above must be verified against the current
   editions before a single word enters the law.* They are stated here at the level of
   confidence I actually have, which is the scheme and not the clause.

**Tier 2 — name them now, legislate next.**

### 6.8 `ambient` — the interface that reaches you when you are not looking

Notifications, badges, out-of-app interruption. Touched by Rules 1, 51, 76, 103; governed
as a medium by none. One-shot, contextless, interruptive, and the most abused channel in
modern software.

### 6.9 `machine` — the interface consumed by a program

The law already reached this conclusion by itself. Rule 104: *"Accessibility law and
agent-interop law are one body of law with two beneficiaries… what a screen reader can
operate, an agent can operate."*

> **The medium axis makes it three.** What a screen reader can operate, an agent can
> operate, and a non-visual medium can render. Multi-modality and accessibility are not
> neighbouring concerns — **they are the same law**, and treating them separately is
> exactly why accessibility has always been bolted on last.

**Tier 3 — already seeded, no new work proposed.**

`spatial` (`WORLD_VIEW` + `PERSPECTIVE` exist; Ringine is chartered) and `terminal`
(already written in the clean fixture).

## 7. Ownership, and the amendments this implies

### 7.1 The boundary this must not cross

`.face` (RingFace) owns composition and shipped v0. C7 (stzlib) owns how a value shows
itself. Zing owns delivery. The graphics plane owns colour computation; the sound plane
owns audio synthesis and timing.

> **StzZui owns the vocabulary, the law, and the court. The siblings own the artifacts
> and the engines.**

Exactly what StzZui already does for intent, applied across two axes. It takes nothing
from anyone: the sound plane keeps every decision about buffers, mixing and latency, and
gains a *meaning* vocabulary it currently has to invent for itself — the thing the
graphics plane had to invent, and which drifted from the law because nobody owned the
seam.

### 7.2 Amendments proposed to the constitution

Each is an **amendment, not a correction**, by the project's own substance test — an
interface lawful before becomes unlawful after — and each therefore needs evidence and
the author's ratification.

| # | Proposal | Why |
|---|---|---|
| A | **Rule 82: "Visible State" → "Perceivable State"**, with visibility as its visual realization | `machine` tier today, and medium-bound in both title and body (*"the user must see it"*). A voice surface currently escapes it entirely |
| B | **Rule 60 restated medium-neutrally**, with ARIA as the web realization rather than the rule | The only rule about how an interface is heard is written in one framework's vocabulary, inside a framework-agnostic constitution |
| C | **Rule 69 either renamed or given its haptic body** | Title and body disagree today |
| D | **Rule 104 extended to three beneficiaries** | The rule already made the argument; the medium axis completes it |
| E | **Rules 3 and 118 reconciled with each other and with the engine** | Three vocabularies for five values (§2) |
| F | **Rule 62 bound to `StzIsLegible`**, promoted off `machine-later` | The instrument exists and is CI-gated |

### 7.3 Amendment proposed to the reference design

One row, **not applied here**: layer 2's *"the UI law as data (StzZui)"* becomes *"the UI
law and the interface vocabulary as data (StzZui)"*, and §6.3's UI-pipeline horizon gains
the note that the expression vocabulary is the seam `.zui` and `.face` meet on.

## 8. The constitution as a living institution

Four tiers, one supremacy rule.

0. **Statute — not ours at all.** Where an interface is governed by external law or
   binding standard — road signage, machine indicators, safety marking, medical device
   labelling — **that instrument outranks this constitution absolutely.** This tier was
   added by §6.7 and it is not a courtesy: in a jurisdiction where red on a machine means
   emergency stop, a rule of ours assigning red another meaning is not a divergence, it is
   a hazard. The court's duty here is to *refuse a conflict*, never to resolve it in our
   favour.
1. **The Core — non-negotiable.** Preamble, 7 articles, operator rights, intent-family
   invariants, forbidden patterns. Amended only by convention, never by contribution.
2. **The Commons — contributed, curated, evidence-gated.** Today's 117 and everything
   anyone adds.
3. **The Local — a person's or organisation's own laws**, pinned alongside, shipped with
   the app.

> **Supremacy**: a local law may be *stricter* than the commons and never *looser*; and
> nothing at any tier may contradict a statute that binds the medium.

**Where the Core/Commons line falls, on principle rather than by judgement** (§4.6.2):
*what is non-negotiable is what is true of human beings; what is contributed is what is
true of a place.* Finite attention, working memory, error recovery and the dignity of undo
travel everywhere. Palettes, densities, accents and every colour assignment do not.

**The admission test is already in the data.** All 118 rules carry `derived_from`, and all
118 resolve to one of the seven articles. So: **a proposed rule that derives from no
article is inadmissible; one that contradicts the Core is inadmissible; everything else is
a question of evidence.** No committee of taste is required.

**The admission triple.** This project already writes every argument three ways — the
Gotchas make an offense *feelable*, the fixtures make it *checkable*, `evidence` makes it
*accountable*. A contributed law arrives as all three or not at all.

| | Form | Audience | Precedent |
|---|---|---|---|
| **The gotcha** | offense + lawful twin, playable | humans | `site/gotchas/`, 12 offenses |
| **The fixture** | declaration + expected verdict | machines | `conformance/`, 30 fixtures |
| **The evidence** | what happened, where, when | the record | `evidence` on all 118 rules |

### 8.1 The loop that closes it

```
an operator meets a pain, in the app, at the moment it hurts
        ↓  capture: the surface, the intent it served, the medium it was in
a gotcha            — reproducible, feelable, dated
        ↓
a LOCAL law         — binding on their own app immediately
        ↓
a COMMONS proposal  — gotcha + fixture + evidence
        ↓  admitted, or refused with the reason on record
a CANONIZED rule    — numbered forever
```

**The person who feels the pain has never had a channel to the person who decides.** That
is the deepest cause of the deterioration, and a capture form in every app is the only
fix anyone has proposed. Note the added field: **the medium** — without it the corpus
would go on writing law for the eye.

## 9. The protocol

| Piece | Status |
|---|---|
| The law as data, versioned, pinned by hash | ✅ `constitution/rules.json` v3.8.0 |
| The intent grammar and declaration types, in EBNF | ✅ `doc/language/` v1.0 |
| The refusal envelope every court speaks | ✅ **C2, delivered 2026-08-12**, v1.0 |
| Conformance fixtures as the gate | ✅ 30 fixtures |
| **The six expression grammars** | ✗ §5 |
| **The medium enumeration and its capability matrix** | ✗ §4.2, §6 |
| **The contribution and capture protocols** | ✗ §8 |
| **A neutral, citable identity** | ✗ open |

Softanza becomes the reference implementation and the showcase. The pack must be
implementable by someone who never installs a Softanza component.

## 10. Why now: interfaces under generation

Interfaces are now generated faster than review can absorb, and the generator cannot
*know* the law it breaks. Set 31 governs the agent as an actor; Rules 121 and 124 govern
its surface. The expression stratum completes it, because a court that checks only intent
checks almost nothing a generator gets wrong: generators rarely misdeclare intent, and
routinely produce card grids that lie, three competing primaries, and *"Invalid input!"*

The medium axis makes this urgent rather than merely important. **Generated voice agents
are being deployed into the same high-stakes business contexts this constitution was
written for, and there is not one line of law about voice.** A voice agent that mishears,
acts, and cannot be interrupted or reversed violates Rules 16, 79 and 26 at once — and
today no instrument, in any medium, would refuse it.

Two commitments follow: the law is **consultable while generating** (M5's MCP surface),
and a generated surface **cites the rules it obeyed** — Rule 99's provenance, extended to
the artifact.

## 11. Practicality — three audiences, three doors

- **Designers** — a vocabulary for what they already mean. The door is the Gotchas, the
  Reader, and the capture form. *Never asked to write JSON.*
- **Developers** — one dependency-free binary, a CI gate, an exit code, diagnostics that
  cite a numbered law. The door is `zui check`.
- **Tool makers** — the protocol pack of §9. The door is conformance. *An LSP, a Figma
  plugin, a sound-design tool, a linter or a generator can prove agreement.*

## 12. The book

| Part | Argument |
|---|---|
| I — The Deterioration | Why interfaces got worse while tooling got better: the vocabulary collapsed into the toolkit; rendering got cheap and meaning got expensive; the pain never reached the decider; fashion replaced evidence. |
| II — The Heritage | What HCI knew and could not enforce: Norman's gulfs, Nielsen, Fitts, Hick, Gestalt, Tufte, Shneiderman. **And the one place it *was* enforced**: road signage — a closed vocabulary, legislated by treaty, amended on crash evidence, working across languages and literacy for sixty years. The book's existence proof, and the answer to anyone who calls a constitution for interfaces utopian. |
| III — The Inversion | Intent first. The closed grammar. Why correctness becomes compilable. |
| IV — The Expression | The missing middle: structure, signal, role, motion, message, tempo. |
| V — **The Senses** | Interfaces are not only seen. Sound, voice, touch, light, signage — and why a monomodal law is an incomplete one. Accessibility as the same law, not a chapter of exceptions. |
| VI — **The Readers** | Meaning is not a property of the sign. Where conventions differ, where they invert, and the signs that must never be conscripted at all. Why a law claiming universality owes an account of its own locality — and what in it actually travels. |
| VI — The Law | Articles, rights, evidence, the enforcement ladder, the substance test. |
| VII — The Commons | Governance, and the loop from a user's pain to a numbered rule. |
| VIII — Under Generation | Interfaces made by machines, refused by law. |
| IX — In Practice | Adoption, the toolchain, Softanza as the worked showcase. |

**One discipline borrowed from the law**: every claim a machine can check should be
**generated from the artifacts** — rule counts, enforcement tiers, fixture verdicts, the
medium matrix. A book about drift that drifts from its own apparatus would refute itself.

## 13. Sequencing

```
M6   The reconciliation      SIGNAL in the visual channel, zero new design:
                             Rules 3 ↔ 118 ↔ the engine; muted ↔ :Neutral;
                             Rule 62 bound to StzIsLegible. Cashable in days.
M6b  The medium axis         SURFACE_AS closed to the eight; the capability matrix
                             as data; amendments A–D. Small, and it unblocks sound.
M7   SIGNAL in sound         the five semantic names in the auditory channel, with
                             the sound plane as co-author: role steps, an audibility
                             floor bound to the shipped LUFS meter, priority and
                             ducking, and a latency budget written against Rule 18.
                             A semantic layer ABOVE the plane — it changes no node,
                             no sink and no callback.
M8   ROLE + MESSAGE          the strata with the most judgment-tier rules.
M9   The commons             core/commons/local; the admission triple; capture.
M10  VOICE                   the paradigm, not the channel: turn-taking, barge-in,
                             re-requestability, mishearing as a first-class failure.
M11  STRUCTURE + MOTION + TEMPO · print and ambient
M11b PHYSICAL MEDIA          luminous and signage, with MicroRing and the device
                             family. Gated on a statute review, not on us: the
                             external standards are read and cited BEFORE a rule
                             is written, because §8 tier 0 outranks us here.
M12  The protocol pack + the MCP surface (M5 folded in)
```

**M6b before M7 is the load-bearing order, and M7 before SN6 is the one piece of timing
that cannot be recovered.** The colour vocabulary drifted because the engine shipped
before the law had a seam to bind to. SN0–SN5 are closed and SN6 — the reactive layer,
the WebAudio sink, the game-plane doors — is where the sound plane first reaches outward.
A semantic vocabulary agreed *before* those doors open costs a document; agreed after, it
costs a migration and a decade of drift. **This is the recoverable case. The colour one
was not.**

`M4 — Rendering projections` is superseded: it assumed projections were the answer, and
§4 finds projections are downstream of a stratum that does not exist yet.

## Honest boundaries

- **Nothing here is ratified, and nothing is implemented.** Six grammars and eight media
  are named; none is written. The field sketches will not survive fixtures unchanged.
- **The sound plane was read; it has agreed to nothing.** Every statement here about what
  that plane *has built* comes from its plan of record and is reported as found. Every
  statement about what sound *should mean* is this document's own, transposed from the
  colour precedent. The table in §6.1 is a proposal to that session in the genre it
  already uses for cross-plane findings — it is not a report of their design, and
  `:OverDanger`, priority and ducking are new work I am asking for, not work I found.
- **Its session is live and its cwd is `softanza`.** Any coordination must not race it,
  and the plan of record already carries undocumented post-SN5 work — so its file is not
  a safe source of truth for anything I have not verified in the tree.
- **`ROLE` is the move most worth attacking.** If a role is a widget wearing a disguise,
  the stratum must be reconsidered.
- **The medium list is a judgement call, and it has already been wrong once.** It was
  eight; `luminous` and `signage` were missing, and adding them showed that `ambient` is
  better read as a *property* than a medium (§4.5). That is one correction in a day, which
  is the argument for classifying media by properties rather than maintaining a list — and
  a warning that ten is not a finished number either. XR, scent and thermal feedback are
  the obvious next arrivals.
- **The external standards in §6.7 are cited at the level of the scheme, not the clause.**
  Red-for-danger and octagon-for-stop I am confident of; exact editions, clause numbers
  and the full colour assignments must be verified before one word of it enters the law.
  Nothing in this project may cite a statute it has not read.
- **The bystander gap is filed, not solved.** "The person an interface addresses but does
  not serve" has no place in the preamble, the rights, or the 22 verbs, and inventing one
  in a footnote would be worse than naming the hole.
- **The cultural claims in §4.6 are examples, not a survey, and they are the kind most
  easily got wrong by someone outside the culture described.** The financial red/green
  inversion and the flag-is-not-a-language case I am confident of; the wider hazard list is
  a starting point that needs review by people who live inside those readings, not
  research by people who do not. **A chapter on culture written by one culture is the
  failure it warns about**, and the capture loop of §8.1 is the only honest way to fill it.
- **§4.6.2 judges this constitution's own locality**, which is not a neutral act. The
  claim that the articles travel and the rules are local is argued, not proven, and the
  author has better standing than I do to say where the line actually falls.
- **`print` may break the model, and that is why it is in.** If `MOTION` and `TEMPO` have
  no print form, the matrix has empty rows — honest, but it means "every stratum in every
  medium" is not the shape of the law.
- **Two silent parties, still not consulted.** The graphics plane and this constitution
  converged on five values without citing each other; the sound plane and this
  constitution have not yet met at all. Neither owner has agreed to anything here.
