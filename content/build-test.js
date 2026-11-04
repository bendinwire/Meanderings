// node content/build-test.js
// Assembles ../test-words.js (the puzzles served at /meanderings/test/) from content/test-{easy,medium,hard}.json.
// These puzzles are fake and share nothing with words.js, so playing them never spoils a real day.
const fs = require("fs"), path = require("path");
const root = path.resolve(__dirname, "..");
const P = {};
for (const d of ["easy", "medium", "hard"]) P[d] = JSON.parse(fs.readFileSync(path.join(__dirname, `test-${d}.json`), "utf8"));
const header = "// TEST puzzles for /meanderings/test/ only (7 chains per difficulty). They share no word, bonus answer or clue with\n" +
  "// words.js, so testing never spoils a real day. Built by content/build-test.js from content/test-*.json; check with\n" +
  "//   node validate.js test-words.js   and   node content/check-test.js <diff> content/test-<diff>.json\n";
fs.writeFileSync(path.join(root, "test-words.js"), header + "const POOLS = " + JSON.stringify(P, null, 1) + ";\n\nif (typeof module !== \"undefined\") module.exports = POOLS;\n");
console.log("wrote test-words.js:", Object.entries(P).map(([d, p]) => `${d}:${p.length}`).join(" "));
