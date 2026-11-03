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

1. **named**: a rule whose own words name a medium sits on that medium. Six do (60 on voice, 104 on machine,
   72 and 77 on print, 73 and 125 on auditory), as corrected on 2026-11-03 (section 3g); at the first count seven did,
   with 60 and 104 also on machine and voice, 123 on print and 125 on voice, three of which the rules' words do not
   support. Rules 60, 72, 73, 77 and 104 are also written for the screen, so they sit on visual too.
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
| perceive | 5/8 | 36/2 | 2/2 | 1/0 | . | 1/6 | . | . | 1/0 | . | . |
| understand | 10/8 | 50/2 | . | 1/0 | x | 1/2 | . | . | 1/0 | . | . |
| decide | 9/12 | 9/3 | . | 0/2 | x | x | x | x | . | . | . |
| act | 2/7 | 12/3 | 1/0 | 0/2 | . | x | x | x | . | . | . |
| recover | 5/10 | 9/1 | 0/2 | . | . | x | x | x | 0/2 | . | . |
| trust | 9/11 | 12/4 | 0/2 | 0/2 | . | 0/4 | . | . | . | . | . |

A rule sits on several cells, so a column does not add up to a number of rules.

### The three counts

| | |
|---|---|
| **cells with at least one rule** | **20 of 55 live cells**: all 6 in `any`, and 14 of the 49 open medium cells |
| **cells with none** (the honest gap) | **35 of 55 live cells**, all of them medium cells: every cell of haptic, luminous, signage, spatial and terminal, and most of auditory, voice, print and machine |
| **rules on no cell** (what the grid cannot see) | **2 of 123**: Rule 78 and Rule 124 |

Closed cells (11) are not counted as gaps. Closed cells holding a rule: 0.

### What the counts say

- **The law is written for a screen.** 94 of 121 placed rules are written for the visual column
  and 89 of them for nothing else. 26 are medium-free. Six name another medium, and one of those (125)
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
| 62 Contrast & Legibility | perceive, understand | visual | contrast under 4.5:1 |
| 105 The Legibility Floor | perceive, understand | visual | the contrast half only |
| 107 Hierarchy Is Not Miniaturization | perceive | visual | a font under 16 CSS px, as an upper bound |

**Three of the 36 rules written for perceive x visual**, and none for any other cell: a screenshot is visual, and the
other 33 rules on that cell are judgment or need more than a line of text. The audit adds no rule and no cell; it
adds an instrument to a cell that already has rules and, since D5, six fixtures. Every other rule is reported
"not audited", never "passed". The placements are unchanged and `coverage-count.js` is unchanged.
The writer that now exists produces ink boxes, so rule 107 cannot be decided from its facts today; rules 62 and 105 can, at the worst end of the background (AUDIT-FACTS.md sections 4 and 6).

**Understand as well (2026-11-03, ruled after the placement review of section 3e).** The blind second reader added understand
to rule 62 and moved rule 105 to it, and the Principal ruled to keep perceive and understand as two rows and to record
understand on both. Perceive owns no verb on purpose, because a lamp is perceived and cannot be read, so text that
is faint is first a perceive matter and, once seen, a reading matter; the two rows are not merged for that. Rules 62
and 105 are now placed on perceive and understand, both on visual, and the audit's decisions touch both rows. Rule 107
stays on perceive only in the placement file: it was not in the sample, so nobody has read it a second time. The three counts did
not move (21, 34 and 2), and the only cell figure that did is understand x visual, 48 to 50 rules. The comparison output
saved at the time of the review (`placement-review/compare-output.txt`) is a record of that read and is not regenerated:
re-running `compare.js` today would show rule 62 as an exact match and rule 105 as an overlap.

---

## 3e. How far the placement can be trusted: a blind second reader (2026-11-03)

The placement is one reader's first cut, and every count in this document moves with it. The Principal ruled that it be
measured, not changed: a second reader who has seen none of it re-places a sample, and this section reports how many
placements differ. **Nothing in `coverage-placement.json` was changed, and this section does not say who is right.**
A disagreement is a finding for the Principal.

**The sample, mechanical.** The rules the placement file places (121 at v3.12), sorted by number, every 4th by position
(1st, 5th, 9th, ...): **31 rules** (1 5 10 14 18 22 26 31 37 41 45 49 53 57 62 66 70 74 79 83 89 93 97 101 105 109 113 117 121 126 130),
plus the two off-grid rules, 78 and 124. Reproduce with `node doc/design/placement-review/sample.js`. Nothing was chosen:
the sample holds 4 of the 8 hand-set rules (5, 41, 49, 74) and rule 130, which this desk wrote, because position put them there.

**The reader.** A fresh subagent, started with no fork, given one file: the section 1 grid of this document, the
three-step order of section 2, and the packet (number, title, avoid, solution, why of each sampled rule, and nothing else).
It was not given the hand-set list, the placement file, the enforcement tiers, the diagnostics or the fixtures. It reported
that it read only that one file; that is its own account, not something this desk checked. Its raw answer is
`placement-review/second-reader.json`. Compare with `node doc/design/placement-review/compare.js`.

**Two differences in method, stated because they explain some disagreements.** (1) The first placement could consult a rule's
bound diagnostic for step 2 of the medium order (a rule bound to a diagnostic whose check ignores the medium sits on `any`
even with screen wording). The reader had no diagnostics and decided step 2 from the words. (2) The reader was told it
could answer "off" for a rule that is about the maker of an interface, which is a hint toward the off-grid pair.

### The figures

| | |
|---|---|
| **activities**, 31 placed rules | **exact 7, overlap 20, disjoint 4** |
| **medium scope**, 31 placed rules | **same 25, different 6** |
| both activities exact and medium same | **6 of 31** |
| off-grid pair (78, 124) | the reader also says off, both |
| the three counts, if the reader's placement replaced mine on these 31 | **21 -> 21, 34 -> 34, 2 -> 2** |

**Direction.** The reader gives more activities per rule (mean 1.84 against 1.42): in 13 of the 24 inexact rules my set sits
inside the reader's, in 2 the reader's sits inside mine, and in 9 they cross. The reader reaches for **understand** (20
rules against my 12), **perceive** (12 against 8) and **act** (7 against 2); I reach for **trust** (9 against 6) and **recover** (8
against 5). **Medium:** 5 of the 6 differences are `any` (mine) against `visual` (the reader's): rules 18, 22, 26, 53, 79. Three of
those (26, 53, 79) are bound to a medium-free diagnostic, which is method difference (1), not a difference of reading.
The sixth, rule 89, goes the other way (mine visual, reader any).

### The bound, and its limit

The three counts do not move at all, and **that is a weak result, not a strong one.** The 34 empty cells are all medium cells
other than visual, and none of the 31 sampled rules is one I placed on a medium other than visual or `any` (the seven named
rules, 60, 72, 73, 77, 104, 123 and 125, fell outside the sample), nor did the reader place any there. A sample
that holds none of those rules cannot test them. What the bound does say: the **visual column** and the **any column**, where
the disagreement lives, are not what decides the three counts. Fixture placements and the per-cell figures in section 3
would move, and were not recomputed.

### The disagreements (25 of 31)

One line each on what the rule's own words support. `mine` is the placement file, `reader` is the second reader.

| rule | mine | reader | what the rule's own words support |
|---|---|---|---|
| 1 Cognitive Mercy | decide+perceive | perceive | Perceive: "draws attention without serving intent". Decide rests on the badges and interruptions in the avoid list, which is thinner |
| 5 The Monastic Palette | perceive | perceive+understand | Both: the why is about sensing (vibrates), the second sentence about what a colour means from page to page, which is reading |
| 10 The Z-Axis of Importance | decide+perceive | +understand | "One clear H1", "unclear visual hierarchy" is how a person tells what matters, so the reader's addition is supported |
| 14 No App-Squeezing | perceive | understand | "Nested scrollbars hide data and steal the wheel": hiding data from a reader is understand (READ and SCROLL are its verbs); perceive is thin |
| 18 The Speed of Thought | act+trust / any | act+perceive+trust / visual | Perceive: acknowledge "within 100ms (a highlight or state change)". Medium is a close call, "progress bar" is screen wording and "Never show Success until confirmed" is not |
| 22 The Last Word Rule | recover+understand / any | decide+understand / visual | Decide: "suggest the most logical next step"; recover: "never leave the user at a dead end". Both are in the text. "bottom of the current view" is the one screen phrase |
| 26 The Back Button is Holy | recover / any | recover / visual | The words are web wording (browser back, location hash, top-left). `any` came from the bound diagnostic (method difference 1) |
| 37 Errors as Events | recover+understand | +perceive | "Reserve space for errors", weight classes (Hint, Warning, Error): an error is noticed before it is read, so perceive is supported |
| 41 Validation on Blur | recover | act+perceive | Both: the why ("correcting mid-keystroke") is recover; the body (validate on blur, the message fades) is entering data and a message appearing |
| 53 Interaction Lockdown | recover / any | decide+recover / visual | "Pointer events", "Esc", "Exit Focus (Esc)" hint in the header are screen wording. Decide: "only the focused container is interactive" narrows what can be chosen. `any` came from the bound diagnostic |
| 57 The Wayline | understand | act+understand | "Clicking a previous node should scroll the user back": the interactive nodes support act as well |
| 62 Contrast & Legibility | perceive | perceive+understand | Contrast is perceive; "hierarchy clear without colour" and text that scales is reading. **This is also the cell section 3d uses for the audit** |
| 66 Interactive Projection | trust+understand | decide+understand | "Inability to highlight specific data points" and the pointer support decide (HIGHLIGHT is its verb); trust rests on "live slides end the screenshot lie" |
| 70 The Monastery of Configuration | decide+recover | act+decide | The "Contextual Save" and "Pending Changes" bar are about saving a change, which is act; recover is thinner |
| 74 The Face & Role Trinity | trust+understand | perceive+understand | "Status dots ... for quick scanning" and "no visual indication of user status" are perceive; trust rests on "actors in the system" |
| 79 The Undo Covenant | recover / any | act+recover / visual | "Every destructive action" is act; "toast", "dialogs", "bottom of screen" are screen wording. `any` came from the bound diagnostic. Note D5 showed rule 79's check fires in auditory, voice and machine, so the diagnostic and the words disagree about the medium |
| 83 Predictable Authority | trust / any | trust+understand / any | "Same icon, same intent": what a control means is understand as well as trust |
| 89 No Dark Pattern | decide+trust / visual | act+decide+trust / any | The solution has no screen wording ("confirmation texts are declared fields, consent defaults to no"); "pre-checked" in the avoid list is the one that does. Consent given is act |
| 93 Navigation Invariance | recover / visual | recover+understand / visual | "Primary navigation keeps its position on every screen" is where-am-I, which is understand |
| 105 The Legibility Floor | perceive / visual | understand / visual | Both: "text you must lean into is text you will misread" is reading; "faintness" is sensing. **Also the audit's cell (section 3d)** |
| 109 Zeros Align | perceive+understand | understand | "Makes the reader parse two characters to learn one digit" is understand; perceive is not in the words |
| 117 One Column Carries the Colour | perceive | perceive+understand | "Where to look first" is perceive; "the one that answers must I act on this row" is reading what a column says |
| 121 The Assistant Never Masks the Work | trust / visual | perceive+understand / visual | "Never covering the work the operator is deciding about" is perceive and understand; trust is not in the words |
| 126 Foreign Data Says It Is Foreign | trust+understand | +perceive | "Visibly marked ... without clicking, hovering or asking" is perceive |
| 130 Every Element Serves an Intent | decide+understand / any | decide+perceive / any | The rule's own why supports both: an element "takes it for a choice" (decide) and "competes with the ones that matter" (perceive). Written by this desk |

**What the disagreements say, for the Principal.** (a) The placement is stable where the rule names its subject
plainly and unstable where a rule is about attention or reading: the 7 exact matches and the 4 disjoint ones
are not random, three of the four disjoint ones (14 and 105 perceive against understand, 41 recover against act and perceive) are confusions between neighbouring rows, and the fourth (121) is trust against perceive and understand.
(b) Perceive and understand are the least separable pair of rows: 62 and 105 are the rules section 3d builds the audit on,
and the reader added understand to 62 and moved 105 to it. (c) The `any` / `visual` line is where this placement and the reader's
differ most in *medium*, and half of it is the diagnostic clause, so the diagnostic clause carries more weight than it
looks. This is a measurement of 31 rules, read once by one reader: it is a doubt with a number, not a replacement placement.

---

## 3f. The second blind read: the rules that decide the 34 (2026-11-03)

The first read (section 3e) held no rule placed on a medium other than visual or `any`, so it could not move the 34 empty
cells. The Principal ruled a second read of exactly those rules.

**The sample, mechanical.** Every rule the placement file places anywhere other than visual-only: **33 rules**, the 26 medium-free
rules and the 7 named for another medium. (The ruling counted 32, from 25 medium-free; Rule 130, canonized at v3.12, is the 26th.)
List: 9 16 18 22 26 32 40 44 51 53 60 72 73 76 77 79 82 83 91 96 97 98 99 101 103 104 112 118 119 122 123 125 130. Named:
60 72 73 77 104 123 125. Reproduce with `node doc/design/placement-review/sample2.js`.

**The reader.** A second fresh subagent, not the first, with no fork. Its brief is the section 1 grid and the full three-step order of
section 2 **including the bound-diagnostic clause** (`placement-review/brief-order-2.md`, the exact text). The packet adds, for each rule,
the diagnostics bound to it (id, summary, `decidable_from`) and nothing else new: no placement, tier, fixture or hand-set list.
"Off" was not offered. It reported reading only that one file, which this desk did not verify. Its raw answer is
`placement-review/second-reader-2.json`; compare with `node doc/design/placement-review/compare2.js` (output saved beside it).

### The figures

| | |
|---|---|
| **activities**, 33 rules | **exact 15, overlap 16, disjoint 2** |
| **medium scope**, 33 rules | **same 22, different 11** |
| both exact and same | **10 of 33** |
| the 26 medium-free rules | medium same 19, activities exact 11 |
| the 7 named rules | medium same 3 (72, 73, 77), different 4 (60, 104, 123, 125); activities exact 4 |

**Where the medium disagreements are.** Of the 26 medium-free rules, **12 have a diagnostic bound to it and the reader agreed on all 12**
(16 26 51 53 79 82 83 98 112 118 119 130). The other 14 have none, and the reader agreed on 7 of them; the 7 it moved are 9, 18, 22, 40, 76, 91
and 96, every one from `any` to `visual`. With diagnostics visible, the clause that decides step 2 for a bound rule is stable. For an unbound
rule it is a reading of the words, and the two readers read them differently.

### The bound: what these rules do to the 34

The three counts move: **cells with at least one rule 21 to 17, cells with none 34 to 38, rules on no cell 2 to 2.**

- **1 of the 34 would gain a rule:** understand x auditory, from rule 73, where the reader adds understand.
- **0 of the 34 would lose one**, having none to lose. But **5 cells that now hold a rule would hold none**, which is how 34 becomes 38: perceive x voice,
  perceive x print, perceive x machine, understand x voice and act x voice. All five come from named rules: 125 on voice (act x voice, and part of
  perceive x voice), 60 and 104 on voice and machine (perceive x voice and machine, understand x voice), and 72 (the reader moves it from perceive to understand, which empties perceive x print).
- No placement of the reader's raised a problem (no rule on a closed cell).

So the honest gap is **34 on this placement and 38 on this reader's**, and the difference is made by about five judgments about named rules.

### What the rules' own words say about the named placements

For three of the four medium disagreements on named rules, the words of the rule are the question:

- **Rule 123, print:** the rule names no medium at all, in its title, avoid, solution or why. Its evidence is a web site. The placement's `print` has no support in the rule's words.
- **Rule 125, voice:** the rule names sound and earcons, not voice. The placement's `voice` has no support in the rule's words, and the reader's `auditory` alone is what it says.
- **Rule 60:** it names a voice assistant, a phone tree and an embedded panel, and says the web markup is "the realization, not the rule". It does not name a machine reader; the word `machine` in the record is its enforcement tier.
- **Rule 104** names machines, agents and screen readers, and a non-visual medium; `machine` is plainly named, and `visual` and `voice` are inferred from "three beneficiaries".

### The disagreements (23 of 33)

`mine` is the placement file, `reader` is the second reader; one line each on what the rule's own words support. Nobody is declared right.

| rule | mine | reader | what the rule's own words support |
|---|---|---|---|
| 9 Progressive Disclosure | decide+understand / any | / visual | Activities agree. The avoid list names "settings panels with dozens of toggles", the one screen phrase; the solution has none. No diagnostic |
| 16 Intentional Clicks | act+decide+trust | trust+understand | "Users should never wonder is this clickable" is understand and the why ("a promise ... breaks trust") is trust; act and decide rest on "nothing else behaves like either" and on the bound select and read diagnostics |
| 18 The Speed of Thought | act+trust / any | act+perceive+trust / visual | Perceive: acknowledge "within 100ms (a highlight or state change)". Medium: "progress bar" is screen wording, "never show Success until confirmed" is not. No diagnostic |
| 22 The Last Word Rule | recover+understand / any | act+understand / visual | "Never leave the user at a dead end" is recover; "completion should feel like a natural conclusion" is act. "Bottom of the current view" is the one screen phrase |
| 32 Smart Defaults | decide / any | act+decide / any | "Forcing users to re-enter known information" is act as well as decide |
| 40 Non-Accusatory Pathfinding | recover+understand / any | / visual | Activities agree. The avoid list names "red text that screams", screen wording, and step 2 reads title, avoid and solution; the principle (what an error message says) is medium-free |
| 51 The Cognitive Tunnel | decide / any | decide+perceive+recover / any | "Esc key always exits" is recover and "the world must visibly wait" is perceive; the reader's additions are in the words |
| 53 Interaction Lockdown | recover / any | decide+recover / any | "Only the focused container and its children are interactive" narrows what can be chosen |
| 60 Screen Reader Harmony | perceive+understand / machine+visual+voice | / any | Names a voice assistant, a phone tree and an embedded panel and calls the web markup a realization: supports voice and, in the same breath, any. Names no machine reader |
| 72 The Canvas Logic | perceive / print+visual | understand / print+visual | "Chrome should recede" is perceive; "when viewing a document" is understand. Print is named ("PDF printout") |
| 73 Multimedia Handling | perceive / auditory+visual | perceive+understand / same | "Always provide captions or transcripts" is about the content being understood |
| 76 Batch Action Silence | perceive / any | act+perceive / visual | "Changing roles for 50 users" is an act. "One quiet progress bar" and "notifications" are screen wording; the why is not. No diagnostic |
| 79 The Undo Covenant | recover / any | act+recover / any | "Every destructive action" is an act as well as a recovery |
| 82 Perceivable State | perceive+trust / any | perceive+trust+understand / any | "Every norm carries a MESSAGE a human operator can read" is understand |
| 83 Predictable Authority | trust / any | act+trust / any | "Every step that commits ... names its ACTOR": the commit is an act |
| 91 Business Time | understand / any | act+perceive / visual | Disjoint. "After a critical action, the result stays long enough to be registered" is act and perceive; "periods, cutoffs and deadlines shown in operational terms" is understand. "Transitions the eye cannot follow" is visual wording. No diagnostic |
| 96 Contextual Defaults | decide / any | decide+understand / visual | "Opening on all records" is about what the person is looking at, which is understand. "List" and "view" are the screen-ish words. No diagnostic |
| 99 Visible Provenance | trust / any | perceive+trust / any | "Marked as machine-made wherever it appears ... provenance is visible state" is perceive |
| 104 Machine Legibility | perceive+understand / machine+visual+voice | understand / machine | Machine is named; "meaning conveyed only by pixels" in the avoid list touches perceive weakly. Visual and voice are not named |
| 112 Motion Reports | perceive+understand / any | perceive / any | "A change the operator caused and might otherwise miss" is perceive; understand is not in the words |
| 119 A Card Is Not a Button | decide+understand / any | act+understand / any | "An action takes the shape of a button or a link" is act; "what is pressable" is also decide. Both are in the words |
| 123 The Reading Arc | understand / print+visual | / visual | Activities agree. The words name no medium, so `print` has no support in them; "page", "sections" and "paragraph" are the reading-surface wording |
| 125 Sound Corroborates | act+perceive / auditory+voice | / auditory | Activities agree. Names sound and earcons, not voice |

### What this says, for the Principal

(a) **The medium-free column is stable where a diagnostic is bound and soft where none is.** 12 of 12 against 7 of 14. The step-2 test for an unbound rule, "no
screen wording in its title, avoid or solution", is a reading, and a single phrase in an avoid list (40, 9) can tip it. (b) **The 34 depends on about five judgments
about named rules**, and for two of them (123 on print, 125 on voice) the placement names a medium the rule's own words do not. Those are the placements most worth a second
look, and they are not decided here. (c) Taken with section 3e, the pattern repeats: where the two readings differ on activities, it is mostly the reader giving a rule one more activity than the first
reading did (in this sample 16 overlaps against 2 disjoint). Nine rules (18, 22, 26, 53, 79, 83, 97, 101, 130) were in both samples and the readers saw them with and without diagnostics. This is two readers, one read each. It is a measurement, not a replacement placement.

---

## 3g. Named placements held to their words (2026-11-03)

The second blind read (section 3f) found three named placements the rules' own words do not support. The Principal ruled to apply the grid's step 1
as written, **a rule sits on a medium only where its own words name it**, to those three and to the four others, and to change only the ones whose
words do not support their medium. The placement file is the only thing changed.

| rule | placed before | its own words | placed now |
|---|---|---|---|
| 60 Screen Reader Harmony | visual voice machine | web markup (visual); "a voice assistant, a phone tree" (voice); an "embedded panel" and "any screen reader" name no medium; no machine reader | **visual voice** |
| 72 The Canvas Logic | visual print | "a PDF printout", "between screen and print" | unchanged |
| 73 Multimedia Handling | visual auditory | "videos or audio logs", autoplay of video or audio | unchanged |
| 77 The Trinity Structure | visual print | "poor print formatting"; document and table layout | unchanged |
| 104 Machine Legibility | visual voice machine | "machines", "agents", "pixels" (visual); "a non-visual medium" and "multi-modal" name no voice | **visual machine** |
| 123 The Reading Arc | visual print | names no medium; "page", "sections", "paragraph" are reading-surface wording | **visual** (step 3) |
| 125 Sound Corroborates | auditory voice | "a sound", "an earcon"; voice is not named | **auditory** |

Four rules changed (60, 104, 123, 125) and three were tested and left (72, 73, 77). Activities are unchanged for all seven. The seven medium-free rules the
second reader moved to visual (9, 18, 22, 40, 76, 91, 96) were not touched, as ruled.

**The three counts, before and after.** Cells with at least one rule **21 to 20**; cells with none **34 to 35**; rules on no cell **2 to 2**. Medium cells
with a rule 15 to 14. **One cell empties, act x voice**, whose only rule was 125. It is not five: the reader's five came from a different change (it also moved
72 from perceive to understand and gave 60 and 104 other media), and this change touches only the media the rules' words do not name. The other four cells
the reader would have emptied keep a rule: perceive x voice and understand x voice keep 60, perceive x machine keeps 104, and perceive x print keeps 72.
No rule is on a closed cell. The honest gap is now **35**, and the 38 of section 3f stays what it was, a bound on that reader's whole placement.

Figures in sections 3e and 3f were measured against the placement as it stood when each read was made. Re-running `compare.js`, `compare2.js` or `sample2.js`
today would give other figures (`sample2.js` would select 32 rules: 26 medium-free and 6 named). The saved outputs are a record of those reads and are not regenerated.

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
