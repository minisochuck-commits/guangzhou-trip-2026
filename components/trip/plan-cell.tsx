"use client";

import * as React from "react";
import { ChevronDownIcon } from "lucide-react";

import type { Row } from "@/lib/person-day-plan";
import type { CellView } from "@/lib/plan-presentation";
import {
  FOOD_NOTES,
  PERSON_MAP,
  type Lang,
  type PersonId,
} from "@/lib/trip-data";
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
import { CopyChinese, Ltr, PendingHint, SectionHeading, SourceLink } from "./ui";
import { FlightDetails } from "./flight-details";
import { RouteList } from "./routes";

/**
 * 矩阵里的一个字段格。
 *
 * 表内只放 `view.lines`（2–4 短行，来自 lib/plan-presentation.ts 手写的短句）
 * 加一条可选建议。完整原文、细节、地址、航班、路线、美食都在弹窗里，
 * 按钮文字按内容命名 —— 「酒店地址」「航班与行李」「巡店安排」…… 不再统称「详情」。
 */
export function PlanCell({
  row,
  view,
  lang,
  date,
  people,
}: {
  row: Row;
  view: CellView;
  lang: Lang;
  date: string;
  /** 这一行涉及的人，用于弹窗标题。 */
  people: PersonId[];
}) {
  const hasDetail = Boolean(row.detail?.length);
  const hasFlights = Boolean(row.flights?.length);
  const hasCopy = Boolean(row.copy?.length);
  const hasRoutes = Boolean(view.routeIds?.length);
  const foodNotes = view.foodNoteIds
    ? FOOD_NOTES.filter((note) => view.foodNoteIds?.includes(note.id))
    : [];

  const entryLabel = view.entry ? t(UI.entries[view.entry], lang) : null;
  const names = people.map((id) => PERSON_MAP[id].name).join(" · ");

  return (
    <div className="space-y-1">
      {view.lines.map((line, index) => (
        <p
          key={index}
          className={
            index === 0
              ? "text-base leading-6 text-navy"
              : "text-base leading-6 text-navy-soft"
          }
        >
          {t(line, lang)}
        </p>
      ))}

      {/* 短行里已经写清「待定的是什么」时不再挂通用的红色「待定」——
          重复一遍只是白白拉高整行。完整状态在弹窗里仍然显示。 */}
      {view.hidePending ? null : (
        <PendingHint status={row.status} lang={lang} className="mt-1" />
      )}

      {view.suggestion ? (
        <p className="mt-1 rounded-md bg-navy-tint px-2 py-1 text-sm leading-5 text-navy-soft">
          {t(view.suggestion, lang)}
        </p>
      ) : null}

      {entryLabel ? (
        <Sheet>
          <SheetTrigger className="mt-1 inline-flex min-h-11 items-center gap-1 rounded-lg border border-navy/25 px-2.5 text-start text-sm font-medium text-navy transition-colors hover:border-navy/50">
            {entryLabel}
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
                    {entryLabel}
                  </SheetTitle>
                  <SheetDescription className="text-sm text-navy-soft">
                    {fullDateLabel(date, lang)}
                    <span className="mx-1 opacity-40">·</span>
                    <Ltr>{names}</Ltr>
                  </SheetDescription>
                </div>
                <SheetClose className="inline-flex min-h-11 shrink-0 items-center rounded-lg border border-navy/25 px-3 text-sm font-medium text-navy transition-colors hover:border-navy/50">
                  {t(UI.close, lang)}
                </SheetClose>
              </div>
            </SheetHeader>

            <div className="space-y-4 px-4 pb-8">
              {/* 完整原文：表内是压过的短句，这里必须给回未删减的那一段 */}
              <section className="space-y-1">
                <p className="text-sm font-semibold uppercase tracking-wide text-navy-soft">
                  {t(UI.fullText, lang)}
                </p>
                <p className="text-base leading-relaxed text-navy">
                  {t(row.text, lang)}
                </p>
                <PendingHint status={row.status} lang={lang} />
              </section>

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
                    {t(UI.entries.flights, lang)}
                  </SectionHeading>
                  <FlightDetails ids={row.flights ?? []} lang={lang} />
                </section>
              ) : null}

              {hasRoutes ? (
                <section className="space-y-2">
                  <SectionHeading className="text-base">
                    {t(UI.entries.routes, lang)}
                  </SectionHeading>
                  <RouteList lang={lang} ids={view.routeIds} />
                </section>
              ) : null}

              {foodNotes.length > 0 ? (
                <section className="space-y-2">
                  <SectionHeading className="text-base">
                    {t(UI.foodIdeas, lang)}
                  </SectionHeading>
                  <ul className="space-y-3">
                    {foodNotes.map((note) => (
                      <li key={note.id}>
                        <p className="text-base font-semibold leading-6 text-navy">
                          {t(note.title, lang)}
                        </p>
                        <p className="text-base leading-relaxed text-navy-soft">
                          {t(note.body, lang)}
                        </p>
                        {note.url ? (
                          <SourceLink
                            label={{
                              zh: "官方来源",
                              en: "Official source",
                              ar: "المصدر الرسمي",
                            }}
                            url={note.url}
                            lang={lang}
                          />
                        ) : null}
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}
            </div>
          </SheetContent>
        </Sheet>
      ) : null}
    </div>
  );
}
