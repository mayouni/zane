# The coverage grid

**What this is.** A map of what the law covers, drawn from what a person does with an interface
and not from the issues found so far. It was drawn on the 122 rules of `constitution/rules.json` at v3.11 and is kept current at v3.12 (123 rules, after D6)
and the fixtures of `conformance/manifest.json` (57 when the grid was drawn, 71 after the projection fixtures of D5) on that map, counts the cells that have a rule and
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

Each cell reads **rules written for it / fixtures on it**. The figures are those after D5 and PG-2 (73 fixtures) and D6 (123 rules); section 3b gives what D5 moved and section 3c what D6 moved. `x` closed, `.` nothing.

| | any | visual | auditory | voice | haptic | print | luminous | signage | machine | spatial | terminal |
|---|---|---|---|---|---|---|---|---|---|---|---|
| perceive | 5/8 | 36/2 | 2/2 | 3/0 | . | 1/6 | . | . | 2/0 | . | . |
| understand | 10/8 | 48/2 | . | 2/0 | x | 2/2 | . | . | 2/0 | . | . |
| decide | 9/12 | 9/3 | . | 0/2 | x | x | x | x | . | . | . |
| act | 2/7 | 12/3 | 1/0 | 1/2 | . | x | x | x | . | . | . |
| recover | 5/10 | 9/1 | 0/2 | . | . | x | x | x | 0/2 | . | . |
| trust | 9/11 | 12/4 | 0/2 | 0/2 | . | 0/4 | . | . | . | . | . |

A rule sits on several cells, so a column does not add up to a number of rules.

### The three counts

| | |
|---|---|
| **cells with at least one rule** | **21 of 55 live cells**: all 6 in `any`, and 15 of the 49 open medium cells |
| **cells with none** (the honest gap) | **34 of 55 live cells**, all of them medium cells: every cell of haptic, luminous, signage, spatial and terminal, and most of auditory, voice, print and machine |
| **rules on no cell** (what the grid cannot see) | **2 of 123**: Rule 78 and Rule 124 |

Closed cells (11) are not counted as gaps. Closed cells holding a rule: 0.

### What the counts say

- **The law is written for a screen.** 94 of 121 placed rules are written for the visual column
  and 88 of them for nothing else. 26 are medium-free. Seven name another medium, and one of those (125)
  names no screen at all.
- **Five of the ten media have no rule written for them**: haptic, luminous, signage, spatial and
  terminal. A rule reaches them only if it is medium-free, which is a claim that the rule *can* be
  projected there and not a statement that anyone has done it. The 26 medium-free rules would reach
  every one of the 34 empty cells, so this report does not count that reach as coverage: if it did, the
  honest gap would read 0, and nobody checked the projection once.
- **Fixtures tested the law medium-free, until D5.** At the first count 28 of 57 landed on a cell, and
  only 4 (the two print and the two auditory fixtures) on a medium column. **Not one fixture declared
  the visual medium**, so the 6 visual cells that hold 94 rules held no fixture. 13 of the 15 medium cells with a rule had no
  fixture; 2 medium cells (trust on auditory and on print) had fixtures and no rule written for them,
  which is Rule 82 running there medium-free.
- **28 fixtures land on no cell** (29 before D6). 5 declare no rule (the clean and exemption fixtures). 23 test a
  diagnostic that cites no rule in `violations.json`. That is mostly right, not a defect. Of the 20
  diagnostics that cite no rule, 14 enforce the grammar, 3 check declarations against each other, and
  where the law has no rule to cite, a citation would claim one that does not exist; `ROLE_UNDECLARED`
  cites nothing on purpose; and 2 (`EXPRESSION_ORPHAN`, `VIBE_STRIPS_RIGHT`) cite an article only. Three
  were worth a ruling on whether a rule backs them. The Principal ruled on 2026-11-02 (D6): `INTENT_ORPHAN`
  gets one (Rule 130, section 3c), and the other two stay article-only.

### What this grid cannot tell you

- **The placement is one reader's first cut.** The activities of each rule were read from its title and
  stated reason, and the media scope from its wording. Another reader would move some rules. The counts
  move with them, so they are a measurement of this placement, not of the law.
- **Nobody perceived any of it.** The grid is a document about perception, and no person has heard,
  felt or looked at a medium to check a cell. `CENTRAL-PERCEPTGATE-01` calls that a state, not a failure:
  this phase is reported as designed, not as verified by a person.
- **The verb map is a judgement.** COMPARE sits under understand and HIGHLIGHT under decide. Moving a
  verb between rows changes which cells are closed; moving one between perceive and trust cannot, as they own none.
- **A rule on a cell does not mean the cell is covered.** 80 of 123 rules are `judgment`. A rule that only
  a person can apply is a rule that has been written, and it says nothing about whether anything checks it.

---

## 3b. What the projection fixtures measured (D5, 2026-11-02)

The 34 empty cells are reached only by medium-free rules, and nobody had checked that those rules
survive projection. D5 (the Principal's ruling, relayed by Central) forbids writing a rule for
them until that is measured. So 14 fixtures were added, each applying a rule that already exists
under a declared medium, and each read through both courts: `zui.js` and the court forged from
`haro/zui.stzu`, judged on Haro v0.23 (ringpp 6611d18). **No rule, diagnostic or verifier changed.**

| fixture | rule | cell | zui.js | court | verdict |
|---|---|---|---|---|---|
| `projection-auditory-undo` and `-lawful` | 79 | recover x auditory | MISSING_UNDO, then clean | same | applies |
| `projection-voice-select-act` and `-lawful` | 16 | decide x voice | SELECT_ACT_COLLAPSE, then clean | same | applies |
| `projection-machine-cancel` and `-lawful` | 26 | recover x machine | MISSING_CANCEL, then clean | same | applies |
| `projection-print-motion` and `-lawful` | 112 | perceive x print | DECORATIVE_ANIMATION, then clean | same | **gap PG-1** |
| `projection-visual-perceive` | 112 | perceive x visual | DECORATIVE_ANIMATION | same | applies |
| `projection-visual-understand` | 119 | understand x visual | ROLE_ACTS_WITHOUT_CONSEQUENCE | same | applies |
| `projection-visual-decide` | 16 | decide x visual | SELECT_ACT_COLLAPSE | same | applies |
| `projection-visual-act` | 16 | act x visual | READ_ACT_COLLAPSE | same | applies |
| `projection-visual-recover` | 79 | recover x visual | MISSING_UNDO | same | applies |
| `projection-visual-trust` | 83 | trust x visual | HIDDEN_AUTHORITY | **clean** | applies; one new difference, S3 |

Each visual fixture is the visual-declaring twin of a fixture that already existed (the source is named
in its manifest note); the four medium pairs are new. "Applies" means the rule fired on the violating
fixture and stayed quiet on the lawful twin, in both verifiers. It does not mean a person heard
or read the result in that medium: **no one has perceived any of these fixtures, and the phase is
reported as projected by instrument, not as verified by a person** (`CENTRAL-PERCEPTGATE-01`).

**Differences this added: 1.** `projection-visual-trust` is `hidden-authority.zui` again, and the court
is silent on it for the same reason (S3: the court has no actor model). It is in `haro/twin-expected.csv`
with seam S3 and class `not-refused`; the ratchet lists 17 now, 16 before.

**Medium-free is not the same as projectable.** Three of the four media projected cleanly. The fourth
did not, and the gap is the one the grid was suspicious of.

### Projection gaps

A gap records the cell, the rule and what failed. It is not a rule and proposes none.

| id | cell | rule | what failed |
|---|---|---|---|
| **PG-1** | perceive x print (and understand x print: Rule 112 is written for both) | 112 | `projection-print-motion-lawful.zui` is clean in both verifiers: a printed notice that declares `MOTION fade` and reports its state change is admitted. `media.json` says print "has no time", so no motion can occur on it. The rule is satisfied in a medium where it cannot apply, and nothing says so. |
| **PG-2** **CLOSED** 2026-11-02 | recover x print, a closed cell | 79, 26 | A print flow that satisfies only `READ` and promises `ALWAYS_REACHABLE [UNDO, CANCEL, EXIT]` was clean in `zui.js`: `NOT_CARRIED` was applied to `SATISFIES` only, so a guarantee print cannot keep was not read. **Closed by** one narrow change to the medium-axis block of `zui.js`, which now applies `NOT_CARRIED` to `ALWAYS_REACHABLE` as well and raises the same `VERB_NOT_CARRIED` with the same subject shape. No new diagnostic, no new level. Pinned by `projection-print-promise.zui` (`VERB_NOT_CARRIED`) and its lawful twin. No existing fixture changed its verdict (71 of 71 still passed before the two were added). The court is silent on the new fixture (seam S14, in `twin-expected.csv`). |

PG-2 was ruled on 2026-11-02 (the Principal's word, relayed by Central): silence hiding an error, so the verifier
changes, as D1's rule says it must. PG-1 was ruled **no change**: it hides no error, and rule 112, `media.json` and
the verifier are left as they are. It stays recorded here, open as a fact and closed as a question. Neither gap is a rule.

### What D5 did to the counts

Run again with `node doc/design/coverage-count.js`:

| | before | after |
|---|---|---|
| fixtures | 57 | 73 (71 at D5, 2 more for PG-2) |
| fixtures on a cell | 28 | 45 |
| fixtures on a medium column | 4 | 20 |
| open medium cells with a fixture | 4 | 16 |
| cells with a rule and no fixture | 13 | 5 |
| cells with a fixture and no rule written for them | 2 | 6 |
| cells with at least one rule written for them | 21 of 55 | 21 of 55 |
| cells with none (the honest gap) | 34 of 55 | 34 of 55 |
| rules on no cell | 2 | 2 |

The honest gap did not move, as it must not: D5 measured reach and wrote no rule. What moved is how much of the
reach is known. The six cells that now have a fixture and no rule written for them (decide x voice, recover x
auditory, recover x machine, trust x voice, trust x auditory, trust x print) are where a medium-free rule has
been seen to work. Rule text for haptic, luminous, signage, spatial and terminal stays held until a product
that ships in one is named. The projection fixtures per medium are auditory, voice, machine, print and visual;
the rest of the 34 cells have not been projected.

---

## 3c. Rule 130 (D6, 2026-11-02, law v3.12)

`INTENT_ORPHAN` (an element that traces to no intent) enforced the invariant *every element serves an
intent* since language v1.0 and cited only Article II. The Principal ruled that it gets a rule. **Rule 130, Every
Element Serves an Intent**, is in Set 29 beside Rules 82 and 83, derived from Article II, enforcement `machine`
(Level 3, decided against an element inventory).

**Where it sits on the grid:** activities **understand** and **decide**, medium scope **any**. The person who meets
an element asks what it is, and one that serves no intent has no answer (understand); an indicator or control with
no intent behind it offers a choice that is not one (decide). The check does not look at the medium, so it is
medium-free, and the rule is stated to hold in every medium. Both are recorded in `coverage-placement.json`.

**One correction to the ruling's wording.** D6 describes this as the *recover* row: "an intent nobody can reach
leaves the person stuck". That is the opposite direction from the check. `INTENT_ORPHAN` finds an **element with no
intent**, not an **intent with no element**, and the fixture `intent-orphan.zui` shows it (`export_button` traces to
nothing). The rule was written for the check as it is, and so sits on understand and decide. An intent no element
carries is a real defect too; nothing checks it today, `UNRESOLVED_INTENT_FLOW` being a different thing, and no
rule is proposed for it here.

| | before D6 | after D6 |
|---|---|---|
| rules | 122 | 123 |
| medium-free rules | 25 | 26 |
| `understand x any` | 9 rules, 7 fixtures | 10 rules, 8 fixtures |
| `decide x any` | 8 rules, 11 fixtures | 9 rules, 12 fixtures |
| cells with at least one rule written for them | 21 of 55 | 21 of 55 |
| cells with none (the honest gap) | 34 of 55 | 34 of 55 |
| diagnostics that cite a rule | 16 | 17 |
| fixtures on no cell | 29 | 28 |
| rules on no cell | 2 | 2 |

The honest gap does not move: a rule written for the `any` column does not write itself into a medium. Rule 130 is
the 26th medium-free rule, and like the other 25 it has not been projected into the empty cells; no projection
fixture for it was part of D5, which did not know it was coming.

---

## 3d. What a screenshot can decide (Q8, 2026-11-02)

The audit of a foreign app judges only the rules a screenshot can decide, and the facts it reads are specified in
[`AUDIT-FACTS.md`](AUDIT-FACTS.md). Searching the law for rules that a text line, a box and two luminances could
decide leaves three, all on one cell:

| rule | activities | medium | decided by the facts |
|---|---|---|---|
| 62 Contrast & Legibility | perceive | visual | contrast under 4.5:1 |
| 105 The Legibility Floor | perceive | visual | the contrast half only |
| 107 Hierarchy Is Not Miniaturization | perceive | visual | a font under 16 CSS px, as an upper bound |

**Three of the 36 rules written for perceive x visual**, and none for any other cell: a screenshot is visual, and the
other 33 rules on that cell are judgment or need more than a line of text. The audit adds no rule and no cell; it
adds an instrument to a cell that already has rules and, since D5, six fixtures. Every other rule is reported
"not audited", never "passed". The placements are unchanged and `coverage-count.js` is unchanged.

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
