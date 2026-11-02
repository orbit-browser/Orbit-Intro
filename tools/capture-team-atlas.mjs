import { openChrome, sleep } from "./cdp.mjs";
import { mkdir, writeFile } from "node:fs/promises";
await mkdir("artifacts/team-atlas-frames", { recursive: true });
const preview = process.env.ATLAS_PREVIEW_BASE ?? 'http://127.0.0.1:5213';
const c = await openChrome({ width: 1600, height: 760, scale: 2 });
try {
  for (let frame = 0; frame <= 6; frame++) {
    await c.goto(
      `${preview}/preview/newtab.html?scope=w-team-stream&theme=light&snapshots=off&teamStoryFrame=${frame}#/orbit-atlas?session=s-team-stream-u-me`,
      { readyFlag: false, settle: 2500 },
    );
    for (let attempt = 0; attempt < 150; attempt++) {
      if (await c.evaluate(`!document.body.innerText.includes('탐색 기록을 불러오는 중') && (document.body.innerText.includes('현재 세션') || document.body.innerText.includes('아직 팀 탐색 세션이 없어요')) || !!document.querySelector('.atlas-gallery')`)) break;
      if (attempt === 149) throw new Error('Team fixture did not load');
      await sleep(200);
    }
    await c.evaluate(`document.fonts.ready`);
    await sleep(700);
    if (await c.evaluate("document.querySelectorAll('.atlas-gallery__capture').length")) throw new Error('Do not imply remote team screenshot storage');
    await c.evaluate(
      `[...document.querySelectorAll('button')].find(b=>b.textContent.trim()==='다시 보지 않기')?.click()`,
    );
    await sleep(200);
    if (frame === 6) {
      await c.evaluate("document.querySelector('[aria-label=\"다음 페이지\"]').click()");
      await sleep(700);
    }
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
  await c.shot('artifacts/current-product/team-atlas.png');
} finally {
  await c.close();
}
