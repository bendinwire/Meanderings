(() => {
  "use strict";
  const PREFS = "meanderings-prefs", STATS = "meanderings-stats", KEYV = "meanderings-v3";
  const WORD_POINTS = 100, WORD_FLOOR = 10;
  const BONUS_LETTERS = 8, BONUS_PER = 25, BONUS_MISS = 15, BONUS_MIN = 25;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Difficulty rules. `keep`: a miss leaves correctly placed letters (green). `blind`: the box count is
  // hidden (you type the whole word). `delay`: seconds before the clue appears. Link length (3/2/1 letters)
  // is part of the puzzle data in words.js.
  const DIFFS = {
    easy:   { label: "Easy",   keep: true,  miss: 8,  reveal: 10, blind: false, delay: 0 },
    medium: { label: "Medium", keep: true,  miss: 10, reveal: 12, blind: false, delay: 0 },
    hard:   { label: "Hard",   keep: false, miss: 15, reveal: 15, blind: true,  delay: 8 },
  };
  // Combo: each consecutive clean word (no miss, no reveal) raises the multiplier; any slip resets it.
  const mult = c => Math.min(3, 1 + 0.25 * c);
  const fmt = n => Math.round(n).toLocaleString("en-US");

  // ---- calendar: puzzle #1 is EPOCH; ?date=YYYY-MM-DD previews another "today" ----
  const EPOCH = Date.UTC(2026, 10, 4);
  const dateFor = day => new Date(EPOCH + day * 864e5).toISOString().slice(0, 10);
  const today = (() => {
    const q = new URLSearchParams(location.search).get("date");
    let y, m, d;
    if (q && /^\d{4}-\d{2}-\d{2}$/.test(q)) { [y, m, d] = q.split("-").map(Number); m--; }
    else { const n = new Date(); y = n.getFullYear(); m = n.getMonth(); d = n.getDate(); }
    return { day: Math.round((Date.UTC(y, m, d) - EPOCH) / 864e5) };
  })();
  today.date = dateFor(today.day);
  const mod = (a, n) => ((a % n) + n) % n;

  // ---- layout: align each word's linked letters under the previous word's ----
  function layout(words) {
    const rows = [];
    words.forEach((e, i) => {
      if (i === 0) { rows.push({ ...e, off: 0, linkIdx: -1, linkLen: 0 }); return; }
      const prev = rows[i - 1];
      const pi = prev.word.indexOf(e.link), ni = e.word.indexOf(e.link);
      if (pi < 0 || ni < 0) throw new Error(`Bad link "${e.link}" for ${e.word}`);
      rows.push({ ...e, off: prev.off + pi - ni, linkIdx: ni, linkLen: e.link.length });
    });
    const min = Math.min(...rows.map(r => r.off));
    rows.forEach(r => (r.off -= min));
    return { rows, span: Math.max(...rows.map(r => r.off + r.word.length)) };
  }

  const $ = id => document.getElementById(id);
  const board = $("board"), msgEl = $("msg"), kb = $("kb");
  const el = (tag, cls) => { const e = document.createElement(tag); if (cls) e.className = cls; return e; };
  const load = key => { try { return JSON.parse(localStorage.getItem(key)); } catch (e) { return null; } };

  // ---- state ----
  const fresh = () => ({
    cur: 0, guesses: 0, wrong: 0, hints: 0, auto: 0, score: 0, wMiss: 0, wRev: 0,
    combo: 0, bestCombo: 0, log: [], bonus: { done: false, pts: 0, miss: 0 }, runId: Date.now(),
  });
  let prefs = { autoSecs: 0, diff: "easy", sound: true, haptics: true, ...(load(PREFS) || {}) };
  if (!DIFFS[prefs.diff]) prefs.diff = "easy";
  FX.setPrefs(prefs);
  let diff = prefs.diff;
  let view = { kind: "puzzle", day: today.day };           // or { kind: "random" }
  let chain = null, rows = [], span = 1, MAX_SCORE = 0, st = fresh();
  let guess = [], locked = [], typed = "", bPrefix = 0, sel = -1;
  let shake = false, dance = false, busy = false, finale = false, celebrate = false;
  let rowStart = Date.now(), lastProgress = Date.now(), clueEl = null, runToken = 0, lastRandom = -1;
  const cfg = () => DIFFS[diff];
  const isDaily = () => view.kind === "puzzle" && view.day === today.day;
  const done = () => st.cur >= rows.length;
  const reveals = () => st.hints + st.auto;
  const blindNow = () => cfg().blind && !done() && !busy;

  const storeKey = (k, v = view) => `${KEYV}:${v.kind === "random" ? "random" : dateFor(v.day)}:${k}`;
  // Prefs and game state are saved separately: changing `diff` or `view` must never write the old state
  // under the new key (the state for the new puzzle is loaded by setup()).
  function savePrefs() { try { localStorage.setItem(PREFS, JSON.stringify(prefs)); } catch (e) {} }
  function save() {
    st.row = done() ? null : { cur: st.cur, guess, locked, typed, bPrefix };
    try { localStorage.setItem(storeKey(diff), JSON.stringify(st)); } catch (e) {}
    savePrefs();
  }

  function setup() {
    runToken++; busy = false; finale = false; celebrate = false; sel = -1;
    const pool = POOLS[diff];
    const saved = load(storeKey(diff));
    const defaults = fresh();
    st = { ...defaults, ...(saved || {}), bonus: { ...defaults.bonus, ...((saved && saved.bonus) || {}) } };
    if (view.kind === "random") {
      if (!saved || st.idx === undefined) {
        do { st.idx = Math.floor(Math.random() * pool.length); } while (pool.length > 1 && st.idx === lastRandom);
      }
    } else st.idx = mod(view.day, pool.length);
    chain = pool[st.idx % pool.length];
    ({ rows, span } = layout(chain.words));
    MAX_SCORE = rows.reduce((s, _, i) => s + WORD_POINTS * mult(i), 0) + BONUS_PER * BONUS_LETTERS;
    updateNav();
    $("scoreNote").textContent =
      `Each word is worth 100 points before the combo multiplier. On ${cfg().label}, a miss costs ${cfg().miss} and ` +
      `every revealed letter (hint or auto) costs ${cfg().reveal}; a solved word is always worth at least ${WORD_FLOOR}. ` +
      `Clean words (no miss, no reveal) build a combo: ×1.25, ×1.5 … up to ×3. Any slip resets it.` +
      (cfg().keep ? "" : " Misses don't tell you which letters were right.") +
      (cfg().blind ? " Hard is blind: no letter count, and the clue arrives after a few seconds." : "");
    startRow(true); size(); render(); updateTabs();
    if (view.kind === "random") save();
  }

  function startRow(restore) {
    lastProgress = rowStart = Date.now();
    sel = -1; typed = ""; bPrefix = 0;
    if (done()) { guess = []; locked = []; return; }
    const r = rows[st.cur];
    guess = Array(r.word.length).fill("");
    locked = Array(r.word.length).fill(false);
    for (let k = 0; k < r.linkLen; k++) {
      guess[r.linkIdx + k] = r.word[r.linkIdx + k];
      locked[r.linkIdx + k] = "link";
    }
    const sv = st.row;
    if (restore && sv && sv.cur === st.cur) {
      if (sv.guess?.length === r.word.length && sv.locked?.length === r.word.length) {
        guess = sv.guess.slice(); locked = sv.locked.slice();
      }
      if (typeof sv.typed === "string") { typed = sv.typed; bPrefix = sv.bPrefix || 0; }
    }
  }

  // ---- top bar: puzzle navigation, tabs ----
  function updateNav() {
    const isRandom = view.kind === "random";
    $("puzzle").textContent = isRandom
      ? "Random chain"
      : `#${view.day + 1} · ${new Date(EPOCH + view.day * 864e5).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" })}`
;
    $("prevBtn").disabled = isRandom || view.day <= 0;
    $("nextBtn").disabled = isRandom || view.day >= today.day;
    $("todayBtn").disabled = isDaily();
  }
  function updateTabs() {
    document.querySelectorAll(".seg").forEach(b => {
      const k = b.dataset.d;
      const s = k === diff ? st : load(storeKey(k));
      const fin = s && s.cur >= POOLS[k][0].words.length;
      b.textContent = DIFFS[k].label + (fin ? " ✓" : "");
      b.classList.toggle("on", k === diff);
    });
  }
  function go(v) {
    if (busy) return;
    save(); view = v; flash(""); setup(); window.scrollTo(0, 0);
  }

  // ---- sizing: shrink tiles so the full width of the chain fits ----
  function size() {
    const avail = Math.min(window.innerWidth - 32, 760);
    let gap = 6;
    let cell = Math.floor((avail - (span - 1) * gap) / span);
    if (cell < 26) { gap = 3; cell = Math.floor((avail - (span - 1) * gap) / span); }
    cell = Math.max(18, Math.min(52, cell));
    const s = document.documentElement.style;
    s.setProperty("--cell", cell + "px");
    s.setProperty("--gap", gap + "px");
    board.style.width = span * cell + (span - 1) * gap + "px";
  }

  // ---- render ----
  const clueLeft = () => (cfg().delay ? cfg().delay - (Date.now() - rowStart) / 1000 : 0);

  function render() {
    board.innerHTML = "";
    clueEl = null;
    const pitch = "(var(--cell) + var(--gap))";
    const blind = blindNow();
    const last = Math.min(st.cur, rows.length - 1);
    let activeEntry = null;
    for (let i = 0; i <= last; i++) {
      const r = rows[i];
      const active = i === st.cur;
      const entry = el("div", "entry" + (active ? " active" : ""));
      entry.style.setProperty("--r", i);
      const tiles = el("div", "tiles");

      if (active && blind) {
        // Blind row: only the shared (gold) letters, in their column. The answer is typed in the strip below.
        entry.classList.add("blind");
        tiles.style.marginLeft = `calc(${pitch} * ${r.off + Math.max(r.linkIdx, 0)})`;
        if (r.linkLen) {
          for (let k = 0; k < r.linkLen; k++) {
            const t = el("div", "tile link"); t.textContent = r.word[r.linkIdx + k]; tiles.append(t);
          }
        } else { const t = el("div", "tile empty"); t.textContent = "?"; tiles.append(t); }
      } else {
        tiles.style.marginLeft = `calc(${pitch} * ${r.off})`;
        const nextEmpty = active ? guess.findIndex(c => !c) : -1;
        for (let j = 0; j < r.word.length; j++) {
          const t = el("div", "tile");
          t.style.setProperty("--i", j);
          if (active) {
            t.textContent = guess[j] || "";
            if (locked[j] === "link") t.classList.add("link");
            else if (locked[j] === "auto") t.classList.add("auto");
            else if (locked[j]) t.classList.add("good");
            else if (j === nextEmpty) t.classList.add("cursor");
            if (!locked[j] && !busy) {
              t.classList.add("tap");
              if (j === sel) t.classList.add("pick");
              t.onclick = () => { sel = sel === j ? -1 : j; render(); };
            }
          } else {
            t.textContent = r.word[j];
            t.classList.add("solved");
            if (j >= r.linkIdx && j < r.linkIdx + r.linkLen) t.classList.add("link");
          }
          tiles.append(t);
        }
      }
      if (active && shake) { entry.classList.add("shake"); shake = false; }
      if ((active && dance) || finale) entry.classList.add("dance");
      if (active) dance = false;

      const clue = el("div", "clue"), cs = el("span");
      clue.append(cs);
      if (active) {
        const left = clueLeft();
        if (left > 0 && !busy) { cs.textContent = `Clue in ${Math.ceil(left)}s…`; clue.classList.add("pending"); }
        else cs.textContent = r.clue;
        clueEl = { clue, cs, text: r.clue };
      } else cs.textContent = r.clue;
      entry.append(tiles, clue);

      if (active && blind) {
        const strip = el("div", "strip");
        for (let k = 0; k < typed.length; k++) {
          const t = el("div", "tile" + (k < bPrefix ? " good" : "")); t.textContent = typed[k]; strip.append(t);
        }
        strip.append(el("div", "tile empty cursor"));
        const tag = el("div", "blindtag"); tag.textContent = "Blind · type the whole word";
        entry.append(strip, tag);
      }
      if (active && !busy) {
        const hw = el("div", "hintwrap");
        const hb = el("button", "btn");
        hb.textContent = !blind && sel >= 0 ? "Reveal this letter" : "Hint";
        hb.onclick = () => { reveal("hint"); hb.blur(); };
        hw.append(hb);
        if (blind || sel < 0) {
          const tip = el("div", "hinttip");
          tip.textContent = blind ? "Reveals the next letter of the word" : "Tap a box first to choose which letter to reveal";
          hw.append(tip);
        }
        entry.append(hw);
      }
      board.append(entry);
      if (active) activeEntry = entry;
    }
    if (done()) board.append(summary());
    document.body.classList.toggle("finished", done());
    $("progress").textContent = done() ? "Complete" : `Word ${st.cur + 1} of ${rows.length}`;
    const m = mult(st.combo);
    $("stats").innerHTML = `Score ${fmt(st.score)}` +
      (m > 1 && !done() ? ` · <span class="combo">🔥×${m}</span>` : "") +
      ` · ${st.wrong} miss${st.wrong === 1 ? "" : "es"} · ${reveals()} reveal${reveals() === 1 ? "" : "s"}`;
    finale = false;
    drawMeander();
    renderBonus();
    (activeEntry || board.lastElementChild)?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }

  // ---- the literal meander: a line snaking through the shared letters of the whole chain ----
  function roundedPath(P, r) {
    let d = `M${P[0][0]},${P[0][1]}`;
    for (let i = 1; i < P.length - 1; i++) {
      const [x0, y0] = P[i - 1], [x1, y1] = P[i], [x2, y2] = P[i + 1];
      const l1 = Math.hypot(x1 - x0, y1 - y0), l2 = Math.hypot(x2 - x1, y2 - y1);
      const rr = Math.min(r, l1 / 2, l2 / 2);
      d += ` L${x1 - ((x1 - x0) / l1) * rr},${y1 - ((y1 - y0) / l1) * rr}` +
           ` Q${x1},${y1} ${x1 + ((x2 - x1) / l2) * rr},${y1 + ((y2 - y1) / l2) * rr}`;
    }
    const L = P[P.length - 1];
    return d + ` L${L[0]},${L[1]}`;
  }
  function drawMeander() {
    const entries = [...board.querySelectorAll(".entry")];
    if (!entries.length) return;
    const br = board.getBoundingClientRect();
    const ctr = t => { const q = t.getBoundingClientRect(); return [q.left - br.left + q.width / 2, q.top - br.top + q.height / 2]; };
    const avg = list => { const c = list.map(ctr); return [c.reduce((s, p) => s + p[0], 0) / c.length, c[0][1]]; };
    const P = [];
    entries.forEach((en, i) => {
      const tiles = [...en.querySelectorAll(".tiles .tile")], r = rows[i];
      if (!tiles.length) return;
      const blindRow = en.classList.contains("blind");
      const entry = blindRow || (i === 0 && !r.linkLen) ? avg(tiles)
        : i === 0 ? ctr(tiles[0])
        : avg(tiles.slice(r.linkIdx, r.linkIdx + r.linkLen));
      P.push(entry);
      if (blindRow) return;
      const nxt = rows[i + 1];
      if (i + 1 < entries.length && nxt) {
        const pi = r.word.indexOf(nxt.link);
        P.push([avg(tiles.slice(pi, pi + nxt.linkLen))[0], entry[1]]);
      } else if (done()) P.push(ctr(tiles[tiles.length - 1]));
    });
    const Q = P.filter((p, i) => i === 0 || Math.hypot(p[0] - P[i - 1][0], p[1] - P[i - 1][1]) > 0.5);
    const old = $("meander"); if (old) old.remove();
    if (Q.length < 2) return;
    const cell = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--cell")) || 40;
    const NS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(NS, "svg");
    svg.id = "meander";
    svg.setAttribute("width", board.scrollWidth); svg.setAttribute("height", board.scrollHeight);
    const path = document.createElementNS(NS, "path");
    path.setAttribute("d", roundedPath(Q, cell * 0.45));
    path.setAttribute("stroke-width", Math.max(3, cell * 0.3));
    svg.append(path);
    board.prepend(svg);
    if (celebrate) {
      const len = path.getTotalLength();
      path.style.strokeDasharray = len; path.style.setProperty("--len", len);
      path.classList.add("flow"); celebrate = false;
    } else if (done()) path.classList.add("done");
  }

  // ---- share grid: the meander shape, one block per letter ----
  // g = solved yourself, y = shared (free), r = hint, o = auto-reveal, plus a trailing X per miss.
  const EMOJI = { g: "🟩", y: "🟨", r: "🟥", o: "🟧" };
  function gridRows() {
    return rows.map((r, i) => {
      const lg = (st.log || [])[i] || { rev: [], miss: 0 };
      const cells = [];
      for (let j = 0; j < r.word.length; j++) {
        const link = j >= r.linkIdx && j < r.linkIdx + r.linkLen;
        cells.push(link ? "y" : lg.rev[j] === "h" ? "r" : lg.rev[j] === "a" ? "o" : "g");
      }
      return { pad: r.off, padR: span - r.off - r.word.length, cells, miss: lg.miss || 0 };
    });
  }
  const missText = n => (n > 4 ? `❌×${n}` : "❌".repeat(n));
  const titleText = () => (view.kind === "random" ? "Meanderings (random)" : `Meanderings #${view.day + 1}`);
  function gridText() {
    const head = `${titleText()} · ${cfg().label} · ${fmt(st.score)}/${fmt(MAX_SCORE)}`;
    const extras = [];
    if (st.bonus.done) extras.push(`🎁 +${st.bonus.pts}`);
    if (st.bestCombo >= 3) extras.push(`🔥 ${st.bestCombo} clean in a row`);
    const lines = gridRows().map(g =>
      "⬛".repeat(g.pad) + g.cells.map(c => EMOJI[c]).join("") + "⬛".repeat(g.padR) + (g.miss ? " " + missText(g.miss) : ""));
    return `${head}${extras.length ? "\n" + extras.join(" · ") : ""}\n\n${lines.join("\n")}\n\nTry it: ${location.origin + location.pathname}`;
  }
  function gridEl() {
    const wrap = el("div", "sgrid");
    wrap.style.setProperty("--sb", Math.max(10, Math.min(18, Math.floor((window.innerWidth - 100) / span))) + "px");
    gridRows().forEach(g => {
      const line = el("div", "srow");
      line.append(...Array.from({ length: g.pad }, () => el("span", "sb k")));
      g.cells.forEach(c => line.append(el("span", "sb " + c)));
      line.append(...Array.from({ length: g.padR }, () => el("span", "sb k")));
      if (g.miss) { const x = el("span", "sx"); x.textContent = missText(g.miss); line.append(x); }
      wrap.append(line);
    });
    return wrap;
  }

  function summary() {
    const s = el("div", "summary");
    const h = el("h2"); h.textContent = "Chain complete!";
    const big = el("div", "big"); big.textContent = `${fmt(st.score)} / ${fmt(MAX_SCORE)}`;
    const p = el("div");
    const pl = (n, one, many) => `${n} ${n === 1 ? one : many}`;
    p.textContent = `${cfg().label} · ${pl(st.wrong, "miss", "misses")} · ${pl(st.hints, "hint", "hints")} · ` +
      `${pl(st.auto, "auto-reveal", "auto-reveals")} · best combo ${st.bestCombo}`;
    const legend = el("div", "legend");
    legend.textContent = "🟩 solved · 🟨 shared · 🟥 hint · 🟧 auto · ❌ miss";
    const copy = el("button", "btn"); copy.textContent = "Copy result";
    copy.onclick = async () => {
      const text = gridText();
      try { await navigator.clipboard.writeText(text); flash("Copied"); } catch (e) { flash(text); }
    };
    const again = el("button", "btn");
    again.textContent = view.kind === "random" ? "New random" : "Play again";
    again.onclick = () => {
      if (view.kind === "random") return newRandom();
      st = { ...fresh(), idx: st.idx }; startRow(); save(); flash(""); render(); updateTabs(); window.scrollTo(0, 0);
    };
    s.append(h, big, p);
    if (!st.bonus.done) {
      const b = el("div", "legend"); b.textContent = "🎁 Bonus still open: tap 🎁 above (25+ points)"; s.append(b);
    }
    s.append(gridEl(), legend, copy, again);
    return s;
  }

  let flashTimer;
  function flash(text) {
    msgEl.textContent = text;
    clearTimeout(flashTimer);
    if (text) flashTimer = setTimeout(() => (msgEl.textContent = ""), 3000);
  }

  // ---- input ----
  const blocked = () => done() || busy;
  function type(ch) {
    if (blocked()) return;
    if (blindNow()) {
      if (typed.length >= 14) return;
      typed += ch.toUpperCase();
    } else {
      const j = guess.findIndex(c => !c);
      if (j < 0) return;
      guess[j] = ch.toUpperCase();
    }
    FX.tick(); save(); render();
  }
  function back() {
    if (blocked()) return;
    if (blindNow()) {
      if (typed.length > bPrefix) typed = typed.slice(0, -1);
    } else {
      for (let j = guess.length - 1; j >= 0; j--) {
        if (guess[j] && !locked[j]) { guess[j] = ""; break; }
      }
    }
    FX.back(); save(); render();
  }
  function submit() {
    if (blocked()) return;
    const r = rows[st.cur];
    const blind = blindNow();
    if (blind ? !typed : guess.some(c => !c)) { flash(blind ? "Type your answer first" : "Fill every box first"); return; }
    st.guesses++;
    if ((blind ? typed : guess.join("")) === r.word) { solved(r); return; }
    st.wrong++; st.wMiss++;
    if (blind) {
      typed = typed.slice(0, bPrefix);
      flash("Not quite — try again");
    } else {
      let kept = 0;
      for (let j = 0; j < guess.length; j++) {
        if (locked[j]) continue;
        if (cfg().keep && guess[j] === r.word[j]) { locked[j] = "good"; kept++; } else guess[j] = "";
      }
      if (!cfg().keep) flash("Not quite — try again");
      else flash(kept ? `${kept} letter${kept > 1 ? "s" : ""} in the right spot — kept` : "No letters in the right spot");
    }
    FX.miss(); shake = true; save(); render();
  }

  // Correct line: score it (with combo), do the letter dance, then move on.
  function solved(r) {
    st.log = st.log || [];
    st.log[st.cur] = blindNow()
      ? { rev: Array.from(r.word, (_, k) => (k < bPrefix ? "h" : "")), miss: st.wMiss }
      : { rev: locked.map(l => (l === "hint" ? "h" : l === "auto" ? "a" : "")), miss: st.wMiss };
    const clean = st.wMiss === 0 && st.wRev === 0;
    const m = mult(st.combo);
    const base = Math.max(WORD_FLOOR, WORD_POINTS - cfg().miss * st.wMiss - cfg().reveal * st.wRev);
    const pts = Math.round(base * m);
    st.score += pts;
    const comboBefore = st.combo;
    st.combo = clean ? st.combo + 1 : 0;
    st.bestCombo = Math.max(st.bestCombo, st.combo);
    flash(m > 1 ? `+${pts}  (🔥×${m})` : `+${pts}`);
    FX.good(comboBefore);
    if (clean && [3, 5, 8].includes(st.combo)) FX.confetti(40 + st.combo * 8);
    busy = true; dance = true;
    // Show the whole word during the dance, even in blind mode.
    guess = Array.from(r.word);
    locked = guess.map((_, k) => (k >= r.linkIdx && k < r.linkIdx + r.linkLen ? "link" : "good"));
    render();
    const token = ++runToken;
    const wait = reduceMotion ? 250 : 650 + r.word.length * 70 + 150;
    setTimeout(() => {
      if (token !== runToken) return;
      st.cur++; st.wMiss = 0; st.wRev = 0;
      startRow(); busy = false; flash("");
      if (done()) { recordCompletion(); finale = true; celebrate = true; FX.finish(); }
      save(); render(); updateTabs();
    }, wait);
  }

  // Reveal one letter. kind: "hint" (button) or "auto" (timer). Both cost points and break the combo.
  const canReveal = () => (blindNow() ? bPrefix < rows[st.cur].word.length : locked.some(l => !l));
  function reveal(kind) {
    if (blocked() || !canReveal()) return;
    const w = rows[st.cur].word;
    if (blindNow()) {
      let p = bPrefix;
      while (p < typed.length && typed[p] === w[p]) p++;    // your correct typed prefix stays
      if (p >= w.length) return;
      typed = w.slice(0, p + 1); bPrefix = p + 1;
    } else {
      // Tapped box wins; otherwise the first open box not already holding the right letter.
      let j = kind === "hint" && sel >= 0 && !locked[sel] ? sel : locked.findIndex((l, k) => !l && guess[k] !== w[k]);
      if (j < 0) j = locked.findIndex(l => !l);
      sel = -1;
      guess[j] = w[j];
      locked[j] = kind === "auto" ? "auto" : "hint";
    }
    if (kind === "auto") st.auto++; else st.hints++;
    st.wRev++;
    lastProgress = Date.now();
    FX.reveal(); save(); render();
  }

  // ---- ticking: delayed clue + auto-reveal countdown ----
  function tick() {
    if (clueEl && !busy && cfg().delay) {
      const left = clueLeft();
      if (left > 0) clueEl.cs.textContent = `Clue in ${Math.ceil(left)}s…`;
      else if (clueEl.clue.classList.contains("pending")) {
        clueEl.cs.textContent = clueEl.text; clueEl.clue.classList.remove("pending");
      }
    }
    const t = $("timer"), secs = prefs.autoSecs;
    if (!secs || done() || busy || !canReveal()) { t.textContent = ""; return; }
    const left = secs - (Date.now() - lastProgress) / 1000;
    if (left <= 0) { reveal("auto"); flash("Auto-revealed a letter"); return; }
    t.textContent = `Next letter in ${Math.ceil(left)}s`;
  }
  setInterval(tick, 250);
  document.addEventListener("visibilitychange", () => { if (!document.hidden) lastProgress = Date.now(); });

  // ---- bonus puzzle: first gold letter of each row spells a hidden word ----
  const lettersShown = () => Math.min(done() ? rows.length - 1 : st.cur, BONUS_LETTERS);
  const bonusWorth = () => Math.max(BONUS_MIN, BONUS_PER * (BONUS_LETTERS - lettersShown()) - BONUS_MISS * st.bonus.miss);
  function renderBonus() {
    const answer = chain.bonus.answer, n = lettersShown();
    $("bonusClue").textContent = chain.bonus.clue;
    const wrap = $("bonusLetters"); wrap.innerHTML = "";
    for (let k = 0; k < BONUS_LETTERS; k++) {
      const s = el("span", k < n || st.bonus.done ? "got" : "");
      s.textContent = st.bonus.done ? answer[k] : k < n ? rows[k + 1].link[0] : "_";
      wrap.append(s);
    }
    $("bonusBtn").textContent = st.bonus.done ? "🎁✓" : "🎁";
    $("bonusNote").textContent = st.bonus.done
      ? `Solved! +${st.bonus.pts}`
      : `Worth ${bonusWorth()} now. Fewer letters shown = more points; each wrong guess costs ${BONUS_MISS}.`;
    $("bonusInput").disabled = st.bonus.done;
  }
  $("bonusBtn").addEventListener("click", e => { $("bonus").hidden = !$("bonus").hidden; e.currentTarget.blur(); });
  $("bonusForm").addEventListener("submit", e => {
    e.preventDefault();
    if (st.bonus.done || busy) return;
    const input = $("bonusInput"), g = input.value.trim().toUpperCase();
    if (!g) return;
    if (g === chain.bonus.answer) {
      const pts = bonusWorth();
      st.bonus.done = true; st.bonus.pts = pts; st.score += pts;
      FX.bonus(); FX.confetti(70); flash(`🎁 Bonus! +${pts}`);
      input.value = ""; save(); render();
    } else {
      st.bonus.miss++; FX.miss(); flash("Not the bonus word"); input.select(); save(); renderBonus();
    }
  });

  // ---- stats & streaks ----
  const loadStats = () => ({ done: {}, best: {}, played: {}, total: {}, perfect: {}, runs: [], seen: [], bestCombo: 0, maxStreak: 0, ...(load(STATS) || {}) });
  const dayNum = date => Math.round((Date.parse(date + "T00:00:00Z") - EPOCH) / 864e5);
  function streaks(doneMap) {
    const has = d => (doneMap[dateFor(d)] || []).length > 0;
    let d = today.day, cur = 0;
    if (!has(d)) d--;
    while (d >= 0 && has(d)) { cur++; d--; }
    const days = Object.keys(doneMap).map(dayNum).sort((a, b) => a - b);
    let best = 0, run = 0, prev = null;
    for (const x of days) { run = prev !== null && x === prev + 1 ? run + 1 : 1; best = Math.max(best, run); prev = x; }
    return { cur, best };
  }
  function recordCompletion() {
    const s = loadStats();
    if (s.runs.includes(st.runId)) return;
    if (view.kind === "puzzle") {
      // Only the first completion of a given day+difficulty counts (replays don't farm stats).
      const tag = `${dateFor(view.day)}:${diff}`;
      if (s.seen.includes(tag)) return;
      s.seen.push(tag); if (s.seen.length > 400) s.seen.shift();
    }
    s.runs.push(st.runId); if (s.runs.length > 200) s.runs.shift();
    s.played[diff] = (s.played[diff] || 0) + 1;
    s.total[diff] = (s.total[diff] || 0) + st.score;
    s.best[diff] = Math.max(s.best[diff] || 0, st.score);
    if (st.wrong === 0 && reveals() === 0) s.perfect[diff] = (s.perfect[diff] || 0) + 1;
    s.bestCombo = Math.max(s.bestCombo, st.bestCombo);
    if (isDaily()) s.done[today.date] = [...new Set([...(s.done[today.date] || []), diff])];
    s.maxStreak = Math.max(s.maxStreak, streaks(s.done).best);
    try { localStorage.setItem(STATS, JSON.stringify(s)); } catch (e) {}
  }
  function showStats() {
    const s = loadStats(), sk = streaks(s.done), body = $("statsBody");
    body.innerHTML = "";
    const top = el("div", "stat-top");
    [["Streak", sk.cur], ["Best streak", Math.max(sk.best, s.maxStreak)], ["Best combo", s.bestCombo]].forEach(([k, v]) => {
      const d = el("div"); const b = el("b"); b.textContent = v; d.append(b, k); top.append(d);
    });
    const tbl = el("table", "stat-tbl");
    tbl.innerHTML = "<tr><th></th><th>Played</th><th>Best</th><th>Avg</th><th>Perfect</th></tr>";
    Object.keys(DIFFS).forEach(k => {
      const n = s.played[k] || 0, tr = el("tr");
      [DIFFS[k].label, n, fmt(s.best[k] || 0), n ? fmt((s.total[k] || 0) / n) : "–", s.perfect[k] || 0].forEach(v => {
        const td = el("td"); td.textContent = v; tr.append(td);
      });
      tbl.append(tr);
    });
    const note = el("p", "legend");
    note.textContent = "Streak counts days with at least one finished daily chain. Archive and random chains count toward the table, not the streak.";
    body.append(top, tbl, note);
    $("statsDlg").showModal();
  }
  $("statsBtn").addEventListener("click", e => { showStats(); e.currentTarget.blur(); });

  // ---- settings, difficulty tabs, archive / random ----
  function newRandom() {
    if (busy) return;
    const prev = load(storeKey(diff, { kind: "random" }));
    lastRandom = prev && prev.idx !== undefined ? prev.idx : -1;
    try { localStorage.removeItem(storeKey(diff, { kind: "random" })); } catch (e) {}
    view = { kind: "random" }; flash(""); setup(); window.scrollTo(0, 0);
  }
  $("prevBtn").addEventListener("click", () => go({ kind: "puzzle", day: view.day - 1 }));
  $("nextBtn").addEventListener("click", () => go({ kind: "puzzle", day: view.day + 1 }));
  $("todayBtn").addEventListener("click", () => go({ kind: "puzzle", day: today.day }));
  $("randomBtn").addEventListener("click", () => { newRandom(); $("randomBtn").blur(); });
  document.querySelectorAll(".seg").forEach(b => b.addEventListener("click", () => {
    b.blur();
    if (busy || b.dataset.d === diff) return;
    save(); diff = prefs.diff = b.dataset.d; savePrefs(); flash(""); setup(); window.scrollTo(0, 0);
  }));

  const autoSel = $("autoSecs");
  autoSel.value = String(prefs.autoSecs);
  autoSel.addEventListener("change", () => {
    prefs.autoSecs = Number(autoSel.value); lastProgress = Date.now(); save(); tick(); autoSel.blur();
  });
  $("soundOn").checked = prefs.sound; $("hapticsOn").checked = prefs.haptics;
  $("soundOn").addEventListener("change", e => { prefs.sound = e.target.checked; FX.setPrefs(prefs); save(); if (prefs.sound) FX.good(0); });
  $("hapticsOn").addEventListener("change", e => { prefs.haptics = e.target.checked; FX.setPrefs(prefs); save(); if (prefs.haptics) FX.reveal(); });
  $("settingsBtn").addEventListener("click", e => { const p = $("settings"); p.hidden = !p.hidden; e.currentTarget.blur(); });

  // ---- keyboard wiring ----
  const KEYS = ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"];
  KEYS.forEach((letters, ri) => {
    const row = el("div", "krow");
    if (ri === 2) row.append(key("ENTER", "enter", true));
    for (const c of letters) row.append(key(c, c));
    if (ri === 2) row.append(key("⌫", "back", true));
    kb.append(row);
  });
  function key(label, k, wide) {
    const b = el("button", "key" + (wide ? " wide" : ""));
    b.textContent = label; b.dataset.k = k;
    return b;
  }
  kb.addEventListener("click", e => {
    const b = e.target.closest(".key"); if (!b) return;
    const k = b.dataset.k;
    if (k === "enter") submit(); else if (k === "back") back(); else type(k);
    b.blur();
  });
  document.addEventListener("keydown", e => {
    if (["SELECT", "INPUT", "TEXTAREA"].includes(e.target.tagName) || $("statsDlg").open) return;
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (/^[a-zA-Z]$/.test(e.key)) type(e.key);
    else if (e.key === "Backspace") back();
    else if (e.key === "Enter") { e.preventDefault(); submit(); }
  });
  window.addEventListener("resize", () => { size(); drawMeander(); });

  // Drop saves older than 30 days so localStorage doesn't grow forever.
  try {
    const cut = dateFor(today.day - 30);
    Object.keys(localStorage).forEach(k => {
      const m = /^meanderings-v[23]:(\d{4}-\d{2}-\d{2}):/.exec(k);
      if (m && m[1] < cut) localStorage.removeItem(k);
    });
  } catch (e) {}

  setup();
})();
