# Content evidence

## Product

Primary source: the Orbit application repository, its README and current exhibition source/screens, inspected read-only. The intro repository does not modify the application or exhibition.

- Capture: Chrome extension records browser exploration after the user enables collection.
- Context: page visits are organised into sessions and summaries.
- Orbit AI: searches/answers using stored exploration and exposes related sessions/pages.
- Recovery: opens the pages belonging to a selected session.
- Collaboration: past sessions can be shared explicitly; opt-in new team exploration accumulates in a shared Atlas with contributors. Team AI is not promoted on the introduction page.
- Stack: Chrome MV3, WXT, React, TypeScript; FastAPI, PostgreSQL and Qdrant.

Latest application main `059aa45` confirms team collection windows, per-device opt-in, selected duration, pause/stop, exclusions and automatic sharing of each member’s sessions. `sync_pipeline` partitions records by user and workspace; `session_updater` rejects cross-owner appends. The accompanying local product branch `feat/team-atlas-contributors` now adds an authorized read projection over related collected source sessions, preserving original ownership. The UI combines their visits and shows exact contributors; unrelated and manually shared sessions remain separate. This is not a new destructive cross-owner stored session.

The product tour now covers the Atlas session/page design, folders and restore, Chrome sidepanel expanded sessions, personal AI retrieval, team Atlas and collection controls. Actual application preview was launched and operated to capture these screens. It uses demo fixtures and approved page-image mappings; it is not evidence of a two-account shared-backend test. Personal Atlas captures retain the real page-preview permission notice; no UI was removed to imply consent.

Collection-control base images crop the actual time selector; their detail view retains the full consent sheet. Editorial author labels and connecting graphics sit outside screenshots. The new participant badges and joint session shown in the Atlas are rendered by the implemented product components from the new DTO; they are not painted onto a screenshot. The six visits are explicitly synthetic demonstration records.

## Team and project status

User confirmed names: **전준, 임동건**.

The user-provided **Orbit final results report, 2026-10-23**, was reviewed without copying the PDF into this public repository:

- p. 1: 전준 is team representative (affiliation omitted at the user’s request); 임동건 is a team member. Two people total. No individual frontend/backend roles were stated.
- pp. 2–3: browser extension, opt-in collection, automatic sessions and personal/team exploration workflows.
- p. 21: 2026 AI Rookie domestic AI track finalist and official demonstration video.
- p. 30: internal real-world use/evaluation stage; external beta and Web Store release are future plans.

No award placement, accuracy figure, customer count, pricing, public install availability or individual GitHub account is invented.

## Public destinations

Checked during production:

- 전준: https://github.com/06-month
- 임동건: https://github.com/WhiteJbb
- Video: https://youtu.be/vDcOPbC3ntU — public title “AI Rookie | Orbit 팀 시연 영상”.

## Images

`src/assets/provenance.json` records original capture path, source SHA-256, output dimensions and output byte size. Images are optimised WebP copies; actual UI is neither fabricated nor repainted. The hero uses public webpage crops from the supplied exhibition asset library.

The product screens contain **demonstration data**. 김오르빗, 박지은 and 이도현 in those screens are fixture identities, not Orbit team members. They are never presented as team profiles. No personal member portraits have been invented.

## Fonts

Locally served Inter, Noto Sans KR, JetBrains Mono and Oswald. Their upstream SIL Open Font License notices are included in `src/assets/fonts/licenses/`.

## Interactive exploration and team story, 2026-10-28

The introduction no longer exposes Team AI text or its answer screen. The personal Orbit AI section remains. The eight-page Atlas demonstration uses approved real webpage images, with mouse/touch dragging, keyboard navigation and reduced-motion support. It is labelled as a demonstration.

The team story shows three synthetic members and their six actual public documentation captures. Scrolling selects frames 0–6 captured from the real product preview and reverse scrolling rewinds them. `assets/team-atlas-frames/provenance.json` records the product base/branch, exact route, source checksums and public page URLs. No private application source, secrets, report PDF, user browsing records or API access is published. This scene is not a live authenticated multi-account integration test.
