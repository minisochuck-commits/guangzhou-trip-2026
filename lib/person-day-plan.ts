// 每人每天的四行安排：住宿 / 活动 / 餐饮 / 交通。
//
// 这是页面主体的唯一派生入口：给一个日期，返回若干张「人员小表」。
// Ahmed 与 Mohamed 同房同活动，合并成一张表；其余各自一张。
// Rahma 与 Reham 不是全程同行组，各走各的。
//
// 纪律：
//   - 未定就写「待定 / 待确认」，不写成已预订。
//   - 缺的信息不补：没给的就说没给（例如 Li/Qiuting 的离穗日期与城市）。
//   - 机场提前到达一律 3 小时（用户已定）；成都中转不再套 3 小时。

import type { CopyEntry, L10n, PersonId, Status } from "./trip-data";
import { CHENGDU_TRANSFER, INTERCONTINENTAL } from "./trip-data";
import { ARRIVAL_CHECKIN, EVENT_CHECKOUT, MORNING_22, ORDERING_22, PREORDER_DEADLINE, FINAL_ORDER_DEADLINE, TOUR_DETAIL } from "./meeting-guide";

export type Row = {
  status: Status;
  /** 一句摘要，始终可见。 */
  text: L10n;
  /** 细节，折叠。 */
  detail?: L10n[];
  /** 交通行下可展开的航班号（对应 trip-data 的 FLIGHTS.id）。 */
  flights?: string[];
  copy?: CopyEntry[];
};

export type PersonDayCard = {
  id: string;
  people: PersonId[];
  lodging: Row;
  activity: Row;
  dining: Row;
  transport: Row;
  /** 真正自由的日子才给自由行建议入口。 */
  freeTime?: boolean;
  /**
   * 这一天适合的路线 id。不给就是三条都合适；
   * 半天只有下午自由时，不要放需要一整个白天的路线。
   */
  freeRoutes?: string[];
};

export const DATES = [
  "2026-09-20",
  "2026-09-21",
  "2026-09-22",
  "2026-09-23",
  "2026-09-24",
  "2026-09-25",
  "2026-09-26",
  "2026-09-27",
  "2026-09-28",
  // Li/Qiuting 在中国的个人行程，补齐这七天，免得整段行程从日期导航上漏掉。
  "2026-09-29",
  "2026-09-30",
  "2026-10-01",
  "2026-10-02",
  "2026-10-03",
  "2026-10-04",
  "2026-10-05",
  "2026-10-06",
  "2026-10-07",
];

const STUDY: PersonId[] = ["ahmed", "hassan"];

const HOTEL_COPY: CopyEntry[] = [
  {
    id: "hotel-inline",
    // 这个 label 会拼进按钮文字：「复制酒店地址」/「Copy hotel address」/「نسخ عنوان الفندق」
    label: {
      zh: "酒店地址",
      en: "hotel address",
      ar: "عنوان الفندق",
    },
    chinese: INTERCONTINENTAL.chineseAddress,
  },
];

/**
 * 完整中文地址在三语里都保留原文 —— 复制按钮失效时还能直接手选给司机看，
 * 翻译过的地址司机读不了。
 */
const HOTEL_DETAIL: L10n[] = [
  {
    zh: `${INTERCONTINENTAL.chineseAddress}。`,
    en: `InterContinental Guangzhou Exhibition Center. In Chinese, to show a driver: ${INTERCONTINENTAL.chineseAddress}`,
    ar: `فندق إنتركونتيننتال قوانغتشو. وبالصينية لعرضه على السائق: ${INTERCONTINENTAL.chineseAddress}`,
  },
  INTERCONTINENTAL.checkInOut,
];

const NEW_HOTEL_DETAIL: L10n[] = [
  {
    zh: "酒店名称与地址待定，确认后补充。",
    en: "The hotel name and address are still to be set, and will be added once confirmed.",
    ar: "اسم الفندق وعنوانه لم يُحدَّدا بعد، وسيُضافان عند التأكيد.",
  },
  {
    zh: "换酒店后，出行时间要按新位置重新看导航。",
    en: "After moving hotels, check travel times again from the new location in your navigation app.",
    ar: "بعد تغيير الفندق، راجع أزمنة التنقل من الموقع الجديد في تطبيق الملاحة.",
  },
];

/* ---------------- 复用句 ---------------- */

const NO_HOTEL_PLANE: L10n = {
  zh: "当晚在飞机上，不住酒店。",
  en: "Overnight on the plane — no hotel.",
  ar: "المبيت على متن الطائرة — دون فندق.",
};

const NO_HOTEL_DEPART: L10n = {
  zh: "当日离境，不再新增一晚酒店。",
  en: "Departing today — no extra hotel night.",
  ar: "المغادرة اليوم — دون ليلة فندق إضافية.",
};

const TRIP_OVER: L10n = {
  zh: "本次行程结束。",
  en: "The trip ends here.",
  ar: "تنتهي الرحلة هنا.",
};

const HOME_IN_CHINA: L10n = {
  zh: "在中国的个人行程，住宿自行安排；离穗日期待定。",
  en: "Personal travel within China; accommodation is self-arranged and the date she leaves Guangzhou is still to be set.",
  ar: "برنامج شخصي داخل الصين؛ الإقامة مُرتَّبة ذاتيًا، وتاريخ مغادرتها قوانغتشو لم يُحدَّد بعد.",
};

const HOME_DETAIL: L10n[] = [
  {
    zh: "离开广州的具体日期待本人确定。",
    en: "The exact date she leaves Guangzhou is for her to decide.",
    ar: "تاريخ مغادرتها قوانغتشو تحدّده هي.",
  },
];

const MEALS_ONBOARD: L10n = {
  zh: "机场与机上餐食、特殊餐需求，请出发前向航空公司确认。",
  en: "Confirm airport and on-board catering, and any special meal needs, with the airline before departure.",
  ar: "أكّد خدمة الطعام في المطار وعلى متن الطائرة وأي متطلبات غذائية خاصة مع شركة الطيران قبل السفر.",
};

const MEALS_ARRIVAL_UNKNOWN: L10n = {
  zh: "抵达当天的用餐时间未明确，也没有指定餐厅。",
  en: "No meal times were given for arrival day, and no restaurant is named.",
  ar: "لم تُحدَّد أوقات الوجبات ليوم الوصول ولم يُذكر أي مطعم.",
};

const MEALS_COMPANY: L10n = {
  zh: "会议期间的餐食由公司安排。",
  en: "Meals during the sessions are arranged by the company.",
  ar: "وجبات فترة الجلسات ترتّبها الشركة.",
};

const MEALS_SELF: L10n = {
  zh: "自由期间的餐食自行安排。",
  en: "During free time, meals are self-arranged.",
  ar: "في الأوقات الحرة، تُرتَّب الوجبات ذاتيًا.",
};

/** 普通日子（不是「自由期间」）的自理餐食。 */
const MEALS_OWN: L10n = {
  zh: "餐食自行安排。",
  en: "Meals are self-arranged.",
  ar: "الوجبات تُرتَّب ذاتيًا.",
};

/** 学习日：当天自理，跟「自由期间」区分开。 */
const MEALS_OWN_TODAY: L10n = {
  zh: "当天餐食自行安排。",
  en: "Meals on this day are self-arranged.",
  ar: "وجبات هذا اليوم تُرتَّب ذاتيًا.",
};

/** 导出只是为了让展示层能按引用把它从每个格子的弹窗里滤掉；文案本身没动。 */
export const DIET_ASK: L10n = {
  zh: "有清真、过敏或忌口需求，请提前告知，并在点餐时问清食材与做法。",
  en: "If you need halal food or have allergies or other restrictions, say so in advance and ask about ingredients and preparation when ordering.",
  ar: "إن كنت تحتاج طعامًا حلالًا أو لديك حساسية أو قيود أخرى، فأخبرهم مسبقًا واسأل عن المكوّنات وطريقة الإعداد عند الطلب.",
};

/**
 * 用户确认：总部会议就在住宿酒店内开，参会日不需要往返用车。
 * 这是已定的事实，不是待定项 —— 所有参会日的交通一律 `row("confirmed", HOTEL_VENUE)`。
 */
const HOTEL_VENUE: L10n = {
  zh: "会议在住宿酒店内举行，不需要往返用车。",
  en: "The meeting is held inside the hotel where you are staying; no transport is needed.",
  ar: "يُعقد الاجتماع داخل الفندق الذي تقيم فيه؛ ولا حاجة إلى تنقل.",
};

/** 正式指引：MINISO 统一安排国际场巡店交通。 */
const OFFSITE_TOUR_TRANSPORT: L10n = {
  zh: "国际场巡店交通由 MINISO 统一安排。",
  en: "MINISO arranges transport for the international store tour.",
  ar: "تنظم MINISO النقل لجولة المتاجر الدولية.",
};

const CITY_SELF: L10n = {
  zh: "市内出行自行安排。",
  en: "Getting around the city is self-arranged.",
  ar: "التنقل داخل المدينة يُرتَّب ذاتيًا.",
};

const STUDY_TRANSPORT: L10n = {
  zh: "巡店当天的交通与接送，向 MINISO 广州区域负责人确认。",
  en: "Transport and pickups on store-visit days are to be confirmed with the MINISO Guangzhou regional lead.",
  ar: "التنقل والاستقبال في أيام زيارة المتاجر يُؤكَّد مع مسؤول منطقة MINISO في قوانغتشو.",
};

const REHAM_AIRPORT: L10n = {
  zh: "往返广州机场由公司安排，对接 Rahma；具体车辆与出发时间待定。",
  en: "Transfers to and from Guangzhou airport are arranged by the company and coordinated with Rahma; the vehicle and departure time are still to be set.",
  ar: "تُرتِّب الشركة التنقل من وإلى مطار قوانغتشو بالتنسيق مع Rahma؛ والمركبة ووقت الانطلاق لم يُحدَّدا بعد.",
};

const QIUTING_TRAVEL_SELF: L10n = {
  zh: "返乡与返回广州的交通自行安排。",
  en: "Travel home and back to Guangzhou is self-arranged.",
  ar: "السفر إلى البيت والعودة إلى قوانغتشو مُرتَّب ذاتيًا.",
};

const ARRIVAL_TRANSFER_TBD: L10n = {
  zh: "抵达后的市内接送、车辆与联系人待定。",
  en: "The transfer into the city after landing — vehicle and contact — is still to be arranged.",
  ar: "التنقل إلى المدينة بعد الهبوط، والمركبة وجهة الاتصال، لم يُرتَّب بعد.",
};

const STUDY_PLAN_TBD: L10n[] = [
  {
    zh: "具体课表、路线、门店与接送待 MINISO 中国团队确认。",
    en: "The timetable, route, which stores and the transfers are to be confirmed by the MINISO Guangzhou team.",
    ar: "الجدول والمسار والمتاجر والتنقلات يؤكّدها فريق MINISO في قوانغتشو.",
  },
];

const REHAM_TOUR: L10n = {
  zh: "13:50–17:30 参加国际场巡店，英语讲解；上午自由活动。",
  en: "13:50–17:30 international store tour in English; morning free.",
  ar: "13:50–17:30 جولة المتاجر الدولية باللغة الإنجليزية؛ الصباح حر.",
};

/* ---------------- 小工具 ---------------- */

function row(
  status: Status,
  text: L10n,
  extras: Omit<Row, "status" | "text"> = {},
): Row {
  return { status, text, ...extras };
}

/** 机场提前到达：用户已定统一 3 小时（成都中转不再另算）。 */
function beAtAirport(params: {
  clock: string;
  airportZh: string;
  airportEn: string;
  airportAr: string;
  flight: string;
  depart: string;
}): L10n {
  const { clock, airportZh, airportEn, airportAr, flight, depart } = params;
  return {
    zh: `建议 ${clock} 前抵达${airportZh}（${flight} ${depart} 起飞，按提前 3 小时安排）。`,
    en: `Be at ${airportEn} by ${clock} (${flight} departs ${depart}; three hours ahead, as agreed).`,
    ar: `يُنصح بالوصول إلى ${airportAr} قبل ${clock} (تقلع ${flight} الساعة ${depart}؛ بثلاث ساعات مسبقة حسب الاتفاق).`,
  };
}

const CAI_T2_1145 = beAtAirport({
  clock: "11:45",
  airportZh: "开罗机场 T2",
  airportEn: "Cairo Airport T2",
  airportAr: "مطار القاهرة الصالة 2",
  flight: "3U3864",
  depart: "14:45",
});

/** 跨零点，单独写：出发去机场是 9/20 当晚，不是 9/21 白天。 */
const CAI_T3_2120: L10n = {
  zh: "建议 9/20 当晚 21:20 前抵达开罗机场 T3（MS958 于 9/21 00:20 起飞，按提前 3 小时安排）。",
  en: "Be at Cairo Airport T3 by 21:20 on 20 Sep (MS958 departs 00:20 on 21 Sep; three hours ahead, as agreed).",
  ar: "يُنصح بالوصول إلى مطار القاهرة الصالة 3 قبل الساعة 21:20 مساء 20 سبتمبر (تقلع MS958 الساعة 00:20 يوم 21 سبتمبر؛ بثلاث ساعات مسبقة حسب الاتفاق).",
};

const CAN_T2_1425 = beAtAirport({
  clock: "14:25",
  airportZh: "广州白云 T2",
  airportEn: "Guangzhou Baiyun T2",
  airportAr: "قوانغتشو بايون الصالة 2",
  flight: "3U6704",
  depart: "17:25",
});

const MS958_NIGHT: L10n[] = [
  {
    zh: "MS958 在 9/21 00:20 起飞，属于次日凌晨 —— 要在 9/20 晚上就出发去机场。",
    en: "MS958 departs at 00:20 on 21 Sep, i.e. after midnight — so you leave for the airport on the evening of 20 Sep.",
    ar: "تقلع MS958 الساعة 00:20 يوم 21 سبتمبر، أي بعد منتصف الليل — لذا تتوجّه إلى المطار مساء 20 سبتمبر.",
  },
];

/* ---------------- 按日期派生 ---------------- */

function outboundDay20(): PersonDayCard[] {
  const flights = ["3U3864"];
  const common = {
    lodging: row("confirmed", NO_HOTEL_PLANE),
    dining: row("pending", MEALS_ONBOARD, { detail: [DIET_ASK] }),
    transport: row("confirmed", CAI_T2_1145, { flights, detail: [CHENGDU_TRANSFER] }),
  };
  const depart: L10n = {
    zh: "从开罗出发前往广州。",
    en: "Leaving Cairo for Guangzhou.",
    ar: "المغادرة من القاهرة إلى قوانغتشو.",
  };
  return [
    { id: "0920-qiuting", people: ["qiuting"], activity: row("confirmed", depart), ...common },
    { id: "0920-rahma", people: ["rahma"], activity: row("confirmed", depart), ...common },
    { id: "0920-study", people: STUDY, activity: row("confirmed", depart), ...common },
    {
      id: "0920-reham",
      people: ["reham"],
      lodging: row("confirmed", NO_HOTEL_PLANE),
      activity: row("confirmed", {
        zh: "前往开罗机场，搭乘 9/21 00:20 的夜间航班。",
        en: "Heading to Cairo Airport for the 00:20 night flight on 21 Sep.",
        ar: "التوجه إلى مطار القاهرة لرحلة الساعة 00:20 ليل 21 سبتمبر.",
      }),
      dining: row("pending", MEALS_ONBOARD, { detail: [DIET_ASK] }),
      transport: row("confirmed", CAI_T3_2120, {
        flights: ["MS958"],
        detail: MS958_NIGHT,
      }),
    },
  ];
}

function arrivalDay21(): PersonDayCard[] {
  const arrive: L10n = {
    zh: "抵达广州，报到。",
    en: "Arrive in Guangzhou and check in with the team.",
    ar: "الوصول إلى قوانغتشو والتسجيل مع الفريق.",
  };
  const sichuanTransport = row(
    "pending",
    {
      zh: "3U3864 于 05:10 抵成都天府，转 3U6701 08:00 出发，10:25 抵广州白云 T2。抵达后的市内接送待确认。",
      en: "3U3864 lands at Chengdu Tianfu 05:10; connect to 3U6701 at 08:00, arriving Guangzhou Baiyun T2 at 10:25. The transfer into the city after landing is still to be confirmed.",
      ar: "تهبط 3U3864 في تشنغدو تيانفو 05:10، ثم الربط مع 3U6701 الساعة 08:00 والوصول إلى قوانغتشو بايون الصالة 2 عند 10:25. أما التنقل إلى المدينة بعد الهبوط فلم يُؤكَّد بعد.",
    },
    { flights: ["3U3864", "3U6701"], detail: [CHENGDU_TRANSFER, ARRIVAL_TRANSFER_TBD] },
  );

  return [
    {
      id: "0921-qiuting",
      people: ["qiuting"],
      lodging: row(
        "confirmed",
        {
          zh: "广州保利洲际酒店，与 Rahma 同一间。",
          en: "InterContinental Guangzhou Exhibition Center, sharing a room with Rahma.",
          ar: "فندق إنتركونتيننتال قوانغتشو، في غرفة مشتركة مع Rahma.",
        },
        { detail: HOTEL_DETAIL, copy: HOTEL_COPY },
      ),
      activity: row("confirmed", arrive, { detail: [ARRIVAL_CHECKIN] }),
      dining: row("pending", MEALS_ARRIVAL_UNKNOWN, { detail: [DIET_ASK] }),
      transport: sichuanTransport,
    },
    {
      id: "0921-rahma",
      people: ["rahma"],
      lodging: row(
        "confirmed",
        {
          zh: "广州保利洲际酒店，与 Li/Qiuting 同一间。",
          en: "InterContinental Guangzhou Exhibition Center, sharing a room with Li/Qiuting.",
          ar: "فندق إنتركونتيننتال قوانغتشو، في غرفة مشتركة مع Li/Qiuting.",
        },
        { detail: HOTEL_DETAIL, copy: HOTEL_COPY },
      ),
      activity: row("confirmed", arrive, { detail: [ARRIVAL_CHECKIN] }),
      dining: row("pending", MEALS_ARRIVAL_UNKNOWN, { detail: [DIET_ASK] }),
      transport: sichuanTransport,
    },
    {
      id: "0921-study",
      people: STUDY,
      lodging: row(
        "confirmed",
        {
          zh: "广州保利洲际酒店，Ahmed 与 Mohamed 同一间。",
          en: "InterContinental Guangzhou Exhibition Center, Ahmed and Mohamed share a room.",
          ar: "فندق إنتركونتيننتال قوانغتشو، Ahmed و Mohamed في غرفة واحدة.",
        },
        { detail: HOTEL_DETAIL, copy: HOTEL_COPY },
      ),
      activity: row("confirmed", arrive, { detail: [ARRIVAL_CHECKIN] }),
      dining: row(
        "confirmed",
        {
          zh: "自报到起，餐食由公司安排。",
          en: "From check-in onwards, meals are arranged by the company.",
          ar: "ابتداءً من التسجيل، ترتّب الشركة الوجبات.",
        },
        {
          detail: [
            {
              zh: "当天具体的用餐时间未明确。",
              en: "The exact meal times for the day were not specified.",
              ar: "لم تُحدَّد أوقات الوجبات بدقة لهذا اليوم.",
            },
            DIET_ASK,
          ],
        },
      ),
      transport: sichuanTransport,
    },
    {
      id: "0921-reham",
      people: ["reham"],
      lodging: row(
        "confirmed",
        {
          zh: "广州保利洲际酒店，双人标间。",
          en: "InterContinental Guangzhou Exhibition Center, twin room.",
          ar: "فندق إنتركونتيننتال قوانغتشو، غرفة مزدوجة بسريرين.",
        },
        { detail: HOTEL_DETAIL, copy: HOTEL_COPY },
      ),
      activity: row("confirmed", arrive, { detail: [ARRIVAL_CHECKIN] }),
      dining: row("pending", MEALS_ARRIVAL_UNKNOWN, { detail: [DIET_ASK] }),
      transport: row(
        "pending",
        {
          zh: "MS958 于 15:30 抵达广州白云 T3。接机由公司安排，对接 Rahma；具体车辆与时间待定。",
          en: "MS958 lands at Guangzhou Baiyun T3 at 15:30. The pickup is arranged by the company and coordinated with Rahma; the vehicle and time are still to be set.",
          ar: "تهبط MS958 في قوانغتشو بايون الصالة 3 عند 15:30. والاستقبال ترتّبه الشركة بالتنسيق مع Rahma؛ والمركبة والوقت لم يُحدَّدا بعد.",
        },
        { flights: ["MS958"], detail: [REHAM_AIRPORT] },
      ),
    },
  ];
}

/* 9/22 – 9/24 的住宿都是洲际，抽出来复用。 */
function interconLodging(who: "qiuting" | "rahma" | "study" | "reham"): Row {
  if (who === "qiuting") {
    return row(
      "confirmed",
      {
        zh: "广州保利洲际酒店，与 Rahma 同一间。",
        en: "InterContinental Guangzhou Exhibition Center, sharing a room with Rahma.",
        ar: "فندق إنتركونتيننتال قوانغتشو، في غرفة مشتركة مع Rahma.",
      },
      { detail: HOTEL_DETAIL, copy: HOTEL_COPY },
    );
  }
  if (who === "rahma") {
    return row(
      "confirmed",
      {
        zh: "广州保利洲际酒店，与 Li/Qiuting 同一间。",
        en: "InterContinental Guangzhou Exhibition Center, sharing a room with Li/Qiuting.",
        ar: "فندق إنتركونتيننتال قوانغتشو، في غرفة مشتركة مع Li/Qiuting.",
      },
      { detail: HOTEL_DETAIL, copy: HOTEL_COPY },
    );
  }
  if (who === "study") {
    return row(
      "confirmed",
      {
        zh: "广州保利洲际酒店，Ahmed 与 Mohamed 同一间。",
        en: "InterContinental Guangzhou Exhibition Center, Ahmed and Mohamed share a room.",
        ar: "فندق إنتركونتيننتال قوانغتشو، Ahmed و Mohamed في غرفة واحدة.",
      },
      { detail: HOTEL_DETAIL, copy: HOTEL_COPY },
    );
  }
  return row(
    "confirmed",
    {
      zh: "广州保利洲际酒店，双人标间。",
      en: "InterContinental Guangzhou Exhibition Center, twin room.",
      ar: "فندق إنتركونتيننتال قوانغتشو، غرفة مزدوجة بسريرين.",
    },
    { detail: HOTEL_DETAIL, copy: HOTEL_COPY },
  );
}

function conferenceActivity(day: 22 | 23 | 24, orderingOwner = false): Row {
  const text: L10n = day === 22 ? {
    zh: "09:00签到，09:30–11:45会议；11:45–22:00新品订货。",
    en: "09:00 sign-in, 09:30–11:45 sessions; 11:45–22:00 product ordering.",
    ar: "09:00 التسجيل، 09:30–11:45 الجلسات؛ 11:45–22:00 طلب المنتجات.",
  } : day === 23 ? {
    zh: "09:00–22:00 新品订货会。",
    en: "09:00–22:00 product-ordering fair.",
    ar: "09:00–22:00 معرض طلب المنتجات.",
  } : {
    zh: "09:00–18:00 新品订货会。",
    en: "09:00–18:00 product-ordering fair.",
    ar: "09:00–18:00 معرض طلب المنتجات.",
  };
  const detail = day === 22 ? [...MORNING_22, ORDERING_22] : [];
  if (orderingOwner && day === 23) detail.push(PREORDER_DEADLINE);
  if (orderingOwner && day === 24) detail.push(FINAL_ORDER_DEADLINE);
  return row("confirmed", text, { detail });
}

function sessionsDay(dayIndex: 22 | 23): PersonDayCard[] {
  const key = `09${dayIndex}`;
  return [
    {
      id: `${key}-qiuting`,
      people: ["qiuting"],
      lodging: interconLodging("qiuting"),
      activity: conferenceActivity(dayIndex, true),
      dining: row("confirmed", MEALS_COMPANY, { detail: [DIET_ASK] }),
      transport: row("confirmed", HOTEL_VENUE),
    },
    {
      id: `${key}-rahma`,
      people: ["rahma"],
      lodging: interconLodging("rahma"),
      activity: conferenceActivity(dayIndex),
      dining: row("confirmed", MEALS_COMPANY, { detail: [DIET_ASK] }),
      transport: row("confirmed", HOTEL_VENUE),
    },
    {
      id: `${key}-study`,
      people: STUDY,
      lodging: interconLodging("study"),
      activity: conferenceActivity(dayIndex),
      dining: row("confirmed", {
        zh: "参会期间的餐食由公司安排。",
        en: "Meals while attending the sessions are arranged by the company.",
        ar: "وجبات فترة حضور الجلسات ترتّبها الشركة.",
      }, { detail: [DIET_ASK] }),
      transport: row("confirmed", HOTEL_VENUE),
    },
    dayIndex === 22
      ? {
          id: `${key}-reham`,
          people: ["reham"],
          lodging: interconLodging("reham"),
          activity: row("confirmed", {
            zh: "09:00签到，09:30–11:45参加总部会议；下午自由安排。",
            en: "09:00 sign-in, 09:30–11:45 HQ sessions; afternoon free.",
            ar: "09:00 التسجيل، 09:30–11:45 جلسات المقر؛ بعد الظهر حر.",
          }, { detail: MORNING_22 }),
          dining: row("confirmed", {
            zh: "会议餐由公司安排；下午外出自由活动时可以不参加。",
            en: "Session meals are arranged by the company; you do not have to join them if you go out in the afternoon.",
            ar: "وجبات الجلسات ترتّبها الشركة؛ ولستِ مضطرة للانضمام إن خرجتِ بعد الظهر.",
          }, { detail: [DIET_ASK] }),
          // 上午的会议在酒店内（已定）；下午自己外出的交通自理，也是已定的口径。
          transport: row("confirmed", {
            zh: "会议在住宿酒店内举行，不需要往返用车；下午自由外出的交通自行安排。",
            en: "The meeting is held inside the hotel where you are staying, so no transport is needed; getting around on your own in the afternoon is self-arranged.",
            ar: "يُعقد الاجتماع داخل الفندق الذي تقيمين فيه فلا حاجة إلى تنقل؛ أما التنقل بمفردك بعد الظهر فمُرتَّب ذاتيًا.",
          }),
          freeTime: true,
          // 只有下午自由：西关老城要占一整个白天，会跟上午的会议冲突，所以不给。
          freeRoutes: ["huangpu", "huacheng"],
        }
      : {
          id: `${key}-reham`,
          people: ["reham"],
          lodging: interconLodging("reham"),
          activity: row("confirmed", { zh: "全天自由活动。", en: "A free day.", ar: "يوم حر." }),
          dining: row("confirmed", {
            zh: "会议餐由公司安排；外出自由活动时可以不参加。",
            en: "Session meals are arranged by the company; you do not have to join them when you are out.",
            ar: "وجبات الجلسات ترتّبها الشركة؛ ولستِ مضطرة للانضمام عند الخروج.",
          }, { detail: [DIET_ASK] }),
          transport: row("confirmed", CITY_SELF),
          freeTime: true,
        },
  ];
}

function day24(): PersonDayCard[] {
  return [
    {
      id: "0924-qiuting",
      people: ["qiuting"],
      lodging: interconLodging("qiuting"),
      activity: conferenceActivity(24, true),
      dining: row("confirmed", MEALS_COMPANY, { detail: [DIET_ASK] }),
      // 会议在酒店内（已定）；返乡交通自理这条细节保留。
      transport: row("confirmed", HOTEL_VENUE, { detail: [QIUTING_TRAVEL_SELF] }),
    },
    {
      id: "0924-rahma",
      people: ["rahma"],
      lodging: interconLodging("rahma"),
      activity: conferenceActivity(24),
      dining: row("confirmed", MEALS_COMPANY, { detail: [DIET_ASK] }),
      transport: row("confirmed", HOTEL_VENUE),
    },
    {
      id: "0924-study",
      people: STUDY,
      lodging: interconLodging("study"),
      activity: row("pending", {
        zh: "由 MINISO 广州区域负责人带领巡店学习（第 1 天）。",
        en: "Store-visit training led by the MINISO Guangzhou regional lead (day 1).",
        ar: "تدريب زيارة المتاجر بقيادة مسؤول منطقة MINISO في قوانغتشو (اليوم 1).",
      }, { detail: STUDY_PLAN_TBD }),
      dining: row("confirmed", {
        zh: "从 9/24 起餐食自行安排。",
        en: "From 24 Sep onwards, meals are self-arranged.",
        ar: "ابتداءً من 24 سبتمبر، تُرتَّب الوجبات ذاتيًا.",
      }, { detail: [DIET_ASK] }),
      transport: row("pending", STUDY_TRANSPORT),
    },
    {
      id: "0924-reham",
      people: ["reham"],
      lodging: interconLodging("reham"),
      activity: row("confirmed", REHAM_TOUR, { detail: TOUR_DETAIL }),
      dining: row("confirmed", {
        zh: "会议餐由公司安排；外出自由活动时可以不参加。",
        en: "Session meals are arranged by the company; you do not have to join them when you are out.",
        ar: "وجبات الجلسات ترتّبها الشركة؛ ولستِ مضطرة للانضمام عند الخروج.",
      }, { detail: [DIET_ASK] }),
      transport: row("confirmed", OFFSITE_TOUR_TRANSPORT),
    },
  ];
}

const QIUTING_HOME_ACTIVITY: L10n = {
  zh: "会后返乡过中秋，属个人行程，不参加广州的会议、学习或接待安排。",
  en: "After the sessions she travels home for the Mid-Autumn holiday — personal time, not joining the sessions, training or hosting in Guangzhou.",
  ar: "بعد الجلسات تسافر إلى بيتها لعطلة منتصف الخريف — وقت شخصي، دون المشاركة في الجلسات أو التدريب أو الاستضافة في قوانغتشو.",
};

function qiutingHomeCard(id: string): PersonDayCard {
  return {
    id,
    people: ["qiuting"],
    lodging: row("pending", HOME_IN_CHINA, { detail: HOME_DETAIL }),
    activity: row("confirmed", QIUTING_HOME_ACTIVITY),
    dining: row("confirmed", MEALS_OWN),
    transport: row("pending", QIUTING_TRAVEL_SELF),
  };
}

const RAHMA_NEW_HOTEL: Row = {
  status: "pending",
  text: {
    zh: "公司另订酒店，单间；酒店名称与地址待定。",
    en: "The company books another hotel, single room; name and address are still to be set.",
    ar: "تحجز الشركة فندقًا آخر بغرفة مفردة؛ والاسم والعنوان لم يُحدَّدا بعد.",
  },
  detail: NEW_HOTEL_DETAIL,
};

const STUDY_NEW_HOTEL: Row = {
  status: "pending",
  text: {
    zh: "公司另订学习地点附近的酒店，Ahmed 与 Mohamed 同一间；酒店名称与地址待定。",
    en: "The company books a hotel near the training location; Ahmed and Mohamed share a room. Name and address are still to be set.",
    ar: "تحجز الشركة فندقًا قرب مكان التدريب؛ و Ahmed و Mohamed في غرفة واحدة. والاسم والعنوان لم يُحدَّدا بعد.",
  },
  detail: NEW_HOTEL_DETAIL,
};

const FREE_IN_GZ: L10n = {
  zh: "留在广州，自由安排。",
  en: "Staying in Guangzhou; the day is free.",
  ar: "البقاء في قوانغتشو؛ واليوم حر.",
};

function day25(): PersonDayCard[] {
  return [
    { ...qiutingHomeCard("0925-qiuting"), lodging: { ...qiutingHomeCard("0925-qiuting").lodging, detail: [EVENT_CHECKOUT, ...HOME_DETAIL] } },
    {
      id: "0925-rahma",
      people: ["rahma"],
      lodging: { ...RAHMA_NEW_HOTEL, detail: [EVENT_CHECKOUT, ...NEW_HOTEL_DETAIL] },
      activity: row("confirmed", FREE_IN_GZ),
      dining: row("confirmed", MEALS_SELF, { detail: [DIET_ASK] }),
      transport: row("confirmed", CITY_SELF),
      freeTime: true,
    },
    {
      id: "0925-study",
      people: STUDY,
      lodging: { ...STUDY_NEW_HOTEL, detail: [EVENT_CHECKOUT, ...NEW_HOTEL_DETAIL] },
      activity: row("pending", {
        zh: "由 MINISO 广州区域负责人带领巡店学习（第 2 天）。",
        en: "Store-visit training led by the MINISO Guangzhou regional lead (day 2).",
        ar: "تدريب زيارة المتاجر بقيادة مسؤول منطقة MINISO في قوانغتشو (اليوم 2).",
      }, { detail: STUDY_PLAN_TBD }),
      dining: row("confirmed", MEALS_OWN_TODAY, { detail: [DIET_ASK] }),
      transport: row("pending", STUDY_TRANSPORT),
    },
    {
      id: "0925-reham",
      people: ["reham"],
      lodging: interconLodging("reham"),
      activity: row("confirmed", {
        zh: "自由安排。",
        en: "A free day.",
        ar: "يوم حر.",
      }),
      dining: row("confirmed", MEALS_SELF, { detail: [DIET_ASK] }),
      transport: row("confirmed", CITY_SELF),
      freeTime: true,
    },
  ];
}

function day26(): PersonDayCard[] {
  const free: L10n = { zh: "自由活动。", en: "A free day.", ar: "يوم حر." };
  return [
    qiutingHomeCard("0926-qiuting"),
    {
      id: "0926-rahma",
      people: ["rahma"],
      lodging: RAHMA_NEW_HOTEL,
      activity: row("confirmed", FREE_IN_GZ),
      dining: row("confirmed", MEALS_SELF, { detail: [DIET_ASK] }),
      transport: row("confirmed", CITY_SELF),
      freeTime: true,
    },
    {
      id: "0926-study",
      people: STUDY,
      lodging: STUDY_NEW_HOTEL,
      activity: row("confirmed", free),
      dining: row("confirmed", MEALS_SELF, { detail: [DIET_ASK] }),
      transport: row("confirmed", CITY_SELF, {
        detail: [
          {
            zh: "从新酒店出发，出行时间要按新位置重新算。",
            en: "You start from the new hotel, so recalculate travel times from there.",
            ar: "تنطلق من الفندق الجديد، لذا أعد حساب أزمنة التنقل منه.",
          },
        ],
      }),
      freeTime: true,
    },
    {
      id: "0926-reham",
      people: ["reham"],
      lodging: interconLodging("reham"),
      activity: row("confirmed", free),
      dining: row("confirmed", MEALS_SELF, { detail: [DIET_ASK] }),
      transport: row("confirmed", CITY_SELF),
      freeTime: true,
    },
  ];
}

function day27(): PersonDayCard[] {
  const backToEgypt: L10n = {
    zh: "返回埃及。",
    en: "Returning to Egypt.",
    ar: "العودة إلى مصر.",
  };
  const returnFlights = ["3U6704-0927", "3U3863-0928"];
  return [
    qiutingHomeCard("0927-qiuting"),
    {
      id: "0927-rahma",
      people: ["rahma"],
      lodging: row("confirmed", NO_HOTEL_DEPART),
      activity: row("confirmed", backToEgypt),
      dining: row("confirmed", MEALS_SELF),
      transport: row("pending", {
        zh: "建议 14:25 前抵达广州白云 T2（3U6704 17:25 起飞，按提前 3 小时安排）。去机场的交通由 Rahma 向董事长确认，安排待定。",
        en: "Be at Guangzhou Baiyun T2 by 14:25 (3U6704 departs 17:25; three hours ahead, as agreed). Rahma confirms airport transport with the chairman; the arrangement is pending.",
        ar: "يُنصح بالوصول إلى قوانغتشو بايون الصالة 2 قبل 14:25 (تقلع 3U6704 الساعة 17:25؛ بثلاث ساعات مسبقة حسب الاتفاق). وتؤكّد Rahma تنقل المطار مع رئيس مجلس الإدارة؛ والترتيب لم يُحسم بعد.",
      }, {
        flights: returnFlights,
        detail: [CHENGDU_TRANSFER],
      }),
    },
    {
      id: "0927-study",
      people: STUDY,
      lodging: row("confirmed", NO_HOTEL_DEPART),
      activity: row("confirmed", backToEgypt),
      dining: row("confirmed", MEALS_SELF),
      transport: row("pending", {
        zh: "建议 14:25 前抵达广州白云 T2（3U6704 17:25 起飞，按提前 3 小时安排）。同日的机场交通向 Rahma 确认，安排待定。",
        en: "Be at Guangzhou Baiyun T2 by 14:25 (3U6704 departs 17:25; three hours ahead, as agreed). Confirm the same-day airport transport with Rahma; the arrangement is pending.",
        ar: "يُنصح بالوصول إلى قوانغتشو بايون الصالة 2 قبل 14:25 (تقلع 3U6704 الساعة 17:25؛ بثلاث ساعات مسبقة حسب الاتفاق). وأكّد تنقل المطار في اليوم نفسه مع Rahma؛ والترتيب لم يُحسم بعد.",
      }, {
        flights: returnFlights,
        detail: [CHENGDU_TRANSFER],
      }),
    },
    {
      id: "0927-reham",
      people: ["reham"],
      lodging: row("pending", {
        zh: "当日夜航离境，不再新增一晚酒店；行李寄存或延迟退房待确认。",
        en: "Departing on tonight's flight — no extra hotel night; luggage storage or a late check-out is still to be confirmed.",
        ar: "المغادرة على رحلة الليلة — دون ليلة فندق إضافية؛ وحفظ الأمتعة أو تمديد المغادرة لم يُؤكَّد بعد.",
      }, {
        detail: [
          {
            zh: "延迟退房要另行向酒店确认，不能假定免费。",
            en: "A late check-out has to be confirmed with the hotel separately and cannot be assumed free.",
            ar: "تمديد المغادرة يحتاج تأكيدًا منفصلًا من الفندق ولا يُفترض أنه مجاني.",
          },
        ],
      }),
      activity: row("confirmed", {
        zh: "白天在广州自由安排，夜间返回埃及。",
        en: "A free day in Guangzhou, flying back to Egypt at night.",
        ar: "يوم حر في قوانغتشو، والعودة إلى مصر ليلًا.",
      }, {
        detail: [
          {
            zh: "当天不建议远行，以休息、酒店附近散步和行李寄存为主。",
            en: "Not a day for going far — rest, a walk near the hotel and sorting luggage suit it better.",
            ar: "ليس يومًا للابتعاد — الراحة ونزهة قرب الفندق وترتيب الأمتعة أنسب.",
          },
        ],
      }),
      dining: row("confirmed", MEALS_SELF),
      transport: row("pending", {
        zh: "建议 20:20 前抵达广州白云 T3（MS959 23:20 起飞，按提前 3 小时安排）。送机由公司安排，Rahma 提前协调；具体车辆与出发时间待定。",
        en: "Be at Guangzhou Baiyun T3 by 20:20 (MS959 departs 23:20; three hours ahead, as agreed). The company arranges the ride and Rahma coordinates it in advance; the vehicle and departure time are still to be set.",
        ar: "يُنصح بالوصول إلى قوانغتشو بايون الصالة 3 قبل 20:20 (تقلع MS959 الساعة 23:20؛ بثلاث ساعات مسبقة حسب الاتفاق). وترتّب الشركة التوصيل وتنسّقه Rahma مسبقًا؛ والمركبة ووقت الانطلاق لم يُحدَّدا بعد.",
      }, {
        flights: ["MS959"],
      }),
    },
  ];
}

function day28(): PersonDayCard[] {
  return [
    qiutingHomeCard("0928-qiuting"),
    {
      id: "0928-rahma",
      people: ["rahma"],
      lodging: row("confirmed", TRIP_OVER),
      activity: row("confirmed", {
        zh: "抵达开罗。",
        en: "Arrive in Cairo.",
        ar: "الوصول إلى القاهرة.",
      }),
      dining: row("pending", MEALS_ONBOARD),
      transport: row("confirmed", {
        zh: "3U3863 于 06:50 抵达开罗 T2。",
        en: "3U3863 lands at Cairo T2 at 06:50.",
        ar: "تهبط 3U3863 في القاهرة الصالة 2 عند 06:50.",
      }, { flights: ["3U3863-0928"], detail: [CHENGDU_TRANSFER] }),
    },
    {
      id: "0928-study",
      people: STUDY,
      lodging: row("confirmed", TRIP_OVER),
      activity: row("confirmed", {
        zh: "抵达开罗。",
        en: "Arrive in Cairo.",
        ar: "الوصول إلى القاهرة.",
      }),
      dining: row("pending", MEALS_ONBOARD),
      transport: row("confirmed", {
        zh: "3U3863 于 06:50 抵达开罗 T2。",
        en: "3U3863 lands at Cairo T2 at 06:50.",
        ar: "تهبط 3U3863 في القاهرة الصالة 2 عند 06:50.",
      }, { flights: ["3U3863-0928"], detail: [CHENGDU_TRANSFER] }),
    },
    {
      id: "0928-reham",
      people: ["reham"],
      lodging: row("confirmed", TRIP_OVER),
      activity: row("confirmed", {
        zh: "抵达开罗。",
        en: "Arrive in Cairo.",
        ar: "الوصول إلى القاهرة.",
      }),
      dining: row("pending", MEALS_ONBOARD),
      transport: row("confirmed", {
        zh: "MS959 于 04:50 抵达开罗 T3。",
        en: "MS959 lands at Cairo T3 at 04:50.",
        ar: "تهبط MS959 في القاهرة الصالة 3 عند 04:50.",
      }, { flights: ["MS959"] }),
    },
  ];
}

function day1006(): PersonDayCard[] {
  return [
    {
      id: "1006-qiuting",
      people: ["qiuting"],
      lodging: row("confirmed", NO_HOTEL_PLANE),
      activity: row("confirmed", {
        zh: "从广州返回埃及。",
        en: "Flying from Guangzhou back to Egypt.",
        ar: "السفر من قوانغتشو عائدة إلى مصر.",
      }),
      dining: row("pending", MEALS_ONBOARD),
      transport: row("confirmed", CAN_T2_1425, {
        flights: ["3U6704-1006", "3U3863-1007"],
        detail: [QIUTING_TRAVEL_SELF, CHENGDU_TRANSFER],
      }),
    },
  ];
}

function day1007(): PersonDayCard[] {
  return [
    {
      id: "1007-qiuting",
      people: ["qiuting"],
      lodging: row("confirmed", TRIP_OVER),
      activity: row("confirmed", {
        zh: "抵达开罗。",
        en: "Arrive in Cairo.",
        ar: "الوصول إلى القاهرة.",
      }),
      dining: row("pending", MEALS_ONBOARD),
      transport: row("confirmed", {
        zh: "3U3863 于 06:50 抵达开罗 T2。",
        en: "3U3863 lands at Cairo T2 at 06:50.",
        ar: "تهبط 3U3863 في القاهرة الصالة 2 عند 06:50.",
      }, { flights: ["3U3863-1007"], detail: [CHENGDU_TRANSFER] }),
    },
  ];
}

/** 某一天的全部人员小表（未按人过滤）。 */
export function cardsFor(date: string): PersonDayCard[] {
  switch (date) {
    case "2026-09-20":
      return outboundDay20();
    case "2026-09-21":
      return arrivalDay21();
    case "2026-09-22":
      return sessionsDay(22);
    case "2026-09-23":
      return sessionsDay(23);
    case "2026-09-24":
      return day24();
    case "2026-09-25":
      return day25();
    case "2026-09-26":
      return day26();
    case "2026-09-27":
      return day27();
    case "2026-09-28":
      return day28();
    case "2026-09-29":
    case "2026-09-30":
    case "2026-10-01":
    case "2026-10-02":
    case "2026-10-03":
    case "2026-10-04":
    case "2026-10-05":
      return [qiutingHomeCard(`${date}-qiuting`)];
    case "2026-10-06":
      return day1006();
    case "2026-10-07":
      return day1007();
    default:
      return [];
  }
}

/** 顶部人员筛选：只留包含该人的小表。同房同行的表整张保留。 */
export function cardsForPerson(
  person: PersonId | null,
  date: string,
): PersonDayCard[] {
  const all = cardsFor(date);
  return person ? all.filter((card) => card.people.includes(person)) : all;
}

/** 该人有安排的日期。 */
export function datesForPerson(person: PersonId | null): string[] {
  if (!person) return DATES;
  return DATES.filter((date) => cardsForPerson(person, date).length > 0);
}
