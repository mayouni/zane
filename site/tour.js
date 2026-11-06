'use strict';
/* The tour as a deck: one scene fills the screen at a time, with no site menu, as the presentation mode of stzsite does (the
   Principal, 2026-11-06: "a diapo for full screen presentations"). An address opens it: #s1 to #s18 walk every scene in order, and
   #profile/N walks a profile's eight. Keys: → ↓ PageDown Space Enter go forward; ← ↑ PageUp Backspace go back; Home and End jump to
   the first and the last scene; n shows the presenter's notes; h shows the site's menu; f fills the whole screen; Escape opens the
   scene's own page. A click on a scene's empty space goes forward (back on its left fifth), and the buttons under the scene do the
   same for a person who does not use the keys. No animation: a scene cuts to the next (Rule 112). */
(function () {
  const P = window.TOUR_PROFILES || {}, N = window.TOUR_NAMES || {};
  const cards = [...document.querySelectorAll('.scene-card')];
  const ALL = cards.map(c => c.dataset.scene);
  const body = document.body, stage = document.getElementById('stage');
  const count = document.getElementById('stage-count'), open = document.getElementById('tour-open');
  const prevBtn = document.getElementById('tour-prev'), nextBtn = document.getElementById('tour-next');
  const notesBtn = document.getElementById('tour-notes'), bar = document.getElementById('deck-bar');
  const clamp = (k, n) => Math.min(Math.max(k || 1, 1), n);
  let notes = false;
  function parse() {
    let m = /^#s(\d+)$/.exec(location.hash);
    if (m) return { key: 's', list: ALL, i: clamp(parseInt(m[1], 10), ALL.length), name: 'Every scene' };
    m = /^#([a-z]+)\/(\d+)$/.exec(location.hash);
    if (m && P[m[1]]) return { key: m[1], list: P[m[1]], i: clamp(parseInt(m[2], 10), P[m[1]].length), name: N[m[1]] || m[1] };
    return null;
  }
  const address = (s, i) => s.key === 's' ? '#s' + i : '#' + s.key + '/' + i;
  function show() {
    const s = parse();
    body.classList.toggle('deck-on', !!s);
    cards.forEach(c => { c.hidden = true; });
    if (!s) { body.classList.remove('show-chrome'); return; }
    const card = document.getElementById('scene-' + s.list[s.i - 1]);
    card.hidden = false;
    card.querySelectorAll('.scene-notes').forEach(n => { n.hidden = !notes; });
    count.textContent = s.name + ' · ' + s.i + ' / ' + s.list.length;
    open.href = card.dataset.page;
    prevBtn.disabled = s.i === 1;
    nextBtn.disabled = s.i === s.list.length;
    bar.style.width = (s.i / s.list.length * 100) + '%';
    stage.scrollTop = 0;
  }
  function go(to) {
    const s = parse(); if (!s) return;
    const j = clamp(to(s), s.list.length);
    if (j === s.i) return;
    try { history.replaceState(null, '', address(s, j)); } catch (e) { location.hash = address(s, j); return; }
    show();
  }
  const step = d => go(s => s.i + d);
  prevBtn.addEventListener('click', () => step(-1));
  nextBtn.addEventListener('click', () => step(1));
  notesBtn.addEventListener('click', () => { notes = !notes; notesBtn.setAttribute('aria-pressed', String(notes)); show(); });
  document.addEventListener('keydown', e => {
    if (!parse() || e.altKey || e.ctrlKey || e.metaKey) return;
    const t = e.target;
    if (t && /^(input|textarea|select)$/i.test(t.tagName)) return;
    const onControl = t && t.closest && t.closest('a, button');   // Enter and Space keep their job on a link or a button
    switch (e.key) {
      case 'Enter': case ' ': if (onControl) return; e.preventDefault(); step(1); break;
      case 'ArrowRight': case 'ArrowDown': case 'PageDown': e.preventDefault(); step(1); break;
      case 'ArrowLeft': case 'ArrowUp': case 'PageUp': case 'Backspace': e.preventDefault(); step(-1); break;
      case 'Home': e.preventDefault(); go(() => 1); break;
      case 'End': e.preventDefault(); go(s => s.list.length); break;
      case 'n': case 'N': notesBtn.click(); break;
      case 'h': case 'H': body.classList.toggle('show-chrome'); break;
      case 'f': case 'F':
        if (document.fullscreenElement) document.exitFullscreen();
        else if (document.documentElement.requestFullscreen) document.documentElement.requestFullscreen();
        break;
      case 'Escape': if (!document.fullscreenElement) location.href = open.href; break;
    }
  });
  stage.addEventListener('click', e => {
    if (!parse() || e.target.closest('a, button, pre, .scene-notes, .stage-controls')) return;
    if (e.clientX < window.innerWidth * 0.2) step(-1); else step(1);
  });
  window.addEventListener('hashchange', () => { show(); if (parse()) stage.focus(); });
  show();
  if (parse()) stage.focus();
})();
