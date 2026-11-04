const path=require("path"),D=__dirname;const E=require("./pool-easy.js");
const others={};for(const f of ["pool-medium.js","pool-hard.js"]){try{others[f]=require(path.join(D,f));}catch(e){console.log("no",f)}}
const base=require("../words.js");
const W=new Map(),B=new Map(),C=new Map();
const add=(tag,ch)=>{ch.words.forEach(w=>{W.set(w.word,tag);C.set(w.clue.toLowerCase().trim(),tag)});B.set(ch.bonus.answer,tag);C.set(ch.bonus.clue.toLowerCase().trim(),tag)};
let n=0;for(const [f,p] of Object.entries(others))p.forEach((ch,i)=>add(f+"#"+i,ch));
["medium","hard"].forEach(d=>base[d].forEach((ch,i)=>add("words."+d+i,ch)));
const bad=[];E.forEach((ch,i)=>{ch.words.forEach(w=>{if(W.has(w.word))bad.push(["word",w.word,i,W.get(w.word)]);if(B.has(w.word))bad.push(["word=bonus",w.word,i,B.get(w.word)]);if(C.has(w.clue.toLowerCase().trim()))bad.push(["clue",w.clue,i,C.get(w.clue.toLowerCase().trim())])});
 if(B.has(ch.bonus.answer))bad.push(["bonus",ch.bonus.answer,i,B.get(ch.bonus.answer)]);if(W.has(ch.bonus.answer))bad.push(["bonus=word",ch.bonus.answer,i,W.get(ch.bonus.answer)]);
 if(C.has(ch.bonus.clue.toLowerCase().trim()))bad.push(["bclue",ch.bonus.clue,i,0])});
// within easy: bonus vs words
const ew=new Set();E.forEach(ch=>ch.words.forEach(w=>ew.add(w.word)));E.forEach((ch,i)=>{if(ew.has(ch.bonus.answer))bad.push(["easy bonus=word",ch.bonus.answer,i])});
console.log("easy",E.length,"vs others:",Object.fromEntries(Object.entries(others).map(([k,v])=>[k,v.length])),"conflicts:",bad.length);bad.forEach(b=>console.log(JSON.stringify(b)));
