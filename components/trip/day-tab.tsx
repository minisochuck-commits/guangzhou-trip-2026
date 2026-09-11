"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { cardsForPerson } from "@/lib/person-day-plan";
import { displayedPeople, mergeRows, type MergedRow } from "@/lib/merge-rows";
import { cellView } from "@/lib/plan-presentation";
import { PERSON_MAP, type Lang, type PersonId } from "@/lib/trip-data";
import {
  UI,
  dayNumber,
  monthLabel,
  t,
  weekdayLabel,
} from "@/lib/trip-i18n";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PlanCell } from "./plan-cell";
import { Ltr } from "./ui";

type MatrixRow = {
  row: MergedRow;
  /** 这一天的第一行，用来画日期分组线并作为跳转锚点。 */
  firstOfDate: boolean;
};

/**
 * 三列行程表：日期（单人）/ 日期·人员（全员）｜活动与交通｜食宿。
 *
 * 列宽按比例分（见 globals.css 的 `.trip-matrix`），390px 也放得下三列，
 * **不再横向滚动** —— 所以外层容器的 overflow 被改回 visible，
 * 表头那条也不用再跟表格同步 scrollLeft 了。页面只有一个纵向滚动。
 *
 * 活动与交通、餐与住各自仍用原来的 `PlanCell` 渲染，弹窗、按钮、数据都没变；
 * 这里只是把它们两两放进同一格，中间用细线或小标签分开。
 */
export function DayTab({
  lang,
  person,
  dates,
  activeDate,
  onSelectDate,
}: {
  lang: Lang;
  person: PersonId | null;
  dates: string[];
  activeDate: string;
  onSelectDate: (date: string) => void;
}) {
  const rows = React.useMemo(() => {
    const out: MatrixRow[] = [];
    for (const date of dates) {
      // 同一天里安排逐字一致的人合成一行（9/20 出发日就是这种情况）。
      // 筛单人时每天最多一张卡，mergeRows 是恒等变换。
      mergeRows(date, cardsForPerson(person, date)).forEach((row, index) => {
        out.push({ row, firstOfDate: index === 0 });
      });
    }
    return out;
  }, [dates, person]);

  const stickyRef = React.useRef<HTMLDivElement | null>(null);
  const dateRowRefs = React.useRef(new Map<string, HTMLTableRowElement>());

  /**
   * 跳到某一天的第一行。滚的是**窗口**，偏移量按 sticky 条的实际底边算，
   * 所以目标行不会被页头和列头盖住。
   *
   * 由点击直接调用：重复点同一个已选中的日期也要能跳回去（手动滑走之后最常见）。
   */
  const jumpToDate = React.useCallback((date: string) => {
    const row = dateRowRefs.current.get(date);
    if (!row) return;
    const stickyBottom = stickyRef.current?.getBoundingClientRect().bottom ?? 0;
    window.scrollBy({
      top: row.getBoundingClientRect().top - stickyBottom - 8,
      behavior: "smooth",
    });
  }, []);

  // 兜底：筛人或切语言之后行的位置和高度都变了，把选中日期重新带回视野。
  React.useEffect(() => {
    jumpToDate(activeDate);
  }, [person, lang, activeDate, jumpToDate]);

  const firstColLabel = person
    ? t(UI.cols.date, lang)
    : t(UI.matrixCorner, lang);

  return (
    <div
      className="trip-matrix"
      data-view={person ? "single" : "all"}
    >
      {/* 日期条 + 列头一起粘在页头下面；页头高度由 trip-view 量出来写进 CSS 变量 */}
      <div
        ref={stickyRef}
        className="sticky top-[var(--trip-header-h,0px)] z-10 -mx-4 bg-white px-4 pt-1 md:-mx-8 md:px-8"
      >
        <DayNav
          dates={dates}
          active={activeDate}
          lang={lang}
          onSelect={(date) => {
            onSelectDate(date);
            jumpToDate(date);
          }}
        />

        {rows.length > 0 ? (
          // 首列读同一个 --col-date，后两列 flex-1 对半分 —— 和表体
          // table-fixed 的均分规则一致，两边逐像素对齐，也不用同步滚动位置。
          <div
            aria-hidden="true"
            className="mt-2 flex rounded-t-xl border border-b-0 border-card-line bg-navy-tint"
          >
            <div className="w-[var(--col-date)] shrink-0 border-e border-card-line px-2 py-2 text-[0.8125rem] font-semibold leading-5 text-navy">
              {firstColLabel}
            </div>
            <div className="min-w-0 flex-1 border-e border-card-line px-2 py-2 text-[0.8125rem] font-semibold leading-5 text-navy md:px-3">
              {t(UI.cols.plan, lang)}
            </div>
            <div className="min-w-0 flex-1 px-2 py-2 text-[0.8125rem] font-semibold leading-5 text-navy md:px-3">
              {t(UI.cols.stay, lang)}
            </div>
          </div>
        ) : null}
      </div>

      {rows.length === 0 ? (
        <p className="rounded-xl border border-dashed border-line bg-white px-4 py-6 text-center text-base text-navy-soft">
          {t(UI.noPlan, lang)}
        </p>
      ) : (
        // isolate + z-0：表体压在 sticky 日期条 / 列头条下面。
        <div className="relative isolate z-0">
          <Table className="w-full table-fixed border-separate border-spacing-0 text-sm">
            {/* 后两列不写宽度：table-fixed 会把剩余宽度对半分给它们。 */}
            <colgroup>
              <col className="w-[var(--col-date)]" />
              <col />
              <col />
            </colgroup>

            {/* 语义列头保留给读屏；可见的那条在表格外面 */}
            <TableHeader className="sr-only">
              <TableRow>
                <TableHead scope="col">{firstColLabel}</TableHead>
                <TableHead scope="col">{t(UI.cols.plan, lang)}</TableHead>
                <TableHead scope="col">{t(UI.cols.stay, lang)}</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {rows.map(({ row, firstOfDate }) => {
                const { date, card } = row;
                const isActive = date === activeDate;
                const tint = isActive ? "bg-miniso-red-tint" : "bg-white";
                // 同一天的几行之间只有一条淡线；换一天才用深一点的那条分组。
                const topLine = firstOfDate ? "border-t border-t-navy/20" : "";
                // 筛了人就只认那一个人：合并行里同卡的其他人不该出现在弹窗标题里
                // （筛 Ahmed 时不能带出 Mohamed）。
                const people = displayedPeople(row, person);
                // 单人视图首列不重复写名字（顶部已经显示在看谁）；全员视图才列名字。
                const shown = person ? [] : people;

                return (
                  <TableRow
                    key={row.key}
                    ref={
                      firstOfDate
                        ? (node) => {
                            if (node) dateRowRefs.current.set(date, node);
                            else dateRowRefs.current.delete(date);
                          }
                        : undefined
                    }
                    className="hover:bg-transparent"
                  >
                    <TableHead
                      scope="row"
                      className={cn(
                        "h-auto whitespace-normal break-words border-b border-e border-card-line px-2 py-2 text-start align-top",
                        tint,
                        topLine,
                      )}
                    >
                      {/* 窄列里日期竖着排：日 / 月 / 周几，英阿的月份才放得下。
                          日号比下面两行大一档就够认出来 —— 上一版放到 20px，太抢。 */}
                      <span className="block text-[1.0625rem] font-semibold leading-6 text-navy">
                        <Ltr>{dayNumber(date)}</Ltr>
                      </span>
                      <span className="block text-[0.8125rem] leading-4 text-navy-soft">
                        {monthLabel(date, lang)}
                      </span>
                      <span className="block text-[0.8125rem] leading-4 text-navy-soft/75">
                        {weekdayLabel(date, lang)}
                      </span>
                      {shown.length > 0 ? (
                        <span className="mt-1 block text-[0.8125rem] font-semibold leading-4 text-navy">
                          {shown.map((id) => (
                            <span key={id} className="block">
                              <Ltr>{PERSON_MAP[id].name}</Ltr>
                            </span>
                          ))}
                        </span>
                      ) : null}
                    </TableHead>

                    {/* 活动与交通：两段之间一条细线，不加重复的小标题 */}
                    <TableCell
                      className={cn(
                        "whitespace-normal break-words border-b border-e border-card-line px-2 py-2 align-top md:px-3 md:py-2.5",
                        tint,
                        topLine,
                      )}
                    >
                      <PlanCell
                        row={card.activity}
                        view={cellView("activity", date, card)}
                        lang={lang}
                        date={date}
                        people={people}
                      />
                      <div className="mt-2 border-t border-card-line pt-2">
                        <PlanCell
                          row={card.transport}
                          view={cellView("transport", date, card)}
                          lang={lang}
                          date={date}
                          people={people}
                        />
                      </div>
                    </TableCell>

                    {/* 食宿：两段各带一个短标签，免得混在一起 */}
                    <TableCell
                      className={cn(
                        "whitespace-normal break-words border-b border-card-line px-2 py-2 align-top md:px-3 md:py-2.5",
                        tint,
                        topLine,
                      )}
                    >
                      <MiniLabel>{t(UI.rows.dining, lang)}</MiniLabel>
                      <PlanCell
                        row={card.dining}
                        view={cellView("dining", date, card)}
                        lang={lang}
                        date={date}
                        people={people}
                      />
                      <div className="mt-2 border-t border-card-line pt-2">
                        <MiniLabel>{t(UI.rows.lodging, lang)}</MiniLabel>
                        <PlanCell
                          row={card.lodging}
                          view={cellView("lodging", date, card)}
                          lang={lang}
                          date={date}
                          people={people}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

function MiniLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="mb-0.5 block text-xs font-semibold uppercase leading-4 tracking-[0.08em] text-navy-soft/75">
      {children}
    </span>
  );
}

/* ---------------- 日期导航（跳转，不是切换视图） ---------------- */

function DayNav({
  dates,
  active,
  lang,
  onSelect,
}: {
  dates: string[];
  active: string;
  lang: Lang;
  onSelect: (date: string) => void;
}) {
  const scrollerRef = React.useRef<HTMLElement | null>(null);
  const activeRef = React.useRef<HTMLButtonElement | null>(null);

  React.useEffect(() => {
    const scroller = scrollerRef.current;
    const item = activeRef.current;
    if (!scroller || !item) return;

    const box = scroller.getBoundingClientRect();
    const chip = item.getBoundingClientRect();
    // 已经完整可见就不动。
    if (chip.left >= box.left && chip.right <= box.right) return;

    // 只滚这一条横向容器，不用 scrollIntoView —— 那会连带滚动窗口纵向。
    // 用可视坐标差，LTR / RTL 都成立。
    scroller.scrollBy({
      left: chip.left + chip.width / 2 - (box.left + box.width / 2),
      behavior: "smooth",
    });
    // lang / dates 也要依赖：切语言后按钮宽度和排列方向都变，浏览器会把
    // scrollLeft 重置到开头，选中的那天就跑出视野了；筛人之后按钮少了同理。
  }, [active, lang, dates]);

  return (
    <nav
      ref={scrollerRef}
      aria-label={t(UI.jumpToDate, lang)}
      className="-mx-4 overflow-x-auto scrollbar-none px-4 md:-mx-8 md:px-8"
    >
      <ul className="flex w-max gap-2 pb-1">
        {dates.map((date) => {
          const isActive = date === active;
          return (
            <li key={date}>
              <button
                type="button"
                ref={isActive ? activeRef : undefined}
                onClick={() => onSelect(date)}
                aria-current={isActive ? "date" : undefined}
                className={cn(
                  "flex min-h-11 min-w-[3.5rem] flex-col items-center justify-center rounded-xl border px-2.5 py-1 transition-colors",
                  isActive
                    ? "border-navy bg-navy text-white"
                    : "border-line bg-white text-navy hover:border-navy/40",
                )}
              >
                <span className="text-sm leading-4 opacity-80">
                  {weekdayLabel(date, lang)}
                </span>
                <span className="flex items-baseline gap-1">
                  <Ltr className="text-lg font-semibold leading-6">
                    {dayNumber(date)}
                  </Ltr>
                  <span className="text-sm leading-4 opacity-75">
                    {monthLabel(date, lang)}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
