# Zane's design system, from first principles

**Status: a study, milestone 1 of ZANE-DESIGN-01. No page, rule, check or stylesheet changed with it.** The Principal reads it
before milestone 2 (the system as code) begins. Ordered by Central on 2026-11-09 14:30, on two requests of the Principal that
day: *"rethink the problem from first principles, learn from the fundamental theories made in the HCI domain, old and current, and
especially from the TONS of issues we get not only on this project but IN EVERY PROJECT involving UI we made together!!!"*, and
*"the site needs a deep rewriting to adopt a didactic visual illystrated style with accurate samples of UIs and issue color and
froms semantics"*. Ruled first on this desk: PRINCIPAL-ZANEFIRST-01.

**What this is.** Four things, in order:

1. **The corpus**: every UI correction the Principal made in every project, 311 of them, each with its source, classified by the
   root cause that produced it ([`corpus/CORPUS.md`](corpus/CORPUS.md), generated from [`corpus/corpus.json`](corpus/corpus.json)).
2. **The theory** under each root cause, old and current, cited.
3. **The design system**: page archetypes, components and tokens, what the generator may vary and what it may not, every rule
   checkable on the rendered page, for sight, touch and hearing.
4. **The law amendments** the system implies, proposed under Article VII with the corpus as evidence, not applied.

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
same chains: the hero panel was too wide, then a tall narrow box, then a box that hid the museum's door (Z254, Z255, Z256); a
repeated menu label was "fixed" by deleting the landing page, which the Principal then had to restore (Z118, Z119); a line-balance
fix covered a list of element kinds, and the defect came back that afternoon on a kind not in the list (Z295, Z297).

**Four properties are missing from a correction that oscillates, and the system gives every rule all four:**

1. **The rule names the cause, not the symptom.** "No lines between points" is a symptom; *a line draws something real, and space
   separates groups* is the cause, and it settles the next case the generator has not seen.
2. **The rule is bounded on both sides.** "Use the space" has no upper bound, so the fix overshoots into stretched lines; "do not
   stretch" has no lower bound, so the next fix leaves half the screen empty. A measure between 60 and 75 characters fails both.
3. **The vocabulary is closed.** The generator chooses among six sizes, four spaces, four shapes and twenty-one components; it never
   invents a seventh size, a new navigation pattern or a sixth status colour.
4. **The check reads the painted page, by default, for every element**, at the widths the reader uses, in both cultures, never a
   list of element kinds.

## 2. The corpus

**311 distinct corrections, made in 20 projects between April and November 2026.** 167 quote the Principal's own words; 144 are a
session's paraphrase, marked as such. 117 more records were the same remark relayed in another file and are listed under the record
they repeat. **148 of the 311 name an earlier correction of the same defect**, and 16 carry the Principal's own words of repetition
or fatigue: *"I told you a thousand times"* (Z187), *"as usual: text is very small and unreadable!!!"* (Z184), *"the issue of
equilibrated text on a line again and again!"* (Z294), *"I'm tired of talking to you of visual equlibrium!"* (Z255), *"don't go back
to the card UI system in small screens ... This is the power of dogmatic influence you got from your training data."* (Z272), *"how
many times I told you to avoid this ugly word taking its own line!!!"* (Z297). The pace rose month by month, 48 in August,
81 in October and 112 in the first nine days of November, 38 of them on 2026-11-09 alone.

**Sources.** Four read-only sweeps on 2026-11-09, merged and classified by hand, beside Central's compiled corpus (softanza
614d795): softanza's memos, conclusions, mailboxes and perception law; the stzlib desk's memory (232 files); every other project's
memory and Lookout's rulings of the day; and this repository's docket, harvest, law, inbox, outbox and history. The method,
the sweep each record came from and every record are in [`corpus/CORPUS.md`](corpus/CORPUS.md).

**Classified by root cause, not by symptom.** A root cause is the default that produced the defect: the thing the generator does
when nothing stops it. Thirteen causes cover all 311, in five groups:

| group | root cause | corrections | projects | name an earlier one |
|---|---|---|---|---|
| **Perception**: the eye groups by space, size and contrast before it reads (98) | **T** Type sized by convention, not for reading | 26 | 12 | 20 |
| | **S** Width taken from the container; space treated as filler | 20 | 6 | 12 |
| | **I** Ink and boxes that draw nothing | 19 | 9 | 9 |
| | **E** Emphasis added, never budgeted | 21 | 8 | 8 |
| | **B** Balance left to chance | 12 | 5 | 10 |
| **Meaning**: a form and a place each mean one thing (63) | **F** One form carrying two meanings | 28 | 10 | 11 |
| | **N** Navigation that does not mirror the tree | 35 | 10 | 12 |
| **Presence**: what matters is on the page, for every input (24) | **L** What matters is hidden, volatile or scrolled inside the page | 22 | 11 | 10 |
| | **H** A pointer is assumed | 2 | 2 | 1 |
| **Voice**: the words serve the reader (73) | **W** Words written for the writer, not the reader | 45 | 12 | 23 |
| | **M** The page speaks for its maker, not its reader | 28 | 12 | 13 |
| **Fidelity**: the painted result and the decisions already made are what count (53) | **P** The model is checked, not the paint | 41 | 4 | 14 |
| | **X** A decision already made is replaced by a default | 12 | 7 | 5 |

**What the counts say.** Type and balance repeat the most: 20 of 26 type corrections and 10 of 12 balance corrections name an earlier
one, because a reading size or a balanced line is undone every time the text or the template changes. Words for the writer is the
largest class and spans twelve projects. Ink, space and emphasis together (60) are one family the Lookout desk named in a sentence:
*"the generator reads free space as a defect to fill and a border as a neutral way to make sections."* Touch has two records
because touch was rarely tested, not because touch is right: Z311 found a hover design ruled four times that day on a desktop only.

**Rulings that point opposite ways, and how the system reconciles them** (a system that picks one side re-opens the other):

| the two rulings | the cause both serve | the system's answer |
|---|---|---|
| "tables, not cards" (Z269, Z272) against "listes de données ... jamais `<table>`" on a phone (a restaurant app, 2026-07) | no sideways scroll, no card grid | a table keeps its columns and never scrolls; under width pressure its lowest-priority columns go first and the action column last (Rule 129) |
| tooltips forbidden (Z221), a tooltip under each button (an NGO platform, 2026-10-14), tooltip-panel-tooltip-bar (Lookout) | say what a control does before it is used | no tooltip; a short label says it, and where more is needed a status line in the page's flow says it, reachable by tap and focus |
| a smaller footer (harobanda, 2026-09-28) against 18 px or more everywhere (Lookout, 2026-11-09) | the footer is secondary, never unreadable | the footer is set at the small size, which is the floor (18 px), in plain weight and secondary ink |
| "do not overestimate the realworld use" (Z154) against "never undersell" (Z160, Z173) | a claim at its true size | affirmative sentences, nothing inflated (PRINCIPAL-AFFIRM-01) |
| all modules greyed in the menu, then a menu adapted to the role (an NGO platform, 10-17 and 11-02) | the menu tells the truth about what this user can reach | the menu shows what the role can use (the later ruling) |
| links coloured with an underline on hover (Zane, 2026-11-06) against the browser's plain underline (Lookout, 2026-11-09) | a link is found without effort, with one emphasis | **open, for the Principal** (section 7): the system recommends the plain underline in running text, because a cue that appears only on hover does not exist on a phone |

## 3. Thirteen root causes, the theory under each, and what closes it

Each cause below has the default that produces it, its evidence, the theory it rests on, the principle that replaces it (stated
with both bounds), and the check that reads it on the painted page. The checks are numbered K01 to K21 in section 5.

### T · Type sized by convention, not for reading (26)

**The default.** The generator takes its sizes from web defaults (16-17 px body, 12-14 px secondary text) and ranks text by making
it smaller and greyer. **Evidence**: *"Again and again: text is small"* (stzsite), *"the secondary text must be bigger!"* (Z197),
*"the black text on those color background is not readable!!!"* (Z201), *"The main text is small"* (Z202, at 19 px), and the
inverse: *"the text of the main titles are excessively big"* (Z195).
**Theory.** Reading speed is flat across a range of sizes above a critical print size and falls fast below it (Legge and Bigelow
2011); readers on screens read faster and understand more at 18 px and above (Rello, Pielot and Marcos 2016); Tinker (1963) measured
the same for print. Contrast is a legibility condition, not a style: WCAG 2.2 sets 4.5:1 as the floor and 7:1 as the enhanced level
for text (1.4.3, 1.4.6). Rank is carried pre-attentively by weight, colour and position as well as size (Treisman and Gelade 1980),
so nothing requires shrinking to rank.
**The principle.** *Every text is set for reading.* Six sizes and no others; nothing below the small size (18 px); every text at
7:1 against what is painted under it; rank by weight, position and the next size up, never by shrinking or greying. A title is at
most 1.7 times the reading size, so a heading never shouts.
**Checks**: K01 TYPE_SCALE, K02 TEXT_CONTRAST.

### S · Width taken from the container; space treated as filler (20)

**The default.** Free width is a defect to fill, so a box takes its container's width and its content spreads or its control drifts
to the far edge. **Evidence**: the Lookout chain of section 1; *"the space to the right is not necessary! Space is a functional
communication tool that we must use with care"* (Z254); *"well done! but again you fail at understanding space and what it can
visually mean ... when the screen is large just let the zone be with less width!! you are not obliged to stretch it."* (Z266,
ZANE-SPACEMEANING-01); *"add enough space to avoid visual collision between the title and the text"* (Z265).
**Theory.** Nearness groups and distance separates before anything is read (Wertheimer 1923, proximity); an enclosed region groups
even more strongly than nearness (Palmer 1992, common region), which is why a box stretched past its content claims empty space as
part of the group. Reading is comfortable between about 45 and 75 characters a line (Bringhurst 1992; WCAG 1.4.8 sets 80 as a
ceiling; Dyson 2004 for screens). The time to reach a control grows with its distance (Fitts 1954), so a button pushed to the far
edge of a 1900 px box costs every use.
**The principle (ZANE-SPACEMEANING-01, confirmed and sharpened).** *Width belongs to the content.* A text block takes the reading
measure, 60 to 75 characters; a box takes its content's width plus its padding; width beyond that stays the page's background,
on the side away from where reading starts. A control sits beside the content it acts on. The space between two groups is at least
twice the largest space inside either, so space alone says what belongs together. Reading text starts at the frame's start edge,
never centred inside a wider frame.
**Checks**: K03 MEASURE, K04 BOX_FILL, K05 CONTROL_NEAR, K06 GROUP_RATIO.

### I · Ink and boxes that draw nothing (19)

**The default.** Sections are made with borders, cards, tiles, bands and widgets, and one fact is drawn twice. **Evidence**:
*"use a classical table format not cards, it's more direct and less stressing to me"* (Z269); *"a visual colored progress bar is just
a duplication"* (Z270); *"contain many squares, each attracting attention"* (Z283); *"PLEASE AVOID THIS VERTICAL WIDGET STYLE!!!"*
(Z282); *"what the hell of using horizontal lines everywhere????? why would we need them???"* (Z285); *"on trouve 3 fois le bouton
Vérifier et envoyer !!!"* (Z278).
**Theory.** Ink that carries no data is a cost the reader pays on every look (Tufte 1983, data-ink); two lines drawn to separate
create a third element, the band between them, which competes with the content (Tufte 1990, "1 + 1 = 3 or more"). Information said
twice in two forms raises the reader's load instead of lowering it (Chandler and Sweller 1991, the redundancy effect; Sweller 1988).
**The principle.** *A line or a box draws something real*: a table's structure, a field's edge, a drawing, a focus ring, the frame
of a UI sample, a code block. Running text is never boxed, carded or ruled; groups are made by space. One fact has one encoding.
**Checks**: K07 LINE_DRAWS, K06 GROUP_RATIO.

### E · Emphasis added, never budgeted (21)

**The default.** Each element gets its own emphasis (bold and underline and colour and a fill), colour marks identity or
decoration, and motion polishes. **Evidence**: *"having two red divs one under the other means we are not focusing on one critical
thing"* (Z231); *"hyperlinks are polluting the page with their intrusives underlines+bold"* (Z241); *"remove bold (underline + bold is
over focus)"* (Z245); *"dont polluate the UI with stronger strokes"* (Z244); *"there is a lot of blue and it's not beautiful"* (Z238);
smooth scrolling judged « troublant » (an NGO platform).
**Theory.** One item differing in one feature is found at once; when many items differ, none is (Treisman and Gelade 1980; the
isolation effect, von Restorff 1933). Emphasis is a budget, spent best at the smallest effective difference (Tufte 1997). Colour is
read as a code, so a colour used for decoration teaches a code that does not exist (Ware 2004). Motion in view is the strongest
distractor there is (Bartram, Ware and Calvert 2003).
**The principle.** *One emphasis per element, one critical element per view.* An element takes the emphasis its shape gives it and
no other. Data colour has the five semantic values of Rule 118 and one neutral, and nothing else. Motion only reports a change of
state the user caused, and never accompanies navigation.
**Checks**: K08 ONE_EMPHASIS, K09 PALETTE, K10 ONE_CRITICAL.

### B · Balance left to chance (12)

**The default.** Line breaks fall where the width happens to end, or are placed by hand and outlive their text; rows of controls
wrap with one item alone. **Evidence**: Z294, Z295, Z297 above; *"the page still have space move the last combo on the same line as
the others"* (Z296); *"'spatial equilibrium' ... they represent the same logical level"* (Z287).
**Theory.** The eye reads a figure as a whole and prefers the simplest, most regular one (the Gestalt law of Prägnanz; Arnheim
1954 on visual balance); a short last line is the typographer's widow, refused for that reason (Bringhurst 1992). Browsers balance
lines natively (CSS Text Level 4, `text-wrap: balance` and `pretty`), so the rule costs nothing when it is on by default.
**The principle.** *Balance is on for every text block, by default*, never for a list of element kinds: the last line of any block
is at least a third of its widest line, and a heading carries no break placed by hand. A row of controls that wraps comes out in
rows of equal size.
**Checks**: K11 BALANCE, K12 ROW_FULL.

### F · One form carrying two meanings (28)

**The default.** A form is chosen for its look: a card is a link, a fill marks both the selected entry and a button, a toggle names
the state it is not in, a word like "Remove" means "leave out". **Evidence**: *"this button is confusing ... make the two states
visible"* (Z135); *"On this page seems like a clickable option in the menu"* (Z144); *"change the theme of the internal buttons to
avoid visual collision with the top menu buttons"* (Z146); *"Remove here is misleading and can be understood as removing the
file!"* (Z147); *"leave only one thing and one place and one link to click!!"* (Z149); *"there absolutely no meaning to a button
that brings the reader to the section that it is right under it !!!"* (Z142).
**Theory.** A signifier tells the user what can be done and where (Norman 2013); a form that signifies two acts breaks the mapping
between what is seen and what happens (Norman and Draper 1986, the gulf of execution). Consistency is the first of Shneiderman's
eight rules (1987) and the fourth of Nielsen's heuristics (1994), and WCAG asks that one function be identified one way (3.2.4).
Consistency with what users already know matters as much as consistency inside the product (Grudin 1989).
**The principle.** *One shape, one meaning.* Four shapes and four meanings (section 4.3): an **action** is a button whose label is a
verb; **navigation** is a word or a menu entry; a **state** is a tag that never reacts; an **input** is a field with a visible edge.
A container never reacts to the pointer. A two-state control shows both states.
**Checks**: K16 SHAPE, K08 ONE_EMPHASIS.

### N · Navigation that does not mirror the tree (35)

**The default.** Menus grow by addition, levels collapse into one row or stack into three, a child repeats its parent's label, a
page lives only in the footer, and a trail repeats bars already in view. **Evidence**: *"This kind of deep menu options is not good
for readability and for the reader to make a knowledgeable mental model"* (Z102); *"Why did you remove the second horizontal menu
bar? Like that we lose a level"* (Z103); *"the same menu option in the main and submenu levels (like Try and then Try here)!!!"*
(Z118); *"You misutertood me ... I need you to deal with menu strcture as a logical apsect"* (Z119); *"remove this path from all pages
it's not necessary since we have just two levels"* (Z120); *"add 'On this page' here and all the pages where there are many
sections"* (Z121).
**Theory.** A reader forages by the scent of labels, and a label that repeats its parent carries no scent (Pirolli and Card 1999).
Choice time grows with the number of options (Hick 1952), and broad, shallow menus beat deep ones up to a point (Kiger 1984). The
user builds a conceptual model from what the interface shows (Norman 2013); a menu that misstates the tree builds a wrong one.
WCAG asks for navigation that repeats in the same order (3.2.3) and for the user's location to be shown (2.4.8).
**The principle.** *The menu is the tree.* Rule 116 at v3.16 and the four levels of Rule 120 hold: at most five entries a bar; a
section's landing page first in its band under a label of its own; no label twice in what a page shows; every page on exactly one
bar; a trail only where a level is not already shown; an outline on the right, by default, on every page of three or more sections.
**Checks**: K18 NAV_TREE (the existing menu, trail and path checks, plus the outline default).

### L · What matters is hidden, volatile or scrolled inside the page (22)

**The default.** Information goes into a layer that appears on hover, a panel that scrolls inside the scrolling page, a box that
scrolls sideways, a widget that floats over the text, or a click that changes nothing visible. **Evidence**: *"it adds a second
vertical scroll bar which is forbidden"* (Z219); *"never use a horizontal scroll bar on an image or code snippet!"* (Z220); *"avoid
info bulles altogethor because they complexify the redaing by a volatile additional layer!"* (Z221); *"a proper well made table without
a scroll (to avoid having two scrolls along with the scroll of the browser)"* (Z224); *"When i click 'Run the kernel' i get nothing"*
(Z217).
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

**The default.** The design is made and judged with a mouse on a desktop. **Evidence**: *"did you think how this hover feature would
work on a mobile phone?!"* (Z311, after four rulings of the same feature on a desktop); a restaurant app's touch targets, overflow
and back button, found on a real phone (2026-07-03).
**Theory.** A thumb's target needs about 9 mm (Parhi, Karlson and Bederson 2006); WCAG sets 24 by 24 CSS pixels as the minimum
(2.5.8) and 44 by 44 as the enhanced level (2.5.5), which is also the platforms' own figure. Most phone use is one-handed (Hoober
2013). A touch screen has no hover at all (Media Queries 4: `hover: none`). Inclusive design treats a situational limit, one hand
on a bus, as a design input (Microsoft 2016).
**The principle.** *Every input reaches everything.* Every hover has a tap path (the first tap selects and shows, the second opens);
targets are 44 px at phone widths and 24 px elsewhere; the keyboard reaches everything in reading order with a visible focus; the
words say "tap" where a tap is meant.
**Checks**: K17 TARGET, K15 NO_HOVER_ONLY.

### W · Words written for the writer, not the reader (45)

**The default.** Narrative, metaphor and jargon, dense paragraphs, and concepts explained in prose without being shown.
**Evidence**: *"i todl you befeore several time to avoid the narrative, sucinet, non declarative style of writing"* (Z037);
*"not anyone has the ability to get the link between a metaphoric concept and the practical thing of a technology"* (Z010); *"Avoid
dense writings like this ... people today don't have time to read. this is also better for agents to grasp."* (Z043); *"examples
must be everywhere in the site"* (Z015); *"I saw the result page but i need a didactic explanation"* (Z042); « on n'est pas au
Silicon Valley, on est à Niamey » (Z014).
**Theory.** A cooperative speaker says as much as needed and no more, plainly and in order (Grice 1975). Readers of screens scan:
text made concise, scannable and objective measured 124% more usable than the same content as prose (Morkes and Nielsen 1997).
Working memory holds about four chunks (Cowan 2001), and a definition the reader must infer costs load the content did not need
(Sweller 1988). Plain language is now a standard (ISO 24495-1:2023). Learning is fastest from doing and from worked examples
(Carroll 1990).
**The principle.** *Words serve the reader, and a concept is shown, not described.* The register of WRITING.md holds (declarative
full sentences, the subject named first); a lead line and labelled points replace a dense paragraph; every UI concept is shown as a
live sample (section 4.4, the sample frame); a term is defined at its first use.
**Checks**: K19 REGISTER, K20 SAMPLE.

### M · The page speaks for its maker, not its reader (28)

**The default.** The page reports the project's process and history: what has not been done, the retired lineage, internal names,
implementation details, a call to action placed for the maker's agenda. **Evidence**: *"Avoid this role of transparency that hurts the
project image (negative markeing)! ... I raised this before but you seem to persist on it"* (Z173); *"do not let the tendency to be
transparent and fair make the statements elusive"* (Z160); *"No Haro has nothing to do with Ring and must no mention it!"* (Z177);
*"I find this call to action to be mis-placed! because it interrupts the logical flow fo reading"* (Z170); *"why are you proposing
Softanza related subjects to others who would adopt the solution?!"* (Z175).
**Theory.** The same fact framed as a lack or as a gain is judged differently (Tversky and Kahneman 1981), so a page that lists
absences is read as weaker than one that states the same scope affirmatively. A first impression forms in 50 ms (Lindgaard et al.
2006). The system should speak the users' language, not its own (Nielsen 1994, heuristic 2).
**The principle.** *The page speaks for its reader.* Every public page states what the project is and does, affirmatively and at its
true size (PRINCIPAL-AFFIRM-01); the front page and each landing follow the README's order (one sentence on what it is, why it
exists, what it is in a table, what is here); an action follows the understanding it needs; internal names and lineage stay in the
repository.
**Checks**: K19 REGISTER (the affirmative and naming checks already in site-shell), K21 ARCHETYPE.

### P · The model is checked, not the paint (41)

**The default.** A green test on the producer's model stands in for a look at what is painted or heard. **Evidence**: four sound
defects heard by the Principal while every guard was green (*"the voice is so quick I could not recognise what it says"*, Z047;
*"the sounds are not synchronised, the text runs ahead"*, Z050); maps rendered upside down; labels on arrowheads and wires; *"look at
the e trancated from the coulum text !!!"* (Z081); *"please always show to me visual examples i can see"* (Z078); an ornament hidden
below 1120 px, which is the Principal's window width (Z082).
**Theory.** The gulf of evaluation is the distance between what the system did and what the person can perceive it did (Norman and
Draper 1986); only the perceived result closes it. Sound and its picture are perceived as one event only within a narrow window,
45 ms early to 125 ms late (ITU-R BT.1359). The estate's own law says a comparison proves sameness, never rightness
(`protocol/PERCEPTION.md`).
**The principle.** *The painted page is the instrument.* Every check in section 5 runs on the rendered page, in both cultures, at the
widths readers use (375, 768, 1085, 1440 and 1900 px; 1085 is the Principal's window); a change a person perceives ships an artefact
a person can open, and the perception is recorded with its verdict.
**Checks**: all of K01 to K17 run on the paint; the perceptual row is the gate no check replaces.

### X · A decision already made is replaced by a default (12)

**The default.** The generator's own default overrides a decision the house already made: the platform's blue, a pattern invented
instead of the house's, a sibling site copied blindly, the author's text rewritten, a change nobody asked for. **Evidence**: *"the
selected background of the combo should embrace the current theme ... not the standard browser them (that ugly blue)"* (Z306);
*"checkboxes should be in green not blue in this retro mode!"* (Z308); *"this navigation system is not ours!"* (Z309); *"why did you
make Start with a coloured background? don't change things without notifying me"* (Z302); *"I never asked you to make the labels
of the slices clickable!!!"* (Z307); *"bring back this same text"* (Z305).
**Theory.** Users need to feel in control of the interface, not managed by it (Shneiderman 1987, rule 7; Nielsen 1994, heuristic 3).
Expertise rests on spatial and visual stability: a control that moves or changes look resets what the user learned (Scarr,
Cockburn, Gutwin and Quinn 2011).
**The principle.** *Decided stays decided.* The house's components are reused, never re-invented; no state of any control is left
to the platform (the culture's tokens paint checkboxes, radios, the open select, the selection and focus); a change that was not
asked for is named in the report before it ships; the author's words are kept as written.
**Checks**: K09 PALETTE, K21 ARCHETYPE.

## 4. The design system

The system serves Zane's bounded domain: intent-driven interfaces for business applications and the sites that explain them. It
applies first to the Zane site (milestones 2 and 3) and is written so a generator can follow it on any Softanza site.

### 4.1 Thirteen principles, one per cause

| | principle | bounds |
|---|---|---|
| T | Every text is set for reading | six sizes; floor 18 px; 7:1; a title at most 1.7 times the reading size |
| S | Width belongs to the content | measure 60-75 characters; a box at most a third empty; a control beside its content; between-group space at least twice the inside space |
| I | A line or a box draws something real | lines only on tables, fields, drawings, focus, samples and code |
| E | One emphasis per element, one critical element per view | five semantic colours and one neutral for data; motion only reports |
| B | Balance is on by default | last line at least a third of the widest; control rows equal |
| F | One shape, one meaning | four shapes; containers never react |
| N | The menu is the tree | five entries a bar; landing first under its own label; outline on pages of three or more sections |
| L | Everything is on the page, with one scroll | no tooltip; no hover-only content; no inner scroll; feedback within 100 ms |
| H | Every input reaches everything | every hover has a tap; 44 px on phones, 24 px elsewhere |
| W | Words serve the reader; a concept is shown | declarative register; points over dense paragraphs; a live sample per concept |
| M | The page speaks for its reader | affirmative; README order; the action after the understanding |
| P | The painted page is the instrument | five widths, two cultures; a perception recorded |
| X | Decided stays decided | no platform default; house components; changes named |

### 4.2 Tokens: 42 per culture, 19 of which a culture may set

Every value the stylesheet uses comes from a token. **Fixed** tokens hold in both cultures; **culture** tokens are set by Modern and
Retro (Article VI), always under the same name and meaning.

| family | token | value | fixed or culture | closes |
|---|---|---|---|---|
| type (13) | `--size-small` | 1.125rem (18 px): labels, captions, table heads, code, footer | fixed | T |
| | `--size-reading` | 1.25rem (20 px), the site's reading size today; the estate's value once PRINCIPAL-READSIZE-01 is ruled | fixed | T |
| | `--size-lead` | 1.375rem (22 px): the page's lead | fixed | T |
| | `--size-section` | 1.6rem: section titles | fixed | T |
| | `--size-title` | 2.1rem: the page title (1.68 times the reading size) | fixed | T |
| | `--size-hero` | up to 2.6rem: the front page's hero only | fixed | T |
| | `--weight-regular`, `--weight-strong` | 400 and the heading weight; no third | fixed | E |
| | `--leading-reading`, `--leading-title` | 1.7 and 1.2 | fixed | T |
| | `--measure-min`, `--measure-max` | 60ch and 75ch | fixed | S |
| | `--font` | sans (Modern), mono (Retro) | culture | — |
| space (5) | `--space-1` to `--space-4` | .5rem inside a component, 1rem between items, 2rem between groups, 4rem between regions | fixed | S, I |
| | `--gutter` | 1.4rem from any container's edge to its text | fixed | S |
| colour: chrome (10) | `--paper`, `--surface` | the page; the frame of a sample or a code block | culture | E |
| | `--ink`, `--ink-2` | text; secondary text, still 7:1 | culture | T |
| | `--line`, `--edge` | a hairline that draws (tables, drawings); a field's edge, 3:1 | culture | I, F |
| | `--link` | navigation | culture | F |
| | `--action`, `--on-action` | the one primary action of a view, and its label at 7:1 | culture | F |
| | `--focus` | the focus ring | culture | H |
| colour: data (6) | `--success`, `--warning`, `--danger`, `--info`, `--muted` | Rule 118's five semantic values | culture | E |
| | `--meta` | the one neutral for channels, types and categories | culture | E |
| form (4) | `--hairline`, `--ring` | 1 px; 2 px | fixed | I, H |
| | `--radius`, `--shadow` | 8 px and one resting shadow (Modern); 0 and none (Retro) | culture | — |
| touch (2) | `--target-phone`, `--target` | 44 px at widths up to 760 px; 24 px elsewhere | fixed | H |
| motion (2) | `--motion-report`, `--motion-nav` | 150 ms for a state the user changed; 0 for navigation | fixed | E, L |

The two stylesheets declare **20 distinct font sizes** today (`site/stz.css` and `site/gotchas.css`) and the tokens allow six. Code
highlighting takes its colours from these tokens and adds no hue (a decision for the Principal, section 7).

### 4.3 Four shapes, four meanings

| meaning | shape | at rest | under pointer or focus | never |
|---|---|---|---|---|
| **action** | a button: a verb, in a box; the view's one primary action filled with `--action`, the others outlined | the box | the focus ring | a link's look; a noun or a state as its label ("Dense view", "Remove" for "leave out") |
| **navigation** | a word in `--link`, or a menu entry; the current entry marked in ink and weight | the word | underline (and see section 7) | a fill; bold and underline together; a card |
| **state** | a tag: the semantic colour's text on its pale tint, with a full-colour edge | the tag | nothing: a state never reacts | a cursor; a click |
| **input** | a field with a visible `--edge`; a check, radio or select in the culture's colours; a two-state control showing both states | the field | the focus ring | the platform's blue; a toggle that names the other state |

A container (a section, a row, a sample frame) is none of the four and never changes under the pointer.

### 4.4 Components: twenty-one, a closed list

| component | what it is for | its rules | closes |
|---|---|---|---|
| **bar** | the main menu | brand, then at most five entries with a visible rule between them and space after the brand; the theme select and GitHub at the right | N, B |
| **band** | a section's pages | horizontal, fixed under the bar; the landing first under its own label | N |
| **side list** | a family's pages, or the page's outline | on the right; its heading in `--ink-2`, regular weight, apart by space; an outline by default on pages of three or more sections | N, F |
| **trail** | the path, where a level is not already shown | only then | N, I |
| **page head** | kicker, title, lead | the kicker names the section; the title is one declarative sentence, balanced; the lead's first sentence defines the subject | W, B |
| **section** | a part of a page | its title says what it holds | W |
| **paragraph** | running text | at the measure; at most about 60 words | W, S |
| **points** | a list that explains | a lead line, then items, each a strong label and one sentence | W, I |
| **table** | records and comparisons | a header row; the thing, then its state, then the action ("Nothing" when none); never scrolls; the action column goes last | I, L, N |
| **sample frame** | a live UI sample | a frame drawn as a browser or an application window, holding real HTML; lawful and offending side by side when they compare; a caption that cites the rule number and states the verdict with a state tag | W, M, P |
| **code block**, **terminal block** | code and runs | `--surface`, sized to the content, wrapping, lines written to 72 characters | L, S |
| **figure** | a drawing | scales to the column; labels at `--size-small` or more; named by `<desc>` | T, L |
| **button**, **link**, **tag**, **field** | the four shapes of section 4.3 | as there | F |
| **notice** | the result of an act | a line in the page's flow, in a semantic colour, appearing within 100 ms | L |
| **footer** | the project line | one line: the project, ©2020-the current year Mansour Ayouni, MIT, the Softanza link; `--size-small`, regular, `--ink-2` | M, E |
| **hero** | the front page only | the photograph; a panel as wide as its content, holding a tagline and one line that does not repeat it | S, M |
| **slide** | the tour | one message, one sample, at most three lines | W |

### 4.5 Archetypes: six page shapes

Every page declares its archetype, and its regions appear in the archetype's order.

| archetype | pages | order of regions |
|---|---|---|
| **front** | `index.html` | hero; one sentence on what Zane is; why it exists; what it is, in a table; what is here, as links |
| **landing** | each section's first page | page head; the same four steps at the section's scale; the section's pages in a table, one line each |
| **article** | a concept page | page head; outline (three or more sections); for each section: a statement, a sample frame (lawful beside offending), points |
| **reference** | the Reader, rules, conformance | page head; one table |
| **tool** | the UI audit, Try, Build | page head; controls in the page's flow, beside what they act on; a notice; the result as a table |
| **deck** | the tour | slides |

### 4.6 What the generator may vary, and what it may not

| may vary | may not vary |
|---|---|
| the words, within the register | a size, a space, a weight, the measure, a target size |
| a culture's colours, font, radius and shadow, under the tokens' names | the meaning of a colour; a sixth status colour; a hue outside the tokens |
| the number of sections, rows and samples | the order of an archetype's regions; the four shapes and their meanings |
| which component holds which content, within the list | a component outside the list; a navigation pattern of its own |
| the hero's photograph | a box wider than its content; a line that draws nothing; a second scroll; a tooltip; a hover-only reveal |
| | a platform default in any state of any control |

### 4.7 The same quality to see, to touch and to hear

| sense | what holds |
|---|---|
| **see** | sections 4.1 to 4.6 |
| **touch** | 44 px targets at phone widths, 24 px elsewhere; every hover has a tap path; nothing depends on hover; the keyboard reaches everything in reading order with a visible ring; Esc closes what the user opened |
| **hear** | sound corroborates a state already visible and never acknowledges a click (Rule 125); it plays at its true rate, in step with its text within ITU-R BT.1359's window (45 ms early, 125 ms late); each semantic value has one earcon whose urgency follows the value (Edworthy, Loxley and Dennis 1991); nothing plays on its own |
| **an agent** | the same structure a person sees is readable by an agent: landmarks, one title, headings in order, table headers, labelled fields (Rule 104; the user is a person or an agent) |

## 5. The checks: every rule read on the painted page

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
| K09 PALETTE | every computed colour, including `accent-color`, the open select and the focus ring | a colour outside the culture's tokens | E, X | new |
| K10 ONE_CRITICAL | the view | more than one element in `--danger` | E | new |
| K11 BALANCE | every text block | the last line shorter than a third of the widest; a break placed by hand in a heading | B | the heading check exists in site-shell; the measure is new |
| K12 ROW_FULL | every wrapped row of controls | rows that differ by more than one item | B | new |
| K13 ONE_SCROLL | every element | anything but the document scrolls, either way | L | sideways scroll with room exists (Rule 114); the rest is new |
| K14 NO_FLOAT | fixed and absolute elements | one covers text and is not a bar holding its own space | L | the bars check exists; the overlap is new |
| K15 NO_HOVER_ONLY | attributes and stylesheets | a `title` attribute; a `:hover` rule that shows, hides or changes another element | L, H | the `title` check exists in site-shell; the stylesheet read is new |
| K16 SHAPE | interactive and pointer-styled elements | a pointer on something that is not a link, button, field or label; a container that reacts under a link; the action fill on a non-button | F | new |
| K17 TARGET | every interactive element | under 44 by 44 px at 375 px, or under 24 by 24 px elsewhere | H | new |
| K18 NAV_TREE | the menu, band, trail, path and outline | Rules 108, 115, 116 and the menu's three faults; a page of three or more sections without an outline | N | exists, with the outline default new |
| K19 REGISTER | the files | the writing, affirmative and naming checks; a paragraph over about 70 words | W, M | exists, with the paragraph length new |
| K20 SAMPLE | article pages | a concept section without a sample frame citing a rule number | W | new (milestone 3) |
| K21 ARCHETYPE | every page | no declared archetype, or regions out of its order | M, X | new |

**Sixteen checks are new and five extend checks that exist.** None of them is a list of element kinds: each reads every element
that has the property it judges.

## 6. Law amendments the system implies (proposed, not applied)

Article VII asks for proof that a harm is real and recurring; the corpus is that proof, with its record numbers. Each row is a
proposal for the Principal to rule through Central; nothing here enters `rules.json` before that. Docket items still open (Pass 5,
F-1 to F-5) are folded in where they belong.

| # | rule | the change | evidence |
|---|---|---|---|
| 1 | 105 The Legibility Floor | the floor becomes 18 px for every text, and 7:1 for every text including control labels; rank by the token scale, never by shrinking | T, 26 corrections in 12 projects (Z178-Z203) |
| 2 | new, Article I | **Width Belongs to the Content**: measure 60-75 characters; a box at most a third empty; a control beside its content (ZANE-SPACEMEANING-01; docket F-3) | S, 20 (Z247-Z266) |
| 3 | 2 White Space Is Structural | **space groups and a line draws something real**: the gap between groups at least twice the gap inside; borders only where they draw (ZANE-NOLINES-01, ZANE-READINGLEVELS-01) | I, 19 (Z267-Z285), and S |
| 4 | new, Article I | **One Emphasis per Element, One Critical per View** (ZANE-ONEEMPHASIS-01; Rules 3, 87, 118 cross-cited) | E, 21 (Z226-Z246) |
| 5 | new, Article I | **Balance Is On by Default**, never for a list of element kinds; control rows equal (docket F-1; ZANE-LINEBALANCE-01; ZANE-CONTROLROW-01) | B, 12 (Z286-Z297) |
| 6 | 114 Room Before Scrollbars | widened to **One Scroll**: nothing scrolls inside the page in either direction; a sheet freezes the page under it | L, the scroll records (Z210, Z212, Z219, Z220, Z224) |
| 7 | 69 The Hand Is Not a Mouse | **every hover has a tap path; no content only on hover; no tooltip** (ZANE-TOUCHTWIN-01; WRITING.md rule 11 enters the law) | H and L (Z221, Z311) |
| 8 | 119 A Card Is Not a Button | widened to **One Shape, One Meaning**: four shapes; a container never reacts; one fill, one meaning (ZANE-ONELINK-01) | F, 28 (Z122-Z149) |
| 9 | 108, 115, 116 | the trail check reads any path line, a kicker included (ZANE-TRAIL-KICKER-01); an outline by default on pages of three or more sections (ZANE-OUTLINE-01) | N, 35 (Z087-Z121) |
| 10 | Article VI, as a rule of tier `tool` | **A Culture Owns Its Defaults**: no state of any control is left to the platform | X (Z306, Z308) and Article VI's own evidence |
| 11 | 111 The Stranger's First Screen | the README order for a front page and a landing; affirmative voice on every public surface (PRINCIPAL-AFFIRM-01; docket F-2, F-4, F-5) | M, 28 (Z150-Z177), and W, 45 (Z001-Z045) |
| 12 | 125 Sound Corroborates | sound plays at its true rate and in step with its picture within the ITU-R BT.1359 window | P, the four sound records (Z047-Z050) |
| 13 | Article VII | **a correction enters the law as its cause, bounded on both sides, with a check on the painted result by default for every element** | the chains of section 1; 148 of 311 corrections name an earlier one |

## 7. What the Principal decides before milestone 2

One question with four parts; each part names the system's recommendation.

- **(a) The reading size**: 20 px, the Zane site's size since 2026-11-04, or 21 px, Lookout's since 2026-11-09 (PRINCIPAL-READSIZE-01,
  already routed). The token holds whichever is ruled.
- **(b) A link in running text**: the browser's plain underline at rest (recommended: it does not depend on hover, which a phone does
  not have, and it is Lookout's latest ruling), or the colour at rest and the underline under the pointer (the Zane site's ruling of
  2026-11-06).
- **(c) The footer at the 18 px floor**, replacing harobanda's smaller footer of 2026-09-28 (recommended: one floor everywhere).
- **(d) Code highlighting from the tokens**, four roles (comment, keyword, string, verdict) instead of today's eight hues
  (recommended).

## 8. What milestones 2 and 3 do with this

**Milestone 2** writes the tokens into one stylesheet, rebuilds the components on them, adds K01 to K21 (K20 with milestone 3) to the
UI audit and to site-shell in JS and Zig with parity, and shows each new check failing on today's pages first, with the count.
**Milestone 3** rewrites the site on the archetypes: a Why section first in the main menu, the front page and every landing in the
README's order, and every concept shown as a live sample, the lawful beside the offending, citing its rule. The Why section states
the problem from this corpus: 311 corrections in 20 projects, 148 of them naming an earlier one.

## 9. Sources

- Accot, J. and Zhai, S. (1997). Beyond Fitts' law: models for trajectory-based HCI tasks. *CHI '97*, 295-302.
- Arnheim, R. (1954). *Art and Visual Perception*. University of California Press.
- Bartram, L., Ware, C. and Calvert, T. (2003). Moticons: detection, distraction and task. *International Journal of Human-Computer Studies* 58(5), 515-545.
- Bringhurst, R. (1992). *The Elements of Typographic Style*. Hartley and Marks.
- Carroll, J. M. (1990). *The Nurnberg Funnel: Designing Minimalist Instruction for Practical Computer Skill*. MIT Press.
- Chandler, P. and Sweller, J. (1991). Cognitive load theory and the format of instruction. *Cognition and Instruction* 8(4), 293-332.
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
- Norman, D. A. and Draper, S. W., eds. (1986). *User Centered System Design*. Lawrence Erlbaum.
- Palmer, S. E. (1992). Common region: a new principle of perceptual grouping. *Cognitive Psychology* 24(3), 436-447.
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
