// merges rounds-easy/clues-N.js (picks over cand-N.json) into accepted-easy.json and writes pool-easy.js
const fs = require("fs"), path = require("path");
const D = __dirname, base = require("../words.js");
const acc = [];
for (let n = 1; fs.existsSync(path.join(D, `rounds-easy/clues${n}.js`)); n++) {
  const cand = JSON.parse(fs.readFileSync(path.join(D, `rounds-easy/cand${n}.json`)));
  for (const [i, bc, clues] of require(path.join(D, `rounds-easy/clues${n}.js`))) {
    const c = cand[i];
    if (clues.length !== 9) throw new Error(`round ${n} cand ${i}: ${clues.length} clues`);
    acc.push({ bonus: { answer: c.bonus, clue: bc }, words: c.words.map((w, k) => ({ word: w.word, clue: clues[k], ...(w.link ? { link: w.link } : {}) })) });
  }
}
const OW = new Set(), OB = new Set(), OC = new Set();
const eatO = ch => { ch.words.forEach(w => { OW.add(w.word); OC.add(w.clue.toLowerCase().trim()); }); OB.add(ch.bonus.answer); OC.add(ch.bonus.clue.toLowerCase().trim()); };
base.medium.forEach(eatO); base.hard.forEach(eatO);
for (const f of ["pool-medium.js", "pool-hard.js"]) { try { require(path.join(D, f)).forEach(eatO); } catch (e) {} }
eatO(base.easy[0]); eatO(base.easy[4]); OB.add("SEASONAL");
const kept = [], dropped = [];
acc.forEach((ch, i) => {
  const ws = ch.words.map(w => w.word), cl = ch.words.map(w => w.clue.toLowerCase().trim()).concat(ch.bonus.clue.toLowerCase().trim());
  const bad = ws.filter(w => OW.has(w) || OB.has(w)).concat(OB.has(ch.bonus.answer) || OW.has(ch.bonus.answer) ? [ch.bonus.answer] : []).concat(cl.filter(c => OC.has(c)));
  if (bad.length) dropped.push(i + ":" + bad.join(",")); else { kept.push(ch); eatO(ch); }
});
console.log("dropped", dropped.length, dropped.join(" | "));
acc.length = 0; kept.forEach(c => acc.push(c));
fs.writeFileSync(path.join(D, "accepted-easy.json"), JSON.stringify(acc));
const keep = [base.easy[0], base.easy[4]];
const order = [keep[0], acc[0], acc[1], acc[2], keep[1], acc[3], acc[4], ...acc.slice(5)];
const pool = order.filter(Boolean);
fs.writeFileSync(path.join(D, "pool-easy.js"), "module.exports = " + JSON.stringify(pool, null, 1) + ";\n");
console.log("accepted", acc.length, "pool", pool.length);
