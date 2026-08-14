/* ==========================================================================
   law-numbers.js — the site's numbers, read from the law rather than typed.

   Every figure about the constitution on this site carries a data-law
   attribute and a static fallback. This fetches constitution/rules.json and
   replaces the fallback with the truth.

   It exists because the fallback went stale: the enforcement census on
   "How it works" was headed "computed from the file" and was hand-typed,
   and it was wrong by the time anyone noticed. A site that argues about
   drift must not drift.

   Graceful absence, the same discipline the Reader uses: served from a
   file:// URL or without the law beside it, the static text stands and a
   marker says so. No dependencies.

   Usage:  <script src="law-numbers.js" data-src="../constitution/rules.json" defer></script>
           <b data-law="rules">119</b>
           <b data-law="tier:machine">9</b>
   ========================================================================== */

(function () {
  'use strict';

  var here = document.currentScript;
  var src = (here && here.dataset && here.dataset.src) || 'constitution/rules.json';

  function fill(law) {
    var sets = Object.keys(law).filter(function (k) { return /^set[0-9]+$/.test(k); });
    var rules = [];
    sets.forEach(function (s) { (law[s].rules || []).forEach(function (r) { rules.push(r); }); });

    var tiers = {};
    rules.forEach(function (r) {
      var t = r.enforcement || 'unstated';
      tiers[t] = (tiers[t] || 0) + 1;
    });

    var rights = {};
    rules.forEach(function (r) { (r.rights || []).forEach(function (x) { rights[x] = 1; }); });

    var value = {
      rules: rules.length,
      version: law.metadata && law.metadata.version,
      articles: Object.keys(law.articles || {}).length,
      sets: sets.length,
      forbidden: (law.forbidden || []).length,
      rights: Object.keys(law.rights || {}).length || Object.keys(rights).length
    };

    document.querySelectorAll('[data-law]').forEach(function (el) {
      var key = el.getAttribute('data-law');
      var v = key.indexOf('tier:') === 0 ? tiers[key.slice(5)] : value[key];
      if (v === undefined || v === null) return;
      el.textContent = String(v);
      el.setAttribute('data-law-live', '');
    });

    /* percentages, where a page asks for one */
    document.querySelectorAll('[data-law-share]').forEach(function (el) {
      var t = tiers[el.getAttribute('data-law-share')];
      if (t === undefined) return;
      el.textContent = Math.round((t / rules.length) * 100) + '%';
      el.setAttribute('data-law-live', '');
    });
  }

  fetch(src, { cache: 'no-cache' })          /* revalidate: never show a stale law */
    .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(fill)
    .catch(function () {
      document.querySelectorAll('[data-law], [data-law-share]').forEach(function (el) {
        el.setAttribute('data-law-stale', '');
        el.title = 'Static fallback — the law was not reachable from this page. Serve constitution/rules.json beside the site to see the live figure.';
      });
    });
})();
