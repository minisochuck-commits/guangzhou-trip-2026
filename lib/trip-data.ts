// 广州行程 · 事实数据正本
//
// 只放「事实」：人员、航班、行李、酒店、指南、路线、来源链接。
// 每天每人的四行安排（住宿 / 活动 / 餐饮 / 交通）由 `lib/person-day-plan.ts`
// 的纯函数派生，不在这里铺开。
//
// 纪律：
//   - 未定的写「待定 / 待确认」，绝不写成已预订、已安排。
//   - 航班的日期、时刻、航站楼一律按票面，不改。所有时间标注所属机场当地时区。
//   - 姓名正文统一用正常大小写显示名；票面全名只出现在人员详情里。
//   - 航班号、机场三字码保持大写。

export type Lang = "zh" | "en" | "ar";
export type L10n = { zh: string; en: string; ar: string };

export type PersonId = "qiuting" | "hassan" | "ahmed" | "rahma" | "reham";
export type Status = "confirmed" | "pending";
export type TimeZoneTag = "cairo" | "beijing";

/* ------------------------------------------------------------------ */
/* 人员                                                                */
/* ------------------------------------------------------------------ */

export type Person = {
  id: PersonId;
  /** 正文里显示的名字，正常大小写。 */
  name: string;
  /** 票面全名，只在人员详情里出现。 */
  ticketName: string;
  role: L10n;
};

export const PEOPLE: Person[] = [
  {
    id: "qiuting",
    name: "Li/Qiuting",
    ticketName: "LI/QIUTING",
    role: { zh: "商品负责人", en: "Merchandise Lead", ar: "مسؤولة السلع" },
  },
  {
    id: "rahma",
    name: "Rahma",
    ticketName: "ABDELHAMID/RAHMASAYED",
    role: {
      zh: "董事长助理",
      en: "Chairman's Assistant",
      ar: "مساعدة رئيس مجلس الإدارة",
    },
  },
  {
    id: "ahmed",
    name: "Ahmed",
    ticketName: "ABDELMAGEED/AHMED ABED",
    role: { zh: "区域经理", en: "Area Manager", ar: "مدير المنطقة" },
  },
  {
    id: "hassan",
    name: "Mohamed",
    ticketName: "HASSAN/MOHAMEDMOHAMED",
    role: {
      zh: "防损负责人",
      en: "Loss Prevention Lead",
      ar: "مسؤول منع الخسائر",
    },
  },
  {
    id: "reham",
    name: "Reham",
    ticketName: "EISSA/REHAM MOHAMED",
    role: {
      zh: "商场招商负责人",
      en: "Mall Leasing Lead",
      ar: "مسؤولة تأجير المراكز التجارية",
    },
  },
];

export const PERSON_MAP: Record<PersonId, Person> = PEOPLE.reduce(
  (acc, person) => {
    acc[person.id] = person;
    return acc;
  },
  {} as Record<PersonId, Person>,
);

/* ------------------------------------------------------------------ */
/* 机场与航班（按票面，不改）                                          */
/* ------------------------------------------------------------------ */

export const AIRPORTS = {
  CAI: {
    city: { zh: "开罗", en: "Cairo", ar: "القاهرة" },
    tz: "cairo" as TimeZoneTag,
  },
  TFU: {
    city: { zh: "成都天府", en: "Chengdu Tianfu", ar: "تشنغدو تيانفو" },
    tz: "beijing" as TimeZoneTag,
  },
  CAN: {
    city: { zh: "广州白云", en: "Guangzhou Baiyun", ar: "قوانغتشو بايون" },
    tz: "beijing" as TimeZoneTag,
  },
};

export type AirportCode = keyof typeof AIRPORTS;

export type FlightPoint = {
  iata: AirportCode;
  terminal: string;
  date: string;
  time: string;
};

export type BaggageProfile = "sichuanEconomy" | "egyptairBusiness";

export type FlightSegment = {
  id: string;
  code: string;
  cabin: L10n;
  from: FlightPoint;
  to: FlightPoint;
  people: PersonId[];
  baggage: BaggageProfile;
};

const ECONOMY: L10n = { zh: "经济舱", en: "Economy", ar: "الدرجة السياحية" };
const BUSINESS: L10n = {
  zh: "商务舱 · 直飞",
  en: "Business · direct",
  ar: "درجة رجال الأعمال · مباشرة",
};

const SICHUAN_FOUR: PersonId[] = ["qiuting", "rahma", "ahmed", "hassan"];
const RETURN_THREE: PersonId[] = ["rahma", "ahmed", "hassan"];

/** 8 段航班，全部按票面。 */
export const FLIGHTS: FlightSegment[] = [
  {
    id: "3U3864",
    code: "3U3864",
    cabin: ECONOMY,
    from: { iata: "CAI", terminal: "T2", date: "2026-09-20", time: "14:45" },
    to: { iata: "TFU", terminal: "T1", date: "2026-09-21", time: "05:10" },
    people: SICHUAN_FOUR,
    baggage: "sichuanEconomy",
  },
  {
    id: "3U6701",
    code: "3U6701",
    cabin: ECONOMY,
    from: { iata: "TFU", terminal: "T2", date: "2026-09-21", time: "08:00" },
    to: { iata: "CAN", terminal: "T2", date: "2026-09-21", time: "10:25" },
    people: SICHUAN_FOUR,
    baggage: "sichuanEconomy",
  },
  {
    id: "MS958",
    code: "MS958",
    cabin: BUSINESS,
    from: { iata: "CAI", terminal: "T3", date: "2026-09-21", time: "00:20" },
    to: { iata: "CAN", terminal: "T3", date: "2026-09-21", time: "15:30" },
    people: ["reham"],
    baggage: "egyptairBusiness",
  },
  {
    id: "3U6704-0927",
    code: "3U6704",
    cabin: ECONOMY,
    from: { iata: "CAN", terminal: "T2", date: "2026-09-27", time: "17:25" },
    to: { iata: "TFU", terminal: "T2", date: "2026-09-27", time: "19:25" },
    people: RETURN_THREE,
    baggage: "sichuanEconomy",
  },
  {
    id: "3U3863-0928",
    code: "3U3863",
    cabin: ECONOMY,
    from: { iata: "TFU", terminal: "T1", date: "2026-09-28", time: "01:25" },
    to: { iata: "CAI", terminal: "T2", date: "2026-09-28", time: "06:50" },
    people: RETURN_THREE,
    baggage: "sichuanEconomy",
  },
  {
    id: "MS959",
    code: "MS959",
    cabin: BUSINESS,
    from: { iata: "CAN", terminal: "T3", date: "2026-09-27", time: "23:20" },
    to: { iata: "CAI", terminal: "T3", date: "2026-09-28", time: "04:50" },
    people: ["reham"],
    baggage: "egyptairBusiness",
  },
  {
    id: "3U6704-1006",
    code: "3U6704",
    cabin: ECONOMY,
    from: { iata: "CAN", terminal: "T2", date: "2026-10-06", time: "17:25" },
    to: { iata: "TFU", terminal: "T2", date: "2026-10-06", time: "19:25" },
    people: ["qiuting"],
    baggage: "sichuanEconomy",
  },
  {
    id: "3U3863-1007",
    code: "3U3863",
    cabin: ECONOMY,
    from: { iata: "TFU", terminal: "T1", date: "2026-10-07", time: "01:25" },
    to: { iata: "CAI", terminal: "T2", date: "2026-10-07", time: "06:50" },
    people: ["qiuting"],
    baggage: "sichuanEconomy",
  },
];

export const FLIGHT_MAP: Record<string, FlightSegment> = FLIGHTS.reduce(
  (acc, flight) => {
    acc[flight.id] = flight;
    return acc;
  },
  {} as Record<string, FlightSegment>,
);

/** 成都中转说明：只换航站楼，不另按提前 3 小时到机场计算。 */
export const CHENGDU_TRANSFER: L10n = {
  zh: "成都天府中转：去程 T1 到达、T2 出发；回程 T2 到达、T1 出发，需自行转航站楼。中转衔接按票面时间，不另按提前 3 小时到机场计算。",
  en: "Chengdu Tianfu transfer: outbound arrives T1 and departs T2; return arrives T2 and departs T1, so you change terminals yourself. The connection follows the ticket times — the 3-hour airport rule does not apply again here.",
  ar: "الترانزيت في تشنغدو تيانفو: ذهابًا الوصول إلى الصالة 1 والمغادرة من الصالة 2، وعودةً الوصول إلى الصالة 2 والمغادرة من الصالة 1، أي يلزم تغيير الصالة. ويتبع الربط أوقات التذكرة، ولا تُطبَّق قاعدة الثلاث ساعات مرة أخرى هنا.",
};

/* ------------------------------------------------------------------ */
/* 免费行李额（核实日期 2026-09-10，仅票价所含，不含额外购买）          */
/* ------------------------------------------------------------------ */

/**
 * 免费行李额。
 *
 * 口径分两层，不能混：
 *   - `opening`：**票面确认**的件数。这是我们真正看到的东西。
 *   - `lines`：**航空公司官网标准**推出来的重量与尺寸。不是这张订单的确认值。
 *   - `caveat`：明说具体订单的重量额度还没有向航司或出票方核实过。
 *
 * 不得声称查过航司订座后台。
 */
export type BaggageInfo = {
  title: L10n;
  /** 主行：票面件数。 */
  opening: L10n;
  /** 只在从开罗出发的那一段用；回程不能套「开罗出发」这个抬头。 */
  openingFromCairo?: L10n;
  /** 次要行：官网重量、尺寸。 */
  lines: L10n[];
  /** 票面 / 官网的区分与未核实声明。 */
  caveat?: L10n;
  sources: { label: L10n; url: string }[];
};

export const BAGGAGE: Record<BaggageProfile, BaggageInfo> = {
  sichuanEconomy: {
    title: {
      zh: "四川航空 · 经济舱",
      en: "Sichuan Airlines · Economy",
      ar: "الخطوط الجوية السيتشوانية · الدرجة السياحية",
    },
    opening: {
      zh: "票面含 1 件免费托运行李",
      en: "The ticket includes 1 free checked bag",
      ar: "التذكرة تشمل قطعة أمتعة مسجَّلة مجانية واحدة",
    },
    openingFromCairo: {
      zh: "开罗出发：票面含 1 件免费托运行李",
      en: "Departing Cairo: the ticket includes 1 free checked bag",
      ar: "المغادرة من القاهرة: التذكرة تشمل قطعة أمتعة مسجَّلة مجانية واحدة",
    },
    lines: [
      {
        zh: "官网标准：该件最多 23 公斤；另可随身带 1 件最多 8 公斤。",
        en: "Airline website standard: up to 23 kg for that bag, plus 1 carry-on up to 8 kg.",
        ar: "معيار موقع الشركة: حتى 23 كجم لتلك القطعة، بالإضافة إلى قطعة يدوية واحدة حتى 8 كجم.",
      },
      {
        zh: "尺寸：托运件三边之和不超过 158 厘米；随身件不超过 55×40×20 厘米。",
        en: "Dimensions: checked bag up to 158 cm in total; carry-on up to 55×40×20 cm.",
        ar: "الأبعاد: القطعة المسجَّلة حتى 158 سم إجمالًا؛ واليدوية حتى 55×40×20 سم.",
      },
    ],
    caveat: {
      zh: "件数来自票面，重量与尺寸来自官网标准。具体订单的重量额度尚未向川航或出票方核实。",
      en: "The piece count comes from the ticket; the weights and dimensions come from the airline's public website. The weight allowance for this specific booking has not been checked with Sichuan Airlines or the ticket issuer.",
      ar: "عدد القطع مأخوذ من التذكرة، والأوزان والأبعاد من الموقع الرسمي للشركة. أما حد الوزن لهذا الحجز تحديدًا فلم يُتحقَّق منه مع سيتشوان أو جهة إصدار التذكرة.",
    },
    sources: [
      {
        label: {
          zh: "四川航空：托运行李",
          en: "Sichuan Airlines: checked baggage",
          ar: "الخطوط السيتشوانية: الأمتعة المسجَّلة",
        },
        url: "https://www.sichuanair.com/baggage-service/checked-baggage.html",
      },
      {
        label: {
          zh: "四川航空：免费行李额说明",
          en: "Sichuan Airlines: free baggage allowance",
          ar: "الخطوط السيتشوانية: حد الأمتعة المجاني",
        },
        url: "https://serviceapp.sichuanair.com/views/staticinfo/static7b2817c998e244adbf77f258a8b88995.html",
      },
    ],
  },
  egyptairBusiness: {
    title: {
      zh: "埃及航空 · 商务舱（票面 2 件）",
      en: "EGYPTAIR · Business (2 pieces on the ticket)",
      ar: "مصر للطيران · درجة رجال الأعمال (قطعتان على التذكرة)",
    },
    opening: {
      zh: "托运：2 件，每件不超过 32 kg，每件三边之和不超过 158 cm。",
      en: "Checked: 2 pieces, up to 32 kg each, total of three dimensions up to 158 cm per piece.",
      ar: "المسجَّلة: قطعتان حتى 32 كجم لكل قطعة، ومجموع الأبعاد الثلاثة حتى 158 سم لكل قطعة.",
    },
    lines: [
      {
        zh: "手提：2 件，每件不超过 8 kg，每件不超过 55×40×23 cm。",
        en: "Carry-on: 2 pieces, up to 8 kg each, up to 55×40×23 cm each.",
        ar: "اليدوية: قطعتان حتى 8 كجم لكل قطعة، وحتى 55×40×23 سم لكل قطعة.",
      },
      {
        zh: "限重按每件计算：64 kg 不能装进一个箱子。",
        en: "The limit is per piece: 64 kg cannot go into a single bag.",
        ar: "الحد لكل قطعة: لا يمكن وضع 64 كجم في حقيبة واحدة.",
      },
    ],
    sources: [
      {
        label: {
          zh: "EGYPTAIR：Baggage Allowance",
          en: "EGYPTAIR: Baggage Allowance",
          ar: "مصر للطيران: الوزن المسموح",
        },
        url: "https://www.egyptair.com/en/fly/baggage/pages/baggage-allowance.aspx",
      },
      {
        label: {
          zh: "EGYPTAIR：الوزن المسموح（阿文）",
          en: "EGYPTAIR: allowance (Arabic)",
          ar: "مصر للطيران: الوزن المسموح (بالعربية)",
        },
        url: "https://www.egyptair.com/ar/fly/baggage/Pages/baggage-allowance.aspx",
      },
    ],
  },
};

/**
 * `caveat` 已经说清「件数来自票面、重量来自官网、这张订单没核实」，
 * 再跟一句 BAGGAGE_VERIFIED 就是同一件事说两遍。有 caveat 时只补这一句
 * ——它带的是 caveat 没有的信息：查阅日期和「不含额外购买」。
 */
/** 主区常显的一句：不藏不确定性，但也不占三行。完整说法在折叠里。 */
export const BAGGAGE_SHORT_CAVEAT: L10n = {
  zh: "重量按官网标准，订单待核实",
  en: "Weights follow the airline website; this booking is not confirmed",
  ar: "الأوزان حسب موقع الشركة؛ ولم يُؤكَّد هذا الحجز",
};

export const BAGGAGE_SCOPE: L10n = {
  zh: "官网查阅日期 2026-09-10；不含额外购买或会员加赠。",
  en: "Websites read on 2026-09-10; excludes purchased or status extras.",
  ar: "قُرئت المواقع بتاريخ 2026-09-10؛ ولا يشمل ذلك الأمتعة المشتراة أو مزايا العضوية.",
};

export const BAGGAGE_VERIFIED: L10n = {
  zh: "件数按所提供机票；重量与尺寸按航空公司官网（2026-09-10 查阅）。不含额外购买或会员加赠。",
  en: "Piece counts from the issued tickets; weights and dimensions from the airlines' public websites (read 2026-09-10). Excludes purchased or status extras.",
  ar: "عدد القطع من التذاكر الصادرة؛ والأوزان والأبعاد من المواقع الرسمية لشركات الطيران (بتاريخ 2026-09-10). ولا يشمل ذلك الأمتعة المشتراة أو مزايا العضوية.",
};

/* ------------------------------------------------------------------ */
/* 酒店                                                                */
/* ------------------------------------------------------------------ */

export const INTERCONTINENTAL = {
  name: {
    zh: "广州保利洲际酒店",
    en: "InterContinental Guangzhou Exhibition Center",
    ar: "فندق إنتركونتيننتال قوانغتشو",
  } satisfies L10n,
  nameLatin: "InterContinental Guangzhou Exhibition Center",
  chineseAddress: "广州保利洲际酒店，广州市海珠区阅江中路828号",
  url: "https://www.ihg.com/intercontinental/hotels/cn/zh/guangzhou/canec/hoteldetail",
  checkInOut: {
    zh: "官方入住时间 15:00、退房 12:00。9/21 上午到达不等于房间已经准备好。",
    en: "Official check-in 15:00, check-out 12:00. Arriving on the morning of 21 Sep does not mean the room is ready.",
    ar: "تسجيل الدخول الرسمي 15:00 والمغادرة 12:00. والوصول صباح 21 سبتمبر لا يعني أن الغرفة جاهزة.",
  } satisfies L10n,
};

/* ------------------------------------------------------------------ */
/* 出发前准备（网络 / 支付 / 翻译）                                     */
/* ------------------------------------------------------------------ */

export type PrepItem = { id: string; title: L10n; lines: L10n[] };

export const PREP: PrepItem[] = [
  {
    id: "sim",
    title: {
      zh: "手机上网",
      en: "Mobile data",
      ar: "بيانات الهاتف",
    },
    lines: [
      {
        zh: "Chuck 给 Mohamed 1 张中国 SIM 卡，返程后归还 Chuck。出发前插卡，确认手机能识别。",
        en: "Chuck gives Mohamed one China SIM card, returned to Chuck after the trip. Insert it before departure and check the phone recognises it.",
        ar: "يعطي Chuck لـ Mohamed شريحة صينية واحدة تُعاد إلى Chuck بعد الرحلة. ضعها قبل السفر وتأكد من تعرّف الهاتف عليها.",
      },
      {
        zh: "落地后测本地流量。只有一张卡，Mohamed 可开热点给 Ahmed，落地一起测一次。",
        en: "Test local data after landing. Only one card, so Mohamed can share a hotspot with Ahmed — test it together on arrival.",
        ar: "اختبر بيانات الإنترنت بعد الهبوط. الشريحة واحدة فقط، فيمكن لـ Mohamed مشاركة نقطة اتصال مع Ahmed — جرّباها معًا عند الوصول.",
      },
    ],
  },
  {
    id: "translate",
    title: {
      zh: "翻译与求助",
      en: "Translation and getting help",
      ar: "الترجمة وطلب المساعدة",
    },
    lines: [
      {
        zh: "出发前装好并配置 VPN 与 ChatGPT，用于翻译和求助，出发前测试一次。",
        en: "Install and set up a VPN and ChatGPT before departure for translation and help, and test them once.",
        ar: "ثبّت وأعدّ VPN و ChatGPT قبل السفر للترجمة وطلب المساعدة، وجرّبهما مرة.",
      },
      {
        zh: "在中国不保证可用。另备可离线的中文翻译，以及本页可复制的中文地址与求助短句。",
        en: "Access is not guaranteed in China. Also keep an offline Chinese translation option, plus the copyable Chinese addresses and phrases on this page.",
        ar: "الوصول غير مضمون في الصين. احتفظ أيضًا بترجمة صينية تعمل دون إنترنت، وبالعناوين والعبارات القابلة للنسخ في هذه الصفحة.",
      },
    ],
  },
  {
    id: "payment",
    title: {
      zh: "支付",
      en: "Payments",
      ar: "الدفع",
    },
    lines: [
      {
        zh: "Chuck 提供备用金。出发前确认支付宝已开通、备用金已到账，并做一笔小额试付。",
        en: "Chuck provides a cash float. Before departure, confirm Alipay is activated and the float has arrived, then make one small test payment.",
        ar: "يوفّر Chuck مبلغًا احتياطيًا. وقبل السفر تأكد من تفعيل «أليباي» ووصول المبلغ، ثم نفّذ دفعة تجريبية صغيرة.",
      },
      {
        zh: "另带少量现金备用。",
        en: "Also carry a small amount of cash as backup.",
        ar: "واحمل أيضًا مبلغًا نقديًا صغيرًا احتياطيًا.",
      },
    ],
  },
  {
    id: "weather",
    title: {
      zh: "天气与穿什么",
      en: "Weather and what to wear",
      ar: "الطقس وماذا ترتدي",
    },
    lines: [
      {
        zh: "九月下旬的广州还是夏天：往年这个月白天平均 32℃ 上下、夜里 24℃ 上下，空气潮，走一段路就出汗。带轻薄透气的衣服。",
        en: "Late September in Guangzhou is still summer: in an average September the days run around 32°C and the nights around 24°C, and the air is humid enough that a short walk makes you sweat. Pack light, breathable clothes.",
        ar: "أواخر سبتمبر في قوانغتشو لا يزال صيفًا: في سبتمبر المعتاد تبلغ حرارة النهار نحو 32 درجة والليل نحو 24 درجة، والجو رطب إلى حدّ يجعل المشي القصير يُعرِّق. فاحمل ملابس خفيفة تسمح بمرور الهواء.",
      },
      {
        zh: "九月也是雨月，月均降水接近 190 毫米。带一把折叠伞，别指望天天晴。",
        en: "September is also a wet month — close to 190 mm of rain on average. Bring a folding umbrella; don't count on clear days.",
        ar: "وسبتمبر شهر ممطر أيضًا، إذ يبلغ متوسط الأمطار نحو 190 ملم. فخذ مظلة قابلة للطي ولا تعوّل على صفاء الجو.",
      },
      {
        zh: "室内冷气开得足，会议室、商场和车里都偏凉，随身带一件薄外套。",
        en: "Air conditioning indoors is strong — meeting rooms, malls and cars all run cold. Keep a light jacket with you.",
        ar: "والتكييف داخل المباني قوي، فقاعات الاجتماعات والمراكز التجارية والسيارات باردة. احتفظ بسترة خفيفة معك.",
      },
      {
        zh: "以上是往年九月的月平均值，不是这几天的预报。出发前和每天早上看一次当天预报。",
        en: "These are average figures for September in past years, not a forecast for these particular days. Check the actual forecast before you fly and again each morning.",
        ar: "هذه متوسطات سبتمبر في السنوات الماضية وليست توقعًا لهذه الأيام تحديدًا. راجع النشرة الفعلية قبل السفر وكل صباح.",
      },
    ],
  },
];

/* ------------------------------------------------------------------ */
/* 可复制中文                                                          */
/* ------------------------------------------------------------------ */

export type CopyEntry = { id: string; label: L10n; chinese: string };

export const COPY_ADDRESSES: CopyEntry[] = [
  {
    id: "hotel",
    label: {
      zh: "酒店（9/21–9/24 全员；Reham 至 9/26）",
      en: "Hotel (21–24 Sep everyone; Reham through 26 Sep)",
      ar: "الفندق (21–24 سبتمبر للجميع؛ و Reham حتى 26 سبتمبر)",
    },
    chinese: "广州保利洲际酒店，广州市海珠区阅江中路828号",
  },
  {
    id: "can-t2",
    label: {
      zh: "白云机场 T2（9/21 到达、9/27 与 10/6 出发）",
      en: "Baiyun Airport T2 (arrive 21 Sep; depart 27 Sep and 6 Oct)",
      ar: "مطار بايون الصالة 2 (الوصول 21 سبتمبر؛ المغادرة 27 سبتمبر و6 أكتوبر)",
    },
    chinese: "广州白云国际机场 T2 航站楼",
  },
  {
    id: "can-t3",
    label: {
      zh: "白云机场 T3（Reham 9/21 到达、9/27 出发）",
      en: "Baiyun Airport T3 (Reham: arrive 21 Sep, depart 27 Sep)",
      ar: "مطار بايون الصالة 3 (Reham: الوصول 21 سبتمبر والمغادرة 27 سبتمبر)",
    },
    chinese: "广州白云国际机场 T3 航站楼",
  },
];

export const PHRASES: CopyEntry[] = [
  {
    id: "to-hotel",
    label: {
      zh: "给司机看：去酒店",
      en: "Show the driver: take me to the hotel",
      ar: "أظهرها للسائق: خذني إلى الفندق",
    },
    chinese: "请带我去广州保利洲际酒店，广州市海珠区阅江中路828号。",
  },
  {
    id: "pork",
    label: {
      zh: "问食材：有没有猪肉 / 猪油 / 酒",
      en: "Ask about ingredients: pork, lard or alcohol",
      ar: "اسأل عن المكوّنات: لحم خنزير أو شحمه أو كحول",
    },
    chinese: "请问这道菜有没有猪肉、猪油或酒？",
  },
  {
    id: "halal",
    label: {
      zh: "说明需要清真餐食",
      en: "Say you need halal food",
      ar: "أخبرهم أنك تحتاج طعامًا حلالًا",
    },
    chinese: "我需要清真餐食，请帮我确认食材和烹饪方式。",
  },
  {
    id: "menu",
    label: {
      zh: "请对方解释菜单",
      en: "Ask someone to explain the menu",
      ar: "اطلب شرح قائمة الطعام",
    },
    chinese: "请帮我看一下这份菜单，告诉我每道菜的食材和价格。",
  },
  /* 全程打车，下面几句是坐车时真正用得上的。 */
  {
    id: "call-taxi",
    label: {
      zh: "请前台帮忙叫车",
      en: "Ask the front desk to call a taxi",
      ar: "اطلب من الاستقبال طلب سيارة أجرة",
    },
    chinese: "麻烦帮我叫一辆车，我要去这个地址。",
  },
  {
    id: "meter",
    label: {
      zh: "给司机看：请打表或用导航",
      en: "Show the driver: please use the meter or navigation",
      ar: "أظهرها للسائق: من فضلك شغّل العدّاد أو استخدم الملاحة",
    },
    chinese: "麻烦打表，或者按导航走，谢谢。",
  },
  {
    id: "stop-here",
    label: {
      zh: "给司机看：在这里停",
      en: "Show the driver: stop here please",
      ar: "أظهرها للسائق: توقّف هنا من فضلك",
    },
    chinese: "麻烦在这里停一下，谢谢。",
  },
  {
    id: "how-much",
    label: {
      zh: "问价格：这个多少钱",
      en: "Ask the price: how much is this",
      ar: "اسأل عن السعر: بكم هذا",
    },
    chinese: "请问这个多少钱？",
  },
];

/* ------------------------------------------------------------------ */
/* 自由行建议路线（研究已核实官方来源；未预订，时长为规划参考）        */
/* ------------------------------------------------------------------ */

export type Route = {
  id: string;
  title: L10n;
  duration: L10n;
  bestFor: L10n;
  summary: L10n;
  steps: L10n[];
  transport: L10n;
  tickets: L10n;
  copy: CopyEntry[];
  sources: { label: L10n; url: string }[];
};

export const ROUTES: Route[] = [
  {
    id: "huangpu",
    title: {
      zh: "黄埔古港 · 古村慢逛",
      en: "Huangpu Ancient Port · an easy village walk",
      ar: "ميناء هوانغبو القديم · نزهة هادئة في القرية",
    },
    duration: {
      zh: "约 3–4 小时（规划参考，含往返交通与休息）",
      en: "About 3–4 hours (planning estimate, including travel and breaks)",
      ar: "نحو 3–4 ساعات (تقدير تخطيطي يشمل التنقل والاستراحة)",
    },
    bestFor: {
      zh: "从保利洲际出发较近，适合半天或下午出发；其他酒店以实际地址导航为准",
      en: "Short trip from the InterContinental; good for a half day or an afternoon. From any other hotel, go by the actual address in your navigation app",
      ar: "قريب عند الانطلاق من الإنتركونتيننتال؛ مناسب لنصف يوم أو لفترة بعد الظهر. ومن أي فندق آخر اعتمد على العنوان الفعلي في تطبيق الملاحة",
    },
    summary: {
      zh: "古港、老街和祠堂串起广州的海上贸易故事，适合不赶时间地散步、拍照。",
      en: "The old port, village lanes and ancestral halls tell Guangzhou's maritime-trade story. A relaxed walk with photo stops.",
      ar: "يروي الميناء القديم وأزقة القرية وقاعات الأجداد قصة التجارة البحرية في قوانغتشو، في نزهة هادئة مع وقت للتصوير.",
    },
    steps: [
      {
        zh: "酒店 → 黄埔古港码头与古港公园 → 黄埔古村街巷 → 自选甜品或茶歇 → 返回酒店。",
        en: "Hotel → Huangpu Ancient Port quay and park → the village lanes → optional dessert or tea break → back to the hotel.",
        ar: "الفندق ← رصيف ميناء هوانغبو القديم وحديقته ← أزقة القرية ← حلوى أو استراحة شاي اختيارية ← العودة إلى الفندق.",
      },
      {
        zh: "步行约 1.5–2 小时，其余时间留给交通和休息。",
        en: "About 1.5–2 hours on foot; the rest is travel and rest.",
        ar: "نحو 1.5–2 ساعة سيرًا، والباقي للتنقل والراحة.",
      },
    ],
    transport: {
      zh: "从保利洲际打车前往较近；换住其他酒店后，以实际地址导航为准。也有公共交通：万胜围地铁 / 有轨电车站换乘公交，线路可能调整，出发前再确认。",
      en: "A short taxi ride from the InterContinental; from any other hotel, go by the actual address in your navigation app. Public transport also exists via Wanshengwei metro/tram and a bus, but routes can change, so check before you go.",
      ar: "رحلة أجرة قصيرة من الإنتركونتيننتال؛ ومن أي فندق آخر اعتمد على العنوان الفعلي في تطبيق الملاحة. تتوفر أيضًا مواصلات عامة عبر محطة وانشنغوي للمترو/الترام ثم حافلة، لكن الخطوط قد تتغير فتحقق قبل الذهاب.",
    },
    tickets: {
      zh: "景区官方标注免费。馆舍与店铺的开放时间未核实，以当天现场公告为准；未预订任何讲解。",
      en: "The scenic area is listed as free of charge. Opening hours of halls and shops are not verified — follow the notices on site. No guided tour is booked.",
      ar: "المنطقة السياحية مجانية حسب الجهة الرسمية. أما مواعيد القاعات والمحال فغير مُتحقَّق منها — اتبع الإعلانات في الموقع. ولم يُحجز أي مرشد.",
    },
    copy: [
      {
        id: "huangpu-addr",
        label: {
          zh: "黄埔古港地址",
          en: "Huangpu Ancient Port address",
          ar: "عنوان ميناء هوانغبو القديم",
        },
        chinese: "黄埔古港，广州市海珠区石基村石基路",
      },
    ],
    sources: [
      {
        label: {
          zh: "海珠区政府：黄埔古港、古村景区",
          en: "Haizhu District government: Huangpu Ancient Port and village",
          ar: "حكومة منطقة هايتشو: ميناء هوانغبو القديم والقرية",
        },
        url: "https://www.haizhu.gov.cn/hzdt/ztlm/tzhz/rjhj/lyjd/hsgy/content/mpost_9196973.html",
      },
    ],
  },
  {
    id: "xiguan",
    title: {
      zh: "西关老城 · 骑楼与沙面",
      en: "Old Xiguan · arcades and Shamian",
      ar: "شيغوان القديمة · الأروقة وشاميان",
    },
    duration: {
      zh: "约 5–6 小时（规划参考，含市内交通与休息；纯游览约 3 小时）",
      en: "About 5–6 hours (planning estimate, including city travel and breaks; roughly 3 hours of actual sightseeing)",
      ar: "نحو 5–6 ساعات (تقدير تخطيطي يشمل التنقل والاستراحة؛ نحو 3 ساعات زيارة فعلية)",
    },
    bestFor: {
      zh: "整个半天，建议 9:30–15:30",
      en: "A full half day, suggested 9:30–15:30",
      ar: "نصف يوم كامل، ويُقترح من 9:30 إلى 15:30",
    },
    summary: {
      zh: "先看西关骑楼与手工艺，再到沙面看历史建筑和江景，一条路线体验广州两种老城风貌。",
      en: "Xiguan's arcaded streets and crafts first, then Shamian's historic architecture and riverfront — two different faces of old Guangzhou.",
      ar: "شوارع شيغوان ذات الأروقة والحِرف أولًا، ثم مباني شاميان التاريخية وضفة النهر؛ وجهان مختلفان لقوانغتشو القديمة.",
    },
    steps: [
      {
        zh: "酒店 → 永庆坊、恩宁路骑楼 → 茶歇或午餐 → 沙面林荫街道与江边 → 返回酒店。",
        en: "Hotel → Yongqingfang and the Enning Road arcades → tea break or lunch → Shamian's tree-lined streets and riverside → back to the hotel.",
        ar: "الفندق ← يونغتشينغفانغ وأروقة شارع إن نينغ ← استراحة شاي أو غداء ← شوارع شاميان المظللة وضفة النهر ← العودة إلى الفندق.",
      },
      {
        zh: "天气热或觉得累，就只逛永庆坊，不要再加北京路或陈家祠。",
        en: "If it is hot or you are tired, do Yongqingfang only — do not add Beijing Road or the Chen Clan Hall on top.",
        ar: "إذا كان الجو حارًا أو شعرت بالتعب، اكتفِ بيونغتشينغفانغ ولا تضف شارع بكين أو قاعة عشيرة تشن.",
      },
    ],
    transport: {
      zh: "打车或按当天导航乘地铁；两处之间看体力选择步行或短途打车。从洲际到老城建议预留单程 45–75 分钟作为规划余量，出发时以导航为准；换住其他酒店后要重新计算。",
      en: "Taxi, or metro per the day's navigation; between the two spots walk or take a short taxi depending on energy. Allow 45–75 minutes one way from the InterContinental as planning slack, and check navigation when you set off; recalculate if you move hotels.",
      ar: "سيارة أجرة أو مترو حسب الملاحة؛ وبين الموقعين امشِ أو استقل سيارة قصيرة حسب طاقتك. احسب 45–75 دقيقة للاتجاه الواحد من الإنتركونتيننتال كهامش تخطيطي، وتحقق من الملاحة عند الانطلاق؛ وأعد الحساب إذا غيّرت الفندق.",
    },
    tickets: {
      zh: "本建议只安排室外街道散步。博物馆、故居、演出与游船都需要单独核实，不默认可以直接进入或已订票。街区临时管控以现场公告为准。",
      en: "This suggestion covers outdoor streets only. Museums, historic houses, performances and river cruises each need separate checking — none is assumed open or booked. Temporary street closures follow on-site notices.",
      ar: "يقتصر هذا الاقتراح على الشوارع في الهواء الطلق. أما المتاحف والبيوت التاريخية والعروض والرحلات النهرية فتحتاج تحققًا منفصلًا، ولا يُفترض أنها مفتوحة أو محجوزة. والإغلاقات المؤقتة حسب إعلانات الموقع.",
    },
    copy: [
      {
        id: "yongqingfang-addr",
        label: { zh: "永庆坊地址", en: "Yongqingfang address", ar: "عنوان يونغتشينغفانغ" },
        chinese: "永庆坊，广州市荔湾区恩宁路",
      },
      {
        id: "shamian-addr",
        label: { zh: "沙面地址", en: "Shamian address", ar: "عنوان شاميان" },
        chinese: "沙面，广州市荔湾区沙面大街",
      },
    ],
    sources: [
      {
        label: {
          zh: "荔湾区政府：永庆坊景区",
          en: "Liwan District government: Yongqingfang",
          ar: "حكومة منطقة ليوان: يونغتشينغفانغ",
        },
        url: "https://www.lw.gov.cn/zwgkk/gzjg/qjdbsc/dbj/hldb/content/mpost_9052456.html",
      },
      {
        label: {
          zh: "荔湾区政府：沙面人文景点资料",
          en: "Liwan District government: Shamian heritage notes",
          ar: "حكومة منطقة ليوان: معلومات تراث شاميان",
        },
        url: "https://www.lw.gov.cn/attachment/7/7813/7813682/10031492.pdf",
      },
    ],
  },
  {
    id: "huacheng",
    title: {
      zh: "花城广场 · 珠江夜景",
      en: "Huacheng Square · Pearl River skyline",
      ar: "ساحة هواتشنغ · أفق نهر اللؤلؤ ليلاً",
    },
    duration: {
      zh: "约 3–4 小时（规划参考，含交通、拍照与用餐）",
      en: "About 3–4 hours (planning estimate, including travel, photos and a meal)",
      ar: "نحو 3–4 ساعات (تقدير تخطيطي يشمل التنقل والتصوير ووجبة)",
    },
    bestFor: {
      zh: "傍晚，建议 17:00–21:00；巡店日期未定时，等当天结束后再决定",
      en: "Evening, suggested 17:00–21:00; on days when the store visit is still unscheduled, decide after it finishes",
      ar: "المساء، ويُقترح من 17:00 إلى 21:00؛ وفي الأيام التي لم تُحدَّد فيها جولة المتاجر، قرّر بعد انتهائها",
    },
    summary: {
      zh: "从花城广场看摩天楼与珠江夜色，远眺广州塔；散步、拍照就能感受现代广州。",
      en: "Skyscrapers, Pearl River lights and a view of Canton Tower from Huacheng Square. An easy evening of walking and photography.",
      ar: "ناطحات السحاب وأضواء نهر اللؤلؤ وإطلالة برج كانتون من ساحة هواتشنغ، في أمسية هادئة للمشي والتصوير.",
    },
    steps: [
      {
        zh: "酒店 → 花城广场 → 广州大剧院外观 → 广场南端远眺广州塔与珠江 → 自选晚餐或返回酒店。",
        en: "Hotel → Huacheng Square → the Opera House from outside → the south end of the square for Canton Tower and the river → optional dinner or back to the hotel.",
        ar: "الفندق ← ساحة هواتشنغ ← دار الأوبرا من الخارج ← الطرف الجنوبي للساحة لمشاهدة برج كانتون والنهر ← عشاء اختياري أو العودة إلى الفندق.",
      },
    ],
    transport: {
      zh: "打车到花城广场后步行；返程用已准备好的支付方式叫车。交通时间按当日导航。",
      en: "Taxi to Huacheng Square and walk from there; use your prepared payment method to call a car back. Travel time per the day's navigation.",
      ar: "استقل سيارة أجرة إلى ساحة هواتشنغ ثم تجوّل سيرًا؛ واستخدم وسيلة الدفع التي جهّزتها لطلب سيارة العودة. والزمن حسب الملاحة في حينه.",
    },
    tickets: {
      zh: "不把登广州塔、珠江游船或海心桥过桥当成默认项目 —— 这些要另外核时间、票务或预约。本路线也不承诺固定的灯光秀时间或建筑内部开放。",
      en: "Going up Canton Tower, a river cruise or crossing Haixin Bridge are not part of this route — each needs its own check on times, tickets or booking. No fixed light-show time or indoor opening is promised either.",
      ar: "صعود برج كانتون أو رحلة نهرية أو عبور جسر هايشين ليست ضمن هذا المسار — ويحتاج كل منها تحققًا خاصًا من الأوقات أو التذاكر أو الحجز. ولا يُوعد بموعد ثابت لعرض الأضواء أو بفتح المباني من الداخل.",
    },
    copy: [
      {
        id: "huacheng-addr",
        label: { zh: "花城广场地址", en: "Huacheng Square address", ar: "عنوان ساحة هواتشنغ" },
        chinese: "花城广场，广州市天河区珠江新城",
      },
    ],
    sources: [
      {
        label: {
          zh: "广州市政府：塔映花城",
          en: "Guangzhou municipal government: city night views",
          ar: "حكومة قوانغتشو: مناظر المدينة الليلية",
        },
        url: "https://www.gz.gov.cn/zlgz/gzly/wzgz/ycbj/content/mpost_10387324.html",
      },
    ],
  },
];

/* ------------------------------------------------------------------ */
/* 美食与文化（介绍，不作清真认证）                                     */
/* ------------------------------------------------------------------ */

export type FoodNote = { id: string; title: L10n; body: L10n; url?: string };

export const FOOD_NOTES: FoodNote[] = [
  {
    id: "morning-tea",
    title: { zh: "早茶", en: "Morning tea (yum cha)", ar: "شاي الصباح" },
    body: {
      zh: "一壶茶，几笼点心，坐一个上午。广州人管这叫「叹早茶」，叹就是慢慢享受的意思 —— 这是一件不该赶的事。点心一笼一笼点，吃完再加，留足 60 到 90 分钟。",
      en: "A pot of tea, a few steamer baskets, a whole morning at the table. Cantonese call it taan jou cha — taan meaning to savour slowly. It is not a thing to rush: order a basket at a time and add more as you go. Allow 60 to 90 minutes.",
      ar: "إبريق شاي، وبضع سلال بخار، وصباح كامل حول الطاولة. يسمّيها أهل كانتون «تان جاو تشا»، و«تان» أن تتمهّل وتتلذّذ — فهي ليست مما يُستعجل. اطلب سلة تلو الأخرى وزد كلما أردت، وخصّص لها من 60 إلى 90 دقيقة.",
    },
    url: "https://wglj.gz.gov.cn/gzdt/zwxx/content/post_10755149.html",
  },
  {
    id: "changfen",
    title: { zh: "肠粉", en: "Rice noodle rolls (changfen)", ar: "لفائف الأرز" },
    body: {
      zh: "米浆在蒸屉上摊成极薄的一张皮，卷上馅，淋一勺豉油。刚出锅的时候滑得几乎不用嚼。名字里那个「肠」说的是它卷起来的样子，不是肠子 —— 很多人第一次听都会愣一下。",
      en: "Rice batter is spread into a paper-thin sheet on the steamer, rolled around a filling and finished with a spoonful of soy. Straight out of the steamer it is so slippery you hardly chew. The chang in its name describes the roll, not intestines — the question comes up every time.",
      ar: "يُفرَد خليط الأرز طبقةً رقيقة كالورق فوق البخار، ثم يُلفّ حول الحشوة ويُسقى بملعقة صويا. وحين يخرج من البخار يكون من النعومة بحيث تكاد لا تمضغه. و«تشانغ» في اسمه تصف اللفّة لا الأمعاء — وهو سؤال يتكرر دائمًا.",
    },
    url: "https://www.gz.gov.cn/zlgz/whgz/content/post_9674292.html",
  },
  {
    id: "tingzai",
    title: { zh: "艇仔粥", en: "Sampan congee", ar: "عصيدة القوارب" },
    body: {
      zh: "从前珠江上住着一整群以船为家的人。他们撑着小艇在江面上卖粥，煮好了从船舷递到岸上或者另一条船上，所以叫艇仔粥。现在都在岸上的店里吃了，名字留了下来。",
      en: "The Pearl River once held a whole population who lived on their boats. They cooked congee on the water and passed the bowls up from sampan to shore — hence sampan congee. It is eaten in shops on dry land now, but the name stayed.",
      ar: "كان في نهر اللؤلؤ يومًا جماعةٌ كاملة تسكن قواربها. كانوا يطبخون العصيدة على الماء ويمدّون الأوعية من القارب إلى الضفة — ومن هنا جاء اسمها «عصيدة القوارب». تُؤكل اليوم في محال على البرّ، لكن الاسم بقي.",
    },
  },
  {
    id: "dessert",
    title: { zh: "甜品", en: "Desserts", ar: "الحلويات" },
    body: {
      zh: "姜撞奶值得专门去试一次：滚烫的牛奶冲进一碗姜汁，不搅不动，几分钟后整碗自己凝住，用勺子舀是一块一块的。还有双皮奶、绿豆沙、马蹄糕。广州人把这些统称「糖水」，多半是晚饭以后才去吃的事。",
      en: "Ginger milk curd is worth a trip on its own: scalding milk is poured onto a bowl of ginger juice, left alone, and a few minutes later the whole bowl has set firm enough to lift with a spoon. There is also double-skin milk, mung bean soup and water chestnut cake. Cantonese call all of it tong sui, sugar water, and it is mostly an after-dinner errand.",
      ar: "حليب الزنجبيل المخثّر وحده يستحق رحلة: يُصبّ الحليب المغلي على وعاء من عصير الزنجبيل ويُترك دون تحريك، فإذا به بعد دقائق قد تماسك حتى تستطيع رفعه بالملعقة. وهناك أيضًا حليب الطبقتين وحساء الفاصولياء الخضراء وكعكة كستناء الماء. ويسمّي أهل كانتون ذلك كله «تونغ سوي»، أي ماء السكر، وهو غالبًا مشوارُ ما بعد العشاء.",
    },
    url: "https://www.gz.gov.cn/zlgz/gzly/msgz/dxxc/content/post_7801857.html",
  },
  {
    id: "qilou",
    title: { zh: "骑楼是什么", en: "What is a qilou arcade", ar: "ما هي أروقة تشي لو" },
    body: {
      zh: "老城临街的房子把二楼往外挑出去，底下就空出一条有顶的走廊，一家接一家连成几百米 —— 这就是骑楼。广州又晒又多雨，走在骑楼底下可以一路不打伞。恩宁路一带成片，是看骑楼最好的地方。",
      en: "In the old city the upper floors are pushed out over the pavement, leaving a covered walkway underneath that runs from shopfront to shopfront for hundreds of metres — that is a qilou arcade. Guangzhou is hot and wet, and under the arcades you can walk for blocks without an umbrella. Enning Road has the best stretch of them.",
      ar: "في المدينة القديمة تبرز الطوابق العليا فوق الرصيف فيتشكّل تحتها ممرٌّ مسقوف يمتدّ من متجر إلى متجر مئات الأمتار — هذا هو رواق «تشي لو». وقوانغتشو حارّة ممطرة، وتحت هذه الأروقة تمشي أحياءً كاملة دون مظلّة. وأجمل امتدادٍ لها في شارع إن نينغ.",
    },
  },
];

/* ------------------------------------------------------------------ */
/* 清真与礼拜                                                          */
/*                                                                     */
/* 五人里四位是穆斯林，这是这趟最实际的一项生活需求。                   */
/* 纪律：清真寺按政府门户的地址与说明写；餐厅只写「是清真馆子」这个     */
/* 事实，不替任何一家做清真认证，营业时间标明来源与未核实。             */
/* ------------------------------------------------------------------ */

export type PlaceCard = {
  id: string;
  name: L10n;
  /** 一句话特点。 */
  note: L10n;
  /** 给司机看的中文地址。 */
  copy: CopyEntry;
  /** 开放 / 营业信息，允许写「未核实」。 */
  meta?: L10n;
  sources: { label: L10n; url: string }[];
};


/* ------------------------------------------------------------------ */
/* 这座城与阿拉伯世界                                                   */
/*                                                                     */
/* 四位埃及客人来广州，不只是来一座陌生的中国城市 —— 光塔路那一带      */
/* 一千三百年前就是阿拉伯商人的街区。这段该写在指南最前面。             */
/* 数字都出自政府门户：627 年、36 米、开元年间每年八十多万人次。         */
/* 宛葛素的身份按传统说法写，并注明史家有争议 —— 不拿宗教史当定论。      */
/* ------------------------------------------------------------------ */

export const CITY_STORY: { lead: L10n; paragraphs: L10n[]; sources: { label: L10n; url: string }[] } = {
  lead: {
    zh: "你们要去的地方，一千三百年前就有人从你们来的方向到过。",
    en: "People came to this city from your direction thirteen hundred years ago.",
    ar: "وصل إلى هذه المدينة أناسٌ من جهتكم قبل ألفٍ وثلاثمائة عام.",
  },
  paragraphs: [
    {
      zh: "唐贞观元年，公元 627 年，一位叫艾比·宛葛素的传教士到了广州。他和当时侨居在这里的阿拉伯商人一起出钱，建起了怀圣寺，以及寺旁那座三十六米高的光塔 —— 一座阿拉伯样式的砖塔。它到今天还立着，比广州城里几乎所有东西都老。",
      en: "In 627 AD a missionary named Abi Waqqas arrived in Guangzhou. Together with the Arab merchants already living here he paid for the building of Huaisheng Mosque and the thirty-six-metre light tower beside it — a brick minaret in Arab style. It is still standing, older than almost anything else in the city.",
      ar: "في عام 627 للميلاد وصل إلى قوانغتشو داعيةٌ يُدعى أبي وقاص. فتبرّع مع التجار العرب المقيمين هنا ببناء مسجد هوايشنغ والمنارة المجاورة له التي يبلغ ارتفاعها ستة وثلاثين مترًا — منارةٌ من الآجر على الطراز العربي. وهي قائمة إلى اليوم، أقدم من كل شيء تقريبًا في هذه المدينة.",
    },
    {
      zh: "那时的广州是海上丝绸之路的东方起点。官府在城西划出一片「蕃坊」给外商居住，相当于一条反过来的唐人街。开元年间，每年进出广州港的外国商人有八十多万人次，其中大多数是阿拉伯人。他们在这里做买卖、成家、盖清真寺、也把先人葬在这里。",
      en: "Guangzhou was then the eastern end of the Maritime Silk Road. The authorities set aside a quarter in the west of the city, the fanfang, for foreign traders — a Chinatown in reverse. In the Kaiyuan era the port saw more than eight hundred thousand foreign merchant arrivals a year, most of them Arab. They traded here, raised families, built mosques, and buried their dead here.",
      ar: "كانت قوانغتشو حينها الطرف الشرقي لطريق الحرير البحري. وخصّصت السلطات في غرب المدينة حيًّا للتجار الأجانب يُسمّى «فان فانغ» — حيٌّ صيني بالمقلوب. وفي عهد كاي يوان كان الميناء يستقبل أكثر من ثمانمائة ألف زيارة لتجار أجانب سنويًا، معظمهم من العرب. تاجروا هنا، وكوّنوا أسرًا، وبنوا المساجد، ودفنوا موتاهم في هذه الأرض.",
    },
    {
      zh: "中国的传统说法认为，宛葛素就是先知的门弟子赛尔德·本·艾比·宛葛素，是他把伊斯兰带到了中国。史家对这个身份一直有争议，但这个说法本身已经流传了很多个世纪 —— 他的墓，就是你们可以去的先贤古墓。",
      en: "Chinese tradition holds that this Abi Waqqas was Sa'd ibn Abi Waqqas, a companion of the Prophet, and that he brought Islam to China. Historians have long questioned the identification, but the tradition itself is many centuries old — and his tomb is the Xianxian Ancient Tomb you can visit.",
      ar: "يذهب التراث الصيني إلى أن أبا وقاص هذا هو سعد بن أبي وقاص، صحابي النبي، وأنه هو من حمل الإسلام إلى الصين. وقد شكّك المؤرخون طويلًا في صحة هذه النسبة، غير أن الرواية نفسها عمرها قرون — وقبره هو مقبرة شيان شيان التي يمكنكم زيارتها.",
    },
  ],
  sources: [
    {
      label: {
        zh: "广州市人民政府：重走海上丝绸之路",
        en: "Guangzhou municipal government: retracing the Maritime Silk Road",
        ar: "حكومة بلدية قوانغتشو: على خطى طريق الحرير البحري",
      },
      url: "https://www.gz.gov.cn/zlgz/gzly/lyxl/content/post_7730147.html",
    },
    {
      label: {
        zh: "广州市人民政府：海上丝绸之路的起点",
        en: "Guangzhou municipal government: the start of the Maritime Silk Road",
        ar: "حكومة بلدية قوانغتشو: نقطة انطلاق طريق الحرير البحري",
      },
      url: "https://www.gz.gov.cn/zlgz/whgz/content/post_8231821.html",
    },
  ],
};

export const MOSQUES: PlaceCard[] = [
  {
    id: "xianxian",
    name: {
      zh: "清真先贤古墓",
      en: "Xianxian Ancient Tomb Mosque",
      ar: "مقبرة شيان شيان ومسجدها",
    },
    note: {
      zh: "宛葛素就葬在这里，兰圃公园西边。把伊斯兰带到中国的那个人 —— 至少传统上是这么说的 —— 长眠在广州城北，已经一千多年。旁边 2010 年建的礼拜大殿能容下近 2500 人，是广东最大的；周五主麻来的人，大约九千。",
      en: "This is where Abi Waqqas lies, just west of Lanpu Park — the man who, by tradition at least, brought Islam to China, resting in the north of Guangzhou for more than a thousand years. The prayer hall built beside the tomb in 2010 holds nearly 2,500 people, the largest in Guangdong; about nine thousand come for Friday prayer.",
      ar: "هنا يرقد أبو وقاص، غربَ حديقة لانبو — الرجل الذي حمل الإسلام إلى الصين، وفق التراث على الأقل، راقدًا في شمال قوانغتشو منذ أكثر من ألف عام. وقاعة الصلاة التي بُنيت إلى جوار القبر عام 2010 تتّسع لنحو 2500 مصلٍّ، وهي الأكبر في قوانغدونغ؛ ويحضر صلاة الجمعة نحو تسعة آلاف.",
    },
    copy: {
      id: "xianxian-addr",
      label: {
        zh: "给司机看：清真先贤古墓",
        en: "Show the driver: Xianxian Ancient Tomb",
        ar: "أظهرها للسائق: مقبرة شيان شيان",
      },
      chinese: "请带我去清真先贤古墓，广州市越秀区解放北路901号之一。",
    },
    sources: [
      {
        label: {
          zh: "广州市人民政府：先贤古墓",
          en: "Guangzhou municipal government: Xianxian Ancient Tomb",
          ar: "حكومة بلدية قوانغتشو: مقبرة شيان شيان",
        },
        url: "https://www.gz.gov.cn/zlgz/gzly/wzgz/zjcs/yslj/content/post_7760215.html",
      },
    ],
  },
  {
    id: "huaisheng",
    name: {
      zh: "怀圣寺（光塔寺）",
      en: "Huaisheng Mosque (Guangta Mosque)",
      ar: "مسجد هوايشنغ (مسجد المنارة)",
    },
    note: {
      zh: "627 年，阿拉伯商人出钱建的，中国现存最早的清真寺之一。那座三十六米的光塔是阿拉伯样式，在这条街上站了快一千四百年，整座广州城比它老的东西几乎没有。寺门口就是光塔路，清真馆子都在这一带。",
      en: "Built in 627 with money from Arab merchants, one of the oldest surviving mosques in China. The thirty-six-metre light tower is Arab in form and has stood on this street for nearly fourteen hundred years — almost nothing in Guangzhou is older. Step out of the gate and you are on Guangta Road, where the halal restaurants are.",
      ar: "بُني عام 627 بأموال التجار العرب، وهو من أقدم المساجد الباقية في الصين. ومنارته البالغ ارتفاعها ستة وثلاثين مترًا عربية الطراز، قائمة في هذا الشارع منذ نحو أربعمائة وألف عام — ولا يكاد يوجد في قوانغتشو ما هو أقدم منها. وما إن تخرج من بابه حتى تكون في شارع قوانغتا حيث مطاعم الحلال.",
    },
    copy: {
      id: "huaisheng-addr",
      label: {
        zh: "给司机看：怀圣寺",
        en: "Show the driver: Huaisheng Mosque",
        ar: "أظهرها للسائق: مسجد هوايشنغ",
      },
      chinese: "请带我去怀圣寺（光塔寺），广州市越秀区光塔路56号。",
    },
    sources: [
      {
        label: {
          zh: "广东省人民政府：怀圣寺和光塔",
          en: "Guangdong provincial government: Huaisheng Mosque and the light tower",
          ar: "حكومة مقاطعة قوانغدونغ: مسجد هوايشنغ والمنارة",
        },
        url: "http://www.gd.gov.cn/zjgd/lyxx/lydt/content/post_73432.html",
      },
      {
        label: {
          zh: "越秀区人民政府：怀圣寺",
          en: "Yuexiu District government: Huaisheng Mosque",
          ar: "حكومة منطقة يوى شيو: مسجد هوايشنغ",
        },
        url: "https://www.yuexiu.gov.cn/zjyx/yxjd/zjwh/content/post_8665060.html",
      },
    ],
  },
  {
    id: "haopan",
    name: {
      zh: "濠畔清真寺",
      en: "Haopan Mosque",
      ar: "مسجد هاوبان",
    },
    note: {
      zh: "明朝建的，五百多年。它藏在濠畔街的日常巷子里，没有游客，来礼拜的多是住在附近的人。想安安静静待一会儿，来这座。",
      en: "Ming dynasty, more than five hundred years old. It sits in the ordinary lanes of Haopan Street with no tourists; most of those who pray here live nearby. Come to this one when you want somewhere quiet.",
      ar: "من عهد أسرة مينغ، وعمره أكثر من خمسمائة عام. يقع في أزقة شارع هاوبان العادية بلا سيّاح، ومعظم من يصلّون فيه من سكان الحي. تعالَ إلى هذا المسجد إن أردت مكانًا هادئًا.",
    },
    copy: {
      id: "haopan-addr",
      label: {
        zh: "给司机看：濠畔清真寺",
        en: "Show the driver: Haopan Mosque",
        ar: "أظهرها للسائق: مسجد هاوبان",
      },
      chinese: "请带我去濠畔清真寺，广州市越秀区濠畔街378号。",
    },
    sources: [
      {
        label: {
          zh: "广州市人民政府：濠畔清真寺",
          en: "Guangzhou municipal government: Haopan Mosque",
          ar: "حكومة بلدية قوانغتشو: مسجد هاوبان",
        },
        url: "https://www.gz.gov.cn/zlgz/gzly/wzgz/zjcs/yslj/content/post_7760218.html",
      },
    ],
  },
];

/** 9/25 是周五：唯一一个在广州的主麻日，而那天多数人是自由安排。 */
export const JUMUAH_NOTE: L10n = {
  zh: "9 月 25 日是这趟在广州唯一的周五。主麻的具体时间各寺不同，去之前先打电话或到寺里问当天时间。",
  en: "Friday 25 September is the only Friday of this stay in Guangzhou. Jumu'ah times differ by mosque — call ahead or ask at the mosque for that day's time.",
  ar: "الجمعة 25 سبتمبر هي الجمعة الوحيدة في هذه الإقامة بقوانغتشو. وتختلف مواقيت الجمعة بين المساجد، فاتصل مسبقًا أو اسأل في المسجد عن موعد ذلك اليوم.",
};

export const HALAL_DINING: PlaceCard[] = [
  {
    id: "huimin",
    name: {
      zh: "广州市回民饭店",
      en: "Guangzhou Hui Min Restaurant",
      ar: "مطعم قوانغتشو هوي مين",
    },
    note: {
      zh: "1956 年开的老字号，当年就是为在广州的穆斯林和回族开的，1975 年迁到现址。清真菜用粤菜的做法，牛肉烧麦、雪山牛肉包、羊杂汤是它的招牌。离怀圣寺很近。",
      en: "An old establishment opened in 1956 specifically to serve Muslims and Hui people in Guangzhou; it moved to this address in 1975. Halal cooking in the Cantonese manner — beef siumai, snow-top beef buns and mutton offal soup are what it is known for. Close to Huaisheng Mosque.",
      ar: "مطعم عريق افتُتح عام 1956 خصيصًا لخدمة المسلمين وقومية هوي في قوانغتشو، وانتقل إلى هذا العنوان عام 1975. طبخ حلال بالأسلوب الكانتوني، ويشتهر بسيوماي اللحم البقري وفطائر اللحم وشوربة أحشاء الضأن. وهو قريب من مسجد هوايشنغ.",
    },
    copy: {
      id: "huimin-addr",
      label: {
        zh: "给司机看：回民饭店",
        en: "Show the driver: Hui Min Restaurant",
        ar: "أظهرها للسائق: مطعم هوي مين",
      },
      chinese: "请带我去广州市回民饭店，广州市越秀区中山六路325号。",
    },
    meta: {
      zh: "点评网站挂的营业时间是 09:00–21:00、电话 020-81303991 —— 没有向店家核实，以当天现场为准。",
      en: "Listing sites give 09:00–21:00 and the phone 020-81303991 — not verified with the restaurant; go by what you find on the day.",
      ar: "تذكر مواقع الأدلة أن الدوام 09:00–21:00 والهاتف 020-81303991 — لم يُتحقَّق منها مع المطعم، فاعتمد على الواقع يوم زيارتك.",
    },
    sources: [
      {
        label: {
          zh: "维基百科：广州回民饭店",
          en: "Wikipedia: Guangzhou Hui Min Restaurant",
          ar: "ويكيبيديا: مطعم قوانغتشو هوي مين",
        },
        url: "https://zh.wikipedia.org/zh-hans/%E5%BB%A3%E5%B7%9E%E5%9B%9E%E6%B0%91%E9%A3%AF%E5%BA%97",
      },
    ],
  },
];

/** 别让人以为楼下就有清真餐 —— 位置这件事要先说清楚。 */
export const HALAL_WHERE: L10n[] = [
  {
    zh: "广州的清真馆子集中在越秀老城光塔路、中山六路一带，也就是怀圣寺周边。保利洲际在琶洲，隔着一段路，去要打车，按地址卡上的中文导航。",
    en: "Guangzhou's halal restaurants cluster in the old city around Guangta Road and Zhongshan Liu Road — the streets by Huaisheng Mosque. The InterContinental is out at Pazhou, a drive away; take a taxi using the Chinese address cards.",
    ar: "تتجمّع مطاعم الحلال في قوانغتشو داخل المدينة القديمة حول شارعي قوانغتا وتشونغشان الستة، أي في محيط مسجد هوايشنغ. أما فندق إنتركونتيننتال فيقع في بازو على مسافة، فاذهب بسيارة أجرة مستعينًا ببطاقات العناوين الصينية.",
  },
  {
    zh: "酒店能不能安排清真餐食，直接问前台或礼宾；这一页不代替酒店承诺任何事。",
    en: "Whether the hotel can arrange halal meals is a question for the front desk or concierge; this page does not promise anything on the hotel's behalf.",
    ar: "أما إمكانية تدبير وجبات حلال في الفندق فاسأل عنها الاستقبال أو الكونسيرج؛ وهذه الصفحة لا تَعِد بشيء نيابةً عن الفندق.",
  },
  {
    zh: "在任何餐厅点菜前，都用下面那几句中文问清食材和做法 —— 菜名里没有猪肉，不等于做法里没有猪油或酒。",
    en: "Before ordering anywhere, use the Chinese phrases below to ask about ingredients and cooking method — a dish without pork in its name may still be cooked with lard or wine.",
    ar: "وقبل الطلب في أي مطعم، استخدم العبارات الصينية أدناه للسؤال عن المكوّنات وطريقة الطهي — فالطبق الخالي من لحم الخنزير في اسمه قد يُطهى بشحمه أو بالخمر.",
  },
];

/* ------------------------------------------------------------------ */
/* 官方来源                                                            */
/* ------------------------------------------------------------------ */

export type OfficialLink = { id: string; title: L10n; note: L10n; url: string };

export const OFFICIAL_LINKS: OfficialLink[] = [
  {
    id: "hotel",
    title: {
      zh: "广州保利洲际酒店（IHG 官网）",
      en: "InterContinental Guangzhou Exhibition Center (IHG)",
      ar: "فندق إنتركونتيننتال قوانغتشو (IHG)",
    },
    note: {
      zh: "酒店地址、入住与退房时间的来源。",
      en: "Source for the hotel address and the check-in / check-out times.",
      ar: "مصدر عنوان الفندق ومواعيد الدخول والمغادرة.",
    },
    url: "https://www.ihg.com/intercontinental/hotels/cn/zh/guangzhou/canec/hoteldetail",
  },
  {
    id: "chatgpt-countries",
    title: {
      zh: "ChatGPT 支持的国家与地区（OpenAI 官方）",
      en: "ChatGPT supported countries (OpenAI)",
      ar: "الدول المدعومة في ChatGPT (من OpenAI)",
    },
    note: {
      zh: "中国大陆不在列表内，这是「不保证可用」的依据。",
      en: "Mainland China is not on the list — the basis for saying access is not guaranteed.",
      ar: "الصين ليست في القائمة، وهذا أساس القول بأن الوصول غير مضمون.",
    },
    url: "https://help.openai.com/en/articles/7947663-chatgpt-supported-countries",
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
];

/* ------------------------------------------------------------------ */
/* 底部参考图                                                          */
/* ------------------------------------------------------------------ */

export type ReferenceImage = { id: string; src: string; caption: L10n };

export const REFERENCE_IMAGES: ReferenceImage[] = [
  {
    id: "hq-notice",
    src: "/reference/hq-notice.png",
    caption: {
      zh: "总部总通知原件。本团实际安排以本页每天的表格为准。",
      en: "The original HQ general notice. This delegation's actual plan is the per-day table on this page.",
      ar: "الإشعار العام الأصلي من المقر. أما خطة هذا الوفد الفعلية فهي جدول كل يوم في هذه الصفحة.",
    },
  },
];
