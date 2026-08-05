'use strict';
/* The flagship feature, shared by every page: the interaction REGISTER --
   the constitution's word (Article VI), not a mood. A small labeled picker
   bottom-right, and F2 for the operators who never touch the mouse. */
(function () {
  const html = document.documentElement;
  const select = document.getElementById('vibe-select');
  function setVibe(name) {
    html.dataset.vibe = name;                    /* internal styling hook */
    if (select && select.value !== name) select.value = name;
    localStorage.setItem('stzweb-vibe', name);
  }
  setVibe(localStorage.getItem('stzweb-vibe') || 'curator');
  if (select) select.addEventListener('change', e => setVibe(e.target.value));
  document.addEventListener('keydown', e => {
    if (e.key === 'F2') {
      e.preventDefault();
      setVibe(html.dataset.vibe === 'curator' ? 'guardian' : 'curator');
    }
  });
})();
