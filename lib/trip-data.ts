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
    id: "payment",
    audience: ["ahmed", "hassan"],
    title: { zh: "支付：出发前就把支付宝弄好", en: "Payment: set up Alipay before you fly", ar: "الدفع: جهّزوا أليباي قبل السفر" },
    lines: [
      {
        zh: "在开罗就装好支付宝，用护照实名，绑一张 Visa 或 Mastercard —— 境外手机号能收验证码就行。国际卡付款有手续费（约 3%），单笔约合一千美元、一年约一万美元的额度。",
        en: "Install Alipay in Cairo, verify with your passport, and bind a Visa or Mastercard — a foreign number that receives SMS is enough. International cards carry a fee of about 3 percent, with limits of roughly US$1,000 per payment and US$10,000 a year.",
        ar: "ثبّتوا أليباي في القاهرة، وتحقّقوا بجواز السفر، واربطوا بطاقة فيزا أو ماستركارد — يكفي رقم هاتف أجنبي يستقبل الرسائل. وللبطاقات الدولية رسوم نحو 3%، بحدود نحو ألف دولار للعملية وعشرة آلاف دولار سنويًا.",
      },
      {
        zh: "微信支付也绑一张，有的店只认其中一个。Chuck 的备用金到账后，先在便利店做一笔小额试付。",
        en: "Bind a card to WeChat Pay as well; some shops take only one of the two. Once Chuck's float has arrived, make one small test payment at a convenience store.",
        ar: "اربطوا بطاقة بـ«وي تشات باي» أيضًا؛ فبعض المتاجر لا تقبل إلا أحدهما. وبعد وصول المبلغ الاحتياطي من Chuck، نفّذوا دفعة تجريبية صغيرة في متجر صغير.",
      },
      {
        zh: "带少量现金。这里几乎没人用现金，小店找不开大额纸币。",
        en: "Carry a little cash. Almost nobody uses it here, and small shops cannot break large notes.",
        ar: "احملوا قليلًا من النقد. لا يكاد أحد يستخدمه هنا، والمتاجر الصغيرة لا تملك فكّة للأوراق الكبيرة.",
      },
    ],
  },
  {
    id: "taxi",
    audience: ["ahmed", "hassan"],
    title: { zh: "打车：滴滴有英文", en: "Taxis: DiDi works in English", ar: "سيارات الأجرة: ديدي يعمل بالإنجليزية" },
    lines: [
      {
        zh: "装滴滴，界面切成英文，境外手机号能注册，可以绑外卡；和司机的聊天会自动翻译。支付宝里也有打车入口。",
        en: "Install DiDi, switch it to English, register with your foreign number, bind a foreign card; chat with the driver is translated automatically. Alipay also has a ride-hailing entry inside it.",
        ar: "ثبّتوا ديدي، وحوّلوه إلى الإنجليزية، وسجّلوا برقمكم الأجنبي، واربطوا بطاقة أجنبية؛ والمحادثة مع السائق تُترجم تلقائيًا. وفي أليباي أيضًا مدخل لطلب السيارات.",
      },
      {
        zh: "出租车照样能拦。上车前把本页的中文地址卡举给司机看，下车扫码付。",
        en: "Street taxis can still be hailed. Before getting in, show the driver the Chinese address card from this page; pay by scanning when you get out.",
        ar: "لا يزال بإمكانكم إيقاف سيارات الأجرة في الشارع. قبل الركوب أظهروا للسائق بطاقة العنوان الصينية من هذه الصفحة، وادفعوا بالمسح عند النزول.",
      },
    ],
  },
  {
    id: "maps-vpn",
    audience: ["ahmed", "hassan"],
    title: { zh: "地图与上网", en: "Maps and getting online", ar: "الخرائط والاتصال بالإنترنت" },
    lines: [
      {
        zh: "Google 地图在中国用不了。装高德地图，有英文版；出发前把酒店和要去的地方先收藏好。",
        en: "Google Maps does not work in China. Install Amap, which has an English version, and save the hotel and your destinations before you fly.",
        ar: "خرائط غوغل لا تعمل في الصين. ثبّتوا «أماب» الذي له نسخة إنجليزية، واحفظوا الفندق ووجهاتكم قبل السفر.",
      },
      {
        zh: "WhatsApp、Google、Instagram 在中国都要 VPN，出发前装好并测试一次；不保证一定能用，所以重要联系人也加个微信。",
        en: "WhatsApp, Google and Instagram all need a VPN in China; install and test one before departure. It is not guaranteed to work, so add your key contacts on WeChat as well.",
        ar: "واتساب وغوغل وإنستغرام تحتاج كلها إلى VPN في الصين؛ ثبّتوا واحدًا واختبروه قبل السفر. ولا ضمان لعمله، فأضيفوا جهات اتصالكم المهمة على «وي تشات» أيضًا.",
      },
      {
        zh: "Chuck 给 Mohamed 一张中国 SIM 卡，返程后归还；只有一张，Mohamed 开热点给 Ahmed，落地一起测一次。",
        en: "Chuck gives Mohamed one Chinese SIM, to be returned after the trip; with a single card, Mohamed shares a hotspot with Ahmed — test it together on landing.",
        ar: "يعطي Chuck لـ Mohamed شريحة صينية واحدة تُعاد بعد الرحلة؛ وبشريحة واحدة يشارك Mohamed نقطة اتصال مع Ahmed — اختبروها معًا عند الهبوط.",
      },
    ],
  },
  {
    id: "plug-passport",
    audience: ["ahmed", "hassan"],
    title: { zh: "插头与护照", en: "Plugs and passport", ar: "القوابس وجواز السفر" },
    lines: [
      {
        zh: "中国是 220 伏，插座是 A、C、I 三种型。高档酒店多有万能插座，带一个转换头保险。",
        en: "China runs on 220 volts with type A, C and I sockets. Good hotels mostly have universal outlets, but carry an adapter to be safe.",
        ar: "الصين على 220 فولت بمقابس من الأنواع A وC وI. ومعظم الفنادق الجيدة فيها مقابس عالمية، لكن احملوا محوّلًا احتياطًا.",
      },
      {
        zh: "酒店入住必须用护照原件登记，这是法律规定。护照随身带，景点和火车站有时也查。",
        en: "Hotels must register you with your original passport; that is the law. Keep it on you — attractions and railway stations sometimes ask for it too.",
        ar: "يجب أن تسجّلكم الفنادق بأصل جواز السفر؛ هذا هو القانون. احتفظوا به معكم — فالمعالم ومحطات القطار تطلبه أحيانًا أيضًا.",
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
/* 商圈考察                                                              */
/*                                                                     */
/* Reham 做招商、Ahmed 管区域。他们公费来，回去要向老板汇报学到了什么。      */
/* 这一节按「一个做零售的人站在天河路上该看懂什么」写：整体骨架、        */
/* 六家商场各自的位置、北京路作对照、最后四点能直接写进报告。            */
/* 数字出自天河区政府、广州市政府与新华网。                              */
/* ------------------------------------------------------------------ */

export type MallCard = {
  id: string;
  imageKey?: string;
  name: L10n;
  /** 一句话定位。 */
  tier: L10n;
  /** 事实：开业、体量、锚点业态、成绩。 */
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
  lead: {
    zh: "一条 2.8 公里的路，十四家商场，一年做出一万亿元的生意 —— 给做商场的人看的一节。",
    en: "A road 2.8 kilometres long, fourteen malls, a trillion yuan of business a year — a section for people who run malls.",
    ar: "طريق طوله 2.8 كيلومتر، أربعة عشر مركزًا تجاريًا، تريليون يوان من الأعمال سنويًا — قسمٌ لمن يديرون المراكز التجارية.",
  },
  intro: [
    {
      zh: "天河路商圈西起天河立交、东到岗顶，2.8 公里、4.5 平方公里，商业面积二百四十万平方米，十四家大型综合体。日客流一百五十万、年八亿人次、年销售额过万亿元，全省第一；2024 年全国商圈商业力榜单第三，高端商业载体数量全国第一。业态里零售占 57%、餐饮 24%、商务配套 9%、休闲旅游 8%、文化艺术 2%。",
      en: "The Tianhe Road district runs 2.8 kilometres from the Tianhe interchange to Gangding — 4.5 square kilometres, 2.4 million square metres of retail, fourteen large complexes. A million and a half visitors a day, eight hundred million a year, annual sales above a trillion yuan, first in the province; third in the 2024 national ranking of shopping districts and first for the number of high-end retail properties. The mix is 57 percent retail, 24 percent dining, 9 percent business services, 8 percent leisure and tourism, 2 percent culture and arts.",
      ar: "تمتدّ منطقة شارع تيانخه 2.8 كيلومتر من تقاطع تيانخه إلى قانغدينغ — 4.5 كيلومتر مربع، و2.4 مليون متر مربع من التجزئة، وأربعة عشر مجمّعًا كبيرًا. مليون ونصف زائر يوميًا، وثمانمئة مليون سنويًا، ومبيعات سنوية تتجاوز تريليون يوان، الأولى في المقاطعة؛ والثالثة في التصنيف الوطني لمناطق التسوّق لعام 2024، والأولى في عدد العقارات التجارية الفاخرة. والمزيج: 57% تجزئة، 24% مطاعم، 9% خدمات أعمال، 8% ترفيه وسياحة، 2% ثقافة وفنون.",
    },
    {
      zh: "它的骨架是地铁：1 号线和 3 号线在体育西路站交汇，体育中心站在另一头，各家商场的地下层用通道连成一片，人从地铁出来不上地面就能走完整条路。同一条路上从奢侈品到大众消费分成明确的层次，互不重叠 —— 这是它能容下十四家综合体而不打架的原因。",
      en: "Its skeleton is the metro: Lines 1 and 3 cross at Tiyu Xilu, Tiyu Zhongxin sits at the other end, and the basement levels of the malls are joined by walkways so a person can walk the whole road from the metro without surfacing. Along that one road the positioning steps clearly from luxury down to mass market with little overlap — which is why fourteen complexes can share it without cannibalising one another.",
      ar: "هيكلها هو المترو: يتقاطع الخطان 1 و3 في محطة تييو شيلو، وتقع محطة تييو تشونغشين في الطرف الآخر، وطوابق القبو في المراكز متصلة بممرات بحيث يمكن للمرء أن يقطع الطريق كله من المترو دون أن يصعد إلى السطح. وعلى هذا الطريق الواحد يتدرّج التموضع بوضوح من الفخامة إلى السوق الجماهيرية دون تداخل يُذكر — ولهذا يمكن لأربعة عشر مجمّعًا أن تتقاسمه دون أن يأكل بعضها بعضًا.",
    },
  ],
  malls: [
    {
      id: "taikoo",
      imageKey: "taikoo",
      name: { zh: "太古汇", en: "Taikoo Hui", ar: "تايكو هوي" },
      tier: { zh: "顶端：奢侈品与生活方式", en: "The top: luxury and lifestyle", ar: "القمة: الفخامة وأسلوب الحياة" },
      facts: {
        zh: "2011 年开业，香港太古地产。三十多个奢侈品牌 —— 爱马仕、路易威登、香奈儿、迪奥、普拉达 —— 高档品牌占比 46.8%，商圈最高；楼上是文华东方酒店，里面有方所书店。2021 年销售额一百亿元，全国购物中心第十一。",
        en: "Opened 2011 by Hong Kong's Swire Properties. More than thirty luxury houses — Hermès, Louis Vuitton, Chanel, Dior, Prada — with high-end brands at 46.8 percent of the mix, the highest in the district; the Mandarin Oriental above, the Fangsuo bookshop inside. Sales of ten billion yuan in 2021, eleventh among all malls in China.",
        ar: "افتُتح عام 2011 من شركة سواير العقارية في هونغ كونغ. أكثر من ثلاثين دارًا فاخرة — هيرميس ولوي فيتون وشانيل وديور وبرادا — وتبلغ نسبة العلامات الفاخرة 46.8% من المزيج، وهي الأعلى في المنطقة؛ فندق ماندارين أورينتال فوقه، ومكتبة فانغسوو داخله. مبيعات بعشرة مليارات يوان عام 2021، الحادي عشر بين جميع المراكز في الصين.",
      },
    },
    {
      id: "parc-central",
      name: { zh: "天环 Parc Central", en: "Parc Central", ar: "بارك سنترال" },
      tier: { zh: "中高端：开放式、低密度、体验型", en: "Upper-mid: open-air, low-density, experiential", ar: "فوق المتوسط: مفتوح، منخفض الكثافة، تجريبي" },
      facts: {
        zh: "2016 年开业，十一万平方米，地上只有两层、地下三层，正佳和天河城之间的一片开放式广场。苹果直营店、特斯拉体验中心在这里。它证明了一件事：在最贵的地段上，留白本身就是定位。",
        en: "Opened 2016, 110,000 square metres, only two floors above ground and three below — an open plaza between Grandview and Teemall. The Apple store and the Tesla centre are here. It proves one thing: on the most expensive ground in the city, open space is itself a positioning.",
        ar: "افتُتح عام 2016، بمساحة 110 آلاف متر مربع، طابقان فقط فوق الأرض وثلاثة تحتها — ساحة مفتوحة بين غراندفيو وتيمول. متجر آبل ومركز تسلا هنا. ويثبت أمرًا واحدًا: على أغلى أرض في المدينة، الفضاء المفتوح نفسه تموضعٌ.",
      },
    },
    {
      id: "grandview",
      name: { zh: "正佳广场", en: "Grandview Mall", ar: "غراندفيو مول" },
      tier: { zh: "家庭与游客：用娱乐拉客流的目的地型", en: "Families and visitors: a destination that pulls traffic with entertainment", ar: "العائلات والزوّار: وجهة تجذب الزحام بالترفيه" },
      facts: {
        zh: "2005 年开业，四十二万平方米，地上七层地下两层半。里面有一座室内空中极地海洋馆和一座自然科学博物馆 —— 外地游客和带孩子的家庭为这两样来，顺便把整栋楼逛完。国货美妆在这里卖得特别好。销售额七十五亿元，全国购物中心第十三。",
        en: "Opened 2005, 420,000 square metres, seven floors up and two and a half down. Inside are an indoor aerial polar aquarium and a natural science museum — visitors from other cities and families with children come for those and end up walking the whole building; domestic beauty brands sell especially well here. Sales of 7.5 billion yuan, thirteenth in the country.",
        ar: "افتُتح عام 2005، بمساحة 420 ألف متر مربع، سبعة طوابق فوق الأرض واثنان ونصف تحتها. في داخله حوض قطبي داخلي معلّق ومتحف للعلوم الطبيعية — يأتي زوّار المدن الأخرى والعائلات ذوات الأطفال لأجلهما فينتهون بجولة في المبنى كله؛ وتُباع علامات التجميل المحلية هنا جيدًا. مبيعات بـ7.5 مليارات يوان، الثالث عشر في البلاد.",
      },
    },
    {
      id: "teemall",
      name: { zh: "天河城", en: "Teemall", ar: "تيمول" },
      tier: { zh: "大众中端：流量之王", en: "Mass mid-market: the traffic king", ar: "السوق المتوسطة الجماهيرية: ملك الزحام" },
      facts: {
        zh: "1996 年开业，十六万平方米，中国第一个真正意义上的购物中心，业内叫它「中国第一 MALL」。就在体育西路站正上方，地铁一出来就是它。定位中端，客流常年商圈第一，销售额常年全国购物中心前十 —— 三十年了还在前十。",
        en: "Opened 1996, 160,000 square metres, the first true shopping centre in China — the trade calls it China's first mall. It sits directly over Tiyu Xilu station; the metro exits into it. Mid-market positioning, the highest footfall in the district year after year, and sales that have stayed in the national top ten for thirty years.",
        ar: "افتُتح عام 1996، بمساحة 160 ألف متر مربع، أول مركز تسوّق حقيقي في الصين — يسمّيه أهل المهنة «أول مول في الصين». يقع مباشرة فوق محطة تييو شيلو؛ ومخارج المترو تفضي إليه. تموضع متوسط، وأعلى إقبال في المنطقة عامًا بعد عام، ومبيعات بقيت ضمن العشرة الأوائل وطنيًا طوال ثلاثين عامًا.",
      },
    },
    {
      id: "onelink",
      name: { zh: "万菱汇", en: "Onelink Walk", ar: "وان لينك ووك" },
      tier: { zh: "年轻白领：早午餐与书店", en: "Young professionals: brunch and bookshops", ar: "الشباب المهنيون: الفطور المتأخر والمكتبات" },
      facts: {
        zh: "客群标签是时尚白领。业态上用早午餐、西西弗书店这类「待得住」的东西留人，而不是靠奢侈品。在太古汇隔壁做这个定位，是有意错开。",
        en: "Its crowd is the fashionable office worker. It keeps people with things to linger over — brunch, the Sisyphe bookshop — rather than with luxury goods. Doing that next door to Taikoo Hui is a deliberate sidestep.",
        ar: "جمهوره الموظف الأنيق. يُبقي الناس بأشياء يتمهّلون عندها — الفطور المتأخر، ومكتبة سيزيف — لا بالسلع الفاخرة. وفعل ذلك إلى جوار تايكو هوي انحرافٌ مقصود.",
      },
    },
    {
      id: "fashion-tianhe",
      name: { zh: "时尚天河", en: "Fashion Tianhe", ar: "فاشن تيانخه" },
      tier: { zh: "地下主题街区：平价与游客", en: "An underground themed street: budget and tourists", ar: "شارع تحت الأرض بطابع خاص: أسعار معقولة وسيّاح" },
      facts: {
        zh: "整个开在天河体育中心的地下，做主题街区，客群是外地游客和年轻人，价格带最低。它把体育中心地下这块没人用的空间变成了商圈的一部分。",
        en: "Built entirely beneath the Tianhe Sports Centre as themed streets, aimed at visitors and the young, with the lowest price band on the road. It turned an unused space under the stadium into part of the district.",
        ar: "بُني كليًّا تحت مركز تيانخه الرياضي على هيئة شوارع ذات طابع خاص، موجّهًا للزوّار والشباب، وبأدنى شريحة أسعار في الطريق. حوّل فراغًا غير مستخدم تحت الملعب إلى جزء من المنطقة.",
      },
    },
  ],
  caseStudy: [
    {
      zh: "这个案例在中国零售业里有代表性，是因为它不是一次规划出来的，而是二十年里一家一家「补位」补出来的。1996 年天河城开在地铁站上面，吃住了最大的人流，做中端；2005 年正佳在它旁边开，不比谁便宜，而是塞进一座海洋馆，把家庭和游客拉来；2011 年太古汇进场，直接跳到最顶端做奢侈品，和前两家没有一件货重叠；2016 年天环在正佳和天河城中间的空地上只盖了两层，用开放广场、苹果店和特斯拉做体验型 —— 业内说它在商圈里形成了两个「商业循环圈」的凝聚点。每一家进来，都挑前人没占的位置。",
      en: "The case matters in Chinese retail because it was not planned in one stroke; it was filled in, one mall at a time, over twenty years. In 1996 Teemall opened on top of the metro station, took the biggest flow and went mid-market. In 2005 Grandview opened next door and, rather than undercutting, put an aquarium inside and pulled in families and tourists. In 2011 Taikoo Hui jumped straight to the top with luxury, overlapping nothing the other two sold. In 2016 Parc Central built only two storeys on the gap between Grandview and Teemall and went experiential — an open plaza, Apple, Tesla — which the trade describes as the hinge that formed two circulation loops in the district. Each newcomer took the position nobody held.",
      ar: "لهذه الحالة أهمية في تجزئة الصين لأنها لم تُخطَّط دفعةً واحدة، بل مُلئت مركزًا بعد مركز على مدى عشرين عامًا. في 1996 افتُتح تيمول فوق محطة المترو فأخذ أكبر تدفق واتجه إلى السوق المتوسطة. في 2005 افتُتح غراندفيو بجواره، ولم يخفّض الأسعار بل وضع حوضًا مائيًا داخله فجذب العائلات والسيّاح. في 2011 قفز تايكو هوي مباشرة إلى القمة بالفخامة دون أن يتقاطع مع ما يبيعه الآخران. وفي 2016 بنى بارك سنترال طابقين فقط على الفراغ بين غراندفيو وتيمول واتجه إلى التجربة — ساحة مفتوحة، آبل، تسلا — وهو ما يصفه أهل المهنة بالمفصل الذي كوّن حلقتي تدفّق في المنطقة. كل وافد جديد أخذ الموقع الذي لم يحتلّه أحد.",
    },
    {
      zh: "道理有两层。第一层是集聚：商场挨着开不是互相抢，而是把整条路变成一个目的地，人是冲着「一次能逛完」来的，客流总量被做大了，然后各家按定位分走自己那一份 —— 业内把这叫「竞合」，共享客流、错位业态。第二层是运营：太古汇零售占比 78.5%、以奢侈品打标签，其他几家分别在服饰、美妆、餐饮上各有一项强项，谁也不做全能。商圈还有一个「政府 + 商会 + 企业」共同治理的机制，被国家列为流通体制改革推广案例 —— 十四家综合体能协调节庆、动线和活动，靠的是这个。",
      en: "There are two layers of reasoning. The first is agglomeration: malls opening side by side do not rob each other, they turn the whole road into a destination; people come because they can cover everything in one trip, the total flow grows, and each mall takes its share by positioning — the trade calls it co-opetition, shared traffic and staggered formats. The second is operating discipline: Taikoo Hui runs 78.5 percent retail and is branded on luxury, while each of the others is strong in exactly one of apparel, beauty or dining — nobody tries to be everything. The district also has a government–chamber–enterprise governance mechanism, cited nationally as a model for retail reform; that is how fourteen complexes coordinate festivals, circulation and events.",
      ar: "للأمر طبقتان من المنطق. الأولى التجمّع: المراكز المتجاورة لا تسرق بعضها بل تحوّل الطريق كله إلى وجهة؛ يأتي الناس لأنهم يستطيعون إنجاز كل شيء في رحلة واحدة، فيكبر التدفق الكلي، ويأخذ كل مركز حصته بالتموضع — ويسمّيه أهل المهنة «التنافس التعاوني»: تدفق مشترك وأنماط متدرّجة. والثانية انضباط التشغيل: يعمل تايكو هوي بنسبة 78.5% تجزئة وعلامته الفخامة، بينما يتفوّق كل من الآخرين في واحد فقط من الملابس أو التجميل أو المطاعم — ولا يحاول أحد أن يكون كل شيء. وللمنطقة أيضًا آلية حوكمة «حكومة – غرفة تجارية – شركات» أُدرجت وطنيًا نموذجًا لإصلاح التجزئة؛ وهكذا تنسّق أربعة عشر مجمّعًا المهرجانات والتدفق والفعاليات.",
    },
  ],
  comparables: [
    {
      name: { zh: "成都春熙路：太古里对 IFS", en: "Chengdu, Chunxi Road: Taikoo Li versus IFS", ar: "تشنغدو، شارع تشونشي: تايكو لي مقابل IFS" },
      body: {
        zh: "隔一条街的两家，一个是封闭的盒子（IFS，三百多个国际大牌，复制香港中环的做法），一个是开放的街区（远洋太古里，两三层的独栋、青瓦坡顶，把千年古刹大慈寺留在中间）。同一批客人两边走，谁也没被谁吃掉 —— 「开放对封闭」是错位的另一种做法，和天河路「高对低」不同。",
        en: "Two projects a street apart: one an enclosed box (IFS, three hundred international brands, the Hong Kong Central formula), the other an open-air quarter (Sino-Ocean Taikoo Li, two- and three-storey pavilions with grey-tiled roofs, built around the thousand-year Daci temple kept at its centre). The same visitors walk both; neither has swallowed the other. Open-versus-enclosed is another way to stagger, different from Tianhe Road's high-versus-low.",
        ar: "مشروعان يفصل بينهما شارع: أحدهما صندوق مغلق (IFS، ثلاثمئة علامة دولية، معادلة سنترال هونغ كونغ)، والآخر حيّ مفتوح (سينو-أوشن تايكو لي، أجنحة من طابقين وثلاثة بأسطح قرميدية رمادية، بُني حول معبد داتسي ذي الألف عام المحفوظ في وسطه). يمشي الزوّار أنفسهم في كليهما؛ ولم يبتلع أحدهما الآخر. «المفتوح مقابل المغلق» طريقة أخرى للتدرّج، تختلف عن «العالي مقابل المنخفض» في شارع تيانخه.",
      },
    },
    {
      name: { zh: "同一个开发商，两座城", en: "One developer, two cities", ar: "مطوّر واحد ومدينتان" },
      body: {
        zh: "太古汇（广州）和太古里（成都）是同一家香港太古地产做的：在广州它选择进最密的商圈做最顶端；在成都它选择做开放街区。看它在不同城市怎么选位置，比看单个项目更有用。",
        en: "Taikoo Hui in Guangzhou and Taikoo Li in Chengdu are the same Hong Kong developer, Swire Properties: in Guangzhou it chose to enter the densest district at the very top; in Chengdu it chose the open quarter. Watching how one developer picks its position city by city is more instructive than any single project.",
        ar: "تايكو هوي في قوانغتشو وتايكو لي في تشنغدو من مطوّر هونغ كونغي واحد هو سواير العقارية: في قوانغتشو اختار دخول أكثف منطقة من القمة؛ وفي تشنغدو اختار الحيّ المفتوح. ومراقبة كيف يختار مطوّر واحد موقعه مدينةً بعد مدينة أفيد من أي مشروع بمفرده.",
      },
    },
  ],
  beijinglu: {
    zh: "作对照的是老城的北京路：两千二百年没挪过的城市中轴，主街一公里、步行区四点七公里，一千六百多个品牌里有五十二家老字号，街中间玻璃罩着唐代到民国的十一层路面。天河路靠地铁和综合体，北京路靠历史和步行街 —— 两种完全不同的商圈逻辑，相距四公里。",
    en: "The counterpoint is Beijing Road in the old city: a city axis unmoved for twenty-two centuries, a one-kilometre main street and 4.7 kilometres of pedestrian zone, fifty-two long-established shops among sixteen hundred brands, and eleven layers of road from the Tang dynasty to the Republic under glass in the middle of the street. Tianhe Road runs on the metro and the mega-complex; Beijing Road runs on history and the pedestrian street — two entirely different logics, four kilometres apart.",
    ar: "والنقيض هو شارع بكين في المدينة القديمة: محور مدينة لم يتحرّك اثنين وعشرين قرنًا، شارع رئيسي بطول كيلومتر ومنطقة مشاة 4.7 كيلومترات، واثنان وخمسون متجرًا عريقًا بين ألف وستمئة علامة، وإحدى عشرة طبقة من الطريق من عهد تانغ إلى الجمهورية تحت الزجاج في وسط الشارع. يقوم شارع تيانخه على المترو والمجمّعات الضخمة؛ ويقوم شارع بكين على التاريخ وشارع المشاة — منطقان مختلفان تمامًا، تفصل بينهما أربعة كيلومترات.",
  },
  takeaways: [
    {
      zh: "招商先定位：同一条路上从太古汇到时尚天河，每家先定自己的价格带和客群，再按这个去招商，所以十四家综合体能共存而不互相抢租户。",
      en: "Positioning before leasing: from Taikoo Hui down to Fashion Tianhe, each mall on the same road fixes its price band and crowd first and leases to that, which is how fourteen complexes coexist without fighting over tenants.",
      ar: "التموضع قبل التأجير: من تايكو هوي إلى فاشن تيانخه، يحدّد كل مركز في الطريق نفسه شريحة أسعاره وجمهوره أولًا ثم يؤجّر على هذا الأساس، وهكذا تتعايش أربعة عشر مجمّعًا دون تنازع على المستأجرين.",
    },
    {
      zh: "地铁是骨架，地下通道是血管：客流从体育西路站涌出来，在地下就被分配到各家商场。",
      en: "The metro is the skeleton and the underground walkways the veins: footfall pours out of Tiyu Xilu station and is distributed among the malls before it reaches the surface.",
      ar: "المترو هو الهيكل والممرات تحت الأرض هي الأوردة: يتدفّق الزحام من محطة تييو شيلو ويتوزّع على المراكز قبل أن يبلغ السطح.",
    },
    {
      zh: "用体验拉客流：海洋馆、博物馆、苹果店、书店、早午餐 —— 每家都有一样让人专门来、来了就待很久的东西，零售是顺带的。",
      en: "Experience pulls the traffic: an aquarium, a museum, an Apple store, a bookshop, brunch — each mall has one thing people come for specifically and stay long for, and the retail rides on it.",
      ar: "التجربة تجذب الزحام: حوض مائي، متحف، متجر آبل، مكتبة، فطور متأخر — لكل مركز شيء واحد يأتي الناس لأجله تحديدًا ويطيلون المكوث عنده، والتجزئة تركب عليه.",
    },
    {
      zh: "留白也是定位：天环在最贵的地段只盖两层，用开放广场和低密度做出了自己的位置。",
      en: "Open space is a positioning too: Parc Central built only two storeys on the most expensive ground and made its place with a plaza and low density.",
      ar: "الفضاء المفتوح تموضعٌ أيضًا: بنى بارك سنترال طابقين فقط على أغلى أرض وصنع مكانه بساحة وكثافة منخفضة.",
    },
  ],
  sources: [
    {
      label: { zh: "天河区政府：天河路商圈", en: "Tianhe District government: the Tianhe Road district", ar: "حكومة منطقة تيانخه: منطقة شارع تيانخه" },
      url: "http://www.thnet.gov.cn/zjth/tzth/zlpt/content/post_9126462.html",
    },
    {
      label: { zh: "天河区政府：「中国第一 MALL」天河城迎变", en: "Tianhe District government: Teemall, China's first mall", ar: "حكومة منطقة تيانخه: تيمول، أول مول في الصين" },
      url: "http://www.thnet.gov.cn/zjth/tzth/tzdt/tzthtw/content/post_10210007.html",
    },
    {
      label: { zh: "广州市政府：正佳广场", en: "Guangzhou government: Grandview Mall", ar: "حكومة قوانغتشو: غراندفيو مول" },
      url: "https://www.gz.gov.cn/zfjgzy/gzswhgdlyj/ggfw/lytj/content/post_2991523.html",
    },
    {
      label: { zh: "新华网瞭望：广州天河区商圈「流量密码」", en: "Xinhua Outlook: the Tianhe district's traffic formula", ar: "شينخوا أوتلوك: معادلة الزحام في منطقة تيانخه" },
      url: "http://lw.news.cn/2024-03/11/c_1310767201.htm",
    },
    {
      label: { zh: "越秀区政府：北京路千年古道遗址", en: "Yuexiu District government: the Beijing Road ancient-road site", ar: "حكومة منطقة يوى شيو: موقع الطريق القديم في شارع بكين" },
      url: "http://www.beijinglu.yuexiu.gov.cn/bjl/pc_bjl/lydl_bjl/jd_bjl/qnsy_bjl/20181116/detail-208456.shtml",
    },
    {
      label: { zh: "赢商网：7 强争霸的天河路商圈，为啥个个都是赢家", en: "Winshang: seven rivals on Tianhe Road, why every one wins", ar: "وينشانغ: سبعة منافسين في شارع تيانخه، ولماذا يفوز الجميع" },
      url: "http://m.winshang.com/news682927.html",
    },
    {
      label: { zh: "腾讯新闻：天河路商圈二十多年如何步步升级", en: "Tencent News: how Tianhe Road upgraded step by step over twenty years", ar: "أخبار تينسنت: كيف ارتقى شارع تيانخه خطوةً خطوة على مدى عشرين عامًا" },
      url: "https://news.qq.com/rain/a/20230505A068NW00",
    },
  ],
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
    imageKey: "cbd",
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
    imageKey: "river",
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
    imageKey: "tianhe",
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
      zh: "做商场的人来广州，这里是最该花半天的地方：华南第一商圈，十四家综合体挤在一条路上。",
      en: "For anyone who runs a mall, this is the half day to spend in Guangzhou: the number-one shopping district in South China, fourteen complexes on one road.",
      ar: "لمن يدير مركزًا تجاريًا، هذا هو نصف اليوم الذي يستحق الإنفاق في قوانغتشو: منطقة التسوّق الأولى في جنوب الصين، أربعة عشر مجمّعًا على طريق واحد.",
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
    id: "morning-tea",
    imageKey: "dimsum",
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
    imageKey: "changfen",
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
    imageKey: "congee",
    title: { zh: "艇仔粥", en: "Sampan congee", ar: "عصيدة القوارب" },
    body: {
      zh: "从前珠江上住着一整群以船为家的人。他们撑着小艇在江面上卖粥，煮好了从船舷递到岸上或者另一条船上，所以叫艇仔粥。现在都在岸上的店里吃了，名字留了下来。",
      en: "The Pearl River once held a whole population who lived on their boats. They cooked congee on the water and passed the bowls up from sampan to shore — hence sampan congee. It is eaten in shops on dry land now, but the name stayed.",
      ar: "كان في نهر اللؤلؤ يومًا جماعةٌ كاملة تسكن قواربها. كانوا يطبخون العصيدة على الماء ويمدّون الأوعية من القارب إلى الضفة — ومن هنا جاء اسمها «عصيدة القوارب». تُؤكل اليوم في محال على البرّ، لكن الاسم بقي.",
    },
  },
  {
    id: "dessert",
    imageKey: "ginger",
    title: { zh: "甜品", en: "Desserts", ar: "الحلويات" },
    body: {
      zh: "姜撞奶值得专门去试一次：滚烫的牛奶冲进一碗姜汁，不搅不动，几分钟后整碗自己凝住，用勺子舀是一块一块的。还有双皮奶、绿豆沙、马蹄糕。广州人把这些统称「糖水」，多半是晚饭以后才去吃的事。",
      en: "Ginger milk curd is worth a trip on its own: scalding milk is poured onto a bowl of ginger juice, left alone, and a few minutes later the whole bowl has set firm enough to lift with a spoon. There is also double-skin milk, mung bean soup and water chestnut cake. Cantonese call all of it tong sui, sugar water, and it is mostly an after-dinner errand.",
      ar: "حليب الزنجبيل المخثّر وحده يستحق رحلة: يُصبّ الحليب المغلي على وعاء من عصير الزنجبيل ويُترك دون تحريك، فإذا به بعد دقائق قد تماسك حتى تستطيع رفعه بالملعقة. وهناك أيضًا حليب الطبقتين وحساء الفاصولياء الخضراء وكعكة كستناء الماء. ويسمّي أهل كانتون ذلك كله «تونغ سوي»، أي ماء السكر، وهو غالبًا مشوارُ ما بعد العشاء.",
    },
    url: "https://www.gz.gov.cn/zlgz/gzly/msgz/dxxc/content/post_7801857.html",
  },
  {
    id: "roast-goose",
    imageKey: "goose",
    title: { zh: "烧鹅", en: "Roast goose", ar: "الإوز المشوي" },
    body: {
      zh: "广州最出名的一道烧味。正宗的做法来自黄埔长洲岛的深井村：地上挖一口干井，井底埋缸，缸里烧荔枝木炭，鹅用钩子吊在井口的铁枝上，靠井壁的热力烤熟。出来是金红的皮，一咬脆得有声，底下的肉却是嫩的，肥而不腻。斩件上桌，蘸酸梅酱。",
      en: "Guangzhou's most famous roast. The authentic method comes from Shenjing village on Changzhou Island in Huangpu: a dry well is dug, a clay jar set in its floor, lychee-wood charcoal burned inside, and the geese hung from iron bars across the mouth so the heat of the well walls roasts them. What comes out is skin the colour of amber that cracks audibly when bitten, over meat that is still tender — rich without being heavy. Chopped and served with plum sauce.",
      ar: "أشهر مشويّات قوانغتشو. الطريقة الأصيلة من قرية شنجينغ في جزيرة تشانغتشو بهوانغبو: تُحفر بئر جافة، ويُثبَّت جرّة فخارية في قاعها، ويُحرق فيها فحم خشب الليتشي، وتُعلَّق الإوزّات من قضبان حديدية على فوهتها فتنضج بحرارة جدران البئر. والنتيجة جلد بلون الكهرمان يتكسّر بصوت مسموع عند العضّ، فوق لحم لا يزال طريًّا — غنيٌّ دون ثقل. يُقطَّع ويُقدَّم مع صلصة البرقوق.",
    },
    url: "https://lvyou.ycwb.com/2019-04/19/content_30243026.htm",
  },
  {
    id: "squab",
    imageKey: "pigeon",
    title: { zh: "红烧乳鸽", en: "Roast squab", ar: "الحمام الصغير المشوي" },
    body: {
      zh: "广东人说「一鸽胜九鸡」。最有名的是中山石岐乳鸽 —— 一百多年前华侨从海外带回良种和本地鸽杂交出来的品种，先卤后炸，皮脆得像纸，肉嫩到骨头都是香的。从广州开车一小时就是中山，但广州的粤菜馆几乎都有这道菜，一人一只，用手拿着吃。",
      en: "The Cantonese say one squab beats nine chickens. The most celebrated is the Shiqi squab of Zhongshan — a breed crossed a century ago from birds that returning overseas Chinese brought home — braised, then fried, so the skin turns paper-crisp over meat tender to the bone. Zhongshan is an hour's drive from Guangzhou, but nearly every Cantonese restaurant in the city serves it: one bird each, eaten with the hands.",
      ar: "يقول الكانتونيون إن حمامةً صغيرة تغلب تسع دجاجات. وأشهرها حمام شيتشي من تشونغشان — سلالة هُجّنت قبل قرن من طيور أعادها الصينيون المغتربون — يُطهى في المرق ثم يُقلى فيصبح الجلد رقيقًا كالورق فوق لحمٍ طريّ حتى العظم. تشونغشان على بعد ساعة بالسيارة من قوانغتشو، لكن كل مطعم كانتوني في المدينة تقريبًا يقدّمه: طائر لكل شخص، يُؤكل باليد.",
    },
    url: "https://www.zs.gov.cn/zjzs/lygg/mytc/content/post_2399451.html",
  },
  {
    id: "seafood",
    imageKey: "seafood",
    title: { zh: "海鲜：即捞即食", en: "Seafood, netted and cooked on the spot", ar: "المأكولات البحرية: تُصطاد وتُطهى فورًا" },
    body: {
      zh: "广州人吃海鲜的规矩是「生猛」—— 必须活的。黄沙水产市场从 1994 年开到今天，一年交易三十二万吨，是全国活鲜的价格风向标；很多人直接在市场里挑好活鱼活虾活蟹，拎到旁边的酒楼加工，二十分钟后上桌。一条鱼最经典的做法是清蒸：只放姜丝葱丝，蒸熟淋一勺滚油和豉油，鱼有多新鲜一口就知道。",
      en: "The Cantonese rule for seafood is that it must be alive. Huangsha market has traded since 1994 — 320,000 tonnes a year, the price benchmark for live seafood across China — and many people simply choose their fish, prawns and crab from the tanks and carry them to the restaurants next door, where they are on the table twenty minutes later. The classic treatment for a fish is steaming: ginger and spring onion only, then a spoon of smoking oil and soy over the top. One bite tells you how fresh it was.",
      ar: "قاعدة الكانتونيين في المأكولات البحرية أن تكون حيّة. يعمل سوق هوانغشا منذ 1994 — بحجم تداول 320 ألف طن سنويًا، وهو المرجع السعري للمأكولات البحرية الحيّة في الصين كلّها — ويختار كثيرون أسماكهم وروبيانهم وسرطاناتهم من الأحواض مباشرة ويحملونها إلى المطاعم المجاورة لتكون على المائدة بعد عشرين دقيقة. والطريقة الكلاسيكية للسمك هي التبخير: زنجبيل وبصل أخضر فقط، ثم ملعقة زيت مدخّن وصويا فوقه. ولقمة واحدة تخبرك بمدى طزاجته.",
    },
    url: "https://www.gz.gov.cn/ysgz/xwdt/ysdt/content/post_10421238.html",
  },
  {
    id: "soup",
    imageKey: "soup",
    title: { zh: "老火靓汤", en: "Slow-fired soup", ar: "الحساء البطيء" },
    body: {
      zh: "广东人家里的汤是煲出来的：一锅水，几样材料，小火两三个小时，直到汤色变浓、味道全出来。饭桌上第一件事是喝汤，不是吃饭。「饮咗汤未」—— 喝过汤了吗 —— 是广东人的问候语，跟问你吃了没一个意思。",
      en: "In a Cantonese home, soup is not made, it is fired: a pot of water, a few ingredients, two or three hours over a low flame until the broth turns deep and everything has given up its flavour. The first thing at the table is the soup, before the rice. “Have you had your soup?” is how Cantonese ask after you — it means the same as asking whether you have eaten.",
      ar: "في البيت الكانتوني لا يُعدّ الحساء بل يُوقد: قِدر ماء، وبضعة مكوّنات، وساعتان أو ثلاث على نارٍ هادئة حتى يغمق المرق وتبذل المكوّنات كل نكهتها. وأول ما يُقدَّم على المائدة الحساء، قبل الأرز. و«هل شربتَ حساءك؟» هي طريقة الكانتونيين في السؤال عن حالك — وتعني ما تعنيه «هل أكلت؟».",
    },
  },
  {
    id: "chaoshan-beef",
    imageKey: "beef",
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
    imageKey: "chicken",
    title: { zh: "白切鸡", en: "White-cut chicken", ar: "الدجاج المسلوق الكانتوني" },
    body: {
      zh: "整只鸡在将开未开的水里浸熟，捞出来过冷水，皮才会爽脆，肉才会嫩滑，骨头边上还带一点粉红才算到位。不放任何调味，斩件上桌，蘸姜葱蓉。这是广府菜的态度：鸡好，就该吃出鸡的味道。",
      en: "A whole chicken is poached in water held just below the boil, then plunged into cold water so the skin turns taut and the flesh stays silky — a blush of pink at the bone is the mark of it done right. No seasoning at all; it is chopped and served with a ginger-and-spring-onion relish. This is the Guangfu attitude in one dish: if the chicken is good, you should taste the chicken.",
      ar: "تُسلق دجاجة كاملة في ماءٍ يُبقى دون الغليان، ثم تُغمر في ماء بارد فيشتدّ الجلد ويبقى اللحم حريريًا — واحمرارٌ خفيف عند العظم علامة الإتقان. بلا أي توابل؛ تُقطّع وتُقدَّم مع صلصة الزنجبيل والبصل الأخضر. هذا هو مذهب قوانغفو في طبق واحد: إن كانت الدجاجة جيدة فينبغي أن تتذوّق الدجاجة.",
    },
  },
  {
    id: "wok-hei",
    imageKey: "chowfun",
    title: { zh: "干炒牛河与「镬气」", en: "Beef chow fun and ‘wok hei’", ar: "شعيرية اللحم المقلية و«نَفَس المقلاة»" },
    body: {
      zh: "宽河粉、牛肉、豆芽、韭黄，猛火快炒。广东人评一碟炒菜好不好，看的是「镬气」—— 铁锅烧到极烫、油和酱在锅边瞬间焦香、每一根粉都均匀上色而不断不糊。炉火不够猛的厨房炒不出来，这是粤菜厨师的看家本领，也是所有广式小炒的魂。",
      en: "Wide rice noodles, beef, bean sprouts and yellow chives, tossed fast over a ferocious flame. Cantonese judge any stir-fry by its wok hei, the “breath of the wok”: the pan heated until it almost glows, oil and sauce searing in an instant at the rim, every noodle evenly browned yet unbroken and unstuck. It cannot be faked on a weak stove — it is the Cantonese cook's signature skill and the soul of every quick-fried dish.",
      ar: "شعيرية أرز عريضة ولحم بقر وبراعم فول وثوم معمّر أصفر، تُقلّب بسرعة فوق لهب عنيف. ويحكم الكانتونيون على أي طبق مقلي بـ«ووك هي»، أي نَفَس المقلاة: تُحمى المقلاة حتى تكاد تتوهّج، فيلفح الزيت والصلصة حافتها في لحظة، وتتلوّن كل خيط شعيرية بالتساوي دون أن ينقطع أو يلتصق. لا يمكن تزييفه على موقد ضعيف — إنه توقيع الطاهي الكانتوني وروح كل طبق مقليّ سريع.",
    },
  },
  {
    id: "qilou",
    imageKey: "arcade",
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
      zh: "先说一个数：2025 年广州的 GDP 是 3.2 万亿元人民币，按当年约 7.2 的汇率折合四千四百多亿美元。世界银行给埃及 2024 年全国的数是 3890 亿美元。也就是说，你们落地的这一座城，一年做出的经济总量比整个埃及还多 —— 而它只有一千九百多万人。",
      en: "Start with one number. Guangzhou's GDP in 2025 was 3.2 trillion yuan — about 440 billion US dollars at that year's rate of roughly 7.2. The World Bank puts all of Egypt's GDP for 2024 at 389 billion dollars. The single city you are landing in produces more in a year than the whole of Egypt — with just over nineteen million people.",
      ar: "لنبدأ برقم واحد. بلغ الناتج المحلي الإجمالي لقوانغتشو عام 2025 نحو 3.2 تريليون يوان — أي ما يزيد على 440 مليار دولار بسعر صرف ذلك العام البالغ نحو 7.2. ويقدّر البنك الدولي ناتج مصر كلّها لعام 2024 بـ 389 مليار دولار. أي أن المدينة الواحدة التي تهبطون فيها تنتج في السنة أكثر من مصر بأكملها — بسكان لا يتجاوزون تسعة عشر مليونًا إلا قليلًا.",
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
      note: { zh: "一座城的人口，比很多国家都多", en: "One city with more people than many countries", ar: "مدينة واحدة يفوق سكانها سكان دول كثيرة" },
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
  lead: {
    zh: "有几样东西，在广州街上是日常，在世界上多数地方还是新闻。",
    en: "A few things that are everyday on Guangzhou's streets are still headlines almost everywhere else.",
    ar: "بضعة أشياء هي روتين يومي في شوارع قوانغتشو، لكنها لا تزال عناوين أخبار في معظم أنحاء العالم.",
  },
  intro: {
    zh: "下面这些不用专门去找，这几天走在路上、坐在车里、吃着饭就会碰到。碰到了别惊讶，那就是这座城的日常。",
    en: "None of this needs a special trip. Over these few days you will run into it on the road, in the car, at the table. When you do, don't be surprised — this is simply how the city runs.",
    ar: "لا يحتاج أيٌّ من هذا إلى رحلة خاصة. خلال هذه الأيام ستصادفونه في الطريق وفي السيارة وعلى المائدة. وحين يحدث فلا تندهشوا — فهكذا تعمل هذه المدينة ببساطة.",
  },
  items: [
    {
      id: "robotaxi",
      imageKey: "robotaxi",
      title: { zh: "没有司机的出租车", en: "Taxis with no driver", ar: "سيارات أجرة بلا سائق" },
      where: {
        zh: "白云机场、广州南站到市区地标之间有八条示范线，24 小时跑；市中心也能叫到。车顶一圈传感器、驾驶座空着，就是它。",
        en: "Eight demonstration routes link Baiyun Airport and Guangzhou South station with city landmarks, running around the clock; they can be hailed downtown too. Sensors around the roof, nobody in the driver's seat — that is one.",
        ar: "ثمانية خطوط تجريبية تربط مطار بايون ومحطة قوانغتشو الجنوبية بمعالم المدينة وتعمل على مدار الساعة؛ ويمكن طلبها وسط المدينة أيضًا. مستشعرات حول السقف ومقعد السائق فارغ — تلك هي.",
      },
      body: {
        zh: "做这件事的公司叫文远知行，总部就在广州。它在广州、北京和阿布扎比都跑的是「车里一个人都没有」的纯无人商业运营，2026 年 1 月全球车队过了一千辆。除了出租车，还有无人小巴和无人环卫车。",
        en: "The company is WeRide, headquartered in Guangzhou. In Guangzhou, Beijing and Abu Dhabi it runs fully driverless commercial service — no one in the car at all — and in January 2026 its global fleet passed a thousand vehicles. Beyond taxis there are driverless minibuses and street sweepers.",
        ar: "الشركة هي «وي رايد» ومقرّها في قوانغتشو. وتشغّل في قوانغتشو وبكين وأبوظبي خدمة تجارية بلا سائق إطلاقًا — لا أحد في السيارة — وفي يناير 2026 تجاوز أسطولها العالمي ألف مركبة. وإلى جانب سيارات الأجرة هناك حافلات صغيرة ومركبات تنظيف شوارع بلا سائق.",
      },
    },
    {
      id: "evtol",
      imageKey: "evtol",
      title: { zh: "载人的无人机", en: "A drone that carries people", ar: "طائرة مسيّرة تحمل الركاب" },
      where: {
        zh: "在黄埔的运营点可以买票坐一趟低空观光。想看得先约，不在日程里；但要知道，这东西是广州造的。",
        en: "At the operating site in Huangpu you can buy a ticket for a low-altitude sightseeing flight. It takes booking and is not on the itinerary — but know that this machine is made in Guangzhou.",
        ar: "في موقع التشغيل بهوانغبو يمكن شراء تذكرة لرحلة مشاهدة منخفضة الارتفاع. تحتاج إلى حجز وليست في البرنامج — لكن اعلموا أن هذه الآلة صُنعت في قوانغتشو.",
      },
      body: {
        zh: "亿航智能的 EH216-S，两个座位、十六个旋翼、没有飞行员。它拿到了全球第一张无人驾驶载人航空器的适航证、第一张生产许可证，2025 年又在广州黄埔拿到全球第一张运营合格证 —— 四证齐全，可以卖票载客。",
        en: "EHang's EH216-S: two seats, sixteen rotors, no pilot. It holds the world's first type certificate for a pilotless passenger aircraft, the first production certificate, and in 2025 received the first operator certificate in Guangzhou's Huangpu district — the full set, cleared to sell tickets and carry passengers.",
        ar: "طائرة EH216-S من «إي هانغ»: مقعدان وستة عشر دوّارًا وبلا طيار. تحمل أول شهادة صلاحية طيران في العالم لطائرة ركاب بلا طيار، وأول رخصة إنتاج، وحصلت عام 2025 في منطقة هوانغبو بقوانغتشو على أول شهادة تشغيل في العالم — المجموعة الكاملة، ومصرَّح لها ببيع التذاكر ونقل الركاب.",
      },
    },
    {
      id: "robots",
      imageKey: "robot",
      title: { zh: "送餐的机器人", en: "The robot that brings your food", ar: "الروبوت الذي يجلب طعامكم" },
      where: {
        zh: "很多餐厅里菜是机器人推到桌边的，不少酒店里外卖和毛巾是机器人送到房门口的，自己坐电梯上来。",
        en: "In many restaurants the dishes arrive at the table on a robot; in many hotels the takeaway or fresh towels come to your door on one, riding the lift by itself.",
        ar: "في مطاعم كثيرة تصل الأطباق إلى الطاولة على روبوت؛ وفي فنادق كثيرة يصل الطعام الجاهز أو المناشف إلى بابكم على روبوت يركب المصعد بنفسه.",
      },
      body: {
        zh: "这个行业的两家头部企业普渡和擎朗都是广东公司。普渡一家就占全球商用服务机器人 23% 的份额，累计出货超过十二万台。",
        en: "The two leaders of this industry, Pudu and Keenon, are both Guangdong companies. Pudu alone holds 23 percent of the world's commercial service-robot market, with more than 120,000 units shipped.",
        ar: "الشركتان الرائدتان في هذه الصناعة، «بودو» و«كينون»، كلتاهما من قوانغدونغ. وتستحوذ بودو وحدها على 23% من سوق روبوتات الخدمة التجارية في العالم، بأكثر من 120 ألف وحدة مشحونة.",
      },
    },
    {
      id: "drone-delivery",
      imageKey: "drone",
      title: { zh: "无人机送外卖", en: "Takeaway by drone", ar: "توصيل الطعام بالطائرات المسيّرة" },
      where: {
        zh: "在开通航线的商圈和公园，点一份外卖，几分钟后从天上落到取餐柜里。广州是开了航线的城市之一。",
        en: "In districts and parks with a route, you order a takeaway and a few minutes later it drops from the sky into a pick-up locker. Guangzhou is one of the cities with routes open.",
        ar: "في الأحياء والحدائق التي فيها خط، تطلبون وجبة جاهزة فتهبط بعد دقائق من السماء في خزانة استلام. وقوانغتشو من المدن التي فُتحت فيها الخطوط.",
      },
      body: {
        zh: "美团无人机到 2024 年底开了 53 条航线，累计送了四十五万单，2024 年一年就送了二十万单，翻了一倍。",
        en: "By the end of 2024 Meituan's drones flew 53 routes and had delivered 450,000 orders — 200,000 of them in 2024 alone, double the year before.",
        ar: "بحلول نهاية 2024 كانت طائرات «مي توان» المسيّرة تطير على 53 خطًا وقد سلّمت 450 ألف طلب — منها 200 ألف في عام 2024 وحده، أي ضعف العام السابق.",
      },
    },
    {
      id: "cashless",
      imageKey: "cashless",
      title: { zh: "一个城市不用现金", en: "A city that doesn't use cash", ar: "مدينة لا تستخدم النقد" },
      where: {
        zh: "从早茶店到菜市场到出租车，付钱就是扫一下码。这几天你们大概一张纸币都用不上。",
        en: "From the yum cha house to the wet market to the taxi, paying is one scan of a code. You will probably not touch a banknote all week.",
        ar: "من مطعم اليوم تشا إلى سوق الخضار إلى سيارة الأجرة، الدفع مسحُ رمزٍ واحد. غالبًا لن تلمسوا ورقة نقدية طوال الأسبوع.",
      },
      body: {
        zh: "中国的移动支付普及率 86%，全球第一。本页的出发前准备里写了怎么绑外卡。",
        en: "China's mobile-payment penetration is 86 percent, the highest in the world. The preparation section on this page explains how to link a foreign card.",
        ar: "نسبة انتشار الدفع بالهاتف في الصين 86%، الأعلى في العالم. ويشرح قسم الاستعداد في هذه الصفحة كيفية ربط بطاقة أجنبية.",
      },
    },
    {
      id: "ev-taxi",
      imageKey: "evtaxi",
      title: { zh: "安静的出租车", en: "The quiet taxi", ar: "سيارة الأجرة الهادئة" },
      where: {
        zh: "坐上去没有发动机声、没有尾气 —— 你们这几天叫到的车几乎全是电动的。",
        en: "No engine noise, no exhaust when you get in — almost every car you hail this week will be electric.",
        ar: "لا صوت محرّك ولا عادم حين تركبون — كل سيارة تطلبونها هذا الأسبوع تقريبًا كهربائية.",
      },
      body: {
        zh: "到 2025 年 6 月底，广州网约车电动化率 98%；珠三角新增的出租车和网约车全部是新能源车。广汽自己就是造电动车的大厂。",
        en: "By the end of June 2025, 98 percent of Guangzhou's ride-hailing cars were electric, and every new taxi or ride-hailing car in the Pearl River Delta must be a new-energy vehicle. GAC, the city's own carmaker, is a major EV maker.",
        ar: "بحلول نهاية يونيو 2025 كانت 98% من سيارات النقل التشاركي في قوانغتشو كهربائية، ويجب أن تكون كل سيارة أجرة أو نقل تشاركي جديدة في دلتا نهر اللؤلؤ مركبة طاقة جديدة. وشركة «جي إيه سي»، صانعة السيارات المحلية، من كبار صانعي السيارات الكهربائية.",
      },
    },
  ],
  sources: [
    { label: { zh: "财新：文远知行在广州市区开通 Robotaxi 服务，24 小时运营", en: "Caixin: WeRide opens 24-hour Robotaxi service in central Guangzhou", ar: "كايشين: وي رايد تفتح خدمة روبوتاكسي على مدار الساعة في قوانغتشو" }, url: "https://companies.caixin.com/2025-05-15/102320039.html" },
    { label: { zh: "新浪科技：文远知行 Robotaxi 车队突破千辆", en: "Sina Tech: WeRide's Robotaxi fleet passes 1,000", ar: "سينا تك: أسطول وي رايد يتجاوز ألف مركبة" }, url: "https://finance.sina.com.cn/tech/digi/2026-01-16/doc-inhhnzaw0673277.shtml" },
    { label: { zh: "广州市政府：全球首张载人 eVTOL 运营合格证落地广州黄埔", en: "Guangzhou government: the world's first passenger-eVTOL operator certificate, Huangpu", ar: "حكومة قوانغتشو: أول شهادة تشغيل لطائرة ركاب كهربائية في العالم، هوانغبو" }, url: "https://www.gz.gov.cn/ysgz/xwdt/ysdt/content/post_10193139.html" },
    { label: { zh: "亿航智能：EH216-S 获民航局标准适航证", en: "EHang: EH216-S receives its type certificate from the CAAC", ar: "إي هانغ: EH216-S تحصل على شهادة الصلاحية من هيئة الطيران" }, url: "https://www.ehang.com/news/1022.html" },
    { label: { zh: "前瞻：2025 年中国餐饮配送机器人行业全景", en: "Qianzhan: China's food-delivery robot industry, 2025", ar: "تشيانتشان: صناعة روبوتات توصيل الطعام في الصين 2025" }, url: "https://ecoapp.qianzhan.com/detials/250530-9cf3847c.html" },
    { label: { zh: "南方财经：美团无人机 2024 年配送超 20 万单", en: "SFC: Meituan drones delivered over 200,000 orders in 2024", ar: "إس إف سي: طائرات مي توان سلّمت أكثر من 200 ألف طلب في 2024" }, url: "https://www.sfccn.com/2025/1-24/4MMDE0NzNfMTk4NzI4Mw.html" },
    { label: { zh: "人民网广东：珠三角新增网约车须为新能源汽车", en: "People's Daily Guangdong: new ride-hailing cars in the Delta must be NEVs", ar: "صحيفة الشعب قوانغدونغ: سيارات النقل التشاركي الجديدة في الدلتا يجب أن تكون كهربائية" }, url: "http://gd.people.com.cn/n2/2024/1212/c123932-41073362.html" },
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
      zh: "展馆背后，是 2015 年起建的人工智能与数字经济试验区：腾讯、阿里巴巴、唯品会的总部大楼都在这里，三万六千多家企业，一年营收四千五百亿元以上。酒店周围那些新起的写字楼，就是它们。",
      en: "Behind the halls is the AI and digital-economy zone begun in 2015: the headquarters towers of Tencent, Alibaba and Vipshop stand here, among more than 36,000 companies with combined annual revenue above 450 billion yuan. The new office towers around the hotel are those.",
      ar: "وخلف القاعات تقع منطقة الذكاء الاصطناعي والاقتصاد الرقمي التي بدأ بناؤها عام 2015: أبراج المقار الرئيسية لتينسنت وعلي بابا وفيبشوب هنا، بين أكثر من 36 ألف شركة يتجاوز إيرادها السنوي مجتمعةً 450 مليار يوان. وأبراج المكاتب الجديدة حول الفندق هي تلك.",
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
