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

/** audience 缺省 = 所有人都看。全员视图（?p=all）不筛，给统筹的人看全貌。 */
export type PrepItem = { id: string; title: L10n; lines: L10n[]; audience?: PersonId[] };

export const PREP: PrepItem[] = [
  {
    id: "sim",
    audience: ["ahmed", "hassan"],
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
    audience: ["ahmed", "hassan"],
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
    audience: ["ahmed", "hassan"],
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
    id: "reham-transfer",
    audience: ["reham"],
    title: {
      zh: "机场接送",
      en: "Airport transfers",
      ar: "التنقّل من المطار وإليه",
    },
    lines: [
      {
        zh: "去程 9/20 晚 21:20 到开罗 T3，MS958 次日 00:20 起飞，直飞广州 T3，15:30 落地。",
        en: "Outbound: be at Cairo T3 by 21:20 on 20 Sep; MS958 departs 00:20 the next morning, direct to Guangzhou T3, landing 15:30.",
        ar: "الذهاب: الوصول إلى صالة 3 بمطار القاهرة بحلول 21:20 يوم 20 سبتمبر؛ تقلع MS958 في 00:20 صباح اليوم التالي مباشرةً إلى صالة 3 بقوانغتشو، وتهبط 15:30.",
      },
      {
        zh: "广州往返机场的车由公司安排，对接人是 Rahma；车辆和出发时间还没定，定了以行程表为准。",
        en: "Transfers between the airport and the hotel in Guangzhou are arranged by the company; Rahma is your contact. Vehicle and pick-up times are not yet fixed — the itinerary will show them once they are.",
        ar: "تتولّى الشركة ترتيب التنقّل بين المطار والفندق في قوانغتشو، ومنسّقتك هي Rahma. لم تُحدَّد السيارة ومواعيد الانطلاق بعد — وسيظهر ذلك في جدول الرحلة حين يتقرّر.",
      },
      {
        zh: "回程 9/27 夜航 MS959，23:20 从广州 T3 起飞；当天退房后行李寄存或延迟退房还待确认。",
        en: "Return: MS959 on the night of 27 Sep, departing Guangzhou T3 at 23:20; whether the hotel holds your luggage or extends check-out that day is still to be confirmed.",
        ar: "العودة: MS959 ليلة 27 سبتمبر، تقلع من صالة 3 بقوانغتشو في 23:20؛ ولم يُؤكَّد بعد إن كان الفندق سيحفظ أمتعتك أو يمدّد موعد المغادرة ذلك اليوم.",
      },
    ],
  },
  {
    id: "reham-page",
    audience: ["reham"],
    title: {
      zh: "这一页怎么用",
      en: "How to use this page",
      ar: "كيف تستخدمين هذه الصفحة",
    },
    lines: [
      {
        zh: "「可复制的中文地址」和「中文短句」是给司机和店员看的：点开，把手机举给对方，不用会说中文。",
        en: "The Chinese addresses and phrases further down are for showing to drivers and staff: open one, hold up the phone, no Chinese needed.",
        ar: "العناوين والعبارات الصينية أدناه مخصّصة لعرضها على السائقين والعاملين: افتحيها وارفعي الهاتف، ولا حاجة إلى الصينية.",
      },
      {
        zh: "「礼拜与清真餐」里有三座清真寺和一家清真老字号的地址卡；9/25 周五是这趟唯一的主麻日。",
        en: "“Prayer and halal food” holds address cards for three mosques and one long-standing halal restaurant; Friday 25 Sep is the only Jumu'ah of the stay.",
        ar: "في قسم «الصلاة والطعام الحلال» بطاقات عناوين لثلاثة مساجد ومطعم حلال عريق؛ والجمعة 25 سبتمبر هي جمعة الإقامة الوحيدة.",
      },
      {
        zh: "免费行李额一节里有埃航商务舱的标准：票面 2 件托运，每件不超过 32 公斤。",
        en: "The baggage section has the EgyptAir business-class allowance: two checked bags on the ticket, each up to 32 kg.",
        ar: "في قسم الأمتعة مخصّص درجة رجال الأعمال على مصر للطيران: حقيبتان مسجّلتان حسب التذكرة، كل منهما حتى 32 كغ.",
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
/* 常见的文化差异                                                        */
/*                                                                     */
/* 用户要的：他们会遇到一些让他们困惑的点，先说在前面。                   */
/* 口吻是「这里的习惯是这样」，不是教训谁；每条都给一个当场能用的办法。   */
/* ------------------------------------------------------------------ */

export type CultureNote = { id: string; title: L10n; body: L10n };

export const CULTURE_NOTES: CultureNote[] = [
  {
    id: "friday",
    title: { zh: "周五是工作日", en: "Friday is a working day", ar: "الجمعة يوم عمل" },
    body: {
      zh: "中国的周末是周六和周日，周五照常上班上课，商场和写字楼没有礼拜安排。主麻要自己留出时间去清真寺，公共场所几乎没有祈祷室 —— 酒店房间是最稳妥的地方。",
      en: "China's weekend is Saturday and Sunday; Friday is an ordinary working day, and offices and malls make no allowance for prayer. Set aside time yourself for Jumu'ah at a mosque, and expect almost no prayer rooms in public places — your hotel room is the reliable option.",
      ar: "عطلة الأسبوع في الصين هي السبت والأحد؛ والجمعة يوم عمل عادي، ولا تُراعي المكاتب والمراكز التجارية أوقات الصلاة. خصّصوا الوقت بأنفسكم لصلاة الجمعة في المسجد، ولا تتوقّعوا وجود مصلّيات في الأماكن العامة — فغرفة الفندق هي الخيار المضمون.",
    },
  },
  {
    id: "halal-concept",
    title: { zh: "「清真」这个词很多人不懂", en: "Most people won't know what halal means", ar: "معظم الناس لا يعرفون معنى «حلال»" },
    body: {
      zh: "在广州，除了清真馆子，普通餐厅的店员大多不知道清真是什么，也不觉得猪油、料酒是需要说明的东西 —— 猪肉在这里是最普通的肉。所以要问的不是「是不是清真」，而是具体问「有没有猪肉、猪油、酒」，本页有现成的中文句子。",
      en: "Outside the halal restaurants, most staff in Guangzhou have never heard of halal and would not think to mention lard or cooking wine — pork is simply the everyday meat here. So the question to ask is not “is it halal” but the concrete one: does it contain pork, lard or alcohol. The Chinese sentence is ready on this page.",
      ar: "خارج مطاعم الحلال، لم يسمع معظم العاملين في قوانغتشو بكلمة «حلال»، ولن يخطر لهم ذكر شحم الخنزير أو نبيذ الطهي — فلحم الخنزير هنا هو اللحم اليومي العادي. لذا السؤال ليس «هل هو حلال» بل السؤال المحدّد: هل فيه لحم خنزير أو شحمه أو كحول. والجملة الصينية جاهزة في هذه الصفحة.",
    },
  },
  {
    id: "toast",
    title: { zh: "酒桌上怎么办", en: "When the toasts start", ar: "حين تبدأ الأنخاب" },
    body: {
      zh: "正式饭局上会有人举杯敬酒，这是表达尊重，不是逼你喝。不喝酒的人举起茶杯或水杯一起碰就行，说一句「我以茶代酒」—— 这是中国人自己也常用的说法，没有人会介意。",
      en: "At a formal dinner people will raise glasses to you; it is a mark of respect, not pressure to drink. Raise your tea or water instead and clink along — the phrase yi cha dai jiu, “tea in place of wine”, is one the Chinese use themselves, and nobody will mind.",
      ar: "في العشاء الرسمي سيرفع الناس أكوابهم لكم؛ وهذا تعبير عن الاحترام لا إلزامٌ بالشرب. ارفعوا كوب الشاي أو الماء وقرعوا به الأكواب — وعبارة «يي تشا داي جيو» أي «الشاي بدل النبيذ» يستخدمها الصينيون أنفسهم، ولن يمانع أحد.",
    },
  },
  {
    id: "no-tip",
    title: { zh: "不用给小费", en: "No tipping", ar: "لا إكراميات" },
    body: {
      zh: "餐厅、出租车、酒店都不收小费，给了对方反而会不知所措，有时会追出来还给你。账单是多少就付多少。",
      en: "Restaurants, taxis and hotels do not take tips; offering one causes confusion, and sometimes the person will chase after you to hand it back. The bill is the bill.",
      ar: "لا تقبل المطاعم وسيارات الأجرة والفنادق الإكراميات؛ وتقديمها يُربك الطرف الآخر، وقد يلحق بكم أحيانًا ليردّها. الفاتورة هي الفاتورة.",
    },
  },
  {
    id: "phone-pay",
    title: { zh: "钱在手机里", en: "Money lives in the phone", ar: "المال في الهاتف" },
    body: {
      zh: "这里几乎所有人用手机付钱：支付宝或微信，扫一下二维码。小店可能找不开大额现金，出租车也更习惯扫码。收款方式有两种 —— 店家扫你手机上的码，或者你扫店家贴出来的码，看对方手势就知道。",
      en: "Almost everyone here pays by phone — Alipay or WeChat, one scan of a QR code. Small shops may not have change for large notes and taxi drivers prefer to scan. It works two ways: the shop scans the code on your phone, or you scan the code the shop has put up — follow whichever way they gesture.",
      ar: "يدفع الجميع هنا تقريبًا بالهاتف — «أليباي» أو «وي تشات»، بمسح رمز QR واحد. وقد لا تملك المتاجر الصغيرة فكّة للأوراق الكبيرة، ويفضّل سائقو الأجرة المسح. ويتمّ بطريقتين: يمسح المتجر الرمز على هاتفكم، أو تمسحون الرمز المعلّق في المتجر — اتّبعوا إشارة الطرف الآخر.",
    },
  },
  {
    id: "handshake",
    title: { zh: "握手与称呼", en: "Handshakes and names", ar: "المصافحة والأسماء" },
    body: {
      zh: "商务场合男女之间握手很普通。不方便握手的话，点头微笑、手放在胸口，对方会明白，不会觉得失礼。称呼上，中国人姓在前名在后；不确定怎么叫时，用「姓 + 总」或「姓 + 经理」最稳妥。",
      en: "In business settings men and women shake hands as a matter of course. If you would rather not, a nod and a smile with a hand to the chest is understood and not taken as rude. Chinese names put the family name first; when unsure, family name plus zong (boss) or jingli (manager) is the safe form.",
      ar: "في المواقف التجارية يتصافح الرجال والنساء بشكل اعتيادي. وإن لم ترغبوا، فإيماءة وابتسامة مع وضع اليد على الصدر مفهومة ولا تُعدّ جفاءً. وتأتي الأسماء الصينية باسم العائلة أولًا؛ وعند الشك، فاسم العائلة مع «تسونغ» (رئيس) أو «جينغلي» (مدير) هو الصيغة الآمنة.",
    },
  },
  {
    id: "personal-questions",
    title: { zh: "有些问题不是冒犯", en: "Some questions are not prying", ar: "بعض الأسئلة ليست فضولًا" },
    body: {
      zh: "初次见面就问你多大、结婚没有、有几个孩子、住哪里，在中国是拉近距离的闲聊，不是打探。不想答就笑着带过，没人会追问。同样，「吃了吗」是打招呼，不是真的要请你吃饭。",
      en: "Being asked on first meeting how old you are, whether you are married, how many children you have or where you live is friendly small talk in China, not interrogation. Smile past anything you would rather not answer; nobody will press. Likewise “have you eaten?” is a greeting, not an invitation.",
      ar: "أن يسألوكم في أول لقاء عن العمر والزواج وعدد الأولاد ومكان السكن هو دردشة ودّية في الصين لا استجواب. تجاوزوا بابتسامة ما لا تودّون الإجابة عنه؛ ولن يُلحّ أحد. وكذلك «هل أكلت؟» تحية لا دعوة.",
    },
  },
  {
    id: "table",
    title: { zh: "饭桌上的规矩", en: "At the table", ar: "على المائدة" },
    body: {
      zh: "菜放在转盘上大家共享，转的时候看一眼别人是否正在夹菜。有的餐厅备「公筷」专门夹菜到自己碗里。主人先动筷再开始；筷子不要竖插在饭里。吃不惯的东西留在盘里没关系，没人会介意。",
      en: "Dishes sit on a turntable and are shared; glance before you turn it, in case someone is mid-reach. Some restaurants provide serving chopsticks for moving food to your bowl. Wait for the host to start; never stand chopsticks upright in rice. Leaving something you do not care for is perfectly fine.",
      ar: "توضع الأطباق على قرص دوّار ويتشاركها الجميع؛ انظروا قبل تدويره لئلا يكون أحد ممتدّ اليد. وتوفّر بعض المطاعم عيدانًا مخصّصة لنقل الطعام إلى الوعاء. انتظروا المضيف ليبدأ؛ ولا تغرزوا العيدان عمودية في الأرز. وترك ما لا تستسيغونه في الطبق أمر طبيعي تمامًا.",
    },
  },
  {
    id: "photos-stares",
    title: { zh: "被拍照、被看", en: "Photos and stares", ar: "التصوير والنظرات" },
    body: {
      zh: "在不常见外国人的地方，有人盯着看、甚至举手机拍你，是好奇，不是敌意。不想被拍就摆摆手，对方通常会收起来。",
      en: "Where foreigners are rare, people may stare or even raise a phone to photograph you. It is curiosity, not hostility. A wave of the hand if you would rather not is usually enough.",
      ar: "حيث يندر الأجانب، قد يحدّق بكم بعضهم أو يرفعون الهاتف لتصويركم. إنه فضول لا عداء. وإشارة باليد إن لم تودّوا ذلك تكفي عادةً.",
    },
  },
  {
    id: "soft-no",
    title: { zh: "「再研究一下」常常是「不」", en: "“Let us look into it” often means no", ar: "«سندرس الأمر» تعني غالبًا «لا»" },
    body: {
      zh: "中国人不太当面说「不行」。「我们再研究一下」「回头再说」「有点困难」这类话，多数时候是委婉的拒绝。听到这些，别等回音，换个方案再谈。反过来，如果对方直接给日期、给人名，那才是真的定了。",
      en: "Chinese rarely say a flat no to your face. “We'll look into it”, “let's talk later”, “that is a little difficult” are, most of the time, polite refusals. When you hear them, do not wait for a follow-up; come back with a different proposal. Conversely, when someone gives you a date and a name, that is when a thing is really settled.",
      ar: "نادرًا ما يقول الصينيون «لا» صريحة في وجهكم. فعبارات «سندرس الأمر» و«نتحدث لاحقًا» و«الأمر صعب قليلًا» هي في الغالب رفض مهذّب. حين تسمعونها فلا تنتظروا ردًّا؛ عودوا باقتراح مختلف. وبالمقابل، حين يعطيكم أحدهم تاريخًا واسمًا فعندها يكون الأمر قد تقرّر فعلًا.",
    },
  },
  {
    id: "punctual",
    title: { zh: "时间就是那个时间", en: "The time means the time", ar: "الموعد هو الموعد" },
    body: {
      zh: "会议、接送、餐叙写几点就是几点，一般不会「弹性半小时」。提前五分钟到是常态；要迟到就先发消息说一声。",
      en: "Meetings, pick-ups and dinners start at the stated time; there is no customary half-hour grace. Arriving five minutes early is normal, and if you will be late, a message ahead is expected.",
      ar: "تبدأ الاجتماعات والمواعيد والعشاءات في الوقت المكتوب؛ ولا يوجد نصف ساعة سماح متعارف عليه. والوصول قبل الموعد بخمس دقائق أمر عادي، وإن كنتم ستتأخرون فيُتوقَّع منكم إرسال رسالة مسبقًا.",
    },
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
    id: "huacheng",
    title: {
      zh: "花城广场 · 新中轴线（必去）",
      en: "Huacheng Square · the new central axis (do not miss)",
      ar: "ساحة هواتشنغ · المحور المركزي الجديد (لا تفوّتوها)",
    },
    duration: {
      zh: "傍晚到夜里，约 3 小时（规划参考）",
      en: "Late afternoon into night, about 3 hours (planning estimate)",
      ar: "من العصر إلى الليل، نحو 3 ساعات (تقدير تخطيطي)",
    },
    bestFor: {
      zh: "天黑前一小时到，看着城市亮起来。这是广州最想给你看的一面。",
      en: "Arrive an hour before dark and watch the city light up. This is the face Guangzhou most wants you to see.",
      ar: "اصلوا قبل الغروب بساعة وشاهدوا المدينة تُضاء. هذا هو الوجه الذي تريد قوانغتشو أن تروه.",
    },
    summary: {
      zh: "五十六公顷的市民广场，是广州最大的一片；两边是东塔（周大福金融中心，530 米，116 层）和西塔（国际金融中心，四百多米），正前方隔江就是 600 米的广州塔。广场上还有扎哈·哈迪德设计的广州大剧院 —— 她是伊拉克裔 —— 和广州图书馆、广东省博物馆。地下整片是花城汇商场，和各座塔楼地下相通。",
      en: "A fifty-six-hectare civic square, the largest in Guangzhou. On either side stand the East Tower (CTF Finance Centre, 530 m, 116 floors) and the West Tower (International Finance Centre, over four hundred metres); straight ahead across the river is the 600-metre Canton Tower. On the square itself are the Guangzhou Opera House by Zaha Hadid — Iraqi-born — the city library and the Guangdong Museum. Beneath it all runs the Huacheng Hui mall, linked underground to the towers.",
      ar: "ساحة مدنية مساحتها ستة وخمسون هكتارًا، هي الأكبر في قوانغتشو. على جانبيها يقوم البرج الشرقي (مركز CTF المالي، 530 مترًا، 116 طابقًا) والبرج الغربي (مركز المال الدولي، أكثر من أربعمئة متر)؛ وأمامكم مباشرة عبر النهر برج كانتون البالغ 600 متر. وفي الساحة نفسها دار أوبرا قوانغتشو من تصميم زها حديد — العراقية المولد — ومكتبة المدينة ومتحف قوانغدونغ. وتحت ذلك كله يمتدّ مركز هواتشنغ هوي التجاري المتصل بالأبراج تحت الأرض.",
    },
    steps: [
      {
        zh: "酒店 → 花城广场北端（广州图书馆 / 大剧院一侧）→ 沿中轴往南走到海心沙 → 江边看广州塔亮灯 → 返回酒店。",
        en: "Hotel → north end of Huacheng Square (library / opera house side) → walk south along the axis to Haixinsha → watch the Canton Tower light up from the riverbank → back to the hotel.",
        ar: "الفندق ← الطرف الشمالي لساحة هواتشنغ (جهة المكتبة ودار الأوبرا) ← المشي جنوبًا على المحور حتى هايشينشا ← مشاهدة إضاءة برج كانتون من ضفة النهر ← العودة إلى الفندق.",
      },
      {
        zh: "步行约一个半小时，其余留给拍照和地下商场。",
        en: "About an hour and a half on foot; the rest for photographs and the mall below.",
        ar: "نحو ساعة ونصف سيرًا، والباقي للتصوير والمركز التجاري تحت الأرض.",
      },
    ],
    transport: {
      zh: "从保利洲际打车过江即到；换住其他酒店后以实际地址导航为准。",
      en: "A short taxi ride across the river from the InterContinental; from any other hotel, go by the actual address in your navigation app.",
      ar: "رحلة أجرة قصيرة عبر النهر من الإنتركونتيننتال؛ ومن أي فندق آخر اعتمدوا على العنوان الفعلي في تطبيق الملاحة.",
    },
    tickets: {
      zh: "广场、海心沙江边免费。大剧院、图书馆、博物馆的开放时间未核实，以官方当日公告为准。",
      en: "The square and the Haixinsha riverbank are free. Opening hours of the opera house, library and museum are not verified — follow each venue's own notice for the day.",
      ar: "الساحة وضفة هايشينشا مجانيتان. مواعيد دار الأوبرا والمكتبة والمتحف غير مُتحقَّق منها — اتبعوا إعلان كل جهة ليومها.",
    },
    copy: [
      {
        id: "huacheng-addr",
        label: { zh: "给司机看：花城广场", en: "Show the driver: Huacheng Square", ar: "أظهرها للسائق: ساحة هواتشنغ" },
        chinese: "请带我去花城广场，广州市天河区珠江新城。",
      },
    ],
    sources: [
      {
        label: { zh: "广州市政府：广州最大市民广场花城广场", en: "Guangzhou government: Huacheng Square, the city's largest civic square", ar: "حكومة قوانغتشو: ساحة هواتشنغ أكبر ساحة مدنية" },
        url: "https://www.gz.gov.cn/zlgz/wlzx/content/post_2834707.html",
      },
      {
        label: { zh: "国资委：广州周大福金融中心（东塔）", en: "SASAC: Guangzhou CTF Finance Centre (East Tower)", ar: "لجنة إدارة أصول الدولة: مركز CTF المالي (البرج الشرقي)" },
        url: "http://www.sasac.gov.cn/n4470048/n8456886/n9678798/n9678803/n9734521/c9767336/content.html",
      },
    ],
  },
  {
    id: "canton-tower",
    title: {
      zh: "登广州塔",
      en: "Up the Canton Tower",
      ar: "الصعود إلى برج كانتون",
    },
    duration: {
      zh: "约 2 小时（规划参考，含排队）",
      en: "About 2 hours (planning estimate, including queues)",
      ar: "نحو ساعتين (تقدير تخطيطي يشمل الانتظار)",
    },
    bestFor: {
      zh: "想一次看清这座城有多大，就上去。傍晚上去能同时看到白天和夜景。",
      en: "If you want to grasp the size of this city in one look, go up. Late afternoon gives you daylight and the night view in one visit.",
      ar: "إن أردتم إدراك حجم هذه المدينة بنظرة واحدة فاصعدوا. والعصر يمنحكم مشهد النهار والليل في زيارة واحدة.",
    },
    summary: {
      zh: "六百米，世界第二高的塔，就在你们住的海珠区。塔身是细腰的双曲面钢网，晚上整座塔换色。观景层在四百多米，塔顶还有一圈高空摩天轮。",
      en: "Six hundred metres, the second-tallest tower in the world, in your own district of Haizhu. Its waisted hyperboloid steel mesh changes colour at night. The observation decks are above four hundred metres, and there is a ring of ferris-wheel cabins near the top.",
      ar: "ستمئة متر، ثاني أعلى برج في العالم، في منطقتكم هايتشو. هيكله الفولاذي الشبكي ذو الخصر النحيل يغيّر لونه ليلًا. ومنصّات المشاهدة فوق أربعمئة متر، وقرب القمة حلقة من مقصورات دولاب هواء.",
    },
    steps: [
      {
        zh: "酒店 → 广州塔 → 观景层 → 出来沿江走到对岸看回来的角度 → 返回。",
        en: "Hotel → Canton Tower → observation deck → afterwards, walk the riverbank for the view of the tower itself → back.",
        ar: "الفندق ← برج كانتون ← منصة المشاهدة ← ثم المشي على ضفة النهر لرؤية البرج نفسه ← العودة.",
      },
    ],
    transport: {
      zh: "和酒店同在海珠区，打车很近；也可以和花城广场排在同一个晚上，一江之隔。",
      en: "Same district as the hotel, a short taxi ride; it pairs naturally with Huacheng Square on the same evening, one river apart.",
      ar: "في منطقة الفندق نفسها، رحلة أجرة قصيرة؛ ويمكن جمعه مع ساحة هواتشنغ في المساء نفسه، فبينهما النهر فقط.",
    },
    tickets: {
      zh: "登塔收费，票价与各层开放时间未核实，以广州塔官方为准；旺季建议提前买票。",
      en: "Admission is charged; prices and opening hours for each level are not verified — go by the tower's official channels, and buy ahead in busy periods.",
      ar: "الدخول برسوم؛ والأسعار ومواعيد كل طابق غير مُتحقَّق منها — اعتمدوا على القنوات الرسمية للبرج، واشتروا التذاكر مسبقًا في المواسم المزدحمة.",
    },
    copy: [
      {
        id: "canton-tower-addr",
        label: { zh: "给司机看：广州塔", en: "Show the driver: Canton Tower", ar: "أظهرها للسائق: برج كانتون" },
        chinese: "请带我去广州塔，广州市海珠区阅江西路222号。",
      },
    ],
    sources: [
      {
        label: { zh: "海珠区政府：广州塔", en: "Haizhu District government: Canton Tower", ar: "حكومة منطقة هايتشو: برج كانتون" },
        url: "https://www.haizhu.gov.cn/zjhz/lyck/content/post_7765705.html",
      },
    ],
  },
  {
    id: "river-cruise",
    title: {
      zh: "珠江夜游",
      en: "Pearl River night cruise",
      ar: "جولة ليلية في نهر اللؤلؤ",
    },
    duration: {
      zh: "船程约 60 分钟，前后约 2 小时（规划参考）",
      en: "About 60 minutes on the water, around 2 hours door to door (planning estimate)",
      ar: "نحو 60 دقيقة على الماء، وقرابة ساعتين من الباب إلى الباب (تقدير تخطيطي)",
    },
    bestFor: {
      zh: "坐着不动，把广州塔、海心沙、珠江两岸的灯光一次看完。适合一天结束的时候。",
      en: "Sit still and take in the Canton Tower, Haixinsha and both lit banks in one pass. Good at the end of a day.",
      ar: "اجلسوا وشاهدوا برج كانتون وهايشينشا والضفتين المضاءتين في جولة واحدة. مناسب لختام اليوم.",
    },
    summary: {
      zh: "船从老城江边出发，往东开到广州塔、海心沙一带再回来。大沙头是最大的游船码头，天字码头是广州用得最久的码头，有两百七十多年。",
      en: "Boats leave from the old-city waterfront, run east past the Canton Tower and Haixinsha and return. Dashatou is the largest cruise pier; Tianzi Pier is the oldest still in use, some two hundred and seventy years.",
      ar: "تنطلق القوارب من واجهة المدينة القديمة، وتتجه شرقًا متجاوزة برج كانتون وهايشينشا ثم تعود. رصيف داشاتو أكبر أرصفة الجولات، ورصيف تيانزي أقدمها المستخدمة، وعمره نحو مئتين وسبعين عامًا.",
    },
    steps: [
      {
        zh: "酒店 → 大沙头码头或天字码头 → 上船约 60 分钟 → 返回酒店。",
        en: "Hotel → Dashatou or Tianzi Pier → about 60 minutes aboard → back to the hotel.",
        ar: "الفندق ← رصيف داشاتو أو تيانزي ← نحو 60 دقيقة على متن القارب ← العودة إلى الفندق.",
      },
    ],
    transport: {
      zh: "打车到码头。以实际地址导航为准。",
      en: "Taxi to the pier; go by the actual address in your navigation app.",
      ar: "سيارة أجرة إلى الرصيف؛ اعتمدوا على العنوان الفعلي في تطبيق الملاحة.",
    },
    tickets: {
      zh: "船票收费，班次与票价未核实，以码头当日公告为准。",
      en: "Tickets are charged; departures and prices are not verified — follow the pier's notice on the day.",
      ar: "التذاكر برسوم؛ والمواعيد والأسعار غير مُتحقَّق منها — اتبعوا إعلان الرصيف في اليوم نفسه.",
    },
    copy: [
      {
        id: "dashatou-addr",
        label: { zh: "给司机看：大沙头码头", en: "Show the driver: Dashatou Pier", ar: "أظهرها للسائق: رصيف داشاتو" },
        chinese: "请带我去大沙头游船码头，广州市越秀区沿江东路466号。",
      },
      {
        id: "tianzi-addr",
        label: { zh: "给司机看：天字码头", en: "Show the driver: Tianzi Pier", ar: "أظهرها للسائق: رصيف تيانزي" },
        chinese: "请带我去天字码头，广州市越秀区沿江中路200号。",
      },
    ],
    sources: [
      {
        label: { zh: "广州本地宝：珠江夜游码头", en: "Guangzhou Bendibao: Pearl River cruise piers", ar: "قوانغتشو بنديباو: أرصفة جولات نهر اللؤلؤ" },
        url: "http://gz.bendibao.com/tour/2024724/ly351887.shtml",
      },
    ],
  },
  {
    id: "tianhe",
    title: {
      zh: "天河路 · 太古汇（看这座城怎么买东西）",
      en: "Tianhe Road · Taikoo Hui (how this city shops)",
      ar: "شارع تيانخه · تايكو هوي (كيف تتسوّق هذه المدينة)",
    },
    duration: {
      zh: "半天，约 3–4 小时（规划参考）",
      en: "Half a day, about 3–4 hours (planning estimate)",
      ar: "نصف يوم، نحو 3–4 ساعات (تقدير تخطيطي)",
    },
    bestFor: {
      zh: "做零售的人一定要看：这是华南第一商圈。",
      en: "Anyone in retail has to see it: the number-one shopping district in South China.",
      ar: "على كل من يعمل في التجزئة أن يراه: منطقة التسوّق الأولى في جنوب الصين.",
    },
    summary: {
      zh: "两点八公里长的一条路，二百四十万平方米商业面积，一天一百五十万人，一年八亿人次、销售额过万亿元；2024 年全国商圈排名第三，高端品牌数量全国第一。太古汇、正佳广场、天河城、天环都在这一条路上，地下由地铁和通道连成一片。",
      en: "A road 2.8 kilometres long carrying 2.4 million square metres of retail, a million and a half people a day, eight hundred million a year and over a trillion yuan in sales; third among China's shopping districts in the 2024 ranking and first for high-end brands. Taikoo Hui, Grandview, Teemall and Parc Central all stand on it, joined underground by metro and walkways.",
      ar: "طريق طوله 2.8 كيلومتر يضمّ 2.4 مليون متر مربع من المساحات التجارية، ويستقبل مليونًا ونصف المليون شخص يوميًا وثمانمئة مليون سنويًا بمبيعات تتجاوز تريليون يوان؛ الثالث بين مناطق التسوّق في الصين في تصنيف 2024 والأول في العلامات الفاخرة. وعليه تقوم تايكو هوي وغراندفيو وتيمول وبارك سنترال، متصلة تحت الأرض بالمترو والممرات.",
    },
    steps: [
      {
        zh: "酒店 → 太古汇 → 沿天河路走到正佳广场、天河城 → 天环 → 返回。",
        en: "Hotel → Taikoo Hui → along Tianhe Road to Grandview and Teemall → Parc Central → back.",
        ar: "الفندق ← تايكو هوي ← على شارع تيانخه إلى غراندفيو وتيمول ← بارك سنترال ← العودة.",
      },
    ],
    transport: {
      zh: "打车到太古汇即可，几家商场之间步行或走地下通道。",
      en: "Taxi to Taikoo Hui; the malls are linked on foot and by underground walkways.",
      ar: "سيارة أجرة إلى تايكو هوي؛ والمراكز متصلة سيرًا وبالممرات تحت الأرض.",
    },
    tickets: {
      zh: "商场免费。营业时间未核实，以各商场公告为准。",
      en: "The malls are free to enter. Opening hours are not verified — go by each mall's own notice.",
      ar: "دخول المراكز مجاني. ومواعيد العمل غير مُتحقَّق منها — اعتمدوا على إعلان كل مركز.",
    },
    copy: [
      {
        id: "taikoo-addr",
        label: { zh: "给司机看：太古汇", en: "Show the driver: Taikoo Hui", ar: "أظهرها للسائق: تايكو هوي" },
        chinese: "请带我去太古汇，广州市天河区天河路383号。",
      },
    ],
    sources: [
      {
        label: { zh: "天河区政府：天河路商圈", en: "Tianhe District government: the Tianhe Road district", ar: "حكومة منطقة تيانخه: منطقة شارع تيانخه" },
        url: "http://www.thnet.gov.cn/zjth/tzth/zlpt/content/post_9126462.html",
      },
    ],
  },
  {
    id: "xiguan",
    title: {
      zh: "沙面 · 与西关骑楼",
      en: "Shamian · and the Xiguan arcades",
      ar: "شاميان · وأروقة شيغوان",
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
    id: "soup",
    title: { zh: "老火靓汤", en: "Slow-fired soup", ar: "الحساء البطيء" },
    body: {
      zh: "广东人家里的汤是煲出来的：一锅水，几样材料，小火两三个小时，直到汤色变浓、味道全出来。饭桌上第一件事是喝汤，不是吃饭。「饮咗汤未」—— 喝过汤了吗 —— 是广东人的问候语，跟问你吃了没一个意思。",
      en: "In a Cantonese home, soup is not made, it is fired: a pot of water, a few ingredients, two or three hours over a low flame until the broth turns deep and everything has given up its flavour. The first thing at the table is the soup, before the rice. “Have you had your soup?” is how Cantonese ask after you — it means the same as asking whether you have eaten.",
      ar: "في البيت الكانتوني لا يُعدّ الحساء بل يُوقد: قِدر ماء، وبضعة مكوّنات، وساعتان أو ثلاث على نارٍ هادئة حتى يغمق المرق وتبذل المكوّنات كل نكهتها. وأول ما يُقدَّم على المائدة الحساء، قبل الأرز. و«هل شربتَ حساءك؟» هي طريقة الكانتونيين في السؤال عن حالك — وتعني ما تعنيه «هل أكلت؟».",
    },
  },
  {
    id: "chaoshan-beef",
    title: { zh: "潮汕牛肉火锅", en: "Chaoshan beef hotpot", ar: "هوت بوت اللحم البقري على طريقة تشاوشان" },
    body: {
      zh: "一锅清汤，几盘按部位切好的牛肉，涮几秒就吃。规矩是牛必须当天现宰，冻肉不能用；一头牛只有三分之一的部位够格上桌，其余的打成手打牛肉丸。菜单上会看到「吊龙」「匙柄」这些名字 —— 都是部位，一头牛只有两条匙柄。这是广东最适合你们的一顿：全是牛肉，清汤，自己涮。",
      en: "A pot of clear broth and a few plates of beef sliced by cut, dipped for seconds and eaten. The rule is that the animal is slaughtered that day — frozen beef is not allowed — and only a third of it is judged good enough for the table; the rest is pounded into beef balls. The menu lists cuts like diaolong and chibing, the “spoon handle”, of which a cow has just two. Of all Guangdong's meals this is the one most suited to you: all beef, clear soup, cooked by your own hand.",
      ar: "قِدر مرقٍ صافٍ وبضعة أطباق من لحم البقر مقطّعة حسب الجزء، تُغمس ثوانيَ ثم تُؤكل. والقاعدة أن تُذبح البقرة في اليوم نفسه — فاللحم المجمّد ممنوع — ولا يُعدّ سوى ثلثها صالحًا للمائدة؛ والباقي يُدقّ كراتِ لحم. وتجد في القائمة أسماء أجزاء مثل «دياولونغ» و«تشيبينغ» أي «مقبض الملعقة»، وليس في البقرة منه سوى اثنين. ومن بين أطباق قوانغدونغ كلّها هذا أنسبها لكم: لحم بقر كلّه، ومرق صافٍ، وتطهونه بأيديكم.",
    },
    url: "https://zh.wikipedia.org/zh-hans/%E6%BD%AE%E6%B1%95%E7%89%9B%E8%82%89%E7%81%AB%E9%94%85",
  },
  {
    id: "white-cut-chicken",
    title: { zh: "白切鸡", en: "White-cut chicken", ar: "الدجاج المسلوق الكانتوني" },
    body: {
      zh: "整只鸡在将开未开的水里浸熟，捞出来过冷水，皮才会爽脆，肉才会嫩滑，骨头边上还带一点粉红才算到位。不放任何调味，斩件上桌，蘸姜葱蓉。这是广府菜的态度：鸡好，就该吃出鸡的味道。",
      en: "A whole chicken is poached in water held just below the boil, then plunged into cold water so the skin turns taut and the flesh stays silky — a blush of pink at the bone is the mark of it done right. No seasoning at all; it is chopped and served with a ginger-and-spring-onion relish. This is the Guangfu attitude in one dish: if the chicken is good, you should taste the chicken.",
      ar: "تُسلق دجاجة كاملة في ماءٍ يُبقى دون الغليان، ثم تُغمر في ماء بارد فيشتدّ الجلد ويبقى اللحم حريريًا — واحمرارٌ خفيف عند العظم علامة الإتقان. بلا أي توابل؛ تُقطّع وتُقدَّم مع صلصة الزنجبيل والبصل الأخضر. هذا هو مذهب قوانغفو في طبق واحد: إن كانت الدجاجة جيدة فينبغي أن تتذوّق الدجاجة.",
    },
  },
  {
    id: "wok-hei",
    title: { zh: "干炒牛河与「镬气」", en: "Beef chow fun and ‘wok hei’", ar: "شعيرية اللحم المقلية و«نَفَس المقلاة»" },
    body: {
      zh: "宽河粉、牛肉、豆芽、韭黄，猛火快炒。广东人评一碟炒菜好不好，看的是「镬气」—— 铁锅烧到极烫、油和酱在锅边瞬间焦香、每一根粉都均匀上色而不断不糊。炉火不够猛的厨房炒不出来，这是粤菜厨师的看家本领，也是所有广式小炒的魂。",
      en: "Wide rice noodles, beef, bean sprouts and yellow chives, tossed fast over a ferocious flame. Cantonese judge any stir-fry by its wok hei, the “breath of the wok”: the pan heated until it almost glows, oil and sauce searing in an instant at the rim, every noodle evenly browned yet unbroken and unstuck. It cannot be faked on a weak stove — it is the Cantonese cook's signature skill and the soul of every quick-fried dish.",
      ar: "شعيرية أرز عريضة ولحم بقر وبراعم فول وثوم معمّر أصفر، تُقلّب بسرعة فوق لهب عنيف. ويحكم الكانتونيون على أي طبق مقلي بـ«ووك هي»، أي نَفَس المقلاة: تُحمى المقلاة حتى تكاد تتوهّج، فيلفح الزيت والصلصة حافتها في لحظة، وتتلوّن كل خيط شعيرية بالتساوي دون أن ينقطع أو يلتصق. لا يمكن تزييفه على موقد ضعيف — إنه توقيع الطاهي الكانتوني وروح كل طبق مقليّ سريع.",
    },
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


/* ------------------------------------------------------------------ */
/* 这座城有多大                                                          */
/*                                                                     */
/* 目的很直接：让客人看到体量。数字一律取最新年度官方口径：             */
/* 2025 年广州统计公报、广州港务局、民航局、广州地铁、广交会官方通报、   */
/* 大湾区门户网；埃及 GDP 取世界银行 2024 年数。美元换算只为量级对比。    */
/* ------------------------------------------------------------------ */

export type StatTile = {
  id: string;
  /** 大字。中文按「万 / 亿」计，英阿按 million 计，所以也分语言。 */
  value: L10n;
  /** 数字后面的单位或短语。 */
  unit: L10n;
  /** 这个数字意味着什么，一句。 */
  note: L10n;
};

export const CITY_SCALE: {
  lead: L10n;
  intro: L10n[];
  tiles: StatTile[];
  sources: { label: L10n; url: string }[];
} = {
  lead: {
    zh: "一座城市的经济总量，超过埃及全国。",
    en: "One city with a larger economy than all of Egypt.",
    ar: "مدينةٌ واحدة اقتصادُها أكبر من اقتصاد مصر كلّها.",
  },
  intro: [
    {
      zh: "2025 年广州的地区生产总值是 3.2 万亿元人民币，按 2025 年约 7.2 的汇率折合四千四百多亿美元；世界银行给出的埃及 2024 年全国 GDP 是 3890 亿美元。这只是广州一座城，常住人口一千九百多万。",
      en: "Guangzhou's GDP in 2025 was 3.2 trillion yuan — about 440 billion US dollars at 2025's rate of roughly 7.2. The World Bank puts all of Egypt's GDP for 2024 at 389 billion dollars. This is one city, with just over nineteen million residents.",
      ar: "بلغ الناتج المحلي الإجمالي لقوانغتشو عام 2025 نحو 3.2 تريليون يوان — أي ما يزيد على 440 مليار دولار بسعر صرف 2025 البالغ نحو 7.2. ويقدّر البنك الدولي ناتج مصر كلّها لعام 2024 بـ 389 مليار دولار. وهذه مدينة واحدة، يسكنها ما يزيد قليلًا على تسعة عشر مليون نسمة.",
    },
    {
      zh: "再往外看一圈：广州所在的粤港澳大湾区，十一座城市、八千八百万人，2025 年经济总量 15.3 万亿元 —— 用全国不到 0.6% 的土地，做出全国九分之一的经济。你们这次落地的白云机场、住的琶洲、要去的老城，都在这个圈里。",
      en: "Widen the frame once: the Greater Bay Area that Guangzhou anchors — eleven cities, eighty-eight million people — produced 15.3 trillion yuan in 2025, a ninth of China's economy on less than 0.6 percent of its land. The airport you land at, Pazhou where you stay, the old city you will walk through: all of it sits inside that circle.",
      ar: "وسّع الإطار مرةً واحدة: منطقة الخليج الكبرى التي تتوسّطها قوانغتشو — إحدى عشرة مدينة، ثمانية وثمانون مليون نسمة — أنتجت عام 2025 ما قيمته 15.3 تريليون يوان، أي تُسعَ اقتصاد الصين على أقل من 0.6 بالمئة من أرضها. المطار الذي تهبطون فيه، وبازو حيث تقيمون، والمدينة القديمة التي ستمشون فيها: كلّها داخل هذه الدائرة.",
    },
  ],
  tiles: [
    {
      id: "gdp",
      value: { zh: "3.2", en: "3.2", ar: "3.2" },
      unit: { zh: "万亿元 · 2025 年 GDP", en: "trillion yuan · GDP, 2025", ar: "تريليون يوان · الناتج المحلي 2025" },
      note: { zh: "全国城市第四，超过埃及全国", en: "Fourth among Chinese cities; more than all of Egypt", ar: "الرابعة بين مدن الصين؛ أكبر من مصر كلّها" },
    },
    {
      id: "pop",
      value: { zh: "1,910", en: "19.1", ar: "19.1" },
      unit: { zh: "万常住人口", en: "million residents", ar: "مليون نسمة" },
      note: { zh: "接近开罗大都会区的两倍", en: "Close to twice Greater Cairo", ar: "قرابة ضعف القاهرة الكبرى" },
    },
    {
      id: "airport",
      value: { zh: "8,359", en: "83.6", ar: "83.6" },
      unit: { zh: "万人次 · 白云机场 2025", en: "million passengers · Baiyun, 2025", ar: "مليون مسافر · مطار بايون 2025" },
      note: { zh: "全国第二个八千万级机场，你们从这里进出", en: "China's second 80-million airport — the one you fly into", ar: "ثاني مطار في الصين يتجاوز 80 مليونًا — وهو مطاركم" },
    },
    {
      id: "port",
      value: { zh: "6.96", en: "696", ar: "696" },
      unit: { zh: "亿吨 · 广州港 2025 货物吞吐", en: "million tonnes · Port of Guangzhou, 2025", ar: "مليون طن · ميناء قوانغتشو 2025" },
      note: { zh: "集装箱 2,800 万标箱，全球港口前六", en: "28 million TEU; a top-six port worldwide", ar: "28 مليون حاوية؛ من أكبر ستة موانئ في العالم" },
    },
    {
      id: "metro",
      value: { zh: "780", en: "780", ar: "780" },
      unit: { zh: "公里地铁 · 2025 年底", en: "km of metro · end of 2025", ar: "كم من المترو · نهاية 2025" },
      note: { zh: "全国第三，比开罗到亚历山大来回还长", en: "Third in China — longer than Cairo to Alexandria and back", ar: "الثالثة في الصين — أطول من رحلة القاهرة إلى الإسكندرية ذهابًا وإيابًا" },
    },
    {
      id: "tower",
      value: { zh: "600", en: "600", ar: "600" },
      unit: { zh: "米 · 广州塔", en: "m · Canton Tower", ar: "م · برج كانتون" },
      note: { zh: "世界第二高塔，就在你们住的海珠区", en: "Second-tallest tower on earth, in your own district of Haizhu", ar: "ثاني أعلى برج في العالم، في منطقتكم هايتشو" },
    },
    {
      id: "fair",
      value: { zh: "31", en: "310,000", ar: "310,000" },
      unit: { zh: "万境外采购商 · 第 138 届广交会", en: "overseas buyers · 138th Canton Fair", ar: "مشترٍ أجنبي · معرض كانتون الـ138" },
      note: { zh: "来自 223 个国家和地区，展馆就在你们酒店那条路上", en: "From 223 countries and regions — the halls are on your hotel's street", ar: "من 223 دولةً ومنطقة — والقاعات في شارع فندقكم نفسه" },
    },
    {
      id: "gba",
      value: { zh: "15.3", en: "15.3", ar: "15.3" },
      unit: { zh: "万亿元 · 大湾区 2025", en: "trillion yuan · Greater Bay Area, 2025", ar: "تريليون يوان · منطقة الخليج الكبرى 2025" },
      note: { zh: "十一城八千八百万人，全国九分之一的经济", en: "Eleven cities, 88 million people, a ninth of China's economy", ar: "إحدى عشرة مدينة، 88 مليون نسمة، تُسع اقتصاد الصين" },
    },
  ],
  sources: [
    {
      label: { zh: "2025 年广州市国民经济和社会发展统计公报", en: "Guangzhou 2025 statistical communiqué", ar: "البيان الإحصائي لقوانغتشو 2025" },
      url: "https://www.gz.gov.cn/zwgk/sjfb/tjgb/content/post_10804075.html",
    },
    {
      label: { zh: "世界银行：埃及 GDP（现价美元）", en: "World Bank: Egypt GDP (current US$)", ar: "البنك الدولي: ناتج مصر (بالدولار الجاري)" },
      url: "https://data.worldbank.org/indicator/NY.GDP.MKTP.CD?locations=EG",
    },
    {
      label: { zh: "民航局：白云机场年旅客吞吐量首破八千万", en: "CAAC: Baiyun passes 80 million passengers", ar: "هيئة الطيران المدني: مطار بايون يتجاوز 80 مليون مسافر" },
      url: "http://www.caacnews.com.cn/special/2025zhuanti/8427/kjzg/20dzln4/202512/t20251223_1392071.html",
    },
    {
      label: { zh: "广州市港务局：2025 年广州港货物吞吐量突破 6.96 亿吨", en: "Guangzhou Port Authority: 696 million tonnes in 2025", ar: "هيئة ميناء قوانغتشو: 696 مليون طن عام 2025" },
      url: "https://gwj.gz.gov.cn/xwzx/gzgxw/content/post_10631368.html",
    },
    {
      label: { zh: "广州市交通运输局：2025 年度轨道交通评价（运营里程）", en: "Guangzhou Transport Bureau: 2025 rail transit review (network length)", ar: "هيئة النقل بقوانغتشو: مراجعة النقل بالسكك 2025" },
      url: "https://jtj.gz.gov.cn/gkmlpt/content/10/10694/post_10694346.html",
    },
    {
      label: { zh: "海珠区政府：广州塔", en: "Haizhu District government: Canton Tower", ar: "حكومة منطقة هايتشو: برج كانتون" },
      url: "https://www.haizhu.gov.cn/zjhz/lyck/content/post_7765705.html",
    },
    {
      label: { zh: "人民网：第 138 届广交会闭幕，境外采购商创新高", en: "People's Daily: 138th Canton Fair closes with record overseas buyers", ar: "صحيفة الشعب: اختتام معرض كانتون الـ138 برقم قياسي" },
      url: "http://pic.people.com.cn/n1/2025/1104/c1016-40596777.html",
    },
    {
      label: { zh: "粤港澳大湾区门户网：关于大湾区", en: "Greater Bay Area portal: about the GBA", ar: "بوابة منطقة الخليج الكبرى: عن المنطقة" },
      url: "https://www.cnbayarea.org.cn/introduction/content/post_165071.html",
    },
  ],
};

/* ------------------------------------------------------------------ */
/* 你们住的这块地：琶洲                                                  */
/* ------------------------------------------------------------------ */

export const PAZHOU: { lead: L10n; paragraphs: L10n[]; sources: { label: L10n; url: string }[] } = {
  lead: {
    zh: "酒店在阅江中路 828 号。广交会展馆在 382 号，同一条路。",
    en: "The hotel is at 828 Yuejiang Middle Road. The Canton Fair complex is at 382 — the same road.",
    ar: "الفندق في 828 شارع يوى جيانغ الأوسط. ومجمّع معرض كانتون في الرقم 382 — الشارع نفسه.",
  },
  paragraphs: [
    {
      zh: "琶洲这块地，一千多年前是海上丝绸之路的出海口。二十年前广交会搬到这里，展馆 155 万平方米；2025 年秋季那一届，三万两千家企业参展，二十三个国家和地区的三十一万境外采购商到场，是有史以来最大的一届。",
      en: "A thousand years ago this stretch of riverbank was where the Maritime Silk Road put to sea. Twenty years ago the Canton Fair moved here, into 1.55 million square metres of halls; the autumn 2025 edition drew 32,000 exhibitors and 310,000 overseas buyers from 223 countries and regions, the largest in its history.",
      ar: "قبل أكثر من ألف عام كانت هذه الضفة هي المنفذ البحري لطريق الحرير. وقبل عشرين عامًا انتقل معرض كانتون إلى هنا، في قاعات مساحتها 1.55 مليون متر مربع؛ واستقطبت دورة خريف 2025 اثنين وثلاثين ألف عارض وثلاثمئة وعشرة آلاف مشترٍ أجنبي من 223 دولةً ومنطقة، وهي الأكبر في تاريخه.",
    },
    {
      zh: "展馆背后，是 2015 年起建的人工智能与数字经济试验区：腾讯、阿里巴巴、唯品会的总部大楼都在这里，三万六千多家企业，一年营收四千五百亿元以上。从酒店窗户看出去的那些新楼，就是它们。",
      en: "Behind the halls is the AI and digital-economy zone begun in 2015: the headquarters towers of Tencent, Alibaba and Vipshop stand here, among more than 36,000 companies with combined annual revenue above 450 billion yuan. The new towers you see from the hotel window are those.",
      ar: "وخلف القاعات تقع منطقة الذكاء الاصطناعي والاقتصاد الرقمي التي بدأ بناؤها عام 2015: أبراج المقار الرئيسية لتينسنت وعلي بابا وفيبشوب هنا، بين أكثر من 36 ألف شركة يتجاوز إيرادها السنوي مجتمعةً 450 مليار يوان. والأبراج الجديدة التي ترونها من نافذة الفندق هي تلك.",
    },
  ],
  sources: [
    {
      label: { zh: "广州市政府：魅力琶洲，从海丝起点到创新高地", en: "Guangzhou government: Pazhou, from Silk Road port to innovation hub", ar: "حكومة قوانغتشو: بازو، من ميناء طريق الحرير إلى مركز الابتكار" },
      url: "https://www.gz.gov.cn/ysgz/xwdt/ysdt/content/post_10110019.html",
    },
    {
      label: { zh: "国家数据局：琶洲人工智能与数字经济试验区案例", en: "National Data Administration: the Pazhou zone case study", ar: "هيئة البيانات الوطنية: دراسة حالة منطقة بازو" },
      url: "https://www.nda.gov.cn/sjj/ywpd/szsh/0109/20250109113547618448454_pc.html",
    },
  ],
};

/* ------------------------------------------------------------------ */
/* 食在广州                                                              */
/*                                                                     */
/* 「食在广州」四个字一百年前就传遍全国。这一节讲的是分量：两千年、        */
/* 三大流派、联合国认的美食之都。清真那句提醒在 FOOD_ADVICE 里说过一次，   */
/* 这里只讲好吃。                                                        */
/* ------------------------------------------------------------------ */

export const FOOD_CULTURE: { lead: L10n; paragraphs: L10n[]; sources: { label: L10n; url: string }[] } = {
  lead: {
    zh: "「食在广州」—— 这四个字，一百年前就已经全国皆知。",
    en: "“Eat in Guangzhou” — the whole country was saying it a hundred years ago.",
    ar: "«كُل في قوانغتشو» — عبارةٌ كانت الصين كلُّها تردّدها قبل مئة عام.",
  },
  paragraphs: [
    {
      zh: "1925 年的《广州民国日报》写道：「食在广州一语，几无人不知之。」粤菜是中国八大菜系之一，往上追到两千年前的南越王宫；它由三支组成 —— 广州这边的广府菜、东边海岸的潮汕菜、山里的客家菜 —— 三种完全不同的脾气。",
      en: "In 1925 the Guangzhou Republican Daily wrote: “There is hardly anyone who does not know the saying ‘eat in Guangzhou’.” Cantonese cooking is one of China's eight great cuisines and traces back two thousand years to the kitchens of the Nanyue kings. It comes in three branches — Guangfu cooking here in Guangzhou, Chaoshan cooking on the eastern coast, Hakka cooking in the hills — three quite different temperaments.",
      ar: "كتبت صحيفة «قوانغتشو الجمهورية» عام 1925: «لا يكاد أحدٌ يجهل عبارة: كُل في قوانغتشو». والمطبخ الكانتوني أحد مطابخ الصين الثمانية الكبرى، ويعود ألفي عام إلى مطابخ ملوك نانيوى. وله ثلاثة فروع — مطبخ قوانغفو هنا في قوانغتشو، ومطبخ تشاوشان على الساحل الشرقي، ومطبخ الهاكا في الجبال — ثلاثة أمزجة مختلفة تمامًا.",
    },
    {
      zh: "广府菜讲究「清、鲜、嫩、滑」，什么食材就要吃出什么味道，调料是来帮忙的，不是来盖住的。所以一只鸡可以只用白水浸熟，蘸姜葱吃；一条鱼清蒸，淋一勺热油和豉油就上桌。做得好不好，一口就知道，藏不住。",
      en: "Guangfu cooking prizes clarity, freshness, tenderness and smoothness: an ingredient should taste of itself, and seasoning is there to help, never to hide. So a whole chicken may be simply poached and eaten with ginger and spring onion; a fish is steamed and finished with a spoon of hot oil and soy. Whether the cook is any good is obvious in one mouthful — there is nowhere to hide.",
      ar: "يُعلي مطبخ قوانغفو من الصفاء والطزاجة والطراوة والنعومة: ينبغي أن يكون طعم المكوّن طعمَ نفسه، والتوابل تُعين ولا تُخفي. فقد تُسلق دجاجة كاملة في الماء فحسب وتُؤكل بالزنجبيل والبصل الأخضر؛ وتُطهى سمكة على البخار ثم تُسقى بملعقة زيت ساخن وصويا. وتعرف من اللقمة الأولى إن كان الطاهي بارعًا — إذ لا مكان للاختباء.",
    },
    {
      zh: "离广州一小时的顺德，2014 年被联合国教科文组织评为「世界美食之都」，全球至今只有六座城市拿到这个称号；粤菜的根在那里，双皮奶也是从那儿来的。往东三百公里是潮汕，那里的牛肉火锅要求牛当天现宰，一头牛只有三分之一的肉够格上桌。",
      en: "An hour from Guangzhou is Shunde, named a UNESCO Creative City of Gastronomy in 2014 — only six cities in the world hold the title; Cantonese cooking has its roots there, and so does double-skin milk. Three hundred kilometres east is Chaoshan, whose beef hotpot demands cattle slaughtered the same day, and where only a third of the animal is judged good enough for the table.",
      ar: "وعلى مسافة ساعة من قوانغتشو تقع شوندي التي اختارتها اليونسكو عام 2014 «مدينةً مبدعة في فنون الطهي» — ولا يحمل هذا اللقب سوى ست مدن في العالم؛ وفيها جذور المطبخ الكانتوني، ومنها جاء حليب الطبقتين. وعلى بعد ثلاثمئة كيلومتر شرقًا تقع تشاوشان، حيث يشترط طبق «هوت بوت» اللحم البقري أن تُذبح الأبقار في اليوم نفسه، ولا يُعدّ سوى ثلث الذبيحة صالحًا للمائدة.",
    },
  ],
  sources: [
    {
      label: { zh: "广州市政府：粤菜之美，在于和与合", en: "Guangzhou government: the beauty of Cantonese cuisine", ar: "حكومة قوانغتشو: جمال المطبخ الكانتوني" },
      url: "https://www.gz.gov.cn/zlgz/tsgz/content/post_8033813.html",
    },
    {
      label: { zh: "广东省侨办：追忆粤菜两千年，探寻「食在广州」", en: "Guangdong Overseas Chinese Affairs: two thousand years of Cantonese cooking", ar: "مكتب شؤون المغتربين بقوانغدونغ: ألفا عام من المطبخ الكانتوني" },
      url: "http://www.qb.gd.gov.cn/ztzl/2021ycsf/xwdt/content/post_1028903.html",
    },
    {
      label: { zh: "人民网：联合国教科文组织授予顺德「世界美食之都」", en: "People's Daily: UNESCO names Shunde a City of Gastronomy", ar: "صحيفة الشعب: اليونسكو تمنح شوندي لقب مدينة فنون الطهي" },
      url: "http://cpc.people.com.cn/n/2014/1227/c87228-26284802.html",
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
