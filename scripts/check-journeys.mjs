// 跑 lib/journeys.regression.ts 的断言。
//
//   node scripts/check-journeys.mjs
//
// 项目没装测试框架，但装了 esbuild（vite 的依赖）。这里用 esbuild 把回归源
// 打成一份 ESM，再用 data: URL 直接 import 执行 —— 不新增任何依赖，也不写临时文件。

import { fileURLToPath } from "node:url";
import path from "node:path";
import { build } from "esbuild";

const projectRoot = fileURLToPath(new URL("../", import.meta.url));
const entry = path.join(projectRoot, "lib/journeys.regression.ts");

const bundled = await build({
  entryPoints: [entry],
  bundle: true,
  write: false,
  format: "esm",
  platform: "node",
  target: "node22",
  logLevel: "silent",
});

const code = bundled.outputFiles[0].text;
const regressionModule = await import(
  `data:text/javascript;base64,${Buffer.from(code).toString("base64")}`
);

const results = regressionModule.runJourneyChecks();
let failed = 0;

for (const result of results) {
  if (result.ok) {
    console.log(`PASS  ${result.name}`);
  } else {
    failed += 1;
    console.log(`FAIL  ${result.name}${result.detail ? `  — ${result.detail}` : ""}`);
  }
}

console.log(`\n${results.length - failed}/${results.length} passed`);
process.exit(failed > 0 ? 1 : 0);
