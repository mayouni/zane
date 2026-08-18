# The Ten Declaration Types

**Normative.** Part of [the Zui Language Specification v1.2](README.md). Syntax is
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

How an intent is triggered against a thing. **The host of `ROLE`**, because it is the only
declaration meaning *a control's referent* without naming a widget.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `ROLE` | enum | no | the promise this control makes — `inert` · `navigate` · `reversible` · `irreversible` · `proposal`. Any other value is `UNKNOWN_ROLE`; on any other kind it is `ROLE_MISPLACED` |
| `SATISFIES` | verb list | no | the intents this interaction serves |
| `ALWAYS_REACHABLE` | verb list | no | intents reachable throughout it |
| `ACTOR` | identifier | no | who performs the act — required by `PROPOSAL_COMMITS` when a `proposal` acts |

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
| `SURFACE_AS` | enum | no | the medium this vibe projects to — one of the ten (`UNKNOWN_MEDIUM` otherwise). It also fixes which intents the file may promise: an intent the medium cannot carry at all is `VERB_NOT_CARRIED` |
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

**Five** fields are enumerated. Two are checked by the reference implementation today; the
third was closed at v1.1, when the law's Rule 82 became **Perceivable State** and a rule
obliging perceivability *in the declared medium* needed a language that could declare one.
The fourth arrived at v1.2 with the first expression stratum.

| Field | On | Legal values |
|---|---|---|
| `PERSPECTIVE` | `WORLD_VIEW` | `top_down` · `isometric` · `first_person` · `side_scroll` |
| `TONE` | `FEEDBACK` | `celebratory` · `cautionary` · `critical` · `neutral` · `informational` |
| `SURFACE_AS` | `VIBE` | `visual` · `auditory` · `voice` · `haptic` · `print` · `luminous` · `signage` · `machine` · `spatial` · `terminal` |
| `SIGNALS` | any declaration | `success` · `warning` · `danger` · `info` · `muted` |
| `ROLE` | `INTERACTION` | `inert` · `navigate` · `reversible` · `irreversible` · `proposal` |

### 5.2 `TONE` and `SIGNALS` are two vocabularies, and that is deliberate

They look like the same five values wearing different words, and they are not. **`TONE` is
the register the system speaks in**; **`SIGNALS` is what a value means about a record.**
Different strata — `MESSAGE` and `SIGNAL` — with different subjects, so each enumeration
is closed and **each refuses the other's words**: `TONE danger` is `INVALID_TONE`, and
`SIGNALS [critical]` is `UNKNOWN_SIGNAL`.

That refusal is the feature. One subject with two vocabularies is precisely the defect the
constitution corrected in itself at v3.11, when Rules 3 and 118 turned out to have
legislated colour in two overlapping vocabularies for 122 rules without either citing the
other. **Two subjects with two vocabularies is correct** — provided the boundary is written
down, which is what this section is for.

`SIGNALS` is quoted from **Rule 118's family one** and published as data in
[`conformance/signal.json`](../../conformance/signal.json), alongside what each medium
actually renders those values as.

### 5.1 The medium set is closed, and why that buys something

`SURFACE_AS` accepted any identifier until v1.1 — so the field was a comment rather than a
contract, and `SURFACE_AS kiosk` passed. It is closed now for the same reason the verb set
is closed: **a coverage matrix over media is only finite and checkable if the media are
enumerated.**

That matrix is published as data in [`conformance/media.json`](../../conformance/media.json)
— each medium described by **properties** (persistence · seriality · election · bandwidth ·
mutability · retractability) rather than by taste, so a new channel is *classified* rather
than argued about,
and each carrying the 22 verbs as `native`, `degraded` or `absent`.

Only **absent** raises a diagnostic. *Degraded* — a parallel act becoming serial, a
perception becoming a memory task — is recorded as data for tools and designers, because a
warning that fired on every serial surface would be noise rather than law.

**`kiosk` is not among the ten, deliberately.** A kiosk is a *visual* surface that happens
to be **unelected**, which is a property and not a channel. The same distinction retired
`ambient` from the medium list before it was published.

Values are matched case-sensitively in lower_snake. These lists are closed;
extending them is a language change, not an implementation choice.

## 5.3 `SIGNALS` — the first expression field

| Field | Type | Required | Meaning |
|---|---|---|---|
| `SIGNALS` | enum list | no | the semantic statuses this surface carries — Rule 118's five. A value outside them is `UNKNOWN_SIGNAL` |

**It names a meaning, never a colour.** `SIGNALS [danger]` says *this surface carries
values that are critical, exceeded or incident*; it does not say red, and a declaration
that needed to say red would have stopped describing expression and started describing
paint. Which colour, timbre or waveform serves `danger` is the rendering's business, per
medium and per culture.

**It must trace to an intent.** A declaration carrying `SIGNALS` with no `SATISFIES` is
`EXPRESSION_ORPHAN` — `INTENT_ORPHAN` one level down, and the rule that keeps the inversion
intact. Expression is intent's *refinement*, never a second language beside it: a surface
that says how its values should be perceived without saying what the operator is doing has
inverted the model this language exists to enforce.

```zui
DEFINE SCREEN overdue_invoices (
  SATISFIES [SCAN, COMPARE, LOCATE],
  SIGNALS [danger, warning, muted]
)
```

`SIGNALS` is the first of six expression fields. `ROLE`, `MOTION`, `MESSAGE` and `TEMPO`
raise the **same** `EXPRESSION_ORPHAN` as their grammars land, which is why that diagnostic
names the stratum family rather than the field.

## 6. What a declaration may not do

- **Name a rendering.** No `WIDGET`, no layout, no colour. A declaration that
  needs to say "card" has stopped describing intent. `SIGNALS` is not an exception:
  it names the *meaning* a rendering must carry, and never the rendering.
- **Nest.** Fields hold scalars and identifier lists. (GRAMMAR §2.)
- **Invent a verb.** The 22 are closed. (GRAMMAR §4.)
- **Collapse intents.** `SELECT` with `ACT` and no `CONFIRM`, or `READ` with
  `ACT`, are structural errors — see [VIOLATIONS.md](VIOLATIONS.md).
