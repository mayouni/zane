# The StzZui website: information architecture, content map and look

**Status: a design, step 1 of 2. No page has changed.** Asked for by Central on the Principal's charge (2026-11-03): *"The StzZui website
needs a deep refactoring and redesign to reflect the new scope and depth of our ui language and its value and use cases."* Step 2, the
build, waits for Central to read this and rule. Every figure below was read from the file named beside it on 2026-11-03; none is typed from memory.

**What this is.** The information architecture under Rule 27's five entries, the page list with each page's one question, the content map
(which file each figure and claim is read from), what is removed and why, the reference look, and how each v3.13 rule the site must obey is
answered and checked. **What this is not.** It touches no page, rule, fixture, contract, verifier, `zui.stzu`, the Reader or the UI audit tool.

---

## 1. The gap, measured

The site was written in August and describes the language as it stood then. What the pages say, against what the tree says:

| the site says (page) | the tree says | read from |
|---|---|---|
| "25 named violations ... 24 enforced by the verifier" (home, how) | **37 diagnostics**, contract 1.8; 32 errors, 5 warnings | `conformance/violations.json` |
| "40 fixtures" (home, how) | **73 fixtures**: 46 refused, 22 lawful twins, 5 clean and not a twin; levels 1, 2, 3 hold 12, 56 and 5 | `conformance/manifest.json` |
| "Zui v1.0" (how) | language **v1.4** | `doc/language/README.md`, `tools/zui/README.md` |
| "four diagnostics ... missing SATISFIES, invalid PERSPECTIVE ..." (how) | superseded: 37, at four conformance levels | `violations.json` |
| "measures 6 rules" (how, the UI audit) | the audit reads rules 105, 107, 108, 114, 115, 116 and, since 2026-11-03, the bars and unreadable colours | `tools/ui-audit.html` |
| projections "in design" (M4), cross-pillar symbols "in design" (M3), AI jurisdiction "in design" (M5) | see section 5; M3 and M4 each moved, M5 did not | `ROADMAP.md`, `conformance/media.json`, `tools/zui/cross-medium.js` |
| nothing on Haro, the twin courts, the ten media, the coverage grid or the screenshot audit | all four exist, with instruments | `haro/`, `conformance/media.json`, `doc/design/COVERAGE.md`, `doc/design/AUDIT-FACTS.md` |
| main menu of **8** entries (Why, How it works, Gotchas, Vibes, Adopt, Reader, UI audit, Zing) | Rule 27 at v3.13: **five** on a reading surface | `constitution/rules.json` rule 27 |

The one thing that was already right: **the law's own figures** (123 rules, version, tiers, 7 articles, 17 forbidden patterns) are read live by
`site/law-numbers.js`. The redesign extends that discipline from the law to everything else.

### Three corrections to the brief, found by reading the files (the brief is Central's, the files win)

1. **"88 of 123 rules written for a screen only" is 89 of 123** since rule 123 moved from `visual + print` to `visual` on 2026-11-03 (`coverage-count.js`: `visual_only` 89). The rules on the visual column, counting those also written for another medium, are 94.
2. **"73 fixtures at four levels, each beside its lawful twin" is not what the manifest holds.** The 73 sit at levels 1, 2 and 3; level 4 has none, by design (`LAYOUT_DISPLACEMENT` is a fact about a painted page, listed under `unfixtured`). 22 are lawful twins, and 20 of the 46 refusing fixtures have one. The page will say *73 fixtures, 46 of them refusals, 22 lawful twins*, and nothing about "each".
3. **"the GBNF makes a violating token unemittable" overstates what the grammar holds.** The forge does emit `zui.gbnf` (3,877 bytes; produced on every run of `haro/judge-zui-court.js`), and what it fixes is the *shape*: the ten kinds, which clauses each kind may carry, the lexical form. It does not enumerate the verbs (a name list is any identifier), and its own header says "a clause given twice and a required seat absent are the court's to refuse". So a **misplaced field and a malformed shape are unemittable; an unknown verb, an act with no undo and every other semantic refusal remain the court's.** The page says that. It also cannot yet link a checked-in grammar: **there is no `zui.gbnf` in this repository**, only in the forge's temporary output. Proposal for step 2: the judge copies it to `haro/zui.gbnf` and the page links it; until then the page states the claim as measured on a run, not as an artefact.

---

## 2. Who comes, and where each lands

A reader is a person with a question. Each has a first page that exists and says something real. (The home page's "three ways in" become seven.)

| reader | their question | first page | what they leave with |
|---|---|---|---|
| a | I build business software. Can I gate CI on this? | **Adopt > Build** | pin the law, lint, gate, measure the paint |
| b | I design, or I care about UX. What is the case? | **Law > Why a law** | the decay, the evidence, the stance |
| c | I generate interfaces with AI. How do I stop it breaking them? | **Adopt > Generate** | the forged grammar, what it holds and what it leaves to the court, the offences to feel |
| d | I ship where there is no screen (voice, sound, print, an API). | **Media** | ten media, and the honest map of which cells have a rule |
| e | I must judge an application I do not own. | **Audit > Screenshots** | what a screenshot can decide, what it refuses to decide |
| f | I design a language. | **Language > A language declared** | `zui.stzu` as the worked example, the charter linked through Softanza |
| g | I implement StzZui elsewhere. | **Language > Conformance** | the suite, the four levels, the twin-court discipline; Zing as the first conforming consumer |

---

## 3. Information architecture

### The main menu: five short entries (Rule 27), each a label a stranger reads as an answer (Rule 116)

> **Language** · **Law** · **Media** · **Audit** · **Adopt**

The brand ("StzZui") on the left is the home link. The culture switch is the only other control in the bar (see Rule 106 below). **Removed from the
menu and placed one level down:** Reader (inside Law), UI audit (inside Audit), Zing (inside Language > Conformance, as an external link marked as such),
Gotchas (inside Law, renamed), Vibes (inside Law, renamed), How it works (inside Language). Nothing is deleted from the site.

| label | the answer it gives | the rule it answers |
|---|---|---|
| Language | what you write, and what refuses it | the rest of the site hangs off two nouns: the language and the law |
| Law | what is forbidden, and on what evidence | Rule 116: the label names what the pages hold |
| Media | where one declaration holds | |
| Audit | whether a built interface, yours or not, meets the law | |
| Adopt | which way in is yours | |

### Level 2: a vertical rail on the left (Rule 120, the default), not a second horizontal band

Rule 120 lets a surface run two horizontal levels, and this design **does not use that**: every section holds four to seven pages, which is what a rail is for,
and a second horizontal band would be a fourth surface to keep fixed. **Level 3 is nested inside the Law rail only** (the seven offence families sit
under "What a violation feels like"); it is the same surface, so Rule 115's "every depth on exactly one always-visible surface" holds. **No level 4, no right bar.**
The site does not use four levels to look deep.

### The path (Rules 108 and 115)

- The menu marks the section; the rail marks the page and, nested, its family. **Every step is therefore marked by a bar, so no visible trail is owed** (Rule 108).
- **Every page carries a visually hidden `nav[aria-label="Breadcrumb"]`** naming the root, the section and the page, so assistive technology has the path.
  That is the condition ruled with Rule 108, and the audit now fails a page that omits it.
- **The rail is identical on every page of its section**, including the section's head page, with only the highlight moving. This is exactly what the audit's new Rule 115 check
  tests (a bar that lists a page must still be on it), and it is what stzsite's two findings missed. The home page is the one page outside every rail.

### The page list

Existing file names are kept wherever the page keeps its question, so that no inbound link breaks and "numbers are stable forever" is not broken by a rename.
The section is carried by the rail, not by the path. Labels change; files do not.

| section | page (label) | file | its one question (Rule 123: one message per section) | status |
|---|---|---|---|---|
| | **Home** | `index.html` | What is Zui, and is it for me? | rewritten |
| **Language** | What it is, step by step | `site/how.html` | How does a declaration go from an intent to a refusal or a pass? | rewritten, status board moved out |
| | What it refuses | `site/refusal.html` | What does the contract refuse, and how do I know a refusal is lawful? | **new**: 37 diagnostics, levels, the C2 envelope, rule citations |
| | A language declared | `site/haro.html` | Is the language itself declared, and what does that buy? | **new**: `zui.stzu`, the forge, the twin courts |
| | Conformance | `site/conformance.html` | How does anyone prove they implement it? | **new**: the suite, levels, pack, Zing |
| | Status | `site/status.html` | What exists, what is designed, what is held? | **new**: the board, rebuilt from the tree |
| **Law** | Why a law | `site/why.html` | Why a law and not guidelines? | kept, figures re-read |
| | The 123 rules | `site/law.html` | What does the law say, tier by tier? | **new**: the census, the Reader linked |
| | What a violation feels like | `site/gotchas/index.html` + 7 family pages | What does each family of offence feel like? | renamed (was "Gotchas"), kept as subtitle |
| | Two cultures, one truth | `site/vibes.html` | Can one truth be read two ways? | renamed (was "Vibes"), kept as subtitle |
| | How the law changes | `site/amending.html` | On what evidence does the law change, and what is still proposed? | **new**: docket, evidence ledger, the Second Founding marked *proposed, not ratified* |
| **Media** | One declaration, ten media | `site/media.html` | Does one declaration hold off a screen? | **new**: media.json, VERB_NOT_CARRIED, SIGNAL_UNPERCEIVABLE |
| | The map, and its gaps | `site/grid.html` | Where does the law speak, and where is it silent? | **new**: the coverage grid, 20 of 55 cells with a rule |
| | The proof | `site/cross-medium.html` | Does the instrument really check that renderings differ only as predicted? | **new**: `cross-medium.js` |
| **Audit** | The painted page | `site/audit.html` | Does a running interface meet the law? | **new** hub for the UI audit tool, which stays where it is |
| | Screenshots | `site/screenshots.html` | Can the law judge an application I do not own? | **new**: AUDIT-FACTS |
| **Adopt** | Which way in | `site/adopt.html` | Which of the seven ways in is mine? | rewritten as the hub |
| | Build | `site/build.html` | How do I put the law in a project and gate CI? | **new** (the old adopt body) |
| | Generate | `site/generate.html` | How do I hold an AI generator to the law? | **new** |

That is **19 pages in 5 sections plus 7 family pages**, against 15 today. Each page has one question and, by Rule 123, ten to twelve sections at most; most need fewer.
The seven ways in of section 2 land as follows: a Build, b Why a law, c Generate, d Media, e Screenshots, f A language declared, g Conformance. **f and g need no page of their own in Adopt**: the hub links straight to the page that answers.

---

## 4. The content map: every figure has a file, or it is not on the page

### How a figure gets onto a page

`site/law-numbers.js` already fills `data-law="..."` spans from `constitution/rules.json` and `conformance/violations.json` over a static fallback. It stays, and
step 2 adds **one generated file, `site/facts.json`, written by `node tools/site-facts.js`**, for the figures that are computed and not just read
(constraints in `zui.stzu`, twin differences, the grid, kinds, fixtures by level). A page marks a figure `data-fact="twin.differences"` with a fallback.
`node tools/site-facts.js --check` **fails if any fallback differs from the derived value, or if `site/facts.json` is stale**, the same discipline as `pack.js --check`. A typed number
that goes stale is then a failing check, not a quiet drift. The same `--check` re-runs the "ninety seconds" command on the home page and compares its output with the page's text,
so *"copied from a real run"* is verified, not asserted.

### The figures

| figure (as read 2026-11-03) | page(s) | read from | how |
|---|---|---|---|
| 123 rules, v3.13, 7 articles, 6 rights, 17 forbidden patterns, 31 sets | home, law | `constitution/rules.json` | live (exists) |
| tiers: machine 11, tool 7, machine-later 25, judgment 80 | law, status | `constitution/rules.json` | live (exists) |
| 22 intent verbs in 6 families | home, how | `constitution/rules.json` `intents.families` | facts.json |
| 10 declaration kinds | home, how | `tools/zui/zui.js` `ZUI_KINDS` | facts.json |
| 37 diagnostics (32 errors, 5 warnings), contract 1.8, 4 levels | refusal, home | `conformance/violations.json` | live |
| 73 fixtures: 46 refused, 22 lawful twins, 5 clean; by level 12, 56, 5 | conformance, refusal | `conformance/manifest.json` | facts.json |
| 10 media; what each carries | media | `conformance/media.json` | live |
| 5 signal values; muted silent on auditory and voice | media | `conformance/signal.json`, `zui.js` `SIGNAL_ABSENCE` | live |
| 136 constraints in `zui.stzu`, each with CITES | haro | `haro/zui.stzu` (count of `DEFINE CONSTRAINT`) | facts.json |
| 18 listed twin differences, by seam and class | haro | `haro/twin-expected.csv` | facts.json |
| 24 of 30 envelope cites agree with the contract (see note) | haro | `haro/judge-zui-court.js` output | **not on the page**: a judge run, not a file; the page links the judge and shows the command |
| grid: 6 activities x 10 media; 49 open medium cells, 14 with a rule, 35 with none; 6 of 6 in the `any` column; 20 of 55 live cells with a rule | grid | `doc/design/coverage-count.js --json` | facts.json |
| 89 of 123 rules written for a screen only; 26 medium-free; 6 named for another medium; 2 off the grid | grid | the same | facts.json |
| the screenshot audit decides 3 rules (62; 105's contrast half; 107) | screenshots | `doc/design/AUDIT-FACTS.md` section 3 | **a gap**: a statement, not a file. Step 2 adds `doc/design/audit/decides.json` (the three rule numbers), checked by `check-facts.js` |
| contrast floor 4.5:1, size floor 12 pt, OCR score 0.5, spread 0.25 | screenshots | `doc/design/audit/check-facts.js` constants | facts.json |
| the UI audit: rules 105, 107, 108, 114, 115, 116 | audit | `tools/ui-audit.html` header and cards | read at build |
| the doc set: each document's title and its own stated status (the Second Founding reads *proposed, not ratified*) | amending, status | `doc/*.md` first lines | read at build (title and `**Status**` line) |

*Note on the envelope-cites figure:* the 24 of 30 envelopes that cite what the contract binds comes from running the judge against a Haro spike checked out elsewhere, so it is not derivable from files in this repository. **It is not on the page as a number.** The page says the court cites the law and shows how to measure it.

### The four new things, each with its instrument and its honest figure

1. **The language is declared, not only implemented.** `haro/zui.stzu` is StzZui written in Haro: 136 constraints, each citing its rule, article, right or pattern. The forge emits a second court and a grammar from it. `zui.js` and the forged court are two evaluators of one law; `haro/twin-expected.csv` lists their **18** known differences by seam and class, and `judge-zui-court.js` exits non-zero on any other, or on a listed one that now agrees. *A difference* is a fixture on which the two courts say different things; the list shrinks only when someone deletes a row on purpose. Honest limits: the court is silent on the four warning fixtures until severity is carried (seam S1), and on three level-3 checks, `INTENT_ORPHAN`, `INVISIBLE_STATE` and `HIDDEN_AUTHORITY` (S3).
2. **One declaration, ten media.** `media.json` enumerates `visual auditory voice haptic print luminous signage machine spatial terminal`. A verb a medium cannot carry is refused (`VERB_NOT_CARRIED`, on `SATISFIES` and, since 2026-11-02, on `ALWAYS_REACHABLE`); `SIGNAL_UNPERCEIVABLE` is the first check that needs two axes; `cross-medium.js` checks that renderings differ only as the published data predicts. The grid is the page's centre and **the gap is its content**: 6 activities by 10 media, 11 cells closed by the media themselves, **20 of 55 live cells with a rule written for that medium, 35 with none, 89 of 123 rules written for a screen only.** Held, and stated as held: rules for haptic, luminous, signage, spatial and terminal, until a product that ships in one is named. A projection-fixture result belongs here too: three of four non-visual media projected cleanly, and print did not (PG-1, no change ruled).
3. **The law reaches interfaces nobody declared.** A screenshot is reduced by OCR to facts (text, box, line height, two luminances, a contrast ratio) and judged against the three rules it can decide. **Every other rule reads "not audited", never "passed". A size is never "pass". Contrast is judged at the worst end of the background.** The facts writer exists in stzlib. **Stated on the page: no real application's screenshot has been run through it yet, and no person has looked at any.** The writer's boxes are ink boxes, so rule 107 cannot be decided from its facts today.
4. **The refusal contract grew and gained levels.** 37 diagnostics in `violations.json` 1.8; four conformance levels; the C2 envelope (`tools/zui/envelope.js`) carrying CODE, CITES and SEVERITY; `FIELD_MISPLACED`, `UNKNOWN_FIELD` and the structural ids; Rule 130 canonized from a check that had cited only an article.

---

## 5. The status board, rebuilt row by row

The board on `how.html` moves to `site/status.html` and is rebuilt from the tree, with the same two states, *what exists* and *what is designed*, and a third, **held**, because the tree now has a real list of things decided-not-yet.
The three August rows that said "in design" are re-read:

| row (August) | today | evidence |
|---|---|---|
| M3 cross-pillar symbols, computed | **unchanged in substance**: the verifier accepts a symbol table; computing one from a host project's pillars is still unbuilt. `INTENT_ORPHAN` now cites Rule 130 | `ROADMAP.md` M3 "honest remainder"; `tools/zui/zui.js` |
| M4 projection tables as data | **partly built, not as tables of widgets**: the media matrix and the signal vocabulary are data (`media.json`, `signal.json`), checked by `cross-medium.js`; intent-to-widget tables per medium are *superseded* by the Second Founding if ratified, which it is not | `ROADMAP.md` M4; `conformance/media.json` |
| M5 the AI jurisdiction | **unchanged**: no chat-stream rules, no MCP surface serving the law | `ROADMAP.md` M5 |

New rows, each stating its status and its limit: the forged court and the twin ratchet (live, 18 listed differences); the coverage grid (designed and measured, **placement checked by two blind readers over 55 distinct rules, projected, not verified by a person**); the screenshot audit (the facts schema and writer exist, **never run on a real application**); the UI audit's bar and landmark checks (live, run on 17 sample pages of another site, not on 183).
Held, listed as held and not advanced: Q5 other pillars, Q6 usability toolset, Q7 intelligence, rules for five media, `ROLE-REASON-01`, one subject on one page.

---

## 6. What is removed, and why

| removed or replaced | why |
|---|---|
| the hand-typed numbers (25, 24, 40, 6 rules, "four diagnostics", v1.0) | each is false against the tree; replaced by `data-fact` spans that a check keeps true |
| the "In design" row labels for M3 to M5 | re-read in section 5; the board says what each is today |
| the eight-entry main menu | Rule 27; the rest moves one level down, nothing is deleted |
| "Gotchas", "Vibes" as labels | metaphors (Rule 116); kept as subtitles, as the Principal's desk allowed |
| the three-ways-in on the home page | seven readers, each landing on a page that exists |
| the "Style" dropdown | replaced by the two-state control below |
| the status paragraph on the home page ("passes all 40 fixtures ...") | a second place a number could go stale; the home links the board |
| the claim that the GBNF makes a violating token unemittable | not what the grammar holds (section 1, correction 3) |

---

## 7. The reference look

**What the author asked for:** the style of the Compass artifacts, as stzsite now wears it: *a light tint under the page head, a light shadow under cards, neither used for emphasis.*
Read from `stzsite/assets/css/site.css` (read only; nothing there is touched): a paper ground, a lighter panel for cards, hairline borders, one shadow
`0 1px 2px rgba(27,33,31,.04), 0 6px 18px rgba(27,33,31,.05)`, generous measure, quiet tinted chips.

**What this design takes and what it keeps.** It takes the *form*: a tint band under the page head, a single resting shadow on cards (the same on every card, unchanged by hover or state, Rule 10), hairline borders, panel on paper.
It **keeps the StzZui livery**, the two lawful cultures of `stz.css` (curator: midnight indigo, garnet rose, porcelain; guardian: green phosphor on black, monospace), because the site *is* the Article VI exhibit and because two Softanza sites should stay distinguishable (the comment in `stz.css` says so). This is the first question for Central, below.

Proposed additions to the existing tokens, **curator**, in hex (the audit reads hex and `color(srgb)`, and will say "not decided" for `oklch` or `lab`, so neither is used):

| token | value | contrast it must hold |
|---|---|---|
| `--tint` (the band under the page head) | `#ebe8f5` | ink 13.5:1, muted 7.4:1, accent-ink 7.2:1 on it |
| `--shadow` (the one resting shadow) | `0 1px 2px rgba(33,29,51,.04), 0 6px 18px rgba(33,29,51,.06)` | none: it carries no information |
| paper, card, ink, muted, accent-ink | unchanged: `#f4f3f9`, `#fdfcff`, `#211d33`, `#4a4661`, `#8f1d3d` | ink 14.8:1 on paper; muted 8.8:1 and accent-ink 8.5:1 on card |

**Guardian** keeps `box-shadow: none` and a flat band: a terminal does not float cards; Rule 10 allows a resting shadow, it does not require one. No motion (Rule 112). Text at 1rem or more (Rules 105, 107). No external requests, no new fonts: the system stack stays (the stzsite typefaces are OFL files that would be copied in; the design does not need them).

---

## 8. How the site obeys v3.13

| rule | how the design answers it | how it is checked |
|---|---|---|
| **27** five entries on a reading surface | Language, Law, Media, Audit, Adopt | count of the main bar's links; the audit's menu reading |
| **120** two horizontal levels only if distinct, fixed and at most five; third vertical | level 2 is a vertical rail, level 3 nested in it; no horizontal second band, no level 4 | by construction; the bar-persistence check |
| **115** the path distributed across the bars, every depth on one surface | menu marks the section, rail marks the page, nested rail the family; the rail identical on every page of its section | **the audit's new Rule 115 check** on every page, before and after |
| **108** a trail only where it names a level no bar marks | no visible trail; a visually hidden `nav[aria-label="Breadcrumb"]` on every page | **the audit's new landmark finding** (it reports a missing one) |
| **116** a label names what the page holds | five labels read as answers; "Gotchas" and "Vibes" become subtitles; a menu label and a path label agree | the audit's Rule 116 check (one page, one name) |
| **106** a two-state control shows both states | the culture switch becomes a segmented switch, "Modern" and "Retro" both always visible, the current one marked by weight, an underline and a check glyph, never by colour alone, `aria-pressed`, F2 kept | by hand on every page; there is no instrument yet (the rule is machine-later) |
| **10** one resting shadow, same on every card | `--shadow` once, applied to `.card`, no `:hover` rule on it, none in guardian | grep for `box-shadow` in `stz.css` |
| **62, 105, 107** contrast, floor, size | tokens above hold 7:1 or more; text 1rem or more | **the UI audit on every page: 0 findings now, 0 after** |
| **112** motion reports | none | grep for `transition` and `animation` |
| **123** one message per section | each page has one question, at most ten to twelve sections | by reading, page by page |

---

## 9. Step 2: the build

Pieces a reader can review, each a commit that says what it changes and what it removes:

1. **Shell and navigation:** `stz.css` tokens, the five-entry bar, the rail, the hidden landmark, the segmented culture switch; every existing page re-shelled, no content change. Gate: the audit on the 15 current pages stays at 0 before and after.
2. **Facts:** `tools/site-facts.js`, `site/facts.json`, `law-numbers.js` extended, `--check` wired. Gate: `--check` passes.
3. **Home** and **Adopt** (hub, Build, Generate).
4. **Language** (How, Refusal, A language declared, Conformance, Status).
5. **Law** (Why, The rules, offences renamed, cultures renamed, How the law changes).
6. **Media and Audit** (the seven pages).

At every commit: the UI audit on every page, before and after, in a browser; `pack.js --check`; conformance 73 of 73 (it does not move: no law, verifier, fixture or contract changes). Nobody has looked at the redesigned site until the Principal does; the outbox memo says **projected, not verified by a person** until then.

---

## 10. Questions for Central

1. **The livery.** Keep the StzZui indigo and garnet cultures and take only the form of the Compass look (this design), or take stzsite's palette too, which would make the two Softanza sites look like one?
2. **File names.** Keep every existing path and carry the section in the rail (this design), or move to section directories and leave redirect stubs at the old paths?
3. **The five labels.** Language, Law, Media, Audit, Adopt. A reader of "Law" may expect only rules; the Why page and the cultures page sit inside it for that reason. Is a sixth reading, putting "Why" first as its own entry, worth breaking Rule 27 for? This design says no.
4. **The grammar artefact.** Produce `haro/zui.gbnf` from the forge in step 2 so the page can link it, or leave the claim as measured and unlinked?
5. **`decides.json`.** Add the small data file naming the three rules the screenshot audit can decide, so that figure is derived like the others?
6. **The cost.** This is about 19 new or rewritten pages and a facts script, built in six commits. Say if the scope should be cut, and the order in section 9 will cut from the end.

**Held and stated as held on the site, not advanced:** Q5 to Q7, rules for haptic, luminous, signage, spatial and terminal, one subject on one page (READINGDEPTH B3), `ROLE-REASON-01`.
