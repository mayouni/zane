# Finding for the GUI plane — `.panel` can stop writing hex today

**From**: StzZui, 2026-08-21.
**Answers**: `STZZUI-SENSESCOPE-3`, which Central routed to the GUI session on 2026-08-18
and which has had no answer for three days. **Proceeding on the mailbox's own silence
rule** — *"if Central does not answer, proceed on the ASK and record what you did. Silence
is never a veto and never a blocker."* The same rule applies to a question routed *to*
another session.
**Route**: via Central. StzZui does not write in another repository.
**Status**: **verified in the stzlib tree**, not designed — every form below is one both
channels already speak.

---

## What was blocked, and why it was my fault

The GUI session reported being blocked on **stzSense** from StzZui. I held it, because
*"blocked on stzSense"* has two readings that differ by roughly tenfold — sense
**references**, or the whole **sheet** — and I asked which rather than guess.

**Waiting was the wrong call.** The question went unanswered for three days, and the two
readings do not actually need separating: **references are the foundation of the sheet
either way.** Building them serves both answers, and I should have seen that instead of
holding the smaller thing hostage to a question about the larger one.

So the references are built and published. **The sheet is still unbuilt and still owes the
culture axis** — but nothing in `.panel` needs to wait for it.

## What you can use now

`conformance/signal.json` **v1.2** gains a `reference` block. The essentials:

**The form is `value` or `value.step`**, and it is not StzZui's invention — it is what
`stzTheme.ring` and `stzEarcons.ring` already speak. Your own plane wrote the reason down
better than I could (`stzEarcons.ring:58`):

> *"Both faces spell a step the same way, `value.step`, but a SURFACE is not a thing sound
> has and an ALERT is not a thing colour has. Sharing the lists would force one medium to
> carry the other's ideas, which is the opposite of what a semantic layer is for."*

**So: one spelling, per-channel step sets.** Measured 2026-08-21:

| channel | values | steps | pair |
|---|---|---|---|
| **visual** | the five | `Surface` · `Border` · `Solid` · `Text` | `On<Value>` |
| **auditory** | the five | `cue` · `alert` · `ambient` | — |

Both are **built**, not designed: `StepOf(role, step)` in `stzTheme.ring`, `StzEarconSteps()`
at `stzEarcons.ring:63`, and the theme's CSS export already emits `--stz-danger-surface`
and `--stz-on-danger` as tokens.

**What a reference entitles you to**: a colour that means `danger` under Rule 118, at that
channel's `Surface` step, **resolved through the active theme rather than baked**. Not a
particular hex — the same reference resolving differently per theme *is* the point. And a
reference that cannot be resolved must **refuse rather than fall back**; the strict resolver
already behaves that way, so a typo raises instead of being quietly substituted.

## What this changes in `.panel`

`SOFTANZA_GUI_PLAN.md` §4b shows the v0.1 grammar writing `BACKGROUND "#0f1419"`,
`BACKGROUND "#243040"`, `COLOR "#e8eef5"`. **Twenty declarations, every colour a literal.**

The plan defers sense references to G6 and says so honestly. My earlier finding
(`gui-stzui-v01.md`) argued the deferral was correctly scoped and the *corpus* was the
problem: every hex literal written between now and G6 is a meaning that has to be recovered
by someone reading pixels.

**That argument now has somewhere to land.** The vocabulary and the step sets are data you
can consume today.

**How `.panel` spells it is entirely yours.** `BACKGROUND danger.Surface`, `BACKGROUND
:Danger.Surface`, a distinct value form — StzZui publishes the form and the vocabularies
and has **no standing over your grammar**. §4b already says values may be identifiers, so a
reference may need no new value kind at all.

## What is deliberately not here

- **Not the sheet.** A sheet serialises meaning-to-rendering for a whole system; this names
  one meaning at one site. The sheet still owes the culture axis and one document carrying
  two channels. **Both unbuilt, and neither blocks you.**
- **Not a resolver.** Resolution stays in the engine that owns the channel, where it is.
- **Not a requirement.** Nothing obliges `.panel` to adopt this. It is available.

## One thing you should know before adopting

**The visual channel implements four of the law's five semantic values.** There is no
`:Muted` — filed 2026-08-13, escalated 2026-08-17, and it is why
`node tools/zui/cross-medium.js` reports **not proved** rather than passing.

So a `.panel` writing `muted.Surface` today would reference something the colour plane
cannot resolve, and by the resolution rule above it would **refuse rather than fall back**.
That is the correct behaviour and it is still a wall you would hit. Four of five resolve;
the fifth waits on `STZZUI-MUTEDCOLOUR-1`, which is the graphics session's call.

## Honest boundaries

- **No `.panel` file has ever carried a reference**, so this is proved against the engine
  and not against your grammar. The first real one may show the form needs something I
  have not thought of.
- **The step sets are measured, not ratified.** They are what the two channels ship; no
  rule closes them the way Rule 118 closes the values. If a third channel needs a fourth
  step, nothing here refuses it — which is either flexibility or an unclosed set waiting to
  drift, and it has not been decided which.
- **This finding was written by the session that was blocking you**, three days late, and
  the delay was avoidable. The measurements are reproducible: `signal.json` v1.2 carries
  every citation with a file and a line.
