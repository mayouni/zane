# Finding for the sound plane — an ordering attributed to a law that does not state it

**From**: StzZui, 2026-08-16, while extracting the `SIGNAL` vocabulary into
[`conformance/signal.json`](../../conformance/signal.json) for S8.
**Genre**: a citation defect. **One comment, one line.** Nothing in the plane's behaviour
is wrong, and no code needs to change.
**Status**: **verified against the tree**, not remembered — `stzEarcons.ring:54-56`, read
2026-08-16, and a full search of all 122 rules in `rules.json` v3.10.

---

## The finding

`stzEarcons.ring:54` introduces the vocabulary like this:

> `# The five, in the law's own order of severity. muted is last and silent.`

**The law states no order of severity.** Searched across all 122 rules for an ordering, a
precedence, an outranking and the string `danger > warning`: nothing. Rule 118 lists the
five as *success, warning, danger, info, muted* — and that is **a listing, not a ranking**,
in a rule whose subject is which colours exist, not which wins.

The plane's own documents carry the ordering as design, correctly:
`SOFTANZA_SOUND_PLAN.md:1740` — *"Order: `danger` > `warning` > `info` > `success`. `muted`
is silent"* — and `:2115` restates it for contention. **Those are right.** Only the code
comment attributes it upward.

## Why it is worth a finding at all

**The ordering is good and should stay.** The plane needed an answer to a question the law
had never been asked — *what happens when two values contend for one channel?* — and
invented a defensible one. That is the correct order of events: the implementer meets the
case first.

What is wrong is the direction of the citation. **A plane that says "the law says X" when
the law is silent creates a rule nobody ratified**, and the next channel to implement
`SIGNAL` will read that comment, believe the ordering is binding, and either copy it
without judging it or contradict it and think itself in violation. Colour has no natural
severity order at all — it has a perceptual lightness ladder, which is a different axis —
so this is not hypothetical.

This is the same class as the defects this project keeps finding in its own apparatus: a
hand-typed census under a heading claiming it was computed; a docket that said *"nothing
here is applied"* for two days after twelve items were applied. **The content was fine; the
provenance claim was false.**

## What to change

**One comment.** Replace *"in the law's own order of severity"* with something that says
where the ordering comes from — the plane's own design, for contention, recorded in
`SOFTANZA_SOUND_PLAN.md`. The list itself, the order, and every behaviour stay exactly as
they are.

If it helps, the accurate split is:

| what | whose | where |
|---|---|---|
| the five values and their meanings | **the law** | Rule 118, `invariant: true` |
| `muted` renders as silence | **the plane**, and it is a finding the law should learn from | `stzEarcons.ring:264` |
| `danger > warning > info > success` | **the plane** | `SOFTANZA_SOUND_PLAN.md:1740` |
| what happens when two contend | **nobody has legislated it** | — |

## What StzZui is doing about its half

`conformance/signal.json` now records the ordering under a top-level `notLaw` block, so a
consuming tool reads the vocabulary and the ordering with their provenance attached rather
than inferring that both are constitutional.

**Whether contention should become law is now an open question on StzZui's side**, and the
sound plane is the only implementer with evidence about it. If the plane has a view, it is
worth saying — the docket takes evidence from implementers, and Rule 125 entered the law
exactly that way, from this plane's own measurement.

## Honest boundaries

- **Nothing here is a defect in the plane's behaviour**, and if this reads as a complaint
  it is written badly. `stzEarcons` is the only complete implementation of the law's five
  values in any channel — the colour plane has four — and it is complete *because* it was
  written after Rule 118 and deferred to it.
- **The ordering may well deserve to be law.** This finding does not argue against it; it
  argues that it is not law *yet*, and a comment should not promote it.
- **I did not read the whole plane.** The search was for the ordering claim specifically.
  Other citations upward may exist and were not checked.
