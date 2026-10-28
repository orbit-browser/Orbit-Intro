import assert from "node:assert/strict";
import { writeFile } from "node:fs/promises";
import { openChrome, sleep } from "./cdp.mjs";
const results = [];
for (const [width, height] of [
  [1440, 1000],
  [390, 844],
]) {
  const c = await openChrome({ width, height });
  try {
    await c.goto(process.env.SITE_URL || "http://127.0.0.1:5186/Orbit-Intro/");
    const place = async (p) => {
      await c.evaluate(
        `(()=>{const s=document.querySelector('.team-story'),pin=s.querySelector('.team-story__pin');scrollTo({top:s.getBoundingClientRect().top+scrollY-parseFloat(getComputedStyle(pin).top)+(s.offsetHeight-pin.offsetHeight)*${p},behavior:'instant'})})()`,
      );
      await sleep(250);
    };
    const frame = () =>
      c.evaluate(
        `+document.querySelector('.team-story__progress').getAttribute('aria-valuenow')`,
      );
    await place(0);
    assert.equal(await frame(), 0);
    await c.send("Input.dispatchMouseEvent", {
      type: "mouseWheel",
      x: width / 2,
      y: height / 2,
      deltaX: 0,
      deltaY: 1000,
    });
    await sleep(400);
    assert.ok((await frame()) > 0);
    await place(0.9);
    assert.equal(await frame(), 6);
    // Published frames decode asynchronously; keep testing the requested frame,
    // not a previous frame retained while the network request is in flight.
    for (let i = 0; i < 80; i++) {
      if (
        await c.evaluate(
          `document.querySelector('.team-story__atlas-mount img').src.endsWith('frame-6.webp')`,
        )
      )
        break;
      await sleep(100);
    }
    await c.evaluate(
      `document.querySelector('.team-story__atlas-mount img').decode()`,
    );
    assert.ok(
      await c.evaluate(
        `document.querySelector('.team-story__atlas-mount img').src.endsWith('frame-6.webp')`,
      ),
    );
    await c.shot(`artifacts/team-story-final-${width}.png`);
    await place(0.36);
    assert.equal(await frame(), 1);
    await place(0);
    assert.equal(await frame(), 0);
    if (width === 390) {
      await c.send("Emulation.setTouchEmulationEnabled", {
        enabled: true,
        maxTouchPoints: 1,
      });
      await c.evaluate(
        `document.querySelector('.atlas-demo').scrollIntoView({behavior:'instant',block:'center'})`,
      );
      await sleep(200);
      const { x, y } = await c.evaluate(
        `(()=>{const r=document.querySelector('.atlas-demo__viewport').getBoundingClientRect();return{x:r.left+r.width*.8,y:r.top+r.height*.45}})()`,
      );
      await c.send("Input.dispatchTouchEvent", {
        type: "touchStart",
        touchPoints: [{ x, y }],
      });
      for (let i = 1; i <= 10; i++) {
        await c.send("Input.dispatchTouchEvent", {
          type: "touchMove",
          touchPoints: [{ x: x - i * 20, y }],
        });
        await sleep(20);
      }
      await sleep(150);
      await c.send("Input.dispatchTouchEvent", {
        type: "touchEnd",
        touchPoints: [],
      });
      await sleep(850);
      assert.notEqual(
        await c.evaluate(
          `document.querySelector('.atlas-demo').dataset.atlasPage`,
        ),
        "1",
      );
    }
    await c.send("Emulation.setEmulatedMedia", {
      features: [{ name: "prefers-reduced-motion", value: "reduce" }],
    });
    await sleep(200);
    assert.equal(await frame(), 6);
    assert.equal(
      await c.evaluate("document.documentElement.scrollWidth>innerWidth"),
      false,
    );
    assert.deepEqual(
      c.consoleLines.filter((x) => /exception|error:/.test(x)),
      [],
    );
    results.push({
      width,
      wheel: "pass",
      frames: "0→6→1→0",
      reducedMotion: "6",
      touch: width === 390 ? "pass" : "not applicable",
    });
  } finally {
    await c.close();
  }
}
await writeFile(
  "artifacts/team-story-check.json",
  JSON.stringify(results, null, 2),
);
console.log(results);
