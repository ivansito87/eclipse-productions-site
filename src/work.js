import { initI18n, t, ES, EN_EXTRA } from "./i18n.js";

Object.assign(ES, {
  "work.nav": "Nuestro trabajo", "work.title": "Nuestro trabajo.",
  "work.lede": "Noches reales, salones reales. Toca cualquier tarjeta para verla aquí mismo.",
  "work.all": "Todo", "work.more": "Cada semana hay más en", "work.open": "Ver en {platform}",
  "work.soon": "El video de esta noche se sube pronto.",
});
Object.assign(EN_EXTRA, { "work.open": "Open on {platform}", "work.soon": "This night's video is coming soon." });
initI18n();
document.title = `${t("work.title").replace(/\.$/, "")} — ${document.title.split(" — ")[0]}`;

const $ = (s, c = document) => c.querySelector(s);
const mosaic = $("#mosaic");
const box = $("#lightbox");
const media = $("#lightbox-media");
const typeKey = { Wedding: "s30", "Quinceañera": "s31", "Sweet 16": "s32", Corporate: "s33", "Private party": "s34" };

/* Which platform, and the no-API embed URL for it. Public reels/videos only. */
function embedFor(url) {
  if (!url) return null;
  let m;
  if ((m = url.match(/instagram\.com\/(?:reel|p|reels)\/([A-Za-z0-9_-]+)/))) return { platform: "Instagram", src: `https://www.instagram.com/reel/${m[1]}/embed/` };
  if ((m = url.match(/tiktok\.com\/.*\/video\/(\d+)/))) return { platform: "TikTok", src: `https://www.tiktok.com/embed/v2/${m[1]}` };
  if ((m = url.match(/(?:youtube\.com\/(?:shorts|watch\?v=)|youtu\.be\/)([A-Za-z0-9_-]{6,})/))) return { platform: "YouTube", src: `https://www.youtube.com/embed/${m[1]}?autoplay=1&playsinline=1` };
  return { platform: "Instagram", src: url };
}

const pic = (name, sizes) => {
  if (name.startsWith("/")) return `<img src="${name}" alt="" loading="lazy" />`;
  const ws = [480, 960, 1440];
  return `<img src="/img/${name}-960.webp" srcset="${ws.map((w) => `/img/${name}-${w}.webp ${w}w`).join(", ")}" sizes="${sizes}" alt="" loading="lazy" />`;
};

let items = [];
function render(filter = "all") {
  mosaic.innerHTML = items
    .map((it, i) => {
      const hidden = filter !== "all" && it.type !== filter ? " is-hidden" : "";
      const type = t(typeKey[it.type] || "") || it.type;
      return `<article class="tile-w tile-w--${it.shape}${hidden}" data-i="${i}" style="animation-delay:${i * 50}ms">
        ${pic(it.poster, it.shape === "big" || it.shape === "wide" ? "(max-width:734px) 100vw, 50vw" : "(max-width:734px) 50vw, 33vw")}
        <span class="tile-w__badge">${type}</span>
        <div class="tile-w__cap">
          <div><div class="tile-w__t">${it.title}</div><div class="tile-w__m"><b>${it.did}</b> · ${it.city}</div></div>
          <span class="tile-w__play" aria-hidden="true"></span>
        </div>
      </article>`;
    })
    .join("");
}

fetch("/work.json")
  .then((r) => r.json())
  .then((data) => { items = data; render(); });

document.querySelectorAll(".chip").forEach((c) =>
  c.addEventListener("click", () => {
    document.querySelectorAll(".chip").forEach((x) => x.classList.toggle("is-on", x === c));
    render(c.dataset.filter);
  })
);

/* lightbox: play on the page */
function open(it) {
  const e = embedFor(it.url);
  media.classList.toggle("lightbox__media--ig", !!(!it.video && e && it.url && e.platform === "Instagram"));
  media.classList.toggle("lightbox__media--wide", it.ratio === "16:9");
  box.querySelector(".lightbox__card").classList.toggle("lightbox__card--wide", it.ratio === "16:9");
  media.innerHTML = it.video
    ? `<video src="${it.video}" poster="${it.poster.startsWith("/") ? it.poster : ""}" controls autoplay playsinline preload="metadata"></video>`
    : e && it.url
    ? `<iframe src="${e.src}" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen loading="lazy"></iframe>`
    : `${pic(it.poster, "420px")}<div class="soon">${t("work.soon")}</div>`;
  $("#lightbox-title").textContent = it.title;
  $("#lightbox-sub").textContent = `${t(typeKey[it.type] || "") || it.type} · ${it.city} · ${it.did}`;
  const link = $("#lightbox-link");
  link.textContent = t("work.open").replace("{platform}", e ? e.platform : "Instagram");
  link.href = it.url || "https://instagram.com/sonido_eclipse_";
  box.classList.add("is-open");
  box.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}
function close() {
  box.classList.remove("is-open");
  box.setAttribute("aria-hidden", "true");
  media.innerHTML = "";
  document.body.style.overflow = "";
}
mosaic.addEventListener("click", (e) => {
  const tile = e.target.closest(".tile-w");
  if (tile) open(items[+tile.dataset.i]);
});
box.querySelectorAll("[data-close]").forEach((el) => el.addEventListener("click", close));
window.addEventListener("keydown", (e) => e.key === "Escape" && close());
