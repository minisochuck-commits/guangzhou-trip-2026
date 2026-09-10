"use client";

import * as React from "react";

import { OPEN_ITEMS, type Lang } from "@/lib/trip-data";
import { UI, t } from "@/lib/trip-i18n";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

/**
 * 全程统一的待确认清单。折叠，放在页尾 —— 它是给负责推进的人看的总表，
 * 不该挡住当天要用的信息。
 */
export function OpenItemsPanel({ lang }: { lang: Lang }) {
  return (
    <section className="mt-4 rounded-xl border border-miniso-red/35 bg-miniso-red-tint px-4">
      <Accordion type="single" collapsible>
        <AccordionItem value="open-items" className="border-b-0">
          <AccordionTrigger className="py-3 text-base font-semibold text-miniso-red-strong hover:no-underline">
            {`${t(UI.openItems, lang)} · ${OPEN_ITEMS.length}`}
          </AccordionTrigger>
          <AccordionContent className="pb-4">
            <p className="mb-2 text-base leading-relaxed text-navy">
              {t(UI.openItemsNote, lang)}
            </p>
            <ul className="space-y-2">
              {OPEN_ITEMS.map((item, index) => (
                <li
                  key={index}
                  className="relative ps-4 text-base leading-relaxed text-navy before:absolute before:start-0 before:top-[0.7em] before:size-1.5 before:rounded-full before:bg-miniso-red"
                >
                  {t(item, lang)}
                </li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </section>
  );
}
