# StzZui

**Zui is a declarative, compilable language for intent-driven user interfaces — governed by a machine-verifiable constitution of 117 rules as data.** You declare what the human is doing; the compiler refuses what the law forbids, before anything is rendered; projections render the declaration to any medium; the audit measures what runtime paints. Deployable inside any software project — at design time, in development, and at runtime. Platform-independent, framework-independent, opinionated toward business applications.

A Softanza project · Tunis · Niamey · Paris

---

## Why this exists

Interfaces are decaying in the AI era — and not for lack of capable generators. The generators are the problem's amplifier: they reproduce, at machine speed, every inherited assumption of the corpus they learned from. Small faint text, verbless buttons, controls floating over the reading, breadcrumbs that only look backwards, a scrollbar beside empty space, twenty sections where twelve would hold. The evidence is not rhetorical: **every rule numbered above 104 in this constitution was canonized from a defect an AI produced while building a real site — under explicit instruction to be careful.** Without a machine-checkable law, the defects regenerate endlessly.

Meanwhile the HCI and UI/UX community has largely stepped back from criticizing the situation, riding the "AI will replace us" wave instead of restating first principles. Someone has to write the principles down in a form a machine can refuse to violate.

That is what this repository holds.

## What StzZui is

Three things, strictly layered — the architecture inherited from the Zui pillar of the [Zin](https://github.com/mayouni) project (ZUI_SPECIFICATION v3.0):

| Layer | Artifact | Status |
|---|---|---|
| **1 · The Language** | 10 declaration types (`INTENT_FLOW` … `VIBE`) over 22 closed, medium-agnostic verbs (DISCOVER … EXIT). Widgets are consequences of intent, never primitives. | **Owned here**; spec extraction to `doc/language/` underway. Reference implementation: Zin's compiler — a consumer ([doc/ARCHITECTURE.md](doc/ARCHITECTURE.md)) |
| **2 · The Constitution** | [`constitution/rules.json`](constitution/rules.json) — **v3.7.3, 117 rules, 31 sets, 7 articles**. Every rule carries its *why*, its derivation from an article, its enforcement tier, and the real-world evidence that earned it a number. | **Canonical, here** |
| **3 · Rendering projections** | Per-medium consumers: business web (Zing, formerly StzWeb), Zin's compiler targets, CLI, voice, and — a first — the AI-agent interaction surface itself. | Consumers pin a version |

The law is **data**. The reader renders it, linters load it, findings cite rule numbers, and no prose copy can drift from what the machine enforces. And the law has a native habitat: the language. One declaration holds at three moments — checked at design time, linted in development, measured at runtime — with no framework to swap and no dependency to take.

## What is in this repository today

- **[The site](index.html)** — built for two readers, the developer and the UI community: [the case for a law](site/why.html), [the architecture in full](site/how.html) (including instruments still in design, honestly labeled), [the Gotchas](site/gotchas/index.html) — twelve interactive offenses beside their lawful twins, split into seven rule families — [the vibes exhibit](site/vibes.html) — one operator screen, one shared state, both cultures at once (Article VI) — and [the adoption contract](site/adopt.html).
- **[The Reader](constitution/reader/index.html)** — the whole law, interactive: search, keyboard navigation, enforcement badges, operator rights, forbidden patterns.
- **[The UI Audit](tools/ui-audit.html)** — a browser tool that *measures* six of the rules on any application UI you can serve same-origin: computed text size, true composited contrast, the full navigation path, sideways scrolling with room to spare, and menu/tree coherence. Nothing leaves your browser.
- **[The language specification](doc/language/README.md)** — Zui v1.0: the grammar [in EBNF](doc/language/GRAMMAR.md), [the ten declaration types](doc/language/DECLARATIONS.md), and [every diagnostic bound to the constitutional rule it enforces](doc/language/VIOLATIONS.md). Honest throughout about what is specified versus what any implementation has reached.
- **[The `zui` verifier](tools/zui/README.md)** — `node tools/zui/cli.js check file.zui`. Checks declarations against the law before anything is rendered, citing rule numbers and titles it reads from the law itself. Zero dependencies; runs on Node or in a browser; passes all 30 conformance fixtures.
- **[The conformance suite](conformance/README.md)** — 30 `.zui` declarations with known verdicts, so any implementation in any language can *prove* agreement rather than assert it. Four conformance levels; every violation fixture has a lawful twin.
- **[The harvest record](doc/HARVEST-2026-08.md)** — how Rules 117–124 were extracted from the ZinBank, Zin i18n, and Refine evidence trails.
- **[The architecture](doc/ARCHITECTURE.md)** — the three layers, the consumer contract, and the plan for lifting the `.zui` language and compiler out of Zin.
- **[The roadmap](ROADMAP.md)** — from law-at-home to a standalone `zui` verifier to the educational showcase.

## The consumer contract

A project consumes the constitution by **pinning a version** of `rules.json` — exactly as a runtime pins a conformance-fixtures file:

- **Zing** (formerly StzWeb) — first conforming consumer. Its `zing check` lints declarations against the law and cites rule numbers; its site scores zero violations under the audit. Pinned at v3.7.3.
- **Zin** — the Zui pillar's compiler already parses `INTENT_FLOW`, `FORM`, `WIZARD`, `WORLD_VIEW`, `INTERACTION`, `FEEDBACK`, `SCREEN`, `COMPONENT`, `NAV_GRAPH`, `VIBE`; its Interface Constitution derives from the same articles.
- **Anything else** — the law is one JSON file with a stable schema. Load it, check against it, cite it.

Amendment requires evidence — real usage, operator feedback, documented failure — never fashion (Article VII). Retired numbers are never reused.

## The stance

Opinionated, and openly so: **business applications first**. Operators, not explorers — people who use the same screens eight hours a day under pressure, responsibility, and fatigue. Calm over power. Intent over mechanics. Visible over hidden. Consumer-site delight is out of jurisdiction; operator dignity is the whole of it.
