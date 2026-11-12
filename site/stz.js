'use strict';
/* Shared by every page: the interaction VIBE -- the constitution's word
   (Article VI), a culture, not a skin. A select at the right end of the
   footer with both states as options, the current one shown (Rule 106 allows
   it), and F2 for the operators who never touch the mouse. */
(function () {
  const html = document.documentElement;
  const select = document.getElementById('vibe-select');
  const buttons = document.querySelectorAll('[data-vibe-set]');
  function setVibe(name) {
    html.dataset.vibe = name;                    /* internal styling hook */
    if (select && select.value !== name) select.value = name;
    buttons.forEach(b => b.setAttribute('aria-pressed', String(b.getAttribute('data-vibe-set') === name)));
    try { localStorage.setItem('stzzui-vibe', name); } catch (e) { /* storage may be blocked */ }
  }
  let saved = null;
  try { saved = localStorage.getItem('stzzui-vibe'); } catch (e) { /* storage may be blocked */ }
  setVibe(saved === 'guardian' ? 'guardian' : 'curator');
  if (select) select.addEventListener('change', e => setVibe(e.target.value));
  buttons.forEach(b => b.addEventListener('click', () => setVibe(b.getAttribute('data-vibe-set'))));
  /* the menu and the band stick together; the left list and the anchors sit below them, whatever height they have */
  const bars = document.querySelector('.bars');
  function pin() { if (bars) html.style.setProperty('--bars-h', Math.round(bars.getBoundingClientRect().height) + 'px'); }
  pin(); window.addEventListener('resize', pin); window.addEventListener('load', pin);
  /* the outline of a long page: the section being read is marked (aria-current, which the stylesheet draws as weight and a tint, never
     colour alone); the outline is always open, with nothing to unfold (the author, 2026-11-06) */
  const secLinks = [...document.querySelectorAll('nav.list3 a[href^="#"]')];
  if (secLinks.length) {
    const targets = secLinks.map(a => document.getElementById(a.getAttribute('href').slice(1))).filter(Boolean);
    const mark = () => {
      const line = (parseInt(getComputedStyle(html).getPropertyValue('--bars-h'), 10) || 100) + 24;
      let cur = targets[0];
      targets.forEach(el => { if (el.getBoundingClientRect().top <= line) cur = el; });
      secLinks.forEach(a => {
        if (cur && a.getAttribute('href') === '#' + cur.id) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
      });
    };
    mark(); window.addEventListener('scroll', mark, { passive: true }); window.addEventListener('resize', mark);
  }
  /* A table or a code block is not held to the text's right edge: when its content needs more than the column, it takes the room free
     to its right, into the page's margin, up to the window less the gutter, and keeps the left edge every block on the page shares
     (ZANE-LEFTEDGE-01: the outline stands on the left, so the right is free); it wraps only past that, and never scrolls sideways (the
     Principal, 2026-11-11: "when space is available stretch the tables to be more readable. it's the same think we stated for code
     snippets when they need more space and to avoid horizontal bars. in both cases, they should not be restricted to the test left and
     right limits"; K24 WIDE_ROOM in tools/ui-audit.html). A sample frame keeps its own size. */
  const WIDE = 'main table.board, main table.evidence, main table.gridmap, main .shot, main .term, main .excerpt';
  const KEEP = '.samples, figure.sample, .window, .pane, .vibe-pane, .offense, [data-offending]';
  const outline = document.querySelector('.layout.has-list > nav.list3');
  function widen() {
    const rem = parseFloat(getComputedStyle(html).fontSize) || 16;
    const gutter = (parseFloat(getComputedStyle(html).getPropertyValue('--gutter')) || 1.4) * rem;
    const page = html.clientWidth;
    document.querySelectorAll(WIDE).forEach(el => {
      if (el.closest(KEEP)) return;
      el.style.width = ''; el.style.maxWidth = ''; el.style.marginLeft = '';
      const r0 = el.getBoundingClientRect();
      if (!r0.width) return;
      /* only a block that spans the text column grows: one in a cell of a pair or a grid keeps its cell, and never covers its neighbour */
      const inner = box => { const s = getComputedStyle(box), b = box.getBoundingClientRect();
        return { left: b.left + parseFloat(s.paddingLeft), right: b.right - parseFloat(s.paddingRight), width: b.width - parseFloat(s.paddingLeft) - parseFloat(s.paddingRight) }; };
      const room = inner(el.parentElement), col = inner(el.closest('.narrow, .wrap, main'));
      if (Math.abs(room.left - col.left) > 2 || Math.abs(room.right - col.right) > 2 || Math.abs(r0.left - col.left) > 2) return;
      el.style.maxWidth = 'none'; el.style.width = 'max-content';
      const natural = Math.ceil(el.getBoundingClientRect().width);
      el.style.width = ''; el.style.maxWidth = '';
      if (natural <= Math.max(r0.width, room.width) + 1) return;
      let right = page - gutter;
      if (outline) {
        const o = outline.getBoundingClientRect();
        const beside = o.left > r0.left && (getComputedStyle(outline).position === 'sticky' || (o.bottom > r0.top && o.top < r0.bottom));
        if (beside) right = Math.min(right, o.left - 2 * rem);
      }
      const width = Math.max(r0.width, Math.min(natural, right - r0.left));
      if (width <= r0.width + 1) return;
      el.style.maxWidth = 'none'; el.style.width = Math.floor(width) + 'px';
    });
  }
  /* Running text fills its measure, and its last line still holds at least a third of its widest: the text is laid out to the full
     width, then narrowed only as far as the last line needs (ZANE-CARDGRID-01: a balanced paragraph ended its lines a third short of its
     column beside a neighbour that filled its own; the Principal, 2026-11-12: "a bad use of space"; K11 BALANCE measures the last line).
     A sample frame keeps the text its sample shows. */
  const lines = p => {
    const r = document.createRange(); r.selectNodeContents(p);
    const by = new Map();
    for (const b of r.getClientRects()) { if (!b.width) continue; const k = Math.round(b.top); const x = by.get(k) || [b.left, b.right]; by.set(k, [Math.min(x[0], b.left), Math.max(x[1], b.right)]); }
    return [...by.values()].map(([l, rr]) => rr - l);
  };
  const shortLast = w => w.length > 1 && w[w.length - 1] < Math.max(...w) / 3;
  function mend() {
    document.querySelectorAll('main p, main li, main dd, main figcaption, main blockquote, header.page .sub, .grid > .card p, .messages > .card p, .pair p').forEach(p => {
      if (p.closest(KEEP) || p.closest('pre, table, nav')) return;
      p.style.maxWidth = ''; p.style.textWrap = '';
      if (!shortLast(lines(p))) return;
      /* the widest width that mends the last line, read from the full width down, so the text gives up as little width as it can */
      const full = Math.floor(p.getBoundingClientRect().width);
      let best = 0;
      const step = Math.max(4, Math.round(full * 0.02));
      for (let w = full - step; w >= full * 0.7 && !best; w -= step) {
        p.style.maxWidth = w + 'px';
        if (!shortLast(lines(p))) best = w;
      }
      /* a paragraph no narrowing can mend is balanced instead: its lines are evened, and none is left short */
      if (best) p.style.maxWidth = best + 'px'; else { p.style.maxWidth = ''; p.style.textWrap = 'balance'; }
    });
  }
  /* Code reads as code: a declaration's keywords, its strings and listed values, and its comments, each in its role (site/stz.css),
     read from the text by rule, so no block is coloured by hand and none is left grey; and each source line is set apart, so the part
     of a line too long for its block hangs under its own indentation (K27 CODE_HANG). A terminal keeps the marks it was written with. */
  const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const tokens = /("(?:[^"\\]|\\.)*")|(\/\/.*$|(?:^|(?<=\s))#.*$)|(\[)|(\])|\b([A-Z][A-Z0-9_]+)\b/g;
  function paint(pre) {
    if (pre.querySelector(':scope > .ln')) return;
    const text = pre.textContent.replace(/\n$/, '');
    const declaration = /\bDEFINE\b/.test(text);
    let depth = 0;
    pre.innerHTML = text.split('\n').map(line => {
      let out = '', last = 0, m;
      tokens.lastIndex = 0;
      while ((m = tokens.exec(line))) {
        out += esc(line.slice(last, m.index)); last = tokens.lastIndex;
        if (m[1]) out += '<span class="s">' + esc(m[1]) + '</span>';
        else if (m[2]) out += '<span class="c">' + esc(m[2]) + '</span>';
        else if (m[3]) { depth++; out += '['; }
        else if (m[4]) { depth = Math.max(0, depth - 1); out += ']'; }
        else out += declaration ? '<span class="' + (depth ? 's' : 'k') + '">' + m[5] + '</span>' : m[5];
      }
      out += esc(line.slice(last));
      return '<span class="ln" style="--ind:' + line.match(/^ */)[0].length + '">' + out + '</span>';
    }).join('');
  }
  function hang(pre) {
    if (pre.querySelector(':scope > .ln') || !pre.textContent.includes('\n')) return;
    const lines = [document.createElement('span')];
    const put = (parents, text) => {
      let host = lines[lines.length - 1];
      for (const p of parents) {
        let last = host.lastChild;
        if (!(last && last.__from === p)) { last = p.cloneNode(false); last.__from = p; host.appendChild(last); }
        host = last;
      }
      host.appendChild(document.createTextNode(text));
    };
    const walk = (node, parents) => {
      for (const ch of [...node.childNodes]) {
        if (ch.nodeType === 3) ch.textContent.split('\n').forEach((part, k) => {
          if (k) lines.push(document.createElement('span'));
          if (part) put(parents, part);
        });
        else if (ch.nodeType === 1) walk(ch, [...parents, ch]);
      }
    };
    walk(pre, []);
    if (lines.length > 1 && !lines[lines.length - 1].textContent) lines.pop();
    lines.forEach(ln => { ln.className = 'ln'; ln.style.setProperty('--ind', ln.textContent.match(/^ */)[0].length); });
    pre.replaceChildren(...lines);
  }
  const code = () => {
    document.querySelectorAll('pre.shot, pre.excerpt').forEach(p => { if (!p.closest(KEEP)) paint(p); });
    document.querySelectorAll('pre.term').forEach(p => { if (!p.closest(KEEP)) hang(p); });
  };
  code();
  let queued = false;
  /* a timer, not an animation frame: a page held off screen (the UI audit's frames) runs no animation frame and would keep its first layout */
  const again = () => { if (!queued) { queued = true; setTimeout(() => { queued = false; code(); widen(); mend(); }, 30); } };
  widen(); mend(); window.addEventListener('load', () => { widen(); mend(); }); window.addEventListener('resize', again);
  /* a culture changes the font, and the width a line needs with it */
  new MutationObserver(again).observe(html, { attributes: true, attributeFilter: ['data-vibe'] });
  /* a page that writes its text after it loads (a result, a run's output) is laid out again when it does */
  const body = document.querySelector('main') || document.body;
  if (body) new MutationObserver(again).observe(body, { childList: true, subtree: true, characterData: true });
  document.addEventListener('keydown', e => {
    if (e.key === 'F2') {
      e.preventDefault();
      setVibe(html.dataset.vibe === 'curator' ? 'guardian' : 'curator');
    }
  });
})();
