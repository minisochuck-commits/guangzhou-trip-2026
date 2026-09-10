"use client";

import {
  COPY_ADDRESSES,
  FOOD_NOTES,
  OFFICIAL_LINKS,
  PHRASES,
  PREP,
  type Lang,
} from "@/lib/trip-data";
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
          <BaggageLines profile="sichuanEconomy" lang={lang} withSources />
        </article>
        <article className="rounded-xl border border-line bg-white p-4 shadow-sm">
          <BaggageLines profile="egyptairBusiness" lang={lang} withSources />
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

      <section className="space-y-3">
        <SectionHeading>{t(UI.officialSources, lang)}</SectionHeading>
        <ul className="space-y-2">
          {OFFICIAL_LINKS.map((link) => (
            <li key={link.id} className="rounded-lg border border-line bg-white p-3">
              <SourceLink label={link.title} url={link.url} lang={lang} />
              <p className="mt-1 text-base leading-relaxed text-navy-soft">
                {t(link.note, lang)}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
