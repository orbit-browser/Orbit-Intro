const root = document.documentElement;
root.classList.add("js");
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
const state = {
  paused: reducedMotion.matches,
  scheduled: false,
  ringVisible: false,
};
const pages = [
  ["seongsan", "성산일출봉"],
  ["dining", "제주 카페"],
  ["flight", "제주 항공권"],
  ["saebyeol", "새별오름"],
  ["udo", "우도"],
  ["hallasan", "한라산"],
  ["route", "제주 여행 동선"],
  ["seopjikoji", "섭지코지"],
];
const ring = document.querySelector(".orbit-ring");
for (const [i, [id, title]] of pages.entries()) {
  const card = document.createElement("div");
  card.className = "orbit-card";
  card.style.setProperty("--angle", `${(i * 360) / pages.length}deg`);
  for (const side of ["front", "back"]) {
    const face = document.createElement("div");
    face.className = `orbit-face ${side}`;
    const img = document.createElement("img");
    img.src = `./assets/pages/${id}.webp`;
    img.alt = title;
    img.width = 720;
    img.height = 864;
    img.decoding = "async";
    face.append(img);
    card.append(face);
  }
  ring.append(card);
}
const motionButton = document.querySelector(".motion-toggle");
function syncRingMotion() {
  ring.style.animationPlayState =
    state.ringVisible && !state.paused && !document.hidden
      ? "running"
      : "paused";
}
function applyMotion() {
  root.classList.toggle("motion-paused", state.paused);
  motionButton.setAttribute("aria-pressed", String(state.paused));
  motionButton.disabled = reducedMotion.matches;
  motionButton.querySelector(".motion-label").textContent =
    reducedMotion.matches
      ? "동작 줄이기 적용"
      : state.paused
        ? "움직임 켜기"
        : "움직임 멈추기";
  motionButton.querySelector(".motion-icon").textContent = state.paused
    ? "▷"
    : "Ⅱ";
  syncRingMotion();
  updateScroll();
}
motionButton.addEventListener("click", () => {
  state.paused = !state.paused;
  applyMotion();
});
reducedMotion.addEventListener("change", () => {
  state.paused = reducedMotion.matches;
  applyMotion();
});
const heroStage = document.querySelector(".orbit-stage");
const windows = [...document.querySelectorAll(".scroll-window")];
function updateScroll() {
  state.scheduled = false;
  if (state.paused) return;
  const height = innerHeight;
  const rect = heroStage.getBoundingClientRect();
  const progress = Math.max(
    0,
    Math.min(1, (height - rect.top) / (height + rect.height)),
  );
  heroStage.style.setProperty("--plane-x", `${-28 + progress * 13}deg`);
  heroStage.style.setProperty("--plane-z", `${-12 + progress * 7}deg`);
  for (const el of windows) {
    const r = el.getBoundingClientRect();
    const p = Math.max(0, Math.min(1, (height - r.top) / (height * 0.7)));
    el.style.setProperty("--progress", p.toFixed(4));
  }
}
function scheduleScroll() {
  if (!state.scheduled) {
    state.scheduled = true;
    requestAnimationFrame(updateScroll);
  }
}
addEventListener("scroll", scheduleScroll, { passive: true });
addEventListener("resize", scheduleScroll, { passive: true });
const revealObserver = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        revealObserver.unobserve(entry.target);
      }
    }
  },
  { threshold: 0.12 },
);
for (const el of document.querySelectorAll(".reveal"))
  revealObserver.observe(el);
const ringObserver = new IntersectionObserver(
  ([entry]) => {
    state.ringVisible = entry.isIntersecting;
    syncRingMotion();
  },
  { threshold: 0 },
);
ringObserver.observe(heroStage);
document.addEventListener("visibilitychange", syncRingMotion);
const tabs = [...document.querySelectorAll("[role=tab]")];
function activateTab(tab, { focus = false } = {}) {
  for (const current of tabs) {
    const selected = current === tab;
    current.setAttribute("aria-selected", String(selected));
    current.tabIndex = selected ? 0 : -1;
    document.getElementById(current.getAttribute("aria-controls")).hidden =
      !selected;
  }
  if (focus) tab.focus();
  scheduleScroll();
}
for (const [i, tab] of tabs.entries()) {
  tab.addEventListener("click", () => activateTab(tab));
  tab.addEventListener("keydown", (event) => {
    let next;
    if (event.key === "ArrowRight") next = (i + 1) % tabs.length;
    if (event.key === "ArrowLeft") next = (i + tabs.length - 1) % tabs.length;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = tabs.length - 1;
    if (next !== undefined) {
      event.preventDefault();
      activateTab(tabs[next], { focus: true });
    }
  });
}
applyMotion();
await document.fonts.ready;
root.dataset.ready = "1";

// Product detail uses original capture derivatives, loaded only when requested.
const viewer = document.querySelector(".screen-viewer");
const viewerImage = viewer.querySelector(".viewer-image");
const viewerViewport = viewer.querySelector(".viewer-viewport");
const viewerStatus = viewer.querySelector(".viewer-status");
const zoomButton = viewer.querySelector(".viewer-zoom");
let gallery = [];
let imageIndex = 0;
let viewerTrigger = null;
let imageRequest = 0;
const gallerySelectors = {
  capture: ".capture-composition img",
  search: ".search-composition img",
  restore: ".restore-composition img",
  team: ".team-screen-pair img",
};
function resetZoom() {
  viewerViewport.classList.remove("is-zoomed");
  zoomButton.setAttribute("aria-pressed", "false");
  zoomButton.textContent = "확대";
  viewerViewport.scrollTo(0, 0);
}
async function showScreen(index) {
  imageIndex = (index + gallery.length) % gallery.length;
  const source = gallery[imageIndex];
  const request = ++imageRequest;
  resetZoom();
  viewerStatus.hidden = false;
  viewerStatus.textContent = "불러오는 중";
  viewerImage.hidden = true;
  viewerImage.alt = source.alt;
  viewer.querySelector("#screen-viewer-title").textContent = source.alt;
  viewer.querySelector("#screen-viewer-count").textContent =
    `${imageIndex + 1} / ${gallery.length}`;
  viewer.querySelector(".viewer-prev").disabled = gallery.length < 2;
  viewer.querySelector(".viewer-next").disabled = gallery.length < 2;
  viewerImage.src = source.dataset.detail;
  try {
    await viewerImage.decode();
    if (request !== imageRequest) return;
    viewerStatus.hidden = true;
    viewerImage.hidden = false;
  } catch {
    if (request === imageRequest)
      viewerStatus.textContent =
        "화면을 불러오지 못했습니다. 다시 열어 주세요.";
  }
}
for (const trigger of document.querySelectorAll("[data-gallery]")) {
  trigger.addEventListener("click", () => {
    viewerTrigger = trigger;
    gallery = [
      ...document.querySelectorAll(gallerySelectors[trigger.dataset.gallery]),
    ];
    viewer.showModal();
    document.body.classList.add("viewer-open");
    viewer.querySelector(".viewer-close").focus();
    showScreen(0);
  });
}
viewer
  .querySelector(".viewer-close")
  .addEventListener("click", () => viewer.close());
viewer
  .querySelector(".viewer-prev")
  .addEventListener("click", () => showScreen(imageIndex - 1));
viewer
  .querySelector(".viewer-next")
  .addEventListener("click", () => showScreen(imageIndex + 1));
zoomButton.addEventListener("click", () => {
  const zoomed = viewerViewport.classList.toggle("is-zoomed");
  zoomButton.setAttribute("aria-pressed", String(zoomed));
  zoomButton.textContent = zoomed ? "축소" : "확대";
});
viewer.addEventListener("close", () => {
  imageRequest += 1;
  document.body.classList.remove("viewer-open");
  viewerTrigger?.focus({ preventScroll: true });
});
viewer.addEventListener("keydown", (event) => {
  if (viewerViewport.classList.contains("is-zoomed")) return;
  if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
    event.preventDefault();
    showScreen(imageIndex + (event.key === "ArrowRight" ? 1 : -1));
  }
});
