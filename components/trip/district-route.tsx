"use client";

import type { Lang, L10n } from "@/lib/trip-data";
import { t } from "@/lib/trip-i18n";
import { CopyChinese } from "./ui";

const labels = {
  title: { zh: "从酒店出发，两种逛法", en: "Two outings from your hotel", ar: "جولتان من الفندق" },
  note: { zh: "这是行程示意，不是地理地图。两个商圈分开安排更从容；路况与步行路线请在地图中查询。", en: "An outing outline, not a geographic map. Allow a separate outing for each district; check traffic and walking directions in your map app.", ar: "هذا مخطط للجولات وليس خريطة جغرافية. خصّصي جولة لكل منطقة، وراجعي حركة المرور ومسارات المشي في تطبيق الخرائط." },
  hotel: { zh: "保利洲际酒店 · 琶洲", en: "InterContinental · Pazhou", ar: "إنتركونتيننتال · بازو" },
  taxi: { zh: "从酒店叫车到首站", en: "Take a taxi to the first stop", ar: "سيارة من الفندق إلى المحطة الأولى" },
  a: { zh: "天河路｜现代购物中心", en: "Tianhe Road · modern malls", ar: "شارع تيانخه · مراكز حديثة" },
  b: { zh: "北京路｜老城步行街", en: "Beijing Road · old-city walk", ar: "شارع بكين · جولة المدينة القديمة" },
  walk: { zh: "建议步行顺序，按体力选其中几家即可", en: "Suggested walking order; choose just a few stops if you prefer", ar: "ترتيب مقترح للمشي؛ يمكنك الاكتفاء ببعض المحطات" },
  tianhe: { zh: "天河城 → 天环 → 正佳广场 → 万菱汇 → 太古汇", en: "Teemall → Parc Central → Grandview → OneLink Walk → Taikoo Hui", ar: "تيمول ← بارك سنترال ← غراندفيو ← وان لينك ووك ← تايكو هوي" },
  beijing: { zh: "北京路步行街 → 古道遗址 → 周边街巷与小店", en: "Beijing Road pedestrian street → ancient street remains → nearby lanes and shops", ar: "شارع بكين للمشاة ← بقايا الطريق القديم ← الأزقة والمتاجر المحيطة" },
  firstA: { zh: "给司机看：天河城", en: "Show the driver: Teemall", ar: "للسائق: تيمول" },
  firstB: { zh: "给司机看：北京路步行街", en: "Show the driver: Beijing Road", ar: "للسائق: شارع بكين" },
} satisfies Record<string, L10n>;

export function DistrictRoute({ lang }: { lang: Lang }) {
  return (
    <section className="mb-5 space-y-3" aria-label={t(labels.title, lang)}>
      <h4 className="trip-display text-lg text-navy">{t(labels.title, lang)}</h4>
      <p className="rounded-lg bg-navy px-4 py-3 text-base text-white">{t(labels.hotel, lang)}</p>
      <p className="text-sm text-navy-soft">{t(labels.taxi, lang)}</p>
      <div className="grid gap-3 md:grid-cols-2">
        {[
          { id: "district-teemall", title: labels.a, route: labels.tianhe, label: labels.firstA, chinese: "请带我去广州天河城（天河路208号）。" },
          { id: "district-beijing", title: labels.b, route: labels.beijing, label: labels.firstB, chinese: "请带我去广州市越秀区北京路步行街，在允许停车的入口附近下车。" },
        ].map((route) => (
          <div key={route.id} className="rounded-xl border border-navy/15 bg-white p-4">
            <h5 className="font-semibold text-navy">{t(route.title, lang)}</h5>
            <p className="mt-2 text-sm text-navy-soft">{t(labels.walk, lang)}</p>
            <p className="my-3 text-base leading-7 text-navy">{t(route.route, lang)}</p>
            <CopyChinese entry={{ id: route.id, label: route.label, chinese: route.chinese }} lang={lang} showBig />
          </div>
        ))}
      </div>
      <p className="text-sm leading-6 text-navy-soft">{t(labels.note, lang)}</p>
    </section>
  );
}
