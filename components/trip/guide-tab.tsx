"use client";

import {
  COPY_ADDRESSES,
  FOOD_NOTES,
  OFFICIAL_LINKS,
  PHRASES,
  PREP,
  type Lang,
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

export function GuideTab({ lang }: { lang: Lang }) {
  return (
    <div className="space-y-6">
      <section className="space-y-3">
        <SectionHeading>{t(UI.prep, lang)}</SectionHeading>
        {PREP.map((item) => (
          <article
            key={item.id}
            className="rounded-xl border border-line bg-white p-4 shadow-sm"
          >
            <h3 className="mb-2 text-base font-semibold leading-6 text-navy">
              {t(item.title, lang)}
            </h3>
            <BulletList items={item.lines} lang={lang} />
          </article>
        ))}
      </section>

      <section className="space-y-3">
        <SectionHeading>{t(UI.baggage, lang)}</SectionHeading>
        <article className="rounded-xl border border-line bg-white p-4 shadow-sm">
          <BaggageLines profile="sichuanEconomy" lang={lang} />
        </article>
        <article className="rounded-xl border border-line bg-white p-4 shadow-sm">
          <BaggageLines profile="egyptairBusiness" lang={lang} />
        </article>
      </section>

      <section className="space-y-3">
        <SectionHeading>{t(UI.copyAddresses, lang)}</SectionHeading>
        <div className="space-y-2">
          {COPY_ADDRESSES.map((entry) => (
            <CopyChinese key={entry.id} entry={entry} lang={lang} />
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <SectionHeading>{t(UI.phrases, lang)}</SectionHeading>
        <div className="space-y-2">
          {PHRASES.map((entry) => (
            <CopyChinese key={entry.id} entry={entry} lang={lang} />
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <SectionHeading>{t(UI.routes, lang)}</SectionHeading>
        <RouteList lang={lang} />
      </section>

      <section className="space-y-3">
        <SectionHeading>{t(UI.food, lang)}</SectionHeading>
        {/* 清真 / 过敏 / 食材、机上特殊餐 —— 整站只在这里说一次 */}
        <div className="rounded-xl border border-line bg-white p-4">
          <BulletList items={FOOD_ADVICE} lang={lang} />
        </div>
        <Accordion type="multiple" className="space-y-2">
          {FOOD_NOTES.map((note) => (
            <AccordionItem
              key={note.id}
              value={note.id}
              className="rounded-xl border border-line bg-white px-3"
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
      <section className="rounded-xl border border-line bg-white px-4">
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
