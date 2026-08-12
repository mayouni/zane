# The Second Founding — StzZui as a complete platform for interfaces

**Status**: **v0.1 — proposed, not ratified.** Written 2026-08-12 for the author's
section-by-section pass, in the manner of the reference design's own ratification.
**Amends**: [ARCHITECTURE.md](ARCHITECTURE.md) (founding document, 2026-08-05), whose
three-layer model this restates rather than replaces.
**Touches**: `softanza/REFERENCE_DESIGN.md` v1.3 — one amendment proposed in §6, **not
applied**; that document is ratified and amends by its own process.
**Preserves**: everything in §3. The inversion is not negotiable and is not negotiated here.

---

## 1. The finding

StzZui inverted the order of interface design and made intent declarable. That work is
sound, it is finished, and it is the foundation everything below stands on.

It is also, today, **one third of a platform** — and the project's own data says so.

> **The law legislates a territory the language cannot declare, so the court cannot
> reach it.**

The constitution holds **117 rules**. Their enforcement tiers:

| Tier | Rules | Share | Meaning |
|---|---|---|---|
| `judgment` | 78 | 67% | a human decides, until an instrument is invented |
| `machine-later` | 25 | 21% | **the law's own admission that the instrument is missing** |
| `machine` | 9 | 8% | a declaration checker refuses it |
| `tool` | 5 | 4% | measured on a painted page |

**Eight percent of the law is refusable before a pixel exists.** The other 92% is prose,
human vigilance, or a post-hoc measurement of damage already rendered.

That is not a failure of the verifier. The verifier enforces 19 of the 20 diagnostics it
was given and passes 30/30 fixtures. It is a failure of *expressible surface*: there is
nothing in a `.zui` file for those rules to bind to. [DECLARATIONS.md §6](language/DECLARATIONS.md)
states the boundary plainly — *"No `WIDGET`, no layout, no colour"* — and Set 2 (Visual
Principles), Set 3 (Layout), Set 10 (stzErrors), Set 13 (Widget Selection), Set 15
(Theming) and Set 17 (Accessibility) legislate exactly that territory anyway.

**The law went where the language refused to follow.**

### 1.1 The demonstration

Two payment-approval surfaces. The first: a table, one primary action, consequence
carried by one reserved colour, errors that name a remedy, undo as a ten-second toast.
The second: a grid of clickable cards that look like information (Rule 119), three
competing primaries (Rule 8), red for both brand and danger (Rules 3, 87, 117),
*"Invalid input!"* (Rule 40), undo buried in a menu (Rule 79), body text at 11px
(Rule 105).

Declared in Zui, the two files are **byte-identical once comments are stripped**:

```zui
DEFINE INTENT_FLOW approve_payment (
  SATISFIES [SELECT, CONFIRM, ACT],
  ALWAYS_REACHABLE [UNDO, CANCEL, EXIT],
  ACTOR treasurer
)
DEFINE SCREEN payment_queue ( SATISFIES [SCAN, COMPARE, LOCATE], INTENT_FLOW approve_payment )
DEFINE FEEDBACK approval_result ( TONE informational, REPORTS [approval_state] )
```

Both run clean at **Level 4**, the highest level the suite defines:

```
clean — 1 file(s), 0 violations at level 4 against Zui v3.7.3
clean — 1 file(s), 0 violations at level 4 against Zui v3.7.3
```

Seven laws are broken by the second surface and the court has nothing to say, because
the language gave it nothing to read. **The court is silent exactly where the
deterioration lives.** Intent underdetermines the interface, and the underdetermination
is where all the harm happens.

### 1.2 The corroborating number

Of the 25 rules the law marks `machine-later`, **all but one are expression rules** —
colour (3, 87, 56, 62), layout (85, 90, 92, 93, 95), widget role (46, 47, 96, 104),
message (28, 29, 41, 86, 106, 99), motion and timing (15, 18, 19, 21, 100). The single
exception, Rule 26, is already reachable from intent and *is* cited today by
`MISSING_CANCEL`.

The law has been telling us where the missing instrument is, in its own data, for
twenty-five rules.

## 2. The evidence the project produced without noticing

While this repository legislated colour, `stzlib` **built** it.

- The constitution, **Rule 118, "Two Families of Colour"** (`invariant: true`): *"Family
  one is semantic status, five values with strict meanings: success, warning, danger,
  info, muted."*
- The graphics plane, `SOFTANZA_COLOR_SYSTEM.md`, founding principle: *"an author writes
  a meaning and gets a colour."* Semantic names `:Primary :Success :Warning :Danger
  :Info :Neutral`; role steps `:Danger.Surface / .Border / .Solid / .Text` and
  `:OnDanger`; OKLCH ramps that are *"monotonic, evenly spaced and hue-stable BY
  CONSTRUCTION rather than by taste"*; contrast carried as a number with WCAG 2 and APCA
  both named at every report, and a stated refusal — *"a design system that cannot fail
  an accessibility check does not have one."* C1 and C2 committed; 42/42 theme/role
  pairs pass 4.5:1.

Two parts of one project independently derived the same five semantic values — one as
**law that cannot be enforced**, one as **an engine that cannot be governed** — and
**neither document cites the other.** They have already drifted: the law's fifth value
is `muted`, the engine's is `:Neutral`.

That drift is not a tidiness problem. It is the exact defect this project exists to
prevent, occurring inside it, because the seam between meaning and rendering was never
declared. It is also the best possible proof that the seam is real: two teams walked to
opposite banks of the same missing bridge.

A second, immediately cashable consequence: **Rule 62 (Contrast & Legibility) is marked
`machine-later` while `StzIsLegible` already exists and is CI-gated.** The instrument was
built. The law does not know. That rule can move up the enforcement ladder this month.

## 3. What is preserved — and is not open

This document expands scope. It touches nothing below.

1. **The inversion.** Intent first; rendering is a consequence. Every UI element traces
   to at least one intent.
2. **The closed intent grammar.** 22 verbs, six families. A new medium adds renderings,
   never verbs. Nothing in §5 adds a verb.
3. **The constitution's independence** from every product, including from this document
   and from the reference design. If they conflict, the law wins on its own ground.
4. **Evidence over fashion.** Article VII. Rule numbers stable forever; retired numbers
   never reused; burned numbers stay burned; evidence never corrected.
5. **The signature move**: closed language + court + fixtures + consumers that pin.
   §5 does not invent a new discipline; it applies this one six more times.
6. **The substance test and the patch component**, exactly as they stand.

## 4. The move: the expression stratum

The founding architecture named three layers and left the middle one to "projections",
which are per-medium, replaceable, and — critically — **not declarable**. So the ladder
runs from intent (checkable) directly to pixels (measurable only after painting), with
nothing between.

```
LAYER 3 — PROJECTION      how one medium paints it        per-medium, replaceable
LAYER 2 — EXPRESSION      how intent is made perceivable  ← THE MISSING MIDDLE
LAYER 1 — INTENT          what the human is trying to do  closed, 22 verbs
```

**Expression is not appearance.** A declaration in this stratum never names a pixel, a
hex value, a font size, or a component library. It names a **meaning, a promise, or a
relation** — the things HCI has understood for fifty years and no language has made
checkable:

- a *role* is a promise about behaviour, not a widget;
- a *signal* is a meaning bound to a colour, not a colour;
- a *structure* is a relation between things, not a grid;
- a *message* is what the system owes the operator, not a string;
- a *motion* is a state report, not an animation;
- a *tempo* is a budget, not an easing curve.

### 4.1 The rule that keeps the inversion intact

> **Every expression declaration traces to an intent, or it is an error.**

This is `INTENT_ORPHAN` extended one level down: `EXPRESSION_ORPHAN`. A `ROLE` that
serves no declared intent, a `SIGNAL` no declaration carries, a `MESSAGE` that reports no
state — each is unlawful for the same reason a widget tracing to no intent is unlawful.

The expression stratum is therefore **not a second language beside intent**. It is
intent's refinement, and it inherits intent's discipline. That is why this is a second
founding and not scope creep: the founding principle is not weakened, it is *extended to
the layer where it was always needed*.

## 5. The six strata

One per territory the author named. Each is a closed vocabulary with a court and
fixtures. Each is drawn from rules that **already exist** — extracted from the law's
practice, never invented fresh, the discipline C2 was delivered under.

### 5.1 `STRUCTURE` — layout as relation

What is grouped, what is subordinate, what order the eye takes, how dense the surface
is, how deep it goes. Never a grid, never a pixel.

*Sketch*: `GROUPS`, `PRIMARY` (Rule 8, one primary axis), `READING_ORDER` (Rule 123, the
reading arc), `DENSITY`, `DEPTH`, `ANCHORS` (Rule 85).
*Makes reachable*: Set 3 (9 rules), Set 4 (3), Set 9 (4), Rules 90/92/93/95, 107, 111,
113, 114.
*Implemented by*: the projection. *Governed by*: this repository.

### 5.2 `SIGNAL` — colour as meaning

Rule 3 already names this stratum: *"Color is a signal, not an identity."* A declaration
binds a **meaning** to a semantic value; the engine computes the colour.

*Sketch*: the five semantic values of Rule 118 as the closed set, plus the role steps the
graphics plane proved necessary (`.Surface .Border .Solid .Text`, `:OnX`), plus a
legibility obligation expressed as a floor, not a hex.
*Makes reachable*: Set 2 (11), Set 15 (3), Set 17 (3), Rules 117, 118.
*Implemented by*: **stzlib's graphics plane, which already built it.** This stratum's
first act is not to design anything — it is to **reconcile `muted` with `:Neutral`, make
the two documents cite each other, and bind Rule 62 to `StzIsLegible`.**

### 5.3 `ROLE` — the element as promise

The resolution of the `WIDGET` exclusion, and the most delicate move here. A declaration
still may not name a widget. It may name a **role**: *this control promises instant,
reversible, binary state* — a contract a projection must keep, and may keep with any
widget it likes.

*Sketch*: `PROMISES` (reversible · immediate · destructive · navigational · read-only),
`SERVES` (the intent), `KEYBOARD` (Rule 80).
*Makes reachable*: Set 13 (7 rules, of which 5 are `judgment` and 0 are `machine`
today), Set 11 (2), Rule 119 — *"a card is a read-only indicator… form follows role, and
each widget plays exactly one."* The law already says **role**. It has simply had no
place to write one down.

### 5.4 `MOTION` — motion as report

Already half-declared: `VIBE` carries a `MOTION` field and Rule 112 says *motion reports,
it never decorates*. Promote it to a declaration that must name the state it reports.

*Sketch*: `REPORTS` (reusing `FEEDBACK`'s existing field), `DURATION_CLASS`,
`INTERRUPTIBLE`, `RESERVES_SPACE` (Rule 38).
*Makes reachable*: Rules 19, 21, 38, 112, Set 28 (2).

### 5.5 `MESSAGE` — the system speaking

Set 10 is a philosophy of error with six rules and one machine tier. The stratum makes
the system's voice declarable: what a message must **contain**, not what it says.

*Sketch*: `KIND` (error · denial · confirmation · empty · progress), `NAMES` (cause ·
remedy · actor — Rule 40's non-accusatory pathfinding, made structural), `TONE` (the
existing closed enumeration), `PROXIMITY` (Rule 86), `AS_DATA` (Rule 122).
*Makes reachable*: Set 10 (6), Set 8 (4), Set 18 (3), Rules 106, 99.
*Note*: this extends the existing `FEEDBACK` declaration rather than replacing it.

### 5.6 `TEMPO` — time and interruption

The experiential dimension the author named last and users feel first: latency budgets,
what may interrupt, what survives interruption, what resumes.

*Sketch*: `BUDGET` (Rule 18's hundred milliseconds, as a declared class), `INTERRUPTS`,
`RESUMES`, `FOCUS` (Set 14).
*Makes reachable*: Set 5 (9), Set 6 (3), Set 14 (3), Set 28 (2), Rule 100.

## 6. Ownership — the boundary this must not cross

The family has already assigned neighbouring territory, and a scope expansion that
ignored it would break the doctrine *"no layer speaks for another's roadmap."* `.face`
(RingFace) owns composition and binding, and shipped v0. C7, the Display Contract
(stzlib), owns how a value shows itself. Zing owns delivery. The graphics plane owns
colour computation.

**The split that keeps every one of those intact:**

> **StzZui owns the vocabulary, the law, and the court. The siblings own the artifacts
> and the engines.**

This is precisely what StzZui already does for intent, applied six more times. It takes
nothing from anyone:

| Territory | StzZui provides | The sibling provides |
|---|---|---|
| Colour | the semantic values, the law, the legibility floor | stzlib computes the colour (OKLCH, contrast, themes) |
| Composition | the role and structure vocabulary `.face` binds | RingFace's `.face` grammar, court and fixtures |
| Value display | the role a rendered value plays | stzlib's C7 |
| Delivery | the law the delivered page is judged against | Zing |

**Proposed amendment to `softanza/REFERENCE_DESIGN.md` v1.3** — one row, not applied
here, for the author's own ratification process: layer 2's description *"the UI law as
data (StzZui)"* becomes *"the UI law and the interface vocabulary as data (StzZui)"*, and
§6.3's UI-pipeline horizon gains the note that the expression vocabulary is the seam
`.zui` and `.face` meet on.

## 7. The constitution as a living institution

The author's requirement: a non-negotiable core, with laws anyone may add from the pains
they meet in daily use. That is a governance architecture, and the law already has most
of its parts.

**Three tiers, one supremacy rule.**

1. **The Core — non-negotiable.** The preamble, the 7 articles, the operator rights, the
   intent-family invariants, the forbidden patterns. Amended only by convention, never
   by contribution. This is what makes it a constitution and not a style guide.
2. **The Commons — contributed, curated, evidence-gated.** Today's 117 rules and every
   rule anyone adds. Open to all.
3. **The Local — a person's or an organisation's own laws.** Same schema, pinned
   alongside, shipped with the app.

> **Supremacy**: a local law may be *stricter* than the commons and never *looser*. It
> may not permit what the commons forbids, and neither may permit what the Core forbids.

**The admission test is already in the data.** Every one of the 117 rules carries
`derived_from`, naming the article it descends from — and all 117 resolve to one of the
seven. That is the coherence mechanism, and it needs no committee of taste:

> **A proposed rule that derives from no article is inadmissible. A proposed rule that
> contradicts the Core is inadmissible. Everything else is a question of evidence.**

**The admission triple.** This project already writes every argument three ways — the
Gotchas make an offense *feelable*, the fixtures make it *checkable*, `evidence` makes it
*accountable*. Every conformance fixture already ships with a lawful twin; every gotcha
already pairs an offense with its repair. So a contributed law arrives as all three or
not at all:

| | Form | Audience | Precedent in this repo |
|---|---|---|---|
| **The gotcha** | offense + lawful twin, playable | humans | `site/gotchas/`, 12 offenses |
| **The fixture** | declaration + expected verdict | machines | `conformance/`, 30 fixtures |
| **The evidence** | what happened, where, when | the record | `evidence` on all 117 rules |

No taste is admitted, and no rule enters on eloquence. *Fashion is not admissible* stops
being a slogan and becomes an intake form.

### 7.1 The loop that closes it

The channel the author named — every Softanza app carries a feedback mechanism — is the
part no UI standard has ever had, and it is what makes the corpus grow from **pain**
rather than from opinion:

```
an operator meets a pain, in the app, at the moment it hurts
        ↓  capture: the surface, the intent it was serving, what was expected
a gotcha            — reproducible, feelable, dated
        ↓  the operator keeps it
a LOCAL law         — binding on their own app immediately
        ↓  the operator publishes it
a COMMONS proposal  — gotcha + fixture + evidence
        ↓  admitted (derives from an article, evidence stands) or refused with a reason on record
a CANONIZED rule    — numbered forever
```

This is the answer to the deepest cause of the deterioration: **the person who feels the
pain has never had a channel to the person who decides.** Analytics count clicks, not
suffering. A refusal, recorded with its reason, is as valuable as an admission — it is
how the corpus stays small enough to be law.

## 8. The protocol

For StzZui to be adopted by ecosystems that owe Softanza nothing, what a participant
downloads must be data, and the identity must be neutral. Most of the pack exists:

| Piece | Status |
|---|---|
| The law, as data, versioned, pinned by hash | ✅ `constitution/rules.json` v3.8.0 |
| The intent grammar + declaration types, in EBNF | ✅ `doc/language/` v1.0 |
| The refusal envelope every court speaks | ✅ **C2, delivered 2026-08-12**, v1.0 |
| Conformance fixtures as the gate | ✅ `conformance/`, 30 fixtures |
| **The six expression grammars** | ✗ §5 |
| **The contribution protocol** (how a law enters) | ✗ §7 |
| **The feedback protocol** (how a pain is transmitted) | ✗ §7.1 |
| **A neutral, citable identity** for the standard | ✗ open |

Softanza becomes the **reference implementation and the showcase** — the same
relationship the reference design already draws for every other contract. The pack must
be implementable by someone who never installs a Softanza component.

## 9. Why now: interfaces under generation

Every argument above predates AI. This one does not, and it is the reason the timing is
not arbitrary.

Interfaces are now generated faster than any review process can absorb. If the only
quality gate is human taste applied after rendering, that gate is already overwhelmed —
and the generator has no way to *know* the law it is breaking. The project's existing
position is right and incomplete: Set 31 governs the agent as an **actor**, Rule 121
forbids the masking assistant, Rule 124 demands the generator ship a working thing.

The expression stratum completes it, because a court that can only check intent can check
almost nothing a generator gets wrong. Generators do not usually misdeclare intent. They
produce card grids that lie, three competing primaries, red for brand and danger, and
*"Invalid input!"* — **every failure in §1.1's second surface is a failure a generator
makes by default**, and every one becomes refusable under §5.

Two consequences worth stating as commitments:

- **The law is consultable while generating**, not only after (the MCP surface already on
  the roadmap as M5).
- **A generated surface cites the rules it obeyed**, making provenance of generated UI a
  property of the artifact — the natural extension of Rule 99, Visible Provenance.

The strongest claim this project can make in 2026: **it is the only UI quality gate that
scales with generation, because it refuses by law rather than by review.**

## 10. Practicality — three audiences, three doors

A platform nobody can pick up is a monograph. Each audience gets one door and one
promise.

- **Designers** — a vocabulary for what they already mean, and a place to write it down
  before a tool imposes an answer. The door is the Gotchas (feel the law), the Reader
  (read it), and the capture form (contribute to it). *Never asked to write JSON.*
- **Developers** — one dependency-free binary, a CI gate, an exit code, and diagnostics
  that cite a numbered law instead of an opinion. The door is `zui check`. *Nothing to
  install beyond a runtime they already have.*
- **Tool makers** — the protocol pack of §8: grammars as data, the law as data, the C2
  envelope, the fixtures. The door is conformance. *An LSP, a Figma plugin, a linter or a
  generator can be built and can prove agreement.*

The C2 envelope delivered today is already the tool-makers' seam; §5 gives the other two
doors something to be about.

## 11. The book

The reference book (AYOUNI Press) is not a write-up of the repository — it is the
argument the repository is the apparatus for. Proposed spine:

| Part | Argument |
|---|---|
| I — The Deterioration | Why interfaces got worse while tooling got better: the vocabulary collapsed into the toolkit, rendering got cheap and meaning got expensive, the pain never reached the decider, fashion replaced evidence. |
| II — The Heritage | What HCI already knew and could not enforce: Norman's gulfs and affordances, Nielsen's heuristics, Fitts, Hick, Gestalt, Tufte, Shneiderman. Fifty years of findings, none of it checkable. |
| III — The Inversion | Intent first. The closed grammar. Why correctness becomes compilable. |
| IV — The Expression | The missing middle: structure, signal, role, motion, message, tempo. |
| V — The Law | A constitution for interfaces: articles, rights, evidence, the enforcement ladder, the substance test. |
| VI — The Commons | Governance: the non-negotiable core, the contributed corpus, the loop from a user's pain to a numbered rule. |
| VII — Under Generation | Interfaces made by machines, refused by law. |
| VIII — In Practice | Adopting it; the toolchain; Softanza as the worked showcase. |

**One discipline the book should borrow from the law**: every claim in it that a machine
can check should be **generated from the artifacts** — rule counts, enforcement tiers,
fixture verdicts, the conformance table. A book about drift that drifts from its own
apparatus would refute itself. Titles are the author's; the honest register of the
material is closer to *A Law for Interfaces* than to a manifesto.

## 12. Sequencing

Cheapest first, each shipping complete, no stratum opened before the one it leans on.

```
M6  The reconciliation      SIGNAL, with zero new design:
                            muted ↔ :Neutral, the two documents cite each other,
                            Rule 62 bound to StzIsLegible and promoted off machine-later.
                            Pays immediately; proves the seam is real.
M7  ROLE + MESSAGE          the two strata with the most judgment-tier rules and the
                            most daily pain. Grammar → court → fixtures, per stratum.
M8  The commons             core/commons/local split in rules.json; the admission
                            triple; the capture form; the first contributed rule.
M9  STRUCTURE + MOTION + TEMPO
M10 The protocol pack + the MCP surface (existing M5 folded in)
```

`M4 — Rendering projections` is superseded: it assumed projections were the answer, and
§4 finds that projections are downstream of a stratum that does not exist yet.

## Honest boundaries

- **Nothing here is ratified.** This is a proposal for the author's pass, in a project
  whose whole discipline is that the author ratifies section by section.
- **Nothing here is implemented.** Six grammars are named and none is written. §5's
  sketches are sketches — the field lists will not survive contact with fixtures
  unchanged, and should not.
- **The scope grows by roughly the work already done.** Six strata is not a milestone; it
  is a programme of several. M6 is deliberately sized to be cashable in days, so the
  thesis is tested before the programme is funded.
- **The `WIDGET` exclusion is preserved in letter and re-read in spirit.** §5.3 admits a
  *role*, never a widget. If the author judges that a role is a widget wearing a
  disguise, the whole stratum must be reconsidered — it is the load-bearing move of §5
  and the one most worth attacking.
- **The colour reconciliation touches a live tree.** `stzlib`'s C3 phase is uncommitted
  and in flight in another session; M6 must not race it.
- **The two silent parties are the strongest evidence and were not consulted.** stzlib's
  graphics plane and this constitution converged on five semantic values without citing
  each other. That was observed on 2026-08-12 by reading both. Neither owner has agreed
  to anything here.
