# ROLE, attacked before it is built

**Status**: **a design pass, not a proposal for ratification.** Written 2026-08-17.
**Why it exists**: [SECOND-FOUNDING-PLAN.md](SECOND-FOUNDING-PLAN.md) S9 says ROLE *"is the
load-bearing move of the whole vision and should be attacked before it is built."* This is
the attack.
**Result**: **the founding's account of ROLE is wrong in its sourcing and nearly right in
its content.** A five-value vocabulary is extractable, every value traces to a rule, and
one of the three values the founding proposed must be dropped — with a rule saying why.

---

## 0. A correction, first

An earlier pass in this session searched the law for ROLE's proposed values and reported
that **none of them appeared in any of the 122 rules**. That was produced by a broken test:
the search patterns were assembled through a shell heredoc that collapsed `\\b` to `\b`, so
every regex was looking for a literal **backspace character** and matched nothing. The
control term `undo` also returned zero, which is impossible — Rule 79 is *The Undo
Covenant* — and that is what exposed it.

**Re-run with plain substring matching and a control**: `instant` appears in 7 rules,
`reversible` and `irreversible` in 3 each, `destructive` in 1, `promise` in 4, `role` in 6,
`affordance` in 4. **ROLE is grounded, not invented.** The conclusion the broken test
supported is withdrawn.

The finding that survives is a different one, and it was reached by reading rather than
searching — §1.

## 1. The founding is looking in the wrong set

> *"`ROLE` — the promise a control makes… **Reaches**: Set 13 (7), Set 11 (2), Rule 119."*
> — THE-SECOND-FOUNDING §5

**Set 13 is titled *Widget Selection*, and it contains widget prescriptions.** Read in full:

| Rule | What it prescribes |
|---|---|
| 45 | auto-expanding plaintext or Markdown, blur-to-save |
| 46 | a text field accepting ISO dates and `+7d`, calendar icon as fallback |
| 47 | monospaced fonts with tabular-nums, right-aligned |
| 48 | a high-density row-striped grid, actions hidden until row hover |
| 49 | a vertical agenda view rather than a monthly grid |
| 50 | Tufte sparklines, no 3D, no pie charts |
| **119** | **form follows role, and each widget plays exactly one** |

**Six of the seven name a widget and prescribe its form** — which is exactly what a
declaration may not do (DECLARATIONS §6: *no `WIDGET`, no layout, no colour*). Only Rule 119
speaks of role at all.

So ROLE cannot be extracted from Set 13 without importing the widget vocabulary it exists
to avoid. **That is the trap, and it is worth naming plainly**: a ROLE stratum sourced from
Set 13 would arrive as `card | button | link | table | sparkline` — a widget list wearing a
new word, and the `WIDGET` exclusion defeated by spelling.

**The real sources are elsewhere**, and they are better: **Set 26** (Action Reversibility),
**Set 29** (Declaration Governance), **Set 31** (Intelligence Under Law) and **Set 5**
(Interaction Principles). Those legislate *consequence*, which is what a promise is about.

## 2. The vocabulary, extracted

Five values. Each is a claim about **what happens when the operator acts**, not about what
the control looks like.

| value | the promise | extracted from |
|---|---|---|
| **`inert`** | informs; acting on it does nothing | **119** — *"a card is a read-only indicator… with no call to action inside it"*; **16** — nothing may behave like a button but not be one |
| **`navigate`** | changes what is shown, never what is true | **112** — *"everything else is instant: selecting a menu item, following a link or an anchor, opening a panel, switching a vibe"* |
| **`reversible`** | changes what is true, and the change can be taken back | **79** — *"every destructive action (delete, archive, clear) must have instant, one-click undo for 10 seconds"* |
| **`irreversible`** | changes what is true and cannot be taken back | **79** — *"confirmation dialogs reserved only for irreversible system-level operations (purge database, revoke credentials)"* |
| **`proposal`** | advises; commits nothing until an authority accepts it | **98** — *"a model's output is a proposal — rendered as such, reviewable, dismissible — and becomes a commit only through an authority the declaration names"* |

**Nothing here names a widget.** A `reversible` role may be a button, a swipe, a keyboard
shortcut, a spoken command or a physical switch — the promise is the same and the rendering
is the projection's business, per medium.

### 2.1 Why `binary state` is dropped

The founding proposed *"instant, reversible, binary state"*. The third must go, and **the law
already says why**:

> **Rule 106**: *"A toggle labeled with a state — 'Dense view', 'Dark' — is a quiz: the user
> cannot tell whether it describes what is or promises what will be."*

So a state-labelled control is **a defect the law names**, not a role a declaration should be
able to claim. What the founding was reaching for is real, but it is either `navigate`
(switching a vibe — Rule 112 lists it) or `reversible` (changing a stored preference), and in
both cases Rule 106 requires the label to carry the *verb*, not the state.

**A vocabulary that let a declaration say `ROLE binary_state` would let it declare the
defect as its intent.**

### 2.2 Why `instant` is dropped as a *value*

`instant` appears in 7 rules and is tempting. But read where: Rule 112 uses it for
**latency** (*"everything else is instant"*), Rule 79 for **undo speed** (*"instant,
one-click undo"*). **It is a `TEMPO` word, not a `ROLE` word** — it says how fast, not what
happens. Putting it in ROLE would put one concept in two strata, which is the defect the
v3.11 colour reconciliation was about.

## 3. What becomes checkable — and this is the argument for the stratum

A role is worth declaring only if declaring it lets a court refuse something it cannot
refuse today. Six checks follow. The rules they enforce sit at these tiers — 16, 98, 112 and
119 at `judgment`, 79 and 83 at `machine` — so the interesting claim is **not** that they are
all unenforced. It is narrower and better: **three of the six enforce the half of Rule 79
that has never had an instrument.** Rule 79 sits at `machine` because `MISSING_UNDO` checks
its first clause; its second — *"no confirmation dialogs for common operations… reserved only
for irreversible system-level operations"* — has been unenforceable, because nothing in a
declaration said which kind of act it was.

> **BUILT 2026-08-18, and building changed this table.** Two of the six proposed checks
> were **withdrawn as unbuildable**, one was added, and one discovery outranks all of them.
> The table below is the design as proposed; §3.1 records what survived contact.

| check | fires when | enforces |
|---|---|---|
| `ROLE_AFFORDANCE_LIE` | an `inert` role carries an action affordance | 16, 119 |
| `CONFIRM_ON_REVERSIBLE` | a `reversible` role declares `CONFIRM` | **79** — confirmations are *reserved* for irreversible; a confirm on a reversible act is the dialog Rule 79 forbids |
| `IRREVERSIBLE_WITHOUT_CONFIRM` | an `irreversible` role does not declare `CONFIRM` | **79** |
| `IRREVERSIBLE_CLAIMS_UNDO` | an `irreversible` role declares `UNDO` | **79** — a promise the surface cannot keep |
| `PROPOSAL_COMMITS` | a `proposal` role satisfies `ACT` without a named `ACTOR` | **98**, 83 |
| `ROLE_VARIES` | the same control name carries two roles in one file | **83** — *"same action, same consequence"* |

### 3.1 What survived contact — and one thing nobody predicted

**`CONFIRM_ON_REVERSIBLE` is withdrawn, and it was §3's headline.** It cannot be built,
because it contradicts `SELECT_ACT_COLLAPSE`: a declaration holding `SELECT` and `ACT`
**must** hold `CONFIRM` to be lawful, so a reversible selection flow would have had no
lawful configuration at all. The deeper reason is that **the declaration cannot see the
defect**: `CONFIRM` in `SATISFIES` means *the operator confirms*, which covers both a review
step and Rule 79's forbidden modal — and those are the same declaration with two renderings.
**Rule 79's dialog clause is a fact about a rendering, not about a declaration**, so it
belongs to the audit rather than to this court. Recorded rather than quietly dropped,
because §3 called it *"the one that pays for the stratum"* and that claim was wrong.

**`ROLE_VARIES` is withdrawn as unreachable.** `DUPLICATE_DECLARATION` already refuses two
declarations sharing a kind and a name, so one `INTERACTION` name cannot carry two roles in
one file. The check could never fire.

**`IRREVERSIBLE_WITHOUT_CONFIRM` is withdrawn as over-reach.** Rule 79 *reserves*
confirmation for irreversible operations; it does not *require* it. Reserving a tool for a
case is not obliging its use, and reading it as an obligation would legislate past the rule.

**`ROLE_MISPLACED` was added while building** — `ROLE` on a `SCREEN` would otherwise be
ignored in silence, which is what `TONE` and `PERSPECTIVE` do today when they land on the
wrong kind. **That silence is a gap in those two, not a precedent worth copying.**

**And the discovery that outranks the whole table:**

> **`ROLE irreversible` is Rule 79's escape clause, made expressible for the first time.**

The action family's invariant has always read *"every act has a reachable undo, **or
declares why it cannot**"*, and `VIOLATIONS.md` has always said a genuinely irreversible
declaration must say so explicitly rather than stay silent. **The language had no way to say
it.** So the second half of that invariant was prose the grammar could not carry, and the
only way past `MISSING_UNDO` was to promise an `UNDO` that could not be honoured — the exact
lie `IRREVERSIBLE_CLAIMS_UNDO` now refuses.

`MISSING_UNDO` therefore does not fire on a declaration carrying `ROLE irreversible`. This
is **not an exemption added to make a fixture pass**; it is an invariant that has been in
the law since v1 finally having a form. The pair now partitions the space cleanly: *keep the
undo, or say plainly that you cannot.* **Silence is still refused.**

That was not predicted in §3 and is the strongest argument for the stratum — stronger than
the one §3 offered and then lost.

**`CONFIRM_ON_REVERSIBLE` is the one that pays for the stratum**, and it is worth being
concrete about why. Rule 79 already forbids the confirmation dialog on a common operation.
The verifier cannot enforce that clause, and no instrument anywhere can, because
**the declaration never said which kind of act it was** — `SATISFIES [ACT, CONFIRM]` is
lawful and reads identically for *delete an invoice line* and *revoke every credential*.
The role separates them in one word.

And the defect it catches is the most common one in the domain this law serves: a confirm
dialog on every delete, which trains the reflex that makes the operator click straight
through the one that mattered. **That is Rule 79's own reasoning** — *"trust users, respect
their flow"* — and it has been prose since v1.

## 4. Where it attaches, and the risk that remains

`SIGNALS` attaches to any declaration and needs no target, because a surface carries
statuses collectively. **A role is per-control**, and `.zui` has no control primitive — by
design, since a control is a rendering.

Two shapes, and neither is free:

- **`ROLE` as a scalar on `INTERACTION`.** That declaration already exists and already means
  *an act bound to an object*, which is exactly a control's referent without being a widget.
  Cheap, honest, and limits roles to declared interactions.
- **`ROLES [name:value, …]` as a map on any declaration.** Richer, and **it breaks
  GRAMMAR §2's flat rule**: fields hold scalars and identifier lists, never pairs. That is a
  grammar change with nesting at the end of it, and nesting is *"where widget trees creep
  back into an intent language."*

**Recommendation: the first.** `ROLE` on `INTERACTION`, one scalar, no grammar change. If a
surface needs six roles it declares six interactions, which is honest — six controls with
six different consequences *are* six things.

**The residual risk, stated so it can be checked later**: if authors find declaring an
`INTERACTION` per control tedious, they will under-declare, and the checks above will pass
by silence. **That failure is invisible** — a surface with no roles declared raises nothing.
`EXPRESSION_ORPHAN` catches the reverse case only. Whether the law should ever *require* a
role for a declaration satisfying `ACT` is the question that decides whether this stratum
has teeth, and it is not answered here.

### The risk was ruled on, and the answer was a measurement — 2026-08-20

**The requirement: not yet, and not refused.** The Principal ruled on 2026-08-19
(`stz-principal/decisions/LEDGER.md` line 38) that requiring a role is **deferred to
evidence**, and ruled the counter-check into its place. Its reason came from this document's
own honest boundary: **the five values have not met a real surface**, so requiring an
unproven vocabulary redirects the pressure rather than removing it. The author who finds one
`INTERACTION` per control tedious declares one, gives it a role, and passes with a role that
is **wrong**. *Invisible under-declaration becomes invisible mis-declaration*, which is worse
than the gap it closes: a silent gap turned into a green check.

**Built instead**: `ROLE_UNDECLARED`, severity `warning`, level 2, once per file at span
`line: 0`, firing when a file declares at least one `INTERACTION` and no `ROLE` on any of
them. It cites no rule, because no rule is violated. It refuses nothing — a run carrying only
this diagnostic exits **0**. Fixtures: `role-undeclared.zui` and its lawful twin.

**What decides the requirement is two numbers read together**, and neither alone: how much
under-declaration there is, **and** whether the roles authors did declare are accurate.
Require it if under-declaration is high *and* the declared roles are accurate. If they are
inaccurate, **the vocabulary is wrong**, and requiring it would have entrenched the error.

**The datum that has not arrived**: no `.zui` file outside this repository's fixtures has
declared a role yet. The first real surface that does is the observation this whole question
waits on, and the court says so in its outbox when it happens.

**What the measurement still cannot see**, restated because a number invites more confidence
than it earns: an author who declares no `INTERACTION` at all. `ROLE_UNDECLARED` counts
*roles per interaction*. *Interactions per control* is the deeper under-declaration named at
the top of this section, and `.zui` has no control primitive to count against — by design.

## Honest boundaries

- **This was a design pass and nothing was built.** No grammar, no diagnostic, no fixture. **Superseded**: the grammar, the six checks and their fixtures shipped on 2026-08-19, and `ROLE_UNDECLARED` joined them on 2026-08-20. The boundary is kept rather than deleted, because everything reasoned below it was reasoned before any of it met an implementation.
- **§0's correction matters more than it looks.** The first version of this analysis reached
  a confident, tidy, wrong conclusion from a broken measurement, and the only reason it did
  not ship is that a control term returned an impossible zero. **Put a control in every
  corpus test.**
- **The five values have not met a real surface.** They were extracted from rules, and rules
  describe defects someone met — but no `.zui` file has declared a role yet, and the first
  real one may show the set is four or six.
- **`proposal` is the least tested.** Set 31 has three rules, all `judgment`, and the agent
  surface is the newest jurisdiction in the law. `PROPOSAL_COMMITS` as drafted leans on
  `ACTOR`, which may not be the right hinge.
- **MESSAGE is not analysed here.** Its own extraction test showed `cause` in 14 rules and
  `actor` in 4, but `remedy` in none — the concept exists in Rule 40 as a *"fixing verb"*,
  under a different word. That is a separate pass and it should not be folded into this one.
