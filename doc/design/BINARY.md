# One binary: StzZui without Node

**Status**: design only, for Central's read. **No code is written until Central rules** (the NOTE of 2026-11-04 17:30 is the order). Written 2026-11-04 by the StzZui desk.
**The author's words** (typing kept): *"We should not depend on Node or any other thing! Provide our own sole binary that host everything alongwith a js alternative for whome wants the execution to happen solely in the browser (via a wasm prot of the main binary if you want)."*

**What this changes about the site's honesty**: until the binary ships, the site says truthfully that the verifier needs Node (six pages say it today: the front page, Adopt, Build, Language, What it refuses and Conformance). When it ships, the pages say "one file". Nothing in this document changes what the site may say now.

---

## 1. What the binary is, in one paragraph

One static executable, written in Zig (the estate's standing substrate recommendation of 2026-10-30: stay on Zig, one static binary per language), that carries everything a person needs from this repository and
nothing that needs installing: the **verifier** (`check`), the **conformance suite** (`conformance`), the **pack check** (`pack`), the **cross-medium proof** (`cross-medium`), the **audit's facts check** (`audit-facts`),
and a **local server** (`serve`) that serves the site, the Reader and the UI audit, and can serve *your own application beside the audit* so that the audit's same-origin rule is no obstacle. **The same core
compiled to wasm** runs everything that needs no file system, in a browser, with no server and no install. `zane.js` stays only until the wasm is at parity.

```
 zane check payments.zane                  # the verifier, text or --json (the C2 envelope)
 zane conformance [--level N]             # the 73 fixtures and the contract's cross-checks
 zane pack --check                        # the bytes you hold against the manifest
 zane cross-medium                        # renderings differ only as the data predicts
 zane audit-facts file.facts.json         # the screenshot audit's facts file: shape, arithmetic, decisions
 zane serve                               # this site, the Reader, the UI audit, on 127.0.0.1
 zane serve --app ./dist                  # your application at /, the UI audit at /__zane/audit.html: same origin
 zane version                             # the law's version, the language's, the build mode, the target, the hash of itself
```

The name `zane` is a proposal (section 11).

---

## 2. What needs Node today, and what each piece really is

Measured on the tree on 2026-11-04. **Nothing here uses a package**: Node's `fs`, `path` and `crypto` only.

| tool | lines | what it is | what it needs from Node |
|---|---|---|---|
| `tools/zane/zane.js` | 730 | the verifier core: a lexer, a parser, the checks. **Pure functions over a string**; it already runs in a browser as `window.Zane` | nothing (it is Node-free by construction) |
| `tools/zane/envelope.js` | 190 | builds and validates the C2 envelope | `fs`, `path` (reads the schema) |
| `tools/zane/cli.js` | 235 | the command line | `fs`, `path` |
| `tools/zane/conformance.js` | 238 | the suite and the contract's cross-checks | `fs`, `path` |
| `tools/zane/cross-medium.js` | 237 | the cross-medium proof | `fs`, `path` |
| `tools/zane/pack.js` | 202 | the pack's hashes | `fs`, `path`, `crypto` (sha256) |
| `doc/design/audit/check-facts.js` | 132 | the screenshot audit's facts file | `fs` |
| `tools/site-facts.js`, `tools/site-shell.js` | 310, 341 | **this site's own build checks** (they re-run the verifier on the page's declarations, render the shell) | `fs`, `path`, `child_process` |
| `tools/ui-audit.html` | 708 | the UI audit | **a browser, no Node**: it measures what a browser paints and **cannot be ported to Zig**; it stays JavaScript and is served by the binary |
| `haro/judge-zane-court.js` | 155 | judges the Haro-forged court against the suite | needs the Haro spike on **rnxc**; **not** part of the binary (section 10) |

So the Node dependence is **thin**: one pure core (730 lines) and about 1,600 lines of file handling around it. That is what makes this a design to size, not a rewrite to fear.
**A "JS alternative for the browser" already half exists**: `zane.js` runs in a browser today, but no page of the site uses it (a search of `site/` finds no reference). The wasm route in section 6 is the second route to the same place and
the first one that needs no JavaScript to *be* the verifier.

---

## 3. The shape: a pure core and a thin shell

```
  core/      pure: check(source, options, allocator) -> Report        no file system, no clock, no network
             lex, parse, the checks, the tables, the envelope builder
  data/      the standard's data, embedded at build:  violations, media, signal, manifest, schema,   (@embedFile)
             and, for `pack` and `serve`, the pinned files themselves
  shell/     the commands: check, conformance, pack, cross-medium, audit-facts, serve, version        (file system, sockets)
  wasm/      the export surface of core, and nothing else:  zane_check(ptr, len) -> ptr, zane_free(ptr, len)
```

**One source tree, two targets.** `core/` is compiled to a native executable (with the shell) and to `wasm32-freestanding` (with the export surface). The same code, so a difference between them can only come from the target, which
the parity proof (section 5) is built to find.

**Data and code stay separate on purpose.** `zane.js` carries hand-written tables (the media carriage, the signal absences, the field lists) and the conformance step proves they agree with `media.json`, `signal.json` and
`violations.json`. The Zig core keeps that discipline: **its tables are written in Zig, independently, and `zane conformance` checks them against the data** — a third evaluator that derived its tables *from* the data would agree with the data
by construction and prove nothing. The cost is a third copy of the tables, which the check is there to catch.

**No allocator surprises.** The core takes an allocator and returns an owned report; the native shell uses an arena per file; the wasm export owns a fixed arena and exposes `zane_free`. No global state, so a browser can call it twice.

---

## 4. What moves from JavaScript to Zig, and in what order

Each stage ends with a gate and leaves the JavaScript standing. **Nothing is deleted until the gate of the stage after it has held** (section 7).

| stage | content | gate | rough size, in desk sessions (an estimate, not a measurement) |
|---|---|---|---|
| **S1: the core** | lexer, parser, the checks, the tables, the envelope, `check` and `version`. Written against the 73 fixtures and the grammar, never by translating `zane.js` line by line | `zane check` byte-identical to `node tools/zane/cli.js check` on every fixture and on the corpus of section 5 | 3 to 5 |
| **S2: the rest of `tools/zane`** | `conformance`, `pack` (with sha256 from `std.crypto`), `cross-medium`, `audit-facts` | `zane conformance` prints the same 73 of 73; `zane pack --check` verifies the same 12 files | 2 to 3 |
| **S3: the wasm** | the export surface, a thirty-line loader, a proof page and **a "try it" box on the Build page** (paste a declaration, see the verdict, nothing leaves the page) | the proof page runs all 73 fixtures in a browser and shows 73 of 73 and the identical envelopes | 1 to 2 |
| **S4: the server** | `serve` (the site, the Reader, the audit), then `serve --app` | the site served by the binary passes the UI audit exactly as it does from any static server: 0 on every page in both cultures | 2 to 3 |
| **S5: this site's own tools** | `site-facts.js` and `site-shell.js` become `zane site facts` and `zane site shell` (they call the core directly, instead of spawning a verifier) | the same checks fail on the same breakages (each shown by breaking one) | 2 |
| **S6: the cut** | the site, the READMEs and every page that says "Node" say "one file"; `zane.js` leaves the site and stays in `tools/` as the reference until Central rules it retired | 3 releases with zero parity differences, then Central's ruling | 1 |

**What `site-facts.js` and `site-shell.js` become.** They are not part of the standard; they are this site's build. The author's own words ask for no dependency on Node *or any other thing*, so they move too (S5), but last: they are the checks that
keep the site honest while everything else is rebuilt, and they are the cheapest place to find that the binary disagrees with the page.

---

## 5. How parity is proved, and how the ratchet grows to three

**Today there are two evaluators** of the law: the hand-written verifier (`zane.js`) and the court forged from the Haro declaration; they agree on 55 of 73 fixtures and the other 18 are named in `haro/twin-expected.csv`, held by a judge that fails on any other.
**The binary is a third**, and a different kind: it is a **port of the verifier**, not a second reading of the law, so its bar is stricter.

1. **The suite.** `zane conformance` runs the 73 fixtures and the contract's cross-checks: 73 of 73 and no skip, as `conformance.js` does.
2. **Byte parity, not verdict parity.** For every fixture, **the full JSON envelope** of `zane check --json` must equal that of the JavaScript CLI: same codes, same order, same spans, same messages, same cites. A port that agrees on codes and differs in a message has changed what a person reads.
   This bar has **no allowed differences** to begin with, so the third evaluator has **zero rows in its own ratchet**; any difference that cannot be removed is written down as a named row, as `twin-expected.csv` does, and the check fails on any other.
3. **A corpus beyond the fixtures.** The 73 are the standard's examples, not all the inputs. A deterministic generator (a fixed seed, committed) produces mutations of the fixtures (a clause dropped, a name duplicated, a verb swapped, a medium changed, an invalid byte inserted, truncation at every position of the smaller files), and **the two evaluators must agree on all of them**. The corpus is run, not stored: the seed and the count are the artefact.
4. **The wasm.** The proof page runs the same corpus and the 73 through the wasm in a real browser and compares to the native binary's output, which is embedded in the page when it is built. It needs only a browser.
5. **The Haro court joins the table.** The judge compares the forged court against the suite today. It gains a third column, **the binary's verdict**, so the 18 differences are shown against both implementations of the verifier. The ratchet then holds three evaluators and a difference in any pair is a row or a failure.
6. **Every release re-proves it.** `zane version` prints the hash of the binary and the hash of the pack it carries; the release file lists both.

**Perception.** Parity is **sameness, not rightness** (`CENTRAL-PERCEPTGATE-01`): a binary that agrees with the JavaScript on every input inherits its mistakes. The binary changes *who can run the law*, not *whether the law is right*, and nothing in this design claims otherwise.

---

## 6. The wasm build, and the browser-only route

- **Target**: `wasm32-freestanding`, built from the same `core/`. The export surface is two functions and a memory: `zane_check(source_ptr, source_len, options) -> report_ptr` returning the envelope as UTF-8 JSON, and `zane_free`. No imports.
- **The loader** is about thirty lines of JavaScript (fetch, instantiate, write the string into memory, call, read the string). **This is the only JavaScript on the verifier's path**, and it contains no logic of the law.
- **What runs in the browser with no server**: `check` (paste or open a file), the conformance suite *if the fixtures are embedded or fetched*, the pack's hash check on files a person selects (the Web Crypto API supplies sha256). **What does not**: `serve` (a browser cannot listen), the file-system walks, `--app`.
- **The UI audit stays JavaScript.** It measures what a browser paints; its input is a DOM, not a string.
- **`zane.js` stays only until parity**: it is the oracle for S1 to S3 and then, per Central's ruling, the reference, or retired (section 11).

---

## 7. Size, speed, platforms

**Budgets, to be measured at the first build and reported with their number and mode** (a missed budget owes a number and a plan, `CENTRAL-PXLATENCY-01`; a debug build is never a number: Zing's CLI README makes the same warning, and its present
`zing.exe` is 10.7 MB as built there, which says little about a release build and is not a figure for this one):

| artefact | budget | note |
|---|---|---|
| native binary, core and shell, no site embedded | **at most 1.5 MB**, `ReleaseSmall` | a verifier and a small server; the data embedded is about 250 KB (violations 26, media 9, signal 21, manifest 19, schema 7, plus the rules' file at 172 for `pack`) |
| native binary with the site embedded | **at most 4 MB** | the site tree is 626 KB, of which the photograph is 382 KB; the Reader 203 KB; the language docs 50 KB; before any compression |
| the wasm module | **at most 150 KB**, no data | tables only, no server |
| `zane check` on one fixture | **under 20 ms** wall, cold, on this machine | the JavaScript's cost, including Node's own start, is the figure to beat; measured as a distribution, not a single run |
| `zane conformance` | **under 1 s** | |

**Embedding the site is a choice** (section 11). Embedded: one file is the whole of it, which is what "sole binary that hosts everything" says. From disk: the binary is smaller and the site is editable. **Default proposed: both**; the binary embeds the site and `--site <dir>` overrides it.

**Targets**, cross-compiled by Zig from the one machine: `x86_64-windows`, `x86_64-linux-musl` and `aarch64-linux-musl` (static), `aarch64-macos` and `x86_64-macos`, and the wasm. **Verified here: Windows only.** A Linux run is possible in WSL if present; **macOS has no machine on this project**, so a macOS binary is *built and not run* until someone runs the suite on one,
and the release file says which targets were run and which were not. **Zig is 0.15.2 on this machine**; the version is pinned in `build.zig.zon` (`minimum_zig_version`) and in the release file.

**Server hygiene** (S4, written before the code): bind `127.0.0.1` only unless a flag says otherwise; GET and HEAD only; no directory listing; path traversal refused by canonicalising and checking the prefix; a content-type table of ten entries; the audit's route is the only route that writes
nothing and reads the application directory; **no network access of any kind outbound**. `--app` serves a directory the person named, read-only, and refuses a path that resolves outside it.

---

## 8. What is deliberately not in scope

- **No new law, no new diagnostic, no new fixture.** The binary implements the language as the pack states it (language 1.4, contract 1.8, law 3.13) and changes none of it. A disagreement found on the way is reported, not fixed here.
- **No renderer**, no projection to any channel; the data is checked, nothing is drawn.
- **No compiler of `.zane` into anything.** The language is checked, as today.
- **No Haro court inside the binary** (section 10).
- **No package manager, no update service, no telemetry, no network.**
- **No signing or notarisation.** An unsigned Windows binary may meet SmartScreen; a release says so and gives the hash. Signing is a decision with a cost for the author.
- **No rewrite of the UI audit**, which is a browser's measurement.
- **No claim that the wasm is faster, or the binary smaller than something else**, before it is measured.

---

## 9. Risks, and the tripwires they ride on

| risk | what keeps it small |
|---|---|
| **Zig's standard library changes between releases** (`std.http`, `std.io` moved a lot in the 0.1x line) | the server is one file behind a four-function interface; the core uses no `std.http` and almost no `std.io`; the version is pinned; a bump is its own commit with the suite |
| **A third copy of the tables drifts** | `zane conformance` checks them against the data, as it does for the JavaScript; any disagreement fails |
| **The Zig project's policy on generated content** (substrate memo, 2026-10-30) | this desk is a consumer: nothing is proposed upstream, as ruled; the estate's tripwires T1 to T7 apply unchanged, and the core is small enough (an estimated 1,500 to 2,500 lines) to be moved if one fires |
| **Two evaluators in Zig in the estate** (Zing's CLI already carries `cli/src/check.zig`, 449 lines, pinned at law 3.11) | **a question for Central**, section 11. This design does not touch, copy or depend on Zing's code; the pack is the interface |
| **"Sole binary" hides a build chain** | the build needs Zig, which is the *author's* tool, not the user's; the user needs nothing. The site says which is which |
| **A port that agrees with its oracle's bugs** | named in section 5; the binary adds no rightness, only reach |

---

## 10. The court

The NOTE lists "the court" among what the binary hosts. **I read it as the verifier**: the thing that refuses. The **Haro-forged court** is different: it is generated by a forge running on **Ring++'s `rnxc`** from `haro/zane.stzu`, and it cannot be hosted in a Zig
binary without a Haro runtime in Zig, which is a project of its own and not part of this one. **If Central means the forged court too, say so and this becomes a second design.** What the binary does for it: it joins the parity table (section 5, item 5), so the forged court is judged against the binary
as well as against the JavaScript.

---

## 11. What Central rules

Defaults are taken if Central is silent, marked *.

1. **The name**: `zane`.* (`stzzui` is longer and repeats the repository; Zing's binary is `zing`; Haro's tools have their own names.) The single word `zane` is also the language's name and its file extension's stem, which is a feature.
2. **Zing's `check.zig`.** An independent third evaluator is the point of a port, so this design shares nothing with Zing's checker.* If Central would rather the two converge on one Zig core, that is a different, larger decision, and it needs Zing's desk, not this one.
3. **The court** (section 10): the verifier, not the forged court.*
4. **Embed the site by default**, with `--site <dir>` to override.*
5. **Who is the reference** after S6: the JavaScript until three releases with no difference, then the binary, by Central's ruling; the pack, as `protocol/README.md` already says, is the standard in either case.*
6. **When the site says "one file"**: only at S6, never before; until then the pages that need Node say so once, where it matters.*
7. **macOS**: built and not run, said so in the release file, until someone with a Mac runs the suite.*
8. **A browser "try it" box** on the Build page at S3 (the wasm makes it possible; nothing leaves the page).*
9. **Order against the site rebuild**: SITE-3's piece A (the frame) does not depend on the binary and goes first; S1 can start in parallel on a separate worktree, since the two touch different files. The two never share a commit.*

**Next, once Central has ruled**: S1 only, as one reviewable stage, with the 73 fixtures and the byte-parity check as its gate; nothing before.
