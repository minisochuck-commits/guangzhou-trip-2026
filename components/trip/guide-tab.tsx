"use client";

import * as React from "react";
import { CheckIcon, CopyIcon, ExternalLinkIcon } from "lucide-react";

import { COPY_ADDRESSES, GUIDE, OFFICIAL_LINKS, type Lang } from "@/lib/trip-data";
import { UI, t } from "@/lib/trip-i18n";
import { BulletList, Ltr, SectionHeading } from "./ui";

function CopyRow({ id, label, chinese, lang }: {
  id: string;
  label: string;
  chinese: string;
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
      await navigator.clipboard.writeText(chinese);
      setCopied(true);
    } catch {
      // 剪贴板不可用（旧浏览器或非安全上下文）时，地址本身仍然显示在页面上可手动选中。
      setCopied(false);
    }
  }

  return (
    <li className="rounded-lg border border-line bg-white p-3">
      <p className="text-sm text-navy-soft">{label}</p>
      <p lang="zh-CN" dir="ltr" className="mt-1 text-base font-medium text-navy">
        {chinese}
      </p>
      <button
        type="button"
        onClick={copy}
        aria-label={`${t(UI.copy, lang)} ${label}`}
        data-address={id}
        className="mt-2 inline-flex items-center gap-1.5 rounded-lg border border-navy/25 px-2.5 py-1 text-sm font-medium text-navy transition-colors hover:border-navy/50"
      >
        {copied ? (
          <CheckIcon className="size-4" aria-hidden="true" />
        ) : (
          <CopyIcon className="size-4" aria-hidden="true" />
        )}
        {copied ? t(UI.copied, lang) : t(UI.copy, lang)}
      </button>
    </li>
  );
}

export function GuideTab({ lang }: { lang: Lang }) {
  return (
    <div className="space-y-6">
      <section className="space-y-3">
        {GUIDE.map((item) => (
          <article
            key={item.id}
            className="rounded-xl border border-line bg-white p-4 shadow-sm"
          >
            <h3 className="mb-2 text-base font-semibold leading-6 text-navy">
              {t(item.title, lang)}
            </h3>
            <BulletList items={item.lines} lang={lang} />
          </article>
        ))}
      </section>

      <section className="space-y-3">
        <SectionHeading>{t(UI.copyAddresses, lang)}</SectionHeading>
        <ul className="space-y-2">
          {COPY_ADDRESSES.map((address) => (
            <CopyRow
              key={address.id}
              id={address.id}
              label={t(address.label, lang)}
              chinese={address.chinese}
              lang={lang}
            />
          ))}
        </ul>
      </section>

      <section className="space-y-3">
        <SectionHeading>{t(UI.officialSources, lang)}</SectionHeading>
        <ul className="space-y-2">
          {OFFICIAL_LINKS.map((link) => (
            <li
              key={link.id}
              className="rounded-lg border border-line bg-white p-3"
            >
              <a
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-start gap-1.5 text-base font-semibold text-miniso-red-strong underline underline-offset-4"
              >
                <ExternalLinkIcon
                  className="mt-1 size-4 shrink-0 rtl:-scale-x-100"
                  aria-hidden="true"
                />
                <span>{t(link.title, lang)}</span>
              </a>
              <p className="mt-1 text-base leading-relaxed text-navy-soft">
                {t(link.note, lang)}
              </p>
              <p className="mt-1 break-all text-sm text-navy-soft/80">
                <Ltr>{link.url}</Ltr>
              </p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
