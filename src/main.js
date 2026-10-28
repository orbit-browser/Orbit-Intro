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
    img.width = 520;
    img.height = 624;
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
