# The cross-medium suite — one declaration, two renderings, one law

**S13b, the keystone.** Every other instrument in this repository proves something about
**one** artifact: the verifier proves a file's verdict, the envelope proves a diagnostic's
shape, `media.json` records what a medium carries. **Nothing proved the sentence the whole
Second Founding rests on.**

```bash
node tools/zane/cross-medium.js            # 0 proved · 1 not proved
node tools/zane/cross-medium.js --verbose  # every difference, with its reason
```

## What it asserts, and what it deliberately does not

**It does not assert that the two renderings match.** They are irreducibly different —
print has no time, sound is serial and transient — and a test demanding sameness would
promise portability the model cannot deliver. It asserts something narrower and provable:

> **Every difference between the two renderings is one the published data already
> predicted.**

A difference `media.json` or `signal.json` accounts for is the model working. A difference
neither accounts for is drift. **That is the whole instrument**, and it is the reason both
matrices had to be data before this could exist.

## Three verdicts, and the distinction is the honesty

| verdict | meaning | run |
|---|---|---|
| **predicted** | the data accounts for this difference | passes |
| **undecided** | the data is *silent* about one side — nothing contradicted, nothing proved | **does not pass** |
| **drift** | the data is *contradicted*: one declaration judged two ways, unexplained | **fails** |

Collapsing `undecided` into `drift` would cry wolf. Collapsing it into `predicted` would
claim a proof nobody performed. **Neither passes**, and the exit code says which it is.

**Silence is tested before equality.** Two silences compare equal and would otherwise
vanish from the report — an agreement nobody verified, presented as an agreement proved.
That bug was in the first draft of this runner and is the precise failure the instrument
exists to make impossible.

## What it says today — the shipped pair is proved

```
invoice-review.zane — visual vs print       3 undecided · 0 drift
invoice-review.zane — visual vs auditory    5 predicted · 0 undecided · 0 drift
```

*(2026-08-17 to 2026-08-22 this read `4 predicted · 3 undecided` on the second
line, and the paragraphs below explain why. The change is one datum, not one
line of code: `signal.json` learned what the visual channel renders.)*

**No drift anywhere. Five intents cross both pairs intact**, including the pair with print,
which was put in the enumeration precisely because it is the hardest honest case — no time,
no interaction. The four predicted differences are the auditory degradations of `SCAN`,
`LOCATE`, `COMPARE` and `READ`, each one already written in the matrix.

**And on `visual vs auditory` the claim is now PROVED** — *2026-08-23*. Every difference
between the two renderings is one the published data already predicted, including the one
that matters most: `muted` renders as a filled colour on screen and as **silence** in
sound, and `signal.json` predicted both. **The same declaration, two channels that
disagree about what the value looks like, and no drift.** That is the sentence the whole
design rests on, tested on the only pair where both channels have running code.

**What unblocked it was not this repository.** Every `undecided` on that line was the same
finding — `signal.json` recorded no rendering for the visual channel, because that channel
implemented four of the law's five values ([the missing `:Muted`](../../doc/findings/graphics-semantic-colour.md),
filed 2026-08-13). The graphics plane shipped `:Muted` on 2026-08-22 and answered
`rendersAsAbsence = []`; the datum was written here on 2026-08-23 and the pair went green
with no change to the runner. **A finding that read as tidiness turned out to be the
critical path, and it stayed the critical path for nine days.**

**The remaining three `undecided` are `visual vs print`, and no datum closes them.**
`signal.json` records a channel's renderings only where a renderer has shipped — a medium
with no instrument is *undecided*, never *perceptible*, because nobody can say what an
unbuilt channel renders. Print has no instrument. So this suite exits `1` until print gets
one, and that is the instrument reporting honestly rather than a gap somebody forgot to
fill. **Do not close it by writing data.**

## Adding a case

Put a **medium-free** `.zane` in this folder — declarations only, no `VIBE`, because the
projection appends one and that is the claim under test — and add an entry to `spec.json`
naming the file and two media. The declaration is never edited by the comparison.
