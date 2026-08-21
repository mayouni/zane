# The Diagnostic Contract

**Normative. Family-wide.** This is **C2** of the Softanza reference design: the
envelope every court in the family speaks when it refuses.

**Version**: **v1.1.1** · 2026-08-21 (v1.1 · 2026-08-20 · v1.0 · 2026-08-08)
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

### 2.7 The outer shape — what carries the diagnostics *(v1.1, justification corrected v1.1.1)*

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

**The encoder is worse than the decoder, and it is *not* evidence for this
rule.** `List2JSON` emits documents `JSON2List` cannot parse — it renders a
member as `"k": "v"` only when that member is a two-string list, and emits
everything else bare between braces:

| round-tripped through Ring 1.27 | comes back as | re-read |
|---|---|---|
| `["a","b"]` | `{ "a", "b" }` | **raises** |
| `[["a","b"],["c","d"]]` | `{"a":"b","c":"d"}` | **parses — silently now an object** |
| `{"diagnostics":[]}` | `{ "diagnostics", [ ] }` | **raises** |
| `{"diagnostics":[{…}]}` | `{ "diagnostics", […] }` | **raises** |

**Read the third and fourth rows before citing this against arrays: the C2
object form does not survive a Ring round-trip either.** The encoder fails on
*both* shapes, so it separates nothing and cannot argue for one over the other.
It was offered to this court as the stronger argument for §2.7 and it is not an
argument for §2.7 at all — it is a fact about re-emitting *any* decoded JSON
from Ring, which no court here does. Recorded because a rule defended by
evidence that does not discriminate is a rule waiting to be overturned by
whoever checks.

**So the jsonlib evidence for the object is the decoder alone, and it is mild.**
The load-bearing argument is the one below it — §1's single consumer, and the
`[]`-versus-absent distinction — neither of which depends on Ring.

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
| [the zui verifier](../tools/zui/README.md) (`tools/zui/`) | `zui` | v1.1.1 | `--json` emits the object; the conformance runner validates every diagnostic **and every run's outer object** of the 50-fixture suite against the shape |

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
  the encoder defect offered to this court as the stronger argument. It was
  measured first, and it does not hold: the encoder mangles the C2 object form
  and the bare array alike. **An argument that does not discriminate was not
  substituted for one that was merely mild.**
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
