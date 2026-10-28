# Orbit

A dynamic, responsive introduction to Orbit and the people building it.

**Website:** https://orbit-browser.github.io/Orbit-Intro/

**Demonstration:** https://youtu.be/vDcOPbC3ntU

## Develop

Node.js 22 or later is required. The website has no npm runtime dependencies and does not require an install step.

```sh
npm run dev
```

Open `http://127.0.0.1:5186/Orbit-Intro/`. Edit `src/index.html`, `src/styles.css`, and `src/main.js`.

```sh
npm run check    # syntax, content/asset contracts, static build
node tools/serve.mjs --dist
```

Optional real-browser verification uses a local Chrome installation:

```sh
CHROME_PATH=/path/to/chrome node tools/check-browser.mjs
SITE_URL=https://orbit-browser.github.io/Orbit-Intro/ node tools/check-browser.mjs
```

On macOS, the standard Google Chrome path is used by default. Browser checks cover 320/390/768/1440 px, product tabs and keyboard navigation, image availability, horizontal overflow, motion pause/resume and reduced motion. Screenshots and results are written to ignored `artifacts/`.

## Publish

The `main` branch is deployed with `.github/workflows/pages.yml`. GitHub repository **Settings → Pages → Source** must be **GitHub Actions**. The workflow verifies and builds the site, uploads `dist/`, and publishes it with the Pages deployment action. All asset paths are relative so the project path `/Orbit-Intro/` works without a domain rewrite.

Do not commit `dist/`, browser profiles, screenshots, credentials or the private final report. Generated website assets in `src/assets/` are intentional distributable source assets; their provenance is recorded alongside them.

## Content and design

- Warm ivory, charcoal and coral editorial design, using the original Orbit mark.
- Actual public-page captures form a CSS 3D orbit; scrolling changes the camera angle.
- Product panels use actual Orbit demonstration screens, not recreated or invented UI.
- The team is 전준 (team representative) and 임동건 (team member). Individual development specialisms are not inferred.
- Capture is opt-in. Each member enables team collection on their own device; subsequent browsing accumulates in the team Atlas. The local implementation combines related collected source sessions with contributor attribution; original records remain owned by their authors. Existing manual sharing remains available.
- Chapters cover the Atlas, extension session list, Orbit AI, restore, team collection controls, team Atlas. Click any product image for the original-derived detailed view.
- This is an introduction site; no public installer, account registration or interactive product backend is represented as available.

See [content evidence](docs/ContentEvidence.md), [design and motion decisions](docs/DecisionLog.md), and [work log](docs/WorkLog.md). Font licenses are bundled in `src/assets/fonts/licenses/`.


The Atlas chapter follows native vertical scrolling through one full revolution recorded from the actual internal UI. The team chapter first collects six visits from three member browsers into the real joint Atlas, then scrolls through its full revolution. Both are labelled demonstrations using synthetic sessions and approved public pages. Team AI promotion has been removed; past-session sharing, opt-in storage and Atlas are the focus.

Additional checks: `node tools/check-interactions.mjs` for FAQ expansion/reversal, `node tools/check-team-story.mjs` for native scroll/keyboard/touch, video seeking, collection before rotation, rewind, section release and reduced motion, `node tools/check-browser.mjs` for responsive browser/layout/details. Actual two-account collaboration requires signing in to the local test profiles and is not inferred from preview footage.
