#!/usr/bin/env node
/*
 * Meanderings chain generator.
 *
 * Usage:
 *   node content/search.js [--diff easy|medium|hard|all] [--count 7] [--seed 1]
 *                          [--out skeleton.json] [--wordlist content/wordlist.txt] [--maxspan 14]
 *   Prints a JSON skeleton { easy:[{bonus,words:[{word,link}]}], ... } (clues left blank) to --out or stdout.
 *   Clues are written by hand afterwards and merged into content/pools.js; then run `node validate.js content/pools.js`.
 *
 * COMMONNESS FILTER: there is deliberately no automatic frequency filter. The search runs only over
 * content/wordlist.txt, a hand-written list (about 3,300 words) of everyday words a general US adult
 * knows (no proper nouns, no archaic or technical terms), so every candidate is vetted by construction.
 * /usr/share/dict/words (Webster's 2nd) was NOT used: it is full of obscure entries. Word length is
 * limited to 4-10 here. To grow the pool, append vetted words to wordlist.txt ('#' lines are comments).
 *
 * RULES ENFORCED: link length easy=3 / medium=2 / hard=1; each link occurs exactly once in both the
 * previous word and the new word; the first letters of the 8 links spell a common 8-letter bonus word
 * (BONUS list below, each used at most once per difficulty); >=3 negative and >=3 positive deltas, no
 * more than 2 consecutive steps in the same direction, at most one zero delta; span <= maxspan;
 * no word repeats within a chain or across chains of one difficulty.
 */
const fs = require("fs"), path = require("path");
const arg = (k, d) => { const i = process.argv.indexOf("--" + k); return i > 0 ? process.argv[i + 1] : d; };
const SEED = +arg("seed", 1), COUNT = +arg("count", 7), MAXSPAN = +arg("maxspan", 14);
const DIFF = arg("diff", "all"), OUT = arg("out", null);
const WL = arg("wordlist", path.join(__dirname, "wordlist.txt"));
const LINKLEN = { easy: 3, medium: 2, hard: 1 };

// common single 8-letter English words used as bonus answers
const BONUS = `SUNLIGHT SANDWICH BIRTHDAY MOUNTAIN SUNSHINE CHAMPION PLATFORM DINOSAUR TREASURE KEYBOARD MIDNIGHT SHOULDER
BASEBALL MARATHON HOSPITAL SOMEBODY TOGETHER CHILDREN COMPUTER PASSWORD ANYTHING DAUGHTER ELECTRIC FOOTBALL LANGUAGE MAGAZINE
NOTEBOOK PAINTING QUESTION SHOPPING UMBRELLA VACATION HOMEWORK STANDARD TRIANGLE PLEASURE DISCOVER
PRACTICE POSITION TREASURY EVERYONE ABSOLUTE FESTIVAL GARDENER INSTANCE LEARNING MOONLIGHT OVERCOAT
RAILROAD SEASONAL TERRIBLE UNIVERSE WILDLIFE`.split(/\s+/).filter(w => /^[A-Z]{8}$/.test(w));

// seeded PRNG (mulberry32)
let s = SEED >>> 0;
const rnd = () => { s = (s + 0x6D2B79F5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

const WORDS = [...new Set(fs.readFileSync(WL, "utf8").split("\n").filter(l => !l.startsWith("#")).join(" ")
  .split(/\s+/).map(w => w.toUpperCase()).filter(w => /^[A-Z]{4,10}$/.test(w)))];

function uniqueSubs(w, L) {
  const c = new Map();
  for (let i = 0; i + L <= w.length; i++) { const x = w.substr(i, L); c.set(x, (c.get(x) || 0) + 1); }
  return [...c].filter(([, n]) => n === 1).map(([x]) => x);
}

function makeDiff(diff) {
  const L = LINKLEN[diff];
  const subs = new Map(), idx = new Map();
  for (const w of WORDS) { const u = uniqueSubs(w, L); subs.set(w, u); for (const x of u) { if (!idx.has(x)) idx.set(x, []); idx.get(x).push(w); } }
  const usedGlobal = new Set(), usedBonus = new Set(), chains = [];
  let guard = 0;
  while (chains.length < COUNT && guard++ < 5000) {
    const bonus = shuffle(BONUS.filter(b => !usedBonus.has(b)))[0];
    if (!bonus) break;
    for (const start of shuffle(WORDS.filter(w => !usedGlobal.has(w))).slice(0, 400)) {
      const chain = dfs(bonus, start, subs, idx, usedGlobal);
      if (chain) { chains.push({ bonus, words: chain }); chain.forEach(e => usedGlobal.add(e.word)); usedBonus.add(bonus); break; }
    }
  }
  return chains;
}

function dfs(bonus, start, subs, idx, usedGlobal) {
  const words = [{ word: start }], inChain = new Set([start]), deltas = [], offs = [0];
  let budget = 4000;
  const spanOK = () => {
    let mn = 1e9, mx = -1e9;
    for (let i = 0; i < words.length; i++) { mn = Math.min(mn, offs[i]); mx = Math.max(mx, offs[i] + words[i].word.length); }
    return mx - mn <= MAXSPAN;
  };
  function rec(step) {
    if (budget-- < 0) return false;
    if (step === 9) {
      const neg = deltas.filter(d => d < 0).length, pos = deltas.filter(d => d > 0).length;
      return neg >= 3 && pos >= 3;
    }
    const prev = words[step - 1].word, need = bonus[step - 1];
    const opts = [];
    for (const link of subs.get(prev)) {
      if (link[0] !== need) continue;
      for (const w of idx.get(link)) if (!inChain.has(w) && !usedGlobal.has(w) && w !== bonus) opts.push([link, w]);
    }
    shuffle(opts);
    for (const [link, w] of opts.slice(0, 40)) {
      const d = prev.indexOf(link) - w.indexOf(link), n = deltas.length;
      if (d === 0 && deltas.includes(0)) continue;
      if (n >= 2 && d !== 0 && Math.sign(deltas[n - 1]) === Math.sign(d) && Math.sign(deltas[n - 2]) === Math.sign(d)) continue;
      words.push({ word: w, link }); inChain.add(w); deltas.push(d); offs.push(offs[offs.length - 1] + d);
      if (spanOK() && rec(step + 1)) return true;
      words.pop(); inChain.delete(w); deltas.pop(); offs.pop();
    }
    return false;
  }
  return rec(1) ? words.map(e => ({ ...e })) : null;
}

const out = {};
for (const d of (DIFF === "all" ? Object.keys(LINKLEN) : [DIFF])) {
  out[d] = makeDiff(d);
  console.error(d, out[d].length, "chains:", out[d].map(c => c.bonus).join(" "));
}
const json = JSON.stringify(out, null, 1);
OUT ? fs.writeFileSync(OUT, json) : console.log(json);
