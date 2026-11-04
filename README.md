Meanderings

A daily word-chain guessing game. Static site: index.html, game.js, fx.js, words.js, assets/.

- Play: https://flexgames.com/meanderings/
- Deploy: ./deploy.sh (rsync to the nginx-proxy html volume on the tlb box; served by flexgames.com's /meanderings/ location)
- Puzzles: words.js holds 7 chains per difficulty (easy = 3 shared letters, medium = 2, hard = 1). Each chain has a
  hidden 8-letter bonus word spelled by the first letter of each link. Check edits with `node validate.js`.
  `node content/search.js --help` (see its header) finds new candidate chains from content/wordlist.txt; clues are hand-written.
- Modes: daily (by date), archive (‹ › past days), random. Hard is blind (no letter count) with a delayed clue.
- Preview another day locally: ?date=YYYY-MM-DD
- Saves are per-browser localStorage (keys meanderings-v3:<date|random>:<difficulty>, meanderings-stats, meanderings-prefs).
