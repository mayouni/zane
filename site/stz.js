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
  document.addEventListener('keydown', e => {
    if (e.key === 'F2') {
      e.preventDefault();
      setVibe(html.dataset.vibe === 'curator' ? 'guardian' : 'curator');
    }
  });
})();
