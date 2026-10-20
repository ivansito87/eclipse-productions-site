/**
 * Build a logo kit from a Gemini badge render.
 *   node scripts/build-finish-kit.mjs <render.png> <outDir> <EP|SE> <finish> <lum|dist> [bgHex]
 * lum  = badge is brighter than its background (silver, gold, gunmetal on black): luminance matte
 * dist = badge is darker than its background (piano black on charcoal): colour-distance matte
 * matte = borrow the alpha from a brighter render of the same badge (7th arg), e.g. the gold one; use for black/gunmetal
 */
import sharp from "sharp";
import { mkdirSync, copyFileSync, writeFileSync } from "node:fs";
const [,, src, out, prefix, finish, mode = "lum", cardBg = "#000000", ref] = process.argv;
mkdirSync(out, { recursive: true });
const { data, info } = await sharp(src).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const W = info.width, H = info.height;
const px = (x, y) => { const i = (y * W + x) * 4; return [data[i], data[i + 1], data[i + 2]]; };
const med = (arr) => arr.sort((a, b) => a - b)[Math.floor(arr.length / 2)];
const corners = [px(2, 2), px(W - 3, 2), px(2, H - 3), px(W - 3, H - 3)];
const bg = [0, 1, 2].map((c) => med(corners.map((p) => p[c])));
const dist = (p) => Math.abs(p[0] - bg[0]) + Math.abs(p[1] - bg[1]) + Math.abs(p[2] - bg[2]);
const lum = (p) => 0.2126 * p[0] + 0.7152 * p[1] + 0.0722 * p[2];
const TOL = mode === "lum" ? 75 : 32; // dist: stay below the black body (~48+) so it is never keyed
const mask = new Uint8Array(W * H);
const grow = (seeds) => { const q = seeds.slice(); while (q.length) { const i = q.pop(); const x = i % W, y = (i - x) / W; for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const nx = x + dx, ny = y + dy; if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue; const k = ny * W + nx; if (!mask[k] && dist(px(nx, ny)) <= TOL) { mask[k] = 1; q.push(k); } } } };
const seeds = []; for (let x = 0; x < W; x++) for (const y of [0, H - 1]) { const i = y * W + x; if (!mask[i] && dist(px(x, y)) <= TOL) { mask[i] = 1; seeds.push(i); } } for (let y = 0; y < H; y++) for (const x of [0, W - 1]) { const i = y * W + x; if (!mask[i] && dist(px(x, y)) <= TOL) { mask[i] = 1; seeds.push(i); } }
grow(seeds);
const inner = []; for (let y = 1; y < H - 1; y++) for (let x = 1; x < W - 1; x++) { const i = y * W + x; if (!mask[i] && dist(px(x, y)) <= 10) { mask[i] = 1; inner.push(i); } } grow(inner);
async function lumAlpha(file) {
  const { data: d, info: inf } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const w = inf.width, h = inf.height; const p2 = (x, y) => { const i = (y * w + x) * 4; return [d[i], d[i + 1], d[i + 2]]; };
  const c2 = [p2(2, 2), p2(w - 3, 2), p2(2, h - 3), p2(w - 3, h - 3)]; const bg2 = [0, 1, 2].map((c) => med(c2.map((p) => p[c])));
  const dist2 = (p) => Math.abs(p[0] - bg2[0]) + Math.abs(p[1] - bg2[1]) + Math.abs(p[2] - bg2[2]);
  const m = new Uint8Array(w * h); const g = (seeds) => { const q = seeds.slice(); while (q.length) { const i = q.pop(); const x = i % w, y = (i - x) / w; for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const nx = x + dx, ny = y + dy; if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue; const k = ny * w + nx; if (!m[k] && dist2(p2(nx, ny)) <= 75) { m[k] = 1; q.push(k); } } } };
  const sd = []; for (let x = 0; x < w; x++) for (const y of [0, h - 1]) { const i = y * w + x; if (!m[i] && dist2(p2(x, y)) <= 75) { m[i] = 1; sd.push(i); } } for (let y = 0; y < h; y++) for (const x of [0, w - 1]) { const i = y * w + x; if (!m[i] && dist2(p2(x, y)) <= 75) { m[i] = 1; sd.push(i); } } g(sd);
  const inn = []; for (let y = 1; y < h - 1; y++) for (let x = 1; x < w - 1; x++) { const i = y * w + x; if (!m[i] && dist2(p2(x, y)) <= 10) { m[i] = 1; inn.push(i); } } g(inn);
  const al = new Uint8Array(w * h); for (let i = 0; i < w * h; i++) { const p = p2(i % w, (i - (i % w)) / w); al[i] = !m[i] ? 255 : Math.round(255 * Math.min(1, Math.max(0, (lum(p) - 24) / 60))); }
  return { al, w, h };
}
let refAlpha = mode === "matte" || mode === "matte-fit" ? await lumAlpha(ref) : null;
if (refAlpha && (refAlpha.w !== W || refAlpha.h !== H)) throw new Error("reference render must have the same dimensions as the source");
if (mode === "matte-fit") {
  // the badge may be framed at a different scale/offset than the reference: find s, tx, ty maximising overlap
  const M = new Uint8Array(W * H); for (let i = 0; i < W * H; i++) M[i] = dist(px(i % W, (i - (i % W)) / W)) > 24 ? 1 : 0;
  const A = refAlpha.al; const pts = []; for (let i = 0; i < W * H; i += 1) if (A[i] > 128) pts.push(i);
  const bb = (arr, test) => { let x0 = W, x1 = 0, y0 = H, y1 = 0; for (let i = 0; i < W * H; i++) if (test(arr[i])) { const x = i % W, y = (i - x) / W; if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; } return { cx: (x0 + x1) / 2, cy: (y0 + y1) / 2, w: x1 - x0, h: y1 - y0 }; };
  const br = bb(A, (v) => v > 128), bm = bb(M, (v) => v === 1);
  const nM = M.reduce((a, b) => a + b, 0);
  const score = (sc, tx, ty, step) => { let inter = 0, n = 0; for (let k = 0; k < pts.length; k += step) { const i = pts[k]; const x = i % W, y = (i - x) / W; const X = Math.round(sc * (x - br.cx) + bm.cx + tx), Y = Math.round(sc * (y - br.cy) + bm.cy + ty); n++; if (X >= 0 && Y >= 0 && X < W && Y < H && M[Y * W + X]) inter++; } const nA = n * sc * sc; return inter / (nA + nM / step - inter); };
  let best = { v: -1 };
  for (let sc = 0.95; sc <= 1.30; sc += 0.01) for (let tx = -40; tx <= 40; tx += 4) for (let ty = -40; ty <= 40; ty += 4) { const v = score(sc, tx, ty, 7); if (v > best.v) best = { v, sc, tx, ty }; }
  for (let sc = best.sc - 0.012; sc <= best.sc + 0.012; sc += 0.002) for (let tx = best.tx - 5; tx <= best.tx + 5; tx++) for (let ty = best.ty - 5; ty <= best.ty + 5; ty++) { const v = score(sc, tx, ty, 2); if (v > best.v) best = { v, sc, tx, ty }; }
  console.log("fit", { scale: +best.sc.toFixed(3), tx: best.tx, ty: best.ty, iou: +best.v.toFixed(3) });
  // resample the reference alpha with that transform (bilinear, inverse mapping)
  const al = new Uint8Array(W * H);
  for (let Y = 0; Y < H; Y++) for (let X = 0; X < W; X++) {
    const x = (X - bm.cx - best.tx) / best.sc + br.cx, y = (Y - bm.cy - best.ty) / best.sc + br.cy;
    const x0 = Math.floor(x), y0 = Math.floor(y); if (x0 < 0 || y0 < 0 || x0 >= W - 1 || y0 >= H - 1) continue;
    const fx = x - x0, fy = y - y0; const v = (1 - fx) * (1 - fy) * A[y0 * W + x0] + fx * (1 - fy) * A[y0 * W + x0 + 1] + (1 - fx) * fy * A[(y0 + 1) * W + x0] + fx * fy * A[(y0 + 1) * W + x0 + 1];
    al[Y * W + X] = Math.round(v); }
  refAlpha = { al, w: W, h: H };
}
const o4 = Buffer.alloc(W * H * 4);
for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const i = y * W + x, o = i * 4; const p = px(x, y);
  let a;
  if (mode === "matte" || mode === "matte-fit") { a = refAlpha.al[i] / 255; if (a > 0 && a < 1) { o4[o] = p[0]; o4[o + 1] = p[1]; o4[o + 2] = p[2]; o4[o + 3] = Math.round(255 * a); continue; } }
  else if (mode === "lum") { if (!mask[i]) a = 1; else a = Math.min(1, Math.max(0, (lum(p) - 24) / 60)); }
  else { // dist: keyed region → transparent; a 2px band next to it gets a soft, unmixed edge
    if (mask[i]) a = 0;
    else { let nearKey = false; for (let dy = -2; dy <= 2 && !nearKey; dy++) for (let dx = -2; dx <= 2; dx++) { const nx = x + dx, ny = y + dy; if (nx >= 0 && ny >= 0 && nx < W && ny < H && mask[ny * W + nx]) { nearKey = true; break; } }
      a = nearKey ? Math.min(1, Math.max(0, (dist(p) - 18) / 20)) : 1; } }
  if (a >= 1) { o4[o] = p[0]; o4[o + 1] = p[1]; o4[o + 2] = p[2]; o4[o + 3] = 255; continue; }
  for (let c = 0; c < 3; c++) o4[o + c] = a > 0 ? Math.max(0, Math.min(255, Math.round((p[c] - (1 - a) * bg[c]) / a))) : 0;
  o4[o + 3] = Math.round(255 * a); }
for (let y = 1; y < H - 1; y++) for (let x = 1; x < W - 1; x++) { const o = (y * W + x) * 4; if (o4[o + 3] > 40) continue;
  const L = o4[(y * W + x - 1) * 4 + 3] > 200, R = o4[(y * W + x + 1) * 4 + 3] > 200, U = o4[((y - 1) * W + x) * 4 + 3] > 200, D = o4[((y + 1) * W + x) * 4 + 3] > 200;
  if ((L && R) || (U && D)) { const p = px(x, y); o4[o] = p[0]; o4[o + 1] = p[1]; o4[o + 2] = p[2]; o4[o + 3] = 255; } }
const tight = await sharp(await sharp(o4, { raw: { width: W, height: H, channels: 4 } }).png().toBuffer()).trim().png().toBuffer();
const tm = await sharp(tight).metadata();
const hex = (h) => ({ r: parseInt(h.slice(1, 3), 16), g: parseInt(h.slice(3, 5), 16), b: parseInt(h.slice(5, 7), 16), alpha: 1 });
const card = hex(cardBg), clear = { r: 0, g: 0, b: 0, alpha: 0 };
const place = async (w, h, bgc, img, scaleW, file) => { const buf = await sharp(img).resize({ width: scaleW, height: Math.round(h * 0.85), fit: "inside" }).toBuffer(); await sharp({ create: { width: w, height: h, channels: 4, background: bgc } }).composite([{ input: buf, gravity: "center" }]).png().toFile(file); };
const f = finish.toLowerCase();
await sharp(tight).toFile(`${out}/${prefix}_logo_${f}_transparent_tight.png`);
await place(1920, 1080, clear, tight, 1200, `${out}/${prefix}_logo_${f}_transparent_1920x1080.png`);
await place(1920, 1080, card, tight, 1100, `${out}/${prefix}_endcard_${f}_1920x1080.png`);
await place(1080, 1920, card, tight, 900, `${out}/${prefix}_endcard_${f}_1080x1920.png`);
await place(1080, 1080, card, tight, 900, `${out}/${prefix}_endcard_${f}_1080x1080.png`);
await place(1080, 1080, card, tight, 920, `${out}/${prefix}_avatar_${f}_fullbadge_1080.png`);
await sharp(tight).resize({ width: 360 }).png().toFile(`${out}/${prefix}_watermark_${f}_360w.png`);
// E avatar: first letter inside the pill
const { data: td } = await sharp(tight).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const ta = (x, y) => td[(y * tm.width + x) * 4 + 3];
const rowSpan = (y) => { let f = -1, l = -1; for (let x = 0; x < tm.width; x++) if (ta(x, y) > 200) { if (f < 0) f = x; l = x; } return [f, l]; };
let best = { y: 0, w: 0 }; for (let y = 0; y < tm.height; y++) { const [f, l] = rowSpan(y); if (l - f > best.w) best = { y, w: l - f, first: f, last: l }; }
let pillTop = best.y, pillBot = best.y; const rw = (y) => { const [f, l] = rowSpan(y); return l - f; };
while (pillTop > 0 && rw(pillTop - 1) >= best.w * 0.9) pillTop--; while (pillBot < tm.height - 1 && rw(pillBot + 1) >= best.w * 0.9) pillBot++;
const y0 = Math.round(pillTop + (pillBot - pillTop) * 0.3), y1 = Math.round(pillTop + (pillBot - pillTop) * 0.7);
const colOn = (x) => { for (let y = y0; y <= y1; y++) if (ta(x, y) > 200) return true; return false; };
const runs = []; let on = false; for (let x = best.first; x <= best.last; x++) { const h = colOn(x); if (h && !on) { on = true; runs.push([x, x]); } else if (h) runs[runs.length - 1][1] = x; else on = false; }
const E = runs[1]; const cx = Math.round((E[0] + E[1]) / 2);
let yy = pillTop; while (yy < pillBot && ta(cx, yy) > 60) yy++; while (yy < pillBot && ta(cx, yy) <= 60) yy++; const ey0 = yy;
yy = pillBot; while (yy > pillTop && ta(cx, yy) > 60) yy--; while (yy > pillTop && ta(cx, yy) <= 60) yy--; const ey1 = yy;
const raw = await sharp(tight).extract({ left: E[0] - 1, top: ey0 - 1, width: E[1] - E[0] + 4, height: ey1 - ey0 + 3 }).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const cw = raw.info.width, ch = raw.info.height, cd = raw.data;
for (let r = 0; r < ch; r++) { let x = 0; while (x < cw && cd[(r * cw + x) * 4 + 3] > 6) x++; const runW = x; let g = x; while (g < cw && cd[(r * cw + g) * 4 + 3] <= 6) g++; if (runW > 0 && runW < 18 && g < cw && g > x) for (let k = 0; k < runW; k++) cd[(r * cw + k) * 4 + 3] = 0; }
// keep only the letter itself: the largest connected opaque component in the crop
{ const lab = new Int32Array(cw * ch).fill(-1); const sizes = []; let big = -1;
  for (let i = 0; i < cw * ch; i++) { if (lab[i] >= 0 || cd[i * 4 + 3] <= 6) continue; const id = sizes.length; sizes.push(0); const st = [i]; lab[i] = id;
    while (st.length) { const j = st.pop(); sizes[id]++; const jx = j % cw, jy = (j - jx) / cw; for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const nx = jx + dx, ny = jy + dy; if (nx < 0 || ny < 0 || nx >= cw || ny >= ch) continue; const k = ny * cw + nx; if (lab[k] < 0 && cd[k * 4 + 3] > 6) { lab[k] = id; st.push(k); } } }
    if (big < 0 || sizes[id] > sizes[big]) big = id; }
  const minKeep = Math.max(200, Math.round(cw * ch * 0.02));
  for (let i = 0; i < cw * ch; i++) if (lab[i] >= 0 && sizes[lab[i]] < minKeep) cd[i * 4 + 3] = 0; }
const eCut = await sharp(await sharp(cd, { raw: { width: cw, height: ch, channels: 4 } }).png().toBuffer()).trim().png().toBuffer();
await place(1080, 1080, clear, eCut, 720, `${out}/${prefix}_avatar_${f}_E_1080_transparent.png`);
await place(1080, 1080, card, eCut, 720, `${out}/${prefix}_avatar_${f}_E_1080.png`);
copyFileSync(src, `${out}/${prefix}_Gemini_${finish}_source.png`);
const brand = prefix === "EP" ? "Eclipse Productions" : "Sonido Eclipse";
writeFileSync(`${out}/README.md`, `# ${brand} — ${finish} finish\n\nSame badge as the silver kit, ${finish.toLowerCase()} material (Gemini render, 2026-10-20). Silver stays the primary mark (web, social avatars, reels). Never mix finishes in one piece.\n\nEnd cards and avatars are on ${cardBg}. Transparent files are keyed from the source render: clean on dark backgrounds, a faint edge on white.\n`);
console.log(prefix, finish, "badge", tm.width, tm.height, "bg", bg, "E", E);
