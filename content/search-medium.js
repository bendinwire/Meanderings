// medium generator: node content/search-medium.js SEED COUNT > out.json ; skips words/bonuses already used anywhere
const fs=require("fs"),path=require("path");
const SEED=+process.argv[2]||1,COUNT=+process.argv[3]||15,MAXSPAN=14,L=2;
const root=path.join(__dirname,"..");
const used=new Set(),usedB=new Set();
const base=require(path.join(root,"words.js"));
for(const d of Object.keys(base))base[d].forEach((c,i)=>{if(d==="medium"&&(i===2||i===5))return;c.words.forEach(w=>used.add(w.word));usedB.add(c.bonus.answer)});
for(const f of ["pool-easy.js","pool-hard.js","pool-medium.js","taken.json"]){const p=path.join(__dirname,f);if(!fs.existsSync(p))continue;
  try{if(f==="taken.json"){const t=JSON.parse(fs.readFileSync(p));t.words.forEach(w=>used.add(w));t.bonus.forEach(b=>usedB.add(b));}
  else{delete require.cache[p];require(p).forEach(c=>{c.words.forEach(w=>used.add(w.word));usedB.add(c.bonus.answer)})}}catch(e){console.error("skip",f,e.message)}}
const usedW=new Set(used);
fs.readFileSync(path.join(__dirname,"bonus-medium.txt"),"utf8").split(/\s+/).forEach(b=>used.add(b.toUpperCase()));
for(const f of ["bonus-hard.txt","bonus-block.txt"])fs.readFileSync(path.join(__dirname,f),"utf8").split(/\s+/).forEach(b=>b&&used.add(b.toUpperCase()));
usedB.forEach(b=>used.add(b));
const stop=new Set(fs.readFileSync(path.join(__dirname,"stop-medium.txt"),"utf8").split(/\s+/).map(w=>w.toUpperCase()));
const WORDS=[...new Set(fs.readFileSync(path.join(__dirname,"wordlist-medium.txt"),"utf8").split("\n").filter(l=>!l.startsWith("#")).join(" ").split(/\s+/).map(w=>w.toUpperCase()).filter(w=>/^[A-Z]{4,10}$/.test(w)))].filter(w=>!stop.has(w)&&!used.has(w));
const BONUS=fs.readFileSync(path.join(__dirname,"bonus-medium.txt"),"utf8").split(/\s+/).map(w=>w.toUpperCase()).filter(w=>/^[A-Z]{8}$/.test(w)&&!usedB.has(w)&&!usedW.has(w));
let s=SEED>>>0;const rnd=()=>{s=(s+0x6D2B79F5)>>>0;let t=s;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return((t^(t>>>14))>>>0)/4294967296};
const shuffle=a=>{for(let i=a.length-1;i>0;i--){const j=Math.floor(rnd()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const subs=new Map(),idx=new Map();
for(const w of WORDS){const c=new Map();for(let i=0;i+L<=w.length;i++){const x=w.substr(i,L);c.set(x,(c.get(x)||0)+1)}
 const u=[...c].filter(([,n])=>n===1).map(([x])=>x);subs.set(w,u);for(const x of u){if(!idx.has(x))idx.set(x,[]);idx.get(x).push(w)}}
const usedG=new Set(),chains=[];
function dfs(bonus,start){const words=[{word:start}],inC=new Set([start]),deltas=[],offs=[0];let budget=6000;
 const spanOK=()=>{let mn=1e9,mx=-1e9;for(let i=0;i<words.length;i++){mn=Math.min(mn,offs[i]);mx=Math.max(mx,offs[i]+words[i].word.length)}return mx-mn<=MAXSPAN};
 function rec(step){if(budget--<0)return false;
  if(step===9){const n=deltas.filter(d=>d<0).length,p=deltas.filter(d=>d>0).length;return n>=3&&p>=3}
  const prev=words[step-1].word,need=bonus[step-1],opts=[];
  for(const link of subs.get(prev)){if(link[0]!==need)continue;for(const w of idx.get(link))if(!inC.has(w)&&![...inC].some(x=>x.slice(0,4)===w.slice(0,4)||x.includes(w)||w.includes(x))&&!usedG.has(w)&&w!==bonus)opts.push([link,w])}
  shuffle(opts);
  for(const [link,w] of opts.slice(0,40)){const d=prev.indexOf(link)-w.indexOf(link),n=deltas.length;
   if(d===0&&deltas.includes(0))continue;
   if(n>=2&&d!==0&&Math.sign(deltas[n-1])===Math.sign(d)&&Math.sign(deltas[n-2])===Math.sign(d))continue;
   words.push({word:w,link});inC.add(w);deltas.push(d);offs.push(offs[offs.length-1]+d);
   if(spanOK()&&rec(step+1))return true;
   words.pop();inC.delete(w);deltas.pop();offs.pop()}
  return false}
 return rec(1)?words.map(e=>({...e})):null}
for(const b of shuffle(BONUS.slice())){if(chains.length>=COUNT)break;
 for(const st of shuffle(WORDS.filter(w=>!usedG.has(w))).slice(0,300)){const ch=dfs(b,st);if(ch){chains.push({bonus:b,words:ch});ch.forEach(e=>usedG.add(e.word));break}}}
console.log(JSON.stringify(chains));console.error(chains.length,"chains");
