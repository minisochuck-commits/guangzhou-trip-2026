"use client";

import * as React from "react";
import { ChevronDownIcon } from "lucide-react";

import { DIET_ASK, type Row } from "@/lib/person-day-plan";
import type { CellView } from "@/lib/plan-presentation";
import {
  CHENGDU_TRANSFER,
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
import { CopyChinese, Ltr, PendingHint } from "./ui";
import { FlightDetails } from "./flight-details";

/**
 * 矩阵里的一个字段格。
 *
 * 表内只放 `view.lines`（2–4 短行，来自 lib/plan-presentation.ts 手写的短句）
 * 加一条可选建议。完整原文、细节、地址、航班、路线、美食都在弹窗里，
 * 按钮文字按内容命名 —— 「酒店地址」「航班与行李」「巡店安排」…… 不再统称「详情」。
 */
/** 去掉空白和句末标点再比 —— 详情里的地址句尾多一个「。」，复制串没有。 */
function normalizeChinese(value: string): string {
  return value.replace(/\s+/g, "").replace(/[。.．]+$/, "");
}

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
  const hasFlights = Boolean(row.flights?.length);
  const hasCopy = Boolean(row.copy?.length);

  // 弹窗里滤掉三类重复内容。事实正本 person-day-plan 不动，只是不再重复展示：
  //   1. CHENGDU_TRANSFER —— 「去程 T1→T2、回程 T2→T1」混在一起的抽象说明，
  //      路线里已经按方向给了真实航站楼、日期和停留时长。
  //   2. DIET_ASK —— 每个餐饮格都挂同一句通用饮食提醒，整站只该说一次，
  //      现在统一放在指南的「吃什么」里。
  //   3. 与复制卡片同一段中文地址的那条 —— 下面的 CopyChinese 已经把它整段显示出来了。
  const copyChinese = new Set(
    (row.copy ?? []).map((entry) => normalizeChinese(entry.chinese)),
  );
  const sheetDetail = (row.detail ?? []).filter(
    (item) =>
      item !== CHENGDU_TRANSFER &&
      item !== DIET_ASK &&
      !copyChinese.has(normalizeChinese(item.zh)),
  );
  const coordination = view.coordination ?? [];
  // 抵达日不再重复出发日那条完整航程。
  const showJourney = hasFlights && !view.hideJourney;

  // 弹窗里真有东西才挂按钮。以前有些格子点开只是把表里那句话再念一遍。
  const hasSheetContent =
    showJourney || sheetDetail.length > 0 || coordination.length > 0 || hasCopy;

  const entryLabel =
    view.entry && hasSheetContent ? t(UI.entries[view.entry], lang) : null;
  const names = people.map((id) => PERSON_MAP[id].name).join(" · ");

  return (
    <div className="space-y-1">
      {/* 窄屏三列并排，正文降到 14px；≥768px 回到 16px。 */}
      {view.lines.map((line, index) => (
        <p
          key={index}
          className={
            index === 0
              ? "text-sm leading-5 text-navy md:text-base md:leading-6"
              : "text-sm leading-5 text-navy-soft md:text-base md:leading-6"
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

      {entryLabel ? (
        <Sheet>
          {/* 窄列里按钮文字必须能换行，同时保持 44px 可点高度、不被裁掉。 */}
          <SheetTrigger className="mt-1 inline-flex h-auto min-h-11 w-full max-w-full items-center justify-start gap-1 whitespace-normal break-words rounded-lg border border-navy/25 px-2 py-1.5 text-start text-sm font-medium leading-5 text-navy transition-colors hover:border-navy/50 md:w-auto md:px-2.5">
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
              {/* 整条旅程排最前。标题栏已经写着「航班与行李」，不再加一个同名小标题；
                  表里的短句也不在这里重念一遍 —— 弹窗只给表里没有的东西。 */}
              {showJourney ? (
                <FlightDetails ids={row.flights ?? []} lang={lang} />
              ) : null}

              {/* 当天特有的协调事项 + 细节。到机场时刻已在旅程里，这里不重复。 */}
              {coordination.length > 0 || sheetDetail.length > 0 ? (
                <ul className="space-y-1.5">
                  {[...coordination, ...sheetDetail].map((item, index) => (
                    <li
                      key={index}
                      className="relative ps-4 text-base leading-relaxed text-navy-soft before:absolute before:start-0 before:top-[0.7em] before:size-1.5 before:rounded-full before:bg-navy/25"
                    >
                      {t(item, lang)}
                    </li>
                  ))}
                </ul>
              ) : null}

              {view.hidePending ? null : (
                <PendingHint status={row.status} lang={lang} />
              )}

              {hasCopy ? (
                <div className="space-y-2">
                  {row.copy?.map((entry) => (
                    <CopyChinese key={entry.id} entry={entry} lang={lang} />
                  ))}
                </div>
              ) : null}

              {/* 游玩路线与美食文化只在「来华指南」里，日程弹窗不再放建议。 */}
            </div>
          </SheetContent>
        </Sheet>
      ) : null}
    </div>
  );
}
