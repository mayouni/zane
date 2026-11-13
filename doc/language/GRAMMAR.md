# The Zayn Grammar

**Normative.** Stated in EBNF for the first time — the reference implementation's specification is prose
and tables. Part of [the Zayn Language Specification v1.7](README.md).

Notation: `=` defines, `|` alternates, `{ }` repeats zero or more, `[ ]` is
optional, `" "` is a literal, `(* *)` is a comment.

---

## 1. Lexical grammar

```ebnf
(* Whitespace is insignificant except as a token separator. *)
whitespace  = " " | "\t" | "\r" | "\n" ;

(* Comments run to end of line. There is no block comment. *)
comment     = "//" { any-character - newline } newline ;

(* Keywords are UPPER_SNAKE and reserved. Identifiers are conventionally
   lower_snake, but case is not enforced; a keyword may not be an identifier. *)
identifier  = ( letter | "_" ) { letter | digit | "_" } ;

string      = '"' { any-character - '"' } '"' ;
number      = [ "-" ] digit { digit } [ "." digit { digit } ] ;
boolean     = "true" | "false" ;
```

**Encoding.** A `.zayn` file is UTF-8 (a `.zane` or `.zui` file, a former extension, is read the same way). Line endings are LF or CRLF; a conforming
implementation must accept both and must not report a diagnostic for either.

**Case.** Declaration keywords, field keywords and intent verbs are matched
**case-sensitively** in their uppercase form. `satisfies` is not `SATISFIES`; it
lexes as an identifier and yields a syntax diagnostic in field position.

## 2. Syntactic grammar

```ebnf
file            = { comment | declaration } ;

declaration     = "DEFINE" decl-kind identifier "(" [ field-list ] ")" ;

decl-kind       = "INTENT_FLOW" | "FORM"      | "WIZARD"
                | "SCREEN"      | "COMPONENT" | "NAV_GRAPH"
                | "WORLD_VIEW"  | "INTERACTION" | "FEEDBACK"
                | "VIBE" ;

field-list      = field { "," field } [ "," ] ;   (* trailing comma allowed *)

field           = ref-list-field | kv-field ;

ref-list-field  = ref-list-key "[" [ ref-items ] "]" ;
ref-items       = identifier { "," identifier } [ "," ] ;
ref-list-key    = "SATISFIES" | "ALWAYS_REACHABLE"
                | "VISIBLE_ENTITIES" | "VISIBLE_STATE"
                | "INTENT_FLOWS" | "STEPS" | "REPORTS"
                | "SUPPRESSES" | "SIGNALS" | "ENTRIES" ;

kv-field        = kv-key value ;
kv-key          = "INTENT_FLOW" | "PERSPECTIVE" | "TONE"
                | "SURFACE_AS"  | "DENSITY"     | "MOTION"
                | "ROLE"        | "LABEL"       | "TARGET"
                | "ACTOR" ;
value           = identifier | string | number | boolean ;
```

A declaration's body is a flat list of fields. **There is no nesting**: a field's
value is a scalar or a bracketed list of identifiers, never another declaration.
This is deliberate — nesting is where widget trees creep back into an intent
language.

## 3. Order, duplication, and the empty body

- **Field order is not significant.** `SATISFIES` before `ALWAYS_REACHABLE` and
  the reverse are the same declaration.
- **A field key may appear at most once per declaration.** A repeat is
  `DUPLICATE_FIELD` (error). Implementations must not silently merge or
  last-write-win.
- **An empty body is syntactically legal**: `DEFINE SCREEN s ( )` parses. Whether
  it is *lawful* is a semantic question — an `INTENT_FLOW` with no `SATISFIES`
  raises `INTENT_FLOW_NO_SATISFIES`.
- **A declaration name must be unique within its kind.** Two `DEFINE FORM x`
  declarations are `DUPLICATE_DECLARATION` (error). The same name under two kinds
  is legal but discouraged.

## 4. Intent verbs

The verbs admitted inside `SATISFIES` and `ALWAYS_REACHABLE` are the closed set of
**22**, and only these:

```ebnf
intent-verb = orienting | attention | information | selection | action | continuity ;

orienting   = "DISCOVER" | "UNDERSTAND" | "LOCATE" ;
attention   = "FOCUS"    | "FILTER"     | "COMPARE" ;
information = "READ"     | "SCAN"       | "SCROLL"  | "ZOOM" ;
selection   = "SELECT"   | "HIGHLIGHT"  | "PREVIEW" | "MARK" ;
action      = "ACT"      | "CONFIRM"    | "CANCEL"  | "UNDO" ;
continuity  = "PAUSE"    | "RESUME"     | "RETRY"   | "EXIT" ;
```

Any other identifier in verb position is `UNKNOWN_INTENT` (error). **The grammar
is closed by design**: a projection that needs a new verb has misread its medium,
not found a gap in the language. `NAVIGATE` is the common mistake — it is
`LOCATE` (going to a known place) or `DISCOVER` (finding what places exist), and
The reference implementation's own declaration commits it.

## 5. Reserved and unspecified

Two declaration kinds are **recognized by the reference implementation but not
defined by this language**: `WIDGET` and `USER`. The reasoning is in
[README §6](README.md#6-two-deliberate-differences-from-the-reference-implementation).
An implementation encountering them should report `UNSPECIFIED_DECLARATION`
(warning, not error) so the difference is visible rather than silent.

All other `DEFINE <KIND>` forms belong to other pillars of the host language, if
any, and are outside this specification. A Zayn-only verifier reading a
multi-pillar file must **ignore non-Zayn declarations silently** — it has no
standing to judge them.

## 6. A complete, lawful example

Every construct of the grammar, in one file:

```zayn
// A payment approval, declared before anything is rendered.

DEFINE INTENT_FLOW approve_payment (
  SATISFIES [SELECT, CONFIRM, ACT],
  ALWAYS_REACHABLE [UNDO, CANCEL, EXIT],
  ACTOR approver
)

DEFINE FORM payment_form (
  INTENT_FLOW approve_payment
)

DEFINE WIZARD onboarding (
  SATISFIES [UNDERSTAND, ACT, CONFIRM],
  ALWAYS_REACHABLE [UNDO, CANCEL, EXIT],
  STEPS [identity, contact, review],
  ACTOR applicant
)

DEFINE SCREEN payments_home (
  SATISFIES [DISCOVER, LOCATE, SCAN]
)

DEFINE COMPONENT balance_card (
  SATISFIES [READ]
)

DEFINE NAV_GRAPH payments_nav (
  SATISFIES [LOCATE],
  VISIBLE_STATE [active_filter, pending_count]
)

DEFINE WORLD_VIEW floor_map (
  PERSPECTIVE top_down,
  VISIBLE_ENTITIES [table, order, server],
  SATISFIES [DISCOVER, LOCATE, SCAN]
)

DEFINE INTERACTION confirm_gesture (
  SATISFIES [CONFIRM],
  ALWAYS_REACHABLE [UNDO, CANCEL],
  ROLE reversible
)

DEFINE FEEDBACK payment_sent (
  TONE informational,
  REPORTS [transfer_state]
)

DEFINE VIBE operator_dense (
  DENSITY compact,
  SURFACE_AS terminal,
  MOTION none
)
```

This file is fixture `clean-full.zayn` in
[the conformance suite](../../conformance/fixtures/clean-full.zayn), and its
expected verdict is **no diagnostics at any level**.
