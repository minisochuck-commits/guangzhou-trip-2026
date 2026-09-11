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
      className="sticky top-0 z-20 border-b border-card-line bg-white/95 shadow-[0_10px_24px_-20px_rgba(14,34,64,0.55)] md:rounded-t-2xl"
    >
      {/* 品牌红只占一条细带：这是行程单，不是营销页 */}
      <div
        aria-hidden="true"
        className="h-1 w-full bg-miniso-red md:rounded-t-2xl"
      />
      {/* 木棉水印：广州市花，淡到不抢字，但一眼知道这是广州。
          裁剪放在这一层，不放到 sticky 那层上。 */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden md:rounded-t-2xl"
      >
        <div className="trip-kapok absolute end-0 bottom-0 h-[11rem] w-[11rem] bg-[length:176px_176px] bg-[position:right_-34px_bottom_-40px] opacity-[0.075]" />
      </div>
      <div className="relative flex items-center gap-2.5 px-4 pt-2.5">
        <span className="trip-seal" aria-hidden="true">
          穗
        </span>
        <h1 className="trip-display min-w-0 flex-1 truncate text-xl leading-8 tracking-tight text-navy">
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
      <p className="mt-0.5 flex flex-wrap items-baseline gap-x-2.5 px-4 text-sm leading-5">
        <span className="font-semibold uppercase tracking-[0.08em] text-miniso-red-strong">
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

