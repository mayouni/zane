# The regex divergences — where the paradigm's flagship differs from its own document

**Run in**: `D:\GitHub\stzlib`

**Precondition**: none. Independent of the locale defects, of the culture module, and of
StzZui entirely.

**Provenance**: found by *reading* on 2026-08-13 while studying Scope-Oriented Programming
in order to apply it elsewhere — **not by running anything.** Every claim below is a report
to reproduce, not a diagnosis to act on. If one does not hold, say so; that corrects the
record and is a good outcome.

**Re-verified 2026-08-13 against the current tree**, with lines: `MatchSegmentsIn` at
`:440-441` and `MatchFirstSegmentIn` at `:447-448` are byte-identical, both passing
`[ :DotMatchesAll, :MultiLine ]`; `:NonGreedy` appears only in the option table (`:68`) and
the compile switch (`:322`) and is passed by **no scope verb at all**; `MatchOneSegment`
does not exist anywhere in the file.

**Divergence 3 is worse than reported.** It is not one verb but **two**: `MatchWordsIn`
(`:422-424`) *and* `MatchFirstWordIn` (`:431-433`) both call `SetPattern` with the anchored
`"\b" + Pattern() + "\b"`. Either one called twice yields `\b\bpat\b\b`; called in sequence
they compound. Fix both, and guard both.

---

## Why these three belong in one session

They are not three unrelated bugs. **Two of the three are the same defect**, and it sits in
the instance the paradigm is founded on.

`SCOPE_ORIENTED_PROGRAMMING.md` uses regex as its worked example — the scope table at
`:86-91` is the paradigm's clearest demonstration. Its own move **M4** says what makes SOP
a paradigm rather than a naming convention:

> *"Because the scope is explicit **and modeled**, the library does more than document it —
> it *computes* with it… **The scope is a semantic handle, not a comment.**"*

At one row of that table, the scope is currently a comment. That is worth more attention
than a normal bug, because the design document is what every other domain cites when it
adopts the paradigm — and `stzSense` is about to be the next one.

**Two of these are decisions, not repairs.** Do not assume the code is wrong; the document
may be. Say which, and why.

---

## Divergence 1 · `MatchOneSegment()` does not exist — and may not be a naming slip

**Reported**: the verb appears in `SCOPE_ORIENTED_PROGRAMMING.md:91` and in
`base/doc/deepdives/stz-regexp-confusion-solved-deepdive.md:117,141`. The code has
`MatchFirstSegment` / `MatchFirstSegmentIn` instead.

**The part that makes this more than a rename.** The deepdive's example is:

```
/<p>.*?<\/p>/   →   o.MatchOneSegment("<p>.*</p>")
```

That is about **non-greediness** — match *one* segment and stop, rather than running to
the last `</p>`. But `MatchFirstSegment` names a different act: **which occurrence** you
get, the first rather than all. *One* and *first* are not synonyms here, and a reader
reaching for the documented behaviour will find a verb that answers a different question.

So the question to answer is not "add an alias" but: **which act was intended, and does the
other one also need to exist?**

## Divergence 2 · Greedy versus lazy by verb is documented and not implemented

**Reported**: `MatchSegmentsIn` (`base/regex/stzRegex.ring:440`) and `MatchFirstSegmentIn`
(`:447`) are **byte-identical** — both pass `[ :DotMatchesAll, :MultiLine ]`. The
`:NonGreedy` option exists in the option table (`:68`, flag 16) and in the compile switch
(`:322`) and is **never passed by any scope verb**. The same duplication is reported
between `MatchWordsIn` and `MatchFirstWordIn`.

**Why this is divergence 1 wearing different clothes.** The scope table's stated payoff for
the segment row is *"greedy vs lazy by verb, not by `?`"* — that is the row's whole reason
to exist, and it is the sentence that makes regex a good example of the paradigm. If two
verbs compile to the same flags, the verb is **naming a frame the library does not act
on**, which is exactly what M4 forbids.

**Reproduce first**: run the two verbs against a string with two segments and confirm they
return the same thing. Then check whether any call path anywhere passes `:NonGreedy`.

**The decision, and it is genuinely open:**

1. **Implement it** — the lazy scope passes `:NonGreedy`, and the greedy/lazy distinction
   becomes real. The document was right and the code lagged.
2. **Retract it** — greedy/lazy by verb was a good idea that did not survive contact, and
   the scope table loses that clause. The code was right and the document over-promised.

**Whichever you choose, the other artifact must move**, and visibly. This project's
discipline is that a plan records its outcomes and evidence is never quietly rewritten —
so if the claim is retracted, retract it in the open with a dated line, rather than
deleting the sentence as though it was never made.

## Divergence 3 · `MatchWord` permanently mutates the pattern — a plain bug

**Reported**: `base/regex/stzRegex.ring:423-424`. `MatchWordsIn` builds `"\b" + pattern +
"\b"` and calls `SetPattern()` with it, so the object's pattern is rewritten. A second call
yields `\b\bpat\b\b`.

This one carries no decision. A scope verb should not leave the object changed — a frame
named at the call site must not outlive the call, which is the same principle that rules
out ambient state everywhere else in the paradigm.

**Reproduce**: call `MatchWord` twice on one object and inspect `Pattern()` between calls.

**Fix**: build the anchored pattern for the duration of the match without persisting it.
Guard that the pattern is unchanged after a scope verb returns — and guard the same for
every other scope verb, since this class of defect rarely occurs alone.

---

## Do not

- **Do not redesign the regex surface.** These are three specific divergences. The match
  types and options are closed sets with load-bearing order (`:56-60` notes the index *is*
  the engine's type code) — leave them alone.
- **Do not fix a divergence by editing the design document into agreement** without saying
  that is what you did. `SCOPE_ORIENTED_PROGRAMMING.md` is cited by every other domain that
  adopts the paradigm; a silent edit there propagates further than a code change.
- **Do not fix silently.** Each of these was invisible because nothing failed. Every repair
  or retraction gets a guard or a dated line.

---

Commit locally, one commit per divergence so each can be reverted alone, plain factual
messages, push nothing without my review.

**If divergence 2 is retracted rather than implemented**, that is a finding worth carrying
back: the paradigm's clearest published example would lose its sharpest illustration, and
the document should say so plainly rather than quietly reading as though it never claimed
it. A paradigm that records where it fell short is more trustworthy than one that reads as
though it never did.
