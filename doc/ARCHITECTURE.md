# StzZui — Architecture

**Status**: founding document, 2026-08-05
**Inherits from**: a sibling project's interface specification v3.0 (Session 27) and the StzWeb Zui Constitution (v1.0 → v3.6 lineage)

---

## 1. The fundamental inversion

Most UI frameworks begin with a physical assumption — screens, widgets, layouts — and try to infer what the user intends. Zui inverts the order: **it starts from human intent and treats rendering as a consequence.** A human does not come to an interface to click a button; they come to discover, focus, read, compare, select, act, confirm, and understand consequences. This inversion is what makes interface correctness *compilable*: once intent is explicit, violations are detectable before the interface ships, not after users complain.

Stated as identity: **StzZui is a declarative, compilable language for intent-driven UIs.** The constitution is the language's semantic layer — the reason the compiler refuses — and the projections are its back ends. Every other project is a consumer of the language, including the one whose compiler serves as today's reference implementation — a consumer, never the owner. The whole assembly deploys inside any software project and holds at three moments: design (declarations checked before a pixel), development (builds linted, findings cite numbers), runtime (the painted page measured).

## 2. Three layers, strictly ordered

Lower layers constrain upper layers. Upper layers never redefine lower layers.

```
LAYER 3 — RENDERING PROJECTIONS      per-medium, replaceable, evolvable
          business web · game worlds · CLI/TUI · voice · AI-agent surfaces
LAYER 2 — THE CONSTITUTION           non-negotiable, machine-checkable, trend-resistant
          constitution/rules.json — 117 rules under 7 articles
LAYER 1 — THE INTENT GRAMMAR         closed, finite, medium-agnostic
          22 verbs: DISCOVER UNDERSTAND LOCATE · FOCUS FILTER COMPARE ·
          READ SCAN SCROLL ZOOM · SELECT HIGHLIGHT PREVIEW MARK ·
          ACT CONFIRM CANCEL UNDO · PAUSE RESUME RETRY EXIT
```

Layer discipline (compiler-enforced where a compiler exists):
- No projection may define a new intent — the grammar is closed, exactly as ZQL's verb set is closed.
- No projection may bypass a constitutional law.
- Every UI element must trace to at least one intent; an orphan element is a compile error.
- Forbidden intent collapses are structural errors: `SELECT → ACT` without `CONFIRM`, `READ → ACT` at all.

## 3. Where each piece lives today, and where it is going

| Piece | Today | Destination |
|---|---|---|
| The language (Layer 1) | **Owned by this project and specified here** — [`doc/language/`](language/README.md) v1.0: the grammar in EBNF, the ten declaration types, the diagnostic contract. Parsed today by the reference implementation's compiler (`src/compiler/parser.zig`, `ir_emitter.zig`) — a consumer, not the owner | Implementations prove agreement against [`conformance/`](../conformance/README.md) — 30 fixtures with known verdicts, four conformance levels |
| The Constitution (Layer 2) | **Canonical here** — `constitution/rules.json` v3.7.3 | Stays; consumers pin versions |
| `.zui` declarations | Live in the reference implementation's projects (e.g. `projects/restolean/src/model/restaurant.zui`) | Unchanged — it consumes the spec from here |
| Compile-time violation checks | **[`tools/zui/`](../tools/zui/README.md)** enforces 19 of the 20 contract diagnostics and passes all 30 fixtures — nine of the ten named violations, six of them from a single declaration. The reference implementation's `semantic.zig` independently implements four (`ZUI-W001`, `ZUI-E001`, `ZUI-E002`, `ZUI-W010`) | Cross-pillar symbol *computation* (the verifier accepts a table today); `LAYOUT_DISPLACEMENT` stays with the UI audit, being a fact about a painted page. Whether the reference implementation implements the ten in its own compiler is its call ([decision doc](decisions/M3-the-zui-verifier.md) §7) |
| Rendered-page measurement | `tools/ui-audit.html` (ported from StzWeb) — measures Rules 105, 107, 108, 114–116 on any same-origin application UI | Grows one measurement per machine-checkable rule |
| Runtime enforcement | Zing's (formerly StzWeb) `zing check` (Zig) lints declarations and cites rule numbers | Remains in Zing; other consumers implement their own against the pinned law |

## 4. The two enforcement instruments

The constitution is enforced twice, at two different moments:

1. **Before rendering** — the *declaration* checker (the zui compiler). Works on intent flows and surface declarations; catches structural violations (a flow with no EXIT, an ACT with no UNDO, a SELECT that mutates). The reference implementation's compiler parses the whole grammar today and enforces four Zui diagnostics; the structural violations above are specified and awaiting M3. Six of the ten are decidable from a single declaration — `SATISFIES` and `ALWAYS_REACHABLE` are written in the `.zui` file — and four need a symbol table from other pillars ([decision doc](decisions/M3-the-zui-verifier.md) §3).
2. **After rendering** — the *measurement* tool (the UI audit). Works on the actual painted page of any application served same-origin; catches what static analysis cannot see (computed size, composited contrast, real layout at a real width). This is what `tools/ui-audit.html` does today.

A rule's `enforcement` field says which instrument owns it: `machine` (declaration checker), `tool` (measurement), `judgment` (human, until an instrument is invented — the enforcement ladder).

## 5. The consumer contract

- A consumer **pins a version** of `rules.json` and records it (Zing, formerly StzWeb, pins v3.7.3).
- **A version denotes exactly one file.** `MAJOR.MINOR` moves when the law's substance moves — a rule canonized, amended, retired, or promoted up the enforcement ladder. A third component, `MAJOR.MINOR.PATCH`, marks a correction that changes no rule's substance: a stale pointer in a `lint` field, a broken path, a brand name left in normative prose by the law's first home. A consumer pinned at `x.y` loses no protection by staying there when `x.y.z` appears — that is the whole meaning of the patch component. First used at v3.7.1 (2026-08-06).
- **The substance test**, which decides which component moves: *does any interface that was lawful before become unlawful after — or must any conforming implementation change anything it does?* If no, it is a correction, however much prose changed. Editing a rule's wording is not by itself an amendment; changing what the rule requires is. Applied at v3.7.2, where seven passages were de-branded and not one requirement moved, and at v3.7.3, where 21 evidence fields stopped naming a third party.
- **Evidence is never corrected.** An `evidence` field records what happened, under the names things had when it happened; so does the `lineage`. A tool renamed later does not falsify the record, and rewriting it to match today's vocabulary would destroy the trail Article VII depends on. Pointers are corrected; history is not.
- **One narrow exception, added at v3.7.3: a third party's name is not a historical fact about the law.** Where evidence named another project — its product, its studio, its foundry — the *event* is the evidence and the name is only an address. A law that belongs to no product cannot require a private project's name to establish its own provenance, and publishing one is a disclosure decision that belongs to that project, not to this one. So a name may be replaced by a description of the same source, on three conditions: the event, its date and its consequence survive intact; the rule's substance does not move; and the lineage records that the replacement happened. **What must never be edited is the event itself** — "two coloured columns in April 2026" is why Rule 117 exists, and no version of this law may lose that. This exception covers names alone. It is not a licence to tidy history.
- Findings **cite rule numbers**; numbers are stable forever — retired numbers are never reused, burned numbers stay burned (84, 88).
- Amendment happens **here**, by Article VII: evidence, operator feedback, documented failure. A consumer needing a new rule submits the evidence; fashion is not admissible.
- The projection owns *how* it renders; it has zero freedom over *what*: it cannot hide an available action, show a forbidden one, drop a declared UNDO, or strip EXIT from a multi-step flow.

## 6. The AI-agent surface as a projection

The novel jurisdiction. Set 31 (Intelligence Under Law) already governs the agent as an *actor*; the projection work extends the law to the agent as an *interface*: the chat stream, the tool-approval prompt, the generated artifact. Rule 121 (the assistant never masks the work) and Rule 124 (the generator ships a working thing) are the first two laws written for this medium. The thesis: the "déluge" chat interface is not a fatality — it is an unexamined projection that has never been made to answer to a constitution.

## 7. Credits and lineage

- The three-layer model, the 24-verb grammar, and the named compile-time violations originate in **a sibling project's Zui pillar** (ZUI_SPECIFICATION v3.0, Session 27).
- The rules corpus, the constitution-as-data discipline, the enforcement tiers, the evidence requirement, and the audit tooling originate in **StzWeb's Zui Constitution** (v1.0 → v3.6).
- The colour, widget-role, navigation and i18n rules (117–122) were forged in **a banking product** and its **i18n decisions**; the reading-arc rule (123) in the **Refine** site rebuild; the generator's duty (124) in the reference implementation's build-target culture. See [HARVEST-2026-08.md](HARVEST-2026-08.md).
