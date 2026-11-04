'use strict';
/* Shared by every page: the interaction VIBE -- the constitution's word
   (Article VI), a culture, not a skin. Two buttons in the top bar, both
   always visible, the current one pressed (Rule 106), and F2 for the
   operators who never touch the mouse. A page outside the shell may still
   carry the older select in its footer; both are kept in step. */
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
  document.addEventListener('keydown', e => {
    if (e.key === 'F2') {
      e.preventDefault();
      setVibe(html.dataset.vibe === 'curator' ? 'guardian' : 'curator');
    }
  });
})();
