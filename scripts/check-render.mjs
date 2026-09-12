// 把页面真的渲染一遍（服务端渲染，不开浏览器、不起服务）。
//
//   node scripts/check-render.mjs
//
// 类型检查证明不了「运行时不炸」：少一个可选字段、读了 window、拼错一个 key，
// 都要渲染才看得出来。这里对三种语言 × 六种视图各渲一次，并检查几件必须出现的东西：
// 酒店那块、各章标题、路线，以及借来的中国卡不能出现在客人页面上。
//
// 折叠的那几章由 Accordion 在展开时才挂载，所以路线在这里单独渲一次。
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
import { RouteList } from "@/components/trip/routes";
import { datesForPerson } from "@/lib/person-day-plan";
import { DINING_BRANDS } from "@/lib/dining-brands";

export const brandCount = DINING_BRANDS.length;

export function render(lang, person) {
  const dates = datesForPerson(person);
  return [
    createElement(GuideTab, { lang, person }),
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
 * 每种视图都必须看得见的东西：开篇那句欢迎（不折叠，首屏就该在）、酒店那块、
 * 几个章标题、路线名。少了说明不是「样式变了」，是内容掉了。
 */
function mustContain(lang) {
  if (lang === "zh")
    return ["欢迎来到广州", "广州保利洲际酒店", "阅江中路828号", "出发前准备", "广州与你们", "登广州塔"];
  if (lang === "en")
    return ["Welcome to Guangzhou", "InterContinental", "Before you fly", "Guangzhou and you", "Up the Canton Tower"];
  return ["أهلًا بكم في قوانغتشو", "إنتركونتيننتال", "قبل السفر", "قوانغتشو وأنتم", "الصعود إلى برج كانتون"];
}

/**
 * 阅读顺序不是靠 JSX 里搜字符串确认的，而是看渲染出来的页面里这些标题谁先谁后。
 * 折叠状态下章节内容不挂载，但每一章的标题就在触发条上，顺序一目了然。
 * 2026-09-12 用户批准的顺序：欢迎 → 出发前准备 → 酒店 → 琶洲 → 这座城 →
 * 到了之后要用的 → 备查。
 */
function orderedTitles(lang) {
  if (lang === "zh")
    return [
      "欢迎来到广州", "出发前准备", "广州保利洲际酒店", "琶洲：你住的这块地",
      "广州与你们", "认识今天的广州", "名创优品在广州", "科技就在身边",
      "礼拜与清真餐", "食在广州", "当地生活习惯", "广州商圈", "半日建议路线",
      "可复制的中文短句", "资料与图片出处",
    ];
  if (lang === "en")
    return [
      "Welcome to Guangzhou", "Before you fly", "InterContinental", "Around your hotel: Pazhou",
      "Guangzhou and you", "Getting to know Guangzhou today", "MINISO in Guangzhou",
      "The technology around you", "Prayer and halal food", "Eat in Guangzhou",
      "Local customs and habits", "Shopping districts", "Half-day route suggestions",
      "Chinese phrases you can copy", "References and photo credits",
    ];
  return [
    "أهلًا بكم في قوانغتشو", "قبل السفر", "إنتركونتيننتال", "حول فندقكم: بازو",
    "قوانغتشو وأنتم", "التعرّف إلى قوانغتشو اليوم", "ميني سو في قوانغتشو",
    "التقنية من حولكم", "الصلاة والطعام الحلال", "العادات المحلية اليومية",
    "مسارات مقترحة لنصف يوم",
  ];
}

/** 被否掉的清单不能悄悄回来：一个勾选框、一个完成数都不行。 */
const REJECTED = [
  'role="checkbox"',
  "已完成 0 /",
  "of 5 done",
  // 每张照片都要说清自己是什么：读屏的人听到的就是这一串。
  'alt=""',
  // 章提示里的数字是从餐饮数据算出来的，占位符没被替换就是算漏了。
  "{n}",
];

/**
 * 品牌数只有一个来源：`DINING_THEMES`。文案里一度写死 21，数据早已精选成 14，
 * 收起来的那行提示第一个数字就对不上。这里按渲染出来的页面对，不按文案对。
 */
const brandCount = mod.brandCount;
const hintWithCount = (lang) =>
  lang === "zh"
    ? `${brandCount} 个特色餐饮品牌`
    : lang === "en"
      ? `${brandCount} restaurant brands`
      : `${brandCount} علامة مطاعم`;

/**
 * 借来的中国卡与备用金只属于 Ahmed / Mohamed，别人的页面上不能出现。
 * 章节收起时 Accordion 不挂载内容，所以这里只能查「不该出现」那一半；
 * 「该出现」那一半由 check-guest-guide.mjs 直接对 PREP 的分人可见性断言。
 */
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
    const missing = [...mustContain(lang), hintWithCount(lang)].filter(
      (text) => !html.includes(text),
    );
    if (missing.length > 0) {
      failed += 1;
      console.log(`FAIL  ${view} 缺少：${missing.join(" / ")}`);
      continue;
    }
    let outOfOrder = null;
    let previous = -1;
    for (const title of orderedTitles(lang)) {
      const here = html.indexOf(title);
      if (here < 0) {
        outOfOrder = `缺少章标题：${title}`;
        break;
      }
      if (here < previous) {
        outOfOrder = `顺序不对：${title}`;
        break;
      }
      previous = here;
    }
    if (outOfOrder) {
      failed += 1;
      console.log(`FAIL  ${view} ${outOfOrder}`);
      continue;
    }
    const unexpected = REJECTED.filter((text) => html.includes(text));
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
    console.log(`PASS  ${view}（${html.length.toLocaleString("en-US")} 字符）`);
  }
}

console.log(failed === 0 ? "\n18 个视图渲染通过" : `\n${failed} 个视图有问题`);
process.exit(failed > 0 ? 1 : 0);
