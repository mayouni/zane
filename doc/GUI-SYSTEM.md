# A Softanza GUI system — the law's reading

**Status**: **v0.1 — a reflection, not a proposal for ratification.** Written 2026-08-13.
**Where the work would live**: `stzlib` (engine, layout, paint), `ringine` (in-scene),
`ringface` (composition), `zing` (delivery). **Not here.** StzZui owns the law and the
vocabulary; this document is the law's reading of an engine proposal, written here because
the proposal is *"an implementation of the Zui paradigm"* and that paradigm is this
repository's.
**Relation to the docket**: none blocking.

---

## 1. The verdict

**The instinct is right, and the reason is one the family already has a doctrine for.**

> *"Privilege the web as an enabling technology, even if the execution is native
> baremetal."*

That is **contracts are the substrate**, applied to rendering. HTML and CSS are not being
adopted as a *runtime*; they are being adopted as **the interchange format of the visual
projection** — the most widely implemented UI contract that has ever existed. The family
already ships its law as JSON, its grammars as closed plain text, and its engine as a C
ABI, for exactly this reason: *an asset that many things can consume must be data.*

So the proposal is not "use web tech for native UI." It is: **the visual projection gets a
serialization, and that serialization happens to be the one every developer on earth can
already read, diff, and open in a browser.**

That reframing is the whole argument, and it also fixes what could go wrong (§6).

## 2. What litehtml actually is — and is not

Precision matters here, because a vendoring decision rests on it. **Verify each of these
before committing to anything; they are stated at the confidence I actually have.**

**What it gives:**

- **A layout engine for a CSS subset.** This is the prize. CSS layout is genuinely hard,
  and [STZSENSE.md](STZSENSE.md) §12.3 already concluded Softanza must not rebuild it.
- **It does not paint.** You supply a `document_container` implementing text measurement,
  drawing primitives and image loading. **This is the single best fit in the whole
  proposal**: the graphics plane already owns exactly those primitives, and
  `gpu_text.zig` already runs SheenBidi → HarfBuzz → rasterization. litehtml would consume
  a painter Softanza has already built.
- **Small, and vendorable** under the standing doctrine — *vendor wisely: smart, useful,
  easy, lightweight.*

**What it does not give, and each is a real cost:**

- **No JavaScript.** *This is a feature, not a gap* — behaviour comes from the reactive
  layer, so there is no JS engine to vendor and no second programming model.
- **No windowing, no input, no event model.** Hit-testing at best. Focus, keyboard
  navigation, IME, gestures are all Softanza's to build.
- **No accessibility.** None. See §5, which is the most serious finding in this document.
- **A partial CSS3 story.** Flex and grid maturity must be established by test, not by
  reading the README. If modern layout is not solidly supported, the emitter's target
  narrows sharply.
- It is **C++**, not C, which slightly complicates the C-ABI story — wrappable, but not
  free.

## 2.1 What the graphics plane already has — verified

I had flagged this as unchecked. It is checked now, and it changes the picture in the
proposal's favour.

**`stzWindow` exists** (GR5 of `SOFTANZA_GRAPHICS_PLAN.md`) and is more than a surface: a
real frame loop with `Poll()`, `DeltaTime()`, `FrameCount()`, `FPS()`, `Draw(canvas)`
rendering straight into the screen's texture with no readback, `EachFrame()`, `SetVSync`,
and a graceful-absence path — `IsAvailable()` answers false on a headless runner and every
other graphics tier keeps working. Its own header explains why input was in the first
commit rather than promised: *"a frame loop bolted onto a render-once API is a rewrite."*

**And it has already drawn the boundary this proposal starts at**, deliberately:

> *"WHAT A WINDOW IS NOT: it is not a widget toolkit. There are no buttons, no layout, no
> menus. It is a rectangle that shows what the graphics plane computes and reports what the
> user did — which is the part a graphics engine owes; the rest is a different product."*

So the GUI system is not an intrusion into that plane. **It is the different product the
plane named and left room for.**

**What is present**: window, frame loop, canvas, paint, keyboard and mouse *sampling*.
**What is absent, and each matters:**

- **An event model.** Input today is polled — `KeyPressed(:Escape)`, `MouseClicked(1)`.
  That is the game-loop shape, and it is right for a game. **A widget system needs events
  with a target and a route**: which element was hit, who has focus, what bubbles. Polling
  cannot express that, so this is a real architectural addition rather than a wrapper.
- **Text input.** `KeyDown`/`KeyPressed` are key codes. There are no character events and
  no IME, so text entry is entirely unbuilt — the silent killer of §5.2.
- **A focus model.** Nothing today, and Rule 80 is `machine` tier.
- Windowing is per-OS: `stz_window.dll` *"cannot be cross-built for every OS from one
  machine"*, so it follows the sound plane's two-DLL split and may simply be absent.

## 3. Why StzZui should want this more than anyone

From the law's side there is an argument stronger than convenience, and it is the one that
would make me push for this:

> **A Softanza-owned renderer is the first projection the court can inspect while it
> paints.**

Today Level 4 conformance — *"a rendered surface… everything only a painted page
reveals"* — is reachable only by `tools/ui-audit.html`, on a same-origin web page, after
the fact. `LAYOUT_DISPLACEMENT` is measured by a tool and refused by nobody.

With Softanza owning the box tree, the paint list and the frame loop, **the audit stops
being an HTML tool and becomes an engine capability.** Rule 38's zero displacement, Rule
105's legibility floor, Rule 114's room before scrollbars, Rule 107's three sizes — all of
these become decidable *at paint time, in every medium the renderer serves*, and refusable
rather than merely measurable.

That is the enforcement percentage moving for a structural reason rather than by adding
rules. It is the single largest thing that could happen to the Second Founding's thesis.

## 4. Transversality, tested against its hard case

Web page, phone, small device — those are the same renderer at different sizes, and the
proposal handles them straightforwardly.

**The 3D-in-scene case is the one that decides the architecture**, and it is where the
"does not paint" property pays off again. A panel inside a game scene needs a box tree
rendered into a **texture**, mapped onto a quad, with input arriving by **raycast** rather
than as a 2D pointer. Because the engine hands you draw calls instead of pixels on a
window, painting into a GPU texture is the natural path rather than a workaround.

Three costs to name honestly: text legibility at oblique angles, the input mapping from
ray to box, and per-frame layout cost — which is answered by caching layout and
re-laying-out only on change, as every retained-mode UI does.

## 5. The four things that kill GUI toolkits

In order of how badly each would hurt.

**1 · Accessibility, and this one is a law problem, not an engineering problem.**
In a browser you get an accessibility tree by accident. With an embedded DOM you get
**nothing** — no screen reader, no platform AT bridge. And this constitution has Rule 60
at `machine` tier and Rule 104 stating *"what a screen reader can operate, an agent can
operate."* **A Softanza GUI that shipped without an accessibility surface would violate the
project's own law**, and would do it in the medium the law is strictest about.

The redemption is real and it is better than parity: Softanza knows the **intent** and the
**role**, because `.zui` declared them. A browser infers an accessibility tree from markup;
Softanza could *emit* one from declared intent, which is strictly better information. But
it must be designed in from the first spike, because accessibility retrofitted onto a
retained-mode toolkit is a multi-year tax — ask anyone who has done it.

**And there is an existing answer: AccessKit.** Found via the toolkit survey rather than
looked for. It is a cross-platform abstraction over the platform accessibility APIs —
**UI Automation** (Windows), **NSAccessibility** (macOS), **AT-SPI** (Linux),
**Java accessibility** (Android), **UIAccessibility** (iOS) — licensed **Apache-2.0 OR
MIT**, with real adopters: egui, Bevy, Slint, Freya, Xilem. In egui it is a *hard,
non-optional dependency*, and the tree is rebuilt each frame as a by-product of the widget
pass.

Two consequences, and the second is a genuine problem for this proposal:

- **An immediate-mode toolkit can be accessible.** Nuklear's total absence — zero code,
  zero issues in its tracker's history — is Nuklear's failure, not the paradigm's. So
  "retained tree" is not the prerequisite; *declaring what each element is* is.
- **AccessKit has no web adapter.** It is listed as planned; egui falls back to an
  experimental built-in screen reader in the browser. So the accessibility story would be
  **solid natively and unsolved on the web** — the inverse of the usual situation, and it
  lands squarely on this proposal's transversality claim.

**2 · Text input — and it is now quantified, not feared.**

| Scope | Evidence-backed cost |
|---|---|
| Latin-only field, no IME, no bidi | days — **and it is a trap, because it looks finished** |
| + IME on one platform | weeks to a few months |
| + IME on Windows, macOS, Linux, Android, Web | **1–3 engineer-years, and it never closes** |
| + correct bidi *editing* | **+1–3 engineer-years** |
| + selection, graphemes, clipboard, undo | +3–6 months |

The evidence is not anecdote. Firefox's Windows TSF bug was estimated at *"10–15 man days"*
and stayed open about eight years. GLFW's IME request has been open since **2013** — thirteen
years. `winit` still lists Windows as partial and iOS and Android as absent. Flutter's
Windows embedder still uses IMM32 rather than TSF, so Windows Voice Typing and handwriting
**cannot type into a Flutter text field at all**. And Zed — well funded, custom renderer —
carries roughly **ten open IME bugs simultaneously**, including a memory leak during Chinese
composition; Alacritty has had IME crashes and a **preedit leaking into a password field**.

**The two primitives every platform IME demands**, on Windows (`GetTextExt`,
`GetACPFromPoint`), macOS (`firstRectForCharacterRange:`, `characterIndexForPoint:`),
Android, and the Web's `EditContext` alike:

> **1. the screen rect of a character range · 2. the character index at a point**
>
> If the text layout can answer those two at any time, IME is expensive but tractable. If
> it cannot, **IME is impossible — and that is discovered late.**

**And bidi editing is a scope decision, not an engineering one.** UAX #9 specifies
reordering for *display* and says nothing about caret movement, selection or deletion —
those are entirely the implementation's. Platforms disagree: Windows, Android, Word and
Docs move the caret **logically**; macOS moves it **visually** with a split caret; GTK
visual, Qt logical. **Blink moved from visual to logical in Chrome M76**, saying plainly
that *"visual movement is very complicated… based on hacks with many bugs, which we don't
want to maintain any more"* — and that it was blocking their layout rewrite. Gecko's meta
bug for the same thing ran from 2003 with 35 dependants.

> **Choosing logical caret movement up front is the single highest-leverage scope decision
> in this entire area.**

**A correction to something I said twice.** I claimed Softanza's text pipeline is "ahead of
egui's". True for *display* and misleading for *editing*. SheenBidi gives bidi resolution;
HarfBuzz gives shaping — and HarfBuzz says so itself: *"HarfBuzz won't help you with
bidirectionality… won't help you with line breaking, hyphenation, or justification."*
Anyone who says "we already have HarfBuzz" has budgeted roughly **15% of the problem**.
Line breaking, hit-testing, caret affinity, selection rectangles and the edit model are all
still absent — and the boundary is telling: **DirectWrite, CoreText, Pango and SkParagraph
all stop at hit-testing and selection rects, and none of the four ships an edit model.**
Four independent platform stacks drawing the same line is evidence the edit model is not
reusable.

### 5.2.1 A finding for the graphics plane, and it is time-sensitive

`gpu_text.zig` exposes `textLayout(font_id, utf8, size_px)` and the Ring face offers
`WidthOf`, `RunCountOf`, `GlyphsOf`. **Whether that layout is *reversible* — rect for a
character range, character index for a point, with a leading/trailing affinity bit — is the
question that decides whether a Softanza GUI can ever accept CJK input.**

Adding those two queries while the pipeline is young costs little. Retrofitting them after
the plane hardens is the Firefox story: their TSF work required inventing *query content
events* so the widget layer could interrogate layout, which was most of the eight years.
**This is the sound-plane lesson again — cheap now, ruinous later — and it should be filed
with the graphics plane before anything else in this document is acted on.**

**3 · Keyboard and focus.** Rule 80, Keyboard Sovereignty, is `machine` tier. Focus order,
traversal, escape, and shortcuts are not garnish here — they are legally required, and a
new toolkit starts with none of them.

**4 · Subset drift** — see §6.

## 6. The one thing that makes this safe

If Softanza emits CSS and litehtml renders it, then **litehtml's coverage silently becomes
the definition of what Softanza's UI can express** — and a browser and a native build will
diverge without anyone noticing. That is the drift this whole project exists to prevent,
reappearing at the rendering layer.

The fix is the family's signature move, applied here:

> **The contract is a named CSS profile, not an implementation.** The emitter targets the
> profile. litehtml is one conforming implementation; a browser is another. **Conformance
> fixtures prove they agree** — the same document, rendered both ways, compared on a stated
> set of observables.

Without that, this is a vendoring decision. With it, it is an architecture — and it is
what lets the native path be replaced later without rewriting a single sense sheet.

## 7. Prior art, honestly

- **Flutter** is the closest existing thing to what is proposed: transversal, its own
  layout, one renderer everywhere including embedded. It is proof the goal is achievable —
  and a warning about cost, since its accessibility arrived as a bridge built over years.
- **Sciter** is the closest to *this specific shape* — HTML/CSS as the authoring surface
  over a small native engine — and it is a commercial product, which tells you the niche is
  real.
- **CEF / WebView2** are the alternative that gives JS, full CSS and accessibility for
  free, at the cost of a vast platform-dependent dependency. **Rejecting them is right**
  under the standing doctrine, but the rejection should be written down with its cost, the
  way the miniaudio and ICU decisions were.
- **Immediate-mode GUIs** are wrong here — excellent for tools, structurally hostile to
  accessibility and to a law that demands declared roles.

## 8. Ownership — and why this document is short about it

The proposal touches four owners: `stzlib` (engine, layout, paint), `ringine` (in-scene),
`ringface` (composition — `.face` shipped v0), `zing` (delivery, which chose web).
**The boundary work is harder than the technology**, and none of it is StzZui's to settle.

StzZui's stake is narrow and clear: the GUI system is **a projection**, it must render what
the law requires and refuse what the law forbids, and in exchange it gets to be the first
projection the court can watch (§3).

One flag for `zing`: this proposal does not replace its choice. A generated HTML/CSS
artifact runs in a browser *and* in an embedded engine — that is the point of §1. Zing's
web path becomes one consumer of the same artifact rather than a separate stack.

## 9. What I would do first

A spike, in the house discipline — kill criteria written before the numbers. **Reordered
after the survey: item 0 is new, and it is the only one that is time-sensitive.**

0. **Make the text layout reversible** — rect for a character range, character index for a
   point, with a leading/trailing affinity bit (§5.2.1). File it with the graphics plane
   now. It is cheap while the pipeline is young and it is the eight-year Firefox story if
   it is retrofitted. **Nothing else here should start first.**
1. **Render one real Softanza screen through RmlUi into a `stzCanvas` texture**, with
   `RMLUI_FONT_ENGINE` off and the existing pipeline supplying `FontEngineInterface`.
   Measure layout cost and text quality. *(litehtml is the fallback if the RML-is-not-HTML
   cost proves unacceptable.)*
2. ~~Establish the CSS subset by test.~~ **Answered by the survey: flexbox yes, grid
   nowhere in C/C++.** The remaining question is §10.1's fork, and it is the author's.
3. **Emit an accessibility tree from declared intent** for that same screen, to one
   platform API. *Kill criterion: if the intent declaration cannot produce a usable tree,
   the law problem of §5 has no cheap answer and that must be known before, not after.*
4. **Render the same document in a browser and compare** on stated observables. This is
   the §6 fixture in embryo.

## 10. The landscape, surveyed — and the fork it forces

Both surveys returned. Licences and layout support were verified at source, not read off
feature lists.

### 10.1 The finding nobody expects

> **No open-source C or C++ HTML/CSS engine implements CSS Grid. Not one.**

Confirmed at source level: `litehtml/src/render_flex.cpp` exists; `render_grid.cpp`
**404s**, and there is not one `grid` identifier in its property headers. RmlUi's property
index lists complete flexbox including `gap`, and no `grid-*` at all. Grid exists only in
**Rust** (Taffy, and Blitz/Servo through it), in **WebKit-derived commercial** engines, or
in **Sciter**.

So the first decision is not which engine. It is:

> **Flexbox-only forever — permissive, vendorable, pure C/C++ — or CSS Grid, which costs
> either a Rust toolchain as a hard build dependency or a proprietary licence.**

This constrains the design language of every screen Softanza will ever ship, and it must be
decided deliberately rather than inherited from an engine choice. **My recommendation is
flexbox-only**, on the project's own reasoning: the expression stratum is *relational*, not
metric — `STRUCTURE` declares what is grouped and subordinate, never a track list — so grid
is a projection's implementation detail rather than a contract term. Choosing it keeps the
entire native stack permissive C/C++ with no Rust in the build.

**The trap to avoid: grid on the web tier and flexbox natively.** That is two design
languages wearing one name, and it is precisely the drift this project exists to prevent.

### 10.2 The shortlist

**RmlUi — the pragmatic choice.** MIT, ~54k LOC core, active through August 2026 (6.2 in
January). It is the only candidate satisfying all four hard constraints at once: permissive
vendorable source, **host-supplied renderer** (8 pure virtuals, vertices and indices out),
**no JavaScript engine**, and a **real input model** — focus, keyboard navigation, spatial
navigation for gamepads, text fields with selection and clipboard, and
`ActivateKeyboard(caret_position, line_height)`, which is the IME positioning hook.

Two things tip it decisively for Softanza. **`FontEngineInterface` is pluggable** — set
`RMLUI_FONT_ENGINE` off, drop FreeType, and the SheenBidi → HarfBuzz → GPU pipeline becomes
*the implementation*; there are shipped HarfBuzz **and IME** samples. And its **data-binding
model is a closer architectural cousin to the reactive layer than any JS engine would be.**
It ships in games, so in-scene panels are a trodden path.

**The cost, stated plainly: RML is XML-syntax markup, not HTML.** Element names are
open-ended; unclosed `<br>` and `<img>` will not parse. So *"the same UI in a web app"*
becomes *"the same design language, authored in a dialect, transformed to real HTML for the
web target."* That is an architectural commitment, not a detail.

**litehtml — the doctrinally purest.** **BSD-3-Clause**, ~38k LOC, **zero external
dependencies** with gumbo vendored in-tree, and it parses genuine HTML5. Its
`document_container` text callbacks — `create_font`, `text_width`, `draw_text`,
`split_text` — are a near-perfect socket for the existing pipeline. It is the closest thing
in this category to *"vendor wisely — smart, useful, easy, lightweight."* And v0.10 shipped
**2026-06-13**, not 2024 as most write-ups claim.

Its price: **no focus model, no keyboard navigation, no text editing, no IME, no
accessibility.** You build every one. Right for documents and text-heavy panels; a large
ongoing cost for an application UI.

**Taffy — as a component if grid wins.** MIT, 17k SLoC, `no_std`, and the only actively
maintained layout library with real CSS Grid. Its C API is a **draft PR, not shipped**.

### 10.3 Ruled out, with reasons

**Ultralight** — the licence forbids modification *and* static linking, source is
Enterprise-quote-only, JavaScriptCore is statically linked and unremovable, the free tier
dies the moment $100K is raised regardless of revenue, it is PC-only, and accessibility has
been an open issue since **2018**. Any one of those is disqualifying here.
**Sciter** — not on licence, which is generous, but because **it paints**: it hands back a
finished surface, bypassing the canvas and GPU text pipeline already built. Its flexbox is
also a thin shim over a proprietary `flow` model.
**WebF** — GPL-3 without a signed agreement, and it drags in all of Flutter.
**Blitz** — right architecture, wrong year: self-described **pre-alpha**, 45.7% of CSS WPT
subtests, Rust-only, and MPL-2.0 arrives through Stylo regardless of its own headline
licence. Revisit in 2027.
**Stylo standalone** — `TElement` has 46 required methods using associated types and
generic iterators. **That does not cross a C ABI.** "Zig vendors Stylo" is not an available
architecture.
**Lexbor, NetSurf's libraries** — parse and cascade only, no layout. Lexbor is worth
remembering as a possible HTML/CSS *front-end*.

### 10.3b The third option, and the precedent that validates it

I framed this as engine-versus-engine. The final survey shows a third path, and it is the
one that matches this project's doctrine most closely: **compose small libraries.**

**Slint does exactly this, commercially, today.** Its `Cargo.toml` leases **Taffy** for
layout, **Parley** for text, **AccessKit** for accessibility, plus winit, muda and
Skia/FemtoVG. It reaches roughly Flutter's feature set **at about a tenth of the source
volume** — almost entirely by leasing where Flutter built or forked. That is not a theory
about small dependencies; it is a shipping product built the way Softanza's vendoring
doctrine already points.

For a Zig project the layout piece would be **Clay**: **zlib** licence (no binary
attribution obligation, unlike MIT), a single header of **5,058 lines**, **zero
dependencies including no libc linkage**, arena-allocated with no malloc, 15 KB compiled to
WASM, and three independent Zig binding sets already exist. It emits a flat sorted
`Clay_RenderCommandArray` — rectangles, text, images, borders, scissors, and a **`CUSTOM`**
command that is a first-class extension seam — which composites into a canvas *or* a 3D
scene. Its text hook takes a `ptr+len` slice, which suits the existing pipeline exactly.
Its weakness is a bus factor of one and no tagged release in fourteen months; its mitigation
is that 5,058 lines of readable dependency-free C is genuinely forkable, which Yoga and
Taffy are not.

**One trap to record before anyone reads Yoga's headers:** 43 CSS Grid functions landed in
Yoga's *public API* on 2026-03-05 as "part 1/9", and **there is no grid file under
`yoga/algorithm/`** and nothing since. **The API advertises grid; the engine cannot do
grid.** Plan Yoga as flexbox-only.

### 10.4 The cost, now measured rather than feared

| Piece | Evidence-backed cost |
|---|---|
| IME across five platforms | **1–3 engineer-years**, never closes |
| Bidi *editing* on top | **+1–3 engineer-years** — unless logical caret movement is chosen |
| Accessibility from scratch, five platforms | **3–6 engineer-years** |
| …adopting **AccessKit** instead | cuts the *adapter* half only |

AccessKit's adapters, measured from source: Windows 3,763 lines, macOS 2,590, Android
2,403, iOS 2,499, Unix 801, plus 4,200 for AT-SPI translation and a **182-role, 22-action**
schema. Chromium's Windows equivalent alone is a 329 KB source file. **The semantics tree —
merging, dirty tracking, stable IDs, traversal order, text segmentation — is comparable in
size again and is the part no library removes.** And AccessKit itself still lacks rich
text, tables, tree views, menus, combo boxes and scrollable areas.

**On the web the news is worse than expected.** Virtual accessibility nodes were
**abandoned** by the working group. Canvas hit regions are **dead** — removed from the
WHATWG standard, MDN pages deleted. The only viable path is a **mirror DOM**, which Figma
built over roughly **four years**, positioning elements with CSS affine transforms rather
than visually-hidden CSS because the latter breaks magnifiers and voice control.

**And the single most useful number in the entire survey.** Flutter could not write an
accessibility tree, so it **forked Chromium's**: `third_party/accessibility/` is **228
files, 3,467,964 bytes of C++**, and its README freezes it — *"New features or changes that
change the behaviors of these classes are discouraged."* Slint's equivalent is **40,211
bytes of AccessKit glue.**

> **3.3 MB forked and frozen, against 40 KB leased.** That is the argument for treating
> AccessKit as the highest-leverage single dependency available to anyone building a
> toolkit, and it is not close.

### 10.4b Layout is about 15% of a toolkit — the rest, measured

The temptation with a layout engine is to think the problem is solved. Flutter's own source,
counted by subsystem, says otherwise. **Non-layout, non-paint surface: ~6.6 MB.**

| Subsystem | Size | Note |
|---|---|---|
| Scrolling | **1,051 KB** (~32k lines) | includes a **physics engine with two national dialects** — bouncing for iOS, clamping for Android — and *slivers*, a **second layout protocol** invented because box constraints cannot express lazy infinite content |
| Text input, IME, selection | **686 KB** (~20k lines) | `editable_text.dart` alone is 277 KB |
| **Keyboard mapping alone** | **569 KB** | *half a megabyte just to know which key was pressed* |
| Gestures and hit-testing | **462 KB** | the famous gesture *arena* is only 10 KB of it; the rest is velocity estimation, pointer resampling and per-platform touch slop |
| Focus | **238 KB** | a **separate sparse focus tree** parallel to the widget tree, with pluggable traversal policies |
| Intents, actions, shortcuts | **184 KB** | |
| Accessibility | 276 KB Dart **+ 3.47 MB C++** | the fork above |

**And one instruction that follows directly, for a project with SheenBidi already in the
pipeline and Arabic as a first-class case:** RTL is not a feature you add. Flutter needed a
single dedicated PR introducing `Directionality` as an inherited widget and
`EdgeInsetsDirectional`, touching the core layout files, because **text direction is a
parameter threaded through the layout protocol itself** and cannot be retrofitted cheaply.
**Design it in from commit one.**

### 10.5 What this changes about the recommendation

**Phase by where the platform gives things away.**

The web tier gets **IME, accessibility and CSS Grid free from the browser**. The native tier
pays multi-engineer-years for the first two. That is not an argument against the native
GUI — it is an argument about *order*:

1. **Web stays the delivery path for business applications**, as Zing already chose. Nothing
   in this survey argues for changing that, and a great deal argues against.
2. **Start the native tier with the in-scene and game case**, not the business-app case.
   There the graphics plane's strengths are highest, RmlUi is proven, in-world panels are
   routine — and the constitution's hardest requirements, Rule 60's screen-reader duty and
   Rule 80's keyboard sovereignty, are least binding on a game HUD, which the preamble's
   scope (*"business users… under pressure, responsibility, fatigue and risk"*) does not
   reach.
3. **Do not point a native GUI at operator-facing business software until accessibility and
   IME are funded as multi-year work.** Doing so would ship a product that violates this
   project's own law, in the medium where it is strictest.

**And the transversality claim resolves the way §10.1 implies**: one *contract*, three
conforming tiers — browser for web, RmlUi-or-litehtml for native and in-scene, LVGL or
nothing for small devices — with the sense sheet as the artifact all three consume and
fixtures proving they agree.

### 10.6 The recommendation, in one place

**Adopt AccessKit regardless of everything else.** 40 KB against 3.3 MB is not a trade-off,
it is a correction. Nothing else in this survey is that clear.

**Then choose between three, not two:**

| | Buys you | Costs you |
|---|---|---|
| **RmlUi** | layout, markup, reactive data-binding, focus, keyboard nav, gamepad navigation, text fields, the IME positioning hook — with `FontEngineInterface` and its `TextShapingContext` taking your text pipeline | **RML is not HTML.** The web target needs a transform, and the design language becomes a dialect |
| **Clay + compose** *(the Slint model)* | maximum doctrine fit: zlib, 5k lines, zero deps, trivially Zig-native, forkable | **you own the 6.6 MB of §10.4b** — scrolling physics, gestures, focus, keyboard, IME |
| **litehtml** | real HTML5, BSD-3, zero deps, the purest vendoring unit | you own everything above layout *including* the input model, and no reactive layer |

**My recommendation: RmlUi**, because it is the only candidate that already solves layout,
a declarative authoring surface, *and* a reactive binding model simultaneously while
leaving the renderer and the text stack to the host — and because the 6.6 MB in §10.4b is
the real cost of the alternative, not the layout engine.

**But if the RML-is-not-HTML cost is judged unacceptable** — and it is a legitimate
judgement, since "the same design in a web app" is the proposal's own premise — then the
honest answer is not litehtml. It is **Clay plus composition**, accepting the 85%, on
Slint's precedent. Do not pick litehtml expecting to avoid that bill; litehtml avoids the
markup dialect and charges the same 85% anyway.

**One deadline worth knowing.** The US DOJ's Title II rule binds state and local government
**mobile apps** to WCAG 2.1 AA, with deadlines of **April 2027** and **April 2028**; the
European Accessibility Act already covers kiosks, ATMs, banking and e-commerce — exactly
the embedded and custom-UI territory. Accessibility here is not only this project's own
law; for some buyers it is statute, which is §8's tier 0 again.

## Honest boundaries

- ~~**Everything in §2 about litehtml needs verification.**~~ **Verified — see §10.**
  BSD-3-Clause, zero external dependencies, flexbox since v0.9, no grid, v0.10 in June 2026.
  Two widely-repeated claims were wrong and are corrected there: litehtml's and RmlUi's
  latest releases are both 2026, not 2024/2025.
- **This is a reflection, and reflections are cheap.** The spike in §9 is the first thing
  that would tell us anything real, and item 2 could end the proposal.
- ~~**I have not read the graphics plane's windowing or input situation.**~~ **Checked —
  see §2.1.** The window, the frame loop and the painter all exist; the event model, text
  input and focus do not. The correction runs in the proposal's favour on the first count
  and against it on the second, which is the more useful direction to be wrong in.
- **The landscape survey is partial, and deliberately so.** The toolkit strand has returned
  Nuklear, egui and LVGL; the embeddable HTML/CSS strand is still out, and it carries the
  two facts that matter most — **litehtml's actual licence, and its flex/grid maturity**,
  which is a kill criterion. §2's litehtml claims stand only until that lands.
- **The accessibility and text-input deep-dive was stopped before it reported.** What is
  recorded in §5.1 arrived incidentally through the toolkit strand and is solid. What was
  *not* obtained: the per-platform cost of implementing UIA / AT-SPI / NSAccessibility
  directly, the IME and bidi-editing research, and any effort estimate. **Treat §5.2 and
  §5.3 as unquantified**, and note that this is the one area where I would not trust a
  guess — the evidence already in hand is that egui, funded and actively released, has had
  bidi *editing* open as an issue since 2021.
- **The accessibility finding is the one I would not defer.** Every other risk here is an
  engineering cost. That one is a conflict with the constitution, and discovering it in
  year two would be much worse than designing for it in week one.
