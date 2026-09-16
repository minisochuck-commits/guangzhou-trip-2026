"use client";
/* eslint-disable @next/next/no-img-element -- Static original poster; no image transformation. */
import * as React from "react";
import { FileImageIcon, XIcon, ZoomInIcon, ZoomOutIcon } from "lucide-react";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { t } from "@/lib/trip-i18n";
import type { Lang } from "@/lib/trip-data";
import { AttendeeGuideArabic } from "./attendee-guide-ar";

const TITLE = { zh: "参会指引", en: "Attendee guide", ar: "دليل المشاركين" };
const NOTE = {
  zh: "本次接待补充：Reham参加9月24日13:50–17:30国际英语巡店；23日是国内中文场。原图的25日退房为大会通用安排，Reham仍按个人行程于27日退房。",
  en: "For this visit: Reham joins the international English-language tour on 24 Sep, 13:50–17:30. The 23 Sep tour is domestic and in Chinese. The poster’s 25 Sep checkout is the general event arrangement; Reham checks out on 27 Sep as scheduled.",
  ar: "توضيح خاص بهذه الزيارة: تشارك Reham في الجولة الدولية باللغة الإنجليزية يوم 24 سبتمبر، من \u206613:50–17:30\u2069. جولة 23 سبتمبر محلية وباللغة الصينية. المغادرة يوم 25 سبتمبر في الدليل هي الترتيب العام للفعالية؛ أمّا Reham فتغادر الفندق يوم 27 سبتمبر وفق جدولها الشخصي.",
};

export function AttendeeGuide({ lang, cover = false }: { lang: Lang; cover?: boolean }) {
  const [open, setOpen] = React.useState(false);
  const [version, setVersion] = React.useState<"original" | "ar">("ar");
  const [zoom, setZoom] = React.useState(false);
  const [imageFailed, setImageFailed] = React.useState(false);
  const viewport = React.useRef<HTMLDivElement>(null);
  function changeVersion(next: "original" | "ar") {
    setVersion(next);
    setZoom(false);
    viewport.current?.scrollTo({ top: 0, left: 0 });
  }

  return <Dialog open={open} onOpenChange={next => {
    if (next) { setVersion("ar"); setZoom(false); setImageFailed(false); }
    setOpen(next);
  }}>
    <DialogTrigger className={cover
      ? "flex w-full items-center gap-3 rounded-xl border border-card-line p-3 text-start text-navy transition-colors hover:border-navy/40"
      : "mt-1 inline-flex min-h-11 w-full items-center justify-start gap-1 rounded-lg border border-navy/25 px-2 py-1.5 text-start text-sm font-medium leading-5 text-navy hover:border-navy/50 md:w-auto md:px-2.5"}>
      {cover ? <>
        <img src="./reference/attendee-guide-cover.jpg" alt={t({ zh: "参会指引封面", en: "Attendee guide cover", ar: "غلاف دليل المشاركين" }, lang)} width={484} height={560} loading="lazy" className="h-24 w-20 shrink-0 rounded-md object-cover" />
        <span><span className="block text-[15px] font-semibold">{t(TITLE, lang)}</span><span className="mt-1 block text-sm text-navy-soft">{t({ zh: "查看阿语译文／中英原图", en: "Arabic translation / CN/EN original", ar: "الترجمة العربية / الصورة الأصلية" }, lang)}</span></span>
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
            {value === "original" ? t({ zh: "中英原图", en: "CN/EN original", ar: "الأصل الصيني والإنجليزي" }, lang) : t({ zh: "阿语译文", en: "Arabic translation", ar: "الترجمة العربية" }, lang)}
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
        {version === "ar" ? <AttendeeGuideArabic /> : imageFailed ? <p className="p-4 text-sm" dir={lang === "ar" ? "rtl" : "ltr"}>{t({ zh: "图片未能加载，请重新打开指引。", en: "The image could not load. Please reopen the guide.", ar: "تعذّر تحميل الصورة. يُرجى إعادة فتح الدليل." }, lang)}</p> :
          <img src="./reference/attendee-guide-2026.png" alt={t({ zh: "MINISO官方参会指引中英原图", en: "Original MINISO attendee guide in Chinese and English", ar: "الصورة الأصلية لدليل MINISO بالصينية والإنجليزية" }, lang)} width={1210} height={16584} onError={() => setImageFailed(true)} className="block h-auto max-w-none" style={{ width: zoom ? 1210 : "100%" }} />}
      </div>
    </DialogContent>
  </Dialog>;
}
