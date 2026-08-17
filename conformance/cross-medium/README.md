# The cross-medium suite — one declaration, two renderings, one law

**S13b, the keystone.** Every other instrument in this repository proves something about
**one** artifact: the verifier proves a file's verdict, the envelope proves a diagnostic's
shape, `media.json` records what a medium carries. **Nothing proved the sentence the whole
Second Founding rests on.**

```bash
node tools/zui/cross-medium.js            # 0 proved · 1 not proved
node tools/zui/cross-medium.js --verbose  # every difference, with its reason
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

## What it says today, and it is not a pass

```
invoice-review.zui — visual vs print       3 undecided · 0 drift
invoice-review.zui — visual vs auditory    4 predicted · 3 undecided · 0 drift
```

**No drift anywhere. Five intents cross both pairs intact**, including the pair with print,
which was put in the enumeration precisely because it is the hardest honest case — no time,
no interaction. The four predicted differences are the auditory degradations of `SCAN`,
`LOCATE`, `COMPARE` and `READ`, each one already written in the matrix.

**And the claim is still not proved, for one reason.** Every `undecided` is the same
finding: **`signal.json` records no rendering for the visual channel.** It records none
because the visual channel implements four of the law's five semantic values —
[the missing `:Muted`](../../doc/findings/graphics-semantic-colour.md), filed 2026-08-13.

That reframes a finding that read as tidiness. **The missing value is not an untidy engine;
it is the single thing standing between this project and proving its central claim** — and
the pair it blocks is `visual vs auditory`, the only pair where both channels actually
shipped, and therefore the only one where a divergence could be checked against running
code rather than against a table.

## Adding a case

Put a **medium-free** `.zui` in this folder — declarations only, no `VIBE`, because the
projection appends one and that is the claim under test — and add an entry to `spec.json`
naming the file and two media. The declaration is never edited by the comparison.
