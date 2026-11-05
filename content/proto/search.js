// node search.js THEME [n]  -> lists valid chains (links = the theme's letters) built from cands.js, minus words already used.
const C = require("./cands"), base = require("../../words.js");
const theme = process.argv[2], want = +process.argv[3] || 8;
const used = new Set(JSON.parse(process.env.USED || "[]"));
for (const d in base) base[d].forEach(ch => { ch.words.forEach(w => used.add(w.word)); used.add(ch.bonus.answer); });
const cnt = (s, c) => s.split(c).length - 1;
const cand = [...new Set(C[theme])].filter(w => !used.has(w) && w !== theme && !w.includes(theme));
const out = [], seen = new Set();
let seed = +process.env.SEED || 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
function ok(deltas) {
  const neg = deltas.filter(x => x < 0).length, pos = deltas.filter(x => x > 0).length, z = deltas.filter(x => x === 0).length;
  if (neg < 3 || pos < 3 || z > 1) return false;
  for (let i = 2; i < deltas.length; i++) { const s = Math.sign(deltas[i]); if (s && s === Math.sign(deltas[i-1]) && s === Math.sign(deltas[i-2])) return false; }
  return true;
}
let tries = 0;
function dfs(chain, offs, deltas) {
  if (out.length >= 4000 || tries++ > 3e5) return;
  const i = chain.length;
  if (i === 9) {
    if (!ok(deltas)) return;
    const mn = Math.min(...offs), span = Math.max(...chain.map((w, k) => offs[k] - mn + w.length));
    if (span <= 15) { const k = chain.join(","); if (!seen.has(k)) { seen.add(k); out.push({ chain: [...chain], span, deltas: [...deltas] }); } }
    return;
  }
  const L = theme[i - 1], prev = chain[i - 1];
  if (cnt(prev, L) !== 1) return;
  const pool = cand.filter(w => !chain.some(c => c.includes(w) || w.includes(c)) && cnt(w, L) === 1).sort(() => rnd() - .5);
  for (const w of pool) {
    const d = prev.indexOf(L) - w.indexOf(L);
    const nd = [...deltas, d];
    if (nd.length >= 3) { const a = Math.sign(nd.at(-1)), b = Math.sign(nd.at(-2)), c = Math.sign(nd.at(-3)); if (a && a === b && b === c) continue; }
    chain.push(w); offs.push(offs[i - 1] + d); deltas.push(d);
    dfs(chain, offs, deltas);
    chain.pop(); offs.pop(); deltas.pop();
  }
}
const starts = cand.filter(w => cnt(w, theme[0]) === 1).sort(() => rnd() - .5);
for (const s of starts) { const before = out.length; tries = 0; dfs([s], [0], []); if (out.length - before > 60) out.length = before + 60; }
// prefer short spans & shorter words (easier to see on a phone); print a sample
out.sort((a, b) => a.span - b.span || rnd() - .5);
console.log(theme, "candidates", cand.length, "chains", out.length);
const X = new Set(require("./extras")[theme] || []); const score = o => o.chain.filter(w => X.has(w)).length; out.sort((a, b) => score(a) - score(b) || rnd() - .5); out.slice(0, want).forEach(o => console.log(o.span, "x" + score(o), o.chain.map(w => (X.has(w) ? "*" : "") + w).join(" ")));
