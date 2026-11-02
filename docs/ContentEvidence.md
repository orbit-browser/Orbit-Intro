# Content evidence

## Product

Primary source: the Orbit application repository, its README and current exhibition source/screens, inspected read-only. The intro repository does not modify the application or exhibition.

- Capture: Chrome extension records browser exploration after the user enables collection.
- Context: page visits are organised into sessions and summaries.
- Orbit AI: searches/answers using stored exploration and exposes related sessions/pages.
- Recovery: opens the pages belonging to a selected session.
- Collaboration: past sessions can be shared explicitly; opt-in new team exploration accumulates in a shared Atlas with contributors. Team AI is not promoted on the introduction page.
- Stack: Chrome MV3, WXT, React, TypeScript; FastAPI, PostgreSQL and Qdrant.

Current published product main is `630b6d8fdcc4e58f03f175408e9d1d5d96730dd3` (November 2). Its application tree matches the local capture checkout. Evidence inspected: `VariantAtlasReplica`, `AtlasGallery`, `AtlasPageCard`, `AtlasDetail`, `AtlasOpenControl`, `useAtlasContextMenu`, `TeamCollectControl`, `tab-snapshots`, and the folder-classification policy and tests. Product files remain untouched.

- Personal Atlas combines captured image, page metadata and opening actions into one card. Its original orbit remains available when previews are off. Selected session context stays above the detail pane.
- Restore offers current-window/new-window destinations. Session/page menus explicitly select a team to share with; workspace browsing selection does not start collection.
- The flag selects a collection team, shows consent information, and starts collection until stopped (or all Chrome windows close). Membership/owner eligibility and sensitive/excluded URL rules still apply. Duration selection is gone.
- Preview capture is optional, local to this device, and not uploaded to the team server. Mixed-author team sessions currently render orbit/page information rather than shared screenshots. The updated team frames and video preserve this actual behavior. The separate member-browser illustrations show their public source pages, not uploaded team images.
- Folder auto-classification needs at least two fresh manually placed examples; ambiguous cases become suggestions. An empty folder name alone does not classify history.

All renewed product screenshots and video frames are actual current components operated in an isolated preview with synthetic records and API/Chrome doubles. Only previously approved public-page images enter the personal capture map. Screens are not live backend or authenticated two-account E2E evidence. No DOM text/style was replaced to fabricate controls. `tools/capture-current-product.mjs`, `capture-team-atlas.mjs` and `capture-atlas-orbits.mjs` record sources; responsive WebP derivatives preserve source hashes and product revision. Detail images retain original resolution and load on demand.

The original hero, logo, palette, section order and printed banners remain unchanged. The supplied YouTube link is retained as **대회 시연 영상**: historical footage, not a new product recording.

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

## Historical implementation: October 28 (screens superseded November 2)

The introduction no longer exposes Team AI text or its answer screen. The personal Orbit AI section remains. The eight-page Atlas demonstration is a recording of the real internal product UI, operated with pointer dragging during capture and scrubbed by native page scrolling on this introduction site. It makes one complete revolution and returns to its starting page. It is labelled as a demonstration; reduced motion keeps a static real screen.

The team story shows three synthetic members and their six actual public documentation captures. Scrolling first selects frames 0–6 captured from the real product preview, then advances a full revolution of that same six-page gallery. Reverse scrolling rewinds both phases. `assets/team-atlas-frames/provenance.json` records the product base/branch, exact route, source checksums and public page URLs. No private application source, secrets, report PDF, user browsing records or API access is published. This scene is not a live authenticated multi-account integration test.


## Historical recording method: October 28

`assets/atlas-orbits/provenance.json` records the actual preview routes, public page mappings and recording metadata. The MP4 files have no audio and no automatic playback; the website seeks the recording to native scroll position. These are public demonstration recordings, not a live embedded application. Personal Atlas now shows the preview-enabled fixture state, so the introduction has no enable-preview prompt. The original peach team background and the seven exhibition banners are unchanged.
