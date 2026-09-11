"use client";
/* eslint-disable @next/next/no-img-element -- 静态站、离线可用、相对路径：故意用原生 <img>，不走 next/image 的加载器 */

import * as React from "react";

import {
  CITY_SCALE,
  CITY_STORY,
  CITY_TECH,
  COPY_ADDRESSES,
  INTERCONTINENTAL,
  CULTURE_NOTES,
  FOOD_CULTURE,
  FOOD_NOTES,
  HALAL_DINING,
  HALAL_WHERE,
  JUMUAH_NOTE,
  MOSQUES,
  OFFICIAL_LINKS,
  PAZHOU,
  PHRASES,
  PREP,
  RETAIL_STUDY,
  type L10n,
  type Lang,
  type MallCard,
  type PersonId,
  type PlaceCard,
} from "@/lib/trip-data";
import { IMAGE_CREDITS, IMG } from "@/lib/image-credits";
import { FOOD_ADVICE } from "@/lib/plan-presentation";
import { UI, t } from "@/lib/trip-i18n";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { DistrictRoute } from "./district-route";
import { BaggageLines } from "./flight-details";
import { RouteList } from "./routes";
import { BulletList, CopyChinese, SourceLink } from "./ui";

/**
 * 一段要被「读」的文字：眉批、一句大字、几段正文、来源。
 * 指南里三处用它 —— 广州与你们、你们住的这块地、食在广州。
 * 排版按文章做：衬线、宽行距，不是又一张白盒子。
 */
function Prose({
  lead,
  paragraphs,
  sources,
  lang,
  photo,
  children,
}: {
  eyebrow: L10n;
  lead: L10n;
  paragraphs: L10n[];
  sources: { label: L10n; url: string }[];
  lang: Lang;
  /** 顶上压一张满宽照片（public/images 的 key）。 */
  photo?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="relative overflow-hidden py-2">
      {photo && IMG[photo] ? (
        <img
          src={IMG[photo]}
          alt=""
          loading="lazy"
          className="trip-photo mb-5 aspect-[16/9] w-full object-cover md:aspect-[21/9]"
        />
      ) : null}
      <div className="relative max-w-[44rem]">
        <p className="trip-display mt-2.5 text-[1.375rem] leading-9 text-navy md:text-[1.625rem] md:leading-10">
          {t(lead, lang)}
        </p>
        <div className="mt-4 space-y-3.5">
          {paragraphs.map((paragraph, index) => (
            <p
              key={index}
              className="text-base leading-7 text-navy-soft md:text-base md:leading-8"
            >
              {t(paragraph, lang)}
            </p>
          ))}
        </div>
      </div>
      {children}
      <details className="mt-4"><summary className="cursor-pointer py-2 text-sm text-navy-soft">{lang === "zh" ? "资料来源" : lang === "ar" ? "المصادر" : "Sources"}</summary>
      <ul className="relative flex flex-wrap gap-x-5 gap-y-1">
        {sources.map((source) => (
          <li key={source.url}>
            <SourceLink label={source.label} url={source.url} lang={lang} />
          </li>
        ))}
      </ul></details>
    </section>
  );
}

/**
 * 报数的格子。大字用衬线、等宽数字；单位与注解压小。
 * 这一屏是用户要的「让他们看到中国有多强」—— 数字自己说话，不加形容词。
 */
function StatTiles({ lang }: { lang: Lang }) {
  return (
    <div className="relative mt-6">
      <div className="grid grid-cols-2 gap-2.5 md:grid-cols-4">
        {CITY_SCALE.tiles.map((tile) => (
          <div key={tile.id} className="trip-stat px-3.5 pb-3.5 pt-4">
            <p
              dir="ltr"
              className="trip-stat-value text-[2rem] text-navy md:text-[2.375rem]"
            >
              {t(tile.value, lang)}
            </p>
            <p className="mt-1.5 text-sm font-medium leading-5 text-navy">
              {t(tile.unit, lang)}
            </p>
            <p className="mt-1 text-sm leading-5 text-navy-soft">
              {t(tile.note, lang)}
            </p>
          </div>
        ))}
      </div>
      <p className="mt-3 text-sm leading-5 text-navy-soft/80">
        {t(UI.scaleNote, lang)}
      </p>
    </div>
  );
}

/**
 * 一节。收起来的时候只剩标题和一行提示，整份指南就是一张目录；
 * 点开才铺内容。
 */
function Section({
  id,
  title,
  hint,
  lang,
  children,
}: {
  id: string;
  title: L10n;
  hint: L10n;
  lang: Lang;
  children: React.ReactNode;
}) {
  return (
    <AccordionItem id={`guide-${id}`} value={id} className="trip-card border-b-0 px-4 md:px-5">
      <AccordionTrigger className="items-center gap-3 py-4 hover:no-underline">
        <span className="flex min-w-0 flex-col gap-0.5 text-start">
          <span className="trip-display text-lg leading-7 text-navy md:text-xl">
            {t(title, lang)}
          </span>
          <span className="text-sm leading-5 text-navy-soft/85">
            {t(hint, lang)}
          </span>
        </span>
      </AccordionTrigger>
      <AccordionContent className="space-y-3 pb-5 pt-1">
        {children}
      </AccordionContent>
    </AccordionItem>
  );
}

/** 一节里的小标题，比卡片名低一级。 */
function SubHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="flex items-center gap-2 pt-1.5 text-sm font-semibold uppercase tracking-[0.09em] text-navy-soft/85">
      <span
        aria-hidden="true"
        className="inline-block h-px w-4 bg-miniso-red/50"
      />
      {children}
    </h3>
  );
}

/**
 * 一个地点：名字、一段介绍、给司机看的中文地址、开放信息、来源。
 * 全程打车，所以中文地址那行按「举给司机看」的距离排字号，比正文大。
 */
function PlaceCardView({ place, lang }: { place: PlaceCard; lang: Lang }) {
  return (
    <article className="trip-place rounded-xl p-4">
      <h4 className="trip-display text-lg leading-7 text-navy">
        {t(place.name, lang)}
      </h4>
      <p className="mt-1.5 text-base leading-7 text-navy-soft">
        {t(place.note, lang)}
      </p>
      <div className="mt-3.5">
        <CopyChinese entry={place.copy} lang={lang} showBig />
      </div>
      {place.meta ? (
        <p className="mt-2.5 text-sm leading-6 text-navy-soft/90">
          <span className="font-medium">{t(UI.placeMeta, lang)}：</span>
          {t(place.meta, lang)}
        </p>
      ) : null}
      {place.sources.length > 0 ? (
        <ul className="mt-2.5 space-y-1">
          {place.sources.map((source) => (
            <li key={source.url}>
              <SourceLink label={source.label} url={source.url} lang={lang} />
            </li>
          ))}
        </ul>
      ) : null}
    </article>
  );
}

/** 一家商场：图、名字、一句定位、一段事实。给做招商的人看的。 */
function MallCardView({ mall, lang }: { mall: MallCard; lang: Lang }) {
  return (
    <article className="trip-place overflow-hidden rounded-xl p-4">
      {mall.imageKey && IMG[mall.imageKey] ? (
        <img
          src={IMG[mall.imageKey]}
          alt=""
          loading="lazy"
          className="trip-photo mb-3 aspect-[16/10] w-full object-cover"
        />
      ) : null}
      <h4 className="trip-display text-lg leading-7 text-navy">
        {t(mall.name, lang)}
      </h4>
      <p className="mt-0.5 text-sm font-semibold uppercase tracking-[0.06em] text-miniso-red-strong">
        {t(mall.tier, lang)}
      </p>
      <p className="mt-2 text-base leading-7 text-navy-soft">
        {t(mall.facts, lang)}
      </p>
    </article>
  );
}

export function GuideTab({
  lang,
  person,
}: {
  lang: Lang;
  person: PersonId | null;
}) {
  // 共同操作指引对所有人可见，只有借卡与备用金按人员区分。
  // 全员视图（person === null）不筛，给统筹的人看全貌。
  const prep = PREP.filter(
    (item) =>
      !item.audience || person === null || item.audience.includes(person),
  );
  return (
    <div className="guest-guide space-y-4">
      <section className="trip-card space-y-3 p-4 md:p-5" aria-label={lang === "zh" ? "随手查" : lang === "ar" ? "معلومات سريعة" : "Quick help"}>
        <h2 className="trip-display text-xl text-navy">{lang === "zh" ? "住哪里，联系谁" : lang === "ar" ? "الإقامة والتواصل" : "Your hotel and contacts"}</h2>
        <CopyChinese entry={{ ...COPY_ADDRESSES.find((entry) => entry.id === "hotel")!, label: INTERCONTINENTAL.name }} lang={lang} showBig />
        <a className="inline-flex min-h-11 items-center text-sm font-medium text-miniso-red-strong underline underline-offset-4" href="tel:+862089228888">{lang === "zh" ? "酒店前台" : lang === "ar" ? "استقبال الفندق" : "Hotel reception"} · <bdi>+86 20 8922 8888</bdi></a>
        {person === "reham" || person === null ? <p className="text-base leading-7 text-navy-soft">{lang === "zh" ? "Reham 的广州机场接送：公司安排，联系 Rahma 确认车辆与出发时间。" : lang === "ar" ? "ترتّب الشركة انتقالات Reham من مطار قوانغتشو وإليه. أكّدي السيارة ووقت الانطلاق مع Rahma." : "Reham’s Guangzhou airport transfers are arranged by the company. Confirm the vehicle and departure time with Rahma."}</p> : null}
      </section>
      <Accordion
        type="multiple"
        defaultValue={[]}
        className="space-y-2.5"
      >
        <Section
          id="prep"
          title={UI.prep}
          hint={UI.guideHints.prep}
          lang={lang}
        >
          {prep.map((item) => (
            <article key={item.id} className="trip-place rounded-xl p-4">
              <h4 className="trip-display mb-2 text-lg leading-7 text-navy">
                {t(item.title, lang)}
              </h4>
              <BulletList items={item.lines} lang={lang} />
            </article>
          ))}
          <SourceLink label={{ zh: "来华出行与支付指引", en: "Official travel and payment guide", ar: "الدليل الرسمي للتنقل والدفع" }} url="https://english.www.gov.cn/2025special/bizexpatsinchina2025" lang={lang} />
        </Section>

        <Section
          id="addresses"
          title={{ zh: "机场中文地址", en: "Airport addresses", ar: "عناوين المطار" }}
          hint={{ zh: "白云机场 T2 / T3，按航班选择", en: "Baiyun T2 / T3 — choose your flight’s terminal", ar: "بايون T2 / T3 — اختاري صالة رحلتك" }}
          lang={lang}
        >
          {COPY_ADDRESSES.filter((entry) => entry.id !== "hotel").map((entry) => (
            <CopyChinese key={entry.id} entry={entry} lang={lang} showBig />
          ))}
        </Section>

        <Section
          id="halal"
          title={UI.halal}
          hint={UI.guideHints.halal}
          lang={lang}
        >
          <div className="trip-place rounded-xl p-4">
            <BulletList items={HALAL_WHERE} lang={lang} />
          </div>

          <SubHeading>{t(UI.mosques, lang)}</SubHeading>
          {MOSQUES.map((place) => (
            <PlaceCardView key={place.id} place={place} lang={lang} />
          ))}
          <p className="trip-card-accent p-4 text-base leading-7 text-navy">
            <span className="font-semibold">{t(UI.jumuah, lang)}：</span>
            {t(JUMUAH_NOTE, lang)}
          </p>

          <SubHeading>{t(UI.halalDining, lang)}</SubHeading>
          {HALAL_DINING.map((place) => (
            <PlaceCardView key={place.id} place={place} lang={lang} />
          ))}
        </Section>

        <Section
          id="phrases"
          title={UI.phrases}
          hint={UI.guideHints.phrases}
          lang={lang}
        >
          {PHRASES.map((entry) => (
            <CopyChinese key={entry.id} entry={entry} lang={lang} showBig />
          ))}
        </Section>

        <Section
          id="routes"
          title={UI.routes}
          hint={UI.guideHints.routes}
          lang={lang}
        >
          <RouteList lang={lang} />
        </Section>

        <Section
          id="baggage"
          title={UI.baggage}
          hint={UI.guideHints.baggage}
          lang={lang}
        >
          <article className="trip-place rounded-xl p-4">
            <BaggageLines profile="sichuanEconomy" lang={lang} />
          </article>
          <article className="trip-place rounded-xl p-4">
            <BaggageLines profile="egyptairBusiness" lang={lang} />
          </article>
        </Section>

        <Section id="story" title={UI.cityStory} hint={CITY_STORY.lead} lang={lang}>
      <Prose
        eyebrow={UI.cityStory}
        lead={CITY_STORY.lead}
        paragraphs={CITY_STORY.paragraphs}
        sources={CITY_STORY.sources}
        lang={lang}
        photo="huaisheng"
      />
        </Section>
        <Section id="scale" title={UI.cityScale} hint={UI.guideHints.cityScale} lang={lang}>
      <Prose
        eyebrow={UI.cityScale}
        lead={CITY_SCALE.lead}
        paragraphs={CITY_SCALE.intro}
        sources={CITY_SCALE.sources}
        lang={lang}
        photo="skyline"
      >
        <StatTiles lang={lang} />
      </Prose>
        </Section>
        <Section id="tech" title={UI.cityTech} hint={UI.guideHints.tech} lang={lang}>
      <Prose
        eyebrow={UI.cityTech}
        lead={CITY_TECH.lead}
        paragraphs={[CITY_TECH.intro]}
        sources={CITY_TECH.sources}
        lang={lang}
        photo="robotaxi"
      >
        <div className="relative mt-5 grid gap-3 md:grid-cols-2">
          {CITY_TECH.items.map((item) => (
            <article key={item.id} className="trip-place overflow-hidden rounded-xl p-4">
              <h4 className="trip-display text-lg leading-7 text-navy">
                {t(item.title, lang)}
              </h4>
              <p className="mt-1 text-sm font-semibold uppercase tracking-[0.06em] text-miniso-red-strong">
                {t(UI.techWhere, lang)}
              </p>
              <p className="mt-0.5 text-base leading-7 text-navy">
                {t(item.where, lang)}
              </p>
              <p className="mt-2 text-base leading-7 text-navy-soft">
                {t(item.body, lang)}
              </p>
            </article>
          ))}
        </div>
      </Prose>
        </Section>

        <Section
          id="pazhou"
          title={UI.pazhou}
          hint={UI.guideHints.pazhou}
          lang={lang}
        >
          <div className="trip-place rounded-xl p-4">
            <p className="trip-display text-lg leading-7 text-navy">
              {t(PAZHOU.lead, lang)}
            </p>
            <div className="mt-3 space-y-3">
              {PAZHOU.paragraphs.map((paragraph, index) => (
                <p
                  key={index}
                  className="text-base leading-7 text-navy-soft"
                >
                  {t(paragraph, lang)}
                </p>
              ))}
            </div>
            <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1">
              {PAZHOU.sources.map((source) => (
                <li key={source.url}>
                  <SourceLink label={source.label} url={source.url} lang={lang} />
                </li>
              ))}
            </ul>
          </div>
        </Section>

        <Section
          id="food"
          title={UI.foodCulture}
          hint={UI.guideHints.foodCulture}
          lang={lang}
        >
          <div className="trip-place rounded-xl p-4">
            <p className="trip-display text-lg leading-7 text-navy">
              {t(FOOD_CULTURE.lead, lang)}
            </p>
            <div className="mt-3 space-y-3">
              {FOOD_CULTURE.paragraphs.map((paragraph, index) => (
                <p
                  key={index}
                  className="text-base leading-7 text-navy-soft"
                >
                  {t(paragraph, lang)}
                </p>
              ))}
            </div>
            <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1">
              {FOOD_CULTURE.sources.map((source) => (
                <li key={source.url}>
                  <SourceLink label={source.label} url={source.url} lang={lang} />
                </li>
              ))}
            </ul>
          </div>

          {/* 清真 / 过敏 / 食材、机上特殊餐 —— 整站只在这里说一次，
              下面每一道就只讲它本身。 */}
          <div className="trip-place rounded-xl p-4">
            <BulletList items={FOOD_ADVICE} lang={lang} />
          </div>

          <SubHeading>{t(UI.foodIdeas, lang)}</SubHeading>
          <div className="grid gap-3 md:grid-cols-2">
            {FOOD_NOTES.map((note) => (
              <article key={note.id} className="trip-place overflow-hidden rounded-xl p-4">
                {note.imageKey && IMG[note.imageKey] ? (
                  <img
                    src={IMG[note.imageKey]}
                    alt=""
                    loading="lazy"
                    className="trip-photo mb-3 aspect-[4/3] w-full object-cover"
                  />
                ) : null}
                <h4 className="trip-display text-lg leading-7 text-navy">
                  {t(note.title, lang)}
                </h4>
                <p className="mt-1.5 text-base leading-7 text-navy-soft">
                  {t(note.body, lang)}
                </p>
                {note.url ? (
                  <div className="mt-2.5">
                    <SourceLink
                      label={{
                        zh: "来源",
                        en: "Source",
                        ar: "المصدر",
                      }}
                      url={note.url}
                      lang={lang}
                    />
                  </div>
                ) : null}
              </article>
            ))}
          </div>
        </Section>

        <Section
          id="retail"
          title={UI.retail}
          hint={UI.guideHints.retail}
          lang={lang}
        >
          <div className="trip-place rounded-xl p-4">
            <DistrictRoute lang={lang} />
            <p className="trip-display text-lg leading-7 text-navy">
              {t(RETAIL_STUDY.lead, lang)}
            </p>
            <div className="mt-3 space-y-3">
              {RETAIL_STUDY.intro.map((paragraph, index) => (
                <p key={index} className="text-base leading-7 text-navy-soft">
                  {t(paragraph, lang)}
                </p>
              ))}
            </div>
          </div>

          <SubHeading>{t(UI.retailMalls, lang)}</SubHeading>
          <div className="grid gap-3 md:grid-cols-2">
            {RETAIL_STUDY.malls.map((mall) => (
              <MallCardView key={mall.id} mall={mall} lang={lang} />
            ))}
          </div>

          {/* 用户点名的案例：二十年一家一家补位，背后是集聚与竞合。 */}
          <SubHeading>{t(UI.retailCase, lang)}</SubHeading>
          <div className="trip-place space-y-3 rounded-xl p-4">
            {RETAIL_STUDY.caseStudy.map((paragraph, index) => (
              <p key={index} className="text-base leading-7 text-navy-soft">
                {t(paragraph, lang)}
              </p>
            ))}
          </div>

          <div className="trip-place rounded-xl p-4">
            {IMG.beijinglu ? (
              <img
                src={IMG.beijinglu}
                alt=""
                loading="lazy"
                className="trip-photo mb-3 aspect-[16/9] w-full object-cover"
              />
            ) : null}
            <p className="text-base leading-7 text-navy-soft">
              {t(RETAIL_STUDY.beijinglu, lang)}
            </p>
          </div>

          <ul className="flex flex-wrap gap-x-5 gap-y-1">
            {RETAIL_STUDY.sources.map((source) => (
              <li key={source.url}>
                <SourceLink label={source.label} url={source.url} lang={lang} />
              </li>
            ))}
          </ul>
        </Section>

        <Section
          id="culture"
          title={UI.culture}
          hint={UI.guideHints.culture}
          lang={lang}
        >
          <div className="grid gap-3 md:grid-cols-2">
            {CULTURE_NOTES.map((note) => (
              <article key={note.id} className="trip-place rounded-xl p-4">
                <h4 className="trip-display text-lg leading-7 text-navy">
                  {t(note.title, lang)}
                </h4>
                <p className="mt-1.5 text-base leading-7 text-navy-soft">
                  {t(note.body, lang)}
                </p>
              </article>
            ))}
          </div>
        </Section>

        <Section
          id="sources"
          title={UI.officialSources}
          hint={UI.guideHints.officialSources}
          lang={lang}
        >
          <ul className="trip-place space-y-3 rounded-xl p-4">
            {OFFICIAL_LINKS.map((link) => (
              <li key={link.id}>
                <SourceLink label={link.title} url={link.url} lang={lang} />
                <p className="mt-1 text-sm leading-6 text-navy-soft">
                  {t(link.note, lang)}
                </p>
              </li>
            ))}
          </ul>
          {/* CC 授权的条件：作者与授权要列出来 */}
          <SubHeading>{t(UI.imageCredits, lang)}</SubHeading>
          <ul className="trip-place space-y-1.5 rounded-xl p-4 text-sm leading-5 text-navy-soft">
            {IMAGE_CREDITS.map((credit) => (
              <li key={credit.key}>
                <a
                  href={credit.page}
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium text-navy underline underline-offset-4"
                >
                  {credit.title}
                </a>
                {" — "}
                {credit.artist || "Wikimedia Commons"}, {credit.license}
              </li>
            ))}
          </ul>
        </Section>
      </Accordion>
    </div>
  );
}
