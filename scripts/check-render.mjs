// 把页面真的渲染一遍（服务端渲染，不开浏览器、不起服务）。
//
//   node scripts/check-render.mjs
//
// 类型检查证明不了「运行时不炸」：少一个可选字段、读了 window、拼错一个 key，
// 都要渲染才看得出来。这里对三种语言 × 六种视图各渲一次，并检查几件必须出现的东西：
// 酒店那块、出发前清单的条目与计数、以及借来的中国卡不能出现在客人页面上。
//
// 折叠的那几节由 Accordion 在展开时才挂载，所以清单和路线在这里单独渲一次。
// 做法和 check-journeys.mjs 一样：esbuild 打包 + data: URL 执行，不写产物、不加依赖。

import { fileURLToPath } from "node:url";
import path from "node:path";
import { build } from "esbuild";

const projectRoot = fileURLToPath(new URL("../", import.meta.url));

const entry = `
import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";
import { GuideTab } from "@/components/trip/guide-tab";
import { DayTab } from "@/components/trip/day-tab";
import { PrepChecklist } from "@/components/trip/prep-checklist";
import { RouteList } from "@/components/trip/routes";
import { datesForPerson } from "@/lib/person-day-plan";

export function render(lang, person) {
  const dates = datesForPerson(person);
  return [
    createElement(GuideTab, { lang, person }),
    createElement(PrepChecklist, { lang, person }),
    createElement(RouteList, { lang }),
    createElement(DayTab, {
      lang,
      person,
      dates,
      activeDate: dates[0],
      onSelectDate: () => {},
    }),
  ]
    .map((element) => renderToStaticMarkup(element))
    .join("");
}
`;

const bundled = await build({
  stdin: { contents: entry, resolveDir: projectRoot, loader: "ts" },
  bundle: true,
  write: false,
  format: "esm",
  platform: "node",
  target: "node22",
  jsx: "automatic",
  alias: { "@": projectRoot.replace(/\/$/, "") },
  // react-dom/server 是 CJS，里面 require("util")。打成 ESM 之后要自己补一个 require；
  // 模块是从 data: URL 执行的，所以解析基准写成项目里的真实路径。
  banner: {
    js:
      'import { createRequire as __cr } from "node:module";' +
      `const require = __cr(${JSON.stringify(path.join(projectRoot, "package.json"))});`,
  },
  logLevel: "silent",
});

const mod = await import(
  `data:text/javascript;base64,${Buffer.from(bundled.outputFiles[0].text).toString("base64")}`
);

/**
 * 每种视图都必须看得见的东西。少了说明不是「样式变了」，是内容掉了。
 * 计数只在个人视图出现（五件：支付 / 打车 / 地图 / 上网 / 随身物品）；
 * 「全部」视图不给勾也不报完成数，但完整指引一条不少。
 */
function mustContain(lang, person) {
  const count = person === null ? [] : [{ zh: "已完成 0 / 5", en: "0 of 5 done", ar: "0 من 5" }[lang]];
  if (lang === "zh")
    return ["广州保利洲际酒店", "阅江中路828号", "出发前准备", "怎么做", ...count];
  if (lang === "en")
    return ["InterContinental", "Before you fly", "How to do it", ...count];
  return ["إنتركونتيننتال", "قبل السفر", "طريقة التنفيذ", ...count];
}

/** 「全部」视图里不能出现勾选框。 */
function mustNotContain(person) {
  return person === null ? ['role="checkbox"'] : [];
}

/** 借来的中国卡与备用金只属于 Ahmed / Mohamed，别人的页面上不能出现。 */
const TEAM_ONLY = /给 Mohamed 一张中国卡|lend Mohamed one Chinese SIM|شريحة صينية واحدة/;

let failed = 0;
for (const lang of ["zh", "en", "ar"]) {
  for (const person of ["reham", "rahma", "qiuting", "ahmed", "hassan", null]) {
    const view = `${lang} / ${person ?? "all"}`;
    let html;
    try {
      html = mod.render(lang, person);
    } catch (error) {
      failed += 1;
      console.log(`FAIL  ${view} 渲染抛错 — ${error.message}`);
      continue;
    }
    const missing = mustContain(lang, person).filter((text) => !html.includes(text));
    if (missing.length > 0) {
      failed += 1;
      console.log(`FAIL  ${view} 缺少：${missing.join(" / ")}`);
      continue;
    }
    const unexpected = mustNotContain(person).filter((text) => html.includes(text));
    if (unexpected.length > 0) {
      failed += 1;
      console.log(`FAIL  ${view} 不该出现：${unexpected.join(" / ")}`);
      continue;
    }
    const team = person === "ahmed" || person === "hassan" || person === null;
    if (!team && TEAM_ONLY.test(html)) {
      failed += 1;
      console.log(`FAIL  ${view} 出现了只属于 Ahmed / Mohamed 的安排`);
      continue;
    }
    if (team && !TEAM_ONLY.test(html)) {
      failed += 1;
      console.log(`FAIL  ${view} 少了 Ahmed / Mohamed 的中国卡说明`);
      continue;
    }
    console.log(`PASS  ${view}（${html.length.toLocaleString("en-US")} 字符）`);
  }
}

console.log(failed === 0 ? "\n18 个视图渲染通过" : `\n${failed} 个视图有问题`);
process.exit(failed > 0 ? 1 : 0);
