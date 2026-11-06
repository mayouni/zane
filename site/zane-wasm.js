/* The loader of the verifier compiled to wasm (doc/design/BINARY.md section 6): fetch, instantiate, write the strings into
   its memory, call, read the envelope back. The only JavaScript on the verifier's path, and it holds no logic of the law.
   ZaneWasm.load(url) resolves to { check(name, source, { level, symbols }) }, which returns the envelope as the text that
   `zane check NAME --json --level N` prints, or null when the level is outside 1..4. Nothing leaves the page. */
window.ZaneWasm = {
  async load(url) {
    const { instance } = await WebAssembly.instantiate(await (await fetch(url)).arrayBuffer(), {});
    const z = instance.exports, enc = new TextEncoder(), dec = new TextDecoder();
    const put = s => {
      const b = enc.encode(s), p = z.zane_alloc(b.length || 1);
      new Uint8Array(z.memory.buffer, p, b.length).set(b);
      return [p, b.length];
    };
    return {
      check(name, source, opt = {}) {
        const n = put(name), s = put(source), y = opt.symbols ? put(JSON.stringify(opt.symbols)) : [0, 0];
        const r = z.zane_check(n[0], n[1], s[0], s[1], y[0], y[1], opt.level || 2);
        for (const [p, l] of [n, s, y]) if (p) z.zane_free(p, l || 1);
        if (!r) return null;
        const len = new DataView(z.memory.buffer).getUint32(r, true);
        const text = dec.decode(new Uint8Array(z.memory.buffer, r + 4, len).slice());
        z.zane_free(r, 4 + len);
        return text;
      }
    };
  }
};
