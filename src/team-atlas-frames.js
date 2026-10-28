// Each step is captured from the actual extension's progressive team fixture.
const instances = new WeakMap();
export function renderTeamAtlasFrame({ slot, frame }) {
  let state = instances.get(slot);
  if (!state) {
    const image = document.createElement("img");
    image.alt =
      "팀원의 탐색 페이지와 참여자가 함께 쌓이는 실제 Orbit 팀 아틀라스";
    image.width = 1600;
    image.height = 760;
    image.decoding = "async";
    slot.append(image);
    state = { image, request: 0 };
    instances.set(slot, state);
  }
  const request = ++state.request;
  const next = new Image();
  next.src = `./assets/team-atlas-frames/frame-${frame}.webp`;
  next
    .decode()
    .then(() => {
      if (request !== state.request) return;
      state.image.src = next.src;
      state.image.dataset.frame = String(frame);
      state.image.alt = `팀 탐색 시연: ${frame}개의 방문 페이지가 쌓인 실제 아틀라스`;
    })
    .catch(() => {
      // Preserve the previous valid frame during an interrupted or failed load.
      if (request === state.request && !state.image.hasAttribute("src")) {
        state.image.alt = "팀 아틀라스 화면을 불러오지 못했습니다.";
      }
    });
}
