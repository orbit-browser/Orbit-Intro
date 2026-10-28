/** Keep native details/summary semantics while animating measured content height. */
export function enhanceQuestions(container) {
  if (!container) return () => {};
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const cleanups = [];
  for (const details of container.querySelectorAll("details")) {
    const summary = details.querySelector("summary");
    let animation = null;
    let expanded = details.open;
    const settle = () => {
      animation?.cancel();
      animation = null;
      details.open = expanded;
      details.style.height = "";
      details.classList.remove("is-animating");
    };
    const toggle = (event) => {
      event.preventDefault();
      const start = details.getBoundingClientRect().height;
      expanded = animation ? !expanded : !details.open;
      animation?.cancel();
      animation = null;
      details.style.height = "";
      if (reduced.matches || typeof details.animate !== "function") {
        settle();
        return;
      }
      details.open = true;
      const style = getComputedStyle(details);
      const chrome = [
        "paddingTop",
        "paddingBottom",
        "borderTopWidth",
        "borderBottomWidth",
      ].reduce((sum, property) => sum + parseFloat(style[property] || "0"), 0);
      const end = expanded
        ? details.getBoundingClientRect().height
        : summary.getBoundingClientRect().height + chrome;
      details.classList.add("is-animating");
      details.style.height = `${start}px`;
      animation = details.animate(
        [{ height: `${start}px` }, { height: `${end}px` }],
        {
          duration: 320,
          easing: "cubic-bezier(.22,.7,.25,1)",
          fill: "forwards",
        },
      );
      animation.onfinish = settle;
    };
    summary.addEventListener("click", toggle);
    reduced.addEventListener("change", settle);
    addEventListener("resize", settle);
    cleanups.push(() => {
      settle();
      summary.removeEventListener("click", toggle);
      reduced.removeEventListener("change", settle);
      removeEventListener("resize", settle);
    });
  }
  return () => cleanups.forEach((cleanup) => cleanup());
}
