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
        "zh": "出发前安装 Alipay，选择熟悉的语言，用能接收短信的手机号注册；按提示用本人护照完成身份验证，绑定可境外使用的 Visa 或 Mastercard。",
        "en": "Before departure, install Alipay, choose your language and register with a number that receives SMS. Follow the passport verification prompts and link a Visa or Mastercard enabled for overseas purchases.",
        "ar": "قبل السفر، ثبّتي أليباي واختاري اللغة المناسبة وسجّلي برقم يستقبل الرسائل. أكملي التحقق بجواز سفرك حسب التعليمات، واربطي بطاقة فيزا أو ماستركارد مفعّلة للاستخدام خارج بلدك."
      },
      {
        "zh": "付款时可扫商家的收款码，或出示自己的付款码让店员扫。外卡支持范围、手续费与限额看付款页面；不能把所有个人收款码都当作支持外卡。",
        "en": "At checkout, scan the merchant’s code or show your payment code to the cashier. Check card eligibility, fees and limits on the payment screen; some personal collection codes do not accept foreign cards.",
        "ar": "عند الدفع امسحي رمز المتجر أو اعرضي رمز الدفع الخاص بك للكاشير. راجعي قبول البطاقة والرسوم والحدود في شاشة الدفع؛ بعض رموز التحصيل الشخصية لا تقبل البطاقات الأجنبية."
      },
      {
        "zh": "落地后先试付一笔小额消费。保留原手机号接收银行验证码，并带一张实体银行卡和少量人民币作备用；支付失败时可请酒店前台协助。",
        "en": "Try a small purchase after arrival. Keep your home number available for bank verification messages, and carry a physical bank card and some RMB as backup. Ask the hotel desk for help if payment fails.",
        "ar": "جرّبي عملية شراء صغيرة بعد الوصول. احتفظي برقمك الأصلي لاستقبال رسائل البنك، وببطاقة فعلية وقليل من اليوان احتياطًا. يمكن طلب المساعدة من استقبال الفندق عند تعذّر الدفع."
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
        "zh": "出发前安装 DiDi Greater China，选择英文界面，用本人手机号注册并设置付款方式；也可使用支付宝内的打车入口。",
        "en": "Install DiDi Greater China before travel, select English, register with your phone number and set up payment. You can also use ride-hailing inside Alipay.",
        "ar": "ثبّتي DiDi Greater China قبل السفر، واختاري الإنجليزية وسجّلي برقمك وأضيفي وسيلة الدفع. يمكن أيضًا طلب سيارة من داخل أليباي."
      },
      {
        "zh": "输入目的地后检查地图上的位置，再选上车点。酒店出发可请门童指认接车位置；上车前核对车牌，留意司机在应用内的消息。",
        "en": "Check the destination pin, then choose the pickup point. At the hotel, ask the doorman where to wait. Match the number plate before boarding and watch for messages in the app.",
        "ar": "راجعي موقع الوجهة على الخريطة ثم حدّدي نقطة الالتقاء. اسألي موظف الفندق أين تنتظرين، وطابقي رقم اللوحة قبل الركوب، وتابعي رسائل السائق داخل التطبيق."
      },
      {
        "zh": "搜不到目的地时，复制本页中文地址粘贴到应用；也可以让酒店前台叫正规出租车，向司机出示中文地址。",
        "en": "If search fails, paste the Chinese address from this page. Alternatively, ask reception to call a licensed taxi and show the driver the address.",
        "ar": "إذا لم تظهر الوجهة، انسخي عنوانها الصيني من هذه الصفحة والصقيه في التطبيق. ويمكن للاستقبال طلب سيارة أجرة مرخّصة وعرض العنوان على السائق."
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
        "zh": "安装高德地图 Amap，尝试切换英文界面。先搜索并收藏「广州保利洲际酒店」，核对地址为海珠区阅江中路828号；英文名称搜不到时用中文搜索。",
        "en": "Install Amap and select English where available. Save 广州保利洲际酒店 and verify 828 Yuejiang Middle Road, Haizhu. If an English search fails, use the Chinese name.",
        "ar": "ثبّتي خرائط Amap واختاري الإنجليزية إن توفرت. احفظي الفندق باسم 广州保利洲际酒店 وتحقّقي من العنوان: 828 Yuejiang Middle Road، هايتشو. استخدمي الاسم الصيني إذا تعذّر البحث بالإنجليزية."
      },
      {
        "zh": "出门前保存目的地、返程酒店地址和路线截图。步行导航留意天桥、地下通道与商场入口，过马路按实际路口指示走。",
        "en": "Save your destination, return hotel address and route screenshots before going out. Watch for footbridges, underpasses and mall entrances; follow the signs at actual crossings.",
        "ar": "احفظي الوجهة وعنوان العودة إلى الفندق وصورًا للمسار قبل الخروج. انتبهي للجسور والأنفاق ومداخل المراكز التجارية، واتبعي إرشادات عبور الشارع في الموقع."
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
        "zh": "先向自己的运营商确认中国大陆漫游套餐、流量和费用；也可准备兼容手机的旅行 eSIM，或抵达后携护照向运营商营业点咨询中国 SIM 卡。购买前确认覆盖、激活方式，以及是否只有流量、没有手机号。",
        "en": "Ask your operator about mainland-China roaming, data and cost. Alternatives include a compatible travel eSIM or a Chinese SIM from an operator outlet with your passport. Before buying, check coverage, activation and whether it is data-only.",
        "ar": "اسألي شركة الاتصالات عن باقة التجوال في البرّ الرئيسي للصين وحجم البيانات والتكلفة. البدائل شريحة سفر eSIM متوافقة مع الهاتف، أو شريحة صينية من فرع شركة اتصالات بجواز السفر. تحقّقي من التغطية والتفعيل وهل الباقة للبيانات فقط."
      },
      {
        "zh": "保留原手机号接收验证码。出发前与 Rahma 加好微信并测试发消息；到酒店连接 Wi-Fi，外出前检查移动数据和地图能用。",
        "en": "Keep your home number for verification texts. Add Rahma on WeChat and test messaging before departure. Connect to hotel Wi-Fi on arrival and check mobile data and maps before going out.",
        "ar": "احتفظي برقمك الأصلي لرسائل التحقق. أضيفي Rahma على وي تشات واختبري الرسائل قبل السفر. اتصلي بواي فاي الفندق عند الوصول، وتأكدي من عمل بيانات الهاتف والخرائط قبل الخروج."
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
        "zh": "护照原件、酒店预订信息、转换插头、充电线和常用药。保存护照资料页与行程的离线副本，酒店入住时出示护照原件。",
        "en": "Bring your original passport, hotel booking details, a plug adapter, charging cables and usual medication. Save offline copies of your passport details and itinerary; present the original passport at hotel check-in.",
        "ar": "احملي أصل جواز السفر وتفاصيل حجز الفندق ومحوّل القابس وكابلات الشحن والأدوية المعتادة. احفظي نسخًا بلا إنترنت من بيانات الجواز والبرنامج، وقدّمي أصل الجواز عند تسجيل الدخول."
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
        "zh": "九月下旬通常仍然温暖潮湿，带轻薄衣服、折叠伞和舒适的鞋；会议室与商场冷气较足，再带一件薄外套。出发前查看广州天气预报。",
        "en": "Late September is usually warm and humid. Pack light clothing, a folding umbrella and comfortable shoes, plus a light layer for air-conditioned meeting rooms and malls. Check the Guangzhou forecast before departure.",
        "ar": "أواخر سبتمبر دافئة ورطبة عادةً. خذي ملابس خفيفة ومظلة صغيرة وحذاءً مريحًا، وطبقة خفيفة لقاعات الاجتماعات والمراكز المكيّفة. راجعي توقعات طقس قوانغتشو قبل السفر."
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
    "zh": "一下午逛现代商场，另一下午走进广州老城。",
    "en": "Modern malls one afternoon, the old city another.",
    "ar": "عصرٌ للمراكز الحديثة، وعصرٌ آخر للمدينة القديمة."
  },
  "intro": [
    {
      "zh": "天河路和北京路呈现广州商业的两种面貌：前者购物中心密集，后者将步行街、老字号与历史街巷连在一起。可按兴趣选择，作为会议之外的自由活动。",
      "en": "Tianhe Road and Beijing Road reveal two sides of Guangzhou: a cluster of modern malls, and a pedestrian district with longstanding shops and historic streets. Choose either for time outside the conference.",
      "ar": "يُظهر شارع تيانخه وشارع بكين وجهين لقوانغتشو: مجموعة من المراكز الحديثة، ومنطقة مشاة تضم متاجر عريقة وشوارع تاريخية. اختاري ما يناسب وقتك خارج المؤتمر."
    },
    {
      "zh": "天河路的几家商场步行可串联，部分入口与地铁相接。它们在客群、品牌和空间体验上各有侧重，也存在竞争与重叠；边走边比较，往往比单看规模更有意思。",
      "en": "Several Tianhe Road malls can be combined on foot, with some entrances linked to the metro. Their audiences, brands and spaces differ, while competition and overlap remain. Comparing the experience can be more revealing than comparing size.",
      "ar": "يمكن الجمع بين عدة مراكز في شارع تيانخه سيرًا، وبعض مداخلها متصلة بالمترو. تختلف في الجمهور والعلامات والتصميم، مع وجود منافسة وتداخل. مقارنة التجربة أثناء التجول قد تكون أمتع من مقارنة الحجم."
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
        "zh": "可留意品牌店面、公共空间与服务细节如何共同营造体验。太古汇与地铁石牌桥站相连，适合作为天河路步行的起点或终点。",
        "en": "Notice how storefronts, public spaces and service details shape the experience. Connected to Shipaiqiao metro, Taikoo Hui makes a useful starting or finishing point for a Tianhe Road walk.",
        "ar": "لاحظي كيف تصنع واجهات المتاجر والمساحات العامة وتفاصيل الخدمة تجربة متكاملة. يتصل تايكو هوي بمحطة شيبايتشياو، ويصلح بداية أو نهاية لجولة شارع تيانخه."
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
        "zh": "低层建筑、绿地和广场给密集商圈留出舒展的空间。可看看室外停留、餐饮与购物如何连接，也适合中途坐下来喝一杯。",
        "en": "Low-rise buildings, greenery and plazas create breathing space in a dense district. Look at the transition between outdoor seating, dining and shopping; it is also a pleasant place for a drink break.",
        "ar": "تمنح المباني المنخفضة والخضرة والساحات مساحة مريحة وسط المنطقة المزدحمة. شاهدي الصلة بين الجلوس الخارجي والمطاعم والتسوق؛ وهي محطة لطيفة لاستراحة ومشروب."
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
        "zh": "购物之外，海洋馆等体验项目也吸引家庭与游客。可观察娱乐入口、餐饮楼层和零售区域之间的动线；体验项目通常另行购票。",
        "en": "Attractions such as the aquarium bring families and visitors alongside shoppers. Observe the routes between attraction entrances, dining and retail; attractions generally require separate tickets.",
        "ar": "تجذب مرافق مثل الأكواريوم العائلات والزوار إلى جانب المتسوقين. لاحظي المسارات بين الترفيه والمطاعم والمتاجر؛ وتحتاج المرافق عادةً إلى تذاكر منفصلة."
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
        "zh": "天河城是广州成熟的购物地标。可从靠近体育西路站的入口开始，看看通勤客流、日常购物与餐饮如何结合。",
        "en": "Teemall is an established Guangzhou shopping landmark. Start near Tiyu Xilu station and notice how commuter traffic, everyday shopping and dining meet.",
        "ar": "تيمول معلم تسوق راسخ في قوانغتشو. ابدئي من المدخل القريب من محطة تييو شيلو، ولاحظي اجتماع حركة الركاب والتسوق اليومي والمطاعم."
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
        "zh": "早午餐与书店",
        "en": "Brunch and bookshops",
        "ar": "فطور متأخر ومكتبات"
      },
      "facts": {
        "zh": "这里有早午餐的馆子和西西弗书店，可以坐下来待一会儿。就在太古汇旁边，逛累了适合过来歇脚。",
        "en": "There are brunch places and the Sisyphe bookshop here — somewhere to sit for a while. It is right beside Taikoo Hui, so it works well as a break part-way through a walk.",
        "ar": "هنا مقاهٍ للفطور المتأخر ومكتبة سيزيف، أماكن تصلح للجلوس قليلًا. وهو ملاصق لتايكو هوي، فيصلح استراحة في منتصف الجولة."
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
      "zh": "同一片商圈，天环的开放空间、正佳的家庭娱乐、太古汇的高端零售，提供了不同的停留理由。可以留意入口如何接住街道人流，餐饮与休息区如何延长停留，以及不同楼层之间怎样引导顾客。",
      "en": "In the same district, Parc Central’s open spaces, Grandview’s family attractions and Taikoo Hui’s luxury retail offer different reasons to stay. Notice how entrances receive foot traffic, dining and seating encourage longer visits, and circulation draws people between floors.",
      "ar": "في المنطقة نفسها، تمنح مساحات بارك سنترال المفتوحة وترفيه غراندفيو العائلي ومتاجر تايكو هوي الفاخرة أسبابًا مختلفة للبقاء. لاحظي المداخل، ودور المطاعم والاستراحات، وكيفية انتقال الزوار بين الطوابق."
    }
  ],
  "comparables": [],
  "beijinglu": {
    "zh": "北京路适合慢慢走：看街中的古道遗址，再转进周边街巷逛老字号和小店。它的吸引力来自街道、历史与日常生活的交织，和天河路的购物中心体验很不一样。",
    "en": "Take Beijing Road slowly: see the ancient street remains, then explore nearby lanes, longstanding shops and small businesses. Its appeal comes from the mix of streets, history and everyday life, quite different from Tianhe Road’s malls.",
    "ar": "تمهّلي في شارع بكين: شاهدي بقايا الطريق القديم ثم تجوّلي في الأزقة والمتاجر العريقة والصغيرة. يجمع المكان الشارع والتاريخ والحياة اليومية، بتجربة تختلف عن مراكز تيانخه."
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
      zh: "打车前往。出发前在地图里查一下当天车程，再决定几点出门；换住其他酒店后以实际地址导航为准。",
      en: "Go by taxi. Check the drive time in your map app before setting out, then decide when to leave; from any other hotel, navigate by the actual address.",
      ar: "اذهبوا بسيارة أجرة. راجعوا زمن الطريق في تطبيق الخرائط قبل الانطلاق ثم حدّدوا موعد الخروج؛ ومن أي فندق آخر اعتمدوا على العنوان الفعلي.",
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
    imageKey: "tower",
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
      zh: "打车前往，广州塔和酒店同在海珠区；出发前在地图里查当天车程。",
      en: "Go by taxi; the tower is in Haizhu, the same district as your hotel. Check the drive time in your map app before setting out.",
      ar: "اذهبوا بسيارة أجرة؛ البرج في هايتشو، منطقة فندقكم نفسها. راجعوا زمن الطريق في تطبيق الخرائط قبل الانطلاق.",
    },
    tickets: {
      zh: "官网公布营业时间 09:30–22:30；先选观光层与入场时段，再核对票价及当天项目开放情况。总体营业时间不等于每个高空项目的结束时间。",
      en: "The official site lists opening hours of 09:30–22:30. Choose the deck and entry slot first, then check the price and which attractions are running that day — the tower's overall hours are not the closing time of every attraction.",
      ar: "يعلن الموقع الرسمي مواعيد 09:30–22:30. اختاروا المنصّة ووقت الدخول أولًا، ثم تحقّقوا من السعر ومن المرافق العاملة ذلك اليوم — فمواعيد البرج العامة ليست وقت إغلاق كل مرفق.",
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
      zh: "船程约 60 分钟，另留往返及候船时间（规划参考）",
      en: "About 60 minutes on the water, plus getting to the pier and waiting (planning estimate)",
      ar: "نحو 60 دقيقة على الماء، إضافةً إلى الذهاب إلى الرصيف والانتظار (تقدير تخطيطي)",
    },
    bestFor: {
      zh: "坐着不动看两岸灯光，适合一天结束的时候。",
      en: "Sit still and watch both lit banks go by. Good at the end of a day.",
      ar: "اجلسوا وشاهدوا الضفتين المضاءتين. مناسب لختام اليوم.",
    },
    summary: {
      zh: "夜里在珠江上看两岸灯光。码头、船和航线各不相同：大沙头是最大的游船码头，天字码头是广州用得最久的码头，有两百七十多年。",
      en: "An evening on the Pearl River with both banks lit. Piers, boats and routes all differ: Dashatou is the largest cruise pier, and Tianzi is the oldest still in use, some two hundred and seventy years.",
      ar: "أمسية على نهر اللؤلؤ والضفتان مضاءتان. تختلف الأرصفة والقوارب والمسارات: رصيف داشاتو أكبر أرصفة الجولات، ورصيف تيانزي أقدمها المستخدمة، وعمره نحو مئتين وسبعين عامًا.",
    },
    steps: [
      {
        zh: "酒店 → 票面上的码头 → 上船约 60 分钟 → 返回酒店。",
        en: "Hotel → the pier printed on your ticket → about 60 minutes aboard → back to the hotel.",
        ar: "الفندق ← الرصيف المذكور في التذكرة ← نحو 60 دقيقة على متن القارب ← العودة إلى الفندق.",
      },
    ],
    transport: {
      zh: "按票面上的码头叫车，别只搜索「珠江夜游」；出发前在地图里查当天车程。",
      en: "Take your taxi to the pier printed on the ticket rather than searching for “Pearl River night cruise”; check the drive time in your map app before setting out.",
      ar: "اطلبوا السيارة إلى الرصيف المذكور في التذكرة لا بالبحث عن «جولة نهر اللؤلؤ الليلية»؛ وراجعوا زمن الطريق في تطبيق الخرائط قبل الانطلاق.",
    },
    tickets: {
      zh: "订票时核对码头、船名、路线、楼层与开航时间；想看广州塔，选明确途经的班次。票价未核实，以售票方公布为准。",
      en: "When booking, check the pier, the boat's name, the route, the deck and the departure time; if you want the Canton Tower, choose a sailing that clearly passes it. Prices are not verified — go by the seller's own notice.",
      ar: "عند الحجز تحقّقوا من الرصيف واسم القارب والمسار والطابق وموعد الإقلاع؛ وإن أردتم برج كانتون فاختاروا رحلة تمرّ به بوضوح. الأسعار غير مُتحقَّق منها — اعتمدوا على إعلان الجهة البائعة.",
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
      zh: "想看这座城市怎么买东西，安排半天来这里。选两三家慢慢逛，别一口气走完。",
      en: "Half a day to see how this city shops. Pick two or three malls and take them slowly instead of covering them all.",
      ar: "نصف يوم لرؤية كيف تتسوّق هذه المدينة. اختاروا مركزين أو ثلاثة وتمهّلوا فيها بدل تغطيتها كلها.",
    },
    summary: {
      zh: "同一条路上的几家商场各有各的样子：天河城是老牌的城市购物中心，天环是低层建筑配室外广场，正佳广场里有海洋馆这类体验项目，太古汇是奢侈品牌和公共空间。几家之间步行可达，地下也有通道相连。挑两三家慢慢逛，中间找个地方坐下来喝一杯。",
      en: "The malls along this one road each have their own character: Teemall is the established city mall, Parc Central is low-rise buildings around outdoor plazas, Grandview holds attractions such as an aquarium, and Taikoo Hui is luxury brands and public space. They are within walking distance of one another and linked underground. Take two or three slowly, with a drink somewhere in between.",
      ar: "لكل مركز على هذا الطريق طابعه: تيمول مركز المدينة العريق، وبارك سنترال مبانٍ منخفضة حول ساحات خارجية، وغراندفيو يضمّ مرافق مثل الأكواريوم، وتايكو هوي علامات فاخرة ومساحات عامة. وهي متقاربة سيرًا ومتصلة تحت الأرض. خذوا مركزين أو ثلاثة على مهل، مع استراحة ومشروب بينها.",
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
    id: "beijinglu",
    imageKey: "beijinglu",
    title: {
      zh: "北京路步行街 · 脚下一千年",
      en: "Beijing Road · a thousand years underfoot",
      ar: "شارع بكين · ألف عام تحت الأقدام",
    },
    duration: {
      zh: "约 2–3 小时（规划参考）",
      en: "About 2–3 hours (planning estimate)",
      ar: "نحو 2–3 ساعات (تقدير تخطيطي)",
    },
    bestFor: {
      zh: "想在一条街上同时看到最老的广州和最热闹的广州，来这里；晚上灯亮以后人最多。",
      en: "For the oldest Guangzhou and the busiest Guangzhou on a single street; busiest after the lights come on.",
      ar: "لرؤية أقدم قوانغتشو وأكثرها ازدحامًا في شارع واحد؛ وأشدّ الازدحام بعد إضاءة الأنوار.",
    },
    summary: {
      zh: "广州建城两千二百年，城市中轴线从来没挪过，北京路就是这条中轴的核心段。2002 年修路时挖出了从唐代到民国的十一层路面，现在盖着玻璃让你直接踩在上面走 —— 脚下一千年。主街一公里、步行区四点七公里，一千六百多个品牌、五十二家老字号。",
      en: "Guangzhou was founded twenty-two centuries ago and its central axis has never moved; Beijing Road is the heart of it. Roadworks in 2002 uncovered eleven layers of street surface from the Tang dynasty to the Republic, now sealed under glass so you walk directly over them — a thousand years underfoot. A one-kilometre main street, 4.7 kilometres of pedestrian zone, over sixteen hundred brands and fifty-two long-established shops.",
      ar: "أُسّست قوانغتشو قبل اثنين وعشرين قرنًا ولم يتحرّك محورها المركزي قط؛ وشارع بكين قلبُ هذا المحور. كشفت أعمال الطريق عام 2002 عن إحدى عشرة طبقة من سطح الشارع من عهد تانغ إلى عهد الجمهورية، مغطّاة الآن بالزجاج لتمشوا فوقها مباشرة — ألف عام تحت الأقدام. شارع رئيسي بطول كيلومتر، ومنطقة مشاة 4.7 كيلومترات، وأكثر من ألف وستمئة علامة تجارية واثنان وخمسون متجرًا عريقًا.",
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
      "zh": "姜撞奶值得专门去试一次：滚烫的牛奶冲进一碗姜汁，不搅不动，几分钟后整碗自己凝住，用勺子舀是一块一块的。还有双皮奶、绿豆沙、马蹄糕。广州人把这些统称「糖水」，多半是晚饭以后才去吃的事。",
      "en": "Ginger milk curd is worth a trip on its own: scalding milk is poured onto a bowl of ginger juice, left alone, and a few minutes later the whole bowl has set firm enough to lift with a spoon. There is also double-skin milk, mung bean soup and water chestnut cake. Cantonese call all of it tong sui, sugar water, and it is mostly an after-dinner errand.",
      "ar": "حليب الزنجبيل المخثّر وحده يستحق رحلة: يُصبّ الحليب المغلي على وعاء من عصير الزنجبيل ويُترك دون تحريك، فإذا به بعد دقائق قد تماسك حتى تستطيع رفعه بالملعقة. وهناك أيضًا حليب الطبقتين وحساء الفاصولياء الخضراء وكعكة كستناء الماء. ويسمّي أهل كانتون ذلك كله «تونغ سوي»، أي ماء السكر، وهو غالبًا مشوارُ ما بعد العشاء."
    },
    "url": "https://www.gz.gov.cn/zlgz/gzly/msgz/dxxc/content/post_7801857.html"
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
      "zh": "广州最出名的一道烧味。正宗的做法来自黄埔长洲岛的深井村：地上挖一口干井，井底埋缸，缸里烧荔枝木炭，鹅用钩子吊在井口的铁枝上，靠井壁的热力烤熟。出来是金红的皮，一咬脆得有声，底下的肉却是嫩的，肥而不腻。斩件上桌，蘸酸梅酱。",
      "en": "Guangzhou's most famous roast. The authentic method comes from Shenjing village on Changzhou Island in Huangpu: a dry well is dug, a clay jar set in its floor, lychee-wood charcoal burned inside, and the geese hung from iron bars across the mouth so the heat of the well walls roasts them. What comes out is skin the colour of amber that cracks audibly when bitten, over meat that is still tender — rich without being heavy. Chopped and served with plum sauce.",
      "ar": "أشهر مشويّات قوانغتشو. الطريقة الأصيلة من قرية شنجينغ في جزيرة تشانغتشو بهوانغبو: تُحفر بئر جافة، ويُثبَّت جرّة فخارية في قاعها، ويُحرق فيها فحم خشب الليتشي، وتُعلَّق الإوزّات من قضبان حديدية على فوهتها فتنضج بحرارة جدران البئر. والنتيجة جلد بلون الكهرمان يتكسّر بصوت مسموع عند العضّ، فوق لحم لا يزال طريًّا — غنيٌّ دون ثقل. يُقطَّع ويُقدَّم مع صلصة البرقوق."
    },
    "url": "https://lvyou.ycwb.com/2019-04/19/content_30243026.htm"
  },
  {
    "id": "squab",
    "imageKey": "pigeon",
    "title": {
      "zh": "红烧乳鸽",
      "en": "Roast squab",
      "ar": "الحمام الصغير المشوي"
    },
    "body": {
      "zh": "广东人说「一鸽胜九鸡」。最有名的是中山石岐乳鸽 —— 一百多年前华侨从海外带回良种和本地鸽杂交出来的品种，先卤后炸，皮脆得像纸，肉嫩到骨头都是香的。从广州开车一小时就是中山，但广州的粤菜馆几乎都有这道菜，一人一只，用手拿着吃。",
      "en": "The Cantonese say one squab beats nine chickens. The most celebrated is the Shiqi squab of Zhongshan — a breed crossed a century ago from birds that returning overseas Chinese brought home — braised, then fried, so the skin turns paper-crisp over meat tender to the bone. Zhongshan is an hour's drive from Guangzhou, but nearly every Cantonese restaurant in the city serves it: one bird each, eaten with the hands.",
      "ar": "يقول الكانتونيون إن حمامةً صغيرة تغلب تسع دجاجات. وأشهرها حمام شيتشي من تشونغشان — سلالة هُجّنت قبل قرن من طيور أعادها الصينيون المغتربون — يُطهى في المرق ثم يُقلى فيصبح الجلد رقيقًا كالورق فوق لحمٍ طريّ حتى العظم. تشونغشان على بعد ساعة بالسيارة من قوانغتشو، لكن كل مطعم كانتوني في المدينة تقريبًا يقدّمه: طائر لكل شخص، يُؤكل باليد."
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
      "zh": "广州人吃海鲜的规矩是「生猛」—— 必须活的。黄沙水产市场从 1994 年开到今天，一年交易三十二万吨，是全国活鲜的价格风向标；很多人直接在市场里挑好活鱼活虾活蟹，拎到旁边的酒楼加工，二十分钟后上桌。一条鱼最经典的做法是清蒸：只放姜丝葱丝，蒸熟淋一勺滚油和豉油，鱼有多新鲜一口就知道。",
      "en": "The Cantonese rule for seafood is that it must be alive. Huangsha market has traded since 1994 — 320,000 tonnes a year, the price benchmark for live seafood across China — and many people simply choose their fish, prawns and crab from the tanks and carry them to the restaurants next door, where they are on the table twenty minutes later. The classic treatment for a fish is steaming: ginger and spring onion only, then a spoon of smoking oil and soy over the top. One bite tells you how fresh it was.",
      "ar": "قاعدة الكانتونيين في المأكولات البحرية أن تكون حيّة. يعمل سوق هوانغشا منذ 1994 — بحجم تداول 320 ألف طن سنويًا، وهو المرجع السعري للمأكولات البحرية الحيّة في الصين كلّها — ويختار كثيرون أسماكهم وروبيانهم وسرطاناتهم من الأحواض مباشرة ويحملونها إلى المطاعم المجاورة لتكون على المائدة بعد عشرين دقيقة. والطريقة الكلاسيكية للسمك هي التبخير: زنجبيل وبصل أخضر فقط، ثم ملعقة زيت مدخّن وصويا فوقه. ولقمة واحدة تخبرك بمدى طزاجته."
    },
    "url": "https://www.gz.gov.cn/ysgz/xwdt/ysdt/content/post_10421238.html"
  },
  {
    "id": "soup",
    "imageKey": "soup",
    "title": {
      "zh": "老火靓汤",
      "en": "Slow-fired soup",
      "ar": "الحساء البطيء"
    },
    "body": {
      "zh": "广东人家里的汤是煲出来的：一锅水，几样材料，小火两三个小时，直到汤色变浓、味道全出来。饭桌上第一件事是喝汤，不是吃饭。「饮咗汤未」—— 喝过汤了吗 —— 是广东人的问候语，跟问你吃了没一个意思。",
      "en": "In a Cantonese home, soup is not made, it is fired: a pot of water, a few ingredients, two or three hours over a low flame until the broth turns deep and everything has given up its flavour. The first thing at the table is the soup, before the rice. “Have you had your soup?” is how Cantonese ask after you — it means the same as asking whether you have eaten.",
      "ar": "في البيت الكانتوني لا يُعدّ الحساء بل يُوقد: قِدر ماء، وبضعة مكوّنات، وساعتان أو ثلاث على نارٍ هادئة حتى يغمق المرق وتبذل المكوّنات كل نكهتها. وأول ما يُقدَّم على المائدة الحساء، قبل الأرز. و«هل شربتَ حساءك؟» هي طريقة الكانتونيين في السؤال عن حالك — وتعني ما تعنيه «هل أكلت؟»."
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
      "zh": "清汤里涮不同部位的牛肉，口感各有特点。若需要清真餐，请选择确认提供清真食材与烹饪的餐厅，不能只凭「牛肉」或「清汤」判断。",
      "en": "Different cuts of beef bring different textures to a light hotpot broth. For halal dining, confirm the restaurant’s ingredients and preparation; beef and clear broth alone do not establish that.",
      "ar": "تعطي قطع اللحم البقري المختلفة قوامًا متنوعًا في المرق الخفيف. للطعام الحلال، تحقّقي من المكونات والتحضير مع المطعم؛ اللحم البقري والمرق الصافي وحدهما لا يكفيان."
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
      "zh": "白切鸡突出鸡肉的原味，通常搭配姜葱蘸料。需要清真餐时，先向餐厅确认食材来源与做法。",
      "en": "Poached chicken highlights the meat’s flavour, usually with a ginger and spring-onion dip. For halal dining, confirm the ingredients and preparation with the restaurant.",
      "ar": "يبرز الدجاج المسلوق نكهة اللحم، ويُقدّم عادةً مع صلصة الزنجبيل والبصل الأخضر. للطعام الحلال، تحقّقي من المكونات والتحضير مع المطعم."
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
      "zh": "宽河粉、牛肉、豆芽、韭黄，猛火快炒。广东人评一碟炒菜好不好，看的是「镬气」—— 铁锅烧到极烫、油和酱在锅边瞬间焦香、每一根粉都均匀上色而不断不糊。炉火不够猛的厨房炒不出来，这是粤菜厨师的看家本领，也是所有广式小炒的魂。",
      "en": "Wide rice noodles, beef, bean sprouts and yellow chives, tossed fast over a ferocious flame. Cantonese judge any stir-fry by its wok hei, the “breath of the wok”: the pan heated until it almost glows, oil and sauce searing in an instant at the rim, every noodle evenly browned yet unbroken and unstuck. It cannot be faked on a weak stove — it is the Cantonese cook's signature skill and the soul of every quick-fried dish.",
      "ar": "شعيرية أرز عريضة ولحم بقر وبراعم فول وثوم معمّر أصفر، تُقلّب بسرعة فوق لهب عنيف. ويحكم الكانتونيون على أي طبق مقلي بـ«ووك هي»، أي نَفَس المقلاة: تُحمى المقلاة حتى تكاد تتوهّج، فيلفح الزيت والصلصة حافتها في لحظة، وتتلوّن كل خيط شعيرية بالتساوي دون أن ينقطع أو يلتصق. لا يمكن تزييفه على موقد ضعيف — إنه توقيع الطاهي الكانتوني وروح كل طبق مقليّ سريع."
    }
  },
  {
    "id": "qilou",
    "imageKey": "arcade",
    "title": {
      "zh": "骑楼是什么",
      "en": "What is a qilou arcade",
      "ar": "ما هي أروقة تشي لو"
    },
    "body": {
      "zh": "老城临街的房子把二楼往外挑出去，底下就空出一条有顶的走廊，一家接一家连成几百米 —— 这就是骑楼。广州又晒又多雨，走在骑楼底下可以一路不打伞。恩宁路一带成片，是看骑楼最好的地方。",
      "en": "In the old city the upper floors are pushed out over the pavement, leaving a covered walkway underneath that runs from shopfront to shopfront for hundreds of metres — that is a qilou arcade. Guangzhou is hot and wet, and under the arcades you can walk for blocks without an umbrella. Enning Road has the best stretch of them.",
      "ar": "في المدينة القديمة تبرز الطوابق العليا فوق الرصيف فيتشكّل تحتها ممرٌّ مسقوف يمتدّ من متجر إلى متجر مئات الأمتار — هذا هو رواق «تشي لو». وقوانغتشو حارّة ممطرة، وتحت هذه الأروقة تمشي أحياءً كاملة دون مظلّة. وأجمل امتدادٍ لها في شارع إن نينغ."
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
    "zh": "在广州，寻找阿拉伯商人留下的足迹。",
    "en": "Discover the traces of Arab merchants in Guangzhou.",
    "ar": "اكتشفي آثار التجار العرب في قوانغتشو."
  },
  "paragraphs": [
    {
      "zh": "广州与阿拉伯世界的联系，沿着海上贸易延续了许多个世纪。来到老城的光塔路，怀圣寺与光塔让这段历史有了可以亲眼看到的模样。",
      "en": "Guangzhou’s maritime trade has linked it with the Arab world for centuries. On Guangta Road in the old city, Huaisheng Mosque and its minaret give that history a visible presence.",
      "ar": "ربطت التجارة البحرية قوانغتشو بالعالم العربي على مدى قرون. وفي شارع قوانغتا بالمدينة القديمة، يمنح مسجد هوايشنغ ومنارته هذه الصلة التاريخية حضورًا يمكن رؤيته."
    },
    {
      "zh": "关于怀圣寺的始建年代，以及宛葛素与赛尔德·本·艾比·宛葛素的关系，有流传已久的说法，也有历史争议。参访时可以了解这些故事；如计划礼拜，先查看下面的清真寺地址与到访提示。",
      "en": "There are longstanding traditions, and historical debate, about the mosque’s foundation and the identification of Abi Waqqas with Sa’d ibn Abi Waqqas. Explore these stories during a visit; for prayer, see the mosque addresses and visiting notes below.",
      "ar": "توجد روايات قديمة ونقاشات تاريخية حول تأسيس المسجد ونسبة أبي وقاص إلى سعد بن أبي وقاص. يمكن التعرف إلى هذه القصص خلال الزيارة؛ وللصلاة راجعي عناوين المساجد وإرشادات الزيارة أدناه."
    }
  ],
  "sources": [
    {
      "label": {
        "zh": "广州市人民政府：重走海上丝绸之路",
        "en": "Guangzhou municipal government: retracing the Maritime Silk Road",
        "ar": "حكومة بلدية قوانغتشو: على خطى طريق الحرير البحري"
      },
      "url": "https://www.gz.gov.cn/zlgz/gzly/lyxl/content/post_7730147.html"
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
  "lead": {
    "zh": "从机场到珠江边，一路认识广州。",
    "en": "Meet Guangzhou, from the airport to the Pearl River.",
    "ar": "تعرّفي إلى قوانغتشو، من المطار إلى نهر اللؤلؤ."
  },
  "intro": [
    {
      "zh": "白云机场连接着世界各地，琶洲展馆迎来国际采购商，珠江两岸是商场、写字楼和居民生活。几个数字，可以帮助理解眼前这座城市的规模。",
      "en": "Baiyun Airport connects the city with the world, Pazhou welcomes international buyers, and the riverfront brings together shopping, offices and everyday life. A few figures put that scale in context.",
      "ar": "يربط مطار بايون المدينة بالعالم، وتستقبل بازو المشترين الدوليين، وتجمع ضفتا النهر التسوق والمكاتب والحياة اليومية. تساعد بضعة أرقام على فهم حجم هذه المدينة."
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
        "zh": "制造、商贸与服务业汇聚的城市",
        "en": "A city of manufacturing, trade and services",
        "ar": "مدينة تجمع الصناعة والتجارة والخدمات"
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
        "zh": "全国第二个八千万级机场，你们从这里进出",
        "en": "China's second 80-million airport — the one you fly into",
        "ar": "ثاني مطار في الصين يتجاوز 80 مليونًا — وهو مطاركم"
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
        "zh": "珠江边的地标，适合看城市夜景",
        "en": "A riverfront landmark for city views",
        "ar": "معلم على النهر لمشاهدة المدينة"
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
        "zh": "来自 223 个国家和地区，展馆就在你们酒店那条路上",
        "en": "From 223 countries and regions — the halls are on your hotel's street",
        "ar": "من 223 دولةً ومنطقة — والقاعات في شارع فندقكم نفسه"
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
        "zh": "民航局：白云机场年旅客吞吐量首破八千万",
        "en": "CAAC: Baiyun passes 80 million passengers",
        "ar": "هيئة الطيران المدني: مطار بايون يتجاوز 80 مليون مسافر"
      },
      "url": "http://www.caacnews.com.cn/special/2025zhuanti/8427/kjzg/20dzln4/202512/t20251223_1392071.html"
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
    "zh": "会自己乘电梯的机器人，和没有司机的车。",
    "en": "Robots that take the lift, and cars without a driver.",
    "ar": "روبوت يصعد بالمصعد، وسيارة بلا سائق."
  },
  "intro": {
    "zh": "广州的科技体验，也藏在叫车、送物和付款这些小事里。下面是可以留意的场景；专门体验前先确认当天是否开放。",
    "en": "Technology also appears in everyday rides, deliveries and payments. Look out for these examples, and check availability before making a special trip.",
    "ar": "تظهر التقنية في تفاصيل يومية مثل السيارات والتوصيل والدفع. إليك تجارب تستحق الانتباه، مع التحقق من توفرها قبل تخصيص زيارة لها."
  },
  "items": [
    {
      "id": "robotaxi",
      "imageKey": "robotaxi",
      "title": {
        "zh": "体验一次无人驾驶",
        "en": "Try a driverless ride",
        "ar": "جرّبي رحلة بلا سائق"
      },
      "where": {
        "zh": "在 WeRide Go 查询广州可用上车点。",
        "en": "Check Guangzhou pickup points in WeRide Go.",
        "ar": "راجعي نقاط الركوب المتاحة في قوانغتشو عبر WeRide Go."
      },
      "body": {
        "zh": "文远知行已在广州开展自动驾驶出行服务。可请 Rahma 或酒店前台协助查看应用中的区域、预约与付款要求，确认后再体验；不用它替代已安排的机场接送。",
        "en": "WeRide operates autonomous ride services in Guangzhou. Ask Rahma or the hotel desk to help check coverage, booking and payment in the app before trying it. Keep your arranged airport transfers.",
        "ar": "تقدّم WeRide خدمات سيارات ذاتية القيادة في قوانغتشو. اطلبي من Rahma أو الاستقبال المساعدة في مراجعة التغطية والحجز والدفع بالتطبيق قبل التجربة، مع الإبقاء على انتقالات المطار المرتبة."
      }
    },
    {
      "id": "robot",
      "imageKey": "robot",
      "title": {
        "zh": "送到房门口的小助手",
        "en": "A delivery at your door",
        "ar": "مساعد يوصل إلى باب الغرفة"
      },
      "where": {
        "zh": "在使用配送机器人的酒店或餐厅留意；可先问前台。",
        "en": "Look in hotels or restaurants using delivery robots; ask the desk first.",
        "ar": "يمكن مشاهدته في الفنادق أو المطاعم التي تستخدم روبوتات التوصيل؛ اسألي الاستقبال أولًا."
      },
      "body": {
        "zh": "有些机器人能呼叫电梯、跨楼层送物，抵达后提醒客人取件。入住时可问前台是否有这项服务；如有，不妨体验一次它怎样把物品送到房门口。",
        "en": "Some robots call lifts, deliver items between floors and notify guests on arrival. Ask reception whether this service is available; if it is, try a delivery to see how it works.",
        "ar": "تستدعي بعض الروبوتات المصعد وتنقل الأغراض بين الطوابق ثم تنبّه الضيف عند الوصول. اسألي الاستقبال إن كانت الخدمة متاحة، وإن توفرت فجرّبي توصيلًا إلى الغرفة."
      }
    },
    {
      "id": "cashless",
      "imageKey": "cashless",
      "title": {
        "zh": "一部手机完成付款",
        "en": "Pay with your phone",
        "ar": "الدفع بالهاتف"
      },
      "where": {
        "zh": "购物、咖啡和打车时都能留意扫码支付。",
        "en": "Look for QR payment when shopping, buying coffee or taking a ride.",
        "ar": "لاحظي الدفع بالرمز عند التسوق أو شراء القهوة أو ركوب سيارة."
      },
      "body": {
        "zh": "扫码付款把许多日常消费连接起来。先按出发准备设置支付宝，再试一次小额付款，就能体会这种便利；人民币现金仍可作为备用。",
        "en": "QR payments connect many everyday purchases. Set up Alipay using the preparation guide, then try a small purchase to experience the convenience. Keep RMB cash as a backup.",
        "ar": "تربط المدفوعات بالرمز كثيرًا من المشتريات اليومية. جهّزي أليباي حسب دليل الاستعداد، ثم جرّبي شراءً صغيرًا لتلمسي سهولته، مع الاحتفاظ بالنقد احتياطًا."
      }
    }
  ],
  "sources": [
    {
      "label": {
        "zh": "文远知行：广州出行服务",
        "en": "WeRide: Guangzhou services",
        "ar": "WeRide: خدمات قوانغتشو"
      },
      "url": "https://www.weride.ai/services"
    },
    {
      "label": {
        "zh": "普渡：酒店配送机器人",
        "en": "PUDU: hotel delivery robots",
        "ar": "PUDU: روبوتات التوصيل الفندقية"
      },
      "url": "https://www.pudurobotics.com/en/solutions/hospitality"
    }
  ]
};

/* ------------------------------------------------------------------ */
/* 你们住的这块地：琶洲                                                  */
/* ------------------------------------------------------------------ */

export const PAZHOU: { lead: L10n; paragraphs: L10n[]; sources: { label: L10n; url: string }[] } = {
  "lead": {
    "zh": "住在琶洲，珠江和广交会就在这一带。",
    "en": "Your base in Pazhou: the river and the Canton Fair district.",
    "ar": "إقامتك في بازو: النهر ومنطقة معرض كانتون."
  },
  "paragraphs": [
    {
      "zh": "广州保利洲际酒店位于阅江中路828号。本次会议在酒店内举行，参会日不用另外乘车去会场；外出巡店以行程表通知为准。",
      "en": "InterContinental Guangzhou Exhibition Center is at 828 Yuejiang Middle Road. Your conference is inside the hotel, so no separate transfer is needed for sessions there. Store-visit arrangements are in the itinerary.",
      "ar": "يقع فندق إنتركونتيننتال في 828 Yuejiang Middle Road. يُعقد المؤتمر داخل الفندق فلا تحتاجين إلى انتقال منفصل لحضور جلساته. وتفاصيل زيارات المتاجر في جدول الرحلة."
    },
    {
      "zh": "这一带既是广交会举办地，也是广州数字经济企业聚集的区域。闲暇时可沿江散步，看展馆与写字楼组成的城市景观；腾讯、阿里巴巴等企业在琶洲设有区域业务设施，并非它们的全球总部都在这里。",
      "en": "Pazhou combines the Canton Fair complex with a growing digital-business district. A riverfront walk offers views of exhibition halls and office towers. Tencent and Alibaba have regional operations here.",
      "ar": "تجمع بازو مجمّع معرض كانتون ومنطقة أعمال رقمية متنامية. تتيح نزهة على النهر مشاهدة قاعات المعارض والأبراج المكتبية، ولشركات مثل تينسنت وعلي بابا أعمال إقليمية هنا."
    }
  ],
  "sources": [
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
    "zh": "从一盅早茶，慢慢认识广州。",
    "en": "Get to know Guangzhou over tea and dim sum.",
    "ar": "تعرّفي إلى قوانغتشو على مائدة الشاي والديم سوم."
  },
  "paragraphs": [
    {
      "zh": "广州人说「叹早茶」，说的是坐下来慢慢享受。一壶茶配几笼点心，边聊边吃，是认识这座城市生活节奏的好方式。",
      "en": "Locals speak of enjoying yum cha: tea, a few baskets of dim sum and time to talk. It is a relaxed way to get a feel for life in the city.",
      "ar": "يتحدث أهل المدينة عن الاستمتاع بالشاي: إبريق شاي وسلال صغيرة من الديم سوم ووقت للحديث. إنها طريقة هادئة للتعرف إلى إيقاع الحياة هنا."
    },
    {
      "zh": "粤菜里有清蒸的鲜味、烧味的香气，也有姜撞奶和双皮奶这样的甜品。邻近的顺德于2014年加入联合国教科文组织美食之都网络，是了解粤菜的另一扇窗口。",
      "en": "Cantonese cooking ranges from delicate steamed dishes to roast flavours and milk desserts such as ginger milk curd and double-skin milk. Nearby Shunde joined UNESCO’s Creative Cities of Gastronomy in 2014.",
      "ar": "يتنوع المطبخ الكانتوني بين الأطباق المطهوة بالبخار والمشويات وحلويات الحليب مثل حليب الزنجبيل وحليب الطبقتين. وانضمت شوندي القريبة إلى مدن اليونسكو المبدعة في فنون الطهي عام 2014."
    }
  ],
  "sources": [
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
      "zh": "位于解放北路、兰圃附近，是广州穆斯林的重要礼拜场所。宛葛素的相关传说流传已久，其历史身份存在争议。周五人多，建议提前确认主麻时间并预留交通时间。",
      "en": "Near Lanpu on Jiefang North Road, this is an important Muslim prayer site in Guangzhou. Traditions about Abi Waqqas are longstanding, though his historical identity is debated. On Fridays, confirm prayer times and allow time for traffic and crowds.",
      "ar": "قرب حديقة لانبو على طريق جيفانغ الشمالي، وهو موقع مهم لصلاة المسلمين في قوانغتشو. روايات أبي وقاص قديمة، لكن هويته التاريخية محل نقاش. يوم الجمعة، تأكّدي من موعد الصلاة واتركي وقتًا للطريق والازدحام."
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
      "zh": "怀圣寺与光塔见证广州和阿拉伯世界的历史联系。关于始建年代有不同说法。到访前确认礼拜与参观时段，进入时遵守现场着装和拍照要求。",
      "en": "Huaisheng Mosque and its minaret reflect Guangzhou’s historic links with the Arab world; accounts of its foundation differ. Check prayer and visiting times, and follow local dress and photography guidance.",
      "ar": "يعكس مسجد هوايشنغ ومنارته صلات قوانغتشو التاريخية بالعالم العربي، وتختلف الروايات حول تأسيسه. تحقّقي من أوقات الصلاة والزيارة، واتبعي إرشادات اللباس والتصوير في الموقع."
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
      "zh": "明朝建的，五百多年。它藏在濠畔街的日常巷子里，没有游客，来礼拜的多是住在附近的人。想安安静静待一会儿，来这座。",
      "en": "Ming dynasty, more than five hundred years old. It sits in the ordinary lanes of Haopan Street with no tourists; most of those who pray here live nearby. Come to this one when you want somewhere quiet.",
      "ar": "من عهد أسرة مينغ، وعمره أكثر من خمسمائة عام. يقع في أزقة شارع هاوبان العادية بلا سيّاح، ومعظم من يصلّون فيه من سكان الحي. تعالَ إلى هذا المسجد إن أردت مكانًا هادئًا."
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
