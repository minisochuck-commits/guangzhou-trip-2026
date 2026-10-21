// Fictional workshop fixture, unrelated to any real company event.
import type { L10n } from "./trip-data";
const L = (zh: string, en: string, ar: string): L10n => ({ zh, en, ar });
export const ARRIVAL_CHECKIN = L("演示入住：9/21 14:00后；提前入住待确认。", "Demo check-in: 21 Sep after 14:00; early access to confirm.", "وصول تجريبي: 21 سبتمبر بعد 14:00؛ الدخول المبكر بانتظار التأكيد.");
export const EVENT_CHECKOUT = L("演示退房：9/25 12:00前。", "Demo check-out: 25 Sep before 12:00.", "مغادرة تجريبية: 25 سبتمبر قبل 12:00.");
export const MEETING_RULES: L10n[] = [L("演示活动：请按示例日程到场。", "Demo event: follow the sample schedule.", "فعالية تجريبية: اتبعوا الجدول النموذجي.")];
export const MORNING_22: L10n[] = [L("09:00–09:30 签到；09:30–11:45 团队交流工作坊。", "09:00–09:30 check-in; 09:30–11:45 team workshop.", "09:00–09:30 تسجيل الحضور؛ 09:30–11:45 ورشة تبادل خبرات.")];
export const ORDERING_22 = L("下午为演示研讨环节。", "Afternoon demo workshop.", "ورشة تجريبية بعد الظهر.");
export const PREORDER_DEADLINE = L("22:00前整理研讨笔记（演示）。", "Complete workshop notes by 22:00 (demo).", "إعداد ملاحظات الورشة بحلول 22:00 (تجريبي).");
export const FINAL_ORDER_DEADLINE = L("18:00前提交交流总结（演示）。", "Share the workshop summary by 18:00 (demo).", "تقديم ملخص الورشة بحلول 18:00 (تجريبي).");
export const TOUR_DETAIL: L10n[] = [L("示例城市参访安排在9/23，时间和集合地点待确认。", "Sample city visit on 23 Sep; time and meeting point to confirm.", "زيارة نموذجية للمدينة يوم 23 سبتمبر؛ الوقت ونقطة التجمع بانتظار التأكيد.")];
export const EVENT_CONTACTS: {name: string; phone: string | null; language: L10n}[] = [
  {name: "Demo contact 1", phone: null, language: L("中文", "Chinese", "الصينية")},
  {name: "Demo contact 2", phone: null, language: L("英语", "English", "الإنجليزية")},
];
export const PRODUCT_PREVIEW = L("演示工作坊包含团队交流与城市参访。", "The demo workshop includes team discussions and a city visit.", "تشمل الورشة التجريبية تبادل الخبرات وزيارة للمدينة.");
