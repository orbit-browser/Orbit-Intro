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

## Current-product refresh (2026-11-02)

The tour now uses product main `630b6d8`: unified personal cards, original orbit view, current home/AI/sidepanel, split restore destinations, independent collection target and explicit team sharing. Captures are device-local by default. Separate per-team screenshot consent permits uploading existing and new captures only for pages shared with that team; authenticated current members can view them. Disabling that team’s image sharing deletes your server copies. Sensitive/search capture filters remain, and all tabs are not automatically shared. The original printed-banner identity and URL are preserved; the linked competition video is historical.

To regenerate public demo assets, start the current product's isolated preview and supply approved public-page registries (personal only in the active preview). No real account or private Chrome profile is needed:

```sh
ATLAS_PREVIEW_BASE=http://127.0.0.1:5213 node tools/capture-current-product.mjs
ATLAS_PREVIEW_BASE=http://127.0.0.1:5213 node tools/capture-team-atlas.mjs
ATLAS_PREVIEW_BASE=http://127.0.0.1:5213 ATLAS_FIXTURE_ROOT=/path/to/approved-fixtures/extension node tools/capture-atlas-orbits.mjs
ORBIT_PRODUCT_ROOT=/path/to/approved-fixtures python tools/prepare-team-story.py
python tools/prepare-current-product.py
python tools/refresh-korean-subset.py
```

Asset tools require Pillow, fontTools/Brotli, ffmpeg/ffprobe and cwebp. They are development-only; generated public assets and provenance are committed, temporary screenshots/profiles are ignored. Personal footage records two real pointer drags; corrected team footage records two actual unified-gallery pointer drags over six pages, back to the first page. Approved public demo images are isolated capture scaffolding, not evidence of production screenshot transport.

## Team capture correction (November 2)

Team arrivals 0–6, Atlas still/detail and full-revolution recording now show actual unified cards from product `8902de2` (PR #32), with six approved public documentation images supplied through an isolated demo registry. The on-page label identifies public-page demonstrations; this is not authenticated two-account E2E or evidence of screenshot hosting. Personal captures remain at `630b6d8`.

Asset preparation requires `ORBIT_PRODUCT_REVISION` (full captured commit). Run `tools/prepare-team-story.py` with `ORBIT_PRODUCT_ROOT` pointing to the approved demo fixture, `tools/prepare-current-product.py team-atlas` for only the team still, and `node tools/capture-atlas-orbits.mjs --only=team` for the actual gallery pointer traversal. `--encode-only` reuses complete recorded frames. Provenance records 0–6 loaded card counts and pointer samples across one revolution. Verify with `npm run check` and `node tools/check-team-story.mjs`.

The coordinated server-sharing release updates the privacy FAQ with that separate per-team opt-in boundary. Product behavior was checked with synthetic request fixtures and actual components; no authenticated two-account production E2E is claimed. Captured asset revisions remain `8902de2` for corrected team images and `630b6d8` for unchanged personal images. Website publication and live verification are a separate release step.
