# StzZui — Roadmap

Milestones are cumulative; each ships complete or not at all (Rule 124 applies to us first).

## M1 — The law at home ✅ (2026-08-05, this commit)

- `constitution/rules.json` canonical here: v3.7, 117 rules, 31 sets, 7 articles.
- Rules 117–124 canonized from the ZinBank / Zin / Refine harvest ([doc/HARVEST-2026-08.md](doc/HARVEST-2026-08.md)).
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

A CLI that checks declarations against the law. **The premise changed on contact with the code**: this is not a lift. Zin parses the whole Zui grammar and enforces four diagnostics (`ZUI-W001`, `ZUI-E001`, `ZUI-E002`, `ZUI-W010`), but the ten named violations are specification — they are implemented nowhere. M3 is new implementation against a published spec and fixtures. See **[the decision document](doc/decisions/M3-the-zui-verifier.md)**, written with Zin.

- ✅ Decision document opened (2026-08-06): the audit of Zin's compiler, the three options (extract · embed · pillar-filter-first), the recommended sequence, and the open questions Zin must answer.
- The sequence it recommends: **fixtures and spec first** (StzZui's own work, no dependency on the answer, and what makes the A-vs-B choice reversible) → **Zin's pillar filter** (~10 lines, answers the cross-pillar question empirically) → **then decide** extract vs embed against evidence.
- ✅ **The language spec published** (2026-08-06) at **[`doc/language/`](doc/language/README.md)** — four documents: the specification and its conformance levels, [the grammar in EBNF](doc/language/GRAMMAR.md) (stated formally for the first time; Zin's spec has none), [the ten declaration types](doc/language/DECLARATIONS.md), and [every diagnostic bound to the rule it enforces](doc/language/VIOLATIONS.md). It separates what the language *is* from what any implementation has reached, and credits Zin as the reference implementation.
- ✅ **The conformance fixtures published** (2026-08-06) at **[`conformance/`](conformance/README.md)** — 30 `.zui` declarations with known verdicts, a machine-readable [diagnostic contract](conformance/violations.json) and [suite manifest](conformance/manifest.json). Every violation fixture has a lawful twin, the way the Gotchas do. Comparison is by diagnostic id only — never line numbers, wording or order — so implementations agree about the law and not about presentation.
- ✅ Each violation bound to the constitutional rule it enforces, in data (`violations.json`), so a verifier's output cites the law rather than expressing opinions.
- ✅ **Four conformance levels** defined, which is what makes an implementation's claim honest: 1 syntax · 2 local semantics (**the standalone verifier's real target** — six of the ten violations live here) · 3 cross-pillar, given a symbol table the manifest supplies · 4 projection. A fixture above your level is *skipped, not failed*.
- ✅ **The verifier shipped** (2026-08-06) at **[`tools/zui/`](tools/zui/README.md)** — `zui check`, plus a conformance runner. **Passes all 30 fixtures at every level**; enforces 19 of the 20 diagnostics, including all six locally-decidable named violations. Zero dependencies, runs on Node or in a browser, and loads its diagnostic contract and citations from `violations.json` and `rules.json` rather than hardcoding them — the tool cannot drift from the law it enforces.
- **The language choice**, made and reversible: dependency-free JavaScript, not Zig. §1 of the decision document destroyed the extraction premise (there was nothing to lift), which removed most of the argument for inheriting Zin's toolchain; what remained was the product promise — *deployable inside any software project* — and Node is the runtime the projects that ship UIs already have. **Because the suite exists, this forecloses nothing**: a Zig implementation beside Zin's compiler would be measured against the same 30 fixtures. That is exactly what writing the fixtures first bought.
- Still open, and Zin's call: **the pillar filter** (~10 lines, useful to Zin on its own terms) and whether Zin wants the ten violations implemented in its compiler too. Open questions are in the decision document §7.
- Honest remainder: the four cross-pillar checks work only when a symbol table is *supplied*; computing one from a host project is unbuilt. `LAYOUT_DISPLACEMENT` is not a verifier's job at all — the UI audit measures it.

## M4 — Rendering projections

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
