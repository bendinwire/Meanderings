// node content/med/assemble.js : builds content/pool-medium.js from words.js kept chains + med/s{n}.json + med/c{n}.js
const fs=require("fs"),path=require("path");
const base=require("../../words.js").medium;
const fresh=[];
for(let n=1;;n++){const sp=path.join(__dirname,`s${n}.json`),cp=path.join(__dirname,`c${n}.js`);
  if(!fs.existsSync(sp)||!fs.existsSync(cp))break;
  const S=JSON.parse(fs.readFileSync(sp)),C=require(cp);
  if(S.length!==C.length)throw new Error(`round ${n}: ${S.length} chains vs ${C.length} clue rows`);
  S.forEach((ch,i)=>{if(C[i].length!==10)throw new Error(`round ${n} chain ${i} clue count ${C[i].length}`);
    fresh.push({bonus:{answer:ch.bonus,clue:C[i][0]},words:ch.words.map((w,j)=>w.link?{word:w.word,clue:C[i][j+1],link:w.link}:{word:w.word,clue:C[i][j+1]})})});}
const pool=[];const keep=[0,1,3,4,6];
keep.forEach(i=>pool[i]=base[i]);let k=0;
for(let i=0;i<61&&k<fresh.length;i++){if(!pool[i])pool[i]=fresh[k++]}
const out=pool.filter(Boolean);
fs.writeFileSync(path.join(__dirname,"..","pool-medium.js"),"module.exports = "+JSON.stringify(out,null,1)+";\n");
console.log("pool",out.length,"fresh used",k,"of",fresh.length);
