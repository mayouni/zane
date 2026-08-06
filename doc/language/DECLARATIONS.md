# The Ten Declaration Types

**Normative.** Part of [the Zui Language Specification v1.0](README.md). Syntax is
in [GRAMMAR.md](GRAMMAR.md); diagnostics are in [VIOLATIONS.md](VIOLATIONS.md).

---

## 1. The shape of every declaration

```
DEFINE <KIND> <name> ( <field>, <field>, … )
```

A declaration answers one question: **what is the human doing here?** It never
answers *how it looks* — that is the projection's business, and a projection has
zero freedom over what a declaration guarantees.

## 2. The intent grammar

Twenty-two verbs, six families, closed. Each family carries an invariant that is
normative — an implementation checks declarations against it, and the invariant is
where several of the named violations come from.

| Family | Verbs | Invariant |
|---|---|---|
| **orienting** | `DISCOVER` `UNDERSTAND` `LOCATE` | Discovery must be satisfiable at every entry point. |
| **attention** | `FOCUS` `FILTER` `COMPARE` | An active filter is visible state; focus and discovery cannot both be at maximum. |
| **information** | `READ` `SCAN` `SCROLL` `ZOOM` | A read surface that silently acts is an intent violation. |
| **selection** | `SELECT` `HIGHLIGHT` `PREVIEW` `MARK` | Selection expresses interest, never commitment. |
| **action** | `ACT` `CONFIRM` `CANCEL` `UNDO` | Every act has a reachable undo, or declares why it cannot. |
| **continuity** | `PAUSE` `RESUME` `RETRY` `EXIT` | Pause, resume, and exit are always reachable; a trapped flow is unconstitutional. |

These invariants are quoted verbatim from `constitution/rules.json` §`intents`,
which is their source of truth.

## 3. The two universal fields

Most declarations accept these; their meaning never changes by kind.

**`SATISFIES [ verb, … ]`** — the intents this surface serves. Every verb must be
one of the 22 (`UNKNOWN_INTENT` otherwise). This field is what makes a declaration
checkable at all: the six locally-decidable violations read it.

**`ALWAYS_REACHABLE [ verb, … ]`** — the intents that must remain reachable at
*every step*, not merely somewhere. This is the field that carries the operator's
rights into the structure: an `ACT` without `UNDO` here is `MISSING_UNDO`; a
multi-step flow without `EXIT` is `TRAPPED_FLOW`.

> The distinction is the whole point. `SATISFIES` says *this surface can do it*;
> `ALWAYS_REACHABLE` says *the human can always get to it*. A flow that offers
> `CANCEL` only on its first screen satisfies `CANCEL` and violates
> `ALWAYS_REACHABLE [CANCEL]`.

## 4. The ten types

### `INTENT_FLOW` — the unit of intent

A named sequence of intents a human moves through. The only declaration that is
*required* to carry `SATISFIES`; without it there is no flow, only a name
(`INTENT_FLOW_NO_SATISFIES`).

```zui
DEFINE INTENT_FLOW approve_payment (
  SATISFIES [SELECT, CONFIRM, ACT],
  ALWAYS_REACHABLE [UNDO, CANCEL, EXIT]
)
```

| Field | Type | Required | Meaning |
|---|---|---|---|
| `SATISFIES` | verb list | **yes** | the intents composing the flow |
| `ALWAYS_REACHABLE` | verb list | no | intents reachable at every step |

### `FORM` — a conversation with the system

An input surface. Binds to a flow rather than restating it.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `INTENT_FLOW` | identifier | no | the flow this form serves; must resolve (`UNRESOLVED_INTENT_FLOW`) |
| `SATISFIES` | verb list | no | intents, if the form stands alone |

### `WIZARD` — a multi-step flow

A flow with ordered steps. **Because it is multi-step, `EXIT` reachability is
mandatory**: a wizard whose `ALWAYS_REACHABLE` omits `EXIT` is `TRAPPED_FLOW`,
where a single-screen `INTENT_FLOW` is not.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `SATISFIES` | verb list | yes | the intents of the whole wizard |
| `ALWAYS_REACHABLE` | verb list | **effectively** | must include `EXIT`; `CANCEL` expected |
| `STEPS` | identifier list | no | ordered step names |

### `SCREEN` — an addressable surface

A place the human can be. `SATISFIES` declares why they came.

### `COMPONENT` — a reusable semantic unit

A part of a surface with its own intent. Not a widget: a component declares
*meaning* (`SATISFIES [READ]`), never appearance.

### `NAV_GRAPH` — how surfaces connect

Screen-to-screen routing.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `SATISFIES` | verb list | no | typically `[LOCATE]` or `[DISCOVER]` |
| `VISIBLE_STATE` | identifier list | no | state the navigation itself must show |

### `WORLD_VIEW` — a spatial surface

A dashboard or a game world: entities in a space, seen from a stated vantage.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `PERSPECTIVE` | enum | no | `top_down` · `isometric` · `first_person` · `side_scroll` — any other value is `INVALID_PERSPECTIVE` |
| `VISIBLE_ENTITIES` | identifier list | no | entities the view shows; resolved against the entity model at **Level 3** |
| `SATISFIES` | verb list | no | typically `[DISCOVER, LOCATE, SCAN]` |

### `INTERACTION` — an act bound to an object

How an intent is triggered against a thing.

### `FEEDBACK` — what the system says back

| Field | Type | Required | Meaning |
|---|---|---|---|
| `TONE` | enum | no | `celebratory` · `cautionary` · `critical` · `neutral` · `informational` — any other value is `INVALID_TONE` |
| `REPORTS` | identifier list | no | the state this feedback reports; **feedback that reports nothing is decoration** (`DECORATIVE_ANIMATION`) |

### `VIBE` — an interaction culture

Article VI made declarable: a culture, not a skin. A vibe may set density, motion
and surface; it may **never** remove an intent another declaration guarantees. A
`VIBE` that suppresses a declared `ALWAYS_REACHABLE` verb is
`VIBE_STRIPS_RIGHT` — the language's statement that vibe-invariant rights never
flex.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `DENSITY` | identifier | no | e.g. `compact`, `comfortable` |
| `SURFACE_AS` | identifier | no | the medium this vibe projects to |
| `MOTION` | identifier | no | `none` is lawful and common; motion must report (Rule 112) |
| `SUPPRESSES` | verb list | no | intents this culture hides. **Legal only for intents no declaration guarantees** — suppressing one that appears in any `ALWAYS_REACHABLE` is `VIBE_STRIPS_RIGHT` |

### `ACTOR` — the field that names authority

Not a declaration type but a field admitted on any declaration whose `SATISFIES`
holds `ACT`. It names who performs the act. Its absence, when the actor model
binds no actor either, is `HIDDEN_AUTHORITY` — the law's requirement that every
consequential act names its actor (Rule 83, Article V).

```zui
DEFINE INTENT_FLOW post_ledger_entry (
  SATISFIES [CONFIRM, ACT],
  ALWAYS_REACHABLE [UNDO, CANCEL, EXIT],
  ACTOR accountant
)
```

## 5. Enumerations, complete

Only two fields are enumerated, and both are checked by the reference
implementation today.

| Field | On | Legal values |
|---|---|---|
| `PERSPECTIVE` | `WORLD_VIEW` | `top_down` · `isometric` · `first_person` · `side_scroll` |
| `TONE` | `FEEDBACK` | `celebratory` · `cautionary` · `critical` · `neutral` · `informational` |

Values are matched case-sensitively in lower_snake. These lists are closed;
extending them is a language change, not an implementation choice.

## 6. What a declaration may not do

- **Name a rendering.** No `WIDGET`, no layout, no colour. A declaration that
  needs to say "card" has stopped describing intent.
- **Nest.** Fields hold scalars and identifier lists. (GRAMMAR §2.)
- **Invent a verb.** The 22 are closed. (GRAMMAR §4.)
- **Collapse intents.** `SELECT` with `ACT` and no `CONFIRM`, or `READ` with
  `ACT`, are structural errors — see [VIOLATIONS.md](VIOLATIONS.md).
