// Timed slideshow over the project logos at the top of "What I built". The slides are plain
// links in the page (each jumps to its subsection), so without JavaScript they show as a row of
// cards. With it, they stack into one stage that advances every few seconds with a 3D swing,
// pauses on hover, focus, or the pause button, and never auto-advances under reduced motion.
//
// Markup:  <div class="projects"> <a class="project-slide" href="#..." style="--accent: ..."> ... </a> ... </div>
(() => {
  "use strict";
  const INTERVAL = 3400;   // ms per slide

  function mount(root) {
    const slides = [...root.querySelectorAll(".project-slide")];
    if (slides.length < 2) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    root.classList.add("is-live");
    root.setAttribute("role", "region");
    root.setAttribute("aria-roledescription", "carousel");

    const stage = document.createElement("div");
    stage.className = "projects-stage";
    slides.forEach((s, i) => {
      s.setAttribute("role", "group");
      s.setAttribute("aria-roledescription", "slide");
      s.setAttribute("aria-label", `${i + 1} of ${slides.length}`);
      stage.appendChild(s);
    });
    root.appendChild(stage);

    const bar = document.createElement("div");
    bar.className = "projects-controls";
    const pause = document.createElement("button");
    pause.type = "button"; pause.className = "projects-pause";
    const dots = slides.map((s, i) => {
      const d = document.createElement("button");
      d.type = "button"; d.className = "projects-dot";
      d.setAttribute("aria-label", s.querySelector(".project-name").textContent);
      d.addEventListener("click", () => { go(i); });
      return d;
    });
    const progress = document.createElement("div");
    progress.className = "projects-progress";
    bar.append(pause, ...dots);
    root.append(bar, progress);

    let index = 0, playing = !reduced, hovered = false, visible = false, timer = 0;
    function show(i, prev) {
      slides.forEach((s, j) => {
        s.classList.toggle("is-active", j === i);
        s.classList.toggle("is-leaving", j === prev && prev !== i);
        s.setAttribute("aria-hidden", String(j !== i));
        s.tabIndex = j === i ? 0 : -1;
      });
      dots.forEach((d, j) => d.setAttribute("aria-current", String(j === i)));
    }
    function schedule() {
      clearTimeout(timer);
      const running = playing && !hovered && visible && !document.hidden;
      root.classList.toggle("is-running", running);
      // Restart the progress bar's fill so it tracks this slide's dwell time.
      progress.classList.remove("is-filling"); void progress.offsetWidth;
      if (running) { progress.classList.add("is-filling"); timer = setTimeout(() => go(index + 1), INTERVAL); }
    }
    function go(i) {
      const prev = index;
      index = (i + slides.length) % slides.length;
      show(index, prev);
      schedule();
    }
    const setPause = () => {
      pause.textContent = playing ? "❚❚" : "▶";
      pause.setAttribute("aria-label", playing ? "Pause the slideshow" : "Play the slideshow");
    };
    pause.addEventListener("click", () => { playing = !playing; setPause(); schedule(); });
    root.addEventListener("pointerenter", () => { hovered = true; schedule(); });
    root.addEventListener("pointerleave", () => { hovered = false; schedule(); });
    root.addEventListener("focusin", () => { hovered = true; schedule(); });
    root.addEventListener("focusout", (e) => { if (!root.contains(e.relatedTarget)) { hovered = false; schedule(); } });
    document.addEventListener("visibilitychange", schedule);
    new IntersectionObserver((es) => { visible = es.some((e) => e.isIntersecting); schedule(); }, { threshold: 0.4 }).observe(root);
    root.style.setProperty("--interval", `${INTERVAL}ms`);
    setPause(); show(0, -1); schedule();
  }

  const start = () => document.querySelectorAll(".projects").forEach(mount);
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", start) : start();
})();
