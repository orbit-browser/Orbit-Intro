import test from "node:test";
import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
const root = new URL("../src/", import.meta.url);
const html = await readFile(new URL("index.html", root), "utf8");
const css = await readFile(new URL("styles.css", root), "utf8");
const js = await readFile(new URL("main.js", root), "utf8");
const provenance = JSON.parse(
  await readFile(new URL("assets/provenance.json", root), "utf8"),
);

test("all HTML and font assets resolve under the GitHub Pages project path", async () => {
  for (const [, path] of html.matchAll(/(?:src|href)="(\.\/[^"#]+)"/g)) {
    assert.ok((await stat(new URL(path, root))).isFile(), path);
  }
  const fonts = await readFile(new URL("assets/fonts/fonts.css", root), "utf8");
  for (const [, path] of fonts.matchAll(/url\(['"]?([^)'" ]+)/g)) {
    assert.ok(
      (await stat(new URL(path, new URL("assets/fonts/", root)))).isFile(),
      path,
    );
  }
  assert.doesNotMatch(
    html,
    /(?:src|href)="\/(?!\/)/,
    "root-relative assets break project Pages",
  );
});

test("navigation and the three product tabs have valid, unique targets", () => {
  const ids = [...html.matchAll(/id="([^"]+)"/g)].map((m) => m[1]);
  assert.equal(ids.length, new Set(ids).size);
  for (const [, id] of html.matchAll(/(?:href="#|aria-controls=")([^" ]+)/g))
    assert.ok(ids.includes(id), id);
  assert.equal([...html.matchAll(/role="tab"/g)].length, 3);
  assert.equal([...html.matchAll(/role="tabpanel"/g)].length, 3);
  assert.equal([...html.matchAll(/aria-selected="true"/g)].length, 1);
});

test("public copy keeps verified identities, consent and sharing boundaries", () => {
  for (const copy of [
    "전준",
    "임동건",
    "팀대표",
    "수집은 사용자가 켠 뒤",
    "내가 고른 세션만",
    "Orbit AI",
    "Team AI",
  ])
    assert.ok(html.includes(copy), copy);
  for (const name of ["김오르빗", "박지은", "이도현"])
    assert.ok(!html.includes(name), "demo users are not team profiles");
  assert.ok(html.includes("https://youtu.be/vDcOPbC3ntU"));
  assert.doesNotMatch(
    html,
    /href="(?:#|javascript:)["]/,
    "no inert fake calls to action",
  );
});

test("real image provenance and lightweight web formats are preserved", async () => {
  let imageBytes = 0;
  for (const image of provenance.screens) {
    const info = await stat(new URL("assets/" + image.file, root));
    assert.equal(info.size, image.bytes, image.file);
    assert.ok(
      info.size < 700000,
      "responsive screen image must stay below 700 kB",
    );
    assert.match(image.sourceSha256, /^[0-9a-f]{64}$/);
    imageBytes += info.size;
    for (const variant of image.variants ?? []) {
      const variantInfo = await stat(new URL("assets/" + variant.file, root));
      assert.equal(variantInfo.size, variant.bytes);
      assert.ok(
        variantInfo.size < 2000000,
        "on-demand detail stays below 2 MB",
      );
    }
  }
  assert.ok(
    imageBytes < 2500000,
    "all default product and hero images stay below 2.5 MB",
  );
  for (const [, file, width, height] of html.matchAll(
    /src="\.\/assets\/([^"]+)"[^>]*width="(\d+)" height="(\d+)"/g,
  )) {
    const record = provenance.screens.find((x) => x.file === file);
    if (record) {
      assert.equal(Number(width), record.width);
      assert.equal(Number(height), record.height);
    }
  }
});

test("motion and keyboard alternatives are present with no third-party runtime scripts", () => {
  assert.ok(css.includes("prefers-reduced-motion"));
  for (const key of ["ArrowRight", "ArrowLeft", "Home", "End"])
    assert.ok(js.includes(key));
  assert.ok(html.includes("motion-toggle"));
  assert.ok(html.includes("skip-link"));
  assert.doesNotMatch(html, /<script[^>]+src="https?:/);
});

test("every Korean copy character is covered by a locally served font subset", async () => {
  const fonts =
    (await readFile(new URL("assets/fonts/fonts.css", root), "utf8")) +
    (await readFile(new URL("assets/fonts/additional.css", root), "utf8"));
  const ranges = [];
  for (const block of fonts.split("@font-face")) {
    if (!block.includes("'Noto Sans KR'")) continue;
    for (const match of block.matchAll(/U\+([0-9A-F]+)(?:-([0-9A-F]+))?/gi))
      ranges.push([parseInt(match[1], 16), parseInt(match[2] || match[1], 16)]);
  }
  const chars = [
    ...new Set([...(html + js)].filter((c) => c >= "가" && c <= "힣")),
  ];
  const missing = chars.filter(
    (c) =>
      !ranges.some(([a, b]) => c.codePointAt(0) >= a && c.codePointAt(0) <= b),
  );
  assert.deepEqual(
    missing,
    [],
    "website copy must not silently fall back to a system Korean face",
  );
});

test("public links expose only the supplied individual profiles, with no project CTA or school", () => {
  const links = [...html.matchAll(/href="(https:\/\/github.com\/[^"]+)"/g)]
    .map((m) => m[1])
    .sort();
  assert.deepEqual(links, [
    "https://github.com/06-month",
    "https://github.com/WhiteJbb",
  ]);
  assert.ok(!html.includes("프로젝트 보기"));
  assert.ok(!html.includes("국립한밭대학교"));
});

test("product detail sources resolve to higher-resolution original derivatives", async () => {
  for (const [, path] of html.matchAll(/data-detail="(\.\/[^"]+)"/g)) {
    assert.ok((await stat(new URL(path, root))).isFile(), path);
    const image = provenance.screens.find((r) =>
      path.endsWith(r.file.replace(".webp", "-detail.webp")),
    );
    assert.ok(image);
    assert.ok(image.variants[1].width >= image.width);
  }
  assert.equal([...html.matchAll(/data-detail=/g)].length, 7);
});
