# StzZui — Roadmap

Milestones are cumulative; each ships complete or not at all (Rule 124 applies to us first).

## M1 — The law at home ✅ (2026-08-05, this commit)

- `constitution/rules.json` canonical here: v3.7, 117 rules, 31 sets, 7 articles.
- Rules 117–124 canonized from the ZinBank / Zin / Refine harvest ([doc/HARVEST-2026-08.md](doc/HARVEST-2026-08.md)).
- The Reader ported and rebranded — the whole law, interactive.
- The UI Audit ported (as "site audit"; renamed 2026-08-05) — six rules measured on any same-origin UI.
- Founding documents: README, ARCHITECTURE, this roadmap.
- Consumer contract stated; StzWeb pinned at v3.6.

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
- The named violations become the contract: `INTENT_ORPHAN`, `SELECT_ACT_COLLAPSE`, `READ_ACT_COLLAPSE`, `MISSING_UNDO`, `MISSING_CANCEL`, `TRAPPED_FLOW`, `INVISIBLE_STATE`, `HIDDEN_AUTHORITY`, `LAYOUT_DISPLACEMENT`, `DECORATIVE_ANIMATION` — six decidable from a single declaration, four needing a symbol table from other pillars.
- Each violation bound to the constitutional rule it enforces, so the verifier's output cites the law.
- Conformance fixtures: declarations with known verdicts, so any future implementation (any language) can prove agreement — the StzWeb three-runtimes discipline applied to the verifier itself.
- Language spec published at `doc/language/`, separating what the language *is* from what any implementation has reached, with Zin credited as reference implementation.

## M4 — Rendering projections

- The intent→widget projection tables (business web, CLI, voice) formalized as data, not prose.
- `stzweb` documented as the reference business-web projection.
- Per-rule enforcement upgrades: move rules up the ladder from `judgment` to `machine`/`tool` as instruments are invented (117 and 118 are candidates — colour-column counting is measurable).

## M5 — The AI-interaction jurisdiction

The law extended to the medium where interfaces are currently worst: AI conversation and agent surfaces.

- Rules for the chat stream itself (the "déluge" problem): scroll ownership, message anchoring, the input field's honesty.
- Rules for tool-approval and consent surfaces.
- An MCP surface serving the law to AI tools — so generators can consult the constitution *while generating*, and cite the rules they obeyed.

## Standing decisions

- License: to be chosen by the author before the repository goes public.
- The repository is local-first until the author decides to publish.
- StzWeb re-pins to v3.7+ in its own session, with its own verification.
