(() => {
  "use strict";
  const STORE = "meanderings-v1", PREFS = "meanderings-prefs";
  const WORD_POINTS = 100, MISS_COST = 10, REVEAL_COST = 15;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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
  const { rows, span } = layout(CHAIN);
  const MAX_SCORE = rows.length * WORD_POINTS;

  const $ = id => document.getElementById(id);
  const board = $("board"), msgEl = $("msg"), kb = $("kb");
  const el = (tag, cls) => { const e = document.createElement(tag); if (cls) e.className = cls; return e; };

  // ---- state ----
  // wMiss / wRev are the misses and revealed letters on the current word (they set its points).
  const fresh = () => ({ cur: 0, guesses: 0, wrong: 0, hints: 0, auto: 0, score: 0, wMiss: 0, wRev: 0 });
  let st = { ...fresh(), ...(load(STORE) || {}) };
  let prefs = { autoSecs: 0, ...(load(PREFS) || {}) };
  let guess = [], locked = [], shake = false, dance = false, busy = false;
  let lastProgress = Date.now();

  function load(key) {
    try { return JSON.parse(localStorage.getItem(key)); } catch (e) { return null; }
  }
  function save() {
    try { localStorage.setItem(STORE, JSON.stringify(st)); localStorage.setItem(PREFS, JSON.stringify(prefs)); } catch (e) {}
  }
  const done = () => st.cur >= rows.length;
  const reveals = () => st.hints + st.auto;

  function startRow() {
    lastProgress = Date.now();
    if (done()) { guess = []; locked = []; return; }
    const r = rows[st.cur];
    guess = Array(r.word.length).fill("");
    locked = Array(r.word.length).fill(false);
    for (let k = 0; k < r.linkLen; k++) {
      guess[r.linkIdx + k] = r.word[r.linkIdx + k];
      locked[r.linkIdx + k] = "link";
    }
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
      board.append(entry);
      if (active) activeEntry = entry;
    }
    if (done()) board.append(summary());
    $("progress").textContent = done() ? "Complete" : `Word ${st.cur + 1} of ${rows.length}`;
    $("stats").textContent = `Score ${st.score} · ${st.wrong} miss${st.wrong === 1 ? "" : "es"} · ${reveals()} reveal${reveals() === 1 ? "" : "s"}`;
    $("hint").disabled = done();
    (activeEntry || board.lastElementChild)?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }

  function summary() {
    const s = el("div", "summary");
    const h = el("h2"); h.textContent = "Chain complete!";
    const big = el("div", "big"); big.textContent = `${st.score} / ${MAX_SCORE}`;
    const p = el("div");
    p.textContent = `${st.wrong} misses · ${st.hints} hints · ${st.auto} auto-reveals`;
    const copy = el("button", "btn"); copy.textContent = "Copy result";
    copy.onclick = async () => {
      const text = `Meanderings — ${st.score}/${MAX_SCORE} (${st.wrong} misses, ${reveals()} reveals)`;
      try { await navigator.clipboard.writeText(text); flash("Copied"); } catch (e) { flash(text); }
    };
    const again = el("button", "btn"); again.textContent = "Play again";
    again.onclick = () => { st = fresh(); save(); startRow(); flash(""); render(); window.scrollTo(0, 0); };
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
  const locked_ = () => done() || busy;
  function type(ch) {
    if (locked_()) return;
    const j = guess.findIndex(c => !c);
    if (j < 0) return;
    guess[j] = ch.toUpperCase();
    render();
  }
  function back() {
    if (locked_()) return;
    for (let j = guess.length - 1; j >= 0; j--) {
      if (guess[j] && !locked[j]) { guess[j] = ""; break; }
    }
    render();
  }
  function submit() {
    if (locked_()) return;
    const r = rows[st.cur];
    if (guess.some(c => !c)) { flash("Fill every box first"); return; }
    st.guesses++;
    if (guess.join("") === r.word) { solved(r); return; }
    st.wrong++; st.wMiss++;
    let kept = 0;
    for (let j = 0; j < guess.length; j++) {
      if (locked[j]) continue;
      if (guess[j] === r.word[j]) { locked[j] = "good"; kept++; } else guess[j] = "";
    }
    flash(kept ? `${kept} letter${kept > 1 ? "s" : ""} in the right spot — kept` : "No letters in the right spot");
    shake = true; save(); render();
  }

  // Correct line: award points, do the letter dance, then move to the next word.
  function solved(r) {
    const points = Math.max(0, WORD_POINTS - MISS_COST * st.wMiss - REVEAL_COST * st.wRev);
    st.score += points;
    flash(`+${points}`);
    busy = true; dance = true;
    render();
    const wait = reduceMotion ? 250 : 650 + r.word.length * 70 + 150;
    setTimeout(() => {
      st.cur++; st.wMiss = 0; st.wRev = 0;
      save(); startRow(); busy = false; flash(""); render();
    }, wait);
  }

  // Reveal one unlocked letter. kind: "hint" (button) or "auto" (timer). Both cost points.
  function reveal(kind) {
    if (locked_()) return;
    const j = locked.findIndex(l => !l);
    if (j < 0) return;
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

  // ---- settings ----
  const sel = $("autoSecs");
  sel.value = String(prefs.autoSecs);
  sel.addEventListener("change", () => {
    prefs.autoSecs = Number(sel.value); lastProgress = Date.now(); save(); tick(); sel.blur();
  });
  $("settingsBtn").addEventListener("click", e => {
    const p = $("settings"); p.hidden = !p.hidden; e.currentTarget.blur();
  });

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
  $("hint").addEventListener("click", e => { reveal("hint"); e.currentTarget.blur(); });
  document.addEventListener("keydown", e => {
    if (e.target.tagName === "SELECT") return;
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (/^[a-zA-Z]$/.test(e.key)) type(e.key);
    else if (e.key === "Backspace") back();
    else if (e.key === "Enter") { e.preventDefault(); submit(); }
  });
  window.addEventListener("resize", size);

  size(); startRow(); render();
})();
