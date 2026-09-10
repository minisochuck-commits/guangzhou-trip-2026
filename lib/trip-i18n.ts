// 界面文案（三语）与日期格式化。行程事实在 lib/trip-data.ts，
// 每天每人的四行在 lib/person-day-plan.ts。

import type { L10n, Lang, Status, TimeZoneTag } from "./trip-data";

export const LANGS: { id: Lang; label: string; dir: "ltr" | "rtl" }[] = [
  { id: "zh", label: "中文", dir: "ltr" },
  { id: "en", label: "English", dir: "ltr" },
  { id: "ar", label: "العربية", dir: "rtl" },
];

export const DEFAULT_LANG: Lang = "zh";

export function dirOf(lang: Lang): "ltr" | "rtl" {
  return lang === "ar" ? "rtl" : "ltr";
}

export function t(value: L10n, lang: Lang): string {
  return value[lang];
}

export const UI = {
  title: { zh: "广州行程", en: "Guangzhou Visit", ar: "زيارة قوانغتشو" },
  language: { zh: "语言", en: "Language", ar: "اللغة" },
  viewing: { zh: "查看", en: "Viewing", ar: "العرض" },
  everyone: { zh: "全部", en: "All", ar: "الكل" },

  // 表里放的是全部 18 天，不是「当天」，所以叫全部行程。
  tabs: {
    day: { zh: "全部行程", en: "Itinerary", ar: "برنامج الرحلة" },
    guide: { zh: "来华指南", en: "China guide", ar: "دليل الصين" },
  },

  /** 日期条是跳转，不是切换视图。 */
  jumpToDate: {
    zh: "跳到某一天",
    en: "Jump to a day",
    ar: "الانتقال إلى يوم",
  },
  close: { zh: "关闭", en: "Close", ar: "إغلاق" },

  /** 四个字段 —— 用户点名的顺序：住宿、活动、餐饮、交通。现在是表格的列头。 */
  rows: {
    lodging: { zh: "住宿", en: "Stay", ar: "الإقامة" },
    activity: { zh: "活动", en: "Plan", ar: "البرنامج" },
    dining: { zh: "餐饮", en: "Meals", ar: "الوجبات" },
    transport: { zh: "交通", en: "Travel", ar: "التنقل" },
  },

  /** 矩阵固定首列的表头：日期与人员纵向排在同一格。 */
  matrixCorner: {
    zh: "日期 / 人员",
    en: "Date / person",
    ar: "التاريخ / الشخص",
  },
  matrixHint: {
    zh: "左右滑动看住宿、活动、餐饮、交通；点上面的日期跳到那一天。",
    en: "Swipe sideways for stay, plan, meals and travel; tap a date above to jump to that day.",
    ar: "اسحب أفقيًا لرؤية الإقامة والبرنامج والوجبات والتنقل؛ واضغط على تاريخ بالأعلى للانتقال إلى ذلك اليوم.",
  },

  status: {
    confirmed: { zh: "已定", en: "Set", ar: "مؤكد" },
    pending: { zh: "待定", en: "To confirm", ar: "بانتظار التأكيد" },
  } satisfies Record<Status, L10n>,

  tz: {
    cairo: { zh: "开罗时间", en: "Cairo time", ar: "بتوقيت القاهرة" },
    beijing: { zh: "北京时间", en: "Beijing time", ar: "بتوقيت بكين" },
  } satisfies Record<TimeZoneTag, L10n>,

  details: { zh: "详情", en: "Details", ar: "التفاصيل" },
  flightDetails: {
    zh: "航班与行李",
    en: "Flights and baggage",
    ar: "الرحلات والأمتعة",
  },
  nextDay: { zh: "次日抵达", en: "arrives next day", ar: "الوصول اليوم التالي" },
  baggage: { zh: "免费行李额", en: "Free baggage allowance", ar: "الأمتعة المجانية" },
  checked: { zh: "托运", en: "Checked", ar: "المسجَّلة" },
  carryOn: { zh: "手提", en: "Carry-on", ar: "اليدوية" },

  team: { zh: "人员详情", en: "Traveller details", ar: "بيانات المسافرين" },
  ticketName: { zh: "票面姓名", en: "Name on ticket", ar: "الاسم في التذكرة" },

  copy: { zh: "复制", en: "Copy", ar: "نسخ" },
  copied: { zh: "已复制", en: "Copied", ar: "تم النسخ" },

  noPlan: {
    zh: "这一天没有属于该视图的安排。",
    en: "Nothing for this view on this day.",
    ar: "لا يوجد شيء لهذا العرض في هذا اليوم.",
  },

  freeTimeIdeas: {
    zh: "自由时间可以去哪（未预订）",
    en: "Ideas for free time (nothing booked)",
    ar: "أفكار لوقت الفراغ (دون أي حجز)",
  },
  routes: {
    zh: "半日建议路线",
    en: "Half-day route suggestions",
    ar: "مسارات مقترحة لنصف يوم",
  },
  routeDuration: { zh: "时长", en: "Length", ar: "المدة" },
  routeBestFor: { zh: "适合", en: "Best for", ar: "مناسب لـ" },
  routeSteps: { zh: "顺序", en: "Order", ar: "الترتيب" },
  routeTransport: { zh: "怎么去", en: "Getting there", ar: "كيفية الوصول" },
  routeTickets: { zh: "门票与开放", en: "Tickets and opening", ar: "التذاكر والفتح" },
  routesNote: {
    zh: "都是建议，全部未预订。时长是规划参考，不含临时变化；不写未核实的票价与营业时间。",
    en: "All suggestions, none booked. Durations are planning estimates, not promises; no unverified prices or opening hours are given.",
    ar: "كلها اقتراحات وغير محجوزة. والمدد تقديرات تخطيطية لا وعود؛ ولا تُذكر أسعار أو مواعيد غير مُتحقَّق منها.",
  },

  prep: { zh: "出发前准备", en: "Before you fly", ar: "قبل السفر" },
  food: { zh: "吃什么 · 文化小知识", en: "What to eat · a little context", ar: "ماذا تأكل · لمحة ثقافية" },
  phrases: {
    zh: "可复制的中文短句",
    en: "Chinese phrases you can copy",
    ar: "عبارات صينية يمكن نسخها",
  },
  copyAddresses: {
    zh: "可复制的中文地址",
    en: "Chinese addresses you can copy",
    ar: "عناوين بالصينية يمكن نسخها",
  },
  officialSources: { zh: "官方来源", en: "Official sources", ar: "مصادر رسمية" },
  reference: { zh: "参考：总部通知", en: "Reference: HQ notice", ar: "مرجع: إشعار المقر" },

  footer: {
    zh: "航班按票面当地时间；标「待定」的还没落实。",
    en: "Flight times are the ticket's local times; anything marked “to confirm” is not settled.",
    ar: "أوقات الرحلات بالتوقيت المحلي كما في التذكرة؛ وكل ما هو «بانتظار التأكيد» غير محسوم.",
  },
} as const;

/* ---------------- 日期 ---------------- */

const WEEKDAYS: Record<Lang, string[]> = {
  zh: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
  en: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  ar: ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"],
};

const MONTHS: Record<Lang, Record<number, string>> = {
  zh: { 9: "9月", 10: "10月" },
  en: { 9: "SEP", 10: "OCT" },
  ar: { 9: "سبتمبر", 10: "أكتوبر" },
};

export function parseDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  // UTC 构造，避免本地时区把日期推前一天。
  const weekday = new Date(Date.UTC(y, m - 1, d)).getUTCDay();
  return { y, m, d, weekday };
}

export function dayNumber(iso: string): string {
  return String(parseDate(iso).d);
}

export function monthLabel(iso: string, lang: Lang): string {
  const { m } = parseDate(iso);
  return MONTHS[lang][m] ?? String(m);
}

export function weekdayLabel(iso: string, lang: Lang): string {
  return WEEKDAYS[lang][parseDate(iso).weekday];
}

export function fullDateLabel(iso: string, lang: Lang): string {
  const { m, d } = parseDate(iso);
  const weekday = weekdayLabel(iso, lang);
  if (lang === "zh") return `${m} 月 ${d} 日 · ${weekday}`;
  return `${weekday} ${d} ${MONTHS[lang][m]}`;
}

export function shortDateLabel(iso: string, lang: Lang): string {
  const { m, d } = parseDate(iso);
  if (lang === "zh") return `${m}/${d}`;
  return `${d} ${MONTHS[lang][m]}`;
}
