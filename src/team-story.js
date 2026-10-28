// Verified demonstration page titles and URLs from Orbit's preview fixtures.
// The Atlas itself is rendered by the integrating app, not imitated here.
export const TEAM_STORY_DEMO = [
  {
    id: "u-me",
    name: "김오르빗",
    initial: "김",
    color: "#df6d49",
    pages: [
      {
        title: "Dependencies with yield",
        image: "fastapi-dependencies",
        site: "FastAPI",
        domain: "fastapi.tiangolo.com",
        url: "https://fastapi.tiangolo.com/tutorial/dependencies/dependencies-with-yield/",
      },
      {
        title: "StreamingResponse",
        image: "fastapi-streaming",
        site: "FastAPI",
        domain: "fastapi.tiangolo.com",
        url: "https://fastapi.tiangolo.com/advanced/custom-response/#streamingresponse",
      },
    ],
  },
  {
    id: "u-jieun",
    name: "박지은",
    initial: "박",
    color: "#7479bb",
    pages: [
      {
        title: "Streaming API responses",
        image: "openai-streaming",
        site: "OpenAI API",
        domain: "platform.openai.com",
        url: "https://platform.openai.com/docs/guides/streaming-responses",
      },
      {
        title: "Structured outputs",
        image: "openai-structured",
        site: "OpenAI API",
        domain: "platform.openai.com",
        url: "https://platform.openai.com/docs/guides/structured-outputs",
      },
    ],
  },
  {
    id: "u-dohyun",
    name: "이도현",
    initial: "이",
    color: "#ac638a",
    pages: [
      {
        title: "Using server-sent events",
        image: "mdn-sse",
        site: "MDN Web Docs",
        domain: "developer.mozilla.org",
        url: "https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events",
      },
      {
        title: "Background Tasks",
        image: "fastapi-background",
        site: "FastAPI",
        domain: "fastapi.tiangolo.com",
        url: "https://fastapi.tiangolo.com/tutorial/background-tasks/",
      },
    ],
  },
];
const mounts = new WeakMap();
const clamp = (value) => Math.max(0, Math.min(1, value));
const ease = (value) => value * value * (3 - 2 * value);
const ARROW =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M12 4v15m-6-6 6 6 6-6"/></svg>';
const PHASES = [0, 0.22, 0.33, 0.52, 0.7, 0.82, 1];

/**
 * Scroll-driven editorial stage. No timer, automatic playback or fabricated Atlas.
 * renderAtlasFrame({ slot, progress, frame, rotation, arrivedPages, members, reducedMotion })
 * connects the real product projection to the permanent .team-story__atlas-mount.
 * Visits finish before the recorded gallery advances through one full revolution.
 * Return a cleanup function from mountTeamStory to remove listeners and observers.
 */
export function mountTeamStory(element, { renderAtlasFrame } = {}) {
  if (!element) return () => {};
  mounts.get(element)?.();
  element.classList.add("team-story");
  element.innerHTML = `
    <div class="team-story__pin">
      <div class="team-story__heading"><div><p>팀의 탐색이 쌓이는 과정 · 시연</p><h3>세 개의 브라우저. <span>하나의 팀 아틀라스.</span></h3></div><span class="team-story__scroll-cue">스크롤로 살펴보기 ${ARROW}</span></div>
      <div class="team-story__browsers" aria-label="세 구성원의 브라우저">
        ${TEAM_STORY_DEMO.map(
          (member, index) => `
          <article class="team-story__member" style="--member-color:${member.color}" data-member="${member.id}">
            <div class="team-story__identity"><span class="team-story__avatar" aria-hidden="true">${member.initial}</span><h4>${member.name}</h4><span class="team-story__member-state">탐색 준비</span></div>
            <div class="team-story__browser">
              <div class="team-story__chrome" aria-hidden="true"><span class="team-story__window-dots"><i></i><i></i><i></i></span><span class="team-story__address">${member.pages[0].domain}</span><span class="team-story__window-plus">+</span></div>
              <div class="team-story__viewport"><div class="team-story__page-stack">
                ${member.pages.map((page, pageIndex) => `<div class="team-story__page" data-page="${pageIndex}"><img src="${new URL(`./assets/team-pages/${page.image}.webp`, import.meta.url).href}" alt="${page.site} 공개 문서 화면" loading="lazy" width="720" height="1000"><span class="team-story__page-site">${page.site}</span><h5>${page.title}</h5><div class="team-story__document-lines" aria-hidden="true"><i></i><i></i><i></i></div><p>방문 페이지 <b>0${pageIndex + 1}</b></p></div>`).join("")}
              </div></div>
              <div class="team-story__browser-foot"><span>대표 방문 페이지</span><span class="team-story__visit-count">01 <i>/ 02</i></span></div>
            </div>
          </article>`,
        ).join("")}
      </div>
      <div class="team-story__streams" aria-hidden="true"><svg preserveAspectRatio="none" viewBox="0 0 1000 60"><path d="M166 0V12Q166 30 190 30H476Q500 30 500 58"/><path d="M500 0V58"/><path d="M834 0V12Q834 30 810 30H524Q500 30 500 58"/></svg><span>${ARROW}</span></div>
      <div class="team-story__atlas">
        <div class="team-story__atlas-title"><span class="team-story__atlas-dot" aria-hidden="true"></span><h4>팀 아틀라스</h4><p><b class="team-story__arrived-count">00</b>개의 페이지</p></div>
        <div class="team-story__atlas-mount" aria-label="실제 제품 기반의 팀 아틀라스 시연"></div>
      </div>
      <div class="team-story__flight-layer" aria-hidden="true">${TEAM_STORY_DEMO.flatMap((member, memberIndex) => member.pages.map((page, pageIndex) => `<div class="team-story__flying-page" data-owner="${memberIndex}" data-page="${pageIndex}" style="--member-color:${member.color}"><span>${member.initial}</span><p>${page.title}</p></div>`)).join("")}</div>
      <div class="team-story__footer"><div class="team-story__progress" role="progressbar" aria-label="팀 탐색 시연 진행" aria-valuemin="0" aria-valuemax="6" aria-valuenow="0"><span></span></div><p class="team-story__status" role="status" aria-live="polite">아래로 스크롤해 세 사람의 탐색을 따라가 보세요.</p><div class="team-story__navigation"><button type="button" class="team-story__previous" aria-label="이전 장면">↑</button><button type="button" class="team-story__next" aria-label="다음 장면">↓</button></div></div>
    </div>`;

  const query = (selector) => element.querySelector(selector);
  const pin = query(".team-story__pin");
  const slot = query(".team-story__atlas-mount");
  const members = [...element.querySelectorAll(".team-story__member")];
  const memberViews = members.map((member) => ({
    node: member,
    address: member.querySelector(".team-story__address"),
    count: member.querySelector(".team-story__visit-count"),
    status: member.querySelector(".team-story__member-state"),
    key: "",
  }));
  const flying = [...element.querySelectorAll(".team-story__flying-page")];
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const state = {
    progress: 0,
    frame: -1,
    rotationFrame: -1,
    phase: "",
    destroyAtlas: undefined,
    requested: 0,
    inView: false,
    disposed: false,
    dirty: true,
    paths: [],
  };
  const arrivals = TEAM_STORY_DEMO.flatMap((member, memberIndex) =>
    member.pages.map((page, pageIndex) => ({
      memberId: member.id,
      memberName: member.name,
      memberIndex,
      pageIndex,
      ...page,
      start: 0.13 + pageIndex * 0.43 + memberIndex * 0.055,
      end: 0.31 + pageIndex * 0.43 + memberIndex * 0.055,
    })),
  ).sort((a, b) => a.end - b.end);

  function measure() {
    const base = pin.getBoundingClientRect();
    const destination = slot.getBoundingClientRect();
    state.paths = flying.map((card) => {
      const owner = Number(card.dataset.owner);
      const browser = members[owner]
        .querySelector(".team-story__browser")
        .getBoundingClientRect();
      return {
        x: browser.left - base.left + browser.width / 2,
        y: browser.bottom - base.top - 19,
        endX:
          destination.left -
          base.left +
          destination.width * (0.3 + owner * 0.2),
        endY:
          destination.top - base.top + Math.min(80, destination.height * 0.35),
      };
    });
  }
  function draw() {
    state.requested = 0;
    if (state.disposed || document.hidden) return;
    const rect = element.getBoundingClientRect();
    const stickyTop = parseFloat(getComputedStyle(pin).top) || 0;
    const travel = Math.max(1, element.offsetHeight - pin.offsetHeight);
    const progress = reduced.matches
      ? 1
      : clamp((stickyTop - rect.top) / travel);
    state.progress = progress;
    const collection = clamp(progress / 0.6);
    const rotation = reduced.matches ? 0 : clamp((progress - 0.58) / 0.36);
    const rotationFrame = Math.round(rotation * 95);
    const phase = rotation >= 1 ? "complete" : rotation > 0 ? "rotate" : "collect";
    const arrived = arrivals.filter((visit) => collection >= visit.end);
    const frame = arrived.length;
    if (state.dirty) measure();
    element.classList.toggle("is-complete", progress > 0.94);
    element.classList.toggle("is-reduced", reduced.matches);
    element.dataset.progress = progress.toFixed(4);
    element.dataset.rotation = rotation.toFixed(4);
    element.dataset.phase = phase;
    for (const [index, view] of memberViews.entries()) {
      const second = collection >= 0.49 + index * 0.055;
      const item = TEAM_STORY_DEMO[index];
      const ownArrived = arrived.filter(
        (visit) => visit.memberIndex === index,
      ).length;
      const exploring = collection > 0.04 + index * 0.025 && ownArrived < 2;
      const key = `${second}-${ownArrived}-${exploring}`;
      if (view.key !== key) {
        view.key = key;
        view.node.style.setProperty("--page-position", second ? "-50%" : "0%");
        view.address.textContent = item.pages[second ? 1 : 0].domain;
        view.count.innerHTML = `${second ? "02" : "01"} <i>/ 02</i>`;
        view.node.classList.toggle("is-exploring", exploring);
        view.node.classList.toggle("is-collected", ownArrived === 2);
        view.status.textContent =
          ownArrived === 2 ? "기록됨" : exploring ? "탐색 중" : "탐색 준비";
      }
    }
    for (const [index, card] of flying.entries()) {
      const owner = Number(card.dataset.owner),
        page = Number(card.dataset.page);
      const visit = arrivals.find(
        (item) => item.memberIndex === owner && item.pageIndex === page,
      );
      const t = clamp((collection - visit.start) / (visit.end - visit.start));
      const path = state.paths[index];
      const motion = ease(t);
      const visible = !reduced.matches && t > 0 && t < 1;
      card.style.opacity = visible
        ? String(Math.min(1, t * 8, (1 - t) * 9))
        : "0";
      card.style.transform = `translate3d(${path.x + (path.endX - path.x) * motion}px,${path.y + (path.endY - path.y) * motion}px,0) translate(-50%,-50%) scale(${1 - 0.22 * motion}) rotate(${(owner - 1) * (1 - motion) * 6}deg)`;
    }
    query(".team-story__progress > span").style.width = `${progress * 100}%`;
    query(".team-story__previous").disabled =
      reduced.matches || progress < 0.005;
    query(".team-story__next").disabled = reduced.matches || progress > 0.995;
    if (frame !== state.frame || phase !== state.phase || state.dirty) {
      state.frame = frame;
      state.phase = phase;
      query(".team-story__arrived-count").textContent = String(frame).padStart(
        2,
        "0",
      );
      query(".team-story__progress").setAttribute(
        "aria-valuenow",
        String(frame),
      );
      query(".team-story__status").textContent = reduced.matches
        ? "동작 줄이기 설정으로 마지막 장면을 보여드립니다."
        : frame === 0
          ? "아래로 스크롤해 세 사람의 탐색을 따라가 보세요."
          : phase === "complete"
            ? "한 바퀴를 돌아, 팀의 탐색을 함께 살펴봤습니다."
          : phase === "rotate"
            ? "모인 페이지를 한 바퀴 살펴보세요."
          : frame === 6
            ? "세 사람의 방문 페이지가 팀 아틀라스에 모였습니다."
            : `${arrived.at(-1).memberName}의 페이지가 더해졌습니다. 위로 스크롤하면 되돌아갑니다.`;
    }
    if (frame !== Number(slot.dataset.frame) || rotationFrame !== state.rotationFrame || state.dirty) {
      slot.dataset.frame = String(frame);
      state.rotationFrame = rotationFrame;
      const detail = {
        slot,
        progress,
        frame,
        rotation,
        arrivedPages: arrived,
        members: TEAM_STORY_DEMO,
        reducedMotion: reduced.matches,
      };
      if (typeof renderAtlasFrame === "function") {
        const destroy = renderAtlasFrame(detail);
        if (typeof destroy === "function") state.destroyAtlas = destroy;
      }
      element.dispatchEvent(new CustomEvent("teamstory:frame", { detail }));
    }
    state.dirty = false;
  }
  function schedule() {
    if (!state.requested && !state.disposed)
      state.requested = requestAnimationFrame(draw);
  }
  function onScroll() {
    if (state.inView) schedule();
  }
  function onResize() {
    state.dirty = true;
    schedule();
  }
  function move(direction) {
    const nextProgress =
      direction > 0
        ? (PHASES.find((p) => p > state.progress + 0.025) ?? 1)
        : ([...PHASES].reverse().find((p) => p < state.progress - 0.025) ?? 0);
    const top = element.getBoundingClientRect().top + scrollY;
    const stickyTop = parseFloat(getComputedStyle(pin).top) || 0;
    scrollTo({
      top:
        top -
        stickyTop +
        nextProgress * Math.max(1, element.offsetHeight - pin.offsetHeight),
      behavior: reduced.matches ? "instant" : "smooth",
    });
  }
  const previous = () => move(-1),
    next = () => move(1);
  const observer = new IntersectionObserver(
    ([entry]) => {
      state.inView = entry.isIntersecting;
      if (state.inView) schedule();
    },
    { rootMargin: "150px 0px" },
  );
  observer.observe(element);
  const resizeObserver = new ResizeObserver(onResize);
  resizeObserver.observe(pin);
  query(".team-story__previous").addEventListener("click", previous);
  query(".team-story__next").addEventListener("click", next);
  addEventListener("scroll", onScroll, { passive: true });
  addEventListener("resize", onResize, { passive: true });
  document.addEventListener("visibilitychange", schedule);
  reduced.addEventListener("change", onResize);
  schedule();
  const cleanup = () => {
    state.disposed = true;
    cancelAnimationFrame(state.requested);
    observer.disconnect();
    resizeObserver.disconnect();
    removeEventListener("scroll", onScroll);
    removeEventListener("resize", onResize);
    document.removeEventListener("visibilitychange", schedule);
    reduced.removeEventListener("change", onResize);
    query(".team-story__previous").removeEventListener("click", previous);
    query(".team-story__next").removeEventListener("click", next);
    state.destroyAtlas?.();
    mounts.delete(element);
  };
  mounts.set(element, cleanup);
  return cleanup;
}
