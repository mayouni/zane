# StzZui — Architecture

**Status**: founding document, 2026-08-05
**Inherits from**: Zin `doc/spec/dsl/ZUI_SPECIFICATION_v3_0.md` (Session 27) and the StzWeb Zui Constitution (v1.0 → v3.6 lineage)

---

## 1. The fundamental inversion

Most UI frameworks begin with a physical assumption — screens, widgets, layouts — and try to infer what the user intends. Zui inverts the order: **it starts from human intent and treats rendering as a consequence.** A human does not come to an interface to click a button; they come to discover, focus, read, compare, select, act, confirm, and understand consequences. This inversion is what makes interface correctness *compilable*: once intent is explicit, violations are detectable before the interface ships, not after users complain.

Stated as identity: **StzZui is a declarative, compilable language for intent-driven UIs.** The constitution is the language's semantic layer — the reason the compiler refuses — and the projections are its back ends. Zin and every other project are consumers of the language; Zin's compiler is today's reference implementation, not the owner. The whole assembly deploys inside any software project and holds at three moments: design (declarations checked before a pixel), development (builds linted, findings cite numbers), runtime (the painted page measured).

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
| The language (Layer 1) | **Owned by this project and specified here** — [`doc/language/`](language/README.md) v1.0: the grammar in EBNF, the ten declaration types, the diagnostic contract. Parsed today by Zin's compiler (`src/compiler/parser.zig`, `ir_emitter.zig`) — a consumer serving as reference implementation | Implementations prove agreement against [`conformance/`](../conformance/README.md) — 30 fixtures with known verdicts, four conformance levels |
| The Constitution (Layer 2) | **Canonical here** — `constitution/rules.json` v3.7.2 | Stays; consumers pin versions |
| `.zui` declarations | Live in Zin projects (e.g. `projects/restolean/src/model/restaurant.zui`) | Unchanged — Zin consumes the spec from here |
| Compile-time violation checks | Zin `semantic.zig` implements **four** Zui diagnostics today: `ZUI-W001` (INTENT_FLOW without SATISFIES), `ZUI-E001` (invalid PERSPECTIVE), `ZUI-E002` (invalid TONE), `ZUI-W010` (unresolved INTENT_FLOWS ref) | The ten named violations (`INTENT_ORPHAN`, `SELECT_ACT_COLLAPSE`, `READ_ACT_COLLAPSE`, `MISSING_UNDO`, `MISSING_CANCEL`, `TRAPPED_FLOW`, `INVISIBLE_STATE`, `HIDDEN_AUTHORITY`, `LAYOUT_DISPLACEMENT`, `DECORATIVE_ANIMATION`) are the **specified contract, not yet implemented anywhere** — M3 builds them against a published spec and conformance fixtures ([decision doc](decisions/M3-the-zui-verifier.md)) |
| Rendered-page measurement | `tools/ui-audit.html` (ported from StzWeb) — measures Rules 105, 107, 108, 114–116 on any same-origin application UI | Grows one measurement per machine-checkable rule |
| Runtime enforcement | StzWeb's `stzw check` (Zig) lints declarations and cites rule numbers | Remains in StzWeb; other consumers implement their own against the pinned law |

## 4. The two enforcement instruments

The constitution is enforced twice, at two different moments:

1. **Before rendering** — the *declaration* checker (the zui compiler). Works on intent flows and surface declarations; catches structural violations (a flow with no EXIT, an ACT with no UNDO, a SELECT that mutates). Zin's compiler parses the whole grammar today and enforces four Zui diagnostics; the structural violations above are specified and awaiting M3. Six of the ten are decidable from a single declaration — `SATISFIES` and `ALWAYS_REACHABLE` are written in the `.zui` file — and four need a symbol table from other pillars ([decision doc](decisions/M3-the-zui-verifier.md) §3).
2. **After rendering** — the *measurement* tool (the UI audit). Works on the actual painted page of any application served same-origin; catches what static analysis cannot see (computed size, composited contrast, real layout at a real width). This is what `tools/ui-audit.html` does today.

A rule's `enforcement` field says which instrument owns it: `machine` (declaration checker), `tool` (measurement), `judgment` (human, until an instrument is invented — the enforcement ladder).

## 5. The consumer contract

- A consumer **pins a version** of `rules.json` and records it (StzWeb pins v3.6 as of this founding).
- **A version denotes exactly one file.** `MAJOR.MINOR` moves when the law's substance moves — a rule canonized, amended, retired, or promoted up the enforcement ladder. A third component, `MAJOR.MINOR.PATCH`, marks a correction that changes no rule's substance: a stale pointer in a `lint` field, a broken path, a brand name left in normative prose by the law's first home. A consumer pinned at `x.y` loses no protection by staying there when `x.y.z` appears — that is the whole meaning of the patch component. First used at v3.7.1 (2026-08-06).
- **The substance test**, which decides which component moves: *does any interface that was lawful before become unlawful after — or must any conforming implementation change anything it does?* If no, it is a correction, however much prose changed. Editing a rule's wording is not by itself an amendment; changing what the rule requires is. Applied at v3.7.2, where seven passages were de-branded and not one requirement moved.
- **Evidence is never corrected.** An `evidence` field records what happened, under the names things had when it happened; so does the `lineage`. A tool renamed later does not falsify the record, and rewriting it to match today's vocabulary would destroy the trail Article VII depends on. Pointers are corrected; history is not.
- Findings **cite rule numbers**; numbers are stable forever — retired numbers are never reused, burned numbers stay burned (84, 88).
- Amendment happens **here**, by Article VII: evidence, operator feedback, documented failure. A consumer needing a new rule submits the evidence; fashion is not admissible.
- The projection owns *how* it renders; it has zero freedom over *what*: it cannot hide an available action, show a forbidden one, drop a declared UNDO, or strip EXIT from a multi-step flow.

## 6. The AI-agent surface as a projection

The novel jurisdiction. Set 31 (Intelligence Under Law) already governs the agent as an *actor*; the projection work extends the law to the agent as an *interface*: the chat stream, the tool-approval prompt, the generated artifact. Rule 121 (the assistant never masks the work) and Rule 124 (the generator ships a working thing) are the first two laws written for this medium. The thesis: the "déluge" chat interface is not a fatality — it is an unexamined projection that has never been made to answer to a constitution.

## 7. Credits and lineage

- The three-layer model, the 24-verb grammar, and the named compile-time violations originate in **Zin's Zui pillar** (ZUI_SPECIFICATION v3.0, Session 27).
- The rules corpus, the constitution-as-data discipline, the enforcement tiers, the evidence requirement, and the audit tooling originate in **StzWeb's Zui Constitution** (v1.0 → v3.6).
- The colour, widget-role, navigation and i18n rules (117–122) were forged in **ZinBank** and the **Zin i18n decisions**; the reading-arc rule (123) in the **Refine** site rebuild; the generator's duty (124) in Zin's build-target culture. See [HARVEST-2026-08.md](HARVEST-2026-08.md).
