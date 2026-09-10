"use client";

import * as React from "react";
import { ChevronDownIcon } from "lucide-react";

import type { Row } from "@/lib/person-day-plan";
import { PERSON_MAP, type Lang, type PersonId } from "@/lib/trip-data";
import { UI, fullDateLabel, t } from "@/lib/trip-i18n";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { CopyChinese, Ltr, PendingHint, SectionHeading } from "./ui";
import { FlightDetails } from "./flight-details";
import { RouteList } from "./routes";

/**
 * 矩阵里的一个字段格（住宿 / 活动 / 餐饮 / 交通）。
 *
 * 内容沿用原来 PlanRow 的那一套：摘要常显 → 待定提示 → 详情。
 * 区别是详情不再在格子里就地展开 —— 列只有十几 rem 宽，
 * 航班块和完整中文地址在里面会把整行撑到满屏。所以改用底部 Sheet，
 * 宽度不受列宽限制，三语都读得完整。
 */
export function PlanCell({
  row,
  lang,
  label,
  date,
  people,
  showRoutes = false,
  routeIds,
}: {
  row: Row;
  lang: Lang;
  /** 列名，也用作 Sheet 标题的一部分。 */
  label: string;
  date: string;
  /** 这一行涉及的人，用于 Sheet 标题。 */
  people: PersonId[];
  /** 只有活动列、且当天确实自由时才给自由行建议。 */
  showRoutes?: boolean;
  routeIds?: string[];
}) {
  const hasDetail = Boolean(row.detail?.length);
  const hasFlights = Boolean(row.flights?.length);
  const hasCopy = Boolean(row.copy?.length);
  const hasMore = hasDetail || hasFlights || hasCopy || showRoutes;

  const names = people.map((id) => PERSON_MAP[id].name).join(" · ");

  return (
    <div className="space-y-1.5">
      <p className="text-base leading-relaxed text-navy">{t(row.text, lang)}</p>

      <PendingHint status={row.status} lang={lang} className="mt-0" />

      {hasMore ? (
        <Sheet>
          <SheetTrigger className="inline-flex min-h-11 items-center gap-1 rounded-lg border border-navy/25 px-2.5 text-sm font-medium text-navy transition-colors hover:border-navy/50">
            {t(UI.details, lang)}
            <ChevronDownIcon className="size-4 shrink-0" aria-hidden="true" />
          </SheetTrigger>
          {/*
            Sheet 通过 Portal 挂到 <body>，拿不到表格那边的 dir/lang，
            所以这里显式给一遍，否则阿语内容会按 LTR 排。
            自带的关闭按钮只有 16px、纯英文、还压在标题右上角，关掉它自己做。
          */}
          <SheetContent
            side="bottom"
            showCloseButton={false}
            dir={lang === "ar" ? "rtl" : "ltr"}
            lang={lang}
            className="max-h-[85dvh] w-full overflow-y-auto rounded-t-2xl"
          >
            {/* 吸顶：航班 + 路线展开后内容很长，关闭按钮不能滚出去 */}
            <SheetHeader className="sticky top-0 z-10 gap-2 border-b border-line bg-background pb-3">
              <div className="flex items-start gap-3">
                <div className="min-w-0 flex-1">
                  <SheetTitle className="text-lg leading-7 text-navy">
                    {label}
                    <span className="ms-2 text-base font-normal text-navy-soft">
                      <Ltr>{names}</Ltr>
                    </span>
                  </SheetTitle>
                  <SheetDescription className="text-sm text-navy-soft">
                    {fullDateLabel(date, lang)}
                  </SheetDescription>
                </div>
                <SheetClose className="inline-flex min-h-11 shrink-0 items-center rounded-lg border border-navy/25 px-3 text-sm font-medium text-navy transition-colors hover:border-navy/50">
                  {t(UI.close, lang)}
                </SheetClose>
              </div>
            </SheetHeader>

            <div className="space-y-4 px-4 pb-8">
              <div>
                <p className="text-base leading-relaxed text-navy">
                  {t(row.text, lang)}
                </p>
                <PendingHint status={row.status} lang={lang} />
              </div>

              {hasDetail ? (
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
              ) : null}

              {hasCopy ? (
                <div className="space-y-2">
                  {row.copy?.map((entry) => (
                    <CopyChinese key={entry.id} entry={entry} lang={lang} />
                  ))}
                </div>
              ) : null}

              {hasFlights ? (
                <section className="space-y-2">
                  <SectionHeading className="text-base">
                    {t(UI.flightDetails, lang)}
                  </SectionHeading>
                  <FlightDetails ids={row.flights ?? []} lang={lang} />
                </section>
              ) : null}

              {showRoutes ? (
                <section className="space-y-2">
                  <SectionHeading className="text-base">
                    {t(UI.freeTimeIdeas, lang)}
                  </SectionHeading>
                  <RouteList lang={lang} ids={routeIds} />
                </section>
              ) : null}
            </div>
          </SheetContent>
        </Sheet>
      ) : null}
    </div>
  );
}
