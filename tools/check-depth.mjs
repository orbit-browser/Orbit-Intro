import assert from "node:assert/strict";
import { writeFile } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { openChrome, sleep } from "./cdp.mjs";
const results = [];
for (const width of [1440, 390]) {
  const c = await openChrome({ width, height: 900 });
  try {
    await c.goto(process.env.SITE_URL || "http://127.0.0.1:5186/Orbit-Intro/");
    await c.evaluate(
      `scrollTo({top:document.querySelector('.orbit-stage').offsetTop-110,behavior:'instant'}); document.querySelector('.orbit-ring').style.animation='none'; document.querySelector('.hero-orbit-word').style.pointerEvents='auto';`,
    );
    await sleep(150);
    let front = 0,
      back = 0,
      wrong = 0;
    for (const angle of [15, 60, 105, 195]) {
      await c.evaluate(
        `document.querySelector('.orbit-ring').style.transform='rotateY(${angle}deg)'`,
      );
      const sample = await c.evaluate(`(() => {
    const word=document.querySelector('.hero-orbit-word'),r=word.getBoundingClientRect(),plane=document.querySelector('.orbit-plane'),ring=document.querySelector('.orbit-ring');
    const world=new DOMMatrix(getComputedStyle(plane).transform).multiply(new DOMMatrix(getComputedStyle(ring).transform));
    let front=0,back=0,wrong=0; const points=[];
    for(let y=Math.ceil(r.top);y<r.bottom;y+=5)for(let x=Math.ceil(r.left);x<r.right;x+=5){
     if(x<0||x>=innerWidth||y<86||y>=innerHeight)continue;
     const stack=document.elementsFromPoint(x,y), wi=stack.findIndex(e=>e===word||e.parentElement===word), ci=stack.findIndex(e=>e.closest('.orbit-face'));
     if(wi<0||ci<0)continue;
     const card=stack[ci].closest('.orbit-card'),z=world.multiply(new DOMMatrix(getComputedStyle(card).transform)).m43;
     if(Math.abs(z)<120)continue;
     points.push({x,y,front:z>0}); if(z>0)front++;else back++;
    }
    return {front,back,points};
   })()`);

      await writeFile(
        `artifacts/depth-points-${width}-${angle}.json`,
        JSON.stringify(sample.points),
      );
      await c.evaluate(
        `(()=>{const st=document.createElement('style');st.id='depth-probe';st.textContent='.hero-orbit-word,.hero-orbit-word span{color:#ff00ff!important;background:#ff00ff!important}.orbit-face{background:#00ff00!important}.orbit-face img{visibility:hidden!important}';document.head.append(st);})()`,
      );
      await c.shot(`artifacts/depth-probe-${width}-${angle}.png`);
      await c.evaluate("document.querySelector('#depth-probe').remove()");
      const pixel = JSON.parse(
        execFileSync(
          process.env.PYTHON || "python3",
          [
            "tools/check-depth-pixels.py",
            `artifacts/depth-probe-${width}-${angle}.png`,
            `artifacts/depth-points-${width}-${angle}.json`,
          ],
          { encoding: "utf8" },
        ),
      );
      front += pixel.front;
      back += pixel.back;
      wrong += pixel.wrong;
      if ([15, 60].includes(angle))
        await c.shot(`artifacts/depth-${width}-${angle}.png`);
    }
    assert.ok(
      front > 0 && back > 0,
      `width ${width}: need both intersections ${JSON.stringify({ front, back, wrong })}`,
    );
    assert.equal(wrong, 0, `width ${width}: incorrect occlusion`);
    results.push({
      width,
      frontSamples: front,
      backSamples: back,
      incorrectSamples: wrong,
    });
  } finally {
    await c.close();
  }
}
await writeFile("artifacts/depth-check.json", JSON.stringify(results, null, 2));
console.log(results);
