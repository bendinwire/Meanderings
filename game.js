(() => {
  "use strict";
  const PREFS = "meanderings-prefs";
  const WORD_POINTS = 100, WORD_FLOOR = 10; // a solved word never scores less than the floor
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Difficulty rules. `keep`: a miss leaves the correctly placed letters (green) in place.
  const DIFFS = {
    easy:   { label: "Easy",   keep: true,  miss: 8,  reveal: 10 },
    medium: { label: "Medium", keep: true,  miss: 10, reveal: 12 },
    hard:   { label: "Hard",   keep: false, miss: 15, reveal: 15 },
  };

  // ---- today's puzzle: the chain for each difficulty rotates daily (?date=YYYY-MM-DD to preview) ----
  const EPOCH = Date.UTC(2026, 10, 4); // puzzle #1
  const today = (() => {
    const q = new URLSearchParams(location.search).get("date");
    let y, m, d;
    if (q && /^\d{4}-\d{2}-\d{2}$/.test(q)) { [y, m, d] = q.split("-").map(Number); m--; }
    else { const n = new Date(); y = n.getFullYear(); m = n.getMonth(); d = n.getDate(); }
    const day = Math.round((Date.UTC(y, m, d) - EPOCH) / 864e5);
    return { day, date: `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}` };
  })();
  const chainFor = k => { const p = POOLS[k]; return p[((today.day % p.length) + p.length) % p.length]; };
  const storeKey = k => `meanderings-v2:${today.date}:${k}`;

  // ---- layout: align each word's linked letters under the previous word's ----
  function layout(chain) {
    const rows = [];
    chain.forEach((e, i) => {
      if (i === 0) { rows.push({ ...e, off: 0, linkIdx: -1, linkLen: 0 }); return; }
      const prev = rows[i - 1];
      const pi = prev.word.indexOf(e.link), ni = e.word.indexOf(e.link);
      if (pi < 0 || ni < 0) throw new Error(`Bad link "${e.link}" for ${e.word}`);
      rows.push({ ...e, off: prev.off + pi - ni, linkIdx: ni, linkLen: e.link.length });
    });
    const min = Math.min(...rows.map(r => r.off));
    rows.forEach(r => (r.off -= min));
    const span = Math.max(...rows.map(r => r.off + r.word.length));
    return { rows, span };
  }

  const $ = id => document.getElementById(id);
  const board = $("board"), msgEl = $("msg"), kb = $("kb");
  const el = (tag, cls) => { const e = document.createElement(tag); if (cls) e.className = cls; return e; };

  // ---- state ----
  // wMiss / wRev are the misses and revealed letters on the current word (they set its points).
  const fresh = () => ({ cur: 0, guesses: 0, wrong: 0, hints: 0, auto: 0, score: 0, wMiss: 0, wRev: 0 });
  const load = key => { try { return JSON.parse(localStorage.getItem(key)); } catch (e) { return null; } };
  let prefs = { autoSecs: 0, diff: "easy", ...(load(PREFS) || {}) };
  if (!DIFFS[prefs.diff]) prefs.diff = "easy";
  let diff = prefs.diff, rows = [], span = 1, MAX_SCORE = 0, st = fresh();
  let guess = [], locked = [], shake = false, dance = false, busy = false;
  let sel = -1; // box the player tapped to receive the next hint
  let lastProgress = Date.now();
  const cfg = () => DIFFS[diff];

  function save() {
    try { localStorage.setItem(storeKey(diff), JSON.stringify(st)); localStorage.setItem(PREFS, JSON.stringify(prefs)); } catch (e) {}
  }
  const done = () => st.cur >= rows.length;
  const reveals = () => st.hints + st.auto;

  function setup() {
    ({ rows, span } = layout(chainFor(diff)));
    MAX_SCORE = rows.length * WORD_POINTS;
    st = { ...fresh(), ...(load(storeKey(diff)) || {}) };
    busy = false;
    $("puzzle").textContent = `Puzzle #${today.day + 1} · ${cfg().label}`;
    $("scoreNote").textContent =
      `Each word is worth 100 points. On ${cfg().label}, a miss costs ${cfg().miss} and every revealed letter ` +
      `(hint or auto) costs ${cfg().reveal}. A solved word always scores at least ${WORD_FLOOR}.` +
      (cfg().keep ? "" : " Misses don't tell you which letters were right.");
    startRow(); size(); render(); updateTabs();
  }

  function startRow() {
    lastProgress = Date.now();
    sel = -1;
    if (done()) { guess = []; locked = []; return; }
    const r = rows[st.cur];
    guess = Array(r.word.length).fill("");
    locked = Array(r.word.length).fill(false);
    for (let k = 0; k < r.linkLen; k++) {
      guess[r.linkIdx + k] = r.word[r.linkIdx + k];
      locked[r.linkIdx + k] = "link";
    }
  }

  function updateTabs() {
    document.querySelectorAll(".seg").forEach(b => {
      const k = b.dataset.d;
      const s = k === diff ? st : load(storeKey(k));
      const fin = s && s.cur >= chainFor(k).length;
      b.textContent = DIFFS[k].label + (fin ? " ✓" : "");
      b.classList.toggle("on", k === diff);
    });
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
  function render() {
    board.innerHTML = "";
    let activeEntry = null;
    const last = Math.min(st.cur, rows.length - 1);
    for (let i = 0; i <= last; i++) {
      const r = rows[i];
      const active = i === st.cur;
      const entry = el("div", "entry" + (active ? " active" : ""));
      const tiles = el("div", "tiles");
      tiles.style.marginLeft = `calc((var(--cell) + var(--gap)) * ${r.off})`;
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
      if (active && shake) { entry.classList.add("shake"); shake = false; }
      if (active && dance) { entry.classList.add("dance"); dance = false; }
      const clue = el("div", "clue");
      clue.textContent = r.clue;
      entry.append(tiles, clue);
      if (active && !busy) {
        const hw = el("div", "hintwrap");
        const hb = el("button", "btn");
        hb.textContent = sel >= 0 ? "Reveal this letter" : "Hint";
        hb.onclick = () => { reveal("hint"); hb.blur(); };
        hw.append(hb);
        if (sel < 0) {
          const tip = el("div", "hinttip");
          tip.textContent = "Tap a box first to choose which letter to reveal";
          hw.append(tip);
        }
        entry.append(hw);
      }
      board.append(entry);
      if (active) activeEntry = entry;
    }
    if (done()) board.append(summary());
    $("progress").textContent = done() ? "Complete" : `Word ${st.cur + 1} of ${rows.length}`;
    $("stats").textContent = `Score ${st.score} · ${st.wrong} miss${st.wrong === 1 ? "" : "es"} · ${reveals()} reveal${reveals() === 1 ? "" : "s"}`;
    (activeEntry || board.lastElementChild)?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }

  function summary() {
    const s = el("div", "summary");
    const h = el("h2"); h.textContent = "Chain complete!";
    const big = el("div", "big"); big.textContent = `${st.score} / ${MAX_SCORE}`;
    const p = el("div");
    p.textContent = `${cfg().label} · ${st.wrong} misses · ${st.hints} hints · ${st.auto} auto-reveals`;
    const copy = el("button", "btn"); copy.textContent = "Copy result";
    copy.onclick = async () => {
      const url = location.origin + location.pathname;
      const text = `Meanderings #${today.day + 1} (${cfg().label}) — ${rows.length} words, ${st.wrong} misses, ${reveals()} reveals, ${st.score}/${MAX_SCORE}\nTry it: ${url}`;
      try { await navigator.clipboard.writeText(text); flash("Copied"); } catch (e) { flash(text); }
    };
    const again = el("button", "btn"); again.textContent = "Play again";
    again.onclick = () => { st = fresh(); save(); startRow(); flash(""); render(); updateTabs(); window.scrollTo(0, 0); };
    s.append(h, big, p, copy, again);
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
    const j = guess.findIndex(c => !c);
    if (j < 0) return;
    guess[j] = ch.toUpperCase();
    render();
  }
  function back() {
    if (blocked()) return;
    for (let j = guess.length - 1; j >= 0; j--) {
      if (guess[j] && !locked[j]) { guess[j] = ""; break; }
    }
    render();
  }
  function submit() {
    if (blocked()) return;
    const r = rows[st.cur];
    if (guess.some(c => !c)) { flash("Fill every box first"); return; }
    st.guesses++;
    if (guess.join("") === r.word) { solved(r); return; }
    st.wrong++; st.wMiss++;
    let kept = 0;
    for (let j = 0; j < guess.length; j++) {
      if (locked[j]) continue;
      if (cfg().keep && guess[j] === r.word[j]) { locked[j] = "good"; kept++; } else guess[j] = "";
    }
    if (!cfg().keep) flash("Not quite — try again");
    else flash(kept ? `${kept} letter${kept > 1 ? "s" : ""} in the right spot — kept` : "No letters in the right spot");
    shake = true; save(); render();
  }

  // Correct line: award points, do the letter dance, then move to the next word.
  function solved(r) {
    const points = Math.max(WORD_FLOOR, WORD_POINTS - cfg().miss * st.wMiss - cfg().reveal * st.wRev);
    st.score += points;
    flash(`+${points}`);
    busy = true; dance = true;
    render();
    const wait = reduceMotion ? 250 : 650 + r.word.length * 70 + 150;
    const d = diff;
    setTimeout(() => {
      if (d !== diff) return; // switched difficulty mid-dance; state was already saved below
      st.cur++; st.wMiss = 0; st.wRev = 0;
      save(); startRow(); busy = false; flash(""); render(); updateTabs();
    }, wait);
  }

  // Reveal one unlocked letter. kind: "hint" (button) or "auto" (timer). Both cost points.
  function reveal(kind) {
    if (blocked()) return;
    const j = kind === "hint" && sel >= 0 && !locked[sel] ? sel : locked.findIndex(l => !l);
    if (j < 0) return;
    sel = -1;
    guess[j] = rows[st.cur].word[j];
    locked[j] = kind === "auto" ? "auto" : "good";
    if (kind === "auto") st.auto++; else st.hints++;
    st.wRev++;
    lastProgress = Date.now();
    save(); render();
  }

  // ---- auto-reveal timer ----
  function tick() {
    const t = $("timer");
    const secs = prefs.autoSecs;
    if (!secs || done() || busy || !locked.some(l => !l)) { t.textContent = ""; return; }
    const left = secs - (Date.now() - lastProgress) / 1000;
    if (left <= 0) { reveal("auto"); flash("Auto-revealed a letter"); return; }
    t.textContent = `Next letter in ${Math.ceil(left)}s`;
  }
  setInterval(tick, 250);
  document.addEventListener("visibilitychange", () => { if (!document.hidden) lastProgress = Date.now(); });

  // ---- settings & difficulty ----
  const autoSel = $("autoSecs");
  autoSel.value = String(prefs.autoSecs);
  autoSel.addEventListener("change", () => {
    prefs.autoSecs = Number(autoSel.value); lastProgress = Date.now(); save(); tick(); autoSel.blur();
  });
  $("settingsBtn").addEventListener("click", e => {
    const p = $("settings"); p.hidden = !p.hidden; e.currentTarget.blur();
  });
  document.querySelectorAll(".seg").forEach(b => b.addEventListener("click", () => {
    b.blur();
    if (busy || b.dataset.d === diff) return;
    save();
    diff = prefs.diff = b.dataset.d;
    flash(""); save(); setup(); window.scrollTo(0, 0);
  }));

  // ---- wiring ----
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
    if (e.target.tagName === "SELECT") return;
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (/^[a-zA-Z]$/.test(e.key)) type(e.key);
    else if (e.key === "Backspace") back();
    else if (e.key === "Enter") { e.preventDefault(); submit(); }
  });
  window.addEventListener("resize", size);

  setup();
})();
