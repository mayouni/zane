# stzCSS — governing CSS the way stzRegex governs regex

**Run in**: `D:\GitHub\stzlib`

**Standing**: **proposed, nothing agreed.** `stzCSS` does not exist. This is a design
session: the deliverable is a plan of record and a challenge pass, not a class.

**Precondition**: read `SCOPE_ORIENTED_PROGRAMMING.md` first. This session is an M1–M5 pass
on a new field, and everything below is a *starting analysis to improve or refuse*, not a
specification.

---

## What exists today

Very little, and knowing that shapes the whole session:

- **No `stzCSS`.** No class, no module, no plan.
- **`base/file/stzHtml.ring`** carries exactly two style-adjacent methods — `Class_()` and
  `HasClass()`. There is no style or CSS manipulation.
- **`base/test/html/06_handling_css_style_manipulation.ring` is retired**, a stub reading
  *"pending broader stzHtml class port from archive."* **Find that archive before designing
  anything** — extract, never invent, and a port that was planned once may already answer
  half of this.
- `engine/src/html_dom.zig`, `base/system/stzWebBundle.ring` and `stzBuilder.ring` are the
  neighbours; know what they already do before adding to them.

## What stzCSS is — and what it is not

**It is the stzRegex move applied to CSS.** `stzRegex` did not replace regular expressions;
it made their invisible governing frame visible at the call site. `stzCSS` does the same for
CSS, for the same reason: **CSS is the textbook case of the disease Scope-Oriented
Programming names** — the same declaration behaves differently depending on context you
cannot see from the line you wrote.

**It is not `stzSense`, and it must not grow into it.** The two have different jobs:

| | `stzSense` | `stzCSS` |
|---|---|---|
| speaks | meanings — `:Danger`, per medium and reading | CSS — selectors, properties, cascade |
| is | Softanza's own semantic layer | the governed bridge to a world without semantics |
| medium | all of them | the web only |
| relation | **emits through** `stzCSS` for the web target | receives that emission; also *reads* CSS nobody wrote here |

**The doctrine that keeps them apart** (`stzzui/doc/STZSENSE.md` §12.1): CSS is *emitted,
never authored*. So `stzCSS` exists for three jobs — **emission**, **inspection of CSS that
already exists** (third-party themes, legacy pages, audits), and **authoring only where
there is no semantic layer to author from.** A Softanza application that authors its styles
through `stzCSS` has bypassed its own semantics, and the module's documentation should say
so as plainly as this prompt does.

---

## The M1–M5 pass — a starting analysis, offered to be improved or refused

### M1 — the hidden frames of CSS

Six candidates. Part of this session's work is deciding which are *essential decisions* and
which are **noise to dissolve** — the paradigm's own escape hatch, the one that dissolved
Concurrency rather than surfacing it.

1. **The cascade** — whether a declaration wins depends on specificity, source order,
   origin, `!important` and `@layer`. None of it visible at the line you wrote.
2. **The box model** — `width: 100px` means two different total sizes under `content-box`
   versus `border-box`, and the switch is usually set once in a reset file you did not open.
3. **The formatting context** — flow, flex, grid, table, absolute. This one decides *what
   half of CSS's properties mean*: `align-items` does something different in flex than in
   grid, and nothing at all in flow.
4. **Inheritance** — which properties inherit is memorised, never visible.
5. **Unit reference** — `em`, `rem`, `%`, `vw` each resolve against a different invisible
   thing: parent font size, root font size, containing block, viewport.
6. **Conditional context** — `@media`, `@supports`, container queries, pseudo-state.

### M2 — which are small closed sets?

- **Box model**: two. Trivially legal.
- **Formatting context**: flow · flex · grid · table · absolute — about five. Legal, and it
  is the highest-value frame in the list.
- **Unit reference**: about five reference kinds. Legal.
- **Cascade**: not a set at all — it is an arithmetic. See below.
- **Inheritance**: a per-property fact, not a scope. Probably **data the library holds**,
  not a frame to name.

### M3 — carriers, and each frame wants a different one

The paradigm gives three shapes, and the test is *how long must the frame live?*

- **Formatting context → receiver-carried**, the `App(:firmware).System()` shape. You
  *obtain* a context and speak properties into it; you never set one ambiently and inherit
  it. This is the move that makes `align-items` legible.
- **Units → value-carried**, exactly the numeric regime: `Rem(1.5)`, `Pct(100)`, `Vw(50)`.
  The unit rides the value through every combination, and the library knows what each
  resolves against.
- **Box model → the verb**, if it survives M1 at all — or dissolve it by making one model
  the only one the emitter produces, which is what every modern reset does by hand anyway.

### M4 — what the library must *compute*, or this is only a naming convention

This is the move that decides whether `stzCSS` is worth building. Three candidates, in
order of value:

1. **"Why does this rule win?"** — computed specificity, origin and order, answered in a
   sentence. The single most valuable thing any CSS tool can say, and none says it well.
2. **Refuse a property that is a no-op in its formatting context.** `align-items` in flow,
   `z-index` outside a stacking context, `gap` where nothing lays out. **This alone would
   catch a large share of real CSS defects**, and it is only decidable *because* M3 made the
   context explicit.
3. **Detect dead declarations** — overridden, or relying on inheritance from a property
   that does not inherit.

### M5 — rehearsal, and CSS has an unusually good case for it

CSS capabilities differ sharply by target: a modern browser, an email client, a print
stylesheet, a constrained embedded webview. **Email is the famous one** — a small, hostile
subset where most of CSS silently does nothing.

That is exactly M5's shape: a scope whose capabilities differ from the host's, *constraining
acts the scope forbids and rehearsing acts the host lacks*. `:asEmail` refusing what email
clients will drop is a genuinely useful product on its own, and it is the strongest single
argument that this module earns its place.

---

## Deliver

1. **`base/css/SOFTANZA_CSS_PLAN.md`** in house style: session bootstrap, numbered FACTs
   *surveyed not assumed* (starting with what the archive port actually contains), lessons
   inherited from the regex and system instances, phases with kill criteria written before
   the numbers, "Risks, named now", and a STATUS section per phase.
2. **The M1 ruling, in writing** — for each of the six frames: *surface it*, *dissolve it*,
   or *hold it as data*. With reasons. This is the session's most important output, and it
   is worth more than any code written afterwards.
3. **A challenge pass before any face**, as GR4 and SN4 did.
4. **Phase 0 spike** answering one question: **can specificity be computed and explained
   well enough to answer "why did this win?" from a parsed sheet?** If it cannot, M4 loses
   its best item and the module should be re-scoped or refused.

## 5. Add CSS to the paradigm document — as a **candidate**, not an instance

`SCOPE_ORIENTED_PROGRAMMING.md` already admits work at several maturities: an instance
table with statuses (*shipped · built · done · designed*) **and** a set of candidate fields
analysed but not built — Time, Units, Concurrency, Memory. Those candidates carry **frames
and scope sets only**: no verb names, no API, no example code.

**CSS belongs in that second list today, in exactly that register**, and the reason is one
this session will already be dealing with: the document's flagship regex example cites
`MatchOneSegment()`, which does not exist, and claims greedy-versus-lazy-by-verb, which is
not implemented. That happened because an intended design was written as though realised.
**Do not repeat it.** M3 is where naming lives, and a verb name published in that document
propagates to every field that adopts the paradigm afterwards.

So: add M1 and M2. Leave M3 to the moment the code exists to be true to it, then promote
the entry to an instance.

**Two things CSS teaches the paradigm itself**, which do *not* depend on `stzCSS` existing
and are the real reason to write now rather than later:

> **A frame can warrant dissolving in one layer and surfacing in another.** The document
> treats dissolve-versus-surface as a ruling about a *field* — Concurrency was dissolved.
> CSS shows it can be a ruling about a *layer*. Specificity should be **dissolved** in a
> semantic sheet that owns its own resolution, where there is only provenance; and
> **surfaced and computed** in a module that must speak CSS and live with the browser's
> arithmetic. Same frame, opposite rulings, decided by whether you own the layer.

> **One field can need all three carriers at once.** Regex is verb-carried, System
> receiver-carried, Numbers value-carried — one apiece. CSS appears to need formatting
> context by receiver, units by value, and box model by verb, in the same field. If that
> survives the build, M3's guidance widens from *pick your carrier* to **pick a carrier per
> frame**.

Draft the addition, propose it, and **do not edit that document without the author's
ruling** — it is cited by every domain that adopts the paradigm, and `stzSense` is next in
that queue.

## Do not

- **Do not build a CSS engine.** Parsing, cascade *explanation*, emission and refusal — not
  layout, not rendering, not a browser.
- **Do not build an ambient block or a stateful current-scope object.** The library
  proposed the first, wrote down why it was wrong, and deleted it; the second has never
  existed. A formatting context is *obtained*, never *entered and left*.
- **Do not absorb `stzSense`'s job.** No semantic values, no meanings, no cultural
  readings. If `stzCSS` ever grows a `:Danger`, the layering has collapsed.
- **Do not adopt a CSS parser dependency without the vendoring discipline** — the L0
  precedent (generate offline, commit output, own the refresh) and the standing preference
  for small, single-purpose vendors over large frameworks.
- **Do not treat this prompt's M1–M5 pass as settled.** It was written by someone who has
  read the paradigm and not built with it. Where it is wrong, the correction is the most
  valuable thing this session produces.

---

Commit locally, plain factual messages, push nothing without my review.

**A refusal is an acceptable outcome.** If the M1 pass concludes that CSS's frames are
mostly noise to dissolve — that the honest answer is a thin emitter plus an auditor, and
that a governed CSS *authoring* surface would only invite bypassing the semantic layer —
then say so and design the thin thing. That result would be worth more than a large module
nobody should use.
