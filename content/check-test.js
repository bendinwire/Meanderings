// node content/check-test.js <diff> <file.json>
// Checks a set of TEST chains (array in the words.js chain shape) for one difficulty:
//  1. every puzzle rule in validate.js (run against a temp pools file where <diff> is replaced by the test chains,
//     so repeats against the other two real difficulties are caught too);
//  2. zero overlap (words, bonus answers, clues incl. plain clues) with the REAL pool of the same difficulty in words.js,
//     so nothing in the test set can ever spoil a real puzzle.
const fs = require("fs"), path = require("path"), cp = require("child_process"), os = require("os");
const [diff, file] = process.argv.slice(2);
const root = path.resolve(__dirname, "..");
const real = require(path.join(root, "words.js"));
const test = JSON.parse(fs.readFileSync(path.resolve(file), "utf8"));
const tmp = path.join(os.tmpdir(), `check-test-${diff}-${process.pid}.js`);
fs.writeFileSync(tmp, "module.exports = " + JSON.stringify({ ...real, [diff]: test }) + ";");
let bad = 0;
try { cp.execFileSync("node", [path.join(root, "validate.js"), tmp, "--quiet"], { encoding: "utf8", stdio: "pipe" }); }
catch (e) { String(e.stdout).split("\n").filter(l => l.startsWith("FAIL")).forEach(l => { console.log(l); bad++; }); }
fs.unlinkSync(tmp);
const seen = new Set(), add = t => seen.add(String(t).trim().toLowerCase());
real[diff].forEach(c => { c.words.forEach(w => { add(w.word); add(w.clue); if (w.plain) add(w.plain); }); add(c.bonus.answer); add(c.bonus.clue); });
test.forEach((c, ci) => {
  const hit = (v, what) => { if (seen.has(String(v).trim().toLowerCase())) { console.log(`FAIL test ${diff}#${ci + 1} ${what} also in the real ${diff} pool: ${v}`); bad++; } };
  c.words.forEach(w => { hit(w.word, "word"); hit(w.clue, "clue"); if (w.plain) hit(w.plain, "plain clue"); });
  hit(c.bonus.answer, "bonus answer"); hit(c.bonus.clue, "bonus clue");
});
console.log(bad ? `FAILED (${bad})` : `ok: ${test.length} test ${diff} chains pass every rule and share nothing with the real ${diff} pool`);
process.exit(bad ? 1 : 0);
