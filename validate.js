// node validate.js — checks every chain: links unique in both words, and reports how it meanders.
const P = require("./words.js");
const count = (s, sub) => { let n = 0, i = -1; while ((i = s.indexOf(sub, i + 1)) >= 0) n++; return n; };
let bad = 0;
for (const [d, pool] of Object.entries(P)) pool.forEach((chain, ci) => {
  let off = 0; const offs = [0], deltas = [];
  chain.forEach((e, i) => {
    if (!/^[A-Z]+$/.test(e.word)) { console.log("BAD WORD", d, ci, e.word); bad++; }
    if (!i) return;
    const p = chain[i - 1].word;
    const a = count(p, e.link), b = count(e.word, e.link);
    if (a !== 1 || b !== 1) { console.log("NOT UNIQUE", d, ci, p, e.word, e.link, a, b); bad++; }
    const dl = p.indexOf(e.link) - e.word.indexOf(e.link);
    off += dl; offs.push(off); deltas.push(dl);
  });
  const min = Math.min(...offs);
  const span = Math.max(...chain.map((e, i) => offs[i] - min + e.word.length));
  const L = deltas.filter(x => x < 0).length, R = deltas.filter(x => x > 0).length;
  if (chain.length !== 9) { console.log("NOT 9 WORDS", d, ci); bad++; }
  if (L < 3 || R < 3) { console.log("NOT MEANDERING", d, ci); bad++; }
  console.log(d, ci, "span", span, "left", L, "right", R, "deltas", deltas.join(" "));
});
console.log(bad ? "FAILED" : "all ok");
