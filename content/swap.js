// node content/swap.js <diff> <chainNo 1-based> <wordNo 1-based>
// Lists replacement words for one position of a chain that keep every link and the chain's meander rules,
// and aren't used anywhere else in content/words.merged.js. Candidates come from the vetted word lists.
const fs = require("fs");
const P = require("./words.merged.js");
const [d, cn, wn] = [process.argv[2], +process.argv[3] - 1, +process.argv[4] - 1];
const chain = P[d][cn], words = chain.words;
const cands = new Set();
for (const f of fs.readdirSync(__dirname).filter(f => /^wordlist.*\.txt$/.test(f)))
  fs.readFileSync(__dirname + "/" + f, "utf8").split(/\s+/).forEach(w => { w = w.trim().toUpperCase(); if (/^[A-Z]{4,12}$/.test(w)) cands.add(w); });
const used = new Set(); Object.values(P).forEach(p => p.forEach(c => { c.words.forEach(w => used.add(w.word)); used.add(c.bonus.answer); }));
const count = (s, sub) => { let n = 0, i = -1; while ((i = s.indexOf(sub, i + 1)) >= 0) n++; return n; };
const ok = ws => {
  const deltas = []; let off = 0; const offs = [0];
  for (let i = 1; i < ws.length; i++) {
    const l = words[i].link, p = ws[i - 1], w = ws[i];
    if (count(p, l) !== 1 || count(w, l) !== 1) return false;
    const dl = p.indexOf(l) - w.indexOf(l); deltas.push(dl); off += dl; offs.push(off);
  }
  const neg = deltas.filter(x => x < 0).length, pos = deltas.filter(x => x > 0).length, zero = deltas.filter(x => x === 0).length;
  if (neg < 3 || pos < 3 || zero > 1) return false;
  for (let i = 2; i < deltas.length; i++) { const s = Math.sign(deltas[i]); if (s && s === Math.sign(deltas[i - 1]) && s === Math.sign(deltas[i - 2])) return false; }
  const min = Math.min(...offs);
  return Math.max(...ws.map((w, i) => offs[i] - min + w.length)) <= 15;
};
const cur = words.map(w => w.word), out = [];
for (const c of cands) {
  if (used.has(c) || c === cur[wn]) continue;
  const t = cur.slice(); t[wn] = c;
  if (ok(t)) out.push(c);
}
console.log(`${d}#${cn + 1}.${wn + 1} currently ${cur[wn]} (link ${words[wn].link || "-"}), chain: ${cur.join(" ")}`);
console.log(out.length + " candidates:", out.slice(0, 60).join(" "));
