#!/usr/bin/env node
'use strict';
/* ==========================================================================
   site-shell.js -- the one definition of the site's navigation.

     node tools/site-shell.js            check: every page carries exactly the shell this file renders
     node tools/site-shell.js --write    render the shell into every page

   doc/design/SITE-2.md and SITE-3.md decide the shape: a main menu of FIVE entries (Rule 27), Approach, Language, Law, Use, Try; under it, fixed with it, a
   band of the section's pages, five at most (Rules 27, 120); a vertical list on the left ONLY where a page
   has a family (level 3), and the page then takes the full width; and a visually hidden Breadcrumb landmark
   on every page (Rule 108). The same band is on every page of its section, the same list on every page of
   its family (Rule 115). Menus, bands, lists and landmarks written by hand would drift; this file is the only
   place they are written, and the check fails when a page differs from it. The regions it owns are fenced:

       <!-- shell:menu --> ... <!-- /shell:menu -->      the two sticky bars (the menu and the band)
       <!-- shell:trail --> ... <!-- /shell:trail -->    the hidden Breadcrumb landmark
       <!-- shell:layout --> ... <!-- /shell:layout -->  the opening of the layout, holding the level-3 list where there is one
       <!-- shell:footer --> ... <!-- /shell:footer -->  the footer: links, the style select, the licence line

   Every page of the site is on a bar (SITE-3.md section 3.4): the check below fails a page the registry does not list, a
   page no bar lists, and a footer link to a page the bars do not list.

   Every page names its subject (doc/design/WRITING.md): the check fails a page whose h1, or the first sentence of whose lead,
   lacks the page's subject term, and a page that has no term and is not on the list still to be rewritten. And no title places a
   line break by hand: the check fails a heading that holds a <br> or a block, and a stz.css that stops balancing titles.

   A page that does not have the fences yet is migrated by --write from the markup the old site used.
   The pages outside the shell proper, the Reader and the UI audit tool, take the menu and the trail
   only; the rest of their markup is not touched.
   ========================================================================== */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const ROOT = path.join(__dirname, '..');

/* The four files every page shares. Their address carries the first 8 hex of the sha256 of their content, read with LF line
   ends so the hash is the same on every checkout. A changed file changes its address: nothing to remember, and a returning
   reader is never served an older stylesheet under a newer page. Written by --write, and the check fails on any page whose
   query differs from the file's hash. */
const ASSETS = ['stz.css', 'stz.js', 'gotchas.css', 'law-numbers.js', 'tour.js'];
const assetHash = name => crypto.createHash('sha256').update(fs.readFileSync(path.join(ROOT, 'site', name), 'utf8').replace(/\r\n/g, '\n')).digest('hex').slice(0, 8);
const ASSET_RE = new RegExp('((?:href|src)=")([^"?]*?(' + ASSETS.map(a => a.replace('.', '\\.')).join('|') + '))(?:\\?v=[0-9a-f]{8})?"', 'g');

/* ---- the structure --------------------------------------------------------------------------- */
const SECTIONS = [
  { id: 'approach', label: 'Approach', head: 'site/thinking.html' },
  { id: 'language', label: 'Language', head: 'site/how.html' },
  { id: 'law', label: 'Law', head: 'site/why.html' },
  { id: 'use', label: 'Use', head: 'site/adopt.html' },
  { id: 'try', label: 'Try', head: 'site/audit.html' }
];
/* A page's label is the one name it goes by in the menu, the rail and the trail (Rule 116). The head page
   of a section is named after the section; what the page is about is its kicker and its title. */
const FAMILIES = [['stillness', 'Stillness'], ['forms', 'Forms'], ['state', 'State'], ['widgets', 'Widgets'],
                  ['reading', 'Reading'], ['navigation', 'Navigation'], ['intelligence', 'Intelligence']];
/* each family page's subject term (doc/design/WRITING.md section 2) */
const FAMILY_TERMS = { stillness: 'still', forms: 'form', state: 'state', widgets: 'widget', reading: 'read', navigation: 'navigat', intelligence: 'intelligen' };
const PAGES = [
  { file: 'index.html', home: true, term: 'Zane' },
  { file: 'site/thinking.html', section: 'approach', label: 'Approach', rail: true, term: 'approach' },
  { file: 'site/grid.html', section: 'approach', label: 'The grid', rail: true, term: 'grid' },
  { file: 'site/media.html', section: 'approach', label: 'Channels', rail: true, term: 'channel' },
  { file: 'site/positioning.html', section: 'approach', label: 'Comparison', rail: true, term: 'compar' },
  { file: 'site/practices.html', section: 'approach', label: 'Practices', parent: 'site/positioning.html', rail: true, term: 'practice' },
  { file: 'site/frameworks.html', section: 'approach', label: 'Frameworks and languages', parent: 'site/positioning.html', rail: true, term: 'framework' },
  { file: 'site/innovation.html', section: 'approach', label: 'Claims', rail: true, term: 'claim' },
  { file: 'site/how.html', section: 'language', label: 'Language', rail: true, term: 'language' },
  { file: 'site/refusal.html', section: 'language', label: 'What it refuses', rail: true, term: 'refus' },
  { file: 'site/haro.html', section: 'language', label: 'Declared in Haro', rail: true, term: 'Haro' },
  { file: 'site/conformance.html', section: 'language', label: 'Conformance', rail: true, term: 'conform' },
  { file: 'site/why.html', section: 'law', label: 'Law', rail: true, term: 'law' },
  { file: 'site/rules.html', section: 'law', label: 'The rules', rail: true, term: 'rule' },
  { file: 'constitution/reader/index.html', section: 'law', label: 'The Reader', rail: true, outside: 'reader', term: 'Reader' },
  { file: 'site/gotchas/index.html', section: 'law', label: 'What a violation feels like', rail: true, term: 'violation' },
  ...FAMILIES.map(([f, label]) => ({ file: `site/gotchas/${f}.html`, section: 'law', label, parent: 'site/gotchas/index.html', rail: true, term: FAMILY_TERMS[f] })),
  { file: 'site/vibes.html', section: 'law', label: 'Two cultures, one truth', rail: true, term: 'culture' },
  { file: 'site/adopt.html', section: 'use', label: 'Use', rail: true, term: 'use' },
  { file: 'site/web.html', section: 'use', label: 'Web apps', rail: true, term: 'web' },
  { file: 'site/mobile.html', section: 'use', label: 'Mobile apps', rail: true, term: 'mobile' },
  { file: 'site/beyond.html', section: 'use', label: 'Beyond screens', rail: true, term: 'screen' },
  { file: 'site/stack.html', section: 'use', label: 'Your stack', rail: true, term: 'stack' },
  { file: 'site/build.html', section: 'use', label: 'Build', parent: 'site/stack.html', rail: true, term: 'build' },
  { file: 'site/generate.html', section: 'use', label: 'Generate', parent: 'site/stack.html', rail: true, term: 'generat' },
  { file: 'site/softanza.html', section: 'use', label: 'Softanza', parent: 'site/stack.html', rail: true, term: 'Softanza' },
  { file: 'site/ports.html', section: 'use', label: 'Other languages', parent: 'site/stack.html', rail: true, term: 'other language' },
  { file: 'site/audit.html', section: 'try', label: 'Try', rail: true, term: 'try' },
  { file: 'site/tour.html', section: 'try', label: 'The tour', rail: true, term: 'tour' },
  /* outside the shell proper: the UI audit tool and the Reader keep their own pages and styles and take the menu, the band and the trail (the tool also the footer) */
  { file: 'tools/ui-audit.html', section: 'try', label: 'UI audit', rail: true, outside: 'tool', term: 'audit' },
  { file: 'site/screenshots.html', section: 'try', label: 'Screenshots', rail: true, term: 'screenshot' },
  /* the wasm's proof page (stage S3 of the binary): a tool, framed as the UI audit is */
  { file: 'tools/zane/wasm-proof.html', section: 'try', label: 'Wasm proof', rail: true, outside: 'tool', term: 'wasm' }
];
const by = new Map(PAGES.map(p => [p.file, p]));
/* The pages written before doc/design/WRITING.md, which the register check has not yet judged. Each is printed by name on every
   run, and leaves this list when it is rewritten and gains its term. A page with no term and not on this list fails. */
const WRITING_PENDING = [];
const sec = id => SECTIONS.find(s => s.id === id);

const rel = (from, to) => {
  const r = path.posix.relative(path.posix.dirname(from), to);
  return r === '' ? path.posix.basename(to) : r;
};
const href = (from, to) => {
  if (to === 'site/gotchas/index.html') { const r = rel(from, to).replace(/index.html$/, ''); return r === '' ? './' : r; }
  return rel(from, to);
};
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');

/* ---- the renderers --------------------------------------------------------------------------- */
function menu(p) {
  const cls = p.outside === 'reader' ? 'topnav' : 'site';
  const here = p.section;
  const links = SECTIONS.map(s => {
    const on = s.id === here;
    return `    <a${on ? ' class="here" aria-current="true"' : ''} href="${href(p.file, s.head)}">${s.label}</a>`;
  }).join('\n');
  const wrapOpen = p.outside === 'reader' ? '' : '  <div class="wrap">\n';
  const wrapClose = p.outside === 'reader' ? '' : '  </div>\n';
  /* the links sit in their own row, which may scroll sideways on a narrow screen; the style select is in the footer (SITE-3.md 5.1) */
  const row = p.outside === 'reader' ? '' : '    ';
  const menuOpen = p.outside === 'reader' ? '' : '    <div class="menu">\n';
  const menuClose = p.outside === 'reader' ? '' : '    </div>\n';
  const bar = `<nav class="${cls}" aria-label="Main menu">
${wrapOpen}${menuOpen}${row}    <a class="brand" href="${href(p.file, 'index.html')}">Zane</a>
${links}
${menuClose}${wrapClose}</nav>`;
  const b = band(p);
  if (p.outside === 'reader') return bar + (b ? '\n' + b : '');
  return `<div class="bars">\n${bar}${b ? '\n' + b : ''}\n</div>`;
}
/* Rule 106 (v3.13) allows the two-state control as a select: both states are options, the current one is the one shown. It is in the footer,
   at the right (SITE-3.md 5.1), and stz.js binds it. */
function stylePicker() {
  return `<div class="vibe-picker" title="Two equivalent interaction cultures, not a skin: the same truth, read another way (Article VI). Keyboard: F2">
        <label for="vibe-select">Style</label>
        <select id="vibe-select">
          <option value="curator">Modern</option>
          <option value="guardian">Retro</option>
        </select>
      </div>`;
}
function chain(p) {
  const out = [];
  if (p.parent) { const up = by.get(p.parent); out.push(up); }
  return out;
}
function trail(p) {
  if (p.home) return '';
  const s = sec(p.section);
  const steps = [{ label: 'Zane', to: 'index.html' }];
  const head = by.get(s.head);
  if (head !== p) steps.push({ label: head.label, to: head.file });
  if (p.parent) { const up = by.get(p.parent); if (up !== head) steps.push({ label: up.label, to: up.file }); }
  const links = steps.map(x => `<a href="${href(p.file, x.to)}">${esc(x.label)}</a>`).join('<span class="sep">›</span>');
  return `<nav class="crumbs trail-hidden" aria-label="Breadcrumb">${links}<span class="sep">›</span><span class="here-crumb" aria-current="page">${esc(p.label)}</span></nav>`;
}
/* Level 2: the pages of a section, in one horizontal band under the menu, fixed with it. At most five (Rule 27). Drawn only where
   a section has at least two pages; a band of one entry says nothing. Identical on every page of the section (Rule 115). */
function bandOf(sectionId) {
  const top = PAGES.filter(p => p.section === sectionId && p.rail && !p.parent);
  return top.length >= 2 ? top : null;
}
for (const sct of SECTIONS) { const t = PAGES.filter(q => q.section === sct.id && q.rail && !q.parent); if (t.length > 5) throw new Error('Rule 27: the band of ' + sct.id + ' has ' + t.length + ' entries, five at most'); }
function band(p) {
  if (p.home || !p.section) return '';
  const top = bandOf(p.section);
  if (!top) return '';
  const items = top.map(q => {
    const on = q === p || (p.parent && by.get(p.parent) === q);
    return `    <li><a${on ? ' aria-current="' + (q === p ? 'page' : 'true') + '"' : ''} href="${href(p.file, q.file)}">${esc(q.label)}</a></li>`;
  }).join('\n');
  return `<nav class="band" aria-label="Pages of the section">
  <ul>
${items}
  </ul>
</nav>`;
}
/* Level 3: a vertical list on the left, where a page has a family or four or more sections; the page then takes the full width.
   The sections are the page's own h2, read from the page by this file, which gives each one an id when it has none, so the list cannot
   disagree with the page (SITE-3.md section 4). Where a page is in a family, the family is the list and its sections nest under its entry. */
function familyOf(p) {
  const head = p.parent ? by.get(p.parent) : p;
  const kids = PAGES.filter(q => q.parent === head.file);
  return kids.length ? { head, kids } : null;
}
const SECTION_MIN = 4;
const slug = (text, taken) => {
  let base = text.toLowerCase().replace(/&[a-z#0-9]+;/g, ' ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40).replace(/-+$/, '') || 'section';
  let id = base, n = 2;
  while (taken.has(id)) id = base + '-' + n++;
  taken.add(id);
  return id;
};
const plain = h => h.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/\s+/g, ' ').trim();
/* the h2 of a page's main, each with the id it is reached by: the id of its own section where that has one, else its own */
function sectionsOf(t) {
  const a = t.indexOf('<main id="main">'), b = t.indexOf('</main>');
  if (a < 0 || b < 0) return { text: t, list: [] };
  let body = t.slice(a, b);
  const taken = new Set([...t.matchAll(/\sid="([^"]+)"/g)].map(m => m[1]));
  const list = [];
  let lastSection = null;
  body = body.replace(/<section\b([^>]*)>|<h2\b([^>]*)>([\s\S]*?)<\/h2>/g, (m, secAttrs, attrs, inner) => {
    if (secAttrs !== undefined) { const i = /\sid="([^"]+)"/.exec(secAttrs); lastSection = i ? i[1] : null; return m; }
    const own = /\sid="([^"]+)"/.exec(attrs);
    let id = own ? own[1] : lastSection;
    let out = m;
    if (!id) { id = slug(plain(inner), taken); out = '<h2' + attrs + ' id="' + id + '">' + inner + '</h2>'; }
    /* the outline shows the section's short label (data-outline on its h2), and the whole title in the entry's tooltip */
    const short = /\sdata-outline="([^"]*)"/.exec(attrs);
    list.push({ id, label: short ? short[1].replace(/&amp;/g, '&').replace(/&quot;/g, '"') : plain(inner), full: plain(inner) });
    lastSection = null;
    return out;
  });
  return { text: t.slice(0, a) + body + t.slice(b), list };
}
function list3(p, secs) {
  if (p.home || p.outside) return '';
  const f = familyOf(p);
  const own = secs && secs.length >= SECTION_MIN ? secs : null;
  const subs = own ? `\n      <ul class="sub">\n${own.map(x => `        <li><a href="#${x.id}" title="${esc(x.full).replace(/"/g, '&quot;')}">${esc(x.label)}</a></li>`).join('\n')}\n      </ul>\n    ` : '';
  if (f) {
    const li = q => `    <li><a${q === p ? ' aria-current="page"' : ''} href="${href(p.file, q.file)}">${esc(q.label)}</a>${q === p ? subs : ''}</li>`;
    return `<nav class="list3" aria-label="Pages of the family">
  <ul>
${f.kids.map(li).join('\n')}
  </ul>
</nav>`;
  }
  if (!own) return '';
  return `<nav class="list3 sections" aria-label="Sections of this page">
  <p class="outline-title">On this page</p>
  <ul>
${own.map(x => `    <li><a href="#${x.id}" title="${esc(x.full).replace(/"/g, '&quot;')}">${esc(x.label)}</a></li>`).join('\n')}
  </ul>
</nav>`;
}
const REPO = 'https://github.com/mayouni/zane';
function footer(p) {
  const to = f => href(p.file, f);
  const pending = PAGES.find(q => q.pending);
  return `<footer class="site">
  <div class="narrow">
    <div class="bar">
      <div class="row">
${pending ? `        <a href="${to(pending.file)}">Reader</a>\n` : ''}        <a class="leaves" href="${REPO}" target="_blank" rel="noopener">GitHub</a>
        <a href="${to('LICENSE')}">LICENSE</a>
      </div>
      ${stylePicker()}
    </div>
    <p class="fine">© 2026 Mansour Ayouni · MIT licence</p>
  </div>
</footer>`;
}

/* ---- the stubs: two pages that exist only so that the menu leads somewhere true -------------------- */
function stub(p) {
  const s = p.stub === 'thinking' ? {
    kicker: 'Approach · being built',
    title: 'The thinking behind an intent-driven interface',
    sub: 'This section holds the reasoning, the grid of what an interface must let a person do, and the comparison with what already exists. The essay is being written; what exists today is the documents it will draw on.',
    h2: 'The design documents',
    body: `<p>The reasoning is written in the repository. In the order a reader would take them:
    <a href="../doc/ARCHITECTURE.md">the founding architecture</a> (intent before widgets, three layers);
    <a href="../doc/THE-INTERACTION-MODEL.md">the interaction model</a> (one declaration, many renderings, one law);
    <a href="../doc/SENSORS-AND-ACTUATORS.md">sensors and actuators</a> (what the closed vocabulary survives);
    <a href="../doc/STZSENSE.md">stzSense</a> (how style is declared);
    <a href="../doc/GUI-SYSTEM.md">a GUI system, read by the law</a>;
    <a href="../doc/design/COVERAGE.md">the coverage map</a> (where the law speaks and where it is silent).</p>
    <p>One more is proposed and not ratified: <a href="../doc/THE-SECOND-FOUNDING.md">the Second Founding</a>, the wider design. Nothing on this site rests on it.</p>
    <p>What is already on the site: <a href="positioning.html">the comparison</a> with the practices a reader already uses.</p>`,
    h2b: 'What this site does not show yet',
    body2: `<p>The essay, the coverage grid as a page, and the claims with their limits are not written. The grid is designed and measured and not verified by a person.</p>`
  } : p.stub === 'media' ? {
    kicker: 'Channels · being built',
    title: 'One declaration, ten channels',
    sub: 'This section is being built. What exists today is data and instruments in the repository; this page names them and says what the site does not yet show. A channel is what the language and the law call a medium.',
    h2: 'What exists today',
    body: `<p>The ten channels a declaration can name, and what each carries, are published as data in <a href="../conformance/media.json"><code>conformance/media.json</code></a>
    (the keyword in a declaration is <code>SURFACE_AS</code>, and the diagnostics say <em>medium</em>).
    A verb a channel cannot carry is refused by the verifier, and the signal vocabulary and the statuses that render as silence are in
    <a href="../conformance/signal.json"><code>conformance/signal.json</code></a>.</p>
    <p>The instrument that checks that renderings differ only as that data predicts is <code>tools/zane/cross-medium.js</code>, and the map of where the law has
    something to say, and where it is silent, is <code>doc/design/COVERAGE.md</code> in the repository.</p>`,
    h2b: 'What this site does not show yet',
    body2: `<p>The pages that present the channels, the coverage grid and its gaps, and the cross-channel proof are not written. Nobody has perceived any of these channels for this grid, so
    the grid is designed and measured and not verified by a person.</p>`
  } : {
    kicker: 'Try · things to run',
    title: 'Run it on an interface and see what it finds',
    sub: 'The audit measures what an interface actually paints, not what its source declares: computed size, true contrast, the trail, the room a block has, and the menu against the tree.',
    h2: 'The UI audit',
    body: `<p>It runs in a browser on any same-origin interface and reports, for each finding, the rule it rests on. It measures Rules 105, 107, 108, 114, 115 and 116.
    <a href="../tools/ui-audit.html">Open the UI audit</a>.</p>
    <p>A colour it cannot read is reported as <em>not decided</em>, naming the colour, and never skipped.</p>`,
    h2b: 'Not here yet',
    body2: `<p>A second audit, for a screenshot of an application nobody on this project owns, is designed and its fact schema is written; it is described in
    <code>doc/design/AUDIT-FACTS.md</code> in the repository. No real application's screenshot has been run through it. A single-file build of the tools is planned and not built.</p>`
  };
  return `<header class="page">
  <div class="narrow">
    <!-- shell:trail --><!-- /shell:trail -->
    <p class="kicker">${s.kicker}</p>
    <h1>${s.title}</h1>
    <p class="sub">${s.sub}</p>
  </div>
</header>

<section>
  <div class="narrow">
    <h2>${s.h2}</h2>
    ${s.body}
  </div>
</section>

<section class="alt">
  <div class="narrow">
    <h2>${s.h2b}</h2>
    ${s.body2}
  </div>
</section>`;
}
function stubPage(p) {
  const s = { thinking: 'Approach — the thinking behind an intent-driven interface', media: 'Channels — one declaration, ten channels' }[p.stub] || 'Try — run it on an interface';
  return `<!DOCTYPE html>
<html lang="en" data-vibe="curator">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${s}</title>
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' fill='%23241d49'/%3E%3C/svg%3E">
<link rel="stylesheet" href="stz.css">
</head>
<body>

<!-- shell:menu --><!-- /shell:menu -->

${stub(p)}

<!-- shell:footer --><!-- /shell:footer -->

<script src="stz.js"></script>
</body>
</html>
`;
}

/* ---- applying the shell to a page's text ------------------------------------------------------- */
const fence = (name, inner) => `<!-- shell:${name} -->\n${inner}\n<!-- /shell:${name} -->`;
const fenceRe = name => new RegExp(`<!-- shell:${name} -->[\\s\\S]*?<!-- /shell:${name} -->`);
function apply(p, text) {
  let t = text.replace(/\r\n/g, '\n');
  const problems = [];

  /* ---- migration from the old markup, once ---- */
  if (!fenceRe('menu').test(t)) {
    const re = p.outside === 'reader' ? /<nav class="topnav"[\s\S]*?<\/nav>/ : /<nav class="site"[\s\S]*?<\/nav>/;
    if (!re.test(t)) problems.push('no top bar to replace');
    else t = t.replace(re, () => fence('menu', ''));
  }
  if (!p.home && !fenceRe('trail').test(t)) {
    if (/<nav class="crumbs"[\s\S]*?<\/nav>/.test(t)) t = t.replace(/<nav class="crumbs"[\s\S]*?<\/nav>/, () => fence('trail', ''));
    else problems.push('no trail to replace');
  }
  if (!p.outside && !fenceRe('footer').test(t)) {
    const m = /<footer class="site">[\s\S]*?<\/footer>/.exec(t);
    if (!m) problems.push('no footer to replace');
    else t = t.replace(m[0], () => fence('footer', m[0]));
  }
  t = t.replace(/<!-- shell:rail -->/g, '<!-- shell:layout -->').replace(/<!-- \/shell:rail -->/g, '<!-- /shell:layout -->');
  /* main, and the fenced opening of the layout (which holds the rail where there is one), once */
  if (!p.outside && !/<main id="main">/.test(t)) {
    const a = t.indexOf('</header>');
    const b = t.indexOf('<!-- shell:footer -->');
    if (a < 0 || b < 0) problems.push('no header or footer to wrap');
    else {
      const body = t.slice(a + '</header>'.length, b);
      t = t.slice(0, a + '</header>'.length) + '\n\n' + fence('layout', '') + '\n<main id="main">' + body.replace(/\s+$/, '') + '\n</main>\n</div>\n\n' + t.slice(b);
    }
  }

  /* the layout the fence opens is closed after main, before the footer: a footer left inside it is a grid item beside the left list */
  if (fenceRe('layout').test(t)) t = t.replace(/<\/main>\s*(?:<\/div>\s*)?(?=<!-- shell:footer -->)/, '</main>\n</div>\n\n');

  /* ---- the sections of a page get ids, and the list is made from them ---- */
  let secs = [];
  if (!p.home && !p.outside) { const r = sectionsOf(t); t = r.text; secs = r.list; }
  /* every entry of a page's outline fits one line in both cultures (the author, 2026-11-06): 20 characters at most, from the h2's data-outline */
  if (secs && secs.length >= SECTION_MIN) for (const x of secs) if (x.label.length > 20)
    problems.push('the outline entry "' + x.label + '" is ' + x.label.length + ' characters: give its h2 a data-outline of 20 at most');

  /* ---- render ---- */
  const fill = (name, inner) => { t = t.replace(fenceRe(name), () => fence(name, inner)); };
  if (fenceRe('menu').test(t)) fill('menu', menu(p));
  if (!p.home && fenceRe('trail').test(t)) fill('trail', trail(p));
  if (fenceRe('layout').test(t)) {
    const r = list3(p, secs);
    /* every list beside a page sits on its right, a family of pages (level 3) as the sections of a page do: the earlier ruling that kept
       a family on the left was turned by the author on 2026-11-06 ("some lateral menus are still in the left, move them to the right") */
    fill('layout', `<div class="layout${r ? ' has-list' : ''}">` + (r ? '\n' + r : ''));
  }
  if (fenceRe('footer').test(t)) {
    fill('footer', footer(p));
  }
  /* ---- the assets carry the hash of their own content, so a returning reader is served the stylesheet that matches the page ---- */
  t = t.replace(ASSET_RE, (m, attr, url, name) => `${attr}${url}?v=${assetHash(name)}"`);
  return { text: t, problems };
}

/* ---- every page is on a bar (SITE-3.md 3.4) ----------------------------------------------------------- */
/* The registry lists what the site serves; each listed page must be named by a bar (the menu, a band or a family list), and the
   footer may link no internal page the bars do not name. A page reachable only from a link in prose or in the footer is the defect. */
function walk(dir, out) {
  for (const e of fs.readdirSync(path.join(ROOT, dir), { withFileTypes: true })) {
    const q = path.posix.join(dir, e.name);
    if (e.isDirectory()) { if (!['assets', 'node_modules'].includes(e.name)) walk(q, out); }
    else if (e.name.endsWith('.html')) out.push(q);
  }
  return out;
}
function barsOfPage(p) {
  const on = [];
  if (p.home) on.push('the brand link');
  if (SECTIONS.some(sc => sc.head === p.file)) on.push('the menu');
  if (p.rail && !p.parent && bandOf(p.section)) on.push('the band of ' + p.section);
  if (p.parent) on.push('the list of ' + by.get(p.parent).label);
  return on;
}
function checkBars(problems, notes) {
  const served = ['index.html', ...walk('site', []), ...walk('tools', []), ...walk('constitution/reader', [])];
  for (const f of served) if (!by.has(f)) problems.push(`${f}: a page the site serves that the registry does not list, so no bar names it`);
  for (const p of PAGES) {
    if (p.pending) { notes.push(`NOTE ${p.file}: ${p.pending}`); continue; }
    if (barsOfPage(p).length === 0) problems.push(`${p.file}: on no bar`);
  }
  const home = by.get('index.html');
  const links = [...footer(home).matchAll(/href="([^"]+)"/g)].map(m => m[1]).filter(h => !/^https?:/.test(h));
  for (const h of links) {
    const target = path.posix.normalize(h).replace(/^\.\//, '');
    const q = by.get(target);
    if (q) { if (!q.pending && barsOfPage(q).length === 0) problems.push(`footer links ${target}, which no bar names`); }
    else if (target.endsWith('.html')) problems.push(`footer links ${target}, a page the registry does not list`);
    else if (!fs.existsSync(path.join(ROOT, target))) problems.push(`footer links ${target}, which does not exist`);
  }
}

/* ---- the register: each page names its subject (doc/design/WRITING.md) -------------------------------------------------- */
/* The h1, and the first sentence of the lead (the head's p.sub or span.sub, as the Reader writes it; on the front page, the hero's paragraph), each contain the page's
   subject term, ignoring case. The check cannot judge narrative, teasing or fragments: WRITING.md says so, and reading does the rest. */
function headOf(text) {
  /* a hero zone (the front page's header.hero) holds a tagline and one line, and is exempt from the strict register (doc/design/WRITING.md
     point 8): the page is judged on its first content section below the hero, its first title and the first paragraph */
  if (/<header class="hero"/.test(text)) {
    const sec = /<main\b[^>]*>[\s\S]*?<section\b[^>]*>([\s\S]*?)<\/section>/.exec(text);
    const t = sec && /<(h1|h2)\b[^>]*>([\s\S]*?)<\/\1>/.exec(sec[1]);
    const p = sec && /<p\b[^>]*>([\s\S]*?)<\/p>/.exec(sec[1]);
    const f = p ? (/^([\s\S]*?[.!?])(?=\s|$)/.exec(plain(p[1])) || [null, plain(p[1])])[1] : null;
    return { h1: t ? plain(t[2]) : null, first: f };
  }
  const h1 = /<h1\b[^>]*>([\s\S]*?)<\/h1>/.exec(text);
  const head = /<header\b[^>]*>[\s\S]*?<\/header>/.exec(text);
  const lead = head && (/<(p|span) class="sub">([\s\S]*?)<\/\1>/.exec(head[0]) || /<div class="panel">[\s\S]*?<()p>([\s\S]*?)<\/p>/.exec(head[0]));
  const first = lead ? (/^([\s\S]*?[.!?])(?=\s|$)/.exec(plain(lead[2])) || [null, plain(lead[2])])[1] : null;
  return { h1: h1 ? plain(h1[1]) : null, first };
}
function checkWriting(problems, notes) {
  const pending = [];
  for (const p of PAGES) {
    if (!p.term) {
      if (WRITING_PENDING.includes(p.file)) pending.push(p.file);
      else problems.push(`${p.file}: no subject term beside the menu (doc/design/WRITING.md section 2)`);
      continue;
    }
    const file = path.join(ROOT, p.file);
    if (!fs.existsSync(file)) continue;
    const { h1, first } = headOf(fs.readFileSync(file, 'utf8'));
    const term = p.term.toLowerCase();
    /* the term begins a word, so "use" is not found inside "because"; a term is letters and spaces only */
    if (!/^[a-z ]+$/.test(term)) problems.push(`${p.file}: the subject term "${p.term}" is not letters and spaces`);
    const named = s => new RegExp('(^|[^a-z0-9])' + term, 'i').test(s);
    if (!h1) problems.push(`${p.file}: no h1`);
    else if (!named(h1)) problems.push(`${p.file}: the h1 does not name the page's subject ("${p.term}"): "${h1}"`);
    if (!first) problems.push(`${p.file}: no lead`);
    else if (!named(first)) problems.push(`${p.file}: the lead's first sentence does not name the page's subject ("${p.term}"): "${first}"`);
  }
  if (pending.length) notes.push(`NOTE the register check (doc/design/WRITING.md) has not yet judged ${pending.length} page(s), still to be rewritten: ${pending.join(', ')}`);
}

/* ---- a title's line breaks belong to the browser (doc/design/WRITING.md) ----------------------------------------------------- */
/* No h1, h2, h3 or .scene-title may hold a <br>, a block-level element, or a child that a rule of stz.css makes a block: each of
   these places a line break by hand, and text-wrap: balance then balances each piece alone, never the whole title (the front
   page's title broke as "Zane is the / compilable language / for user interfaces." for this reason, 2026-11-05). And stz.css
   must still declare text-wrap: balance on h1, h2 and h3, and text-wrap: pretty on p. */
const HEADING_RE = /<(h1|h2|h3)\b[^>]*>([\s\S]*?)<\/\1>|<(\w+)\b[^>]*class="[^"]*\bscene-title\b[^"]*"[^>]*>([\s\S]*?)<\/\3>/g;
const BLOCK_TAGS = /<(div|p|ul|ol|li|section|article|aside|table|blockquote|pre|figure|header|footer|nav|h[1-6])\b/i;
function cssRules() {
  const css = fs.readFileSync(path.join(ROOT, 'site', 'stz.css'), 'utf8').replace(/\r\n/g, '\n').replace(/\/\*[\s\S]*?\*\//g, ' ');
  const rules = [];
  for (const m of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) rules.push({ selectors: m[1].split(',').map(s => s.trim()), body: m[2] });
  return rules;
}
function checkBreaks(problems) {
  const rules = cssRules();
  /* the descendants of a heading that stz.css turns into a block: "h1 span", ".hero .panel h1 span", ".scene-title em" */
  const blocking = [];
  for (const r of rules) {
    if (!/(^|;)\s*display\s*:\s*(block|flex|grid|table|list-item)\b/.test(r.body)) continue;
    for (const s of r.selectors) {
      const m = /(?:^|[\s>])(h1|h2|h3|\.scene-title)\s*>?\s*([a-z][a-z0-9]*|\.[\w-]+)$/i.exec(s);
      if (m) blocking.push({ heading: m[1], child: m[2], selector: s });
    }
  }
  const declares = (sel, prop) => rules.some(r => r.selectors.includes(sel) && new RegExp('(^|;)\\s*text-wrap\\s*:\\s*' + prop + '\\b').test(r.body));
  for (const h of ['h1', 'h2', 'h3']) if (!declares(h, 'balance')) problems.push('site/stz.css: no rule declares text-wrap: balance on ' + h);
  if (!declares('p', 'pretty')) problems.push('site/stz.css: no rule declares text-wrap: pretty on p');
  /* a title is never set in capitals: over several lines they are hard to read (the author, 2026-11-06) */
  for (const r of rules) if (/(^|;)\s*text-transform\s*:\s*uppercase\b/.test(r.body))
    for (const s of r.selectors) if (/(^|[\s>])(h1|h2|h3|\.scene-title)$/.test(s)) problems.push('site/stz.css: "' + s + '" sets a title in capitals');
  for (const p of PAGES) {
    const file = path.join(ROOT, p.file);
    if (!fs.existsSync(file)) continue;
    const text = fs.readFileSync(file, 'utf8').replace(/<(script|style)\b[\s\S]*?<\/\1>/g, ' ');
    /* a drawing scales to its column and never scrolls sideways (the author, 2026-11-06) */
    if (/<svg\b[^>]*style="[^"]*min-width/.test(text)) problems.push(p.file + ': an svg holds a fixed min-width, so its column scrolls sideways');
    if (/<div class="scroll">\s*<svg\b/.test(text)) problems.push(p.file + ': an svg sits in a scrolling wrapper: a drawing scales to its column');
    for (const m of text.matchAll(HEADING_RE)) {
      const tag = m[1] || 'scene-title', inner = m[1] ? m[2] : m[4];
      const name = '"' + plain(inner).slice(0, 70) + '"';
      if (/<br\b/i.test(inner)) problems.push(p.file + ': the ' + tag + ' ' + name + ' holds a <br>: a line break placed by hand');
      const b = BLOCK_TAGS.exec(inner);
      if (b) problems.push(p.file + ': the ' + tag + ' ' + name + ' holds a <' + b[1] + '>, a block: a line break placed by hand');
      for (const k of blocking) {
        if (k.heading !== tag && !(k.heading === '.scene-title' && tag === 'scene-title')) continue;
        const childRe = k.child.startsWith('.') ? new RegExp('<\\w+\\b[^>]*class="[^"]*\\b' + k.child.slice(1) + '\\b') : new RegExp('<' + k.child + '\\b', 'i');
        if (childRe.test(inner)) problems.push(p.file + ': the ' + tag + ' ' + name + ' holds a ' + k.child + ' that stz.css makes a block ("' + k.selector + '"): a line break placed by hand');
      }
    }
  }
}

/* ---- the site does not name Zing (the Principal, 2026-11-06: "do not reference Zing in the Zane site") ------------------------- */
/* Every file under site/, index.html, README.md (the repository's front page on GitHub, Central 2026-11-06) and every page of the
   registry, comments and JSON included, in any case. The match is the word, so "box-sizing" in the stylesheet is not one. */
function checkNames(problems) {
  const files = new Set(['index.html', 'README.md', ...PAGES.map(p => p.file)]);
  (function all(dir) {
    for (const e of fs.readdirSync(path.join(ROOT, dir), { withFileTypes: true })) {
      const q = path.posix.join(dir, e.name);
      if (e.isDirectory()) all(q); else if (/\.(html|css|js|json|md|txt|svg)$/.test(e.name)) files.add(q);
    }
  })('site');
  for (const f of files) {
    const file = path.join(ROOT, f);
    if (!fs.existsSync(file)) continue;
    fs.readFileSync(file, 'utf8').split('\n').forEach((line, i) => {
      if (/\bzing\b/i.test(line)) problems.push(f + ':' + (i + 1) + ' names Zing: the Zane site does not name Zing');
    });
  }
}

function main(argv) {
  const write = argv.includes('--write');
  const problems = [];
  const notes = [];
  checkBars(problems, notes);
  checkWriting(problems, notes);
  checkBreaks(problems);
  checkNames(problems);
  let changed = 0;
  for (const p of PAGES) {
    const file = path.join(ROOT, p.file);
    let text;
    if (!fs.existsSync(file)) {
      if (p.stub && write) text = stubPage(p);
      else { problems.push(`${p.file}: missing`); continue; }
    } else text = fs.readFileSync(file, 'utf8');
    const crlf = text.includes('\r\n');
    const bom = text.charCodeAt(0) === 0xFEFF;
    const r = apply(p, bom ? text.slice(1) : text);
    r.problems.forEach(m => problems.push(`${p.file}: ${m}`));
    const out = (bom ? '﻿' : '') + (crlf ? r.text.replace(/\n/g, '\r\n') : r.text);
    if (out !== text) {
      if (write) { fs.writeFileSync(file, out); changed++; console.log('wrote  ' + p.file); }
      else problems.push(`${p.file}: differs from the shell this file renders (run with --write)`);
    }
  }
  notes.forEach(m => console.log(m));
  if (problems.length) { problems.forEach(m => console.log('PROBLEM ' + m)); return 1; }
  console.log(write ? `shell written: ${changed} page(s) changed` : `shell ok: ${PAGES.length} pages carry exactly the shell site-shell.js renders`);
  return 0;
}
if (require.main === module) process.exitCode = main(process.argv.slice(2));
module.exports = { SECTIONS, PAGES, menu, trail, band, list3, footer, checkBars, checkWriting, checkBreaks, headOf };
