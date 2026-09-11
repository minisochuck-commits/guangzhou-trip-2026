// 界面文案（三语）与日期格式化。行程事实在 lib/trip-data.ts，
// 每天每人的四行在 lib/person-day-plan.ts。

import type { L10n, Lang } from "./trip-data";

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
  "title": {
    "zh": "广州行程",
    "en": "Guangzhou Visit",
    "ar": "زيارة قوانغتشو"
  },
  "language": {
    "zh": "语言",
    "en": "Language",
    "ar": "اللغة"
  },
  "viewing": {
    "zh": "查看",
    "en": "Viewing",
    "ar": "العرض"
  },
  "everyone": {
    "zh": "全部",
    "en": "All",
    "ar": "الكل"
  },
  "tabs": {
    "day": {
      "zh": "全部行程",
      "en": "Itinerary",
      "ar": "برنامج الرحلة"
    },
    "guide": {
      "zh": "来华指南",
      "en": "China guide",
      "ar": "دليل الصين"
    }
  },
  "jumpToDate": {
    "zh": "跳到某一天",
    "en": "Jump to a day",
    "ar": "الانتقال إلى يوم"
  },
  "close": {
    "zh": "关闭",
    "en": "Close",
    "ar": "إغلاق"
  },
  "rows": {
    "lodging": {
      "zh": "住宿",
      "en": "Stay",
      "ar": "الإقامة"
    },
    "activity": {
      "zh": "活动",
      "en": "Plan",
      "ar": "البرنامج"
    },
    "dining": {
      "zh": "餐饮",
      "en": "Meals",
      "ar": "الوجبات"
    },
    "transport": {
      "zh": "交通",
      "en": "Travel",
      "ar": "التنقل"
    }
  },
  "matrixCorner": {
    "zh": "日期 / 人员",
    "en": "Date / person",
    "ar": "التاريخ / الشخص"
  },
  "cols": {
    "date": {
      "zh": "日期",
      "en": "Date",
      "ar": "التاريخ"
    },
    "plan": {
      "zh": "活动与交通",
      "en": "Plan & travel",
      "ar": "البرنامج والتنقل"
    },
    "stay": {
      "zh": "食宿",
      "en": "Meals & stay",
      "ar": "الوجبات والإقامة"
    }
  },
  "status": {
    "confirmed": {
      "zh": "已定",
      "en": "Set",
      "ar": "مؤكد"
    },
    "pending": {
      "zh": "待定",
      "en": "To confirm",
      "ar": "بانتظار التأكيد"
    }
  },
  "tz": {
    "cairo": {
      "zh": "开罗时间",
      "en": "Cairo time",
      "ar": "بتوقيت القاهرة"
    },
    "beijing": {
      "zh": "北京时间",
      "en": "Beijing time",
      "ar": "بتوقيت بكين"
    }
  },
  "details": {
    "zh": "详情",
    "en": "Details",
    "ar": "التفاصيل"
  },
  "entries": {
    "hotelAddress": {
      "zh": "酒店地址",
      "en": "Hotel address",
      "ar": "عنوان الفندق"
    },
    "stayNote": {
      "zh": "住宿说明",
      "en": "Stay details",
      "ar": "تفاصيل الإقامة"
    },
    "flights": {
      "zh": "航班与行李",
      "en": "Flights & baggage",
      "ar": "الرحلات والأمتعة"
    },
    "storeVisit": {
      "zh": "巡店安排",
      "en": "Store visit",
      "ar": "برنامج زيارة المتاجر"
    },
    "sessions": {
      "zh": "会议安排",
      "en": "Session details",
      "ar": "تفاصيل الجلسات"
    },
    "meals": {
      "zh": "用餐说明",
      "en": "Meal details",
      "ar": "تفاصيل الوجبات"
    },
    "routes": {
      "zh": "游玩路线",
      "en": "Route ideas",
      "ar": "مسارات مقترحة"
    },
    "transfer": {
      "zh": "接送安排",
      "en": "Transport details",
      "ar": "تفاصيل التنقل"
    },
    "notes": {
      "zh": "当天说明",
      "en": "Notes for the day",
      "ar": "ملاحظات اليوم"
    }
  },
  "fullText": {
    "zh": "完整说明",
    "en": "Full wording",
    "ar": "النص الكامل"
  },
  "foodIdeas": {
    "zh": "吃什么",
    "en": "What to eat",
    "ar": "ماذا تأكل"
  },
  "diningBrands": {
    "zh": "特色餐饮品牌推荐",
    "en": "Restaurant brands worth trying",
    "ar": "علامات مطاعم تستحق التجربة"
  },
  "viewingNow": {
    "zh": "正在看",
    "en": "Viewing",
    "ar": "المعروض الآن"
  },
  "flightDetails": {
    "zh": "航班与行李",
    "en": "Flights and baggage",
    "ar": "الرحلات والأمتعة"
  },
  "nextDay": {
    "zh": "次日抵达",
    "en": "arrives next day",
    "ar": "الوصول اليوم التالي"
  },
  "journey": {
    "report": {
      "zh": "到机场",
      "en": "At the airport",
      "ar": "الوصول إلى المطار"
    },
    "leg": {
      "zh": "航段",
      "en": "Flight",
      "ar": "الرحلة"
    },
    "transfer": {
      "zh": "中转",
      "en": "Transfer",
      "ar": "الترانزيت"
    },
    "arrive": {
      "zh": "抵达",
      "en": "Arrival",
      "ar": "الوصول"
    },
    "depart": {
      "zh": "出发",
      "en": "Departure",
      "ar": "المغادرة"
    },
    "localTimeNote": {
      "zh": "时间均为机场当地时间",
      "en": "All times are local to each airport",
      "ar": "جميع الأوقات بالتوقيت المحلي لكل مطار"
    },
    "transferIn": {
      "zh": "抵达",
      "en": "Arrive",
      "ar": "الوصول"
    },
    "transferOut": {
      "zh": "下一段起飞",
      "en": "Next departure",
      "ar": "إقلاع الرحلة التالية"
    },
    "overnight": {
      "zh": "跨零点",
      "en": "crosses midnight",
      "ar": "يمتد بعد منتصف الليل"
    },
    "changeTerminal": {
      "zh": "需换航站楼",
      "en": "terminal change",
      "ar": "تغيير الصالة"
    },
    "sameTerminal": {
      "zh": "同一航站楼",
      "en": "same terminal",
      "ar": "الصالة نفسها"
    }
  },
  "baggage": {
    "zh": "免费行李额",
    "en": "Free baggage allowance",
    "ar": "الأمتعة المجانية"
  },
  "baggageRules": {
    "zh": "行李规则与来源",
    "en": "Baggage rules and sources",
    "ar": "قواعد الأمتعة والمصادر"
  },
  "checked": {
    "zh": "托运",
    "en": "Checked",
    "ar": "المسجَّلة"
  },
  "carryOn": {
    "zh": "手提",
    "en": "Carry-on",
    "ar": "اليدوية"
  },
  "copy": {
    "zh": "复制",
    "en": "Copy",
    "ar": "نسخ"
  },
  "copied": {
    "zh": "已复制",
    "en": "Copied",
    "ar": "تم النسخ"
  },
  "noPlan": {
    "zh": "这一天没有属于该视图的安排。",
    "en": "Nothing for this view on this day.",
    "ar": "لا يوجد شيء لهذا العرض في هذا اليوم."
  },
  "freeTimeIdeas": {
    "zh": "自由时间可以去哪（未预订）",
    "en": "Ideas for free time (nothing booked)",
    "ar": "أفكار لوقت الفراغ (دون أي حجز)"
  },
  "routes": {
    "zh": "半日建议路线",
    "en": "Half-day route suggestions",
    "ar": "مسارات مقترحة لنصف يوم"
  },
  "routeDuration": {
    "zh": "时长",
    "en": "Length",
    "ar": "المدة"
  },
  "routeBestFor": {
    "zh": "适合",
    "en": "Best for",
    "ar": "مناسب لـ"
  },
  "routeSteps": {
    "zh": "顺序",
    "en": "Order",
    "ar": "الترتيب"
  },
  "routeTransport": {
    "zh": "怎么去",
    "en": "Getting there",
    "ar": "كيفية الوصول"
  },
  "routeTickets": {
    "zh": "门票与开放",
    "en": "Tickets and opening",
    "ar": "التذاكر والفتح"
  },
  "routesNote": {
    "zh": "以下时长为游览参考；出发前用地图查看往返路程，按空闲时间挑一条。",
    "en": "The lengths below are a guide to the visit itself; check the journey each way in your map app and pick one that fits the time you have.",
    "ar": "المدد أدناه تقدير للزيارة نفسها؛ راجعوا زمن الذهاب والعودة في تطبيق الخرائط واختاروا ما يناسب وقتكم."
  },
  "prep": {
    "zh": "出发前准备",
    "en": "Before you fly",
    "ar": "قبل السفر"
  },
  "cityScale": {
    "zh": "这座城有多大",
    "en": "How big this city is",
    "ar": "ما حجم هذه المدينة"
  },
  "cityTech": {
    "zh": "科技就在身边",
    "en": "The technology around you",
    "ar": "التقنية من حولكم"
  },
  "techWhere": {
    "zh": "在哪能见到",
    "en": "Where you'll see it",
    "ar": "أين ترونها"
  },
  "pazhou": {
    "zh": "琶洲：你住的这块地",
    "en": "Around your hotel: Pazhou",
    "ar": "حول فندقكم: بازو"
  },
  "retail": {
    "zh": "广州商圈：天河路与北京路",
    "en": "Shopping districts: Tianhe Road & Beijing Road",
    "ar": "مناطق التسوق: شارع تيانخه وشارع بكين"
  },
  "retailMalls": {
    "zh": "同一条路上的六家商场",
    "en": "Six malls on one road",
    "ar": "ستة مراكز تجارية في شارع واحد"
  },
  "retailCase": {
    "zh": "边走边看",
    "en": "Along the way",
    "ar": "أثناء التجول"
  },
  "retailComparables": {
    "zh": "可对照的案例",
    "en": "Cases to set beside it",
    "ar": "حالات للمقارنة"
  },
  "retailTakeaways": {
    "zh": "逛街时可以留意",
    "en": "Details to notice",
    "ar": "تفاصيل تستحق الانتباه"
  },
  "imageCredits": {
    "zh": "图片来源",
    "en": "Image credits",
    "ar": "مصادر الصور"
  },
  "culture": {
    "zh": "到了会遇到的几件小事",
    "en": "Small things you will run into",
    "ar": "تفاصيل صغيرة ستصادفونها"
  },
  "foodCulture": {
    "zh": "食在广州",
    "en": "Eat in Guangzhou",
    "ar": "كُل في قوانغتشو"
  },
  "scaleNote": {
    "zh": "数据标注了对应年份，来源可展开查看。",
    "en": "Figures show their reference year; sources are available below.",
    "ar": "تظهر سنة كل رقم، ويمكن الاطلاع على المصادر أدناه."
  },
  "cityStory": {
    "zh": "广州与你们",
    "en": "Guangzhou and you",
    "ar": "قوانغتشو وأنتم"
  },
  "guideHints": {
    "prep": {
      "zh": "支付 · 打车 · 地图 · 上网 · 随身物品",
      "en": "Payment · rides · maps · internet · essentials",
      "ar": "الدفع · السيارات · الخرائط · الإنترنت · الأساسيات"
    },
    "cityScale": {
      "zh": "机场、展馆与珠江两岸",
      "en": "The airport, the exhibition halls and the two river banks",
      "ar": "المطار وقاعات المعارض وضفتا النهر"
    },
    "pazhou": {
      "zh": "四百年前，一座塔在这里迎接远来的商船",
      "en": "Four centuries ago a tower here welcomed the ships in",
      "ar": "قبل أربعة قرون كان برج هنا يستقبل السفن"
    },
    "foodCulture": {
      "zh": "早茶怎么叹、菜怎么点、21 个特色餐饮品牌",
      "en": "How yum cha works, how to order, and 21 restaurant brands",
      "ar": "كيف يكون اليوم تشا وكيف تطلبون، و21 علامة مطاعم"
    },
    "tech": {
      "zh": "驾驶位上没有人，送餐的是一台会乘电梯的小车",
      "en": "Nobody in the driver’s seat, and a robot that takes the lift",
      "ar": "لا أحد في مقعد السائق، وروبوت يركب المصعد"
    },
    "retail": {
      "zh": "天河路的购物中心，北京路的老街与古道遗址",
      "en": "The malls of Tianhe Road, and the old street and ancient roadway of Beijing Road",
      "ar": "مراكز شارع تيانخه، وشارع بكين القديم وطريقه الأثري"
    },
    "culture": {
      "zh": "转盘、敬酒、小费、合影、点菜 —— 到了就会遇到的几件小事",
      "en": "Turntables, toasts, tipping, photos, ordering — the small things you will meet",
      "ar": "القرص الدوّار والأنخاب والإكرامية والصور والطلب — تفاصيل ستصادفونها"
    },
    "halal": {
      "zh": "三座清真寺 · 周五主麻 · 清真餐厅",
      "en": "Three mosques · Friday prayer · halal food",
      "ar": "ثلاثة مساجد · صلاة الجمعة · طعام حلال"
    },
    "baggage": {
      "zh": "两家航司的免费额度与来源",
      "en": "Both airlines' allowances and sources",
      "ar": "مخصصات الشركتين ومصادرها"
    },
    "copyAddresses": {
      "zh": "酒店与两个航站楼，可复制给司机",
      "en": "Hotel and both terminals, to show a driver",
      "ar": "الفندق والصالتان، لعرضها على السائق"
    },
    "phrases": {
      "zh": "打车 · 问食材 · 问价格",
      "en": "Taxis · ingredients · prices",
      "ar": "سيارات الأجرة · المكوّنات · الأسعار"
    },
    "routes": {
      "zh": "花城广场（必去）· 登广州塔 · 珠江夜游 · 天河路太古汇 · 北京路 · 沙面",
      "en": "Huacheng Square (do not miss) · Canton Tower · river cruise · Tianhe Road · Beijing Road · Shamian",
      "ar": "ساحة هواتشنغ (لا تفوّتوها) · برج كانتون · جولة النهر · شارع تيانخه · شارع بكين · شاميان"
    },
    "food": {
      "zh": "烧鹅 · 乳鸽 · 白切鸡 · 肠粉 · 姜撞奶 · 老火汤",
      "en": "Roast goose · squab · poached chicken · rice rolls · ginger milk · slow soup",
      "ar": "إوز مشوي · حمام · دجاج مسلوق · لفائف أرز · حليب الزنجبيل · حساء بطيء"
    },
    "officialSources": {
      "zh": "资料与图片出处",
      "en": "References and photo credits",
      "ar": "المراجع ومصادر الصور"
    }
  },
  "halal": {
    "zh": "礼拜与清真餐",
    "en": "Prayer and halal food",
    "ar": "الصلاة والطعام الحلال"
  },
  "mosques": {
    "zh": "清真寺",
    "en": "Mosques",
    "ar": "المساجد"
  },
  "halalDining": {
    "zh": "清真餐厅",
    "en": "Halal restaurants",
    "ar": "مطاعم حلال"
  },
  "jumuah": {
    "zh": "主麻日",
    "en": "Friday prayer",
    "ar": "صلاة الجمعة"
  },
  "placeMeta": {
    "zh": "营业与开放",
    "en": "Hours and opening",
    "ar": "المواعيد والفتح"
  },
  "food": {
    "zh": "吃什么 · 文化小知识",
    "en": "What to eat · a little context",
    "ar": "ماذا تأكل · لمحة ثقافية"
  },
  "phrases": {
    "zh": "可复制的中文短句",
    "en": "Chinese phrases you can copy",
    "ar": "عبارات صينية يمكن نسخها"
  },
  "copyAddresses": {
    "zh": "可复制的中文地址",
    "en": "Chinese addresses you can copy",
    "ar": "عناوين بالصينية يمكن نسخها"
  },
  "officialSources": {
    "zh": "官方来源",
    "en": "Official sources",
    "ar": "مصادر رسمية"
  },
  "footer": {
    "zh": "航班按票面当地时间；标「待定」的还没落实。",
    "en": "Flight times are the ticket's local times; anything marked “to confirm” is not settled.",
    "ar": "أوقات الرحلات بالتوقيت المحلي كما في التذكرة؛ وكل ما هو «بانتظار التأكيد» غير محسوم."
  }
};

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
