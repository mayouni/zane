# Placement exercise: read the rules of a design law and place each on a grid

You are an independent reader of a placement. Another reader already placed these rules, and you have not seen that
placement and must not look for it. Use ONLY this file. Do not open, search or read any other file, and do not run
anything. Work from the words of each rule and from the diagnostics listed with it.

## What you place

For each rule in the packet at the end, decide two things. Every rule in the packet belongs on the grid, so answer both
for every one:

1. **Its activities**: which of the six activities of the grid it is about (one or several, from the table below).
2. **Its medium scope**: "any", or the list of media it is written for, decided by the three-step order below.

Read each rule's title and its `why` for the activities. Give one line of reason per rule.

Each rule also lists the **diagnostics** bound to it: a diagnostic is a check a verifier runs on a declaration. For each,
you are given its id, its summary and `decidable_from`, the parts of a declaration the check reads. A rule may have none.

## The grid

{{GRID}}

## How the medium scope is decided, in this order

A rule has a set of activities, read from its title and its stated reason (`why`). It then has a medium scope, decided in
this order:

1. **named**: a rule whose own words or realisation name a medium sits on that medium. A named rule that is also written
   for the screen sits on visual too.
2. **medium-free**: a rule with a diagnostic whose check does not look at the medium (all bound diagnostics except
   `LAYOUT_DISPLACEMENT`), or with no screen wording in its title, `avoid` or `solution`, sits on `any`.
3. **visual**: every other rule, by its screen wording (colour, click, scroll, button, label, table and the like).

## What to return

Return ONE JSON array and nothing after it, one object per rule in the packet, in the packet's order:

```json
[{"number": 1, "activities": ["perceive","decide"], "media": "any", "reason": "one line"},
 {"number": 2, "activities": ["understand"], "media": ["visual"], "reason": "one line"}]
```

- "activities": a non-empty list of names from {perceive, understand, decide, act, recover, trust}.
- "media": the string "any", or a list of ids from {visual, auditory, voice, haptic, print, luminous, signage, machine, spatial, terminal}.
- Before the array, one line: "files read: <list>" (it should be only this one).

## The packet

{{PACKET}}
