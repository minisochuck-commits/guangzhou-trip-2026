"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { cardsForPerson } from "@/lib/person-day-plan";
import { PEOPLE, PERSON_MAP, type Lang, type PersonId } from "@/lib/trip-data";
import {
  UI,
  dayNumber,
  fullDateLabel,
  monthLabel,
  t,
  weekdayLabel,
} from "@/lib/trip-i18n";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PersonDayTable } from "./person-day-table";
import { RouteList } from "./routes";
import { Ltr, SectionHeading } from "./ui";

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
  const cards = cardsForPerson(person, activeDate);

  // 自由行入口只给当天真正有自由时间的人，并在标题里点名 ——
  // 免得当天还在开会的人以为全团都自由。
  const freeCards = cards.filter((card) => card.freeTime);
  const freeNames = freeCards
    .flatMap((card) => card.people)
    .map((id) => PERSON_MAP[id].name);
  // 有人没限定路线就给全部；都限定了才取并集（例如 9/22 只有下午自由）。
  const routeIds = freeCards.every((card) => card.freeRoutes)
    ? [...new Set(freeCards.flatMap((card) => card.freeRoutes ?? []))]
    : undefined;

  return (
    <div className="space-y-4">
      <DayNav
        dates={dates}
        active={activeDate}
        lang={lang}
        onSelect={onSelectDate}
      />

      <SectionHeading>{fullDateLabel(activeDate, lang)}</SectionHeading>

      {cards.length === 0 ? (
        <p className="rounded-xl border border-dashed border-line bg-white px-4 py-6 text-center text-base text-navy-soft">
          {t(UI.noPlan, lang)}
        </p>
      ) : (
        <div className="space-y-3">
          {cards.map((card) => (
            <PersonDayTable
              key={card.id}
              card={card}
              lang={lang}
              focus={person}
            />
          ))}
        </div>
      )}

      {freeCards.length > 0 ? (
        <section className="rounded-xl border border-dashed border-navy/30 bg-white px-3">
          <Accordion type="single" collapsible>
            <AccordionItem value="ideas" className="border-b-0">
              <AccordionTrigger className="min-h-11 py-3 text-start text-base font-semibold text-navy hover:no-underline">
                <span>
                  {t(UI.freeTimeIdeas, lang)}
                  <span className="ms-1.5 font-normal text-navy-soft">
                    · <Ltr>{freeNames.join(" · ")}</Ltr>
                  </span>
                </span>
              </AccordionTrigger>
              <AccordionContent className="pb-4">
                <RouteList lang={lang} ids={routeIds} />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>
      ) : null}

      <TeamDetails lang={lang} person={person} />
    </div>
  );
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
    // 已经完整可见就不动。
    if (chip.left >= box.left && chip.right <= box.right) return;

    // 只滚这个横向容器，不用 scrollIntoView —— 那会连带滚动窗口纵向，
    // 把当天标题顶到 sticky header 后面。用可视坐标差，LTR / RTL 都成立。
    scroller.scrollBy({
      left: chip.left + chip.width / 2 - (box.left + box.width / 2),
      behavior: "smooth",
    });
  }, [active]);

  return (
    <nav
      ref={scrollerRef}
      aria-label={t(UI.tabs.day, lang)}
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
