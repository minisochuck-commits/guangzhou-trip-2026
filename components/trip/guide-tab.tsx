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
import { PrepChecklist } from "./prep-checklist";
import { RouteList } from "./routes";
import {
  BulletList,
  CopyChinese,
  SectionHeading,
  SourceLink,
} from "./ui";

/** 顶上那张「住哪里、打给谁」用的文案。整份指南只在这里写一次酒店。 */
const HOTEL_LABELS = {
  eyebrow: {
    zh: "住宿与联系",
    en: "Where you stay",
    ar: "مكان الإقامة",
  },
  address: {
    zh: "酒店地址（给司机看）",
    en: "Hotel address (show the driver)",
    ar: "عنوان الفندق (اعرضيه على السائق)",
  },
  reception: {
    zh: "酒店前台",
    en: "Hotel reception",
    ar: "استقبال الفندق",
  },
  transfer: {
    zh: "Reham 的广州机场接送：公司安排，联系 Rahma 确认车辆与出发时间。",
    en: "Reham’s Guangzhou airport transfers are arranged by the company. Confirm the vehicle and departure time with Rahma.",
    ar: "ترتّب الشركة انتقالات Reham من مطار قوانغتشو وإليه. أكّدي السيارة ووقت الانطلاق مع Rahma.",
  },
} satisfies Record<string, L10n>;

const HOTEL_PHONE = "+86 20 8922 8888";

/**
 * 一段要被「读」的文字：一句大字、几段正文、来源。
 * 指南里几处用它 —— 广州与你们、你们住的这块地、食在广州。
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
  lead: L10n;
  paragraphs: L10n[];
  sources: { label: L10n; url: string }[];
  lang: Lang;
  /** 顶上压一张满宽照片（public/images 的 key）。 */
  photo?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="relative py-1">
      {photo && IMG[photo] ? (
        <img
          src={IMG[photo]}
          alt=""
          loading="lazy"
          className="trip-photo mb-5 aspect-[16/9] w-full object-cover md:aspect-[21/9]"
        />
      ) : null}
      <div className="relative max-w-[44rem]">
        <p className="trip-display text-[1.3125rem] leading-9 text-navy md:text-[1.5rem] md:leading-10">
          {t(lead, lang)}
        </p>
        <div className="mt-3.5 space-y-3.5">
          {paragraphs.map((paragraph, index) => (
            <p key={index} className="text-base leading-7 text-navy-soft md:leading-8">
              {t(paragraph, lang)}
            </p>
          ))}
        </div>
      </div>
      {children}
      <Sources sources={sources} lang={lang} />
    </section>
  );
}

/** 来源收起来放在末尾：要核对的人点得开，读文章的人不被链接打断。 */
function Sources({
  sources,
  lang,
}: {
  sources: { label: L10n; url: string }[];
  lang: Lang;
}) {
  if (sources.length === 0) return null;
  return (
    <details className="mt-4">
      <summary className="inline-flex min-h-11 cursor-pointer items-center text-sm text-navy-soft">
        {lang === "zh" ? "资料来源" : lang === "ar" ? "المصادر" : "Sources"}
      </summary>
      <ul className="flex flex-wrap gap-x-5 gap-y-1 pb-1">
        {sources.map((source) => (
          <li key={source.url}>
            <SourceLink label={source.label} url={source.url} lang={lang} />
          </li>
        ))}
      </ul>
    </details>
  );
}

/**
 * 报数的格子。大字用衬线、等宽数字；单位与注解压小。
 * 数字自己说话，不加形容词。
 */
function StatTiles({ lang }: { lang: Lang }) {
  return (
    <div className="relative mt-6">
      <div className="grid grid-cols-2 gap-2.5 md:grid-cols-4">
        {CITY_SCALE.tiles.map((tile) => (
          <div key={tile.id} className="trip-stat px-3.5 pb-3.5 pt-4">
            {/* 390px 两栏时每格只有 130px 可用，「310,000」这种带逗号的数字
                断不开：手机上排 28px，放得下；桌面再放大。 */}
            <p
              dir="ltr"
              className="trip-stat-value text-[1.75rem] text-navy md:text-[2.375rem]"
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
 * 一组同类的入口，共用一张卡：组标题在外面，里面每一节只隔一条细线。
 * 上一版是每一节各自一张白卡 —— 十几张长相一样的卡片叠下来，分不出哪件事更要紧。
 */
function SectionGroup({
  title,
  lang,
  children,
}: {
  title: L10n;
  lang: Lang;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-2.5">
      <SectionHeading>{t(title, lang)}</SectionHeading>
      <Accordion
        type="multiple"
        defaultValue={[]}
        className="trip-card px-4 md:px-5"
      >
        {children}
      </Accordion>
    </section>
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
    <AccordionItem
      id={`guide-${id}`}
      value={id}
      className="border-b border-card-line last:border-b-0"
    >
      <AccordionTrigger className="min-h-14 items-center gap-3 py-3 hover:no-underline">
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

/** 一节里的小标题，比节标题低一级。 */
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

/** 一家商场：有图就配一张小图，名字、一句定位、一段可以边走边看的事实。 */
function MallRow({ mall, lang }: { mall: MallCard; lang: Lang }) {
  return (
    <li className="flex gap-3 border-b border-card-line py-3.5 last:border-b-0">
      {mall.imageKey && IMG[mall.imageKey] ? (
        <img
          src={IMG[mall.imageKey]}
          alt=""
          loading="lazy"
          width={96}
          height={72}
          className="trip-photo h-[72px] w-24 shrink-0 object-cover"
        />
      ) : null}
      <div className="min-w-0">
        <h4 className="trip-display text-lg leading-7 text-navy">
          {t(mall.name, lang)}
        </h4>
        <p className="text-sm font-semibold uppercase leading-5 tracking-[0.06em] text-miniso-red-strong">
          {t(mall.tier, lang)}
        </p>
        <p className="mt-1.5 text-base leading-7 text-navy-soft">
          {t(mall.facts, lang)}
        </p>
      </div>
    </li>
  );
}

export function GuideTab({
  lang,
  person,
}: {
  lang: Lang;
  person: PersonId | null;
}) {
  const hotel = COPY_ADDRESSES.find((entry) => entry.id === "hotel");
  return (
    <div className="guest-guide space-y-6">
      {/* 最先要用的东西：住哪、地址给司机看、前台电话。整份指南只写一次。 */}
      <section className="trip-card p-4 md:p-5" aria-labelledby="guide-hotel">
        <p className="text-sm font-semibold uppercase leading-5 tracking-[0.08em] text-navy-soft/80">
          {t(HOTEL_LABELS.eyebrow, lang)}
        </p>
        <h2
          id="guide-hotel"
          className="trip-display mt-0.5 text-xl leading-8 text-navy md:text-2xl"
        >
          {t(INTERCONTINENTAL.name, lang)}
        </h2>
        {hotel ? (
          <div className="mt-3">
            <CopyChinese
              entry={{ ...hotel, label: HOTEL_LABELS.address }}
              lang={lang}
              showBig
            />
          </div>
        ) : null}
        <a
          className="mt-1 inline-flex min-h-11 items-center gap-2 text-base font-medium text-miniso-red-strong underline underline-offset-4"
          href={`tel:${HOTEL_PHONE.replace(/\s/g, "")}`}
        >
          {t(HOTEL_LABELS.reception, lang)}
          <bdi dir="ltr">{HOTEL_PHONE}</bdi>
        </a>
        {person === "reham" || person === null ? (
          <p className="mt-1 text-base leading-7 text-navy-soft">
            {t(HOTEL_LABELS.transfer, lang)}
          </p>
        ) : null}
      </section>

      <SectionGroup title={UI.guideGroups.practical} lang={lang}>
        <Section id="prep" title={UI.prep} hint={UI.guideHints.prep} lang={lang}>
          <PrepChecklist lang={lang} person={person} />
          <SourceLink
            label={{
              zh: "来华出行与支付指引",
              en: "Official travel and payment guide",
              ar: "الدليل الرسمي للتنقل والدفع",
            }}
            url="https://english.www.gov.cn/2025special/bizexpatsinchina2025"
            lang={lang}
          />
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
          id="halal"
          title={UI.halal}
          hint={UI.guideHints.halal}
          lang={lang}
        >
          <BulletList items={HALAL_WHERE} lang={lang} />

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
          <div className="space-y-4">
            <BaggageLines profile="sichuanEconomy" lang={lang} />
            <div className="border-t border-card-line pt-4">
              <BaggageLines profile="egyptairBusiness" lang={lang} />
            </div>
          </div>
        </Section>
      </SectionGroup>

      <SectionGroup title={UI.guideGroups.city} lang={lang}>
        <Section id="story" title={UI.cityStory} hint={CITY_STORY.lead} lang={lang}>
          <Prose
            lead={CITY_STORY.lead}
            paragraphs={CITY_STORY.paragraphs}
            sources={CITY_STORY.sources}
            lang={lang}
            photo="huaisheng"
          />
        </Section>

        <Section id="scale" title={UI.cityScale} hint={UI.guideHints.cityScale} lang={lang}>
          <Prose
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
            lead={CITY_TECH.lead}
            paragraphs={[CITY_TECH.intro]}
            sources={CITY_TECH.sources}
            lang={lang}
            photo="robotaxi"
          >
            <ul className="relative mt-5 grid gap-x-6 md:grid-cols-2">
              {CITY_TECH.items.map((item) => (
                <li
                  key={item.id}
                  className="border-b border-card-line py-3.5 last:border-b-0 md:[&:nth-last-child(2)]:border-b-0"
                >
                  <h4 className="trip-display text-lg leading-7 text-navy">
                    {t(item.title, lang)}
                  </h4>
                  <p className="mt-1 text-sm font-semibold uppercase leading-5 tracking-[0.06em] text-miniso-red-strong">
                    {t(UI.techWhere, lang)}
                  </p>
                  <p className="text-base leading-7 text-navy">
                    {t(item.where, lang)}
                  </p>
                  <p className="mt-1.5 text-base leading-7 text-navy-soft">
                    {t(item.body, lang)}
                  </p>
                </li>
              ))}
            </ul>
          </Prose>
        </Section>

        <Section
          id="pazhou"
          title={UI.pazhou}
          hint={UI.guideHints.pazhou}
          lang={lang}
        >
          <Prose
            lead={PAZHOU.lead}
            paragraphs={PAZHOU.paragraphs}
            sources={PAZHOU.sources}
            lang={lang}
          />
        </Section>

        <Section
          id="food"
          title={UI.foodCulture}
          hint={UI.guideHints.foodCulture}
          lang={lang}
        >
          <Prose
            lead={FOOD_CULTURE.lead}
            paragraphs={FOOD_CULTURE.paragraphs}
            sources={FOOD_CULTURE.sources}
            lang={lang}
          >
            {/* 清真 / 过敏 / 食材、机上特殊餐 —— 整站只在这里说一次，
                下面每一道就只讲它本身。 */}
            <BulletList items={FOOD_ADVICE} lang={lang} className="mt-4" />
          </Prose>

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
          <DistrictRoute lang={lang} />

          <p className="trip-display text-[1.3125rem] leading-9 text-navy">
            {t(RETAIL_STUDY.lead, lang)}
          </p>
          <div className="space-y-3">
            {RETAIL_STUDY.intro.map((paragraph, index) => (
              <p key={index} className="text-base leading-7 text-navy-soft">
                {t(paragraph, lang)}
              </p>
            ))}
          </div>

          <SubHeading>{t(UI.retailMalls, lang)}</SubHeading>
          <ul className="border-t border-card-line">
            {RETAIL_STUDY.malls.map((mall) => (
              <MallRow key={mall.id} mall={mall} lang={lang} />
            ))}
          </ul>

          <SubHeading>{t(UI.retailCase, lang)}</SubHeading>
          <div className="space-y-3">
            {RETAIL_STUDY.caseStudy.map((paragraph, index) => (
              <p key={index} className="text-base leading-7 text-navy-soft">
                {t(paragraph, lang)}
              </p>
            ))}
          </div>

          <div className="pt-1">
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

          <Sources sources={RETAIL_STUDY.sources} lang={lang} />
        </Section>

        <Section
          id="culture"
          title={UI.culture}
          hint={UI.guideHints.culture}
          lang={lang}
        >
          <ul className="border-t border-card-line">
            {CULTURE_NOTES.map((note) => (
              <li key={note.id} className="border-b border-card-line py-3.5">
                <h4 className="trip-display text-lg leading-7 text-navy">
                  {t(note.title, lang)}
                </h4>
                <p className="mt-1 text-base leading-7 text-navy-soft">
                  {t(note.body, lang)}
                </p>
              </li>
            ))}
          </ul>
        </Section>

        <Section
          id="sources"
          title={UI.officialSources}
          hint={UI.guideHints.officialSources}
          lang={lang}
        >
          <ul className="space-y-3">
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
          <ul className="space-y-1.5 text-sm leading-5 text-navy-soft">
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
      </SectionGroup>
    </div>
  );
}
