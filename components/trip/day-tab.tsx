"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { cardsForPerson } from "@/lib/person-day-plan";
import { displayedPeople, mergeRows, type MergedRow } from "@/lib/merge-rows";
import { cellView, type Field } from "@/lib/plan-presentation";
import { PEOPLE, PERSON_MAP, type Lang, type PersonId } from "@/lib/trip-data";
import {
  UI,
  dayNumber,
  monthLabel,
  shortDateLabel,
  t,
  weekdayLabel,
} from "@/lib/trip-i18n";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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

const FIELDS: Field[] = ["lodging", "activity", "dining", "transport"];

type MatrixRow = {
  row: MergedRow;
  /** 这一天的第一行，用来画日期分组线并作为跳转锚点。 */
  firstOfDate: boolean;
};

/**
 * 一张表放下所有日期 × 所有人。字段是列头，每一行是「某天的某个人」。
 *
 * 滚动分工：**页面负责纵向，表格只负责横向**，不再出现两个纵向滚动面板。
 * 代价是表里的 <thead> 没法相对视口 sticky（外层容器是 scrollport），
 * 所以可见列头是表格外面那条 headbar，用 scrollLeft 跟表格同步；
 * <thead> 保留在 DOM 里给读屏用（sr-only）。
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
  const wrapRef = React.useRef<HTMLDivElement | null>(null);
  const headBarRef = React.useRef<HTMLDivElement | null>(null);
  const dateRowRefs = React.useRef(new Map<string, HTMLTableRowElement>());

  const bodyScroller = React.useCallback(
    () =>
      wrapRef.current?.querySelector<HTMLElement>(
        '[data-slot="table-container"]',
      ) ?? null,
    [],
  );

  // 列头条和表格是两个独立的横向滚动容器，互相同步 scrollLeft。
  // syncing 这把锁防止「A 滚 → 设 B → B 触发 scroll → 又设 A」的来回抖动。
  React.useEffect(() => {
    const body = bodyScroller();
    const head = headBarRef.current;
    if (!body || !head) return;

    let syncing = false;
    const mirror = (from: HTMLElement, to: HTMLElement) => () => {
      if (syncing) return;
      syncing = true;
      to.scrollLeft = from.scrollLeft;
      requestAnimationFrame(() => {
        syncing = false;
      });
    };
    const onBody = mirror(body, head);
    const onHead = mirror(head, body);
    body.addEventListener("scroll", onBody, { passive: true });
    head.addEventListener("scroll", onHead, { passive: true });
    return () => {
      body.removeEventListener("scroll", onBody);
      head.removeEventListener("scroll", onHead);
    };
  }, [bodyScroller, rows.length]);

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

  // 切人 / 切语言后横向回到第一列（住宿）。scrollLeft 用 0 —— 按规范 RTL 下 0 也是行首。
  React.useEffect(() => {
    bodyScroller()?.scrollTo({ left: 0 });
    if (headBarRef.current) headBarRef.current.scrollLeft = 0;
  }, [person, lang, bodyScroller]);

  // 兜底：筛人或切语言之后行的位置和高度都变了，把选中日期重新带回视野。
  React.useEffect(() => {
    jumpToDate(activeDate);
  }, [person, lang, activeDate, jumpToDate]);

  return (
    <div className="space-y-3">
      <p className="text-sm leading-relaxed text-navy-soft">
        {t(UI.matrixHint, lang)}
      </p>

      <div>
        {/* 日期条 + 列头一起粘在页头下面；页头高度由 trip-view 量出来写进 CSS 变量 */}
        <div
          ref={stickyRef}
          className="sticky top-[var(--trip-header-h,0px)] z-10 -mx-4 bg-white px-4 pt-1"
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
            <div className="matrix-headbar mt-2 overflow-hidden rounded-t-xl border border-b-0 border-line bg-navy-tint">
              <div
                ref={headBarRef}
                aria-hidden="true"
                className="overflow-x-auto scrollbar-none"
              >
                <div className="flex w-max">
                  <div className="sticky start-0 z-10 w-[var(--col-first)] min-w-[var(--col-first)] max-w-[var(--col-first)] border-e border-line bg-navy-tint px-2 py-2 text-sm font-semibold leading-5 text-navy">
                    {t(UI.matrixCorner, lang)}
                  </div>
                  {FIELDS.map((key) => (
                    <div
                      key={key}
                      className="w-[var(--col-field)] min-w-[var(--col-field)] max-w-[var(--col-field)] bg-navy-tint px-3 py-2 text-sm font-semibold leading-5 text-navy"
                    >
                      {t(UI.rows[key], lang)}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {rows.length === 0 ? (
          <p className="rounded-xl border border-dashed border-line bg-white px-4 py-6 text-center text-base text-navy-soft">
            {t(UI.noPlan, lang)}
          </p>
        ) : (
          /* isolate + z-0：表体里的 sticky 首列自己有 z-10，如果和上面的
             sticky 日期条 / 列头条同处一个层叠上下文，纵向滚动时首列会盖到它们上面
             （真机截图：9/26 的首列贴到了日期按钮和列头上）。
             这里给表格开一个局部层叠上下文，把整块压在控件条下面。
             层级：页头 z-20 > 日期条 + 列头条 z-10 > 表体（isolate 内部） */
          <div ref={wrapRef} className="matrix-scroll relative isolate z-0">
            <Table className="w-auto border-separate border-spacing-0 text-base">
              {/* 语义列头保留给读屏；可见的那条在表格外面 */}
              <TableHeader className="sr-only">
                <TableRow>
                  <TableHead scope="col">{t(UI.matrixCorner, lang)}</TableHead>
                  {FIELDS.map((key) => (
                    <TableHead key={key} scope="col">
                      {t(UI.rows[key], lang)}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>

              <TableBody>
                {rows.map(({ row, firstOfDate }) => {
                  const { date, card } = row;
                  const isActive = date === activeDate;
                  // sticky 首列必须**不透明**：半透明底色会让横滑过去的活动/餐饮
                  // 从姓名底下透出来。
                  const tint = isActive ? "bg-miniso-red-tint" : "bg-white";
                  const topLine = firstOfDate
                    ? "border-t-2 border-t-navy/15"
                    : "";
                  // 筛单人时第一格只写选中的那个名字，不带出同行的人；
                  // 全员视图才列出合并进这一行的所有人。室友关系仍在住宿正文里。
                  const shown = displayedPeople(row, person);

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
                          "sticky start-0 z-10 h-auto w-[var(--col-first)] min-w-[var(--col-first)] max-w-[var(--col-first)] whitespace-normal border-b border-e border-line px-2 py-3 text-start align-top",
                          tint,
                          topLine,
                        )}
                      >
                        {/* 日期不包 Ltr：中英文容器本来就是 LTR，阿语下这里是阿拉伯文月份，
                            强制 LTR 反而会把它翻错。 */}
                        <span className="block text-sm leading-5 text-navy-soft">
                          {shortDateLabel(date, lang)}
                          <span className="ms-1">
                            {weekdayLabel(date, lang)}
                          </span>
                        </span>
                        <span className="mt-0.5 block text-sm font-semibold leading-5 text-navy">
                          {shown.map((id, index) => (
                            <React.Fragment key={id}>
                              {index > 0 ? (
                                <span
                                  aria-hidden="true"
                                  className="text-navy/30"
                                >
                                  {" · "}
                                </span>
                              ) : null}
                              <Ltr>{PERSON_MAP[id].name}</Ltr>
                            </React.Fragment>
                          ))}
                        </span>
                      </TableHead>

                      {FIELDS.map((field) => (
                        <TableCell
                          key={field}
                          className={cn(
                            "w-[var(--col-field)] min-w-[var(--col-field)] max-w-[var(--col-field)] whitespace-normal break-words border-b border-line px-3 py-3 align-top",
                            tint,
                            topLine,
                          )}
                        >
                          <PlanCell
                            row={card[field]}
                            view={cellView(field, date, card)}
                            lang={lang}
                            date={date}
                            people={shown}
                          />
                        </TableCell>
                      ))}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      <TeamDetails lang={lang} person={person} />
    </div>
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
      className="-mx-4 overflow-x-auto scrollbar-none px-4"
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

/* ---------------- 人员详情（票面全名只在这里） ---------------- */

function TeamDetails({
  lang,
  person,
}: {
  lang: Lang;
  person: PersonId | null;
}) {
  return (
    <section className="rounded-xl border border-line bg-white px-4">
      <Accordion type="single" collapsible>
        <AccordionItem value="team" className="border-b-0">
          <AccordionTrigger className="min-h-11 py-3 text-base font-semibold text-navy hover:no-underline">
            {`${t(UI.team, lang)} · ${PEOPLE.length}`}
          </AccordionTrigger>
          <AccordionContent className="pb-4">
            <ul className="space-y-2">
              {PEOPLE.map((item) => (
                <li
                  key={item.id}
                  className={cn(
                    "rounded-lg px-3 py-2",
                    person === item.id ? "bg-navy text-white" : "bg-navy-tint",
                  )}
                >
                  <p className="text-base font-semibold leading-6">
                    <Ltr>{PERSON_MAP[item.id].name}</Ltr>
                    <span
                      className={cn(
                        "ms-2 text-sm font-normal",
                        person === item.id ? "text-white/85" : "text-navy-soft",
                      )}
                    >
                      {t(item.role, lang)}
                    </span>
                  </p>
                  <p
                    className={cn(
                      "text-sm leading-5",
                      person === item.id ? "text-white/75" : "text-navy-soft",
                    )}
                  >
                    {t(UI.ticketName, lang)}:{" "}
                    <Ltr className="font-medium tracking-wide">
                      {item.ticketName}
                    </Ltr>
                  </p>
                </li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </section>
  );
}
