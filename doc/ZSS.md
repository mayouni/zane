# ZSS — the Softanza Semantic Style Sheet

**Status**: **v0.1 — a reflection, not a proposal for ratification.** Written 2026-08-13.
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

## 11. The claim, stated once

CSS gave HTML **programmability** by making presentation into data. Its price was that the
data meant nothing, and could not be checked.

ZSS gives Softanza **governability** by making *meaning-resolution* into data — the same
move, one level up, with the semantics CSS never had and the court CSS never could have.
That is why this is worth doing, and why it is worth doing small first.
