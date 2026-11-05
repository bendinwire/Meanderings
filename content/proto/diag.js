const C = require("./cands"); const cnt=(s,c)=>s.split(c).length-1;
for (const t of Object.keys(C)) {
  const w=[...new Set(C[t])].filter(x=>!x.includes(t));
  const per=[...t].map((L,i)=>w.filter(x=>cnt(x,L)===1).length);
  // words usable at position k need both link letters t[k-1] (in) and t[k] (out)
  const mid=[1,2,3,4,5,6,7].map(k=>w.filter(x=>cnt(x,t[k-1])===1&&cnt(x,t[k])===1).length);
  console.log(t.padEnd(9), w.length, "link:", per.join(" "), "| mid(2-8):", mid.join(" "));
}
