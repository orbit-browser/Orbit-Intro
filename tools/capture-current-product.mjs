import { openChrome, sleep } from './cdp.mjs';
import { mkdir, writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';

// Read-only product preview: isolated synthetic records, no authenticated browser profile.
const base = process.env.ATLAS_PREVIEW_BASE ?? 'http://127.0.0.1:5213';
const out = 'artifacts/current-product';
await mkdir(out, { recursive: true });
const c = await openChrome({ width: 1600, height: 1000, scale: 2 });
const captures = [];
async function wait(expression) {
  for (let i = 0; i < 150; i++) {
    if (await c.evaluate(expression)) return;
    await sleep(200);
  }
  throw new Error(`Product did not become ready: ${expression}`);
}
async function visit(path, expression) {
  await c.goto(base + path, { readyFlag: false, settle: 500 });
  await wait(expression);
  await c.evaluate('document.fonts.ready');
  await sleep(1000);
}
async function shot(name, selector) {
  const clip = selector ? await c.evaluate(`(() => { const r = document.querySelector(${JSON.stringify(selector)}).getBoundingClientRect(); return {x:r.x,y:r.y,width:r.width,height:Math.min(r.height,innerHeight-r.y)} })()`) : undefined;
  await c.shot(`${out}/${name}.png`, clip);
  captures.push({ name, url: await c.evaluate('location.href'), clip, text: await c.evaluate('document.body.innerText') });
  console.log(name);
}
const personal = '/preview/newtab.html?scope=&theme=light&snapshots=on&personalAtlasStory=1';
try {
  await visit(personal + '#/orbit-atlas?session=s-jeju', "document.querySelectorAll('.atlas-gallery__capture').length===8 && [...document.querySelectorAll('.atlas-gallery__capture')].every(i=>i.complete&&i.naturalWidth)");
  await c.evaluate("[...document.querySelectorAll('button')].find(b=>b.textContent.trim()==='다시 보지 않기')?.click(); document.querySelector('.sidebar-toggle').click()");
  await sleep(600);
  await shot('atlas-overview');
  await c.evaluate("document.querySelector('.atlas-gallery__card .atlas-page-card__select').click()");
  await sleep(650);
  await shot('atlas-detail');
  await c.evaluate("document.querySelector('[aria-label=\"세션 메뉴\"]').click()");
  await sleep(350);
  await c.evaluate("[...document.querySelectorAll('.atlas-context-menu button')].find(b=>b.textContent.includes('팀으로 공유')).click()");
  await sleep(800);
  assert(!await c.evaluate("!!document.querySelector('.atlas-context-menu [role=alert]')"));
  await shot('team-sharing', '.atlas-context-menu');
  await c.send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Escape', code: 'Escape' });
  await c.send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Escape', code: 'Escape' });
  await c.evaluate("document.querySelector('.team-collect-toggle').click()");
  await sleep(300);
  await c.evaluate("(() => {const s=document.querySelector('.team-collect-start select'); s.value='w-team-stream'; s.dispatchEvent(new Event('change',{bubbles:true}))})()");
  await sleep(800);
  await shot('team-collect-start', '.team-collect-start');
  await c.send('Emulation.setDeviceMetricsOverride',{width:1600,height:760,deviceScaleFactor:2,mobile:false});
  await visit(personal.replace('snapshots=on','snapshots=off') + '#/orbit-atlas?session=s-jeju', "document.querySelector('.atlas-orbit') || document.querySelector('svg.orbit-svg') || document.body.innerText.includes('현재 세션의 페이지')");
  assert.equal(await c.evaluate("document.querySelectorAll('.atlas-gallery').length"), 0);
  await shot('atlas-orbit');
  await c.send('Emulation.setDeviceMetricsOverride',{width:1600,height:1400,deviceScaleFactor:2,mobile:false});
  await visit(personal + '#/', "document.querySelector('.continue-exploring') || document.body.innerText.includes('이어서 탐색하기')");
  await shot('home');
  await c.evaluate("document.querySelector('.search-shell__mode:last-of-type')?.click(); [...document.querySelectorAll('button')].find(b=>b.textContent.trim()==='AI에게 질문').click(); document.querySelector('.search-field').focus()");
  await c.send('Input.insertText',{text:'제주 여행 준비하던 기록 찾아줘'});
  await c.evaluate("document.querySelector('[aria-label=\"질문 보내기\"]').click()");
  await wait("document.body.innerText.includes('성산일출봉') && !!document.querySelector('.ask-conversation')");
  await sleep(1500);
  await c.send('Emulation.setDeviceMetricsOverride',{width:1600,height:1050,deviceScaleFactor:2,mobile:false});
  await shot('orbit-ai');
  await visit(personal + '#/orbit-atlas?session=s-jeju', "!!document.querySelector('.atlas-session-header')");
  await shot('restore-before','.atlas-session-header');
  const point=await c.evaluate("(() => {const r=document.querySelector('.atlas-session-header .atlas-open').getBoundingClientRect();return{x:r.x+r.width/2,y:r.y+r.height/2}})()");
  await c.send('Input.dispatchMouseEvent',{type:'mouseMoved',...point});
  await sleep(800);
  await shot('restore-after','.atlas-session-header');

  await visit('/preview/sidepanel.html?scope=&theme=light', "document.body.innerText.includes('타임라인')");
  await c.send('Emulation.setDeviceMetricsOverride',{width:460,height:940,deviceScaleFactor:2,mobile:false});
  // Timeline reads the local queue, so seed the same synthetic visits in this temporary profile.
  await c.evaluate(`(async () => {
    const {loadDb}=await import('/preview/api-mock.ts');
    const {getDB,EVENTS_STORE}=await import('/lib/events/db.ts');
    const {updateSyncStatus}=await import('/lib/events/queue.ts');
    const fixture=loadDb(), db=await getDB();
    for(const session of fixture.sessions.filter(s=>s.owner===fixture.me)) for(const event of session.events) {
      if(Date.now()-Date.parse(event.visited_at)>86400000)continue;
      await db.put(EVENTS_STORE,{eventId:event.event_id,eventType:'visit',url:event.url,title:event.title,domain:event.domain,
        visitedAt:event.visited_at,endedAt:event.visited_at,tabId:1,windowId:1,referrerUrl:null,previousEventId:null,
        activeDurationMs:event.active_duration_ms,contentExcerpt:null,createdAt:event.visited_at,accountId:fixture.me,
        workspaceId:null,collectWindowId:null,status:'synced',failureCount:0,nextAttemptAt:null,syncedAt:event.visited_at,syncingStartedAt:null});
    }
    await updateSyncStatus({lastSyncAt:new Date().toISOString()});
  })()`);
  await c.evaluate("[...document.querySelectorAll('button')].find(b=>b.textContent.trim()==='수집 켜기')?.click()");
  await wait("document.body.innerText.includes('제주 항공권 최저가')");

  await sleep(600);
  await shot('timeline');
  await c.evaluate("[...document.querySelectorAll('button')].find(b=>b.textContent.trim()==='세션').click()");
  await sleep(1800);
  await c.evaluate("(() => { const t=[...document.querySelectorAll('*')].find(e=>e.childElementCount===0&&e.textContent==='제주 3박 4일 여행 준비');t?.click() })()");
  await sleep(900);
  await shot('extension-timeline');
} finally {
  await writeFile(`${out}/captures.json`, JSON.stringify(captures,null,2)+'\n');
  await writeFile(`${out}/console.json`,JSON.stringify(c.consoleLines,null,2)+'\n');
  await c.close();
}
