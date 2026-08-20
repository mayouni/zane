# The Diagnostic Contract

**Normative. Family-wide.** This is **C2** of the Softanza reference design: the
envelope every court in the family speaks when it refuses.

**Version**: **v1.1** · 2026-08-20 (v1.0 · 2026-08-08)
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

### 2.7 The outer shape — what carries the diagnostics *(v1.1)*

A run emits more than one diagnostic, and until v1.1 this contract said nothing
about what carries them. **It says so now, and the reason is measured rather
than argued.**

**The machine form of a run is one JSON object. Never a top-level array.**

> **The family's JSON reader cannot read a top-level array.** The `jsonlib`
> shipped with Ring 1.27 returns a **one-element list** for a bare JSON array.
> A court emitting its diagnostics as a top-level array therefore emits
> something the family cannot read — and it **fails quietly**, as a list of one,
> rather than loudly as a parse error. Found by the RingFlex court on 2026-08-19
> while choosing its wire shape, which is the only reason it is written here
> instead of being met a third time.

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
| [the zui verifier](../tools/zui/README.md) (`tools/zui/`) | `zui` | v1.1 | `--json` emits the object; the conformance runner validates every diagnostic **and every run's outer object** of the 50-fixture suite against the shape |

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
  one.** RingFlex and this court both emitted an object; RingServ's machine form
  **was not read** before v1.1 was written, and this document does not claim it
  was. If RingServ carries its array under another name, the key is the part of
  §2.7 to re-examine — not the object rule, which rests on the measured reader
  and not on any court's practice.
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
