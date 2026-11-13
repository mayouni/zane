/* The "try it" box on the Build page: it hands the declaration to the verifier compiled to wasm (zayn-wasm.js) and shows the
   envelope it returns, one finding per line. It decides nothing itself: every verdict, code, message and citation comes from
   the wasm. Nothing leaves the page. */
(async () => {
  const form = document.getElementById('try-form');
  if (!form) return;
  const out = document.getElementById('try-result'), button = form.querySelector('button');
  const el = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text) e.textContent = text; return e; };
  let zayn;
  try { zayn = await ZaynWasm.load(form.dataset.wasm); } catch (e) {
    out.replaceChildren(el('p', 'try-verdict bad', 'The verifier could not load in this browser: ' + e.message + '.'));
    return;
  }
  function check() {
    const level = +document.getElementById('try-level').value;
    const text = zayn.check('this-page.zayn', document.getElementById('try-source').value, { level });
    if (text === null) { out.replaceChildren(el('p', 'try-verdict bad', 'The verifier refused the request.')); return; }
    const r = JSON.parse(text), n = r.counts;
    const verdict = r.diagnostics.length === 0
      ? `Clean: 0 violations at level ${r.level} against Zayn v${r.contract.constitution}.`
      : `${n.errors} error(s) and ${n.warnings} warning(s) at level ${r.level}.`;
    const list = el('ul');
    for (const d of r.diagnostics) {
      const li = el('li');
      li.append(el('b', null, `Line ${d.span.line} · ${d.severity} · ${d.code}`), document.createTextNode(` — ${d.message}`));
      if (d.cites.length) li.append(el('br'), document.createTextNode('Cites ' + d.cites.join(', ') + '.'));
      list.append(li);
    }
    out.replaceChildren(el('p', 'try-verdict ' + (n.errors ? 'bad' : 'good'), verdict), ...(r.diagnostics.length ? [list] : []));
  }
  form.addEventListener('submit', e => { e.preventDefault(); check(); });
  button.disabled = false;
  check();
})();
