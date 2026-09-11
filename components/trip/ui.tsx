"use client";

import * as React from "react";
import { CheckIcon, CopyIcon, ExternalLinkIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import type { CopyEntry, L10n, Lang, Status } from "@/lib/trip-data";
import { UI, t } from "@/lib/trip-i18n";

/** 航班号、机场码、时间：在阿语 RTL 下必须保持从左到右。 */
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

/**
 * 只有「待定」才提示。已定的直接看正文 —— 每行都挂一个深色徽章既抢宽度又是噪音。
 * 提示独占一行放在摘要下面，不跟正文左右抢列（阿语的待定文案更长）。
 */
export function PendingHint({
  status,
  lang,
  className,
}: {
  status: Status;
  lang: Lang;
  className?: string;
}) {
  if (status !== "pending") return null;
  return (
    <p
      className={cn(
        "mt-1.5 inline-flex items-center rounded-md bg-miniso-red-tint px-2 py-0.5 text-sm font-medium leading-5 text-miniso-red-strong",
        className,
      )}
    >
      {t(UI.status.pending, lang)}
    </p>
  );
}

export function BulletList({
  items,
  lang,
  className,
}: {
  items: L10n[];
  lang: Lang;
  className?: string;
}) {
  if (items.length === 0) return null;
  return (
    <ul className={cn("space-y-1.5", className)}>
      {items.map((item, index) => (
        <li
          key={index}
          className="relative ps-4 text-base leading-relaxed text-navy-soft before:absolute before:start-0 before:top-[0.72em] before:size-1.5 before:rounded-full before:bg-miniso-red/45"
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
        "trip-display flex items-center gap-2.5 pt-1 text-[1.375rem] leading-9 tracking-tight text-navy",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="inline-block h-5 w-[3px] rounded-full bg-miniso-red"
      />
      {children}
    </h2>
  );
}

/** 复制中文文本。剪贴板不可用时按钮无反馈，但文本本身仍在页面上可手选。 */
export function CopyChinese({
  entry,
  lang,
  compact = false,
  showBig = false,
}: {
  entry: CopyEntry;
  lang: Lang;
  compact?: boolean;
  /** 这句是要举给司机或店员看的：字号加大，隔着一臂也读得清。 */
  showBig?: boolean;
}) {
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 1800);
    return () => window.clearTimeout(timer);
  }, [copied]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(entry.chinese);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div
      className={cn(
        // showBig 的那张是嵌在地点卡里面的，自己不再当卡片 ——
        // 卡中卡会叠两层阴影，正是「什么都长一个样」的来源。
        showBig ? "" : cn("trip-card", compact ? "p-2.5" : "p-3"),
      )}
    >
      {/* 标签只是眉批，中文那行才是要被读的东西 —— 字号和底纹都归它 */}
      <p className="text-sm font-medium uppercase leading-5 tracking-[0.06em] text-navy-soft/80">
        {t(entry.label, lang)}
      </p>
      <p
        lang="zh-CN"
        dir="ltr"
        className={cn(
          "mt-1.5 font-medium text-navy",
          showBig
            ? "trip-show-panel px-3 py-2.5 text-lg leading-8"
            : "text-base",
        )}
      >
        {entry.chinese}
      </p>
      <button
        type="button"
        onClick={copy}
        aria-label={`${t(UI.copy, lang)} ${t(entry.label, lang)}`}
        data-copy={entry.id}
        className="mt-2 inline-flex min-h-11 items-center gap-1.5 rounded-lg border border-navy/20 bg-white px-3 text-sm font-medium text-navy transition-colors hover:border-navy/45 hover:bg-navy-tint"
      >
        {copied ? (
          <CheckIcon className="size-4" aria-hidden="true" />
        ) : (
          <CopyIcon className="size-4" aria-hidden="true" />
        )}
        {copied ? t(UI.copied, lang) : t(UI.copy, lang)}
      </button>
    </div>
  );
}

/**
 * 只有一个按钮的紧凑版复制。用在小表的住宿行 ——
 * 完整中文地址在同一行的「详情」里，复制失败时还能手选。
 */
export function CopyButton({
  entry,
  lang,
}: {
  entry: CopyEntry;
  lang: Lang;
}) {
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 1800);
    return () => window.clearTimeout(timer);
  }, [copied]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(entry.chinese);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      data-copy={entry.id}
      className="mt-2 inline-flex min-h-11 items-center gap-1.5 rounded-lg border border-navy/25 px-3 text-sm font-medium text-navy transition-colors hover:border-navy/50"
    >
      {copied ? (
        <CheckIcon className="size-4 shrink-0" aria-hidden="true" />
      ) : (
        <CopyIcon className="size-4 shrink-0" aria-hidden="true" />
      )}
      <span className="text-start">
        {copied
          ? t(UI.copied, lang)
          : `${t(UI.copy, lang)}${lang === "zh" ? "" : " "}${t(entry.label, lang)}`}
      </span>
    </button>
  );
}

export function SourceLink({
  label,
  url,
  lang,
}: {
  label: L10n;
  url: string;
  lang: Lang;
}) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-start gap-1.5 text-sm font-medium text-miniso-red-strong underline underline-offset-4"
    >
      <ExternalLinkIcon
        className="mt-0.5 size-4 shrink-0 rtl:-scale-x-100"
        aria-hidden="true"
      />
      <span>{t(label, lang)}</span>
    </a>
  );
}
