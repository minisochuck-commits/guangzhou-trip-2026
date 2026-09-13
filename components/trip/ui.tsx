"use client";
/* eslint-disable @next/next/no-img-element -- 静态站、离线可用、相对路径：故意用原生 <img>，不走 next/image 的加载器 */

import * as React from "react";
import { CheckIcon, CopyIcon, ExternalLinkIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import type { CopyEntry, L10n, Lang, Status } from "@/lib/trip-data";
import { UI, t } from "@/lib/trip-i18n";

/**
 * 指南的排版尺度 —— 整份页面只在这里定一次，别在各处各写一串 text-*。
 *
 * 用户 2026-09-11 明确要求的是三件事：要「介绍」不要工具化的分组清单、
 * **字太大**、层级不清。按这个要求缩小字号。
 * 下面这组具体尺度是**本轮的实施选择，尚待实际页面核验**，不是用户逐项认可的方案：
 *   正文 15px / 1.65 · 章标题 17px 半粗 · 小标题 15px 半粗 · 副说明与来源 13px
 * 桌面不再加大 —— 同一份文章，屏幕宽只是行更长，不是字更大。
 *
 * 15px 是**对默认 16px 正文下限的一次例外**，依据是用户点名字太大；理由与边界
 * 写在 docs/GUEST_GUIDE.md。根字号仍是 16px，表单控件也仍是 16px
 * （iOS 聚焦放大只看控件字号）。
 */
export const GUIDE = {
  /** 段落正文。 */
  body: "text-[0.9375rem] leading-[1.65] text-navy-soft",
  /** 需要更深一档的正文（地址、交通这种要看准的句子）。 */
  bodyStrong: "text-[0.9375rem] leading-[1.65] text-navy",
  /** 一章开头那句话。不再是大号衬线，只是半粗一档。 */
  lead: "text-base font-semibold leading-[1.6] text-navy",
  /** 章标题。 */
  heading: "trip-display text-[1.0625rem] font-semibold leading-[1.45] text-navy",
  /** 章里面的小标题：一家清真寺、一道菜、一条准备事项。 */
  subheading: "text-[0.9375rem] font-semibold leading-[1.5] text-navy",
  /** 副说明、图注、来源、眉批。 */
  note: "text-[0.8125rem] leading-[1.55] text-navy-soft",
} as const;

/**
 * 竖构图的照片（高大于宽）：按 16/9、4/3 这种横框裁，剩下的只是中间一条。
 * 这几张一律放全、不裁，两边留白落在 `.trip-photo` 的底色上。
 * 名单集中在这里，路线、指南、餐饮三处共用。
 */
export const TALL_PHOTOS = new Set([
  "tower", // 800×1200 广州塔
  "ginger", // 900×1200 姜撞奶
  "zhezhe", // 900×1200 啫啫煲
  "seafood", // 900×1200 清蒸石斑
  "bubbletea", // 900×1200 一杯茶饮
  "huaisheng", // 960×1200 怀圣寺
  "river", // 1192×1200 近方图，按 16/9 裁会切掉塔顶
  "cashless", // 1200×1148 近方图，按 16/10 裁只剩中间一条
]);

/**
 * 一张照片该怎么放：横图按给定比例裁，竖图按比例放全。
 * `ratio` 用 Tailwind 的 aspect 类，`cap` 是竖图的限高。
 * 小缩略图（商场那一列的 88×66）还用它；整幅照片走下面的 `Figure`。
 */
export function photoFit(imageKey: string, ratio: string, cap = "max-h-[22rem]") {
  return TALL_PHOTOS.has(imageKey) ? `${cap} object-contain` : `${ratio} object-cover`;
}

/**
 * 一张照片 + 一句图说。整份指南里成幅的照片都走这里。
 *
 * 三条规矩：
 *   1. **按原比例放全，永不裁切** —— 塔尖、屋檐、机身都要留在画面里，
 *      所以只给限高与限宽，不用 object-cover。竖图自然就窄，居中留白。
 *   2. 手机上限高 15rem（240px）左右，桌面 20rem；照片是插图，不是海报。
 *   3. alt 与图说分工：alt 说清照片里有什么（读屏用），图说给一句上下文，
 *      不把 alt 再抄一遍。图说可以不给，alt 不行。
 */
export function Figure({
  src,
  alt,
  caption,
  lang,
  width,
  height,
  className,
  imageClassName,
}: {
  src: string;
  alt: L10n;
  caption?: L10n;
  lang: Lang;
  width?: number;
  height?: number;
  className?: string;
  /**
   * 只有限高这一项可以按张覆盖。竖构图的大场景照片按默认限高会被压成一张邮票
   * （1320×1957 那张在手机上只剩约 162px 宽），那一张单独传更高的限高，
   * 仍然是按原比例放全、居中、不裁。不传就是默认的 15rem / 20rem。
   */
  imageClassName?: string;
}) {
  return (
    <figure className={cn("my-3", className)}>
      <img
        src={src}
        alt={t(alt, lang)}
        width={width}
        height={height}
        loading="lazy"
        className={cn(
          "trip-photo mx-auto block h-auto w-auto max-w-full",
          imageClassName ?? "max-h-[15rem] md:max-h-[20rem]",
        )}
      />
      {caption ? (
        <figcaption className={cn(GUIDE.note, "mt-1.5 text-center")}>
          {t(caption, lang)}
        </figcaption>
      ) : null}
    </figure>
  );
}

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
          className={cn(
            GUIDE.body,
            "relative ps-4 before:absolute before:start-0 before:top-[0.72em] before:size-1.5 before:rounded-full before:bg-miniso-red/45",
          )}
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
  inline = false,
  hideChinese = false,
}: {
  entry: CopyEntry;
  lang: Lang;
  compact?: boolean;
  /** 这句是要举给司机或店员看的：字号加大，隔着一臂也读得清。 */
  showBig?: boolean;
  /**
   * 一行里的紧凑版：中文 + 一个复制按钮，不要眉批、不要卡片、不要大字底纹。
   * 用在餐饮品牌那种一行一个店名的地方 —— 那里要复制的是店名，不是一整张地址。
   * 默认 false，原有用法一个字都不用改。
   */
  inline?: boolean;
  /**
   * 只在 `inline` 下有意义：中文已经写在旁边（比如中文视图里标题就是店名），
   * 这里只留按钮，不把同一串字再印一遍。
   */
  hideChinese?: boolean;
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

  if (inline) {
    return (
      <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-1">
        {hideChinese ? null : (
          <span
            lang="zh-CN"
            dir="ltr"
            className="text-[0.9375rem] font-medium leading-6 text-navy"
          >
            {entry.chinese}
          </span>
        )}
        <button
          type="button"
          onClick={copy}
          aria-label={`${t(UI.copy, lang)} ${t(entry.label, lang)}`}
          data-copy={entry.id}
          className={cn(
            GUIDE.note,
            "inline-flex min-h-11 items-center gap-1.5 rounded-lg border border-navy/20 px-2.5 font-medium text-navy transition-colors hover:border-navy/45 hover:bg-navy-tint",
          )}
        >
          {copied ? (
            <CheckIcon className="size-3.5" aria-hidden="true" />
          ) : (
            <CopyIcon className="size-3.5" aria-hidden="true" />
          )}
          {copied ? t(UI.copied, lang) : t(UI.copy, lang)}
        </button>
      </span>
    );
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
      <p
        className={cn(
          GUIDE.note,
          "font-medium uppercase tracking-[0.06em] text-navy-soft/80",
        )}
      >
        {t(entry.label, lang)}
      </p>
      {/* 这一行是例外：要举给司机看，所以比正文大。其余都按 GUIDE 的尺度。 */}
      <p
        lang="zh-CN"
        dir="ltr"
        className={cn(
          "mt-1.5 font-medium text-navy",
          showBig
            ? "trip-show-panel px-3 py-2 text-[1.0625rem] leading-7"
            : "text-[0.9375rem] leading-6",
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
      className={cn(
        GUIDE.note,
        "inline-flex items-start gap-1.5 font-medium text-miniso-red-strong underline underline-offset-4",
      )}
    >
      <ExternalLinkIcon
        className="mt-0.5 size-3.5 shrink-0 rtl:-scale-x-100"
        aria-hidden="true"
      />
      <span>{t(label, lang)}</span>
    </a>
  );
}
