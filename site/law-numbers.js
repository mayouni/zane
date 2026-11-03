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

  /* The refusal contract is a second file. It drifts for the same reason the law
     does -- the "ten named violations" text on How it works was true when it was
     written and wrong once the contract reached 22. Derived, not typed. */
  var vsrc = (here && here.dataset && here.dataset.violations) ||
             src.replace(/constitution\/rules\.json$/, 'conformance/violations.json');

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

  function stale(sel, what) {
    document.querySelectorAll(sel).forEach(function (el) {
      if (el.hasAttribute('data-law-live')) return;
      el.setAttribute('data-law-stale', '');
      el.title = 'Static fallback — ' + what + ' was not reachable from this page. Serve it beside the site to see the live figure.';
    });
  }

  var json = function (u) {
    return fetch(u, { cache: 'no-cache' })    /* revalidate: never show a stale law */
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); });
  };

  json(src).then(fill)
    .catch(function () {
      /* diagnostics comes from the other file and reports its own absence */
      stale('[data-law]:not([data-law="diagnostics"]), [data-law-share]', 'the law');
    });

  json(vsrc)
    .then(function (v) {
      var list = v.violations || v.diagnostics || [];
      var n = Array.isArray(list) ? list.length : Object.keys(list).length;
      document.querySelectorAll('[data-law="diagnostics"]').forEach(function (el) {
        el.textContent = String(n);
        el.setAttribute('data-law-live', '');
      });
    })
    .catch(function () { stale('[data-law="diagnostics"]', 'the refusal contract'); });

  /* Every other figure is derived from the tree by tools/site-facts.js and written to site/facts.json; a span
     marked data-fact="..." reads it. The static text stays when the file is not reachable, and the same script
     fails when that static text is not what the tree says (node tools/site-facts.js). */
  var fsrc = (here && here.dataset && here.dataset.facts) ||
             src.replace(/constitution\/rules\.json$/, 'site/facts.json');
  json(fsrc)
    .then(function (f) {
      var facts = f.facts || {};
      document.querySelectorAll('[data-fact]').forEach(function (el) {
        var v = facts[el.getAttribute('data-fact')];
        if (v === undefined || v === null) return;
        el.textContent = String(v);
        el.setAttribute('data-law-live', '');
      });
    })
    .catch(function () { stale('[data-fact]', 'the site facts'); });
})();
