# Sensors, actuators, and the senses the framework has not met

**Status**: **v0.1 — a reflection, not a proposal for ratification.** Written 2026-08-13.
**Extends**: [THE-SECOND-FOUNDING.md](THE-SECOND-FOUNDING.md) §4, the three axes.
**Relation to the law**: v3.9 is ratified and applied; nothing here amends it. Several
things here would, if adopted.

---

## 1. The category error to refuse first

The obvious move is to add `olfactory`, `thermal` and `kinesthetic` to the ten media, and
`sensor` and `actuator` beside them. **The first half is right and the second half would
corrupt the axis**, so it is worth being exact about why.

The medium axis answers one question: **through which channel does a meaning reach a
person?** Every one of the ten is a *rendering surface*. A temperature sensor renders
nothing. A motor renders nothing. They are not weak media — **they are not media at all.**

What they are is the system's **other two ports**. The framework has silently assumed the
interface is one-directional — system speaks, human perceives — because for a screen it
is. A building, a vehicle, a greenhouse or a robot makes that assumption false.

> **A system has three ports, not one.**
>
> | port | direction | example |
> |---|---|---|
> | **render** | system → a person's senses | screen, sound, lamp, sign — the ten media |
> | **sense** | a person or the world → system | keyboard, microphone, thermometer, accelerometer |
> | **actuate** | system → the world | motor, valve, lock, heater, siren |
>
> **Media classify the render port only.** Sensors and actuators are the other two, and
> they reach a person **only when something renders them.**

That last clause is the load-bearing one. A motor turning is not a rendering. A person
*hearing* the motor turn is — and the law already governs it, as `auditory`. So the
question a sensor or actuator raises is never *"what medium is it?"* but **"what does the
law owe at the seam where it meets a person?"** Section 5 is that question, and it is where
all the real difficulty lives.

## 2. The property that explains the split — and it is missing

§4.5 classifies media by five properties: persistence, seriality, election, bandwidth,
mutability. Smell breaks it, which is how the gap surfaced.

Smell is *mutable* — a system can emit and stop emitting. But it **cannot un-send**. The
molecules are in the room. Nothing about `mutability` captures the difference between a
screen (which can be repainted this frame), a sound (which ends by itself), a printed page
(which never changes), and an odour (which decays on its own schedule).

> **A sixth property: retractability.** Once made, can the rendering be withdrawn?
>
> | | retractability |
> |---|---|
> | screen, lamp, terminal | **immediate** — repaint and it is gone |
> | sound, voice, haptic | **self-retracting** — it ends whether you like it or not |
> | smell | **slow** — it decays on the world's schedule, not yours |
> | print, signage | **never** — it is a physical object now |
> | **actuation** | **never, and worse — the world moved** |

And this is the clean answer to §1. **Retractability is what separates a rendering from an
actuation.** A rendering can usually be withdrawn; an actuation cannot, because it did not
change what a person perceives — it changed what is true. Smell sits between them, which is
exactly why it feels like an awkward medium: **it is the one rendering with an actuator's
irreversibility.**

## 3. Which of the named things are media, then

Human senses that can carry declared meaning — the render port:

- **`olfactory`** — real, narrow, and with the best prior art of any channel in this
  document. **The odorant in natural gas is legislated olfactory UI**: a meaning
  (*danger, leak*) deliberately added to a medium that had none, universal, and needing no
  training. It is Part II's road-signage argument in a second channel.
  Properties: unelected · parallel · minimal bandwidth (one bit, in practice) · **slow
  retractability**. Suited to *a persistent hazard*; structurally unsuited to anything
  transient, because it cannot be taken back.
- **`kinesthetic`** — force, resistance, detents, steering weight. This is what "motion"
  means on the render side, and it is **not** `haptic`: a vibration is a signal, a detent is
  a *constraint you feel while acting*. It carries `ROLE` — the promise a control makes —
  better than any other channel, because resistance tells you what a control will do before
  it does it.
- **`thermal`** — temperature on skin. Real and very narrow. Slow retractability, minimal
  bandwidth, and a hard safety ceiling that is statutory rather than ours.
- **`vestibular`** — balance and acceleration, in vehicles and XR. Real, and the only
  channel that can make an operator *ill*, which is a duty of care no other medium carries.
- **`gustatory`** — no. Not a UI channel, and inventing one would be the kind of
  completeness that discredits a taxonomy.

**But the discipline of §4.5 says do not simply enumerate them.** Four more names takes the
list to fourteen and past the point where anyone holds it. The right move is the one the
medium axis already made: **classify by property, and let the enumeration be the finite
set of channels anyone has actually built.** `olfactory` earns a place because gas odorant
exists; `gustatory` does not.

## 4. Motion, on the sense side — and it is a different thing

The user's first word was *motion*, and it names two distinct things the framework must not
merge:

- **motion rendered** — force feedback, a detent, a device that moves. The `kinesthetic`
  medium above.
- **motion sensed** — gesture, accelerometer, gaze, presence. **The sense port**, and not a
  medium at all.

The second is where a genuinely new problem lives: **an operator who did not choose to act
may still be sensed as acting.** A gesture recognised, a presence detected, a gaze tracked.
Every one of the 22 verbs assumes the human *elected* the act. Sensing does not require
election — and the law's whole architecture of consent (`SELECT` expresses interest, never
commitment; `CONFIRM` before `ACT`) rests on the assumption that a system knows what you
chose because you told it.

## 5. What the law must answer — four collisions, in order of severity

This is the real content. None of it is about media lists.

### 5.1 · Undo meets a world that does not undo

Rule 79, **The Undo Covenant**: *"Every act has a reachable undo, or declares why it
cannot."* The second clause is written as the **exception**. In actuation it is the
**norm** — a valve that opened, a door that unlocked, a dose that was delivered. The world
moved and there is no toast that unmoves it.

Two consequences, and both are new law:

- **`CANCEL` acquires a deadline.** Today `ALWAYS_REACHABLE [CANCEL]` means *reachable at
  every step*. For a physical act it means *reachable until the point of no return* — and
  **that point must be declared**, because only the declaration makes it checkable. An act
  that cannot say when cancellation stops being possible cannot honestly offer it.
- **The "declares why it cannot" branch needs a form.** Right now it is prose. Under
  actuation it becomes the common case, and a common case needs a field.

### 5.2 · Perceivable State meets a system that knows too much

Rule 82 is now **Perceivable State**: *if the system knows something important, the
operator must be able to perceive it.* With a keyboard, the system knows what you told it.
**With sensors, it knows continuously and vastly** — temperature, occupancy, vibration,
position, a thousand readings a second.

That collides head-on with Rule 1, **Cognitive Mercy**: *the interface must never compete
with the user's thinking.* Surface everything and you violate Rule 1. Surface nothing and
you violate Rule 82.

**Neither rule can arbitrate this, because neither was written for a system that senses.**
The missing concept is a declared threshold: *what makes a sensed value important enough to
owe perception.* That is not a rendering question and not a sensing question — it is a
**law** question, and it is the sharpest new one on this page.

### 5.3 · The hundred milliseconds meets physical time

Rule 18 requires acknowledgement within 100 ms. A valve takes seconds. A lock takes
hundreds of milliseconds and may fail. So a physical act has no single moment to
acknowledge — it has a **lifecycle**:

> accepted → dispatched → moving → arrived → **confirmed by sensing**

The last step is the one screens never needed: **the system does not know the act
succeeded until a sensor says so.** An interface that reports success on *dispatch* is
lying in exactly the way Rule 18 already forbids (*"a fake progress bar is a lie"*), and it
is the failure mode of most IoT products shipping today.

Rule 125 is the precedent, and it generalises: the sound plane found that a 419 ms channel
**corroborates** rather than acknowledges. Physical actuation is that finding an order of
magnitude further out.

### 5.4 · The bystander gap, made concrete

Founding §6.7 filed a Core-level hole: *the law assumes an operator, and physical media
address bystanders.* Actuators make it worse than signage did. A sign misread is a wrong
turn; **an actuator affects people who never opted in, cannot see the interface, and get no
second attempt.** And here the statutory tier binds hardest — machine safety is regulated,
and §8 tier 0 already says an external standard outranks this law absolutely.

## 6. What does *not* change — and this is the strongest result

**No new verbs.** `ACT` covers opening a valve; the actuator is a *rendering of `ACT` into
the world*, exactly as a button is a rendering of it onto a screen. The grammar's own note
holds: *a new medium adds renderings, never verbs.* The closed 22 survive contact with IoT,
which is the second time the closure has paid — the first was making a medium × verb
coverage matrix finite at all.

**No new strata.** The six absorb it: `SIGNAL` carries a sensed value's meaning, `ROLE`
carries the promise an actuator control makes, `TEMPO` carries §5.3's lifecycle, `MESSAGE`
carries what the system says when a sensor disagrees with a command.

**So the framework holds, and the pressure lands where it should — on the law.** Four
rules meet cases they were not written for, and one property is missing from the medium
classification. Nothing structural breaks. That is a better result than the framework
deserved, and it is worth saying plainly rather than claiming the design anticipated it.

## Honest boundaries

- **This is a reflection, and nothing here is ratified.** §5's four collisions are the
  candidates for a docket; none has been drafted as an amendment.
- **The olfactory claims are the least verified.** Gas odorant as legislated safety signal
  I am confident of; anything about smell and sleep, alerting, or habituation I am not, and
  did not check. Do not build on it without reading the literature.
- **`vestibular` may not belong.** Making an operator ill is a duty of care, but it may be
  a *constraint on rendering* rather than a channel that carries meaning. Unresolved.
- **§5.2 is the one I would take to a docket first** and the one I am least sure how to
  express. "What makes a sensed value important enough to owe perception" is a threshold
  the law has never had to state, and stating it badly would be worse than leaving Rules 1
  and 82 in tension where a human resolves it case by case.
- **Nothing here has met a device.** Everything above is reasoning from the framework
  outward. MicroRing is where it meets hardware, and hardware is where taxonomies go to be
  corrected.
