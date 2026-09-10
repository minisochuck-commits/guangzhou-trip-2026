"use client";

import * as React from "react";
import { BedIcon, CarFrontIcon, UtensilsIcon } from "lucide-react";

import { daySupplementsFor, type SupplementKind } from "@/lib/day-plan";
import type { Lang, PersonId } from "@/lib/trip-data";
import { UI, t } from "@/lib/trip-i18n";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { BulletList, PeopleRow, StatusPill } from "./ui";

const KIND_ICON: Record<SupplementKind, typeof UtensilsIcon> = {
  dining: UtensilsIcon,
  transport: CarFrontIcon,
  lodging: BedIcon,
};

/**
 * 当天的吃住行。不是把整份 LOGISTICS 贴到每一天 ——
 * `daySupplementsFor` 已经按日期和人员筛过，住宿排在最后。
 *
 * 手机上默认只露第一条（当天真正要知道的那句），剩下的事实（饮食需求、含早、
 * 假期订位提醒这类每天都一样的话）收进「详情」，免得三张卡把屏幕挤满。
 */
export function DaySupplements({
  lang,
  person,
  date,
}: {
  lang: Lang;
  person: PersonId | null;
  date: string;
}) {
  const items = daySupplementsFor(person, date);
  if (items.length === 0) return null;

  return (
    <section className="space-y-3">
      <h3 className="flex items-center gap-2 pt-1 text-sm font-semibold uppercase tracking-wide text-navy-soft">
        <span aria-hidden="true" className="h-px flex-1 bg-line" />
        {t(UI.dayPlan, lang)}
        <span aria-hidden="true" className="h-px flex-1 bg-line" />
      </h3>

      {items.map((item) => {
        const Icon = KIND_ICON[item.kind];
        const [summary, ...rest] = item.lines;
        return (
          <article
            key={item.id}
            className="rounded-xl border border-line bg-white p-4 shadow-sm"
          >
            <div className="mb-2 flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
              <span className="inline-flex items-center gap-1.5 rounded-md bg-navy-tint px-2 py-0.5 text-sm font-medium text-navy-soft">
                <Icon className="size-4 shrink-0" aria-hidden="true" />
                {t(UI.supplement[item.kind], lang)}
              </span>
              <span className="text-sm text-navy-soft">{t(item.timing, lang)}</span>
              <StatusPill status={item.status} lang={lang} className="ms-auto" />
            </div>

            <h4 className="text-base font-semibold leading-6 text-navy">
              {t(item.title, lang)}
            </h4>

            {/* 摘要始终可见，16px 正文，不折叠。 */}
            <p className="mt-1.5 text-base leading-relaxed text-navy-soft">
              {t(summary, lang)}
            </p>

            {rest.length > 0 ? (
              <Accordion type="single" collapsible>
                <AccordionItem value="details" className="border-b-0">
                  <AccordionTrigger className="min-h-11 py-2 text-sm font-medium text-navy-soft hover:no-underline">
                    {`${t(UI.details, lang)} · ${rest.length}`}
                  </AccordionTrigger>
                  <AccordionContent className="pb-2">
                    <BulletList items={rest} lang={lang} />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            ) : null}

            <div className="mt-3 border-t border-line pt-3">
              <PeopleRow people={item.people} lang={lang} focus={person} />
            </div>
          </article>
        );
      })}
    </section>
  );
}
