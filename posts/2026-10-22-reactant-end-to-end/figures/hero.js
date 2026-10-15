// The banner at the top of the post: a looping canvas montage in three scenes. Test tiles from
// PathMNIST stream past with the model's calls on them; the tiles collapse into the NeuralODE's
// trajectories, which carry them to their class corners; the flow folds into the Julia dots, and
// the packages the post is built on lock in around it. Plain canvas 2D, no libraries. It pauses
// off screen and in background tabs, has a pause button, and with reduced motion draws one still.
//
// Markup:  <div class="hero" data-base="figures/hero/" data-traj="figures/trajectories.json"></div>
(() => {
  "use strict";
  const LOOP = 16;                           // seconds per cycle
  const S = { tiles: [0, 5.2], flow: [5.2, 10.4], stack: [10.4, 15.6] };
  const BG = "#06090f", GRID = "rgba(120, 160, 255, 0.07)", INK = "#d7e3ff", DIM = "#7f8db0";
  const CYAN = "#3ee6ff", MAGENTA = "#ff4fd8", GOOD = "#45f0a0", BAD = "#ff5d6c";
  const CODES = ["ADI", "BACK", "DEB", "LYM", "MUC", "MUS", "NORM", "STR", "TUM"];
  // Bright steps of the post's categorical palette, so the flow matches the player below.
  const CLS = ["#5aa2ff", "#9aa4b2", "#ff7a45", "#2fd39a", "#ffbf1f", "#ff79ad", "#3ccf3c", "#a89bff", "#ff6b6b"];
  const JULIA = ["#389826", "#cb3c33", "#9558b2"];   // the Julia dots: green, red, purple
  // [name, file, scale]: the scale evens out visual weight, since a wide solid logo fills its
  // box far more than a sparse square one.
  const LOGOS = [
    ["Reactant.jl", "reactant.svg", 1], ["Lux.jl", "lux.svg", 1], ["Luximm.jl", "luximm.svg", 1],
    ["ReactantNitro.jl", "nitro.svg", 1], ["ReactantServer.jl", "server.svg", 1], ["Kaimon.jl", "kaimon.png", 1],
  ];
  const CAPTIONS = {
    tiles: "julia> dataset = PathMNIST(:test)    # 7,180 tiles, 9 classes",
    flow: "julia> u = rk4(f, u0, 100)    # t = ",
    stack: "julia> using Reactant, Lux, Luximm, ReactantNitro, ReactantServer",
  };
  const CAPTIONS_NARROW = {
    tiles: "julia> PathMNIST(:test)  # 7,180 tiles",
    flow: "julia> rk4(f, u0, 100)  # t = ",
    stack: "julia> using Reactant, Lux, Luximm, …",
  };

  const load = (src) => new Promise((ok, bad) => { const i = new Image(); i.onload = () => ok(i); i.onerror = bad; i.src = src; });
  const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  const ease = (x) => { x = clamp(x); return x * x * (3 - 2 * x); };
  const span = (t, [a, b]) => (t - a) / (b - a);
  // A cheap deterministic hash, so glitch offsets hold still for a few frames instead of boiling.
  const hash = (a, b = 0) => { let h = Math.imul(a ^ 0x9e3779b9, 0x85ebca6b) ^ Math.imul(b + 0x632be5ab, 0xc2b2ae35); h ^= h >>> 15; h = Math.imul(h, 0x2c1b3c6d); h ^= h >>> 12; return (h >>> 0) / 4294967296; };

  async function mount(root) {
    const base = root.dataset.base;
    const [sheet, meta, traj, ...logoImgs] = await Promise.all([
      load(base + "tiles.jpg"),
      fetch(base + "tiles.json").then((r) => r.json()),
      fetch(root.dataset.traj).then((r) => r.json()),
      ...LOGOS.map(([, f]) => load(base + f)),
    ]);
    const NT = meta.length, SHEET_COLS = 8, TS = sheet.width / SHEET_COLS;
    const { K, N, T, labels } = traj;
    const bytes = Uint8Array.from(atob(traj.p), (c) => c.charCodeAt(0));
    const corner = Array.from({ length: K }, (_, k) => [Math.sin(2 * Math.PI * k / K), -Math.cos(2 * Math.PI * k / K)]);
    const pos = new Float32Array(T * N * 2);
    for (let t = 0; t < T; t++) for (let n = 0; n < N; n++) {
      let x = 0, y = 0;
      for (let k = 0; k < K; k++) { const q = bytes[(t * N + n) * K + k] / 255; x += q * corner[k][0]; y += q * corner[k][1]; }
      pos[(t * N + n) * 2] = x; pos[(t * N + n) * 2 + 1] = y;
    }
    const at = (n, f) => {
      f = clamp(f, 0, T - 1);
      const a = Math.floor(f), b = Math.min(a + 1, T - 1), w = f - a, i = (a * N + n) * 2, j = (b * N + n) * 2;
      return [pos[i] + w * (pos[j] - pos[i]), pos[i + 1] + w * (pos[j + 1] - pos[i + 1])];
    };

    root.innerHTML = "";
    const canvas = document.createElement("canvas");
    canvas.setAttribute("role", "img");
    canvas.setAttribute("aria-label", "Animated banner: histology test tiles with the model's predictions, the NeuralODE carrying tiles to their class corners, and the Julia logo with the logos of Reactant.jl, Lux.jl, Luximm.jl, ReactantNitro.jl, ReactantServer.jl and Kaimon.jl.");
    root.appendChild(canvas);
    const btn = document.createElement("button");
    btn.type = "button"; btn.className = "hero-pause";
    root.appendChild(btn);
    const ctx = canvas.getContext("2d");
    let W = 0, H = 0, dpr = 1;
    const resize = () => {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      W = root.clientWidth; H = root.clientHeight;
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const mono = (px, weight = 500) => `${weight} ${px}px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`;
    const tileSrc = (i) => [(i % SHEET_COLS) * TS, Math.floor(i / SHEET_COLS) * TS];

    // Draw an image in horizontal strips shifted by a glitch amount g in [0, 1], with a cyan and
    // magenta ghost either side: the reveal effect for tiles and logos.
    function glitchImage(img, sx, sy, sw, sh, dx, dy, dw, dh, g, seed, tick) {
      if (g <= 0.01) { ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh); return; }
      const strips = 6;
      for (let s = 0; s < strips; s++) {
        const off = (hash(seed * 31 + s, tick) - 0.5) * dw * 0.35 * g;
        ctx.drawImage(img, sx, sy + (sh * s) / strips, sw, sh / strips, dx + off, dy + (dh * s) / strips, dw, dh / strips + 0.5);
      }
      ctx.save();
      ctx.globalCompositeOperation = "screen";
      ctx.globalAlpha = 0.55 * g;
      ctx.fillStyle = CYAN; ctx.fillRect(dx - 4 * g, dy, dw, dh * 0.08);
      ctx.fillStyle = MAGENTA; ctx.fillRect(dx + 4 * g, dy + dh * (0.3 + 0.5 * hash(seed, tick)), dw, dh * 0.06);
      ctx.restore();
    }

    function backdrop(t) {
      ctx.fillStyle = BG; ctx.fillRect(0, 0, W, H);
      const step = 28, drift = (t * 6) % step;
      ctx.strokeStyle = GRID; ctx.lineWidth = 1; ctx.beginPath();
      for (let x = -drift; x < W; x += step) { ctx.moveTo(x, 0); ctx.lineTo(x, H); }
      for (let y = -drift; y < H; y += step) { ctx.moveTo(0, y); ctx.lineTo(W, y); }
      ctx.stroke();
    }

    // Scene 1: a slowly panning wall of tiles, each glitching in, with prediction call-outs.
    function tilesScene(t, tick) {
      const u = span(t, S.tiles), fadeOut = 1 - ease(span(t, [S.tiles[1] - 0.6, S.tiles[1] + 0.4]));
      if (fadeOut <= 0) return;
      const rows = H > W * 0.6 ? 4 : 3, ts = Math.ceil(H / rows), cols = Math.ceil(W / ts) + 1;
      const pan = (t * 14) % ts;
      ctx.save(); ctx.globalAlpha = fadeOut;
      for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
        const i = (r * 11 + c * 5 + Math.floor(t * 14 / ts)) % NT;
        const appear = 0.05 + (c / cols) * 0.35 + hash(r, c) * 0.12;     // a left-to-right wave
        const a = clamp((u - appear) / 0.08);
        if (a <= 0) continue;
        const [sx, sy] = tileSrc(i), x = c * ts - pan, y = r * ts;
        ctx.globalAlpha = fadeOut * a;
        glitchImage(sheet, sx, sy, TS, TS, x + 1, y + 1, ts - 2, ts - 2, 1 - a, i, tick);
      }
      // Tint toward the banner's palette so the logos and text sit on it later.
      ctx.globalAlpha = fadeOut;
      const g = ctx.createLinearGradient(0, 0, W, H);
      g.addColorStop(0, "rgba(6, 9, 15, 0.55)"); g.addColorStop(1, "rgba(30, 8, 50, 0.35)");
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      // Scan band.
      const sy = ((u * 1.6) % 1) * (H + 80) - 40;
      const band = ctx.createLinearGradient(0, sy - 40, 0, sy + 40);
      band.addColorStop(0, "rgba(62, 230, 255, 0)"); band.addColorStop(0.5, "rgba(62, 230, 255, 0.18)"); band.addColorStop(1, "rgba(62, 230, 255, 0)");
      ctx.fillStyle = band; ctx.fillRect(0, sy - 40, W, 80);
      // Call-outs on a few tiles: the true class code and the model's confidence.
      const picks = [[0, 1], [1, 3], [2, 2], [0, 4], [rows - 1, 5]];
      picks.forEach(([r, c], j) => {
        if (c >= cols - 1) return;
        const show = clamp((u - 0.35 - j * 0.09) / 0.05);
        if (show <= 0) return;
        const i = (r * 11 + c * 5 + Math.floor(t * 14 / ts)) % NT, m = meta[i], ok = m.label === m.pred;
        const x = c * ts - pan + 6, y = r * ts + 6, w = ts - 12, h = ts - 12, k = Math.min(14, w / 4);
        ctx.globalAlpha = fadeOut * show;
        ctx.strokeStyle = ok ? GOOD : BAD; ctx.lineWidth = 2; ctx.beginPath();
        for (const [px, py, dx, dy] of [[x, y, 1, 1], [x + w, y, -1, 1], [x, y + h, 1, -1], [x + w, y + h, -1, -1]]) {
          ctx.moveTo(px + dx * k, py); ctx.lineTo(px, py); ctx.lineTo(px, py + dy * k);
        }
        ctx.stroke();
        const txt = ok ? `${CODES[m.label]} ${m.conf.toFixed(2)}` : `${CODES[m.label]}→${CODES[m.pred]} ${m.conf.toFixed(2)}`;
        ctx.font = mono(Math.max(10, Math.min(12, ts / 9)), 700);
        const tw = ctx.measureText(txt).width;
        ctx.fillStyle = "rgba(6, 9, 15, 0.8)"; ctx.fillRect(x, y + h - 18, tw + 10, 18);
        ctx.fillStyle = ok ? GOOD : BAD; ctx.textBaseline = "middle"; ctx.fillText(txt, x + 5, y + h - 9);
      });
      ctx.restore();
    }

    // Scene 2: the NeuralODE flow, the same 256 trajectories as the player further down.
    function flowScene(t) {
      const fadeIn = ease(span(t, [S.flow[0] - 0.4, S.flow[0] + 0.5]));
      const collapse = ease(span(t, [S.flow[1] - 0.9, S.flow[1] + 0.3]));
      if (fadeIn <= 0 || collapse >= 1) return;
      const cx = W / 2, cy = H / 2 + 6, R = Math.min(H * 0.38, W * 0.3);
      const f = clamp(span(t, [S.flow[0] + 0.3, S.flow[1] - 1.1])) * (T - 1);
      ctx.save(); ctx.globalAlpha = fadeIn * (1 - collapse);
      ctx.strokeStyle = "rgba(127, 141, 176, 0.35)"; ctx.lineWidth = 1; ctx.beginPath();
      corner.forEach(([x, y], k) => (k ? ctx.lineTo : ctx.moveTo).call(ctx, cx + R * x, cy + R * y));
      ctx.closePath(); ctx.stroke();
      ctx.font = mono(11, 600); ctx.textAlign = "center"; ctx.textBaseline = "middle";
      corner.forEach(([x, y], k) => { ctx.fillStyle = CLS[k]; ctx.fillText(CODES[k], cx + R * 1.16 * x, cy + R * 1.16 * y); });
      ctx.globalCompositeOperation = "lighter";
      const pull = collapse;                      // tiles drawn into the centre as the scene ends
      for (let n = 0; n < N; n++) {
        ctx.strokeStyle = CLS[labels[n]]; ctx.globalAlpha = 0.35 * fadeIn * (1 - collapse);
        ctx.lineWidth = 1.2; ctx.beginPath();
        for (let s = Math.max(0, Math.floor(f) - 8); s <= f; s++) {
          const [x, y] = at(n, s);
          (s === Math.max(0, Math.floor(f) - 8) ? ctx.moveTo : ctx.lineTo).call(ctx, cx + R * x * (1 - pull), cy + R * y * (1 - pull));
        }
        const [x, y] = at(n, f);
        ctx.lineTo(cx + R * x * (1 - pull), cy + R * y * (1 - pull)); ctx.stroke();
        ctx.globalAlpha = 0.9 * fadeIn * (1 - collapse); ctx.fillStyle = CLS[labels[n]];
        ctx.beginPath(); ctx.arc(cx + R * x * (1 - pull), cy + R * y * (1 - pull), 2.2, 0, 2 * Math.PI); ctx.fill();
      }
      ctx.restore();
      return f / (T - 1);
    }

    // Scene 3: the Julia dots bloom where the flow collapsed, and the packages lock in around them.
    function stackScene(t, tick) {
      const u = span(t, S.stack), out = 1 - ease(span(t, [S.stack[1] - 0.3, S.stack[1] + 0.2]));
      if (u < -0.05 || out <= 0) return;
      const cx = W / 2, cy = H / 2 + 12, narrow = W < 560;
      const r = Math.min(H, W) * (narrow ? 0.07 : 0.085);
      const bloom = ease(u / 0.12);
      ctx.save(); ctx.globalAlpha = out;
      // Ring geometry: an ellipse that fits the banner's aspect.
      const box = Math.min(H * 0.2, narrow ? 38 : 74), cardW = box * 1.9 + 16;
      const rx = Math.min(W * 0.38, H * 1.05, W / 2 - cardW / 2 - 6), ry = H * (narrow ? 0.3 : 0.32);
      const spots = LOGOS.map((_, i) => {
        const a = -Math.PI / 2 + (2 * Math.PI * (i + 0.5)) / LOGOS.length;
        return [cx + rx * Math.cos(a), cy + ry * Math.sin(a)];
      });
      // Links from the centre out to each logo, with a pulse running along each.
      spots.forEach(([x, y], i) => {
        const on = clamp((u - 0.18 - i * 0.07) / 0.06);
        if (on <= 0) return;
        ctx.globalAlpha = out * on * 0.5; ctx.strokeStyle = CYAN; ctx.lineWidth = 1;
        ctx.setLineDash([3, 5]); ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(x, y); ctx.stroke(); ctx.setLineDash([]);
        const p = ((t * 0.7 + i * 0.17) % 1);
        ctx.globalAlpha = out * on; ctx.fillStyle = CYAN;
        ctx.beginPath(); ctx.arc(cx + (x - cx) * p, cy + (y - cy) * p, 2, 0, 2 * Math.PI); ctx.fill();
      });
      // The Julia dots, with a glow.
      const dots = [[0, -0.62], [-0.68, 0.48], [0.68, 0.48]];
      dots.forEach(([dx, dy], i) => {
        const b = ease((u - i * 0.03) / 0.12);
        ctx.globalAlpha = out; ctx.shadowColor = JULIA[i]; ctx.shadowBlur = 24 * b;
        ctx.fillStyle = JULIA[i]; ctx.beginPath();
        ctx.arc(cx + dx * r * 1.25 * bloom, cy + dy * r * 1.25 * bloom, r * b * 0.62, 0, 2 * Math.PI); ctx.fill();
      });
      ctx.shadowBlur = 0;
      // Logos, each glitching into place, with a monospace name under it.
      spots.forEach(([x0, y], i) => {
        let x = x0;
        const on = clamp((u - 0.22 - i * 0.07) / 0.1);
        if (on <= 0) return;
        const img = logoImgs[i], s = LOGOS[i][2] * Math.min(box * 1.9 / img.naturalWidth, box / img.naturalHeight);
        const w = img.naturalWidth * s, h = img.naturalHeight * s;
        ctx.globalAlpha = out * on;
        ctx.fillStyle = "rgba(10, 14, 24, 0.85)"; ctx.strokeStyle = "rgba(62, 230, 255, 0.35)"; ctx.lineWidth = 1;
        ctx.font = mono(narrow ? 9 : 11, 600);
        const pw = Math.max(w, box, ctx.measureText(LOGOS[i][0]).width) + 16, ph = Math.max(h, box) + (narrow ? 26 : 30);
        x = clamp(x, pw / 2 + 4, W - pw / 2 - 4);           // keep the card inside the banner
        ctx.beginPath(); ctx.roundRect(x - pw / 2, y - ph / 2, pw, ph, 8); ctx.fill(); ctx.stroke();
        glitchImage(img, 0, 0, img.naturalWidth, img.naturalHeight, x - w / 2, y - ph / 2 + 6 + (box - h) / 2, w, h, 1 - on, 100 + i, tick);
        ctx.font = mono(narrow ? 9 : 11, 600); ctx.fillStyle = INK; ctx.textAlign = "center"; ctx.textBaseline = "alphabetic";
        ctx.fillText(LOGOS[i][0], x, y + ph / 2 - 7);
      });
      ctx.restore();
    }

    function caption(t, flowT) {
      const scene = t < S.tiles[1] ? "tiles" : t < S.flow[1] ? "flow" : "stack";
      const start = S[scene][0];
      let txt = (W < 560 ? CAPTIONS_NARROW : CAPTIONS)[scene];
      if (scene === "flow") txt += (flowT ?? 0).toFixed(2);
      const typed = scene === "flow" ? txt.length : Math.floor((t - start) * 40);
      const shown = txt.slice(0, Math.max(0, typed));
      const px = W < 560 ? 10 : 12;
      ctx.font = mono(px, 600); ctx.textAlign = "left"; ctx.textBaseline = "middle";
      const tw = ctx.measureText(shown + "█").width;
      ctx.fillStyle = "rgba(6, 9, 15, 0.78)"; ctx.fillRect(10, 10, Math.min(W - 20, tw + 16), px + 12);
      ctx.save(); ctx.beginPath(); ctx.rect(10, 10, W - 20, px + 12); ctx.clip();
      ctx.fillStyle = INK; ctx.fillText(shown, 18, 16 + px / 2);
      if (Math.floor(t * 2.5) % 2 === 0) { ctx.fillStyle = CYAN; ctx.fillText("█", 18 + ctx.measureText(shown).width, 16 + px / 2); }
      ctx.restore();
    }

    // Full-frame glitch at each scene change, then scanlines and a vignette over everything.
    function post(t, tick) {
      const edges = [S.tiles[1], S.flow[1], LOOP];
      const near = Math.min(...edges.map((e) => Math.abs(t - e)), t);
      const g = clamp(1 - near / 0.25);
      if (g > 0) {
        const strips = 9;
        for (let s = 0; s < strips; s++) {
          if (hash(s, tick) > 0.55) continue;
          const y = hash(s + 50, tick) * H, h = 4 + hash(s + 90, tick) * 22, off = (hash(s + 7, tick) - 0.5) * 60 * g;
          ctx.drawImage(canvas, 0, y * dpr, W * dpr, h * dpr, off, y, W, h);
          ctx.fillStyle = hash(s, tick + 1) > 0.5 ? "rgba(62, 230, 255, 0.12)" : "rgba(255, 79, 216, 0.12)";
          ctx.fillRect(0, y, W, h);
        }
      }
      ctx.fillStyle = "rgba(0, 0, 0, 0.16)";
      for (let y = 0; y < H; y += 3) ctx.fillRect(0, y, W, 1);
      const v = ctx.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.35, W / 2, H / 2, Math.max(W, H) * 0.75);
      v.addColorStop(0, "rgba(0, 0, 0, 0)"); v.addColorStop(1, "rgba(0, 0, 0, 0.55)");
      ctx.fillStyle = v; ctx.fillRect(0, 0, W, H);
    }

    function frame(t) {
      const tick = Math.floor(t * 20);
      backdrop(t);
      tilesScene(t, tick);
      const flowT = flowScene(t);
      stackScene(t, tick);
      post(t, tick);
      caption(t, flowT);
    }

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let clock = 0, last = null, playing = !reduced, visible = false, raf = 0;
    const setBtn = () => {
      btn.textContent = playing ? "❚❚" : "▶";
      btn.setAttribute("aria-label", playing ? "Pause the banner animation" : "Play the banner animation");
    };
    const loop = (now) => {
      raf = 0;
      if (!(playing && visible && !document.hidden)) { last = null; return; }
      if (last !== null) clock = (clock + Math.min(0.1, (now - last) / 1000)) % LOOP;
      last = now; frame(clock);
      raf = requestAnimationFrame(loop);
    };
    const kick = () => { if (!raf) raf = requestAnimationFrame(loop); };
    btn.addEventListener("click", () => { playing = !playing; setBtn(); kick(); });
    setBtn();
    new IntersectionObserver((es) => { visible = es.some((e) => e.isIntersecting); kick(); }).observe(root);
    document.addEventListener("visibilitychange", kick);
    new ResizeObserver(() => { resize(); if (!playing || reduced) frame(clock); }).observe(root);
    // Reduced motion: one still with every element in place, from the end of the stack scene.
    if (reduced) { clock = S.stack[1] - 1.2; }
    frame(clock);
    kick();
  }

  const start = () => document.querySelectorAll(".hero[data-base]").forEach((r) => mount(r).catch((e) => {
    r.remove();                              // a banner is decoration; drop it rather than show an error
    console.warn("hero banner:", e);
  }));
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", start) : start();
})();
