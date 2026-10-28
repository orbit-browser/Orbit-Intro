import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { openChrome, sleep } from "./cdp.mjs";
const base = process.env.SITE_URL || "http://127.0.0.1:5186/Orbit-Intro/";
await mkdir("artifacts", { recursive: true });
const results = [];
for (const [name, width, height] of [
  ["desktop", 1440, 1000],
  ["tablet", 768, 1024],
  ["mobile", 390, 844],
  ["small", 320, 740],
]) {
  const c = await openChrome({ width, height });
  try {
    await c.goto(base);
    assert.equal(
      await c.evaluate("document.documentElement.dataset.ready"),
      "1",
    );
    const layout = await c.evaluate(
      "({viewport:innerWidth,scroll:document.documentElement.scrollWidth,height:document.documentElement.scrollHeight})",
    );
    assert.ok(layout.scroll <= width, `${name}: horizontal overflow`);
    const t1 = await c.evaluate(
      'getComputedStyle(document.querySelector(".orbit-ring")).transform',
    );
    await sleep(150);
    const t2 = await c.evaluate(
      'getComputedStyle(document.querySelector(".orbit-ring")).transform',
    );
    assert.notEqual(t1, t2, "hero should rotate");
    await c.evaluate('document.querySelector(".motion-toggle").click()');
    assert.equal(
      await c.evaluate(
        'getComputedStyle(document.querySelector(".orbit-ring")).animationPlayState',
      ),
      "paused",
    );
    await c.evaluate(
      'document.querySelector("#team").scrollIntoView({behavior:"instant"})',
    );
    await sleep(100);
    await c.evaluate('scrollTo({top:0,behavior:"instant"})');
    await sleep(100);
    await c.evaluate('document.querySelector(".motion-toggle").click()');
    assert.equal(
      await c.evaluate(
        'getComputedStyle(document.querySelector(".orbit-ring")).animationPlayState',
      ),
      "running",
      "resume after leaving and returning to hero",
    );
    await c.evaluate(
      'document.querySelector("#team").scrollIntoView({behavior:"instant"})',
    );
    await sleep(100);
    assert.equal(
      await c.evaluate(
        'getComputedStyle(document.querySelector(".orbit-ring")).animationPlayState',
      ),
      "paused",
      "offscreen pauses CPU work",
    );
    await c.evaluate('scrollTo({top:0,behavior:"instant"})');
    await sleep(100);
    assert.equal(
      await c.evaluate(
        'getComputedStyle(document.querySelector(".orbit-ring")).animationPlayState',
      ),
      "running",
      "on-screen resumes",
    );
    await c.evaluate('document.querySelector(".motion-toggle").click()');
    await c.evaluate('document.querySelector("#tab-capture").focus()');
    await c.send("Input.dispatchKeyEvent", {
      type: "keyDown",
      key: "ArrowRight",
      code: "ArrowRight",
    });
    assert.equal(await c.evaluate("document.activeElement.id"), "tab-search");
    assert.equal(
      await c.evaluate('document.querySelector("#panel-search").hidden'),
      false,
    );
    assert.equal(
      await c.evaluate('document.querySelector("#panel-capture").hidden'),
      true,
    );
    assert.equal(
      await c.evaluate(
        'getComputedStyle(document.querySelector("#panel-capture")).display',
      ),
      "none",
    );
    await c.send("Input.dispatchKeyEvent", {
      type: "keyDown",
      key: "End",
      code: "End",
    });
    assert.equal(await c.evaluate("document.activeElement.id"), "tab-restore");
    await c.send("Input.dispatchKeyEvent", {
      type: "keyDown",
      key: "Home",
      code: "Home",
    });
    assert.equal(await c.evaluate("document.activeElement.id"), "tab-capture");
    for (let y = 0; y < layout.height; y += height * 0.8) {
      await c.evaluate(`scrollTo({top:${y},behavior:'instant'})`);
      await sleep(70);
    }
    await c.evaluate(
      'Array.from(document.images).forEach(i=>i.loading="eager")',
    );
    await c.evaluate(
      "Promise.all(Array.from(document.images).map(i=>i.decode().catch(()=>null)))",
    );
    const broken = await c.evaluate(
      "Array.from(document.images).filter(i=>i.getAttribute('src')&&!i.naturalWidth).map(i=>i.src)",
    );
    assert.deepEqual(broken, [], `${name}: broken images`);
    const assets = await c.evaluate(
      'Promise.all([...new Set(performance.getEntriesByType("resource").map(r=>r.name).filter(n=>n.startsWith(location.origin)))].map(async url=>({url,status:(await fetch(url)).status})))',
    );
    assert.ok(
      assets.every((a) => a.status === 200),
      `${name}: resource status`,
    );
    assert.equal(
      await c.evaluate(
        'document.querySelector(".site-header").getBoundingClientRect().top',
      ),
      0,
      "header stays fixed after scrolling",
    );
    assert.deepEqual(
      await c.evaluate(
        '[...document.querySelectorAll("a[href*=github]")].map(a=>a.href).sort()',
      ),
      ["https://github.com/06-month", "https://github.com/WhiteJbb"],
    );
    await c.evaluate(
      'document.querySelector("#tab-capture").click();document.querySelector("[data-gallery=capture]").click()',
    );
    assert.equal(
      await c.evaluate('document.querySelector(".screen-viewer").open'),
      true,
    );
    await c.evaluate('document.querySelector(".viewer-image").decode()');
    assert.ok(
      await c.evaluate(
        'document.querySelector(".viewer-image").naturalWidth >= 3000',
      ),
    );
    assert.equal(
      await c.evaluate("document.activeElement.className"),
      "viewer-close",
    );
    await c.evaluate('document.querySelector(".viewer-zoom").click()');
    assert.equal(
      await c.evaluate(
        'document.querySelector(".viewer-zoom").getAttribute("aria-pressed")',
      ),
      "true",
    );
    await c.evaluate(
      'document.querySelector(".viewer-zoom").click();document.querySelector(".viewer-next").click()',
    );
    await c.evaluate('document.querySelector(".viewer-image").decode()');
    assert.equal(
      await c.evaluate(
        'document.querySelector("#screen-viewer-count").textContent',
      ),
      "2 / 2",
    );
    if (name === "desktop" || name === "mobile")
      await c.shot(`artifacts/${name}-viewer.png`);
    await c.send("Input.dispatchKeyEvent", {
      type: "keyDown",
      key: "Escape",
      code: "Escape",
      windowsVirtualKeyCode: 27,
    });
    await c.send("Input.dispatchKeyEvent", {
      type: "keyUp",
      key: "Escape",
      code: "Escape",
      windowsVirtualKeyCode: 27,
    });
    await sleep(50);
    assert.equal(
      await c.evaluate('document.querySelector(".screen-viewer").open'),
      false,
    );
    assert.equal(
      await c.evaluate("document.activeElement.dataset.gallery"),
      "capture",
    );
    await c.evaluate('scrollTo({top:0,behavior:"instant"})');
    await sleep(100);
    if (name === "desktop" || name === "mobile") {
      await c.shot(`artifacts/${name}-hero.png`);
      for (const [label, id] of [
        ["experience", "#experience"],
        ["together", "#together"],
        ["team", "#team"],
      ]) {
        await c.evaluate(
          `document.querySelector('${id}').scrollIntoView({behavior:'instant'})`,
        );
        await sleep(100);
        await c.shot(`artifacts/${name}-${label}.png`);
      }
      for (const feature of ["search", "restore"]) {
        await c.evaluate(
          `document.getElementById('tab-${feature}').click();document.querySelector('.feature-theatre').scrollIntoView({behavior:'instant'})`,
        );
        await sleep(600);
        await c.shot(`artifacts/${name}-${feature}.png`);
      }
      await c.evaluate(
        'document.querySelector("#tab-capture").click();scrollTo({top:0,behavior:"instant"})',
      );
      await sleep(600);
      const full = await c.send("Page.captureScreenshot", {
        format: "png",
        captureBeyondViewport: true,
        clip: { x: 0, y: 0, width, height: layout.height, scale: 1 },
      });
      await writeFile(
        `artifacts/${name}-full.png`,
        Buffer.from(full.data, "base64"),
      );
    }
    assert.equal(
      c.consoleLines.filter((x) => /exception|error:/.test(x)).length,
      0,
      c.consoleLines.join("\n"),
    );
    results.push({
      name,
      ...layout,
      assets: assets.length,
      brokenImages: broken.length,
      console: c.consoleLines,
      keyboard: "pass",
      pause: "pass",
    });
  } finally {
    await c.close();
  }
}
const c = await openChrome({ width: 390, height: 844 });
try {
  await c.send("Emulation.setEmulatedMedia", {
    features: [{ name: "prefers-reduced-motion", value: "reduce" }],
  });
  await c.goto(base);
  assert.equal(
    await c.evaluate(
      'document.querySelector(".motion-toggle").getAttribute("aria-pressed")',
    ),
    "true",
  );
  assert.equal(
    await c.evaluate(
      'getComputedStyle(document.querySelector(".orbit-ring")).animationName',
    ),
    "none",
  );
  await c.shot("artifacts/mobile-reduced-motion.png");
  assert.equal(
    await c.evaluate('document.querySelector(".motion-toggle").disabled'),
    true,
  );
  await c.send("Emulation.setEmulatedMedia", {
    features: [{ name: "prefers-reduced-motion", value: "no-preference" }],
  });
  await sleep(150);
  assert.equal(
    await c.evaluate(
      'getComputedStyle(document.querySelector(".orbit-ring")).animationPlayState',
    ),
    "running",
    "motion preference change resumes visible ring",
  );
  results.push({ reducedMotion: "pass" });
} finally {
  await c.close();
}
await writeFile(
  "artifacts/browser-check.json",
  JSON.stringify(
    { url: base, checkedAt: new Date().toISOString(), results },
    null,
    2,
  ),
);
console.log(JSON.stringify(results, null, 2));
