import { openChrome, sleep } from "./cdp.mjs";
import assert from 'node:assert/strict';
import { mkdir, writeFile } from "node:fs/promises";
await mkdir("artifacts/team-atlas-frames", { recursive: true });
const preview = process.env.ATLAS_PREVIEW_BASE ?? 'http://127.0.0.1:5213';
const c = await openChrome({ width: 1600, height: 760, scale: 2 });
try {
  for (let frame = 0; frame <= 6; frame++) {
    await c.goto(
      `${preview}/preview/newtab.html?scope=w-team-stream&theme=light&snapshots=on&teamStoryFrame=${frame}#/orbit-atlas?session=s-team-stream-u-me`,
      { readyFlag: false, settle: 2500 },
    );
    for (let attempt = 0; attempt < 150; attempt++) {
      if (await c.evaluate(`!document.body.innerText.includes('탐색 기록을 불러오는 중') && (document.body.innerText.includes('현재 세션') || document.body.innerText.includes('아직 팀 탐색 세션이 없어요')) || !!document.querySelector('.atlas-gallery')`)) break;
      if (attempt === 149) throw new Error('Team fixture did not load');
      await sleep(200);
    }
    await c.evaluate(`document.fonts.ready`);
    await sleep(700);
    if (frame > 0) {
      for (let attempt=0;attempt<150;attempt++) {
        if (await c.evaluate(`document.querySelectorAll('.atlas-gallery__capture').length===${frame} && [...document.querySelectorAll('.atlas-gallery__capture')].every(i=>i.complete&&i.naturalWidth>0)`)) break;
        if (attempt===149) throw new Error('Team demo must render loaded unified cards');
        await sleep(150);
      }
    }
    await c.evaluate(
      `[...document.querySelectorAll('button')].find(b=>b.textContent.trim()==='다시 보지 않기')?.click()`,
    );
    await sleep(200);
    const checks = await c.evaluate(
      `({layout:document.querySelector('.atlas-gallery--unified')?'unified-cards':'empty',cardCount:document.querySelectorAll('.atlas-gallery__card').length,body:document.body.innerText,images:[...document.images].map(i=>({src:i.currentSrc,w:i.naturalWidth,h:i.naturalHeight}))})`,
    );
    assert.equal(checks.cardCount, frame);
    assert.equal(checks.layout, frame ? 'unified-cards' : 'empty');
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
