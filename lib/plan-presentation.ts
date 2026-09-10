// 表格展示层：把事实正本压成表内能读的 2–4 短行。
//
// 事实正本是 `lib/trip-data.ts` 和 `lib/person-day-plan.ts`，**这里不改它们**。
// 每个格子的完整原文、细节、航班、地址仍然在弹窗里原样显示。
//
// 为什么要有这一层：390px 手机上，交通格的整句原文会把 Reham 9/27 那一行撑到
// 两百多像素高，同一行其它三格却大片空白。这里按 (日期 × 人员 × 字段) 手写短句，
// **不做截断、不用正则剪、也不用 line-clamp** —— 关键事实（到机场时刻、航站楼、
// 谁负责、公司管不管）一个都不能掉。
//
// ⚠️ 日期分支的顺序有坑：Li/Qiuting 9/25–10/5 是她在中国的个人行程，
// **不能**被 9/28「抵达开罗」这类按日期一刀切的分支吃掉。所以三个按日期分支的
// 函数一律先处理她这一段。

import type { L10n } from "./trip-data";
import type { PersonDayCard } from "./person-day-plan";

export type Field = "lodging" | "activity" | "dining" | "transport";

/** 表里的一行属于谁。Ahmed + Mohamed 是同一条记录。 */
export type GroupKey = "qiuting" | "rahma" | "study" | "reham";

/** 弹窗入口的类型 —— 按钮和弹窗标题都用它，不再统称「详情」。 */
export type EntryKind =
  | "hotelAddress"
  | "stayNote"
  | "flights"
  | "storeVisit"
  | "sessions"
  | "meals"
  | "routes"
  | "transfer"
  | "notes";

export type CellView = {
  /** 表内显示的短行，2–4 行。 */
  lines: L10n[];
  /** 没有可看内容时为 null —— 不挂没用的按钮。 */
  entry: EntryKind | null;
  /** 建议行（自由日一条路线 / 自由日一样吃的），14px，显示在短行之后。 */
  suggestion?: L10n;
  /**
   * 短行里已经写清「待定的是什么」时置 true：
   * 再挂一行红色「待定」只是重复，还白白拉高整行。
   * 完整状态仍在弹窗里显示。
   */
  hidePending?: boolean;
  /**
   * 弹窗里当天特有的协调事项。只写旅程里没有的东西 ——
   * 到机场时刻已经在旅程里了，不要在这里重复一遍。
   */
  coordination?: L10n[];
  /** 弹窗里要展示的路线（自由日）。 */
  routeIds?: string[];
  /** 弹窗里要展示的美食文化条目（自理餐食）。 */
  foodNoteIds?: string[];
};

function L(zh: string, en: string, ar: string): L10n {
  return { zh, en, ar };
}

export function groupKeyOf(card: PersonDayCard): GroupKey {
  const people = card.people;
  if (people.length > 1) return "study";
  return people[0] as GroupKey;
}

/** Li/Qiuting 在中国的个人行程段。三个按日期分支的函数都要先看它。 */
function isQiutingPersonal(date: string, group: GroupKey): boolean {
  return group === "qiuting" && date >= "2026-09-25" && date <= "2026-10-05";
}

/* ------------------------------------------------------------------ */
/* 建议句（主表只露一条，短；其余选项和「未预订」在弹窗）              */
/* ------------------------------------------------------------------ */

/** 路线的短地名。主表放不下 ROUTES 里的完整标题。 */
const ROUTE_SHORT: Record<string, L10n> = {
  huangpu: L("黄埔古港", "Huangpu Ancient Port", "ميناء هوانغبو"),
  xiguan: L("西关老城", "Old Xiguan", "شيغوان القديمة"),
  huacheng: L("珠江夜景", "Pearl River at night", "نهر اللؤلؤ ليلاً"),
};

function optional(label: L10n): L10n {
  return L(`可选：${label.zh}`, `Optional: ${label.en}`, `اختياري: ${label.ar}`);
}

/** 主表只给第一条；点开「游玩路线」才看到全部选项与「未预订」说明。 */
function routeSuggestion(ids: string[]): L10n | undefined {
  const first = ids.find((id) => ROUTE_SHORT[id]);
  return first ? optional(ROUTE_SHORT[first]) : undefined;
}

/** 自由日的吃什么。一天一条，按日期换，别每格都是「早茶/肠粉/甜品」长句。 */
const FOOD_SHORT: Record<string, L10n> = {
  "changfen": L("肠粉", "rice noodle rolls", "لفائف الأرز"),
  "morning-tea": L("早茶", "morning tea", "شاي الصباح"),
  "dessert": L("广州甜品", "a Guangzhou dessert", "حلوى من قوانغتشو"),
};

/** 只有真正自由的那几天给「吃什么」建议：学习日和返程日不塞耗时推荐。 */
const FOOD_PICK: Record<string, string> = {
  "2026-09-25|rahma": "changfen",
  "2026-09-25|reham": "changfen",
  "2026-09-26|rahma": "dessert",
  "2026-09-26|reham": "dessert",
  "2026-09-26|study": "morning-tea",
};

/** 弹窗「用餐说明」里给的美食条目 —— 食材与做法的提醒在这里，不占主表。 */
const FOOD_NOTE_IDS = ["morning-tea", "changfen", "dessert"];

/* ------------------------------------------------------------------ */
/* 住宿                                                                */
/* ------------------------------------------------------------------ */

const HOTEL_NAME_SHORT = L("保利洲际", "InterContinental", "إنتركونتيننتال");

const ROOM_WITH_RAHMA = L("与 Rahma 同房", "Sharing with Rahma", "غرفة مشتركة مع Rahma");
const ROOM_WITH_QIUTING = L(
  "与 Li/Qiuting 同房",
  "Sharing with Li/Qiuting",
  "غرفة مشتركة مع Li/Qiuting",
);
const ROOM_STUDY = L(
  "Ahmed 与 Mohamed 同房",
  "Ahmed and Mohamed share",
  "Ahmed و Mohamed في غرفة واحدة",
);
const ROOM_SINGLE = L("单住", "Single room", "غرفة مفردة");

const HOTEL_NAME_TBD = L("酒店名待定", "Hotel name to be set", "اسم الفندق لم يُحدَّد");

/** 责任方不能因为压字数被压掉：三语都要说清是公司订。 */
const COMPANY_BOOKS_SINGLE = L(
  "公司另订 · 单住",
  "Company books another hotel · single",
  "الشركة تحجز فندقًا آخر · غرفة مفردة",
);
const COMPANY_BOOKS_NEAR_TRAINING = L(
  "公司另订 · 学习地附近",
  "Company books one near the training",
  "الشركة تحجز فندقًا قرب مكان التدريب",
);

const QIUTING_PERSONAL_STAY: L10n[] = [
  L("在中国的个人行程", "Personal travel in China", "برنامج شخصي داخل الصين"),
  L("住宿自理", "Accommodation self-arranged", "الإقامة مُرتَّبة ذاتيًا"),
  L("离穗日期待定", "Departure date to be set", "تاريخ المغادرة لم يُحدَّد"),
];

function lodgingView(date: string, group: GroupKey): CellView {
  // Li/Qiuting 9/25–10/5：她不在广州，也没「行程结束」。必须先判。
  if (isQiutingPersonal(date, group)) {
    return { lines: QIUTING_PERSONAL_STAY, entry: "stayNote", hidePending: true };
  }

  if (date === "2026-09-20" || date === "2026-10-06") {
    // 「当晚在飞机上」已经说明没有酒店，不再补一行「不住酒店」。
    return {
      lines: [
        L("当晚在飞机上", "Overnight on the plane", "المبيت على متن الطائرة"),
      ],
      entry: null,
    };
  }
  if (date === "2026-09-28" || date === "2026-10-07") {
    return {
      lines: [L("本次行程结束", "The trip ends here", "تنتهي الرحلة هنا")],
      entry: null,
    };
  }

  if (group === "qiuting") {
    return { lines: [HOTEL_NAME_SHORT, ROOM_WITH_RAHMA], entry: "hotelAddress" };
  }

  if (group === "rahma") {
    if (date <= "2026-09-24") {
      return { lines: [HOTEL_NAME_SHORT, ROOM_WITH_QIUTING], entry: "hotelAddress" };
    }
    if (date <= "2026-09-26") {
      return {
        lines: [COMPANY_BOOKS_SINGLE, HOTEL_NAME_TBD],
        entry: "stayNote",
        hidePending: true,
      };
    }
    return {
      lines: [
        L("当日离境", "Departing today", "المغادرة اليوم"),
        L("不再住一晚", "No extra hotel night", "دون ليلة فندق إضافية"),
      ],
      entry: null,
    };
  }

  if (group === "study") {
    if (date <= "2026-09-24") {
      return { lines: [HOTEL_NAME_SHORT, ROOM_STUDY], entry: "hotelAddress" };
    }
    if (date <= "2026-09-26") {
      return {
        lines: [COMPANY_BOOKS_NEAR_TRAINING, ROOM_STUDY, HOTEL_NAME_TBD],
        entry: "stayNote",
        hidePending: true,
      };
    }
    return {
      lines: [
        L("当日离境", "Departing today", "المغادرة اليوم"),
        L("不再住一晚", "No extra hotel night", "دون ليلة فندق إضافية"),
      ],
      entry: null,
    };
  }

  // reham
  if (date <= "2026-09-26") {
    return { lines: [HOTEL_NAME_SHORT, ROOM_SINGLE], entry: "hotelAddress" };
  }
  // 夜航离境 / 不再住一晚在活动格和航班里已经看得到，这里不重复占行。
  return {
    lines: [
      L("当天退房", "Check out today", "المغادرة اليوم"),
      L("寄存 / 延退待确认", "Storage / late stay: TBC", "الحفظ / التمديد: بانتظار"),
    ],
    entry: "stayNote",
    hidePending: true,
  };
}

/* ------------------------------------------------------------------ */
/* 活动                                                                */
/* ------------------------------------------------------------------ */

/**
 * 自由日给哪几条路线。第一条就是主表露出的那条。
 * 半天自由不给要占一整个白天的西关；返程日不新增耗时路线；
 * Li/Qiuting 在中国的个人行程完全不出现广州路线。
 */
const FREE_ROUTES: Record<string, string[]> = {
  "2026-09-22|reham": ["huacheng", "huangpu"],
  "2026-09-25|rahma": ["xiguan"],
  "2026-09-25|reham": ["xiguan"],
  "2026-09-26|rahma": ["huangpu", "huacheng"],
  "2026-09-26|reham": ["huacheng"],
  "2026-09-26|study": ["huangpu", "xiguan"],
};

export function routesFor(date: string, group: GroupKey): string[] | undefined {
  return FREE_ROUTES[`${date}|${group}`];
}

function activityView(date: string, group: GroupKey, card: PersonDayCard): CellView {
  const ids = routesFor(date, group);
  const withRoutes = (lines: L10n[]): CellView => ({
    lines,
    entry: "routes",
    suggestion: ids ? routeSuggestion(ids) : undefined,
    routeIds: ids ?? card.freeRoutes,
  });

  if (date === "2026-09-20") {
    if (group === "reham") {
      return {
        lines: [
          L("前往开罗机场", "Heading to Cairo Airport", "التوجه إلى مطار القاهرة"),
          L("搭 9/21 00:20 夜航", "For the 00:20 night flight on 21 Sep", "لرحلة 00:20 ليل 21 سبتمبر"),
        ],
        entry: null,
      };
    }
    return {
      lines: [L("从开罗出发前往广州", "Leaving Cairo for Guangzhou", "المغادرة من القاهرة إلى قوانغتشو")],
      entry: null,
    };
  }

  if (date === "2026-09-21") {
    return {
      lines: [L("抵达广州，报到", "Arrive in Guangzhou, check in", "الوصول إلى قوانغتشو والتسجيل")],
      entry: null,
    };
  }

  if (group === "qiuting") {
    if (date === "2026-09-22" || date === "2026-09-23") {
      return { lines: [L("参加总部会议", "HQ sessions", "جلسات المقر")], entry: "sessions" };
    }
    if (date === "2026-09-24") {
      return {
        lines: [L("上午 总部订货会", "Morning: HQ order fair", "صباحًا: معرض الطلبيات")],
        entry: null,
      };
    }
    if (date === "2026-10-06") {
      return {
        lines: [L("从广州返回埃及", "Flying back to Egypt", "السفر عائدة إلى مصر")],
        entry: null,
      };
    }
    if (date === "2026-10-07") {
      return { lines: [L("抵达开罗", "Arrive in Cairo", "الوصول إلى القاهرة")], entry: null };
    }
    return {
      lines: [
        L("会后返乡过中秋", "Home for the Mid-Autumn holiday", "العودة إلى البيت لعطلة منتصف الخريف"),
        L("个人行程", "Personal time", "وقت شخصي"),
        L("不参加广州安排", "Not joining the Guangzhou plan", "دون المشاركة في برنامج قوانغتشو"),
      ],
      entry: null,
    };
  }

  if (date === "2026-09-28") {
    return { lines: [L("抵达开罗", "Arrive in Cairo", "الوصول إلى القاهرة")], entry: null };
  }

  if (group === "rahma") {
    if (date === "2026-09-22" || date === "2026-09-23") {
      return { lines: [L("参加总部会议", "HQ sessions", "جلسات المقر")], entry: "sessions" };
    }
    if (date === "2026-09-24") {
      return {
        lines: [L("上午 总部订货会", "Morning: HQ order fair", "صباحًا: معرض الطلبيات")],
        entry: null,
      };
    }
    if (date === "2026-09-25" || date === "2026-09-26") {
      return withRoutes([
        L("留在广州", "Staying in Guangzhou", "البقاء في قوانغتشو"),
        L("自由安排", "Free day", "يوم حر"),
      ]);
    }
    return { lines: [L("返回埃及", "Returning to Egypt", "العودة إلى مصر")], entry: null };
  }

  if (group === "study") {
    if (date === "2026-09-22" || date === "2026-09-23") {
      return { lines: [L("参加总部会议", "HQ sessions", "جلسات المقر")], entry: "sessions" };
    }
    if (date === "2026-09-24" || date === "2026-09-25") {
      const day = date === "2026-09-24" ? 1 : 2;
      return {
        lines: [
          L(`巡店学习 第 ${day} 天`, `Store-visit training, day ${day}`, `تدريب زيارة المتاجر، اليوم ${day}`),
          L("MINISO 中国区域负责人带", "Led by the MINISO China regional lead", "بقيادة مسؤول منطقة MINISO في الصين"),
          L("课表与门店待定", "Timetable and stores to be set", "الجدول والمتاجر لم تُحدَّد"),
        ],
        entry: "storeVisit",
        hidePending: true,
      };
    }
    if (date === "2026-09-26") {
      return withRoutes([L("自由活动", "Free day", "يوم حر")]);
    }
    return { lines: [L("返回埃及", "Returning to Egypt", "العودة إلى مصر")], entry: null };
  }

  // reham
  if (date === "2026-09-22") {
    return withRoutes([
      L("上午 总部会议", "Morning: HQ sessions", "صباحًا: جلسات المقر"),
      L("下午 自由", "Afternoon: free", "بعد الظهر: وقت حر"),
    ]);
  }
  if (date === "2026-09-23" || date === "2026-09-24") {
    return {
      lines: [
        L("总部巡店 13:50–17:30", "HQ store visit 13:50–17:30", "جولة متاجر المقر 13:50–17:30"),
        L("9/23 与 9/24 择一", "On either 23 or 24 Sep", "يوم 23 أو 24 سبتمبر"),
        L("哪天待 Rahma 确认", "Rahma confirms which day", "تحدّد Rahma اليوم"),
      ],
      entry: "storeVisit",
      hidePending: true,
    };
  }
  if (date === "2026-09-25" || date === "2026-09-26") {
    return withRoutes([L("自由安排", "Free day", "يوم حر")]);
  }
  // 9/27：夜航前不新增耗时路线
  return {
    lines: [
      L("白天在广州自由", "Free during the day in Guangzhou", "وقت حر نهارًا في قوانغتشو"),
      L("夜间返回埃及", "Flying back to Egypt at night", "العودة إلى مصر ليلًا"),
      L("不建议远行", "Not a day for going far", "ليس يومًا للابتعاد"),
    ],
    entry: "notes",
  };
}

/* ------------------------------------------------------------------ */
/* 餐饮                                                                */
/* ------------------------------------------------------------------ */

/**
 * 出行日主表只写这一句。特殊餐怎么申请是**每天都一样**的通用提醒，
 * 挂在 8 个出行日格子里就是噪音 —— 统一挪到指南的「吃什么」里说一次（FOOD_ADVICE）。
 */
const MEALS_ONBOARD_SHORT: L10n[] = [
  L("机场 / 机上用餐", "Airport and on-board meals", "وجبات المطار والطائرة"),
];

/**
 * 通用饮食提醒，整站只在指南的「吃什么」出现一次。
 * 第一句沿用 person-day-plan 的 DIET_ASK 原文，第二句是原来贴在每个出行日的特殊餐提醒。
 */
export const FOOD_ADVICE: L10n[] = [
  L(
    "有清真、过敏或忌口需求，请提前告知，并在点餐时问清食材与做法。",
    "If you need halal food or have allergies or other restrictions, say so in advance and ask about ingredients and preparation when ordering.",
    "إن كنت تحتاج طعامًا حلالًا أو لديك حساسية أو قيود أخرى، فأخبرهم مسبقًا واسأل عن المكوّنات وطريقة الإعداد عند الطلب.",
  ),
  L(
    "机上特殊餐需出发前直接向航空公司申请。",
    "Special in-flight meals must be requested from the airline before departure.",
    "تُطلب الوجبات الخاصة على متن الطائرة من شركة الطيران قبل السفر.",
  ),
];

const SELF_MEALS_LINE = L("餐食自理", "Meals self-arranged", "الوجبات ذاتية الترتيب");

/** 自理餐食：主表只给一条短建议（仅自由日），食材与做法提醒在「用餐说明」里。 */
function selfMeals(date: string, group: GroupKey): CellView {
  const pick = FOOD_PICK[`${date}|${group}`];
  return {
    lines: [SELF_MEALS_LINE],
    entry: "meals",
    suggestion: pick ? optional(FOOD_SHORT[pick]) : undefined,
    foodNoteIds: FOOD_NOTE_IDS,
  };
}

function diningView(date: string, group: GroupKey): CellView {
  // Li/Qiuting 9/25–10/5：在中国自理，不是机上餐。
  if (isQiutingPersonal(date, group)) {
    return { lines: [SELF_MEALS_LINE], entry: null };
  }

  // 出行日的「待定」是通用的特殊餐提醒，不是某个没定下来的订餐，不挂红标。
  if (date === "2026-09-20") {
    return { lines: MEALS_ONBOARD_SHORT, entry: "meals", hidePending: true };
  }
  if (date === "2026-09-28" || date === "2026-10-06" || date === "2026-10-07") {
    return { lines: MEALS_ONBOARD_SHORT, entry: null, hidePending: true };
  }

  if (date === "2026-09-21") {
    if (group === "study") {
      return {
        lines: [
          L("自报到起 公司安排", "Company-arranged from check-in", "الشركة ترتّبها من التسجيل"),
          L("具体时间未明确", "Exact times not specified", "الأوقات الدقيقة غير محددة"),
        ],
        entry: "meals",
      };
    }
    // 「未指定餐厅」是「用餐时间未明确」的同一件事，不再单占一行。
    return {
      lines: [
        L("用餐时间未明确", "Meal times not given", "أوقات الوجبات غير محددة"),
      ],
      entry: "meals",
      hidePending: true,
    };
  }

  if (group === "qiuting" || group === "rahma") {
    if (date <= "2026-09-24") {
      return {
        lines: [L("会议期间 公司安排", "Company-arranged during sessions", "الشركة ترتّبها أثناء الجلسات")],
        entry: "meals",
      };
    }
    return selfMeals(date, group);
  }

  if (group === "study") {
    if (date === "2026-09-22" || date === "2026-09-23") {
      return {
        lines: [L("参会期间 公司安排", "Company-arranged while attending", "الشركة ترتّبها أثناء الحضور")],
        entry: "meals",
      };
    }
    if (date === "2026-09-24") {
      return {
        lines: [L("9/24 起 餐食自理", "Self-arranged from 24 Sep", "ذاتية الترتيب من 24 سبتمبر")],
        entry: "meals",
        foodNoteIds: FOOD_NOTE_IDS,
      };
    }
    return selfMeals(date, group);
  }

  // reham 9/22–9/24 会议餐；9/25 起自理
  if (date <= "2026-09-24") {
    return {
      lines: [
        L("会议餐 公司安排", "Session meals company-arranged", "وجبات الجلسات ترتّبها الشركة"),
        L("外出时可不参加", "You need not join when out", "لست مضطرة للانضمام عند الخروج"),
      ],
      entry: "meals",
    };
  }
  return selfMeals(date, group);
}

/* ------------------------------------------------------------------ */
/* 交通                                                                */
/* ------------------------------------------------------------------ */

const VENUE_TBD_LINE = L(
  "往返会场用车待定",
  "Venue transport to be arranged",
  "التنقل من وإلى المكان لم يُرتَّب",
);

const CITY_SELF_LINE = L(
  "市内出行自理",
  "Getting around self-arranged",
  "التنقل ذاتي الترتيب",
);

function transportView(date: string, group: GroupKey): CellView {
  // Li/Qiuting 9/25–10/5：在中国，不是 06:50 抵开罗。
  if (isQiutingPersonal(date, group)) {
    return {
      lines: [
        L("返乡与返穗交通自理", "Travel home and back self-arranged", "السفر ذهابًا وإيابًا ذاتي الترتيب"),
      ],
      entry: null,
      hidePending: true,
    };
  }

  if (date === "2026-09-20") {
    if (group === "reham") {
      return {
        lines: [
          L("9/20 当晚 21:20 到开罗 T3", "21:20 on 20 Sep at Cairo T3", "21:20 مساء 20 سبتمبر في القاهرة صالة 3"),
          L("MS958 次日 00:20 起飞", "MS958 departs 00:20 next day", "تقلع MS958 00:20 اليوم التالي"),
        ],
        entry: "flights",
      };
    }
    return {
      lines: [
        L("11:45 到开罗 T2", "11:45 at Cairo T2", "11:45 في القاهرة صالة 2"),
        L("3U3864 14:45 起飞", "3U3864 departs 14:45", "تقلع 3U3864 14:45"),
      ],
      entry: "flights",
    };
  }

  if (date === "2026-09-21") {
    if (group === "reham") {
      return {
        lines: [
          L("15:30 抵白云 T3", "15:30 at Baiyun T3", "15:30 في بايون صالة 3"),
          L("公司接机 · Rahma 对接", "Company pickup · via Rahma", "استقبال من الشركة · عبر Rahma"),
          L("车辆与时间待定", "Vehicle and time to be set", "المركبة والوقت لم يُحدَّدا"),
        ],
        entry: "flights",
        hidePending: true,
      };
    }
    return {
      lines: [
        L("10:25 抵白云 T2", "10:25 at Baiyun T2", "10:25 في بايون صالة 2"),
        L("成都中转 T1 → T2", "Chengdu transfer T1 → T2", "ترانزيت تشنغدو من صالة 1 إلى 2"),
        L("落地接送待确认", "Transfer into the city to confirm", "التنقل إلى المدينة بانتظار التأكيد"),
      ],
      entry: "flights",
      hidePending: true,
    };
  }

  if (date === "2026-09-28" || date === "2026-10-07") {
    if (group === "reham") {
      return {
        lines: [
          L("04:50 抵开罗 T3", "04:50 at Cairo T3", "04:50 في القاهرة صالة 3"),
          L("MS959", "MS959", "MS959"),
        ],
        entry: "flights",
      };
    }
    return {
      lines: [
        L("06:50 抵开罗 T2", "06:50 at Cairo T2", "06:50 في القاهرة صالة 2"),
        L("3U3863", "3U3863", "3U3863"),
      ],
      entry: "flights",
    };
  }

  if (date === "2026-10-06") {
    return {
      lines: [
        L("14:25 到白云 T2", "14:25 at Baiyun T2", "14:25 في بايون صالة 2"),
        L("返穗交通自理", "Travel back to Guangzhou self-arranged", "العودة إلى قوانغتشو ذاتية الترتيب"),
      ],
      entry: "flights",
    };
  }

  // 9/27：到机场时刻 / 航站楼 / 对接人常显；起飞时刻在弹窗里看完整航班。
  if (date === "2026-09-27") {
    if (group === "reham") {
      // 每行必须一行放得下：三语都短到不换行，否则 3 行会变 6 行。
      // 「公司送机」是已定的，待定的只有车和出发时间 —— 两件事分行写清楚。
      return {
        lines: [
          L("20:20 到白云 T3", "20:20 · Baiyun T3", "20:20 · بايون صالة 3"),
          L("公司送机｜Rahma", "Company · Rahma", "الشركة · Rahma"),
          L("车与出发时间待定", "Pickup time: TBC", "وقت الانطلاق: بانتظار"),
        ],
        entry: "flights",
        hidePending: true,
        coordination: [
          L(
            "送机由公司安排，Rahma 提前协调；具体车辆与出发时间待定。",
            "The company arranges the ride and Rahma coordinates it in advance; the vehicle and departure time are still to be set.",
            "ترتّب الشركة التوصيل وتنسّقه Rahma مسبقًا؛ والمركبة ووقت الانطلاق لم يُحدَّدا بعد.",
          ),
        ],
      };
    }
    if (group === "rahma") {
      return {
        lines: [
          L("14:25 到白云 T2", "14:25 at Baiyun T2", "14:25 في بايون صالة 2"),
          L("用车 Rahma 与董事长确认", "Rahma confirms the ride with the chairman", "تؤكّد Rahma التوصيل مع رئيس المجلس"),
        ],
        entry: "flights",
        hidePending: true,
        coordination: [
          L(
            "去机场的交通由 Rahma 向董事长确认，安排待定。",
            "Rahma confirms airport transport with the chairman; the arrangement is pending.",
            "تؤكّد Rahma تنقل المطار مع رئيس مجلس الإدارة؛ والترتيب لم يُحسم بعد.",
          ),
        ],
      };
    }
    if (group === "study") {
      return {
        lines: [
          L("14:25 到白云 T2", "14:25 at Baiyun T2", "14:25 في بايون صالة 2"),
          L("机场交通向 Rahma 确认", "Confirm airport transport with Rahma", "أكّد تنقل المطار مع Rahma"),
        ],
        entry: "flights",
        hidePending: true,
        coordination: [
          L(
            "同日的机场交通向 Rahma 确认，安排待定。",
            "Confirm the same-day airport transport with Rahma; the arrangement is pending.",
            "أكّد تنقل المطار في اليوم نفسه مع Rahma؛ والترتيب لم يُحسم بعد.",
          ),
        ],
      };
    }
  }

  if (group === "qiuting") {
    return {
      lines: [VENUE_TBD_LINE],
      entry: date === "2026-09-24" ? "transfer" : null,
      hidePending: true,
    };
  }

  if (group === "study") {
    if (date === "2026-09-24" || date === "2026-09-25") {
      return {
        lines: [
          L("巡店交通", "Store-visit transport", "تنقل زيارة المتاجر"),
          L("向 MINISO 中国区域负责人确认", "Confirm with the MINISO China lead", "أكّد مع مسؤول MINISO في الصين"),
        ],
        entry: null,
        hidePending: true,
      };
    }
    if (date === "2026-09-26") {
      return {
        lines: [
          CITY_SELF_LINE,
          L("从新酒店出发重新看时间", "Recheck times from the new hotel", "أعد حساب الوقت من الفندق الجديد"),
        ],
        entry: "transfer",
      };
    }
    return { lines: [VENUE_TBD_LINE], entry: null, hidePending: true };
  }

  if (group === "rahma") {
    if (date <= "2026-09-24") {
      return { lines: [VENUE_TBD_LINE], entry: null, hidePending: true };
    }
    return { lines: [CITY_SELF_LINE], entry: null };
  }

  // reham
  if (date === "2026-09-22") {
    return {
      lines: [
        VENUE_TBD_LINE,
        L("下午外出自理", "Afternoon outings self-arranged", "الخروج بعد الظهر ذاتي الترتيب"),
      ],
      entry: "transfer",
      hidePending: true,
    };
  }
  if (date === "2026-09-23" || date === "2026-09-24") {
    return { lines: [VENUE_TBD_LINE], entry: null, hidePending: true };
  }
  return { lines: [CITY_SELF_LINE], entry: null };
}

/* ------------------------------------------------------------------ */

export function cellView(
  field: Field,
  date: string,
  card: PersonDayCard,
): CellView {
  const group = groupKeyOf(card);
  switch (field) {
    case "lodging":
      return lodgingView(date, group);
    case "activity":
      return activityView(date, group, card);
    case "dining":
      return diningView(date, group);
    case "transport":
      return transportView(date, group);
  }
}
