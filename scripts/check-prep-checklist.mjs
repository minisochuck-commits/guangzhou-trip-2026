// 跑 lib/prep-checklist.test.ts 的断言。
//
//   node scripts/check-prep-checklist.mjs
//
// 和 check-journeys.mjs / check-noise.mjs 同一套做法：esbuild 打包后经 data: URL 执行，
// 不新增依赖，也不写临时文件。

import { fileURLToPath } from "node:url";
import path from "node:path";
import { build } from "esbuild";

const projectRoot = fileURLToPath(new URL("../", import.meta.url));
const entry = path.join(projectRoot, "lib/prep-checklist.test.ts");

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
const testModule = await import(
  `data:text/javascript;base64,${Buffer.from(code).toString("base64")}`
);

const results = testModule.runPrepChecklistChecks();
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
