// 来源：用户提供的《参会指引.png》；巡店语言与参加日期由用户于 2026-09-16 确认。
import type { L10n } from "./trip-data";
const L = (zh: string, en: string, ar: string): L10n => ({ zh, en, ar: ar.replace(/\d{2}:\d{2}–\d{2}:\d{2}/g, "\u2066$&\u2069") });

export const ARRIVAL_CHECKIN = L("酒店入住办理：9/21 14:00–24:00。上午抵达可先向前台寄存行李，提前入住需现场确认。", "Hotel check-in: 21 Sep, 14:00–24:00. Morning arrivals can ask reception to store luggage; early room access depends on availability.", "تسجيل الوصول بالفندق يوم 21 سبتمبر من 14:00 إلى 24:00. يمكن للقادمين صباحًا طلب حفظ الأمتعة لدى الاستقبال؛ والدخول المبكر للغرفة حسب التوافر.");
export const EVENT_CHECKOUT = L("9/25 中午12:00前从洲际退房。", "Check out of the InterContinental before 12:00 on 25 Sep.", "تسجيل المغادرة من إنتركونتيننتال قبل 12:00 يوم 25 سبتمبر.");
export const MEETING_RULES: L10n[] = [
  L("入场通过人脸识别，请全程携带嘉宾证。手机须在内场入口完成防拍摄设置；可带工作电脑，iPad、相机等可拍摄设备不可带入内场。", "Entry uses facial recognition; keep your guest badge with you. Phones need the anti-photography setup at the inner-hall entrance. Work laptops are allowed; iPads, cameras and other recording devices are not.", "الدخول بالتعرّف على الوجه؛ يرجى حمل بطاقة الضيف طوال الوقت. تُجهّز الهواتف لمنع التصوير عند مدخل القاعة الداخلية. يُسمح بحواسيب العمل، ولا يُسمح بأجهزة iPad والكاميرات وأجهزة التسجيل الأخرى."),
  L("大会提供 MINISO 定制T恤。会场就在保利洲际酒店内。", "A custom MINISO T-shirt is provided. The venue is inside the InterContinental hotel.", "توفّر الفعالية قميص MINISO مخصصًا. تُقام الجلسات داخل فندق إنتركونتيننتال."),
];
export const MORNING_22: L10n[] = [
  L("09:00–09:30 签到；09:30–10:00 运营策略；10:00–10:30 营销策略。", "09:00–09:30 sign-in; 09:30–10:00 operations strategy; 10:00–10:30 marketing strategy.", "09:00–09:30 التسجيل؛ 09:30–10:00 استراتيجية التشغيل؛ 10:00–10:30 استراتيجية التسويق."),
  L("10:30–11:30 商品策略；11:30–11:40 授权典礼；11:40–11:45 展馆揭幕仪式。", "10:30–11:30 product strategy; 11:30–11:40 signing ceremony; 11:40–11:45 new-product launch ceremony.", "10:30–11:30 استراتيجية المنتجات؛ 11:30–11:40 حفل التوقيع؛ 11:40–11:45 افتتاح معرض المنتجات الجديدة."),
];
export const ORDERING_22 = L("11:45–22:00 新品订货环节；订货流程注明12:00开放订货。", "11:45–22:00 product-ordering programme; the ordering-process notice lists orders opening at 12:00.", "11:45–22:00 برنامج طلب المنتجات؛ ويحدّد إشعار إجراءات الطلب الساعة 12:00 لفتح الطلبات.");
export const PREORDER_DEADLINE = L("22:00 前提交预订单。", "Submit pre-orders by 22:00.", "تقديم الطلبات المسبقة بحلول 22:00.");
export const FINAL_ORDER_DEADLINE = L("18:00 前提交最终订单。", "Submit final orders by 18:00.", "تقديم الطلبات النهائية بحلول 18:00.");
export const TOUR_DETAIL: L10n[] = [
  L("9/24 13:50–17:30 国际场巡店，英语讲解；上午自由活动。MINISO 统一安排交通及参观，集合时间、地点向 Rahma 确认。", "24 Sep, 13:50–17:30: international store tour in English; morning free. MINISO arranges transport and visits. Confirm the meeting point and assembly time with Rahma.", "24 سبتمبر، 13:50–17:30: جولة المتاجر الدولية باللغة الإنجليزية؛ الصباح حر. تنظم MINISO النقل والزيارات. يُرجى تأكيد نقطة ووقت التجمع مع Rahma."),
  L("指引推荐天河城 MINISO FRIENDS、君超 SUPER MINISO、正佳 MINISO LAND 三家门店；当天实际路线以现场安排为准。", "The guide highlights MINISO FRIENDS at TeeMall, SUPER MINISO at Junchao and MINISO LAND at Grandview. The actual tour route follows the organiser’s arrangements.", "يعرض الدليل متاجر MINISO FRIENDS في TeeMall وSUPER MINISO في Junchao وMINISO LAND في Grandview؛ والمسار الفعلي حسب تنظيم الفعالية."),
];
export const EVENT_CONTACTS = [
  { name: "Daisy Lin 林小青", phone: "+86 15913188419", language: L("中文", "Chinese", "الصينية") },
  { name: "Nicole Mai 麦楚怡", phone: "+86 18826481898", language: L("英语", "English", "الإنجليزية") },
];
export const PRODUCT_PREVIEW = L("这次新品展把3,600多款新品放进12个主题展区：从原创IP、联名系列，到香氛、数码与生活用品。会议听完策略，也可以到展区看看它们如何变成具体的商品。", "The new-product showcase brings more than 3,600 products into 12 themed zones, from original IP and collaborations to fragrances, digital accessories and everyday essentials. After hearing the strategy, the displays show how it takes shape in the products.", "يجمع معرض المنتجات الجديدة أكثر من 3,600 منتج في 12 منطقة موضوعية، من الشخصيات الأصلية والتعاونات إلى العطور والإكسسوارات الرقمية ومستلزمات الحياة اليومية. بعد الاستماع إلى الاستراتيجية، تتيح المعروضات رؤية تطبيقها في المنتجات.");
