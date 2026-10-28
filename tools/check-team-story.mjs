import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { openChrome, sleep } from './cdp.mjs';
await mkdir('artifacts', { recursive: true });
const results = [];
for (const [width, height] of [[1440, 1000], [390, 844]]) {
  const c = await openChrome({ width, height });
  try {
    await c.goto(process.env.SITE_URL || 'http://127.0.0.1:5186/Orbit-Intro/');
    const waitFor = async (expression, label) => {
      for (let i = 0; i < 200; i++) {
        if (await c.evaluate(expression)) return;
        await sleep(100);
      }
      assert.fail(label);
    };
    const place = async (selector, p) => {
      await c.evaluate(`(()=>{const s=document.querySelector('${selector}'),pin=s.querySelector('${selector}__pin');scrollTo({top:s.getBoundingClientRect().top+scrollY-parseFloat(getComputedStyle(pin).top)+(s.offsetHeight-pin.offsetHeight)*${p},behavior:'instant'})})()`);
      await waitFor(`Math.abs(+document.querySelector('${selector}').dataset.progress-${Math.min(1, Math.max(0,p))})<.005`, `${selector} native scroll progress ${p}`);
    };
    const mediaReady = async (selector) => {
      await waitFor(`(()=>{const v=document.querySelector('${selector} video');return v.readyState>=2 && !v.seeking && Math.abs(v.currentTime-(v.duration-1/30)*+v.parentElement.dataset.rotation)<.06})()`, `${selector} video seeks to scroll position`);
    };
    const teamFrame = () => c.evaluate(`+document.querySelector('.team-story__progress').getAttribute('aria-valuenow')`);
    await place('.atlas-demo', 0);
    await mediaReady('.atlas-demo');
    assert.equal(await c.evaluate(`document.querySelectorAll('.atlas-demo__card').length`), 0);
    await c.send('Input.dispatchMouseEvent', {type:'mouseWheel', x:width/2, y:height/2, deltaX:0, deltaY:800});
    await waitFor(`+document.querySelector('.atlas-demo').dataset.rotation>0`, 'wheel advances real Atlas');
    await place('.atlas-demo', .5);
    await mediaReady('.atlas-demo');
    const middle = await c.evaluate(`document.querySelector('.atlas-demo video').currentTime`);
    assert.ok(middle>1 && middle<2);
    await c.shot(`artifacts/atlas-orbit-middle-${width}.png`);
    await place('.atlas-demo', 1);
    await mediaReady('.atlas-demo');
    assert.equal(await c.evaluate(`+document.querySelector('.atlas-demo').dataset.rotation`), 1);
    await place('.atlas-demo', 1.2);
    assert.ok(await c.evaluate(`document.querySelector('.atlas-demo__pin').getBoundingClientRect().top<0`));
    await place('.atlas-demo', .2);
    await mediaReady('.atlas-demo');
    assert.ok(await c.evaluate(`document.querySelector('.atlas-demo video').currentTime`) < middle);
    await c.send('Input.dispatchKeyEvent', {type:'keyDown',key:'PageDown',code:'PageDown',windowsVirtualKeyCode:34});
    await c.send('Input.dispatchKeyEvent', {type:'keyUp',key:'PageDown',code:'PageDown',windowsVirtualKeyCode:34});
    await waitFor(`+document.querySelector('.atlas-demo').dataset.progress>.25`, 'native PageDown advances scene');
    await sleep(550); // Native PageDown has a short browser scroll animation.
    if (width === 390) {
      await place('.atlas-demo', .2);
      await c.send('Emulation.setTouchEmulationEnabled',{enabled:true,maxTouchPoints:1});
      await c.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:width/2,y:height*.75}]});
      for(let i=1;i<=8;i++) {
        await c.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:width/2,y:height*.75-i*35}]});
        await sleep(25);
      }
      await c.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
      await waitFor(`+document.querySelector('.atlas-demo').dataset.progress>.25`, 'native vertical touch scroll advances scene');
      await sleep(500);
    }
    await place('.team-story',0);
    assert.equal(await teamFrame(),0);
    await place('.team-story',.22);
    assert.equal(await teamFrame(),2);
    await place('.team-story',.53);
    assert.equal(await teamFrame(),6);
    assert.equal(await c.evaluate(`+document.querySelector('.team-story').dataset.rotation`),0);
    await waitFor(`document.querySelector('.team-story__atlas-mount > img').dataset.frame==='6'`, 'six-page capture decoded');
    await c.shot(`artifacts/team-story-collected-${width}.png`);
    await place('.team-story',.76);
    await mediaReady('.team-story');
    assert.equal(await teamFrame(),6);
    assert.equal(await c.evaluate(`document.querySelector('.team-story').dataset.phase`),'rotate');
    await c.shot(`artifacts/team-story-rotation-${width}.png`);
    await place('.team-story',1);
    await mediaReady('.team-story');
    assert.equal(await c.evaluate(`document.querySelector('.team-story').dataset.phase`),'complete');
    await place('.team-story',1.2);
    assert.ok(await c.evaluate(`document.querySelector('.team-story__pin').getBoundingClientRect().top<0`));
    await place('.team-story',.22);
    assert.equal(await teamFrame(),2);
    assert.equal(await c.evaluate(`document.querySelector('.team-story__atlas-orbit').classList.contains('is-active')`),false);
    await place('.team-story',0);
    assert.equal(await teamFrame(),0);
    // A failed media request keeps the actual-screen poster visible.
    await c.evaluate(`document.querySelector('.atlas-demo video').dispatchEvent(new Event('error'))`);
    assert.equal(await c.evaluate(`document.querySelector('.atlas-demo__media').classList.contains('has-video-frame')`),false);
    await c.send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
    await waitFor(`document.querySelector('.team-story').classList.contains('is-reduced')`, 'reduced motion settles');
    assert.equal(await teamFrame(),6);
    assert.equal(await c.evaluate(`+document.querySelector('.atlas-demo').dataset.rotation`),0);
    assert.equal(await c.evaluate('document.documentElement.scrollWidth>innerWidth'),false);
    assert.deepEqual(c.consoleLines.filter(x=>/exception|error:/.test(x)),[]);
    results.push({width,personal:'wheel/keyboard/rewind/release pass',team:'0→2→6 then one revolution, rewind/release pass',reducedMotion:'static',touch:width===390?'vertical native scroll pass':'not applicable',failure:'poster retained'});
  } finally {await c.close();}
}
await writeFile('artifacts/team-story-check.json',JSON.stringify(results,null,2));
console.log(results);
