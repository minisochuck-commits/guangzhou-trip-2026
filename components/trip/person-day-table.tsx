"use client";

import * as React from "react";

import type { Row, PersonDayCard } from "@/lib/person-day-plan";
import { PERSON_MAP, type Lang, type PersonId } from "@/lib/trip-data";
import { UI, t } from "@/lib/trip-i18n";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Table, TableBody, TableCell, TableHead, TableRow } from "@/components/ui/table";
import { CopyButton, Ltr, PendingHint } from "./ui";
import { FlightDetails } from "./flight-details";

/**
 * 一个人（或同房同行的一组）在某一天的紧凑小表。
 * 标题是姓名 + 职务，下面固定四行：住宿 / 活动 / 餐饮 / 交通。
 * 四行摘要默认全部可见，细节和航班在行内折叠。
 */
export function PersonDayTable({
  card,
  lang,
  focus,
}: {
  card: PersonDayCard;
  lang: Lang;
  focus: PersonId | null;
}) {
  return (
    <article className="overflow-hidden rounded-xl border border-line bg-white shadow-sm">
      <header className="border-b border-line bg-navy-tint/60 px-3 py-2.5">
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
          {card.people.map((id, index) => (
            <React.Fragment key={id}>
              {index > 0 ? (
                <span aria-hidden="true" className="text-navy/30">
                  ·
                </span>
              ) : null}
              <span
                className={
                  focus === id
                    ? "text-base font-semibold text-miniso-red-strong"
                    : "text-base font-semibold text-navy"
                }
              >
                <Ltr>{PERSON_MAP[id].name}</Ltr>
              </span>
            </React.Fragment>
          ))}
        </div>
        <p className="text-sm leading-5 text-navy-soft">
          {card.people.map((id) => t(PERSON_MAP[id].role, lang)).join(" · ")}
        </p>
      </header>

      {/* table-fixed + 单元格自然换行：手机上整表不横向滚动 */}
      <Table className="table-fixed text-base">
        <TableBody>
          <PlanRow label={t(UI.rows.lodging, lang)} row={card.lodging} lang={lang} />
          <PlanRow label={t(UI.rows.activity, lang)} row={card.activity} lang={lang} />
          <PlanRow label={t(UI.rows.dining, lang)} row={card.dining} lang={lang} />
          <PlanRow label={t(UI.rows.transport, lang)} row={card.transport} lang={lang} />
        </TableBody>
      </Table>
    </article>
  );
}

function PlanRow({
  label,
  row,
  lang,
}: {
  label: string;
  row: Row;
  lang: Lang;
}) {
  const hasDetail = Boolean(row.detail?.length);
  const hasFlights = Boolean(row.flights?.length);
  // multiple：详情和航班可以同时展开，不互相顶掉。
  const showAccordion = hasDetail || hasFlights;

  return (
    <TableRow className="hover:bg-transparent">
      <TableHead
        scope="row"
        className="h-auto w-16 whitespace-normal px-3 py-3 text-start align-top text-sm font-medium text-navy-soft rtl:w-20"
      >
        {label}
      </TableHead>
      <TableCell className="whitespace-normal break-words px-3 py-3 align-top">
        <p className="text-base leading-relaxed text-navy">{t(row.text, lang)}</p>

        <PendingHint status={row.status} lang={lang} />

        {row.copy?.length ? (
          <div className="flex flex-wrap gap-2">
            {row.copy.map((entry) => (
              <CopyButton key={entry.id} entry={entry} lang={lang} />
            ))}
          </div>
        ) : null}

        {showAccordion ? (
          <Accordion type="multiple">
            {hasDetail ? (
              <AccordionItem value="detail" className="border-b-0">
                <AccordionTrigger className="min-h-11 py-2 text-sm font-medium text-navy-soft hover:no-underline">
                  {t(UI.details, lang)}
                </AccordionTrigger>
                <AccordionContent className="pb-2">
                  <ul className="space-y-1.5">
                    {row.detail?.map((item, index) => (
                      <li
                        key={index}
                        className="relative ps-4 text-base leading-relaxed text-navy-soft before:absolute before:start-0 before:top-[0.7em] before:size-1.5 before:rounded-full before:bg-navy/25"
                      >
                        {t(item, lang)}
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ) : null}

            {hasFlights ? (
              <AccordionItem value="flights" className="border-b-0">
                <AccordionTrigger className="min-h-11 py-2 text-sm font-medium text-navy-soft hover:no-underline">
                  {t(UI.flightDetails, lang)}
                </AccordionTrigger>
                <AccordionContent className="pb-2">
                  <FlightDetails ids={row.flights ?? []} lang={lang} />
                </AccordionContent>
              </AccordionItem>
            ) : null}
          </Accordion>
        ) : null}
      </TableCell>
    </TableRow>
  );
}
