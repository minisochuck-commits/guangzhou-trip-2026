"use client";

import * as React from "react";

import {
  DINING_INTRO,
  DINING_THEMES,
  type DiningBrand,
} from "@/lib/dining-brands";
import type { Lang } from "@/lib/trip-data";
import { t } from "@/lib/trip-i18n";
import { cn } from "@/lib/utils";
import { CopyChinese, GUIDE, SourceLink } from "./ui";

/**
 * 特色餐饮品牌推荐：按口味分主题，一行一个品牌，四行左右说完。
 *
 * 这一节是「介绍」，不是工具：没有筛选、没有定位、没有地图按钮，也没有卡中卡。
 * 每个品牌只给名字、人均参考、一句特色、一到两道点单参考，外加一个复制中文店名的按钮 ——
 * 门店地址、电话、营业时间都不写，那些随分店变，页面追不上。
 * 来源统一收在末尾一个折叠里，不是每行挂一个。
 */
const LABELS = {
  /** 行内的引子，短。整节那句「招牌与点单参考」在导语里说过一次了。 */
  dishes: {
    zh: "可试",
    en: "Try",
    ar: "جرّبوا",
  },
  sources: {
    zh: "菜品来源",
    en: "Where the dishes come from",
    ar: "مصادر الأطباق",
  },
};

/**
 * 人均：数字用 bdi 包住，阿语下也按 116–144 的顺序读。
 * 单位（人民币 / CNY）在导语里说过一次，这里不每行重复一遍。
 */
function Budget({
  budget,
  lang,
}: {
  budget: DiningBrand["budget"];
  lang: Lang;
}) {
  const amount = Array.isArray(budget) ? `${budget[0]}–${budget[1]}` : String(budget);
  const figure = (
    <bdi dir="ltr" className="font-medium text-navy">
      {amount}
    </bdi>
  );
  if (lang === "zh") return <>约 {figure} 元/人</>;
  if (lang === "ar") return <>{figure} يوانًا/للفرد</>;
  return <>CNY {figure}/person</>;
}

/**
 * 复制按钮的可访问名字要带上是哪一家 —— 21 个按钮都念「复制 中文店名」分不清。
 * 复制到剪贴板的仍然只有中文店名本身。
 */
function copyEntryFor(brand: DiningBrand) {
  return {
    id: `dining-${brand.id}`,
    label: {
      zh: `${brand.chinese} 的中文店名`,
      en: `Chinese name for ${brand.name.en}`,
      ar: `الاسم الصيني لـ ${brand.name.ar}`,
    },
    chinese: brand.chinese,
  };
}

function BrandRow({ brand, lang }: { brand: DiningBrand; lang: Lang }) {
  // 中文视图里标题就是中文店名，下面再写一遍就是噪音：按钮直接跟在标题旁边。
  // 英文、阿语的标题是译名，中文检索名要单独露出来 —— 给店员看、也能手选。
  const nameIsChinese = lang === "zh";
  const entry = copyEntryFor(brand);
  return (
    <li className="border-t border-card-line py-3">
      {/* 三级：主题标题最重，品牌名中等，标签只是行内的引子 —— 别三层一样粗。 */}
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
        <h4 className="text-[0.9375rem] font-medium leading-6 text-navy">
          {t(brand.name, lang)}
        </h4>
        {nameIsChinese ? (
          <CopyChinese entry={entry} lang={lang} inline hideChinese />
        ) : null}
      </div>
      <p className={cn(GUIDE.note, "mt-0.5")}>
        <Budget budget={brand.budget} lang={lang} />
      </p>
      <p className={cn(GUIDE.body, "mt-1")}>{t(brand.note, lang)}</p>
      <p className={cn(GUIDE.body, "mt-1")}>
        {/* 冒号跟着语言走：中文用全角，英文和阿语用半角加空格。 */}
        <span className="font-medium text-navy">
          {t(LABELS.dishes, lang)}
          {lang === "zh" ? "：" : ": "}
        </span>
        {t(brand.dishes, lang)}
      </p>
      {nameIsChinese ? null : (
        <div className="mt-1.5">
          <CopyChinese entry={entry} lang={lang} inline />
        </div>
      )}
    </li>
  );
}

export function DiningBrands({ lang }: { lang: Lang }) {
  return (
    <div className="max-w-[44rem]">
      <p className={GUIDE.body}>{t(DINING_INTRO.how, lang)}</p>
      <p className={cn(GUIDE.body, "mt-1.5")}>{t(DINING_INTRO.halal, lang)}</p>

      {DINING_THEMES.map((theme) => (
        <section key={theme.id} className="mt-5">
          <h3 className={cn(GUIDE.subheading, "flex items-center gap-2")}>
            <span
              aria-hidden="true"
              className="inline-block h-px w-4 shrink-0 bg-miniso-red/50"
            />
            {t(theme.title, lang)}
          </h3>
          <p className={cn(GUIDE.note, "mt-0.5")}>{t(theme.lead, lang)}</p>
          <ul className="mt-1.5">
            {theme.brands.map((brand) => (
              <BrandRow key={brand.id} brand={brand} lang={lang} />
            ))}
          </ul>
        </section>
      ))}

      {/* 21 条来源收在一个折叠里：要核对的人点得开，读的人不被链接打断。 */}
      <details className="mt-4">
        <summary
          className={cn(GUIDE.note, "inline-flex min-h-11 cursor-pointer items-center")}
        >
          {t(LABELS.sources, lang)}
        </summary>
        <ul className="space-y-1 pb-1">
          {DINING_THEMES.flatMap((theme) => theme.brands).map((brand) => (
            <li key={brand.id}>
              <SourceLink label={brand.name} url={brand.source} lang={lang} />
            </li>
          ))}
        </ul>
      </details>
    </div>
  );
}
