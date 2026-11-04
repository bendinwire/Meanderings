// node content/build-hard.js : merges cand-hard-N.json + hard-clues-N.txt into content/pool-hard.js
const fs=require("fs"),path=require("path");
const base=require("../words.js").hard;
const cands={};
const out=[...base];
for(let n=1;fs.existsSync(path.join(__dirname,`hard-clues-${n}.txt`));n++){
 const cj=JSON.parse(fs.readFileSync(path.join(__dirname,`cand-hard-${n}.json`)));
 for(const c of cj)cands[n+":"+c.bonus]=c;
 let cur=null;
 for(const line of fs.readFileSync(path.join(__dirname,`hard-clues-${n}.txt`),"utf8").split("\n")){
  if(!line.trim())continue;
  if(line.startsWith("# ")){const [b,bc]=line.slice(2).split(" | ");const c=cands[n+":"+b];if(!c)throw new Error("no cand "+b);cur={bonus:{answer:b,clue:bc.trim()},words:[],src:c};out.push(cur);continue;}
  const [w,cl]=line.split(" | ");const i=cur.words.length;const sw=cur.src.words[i];
  if(sw.word!==w)throw new Error("mismatch "+cur.bonus.answer+" "+w+" vs "+sw.word);
  const e={word:w,clue:cl.trim()};if(sw.link)e.link=sw.link;cur.words.push(e);
 }
}
out.forEach(c=>delete c.src);
fs.writeFileSync(path.join(__dirname,"pool-hard.js"),"module.exports = "+JSON.stringify(out,null,1)+";\n");
console.log(out.length,"chains");
