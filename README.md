Meanderings

A daily word-chain guessing game. Static site: index.html, game.js, words.js, assets/.

- Play: https://flexgames.com/meanderings/
- Deploy: ./deploy.sh (rsync to the nginx-proxy html volume on the tlb box; served by flexgames.com's /meanderings/ location)
- Puzzles: edit words.js, then run `node validate.js` (links unique, chains meander, widths fit)
- Preview another day locally: ?date=YYYY-MM-DD
