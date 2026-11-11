# Zane's design system, from first principles

**Status: a study, milestones 1 and 1b of ZANE-DESIGN-01, published on the Principal's word ("4 roles; publish", 2026-11-09).
No page, rule, check or stylesheet of the site changed with it; milestone 2 (the system as code) builds on it.** Ordered by Central on
2026-11-09 14:30, on two requests of the Principal that day: *"rethink the problem from first principles, learn from the fundamental
theories made in the HCI domain, old and current, and especially from the TONS of issues we get not only on this project but IN EVERY
PROJECT involving UI we made together!!!"*, and *"the site needs a deep rewriting to adopt a didactic visual illystrated style with
accurate samples of UIs and issue color and froms semantics"*. Ruled first on this desk: PRINCIPAL-ZANEFIRST-01. Milestone 1b added
the repositories themselves to the corpus and set Zin's, Refine's and Zing's design systems beside this one, on the Principal's
question *"did you included the d/github/zin , ../refine and other repos of real world projects (and also /zing) to the corupus???"*;
after reading milestone 1 the Principal asked that it show rather than describe and go deeper into first principles, which sections
2 and 6 and [the samples page](design-system-samples.html) answer.

**What this is.** Six things, in order:

1. **Six root laws** of perception, attention, action and language, from which every principle derives (section 2).
2. **The corpus**: every UI correction the Principal made in every project, 455 of them in 26 projects, each with its source,
   classified by the root cause that produced it (sections 3 and 4; [`corpus/CORPUS.md`](corpus/CORPUS.md), generated from
   [`corpus/corpus.json`](corpus/corpus.json)), with the theory under each cause, cited.
3. **The predecessors**: Zin's design system, Refine's PX design and Zing's PX discipline, set beside this one: what each decided,
   where they agree and differ, and what Zane takes (section 5).
4. **The design system**: seven archetypes, twenty-six components, 45 tokens, four shapes, what the generator may vary and what it may
   not, for sight, touch and hearing (section 6), each principle **shown live**, lawful beside offending, on
   [the samples page](design-system-samples.html).
5. **Twenty-two checks** that read every rule on the rendered page (section 7).
6. **The law amendments** the system implies, proposed under Article VII with the corpus as evidence, not applied (section 8), and
   the four decisions the Principal ruled (section 9).

Every figure below is printed by `node doc/design/corpus/render.js`, which reads `corpus.json`; none is typed from memory.

---

## 1. The failure this system ends

**A correction stored as a symptom does not stop the defect; it moves it.** On 2026-11-09 the Lookout desk built Softanza Radar
under the Principal's eye, and each fix answered the last remark and caused the next one:

| what the Principal said | what the fix did | what it caused |
|---|---|---|
| "you have space, why don't you use it?" (a 1240 px frame on a 1900 px screen) | widened the frame to 1760 px | cards stretched to 150-character lines |
| "making best use of the space does not mean creating divs as large as this" | set a reading width, centred in the frame | an empty band on the left |
| (the band) | added a steering column on the left | "this navigation system is not ours!" |
| (the steering column) | moved to Zane's outline on the right | the filters moved to the top left |
| "well done! but again you fail at understanding space" | sized the box to its content | (closed) |

The same day, a hover on the radar became a tooltip, a reading panel, a tooltip, a plain tooltip, an info bar and then a phone
behaviour; separators were added, thickened and removed everywhere; links became bold, then lost the bold. The Zane site shows the
same chains: the hero panel was too wide, then a tall narrow box, then a box that hid the museum's door (Z352, Z353, Z354); a
repeated menu label was "fixed" by deleting the landing page, which the Principal then had to restore (Z162, Z163); a line-balance
fix covered a list of element kinds, and the defect came back that afternoon on a kind not in the list (Z421, Z423).

**Four properties are missing from a correction that oscillates, and the system gives every rule all four:**

1. **The rule names the cause, not the symptom.** "No lines between points" is a symptom; *a line draws something real, and space
   separates groups* is the cause, and it settles the next case the generator has not seen.
2. **The rule is bounded on both sides.** "Use the space" has no upper bound, so the fix overshoots into stretched lines; "do not
   stretch" has no lower bound, so the next fix leaves half the screen empty. A measure between 60 and 75 characters fails both.
3. **The vocabulary is closed.** The generator chooses among six sizes, four spaces, four shapes and twenty-six components; it never
   invents a seventh size, a new navigation pattern or a sixth status colour.
4. **The check reads the painted page, by default, for every element**, at the widths the reader uses, in both cultures, never a
   list of element kinds.

## 2. Six root laws: the first principles every rule derives from

The thirteen principles of this system are not a list of the Principal's preferences. Each one follows from a fact about how a
person perceives, attends, acts and understands, measured long before any of these sites existed. The corpus is the proof that
the generator breaks them; the laws are the reason they hold. Each law is shown live, lawful beside offending, on
[the samples page](design-system-samples.html).

| law | what it states | measured by | what follows from it |
|---|---|---|---|
| **1 · Grouping comes before reading** | The eye groups what is near, alike, enclosed or connected before it reads a word, and it prefers the simplest, most regular figure. | Wertheimer 1923 (proximity, similarity, Prägnanz); Palmer 1992 (common region); Palmer and Rock 1994 (uniform connectedness) | space says what belongs together (S); a box or a line claims a group, so it must draw a real one (I); a figure reads as balanced or as broken (B) |
| **2 · Every visible difference is read as a meaning** | A difference in position, size, value, colour, shape, orientation or motion is taken as information, whether or not the maker meant one, and each of these variables can carry some kinds of meaning and not others. | Bertin 1967 (the visual variables and their properties); Cleveland and McGill 1984 (how accurately each is read); Ware 2004 | a difference that means nothing is noise (I, E); a meaning shown by no difference is hidden (L, F); one variable carries one meaning, and colour carries a category, never a rank (F, E); size can rank, but never below the floor of law 6 (T) |
| **3 · Attention and memory are scarce** | A person holds about four chunks at once; each added choice costs time; one item that differs is found at once, many that differ hide each other; what is learned by place and look is lost when place and look change. | Cowan 2001; Hick 1952; Sweller 1988; Treisman and Gelade 1980; Scarr and others 2011 | emphasis is a budget, one per element and one critical element per view (E); a bar holds five entries (N); points, not dense paragraphs (W); decided stays decided (X) |
| **4 · Acting is a loop that closes only through what is perceived** | A person forms an intention, finds a control by its signifier, acts through a mapping, then judges the result from what they can see, hear or feel; the loop breaks wherever the signifier, the mapping or the evidence is missing. | Norman 1986 (the seven stages, the gulfs of execution and evaluation); Norman 2013; Miller 1968 (response time); Fitts 1954 | one shape, one meaning (F); the menu is the tree, the user's model of the product (N); everything on the page, with feedback (L); every input closes the loop (H); only the painted or heard result counts, so the checks read the paint (P) |
| **5 · Language is cooperative** | A reader assumes the writer says as much as needed and no more, truthfully, relevantly and plainly; and the same fact framed as a lack or as a gain is judged differently. | Grice 1975 (the maxims of quantity, quality, relation and manner); Tversky and Kahneman 1981 (framing); Morkes and Nielsen 1997 | words for the reader, declarative and shown by samples (W); the page speaks for its reader, affirmatively and at its true size (M) |
| **6 · The senses have floors** | Below a size and a contrast reading slows sharply; below a size a finger misses; outside a time window a sound and its picture split into two events. | Legge and Bigelow 2011; Rello and others 2016; WCAG 2.2; Parhi and others 2006; ITU-R BT.1359 | type set for reading, 21 px and 7:1 (T); targets of 44 px on a phone (H); sound in step with its text (P) |

**How the laws produce the system.** A principle is kept only if it follows from at least one law and the corpus shows the generator
breaking it; a law with no correction under it adds no principle. Every principle of section 6 names its law, and every check of
section 7 measures what a law says the person perceives.

## 3. The corpus

**455 distinct corrections, made in 26 projects between February and November 2026.** 213 quote the Principal's own words; 242 are a
session's or a commit's paraphrase, marked as such. 217 more records were the same remark found again in another file or another
repository and are listed under the record they repeat. **164 of the 455 name an earlier correction of the same defect**, and 18
carry the Principal's own words of repetition or fatigue: *"I told you a thousand times"* (Z255), *"as usual: text is very small and
unreadable!!!"* (Z252), *"the issue of equilibrated text on a line again and again!"* (Z420), *"I'm tired of talking to you of visual
equlibrium!"* (Z353), *"don't go back to the card UI system in small screens ... This is the power of dogmatic influence you got from
your training data."* (Z378), *"how many times I told you to avoid this ugly word taking its own line!!!"* (Z423). The pace rose
month by month, 82 in August, 126 in October and 116 in the first nine days of November, 42 of them on 2026-11-09 alone: the last,
*"bad line cuts AGAIN and AGAIN and AGAIN!!!!!!!!!!"* (Z424), came at 15:31 that day.

**Sources.** Six read-only sweeps on 2026-11-09, merged and classified by hand, beside Central's compiled corpus (softanza 614d795).
The first four read where corrections were relayed: softanza's memos, conclusions, mailboxes and perception law; the stzlib desk's
memory (232 files); every other project's memory and Lookout's rulings of the day; this repository's docket, harvest, law, inbox,
outbox and history. A fifth source, Central's notes, gave three records: Radar's title cut across its sentences, the menu's Use and Try, too alike to tell apart, and the Reader's menu bar, drawn at the left edge while every other page centres it (both 2026-11-10); the Principal's word in this desk's chat gave four more, tables drawn like running text, tables and code held to the text's edges, a wide block breaking the left edge, and a page head moved off the menu's container (2026-11-11), and Central's relay of the same day a third, four cards laid out as a grid with no grid drawn. The sixth, sweep F, read **the repositories
themselves**, on the Principal's question of 2026-11-09 (*"did you included the d/github/zin , ../refine and other repos of real world
projects (and also /zing) to the corupus???"*): their design documents, stylesheets, tokens and the commit messages that answer a
remark. Every record cites its file and line or its commit; the method and every record are in [`corpus/CORPUS.md`](corpus/CORPUS.md).

**What the repositories added (sweep F).** 262 rows were read; 136 are new corrections, 100 add a source to a correction already
counted, and 26 are kept apart as candidates because their source does not name or quote the Principal (Refine's twelve recorded
recurrences, thirteen commits of the banking demo in Zin that name no speaker, one Zing commit; CORPUS.md lists them).

| repositories read | new corrections | a source added to one already counted | candidates, not counted |
|---|---|---|---|
| Zin (its design system, its projects, its history) | 8 | 5 | 0 |
| Refine (its PX design and its site; Refine has no git history) | 9 | 2 | 12 |
| Zing and Zing Studio (the IDE's PX discipline, the StzWeb site's history) | 18 | 20 | 1 |
| the products: organizium and its variants, a restaurant app, orgdesk, zindara, zin-one, zin-website, zin-prototypes, ringface | 35 | 19 | 13 |
| the estate's sites: stzsite, harobanda, ayouni, lookout, ringserv, ringflex, microring, stz-observer and others | 66 | 54 | 0 |

**No root cause changed and no new one appeared**: the thirteen causes hold all 136 new corrections. What changed is the weight. The
repositories' histories record what memory notes rarely kept: a default standing in for a decision (X, 12 to 29: a browser's
`confirm()`, a print page the browser generated, a dark theme nobody asked for, a pattern invented instead of the house's), ink that
draws nothing (I, 19 to 36: the same 60-word paragraph opening 3,126 reference pages, a method under sixteen names), and what is hidden
(L, 22 to 39). **One archetype changed**: the repositories hold applications, not only sites, and the system gains the application
archetype (section 6.5) from Refine's and Zing's shells.

**Classified by root cause, not by symptom.** A root cause is the default that produced the defect: the thing the generator does
when nothing stops it. Thirteen causes cover all 455, in five groups:

| group | root cause | corrections | projects | name an earlier one |
|---|---|---|---|---|
| **Perception**: the eye groups by space, size and contrast before it reads (141) | **T** Type sized by convention, not for reading | 28 | 12 | 20 |
| | **S** Width taken from the container; space treated as filler | 27 | 9 | 15 |
| | **I** Ink and boxes that draw nothing | 37 | 15 | 11 |
| | **E** Emphasis added, never budgeted | 29 | 12 | 9 |
| | **B** Balance left to chance | 20 | 10 | 11 |
| **Meaning**: a form and a place each mean one thing (83) | **F** One form carrying two meanings | 37 | 11 | 14 |
| | **N** Navigation that does not mirror the tree | 46 | 12 | 13 |
| **Presence**: what matters is on the page, for every input (41) | **L** What matters is hidden, volatile or scrolled inside the page | 39 | 15 | 10 |
| | **H** A pointer is assumed | 2 | 2 | 1 |
| **Voice**: the words serve the reader (110) | **W** Words written for the writer, not the reader | 70 | 18 | 25 |
| | **M** The page speaks for its maker, not its reader | 40 | 16 | 13 |
| **Fidelity**: the painted result and the decisions already made are what count (80) | **P** The model is checked, not the paint | 51 | 11 | 15 |
| | **X** A decision already made is replaced by a default | 29 | 13 | 7 |

**What the counts say.** Type repeats the most: 20 of its 28 corrections name an earlier one, because a reading size is undone every
time a template or a new project starts from the web's defaults; balance follows at 11 of 20. Words for the writer is the largest
class and spans eighteen projects. Ink, space and emphasis together (89) are one family the Lookout desk named in a sentence: *"the
generator reads free space as a defect to fill and a border as a neutral way to make sections."* Touch has two records because touch
was rarely tested, not because touch is right: Z455 found a hover design ruled four times that day on a desktop only.

**Rulings that point opposite ways, and how the system reconciles them** (a system that picks one side re-opens the other):

| the two rulings | the cause both serve | the system's answer |
|---|---|---|
| "tables, not cards" (Z375, Z378) against "listes de données ... jamais `<table>`" on a phone (a restaurant app, 2026-07) | no sideways scroll, no card grid | a table keeps its columns and never scrolls; under width pressure its lowest-priority columns go first and the action column last (Rule 129) |
| tooltips forbidden (Z307), a tooltip under each button (an NGO platform, 2026-10-14), tooltip-panel-tooltip-bar (Lookout) | say what a control does before it is used | no tooltip; a short label says it, and where more is needed a status line in the page's flow says it, reachable by tap and focus |
| a smaller footer (harobanda, 2026-09-28) against 18 px or more everywhere (Lookout, 2026-11-09) | the footer is secondary, never unreadable | the footer is set at the small size, which is the floor (18 px), in plain weight and secondary ink |
| "do not overestimate the realworld use" (Z215) against "never undersell" (Z223, Z240) | a claim at its true size | affirmative sentences, nothing inflated (PRINCIPAL-AFFIRM-01) |
| all modules greyed in the menu, then a menu adapted to the role (an NGO platform, 10-17 and 11-02) | the menu tells the truth about what this user can reach | the menu shows what the role can use (the later ruling) |
| links coloured with an underline on hover (Zane, 2026-11-06) against the browser's plain underline (Lookout, 2026-11-09) | a link is found without effort, with one emphasis | **decided** (section 9, (b)): a link in running text carries the plain underline at rest; a cue that appears only on hover does not exist on a phone |
| a second level drawn vertically (Zin, 2026-04, Z123) against a horizontal band fixed under the bar (stzsite 2026-10-16, Zane 2026-11-04) | the two levels must never read as one | the later rulings hold for a site: a horizontal band; Zin's reason is kept, the band differs from the bar in place, size and weight |
| "never two scrolls at once" (Z309, Z310) against a workstation whose panes scroll (Z357; Refine's and Zing's shells) | the reader never meets a scroll inside a scroll | on a page, only the document scrolls; in an application, each pane scrolls by itself and no scrolling region sits inside another (section 6.5) |
| a control beside its content (Z364) against every action at the right edge of the IDE's one sub-level bar (Zing, 2026-06, Z272) | a control is found where the act applies | an item's action sits beside the item; a view's actions sit in the view's own bar, which is never wider than the view |
| "Honest boundaries" at the end of every document (Zing Studio, 2026-06, Z207) against "this role of transparency that hurts the project image" (Z240) | a claim at its true size | the later ruling holds on every public page (PRINCIPAL-AFFIRM-01); the bounds live in the repository's own documents |

## 4. Thirteen root causes, the theory under each, and what closes it

Each cause below has the default that produces it, its evidence, the theory it rests on, the principle that replaces it (stated
with both bounds), and the check that reads it on the painted page. The checks are numbered K01 to K22 in section 7.

### T · Type sized by convention, not for reading (28)

**From law 6, the senses have floors; and 2, a size can rank but never below the floor.**
**The default.** The generator takes its sizes from web defaults (16-17 px body, 12-14 px secondary text) and ranks text by making
it smaller and greyer. **Evidence**: *"Again and again: text is small"* (stzsite), *"the secondary text must be bigger!"* (Z266),
*"the black text on those color background is not readable!!!"* (Z270), *"The main text is small"* (Z271, at 19 px), and the
inverse: *"the text of the main titles are excessively big"* (Z264).
**Theory.** Reading speed is flat across a range of sizes above a critical print size and falls fast below it (Legge and Bigelow
2011); readers on screens read faster and understand more at 18 px and above (Rello, Pielot and Marcos 2016); Tinker (1963) measured
the same for print. Contrast is a legibility condition, not a style: WCAG 2.2 sets 4.5:1 as the floor and 7:1 as the enhanced level
for text (1.4.3, 1.4.6). Rank is carried pre-attentively by weight, colour and position as well as size (Treisman and Gelade 1980),
so nothing requires shrinking to rank.
**The principle.** *Every text is set for reading.* Six sizes and no others; nothing below the small size (18 px); every text at
7:1 against what is painted under it; rank by weight, position and the next size up, never by shrinking or greying. A title is at
most 1.7 times the reading size, so a heading never shouts. **Reading text never shrinks to fit a layout**: when room runs out,
spacing and display text give way first, and the reading size holds (Z424).
**Checks**: K01 TYPE_SCALE (at every width, so a size that scales with the window fails), K02 TEXT_CONTRAST.

### S · Width taken from the container; space treated as filler (27)

**From law 1, grouping comes before reading; and 4, through Fitts's law.**
**The default.** Free width is a defect to fill, so a box takes its container's width and its content spreads or its control drifts
to the far edge. **Evidence**: the Lookout chain of section 1; *"the space to the right is not necessary! Space is a functional
communication tool that we must use with care"* (Z352); *"well done! but again you fail at understanding space and what it can
visually mean ... when the screen is large just let the zone be with less width!! you are not obliged to stretch it."* (Z364,
ZANE-SPACEMEANING-01); *"add enough space to avoid visual collision between the title and the text"* (Z363).
**Theory.** Nearness groups and distance separates before anything is read (Wertheimer 1923, proximity); an enclosed region groups
even more strongly than nearness (Palmer 1992, common region), which is why a box stretched past its content claims empty space as
part of the group. Reading is comfortable between about 45 and 75 characters a line (Bringhurst 1992; WCAG 1.4.8 sets 80 as a
ceiling; Dyson 2004 for screens). The time to reach a control grows with its distance (Fitts 1954), so a button pushed to the far
edge of a 1900 px box costs every use.
**The principle (ZANE-SPACEMEANING-01, confirmed and sharpened).** *Width belongs to the content.* A text block takes the reading
measure, 60 to 75 characters; a box takes its content's width plus its padding; width beyond that stays the page's background,
on the side away from where reading starts. A control sits beside the content it acts on. The space between two groups is at least
twice the largest space inside either, so space alone says what belongs together. Reading text starts at the frame's start edge,
never centred inside a wider frame. **A width is never a fixed number chosen to look right at one size**: a title takes its
column's width, and a text block its measure; **every block on a page starts at one left edge, and a table or a code block is not held to the
text's right edge**: it takes the room its content needs to its right, into the page's margin, up to the window less the gutter, and wraps
only past that; the outline stands on the left so the right is free (Z366, ZANE-LEFTEDGE-01: *"so things are alligned at the left while
differring to the right"*; and Z365, and its own words: "they
should not be restricted to the test left and right limits"); (Z424, a title held to 20 characters).
**Checks**: K03 MEASURE, K04 BOX_FILL, K05 CONTROL_NEAR, K06 GROUP_RATIO, K24 WIDE_ROOM.

### I · Ink and boxes that draw nothing (37)

**From law 2, every visible difference is read as a meaning; and 1, an enclosure claims a group.**
**The default.** Sections are made with borders, cards, tiles, bands and widgets, and one fact is drawn twice. **Evidence**:
*"use a classical table format not cards, it's more direct and less stressing to me"* (Z375); *"a visual colored progress bar is just
a duplication"* (Z376); *"contain many squares, each attracting attention"* (Z401); *"PLEASE AVOID THIS VERTICAL WIDGET STYLE!!!"*
(Z400); *"what the hell of using horizontal lines everywhere????? why would we need them???"* (Z403); *"on trouve 3 fois le bouton
Vérifier et envoyer !!!"* (Z396).
**Theory.** Ink that carries no data is a cost the reader pays on every look (Tufte 1983, data-ink); two lines drawn to separate
create a third element, the band between them, which competes with the content (Tufte 1990, "1 + 1 = 3 or more"). Information said
twice in two forms raises the reader's load instead of lowering it (Chandler and Sweller 1991, the redundancy effect; Sweller 1988).
**The principle.** *A line or a box draws something real*: a table's structure, a field's edge, a drawing, a focus ring, the frame
of a UI sample, a code block, and **the grid of peer regions**: cards laid out side by side or stacked show their grid in one thin
line around and between their cells, shared by neighbours, so the reader sees the layout before reading it (Z404, ZANE-CARDGRID-01:
*"make the 4 zone in a grid (gray stroke) so the reader can eaisly recognize their layout"*). Running text is never boxed, carded or ruled; groups are made by space. One fact has one encoding.
**Checks**: K07 LINE_DRAWS, K06 GROUP_RATIO, K25 GRID_SHOWN.

### E · Emphasis added, never budgeted (29)

**From law 3, attention is scarce; and 2, colour carries a category.**
**The default.** Each element gets its own emphasis (bold and underline and colour and a fill), colour marks identity or
decoration, and motion polishes. **Evidence**: *"having two red divs one under the other means we are not focusing on one critical
thing"* (Z323); *"hyperlinks are polluting the page with their intrusives underlines+bold"* (Z335); *"remove bold (underline + bold is
over focus)"* (Z339); *"dont polluate the UI with stronger strokes"* (Z338); *"there is a lot of blue and it's not beautiful"* (Z332);
smooth scrolling judged « troublant » (an NGO platform).
**Theory.** One item differing in one feature is found at once; when many items differ, none is (Treisman and Gelade 1980; the
isolation effect, von Restorff 1933). Emphasis is a budget, spent best at the smallest effective difference (Tufte 1997). Colour is
read as a code, so a colour used for decoration teaches a code that does not exist (Ware 2004). Motion in view is the strongest
distractor there is (Bartram, Ware and Calvert 2003).
**The principle.** *One emphasis per element, one critical element per view.* An element takes the emphasis its shape gives it and
no other. Data colour has the five semantic values of Rule 118 and one neutral, and nothing else. Motion only reports a change of
state the user caused, and never accompanies navigation.
**Checks**: K08 ONE_EMPHASIS, K09 PALETTE, K10 ONE_CRITICAL.

### B · Balance left to chance (20)

**From law 1, the eye prefers the simplest, most regular figure.**
**The default.** Line breaks fall where the width happens to end, or are placed by hand and outlive their text; rows of controls
wrap with one item alone. **Evidence**: Z420, Z421, Z423 above; *"the page still have space move the last combo on the same line as
the others"* (Z422); *"'spatial equilibrium' ... they represent the same logical level"* (Z410). Radar's title *"AI changes every week. Softanza hears what concerns it the same week."* broke as *"AI changes every / week. Softanza / hears what concerns / it the same week."* for three reasons at once: the title was held to 20 characters while its column had room, balancing ran across both sentences, and the paragraph under it had shrunk with the window to fit the hero (Z424).
**Theory.** The eye reads a figure as a whole and prefers the simplest, most regular one (the Gestalt law of Prägnanz; Arnheim
1954 on visual balance); a short last line is the typographer's widow, refused for that reason (Bringhurst 1992). Browsers balance
lines natively (CSS Text Level 4, `text-wrap: balance` and `pretty`), so the rule costs nothing when it is on by default.
**The principle.** *Balance is on for every text block, by default*, never for a list of element kinds: the last line of any block
is at least a third of its widest line, and a heading carries no break placed by hand. **A line never holds the end of one
sentence and the start of the next in a title**: each sentence of a title is balanced on its own. A row of controls that wraps
comes out in rows of equal size.
**Checks**: K11 BALANCE, K12 ROW_FULL.

### F · One form carrying two meanings (37)

**From law 2, one variable carries one meaning; and 4, the signifier and the mapping.**
**The default.** A form is chosen for its look: a card is a link, a fill marks both the selected entry and a button, a toggle names
the state it is not in, a word like "Remove" means "leave out". **Evidence**: *"this button is confusing ... make the two states
visible"* (Z188); *"On this page seems like a clickable option in the menu"* (Z198); *"change the theme of the internal buttons to
avoid visual collision with the top menu buttons"* (Z200); *"Remove here is misleading and can be understood as removing the
file!"* (Z201); *"leave only one thing and one place and one link to click!!"* (Z203); *"there absolutely no meaning to a button
that brings the reader to the section that it is right under it !!!"* (Z196).
**Theory.** A signifier tells the user what can be done and where (Norman 2013); a form that signifies two acts breaks the mapping
between what is seen and what happens (Norman and Draper 1986, the gulf of execution). Consistency is the first of Shneiderman's
eight rules (1987) and the fourth of Nielsen's heuristics (1994), and WCAG asks that one function be identified one way (3.2.4).
Consistency with what users already know matters as much as consistency inside the product (Grudin 1989).
**The principle.** *One shape, one meaning.* Four shapes and four meanings (section 6.3): an **action** is a button whose label is a
verb; **navigation** is a word or a menu entry; a **state** is a tag that never reacts; an **input** is a field with a visible edge.
A container never reacts to the pointer. A two-state control shows both states.
**Checks**: K16 SHAPE, K08 ONE_EMPHASIS.

### N · Navigation that does not mirror the tree (46)

**From law 4, the menu is the user's model of the product; and 3, each choice costs time.**
**The default.** Menus grow by addition, levels collapse into one row or stack into three, a child repeats its parent's label, a
page lives only in the footer, and a trail repeats bars already in view. **Evidence**: *"This kind of deep menu options is not good
for readability and for the reader to make a knowledgeable mental model"* (Z144); *"Why did you remove the second horizontal menu
bar? Like that we lose a level"* (Z146); *"the same menu option in the main and submenu levels (like Try and then Try here)!!!"*
(Z162); *"You misutertood me ... I need you to deal with menu strcture as a logical apsect"* (Z163); *"remove this path from all pages
it's not necessary since we have just two levels"* (Z164); *"add 'On this page' here and all the pages where there are many
sections"* (Z165).
**Theory.** A reader forages by the scent of labels, and a label that repeats its parent carries no scent (Pirolli and Card 1999).
Choice time grows with the number of options (Hick 1952), and broad, shallow menus beat deep ones up to a point (Kiger 1984). The
user builds a conceptual model from what the interface shows (Norman 2013); a menu that misstates the tree builds a wrong one.
WCAG asks for navigation that repeats in the same order (3.2.3) and for the user's location to be shown (2.4.8).
**The principle.** *The menu is the tree.* Rule 116 at v3.16 and the four levels of Rule 120 hold: at most five entries a bar; a
section's landing page first in its band under a label of its own; no label twice in what a page shows; every page on exactly one
bar; a trail only where a level is not already shown; an outline on the left, by default, on every page of three or more sections (Z366: on the left, so every block shares one left edge).
**Checks**: K18 NAV_TREE (the existing menu, trail and path checks, plus the outline default).

### L · What matters is hidden, volatile or scrolled inside the page (39)

**From law 4, the loop closes only through what is perceived; and 3, recognition beats recall.**
**The default.** Information goes into a layer that appears on hover, a panel that scrolls inside the scrolling page, a box that
scrolls sideways, a widget that floats over the text, or a click that changes nothing visible. **Evidence**: *"it adds a second
vertical scroll bar which is forbidden"* (Z305); *"never use a horizontal scroll bar on an image or code snippet!"* (Z306); *"avoid
info bulles altogethor because they complexify the redaing by a volatile additional layer!"* (Z307); *"a proper well made table without
a scroll (to avoid having two scrolls along with the scroll of the browser)"* (Z310); *"When i click 'Run the kernel' i get nothing"*
(Z303).
**Theory.** The state of the system must be visible (Norman 1988; Nielsen 1994, heuristic 1), and recognition beats recall
(heuristic 6). A pointer path into a tooltip or a hover menu is a steering task whose cost rises with its length and narrowness
(Accot and Zhai 1997). WCAG requires content shown on hover to be dismissible, hoverable and persistent (1.4.13) and content to
reflow without scrolling in two dimensions (1.4.10). One scroll gesture with two possible targets is an ambiguous mapping (Norman
2013). An answer under 0.1 s reads as caused by the act, under 1 s keeps the flow (Miller 1968).
**The principle.** *Everything is on the page, in one flow, with one scroll.* No tooltip; no content shown only on hover; nothing
scrolls inside the page; nothing floats over the reading; every act shows its result in the page within 100 ms; an empty list says
what is missing and where to create it.
**Checks**: K13 ONE_SCROLL, K14 NO_FLOAT, K15 NO_HOVER_ONLY.

### H · A pointer is assumed (2)

**From law 6, the hand has a floor; and 4, the loop must close for every input.**
**The default.** The design is made and judged with a mouse on a desktop. **Evidence**: *"did you think how this hover feature would
work on a mobile phone?!"* (Z455, after four rulings of the same feature on a desktop); a restaurant app's touch targets, overflow
and back button, found on a real phone (2026-07-03).
**Theory.** A thumb's target needs about 9 mm (Parhi, Karlson and Bederson 2006); WCAG sets 24 by 24 CSS pixels as the minimum
(2.5.8) and 44 by 44 as the enhanced level (2.5.5), which is also the platforms' own figure. Most phone use is one-handed (Hoober
2013). A touch screen has no hover at all (Media Queries 4: `hover: none`). Inclusive design treats a situational limit, one hand
on a bus, as a design input (Microsoft 2016).
**The principle.** *Every input reaches everything.* Every hover has a tap path (the first tap selects and shows, the second opens);
targets are 48 px at phone widths and 24 px elsewhere; the keyboard reaches everything in reading order with a visible focus; the
words say "tap" where a tap is meant.
**Checks**: K17 TARGET, K15 NO_HOVER_ONLY.

### W · Words written for the writer, not the reader (70)

**From law 5, language is cooperative; and 3, memory is scarce.**
**The default.** Narrative, metaphor and jargon, dense paragraphs, and concepts explained in prose without being shown.
**Evidence**: *"i todl you befeore several time to avoid the narrative, sucinet, non declarative style of writing"* (Z061);
*"not anyone has the ability to get the link between a metaphoric concept and the practical thing of a technology"* (Z026); *"Avoid
dense writings like this ... people today don't have time to read. this is also better for agents to grasp."* (Z068); *"examples
must be everywhere in the site"* (Z033); *"I saw the result page but i need a didactic explanation"* (Z066); « on n'est pas au
Silicon Valley, on est à Niamey » (Z031).
**Theory.** A cooperative speaker says as much as needed and no more, plainly and in order (Grice 1975). Readers of screens scan:
text made concise, scannable and objective measured 124% more usable than the same content as prose (Morkes and Nielsen 1997).
Working memory holds about four chunks (Cowan 2001), and a definition the reader must infer costs load the content did not need
(Sweller 1988). Plain language is now a standard (ISO 24495-1:2023). Learning is fastest from doing and from worked examples
(Carroll 1990).
**The principle.** *Words serve the reader, and a concept is shown, not described.* The register of WRITING.md holds (declarative
full sentences, the subject named first); a lead line and labelled points replace a dense paragraph; every UI concept is shown as a
live sample (section 6.4, the sample frame); a term is defined at its first use.
**Checks**: K19 REGISTER, K20 SAMPLE.

### M · The page speaks for its maker, not its reader (40)

**From law 5, quality and framing.**
**The default.** The page reports the project's process and history: what has not been done, the retired lineage, internal names,
implementation details, a call to action placed for the maker's agenda. **Evidence**: *"Avoid this role of transparency that hurts the
project image (negative markeing)! ... I raised this before but you seem to persist on it"* (Z240); *"do not let the tendency to be
transparent and fair make the statements elusive"* (Z223); *"No Haro has nothing to do with Ring and must no mention it!"* (Z244);
*"I find this call to action to be mis-placed! because it interrupts the logical flow fo reading"* (Z237); *"why are you proposing
Softanza related subjects to others who would adopt the solution?!"* (Z242).
**Theory.** The same fact framed as a lack or as a gain is judged differently (Tversky and Kahneman 1981), so a page that lists
absences is read as weaker than one that states the same scope affirmatively. A first impression forms in 50 ms (Lindgaard et al.
2006). The system should speak the users' language, not its own (Nielsen 1994, heuristic 2).
**The principle.** *The page speaks for its reader.* Every public page states what the project is and does, affirmatively and at its
true size (PRINCIPAL-AFFIRM-01); the front page and each landing follow the README's order (one sentence on what it is, why it
exists, what it is in a table, what is here); an action follows the understanding it needs; internal names and lineage stay in the
repository.
**Checks**: K19 REGISTER (the affirmative and naming checks already in site-shell), K21 ARCHETYPE.

### P · The model is checked, not the paint (51)

**From law 4, the gulf of evaluation; and 6, the window in which sound and picture are one event.**
**The default.** A green test on the producer's model stands in for a look at what is painted or heard. **Evidence**: four sound
defects heard by the Principal while every guard was green (*"the voice is so quick I could not recognise what it says"*, Z076;
*"the sounds are not synchronised, the text runs ahead"*, Z079); maps rendered upside down; labels on arrowheads and wires; *"look at
the e trancated from the coulum text !!!"* (Z115); *"please always show to me visual examples i can see"* (Z112); an ornament hidden
below 1120 px, which is the Principal's window width (Z116).
**Theory.** The gulf of evaluation is the distance between what the system did and what the person can perceive it did (Norman and
Draper 1986); only the perceived result closes it. Sound and its picture are perceived as one event only within a narrow window,
45 ms early to 125 ms late (ITU-R BT.1359). The estate's own law says a comparison proves sameness, never rightness
(`protocol/PERCEPTION.md`).
**The principle.** *The painted page is the instrument.* Every check in section 7 runs on the rendered page, in both cultures, at the
widths readers use (375, 768, 1085, 1440 and 1900 px; 1085 is the Principal's window); a change a person perceives ships an artefact
a person can open, and the perception is recorded with its verdict.
**Checks**: all of K01 to K17 run on the paint; the perceptual row is the gate no check replaces.

### X · A decision already made is replaced by a default (29)

**From law 3, what is learned by place and look; and 4, the user stays in control.**
**The default.** The generator's own default overrides a decision the house already made: the platform's blue, a pattern invented
instead of the house's, a sibling site copied blindly, the author's text rewritten, a change nobody asked for. **Evidence**: *"the
selected background of the combo should embrace the current theme ... not the standard browser them (that ugly blue)"* (Z449);
*"checkboxes should be in green not blue in this retro mode!"* (Z451); *"this navigation system is not ours!"* (Z453); *"why did you
make Start with a coloured background? don't change things without notifying me"* (Z442); *"I never asked you to make the labels
of the slices clickable!!!"* (Z450); *"bring back this same text"* (Z448).
**Theory.** Users need to feel in control of the interface, not managed by it (Shneiderman 1987, rule 7; Nielsen 1994, heuristic 3).
Expertise rests on spatial and visual stability: a control that moves or changes look resets what the user learned (Scarr,
Cockburn, Gutwin and Quinn 2011).
**The principle.** *Decided stays decided.* The house's components are reused, never re-invented; no state of any control is left
to the platform (the culture's tokens paint checkboxes, radios, the open select, the selection and focus); a change that was not
asked for is named in the report before it ships; the author's words are kept as written.
**Checks**: K09 PALETTE, K21 ARCHETYPE.

## 5. The predecessors: Zin's design system, Refine's PX design and Zing's PX discipline

Zane's system is the fourth attempt in this estate, not the first. Each predecessor decided much that still holds, and each also
fixed values that later corrections overruled. This section sets each one beside Zane's system: what it decided, where the two agree,
where they differ and why, and what Zane takes. A decision of a predecessor that Zane contradicts is named with the corpus evidence
for the change; where the corpus has no evidence against it, Zane adopts it.

### 5.1 Zin's design system

**What it is.** Zin, the Principal's platform, states its design system in five places: the Zui specification v3.0 (the intent
grammar Zane inherits), the Interface Constitution with severities, the multi-sensory token extension
(`doc/design/ZIN_DESIGN_SYSTEM_TRANSVERSE.md`), the tokens its compiler writes for each project, and the banking demo's stylesheet.
Its centre is **the closed intent grammar**, 22 verbs in six families, from which every widget follows, and **an Interface
Constitution of numbered rules**, each derived from a system article: one vertical reading flow, zero displacement, undo within a
visible grace period, keyboard sovereignty, visible state, predictable authority, business time, calm density, and twelve forbidden
patterns. Zane's law is its descendant: Articles I to VII and the rules on zero displacement (38), undo (79), keyboard sovereignty (80),
perceivable state (82) and predictable authority (83) carry Zin's decisions under Zane's numbers.

**Where the two agree.** Colour carries meaning, never decoration, and the banking demo's five statuses are exactly Rule 118's; six
type sizes and a spacing scale whose steps Zane keeps; motion reports and never decorates; a 2 px focus ring that may not be removed;
selection never acts; words in the reader's vocabulary, never the implementation's; one dominant reading flow; amendment only by
evidence of real, recurring harm; a closed vocabulary the generator may not extend.

**Where they differ, and why Zane departs.**

| subject | Zin | Zane | the evidence for Zane's value |
|---|---|---|---|
| reading size | 16 px in the tokens, 15 px in the banking demo, 20 px only in the kitchen | 21 px everywhere | section 9 (a); Z245, Z251, Z253, Z263, Z271 |
| smallest size | 12 px; the banking demo's commonest is 11.7 px | 18 px | section 9 (c); Z251, Z253, Z266 |
| contrast | 7:1 in the kitchen only; muted text measured at 2.4:1, the focus ring at 2.1:1 | 7:1 for every text | Z245 ("never small text that also has weak colour"), Z253 |
| a title against the reading size | 2.0 (32 over 16) | at most 1.7 | Z264 ("excessively big") |
| measure | none; containers of 600 to 1200 px | 60 to 75 characters | Z364, Z359; law 1 |
| status colours | four in the tokens, five in the demo | five and one neutral | Rule 118; Z313 (Zin's own ruling) |
| the second navigation level | vertical and lateral (Z123) | a horizontal band under the bar | the later rulings of 2026-10-16 and 2026-11-04 (section 3) |
| tooltips and hover cards | the rendering of UNDERSTAND and PREVIEW | none; a status line in the flow | Z307, Z311, Z455; and Zin's own floating label on hover (Z277), overruled by Z455 |
| cards | for READ, SCAN and SELECT, with hover shadows | running text is never carded; records are a table | Z168 (Zin's own ruling, 2026-04), Z375, Z378, Z203 |
| scroll | one inner workspace between fixed bars; generated tables in `overflow-x: auto` | on a page only the document scrolls; panes only in the application archetype, never nested; never sideways | Z305, Z309, Z310 |
| motion | pulsing halos and a 420 ms zoom while Zin's own limit is 200 ms | 150 ms to report a change the user made; nothing pulses | Z320, Z326, Z327; Zin's own Article I |
| sound | a chime confirms a successful act | sound corroborates a state already visible and never acknowledges a click | Rule 125, from the sound plane's corrections (Z076 to Z079) |
| the console | ASCII only (Z121) | the box-drawing glyphs are Softanza's display system | Z431, the later ruling |
| a culture | a vibe changes density, navigation, feedback and input, "not a theme" | a culture changes colour, font, radius and shadow, and **now also its interaction vocabulary** (below); never a size, a space or a meaning | Article VI; Zane takes Zin's broader reading |

**What Zane takes from Zin.** Twelve decisions enter the system, each in the place named:

1. **Nothing moves the layout** (Zane Rule 38): an error appears in space reserved for it, a button never moves, a placeholder has the
   final geometry, the scrollbar gutter is reserved. A new check, K22 LAYOUT_STILL.
2. **An active filter is always visible**, by the control showing its value (Rule 82); the `field` component.
3. **Selection never acts** (Article II), and **Cancel is reachable from every confirmation**, Enter for the primary action and Esc to
   cancel; the `dialog` component.
4. **Only the deepest current entry is marked** (Z126): a parent with children is never marked as the current page; the `band` and the
   `side list`.
5. **Shortcuts are shown beside their action**, with one help panel (Rule 80); the `view bar`.
6. **Undo within a visible grace period**, or an irreversible act declared and confirmed twice (Rule 79); the `notice`.
7. **A status colour appears only when there is something to see**: an empty bucket is muted, and a legend lists only the statuses
   present (E).
8. **Hard limits on motion**: nothing flashes more than three times a second, nothing plays on its own, no blinking, marquee or
   parallax (`--motion-report`).
9. **A field is as wide as what it holds**, in three widths, every input of one height (S); the `field` component.
10. **Chart rules** for the `figure`: units on every axis, at most seven colour categories, every mark bound to data.
11. **A 48 px target on a phone** (Zin's one-handed figure, and 48 to 62 px asked from a real phone, Z454), replacing M1's 44 px.
12. **A change to a token names the intent it serves** (Zin's ZIN-C001-ZPT), the compiled form of "decided stays decided" (X).
13. And a vibe in Zin's sense: **a culture may set its interaction vocabulary**, Retro keyboard-first with instant feedback, Modern
    pointer-first, as long as every input still reaches everything (H).

**What the corpus overrules in Zin**: the sizes and contrasts above; tooltips and hover cards; cards for reading; nested and sideways
scroll; pulsing motion; boxes that mark structure (Z403, Z336); the ASCII-only console. Zin's compiler also designs more checking than
it runs: its specification lists ten violations (INTENT_ORPHAN, MISSING_UNDO, DECORATIVE_ANIMATION and others) and two design
checks run today. Zane's verifier and the checks of section 7 are where those designs are carried out.

### 5.2 Refine's PX design

**What it is.** Refine's "programmer experience" design (`docs/REFINE_PX_DESIGN_v0_19.md`, with `REFINE_SIMPLICITY_BY_DESIGN_v0_1.md`,
`REFINE_UI_DOMAIN_v0_1.md` and `REFINE_DIAGRAM_STYLE_v1_0.md`) is a set of principles that fix *where a feature lives and how attention
is directed* in an IDE, "predictable in a way that lets the user concentrate on the work rather than on the tool". It is the most
complete application design in the estate: a directional flow (mode, then facet, then the item on the left, then the workspace, then a
reactive context panel), one sub-level bar per view, no tooltips with a status bar instead, one primary action per view, colour as
meaning, "size never carries meaning", dark mode verified at design time, a glass wizard that shows the artifact it builds, and a
deterministic list of anti-patterns that gates any interface an AI generates.

**Where the two agree.** Rank without shrinking; no tooltips; a status line that says what a control does; tables before cards; one
primary action; colour is semantic; one form, one meaning; one explanation per view; no redundant "Back" button; every act shows a
result; a sheet over a frozen page; a concept shown, not described; plain words defined once; the reading leading of 1.7 and the
button radius of 8 px.

**Where they differ, and why Zane departs.**

| subject | Refine | Zane | the evidence for Zane's value |
|---|---|---|---|
| reading size | the IDE's body 14 px; the site's 18 px | 21 px | Z245 (the Principal zoomed Refine's own site to 120%), Z271 |
| smallest size | 11.5 to 14 px in the IDE; 9.5 px labels on the site | 18 px | Z251, Z253, Z263, Z266 |
| secondary text | told by muted colour at 5.5 to 5.8:1; the faintest ink at 2.6:1 | 7:1, quieter by tone and weight only | Z245, Z253 |
| sizes | the site's comment promises five; the file declares 28, four of them scaling with the window | six fixed tokens; a size never scales with the window | K01; Z424 |
| a title against the reading size | up to 3.2 on the site; KPI numbers at 2.2 | at most 1.7 | Z264 |
| colour of the main action | the same green as success | `--action` and `--success` are two tokens | Z172 |
| the cost meter | a progress bar beside the number it repeats | one fact, one encoding | Z376 |
| help | on hover, in the status bar and in the diagrams | in the flow, reachable by tap and focus | Z455, Z307, Z311 |
| scroll | panes and site ribbons scroll on their own, sideways included; smooth scrolling | panes in the application archetype only, never nested, never sideways; navigation is instant | Z305, Z309, Z310, Z326 |
| site cards | react to the pointer like links | a container never reacts | Z168, Z203 |

**What Zane takes from Refine.**

1. **The application archetype** (section 6.5): the directional flow, one view bar per view holding its sub-views at the start and its
   actions at the end, content directly under the bar.
2. **The four-part grammar of a refusal, an error or an empty state**: what happened, why, what to do next, where to learn more; the
   `notice` component.
3. **Bars at one level share one height**: a new token, `--bar-height`.
4. **A budget for persistent chrome**: every always-visible item is paid for in attention on every look, so chrome has a ceiling and a
   stated order of collapse; the application archetype.
5. **Table details**: numbers right-aligned in tabular figures, a click anywhere on a row opens the item, the selected row marked by
   ink and an edge, never by a tint (Z336); the `table` component.
6. **Switching and closing are never adjacent**; every navigation entry responds, an entry not yet built showing what it will hold.
7. **The diagram grammar**: closed shapes and arrow kinds, every arrow that crosses a phase labelled, red only for a breach, selection
   as an outline, hand layout; its 9 to 13 px labels rise to the 18 px floor; the `figure` component.
8. **The format of a status line**: one concept, at most about 80 characters.
9. **What an agent produced is shown as such**, the seam between sourced and governed visible (Rule 99, Visible Provenance).
10. **A deterministic gate on interfaces an AI generates**, which is what the checks of section 7 are.

### 5.3 Zing's PX discipline

**What it is.** Zing has two disciplines. Zing Studio's PX (`zing-studio/docs/ZING_PX_DESIGN_v0_2.md`), set by the Principal in the
June 2026 brief and "carried over from Refine", governs the IDE: a 12 px floor, actions at the right edge of the one sub-level bar, no
tooltips with a status bar instead, colour for meaning only, numbers in ink with tabular figures, no yellow, every colour a token,
light and dark first-class, a creation dialog, AI in one place, localisation by design, and refusals shown as the source's own
message, line and caret (Z272). Zing's site, the former StzWeb, obeys Zane's law, whose Rules 105 to 116 were born on it in August
2026.

**Where the two agree.** Rank without shrinking; no tooltips; colour for meaning; every value a token; tables over cards; controls
that grow with their label and rows that wrap; no decorative motion; nothing floats over the reading.

**Where they differ, and why Zane departs.** Zing's 12 px floor is below every later ruling, its own parent's included (Refine's site
had moved to 18 px, Z245), so it is read as **superseded in its value and kept in its principle**: size never ranks. The Studio ranks
secondary text by greying it, 68 times at 3.4 to 3.6:1, the defect Z253 names. Its status bar is fed by the pointer only, with no tap
path (Z455), and its panes scroll inside a page that does not (Z305, Z310). The site's hero reaches 4.6 times the reading size (Z264),
and its reader still carries tooltips (Z307). The brief's "Honest boundaries" on every commercial page (Z207) is the origin of the
negative marketing the Principal later refused (Z240); PRINCIPAL-AFFIRM-01 replaces it.

**What Zane takes from Zing.**

1. **The application shell** (with Refine's), and in it **the status line as the one channel for what a control does**, a strip in the
   layout and never a floating layer, reachable by hover, focus and a first tap; Lookout arrived at the same "info bar" after four
   rulings (Z311). The `status line` component.
2. **The tool's actions apart from the content being made**, and one place for the agent, whose proposals are reviewed like a person's.
3. **A creation dialog**, lawful under Rule 110 as a layer the user opened and closes with Esc; the `dialog` component.
4. **Localisation by design**: no sentence built by concatenation, layouts that tolerate longer words, numbers and dates formatted for
   the locale (Rule 122).
5. **Print keeps paper colours** in every culture.
6. **Numbers in ink, in tabular figures**; the `table` component.
7. **A refusal shown with its source's message, line and caret**, on one surface for every language; the `notice` component.
8. **External links marked as such** (Z175) and **scrollbars in the culture's colours** (Z432): K09 reads the scrollbar too.

### 5.4 What the predecessors change in the system

| | M1 | M1b |
|---|---|---|
| archetypes | 6 page archetypes | 7: the **application** joins them (Refine, Zing) |
| components | 21 | 25: **pane**, **view bar**, **status line** and **dialog** join them |
| tokens | 42 per culture | 45: `--bar-height` joins them; `--target-phone` rises from 44 to 48 px; milestone 2 adds `--bar` and `--on-bar` (section 6.2) |
| a culture | colour, font, radius, shadow | and its interaction vocabulary (Zin's vibe) |
| checks | 21 | 22: K22 LAYOUT_STILL (Zin's zero displacement); K13 reads nested scroll; K17 reads 48 px; K09 reads scrollbars |
| component rules | | the notice's four parts and its undo grace; the table's numbers, row and selection; the figure's chart and diagram grammar; the field's widths and visible value; the dialog's Enter and Esc; the deepest entry alone marked |

## 6. The design system

The system serves Zane's bounded domain: intent-driven interfaces for business applications and the sites that explain them. It
applies first to the Zane site (milestones 2 and 3) and is written so a generator can follow it on any Softanza site and in any
application built with Zane, whose shell it takes from Refine and Zing (section 5).

### 6.1 Thirteen principles, one per cause

| | principle | bounds | from law |
|---|---|---|---|
| T | Every text is set for reading | six sizes; floor 18 px; 7:1; a title at most 1.7 times the reading size; reading text never shrinks to fit | 6, 2 |
| S | Width belongs to the content | measure 60-75 characters; a box at most a third empty; a control beside its content; between-group space at least twice the inside space; a title takes its column | 1, 4 |
| I | A line or a box draws something real | lines only on tables, fields, drawings, focus, samples, code and the grid of peer regions | 2, 1 |
| E | One emphasis per element, one critical element per view | five semantic colours and one neutral for data; motion only reports | 3, 2 |
| B | Balance is on by default | last line at least a third of the widest; no line crosses a sentence in a title; control rows equal | 1 |
| F | One shape, one meaning | four shapes; containers never react | 2, 4 |
| N | The menu is the tree | five entries a bar; landing first under its own label; outline on pages of three or more sections | 4, 3 |
| L | Everything is on the page, with one scroll | no tooltip; no hover-only content; on a page, no inner scroll; in an application, no scroll inside a scroll; nothing moves the layout; feedback within 100 ms | 4, 3 |
| H | Every input reaches everything | every hover has a tap; 48 px on phones, 24 px elsewhere | 6, 4 |
| W | Words serve the reader; a concept is shown | declarative register; points over dense paragraphs; a live sample per concept | 5, 3 |
| M | The page speaks for its reader | affirmative; README order; the action after the understanding | 5 |
| P | The painted page is the instrument | five widths, two cultures; a perception recorded | 4, 6 |
| X | Decided stays decided | no platform default; house components; changes named | 3, 4 |

### 6.2 Tokens: 45 per culture, 23 of which a culture may set

Every value the stylesheet uses comes from a token. **Fixed** tokens hold in both cultures; **culture** tokens are set by Modern and
Retro (Article VI), always under the same name and meaning. A culture also sets its interaction vocabulary, as Zin's vibes do:
Retro is keyboard-first with instant feedback, Modern pointer-first; every input still reaches everything (H).

| family | token | value | fixed or culture | closes |
|---|---|---|---|---|
| type (13) | `--size-small` | 1.125rem (18 px): labels, captions, table heads, code, footer | fixed | T |
| | `--size-reading` | 1.3125rem (21 px) on every site (decided, section 9 (a)) | fixed | T |
| | `--size-lead` | 1.5rem (24 px): the page's lead | fixed | T |
| | `--size-section` | 1.75rem (28 px): section titles | fixed | T |
| | `--size-title` | 2.125rem (34 px): the page title, 1.62 times the reading size; the steps from 18 to 34 px each rise by 1.14 to 1.21 | fixed | T |
| | `--size-hero` | up to 2.6rem: the front page's hero only | fixed | T |
| | `--weight-regular`, `--weight-strong` | 400 and the heading weight; no third | fixed | E |
| | `--leading-reading`, `--leading-title` | 1.7 and 1.2 | fixed | T |
| | `--measure-min`, `--measure-max` | about 60 and 75 characters of running text, fixed in characters and stated in em by each culture for its font: 27em and 33em in Modern, 33em and 40em in Retro, whose monospaced letters are wider (a `ch` is the width of a zero, so 75ch would hold about 85 proportional letters; K03 measures the painted line) | culture | S |
| | `--font` | sans (Modern), mono (Retro) | culture | — |
| space (5) | `--space-1` to `--space-4` | .5rem inside a component, 1rem between items, 2rem between groups, 4rem between regions | fixed | S, I |
| | `--gutter` | 1.4rem from any container's edge to its text | fixed | S |
| colour: chrome (12) | `--paper`, `--surface` | the page; the frame of a sample or a code block | culture | E |
| | `--ink`, `--ink-2` | text; secondary text, still 7:1 | culture | T |
| | `--line`, `--edge` | a hairline that draws (tables, drawings); a field's edge, 3:1 | culture | I, F |
| | `--link` | navigation | culture | F |
| | `--action`, `--on-action` | the one primary action of a view, and its label at 7:1 | culture | F |
| | `--focus` | the focus ring | culture | H |
| | `--bar`, `--on-bar` | the surface the menu and the footer stand on, and the front page's photograph panel, with the words on it; added in milestone 2, because each culture's identity lives in its bar (Modern's indigo, Retro's terminal black) and no token above can be both | culture | E |
| colour: data (6) | `--success`, `--warning`, `--danger`, `--info`, `--muted` | Rule 118's five semantic values | culture | E |
| | `--meta` | the one neutral for channels, types and categories | culture | E |
| form (4) | `--hairline`, `--ring` | 1 px; 2 px | fixed | I, H |
| | `--radius`, `--shadow` | 8 px and one resting shadow (Modern); 0 and none (Retro) | culture | — |
| touch (2) | `--target-phone`, `--target` | 48 px at widths up to 760 px (Zin's one-handed figure, section 5.1); 24 px elsewhere | fixed | H |
| chrome (1) | `--bar-height` | 3rem: every bar at one level has this height (Refine, section 5.2) | fixed | B |
| motion (2) | `--motion-report`, `--motion-nav` | 150 ms for a state the user changed; 0 for navigation | fixed | E, L |

The two stylesheets declare **20 distinct font sizes** today (`site/stz.css` and `site/gotchas.css`) and the tokens allow six. Code
highlighting has four roles drawn from these tokens and adds no hue (decided, section 9 (d)): a comment in `--ink-2`, a keyword in
`--link`, a string in `--meta`, a verdict in `--success` or `--danger`.

### 6.3 Four shapes, four meanings

| meaning | shape | at rest | under pointer or focus | never |
|---|---|---|---|---|
| **action** | a button: a verb, in a box; the view's one primary action filled with `--action`, the others outlined | the box | the focus ring | a link's look; a noun or a state as its label ("Dense view", "Remove" for "leave out") |
| **navigation** | a word in `--link`, or a menu entry; the current entry marked in ink and weight | in running text, the word with the plain underline (decided, section 9 (b)); in a bar, a list or a table, the word alone, its place saying it is navigation | the focus ring | a fill; bold and underline together; a card; a cue that exists only under the pointer |
| **state** | a tag: the semantic colour's text on its pale tint, with a full-colour edge | the tag | nothing: a state never reacts | a cursor; a click |
| **input** | a field with a visible `--edge`; a check, radio or select in the culture's colours; a two-state control showing both states | the field | the focus ring | the platform's blue; a toggle that names the other state |

A container (a section, a row, a sample frame) is none of the four and never changes under the pointer.

### 6.4 Components: twenty-six, a closed list

| component | what it is for | its rules | closes |
|---|---|---|---|
| **bar** | the main menu | brand, then at most five entries with a visible rule between them and space after the brand; the theme select and GitHub at the right | N, B |
| **band** | a section's pages | horizontal, fixed under the bar, apart from the bar by place, size and weight; the landing first under its own label; only the deepest current entry is marked | N |
| **side list** | a family's pages, or the page's outline | on the left, under the brand, its line on the side of the text; the page's head stays on the top menu's container (Z367); the text beside the list, and every block in it, shares one left edge (Z366); its heading in `--ink-2`, regular weight, apart by space; an outline by default on pages of three or more sections | N, F |
| **trail** | the path, where a level is not already shown | only then | N, I |
| **page head** | kicker, title, lead | the kicker names the section; the title is one declarative sentence, balanced; the lead's first sentence defines the subject | W, B |
| **section** | a part of a page | its title says what it holds | W |
| **paragraph** | running text | at the measure; at most about 60 words | W, S |
| **card grid** | peer regions: ways in, families, rules, the sections of a landing | one thin line in `--line` around the grid and between its cells, shared by neighbours (each cell an outline, the gap the line's width); the cell padded by `--space-2` and at least seven tenths of the culture's shortest measure wide, so it holds a reading line in either face; its text, at most the measure, fills the cell's width as its neighbours' does, narrowed only as far as its last line needs to hold a third of the widest (K11); a last cell alone on its row takes the row; stacked on a phone, the lines between cells stay (Z404) | I, B |
| **points** | a list that explains | a lead line, then items, each a strong label and one sentence | W, I |
| **table** | records and comparisons | drawn as a table, never as running text: a frame on `--surface`, the header row on `--tint` with a firmer rule in `--edge` under it, a hairline between rows (Z204); the room its content needs to the right of the text's column, into the page's margin, up to the window less the gutter, wrapping only past that, its left edge the text's (Z365, Z366); a header row; the thing, then its state, then the action ("Nothing" when none); never scrolls; the action column goes last; numbers in ink, right-aligned, in tabular figures; a click anywhere on a row opens the item; the selected row marked by ink and an edge, never a tint | I, L, N |
| **sample frame** | a live UI sample | a frame drawn as a browser or an application window, holding real HTML; lawful and offending side by side when they compare; a caption that cites the rule number and states the verdict with a state tag | W, M, P |
| **code block**, **terminal block** | code and runs | `--surface`, sized to the content, lines written to 72 characters; a line longer than the column takes the room free to its right, as a table does, its left edge the text's (Z365, Z366), and wraps only past that, never scrolling | L, S |
| **figure** | a drawing or a chart | scales to the column; labels at `--size-small` or more; named by `<desc>`; a chart has units on every axis and at most seven colour categories, every mark bound to data; a diagram keeps a closed set of shapes and arrows, labels every arrow that crosses a phase, uses red only for a breach and marks a selection by an outline | T, L, P |
| **button**, **link**, **tag**, **field** | the four shapes of section 6.3 | as there; a field is as wide as what it holds, in three widths, every input of one height, and an active filter shows its value | F, S |
| **notice** | the result of an act | a line in the page's flow, in a semantic colour, in space reserved for it, appearing within 100 ms; a refusal, an error or an empty state says what happened, why, what to do next and where to learn more, and a refusal shows its source's message, line and caret; an undoable act offers its undo for a visible grace period | L |
| **footer** | the project line | one line: the project, ©2020-the current year Mansour Ayouni, MIT, the Softanza link; `--size-small`, regular, `--ink-2` | M, E |
| **hero** | the front page only | the photograph; a panel as wide as its content, holding a tagline and one line that does not repeat it | S, M |
| **slide** | the tour | one message, one sample, at most three lines | W |
| **pane** | a region of an application | the item list on the left, the workspace, the context panel on the right; each pane scrolls by itself and no scrolling region sits inside another; panes collapse in a stated order | L, S |
| **view bar** | the head of a view in an application | `--bar-height`; the view's sub-views at its start and the view's actions at its end, never wider than the view; shortcuts shown beside their action; switching and closing never adjacent | F, N |
| **status line** | what a control does, said in the layout | a strip at the foot of an application or under a figure, never floating; filled by hover, by focus and by a first tap; one concept, at most about 80 characters | L, H |
| **dialog** | creating a record, or confirming an irreversible act | a layer the user opened, over a frozen page; Enter for the primary action, Esc to cancel, Cancel always reachable; never for reading or a trivial confirmation | L, F |

### 6.5 Archetypes: seven shapes

Every page declares its archetype, and its regions appear in the archetype's order. Six are pages of a site; the seventh is an
application's screen, taken from Refine's directional flow and Zing's shell (section 5).

| archetype | pages | order of regions |
|---|---|---|
| **front** | `index.html` | hero; one sentence on what Zane is; why it exists; what it is, in a table; what is here, as links |
| **landing** | each section's first page | page head; the same four steps at the section's scale; the section's pages in a table, one line each |
| **article** | a concept page | page head; outline (three or more sections); for each section: a statement, a sample frame (lawful beside offending), points |
| **reference** | the Reader, rules, conformance | page head; one table |
| **tool** | the UI audit, Try, Build | page head; controls in the page's flow, beside what they act on; a notice; the result as a table |
| **deck** | the tour | slides |
| **application** | a product built with Zane: an IDE, a console, a business tool | the bar (the mode); panes in the directional flow (the item on the left, the workspace, the context on the right), each view under its view bar; the status line at the foot; dialogs over a frozen page. Persistent chrome has a ceiling, paid for on every look (Refine). On a phone the panes become successive screens, never a second scroll |

### 6.6 What the generator may vary, and what it may not

| may vary | may not vary |
|---|---|
| the words, within the register | a size, a space, a weight, the measure, a target size |
| a culture's colours, font, radius and shadow, under the tokens' names | the meaning of a colour; a sixth status colour; a hue outside the tokens |
| the number of sections, rows and samples | the order of an archetype's regions; the four shapes and their meanings |
| which component holds which content, within the list | a component outside the list; a navigation pattern of its own |
| the hero's photograph | a box wider than its content; a line that draws nothing; a scroll inside a scroll; a tooltip; a hover-only reveal; a layout that moves |
| a culture's interaction vocabulary (keyboard-first or pointer-first) | a path that one input cannot take |
| | a platform default in any state of any control |

### 6.7 The same quality to see, to touch and to hear

| sense | what holds |
|---|---|
| **see** | sections 6.1 to 6.6 |
| **touch** | 48 px targets at phone widths, 24 px elsewhere; every hover has a tap path; nothing depends on hover; the keyboard reaches everything in reading order with a visible ring; Esc closes what the user opened |
| **hear** | sound corroborates a state already visible and never acknowledges a click (Rule 125); it plays at its true rate, in step with its text within ITU-R BT.1359's window (45 ms early, 125 ms late); each semantic value has one earcon whose urgency follows the value (Edworthy, Loxley and Dennis 1991); nothing plays on its own |
| **an agent** | the same structure a person sees is readable by an agent: landmarks, one title, headings in order, table headers, labelled fields (Rule 104; the user is a person or an agent) |

## 7. The checks: every rule read on the painted page

The UI audit (`tools/ui-audit.html`) reads the rendered page and site-shell (`node tools/site-shell.js`, and `zane site shell`)
reads the files. Milestone 2 builds the new checks and shows each one failing on today's pages first, with its count. Every check
runs at 375, 768, 1085, 1440 and 1900 px in Modern and in Retro.

| check | reads | fails when | cause | today |
|---|---|---|---|---|
| K01 TYPE_SCALE | every text node's computed size | a size outside the six tokens, or below 18 px | T | the floor exists (Rule 105: 16 px, 18 px in strict mode); the scale is new |
| K02 TEXT_CONTRAST | every text node over what is painted under it | below 7:1 | T | exists at 4.5:1 (7:1 in strict mode for interactive text); raised |
| K03 MEASURE | every paragraph, item and caption | lines outside 45-75 characters at 768 px and wider | S | new |
| K04 BOX_FILL | every element with a visible edge or fill | its content leaves more than a third of its inner width empty | S | new |
| K05 CONTROL_NEAR | every button and field | farther than 4rem from the text or field it acts on | S | new |
| K06 GROUP_RATIO | sibling groups in a section | the gap between groups is less than twice the largest gap inside one | S, I | new |
| K07 LINE_DRAWS | every border and rule | on an element outside tables, fields, drawings, focus, samples, code and the bar's separators | I | new |
| K08 ONE_EMPHASIS | every text element | more than one of strong weight, underline, accent colour and fill beyond its shape's own | E, F | new |
| K09 PALETTE | every computed colour, including `accent-color`, the open select, the scrollbar and the focus ring | a colour outside the culture's tokens | E, X | new |
| K10 ONE_CRITICAL | the view | more than one element in `--danger` | E | new |
| K11 BALANCE | every text block | the last line shorter than a third of the widest; a rendered line of a title that holds the end of one sentence and the start of the next; a break placed by hand in a heading | B | the heading check exists in site-shell; the measure is new |
| K12 ROW_FULL | every wrapped row of controls | rows that differ by more than one item | B | new |
| K13 ONE_SCROLL | every element | on a page, anything but the document scrolls, either way; in an application, a scrolling region inside another, or a pane scrolling sideways | L | sideways scroll with room exists (Rule 114); the rest is new |
| K14 NO_FLOAT | fixed and absolute elements | one covers text and is not a bar holding its own space | L | the bars check exists; the overlap is new |
| K15 NO_HOVER_ONLY | attributes and stylesheets | a `title` attribute; a `:hover` rule that shows, hides or changes another element | L, H | the `title` check exists in site-shell; the stylesheet read is new |
| K16 SHAPE | interactive and pointer-styled elements | a pointer on something that is not a link, button, field or label; a container that reacts under a link; the action fill on a non-button | F | new |
| K17 TARGET | every interactive element | under 48 by 48 px at 375 px, or under 24 by 24 px elsewhere | H | new |
| K18 NAV_TREE | the menu, band, trail, path and outline | Rules 108, 115, 116 and the menu's three faults; a page of three or more sections without an outline | N | exists, with the outline default new |
| K19 REGISTER | the files | the writing, affirmative and naming checks; a paragraph over about 70 words | W, M | exists, with the paragraph length new |
| K20 SAMPLE | article pages | a concept section without a sample frame citing a rule number | W | new (milestone 3) |
| K21 ARCHETYPE | every page | no declared archetype, or regions out of its order | M, X | new |
| K22 LAYOUT_STILL | the page while it loads, while an act runs and after it answers | an element that moves because another appeared, grew or went: a notice without reserved space, a button that shifts, a placeholder of another size (Rule 38, Zero Displacement) | L, X | new (from Zin, section 5.1) |
| K23 BAR_ALIGN | the brand and the band's first entry on every page | an edge that differs from the one most pages share at the same width and culture (ZANE-READER-MENUPOS-01) | N | new |
| K24 WIDE_ROOM | every table and code block that spans the text column | it wraps its content while more than 24 px are free to its right: the window less the gutter, less the outline where the outline stands beside it; the left edge is never room (Z365, Z366) | S | new |
| K25 GRID_SHOWN | every grid or wrapping row whose children are peers (the same element and class, each with its own heading) | a cell with no line around it (Z404) | I | new |

**Twenty checks are new and five extend checks that exist.** None of them is a list of element kinds: each reads every element
that has the property it judges.

## 8. Law amendments the system implies (proposed, not applied)

Article VII asks for proof that a harm is real and recurring; the corpus is that proof, with its record numbers. Each row is a
proposal for the Principal to rule through Central; nothing here enters `rules.json` before that. Docket items still open (Pass 5,
F-1 to F-5) are folded in where they belong.

| # | rule | the change | evidence |
|---|---|---|---|
| 1 | 105 The Legibility Floor | the reading size is 21 px (section 9 (a)); the floor becomes 18 px for every text, footers included, and 7:1 for every text including control labels; rank by the token scale, never by shrinking; reading text never shrinks to fit a layout | T, 28 corrections in 12 projects (Z245-Z272) |
| 2 | new, Article I | **Width Belongs to the Content**: measure 60-75 characters; a box at most a third empty; a control beside its content; a title takes its column, never a fixed character count; one left edge for every block, and a table or a code block takes the room free to its right (ZANE-SPACEMEANING-01; docket F-3; Z365; Z366) | S, 27 (Z341-Z367) |
| 3 | 2 White Space Is Structural | **space groups and a line draws something real**: the gap between groups at least twice the gap inside; borders only where they draw; **a grid of peer regions draws its grid**, one thin line around and between its cells, which frames a real cell and so keeps Width Belongs to the Content (ZANE-NOLINES-01, ZANE-READINGLEVELS-01, ZANE-CARDGRID-01) | I, 37 (Z368-Z404), and S |
| 4 | new, Article I | **One Emphasis per Element, One Critical per View** (ZANE-ONEEMPHASIS-01; Rules 3, 87, 118 cross-cited) | E, 29 (Z312-Z340) |
| 5 | new, Article I | **Balance Is On by Default**, never for a list of element kinds; no line crosses a sentence in a title; control rows equal (docket F-1; ZANE-LINEBALANCE-01; ZANE-CONTROLROW-01) | B, 20 (Z405-Z424) |
| 6 | 114 Room Before Scrollbars | widened to **One Scroll**: nothing scrolls inside the page in either direction; a sheet freezes the page under it | L, the scroll records (Z287, Z293, Z305, Z306, Z310) |
| 7 | 69 The Hand Is Not a Mouse | **every hover has a tap path; no content only on hover; no tooltip** (ZANE-TOUCHTWIN-01; WRITING.md rule 11 enters the law) | H and L (Z307, Z455) |
| 8 | 119 A Card Is Not a Button | widened to **One Shape, One Meaning**: four shapes; a container never reacts; one fill, one meaning (ZANE-ONELINK-01) | F, 37 (Z168-Z204) |
| 9 | 108, 115, 116 | the trail check reads any path line, a kicker included (ZANE-TRAIL-KICKER-01); an outline by default on pages of three or more sections (ZANE-OUTLINE-01) | N, 46 (Z122-Z167) |
| 10 | Article VI, as a rule of tier `tool` | **A Culture Owns Its Defaults**: no state of any control is left to the platform | X (Z449, Z451) and Article VI's own evidence |
| 11 | 111 The Stranger's First Screen | the README order for a front page and a landing; affirmative voice on every public surface (PRINCIPAL-AFFIRM-01; docket F-2, F-4, F-5) | M, 40 (Z205-Z244), and W, 70 (Z001-Z070) |
| 12 | 125 Sound Corroborates | sound plays at its true rate and in step with its picture within the ITU-R BT.1359 window | P, the four sound records (Z076-Z079) |
| 13 | Article VII | **a correction enters the law as its cause, bounded on both sides, with a check on the painted result by default for every element** | the chains of section 1; 164 of 455 corrections name an earlier one |
| 14 | new, Article II | **The Application Shell**: panes in the directional flow, each scrolling by itself and never one inside another; a view bar per view; a status line in the layout as the one channel for what a control does; dialogs only for creating and for irreversible acts (Refine, Zing, section 5) | L, the nested-scroll and status-line records (Z309, Z310, Z311), S (Z357) |

## 9. Decided by the Principal

The four parts of the question were ruled by the Principal on 2026-11-09 (Central's ANSWER of 17:02, ZANE-DESIGN-01 M1b), in their
words, and the system above is written to them:

- **(a) "21 px everywhere"**: the reading size is 21 px on every site; `--size-reading` is 1.3125rem and the scale is set on it.
- **(b) "Underlined always (Recommended)"**: a link in running text carries the plain underline at rest.
- **(c) "18 px minimum (Recommended)"**: the footer is set at the 18 px floor; harobanda's smaller footer of 2026-09-28 is replaced.
- **(d) "4 roles; publish (Recommended)"**: code highlighting has four roles drawn from the tokens, and this study is published.

The question as it was put:

- (a) The reading size: 20 px, the Zane site's size since 2026-11-04, or 21 px, Lookout's since 2026-11-09 (PRINCIPAL-READSIZE-01,
  already routed). The token holds whichever is ruled.
- (b) A link in running text: the browser's plain underline at rest (recommended: it does not depend on hover, which a phone does
  not have, and it is Lookout's latest ruling), or the colour at rest and the underline under the pointer (the Zane site's ruling of
  2026-11-06).
- (c) The footer at the 18 px floor, replacing harobanda's smaller footer of 2026-09-28 (recommended: one floor everywhere).
- (d) Code highlighting from the tokens, four roles (comment, keyword, string, verdict) instead of today's eight hues
  (recommended).

## 10. What milestones 2 and 3 do with this

**Milestone 2** writes the tokens into one stylesheet, rebuilds the components on them, adds K01 to K22 (K20 with milestone 3) to the
UI audit and to site-shell in JS and Zig with parity, and shows each new check failing on today's pages first, with the count.
**Milestone 3** rewrites the site on the archetypes: a Why section first in the main menu, the front page and every landing in the
README's order, and every concept shown as a live sample, the lawful beside the offending, citing its rule. The Why section states
the problem from this corpus: 449 corrections in 26 projects, 160 of them naming an earlier one.

## 11. Sources

- Accot, J. and Zhai, S. (1997). Beyond Fitts' law: models for trajectory-based HCI tasks. *CHI '97*, 295-302.
- Arnheim, R. (1954). *Art and Visual Perception*. University of California Press.
- Bartram, L., Ware, C. and Calvert, T. (2003). Moticons: detection, distraction and task. *International Journal of Human-Computer Studies* 58(5), 515-545.
- Refine: `docs/REFINE_PX_DESIGN_v0_19.md`, `docs/REFINE_SIMPLICITY_BY_DESIGN_v0_1.md`, `docs/REFINE_UI_DOMAIN_v0_1.md`, `docs/REFINE_DIAGRAM_STYLE_v1_0.md`, `REDESIGN_BRIEF.md`.
- Zin: `doc/design/ZIN_DESIGN_SYSTEM_TRANSVERSE.md`, `doc/design/ZUI_INDUSTRIAL_DESIGN_EXTENSION.md`, `doc/spec/dsl/ZUI_SPECIFICATION_v3_0.md`, `doc/examples/zin_constitution.zin`, the tokens its compiler writes (`src/targets/figma_plugin.zig`), at cc98126.
- Zing Studio: `docs/ZING_PX_DESIGN_v0_2.md`, `zing_kickoff_prompt.md`, `prototype/zing-ide.html`, at 95f36de; Zing: `site/stz.css`, `tools/legibility-audit.html`, at e2573a9.
- Bertin, J. (1967). *Sémiologie graphique: les diagrammes, les réseaux, les cartes*. Gauthier-Villars.
- Bringhurst, R. (1992). *The Elements of Typographic Style*. Hartley and Marks.
- Carroll, J. M. (1990). *The Nurnberg Funnel: Designing Minimalist Instruction for Practical Computer Skill*. MIT Press.
- Chandler, P. and Sweller, J. (1991). Cognitive load theory and the format of instruction. *Cognition and Instruction* 8(4), 293-332.
- Cleveland, W. S. and McGill, R. (1984). Graphical perception: theory, experimentation, and application to the development of graphical methods. *Journal of the American Statistical Association* 79(387), 531-554.
- Cowan, N. (2001). The magical number 4 in short-term memory. *Behavioral and Brain Sciences* 24(1), 87-114.
- Dyson, M. C. (2004). How physical text layout affects reading from screen. *Behaviour and Information Technology* 23(6), 377-393.
- Edworthy, J., Loxley, S. and Dennis, I. (1991). Improving auditory warning design: relationship between warning sound parameters and perceived urgency. *Human Factors* 33(2), 205-231.
- Fitts, P. M. (1954). The information capacity of the human motor system in controlling the amplitude of movement. *Journal of Experimental Psychology* 47(6), 381-391.
- Grice, H. P. (1975). Logic and conversation. In *Syntax and Semantics 3: Speech Acts*, 41-58. Academic Press.
- Grudin, J. (1989). The case against user interface consistency. *Communications of the ACM* 32(10), 1164-1173.
- Hick, W. E. (1952). On the rate of gain of information. *Quarterly Journal of Experimental Psychology* 4(1), 11-26.
- Hoober, S. (2013). How do users really hold mobile devices? *UXmatters*, 18 February 2013.
- ISO 24495-1:2023. *Plain language, Part 1: Governing principles and guidelines*.
- ITU-R BT.1359-1 (1998). *Relative timing of sound and vision for broadcasting*.
- Kiger, J. I. (1984). The depth/breadth trade-off in the design of menu-driven user interfaces. *International Journal of Man-Machine Studies* 20(2), 201-213.
- Legge, G. E. and Bigelow, C. A. (2011). Does print size matter for reading? A review of findings from vision science and typography. *Journal of Vision* 11(5):8.
- Lindgaard, G., Fernandes, G., Dudek, C. and Brown, J. (2006). Attention web designers: you have 50 milliseconds to make a good first impression! *Behaviour and Information Technology* 25(2), 115-126.
- Microsoft (2016). *Inclusive Design toolkit*.
- Miller, R. B. (1968). Response time in man-computer conversational transactions. *AFIPS Fall Joint Computer Conference* 33, 267-277.
- Morkes, J. and Nielsen, J. (1997). *Concise, SCANNABLE, and Objective: How to Write for the Web*.
- Nielsen, J. (1994). Enhancing the explanatory power of usability heuristics. *CHI '94*, 152-158.
- Norman, D. A. (1988; revised 2013). *The Design of Everyday Things*. Basic Books.
- Norman, D. A. (1986). Cognitive engineering. In *User Centered System Design*, 31-61. Lawrence Erlbaum.
- Norman, D. A. and Draper, S. W., eds. (1986). *User Centered System Design*. Lawrence Erlbaum.
- Palmer, S. E. (1992). Common region: a new principle of perceptual grouping. *Cognitive Psychology* 24(3), 436-447.
- Palmer, S. E. and Rock, I. (1994). Rethinking perceptual organization: the role of uniform connectedness. *Psychonomic Bulletin and Review* 1(1), 29-55.
- Parhi, P., Karlson, A. K. and Bederson, B. B. (2006). Target size study for one-handed thumb use on small touchscreen devices. *MobileHCI '06*, 203-210.
- Pirolli, P. and Card, S. (1999). Information foraging. *Psychological Review* 106(4), 643-675.
- Rello, L., Pielot, M. and Marcos, M.-C. (2016). Make it big! The effect of font size and line spacing on online readability. *CHI '16*, 3637-3648.
- Scarr, J., Cockburn, A., Gutwin, C. and Quinn, P. (2011). Dips and ceilings: understanding and supporting transitions to expertise in user interfaces. *CHI '11*, 2741-2750.
- Shneiderman, B. (1987; 6th edition with Plaisant and others, 2016). *Designing the User Interface*. Addison-Wesley.
- Sweller, J. (1988). Cognitive load during problem solving: effects on learning. *Cognitive Science* 12(2), 257-285.
- Tinker, M. A. (1963). *Legibility of Print*. Iowa State University Press.
- Treisman, A. M. and Gelade, G. (1980). A feature-integration theory of attention. *Cognitive Psychology* 12(1), 97-136.
- Tufte, E. R. (1983). *The Visual Display of Quantitative Information*; (1990). *Envisioning Information*; (1997). *Visual Explanations*. Graphics Press.
- Tversky, A. and Kahneman, D. (1981). The framing of decisions and the psychology of choice. *Science* 211(4481), 453-458.
- von Restorff, H. (1933). Über die Wirkung von Bereichsbildungen im Spurenfeld. *Psychologische Forschung* 18, 299-342.
- W3C (2023). *Web Content Accessibility Guidelines (WCAG) 2.2*, Recommendation of 5 October 2023; *CSS Text Module Level 4*; *Media Queries Level 4*.
- Ware, C. (2004). *Information Visualization: Perception for Design*, 2nd edition. Morgan Kaufmann.
- Wertheimer, M. (1923). Untersuchungen zur Lehre von der Gestalt II. *Psychologische Forschung* 4, 301-350.
- Softanza: `protocol/PERCEPTION.md` (CENTRAL-PERCEPTGATE-01), the ledger's UI rulings (Central's corpus, softanza 614d795).
