# Sound semantics — giving the sound plane a meaning layer

**Run in**: `D:\GitHub\stzlib`

**Precondition**: the five semantic values are settled (plan S1). Without that this
session has no vocabulary to transpose and must not start.

**Timing**: **before SN6.** SN0–SN5 are closed and SN6 is where the plane first reaches
outward — the reactive layer, the WebAudio sink, the game-plane doors. A vocabulary
agreed before those doors open costs a document; agreed after, it costs a migration.

---

You are opening the sound-semantics session. Read, in this order:

1. `D:\GitHub\stzzui\doc\THE-SECOND-FOUNDING.md` — **§2.1 and §6.1 only**. §2.1 is the
   finding this session answers; §6.1 is the proposal, and it is a proposal *to you*, not
   a specification of you.
2. `D:\GitHub\stzlib\libraries\stzlib\base\graphics\SOFTANZA_COLOR_SYSTEM.md` — the
   precedent being transposed, in full. Everything asked for below already exists there
   in the visual channel.
3. Your own `D:\GitHub\stzlib\libraries\stzlib\base\sound\SOFTANZA_SOUND_PLAN.md`.
4. `D:\GitHub\stzzui\constitution\rules.json` — Rules 3, 118 (the five values), 18 (the
   hundred milliseconds), 112 (motion reports, it never decorates), 62 (contrast, and how
   a floor binds to an instrument).

**The finding you are answering.** The sound plane is a serious engine with no notion of
what a sound *means*. Searched across the whole plane: `earcon`, `sonification`, `sound
role`, `alert sound`, `notification`, `auditory` — zero hits. There is no success sound,
no error sound, no alert taxonomy, no priority, no mapping from an application event to a
sound. Meanwhile the UI constitution legislates five semantic values and has never once
been cited by this plane, nor cited it. That is exactly how the colour vocabulary drifted
into three incompatible spellings before anyone noticed. **This session exists so the
same thing does not happen to sound, and it is early enough that it need not.**

---

## Deliver: a semantic layer above the plane

Everything below sits **above** the graph. This session changes **no node, no sink, no
callback, no buffer and no timing path**. If a deliverable requires touching the
real-time path, it is wrong and should be reported as such rather than built.

1. **A plan-of-record section for the semantic layer**, in `SOFTANZA_SOUND_PLAN.md`, in
   the file's own voice and discipline. Kill criterion written before the numbers, as
   every phase there does.

2. **The five semantic values, in sound.** The same five names the law and the colour
   engine use — one vocabulary, two channels, so that `:Danger` sounds like danger and
   looks like danger from one declaration. The transposition, which is a proposal you
   should improve or refuse on acoustic grounds:

   | Colour — built and proven | Sound — the analogue |
   |---|---|
   | hue = identity | **timbre** = identity |
   | lightness = prominence | **salience** = loudness × spectral brightness × repetition |
   | the sRGB gamut = what can be shown | the band between the **ambient noise floor** and the discomfort ceiling |
   | chroma searched to fit the gamut | salience **fitted to the room**, never chosen by an author |
   | role steps `.Surface .Border .Solid .Text` | `.Ambient` · `.Cue` · `.Alert` |
   | `:OnDanger` — what can be *read on* it | `:OverDanger` — what can be *heard over* it |

   The `:Name` convention already matches your named nodes (`:tone`, `:bell`), so this
   slots into syntax that exists.

3. **Priority and ducking.** Genuinely new work, not a relabelling: the plane has no bus
   or priority concept beyond the mix node. Decide what happens when two semantic sounds
   fire at once, and what gets quieter when one does. `:OverDanger` is the ducking
   question stated as a contract.

4. **An audibility floor, bound to an instrument you already ship.** `Loudness` (LUFS) is
   the auditory analogue of a contrast ratio, and SN5 already ships it. Colour's doctrine
   transposes exactly: *a sound system that cannot fail an audibility check does not have
   one.* Say what the floor is, measure against it, and gate it the way the colour plane
   gates 4.5:1.

5. **A latency budget written against Rule 18.** The constitution requires acknowledgement
   within 100 ms. Your own measurement is 112.6 ms output latency, decomposed as ~30 ms
   app buffer + ~22 ms measurement tap + ~60 ms OS pipeline, with the standing instruction
   *"quote the buffer, never the 112 ms."* Nobody has put those two numbers side by side.
   **Do that, and say plainly whether a sound can be a lawful acknowledgement on this
   pipeline** — including the honest answer that it depends on the buffer, or that it
   cannot on some hosts. Your finding that *"what has a deadline is the WAKE-UP; what must
   fit inside it is the burst's TOTAL work"* is the kind of fact such a budget is written
   against.

6. **Guards**, in the plane's own narrated-Ring genre, for the vocabulary, the floor and
   the priority rules.

7. **The cross-citation.** The plan records which constitutional rules the semantic layer
   serves. Reciprocally, StzZui will record the instrument. This is the cheapest defence
   against the next drift and the one the colour plane and the law both skipped.

---

## Three laws sound needs that colour does not

State them in the plan; they change what the layer must offer.

- **Sound is interruptive by default.** A colour waits to be looked at; a sound seizes
  attention, and there is no eyelid for the ear. Rule 112 — *motion reports, it never
  decorates* — is the **stronger** rule in this channel.
- **Silence is the default and must remain sufficient.** Sound is the first thing switched
  off, and it is unavailable in open-plan offices, in meetings, and to deaf operators. So:
  **a semantic sound is always redundant with another channel and never the sole carrier
  of a state.** This is simultaneously the accessibility law and the practicality law.
- **A sound is not persistent.** A colour stays until changed; a sound is gone. Anything
  the operator has a *right* to know cannot be delivered by a sound alone — it must remain
  re-requestable.

---

## Do not

- **Do not touch the real-time path.** No node, sink, callback, buffer or timing change.
- **Do not take on speech.** Your plan rules speech synthesis and recognition out of scope
  as neural-tier work. That boundary is yours and is not being contested. Voice is a
  separate medium with a separate owner.
- **Do not invent a sixth semantic value.** If five are insufficient for sound, that is a
  finding to report — it would mean the law's five are wrong, which is a constitutional
  matter, not a plane's.
- **Do not compute meanings the author should declare**, and do not let an author type a
  waveform where they should type a meaning. The colour plane's rule holds: *"an author
  writes a meaning and gets a colour."*
- **Do not treat §6.1 as specification.** It was written from the colour precedent and the
  law's gaps by someone who had read your plan once. Where acoustics contradict it, the
  acoustics win, and the contradiction is the most valuable thing this session can report.

## One aside, on your own discipline

The plan's rule 9 says *"record the outcome in this file"*, and the post-SN5 work — the
web studio, `stzSoundPlot`, the five plates, the band-limited oscillators — is committed
but unrecorded there. Worth closing while you are in the file, or explicitly deferring.

---

Commit locally, plain factual messages, push nothing without my review. If the
transposition is wrong, say so and say why — a refusal with acoustic reasoning is a better
outcome for this session than a vocabulary that sounds tidy and works badly.
