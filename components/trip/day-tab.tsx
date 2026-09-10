"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { cardsForPerson, type PersonDayCard } from "@/lib/person-day-plan";
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

type MatrixRow = {
  date: string;
  card: PersonDayCard;
  /** 这一天的第一行，用来画日期分组线。 */
  firstOfDate: boolean;
};

/**
 * 一张表放下所有日期 × 所有人。字段是列头，每一行是「某天的某个人」。
 * 选人只是筛掉行，不转置；日期按钮是跳到那一天的第一行，不是只显示一天。
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
      cardsForPerson(person, date).forEach((card, index) => {
        out.push({ date, card, firstOfDate: index === 0 });
      });
    }
    return out;
  }, [dates, person]);

  const wrapRef = React.useRef<HTMLDivElement | null>(null);
  const headRef = React.useRef<HTMLTableSectionElement | null>(null);
  const dateRowRefs = React.useRef(new Map<string, HTMLTableRowElement>());

  const scrollerOf = React.useCallback(
    () =>
      wrapRef.current?.querySelector<HTMLElement>(
        '[data-slot="table-container"]',
      ) ?? null,
    [],
  );

  /**
   * 滚到某一天的第一行。只滚表格自己的容器，不动窗口纵向，
   * 否则 sticky 页头会把目标行盖住。
   *
   * 这是个普通函数、由点击**直接调用** —— 重复点同一个已选中的日期也要能跳回去
   * （手动滑走之后最常见）。只挂 effect 的话，state 没变就不会重跑。
   */
  const jumpToDate = React.useCallback(
    (date: string) => {
      const row = dateRowRefs.current.get(date);
      const scroller = scrollerOf();
      if (!row || !scroller) return;

      const headHeight = headRef.current?.offsetHeight ?? 0;
      const top =
        row.getBoundingClientRect().top -
        scroller.getBoundingClientRect().top +
        scroller.scrollTop -
        headHeight;
      scroller.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
    },
    [scrollerOf],
  );

  // 切人 / 切语言后横向回到第一列（住宿）。scrollLeft 用 0 —— 按规范 RTL 下 0 也是行首。
  // 不放进下面那个 effect：跳日期时不该把用户横向看到的列拽回去。
  React.useEffect(() => {
    scrollerOf()?.scrollTo({ left: 0 });
  }, [person, lang, scrollerOf]);

  // 兜底：筛人或切语言之后行的位置和高度都变了，把选中日期重新带回视野。
  // 点日期是 onClick 直接调 jumpToDate，不靠这里。
  React.useEffect(() => {
    jumpToDate(activeDate);
  }, [person, lang, activeDate, jumpToDate]);

  return (
    <div className="space-y-3">
      <DayNav
        dates={dates}
        active={activeDate}
        lang={lang}
        onSelect={(date) => {
          onSelectDate(date);
          jumpToDate(date);
        }}
      />

      <p className="text-sm leading-relaxed text-navy-soft">
        {t(UI.matrixHint, lang)}
      </p>

      {rows.length === 0 ? (
        <p className="rounded-xl border border-dashed border-line bg-white px-4 py-6 text-center text-base text-navy-soft">
          {t(UI.noPlan, lang)}
        </p>
      ) : (
        <div ref={wrapRef} className="matrix-scroll -mx-1">
          <Table className="w-auto border-separate border-spacing-0 text-base">
            <TableHeader ref={headRef}>
              <TableRow className="hover:bg-transparent">
                <TableHead
                  scope="col"
                  className="sticky start-0 top-0 z-30 h-auto w-28 min-w-28 whitespace-normal border-b border-e border-line bg-navy-tint px-2 py-2 text-start align-middle text-sm font-semibold text-navy"
                >
                  {t(UI.matrixCorner, lang)}
                </TableHead>
                {(["lodging", "activity", "dining", "transport"] as const).map(
                  (key) => (
                    <TableHead
                      key={key}
                      scope="col"
                      className="sticky top-0 z-20 h-auto w-[13.5rem] min-w-[13.5rem] whitespace-normal border-b border-line bg-navy-tint px-3 py-2 text-start align-middle text-sm font-semibold text-navy"
                    >
                      {t(UI.rows[key], lang)}
                    </TableHead>
                  ),
                )}
              </TableRow>
            </TableHeader>

            <TableBody>
              {rows.map(({ date, card, firstOfDate }) => {
                const isActive = date === activeDate;
                // sticky 首列必须**不透明**：半透明底色会让横滑过去的活动/餐饮
                // 从姓名底下透出来。选中底色也用实色。
                const tint = isActive ? "bg-miniso-red-tint" : "bg-white";
                const topLine = firstOfDate ? "border-t-2 border-t-navy/15" : "";
                // 单人视图第一格只写选中的那个名字；室友关系仍在住宿正文里。
                const shown = person ? [person] : card.people;

                return (
                  <TableRow
                    key={card.id}
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
                        "sticky start-0 z-10 h-auto w-28 min-w-28 whitespace-normal border-b border-e border-line px-2 py-3 text-start align-top",
                        tint,
                        topLine,
                      )}
                    >
                      {/* 日期不包 Ltr：中英文容器本来就是 LTR，阿语下这里是阿拉伯文月份，
                          强制 LTR 反而会把它翻错。 */}
                      <span className="block text-sm leading-5 text-navy-soft">
                        {shortDateLabel(date, lang)}
                        <span className="ms-1">{weekdayLabel(date, lang)}</span>
                      </span>
                      <span className="mt-0.5 block text-sm font-semibold leading-5 text-navy">
                        {shown.map((id, index) => (
                          <React.Fragment key={id}>
                            {index > 0 ? (
                              <span aria-hidden="true" className="text-navy/30">
                                {" · "}
                              </span>
                            ) : null}
                            <Ltr>{PERSON_MAP[id].name}</Ltr>
                          </React.Fragment>
                        ))}
                      </span>
                    </TableHead>

                    <MatrixCell
                      tint={tint}
                      topLine={topLine}
                      row={card.lodging}
                      lang={lang}
                      label={t(UI.rows.lodging, lang)}
                      date={date}
                      people={shown}
                    />
                    <MatrixCell
                      tint={tint}
                      topLine={topLine}
                      row={card.activity}
                      lang={lang}
                      label={t(UI.rows.activity, lang)}
                      date={date}
                      people={shown}
                      showRoutes={Boolean(card.freeTime)}
                      routeIds={card.freeRoutes}
                    />
                    <MatrixCell
                      tint={tint}
                      topLine={topLine}
                      row={card.dining}
                      lang={lang}
                      label={t(UI.rows.dining, lang)}
                      date={date}
                      people={shown}
                    />
                    <MatrixCell
                      tint={tint}
                      topLine={topLine}
                      row={card.transport}
                      lang={lang}
                      label={t(UI.rows.transport, lang)}
                      date={date}
                      people={shown}
                    />
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      <TeamDetails lang={lang} person={person} />
    </div>
  );
}

function MatrixCell({
  tint,
  topLine,
  ...cell
}: { tint: string; topLine: string } & React.ComponentProps<typeof PlanCell>) {
  return (
    <TableCell
      className={cn(
        "w-[13.5rem] min-w-[13.5rem] whitespace-normal break-words border-b border-line px-3 py-3 align-top",
        tint,
        topLine,
      )}
    >
      <PlanCell {...cell} />
    </TableCell>
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
                  "flex min-h-11 min-w-[3.75rem] flex-col items-center justify-center rounded-xl border px-2.5 py-1.5 transition-colors",
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
