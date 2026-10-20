import sharp from "sharp";
const EP = "/Users/sonidoeclipse/Documents/EclipseProductions_logo_kit/EP_logo_chrome_transparent_tight.png";
const OUT = process.argv[2] || ".tmp-logo/SE_tight_rebuilt.png";
const GAP = +(process.env.GAP || 7);        // even tracking between letters
const PILL_GAP = +(process.env.PILL_GAP || 12); // SONIDO baseline → pill top

const img = sharp(EP).ensureAlpha();
const { width: W, height: H } = await img.metadata();
const { data } = await img.raw().toBuffer({ resolveWithObject: true });
const A = (x, y) => data[(y * W + x) * 4 + 3];
const rowHas = (y) => { for (let x = 0; x < W; x++) if (A(x, y) > 40) return true; return false; };
let pillBottom = -1, prodTop = -1;
for (let y = Math.round(H * 0.5); y < H; y++) { if (!rowHas(y) && pillBottom < 0) pillBottom = y; if (pillBottom >= 0 && rowHas(y)) { prodTop = y; break; } }
let prodBottom = H - 1; while (prodBottom > prodTop && !rowHas(prodBottom)) prodBottom--;
const stripH = prodBottom - prodTop + 1;

// O and D come from the reliable single-letter segments (P R O D U); S, N, I from the ruler
const colMax = (x) => { let m = 0; for (let y = prodTop; y <= prodBottom; y++) m = Math.max(m, A(x, y)); return m; };
const segs = []; let inRun = false, st = 0;
for (let x = 0; x < W; x++) { const h = colMax(x) > 200; if (h && !inRun) { inRun = true; st = x; } if (!h && inRun) { inRun = false; segs.push([st, x - 1]); } }
console.log("singles:", segs.slice(0, 5).map((s) => s.join("-")).join(" "));
const L = { S: [1258, 1330], O: segs[2], N: [1180, 1252], I: [1071, 1095], D: segs[3] };
function inkBounds(a, b) { // opaque ink only (alpha>200), then +3px so the bevel edge comes along
  let x0 = b, x1 = a, y0 = prodBottom, y1 = prodTop;
  for (let x = a; x <= b; x++) for (let y = prodTop; y <= prodBottom; y++) if (A(x, y) > 200) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
  return { left: Math.max(a, x0 - 3), top: Math.max(0, y0 - 3), width: Math.min(b, x1 + 3) - Math.max(a, x0 - 3) + 1, height: Math.min(H - 1, y1 + 3) - Math.max(0, y0 - 3) + 1 };
}
const word = ["S", "O", "N", "I", "D", "O"];

// cut, trim to ink, measure mean luminance of opaque pixels
const glyphs = [];
for (const ch of word) {
  const [a, b] = L[ch];
  const r = inkBounds(a, b);
  const buf = await sharp(EP).extract(r).png().toBuffer();
  const { data: d, info } = await sharp(buf).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  let sum = 0, n = 0;
  for (let i = 0; i < d.length; i += 4) if (d[i + 3] > 200) { sum += 0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2]; n++; }
  glyphs.push({ ch, buf, w: info.width, h: info.height, mean: sum / n });
}
const target = glyphs.reduce((s, g) => s + g.mean, 0) / glyphs.length;
console.log("means before:", glyphs.map((g) => `${g.ch}:${g.mean.toFixed(0)}`).join(" "), "→ target", target.toFixed(0));
// even out the chrome: scale each glyph's brightness toward the word average
for (const g of glyphs) {
  const k = target / g.mean;
  g.buf = await sharp(g.buf).linear([k, k, k, 1], [0, 0, 0, 0]).png().toBuffer();
}

// layout: common baseline (bottom-aligned), even gap, left-aligned with the first E inside the pill
const midY = Math.round(pillBottom * 0.5);
let runs = [], on = false; for (let x = 0; x < W; x++) { const h = A(x, midY) > 40; if (h && !on) { on = true; runs.push([x, x]); } else if (h) runs[runs.length - 1][1] = x; else on = false; }
const innerLeft = runs[1] ? runs[1][0] : Math.round(H * 0.3);
const wordH = Math.max(...glyphs.map((g) => g.h));
let pillVisTop = 0; for (let y = 0; y < pillBottom; y++) { let m = 0; for (let x = 0; x < W; x++) m = Math.max(m, A(x, y)); if (m > 150) { pillVisTop = y; break; } }
const pillTop = wordH + PILL_GAP - pillVisTop; // so the visible gap is exactly PILL_GAP
const canvasH = pillTop + pillBottom + 1;
console.log({ pillVisTop, wordH, pillTop });
const layers = [{ input: await sharp(EP).extract({ left: 0, top: 0, width: W, height: pillBottom + 1 }).png().toBuffer(), left: 0, top: pillTop }];
let x = innerLeft;
for (const g of glyphs) { layers.push({ input: g.buf, left: x, top: wordH - g.h }); x += g.w + GAP; }
await sharp({ create: { width: W, height: canvasH, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } }).composite(layers).png().toFile(OUT);
console.log("wrote", OUT, W, canvasH, "word width", x - GAP - innerLeft);
