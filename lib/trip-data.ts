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
    "id": "payment",
    "audience": [
      "reham",
      "rahma",
      "qiuting"
    ],
    "title": {
      "zh": "支付：先准备好支付宝",
      "en": "Payment: set up Alipay",
      "ar": "الدفع: تجهيز أليباي"
    },
    "lines": [
      {
        "zh": "出发前装好 Alipay：用能收短信的手机号注册，按提示用护照完成身份验证，再绑一张能在境外用的 Visa 或 Mastercard。绑卡那一页会写清适用范围和限额，值得看一眼。",
        "en": "Set up Alipay before you fly: register with a number that receives SMS, finish the passport verification it asks for, then link a Visa or Mastercard enabled for use abroad. The linking screen spells out where the card works and the limits — worth a look.",
        "ar": "جهّزي أليباي قبل السفر: سجّلي برقم يستقبل الرسائل، وأكملي التحقق بجواز السفر كما يطلب التطبيق، ثم اربطي بطاقة فيزا أو ماستركارد مفعّلة للاستخدام خارج بلدك. وتوضّح صفحة الربط نطاق قبول البطاقة وحدودها، وتستحق نظرة."
      },
      {
        "zh": "落地后先用一笔小额消费试付一次。付款有两个方向：你扫商家贴出来的收款码，或者打开自己的付款码让店员扫。",
        "en": "After landing, try one small purchase first. Payment goes one of two ways: you scan the merchant’s code, or you open your own payment code for the cashier to scan.",
        "ar": "بعد الوصول جرّبي عملية شراء صغيرة أولًا. والدفع يتم بطريقتين: إمّا أن تمسحي رمز المتجر، أو تفتحي رمز الدفع الخاص بك ليمسحه الكاشير."
      },
      {
        "zh": "原来的手机号别停用，银行的验证短信要靠它。再带一张实体银行卡和少量人民币现金备用；付款遇到问题，可请酒店前台协助。",
        "en": "Keep your home number active — bank verification texts arrive there. Carry a physical bank card and a little RMB as backup, and if a payment runs into trouble, you can ask the hotel desk for help.",
        "ar": "أبقي رقمك الأصلي فعّالًا، فرسائل التحقق من البنك تصل إليه. واحملي بطاقة مصرفية فعلية وقليلًا من اليوان احتياطًا؛ وعند تعذّر الدفع يمكن طلب المساعدة من استقبال الفندق."
      }
    ]
  },
  {
    "id": "team-payment",
    "audience": [
      "ahmed",
      "hassan"
    ],
    "title": {
      "zh": "支付：Chuck 协助准备",
      "en": "Payment: preparation with Chuck",
      "ar": "الدفع: التجهيز مع Chuck"
    },
    "lines": [
      {
        "zh": "出发前由 Chuck 协助安装支付宝并安排备用金。完成账户所需验证，确认余额或付款方式可用，抵达后先试付一笔小额消费。",
        "en": "Before departure, Chuck will help set up Alipay and arrange spending funds. Complete the required account checks, confirm an available balance or payment method, and test a small purchase on arrival.",
        "ar": "قبل السفر، يساعد Chuck في إعداد أليباي وترتيب مبلغ للمصروفات. أكملا التحقق المطلوب وتأكدا من توفر الرصيد أو وسيلة الدفع، ثم جرّبا عملية شراء صغيرة عند الوصول."
      },
      {
        "zh": "遇到付款失败，先向 Chuck 确认账户和资金状态；带少量人民币备用。",
        "en": "If payment fails, check the account and funds with Chuck. Carry a little RMB as backup.",
        "ar": "إذا تعذّر الدفع، راجعا الحساب والمبلغ مع Chuck. احتفظا بقليل من اليوان احتياطًا."
      }
    ]
  },
  {
    "id": "taxi",
    "title": {
      "zh": "打车：用 DiDi，核对上车点",
      "en": "Getting a ride with DiDi",
      "ar": "طلب سيارة عبر ديدي"
    },
    "lines": [
      {
        "zh": "出发前装 DiDi Greater China，界面可以切成英文，用本人手机号注册并设好付款方式；支付宝里也有打车入口。",
        "en": "Install DiDi Greater China before you travel — the interface switches to English — register with your own number and set up payment. Alipay also has a ride-hailing entrance inside it.",
        "ar": "ثبّتي DiDi Greater China قبل السفر، وواجهته تتحوّل إلى الإنجليزية، وسجّلي برقمك وأضيفي وسيلة الدفع. وفي أليباي أيضًا مدخل لطلب السيارات."
      },
      {
        "zh": "输目的地时直接粘贴本页复制的中文名，比拼英文靠谱。大商场有好几个门，定好之后核对一眼地图上的点是不是你要去的那一栋、那个入口 —— 落客点选错，绕回来要走很久。",
        "en": "Paste the Chinese name you copied from this page rather than spelling it in English. Big malls have several entrances, so once the pin drops, check it is the building and the door you meant — the wrong drop-off means a long walk back.",
        "ar": "الصقي الاسم الصيني الذي نسختِه من هذه الصفحة بدل كتابته بالإنجليزية. وللمراكز الكبيرة مداخل عدة، فبعد تحديد الموقع تأكّدي أنه المبنى والمدخل المقصودان — فنقطة النزول الخاطئة تعني مشيًا طويلًا للعودة."
      },
      {
        "zh": "上车前对一眼车牌。从酒店出发可以请门童指一下网约车的上车点；司机有事会在应用里发消息。实在搜不到目的地，就请前台叫一辆出租车，把中文地址给司机看。",
        "en": "Check the plate before you get in. Leaving the hotel, ask the doorman where ride-hailing cars wait; drivers message inside the app if they need to reach you. If the destination simply will not come up, ask reception for a licensed taxi and show the driver the Chinese address.",
        "ar": "تحقّقي من رقم اللوحة قبل الركوب. وعند الخروج من الفندق اسألي موظف الباب عن نقطة انتظار سيارات التطبيق؛ ويراسلك السائق داخل التطبيق عند الحاجة. وإن لم تظهر الوجهة في البحث، اطلبي من الاستقبال سيارة أجرة مرخّصة واعرضي العنوان الصيني على السائق."
      }
    ]
  },
  {
    "id": "maps",
    "title": {
      "zh": "地图：先收藏酒店",
      "en": "Maps: save the hotel first",
      "ar": "الخرائط: احفظي الفندق أولًا"
    },
    "lines": [
      {
        "zh": "装高德地图（Amap），第一件事是把酒店收藏起来：搜「广州保利洲际酒店」，核对地址是海珠区阅江中路828号。英文名搜不到就用中文搜，中文一搜就中。",
        "en": "Install Amap, and the first thing to do is save the hotel: search 广州保利洲际酒店 and check the address reads 828 Yuejiang Middle Road, Haizhu. If the English name finds nothing, the Chinese one will.",
        "ar": "ثبّتي خرائط Amap، وأول خطوة أن تحفظي الفندق: ابحثي عن 广州保利洲际酒店 وتأكّدي أن العنوان هو 828 Yuejiang Middle Road بمنطقة هايتشو. وإن لم يظهر الاسم الإنجليزي فالاسم الصيني يظهر فورًا."
      },
      {
        "zh": "出门前存三张截图：今天要去的地方、下车点或地铁出口、回酒店的中文地址。手机没信号的时候，截图照样能给司机看。",
        "en": "Before you go out, save three screenshots: where you are heading, the drop-off point or metro exit, and the hotel’s Chinese address for the way back. With no signal, a screenshot still shows a driver where you mean.",
        "ar": "قبل الخروج احفظي ثلاث صور للشاشة: وجهتك، ونقطة النزول أو مخرج المترو، وعنوان الفندق بالصينية للعودة. وعند انقطاع الشبكة تظلّ الصورة كافية لتُري السائق وجهتك."
      },
      {
        "zh": "步行导航常常把你带向天桥、地下通道或商场入口。到了路口按现场指示走，比盯着蓝点更快。",
        "en": "Walking directions often route you over a footbridge, through an underpass or in via a mall entrance. At the crossing itself, follow the signs on the ground — faster than watching the blue dot.",
        "ar": "كثيرًا ما يقودك التوجيه للمشاة إلى جسر علوي أو نفق أو مدخل مركز تجاري. وعند التقاطع نفسه اتبعي اللافتات على الأرض، فهي أسرع من متابعة النقطة الزرقاء."
      }
    ]
  },
  {
    "id": "guest-internet",
    "audience": [
      "reham",
      "rahma",
      "qiuting"
    ],
    "title": {
      "zh": "上网与联系：出发前选好方案",
      "en": "Internet and staying in touch",
      "ar": "الإنترنت والتواصل"
    },
    "lines": [
      {
        "zh": "三条路，出发前挑一条：问自己的运营商开中国大陆漫游；买一张手机支持的旅行 eSIM；或者落地后带护照去运营商营业厅办一张中国 SIM 卡（办卡要护照）。买之前问清覆盖、怎么激活，以及是不是只有流量、没有能收短信的号码。",
        "en": "Three ways to stay online — pick one before you fly: ask your operator for mainland-China roaming; buy a travel eSIM your phone supports; or, after landing, take your passport to an operator shop for a Chinese SIM (a passport is required). Before you buy, check the coverage, how it activates, and whether it is data only with no number for texts.",
        "ar": "ثلاث طرق للاتصال، اختاري واحدة قبل السفر: اسألي مشغّلك عن التجوال في البرّ الرئيسي للصين؛ أو اشتري شريحة eSIM للسفر يدعمها هاتفك؛ أو خذي جواز سفرك بعد الوصول إلى فرع شركة اتصالات للحصول على شريحة صينية (الجواز مطلوب). واسألي قبل الشراء عن التغطية وطريقة التفعيل، وهل الباقة بيانات فقط بلا رقم يستقبل الرسائل."
      },
      {
        "zh": "原来的号码留着收验证短信。出发前把 Rahma 加上微信、试着发一条消息；到酒店先连 Wi-Fi，出门前确认移动数据和地图都能用。",
        "en": "Keep your existing number for verification texts. Add Rahma on WeChat before you leave and send a test message; connect to the hotel Wi-Fi on arrival, and check that mobile data and maps work before you head out.",
        "ar": "أبقي رقمك الحالي لاستقبال رسائل التحقق. وأضيفي Rahma على وي تشات قبل السفر وجرّبي إرسال رسالة؛ واتصلي بواي فاي الفندق عند الوصول، وتأكّدي من عمل البيانات والخرائط قبل الخروج."
      },
      {
        "zh": "不同网络下，WhatsApp、Google 等服务的可用性不同，不要只依赖一种联系工具。如需 VPN，出发前安装并测试，仍准备好微信和离线翻译备用。",
        "en": "WhatsApp, Google and other services may be unavailable on some connections. Keep more than one way to communicate. If you use a VPN, install and test it before travel, with WeChat and offline translation as backups.",
        "ar": "قد لا تعمل واتساب وغوغل وخدمات أخرى على بعض الشبكات. جهّزي أكثر من وسيلة للتواصل. إن كنت تستخدمين VPN فثبّتيه واختبريه قبل السفر، مع وي تشات وترجمة بلا إنترنت كبدائل."
      }
    ]
  },
  {
    "id": "team-internet",
    "audience": [
      "ahmed",
      "hassan"
    ],
    "title": {
      "zh": "上网与翻译：共用中国卡",
      "en": "Internet and translation: shared Chinese SIM",
      "ar": "الإنترنت والترجمة: الشريحة الصينية المشتركة"
    },
    "lines": [
      {
        "zh": "Chuck 会给 Mohamed 一张中国卡，返程后归还。出发前检查手机可用，抵达后插卡并测试上网；两人同行时可通过热点共享给 Ahmed。",
        "en": "Chuck will lend Mohamed one Chinese SIM, to return after the trip. Check phone compatibility before travel and test data on arrival. Ahmed can share Mohamed’s hotspot while travelling together.",
        "ar": "يعير Chuck شريحة صينية واحدة لـ Mohamed تُعاد بعد الرحلة. افحصا توافق الهاتف قبل السفر واختبرا البيانات عند الوصول. يمكن لـ Ahmed استخدام نقطة اتصال Mohamed أثناء وجودكما معًا."
      },
      {
        "zh": "出发前协助安装并测试 VPN 和 ChatGPT，用于问路与翻译；可用性受网络及服务支持范围影响。同时准备离线翻译，保存本页中文地址和短句。",
        "en": "Before departure, get help installing and testing the VPN and ChatGPT for questions and translation. Availability depends on the network and service coverage. Also prepare offline translation and save this page’s Chinese addresses and phrases.",
        "ar": "اطلبا المساعدة قبل السفر لتثبيت واختبار VPN وChatGPT للأسئلة والترجمة. يعتمد توفر الخدمة على الشبكة ونطاق دعمها. جهّزا ترجمة بلا إنترنت واحفظا العناوين والعبارات الصينية من هذه الصفحة."
      }
    ]
  },
  {
    "id": "essentials",
    "title": {
      "zh": "随身带好",
      "en": "Keep these with you",
      "ar": "احتفظي بهذه الأشياء"
    },
    "lines": [
      {
        "zh": "护照原件、酒店预订信息、转换插头、充电线和常用药。护照资料页和行程各存一份离线副本；酒店入住时要出示护照原件。",
        "en": "Your original passport, the hotel booking, a plug adapter, charging cables and any medication you take. Keep offline copies of the passport page and the itinerary; the original passport is needed at hotel check-in.",
        "ar": "أصل جواز السفر وحجز الفندق ومحوّل القابس وكابلات الشحن وأي دواء تتناولينه. واحفظي نسخًا بلا إنترنت من صفحة الجواز والبرنامج؛ ويُطلب أصل الجواز عند تسجيل الدخول."
      },
      {
        "zh": "机上如果需要特殊餐（清真餐、素食或其他），要在出发前直接向航空公司申请，到了机场再说就来不及了。",
        "en": "If you need a special meal on board — halal, vegetarian or anything else — request it from the airline before departure; asking at the airport is too late.",
        "ar": "وإن كنتِ تحتاجين وجبة خاصة على متن الطائرة — حلال أو نباتية أو غيرها — فاطلبيها من شركة الطيران قبل السفر؛ فالطلب في المطار يأتي متأخرًا."
      }
    ]
  },
  {
    "id": "weather",
    "title": {
      "zh": "天气与穿什么",
      "en": "Weather and what to wear",
      "ar": "الطقس وماذا ترتدي"
    },
    "lines": [
      {
        "zh": "九月下旬的广州还是夏天：白天热、湿度高，一场雨说来就来。带轻薄衣服、一把折叠伞和走久了也不累的鞋；室内冷气开得足，会议室和商场里一件薄外套很管用。出发前看一眼广州的天气预报。",
        "en": "Late September in Guangzhou is still summer: warm days, high humidity, and rain that arrives without warning. Pack light clothes, a folding umbrella and shoes you can walk in all day. Indoors the air conditioning is strong, so a light layer earns its place in meeting rooms and malls. Check the Guangzhou forecast before you fly.",
        "ar": "أواخر سبتمبر في قوانغتشو لا يزال صيفًا: نهار دافئ ورطوبة عالية ومطر يأتي فجأة. خذي ملابس خفيفة ومظلة قابلة للطي وحذاءً يحتمل المشي طوال اليوم. والتكييف في الداخل قوي، فطبقة خفيفة مفيدة في قاعات الاجتماعات والمراكز التجارية. وراجعي توقعات الطقس قبل السفر."
      }
    ]
  }
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
      zh: "给司机看：请打表计费，按导航走",
      en: "Show the driver: meter on, follow the navigation",
      ar: "أظهرها للسائق: شغّل العدّاد واتبع الملاحة",
    },
    chinese: "请打表计费，按导航路线走，谢谢。",
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
/* 广州商圈：天河路与北京路                                              */
/*                                                                     */
/* 会议之外的自由探索：地点、空间特色、步行建议。写给来逛的人看 ——       */
/* 不替客人布置考察任务、不指导他写报告、不对着「做商场的人」说话。      */
/* 只写站在街上看得见的东西；别人为什么这么开店属于揣测，不写。          */
/* 数字出自天河区政府、广州市政府与新华网。                              */
/* ------------------------------------------------------------------ */

export type MallCard = {
  id: string;
  imageKey?: string;
  name: L10n;
  /** 一句话说清它是什么地方，不贴客群标签。 */
  tier: L10n;
  /** 到了现场看得见的：空间、店、怎么走。 */
  facts: L10n;
};

export const RETAIL_STUDY: {
  lead: L10n;
  intro: L10n[];
  malls: MallCard[];
  /** 为什么这个案例有代表性：二十年错位补位的时间线 + 背后的道理。 */
  caseStudy: L10n[];
  /** 可对照的案例：同一套逻辑在别处怎么长的。 */
  comparables: { name: L10n; body: L10n }[];
  beijinglu: L10n;
  takeaways: L10n[];
  sources: { label: L10n; url: string }[];
} = {
  "lead": {
    "zh": "一条路上六家商场，另一条街脚下埋着一千年。",
    "en": "Six malls along one road; another street with a thousand years under the pavement.",
    "ar": "ستة مراكز على طريق واحد؛ وشارع آخر تحت رصيفه ألف عام."
  },
  "intro": [
    {
      "zh": "广州逛街有两种不同的方式。天河路是一条路上相邻的几家购物中心，逛的是室内与品牌；北京路是步行街，老字号、小店和骑楼挨着排，街心还有一段盖着玻璃罩的古代路面。",
      "en": "Guangzhou offers two different kinds of shopping trip. Tianhe Road is a row of neighbouring malls — interiors and brands. Beijing Road is a pedestrian street of long-established shops, small traders and arcade buildings, with a stretch of ancient roadway under a glass cover in the middle of it.",
      "ar": "تقدّم قوانغتشو نوعين مختلفين من جولات التسوّق. شارع تيانخه صفٌّ من المراكز المتجاورة — مساحات داخلية وعلامات تجارية. أما شارع بكين فشارع مشاة تصطفّ فيه المتاجر العريقة والمحال الصغيرة ومباني الأروقة، وفي وسطه امتداد من طريق قديم تحت غطاء زجاجي."
    },
    {
      "zh": "天河路上购物中心相邻，挑两三家就能感到风格的变化：有的是高端品牌与宽敞室内，有的把庭园放在露天，有的整个开在地下。建议选 2–3 家。",
      "en": "The malls on Tianhe Road stand close together, and two or three are enough to feel how differently they are put together: one given to luxury names and wide interiors, one arranged around an open-air garden, one built entirely below ground. Two or three is the right number.",
      "ar": "تتجاور المراكز على شارع تيانخه، ويكفي اثنان أو ثلاثة لتلمسوا اختلاف طابعها: واحد للعلامات الفاخرة والمساحات الداخلية الواسعة، وآخر حول حديقة مكشوفة، وثالث تحت الأرض بالكامل. واثنان أو ثلاثة هو العدد المناسب."
    }
  ],
  "malls": [
    {
      "id": "taikoo",
      "imageKey": "taikoo",
      "name": {
        "zh": "太古汇",
        "en": "Taikoo Hui",
        "ar": "تايكو هوي"
      },
      "tier": {
        "zh": "奢侈品牌与生活方式",
        "en": "Luxury and lifestyle",
        "ar": "الفخامة وأسلوب الحياة"
      },
      "facts": {
        "zh": "国际奢侈品牌与生活方式店铺汇在宽敞的室内空间。可以留意不同品牌的橱窗与店面设计；商场连接石牌桥站，适合作为天河路散步的一站。",
        "en": "International luxury names and lifestyle shops gathered into one wide interior. The window displays and shopfront designs are worth a look as you pass. The mall connects to Shipaiqiao metro station, which makes it an easy stop on a Tianhe Road walk.",
        "ar": "دور الأزياء العالمية ومتاجر أسلوب الحياة مجتمعة في فضاء داخلي واسع. وتستحق واجهات العرض وتصاميم المتاجر نظرة أثناء المرور. ويتصل المركز بمحطة مترو شيبايتشياو، فيصلح محطة سهلة في جولة شارع تيانخه."
      }
    },
    {
      "id": "parc-central",
      "name": {
        "zh": "天环 Parc Central",
        "en": "Parc Central",
        "ar": "بارك سنترال"
      },
      "tier": {
        "zh": "开放空间与城市休闲",
        "en": "Open spaces and urban leisure",
        "ar": "مساحات مفتوحة وترفيه حضري"
      },
      "facts": {
        "zh": "一组低矮建筑围着下沉式的庭园，露天走道穿在中间。坐在户外的位子上抬头，四周的高楼就在头顶。天气合适时，留一段时间在户外坐坐。",
        "en": "Low buildings set around a sunken garden, with open-air walkways threading between them. From an outdoor table you look up at the towers of the district standing right above you. If the weather is kind, leave some time to sit outside here.",
        "ar": "مبانٍ منخفضة حول حديقة غائرة، وممرات مكشوفة تتخلّلها. ومن طاولة في الخارج تنظرون إلى أبراج المنطقة القائمة فوقكم مباشرة. وإن كان الطقس لطيفًا فاتركوا وقتًا للجلوس في الخارج هنا."
      }
    },
    {
      "id": "grandview",
      "name": {
        "zh": "正佳广场",
        "en": "Grandview Mall",
        "ar": "غراندفيو مول"
      },
      "tier": {
        "zh": "购物与家庭娱乐",
        "en": "Shopping and family attractions",
        "ar": "التسوق والترفيه العائلي"
      },
      "facts": {
        "zh": "把水族馆放进购物中心，是这里有趣的一笔。除了逛店，也可以把海洋馆单独留作一段体验；海洋馆另购门票，喜欢这类项目再安排时间。",
        "en": "Putting an aquarium inside a shopping centre is the interesting move here. Besides the shops, the aquarium can be kept as an outing of its own; it has a separate ticket, so set aside time for it only if this kind of thing appeals.",
        "ar": "وضع أكواريوم داخل مركز تسوّق هو اللمسة الطريفة هنا. وإلى جانب المتاجر، يمكن إبقاء الأكواريوم تجربةً قائمة بذاتها؛ وله تذكرة منفصلة، فخصّصوا له وقتًا إن كان هذا النوع يعجبكم."
      }
    },
    {
      "id": "teemall",
      "name": {
        "zh": "天河城",
        "en": "Teemall",
        "ar": "تيمول"
      },
      "tier": {
        "zh": "成熟的城市购物中心",
        "en": "An established city mall",
        "ar": "مركز تجاري راسخ"
      },
      "facts": {
        "zh": "老牌购物中心，百货、品牌店与餐饮都在同一栋楼里。与地铁体育西路站相连。",
        "en": "A long-established shopping centre with a department store, brand shops and restaurants under one roof. It connects to Tiyu Xilu metro station.",
        "ar": "مركز تسوّق عريق يضمّ متجرًا كبيرًا ومتاجر للعلامات ومطاعم تحت سقف واحد. ويتصل بمحطة مترو تييو شيلو."
      }
    },
    {
      "id": "onelink",
      "name": {
        "zh": "万菱汇",
        "en": "Onelink Walk",
        "ar": "وان لينك ووك"
      },
      "tier": {
        "zh": "购物与咖啡歇脚",
        "en": "Shops and a coffee stop",
        "ar": "متاجر ومحطة قهوة"
      },
      "facts": {
        "zh": "逛太古汇一带时，可以把这里作为咖啡或用餐的一站。商场与办公楼相连，按自己的胃口找间店坐下，不用赶着把整座商场走完。",
        "en": "While you are around Taikoo Hui, this makes a good stop for coffee or a meal. The mall adjoins office buildings; find somewhere that suits your appetite and sit down, rather than trying to cover the whole building.",
        "ar": "وأنتم في محيط تايكو هوي، يصلح هذا المركز محطةً لقهوة أو وجبة. وهو ملاصق لمبانٍ مكتبية؛ اختاروا ما يناسب شهيّتكم واجلسوا، بدل محاولة تغطية المبنى كله."
      }
    },
    {
      "id": "fashion-tianhe",
      "name": {
        "zh": "时尚天河",
        "en": "Fashion Tianhe",
        "ar": "فاشن تيانخه"
      },
      "tier": {
        "zh": "地下主题街区",
        "en": "Underground themed lanes",
        "ar": "ممرات مواضيعية تحت الأرض"
      },
      "facts": {
        "zh": "整个开在天河体育中心的地下，分成一条条主题街区，铺面以小店为主。逛起来和地面的购物中心很不一样；天热或下雨时，从地下穿过去也更舒服。",
        "en": "Built entirely beneath the Tianhe Sports Centre and laid out as themed lanes, mostly small shops. It feels quite unlike the malls above ground, and walking through underground is more comfortable in heat or rain.",
        "ar": "يقع بالكامل تحت مركز تيانخه الرياضي، ومقسَّم إلى ممرات ذات طابع خاص تغلب عليها المتاجر الصغيرة. تجربته تختلف عن المراكز فوق الأرض، والمرور تحت الأرض أكثر راحة في الحر أو المطر."
      }
    }
  ],
  "caseStudy": [
    {
      "zh": "按喜好挑组合就行：想看高端品牌，去太古汇；想在户外坐一会儿，去天环；带着孩子或想看点别的，正佳有海洋馆。天热或下雨，时尚天河的地下那一段更省事。",
      "en": "Choose the combination that suits you: Taikoo Hui for the luxury names, Parc Central to sit outside for a while, Grandview if you have children along or want something besides shops. In heat or rain, the underground stretch of Fashion Tianhe is the easier route.",
      "ar": "اختاروا التركيبة التي تناسبكم: تايكو هوي للعلامات الفاخرة، وبارك سنترال للجلوس في الخارج قليلًا، وغراندفيو إن كان معكم أطفال أو أردتم شيئًا غير المتاجر. وفي الحرّ أو المطر يكون الممر تحت الأرض في فاشن تيانخه أيسر."
    }
  ],
  "comparables": [],
  "beijinglu": {
    "zh": "北京路是另一种逛法。2002 年修路时，工人在街心挖出了从唐代到民国叠在一起的十一层路面，现在原地盖上玻璃罩保留着 —— 站在玻璃罩旁，透过玻璃看层层叠起的古代路面。看完再拐进两边的巷子，老字号、小吃和骑楼都在那里。",
    "en": "Beijing Road is the other kind of walk. During roadworks in 2002 workers uncovered eleven layers of roadway stacked from the Tang dynasty to the twentieth century, right in the middle of the street; it was left in place under a glass cover. Stand beside the glass and look through it at the layers of ancient road surface. Then turn into the side lanes, where the old shops, the street food and the arcades are.",
    "ar": "شارع بكين نوع آخر من المشي. ففي أعمال الطرق عام 2002 كشف العمال إحدى عشرة طبقة من الطريق متراكمة من عهد تانغ حتى القرن العشرين، في وسط الشارع تمامًا؛ وتُركت في مكانها تحت غطاء زجاجي. قفوا إلى جانب الزجاج وانظروا من خلاله إلى طبقات الطريق القديم. ثم انعطفوا إلى الأزقة الجانبية، حيث المتاجر العريقة وأكل الشارع والأروقة."
  },
  "takeaways": [],
  "sources": [
    {
      "label": {
        "zh": "太古汇：到达方式与地址",
        "en": "Taikoo Hui: directions and address",
        "ar": "تايكو هوي: الموقع والوصول"
      },
      "url": "https://www.taikoohui.com/en/about-us/about-us/contact-us"
    },
    {
      "label": {
        "zh": "广州市规划局：天河城地址",
        "en": "Guangzhou Planning Bureau: Teemall address",
        "ar": "هيئة تخطيط قوانغتشو: عنوان تيمول"
      },
      "url": "https://ghzyj.gz.gov.cn/ywpd/slgsnew/content/post_10332177.html"
    },
    {
      "label": {
        "zh": "天河区政府：天河路商圈",
        "en": "Tianhe District government: the Tianhe Road district",
        "ar": "حكومة منطقة تيانخه: منطقة شارع تيانخه"
      },
      "url": "http://www.thnet.gov.cn/zjth/tzth/zlpt/content/post_9126462.html"
    },
    {
      "label": {
        "zh": "天河区政府：「中国第一 MALL」天河城迎变",
        "en": "Tianhe District government: Teemall, China's first mall",
        "ar": "حكومة منطقة تيانخه: تيمول، أول مول في الصين"
      },
      "url": "http://www.thnet.gov.cn/zjth/tzth/tzdt/tzthtw/content/post_10210007.html"
    },
    {
      "label": {
        "zh": "广州市政府：正佳广场",
        "en": "Guangzhou government: Grandview Mall",
        "ar": "حكومة قوانغتشو: غراندفيو مول"
      },
      "url": "https://www.gz.gov.cn/zfjgzy/gzswhgdlyj/ggfw/lytj/content/post_2991523.html"
    },
    {
      "label": {
        "zh": "新华网瞭望：广州天河区商圈「流量密码」",
        "en": "Xinhua Outlook: the Tianhe district's traffic formula",
        "ar": "شينخوا أوتلوك: معادلة الزحام في منطقة تيانخه"
      },
      "url": "http://lw.news.cn/2024-03/11/c_1310767201.htm"
    },
    {
      "label": {
        "zh": "越秀区政府：北京路千年古道遗址",
        "en": "Yuexiu District government: the Beijing Road ancient-road site",
        "ar": "حكومة منطقة يوى شيو: موقع الطريق القديم في شارع بكين"
      },
      "url": "http://www.beijinglu.yuexiu.gov.cn/bjl/pc_bjl/lydl_bjl/jd_bjl/qnsy_bjl/20181116/detail-208456.shtml"
    },
    {
      "label": {
        "zh": "赢商网：7 强争霸的天河路商圈，为啥个个都是赢家",
        "en": "Winshang: seven rivals on Tianhe Road, why every one wins",
        "ar": "وينشانغ: سبعة منافسين في شارع تيانخه، ولماذا يفوز الجميع"
      },
      "url": "http://m.winshang.com/news682927.html"
    },
    {
      "label": {
        "zh": "腾讯新闻：天河路商圈二十多年如何步步升级",
        "en": "Tencent News: how Tianhe Road upgraded step by step over twenty years",
        "ar": "أخبار تينسنت: كيف ارتقى شارع تيانخه خطوةً خطوة على مدى عشرين عامًا"
      },
      "url": "https://news.qq.com/rain/a/20230505A068NW00"
    }
  ]
};

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
    title: { zh: "周五照常上班", en: "Friday is a working day", ar: "الجمعة يوم عمل" },
    body: {
      zh: "中国的周末是周六和周日，周五和平常一样上班上课。要去清真寺做主麻，需要自己在日程里留出往返时间。",
      en: "The weekend here is Saturday and Sunday, so Friday runs like any other working day. If you are going to a mosque for Jumu‘ah, leave room in your own schedule for the journey there and back.",
      ar: "عطلة نهاية الأسبوع هنا هي السبت والأحد، والجمعة يوم عمل كسائر الأيام. فإن كنتم ستذهبون إلى المسجد لصلاة الجمعة، فاتركوا في جدولكم وقتًا للذهاب والعودة.",
    },
  },
  {
    id: "table",
    title: { zh: "一桌菜是大家一起吃的", en: "The dishes belong to the table", ar: "الأطباق مشتركة على المائدة" },
    body: {
      zh: "菜上齐后放在转盘上，谁想吃什么就转过来夹一点 —— 转之前看一眼，别人可能正伸着筷子。很多餐厅会另外给一双「公筷」，专门用来把菜夹到自己碗里。等主人先动筷子再开始；筷子别竖着插在饭里。有不想吃的，留在盘里就好。",
      en: "The dishes arrive and go on the turntable; you turn what you want towards you and take a little — glancing first, since someone may be mid-reach. Many restaurants also lay out a pair of serving chopsticks for moving food to your own bowl. Wait for the host to start, and never stand chopsticks upright in rice. Anything you would rather not eat can simply stay on the plate.",
      ar: "تصل الأطباق وتوضع على القرص الدوّار؛ تديرون ما تريدون نحوكم وتأخذون قليلًا — مع نظرة أولًا، فقد تكون يد أحدهم ممتدّة. وتضع مطاعم كثيرة عيدانًا مخصّصة لنقل الطعام إلى وعائكم. انتظروا المضيف ليبدأ، ولا تغرزوا العيدان عمودية في الأرز. وما لا ترغبون في تناوله يمكن أن يبقى في الطبق.",
    },
  },
  {
    id: "toast",
    title: { zh: "以茶代酒，有现成的一句话", en: "Tea in place of wine — there is a phrase for it", ar: "الشاي بدل النبيذ — وللأمر عبارة جاهزة" },
    body: {
      zh: "正式饭局上有人举杯敬酒时，举起茶杯或水杯一起碰就可以。想说得地道一点，就说「我以茶代酒」（wǒ yǐ chá dài jiǔ），意思是用茶代替酒回敬。",
      en: "When glasses go up at a formal dinner, raise your tea or water and clink along. If you want the local phrase, it is wǒ yǐ chá dài jiǔ — “tea in place of wine”.",
      ar: "حين تُرفع الكؤوس في عشاء رسمي، ارفعوا كوب الشاي أو الماء وشاركوا القرع. وإن أردتم العبارة المحلية فهي «وو يي تشا داي جيو»، أي «الشاي بدل النبيذ».",
    },
  },
  {
    id: "no-tip",
    title: { zh: "日常消费不用另给小费", en: "Everyday spending does not need a tip", ar: "المصروفات اليومية لا تحتاج إكرامية" },
    body: {
      zh: "餐厅、出租车、便利店按账单付就行，日常消费通常不另给小费。酒店的行李或客房服务想表示感谢，随自己心意。",
      en: "In restaurants, taxis and shops you simply pay the bill; everyday spending here does not usually involve a tip. If you want to thank a porter or housekeeping at the hotel, that is your own call.",
      ar: "في المطاعم وسيارات الأجرة والمتاجر تدفعون الفاتورة فحسب؛ فالمصروفات اليومية هنا لا تقترن عادةً بإكرامية. وإن أردتم شكر عامل الحقائب أو خدمة الغرف في الفندق فذلك متروك لكم.",
    },
  },
  {
    id: "handshake",
    title: { zh: "握手、称呼与合影", en: "Handshakes, names and photos", ar: "المصافحة والأسماء والصور" },
    body: {
      zh: "商务场合握手很常见，先看对方是否伸手；不方便握手时，点头微笑、手放在胸口就可以。中国人姓在前、名在后，不确定怎么称呼，直接问一句「我该怎么称呼您？」最省事。想和谁合影先问一声；别人举起手机而你不想入镜，可以说「不好意思，我不想拍照，谢谢」。",
      en: "Handshakes are common in business settings — see whether a hand comes out first. If you would rather not, a nod, a smile and a hand to your chest does the job. Chinese names put the family name first, and if you are unsure how to address someone, the simplest thing is to ask: “How should I address you?” If you would like a photo with someone, ask first; and if a phone comes up and you would rather not be in the picture, “Sorry, I would rather not be photographed, thank you” settles it.",
      ar: "المصافحة شائعة في المواقف المهنية — انظروا أولًا إن امتدّت اليد. وإن لم ترغبوا، فإيماءة وابتسامة ويد على الصدر تكفي. وتأتي الأسماء الصينية باسم العائلة أولًا، وإن لم تعرفوا كيف تخاطبون أحدهم فأبسط شيء أن تسألوه: «كيف أناديك؟». وإن أردتم صورة مع أحد فاسألوه أولًا؛ وإن رُفع هاتف ولم ترغبوا في الظهور فقولوا: «عذرًا، لا أرغب في التصوير، شكرًا».",
    },
  },
  {
    id: "personal-questions",
    title: { zh: "被问到私人问题时", en: "When a question gets personal", ar: "حين يصبح السؤال شخصيًا" },
    body: {
      zh: "初次见面可能会被问到年龄、有没有结婚、孩子几个 —— 在这里多半是闲聊的开场白。不想答的话，笑一下换个话题就行，比如问问对方广州哪家早茶好吃，一般就接过去了。另外，「吃了吗」是一句打招呼，不一定是要请你吃饭。",
      en: "On a first meeting you may be asked your age, whether you are married, how many children you have — here it is usually just how small talk begins. If you would rather not answer, a smile and a change of subject works; ask them where they go for yum cha and the conversation moves on. And “have you eaten?” is a greeting as much as a question.",
      ar: "في أول لقاء قد يُسأل أحدكم عن عمره أو زواجه أو عدد أولاده — وهي هنا غالبًا بداية دردشة لا أكثر. وإن لم تودّوا الإجابة، فابتسامة وتغيير الموضوع يكفيان؛ اسألوهم أين يتناولون اليوم تشا وسينتقل الحديث. و«هل أكلت؟» تحيةٌ بقدر ما هي سؤال.",
    },
  },
  {
    id: "soft-no",
    title: { zh: "听到「再研究一下」", en: "When you hear “we’ll look into it”", ar: "حين تسمعون «سندرس الأمر»" },
    body: {
      zh: "「我们再研究一下」「回头再说」这样的话，含义要看后续，不必当场替对方下结论。最省事的做法是当面把下一步定下来：「那我周四再跟您确认一次，可以吗？」有了具体时间，事情就清楚了。",
      en: "“We’ll look into it”, “let’s talk later” — what they mean depends on what follows, and there is no need to decide for the other person on the spot. The simplest move is to fix the next step while you are still face to face: “Shall I check back with you on Thursday?” Once there is a time, things get clear.",
      ar: "«سندرس الأمر» أو «نتحدث لاحقًا» — معناها يتّضح بما يليها، ولا داعي لأن تقرّروا نيابةً عن الطرف الآخر في الحال. وأسهل خطوة أن تحدّدوا الموعد التالي وأنتم وجهًا لوجه: «هل أعود إليكم يوم الخميس؟» فمتى وُجد موعد، اتّضح الأمر.",
    },
  },
  {
    id: "spicy",
    title: { zh: "点菜时把要求说清楚", en: "Say exactly what you want when ordering", ar: "قولوا بوضوح ما تريدونه عند الطلب" },
    body: {
      zh: "「不要辣」和「少辣」是两个不同的要求，说清楚你要哪一种。同样，不吃某样东西、要少油少盐，都直接说出来最有效；本页的中文短句可以直接给店员看。",
      en: "“No chilli” and “mild” are two different requests — say which one you mean. The same goes for an ingredient you avoid or a lighter hand with oil and salt: saying it plainly works best, and the Chinese phrases on this page can be shown straight to the waiter.",
      ar: "«بلا فلفل حار» و«خفيف الحرارة» طلبان مختلفان — حدّدوا أيّهما تقصدون. وكذلك أي مكوّن تتجنّبونه أو رغبتكم في زيت وملح أقل: قولوها بوضوح، والعبارات الصينية في هذه الصفحة يمكن عرضها مباشرة على العامل.",
    },
  },
  {
    id: "arcade",
    title: { zh: "街边为什么有一条连着的走廊", en: "Why the pavement runs under the buildings", ar: "لماذا يمتدّ الرصيف تحت المباني" },
    body: {
      zh: "老城的街上，楼房二层往外挑出来，底下让出一条连着的走廊，这叫骑楼。广州夏天日头毒、雨也说下就下，柱廊下能遮阳避雨。恩宁路一带还留着成片的骑楼，走过去看看柱子和楼上的窗花。",
      en: "In the old city the upper floors jut out over the street, leaving a covered walkway beneath them. These are qilou, arcade houses. Guangzhou summers are fierce and the rain arrives without notice, and the colonnade gives shade and shelter. Enning Road still has whole stretches of them — walk along and look at the columns and the window frames above.",
      ar: "في المدينة القديمة تبرز الطوابق العليا فوق الشارع تاركةً ممرًا مسقوفًا تحتها. تسمّى هذه المباني «تشي لو». وصيف قوانغتشو قاسٍ والمطر يأتي فجأة، ويمنح الرواق ظلًّا ومأوى. وما زال شارع إن نينغ يحتفظ بامتدادات كاملة منها — امشوا فيه وانظروا إلى الأعمدة وإطارات النوافذ في الأعلى.",
    },
  },
  {
    id: "punctual",
    title: { zh: "写几点就是几点", en: "The time on the invitation is the time", ar: "الموعد المكتوب هو الموعد" },
    body: {
      zh: "会议、接送、饭局写的时间就是开始时间，提前五分钟到是常态。路上要晚了，先发条消息说明预计到达时间。",
      en: "Meetings, pick-ups and dinners begin at the time written down, and arriving five minutes early is normal. If traffic is going to make you late, send a message with the time you now expect to arrive.",
      ar: "تبدأ الاجتماعات والمواعيد والعشاءات في الوقت المكتوب، والوصول قبله بخمس دقائق أمر عادي. وإن أخّركم الطريق فأرسلوا رسالة توضّح وقت وصولكم المتوقّع.",
    },
  },
];

/* ------------------------------------------------------------------ */
/* 自由行建议路线（研究已核实官方来源；未预订，时长为规划参考）        */
/* ------------------------------------------------------------------ */

export type Route = {
  id: string;
  /** public/images/<imageKey>.jpg，见 lib/image-credits.ts */
  imageKey?: string;
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
    // 大剧院与西塔的实景。原来那张 cbd.jpg 带 500px 水印，不再使用
    // （不裁剪、不抹水印，就是不用它）。
    imageKey: "opera",
    title: {
      zh: "花城广场 · 新中轴线（必去）",
      en: "Huacheng Square · the new central axis (do not miss)",
      ar: "ساحة هواتشنغ · المحور المركزي الجديد (لا تفوّتوها)",
    },
    duration: {
      zh: "傍晚到夜里，约 3 小时",
      en: "Late afternoon into night, about 3 hours",
      ar: "من العصر إلى الليل، نحو 3 ساعات",
    },
    bestFor: {
      zh: "天黑前一小时到，看着城市亮起来。这是广州最想给你看的一面。",
      en: "Arrive an hour before dark and watch the city light up. This is the face Guangzhou most wants you to see.",
      ar: "اصلوا قبل الغروب بساعة وشاهدوا المدينة تُضاء. هذا هو الوجه الذي تريد قوانغتشو أن تروه.",
    },
    summary: {
      zh: "一片开阔的市民广场，东塔与西塔一左一右立在两边，正前方隔江就是广州塔。广场上那两块歪斜的黑灰色建筑是广州大剧院，扎哈·哈迪德设计 —— 她是伊拉克裔，造型取自被河水冲刷过的两块卵石。旁边是广州图书馆和广东省博物馆。",
      en: "A wide civic square with the East Tower and the West Tower standing on either side of it and the Canton Tower straight ahead across the water. The two tilted dark shapes on the square are the Guangzhou Opera House by Zaha Hadid — Iraqi-born — designed as two pebbles worn smooth by a river. The city library and the Guangdong Museum stand beside it.",
      ar: "ساحة مدنية واسعة يقف على جانبيها البرج الشرقي والبرج الغربي، وأمامها مباشرة عبر الماء برج كانتون. والكتلتان الداكنتان المائلتان في الساحة هما دار أوبرا قوانغتشو من تصميم زها حديد — العراقية المولد — صُمِّمتا كحصاتين صقلهما النهر. وإلى جوارهما مكتبة المدينة ومتحف قوانغدونغ.",
    },
    steps: [
      {
        zh: "酒店 → 广州图书馆 / 大剧院周边 → 花城广场南侧 → 江边看广州塔 → 返回酒店。",
        en: "Hotel → around the city library and opera house → the south side of Huacheng Square → the riverbank for the Canton Tower → back to the hotel.",
        ar: "الفندق ← محيط المكتبة ودار الأوبرا ← الجانب الجنوبي لساحة هواتشنغ ← ضفة النهر لمشاهدة برج كانتون ← العودة إلى الفندق.",
      },
      {
        zh: "步行约一个半小时，其余留给拍照和地下商场。",
        en: "About an hour and a half on foot; the rest for photographs and the mall below.",
        ar: "نحو ساعة ونصف سيرًا، والباقي للتصوير والمركز التجاري تحت الأرض.",
      },
    ],
    transport: {
      zh: "打车到广州图书馆或大剧院一带，接着步行逛广场。",
      en: "Take a taxi to the city library or the opera house, then walk the square from there.",
      ar: "خذوا سيارة أجرة إلى مكتبة المدينة أو دار الأوبرا، ثم تجوّلوا في الساحة سيرًا.",
    },
    tickets: {
      zh: "广场户外散步免费；想看大剧院演出或进馆参观，再查相应场馆的票务与预约。",
      en: "Walking the square outdoors costs nothing; for a performance at the opera house or a visit inside any of the venues, check that venue’s tickets and booking.",
      ar: "التجوّل في الساحة في الخارج مجاني؛ ولحضور عرض في دار الأوبرا أو زيارة داخل أي من المباني، راجعوا تذاكر ذلك المكان وحجزه.",
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
      {
        label: { zh: "扎哈·哈迪德建筑事务所：广州大剧院", en: "Zaha Hadid Architects: Guangzhou Opera House", ar: "زها حديد للعمارة: دار أوبرا قوانغتشو" },
        url: "https://www.zaha-hadid.com/wp-content/uploads/2019/12/guangzhouoperahouse.pdf",
      },
    ],
  },
  {
    id: "canton-tower",
    imageKey: "tower",
    title: {
      zh: "登广州塔",
      en: "Up the Canton Tower",
      ar: "الصعود إلى برج كانتون",
    },
    duration: {
      zh: "约 2 小时，另留排队时间",
      en: "About 2 hours, plus time for the queue",
      ar: "نحو ساعتين، مع وقت إضافي للانتظار",
    },
    bestFor: {
      zh: "两种玩法：买票上塔，看整座城市摊在脚下；或者留在江对岸的花城广场一侧，看这座塔自己亮起来、变色 —— 想拍塔的照片，得在塔外面。",
      en: "Two different outings: buy a ticket and go up, and the city lies open beneath you; or stay on the far bank by Huacheng Square and watch the tower itself light up and change colour. For a photograph of the tower, you need to be outside it.",
      ar: "تجربتان مختلفتان: اشتروا تذكرة واصعدوا فتنبسط المدينة تحتكم؛ أو ابقوا على الضفة المقابلة عند ساحة هواتشنغ وشاهدوا البرج نفسه يُضاء ويغيّر ألوانه. ولالتقاط صورة للبرج عليكم أن تكونوا خارجه.",
    },
    summary: {
      zh: "六百米高，就在你们住的海珠区。塔身是细腰的双曲面钢网，晚上整座塔换色。室内观景层在四百多米，塔上另有高空项目可以另选。",
      en: "Six hundred metres, in your own district of Haizhu. Its waisted hyperboloid steel mesh changes colour at night. The indoor observation deck sits above four hundred metres, with separate high-level attractions you can add.",
      ar: "ستمئة متر، في منطقتكم هايتشو. هيكله الفولاذي الشبكي ذو الخصر النحيل يغيّر لونه ليلًا. ومنصّة المشاهدة الداخلية فوق أربعمئة متر، وفي الأعلى مرافق إضافية يمكن اختيارها على حدة.",
    },
    steps: [
      {
        zh: "酒店 → 广州塔 → 室内观景层。",
        en: "Hotel → Canton Tower → the indoor observation deck.",
        ar: "الفندق ← برج كانتون ← منصة المشاهدة الداخلية.",
      },
      {
        zh: "出塔后可沿同侧江边散步；若要去花城广场，另安排过江交通。",
        en: "Afterwards you can walk the riverbank on the same side; Huacheng Square is across the water, so arrange separate transport for it.",
        ar: "بعد الخروج يمكنكم المشي على ضفة النهر من الجهة نفسها؛ وساحة هواتشنغ على الضفة الأخرى، فرتّبوا لها تنقّلًا منفصلًا.",
      },
    ],
    transport: {
      zh: "打车前往，广州塔和酒店同在海珠区。",
      en: "Go by taxi; the tower is in Haizhu, the same district as your hotel.",
      ar: "اذهبوا بسيارة أجرة؛ البرج في هايتشو، منطقة فندقكم نفسها.",
    },
    tickets: {
      zh: "官网营业时间 09:30–22:30。选票时看清观景层、高空项目与入场时段；各项目的入场时间看所选票种。",
      en: "Official opening hours are 09:30–22:30. When choosing a ticket, check which deck and which high-level attractions it covers and the entry slot; each attraction’s own times depend on the ticket you buy.",
      ar: "مواعيد العمل الرسمية 09:30–22:30. وعند اختيار التذكرة تحقّقوا من المنصّة والمرافق العالية التي تشملها ومن وقت الدخول؛ فمواعيد كل مرفق تتبع نوع التذكرة.",
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
      {
        label: { zh: "广州塔官方网站（含在线购票）", en: "Canton Tower official site (online tickets)", ar: "الموقع الرسمي لبرج كانتون (تذاكر إلكترونية)" },
        url: "https://www.cantontower.com/?lang=zh",
      },
      {
        label: { zh: "海珠区政府：城市名片与游览指引", en: "Haizhu District government: visiting guidance", ar: "حكومة منطقة هايتشو: إرشادات الزيارة" },
        url: "https://www.haizhu.gov.cn/hzdt/ztlm/tzhz/rjhj/lyjd/csmp/content/post_9190964.html",
      },
    ],
  },
  {
    id: "river-cruise",
    imageKey: "river",
    title: {
      zh: "珠江夜游",
      en: "Pearl River night cruise",
      ar: "جولة ليلية في نهر اللؤلؤ",
    },
    duration: {
      zh: "船程约 60 分钟，另留往返与候船时间",
      en: "About 60 minutes on the water, plus getting to the pier and waiting",
      ar: "نحو 60 دقيقة على الماء، مع وقت الذهاب إلى الرصيف والانتظار",
    },
    bestFor: {
      zh: "坐下来不用走路，两岸的灯从眼前一路淌过去。适合放在一天的最后。",
      en: "Sit down, stop walking, and let the lit banks slide past you. A good way to end a day.",
      ar: "اجلسوا وتوقّفوا عن المشي، ودعوا الضفتين المضاءتين تنسابان أمامكم. خاتمة جيدة ليوم كامل.",
    },
    summary: {
      zh: "同一片江景，坐在船上看会不断换角度：桥从头顶掠过，楼群的灯光在水面拉成长线。喜欢看夜景又不想一直走路，可以把这一程放在晚饭后。",
      en: "The same riverfront keeps changing angle from the water: bridges pass overhead, and the lights of the towers stretch into long lines across the surface. If you like a night view but would rather not keep walking, put this after dinner.",
      ar: "المشهد النهري نفسه يغيّر زاويته باستمرار من على الماء: تمرّ الجسور فوق الرؤوس، وتمتدّ أضواء الأبراج خطوطًا طويلة على سطح الماء. وإن كنتم تحبّون مشهد الليل ولا تودّون مواصلة المشي، فاجعلوا هذه الجولة بعد العشاء.",
    },
    steps: [
      {
        zh: "酒店 → 票面上的码头 → 上船约 60 分钟 → 返回酒店。",
        en: "Hotel → the pier printed on your ticket → about 60 minutes aboard → back to the hotel.",
        ar: "الفندق ← الرصيف المذكور في التذكرة ← نحو 60 دقيقة على متن القارب ← العودة إلى الفندق.",
      },
    ],
    transport: {
      zh: "按票面上的码头叫车，别只搜索「珠江夜游」——不同码头相距很远。",
      en: "Take your taxi to the pier printed on the ticket rather than searching for “Pearl River night cruise” — the piers are a long way apart.",
      ar: "اطلبوا السيارة إلى الرصيف المذكور في التذكرة لا بالبحث عن «جولة نهر اللؤلؤ الليلية» — فالأرصفة متباعدة.",
    },
    tickets: {
      zh: "订票时核对码头、船名、路线、楼层与开航时间；想看广州塔，选明确途经的班次。",
      en: "When booking, check the pier, the boat’s name, the route, the deck and the departure time; if you want to see the Canton Tower, choose a sailing that clearly passes it.",
      ar: "عند الحجز تحقّقوا من الرصيف واسم القارب والمسار والطابق وموعد الإقلاع؛ وإن أردتم رؤية برج كانتون فاختاروا رحلة تمرّ به بوضوح.",
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
    // 太古汇招牌的实景。原来那张 tianhe.jpg 是一条看不出是哪里的普通街道。
    imageKey: "taikoo",
    title: {
      zh: "天河路 · 太古汇一带",
      en: "Tianhe Road and Taikoo Hui",
      ar: "شارع تيانخه ومحيط تايكو هوي",
    },
    duration: {
      zh: "半天，约 3–4 小时",
      en: "Half a day, about 3–4 hours",
      ar: "نصف يوم، نحو 3–4 ساعات",
    },
    bestFor: {
      zh: "想看这座城市怎么买东西，安排半天来这里，挑两三家慢慢逛。",
      en: "Half a day to see how this city shops — two or three malls, taken slowly.",
      ar: "نصف يوم لرؤية كيف تتسوّق هذه المدينة — مركزان أو ثلاثة، على مهل.",
    },
    summary: {
      zh: "从太古汇开始，沿天河路往东走：太古汇（高端品牌与宽敞室内）→ 正佳广场（商场里的海洋馆）→ 天环（下沉庭园，可以在户外坐坐）。两三家就够一个下午；其余几家和各自的样子写在「广州商圈」那一章。",
      en: "Start at Taikoo Hui and work along Tianhe Road: Taikoo Hui for the luxury names and the wide interior, Grandview for the aquarium inside a shopping centre, Parc Central for the sunken garden and a seat outdoors. Two or three fill an afternoon comfortably; the others, and what each is like, are in the shopping-districts chapter.",
      ar: "ابدؤوا من تايكو هوي وواصلوا على شارع تيانخه: تايكو هوي للعلامات الفاخرة والمساحة الداخلية الواسعة، ثم غراندفيو لأكواريومه داخل المركز، ثم بارك سنترال لحديقته الغائرة ومقعد في الهواء الطلق. واثنان أو ثلاثة يملأون العصر براحة؛ وبقيتها وطابع كلٍّ منها في فصل مناطق التسوّق.",
    },
    steps: [
      {
        zh: "酒店 → 太古汇 → 正佳广场 → 天环 → 返回。",
        en: "Hotel → Taikoo Hui → Grandview → Parc Central → back.",
        ar: "الفندق ← تايكو هوي ← غراندفيو ← بارك سنترال ← العودة.",
      },
    ],
    transport: {
      zh: "打车到太古汇；接下来的几站按步行导航走，留意路口与商场入口。",
      en: "Take a taxi to Taikoo Hui; walk the rest with your map app, watching for the crossings and which entrance you want.",
      ar: "خذوا سيارة أجرة إلى تايكو هوي؛ وامشوا بقية المحطات بتطبيق الخرائط، مع الانتباه إلى التقاطعات والمدخل المقصود.",
    },
    tickets: {
      zh: "进商场不要钱。正佳的海洋馆要另外买票。",
      en: "The malls themselves cost nothing to enter. The aquarium inside Grandview needs its own ticket.",
      ar: "دخول المراكز نفسها مجاني. أما أكواريوم غراندفيو فيحتاج تذكرة منفصلة.",
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
    id: "beijinglu",
    imageKey: "beijinglu",
    title: {
      zh: "北京路步行街 · 玻璃罩下的古道",
      en: "Beijing Road · the ancient roadway under glass",
      ar: "شارع بكين · الطريق الأثري تحت الزجاج",
    },
    duration: {
      zh: "约 2–3 小时",
      en: "About 2–3 hours",
      ar: "نحو 2–3 ساعات",
    },
    bestFor: {
      zh: "在一条街上同时看到老广州和今天的广州；傍晚再看商铺亮灯，是与古道不同的热闹。",
      en: "Old Guangzhou and today’s Guangzhou on one street; come back towards evening, when the shopfronts light up, for a different kind of bustle from the ancient roadway.",
      ar: "قوانغتشو القديمة وقوانغتشو اليوم في شارع واحد؛ وعودوا قرب المساء حين تُضاء الواجهات لتشهدوا صخبًا مختلفًا عن الطريق الأثري.",
    },
    summary: {
      zh: "2002 年修路，工人在街心挖出了十一层叠在一起的路面，从唐代一直到民国。这段古道没有搬走，就地盖上玻璃罩留在原处：站在玻璃罩旁，透过玻璃看层层叠起的古代路面。看完再拐进两边的巷子，老字号、小吃和骑楼都在那里。",
      en: "During roadworks in 2002, diggers found eleven layers of street surface stacked one on another, from the Tang dynasty down to the twentieth century. The excavation was not moved: it was covered with glass and left where it lay. Stand beside the glass and look through it at those layers of ancient road. Then turn into the side lanes, where the old shops, the street food and the arcades are.",
      ar: "في أعمال الطرق عام 2002 عثر الحفّارون على إحدى عشرة طبقة من سطح الشارع فوق بعضها، من عهد تانغ حتى القرن العشرين. ولم يُنقل الاكتشاف: غُطّي بالزجاج وتُرك في موضعه: قفوا إلى جانب الزجاج وانظروا من خلاله إلى طبقات الطريق القديم. ثم انعطفوا إلى الأزقة الجانبية، حيث المتاجر العريقة وأكل الشارع والأروقة.",
    },
    steps: [
      {
        zh: "酒店 → 北京路北段（千年古道玻璃罩）→ 沿步行街往南 → 老字号与广百 → 返回。",
        en: "Hotel → north end of Beijing Road (the glass over the ancient road) → south along the pedestrian street → the old shops and Guangbai department store → back.",
        ar: "الفندق ← الطرف الشمالي لشارع بكين (الزجاج فوق الطريق القديم) ← جنوبًا عبر شارع المشاة ← المتاجر العريقة ومتجر قوانغباي ← العودة.",
      },
    ],
    transport: {
      zh: "打车到北京路步行街口；街内只能步行。",
      en: "Taxi to the entrance of the pedestrian street; inside it is walking only.",
      ar: "سيارة أجرة إلى مدخل شارع المشاة؛ وداخله المشي فقط.",
    },
    tickets: {
      zh: "免费。古道遗址露天可看；店铺营业时间以现场为准。",
      en: "Free. The ancient-road site is viewable in the open; shop hours as posted.",
      ar: "مجاني. موقع الطريق القديم مكشوف للعيان؛ ومواعيد المتاجر حسب المعلن.",
    },
    copy: [
      {
        id: "beijinglu-addr",
        label: { zh: "给司机看：北京路步行街", en: "Show the driver: Beijing Road", ar: "أظهرها للسائق: شارع بكين" },
        chinese: "请带我去北京路步行街，广州市越秀区北京路。",
      },
    ],
    sources: [
      {
        label: { zh: "越秀区政府：北京路千年古道遗址", en: "Yuexiu District government: the Beijing Road ancient-road site", ar: "حكومة منطقة يوى شيو: موقع الطريق القديم في شارع بكين" },
        url: "http://www.beijinglu.yuexiu.gov.cn/bjl/pc_bjl/lydl_bjl/jd_bjl/qnsy_bjl/20181116/detail-208456.shtml",
      },
    ],
  },
  {
    id: "xiguan",
    imageKey: "shamian",
    title: {
      zh: "沙面 · 与西关骑楼",
      en: "Shamian · and the Xiguan arcades",
      ar: "شاميان · وأروقة شيغوان",
    },
    duration: {
      zh: "约 5–6 小时，含市内交通与休息",
      en: "About 5–6 hours, including travel across the city and breaks",
      ar: "نحو 5–6 ساعات، تشمل التنقل داخل المدينة والاستراحات",
    },
    bestFor: {
      zh: "适合有一整段空闲、想慢慢走老城的时候。",
      en: "For a stretch of free time when you feel like taking the old city slowly.",
      ar: "لوقت فراغ متّصل حين ترغبون في التمهّل في المدينة القديمة.",
    },
    summary: {
      zh: "恩宁路的骑楼把二楼伸到人行道上，柱廊替行人遮阳避雨；到永庆坊看街巷、找一间小店坐坐，再换到沙面看树荫里的欧式老建筑。一趟散步，读到老广州两种不同的街道表情。",
      en: "On Enning Road the arcade houses push their upper floors out over the pavement, and the colonnade gives shade and shelter. Walk the lanes at Yongqingfang, sit down somewhere small, then move on to Shamian for the European buildings under the trees. One outing, two quite different faces of the old city.",
      ar: "في شارع إن نينغ تمدّ مباني الأروقة طوابقها العليا فوق الرصيف، ويمنح الرواق ظلًّا ومأوى. تجوّلوا في أزقة يونغتشينغفانغ واجلسوا في محلّ صغير، ثم انتقلوا إلى شاميان لرؤية المباني الأوروبية تحت الأشجار. جولةٌ واحدة، ووجهان مختلفان للمدينة القديمة.",
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
      zh: "酒店到永庆坊打车；两处之间按体力选择步行或打车；沙面结束后返程。",
      en: "Taxi from the hotel to Yongqingfang; between the two areas, walk or take a short taxi as you prefer; a taxi back from Shamian at the end.",
      ar: "سيارة أجرة من الفندق إلى يونغتشينغفانغ؛ وبين الموقعين امشوا أو خذوا سيارة قصيرة كما تفضّلون؛ ثم سيارة للعودة من شاميان.",
    },
    tickets: {
      zh: "这条路线以户外街巷散步为主；沿途的博物馆、故居或演出另看门票与预约。",
      en: "This route is mostly walking outdoors; for the museums, historic houses or performances along the way, check their own tickets and booking.",
      ar: "هذا المسار مشيٌ في الشوارع غالبًا؛ أما المتاحف والبيوت التاريخية والعروض على الطريق فراجعوا تذاكرها وحجزها على حدة.",
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

export type FoodNote = { id: string; title: L10n; body: L10n; url?: string; imageKey?: string };

export const FOOD_NOTES: FoodNote[] = [
  {
    "id": "morning-tea",
    "imageKey": "dimsum",
    "title": {
      "zh": "早茶",
      "en": "Morning tea (yum cha)",
      "ar": "شاي الصباح"
    },
    "body": {
      "zh": "一壶茶，几笼点心，坐一个上午。广州人管这叫「叹早茶」，叹就是慢慢享受的意思 —— 这是一件不该赶的事。点心一笼一笼点，吃完再加，留足 60 到 90 分钟。",
      "en": "A pot of tea, a few steamer baskets, a whole morning at the table. Cantonese call it taan jou cha — taan meaning to savour slowly. It is not a thing to rush: order a basket at a time and add more as you go. Allow 60 to 90 minutes.",
      "ar": "إبريق شاي، وبضع سلال بخار، وصباح كامل حول الطاولة. يسمّيها أهل كانتون «تان جاو تشا»، و«تان» أن تتمهّل وتتلذّذ — فهي ليست مما يُستعجل. اطلب سلة تلو الأخرى وزد كلما أردت، وخصّص لها من 60 إلى 90 دقيقة."
    },
    "url": "https://wglj.gz.gov.cn/gzdt/zwxx/content/post_10755149.html"
  },
  {
    "id": "changfen",
    "imageKey": "changfen",
    "title": {
      "zh": "肠粉",
      "en": "Rice noodle rolls (changfen)",
      "ar": "لفائف الأرز"
    },
    "body": {
      "zh": "米浆在蒸屉上摊成极薄的一张皮，卷上馅，淋一勺豉油。刚出锅的时候滑得几乎不用嚼。名字里那个「肠」说的是它卷起来的样子，不是肠子 —— 很多人第一次听都会愣一下。",
      "en": "Rice batter is spread into a paper-thin sheet on the steamer, rolled around a filling and finished with a spoonful of soy. Straight out of the steamer it is so slippery you hardly chew. The chang in its name describes the roll, not intestines — the question comes up every time.",
      "ar": "يُفرَد خليط الأرز طبقةً رقيقة كالورق فوق البخار، ثم يُلفّ حول الحشوة ويُسقى بملعقة صويا. وحين يخرج من البخار يكون من النعومة بحيث تكاد لا تمضغه. و«تشانغ» في اسمه تصف اللفّة لا الأمعاء — وهو سؤال يتكرر دائمًا."
    },
    "url": "https://www.gz.gov.cn/zlgz/whgz/content/post_9674292.html"
  },
  {
    "id": "tingzai",
    "imageKey": "congee",
    "title": {
      "zh": "艇仔粥",
      "en": "Sampan congee",
      "ar": "عصيدة القوارب"
    },
    "body": {
      "zh": "从前珠江上住着一整群以船为家的人。他们撑着小艇在江面上卖粥，煮好了从船舷递到岸上或者另一条船上，所以叫艇仔粥。现在都在岸上的店里吃了，名字留了下来。",
      "en": "The Pearl River once held a whole population who lived on their boats. They cooked congee on the water and passed the bowls up from sampan to shore — hence sampan congee. It is eaten in shops on dry land now, but the name stayed.",
      "ar": "كان في نهر اللؤلؤ يومًا جماعةٌ كاملة تسكن قواربها. كانوا يطبخون العصيدة على الماء ويمدّون الأوعية من القارب إلى الضفة — ومن هنا جاء اسمها «عصيدة القوارب». تُؤكل اليوم في محال على البرّ، لكن الاسم بقي."
    }
  },
  {
    "id": "dessert",
    "imageKey": "ginger",
    "title": {
      "zh": "甜品",
      "en": "Desserts",
      "ar": "الحلويات"
    },
    "body": {
      "zh": "姜撞奶有点像餐桌上的小实验：热奶冲进姜汁，静置之后慢慢凝成嫩滑的一碗，入口先是奶香，再有姜的微辣。喜欢甜品，还可以试双皮奶、绿豆沙，或者另点一份马蹄糕。",
      "en": "Ginger milk curd is a small experiment at the table: hot milk is poured onto ginger juice, left to stand, and it slowly sets into a soft, smooth bowlful. The first taste is milk, then the gentle heat of the ginger. If you like desserts, double-skin milk and mung bean soup are worth trying too, or a plate of water chestnut cake.",
      "ar": "حليب الزنجبيل المخثّر أشبه بتجربة صغيرة على المائدة: يُصبّ الحليب الساخن على عصير الزنجبيل ويُترك ليستقرّ، فيتماسك رويدًا في وعاء ناعم طريّ. أول المذاق حليب، ثم حرارة الزنجبيل الخفيفة. وإن كنتم تحبّون الحلويات فجرّبوا أيضًا حليب الطبقتين وحساء الفاصولياء الخضراء، أو طبقًا من كعكة كستناء الماء."
    },
    "url": "https://www.gz.gov.cn/zlgz/whgz/content/post_9047632.html"
  },
  {
    "id": "roast-goose",
    "imageKey": "goose",
    "title": {
      "zh": "烧鹅",
      "en": "Roast goose",
      "ar": "الإوز المشوي"
    },
    "body": {
      "zh": "广州的经典烧味之一。黄埔长洲岛的深井村有一种做法：地上挖一口干井，井底埋缸，缸里烧荔枝木炭，鹅吊在井口的铁枝上，靠井壁的热力烤熟。上桌是斩好的一碟，皮金红发亮，一咬脆得有声，底下的肉还是嫩的。蘸一点酸梅酱解腻，配一碗白饭也很合适。",
      "en": "One of the classic Cantonese roasts. In Shenjing village on Changzhou Island they roast it in a dry well: a clay jar set into the floor, lychee-wood charcoal burning inside, the geese hung from iron bars across the mouth so the heat of the walls cooks them. It arrives chopped on a plate, the skin amber and glossy and audibly crisp, the meat beneath still tender. A little sour-plum sauce cuts the richness, and a bowl of rice alongside suits it well.",
      "ar": "من المشويّات الكانتونية الكلاسيكية. في قرية شنجينغ بجزيرة تشانغتشو يُشوى داخل بئر جافة: جرّة فخارية في القاع، وفحم خشب الليتشي يشتعل فيها، والإوزّ معلّق من قضبان حديدية على الفوهة فتنضجه حرارة الجدران. ويصل مقطّعًا في طبق، جلده كهرمانيّ لامع ومقرمش بصوت مسموع، واللحم تحته طريّ. وقليل من صلصة البرقوق الحامض يخفّف الدسم، ووعاء أرز إلى جانبه يناسبه تمامًا."
    },
    "url": "https://lvyou.ycwb.com/2019-04/19/content_30243026.htm"
  },
  {
    "id": "squab",
    "title": {
      "zh": "红烧乳鸽",
      "en": "Roast squab",
      "ar": "الحمام الصغير المشوي"
    },
    "body": {
      "zh": "同样是乳鸽，广式红烧做法把重点放在那层脆皮：先卤后炸，外皮薄脆，里面留着肉汁。喜欢这道菜，可以留意中山石岐乳鸽 —— 一百多年前华侨带回的良种与本地鸽杂交而成。上桌可请店员切开，趁热吃，边缘的脆皮和中间的厚肉是两种口感。",
      "en": "In the Cantonese version of squab everything is aimed at the skin: braised first, then fried, so the outside turns thin and crisp while the juices stay inside. If you take to it, look out for the Shiqi squab of Zhongshan — a breed crossed a century ago from birds that returning overseas Chinese brought home. Ask for it to be cut at the table and eat it hot; the crisp edges and the thicker meat are two quite different mouthfuls.",
      "ar": "في النسخة الكانتونية من الحمام يتّجه كل شيء نحو الجلد: يُطهى في المرق أولًا ثم يُقلى، فيصير الخارج رقيقًا مقرمشًا بينما تبقى العصارة في الداخل. وإن أعجبكم فابحثوا عن حمام شيتشي من تشونغشان — سلالة هُجّنت قبل قرن من طيور أعادها الصينيون المغتربون. اطلبوا تقطيعه على المائدة وكلوه ساخنًا؛ فالأطراف المقرمشة واللحم الأكثر سماكة مذاقان مختلفان."
    },
    "url": "https://www.zs.gov.cn/zjzs/lygg/mytc/content/post_2399451.html"
  },
  {
    "id": "seafood",
    "imageKey": "seafood",
    "title": {
      "zh": "海鲜：即捞即食",
      "en": "Seafood, netted and cooked on the spot",
      "ar": "المأكولات البحرية: تُصطاد وتُطهى فورًا"
    },
    "body": {
      "zh": "在带活鲜水缸的粤菜馆，选鱼本身就是点菜的一部分：看看鱼虾，挑好后称重，再选做法。清蒸鱼配姜葱与豉油，重点是鱼肉的鲜甜。先问清价格按斤还是按只、加工费是否另算；在中国，一市斤是 500 克。",
      "en": "In a Cantonese restaurant with live tanks, choosing the fish is part of ordering: look over what is swimming, pick one, have it weighed, then choose how it should be cooked. A steamed fish comes with ginger, spring onion and soy, and the point of it is the sweetness of the flesh. Ask first whether the price is by weight or by the piece and whether cooking is charged separately — and note that one Chinese jin is 500 grams.",
      "ar": "في مطعم كانتوني بأحواض حيّة، يكون اختيار السمكة جزءًا من الطلب: انظروا إلى ما في الأحواض، اختاروا، ثم تُوزن وتختارون طريقة الطهي. والسمك المطهو بالبخار يأتي بالزنجبيل والبصل الأخضر والصويا، ومقصده حلاوة اللحم. واسألوا أولًا هل السعر بالوزن أم بالقطعة وهل تُحتسب أجرة الطهي على حدة — وانتبهوا أن «الجين» الصيني يساوي 500 غرام."
    },
    "url": "https://www.gz.gov.cn/ysgz/xwdt/ysdt/content/post_10421238.html"
  },
  {
    "id": "soup",
    "title": {
      "zh": "老火靓汤",
      "en": "Slow-fired soup",
      "ar": "الحساء البطيء"
    },
    "body": {
      "zh": "小火慢煲，把食材的味道一点点熬进汤里，这就是老火汤的耐心。到粤菜馆可以问一句「今天的例汤是什么？」：先听食材，再决定要不要来一碗。它常是点心和大菜之间，让人慢下来的一口。",
      "en": "A low flame, a long pot, and the flavour of the ingredients drawn slowly into the broth — that patience is the whole idea of slow-fired soup. In a Cantonese restaurant you can simply ask what today’s soup is: hear what is in it, then decide whether you want a bowl. It usually lands between the dim sum and the main dishes, and it is the part of the meal that slows everyone down.",
      "ar": "نارٌ هادئة وقِدر طويل الصبر، ونكهة المكوّنات تُسحب رويدًا إلى المرق — هذا الصبر هو فكرة الحساء البطيء كلها. وفي المطعم الكانتوني يكفي أن تسألوا ما حساء اليوم: اسمعوا مكوّناته ثم قرّروا إن كنتم تريدون وعاءً. وهو يأتي عادةً بين الديم سم والأطباق الرئيسية، وهو الجزء الذي يُبطئ إيقاع المائدة."
    }
  },
  {
    "id": "chaoshan-beef",
    "imageKey": "beef",
    "title": {
      "zh": "潮汕牛肉火锅",
      "en": "Chaoshan beef hotpot",
      "ar": "هوت بوت اللحم البقري على طريقة تشاوشان"
    },
    "body": {
      "zh": "锅底是一锅清汤，不辣，为的是衬出牛肉本身的味道。牛肉按部位分盘：肥一点的、瘦一点的、带筋的，口感各不相同。第一次可以点两三种，请店员说明各自怎么涮；涮熟了再吃。最后那锅汤也入了味，可以盛一碗。",
      "en": "The broth is clear and not spicy, and that is the point: it lets the beef taste of itself. The meat arrives by cut — a fattier one, a leaner one, one with more sinew — and each eats differently. For a first visit, order two or three and ask the staff how each should be cooked; take it out once it is done. By the end the broth has taken on the flavour too, and a bowl of it is worth asking for.",
      "ar": "المرق صافٍ وغير حارّ، وهذا هو المقصد: أن يترك اللحم يعبّر عن نفسه. ويأتي اللحم بحسب القطع — أدسم، أهزل، أكثر عصبًا — ولكلٍّ مذاق وقوام. وفي أول زيارة اطلبوا قطعتين أو ثلاثًا واسألوا العاملين كيف تُسلق كل واحدة؛ وكلوها بعد نضجها. وفي النهاية يكون المرق قد اكتسب النكهة، ويستحق أن تطلبوا وعاءً منه."
    },
    "url": "https://zh.wikipedia.org/zh-hans/%E6%BD%AE%E6%B1%95%E7%89%9B%E8%82%89%E7%81%AB%E9%94%85"
  },
  {
    "id": "white-cut-chicken",
    "imageKey": "chicken",
    "title": {
      "zh": "白切鸡",
      "en": "White-cut chicken",
      "ar": "الدجاج المسلوق الكانتوني"
    },
    "body": {
      "zh": "整鸡浸熟后斩件上桌，看着最朴素，讲的是皮爽肉细。配的那碟姜葱蘸料是姜蓉葱花用热油泼香的。可以先尝一块原味，再蘸一次，两种味道都试试。",
      "en": "A whole chicken is poached, then chopped and brought to the table — the plainest-looking dish there, and all about smooth skin and fine-grained meat. With it comes a dish of minced ginger and spring onion finished with hot oil. Try a piece on its own first, then a piece through the dip, and taste the difference.",
      "ar": "دجاجة كاملة تُسلق ثم تُقطَّع وتُقدَّم — أبسط الأطباق مظهرًا، وكل شأنها جلد ناعم ولحم دقيق النسيج. ويرافقها طبق من الزنجبيل والبصل الأخضر المفرومين مع زيت ساخن. تذوّقوا قطعة وحدها أولًا، ثم قطعة مع الصلصة، ولاحظوا الفرق."
    }
  },
  {
    "id": "wok-hei",
    "imageKey": "chowfun",
    "title": {
      "zh": "干炒牛河与「镬气」",
      "en": "Beef chow fun and ‘wok hei’",
      "ar": "شعيرية اللحم المقلية و«نَفَس المقلاة»"
    },
    "body": {
      "zh": "宽河粉、牛肉、豆芽、韭黄，猛火快炒。广东人评一碟炒菜好不好，看的是「镬气」—— 锅烧得够热，油和酱在锅边一瞬间焦香，河粉上了色又不断不糊。端上来先闻那阵焦香，再尝河粉的柔韧；趁热吃更能体会镬气。",
      "en": "Wide rice noodles, beef, bean sprouts and yellow chives, tossed fast over a high flame. Cantonese judge a stir-fry by its wok hei, the “breath of the wok”: a pan hot enough that oil and sauce sear at the rim in an instant, the noodles coloured but neither broken nor stuck. When the plate arrives, notice that scorched aroma first, then the chew of the noodles — eaten hot, wok hei is easiest to taste.",
      "ar": "شعيرية أرز عريضة ولحم بقر وبراعم فول وثوم معمّر أصفر، تُقلّب بسرعة على نار عالية. ويحكم الكانتونيون على الطبق المقليّ بـ«ووك هي»، أي نَفَس المقلاة: مقلاة حارّة بما يكفي ليلفح الزيت والصلصة حافتها في لحظة، فتتلوّن الشعيرية دون أن تنقطع أو تلتصق. وحين يصل الطبق، انتبهوا إلى تلك الرائحة المحمّصة أولًا، ثم إلى مرونة الشعيرية — وتناوله ساخنًا أسهل طريقة لتذوّق «ووك هي»."
    }
  }
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
/* 历史传说与可确认事实分开；不把传说年代写成确定事实。 */
/* 宛葛素的身份按传统说法写，并注明史家有争议 —— 不拿宗教史当定论。      */
/* ------------------------------------------------------------------ */

export const CITY_STORY: { lead: L10n; paragraphs: L10n[]; sources: { label: L10n; url: string }[] } = {
  "lead": {
    "zh": "在广州老城，一座为远方来客点过灯的塔，至今还在。",
    "en": "In the old city stands a tower that once lit the way for visitors from far away.",
    "ar": "في المدينة القديمة ما زال قائمًا برجٌ أضاء الطريق يومًا لقادمين من بعيد."
  },
  "paragraphs": [
    {
      "zh": "唐宋两代，来自西亚的阿拉伯与波斯商人乘船到广州做生意。他们上岸的地方后来叫光塔码头，聚居的街区叫蕃坊 —— 商铺、住处与礼拜的地方都在那一带。",
      "en": "Under the Tang and Song dynasties, Arab and Persian merchants sailed to Guangzhou to trade. The landing they used came to be known as the Guangta wharf, and the quarter where they settled as the Fanfang: shops, homes and a place to pray, all in the same few streets.",
      "ar": "في عهدَي تانغ وسونغ، أبحر تجار عرب وفرس إلى قوانغتشو للتجارة. وعُرف مرساهم لاحقًا برصيف قوانغتا، وحيّهم باسم «الفانفانغ»: متاجر ومساكن ومكان للصلاة في الشوارع نفسها."
    },
    {
      "zh": "蕃坊的中心是怀圣寺。中国式的屋檐旁边立着一座圆筒形的塔：表面抹灰，内部是砖砌的双螺旋楼梯，两条梯道各自盘旋而上。它是宣礼塔，也曾为江上的船只指示方向和风向 —— 广州人就叫它光塔。",
      "en": "At the centre of that quarter stood Huaisheng Mosque. Beside Chinese eaves rises a smooth cylindrical tower, rendered in plaster, with two brick spiral staircases winding up inside it. It is a minaret, and it also served ships on the river as a marker and a wind vane — which is why people here call it the Light Tower.",
      "ar": "وفي قلب ذلك الحي قام مسجد هوايشنغ. وإلى جوار الأفاريز الصينية ينهض برج أسطواني أملس مكسوّ بالجصّ، يصعد في داخله سلّمان حلزونيان من الآجر. إنه مئذنة، وكان أيضًا علامةً للسفن في النهر ودوّارة للريح — ولذلك يسمّيه أهل المدينة «برج النور»."
    },
    {
      "zh": "站在光塔路上抬头，中国屋顶与圆塔出现在同一个画面里 —— 两种建筑语言在这里相遇，一看就懂。",
      "en": "Stand on Guangta Road and look up: a Chinese roof and a round minaret in the same frame. Two building traditions meeting, and you can see it without anyone explaining.",
      "ar": "قفي في شارع قوانغتا وانظري إلى الأعلى: سقف صيني ومئذنة مستديرة في مشهد واحد. تقليدان معماريان يلتقيان، وتراهما دون شرح."
    }
  ],
  "sources": [
    {
      "label": {
        "zh": "广州市政府：怀圣寺光塔保护规划",
        "en": "Guangzhou government: conservation plan for Huaisheng Mosque and its minaret",
        "ar": "حكومة قوانغتشو: خطة حفظ مسجد هوايشنغ ومنارته"
      },
      "url": "https://www.gz.gov.cn/zwgk/fggw/szfwj/content/post_10640740.html"
    },
    {
      "label": {
        "zh": "广州市港务局：光塔码头与蕃坊",
        "en": "Guangzhou Port Authority: the Guangta wharf and the foreign quarter",
        "ar": "هيئة ميناء قوانغتشو: رصيف قوانغتا وحيّ التجار"
      },
      "url": "https://gwj.gz.gov.cn/ghzt/gkwh/content/post_10949653.html"
    },
    {
      "label": {
        "zh": "广州市人民政府：海上丝绸之路的起点",
        "en": "Guangzhou municipal government: the start of the Maritime Silk Road",
        "ar": "حكومة بلدية قوانغتشو: نقطة انطلاق طريق الحرير البحري"
      },
      "url": "https://www.gz.gov.cn/zlgz/whgz/content/post_8231821.html"
    }
  ]
};


/* ------------------------------------------------------------------ */
/* 这座城有多大                                                          */
/*                                                                     */
/* 四个数字，各自对应客人这几天真会碰到的东西：机场、展馆、江边的塔、     */
/* 城市经济。数字取官方年度口径（广州统计公报等），来源折在章尾；        */
/* 不做国家之间的强弱比较，也不换算美元。                                */
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
  "lead": {
    "zh": "从机场到江边，看看广州怎样连接世界。",
    "en": "From the airport to the riverfront: how Guangzhou connects with the world.",
    "ar": "من المطار إلى ضفة النهر: كيف تتّصل قوانغتشو بالعالم."
  },
  "intro": [
    {
      "zh": "你们从白云机场抵达，在琶洲参会，空闲时去江边看夜景。机场、展馆和高塔，让这些大数字有了具体的模样。",
      "en": "You arrive through Baiyun Airport, attend the conference in Pazhou, and go down to the river for the night view when there is time. The airport, the exhibition halls and the tower give these large numbers a shape you can picture.",
      "ar": "تصلون عبر مطار بايون، وتحضرون المؤتمر في بازو، وتنزلون إلى النهر لمشاهدة المساء حين يتّسع الوقت. المطار وقاعات المعارض والبرج تمنح هذه الأرقام الكبيرة صورةً ملموسة."
    }
  ],
  "tiles": [
    {
      "id": "gdp",
      "value": {
        "zh": "3.2",
        "en": "3.2",
        "ar": "3.2"
      },
      "unit": {
        "zh": "万亿元 · 2025 年 GDP",
        "en": "trillion yuan · GDP, 2025",
        "ar": "تريليون يوان · الناتج المحلي 2025"
      },
      "note": {
        "zh": "制造、商贸和服务业共同支撑的城市经济",
        "en": "A city economy carried by manufacturing, trade and services",
        "ar": "اقتصاد مدينة تحمله الصناعة والتجارة والخدمات"
      }
    },
    {
      "id": "airport",
      "value": {
        "zh": "8,359",
        "en": "83.6",
        "ar": "83.6"
      },
      "unit": {
        "zh": "万人次 · 白云机场 2025",
        "en": "million passengers · Baiyun, 2025",
        "ar": "مليون مسافر · مطار بايون 2025"
      },
      "note": {
        "zh": "折合每天约 23 万人次进出",
        "en": "About 230,000 passengers a day",
        "ar": "نحو 230 ألف مسافر يوميًا"
      }
    },
    {
      "id": "tower",
      "value": {
        "zh": "600",
        "en": "600",
        "ar": "600"
      },
      "unit": {
        "zh": "米 · 广州塔",
        "en": "m · Canton Tower",
        "ar": "م · برج كانتون"
      },
      "note": {
        "zh": "不登塔，也可以从江岸看它亮灯",
        "en": "You need not go up: the lit tower is a sight from the bank",
        "ar": "لا حاجة للصعود: البرج المضاء مشهدٌ من الضفة"
      }
    },
    {
      "id": "fair",
      "value": {
        "zh": "31",
        "en": "310,000",
        "ar": "310,000"
      },
      "unit": {
        "zh": "万境外采购商 · 第 138 届广交会",
        "en": "overseas buyers · 138th Canton Fair",
        "ar": "مشترٍ أجنبي · معرض كانتون الـ138"
      },
      "note": {
        "zh": "223 个国家和地区的买家汇聚于此（该届）",
        "en": "Buyers from 223 countries and regions, at that edition",
        "ar": "مشترون من 223 دولةً ومنطقة في تلك الدورة"
      }
    }
  ],
  "sources": [
    {
      "label": {
        "zh": "广州2026年政府工作报告",
        "en": "Guangzhou 2026 government work report",
        "ar": "تقرير حكومة قوانغتشو لعام 2026"
      },
      "url": "https://www.gzfao.gov.cn/zwgk/gkml/gzrmzf/bmwj/gfxwj/content/post_266425.html"
    },
    {
      "label": {
        "zh": "广州市统计局：2025 年国民经济和社会发展统计公报",
        "en": "Guangzhou Statistics Bureau: 2025 statistical communiqué",
        "ar": "مكتب إحصاء قوانغتشو: النشرة الإحصائية لعام 2025"
      },
      "url": "https://tjj.gz.gov.cn/zzfwzq/tjkx/content/post_10804061.html"
    },
    {
      "label": {
        "zh": "海珠区政府：广州塔",
        "en": "Haizhu District government: Canton Tower",
        "ar": "حكومة منطقة هايتشو: برج كانتون"
      },
      "url": "https://www.haizhu.gov.cn/zjhz/lyck/content/post_7765705.html"
    },
    {
      "label": {
        "zh": "人民网：第 138 届广交会闭幕，境外采购商创新高",
        "en": "People's Daily: 138th Canton Fair closes with record overseas buyers",
        "ar": "صحيفة الشعب: اختتام معرض كانتون الـ138 برقم قياسي"
      },
      "url": "http://pic.people.com.cn/n1/2025/1104/c1016-40596777.html"
    }
  ]
};

/* ------------------------------------------------------------------ */
/* 科技就在身边                                                          */
/*                                                                     */
/* 「中国很强」不能只写在报表上，要写她这几天亲眼能看到的东西。          */
/* 每一条：是什么、在哪能见到、一个硬数字、来源。不写看不到的。          */
/* ------------------------------------------------------------------ */

export type TechItem = {
  id: string;
  imageKey?: string;
  title: L10n;
  /** 她能在哪、怎么见到。 */
  where: L10n;
  /** 事实与数字。 */
  body: L10n;
};

export const CITY_TECH: {
  lead: L10n;
  intro: L10n;
  items: TechItem[];
  sources: { label: L10n; url: string }[];
} = {
  "lead": {
    "zh": "上车之后你会发现，驾驶位上没有人。",
    "en": "You get in, and then you notice: nobody is in the driver’s seat.",
    "ar": "تركبون، ثم تلاحظون: لا أحد في مقعد السائق."
  },
  "intro": {
    "zh": "在广州，叫一辆车、收一份外卖、买一杯茶，都可能遇到有意思的新体验。",
    "en": "In Guangzhou, calling a car, taking a delivery or buying a cup of tea can each turn into something new worth noticing.",
    "ar": "في قوانغتشو، قد يتحوّل طلب سيارة أو استلام توصيلة أو شراء كوب شاي إلى تجربة جديدة تستحق الانتباه."
  },
  "items": [
    {
      "id": "robotaxi",
      "title": {
        "zh": "坐一次没有司机的车",
        "en": "Ride in a car with no driver",
        "ar": "اركبوا سيارة بلا سائق"
      },
      "where": {
        "zh": "微信里搜小程序「WeRide Go」，看看广州能约的上下车点。",
        "en": "Search the WeChat mini-program “WeRide Go” and look at the pickup and drop-off points available in Guangzhou.",
        "ar": "ابحثوا في وي تشات عن تطبيق «WeRide Go» المصغّر، وانظروا إلى نقاط الركوب والنزول المتاحة في قوانغتشو."
      },
      "body": {
        "zh": "方向盘自己转，车在红灯前停下，转弯、变道、避让行人都由它自己完成。文远知行从 2025 年 9 月起在广州黄埔提供 24 小时全无人商业运营。小程序里可以看当前开放的上下车点和费用；选一段短途，留意它怎样识别路口、等红灯和转弯，比看一段演示视频更直观。",
        "en": "The wheel turns by itself, the car eases up to a red light, and the turns, lane changes and pauses for pedestrians are its own work. WeRide has run a fully driverless commercial service around the clock in Guangzhou’s Huangpu district since September 2025. The mini-program shows the pickup points and fares currently open; take one short hop and watch how it reads a junction, waits at a light and turns — far more telling than any demonstration video.",
        "ar": "يدور المقود وحده، وتتمهّل السيارة عند الإشارة الحمراء، وتتولّى بنفسها الانعطاف وتغيير المسار والتوقّف للمشاة. وتشغّل WeRide خدمة تجارية بلا سائق على مدار الساعة في منطقة هوانغبو بقوانغتشو منذ سبتمبر 2025. ويعرض التطبيق المصغّر نقاط الركوب والأجرة المتاحة حاليًا؛ اختاروا مشوارًا قصيرًا ولاحظوا كيف تقرأ التقاطع وتنتظر الإشارة وتنعطف — وهذا أوضح من أي فيديو توضيحي."
      }
    },
    {
      "id": "robot",
      "title": {
        "zh": "会搭电梯的送物小车",
        "en": "A delivery robot that takes the lift",
        "ar": "روبوت توصيل يركب المصعد"
      },
      "where": {
        "zh": "部分酒店和餐厅提供配送机器人服务。",
        "en": "Some hotels and restaurants run delivery robots.",
        "ar": "تشغّل بعض الفنادق والمطاعم روبوتات توصيل."
      },
      "body": {
        "zh": "物品放进货舱后，小车会自己呼叫电梯、跨楼层送到房门前，再通知你取件。看看它怎样和人共用一部电梯，很有意思。入住时问前台是否有这项服务，有的话可以试一次。",
        "en": "Once your things are in the compartment, the robot calls the lift itself, travels between floors to your door and then lets you know your delivery has arrived. Watching it share a lift with people is the interesting part. Ask at check-in whether the service is available; if it is, it is worth trying once.",
        "ar": "بعد وضع الأغراض في الحجرة، يستدعي الروبوت المصعد بنفسه وينتقل بين الطوابق إلى باب غرفتكم ثم يُعلمكم بوصول الطلب. والمشوّق أن تروه يتشارك المصعد مع الناس. اسألوا الاستقبال عند الوصول إن كانت الخدمة متاحة، وإن كانت فهي تستحق تجربة واحدة."
      }
    },
    {
      "id": "cashless",
      "title": {
        "zh": "一杯茶的小额付款",
        "en": "The price of one cup of tea",
        "ar": "ثمن كوب شاي واحد"
      },
      "where": {
        "zh": "买水、买茶、打车，都是同一个动作。",
        "en": "Water, tea, a taxi — the same gesture every time.",
        "ar": "ماء أو شاي أو سيارة أجرة — الحركة نفسها في كل مرة."
      },
      "body": {
        "zh": "茶饮店、餐厅和许多出租车都能扫码付款。买一杯茶时，看看从点单、付款到取餐，手机怎样把这些小步骤连在一起；支付宝的准备方法在前面的出发准备里。",
        "en": "Tea shops, restaurants and many taxis all take payment by code. When you buy a cup of tea, watch how the phone links the small steps together — ordering, paying, collecting. How to set Alipay up is in the preparation chapter.",
        "ar": "محال الشاي والمطاعم وكثير من سيارات الأجرة تقبل الدفع بالرمز. وعند شراء كوب شاي، لاحظوا كيف يربط الهاتف الخطوات الصغيرة معًا — الطلب والدفع والاستلام. وطريقة تجهيز أليباي في فصل الاستعداد قبل السفر."
      }
    }
  ],
  "sources": [
    {
      "label": {
        "zh": "文远知行：广州黄埔 24 小时全无人商业运营",
        "en": "WeRide: 24/7 fully driverless service in Guangzhou’s Huangpu",
        "ar": "WeRide: خدمة بلا سائق على مدار الساعة في هوانغبو"
      },
      "url": "https://ir.weride.ai/news-releases/news-release-details/weride-launches-247-fully-driverless-robotaxi-service-guangzhous"
    },
    {
      "label": {
        "zh": "文远知行：微信小程序 WeRide Go 预约",
        "en": "WeRide: booking through the WeRide Go mini-program",
        "ar": "WeRide: الحجز عبر تطبيق WeRide Go المصغّر"
      },
      "url": "https://ir.weride.ai/news-releases/news-release-details/weride-makes-robotaxi-booking-effortless-tencents-super-app"
    },
    {
      "label": {
        "zh": "普渡：酒店配送机器人",
        "en": "PUDU: hotel delivery robots",
        "ar": "PUDU: روبوتات التوصيل الفندقية"
      },
      "url": "https://www.pudurobotics.com/en/solutions/hospitality"
    },
    {
      "label": {
        "zh": "官方来华生活指南：支付与通信",
        "en": "Official guide for visitors: payments and connectivity",
        "ar": "الدليل الرسمي للزوار: الدفع والاتصالات"
      },
      "url": "https://english.www.gov.cn/2025special/bizexpatsinchina2025"
    }
  ]
};

/* ------------------------------------------------------------------ */
/* 你们住的这块地：琶洲                                                  */
/* ------------------------------------------------------------------ */

export const PAZHOU: { lead: L10n; paragraphs: L10n[]; sources: { label: L10n; url: string }[] } = {
  "lead": {
    "zh": "你住的地方，曾经靠一座塔迎接远来的商船。",
    "en": "Where you are staying, a tower once welcomed ships in from the sea.",
    "ar": "حيث تقيمون، كان برجٌ يستقبل السفن القادمة من البحر."
  },
  "paragraphs": [
    {
      "zh": "四百多年前，远洋商船沿珠江驶来，望见琶洲塔，就知道广州的外港快到了。那时这里还是江中的一座小岛；塔建于 1597 年，1600 年落成，和另外两座塔一起，在航道上给船指方向。",
      "en": "Four centuries ago, ships coming in from the ocean followed the Pearl River upstream, and when the Pazhou pagoda came into view they knew Guangzhou’s outer harbour was close. Back then this was an island in the river. The tower was begun in 1597 and finished in 1600; with two others along the channel, it told ships where they were.",
      "ar": "قبل أربعة قرون، كانت السفن القادمة من المحيط تصعد نهر اللؤلؤ، وحين تلوح لها باغودا بازو تعرف أن مرفأ قوانغتشو الخارجي صار قريبًا. وكان هذا المكان حينها جزيرة في النهر. بدأ بناء البرج عام 1597 واكتمل عام 1600، ومع برجين آخرين على المجرى كان يدلّ السفن على موضعها."
    },
    {
      "zh": "今天，古塔与展馆、写字楼在同一片城区相遇。各国买家带着订单来广交会，沿江是数字经济企业的办公楼。帆船换成了航班与展位，广州和世界做生意的故事还在继续。",
      "en": "Today the old tower and the exhibition halls and office towers share one district. Buyers from all over arrive at the Canton Fair with their order books, and the riverside blocks house digital-economy firms. The junks have become flights and exhibition stands; the story of Guangzhou trading with the world simply carries on.",
      "ar": "واليوم يتقاسم البرج القديم وقاعات المعارض والأبراج المكتبية منطقة واحدة. يصل المشترون من كل مكان إلى معرض كانتون بدفاتر طلباتهم، وتضمّ المباني المطلّة على النهر شركات الاقتصاد الرقمي. تحوّلت المراكب الشراعية إلى رحلات جوية وأجنحة عرض، وتستمر حكاية تجارة قوانغتشو مع العالم."
    },
    {
      "zh": "想看看那座塔，在地图里搜「琶洲塔」；傍晚沿江边走一段，看两岸灯光，是这一带很舒服的一段路。",
      "en": "To see the tower for yourself, search 琶洲塔 in your map app. A walk along the river towards evening, looking at the lights on both banks, is one of the pleasanter stretches in this district.",
      "ar": "ولرؤية البرج ابحثي عن 琶洲塔 في تطبيق الخرائط. ونزهة على ضفة النهر قرب المساء، مع النظر إلى أضواء الضفتين، من أجمل المسارات في هذه المنطقة."
    }
  ],
  "sources": [
    {
      "label": {
        "zh": "广州市政府：琶洲塔",
        "en": "Guangzhou government: the Pazhou pagoda",
        "ar": "حكومة قوانغتشو: باغودا بازو"
      },
      "url": "https://www.gz.gov.cn/zlgz/whgz/content/post_8091106.html"
    },
    {
      "label": {
        "zh": "广州市政府：魅力琶洲，从海丝起点到创新高地",
        "en": "Guangzhou government: Pazhou, from Silk Road port to innovation hub",
        "ar": "حكومة قوانغتشو: بازو، من ميناء طريق الحرير إلى مركز الابتكار"
      },
      "url": "https://www.gz.gov.cn/ysgz/xwdt/ysdt/content/post_10110019.html"
    },
    {
      "label": {
        "zh": "国家数据局：琶洲人工智能与数字经济试验区案例",
        "en": "National Data Administration: the Pazhou zone case study",
        "ar": "هيئة البيانات الوطنية: دراسة حالة منطقة بازو"
      },
      "url": "https://www.nda.gov.cn/sjj/ywpd/szsh/0109/20250109113547618448454_pc.html"
    }
  ]
};

/* ------------------------------------------------------------------ */
/* 食在广州                                                              */
/*                                                                     */
/* 「食在广州」四个字一百年前就传遍全国。这一节讲的是分量：两千年、        */
/* 三大流派、联合国认的美食之都。清真那句提醒在 FOOD_ADVICE 里说过一次，   */
/* 这里只讲好吃。                                                        */
/* ------------------------------------------------------------------ */

export const FOOD_CULTURE: { lead: L10n; paragraphs: L10n[]; sources: { label: L10n; url: string }[] } = {
  "lead": {
    "zh": "在广州，「吃了吗」真的是一句问候。",
    "en": "In Guangzhou, “have you eaten?” really is how people say hello.",
    "ar": "في قوانغتشو، «هل أكلت؟» هي فعلًا طريقة الناس في إلقاء التحية."
  },
  "paragraphs": [
    {
      "zh": "早茶的「茶」只是开场。桌上是蒸笼、粥碗和一壶慢慢续的茶，想吃什么再添一笼，不必一次点满。广州人说的「叹」，就是把这一餐过得从容一点。",
      "en": "At yum cha the tea is only the opening. What fills the table is steamer baskets, a bowl of congee and a pot that keeps being topped up; you add another basket when you want one, rather than ordering everything at once. Taan, the word people use for it here, simply means taking this meal at an unhurried pace.",
      "ar": "في اليوم تشا لا يكون الشاي إلا البداية. فما يملأ المائدة سلال البخار ووعاء العصيدة وإبريق يُعاد ملؤه؛ وتضيفون سلة أخرى حين ترغبون، بدل أن تطلبوا كل شيء دفعة واحدة. وكلمة «تان» التي يستخدمها أهل المدينة تعني ببساطة أن تأخذوا هذه الوجبة على مهل."
    },
    {
      "zh": "点菜时可以按三种口味来分：清蒸讲鲜，一条鱼只配姜葱豉油；烧味讲香，烧鹅、乳鸽的重点在那层皮；想吃甜的，可以试试姜撞奶或双皮奶。想再往下走一步，隔壁的顺德在 2014 年被联合国教科文组织列为美食之都。",
      "en": "One easy way to order is by the three directions the cooking takes: steamed dishes for freshness, where a whole fish gets only ginger, spring onion and soy; roast dishes for aroma, where goose and squab are really about the skin; and if you feel like something sweet, ginger milk curd or double-skin milk. If you want to go further, neighbouring Shunde was named a UNESCO City of Gastronomy in 2014.",
      "ar": "من أسهل طرق الطلب أن تقسّموا المائدة إلى ثلاثة اتجاهات: المطهوّ على البخار للطزاجة، حيث لا تنال السمكة سوى الزنجبيل والبصل الأخضر والصويا؛ والمشويّ للنكهة، حيث الإوز والحمام قوامهما ذلك الجلد؛ وإن اشتهيتم شيئًا حلوًا فحليب الزنجبيل أو حليب الطبقتين. وإن أردتم التوسّع أكثر، فقد أُدرجت شوندي المجاورة مدينةً للطهي لدى اليونسكو عام 2014."
    }
  ],
  "sources": [
    {
      "label": {
        "zh": "广州市文化广电旅游局：广式早茶",
        "en": "Guangzhou Culture and Tourism Bureau: Cantonese morning tea",
        "ar": "هيئة الثقافة والسياحة في قوانغتشو: شاي الصباح الكانتوني"
      },
      "url": "https://wglj.gz.gov.cn/gzdt/zwxx/content/post_10755149.html"
    },
    {
      "label": {
        "zh": "UNESCO：顺德",
        "en": "UNESCO: Shunde",
        "ar": "اليونسكو: شوندي"
      },
      "url": "https://www.unesco.org/en/creative-cities/shunde"
    }
  ]
};

export const MOSQUES: PlaceCard[] = [
  {
    "id": "xianxian",
    "name": {
      "zh": "清真先贤古墓",
      "en": "Xianxian Ancient Tomb Mosque",
      "ar": "مقبرة شيان شيان ومسجدها"
    },
    "note": {
      "zh": "在解放北路、兰圃旁边。2010 年建成的礼拜殿把伊斯兰元素和岭南建筑的做法结合在一起，进门时可以留意屋檐与殿堂的样子。这里是广州穆斯林聚礼的重要场所。",
      "en": "On Jiefang North Road, next to the Lanpu garden. The prayer hall completed in 2010 brings Islamic elements together with the building tradition of this region — worth looking up at the eaves and the hall as you go in. It is an important place of congregational prayer for Guangzhou’s Muslims.",
      "ar": "في طريق جيفانغ الشمالي إلى جوار حديقة لانبو. وقاعة الصلاة التي اكتملت عام 2010 تجمع عناصر إسلامية مع تقاليد العمارة في هذه المنطقة — ويستحق الأمر أن تتأمّلوا الأفاريز والقاعة عند الدخول. وهو موضع مهم لصلاة الجماعة لمسلمي قوانغتشو."
    },
    "copy": {
      "id": "xianxian-addr",
      "label": {
        "zh": "给司机看：清真先贤古墓",
        "en": "Show the driver: Xianxian Ancient Tomb",
        "ar": "أظهرها للسائق: مقبرة شيان شيان"
      },
      "chinese": "请带我去清真先贤古墓，广州市越秀区解放北路901号之一。"
    },
    "sources": [
      {
        "label": {
          "zh": "广州市人民政府：先贤古墓",
          "en": "Guangzhou municipal government: Xianxian Ancient Tomb",
          "ar": "حكومة بلدية قوانغتشو: مقبرة شيان شيان"
        },
        "url": "https://www.gz.gov.cn/zlgz/gzly/wzgz/zjcs/yslj/content/post_7760215.html"
      }
    ]
  },
  {
    "id": "huaisheng",
    "name": {
      "zh": "怀圣寺（光塔寺）",
      "en": "Huaisheng Mosque (Guangta Mosque)",
      "ar": "مسجد هوايشنغ (مسجد المنارة)"
    },
    "note": {
      "zh": "光塔就在这座寺里。院子中国式的屋檐和圆筒形的塔并立，来礼拜的人和来看建筑的人都有。进门前留意现场关于着装和拍照的提示。",
      "en": "The Light Tower stands within this mosque. In the courtyard, Chinese eaves and the round minaret sit side by side; people come both to pray and to look. Check the notices on dress and photography before you go in.",
      "ar": "تقوم منارة «برج النور» داخل هذا المسجد. وفي الفناء تقف الأفاريز الصينية والمئذنة المستديرة جنبًا إلى جنب؛ ويأتي الناس للصلاة وللنظر معًا. وراجعي إرشادات اللباس والتصوير قبل الدخول."
    },
    "copy": {
      "id": "huaisheng-addr",
      "label": {
        "zh": "给司机看：怀圣寺",
        "en": "Show the driver: Huaisheng Mosque",
        "ar": "أظهرها للسائق: مسجد هوايشنغ"
      },
      "chinese": "请带我去怀圣寺（光塔寺），广州市越秀区光塔路56号。"
    },
    "sources": [
      {
        "label": {
          "zh": "广东省人民政府：怀圣寺和光塔",
          "en": "Guangdong provincial government: Huaisheng Mosque and the light tower",
          "ar": "حكومة مقاطعة قوانغدونغ: مسجد هوايشنغ والمنارة"
        },
        "url": "http://www.gd.gov.cn/zjgd/lyxx/lydt/content/post_73432.html"
      },
      {
        "label": {
          "zh": "越秀区人民政府：怀圣寺",
          "en": "Yuexiu District government: Huaisheng Mosque",
          "ar": "حكومة منطقة يوى شيو: مسجد هوايشنغ"
        },
        "url": "https://www.yuexiu.gov.cn/zjyx/yxjd/zjwh/content/post_8665060.html"
      }
    ]
  },
  {
    "id": "haopan",
    "name": {
      "zh": "濠畔清真寺",
      "en": "Haopan Mosque",
      "ar": "مسجد هاوبان"
    },
    "note": {
      "zh": "明成化年间修建，在濠畔街的巷子里。这座寺不只是礼拜的地方：历史上这里办过回文学校，也办过孤儿院和养老院，是周边穆斯林社区的中心。礼拜之后可以顺着老城的巷子走一走。",
      "en": "Built in the Chenghua era of the Ming dynasty, in the lanes off Haopan Street. It has been more than a place of prayer: over its history it has housed a school teaching Arabic and Chinese, an orphanage and a home for the elderly — the centre of the Muslim community around it. Afterwards it is easy to wander on into the old-city lanes.",
      "ar": "بُني في عهد تشنغهوا من أسرة مينغ، في أزقة شارع هاوبان. ولم يكن مكانًا للصلاة فحسب: فقد ضمّ عبر تاريخه مدرسةً تعلّم العربية والصينية، ودار أيتام، ودارًا للمسنّين — وكان مركز الجالية المسلمة من حوله. وبعد الصلاة يسهل التجوّل في أزقة المدينة القديمة."
    },
    "copy": {
      "id": "haopan-addr",
      "label": {
        "zh": "给司机看：濠畔清真寺",
        "en": "Show the driver: Haopan Mosque",
        "ar": "أظهرها للسائق: مسجد هاوبان"
      },
      "chinese": "请带我去濠畔清真寺，广州市越秀区濠畔街378号。"
    },
    "sources": [
      {
        "label": {
          "zh": "广州市人民政府：濠畔清真寺",
          "en": "Guangzhou municipal government: Haopan Mosque",
          "ar": "حكومة بلدية قوانغتشو: مسجد هاوبان"
        },
        "url": "https://www.gz.gov.cn/zlgz/gzly/wzgz/zjcs/yslj/content/post_7760218.html"
      }
    ]
  }
];

/** 9/25 是 Reham 这一周在广州的周五。各寺主麻时间不同，实际以当天为准。 */
export const JUMUAH_NOTE: L10n = {
  zh: "9 月 25 日是 Reham 这一周在广州的周五。各寺的主麻时间不一样，前一天问一下清真寺当天的时间，再按路程留出往返的余量。",
  en: "Friday 25 September falls inside Reham’s week in Guangzhou. Jumu‘ah times vary from mosque to mosque, so ask the mosque the day before and leave room in the schedule for the journey each way.",
  ar: "تقع الجمعة 25 سبتمبر ضمن أسبوع Reham في قوانغتشو. وتختلف مواقيت صلاة الجمعة من مسجد إلى آخر، فاسألي المسجد في اليوم السابق واتركي في الجدول وقتًا للذهاب والعودة.",
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
      zh: "1956 年开的老字号，当年就是为在广州的穆斯林和回族开的，1975 年迁到现址。有意思的地方在于做法：点心是粤式的，馅是清真的 —— 牛肉烧麦、雪山牛肉包，还有羊杂汤。离怀圣寺不远，礼拜完可以走过来。",
      en: "An old house opened in 1956 to serve Guangzhou’s Muslim and Hui residents, at this address since 1975. What makes it interesting is the combination: Cantonese dim sum technique with halal fillings — beef siumai, snow-top beef buns, and a mutton offal soup. It is close enough to Huaisheng Mosque to walk over after prayers.",
      ar: "بيت عريق افتُتح عام 1956 لخدمة سكان قوانغتشو من المسلمين وقومية هوي، وهو في هذا العنوان منذ 1975. وما يميّزه هذا المزج: صنعة الديم سم الكانتونية مع حشوات حلال — سيوماي اللحم البقري وفطائر اللحم وشوربة أحشاء الضأن. وهو قريب من مسجد هوايشنغ بما يكفي للمشي إليه بعد الصلاة.",
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

/** 清真餐在老城那一片，酒店在琶洲 —— 位置先说清楚，剩下的一句话问清楚。 */
export const HALAL_WHERE: L10n[] = [
  {
    zh: "怀圣寺附近的光塔路、中山六路一带有清真餐厅，可以把礼拜和吃饭安排在同一趟。酒店在琶洲，过去用下面的中文地址导航。",
    en: "There are halal restaurants on Guangta Road and Zhongshan Liu Road near Huaisheng Mosque, so prayer and a meal can be one outing. The hotel is over in Pazhou; use the Chinese addresses below to get there.",
    ar: "توجد مطاعم حلال في شارعي قوانغتا وتشونغشان الستة قرب مسجد هوايشنغ، فيمكن جمع الصلاة والطعام في جولة واحدة. والفندق في بازو؛ استعينوا بالعناوين الصينية أدناه للوصول.",
  },
  {
    zh: "在普通餐厅点菜时，直接问清食材和做法：菜名里没有猪肉，不代表做法里没有猪油或料酒。下面的中文短句可以给店员看。想在酒店吃清真餐，问一下前台或礼宾能怎么安排。",
    en: "In an ordinary restaurant, ask plainly about the ingredients and the cooking: a dish without pork in its name may still be cooked with lard or rice wine. The Chinese phrases below can be shown to the waiter. For halal meals at the hotel, ask the front desk or concierge what they can arrange.",
    ar: "وفي المطاعم العادية اسألوا بوضوح عن المكوّنات وطريقة الطهي: فالطبق الخالي من لحم الخنزير في اسمه قد يُطهى بشحمه أو بنبيذ الأرز. ويمكن عرض العبارات الصينية أدناه على العامل. ولوجبات حلال في الفندق، اسألوا الاستقبال أو الكونسيرج عمّا يمكن ترتيبه.",
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
      zh: "查看支持地区；中国大陆目前不在列表中，出发前准备好离线翻译。",
      en: "Check the list of supported places; mainland China is not on it at present, so prepare an offline translation app before you travel.",
      ar: "راجعوا قائمة المناطق المدعومة؛ فالبرّ الرئيسي للصين ليس فيها حاليًا، لذا جهّزوا تطبيق ترجمة يعمل بلا إنترنت قبل السفر.",
    },
    url: "https://help.openai.com/en/articles/7947663-chatgpt-supported-countries",
  },
  {
    id: "china-living",
    title: {
      zh: "在华生活与出行官方指南",
      en: "Official guide to living and getting around in China",
      ar: "الدليل الرسمي للحياة والتنقل في الصين",
    },
    note: {
      zh: "支付、打车、手机号与注册这些事的官方说明，出发前值得看一遍。",
      en: "The official account of payments, ride-hailing, phone numbers and app sign-up — worth reading once before you fly.",
      ar: "الشرح الرسمي للدفع وطلب السيارات وأرقام الهواتف وتسجيل التطبيقات — يستحق قراءة واحدة قبل السفر.",
    },
    url: "https://english.www.gov.cn/2025special/bizexpatsinchina2025",
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
