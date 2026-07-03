/* main.js — starfield, scroll reveal, nav, RSSI meters */

// ---------- Starfield with occasional satellite pass ----------
(function () {
  const c = document.getElementById("starfield");
  if (!c) return;
  const ctx = c.getContext("2d");
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let stars = [], sat = null, W, H;

  function resize() {
    W = c.width = window.innerWidth;
    H = c.height = window.innerHeight;
    stars = Array.from({ length: Math.min(220, W / 6) }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.3 + 0.2,
      tw: Math.random() * Math.PI * 2,
      sp: 0.2 + Math.random() * 0.6,
    }));
  }
  window.addEventListener("resize", resize);
  resize();

  function spawnSat() {
    sat = { x: -30, y: H * (0.1 + Math.random() * 0.4), vx: 1.6 + Math.random(), trail: [] };
  }

  let t = 0;
  function frame() {
    ctx.clearRect(0, 0, W, H);
    t += 0.016;
    for (const s of stars) {
      const a = 0.35 + 0.65 * Math.abs(Math.sin(s.tw + t * s.sp));
      ctx.globalAlpha = a;
      ctx.fillStyle = "#cfe8ff";
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, 7);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    if (!reduced) {
      if (!sat && Math.random() < 0.0015) spawnSat();
      if (sat) {
        sat.x += sat.vx;
        sat.trail.push({ x: sat.x, y: sat.y });
        if (sat.trail.length > 40) sat.trail.shift();
        sat.trail.forEach((p, i) => {
          ctx.globalAlpha = (i / sat.trail.length) * 0.5;
          ctx.fillStyle = "#39d5ff";
          ctx.fillRect(p.x, p.y, 2, 2);
        });
        ctx.globalAlpha = 1;
        ctx.fillStyle = "#ffb340";
        ctx.fillRect(sat.x, sat.y, 3, 3);
        if (sat.x > W + 40) sat = null;
      }
      requestAnimationFrame(frame);
    } else {
      // static render once
    }
  }
  reduced ? frame() : requestAnimationFrame(frame);
})();

// ---------- Mobile nav ----------
(function () {
  const btn = document.getElementById("navToggle");
  const nav = document.querySelector("nav.main");
  if (btn && nav) btn.addEventListener("click", () => nav.classList.toggle("open"));
})();

// ---------- Scroll reveal (cards, timeline nodes) ----------
(function () {
  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("vis");
          // animate RSSI meters when revealed
          e.target.querySelectorAll(".rssi[data-level]").forEach(litMeter);
          if (e.target.matches(".rssi[data-level]")) litMeter(e.target);
          io.unobserve(e.target);
        }
      }),
    { threshold: 0.15 }
  );
  document.querySelectorAll(".reveal, .tnode, .rssi[data-level]").forEach((el) => io.observe(el));

  function litMeter(m) {
    if (m.classList.contains("lit")) return;
    m.classList.add("lit");
    const level = parseInt(m.dataset.level || "5", 10);
    const bars = m.querySelectorAll("i");
    bars.forEach((b, i) => {
      if (i < level) setTimeout(() => b.classList.add("on"), 120 * (i + 1));
    });
  }
})();

// ---------- Active nav link ----------
(function () {
  const page = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll("nav.main a").forEach((a) => {
    if (a.getAttribute("href") === page) a.classList.add("active");
  });
})();
