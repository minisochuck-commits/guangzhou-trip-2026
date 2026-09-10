"use client";

import * as React from "react";

import {
  LOGISTICS,
  OPEN_ITEMS,
  type InfoBlock,
  type Lang,
  type PersonId,
} from "@/lib/trip-data";
import { UI, t } from "@/lib/trip-i18n";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { BulletList, PeopleRow, SectionHeading, StatusPill } from "./ui";

function keepsBlock(block: InfoBlock, person: PersonId | null): boolean {
  if (!person) return true;
  if (!block.people) return true;
  return block.people.includes(person);
}

function InfoCard({
  block,
  lang,
  person,
}: {
  block: InfoBlock;
  lang: Lang;
  person: PersonId | null;
}) {
  return (
    <article className="rounded-xl border border-line bg-white p-4 shadow-sm">
      <div className="mb-2 flex flex-wrap items-start gap-2">
        <h3 className="min-w-0 flex-1 text-base font-semibold leading-6 text-navy">
          {t(block.title, lang)}
        </h3>
        <StatusPill status={block.status} lang={lang} />
      </div>
      <BulletList items={block.lines} lang={lang} />
      {block.people?.length ? (
        <div className="mt-3 border-t border-line pt-3">
          <PeopleRow people={block.people} lang={lang} focus={person} />
        </div>
      ) : null}
    </article>
  );
}

export function LogisticsTab({
  lang,
  person,
}: {
  lang: Lang;
  person: PersonId | null;
}) {
  return (
    <div className="space-y-6">
      {LOGISTICS.map((section) => {
        const blocks = section.blocks.filter((block) =>
          keepsBlock(block, person),
        );
        if (blocks.length === 0) return null;
        return (
          <section key={section.id} className="space-y-3">
            <SectionHeading>{t(section.title, lang)}</SectionHeading>
            {blocks.map((block) => (
              <InfoCard
                key={block.id}
                block={block}
                lang={lang}
                person={person}
              />
            ))}
          </section>
        );
      })}

      <section className="rounded-xl border border-miniso-red/35 bg-miniso-red-tint px-4">
        <Accordion type="single" collapsible>
          <AccordionItem value="open-items" className="border-b-0">
            <AccordionTrigger className="text-base font-semibold text-miniso-red-strong hover:no-underline">
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
    </div>
  );
}
