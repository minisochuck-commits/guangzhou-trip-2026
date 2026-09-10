"use client";

import * as React from "react";
import { InfoIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  PEOPLE,
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
import { GuideTab } from "./guide-tab";
import { OpenItemsPanel } from "./open-items";
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

        <main className="flex-1 px-4 pb-10 pt-3">
          <Hint lang={lang} />

          <Tabs defaultValue="itinerary" className="gap-4">
            <TabsList className="h-auto w-full">
              <TabsTrigger value="itinerary" className="py-2 text-base">
                {t(UI.tabs.itinerary, lang)}
              </TabsTrigger>
              <TabsTrigger value="guide" className="py-2 text-base">
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

            <TabsContent value="guide">
              <GuideTab lang={lang} />
            </TabsContent>
          </Tabs>

          <OpenItemsPanel lang={lang} />
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

/**
 * 手机上首屏很贵：标题压成一行，日期降为次要行，语言按钮紧凑，
 * 人员横滑保持 44px 点击高度。全名和职务不放在这里 —— 在日程下面的「人员」折叠里。
 */
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
      <div className="flex items-center gap-2 px-4 pt-3">
        <span
          aria-hidden="true"
          className="inline-block h-6 w-1 shrink-0 rounded-full bg-miniso-red"
        />
        <h1 className="min-w-0 flex-1 truncate text-lg font-semibold leading-7 tracking-tight text-navy">
          {t(UI.title, lang)}
        </h1>
        <div
          role="group"
          aria-label={t(UI.language, lang)}
          className="flex shrink-0 gap-1"
        >
          {LANGS.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => onLang(option.id)}
              aria-pressed={option.id === lang}
              className={cn(
                "rounded-full border px-2 py-1 text-sm font-medium leading-5 transition-colors",
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

      <p className="px-4 ps-7 text-sm font-medium uppercase tracking-wide text-miniso-red-strong">
        <Ltr>20 SEP – 07 OCT 2026</Ltr>
      </p>

      <div className="mt-2 overflow-x-auto scrollbar-none px-4">
        <div
          role="group"
          aria-label={t(UI.viewing, lang)}
          className="flex w-max gap-1.5 pb-2"
        >
          <PersonChip
            active={person === null}
            onClick={() => onPerson(null)}
            label={t(UI.everyone, lang)}
          />
          {PEOPLE.map((item) => (
            <PersonChip
              key={item.id}
              active={person === item.id}
              onClick={() => onPerson(item.id)}
              // 英文简称按票面拼法原样显示，不做音译。
              label={<Ltr>{item.short}</Ltr>}
            />
          ))}
        </div>
      </div>
    </header>
  );
}

function PersonChip({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        // 手指点得到：最小 44px 高。
        "inline-flex min-h-11 items-center rounded-full border px-3.5 text-sm font-medium transition-colors",
        active
          ? "border-miniso-red bg-miniso-red text-white"
          : "border-line bg-white text-navy hover:border-miniso-red/50",
      )}
    >
      {label}
    </button>
  );
}

/* ---------------- 折叠短提示 ---------------- */

function Hint({ lang }: { lang: Lang }) {
  return (
    <section className="mb-3 rounded-xl border border-miniso-red/40 bg-miniso-red-tint px-3">
      <Accordion type="single" collapsible>
        <AccordionItem value="hint" className="border-b-0">
          <AccordionTrigger className="py-2.5 text-sm font-semibold text-miniso-red-strong hover:no-underline">
            <span className="flex items-center gap-1.5">
              <InfoIcon className="size-4 shrink-0" aria-hidden="true" />
              {t(UI.bannerShort, lang)}
            </span>
          </AccordionTrigger>
          <AccordionContent className="pb-3">
            <p className="text-base leading-relaxed text-navy">
              {t(UI.banner, lang)}
            </p>
            <p className="mt-1.5 text-base leading-relaxed text-navy">
              {t(UI.bannerNote, lang)}
            </p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </section>
  );
}

/* ---------------- 底部：总部通知参考（可展开） ---------------- */

function ReferenceBlock({ lang }: { lang: Lang }) {
  return (
    <section className="mt-4 rounded-xl border border-line bg-white px-4">
      <Accordion type="single" collapsible>
        <AccordionItem value="reference" className="border-b-0">
          <AccordionTrigger className="py-3 text-base font-semibold text-navy hover:no-underline">
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
