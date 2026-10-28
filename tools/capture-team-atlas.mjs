import { openChrome, sleep } from "./cdp.mjs";
import { mkdir, writeFile } from "node:fs/promises";
await mkdir("artifacts/team-atlas-frames", { recursive: true });
const c = await openChrome({ width: 1600, height: 760, scale: 2 });
try {
  for (let frame = 0; frame <= 6; frame++) {
    await c.goto(
      `http://127.0.0.1:5187/preview/newtab.html?scope=w-team-stream&theme=light&teamStoryFrame=${frame}#/orbit-atlas?session=s-team-stream-u-me`,
      { readyFlag: false, settle: 2500 },
    );
    await c.evaluate(`document.fonts.ready`);
    await c.evaluate(
      `[...document.querySelectorAll('button')].find(b=>b.textContent.trim()==='다시 보지 않기')?.click()`,
    );
    await sleep(200);
    const checks = await c.evaluate(
      `({body:document.body.innerText,images:[...document.images].map(i=>({src:i.currentSrc,w:i.naturalWidth,h:i.naturalHeight}))})`,
    );
    await c.shot(`artifacts/team-atlas-frames/frame-${frame}.png`);
    await writeFile(
      `artifacts/team-atlas-frames/frame-${frame}.json`,
      JSON.stringify(checks, null, 2),
    );
    console.log(
      "frame",
      frame,
      "images",
      checks.images.filter((i) => i.w > 0).length,
    );
  }
  await c.send("Emulation.setDeviceMetricsOverride", {
    width: 1440,
    height: 1000,
    deviceScaleFactor: 3,
    mobile: false,
  });
  console.log(
    await c.evaluate(
      `[...document.querySelectorAll('button')].map(b=>({text:b.textContent.slice(0,30),aria:b.getAttribute('aria-label'),title:b.title})).slice(0,12)`,
    ),
  );
  await c.shot("artifacts/team-atlas-frames/banner-joint-atlas.png");
} finally {
  await c.close();
}
