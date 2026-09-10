"use client";

import {
  COPY_ADDRESSES,
  FOOD_NOTES,
  HALAL_DINING,
  HALAL_WHERE,
  JUMUAH_NOTE,
  MOSQUES,
  OFFICIAL_LINKS,
  PHRASES,
  PREP,
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
import { BulletList, CopyChinese, SectionHeading, SourceLink } from "./ui";

/**
 * 一个地点：名字、一句话特点、给司机看的中文地址、开放信息、来源。
 * 全程打车，所以中文地址这一行按「举给司机看」的距离排字号，比正文大。
 */
function PlaceCardView({ place, lang }: { place: PlaceCard; lang: Lang }) {
  return (
    <article className="trip-card p-4">
      <h4 className="trip-display text-lg leading-7 text-navy">
        {t(place.name, lang)}
      </h4>
      <p className="mt-1 text-base leading-relaxed text-navy-soft">
        {t(place.note, lang)}
      </p>
      <div className="mt-3">
        <CopyChinese entry={place.copy} lang={lang} showBig />
      </div>
      {place.meta ? (
        <p className="mt-2 text-sm leading-relaxed text-navy-soft">
          <span className="font-medium">{t(UI.placeMeta, lang)}：</span>
          {t(place.meta, lang)}
        </p>
      ) : null}
      {place.sources.length > 0 ? (
        <ul className="mt-2 space-y-1">
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
    <div className="space-y-8">
      <section className="space-y-3.5">
        <SectionHeading>{t(UI.prep, lang)}</SectionHeading>
        {PREP.map((item) => (
          <article
            key={item.id}
            className="trip-card p-4"
          >
            <h3 className="trip-display mb-2 text-lg leading-7 text-navy">
              {t(item.title, lang)}
            </h3>
            <BulletList items={item.lines} lang={lang} />
          </article>
        ))}
      </section>

      {/* 五人里四位是穆斯林：礼拜与清真餐排在行李之前，是这趟最实际的生活需求。 */}
      <section className="space-y-3.5">
        <SectionHeading>{t(UI.halal, lang)}</SectionHeading>

        <div className="trip-card p-4">
          <BulletList items={HALAL_WHERE} lang={lang} />
        </div>

        <h3 className="pt-1 text-[0.8125rem] font-semibold uppercase tracking-[0.09em] text-navy-soft/85">
          {t(UI.mosques, lang)}
        </h3>
        <div className="space-y-2">
          {MOSQUES.map((place) => (
            <PlaceCardView key={place.id} place={place} lang={lang} />
          ))}
        </div>
        <p className="trip-card-accent p-4 text-base leading-relaxed text-navy">
          <span className="font-semibold">{t(UI.jumuah, lang)}：</span>
          {t(JUMUAH_NOTE, lang)}
        </p>

        <h3 className="pt-1 text-[0.8125rem] font-semibold uppercase tracking-[0.09em] text-navy-soft/85">
          {t(UI.halalDining, lang)}
        </h3>
        <div className="space-y-2">
          {HALAL_DINING.map((place) => (
            <PlaceCardView key={place.id} place={place} lang={lang} />
          ))}
        </div>
      </section>

      <section className="space-y-3.5">
        <SectionHeading>{t(UI.baggage, lang)}</SectionHeading>
        <article className="trip-card p-4">
          <BaggageLines profile="sichuanEconomy" lang={lang} />
        </article>
        <article className="trip-card p-4">
          <BaggageLines profile="egyptairBusiness" lang={lang} />
        </article>
      </section>

      <section className="space-y-3.5">
        <SectionHeading>{t(UI.copyAddresses, lang)}</SectionHeading>
        <div className="space-y-2">
          {COPY_ADDRESSES.map((entry) => (
            <CopyChinese key={entry.id} entry={entry} lang={lang} />
          ))}
        </div>
      </section>

      <section className="space-y-3.5">
        <SectionHeading>{t(UI.phrases, lang)}</SectionHeading>
        <div className="space-y-2">
          {PHRASES.map((entry) => (
            <CopyChinese key={entry.id} entry={entry} lang={lang} />
          ))}
        </div>
      </section>

      <section className="space-y-3.5">
        <SectionHeading>{t(UI.routes, lang)}</SectionHeading>
        <RouteList lang={lang} />
      </section>

      <section className="space-y-3.5">
        <SectionHeading>{t(UI.food, lang)}</SectionHeading>
        {/* 清真 / 过敏 / 食材、机上特殊餐 —— 整站只在这里说一次 */}
        <div className="trip-card p-4">
          <BulletList items={FOOD_ADVICE} lang={lang} />
        </div>
        <Accordion type="multiple" className="space-y-2">
          {FOOD_NOTES.map((note) => (
            <AccordionItem
              key={note.id}
              value={note.id}
              className="trip-card px-3"
            >
              <AccordionTrigger className="min-h-11 py-3 text-base font-semibold text-navy hover:no-underline">
                {t(note.title, lang)}
              </AccordionTrigger>
              <AccordionContent className="space-y-2 pb-4">
                <p className="text-base leading-relaxed text-navy-soft">
                  {t(note.body, lang)}
                </p>
                {note.url ? (
                  <SourceLink
                    label={{
                      zh: "官方来源",
                      en: "Official source",
                      ar: "المصدر الرسمي",
                    }}
                    url={note.url}
                    lang={lang}
                  />
                ) : null}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* 官方来源默认折叠：查证时才需要，不该占着页尾 */}
      <section className="trip-card px-4">
        <Accordion type="single" collapsible>
          <AccordionItem value="sources" className="border-b-0">
            <AccordionTrigger className="min-h-11 py-3 text-base font-semibold text-navy hover:no-underline">
              {t(UI.officialSources, lang)}
            </AccordionTrigger>
            <AccordionContent className="pb-4">
              <ul className="space-y-2">
                {OFFICIAL_LINKS.map((link) => (
                  <li key={link.id}>
                    <SourceLink label={link.title} url={link.url} lang={lang} />
                    <p className="mt-1 text-base leading-relaxed text-navy-soft">
                      {t(link.note, lang)}
                    </p>
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>
    </div>
  );
}
