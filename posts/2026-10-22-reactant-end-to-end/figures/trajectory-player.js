// Interactive "class probability along the ODE trajectory": 256 test tiles start at the
// centre of a nonagon (the uniform prediction at t = 0) and flow to their class corners as
// the NeuralODE integrates to t = 1. Plain SVG and JavaScript, no libraries.
//
// Markup:  <div class="traj-player" data-src="figures/trajectories.json"></div>
// Data:    { classes: [...K], labels: [...N] (0-based), K, N, T, p: base64 of uint8 }
//          p[(t * N + n) * K + k] = round(255 * probability), t fastest-varying last.
(() => {
  "use strict";
  const NS = "http://www.w3.org/2000/svg";
  const DURATION = 6000;          // ms for t from 0 to 1
  const TRAIL = 10;               // trail length in sampled frames
  const R = 0.022;                // dot radius in nonagon units

  const el = (tag, attrs = {}, parent) => {
    const e = document.createElementNS(NS, tag);
    for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
    if (parent) parent.appendChild(e);
    return e;
  };
  const html = (tag, attrs = {}, parent, text) => {
    const e = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
    if (text !== undefined) e.textContent = text;
    if (parent) parent.appendChild(e);
    return e;
  };

  async function mount(root) {
    const data = await (await fetch(root.dataset.src)).json();
    const { K, N, T, classes } = data;
    const labels = data.labels;
    const bytes = Uint8Array.from(atob(data.p), (c) => c.charCodeAt(0));
    const prob = (t, n, k) => bytes[(t * N + n) * K + k] / 255;

    // Corner k sits at angle 2*pi*k/K, starting at the top, as in the static figure.
    const corner = Array.from({ length: K }, (_, k) => [Math.sin(2 * Math.PI * k / K), -Math.cos(2 * Math.PI * k / K)]);
    // Position of tile n at sampled frame t: the probability-weighted mix of the corners.
    const pos = new Float32Array(T * N * 2);
    for (let t = 0; t < T; t++) for (let n = 0; n < N; n++) {
      let x = 0, y = 0;
      for (let k = 0; k < K; k++) { const q = prob(t, n, k); x += q * corner[k][0]; y += q * corner[k][1]; }
      pos[(t * N + n) * 2] = x; pos[(t * N + n) * 2 + 1] = y;
    }
    const argmaxAt = (t, n) => { let b = 0; for (let k = 1; k < K; k++) if (prob(t, n, k) > prob(t, n, b)) b = k; return b; };
    const wrong = Array.from({ length: N }, (_, n) => argmaxAt(T - 1, n) !== labels[n]);

    // ── Layout ─────────────────────────────────────────────────────────────────
    root.innerHTML = "";
    root.setAttribute("role", "figure");
    const svg = el("svg", { viewBox: "-1.45 -1.32 2.9 2.64", class: "traj-svg",
      "aria-label": `${N} test tiles flowing from a uniform prediction at the centre to their class corners as the NeuralODE integrates from t = 0 to t = 1` }, root);
    el("polygon", { points: corner.map((c) => c.join(",")).join(" "), class: "traj-frame" }, svg);
    corner.forEach(([x, y], k) => {
      el("circle", { cx: x, cy: y, r: 0.025, fill: `var(--c${k})` }, svg);
      const lbl = el("text", { x: 1.17 * x, y: 1.17 * y + 0.025, class: "traj-label", "text-anchor": "middle" }, svg);
      lbl.textContent = classes[k];
    });
    const gTrails = el("g", {}, svg), gDots = el("g", {}, svg);
    const trails = [], dots = [];
    for (let n = 0; n < N; n++) {
      const c = `var(--c${labels[n]})`;
      trails.push(el("polyline", { class: "traj-trail", stroke: c }, gTrails));
      dots.push(el("circle", { r: R, class: wrong[n] ? "traj-dot traj-wrong" : "traj-dot",
        fill: wrong[n] ? "var(--surface)" : c, stroke: c }, gDots));
    }

    const controls = html("div", { class: "traj-controls" }, root);
    const play = html("button", { type: "button", class: "traj-play", "aria-label": "Play" }, controls, "▶");
    const slider = html("input", { type: "range", min: 0, max: 1000, value: 0, class: "traj-slider", "aria-label": "Integration time t" }, controls);
    const readout = html("span", { class: "traj-t" }, controls, "t = 0.00");
    const legend = html("div", { class: "traj-legend" }, root);
    const keys = classes.map((name, k) => {
      const b = html("button", { type: "button", class: "traj-key", "aria-pressed": "false" }, legend);
      html("span", { class: "traj-swatch", style: `background: var(--c${k})` }, b);
      html("span", {}, b, name);
      return b;
    });
    html("span", { class: "traj-note" }, legend, "Hollow rings are misclassified tiles. Tap a class to isolate it.");
    // A panel under the legend, so it never covers the plot; hidden until a tile is chosen.
    const tip = html("div", { class: "traj-tip", "aria-live": "polite" }, root);
    const idle = () => { tip.innerHTML = ""; tip.hidden = true; };

    // ── State and drawing ──────────────────────────────────────────────────────
    let tNow = 0, playing = false, last = 0, focus = -1, pinned = -1, hover = -1;
    const at = (n, f) => {  // position of tile n at fractional frame f, linearly interpolated
      const a = Math.floor(f), b = Math.min(a + 1, T - 1), w = f - a, i = (a * N + n) * 2, j = (b * N + n) * 2;
      return [pos[i] + w * (pos[j] - pos[i]), pos[i + 1] + w * (pos[j + 1] - pos[i + 1])];
    };
    function draw() {
      const f = tNow * (T - 1);
      for (let n = 0; n < N; n++) {
        const [x, y] = at(n, f);
        dots[n].setAttribute("cx", x); dots[n].setAttribute("cy", y);
        const pts = [];
        for (let s = Math.max(0, Math.floor(f) - TRAIL); s <= Math.floor(f); s++) pts.push(at(n, s).join(","));
        pts.push(`${x},${y}`);
        trails[n].setAttribute("points", pts.join(" "));
        const dim = focus >= 0 && labels[n] !== focus;
        dots[n].style.opacity = dim ? 0.08 : 1;
        trails[n].style.opacity = dim ? 0.03 : "";
      }
      slider.value = Math.round(tNow * 1000);
      readout.textContent = `t = ${tNow.toFixed(2)}`;
      const shown = pinned >= 0 ? pinned : hover;
      shown >= 0 ? showTip(shown, f) : idle();
    }
    function showTip(n, f) {
      tip.hidden = false;
      const a = Math.floor(f), b = Math.min(a + 1, T - 1), w = f - a;
      const ps = classes.map((_, k) => prob(a, n, k) + w * (prob(b, n, k) - prob(a, n, k)));
      tip.innerHTML = "";
      html("div", { class: "traj-tip-head" }, tip, `true class: ${classes[labels[n]]}${wrong[n] ? " (misclassified)" : ""}`);
      ps.forEach((p, k) => {
        const row = html("div", { class: "traj-row" }, tip);
        html("span", { class: "traj-row-name" }, row, classes[k]);
        const bar = html("span", { class: "traj-bar" }, row);
        html("span", { class: "traj-fill", style: `width: ${(100 * p).toFixed(1)}%; background: var(--c${k})` }, bar);
        html("span", { class: "traj-row-val" }, row, `${Math.round(100 * p)}%`);
      });
    }
    function step(now) {
      if (!playing) return;
      // A frame's timestamp can precede the moment play was pressed; never step backwards.
      tNow = Math.min(1, Math.max(tNow, tNow + (now - last) / DURATION)); last = Math.max(last, now);
      draw();
      if (tNow >= 1) return setPlaying(false);
      requestAnimationFrame(step);
    }
    function setPlaying(on) {
      playing = on;
      play.textContent = on ? "❚❚" : "▶";
      play.setAttribute("aria-label", on ? "Pause" : "Play");
      if (on) { if (tNow >= 1) tNow = 0; last = performance.now(); requestAnimationFrame(step); }
    }
    play.addEventListener("click", () => setPlaying(!playing));
    slider.addEventListener("input", () => { setPlaying(false); tNow = slider.value / 1000; draw(); });
    keys.forEach((b, k) => b.addEventListener("click", () => {
      focus = focus === k ? -1 : k;
      keys.forEach((o, j) => o.setAttribute("aria-pressed", String(j === focus)));
      draw();
    }));
    // Nearest tile under the pointer, with a hit radius well beyond the dot itself.
    const nearest = (ev) => {
      const pt = svg.createSVGPoint(); pt.x = ev.clientX; pt.y = ev.clientY;
      const p = pt.matrixTransform(svg.getScreenCTM().inverse());
      const f = tNow * (T - 1);
      let best = -1, bd = 0.07 ** 2;
      for (let n = 0; n < N; n++) {
        if (focus >= 0 && labels[n] !== focus) continue;
        const [x, y] = at(n, f), d = (x - p.x) ** 2 + (y - p.y) ** 2;
        if (d < bd) { bd = d; best = n; }
      }
      return best;
    };
    svg.addEventListener("pointermove", (ev) => { hover = nearest(ev); dots.forEach((d, n) => d.classList.toggle("traj-hot", n === (pinned >= 0 ? pinned : hover))); draw(); });
    svg.addEventListener("pointerleave", () => { hover = -1; draw(); });
    svg.addEventListener("click", (ev) => { const n = nearest(ev); pinned = n === pinned ? -1 : n; draw(); });

    // Start once the figure scrolls into view; with reduced motion, show the end state instead.
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) { tNow = 1; draw(); return; }
    draw();
    const io = new IntersectionObserver((es) => {
      if (es.some((e) => e.isIntersecting)) { io.disconnect(); setPlaying(true); }
    }, { threshold: 0.5 });
    io.observe(root);
  }

  const start = () => document.querySelectorAll(".traj-player[data-src]").forEach((r) => mount(r).catch((e) => {
    r.textContent = `Could not load the trajectory data (${e.message}).`;
  }));
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", start) : start();
})();
