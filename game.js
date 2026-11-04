(() => {
  "use strict";
  const STORE = "meanderings-v1";

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

  const $ = id => document.getElementById(id);
  const board = $("board"), msgEl = $("msg"), kb = $("kb");
  const el = (tag, cls) => { const e = document.createElement(tag); if (cls) e.className = cls; return e; };

  // ---- state ----
  const fresh = () => ({ cur: 0, guesses: 0, wrong: 0, hints: 0 });
  let st = load() || fresh();
  let guess = [], locked = [], shake = false;

  function load() {
    try { const s = JSON.parse(localStorage.getItem(STORE)); return s && s.cur >= 0 ? s : null; }
    catch (e) { return null; }
  }
  function save() { try { localStorage.setItem(STORE, JSON.stringify(st)); } catch (e) {} }
  const done = () => st.cur >= rows.length;

  function startRow() {
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
        if (active) {
          t.textContent = guess[j] || "";
          if (locked[j] === "link") t.classList.add("link");
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
      const clue = el("div", "clue");
      clue.textContent = r.clue;
      entry.append(tiles, clue);
      board.append(entry);
      if (active) activeEntry = entry;
    }
    if (done()) board.append(summary());
    $("progress").textContent = done() ? "Complete" : `Word ${st.cur + 1} of ${rows.length}`;
    $("stats").textContent = `${st.wrong} miss${st.wrong === 1 ? "" : "es"} · ${st.hints} hint${st.hints === 1 ? "" : "s"}`;
    $("hint").disabled = done();
    (activeEntry || board.lastElementChild)?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }

  function summary() {
    const s = el("div", "summary");
    const h = el("h2"); h.textContent = "Chain complete!";
    const p = el("div");
    p.textContent = `${rows.length} words · ${st.wrong} misses · ${st.hints} hints`;
    const copy = el("button", "btn"); copy.textContent = "Copy result";
    copy.onclick = async () => {
      const text = `Meanderings — ${rows.length} words, ${st.wrong} misses, ${st.hints} hints`;
      try { await navigator.clipboard.writeText(text); flash("Copied"); } catch (e) { flash(text); }
    };
    const again = el("button", "btn"); again.textContent = "Play again";
    again.onclick = () => { st = fresh(); save(); startRow(); flash(""); render(); window.scrollTo(0, 0); };
    s.append(h, p, copy, again);
    return s;
  }

  let flashTimer;
  function flash(text) {
    msgEl.textContent = text;
    clearTimeout(flashTimer);
    if (text) flashTimer = setTimeout(() => (msgEl.textContent = ""), 3000);
  }

  // ---- input ----
  function type(ch) {
    if (done()) return;
    const j = guess.findIndex(c => !c);
    if (j < 0) return;
    guess[j] = ch.toUpperCase();
    render();
  }
  function back() {
    if (done()) return;
    for (let j = guess.length - 1; j >= 0; j--) {
      if (guess[j] && !locked[j]) { guess[j] = ""; break; }
    }
    render();
  }
  function submit() {
    if (done()) return;
    const r = rows[st.cur];
    if (guess.some(c => !c)) { flash("Fill every box first"); return; }
    st.guesses++;
    if (guess.join("") === r.word) {
      st.cur++; save(); startRow(); flash(""); render(); return;
    }
    st.wrong++;
    let kept = 0;
    for (let j = 0; j < guess.length; j++) {
      if (locked[j]) continue;
      if (guess[j] === r.word[j]) { locked[j] = "good"; kept++; } else guess[j] = "";
    }
    flash(kept ? `${kept} letter${kept > 1 ? "s" : ""} in the right spot — kept` : "No letters in the right spot");
    shake = true; save(); render();
  }
  function hint() {
    if (done()) return;
    const r = rows[st.cur];
    const j = locked.findIndex(l => !l);
    if (j < 0) return;
    guess[j] = r.word[j]; locked[j] = "good"; st.hints++; save(); render();
  }

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
  $("hint").addEventListener("click", e => { hint(); e.currentTarget.blur(); });
  document.addEventListener("keydown", e => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (/^[a-zA-Z]$/.test(e.key)) type(e.key);
    else if (e.key === "Backspace") back();
    else if (e.key === "Enter") { e.preventDefault(); submit(); }
  });
  window.addEventListener("resize", size);

  size(); startRow(); render();
})();
