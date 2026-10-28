// Isolated local Chrome profile for visual and browser verification.
import { spawn } from "node:child_process";
import {
  existsSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";

import { join } from "node:path";
import { tmpdir } from "node:os";

const CHROME =
  process.env.CHROME_PATH ||
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export async function openChrome({
  width = 950,
  height = 2380,
  scale = 1,
  gpu = true,
} = {}) {
  const profile = mkdtempSync(join(tmpdir(), "orbit-intro-chrome-"));
  const args = [
    "--headless=new",
    "--hide-scrollbars",
    "--no-first-run",
    "--no-default-browser-check",
    "--disable-extensions",
    "--remote-debugging-port=0",
    `--user-data-dir=${profile}`,
    `--window-size=${width},${height}`,
    `--force-device-scale-factor=${scale}`,
    "--force-gpu-mem-available-mb=16384",
    ...(gpu ? [] : ["--disable-gpu"]),
    "about:blank",
  ];
  const chrome = spawn(CHROME, args, { stdio: "ignore" });
  let devPort;
  for (let i = 0; i < 150 && !devPort; i += 1) {
    const file = join(profile, "DevToolsActivePort");
    if (existsSync(file)) devPort = readFileSync(file, "utf8").split("\n")[0];
    else await sleep(100);
  }
  let targets = [];
  for (let i = 0; i < 50 && !targets.some((t) => t.type === "page"); i += 1) {
    targets = await (
      await fetch(`http://127.0.0.1:${devPort}/json/list`)
    ).json();
    if (!targets.some((t) => t.type === "page")) await sleep(100);
  }
  const ws = new WebSocket(
    targets.find((t) => t.type === "page").webSocketDebuggerUrl,
  );
  await new Promise((r) => ws.addEventListener("open", r, { once: true }));
  let id = 0;
  const pending = new Map();
  const consoleLines = [];
  ws.addEventListener("message", (event) => {
    const msg = JSON.parse(event.data);
    if (msg.id && pending.has(msg.id)) {
      pending.get(msg.id)(msg);
      pending.delete(msg.id);
    } else if (msg.method === "Runtime.consoleAPICalled") {
      consoleLines.push(
        `${msg.params.type}: ${msg.params.args.map((a) => a.value ?? a.description ?? "").join(" ")}`,
      );
    } else if (msg.method === "Runtime.exceptionThrown") {
      consoleLines.push(
        `exception: ${msg.params.exceptionDetails?.exception?.description ?? msg.params.exceptionDetails?.text}`,
      );
    }
  });
  const send = (method, params = {}) =>
    new Promise((resolve, reject) => {
      id += 1;
      pending.set(id, (msg) =>
        msg.error
          ? reject(new Error(`${method}: ${msg.error.message}`))
          : resolve(msg.result),
      );
      ws.send(JSON.stringify({ id, method, params }));
    });
  await send("Runtime.enable");
  await send("Page.enable");
  // --window-size 는 창 테두리만큼 화면이 짧아진다(2380 → 2293) — 화면 크기를 정확히 고정한다
  await send("Emulation.setDeviceMetricsOverride", {
    width,
    height,
    deviceScaleFactor: scale,
    mobile: false,
  });
  const evaluate = async (expression) => {
    const result = await send("Runtime.evaluate", {
      expression,
      returnByValue: true,
      awaitPromise: true,
    });
    if (result.exceptionDetails)
      throw new Error(
        result.exceptionDetails.exception?.description ??
          result.exceptionDetails.text,
      );
    return result.result?.value;
  };
  const goto = async (
    url,
    { readyFlag = true, settle = 400, timeout = 40000 } = {},
  ) => {
    await send("Page.navigate", { url });
    const start = Date.now();
    if (readyFlag) {
      while (Date.now() - start < timeout) {
        await sleep(100);
        try {
          if (
            (await evaluate("document.documentElement.dataset.ready")) === "1"
          )
            break;
        } catch {
          // 아직 문서가 바뀌는 중
        }
      }
    }
    await sleep(settle);
  };
  const shot = async (file, clip) => {
    const result = await send("Page.captureScreenshot", {
      format: file.endsWith(".jpg") ? "jpeg" : "png",
      quality: file.endsWith(".jpg") ? 92 : undefined,
      captureBeyondViewport: false,
      ...(clip ? { clip: { ...clip, scale: clip.scale ?? 1 } } : {}),
    });
    writeFileSync(file, Buffer.from(result.data, "base64"));
  };
  const close = async () => {
    ws.close();
    chrome.kill();
    await sleep(300);
    rmSync(profile, { recursive: true, force: true });
  };
  return { send, evaluate, goto, shot, close, consoleLines };
}
