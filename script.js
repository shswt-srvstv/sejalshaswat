// ---------- Photo placeholders ----------
// Any image that isn't uploaded yet shows a pink "add photo" box with its filename.
document.querySelectorAll("img[data-label]").forEach((img) => {
  const swap = () => {
    const ph = document.createElement("div");
    ph.className = "placeholder";
    ph.innerHTML = `<b>＋</b>add photo<code>${img.dataset.label}</code>`;
    img.replaceWith(ph);
  };
  if (img.complete && img.naturalWidth === 0) swap();
  else img.addEventListener("error", swap, { once: true });
});

// ---------- Envelope -> card ----------
const envelope = document.getElementById("envelope");
const envScreen = document.getElementById("envelope-screen");
const card = document.getElementById("card");
const music = document.getElementById("music");
const musicBtn = document.getElementById("music-btn");

envelope.addEventListener("click", () => {
  envelope.classList.add("open");
  tryMusic();
  setTimeout(() => {
    envScreen.classList.remove("active");
    card.classList.add("active");
    card.removeAttribute("aria-hidden");
    window.scrollTo(0, 0);
    burst(220);
  }, 1300);
});

// ---------- Optional music (only shows the button if song.mp3 exists) ----------
function tryMusic() {
  music.play().then(() => {
    musicBtn.hidden = false;
    musicBtn.classList.add("playing");
  }).catch(() => {});
}
musicBtn.addEventListener("click", () => {
  if (music.paused) { music.play(); musicBtn.classList.add("playing"); }
  else { music.pause(); musicBtn.classList.remove("playing"); }
});

// ---------- Scroll reveal ----------
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("visible"); io.unobserve(e.target); } });
}, { threshold: 0.15 });
document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

// ---------- Reason flip cards ----------
document.querySelectorAll(".reason").forEach((r) => r.addEventListener("click", () => r.classList.toggle("flipped")));

// ---------- Candles ----------
const candles = document.querySelectorAll(".candle");
candles.forEach((c) => c.addEventListener("click", () => {
  c.classList.add("out");
  if ([...candles].every((x) => x.classList.contains("out"))) {
    document.getElementById("wish-msg").classList.add("show");
    burst(260);
  }
}));

// ---------- Replay ----------
document.getElementById("replay").addEventListener("click", () => {
  candles.forEach((c) => c.classList.remove("out"));
  document.getElementById("wish-msg").classList.remove("show");
  burst(300);
});

// ---------- Confetti ----------
const canvas = document.getElementById("confetti");
const ctx = canvas.getContext("2d");
let pieces = [];
let running = false;
const colors = ["#c94f6d", "#f3c9cf", "#d9a85b", "#ffffff", "#8e2c48", "#ff9fb2"];

function resize() { canvas.width = innerWidth; canvas.height = innerHeight; }
addEventListener("resize", resize); resize();

function burst(n) {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  for (let i = 0; i < n; i++) {
    pieces.push({
      x: Math.random() * canvas.width,
      y: -20 - Math.random() * canvas.height * 0.5,
      w: 6 + Math.random() * 6,
      h: 8 + Math.random() * 8,
      vy: 2 + Math.random() * 3,
      vx: -1.5 + Math.random() * 3,
      rot: Math.random() * Math.PI,
      vr: -0.1 + Math.random() * 0.2,
      heart: Math.random() < 0.25,
      c: colors[(Math.random() * colors.length) | 0],
    });
  }
  if (!running) { running = true; requestAnimationFrame(tick); }
}

function heart(x, y, s) {
  ctx.beginPath();
  ctx.moveTo(x, y + s / 4);
  ctx.bezierCurveTo(x, y, x - s / 2, y, x - s / 2, y + s / 4);
  ctx.bezierCurveTo(x - s / 2, y + s / 2, x, y + s * 0.7, x, y + s);
  ctx.bezierCurveTo(x, y + s * 0.7, x + s / 2, y + s / 2, x + s / 2, y + s / 4);
  ctx.bezierCurveTo(x + s / 2, y, x, y, x, y + s / 4);
  ctx.fill();
}

function tick() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  pieces.forEach((p) => {
    p.x += p.vx; p.y += p.vy; p.rot += p.vr;
    ctx.save();
    ctx.translate(p.x, p.y); ctx.rotate(p.rot);
    ctx.fillStyle = p.c;
    if (p.heart) heart(0, -p.h / 2, p.h * 1.3);
    else ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
    ctx.restore();
  });
  pieces = pieces.filter((p) => p.y < canvas.height + 40);
  if (pieces.length) requestAnimationFrame(tick);
  else { running = false; ctx.clearRect(0, 0, canvas.width, canvas.height); }
}
