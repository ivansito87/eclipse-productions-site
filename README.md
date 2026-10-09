# Eclipse Productions — website

Premium one-page site for **Eclipse Productions LLC** (eclipseproductionsllc.com).
Black / white / one red. Dot-matrix display type (Doto), Inter body, Space Mono labels.

## Stack
- Vite (vanilla HTML/CSS/JS, no framework)
- GSAP + ScrollTrigger — pinned hero "eclipse", scroll-scrubbed manifesto, horizontal services panorama
- Lenis — smooth scroll
- Zero backend. No forms, no payments. Contact is `mailto:` / `tel:`.

## Run locally
```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # outputs dist/
```

## Where to edit things
| What | Where |
|---|---|
| All copy, services, events, reviews, socials | `index.html` |
| Colors, type, spacing | `src/style.css` (`:root` tokens at the top) |
| Motion | `src/main.js` |
| Hero video | `public/video/hype-reel.mp4` |
| Gallery photos | `index.html` → `.film` figures (currently Unsplash placeholders) |

## Deploy
Pushing to `main` builds and deploys to GitHub Pages via `.github/workflows/deploy.yml`.
`public/CNAME` pins the custom domain. DNS lives at Squarespace (see DEPLOY.md).
