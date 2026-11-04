// Sound (synthesized with WebAudio, no files), haptics and confetti. Everything is optional,
// toggled from the settings panel, and silent until the first user gesture (browser rule).
const FX = (() => {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let ctx = null, sound = true, haptics = true;

  const audio = () => {
    try {
      if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
      if (ctx.state === "suspended") ctx.resume();
      return ctx;
    } catch (e) { return null; }
  };
  // Semitones above C4 (so 9 = A4 = 440 Hz).
  const note = n => 440 * Math.pow(2, (n - 9) / 12);

  function tone(freq, dur = 0.12, { type = "sine", vol = 0.07, at = 0, to = null } = {}) {
    if (!sound) return;
    const c = audio(); if (!c) return;
    const t0 = c.currentTime + at, o = c.createOscillator(), g = c.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, t0);
    if (to) o.frequency.exponentialRampToValueAtTime(to, t0 + dur);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(vol, t0 + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g).connect(c.destination);
    o.start(t0); o.stop(t0 + dur + 0.02);
  }
  // Browsers ignore (and log a warning for) vibrate() before the first tap, so wait for a real gesture.
  const buzz = p => {
    if (haptics && navigator.vibrate && navigator.userActivation?.hasBeenActive !== false) {
      try { navigator.vibrate(p); } catch (e) {}
    }
  };
  const arp = (base, steps, gap, opts) => steps.forEach((s, i) => tone(note(base + s), 0.16, { at: i * gap, ...opts }));

  function confetti(n = 150) {
    if (reduce) return;
    const dpr = window.devicePixelRatio || 1, W = innerWidth, H = innerHeight;
    const cv = document.createElement("canvas");
    cv.style.cssText = "position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:50";
    cv.width = W * dpr; cv.height = H * dpr;
    document.body.append(cv);
    const g = cv.getContext("2d"); g.scale(dpr, dpr);
    const cols = ["#4c9a5f", "#e8b93c", "#d64541", "#d9822b", "#5aa9e6", "#ffffff"];
    const ps = Array.from({ length: n }, () => ({
      x: W * (0.2 + Math.random() * 0.6), y: H * 0.4,
      vx: (Math.random() - 0.5) * 10, vy: -5 - Math.random() * 9,
      r: 5 + Math.random() * 6, c: cols[Math.floor(Math.random() * cols.length)],
      a: Math.random() * 6.28, va: (Math.random() - 0.5) * 0.4,
    }));
    const t0 = performance.now();
    (function frame(now) {
      const t = (now - t0) / 1000;
      g.clearRect(0, 0, W, H);
      for (const p of ps) {
        p.vy += 0.28; p.x += p.vx; p.y += p.vy; p.a += p.va;
        g.save(); g.translate(p.x, p.y); g.rotate(p.a);
        g.globalAlpha = Math.max(0, 1 - t / 2.8); g.fillStyle = p.c;
        g.fillRect(-p.r / 2, -p.r / 3, p.r, p.r * 0.6);
        g.restore();
      }
      if (t < 2.8) requestAnimationFrame(frame); else cv.remove();
    })(t0);
  }

  return {
    setPrefs(p) { if ("sound" in p) sound = !!p.sound; if ("haptics" in p) haptics = !!p.haptics; },
    tick()   { tone(note(12), 0.04, { type: "triangle", vol: 0.04 }); buzz(4); },
    back()   { tone(note(7), 0.04, { type: "triangle", vol: 0.03 }); },
    miss()   { tone(note(2), 0.22, { type: "sawtooth", vol: 0.05, to: note(-4) }); buzz([40, 30, 40]); },
    reveal() { tone(note(19), 0.1, { type: "triangle" }); buzz(15); },
    // A major arpeggio that climbs a step per combo level.
    good(combo = 0) { arp(7 + Math.min(combo, 8), [0, 4, 7, 12], 0.07, { type: "triangle", vol: 0.06 }); buzz([20, 30, 20]); },
    bonus()  { arp(19, [0, 4, 7, 11, 12, 16], 0.06, { type: "sine", vol: 0.05 }); buzz([20, 20, 20, 20, 60]); },
    finish() { arp(0, [0, 4, 7, 12, 16, 19, 24], 0.09, { type: "triangle", vol: 0.08 }); buzz([30, 40, 30, 40, 100]); confetti(); },
    confetti,
  };
})();
