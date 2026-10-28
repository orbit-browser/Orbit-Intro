import { openChrome, sleep } from './cdp.mjs';
import { mkdir, readFile, writeFile, stat, rm } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const artifactRoot = resolve(root, 'artifacts/atlas-orbits');
const outputRoot = resolve(root, 'src/assets/atlas-orbits');
const preview = process.env.ATLAS_PREVIEW_BASE ?? 'http://127.0.0.1:5187';
const fixtureRoot = process.env.ATLAS_FIXTURE_ROOT ?? resolve(root, '../orbit/Orbit/worktrees/feat-team-atlas-contributors/extension');
const ffmpeg = process.env.FFMPEG ?? '/opt/homebrew/bin/ffmpeg';
const ffprobe = process.env.FFPROBE ?? '/opt/homebrew/bin/ffprobe';
const cwebp = process.env.CWEBP ?? '/opt/homebrew/bin/cwebp';
const WIDTH = 1600, HEIGHT = 760, FRAMES = 96, FPS = 30;
const SPACING = 220, DRAG_GAIN = 1.5;
const modes = [
  { name: 'personal', count: 8, nav: true, url: `${preview}/preview/newtab.html?scope=&theme=light&personalAtlasStory=1#/orbit-atlas?session=s-jeju`, publicManifest: 'preview/out/personal-atlas-public/provenance.json' },
  { name: 'team', count: 6, nav: false, url: `${preview}/preview/newtab.html?scope=w-team-stream&theme=light&teamStoryFrame=6#/orbit-atlas?session=s-team-stream-u-me`, publicManifest: 'preview/out/team-atlas-public/provenance.json' },
];
const only = process.argv.find((argument) => argument.startsWith('--only='))?.split('=')[1];
const hash = (buffer) => createHash('sha256').update(buffer).digest('hex');
await mkdir(outputRoot, { recursive: true });
await mkdir(artifactRoot, { recursive: true });
let existing = [];
try { existing = JSON.parse(await readFile(resolve(outputRoot, 'provenance.json'), 'utf8')).videos; } catch {}
const results = existing.filter((entry) => only && entry.name !== only);

for (const mode of modes.filter((item) => !only || item.name === only)) {
  const frames = resolve(artifactRoot, mode.name);
  await mkdir(frames, { recursive: true });
  const samples = [];
  const sourceCaptures = JSON.parse(await readFile(resolve(fixtureRoot, mode.publicManifest), 'utf8'));
  if (!process.argv.includes('--encode-only')) {
  const browser = await openChrome({ width: WIDTH, height: HEIGHT, scale: 1 });
  try {
    // Capture the explicitly requested enabled state in this isolated demo only.
    // Real extension settings and browser permissions are never changed here.
    await browser.send('Page.addScriptToEvaluateOnNewDocument', { source: `
      if (location.hostname === '127.0.0.1') {
        const state = JSON.parse(localStorage.getItem('orbit-preview:storage:local') || '{}');
        state['orbit:settings'] = { ...(state['orbit:settings'] || {}), tabSnapshotsEnabled: true };
        localStorage.setItem('orbit-preview:storage:local', JSON.stringify(state));
      }
    ` });
    // Input positions still use the actual AtlasGallery handlers and transforms. Reduced motion
    // removes interpolation between sampled positions; no component, DOM or visual style is replaced.
    await browser.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
    await browser.goto(mode.url, { readyFlag: false, settle: 2500 });
    await browser.evaluate('document.fonts.ready');
    for (let attempt = 0; attempt < 80; attempt += 1) {
      const loaded = await browser.evaluate(`document.querySelectorAll('.atlas-gallery__card img').length === ${mode.count} && [...document.querySelectorAll('.atlas-gallery__card img')].every(image => image.complete && image.naturalWidth > 0)`);
      if (loaded) break;
      if (attempt === 79) throw new Error(`${mode.name}: actual gallery images did not load`);
      await sleep(150);
    }
    await browser.evaluate(`(() => {
      [...document.querySelectorAll('button')].find(button => button.textContent.trim() === '다시 보지 않기')?.click();
      const toggle = document.querySelector('.sidebar-toggle');
      if (toggle.getAttribute('aria-pressed') !== '${mode.nav}') toggle.click();
      if (${mode.nav}) {
        const folder = [...document.querySelectorAll('.atlas-row--folder')].find(row => row.querySelector('.atlas-row__label')?.textContent === '여행');
        const caret = folder?.querySelector('.atlas-row__caret');
        if (caret?.getAttribute('aria-label') === '펼치기') caret.click();
      }
    })()`);
    await sleep(350);
    const initial = await browser.evaluate(`(() => {
      const gallery = document.querySelector('.atlas-gallery');
      const rect = gallery.getBoundingClientRect();
      return { rect: rect.toJSON(), body: document.body.innerText, count: gallery.querySelectorAll('.atlas-gallery__card').length,
        images: [...gallery.querySelectorAll('img')].map(image => ({ url: image.currentSrc, width: image.naturalWidth, height: image.naturalHeight })),
        nav: document.querySelector('.sidebar-toggle').getAttribute('aria-pressed') };
    })()`);
    assert.equal(initial.count, mode.count);
    assert.equal(initial.nav, String(mode.nav));
    assert(initial.images.every((image) => image.url.includes('/preview/out/')));
    if (mode.name === 'personal') assert(initial.body.includes('합성 탐색 시연'));
    const startX = Math.min(initial.rect.right - 8, WIDTH - 8);
    const y = mode.nav ? initial.rect.bottom - 8 : initial.rect.top + 20;
    const endX = startX - mode.count * SPACING / DRAG_GAIN;
    assert(endX >= 0, 'Drag must remain inside the captured browser viewport');
    const target = await browser.evaluate(`({ gallery: Boolean(document.elementFromPoint(${startX}, ${y})?.closest('.atlas-gallery')), element: document.elementFromPoint(${startX}, ${y})?.className })`);
    assert(target.gallery, `Start of drag must target the actual gallery, found ${target.element}`);
    await browser.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: startX, y });
    await browser.send('Input.dispatchMouseEvent', { type: 'mousePressed', x: startX, y, button: 'left', buttons: 1, clickCount: 1 });
    for (let frame = 0; frame < FRAMES; frame += 1) {
      const position = mode.count * frame / (FRAMES - 1);
      const x = startX - position * SPACING / DRAG_GAIN;
      await browser.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x, y, buttons: 1 });
      await browser.evaluate('new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))');
      const path = resolve(frames, `frame-${String(frame).padStart(3, '0')}.png`);
      await browser.shot(path);
      if ([0, 47, 48, 95].includes(frame)) {
        const state = await browser.evaluate(`({ cards: [...document.querySelectorAll('.atlas-gallery__card')].map(card => ({ title: card.title, transform: card.style.transform, opacity: card.style.opacity })), count: document.querySelector('.atlas-rail__count')?.textContent })`);
        samples.push({ frame, intendedPosition: position, ...state });
      }
      if (frame % 24 === 0 || frame === FRAMES - 1) console.log(`${mode.name}: ${frame + 1}/${FRAMES} frames`);
    }
    // The same first page is centered at both endpoints; releasing would invoke inertia,
    // so the controlled drag stays down until the isolated browser is closed.
    const endOffset = Number(/translateX\(([-\d.e+]+)px\)/.exec(samples.at(-1).cards[0].transform)?.[1]);
    assert(Math.abs(endOffset) < 0.01, `First page must return to center, got ${endOffset}px`);
    await writeFile(resolve(frames, 'capture.json'), JSON.stringify({ mode, initial, samples, console: browser.consoleLines }, null, 2) + '\n');
  } finally {
    try { await browser.close(); } catch (error) {
      if (error.code !== 'ENOTEMPTY' || !error.path?.includes('orbit-intro-chrome-')) throw error;
      await rm(error.path, { recursive: true, force: true, maxRetries: 8, retryDelay: 200 });
    }
  }
  }
  await Promise.all(Array.from({ length: FRAMES }, (_, index) =>
    stat(resolve(frames, `frame-${String(index).padStart(3, '0')}.png`)),
  )).catch(() => { throw new Error(`${mode.name}: complete capture frames are required; rerun without --encode-only after frame cleanup`); });
  const video = resolve(outputRoot, `${mode.name}.mp4`);
  execFileSync(ffmpeg, ['-hide_banner', '-loglevel', 'error', '-y', '-framerate', String(FPS), '-i', resolve(frames, 'frame-%03d.png'), '-frames:v', String(FRAMES), '-an', '-c:v', 'libx264', '-preset', 'slow', '-crf', '18', '-pix_fmt', 'yuv420p', '-profile:v', 'high', '-g', '8', '-keyint_min', '8', '-sc_threshold', '0', '-movflags', '+faststart', video]);
  const poster = resolve(outputRoot, `${mode.name}.webp`);
  execFileSync(cwebp, ['-quiet', '-lossless', '-z', '6', resolve(frames, 'frame-000.png'), '-o', poster]);
  const probe = JSON.parse(execFileSync(ffprobe, ['-v', 'error', '-show_streams', '-show_format', '-of', 'json', video], { encoding: 'utf8' }));
  assert.equal(probe.streams.length, 1);
  const stream = probe.streams[0];
  assert.equal(stream.codec_type, 'video');
  assert.equal(stream.width, WIDTH);
  assert.equal(stream.height, HEIGHT);
  assert.equal(Number(stream.nb_frames), FRAMES);
  assert.equal(Number(probe.format.duration), FRAMES / FPS);
  const result = {
    name: mode.name, file: `${mode.name}.mp4`, poster: `${mode.name}.webp`, recordedAt: new Date().toISOString(),
    previewUrl: mode.url, content: 'Actual Orbit preview components with synthetic demonstration records; public page captures only.',
    capture: { width: WIDTH, height: HEIGHT, frames: FRAMES, fps: FPS, seconds: FRAMES / FPS, pageCount: mode.count, fullRotations: 1, navigatorOpen: mode.nav, method: 'Actual AtlasGallery pointer drag; reduced-motion interpolation disabled only in capture browser.', spacingPx: SPACING, dragGain: DRAG_GAIN },
    encoding: { codec: stream.codec_name, pixelFormat: stream.pix_fmt, crf: 18, keyframeInterval: 8, faststart: true, audioStreams: 0 },
    bytes: (await stat(video)).size, sha256: hash(await readFile(video)), posterSha256: hash(await readFile(poster)), sourceCaptures,
  };
  results.push(result);
  await writeFile(resolve(outputRoot, 'provenance.json'), JSON.stringify({ notice: 'Synthetic fixture records, actual Orbit UI. No real users, private snapshots, or recorded audio.', videos: results }, null, 2) + '\n');
  await writeFile(resolve(frames, 'ffprobe.json'), JSON.stringify(probe, null, 2) + '\n');
  console.log(`${mode.name}: ${result.bytes} bytes, ${WIDTH}x${HEIGHT}, 3.2s, no audio`);
}
