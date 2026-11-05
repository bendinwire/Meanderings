// node proto/pick.js [seed]  greedy pick of one chain per theme with global uniqueness; prints them for review
const { execFileSync } = require("child_process");
const T = ["BASEBALL","SEASHORE","HOSPITAL","AIRPLANE","SANDWICH","PAINTING","HARDWARE","RAILROAD","MUSICIAN","GARDENER","NAVIGATE","SCULPTOR","VINEYARD","TYPEFACE","PHARMACY"];
const used = []; const seed = process.argv[2] || "1";
for (const t of T) {
  const out = execFileSync("node", ["proto/search.js", t, "1"], { env: { ...process.env, SEED: seed, USED: JSON.stringify(used) } }).toString().split("\n");
  const line = out[1]; console.log(t.padEnd(9), line);
  const words = line.split(" ").slice(2).map(w => w.replace("*", "")); used.push(...words);
}
