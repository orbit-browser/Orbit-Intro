# Work log

## 2026-10-28 — Initial Orbit introduction

- Cloned the supplied empty public Orbit-Intro repository and confirmed authenticated administrative permission. Implemented only in this repository on `feat/orbit-introduction`; application and exhibition assets were read-only references.
- Read actual product/source/screens and inspected live orumo.org. Created the plan before implementation.
- Built a responsive editorial website with a true CSS 3D page orbit, scroll perspective, keyboard-accessible product stages, team-sharing composition, actual two-person team and verified GitHub/video destinations.
- Converted approved captures into small WebP assets, retained original mark, bundled local font licenses and recorded image provenance. Did not publish the private report.
- Added relative project-path asset loading, semantic landmarks/skip link, reduced motion, pause control and offscreen animation suspension.
- Fixed motion resume after a paused hero leaves and re-enters the viewport by centralising animation state around pause/visibility/intersection conditions.
- Corrected image intrinsic dimensions to match actual optimised assets and explicitly hide inactive product panels.
- Browser verification initially waited on hidden lazy-loaded images. Fixed the verification harness to request every image before decoding; this was a harness issue, not an application-loading change.
- Local checks: JavaScript syntax, five content/asset/structure tests, static build. Real Chrome checks at 320, 390, 768 and 1440 px, keyboard tab selection, missing images, resource status, overflow, reduced-motion and pause/resume. Rendered desktop and mobile screenshots were visually reviewed.

## Publication and final verification

- Published the initial verified feature commit `f282403` to the empty repository's `main` branch; retained the implementation branch. Set the public Pages source to GitHub Actions and enabled HTTPS.
- Deployment run `40654491940` passed both build and deployment. Verified HTTP 200 at https://orbit-browser.github.io/Orbit-Intro/.
- Repeated the real-browser suite against the public URL: all four viewport sizes passed, 35 requested local resources returned 200, no broken images, no JavaScript errors, no horizontal overflow. Confirmed inactive panels compute to display:none, keyboard navigation, pause → offscreen → onscreen → resume, automatic offscreen suspension, and reduced-motion preference changes.
- Final font audit found 10 new Hangul syllables absent from the exhibition-only font subsets. Added a 3,192-byte official Noto Sans KR subset served locally, with source/license documentation and a regression check covering every Hangul syllable in the website copy. Existing font files remain unchanged.
- No application/banner files or report PDF were committed. No live product installer or signup is implied. Actual public destinations are GitHub and the verified demonstration video.

Browser screenshots/results are in ignored `artifacts/`. The checked source and deployment workflow are versioned; screenshots are review artifacts, not website assets.
