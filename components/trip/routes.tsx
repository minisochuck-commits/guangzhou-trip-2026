"use client";
/* eslint-disable @next/next/no-img-element -- 静态站、离线可用、相对路径：故意用原生 <img>，不走 next/image 的加载器 */

import * as React from "react";

import { cn } from "@/lib/utils";
import { ROUTES, type Lang } from "@/lib/trip-data";
import { IMG } from "@/lib/photos";
import { UI, t } from "@/lib/trip-i18n";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CopyChinese, GUIDE, SourceLink, TALL_PHOTOS } from "./ui";

/**
 * 半日建议路线。全部未预订，时长是规划参考。
 * 日程页只在真正自由的日子给一个折叠入口，指南页给完整总览。
 *
 * 收起来只有一行：路线名 + 时长。照片和「适合什么」都在展开之后，各出现一次 ——
 * 上一版把小图、长名字和一句理由挤进折叠条，窄屏上挤成一团，已被用户否掉。
 */
export function RouteList({
  lang,
  ids,
}: {
  lang: Lang;
  /** 只显示这几条。不传就是全部（指南页用全部，某些半天只适合其中几条）。 */
  ids?: string[];
}) {
  const routes = ids ? ROUTES.filter((route) => ids.includes(route.id)) : ROUTES;
  return (
    <div className="max-w-[44rem]">
      <p className={GUIDE.note}>{t(UI.routesNote, lang)}</p>
      <Accordion type="multiple" className="mt-1.5">
        {routes.map((route) => (
          <AccordionItem
            key={route.id}
            value={route.id}
            className="border-t border-b-0 border-card-line"
          >
            <AccordionTrigger className="min-h-11 items-center gap-3 py-2.5 hover:no-underline">
              <span className="flex min-w-0 flex-1 flex-col items-start gap-0.5 text-start">
                <span className="text-base font-semibold leading-6 text-navy">
                  {t(route.title, lang)}
                </span>
                <span className={GUIDE.note}>{t(route.duration, lang)}</span>
              </span>
            </AccordionTrigger>
            <AccordionContent className="space-y-3 pb-4">
              {route.imageKey && IMG[route.imageKey] ? (
                <img
                  src={IMG[route.imageKey]}
                  alt={route.imageAlt ? t(route.imageAlt, lang) : ""}
                  loading="lazy"
                  className={cn(
                    "trip-photo w-full",
                    // 广州塔那两张是竖图：按 16/9 裁会切掉塔顶塔底，
                    // 所以竖图限高按比例放全，不裁（名单在 ui.tsx）。
                    TALL_PHOTOS.has(route.imageKey)
                      ? "max-h-[22rem] object-contain"
                      : "aspect-[16/9] object-cover",
                  )}
                />
              ) : null}

              <p className={GUIDE.bodyStrong}>{t(route.bestFor, lang)}</p>
              <p className={GUIDE.body}>{t(route.summary, lang)}</p>

              <Field label={t(UI.routeSteps, lang)}>
                <ul className="space-y-1">
                  {route.steps.map((step, index) => (
                    <li
                      key={index}
                      className="relative ps-4 before:absolute before:start-0 before:top-[0.7em] before:size-1.5 before:rounded-full before:bg-navy/25"
                    >
                      {t(step, lang)}
                    </li>
                  ))}
                </ul>
              </Field>

              <Field label={t(UI.routeTransport, lang)}>
                {t(route.transport, lang)}
              </Field>

              <Field label={t(UI.routeTickets, lang)}>
                {t(route.tickets, lang)}
              </Field>

              <div className="space-y-2">
                {route.copy.map((entry) => (
                  <CopyChinese key={entry.id} entry={entry} lang={lang} compact />
                ))}
              </div>

              <ul className="space-y-1">
                {route.sources.map((source) => (
                  <li key={source.url}>
                    <SourceLink label={source.label} url={source.url} lang={lang} />
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className={cn(GUIDE.note, "font-semibold text-navy-soft/85")}>
        {label}
      </p>
      <div className={cn(GUIDE.body, "mt-0.5")}>{children}</div>
    </div>
  );
}
