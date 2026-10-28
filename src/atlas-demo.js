const PAGES = [
  ["seongsan", "성산일출봉"],
  ["dining", "제주 카페"],
  ["flight", "제주 항공권"],
  ["saebyeol", "새별오름"],
  ["udo", "우도"],
  ["hallasan", "한라산"],
  ["route", "제주 여행 동선"],
  ["seopjikoji", "섭지코지"],
];
const COUNT = PAGES.length;
const DRAG_SLOP = 8;
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const wrap = (value) => ((value % COUNT) + COUNT) % COUNT;
const ringDelta = (position, index) =>
  wrap(index - position + COUNT / 2) - COUNT / 2;
let instanceCount = 0;

/** Mount a local, explicitly labelled example of Atlas page exploration. */
export function mountAtlasDemo(element) {
  if (!element || element.dataset.atlasMounted) return () => {};
  element.dataset.atlasMounted = "true";
  const id = `atlas-demo-${++instanceCount}`;
  const abort = new AbortController();
  const { signal } = abort;
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  element.innerHTML = `
    <div class="atlas-demo__topbar">
      <span class="atlas-demo__brand"><svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><rect x="2" y="2" width="6" height="6" rx="1"/><rect x="12" y="2" width="6" height="6" rx="1"/><rect x="2" y="12" width="6" height="6" rx="1"/><rect x="12" y="12" width="6" height="6" rx="1"/></svg>Orbit Atlas</span>
      <span class="atlas-demo__demo-label">시연</span>
    </div>
    <div class="atlas-demo__session">
      <div class="atlas-demo__session-name"><span class="atlas-demo__session-dot" aria-hidden="true"></span><h3>제주 여행 준비</h3><span class="atlas-demo__page-total">페이지 8개</span></div>
      <p class="atlas-demo__hint" id="${id}-hint"><span aria-hidden="true">↔</span> 좌우로 드래그해 보세요</p>
    </div>
    <div class="atlas-demo__viewport" id="${id}-viewport" tabindex="0" role="region" aria-roledescription="캐러셀" aria-label="제주 여행 준비 페이지 갤러리" aria-describedby="${id}-keyboard">
      <div class="atlas-demo__strip"></div>
    </div>
    <div class="atlas-demo__selection">
      <div class="atlas-demo__selected"><span class="atlas-demo__count"></span><strong class="atlas-demo__title"></strong></div>
      <div class="atlas-demo__controls">
        <button class="atlas-demo__arrow atlas-demo__previous" type="button" aria-label="이전 페이지" aria-controls="${id}-viewport"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m14 6-6 6 6 6M8 12h12"/></svg></button>
        <div class="atlas-demo__pagination" role="group" aria-label="페이지 선택"></div>
        <button class="atlas-demo__arrow atlas-demo__next" type="button" aria-label="다음 페이지" aria-controls="${id}-viewport"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m10 6 6 6-6 6M16 12H4"/></svg></button>
      </div>
    </div>
    <div class="atlas-demo__footnote"><span>공개 페이지 8개로 구성한 시연입니다.</span><span class="atlas-demo__keyboard-cue" aria-hidden="true">← → 키로도 넘길 수 있어요</span></div>
    <p class="atlas-demo__sr-only" id="${id}-keyboard">좌우로 드래그하거나 왼쪽·오른쪽 방향키로 페이지를 선택하세요. Home은 첫 페이지, End는 마지막 페이지로 이동합니다.</p>
    <p class="atlas-demo__sr-only atlas-demo__announcement" role="status" aria-live="polite" aria-atomic="true"></p>
  `;
  const viewport = element.querySelector(".atlas-demo__viewport");
  const strip = element.querySelector(".atlas-demo__strip");
  const pagination = element.querySelector(".atlas-demo__pagination");
  const countLabel = element.querySelector(".atlas-demo__count");
  const titleLabel = element.querySelector(".atlas-demo__title");
  const announcement = element.querySelector(".atlas-demo__announcement");
  const cards = [];
  const markers = [];
  let width = 0;
  let cardWidth = 0;
  let spacing = 0;
  let position = 0;
  let selectedIndex = -1;
  let frame = 0;
  let animation = null;
  let pointer = null;
  let suppressClick = false;
  let clickReset = 0;

  for (const [index, [slug, title]] of PAGES.entries()) {
    const card = document.createElement("button");
    card.className = "atlas-demo__card";
    card.type = "button";
    card.tabIndex = -1;
    card.setAttribute("aria-label", `${index + 1}. ${title} 선택`);
    const image = document.createElement("img");
    image.src = new URL(`./assets/pages/${slug}.webp`, import.meta.url).href;
    image.alt = "";
    image.width = 720;
    image.height = 864;
    image.loading = "lazy";
    image.decoding = "async";
    image.draggable = false;
    card.append(image);
    image.addEventListener(
      "error",
      () => {
        image.hidden = true;
        card.classList.add("is-unavailable");
        const message = document.createElement("span");
        message.textContent = `${title} — 페이지 화면을 불러오지 못했습니다.`;
        card.append(message);
      },
      { once: true, signal },
    );
    card.addEventListener("click", () => selectIndex(index), { signal });
    strip.append(card);
    cards.push(card);

    const marker = document.createElement("button");
    marker.className = "atlas-demo__marker";
    marker.type = "button";
    marker.setAttribute("aria-label", `${index + 1}. ${title}`);
    marker.setAttribute("aria-controls", `${id}-viewport`);
    marker.addEventListener("click", () => selectIndex(index), { signal });
    pagination.append(marker);
    markers.push(marker);
  }

  function updateSelection(index) {
    if (index === selectedIndex) return;
    selectedIndex = index;
    countLabel.textContent = `${String(index + 1).padStart(2, "0")} / 08`;
    titleLabel.textContent = PAGES[index][1];
    element.dataset.atlasPage = String(index + 1);
    cards.forEach((card, i) => {
      const current = i === index;
      card.classList.toggle("is-current", current);
      card.setAttribute("aria-current", String(current));
      markers[i].setAttribute("aria-current", String(current));
    });
  }

  function render() {
    const depthWidth = Math.max(width / 1.55, cardWidth * 2.1);
    cards.forEach((card, index) => {
      // Each page has one card. Only the hidden back seam wraps to the other side.
      const away = ringDelta(position, index);
      const x = away * spacing;
      const progress = x / depthWidth;
      const seam = clamp((COUNT / 2 - Math.abs(away)) / 0.65, 0, 1);
      const opacity =
        (1 - Math.min(0.72, Math.abs(progress) ** 1.5 * 0.32)) * seam;
      card.style.transform = `translate3d(${x.toFixed(2)}px, 0, ${(-(progress ** 2) * 460).toFixed(2)}px) rotateY(${(progress * 40).toFixed(2)}deg)`;
      card.style.opacity = opacity.toFixed(3);
      card.style.visibility = opacity < 0.015 ? "hidden" : "visible";
      card.style.pointerEvents = opacity < 0.08 ? "none" : "auto";
    });
    updateSelection(wrap(Math.round(position)));
  }

  function settle() {
    position = wrap(Math.round(position));
    animation = null;
    frame = 0;
    render();
    announcement.textContent = `${selectedIndex + 1} / ${COUNT}, ${PAGES[selectedIndex][1]}`;
  }

  function stopAnimation() {
    cancelAnimationFrame(frame);
    frame = 0;
    animation = null;
  }

  function step(now) {
    if (!animation) return;
    const progress = clamp(
      (now - animation.started) / animation.duration,
      0,
      1,
    );
    position =
      animation.from +
      (animation.to - animation.from) * (1 - (1 - progress) ** 3);
    render();
    if (progress === 1) settle();
    else frame = requestAnimationFrame(step);
  }

  function moveTo(target, immediate = false) {
    stopAnimation();
    if (
      immediate ||
      reducedMotion.matches ||
      Math.abs(target - position) < 0.002
    ) {
      position = target;
      settle();
      return;
    }
    animation = {
      from: position,
      to: target,
      started: performance.now(),
      duration: clamp(270 + Math.abs(target - position) * 70, 320, 760),
    };
    frame = requestAnimationFrame(step);
  }

  function selectIndex(index) {
    const from = animation?.to ?? position;
    moveTo(from + ringDelta(from, index));
  }

  function shift(direction) {
    moveTo(Math.round(animation?.to ?? position) + direction);
  }

  function blockDragClick() {
    suppressClick = true;
    clearTimeout(clickReset);
    clickReset = setTimeout(() => {
      suppressClick = false;
    }, 500);
  }

  function finishPointer(cancelled = false) {
    if (!pointer) return;
    const ending = pointer;
    pointer = null;
    element.classList.remove("is-dragging");
    if (viewport.hasPointerCapture(ending.id))
      viewport.releasePointerCapture(ending.id);
    const wasDragged = ending.phase === "dragging";
    if (wasDragged || ending.moved) blockDragClick();
    const velocity =
      !cancelled &&
      !reducedMotion.matches &&
      performance.now() - ending.lastTime < 100
        ? ending.velocity
        : 0;
    const momentum = wasDragged ? clamp(velocity * 180, -5, 5) : 0;
    moveTo(Math.round(position + momentum), cancelled);
  }

  viewport.addEventListener(
    "pointerdown",
    (event) => {
      if (!event.isPrimary || event.button !== 0 || pointer) return;
      stopAnimation();
      clearTimeout(clickReset);
      suppressClick = false;
      pointer = {
        id: event.pointerId,
        phase: "pending",
        startX: event.clientX,
        startY: event.clientY,
        lastX: event.clientX,
        lastTime: performance.now(),
        velocity: 0,
        moved: false,
      };
    },
    { signal },
  );

  window.addEventListener(
    "pointermove",
    (event) => {
      if (!pointer || event.pointerId !== pointer.id) return;
      const dx = event.clientX - pointer.startX;
      const dy = event.clientY - pointer.startY;
      if (Math.hypot(dx, dy) > DRAG_SLOP) pointer.moved = true;
      if (pointer.phase === "pending") {
        if (Math.abs(dy) > DRAG_SLOP && Math.abs(dy) >= Math.abs(dx)) {
          // Leave vertical scrolling to the browser; no capture or preventDefault.
          finishPointer(true);
          return;
        }
        if (Math.abs(dx) <= DRAG_SLOP || Math.abs(dx) <= Math.abs(dy) * 1.15)
          return;
        pointer.phase = "dragging";
        viewport.setPointerCapture(event.pointerId);
        viewport.focus({ preventScroll: true });
        element.classList.add("is-dragging");
      }
      if (event.cancelable) event.preventDefault();
      const now = performance.now();
      const delta = (-(event.clientX - pointer.lastX) * 1.6) / spacing;
      const speed = delta / Math.max(8, now - pointer.lastTime);
      pointer.velocity = clamp(
        pointer.velocity * 0.25 + speed * 0.75,
        -0.035,
        0.035,
      );
      pointer.lastX = event.clientX;
      pointer.lastTime = now;
      position += delta;
      render();
    },
    { passive: false, signal },
  );

  window.addEventListener(
    "pointerup",
    (event) => {
      if (event.pointerId === pointer?.id) finishPointer();
    },
    { signal },
  );
  window.addEventListener(
    "pointercancel",
    (event) => {
      if (event.pointerId === pointer?.id) finishPointer(true);
    },
    { signal },
  );
  viewport.addEventListener(
    "lostpointercapture",
    (event) => {
      // Touch starts with implicit capture on the card; transferring it to the
      // viewport bubbles the card's lost event without ending the gesture.
      if (event.target === viewport && event.pointerId === pointer?.id)
        finishPointer(true);
    },
    { signal },
  );
  viewport.addEventListener("dragstart", (event) => event.preventDefault(), {
    signal,
  });
  viewport.addEventListener(
    "click",
    (event) => {
      if (suppressClick && event.detail !== 0) {
        event.preventDefault();
        event.stopImmediatePropagation();
        suppressClick = false;
      }
    },
    { capture: true, signal },
  );

  element
    .querySelector(".atlas-demo__previous")
    .addEventListener("click", () => shift(-1), { signal });
  element
    .querySelector(".atlas-demo__next")
    .addEventListener("click", () => shift(1), { signal });
  element.addEventListener(
    "keydown",
    (event) => {
      if (event.altKey || event.ctrlKey || event.metaKey) return;
      if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key))
        return;
      event.preventDefault();
      finishPointer(true);
      if (event.key === "Home") selectIndex(0);
      else if (event.key === "End") selectIndex(COUNT - 1);
      else shift(event.key === "ArrowRight" ? 1 : -1);
    },
    { signal },
  );

  function pause() {
    finishPointer(true);
    if (animation) moveTo(Math.round(position), true);
  }
  window.addEventListener("blur", pause, { signal });
  document.addEventListener(
    "visibilitychange",
    () => {
      if (document.hidden) pause();
    },
    { signal },
  );
  reducedMotion.addEventListener(
    "change",
    () => {
      if (reducedMotion.matches) pause();
    },
    { signal },
  );

  function measure() {
    width = Math.max(1, viewport.clientWidth);
    cardWidth = clamp(width * 0.23, 160, 260);
    spacing = cardWidth * 1.02;
    viewport.style.setProperty("--atlas-card-width", `${cardWidth}px`);
    render();
  }
  const resize = new ResizeObserver(measure);
  resize.observe(viewport);
  measure();

  return () => {
    abort.abort();
    resize.disconnect();
    stopAnimation();
    clearTimeout(clickReset);
    if (pointer && viewport.hasPointerCapture(pointer.id))
      viewport.releasePointerCapture(pointer.id);
    element.classList.remove("is-dragging");
    delete element.dataset.atlasMounted;
    delete element.dataset.atlasPage;
    element.replaceChildren();
  };
}
