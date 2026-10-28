import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { resolve, extname, sep } from "node:path";
const root = resolve(process.argv.includes("--dist") ? "dist" : "src");
const port = Number(process.env.PORT || 5186);
const mime = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".webp": "image/webp",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".json": "application/json",
  ".mp4": "video/mp4",
};
createServer(async (req, res) => {
  try {
    let path = decodeURIComponent(
      new URL(req.url, "http://localhost").pathname,
    ).replace(/^\/Orbit-Intro(?=\/)/, "");
    let file = resolve(root, "." + path);
    if (file !== root && !file.startsWith(root + sep)) {
      res.writeHead(403).end();
      return;
    }
    if ((await stat(file)).isDirectory()) file = resolve(file, "index.html");
    const body = await readFile(file);
    const headers = {
      "Content-Type": mime[extname(file)] || "application/octet-stream",
      "Cache-Control": "no-cache",
      "Accept-Ranges": "bytes",
    };
    const range = req.headers.range?.match(/^bytes=(\d+)-(\d*)$/);
    if (range) {
      const start = Number(range[1]);
      const end = Math.min(body.length - 1, range[2] ? Number(range[2]) : body.length - 1);
      if (start > end || start >= body.length) {
        res.writeHead(416, { "Content-Range": `bytes */${body.length}` }).end();
        return;
      }
      res.writeHead(206, { ...headers, "Content-Length": end - start + 1, "Content-Range": `bytes ${start}-${end}/${body.length}` }).end(body.subarray(start, end + 1));
      return;
    }
    res
      .writeHead(200, { ...headers, "Content-Length": body.length })
      .end(body);
  } catch {
    res.writeHead(404).end("Not found");
  }
}).listen(port, "127.0.0.1", () =>
  console.log(`Orbit preview: http://127.0.0.1:${port}/Orbit-Intro/`),
);
