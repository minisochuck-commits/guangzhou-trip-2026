"use client";

import * as React from "react";

import { ROUTES, type Lang } from "@/lib/trip-data";
import { UI, t } from "@/lib/trip-i18n";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CopyChinese, SourceLink } from "./ui";

/**
 * 三条半日建议路线。全部未预订，时长是规划参考。
 * 日程页只在真正自由的日子给一个折叠入口，指南页给完整总览。
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
    <div className="space-y-2">
      <p className="text-sm leading-relaxed text-navy-soft">
        {t(UI.routesNote, lang)}
      </p>
      <Accordion type="multiple" className="space-y-2">
        {routes.map((route) => (
          <AccordionItem
            key={route.id}
            value={route.id}
            className="rounded-xl border border-line bg-white px-3 border-b"
          >
            <AccordionTrigger className="min-h-11 py-3 hover:no-underline">
              <span className="flex min-w-0 flex-col items-start gap-0.5 text-start">
                <span className="text-base font-semibold leading-6 text-navy">
                  {t(route.title, lang)}
                </span>
                <span className="text-sm leading-5 text-navy-soft">
                  {t(route.duration, lang)}
                </span>
              </span>
            </AccordionTrigger>
            <AccordionContent className="space-y-3 pb-4">
              <p className="text-base leading-relaxed text-navy">
                {t(route.summary, lang)}
              </p>

              <Field label={t(UI.routeBestFor, lang)}>
                {t(route.bestFor, lang)}
              </Field>

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
