# StzZui — Roadmap

Milestones are cumulative; each ships complete or not at all (Rule 124 applies to us first).

## M1 — The law at home ✅ (2026-08-05, this commit)

- `constitution/rules.json` canonical here: v3.7, 117 rules, 31 sets, 7 articles.
- Rules 117–124 canonized from the ZinBank / Zin / Refine harvest ([doc/HARVEST-2026-08.md](doc/HARVEST-2026-08.md)).
- The Reader ported and rebranded — the whole law, interactive.
- The UI Audit ported (as "site audit"; renamed 2026-08-05) — six rules measured on any same-origin UI.
- Founding documents: README, ARCHITECTURE, this roadmap.
- Consumer contract stated; StzWeb pinned at v3.6.

## M2 — The educational showcase (in progress, 2026-08-06)

Feel the offense, then feel the law — generalizing StzWeb's Gotchas page (7 offenses) toward full coverage. Each page is self-contained, obeys the law it teaches, and cites the rule numbers it demonstrates. This is the platform's public face: the argument that best practices are not nostalgia, made playable.

- ✅ The site rebuilt around its two readers: Why (the case), How it works (the full architecture, designed instruments honestly labeled), Gotchas, Adopt (the consumer contract).
- ✅ The Gotchas engine ported and extended: 12 offenses on one page — the 7 StzWeb classics plus the five harvested ones: the two greens (117), the card that lies (119), the second row (120), the masking assistant (121), the wall of text (123).
- Remaining: split gotchas per rule family as coverage grows; a dedicated vibes exhibit (Modern/Retro, F2) as the Article VI page — today the whole site demonstrates it via F2.

## M3 — The `zui` verifier

A standalone CLI that checks declarations against the law — lifted from the Zin compiler's existing implementation (parser + semantic checks for `INTENT_FLOW`, `FORM`, `WIZARD`, `WORLD_VIEW`, `INTERACTION`, `FEEDBACK`, `SCREEN`, `COMPONENT`, `NAV_GRAPH`, `VIBE`), not rebuilt.

- Decision document: extract the Zui subset into a standalone Zig CLI vs. make Zin's compiler embeddable as a library. Written with the Zin project, not imposed on it.
- The named violations become the contract: `INTENT_ORPHAN`, `SELECT_ACT_COLLAPSE`, `READ_ACT_COLLAPSE`, `MISSING_UNDO`, `MISSING_CANCEL`, `TRAPPED_FLOW`, `INVISIBLE_STATE`, `HIDDEN_AUTHORITY`, `LAYOUT_DISPLACEMENT`, `DECORATIVE_ANIMATION`.
- Conformance fixtures: declarations with known verdicts, so any future implementation (any language) can prove agreement — the StzWeb three-runtimes discipline applied to the verifier itself.
- Language spec extracted to `doc/language/` with Zin credited as reference implementation.

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
