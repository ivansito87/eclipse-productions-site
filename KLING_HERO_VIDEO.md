# Hero background video — Kling.ai brief (paste this whole file into the rebrand session)

## Decision
The landing page keeps a background video. It sits BEHIND the chrome Eclipse Productions
logo, which the website overlays itself. Therefore the video contains **no logo and no text**:
putting the logo inside the video would be redundant and Kling would mangle it anyway.
The video's only job is atmosphere: dark room, silver-white light, motion, energy.

Because the chrome logo sits in the center of the frame, the video needs a **calm, dark center**
and the action (beams, hands, confetti) around the edges and in the lower third.

## Deliverable
- File name: `V1-hero-reel.mp4`
- 16:9, 10 seconds, highest resolution Kling offers (4K preferred, 1080p minimum), 24 or 30 fps
- Locked camera. No cuts. No zoom. No text. No logo. No readable faces.
- Drop it in `~/Developer/eclipse-productions-site/raw/` and run `npm run assets` in that folder.

## Step 1 — generate the anchor still (Kling image, 16:9, 3–4 variations)

**Prompt**
```
Photorealistic editorial event photograph, full-frame camera, 35mm lens, f/2.0, ISO 1600 look.
A packed wedding reception dance floor at night seen from the DJ booth, slightly elevated,
looking out over the crowd. Dozens of guests in formal wear seen from behind and in silhouette,
hands raised. Thin haze in the air. Six narrow white light beams from moving-head fixtures on a
truss above the crowd, angled outward toward the edges of the frame, leaving the center of the
frame dark and calm. White confetti suspended mid-air near the edges. True blacks, only white and
silver-white light, a single faint warm highlight on the far wall, no colored lights.
The center of the image is darker and empty so a logo can be placed over it.
Clean composition, cinematic, premium, Apple product-page aesthetic.
```

**Negative prompt**
```
text, letters, words, watermark, logo, subtitles, signage, banner, screen with text,
readable faces, close-up face, portrait, extra fingers, deformed hands, extra limbs,
cartoon, anime, illustration, painting, 3d render look, oversaturated, rainbow lights,
colored disco lights, pink light, blue light, green light, laser grid, disco ball,
daylight, windows, bright center, low resolution, blurry, noisy, jpeg artifacts,
duplicate people, warped bodies, bent truss, flickering
```

**Pick the still where:** the center third is dark and uncluttered, no face is readable, beams are
white (not colored), hands and bodies look anatomically normal. Reject anything with text.

## Step 2 — animate it (Kling Image-to-Video, start frame = the approved still)

Settings: Professional / high quality, 10 s, 16:9, camera movement **none**, generate 3 variations.

**Motion prompt**
```
Slow motion, 50 percent speed. The crowd sways gently and hands move slowly up and down.
The six white beams sweep very slowly outward and back, staying away from the dark center.
Confetti drifts down slowly through the beams. Haze moves softly. Camera is locked and does not
move. No new people appear. No zoom. Lighting stays white and silver, the center of the frame
stays dark the whole time.
```

**Negative prompt** (same as above, plus)
```
camera movement, zoom, pan, dolly, cut, scene change, strobe, flashing, flicker,
people appearing or disappearing, faces turning to camera, text appearing
```

**Pick the clip where:** nothing pops or morphs, hands stay hands, beams stay white, the center
stays dark, and the first and last second look similar enough to loop (the site cross-fades the
loop, so a near-match is enough).

## If Kling refuses to keep the center dark
Fallback prompt for the still: same as above but replace the crowd with
"an empty dark ballroom dance floor, polished and reflective, six white beams from a truss
pointing outward through haze, white confetti falling at the edges, no people".
Motion prompt then: "beams sweep slowly, confetti falls, haze drifts, camera locked".
