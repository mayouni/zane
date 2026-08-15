# Finding for the graphics plane — the semantic colour seam

**From**: StzZui, 2026-08-13, after the constitution reached **v3.9** and the sound plane
shipped `stzEarcons`.
**Genre**: a cross-plane finding, the kind this plane already receives — the sound plane's
SN5 request that became `AddImage`, and the reversible-text-layout request that became
`RectsOfRange` / `CaretRectAt` / `IndexAtPoint`.
**Status**: **four items, no defects in this plane's own terms.** Three are small. The
first is the one that matters, and it only became visible because a sibling plane shipped.

**Verified against the tree on 2026-08-13**, not remembered: `stzColor.ring:272-276`,
`stzDiagramColor.ring:45-52`, `stzTheme.ring:109-110`, and a full-text search of
`SOFTANZA_COLOR_SYSTEM.md`.

---

## 1 · The colour plane implements four of the law's five values

`StzSemanticColors()` returns `[ :Primary, :Success, :Warning, :Danger, :Info, :Neutral ]`.
The law's **family one** — Rule 118, *Two Families of Colour*, `invariant: true` — is
`success · warning · danger · info · **muted**`.

**There is no `:Muted`.** And the two candidates for it are both spoken for, so this is a
gap rather than a spelling difference. The constitution ratified the mapping at v3.9:

| the engine's name | what the law calls it |
|---|---|
| `:Success` `:Warning` `:Danger` `:Info` | family one, four of five |
| `:Neutral` | **family two** — *neutral metadata*, not a status |
| `:Primary` | Rule 3's *"one primary accent color per application"* — a **quantity** rule about identity colour |
| — | **`muted`** — *"waiting, inactive"*. Unimplemented. |

**Why it is visible now.** The sound plane implements all five, and rendering the fifth
taught it something this plane has not had to learn: **`muted` renders as silence**,
because *a sound announcing inactivity is a contradiction*. That is a *state* — waiting,
inactive — and it is categorically not the absence of semantic charge that `:Neutral`
carries.

So the two channels of one semantic system currently disagree about **how many values
there are**: colour says four, sound says five, the law says five.

**The request**: add `:Muted` to `StzSemanticColors()`. Not `:Neutral` renamed — a fifth
value beside it. What it resolves to is this plane's call entirely; the law says only that
it means *waiting or inactive*, and the sound plane's answer for its own channel was the
quietest thing available.

*This is the finding I would act on first. The other three are hygiene.*

## 2 · The citation runs one way

A full-text search of `SOFTANZA_COLOR_SYSTEM.md` for `Rule 118`, `Rule 3`, `StzZui`,
`constitution`, `rules.json` and `muted` returns **nothing**.

Meanwhile `stzEarcons` cites Rule 118 *by number*, and records why: *"the vocabulary is not
this plane's to choose… a sixth value here would be a constitutional amendment wearing a
library's clothes."*

The law now points outward — v3.9 added instrument pointers on Rules 3, 87, 118 and 62,
naming this plane's `StzContrastOf` / `StzIsLegible` and the sound plane's `stzEarcons`. So
three of the four directions are wired. **The plane that has implemented these five values
longest is the only one that never names where they came from.**

**The request**: one line in the plan of record saying which rule the semantic names serve.
It is the cheapest defence against the next drift, and the drift it defends against has
already happened once — see item 4.

## 3 · `stzDiagramColor.ring:45` still hard-codes one culture's reading

```ring
# Semantic color meanings (abstraction layer)
$acColorsBySemanticMeaning = [ :Success = "green", :Danger = "red", … ]
```

The comment is right that this is an abstraction layer. It stops **one level early**: it
abstracts hex → name, then hard-codes name → *one culture's reading*.

And it picks the worst possible pair to fix. `:Success = green` and `:Danger = red`
**invert** in Chinese, Japanese, Korean and Taiwanese financial convention, where red is
gain and green is loss. A Softanza financial dashboard shipped to Shanghai renders profit
in the colour of loss.

**Not a request to fix it now.** The culture module (`base/culture/`, proposed) is where the
third lookup belongs — meaning → *convention* → reading — and it does not exist. **The
request is a comment**: mark the table as culture-bound, so the next reader knows the
abstraction is unfinished rather than complete. The law now backs this: Rule 56 was extended
at v3.9 from themes to **audiences**, and binds once a meaning-to-rendering path exists.

## 4 · Theme export resolves to hex, and that is the same problem one layer out

`stzTheme.ring:109-110`, on export:

> *"RESOLVED to hex, never left as an expression. The far side of an export has no
> resolver."*

Correct as engineering, and the reasoning is sound. Recorded here because it is worth
knowing what it costs: **an exported theme is a meaning that has escaped its semantic
layer.** Once it is hex on the far side, no culture can vary it, no court can inspect it,
and nothing records what it meant.

This is precisely the seam `stzSense` exists to close — a serialization that carries
*meanings* rather than resolved values, so the far side gets a resolver instead of a
snapshot. When that lands, `ToCSS()` / `ToJSON()` gain a sibling that exports the binding
rather than the answer.

**No request.** A flag, so the export format is not treated as finished before the sheet
exists.

---

## What is *not* being asked

- **No colour values change.** Item 1 adds a name; what it resolves to is this plane's.
- **No culture machinery here.** Item 3 asks for a comment, not a lookup. Resolution
  belongs to `base/culture/` when it exists, and meanings belong to StzZui always.
- **No export redesign.** Item 4 is a flag against a future seam, not a defect.
- **Nothing about OKLCH, the role steps, contrast, or the ramp.** Those were surveyed in
  detail and are the strongest work in this area — the reason `:Danger.Solid` and
  `:Success.Solid` carry equal visual weight is a genuine result, and none of it is in
  question here.

## The thread through all four

The law and this plane derived the same five semantic values independently and **never
cited each other**, which is how they drifted into three spellings before anyone noticed.
v3.9 fixed the law's side. These four close the plane's side — and item 1 exists only
because a sibling plane implemented the same five values and found the one that was
missing.
