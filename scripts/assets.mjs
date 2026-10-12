/**
 * Asset pipeline: raw/ → public/
 *  - V*.mp4  → public/seq/<name>/frame_###.webp (120 frames max, 1600px), poster.webp, <name>-1080.mp4
 *  - S*.png|jpg → public/img/<name>-{480,960,1440,1920,2560,3840}.{avif,webp}
 * Usage: node scripts/assets.mjs [file-or-name ...]   (no args = everything in raw/)
 */
import { execSync } from "node:child_process";
import { mkdirSync, readdirSync, rmSync, existsSync, statSync } from "node:fs";
import { basename, extname, join } from "node:path";
import sharp from "sharp";

const RAW = "raw";
const WIDTHS = [480, 960, 1440, 1920, 2560, 3840];
const FRAMES = 120;
const FRAME_W = 1600;

const slug = (f) => basename(f, extname(f)).replace(/^[SV]\d+-/, "").toLowerCase();

async function video(file) {
  const name = slug(file);
  const outDir = join("public/seq", name);
  const tmp = join(".tmp-frames", name);
  rmSync(outDir, { recursive: true, force: true });
  rmSync(tmp, { recursive: true, force: true });
  mkdirSync(outDir, { recursive: true });
  mkdirSync(tmp, { recursive: true });

  const dur = parseFloat(execSync(`ffprobe -v error -show_entries format=duration -of csv=p=0 "${file}"`).toString());
  const fps = Math.min(30, FRAMES / dur);
  execSync(`ffmpeg -y -hide_banner -loglevel error -i "${file}" -vf "fps=${fps},scale=${FRAME_W}:-2" "${tmp}/f_%03d.png"`);
  const frames = readdirSync(tmp).filter((f) => f.endsWith(".png")).sort();
  await Promise.all(
    frames.map((f, i) =>
      sharp(join(tmp, f)).webp({ quality: 78 }).toFile(join(outDir, `frame_${String(i + 1).padStart(3, "0")}.webp`))
    )
  );
  await sharp(join(tmp, frames[0])).webp({ quality: 82 }).toFile(join(outDir, "poster.webp"));
  // compressed playable versions (hero / mobile)
  execSync(`ffmpeg -y -hide_banner -loglevel error -i "${file}" -an -vf "scale=1920:-2" -c:v libx264 -crf 24 -preset slow -movflags +faststart "public/video/${name}-1080.mp4"`);
  rmSync(tmp, { recursive: true, force: true });
  console.log(`seq  ${name}: ${frames.length} frames`);
}

async function image(file) {
  const name = slug(file);
  mkdirSync("public/img", { recursive: true });
  const src = sharp(file);
  const { width } = await src.metadata();
  for (const w of WIDTHS.filter((w) => w <= width || w === WIDTHS[0])) {
    await src.clone().resize({ width: Math.min(w, width) }).avif({ quality: 55 }).toFile(`public/img/${name}-${w}.avif`);
    await src.clone().resize({ width: Math.min(w, width) }).webp({ quality: 80 }).toFile(`public/img/${name}-${w}.webp`);
  }
  console.log(`img  ${name}: ${WIDTHS.filter((w) => w <= width).join("/")}`);
}

const args = process.argv.slice(2);
const files = (args.length ? args : readdirSync(RAW).map((f) => join(RAW, f))).filter((f) => existsSync(f) && statSync(f).isFile());
for (const f of files) {
  const ext = extname(f).toLowerCase();
  if ([".mp4", ".mov", ".webm"].includes(ext)) await video(f);
  else if ([".png", ".jpg", ".jpeg", ".webp"].includes(ext)) await image(f);
}
