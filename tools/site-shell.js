#!/usr/bin/env node
'use strict';
/* ==========================================================================
   site-shell.js -- the one definition of the site's navigation.

     node tools/site-shell.js            check: every page carries exactly the shell this file renders
     node tools/site-shell.js --write    render the shell into every page

   doc/design/SITE-2.md decides the shape: a main menu of FIVE entries (Rule 27); under it, fixed with it, a
   band of the section's pages, five at most (Rules 27, 120); a vertical list on the left ONLY where a page
   has a family (level 3), and the page then takes the full width; and a visually hidden Breadcrumb landmark
   on every page (Rule 108). The same band is on every page of its section, the same list on every page of
   its family (Rule 115). Menus, bands, lists and landmarks written by hand would drift; this file is the only
   place they are written, and the check fails when a page differs from it. The regions it owns are fenced:

       <!-- shell:menu --> ... <!-- /shell:menu -->      the two sticky bars (menu, with the culture switch, and band)
       <!-- shell:trail --> ... <!-- /shell:trail -->    the hidden Breadcrumb landmark
       <!-- shell:layout --> ... <!-- /shell:layout -->  the opening of the layout, holding the level-3 list where there is one
       <!-- shell:footer --> ... <!-- /shell:footer -->  the footer links

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
const ASSETS = ['stz.css', 'stz.js', 'gotchas.css', 'law-numbers.js'];
const assetHash = name => crypto.createHash('sha256').update(fs.readFileSync(path.join(ROOT, 'site', name), 'utf8').replace(/\r\n/g, '\n')).digest('hex').slice(0, 8);
const ASSET_RE = new RegExp('((?:href|src)=")([^"?]*?(' + ASSETS.map(a => a.replace('.', '\\.')).join('|') + '))(?:\\?v=[0-9a-f]{8})?"', 'g');

/* ---- the structure --------------------------------------------------------------------------- */
const SECTIONS = [
  { id: 'language', label: 'Language', head: 'site/how.html' },
  { id: 'law', label: 'Law', head: 'site/why.html' },
  { id: 'media', label: 'Media', head: 'site/media.html' },
  { id: 'audit', label: 'Audit', head: 'site/audit.html' },
  { id: 'adopt', label: 'Adopt', head: 'site/adopt.html' }
];
/* A page's label is the one name it goes by in the menu, the rail and the trail (Rule 116). The head page
   of a section is named after the section; what the page is about is its kicker and its title. */
const FAMILIES = [['stillness', 'Stillness'], ['forms', 'Forms'], ['state', 'State'], ['widgets', 'Widgets'],
                  ['reading', 'Reading'], ['navigation', 'Navigation'], ['intelligence', 'Intelligence']];
const PAGES = [
  { file: 'index.html', home: true },
  { file: 'site/how.html', section: 'language', label: 'Language', rail: true },
  { file: 'site/refusal.html', section: 'language', label: 'What it refuses', rail: true },
  { file: 'site/haro.html', section: 'language', label: 'Declared in Haro', rail: true },
  { file: 'site/conformance.html', section: 'language', label: 'Conformance', rail: true },
  { file: 'site/why.html', section: 'law', label: 'Law', rail: true },
  { file: 'site/gotchas/index.html', section: 'law', label: 'What a violation feels like', rail: true },
  ...FAMILIES.map(([f, label]) => ({ file: `site/gotchas/${f}.html`, section: 'law', label, parent: 'site/gotchas/index.html', rail: true })),
  { file: 'site/vibes.html', section: 'law', label: 'Two cultures, one truth', rail: true },
  { file: 'site/media.html', section: 'media', label: 'Media', rail: true, stub: 'media' },
  { file: 'site/audit.html', section: 'audit', label: 'Audit', rail: true, stub: 'audit' },
  { file: 'site/adopt.html', section: 'adopt', label: 'Adopt', rail: true },
  { file: 'site/build.html', section: 'adopt', label: 'Build', rail: true },
  { file: 'site/generate.html', section: 'adopt', label: 'Generate', rail: true },
  /* outside the shell proper: menu and trail only */
  { file: 'constitution/reader/index.html', section: 'law', label: 'Reader', outside: 'reader' },
  { file: 'tools/ui-audit.html', section: 'audit', label: 'UI audit', outside: 'tool' }
];
const by = new Map(PAGES.map(p => [p.file, p]));
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
  /* the Reader draws its own bar with its own styles; the switch belongs to the pages that carry stz.css */
  const switchHtml = p.outside === 'reader' ? '' : cultureSwitch() + '\n';
  /* the links sit in their own row, which may scroll sideways on a narrow screen; the culture switch never does (Rule 106) */
  const row = p.outside === 'reader' ? '' : '    ';
  const menuOpen = p.outside === 'reader' ? '' : '    <div class="menu">\n';
  const menuClose = p.outside === 'reader' ? '' : '    </div>\n';
  const bar = `<nav class="${cls}" aria-label="Main menu">
${wrapOpen}${menuOpen}${row}    <a class="brand" href="${href(p.file, 'index.html')}">StzZui</a>
${links}
${menuClose}${switchHtml}${wrapClose}</nav>`;
  if (p.outside === 'reader') return bar;
  const b = band(p);
  return `<div class="bars">\n${bar}${b ? '\n' + b : ''}\n</div>`;
}
/* Rule 106: a control with two states shows both. The current one is marked by weight, an underline
   and a check mark, never by colour alone, and says so to assistive technology. */
function cultureSwitch() {
  return `    <div class="culture" role="group" aria-label="Style: two equivalent cultures, the same truth read another way (Article VI). Keyboard: F2">
      <span class="culture-label">Style</span>
      <button type="button" class="seg" data-vibe-set="curator" aria-pressed="true">Modern</button>
      <button type="button" class="seg" data-vibe-set="guardian" aria-pressed="false">Retro</button>
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
  const steps = [{ label: 'StzZui', to: 'index.html' }];
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
  if (p.home || p.outside || !p.section) return '';
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
/* Level 3: a vertical list on the left, only where a page has a family; the page then takes the full width. */
function familyOf(p) {
  const head = p.parent ? by.get(p.parent) : p;
  const kids = PAGES.filter(q => q.parent === head.file);
  return kids.length ? { head, kids } : null;
}
function list3(p) {
  if (p.home || p.outside) return '';
  const f = familyOf(p);
  if (!f) return '';
  const li = q => `    <li><a${q === p ? ' aria-current="page"' : ''} href="${href(p.file, q.file)}">${esc(q.label)}</a></li>`;
  return `<nav class="list3" aria-label="Pages of the family">
  <ul>
${f.kids.map(li).join('\n')}
  </ul>
</nav>`;
}
function footer(p, fine) {
  const to = f => href(p.file, f);
  return `<footer class="site">
  <div class="narrow">
    <div class="bar">
      <div class="row">
        <a href="${to('constitution/reader/index.html')}">Reader</a>
        <a href="${to('tools/ui-audit.html')}">UI audit</a>
        <a class="leaves" href="https://mayouni.github.io/zing/" target="_blank" rel="noopener">Zing</a>
      </div>
    </div>
    <p class="fine">${fine}</p>
  </div>
</footer>`;
}
const DEFAULT_FINE = '© 2026 StzZui — a Softanza project · Every claim on this page is either measured by the tooling or recorded in the harvest.';

/* ---- the stubs: two pages that exist only so that the menu leads somewhere true -------------------- */
function stub(p) {
  const s = p.stub === 'media' ? {
    kicker: 'Media · being built',
    title: 'One declaration, ten media',
    sub: 'This section is being built. What exists today is data and instruments in the repository; this page names them and says what the site does not yet show.',
    h2: 'What exists today',
    body: `<p>The ten media a declaration can name, and what each carries, are published as data in <a href="../conformance/media.json"><code>conformance/media.json</code></a>.
    A verb a medium cannot carry is refused by the verifier, and the signal vocabulary and the statuses that render as silence are in
    <a href="../conformance/signal.json"><code>conformance/signal.json</code></a>.</p>
    <p>The instrument that checks that renderings differ only as that data predicts is <code>tools/zui/cross-medium.js</code>, and the map of where the law has
    something to say, and where it is silent, is <code>doc/design/COVERAGE.md</code> in the repository.</p>`,
    h2b: 'What this site does not show yet',
    body2: `<p>The pages that present the media, the coverage grid and its gaps, and the cross-medium proof are not written. Nobody has perceived any of these media for this grid, so
    the grid is designed and measured and not verified by a person.</p>`
  } : {
    kicker: 'Audit · the painted page',
    title: 'Does a running interface meet the law?',
    sub: 'The audit measures what an interface actually paints, not what its source declares: computed size, true contrast, the trail, the room a block has, and the menu against the tree.',
    h2: 'The UI audit',
    body: `<p>It runs in a browser on any same-origin interface and reports, for each finding, the rule it rests on. It measures Rules 105, 107, 108, 114, 115 and 116.
    <a href="../tools/ui-audit.html">Open the UI audit</a>.</p>
    <p>A colour it cannot read is reported as <em>not decided</em>, naming the colour, and never skipped.</p>`,
    h2b: 'Judging an application you do not own',
    body2: `<p>A second audit, for a screenshot of an application nobody on this project owns, is designed and its fact schema is written; it is described in
    <code>doc/design/AUDIT-FACTS.md</code> in the repository. This site does not present it yet, and no real application's screenshot has been run through it.</p>`
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
  const s = p.stub === 'media' ? 'Media — one declaration, ten media' : 'Audit — does a running interface meet the law?';
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
const fineIn = text => (/<p class="fine">([\s\S]*?)<\/p>/.exec(text) || [])[1];
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

  /* ---- render ---- */
  const fill = (name, inner) => { t = t.replace(fenceRe(name), () => fence(name, inner)); };
  if (fenceRe('menu').test(t)) fill('menu', menu(p));
  if (!p.home && fenceRe('trail').test(t)) fill('trail', trail(p));
  if (fenceRe('layout').test(t)) {
    const r = list3(p);
    fill('layout', `<div class="layout${r ? ' has-list' : ''}">` + (r ? '\n' + r : ''));
  }
  if (fenceRe('footer').test(t)) {
    const fine = fineIn(fenceRe('footer').exec(t)[0]) || DEFAULT_FINE;
    fill('footer', footer(p, fine));
  }
  /* ---- the assets carry the hash of their own content, so a returning reader is served the stylesheet that matches the page ---- */
  t = t.replace(ASSET_RE, (m, attr, url, name) => `${attr}${url}?v=${assetHash(name)}"`);
  return { text: t, problems };
}

/* ---- the run ------------------------------------------------------------------------------------- */
function main(argv) {
  const write = argv.includes('--write');
  const problems = [];
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
  if (problems.length) { problems.forEach(m => console.log('PROBLEM ' + m)); return 1; }
  console.log(write ? `shell written: ${changed} page(s) changed` : `shell ok: ${PAGES.length} pages carry exactly the shell site-shell.js renders`);
  return 0;
}
if (require.main === module) process.exitCode = main(process.argv.slice(2));
module.exports = { SECTIONS, PAGES, menu, trail, band, list3, footer };
