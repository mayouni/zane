# Finding for the GUI plane — `.stzui` v0.1

**From**: StzZui, 2026-08-13, after reading `base/gui/SOFTANZA_GUI_PLAN.md` §4b and
`base/test/gui/showcase.stzui`.
**Genre**: a cross-plane finding, the kind this plane already both sends and receives —
the sound plane's SN5 request that became `AddImage`, and the reversible-text-layout
request that became `RectsOfRange` / `CaretRectAt` / `IndexAtPoint`.
**Status**: **three requests, no defects.** Nothing here is broken. All three are cheap
this week and expensive at G6.

---

## First, the part that is not a finding

**`.stzui` is a good answer to a real gap, and the gap was mine.** `GUI-SYSTEM.md` §5
forbids hand-writing the *meaning*; the plan's §4 forbids hand-writing the *projection*.
Between them I left this plane **with no text surface a person may write at all**, while
every other plane has one. A UI plane whose only authoring story is "call Ring methods"
does fail contracts-are-the-substrate. That was a hole in the prompt, this filled it, and
the reasoning in §4b is better than the objection I first had on reading the showcase.

Three things in it are worth saying back, because they will matter later and were not
obvious now:

- **Jurisdiction stated before the grammar** — *"It declares no meanings — there is no
  `:Danger` and there never may be."* That sentence is what makes the layering survivable.
- **Every box has a name**, refused from QML deliberately, *because* a nameless box turns
  accessibility, hit-testing and the paint-time audit into retrofits. That is the toolkit
  survey's hardest lesson, applied before anything needed it.
- **A court from birth**, C2-shaped, with a byte-identical round-trip fixpoint. Most
  languages get their court years late; this one shipped with G1.

---

## Finding 1 — colour is literal, and this is exactly how the last vocabulary drifted

`showcase.stzui` carries `BACKGROUND "#0f1419"`, `"#243040"`, `"#2b6cb0"`, `COLOR
"#e8eef5"`, `"#7c9cbf"` — twenty declarations, every colour a hex literal. The plan defers
sense *references* to G6, which is honest and correctly scoped.

**The concern is not the deferral. It is what fills the corpus meanwhile.**

This project has watched this happen once already, and wrote it down: Rule 118, Rule 3 and
the graphics engine independently derived the same five semantic values and drifted into
three incompatible spellings, because the engine shipped before the law had a seam to bind
to. `base/graph/stzDiagramColor.ring:45` still hard-codes `:Success = "green"` and
`:Danger = "red"` inside a table its own comment calls an *"abstraction layer"* — the pair
that inverts in Chinese, Japanese, Korean and Taiwanese financial convention.

**Every hex literal written into a `.stzui` file between now and G6 is a meaning that
escaped the semantic layer**, and each one has to be found by a human later, because a hex
value carries no record of what it meant.

**The request, and it is small**: let the court **warn** on a literal colour from v0.1 —
*"a colour that names no meaning"* — while continuing to accept it. Warn now, refuse at G6.
That is the enforcement ladder this family already uses on itself, it costs one check, and
it means the corpus grows with a marked trail instead of a silent one.

*Cost now: one warning. Cost at G6: reading twenty files and guessing what each hex meant.*

## Finding 2 — nothing traces to an intent yet

§4b says the two formats *"meet only when a later phase binds a panel to a flow."* Correct
sequencing — but until that phase, **every element in every `.stzui` file is an orphan by
the founding inversion's own test**: *every UI element must trace to at least one intent.*

Again the request is not to build the binding now. It is to **let the field exist
syntactically now, unresolved** — a `SATISFIES`-adjacent or `FLOW`-reference slot the
court parses, records and does not yet resolve. Then a file written this month is complete
when the binding lands, rather than needing a pass over every declaration.

The precedent is one this plane benefited from directly: the graphics plane made
`textLayout` reversible **before** IME needed it, on a filed request, and it cost little.
Retrofitted, it was the eight-year Firefox story.

## Finding 3 — the extension, and this one is now-or-never

`.stzui` and `.zui` differ by **one letter**, and they are **semantically opposite**:

| | declares | forbids |
|---|---|---|
| `.zui` | intent — what the human is doing | *"No `WIDGET`, no layout, no colour"* |
| `.stzui` | boxes, sizes, directions, colours | meanings |

A file extension is a harder case than a module name. `stzGui` beside `StzZui` was ruled
acceptable and is defensible — it appears in prose, where context disambiguates. An
extension is **typed by users constantly**, appears in every path, import and error
message, and a mistyped `.zui` is not a typo that fails: it is **a valid file of a
different language, accepted by a different court**, which is the worst failure mode
available.

Two options, both clean:

- **`.panel`** — the root declaration is literally `DEFINE PANEL`. Short, unambiguous,
  shares no letter-order with `.zui`. My recommendation.
- **`.stzgui`** — matches the plane name exactly, conservative, still two letters from
  `.zui` rather than one.

**This is the author's call, not this finding's.** But it is the only one of the three that
gets harder every day: renaming now costs a handful of files and a guard; renaming after
`.stzui` appears in documentation, examples and other planes' fixtures costs a migration
and leaves stale references forever.

---

## The one cause behind all three

**v0.1 shipped exactly the fields it needed today** — which is right, and is why it shipped
at all. The three things it defers are, precisely, the three this project keeps writing
about: **a meaning that escaped into a literal, an element that traces to no intent, and a
name chosen before its neighbours were considered.** None is a defect. All three are the
kind that are trivial while the corpus is one showcase file and a migration once it is not.

## What is *not* being asked

- **No grammar reshape.** The commons conformance, the flat named declarations, the
  property-bag shape and the `RATIONALE` clause are right and should not move.
- **No meanings in this plane.** Finding 1 asks for a *warning about* literals, not for
  `.stzui` to resolve anything. Resolution stays StzZui's, exactly as §4b says.
- **No change to the RmlUi decision, the emission doctrine, or the phase order.**
- **No plane rename.** Finding 3 is about the file extension only.
