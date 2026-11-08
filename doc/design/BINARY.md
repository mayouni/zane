# One binary: StzZui without Node

**Status** (2026-11-07): **S1 to S6 are built, and version 0.1.0 is prepared** (Central's ZANE-RELEASE-01): `zig build release` writes the six published files and `SHA256SUMS` into `zig-out/release/` with no other program, `zane --version` prints `zane 0.1.0`, the pages offer the download, and a check of `site shell` fails on a page that links a release whose notes are not in `doc/releases/`. The files' sizes, hashes and gates are in `doc/releases/v0.1.0.md` and in no page: a page is inside the binary, so it cannot carry the binary's hash. S6, the cut: every page, the READMEs and the tour say `zane` and "one file" where they said Node, and a check of `zane site shell` (and of `site-shell.js`) fails on any page of the registry, or `README.md`, that tells the reader to run Node, with an allow list that gives each line its reason; `zane.js` has left the site and stays in `tools/` as the reference and as parity's oracle (section 4, "S6 as built"). S5, this site's own tools: `zane site facts`, `zane site shell` and `zane site grid` print byte for byte what `tools/site-facts.js`, `site-shell.js` and `site-grid.js` print and write what they write, calling the core and the binary's own commands where the scripts spawn node; `tools/zane/parity.js` section 7 proves it on 60 cases (81 command lines: the tree as it is, the `--write` modes, and one break per check, each failing in both with the check's own words), and `site facts` takes 0.16 s where node takes about 15 (section 4, "S5 as built"). S4, the server: `zane serve` serves the site, the Reader and the UI audit from the repository's folder (the site is **embedded in the binary** and served from it by default: since 2026-11-07 the 83 files its pages reach, where it was 216, the root's pages and eight folders whole, their text stored as gzip and sent as gzip to a client that accepts it; `--root DIR` serves a folder instead, as section 11 item 4 proposes), and `zane serve --app DIR` serves another site read only with the audit, embedded, at `/__zane/ui-audit.html`; `tools/zane/serve-test.js` holds 250 cases over the embedded site, the folder and --app (102 of them the addresses the pages reach, crawled from both servers; 46 of them Accept-Encoding, with gzip, x-gzip, q=0, br alone and none), and the site served by it passes the UI audit with 0 in both cultures, as from a static server. S3, the wasm: `zane.wasm` is 127,460 bytes at `ReleaseSmall` (law v3.15) with the contract embedded (budget 150 KB), has no imports, and `tools/zane/wasm-proof.html` finds all 292 envelopes (73 fixtures at four levels) identical to the native binary's in a browser; the Build page carries the "try it" box. The native `ReleaseSmall` binary measured by Central is 813,056 bytes (budget 1.5 MB). Run on Windows only. Written 2026-11-04 by the StzZui desk as a design for Central's read; the rest of this document is that design.
**The author's words** (typing kept): *"We should not depend on Node or any other thing! Provide our own sole binary that host everything alongwith a js alternative for whome wants the execution to happen solely in the browser (via a wasm prot of the main binary if you want)."*

**What this changes about the site's honesty**: until S6 the site said truthfully that the verifier needs Node. Since S6 (2026-11-07) it says "one file", `zane`, built from this repository with Zig, and it still says the file has not been released: no page offers a download that does not exist. Since 0.1.0 the pages offer the release's page and its files, and `site shell` holds them to a release whose notes exist.

---

## 1. What the binary is, in one paragraph

One static executable, written in Zig (the estate's standing substrate recommendation of 2026-10-30: stay on Zig, one static binary per language), that carries everything a person needs from this repository and
nothing that needs installing: the **verifier** (`check`), the **conformance suite** (`conformance`), the **pack check** (`pack`), the **cross-medium proof** (`cross-medium`), the **audit's facts check** (`audit-facts`),
and a **local server** (`serve`) that serves the site, the Reader and the UI audit, and can serve *your own application beside the audit* so that the audit's same-origin rule is no obstacle. **The same core
compiled to wasm** runs everything that needs no file system, in a browser, with no server and no install. `zane.js` stays only until the wasm is at parity.

```
 zane check payments.zane                  # the verifier, text or --json (the C2 envelope)
 zane conformance [--level N]             # the fixtures and the contract's cross-checks
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
| `tools/site-facts.js`, `tools/site-shell.js` | 310, 341 | **this site's own build checks** (they re-run the verifier on the page's declarations, render the shell); 337 and 668 lines when ported at S5, with `tools/site-grid.js` (104), which site-facts spawns | `fs`, `path`, `child_process` |
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

**S5 as built** (2026-11-07). `zane site facts [--write] [--unchecked]`, `zane site shell [--write]` and `zane site grid [--write]`, in `zig/src/sitefacts.zig`, `siteshell.zig` and `sitegrid.zig`, run from the repository's root and read the tree they are run in, as `zane pack` does. What each spawned process became:

- **the verifier runs** (a page's declaration and the terminal that checked it): the core, through `report.zig`, with the contract and the law read from the tree as `cli.js` reads them; the text report is `report.writeText`, now shared with `zane check`;
- **a terminal's `data-run`** (`node tools/zane/NAME.js ...`): the binary's own command of that name, in this process (`pack`, `conformance`, `cross-medium`, `audit-facts`, `check`), which parity proves prints what the script prints. Every `data-run` on the site today names one of these four;
- **`doc/design/coverage-count.js --json`** and **`tools/site-grid.js`**: `sitegrid.zig`, the counts site-facts reads and the two tables, with `zane site grid --write` beside the check. The text report of coverage-count.js (`--grid`, `--cells`) is not carried and stays a JavaScript tool.

**The patterns.** Both scripts read pages with some eighty JavaScript regular expressions. They are not translated into hand-made scanners: `zig/src/regex.zig` is a backtracking matcher for the part of JavaScript's RegExp they use (classes, greedy and lazy quantifiers, captures and `\1`, lookahead, one-character lookbehind, flags g, i, m; `\s` as JavaScript's set), so each check reads the page with the same pattern as its script, and anything else in a pattern is refused rather than read as something near it. Its own differences are named in its header (a character is a code point, the i flag folds ASCII only, a lookbehind holds one character); none is met by the tools.

**Four differences from the scripts, by design, each named where it lives:**

1. **The suite's data is the binary's.** `zane conformance`, `cross-medium` and `audit-facts` check the data they were built with (section 7), where the scripts read the tree, so a terminal of theirs is compared with the binary's run. Shown on 2026-11-07 by changing `contrast_floor` in `doc/design/audit/decides.json` to 9: both runs fail on the stale figure and the span, and only the JavaScript also reports the two `check-facts.js` terminals (`site/mobile.html`, `site/screenshots.html`); restored byte for byte. After a rebuild the two agree again. This is why section 7 of parity never breaks an embedded file.
2. **A terminal naming a script the binary does not carry** (`tools/zane/parity.js`, `serve-test.js`) is reported as one, where the script would run it with node. No page names one. **Gone at S6**: a terminal now names one of the five commands of the pack, and both sides accept those five only.
3. **The figure `kinds`** is the core's table of declaration kinds (10), where the script reads `zane.js`'s; its source line in `site/facts.json` is unchanged so the file stays byte for byte the same.
4. **The registry of pages is written twice**, in `site-shell.js` and in `siteshell.zig`, until the JavaScript is retired: a page added to one is added to the other in the same commit, and parity fails on any difference between the two runs. Two branches of the script no page reaches are not carried (stub pages, the footer's Reader link). The checks that only a registry edit can break (one name per head page, a label repeated at one level, a page on no bar, a footer link, a term that is not letters) are ported and not shown broken by parity, because breaking them means editing code, not a page.

A script that crashes (a `site/facts.json` that is not JSON, a missing data file) prints a stack trace; the binary prints one line and exits 2. Parity does not compare those.

**What it costs.** Speed, `ReleaseSmall`, this machine, one run each: `site facts` 160 ms (node about 15 s, most of it spawning node 26 times), `site shell` 114 ms (node 1.3 s), `site grid` 13 ms (node 1.7 s). Size: the three commands and the matcher add **161,792 bytes** of code, measured as the same tree built with and without the `site` route (section 7).
**S6 as built** (2026-11-07, Central's ANSWER of 10:49, piece 3). Central ruled the condition met: zero parity differences in its own clones at `c592a39`, `1283d60`, `60e57dc`, `d76ecc4` and `dab757f`. What changed:

- **The pages and the tour.** Every terminal that showed `$ node tools/zane/cli.js check NAME.zane` shows `$ zane check NAME.zane`; every `data-run` names `zane pack --check`, `zane conformance`, `zane cross-medium` or `zane audit-facts`; the prose that said the verifier needs Node says it is one file, `zane`, built from this repository with Zig and not yet released (Adopt, Build, Language, Try, the grid, Claims, Softanza, two tour scenes).
- **The READMEs.** The repository's README, the pack's, the suite's and the cross-medium proof's name `zane`; `tools/zane/README.md` leads with `zane` and names the JavaScript once, as the reference that `parity.js` holds the binary to, and its browser section shows the wasm loader, not `zane.js`. No pinned file of the pack was touched.
- **The checks.** `site-facts` reads a verifier terminal as `$ zane check NAME.zane` and a `data-run` as one of the five commands of the pack; the script runs each through its JavaScript reference, `zane site facts` through its own command, so the S5 difference "a script the binary does not carry" is gone. `site-shell` gained the Node check; its allow list holds one line, the wasm proof's, because `parity.js` runs on Node by design. `tools/zane/parity.js` section 7 gained five cases for it (a command, the runtime named in prose, a variable named node in a script that must pass, README.md, and an allow entry left after its line), now 65 cases and 87 command lines.
- **`zane.js`** is not retired: no page loads it, and it stays in `tools/` as the reference and as the oracle of `parity.js`. Retiring it is Central's ruling, not this stage's.

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
| native binary, core and shell, no site embedded | **at most 1.5 MB**, `ReleaseSmall` | a verifier and a small server; the data embedded is about 250 KB (violations 26, media 9, signal 21, manifest 19, schema 7, plus the rules' file at 172 for `pack`). **Measured 2026-11-06**: 864,256 bytes `ReleaseSmall` x86_64-windows, with `serve` and the UI audit (37.6 KB) embedded |
| native binary with the site embedded | **at most 4 MB** | the site tree is 626 KB, of which the photograph is 382 KB; the Reader 203 KB; the language docs 50 KB; before any compression. **Measured 2026-11-06**, `ReleaseSmall` x86_64-windows: **860,672 bytes before** embedding and **3,492,864 bytes after**, with 216 files; **3,802,624 bytes** at d76ecc4, measured by Central, once the night photograph and the photographs' smaller widths were embedded (cac3e98). **Room left: 197,376 bytes of the 4,000,000, under 5%**: one more photograph of the night one's weight fits, a second day width does not (the root's pages and the folders site, constitution, tools, doc, conformance, protocol, haro, examples), no compression. **At S5** (2026-11-07, this desk's build of the tree of the S5 commit): **3,831,296 bytes without the `site` commands and 3,993,088 with them; room left 6,912 bytes, 0.2% of the budget.** The site embeds `tools/` and `doc/` whole, so a tool's source and a design document are in the binary too, this paragraph included. An addition of S5's size no longer fits. **Then the site was cut to what its pages reach** (the author, 2026-11-07: "embed only what the pages reach"): `build.zig` crawls from `index.html` and the pages under `site/` (links, CSS `url()`, and the `.json` and `.wasm` paths the pages' scripts fetch, read against the page and then the root), 83 files and 2,243,407 bytes where the root and eight folders whole were 220 files and 3,323,599; **the binary is 2,994,688 bytes, room left 1,005,312**. `tools/zane/serve-test.js` crawls both servers more broadly and fails on an address the folder serves and the binary does not: shown by a build without the root reading, which lost `conformance/violations.json` and `site/facts.json` (fetched by `site/law-numbers.js` from a path it builds out of the page's `data-src`), and which serve-test failed on both, by name. **Then the text was compressed** (Central's ANSWER of 2026-11-07 10:49, piece 2): `zig/src/sitepack.zig`, a step of the build, stores every file but the photographs and the wasm as gzip when that is smaller (77 of 83), and `zane serve` sends the stored stream with `Content-Encoding: gzip` to a request that accepts it and inflates it otherwise. Zig 0.15.2 cannot deflate (the tokenizer of `std.compress.flate.Compress` is `@panic("TODO")`), so `zig/src/gzip.zig` writes the stream itself: LZ77 with hash chains and one step of lazy matching, then the fixed Huffman codes of RFC 1951. Std's own inflate reads every stream back at build time, and a byte that differs stops the build. Measured on the tree of `b22e1b5` (the law at v3.15): the text is 1,436,563 bytes stored in 541.4 KB, against 458.7 KB for .NET's best gzip (dynamic Huffman codes, which this encoder does not write); the embedded files 2,250,721 bytes stored in 1,355.5 KB (to the byte they cannot be written here: this paragraph is one of the files it counts, and its own figures move its compressed size by a byte); **the binary 2,999,296 bytes before and 2,404,864 after, room left 1,595,136 of the 4,000,000** |
| the wasm module | **at most 150 KB**, no data | tables only, no server. **Measured 2026-11-06**: `site/zane.wasm`, `ReleaseSmall`, **127,956 bytes**, sha256 `22a47733ec98fb274fe9ad4de73459117ad304ded7c9a43497749efe10409cfa`, with the contract (26 KB) embedded; no imports. **Measured again 2026-11-07**, after the law's v3.15 re-pinned the contract it embeds: **127,460 bytes**, sha256 `03ece67767243ab3037c44bf9731b801eb8c414d310d4a5078d1808a3c69859a` |
| `zane check` on one fixture | **under 20 ms** wall, cold, on this machine | the JavaScript's cost, including Node's own start, is the figure to beat; measured as a distribution, not a single run |
| `zane conformance` | **under 1 s** | |

**Embedding the site is a choice** (section 11). Embedded: one file is the whole of it, which is what "sole binary that hosts everything" says. From disk: the binary is smaller and the site is editable. **Default proposed: both**; the binary embeds the site and `--site <dir>` overrides it.

**Targets**, cross-compiled by Zig from the one machine: `x86_64-windows`, `x86_64-linux-musl` and `aarch64-linux-musl` (static), `aarch64-macos` and `x86_64-macos`, and the wasm. **Verified here: Windows only.** A Linux run is possible in WSL if present; **macOS has no machine on this project**, so a macOS binary is *built and not run* until someone runs the suite on one,
and the release file says which targets were run and which were not. **At 0.1.0** (`zig build release`): Windows runs every gate here, `x86_64-linux` runs under WSL (Ubuntu), and `aarch64-linux` and both macOS files are built and not run, as `doc/releases/v0.1.0.md` records. The release's wasm is byte for byte `site/zane.wasm`. **Zig is 0.15.2 on this machine**; the version is pinned in `build.zig.zon` (`minimum_zig_version`) and in the release file.

**Server hygiene** (S4, written before the code): bind `127.0.0.1` only unless a flag says otherwise; GET and HEAD only; no directory listing; path traversal refused by canonicalising and checking the prefix; a content-type table of ten entries; the audit's route is the only route that writes
nothing and reads the application directory; **no network access of any kind outbound**. `--app` serves a directory the person named, read-only, and refuses a path that resolves outside it.

---

## 8. What is deliberately not in scope

- **No new law, no new diagnostic, no new fixture.** The binary implements the language as the pack states it (language 1.5, contract 1.9, law 3.15 (3.14 at the rename to Zane); 1.4, 1.8 and 3.13 when S1 was built) and changes none of it. A disagreement found on the way is reported, not fixed here.
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
5. **Who is the reference** after S6: the JavaScript until three releases with no difference, then the binary, by Central's ruling; the pack, as `protocol/README.md` already says, is the standard in either case.* **Ruled 2026-11-07** (Central's ANSWER of 10:49): the three releases are met; `zane.js` leaves the site and stays in `tools/` as the reference and as parity's oracle.
6. **When the site says "one file"**: only at S6, never before; until then the pages that need Node say so once, where it matters.* **Done at S6, 2026-11-07**, and held by a check of `site-shell`.
7. **macOS**: built and not run, said so in the release file, until someone with a Mac runs the suite.*
8. **A browser "try it" box** on the Build page at S3 (the wasm makes it possible; nothing leaves the page).*
9. **Order against the site rebuild**: SITE-3's piece A (the frame) does not depend on the binary and goes first; S1 can start in parallel on a separate worktree, since the two touch different files. The two never share a commit.*

**Next, once Central has ruled**: S1 only, as one reviewable stage, with the 73 fixtures and the byte-parity check as its gate; nothing before.
