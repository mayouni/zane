# Three layer-one defects — for the quality session

**Run in**: `D:\GitHub\stzlib`

**Precondition**: none. Independent of the culture module, of StzZui, and of each other.
Any one can be done alone.

**Provenance**: found by *reading* the tree on 2026-08-13 during a survey for a proposed
culture module — **not by running anything.** Treat every claim below as a report to
reproduce, not a diagnosis to act on. If one of them does not reproduce, say so; that is a
useful outcome and it corrects the record.

**Re-verified 2026-08-13, after later commits to this tree.** All three still stand, with
exact locations confirmed: the bidi constants against the vendored `utf8proc.h`, the dead
variable at `stzNumber.ring:7642 / 7649 / 7731` against its assignment at `7400 / 7489`,
and the wrong expectation at
`base/test/datetime/76_example_15_counting_from_islamic_calendar.ring:14,18`. Defect 1 is
**worse than first reported** — see below. Reproduce anyway; the point of the rule is not
that I checked.

**Why these three together**: they all sit in layer one (locale, number, calendar), they
are all small, and each is the kind of defect that stays invisible until something builds
on top of it. Nothing here belongs to the locale plan's unstarted L2–L4 — these are things
that are *wrong*, not things that are *missing*.

---

## Defect 1 · Hebrew is classified `Neutral` instead of RTL

**Where**: `engine/src/string/locale.zig`, around lines 110–114.

**Cause — confirmed 2026-08-13 against the vendored header, not inferred.**
`engine/vendor/utf8proc/utf8proc.h:356-369` gives the real numbering:

```
L = 1   LRE = 2   LRO = 3   R = 4   AL = 5   RLE = 6   RLO = 7
EN = 9  AN = 12   CS = 13   NSM = 14
```

The classifier matches `1, 14 => has_ltr` and `5, 6, 13 => has_rtl`. So:

- **R = 4 is never matched.** Hebrew letters carry class R, so **Hebrew is missed entirely**.
- Arabic passes only by accident, through AL = 5 — which is exactly why this survived:
  **the language most likely to be tested is not the one that breaks.**
- `6` is RLE, an embedding *control*, counted as strong RTL. `13` is CS and `14` is NSM,
  counted as RTL and LTR respectively. Three further misclassifications.

**And the in-code comment is part of the defect.** Line 110 asserts
`1=L, 2=LRE, 3=LRO, 5=R, 6=AL, 7=RLE, 8=RLO, 13=AN, 14=EN` — a numbering that **skips 4**,
which is what made it look plausible. Fix the comment with the code, or the next reader
re-derives the same wrong constants from it.

**The part that makes it worth doing now**: the Ring layer's `stzString.IsRightToLeft()`
reportedly uses the correct numbering and gets Hebrew right. So **the two layers disagree
about the same string**, and any caller's answer depends on which one it happened to ask.

**Reproduce first**: ask both layers for the direction of a Hebrew string, an Arabic
string, a Latin string, and a string starting with a combining mark. Record what each
returns before changing anything.

**Fix**: correct the constants against utf8proc's actual bidi-class numbering — read the
header, do not infer the values. **Guard it in both layers with the same fixtures**, so
the next divergence fails a test instead of shipping.

---

## Defect 2 · `:FractionalSeparator` is a dead option

**Where**: `base/number/stzNumber.ring`, `ApplyFormatXT`, around lines 7622 and 7629.

**Reported cause**: the option is read into one variable (`_cFractionalSeparator_`) and a
*different*, never-assigned variable (`cFractionalSep`) is emitted. So passing the option
changes nothing. Lines reported around 7667–7718 are unreachable, sitting after a `return`.

**Reproduce first**: call `ApplyFormatXT` with an explicit `:FractionalSeparator` and
confirm the output ignores it.

**Fix**: make the option live, delete the unreachable block, and guard both — one guard
that the option is honoured, one that the previously-unreachable path is either reachable
or genuinely gone. **Do not** take this as licence to wire `stzNumber` to `stzLocale`;
that is L2's work and it is a design decision, not a repair.

---

## Defect 3 · A guard asserts a wrong answer

**Where**: `base/test/datetime/76_example_15_counting_from_islamic_calendar.ring`.

**Reported symptom**: it records **1400 AH → 2021-08-13**. 1400 AH began in late 1979 CE.

**The arithmetic explains it exactly**, which is why this is worth stating rather than
just patching. A Hijri year averages ≈354.37 days, so 1400 of them is ≈1358 Julian years,
giving 622 + 1358 ≈ **1980**. Using 365-day years gives 1400 × 365 ≈ 1399 years, and
622 + 1399 = **2021** — the number in the file. So the defect is not a typo in an expected
value; **it is a 365-day year applied to a lunar calendar**, and the recorded answer is
the faithful output of wrong arithmetic.

**The judgement call, and please make it deliberately.** The tempting fix is to change the
expected value. **Resist it**, because there is no single correct answer available here:
Hijri↔Gregorian conversion depends on which variant is meant — a tabular civil calendar,
or an observation-based one such as Umm al-Qura, which differ by a day or more — and
`stzCalendar` is a business planner, not a calendar system. The library has **no
non-Gregorian calendar**, so it cannot currently produce a defensible answer to name.

Three honest options, in the order I would rank them:

1. **Quarantine the guard** and file the calendar gap against the locale plan. The test
   stops asserting a falsehood; the missing capability becomes visible.
2. **Restrict it** to a clearly labelled *tabular civil* Hijri conversion, with the variant
   named in the file and the epoch stated, so the answer is defensible even if incomplete.
3. Delete it.

**What must not happen is a differently-wrong guard.** A test asserting a falsehood is
worse than no test, because it converts an open question into a settled one — and this one
sits exactly where culture and calendar meet, which is the area a culture module would
build on next.

---

## Do not

- **Do not fix by changing expected values** until you understand why the old value was
  produced. Defect 3 is the case in point.
- **Do not scope-creep into L2–L4.** Locale-aware number formatting, collation, digit
  shaping and calendar systems are the locale plan's unstarted phases. These three are
  repairs to what exists.
- **Do not fix silently.** Each of these was invisible because nothing failed. Every repair
  gets a guard, or the next reader has no more protection than this one did.

---

Commit locally, one commit per defect so each can be reverted alone, plain factual
messages, push nothing without my review. If a defect does not reproduce, report that
rather than working around it — the survey that found these read the code and did not run
it, and being wrong about one of them is entirely possible.
