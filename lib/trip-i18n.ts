// 界面文案（三语）与日期格式化。行程内容本身在 lib/trip-data.ts。

import type { EventKind, L10n, Lang, Status, TimeZoneTag } from "./trip-data";

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
  title: {
    zh: "广州行程",
    en: "Guangzhou Visit",
    ar: "زيارة قوانغتشو",
  },
  titleAlt: {
    zh: "Guangzhou Visit",
    en: "广州行程",
    ar: "广州行程 · Guangzhou Visit",
  },
  dateRange: {
    zh: "2026 年 9 月 20 日 – 10 月 7 日",
    en: "20 SEP – 07 OCT 2026",
    ar: "20 سبتمبر – 7 أكتوبر 2026",
  },
  banner: {
    zh: "安排更新中：酒店、餐厅、司机和接待联系人待确认。",
    en: "Plan still being updated: hotel, restaurants, drivers and host contacts are not confirmed yet.",
    ar: "الخطة قيد التحديث: الفندق والمطاعم والسائقون وجهات اتصال الاستضافة لم تُؤكَّد بعد.",
  },
  bannerNote: {
    zh: "标「建议安排」的都还没预订，标「待确认」的还没定下来。",
    en: "Anything marked “Suggested” is not booked, and anything marked “To confirm” is not settled.",
    ar: "كل ما هو «مقترح» غير محجوز، وكل ما هو «بانتظار التأكيد» غير محسوم.",
  },
  language: { zh: "语言", en: "Language", ar: "اللغة" },
  viewing: { zh: "查看", en: "Viewing", ar: "العرض" },
  everyone: { zh: "全部", en: "All", ar: "الكل" },
  tabs: {
    itinerary: { zh: "日程", en: "Itinerary", ar: "البرنامج" },
    logistics: { zh: "吃住行", en: "Stay & travel", ar: "الإقامة والتنقل" },
    guide: { zh: "来华指南", en: "China guide", ar: "دليل الصين" },
  },
  status: {
    confirmed: { zh: "已确定", en: "Confirmed", ar: "مؤكد" },
    suggested: { zh: "建议安排", en: "Suggested", ar: "مقترح" },
    pending: { zh: "待确认", en: "To confirm", ar: "بانتظار التأكيد" },
  } satisfies Record<Status, L10n>,
  kind: {
    flight: { zh: "航班", en: "Flight", ar: "رحلة" },
    ground: { zh: "地面", en: "Ground", ar: "تنقل" },
    hotel: { zh: "住宿", en: "Hotel", ar: "الفندق" },
    meeting: { zh: "会议", en: "Sessions", ar: "جلسات" },
    study: { zh: "学习", en: "Training", ar: "تدريب" },
    hosting: { zh: "接待", en: "Hosting", ar: "استضافة" },
    free: { zh: "自由活动", en: "Free time", ar: "وقت حر" },
    note: { zh: "提示", en: "Note", ar: "ملاحظة" },
  } satisfies Record<EventKind, L10n>,
  tz: {
    cairo: { zh: "开罗时间", en: "Cairo time", ar: "بتوقيت القاهرة" },
    beijing: { zh: "北京时间", en: "Beijing time", ar: "بتوقيت بكين" },
  },
  who: { zh: "参与", en: "Who", ar: "المشاركون" },
  toConfirmLabel: { zh: "待确认", en: "To confirm", ar: "بانتظار التأكيد" },
  noEvents: {
    zh: "这一天没有属于该视图的安排。",
    en: "Nothing scheduled for this view on this day.",
    ar: "لا يوجد شيء مجدول لهذا العرض في هذا اليوم.",
  },
  nextDayArrival: {
    zh: "次日抵达",
    en: "arrives next day",
    ar: "الوصول اليوم التالي",
  },
  openItems: {
    zh: "待确认清单",
    en: "Open items",
    ar: "بنود بانتظار التأكيد",
  },
  openItemsNote: {
    zh: "以下每一条定下来之前，相关安排都不能当成已落实。",
    en: "Until each line below is settled, the related arrangement is not in place.",
    ar: "إلى أن يُحسم كل بند أدناه، فإن الترتيب المرتبط به غير قائم.",
  },
  cityOptions: {
    zh: "9/26 城市体验建议（未预订）",
    en: "26 Sep city ideas (not booked)",
    ar: "أفكار ليوم 26 سبتمبر في المدينة (غير محجوزة)",
  },
  copyAddresses: {
    zh: "可复制的中文地址",
    en: "Chinese addresses you can copy",
    ar: "عناوين بالصينية يمكن نسخها",
  },
  copy: { zh: "复制", en: "Copy", ar: "نسخ" },
  copied: { zh: "已复制", en: "Copied", ar: "تم النسخ" },
  officialSources: {
    zh: "官方来源",
    en: "Official sources",
    ar: "مصادر رسمية",
  },
  reference: {
    zh: "参考：总部通知",
    en: "Reference: HQ notice",
    ar: "مرجع: إشعار المقر",
  },
  untimed: {
    zh: "时间待定的安排",
    en: "Without a set time",
    ar: "بدون وقت محدد",
  },
  group: { zh: "分组", en: "Group", ar: "المجموعة" },
  team: { zh: "人员", en: "Who is travelling", ar: "المسافرون" },
  footer: {
    zh: "航班按票面当地时间；建议及待确认安排尚未落实。",
    en: "Flight times are the ticket's local times; suggested and to-be-confirmed items are not in place yet.",
    ar: "أوقات الرحلات بالتوقيت المحلي كما في التذكرة؛ والبنود المقترحة أو التي بانتظار التأكيد لم تُنفَّذ بعد.",
  },
  expand: { zh: "展开", en: "Show", ar: "عرض" },
  collapse: { zh: "收起", en: "Hide", ar: "إخفاء" },
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

export function parseDate(iso: string): { y: number; m: number; d: number; weekday: number } {
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
  if (lang === "en") return `${weekday} ${d} ${MONTHS.en[m]}`;
  return `${weekday} ${d} ${MONTHS.ar[m]}`;
}

export function shortDateLabel(iso: string, lang: Lang): string {
  const { m, d } = parseDate(iso);
  if (lang === "zh") return `${m}/${d}`;
  return `${d} ${MONTHS[lang][m]}`;
}

export function rangeLabel(from: string, to: string, lang: Lang): string {
  return `${shortDateLabel(from, lang)} – ${shortDateLabel(to, lang)}`;
}

/** [from, to] 之间的每一天（含首尾），用于跨日事件逐日显示。 */
export function datesBetween(from: string, to: string): string[] {
  if (to < from) return [from];
  const { y, m, d } = parseDate(from);
  const cursor = new Date(Date.UTC(y, m - 1, d));
  const out: string[] = [];
  // 本次行程最长跨度是 9/25–10/5，上限留足余量同时保证不会死循环。
  for (let guard = 0; guard < 400; guard++) {
    const iso = cursor.toISOString().slice(0, 10);
    out.push(iso);
    if (iso >= to) break;
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }
  return out;
}

/**
 * 各机场时区相对 UTC 的偏移（小时）。
 *
 * 中国全年 UTC+8。埃及自 2023 年恢复夏令时，起止是「4 月最后一个周五 – 10 月最后一个
 * 周四」；2026 年 10 月最后一个周四是 10/29，所以本行程涉及的 9/20 – 10/7 全部落在
 * 夏令时区间内，开罗一律 UTC+3。行程只有这两个时区，因此直接写死映射，
 * 不引入运行时时区数据库。
 */
const UTC_OFFSET_HOURS: Record<TimeZoneTag, number> = {
  beijing: 8,
  cairo: 3,
};

/**
 * 把「某地当地日期 + 当地时刻」换算成真实时间轴上的毫秒数，用于同一天内跨时区排序。
 * 例如 9/21 00:20 开罗 = 9/20 21:20 UTC，早于 9/21 08:00 北京（= 9/21 00:00 UTC）。
 */
export function instantOf(date: string, time: string, tz: TimeZoneTag): number {
  const { y, m, d } = parseDate(date);
  const [hh, mm] = time.split(":").map(Number);
  return Date.UTC(y, m - 1, d, hh, mm) - UTC_OFFSET_HOURS[tz] * 3_600_000;
}
