# Decisions

## 2026-10-28 — Static, motion-led editorial website

The supplied repository was empty. Use semantic HTML, CSS and a small ES module rather than introduce a framework for a one-page public introduction. A dependency-free Node build copies intentional distributable assets into `dist/`. GitHub Actions runs checks and deploys Pages.

The live orumo.org reference was inspected in Chrome. Its product rig moves from a tilted/scaled perspective into a front-facing view as the visitor scrolls; product stages swap real demonstrations. Orbit applies these principles to its own content: a rotating 3D circle of actual visited pages, scroll-responsive camera angle, reveal transitions, and accessible product-stage tabs. Native scrolling is preserved.

The three panels show automatic capture, Orbit AI and session recovery. A separate shared-session composition shows Team Space and Team AI. Dark/peach/ivory sections separate ideas without repeating a generic card template. The original brand colour is retained in artwork; a deeper coral variant is used where text needs more contrast.

Motion is decorative. A pause control freezes it; the operating-system reduced-motion preference removes it. Intersection/visibility state pauses offscreen rotation and is synchronised when returning. Every product tab supports arrow keys, Home and End, and inactive panels use the native hidden attribute plus an explicit display rule.

## Verified people and calls to action

Names and documented roles come from the user and the final report. Team lead and member are shown without invented engineering titles or photographs. The verified public video and GitHub repository are the actual destinations; no product signup or install endpoint is invented.

## Web asset budget

Optimise individual approved screenshots as WebP. Do not serve the print carousel PNGs or huge print halftone SVGs. Keep all hero/product images under 1 MB combined, local fonts under 1 MB, and no third-party analytics, embeds or runtime scripts. Clicking the video opens YouTube rather than loading an embed on first render.


## 2026-10-28 — Public profile links and shared 3D depth

At the user's request, remove project and organisation GitHub calls to action from the public site. Only the supplied individual profile links remain: 전준 / 06-month and 임동건 / WhiteJbb. Omit school affiliation. The product repository stays Public by the user's explicit instruction; no repository-visibility changes are made.

The Orbit wordmark now shares the CSS 3D perspective context with the rotating page ring, so foreground pages occlude it and background pages pass behind. Preserve the logo's apparent size/anchor across the scaled mobile scene. No new animation dependency.

Product screenshot derivatives are lossless WebP with responsive sizes; larger original-derived images load on demand in a native dialog with keyboard navigation, zoom and focus restoration. The new read-through steps use actual product actions. Header stays fixed with anchor spacing.
