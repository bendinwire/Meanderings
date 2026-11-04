// usage: node content/search-easy.js SEED COUNT  -> prints candidate chains JSON (no clues), avoiding used words
const fs = require("fs"), path = require("path");
const SEED = +process.argv[2] || 1, COUNT = +process.argv[3] || 20, MAXSPAN = 15;
const D = __dirname, R = p => fs.existsSync(p) ? fs.readFileSync(p, "utf8") : "";
const base = require(path.join(D, "..", "words.js"));
const used = new Set(), usedB = new Set(["SEASONAL"]);
const eat = ch => { ch.words.forEach(e => used.add(e.word)); usedB.add(ch.bonus.answer); };
base.medium.forEach(eat); base.hard.forEach(eat); eat(base.easy[0]); eat(base.easy[4]);
for (const f of ["pool-medium.js", "pool-hard.js"]) { try { delete require.cache[require.resolve(path.join(D, f))]; require(path.join(D, f)).forEach(eat); } catch (e) {} }
const acc = path.join(D, "accepted-easy.json");
if (fs.existsSync(acc)) JSON.parse(R(acc)).forEach(eat);
const block = new Set(R(path.join(D, "block-easy.txt")).toUpperCase().split(/\s+/).filter(Boolean));
const BONUS = new Set(R(path.join(D, "bonus-easy.txt")).split(/\s+/).filter(w => /^[A-Z]{8}$/.test(w)));
R(path.join(D, "bonus-block.txt")).split(/\s+/).forEach(w => BONUS.delete(w));
usedB.forEach(b => { BONUS.delete(b); used.add(b); }); used.forEach(w => BONUS.delete(w));
const pref = new Set(); BONUS.forEach(b => { for (let i = 1; i <= 8; i++) pref.add(b.slice(0, i)); });
let s = SEED >>> 0;
const rnd = () => { s = (s + 0x6D2B79F5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const BASE = new Set(R(path.join(D, 'wordlist.txt')).split(/\s+/).map(w => w.toUpperCase())); const MINEX = +(process.argv[4] || 4); const WORDS = [...new Set(R(path.join(D, "wordlist-easy.txt")).split("\n").filter(l => !l.startsWith("#")).join(" ").split(/\s+/).map(w => w.toUpperCase()).filter(w => /^[A-Z]{4,10}$/.test(w)))].filter(w => !used.has(w) && !block.has(w) && !/LY$/.test(w) && !/(EST|IEST)$/.test(w));
const subs = new Map(), idx = new Map();
for (const w of WORDS) { const c = new Map(); for (let i = 0; i + 3 <= w.length; i++) { const x = w.substr(i, 3); c.set(x, (c.get(x) || 0) + 1); } const u = [...c].filter(([, n]) => n === 1).map(([x]) => x); subs.set(w, u); for (const x of u) { if (!idx.has(x)) idx.set(x, []); idx.get(x).push(w); } }
const local = new Set(), out = [];
function dfs(start) {
  const words = [{ word: start }], inC = new Set([start]), deltas = [], offs = [0]; let letters = "", budget = 6000;
  const spanOK = () => { let mn = 1e9, mx = -1e9; for (let i = 0; i < words.length; i++) { mn = Math.min(mn, offs[i]); mx = Math.max(mx, offs[i] + words[i].word.length); } return mx - mn <= MAXSPAN; };
  function rec(step) {
    if (budget-- < 0) return false;
    if (step === 9) { const n = deltas.filter(d => d < 0).length, p = deltas.filter(d => d > 0).length; if (words.filter(e => !BASE.has(e.word)).length < MINEX) return false; const stems = words.map(e => e.word.slice(0, 5)); if (new Set(stems).size < 9) return false; return n >= 3 && p >= 3 && BONUS.has(letters) && !usedB.has(letters) && !local.has(letters) && !words.some(e => e.word === letters); }
    const prev = words[step - 1].word, opts = [];
    for (const link of subs.get(prev)) { if (!pref.has(letters + link[0])) continue; for (const w of idx.get(link)) if (!inC.has(w) && !local.has(w)) opts.push([link, w]); }
    shuffle(opts);
    for (const [link, w] of opts.slice(0, 40)) {
      const d = prev.indexOf(link) - w.indexOf(link), n = deltas.length;
      if (d === 0 && deltas.includes(0)) continue;
      if (n >= 2 && d !== 0 && Math.sign(deltas[n - 1]) === Math.sign(d) && Math.sign(deltas[n - 2]) === Math.sign(d)) continue;
      words.push({ word: w, link }); inC.add(w); deltas.push(d); offs.push(offs[offs.length - 1] + d); letters += link[0];
      if (spanOK() && rec(step + 1)) return true;
      words.pop(); inC.delete(w); deltas.pop(); offs.pop(); letters = letters.slice(0, -1);
    }
    return false;
  }
  return rec(1) ? { bonus: letters, words: words.map(e => ({ ...e })) } : null;
}
const starts = shuffle(WORDS.slice());
for (const st of starts) { if (out.length >= COUNT) break; if (local.has(st)) continue; const c = dfs(st); if (c) { out.push(c); c.words.forEach(e => local.add(e.word)); local.add(c.bonus); usedB.add(c.bonus); BONUS.delete(c.bonus); } }
console.error(WORDS.length, "words available;", out.length, "chains");
console.log(JSON.stringify(out));
