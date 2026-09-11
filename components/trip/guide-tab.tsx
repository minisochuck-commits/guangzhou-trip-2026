"use client";

import * as React from "react";

import {
  CITY_STORY,
  COPY_ADDRESSES,
  FOOD_NOTES,
  HALAL_DINING,
  HALAL_WHERE,
  JUMUAH_NOTE,
  MOSQUES,
  OFFICIAL_LINKS,
  PHRASES,
  PREP,
  type L10n,
  type Lang,
  type PlaceCard,
} from "@/lib/trip-data";
import { FOOD_ADVICE } from "@/lib/plan-presentation";
import { UI, t } from "@/lib/trip-i18n";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { BaggageLines } from "./flight-details";
import { RouteList } from "./routes";
import { BulletList, CopyChinese, SourceLink } from "./ui";

/**
 * 光塔 —— 怀圣寺旁那座三十六米的阿拉伯式砖塔，广州老城最老的东西之一。
 * 手画的线稿，不引外部图片，离线照样在。
 */
function LightTower({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 150"
      fill="none"
      aria-hidden="true"
      className={className}
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* 塔身：下粗上细 */}
      <path d="M13 140 L17.5 52" />
      <path d="M35 140 L30.5 52" />
      {/* 砖砌的横向分层 */}
      <path d="M14.6 108 L33.4 108" opacity=".55" />
      <path d="M15.6 88 L32.4 88" opacity=".55" />
      <path d="M16.4 70 L31.6 70" opacity=".55" />
      {/* 基座 */}
      <path d="M9 140 L39 140" />
      <path d="M11 146 L37 146" />
      <path d="M9 140 L11 146 M39 140 L37 146" />
      {/* 塔门：尖拱 */}
      <path d="M20 140 L20 128 Q24 121 28 128 L28 140" />
      {/* 出挑的平台 */}
      <path d="M12 52 L36 52" />
      <path d="M14 46 L34 46" />
      <path d="M12 52 L14 46 M36 52 L34 46" />
      {/* 上层小塔 */}
      <path d="M19 46 L19 34 M29 46 L29 34" />
      <path d="M19 34 L29 34" opacity=".55" />
      {/* 圆顶与塔尖 */}
      <path d="M18 34 Q24 18 30 34" />
      <path d="M24 18 L24 9" />
      <circle cx="24" cy="7" r="2" />
    </svg>
  );
}

/**
 * 指南开头那段：这座城和阿拉伯世界的关系。
 * 不折叠 —— 它是整份指南里最该被看到的一段。
 * 排版按「读一段文章」做：衬线、宽行距、首句放大，不是又一张白盒子。
 */
function CityStory({ lang }: { lang: Lang }) {
  return (
    <section className="trip-story relative overflow-hidden rounded-2xl px-5 py-6 md:px-8 md:py-8">
      <LightTower className="pointer-events-none absolute end-3 top-4 h-[9.5rem] w-auto text-miniso-red opacity-[0.17] md:end-8 md:h-[13rem]" />
      <div className="relative max-w-[36rem] pe-14 md:pe-24">
        <p className="text-[0.8125rem] font-semibold uppercase tracking-[0.14em] text-miniso-red-strong">
          {t(UI.cityStory, lang)}
        </p>
        <p className="trip-display mt-2.5 text-[1.375rem] leading-9 text-navy md:text-[1.625rem] md:leading-10">
          {t(CITY_STORY.lead, lang)}
        </p>
        <div className="mt-4 space-y-3.5">
          {CITY_STORY.paragraphs.map((paragraph, index) => (
            <p
              key={index}
              className="text-[0.9375rem] leading-7 text-navy-soft md:text-base md:leading-8"
            >
              {t(paragraph, lang)}
            </p>
          ))}
        </div>
        <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-1">
          {CITY_STORY.sources.map((source) => (
            <li key={source.url}>
              <SourceLink label={source.label} url={source.url} lang={lang} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/**
 * 一节。收起来的时候只剩标题和一行提示，整份指南就是一张目录；
 * 点开才铺内容 —— 之前全部摊开，一屏看不完，翻到底都是一样的白盒子。
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
    <AccordionItem value={id} className="trip-card border-b-0 px-4 md:px-5">
      <AccordionTrigger className="items-center gap-3 py-4 hover:no-underline">
        <span className="flex min-w-0 flex-col gap-0.5 text-start">
          <span className="trip-display text-lg leading-7 text-navy md:text-xl">
            {t(title, lang)}
          </span>
          <span className="text-[0.8125rem] leading-5 text-navy-soft/85">
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
    <h3 className="flex items-center gap-2 pt-1.5 text-[0.8125rem] font-semibold uppercase tracking-[0.09em] text-navy-soft/85">
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
      <p className="mt-1.5 text-[0.9375rem] leading-7 text-navy-soft">
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

export function GuideTab({ lang }: { lang: Lang }) {
  return (
    <div className="space-y-4">
      <CityStory lang={lang} />

      {/* 默认只展开「礼拜与清真餐」—— 五人里四位是穆斯林，这节用得最多。 */}
      <Accordion
        type="multiple"
        defaultValue={["halal"]}
        className="space-y-2.5"
      >
        <Section
          id="prep"
          title={UI.prep}
          hint={UI.guideHints.prep}
          lang={lang}
        >
          {PREP.map((item) => (
            <article key={item.id} className="trip-place rounded-xl p-4">
              <h4 className="trip-display mb-2 text-lg leading-7 text-navy">
                {t(item.title, lang)}
              </h4>
              <BulletList items={item.lines} lang={lang} />
            </article>
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
          <p className="trip-card-accent p-4 text-[0.9375rem] leading-7 text-navy">
            <span className="font-semibold">{t(UI.jumuah, lang)}：</span>
            {t(JUMUAH_NOTE, lang)}
          </p>

          <SubHeading>{t(UI.halalDining, lang)}</SubHeading>
          {HALAL_DINING.map((place) => (
            <PlaceCardView key={place.id} place={place} lang={lang} />
          ))}
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

        <Section
          id="addresses"
          title={UI.copyAddresses}
          hint={UI.guideHints.copyAddresses}
          lang={lang}
        >
          {COPY_ADDRESSES.map((entry) => (
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
          id="routes"
          title={UI.routes}
          hint={UI.guideHints.routes}
          lang={lang}
        >
          <RouteList lang={lang} />
        </Section>

        <Section
          id="food"
          title={UI.food}
          hint={UI.guideHints.food}
          lang={lang}
        >
          {/* 清真 / 过敏 / 食材、机上特殊餐 —— 整站只在这里说一次，
              下面每道吃的就只讲它本身。 */}
          <div className="trip-place rounded-xl p-4">
            <BulletList items={FOOD_ADVICE} lang={lang} />
          </div>
          {FOOD_NOTES.map((note) => (
            <article key={note.id} className="trip-place rounded-xl p-4">
              <h4 className="trip-display text-lg leading-7 text-navy">
                {t(note.title, lang)}
              </h4>
              <p className="mt-1.5 text-[0.9375rem] leading-7 text-navy-soft">
                {t(note.body, lang)}
              </p>
              {note.url ? (
                <div className="mt-2.5">
                  <SourceLink
                    label={{
                      zh: "官方来源",
                      en: "Official source",
                      ar: "المصدر الرسمي",
                    }}
                    url={note.url}
                    lang={lang}
                  />
                </div>
              ) : null}
            </article>
          ))}
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
        </Section>
      </Accordion>
    </div>
  );
}
