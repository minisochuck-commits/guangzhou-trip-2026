"use client";
/* eslint-disable @next/next/no-img-element -- Static original poster; no image transformation. */
import * as React from "react";
import { FileImageIcon, XIcon, ZoomInIcon, ZoomOutIcon } from "lucide-react";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { t } from "@/lib/trip-i18n";
import type { Lang } from "@/lib/trip-data";
import { AttendeeGuideArabic, DemoAttendeeGuide } from "./attendee-guide-ar";

const TITLE = { zh: "参会指引", en: "Attendee guide", ar: "دليل المشاركين" };
const NOTE = {
  zh: "演示资料：人员、行程与活动均为虚构，不对应真实预订。原始内部通知和个人联系方式不在本演示中提供。",
  en: "Demo material: fictional visitors, trips and activities, unrelated to real bookings. Original internal notices and personal contacts are excluded.",
  ar: "مواد تجريبية: الزوار والرحلات والأنشطة خيالية ولا ترتبط بحجوزات حقيقية. لا تتضمن إشعارات داخلية أصلية أو جهات اتصال شخصية.",
};

export function AttendeeGuide({ lang, cover = false }: { lang: Lang; cover?: boolean }) {
  const [open, setOpen] = React.useState(false);
  const [version, setVersion] = React.useState<"original" | "ar">("ar");
  const [zoom, setZoom] = React.useState(false);
  const viewport = React.useRef<HTMLDivElement>(null);
  function changeVersion(next: "original" | "ar") {
    setVersion(next);
    setZoom(false);
    viewport.current?.scrollTo({ top: 0, left: 0 });
  }

  return <Dialog open={open} onOpenChange={next => {
    if (next) { setVersion("ar"); setZoom(false); }
    setOpen(next);
  }}>
    <DialogTrigger className={cover
      ? "flex w-full items-center gap-3 rounded-xl border border-card-line p-3 text-start text-navy transition-colors hover:border-navy/40"
      : "mt-1 inline-flex min-h-11 w-full items-center justify-start gap-1 rounded-lg border border-navy/25 px-2 py-1.5 text-start text-sm font-medium leading-5 text-navy hover:border-navy/50 md:w-auto md:px-2.5"}>
      {cover ? <>
        <img src="./reference/demo-cover.svg" alt={t({ zh: "演示指引封面", en: "Demo guide cover", ar: "غلاف الدليل التجريبي" }, lang)} width={484} height={560} loading="lazy" className="h-24 w-20 shrink-0 rounded-md object-cover" />
        <span><span className="block text-[15px] font-semibold">{t(TITLE, lang)}</span><span className="mt-1 block text-sm text-navy-soft">{t({ zh: "虚构活动 · 查看演示指引", en: "Fictional event · Demo guide", ar: "فعالية خيالية · دليل تجريبي" }, lang)}</span></span>
      </> : <><FileImageIcon className="size-4 shrink-0" />{t(TITLE, lang)}</>}
    </DialogTrigger>
    <DialogContent showCloseButton={false} aria-describedby={undefined} dir={lang === "ar" ? "rtl" : "ltr"}
      className="flex h-[100dvh] max-h-[100dvh] w-full max-w-full flex-col gap-0 overflow-hidden rounded-none border-0 p-0 sm:h-[94dvh] sm:max-w-[56rem] sm:rounded-xl">
      <header className="relative shrink-0 border-b border-card-line bg-white px-3 py-2 pr-14">
        <DialogTitle className="text-base leading-6">{t(TITLE, lang)}</DialogTitle>
        <DialogClose aria-label={t({ zh: "关闭参会指引", en: "Close attendee guide", ar: "إغلاق دليل المشاركين" }, lang)} className="absolute right-1 top-1 flex size-11 items-center justify-center rounded-lg text-navy hover:bg-slate-100"><XIcon className="size-5" /></DialogClose>
        <div className="mt-1 flex flex-wrap items-center gap-1 text-sm">
          {(["ar", "original"] as const).map(value => <button type="button" key={value} aria-pressed={version === value} onClick={() => changeVersion(value)}
            className={`min-h-11 rounded-lg px-2 py-1 ${version === value ? "bg-navy text-white" : "bg-slate-100 text-navy"}`}>
            {value === "original" ? t({ zh: "中英示例", en: "CN/EN sample", ar: "نموذج صيني وإنجليزي" }, lang) : t({ zh: "阿语示例", en: "Arabic sample", ar: "نموذج عربي" }, lang)}
          </button>)}
          {version === "original" && <button type="button" aria-pressed={zoom} onClick={() => setZoom(!zoom)} className="inline-flex min-h-11 items-center gap-1 rounded-lg px-2 text-navy">
            {zoom ? <ZoomOutIcon className="size-4" /> : <ZoomInIcon className="size-4" />}
            {t(zoom ? { zh: "适应屏幕", en: "Fit", ar: "ملاءمة الشاشة" } : { zh: "放大", en: "Zoom", ar: "تكبير" }, lang)}
          </button>}
        </div>
      </header>
      <div ref={viewport} data-attendee-scroll className="min-h-0 flex-1 overflow-auto overscroll-contain bg-white" dir="ltr">
        <div dir={lang === "ar" ? "rtl" : "ltr"} className="border-b border-orange-200 bg-orange-50 px-4 py-3 text-start text-sm leading-6 text-amber-950">
          <DialogDescription className="text-inherit">{t(NOTE, lang)}</DialogDescription>
        </div>
        {version === "ar" ? <AttendeeGuideArabic /> : <div style={{ width: zoom ? 1210 : "100%" }}><DemoAttendeeGuide lang="zh" /><DemoAttendeeGuide lang="en" /></div>}
      </div>
    </DialogContent>
  </Dialog>;
}
