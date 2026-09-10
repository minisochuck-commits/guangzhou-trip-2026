"use client";

import * as React from "react";
import { AlertTriangleIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import type { L10n, Lang, PersonId, Status } from "@/lib/trip-data";
import { PERSON_MAP } from "@/lib/trip-data";
import { UI, t } from "@/lib/trip-i18n";

/** 姓名、航班号、时间：在阿语 RTL 下必须保持从左到右。 */
export function Ltr({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span dir="ltr" className={cn("ltr-token", className)}>
      {children}
    </span>
  );
}

const STATUS_STYLE: Record<Status, string> = {
  confirmed: "bg-navy text-white",
  suggested: "border border-dashed border-navy/35 bg-white text-navy-soft",
  pending: "bg-miniso-red-tint text-miniso-red-strong",
};

export function StatusPill({
  status,
  lang,
  className,
}: {
  status: Status;
  lang: Lang;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center rounded-full px-2.5 py-0.5 text-sm font-medium leading-6",
        STATUS_STYLE[status],
        className,
      )}
    >
      {t(UI.status[status], lang)}
    </span>
  );
}

/**
 * 事件卡上的参与者只显示票面短名（角色在「人员」名单里给一次，不在每张卡上重复）。
 */
export function PersonTag({
  id,
  lang,
  active = false,
}: {
  id: PersonId;
  lang: Lang;
  active?: boolean;
}) {
  const person = PERSON_MAP[id];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-sm leading-6",
        active ? "bg-navy text-white" : "bg-navy-tint text-navy",
      )}
      title={`${person.ticketName} · ${t(person.role, lang)}`}
    >
      <Ltr className="font-semibold tracking-wide">{person.short}</Ltr>
    </span>
  );
}

export function PeopleRow({
  people,
  lang,
  focus,
}: {
  people: PersonId[];
  lang: Lang;
  focus?: PersonId | null;
}) {
  if (people.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-1.5">
      {people.map((id) => (
        <PersonTag key={id} id={id} lang={lang} active={focus === id} />
      ))}
    </div>
  );
}

export function PendingList({
  items,
  lang,
}: {
  items: L10n[];
  lang: Lang;
}) {
  if (items.length === 0) return null;
  return (
    <div className="rounded-lg bg-miniso-red-tint px-3 py-2.5">
      <div className="mb-1 flex items-center gap-1.5 text-sm font-semibold text-miniso-red-strong">
        <AlertTriangleIcon className="size-4 shrink-0" aria-hidden="true" />
        {t(UI.toConfirmLabel, lang)}
      </div>
      <ul className="space-y-1.5">
        {items.map((item, index) => (
          <li
            key={index}
            className="text-base leading-relaxed text-navy ps-4 relative before:absolute before:start-0 before:top-[0.7em] before:size-1.5 before:rounded-full before:bg-miniso-red"
          >
            {t(item, lang)}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function BulletList({ items, lang }: { items: L10n[]; lang: Lang }) {
  if (items.length === 0) return null;
  return (
    <ul className="space-y-1.5">
      {items.map((item, index) => (
        <li
          key={index}
          className="relative ps-4 text-base leading-relaxed text-navy-soft before:absolute before:start-0 before:top-[0.7em] before:size-1.5 before:rounded-full before:bg-navy/25"
        >
          {t(item, lang)}
        </li>
      ))}
    </ul>
  );
}

export function SectionHeading({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={cn(
        "flex items-center gap-2 text-lg font-semibold tracking-tight text-navy",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="inline-block h-4 w-1 rounded-full bg-miniso-red"
      />
      {children}
    </h2>
  );
}
