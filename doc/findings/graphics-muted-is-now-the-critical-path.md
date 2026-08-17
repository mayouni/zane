# Finding for the graphics plane — `:Muted` stopped being tidiness

**From**: StzZui, 2026-08-17, after building the cross-medium instrument (S13b).
**Escalates**: [`graphics-semantic-colour.md`](graphics-semantic-colour.md) §1, filed
2026-08-13. **Nothing in that finding was wrong.** What changed is what it costs.
**Route**: via Softanza Central. StzZui does not write in another repository.
**Status**: **verified by a run**, not by reading — `node tools/zui/cross-medium.js`.

---

## What changed

On 2026-08-13 this plane was told it implements four of the law's five semantic values.
That read as a tidiness item, and it was reasonable to treat it as one: nothing was
broken, no test was red, and `:Neutral` and `:Primary` were both already spoken for.

**On 2026-08-17 an instrument started depending on it.**

`tools/zui/cross-medium.js` is the keystone of the Second Founding — the test that
converts *"one declaration, many renderings, one law"* from a good sentence into
something that can fail. It takes one medium-free declaration, projects it into two media,
and asserts that **every difference between the two renderings is one the published data
already predicted**.

It runs. It finds **zero drift**. Five intents cross both pairs intact, including
`visual` against `print` — the hardest honest case, in the enumeration precisely because
print has no time and no interaction. **The model held on first contact.**

**And the run does not pass.** Every failure is the same one:

```
invoice-review.zui — visual vs auditory
  UNDECIDED — nothing is contradicted; the data is silent, so this pair is not proved:
    signal danger: signal.json records no rendering for visual
    signal muted:  signal.json records no rendering for visual
    signal warning: signal.json records no rendering for visual
```

`conformance/signal.json` records what each channel renders for each of the five values.
It records the auditory channel and the voice channel. **It records nothing for visual**,
because a channel that implements four of five cannot honestly be written down as
rendering the five.

So the position today is exact, and worth stating plainly:

> **The one missing colour is the only thing standing between this project and proving
> its central claim** — and it blocks precisely the pair where both channels actually
> shipped, which is the only pair where a divergence could be checked against running code
> instead of against a table.

## The second half, and this one is a disagreement

While building the absence table, StzZui read the sound plane's position on `:Muted` and
**rejects half of it**. Recording it here because it is an argument *for* leaving the
colour plane alone, and the graphics session should see it before deciding.

The voice plan states (`SOFTANZA_VOICE_PLAN.md:1163-1168`):

> *"`:Muted` renders in neither. That is coherent rather than broken: muted means waiting
> is not an event, and its rendering is ABSENCE everywhere — silence in sound, nothing
> painted, nothing said. A colour face that answered `:Muted` with a paintable colour
> would be the bug."*

**StzZui accepts this for sound and voice, and rejects it for the visual channel.**

- **Rule 118 is titled *Two Families of Colour***, and family one is five values
  *including* `muted`. The law says a muted colour exists.
- **In practice it is the greyed row of a queue** — which is how an operator tells waiting
  work from active work at a glance. A screen painting nothing for `muted` renders waiting
  rows identically to active ones, which is Rule 82 with the operator unable to perceive
  what the system knows.
- **Silence is right for sound** for a real reason the sound plane discovered by building
  it: an earcon announcing inactivity is a contradiction. That reason does not survive
  transport to a channel with persistence, parallel access and no time.

**And the evidence offered for the wider claim does not say what it is read as saying.**
The plan cites `StzColorToNumber(:Muted)` refusing *"by name"* as proof the absence is
deliberate. Read 2026-08-16 at `stzColor.ring:26-63`: that function hands any non-hex token
to `StzTryResolveColor` and raises a generic *"'…' is not a colour"* for anything
unresolved — **the same path that refuses a typo**. `:Muted` is refused because the
resolver does not know the name, exactly as `:Blorp` would be. **That is evidence the
channel lacks the value, not that it declines it.**

## What to change

Two things, and the second is the one the instrument needs.

**1 · Add `:Muted` to the seven roles.** Every theme in `$aPalette`
(`stzDiagramColor.ring:78`) enumerates `primary · success · warning · danger · info ·
neutral · background`. `muted` joins as an eighth, distinct from `neutral`: **neutral is
family two** (metadata carrying no urgency), **muted is family one** (a *state* — waiting,
inactive). They are not the same concept and the law separated them at v3.11.

> **CORRECTION, 2026-08-17, same day this finding was filed and routed.** The paragraph
> below originally said *"seven theme palettes… contrast pairs from 42 to 49"*. **That was
> wrong**, and it is the second wrong estimate StzZui has published about this one change
> — the first was *"about an hour"*. Measured this time instead of remembered:
> `$aPalette` at `stzDiagramColor.ring:78` holds **ten** themes, each enumerating **seven**
> roles, so the grid is **70 cells and an eighth role makes it 80**. The number 42 belongs
> to something else — Rule 62's lint note records `StzIsLegible` passing 42 theme/role
> pairs, a different and smaller set — and StzZui conflated the guard's count with the
> palette's. **If this finding is read for its sizing, read this paragraph and not the
> original.** The graphics session's own count beats both.

`$aPalette` holds **ten** themes, each enumerating seven roles, so adding an eighth role
takes the grid from **70 cells to 80**, each needing 4.5:1 in every theme (Rule 62, bound
to `StzIsLegible`). StzZui's first estimate of *"about an hour"* is withdrawn.
**A careful half-session**, and that figure is now the only one in this document that has
not been measured — treat it as the loosest claim here.

**2 · Say what the visual channel renders for each of the five.** This is the part the
keystone is waiting on, and it is smaller than the first: a statement, per value, of
whether the channel renders it perceptibly or as absence. StzZui will copy it into
`conformance/signal.json` as `renderings.visual.rendersAsAbsence`, exactly as the auditory
and voice entries were written from the sound plane's own shipped behaviour.

**Expected answer, stated so it can be contradicted**: `[]` — the visual channel renders
all five perceptibly, because a colour is available for each and none of them is silence.
If that is wrong, the wrongness is the finding and StzZui wants it.

## What StzZui is not asking for

- **No change to any computed colour.** This adds a role; it does not retune a hue.
- **No adoption of StzZui's reading of the sound plane's claim.** The disagreement is
  recorded so the graphics session can weigh it, not to settle it over that plane's head.
- **No urgency.** The keystone reporting *not proved* is the correct outcome and is
  committed as such. It is better for the instrument to say what is missing than for it to
  pass by not looking.

## Honest boundaries

- **The instrument has met two media pairs**, and one of the four channels involved has no
  implementation at all (print). `visual vs print` passes its intent comparison against a
  table, not against a printed page.
- **StzZui has not read the graphics plane's tests.** The half-session estimate comes from
  counting palettes and contrast pairs, and the graphics session's own number beats it.
- **The `rendersAsAbsence` model may be too coarse.** It is a binary — rendered or
  absent — and a channel might render a value *weakly* rather than not at all. Nothing has
  needed the third state yet, so it has not been invented.
- **This finding was written by the session that benefits from it.** The keystone is
  StzZui's instrument, and "your missing value blocks my test" is exactly the shape of
  argument that should be read sceptically. The measurements are reproducible: run
  `node tools/zui/cross-medium.js --verbose` in stzzui.
