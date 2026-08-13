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

---

## Open items this ledger is watching

- **Docket C-2** gates the industrial-standards claim (E5) on reading the actual editions.
  Until then it must not be printed.
- **The book's part numbering** in `THE-SECOND-FOUNDING.md` §12 has two entries at VI since
  *The Readers* was inserted. Renumber before anything cites a part by number.
- **I1's treaty citations** are unchecked. The argument stands; the footnotes do not exist.
