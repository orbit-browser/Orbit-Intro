# 2026-10-28 — Introduction refinement (active)

- Goal: fixed navigation, no project/organisation repository CTAs, verified individual GitHub links, no school attribution, real front/behind occlusion between Orbit and the orbiting pages, sharper readable screenshots with clearer usage guidance.
- Evidence: the hero wordmark is currently an external z-index:3 overlay, so all pages pass behind it. Product screenshots were downsampled and compressed for the first delivery. The header is absolute rather than fixed. The user explicitly says to leave the product repository Public; do not change any repository visibility.
- Scope: Orbit-Intro only. Keep the overall editorial design, real UI content, pause/reduced-motion handling and published URL. No application/banner files, features, install links or permissions changes.
- Files: src/index.html, styles.css, main.js, screenshot assets/provenance, tools/prepare-assets.py and browser checks, relevant tests/docs.
- Implementation: move wordmark into the carousel's shared 3D context; preserve its visual anchor and show front/back intersections correctly. Fix header with an opaque ivory background and anchor offsets. Remove source CTAs, link 전준 / 임동건 to supplied profiles. Re-export screenshots from original captures at higher resolution/quality; provide an accessible full-screen detail viewer and concise real-action steps.
- Verification: content/link contracts, exact image dimensions, local font coverage, build, 320/390/768/1440 browser review, sticky header after scrolling, all product tabs and zoom viewer keyboard/focus, rotation checkpoints showing front/back occlusion, pause/reduced motion, live deployment/asset checks.
- Risks: changing the 3D stacking context can move the logo on scaled mobile scenes; compare its actual bounds and inspect several rotation phases. Sharper captures increase bytes; use responsive sizes and load large detail assets on demand.
- Initial refinement ready for publication; the newly requested TEAM evidence composition and two-profile team experience follow as separate scoped steps. The user explicitly wants source-link removal published first.

---

# Orbit introduction website

## Goal and scope

Create and publish a polished, dynamic Orbit product/team introduction at the supplied empty Orbit-Intro repository. Work only in this repository. Read approved product source and brand assets without editing the Orbit application or exhibition files.

## Evidence and constraints

- Repository is empty, public, and the authenticated user has ADMIN access; GitHub Pages is not configured.
- Product source confirms opt-in capture, automatic exploration sessions, Orbit AI search and recovery, and selective team-session sharing/Team AI.
- User and final report confirm 전준 (team lead) and 임동건 (team member). Use these verified roles only; no invented development specialisms.
- Preserve warm ivory #fefaf6, charcoal #2b2521, coral #f07550 and original Orbit wordmark/symbol.
- Additional reference: orumo.org. Inspect the live site and translate its dynamic editorial/scrolled motion principles into Orbit's own visual language.
- No unverified install/demo URL, metrics, testimonials, customer claims or fictional team members.

## Approach

A dependency-free static site (HTML/CSS/ES modules) with a small Node build and test pipeline, deployed by GitHub Actions Pages. Use real product screens and an actual circular CSS 3D arrangement for a responsive hero, scroll-driven chapter transitions, an interactive product gallery and accessible restrained motion. Native scrolling, reduced-motion fallback, keyboard operation and mobile layouts are required.

## Steps

1. Analyse live reference and verified product/team source.
2. Create local optimised brand/screen/font assets with provenance.
3. Implement editorial responsive site and meaningful interactive scenes.
4. Inspect desktop/mobile rendered screenshots and revise.
5. Run content/links/build and browser interaction/viewport/reduced-motion tests.
6. Commit, push, configure Pages, deploy, verify the live URL and assets.
7. Update work log and report source, tests, screenshots and deployment.

## Risks and completion

GitHub Pages base path is /Orbit-Intro/. Team identities are verified by the user/report; the public YouTube demonstration has been checked. No public install/signup is available. Link GitHub and the verified video. Complete only after live deployment works, key interactions are tested and desktop/mobile renders are visually checked.
