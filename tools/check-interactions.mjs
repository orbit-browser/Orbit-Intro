import assert from "node:assert/strict";
import { openChrome, sleep } from "./cdp.mjs";
const c = await openChrome({ width: 1440, height: 1000 });
try {
  await c.goto("http://127.0.0.1:5186/Orbit-Intro/");
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
    faq: { closed, mid, opened },
    reversal: "pass",
    reducedMotion: "pass",
  });
} finally {
  await c.close();
}
