/**
 * Reels for the Our Work page: raw/reels/<name>.mp4|mov → public/reels/<name>.mp4 (H.264, ≤1080 tall, web-optimized)
 * + public/reels/<name>.webp poster (frame at 1s). Usage: node scripts/reels.mjs [files...] (default: all in raw/reels)
 */
import { execSync } from "node:child_process";
import { mkdirSync, readdirSync, existsSync } from "node:fs";
import { basename, extname, join } from "node:path";
import sharp from "sharp";

mkdirSync("public/reels", { recursive: true });
const args = process.argv.slice(2);
const files = args.length ? args : readdirSync("raw/reels").filter((f) => /\.(mp4|mov|m4v)$/i.test(f)).map((f) => join("raw/reels", f));
for (const f of files) {
  const name = basename(f, extname(f)).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const out = `public/reels/${name}.mp4`;
  execSync(`ffmpeg -y -hide_banner -loglevel error -i "${f}" -vf "scale='if(gt(iw,ih),min(1920,iw),min(1080,iw))':-2" -c:v libx264 -crf 25 -maxrate 6M -bufsize 12M -preset slow -pix_fmt yuv420p -c:a aac -b:a 128k -movflags +faststart "${out}"`);
  const dur = parseFloat(execSync(`ffprobe -v error -show_entries format=duration -of csv=p=0 "${out}"`).toString()) || 10;
  execSync(`ffmpeg -y -hide_banner -loglevel error -ss ${(dur * 0.3).toFixed(2)} -i "${out}" -frames:v 1 ".tmp-poster.png"`); // 30% in: past any intro card
  await sharp(".tmp-poster.png").resize({ width: 900 }).webp({ quality: 80 }).toFile(`public/reels/${name}.webp`);
  const size = execSync(`du -h "${out}" | cut -f1`).toString().trim();
  console.log(`reel ${name}: ${size}  poster ok  → set "video": "/reels/${name}.mp4", "poster": "/reels/${name}.webp"`);
}
if (existsSync(".tmp-poster.png")) execSync("rm -f .tmp-poster.png");
