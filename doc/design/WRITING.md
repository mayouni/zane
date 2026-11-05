# How the site is written

**What this is.** The rule for the register of every page of the Zane site. The Principal asked for it more than once, on
2026-11-05 again, looking at the grid page: *"avoid the narrative, succinct, non declarative style of writing. Here for
example, you describe the grid without citing it, neither in the titles nor in the text. use a dead simple clear descriptive
full sentence of the kind: Zane is designed around a conceptual grid with ... ensure systematic coverage."* It drifted back each
time because it lived only in a promise, so it is written here and part of it is checked (section 3). Ruled by Central's NOTE of
2026-11-05 18:06.

## 1. The rule

1. **The page title (h1) names the page's subject in the menu's own word and says what it is**, as one full declarative
   sentence. It is not a metaphor, a teaser or a fragment.
   - refused: *"A map of what a person does, across every channel, with the empty cells left empty."*
   - written: *"Zane is designed around a conceptual grid of what a person does in every channel."*
2. **The first sentence of the lead defines the subject and says what it is for.** The figures come after it.
3. **A section title says what the section contains.** A reader who reads only the titles knows what the page holds.
   - refused: *"The rows of a person's day"*, *"The closed cells"*, *"The gap, as a finding"*
   - written: *"The six activities that form the grid's columns"*, *"Cells a channel cannot carry, and why"*, *"The 35 empty cells,
     listed as a finding"*
4. **Every sentence is a full sentence**: a subject, a verb and what it acts on, in the present tense. These are refused:
   narrative (*"we found"*, *"the story of"*, *"so it was measured"*), clipped fragments, aphorisms, closing one-liners, and a
   title that makes sense only after the page has been read.
5. **Every page states its value** in one sentence that begins with what the thing ensures, prevents or lets a person do.
6. **Limits stay**, written in the same plain register: *"Limit: nobody has heard a channel to check a cell."*

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

**The check cannot judge narrative, teasing, fragments or aphorisms.** A sentence can contain the word *grid* and still be a
riddle. Points 3 to 6 of section 1 are kept by reading the page, and the check does not replace that reading.
