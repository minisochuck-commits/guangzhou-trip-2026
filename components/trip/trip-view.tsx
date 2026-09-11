"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { datesForPerson } from "@/lib/person-day-plan";
import { PEOPLE, type Lang, type PersonId } from "@/lib/trip-data";
import { DEFAULT_LANG, LANGS, UI, dirOf, t } from "@/lib/trip-i18n";
import { DirectionProvider } from "@/components/ui/direction";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DayTab } from "./day-tab";
import { GuideTab } from "./guide-tab";
import { OfflineReady } from "./offline-ready";
import { Ltr } from "./ui";

const FIRST_DATE = "2026-09-20";
/** 默认看 Reham 的行程（用户拍板），不是全员。 */
const DEFAULT_PERSON: PersonId = "reham";

/**
 * 每个人一条自己的链接，中国同事另有一条看全员的：
 *   ?p=reham&lang=ar   打开就是 Reham 的行程、阿拉伯语
 *   ?p=all             统筹用，看全部人
 * `mohamed` 是 `hassan` 的别名 —— 代码里的 id 沿用票面首字段，
 * 但发出去的链接得让本人认得出自己。
 */
const PERSON_PARAM: Record<string, PersonId | null> = {
  all: null,
  qiuting: "qiuting",
  rahma: "rahma",
  ahmed: "ahmed",
  hassan: "hassan",
  mohamed: "hassan",
  reham: "reham",
};

/** 写回地址栏时用回本人认得的写法。 */
const PARAM_FOR_PERSON: Record<PersonId, string> = {
  qiuting: "qiuting",
  rahma: "rahma",
  ahmed: "ahmed",
  hassan: "mohamed",
  reham: "reham",
};

function isLang(value: string | null): value is Lang {
  return value === "zh" || value === "en" || value === "ar";
}

/*
 * 「看谁」和「哪种语言」的唯一真相是地址栏，不是组件里的 state。
 * 这样两件事同时成立：发出去的链接打开就是那个视图；本人在页面上改了选择，
 * 地址栏跟着变，他复制当前网址转给别人，对方看到的还是同一个视图。
 * 服务端没有 window，快照返回空串 —— 服务端与首次水合渲染的都是默认视图，
 * 之后 React 再用客户端快照重渲一次，不会出现两边 HTML 对不上。
 */
const urlListeners = new Set<() => void>();

function subscribeToUrl(onChange: () => void) {
  urlListeners.add(onChange);
  window.addEventListener("popstate", onChange);
  return () => {
    urlListeners.delete(onChange);
    window.removeEventListener("popstate", onChange);
  };
}

function readSearch() {
  return window.location.search;
}

function serverSearch() {
  return "";
}

/** 写回地址栏用 replaceState，不往浏览器历史里堆记录。 */
function writeParam(key: string, value: string) {
  const params = new URLSearchParams(window.location.search);
  params.set(key, value);
  window.history.replaceState(
    null,
    "",
    `${window.location.pathname}?${params.toString()}${window.location.hash}`,
  );
  urlListeners.forEach((notify) => notify());
}

export function TripView() {
  const [activeDate, setActiveDate] = React.useState<string>(FIRST_DATE);

  const search = React.useSyncExternalStore(
    subscribeToUrl,
    readSearch,
    serverSearch,
  );
  const params = React.useMemo(() => new URLSearchParams(search), [search]);

  const personParam = params.get("p");
  const person =
    personParam !== null && personParam in PERSON_PARAM
      ? PERSON_PARAM[personParam]
      : DEFAULT_PERSON;

  const langParam = params.get("lang");
  const lang = isLang(langParam) ? langParam : DEFAULT_LANG;

  const setLang = React.useCallback((next: Lang) => {
    writeParam("lang", next);
  }, []);
  const setPerson = React.useCallback((next: PersonId | null) => {
    writeParam("p", next ? PARAM_FOR_PERSON[next] : "all");
  }, []);

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
      <OfflineReady />
      <div
        ref={rootRef}
        dir={dir}
        lang={lang}
        className="trip-root mx-auto flex min-h-dvh w-full max-w-[42rem] flex-col bg-sheet md:my-6 md:min-h-[calc(100dvh-3rem)] md:max-w-[75rem] md:rounded-2xl md:shadow-[var(--shadow-raised)]"
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
            {/* 下划线式标签：比灰底药丸克制，和衬线标题、印章是一路的 */}
            <TabsList
              variant="line"
              className="h-auto w-full justify-start gap-7 rounded-none border-b border-card-line p-0 pb-2"
            >
              <TabsTrigger
                value="day"
                className="trip-display min-h-11 flex-none px-0.5 text-base after:bottom-[-9px] after:h-[2.5px] after:bg-miniso-red data-[state=active]:text-navy"
              >
                {t(UI.tabs.day, lang)}
              </TabsTrigger>
              <TabsTrigger
                value="guide"
                className="trip-display min-h-11 flex-none px-0.5 text-base after:bottom-[-9px] after:h-[2.5px] after:bg-miniso-red data-[state=active]:text-navy"
              >
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
              <GuideTab lang={lang} person={person} />
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

/**
 * 页头只放三件事：这是什么、看谁、什么语言。
 *
 * 「看谁」用一个原生下拉（六个横滑按钮是上一版，已替代）：默认显示 Reham 的名字，
 * 点开才列出其他人和「全部」。常驻六个按钮既占两行，又让人以为那是主要操作。
 * 日期区间和当前的人各写一次，不重复。没有背景花纹、没有投影、没有首屏大图。
 */
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
  return (
    <header
      ref={ref}
      className="sticky top-0 z-20 border-b border-card-line bg-white md:rounded-t-2xl"
    >
      {/* 品牌红只占一条细带：这是行程单，不是营销页 */}
      <div
        aria-hidden="true"
        className="h-1 w-full bg-miniso-red md:rounded-t-2xl"
      />
      <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 px-4 pt-2.5">
        <span className="trip-seal" aria-hidden="true">
          穗
        </span>
        <h1 className="trip-display text-xl leading-8 tracking-tight text-navy">
          {t(UI.title, lang)}
        </h1>
        <p className="text-sm font-semibold uppercase leading-5 tracking-[0.08em] text-miniso-red-strong">
          <Ltr>20 SEP – 07 OCT 2026</Ltr>
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 px-4 pb-2.5 pt-2">
        <label className="flex items-center">
          {/* 标签只给读屏：阿语的「العرض」加上下拉本身，会把语言按钮挤到下一行，
              页头从 111px 涨到 163px。名字就在下拉里，视觉上不需要再写一遍。 */}
          <span className="sr-only">{t(UI.viewing, lang)}</span>
          <NativeSelect
            value={person ?? "all"}
            onChange={(event) =>
              onPerson(
                event.target.value === "all"
                  ? null
                  : (event.target.value as PersonId),
              )
            }
            // 16px 起：iOS 上更小的字号会在聚焦时把整页放大。
            className="h-11 rounded-lg border-line bg-white text-base font-medium text-navy shadow-none"
          >
            {PEOPLE.map((item) => (
              <NativeSelectOption key={item.id} value={item.id}>
                {item.name}
              </NativeSelectOption>
            ))}
            <NativeSelectOption value="all">
              {t(UI.everyone, lang)}
            </NativeSelectOption>
          </NativeSelect>
        </label>

        <div
          role="group"
          aria-label={t(UI.language, lang)}
          className="flex shrink-0 gap-1.5"
        >
          {LANGS.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => onLang(option.id)}
              aria-pressed={option.id === lang}
              className={cn(
                // 手指点得到：最小 44px 高。
                "inline-flex min-h-11 items-center rounded-lg border px-2.5 text-sm font-medium leading-5 transition-colors",
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
    </header>
  );
}

