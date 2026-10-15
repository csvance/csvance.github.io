// Interactive test confusion matrix: counts, or normalised by the true class (recall on the
// diagonal) or by the predicted class (precision on the diagonal). Correct and wrong cells do
// different jobs, so they get different scales: the diagonal a blue ramp stretched over its own
// range, the errors a red ramp on a log scale over theirs. A single ramp from 0 to 100% put
// every error in the palest tenth and every diagonal cell in the darkest. Plain SVG, no libraries.
//
// Markup:  <div class="cm-player" data-src="figures/confusion.json"></div>
// Data:    { classes: [...K], codes: [...K], counts: [[...K] x K] }, counts[true][predicted]
(() => {
  "use strict";
  const NS = "http://www.w3.org/2000/svg";
  // Saturation carries the amount: each ramp runs from a near-gray tint of its hue to the most
  // vivid colour at that hue (OKLCH chroma rising with the step), in both themes. Blue is
  // correct, red is wrong. 13 steps evenly spaced in OKLCH lightness and chroma.
  const LIGHT = {
    good: [
      "#e2ecfc", "#d0e0fa", "#bfd4f8", "#aec9f5", "#9dbdf2", "#8cb1ee", "#7ba5eb",
      "#6a99e7", "#598de3", "#4881df", "#3674db", "#2267d7", "#0559d2"],
    bad: [
      "#fce5e2", "#fbd7d2", "#fac9c2", "#f9bab2", "#f7aca3", "#f49d93", "#f28e83",
      "#ee7f74", "#eb6f64", "#e65e54", "#e24c44", "#dd3633", "#d8151e"],
    ink: "#1f2328", inkAlt: "#ffffff",
  };
  const DARK = {
    good: [
      "#272e3b", "#2a3549", "#2c3d57", "#2f4466", "#324b75", "#355384", "#375a94",
      "#3a62a4", "#3c69b4", "#3e71c4", "#4178d5", "#4380e6", "#4588f7"],
    bad: [
      "#3a2927", "#482d29", "#57302c", "#65332e", "#743530", "#843831", "#933a33",
      "#a33b35", "#b33d36", "#c33d37", "#d43e38", "#e43e39", "#f53e39"],
    ink: "#d7dae0", inkAlt: "#0f1115",
  };
  const VIEWS = [
    { id: "count", label: "Counts" },
    { id: "row", label: "% of true class" },
    { id: "col", label: "% of predicted class" },
  ];

  const el = (tag, attrs = {}, parent, text) => {
    const e = document.createElementNS(NS, tag);
    for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
    if (text !== undefined) e.textContent = text;
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
  const rgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const hex = (c) => "#" + c.map((x) => Math.round(x).toString(16).padStart(2, "0")).join("");
  const lum = (h) => {
    const [r, g, b] = rgb(h).map((c) => { c /= 255; return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const contrast = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
  // Position s in [0, 1] along a ramp, interpolated between its steps.
  const sample = (ramp, s) => {
    const f = Math.min(1, Math.max(0, s)) * (ramp.length - 1), a = Math.floor(f), b = Math.min(a + 1, ramp.length - 1), w = f - a;
    const [p, q] = [rgb(ramp[a]), rgb(ramp[b])];
    return hex(p.map((v, i) => v + w * (q[i] - v)));
  };
  const pct = (v) => (v >= 0.9995 ? "100" : v < 0.0005 ? "0" : (100 * v).toFixed(1));

  async function mount(root) {
    const data = await (await fetch(root.dataset.src)).json();
    const { classes, codes, counts: C } = data;
    const K = classes.length;
    const rowSum = C.map((r) => r.reduce((a, b) => a + b, 0));
    const colSum = classes.map((_, p) => C.reduce((a, r) => a + r[p], 0));
    const value = (view, t, p) => view === "count" ? C[t][p] : view === "row" ? C[t][p] / rowSum[t] : C[t][p] / colSum[p];
    const fmt = (view, v) => view === "count" ? String(v) : pct(v);

    root.innerHTML = "";
    const bar = html("div", { class: "cm-controls", role: "group", "aria-label": "Matrix view" }, root);
    const buttons = VIEWS.map((v) => {
      const b = html("button", { type: "button", class: "cm-view", "aria-pressed": "false" }, bar, v.label);
      b.addEventListener("click", () => { view = v.id; render(); });
      return b;
    });
    const host = html("div", { class: "cm-host" }, root);
    const legend = html("div", { class: "cm-legend" }, root);
    const tip = html("div", { class: "cm-tip", "aria-live": "polite" }, root);
    // The same numbers as a table for screen readers; the SVG is labelled as an image.
    const table = html("table", {}, html("div", { class: "cm-sr" }, root));

    let view = "row", focus = null, pinned = null, lastWidth = 0;
    const dark = () => document.body.classList.contains("quarto-dark");

    // Each scale spans the values actually present, so the whole ramp carries information.
    function scales() {
      const diag = [], off = [];
      for (let t = 0; t < K; t++) for (let p = 0; p < K; p++) {
        if (!C[t][p]) continue;
        (t === p ? diag : off).push(value(view, t, p));
      }
      const span = (xs) => [Math.min(...xs), Math.max(...xs)];
      return { diag: span(diag), off: span(off) };
    }
    function cellColor(sc, th, t, p) {
      const v = value(view, t, p);
      if (t === p) {
        const [lo, hi] = sc.diag;
        return sample(th.good, hi > lo ? (v - lo) / (hi - lo) : 1);
      }
      const [lo, hi] = sc.off;
      return sample(th.bad, hi > lo ? Math.log(v / lo) / Math.log(hi / lo) : 1);
    }

    function render() {
      const th = dark() ? DARK : LIGHT;
      const W = Math.max(280, host.clientWidth || root.clientWidth);
      const narrow = W < 560;
      buttons.forEach((b, i) => b.setAttribute("aria-pressed", String(VIEWS[i].id === view)));
      const sc = scales();

      // Layout in CSS pixels: labels in codes on a phone, full names otherwise.
      const font = narrow ? 11 : 13, cellFont = narrow ? (view === "count" ? 10 : 9.5) : 12.5;
      const rowLab = (k) => narrow ? codes[k] : `${classes[k]} (${rowSum[k]})`;
      const left = narrow ? 44 : 190, top = 6, right = 4;
      const cell = Math.min(58, Math.floor((W - left - right) / K));
      const bottom = narrow ? 40 : 118;
      const side = cell * K;
      const H = top + side + bottom;
      host.innerHTML = "";
      const svg = el("svg", { viewBox: `0 0 ${left + side + right} ${H}`, width: left + side + right, height: H, class: "cm-svg",
        role: "img", "aria-label": `Test confusion matrix, ${VIEWS.find((v) => v.id === view).label.toLowerCase()}; the same numbers follow as a table.` }, host);
      const rowLabels = [], colLabels = [], rects = [];
      for (let t = 0; t < K; t++) {
        rowLabels.push(el("text", { x: left - 8, y: top + (t + 0.5) * cell, class: "cm-axis", "text-anchor": "end",
          "dominant-baseline": "central", "font-size": font }, svg, rowLab(t)));
      }
      for (let p = 0; p < K; p++) {
        const x = left + (p + 0.5) * cell, y = top + side + 8;
        colLabels.push(narrow
          ? el("text", { x, y: y + font * 0.4, class: "cm-axis", "text-anchor": "middle", "dominant-baseline": "hanging", "font-size": font - 1 }, svg, codes[p])
          : el("text", { x, y, class: "cm-axis", "text-anchor": "end", "dominant-baseline": "central", "font-size": font,
              transform: `rotate(-45 ${x} ${y})` }, svg, classes[p]));
      }
      el("text", { x: left + side / 2, y: H - 4, class: "cm-title", "text-anchor": "middle", "font-size": font }, svg, "predicted class");
      for (let t = 0; t < K; t++) for (let p = 0; p < K; p++) {
        const x = left + p * cell, y = top + t * cell, n = C[t][p];
        const fill = n ? cellColor(sc, th, t, p) : null;
        const r = el("rect", { x: x + 1, y: y + 1, width: cell - 2, height: cell - 2, rx: 3,
          class: n ? "cm-cell" : "cm-cell cm-empty", ...(fill ? { fill } : {}) }, svg);
        rects.push(r);
        if (n) {
          const ink = contrast(fill, th.ink) >= contrast(fill, th.inkAlt) ? th.ink : th.inkAlt;
          el("text", { x: x + cell / 2, y: y + cell / 2, "text-anchor": "middle", "dominant-baseline": "central",
            "font-size": cellFont, fill: ink, class: "cm-num" }, svg, fmt(view, value(view, t, p)));
        }
      }
      // One hit target per cell, on top, so hover and tap work on empty cells too.
      const hit = el("rect", { x: left, y: top, width: side, height: side, fill: "transparent", class: "cm-hit" }, svg);
      const cellAt = (ev) => {
        const pt = svg.createSVGPoint(); pt.x = ev.clientX; pt.y = ev.clientY;
        const q = pt.matrixTransform(svg.getScreenCTM().inverse());
        const p = Math.floor((q.x - left) / cell), t = Math.floor((q.y - top) / cell);
        return t >= 0 && t < K && p >= 0 && p < K ? [t, p] : null;
      };
      const highlight = () => {
        const f = pinned || focus;
        rects.forEach((r, i) => r.classList.toggle("cm-hot", !!f && i === f[0] * K + f[1]));
        rowLabels.forEach((r, t) => r.classList.toggle("cm-axis-hot", !!f && t === f[0]));
        colLabels.forEach((c, p) => c.classList.toggle("cm-axis-hot", !!f && p === f[1]));
        showTip(f);
      };
      hit.addEventListener("pointermove", (ev) => { focus = cellAt(ev); highlight(); });
      hit.addEventListener("pointerleave", () => { focus = null; highlight(); });
      hit.addEventListener("click", (ev) => {
        const c = cellAt(ev);
        pinned = c && pinned && c[0] === pinned[0] && c[1] === pinned[1] ? null : c;
        highlight();
      });
      highlight();

      // Legends: one ramp per job, labelled with the ends of the range it spans in this view.
      legend.innerHTML = "";
      const unit = (v) => view === "count" ? String(Math.round(v)) : `${pct(v)}%`;
      const ramp = (name, colors, [lo, hi], note) => {
        const box = html("div", { class: "cm-key" }, legend);
        html("div", { class: "cm-key-name" }, box, name);
        const stops = Array.from({ length: 9 }, (_, i) => sample(colors, i / 8)).join(", ");
        html("div", { class: "cm-ramp", style: `background: linear-gradient(to right, ${stops})` }, box);
        const ends = html("div", { class: "cm-ends" }, box);
        html("span", {}, ends, unit(lo)); html("span", { class: "cm-key-note" }, ends, note); html("span", {}, ends, unit(hi));
      };
      const diagName = view === "row" ? "Correct: recall" : view === "col" ? "Correct: precision" : "Correct";
      ramp(diagName, th.good, sc.diag, "linear");
      ramp("Errors", th.bad, sc.off, "log scale");
      html("div", { class: "cm-legend-note" }, legend,
        `Rows are the true class, columns the prediction; blank cells have no tiles.${narrow ? " Tap a cell for its classes." : ""}`);

      // The accessible table mirrors the current view.
      table.innerHTML = "";
      html("caption", {}, table, `Test confusion matrix (${VIEWS.find((v) => v.id === view).label}); rows true class, columns predicted class`);
      const hr = html("tr", {}, html("thead", {}, table));
      html("th", { scope: "col" }, hr, "true \\ predicted");
      classes.forEach((c) => html("th", { scope: "col" }, hr, c));
      const tb = html("tbody", {}, table);
      for (let t = 0; t < K; t++) {
        const tr = html("tr", {}, tb);
        html("th", { scope: "row" }, tr, classes[t]);
        for (let p = 0; p < K; p++) html("td", {}, tr, fmt(view, value(view, t, p)) + (view === "count" ? "" : "%"));
      }
    }

    function showTip(f) {
      tip.innerHTML = "";
      tip.hidden = !f;                 // shown only while a cell is chosen
      if (!f) return;
      const [t, p] = f, n = C[t][p];
      const head = t === p ? `${classes[t]}, predicted correctly` : `${classes[t]} predicted as ${classes[p]}`;
      html("div", { class: "cm-tip-head" }, tip, head);
      html("div", {}, tip, `${n} tile${n === 1 ? "" : "s"}`);
      html("div", {}, tip, `${pct(n / rowSum[t])}% of the ${rowSum[t]} ${classes[t]} tiles${t === p ? " (recall)" : ""}`);
      html("div", {}, tip, colSum[p]
        ? `${pct(n / colSum[p])}% of the ${colSum[p]} tiles predicted ${classes[p]}${t === p ? " (precision)" : ""}`
        : `no tiles were predicted ${classes[p]}`);
    }

    render();
    // Re-lay out on width changes, and recolour when the site's theme toggle flips.
    new ResizeObserver(() => {
      const w = host.clientWidth;
      if (Math.abs(w - lastWidth) > 4) { lastWidth = w; render(); }
    }).observe(host);
    let wasDark = dark();
    new MutationObserver(() => { if (dark() !== wasDark) { wasDark = dark(); render(); } })
      .observe(document.body, { attributes: true, attributeFilter: ["class"] });
  }

  const start = () => document.querySelectorAll(".cm-player[data-src]").forEach((r) => mount(r).catch((e) => {
    r.textContent = `Could not load the confusion matrix (${e.message}).`;
  }));
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", start) : start();
})();
