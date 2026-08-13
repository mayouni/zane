# stzSense — the semantic sheet

**The name is settled**: the module is **`stzSense`**, the artifact is **`.sense`**, and
**ZSS** survives as the spoken name — the way *the law* means `rules.json` and *the court*
means `tools/zui/`. The reasoning is in §11, which is kept rather than tidied away because
the argument against the word *style* is the clearest statement of what this artifact is
not. Decided 2026-08-13.

**Status**: **v0.2 — a reflection, not a proposal for ratification.** Written 2026-08-13.
**Relation to the docket**: none blocking. ZSS changes no rule. It does, however, supply
the derivation path docket **A-7** obliges, which is worth knowing before ruling on it.
**Relation to [THE-SECOND-FOUNDING.md](THE-SECOND-FOUNDING.md)**: this is the artifact the
three axes have been implying since v0.2 and which no document has named.

---

## 1. The verdict, first

**The idea is right, and it is more important than a styling format.** But the CSS analogy
is the most dangerous thing about it, so let me be precise about what carries over.

> **ZSS is not a style sheet. It is the resolution from meaning to rendering, made
> declarable, shippable, versioned and checkable.**

Everything in this project has been converging on one sentence — *declare the meaning
once, and every medium and every culture renders it.* That sentence describes a
**function**, and until now that function has lived in code: a lookup table in
`stzDiagramColor.ring`, a motif set in `stzEarcons.ring`, seven themes in the colour plane.
Code is exactly where the three-way vocabulary drift of founding §2 happened.

So the real claim is not "Softanza needs styling." It is:

> **ZSS is what makes the semantic system *governable* rather than merely implemented.**
> The project's signature move — closed language, court, fixtures, consumers that pin —
> applied to *rendering* for the first time.

That is a keystone, not a convenience.

## 2. What CSS actually gave, and what it got wrong

Copying CSS wholesale would import its failures with its virtues. The split matters:

**What CSS got right, and ZSS should take:**

- **Presentation as data**, not code. Shippable, cacheable, overridable, analysable.
- **Addressability** — style a *set* of things by pattern, not one by one. This is the
  underrated genius, and the reason CSS scaled.
- **Context conditioning** — `@media`, `prefers-reduced-motion`. Rendering varies by
  situation without duplicating the document.
- **Layered origins** — author, user and user-agent styles coexist by design. The idea
  that *the operator also legislates* is CSS's, and it is right.

**What CSS got wrong, and ZSS must refuse:**

- **It has no semantics.** `color: red` says nothing about *why*. This is the original sin,
  and it is precisely what Softanza's semantic system exists to fix.
- **The cascade is not reasonable about.** Specificity arithmetic plus `!important` is a
  global mutable namespace; the industry's flight to utility classes and scoped styles is
  the verdict on it.
- **Selectors couple presentation to structure.** Restyling requires knowing the tree, so
  markup and style are entangled — the coupling the separation was supposed to prevent.
- **It grew into a layout engine.** Most of CSS's complexity is layout, and most of its
  difficulty follows from that.
- **It is unenforceable.** Nothing stops `color: red` on a success message.

Two of those five — the missing semantics and the unenforceability — are the two things
Softanza is *already* built to fix. That is the argument that ZSS is a good idea. The other
three are the traps.

## 3. The design question that decides everything: what does ZSS select on?

CSS selects on **document structure**. If ZSS does that, it inherits trap three and dies.

ZSS selects on a **point in the semantic space** — the axes this project already has:

```
:Danger                                  the meaning, everywhere
:Danger @auditory                        in one medium
:Danger @visual  ~zh-financial           for one reading
:Danger .Solid                           at one role step
:Danger @luminous                        where role steps do not exist
```

The left-hand side is drawn entirely from **closed vocabularies the court already knows**:
the semantic values, the media enumeration, the culture identifiers, the role steps. Which
gives ZSS a property CSS can never have:

> **In CSS you can style anything. In ZSS you can only style a meaning.**

The thing CSS forgot is structurally impossible to omit here. A ZSS rule that names no
meaning does not parse. And because every selector term comes from a closed set, **the
court can check a stylesheet** — unknown meaning, unknown medium, a role step in a medium
that has none, a rendering that violates a statute.

## 4. Precedence, not cascade

ZSS needs conflict resolution; it must not need specificity arithmetic. And the ordering
already exists — it was designed for governance, and it transfers exactly:

```
statute  >  core  >  commons  >  local  >  document
```

A statute-bound medium (machine indicators, road signage) outranks everything. The Core
outranks the Commons. An organisation's local law outranks a document's own preference.
**Any conflict is explained in one sentence by naming the tier that won** — which is the
property CSS's cascade fails to have, and the reason `!important` exists.

The operator's own preferences slot in cleanly and gain a better name: `prefers-reduced-
motion` is not a media query, it is **the operator legislating**, and it belongs at the
local tier. Article VI already grants that primacy; ZSS is where it finally binds.

## 5. Programmability comes from the Ring column, not from the format

CSS is famously *not* programmable — Sass exists because of it — and every attempt to add
logic to a style format has ended badly. Softanza does not have to repeat that experiment,
because the family already ratified the answer.

**The two-surface doctrine** (RingFace's, adopted by C3 §6): a Ring builder is the
*authoring surface* and **emits** the artifact; the artifact is what ships and is
**re-judged on arrival**. So:

- `.zss` is a closed plain-text artifact — no logic, no loops, no functions.
- A Ring surface computes whatever it likes and emits `.zss`.
- The court reads the artifact, never the builder.

Programmability without a programmable format, using a doctrine that is already family law
and already has three consumers. This is the single strongest argument that ZSS fits the
family rather than being bolted onto it.

## 6. The five refusals

Without these, ZSS becomes CSS in nine months.

1. **ZSS never positions anything.** No margin, no padding, no grid, no coordinates.
   Layout is `STRUCTURE`'s stratum and it is *relational* — what is grouped, subordinate,
   ordered — never metric. **If ZSS ever gains a length unit, the experiment has failed.**
2. **ZSS never names a screen, a component, or an element.** That is `.face`'s business
   (composition and binding) and `.zui`'s (intent). ZSS knows meanings, not surfaces.
3. **ZSS never introduces a meaning.** The semantic values are the law's. A stylesheet
   that could add one would be a library amending a constitution.
4. **ZSS never computes.** See §5.
5. **ZSS never overrides a right.** A `VIBE` may not strip an `ALWAYS_REACHABLE` intent;
   neither may a stylesheet. `VIBE_STRIPS_RIGHT` has a ZSS twin.

## 7. Boundaries — what ZSS is not, said plainly

| Neighbour | Owns | ZSS does not |
|---|---|---|
| `.zui` | intent — what the human is doing | ever name a meaning's *purpose* |
| `.face` (RingFace, v0 shipped) | composition and binding — what is on a surface | ever name a surface |
| `stzColor` / graphics plane | computing a colour from a meaning | compute; it *declares which* meaning maps where |
| `stzEarcons` / sound plane | rendering a motif | contain audio |
| `stzCulture` (proposed) | what a sign means to a reader | store cultural knowledge; it *references* it |
| the constitution | which meanings exist and what they oblige | legislate |

**And the seven existing colour themes are not replaced — they are the first ZSS
documents.** A theme *is* a stylesheet in this model, which is the cheapest possible proof
that the format is the right shape: if the existing themes cannot round-trip through ZSS,
the design is wrong and that is a decisive early test.

## 8. What v0 should actually cover — and it is small

The temptation is to specify ZSS across six strata and ten media. That would fossilise
guesses, because **five of the six strata do not exist yet**.

> **ZSS v0 covers `SIGNAL`, in `visual` and `auditory`, and nothing else.**

That is the only part of the system that is real today: five semantic values settled in
law, role steps built and committed in the colour plane, the same five adopted by
`stzEarcons` with motifs and an audibility story. Two media, one stratum, both with a
working engine behind them.

It is also the smallest version that proves or kills the thesis, because it must
immediately do three things that matter:

1. **Round-trip the seven existing colour themes** with no loss.
2. **Express the CJK financial inversion** — `:Success @visual ~zh-financial` — which is
   the live defect in `stzDiagramColor.ring:45`.
3. **Serialize the earcon set**, so one document carries both channels and the claim
   *"declare the meaning once and every medium renders it"* stops being a slogan.

If v0 cannot do those three, the idea is wrong and we will know cheaply.

## 9. Practical value, concretely

- **It closes the seam that caused the drift.** Rule 118, `stzColor` and `stzEarcons`
  currently agree by *coincidence and good intentions*. With ZSS they agree by *pinning
  the same artifact*, and a court can prove it.
- **It is the colour plane's unimplemented C5.** That phase — theme export to CSS/JSON/Ring
  — is not started. ZSS is the format it was reaching for, generalised past colour.
- **It makes culture deployable rather than theoretical.** A ministry's local overrides are
  a ZSS file it ships. Without ZSS, the cultural axis has nowhere to live in production.
- **It gives the court a second artifact class.** Today `zui check` judges `.zui` and
  reaches 8% of the law. A ZSS judge reaches rules the intent language cannot express —
  and it is the first time the enforcement percentage moves for a reason other than adding
  rules.
- **It is the tool-makers' seam.** A design-token pipeline, a Figma plugin, an LSP, a
  theme editor — all read and write one documented format, and prove conformance against
  fixtures.
- **It exports outward.** ZSS → CSS variables is a projection, so a non-Softanza web app
  can consume Softanza's semantics. That is the protocol pack's most persuasive artifact:
  something a stranger can use on day one without adopting anything else.

## 10. The honest risks

- **Format fatigue is real.** The family already carries `rules.json`, `violations.json`,
  `world.json`, `zing.json`, `.zui`, `.face`, `.wflow`, `.zql`, `.narration`, `.game`. An
  eleventh format needs to carry something none of them can. ZSS does — none of them binds
  a meaning to a rendering — but the cost should be stated, not waved past.
- **The name will do damage.** *Style sheet* imports the CSS mental model, and the first
  question every reader asks will be "so can I set a font size?" — to which the answer is
  no, permanently. The acronym is good; the documentation must lead with the refusals of
  §6, not with the analogy.
- **`.face` overlap is the live boundary risk.** `.face` shipped v0 and is hardening. If
  ZSS is designed without RingFace in the room, two composition-adjacent formats will grow
  toward each other. **Do this one with them, not near them.**
- **It is premature for five strata and correctly timed for one.** Hence §8. The discipline
  that makes the whole idea safe is refusing to specify what does not exist yet.
- **This document is a reflection, and reflections are cheap.** Nothing here has been
  prototyped; the round-trip test in §8 is the first thing that would tell us anything real,
  and it could fail.

## 11. The name

**First, a correction to §10.** I implied the name breaks the family's conventions. It does
not. The prefix rule governs *component* names (`Ring*` · `Stz*` · `Zing*`), and file
formats have never followed it — `.zui`, `.zql`, `.face`, `.wflow`, `.game`, `.narration`
carry no prefix, and **ZQL is direct precedent for a Z-named language that is not
`Zing*`.** So "ZSS" is structurally fine.

**The real objection is one word, and it is a factual one: `style`.** This artifact carries
no style. It carries the binding from a meaning to a perceptible form. A reader who arrives
expecting a style sheet will look for fonts, spacing and colours-as-choices, and will find
none of them — and the first question every one of them asks will be *"so can I set a font
size?"*, to which the answer is no, permanently. A name that generates the same wrong
question forever is a tax paid on every conversation.

Three ways out, ranked:

**1. `.sense` — `stzSense` — "the sense sheet."** ✅ **Chosen, 2026-08-13.** The English word
carries *both* meanings this artifact needs at once: **sense** as perception (sight,
hearing, touch — every medium) and **sense** as meaning (*does this make sense*). Which is
exactly what the file does: it says how a meaning reaches a sense. It matches the book's
Part V, *The Senses*; it collides with nothing (`SIGNAL` is a stratum, `sense` is the
sheet); and `stzSense` satisfies the prefix rule for the module. The one weak spot is the
`machine` medium, which is not a sense — though *"it makes sense to a machine"* survives
the stretch.

**2. Keep the acronym, drop the false word: ZSS = "Zui Semantic Sheet."** The cheapest fix.
It keeps a memorable acronym that gets a stranger to the right neighbourhood in one second,
and removes the one term that misleads. Cost: `Zui` narrows a thing that is family-wide —
sound, print and signage are not Zui's.

**3. Keep ZSS exactly as it is, and pay the tax deliberately** — leading every document
with §6's refusals rather than the analogy. Defensible if the marketing value of the CSS
echo is judged worth more than the recurring misunderstanding. It is a real trade, not a
mistake.

A fourth option is available and costs nothing: **let ZSS live as the spoken name and
`.sense` as the artifact.** This project already does exactly that — *the law* is
`rules.json`, *the court* is `tools/zui/`, *the Gotchas* are seven HTML pages. Informal
names are how people talk; formal names are what the court reads.

## 12. Where CSS sits in the Softanza world

CSS is not a rival and not a dependency. **It is a projection target — one of several —
and the only one dangerous enough to need a doctrine.**

```
MORE ABSTRACT
   the constitution  rules.json          what must be true of any interface
   intent            .zui                what the human is doing
   the semantic values                   what things mean
   the sense sheet   .sense / ZSS        how a meaning becomes perceptible
─────────────────────────────────────── the projection boundary ───────────
   CSS variables · theme data · earcon parameters · PWM duty cycles ·
   print profiles · ARIA · sign geometry
───────────────────────────────────────────────────────────────────────────
   pixels · samples · photons · ink · vibration
MORE CONCRETE
```

**The mapping that makes it memorable**, because the family already has the precedent one
row up:

| Softanza declares | The web renders |
|---|---|
| `.zui` — intent | HTML — structure |
| the sense sheet — meaning → perception | **CSS — presentation** |
| the court — refusal, citing a numbered law | *(nothing)* |

The empty cell is the whole argument. The web has no court, which is why its quality is
unenforceable and why the deterioration this project exists to answer was possible at all.

### 12.1 The doctrine: CSS is emitted, never authored

Zing already emits HTML rather than authoring it. CSS gets the same treatment, and for a
sharper reason: **CSS is the only projection target that has an authoring culture around
it.** Nobody hand-writes PWM duty cycles. Everybody hand-writes CSS — and *every
hand-written CSS rule is a meaning that escaped the semantic layer*, exactly as a hex
literal in code is. The court cannot see it, the culture axis cannot vary it, and the
statute tier cannot constrain it.

So: a Softanza project that hand-writes CSS has bypassed its own semantics, and the honest
statement is that **the court is blind there** — not that it is forbidden.

### 12.2 CSS custom properties are the emission target, and the persuasive artifact

`--stz-danger-solid`, `--stz-danger-surface`, and their culture- and theme-resolved values.
This matters strategically out of proportion to its size: **a web app that adopts nothing
else can consume Softanza's semantics through a variables file.** That is the protocol
pack's most persuasive object — something a stranger uses on day one without installing a
component, and the cheapest possible on-ramp.

### 12.3 What CSS does better, and Softanza must not rebuild

Honesty in both directions:

- **Layout.** Flexbox and grid are genuinely excellent, and `STRUCTURE` declares *relations*
  precisely so CSS can realize them. §6's first refusal is not only a discipline — it is a
  recognition that this problem is solved downstream.
- **The user stylesheet.** CSS's much-maligned cascade carries real accessibility
  infrastructure: the user's own styles outrank the author's. That is the operator
  legislating, and it is the one part of the cascade worth preserving in spirit.
- **Universality.** CSS is deployed everywhere. Emitting to it is leverage, not compromise.

### 12.4 Design tokens are the honest prior art — and the argument

The industry has been groping toward this for a decade: CSS custom properties, the W3C
Design Tokens format, `color-mix()`, `light-dark()`, `prefers-reduced-motion`. The whole
design-token movement is an attempt at meaning-first styling, and it is the closest thing
to a competitor this idea has.

It is also stuck, and the reason is precise and instructive. **Design tokens have no law,
no court, no culture axis, and no medium beyond the screen.** A token named
`color.semantic.danger` is a convention that a linter cannot check, a constitution does not
oblige, a Chinese financial reading cannot invert, and a loudspeaker cannot render.

Which places Softanza exactly: not *against* CSS, but **the layer the design-token
movement keeps reaching for and cannot build, because a token system without a
constitution is a naming convention with good intentions.**

## 13. The claim, stated once

CSS gave HTML **programmability** by making presentation into data. Its price was that the
data meant nothing, and could not be checked.

ZSS gives Softanza **governability** by making *meaning-resolution* into data — the same
move, one level up, with the semantics CSS never had and the court CSS never could have.
That is why this is worth doing, and why it is worth doing small first.
