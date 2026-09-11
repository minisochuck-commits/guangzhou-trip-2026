// 界面文案（三语）与日期格式化。行程事实在 lib/trip-data.ts，
// 每天每人的四行在 lib/person-day-plan.ts。

import type { L10n, Lang, Status, TimeZoneTag } from "./trip-data";

export const LANGS: { id: Lang; label: string; dir: "ltr" | "rtl" }[] = [
  { id: "zh", label: "中文", dir: "ltr" },
  { id: "en", label: "English", dir: "ltr" },
  { id: "ar", label: "العربية", dir: "rtl" },
];

export const DEFAULT_LANG: Lang = "zh";

export function dirOf(lang: Lang): "ltr" | "rtl" {
  return lang === "ar" ? "rtl" : "ltr";
}

export function t(value: L10n, lang: Lang): string {
  return value[lang];
}

export const UI = {
  title: { zh: "广州行程", en: "Guangzhou Visit", ar: "زيارة قوانغتشو" },
  language: { zh: "语言", en: "Language", ar: "اللغة" },
  viewing: { zh: "查看", en: "Viewing", ar: "العرض" },
  everyone: { zh: "全部", en: "All", ar: "الكل" },

  // 表里放的是全部 18 天，不是「当天」，所以叫全部行程。
  tabs: {
    day: { zh: "全部行程", en: "Itinerary", ar: "برنامج الرحلة" },
    guide: { zh: "来华指南", en: "China guide", ar: "دليل الصين" },
  },

  /** 日期条是跳转，不是切换视图。 */
  jumpToDate: {
    zh: "跳到某一天",
    en: "Jump to a day",
    ar: "الانتقال إلى يوم",
  },
  close: { zh: "关闭", en: "Close", ar: "إغلاق" },

  /**
   * 四个字段。现在两两合进一列（活动+交通 / 餐+住），
   * 只有食宿格里那两个短标签还用得上；另外两个留着给弹窗与文档口径。
   */
  rows: {
    lodging: { zh: "住宿", en: "Stay", ar: "الإقامة" },
    activity: { zh: "活动", en: "Plan", ar: "البرنامج" },
    dining: { zh: "餐饮", en: "Meals", ar: "الوجبات" },
    transport: { zh: "交通", en: "Travel", ar: "التنقل" },
  },

  /** 全员视图首列的表头：日期与人员纵向排在同一格。 */
  matrixCorner: {
    zh: "日期 / 人员",
    en: "Date / person",
    ar: "التاريخ / الشخص",
  },

  /** 三列表头。单人视图首列只写日期（顶部已经显示在看谁）。 */
  cols: {
    date: { zh: "日期", en: "Date", ar: "التاريخ" },
    plan: { zh: "活动与交通", en: "Plan & travel", ar: "البرنامج والتنقل" },
    stay: { zh: "食宿", en: "Meals & stay", ar: "الوجبات والإقامة" },
  },
  status: {
    confirmed: { zh: "已定", en: "Set", ar: "مؤكد" },
    pending: { zh: "待定", en: "To confirm", ar: "بانتظار التأكيد" },
  } satisfies Record<Status, L10n>,

  tz: {
    cairo: { zh: "开罗时间", en: "Cairo time", ar: "بتوقيت القاهرة" },
    beijing: { zh: "北京时间", en: "Beijing time", ar: "بتوقيت بكين" },
  } satisfies Record<TimeZoneTag, L10n>,

  details: { zh: "详情", en: "Details", ar: "التفاصيل" },

  /**
   * 弹窗入口。按钮文字和弹窗标题都用这里 —— 不再一律叫「详情」，
   * 点开之前就知道会看到什么。
   */
  entries: {
    hotelAddress: { zh: "酒店地址", en: "Hotel address", ar: "عنوان الفندق" },
    stayNote: { zh: "住宿说明", en: "Stay details", ar: "تفاصيل الإقامة" },
    flights: { zh: "航班与行李", en: "Flights & baggage", ar: "الرحلات والأمتعة" },
    storeVisit: { zh: "巡店安排", en: "Store visit", ar: "برنامج زيارة المتاجر" },
    sessions: { zh: "会议安排", en: "Session details", ar: "تفاصيل الجلسات" },
    meals: { zh: "用餐说明", en: "Meal details", ar: "تفاصيل الوجبات" },
    routes: { zh: "游玩路线", en: "Route ideas", ar: "مسارات مقترحة" },
    transfer: { zh: "接送安排", en: "Transport details", ar: "تفاصيل التنقل" },
    notes: { zh: "当天说明", en: "Notes for the day", ar: "ملاحظات اليوم" },
  },

  /** 弹窗里那段完整原文的小标题。 */
  fullText: { zh: "完整说明", en: "Full wording", ar: "النص الكامل" },
  foodIdeas: { zh: "吃什么", en: "What to eat", ar: "ماذا تأكل" },
  viewingNow: { zh: "正在看", en: "Viewing", ar: "المعروض الآن" },
  flightDetails: {
    zh: "航班与行李",
    en: "Flights and baggage",
    ar: "الرحلات والأمتعة",
  },
  nextDay: { zh: "次日抵达", en: "arrives next day", ar: "الوصول اليوم التالي" },

  /** 完整旅程时间轴的步骤标签。 */
  journey: {
    report: { zh: "到机场", en: "At the airport", ar: "الوصول إلى المطار" },
    leg: { zh: "航段", en: "Flight", ar: "الرحلة" },
    transfer: { zh: "中转", en: "Transfer", ar: "الترانزيت" },
    arrive: { zh: "抵达", en: "Arrival", ar: "الوصول" },
    depart: { zh: "出发", en: "Departure", ar: "المغادرة" },
    /** 一条脚注顶掉每个时刻后面的时区标注。 */
    localTimeNote: {
      zh: "时间均为机场当地时间",
      en: "All times are local to each airport",
      ar: "جميع الأوقات بالتوقيت المحلي لكل مطار",
    },
    /** 中转格里那两个时刻各是什么，必须标出来。 */
    transferIn: { zh: "抵达", en: "Arrive", ar: "الوصول" },
    transferOut: {
      zh: "下一段起飞",
      en: "Next departure",
      ar: "إقلاع الرحلة التالية",
    },
    overnight: {
      zh: "跨零点",
      en: "crosses midnight",
      ar: "يمتد بعد منتصف الليل",
    },
    changeTerminal: {
      zh: "需换航站楼",
      en: "terminal change",
      ar: "تغيير الصالة",
    },
    sameTerminal: {
      zh: "同一航站楼",
      en: "same terminal",
      ar: "الصالة نفسها",
    },
  },
  baggage: { zh: "免费行李额", en: "Free baggage allowance", ar: "الأمتعة المجانية" },
  baggageRules: {
    zh: "行李规则与来源",
    en: "Baggage rules and sources",
    ar: "قواعد الأمتعة والمصادر",
  },
  checked: { zh: "托运", en: "Checked", ar: "المسجَّلة" },
  carryOn: { zh: "手提", en: "Carry-on", ar: "اليدوية" },

  copy: { zh: "复制", en: "Copy", ar: "نسخ" },
  copied: { zh: "已复制", en: "Copied", ar: "تم النسخ" },

  noPlan: {
    zh: "这一天没有属于该视图的安排。",
    en: "Nothing for this view on this day.",
    ar: "لا يوجد شيء لهذا العرض في هذا اليوم.",
  },

  freeTimeIdeas: {
    zh: "自由时间可以去哪（未预订）",
    en: "Ideas for free time (nothing booked)",
    ar: "أفكار لوقت الفراغ (دون أي حجز)",
  },
  routes: {
    zh: "半日建议路线",
    en: "Half-day route suggestions",
    ar: "مسارات مقترحة لنصف يوم",
  },
  routeDuration: { zh: "时长", en: "Length", ar: "المدة" },
  routeBestFor: { zh: "适合", en: "Best for", ar: "مناسب لـ" },
  routeSteps: { zh: "顺序", en: "Order", ar: "الترتيب" },
  routeTransport: { zh: "怎么去", en: "Getting there", ar: "كيفية الوصول" },
  routeTickets: { zh: "门票与开放", en: "Tickets and opening", ar: "التذاكر والفتح" },
  routesNote: {
    zh: "都是建议，全部未预订。时长是规划参考，不含临时变化；不写未核实的票价与营业时间。",
    en: "All suggestions, none booked. Durations are planning estimates, not promises; no unverified prices or opening hours are given.",
    ar: "كلها اقتراحات وغير محجوزة. والمدد تقديرات تخطيطية لا وعود؛ ولا تُذكر أسعار أو مواعيد غير مُتحقَّق منها.",
  },

  prep: { zh: "出发前准备", en: "Before you fly", ar: "قبل السفر" },

  /** 体量：这座城有多大 —— 用户要客人看到中国有多强。 */
  cityScale: {
    zh: "这座城有多大",
    en: "How big this city is",
    ar: "ما حجم هذه المدينة",
  },
  /** 科技就在身边：眼睛看得见的强。 */
  cityTech: {
    zh: "科技就在身边",
    en: "The technology around you",
    ar: "التقنية من حولكم",
  },
  techWhere: { zh: "在哪能见到", en: "Where you'll see it", ar: "أين ترونها" },

  /** 你们住的那块地：琶洲。 */
  pazhou: {
    zh: "你们住的这块地",
    en: "The ground you are staying on",
    ar: "الأرض التي تقيمون عليها",
  },
  /** 商圈考察：他们公费来的，回去要交报告 —— 这一节是给报告用的。 */
  retail: {
    zh: "商圈考察：天河路与北京路",
    en: "Retail study: Tianhe Road and Beijing Road",
    ar: "دراسة التجزئة: شارع تيانخه وشارع بكين",
  },
  retailMalls: { zh: "同一条路上的六家商场", en: "Six malls on one road", ar: "ستة مراكز تجارية في شارع واحد" },
  retailCase: { zh: "为什么这个案例有代表性", en: "Why this case is a textbook one", ar: "لماذا هذه الحالة نموذجية" },
  retailComparables: { zh: "可对照的案例", en: "Cases to set beside it", ar: "حالات للمقارنة" },
  retailTakeaways: { zh: "值得写进报告的", en: "Worth putting in the report", ar: "ما يستحق أن يُدرج في التقرير" },
  imageCredits: { zh: "图片来源", en: "Image credits", ar: "مصادر الصور" },

  /** 常见的文化差异：他们会困惑的点，先说在前面。 */
  culture: {
    zh: "常见的文化差异",
    en: "Cultural differences you will run into",
    ar: "فروق ثقافية ستواجهونها",
  },

  /** 食在广州：先讲分量，再讲每一道。 */
  foodCulture: {
    zh: "食在广州",
    en: "Eat in Guangzhou",
    ar: "كُل في قوانغتشو",
  },
  /** 数字块下面那行小字。 */
  scaleNote: {
    zh: "数字均为最新年度官方口径，来源见下；美元换算只作量级对比。",
    en: "All figures are the latest official annual data, sourced below; dollar conversions are for scale only.",
    ar: "جميع الأرقام أحدث بيانات رسمية سنوية، والمصادر أدناه؛ والتحويل إلى الدولار لبيان الحجم فقط.",
  },

  /** 这座城和阿拉伯世界的关系 —— 指南开头那段，不折叠。 */
  cityStory: {
    zh: "广州与你们",
    en: "Guangzhou and you",
    ar: "قوانغتشو وأنتم",
  },

  /**
   * 折叠起来时每节标题下的一行提示：收起状态下整份指南就是一张目录，
   * 得让人一眼知道里面有什么、值不值得点开。
   */
  guideHints: {
    prep: {
      zh: "支付宝绑外卡 · 滴滴打车 · 高德地图 · VPN · 插头与护照 · 天气",
      en: "Alipay with a foreign card · DiDi · Amap · VPN · plugs and passport · weather",
      ar: "أليباي ببطاقة أجنبية · ديدي · خرائط أماب · VPN · القوابس وجواز السفر · الطقس",
    },
    cityScale: {
      zh: "GDP 超过埃及全国 · 机场 · 港口 · 地铁 · 大湾区",
      en: "GDP larger than Egypt · airport · port · metro · Bay Area",
      ar: "ناتج أكبر من مصر · المطار · الميناء · المترو · منطقة الخليج",
    },
    pazhou: {
      zh: "海丝出海口 · 广交会 · 腾讯阿里总部，都在你们那条路上",
      en: "Silk Road port · Canton Fair · Tencent and Alibaba HQs — all on your road",
      ar: "ميناء طريق الحرير · معرض كانتون · مقرّا تينسنت وعلي بابا — كلّها في شارعكم",
    },
    foodCulture: {
      zh: "两千年 · 三大流派 · 联合国认的美食之都 · 烧鹅乳鸽海鲜 · 十二道菜",
      en: "Two thousand years · three branches · a UNESCO city of gastronomy · goose, squab, seafood · twelve dishes",
      ar: "ألفا عام · ثلاثة فروع · مدينة يونسكو لفنون الطهي · الإوز والحمام والمأكولات البحرية · اثنا عشر طبقًا",
    },
    tech: {
      zh: "无人出租车 · 载人无人机 · 送餐机器人 · 无人机送外卖 · 无现金 · 电动出租车",
      en: "Driverless taxis · passenger drones · delivery robots · drone takeaway · cashless · electric taxis",
      ar: "سيارات أجرة بلا سائق · طائرات ركاب مسيّرة · روبوتات توصيل · توصيل بالطائرات · بلا نقد · سيارات كهربائية",
    },
    retail: {
      zh: "给做商场的人：六家商场怎么定位招商 · 二十年补位的案例 · 成都对照 · 北京路 · 报告要点",
      en: "For people who run malls: how six malls position and lease · a twenty-year case · Chengdu for comparison · Beijing Road · report points",
      ar: "لمن يديرون المراكز التجارية: كيف تتموضع ستة مراكز وتؤجّر · حالة عشرين عامًا · تشنغدو للمقارنة · شارع بكين · نقاط للتقرير",
    },
    culture: {
      zh: "周五上班 · 酒桌 · 小费 · 手机支付 · 握手 · 「再研究一下」",
      en: "Friday works · toasts · tipping · phone pay · handshakes · the soft no",
      ar: "الجمعة يوم عمل · الأنخاب · الإكراميات · الدفع بالهاتف · المصافحة · الرفض المهذّب",
    },
    halal: {
      zh: "三座清真寺 · 周五主麻 · 清真餐厅",
      en: "Three mosques · Friday prayer · halal food",
      ar: "ثلاثة مساجد · صلاة الجمعة · طعام حلال",
    },
    baggage: {
      zh: "两家航司的免费额度与来源",
      en: "Both airlines' allowances and sources",
      ar: "مخصصات الشركتين ومصادرها",
    },
    copyAddresses: {
      zh: "酒店与两个航站楼，可复制给司机",
      en: "Hotel and both terminals, to show a driver",
      ar: "الفندق والصالتان، لعرضها على السائق",
    },
    phrases: {
      zh: "打车 · 问食材 · 问价格",
      en: "Taxis · ingredients · prices",
      ar: "سيارات الأجرة · المكوّنات · الأسعار",
    },
    routes: {
      zh: "花城广场（必去）· 登广州塔 · 珠江夜游 · 天河路太古汇 · 北京路 · 沙面",
      en: "Huacheng Square (do not miss) · Canton Tower · river cruise · Tianhe Road · Beijing Road · Shamian",
      ar: "ساحة هواتشنغ (لا تفوّتوها) · برج كانتون · جولة النهر · شارع تيانخه · شارع بكين · شاميان",
    },
    food: {
      zh: "烧鹅 · 乳鸽 · 海鲜 · 早茶 · 牛肉火锅 · 老火汤 · 十二道菜",
      en: "Yum cha · rice rolls · congee · sweets · arcades",
      ar: "اليوم تشا · لفائف الأرز · العصيدة · الحلويات · الأروقة",
    },
    officialSources: {
      zh: "页面上的事实出自哪里",
      en: "Where the facts on this page come from",
      ar: "من أين جاءت معلومات هذه الصفحة",
    },
  },


  /** 五人里四位是穆斯林 —— 礼拜与清真餐单独成节，排在指南靠前的位置。 */
  halal: {
    zh: "礼拜与清真餐",
    en: "Prayer and halal food",
    ar: "الصلاة والطعام الحلال",
  },
  mosques: { zh: "清真寺", en: "Mosques", ar: "المساجد" },
  halalDining: { zh: "清真餐厅", en: "Halal restaurants", ar: "مطاعم حلال" },
  jumuah: { zh: "主麻日", en: "Friday prayer", ar: "صلاة الجمعة" },
  /** 卡片上那行开放 / 营业信息，都要标明来源与是否核实。 */
  placeMeta: {
    zh: "营业与开放",
    en: "Hours and opening",
    ar: "المواعيد والفتح",
  },
  food: { zh: "吃什么 · 文化小知识", en: "What to eat · a little context", ar: "ماذا تأكل · لمحة ثقافية" },
  phrases: {
    zh: "可复制的中文短句",
    en: "Chinese phrases you can copy",
    ar: "عبارات صينية يمكن نسخها",
  },
  copyAddresses: {
    zh: "可复制的中文地址",
    en: "Chinese addresses you can copy",
    ar: "عناوين بالصينية يمكن نسخها",
  },
  officialSources: { zh: "官方来源", en: "Official sources", ar: "مصادر رسمية" },

  footer: {
    zh: "航班按票面当地时间；标「待定」的还没落实。",
    en: "Flight times are the ticket's local times; anything marked “to confirm” is not settled.",
    ar: "أوقات الرحلات بالتوقيت المحلي كما في التذكرة؛ وكل ما هو «بانتظار التأكيد» غير محسوم.",
  },
} as const;

/* ---------------- 日期 ---------------- */

const WEEKDAYS: Record<Lang, string[]> = {
  zh: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
  en: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  ar: ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"],
};

const MONTHS: Record<Lang, Record<number, string>> = {
  zh: { 9: "9月", 10: "10月" },
  en: { 9: "SEP", 10: "OCT" },
  ar: { 9: "سبتمبر", 10: "أكتوبر" },
};

export function parseDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  // UTC 构造，避免本地时区把日期推前一天。
  const weekday = new Date(Date.UTC(y, m - 1, d)).getUTCDay();
  return { y, m, d, weekday };
}

export function dayNumber(iso: string): string {
  return String(parseDate(iso).d);
}

export function monthLabel(iso: string, lang: Lang): string {
  const { m } = parseDate(iso);
  return MONTHS[lang][m] ?? String(m);
}

export function weekdayLabel(iso: string, lang: Lang): string {
  return WEEKDAYS[lang][parseDate(iso).weekday];
}

export function fullDateLabel(iso: string, lang: Lang): string {
  const { m, d } = parseDate(iso);
  const weekday = weekdayLabel(iso, lang);
  if (lang === "zh") return `${m} 月 ${d} 日 · ${weekday}`;
  return `${weekday} ${d} ${MONTHS[lang][m]}`;
}

export function shortDateLabel(iso: string, lang: Lang): string {
  const { m, d } = parseDate(iso);
  if (lang === "zh") return `${m}/${d}`;
  return `${d} ${MONTHS[lang][m]}`;
}
