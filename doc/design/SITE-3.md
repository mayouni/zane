# The site, third plan: the delta on SITE-2, after the Principal's first look

**Status**: proposed, for Central's read. Nothing in `site/` changes until Central rules. **Written 2026-11-04** by the StzZui desk, in answer
to Central's NOTE of 2026-11-04 17:30. It supersedes `SITE-2.md` only where it says so (section 10); everything else in SITE-2 stands.

**What the Principal looked at**: the home page at desktop width, in Modern, with three marks on it (the style switch, the title, the button).
His words are in Central's NOTE, typing kept; section 1 answers each by number. Central's header says seventeen points. **I count sixteen
bullets in the NOTE.** The NOTE is the record, so all sixteen are answered; if a seventeenth exists in his chat, name it and I add it.

**A mock to look at, not read**: [`mock/front-3.html`](mock/front-3.html) is the proposed front page. Serve the repository root and open
`doc/design/mock/front-3.html`; press F2 for Retro. It uses the author's photograph, kept at `site/assets/niamey-national-museum.webp`.

---

## 1. His sixteen points, by number

| # | his words, shortened | the answer | where it is built (section 9) |
|---|---|---|---|
| 1 | the first page is so dense; make a front page with the main messages, details in other pages | The front page becomes a photograph, one title, one line, one action, then six short messages and one "present it" strip, each linking the page that holds the detail. The ninety seconds, the numbers and the four new things leave it. The mock is **2.6 screens at 1280** (budget: three). Section 2 | piece A |
| 2 | style change in a combo, to the bottom right | A `select` with Modern and Retro, at the right end of the footer, the current one shown; F2 stays. It leaves the bar, so the bar is lighter on a phone too. Section 5.1 | piece A |
| 3 | break the long title wisely on two lines | "The compilable language / for user interfaces", two block spans, held at every width where each line fits (about 480 px and up); below that the first line wraps and the title takes three. Section 5.2 | piece A |
| 4 | the button's text must be readable on its ground | Every primary button moves to **7:1 or more**: measured today 4.94:1 (dark text on the pink ground). Section 5.3 says what the audit did and did not do | piece A |
| 5 | copyright to Mansour Ayouni; licence MIT | Footer: "© 2026 Mansour Ayouni · MIT licence", linked to `LICENSE`. The file is already committed (`02be226`). Section 5.4 | piece A |
| 6 | the reader is in Law but reachable only from a link in the footer; all pages in the top menu | Every page sits on exactly one bar, the Reader in Law's band, and `site-shell.js` fails the build for a page off the bars or a footer link to a page the bars do not list. Section 3 | piece A |
| 7 | several pages have many sections and need their third-level menu on the left | A page with four or more sections carries them as the left list; a family page nests its sections under its own entry. Today seven pages qualify. Section 4 | piece A |
| 8 | "Media" is confusing | **Channels**, accepted. Section 6 | piece A (name), piece B (page) |
| 9 | I did not see the grid, nor how Zui compares to other frameworks and languages | The grid is on the front page and its own page; the comparison widens from practices to frameworks, description languages and token formats. Section 7.2, 7.3 | piece B |
| 10 | I did not see the demo mode | The tour moves forward: its own entry in the fifth band, and a strip on the front page with the five profiles. Section 7.8 | piece D |
| 11 | clear use cases for existing web applications and mobile apps | Two pages, each a workflow on a case, each saying what it yields today and where it stops. Sections 7.4, 7.5 | piece C |
| 12 | usefulness for non-usual apps: UI-less, conversational, voice | One page with three declarations run through the verifier, and the grid's honest gap beside them. Section 7.6 | piece C |
| 13 | I did not see the depth of the thinking | An essay, "The thinking", head of the first entry, sourced from the design documents, with the figures. Section 7.1 | piece B |
| 14 | etc!!! | Section 8: what a stranger still would not find, from walking the site as each of the seven readers and the five tour profiles | all |
| 15 | the Niamey photograph as the main photo of the front page | The hero of the mock; the file is copied to `site/assets/`, with its provenance beside its use. Section 2.3 | piece A |
| 16 | no Node; our own sole binary, with a JS or wasm alternative that runs only in the browser | `BINARY.md`, next to this file: design only, no code. The site keeps saying what the verifier needs today, and says so differently when the binary ships. Section 9, last row | track B |

---

## 2. The front page

### 2.1 What is on it, and nothing else

```
 ┌───────────────────────────────────────────────────────────────────────────────┐
 │ STZZUI   Approach   Language   Law   Use   Try                                 │  the bar: five entries, no switch
 ├───────────────────────────────────────────────────────────────────────────────┤
 │                                                                               │
 │            [ the photograph, full width, about one screen high ]              │
 │                                                                               │
 │   ┌───────────────────────────────┐                                           │
 │   │ The compilable language       │   translucent panel, bottom left,         │
 │   │ for user interfaces           │   text white at 80% panel                 │
 │   │ one line. one action.         │                                           │
 │   └───────────────────────────────┘                                           │
 ├───────────────────────────────────────────────────────────────────────────────┤
 │  ┌ Intent, not widgets ┐ ┌ A law that refuses ┐ ┌ One declaration, every ┐     │  six messages: a title,
 │  └─────────────────────┘ └────────────────────┘ └ channel ───────────────┘     │  one sentence, one link
 │  ┌ The whole ground ───┐ ┌ Beside what you ───┐ ┌ Use it on what you ────┐     │
 │  └ as a grid ──────────┘ └ already use ───────┘ └ have ──────────────────┘     │
 │  ┌ Present it to your team:  UX designer · Product designer · Programmer ··· ┐ │  one strip, five profiles
 │  What exists, what is designed, what is held: the status board                 │
 ├───────────────────────────────────────────────────────────────────────────────┤
 │ GitHub · Zing · LICENSE                                       Style [Modern ▾] │  the footer: the select, bottom right
 │ © 2026 Mansour Ayouni · MIT licence                                           │
 └───────────────────────────────────────────────────────────────────────────────┘
```

| block | the sentence | links to |
|---|---|---|
| hero | "Declare what a person is doing. A law refuses the rest, by name, before anything is drawn." Action: **See a refusal, line by line →** (`refusal.html`: it works with no install, because it shows a real run) | Language |
| Intent, not widgets | a person comes to discover, compare, act and undo; a declaration says that and the screen is a consequence | The thinking |
| A law that refuses by name | a flow with no exit, an act with no undo, refused with the rule, article and right | What it refuses |
| One declaration, every channel | a screen, a voice, a printed page, a machine reader; a channel that cannot carry a promise is refused | Channels |
| The whole ground, as a grid | what a person does against every channel, a rule on each cell that has one, empty cells drawn empty | The grid |
| Beside what you already use | heuristics, accessibility standards, design systems, UI frameworks and description languages, each read from its own page | The comparison |
| Use it on what you have | a web application, a mobile app, a voice line, an agent with no screen: what it yields today and where it stops | Which way in |
| Present it | a short tour, in full-screen scenes, ordered for who is in the room | The tour |

**Moves out**: the ninety seconds (to Language, as the opening of What it is, where the pair already is), the numbers and the four new things (to the
pages that own them: the figures are on Law, Language and Channels), the proof section and "what this site does not claim" (to The thinking's last
section and to the status board). **No figure on the front page**: a number is a claim and every claim has a page; this one has a link to the board.

### 2.2 The photograph, and the text over it

The panel follows stzsite's pattern (full-bleed image, translucent panel, text measured over the brightest part of the photograph at the worst end).
Measured on the file, in a browser, on 2026-11-04:

| quantity | value | how |
|---|---|---|
| the file | 1699 × 926, 382,022 bytes, sha256 `bbf131a9…c9780` | `sha256sum` of the copy in `site/assets/` |
| brightest pixel in the panel's region at 1280 × 735 | **pure white, luminance 1.00** | canvas read of the cover-fitted image |
| mean luminance of the same region | 0.42 | same |
| panel opacity needed for white text at 7:1 against that pixel | **0.71** | solved against panel colour `#121413` |
| panel opacity proposed | **0.80**, which gives about **10:1** against pure white | the mock |

The mock's comment records the figures beside the rule, as stzsite's `site.css` does. **Phone**: below 760 px the panel leaves the photograph and sits under it
on the page's own ground, as stzsite's does, so no text depends on the image.

### 2.3 The file

The photograph is copied to `site/assets/niamey-national-museum.webp`, **never read from `D:/tmp`**. The comment beside its use reads: *provided by the
author on 2026-11-04*, the title and the hash. Alt text: "The National Museum of Niamey: a white facade with blue geometric reliefs and a blue door, above terraced
stone steps with blue flower pots." It is 382 KB; the page's other weight is small, so the front page should stay under 500 KB (measured when it is built).

---

## 3. Every page on exactly one bar

### 3.1 The five entries

Rule 27 caps the menu at five and now binds each band. Central's suggestion, Approach · Language · Law · Use · Tools, fits. **One proposal: "Try" for
"Tools".** The fifth entry holds things a person runs or watches (the tour, the audit, the quick win, later the binary); a stranger reads "Try" as an
invitation and "Tools" as a toolbox. "Tools" is acceptable if Central prefers it; nothing else changes.

| entry (the menu) | its band (level 2, at most five) | level 3: a family, a vertical list on the left |
|---|---|---|
| **Approach** | The thinking · The grid · Channels · Comparison · Claims | |
| **Language** | What it is · What it refuses · Declared in Haro · Conformance | |
| **Law** | Why a law · The rules · The Reader · What a violation feels like · Two cultures | the seven offence families under *What a violation feels like* |
| **Use** | Which way in · Web apps · Mobile apps · Beyond screens · Your stack | Build · Generate · Softanza · Other languages, under *Your stack* |
| **Try** | The tour · UI audit · Screenshots · A quick win · *(The binary, when it ships)* | |

"Channels" sits in Approach, not Language: it answers *where a declaration is carried*, which is a part of the idea, and the Language band stays at four with
room for one.

### 3.2 The map

Thirty-five pages: 24 today, 11 new. "bar" is the surface that lists the page; it is always exactly one.

| file | label | bar | status |
|---|---|---|---|
| `index.html` | (the front page) | the brand link of the menu | rebuilt |
| `site/thinking.html` | The thinking | Approach band | **new** |
| `site/grid.html` | The grid | Approach band | **new** |
| `site/media.html` | Channels | Approach band | renamed (the file keeps its name), rewritten |
| `site/positioning.html` | Comparison | Approach band | extended |
| `site/innovation.html` | Claims | Approach band | **new** |
| `site/how.html` | What it is | Language band | as built |
| `site/refusal.html`, `site/haro.html`, `site/conformance.html` | What it refuses · Declared in Haro · Conformance | Language band | as built |
| `site/why.html` | Why a law | Law band | as built |
| `site/rules.html` | The rules | Law band | as built |
| `constitution/reader/index.html` | The Reader | Law band | **gets the shell** (3.3) |
| `site/gotchas/index.html` | What a violation feels like | Law band | as built |
| `site/gotchas/{stillness,forms,state,widgets,reading,navigation,intelligence}.html` | the seven families | the left list under the gotchas entry | as built |
| `site/vibes.html` | Two cultures | Law band | as built |
| `site/adopt.html` | Which way in | Use band | as built, re-aimed |
| `site/web.html`, `site/mobile.html`, `site/beyond.html` | Web apps · Mobile apps · Beyond screens | Use band | **new** |
| `site/stack.html` | Your stack | Use band | **new** (a short family head) |
| `site/build.html`, `site/generate.html` | Build · Generate | the left list under Your stack | as built |
| `site/softanza.html`, `site/ports.html` | Softanza · Other languages | the left list under Your stack | **new** |
| `site/tour.html` | The tour | Try band | **new** |
| `tools/ui-audit.html` | UI audit | Try band | as built (it already carries the shell's menu) |
| `site/audit.html` | Screenshots | Try band | rewritten (today a stub) |
| `site/quick-win.html` | A quick win | Try band | **new** |

### 3.3 The Reader

The Reader is a self-contained page with its own styling. It must be on a bar, so it takes the shell: the same `shell:menu` and `shell:trail` regions and
Law's band, and loads `stz.css` for the bars only, scoped so that the Reader's own rules stay as they are. **Risk**: the Reader obeys the law it displays
and its look is its own; adding the bars changes its first screen. **Default**: do it, show the Principal the first screen before the commit. If he
prefers the Reader unchanged, the alternative is a Law-band entry that links to it and a Reader that carries only the menu, which still satisfies
the rule, because the rule is about the entry, not the look.

### 3.4 The check, in `site-shell.js`

Three failures, each naming the page:

1. **A page off the bars.** The registry lists every `.html` the repository serves under `index.html`, `site/`, `tools/` and `constitution/reader/`; a file
   not in the registry fails, and a registered file that no band or list renders fails.
2. **A page on two bars**, or on none, and a band of more than five (already built).
3. **A footer link to a page the bars do not list.** The footer may link external addresses and `LICENSE`; an internal page there fails.

The audit's bar-persistence check (Rule 115) stays as it is and now runs on the Reader as well.

---

## 4. The third level, for long pages

**Threshold: four or more `h2` sections.** Counted on the tree today: `why` (7), `build` (6), `generate` (5), `rules`, `refusal`, `how` and `haro` (4 each). The three-section
pages (`positioning`, `conformance`, `adopt`, `vibes`) stay without a list until they grow, which is correct: a list of three costs a column and saves nothing.

- **What it is** (moved to the right of the page by the Principal, 2026-11-04; a family list stays on the left): a list in the page's side column, generated by `site-shell.js` from the page's own `h2` ids (a new fenced region `shell:sections`, checked
  like the others), so the list cannot disagree with the page. A small script marks the current section as the reader scrolls (`aria-current`), and the list is sticky below the bars.
- **Family pages**: the family is the list; the page's own sections nest under its entry, one level, so there is still one list and no fourth level.
  Rule 115 holds: every depth is on one surface.
- **Phone**: the list becomes a disclosure at the top of the page, closed.
- **The page then takes the full width**, as SITE-2 says.

---

## 5. The four controls the Principal marked

### 5.1 The style select

Rule 106 at v3.13 allows a select; both states are named in its options and the current one is the one shown. It sits at the **right end of the footer**
(his "bottom right of the page"), labelled *Style*. **Considered and not proposed**: a select fixed to the corner of the window, because anything fixed over the content can mask it (Rule 121's reasoning,
for an interface instead of an assistant). F2 stays; the choice persists as it does now. The audit's culture check changes from "two buttons" to "a select with both options".

### 5.2 The title

Two block spans, one per line, in the markup and not by width. The mock measures the hero title at `clamp(1.9rem, 3.2vw, 2.7rem)` in a 40 rem panel: two lines at 1280,
and at 375 the first line wraps (three lines). **The width at which two lines hold is about 480 px**; below it the title is allowed three.

### 5.3 The button, and what the audit did

Measured today: the primary button is `#1c0710` on `#e04a6e`, **4.94:1**. The audit computed it correctly: it reported **2.23:1** on this very button
when a header rule overrode its text colour (a real defect, fixed in piece 5), and **passed 4.94** afterwards, which is arithmetic that is true. The finding is about the **bar, not the arithmetic**:
4.5 is the floor below which text fails (Rule 105), and Rule 105 itself says long-form prose aims for 7:1. A bold white-on-pink or dark-on-pink label sitting just over 4.5 is lawful and, to this
reader, tiring. So: (a) **every primary button at 7:1 or more**: white on `#8f1d3d` is **8.7:1**, white on `#7a1633` is **10.6:1** (the mock uses the second on the photograph);
in Retro the ground `#46e07f` with `#060b07` text is **11.6:1**; (b) the audit gains a **strict-mode check, "interactive text under 7:1"**, listed beside the existing strict small-text check, so a button that
is lawful and tiring reads as a finding in strict mode. That is a change to a tool, not to the law. **For Central**: whether 7:1 for controls should become a rule is the Principal's, and is not proposed here.

### 5.4 The copyright

Footer: "© 2026 Mansour Ayouni · MIT licence", the licence linked to `LICENSE`. `README.md` and the protocol README say the same in one line. Anything on the site that reads "a Softanza project"
as ownership is reworded to a statement of relation, which the Principal rules.

---

## 6. "Media" is renamed "Channels"

Accepted as Central recommends. A stranger reads "Channels" as an answer: where a declaration is carried (a screen, a voice, a printed page, a machine reader). I considered and rejected
*Surfaces* (reads as screens only, and the grammar already has `SURFACE_AS`), *Outputs* (misses that a channel also carries the person's input) and *Carriers* (obscure). The page says once, at its head,
that **a channel is what the language and the law call a medium**: the keyword is `SURFACE_AS`, the codes are `UNKNOWN_MEDIUM` and `VERB_NOT_CARRIED`, the data file is `media.json`, and none of these change. The site's
prose, labels and the nav say "channels"; the quoted law and the diagnostics keep their words and are glossed where they appear. `facts.json` keys (`media.count`) are internal and keep their names.

---

## 7. The new and changed pages, each against its reader

Every page follows SITE-2 section 3: a hero with a promise (and, until the author ruled otherwise on 2026-11-04, one action: now only the front page has one), a pair against the practice it replaces where one exists, a figure where a figure explains, the limit in the page and in the caption, the
three counts in the memo. **Every number is a span; the unchecked-numbers check becomes a failure in the last piece** (as SITE-2 piece 10 says).

### 7.1 The thinking (head of Approach), for a designer who wants the reasoning

An essay, not a list; a left list of its sections (this is point 7's showcase). Sections, each with its source:

1. **The inversion**: intent before widgets. A person does not come to click a button. (`ARCHITECTURE.md` §1; `THE-INTERACTION-MODEL.md` §1 to §3.)
2. **Why twenty-two verbs, and six activities**: the grammar is closed so that a coverage matrix over channels is finite; the six families carry the invariants. (`ARCHITECTURE.md` §2; the grid's `facts`.)
3. **The rights and the articles**: seven articles, six rights, and why a rule is a case of a principle. (`rules.json`; this site's Rules page.)
4. **One declaration, many renderings, one law**: the sentence and the function behind it. (`THE-INTERACTION-MODEL.md` §3 to §5.)
5. **The senses, and the actuators**: why a lamp and a valve are channels, what the closed twenty-two survive. (`SENSORS-AND-ACTUATORS.md` §1 to §6.)
6. **The culture axis**: Article VI, and two cultures of one truth. (`THE-SECOND-FOUNDING.md` v0.4 culture axis, marked **proposed, not ratified**; the live exhibit.)
7. **What is a declaration of style**: stzSense, why CSS is emitted and never authored. (`STZSENSE.md` §1, §12; marked as a verdict of that document.)
8. **The seams, and what is still open**: the twin court's eight seams, the held channels, the status board.

Each section: 250 to 400 words, one figure or one run, one link to its source document. **Limit**: the essay reports the project's own design reasoning; it is not a study. Sources that are proposals are labelled so
beside every use. **Reader**: the designer and the language builder. **Estimated length**: 6 screens.

### 7.2 The grid (Approach), for anyone who asked "what does it cover?"

The systematic coverage grid drawn live from `facts.json` and `coverage-placement.json`: six things a person does against ten channels, **55 live cells, 20 with a rule, 35 with none**, the rules placed on cells, the empty
cells drawn empty and labelled. Under it: the projection fixtures and their one gap; the placement review's own figures (two blind readers placed the rules and agreed exactly on 6 of 31 and 10 of 33, which says how far the placement can be trusted);
the issue record of `COVERAGE.md` §4 as the practice's unit ("a defect found on a cell either confirms the grid, extends it, or falls outside it"). **The practice that follows**: declare, place on the grid, let the law refuse, project, audit, file the defect against a cell.
**Instrument**: `coverage-count.js`. **Limit**: designed and measured; no person has perceived any channel for this grid. **Also on the front page as a message** (point 9).

### 7.3 Comparison (Approach), for a person who knows the field

**The existing Positioning page, widened.** Three tables under one claim, "in the sources we read", with the list of sources at the foot:
(1) **practices** (the eight rows already built); (2) **UI frameworks**: React, SwiftUI, Jetpack Compose, Flutter, each from its own documentation, each fairly (what each decides, in code, at build or run time, and what it does not
claim to decide); (3) **description languages**: UIML, XForms, VoiceXML, SCXML and statecharts, ConcurTaskTrees, and **token formats** (the Design Tokens Community Group draft). A fourth short row names **ISO/IEC 24744** as read and left out
(its scope is methodology metamodels), as it is today. Same rules as before: paraphrase, link, quote nothing, "in the pages listed here". **This page will have more than four sections, so it takes the left list.** Method for the new rows is the one used for the first eight:
fetch the project's own page, read it, write what it says it is for and when it decides, and say what was not read. **Limit**: a comparison written by the language's own authors; a reader who knows a row is unfair is asked to say so.

### 7.4 Web apps (Use), for a team with a web application already in production

A workflow on one real case, **stzsite's navigation**, which is already governed by the law it caused to change and is another desk's repository, read only: (1) declare its three main surfaces (checked-in `.zui` files, the headers saying they describe pages StzZui does not own);
(2) run the verifier at level 2, show the refusals and the fixes; (3) point the UI audit at the live pages in both cultures and show the counts; (4) place each finding on the grid. The page says what it took, what was refused and measured, and what nobody looked at.
**What it yields today and where it stops**: the declarations are written by hand (no importer from a DOM exists); the audit needs the pages served same-origin, which on someone else's application means serving a copy or a reverse proxy; the report states stzsite's
two open findings as findings of the audit and not as stzsite's agreement (SITE-2 correction 4). **Instrument**: `site-facts.js` re-runs the declarations. **If the afternoon finds nothing, the report says the surface was already lawful and shows the runs.**

### 7.5 Mobile apps (Use), for a team with an iOS or Android application

There is no DOM to measure, so the instrument is the **screenshot audit** (`AUDIT-FACTS.md`): a screenshot is reduced to facts and judged against the three rules a screenshot can decide; everything else reads *not audited*, never *passed*.
The page is a workflow: declare the screens from the application's own flows (`.zui`), run the verifier, then reduce screenshots to facts and run the decisions. **What it yields today**: the declarations check; the facts file's shape and arithmetic are checked by
`check-facts.js`; **the writer that reduces a real screenshot to facts has not been run on a real application**, so the page cannot show a real mobile run. **Question for Central** (section 9): which application, and whose, is used as the case; until then the page
shows a **labelled example** (a made-up declaration of a typical flow) and says the second half is designed and not run.

### 7.6 Beyond screens (Use), for conversational, voice and UI-less applications

One page, three cases, each a declaration run through the verifier; **the outputs below were run on 2026-11-04** and will be re-run by the site's check:

| case | declaration, in short | what the verifier says |
|---|---|---|
| a voice line (check a balance) | `SURFACE_AS voice`, `SATISFIES [UNDERSTAND, ZOOM]` | `VERB_NOT_CARRIED  ZOOM in check_balance on voice`, citing Rule 82 |
| an agent that places orders, with no screen | `SURFACE_AS machine`, `SATISFIES [SELECT, CONFIRM, ACT]`, `ALWAYS_REACHABLE [UNDO, EXIT]` | `MISSING_CANCEL  place_order`, citing Rule 26: the agent can act and cannot abandon |
| a lobby sign that also acts | `SURFACE_AS signage`, `SATISFIES [LOCATE, DISCOVER, ACT]` | `VERB_NOT_CARRIED` for ACT and EXIT on signage, and the undo and cancel it also lacks |

Under them: what the **voice, auditory and machine** channels carry, native, degraded or absent, from `media.json`; the signal vocabulary and what a channel can render (`SIGNAL_UNPERCEIVABLE` is found on a case at build time); **Rules 121 and 124** for agent surfaces,
which are the two rules this repository has for that channel; and **the grid's honest gap for these channels**, which cells have a rule and which do not (every cell of haptic, luminous, signage, spatial and terminal has none). **Limit**: the verifier checks the declaration; whether a voice line is *heard* as intended
has no instrument here (`CENTRAL-PERCEPTGATE-01`), and the page says so.

### 7.7 Your stack (Use): Build, Generate, Softanza, Other languages

A short family head, with the list on the left. **Softanza** says what adoption inside Softanza is today (the law and pack are files a project can vendor; the audit runs on any page Softanza renders) and what it is not (no `.zui` reader in stzlib; no projection from a declaration to a
Softanza surface), as held, asking nothing of a sibling repository. **Other languages** is the port recipe as a workflow (vendor the pack, pin the hash, implement the grammar, run the 73 fixtures, emit the C2 envelope, list your differences as the twin ratchet does), Zing as the first conforming consumer with its claim and its level.
Build and Generate keep their content, re-aimed under the list.

### 7.8 The tour (Try), for presenting it to a profile

As SITE-2 section 6: full-screen scenes, arrow keys, `n` for notes, the profile and scene number in the URL; five profiles over one pool of scenes: **UX designer, product designer, programmer, AI builder, decision maker**, nine to twelve scenes each, every scene built from
the same fact spans as the pages. **Its front-page appearance**: a strip with the five profile names as links, "Present it to your team", and an entry in the Try band: the hero keeps one action only. No animation (Rule 112). `deck-check.html` as on stzsite is a check page and joins the Try band's
list only if it is shown to a reader.

### 7.9 Claims (Approach), the innovation, stated with its limit

Five claims, each with the instrument that shows it and the limit that bounds it, **and a sixth paragraph on what is not shown**: no study, no user, no foreign application run end to end. **The word "innovation" appears only on this page, and the limit sits within one screen of it** (SITE-2 correction 5, carried). **Reader**: the decision maker.

### 7.10 The quick win and the screenshots (Try)

As SITE-2 section 5, unchanged in substance: the quick win is one real afternoon on a real surface, with every figure read from a run; the screenshots page presents the screenshot audit as the tool for an application nobody on this project owns, with its limit stated first.

---

## 8. "etc!!!": what a stranger would still not find

**Method.** I walked the site as each of the seven readers on the front page, from the front page, counting clicks to the first thing that reader can do, and found where the walk breaks. Today's site, then the proposed one.

| reader (the card on the home page) | today | after SITE-3 |
|---|---|---|
| builds business software | home → Build: **2 clicks**; needs Node | home → Use → Web apps: 2 clicks, and a real case |
| designs, or cares about UX | home → Why a law or Positioning: 2 clicks; the grid and the comparison are not on the front | home → The grid or Comparison: **1 click** |
| builds with AI | home → Generate: 2 clicks | home → Use → Your stack → Generate: 3 clicks (the list), or the "Use" message: 2 |
| ships where there is no screen | home → **Media: a stub** that says its pages are "not written". **A dead end.** | home → Use → Beyond screens: 2 clicks, with real runs |
| judges an application they do not own | home → Audit: **a stub** that links the tool and says the screenshot audit is not presented | home → Try → Screenshots: 2 clicks, with its limit first |
| designs a language | home → Declared in Haro: 2 clicks | unchanged |
| implements StzZui elsewhere | home → Conformance: 2 clicks; **no "other languages" page** | home → Use → Your stack → Other languages: 3 clicks |

**The five tour profiles** (UX designer, product designer, programmer, AI builder, decision maker): **today none has a path**, because there is no tour. Each would be a nine to twelve scene path in SITE-3.

**What else a stranger would not find, in the order I would fix it:**

1. **Two dead ends today**: Media and Audit are stubs. Both are rewritten by this plan (Channels, Screenshots).
2. **Names.** Nothing says in one place what *StzZui*, *Zui*, *Zing*, *Haro* and *Softanza* are to each other. The front page says "Zui" in the old hero and the footer says "StzZui". A short "names" section on *The thinking* (and a line in the footer's *About*) fixes it; the front page uses one name.
3. **What does it need to run?** Today the answer is "Node", said on six pages. After the binary (BINARY.md) it is "one file". Until then the front page should not say it; the pages that need it say it once, where it matters.
4. **The design documents are invisible.** The thinking lives in `doc/`, 50-odd files, reachable only through GitHub. *The thinking* links the seven that matter, each marked ratified or proposed, and a plain "all the documents" list at its foot.
5. **No "get it".** The pack is twelve files and a manifest; nothing on the site says "download this". *Other languages* carries the list with sizes and the one command that checks them.
6. **No about, no contact, no way to say "your row is unfair".** Positioning and the status board both ask readers to correct them, and there is nowhere to do it. Proposed: an *About* line in the footer to the repository's issues, and the licence.
7. **English only.** The site's own Rule 122 says language is data; the site is not. This plan does not translate it and says so on *About*; the author speaks French and should rule whether a French site is wanted.
8. **No search.** Thirty-five pages with a band each is findable by walking; if the Principal wants search it is a small index file and a box, not proposed here.
9. **The Reader is a different world** (its own look). Section 3.3.
10. **The numbers on the front page, of which there were many, were not the problem; there was no hierarchy.** The six messages are the hierarchy; the numbers live where they are sourced.

---

## 9. Order of work, and what Central rules

SITE-2's table of pieces is replaced from piece 7. Each piece is commits by path, local, the audit in both cultures before each, the three counts in each memo, one outbox memo, stop for Central's read.

| piece | content | gate |
|---|---|---|
| A. **the frame** | the five entries and bands; the footer with the style select and the licence line; the page-on-a-bar check in `site-shell.js`; the Reader takes the shell; the left section list; the title, the button at 7:1, the photograph and the new front page; "Channels" in labels | the audit at 0 on the new page count in both cultures; the check demonstrated by breaking it; the front page at three screens or fewer |
| B. **approach** | The thinking, The grid, Channels, Comparison widened, Claims | each claim sourced; every comparison row read from its own page; the grid drawn from facts |
| C. **use** | Which way in re-aimed, Web apps, Mobile apps, Beyond screens, Your stack with Softanza and Other languages | every declaration shown is re-run by the site check |
| D. **try** | The tour, Screenshots, A quick win | the tour from `file://`; the quick win's figures from the run |
| E. **close** | the unchecked-numbers check becomes a failure; the final walk of the seven readers and five profiles | 0 unchecked, the walk table filled |
| track B | `BINARY.md` read, ruled; then the build in its own order | outside this plan |

**What Central rules** (defaults taken if Central is silent, marked *):

1. The five entries, and **"Try" for "Tools"** (the default is Central's "Tools").*
2. The Reader takes the shell, the Principal sees its first screen before the commit.*
3. **7:1 for every primary button**, and a strict-mode audit check for interactive text under 7:1. Whether 7:1 for controls becomes a rule is the Principal's.*
4. The **mobile case**: which application, and whose, is the real case. Until named, the page shows a labelled example and says the screenshot step has not been run.*
5. **French**: whether a French site is wanted (this plan builds none).*
6. Whether to use **stzsite's navigation** as the web case (read only, with its desk's two findings stated as findings of the audit, and the declarations headed as StzZui's).*
7. Central's header says seventeen points; I count sixteen bullets.

---

## 10. What this supersedes in SITE-2

| SITE-2 | now |
|---|---|
| section 2, the five entries and their bands (Language · Law · Media · Audit · Adopt) | section 3 here |
| the culture switch as a segmented control in the bar (Rule 106) | a select in the footer, section 5.1 |
| the home page of SITE-2 section 3, "the ninety seconds" as its first screen | the front page, section 2 |
| the tour listed last (piece 9 or 10) | piece D, and on the front page |
| section 8, pieces 5 to 10 | section 9 here, from piece A |
| pieces 1 to 6 (built) | unchanged |

Everything else in SITE-2 (the narration devices, the pair, the figure, the counts, positioning rules, adoption, the reader profiles) stands.
