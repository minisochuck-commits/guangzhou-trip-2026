// 广州行程 · 核定数据源（服务端与客户端共用的唯一数据正本）
//
// 数据来源与更新方式见 DESIGN_NOTES.md。
// 纪律：
//   - 只写已核定内容；未定的一律标 status: "pending" 并写清「待确认什么」。
//   - 建议性安排一律 status: "suggested"，文案不得写成「已预订 / 已安排」。
//   - 不放 PNR、票号、原始 PDF、个人电话。
//   - 机场时间一律为该机场当地时间；中国境内行程按北京时间标注。

export type Lang = "zh" | "en" | "ar";
export type L10n = { zh: string; en: string; ar: string };

export type PersonId = "qiuting" | "hassan" | "ahmed" | "rahma" | "reham";
export type GroupId = "merch" | "study" | "host";
export type Status = "confirmed" | "suggested" | "pending";
export type EventKind =
  | "flight"
  | "ground"
  | "hotel"
  | "meeting"
  | "study"
  | "hosting"
  | "free"
  | "note";
export type TimeZoneTag = "cairo" | "beijing";

export type Person = {
  id: PersonId;
  /** 取自票面拼法，保持不变 */
  short: string;
  /** 票面姓名，保持不变 */
  ticketName: string;
  role: L10n;
  group: GroupId;
};

export type Airport = {
  iata: string;
  name: L10n;
  city: L10n;
};

export type FlightPoint = {
  iata: keyof typeof AIRPORTS;
  terminal: string;
  date: string;
  time: string;
};

export type FlightLeg = {
  code: string;
  cabin?: L10n;
  from: FlightPoint;
  to: FlightPoint;
  baggage: L10n;
};

export type TripEvent = {
  id: string;
  date: string;
  endDate?: string;
  time?: string;
  endTime?: string;
  tz?: TimeZoneTag;
  kind: EventKind;
  status: Status;
  people: PersonId[];
  title: L10n;
  summary?: L10n;
  details?: L10n[];
  pending?: L10n[];
  flight?: FlightLeg;
  /** 高亮：关键缺口或必须盯住的时间点 */
  highlight?: boolean;
};

/* ------------------------------------------------------------------ */
/* 人员                                                                */
/* ------------------------------------------------------------------ */

export const PEOPLE: Person[] = [
  {
    id: "qiuting",
    short: "QIUTING",
    ticketName: "LI/QIUTING",
    group: "merch",
    role: {
      zh: "商品负责人",
      en: "Merchandise Lead",
      ar: "مسؤولة السلع",
    },
  },
  {
    id: "hassan",
    short: "HASSAN",
    ticketName: "HASSAN/MOHAMEDMOHAMED",
    group: "study",
    role: {
      zh: "防损负责人",
      en: "Loss Prevention Lead",
      ar: "مسؤول منع الخسائر",
    },
  },
  {
    id: "ahmed",
    short: "AHMED",
    ticketName: "ABDELMAGEED/AHMED ABED",
    group: "study",
    role: {
      zh: "区域经理",
      en: "Area Manager",
      ar: "مدير المنطقة",
    },
  },
  {
    id: "rahma",
    short: "RAHMA",
    ticketName: "ABDELHAMID/RAHMASAYED",
    group: "host",
    role: {
      zh: "董事长助理",
      en: "Chairman's Assistant",
      ar: "مساعدة رئيس مجلس الإدارة",
    },
  },
  {
    id: "reham",
    short: "REHAM",
    ticketName: "EISSA/REHAM MOHAMED",
    group: "host",
    role: {
      zh: "商场招商负责人",
      en: "Mall Leasing Lead",
      ar: "مسؤولة تأجير المراكز التجارية",
    },
  },
];

export const GROUPS: Record<GroupId, L10n> = {
  merch: { zh: "订货会行程", en: "Order Fair track", ar: "مسار معرض الطلبيات" },
  study: { zh: "学习组", en: "Training group", ar: "مجموعة التدريب" },
  host: { zh: "接待组", en: "Hosting group", ar: "مجموعة الاستضافة" },
};

export const TEAM_NOTES: L10n[] = [
  {
    zh: "学习组：AHMED（区域经理）+ HASSAN（防损负责人），吃住同行。",
    en: "Training group: AHMED (Area Manager) + HASSAN (Loss Prevention Lead) — same hotel and meals.",
    ar: "مجموعة التدريب: أحمد (مدير المنطقة) + حسن (مسؤول منع الخسائر) — نفس الفندق والوجبات.",
  },
  {
    zh: "接待组：RAHMA（董事长助理）+ REHAM（商场招商负责人），吃住同行；RAHMA 全程负责招待与陪同。",
    en: "Hosting group: RAHMA (Chairman's Assistant) + REHAM (Mall Leasing Lead) — same hotel and meals; RAHMA hosts and accompanies throughout.",
    ar: "مجموعة الاستضافة: رحمة (مساعدة رئيس مجلس الإدارة) + ريهام (مسؤولة تأجير المراكز التجارية) — نفس الفندق والوجبات؛ ورحمة تستضيف وترافق طوال الفترة.",
  },
  {
    zh: "同酒店不代表同房，房型待定。",
    en: "Same hotel does not mean sharing a room; room types are undecided.",
    ar: "الفندق المشترك لا يعني غرفة مشتركة، ونوع الغرف لم يُحدَّد.",
  },
  {
    zh: "QIUTING 走的是订货会行程，订货会结束后回家过中秋，不继续学习或接待活动。",
    en: "QIUTING is on the Order Fair track; after it she goes home for Mid-Autumn and does not continue with training or hosting.",
    ar: "تشيوتينغ ضمن مسار معرض الطلبيات؛ وبعده تعود إلى بيتها للعيد ولا تتابع أنشطة التدريب أو الاستضافة.",
  },
];

export const PERSON_MAP: Record<PersonId, Person> = PEOPLE.reduce(
  (acc, person) => {
    acc[person.id] = person;
    return acc;
  },
  {} as Record<PersonId, Person>,
);

export const ALL_PEOPLE_IDS: PersonId[] = PEOPLE.map((p) => p.id);

/* ------------------------------------------------------------------ */
/* 机场                                                                */
/* ------------------------------------------------------------------ */

export const AIRPORTS = {
  CAI: {
    iata: "CAI",
    name: { zh: "开罗国际机场", en: "Cairo International", ar: "مطار القاهرة الدولي" },
    city: { zh: "开罗", en: "Cairo", ar: "القاهرة" },
  },
  TFU: {
    iata: "TFU",
    name: {
      zh: "成都天府国际机场",
      en: "Chengdu Tianfu International",
      ar: "مطار تشنغدو تيانفو الدولي",
    },
    city: { zh: "成都", en: "Chengdu", ar: "تشنغدو" },
  },
  CAN: {
    iata: "CAN",
    name: {
      zh: "广州白云国际机场",
      en: "Guangzhou Baiyun International",
      ar: "مطار قوانغتشو بايون الدولي",
    },
    city: { zh: "广州", en: "Guangzhou", ar: "قوانغتشو" },
  },
} satisfies Record<string, Airport>;

const BAG_3U: L10n = {
  zh: "行李额：四川航空该段 1 件（票面未标公斤数）",
  en: "Baggage: 1 piece on this Sichuan Airlines leg (no weight printed on the ticket)",
  ar: "الأمتعة: قطعة واحدة على رحلة سيتشوان (التذكرة لا تذكر الوزن)",
};

const BAG_MS: L10n = {
  zh: "行李额：埃及航空 2 件（票面未标公斤数）",
  en: "Baggage: 2 pieces on EgyptAir (no weight printed on the ticket)",
  ar: "الأمتعة: قطعتان على مصر للطيران (التذكرة لا تذكر الوزن)",
};

const BUSINESS_CABIN: L10n = {
  zh: "商务舱 · 直飞",
  en: "Business class · direct",
  ar: "درجة رجال الأعمال · مباشرة",
};

/* ------------------------------------------------------------------ */
/* 日程                                                                */
/* ------------------------------------------------------------------ */

export const EVENTS: TripEvent[] = [
  /* ===================== 9/20 ===================== */
  {
    id: "0920-cai-arrive",
    date: "2026-09-20",
    time: "10:45",
    tz: "cairo",
    kind: "ground",
    status: "suggested",
    people: ["qiuting", "hassan", "ahmed", "rahma"],
    title: {
      zh: "建议 10:45 前抵达开罗机场 T2",
      en: "Suggested at Cairo Airport T2 by 10:45",
      ar: "يُقترح الوصول إلى مطار القاهرة صالة 2 قبل 10:45",
    },
    summary: {
      zh: "按票面国际航班提前 4 小时的建议。开罗当地时间。",
      en: "Based on the ticket's 4-hour international check-in guidance. Cairo local time.",
      ar: "حسب إرشاد التذكرة بالحضور قبل 4 ساعات للرحلات الدولية. بتوقيت القاهرة.",
    },
  },
  {
    id: "0920-3u3864",
    date: "2026-09-20",
    time: "14:45",
    tz: "cairo",
    kind: "flight",
    status: "confirmed",
    people: ["qiuting", "hassan", "ahmed", "rahma"],
    title: {
      zh: "3U3864 开罗 → 成都天府",
      en: "3U3864 Cairo → Chengdu Tianfu",
      ar: "الرحلة 3U3864 القاهرة ← تشنغدو تيانفو",
    },
    flight: {
      code: "3U3864",
      from: { iata: "CAI", terminal: "T2", date: "2026-09-20", time: "14:45" },
      to: { iata: "TFU", terminal: "T1", date: "2026-09-21", time: "05:10" },
      baggage: BAG_3U,
    },
    details: [
      {
        zh: "次日 05:10 抵达成都（北京时间）。",
        en: "Arrives Chengdu 05:10 the next day (Beijing time).",
        ar: "الوصول إلى تشنغدو 05:10 صباح اليوم التالي (بتوقيت بكين).",
      },
    ],
  },
  {
    id: "0920-reham-depart-for-airport",
    date: "2026-09-20",
    time: "20:20",
    tz: "cairo",
    kind: "ground",
    status: "suggested",
    highlight: true,
    people: ["reham"],
    title: {
      zh: "重要：9/20 当晚 20:20 前抵达开罗机场 T3",
      en: "Important: at Cairo Airport T3 by 20:20 on 20 Sep",
      ar: "مهم: الوصول إلى مطار القاهرة صالة 3 قبل 20:20 مساء 20 سبتمبر",
    },
    summary: {
      zh: "航班 MS958 在 9/21 00:20 起飞，属次日凌晨。按票面提前 4 小时计算，必须在 9/20 晚上出发去机场，不要按 9/21 白天理解。",
      en: "MS958 departs at 00:20 on 21 Sep — after midnight. With the ticket's 4-hour guidance you must leave for the airport on the evening of 20 Sep, not during the day of 21 Sep.",
      ar: "تقلع الرحلة MS958 الساعة 00:20 يوم 21 سبتمبر، أي بعد منتصف الليل. مع إرشاد التذكرة (4 ساعات) يجب التوجه إلى المطار مساء 20 سبتمبر وليس نهار 21 سبتمبر.",
    },
  },

  /* ===================== 9/21 ===================== */
  {
    id: "0921-tfu-arrive",
    date: "2026-09-21",
    time: "05:10",
    tz: "beijing",
    kind: "flight",
    status: "confirmed",
    people: ["qiuting", "hassan", "ahmed", "rahma"],
    title: {
      zh: "3U3864 抵达成都天府 T1",
      en: "3U3864 arrives Chengdu Tianfu T1",
      ar: "وصول الرحلة 3U3864 إلى تشنغدو تيانفو صالة 1",
    },
  },
  {
    id: "0921-tfu-transfer",
    date: "2026-09-21",
    kind: "ground",
    status: "pending",
    highlight: true,
    people: ["qiuting", "hassan", "ahmed", "rahma"],
    title: {
      zh: "成都中转：T1 → T2 需换航站楼",
      en: "Chengdu transfer: change terminal T1 → T2",
      ar: "الترانزيت في تشنغدو: تغيير الصالة من 1 إلى 2",
    },
    summary: {
      zh: "抵达在 T1，下一段在 T2，需要自行转到另一个航站楼。",
      en: "You land at T1 and depart from T2, so a terminal change is required.",
      ar: "الهبوط في الصالة 1 والمغادرة من الصالة 2، لذا يلزم الانتقال بين الصالتين.",
    },
    pending: [
      {
        zh: "行李是否直挂到广州、是否需要入境提取再托运 —— 以开罗值机柜台确认为准，不要事先假定直挂。",
        en: "Whether bags are checked through to Guangzhou, or must be collected after immigration and re-checked — confirm at the Cairo check-in desk; do not assume through-check.",
        ar: "هل الأمتعة مشحونة مباشرة إلى قوانغتشو أم يجب استلامها بعد الجوازات وإعادة تسليمها؟ يُحسم ذلك عند مكتب تسجيل الوصول في القاهرة؛ لا تفترض الشحن المباشر.",
      },
    ],
  },
  {
    id: "0921-3u6701",
    date: "2026-09-21",
    time: "08:00",
    tz: "beijing",
    kind: "flight",
    status: "confirmed",
    people: ["qiuting", "hassan", "ahmed", "rahma"],
    title: {
      zh: "3U6701 成都天府 → 广州白云",
      en: "3U6701 Chengdu Tianfu → Guangzhou Baiyun",
      ar: "الرحلة 3U6701 تشنغدو تيانفو ← قوانغتشو بايون",
    },
    flight: {
      code: "3U6701",
      from: { iata: "TFU", terminal: "T2", date: "2026-09-21", time: "08:00" },
      to: { iata: "CAN", terminal: "T2", date: "2026-09-21", time: "10:25" },
      baggage: BAG_3U,
    },
  },
  {
    id: "0921-pickup-t2",
    date: "2026-09-21",
    time: "10:25",
    tz: "beijing",
    kind: "ground",
    status: "pending",
    people: ["qiuting", "hassan", "ahmed", "rahma"],
    title: {
      zh: "上午 白云机场 T2 接机（4 人）",
      en: "Morning pickup at Baiyun T2 (4 travellers)",
      ar: "الاستقبال صباحًا في مطار بايون صالة 2 (4 مسافرين)",
    },
    summary: {
      zh: "上午 T2 这一批与下午 T3 那一批是两次独立接机，不要合并。",
      en: "The morning T2 pickup and the afternoon T3 pickup are two separate runs; do not merge them.",
      ar: "استقبال الصباح في الصالة 2 واستقبال بعد الظهر في الصالة 3 عمليتان منفصلتان، ولا يمكن دمجهما.",
    },
    pending: [
      {
        zh: "车辆、车牌、司机与现场接机联系人待确认。",
        en: "Vehicle, plate number, driver and on-site contact are not confirmed.",
        ar: "المركبة ورقم اللوحة والسائق وجهة الاتصال في المطار غير مؤكدة.",
      },
    ],
  },
  {
    id: "0921-ms958",
    date: "2026-09-21",
    time: "00:20",
    tz: "cairo",
    kind: "flight",
    status: "confirmed",
    people: ["reham"],
    title: {
      zh: "MS958 开罗 → 广州（直飞）",
      en: "MS958 Cairo → Guangzhou (direct)",
      ar: "الرحلة MS958 القاهرة ← قوانغتشو (مباشرة)",
    },
    flight: {
      code: "MS958",
      cabin: BUSINESS_CABIN,
      from: { iata: "CAI", terminal: "T3", date: "2026-09-21", time: "00:20" },
      to: { iata: "CAN", terminal: "T3", date: "2026-09-21", time: "15:30" },
      baggage: BAG_MS,
    },
    details: [
      {
        zh: "起飞 00:20 为开罗时间，抵达 15:30 为北京时间，同一天内。",
        en: "Departure 00:20 is Cairo time, arrival 15:30 is Beijing time, same calendar day.",
        ar: "المغادرة 00:20 بتوقيت القاهرة والوصول 15:30 بتوقيت بكين في اليوم نفسه.",
      },
    ],
  },
  {
    id: "0921-pickup-t3",
    date: "2026-09-21",
    time: "15:30",
    tz: "beijing",
    kind: "hosting",
    status: "pending",
    people: ["reham", "rahma"],
    title: {
      zh: "下午 白云机场 T3 接机（RAHMA 前往接 REHAM）",
      en: "Afternoon pickup at Baiyun T3 (RAHMA meets REHAM)",
      ar: "الاستقبال بعد الظهر في مطار بايون صالة 3 (رحمة تستقبل ريهام)",
    },
    pending: [
      {
        zh: "具体会合出口/接机口待确认。",
        en: "The exact meeting exit / arrivals gate is not confirmed.",
        ar: "بوابة اللقاء المحددة في صالة الوصول غير مؤكدة.",
      },
    ],
  },
  {
    id: "0921-hotel-checkin",
    date: "2026-09-21",
    kind: "hotel",
    status: "pending",
    people: ["qiuting", "hassan", "ahmed", "rahma", "reham"],
    title: {
      zh: "抵店：行李寄存 / 办理入住",
      en: "At the hotel: luggage storage / check-in",
      ar: "في الفندق: حفظ الأمتعة / تسجيل الدخول",
    },
    summary: {
      zh: "上午到达的 4 人如果房间未准备好，先寄存行李。",
      en: "If rooms are not ready for the four morning arrivals, store luggage first.",
      ar: "إذا لم تكن الغرف جاهزة للواصلين صباحًا، تُحفظ الأمتعة أولًا.",
    },
    pending: [
      {
        zh: "酒店名称、地址、房型与是否含早餐均待确认。",
        en: "Hotel name, address, room types and whether breakfast is included are all unconfirmed.",
        ar: "اسم الفندق وعنوانه وأنواع الغرف وهل الإفطار مشمول — كلها غير مؤكدة.",
      },
    ],
  },
  {
    id: "0921-study-checkin",
    date: "2026-09-21",
    kind: "study",
    status: "confirmed",
    people: ["hassan", "ahmed"],
    title: {
      zh: "学习组报到",
      en: "Training group check-in / registration",
      ar: "تسجيل حضور مجموعة التدريب",
    },
    summary: {
      zh: "落地当天报到，不是全天巡店。",
      en: "Registration on arrival day only — this is not a full day of store visits.",
      ar: "تسجيل الحضور في يوم الوصول فقط، وليس يوم زيارات متاجر كاملًا.",
    },
    pending: [
      {
        zh: "报到地点与具体时间待总部通知。",
        en: "Registration place and exact time await HQ notice.",
        ar: "مكان التسجيل ووقته بانتظار إشعار المقر.",
      },
    ],
  },

  /* ===================== 9/22 ===================== */
  {
    id: "0922-hq-session",
    date: "2026-09-22",
    kind: "meeting",
    status: "confirmed",
    people: ["hassan", "ahmed"],
    title: {
      zh: "总部参会（全天）",
      en: "HQ sessions (full day)",
      ar: "جلسات المقر (يوم كامل)",
    },
    summary: {
      zh: "全天参会已确定。",
      en: "A full day of sessions is confirmed.",
      ar: "حضور الجلسات ليوم كامل مؤكد.",
    },
    pending: [
      {
        zh: "具体议程、场地与开始/结束时间以总部通知为准。",
        en: "Agenda, venue and start/end times follow the HQ notice.",
        ar: "جدول الأعمال والمكان وأوقات البدء والانتهاء حسب إشعار المقر.",
      },
    ],
  },
  {
    id: "0922-orderfair-d1",
    date: "2026-09-22",
    kind: "meeting",
    status: "confirmed",
    people: ["qiuting"],
    title: {
      zh: "总部订货会 · 第 1 天",
      en: "HQ Order Fair · day 1",
      ar: "معرض الطلبيات في المقر · اليوم 1",
    },
    summary: {
      zh: "订货会窗口为 9/22–9/24。",
      en: "The Order Fair window runs 22–24 Sep.",
      ar: "نافذة معرض الطلبيات من 22 إلى 24 سبتمبر.",
    },
    pending: [
      {
        zh: "每日场次时间以总部通知为准。",
        en: "Daily session times follow the HQ notice.",
        ar: "أوقات الجلسات اليومية حسب إشعار المقر.",
      },
    ],
  },
  {
    id: "0922-host-open",
    date: "2026-09-22",
    endDate: "2026-09-26",
    kind: "hosting",
    status: "pending",
    people: ["rahma", "reham"],
    title: {
      zh: "接待组 9/22–9/26：日程未提供",
      en: "Hosting group 22–26 Sep: schedule not provided",
      ar: "مجموعة الاستضافة 22–26 سبتمبر: البرنامج غير متوفر",
    },
    summary: {
      zh: "目前只确定：董事长助理 RAHMA 全程负责陪同与招待。其余商务日程尚未提供。",
      en: "Only one thing is fixed: RAHMA hosts and accompanies throughout. No other business schedule has been provided.",
      ar: "المؤكد فقط أن رحمة ترافق وتستضيف طوال الفترة. لم يُقدَّم أي برنامج عمل آخر.",
    },
    details: [
      {
        zh: "商务拜访 / 商场参观属建议方向，需要提前预约后才能定；市内观光待商议。",
        en: "Business visits and mall tours are suggestions only and need appointments before they can be fixed; city sightseeing is still open for discussion.",
        ar: "الزيارات التجارية وجولات المراكز التجارية مقترحات تحتاج مواعيد مسبقة قبل تثبيتها؛ والجولات داخل المدينة ما زالت قيد النقاش.",
      },
      {
        zh: "不假设招商人员参加总部会议。",
        en: "No assumption is made that the leasing lead attends the HQ sessions.",
        ar: "لا نفترض حضور مسؤولة التأجير جلسات المقر.",
      },
    ],
    pending: [
      {
        zh: "具体拜访对象、城市与商场、时间与陪同人员全部待确认。",
        en: "Who is visited, which city and mall, when, and who accompanies — all unconfirmed.",
        ar: "جهات الزيارة والمدينة والمركز التجاري والتوقيت والمرافقون — جميعها غير مؤكدة.",
      },
    ],
  },

  /* ===================== 9/23 ===================== */
  {
    id: "0923-hq-session",
    date: "2026-09-23",
    kind: "meeting",
    status: "confirmed",
    people: ["hassan", "ahmed"],
    title: {
      zh: "总部参会",
      en: "HQ sessions",
      ar: "جلسات المقر",
    },
    summary: {
      zh: "参会已确定；具体时间以总部通知为准。",
      en: "Attendance is confirmed; timing follows the HQ notice.",
      ar: "الحضور مؤكد، والتوقيت حسب إشعار المقر.",
    },
  },
  {
    id: "0923-store-tour",
    date: "2026-09-23",
    time: "13:50",
    endTime: "17:30",
    tz: "beijing",
    kind: "study",
    status: "pending",
    people: ["hassan", "ahmed"],
    title: {
      zh: "总部第一批 广州「乐系」门店巡店（是否报名待确认）",
      en: "HQ first-batch Guangzhou store tour (registration not confirmed)",
      ar: "جولة المتاجر الأولى التي ينظمها المقر في قوانغتشو (التسجيل غير مؤكد)",
    },
    summary: {
      zh: "13:50–17:30 是总部公布的场次时间。目前只是「待确认是否报名」，不是已参加。",
      en: "13:50–17:30 is the slot announced by HQ. It is only a possible sign-up — attendance has NOT been arranged.",
      ar: "الفترة 13:50–17:30 هي الموعد الذي أعلنه المقر. الأمر مجرد تسجيل محتمل ولم يتم الحضور بعد.",
    },
    pending: [
      {
        zh: "是否报名参加、名额与集合方式待确认。",
        en: "Whether to sign up, seat availability and the meeting point are unconfirmed.",
        ar: "التسجيل وتوفر الأماكن ونقطة التجمع غير مؤكدة.",
      },
    ],
  },
  {
    id: "0923-orderfair-d2",
    date: "2026-09-23",
    kind: "meeting",
    status: "confirmed",
    people: ["qiuting"],
    title: {
      zh: "总部订货会 · 第 2 天",
      en: "HQ Order Fair · day 2",
      ar: "معرض الطلبيات في المقر · اليوم 2",
    },
  },

  /* ===================== 9/24 ===================== */
  {
    id: "0924-study-d1",
    date: "2026-09-24",
    kind: "study",
    status: "confirmed",
    people: ["hassan", "ahmed"],
    title: {
      zh: "门店学习 第 1 天 · 广州黄埔云汇天地店",
      en: "In-store training day 1 · Guangzhou Huangpu Yunhui Tiandi store",
      ar: "التدريب في المتجر اليوم 1 · متجر يون هوي تيان دي، هوانغبو، قوانغتشو",
    },
    summary: {
      zh: "两天门店学习的第一天，门店已定。",
      en: "First of two in-store training days; the store is fixed.",
      ar: "أول يومي التدريب داخل المتجر، والمتجر محدد.",
    },
    details: [
      {
        zh: "带教对接人：区域经理 陈俊杰（可分享的联系方式待老板提供，页面不放电话）。",
        en: "Training contact: Area Manager Chen Junjie (a shareable contact detail is still to be provided by the boss; no phone number is published here).",
        ar: "جهة التواصل للتدريب: مدير المنطقة تشن جون جيه (سيوفر المدير وسيلة تواصل قابلة للمشاركة؛ لا يُنشر رقم هاتف هنا).",
      },
    ],
    pending: [
      {
        zh: "门店准确街道与入口待确认；每日开课/下课时间未知，不设固定 9–18。",
        en: "Exact street and entrance of the store are unconfirmed; daily start/finish times are unknown — no fixed 09:00–18:00 is assumed.",
        ar: "الشارع الدقيق ومدخل المتجر غير مؤكدين؛ أوقات البدء والانتهاء اليومية غير معروفة ولا نفترض دوامًا ثابتًا من 9 إلى 18.",
      },
    ],
  },
  {
    id: "0924-study-flow",
    date: "2026-09-24",
    endDate: "2026-09-25",
    kind: "study",
    status: "suggested",
    people: ["hassan", "ahmed"],
    title: {
      zh: "学习日建议流程（9/24–9/25）",
      en: "Suggested shape of a training day (24–25 Sep)",
      ar: "الشكل المقترح ليوم التدريب (24–25 سبتمبر)",
    },
    summary: {
      zh: "以下是建议流程，总部尚未下发具体课表。",
      en: "This is a suggested flow. HQ has not issued a timetable.",
      ar: "هذا تسلسل مقترح، ولم يصدر المقر جدولًا زمنيًا.",
    },
    details: [
      {
        zh: "早餐 → 酒店大堂集合（时间待定）→ 接送前往门店 → 上午学习 → 门店附近午餐 → 下午学习 → 晚餐。",
        en: "Breakfast → meet in the hotel lobby (time TBD) → transfer to the store → morning training → lunch near the store → afternoon training → dinner.",
        ar: "الإفطار ← التجمع في بهو الفندق (الوقت لاحقًا) ← التنقل إلى المتجر ← تدريب صباحي ← غداء قرب المتجر ← تدريب مسائي ← العشاء.",
      },
      {
        zh: "建议学习方向 · 区域经理（AHMED）：门店运营、陈列、团队管理。",
        en: "Suggested focus · Area Manager (AHMED): store operations, display, team management.",
        ar: "محاور مقترحة · مدير المنطقة (أحمد): تشغيل المتجر، العرض، إدارة الفريق.",
      },
      {
        zh: "建议学习方向 · 防损（HASSAN）：盘点、损耗控制、交接流程。",
        en: "Suggested focus · Loss Prevention (HASSAN): stocktaking, shrinkage control, handover process.",
        ar: "محاور مقترحة · منع الخسائر (حسن): الجرد، ضبط الفاقد، إجراءات التسليم.",
      },
    ],
  },
  {
    id: "0924-orderfair-d3",
    date: "2026-09-24",
    kind: "meeting",
    status: "pending",
    people: ["qiuting"],
    title: {
      zh: "总部订货会 · 第 3 天（总部通知：仅上午）",
      en: "HQ Order Fair · day 3 (HQ notice: morning only)",
      ar: "معرض الطلبيات · اليوم 3 (إشعار المقر: صباحًا فقط)",
    },
    summary: {
      zh: "总部通知 9/24 仅安排上午。是否参加第三天由本人确认，这里不替她推定。",
      en: "The HQ notice schedules 24 Sep as a morning-only day. Whether she attends day 3 is for her to confirm — it is not assumed here.",
      ar: "إشعار المقر يحدد 24 سبتمبر كصباح فقط. حضورها اليوم الثالث يعود لتأكيدها ولا يُفترض هنا.",
    },
    pending: [
      {
        zh: "本人是否参加 9/24 上午场待确认。",
        en: "Her attendance on the morning of 24 Sep is unconfirmed.",
        ar: "حضورها صباح 24 سبتمبر غير مؤكد.",
      },
    ],
  },

  /* ===================== 9/25 ===================== */
  {
    id: "0925-study-d2",
    date: "2026-09-25",
    kind: "study",
    status: "confirmed",
    people: ["hassan", "ahmed"],
    title: {
      zh: "门店学习 第 2 天 · 广州黄埔云汇天地店",
      en: "In-store training day 2 · Guangzhou Huangpu Yunhui Tiandi store",
      ar: "التدريب في المتجر اليوم 2 · متجر يون هوي تيان دي، هوانغبو، قوانغتشو",
    },
  },
  {
    id: "0925-holiday-note",
    date: "2026-09-25",
    endDate: "2026-09-27",
    kind: "note",
    status: "confirmed",
    highlight: true,
    people: ["qiuting", "hassan", "ahmed", "rahma", "reham"],
    title: {
      zh: "中秋假期 9/25–9/27（官方放假安排）",
      en: "Mid-Autumn public holiday 25–27 Sep (official)",
      ar: "عطلة منتصف الخريف الرسمية 25–27 سبتمبر",
    },
    summary: {
      zh: "行程日期不变，但假期会影响门店排班、餐厅与用车，请提前协调。",
      en: "Trip dates do not change, but the holiday affects store staffing, restaurants and cars — coordinate early.",
      ar: "مواعيد الرحلة لا تتغير، لكن العطلة تؤثر على مناوبات المتاجر والمطاعم والسيارات، لذا يلزم التنسيق مبكرًا.",
    },
    details: [
      {
        zh: "9/25 门店学习日：需要确认带教与门店值班安排。",
        en: "25 Sep training day: confirm that the trainer and store shift cover are in place.",
        ar: "يوم التدريب 25 سبتمبر: تأكيد وجود المدرب ومناوبة المتجر.",
      },
      {
        zh: "9/26 自由活动日：景点与餐厅人流会明显增加。",
        en: "26 Sep free day: expect noticeably heavier crowds at sights and restaurants.",
        ar: "يوم 26 سبتمبر الحر: توقّع ازدحامًا أكبر في المعالم والمطاعم.",
      },
      {
        zh: "9/27 送机日：车辆需提前预订，路上时间留宽。",
        en: "27 Sep departure day: book cars in advance and allow extra travel time.",
        ar: "يوم المغادرة 27 سبتمبر: احجز السيارات مسبقًا واترك وقتًا إضافيًا للطريق.",
      },
    ],
  },
  {
    id: "0925-qiuting-home",
    date: "2026-09-25",
    endDate: "2026-10-05",
    kind: "note",
    status: "pending",
    people: ["qiuting"],
    title: {
      zh: "返乡过节阶段（离穗日期待确认）",
      en: "Home for the holiday (departure date from Guangzhou unconfirmed)",
      ar: "العودة إلى الوطن في العطلة (تاريخ مغادرة قوانغتشو غير مؤكد)",
    },
    summary: {
      zh: "订货会结束后回家过中秋，不再参加学习组与接待组活动。这一段只表示「阶段」，不表示已经到家。",
      en: "After the Order Fair she goes home for Mid-Autumn and no longer joins training or hosting activities. This block marks a phase — it does not mean she has already arrived home.",
      ar: "بعد معرض الطلبيات تعود إلى بيتها لقضاء العيد ولا تشارك في أنشطة التدريب أو الاستضافة. هذه المرحلة لا تعني أنها وصلت بالفعل.",
    },
    pending: [
      {
        zh: "返乡城市、离开广州的日期、返回广州的交通方式全部待确认；页面不代订国内机票或酒店。",
        en: "Home city, the date she leaves Guangzhou, and how she returns to Guangzhou are all unconfirmed; no domestic ticket or hotel is booked here.",
        ar: "مدينتها وتاريخ مغادرتها قوانغتشو ووسيلة عودتها — كلها غير مؤكدة؛ ولم تُحجز أي تذكرة داخلية أو فندق هنا.",
      },
    ],
  },

  /* ===================== 9/26 ===================== */
  {
    id: "0926-free",
    date: "2026-09-26",
    kind: "free",
    status: "confirmed",
    people: ["hassan", "ahmed"],
    title: {
      zh: "学习组自由活动日",
      en: "Training group free day",
      ar: "يوم حر لمجموعة التدريب",
    },
    summary: {
      zh: "没有学习安排。可自行选择广州城市体验，下面的选项都是建议，均未预订。",
      en: "No training scheduled. City experiences below are suggestions only — nothing is booked.",
      ar: "لا يوجد تدريب. الخيارات أدناه مقترحات فقط ولم يُحجز أي منها.",
    },
    details: [
      {
        zh: "建议在下列 2 个选项里挑 1–2 个，留出午餐和休息时间。",
        en: "Suggested: pick one or two of the two options below and leave room for lunch and rest.",
        ar: "المقترح: اختر خيارًا أو خيارين مما يلي مع ترك وقت للغداء والراحة.",
      },
    ],
    pending: [
      {
        zh: "集合时间与返回时间待确认；自由活动不自动绑定接待组陪同。",
        en: "Meeting time and return time are unconfirmed; the free day does not automatically include hosting-group company.",
        ar: "وقت التجمع ووقت العودة غير مؤكدين؛ واليوم الحر لا يشمل تلقائيًا مرافقة مجموعة الاستضافة.",
      },
    ],
  },

  /* ===================== 9/27 ===================== */
  {
    id: "0927-checkout",
    date: "2026-09-27",
    kind: "hotel",
    status: "pending",
    people: ["hassan", "ahmed", "rahma", "reham"],
    title: {
      zh: "退房（9/21 入住，共 6 晚）",
      en: "Check-out (checked in 21 Sep, 6 nights)",
      ar: "تسجيل المغادرة (الدخول 21 سبتمبر، 6 ليالٍ)",
    },
    pending: [
      {
        zh: "延迟退房或日间房待确认 —— REHAM 当天 23:20 才起飞，白天需要落脚点。",
        en: "Late check-out or a day-use room is unconfirmed — REHAM does not fly until 23:20 and needs somewhere to wait.",
        ar: "التمديد أو غرفة نهارية غير مؤكدين — ريهام لا تسافر قبل 23:20 وتحتاج مكانًا للانتظار.",
      },
      {
        zh: "离店前往机场的出发时间待路线确认。",
        en: "Departure time from the hotel to the airport awaits route confirmation.",
        ar: "وقت المغادرة من الفندق إلى المطار بانتظار تأكيد الطريق.",
      },
    ],
  },
  {
    id: "0927-can-arrive-t2",
    date: "2026-09-27",
    time: "15:25",
    tz: "beijing",
    kind: "ground",
    status: "suggested",
    people: ["hassan", "ahmed", "rahma"],
    title: {
      zh: "建议 15:25 前抵达白云机场 T2",
      en: "Suggested at Baiyun T2 by 15:25",
      ar: "يُقترح الوصول إلى مطار بايون صالة 2 قبل 15:25",
    },
    summary: {
      zh: "按票面国内航班提前 2 小时的建议。国际联程的手续要求以航司为准。",
      en: "Based on the ticket's 2-hour domestic guidance. Requirements for the onward international connection follow the airline.",
      ar: "حسب إرشاد التذكرة (ساعتان للرحلات الداخلية). أما إجراءات الرحلة الدولية التالية فحسب شركة الطيران.",
    },
  },
  {
    id: "0927-3u6704",
    date: "2026-09-27",
    time: "17:25",
    tz: "beijing",
    kind: "flight",
    status: "confirmed",
    people: ["hassan", "ahmed", "rahma"],
    title: {
      zh: "3U6704 广州白云 → 成都天府",
      en: "3U6704 Guangzhou Baiyun → Chengdu Tianfu",
      ar: "الرحلة 3U6704 قوانغتشو بايون ← تشنغدو تيانفو",
    },
    flight: {
      code: "3U6704",
      from: { iata: "CAN", terminal: "T2", date: "2026-09-27", time: "17:25" },
      to: { iata: "TFU", terminal: "T2", date: "2026-09-27", time: "19:25" },
      baggage: BAG_3U,
    },
  },
  {
    id: "0927-handover-gap",
    date: "2026-09-27",
    kind: "hosting",
    status: "pending",
    highlight: true,
    people: ["reham", "rahma"],
    title: {
      zh: "晚间送机接待人待确认",
      en: "Evening airport host to be confirmed",
      ar: "مرافق التوصيل المسائي بانتظار التأكيد",
    },
    summary: {
      zh: "RAHMA 计划 17:25 起飞离开广州，无法陪同 REHAM 的 23:20 夜班机。当天下午到夜间由谁陪同接待，需要确认。",
      en: "RAHMA is scheduled to fly out of Guangzhou at 17:25 and cannot accompany REHAM's 23:20 night flight. Who hosts and accompanies from that afternoon through to the night flight still needs to be confirmed.",
      ar: "من المقرر أن تغادر رحمة قوانغتشو الساعة 17:25 ولا يمكنها مرافقة ريهام في رحلة 23:20 الليلية. ومن سيرافق ويستضيف من بعد ظهر ذلك اليوم حتى رحلة الليل بحاجة إلى تأكيد.",
    },
    pending: [
      {
        zh: "接手的当地接待人待确认；下午到夜间的陪同接待、用餐、行李与出发去机场的时间待确认。",
        en: "The local host taking over is unconfirmed; hosting and accompaniment from afternoon to night, meals, luggage and the departure time for the airport are all unconfirmed.",
        ar: "المضيف المحلي الذي سيتسلّم المهمة غير مؤكد؛ والمرافقة والاستضافة من بعد الظهر حتى الليل والوجبات والأمتعة ووقت التوجه إلى المطار غير مؤكدة.",
      },
    ],
  },
  {
    id: "0927-can-arrive-t3",
    date: "2026-09-27",
    time: "19:20",
    tz: "beijing",
    kind: "ground",
    status: "suggested",
    people: ["reham"],
    title: {
      zh: "建议 19:20 前抵达白云机场 T3",
      en: "Suggested at Baiyun T3 by 19:20",
      ar: "يُقترح الوصول إلى مطار بايون صالة 3 قبل 19:20",
    },
    summary: {
      zh: "按票面国际航班提前 4 小时的建议。这一趟与当天先行的 T2 送机分开，不是同一个航站楼。",
      en: "Based on the ticket's 4-hour international guidance. This run is separate from the earlier T2 departure the same day, and not the same terminal.",
      ar: "حسب إرشاد التذكرة (4 ساعات للرحلات الدولية). هذه الرحلة منفصلة عن مغادرة الصالة 2 الأسبق في اليوم نفسه، وليست في الصالة نفسها.",
    },
  },
  {
    id: "0927-ms959",
    date: "2026-09-27",
    time: "23:20",
    tz: "beijing",
    kind: "flight",
    status: "confirmed",
    people: ["reham"],
    title: {
      zh: "MS959 广州 → 开罗（直飞）",
      en: "MS959 Guangzhou → Cairo (direct)",
      ar: "الرحلة MS959 قوانغتشو ← القاهرة (مباشرة)",
    },
    flight: {
      code: "MS959",
      cabin: BUSINESS_CABIN,
      from: { iata: "CAN", terminal: "T3", date: "2026-09-27", time: "23:20" },
      to: { iata: "CAI", terminal: "T3", date: "2026-09-28", time: "04:50" },
      baggage: BAG_MS,
    },
  },

  /* ===================== 9/28 ===================== */
  {
    id: "0928-ms959-arrive",
    date: "2026-09-28",
    time: "04:50",
    tz: "cairo",
    kind: "flight",
    status: "confirmed",
    people: ["reham"],
    title: {
      zh: "MS959 抵达开罗 T3 · 04:50",
      en: "MS959 arrives Cairo T3 · 04:50",
      ar: "وصول الرحلة MS959 إلى القاهرة صالة 3 · 04:50",
    },
  },
  {
    id: "0928-3u3863",
    date: "2026-09-28",
    time: "01:25",
    tz: "beijing",
    kind: "flight",
    status: "confirmed",
    people: ["hassan", "ahmed", "rahma"],
    title: {
      zh: "3U3863 成都天府 → 开罗",
      en: "3U3863 Chengdu Tianfu → Cairo",
      ar: "الرحلة 3U3863 تشنغدو تيانفو ← القاهرة",
    },
    flight: {
      code: "3U3863",
      from: { iata: "TFU", terminal: "T1", date: "2026-09-28", time: "01:25" },
      to: { iata: "CAI", terminal: "T2", date: "2026-09-28", time: "06:50" },
      baggage: BAG_3U,
    },
    details: [
      {
        zh: "成都中转：19:25 落在 T2，01:25 从 T1 起飞，需换航站楼并在夜间等待约 6 小时。",
        en: "Chengdu transfer: land at T2 at 19:25, depart from T1 at 01:25 — a terminal change plus about a 6-hour overnight wait.",
        ar: "الترانزيت في تشنغدو: الهبوط في الصالة 2 عند 19:25 والإقلاع من الصالة 1 عند 01:25 — تغيير صالة وانتظار ليلي نحو 6 ساعات.",
      },
    ],
  },
  {
    id: "0928-two-arrivals",
    date: "2026-09-28",
    kind: "note",
    status: "confirmed",
    highlight: true,
    people: ["hassan", "ahmed", "rahma", "reham"],
    title: {
      zh: "开罗接机是两批，不能合并",
      en: "Two separate arrivals in Cairo — cannot be merged",
      ar: "وصولان منفصلان في القاهرة — لا يمكن دمجهما",
    },
    details: [
      {
        zh: "REHAM：04:50 抵达 T3。",
        en: "REHAM: 04:50 at T3.",
        ar: "ريهام: 04:50 في الصالة 3.",
      },
      {
        zh: "HASSAN / AHMED / RAHMA：06:50 抵达 T2。",
        en: "HASSAN / AHMED / RAHMA: 06:50 at T2.",
        ar: "حسن / أحمد / رحمة: 06:50 في الصالة 2.",
      },
      {
        zh: "两个时间、两个航站楼，需要分别安排接机。",
        en: "Two times, two terminals — arrange two separate pickups.",
        ar: "وقتان وصالتان — رتّب عمليتي استقبال منفصلتين.",
      },
    ],
  },

  /* ===================== 10/6 – 10/7 ===================== */
  {
    id: "1006-3u6704",
    date: "2026-10-06",
    time: "17:25",
    tz: "beijing",
    kind: "flight",
    status: "confirmed",
    people: ["qiuting"],
    title: {
      zh: "3U6704 广州白云 → 成都天府",
      en: "3U6704 Guangzhou Baiyun → Chengdu Tianfu",
      ar: "الرحلة 3U6704 قوانغتشو بايون ← تشنغدو تيانفو",
    },
    flight: {
      code: "3U6704",
      from: { iata: "CAN", terminal: "T2", date: "2026-10-06", time: "17:25" },
      to: { iata: "TFU", terminal: "T2", date: "2026-10-06", time: "19:25" },
      baggage: BAG_3U,
    },
    pending: [
      {
        zh: "返回广州的交通方式与到达时间待确认，因此去机场的出发时间也未定。",
        en: "How and when she returns to Guangzhou is unconfirmed, so the departure time for the airport is also open.",
        ar: "كيفية ووقت عودتها إلى قوانغتشو غير مؤكدين، لذا وقت التوجه إلى المطار غير محدد.",
      },
    ],
  },
  {
    id: "1007-3u3863",
    date: "2026-10-07",
    time: "01:25",
    tz: "beijing",
    kind: "flight",
    status: "confirmed",
    people: ["qiuting"],
    title: {
      zh: "3U3863 成都天府 → 开罗",
      en: "3U3863 Chengdu Tianfu → Cairo",
      ar: "الرحلة 3U3863 تشنغدو تيانفو ← القاهرة",
    },
    flight: {
      code: "3U3863",
      from: { iata: "TFU", terminal: "T1", date: "2026-10-07", time: "01:25" },
      to: { iata: "CAI", terminal: "T2", date: "2026-10-07", time: "06:50" },
      baggage: BAG_3U,
    },
    details: [
      {
        zh: "成都中转：19:25 落在 T2，01:25 从 T1 起飞，需换航站楼。",
        en: "Chengdu transfer: land at T2 at 19:25, depart from T1 at 01:25 — terminal change required.",
        ar: "الترانزيت في تشنغدو: الهبوط في الصالة 2 عند 19:25 والإقلاع من الصالة 1 عند 01:25 — يلزم تغيير الصالة.",
      },
    ],
  },];

/* ------------------------------------------------------------------ */
/* 9/26 城市体验建议（只列已核实来源的选项）                            */
/* ------------------------------------------------------------------ */

export type CityOption = {
  id: string;
  title: L10n;
  body: L10n;
  sourceKey: "gzVisitorGuide";
};

export const CITY_OPTIONS: CityOption[] = [
  {
    id: "shamian",
    title: { zh: "沙面", en: "Shamian Island", ar: "جزيرة شاميان" },
    body: {
      zh: "轻松的半日散步，欧式老建筑和江边步道，适合慢慢走。开放时间与费用未核实，因此不写。",
      en: "A relaxed half-day walk among old European-style buildings and riverside lanes. Opening hours and fees are not verified, so none are listed.",
      ar: "نزهة هادئة نصف يوم بين مبانٍ أوروبية قديمة وممرات على النهر. أوقات الزيارة والرسوم غير مُتحقَّق منها، لذا لم تُذكر.",
    },
    sourceKey: "gzVisitorGuide",
  },
  {
    id: "beijinglu",
    title: {
      zh: "北京路步行街",
      en: "Beijing Road Pedestrian Street",
      ar: "شارع بكين للمشاة",
    },
    body: {
      zh: "购物与城市体验，商铺集中、步行方便。开放时间与费用未核实，因此不写。",
      en: "Shopping and city atmosphere, dense shops, easy on foot. Opening hours and fees are not verified, so none are listed.",
      ar: "تسوق وأجواء مدينية بمحلات متقاربة وسهلة المشي. أوقات الزيارة والرسوم غير مُتحقَّق منها، لذا لم تُذكر.",
    },
    sourceKey: "gzVisitorGuide",
  },
];

export const CITY_EVENING_NOTE: L10n = {
  zh: "傍晚可到花城广场 / 珠江新城一带走走看夜景。这里不默认预订塔票或珠江游船 —— 想去需要另行确认票价与时间。",
  en: "In the evening you can walk around Huacheng Square / Zhujiang New Town for the night view. No tower ticket or river cruise is assumed or booked — price and times would need separate confirmation.",
  ar: "مساءً يمكن التجول في ساحة هواتشنغ / حي تشوجيانغ الجديد لمشاهدة المنظر الليلي. لم تُحجز تذاكر البرج أو الرحلة النهرية، ويلزم تأكيد السعر والمواعيد لاحقًا.",
};

/* ------------------------------------------------------------------ */
/* 吃住行                                                              */
/* ------------------------------------------------------------------ */

/**
 * 吃住行事实的正本。页面上没有独立的「吃住行」tab —— 这些事实由
 * `lib/day-plan.ts` 按日期和人员挑出来，拼进当天行程里。
 * 逐条引用这里的 `lines`，不要在别处另抄一份，否则两边会漂。
 */
export type LogisticsBlockId =
  | "stay-study"
  | "stay-host"
  | "stay-qiuting"
  | "stay-rule"
  | "dining-needs"
  | "dining-meeting"
  | "dining-suggested"
  | "transport-arrival"
  | "transport-daily"
  | "transport-departure"
  | "transport-transfer"
  | "transport-baggage";

export type InfoBlock = {
  id: LogisticsBlockId;
  title: L10n;
  status: Status;
  people?: PersonId[];
  lines: L10n[];
};

export type InfoSection = {
  id: string;
  title: L10n;
  blocks: InfoBlock[];
};

export const LOGISTICS: InfoSection[] = [
  {
    id: "stay",
    title: { zh: "住宿", en: "Accommodation", ar: "الإقامة" },
    blocks: [
      {
        id: "stay-study",
        title: {
          zh: "学习组 · 9/21 入住 – 9/27 退房 · 6 晚",
          en: "Training group · in 21 Sep – out 27 Sep · 6 nights",
          ar: "مجموعة التدريب · الدخول 21 سبتمبر – الخروج 27 سبتمبر · 6 ليالٍ",
        },
        status: "pending",
        people: ["hassan", "ahmed"],
        lines: [
          {
            zh: "同组住同一家酒店。同酒店不代表同房，房型待定。",
            en: "The group stays in the same hotel. Same hotel does not mean sharing a room; room types are undecided.",
            ar: "تقيم المجموعة في الفندق نفسه. الفندق المشترك لا يعني غرفة مشتركة، ونوع الغرف لم يُحدَّد.",
          },
          {
            zh: "酒店名称、地址与预算待确认。",
            en: "Hotel name, address and budget are unconfirmed.",
            ar: "اسم الفندق وعنوانه والميزانية غير مؤكدة.",
          },
        ],
      },
      {
        id: "stay-host",
        title: {
          zh: "接待组 · 9/21 入住 – 9/27 退房 · 6 晚",
          en: "Hosting group · in 21 Sep – out 27 Sep · 6 nights",
          ar: "مجموعة الاستضافة · الدخول 21 سبتمبر – الخروج 27 سبتمبر · 6 ليالٍ",
        },
        status: "pending",
        people: ["rahma", "reham"],
        lines: [
          {
            zh: "同组住同一家酒店，房型待定。",
            en: "The group stays in the same hotel; room types are undecided.",
            ar: "تقيم المجموعة في الفندق نفسه، ونوع الغرف لم يُحدَّد.",
          },
          {
            zh: "9/27 REHAM 夜班机，延迟退房或日间房待确认。",
            en: "REHAM flies late on 27 Sep — late check-out or a day-use room is unconfirmed.",
            ar: "ريهام تسافر ليلًا في 27 سبتمبر — التمديد أو غرفة نهارية غير مؤكدين.",
          },
        ],
      },
      {
        id: "stay-qiuting",
        title: {
          zh: "QIUTING · 9/21 入住，住至离穗",
          en: "QIUTING · in 21 Sep, until she leaves Guangzhou",
          ar: "تشيوتينغ · الدخول 21 سبتمبر حتى مغادرتها قوانغتشو",
        },
        status: "pending",
        people: ["qiuting"],
        lines: [
          {
            zh: "离穗日期尚未确定，因此住几晚也未定。",
            en: "Her departure date from Guangzhou is undecided, so the number of nights is open too.",
            ar: "تاريخ مغادرتها قوانغتشو غير محدد، لذا عدد الليالي غير محدد أيضًا.",
          },
        ],
      },
      {
        id: "stay-rule",
        title: {
          zh: "选址原则（尚未选定任何酒店）",
          en: "How the hotel should be picked (none selected yet)",
          ar: "معايير اختيار الفندق (لم يُختر أي فندق بعد)",
        },
        status: "suggested",
        lines: [
          {
            zh: "先看会场位置，再核对到学习门店（黄埔云汇天地）的通勤时间。",
            en: "Start from the venue location, then check the commute to the training store (Huangpu Yunhui Tiandi).",
            ar: "ابدأ من موقع مكان الفعالية ثم تحقق من زمن التنقل إلى متجر التدريب (هوانغبو يون هوي تيان دي).",
          },
          {
            zh: "会场与门店的准确地址都还没有，所以这里不推荐任何具体酒店。",
            en: "Neither the venue nor the store address is available yet, so no specific hotel is recommended here.",
            ar: "لا يتوفر عنوان المكان ولا المتجر بعد، لذا لا يُوصى بأي فندق محدد هنا.",
          },
          {
            zh: "是否含早餐待确认。",
            en: "Whether breakfast is included is unconfirmed.",
            ar: "شمول الإفطار غير مؤكد.",
          },
        ],
      },
    ],
  },
  {
    id: "dining",
    title: { zh: "餐饮", en: "Dining", ar: "الوجبات" },
    blocks: [
      {
        id: "dining-needs",
        title: {
          zh: "饮食需求：还没收集",
          en: "Dietary needs: not collected yet",
          ar: "المتطلبات الغذائية: لم تُجمع بعد",
        },
        status: "pending",
        lines: [
          {
            zh: "清真、过敏、忌口等需求尚未收集，请本人提前告知接待人。",
            en: "Halal, allergy and other restrictions have not been collected — please tell the host in advance.",
            ar: "متطلبات الحلال والحساسية وغيرها لم تُجمع — يرجى إبلاغ المضيف مسبقًا.",
          },
          {
            zh: "不按国籍替任何人预设饮食安排。",
            en: "No dietary assumption is made for anyone based on nationality.",
            ar: "لا تُفترض أي متطلبات غذائية لأي شخص بناءً على الجنسية.",
          },
        ],
      },
      {
        id: "dining-meeting",
        title: {
          zh: "会务餐",
          en: "Meals during HQ sessions",
          ar: "وجبات أيام الجلسات",
        },
        status: "pending",
        lines: [
          {
            zh: "总部会议期间是否供餐、供哪几餐，待确认。",
            en: "Whether meals are provided during the HQ sessions, and which ones, is unconfirmed.",
            ar: "لم يتأكد إن كانت الوجبات مُقدَّمة خلال جلسات المقر ولا أي منها.",
          },
        ],
      },
      {
        id: "dining-suggested",
        title: {
          zh: "学习日建议",
          en: "Suggested for training days",
          ar: "مقترح لأيام التدريب",
        },
        status: "suggested",
        lines: [
          {
            zh: "酒店早餐 → 门店附近午餐 → 晚餐。餐厅全部待定，尚未预订任何一家。",
            en: "Hotel breakfast → lunch near the store → dinner. Restaurants are all undecided; nothing has been booked.",
            ar: "إفطار الفندق ← غداء قرب المتجر ← عشاء. المطاعم غير محددة ولم يُحجز أي منها.",
          },
          {
            zh: "9/25–27 假期期间建议提前订位（这是建议，不是已订）。",
            en: "Over the 25–27 Sep holiday, booking a table ahead is advisable (a suggestion, not a booking).",
            ar: "خلال عطلة 25–27 سبتمبر يُستحسن الحجز مسبقًا (اقتراح وليس حجزًا).",
          },
        ],
      },
    ],
  },
  {
    id: "transport",
    title: { zh: "交通", en: "Getting around", ar: "التنقل" },
    blocks: [
      {
        id: "transport-arrival",
        title: {
          zh: "9/21 抵达日：两次接机",
          en: "21 Sep arrival day: two pickups",
          ar: "يوم الوصول 21 سبتمبر: عمليتا استقبال",
        },
        status: "pending",
        lines: [
          {
            zh: "上午 10:25 白云 T2 —— QIUTING / HASSAN / AHMED / RAHMA，车辆与联系人待确认。",
            en: "10:25 at Baiyun T2 — QIUTING / HASSAN / AHMED / RAHMA; vehicle and contact unconfirmed.",
            ar: "10:25 في بايون صالة 2 — تشيوتينغ / حسن / أحمد / رحمة؛ المركبة وجهة الاتصال غير مؤكدة.",
          },
          {
            zh: "下午 15:30 白云 T3 —— REHAM，由 RAHMA 前往接机，会合口待确认。",
            en: "15:30 at Baiyun T3 — REHAM, met by RAHMA; meeting gate unconfirmed.",
            ar: "15:30 في بايون صالة 3 — ريهام، تستقبلها رحمة؛ بوابة اللقاء غير مؤكدة.",
          },
        ],
      },
      {
        id: "transport-daily",
        title: {
          zh: "每日接送",
          en: "Daily transfers",
          ar: "التنقلات اليومية",
        },
        status: "pending",
        lines: [
          {
            zh: "酒店大堂集合时间待定；用车方式与司机待确认。",
            en: "Lobby meeting time is undecided; vehicle arrangement and driver are unconfirmed.",
            ar: "وقت التجمع في البهو غير محدد؛ ترتيب المركبة والسائق غير مؤكد.",
          },
        ],
      },
      {
        id: "transport-departure",
        title: {
          zh: "9/27 送机",
          en: "27 Sep departures",
          ar: "مغادرات 27 سبتمبر",
        },
        status: "pending",
        lines: [
          {
            zh: "酒店出发时间待路线确认。",
            en: "Hotel departure time awaits route confirmation.",
            ar: "وقت المغادرة من الفندق بانتظار تأكيد الطريق.",
          },
          {
            zh: "RAHMA 计划 17:25 起飞，晚间 T3 送机由谁陪同接待待确认。",
            en: "RAHMA is scheduled to fly at 17:25, so who hosts and accompanies the evening T3 run is unconfirmed.",
            ar: "من المقرر أن تغادر رحمة الساعة 17:25، لذا من سيرافق ويستضيف في توصيل المساء إلى الصالة 3 غير مؤكد.",
          },
        ],
      },
      {
        id: "transport-transfer",
        title: {
          zh: "成都中转",
          en: "Chengdu transfers",
          ar: "الترانزيت في تشنغدو",
        },
        status: "pending",
        lines: [
          {
            zh: "去程 T1 → T2，回程 T2 → T1，都需要自行换航站楼。",
            en: "Outbound T1 → T2, return T2 → T1 — both need a terminal change on your own.",
            ar: "ذهابًا من الصالة 1 إلى 2 وعودةً من 2 إلى 1 — كلاهما يتطلب الانتقال بنفسك.",
          },
          {
            zh: "行李是否直挂、是否需入境提取再托运，以值机柜台确认为准。",
            en: "Whether bags are through-checked, or must be collected and re-checked, is decided at the check-in desk.",
            ar: "شحن الأمتعة المباشر أو استلامها وإعادة تسليمها يُحسم عند مكتب تسجيل الوصول.",
          },
        ],
      },
      {
        id: "transport-baggage",
        title: {
          zh: "行李额（按票面）",
          en: "Baggage allowance (as printed)",
          ar: "حد الأمتعة (كما في التذكرة)",
        },
        status: "confirmed",
        lines: [
          {
            zh: "四川航空各段：1 件。埃及航空：2 件。票面未标公斤数，这里不猜。",
            en: "Sichuan Airlines legs: 1 piece each. EgyptAir: 2 pieces. No weight is printed on the ticket, and none is guessed here.",
            ar: "رحلات سيتشوان: قطعة واحدة لكل رحلة. مصر للطيران: قطعتان. التذكرة لا تذكر الوزن ولا نخمّنه هنا.",
          },
        ],
      },
    ],
  },
];

const LOGISTICS_BY_ID = Object.fromEntries(
  LOGISTICS.flatMap((section) =>
    section.blocks.map((block) => [block.id, block] as const),
  ),
) as Record<LogisticsBlockId, InfoBlock>;

/** 按 id 取吃住行事实原句。id 是联合类型，写错编译期就会报。 */
export function logisticsLines(blockId: LogisticsBlockId): L10n[] {
  return LOGISTICS_BY_ID[blockId].lines;
}

/* ------------------------------------------------------------------ */
/* 待确认总表                                                          */
/* ------------------------------------------------------------------ */

export const OPEN_ITEMS: L10n[] = [
  {
    zh: "酒店：名称、地址、房型、预算、是否含早餐、9/27 是否延迟退房。",
    en: "Hotel: name, address, room types, budget, breakfast, and late check-out on 27 Sep.",
    ar: "الفندق: الاسم والعنوان وأنواع الغرف والميزانية والإفطار والتمديد يوم 27 سبتمبر.",
  },
  {
    zh: "用车：接机车辆与车牌、司机、每日接送、9/27 出发时间。",
    en: "Cars: airport vehicles and plates, drivers, daily transfers, and the 27 Sep departure time.",
    ar: "السيارات: مركبات المطار ولوحاتها والسائقون والتنقلات اليومية ووقت المغادرة يوم 27 سبتمبر.",
  },
  {
    zh: "联系人：机场接机联系人、9/27 晚间送机的陪同接待人、带教陈俊杰可分享的联系方式。",
    en: "Contacts: airport meeters, whoever hosts and accompanies the 27 Sep evening airport run, and a shareable contact for trainer Chen Junjie.",
    ar: "جهات الاتصال: مستقبِلو المطار، والمضيف المحلي لمساء 27 سبتمبر، ووسيلة تواصل قابلة للمشاركة مع المدرب تشن جون جيه.",
  },
  {
    zh: "门店：黄埔云汇天地店准确街道与入口、每日开课与下课时间。",
    en: "Store: exact street and entrance of the Huangpu Yunhui Tiandi store, plus daily start and finish times.",
    ar: "المتجر: الشارع والمدخل الدقيقان لمتجر هوانغبو يون هوي تيان دي وأوقات البدء والانتهاء اليومية.",
  },
  {
    zh: "接待组：9/22–26 商务日程、拜访对象、是否需要预约。",
    en: "Hosting group: the 22–26 Sep business schedule, who is visited, and which appointments are needed.",
    ar: "مجموعة الاستضافة: برنامج 22–26 سبتمبر وجهات الزيارة والمواعيد المطلوبة.",
  },
  {
    zh: "QIUTING：是否参加 9/24 上午场、离穗日期、返乡城市、返穗交通。",
    en: "QIUTING: whether she joins the 24 Sep morning session, her departure date, home city, and return travel to Guangzhou.",
    ar: "تشيوتينغ: حضورها جلسة صباح 24 سبتمبر، وتاريخ مغادرتها، ومدينتها، ووسيلة عودتها إلى قوانغتشو.",
  },
  {
    zh: "9/23 巡店：是否报名参加总部第一批门店巡店。",
    en: "23 Sep tour: whether to sign up for the HQ first-batch store tour.",
    ar: "جولة 23 سبتمبر: هل سيتم التسجيل في جولة المتاجر الأولى للمقر.",
  },
  {
    zh: "饮食：清真 / 过敏 / 忌口需求；会务餐是否供给。",
    en: "Meals: halal / allergy / other restrictions; whether meals are provided at the sessions.",
    ar: "الوجبات: الحلال والحساسية وغيرها؛ وهل تُقدَّم وجبات في الجلسات.",
  },
  {
    zh: "行李：中转是否直挂（以值机柜台为准）。",
    en: "Baggage: whether bags are through-checked (decided at the check-in desk).",
    ar: "الأمتعة: هل تُشحن مباشرة (يُحسم عند مكتب تسجيل الوصول).",
  },
];

/* ------------------------------------------------------------------ */
/* 来华指南                                                            */
/* ------------------------------------------------------------------ */

export type GuideItem = {
  id: string;
  title: L10n;
  lines: L10n[];
};

export const GUIDE: GuideItem[] = [
  {
    id: "connectivity",
    title: { zh: "手机与网络", en: "Phone & data", ar: "الهاتف والإنترنت" },
    lines: [
      {
        zh: "出发前先跟运营商确认漫游是否可用，或准备好其他可用的数据方案。",
        en: "Before you fly, check roaming with your operator or arrange another workable data plan.",
        ar: "قبل السفر تحقق من التجوال مع مشغلك أو جهّز خطة بيانات بديلة تعمل فعلًا.",
      },
      {
        zh: "落地后第一件事是联系接待人，确认对方能收到你的消息。",
        en: "The first thing after landing: contact your host and make sure your messages reach them.",
        ar: "أول خطوة بعد الهبوط: تواصل مع المضيف وتأكد من وصول رسائلك.",
      },
    ],
  },
  {
    id: "payment",
    title: { zh: "支付", en: "Paying for things", ar: "الدفع" },
    lines: [
      {
        zh: "提前准备一张可用的银行卡或移动支付，并带少量现金备用。",
        en: "Prepare a card or mobile payment that actually works, and carry a little cash as backup.",
        ar: "جهّز بطاقة أو وسيلة دفع عبر الهاتف تعمل فعلًا، واحمل مبلغًا نقديًا صغيرًا احتياطيًا.",
      },
      {
        zh: "第一笔先做小额测试，确认能付得出去，再用于大额。",
        en: "Make a small test payment first to confirm it goes through before relying on it.",
        ar: "نفّذ دفعة تجريبية صغيرة أولًا للتأكد من نجاحها قبل الاعتماد عليها.",
      },
      {
        zh: "官方支付指引见本页底部链接。",
        en: "The official payment guide for visitors is linked at the bottom of this page.",
        ar: "دليل الدفع الرسمي للزوار مرفق في أسفل الصفحة.",
      },
    ],
  },
  {
    id: "address",
    title: { zh: "地址与打车", en: "Addresses & taxis", ar: "العناوين وسيارات الأجرة" },
    lines: [
      {
        zh: "保留一份中文地址给司机看，比说英文可靠。下面几条可以直接复制。",
        en: "Keep a Chinese-language address to show the driver — more reliable than speaking English. The lines below can be copied directly.",
        ar: "احتفظ بالعنوان بالصينية لتُظهره للسائق، فهو أضمن من التحدث بالإنجليزية. يمكن نسخ السطور أدناه مباشرة.",
      },
      {
        zh: "酒店还没定，所以这里不放酒店导航地址 —— 定了再补，不要用猜的地址打车。",
        en: "The hotel is not chosen yet, so no hotel address is published here. Do not take a taxi to a guessed address.",
        ar: "لم يُختر الفندق بعد، لذا لا يوجد عنوان فندق هنا. لا تستقل سيارة أجرة إلى عنوان مُخمَّن.",
      },
    ],
  },
  {
    id: "documents",
    title: { zh: "证件", en: "Documents", ar: "الوثائق" },
    lines: [
      {
        zh: "随身携带护照，并带一份行程副本（纸质或手机截图都行）。",
        en: "Carry your passport, plus a copy of the itinerary (printed or a screenshot).",
        ar: "احمل جواز سفرك ونسخة من البرنامج (مطبوعة أو صورة على الهاتف).",
      },
      {
        zh: "签证状态请本人向使领馆或代办确认。这里不判断任何免签政策是否适用于你。",
        en: "Confirm your own visa status with the consulate or your agent. This page makes no claim that any visa-free policy applies to you.",
        ar: "تأكد من وضع تأشيرتك مع القنصلية أو الوكيل. لا تدّعي هذه الصفحة انطباق أي إعفاء من التأشيرة عليك.",
      },
    ],
  },
  {
    id: "food",
    title: { zh: "餐饮", en: "Food", ar: "الطعام" },
    lines: [
      {
        zh: "有清真、过敏或其他忌口，请提前告诉接待人，别等到上桌才说。",
        en: "If you need halal, have allergies or other restrictions, tell your host in advance — not at the table.",
        ar: "إن كنت تحتاج طعامًا حلالًا أو لديك حساسية أو قيود أخرى، أبلغ المضيف مسبقًا لا على المائدة.",
      },
    ],
  },
  {
    id: "arrival",
    title: { zh: "落地流程", en: "On arrival", ar: "عند الوصول" },
    lines: [
      {
        zh: "跟着入境 → 行李 → 海关的标识走，机场都有英文指示。",
        en: "Follow the signs: immigration → baggage → customs. Airport signage includes English.",
        ar: "اتبع اللافتات: الجوازات ← الأمتعة ← الجمارك. لافتات المطار تتضمن الإنجليزية.",
      },
      {
        zh: "航班延误或改点，先通知接待人；不要自行改到别的航站楼会合。",
        en: "If your flight is delayed or changed, tell your host first. Do not switch the meeting point to another terminal on your own.",
        ar: "عند التأخير أو تغيير الرحلة أبلغ المضيف أولًا، ولا تغيّر نقطة اللقاء إلى صالة أخرى من تلقاء نفسك.",
      },
    ],
  },
  {
    id: "time",
    title: { zh: "时间怎么看", en: "Reading the times", ar: "قراءة الأوقات" },
    lines: [
      {
        zh: "机场起降时间一律是「该机场当地时间」：开罗段按开罗时间，中国段按北京时间。",
        en: "All airport times are local to that airport: Cairo legs in Cairo time, China legs in Beijing time.",
        ar: "جميع أوقات المطارات محلية لكل مطار: رحلات القاهرة بتوقيت القاهرة ورحلات الصين بتوقيت بكين.",
      },
      {
        zh: "中国境内的行程按北京时间标注，不要把整段行程都当成北京时间。",
        en: "Activities inside China are shown in Beijing time — do not read the whole trip as Beijing time.",
        ar: "الأنشطة داخل الصين معروضة بتوقيت بكين — لا تقرأ الرحلة كلها بتوقيت بكين.",
      },
    ],
  },
];

export type CopyAddress = { id: string; label: L10n; chinese: string };

export const COPY_ADDRESSES: CopyAddress[] = [
  {
    id: "can-t2",
    label: {
      zh: "白云机场 T2（9/21 到达、9/27 & 10/6 出发）",
      en: "Baiyun Airport T2 (arrive 21 Sep; depart 27 Sep & 6 Oct)",
      ar: "مطار بايون صالة 2 (الوصول 21 سبتمبر؛ المغادرة 27 سبتمبر و6 أكتوبر)",
    },
    chinese: "广州白云国际机场 T2 航站楼",
  },
  {
    id: "can-t3",
    label: {
      zh: "白云机场 T3（9/21 到达、9/27 出发）",
      en: "Baiyun Airport T3 (arrive 21 Sep; depart 27 Sep)",
      ar: "مطار بايون صالة 3 (الوصول 21 سبتمبر؛ المغادرة 27 سبتمبر)",
    },
    chinese: "广州白云国际机场 T3 航站楼",
  },
  {
    id: "store",
    label: {
      zh: "学习门店（准确街道与入口待确认）",
      en: "Training store (exact street and entrance unconfirmed)",
      ar: "متجر التدريب (الشارع والمدخل غير مؤكدين)",
    },
    chinese: "广州市黄埔区 云汇天地（学习门店，准确街道与入口待确认）",
  },
];

/* ------------------------------------------------------------------ */
/* 官方来源                                                            */
/* ------------------------------------------------------------------ */

export type OfficialLink = {
  id: string;
  title: L10n;
  note: L10n;
  url: string;
};

export const OFFICIAL_LINKS: OfficialLink[] = [
  {
    id: "holiday",
    title: {
      zh: "中秋假期安排 9/25–9/27（官方发布）",
      en: "Mid-Autumn holiday 25–27 Sep (official notice)",
      ar: "عطلة منتصف الخريف 25–27 سبتمبر (إشعار رسمي)",
    },
    note: {
      zh: "行程日期不变，只是提醒 25 日门店值班、26 日出行人多、27 日送机用车要提前协调。",
      en: "Trip dates are unchanged — this is a reminder to arrange store cover on the 25th, expect crowds on the 26th, and book cars early for the 27th.",
      ar: "مواعيد الرحلة لم تتغير — التذكير فقط بترتيب مناوبة المتجر يوم 25 وتوقع الزحام يوم 26 وحجز السيارات مبكرًا ليوم 27.",
    },
    url: "https://www.beijing.gov.cn/cs/gncs/zcwj/202603/t20260327_4568275.html",
  },
  {
    id: "payment",
    title: {
      zh: "广州境外访客支付指南",
      en: "Guangzhou payment guide for overseas visitors",
      ar: "دليل الدفع في قوانغتشو للزوار من الخارج",
    },
    note: {
      zh: "官方说明本地可用的支付方式。",
      en: "Official explanation of the payment options that work locally.",
      ar: "شرح رسمي لوسائل الدفع التي تعمل محليًا.",
    },
    url: "https://www.gz.gov.cn/guangzhouinternational/visitors/content/post_10668621.html",
  },
  {
    id: "visitor-guide",
    title: {
      zh: "广州来访指南（PDF）",
      en: "Guangzhou visitor guide (PDF)",
      ar: "دليل زيارة قوانغتشو (PDF)",
    },
    note: {
      zh: "本页北京路、沙面两个城市体验建议的来源。",
      en: "Source for the two city-experience suggestions on this page (Beijing Road and Shamian).",
      ar: "مصدر اقتراحَي التجربة المدينية في هذه الصفحة (شارع بكين وشاميان).",
    },
    url: "https://www.gz.gov.cn/attachment/7/7792/7792046/10199330.pdf",
  },
];

/* ------------------------------------------------------------------ */
/* 底部可展开参考：总部通知                                            */
/* ------------------------------------------------------------------ */

/**
 * 底部折叠区的参考图。只放总部面向全体的总通知；
 * 带个人电话的轮岗申请、原始机票行程单一律不进这里。
 */
export type ReferenceImage = { id: string; src: string; caption: L10n };

export const REFERENCE_IMAGES: ReferenceImage[] = [
  {
    id: "hq-notice",
    src: "/reference/hq-notice.png",
    caption: {
      zh: "总部总通知原件。本团实际安排以本页已核定的日程为准。",
      en: "The original HQ general notice. This delegation's actual plan follows the verified schedule on this page.",
      ar: "الإشعار العام الأصلي من المقر. أما خطة هذا الوفد الفعلية فتتبع البرنامج المُتحقَّق منه في هذه الصفحة.",
    },
  },
];

export const REFERENCE_SUMMARY: L10n[] = [
  {
    zh: "总部通知里已经确定的：9/22 全天参会、9/23 参会、9/23 下午 13:50–17:30 第一批门店巡店场次、9/24 订货会仅上午。",
    en: "Fixed by the HQ notice: full-day sessions on 22 Sep, sessions on 23 Sep, the 13:50–17:30 first-batch store tour slot on 23 Sep, and a morning-only Order Fair on 24 Sep.",
    ar: "ما حدده إشعار المقر: جلسات يوم كامل في 22 سبتمبر، وجلسات في 23 سبتمبر، وجولة المتاجر الأولى 13:50–17:30 في 23 سبتمبر، ومعرض الطلبيات صباحًا فقط في 24 سبتمبر.",
  },
  {
    zh: "9/15–19 的总部前期活动，本团不参加。",
    en: "The HQ pre-event activities on 15–19 Sep are not attended by this delegation.",
    ar: "أنشطة المقر التمهيدية من 15 إلى 19 سبتمبر لا يحضرها هذا الوفد.",
  },
  {
    zh: "本页不放 PNR、票号或原始行程单 PDF。",
    en: "This page does not publish PNRs, ticket numbers, or the original itinerary PDF.",
    ar: "لا تنشر هذه الصفحة أرقام الحجز أو أرقام التذاكر أو ملف البرنامج الأصلي.",
  },
];
