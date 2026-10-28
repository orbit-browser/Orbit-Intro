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

Deployment and final live verification will be recorded after publication.
