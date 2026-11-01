# The coverage grid

**What this is.** A map of what the law covers, drawn from what a person does with an interface
and not from the issues found so far. It places the 122 rules of `constitution/rules.json` (v3.11)
and the 57 fixtures of `conformance/manifest.json` on that map, counts the cells that have a rule and
the cells that have none, and defines the record a discovered issue is filed as, so that it lands on
a cell.

**What this is not.** It proposes no rule. Where a cell has none, that is recorded as a gap, and any
rule that might fill it is held for the Principal. It changes no rule, no diagnostic, no fixture and
no verifier. Asked for by Central on 2026-11-01 (the Principal's delegation); question Q4 of the plan.

**Reproduce every number here:** `node doc/design/coverage-count.js` (add `--cells` for the lists).
The counts below are that script's output over `doc/design/coverage-placement.json`, which is the one
file that holds judgement. It exits 1 if the table and the law disagree about which rules exist.

---

## 1. The axes

### Rows: what a person does

Six activities. Each is a question the person is asking, in order of a person's encounter with an
interface, and none of them is the name of a defect.

| activity | the question | the intent verbs it owns |
|---|---|---|
| **perceive** | Is there something, and what state is it in? | none |
| **understand** | What is this, where am I, what does it say? | DISCOVER UNDERSTAND LOCATE READ SCAN SCROLL ZOOM COMPARE |
| **decide** | What can I choose, and can I narrow it? | FOCUS FILTER SELECT HIGHLIGHT PREVIEW MARK |
| **act** | Can I do the thing, and know that it was done? | ACT CONFIRM |
| **recover** | Can I go back, stop, try again, leave? | CANCEL UNDO PAUSE RESUME RETRY EXIT |
| **trust** | Can I rely on who or what is acting, and on what it tells me? | none |

The 22 verbs of the intent grammar are shared out once each (8 + 6 + 2 + 6 = 22), so the rows are
not invented beside the language: they are the language's own verbs, grouped by what the person is
doing when they use them.

**Perceive and trust own no verb on purpose.** A state is sensed before any verb is used, and trust
is a property of every verb, not a verb. This is also the only way the map stays true of a lamp: a
lamp has no READ (`media.json` marks every information verb absent from it), and yet its state is
perceived across a room. Giving perceive the verb READ would have called a lit lamp unperceivable.

### Columns: across media

The ten media of `conformance/media.json`, the closed enumeration the language already uses
(`visual auditory voice haptic print luminous signage machine spatial terminal`), plus one more
column, **any**: the law stated without a medium, before it is projected into one. A rule that names no
medium and has no screen wording sits there.

### Closed cells

A cell is **closed** when its activity owns verbs and the medium marks every one of them absent. No
rule can sit on a closed cell and none is meant to; the person cannot do that activity there at all.
Eleven of the 60 medium cells are closed, derived from `media.json` the way `zui.js` derives
`NOT_CARRIED`:

`understand × haptic` · `decide × haptic` · `decide × print` · `decide × luminous` · `decide × signage` ·
`act × print` · `act × luminous` · `act × signage` · `recover × print` · `recover × luminous` · `recover × signage`

That leaves 49 open medium cells and 6 open cells in the `any` column: 55 live cells of 66.

---

## 2. How things were placed

**A rule** has a set of activities, read from its title and its stated reason (`why`). It then has a
medium scope, decided in this order:

1. **named**: a rule whose own words or realisation name a medium sits on that medium. Seven do
   (60 and 104 on voice and machine, 72, 77 and 123 on print, 73 on auditory, 125 on auditory and
   voice). Rules 60, 72, 73, 77, 104 and 123 are also written for the screen, so they sit on visual too.
2. **medium-free**: a rule with a diagnostic whose check does not look at the medium (all bound
   diagnostics except `LAYOUT_DISPLACEMENT`), or with no screen wording in its title, `avoid` or
   `solution`, sits on `any`.
3. **visual**: every other rule, by its screen wording (colour, click, scroll, button, label, table
   and the like).

The screen-word test missed eight rules whose wording is visual without using its words (black on
white, red, blur, a slider, a diagram, an agenda, a face, a form): 5, 29, 39, 41, 49, 58, 74, 75. They were
set to visual by hand and are listed in `coverage-placement.json`. **Two rules are off the grid**, with
their reasons in that file: 78 (a checklist applied to the other rules) and 124 (what a generator ships).

**A fixture** reaches the rules its diagnostics cite (`violations.json`), and a lawful twin reaches
the rules of the fixture it is the twin of. Its medium is the one it declares with `SURFACE_AS`; a
fixture that declares none sits on `any`. A fixture lands on every activity of those rules.

---

## 3. The result

Each cell reads **rules written for it / fixtures on it**. `x` closed, `.` nothing.

| | any | visual | auditory | voice | haptic | print | luminous | signage | machine | spatial | terminal |
|---|---|---|---|---|---|---|---|---|---|---|---|
| perceive | 5/8 | 36/0 | 2/2 | 3/0 | . | 1/2 | . | . | 2/0 | . | . |
| understand | 9/7 | 48/0 | . | 2/0 | x | 2/0 | . | . | 2/0 | . | . |
| decide | 8/11 | 9/0 | . | . | x | x | x | x | . | . | . |
| act | 2/7 | 12/0 | 1/0 | 1/0 | . | x | x | x | . | . | . |
| recover | 5/10 | 9/0 | . | . | . | x | x | x | . | . | . |
| trust | 9/11 | 12/0 | 0/2 | . | . | 0/2 | . | . | . | . | . |

A rule sits on several cells, so a column does not add up to a number of rules.

### The three counts

| | |
|---|---|
| **cells with at least one rule** | **21 of 55 live cells**: all 6 in `any`, and 15 of the 49 open medium cells |
| **cells with none** (the honest gap) | **34 of 55 live cells**, all of them medium cells: every cell of haptic, luminous, signage, spatial and terminal, and most of auditory, voice, print and machine |
| **rules on no cell** (what the grid cannot see) | **2 of 122**: Rule 78 and Rule 124 |

Closed cells (11) are not counted as gaps. Closed cells holding a rule: 0.

### What the counts say

- **The law is written for a screen.** 94 of 120 placed rules are written for the visual column
  and 88 of them for nothing else. 25 are medium-free. Seven name another medium, and one of those (125)
  names no screen at all.
- **Five of the ten media have no rule written for them**: haptic, luminous, signage, spatial and
  terminal. A rule reaches them only if it is medium-free, which is a claim that the rule *can* be
  projected there and not a statement that anyone has done it. The 25 medium-free rules would reach
  every one of the 34 empty cells, so this report does not count that reach as coverage: if it did, the
  honest gap would read 0, and nobody checked the projection once.
- **Fixtures test the law medium-free.** 28 of 57 land on a cell, and only 4 (the two print and the two
  auditory fixtures) land on a medium column. **Not one fixture declares the visual medium**, so
  the 6 visual cells that hold 94 rules hold no fixture. 13 of the 15 medium cells with a rule have no
  fixture; 2 medium cells (trust on auditory and on print) have fixtures and no rule written for them,
  which is Rule 82 running there medium-free.
- **29 fixtures land on no cell.** 5 declare no rule (the clean and exemption fixtures). 24 test a
  diagnostic that cites no rule in `violations.json`. That is mostly right, not a defect. Of the 21
  diagnostics that cite no rule, 14 enforce the grammar, 4 check declarations against each other, and
  where the law has no rule to cite, a citation would claim one that does not exist; `ROLE_UNDECLARED`
  cites nothing on purpose; and 2 (`EXPRESSION_ORPHAN`, `VIBE_STRIPS_RIGHT`) cite an article only. Three
  (those two and `INTENT_ORPHAN`) are worth a ruling on whether a rule backs them, and that is a ruling
  on the law, which this grid cannot settle.

### What this grid cannot tell you

- **The placement is one reader's first cut.** The activities of each rule were read from its title and
  stated reason, and the media scope from its wording. Another reader would move some rules. The counts
  move with them, so they are a measurement of this placement, not of the law.
- **Nobody perceived any of it.** The grid is a document about perception, and no person has heard,
  felt or looked at a medium to check a cell. `CENTRAL-PERCEPTGATE-01` calls that a state, not a failure:
  this phase is reported as designed, not as verified by a person.
- **The verb map is a judgement.** COMPARE sits under understand and HIGHLIGHT under decide. Moving a
  verb between rows changes which cells are closed; moving one between perceive and trust cannot, as they own none.
- **A rule on a cell does not mean the cell is covered.** 80 of 122 rules are `judgment`. A rule that only
  a person can apply is a rule that has been written, and it says nothing about whether anything checks it.

---

## 4. The record for a discovered issue

An issue is filed so that it lands on a cell. It is never filed as a new rule.

```yaml
id:        COV-<year>-<number>        # stable, never reused
cell:      <activity> x <medium>      # one of the 66 cells, or
                                      #   extends: <the row or column that is missing>
                                      #   outside: <why no person-activity with an interface is involved>
evidence:
  kind:    perceived | measured | reproduced
  status:  verified | reported | unverified     # the vocabulary of doc/EVIDENCE-LEDGER.md
  by:      <who, by name when a person perceived it>
  said:    <what they saw, heard, felt, or the number the counter gave>
  artefact: <a path a reader can open without rebuilding the world>
status:    reported | placed | confirmed | gap | extends | outside | closed
rules:     [<rule numbers on that cell the issue touches>]    # empty when the cell has none
```

**The three landings.** Placing an issue means choosing one. The first has two outcomes, because a cell can
be confirmed with a rule behind it or with none:

| landing | what is true | `status` | what it does to the grid |
|---|---|---|---|
| **confirms the cell** | The issue is a real case of something a person does on a live cell. Either the cell holds a rule that already forbids it | `confirmed`, with `rules` | Nothing moves. If a counter should have seen it and did not, that is a finding about enforcement, filed separately |
| | or the cell holds no rule | `gap` | The cell stays in the count of cells with none, now with an issue against it. A rule for it is **held for the Principal**; the record carries no rule text |
| **extends the grid** | No row fits the issue, no column does, or a person does something on a cell `media.json` closes | `extends` | A new axis value is proposed to the author. Closing or opening a cell is a change to `media.json`, which is the Principal's |
| **falls outside** | No person is doing anything with an interface (a maker-side concern, like Rules 78 and 124) | `outside` | Added to the list of what the grid cannot see, with the reason |

`reported` is the state before placing and `placed` is a cell chosen and not yet judged. `closed`
means the issue no longer reproduces, and says by what. Only the Principal moves `extends` to
accepted and a gap to a rule; nobody else is asked to.

**Evidence follows the perception gate.** `perceived` carries a name and a verdict. A `measured` or
`reproduced` issue about something a person would perceive is still `unverified` until a person has.

*Illustration, not a filed issue:* a record for "the save confirmation is a chime and nothing else"
would carry `cell: act x auditory`, hold Rule 125 in `rules`, and land as `confirmed` or as `gap`
according to whether Rule 125's text already forbids it. That is the placing the record exists to force.

**Not decided here.** Where records are kept (one file, one directory, the evidence ledger) and who
files them. The grid is the only thing this document fixes.

---

## 5. What waits on this

Q5 (other pillars), Q6 (a usability toolset), Q7 (intelligence) and Q8 (an audit of foreign apps)
depend on the answer to "what does a pillar or an audit cover", and this grid is the thing they would
be placed on. None of them is started here.
