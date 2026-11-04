const fs=require("fs"),path=require("path");
const arg=(k,d)=>{const i=process.argv.indexOf("--"+k);return i>0?process.argv[i+1]:d;};
const SEED=+arg("seed",1),COUNT=+arg("count",15),MAXSPAN=15;
const P=require("../words.js");
const used=new Set(),usedB=new Set();
for(const d of Object.keys(P))for(const c of P[d]){usedB.add(c.bonus.answer);c.words.forEach(w=>used.add(w.word));}
for(const f of ["pool-easy.js","pool-medium.js"]){try{for(const c of require("./"+f)){usedB.add(c.bonus.answer);c.words.forEach(w=>used.add(w.word));}}catch(e){}}
// words already chosen in hard pool so far (new ones)
let mine=[];try{mine=require("./pool-hard.js");}catch(e){}
for(const c of mine){usedB.add(c.bonus.answer);c.words.forEach(w=>used.add(w.word));}
const BX=new Set(fs.readFileSync(path.join(__dirname,"bonus-hard.txt"),"utf8").split(/\s+/));
const BL=new Set(fs.readFileSync(path.join(__dirname,"blacklist-hard.txt"),"utf8").split(/\s+/).filter(Boolean).map(s=>s.toUpperCase()));
const BONUS=fs.readFileSync(path.join(__dirname,"bonus-hard.txt"),"utf8").split(/\s+/).filter(w=>/^[A-Z]{8}$/.test(w)&&!usedB.has(w));
let s=SEED>>>0;const rnd=()=>{s=(s+0x6D2B79F5)>>>0;let t=s;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return((t^(t>>>14))>>>0)/4294967296;};
const shuffle=a=>{for(let i=a.length-1;i>0;i--){const j=Math.floor(rnd()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
const ok=w=>/^[A-Z]{5,9}$/.test(w)&&!used.has(w)&&!BL.has(w)&&!BX.has(w)&&!/(TION|SION|MENT|NESS|ITY|ANCE|ENCE|ISM)$/.test(w)&&!/(ED|ING|LY)$/.test(w)&&!(/S$/.test(w)&&!/(SS|US|IS)$/.test(w));
const WORDS=[...new Set(fs.readFileSync(path.join(__dirname,"wordlist-hard.txt"),"utf8").split("\n").filter(l=>!l.startsWith("#")).join(" ").split(/\s+/).map(w=>w.toUpperCase()))].filter(ok);
const cnt=(w,c)=>w.split(c).length-1;
const uniq=w=>[...new Set(w.split(""))].filter(c=>cnt(w,c)===1);
const byL={};for(const w of WORDS)for(const c of uniq(w))(byL[c]=byL[c]||[]).push(w);
const usedG=new Set(),out=[];
function dfs(bonus,start){
 const words=[{word:start}],inC=new Set([start]),deltas=[],offs=[0];let budget=3000;
 const spanOK=()=>{let mn=1e9,mx=-1e9;words.forEach((e,i)=>{mn=Math.min(mn,offs[i]);mx=Math.max(mx,offs[i]+e.word.length);});return mx-mn<=MAXSPAN;};
 function rec(step){
  if(budget--<0)return false;
  if(step===9){const n=deltas.filter(d=>d<0).length,p=deltas.filter(d=>d>0).length;return n>=3&&p>=3;}
  const prev=words[step-1].word,l=bonus[step-1];
  if(cnt(prev,l)!==1)return false;
  const opts=(byL[l]||[]).filter(w=>!inC.has(w)&&!usedG.has(w)&&w!==bonus);
  shuffle(opts);
  for(const w of opts.slice(0,40)){
   const d=prev.indexOf(l)-w.indexOf(l),n=deltas.length;
   if(d===0&&deltas.includes(0))continue;
   if(n>=2&&d!==0&&Math.sign(deltas[n-1])===Math.sign(d)&&Math.sign(deltas[n-2])===Math.sign(d))continue;
   words.push({word:w,link:l});inC.add(w);deltas.push(d);offs.push(offs[offs.length-1]+d);
   if(spanOK()&&rec(step+1))return true;
   words.pop();inC.delete(w);deltas.pop();offs.pop();
  }
  return false;}
 return rec(1)?words.map(e=>({...e})):null;}
const bonuses=shuffle(BONUS.slice());
for(const b of bonuses){if(out.length>=COUNT)break;
 for(const st of shuffle(WORDS.filter(w=>!usedG.has(w)&&cnt(w,b[0])===1)).slice(0,300)){
  const ch=dfs(b,st);if(ch){out.push({bonus:b,words:ch});ch.forEach(e=>usedG.add(e.word));break;}}}
console.log(JSON.stringify(out));
console.error(out.length,"chains");
