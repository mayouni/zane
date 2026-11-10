# Milestone 2: the system as code, measured

**What this is.** The record of ZANE-DESIGN-01 milestone 2: the design system of [`DESIGN-SYSTEM.md`](DESIGN-SYSTEM.md) written into the site's
stylesheet, its checks added to the UI audit and to site-shell (in JS and in Zig, with parity), every new check run on the pages as they
were before the stylesheet changed, then again after. The figures come from two full runs of `tools/ui-audit.html` with **System**
ticked (38 pages, five widths, both cultures: 380 renders each) and from `zane site shell`; the runs were read on 2026-11-10.

## What was built

- **The tokens, in one stylesheet.** `site/stz.css` opens with the system's tokens: the fixed ones in `:root`, each culture's in its own
  block, restated on any element that sets a culture, so an exhibit can show both at once. The site's older variable names stay as
  aliases of the tokens, declared wherever a culture is, so the pages that still read them follow the culture they sit in.
- **The components on the tokens.** Every size is one of the six, every colour a token or a mix of tokens. Running text is no longer
  carded or ruled (cards, pairs, notes, the tour's stage and the front page's strip lost their boxes); a link in running text carries
  the plain underline (section 9 (b)); the reading size is 21 px (section 9 (a)); the footer is set at the 18 px floor (section 9 (c));
  code is highlighted in four roles (section 9 (d)); a table reflows instead of scrolling; every link that stands alone, every bar entry
  and every control is 48 px tall on a phone; the menu wraps as the brand, then rows of three and two; balance is on for running text.
- **Two tokens and one change of family, found while building.** `--bar` and `--on-bar` carry each culture's bar (Modern's indigo,
  Retro's terminal black), which no token of M1 could paint; and the measure is fixed in characters and stated in em by each culture,
  because Retro's monospaced letters are wider. The system counts 45 tokens, 23 set by a culture (`DESIGN-SYSTEM.md` section 6.2).
- **The checks.** The UI audit's **System** option reads K01 to K17 and K22 on the painted page at 375, 768, 1085, 1440 and 1900 px in
  both cultures, and reports a finding seen at several widths once, with where it was seen, and the count of each check. site-shell (and
  `zane site shell`, the same check in Zig) reads K01, K09 and K15 in the stylesheets, writes and checks each page's archetype on its
  `<body>` (K21), gives every page of three sections or more its outline (K18), and counts on every run what milestone 3 owes (K19, K20).
  `tools/zane/parity.js` holds the two to one output with nine new cases, one break per check.
- **What a check does not judge.** An offending demo (a gotcha's red pane, a sample marked offending) breaks the law on purpose; a style
  written to dress one sits between the comments `offense:start` and `offense:end` in its stylesheet. A sample frame draws its edge and
  its title strip lawfully. A run quoted in a terminal shows states that are not the page's own.

## The checks on the painted page, before and after

| check | before | after |
|---|---|---|
| K01 TYPE_SCALE | 2881 | 475 |
| K02 TEXT_CONTRAST | 568 | 446 |
| K03 MEASURE | 515 | 343 |
| K04 BOX_FILL | 38 | 24 |
| K05 CONTROL_NEAR | 1 | 0 |
| K06 GROUP_RATIO | 103 | 104 |
| K07 LINE_DRAWS | 411 | 280 |
| K08 ONE_EMPHASIS | 165 | 165 |
| K09 PALETTE | 0 | 0 |
| K10 ONE_CRITICAL | 1 | 1 |
| K11 BALANCE | 597 | 484 |
| K12 ROW_FULL | 38 | 1 |
| K13 ONE_SCROLL | 14 | 3 |
| K14 NO_FLOAT | 2 | 0 |
| K15 NO_HOVER_ONLY | 1 | 1 |
| K16 SHAPE | 0 | 0 |
| K17 TARGET | 946 | 126 |
| K22 LAYOUT_STILL | 0 | 0 |
| **all** | **6281** | **2453** |

**On the site's 35 pages and the front page: 4047 findings before, 382 after.** The Reader (`constitution/reader/index.html`, 1,925
both times) and the two tools (`tools/ui-audit.html`, `tools/zane/wasm-proof.html`, 308 before and 145 after) keep pages and styles of
their own and were not rebuilt in this milestone. The after-run predates one last change, the gotchas' rule links set at regular weight,
which removes one K08 finding on each of the eight gotchas pages.

| page | before | after |
|---|---|---|
| `/index.html` | 78 | 9 |
| `/site/why.html` | 160 | 18 |
| `/site/how.html` | 180 | 39 |
| `/site/refusal.html` | 139 | 9 |
| `/site/haro.html` | 110 | 18 |
| `/site/conformance.html` | 149 | 9 |
| `/site/rules.html` | 137 | 11 |
| `/site/gotchas/index.html` | 95 | 15 |
| `/site/gotchas/stillness.html` | 79 | 7 |
| `/site/gotchas/forms.html` | 78 | 7 |
| `/site/gotchas/state.html` | 91 | 7 |
| `/site/gotchas/widgets.html` | 86 | 6 |
| `/site/gotchas/reading.html` | 111 | 16 |
| `/site/gotchas/navigation.html` | 75 | 5 |
| `/site/gotchas/intelligence.html` | 71 | 9 |
| `/site/vibes.html` | 95 | 12 |
| `/site/positioning.html` | 67 | 9 |
| `/site/practices.html` | 96 | 6 |
| `/site/frameworks.html` | 117 | 8 |
| `/site/thinking.html` | 199 | 34 |
| `/site/grid.html` | 224 | 14 |
| `/site/innovation.html` | 105 | 8 |
| `/site/adopt.html` | 101 | 7 |
| `/site/ports.html` | 102 | 9 |
| `/site/softanza.html` | 67 | 4 |
| `/site/stack.html` | 76 | 6 |
| `/site/beyond.html` | 148 | 8 |
| `/site/mobile.html` | 93 | 4 |
| `/site/web.html` | 131 | 10 |
| `/site/build.html` | 150 | 9 |
| `/site/generate.html` | 107 | 5 |
| `/site/media.html` | 198 | 23 |
| `/site/audit.html` | 84 | 4 |
| `/site/screenshots.html` | 91 | 8 |
| `/site/tour.html` | 157 | 9 |
| `/constitution/reader/index.html` | 1925 | 1925 |
| `/tools/ui-audit.html` | 167 | 65 |
| `/tools/zane/wasm-proof.html` | 141 | 80 |

## The checks on the files, before and after

| check | before | after |
|---|---|---|
| K01 TYPE_SCALE: a size written outside the tokens in `stz.css` and `gotchas.css` | 77 | 0 |
| K09 PALETTE: a colour written outside the tokens | 47 | 0 |
| K15 NO_HOVER_ONLY: a `:hover` that reaches another element | 0 | 0 |
| K18 NAV_TREE: a page of three sections or more without its outline | 5 | 0 |
| K21 ARCHETYPE: a page that does not declare its archetype | 38 | 0 |
| K19 REGISTER, counted for milestone 3: paragraphs over 70 words | 57 on 32 pages | 57 on 32 pages |
| K20 SAMPLE, counted for milestone 3: sections of article pages without a sample frame | 74 on 23 pages | 74 on 23 pages |

## What remains, and who takes it

- **Milestone 3, the pages rewritten.** On the site's own pages the remaining findings are what the words and the drawings decide: K11
  (a paragraph longer than six lines, which the browser does not balance; it shortens with K19), K03 (lines just over 75 characters or
  under 45 in a narrow column), K01 (the labels of four drawings, on `how`, `haro`, `thinking` and `media`, which shrink under 18 px on a
  phone: each needs a narrower drawing), and K17 (links alone in a table cell or a list on a phone). K19 and K20 become failures, and K21
  reads the order of each archetype's regions.
- **The Reader and the two tools**, which keep their own styles: rebuilt on the tokens as pages of the reference and tool archetypes.
- **The look.** No counter can say the site reads well; the Principal looks at it in both cultures (a perceptual row in the outbox).

## Gates

`zane site shell` and `node tools/site-shell.js`: 38 pages, identical output; `node tools/site-facts.js --check`: ok;
`node tools/zane/parity.js`: identical in every section (the site's 92 cases and 120 command lines among them); `node tools/zane/serve-test.js`:
250 of 250; `zane conformance`: level 4, every fixture; `zig build test`: ok; `zig build release`: the six files and SHA256SUMS, the Windows
file 2,507,776 bytes. The version is still 0.1.0, so these files are a build of the tree, not a release to upload.
