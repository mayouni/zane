# StzZui — Roadmap

Milestones are cumulative; each ships complete or not at all (Rule 124 applies to us first).

## M1 — The law at home ✅ (2026-08-05, this commit)

- `constitution/rules.json` canonical here: v3.7, 117 rules, 31 sets, 7 articles.
- Rules 117–124 canonized from the banking-product / i18n / Refine harvest ([doc/HARVEST-2026-08.md](doc/HARVEST-2026-08.md)).
- The Reader ported and rebranded — the whole law, interactive.
- The UI Audit ported (as "site audit"; renamed 2026-08-05) — six rules measured on any same-origin UI.
- Founding documents: README, ARCHITECTURE, this roadmap.
- Consumer contract stated; Zing (formerly StzWeb) pinned at v3.7.3.

## M2 — The educational showcase ✅ (2026-08-06)

Feel the offense, then feel the law — generalizing StzWeb's Gotchas page (7 offenses) toward full coverage. Each page is self-contained, obeys the law it teaches, and cites the rule numbers it demonstrates. This is the platform's public face: the argument that best practices are not nostalgia, made playable.

- ✅ The site rebuilt around its two readers: Why (the case), How it works (the full architecture, designed instruments honestly labeled), Gotchas, Adopt (the consumer contract).
- ✅ The Gotchas engine ported and extended: 12 offenses — the 7 StzWeb classics plus the five harvested ones: the two greens (117), the card that lies (119), the second row (120), the masking assistant (121), the wall of text (123).
- ✅ The Gotchas split per rule family (2026-08-06): a hub and seven family pages — Stillness, Forms, State, Widgets, Reading, Navigation, Intelligence — sharing one engine stylesheet; single-offense families (Navigation, Intelligence) grow with the harvest. The site's trails adopt the branch convention (a parent shows its children, a leaf shows its ancestors — Rule 115) proven in StzWeb.
- ✅ The vibes exhibit (2026-08-06): `site/vibes.html`, the Article VI page — the same operator screen rendered in both vibes at once, driven by one shared state (act in either pane, the other follows); what may flex listed against what never does. The exhibit's panes force their own vibe, so F2 flips the page around them while they keep showing both cultures.

## M3 — The `zui` verifier (in progress, opened 2026-08-06)

A CLI that checks declarations against the law. **The premise changed on contact with the code**: this is not a lift. The reference implementation parses the whole Zui grammar and enforces four diagnostics (`ZUI-W001`, `ZUI-E001`, `ZUI-E002`, `ZUI-W010`), but the ten named violations are specification — they are implemented nowhere. M3 is new implementation against a published spec and fixtures. See **[the decision document](doc/decisions/M3-the-zui-verifier.md)**, written with the reference implementation's team.

- ✅ Decision document opened (2026-08-06): the audit of the reference implementation's compiler, the three options (extract · embed · pillar-filter-first), the recommended sequence, and the open questions the reference implementation must answer.
- The sequence it recommends: **fixtures and spec first** (StzZui's own work, no dependency on the answer, and what makes the A-vs-B choice reversible) → **the reference implementation's pillar filter** (~10 lines, answers the cross-pillar question empirically) → **then decide** extract vs embed against evidence.
- ✅ **The language spec published** (2026-08-06) at **[`doc/language/`](doc/language/README.md)** — four documents: the specification and its conformance levels, [the grammar in EBNF](doc/language/GRAMMAR.md) (stated formally for the first time; the reference implementation's spec has none), [the ten declaration types](doc/language/DECLARATIONS.md), and [every diagnostic bound to the rule it enforces](doc/language/VIOLATIONS.md). It separates what the language *is* from what any implementation has reached, and credits it as the reference implementation.
- ✅ **The conformance fixtures published** (2026-08-06) at **[`conformance/`](conformance/README.md)** — 30 `.zui` declarations with known verdicts, a machine-readable [diagnostic contract](conformance/violations.json) and [suite manifest](conformance/manifest.json). Every violation fixture has a lawful twin, the way the Gotchas do. Comparison is by diagnostic id only — never line numbers, wording or order — so implementations agree about the law and not about presentation.
- ✅ Each violation bound to the constitutional rule it enforces, in data (`violations.json`), so a verifier's output cites the law rather than expressing opinions.
- ✅ **Four conformance levels** defined, which is what makes an implementation's claim honest: 1 syntax · 2 local semantics (**the standalone verifier's real target** — six of the ten violations live here) · 3 cross-pillar, given a symbol table the manifest supplies · 4 projection. A fixture above your level is *skipped, not failed*.
- ✅ **The verifier shipped** (2026-08-06) at **[`tools/zui/`](tools/zui/README.md)** — `zui check`, plus a conformance runner. **Passes all 30 fixtures at every level**; enforces 19 of the 20 diagnostics, including all six locally-decidable named violations. Zero dependencies, runs on Node or in a browser, and loads its diagnostic contract and citations from `violations.json` and `rules.json` rather than hardcoding them — the tool cannot drift from the law it enforces.
- **The language choice**, made and reversible: dependency-free JavaScript, not Zig. §1 of the decision document destroyed the extraction premise (there was nothing to lift), which removed most of the argument for inheriting the reference implementation's toolchain; what remained was the product promise — *deployable inside any software project* — and Node is the runtime the projects that ship UIs already have. **Because the suite exists, this forecloses nothing**: a Zig implementation beside the reference implementation's compiler would be measured against the same 30 fixtures. That is exactly what writing the fixtures first bought.
- Still open, and the reference implementation's call: **the pillar filter** (~10 lines, useful to it on its own terms) and whether it wants the ten violations implemented in its compiler too. Open questions are in the decision document §7.
- Honest remainder: the four cross-pillar checks work only when a symbol table is *supplied*; computing one from a host project is unbuilt. `LAYOUT_DISPLACEMENT` is not a verifier's job at all — the UI audit measures it.

## C2 — The Diagnostic Contract ✅ (2026-08-12)

Delivered against the Softanza reference design (v1.3, C2), which promotes StzZui's
refusal shape from one project's convention to a family contract. See
[ALIGNMENT.md](ALIGNMENT.md).

- ✅ **[`doc/diagnostic-contract.md`](doc/diagnostic-contract.md) v1.0** — the envelope every court in the family speaks: `{code, severity, message, span{file,line,col}, cites[], language}`, with the code format, the two-rung severity ladder and the citation rule stated normatively, governed by the law's own discipline (substance test, patch component, consumers pin).
- ✅ **[The machine-readable shape](doc/diagnostic-contract.schema.json)** beside it, so a court can validate its own output.
- ✅ **The verifier is the first conforming implementation** — `--json` emits the envelope; the conformance runner validates every diagnostic it emits against the shape. Extracted from existing practice: no rule, no diagnostic's meaning and no verdict changed, and the suite stayed 30/30.

## The Second Founding — proposed, not ratified (2026-08-12)

**[doc/THE-SECOND-FOUNDING.md](doc/THE-SECOND-FOUNDING.md) v0.1** proposes that StzZui
grow from an intent language into a complete platform, on the finding that **the law
legislates a territory the language cannot declare**: 8% of the 117 rules are refusable
before a pixel exists, and all but one of the 25 rules the law itself marks
`machine-later` are expression rules — colour, layout, widget role, message, motion,
timing. Two payment surfaces that differ by seven broken laws are byte-identical as
declarations and both run clean at Level 4.

A second finding (v0.2): **the law is monomodal while believing itself medium-agnostic.**
Across 117 rules the words `sound`, `speech`, `earcon`, `tactile` and `ambient` never
appear; `audio` appears only as a document attachment; both hits for `voice` are
typographic metaphor; the one haptic rule is about touch targets; and the only rule about
how an interface is *heard* is written in ARIA, inside a framework-agnostic constitution.

So it proposes **two axes**: six expression strata as *functions* (`STRUCTURE` `SIGNAL`
`ROLE` `MOTION` `MESSAGE` `TEMPO`) across eight *media* (`visual` `auditory` `voice`
`haptic` `print` `ambient` `machine` `spatial`/`terminal`), closing the `SURFACE_AS` field
the language already carries. Plus a three-tier constitution (core · commons · local) fed
by a capture loop from the operator's own pain, and a protocol pack for ecosystems outside
Softanza. **M4 and M5 below are superseded by its §13 if it is ratified**; M5's MCP
surface survives inside M12.

Awaiting the author's section-by-section pass.

## M4 — Rendering projections *(superseded if the Second Founding is ratified)*

- The intent→widget projection tables (business web, CLI, voice) formalized as data, not prose.
- `zing` (formerly `stzweb`) documented as the reference business-web projection.
- Per-rule enforcement upgrades: move rules up the ladder from `judgment` to `machine`/`tool` as instruments are invented (117 and 118 are candidates — colour-column counting is measurable).

## M5 — The AI-interaction jurisdiction

The law extended to the medium where interfaces are currently worst: AI conversation and agent surfaces.

- Rules for the chat stream itself (the "déluge" problem): scroll ownership, message anchoring, the input field's honesty.
- Rules for tool-approval and consent surfaces.
- An MCP surface serving the law to AI tools — so generators can consult the constitution *while generating*, and cite the rules they obeyed.

## Standing decisions

- License: to be chosen by the author before the repository goes public.
- The repository is local-first until the author decides to publish.
- ✅ Zing (formerly StzWeb) re-pinned to v3.7.3 (2026-08-07).
