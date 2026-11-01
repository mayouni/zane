# The Diagnostic Contract

**Normative. Family-wide.** This is **C2** of the Softanza reference design: the
envelope every court in the family speaks when it refuses.

**Version**: **v1.2.0** · 2026-08-23 (v1.1.2 · 2026-08-21 · v1.1.1 · 2026-08-21 · v1.1 · 2026-08-20 · v1.0 · 2026-08-08)
**Machine-readable shape**: [`diagnostic-contract.schema.json`](diagnostic-contract.schema.json)
— that file is the shape a court validates against; this one governs it.
**Extracted from**: the zui verifier's working practice —
[`tools/zui/`](../tools/zui/README.md), [`conformance/violations.json`](../conformance/violations.json),
[`doc/language/VIOLATIONS.md`](language/VIOLATIONS.md) — promoted from one court's
convention to a versioned family artifact. Nothing in this promotion changed a
diagnostic's meaning or a verdict.

---

## 1. Why one envelope

The family's signature move is everywhere the same: a closed language, a court
that judges it, fixtures that gate it, consumers that pin it. That makes the
family a family of *courts* — and a programmer who works across it meets several
of them in one day. If each court refuses in its own dialect, every refusal costs
a context switch; if they all speak one envelope, **a programmer learns one
refusal format and has learned them all**, and one CI gate, one editor plugin,
one dashboard can consume them all.

What is family-wide is only the *form* of the refusal. Each court keeps its own
law, its own codes, and its own verdicts. This contract widens the envelope's
consumers, not any court's authority.

## 2. The envelope

Every diagnostic a conforming court emits in machine form is one object:

```json
{
  "code": "MISSING_UNDO",
  "severity": "error",
  "message": "An act declares no way back: SATISFIES holds ACT, ALWAYS_REACHABLE lacks UNDO.",
  "span": { "file": "payments.zui", "line": 2 },
  "cites": ["rule:79", "article:reversibility", "right:reverse"],
  "language": "zui"
}
```

Six fields. A court may add fields of its own — the zui court adds `level` (its
conformance level) and `subject` (the offending name) — but it may never omit,
rename, or repurpose these six.

### 2.1 `code` — the format

A stable, machine-parseable, uppercase identifier:

```
^[A-Z][A-Z0-9]*([_-][A-Z0-9]+)*$
```

Both spellings attested in practice conform: the specification form
(`MISSING_UNDO`) and the prefixed serial form (`ZUI-W001`).

Normatively:

- **A code is stable forever.** A retired code is never reused — the discipline
  rule numbers already follow.
- **A code is unique within its language.** Courts of different languages may
  collide without harm; `language` disambiguates.
- **This contract allocates no codes.** Each court chooses and catalogs its own
  — the zui court's catalog is `conformance/violations.json`. The envelope is
  family law; the codes are court law.

### 2.2 `severity` — the ladder

Two rungs, closed:

| Severity | Meaning |
|---|---|
| `error` | the artifact is unlawful; a build must fail |
| `warning` | lawful but suspect, or undecidable without more input |

A third rung is a substance change to this contract, never a court's private
extension. The gate discipline follows from the ladder: a court's process exits
non-zero exactly when errors exist.

### 2.3 `message` — the prose

Non-empty human prose, and nothing more. The message is never compared and never
normative: a court phrases findings however its operators read best, in whatever
language they read — the looseness the zui conformance suite already grants. The
message *explains*; the code and the cites are what carry the law.

### 2.4 `span` — where

`{file, line, col}` and nothing else. `file` is required. `line` locates when
≥ 1; **`line: 0` means the finding is file-wide** — attested practice for
findings that indict the file rather than a line (an element the whole file
fails to trace, state no surface shows). `col` is optional, ≥ 1 when known; no
court in the family emits it today, and the field is reserved so the first court
that can name a column needs no contract change to do so.

### 2.5 `cites[]` — the citation rule

A cite is `kind:value`, where `kind` is one of `rule`, `article`, `right`,
`pattern` — the four binding kinds the zui court already carries — and `value`
is a stable identifier in the court's pinned instrument (`rule:79`,
`article:reversibility`, `right:leave`, `pattern:layout-shift`).

Normatively:

- **A diagnostic that enforces a provision of a pinned law must cite it.** A
  finding that cites is an instrument of law and can only be answered by fixing
  the artifact or amending the law with evidence; a finding that merely opines
  gets negotiated in the hallway. This is the founding argument of the zui
  court's diagnostics, stated once for the family.
- **Cites reference stable identifiers, never prose** — rule numbers, article
  keys, right names, forbidden-pattern names. Titles and wording travel in
  `message`, where they are free.
- **A court cites by reading its pinned instrument, never by hardcoding it** —
  the discipline that keeps a tool from drifting from the law it enforces.
- **Empty is honest where no law applies.** Structural and grammar diagnostics
  (a file that cannot be read, a duplicate field) may carry `[]`.

### 2.6 `language` — the court

The lowercase identifier of the language being judged:

```
^[a-z][a-z0-9_]*$
```

`zui` today; `zql`, `face`, `wflow` as their courts adopt the envelope. The
field names the language, and therefore the instrument in which the cites
resolve.

### 2.7 The outer shape — what carries the diagnostics *(v1.1, justification corrected v1.1.1, encoder table corrected v1.1.2)*

A run emits more than one diagnostic, and until v1.1 this contract said nothing
about what carries them. **It says so now, and every claim under it is a
measurement with a date, including the two this section got wrong first.**

**The machine form of a run is one JSON object. Never a top-level array.**

> **A Ring consumer reads a top-level array, but not at the depth it expects.**
> Re-measured here on Ring 1.27, 2026-08-21, against a `jsonlib` claim this
> section made too strongly at v1.1 and a correction that arrived with its own
> two examples reversed:
>
> | what is decoded | `JSON2List` gives |
> |---|---|
> | top-level **object**, 3 members | a list of **3** — spread |
> | top-level **array**, 3 items | a list of **1**, everything at element 1 — **wrapped** |
> | the same array **under a key** | not wrapped; the array is the member's value |
>
> **Decoded shape depends on depth.** A bare array is therefore *surprising*,
> not unreadable: a caller who expected to iterate finds one element and is one
> `len()` call from the truth. The v1.1 wording said the family *cannot read* a
> top-level array. **That was one degree too strong and the first person to try
> it would have refuted it.** Found by the RingFlex court on 2026-08-19 while
> choosing its wire shape; corrected against upstream by RingUpstream on
> 2026-08-20; re-measured here before this paragraph was rewritten.

**The encoder collapses some lists into objects, and the trigger is one thing:**

> **Inside a list being rendered, `List2JSON` emits a member as `"key": value`
> when that member is a 2-element list *whose first element is a string*.**
> Everything else is emitted bare between braces, which is invalid at the top
> level.

That single rule accounts for every row below. **Re-measured here on Ring 1.27
before this paragraph was rewritten**, round-tripping each document through
`JSON2List` and back:

| round-tripped through Ring 1.27 | comes back as | verdict |
|---|---|---|
| `{"diagnostics":[]}` | `{"diagnostics": []}` | **survives** |
| `{"diagnostics":[{"code":"E1",…}]}` | the same document | **survives** |
| `{"span":[[12,4],[12,9]]}` | `{"span": [[12,4],[12,9]]}` | **survives — first element is a number** |
| `{"k":["a","b"]}` | `{"k": ["a","b"]}` | **survives — the pair is the *value*, not a member** |
| `{"m":[["line",12],["col",4]]}` | `{"m": {"line": 12,"col": 4}}` | **collapses to an object** |
| `{"attrs":[["k","v"],["x","y"]]}` | `{"attrs": {"k": "v","x": "y"}}` | **collapses to an object** |
| `["a","b"]` *(bare array)* | `{"a": "b"}` | **the array is silently lost** |
| `[["a","b"],["c","d"]]` *(bare array)* | `{{"a": "b",…}}` | **double brace — raises** |

**So the encoder does discriminate, and it discriminates the right way**: the C2
object form round-trips intact, and both bare top-level arrays are damaged — one
loudly, one silently, which is the worse of the two.

**It is still not the argument for this rule.** Demoted for a better reason than
the one first given: **no court here re-emits its own output.** The encoder
describes what happens when *decoded* JSON is re-encoded from Ring, which is a
thing no conforming implementation does. A rule defended by evidence about an
operation nobody performs is a rule waiting to be overturned by whoever checks.

### What this does change, for anyone designing a payload

**Two practical consequences, and they point in opposite directions:**

- **A span rendered `[line, col]` as numbers is safe.** The first element is a
  number, so nothing collapses. An earlier version of this section warned about
  spans generally; **that warning was broader than the measurement supports** and
  is withdrawn.
- **An attribute list of `[["k","v"], …]` pairs is not safe**, and that half
  hardens. It silently becomes an object, and a consumer that expected a list of
  pairs gets a map — with duplicate keys collapsed and order gone.

> **A correction of method, worth more than the table.** Two sessions measured
> this and got different answers, and neither was wrong: one measured
> `List2JSON` on a **Ring literal**, the other measured a **round trip** through
> `JSON2List` first. **The difference was a decode step, not a fact** — and both
> descriptions said *"encodes to"*, so the disagreement was invisible until
> somebody ran both. When a measurement is relayed, the operation it measured
> travels less reliably than the number it produced.

**So the jsonlib evidence for the object is the decoder alone, and it is mild** —
not because the encoder points the other way, but because it describes an
operation no court performs. The load-bearing argument is the one below it —
§1's single consumer, and the `[]`-versus-absent distinction — neither of which
depends on Ring at all.

The object carries them under the key **`diagnostics`**, an array of envelopes:

```json
{
  "diagnostics": [
    { "code": "MISSING_UNDO", "severity": "error", "…": "…" }
  ]
}
```

Normatively:

- **The key is `diagnostics`, and it is never omitted and never null.** A clean
  run emits `"diagnostics": []`. *Clean* and *no output* are different facts and
  a consumer must be able to tell them apart without guessing.
- **A court may add outer keys of its own** — the zui court adds `level`,
  `contract`, `files` and `counts`. They are that court's, and no consumer may
  assume them of another court. They may not replace or rename `diagnostics`.
- **Nothing else about the outer object is specified.** Ordering, grouping by
  file, pretty-printing: a court's own business.
- **A court emitting a bare array is *pre-v1.1*, not broken.** This requirement
  did not exist before 2026-08-20 and pinning is each court's own decision, so a
  bare top-level array is a court that has not adopted v1.1 — a conformance gate
  reading red against this section should say which of the two it found. **One
  such court is known and named**: RingServ's `ringserv check --json` writes `[`,
  one object per finding, `]`, verified by running the binary on 2026-08-20 on a
  clean app and a failing one. It is pinned at v1.0 and conforms to what it pins.

**Why name the key at all, rather than say only "an object".** Because §1's
whole claim is that *one* CI gate, *one* editor plugin, *one* dashboard consume
every court in the family. A consumer that must probe for the array's name has
paid the context switch this contract exists to remove, and the rule would have
delivered the half that is easy to state instead of the half that is load-bearing.

**Two courts already emitted an object when this was written, and that is not
why the rule says object.** They agreed by accident: neither had a rule to
follow. *Agreement between two implementations is not evidence of a specified
rule — it is evidence that two authors made the same choice, and the third is
the one who pays.* The measured fact about the reader is the evidence; the
agreement is only what kept it from being noticed sooner.

**The third court has now answered, and it is the counterexample rather than the
confirmation.** RingServ emits a bare array — not a different key, which is what
§2.7 was written expecting, but a shape this section forbids outright. *The
sentence above was written as a caution and came true as a measurement within a
day.* It changes nothing normative here: whether RingServ adopts v1.1 is
RingServ's, reserved to it by §4 and its own `VENDOR.md`, and it has raised
`RINGSERV-C2V11-01` to decide. **This court neither ratified that nor asked for
it.**

### 2.8 What a value may BE — the scalar types that survive *(v1.2.0)*

Every section above specifies a field's **shape**. This one specifies something
shape cannot reach: which JSON scalar **types** a value may be at all, anywhere
in the envelope.

**The rule.** No value in the envelope or in the report that carries it, at any
depth, may be a bare `true`, `false` or `null`. Strings, numbers, arrays and
objects are unconstrained. This binds a court's own extension fields, which is
where the exposure actually is — the six are strings, an integer and an array.

**Measured, not reasoned.** RingFlex measured Ring's `jsonlib` on Ring 1.27 on
2026-08-22, round-tripping through `JSON2List` then `List2JSON`:

    {"k":[true,false,null,12,"a"]}  ->  {"k":["true","false","null",12,"a"]}
    {"a":true,"b":null,"c":12}      ->  {"a":"true","b":"null","c":12}

In every position — inside an array, under a key, nested. **Numbers survive.**
The document stays valid JSON and stays a **different document**, with nothing
raised at any point. A consumer that tests `x = true` reads the string `"true"`
and is wrong without knowing. It is the same silence as the collapse defect in
§2.7 and it reaches further, because it needs no particular *shape* to bite —
only a *type*.

**What this changes for a court today: nothing.** No conforming court emits a
bare boolean; the schema declared zero boolean-typed properties before this
section existed. That was a **field choice, not a design** — the third time this
month that exact sentence has been the finding — and §2.8 is what turns the
choice into a requirement, so the next hand to add a field cannot lose the
distinction by accident.

**Stated twice, and each mechanism's reach is stated with it.** A rule with one
enforcement whose limits are unmeasured is a rule that is enforced somewhere and
not enforced somewhere else, and nobody knows where the line is:

| mechanism | where | reach |
|---|---|---|
| `additionalProperties: {"not": {"type": ["boolean","null"]}}` in the schema, at the root and at `definitions.report` | any court's own JSON Schema validator | **one level.** A boolean nested inside an extension object passes it |
| `scalarsThatDoNotSurvive()` in `tools/zui/envelope.js`, wired into `validate()` and `validateReport()` | this court | **full depth**, because that is how far the defect reaches |

Proved by running it: an extension field `cached: true` is refused by both, a
nested `meta.ok: null` by the scan alone, and the 50-fixture suite — 33
diagnostics and 50 report objects — passes clean, which is this court asserting
about its own output what RingFlex asserts about its own document.

**What this section does not do.** It does not ask anyone to fix Ring's encoder:
that library is owned by nobody in this estate, and a contract's business is what
its own documents may contain, not what a third party's code does. It does not
require a court pinned at v1.1.2 to re-pin — §4 reserves that to each court —
and a court that never emits a boolean is already conforming to §2.8 without
knowing it.

**The general rule, which is RingFlex's and outlives the instance.** *A corpus
that varies one dimension confirms rules about that dimension.* Two sessions
built shape corpora against this encoder over two days, both found a shape rule,
and one of them published a shape rule that was wrong — because not one case in
either corpus changed the **type** of anything. The single case that varied a
type is what found this. Carried as `CENTRAL-JSONSCALAR-01`.

## 3. Conformance

A court conforms to this contract when:

1. every diagnostic it emits in machine form validates against
   [`diagnostic-contract.schema.json`](diagnostic-contract.schema.json);
2. **its machine form is one object carrying `diagnostics`**, validating against
   `definitions.report` in that same file *(v1.1)*;
3. its extension fields never collide with, replace, or alter the six, and its
   outer keys never collide with, replace, or rename `diagnostics`;
4. it records, in its own documentation, the contract version it pins.

Conformance is about the envelope alone. It says nothing about which codes a
court defines, what its verdicts are, or how it proves them — that remains each
court's law, gated by each court's fixtures.

### Conforming implementations

| Court | `language` | Pins | Proof |
|---|---|---|---|
| [the zui verifier](../tools/zui/README.md) (`tools/zui/`) | `zui` | v1.2.0 | `--json` emits the object; the conformance runner validates every diagnostic **and every run's outer object** of the 53-fixture suite against the shape, and since v1.2.0 scans both to full depth for scalars that do not survive a round trip — 35 diagnostics, 53 reports, clean |

## 4. Governance

Governed like the UI law, whose discipline this contract borrows as a versioning
mechanism:

- **A version denotes exactly one pair of files** — this document and the schema
  beside it, which move together.
- **`MAJOR.MINOR` moves when the envelope's substance moves**: a field added to
  or removed from the six, a severity rung added, the code or cite format widened
  or narrowed, the citation rule strengthened or relaxed.
- **`MAJOR.MINOR.PATCH` marks a correction that changes no requirement**: a
  broken link, a wording repair, an example fixed. A court pinned at `x.y` loses
  nothing by staying there when `x.y.z` appears.
- **The substance test decides which component moves**: *does any envelope that
  validated before stop validating after — or must any conforming court change
  anything it emits?* If no, it is a correction, however much prose changed.
- **Consumers pin.** A court records the version it conforms to and moves by its
  own decision, never silently.
- **Amendment happens here, by evidence.** A court that needs the envelope to
  carry more submits the diagnostic it cannot express. Fashion is not
  admissible.

**v1.0 → v1.1, and why the MINOR component moved.** The substance test asks:
*does any envelope that validated before stop validating after — or must any
conforming court change anything it emits?* **Yes to the second.** The six
fields are untouched and every v1.0 diagnostic still validates unchanged, but
v1.1 states a requirement about the machine form that a court can fail, and one
court did: this one emitted its array under `findings` and renamed it. That is a
substance move, not a correction, however little prose changed. **Courts pinned
at v1.0 lose nothing by staying there** — they move by their own decision, which
is what pinning is for.

**v1.1.2 → v1.2.0, and why the MINOR component moved.** The substance test asks
whether a court can newly fail. It can: §2.8 forbids a bare `true`, `false` or
`null` anywhere in the envelope, and a court emitting one now fails a check it
previously passed. Nothing measured emits one today, so the edition breaks no
court that exists — but "no court fails it today" is a fact about this month, not
a reason to call a new requirement a patch. **A version denotes exactly one pair
of files**, and this pair states a rule the last pair did not.

**And the editorial defect rides with it, rather than in place.** The v1.1.2
bytes carried `"version": "1.1.2"` beside a description string still ending
*Version v1.1.1, 2026-08-21* — two editions answering to one file, found by Zing
in the act of pinning, which is what pinning is for. It could not be corrected
*as v1.1.2*: two courts hold `sha256` of those bytes, so editing them while
keeping the number would leave two different byte sequences both claiming to be
v1.1.2, which is a worse defect than the one being fixed and is the one §4
already forbids — *the bytes moved, so the version must*. **The v1.1.2 pins that
zing and this court hold stay valid and name the same bytes they always did.**

**v1.1.1 → v1.1.2, PATCH again, and for the third time about the same paragraph.**
The requirement has never moved: one object, never a top-level array, `diagnostics`
present even when empty. What moved is §2.7's **encoder table**, which v1.1.1
published wrong — it claimed the C2 object form is mangled by `List2JSON` and
therefore that the encoder discriminates nothing. **It is not, and it does.** The
error was one bracket level: `List2JSON(["diagnostics", []])` is not the shape a
court emits, because an object with one member is a list *containing* a pair. The
stated trigger moved too, from *"a two-string list"* to *"a 2-element list whose
first element is a string"* — a one-word correction that **changes who is at
risk**, since it makes `[line, col]` as numbers safe and `[["k","v"], …]` unsafe.
No envelope stops validating and no conforming court changes a byte.

**v1.1 → v1.1.1, and why only the PATCH component moved.** The substance test asks
the same two questions and the answer to both is **no**. Every envelope that
validated still validates; **no conforming court must change one byte of what it
emits**; the outer object, the key `diagnostics`, and the never-omitted empty
array all stand exactly as written. What changed is the *justification* §2.7
gave for itself — a jsonlib claim stated too strongly at v1.1, and a correction
to it that arrived with its own examples reversed — plus a line naming the
pre-v1.1 case and a table row. **A court pinned at v1.1 loses no requirement by
staying there, and gains only a truer reason.** Recorded rather than folded in
silently because the pair is hash-pinned: the bytes moved, so the version must
say so, or two different editions answer to one number and the manifest is the
only thing that knows.

## Honest boundaries

- **§2.8 is enforced by two mechanisms because neither one covers the rule.**
  The schema keyword is what a *foreign* validator reads and it stops one level
  down; the full-depth scan is this court's and no other court inherits it. So a
  conforming court that validates only against the schema is protected against
  the common case and not against a boolean nested inside its own extension
  object. That gap is stated rather than closed: closing it would mean either a
  schema keyword that draft-07 does not have, or this contract shipping code,
  and it ships shape.

- **One court conforms today.** The contract is family law by designation
  (reference design C2, ratified 2026-08-08), but it earns "family-wide" one
  adopting court at a time, each by its own repository's process.
- **`col` is reserved, not attested.** No implementation emits it; it is in the
  envelope so that the first one to know a column needs no amendment.
- **The zui catalog keeps its name and its version.**
  `conformance/violations.json` — titled "The Zui Diagnostic Contract" — predates
  this document and is a different artifact: it catalogs *the zui court's codes*
  (severities, levels, rule bindings); this document fixes *the envelope those
  codes travel in*. Neither governs the other.
- **The outer shape was legislated from two courts, and one of them was this
  one — the third court has since answered, and it did not confirm.** RingFlex
  and this court both emitted an object; RingServ's machine form **was not read**
  before v1.1 was written, and this document never claimed it was. It was read on
  2026-08-20, by running the binary: **a bare top-level array, no outer object,
  therefore no key.** The re-examination §2.7 offered was of *the key*; what
  arrived was a court whose whole shape the rule forbids. **The rule was not
  softened in response** — it rests on §1's single consumer and the empty-versus-
  absent distinction, and one non-adopting court is what pinning is for, not
  evidence the requirement is wrong. Whether that stays true at a fourth court is
  not something this document can claim.
- **The jsonlib argument was overstated at v1.1 and is now the weaker half of the
  case, deliberately left in place.** §2.7 could have been quietly re-founded on
  the encoder defect offered to this court as the stronger argument. **It was
  measured first — twice, and the first measurement was wrong.** At v1.1.1 this
  court published that the encoder mangles the C2 object form and the bare array
  alike, and therefore discriminated nothing. **It does discriminate**: the
  object form round-trips intact and both bare arrays are damaged. The error was
  one bracket level — `List2JSON(["diagnostics", []])` is not the shape a court
  emits; an object with one member is a list *containing* a pair. Corrected at
  v1.1.2, and the encoder stays demoted for the reason that survives both
  measurements: **no court re-emits its own output.**
- **The same defect twice, one layer apart, is the finding worth keeping.** v1.1
  transcribed a relayed measurement into a rule's justification; v1.1.1 refuted
  it and, in the same paragraph, published a second unrun measurement as the
  correction. Both were caught by somebody running the thing. **A normative home
  that accepts a number without the operation that produced it will keep doing
  this**, because the number always travels and the operation does not.
- **This court renamed itself rather than legislating its own spelling.** `zui`
  emitted `findings` and now emits `diagnostics`, which is the contract's own
  word for the thing throughout. **That is a breaking change for any consumer
  reading `findings` from `zui check --json`**, announced as one, and nothing
  inside this repository read that key. A contract's normative home choosing the
  spelling it already had would have been the cheapest possible rule and the
  least trustworthy.
- **`definitions.report` is not a second file.** The contract versions exactly
  one pair — this document and the schema — so the outer shape lives inside the
  schema, pointing at the schema's own root for each item. A pre-v1.1 schema has
  no such definition, and a court validating against one is told its report
  shape is *unspecified* rather than *satisfied*.
- **This contract moved ownership, not content.** The envelope was already the
  verifier's practice; what is new is only that the practice is versioned,
  substance-tested, and pinnable by courts that are not this one.
