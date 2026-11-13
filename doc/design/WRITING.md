# How the site is written

**What this is.** The rule for the register of every page of the Zayn site. The Principal asked for it more than once, on
2026-11-05 again, looking at the grid page: *"avoid the narrative, succinct, non declarative style of writing. Here for
example, you describe the grid without citing it, neither in the titles nor in the text. use a dead simple clear descriptive
full sentence of the kind: Zayn is designed around a conceptual grid with ... ensure systematic coverage."* It drifted back each
time because it lived only in a promise, so it is written here and part of it is checked (section 3). Ruled by Central's NOTE of
2026-11-05 18:06.

## 1. The rule

1. **The page title (h1) names the page's subject in the menu's own word and says what it is**, as one full declarative
   sentence. It is not a metaphor, a teaser or a fragment.
   - refused: *"A map of what a person does, across every channel, with the empty cells left empty."*
   - written: *"Zayn is designed around a conceptual grid of what a person does in every channel."*
2. **The first sentence of the lead defines the subject and says what it is for.** The figures come after it.
3. **A section title says what the section contains.** A reader who reads only the titles knows what the page holds.
   - refused: *"The rows of a person's day"*, *"The closed cells"*, *"The gap, as a finding"*
   - written: *"The six activities that form the grid's columns"*, *"Cells a channel cannot carry, and why"*, *"The 35 empty cells,
     listed as a finding"*
4. **Every sentence is a full sentence**: a subject, a verb and what it acts on, in the present tense. These are refused:
   narrative (*"we found"*, *"the story of"*, *"so it was measured"*), clipped fragments, aphorisms, closing one-liners, and a
   title that makes sense only after the page has been read.
5. **Every page states its value** in one sentence that begins with what the thing ensures, prevents or lets a person do.
6. **A claim is stated at its true size, affirmatively** (section 4). A page says what Zayn is and does; it never lists what the
   project lacks. This rule read *"Limits stay"* until 2026-11-08, and the Principal reversed it.
7. **A title's line breaks belong to the browser, which balances them; the page never places one by hand.** A title holds no
   `<br>` and no piece set as a block, and `node tools/site-shell.js` fails one that does (the front page's title once broke as
   *"Zayn is the / compilable language / for user interfaces."* for this reason).
8. **A hero zone is exempt.** The front page's hero (the photograph and its panel) holds a short tagline and one line that does
   not repeat it, in the Principal's words; the strict register begins below it, and the check judges the front page on its first
   content section. The hero's title still keeps rule 7. Asked by the Principal on 2026-11-05: *"don't apply the strict sentence
   style to the hero zones"*.
9. **The Zayn site does not name Zing.** `node tools/site-shell.js` fails on the word in any page, comment or JSON file, and in
   README.md, the repository's front page, with its file and line. Ruled by the Principal on 2026-11-06: *"do not reference Zing in the Zane site"*.
10. **A submenu never repeats its parent's label, and a section's landing page comes first in it under a name of its own.** The main
   menu names the SECTION (*Approach*) and leads to its head page; the band under it opens on that head page, the section's LANDING,
   under the page's own label (*Reasoning*), which its title, its first sentence and its path use; the kicker keeps the section's name.
   A family works the same way one level down: its head stands in the band under the family's name (*Comparison*) and opens the
   family's list under its own (*Overview*). A section and its landing page are two things, so each has one name (Rule 116 at v3.16).
   No entry of a band, a family's list or an outline carries its parent's label, no two entries at one level share one, and no label
   appears twice among the navigation a page shows (the main menu, the band, the family list and the outline), ignoring case and a
   leading "The". The menu is declared in Zayn in `site/menu.zayn`, and `node tools/site-shell.js` refuses it with the verifier's own
   `MENU_LABEL_REPEATS_PARENT`, `MENU_LANDING_NOT_FIRST` and `MENU_LABEL_DUPLICATE`. Ruled by the Principal on 2026-11-06: *"the same
   menu option in the main and submenu levels (like Try and then Try here)!!! This should never happen in our sites"*; and on 2026-11-08,
   reversing the reading that had left the landing page out of the band: *"you must bring bakc the frist option but find an other lable
   for it that is different from the main option(Approach in our case), be it "Intro" or any better experssive term!"*.
11. **No tooltips.** No element carries a `title` attribute and a page holds one `<title>`, its own; an SVG names itself with `<desc>`.
   What a tooltip would say goes into a short label that says it. `node tools/site-shell.js` fails on either, with the file and line.
   Asked by the author on 2026-11-06: *"avoid info bulles altogether because they complexify the reading by a volatile additional
   layer! just make small expressive titles"*.
12. **Who acts through an interface is the user, a person or an agent.** Where the site names who declares, is served or is protected, it
   says "the user" and makes clear once per page, at its first mention, that a user is a person or an agent; where a sentence is true only of
   a human (sight, contrast, reading, motion, fatigue, a person's rights), it keeps "person", and the site's own readers stay people. Asked
   by the author on 2026-11-06: *"Not only 'around a person' but around a user being person or agent, review this in all the site"*.

## 2. The subject term

Each page has one subject term: the word the menu uses for it, cut to the stem every form of it shares (*grid*, *channel*,
*compar*). The table of terms sits beside the menu in `tools/site-shell.js` (`term` on each page of `PAGES`), so the menu and the
check cannot disagree about what a page is called.

## 3. What the check decides, and what it cannot

**`node tools/site-shell.js` fails** when a page's h1, or the first sentence of its lead, does not contain the page's subject
term at the start of a word, ignoring case (so the term *use* is not found inside *because*); when a term is not made of
letters and spaces; and when a page has no term and is not on the list of pages still to be rewritten. The lead is the page
head's `p.sub` (the Reader's `span.sub`; on the front page, the hero's paragraph); its first sentence ends at the first full
stop followed by a space.

**The list of pages still to be rewritten** (`WRITING_PENDING` in the same file) held the pages written before this rule, and
each was printed by name on every run as a page the check had not yet judged. Since every page was rewritten on 2026-11-05 the
list is empty, and a page added later has no way past the check except a term.

**A page with a hero zone** (the front page) is judged on its first content section below the hero: its first title and the
first sentence of its first paragraph. **The Reader's header is judged as it stands**: it is the page's head, in the strict register,
and everything below it is rendered by script from `rules.json`, so skipping it would leave nothing to judge and exempt the page.

**The check cannot judge narrative, teasing, fragments or aphorisms.** A sentence can contain the word *grid* and still be a
riddle. Points 3 to 6 of section 1 are kept by reading the page, and the check does not replace that reading.

## 4. A page states what Zayn is and does

**The rule.** A public page states what Zayn **is** and what it **does**, in affirmative sentences. No page lists what the project
has not done, has not shown, has not measured, or what nobody has yet perceived: no *Limit:* paragraph, no *Not shown:* caption, no
*not yet*, no *nobody has*.

- **Affirmative is never inflated.** Nothing false is claimed. Where a sentence only said what is missing, it goes. Where it bounded
  a claim, the claim is restated at its true size: *"The verifier checks the declaration"*, never *"No instrument here checks the
  perception"*.
- **The record of what is unmeasured stays where it already lives**: `doc/`, `doc/design/BINARY.md`, the release notes' table
  of files, and `.central/`. It is not copied onto pages.
- **Platform status reads affirmatively**: *"Tested on Windows and Linux; built for macOS."*

**Evidence.** The Principal, 2026-11-08, on a screenshot of the tour's scene 7 of 8 (*"The project has not yet shown a study, a user
or a foreign application. ... Nobody has perceived any channel to check the grid."*): *"Avoid this role of transparency that hurts the
project image (negative markeing)! Generalise this issue on all Softanza project sistes because I raised this before but you seem to
persist on it"*. The ruling before it, 2026-10-13, on another Softanza site: *"do not let the tendency to be transparent and fair make
the statements elusive"*. Ordered by Central as ZANE-AFFIRM-01.

**What the check decides.** `zayn site shell` (and `node tools/site-shell.js`) fails a line of a page of the registry, of
`index.html` or of `README.md` that holds *not yet*, *nobody has*, *no one has*, *never been*, *has not been*, *no person has*,
*not run yet*, *not built*, *unverified*, *unproven*, *unproved*, *not proved*, *no study*, *no user*, *not shown*, *cannot yet*,
*not verified*, *nobody looked*, *not written*, or *never* followed within three words by *run*, or a sentence that opens on *Limit:*,
ignoring case for the phrases. It reads the page's text, its terminals (`pre class="term"`, what a run shows the reader) and its
description (`meta name="description"` and `og:description`, what a search or a link preview shows); it does not read scripts,
styles, comments or code samples (`code`, any other `pre`, and fenced or backticked code in Markdown). Its allow list, `AFFIRM_ALLOWED`, excuses one line at a time with a reason, and fails when an
entry no longer matches a line. The check cannot judge a lack stated in other words; reading does the rest, as for the register.
On 2026-11-08, before the sweep, it refused 65 lines in 23 files.
