import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { initI18n, t } from "./i18n.js";

gsap.registerPlugin(ScrollTrigger);

const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
initI18n();

/* ───────────────── smooth scroll ───────────────── */
const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
lenis.on("scroll", ScrollTrigger.update);
gsap.ticker.add((t) => lenis.raf(t * 1000));
gsap.ticker.lagSmoothing(0);
window.__lenis = lenis;

/* ───────────────── nav ───────────────── */
const nav = $("#nav");
const burger = $(".nav__burger");
burger.addEventListener("click", () => {
  const open = burger.getAttribute("aria-expanded") !== "true";
  burger.setAttribute("aria-expanded", String(open));
  nav.classList.toggle("is-open", open);
});
$$("[data-scroll]").forEach((a) =>
  a.addEventListener("click", (e) => {
    e.preventDefault();
    nav.classList.remove("is-open");
    burger.setAttribute("aria-expanded", "false");
    const t = a.dataset.scroll === "#top" ? 0 : $(a.dataset.scroll);
    lenis.scrollTo(t, { offset: -48, duration: 1.3, easing: (x) => 1 - Math.pow(1 - x, 4) });
  })
);

/* ───────────────── hero: video shrinks into a tile ───────────────── */
if (!reduced) {
  gsap
    .timeline({
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom bottom", scrub: 0.8 },
      defaults: { ease: "none" },
    })
    .to(".hero__copy", { y: -80, opacity: 0, duration: 0.45 }, 0)
    .to(".hero__media", { scale: 0.86, borderRadius: 28, duration: 1 }, 0.1)
    .to(".hero__shade", { opacity: 0.4, duration: 1 }, 0.1);
}

/* scroll cue hides once the visitor has scrolled */
{
  const hero = $(".hero");
  const onScroll = () => hero.classList.toggle("is-scrolled", window.scrollY > 40);
  lenis.on("scroll", onScroll);
  window.addEventListener("scroll", onScroll, { passive: true });
}

/* ───────────────── carousels ───────────────── */
$$("[data-carousel]").forEach((c) => {
  const track = $(".carousel__track", c);
  const prev = $("[data-prev]", c);
  const next = $("[data-next]", c);
  const step = () => (track.firstElementChild?.getBoundingClientRect().width || 300) + 20;
  const update = () => {
    prev.disabled = track.scrollLeft <= 2;
    next.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 2;
  };
  prev.addEventListener("click", () => track.scrollBy({ left: -step(), behavior: "smooth" }));
  next.addEventListener("click", () => track.scrollBy({ left: step(), behavior: "smooth" }));
  track.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
  update();
});

/* ───────────────── chapter engine ─────────────────
   A chapter is a sticky viewport + a canvas. Its source is either a frame sequence
   (/seq/<name>/frame_###.webp) or a procedural renderer. Scroll progress 0→1 drives it. */

const procedural = {
  /* hanging line array: cabinets rim-lit, sound rings expanding as you scroll */
  array(ctx, w, h, p, t) {
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, w, h);
    const cx = w * 0.5, top = h * 0.08;
    const cab = Math.min(w, h) * 0.075;
    const n = 8;
    // rings
    ctx.globalCompositeOperation = "lighter";
    for (let i = 0; i < 9; i++) {
      const k = (i / 9 + p * 1.2 + t * 0.02) % 1;
      const r = k * w * 0.75 * (0.2 + p);
      const a = (1 - k) * 0.35 * p;
      ctx.strokeStyle = `rgba(255,255,255,${a})`;
      ctx.lineWidth = 1 + (1 - k) * 2;
      ctx.beginPath();
      ctx.arc(cx, top + cab * n * 0.55, r, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.globalCompositeOperation = "source-over";
    // hoist line
    ctx.strokeStyle = "#333";
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(cx, 0); ctx.lineTo(cx, top); ctx.stroke();
    // cabinets (slight J-curve)
    for (let i = 0; i < n; i++) {
      const y = top + i * cab * 1.04;
      const tilt = (i / (n - 1)) * 0.18;
      ctx.save();
      ctx.translate(cx, y);
      ctx.rotate(tilt);
      const g = ctx.createLinearGradient(-cab * 1.6, 0, cab * 1.6, 0);
      g.addColorStop(0, "#2a2a2c"); g.addColorStop(0.5, "#101012"); g.addColorStop(1, "#2a2a2c");
      ctx.fillStyle = g;
      ctx.fillRect(-cab * 1.6, 0, cab * 3.2, cab);
      ctx.strokeStyle = `rgba(255,255,255,${0.25 + 0.5 * p * (0.5 + 0.5 * Math.sin(t * 6 + i))})`;
      ctx.lineWidth = 1;
      ctx.strokeRect(-cab * 1.6, 0, cab * 3.2, cab);
      // grille dots
      ctx.fillStyle = `rgba(255,255,255,${0.08 + 0.12 * p})`;
      for (let gx = -cab * 1.4; gx < cab * 1.5; gx += cab * 0.22)
        for (let gy = cab * 0.2; gy < cab * 0.9; gy += cab * 0.22) ctx.fillRect(gx, gy, 2, 2);
      ctx.restore();
    }
    // floor glow
    const fg = ctx.createRadialGradient(cx, h, 0, cx, h, w * 0.5);
    fg.addColorStop(0, `rgba(255,255,255,${0.12 * p})`); fg.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = fg; ctx.fillRect(0, h * 0.6, w, h * 0.4);
  },

  /* 12 moving heads on a truss: straight down → fanned crown */
  beams(ctx, w, h, p, t) {
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, w, h);
    const n = 12;
    const trussY = h * 0.12;
    // haze glow
    const g = ctx.createRadialGradient(w / 2, trussY, 0, w / 2, trussY, h);
    g.addColorStop(0, `rgba(255,255,255,${0.10 + p * 0.08})`);
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
    // truss
    ctx.fillStyle = "#1a1a1a";
    ctx.fillRect(w * 0.08, trussY - 6, w * 0.84, 12);
    ctx.globalCompositeOperation = "lighter";
    for (let i = 0; i < n; i++) {
      const x = w * (0.12 + (0.76 * i) / (n - 1));
      const rel = (i / (n - 1)) * 2 - 1; // -1..1
      const ang = rel * p * 1.05 + Math.sin(t * 0.4 + i) * 0.01;
      const len = h * 1.4;
      const spread = 0.045;
      ctx.save();
      ctx.translate(x, trussY);
      ctx.rotate(-ang);
      const lg = ctx.createLinearGradient(0, 0, 0, len);
      lg.addColorStop(0, "rgba(255,255,255,0.9)");
      lg.addColorStop(0.25, "rgba(255,255,255,0.35)");
      lg.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = lg;
      ctx.beginPath();
      ctx.moveTo(-2, 0);
      ctx.lineTo(2, 0);
      ctx.lineTo(len * spread * 2.4, len);
      ctx.lineTo(-len * spread * 2.4, len);
      ctx.closePath();
      ctx.fill();
      // fixture
      ctx.fillStyle = "#fff";
      ctx.beginPath();
      ctx.arc(0, 0, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    ctx.globalCompositeOperation = "source-over";
  },

  /* two cold-spark fountains: off → full fountain */
  sparks(ctx, w, h, p, t) {
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, w, h);
    const floorY = h * 0.78;
    // floor reflection glow
    const fg = ctx.createLinearGradient(0, floorY, 0, h);
    fg.addColorStop(0, `rgba(255,220,160,${0.18 * p})`);
    fg.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = fg;
    ctx.fillRect(0, floorY, w, h - floorY);
    ctx.fillStyle = "#0a0a0a";
    ctx.fillRect(0, floorY, w, 2);
    const emitters = [w * 0.3, w * 0.7];
    const maxH = h * 0.62;
    ctx.globalCompositeOperation = "lighter";
    for (const ex of emitters) {
      // machine
      ctx.fillStyle = "#111";
      ctx.fillRect(ex - 28, floorY - 22, 56, 22);
      ctx.fillStyle = "#2a2a2a";
      ctx.fillRect(ex - 6, floorY - 26, 12, 4);
      if (p < 0.02) continue;
      const count = Math.floor(60 + 540 * p);
      for (let i = 0; i < count; i++) {
        const seed = i * 0.6180339887;
        const life = (seed + t * 0.25) % 1; // 0 → 1 over a particle's flight
        const rise = Math.sin(life * Math.PI);
        const spreadX = (((seed * 7.13) % 1) - 0.5) * 2;
        const height = maxH * p * (0.55 + ((seed * 3.7) % 1) * 0.45);
        const x = ex + spreadX * (life * w * 0.07 * (0.5 + p));
        const y = floorY - 24 - rise * height - life * life * height * 0.1;
        const a = (1 - life) * (0.5 + p * 0.5);
        const warm = life > 0.6;
        ctx.fillStyle = warm ? `rgba(255,190,110,${a})` : `rgba(255,255,255,${a})`;
        const r = 0.8 + ((seed * 11) % 1) * 1.6;
        ctx.fillRect(x, y, r, r * 2.2);
      }
      // base glow
      const bg = ctx.createRadialGradient(ex, floorY - 20, 0, ex, floorY - 20, 120 * p + 10);
      bg.addColorStop(0, `rgba(255,255,255,${0.9 * p})`);
      bg.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = bg;
      ctx.fillRect(ex - 140, floorY - 160, 280, 160);
    }
    ctx.globalCompositeOperation = "source-over";
  },

  /* low-lying fog rising under a spotlight: empty floor → full cloud */
  fog(ctx, w, h, p, t) {
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, w, h);
    // spotlight cone
    const cone = ctx.createRadialGradient(w / 2, h * 0.1, 0, w / 2, h * 0.75, h * 0.7);
    cone.addColorStop(0, "rgba(255,255,255,0.22)");
    cone.addColorStop(0.6, "rgba(255,255,255,0.05)");
    cone.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = cone;
    ctx.fillRect(0, 0, w, h);
    // floor
    const floorY = h * 0.72;
    const fl = ctx.createLinearGradient(0, floorY, 0, h);
    fl.addColorStop(0, "rgba(255,255,255,0.12)");
    fl.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = fl;
    ctx.fillRect(0, floorY, w, h - floorY);
    // couple's silhouette hint (two columns)
    ctx.fillStyle = "#050505";
    ctx.fillRect(w * 0.46, floorY - h * 0.42, w * 0.03, h * 0.42);
    ctx.fillRect(w * 0.51, floorY - h * 0.4, w * 0.03, h * 0.4);
    // fog puffs
    const puffs = 26;
    for (let i = 0; i < puffs; i++) {
      const seed = i * 0.618;
      const px = (seed % 1) * w;
      const drift = Math.sin(t * 0.3 + i) * 20;
      const base = floorY + 10;
      const lift = p * h * (0.08 + ((seed * 5.3) % 1) * 0.1);
      const r = w * (0.12 + ((seed * 2.9) % 1) * 0.16) * (0.3 + p);
      const alpha = Math.min(0.42, p * 0.55) * (0.6 + ((seed * 1.7) % 1) * 0.4);
      const g = ctx.createRadialGradient(px + drift, base - lift, 0, px + drift, base - lift, r);
      g.addColorStop(0, `rgba(255,255,255,${alpha})`);
      g.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = g;
      ctx.fillRect(px + drift - r, base - lift - r, r * 2, r * 2);
    }
  },
};

class Chapter {
  constructor(el) {
    this.el = el;
    this.canvas = $(".chapter__canvas", el);
    this.ctx = this.canvas.getContext("2d", { alpha: false });
    this.copy = $(".chapter__copy", el);
    this.progress = 0;
    this.t = 0;
    this.frames = [];
    this.seq = el.dataset.seq;
    this.count = +el.dataset.frames || 0;
    this.proc = procedural[el.dataset.proc];
    this.resize();
    window.addEventListener("resize", () => this.resize());
    if (this.seq) this.load();
  }
  resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    this.w = this.canvas.clientWidth;
    this.h = this.canvas.clientHeight;
    this.canvas.width = Math.round(this.w * dpr);
    this.canvas.height = Math.round(this.h * dpr);
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.render();
  }
  load() {
    const url = (i) => `${this.seq}frame_${String(i + 1).padStart(3, "0")}.webp`;
    // first frame now, the rest in the background
    const first = new Image();
    first.src = url(0);
    first.decode().then(() => { this.frames[0] = first; this.render(); });
    let i = 1;
    const next = () => {
      if (i >= this.count) return;
      const img = new Image();
      const k = i++;
      img.src = url(k);
      img.decode().then(() => { this.frames[k] = img; if (k === this.frameIndex()) this.render(); next(); }).catch(next);
    };
    for (let j = 0; j < 4; j++) next(); // 4 parallel lanes
  }
  frameIndex() { return Math.min(this.count - 1, Math.round(this.progress * (this.count - 1))); }
  render() {
    const { ctx, w, h } = this;
    if (!w || !h) return;
    if (this.proc) return this.proc(ctx, w, h, this.progress, this.t);
    // nearest loaded frame at or before the target
    let k = this.frameIndex();
    while (k > 0 && !this.frames[k]) k--;
    const img = this.frames[k];
    if (!img) return;
    const s = Math.max(w / img.naturalWidth, h / img.naturalHeight);
    const dw = img.naturalWidth * s, dh = img.naturalHeight * s;
    ctx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh);
  }
}

const chapters = $$("[data-chapter]").map((el) => new Chapter(el));

if (!reduced) {
  chapters.forEach((ch) => {
    ScrollTrigger.create({
      trigger: ch.el,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onUpdate: (st) => { ch.progress = st.progress; ch.render(); },
    });
    // copy choreography: rise in, hold, drift out
    gsap
      .timeline({ scrollTrigger: { trigger: ch.el, start: "top top", end: "bottom bottom", scrub: 0.5 }, defaults: { ease: "none" } })
      .fromTo(ch.copy, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.18 }, 0.08)
      .to(ch.copy, { opacity: 0, y: -30, duration: 0.15 }, 0.82);
  });
  // procedural chapters get a gentle idle motion even when not scrolling
  gsap.ticker.add((t) => {
    chapters.forEach((ch) => {
      if (!ch.proc) return;
      const r = ch.el.getBoundingClientRect();
      if (r.bottom < 0 || r.top > innerHeight) return;
      ch.t = t;
      ch.render();
    });
  });
} else {
  chapters.forEach((ch) => { ch.progress = 1; ch.render(); });
}

/* ───────────────── reveals (IntersectionObserver: independent of rAF) ───────────────── */
{
  const io = new IntersectionObserver(
    (entries) => {
      entries
        .filter((e) => e.isIntersecting)
        .forEach((e, i) => {
          io.unobserve(e.target);
          setTimeout(() => e.target.classList.add("is-in"), i * 80);
        });
    },
    { rootMargin: "0px 0px -10% 0px", threshold: 0.05 }
  );
  $$("[data-reveal]").forEach((el) => io.observe(el));
}

/* ───────────────── contact form (FormSubmit AJAX, no backend to run) ───────────────── */
{
  const form = $("#contact-form");
  const status = $(".form__status", form);
  const btn = $(".form__submit", form);
  // "Get a quote" / "Ask about media" preselect the interest
  $$("[data-interest]").forEach((a) =>
    a.addEventListener("click", () => {
      const sel = $("#form-interest");
      const opt = [...sel.options].find((o) => o.value === a.dataset.interest);
      if (opt) sel.value = opt.value;
    })
  );
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!form.reportValidity()) return;
    btn.disabled = true;
    status.className = "form__status";
    status.textContent = t("form.sending");
    try {
      const res = await fetch(form.action, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.success === "false" || data.success === false) throw new Error(data.message || res.statusText);
      status.classList.add("is-ok");
      status.textContent = t("form.ok");
      form.reset();
    } catch (err) {
      status.classList.add("is-err");
      status.textContent = t("form.err");
    } finally {
      btn.disabled = false;
    }
  });
}

/* ───────────────── misc ───────────────── */
const vid = $(".hero__video");
if (vid?.dataset.src) {
  // phones get the portrait cut, everything else the 16:9 cut
  const portrait = window.matchMedia("(max-width: 734px) and (orientation: portrait)").matches;
  const src = portrait ? vid.dataset.src.replace("-1080", "-portrait") : vid.dataset.src;
  if (portrait && vid.poster) vid.poster = vid.poster.replace("poster.webp", "poster-portrait.webp");
  fetch(src, { method: "HEAD" }).then((r) => {
    if (!r.ok || !r.headers.get("content-type")?.startsWith("video")) return;
    vid.src = src;
    vid.play().catch(() => window.addEventListener("pointerdown", () => vid.play().catch(() => {}), { once: true }));
  }).catch(() => {});
}
window.addEventListener("load", () => ScrollTrigger.refresh());
