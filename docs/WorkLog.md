# Work log

## 2026-11-02 — Prepare privacy copy for coordinated screenshot sharing

- Updated the screenshot FAQ: images default to device-local; separate permission for each team allows existing/new images only for pages shared with that team; authenticated team members can view them; disabling deletes that author’s server copies. Sensitive/search capture filters remain and all tabs are not automatically shared.
- Updated the privacy regression contract, README, ContentEvidence, DecisionLog and Plan. Kept the explicit public-demo label and captured provenance unchanged (`8902de2` team, `630b6d8` personal). Synthetic component/API checks are not authenticated two-account production E2E.
- Validation: `npm run check` passes 13/13, font coverage and static build; `node tools/check-interactions.mjs` passes FAQ expansion/reversal/reduced motion. Additional `/tmp/orbit-intro-privacy-faq-qa.mjs` checks the changed FAQ at 1440/390 for complete copy, expanded text bounds, rapid reversal and reduced motion; both pass. `git diff --check` passes. Team-story checks were not repeated because its assets are unchanged.
- Scope is website copy/documentation only; parent task coordinates server rollout, publication and live verification. No commit, push or publication performed here.

## 2026-11-02 — Correct old team orbit imagery

- Root cause: the previous website capture explicitly chose `snapshots=off`; product layout choice also depended on mixed-author local-photo eligibility. Product PR #32 (`8902de2`) separates layout from ownership while preserving private-photo guards. This website correction uses that component revision.
- Re-encoded actual cumulative 0–6 team captures, responsive Atlas still/detail, unified-card poster and 96-frame full-revolution MP4. Six approved public documentation images come from an isolated demo registry; synthetic members and “공개 페이지 시연” label remain explicit. No real user capture, authenticated two-account E2E or screenshot hosting is claimed by these images.
- Provenance records actual empty/unified layout, N cards and N loaded public images, plus two genuine gallery pointer drags with checkpoints 0→3→3→6 and return-to-first transform. Team revision is `8902de2`; unchanged personal assets retain `630b6d8`. Asset scripts now require `ORBIT_PRODUCT_REVISION` and selective preparation preserves baseline metadata.
- Commands: `/tmp/orbit-intro-assets-venv/bin/python tools/prepare-team-story.py` with approved `ORBIT_PRODUCT_ROOT` and revision; the same Python `tools/prepare-current-product.py team-atlas`; `node tools/capture-atlas-orbits.mjs --only=team --encode-only` with revision/fixture root. Result: team MP4 2,220,750 bytes, 1600×760, 3.2 s, no audio; seven arrival frames total 997,014 bytes.
- Validation: `npm run check` passes all 13 content/asset/hash/font contracts and static build. `node tools/check-team-story.mjs` passes 1440/390 desktop/mobile native wheel, keyboard, vertical touch, arrival→rotation, rewind, release, reduced-motion static and failure-poster checks. Visually reviewed frame6, poster, desktop collected scene and mobile rotation screenshot. `git diff --check` passes. Full four-width/FAQ suites were not repeated because this correction changes team media/caption only.
- Updated README, Plan, ContentEvidence and DecisionLog. Kept hero, personal flow and banners unchanged. The subsequent coordinated screenshot-sharing release updates FAQ/privacy contracts as recorded below. No commit, push, PR, merge or publication performed in this subtask.

## 2026-11-02 — Refresh for current Orbit without breaking banner continuity

- Worked on `feat/intro-current-product` from clean remote main `93244c2`; fetched again before publication and found no teammate divergence. Preserved original hero, logo, coral/ivory palette, section order, Pages URL and all printed banner files.
- Replaced 10 existing visible product screens and added real orbit/share views using product main `630b6d8`'s component tree. Synthetic API/Chrome fixtures ran in temporary headless profiles. Personal preview images are approved public sources; no real account, browser history or private capture was accessed. Timeline additionally needs the local event queue, so populated that isolated queue with the same demo fixtures before recording the actual component.
- Re-recorded personal unified-card traversal and all seven cumulative team frames. Team navigation uses actual orbit controls without remote screenshots. Updated responsive lossless WebP variants, video checksums, source hashes, product revision and local Korean font subset. Videos are 1,549,910 and 491,722 bytes, down from approximately 4 MB combined to 2 MB.
- Added accessible cards/orbit selection preserving scroll position, current restore-before/after composition and explicit session/page sharing. Replaced duration/pause language with independent team choice and until-off collection. Added accurate local screenshot/optional preview and folder-example FAQ. Kept supplied historical video labelled as competition footage.
- Validation: `npm run check` passes 13 tests, syntax and build; `node tools/check-browser.mjs` passes 320/390/768/1440 widths, image loading, no overflow, detail dialog/focus, tabs and motion; `node tools/check-interactions.mjs` passes FAQ transitions/reversal/reduced motion; `node tools/check-team-story.mjs` passes wheel/keyboard/touch/rewind/release, cards/orbit switching, reduced motion and failed-video poster fallback. Additional desktop/mobile sharing viewer checks pass. Visually reviewed refreshed desktop/mobile sections and raw captures.
- Resolved capture/test issues before release: waited for loaded product data rather than timed loading screens; used real selection buttons for page detail; seeded the timeline's local queue; respected mixed-author team screenshot eligibility; native Enter simulation includes carriage-return text; temporary font tooling includes Brotli. These did not require product changes.
- Updated Plan, ContentEvidence, DecisionLog, FontSubset and README. The capture preview is illustrative, not evidence of authenticated two-account backend E2E. No public installer or team screenshot hosting is claimed. Application checkout remains clean.
- Publication: normal feature push and reviewed squash PR to existing Pages workflow; live deployment verification follows the merge. Previous site remains recoverable from `93244c2`.

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

- Published commit `0b93fd0` through Pages workflow 40678898883 (build/deploy success). Native Chrome hard-refresh confirmed the new draggable Atlas, joint scroll story, renamed steps and absence of Team AI. Existing browser tabs needed refresh because changing only the URL hash reused the old document.
- Live frame checks wait for the requested decoded image rather than the previous frame retained during network loading. Source content hashes and public asset responses are checked separately.

## 2026-10-28 — Actual Atlas scroll revolutions

- Replaced the separate free-drag gallery with a native-scroll recording of the real internal Atlas. The personal scene holds its starting/ending frame and completes one revolution before the section releases.
- Split the team story into collection and rotation: all six visits arrive by 51% of the scene; rotation follows from 58–94%. Reverse scrolling restores the previous phase. Preserved the peach background exactly (`rgb(243, 211, 195)`) and made no banner changes.
- Recorded the actual AtlasGallery with controlled pointer input and public synthetic fixtures, without modifying its rendered UI. Personal has eight approved travel pages; team has the same six documents as the collection captures. Both are 1600×760, 96 frames / 3.2 seconds, seekable H.264 without audio, totaling about 4.1 MB. The product's personal preview-permission notice remains visible.
- Added poster fallback, lazy video initialization, queued seeking, listener cleanup and reduced-motion static views. The local preview server supports MP4 MIME and byte-range responses. On narrow screens the actual central gallery is framed more closely for legibility.
- Browser checks passed at 1440, 768, 390 and 320px: no horizontal overflow, broken images or console errors; fixed header, product tabs and detail viewer remain valid. The dedicated scene test passed wheel, native PageDown, vertical touch, 0→2→6 collection before rotation, seek position, reverse scrolling, section release, reduced motion and media-error poster fallback at 1440/390px.
- FAQ verification passed with intermediate expansion height 76.2→126.4→147.4px, rapid reversal and reduced motion. A first mobile scene test raced Chrome's native PageDown animation; the test now lets that native animation finish before repositioning the next scene. No product behavior was changed to satisfy the test.
- Desktop/mobile screenshots were visually inspected, including the actual first/middle/last gallery frames. Provenance and SHA-256 asset tests cover both recordings and posters. Actual authenticated two-account testing still requires Google login in the prepared local profiles; capture fixtures are not represented as that test.
- Final static check: `npm run check` passed 12 tests and build; `git diff --check` passed. Local MP4 range request returned 206, video/mp4 and the requested 100 bytes.

- Follow-up correction: the user explicitly requested removing the enable-preview notice from the introduction. Recaptured the personal scene with `tabSnapshotsEnabled:true` in the isolated preview's synthetic storage. This renders the normal enabled-state UI without CSS/DOM hiding and without changing real extension permissions.

### Published validation
Product screenshot sharing deployed as team-screenshots-20261102T100901Z and merged through orbit PR33; the introduced privacy copy now matches the released contract. Site PR2/main d21df73 deployed successfully (Pages41426658608). Nine live HTML/JS/image/video/provenance files match the reviewed source; live1440/390 scroll, keyboard, touch, rewind, reduced-motion and failed-video poster tests pass. No actual production account screenshot was uploaded during verification.
