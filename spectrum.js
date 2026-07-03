/* spectrum.js — animated spectrum-analyzer hero navigation
   Peaks = career domains. Hover shows label, click navigates. */
(function () {
  const c = document.getElementById("spectrum");
  if (!c) return;
  const ctx = c.getContext("2d");
  const tip = document.getElementById("bandTip");
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Career "bands": position (0-1), label, destination
  const BANDS = [
    { p: 0.08, label: "GSM/UMTS · Legacy RAN", href: "expertise.html#ran" },
    { p: 0.20, label: "LTE / 5G NR · Drive Test & Optimization", href: "expertise.html#ran" },
    { p: 0.33, label: "CBRS 3.5 GHz · Private Networks", href: "expertise.html#private" },
    { p: 0.46, label: "2.4/5.8 GHz ISM · UAS Data Links", href: "expertise.html#uas" },
    { p: 0.60, label: "C-Band · Satcom", href: "expertise.html#space" },
    { p: 0.73, label: "Antenna Arrays · MIMO / Beamforming", href: "expertise.html#antenna" },
    { p: 0.87, label: "Ka-Band · Lunar Comms (Blue Origin)", href: "expertise.html#space" },
  ];

  let W, H, mouseX = -1, hover = null, t = 0;

  function resize() {
    const r = c.getBoundingClientRect();
    W = c.width = r.width * devicePixelRatio;
    H = c.height = r.height * devicePixelRatio;
    ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  }
  window.addEventListener("resize", resize);
  resize();

  function noise(x, t) {
    return (
      Math.sin(x * 0.09 + t * 1.7) * 2 +
      Math.sin(x * 0.023 + t * 0.9) * 3 +
      Math.sin(x * 0.31 + t * 3.1) * 1.2
    );
  }

  function draw() {
    const w = c.getBoundingClientRect().width;
    const h = c.getBoundingClientRect().height;
    ctx.clearRect(0, 0, w, h);
    t += reduced ? 0 : 0.016;

    // grid
    ctx.strokeStyle = "rgba(57,213,255,0.08)";
    ctx.lineWidth = 1;
    for (let gy = 0; gy < h; gy += h / 5) {
      ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke();
    }

    // trace
    const base = h - 26;
    ctx.beginPath();
    for (let x = 0; x <= w; x += 2) {
      let y = base - 8 - noise(x, t);
      const frac = x / w;
      for (const b of BANDS) {
        const d = Math.abs(frac - b.p);
        if (d < 0.045) {
          const peak = Math.cos((d / 0.045) * Math.PI * 0.5);
          const wob = reduced ? 1 : 0.85 + 0.15 * Math.sin(t * 2.2 + b.p * 40);
          y -= peak * peak * (h * 0.62) * wob;
        }
      }
      x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, "#39d5ff");
    grad.addColorStop(1, "rgba(57,213,255,0.25)");
    ctx.strokeStyle = grad;
    ctx.lineWidth = 2;
    ctx.stroke();
    // fill under trace
    ctx.lineTo(w, h); ctx.lineTo(0, h); ctx.closePath();
    ctx.fillStyle = "rgba(57,213,255,0.07)";
    ctx.fill();

    // sweep line
    if (!reduced) {
      const sx = ((t * 0.11) % 1) * w;
      ctx.strokeStyle = "rgba(255,179,64,0.35)";
      ctx.beginPath(); ctx.moveTo(sx, 0); ctx.lineTo(sx, h); ctx.stroke();
    }

    // band markers
    for (const b of BANDS) {
      const bx = b.p * w;
      const isH = hover === b;
      ctx.fillStyle = isH ? "#ffb340" : "rgba(255,179,64,0.55)";
      ctx.beginPath();
      ctx.moveTo(bx, base + 6);
      ctx.lineTo(bx - 5, base + 14);
      ctx.lineTo(bx + 5, base + 14);
      ctx.closePath();
      ctx.fill();
      if (isH) {
        ctx.strokeStyle = "rgba(255,179,64,0.5)";
        ctx.setLineDash([4, 4]);
        ctx.beginPath(); ctx.moveTo(bx, 0); ctx.lineTo(bx, base + 6); ctx.stroke();
        ctx.setLineDash([]);
      }
    }

    // baseline
    ctx.strokeStyle = "rgba(219,230,245,0.25)";
    ctx.beginPath(); ctx.moveTo(0, base + 6); ctx.lineTo(w, base + 6); ctx.stroke();

    if (!reduced) requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);

  // interactivity
  c.addEventListener("mousemove", (e) => {
    const r = c.getBoundingClientRect();
    const frac = (e.clientX - r.left) / r.width;
    hover = BANDS.find((b) => Math.abs(frac - b.p) < 0.05) || null;
    if (hover && tip) {
      tip.textContent = "▶ " + hover.label;
      tip.style.left = hover.p * r.width + 18 + "px";
      tip.style.top = "40px";
      tip.style.opacity = 1;
      c.style.cursor = "pointer";
    } else if (tip) {
      tip.style.opacity = 0;
      c.style.cursor = "default";
    }
  });
  c.addEventListener("mouseleave", () => { hover = null; if (tip) tip.style.opacity = 0; });
  c.addEventListener("click", () => { if (hover) location.href = hover.href; });
})();
