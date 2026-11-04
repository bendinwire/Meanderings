const mine=require("./pool-hard.js").slice(7);const bad=[];
for(const f of ["pool-easy.js","pool-medium.js"]){let o;try{o=require("./"+f);}catch(e){console.log("cannot load",f);continue;}
 const W=new Set(),B=new Set(),C=new Set();
 o.forEach(c=>{B.add(c.bonus.answer);C.add(c.bonus.clue.toLowerCase());c.words.forEach(w=>{W.add(w.word);C.add(w.clue.toLowerCase());});});
 console.log(f,o.length);
 mine.forEach((c,i)=>{if(B.has(c.bonus.answer))console.log("bonus",c.bonus.answer,f);if(C.has(c.bonus.clue.toLowerCase()))console.log("clue",c.bonus.clue,f);
  c.words.forEach(w=>{if(W.has(w.word))console.log("word",w.word,f,"chain",i+7);if(C.has(w.clue.toLowerCase()))console.log("clue",w.clue,f);});});}
