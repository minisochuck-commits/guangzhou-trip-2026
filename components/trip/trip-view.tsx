"use client";

import * as React from "react";
import { InfoIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  GROUPS,
  PEOPLE,
  PERSON_MAP,
  REFERENCE_IMAGES,
  REFERENCE_SUMMARY,
  type Lang,
  type PersonId,
} from "@/lib/trip-data";
import { DEFAULT_LANG, LANGS, UI, dirOf, t } from "@/lib/trip-i18n";
import { DirectionProvider } from "@/components/ui/direction";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ItineraryTab, anchorDates } from "./itinerary-tab";
import { LogisticsTab } from "./logistics-tab";
import { GuideTab } from "./guide-tab";
import { BulletList, Ltr } from "./ui";

const FIRST_DATE = "2026-09-20";

export function TripView() {
  const [lang, setLang] = React.useState<Lang>(DEFAULT_LANG);
  const [person, setPerson] = React.useState<PersonId | null>(null);
  const [activeDate, setActiveDate] = React.useState<string>(FIRST_DATE);

  const dir = dirOf(lang);

  // 语言切换时同步 <html lang/dir>，让浏览器的断词、朗读和 RTL 生效。
  React.useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
  }, [lang, dir]);

  // 切换查看对象后当前日期可能对这个人没有安排。这里在渲染时就落到他最近的一天，
  // 不改写 state：用户原本选的日期在切回「全部」时仍然有效。
  const dates = React.useMemo(() => anchorDates(person), [person]);
  const effectiveDate = dates.includes(activeDate)
    ? activeDate
    : (dates.find((date) => date >= activeDate) ??
      dates[dates.length - 1] ??
      FIRST_DATE);

  const focusPerson = person ? PERSON_MAP[person] : null;

  return (
    <DirectionProvider dir={dir}>
      <div
        dir={dir}
        lang={lang}
        className="trip-root mx-auto flex min-h-dvh w-full max-w-[42rem] flex-col bg-white"
      >
        <Header
          lang={lang}
          onLang={setLang}
          person={person}
          onPerson={setPerson}
        />

        <main className="flex-1 px-4 pb-10 pt-4">
          <Banner lang={lang} />

          {focusPerson ? (
            <p className="mb-4 rounded-xl bg-navy-tint px-3 py-2.5 text-base leading-relaxed text-navy">
              <Ltr className="font-semibold">{focusPerson.ticketName}</Ltr>
              <span className="mx-1.5 opacity-40">·</span>
              {t(focusPerson.role, lang)}
              <span className="mx-1.5 opacity-40">·</span>
              {t(GROUPS[focusPerson.group], lang)}
            </p>
          ) : null}

          <Tabs defaultValue="itinerary" className="gap-4">
            <TabsList className="h-auto w-full">
              <TabsTrigger value="itinerary" className="py-1.5 text-base">
                {t(UI.tabs.itinerary, lang)}
              </TabsTrigger>
              <TabsTrigger value="logistics" className="py-1.5 text-base">
                {t(UI.tabs.logistics, lang)}
              </TabsTrigger>
              <TabsTrigger value="guide" className="py-1.5 text-base">
                {t(UI.tabs.guide, lang)}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="itinerary">
              <ItineraryTab
                lang={lang}
                person={person}
                dates={dates}
                activeDate={effectiveDate}
                onSelectDate={setActiveDate}
              />
            </TabsContent>

            <TabsContent value="logistics">
              <LogisticsTab lang={lang} person={person} />
            </TabsContent>

            <TabsContent value="guide">
              <GuideTab lang={lang} />
            </TabsContent>
          </Tabs>

          <ReferenceBlock lang={lang} />

          <p className="mt-6 text-sm leading-relaxed text-navy-soft">
            {t(UI.footer, lang)}
          </p>
        </main>
      </div>
    </DirectionProvider>
  );
}

/* ---------------- 顶部 ---------------- */

function Header({
  lang,
  onLang,
  person,
  onPerson,
}: {
  lang: Lang;
  onLang: (lang: Lang) => void;
  person: PersonId | null;
  onPerson: (person: PersonId | null) => void;
}) {
  return (
    <header className="sticky top-0 z-20 border-b border-line bg-white/95 backdrop-blur-sm">
      <div className="flex items-start gap-3 px-4 pt-4">
        <span
          aria-hidden="true"
          className="mt-1 inline-block h-8 w-1.5 shrink-0 rounded-full bg-miniso-red"
        />
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-semibold leading-8 tracking-tight text-navy">
            {t(UI.title, lang)}
          </h1>
          <p className="text-base leading-6 text-navy-soft">
            {t(UI.titleAlt, lang)}
          </p>
          <p className="mt-0.5 text-sm font-medium uppercase tracking-wide text-miniso-red-strong">
            <Ltr>20 SEP – 07 OCT 2026</Ltr>
          </p>
        </div>
      </div>

      <div className="-mx-0 mt-3 overflow-x-auto scrollbar-none px-4">
        <div
          role="group"
          aria-label={t(UI.language, lang)}
          className="flex w-max gap-1.5 pb-2"
        >
          {LANGS.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => onLang(option.id)}
              aria-pressed={option.id === lang}
              className={cn(
                "rounded-full border px-3 py-1 text-sm font-medium transition-colors",
                option.id === lang
                  ? "border-navy bg-navy text-white"
                  : "border-line bg-white text-navy hover:border-navy/40",
              )}
            >
              <span dir={option.dir}>{option.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto scrollbar-none px-4">
        <div
          role="group"
          aria-label={t(UI.viewing, lang)}
          className="flex w-max gap-1.5 pb-3"
        >
          <button
            type="button"
            onClick={() => onPerson(null)}
            aria-pressed={person === null}
            className={cn(
              "rounded-full border px-3 py-1 text-sm font-medium transition-colors",
              person === null
                ? "border-miniso-red bg-miniso-red text-white"
                : "border-line bg-white text-navy hover:border-miniso-red/50",
            )}
          >
            {t(UI.everyone, lang)}
          </button>
          {PEOPLE.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onPerson(item.id)}
              aria-pressed={person === item.id}
              className={cn(
                "rounded-full border px-3 py-1 text-sm font-medium transition-colors",
                person === item.id
                  ? "border-miniso-red bg-miniso-red text-white"
                  : "border-line bg-white text-navy hover:border-miniso-red/50",
              )}
            >
              <Ltr>{item.short}</Ltr>
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}

/* ---------------- 顶部提示条 ---------------- */

function Banner({ lang }: { lang: Lang }) {
  return (
    <div className="mb-4 rounded-xl border border-miniso-red/40 bg-miniso-red-tint p-3.5">
      <p className="flex items-start gap-2 text-base font-semibold leading-6 text-miniso-red-strong">
        <InfoIcon className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
        <span>{t(UI.banner, lang)}</span>
      </p>
      <p className="mt-1.5 ps-7 text-base leading-relaxed text-navy">
        {t(UI.bannerNote, lang)}
      </p>
    </div>
  );
}

/* ---------------- 底部：总部通知参考（可展开） ---------------- */

function ReferenceBlock({ lang }: { lang: Lang }) {
  return (
    <section className="mt-6 rounded-xl border border-line bg-white px-4">
      <Accordion type="single" collapsible>
        <AccordionItem value="reference" className="border-b-0">
          <AccordionTrigger className="text-base font-semibold text-navy hover:no-underline">
            {t(UI.reference, lang)}
          </AccordionTrigger>
          <AccordionContent className="pb-4">
            <ul className="mb-3 space-y-3">
              {REFERENCE_IMAGES.map((image) => (
                <li key={image.id}>
                  {/* 参考图按原图比例展示，不做裁切，不当 hero 用 */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image.src}
                    alt={t(image.caption, lang)}
                    loading="lazy"
                    className="w-full rounded-lg border border-line"
                  />
                  <p className="mt-1.5 text-base leading-relaxed text-navy-soft">
                    {t(image.caption, lang)}
                  </p>
                </li>
              ))}
            </ul>
            <BulletList items={REFERENCE_SUMMARY} lang={lang} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </section>
  );
}
