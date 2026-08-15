# The evidence ledger

**What this is.** Findings are arriving faster than they are being written down. This
captures each one with its **date, source and verification status**, so the book is written
from a record rather than reconstructed from memory — and so that a claim which turns out to
be wrong can be found and corrected rather than quietly repeated.

**Home**: `stzzui/doc/` for now. If the book gets its own repository, this moves with it.
**Opened**: 2026-08-13.

## The rules of this ledger

1. **Append, never rewrite.** The law's discipline applied to its own research: an entry
   records what was found and when. If it is later falsified, add a correcting entry and
   link them. Do not edit the original.
2. **Every entry carries a status**, and the third one is the important one:
   - **`verified`** — checked directly in the tree or the artifact by this project.
   - **`reported`** — established by a research pass with a cited external source.
   - **`unverified`** — stated at the level of the scheme, not the clause. **Nothing marked
     `unverified` may be printed as fact without being checked first.**
3. **A claim a machine can check must be generated from the artifact**, not copied here.
   Counts and tier tables belong in code that reads `rules.json`; this ledger records *that
   they were measured, when, and against which version*.
4. **Record the corrections too.** §J exists because a project that argues about drift and
   hides its own errors has refuted itself.

---

## A · The enforcement gap — the law's own data

| # | Finding | Evidence | Status |
|---|---|---|---|
| A1 | **8% of the law is refusable before a pixel exists.** 118 rules: 9 `machine`, 5 `tool`, 25 `machine-later`, 79 `judgment` | measured against `rules.json` **v3.8**, 2026-08-13 | `verified` |
| A2 | Of the 25 `machine-later` rules, **all but one are expression rules** — colour, layout, widget role, message, motion, timing. The exception, Rule 26, is already cited by `MISSING_CANCEL` | same measurement | `verified` |
| A3 | **Two payment surfaces differing by seven broken laws are byte-identical as `.zui` and both run clean at Level 4** — the court is silent exactly where the deterioration lives | fixtures written and run 2026-08-12; violations of Rules 119, 8, 3/87/117, 40, 79, 105, 123 | `verified` |
| A4 | All 118 rules carry `derived_from`, and all resolve to one of the seven articles — so admission needs no committee of taste | measured 2026-08-13 | `verified` |

| A5 | **After ratification the figure did not move.** v3.9: 119 rules — 9 `machine`, **6** `tool`, 25 `machine-later`, 79 `judgment`. Rule 62 left `machine-later` for `tool` and Rule 125 entered at `machine-later`, **so the two moves cancel** | measured against `rules.json` v3.9, 2026-08-13 | `verified` |
| A6 | **The law can now be checked where it was only legislated.** `SURFACE_AS` closed to ten media, the capability matrix published as data, two diagnostics added, suite **34/34** | `conformance/media.json`, 2026-08-13 | `verified` |

*Serves: The Deterioration, The Law.*

## B · The law is monomodal while believing itself medium-agnostic

| # | Finding | Evidence | Status |
|---|---|---|---|
| B1 | Across 118 rules, **`sound`, `earcon`, `sonification`, `speech`, `tactile`, `vibration`, `braille`, `chime`, `beep`, `ambient`, `aloud` appear zero times** | corpus scan, word-boundary, 2026-08-13 | `verified` |
| B2 | `audio` appears 3 times, **all inside Rule 73**, treating audio as a *document attachment* | same | `verified` |
| B3 | Both `voice` hits are **typographic metaphor** in Rule 107 — "a hero voice, a title voice" | same | `verified` |
| B4 | Rule 69 is titled **"Haptic Rhythm"** and its body is about 48px touch targets, overscroll bounce and swipe | same | `verified` |
| B5 | The only rule about how an interface is *heard* — Rule 60 — is **written entirely in ARIA**, inside a constitution whose preamble promises framework-agnosticism | same | `verified` |

*Serves: The Senses.*

## C · Drift inside the project — the best evidence the seam is real

| # | Finding | Evidence | Status |
|---|---|---|---|
| C1 | **Three-way vocabulary drift for one concept.** Rule 3 says `Neutral · Accent · Warning · Error`; Rule 118 says `success · warning · danger · info · muted`; the engine says `:Primary :Success :Warning :Danger :Info :Neutral` | read 2026-08-12 | `verified` |
| C2 | **Rule 62 is `machine-later` while its instrument ships.** `StzIsLegible` at `stzColor.ring:324`, minimum 4.5, CI-gated, 42/42 theme/role pairs passing | 2026-08-12 | `verified` |
| C3 | **A cultural assumption hard-coded in an "abstraction layer."** `stzDiagramColor.ring:45` binds `:Success = "green"`, `:Danger = "red"` — the exact pair that **inverts** in Chinese, Japanese, Korean and Taiwanese financial convention | read 2026-08-13 | `verified` (code) · `reported` (inversion) |
| C4 | The colour plan never uses the words *culture*, *region*, *locale* or *audience* — **not once, including in its own "Risks, named now"** | 2026-08-13 | `reported` |

| C5 | **The site drifted under a heading claiming it could not.** The enforcement census on *How it works* was titled *"the census, computed from the file"* and was **hand-typed** — 78 `judgment` where the law said 79, 118 rules where it said 119. It is now read from `rules.json` at page load | 2026-08-13, fixed same day | `verified` |
| C6 | **The colour plane implements four of the law's five family-one values.** `StzSemanticColors()` has no `:Muted`, and neither `:Neutral` (family two) nor `:Primary` (Rule 3's accent quantity rule) can stand in. **Visible only because the sound plane implemented all five** — the two channels of one system disagree about how many values exist | `stzColor.ring:272-276`, 2026-08-13 | `verified` |
| C7 | **The same category error, found in our own fixture.** `vibe-strips-right.zui` declared `SURFACE_AS kiosk`. A kiosk is not a medium — it is a *visual* surface that is **unelected**, which is a property. Identical to filing `ambient` as a medium, and caught on the first run of the closed enumeration | 2026-08-13 | `verified` |

*Serves: The Deterioration, The Expression, The Readers.*

## D · The sound plane

| # | Finding | Evidence | Status |
|---|---|---|---|
| D1 | **419 ms from `Fire()` to ear**, against Rule 18's 100 ms budget. The plane's own conclusion: *"the sound is not the acknowledgement. The screen is. The sound corroborates."* | `stzEarcons.ring`, `SOFTANZA_SOUND_PLAN.md`, 2026-08-12 | `reported` |
| D2 | Earlier figure of **112.6 ms** output latency, decomposed as ~30 ms app buffer + ~22 ms measurement tap + ~60 ms OS pipeline, with the standing instruction *"quote the buffer, never the 112 ms"* | same plan | `reported` |
| D3 | **The plane deferred to the law rather than inventing a vocabulary**: *"the vocabulary is not this plane's to choose… a sixth value here would be a constitutional amendment wearing a library's clothes"* | 2026-08-13 | `reported` |
| D4 | **`muted` renders as silence** — reasoning that muted means waiting or inactive, and a sound announcing inactivity is a contradiction. This settles that `muted` and `:Neutral` are two concepts | `stzEarcons.ring` | `reported` |
| D5 | The motif set claims *"rising means good and falling means bad… the one mapping that is close to universal across musical cultures"* — **asserted, not cited** | `stzEarcons.ring:354` | `verified` (text) · `unverified` (claim) |
| D6 | Intervals chosen are fourths and fifths, avoiding the major/minor third that carries most Western affective loading — a good instinct, worth recording as such | measured from the motif frequencies | `verified` |

*Serves: The Senses.*

## E · Culture

| # | Finding | Evidence | Status |
|---|---|---|---|
| E1 | The law has **language, not culture**: Set 18 is three `judgment` rules — dialect switching, RTL, language-as-data | 2026-08-13 | `verified` |
| E2 | Rule 64 already reasons correctly: *"Calm that only flows left-to-right is not calm; it is locale bias"* | same | `verified` |
| E3 | **The word "culture" is already taken.** Article VI means *interaction* culture — a vibe | same | `verified` |
| E4 | **None of the 15 forbidden patterns is cultural** | same | `verified` |
| E5 | Industrial safety standards (IEC 60073 / ISO 3864 / ISO 7010 family) assign colour meanings that appear to converge with Rule 118's five values, from unrelated evidence decades earlier | research pass, 2026-08-13 | **`unverified`** — scheme level only; docket C-2 gates adoption on reading the editions |

*Serves: The Readers, The Law.*

## F · The GUI and toolkit landscape *(surveyed 2026-08-13)*

| # | Finding | Evidence | Status |
|---|---|---|---|
| F1 | **No open-source C or C++ HTML/CSS engine implements CSS Grid.** `litehtml/src/render_flex.cpp` exists; `render_grid.cpp` 404s; RmlUi lists complete flexbox and no `grid-*` | source-level check | `reported` |
| F2 | **Flutter forked Chromium's accessibility code — 228 files, 3,467,964 bytes of C++ — and froze it.** Slint's equivalent is **40,211 bytes** of AccessKit glue | repository measurement | `reported` |
| F3 | **Layout is ~15% of a toolkit.** Flutter's non-layout, non-paint surface ≈ **6.6 MB**: scrolling 1,051 KB, text input and IME 686 KB, **keyboard mapping alone 569 KB**, gestures 462 KB (arena only 10 KB), focus 238 KB | subsystem byte counts | `reported` |
| F4 | **Slint leases Taffy, Parley and AccessKit** and reaches roughly Flutter's feature set at about a tenth the source volume | `Cargo.toml` | `reported` |
| F5 | **Yoga's public API advertises CSS Grid with no algorithm behind it** — 43 functions landed 2026-03-05 as "part 1/9"; no grid file under `yoga/algorithm/` since | repository check | `reported` |
| F6 | **LVGL's XML declarative layer was removed from the MIT core** (PR #9565, merged 2026-01-27), citing licensing concerns and plans for a custom licence; a community question about the migration path is unanswered | PR and issue #9663 | `reported` |
| F7 | Two widely repeated release dates are wrong: **litehtml v0.10 is 2026-06-13** (not 2024) and **RmlUi 6.2 is 2026-01-11** (not 2025) | release feeds | `reported` |
| F8 | Two widely repeated adoption claims are stale: **RetroArch removed its Nuklear menu driver**, and **JetBrains Rider does not use Avalonia** (dotMemory and dotTrace do) | current trees and vendor pages | `reported` |

*Serves: In Practice, The Deterioration.*

## G · What accessibility actually costs

| # | Finding | Evidence | Status |
|---|---|---|---|
| G1 | From scratch, five platforms: **3–6 engineer-years.** AccessKit removes the *adapter* half only; the semantics tree is comparable in size and unavoidable | survey estimate from measured adapters | `reported` |
| G2 | AccessKit adapters, measured: Windows 3,763 lines · macOS 2,590 · Android 2,403 · iOS 2,499 · Unix 801 · AT-SPI translation 4,200 · schema **182 roles, 22 actions** | source counts | `reported` |
| G3 | **AccessKit has no web adapter** (planned). egui falls back to an experimental built-in screen reader in the browser | project docs | `reported` |
| G4 | **Canvas hit regions are dead** — removed from the WHATWG standard, MDN pages deleted — and **virtual accessibility nodes were abandoned**. The only path is a mirror DOM | specs and explainer | `reported` |
| G5 | **Figma built its mirror DOM over ~4 years**, positioning with CSS affine transforms rather than visually-hidden CSS, because the latter breaks magnifiers and voice control | Figma engineering blog | `reported` |
| G6 | **Flutter shipped full ARIA-equivalent roles only in 3.32 (May 2025)** — about 7 years after 1.0 | release notes | `reported` |
| G7 | **Unity: mobile screen readers 2023, desktop only in 6.3 (Sept 2025)** — and the hierarchy is hand-maintained by the developer | Unity docs | `reported` |
| G8 | **Virtualised lists are the universal failure mode** — the same defect in Flutter web, Flutter mobile, Slint and egui | four independent trackers | `reported` |
| G9 | **Every toolkit gates accessibility behind a performance flag**, and the flag is where users silently get nothing | Flutter web, Chromium/Electron/CEF, Unreal, egui | `reported` |
| G10 | **Dear ImGui has none, by stated design.** Its maintainer: *"decently easy to get 80% narration working, but extremely difficult if not impossible to get 90–100%… It seems misleading to me"* | issue #8022, 2026-04-28 | `reported` |
| G11 | Statute is closing in: the **DOJ Title II rule** binds state/local government **mobile apps** to WCAG 2.1 AA by **April 2027 / 2028**; the **European Accessibility Act** covers kiosks, ATMs, banking and e-commerce | primary regulatory sources | `reported` |

*Serves: The Senses, Under Generation, In Practice.*

## H · What text input actually costs

| # | Finding | Evidence | Status |
|---|---|---|---|
| H1 | IME across five platforms: **1–3 engineer-years, and it never closes** | survey | `reported` |
| H2 | **Firefox's TSF support was estimated at "10–15 man days" and took about eight years** — most of it spent inventing *query content events* so the widget layer could interrogate layout | bugzilla 88831 | `reported` |
| H3 | **GLFW's IME request has been open since 2013** | issue #41 | `reported` |
| H4 | **Zed carries ~10 open IME bugs simultaneously**, including a memory leak during Chinese composition; Alacritty has had IME crashes and a **preedit leaking into a password field** | trackers | `reported` |
| H5 | **UAX #9 specifies reordering for display and says nothing about caret movement, selection or deletion** — those are entirely the implementation's | the annex itself | `reported` |
| H6 | **Blink moved from visual to logical caret movement in Chrome M76**: *"visual movement is very complicated… based on hacks with many bugs, which we don't want to maintain any more"* — and it blocked their layout rewrite | blink-dev PSA | `reported` |
| H7 | **HarfBuzz is ~15% of the text problem.** Its own docs: *"HarfBuzz won't help you with bidirectionality… won't help you with line breaking, hyphenation, or justification"* | project docs | `reported` |
| H8 | **DirectWrite, CoreText, Pango and SkParagraph all stop at hit-testing and selection rectangles. None ships an edit model.** Four independent stacks drawing one line is evidence the edit model is not reusable | API surfaces | `reported` |
| H9 | **RTL is a parameter threaded through the layout protocol, not a feature.** Flutter needed a dedicated PR introducing `Directionality` across its core layout files | PR #11570 | `reported` |
| H10 | **egui has no bidi after five years** — issue #1016 open since 2021; `// TODO(emilk): heed bidi characters` in `font.rs` | source and tracker | `reported` |
| H11 | **Avalonia has a six-year tail of Arabic bugs with regressions in late 2025 and early 2026**, and seven open `FlowDirection` issues | tracker | `reported` |

*Serves: The Senses, In Practice.*

## I · Prior art worth citing

| # | Finding | Evidence | Status |
|---|---|---|---|
| I1 | **Road signage is the existence proof** the book needs: a closed vocabulary of shapes and colours, legislated by treaty, enforced by inspection, amended on crash evidence, working across languages and literacy for sixty years | general | `unverified` at clause level — the *argument* is safe; specific treaty citations are not yet checked |
| I2 | **Design tokens are the honest competitor and they are stuck** — no law, no court, no culture axis, no medium beyond the screen. A token system without a constitution is a naming convention with good intentions | W3C DTCG and CSS features | `reported` |

*Serves: The Heritage, The Deterioration.*

## J · Corrections of record

Recorded because a project that argues about drift and hides its own errors has refuted
itself. Each is a correction *this* project made to *itself*, in the open.

| # | The error | The correction | Date |
|---|---|---|---|
| J1 | Described scoping as *entering a region where everything inside applies until you leave*, and offered it as the improvement over CSS selectors | **That is the disease Scope-Oriented Programming cures, not the cure.** An ambient block was proposed, built against and deleted in the library, with the reason recorded | 2026-08-13 |
| J2 | Claimed immediate-mode GUI is *structurally disqualified* for accessibility, and that egui could be set aside unexamined | **Wrong.** egui has AccessKit as a hard dependency and rebuilds the tree each frame. Nuklear's absence was Nuklear's failure, not the paradigm's | 2026-08-13 |
| J3 | Claimed Softanza's text pipeline is *"ahead of egui's"* | True for **display**, misleading for **editing** — see H7. Both are at zero for the edit model | 2026-08-13 |
| J4 | The founding document's tier table said 117 rules / 78 `judgment` after the law moved to v3.8 | Re-measured and **anchored to a law version**, with the prior values recorded, so it cannot go stale silently again | 2026-08-13 |
| J5 | Recorded the reference design as **v1.0** when it was **v1.3** | Corrected in `ALIGNMENT.md`; C2 is unchanged across all three amendments | 2026-08-13 |
| J6 | Docket **P-1** proposed Rule 62 → `machine` | **Wrong tier.** `machine` means the *declaration checker* refuses it, and a `.zui` file has no colours. `StzIsLegible` is a runnable check in a repository — the definition of `tool`, where Rule 105 already sits. **Caught by the ratification pass itself** | 2026-08-13 |
| J7 | Docket **A-5** claimed reconciliation must *add a value* | It does not. Rule 118 is *Two Families of Colour*; `:Neutral` is **family two**, already legislated, and `:Primary` is Rule 3's accent quantity rule. The closed set stays at five and the vocabulary `stzEarcons` adopted needs no revision | 2026-08-13 |
| J8 | Sized the `:Muted` work at *"about an hour"* | True only if it is a grey nobody checks. See K3 — a careful half-session | 2026-08-13 |
| J9 | Went looking for a duplicated semantic table in `stzDiagramColor` | **There isn't one.** Negative result recorded rather than dropped, because a manufactured defect is worse than a missed one | 2026-08-13 |

## K · Verification that changed the claim *(added 2026-08-13)*

Five times today, checking a call site altered what was about to be filed. Recorded as a
group because the pattern is the finding: **an observation is not a work order, and
converting one into the other is not clerical.**

| # | Before checking | After checking |
|---|---|---|
| K1 | *"the classifier probably misses R"* | **proven** from the vendored `utf8proc.h`: `R = 4` is never matched, Arabic passes only by accident via `AL = 5`, and the in-code comment asserting `5=R` **skips 4** — the comment is part of the defect |
| K2 | *"`MatchWord` mutates the pattern"* | **two verbs**, not one — `MatchWordsIn` *and* `MatchFirstWordIn` both call `SetPattern` |
| K3 | *"adding `:Muted` is one row, about an hour"* | **five edits and a guard**; seven theme palettes each enumerate their roles, and the contrast pairs go **42 → 49**, all needing 4.5:1 in every theme. A careful half-session |
| K4 | *"renaming `.stzui` is a directory listing"* | `ToText()` bakes the literal string into **canonical output**, pinned by a byte-identical round-trip guard — the rename touches the printer and its guard |
| K5 | *"`stzDiagramColor`'s table duplicates `stzColor`'s"* | **wrong, and recorded as such.** It *is* the resolver's source; `stzColor` is the facade over it. One source of truth, correctly |

*Serves: In Practice — and it is the argument for the "What to change" section existing.*

## L · The law rediscovered by someone not reading it *(added 2026-08-15)*

**The cleanest corroboration this project has.** Softanza Central — a sibling session with
no knowledge of the constitution's contents — built a status dashboard for its author, who
rejected two versions and corrected the third in his own words. **Every correction he made
was already law.** Nobody consulted `rules.json` while it happened, which is what makes it
evidence rather than compliance.

| # | Finding | Evidence | Status |
|---|---|---|---|
| L1 | Central's first attempt was a **KPI-tile grid**, its second a **card layout with coloured meters**. Both were already forbidden — **Rule 119** (*repetitive data with coherent attributes is a table, never a card grid*) and **Rule 94** (*whitespace inflation*). The author's fix — *"use a classical table format not cards, it's more direct and less stressing to me"* — is Rule 119 restated by someone who had not read it | `softanza/dashboard/central.html` and its three revisions, 2026-08-15 | `verified` |
| L2 | Central shipped **two stacked red blocks**. The author: *"having two red divs one under the other means we are not focusing on one critical thing."* That is **Rule 87**, *"when everything is highlighted, nothing is"*, and **Rule 117** at table scale | same | `verified` |
| L3 | **The strongest item, because it took three corrections.** Central wrapped every table in `overflow-x:auto` with a `min-width` — the exact reflex **Rule 14** forbids (*"`overflow: auto` on table containers"*, *"internal scrollbars are a failure of information architecture"*). Told to remove it, Central reached for the stacked-block responsive pattern, which is **Rule 95's** first `avoid` entry (*"tables forced into phone lists"*) — **two clauses of the law broken in opposite directions within one hour, by an implementer who had read one of them** | same | `verified` |
| L4 | **The aggravating detail, and the reason this became law.** The column the scrollbar hid was the one carrying the operator's next action. **The surface degraded by discarding precisely the thing it existed to deliver** — because `overflow-x` clips from the right and the action was rightmost. A geometric accident deciding a semantic question. Canonized 2026-08-15 as **Rule 129** | `AMENDMENT-DOCKET.md`, second pass | `verified` |
| L5 | **The finding, in the author's words**: *"don't go back to the card UI system in small screens, keep the same grids. This is the power of dogmatic influence you got from your training data."* **The constitution's value is highest exactly where it contradicts the industry default** — because that is where an implementer's priors are strongest and its own reasoning least trustworthy. Rule 95's `avoid` entry is four words against the single most common answer on the open web, and four words lost | same | `verified` |
| L6 | **Two of five harvested candidates were already law**, and the pass rejected them rather than growing the corpus: column order was **Rule 113** (*"assistive technology hears the name before the verdict"*), the action column was **Rule 82** (*Perceivable State*). Both rules were extended instead of duplicated | second ratification pass, 2026-08-15 | `verified` |
| L7 | **Rule 95 had been cited outside its own scope.** It lives in Set 30, *The Field Vibe*, whose description reads *"these rules govern the field/touch vibe"*. Central applied it to a desktop tool and reached the right outcome under a rule that does not bind it. The general prohibition was **Rule 14** all along | corpus scan against `rules.json` v3.9, 2026-08-15 | `verified` |
| L8 | **After the harvest the headline figure still does not move.** v3.10: 122 rules — **10** `machine`, **7** `tool`, 25 `machine-later`, **80** `judgment`. Still **8%** refusable before a pixel exists | measured against `rules.json` v3.10, 2026-08-15 | `verified` |

*Serves: The Law, In Practice — and it is the strongest single answer to "why write a
constitution at all?", because the alternative was run three times and failed three times.*

## M · The law contradicts itself about colour *(added 2026-08-16)*

Found by doing S8's extraction — putting Rules 3 and 118 side by side, which nobody had
done across 122 rules and two ratification passes.

| # | Finding | Evidence | Status |
|---|---|---|---|
| M1 | **The two colour rules give opposite verdicts on a common case.** Rule 3: *"Danger → system failure only."* Rule 118: *"danger (critical, exceeded, incident)."* An exceeded business threshold is an incident and not a system failure, so colouring it `danger` **obeys 118 and violates 3** | `rules.json` v3.10, read 2026-08-16 | `verified` |
| M2 | **`neutral` carries two meanings.** Rule 3's is chrome (*default state*); Rule 118's family two is data colour (*channels, types, categories*). `StzThemeColor(theme, :neutral)` returns one colour for both | same, plus `stzDiagramColor.ring` `$aPalette` | `verified` |
| M3 | **The closure claim is the unclear one.** Rule 118 says *"exactly two families and no more"*; Rule 3 names an `accent` that is neither a status nor neutral metadata. Either accent is a forbidden third family, or "exactly two" silently means *two families of data colour*. **The law does not say** | same | `verified` |
| M4 | **Neither rule points at the other**, which is why M1–M3 survived 122 rules, two ratification passes and two implementing planes | same | `verified` |
| M5 | **The constitution has no precedence mechanism at all.** `invariant: true` looks like one and is not — the Reader defines the badge as *"this rule never flexes across vibes"*. 46 of 122 rules carry it. **So nothing in the law decides M1–M3**, and that is the deeper finding | `constitution/reader/index.html:404-405`, 2026-08-16 | `verified` |
| M6 | **The younger channel obeys the law and the older one does not.** `stzEarcons` implements all five values; the colour plane implements four. Sound is complete *because* it was written after Rule 118 and deferred to it, rather than having a vocabulary to defend | `stzEarcons.ring:56` and `stzDiagramColor.ring` `$aPalette`, 2026-08-16 | `verified` |
| M7 | **A plane attributed its own design to the law.** `stzEarcons.ring:54` reads *"the five, in the law's own order of severity"*. The law states no severity order — searched all 122 rules for an ordering, a precedence and an outranking. The ordering is the plane's, is defensible, and is documented as design in its own plan; only the code comment points upward | same, plus `SOFTANZA_SOUND_PLAN.md:1740` | `verified` |

*Serves: The Law, The Deterioration — and M5 is the one that generalizes, because a
constitution with 122 rules and no way to resolve two of them is a finding about
constitutions, not about colour.*

---

## Open items this ledger is watching

- **Docket C-2** gates the industrial-standards claim (E5) on reading the actual editions.
  Until then it must not be printed.
- **The book's part numbering** in `THE-SECOND-FOUNDING.md` §12 has two entries at VI since
  *The Readers* was inserted. Renumber before anything cites a part by number.
- **I1's treaty citations** are unchecked. The argument stands; the footnotes do not exist.
