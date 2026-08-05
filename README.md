# StzZui

**The Zui Constitution, at home. A machine-verifiable law for user interfaces — abstract, data-oriented, platform-independent, opinionated toward business applications.**

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
| **1 · Intent Grammar** | 24 closed, medium-agnostic verbs (DISCOVER … EXIT). Widgets are consequences of intent, never primitives. | Specified in Zin; residence moving here ([doc/ARCHITECTURE.md](doc/ARCHITECTURE.md)) |
| **2 · The Constitution** | [`constitution/rules.json`](constitution/rules.json) — **v3.7, 117 rules, 31 sets, 7 articles**. Every rule carries its *why*, its derivation from an article, its enforcement tier, and the real-world evidence that earned it a number. | **Canonical, here** |
| **3 · Rendering projections** | Per-medium consumers: business web (StzWeb), Zin's compiler targets, CLI, voice, and — a first — the AI-agent interaction surface itself. | Consumers pin a version |

The law is **data**. The reader renders it, linters load it, findings cite rule numbers, and no prose copy can drift from what the machine enforces.

## What is in this repository today

- **[The Reader](constitution/reader/index.html)** — the whole law, interactive: search, keyboard navigation, enforcement badges, operator rights, forbidden patterns.
- **[The Site Audit](tools/site-audit.html)** — a browser tool that *measures* six of the rules on any same-origin site: computed text size, true composited contrast, the full navigation path, sideways scrolling with room to spare, and menu/tree coherence. Nothing leaves your browser.
- **[The harvest record](doc/HARVEST-2026-08.md)** — how Rules 117–124 were extracted from the ZinBank, Zin i18n, and Refine evidence trails.
- **[The architecture](doc/ARCHITECTURE.md)** — the three layers, the consumer contract, and the plan for lifting the `.zui` language and compiler out of Zin.
- **[The roadmap](ROADMAP.md)** — from law-at-home to a standalone `zui` verifier to the educational showcase.

## The consumer contract

A project consumes the constitution by **pinning a version** of `rules.json` — exactly as a runtime pins a conformance-fixtures file:

- **StzWeb** — first conforming consumer. Its `stzw check` lints declarations against the law and cites rule numbers; its site scores zero violations under the audit. Pinned at v3.6 until it re-pins.
- **Zin** — the Zui pillar's compiler already parses `INTENT_FLOW`, `FORM`, `WIZARD`, `WORLD_VIEW`, `INTERACTION`, `FEEDBACK`, `SCREEN`, `COMPONENT`, `NAV_GRAPH`, `VIBE`; its Interface Constitution derives from the same articles.
- **Anything else** — the law is one JSON file with a stable schema. Load it, check against it, cite it.

Amendment requires evidence — real usage, operator feedback, documented failure — never fashion (Article VII). Retired numbers are never reused.

## The stance

Opinionated, and openly so: **business applications first**. Operators, not explorers — people who use the same screens eight hours a day under pressure, responsibility, and fatigue. Calm over power. Intent over mechanics. Visible over hidden. Consumer-site delight is out of jurisdiction; operator dignity is the whole of it.
