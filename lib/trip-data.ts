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
        zh: "Chuck 提供 1 张中国 SIM 卡给 Mohamed，返程时归还。出发前先插卡，确认手机能识别这张卡。",
        en: "Chuck provides one China SIM card for Mohamed, to be returned after the trip. Insert it before departure and confirm the phone recognises the card.",
        ar: "يوفّر Chuck شريحة صينية واحدة لـ Mohamed تُعاد بعد الرحلة. ضعها في الهاتف قبل السفر وتأكد من أن الهاتف يتعرّف عليها.",
      },
      {
        zh: "抵达中国后测试本地流量是否正常。只有一张卡，如果两人的手机支持，可以由 Mohamed 开热点共享给 Ahmed，落地后一起测一次。",
        en: "After landing in China, test that local data works. There is only one card, so if both phones support it, Mohamed can share a hotspot with Ahmed — test that together once you arrive.",
        ar: "بعد الوصول إلى الصين، اختبر عمل بيانات الإنترنت المحلية. توجد شريحة واحدة فقط، فإن كان الهاتفان يدعمان ذلك يمكن لـ Mohamed مشاركة نقطة اتصال مع Ahmed — جرّبا ذلك معًا بعد الوصول.",
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
        zh: "出发前在手机上安装并配置 VPN 与 ChatGPT，用于翻译和现场求助，并在出发前测试一次。",
        en: "Before departure, install and set up a VPN and ChatGPT on your phone for translation and on-the-spot help, and test them once before you fly.",
        ar: "قبل السفر، ثبّت وأعدّ شبكة VPN وتطبيق ChatGPT على هاتفك للترجمة وطلب المساعدة، وجرّبهما مرة قبل المغادرة.",
      },
      {
        zh: "中国大陆不在 ChatGPT 官方支持地区之列，装了 VPN 也不保证一定可用。请同时准备可离线的中文翻译，以及本页可复制的中文地址与求助短句作为备选。",
        en: "Mainland China is not on ChatGPT's list of supported countries, and a VPN does not guarantee access. Also prepare an offline Chinese translation option, plus the copyable Chinese addresses and phrases on this page as a fallback.",
        ar: "الصين ليست ضمن قائمة الدول المدعومة لدى ChatGPT، ووجود VPN لا يضمن الوصول. جهّز أيضًا ترجمة صينية تعمل دون إنترنت، إضافة إلى العناوين والعبارات الصينية القابلة للنسخ في هذه الصفحة كبديل.",
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
        zh: "Chuck 会提供备用金。",
        en: "Chuck will provide a cash float.",
        ar: "سيوفّر Chuck مبلغًا احتياطيًا.",
      },
      {
        zh: "出发前确认支付宝已开通、备用金已到账，并完成一笔小额试付。",
        en: "Before departure, confirm Alipay is activated and the float has arrived, then make one small test payment.",
        ar: "قبل السفر، تأكد من تفعيل «أليباي» ووصول المبلغ الاحتياطي، ثم نفّذ دفعة تجريبية صغيرة.",
      },
      {
        zh: "同时带少量现金备用。",
        en: "Carry a small amount of cash as backup.",
        ar: "احمل مبلغًا نقديًا صغيرًا احتياطيًا.",
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
      zh: "茶、点心加聊天，是广州的生活方式，可以留 60–90 分钟慢慢吃。先问茶位费和份量再点。",
      en: "Tea, small dishes and conversation — a Guangzhou way of life. Allow 60–90 minutes. Ask about the tea charge and portion sizes before ordering.",
      ar: "شاي وأطباق صغيرة وحديث — أسلوب حياة في قوانغتشو. خصّص 60–90 دقيقة، واسأل عن رسم الشاي وأحجام الأطباق قبل الطلب.",
    },
    url: "https://wglj.gz.gov.cn/gzdt/zwxx/content/post_10755149.html",
  },
  {
    id: "changfen",
    title: { zh: "肠粉", en: "Rice noodle rolls (changfen)", ar: "لفائف الأرز" },
    body: {
      zh: "薄薄的米浆蒸皮包着馅料，「肠」不是肠子。常见猪肉、牛肉、鸡蛋、虾等；粥、点心也可能用猪肉、猪油或海鲜，馅料和酱料都要问清楚，名字不等于清真。",
      en: "A thin steamed rice sheet wrapped around a filling — the name does not mean intestines. Fillings are often pork, beef, egg or shrimp; congee and dim sum may also use pork, lard or seafood. Ask about fillings and sauces; a dish name is never a halal guarantee.",
      ar: "طبقة أرز مبخّرة رقيقة تلفّ الحشوة — والاسم لا يعني الأمعاء. الحشوات غالبًا لحم خنزير أو بقر أو بيض أو روبيان، وقد تستخدم العصيدة والديم سم لحم الخنزير أو شحمه أو المأكولات البحرية. اسأل عن الحشوة والصلصة؛ فاسم الطبق ليس ضمانًا للحلال.",
    },
    url: "https://www.gz.gov.cn/zlgz/whgz/content/post_9674292.html",
  },
  {
    id: "tingzai",
    title: { zh: "艇仔粥", en: "Sampan congee", ar: "عصيدة القوارب" },
    body: {
      zh: "和珠江上的水上人家有关，是讲广州故事的好例子。但名字里有「鱼 / 艇」不代表不含猪肉或就是清真，仍要问原料和做法。",
      en: "Linked to the boat-dwelling families of the Pearl River — a good story about Guangzhou. But a name mentioning fish or boats does not mean it is pork-free or halal; still ask about ingredients and preparation.",
      ar: "مرتبطة بأهل القوارب في نهر اللؤلؤ، وهي حكاية جميلة عن قوانغتشو. لكن ذكر السمك أو القوارب في الاسم لا يعني خلوّها من لحم الخنزير ولا أنها حلال؛ اسأل دائمًا عن المكوّنات وطريقة الإعداد.",
    },
  },
  {
    id: "dessert",
    title: { zh: "甜品", en: "Desserts", ar: "الحلويات" },
    body: {
      zh: "可以试姜撞奶、双皮奶、绿豆沙、马蹄糕。各店配料不同，奶、蛋、坚果或其他添加物仍要核对。这里只作介绍，不推荐具体店，也不承诺清真。",
      en: "Try ginger milk curd, double-skin milk, mung bean sweet soup or water chestnut cake. Recipes differ by shop, so check for milk, egg, nuts or other additions. This is background only — no specific shop is recommended and no halal claim is made.",
      ar: "جرّب حليب الزنجبيل المخثّر وحليب الطبقتين وحساء الفاصولياء الخضراء وكعكة كستناء الماء. تختلف الوصفات بين المحال، فتحقق من الحليب والبيض والمكسرات وغيرها. هذا تعريف فقط دون ترشيح محل بعينه ودون أي ادعاء بالحلال.",
    },
    url: "https://www.gz.gov.cn/zlgz/gzly/msgz/dxxc/content/post_7801857.html",
  },
  {
    id: "qilou",
    title: { zh: "骑楼是什么", en: "What is a qilou arcade", ar: "ما هي أروقة تشي لو" },
    body: {
      zh: "骑楼是沿街建筑下面那条有顶的走廊，遮阳挡雨，恩宁路一带可以看到。粤剧和手工艺是当地文化的一部分，但不保证当天一定有演出或作坊开放。",
      en: "A qilou is the covered walkway under the street-front buildings, shading you from sun and rain; Enning Road is a good place to see them. Cantonese opera and crafts are part of local life, but no performance or open workshop is guaranteed on any given day.",
      ar: "«تشي لو» ممر مسقوف أسفل المباني المطلّة على الشارع، يقي من الشمس والمطر، وشارع إن نينغ مكان جيد لمشاهدته. وأوبرا كانتون والحِرف جزء من الحياة المحلية، لكن لا ضمان لوجود عرض أو ورشة مفتوحة في يوم بعينه.",
    },
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
