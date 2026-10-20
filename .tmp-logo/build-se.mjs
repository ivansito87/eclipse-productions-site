import sharp from "sharp";
const EP = "/Users/sonidoeclipse/Documents/EclipseProductions_logo_kit/EP_logo_chrome_transparent_tight.png";
const OUT = process.argv[2] || ".tmp-logo/SE_tight_rebuilt.png";

const img = sharp(EP).ensureAlpha();
const { width: W, height: H } = await img.metadata();
const { data } = await img.raw().toBuffer({ resolveWithObject: true });
const A = (x, y) => data[(y * W + x) * 4 + 3];

// 1) row profile → find the gap between the pill and the PRODUCTIONS strip
const rowHas = (y) => { for (let x = 0; x < W; x++) if (A(x, y) > 40) return true; return false; };
let pillBottom = -1, prodTop = -1;
for (let y = Math.round(H * 0.5); y < H; y++) { if (!rowHas(y) && pillBottom < 0) pillBottom = y; if (pillBottom >= 0 && rowHas(y)) { prodTop = y; break; } }
let prodBottom = H - 1; while (prodBottom > prodTop && !rowHas(prodBottom)) prodBottom--;
console.log({ W, H, pillBottom, prodTop, prodBottom });

// 2) column profile inside the strip → letter segments of PRODUCTIONS
const colMax = (x) => { let m = 0; for (let y = prodTop; y <= prodBottom; y++) m = Math.max(m, A(x, y)); return m; };
const TH = +(process.env.TH || 170);
const colHas = (x) => colMax(x) > TH;
const segs = []; let inRun = false, start = 0;
for (let x = 0; x < W; x++) { const h = colHas(x); if (h && !inRun) { inRun = true; start = x; } if (!h && inRun) { inRun = false; segs.push([start, x - 1]); } }
if (inRun) segs.push([start, W - 1]);
// merge tiny gaps (inside letters like O/D counters never split columns, but shadows can) 
const merged = []; for (const s of segs) { const last = merged[merged.length - 1]; if (last && s[0] - last[1] <= 0) last[1] = s[1]; else merged.push([...s]); }
console.log("letters found:", merged.length, merged.map(([a, b]) => b - a + 1).join(","));
// touching letters: split merged chunks at the valleys of the column alpha-sum
const colSum = (x) => { let t = 0; for (let y = prodTop; y <= prodBottom; y++) t += A(x, y); return t; };
function splitChunk([a, b], k) {
  if (k === 1) return [[a, b]];
  const sums = []; for (let x = a; x <= b; x++) sums.push([colSum(x), x]);
  const inner = sums.filter(([, x]) => x > a + 15 && x < b - 15).sort((p, q) => p[0] - q[0]);
  const cuts = []; for (const [, x] of inner) { if (cuts.every((c) => Math.abs(c - x) > 20)) cuts.push(x); if (cuts.length === k - 1) break; }
  cuts.sort((p, q) => p - q);
  const out = []; let lo = a; for (const c of cuts) { out.push([lo, c]); lo = c + 1; } out.push([lo, b]); return out;
}
// PRODUCTIONS: expect 5 singles (P R O D U) then CTIO + NS when tracking makes letters touch
let letters;
if (merged.length === 11) letters = merged;
else if (merged.length === 7) letters = [...merged.slice(0, 5), ...splitChunk(merged[5], 4), ...splitChunk(merged[6], 2)];
else throw new Error("unexpected segmentation: " + merged.length);
if (process.env.I_BOUNDS) { const [a, b] = process.env.I_BOUNDS.split(",").map(Number); letters[7] = [a, b]; } // the I sits between T and O; its edges come from the ruler
console.log("letter widths:", letters.map(([a, b]) => b - a + 1).join(","));
for (let i = 0; i < letters.length; i++) { if (i === 7 && process.env.I_BOUNDS) continue; const lo = i ? letters[i-1][1] + 1 : 0, hi = i < letters.length-1 ? letters[i+1][0] - 1 : W - 1; letters[i][0] = Math.max(lo, letters[i][0] - 2); letters[i][1] = Math.min(hi, letters[i][1] + 2); }
merged.length = 0; merged.push(...letters);
const gaps = merged.slice(1).map((s, i) => s[0] - merged[i][1] - 1);
const gs = gaps.slice(0, 4).sort((a, b) => a - b); const gap = gs[Math.floor(gs.length / 2)];
const letterIdx = { S: 10, O: 2, N: 9, I: 7, D: 3 }; // P R O D U C T I O N S
const word = ["S", "O", "N", "I", "D", "O"];
const stripH = prodBottom - prodTop + 1;

// 3) cut glyphs
const glyphs = [];
for (const ch of word) {
  const [a, b] = merged[letterIdx[ch]];
  glyphs.push({ buf: await sharp(EP).extract({ left: a, top: prodTop, width: b - a + 1, height: stripH }).png().toBuffer(), w: b - a + 1 });
}
const wordW = glyphs.reduce((s, g) => s + g.w, 0) + gap * (word.length - 1);

// 4) where does the lettering start inside the pill? (second alpha run along the pill's centre row)
const midY = Math.round(pillBottom * 0.5);
let runs = [], on = false; for (let x = 0; x < W; x++) { const h = A(x, midY) > 40; if (h && !on) { on = true; runs.push([x, x]); } else if (h) runs[runs.length - 1][1] = x; else on = false; }
const innerLeft = runs[1] ? runs[1][0] : Math.round(H * 0.3);
console.log({ gap, wordW, innerLeft, stripH });

// 5) compose: SONIDO above the pill, left-aligned with the E, same gap as pill→PRODUCTIONS
const topGap = prodTop - pillBottom;
const canvasH = stripH + topGap + pillBottom + 1;
const layers = [{ input: await sharp(EP).extract({ left: 0, top: 0, width: W, height: pillBottom + 1 }).png().toBuffer(), left: 0, top: stripH + topGap }];
let x = innerLeft;
for (const g of glyphs) { layers.push({ input: g.buf, left: x, top: 0 }); x += g.w + gap; }
await sharp({ create: { width: W, height: canvasH, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } }).composite(layers).png().toFile(OUT);
console.log("wrote", OUT, W, canvasH);
