const P={medium:require("../pool-medium.js"),easy:require("../pool-easy.js"),hard:require("../pool-hard.js")};
const seen={w:new Map(),b:new Map(),c:new Map()};let bad=0;
for(const d of ["hard","medium","easy"])P[d].forEach((ch,i)=>{
 const add=(m,k,t)=>{if(m.has(k)){console.log("DUP",k,"|",d+"#"+(i+1),"vs",m.get(k));bad++}else m.set(k,d+"#"+(i+1))};
 add(seen.b,ch.bonus.answer);add(seen.c,ch.bonus.clue.toLowerCase());
 ch.words.forEach(w=>{add(seen.w,w.word);add(seen.c,w.clue.toLowerCase())});});
// bonus answers vs words
for(const [b,t] of seen.b)if(seen.w.has(b)){console.log("BONUS=WORD",b,t,seen.w.get(b));bad++}
console.log(Object.entries(P).map(([k,v])=>k+":"+v.length).join(" "),"dups",bad);
