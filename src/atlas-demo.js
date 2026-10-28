import { mountScrollVideo } from './scroll-video.js';
const clamp = (value) => Math.max(0, Math.min(1, value));

/** A single revolution of the actual Atlas follows native page scrolling. */
export function mountAtlasDemo(element) {
  if (!element) return () => {};
  element.innerHTML = `
    <div class="atlas-demo__pin">
      <div class="atlas-demo__label"><span>실제 Orbit Atlas · 시연 데이터</span><span class="atlas-demo__cue">스크롤로 한 바퀴 살펴보기 ↓</span></div>
      <div class="atlas-demo__media"></div>
      <div class="atlas-demo__footer"><div class="atlas-demo__progress" role="progressbar" aria-label="아틀라스 한 바퀴 탐색" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><span></span></div><p class="atlas-demo__status">아래로 스크롤하며 페이지를 따라가 보세요.</p></div>
    </div>`;
  const pin = element.querySelector('.atlas-demo__pin');
  const media = mountScrollVideo(element.querySelector('.atlas-demo__media'), {
    src: new URL('./assets/atlas-orbits/personal.mp4', import.meta.url).href,
    poster: new URL('./assets/atlas-orbits/personal.webp', import.meta.url).href,
    label: '실제 Orbit 아틀라스에서 제주 여행 세션의 페이지를 한 바퀴 살펴보는 시연',
  });
  const bar = element.querySelector('.atlas-demo__progress');
  const status = element.querySelector('.atlas-demo__status');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let scheduled = 0, inView = false, disposed = false, lastStage = '';
  function draw() {
    scheduled = 0;
    if (disposed || document.hidden) return;
    const top = parseFloat(getComputedStyle(pin).top) || 0;
    const progress = reduced.matches ? 1 : clamp((top - element.getBoundingClientRect().top) / Math.max(1, element.offsetHeight - pin.offsetHeight));
    const rotation = reduced.matches ? 0 : clamp((progress - .08) / .84);
    element.dataset.progress = progress.toFixed(4);
    element.dataset.rotation = rotation.toFixed(4);
    element.classList.toggle('is-reduced', reduced.matches);
    media.seek(rotation);
    bar.firstElementChild.style.width = `${progress * 100}%`;
    bar.setAttribute('aria-valuenow', String(Math.round(progress * 100)));
    const stage = reduced.matches ? 'reduced' : rotation === 1 ? 'complete' : rotation > 0 ? 'moving' : 'start';
    if (stage !== lastStage) {
      lastStage = stage;
      status.textContent = stage === 'reduced' ? '동작 줄이기 설정으로 실제 화면을 보여드립니다.' : stage === 'complete' ? '한 바퀴를 돌아, 탐색의 다음 장면으로.' : '아래로 스크롤하며 페이지를 따라가 보세요.';
    }
  }
  function schedule() { if (!scheduled && !disposed) scheduled = requestAnimationFrame(draw); }
  const onScroll = () => { if (inView) schedule(); };
  const observer = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; if (inView) schedule(); }, {rootMargin:'200px 0px'});
  observer.observe(element);
  const resize = new ResizeObserver(schedule);
  resize.observe(pin);
  addEventListener('scroll', onScroll, {passive:true});
  addEventListener('resize', schedule, {passive:true});
  document.addEventListener('visibilitychange', schedule);
  reduced.addEventListener('change', schedule);
  schedule();
  return () => {
    disposed = true; cancelAnimationFrame(scheduled); observer.disconnect(); resize.disconnect();
    removeEventListener('scroll', onScroll); removeEventListener('resize', schedule);
    document.removeEventListener('visibilitychange', schedule); reduced.removeEventListener('change', schedule);
    media.destroy(); element.replaceChildren();
  };
}
