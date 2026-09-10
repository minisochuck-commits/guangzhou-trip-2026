// 当天「吃住行」补充卡的派生逻辑。
//
// 用户明确否定了分开的「吃住行」tab：同一天要能直接看到活动、交通、餐饮、住宿。
// 这里不是把 LOGISTICS 整段复制到每一天，而是按 (日期 × 人员) 精确挑出适用的事实，
// 逐条引用 `logisticsLines()` 的原句，再补上当天特有的一两句。
//
// 纪律：
//   - 没有确切时刻就写「时间待定」，绝不编时刻。
//   - 没有具体酒店就写名称地址待确认，绝不给伪导航。
//   - 当天已经有真实事件覆盖的（9/21 两次接机、9/27 退房与送机交接、成都中转、行李额），
//     这里不再出一张重复的卡。
//   - QIUTING 9/25–10/5 是返乡阶段，不出广州酒店 / 会务餐 / 广州用车。
//   - 出行日（9/20、9/28、10/6、10/7）只给一句机场 / 机上餐食请出发前确认，不出假酒店。
//   - 客人是被接待的一方：用餐写「待接待人协调确认」，不给他们下「自行解决」的指令。

import {
  EVENTS,
  PEOPLE,
  PERSON_MAP,
  logisticsLines,
  type GroupId,
  type L10n,
  type PersonId,
  type Status,
} from "./trip-data";

export type SupplementKind = "dining" | "transport" | "lodging";

export type DaySupplement = {
  id: string;
  kind: SupplementKind;
  status: Status;
  people: PersonId[];
  title: L10n;
  /** 时间口径。多数是「时间待定」—— 不为了好看编时刻。 */
  timing: L10n;
  lines: L10n[];
};

/* ------------------------------------------------------------------ */
/* 人员与日期                                                          */
/* ------------------------------------------------------------------ */

function membersOf(group: GroupId): PersonId[] {
  return PEOPLE.filter((person) => person.group === group).map((p) => p.id);
}

const STUDY = membersOf("study");
const HOST = membersOf("host");
const MERCH = membersOf("merch");

/** 出行日：全天在路上，不产生广州的住宿 / 用车安排。 */
const TRAVEL_DAYS = new Set([
  "2026-09-20",
  "2026-09-28",
  "2026-10-06",
  "2026-10-07",
]);

/**
 * 出行日当天真正在飞或在赶飞机的人。
 * 只认当天的 flight / ground 事件，跨日的阶段性提示（例如 QIUTING 9/25–10/5 返乡）
 * 不算，否则她会被算进 9/28 的机场用餐里。
 */
function travellersOn(date: string): PersonId[] {
  const ids = new Set<PersonId>();
  for (const event of EVENTS) {
    if (event.date !== date) continue;
    if (event.kind !== "flight" && event.kind !== "ground") continue;
    for (const person of event.people) ids.add(person);
  }
  return PEOPLE.map((p) => p.id).filter((id) => ids.has(id));
}

/* ------------------------------------------------------------------ */
/* 复用句                                                              */
/* ------------------------------------------------------------------ */

const TIME_TBD: L10n = {
  zh: "时间待定",
  en: "Time to be set",
  ar: "الوقت غير محدد",
};

const TIME_BY_FLIGHT: L10n = {
  zh: "跟当天航班时刻走",
  en: "Follows the day's flight times",
  ar: "حسب مواعيد رحلات اليوم",
};

const TIME_NIGHTLY: L10n = {
  zh: "当晚",
  en: "Tonight",
  ar: "هذه الليلة",
};

/** 饮食需求还没收集 —— 引自 LOGISTICS `dining-needs` 第 1 句。 */
const DIET_NEEDS = logisticsLines("dining-needs")[0];
/** 会务餐是否供给待确认 —— 引自 `dining-meeting`。 */
const MEETING_MEALS = logisticsLines("dining-meeting")[0];
/** 学习日三餐建议与「一家都没订」—— 引自 `dining-suggested`。 */
const TRAINING_MEALS = logisticsLines("dining-suggested")[0];
const HOLIDAY_BOOKING = logisticsLines("dining-suggested")[1];
/** 每日接送集合时间 / 用车 / 司机待确认 —— 引自 `transport-daily`。 */
const DAILY_TRANSFER = logisticsLines("transport-daily")[0];
/** 同酒店不代表同房 —— 引自 `stay-study`。 */
const SAME_HOTEL = logisticsLines("stay-study")[0];
/** 酒店名称、地址与预算待确认 —— 引自 `stay-study`。 */
const HOTEL_UNNAMED = logisticsLines("stay-study")[1];
/** 是否含早餐待确认 —— 引自 `stay-rule`。 */
const BREAKFAST_TBD = logisticsLines("stay-rule")[2];
/** 离穗日期未定 —— 引自 `stay-qiuting`。 */
const QIUTING_NIGHTS = logisticsLines("stay-qiuting")[0];

const NO_NAV: L10n = {
  zh: "目的地及路线待确认。",
  en: "Destination and route to be confirmed.",
  ar: "الوجهة والمسار بانتظار التأكيد.",
};

/** 客人是被接待的一方，用餐由接待人协调 —— 不给他们下「自行解决」的指令。 */
const MEALS_WITH_HOST: L10n = {
  zh: "用餐安排待接待人协调确认；餐厅未定，尚未预订任何一家。",
  en: "Meals to be coordinated with the host; no restaurant is chosen and none has been booked.",
  ar: "تُنسَّق الوجبات مع المضيف؛ ولم يُختر أي مطعم ولم يُحجز أي منها.",
};

const PICKUP_POINTS_TBD: L10n = {
  zh: "上下车地点待确认。",
  en: "Pick-up and drop-off points are unconfirmed.",
  ar: "نقاط الركوب والنزول غير مؤكدة.",
};

/* ------------------------------------------------------------------ */
/* 卡片构造                                                            */
/* ------------------------------------------------------------------ */

function card(
  date: string,
  kind: SupplementKind,
  slug: string,
  status: Status,
  people: PersonId[],
  title: L10n,
  timing: L10n,
  lines: L10n[],
): DaySupplement {
  return { id: `${date}-${kind}-${slug}`, kind, status, people, title, timing, lines };
}

/* -------- 出行日 -------- */

function travelDining(date: string, people: PersonId[]): DaySupplement {
  return card(
    date,
    "dining",
    "travel",
    "pending",
    people,
    {
      zh: "机场与机上餐食",
      en: "Meals at the airport and on board",
      ar: "الوجبات في المطار وعلى متن الطائرة",
    },
    TIME_BY_FLIGHT,
    [
      {
        zh: "这一天在路上，餐食跟着航班走。机场及机上餐食供应与饮食需求，请出发前确认。",
        en: "You are travelling this day, so meals follow the flights. Please confirm airport and on-board catering, and any dietary needs, before departure.",
        ar: "أنت مسافر هذا اليوم، لذا تتبع الوجبات مواعيد الرحلات. يُرجى تأكيد خدمة الطعام في المطار وعلى متن الطائرة والمتطلبات الغذائية قبل السفر.",
      },
      DIET_NEEDS,
    ],
  );
}

/* -------- 抵达日 9/21 -------- */

function arrivalDining(date: string, people: PersonId[]): DaySupplement {
  return card(
    date,
    "dining",
    "arrival",
    "pending",
    people,
    {
      zh: "抵达当天用餐",
      en: "Meals on arrival day",
      ar: "وجبات يوم الوصول",
    },
    TIME_TBD,
    [
      {
        zh: "根据两批抵达时间（上午 T2、下午 T3）协调用餐；是否合餐、时间与餐厅待确认。",
        en: "Meals will be coordinated around the two arrival times (T2 in the morning, T3 in the afternoon); whether you eat together, when, and where are to be confirmed.",
        ar: "تُنسَّق الوجبات حسب وقتَي الوصول (الصالة 2 صباحًا والصالة 3 بعد الظهر)؛ وهل تكون الوجبة مشتركة ومتى وأين — بانتظار التأكيد.",
      },
      {
        zh: "餐厅未定，尚未预订任何一家。",
        en: "No restaurant is chosen and none has been booked.",
        ar: "لم يُختر أي مطعم ولم يُحجز أي منها.",
      },
      DIET_NEEDS,
    ],
  );
}

/* -------- 餐饮 -------- */

function sessionsDining(date: string, people: PersonId[], slug: string, title: L10n) {
  return card(date, "dining", slug, "pending", people, title, TIME_TBD, [
    MEETING_MEALS,
    MEALS_WITH_HOST,
    DIET_NEEDS,
  ]);
}

function trainingDining(date: string, people: PersonId[]): DaySupplement {
  const lines = [TRAINING_MEALS, BREAKFAST_TBD];
  // 中秋假期 9/25–27，只有落在假期里的那天才提订位建议。
  if (date >= "2026-09-25") lines.push(HOLIDAY_BOOKING);
  lines.push(DIET_NEEDS);
  return card(
    date,
    "dining",
    "training",
    "suggested",
    people,
    {
      zh: "学习日三餐（未预订）",
      en: "Meals on a training day (not booked)",
      ar: "وجبات يوم التدريب (غير محجوزة)",
    },
    TIME_TBD,
    lines,
  );
}

function freeDayDining(date: string, people: PersonId[]): DaySupplement {
  return card(
    date,
    "dining",
    "free",
    "pending",
    people,
    {
      zh: "自由活动日餐饮",
      en: "Meals on the free day",
      ar: "وجبات اليوم الحر",
    },
    TIME_TBD,
    [
      {
        zh: "当天没有安排好的餐厅，先定路线再定吃哪一顿、在哪吃。",
        en: "No restaurant is arranged; settle the route first, then decide which meal is where.",
        ar: "لا يوجد مطعم مُرتَّب؛ حدّد المسار أولًا ثم قرّر أي وجبة وأين.",
      },
      HOLIDAY_BOOKING,
      DIET_NEEDS,
    ],
  );
}

function hostDining(date: string, people: PersonId[]): DaySupplement {
  return card(
    date,
    "dining",
    "business",
    "pending",
    people,
    {
      zh: "商务活动期间餐饮",
      en: "Meals during business activities",
      ar: "الوجبات أثناء الأنشطة التجارية",
    },
    TIME_TBD,
    [
      {
        zh: "接待组 9/22–26 的商务日程尚未提供，餐饮跟着日程走，现在定不了。",
        en: "The hosting group's 22–26 Sep business schedule has not been provided, so meals follow it and cannot be fixed yet.",
        ar: "لم يُقدَّم برنامج عمل مجموعة الاستضافة من 22 إلى 26 سبتمبر، لذا تتبع الوجبات البرنامج ولا يمكن تثبيتها الآن.",
      },
      {
        zh: "餐厅未定，尚未预订任何一家。",
        en: "No restaurant is chosen and none has been booked.",
        ar: "لم يُختر أي مطعم ولم يُحجز أي منها.",
      },
      DIET_NEEDS,
    ],
  );
}

function departureDining(date: string, people: PersonId[]): DaySupplement {
  return card(
    date,
    "dining",
    "departure",
    "pending",
    people,
    {
      zh: "退房后用餐",
      en: "Meals after check-out",
      ar: "الوجبات بعد تسجيل المغادرة",
    },
    TIME_BY_FLIGHT,
    [
      {
        zh: "退房到登机之间的用餐安排待接待人协调确认。",
        en: "Meals between check-out and boarding to be coordinated with the host.",
        ar: "تُنسَّق الوجبات بين تسجيل المغادرة والصعود إلى الطائرة مع المضيف.",
      },
      {
        zh: "机场及机上餐食供应与饮食需求，请出发前确认。",
        en: "Please confirm airport and on-board catering, and any dietary needs, before departure.",
        ar: "يُرجى تأكيد خدمة الطعام في المطار وعلى متن الطائرة والمتطلبات الغذائية قبل السفر.",
      },
    ],
  );
}

/* -------- 用车 -------- */

function transportCard(
  date: string,
  slug: string,
  people: PersonId[],
  title: L10n,
  extra: L10n[],
): DaySupplement {
  return card(date, "transport", slug, "pending", people, title, TIME_TBD, [
    DAILY_TRANSFER,
    PICKUP_POINTS_TBD,
    ...extra,
  ]);
}

/* -------- 住宿 -------- */

function nightNumber(date: string): number {
  // 9/21 是第 1 晚。只在 9/21–9/26 调用。
  const day = Number(date.slice(-2));
  return day - 20;
}

function groupLodging(
  date: string,
  slug: string,
  people: PersonId[],
): DaySupplement {
  const n = nightNumber(date);
  const lines: L10n[] = [HOTEL_UNNAMED, SAME_HOTEL, BREAKFAST_TBD];
  if (date === "2026-09-26") {
    lines.push({
      zh: "这是最后一晚，次日 9/27 退房。",
      en: "This is the last night; check-out is on 27 Sep.",
      ar: "هذه آخر ليلة، وتسجيل المغادرة يوم 27 سبتمبر.",
    });
  }
  return card(
    date,
    "lodging",
    slug,
    "pending",
    people,
    {
      zh: `当晚住宿 · 第 ${n} 晚 / 共 6 晚`,
      en: `Tonight's hotel · night ${n} of 6`,
      ar: `فندق الليلة · الليلة ${n} من 6`,
    },
    TIME_NIGHTLY,
    lines,
  );
}

function qiutingLodging(date: string): DaySupplement {
  const lines: L10n[] = [HOTEL_UNNAMED, QIUTING_NIGHTS, BREAKFAST_TBD];
  if (date === "2026-09-24") {
    lines.push({
      zh: "9/24 之后是否继续住广州，取决于离穗日期，目前未定。",
      en: "Whether she stays in Guangzhou after 24 Sep depends on her departure date, which is not set.",
      ar: "بقاؤها في قوانغتشو بعد 24 سبتمبر يتوقف على تاريخ مغادرتها غير المحدد.",
    });
  }
  return card(
    date,
    "lodging",
    "qiuting",
    "pending",
    MERCH,
    {
      zh: "当晚住宿 · 住至离穗",
      en: "Tonight's hotel · until she leaves Guangzhou",
      ar: "فندق الليلة · حتى مغادرتها قوانغتشو",
    },
    TIME_NIGHTLY,
    lines,
  );
}

/* ------------------------------------------------------------------ */
/* 按日期派生                                                          */
/* ------------------------------------------------------------------ */

const VENUE_TRANSPORT: L10n = {
  zh: "会场准确地址与到场时间以总部通知为准。",
  en: "The venue address and arrival time follow the HQ notice.",
  ar: "عنوان المكان ووقت الوصول حسب إشعار المقر.",
};

const STORE_TRANSPORT: L10n = {
  zh: "门店准确街道、入口待确认。",
  en: "The store's exact street and entrance are to be confirmed.",
  ar: "الشارع الدقيق ومدخل المتجر بانتظار التأكيد.",
};

/**
 * 某一天的吃住行补充卡（未按人过滤）。
 * 9/29–10/5 返回空数组：那几天只有 QIUTING 的返乡阶段卡，没有广州安排。
 */
export function daySupplements(date: string): DaySupplement[] {
  if (TRAVEL_DAYS.has(date)) {
    const people = travellersOn(date);
    return people.length > 0 ? [travelDining(date, people)] : [];
  }

  const out: DaySupplement[] = [];

  switch (date) {
    case "2026-09-21":
      out.push(
        arrivalDining(date, [...MERCH, ...STUDY, ...HOST]),
        groupLodging(date, "study", STUDY),
        groupLodging(date, "host", HOST),
        qiutingLodging(date),
      );
      break;

    case "2026-09-22":
    case "2026-09-23":
      out.push(
        sessionsDining(date, STUDY, "sessions", {
          zh: "会议期间供餐",
          en: "Meals during the sessions",
          ar: "الوجبات أثناء الجلسات",
        }),
        sessionsDining(date, MERCH, "orderfair", {
          zh: "订货会期间供餐",
          en: "Meals during the Order Fair",
          ar: "الوجبات أثناء معرض الطلبيات",
        }),
        hostDining(date, HOST),
        transportCard(
          date,
          "venue",
          STUDY,
          {
            zh: "往返会场用车",
            en: "Cars to and from the venue",
            ar: "السيارات من وإلى مكان الفعالية",
          },
          [VENUE_TRANSPORT],
        ),
        transportCard(
          date,
          "orderfair",
          MERCH,
          {
            zh: "往返订货会用车",
            en: "Cars to and from the Order Fair",
            ar: "السيارات من وإلى معرض الطلبيات",
          },
          [VENUE_TRANSPORT],
        ),
        transportCard(
          date,
          "business",
          HOST,
          {
            zh: "商务活动用车",
            en: "Cars for business activities",
            ar: "سيارات الأنشطة التجارية",
          },
          [NO_NAV],
        ),
        groupLodging(date, "study", STUDY),
        groupLodging(date, "host", HOST),
        qiutingLodging(date),
      );
      break;

    case "2026-09-24":
      out.push(
        trainingDining(date, STUDY),
        card(
          date,
          "dining",
          "orderfair",
          "pending",
          MERCH,
          {
            zh: "订货会第 3 天餐饮",
            en: "Meals on Order Fair day 3",
            ar: "وجبات اليوم الثالث لمعرض الطلبيات",
          },
          TIME_TBD,
          [
            {
              zh: "总部通知 9/24 仅上午，本人是否参加尚未确认，用餐随之未定。",
              en: "The HQ notice makes 24 Sep morning-only and her attendance is unconfirmed, so meals are open too.",
              ar: "إشعار المقر يجعل 24 سبتمبر صباحًا فقط وحضورها غير مؤكد، لذا الوجبات غير محددة أيضًا.",
            },
            MEETING_MEALS,
            DIET_NEEDS,
          ],
        ),
        hostDining(date, HOST),
        transportCard(
          date,
          "store",
          STUDY,
          {
            zh: "往返门店用车",
            en: "Cars to and from the store",
            ar: "السيارات من وإلى المتجر",
          },
          [STORE_TRANSPORT],
        ),
        transportCard(
          date,
          "orderfair",
          MERCH,
          {
            zh: "当天用车",
            en: "Cars for the day",
            ar: "سيارات اليوم",
          },
          [
            {
              zh: "是否参加上午场未定；离穗日期与返乡交通也都未定。",
              en: "Whether she joins the morning session is undecided; her departure date and how she travels home are open too.",
              ar: "حضورها الجلسة الصباحية غير محسوم؛ وتاريخ مغادرتها ووسيلة عودتها إلى بيتها غير محددين أيضًا.",
            },
          ],
        ),
        transportCard(
          date,
          "business",
          HOST,
          {
            zh: "商务活动用车",
            en: "Cars for business activities",
            ar: "سيارات الأنشطة التجارية",
          },
          [NO_NAV],
        ),
        groupLodging(date, "study", STUDY),
        groupLodging(date, "host", HOST),
        qiutingLodging(date),
      );
      break;

    case "2026-09-25":
      out.push(
        trainingDining(date, STUDY),
        hostDining(date, HOST),
        transportCard(
          date,
          "store",
          STUDY,
          {
            zh: "往返门店用车",
            en: "Cars to and from the store",
            ar: "السيارات من وإلى المتجر",
          },
          [STORE_TRANSPORT],
        ),
        transportCard(
          date,
          "business",
          HOST,
          {
            zh: "商务活动用车",
            en: "Cars for business activities",
            ar: "سيارات الأنشطة التجارية",
          },
          [NO_NAV],
        ),
        groupLodging(date, "study", STUDY),
        groupLodging(date, "host", HOST),
      );
      break;

    case "2026-09-26":
      out.push(
        freeDayDining(date, STUDY),
        hostDining(date, HOST),
        transportCard(
          date,
          "free",
          STUDY,
          {
            zh: "自由活动路线与用车",
            en: "Route and cars for the free day",
            ar: "مسار اليوم الحر والسيارات",
          },
          [
            {
              zh: "出行方式、集合时间与返回时间都待确认。",
              en: "How you travel, when you meet and when you get back are all unconfirmed.",
              ar: "طريقة التنقل ووقت التجمع ووقت العودة — جميعها غير مؤكدة.",
            },
            NO_NAV,
          ],
        ),
        transportCard(
          date,
          "business",
          HOST,
          {
            zh: "商务活动用车",
            en: "Cars for business activities",
            ar: "سيارات الأنشطة التجارية",
          },
          [NO_NAV],
        ),
        groupLodging(date, "study", STUDY),
        groupLodging(date, "host", HOST),
      );
      break;

    case "2026-09-27":
      // 退房、送机时间、REHAM 的延迟退房 / 日间房、晚间陪同交接，
      // 当天的事件卡里已经写清楚了，这里不再重复，只补一张用餐卡。
      // REHAM 不在这张卡里：她下午到夜间的用餐属于「晚间送机接待人待确认」那张卡。
      out.push(departureDining(date, [...STUDY, "rahma"]));
      break;

    default:
      break;
  }

  return out;
}

const KIND_ORDER: Record<SupplementKind, number> = {
  dining: 0,
  transport: 1,
  lodging: 2,
};

/**
 * 当天补充卡，按当前查看对象过滤。
 * 同组同行的合并成一张卡（people 就是整组），个人视图里仍然显示整组名字。
 * 排序固定为 餐饮 → 用车 → 住宿，住宿垫底。
 */
export function daySupplementsFor(
  person: PersonId | null,
  date: string,
): DaySupplement[] {
  const all = daySupplements(date);
  const mine = person
    ? all.filter((item) => item.people.includes(person))
    : all;
  return [...mine].sort((a, b) => KIND_ORDER[a.kind] - KIND_ORDER[b.kind]);
}

/** 9/26 的城市体验建议只给学习组和全员看，返乡的 QIUTING 不该看到广州游玩。 */
export function showsCityIdeas(person: PersonId | null, date: string): boolean {
  if (date !== "2026-09-26") return false;
  if (!person) return true;
  return PERSON_MAP[person].group === "study";
}
