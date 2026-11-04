# The StzZui website, second plan: navigation, narration, presentation, adoption

**Status: a plan, on the author's word (2026-11-04), after three pieces of the first plan were built.** It changes
four things the first plan (`SITE.md`) and its rulings got wrong or did not reach, and it keeps everything else: the five
entries, every file path, the facts check, the gates. Where this plan and `SITE.md` disagree, this plan is right and
says so. Nothing in it is built yet; the pieces of section 8 are the build.

**The author's instruction, in his words**, so the plan can be checked against it:

> *navigation: learn from the last versions of Softanza site, Harobanda, etc. Let the submenus be fixed horizontally under the main menu, and only a third-level menu be vertical to the left (and in this case use all the width of the page); the code snippets must not be very large, only if they have large content; and they are not nice since they are so dark, which is intrusive to the eye; avoid the next and past links on the bottom.*
> *narration: put yourself in the place of the reader and enhance the heroes, the clarification messages, the visual examples and diagrams, the call to action, and practical workflows; the idea of a systematic grid of UX analysis as a framing concept and practice; the positioning against established practices and frameworks; the true innovation in the UX and HCI field.*
> *presentation: a demo mode to present the system to a user profile (a UX designer, a product designer, a programmer, etc.).*
> *adoption: the practical technical adoption in Softanza and other languages and frameworks, with a quick-win report that shows the ease and the power of the innovation.*

---

## 1. What was learned from the two sites, by reading their files

Read on 2026-11-04: `stzsite/assets/css/site.css` and `en/zui.html`, `harobanda/site/agents.html` and `styles.css`,
`stzsite/README.md` (the tour) and `harobanda/site/PEDAGOGY.md`. Nothing there was changed.

| what they do | where | what the StzZui site does today | what this plan does |
|---|---|---|---|
| **Main menu sticky; the section's pages in a second horizontal bar under it, also sticky**, on its own band (`nav.path`, `.path-in`), the current page in the accent and bold | both sites | level 2 is a vertical rail on the left | **the same two sticky bars**; the rail goes |
| **A third level, only where a page has a family, as a vertical list on the left** (`nav.level2.rail` on stzsite), sticky under the two bars, the page then using the full width (`maxw` 1180) | stzsite, the areas and the course | level 3 nested in the rail | **the left list only where a third level exists, and the page then takes the full width** |
| **Code on a light panel**: paper ground, panel background, hairline border, `pre-wrap`, the block as wide as its content needs | stzsite (`pre`, `.run`, `.vs`) | dark indigo blocks, full column width, sideways scroll | **light panels sized to content**; the terminal keeps a left rule, not a dark ground |
| **No next/previous links**; the bars are the navigation | both sites | a next/back pair at the bottom of every page | **removed** |
| A **presentation mode**: `tour.html`, 13 scenes, arrow keys and space advance, `n` toggles notes, `Escape` opens the scene as its page, the scene number in the URL | stzsite | none | **a tour, by reader profile** (section 6) |
| Devices for narration: a **before/after pair** (`.vs`: another tool on the left, Softanza on the right, both with output), a **scene** (one big example with a run), **labelled runs** (`.run` with `.lbl` and `.out`), inline diagrams | stzsite | one example on the home page, no diagram anywhere | **the pair, the scene, the labelled run and four diagrams** (section 3) |
| A **pedagogy review written against one reader** who pattern-matches fast and categorises before he reads | harobanda `PEDAGOGY.md` | none | **each page written against a named reader and his first wrong box** (section 3) |

**Rule 120 at v3.13 allows exactly this.** Two horizontal levels are lawful where the second is a visibly distinct, fixed surface of at
most five entries, and the third turns vertical on the left. The first plan chose the vertical rail for level 2 because it could; the author
has now chosen the band, which is what the amendment was written for (prompt 53). **Rule 27** then binds the second bar to five entries
too, and every section below fits in five.

---

## 2. Navigation, restated

```
[ StzZui ]  Language   Law   Media   Audit   Adopt                        Style [✓Modern] [Retro]   ← sticky, row 1
            ─────────────────────────────────────────────────────────────────────────────────────
            Why a law   The 123 rules   What a violation feels like   Two cultures   How it changes  ← sticky, row 2, the section's pages
            ─────────────────────────────────────────────────────────────────────────────────────
 Stillness  │
 Forms      │   The page, using the full width when a third level is shown
 State      │
 …          │
```

- **Row 1** is the five entries (Rule 27) and the culture switch. **Row 2** is the section's pages, at most five (Rule 27 again), a
  distinct fixed band (Rule 120). Both stick; the page scrolls under them. On a phone each row scrolls sideways on its own and the switch
  takes its own row, as built in piece 1.
- **Row 3, the vertical list, exists only where a page has a family**: the seven offence families under *What a violation feels like*, and
  the profiles of the tour. Where it exists, the layout is a two-column grid at the full page width (`maxw` 78rem, as stzsite's 1180px),
  not the 48rem measure. Where it does not exist, the page is one column at the reading measure. **No fourth level.**
- **The path (Rules 108, 115)**: every depth is marked by exactly one always-visible surface (the menu, the band, the list), so no
  visible trail is owed; the hidden `nav[aria-label="Breadcrumb"]` landmark stays on every page. The band is identical on every page of
  its section and the list identical on every page of its family, which the audit's bar-persistence check enforces.
- **Removed**: the next/back pair at the foot of every page; the rail. **Kept**: the culture switch as a segmented control (Rule 106),
  the hidden landmark, `site-shell.js` as the one definition of all three rows, its check, the asset hashes.

**The sections and their bands** (five or fewer each; file names unchanged from `SITE.md`, so no link breaks):

| entry | band (row 2) |
|---|---|
| Language | What it is · What it refuses · Declared in Haro · Conformance · Status |
| Law | Why a law · The 123 rules · What a violation feels like · Two cultures · How it changes |
| Media | Ten media · The grid · The proof |
| Audit | The painted page · Screenshots · A quick win |
| Adopt | Which way in · Build · Generate · Softanza · Other languages |

**Code blocks.** `pre` becomes a light panel: `var(--card)` on paper, a hairline border, the reading measure's font, `white-space: pre-wrap`
so nothing scrolls sideways, and `width: fit-content; max-width: 100%` so a three-line declaration is three lines wide. A terminal keeps a
4px left rule in the muted ink and the same light ground; the words *error* and *clean* keep their colour, which is the signal (Rule 118). In
**Retro**, the terminal culture, blocks stay what a terminal is: that culture is the exhibit, not the default. Rule 114 then has nothing
to report, by construction.

---

## 3. Narration: one reader per page, and five devices

**The method, from `PEDAGOGY.md`:** name the reader, name the box he will put the thing in before he reads, and write the page so that the
box breaks in the first screen. Then count: how many screens before the first example, before the first number with its source, before the
first thing he can run. The counts go in the piece's memo, so the narration is reviewed and not felt.

**The reader of each page** (the seven of `SITE.md` section 2, now with the box each arrives holding):

| reader | the box | what breaks it, in the first screen |
|---|---|---|
| builds business software | "a UI framework, or a linter" | a declaration with no widget in it, refused by a law with a number |
| designs, cares about UX | "another set of guidelines" | a guideline cannot refuse anything; here is one that did, at design time |
| builds with AI | "a prompt pack" | a grammar the decoder cannot leave, and a court that still says no |
| ships off a screen | "web-only, as always" | one declaration, a print rendering and a voice rendering, and the verb print refuses |
| judges an app he does not own | "a checklist" | a screenshot reduced to numbers, three verdicts, and everything else marked *not audited* |
| designs a language | "a DSL" | the language is itself a declaration, and its court was forged from it |
| implements elsewhere | "a spec to read" | a suite that says yes or no, a list of known differences that can only shrink |

**The hero formula**, every page: an eyebrow naming the section and the reader; a title that is the page's one question or its one claim; a
sub that says what the reader leaves with and names the limit in the same breath; **one call to action** that is the first thing he can do
(open the audit on his own page, run one command, press F2, start the tour as his profile). Never two calls.

**Five devices**, each a reusable block in `stz.css` with a name:

1. **The pair** (`.pair`): the established practice on the left, Zui on the right, same case, both with their outcome. *Nielsen heuristic
   "user control and freedom" on the left, a sentence; `MISSING_UNDO` on the right, a refusal with a rule.* Used on Why a law, Positioning,
   Generate.
2. **The scene** (`.scene`): one large worked example that runs: a declaration, the run, the refusal, the fix, the clean run. Re-run by
   `site-facts.js` like the ninety seconds. Used on Language, Build, the quick win.
3. **The grid** (`.cells`): the coverage grid drawn as cells, every live cell linking to its rules, empty cells drawn empty. The one object
   the whole site turns on (section 4). Used on the Media section's centre page and on the home.
4. **The diagram** (`.figure`): inline SVG, both cultures, no external file. Four to draw: *the pipeline* (declare → refuse → project →
   measure), *the two courts* (zui.stzu → forge → court and grammar; zui.js beside it; the list of differences between), *one declaration, ten
   media* (a declaration fanning out to renderings, two of them refused), *the three moments* (design, development, runtime, with the instrument
   at each). Each carries a one-sentence caption that says what it does not show.
5. **The workflow** (`.workflow`): a numbered sequence of real commands and real outputs for one practical job, each step with the file it
   touches. Used on Build, Softanza, Other languages, the quick win.

---

## 4. The grid as the framing concept, and the positioning

**The claim the site makes, stated once and carried everywhere:** UX has methods for judging an interface after it exists (heuristic
review, usability testing, accessibility audit) and vocabularies for building one (design systems, component libraries, tokens). It has no
*systematic* account of what an interface must let a person do, across the media it may be rendered in, that a machine can hold it to before
it exists. The grid is that account: six things a person does, across ten media, with the law's rules placed on the cells and the empty cells
drawn empty. **A practice follows from it**: declare the surface, place it on the grid, let the law refuse what it refuses, project to each medium,
audit what was painted, and file every defect found against a cell so it either confirms the grid, extends it, or falls outside it.

**The page that carries it** (`site/grid.html`, the centre of Media and linked from the home's first screen): the grid drawn live from
`facts.json` and `coverage-placement.json`; the three counts with their files; the projection fixtures and their one gap; the issue record of
`COVERAGE.md` section 4 as the practice's unit; and, honestly, the placement review's figures (two blind readers, 6 of 31 and 10 of 33 exact)
as the measure of how far the placement can be trusted.

**Positioning against established practices** (`site/positioning.html`, in the Law section's band in place of nothing: it is the sixth page
of Law, so *How it changes* moves into *The 123 rules* as a section, keeping the band at five). One table, one row per practice, four
columns: what it is for, what it decides and when, what Zui takes from it, what Zui adds. The rows, each written from the practice's own
published definition and never from a caricature:

| practice | what it decides, and when |
|---|---|
| Nielsen's ten heuristics | judgment by an expert, after the interface exists; nothing is refused |
| WCAG 2.x | success criteria, some machine-checkable (contrast, names, structure), after rendering; Zui cites it through Rules 60, 62, 104 and the audit measures the same contrast |
| design systems (Material, Apple HIG, Fluent) | what a widget looks like and how it behaves; widgets first, intent nowhere |
| design tokens | the look as data; not the intent, not the rights |
| component libraries and Storybook | the components and their states; what a person is doing with them is not declared |
| accessibility linters (axe and the like) | machine checks on rendered markup; the audit's domain, with no law behind the findings |
| usability testing | the person's perception, which no instrument here replaces (`CENTRAL-PERCEPTGATE-01`); Zui's grid says where to test |
| model-based UI and task models (CTT, UIML, the ISO 24744 family) | the nearest ancestor: tasks and abstract interfaces; Zui's difference is the law as data, refusal by name, a conformance suite, and the medium axis as a closed enumeration with carriage |

**The innovation, stated as claims with evidence and not as adjectives** (`site/innovation.html`, the sixth of Language; *Status* moves
into *Conformance*): five claims, each with the instrument that shows it and the limit that bounds it: (1) intent, not widgets, as the unit of
declaration (the 22 verbs, the ten kinds); (2) the law as data, every finding citing it (the contract's bindings); (3) refusal before rendering
(the verifier, 46 refusing fixtures); (4) one declaration across media, with the gap drawn (the grid, `VERB_NOT_CARRIED`, the projection
fixtures); (5) the language declared, two evaluators and a ratchet between them (zui.stzu, the forge, 18 differences). And a sixth paragraph on
what is *not* shown to be innovative yet: no study, no user, no foreign application run end to end; the claims are structural and the evidence is
the repository.

---

## 5. Adoption: Softanza, other languages, and a quick win that is real

**Softanza** (`site/softanza.html`): what adoption inside Softanza is today and what it needs. Today: the law and the pack are files any
Softanza project can vendor; the audit runs on any page Softanza renders; stzsite is governed by the law and audited (its own Zui page says so).
Not today, and said so: no `.zui` reader in stzlib, no projection from a declaration to a Softanza surface, no court on rnxc (the forged
court runs; a Softanza-hosted one does not). The page states the three pieces as held and names where each would live, and asks nothing of a
sibling repository on this site.

**Other languages and frameworks** (`site/ports.html`): the port recipe as a workflow: vendor the pack, pin the hash, implement the grammar,
run the 73 fixtures at the level you claim, emit C2 envelopes, list your differences from the reference the way the twin ratchet does. Zing as the
first conforming consumer, with its claim and its level. What a port may and may not claim, from `protocol/README.md` section 5.

**The quick win** (`site/quick-win.html`, in Audit's band): **a report of one real afternoon, every figure read from the run.** The subject is
a surface that exists and that this repository can reach: stzsite's navigation (already governed by the law it caused to change) or Zing. The
workflow: (1) declare its three main surfaces in `.zui` (the files are checked in under `examples/quick-win/`); (2) run the verifier at level 2
and show the refusals and the fixes; (3) run the audit on the live pages in both cultures and show the counts; (4) place each finding on the
grid. The report says what it took in minutes, what was refused, what was measured, and what nobody looked at. `site-facts.js` re-runs the
declarations, so the report cannot drift from the verifier. **It is a quick win only if it is a real one**; if the afternoon finds nothing, the
report says the surface was already lawful and shows the runs.

---

## 6. Presentation: a tour by reader profile

`site/tour.html`, modelled on stzsite's: full-screen scenes, arrow keys, space and a click advance, `n` toggles the presenter's notes, `h` shows
the site header, `Escape` opens the current scene as its page, the profile and the scene number in the URL (`tour.html#designer/4`), so every scene
is an address. No animation (Rule 112): scenes cut.

**Profiles** are orderings over one shared pool of scenes, so a scene is written once. The first scene asks *who are you*, five answers, each a
row of the vertical list (the tour's third level): **UX designer**, **product designer**, **programmer**, **AI builder**, **decision maker**.
Each profile is 9 to 12 scenes: the box it arrives in and the scene that breaks it, the ninety seconds, the grid, the pair against its own
practice, one diagram, the quick win, the honest limits, and its call to action. Scenes are built from the same facts spans as the pages, so the
numbers in the tour are the numbers on the site. `deck-check.html` as on stzsite: every asset the tour needs, found or missing, from `file://`.

---

## 7. What stays from the first plan, and what it supersedes

**Stays:** the five entries and their labels; every existing path (the rail pages keep their files); `site-shell.js` as the one definition of
the shell, now rendering three rows; `site-facts.js` and `facts.json`, every figure a span; the hashed assets; the culture switch; the hidden
landmark; the audit at 0 on every page before and after; conformance untouched; `haro/zui.gbnf` and `decides.json`; the honesty rules (the
Second Founding *proposed, not ratified*; held things stated as held; *projected, not verified by a person* until the Principal looks).

**Superseded:** `SITE.md` section 3's vertical rail for level 2 (now a band), its next/back links (gone), section 7's dark code blocks (now
light), the page list (seven new pages: grid, positioning, innovation, softanza, ports, quick-win, tour, and the two band moves above), and the
six-piece build order of section 9.

---

## 8. The build, in pieces

Each piece one commit by path, each gated as before: the audit on every page before and after (0 and 0, both cultures), `site-shell.js` and
`site-facts.js` green, `pack.js --check`, conformance 73 of 73, and the narration counts in the memo. The count of typed numbers outside a span
fails the facts check from piece 10.

| piece | what | done when |
|---|---|---|
| 4 | **Navigation and code, the author's four points**: the band, the left list only at level 3 with the full width, light content-sized code, next/back removed; `stz.css` and `site-shell.js`; every page re-shelled, no content change | 21 pages at 0; the band identical across each section (the audit's check); a phone at 375 measured |
| 5 | **Narration devices and diagrams**: the five blocks in `stz.css`, the four SVG diagrams in both cultures, the hero formula; **Language** (What it is, What it refuses, Declared in Haro, Conformance with Status inside) rewritten against its readers | per-page counts: screens to first example, to first sourced number, to first runnable thing |
| 6 | **Law**: Why a law, The 123 rules (with How it changes inside), the offence families, Two cultures, **Positioning** | the positioning table, every row from the practice's own definition, cited |
| 7 | **Media**: Ten media, **The grid** as the framing page, The proof; **Innovation** | the grid drawn from facts; the five claims each with instrument and limit |
| 8 | **Adoption**: Which way in, Build, Generate (re-read), **Softanza**, **Other languages** | the workflows run; what is held stated as held |
| 9 | **The quick win**: `examples/quick-win/`, the runs, the report page | every figure from the run; re-run by the facts check |
| 10 | **The tour** and `deck-check.html`; the unchecked-numbers count becomes a failing check; the Principal's look | five profiles, each 9 to 12 scenes; the audit on the tour page; a person has looked, and said what |

Pieces 5 to 8 touch different pages and may be reordered. **The Principal looks after piece 4** (the shell is the thing a reader meets first)
and at the end.

---

## 9. Questions for the author, each with the answer this plan takes if none comes

1. **The quick win's subject:** stzsite's navigation (reachable, already governed) or Zing (a consuming application)? *Taken: stzsite, because
   this repository can run the audit on it today; Zing if its pages are reachable from here.*
2. **The tour's profiles:** the five above, or others (an executive, a regulator, a student)? *Taken: the five.*
3. **Diagrams:** inline SVG drawn by hand in both cultures (no external tool, no raster), or images produced elsewhere? *Taken: inline SVG.*
4. **Positioning's rows:** the eight above, or a shorter list? Each row costs a careful reading of the practice's own text. *Taken: the eight.*
5. **Softanza adoption:** the page states what stzlib would need (a `.zui` reader, a projection, a court on rnxc) as held. Should those three be
   asked of the stzlib desk through Central now, so the page can say *asked* rather than *held*? *Taken: stated as held; asking is Central's.*
