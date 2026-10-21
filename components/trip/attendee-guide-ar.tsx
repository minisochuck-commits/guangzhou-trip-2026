import type { Lang } from "@/lib/trip-data";
import { t } from "@/lib/trip-i18n";

const PROGRAMME = [
  { time: "21 SEP · 14:00", title: { zh: "示例入住与团队见面", en: "Sample check-in and introductions", ar: "وصول نموذجي وتعارف الفريق" } },
  { time: "22 SEP · 09:00", title: { zh: "团队交流工作坊", en: "Team workshop", ar: "ورشة تبادل خبرات" } },
  { time: "23 SEP", title: { zh: "城市参访，集合时间待确认", en: "City visit; meeting time to confirm", ar: "زيارة المدينة؛ وقت التجمع بانتظار التأكيد" } },
  { time: "24 SEP · 18:00", title: { zh: "交流总结", en: "Workshop summary", ar: "ملخص الورشة" } },
  { time: "25 SEP · 12:00", title: { zh: "示例退房时间", en: "Sample check-out time", ar: "وقت مغادرة نموذجي" } },
];

export function DemoAttendeeGuide({ lang }: { lang: Lang }) {
  return <article lang={lang} dir={lang === "ar" ? "rtl" : "ltr"} className="mx-auto max-w-[46rem] space-y-5 bg-[#fff9f0] px-4 py-5 text-[15px] leading-7 text-[#513326] sm:px-8">
    <header className="space-y-2 text-center">
      <h2 className="text-xl font-bold">{t({ zh: "广州交流活动 · 演示指引", en: "Guangzhou workshop · Demo guide", ar: "ورشة قوانغتشو · دليل تجريبي" }, lang)}</h2>
      <p>{t({ zh: "以下人员、日程与活动均为虚构示例，不对应真实预订。", en: "Visitors, schedules and activities are fictional examples, unrelated to real bookings.", ar: "الزوار والجداول والأنشطة أمثلة خيالية لا ترتبط بحجوزات حقيقية." }, lang)}</p>
    </header>
    <section className="space-y-3 border-t border-orange-200 pt-5">
      <h3 className="text-lg font-bold">{t({ zh: "示例日程 · 2026", en: "Sample programme · 2026", ar: "جدول نموذجي · 2026" }, lang)}</h3>
      {PROGRAMME.map(item => <div key={item.time} className="rounded-lg border border-orange-200 bg-white p-3"><bdi dir="ltr" className="block font-semibold">{item.time}</bdi><p>{t(item.title, lang)}</p></div>)}
    </section>
    <section className="space-y-2 border-t border-orange-200 pt-5">
      <h3 className="text-lg font-bold">{t({ zh: "联系与准备", en: "Contacts and preparation", ar: "التواصل والاستعداد" }, lang)}</h3>
      <p>{t({ zh: "演示版不提供个人姓名、手机号、机票姓名或原始内部通知。实际使用时请在私有副本填写联系信息。", en: "This demo includes no personal names, mobile numbers, ticket names or original internal notices. Add contacts only in a private deployment.", ar: "لا تتضمن النسخة التجريبية أسماء شخصية أو أرقام هواتف أو أسماء تذاكر أو إشعارات داخلية أصلية. أضيفوا جهات الاتصال في نسخة خاصة فقط." }, lang)}</p>
    </section>
  </article>;
}

export function AttendeeGuideArabic() {
  return <DemoAttendeeGuide lang="ar" />;
}
