import assert from "node:assert/strict";
import { openChrome, sleep } from "./cdp.mjs";
const c = await openChrome({ width: 1440, height: 1000 });
try {
  await c.goto("http://127.0.0.1:5186/Orbit-Intro/");
  await c.evaluate(
    `document.querySelector('.atlas-demo').scrollIntoView({behavior:'instant',block:'center'})`,
  );
  await sleep(200);
  const rect = await c.evaluate(
    `(()=>{const r=document.querySelector('.atlas-demo__viewport').getBoundingClientRect();return {x:r.x+r.width*.7,y:r.y+r.height*.5}})()`,
  );
  const before = await c.evaluate(
    `document.querySelector('.atlas-demo').dataset.atlasPage`,
  );
  await c.send("Input.dispatchMouseEvent", {
    type: "mousePressed",
    x: rect.x,
    y: rect.y,
    button: "left",
    clickCount: 1,
  });
  for (let i = 1; i <= 12; i++) {
    await c.send("Input.dispatchMouseEvent", {
      type: "mouseMoved",
      x: rect.x - i * 25,
      y: rect.y,
      buttons: 1,
    });
    await sleep(16);
  }
  await sleep(150);
  await c.send("Input.dispatchMouseEvent", {
    type: "mouseReleased",
    x: rect.x - 300,
    y: rect.y,
    button: "left",
    clickCount: 1,
  });
  await sleep(900);
  const after = await c.evaluate(
    `document.querySelector('.atlas-demo').dataset.atlasPage`,
  );
  assert.notEqual(before, after);
  await c.evaluate(`document.querySelector('.atlas-demo__viewport').focus()`);
  await c.send("Input.dispatchKeyEvent", {
    type: "keyDown",
    key: "End",
    code: "End",
  });
  await sleep(850);
  assert.equal(
    await c.evaluate(`document.querySelector('.atlas-demo').dataset.atlasPage`),
    "8",
  );
  await c.shot("artifacts/interactive-atlas-desktop.png");
  await c.evaluate(
    `document.querySelector('.product-questions').scrollIntoView({behavior:'instant',block:'center'})`,
  );
  const height = () =>
    c.evaluate(
      `document.querySelector('.product-questions details').getBoundingClientRect().height`,
    );
  // First FAQ starts open. Close, then measure expansion and rapid reversal.
  if (
    await c.evaluate(
      `document.querySelector('.product-questions details').open`,
    )
  ) {
    await c.evaluate(
      `document.querySelector('.product-questions summary').click()`,
    );
    await sleep(380);
  }
  const closed = await height();
  await c.evaluate(
    `document.querySelector('.product-questions summary').click()`,
  );
  await sleep(85);
  const mid = await height();
  await sleep(350);
  const opened = await height();
  assert.ok(
    mid > closed && mid < opened,
    JSON.stringify({ closed, mid, opened }),
  );
  await c.evaluate(
    `document.querySelector('.product-questions summary').click()`,
  );
  await sleep(80);
  await c.evaluate(
    `document.querySelector('.product-questions summary').click()`,
  );
  await sleep(380);
  assert.equal(
    await c.evaluate(
      `document.querySelector('.product-questions details').open`,
    ),
    true,
  );
  await c.send("Emulation.setEmulatedMedia", {
    features: [{ name: "prefers-reduced-motion", value: "reduce" }],
  });
  await c.evaluate(
    `document.querySelector('.product-questions summary').click()`,
  );
  assert.equal(
    await c.evaluate(
      `document.querySelector('.product-questions details').open`,
    ),
    false,
  );
  console.log({
    drag: { before, after },
    faq: { closed, mid, opened },
    keyboard: "pass",
    reversal: "pass",
    reducedMotion: "pass",
  });
} finally {
  await c.close();
}
