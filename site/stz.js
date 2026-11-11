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
  /* A cell of a card grid fills its width as its neighbours do, and its last line still holds at least a third of its widest: the text
     is laid out to the full width, then narrowed only as far as the last line needs (ZANE-CARDGRID-01: a balanced paragraph ended its
     lines a third short of its column beside a neighbour that filled its own; K11 BALANCE measures the last line). */
  const lines = p => {
    const r = document.createRange(); r.selectNodeContents(p);
    const by = new Map();
    for (const b of r.getClientRects()) { if (!b.width) continue; const k = Math.round(b.top); const x = by.get(k) || [b.left, b.right]; by.set(k, [Math.min(x[0], b.left), Math.max(x[1], b.right)]); }
    return [...by.values()].map(([l, rr]) => rr - l);
  };
  const shortLast = w => w.length > 1 && w[w.length - 1] < Math.max(...w) / 3;
  function mend() {
    document.querySelectorAll('.messages > .card p, .grid > .card p').forEach(p => {
      p.style.maxWidth = '';
      if (!shortLast(lines(p))) return;
      /* the widest width that mends the last line, read from the full width down, so the text gives up as little width as it can */
      const full = Math.floor(p.getBoundingClientRect().width);
      let best = 0;
      for (let w = full - 4; w >= full * 0.7 && !best; w -= 4) {
        p.style.maxWidth = w + 'px';
        if (!shortLast(lines(p))) best = w;
      }
      p.style.maxWidth = best ? best + 'px' : '';
    });
  }
  let queued = false;
  const again = () => { if (!queued) { queued = true; requestAnimationFrame(() => { queued = false; widen(); mend(); }); } };
  widen(); mend(); window.addEventListener('load', () => { widen(); mend(); }); window.addEventListener('resize', again);
  /* a culture changes the font, and the width a line needs with it */
  new MutationObserver(again).observe(html, { attributes: true, attributeFilter: ['data-vibe'] });
  document.addEventListener('keydown', e => {
    if (e.key === 'F2') {
      e.preventDefault();
      setVibe(html.dataset.vibe === 'curator' ? 'guardian' : 'curator');
    }
  });
})();
