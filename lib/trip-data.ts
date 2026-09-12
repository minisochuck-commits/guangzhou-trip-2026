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
        "zh": "装高德地图（Amap），第一件事是把酒店收藏起来：搜「广州保利洲际酒店」，核对地址是海珠区阅江中路828号。英文名搜不到的时候，换中文再搜一次。",
        "en": "Install Amap, and the first thing to do is save the hotel: search 广州保利洲际酒店 and check the address reads 828 Yuejiang Middle Road, Haizhu. When an English name turns up nothing, search again in Chinese.",
        "ar": "ثبّتي خرائط Amap، وأول خطوة أن تحفظي الفندق: ابحثي عن 广州保利洲际酒店 وتأكّدي أن العنوان هو 828 Yuejiang Middle Road بمنطقة هايتشو. وإن لم يظهر الاسم الإنجليزي فأعيدي البحث بالصينية."
      },
      {
        "zh": "出门前存三张截图：今天要去的地方、下车点或地铁出口、回酒店的中文地址。手机没信号的时候，截图照样能给司机看。",
        "en": "Before you go out, save three screenshots: where you are heading, the drop-off point or metro exit, and the hotel’s Chinese address for the way back. With no signal, a screenshot still shows a driver where you mean.",
        "ar": "قبل الخروج احفظي ثلاث صور للشاشة: وجهتك، ونقطة النزول أو مخرج المترو، وعنوان الفندق بالصينية للعودة. وعند انقطاع الشبكة تظلّ الصورة كافية لتُري السائق وجهتك."
      },
      {
        "zh": "步行导航常常把你带向天桥、地下通道或商场入口。到了路口，也留意一下现场的步行指示牌。",
        "en": "Walking directions often route you over a footbridge, through an underpass or in via a mall entrance. At the crossing itself, look at the pedestrian signs on the spot as well.",
        "ar": "كثيرًا ما يقودكم التوجيه للمشاة إلى جسر علوي أو نفق أو مدخل مركز تجاري. وعند التقاطع نفسه، انتبهوا أيضًا إلى لافتات المشاة في المكان."
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
  /** 一列商场里的小缩略图。 */
  imageKey?: string;
  /** 成幅照片（lib/guide-photos.ts 里的 key）：这一家值得看一眼的样子。 */
  photoKey?: string;
  /** 照片里看得见什么，三语。 */
  imageAlt?: L10n;
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
      "zh": "可以从最感兴趣的两三家开始：有的看高端品牌与橱窗，有的在露天花园里歇脚，还有的把整条街开在地下。同一条天河路，逛法很不一样。",
      "en": "Start with the two or three that interest you most: luxury labels and window displays, a break in an open-air garden, or a whole shopping street below ground. The same road offers quite different ways to spend an afternoon.",
      "ar": "ابدؤوا بمركزين أو ثلاثة تثير اهتمامكم أكثر: علامات فاخرة وواجهات عرض، أو استراحة في حديقة مكشوفة، أو شارع تسوّق كامل تحت الأرض. يمنحكم الشارع نفسه طرقًا مختلفة لقضاء فترة بعد الظهر."
    }
  ],
  "malls": [
    {
      "id": "taikoo",
      "imageKey": "taikoo",
      "imageAlt": { "zh": "太古汇的石墙与招牌，前面是行道树和走过的人", "en": "The stone wall and sign of Taikoo Hui, with street trees and people passing in front", "ar": "الجدار الحجري ولافتة تايكو هوي، وأمامها أشجار الشارع والمارة" },
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
        "zh": "石墙外立面，门前一排行道树，进去是宽走道和一间挨一间的国际品牌。不买东西也可以只看橱窗，各家店面都花过心思。商场连接石牌桥站，适合作为天河路散步的一站。",
        "en": "A stone façade with a row of street trees in front; inside, wide walkways and international labels one after another. You can come only to look at the windows — the shopfronts here have had care put into them. The mall connects to Shipaiqiao metro station, which makes it an easy stop on a Tianhe Road walk.",
        "ar": "واجهة حجرية وأمامها صفّ من أشجار الشارع؛ وفي الداخل ممرات واسعة وعلامات عالمية واحدة تلو الأخرى. ويمكن المجيء لمشاهدة الواجهات فقط، فتصميم المحال هنا نال عناية. ويتصل المركز بمحطة مترو شيبايتشياو، فيصلح محطة سهلة في جولة شارع تيانخه."
      }
    },
    {
      "id": "parc-central",
      "photoKey": "parc-garden",
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
      imageKey: "grandview",
      imageAlt: { zh: "正佳广场的正门与门前的广场，招牌两侧挂着大幅彩色广告", en: "The main entrance of Grandview Mall and the plaza in front, big colourful billboards flanking the sign", ar: "المدخل الرئيسي لغراندفيو مول والساحة أمامه، وعلى جانبي اللافتة لوحتان إعلانيتان ملوّنتان" },
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
        "zh": "商场里开着一座海洋馆，逛到一半能看见鱼。海洋馆另买门票，想去就单独留出时间，不要挤在逛街的空档里。",
        "en": "There is an aquarium inside the mall, so halfway round the shops you find yourself looking at fish. It has its own ticket: if you want to see it, give it its own slot rather than squeezing it between shops.",
        "ar": "داخل المركز أكواريوم، فتجدون أنفسكم في منتصف الجولة أمام الأسماك. وله تذكرة منفصلة: إن أردتم زيارته فخصّصوا له وقتًا مستقلًا بدل حشره بين المتاجر."
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
        "zh": "一栋楼里从百货、服装到餐饮都有。商场直接连着地铁体育西路站，从站里出闸就进商场，下雨天从这里起步最省事。",
        "en": "A department store, clothing floors and restaurants in one building. It connects directly to Tiyu Xilu metro station, so you step off the concourse straight into the shops — the easy place to start on a wet day.",
        "ar": "متجر كبير وطوابق ملابس ومطاعم في مبنى واحد. ويتصل المركز مباشرة بمحطة مترو تييو شيلو، فتدخلون من المحطة إلى المتاجر رأسًا — وهو أيسر مكان للبدء في يوم ممطر."
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
        "zh": "就在太古汇隔壁，和几栋写字楼连在一起。逛累了想找个地方坐下来喝一杯，从太古汇走几步就到。",
        "en": "Right next to Taikoo Hui and joined onto several office buildings. When you have walked enough and want to sit down with a drink, it is a few steps from Taikoo Hui.",
        "ar": "ملاصق لتايكو هوي ومتصل بعدة مبانٍ مكتبية. وحين تتعبون من المشي وتريدون الجلوس مع مشروب، فهو على بعد خطوات من تايكو هوي."
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

export type CultureNote = {
  id: string;
  title: L10n;
  body: L10n;
  /** 少数几条要给出处（放假安排、民俗），章尾统一折叠显示。 */
  sources?: { label: L10n; url: string }[];
};

export const CULTURE_NOTES: CultureNote[] = [
  {
    id: "mid-autumn",
    title: { zh: "这次，正好赶上中秋", en: "Your week falls on the Mid-Autumn Festival", ar: "أسبوعكم يصادف عيد منتصف الخريف" },
    body: {
      zh: "这趟来华之行，正好赶上 9 月 25—27 日的中秋假期。月饼、赏月、与家人吃一顿团圆饭，是这个节日的几件大事。逛街看到月亮和玉兔的装饰，也就知道它们在迎接什么。\n假期想坐夜游船或去热门餐厅，可以提前预约；27 日去机场前也留意路况。周五的主麻仍按清真寺当天的时间安排。",
      en: "This trip falls on the Mid-Autumn holiday, 25–27 September. Mooncakes, looking at the full moon and a family dinner are what the festival is about; when you see moons and jade rabbits in the shop displays, that is what they are for.\nIf you want an evening river cruise or a popular restaurant over the holiday, book ahead; and check the traffic before leaving for the airport on the 27th. Friday prayer still follows whatever time the mosque gives that day.",
      ar: "تصادف هذه الرحلة عطلة منتصف الخريف، من 25 إلى 27 سبتمبر. كعك القمر والنظر إلى البدر وعشاء العائلة هي محاور هذا العيد؛ وحين ترون الأقمار والأرانب في واجهات المتاجر فتلك هي المناسبة.\nوإن أردتم جولة نهرية مسائية أو مطعمًا مطلوبًا في العطلة فاحجزوا مسبقًا؛ وتفقّدوا حركة السير قبل التوجّه إلى المطار يوم 27. أما صلاة الجمعة فتبقى بحسب الوقت الذي يحدّده المسجد في يومه.",
    },
    sources: [
      {
        label: {
          zh: "国务院 2026 年部分节假日安排（北京市政府转载）",
          en: "State Council: the 2026 public holiday schedule (via the Beijing government)",
          ar: "مجلس الدولة: جدول العطل الرسمية لعام 2026 (عبر حكومة بكين)",
        },
        url: "https://www.beijing.gov.cn/cs/gncs/zcwj/202603/t20260327_4568275.html",
      },
      {
        label: {
          zh: "广州市政府：中秋节的传统习俗",
          en: "Guangzhou government: the customs of Mid-Autumn",
          ar: "حكومة قوانغتشو: عادات عيد منتصف الخريف",
        },
        url: "https://www.gz.gov.cn/zt/jrshts/2021n/zqj/ctjr/content/post_7790667.html",
      },
    ],
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
    title: { zh: "初次见面的几件小事", en: "Meeting people", ar: "عند اللقاء الأول" },
    body: {
      zh: "商务场合握手很常见，看对方是否先伸手；不方便握手，点头微笑、手放在胸口一样得体。名字是姓在前，不确定怎么称呼，直接问一句「我该怎么称呼您？」。\n聊起来可能会被问到年龄、结婚没有、孩子几个，不想答就笑一下换个话题。想合影先问一声；别人举起手机而你不想入镜，说一句「不好意思，我不想拍照，谢谢」就够了。",
      en: "Handshakes are common in business settings — see whether a hand comes out first. If you would rather not, a nod, a smile and a hand to your chest does the job. Family names come first here, and if you are unsure how to address someone, ask: “How should I address you?”\nYou may be asked your age, whether you are married, how many children you have; a smile and a change of subject is answer enough. Ask before taking a photo with someone, and if a phone comes up and you would rather not be in the picture, “Sorry, I would rather not be photographed, thank you” is enough.",
      ar: "المصافحة شائعة في المواقف المهنية — انظروا أولًا إن امتدّت اليد. وإن لم ترغبوا، فإيماءة وابتسامة ويد على الصدر تكفي. واسم العائلة يأتي أولًا هنا، وإن لم تعرفوا كيف تخاطبون أحدهم فاسألوا: «كيف أناديك؟».\nوقد تُسألون عن العمر أو الزواج أو عدد الأولاد؛ وابتسامة وتغيير الموضوع جواب كافٍ. واستأذنوا قبل التقاط صورة مع أحد، وإن رُفع هاتف ولم ترغبوا في الظهور فقولوا: «عذرًا، لا أرغب في التصوير، شكرًا».",
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
    title: { zh: "赴约与路上的时间", en: "Getting there on time", ar: "الموعد والطريق إليه" },
    body: {
      zh: "会议、接送、饭局，写的时间就是开始的时间。出发前看一眼路况；路上堵了，发条消息说一下预计几点到。",
      en: "Meetings, pick-ups and dinners begin at the time written down. Check the traffic before you set out, and if you are held up, send a message with the time you now expect.",
      ar: "تبدأ الاجتماعات والتوصيلات والعشاءات في الوقت المكتوب. تفقّدوا حركة السير قبل الخروج، وإن تأخّرتم فأرسلوا رسالة بالوقت الذي تتوقّعون الوصول فيه.",
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
  /** 照片里看得见什么，三语。 */
  imageAlt?: L10n;
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
    imageAlt: { zh: "广州大剧院浅色的石砌外壳，背后是珠江新城的高楼", en: "The pale stone shell of the Guangzhou Opera House, the towers of Zhujiang New Town rising behind it", ar: "القشرة الحجرية الفاتحة لدار أوبرا قوانغتشو، وخلفها أبراج تشوجيانغ الجديدة" },
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
      zh: "一片开阔的市民广场，东塔与西塔一左一右立在两边，正前方隔江就是广州塔。广场上那两块歪斜的石头形状的建筑是广州大剧院，扎哈·哈迪德设计 —— 她是伊拉克裔，造型取自被河水冲刷过的两块卵石。旁边是广州图书馆和广东省博物馆。",
      en: "A wide civic square with the East Tower and the West Tower standing on either side of it and the Canton Tower straight ahead across the water. The two tilted stone shapes on the square are the Guangzhou Opera House by Zaha Hadid — Iraqi-born — designed as two pebbles worn smooth by a river. The city library and the Guangdong Museum stand beside it.",
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
    imageAlt: { zh: "夜里的广州塔，钢网塔身亮着红橙色的灯，江上停着一条亮灯的游船", en: "The Canton Tower at night, its steel lattice lit red and orange, a lit cruise boat on the river below", ar: "برج كانتون ليلًا وهيكله الفولاذي مضاء بالأحمر والبرتقالي، وتحته على النهر قارب سياحي مضاء" },
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
    imageAlt: { zh: "从对岸看夜里的广州塔，塔身亮着彩色的灯，灯光落在珠江水面上", en: "The Canton Tower at night seen from the far bank, lit in colour, its light lying on the Pearl River", ar: "برج كانتون ليلًا من الضفة المقابلة، مضاءً بالألوان وأضواؤه ممتدّة على صفحة نهر اللؤلؤ" },
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
    imageAlt: { zh: "太古汇的石墙与招牌，前面是行道树和走过的人", en: "The stone wall and sign of Taikoo Hui, with street trees and people passing in front", ar: "الجدار الحجري ولافتة تايكو هوي، وأمامها أشجار الشارع والمارة" },
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
      zh: "从太古汇出发，沿天河路走向正佳广场、天环，三家之间步行可达。这一路真正值得停下来的是三件事：太古汇宽敞的中庭、正佳商场里的水族馆（另购票）、天环露天的下沉庭园。挑两三家就够一个下午，六家各自的样子写在「广州商圈」那一章。",
      en: "Start at Taikoo Hui and walk along Tianhe Road towards Grandview and Parc Central; the three are within walking distance of one another. Three things are worth stopping for: the wide atrium at Taikoo Hui, the aquarium inside Grandview (separate ticket), and the open sunken garden at Parc Central. Two or three malls fill an afternoon; what each of the six is like is described in the shopping-districts chapter.",
      ar: "ابدؤوا من تايكو هوي وامشوا على شارع تيانخه نحو غراندفيو وبارك سنترال؛ والثلاثة متقاربة سيرًا. وثمة ثلاثة أشياء تستحق التوقّف: البهو الواسع في تايكو هوي، والأكواريوم داخل غراندفيو (تذكرة منفصلة)، والحديقة الغائرة المكشوفة في بارك سنترال. ومركزان أو ثلاثة يملأون العصر؛ وطابع كل من الستة مشروح في فصل مناطق التسوّق.",
    },
    steps: [
      {
        zh: "酒店 → 太古汇 → 沿天河路走向正佳广场 → 天环 → 返回。",
        en: "Hotel → Taikoo Hui → along Tianhe Road to Grandview → Parc Central → back.",
        ar: "الفندق ← تايكو هوي ← على شارع تيانخه إلى غراندفيو ← بارك سنترال ← العودة.",
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
    imageAlt: { zh: "北京路步行街挤满了人，两侧竖着一排店铺招牌", en: "Beijing Road pedestrian street full of people, a row of shop signs down both sides", ar: "شارع بكين للمشاة يعجّ بالناس، وعلى جانبيه صفّ من لافتات المتاجر" },
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
      zh: "街心那段古道是这条街独有的：十一层路面从唐代叠到民国，2002 年修路时挖了出来，没有搬走，就地盖上玻璃罩。透过玻璃看完，再拐进两边的巷子 —— 老字号、小吃和骑楼都在那里。",
      en: "The roadway in the middle of the street is this street's own: eleven layers stacked from the Tang dynasty to the twentieth century, dug up during roadworks in 2002, never moved, covered with glass where it lay. Look at it through the glass, then turn into the side lanes — the old shops, the street food and the arcades are all in there.",
      ar: "الطريق القديم في وسط الشارع خاصّ بهذا الشارع وحده: إحدى عشرة طبقة متراكمة من عهد تانغ حتى القرن العشرين، كُشفت في أعمال الطرق عام 2002، ولم تُنقل بل غُطّيت بالزجاج في موضعها. انظروا إليها من خلال الزجاج ثم انعطفوا إلى الأزقة الجانبية — فالمتاجر العريقة وأكل الشارع والأروقة كلها هناك.",
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
    imageAlt: { zh: "沙面岛上黄墙拱窗的老楼，树影落在安静的街道上", en: "Yellow, arch-windowed old buildings on Shamian Island, tree shadows across a quiet street", ar: "مبانٍ قديمة صفراء بنوافذ مقوّسة في جزيرة شاميان، وظلال الأشجار على شارع هادئ" },
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

export type FoodNote = {
  id: string;
  title: L10n;
  body: L10n;
  url?: string;
  imageKey?: string;
  /** 照片里看得见什么，三语。读屏与图说都用它，不留空 alt。 */
  imageAlt?: L10n;
  /** 这一道给整幅主图；其余的走紧凑小图，不要十一屏一样的图文。 */
  hero?: boolean;
};

export const FOOD_NOTES: FoodNote[] = [
  {
    "id": "morning-tea",
    "hero": true,
    "imageKey": "dimsum",
    "imageAlt": { "zh": "桌上摆满打开的竹蒸笼，一笼一样点心", "en": "A table crowded with open bamboo steamers, a different dim sum in each", "ar": "مائدة تكتظّ بسلال البخار المفتوحة، في كل واحدة نوع مختلف من الديم سم" },
    "title": {
      "zh": "早茶",
      "en": "Morning tea (yum cha)",
      "ar": "شاي الصباح"
    },
    "body": {
      "zh": "先看菜单点两三样，配一壶茶；吃完再添，不用一次点满。点心有半透明皮的虾饺，也有酥皮的蛋挞，各家菜单不一样，点之前可以问一句馅里是什么。水快没了，就把壶盖掀开放着，服务员看见会来加。留足一个半小时。",
      "en": "Read the menu, order two or three things and a pot of tea, then add more as you go rather than ordering everything at once. The dim sum runs from steamed prawn dumplings with translucent skins to baked egg tarts with crisp pastry; every house has its own menu, so ask what is in the filling before you order. When the water runs low, tip the lid of the pot open and leave it: a waiter will see it and refill. Allow an hour and a half.",
      "ar": "اقرؤوا القائمة واطلبوا صنفين أو ثلاثة مع إبريق شاي، ثم زيدوا تباعًا بدل طلب كل شيء دفعة واحدة. وتتنوّع الديم سم بين زلابية الروبيان المطهوّة بالبخار بقشرتها الشفافة وتارت البيض المخبوز بعجينته المقرمشة؛ ولكل مطعم قائمته، فاسألوا عمّا في الحشوة قبل الطلب. وحين يقلّ الماء ارفعوا غطاء الإبريق واتركوه مفتوحًا: سيراه العامل ويعيد الملء. واتركوا لها ساعة ونصفًا."
    },
    "url": "https://wglj.gz.gov.cn/gzdt/zwxx/content/post_10755149.html"
  },
  {
    "id": "changfen",
    "imageKey": "changfen",
    "imageAlt": { "zh": "一碟肠粉，米皮卷着馅，淋着豉油、撒上葱花", "en": "A plate of rice noodle rolls in soy sauce, scattered with spring onion", "ar": "طبق من لفائف الأرز في صلصة الصويا ومرشوش عليها بصل أخضر" },
    "title": {
      "zh": "肠粉",
      "en": "Rice noodle rolls (changfen)",
      "ar": "لفائف الأرز"
    },
    "body": {
      "zh": "米浆在蒸屉上摊成极薄的一张皮，卷上馅，淋一勺豉油。刚出锅的时候又滑又软。名字里那个「肠」说的是它卷起来的样子，不是肠子。",
      "en": "Rice batter is spread into a paper-thin sheet on the steamer, rolled around a filling and finished with a spoonful of soy. Straight out of the steamer it is slippery and soft. The chang in its name describes the roll, not intestines.",
      "ar": "يُفرَد خليط الأرز طبقةً رقيقة كالورق فوق البخار، ثم يُلفّ حول الحشوة ويُسقى بملعقة صويا. وحين يخرج من البخار يكون ناعمًا طريًّا. و«تشانغ» في اسمه تصف اللفّة لا الأمعاء."
    },
    "url": "https://www.gz.gov.cn/zlgz/whgz/content/post_9674292.html"
  },
  {
    "id": "tingzai",
    "imageKey": "congee",
    "imageAlt": { "zh": "一碗艇仔粥，上面放着花生和葱花", "en": "A bowl of sampan congee topped with peanuts and spring onion", "ar": "وعاء من عصيدة «سامبان» وفوقها فول سوداني وبصل أخضر" },
    "title": {
      "zh": "艇仔粥",
      "en": "Sampan congee",
      "ar": "عصيدة القوارب"
    },
    "body": {
      "zh": "米粒熬得绵软，粥底稠滑。配料各家不同，常见的有花生、葱花、鱼片或虾，想知道今天放了什么，问一句就行。名字来自从前在珠江上撑小艇卖粥的人，现在都在岸上的店里吃了。",
      "en": "The rice is cooked down until the grains dissolve, leaving the congee thick and smooth. What goes in varies from shop to shop — peanuts, spring onion, slices of fish or prawn are common; ask what is in today's bowl. The name comes from the people who once sold congee from sampans on the Pearl River; it is eaten in shops on dry land now.",
      "ar": "يُطهى الأرز حتى تذوب حبّاته، فتصير العصيدة كثيفة ناعمة. وتختلف الإضافات من محل إلى آخر — الفول السوداني والبصل الأخضر وشرائح السمك أو الروبيان شائعة؛ فاسألوا عمّا في وعاء اليوم. أما الاسم فمن الذين كانوا يبيعون العصيدة من زوارق صغيرة في نهر اللؤلؤ، وتُؤكل اليوم في محال على البرّ."
    }
  },
  {
    "id": "dessert",
    "hero": true,
    "imageKey": "ginger",
    "imageAlt": { "zh": "青花瓷碗里的姜撞奶，表面凝住，勺子搁在上面", "en": "Ginger milk curd in a blue-and-white bowl, the surface set firm, the spoon resting on it", "ar": "حليب الزنجبيل المخثّر في وعاء أزرق وأبيض، سطحه متماسك والملعقة مستقرّة عليه" },
    "title": {
      "zh": "甜品",
      "en": "Desserts",
      "ar": "الحلويات"
    },
    "body": {
      "zh": "一碗姜汁，冲进热牛奶，不搅动，放着 —— 过一会儿就凝成嫩滑的一碗。凝固的奥妙，在姜汁里的酶。入口先是奶香，跟着是姜的一点辣。同一家店通常还有双皮奶和绿豆沙；马蹄糕是另一路，煎过的边带点焦香。",
      "en": "A bowl of ginger juice, hot milk poured straight in, no stirring, then left alone — and a few minutes later it is a softly set milk pudding. The trick is an enzyme in the ginger juice. Milk first on the tongue, then the small heat of the ginger. The same shops usually have double-skin milk and mung bean soup; water chestnut cake is a different idea altogether, pan-fried at the edges.",
      "ar": "وعاء من عصير الزنجبيل، يُصبّ فيه الحليب الساخن مباشرة، دون تحريك، ثم يُترك — وبعد دقائق يصير حلوى حليب متماسكة طريّة. وسرّ التماسك إنزيمٌ في عصير الزنجبيل. الحليب أولًا على اللسان، ثم حرارة الزنجبيل الخفيفة. وفي المحال نفسها عادةً حليب الطبقتين وحساء الفاصولياء الخضراء؛ أما كعكة كستناء الماء فاتجاه آخر، تُحمّر أطرافها في المقلاة."
    },
    "url": "https://www.gz.gov.cn/zlgz/whgz/content/post_9047632.html"
  },
  {
    "id": "roast-goose",
    "hero": true,
    "imageKey": "goose",
    "imageAlt": { "zh": "斩件的烧鹅摆在长盘里，皮色红亮，旁边一碟青菜", "en": "Chopped roast goose on an oval platter, the skin glossy red-brown, a dish of greens beside it", "ar": "إوز مشوي مقطّع في طبق بيضوي، جلده لامع بلون بنّي محمرّ، وبجانبه طبق خضار" },
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
      "zh": "先卤后炸，外皮薄得一咬就裂，里面还留着汁。整只上桌，可以请店员斩开：翅膀和腿那几块皮最脆，胸口的肉厚一些。想多尝几道，可以两个人分一只；趁热吃，凉了皮就软了。",
      "en": "Braised first, then fried, until the skin is thin enough to crack at the first bite and the juices are still inside. It comes whole, and you can ask for it to be chopped: the wing and leg pieces carry the crispest skin, the breast the thicker meat. If you want to try several dishes, one bird between two works well; eat it hot — the skin softens as it cools.",
      "ar": "يُطهى في المرق أولًا ثم يُقلى حتى يصير الجلد رقيقًا يتكسّر من أول قضمة والعصارة ما زالت في الداخل. يُقدَّم كاملًا، ويمكنكم طلب تقطيعه: قطع الجناح والفخذ تحمل أقرمش الجلد، والصدر لحمه أسمك. وإن أردتم تجربة أطباق عدة، فطائر واحد بين اثنين يكفي؛ ويُؤكل ساخنًا — فالجلد يلين حين يبرد."
    },
    "url": "https://www.zs.gov.cn/zjzs/lygg/mytc/content/post_2399451.html"
  },
  {
    "id": "seafood",
    "title": {
      "zh": "海鲜：即捞即食",
      "en": "Seafood, netted and cooked on the spot",
      "ar": "المأكولات البحرية: تُصطاد وتُطهى فورًا"
    },
    "body": {
      "zh": "有水缸的粤菜馆，点菜是从缸边开始的：指一条，捞起来称重，再说清蒸还是别的做法。清蒸最能看出鱼新不新鲜 —— 上桌的主味是姜丝、葱丝和一勺豉油，鱼肉本身是清甜的。点之前先问清楚两件事：价钱按斤还是按只，加工费算不算在里面。一市斤是 500 克。",
      "en": "In a Cantonese restaurant with tanks, ordering starts at the tank: point at one, watch it weighed, then say how you want it cooked. Steaming is the test of freshness — the main flavours on the plate are shredded ginger, spring onion and a spoon of soy, and the flesh itself tastes clean and sweet. Settle two things before you order: whether the price is by weight or by the piece, and whether cooking is included. One Chinese jin is 500 grams.",
      "ar": "في المطاعم الكانتونية ذات الأحواض يبدأ الطلب عند الحوض: أشيروا إلى واحدة، وشاهدوها تُوزن، ثم حدّدوا طريقة الطهي. والتبخير هو اختبار الطزاجة — النكهات الأساسية في الطبق شرائح الزنجبيل والبصل الأخضر وملعقة صويا، ولحم السمكة نفسه نظيف حلو المذاق. واحسموا أمرين قبل الطلب: هل السعر بالوزن أم بالقطعة، وهل أجرة الطهي محتسبة. و«الجين» الصيني يساوي 500 غرام."
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
    "imageAlt": { "zh": "潮汕牛肉火锅的桌面：清汤锅冒着热气，旁边几盘按部位分开的生牛肉", "en": "A Chaoshan beef hotpot table: a pot of clear broth steaming, plates of raw beef by cut set around it", "ar": "مائدة قدر لحم البقر على طريقة تشاوشان: قدر مرق صافٍ يتصاعد بخاره، وحوله أطباق لحم نيّئ مقسّمة حسب القطع" },
    "title": {
      "zh": "潮汕牛肉火锅",
      "en": "Chaoshan beef hotpot",
      "ar": "هوت بوت اللحم البقري على طريقة تشاوشان"
    },
    "body": {
      "zh": "锅里是一锅清汤，不辣，为的是让牛肉自己说话。肉按部位分盘上，切得薄，每盘的纹路和嚼劲都不一样：有的化在嘴里，有的要多嚼两下。第一次点两三种就好，不够再加。吃到后面那锅汤最鲜，盛一碗收尾。",
      "en": "The broth is clear and not spicy, so the beef can speak for itself. The meat comes plate by plate, cut by cut and sliced thin, and no two plates chew the same: one melts, another asks for a couple more bites. Two or three cuts is plenty for a first visit; order more if you want them. The broth is at its best by the end; finish with a bowl of it.",
      "ar": "المرق صافٍ وغير حارّ ليترك اللحم يتحدّث عن نفسه. يأتي اللحم طبقًا بعد طبق، قطعةً بعد قطعة ومقطّعًا رقيقًا، ولا يتشابه طبقان في المضغ: واحد يذوب، وآخر يطلب مضغتين إضافيتين. وقطعتان أو ثلاث تكفي في أول زيارة، وزيدوا إن أردتم. والمرق يبلغ أفضل حالاته في النهاية؛ فاختموا بوعاء منه."
    },
    "url": "https://zh.wikipedia.org/zh-hans/%E6%BD%AE%E6%B1%95%E7%89%9B%E8%82%89%E7%81%AB%E9%94%85"
  },
  {
    "id": "white-cut-chicken",
    "imageKey": "chicken",
    "imageAlt": { "zh": "一盘白切鸡，四周围着青菜，角落一小碟姜葱蘸料", "en": "A plate of white-cut chicken ringed with greens, a small dish of ginger and spring onion beside it", "ar": "طبق دجاج مسلوق تحيط به الخضار، وبجانبه صحن صغير من الزنجبيل والبصل الأخضر" },
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
    "hero": true,
    "imageKey": "chowfun",
    "imageAlt": { "zh": "一盘干炒牛河，宽河粉里拌着牛肉片、芽菜和洋葱", "en": "A plate of dry-fried beef ho fun: wide rice noodles tossed with beef, bean sprouts and onion", "ar": "طبق من شعيرية الأرز العريضة المقلية مع شرائح اللحم وبراعم الفول والبصل" },
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
  /** 成幅照片（lib/guide-photos.ts 里的 key），按原比例显示，alt 与图说跟着照片走。 */
  photoKey?: string;
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
    "zh": "一座中国式的屋檐旁边，立着一座宣礼塔。",
    "en": "Beside a Chinese roof stands a minaret.",
    "ar": "إلى جوار سقفٍ صيني تقف مئذنة."
  },
  "paragraphs": [
    {
      "zh": "唐宋两代，阿拉伯和波斯商人乘船来广州做买卖。他们上岸的地方后来叫光塔码头，落脚的街区叫蕃坊：铺子、住处和礼拜的地方都在那几条街上，一住就是几代人。",
      "en": "Under the Tang and Song dynasties, Arab and Persian merchants came to Guangzhou by sea to trade. The landing they used became known as the Guangta wharf and the quarter they lived in as the Fanfang: shops, houses and a place to pray within the same few streets, for generations.",
      "ar": "في عهدَي تانغ وسونغ، جاء تجار عرب وفرس إلى قوانغتشو بحرًا للتجارة. وصار مرساهم يُعرف برصيف قوانغتا، وحيّهم باسم «الفانفانغ»: متاجر ومنازل ومكان للصلاة في الشوارع نفسها، على مدى أجيال."
    },
    {
      "zh": "那个街区的中心是怀圣寺。灰白色的圆筒形塔身抹着灰泥，从中国式的屋檐后面升起来 —— 这是宣礼塔，当年也为江上的船指方向、看风向，广州人因此叫它光塔。",
      "en": "At the centre of that quarter is Huaisheng Mosque. A pale cylindrical shaft, rendered in plaster, rises from behind Chinese eaves — a minaret that also served the ships on the river as a marker and a wind vane, which is why the city calls it the Light Tower.",
      "ar": "وفي قلب ذلك الحي يقوم مسجد هوايشنغ. بدنٌ أسطواني شاحب مكسوّ بالجصّ ينهض من خلف أفاريز صينية — مئذنةٌ كانت أيضًا علامةً للسفن في النهر ودوّارةً للريح، ولذلك تسمّيها المدينة «برج النور»."
    },
    {
      "zh": "想去看看，在地图里搜「怀圣寺」；逛完光塔路，再沿街找一间清真小馆坐下。",
      "en": "To visit, search 怀圣寺 in your map app; after Guangta Road, find one of the halal places along the street and sit down.",
      "ar": "للزيارة ابحثوا عن 怀圣寺 في تطبيق الخرائط؛ وبعد شارع قوانغتا اجلسوا في أحد المطاعم الحلال على الشارع."
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
  lead: {
    zh: "从落地，到江边的夜色，广州一点点展开。",
    en: "Guangzhou unfolds from the moment you land.",
    ar: "تتكشف لكم قوانغتشو منذ لحظة الوصول.",
  },
  intro: [
    {
      zh: "白云机场的航班来自世界各地；到了琶洲，连成一片的展馆迎接各国采购商。入夜再到珠江边，两岸的高楼亮起来，白天忙碌的城换了一个样子。",
      en: "Flights from around the world meet at Baiyun Airport. In Pazhou, long rows of exhibition halls welcome international buyers. After dark, walk down to the Pearl River: the towers light up, and the city takes on a different mood.",
      ar: "تلتقي في مطار بايون رحلات من أنحاء العالم. وفي بازو، تستقبل قاعات المعارض المتجاورة مشترين من دول كثيرة. وبعد الغروب، تمشّوا إلى نهر اللؤلؤ؛ تضيء الأبراج على الضفتين وتبدو المدينة بمزاج آخر.",
    },
    {
      zh: "背景是这样的：广州住着约一千九百万人，是粤港澳大湾区十一座城市之一。",
      en: "For background: about nineteen million people live in Guangzhou, one of the eleven cities of the Greater Bay Area.",
      ar: "وللخلفية: يعيش في قوانغتشو نحو تسعة عشر مليون نسمة، وهي إحدى مدن منطقة الخليج الكبرى الإحدى عشرة.",
    },
  ],
  tiles: [
    {
      id: "gdp",
      value: { zh: "3.2", en: "3.2", ar: "3.2" },
      unit: { zh: "万亿元 · 2025 年 GDP", en: "trillion yuan · GDP, 2025", ar: "تريليون يوان · الناتج المحلي 2025" },
      note: { zh: "制造、商贸与服务业加在一起的一年", en: "A year of manufacturing, trade and services added together", ar: "حصيلة سنة من الصناعة والتجارة والخدمات مجتمعة" },
    },
    {
      id: "airport",
      value: { zh: "8,359", en: "83.6", ar: "83.6" },
      unit: { zh: "万人次 · 白云机场 2025", en: "million passengers · Baiyun, 2025", ar: "مليون مسافر · مطار بايون 2025" },
      note: { zh: "折合每天约 23 万人次进出", en: "About 230,000 people a day", ar: "نحو 230 ألف شخص يوميًا" },
    },
    {
      id: "tower",
      value: { zh: "600", en: "600", ar: "600" },
      unit: { zh: "米 · 广州塔", en: "m · Canton Tower", ar: "م · برج كانتون" },
      note: { zh: "珠江边的广州塔，入夜后灯光变换", en: "The Canton Tower by the Pearl River; after dark its lighting changes", ar: "برج كانتون على ضفة نهر اللؤلؤ؛ وبعد الغروب تتبدّل إضاءته" },
    },
    {
      id: "fair",
      value: { zh: "31", en: "310,000", ar: "310,000" },
      unit: { zh: "万境外采购商 · 第 138 届广交会", en: "overseas buyers · 138th Canton Fair", ar: "مشترٍ أجنبي · معرض كانتون الـ138" },
      note: { zh: "来自 223 个国家和地区，展馆就在酒店这条路上", en: "From 223 countries and regions; the halls are on your hotel's street", ar: "من 223 دولةً ومنطقة؛ والقاعات في شارع فندقكم" },
    },
  ],
  sources: [
    { label: { zh: "2025 年广州市国民经济和社会发展统计公报", en: "Guangzhou 2025 statistical communiqué", ar: "البيان الإحصائي لقوانغتشو 2025" }, url: "https://www.gz.gov.cn/zwgk/sjfb/tjgb/content/post_10804075.html" },
    { label: { zh: "广州市统计局：2025 年经济运行情况", en: "Guangzhou Statistics Bureau: the 2025 economy", ar: "مكتب إحصاء قوانغتشو: أداء اقتصاد 2025" }, url: "https://tjj.gz.gov.cn/zzfwzq/tjkx/content/post_10804061.html" },
    { label: { zh: "民航局：白云机场年旅客吞吐量首破八千万", en: "CAAC: Baiyun passes 80 million passengers", ar: "هيئة الطيران المدني: مطار بايون يتجاوز 80 مليون مسافر" }, url: "http://www.caacnews.com.cn/special/2025zhuanti/8427/kjzg/20dzln4/202512/t20251223_1392071.html" },
    { label: { zh: "海珠区政府：广州塔", en: "Haizhu District government: Canton Tower", ar: "حكومة منطقة هايتشو: برج كانتون" }, url: "https://www.haizhu.gov.cn/zjhz/lyck/content/post_7765705.html" },
    { label: { zh: "人民网：第 138 届广交会闭幕，境外采购商创新高", en: "People's Daily: 138th Canton Fair closes with record overseas buyers", ar: "صحيفة الشعب: اختتام معرض كانتون الـ138 برقم قياسي" }, url: "http://pic.people.com.cn/n1/2025/1104/c1016-40596777.html" },
    { label: { zh: "粤港澳大湾区门户网：关于大湾区", en: "Greater Bay Area portal: about the GBA", ar: "بوابة منطقة الخليج الكبرى: عن المنطقة" }, url: "https://www.cnbayarea.org.cn/introduction/content/post_165071.html" },
  ],
};

export type TechItem = {
  id: string;
  imageKey?: string;
  /** 照片里看得见什么，三语。 */
  imageAlt?: L10n;
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
  lead: {
    zh: "车到了，你拉开后门坐进去。驾驶位上没有人，方向盘自己转起来。",
    en: "Your car arrives, you open the back door and get in. Nobody is in the driver's seat, and the wheel turns by itself.",
    ar: "تصل سيارتكم، تفتحون الباب الخلفي وتركبون. لا أحد في مقعد القيادة، والمقود يدور من تلقاء نفسه.",
  },
  intro: {
    zh: "下面这几样，有的在路上，有的在电梯口，有的就在结账那一下。不一定每样都碰得到，但知道它们在，遇上的时候会多看一眼。",
    en: "Some of what follows happens on the road, some at the lift door, some in the second it takes to pay. You may not meet all of it — but knowing it is there makes you look twice when you do.",
    ar: "بعض ما يلي يحدث في الطريق، وبعضه عند باب المصعد، وبعضه في اللحظة التي تدفعون فيها. قد لا تصادفونها كلها — لكن معرفتكم بوجودها تجعلكم تنظرون مرتين حين تصادفونها.",
  },
  items: [
    {
      id: "robotaxi",
      imageKey: "gxr-guangzhou",
      title: { zh: "坐一次没有司机的车", en: "Ride in a car with no driver", ar: "اركبوا سيارة بلا سائق" },
      where: {
        zh: "微信里搜小程序「WeRide Go」，能约的上下车点、价格与运营时间以应用当天显示为准。",
        en: "Search the WeChat mini-program “WeRide Go”; the pickup points, fares and hours it offers on the day are the ones that count.",
        ar: "ابحثوا في وي تشات عن تطبيق «WeRide Go» المصغّر؛ والمعتمد هو ما يعرضه التطبيق في يومه من نقاط ركوب وأسعار ومواعيد.",
      },
      body: {
        zh: "方向盘自己转了半圈，转向灯亮起来，车汇进车流。GXR 这一款索性把前排的副驾驶座也取消了。\n做这件事的公司叫文远知行，总部就在广州，2025 年 9 月起在黄埔跑全无人的商业运营。",
        en: "The wheel turns half a revolution, the indicator comes on, and the car slides into the traffic. On the GXR the front passenger seat has been left out altogether.\nThe company is WeRide, headquartered here in Guangzhou, running a fully driverless commercial service in Huangpu since September 2025.",
        ar: "يدور المقود نصف دورة، ويُضاء ضوء الانعطاف، وتنساب السيارة إلى السير. وفي طراز GXR أُلغي مقعد الراكب الأمامي كذلك.\nالشركة هي «وي رايد» ومقرّها هنا في قوانغتشو، وتشغّل خدمة تجارية بلا سائق في هوانغبو منذ سبتمبر 2025.",
      },
    },
    {
      id: "evtol",
      imageKey: "evtolair",
      imageAlt: { zh: "多旋翼的载人飞行器飞在江边公园上空，背后是成片的住宅楼", en: "A multirotor passenger aircraft over a riverside park, blocks of flats behind it", ar: "طائرة ركاب متعددة المراوح فوق حديقة على ضفة النهر، وخلفها مبانٍ سكنية" },
      title: { zh: "两个座位，没有驾驶舱", en: "Two seats, no cockpit", ar: "مقعدان بلا قمرة قيادة" },
      where: {
        zh: "黄埔有低空体验的场景；想去，先查亿航官方的场地与预约信息。这次行程里没有安排。",
        en: "There are low-altitude flight experiences in Huangpu; if you want to go, start from EHang's own site and booking information. It is not part of this trip.",
        ar: "توجد تجارب طيران منخفض الارتفاع في هوانغبو؛ وإن أردتم الذهاب فابدؤوا من موقع «إي هانغ» الرسمي ومعلومات الحجز. وهي ليست ضمن هذه الرحلة.",
      },
      body: {
        zh: "十六个旋翼一起转起来，机身离地，没有跑道，机上也没有飞行员 —— 舱里是两个乘客的位置，航线由地面设定。\n这架飞机叫 EH216-S，广州的亿航智能造的。",
        en: "Sixteen rotors spin up together and the aircraft lifts off — no runway, and no pilot on board. Inside are two passenger seats, and the route is set from the ground.\nThe aircraft is the EH216-S, built by EHang in Guangzhou.",
        ar: "تدور ستّ عشرة مروحة معًا فترتفع المركبة — بلا مدرج، وبلا طيّار على متنها. في الداخل مقعدان للركاب، والمسار يُحدَّد من الأرض.\nالطائرة هي EH216-S من إنتاج «إي هانغ» في قوانغتشو.",
      },
    },
    {
      id: "robot",
      imageKey: "hotel-lift-robot",
      title: { zh: "会自己坐电梯的送物小车", en: "The trolley that takes the lift by itself", ar: "العربة التي تركب المصعد وحدها" },
      where: {
        zh: "餐厅里推菜、酒店里送外卖和毛巾的都可能是它。入住时可以问一句前台有没有。",
        en: "It may be what brings dishes across a restaurant, or the takeaway and fresh towels to a hotel room. Worth asking at the front desk when you check in.",
        ar: "قد تكون هي ما ينقل الأطباق في المطعم، أو الطعام والمناشف إلى غرفة الفندق. ويستحقّ الأمر سؤالًا في الاستقبال عند الوصول.",
      },
      body: {
        zh: "门铃响，门外站着一台一米来高的小车，盖子打开，里面是你点的东西。有意思的是它怎么上来的：它跟电梯是连着的，自己叫梯、自己进去、到楼层自己出来，中间要和人共用一部电梯。\n商场和写字楼里还有另一种：方方正正的洗地机器人贴着墙根慢慢走，有人走过来它让开，电快没了自己回去充电。",
        en: "The doorbell goes and a trolley about a metre high is standing outside; the lid opens and your order is inside. The interesting part is how it got up here: it talks to the lift, calls it, rides up and steps out at your floor — sharing that lift with people on the way.\nMalls and office towers have another kind: a squared-off scrubbing robot working along the skirting, moving aside when someone comes, taking itself off to charge when the battery runs low.",
        ar: "يرنّ جرس الباب فتجدون عربة بارتفاع متر تقريبًا واقفة في الخارج؛ ينفتح الغطاء وفي داخلها طلبكم. والمثير هو كيف وصلت إلى هنا: فهي متصلة بالمصعد، تستدعيه وتدخله وتخرج عند طابقكم — وتتشارك المصعد مع الناس في الطريق.\nوفي المراكز التجارية والأبراج المكتبية نوع آخر: روبوت تنظيف مربّع يسير بمحاذاة الجدار، يفسح الطريق حين يقترب أحد، ويذهب وحده إلى الشحن حين تنفد بطاريته.",
      },
    },
    {
      id: "drone-delivery",
      imageKey: "pazhou-drone",
      title: { zh: "晚饭走的是另一条路", en: "Dinner takes the other route", ar: "العشاء يسلك طريقًا آخر" },
      where: {
        zh: "想看看，可在地图中找华新中心一带的配送设施；能否下单体验，请查看现场的服务入口。",
        en: "To see it, look for the delivery facilities around Huaxin Centre on the map; whether you can order one yourself is a question for the service point on site.",
        ar: "لمشاهدتها، ابحثوا في الخريطة عن منشآت التوصيل قرب مركز هواشين؛ أما إمكانية الطلب بأنفسكم فيُسأل عنها عند نقطة الخدمة في الموقع.",
      },
      body: {
        zh: "琶洲的外卖多了一条路线：保利广场、华新中心一带装了低空配送设施，无人机沿着河涌上方飞，避开地面的车流。海珠区 2026 年 2 月的报道里，送吧科技和淘宝闪购送的一单煲仔饭，八分钟到。\n你在地面散步时，晚饭可能正沿着身旁的河涌上空飞过。",
        en: "Takeaway in Pazhou has a second route. Low-altitude delivery facilities have gone in around Poly Plaza and Huaxin Centre, and the drones fly above the water channels, clear of the traffic below. In a Haizhu district report from February 2026, an order of claypot rice flown by Songba Technology with Taobao Shangou arrived in eight minutes.\nWhile you are out walking, dinner may be flying along the channel beside you.",
        ar: "لطلبات الطعام في بازو مسار ثانٍ. فقد رُكّبت منشآت للتوصيل المنخفض حول ساحة بولي ومركز هواشين، وتحلّق المسيّرات فوق القنوات المائية بعيدًا عن زحام الشارع. وفي تقرير لمنطقة هايتشو في فبراير 2026، وصل طلب أرز في قدر فخاري نفّذته «سونغبا» مع «تاوباو شانغو» في ثماني دقائق.\nوبينما تتمشّون، قد يكون العشاء يطير فوق القناة التي تسير بجانبكم.",
      },
    },
    {
      id: "cashless",
      imageKey: "cashless",
      imageAlt: { zh: "街边小店的柜台前，顾客举着手机扫码付款", en: "At a street-front counter, a customer holds up a phone to pay by QR code", ar: "عند واجهة متجر في الشارع، زبون يرفع هاتفه للدفع عبر رمز QR" },
      title: { zh: "一杯茶的小额付款", en: "Paying for a cup of tea", ar: "دفع ثمن كوب شاي" },
      where: {
        zh: "买水、喝茶、打车时，都能体验手机付款。",
        en: "Buying water, stopping for tea, taking a taxi — all of them can be paid for with the phone.",
        ar: "شراء الماء، وكوب الشاي، وسيارة الأجرة — كلها يمكن دفعها بالهاتف.",
      },
      body: {
        zh: "菜市场的摊子前面立着一块二维码牌，塑封磨白了，边角用胶带补过。你把手机凑过去，扫一下，摊主看一眼屏幕点点头，这笔买卖就完了 —— 没有钞票，也没有找零。",
        en: "At the market stall a laminated QR code stands propped up, the plastic gone milky, one corner mended with tape. You hold your phone to it, it scans, the stallholder glances at the screen and nods, and the sale is done — no notes, no change.",
        ar: "عند بسطة السوق ينتصب رمز QR مغلَّف بالبلاستيك، شحب غلافه ورُقّع أحد أركانه بشريط لاصق. تقرّبون الهاتف منه فيُمسح، فينظر صاحب البسطة إلى الشاشة ويومئ، وتنتهي الصفقة — بلا أوراق نقدية وبلا فكّة.",
      },
    },
    {
      id: "ev-taxi",
      imageKey: "evtaxi",
      imageAlt: { zh: "黄色的电动出租车停在充电桩前，挂着新能源绿牌", en: "A yellow electric taxi at a charging point, on the green plate that marks an electric vehicle", ar: "سيارة أجرة كهربائية صفراء عند شاحن، تحمل اللوحة الخضراء الخاصة بالسيارات الكهربائية" },
      title: { zh: "安静得让人愣一下的出租车", en: "A taxi quiet enough to make you pause", ar: "سيارة أجرة هادئة إلى حدّ يوقفكم لحظة" },
      where: {
        zh: "在广州叫车，很容易遇见电动车。",
        en: "Hail a car in Guangzhou and you will often get an electric one.",
        ar: "استوقفوا سيارة في قوانغتشو وستصادفون سيارة كهربائية في الغالب.",
      },
      body: {
        zh: "关上门的那一下可能会让你愣一秒：没有发动机的抖动，车厢里安静到能听见空调的风。起步是滑出去的。",
        en: "The moment the door shuts may give you a second's pause: no engine shaking, quiet enough inside to hear the air conditioning. It slides away rather than pulls away.",
        ar: "لحظة إغلاق الباب قد تمنحكم ثانية من الدهشة: لا ارتجاج محرّك، وهدوءٌ في الداخل يكفي لسماع المكيّف. تنساب السيارة بدل أن تندفع.",
      },
    },
  ],
  sources: [
    { label: { zh: "文远知行：广州黄埔开通 7×24 小时全无人 Robotaxi 服务", en: "WeRide: 24/7 fully driverless Robotaxi service in Guangzhou's Huangpu", ar: "وي رايد: خدمة روبوتاكسي بلا سائق على مدار الساعة في هوانغبو" }, url: "https://ir.weride.ai/news-releases/news-release-details/weride-launches-247-fully-driverless-robotaxi-service-guangzhous" },
    { label: { zh: "文远知行：在微信小程序里叫车", en: "WeRide: booking a robotaxi inside WeChat", ar: "وي رايد: حجز روبوتاكسي عبر وي تشات" }, url: "https://ir.weride.ai/news-releases/news-release-details/weride-makes-robotaxi-booking-effortless-tencents-super-app" },
    { label: { zh: "文远知行：GXR 产品页（取消前排副驾驶座）", en: "WeRide: the GXR product page (no front passenger seat)", ar: "وي رايد: صفحة طراز GXR (بلا مقعد راكب أمامي)" }, url: "https://www.weride.ai/posts/anh4opgkfdcl7ag4hurtm5ds" },
    { label: { zh: "广州市政府：全球首张载人 eVTOL 运营合格证落地广州黄埔", en: "Guangzhou government: the world's first passenger-eVTOL operator certificate, Huangpu", ar: "حكومة قوانغتشو: أول شهادة تشغيل لطائرة ركاب كهربائية في العالم، هوانغبو" }, url: "https://www.gz.gov.cn/ysgz/xwdt/ysdt/content/post_10193139.html" },
    { label: { zh: "亿航智能：运营合格证颁发给运营公司（2025-03-30）", en: "EHang: the operator certificates go to operating companies (30 March 2025)", ar: "إي هانغ: شهادات التشغيل تُمنح للشركات المشغّلة (30 مارس 2025)" }, url: "https://www.ehang.com/cn/news/1195.html" },
    { label: { zh: "普渡：酒店配送机器人", en: "Pudu: hospitality delivery robots", ar: "بودو: روبوتات التوصيل الفندقية" }, url: "https://www.pudurobotics.com/en/solutions/hospitality" },
    { label: { zh: "海珠区政府：琶洲的低空配送（2026-02-05）", en: "Haizhu district government: low-altitude delivery in Pazhou (5 February 2026)", ar: "حكومة منطقة هايتشو: التوصيل المنخفض في بازو (5 فبراير 2026)" }, url: "https://www.haizhu.gov.cn/hzdt/ztlm/dkjj/hhr/cjhx/content/post_10678783.html" },
    { label: { zh: "中国政府网：外籍人士在华支付指南", en: "gov.cn: paying in China as a foreign visitor", ar: "بوابة الحكومة الصينية: الدفع في الصين للزائر الأجنبي" }, url: "https://english.www.gov.cn/2025special/bizexpatsinchina2025" },
    { label: { zh: "人民网广东：珠三角新增网约车须为新能源汽车", en: "People's Daily Guangdong: new ride-hailing cars in the Delta must be NEVs", ar: "صحيفة الشعب قوانغدونغ: سيارات النقل التشاركي الجديدة في الدلتا يجب أن تكون كهربائية" }, url: "http://gd.people.com.cn/n2/2024/1212/c123932-41073362.html" },
  ],
};

export const PAZHOU: { lead: L10n; paragraphs: L10n[]; sources: { label: L10n; url: string }[] } = {
  "lead": {
    "zh": "你住的地方，曾经靠一座塔迎接远来的商船。",
    "en": "Where you are staying, a tower once welcomed ships in from the sea.",
    "ar": "حيث تقيمون، كان برجٌ يستقبل السفن القادمة من البحر."
  },
  "paragraphs": [
    {
      "zh": "酒店所在的这一片叫琶洲。这一带的古老地标，是 1597 年始建、1600 年落成的琶洲塔。当年这里还是江中的沙洲，远洋商船溯珠江而上，看见这座塔就知道广州快到了。",
      "en": "The district your hotel sits in is called Pazhou. Its old landmark is the Pazhou pagoda, begun in 1597 and finished in 1600. This was a sandbank in the river then, and ships coming up the Pearl River read the tower as the sign that Guangzhou was close.",
      "ar": "الحيّ الذي يقع فيه فندقكم اسمه بازو. ومَعلمه القديم هو باغودا بازو، التي بُدئ بناؤها عام 1597 واكتملت عام 1600. كان المكان حينها جزيرة رملية في النهر، وكانت السفن الصاعدة في نهر اللؤلؤ تقرأ البرج علامةً على اقتراب قوانغتشو."
    },
    {
      "zh": "今天塔的四周长满了树，外面是展馆、写字楼和住宅。这片江岸做的还是同一件事：广交会开展时买家从各国飞来，沿江的写字楼里坐着做电商和数字生意的公司。",
      "en": "Today the tower stands among trees, with exhibition halls, offices and flats around it. The riverbank still does the same work: when the Canton Fair opens, buyers fly in from everywhere, and the towers along the water hold e-commerce and digital companies.",
      "ar": "واليوم يقف البرج وسط الأشجار، وحوله قاعات المعارض والمكاتب والمساكن. وما زالت هذه الضفة تؤدي العمل نفسه: حين يُفتتح معرض كانتون يأتي المشترون جوًّا من كل مكان، وتضمّ الأبراج على الماء شركات تجارة إلكترونية وأعمال رقمية."
    },
    {
      "zh": "傍晚从酒店往江边走一段，风从水面上来，对岸的楼一盏一盏亮起来。想看那座塔，在地图里搜「琶洲塔」。",
      "en": "In the early evening, walk down to the river from the hotel: the air comes off the water and the far bank lights up tower by tower. To find the pagoda, search 琶洲塔 in your map app.",
      "ar": "أول المساء هو أفضل وقت للمشي هنا: انزلوا من الفندق إلى النهر، يأتيكم الهواء من فوق الماء، وتُضاء الضفة المقابلة برجًا بعد برج. وللعثور على الباغودا ابحثوا عن 琶洲塔 في تطبيق الخرائط."
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
    "zh": "一壶茶先上桌，蒸笼一笼一笼跟着来。",
    "en": "The pot of tea comes first; the steamer baskets follow, one at a time.",
    "ar": "يأتي إبريق الشاي أولًا، ثم تتبعه سلال البخار واحدةً تلو الأخرى."
  },
  "paragraphs": [
    {
      "zh": "掀开蒸笼盖，热气先扑到脸上。虾饺的皮是半透明的，隔着能看见里面那只粉红的虾；旁边一桌人边聊边夹，一顿早茶从九点吃到十一点也很平常。点心是一笼一笼加的：先点两三样，吃完想吃什么再添，不用一次点满。",
      "en": "Lift the lid off a steamer and the heat reaches your face first. A prawn dumpling's skin is translucent enough to show the pink curl inside; at the next table people talk and pick at the same time, and a morning that runs from nine to eleven is nothing unusual. Baskets are added as you go: order two or three, finish them, then order whatever you feel like next rather than everything at once.",
      "ar": "ارفعوا غطاء السلة فيصل إليكم البخار أولًا. قشرة زلابية الروبيان شفّافة بما يكفي لتُظهر لونها الوردي في الداخل؛ وعلى الطاولة المجاورة يتحدث الناس ويأكلون في الوقت نفسه، وصباحٌ يمتدّ من التاسعة إلى الحادية عشرة أمر عادي. وتُضاف السلال تباعًا: اطلبوا اثنتين أو ثلاثًا، وحين تنتهون اطلبوا ما تشتهون، بدل أن تطلبوا كل شيء دفعة واحدة."
    },
    {
      "zh": "点菜可以按三路走：清蒸留鲜，一条鱼上桌，主味就是姜丝、葱丝和一勺豉油；烧味讲皮，烧鹅、乳鸽咬下去先是脆的；甜品讲滑，姜撞奶和双皮奶都凝成嫩滑的一碗。三样各点一个，一桌就齐了。再往下走一步，隔壁的顺德在 2014 年进了联合国教科文组织的美食之都名单。",
      "en": "Ordering splits neatly three ways. Steamed, for freshness: a whole fish whose main flavours are shredded ginger, spring onion and a spoon of soy. Roasted, for the skin: goose and squab that crack before they give. And the milk desserts, for texture — softly set, smooth under the spoon. One from each and the table is complete. If you want to go further, neighbouring Shunde joined UNESCO's list of cities of gastronomy in 2014.",
      "ar": "يتوزّع الطلب في ثلاثة اتجاهات. المطهوّ بالبخار للطزاجة: سمكة كاملة نكهتها الأساسية شرائح الزنجبيل والبصل الأخضر وملعقة صويا. والمشويّ من أجل الجلد: إوزّ وحمام يتكسّر جلدهما قبل أن يلين. وحلويات الحليب من أجل القوام — متماسكة طريّة، ناعمة تحت الملعقة. واحد من كل اتجاه وتكتمل المائدة. وإن أردتم التوسّع، فقد انضمّت شوندي المجاورة إلى قائمة اليونسكو لمدن فنون الطهي عام 2014."
    },
    {
      "zh": "下面按风味认识菜式；点单前请店员确认肉类来源、猪油和料酒，清真餐厅另见「礼拜与清真餐」。",
      "en": "What follows introduces the dishes by flavour. Before you order, ask the staff about the meat, about lard and about cooking wine; halal restaurants are listed under “Prayer and halal food”.",
      "ar": "ما يلي تعريف بالأطباق حسب النكهة. وقبل الطلب اسألوا العاملين عن مصدر اللحم وعن شحم الخنزير ونبيذ الطهي؛ أما المطاعم الحلال فمذكورة في «الصلاة والطعام الحلال»."
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
    "photoKey": "xianxian-gate",
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
