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

## 2026-10-28 — Requested navigation, depth and screenshot refinement

- Removed header GitHub, Team Orbit on GitHub and closing project CTA; linked verified individual profiles; removed school attribution. Confirmed the original repository is Public and left it unchanged as explicitly requested.
- Fixed the header and mobile anchor offsets; retained all three mobile navigation destinations. Moved wordmark into the actual shared 3D context and preserved responsive size.
- Re-exported original captures with sharper 720 px hero crops and lossless responsive product images. Added on-demand original-derived detail images up to 3600 px, native dialog zoom/previous/next/Escape/focus restoration, and concise real-action steps.
- npm run check: eight tests and build pass. Four-width Chrome checks pass for fixed header, links, detail viewer, focus restoration, resource loading, overflow, tabs and motion preferences. Native Escape test required an actual virtual-key code; no application change needed.
- Chrome's elementsFromPoint order differs from preserve-3d paint order. Added raster colour-plane checks for actual foreground/background occlusion, ignoring only a measured two-pixel antialias band at transformed edges.
- User subsequently requested a clearer team collaboration composition; verified capture/evidence work is ongoing independently. Current requested link removal and navigation improvements are published first.

## 2026-10-28 — Full product tour and team collection

- Inspected latest product main 059aa45; corrected the earlier assumption that team collection was absent. Automatic per-member team collection/sharing exists; cross-member merged sessions do not. No fabricated feature, result or collaborator stack is presented as implemented.
- Added substantial Atlas, extension and team collection chapters, source-based pipeline/control explanations and an explicit implementation-status FAQ. Updated browser/OG title to Orbit - 소개 페이지. Kept actual people, fixed header, individual profile links, animation depth and accessible detail viewer.
- Captured the actual application preview with demo data, approved existing page images and no external AI calls. Added lossless responsive screenshots, full consent-sheet detail, source hashes and local Noto glyph coverage. Private report and raw capture artifacts remain outside the public repository.
- Verification: 9 content/asset/font tests and build pass; browser checks at 320/390/768/1440 px show no horizontal overflow, missing images, console errors or text-width clipping. Six new gallery groups pass 18 open/decode/zoom/Escape/focus checks. All four navigation anchors clear the fixed header. Motion controls and reduced motion pass.
- Visual review prompted larger mobile navigation labels, a correction to the expanded-session screenshot alt text and a narrower-phone heading adjustment. Actual PDF/banner production is in the separate exhibition worktree.
- Dedicated Chrome profiles Orbit 체험 A/B have the latest extension installed against the healthy local backend at 127.0.0.1:8076. Both are at Google sign-in; no accounts, browsing consent or shared workspace were fabricated. Actual two-account collaboration still awaits user login and is not claimed as verified.

- Final review replaced an uninformative empty-orbit Atlas shot with the already captured personal development session showing real page previews, folders and summary. A new alternate capture was blocked by disk ENOSPC; only a closed task-created temporary Chrome profile was cleaned. Source and deliverable artifacts were retained.
- The 320 px hero now displays its intended two lines. An initial height assertion did not account for mixed Korean/Latin font line boxes; the rendered screenshot confirmed the correction and the focused check accounts for that difference.

- Publication: c84a4c1 pushed normally to main; Pages run 40668172596 passed. Public HTML returns 200 with the new title and team collection copy. Seven representative deployed images/font/JS/CSS match local files byte-for-byte. Published site and seven-panel preview opened in actual Chrome.
- Final 320/390 px focused checks confirm two mixed-font heading lines without overflow. Local source checks: 9/9 plus successful build. Disk ENOSPC recurred during the final documentation write; only the reproducible local dist build was removed, preserving all sources and print deliverables.


## 2026-10-28 — Interactive Atlas, joint team story, Team AI removal

- Removed the cramped Team AI answer composition and all visible Team AI copy; kept personal Orbit AI. Renamed steps to 키워드로 검색 and 이어서 서칭.
- Added eight real public pages with perspective drag/inertial snapping, keyboard/controls, touch intent and reduced-motion handling.
- Added three member browsers and actual product Atlas captures for 0–6 arriving visits. All six public document URLs match the product fixture. Frames total 1.08 MB; original joint Atlas detail is available on demand.
- Added interruptible FAQ animation; verified intermediate measured height, reversal and reduced-motion behavior.
- Browser layout/detail/header/keyboard check passed at 1440,768,390,320 px; no overflow, broken images or console errors. Actual multi-account authentication is separate and not claimed from preview fixtures.
- The companion product branch passed 1311 backend tests (25 existing PG-only skips) and 791 extension tests, TypeScript and build. Local backend is healthy on 8076; both Chrome test profiles have been refreshed and remain at sign-in. No product remote push/merge.

- `npm run check`: 11 tests and static build passed. `node tools/check-interactions.mjs`: mouse drag, End key, intermediate FAQ height (76.2→119.6→147.4px), rapid reversal, reduced motion passed. The initial high-velocity test could wrap all eight pages; the drag check now waits before release so it tests pointer movement deterministically.

- Mobile touch verification exposed implicit pointer capture moving from a card to its viewport: the child’s bubbling `lostpointercapture` prematurely ended the drag. Restricted cancellation to capture lost by the viewport itself, preserving native vertical scrolling. Added actual touch dispatch to the interaction verification.

- Final scroll test: real mouse wheel advances; frames 0→6→1→0 and decoded image source match at desktop/mobile; reduced motion selects frame6. Touch drag passed after the capture fix. `node tools/check-team-story.mjs` passed.
