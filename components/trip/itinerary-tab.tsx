"use client";

import * as React from "react";
import { ArrowRightIcon, MapPinIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  AIRPORTS,
  CITY_EVENING_NOTE,
  CITY_OPTIONS,
  EVENTS,
  GROUPS,
  OFFICIAL_LINKS,
  PEOPLE,
  TEAM_NOTES,
  type FlightPoint,
  type Lang,
  type PersonId,
  type TimeZoneTag,
  type TripEvent,
} from "@/lib/trip-data";
import {
  UI,
  datesBetween,
  dayNumber,
  fullDateLabel,
  instantOf,
  monthLabel,
  rangeLabel,
  shortDateLabel,
  t,
  weekdayLabel,
} from "@/lib/trip-i18n";
import { showsCityIdeas } from "@/lib/day-plan";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { DaySupplements } from "./day-supplements";
import {
  BulletList,
  Ltr,
  PeopleRow,
  PendingList,
  SectionHeading,
  StatusPill,
} from "./ui";

/* ---------------- 选人 → 选日期 → 选事件 ---------------- */

function visibleEvents(person: PersonId | null): TripEvent[] {
  if (!person) return EVENTS;
  return EVENTS.filter((event) => event.people.includes(person));
}

/**
 * 日期导航覆盖每个事件的完整区间：单日事件给自己那天，跨日事件按 date–endDate
 * 逐日展开。接待组 9/22–26 只有一条阶段性条目，也要能一天一天点开看。
 */
export function anchorDates(person: PersonId | null): string[] {
  const dates = new Set<string>();
  for (const event of visibleEvents(person)) {
    if (!event.endDate) {
      dates.add(event.date);
      continue;
    }
    for (const date of datesBetween(event.date, event.endDate)) dates.add(date);
  }
  return [...dates].sort();
}

function onDate(event: TripEvent, date: string): boolean {
  if (event.date === date) return true;
  return Boolean(event.endDate && event.date < date && date <= event.endDate);
}

type TimedEvent = TripEvent & { time: string; tz: TimeZoneTag };

/**
 * 一天分成两段：
 *   timed —— 有确切时刻的，按真实时间轴（UTC）排序，避免 9/21 的开罗 00:20
 *            排到成都 08:00 之后这种跨时区颠倒。
 *   untimed —— 时间未定的，单独归到「时间待定的安排」，不给它们编造时刻去参与排序。
 * 两段内部都是「当天开始的在前，前几天延续过来的在后」。
 */
function eventsOnDate(person: PersonId | null, date: string) {
  const timed: TimedEvent[] = [];
  const untimed: TripEvent[] = [];
  for (const event of visibleEvents(person)) {
    if (!onDate(event, date)) continue;
    // 跨日阶段条目即使带时刻也不参与时间轴排序：它的时刻属于起始日，不属于今天。
    if (event.time && event.tz && event.date === date) {
      timed.push(event as TimedEvent);
    } else {
      untimed.push(event);
    }
  }

  timed.sort(
    (a, b) =>
      instantOf(a.date, a.time, a.tz) - instantOf(b.date, b.time, b.tz),
  );
  untimed.sort(
    (a, b) => Number(a.date !== date) - Number(b.date !== date),
  );

  return { timed, untimed };
}

/* ---------------- 日期导航 ---------------- */

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
    // 已经完整可见就不动 —— 用户刚点的那个本来就在视野里。
    if (chip.left >= box.left && chip.right <= box.right) return;

    // 只滚这个横向容器，不用 scrollIntoView：那个会连带滚动窗口纵向，
    // 把当天标题顶到 sticky header 后面。用可视坐标差 + scrollBy，
    // LTR / RTL 都成立（scrollLeft 在两种方向下都是向右为增）。
    scroller.scrollBy({
      left: chip.left + chip.width / 2 - (box.left + box.width / 2),
      behavior: "smooth",
    });
  }, [active]);

  return (
    <nav
      ref={scrollerRef}
      aria-label={t(UI.tabs.itinerary, lang)}
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

/* ---------------- 航班块 ---------------- */

function tzOf(iata: FlightPoint["iata"]) {
  return iata === "CAI" ? UI.tz.cairo : UI.tz.beijing;
}

function FlightEnd({ point, lang }: { point: FlightPoint; lang: Lang }) {
  const airport = AIRPORTS[point.iata];
  return (
    <div className="min-w-0 flex-1">
      <Ltr className="text-xl font-semibold leading-7 text-navy">
        {point.time}
      </Ltr>
      <div className="truncate text-base leading-6 text-navy">
        <Ltr className="font-semibold">{`${point.iata} ${point.terminal}`}</Ltr>
        <span className="mx-1 opacity-40">·</span>
        {t(airport.city, lang)}
      </div>
      <div className="text-sm leading-5 text-navy-soft">
        {shortDateLabel(point.date, lang)}
        <span className="mx-1 opacity-40">·</span>
        {t(tzOf(point.iata), lang)}
      </div>
    </div>
  );
}

function FlightBlock({ event, lang }: { event: TripEvent; lang: Lang }) {
  const flight = event.flight;
  if (!flight) return null;
  return (
    <div className="rounded-xl bg-navy-tint px-3 py-3">
      <div className="mb-2.5 flex flex-wrap items-center gap-2">
        <Ltr className="rounded-md bg-navy px-2 py-0.5 text-base font-semibold tracking-wide text-white">
          {flight.code}
        </Ltr>
        {flight.cabin ? (
          <span className="text-sm font-medium text-navy-soft">
            {t(flight.cabin, lang)}
          </span>
        ) : null}
        {flight.from.date !== flight.to.date ? (
          <span className="rounded-md bg-white px-2 py-0.5 text-sm font-medium text-miniso-red-strong">
            {t(UI.nextDayArrival, lang)}
          </span>
        ) : null}
      </div>
      <div className="flex items-center gap-2">
        <FlightEnd point={flight.from} lang={lang} />
        <ArrowRightIcon
          aria-hidden="true"
          className="size-5 shrink-0 text-navy/35 rtl:rotate-180"
        />
        <FlightEnd point={flight.to} lang={lang} />
      </div>
      <p className="mt-2.5 border-t border-navy/10 pt-2 text-sm text-navy-soft">
        {t(flight.baggage, lang)}
      </p>
    </div>
  );
}

/* ---------------- 事件卡 ---------------- */

function EventCard({
  event,
  lang,
  focus,
}: {
  event: TripEvent;
  lang: Lang;
  focus: PersonId | null;
}) {
  const timeLabel = event.endTime
    ? `${event.time} – ${event.endTime}`
    : event.time;

  return (
    <article
      className={cn(
        "rounded-xl border bg-white p-4 shadow-sm",
        event.highlight
          ? "border-miniso-red/45 ring-1 ring-miniso-red/10"
          : "border-line",
      )}
    >
      <div className="mb-2 flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
        {timeLabel ? (
          <Ltr className="text-lg font-semibold leading-7 text-navy">
            {timeLabel}
          </Ltr>
        ) : null}
        {event.tz && timeLabel ? (
          <span className="text-sm text-navy-soft">{t(UI.tz[event.tz], lang)}</span>
        ) : null}
        <span className="rounded-md bg-navy-tint px-2 py-0.5 text-sm font-medium text-navy-soft">
          {t(UI.kind[event.kind], lang)}
        </span>
        {event.endDate ? (
          <span className="text-sm text-navy-soft">
            {rangeLabel(event.date, event.endDate, lang)}
          </span>
        ) : null}
        <StatusPill status={event.status} lang={lang} className="ms-auto" />
      </div>

      <h3 className="text-base font-semibold leading-6 text-navy">
        {t(event.title, lang)}
      </h3>

      {event.summary ? (
        <p className="mt-1.5 text-base leading-relaxed text-navy-soft">
          {t(event.summary, lang)}
        </p>
      ) : null}

      {event.flight ? (
        <div className="mt-3">
          <FlightBlock event={event} lang={lang} />
        </div>
      ) : null}

      {event.details?.length ? (
        <div className="mt-3">
          <BulletList items={event.details} lang={lang} />
        </div>
      ) : null}

      {event.pending?.length ? (
        <div className="mt-3">
          <PendingList items={event.pending} lang={lang} />
        </div>
      ) : null}

      <div className="mt-3 border-t border-line pt-3">
        <PeopleRow people={event.people} lang={lang} focus={focus} />
      </div>
    </article>
  );
}

/* ---------------- 9/26 城市体验建议 ---------------- */

function CityIdeas({ lang }: { lang: Lang }) {
  const guideLink = OFFICIAL_LINKS.find((link) => link.id === "visitor-guide");
  return (
    <section className="rounded-xl border border-dashed border-navy/30 bg-white p-4">
      <SectionHeading className="text-base">
        {t(UI.cityOptions, lang)}
      </SectionHeading>
      <ul className="mt-3 space-y-3">
        {CITY_OPTIONS.map((option) => (
          <li key={option.id} className="rounded-lg bg-navy-tint px-3 py-2.5">
            <div className="flex items-center gap-1.5 text-base font-semibold text-navy">
              <MapPinIcon className="size-4 shrink-0 text-miniso-red" aria-hidden="true" />
              {t(option.title, lang)}
            </div>
            <p className="mt-1 text-base leading-relaxed text-navy-soft">
              {t(option.body, lang)}
            </p>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-base leading-relaxed text-navy-soft">
        {t(CITY_EVENING_NOTE, lang)}
      </p>
      {guideLink ? (
        <a
          href={guideLink.url}
          target="_blank"
          rel="noreferrer"
          className="mt-2 inline-block break-all text-sm font-medium text-miniso-red-strong underline underline-offset-4"
        >
          {t(guideLink.title, lang)}
        </a>
      ) : null}
    </section>
  );
}

/* ---------------- 人员名单（角色只在这里给一次） ---------------- */

function TeamRoster({ lang, person }: { lang: Lang; person: PersonId | null }) {
  return (
    <section className="rounded-xl border border-line bg-white px-4">
      <Accordion type="single" collapsible>
        <AccordionItem value="team" className="border-b-0">
          <AccordionTrigger className="py-3 text-base font-semibold text-navy hover:no-underline">
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
                  <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                    <Ltr className="text-base font-semibold tracking-wide">
                      {item.ticketName}
                    </Ltr>
                    <span
                      className={cn(
                        "text-sm",
                        person === item.id ? "text-white/80" : "text-navy-soft",
                      )}
                    >
                      {t(GROUPS[item.group], lang)}
                    </span>
                  </div>
                  <p
                    className={cn(
                      "text-base leading-6",
                      person === item.id ? "text-white/90" : "text-navy",
                    )}
                  >
                    {t(item.role, lang)}
                  </p>
                </li>
              ))}
            </ul>
            <div className="mt-3">
              <BulletList items={TEAM_NOTES} lang={lang} />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </section>
  );
}

/* ---------------- 导出 ---------------- */

export function ItineraryTab({
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
  const { timed, untimed } = eventsOnDate(person, activeDate);

  return (
    <div className="space-y-4">
      {/* 日期导航贴在最上面：选人 → 选日期 → 立刻看到当天的事。 */}
      <DayNav
        dates={dates}
        active={activeDate}
        lang={lang}
        onSelect={onSelectDate}
      />

      <div className="flex items-baseline gap-2">
        <SectionHeading>{fullDateLabel(activeDate, lang)}</SectionHeading>
      </div>

      {timed.length === 0 && untimed.length === 0 ? (
        <p className="rounded-xl border border-dashed border-line bg-white px-4 py-6 text-center text-base text-navy-soft">
          {t(UI.noEvents, lang)}
        </p>
      ) : null}

      {timed.length > 0 ? (
        <div className="space-y-3">
          {timed.map((event) => (
            <EventCard key={event.id} event={event} lang={lang} focus={person} />
          ))}
        </div>
      ) : null}

      {untimed.length > 0 ? (
        <section className="space-y-3">
          <h3 className="flex items-center gap-2 pt-1 text-sm font-semibold uppercase tracking-wide text-navy-soft">
            <span
              aria-hidden="true"
              className="h-px flex-1 bg-line"
            />
            {t(UI.untimed, lang)}
            <span aria-hidden="true" className="h-px flex-1 bg-line" />
          </h3>
          {untimed.map((event) => (
            <EventCard key={event.id} event={event} lang={lang} focus={person} />
          ))}
        </section>
      ) : null}

      {/* 当天吃住行：和活动同页，不再单开一个 tab。 */}
      <DaySupplements lang={lang} person={person} date={activeDate} />

      {showsCityIdeas(person, activeDate) ? <CityIdeas lang={lang} /> : null}

      {/* 人员名单排在日程之后：全名和职务不占首屏。 */}
      <TeamRoster lang={lang} person={person} />
    </div>
  );
}
