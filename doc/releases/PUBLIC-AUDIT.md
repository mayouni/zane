# The audit before mayouni/zane is made public

Central's ZANE-RELEASE-01, item 6. Making the repository public publishes its whole history, and that cannot be taken back.
This audit reads every commit and reports what it finds, with the commit and the path. **It rewrites nothing and deletes
nothing.** Each hit goes to Central, which takes it to the Principal before the repository is made public.

- **What was read:** every commit reachable from every ref of the desk's clone on 2026-11-07, at `c7b7324`: 307 commits,
  `refs/heads/main`, `origin/main` and seven `autopilot/*` tags.
- **How:** `git log -p --all`. Every line a commit adds, and every commit message, was scanned for each pattern below. A
  line that a later commit removed was added by an earlier one, so this covers the whole history and not only the tree.
  That is 97,551 lines.
- **The instrument:** `node tools/public-audit.js . OUT.json` repeats the scan. Every pattern hit was checked a second way,
  with `git log -G` (the pickaxe), which found the same commits.
- **The commit named for a hit** is the earliest commit that added it to that path.

## The result: no secret, and 10 hits for the Principal to rule on

| what was searched | found |
|---|---|
| GitHub tokens: `ghp_`, `github_pat_`, `gho_`, `ghu_`, `ghs_`, `ghr_` | **0** |
| API keys: `sk-` followed by 20 or more key characters; AWS `AKIA`; Google `AIza`; Slack `xox?-`; a `Bearer` header with a value; `token = "..."` | **0** |
| private keys (`BEGIN ... PRIVATE KEY`) | **0** |
| `password` | **2** lines, both prose (hits 1 and 2) |
| `secret` | **0** |
| a file named `.env` anywhere in history | **0** |
| an e-mail address other than the author's (`kalidianow@gmail.com`) | **1** address (hit 3) |
| a file over 5 MB anywhere in history | **0**. The largest blob is 1,898,779 bytes, `.central/shots/front-hero-1440.png` |
| commit identities | one only: Mansour Ayouni, `kalidianow@gmail.com` |

The patterns found nothing that is a secret. The 10 hits below are lines and files a stranger will read once the repository
is public. None of them is a secret. Whether each may be read is the Principal's decision, not this desk's.

## The hits

### Found by the patterns

1. **`password`** in `doc/EVIDENCE-LEDGER.md`, commit `7f86601`: a finding about a text editor whose input method leaked into
   a password field. It is prose about another product and holds no password.
2. **`password`** in `doc/GUI-SYSTEM.md`, commit `67a3814`: the same finding, in the survey of GUI systems.
3. **`noreply@anthropic.com`**, in the `Co-Authored-By: Claude ...` line that ends the message of 250 commits. The first is
   `e878b10` (2026-08-05). It is the AI assistant's attribution address, not a person's.

### Found by reading `.central/`, `doc/` and the root

4. **`.central/` is tracked, and the public will read all of it.**
   - `inbox.md`: Central's orders and answers to this desk, 291 KB, first added in `d97517b`.
   - `outbox.md`: this desk's memos, first added in `d97517b`, in 71 commits.
   - `cost.jsonl`: one line per session, with times and outcomes, first added in `05f2587`.
   - `status.html`: first added in `d7a6b25`.
   - `shots/`: five screenshots, first added in `3b5284e`. They show the site's own pages and nothing else, which was checked
     by looking at them.

   The text describes how the work is coordinated: the Principal, Central, the desks, decision IDs, the rule against editing a
   sibling repository, budgets and the sessions' costs.
5. **`CLAUDE.md` and `WHATS-NEXT.md` are tracked**, both first added in `a1a91d4`, in 19 and 18 commits. `CLAUDE.md` holds the
   working instructions given to the AI sessions, including how this machine's memory and page file are configured.
6. **Repositories that have no public remote are named.** `stz-principal`, the Principal's decision ledger, is named on 11
   lines in 4 files:
   - `.central/inbox.md`, from `ae20896`;
   - `CLAUDE.md`, from `99c1d48`;
   - `doc/ROLE-DESIGN.md` and `conformance/violations.json`, both from `1d57973`.

   The inbox also names `bangalo`, with "NO REMOTE AT ALL". `haro/twin-expected.csv` names a branch of `ringpp` as
   `private/next`, from `60fd816`.
7. **A local user path** in `.central/outbox.md`, commit `b656119`: a path under `C:/Users/` that gives the Windows user name of this
   machine, in a command line quoted in a memo. It appears once in history, and this report does not repeat it.
8. **Local drive paths** (`D:\GitHub\...`, `D:\tmp\...`, `D:\ringpp\...`) on 59 lines in 16 files at `c7b7324`, added across
   39 commits. They reveal how this machine lays out its folders, and no more. Each file, with the commit that first added one
   and the number of lines at `c7b7324`:

   | file | first added in | lines |
   |---|---|---:|
   | `CLAUDE.md` | `a1a91d4` | 19 |
   | `.central/outbox.md` | `303667c` | 11 |
   | `doc/prompts/sound-semantics.md` | `a513084` | 5 |
   | `.central/inbox.md` | `9cbb6af` | 4 |
   | `WHATS-NEXT.md` | `a1a91d4` | 3 |
   | `doc/prompts/culture-module.md` | `402bbf7` | 3 |
   | `doc/prompts/gui-plane.md` | `ccddedf` | 3 |
   | `doc/decisions/M3-the-zane-verifier.md` | `57ca8f0` | 2 |
   | `haro/judge-zane-court.js` | `57ca8f0` | 2 |
   | `doc/design/SITE-3.md` | `99f0887` | 1 |
   | `doc/prompts/locale-defects.md` | `61220a7` | 1 |
   | `doc/prompts/regex-defects.md` | `60d3152` | 1 |
   | `doc/prompts/stzcss-design.md` | `f4eb849` | 1 |
   | `examples/quick-win/zing-landing.zane` | `57ca8f0` | 1 |
   | `examples/web-case/stzsite-navigation.zane` | `57ca8f0` | 1 |
   | `haro/twin-expected.csv` | `60fd816` | 1 |
9. **`doc/prompts/` is tracked**, first added in `a513084`, in 12 commits: the prompts that started other sessions' work.
10. **The Principal's own words are quoted as typed, typing mistakes kept**, in `doc/design/BINARY.md` (line 4),
    `doc/AMENDMENT-DOCKET.md` and `.central/inbox.md`. That is the project's rule for a quotation, and once the repository is
    public, strangers will read the quotations as typed.

**One more file, which is not a hit:** `.claude/launch.json` was committed in `d7831af` and removed in `1de1351` (both
2026-08-07). Its only version starts `python -m http.server 8144` and holds no path or name.

## What the Principal decides before the repository is made public

For each of hits 4 to 10, there are three choices:

- publish the history as it is;
- remove the material from the history, which rewrites every later commit and every hash this estate has recorded;
- publish a new repository without that history.

This desk recommends nothing here. Hits 1 to 3 need no decision: they are prose and an attribution address.
