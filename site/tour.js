'use strict';
/* The tour: one scene shown at a time, chosen by the address (#profile/number), moved by the keys.
   No animation: a scene cuts to the next (Rule 112). The notes are hidden until asked for. */
(function () {
  const P = window.TOUR_PROFILES || {}, N = window.TOUR_NAMES || {};
  const cards = [...document.querySelectorAll('.scene-card')];
  const idle = document.getElementById('stage-idle');
  const controls = document.getElementById('stage-controls');
  const count = document.getElementById('stage-count');
  const open = document.getElementById('tour-open');
  const notesBtn = document.getElementById('tour-notes');
  let notes = false;
  function parse() {
    const m = /^#([a-z]+)\/(\d+)$/.exec(location.hash);
    if (!m || !P[m[1]]) return null;
    const list = P[m[1]];
    const i = Math.min(Math.max(parseInt(m[2], 10) || 1, 1), list.length);
    return { profile: m[1], list, i };
  }
  function show() {
    const s = parse();
    cards.forEach(c => { c.hidden = true; });
    if (!s) { idle.hidden = false; controls.hidden = true; return; }
    const card = document.getElementById('scene-' + s.list[s.i - 1]);
    idle.hidden = true; controls.hidden = false;
    card.hidden = false;
    card.querySelectorAll('.scene-notes').forEach(n => { n.hidden = !notes; });
    count.textContent = (N[s.profile] || s.profile) + ' · scene ' + s.i + ' of ' + s.list.length;
    open.href = card.getAttribute('data-page');
    document.getElementById('tour-prev').disabled = s.i === 1;
    document.getElementById('tour-next').disabled = s.i === s.list.length;
  }
  function go(d) {
    const s = parse(); if (!s) return;
    const j = Math.min(Math.max(s.i + d, 1), s.list.length);
    if (j !== s.i) { location.hash = '#' + s.profile + '/' + j; }
  }
  document.getElementById('tour-prev').addEventListener('click', () => go(-1));
  document.getElementById('tour-next').addEventListener('click', () => go(1));
  notesBtn.addEventListener('click', () => { notes = !notes; notesBtn.setAttribute('aria-pressed', String(notes)); show(); });
  window.addEventListener('hashchange', () => { show(); if (parse()) document.getElementById('stage').scrollIntoView(); });
  document.addEventListener('keydown', e => {
    if (!parse() || e.altKey || e.ctrlKey || e.metaKey) return;
    if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') { e.preventDefault(); go(1); }
    else if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); go(-1); }
    else if (e.key === 'n') { notesBtn.click(); }
    else if (e.key === 'f') { const st = document.getElementById('stage'); if (document.fullscreenElement) document.exitFullscreen(); else if (st.requestFullscreen) st.requestFullscreen(); }
    else if (e.key === 'Escape' && !document.fullscreenElement) { location.href = open.href; }
  });
  show();
  if (parse()) document.getElementById('stage').scrollIntoView();
})();
