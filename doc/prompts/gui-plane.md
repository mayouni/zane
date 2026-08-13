# The Softanza GUI plane — design and implementation

**Run in**: `D:\GitHub\stzlib`
**Session**: **a new, dedicated one.** Not inside the graphics session — see "Why a separate
session" below.

**Precondition, and it is a real gate**: the reversible-text-layout finding must be filed
with the graphics plane first, and ideally landed. See §0.

**Standing**: the engine choice is **made**. RmlUi. This session implements; it does not
re-run the survey. The conditions under which that choice would be revisited are in §2.4.

---

## Why a separate session

The graphics plane drew this boundary itself, deliberately, in `stzWindow`'s own header:

> *"WHAT A WINDOW IS NOT: it is not a widget toolkit. There are no buttons, no layout, no
> menus. It is a rectangle that shows what the graphics plane computes and reports what the
> user did — which is the part a graphics engine owes; **the rest is a different product**."*

This is that different product. It gets its own directory, its own plan of record, its own
phases and its own kill criteria, exactly as sound, graphics, GPU and locale each did. Three
further reasons: it depends on more than graphics (AccessKit, platform IME, the reactive
layer, StzZui's sense sheet); it is a multi-year programme whose status sections would make
the graphics plan incoherent; and the graphics session is live with uncommitted work.

**What stays with graphics** is §0, and only §0.

---

## Read, in this order

1. `D:\GitHub\stzzui\doc\GUI-SYSTEM.md` — **in full.** It is the survey and the decision:
   why RmlUi, what was ruled out and why, the measured costs, and the traps. Everything
   below assumes it.
2. `D:\GitHub\stzzui\doc\STZSENSE.md` — **§12 especially**, which establishes that HTML and
   CSS are *emitted, never authored*. §5 of this prompt extends that rule to RML.
3. `base/graphics/SOFTANZA_GRAPHICS_PLAN.md` — **GR5 in particular** (window, frame loop,
   input sampling), plus the plan's shape and its vendoring discipline.
4. `base/sound/SOFTANZA_SOUND_PLAN.md` — for house style: kill criteria written before the
   numbers, FACTs surveyed not assumed, a challenge pass before the faces, STATUS sections
   that record what was *not* measured.
5. `engine/SOFTANZA_LOCALE_PLAN.md` — **L0's vendoring decision** is the precedent: generate
   offline, commit the output, own the refresh, and do not adopt a large framework.
6. `base/doc/design/SCOPE_ORIENTED_PROGRAMMING.md` — a GUI has hidden frames too, and §7
   asks you to run M1–M5 on them.

---

## §0 · The gate — file this with the graphics plane before anything else

**The two primitives every platform IME demands**, on Windows (`GetTextExt`,
`GetACPFromPoint`), macOS (`firstRectForCharacterRange:`, `characterIndexForPoint:`),
Android and the Web alike:

> **1. the screen rect of a character range · 2. the character index at a point**, with a
> leading/trailing affinity bit.

`gpu_text.zig` exposes `textLayout(font_id, utf8, size_px)`; the Ring face offers
`WidthOf`, `RunCountOf`, `GlyphsOf`. **Whether that layout is reversible decides whether a
Softanza GUI can ever accept CJK input.** Adding the queries while the pipeline is young
costs little; retrofitting them is the Firefox story — their TSF work required inventing
*query content events* so the widget layer could interrogate layout, and that was most of
eight years.

File it as a cross-plane finding in the genre that plane already uses. **Do not build it
here, and do not start G1 without it.**

---

## §1 · What this plane is, and is not

**It is** the widget, layout and interaction layer above the graphics plane: RmlUi for
layout and markup, rendering through `stzCanvas`, text through the existing SheenBidi →
HarfBuzz → rasterization pipeline, accessibility through AccessKit, behaviour through the
reactive layer, authored declaratively from Softanza rather than by hand.

**It is not**: a renderer (graphics owns that), a semantic law (StzZui owns that), a
composition binder (`.face` owns that), or a delivery mechanism (Zing owns that).

**The four constraints RmlUi was chosen to satisfy simultaneously** — restate them in the
plan so no later phase quietly trades one away:

1. permissive, vendorable source (**MIT**);
2. **the host supplies the renderer** — 8 pure virtuals, vertices and indices out;
3. **no JavaScript engine**;
4. a **real input model** — focus, keyboard navigation, gamepad/directional navigation, text
   fields with selection and clipboard, and `ActivateKeyboard(caret_position, line_height)`,
   which is the IME positioning hook.

---

## §2 · Decisions to record in the plan before writing code

Each of these is settled by `GUI-SYSTEM.md`. Record them with their reasoning, because a
later session will otherwise re-litigate them badly.

**2.1 · Flexbox only. No CSS Grid.** No open-source C/C++ engine implements grid — verified
at source. The alternative costs a Rust toolchain or a proprietary licence. This constrains
the design language of every screen Softanza ships, and it is deliberate: the expression
stratum is *relational*, not metric.

**2.2 · Logical caret movement**, not visual. Blink retreated from visual in Chrome M76
saying it was *"based on hacks with many bugs"* and that it blocked their layout rewrite;
Gecko's meta bug ran from 2003 with 35 dependants. This is the single highest-leverage
scope decision in the text area.

**2.3 · RTL from commit one.** Text direction is a parameter threaded through the layout
protocol, not a feature added later — Flutter needed a dedicated PR introducing
`Directionality` across its core layout files. With SheenBidi already in the pipeline and
Arabic a first-class case, this is a differentiator; retrofitted, it is a rewrite.

**2.4 · When RmlUi would be revisited.** Name the conditions now, so the answer is evidence
and not fatigue: if the `TextShapingContext` hook cannot carry what HarfBuzz needs (G0), if
render-to-texture text quality fails at oblique angles (G0), or if the project's licence or
maintenance posture changes. **Absent one of those, the choice stands.**

---

## §3 · Phases

House discipline throughout: kill criteria written **before** the numbers, a challenge pass
before the faces, and a STATUS section per phase recording measurements *and what was not
measured*.

**G0 · The spike.** One real Softanza screen through RmlUi into a `stzCanvas` texture, with
`RMLUI_FONT_ENGINE` off and the existing pipeline supplying `FontEngineInterface`.
*Kill criteria, stated first*: does `TextShapingContext` carry enough for HarfBuzz shaping?
What is layout cost per frame, and does caching make re-layout-on-change viable? Is text
legible in a texture mapped at an oblique angle? **If shaping cannot be plugged in, stop —
that was the whole reason RmlUi won.**

**G1 · The render interface.** The 8 pure virtuals against `stzCanvas`; `PushLayer` /
`CompositeLayers` / `SaveLayerAsTexture` for the in-scene case. Prove a panel inside a 3D
scene, since that is the tier this plane starts with (§6).

**G2 · The font engine.** Replace FreeType outright. This is where bidi and Arabic are
proven, and where the plane's advantage over every surveyed toolkit is realised — egui has
no bidi after five years; LVGL has positional forms without a shaping engine; Avalonia has a
six-year tail of RTL regressions.

**G3 · Input, events and focus.** The real gap: graphics input is *polled*
(`KeyPressed`, `MouseClicked`), which is the game-loop shape and cannot express which
element was hit, who has focus, or what bubbles. Build a routed event model, a **sparse
focus tree separate from the widget tree**, and traversal policies. Adopt the **WAI-ARIA APG
keyboard contract** — one tab stop per composite widget, arrows within — as it is the only
genuinely cross-platform semantic standard. Rule 80, Keyboard Sovereignty, is `machine`
tier: this phase is legally required, not optional polish.

**G4 · Accessibility, via AccessKit — and not last.** Flutter forked Chromium's
accessibility code (228 files, 3.47 MB of C++) and froze it; Slint leased AccessKit in 40 KB
of glue. Adopt AccessKit: Apache-2.0 OR MIT, bridging UI Automation, NSAccessibility,
AT-SPI, Android and iOS. **Know its limits before designing around it**: no rich text or
hypertext, no AT-SPI `Collection`, and **no web adapter**. Two structural warnings from the
survey — *virtualised lists are the universal failure mode* in every custom renderer
examined, and *every toolkit gates accessibility behind a performance flag, which is where
users silently get nothing.* Do neither.

**G5 · The declarative surface.** Softanza declarations → RML/RCSS, with RmlUi's
data-binding wired to the reactive layer. Its `data-` attributes and `{{ }}` expressions are
a closer architectural cousin to Reaxis than any JS engine would be — use them rather than
inventing a parallel mechanism.

**G6 · The sense sheet lands.** `stzSense` → RCSS for this tier, and → CSS variables for the
web tier, from one artifact. This is where the whole semantic stack meets the renderer.

**Deferred, and costed rather than forgotten: IME.** 1–3 engineer-years across five
platforms, and it never fully closes — GLFW's request has been open since 2013; Zed carries
~10 IME bugs simultaneously. §0 makes it *possible*; nothing here makes it cheap.

---

## §4 · The CSS profile is a contract, not an implementation

If Softanza emits RCSS and RmlUi renders it, **RmlUi's coverage silently becomes the
definition of what Softanza's UI can express**, and the native and web tiers diverge without
anyone noticing — the drift this whole project exists to prevent, reappearing at the
rendering layer.

> **Name a CSS/RCSS profile. The emitter targets the profile. RmlUi is one conforming
> implementation; a browser is another. Fixtures render the same document both ways and
> compare on stated observables.**

Without that, this is a vendoring decision. With it, it is an architecture — and the native
path can be replaced later without touching a single sense sheet.

---

## §5 · RML is emitted, never authored

`STZSENSE.md` §12.1 establishes that CSS is emitted and never hand-written, because *every
hand-written CSS rule is a meaning that escaped the semantic layer.* **The same rule binds
RML, and harder**, because RML is XML-syntax markup and *not HTML*: element names are
open-ended, and unclosed `<br>` and `<img>` will not parse.

So the architecture is: **Softanza declarations are the contract; RML is one projection and
HTML is another.** The web tier emits HTML for a browser, the native tier emits RML for
RmlUi, and neither is the source of truth. A Softanza application that hand-writes RML has
bypassed its own semantics exactly as one that hand-writes CSS has.

---

## §6 · Order of attack — and the one thing not to do

**Start with the in-scene and game case, not business applications.** There the graphics
plane's strengths are highest, RmlUi is proven in shipped games, in-world panels are routine
— and the constitution's hardest requirements bind least, since Rule 60's screen-reader duty
and Rule 80's keyboard sovereignty are scoped by a preamble addressing *"business users…
under pressure, responsibility, fatigue and risk"*, which a game HUD is not.

**Do not point this plane at operator-facing business software until accessibility and IME
are funded as multi-year work.** Doing so would ship a product that violates this project's
own law, in the medium where that law is strictest. The web tier remains the delivery path
for business applications, as Zing already chose; nothing in the survey argued for changing
that and much argued against.

---

## §7 · Run the Scope-Oriented moves on this field

A GUI has hidden frames, and naming them early is cheaper than discovering them. Candidates
worth an M1 pass: **which coordinate space** a value is in (local, layout, window, screen,
texture — the bug factory in every toolkit); **which input source** an event came from
(pointer, keyboard, gamepad, synthetic, assistive technology); **which tier** a surface is
rendering to (in-scene, window, texture). Ask M1's real question of each: *an essential
decision, or noise to dissolve?*

---

## Do not

- **Do not fork RmlUi early.** Vendor it with the house `VERSION.txt` discipline — source
  URL, tag, commit, date, SHA-256, the plan section authorizing it — and send patches
  upstream. A fork is a permanent tax; note that Avalonia deleted its second rendering
  backend for want of parity maintenance.
- **Do not implement platform accessibility bridges by hand.** That is the 3.47 MB mistake.
- **Do not build or embed a JavaScript engine**, and do not adopt anything that links one.
- **Do not let this plane compute meanings.** Which meanings exist, and which conflicts are
  refusable, are StzZui's. If this plane grows a `:Danger`, the layering has collapsed.
- **Do not treat this prompt's phase list as fixed.** It was written from a survey, not from
  building. Where contact with the code contradicts it, the contradiction is the most
  valuable thing this session produces.

---

Commit locally, plain factual messages, push nothing without my review. Record outcomes in
the plan file as you go — that is the house rule and the one most often skipped.
