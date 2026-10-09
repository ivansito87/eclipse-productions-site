import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const isTouch = window.matchMedia("(hover: none), (pointer: coarse)").matches;

/* ─────────────────────────── smooth scroll ─────────────────────────── */
const lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
window.__lenis = lenis;
lenis.on("scroll", ScrollTrigger.update);
gsap.ticker.add((t) => lenis.raf(t * 1000));
gsap.ticker.lagSmoothing(0);
lenis.stop();

/* ─────────────────────────── split helpers ─────────────────────────── */
function splitChars(el) {
  const text = el.textContent;
  el.textContent = "";
  [...text].forEach((c) => {
    const s = document.createElement("span");
    s.className = "ch";
    s.textContent = c === " " ? " " : c;
    el.appendChild(s);
  });
  return $$(".ch", el);
}
function splitWords(el) {
  const words = el.textContent.trim().split(/\s+/);
  el.innerHTML = words.map((w) => `<span class="w">${w}</span>`).join(" ");
  return $$(".w", el);
}

const heroChars = $$("[data-split]").flatMap(splitChars);
gsap.set(".eclipse__moon", { xPercent: -120 });
gsap.set(".preloader__moon", { xPercent: -110 });
const manifestoWords = splitWords($("[data-words]"));

/* ─────────────────────────── preloader + intro ─────────────────────────── */
const pre = $(".preloader");
const preCount = $("[data-count]");
const counter = { v: 0 };

const intro = gsap.timeline({
  paused: true,
  defaults: { ease: "power3.out" },
  onComplete: () => {
    buildHeroScrub();
    lenis.start();
    ScrollTrigger.refresh();
  },
});
intro
  .from(".eclipse__sun", { scale: 0, duration: 1.4, ease: "expo.out" }, 0)
  .from(".hero__video video", { opacity: 0, duration: 1.6 }, 0)
  .from(heroChars, { yPercent: 110, duration: 1.1, stagger: 0.03, ease: "expo.out" }, 0.15)
  .from(".hero__eyebrow", { opacity: 0, y: 10, duration: 0.8 }, 0.7)
  .from(".hero__tag", { opacity: 0, y: 14, duration: 0.8 }, 0.9)
  .from(".hero__meta, .corner", { opacity: 0, duration: 0.8 }, 1.0)
  .from(".nav", { yPercent: -100, duration: 0.9, ease: "expo.out" }, 0.6);

/* the eclipse: built only after the intro so no two tweens fight over the same letters */
function buildHeroScrub() {
  if (reduced) return;
  gsap
    .timeline({
      scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "+=120%",
        pin: true,
        scrub: 0.6,
        anticipatePin: 1,
      },
      defaults: { ease: "none" },
    })
    .to(".eclipse__moon", { xPercent: 0, duration: 1 }, 0)
    .to(".eclipse__glow", { opacity: 1, duration: 0.4 }, 0.55)
    .to(".hero__video", { scale: 1.18, opacity: 0.15, duration: 1 }, 0)
    .to(".hero__eyebrow, .hero__tag", { opacity: 0, y: -20, duration: 0.35 }, 0)
    .to(heroChars, { yPercent: -120, opacity: 0, stagger: 0.012, duration: 0.5 }, 0.35)
    .to(".hero__meta", { opacity: 0, duration: 0.3 }, 0.5)
    .to(".hero__eclipse", { scale: 0.55, duration: 0.5 }, 0.5)
    .to(".eclipse__totality", { opacity: 1, duration: 0.25 }, 0.75);
}

function finishLoad() {
  document.documentElement.classList.add("is-ready");
  const vid = $("video");
  vid?.play().catch(() => {
    const kick = () => { vid.play().catch(() => {}); window.removeEventListener("pointerdown", kick); };
    window.addEventListener("pointerdown", kick);
  });
  intro.play();
}

if (reduced) {
  pre.remove();
  intro.progress(1); // fires onComplete → scrub skipped, scroll enabled
  finishLoad();
} else {
  gsap
    .timeline({
      onComplete: () => {
        pre.remove();
        finishLoad();
      },
    })
    .to(counter, {
      v: 100,
      duration: 1.3,
      ease: "power2.inOut",
      onUpdate: () => (preCount.textContent = String(Math.round(counter.v)).padStart(3, "0")),
    })
    .to(".preloader__moon", { xPercent: 0, duration: 1.3, ease: "power2.inOut" }, "<")
    .to(".preloader__mark", { scale: 0.6, opacity: 0, duration: 0.5, ease: "power2.in" }, "+=0.15")
    .to(".preloader__count, .preloader__label", { opacity: 0, duration: 0.3 }, "<")
    .to(pre, { yPercent: -100, duration: 0.9, ease: "expo.inOut" }, "-=0.1");
}

/* ─────────────────────────── cursor ─────────────────────────── */
if (!isTouch) {
  const cur = $(".cursor");
  const dot = $(".cursor__dot");
  const ring = $(".cursor__ring");
  const pos = { x: innerWidth / 2, y: innerHeight / 2 };
  const ringPos = { ...pos };
  gsap.set([dot, ring], { x: pos.x, y: pos.y });
  window.addEventListener("mousemove", (e) => {
    pos.x = e.clientX;
    pos.y = e.clientY;
    gsap.set(dot, { x: pos.x, y: pos.y });
  });
  gsap.ticker.add(() => {
    ringPos.x += (pos.x - ringPos.x) * 0.18;
    ringPos.y += (pos.y - ringPos.y) * 0.18;
    gsap.set(ring, { x: ringPos.x, y: ringPos.y });
  });
  document.addEventListener("mouseover", (e) => {
    cur.classList.toggle("is-hover", !!e.target.closest("a, button, .card, .film__f, .row"));
  });
  document.addEventListener("mouseleave", () => cur.classList.add("is-hidden"));
  document.addEventListener("mouseenter", () => cur.classList.remove("is-hidden"));
}

/* ─────────────────────────── nav / menu ─────────────────────────── */
const burger = $(".nav__burger");
const menu = $("#menu");
function setMenu(open) {
  burger.setAttribute("aria-expanded", String(open));
  menu.setAttribute("aria-hidden", String(!open));
  menu.classList.toggle("is-open", open);
  open ? lenis.stop() : lenis.start();
}
burger.addEventListener("click", () => setMenu(burger.getAttribute("aria-expanded") !== "true"));

$$("[data-scroll]").forEach((a) => {
  a.addEventListener("click", (e) => {
    e.preventDefault();
    setMenu(false);
    const target = a.dataset.scroll === "#top" ? 0 : $(a.dataset.scroll);
    lenis.scrollTo(target, { offset: 0, duration: 1.4, easing: (t) => 1 - Math.pow(1 - t, 4) });
  });
});

/* ─────────────────────────── manifesto word scrub ─────────────────────────── */
if (!reduced) {
  gsap.to(manifestoWords, {
    opacity: 1,
    stagger: 0.08,
    ease: "none",
    scrollTrigger: {
      trigger: ".manifesto",
      start: "top 80%",
      end: "bottom 45%",
      scrub: 0.4,
    },
  });
}

/* ─────────────────────────── counters ─────────────────────────── */
$$("[data-counter]").forEach((el) => {
  const target = +el.dataset.counter;
  const o = { v: 0 };
  ScrollTrigger.create({
    trigger: el,
    start: "top 85%",
    once: true,
    onEnter: () =>
      gsap.to(o, {
        v: target,
        duration: 1.6,
        ease: "power3.out",
        onUpdate: () => (el.textContent = Math.round(o.v)),
      }),
  });
});

/* ─────────────────────────── services: horizontal panorama ─────────────────────────── */
const mm = gsap.matchMedia();
mm.add("(min-width: 901px)", () => {
  const track = $(".services__track");
  const bar = $("[data-progress-bar]");
  const label = $("[data-progress-label]");
  const cards = $$(".card:not(.card--intro):not(.card--end)", track);
  const dist = () => track.scrollWidth - window.innerWidth + parseFloat(getComputedStyle(track).paddingRight);

  const tween = gsap.to(track, {
    x: () => -dist(),
    ease: "none",
    scrollTrigger: {
      trigger: ".services",
      start: "top top",
      end: () => "+=" + dist() * 1.1,
      pin: ".services__pin",
      scrub: 0.8,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: (st) => {
        gsap.set(bar, { scaleX: st.progress });
        const idx = Math.min(cards.length, Math.max(1, Math.round(st.progress * cards.length) || 1));
        label.textContent = String(idx).padStart(2, "0");
      },
    },
  });

  // subtle depth: each card drifts at a slightly different rate
  cards.forEach((c, i) => {
    gsap.fromTo(
      c,
      { yPercent: 2 + (i % 3) * 2 },
      { yPercent: 0, ease: "none", scrollTrigger: { containerAnimation: tween, trigger: c, start: "left right", end: "right left", scrub: true } }
    );
  });

  return () => gsap.set(track, { clearProps: "transform" });
});

/* ─────────────────────────── filmstrip parallax ─────────────────────────── */
{
  const film = $("[data-film]");
  const strip = () => film.scrollWidth - window.innerWidth;
  gsap.to(film, {
    x: () => -strip() * 0.9,
    ease: "none",
    scrollTrigger: {
      trigger: ".gallery",
      start: "top bottom",
      end: "bottom top",
      scrub: 1,
      invalidateOnRefresh: true,
    },
  });
}

/* ─────────────────────────── reveals ─────────────────────────── */
ScrollTrigger.batch("[data-reveal]", {
  start: "top 88%",
  once: true,
  onEnter: (els) => els.forEach((el, i) => setTimeout(() => el.classList.add("is-in"), i * 90)),
});

/* ─────────────────────────── contact big type ─────────────────────────── */
{
  const lines = $$(".contact__big > span");
  const inner = lines.map((l) => {
    const s = document.createElement("span");
    s.style.display = "block";
    s.innerHTML = l.innerHTML;
    l.innerHTML = "";
    l.appendChild(s);
    return s;
  });
  gsap.from(inner, {
    yPercent: 105,
    duration: 1.2,
    ease: "expo.out",
    stagger: 0.12,
    scrollTrigger: { trigger: ".contact", start: "top 60%", once: true },
  });
}

/* ─────────────────────────── marquee reacts to scroll speed ─────────────────────────── */
{
  const track = $(".marquee__track");
  let v = 0;
  lenis.on("scroll", ({ velocity }) => (v = velocity));
  gsap.ticker.add(() => {
    const speed = gsap.utils.clamp(0.4, 4, 1 + Math.abs(v) * 0.08);
    track.style.animationDuration = `${28 / speed}s`;
  });
}

/* ─────────────────────────── misc ─────────────────────────── */
$("[data-year]").textContent = new Date().getFullYear();
document.fonts?.ready.then(() => ScrollTrigger.refresh());
window.addEventListener("load", () => ScrollTrigger.refresh());
