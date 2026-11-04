// node validate.js [path]                      validate a pools file (default ./words.js)
// node validate.js --pool <diff> <pool.js>     validate words.js with its <diff> pool REPLACED by the array of chains
//                                               exported by <pool.js> (module.exports = [...]); all three pools are
//                                               checked together, so cross-difficulty repeats are caught
// Nothing may repeat anywhere: no word, no bonus answer, no clue, in any difficulty. One grandfathered exception:
// the day-1 puzzles were already published, so a bonus answer may repeat between two index-0 chains.
// Pools file shape: { easy:[chain], medium:[chain], hard:[chain] }, chain = { bonus:{answer,clue}, words:[{word,clue,link?}] }.
// Exits non-zero on any failure; prints one summary line per chain (or only failures with --quiet).
const path = require("path");
const args = process.argv.slice(2);
const quiet = args.includes("--quiet");
const rest = args.filter(a => a !== "--quiet");
let P, only = null;
if (rest[0] === "--pool") {
  const base = require(path.resolve("./words.js"));
  only = rest[1];
  P = { ...base, [only]: require(path.resolve(rest[2])) };   // all three pools are still checked so nothing repeats across difficulties
} else P = require(path.resolve(rest[0] || "./words.js"));

const LINKLEN = { easy: 3, medium: 2, hard: 1 }, MAXSPAN = 15;
const count = (s, sub) => { let n = 0, i = -1; while ((i = s.indexOf(sub, i + 1)) >= 0) n++; return n; };
const nwords = s => s.trim().split(/\s+/).filter(Boolean).length;
let bad = 0;
const fail = (...a) => { console.log("FAIL", ...a); bad++; };
const seenClues = new Map(), usedWord = new Map(), usedBonus = new Map();   // global: nothing repeats anywhere, in any difficulty

for (const d of Object.keys(LINKLEN)) {
  const pool = P[d];
  if (!Array.isArray(pool) || pool.length < 7) { fail(d, "pool missing or has fewer than 7 chains"); continue; }
  pool.forEach((ch, ci) => {
    const tag = `${d}#${ci + 1}`;
    const words = ch.words || [], b = ch.bonus || {};
    if (words.length !== 9) fail(tag, "not 9 words:", words.length);
    const offs = [0], deltas = [], seen = new Set();
    let letters = "";
    words.forEach((e, i) => {
      const w = e.word;
      if (!/^[A-Z]+$/.test(w || "")) fail(tag, "bad word", w);
      else if (w.length < 4 || w.length > 12) fail(tag, "length out of 4-12:", w);
      if (seen.has(w)) fail(tag, "repeat in chain:", w); seen.add(w);
      if (usedWord.has(w)) fail(tag, "word", w, "already used in", usedWord.get(w));
      usedWord.set(w, tag);
      const c = e.clue;
      // Hard chains 2+ carry a tough `clue` (<= 9 words) plus a plain fallback (<= 6 words); everything else is <= 6.
      const tough = d === "hard" && ci > 0;
      if (tough && (typeof e.plain !== "string" || !e.plain.trim())) fail(tag, w, "hard chain needs a plain clue");
      if (!tough && e.plain) fail(tag, w, "unexpected plain clue");
      if (tough && e.plain) {
        if (nwords(e.plain) > 6) fail(tag, w, "plain clue > 6 words:", e.plain);
        if (e.plain.toUpperCase().includes(w)) fail(tag, w, "plain clue contains answer:", e.plain);
        const pk = e.plain.trim().toLowerCase();
        if (seenClues.has(pk)) fail(tag, w, "duplicate plain clue:", e.plain, "(also", seenClues.get(pk) + ")");
        seenClues.set(pk, tag + " " + w + " (plain)");
      }
      if (typeof c !== "string" || !c.trim()) fail(tag, w, "missing clue");
      else {
        if (nwords(c) > (tough ? 9 : 6)) fail(tag, w, "clue too long:", c);
        if (c.toUpperCase().includes(w)) fail(tag, w, "clue contains answer:", c);
        const k = c.trim().toLowerCase();
        if (seenClues.has(k)) fail(tag, w, "duplicate clue:", c, "(also", seenClues.get(k) + ")");
        seenClues.set(k, tag + " " + w);
      }
      if (i === 0) { if (e.link) fail(tag, "first word has a link"); return; }
      const p = words[i - 1].word, l = e.link;
      if (typeof l !== "string" || l.length !== LINKLEN[d]) { fail(tag, w, "link length must be", LINKLEN[d], "got", l); return; }
      const a = count(p, l), n = count(w, l);
      if (a !== 1 || n !== 1) fail(tag, p, "->", w, "link", l, "not unique (", a, n, ")");
      deltas.push(p.indexOf(l) - w.indexOf(l));
      offs.push(offs[i - 1] + deltas[i - 1]);
      letters += l[0];
    });
    const min = Math.min(...offs);
    const span = Math.max(...words.map((e, i) => offs[i] - min + (e.word || "").length));
    const neg = deltas.filter(x => x < 0).length, pos = deltas.filter(x => x > 0).length, zero = deltas.filter(x => x === 0).length;
    if (neg < 3 || pos < 3) fail(tag, "not meandering: neg", neg, "pos", pos);
    if (zero > 1) fail(tag, "more than one zero delta");
    for (let i = 2; i < deltas.length; i++) {
      const s = Math.sign(deltas[i]);
      if (s !== 0 && s === Math.sign(deltas[i - 1]) && s === Math.sign(deltas[i - 2])) { fail(tag, "3+ consecutive same-direction steps at", i + 1); break; }
    }
    if (span > MAXSPAN) fail(tag, "span", span, "> ", MAXSPAN);
    if (!/^[A-Z]{8}$/.test(b.answer || "")) fail(tag, "bonus not 8 letters A-Z:", b.answer);
    else if (b.answer !== letters) fail(tag, "bonus", b.answer, "!= link letters", letters);
    if (usedBonus.has(b.answer) && !(ci === 0 && usedBonus.get(b.answer).ci === 0)) fail(tag, "bonus", b.answer, "already used in", usedBonus.get(b.answer).tag);
    usedBonus.set(b.answer, { tag, ci });
    if (!b.clue || nwords(b.clue) > 8) fail(tag, "bonus clue missing or > 8 words");
    else if (b.clue.toUpperCase().includes(b.answer)) fail(tag, "bonus clue contains answer");
    if (words.some(e => e.word === b.answer)) fail(tag, "bonus answer is also a chain word");
    if (!quiet) console.log(`${tag} span ${span} deltas ${deltas.join(" ")} bonus ${b.answer}`);
  });
  console.log(`${d}: ${pool.length} chains checked`);
}
console.log(bad ? `FAILED (${bad})` : "all ok");
process.exit(bad ? 1 : 0);
