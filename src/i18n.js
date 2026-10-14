/* Bilingual layer + sister-brand switch.
   English lives in the HTML. Spanish lives here, keyed by data-i18n.
   Default language and brand come from the hostname:
     sonidoeclipsellc.com  → Spanish, Sonido Eclipse badge
     eclipseproductionsllc.com → English, Eclipse Productions badge
   ?lang=es|en and the nav toggle override it; the choice is remembered. */

export const ES = {
  // nav
  "nav.book": "Reservar",
  s144: "Novedades", s145: "Servicios", s146: "Media", s147: "Paquetes", s148: "Eventos", s149: "Reseñas", s150: "Contacto",
  s151: "Novedades", s152: "Servicios", s153: "Media", s154: "Paquetes", s155: "Eventos", s156: "Reseñas", s157: "Contacto",
  // hero
  s1: "La noche, producida.",
  s42: 'DJ. Sonido. Luces. Efectos. Media.<br class="br-m" /> Un solo equipo para toda la noche.',
  "hero.cta": "Reserva tu fecha",
  "hero.link": "Mira cómo lo hacemos",
  "hero.scroll": "Desliza",
  // intro
  s2: "<span>{brand}.</span> La mejor manera de reservar la noche que te imaginas.",
  "specialist": "<strong>¿Necesitas ayuda para elegir paquete?</strong><br />Habla con un especialista. <span class=\"red\">(770) 688-7959 ↗</span>",
  s10: '<span class="muted">Lo nuevo.</span> Mira lo que estamos ofreciendo ahora.',
  s111: "Nuevo", s112: "Efectos especiales", s113: "Escenario y producción", s114: "Cabinas", s115: "Momento especial", s116: "Entretenimiento",
  s15: "Eclipse Media", s16: "Fuentes de chispa fría", s17: "Pista de baile LED", s18: "Cabina de video 360", s19: "Bailando en las nubes", s20: "Hora Loca",
  s43: "Alfombra roja, foto, video y reels el mismo día.",
  s44: "Segura en interiores. Increíble en fotos.",
  s45: "Pista infinita. Blanca, negra o a tu gusto.",
  s46: "El clip que todos suben esa noche.",
  s47: "Un primer baile que flota.",
  s48: "Robot LED, botargas, artistas.",
  // chapters
  s3: "Desliza para producir<br />la noche.",
  s49: "Cada pieza del show, con un solo equipo. Sonido que llena el salón, luces que se mueven con la música y los momentos por los que todos sacan el celular.",
  s117: "Sonido", s118: "Iluminación", s119: "Efectos especiales", s120: "Momentos especiales",
  s11: "Nivel concierto. Afinado al salón.",
  rail1: "Sonido", rail2: "Iluminación", rail3: "Efectos", rail4: "Momentos",
  s50: "Sistemas amplificados para salones íntimos. Line array premium para más de 200 invitados. Subwoofers que se sienten en el pecho y micrófonos inalámbricos para cada brindis.",
  s12: "Cada haz. Una sola señal.",
  s51: "Cabezas móviles LED, haces robóticos, uplighting perimetral y láser, programados a la música y a tu itinerario.",
  s13: "Sigue deslizando. Enciéndelo.",
  s52: "Fuentes de chispa fría seguras en interiores, chorros de CO2, cañones de confeti y humo que hace visible cada haz de luz.",
  s14: "Bailando en las nubes.",
  s53: "Nube baja para el primer baile, el vals, el baile con papá. Agrega un spot y un final de chispas y el salón se queda en silencio.",
  // bento
  s4: 'Todo incluido en el paquete.<br /><span class="muted">Nada que rentar aparte.</span>',
  s21: "Equipo que impresiona.",
  s54: "Line array, cabezas móviles, humo, chispas, micrófonos, cables. Nuestro, con mantenimiento y respaldo en sitio.",
  s22: "DJ y MC bilingües.",
  s55: "Reggaetón, banda, hip-hop, house y las lentas que pidieron tus tías.",
  s23: "Horas base por paquete.",
  s56: "Montaje y desmontaje incluidos. Horas extra disponibles la misma noche.",
  s24: "Mix de entrada personalizado.",
  s57: "Tu gran entrada, editada al segundo. El primer mix va incluido.",
  s25: "Técnico en sitio toda la noche.",
  s58: "Ingeniero de sonido e iluminación en el evento. Equipo de respaldo en el camión.",
  s26: "Pantallas, cabinas y pistas.",
  s59: "Pantalla LED gigante, cabina 360, cabina espejo, pista de baile LED, muro social.",
  // media
  s121: "Nuevo · Eclipse Media",
  s5: "La noche,<br />capturada.",
  s60: "Fotografía de alfombra roja y step-and-repeat, foto y video del evento, reels para redes el mismo día y contenido para marcas. Hecho por el equipo que ya está en el salón.",
  "media.cta": "Pregunta por media",
  s27: "Alfombra roja", s28: "Foto y video", s29: "Reels el mismo día",
  // types
  s6: '<span class="muted">Hecho para cada tipo de noche.</span> Elige la tuya.',
  s30: "Bodas", s31: "Quinceañeras", s32: "Sweet 16", s33: "Corporativos", s34: "Fiestas privadas",
  s61: "De la ceremonia al último baile.", s62: "Vals, baile sorpresa, hora loca.", s63: "Pista LED, cabina 360, neón.",
  s64: "Galas, lanzamientos, posadas.", s65: "Cumpleaños, aniversarios, Año Nuevo.",
  // packages
  s7: "¿Qué paquete es para ti?",
  s66: "Cuatro niveles, cada uno construido sobre el anterior. O totalmente a tu medida. Sin precios en línea: dinos la fecha y el salón y te cotizamos.",
  s122: "Lo esencial", s123: "Los momentos especiales", s124: "El show completo", s125: "Recomendado", s126: "Sin límites",
  "pkg.quote": "Pide tu cotización",
  s71: "DJ profesional", s72: "Mixes personalizados", s73: "Sonido premium", s74: "Micrófonos inalámbricos", s75: "Iluminación de pista", s76: "Cabezas móviles", s77: "Servicio de 7 horas",
  s78: "Todo lo de Bronze", s79: "Sonido line array premium", s80: "Maestro de ceremonia", s81: "Fuentes de chispa fría", s82: "Bailando en las nubes", s83: "Iluminación nivel producción + humo", s84: "Reunión de itinerario y planeación", s85: "Servicio de 8 horas",
  s86: "Todo lo de Silver", s87: "2 pantallas verticales", s88: "Creación de slideshow personalizado", s89: "Kit de hora loca", s90: "Robot LED o personaje a elegir", s91: "Servicio de 8 horas",
  s92: "Todo lo de Gold", s93: "Pantalla LED gigante, configurable", s94: "Pista de baile LED a elegir", s95: "Contenido personalizado para pantallas", s96: "+1 personaje especial", s97: "Servicio de 8 horas",
  // reviews
  s8: '<span class="muted">Las familias nos aman.</span> 5.0 en Google.',
  s67: "La pista estuvo llena toda la noche. Las fuentes de chispas en nuestro primer baile fueron increíbles.",
  s68: "La mejor decisión para la quinceañera de mi hija. La hora loca puso a todos de pie.",
  s69: "Profesionales desde la primera llamada hasta la última canción. Sonido e iluminación impecables.",
  s70: "Manejaron la gala de nuestra empresa como un concierto. Sonido limpio, cero estrés y las fotos listas a la mañana siguiente.",
  // events
  s9: "Dónde estaremos.",
  s127: "Quinceañera de Valeria", s130: "Reyes y Sofía — Boda", s133: "Sweet 16 — Residencia privada", s136: "Gala corporativa de fin de año", s139: "Año Nuevo — Privado",
  s129: "Reservado", s132: "Reservado", s135: "Reservado", s138: "Reservado", s141: "Pocas fechas",
  s137: "Centro de Atlanta", s142: "Tu fecha", s143: "Donde nos necesites",
  "events.check": "Consulta disponibilidad",
  // contact + form
  "contact.title": "Planeemos<br />tu noche.",
  "contact.lede": "Cuéntanos la fecha, el salón y lo que te imaginas. Respondemos en menos de 24 horas con disponibilidad y cotización.",
  "contact.call": "Llama o manda texto", "contact.email": "Correo", "contact.based": "Ubicados en", "contact.travel": "Viajamos a tu evento", "contact.follow": "Síguenos",
  "form.name": "Nombre", "form.phone": "Teléfono", "form.email": "Correo", "form.date": "Fecha del evento", "form.type": "Tipo de evento",
  "form.t1": "Boda", "form.t2": "Quinceañera", "form.t3": "Sweet 16", "form.t4": "Corporativo", "form.t5": "Fiesta privada", "form.t6": "Otro",
  "form.interest": "Me interesa", "form.i0": "Aún no sé", "form.i6": "Producción a medida",
  "form.msg": "Cuéntanos de la noche", "form.msgph": "Salón, número de invitados, los momentos que importan.",
  "form.send": "Enviar solicitud", "form.sending": "Enviando…", "form.activate": "El formulario aún no está activado. Llámanos o mándanos texto al (770) 688-7959.", "form.ok": "¡Listo! Te respondemos en menos de 24 horas.", "form.err": "No se pudo enviar. Llámanos o mándanos texto al (770) 688-7959.",
  // footer
  s39: "Servicios", s40: "Eventos", s41: "Empresa",
  "foot.sound": "Sonido", "foot.light": "Iluminación", "foot.fx": "Efectos especiales", "foot.moments": "Momentos especiales",
  "foot.wed": "Bodas", "foot.xv": "Quinceañeras", "foot.corp": "Corporativos", "foot.contact": "Contacto", "foot.reviews": "Reseñas",
  "foot.legal": "Copyright © {year} {legal}. Todos los derechos reservados.",
};

export const EN_EXTRA = {
  "form.sending": "Sending…",
  "form.activate": "The form isn't activated yet. Call or text us at (770) 688-7959.",
  "form.ok": "Got it. We'll reply within 24 hours.",
  "form.err": "Couldn't send. Call or text us at (770) 688-7959.",
  "foot.legal": "Copyright © {year} {legal}. All rights reserved.",
};

export const BRANDS = {
  eclipse: {
    name: "Eclipse Productions",
    legal: "Eclipse Productions LLC",
    email: "bookings@eclipseproductionsllc.com",
    formTo: "ivansito87@gmail.com", // inbox that actually receives mail (the domains have no MX records yet)
    domain: "eclipseproductionsllc.com",
    logo: "/brand/EP_logo_chrome_transparent_tight.png",
    mark: "/brand/EP_watermark_360w.png",
    og: "/og.jpg",
    sister: { name: "Sonido Eclipse", url: "https://sonidoeclipsellc.com" },
    lang: "en",
  },
  sonido: {
    name: "Sonido Eclipse",
    legal: "Sonido Eclipse LLC",
    email: "bookings@sonidoeclipsellc.com",
    formTo: "ivansito87@gmail.com",
    domain: "sonidoeclipsellc.com",
    logo: "/brand/SE_logo_chrome_transparent_tight.png",
    mark: "/brand/SE_watermark_360w.png",
    og: "/og-sonido.jpg",
    sister: { name: "Eclipse Productions", url: "https://eclipseproductionsllc.com" },
    lang: "es",
  },
};

const params = new URLSearchParams(location.search);
export const brandId =
  params.get("brand") === "sonido" || /sonidoeclipse/i.test(location.hostname) ? "sonido" : "eclipse";
export const brand = BRANDS[brandId];

let lang = "en";
const en = new Map(); // key → original English innerHTML, captured from the DOM once

function fill(str) {
  return str.replace("{brand}", brand.name).replace("{legal}", brand.legal).replace("{year}", String(new Date().getFullYear()));
}

export function t(key) {
  const dict = lang === "es" ? ES : EN_EXTRA;
  const v = dict[key] ?? EN_EXTRA[key] ?? en.get(key) ?? key;
  return fill(v);
}

export function applyLang(next, { remember = true } = {}) {
  lang = next === "es" ? "es" : "en";
  document.documentElement.lang = lang;
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.dataset.i18n;
    if (!en.has(key)) en.set(key, el.innerHTML);
    const v = lang === "es" ? ES[key] : (EN_EXTRA[key] ?? en.get(key));
    if (v != null) el.innerHTML = fill(v);
  });
  document.querySelectorAll("[data-i18n-ph]").forEach((el) => {
    const key = el.dataset.i18nPh;
    if (!en.has(key)) en.set(key, el.placeholder);
    el.placeholder = lang === "es" ? (ES[key] ?? en.get(key)) : en.get(key);
  });
  document.querySelectorAll("[data-lang-toggle]").forEach((b) => {
    b.textContent = lang === "es" ? "EN" : "ES";
    b.setAttribute("aria-label", lang === "es" ? "Switch to English" : "Cambiar a español");
  });
  if (remember) try { localStorage.setItem("lang", lang); } catch {}
}

export function applyBrand() {
  document.documentElement.dataset.brand = brandId;
  document.querySelectorAll("[data-brand-logo]").forEach((img) => { img.src = brand.logo; img.alt = brand.name; });
  document.querySelectorAll("[data-brand-mark]").forEach((img) => { img.src = brand.mark; img.alt = brand.name; });
  document.querySelectorAll("[data-brand-name]").forEach((el) => (el.textContent = brand.name));
  document.querySelectorAll("[data-brand-email]").forEach((a) => { a.textContent = brand.email; a.href = `mailto:${brand.email}`; });
  document.querySelectorAll("[data-brand-sister]").forEach((a) => { a.textContent = `${brand.sister.name} ↗`; a.href = brand.sister.url; });
  const form = document.querySelector("#contact-form");
  if (form) {
    form.action = `https://formsubmit.co/ajax/${brand.formTo || brand.email}`;
    const subj = form.querySelector("[data-form-subject]");
    if (subj) subj.value = `New booking request from ${brand.domain}`;
  }
  document.title = `${brand.name} — ${lang === "es" ? "La noche, producida." : "The night, produced."}`;
  const og = document.querySelector('meta[property="og:image"]');
  if (og) og.content = `https://${brand.domain}${brand.og}`;
  const ogt = document.querySelector('meta[property="og:title"]');
  if (ogt) ogt.content = document.title;
  const canon = document.querySelector('link[rel="canonical"]');
  if (canon) canon.href = `https://${brand.domain}/`;
}

export function initI18n() {
  let initial = params.get("lang");
  if (!initial) try { initial = localStorage.getItem("lang"); } catch {}
  if (!initial) initial = brand.lang;
  applyLang(initial, { remember: !!params.get("lang") });
  applyBrand();
  document.querySelectorAll("[data-lang-toggle]").forEach((b) =>
    b.addEventListener("click", () => { applyLang(lang === "es" ? "en" : "es"); applyBrand(); })
  );
}
