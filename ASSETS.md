# Eclipse Productions v2 — Kling.ai asset brief

## How to get accurate results out of Kling (read first)

1. **Stills first, then animate.** For every video, generate the still (section B) first, pick the
   best one, then use **Image-to-Video** with that still as the **start frame**. Kling drifts far
   less when it is anchored to an image you already approved.
2. **Scrub clips need a start AND end frame.** For V2 sparks, V3 clouds, V4 beams, generate two
   stills (the "off" state and the "on" state), then Image-to-Video with start frame = off,
   end frame = on. The clip then progresses cleanly from A to B, which is exactly what
   scroll-scrubbing needs.
3. **Settings for every clip:** Professional / high-quality mode, **camera movement: none**
   (unless the prompt says otherwise), 5 s unless noted, aspect ratio as listed, highest resolution.
   Generate 2–3 variations, keep the one with the fewest artifacts.
4. **Always paste the negative prompt.** Kling's biggest failures for this job are extra limbs,
   melted hands, text, warped speaker grilles, and lights that drift. The negatives below target those.
5. **No faces up close. No text. No logos.** Crowds from behind or silhouetted only. Any text Kling
   invents will be gibberish and gets the whole shot thrown out.
6. **Name files exactly** as in the tables and drop them into `raw/` in the project folder.

### Universal negative prompt (paste on every generation)
```
text, letters, words, watermark, logo, subtitles, signage, extra fingers, deformed hands, extra limbs,
mutated face, distorted face, close-up face, cartoon, anime, illustration, painting, 3d render look,
oversaturated, low resolution, blurry, noisy, jpeg artifacts, duplicate objects, warped geometry,
bent truss, melted speakers, flickering, strobe, fast camera movement, shaky camera, lens flare overload,
daylight, windows with daylight, colorful disco ball, rainbow lights
```

---

## B. Stills — generate these FIRST (they become the video start frames)

Export at 4K (3840×2160) for 16:9; max resolution for other ratios.
Style prefix for every still prompt:

> **Style:** Photorealistic editorial event photography, shot on a full-frame camera, 35mm lens, f/2.0,
> ISO 1600 look, natural motion blur on moving parts only, true blacks, white and warm-white light
> only with a single red accent allowed, no colored disco lighting, Apple product-page aesthetic,
> clean composition with empty space for headline text, pure black background where specified.

| # | File name | Ratio | Prompt (after the style prefix) |
|---|-----------|-------|----------------------------------|
| S1 | `S1-dj-booth-hero.png` | 16:9 | A professional DJ booth with a glowing white LED façade on a dark ballroom stage. Two Pioneer-style CDJ decks and a mixer glow faintly on top. Behind it, a truss with six moving-head lights pointing upward through light haze. No person at the booth. Centered, symmetrical, lots of black space above the booth. |
| S2 | `S2-led-dance-floor.png` | 16:9 | An infinity-mirror LED dance floor, 20 by 20 feet, in a dark ballroom, lit in white pixels with a few red pixels, viewed from a low angle at the floor's edge. Guests in formal wear silhouetted at the far edge, backs to camera, slightly out of focus. Black ceiling, no chandeliers. |
| S3 | `S3-360-booth.png` | 1:1 | A 360 video booth: a round black platform with a guest in a sequined black dress standing on it, seen from behind at a three-quarter angle, a ring light arm spinning around her leaving a smooth white light trail (long exposure). Pure black background, nothing else in frame. |
| S4 | `S4-uplighting-ballroom.png` | 16:9 | An elegant empty ballroom set for a wedding reception, white uplighting washing every column and wall, round tables with white linens and candles, a dance floor in the center, warm and premium, no guests, no text on anything. |
| S5 | `S5-quince-vals.png` | 4:5 | A quinceañera in a floor-length red ball gown dancing a waltz with her father in a black suit, both seen from behind at a distance, under one narrow white spotlight, low white fog covering the floor to the ankles, dark ballroom around them. Faces not visible. |
| S6 | `S6-corporate-gala.png` | 16:9 | A corporate gala from the back of the room: a wide stage with a large LED video wall showing a soft abstract white light gradient (no text), a podium on the left, 200 guests seated at round tables in the dark, warm candle glow on tables, black drapes. |
| S7 | `S7-photographer-redcarpet.png` | 4:5 | An event photographer seen from behind, camera raised with an on-camera flash, photographing guests posing at a plain black step-and-repeat backdrop (no logos, no pattern) on a red carpet with velvet ropes. Guests out of focus, no faces readable. |
| S8 | `S8-gear-flatlay.png` | 16:9 | Top-down flat lay on a pure black surface, evenly lit like a product catalog: one wireless handheld microphone, one cold-spark fountain machine (black box with a nozzle), one LED moving-head light, one haze machine, one coiled black XLR cable, one pair of DJ headphones. Objects spaced evenly on a grid, nothing overlapping, no text on any device. |
| S9 | `S9-crowd-hands.png` | 16:9 | A packed dance floor seen from the DJ's point of view: dozens of raised hands and silhouettes from behind, white beams cutting through haze from above, confetti suspended in the air, warm white highlights, no faces visible. |
| S10 | `S10-sweet16-neon.png` | 4:5 | A sweet sixteen party: a plain white neon ring light (no words) glowing on a black drape wall, pink and white balloons in a cluster, an LED dance floor glowing white, three teenagers dancing seen from behind. |
| S11 | `S11-sparks-off.png` | 16:9 | Two cold-spark fountain machines (black rectangular boxes, 40 cm wide) sitting 3 meters apart on a dark polished stage floor, switched off, pure black background, soft white rim light outlining the boxes, locked symmetrical composition, empty center. |
| S12 | `S12-sparks-on.png` | 16:9 | The exact same scene as S11: two cold-spark fountain machines 3 meters apart on a dark stage floor, now both firing full white spark fountains 3 meters tall, sparks bright white at the base and fading to warm gold at the tips, reflections on the polished floor, pure black background. |
| S13 | `S13-beams-down.png` | 16:9 | A horizontal black truss spanning the frame near the top, twelve LED moving-head lights mounted on it, all lamps pointing straight down, each emitting a narrow white beam through thin haze, beams parallel and vertical, pure black background, no people. |
| S14 | `S14-beams-fan.png` | 16:9 | The exact same truss and twelve moving-head lights as S13, now with all beams tilted upward and fanned out symmetrically like a crown, white beams through haze, pure black background, no people. |
| S15 | `S15-clouds-empty.png` | 16:9 | A dark ballroom dance floor at night, polished and reflective, a couple's shoes and the hem of a white wedding dress and black trousers at the center seen at floor level, no fog, one soft white spotlight from above, black surroundings. |
| S16 | `S16-clouds-full.png` | 16:9 | The exact same floor-level shot as S15, now with thick, low-lying white fog covering the entire floor to ankle height, the couple's shoes hidden in the cloud, dress hem floating on top, soft white spotlight from above, black surroundings. |

## A. Video clips

Use **Image-to-Video** with the listed start (and end) frames. 16:9 unless noted.
"Scrub" clips must be one continuous action with no loop, no cut, no camera move.

| # | File name | Start → End frame | Length | Motion prompt |
|---|-----------|-------------------|--------|---------------|
| V1 | `V1-hero-reel.mp4` | S9 | 10 s | Slow-motion: hands sway gently, confetti drifts down slowly, the white beams sweep very slowly from left to right, haze moves softly. Camera locked. No new people appear. |
| V2 | `V2-sparks-ignite.mp4` | S11 → S12 | 5 s | The two machines ignite simultaneously: sparks begin as a small sputter and grow steadily into full 3-meter white fountains over the whole clip, reflections appear on the floor. Camera locked. The machines do not move. |
| V3 | `V3-clouds-rise.mp4` | S15 → S16 | 5 s | White fog rolls in slowly from both sides and fills the floor evenly until it reaches ankle height, the shoes disappear into the cloud, the dress hem floats. Nothing else moves. Camera locked. |
| V4 | `V4-beams-sweep.mp4` | S13 → S14 | 5 s | All twelve beams tilt upward in perfect sync and fan out into a symmetric crown, smooth and continuous, haze drifts slightly. The truss and fixtures stay fixed. Camera locked. |
| V5 | `V5-line-array-orbit.mp4` | (generate: a black line-array speaker rig of 8 cabinets hanging from a motor hoist on a dark stage, rim-lit white, pure black background, product shot) | 5 s | Camera orbits slowly 30 degrees to the right around the speaker array, the white rim light traces the cabinet edges as it moves. Speakers do not move or deform. Use Kling camera control: orbit right, slow. |
| V6 | `V6-hora-loca.mp4` (9:16) | (generate: an LED robot costume with a glowing white chest panel and white LED stripes, 2.5 m tall, walking through haze on a dance floor toward the camera, guests on both sides from behind waving white LED foam sticks, confetti, vertical frame) | 5 s | The robot walks slowly toward camera, chest panel pulses softly white, guests wave sticks, confetti falls slowly. Camera locked. Robot proportions stay constant. |
| V7 | `V7-red-carpet.mp4` | S7 | 5 s | The photographer's flash pops twice, guests shift pose slightly, slow dolly left along the rope line. Use Kling camera control: pan left, slow. No faces come into focus. |
| V8 | `V8-led-floor-on.mp4` | (two stills: S2 with the floor dark, then S2 lit) | 5 s | The LED floor lights up from the center outward in a white ripple until the whole floor glows, reflections on silhouettes. Camera locked. |

## C. From you (not AI)

- Logo as vector (SVG / AI / PDF) if it exists. Otherwise I design the wordmark.
- 10–20 real event photos, best quality. Real photos go in "The proof" and reviews.
- Real review quotes + first names.
- Social handles.
- Service-area wording (e.g. "Metro Atlanta · travel nationwide").

Drop everything into `~/Developer/eclipse-productions-site/raw/` with the file names above.
Run `npm run assets` afterwards and the site picks them up (frame sequences, posters, AVIF/WebP sizes).
