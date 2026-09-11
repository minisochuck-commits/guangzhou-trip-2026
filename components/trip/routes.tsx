"use client";
/* eslint-disable @next/next/no-img-element -- 静态站、离线可用、相对路径：故意用原生 <img>，不走 next/image 的加载器 */

import * as React from "react";

import { cn } from "@/lib/utils";
import { ROUTES, type Lang } from "@/lib/trip-data";
import { IMG } from "@/lib/image-credits";
import { UI, t } from "@/lib/trip-i18n";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CopyChinese, SourceLink } from "./ui";

/**
 * 竖构图的照片：小图框里按比例放全，不裁。
 * 广州塔那张是 800×1200 —— 按 96×72 裁出来只剩一截塔腰，看不出是塔。
 */
const PORTRAIT_IMAGES = new Set(["tower"]);

/**
 * 半日建议路线。全部未预订，时长是规划参考。
 * 日程页只在真正自由的日子给一个折叠入口，指南页给完整总览。
 *
 * 收起来的时候就能看出该选哪条：一张小图 + 名字 + 时长 + 一句「适合什么」。
 * 那句话收起时截两行，点开显示完整的一句 —— 所以展开之后不再重复一遍。
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
    <div>
      <p className="text-sm leading-relaxed text-navy-soft">
        {t(UI.routesNote, lang)}
      </p>
      <Accordion type="multiple" className="mt-2 border-t border-card-line">
        {routes.map((route) => (
          <AccordionItem
            key={route.id}
            value={route.id}
            className="border-b border-card-line last:border-b-0"
          >
            <AccordionTrigger className="group/route min-h-11 items-center gap-3 py-3 hover:no-underline">
              {route.imageKey && IMG[route.imageKey] ? (
                <img
                  src={IMG[route.imageKey]}
                  alt=""
                  loading="lazy"
                  width={96}
                  height={72}
                  className={cn(
                    "trip-photo h-[72px] w-24 shrink-0",
                    PORTRAIT_IMAGES.has(route.imageKey)
                      ? "object-contain"
                      : "object-cover",
                  )}
                />
              ) : null}
              <span className="flex min-w-0 flex-1 flex-col items-start gap-0.5 text-start">
                <span className="trip-display text-lg leading-7 text-navy">
                  {t(route.title, lang)}
                </span>
                <span className="text-sm leading-5 text-navy-soft">
                  {t(route.duration, lang)}
                </span>
                <span className="text-sm leading-5 text-navy-soft/90 group-data-[state=closed]/route:line-clamp-2">
                  {t(route.bestFor, lang)}
                </span>
              </span>
            </AccordionTrigger>
            <AccordionContent className="space-y-3 pb-4">
              <p className="text-base leading-relaxed text-navy">
                {t(route.summary, lang)}
              </p>

              <Field label={t(UI.routeSteps, lang)}>
                <ul className="space-y-1.5">
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
      <p className="text-sm font-semibold uppercase tracking-wide text-navy-soft">
        {label}
      </p>
      <div className="mt-0.5 text-base leading-relaxed text-navy-soft">
        {children}
      </div>
    </div>
  );
}
