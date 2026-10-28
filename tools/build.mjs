import { cp, mkdir, rm, writeFile } from "node:fs/promises";
await rm(new URL("../dist/", import.meta.url), {
  recursive: true,
  force: true,
});
await mkdir(new URL("../dist/", import.meta.url), { recursive: true });
await cp(
  new URL("../src/", import.meta.url),
  new URL("../dist/", import.meta.url),
  { recursive: true },
);
await writeFile(new URL("../dist/.nojekyll", import.meta.url), "");
console.log("Built static Orbit site in dist/");
