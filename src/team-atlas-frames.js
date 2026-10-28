import { mountScrollVideo } from './scroll-video.js';

// Collection stills and the revolution come from the same real product fixture.
const instances = new WeakMap();
export function renderTeamAtlasFrame({ slot, frame, rotation = 0, reducedMotion }) {
  let state = instances.get(slot);
  if (!state) {
    const image = document.createElement('img');
    image.alt = '팀원의 탐색 페이지와 참여자가 함께 쌓이는 실제 Orbit 팀 아틀라스';
    image.width = 1600;
    image.height = 760;
    image.decoding = 'async';
    const orbit = document.createElement('div');
    orbit.className = 'team-story__atlas-orbit';
    orbit.setAttribute('aria-hidden', 'true');
    slot.append(image, orbit);
    const media = mountScrollVideo(orbit, {
      src: new URL('./assets/atlas-orbits/team.mp4', import.meta.url).href,
      poster: new URL('./assets/atlas-orbits/team.webp', import.meta.url).href,
      label: '여섯 페이지가 모인 실제 팀 아틀라스를 한 바퀴 살펴보는 시연',
    });
    state = { image, orbit, media, request: 0, frame: -1 };
    state.destroy = () => {
      state.request++;
      media.destroy();
      slot.replaceChildren();
      instances.delete(slot);
    };
    instances.set(slot, state);
  }
  const rotating = frame === 6 && rotation > 0 && !reducedMotion;
  state.orbit.classList.toggle('is-active', rotating);
  state.orbit.setAttribute('aria-hidden', String(!rotating));
  state.image.setAttribute('aria-hidden', String(rotating));
  state.media.seek(rotating ? rotation : 0);
  if (state.frame !== frame) {
    state.frame = frame;
    const request = ++state.request;
    const next = new Image();
    next.src = new URL(`./assets/team-atlas-frames/frame-${frame}.webp`, import.meta.url).href;
    next.decode().then(() => {
      if (request !== state.request) return;
      state.image.src = next.src;
      state.image.dataset.frame = String(frame);
      state.image.alt = `팀 탐색 시연: ${frame}개의 방문 페이지가 쌓인 실제 아틀라스`;
    }).catch(() => {
      // Preserve the previous valid frame when a later image cannot load.
      if (request === state.request && !state.image.hasAttribute('src')) {
        state.image.alt = '팀 아틀라스 화면을 불러오지 못했습니다.';
      }
    });
  }
  return state.destroy;
}
