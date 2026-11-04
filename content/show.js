const c=JSON.parse(require("fs").readFileSync(process.argv[2]));
c.forEach((x,i)=>console.log(i,x.bonus,x.words.map(w=>w.word+(w.link?"("+w.link+")":"")).join(" ")));
