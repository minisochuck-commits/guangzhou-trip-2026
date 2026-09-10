"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { datesForPerson } from "@/lib/person-day-plan";
import {
  PEOPLE,
  PERSON_MAP,
  type Lang,
  type PersonId,
} from "@/lib/trip-data";
import { DEFAULT_LANG, LANGS, UI, dirOf, t } from "@/lib/trip-i18n";
import { DirectionProvider } from "@/components/ui/direction";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DayTab } from "./day-tab";
import { GuideTab } from "./guide-tab";
import { Ltr } from "./ui";

const FIRST_DATE = "2026-09-20";
/** 默认看 Reham 的行程（用户拍板），不是全员。 */
const DEFAULT_PERSON: PersonId = "reham";

export function TripView() {
  const [lang, setLang] = React.useState<Lang>(DEFAULT_LANG);
  const [person, setPerson] = React.useState<PersonId | null>(DEFAULT_PERSON);
  const [activeDate, setActiveDate] = React.useState<string>(FIRST_DATE);

  const dir = dirOf(lang);

  React.useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
  }, [lang, dir]);

  // 切换查看对象后，当前日期可能对这个人没有安排。渲染时落到他最近的一天，
  // 不改写 state，切回「全部」还能回到原来选的日期。
  const dates = React.useMemo(() => datesForPerson(person), [person]);
  const effectiveDate = dates.includes(activeDate)
    ? activeDate
    : (dates.find((date) => date >= activeDate) ??
      dates[dates.length - 1] ??
      FIRST_DATE);

  // sticky 页头的高度写进 CSS 变量，日期条 + 列头就能粘在它正下方。
  // 高度随语言、换行、人员 chip 变化，所以用 ResizeObserver 而不是写死。
  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const headerRef = React.useRef<HTMLElement | null>(null);
  React.useEffect(() => {
    const root = rootRef.current;
    const header = headerRef.current;
    if (!root || !header) return;
    const apply = () =>
      root.style.setProperty("--trip-header-h", `${header.offsetHeight}px`);
    apply();
    const observer = new ResizeObserver(apply);
    observer.observe(header);
    return () => observer.disconnect();
  }, []);

  return (
    <DirectionProvider dir={dir}>
      <div
        ref={rootRef}
        dir={dir}
        lang={lang}
        className="trip-root mx-auto flex min-h-dvh w-full max-w-[42rem] flex-col bg-white md:max-w-[75rem]"
      >
        <Header
          ref={headerRef}
          lang={lang}
          onLang={setLang}
          person={person}
          onPerson={setPerson}
        />

        <main className="flex-1 px-4 pb-10 pt-3 md:px-8">
          <Tabs defaultValue="day" className="gap-4">
            <TabsList className="h-auto w-full">
              <TabsTrigger value="day" className="py-2 text-base">
                {t(UI.tabs.day, lang)}
              </TabsTrigger>
              <TabsTrigger value="guide" className="py-2 text-base">
                {t(UI.tabs.guide, lang)}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="day">
              <DayTab
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
  ref,
  lang,
  onLang,
  person,
  onPerson,
}: {
  ref: React.Ref<HTMLElement>;
  lang: Lang;
  onLang: (lang: Lang) => void;
  person: PersonId | null;
  onPerson: (person: PersonId | null) => void;
}) {
  const chipScrollerRef = React.useRef<HTMLDivElement | null>(null);
  const activeChipRef = React.useRef<HTMLButtonElement | null>(null);

  // 选中的人 chip 必须看得见，否则用户不知道正在看谁。只滚这条横向容器。
  React.useEffect(() => {
    const scroller = chipScrollerRef.current;
    const chip = activeChipRef.current;
    if (!scroller || !chip) return;
    const box = scroller.getBoundingClientRect();
    const rect = chip.getBoundingClientRect();
    if (rect.left >= box.left && rect.right <= box.right) return;
    scroller.scrollBy({
      left: rect.left + rect.width / 2 - (box.left + box.width / 2),
      behavior: "smooth",
    });
  }, [person, lang]);

  const viewingLabel = person ? PERSON_MAP[person].name : t(UI.everyone, lang);

  return (
    <header
      ref={ref}
      className="sticky top-0 z-20 border-b border-line bg-white/95 backdrop-blur-sm"
    >
      <div className="flex items-center gap-2 px-4 pt-2">
        <span
          aria-hidden="true"
          className="inline-block h-5 w-1 shrink-0 rounded-full bg-miniso-red"
        />
        <h1 className="min-w-0 flex-1 truncate text-base font-semibold leading-6 tracking-tight text-navy">
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

      {/* 日期区间 + 当前筛选对象放同一行：chip 滑出视野也知道在看谁 */}
      <p className="flex flex-wrap items-baseline gap-x-2 px-4 ps-7 text-sm leading-5">
        <span className="font-medium uppercase tracking-wide text-miniso-red-strong">
          <Ltr>20 SEP – 07 OCT 2026</Ltr>
        </span>
        <span className="text-navy-soft">
          {t(UI.viewingNow, lang)}:{" "}
          <Ltr className="font-semibold text-navy">{viewingLabel}</Ltr>
        </span>
      </p>

      <div
        ref={chipScrollerRef}
        className="mt-1.5 overflow-x-auto scrollbar-none px-4"
      >
        <div
          role="group"
          aria-label={t(UI.viewing, lang)}
          className="flex w-max gap-1.5 pb-2"
        >
          <PersonChip
            ref={person === null ? activeChipRef : undefined}
            active={person === null}
            onClick={() => onPerson(null)}
            label={t(UI.everyone, lang)}
          />
          {PEOPLE.map((item) => (
            <PersonChip
              key={item.id}
              ref={person === item.id ? activeChipRef : undefined}
              active={person === item.id}
              onClick={() => onPerson(item.id)}
              label={<Ltr>{item.name}</Ltr>}
            />
          ))}
        </div>
      </div>
    </header>
  );
}

function PersonChip({
  ref,
  active,
  onClick,
  label,
}: {
  ref?: React.Ref<HTMLButtonElement>;
  active: boolean;
  onClick: () => void;
  label: React.ReactNode;
}) {
  return (
    <button
      ref={ref}
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

