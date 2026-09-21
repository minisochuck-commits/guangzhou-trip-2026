/* eslint-disable @next/next/no-img-element -- Original event artwork is served unchanged. */
import type { ReactNode } from "react";
import { EVENT_CONTACTS } from "@/lib/meeting-guide";

// Translation of the user-provided 参会指引.png. Guest-specific corrections belong
// in AttendeeGuide's separate note, never silently inside this translated source.
const PROGRAMME = [
  { day: "21 سبتمبر", rows: [["14:00–24:00", "تسجيل الوصول إلى الفندق"]] },
  { day: "22 سبتمبر", rows: [
    ["09:00–09:30", "تسجيل الحضور للمؤتمر"],
    ["09:30–10:00", "عرض استراتيجية التشغيل في MINISO", "Vincent"],
    ["10:00–10:30", "عرض استراتيجية التسويق في MINISO", "Robin"],
    ["10:30–11:30", "عرض استراتيجية المنتجات في MINISO"],
    ["11:30–11:40", "حفل التوقيع ومنح التفويض"],
    ["11:40–11:45", "افتتاح معرض المنتجات الجديدة"],
    ["11:45–22:00", "طلبات المنتجات الجديدة"],
  ] },
  { day: "23 سبتمبر", rows: [
    ["09:00–22:00", "طلبات المنتجات الجديدة"],
    ["الوقت لاحقًا", "جولة المتاجر المتميزة — تم توحيد الجولات في 23 سبتمبر"],
  ] },
  { day: "24 سبتمبر", rows: [
    ["09:00–18:00", "طلبات المنتجات الجديدة"],
  ] },
  { day: "25 سبتمبر", rows: [["12:00", "تسجيل المغادرة من الفندق قبل الساعة 12:00 ظهرًا"]] },
];

const PRODUCT_TOPICS = [
  ["الاتجاهات والاستراتيجية", "Stephen"],
  ["الاستهلاك المدفوع بالاهتمامات", "Stanley & Tara · Yan & Maggie · Alan & Tom"],
  ["تشكيلة المنتجات ذات القيمة مقابل السعر", "Grace & Charlie"],
  ["تشكيلة المنتجات التي تجمع الجودة والسعر المناسب", "Grace & Charlie"],
];

const ZONES = [
  ["الشخصيات الأصلية", "Original IP"], ["ألعاب ومجسّمات رائجة", "Trendy Toy"],
  ["تعاونات الشخصيات والعلامات", "Collaboration IP"], ["منتجات الصيف", "Summer"],
  ["المنتجات الموسمية", "Seasonal Product"], ["مستلزمات المنزل والحياة اليومية", "Living Style"],
  ["المنتجات الرقمية", "Digital Product"], ["الألعاب المحشوة", "Plush Toy"],
  ["الألعاب", "Toy"], ["الحقائب", "Bag"], ["منتجات التجميل", "Beauty"], ["الأدوات المكتبية", "Stationery"],
];

const STORES = [
  { name: "MINISO FRIENDS · TeeMall", address: "الطابق الرابع، تي مول، 208 طريق تيانخه، حي تيانخه، قوانغتشو، غوانغدونغ، الصين.", chinese: "广州市天河区天河路208号天河城购物中心4楼" },
  { name: "SUPER MINISO · Junchao Center", address: "الطابق الأول، مركز جونتشاو، 1 طريق يونغبيان، مجتمع تانغشيا الثاني، حي تيانخه، قوانغتشو، غوانغدونغ، الصين.", chinese: "广州市天河区棠下二社涌边路1号君超中心F1" },
  { name: "MINISO LAND · Grandview Mall", address: "الممر الشمالي بالطابق الأول، غراندفيو مول، 228 طريق تيانخه، قوانغتشو، غوانغدونغ، الصين.", chinese: "广州市天河区天河路228号正佳广场1楼北街" },
];

function Section({ title, children }: { title: string; children: ReactNode }) {
  return <section className="space-y-3 border-t border-orange-200 pt-5">
    <h3 className="text-lg font-bold text-amber-950">{title}</h3>
    {children}
  </section>;
}

/** CSS viewport onto the unmodified source: keeps the original product artwork. */
function ProductArtwork() {
  return <figure>
    <div className="relative overflow-hidden rounded-lg" style={{ aspectRatio: "1210 / 4380" }}>
      <img src="./reference/attendee-guide-2026.png" alt="صور مناطق المنتجات الاثنتي عشرة كما وردت في الدليل الأصلي" width={1210} height={16584} loading="lazy"
        className="absolute left-0 h-auto w-full max-w-none" style={{ top: `${-5530 / 4380 * 100}%` }} />
    </div>
    <figcaption className="mt-2 text-xs text-amber-950/70">صور المنتجات من الدليل الأصلي؛ أسماء المناطق مترجمة أدناه.</figcaption>
  </figure>;
}

export function AttendeeGuideArabic() {
  return <article lang="ar" dir="rtl" className="mx-auto max-w-[46rem] space-y-6 bg-[#fff9f0] px-4 py-5 text-[15px] leading-7 text-[#513326] sm:px-8">
    <header className="space-y-3 text-center">
      <img src="./reference/attendee-guide-cover.jpg" alt="غلاف فعالية MINISO Growing & Blooming" width={484} height={560} className="mx-auto w-48 rounded-xl" />
      <p className="text-xs font-semibold text-orange-800">ترجمة عربية مع تحديث موعد الجولات</p>
      <h2 className="text-xl font-bold">دليل المشاركين</h2>
      <p dir="ltr" className="text-sm font-semibold">MINISO BLOOMING GALLERY TOUR 2027</p>
      <p>إبداع ينمو ويزدهر، وشخصيات أصلية تصل إلى العالم. أهلًا بكم في جولة MINISO: اكتشفوا 12 منطقة عرض مبتكرة وأكثر من 3,600 منتج جديد، في لقاء يجمع الشغف والإبداع والنمو.</p>
    </header>

    <Section title="جدول الفعالية">
      {PROGRAMME.map(({ day, rows }) => <div key={day} className="overflow-hidden rounded-xl border border-orange-200 bg-white">
        <h4 className="bg-orange-100 px-3 py-2 font-bold">{day}</h4>
        <dl className="divide-y divide-orange-100">
          {rows.map(([time, title, speaker]) => <div key={time} className="px-3 py-2.5">
            <dt><bdi dir="ltr" className="font-semibold tabular-nums text-orange-900">{time}</bdi></dt>
            <dd>{title}{speaker && <span className="block text-sm text-amber-950/70"><bdi dir="ltr">{speaker}</bdi></span>}</dd>
            {day === "22 سبتمبر" && time === "10:30–11:30" && <dd className="mt-2 space-y-2 border-s-2 border-orange-200 ps-3 text-sm">
              {PRODUCT_TOPICS.map(([topic, names]) => <div key={topic}>{topic}<bdi dir="ltr" className="block text-amber-950/70">{names}</bdi></div>)}
            </dd>}
          </div>)}
        </dl>
      </div>)}
    </Section>

    <Section title="لمحة عن المنتجات الجديدة">
      <ProductArtwork />
      <ul className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
        {ZONES.map(([ar, en]) => <li key={en}>{ar}<span dir="ltr" className="block text-xs text-amber-950/65">{en}</span></li>)}
      </ul>
    </Section>

    <Section title="مواعيد تقديم الطلبات">
      <ul className="space-y-2">
        <li><strong>22 سبتمبر، <bdi dir="ltr">12:00</bdi>:</strong> فتح باب الطلبات.</li>
        <li><strong>23 سبتمبر، <bdi dir="ltr">22:00</bdi>:</strong> تقديم الطلبات المسبقة.</li>
        <li><strong>24 سبتمبر، <bdi dir="ltr">18:00</bdi>:</strong> تقديم الطلبات النهائية.</li>
      </ul>
    </Section>

    <Section title="تعليمات السرية والدخول">
      <ul className="list-disc space-y-2 ps-5">
        <li>الدخول إلى الفعالية بالتعرّف على الوجه. يرجى حمل بطاقة الضيف <bdi dir="ltr">GUEST</bdi> طوال الوقت.</li>
        <li>يجب تجهيز الهواتف لمنع التصوير عند مدخل القاعة الداخلية قبل الدخول. يُسمح بحواسيب العمل؛ ولا يُسمح بأجهزة <bdi dir="ltr">iPad</bdi> والكاميرات وغيرها من الأجهزة القادرة على التصوير داخل القاعة.</li>
      </ul>
    </Section>

    <Section title="مكان الفعالية">
      <p className="font-semibold">فندق إنتركونتيننتال قوانغتشو إكزيبيشن سنتر</p>
      <p dir="ltr" className="text-start text-sm">InterContinental Guangzhou Exhibition Center</p>
      <p>828 طريق يويجيانغ الأوسط، حي هايتشو، قوانغتشو، غوانغدونغ، الصين.</p>
      <p lang="zh" dir="ltr" className="rounded-lg bg-white p-3 text-sm">广州保利洲际酒店<br />广州市海珠区阅江中路828号</p>
    </Section>

    <Section title="زيارة المتاجر المتميزة">
      <p>تدعو MINISO شركاءها من مختلف أنحاء العالم لزيارة متاجرها المتميزة في قوانغتشو خلال الفعالية، وتتولى تنظيم النقل والزيارات.</p>
      <div className="space-y-4">
        {STORES.map(store => <div key={store.name} className="space-y-1 border-s-2 border-orange-300 ps-3">
          <h4 className="font-semibold"><bdi dir="ltr">{store.name}</bdi></h4>
          <p>{store.address}</p>
          <p lang="zh" dir="ltr" className="break-words text-xs text-amber-950/70">{store.chinese}</p>
        </div>)}
      </div>
    </Section>

    <Section title="نصائح لرحلة مريحة">
      <ul className="list-disc space-y-2 ps-5">
        <li><strong>الطقس:</strong> يذكر الدليل درجات حرارة بين 25 و33°م في قوانغتشو، ويوصي بارتداء قميص أو تيشيرت.</li>
        <li><strong>الملابس:</strong> توفّر الفعالية تيشيرت MINISO مخصصًا.</li>
        <li><strong>الدفع:</strong> يُستخدم <bdi dir="ltr">WeChat Pay</bdi> و<bdi dir="ltr">Alipay</bdi> على نطاق واسع في الصين.</li>
        <li><strong>الطوارئ:</strong> الشرطة <a href="tel:110" dir="ltr" className="underline">110</a>؛ الإسعاف <a href="tel:120" dir="ltr" className="underline">120</a>.</li>
      </ul>
      <h4 className="font-semibold">جهات اتصال MINISO للطوارئ</h4>
      {EVENT_CONTACTS.map(contact => <div key={contact.phone} className="rounded-lg bg-white px-3 py-2">
        <p>{contact.language.ar} — <bdi dir="ltr">{contact.name}</bdi></p>
        <a dir="ltr" className="inline-block underline underline-offset-4" href={`tel:${contact.phone.replace(/ /g, "")}`}>{contact.phone}</a>
      </div>)}
      <p className="pt-3 text-center font-semibold">اقتربت رحلتكم المنتظرة؛ نتمنى لكم سفرًا سعيدًا وإقامة ممتعة!</p>
    </Section>
  </article>;
}
