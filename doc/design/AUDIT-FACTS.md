# The audit facts file

**What this is.** The shape of the file a screenshot is reduced to before the audit judges it, and the
two decisions the audit may take from it. Written first, by the StzZui desk, so the writer (the
intelligence desk, on rnxc) is built to this shape and not the other way round. Question Q8 of the plan,
decided 2026-11-02 on the Principal's word.

**What this is not.** It is not the audit and not the writer. It captures nothing (the capture loop, S12,
is a separate thing): the audit takes a screenshot path and a scale as input. It proposes no rule.

Files: [`audit/facts.schema.json`](audit/facts.schema.json) (the shape),
[`audit/example.facts.json`](audit/example.facts.json) (one violating line, one lawful line, made by hand),
[`audit/check-facts.js`](audit/check-facts.js) (proves a file keeps its schema and its arithmetic, and prints
the decisions). Run `node doc/design/audit/check-facts.js`; it needs nothing installed.

---

## 1. The principle

**The writer measures and the audit judges.** A writer that also decided "this is too small" would put the law
inside a tool that has never read it. So the file holds measurements only, and every threshold lives in
section 4 and nowhere else.

**A field the writer could not measure is `null`, never a guess and never zero.** A zero luminance is black text;
a null is "I do not know", and the audit treats them as different things.

## 2. The shape

One file per screenshot, JSON, `format: "zui-audit-facts"`, `version: "1.0"`.

**`capture`**, once per file:

| field | meaning |
|---|---|
| `image` | the path the caller gave, as given |
| `image_sha256` | optional; proves the facts belong to this exact image |
| `width_px`, `height_px` | the image size |
| `scale` | device pixels per CSS pixel, **supplied by the caller**. It cannot be measured from pixels |
| `box_kind` | `line` (the whole line box, at least an em tall) or `ink` (a tight box around the glyphs) |
| `ocr` | `engine`, `lang` |
| `luminance` | `standard` (WCAG 2.x relative luminance, sRGB) and `method`, the writer's own words for how foreground was split from background |

**`lines`**, one per OCR line:

| field | meaning |
|---|---|
| `id` | `L1`, `L2`, ...; findings cite it |
| `text`, `score` | what the OCR read, and its confidence from 0 to 1 |
| `box` | `[x0, y0, x1, y1]` in image pixels |
| `line_height_px` | `y1 - y0`, exactly |
| `line_height_pt` | `line_height_px x 72 / (96 x scale)`, 2 decimals |
| `fg_luminance`, `bg_luminance` | WCAG relative luminance, 0 to 1, or `null` |
| `contrast_ratio` | `(max + 0.05) / (min + 0.05)`, 2 decimals, `null` exactly when a luminance is |
| `bg_spread` | **optional**: the range of luminance in the background pixels of the box. This field and `box_kind` are the two additions to the list the intelligence desk was asked for |

The derived fields (`line_height_px`, `line_height_pt`, `contrast_ratio`) are in the file so a reader need not
recompute them, and `check-facts.js` recomputes them so a writer cannot drift.

**Why `box_kind` and `bg_spread` exist.** Both are things a screenshot audit would otherwise have to assume.
An OCR box that hugs the ink is about half an em tall on a line with no ascender or descender, and a size read from
it would be half the truth. A contrast ratio taken over a gradient or a photograph is a number with no meaning.
Neither can be seen from the other fields, so the writer says it.

## 3. What a screenshot can decide

Of 123 rules, the law was searched for wording that a line of text, a box and two luminances could decide
(contrast, size, point, legibility, a ratio: 21 rules mention one of them). Three rules survive:

| rule | tier | what the facts decide | what they cannot |
|---|---|---|---|
| **62** Contrast & Legibility | tool | body text below 4.5:1 | the rem and scaling clauses (they are about code, not pixels) |
| **105** The Legibility Floor | tool | the contrast half: below 4.5:1 | the size half: it binds *main reading text*, and a screenshot cannot say which text is main |
| **107** Hierarchy Is Not Miniaturization | machine | text set below the reading floor, 16 CSS px | its two exceptions (optical parity, a dense vibe chosen by a trained operator): the facts cannot see them |

The other 18 rules that mention the same words stay out. Rule 56 repeats the 4.5:1 floor, but its subject is
the *pair* of themes, and one screenshot is one theme. Rules 54, 66, 69, 4, 6, 10 and the rest are judgment
and need more than a line of text. **Every rule not in this table is reported "not audited", never "passed".**

Grid place of all three: **perceive x visual**, a screenshot being visual and the rules being about whether text can
be read. That cell already holds 36 rules; the audit reaches 3 of them, and 62 and 105 share one decision.

## 4. The two decisions

Three outcomes per line and decision: **fail**, **pass**, **not_decided**. Thresholds, all stated here:

| | value | why |
|---|---|---|
| contrast floor | 4.5:1 | Rules 62 and 105 |
| size floor | 12 pt (16 CSS px, 1rem) | Rule 107's lint |
| minimum OCR score | 0.5 | a default to argue with: a line read with less confidence is not judged |
| background spread limit | 0.25 | a default to argue with: above it the text sits on a gradient or an image |

**Contrast (rules 62, 105).** `not_decided` if the score is under the minimum, a luminance is null, or `bg_spread`
is over the limit. Otherwise `pass` at 4.5:1 or more and `fail` below. If `bg_spread` is absent the verdict is
given and marked an estimate.

**Size floor (rule 107).** `not_decided` if the score is under the minimum or `box_kind` is `ink`. Otherwise
`fail` if `line_height_pt` is under 12, and `not_decided` if it is 12 or more. **A size is never `pass`.** A line
box is an upper bound on the font: a 9 pt line box proves the font is under 9 pt, and an 18 pt line box proves nothing,
because line height can be generous around small text. The pt figure is an upper bound and the output must say so.

## 5. The example, and what it shows

| line | contrast | size floor |
|---|---|---|
| `L1` "Overdue balance", 9 pt line box, 2.85:1 | **fail** | **fail** |
| `L2` "Account summary", 18 pt line box, 12.63:1 | **pass** | **not_decided** |

`L2` is the lawful line, and the audit still does not say its size is lawful. That is the design and not a gap
in the example: *no violation found* is all a line box can give about size.

The luminances are those of #999999 and #333333 on white (0.3185 and 0.0331 against 1), computed by hand and
re-derived by `check-facts.js`.

## 6. Limits, stated

- **Projected, not verified by a person.** Nobody has looked at a screenshot with this audit (`CENTRAL-PERCEPTGATE-01`).
  The example is not a screenshot at all: `example/ledger-screen.png` does not exist.
- **The luminance is an estimate** from a foreground and background split inside a box. Antialiasing, subpixel
  rendering and text on texture all move it. `luminance.method` records how, and `bg_spread` flags the worst case.
- **`box_kind` is open.** Which kind `StzOcrModelLinesXT` returns is not known to this desk. If it is `ink`,
  the size decision returns `not_decided` for every line until the writer can produce a line box.
- **The two defaults** (score 0.5, spread 0.25) were chosen here, not measured, and nothing yet argues for them.
