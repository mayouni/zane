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

**2 · Text input.** IME for CJK, bidi editing, selection across shaped runs. This is where
toolkits die quietly. The graphics plane's shaping pipeline helps with *display*; editing
is a different and harder problem.

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

A spike, in the house discipline — kill criteria written before the numbers:

1. **Render one real Softanza screen through litehtml into a `stzCanvas` texture**, using
   the existing text pipeline as the `document_container`. Measure layout cost and text
   quality.
2. **Establish the CSS subset by test**, not by documentation — especially flex and grid.
   *Kill criterion: if modern layout is not solidly supported, the emitter's target is
   1990s CSS and the proposal should be re-scoped or refused.*
3. **Emit an accessibility tree from declared intent** for that same screen, to one
   platform API. *Kill criterion: if the intent declaration cannot produce a usable tree,
   the law problem of §5 has no cheap answer and that must be known before, not after.*
4. **Render the same document in a browser and compare** on stated observables. This is
   the §6 fixture in embryo.

## Honest boundaries

- **Everything in §2 about litehtml needs verification.** It is stated from general
  knowledge, not from reading that project's source or licence, and a vendoring decision
  must not rest on it. The licence in particular is unverified.
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
