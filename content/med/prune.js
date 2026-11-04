// remove fresh chains colliding with hard pool (words/bonus/clues) ; node prune.js
const fs=require("fs"),path=require("path");
const hp=require("../pool-hard.js");
const W=new Set(),B=new Set(),C=new Set();
hp.forEach(c=>{B.add(c.bonus.answer);C.add(c.bonus.clue.toLowerCase());c.words.forEach(w=>{W.add(w.word);C.add(w.clue.toLowerCase())})});
let removed=0;
for(let n=1;;n++){const sp=path.join(__dirname,`s${n}.json`),cp=path.join(__dirname,`c${n}.js`);
 if(!fs.existsSync(sp)||!fs.existsSync(cp))break;
 const S=JSON.parse(fs.readFileSync(sp));delete require.cache[cp];const Cl=require(cp);
 const keepS=[],keepC=[];
 S.forEach((ch,i)=>{const cl=Cl[i];
  const bad=B.has(ch.bonus)||W.has(ch.bonus)||ch.words.some(w=>B.has(w.word))||C.has(cl[0].toLowerCase())||ch.words.some((w,j)=>W.has(w.word)||C.has(cl[j+1].toLowerCase()));
  if(bad)removed++;else{keepS.push(ch);keepC.push(cl)}});
 fs.writeFileSync(sp,JSON.stringify(keepS));fs.writeFileSync(cp,"module.exports="+JSON.stringify(keepC)+";\n");}
console.log("removed",removed);
