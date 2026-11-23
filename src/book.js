/* /book — quote wizard. Four screens, a progress bar, posts to the same FormSubmit inbox
   as the home-page form with the traffic source attached.
   Links: /book            → detects Instagram / TikTok / Facebook in-app browsers by itself
          /book?ref=kuromi → tags the lead with a campaign name (one link per reel)
          /book?type=quince → preselects the event type and starts on step 2
            (wedding | quince | sweet16 | corporate | private | other) */
import { initI18n, t, ES, EN_EXTRA, brand } from "./i18n.js";

Object.assign(ES, {
  "book.q1": "¿Qué vamos a producir?", "book.q1s": "Elige una. Puedes cambiarla después.",
  "book.q2": "¿Cuándo y dónde?", "book.q2s": "Una idea aproximada basta. Confirmamos los detalles contigo.",
  "book.city": "Ciudad o salón", "book.cityph": "Atlanta, Duluth, Marietta…", "book.guests": "Invitados", "book.g1": "Menos de 100",
  "book.q3": "¿Qué quieres en la pista?", "book.q3s": "Toca todo lo que te emocione. DJ, sonido e iluminación siempre van incluidos.",
  "book.x1": "Pantallas LED", "book.x2": "Foto y video", "book.x3": "No sé, sorpréndeme", "book.pkg": "¿Tienes un paquete en mente?",
  "book.q4": "¿Cómo te contactamos?", "book.q4s": "Respondemos en menos de 24 horas con disponibilidad y cotización. Cero spam.",
  "book.pref": "Mejor forma de contactarte", "book.p1": "Texto", "book.p2": "Llamada", "book.opt": "opcional",
  "book.notes": "¿Algo más?", "book.notesph": "Los momentos que importan, canciones, el ambiente.",
  "book.thanks": "¡Listo!", "book.thankss": "Estamos revisando la fecha y te contactamos en menos de 24 horas. ¿Tienes prisa? Escríbenos ahora:",
  "book.textnow": "Mándanos un texto", "book.callnow": "Llama al (770) 688-7959", "book.seework": "Mira nuestro trabajo mientras esperas",
  "book.back": "Atrás", "book.next": "Siguiente", "book.skip": "Omitir", "book.send": "Pedir cotización", "book.home": "Sitio completo",
  "book.stepOf": "Paso {n} de {total}", "book.done": "Enviado", "book.pick": "Elige un tipo de evento para continuar.",
  "book.thanksName": "¡Listo, {name}!", "book.title": "Pide tu cotización",
});
Object.assign(EN_EXTRA, {
  "book.stepOf": "Step {n} of {total}", "book.done": "Sent", "book.pick": "Pick an event type to continue.",
  "book.thanksName": "Got it, {name}.", "book.title": "Get a quote", "book.send": "Get my quote", "book.next": "Next", "book.skip": "Skip",
});

initI18n();

const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const params = new URLSearchParams(location.search);
const form = $("#contact-form");
const panels = $$(".bk-panel", form);
const STEPS = 4;
const bar = $("#bk-bar"), stepEl = $("#bk-step"), back = $("#bk-back"), next = $("#bk-next"), nextLabel = $("span", next), status = $("#bk-status"), actions = $("#bk-actions");
const DRAFT = "book.draft";
let step = 1;

/* ── page identity (applyBrand assumes the home page; correct it) ── */
function setTitles() {
  document.title = `${t("book.title")} — ${brand.name}`;
  const canon = $('link[rel="canonical"]'); if (canon) canon.href = `https://${brand.domain}/book/`;
  const ogt = $('meta[property="og:title"]'); if (ogt) ogt.content = document.title;
  $("#bk-lang").value = document.documentElement.lang;
}

/* ── where did this lead come from? ── */
function detectSource() {
  const ua = navigator.userAgent, ref = document.referrer;
  if (/Instagram/i.test(ua) || /instagram\.com/i.test(ref)) return "instagram";
  if (/musical_ly|Bytedance|TikTok/i.test(ua) || /tiktok\.com/i.test(ref)) return "tiktok";
  if (/FBAN|FBAV|FB_IAB/i.test(ua) || /facebook\.com|fb\.com|l\.facebook/i.test(ref)) return "facebook";
  if (/youtube\.com|youtu\.be/i.test(ref)) return "youtube";
  if (/google\./i.test(ref)) return "google";
  if (ref) try { return new URL(ref).hostname.replace(/^www\./, ""); } catch {}
  return "direct";
}
$("#bk-source").value = params.get("src") || detectSource();
$("#bk-ref").value = params.get("ref") || "";
$("#bk-page").value = location.href.split("#")[0];

/* ── draft: survive Instagram backgrounding the page ── */
const fieldNames = ["event_type", "event_date", "city", "guests", "interest", "name", "phone", "contact_pref", "email", "message"];
function saveDraft() {
  const d = { step, ts: Date.now() };
  fieldNames.forEach((n) => { const v = new FormData(form).get(n); if (v) d[n] = v; });
  d.extras = $$("[data-extra]:checked", form).map((i) => i.value);
  try { localStorage.setItem(DRAFT, JSON.stringify(d)); } catch {}
}
function loadDraft() {
  let d; try { d = JSON.parse(localStorage.getItem(DRAFT) || "null"); } catch {}
  if (!d || (d.ts && Date.now() - d.ts > 2 * 86400e3)) return; // a two-day-old draft is stale
  fieldNames.forEach((n) => {
    if (d[n] == null) return;
    const els = $$(`[name="${n}"]`, form);
    if (!els.length) return;
    if (els[0].type === "radio") { const r = els.find((e) => e.value === d[n]); if (r) r.checked = true; }
    else els[0].value = d[n];
  });
  (d.extras || []).forEach((v) => { const c = $$("[data-extra]", form).find((i) => i.value === v); if (c) c.checked = true; });
  if (d.step >= 1 && d.step <= STEPS) step = d.step;
}
loadDraft();

/* ── deep link: ?type=quince preselects and skips the first screen ── */
const TYPE_MAP = { wedding: "Wedding", boda: "Wedding", quince: "Quinceañera", quinceanera: "Quinceañera", xv: "Quinceañera", sweet16: "Sweet 16", corporate: "Corporate", corporativo: "Corporate", private: "Private party", party: "Private party", other: "Other" };
const pre = TYPE_MAP[(params.get("type") || "").toLowerCase()];
if (pre) { const r = $$('[name="event_type"]', form).find((e) => e.value === pre); if (r) { r.checked = true; step = Math.max(step, 2); } }

/* ── navigation ── */
function show(n, dir = 1) {
  const key = n > STEPS ? "done" : String(n);
  panels.forEach((p) => {
    const on = p.dataset.step === key;
    p.classList.toggle("is-active", on);
    p.classList.toggle("is-back", on && dir < 0);
  });
  const done = n > STEPS;
  bar.style.width = `${(Math.min(n, STEPS) / STEPS) * 100}%`;
  stepEl.textContent = done ? t("book.done") : t("book.stepOf").replace("{n}", n).replace("{total}", STEPS);
  back.hidden = n <= 1 || done;
  actions.classList.toggle("is-hidden", done);
  const optional = n === 2 || n === 3;
  nextLabel.textContent = n === STEPS ? t("book.send") : optional && !answered(n) ? t("book.skip") : t("book.next");
  status.textContent = ""; status.className = "form__status bk-status";
  window.scrollTo({ top: 0, behavior: "smooth" });
  if (!done) { const first = $("input:not([type=hidden]):not([type=radio]):not([type=checkbox])", panels.find((p) => p.dataset.step === key)); if (first && n !== 1 && matchMedia("(min-width: 735px)").matches) first.focus({ preventScroll: true }); }
}
function answered(n) {
  const p = panels.find((x) => x.dataset.step === String(n));
  return $$("input, textarea", p).some((el) => (el.type === "radio" || el.type === "checkbox" ? el.checked && !el.defaultChecked : el.value.trim()));
}
function validate(n) {
  const p = panels.find((x) => x.dataset.step === String(n));
  if (n === 1 && !$('[name="event_type"]:checked', form)) { status.classList.add("is-err"); status.textContent = t("book.pick"); return false; }
  for (const el of $$("input, textarea", p)) if (!el.checkValidity()) { el.reportValidity(); return false; }
  return true;
}
function go(n, dir) { step = n; saveDraft(); show(step, dir); }

back.addEventListener("click", () => go(Math.max(1, step - 1), -1));
next.addEventListener("click", () => {
  if (!validate(step)) return;
  if (step === STEPS) submit(); else go(step + 1, 1);
});
form.addEventListener("submit", (e) => { e.preventDefault(); if (validate(step)) { if (step === STEPS) submit(); else go(step + 1, 1); } });
form.addEventListener("keydown", (e) => { if (e.key === "Enter" && e.target.tagName !== "TEXTAREA") { e.preventDefault(); next.click(); } });
form.addEventListener("change", (e) => {
  saveDraft();
  if (step === 2 || step === 3) nextLabel.textContent = answered(step) ? t("book.next") : t("book.skip");
  if (e.target.name === "event_type" && step === 1) setTimeout(() => go(2, 1), 260); // tile tap advances by itself
});
form.addEventListener("input", saveDraft);

/* ── submit: same FormSubmit inbox as the home-page form, richer subject ── */
async function submit() {
  next.disabled = true;
  status.className = "form__status bk-status"; status.textContent = t("form.sending");
  const fd = new FormData(form);
  fd.set("extras", $$("[data-extra]:checked", form).map((i) => i.value).join(", ") || "—");
  const src = fd.get("source"), ref = fd.get("ref");
  fd.set("_subject", `New quote via ${src}${ref ? ` (${ref})` : ""}: ${fd.get("event_type")} · ${fd.get("name")} — ${brand.domain}`);
  if (fd.get("email")) fd.set("_replyto", fd.get("email")); else fd.delete("_replyto");
  if (!ref) fd.delete("ref");
  try {
    const res = await fetch(form.action, { method: "POST", headers: { Accept: "application/json" }, body: fd });
    const data = await res.json().catch(() => ({}));
    if (/activat/i.test(data.message || "")) throw new Error("activation");
    if (!res.ok || data.success === "false" || data.success === false) throw new Error(data.message || res.statusText);
    const name = (fd.get("name") || "").trim().split(/\s+/)[0];
    $("#bk-thanks").textContent = name ? t("book.thanksName").replace("{name}", name) : t("book.thanks");
    try { localStorage.removeItem(DRAFT); } catch {}
    step = STEPS + 1; show(step, 1);
  } catch (err) {
    status.classList.add("is-err");
    status.textContent = err.message === "activation" ? t("form.activate") : t("form.err");
  } finally { next.disabled = false; }
}

/* ── language toggle re-renders the dynamic bits ── */
$$("[data-lang-toggle]").forEach((b) => b.addEventListener("click", () => { setTitles(); show(step, 1); }));

setTitles();
show(step, 1);
