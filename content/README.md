# content/ — puzzle generation tools and working files

`../words.js` is the source of truth (61 chains per difficulty, puzzles #1–#61 = Nov 4, 2026 – Jan 3, 2027).
Check any change with `node ../validate.js`. Rules: link length 3/2/1 (easy/medium/hard), meander (>=3 left, >=3 right,
no 3 same-direction steps in a row), span <= 15, bonus = first letter of each link (8-letter common word), and
NOTHING repeats anywhere (no word, bonus answer or clue, across all three difficulties).

Reusable:
- `wordlist.txt`            vetted common words (~3,300). The per-difficulty `wordlist-*.txt` extend it.
- `search.js`               original chain generator (see its header). `search-{easy,medium,hard}.js` are the per-difficulty
                            variants used for batch 1; they also read the `bonus-*.txt` / block lists.
- `swap.js <diff> <chain> <word>`   lists replacement words that keep a chain valid (used to swap out edgy words).

Batch-1 working files (clues were hand-written; safe to ignore): `build-*.js`, `check-easy.js`, `cand-hard-*.json`,
`hard-clues-*.txt`, `rounds-easy/`, `med/`, `accepted-easy.json`, block/blacklist lists.

Next batch: when you need puzzles #62+, generate new chains avoiding every word/bonus/clue already in words.js
(validate with `node validate.js`), append them to the end of each pool in words.js, and deploy with `../deploy.sh`.
Appending keeps every already-published day's puzzle unchanged (day number mod pool size).
