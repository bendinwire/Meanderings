// node validate.js [path]   (default ./words.js)
// Validates a Meanderings pools file: { easy:[{bonus:{answer,clue}, words:[{word,clue,link?}]}], medium, hard }.
// Exits non-zero on any failure; prints one summary line per chain.
const path = require("path");
const file = path.resolve(process.argv[2] || "./words.js");
const P = require(file);
const LINKLEN = { easy: 3, medium: 2, hard: 1 }, MAXSPAN = 15;
const count = (s, sub) => { let n = 0, i = -1; while ((i = s.indexOf(sub, i + 1)) >= 0) n++; return n; };
const nwords = s => s.trim().split(/\s+/).filter(Boolean).length;
let bad = 0;
const fail = (...a) => { console.log("FAIL", ...a); bad++; };
const seenClues = new Map();

for (const d of Object.keys(LINKLEN)) {
  const pool = P[d];
  if (!Array.isArray(pool)) { fail(d, "missing pool"); continue; }
  if (pool.length !== 7) fail(d, "expected 7 chains, got", pool.length);
  const usedWords = new Map(), usedBonus = new Set();
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
      if (usedWords.has(w)) fail(tag, "word reused across chains:", w, "(also", usedWords.get(w) + ")");
      usedWords.set(w, tag);
      const c = e.clue;
      if (typeof c !== "string" || !c.trim()) fail(tag, w, "missing clue");
      else {
        if (nwords(c) > 6) fail(tag, w, "clue > 6 words:", c);
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
    if (usedBonus.has(b.answer)) fail(tag, "duplicate bonus in difficulty:", b.answer); usedBonus.add(b.answer);
    if (!b.clue || nwords(b.clue) > 8) fail(tag, "bonus clue missing or > 8 words");
    else if (b.clue.toUpperCase().includes(b.answer)) fail(tag, "bonus clue contains answer");
    if (words.some(e => e.word === b.answer)) fail(tag, "bonus answer is also a chain word");
    console.log(`${tag} span ${span} deltas ${deltas.join(" ")} bonus ${b.answer}`);
  });
}
console.log(bad ? `FAILED (${bad})` : "all ok");
process.exit(bad ? 1 : 0);
