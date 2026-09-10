// 完整旅程：把票面上的单段航班拼成「到机场 → 第一段 → 中转 → 第二段 → 抵达」。
//
// 为什么要有这个：以前弹窗只渲染 Row 上挂的那几个航班 id，9/20 那天只挂了 3U3864，
// 于是出发日看不到成都之后还有一段；中转说明又是一段「去程 T1→T2、回程 T2→T1」
// 混在一起的抽象文字。现在**从任意一段所在的那一天进来，都能看到整条完整旅程**。
//
// 事实不在这里造：航段全部来自 `FLIGHTS` 的 id，中转的航站楼与停留时长由相邻两段的
// 票面时刻算出来，到机场时刻沿用 person-day-plan 里已确认的那几个时间。
// Reham 是直飞，旅程里只有一段，绝不能被拼上川航的航段。

import {
  AIRPORTS,
  FLIGHT_MAP,
  type AirportCode,
  type FlightPoint,
  type FlightSegment,
  type L10n,
  type Lang,
} from "./trip-data";

export type AirportReport = {
  iata: AirportCode;
  terminal: string;
  date: string;
  time: string;
};

export type Journey = {
  id: string;
  /** 按时间顺序的航段 id，对应 FLIGHTS.id。 */
  legIds: string[];
  /** 建议到机场的时刻（已确认口径：国际提前 3 小时）。 */
  report: AirportReport;
};

/**
 * 显式旅程表。用真实航段 id 区分同一航班号的不同日期
 * （3U6704 / 3U3863 有 9/27–28 和 10/6–7 两套）。
 */
export const JOURNEYS: Journey[] = [
  {
    id: "outbound-sichuan",
    legIds: ["3U3864", "3U6701"],
    report: { iata: "CAI", terminal: "T2", date: "2026-09-20", time: "11:45" },
  },
  {
    id: "outbound-ms958",
    legIds: ["MS958"],
    report: { iata: "CAI", terminal: "T3", date: "2026-09-20", time: "21:20" },
  },
  {
    id: "return-sichuan-0927",
    legIds: ["3U6704-0927", "3U3863-0928"],
    report: { iata: "CAN", terminal: "T2", date: "2026-09-27", time: "14:25" },
  },
  {
    id: "return-ms959",
    legIds: ["MS959"],
    report: { iata: "CAN", terminal: "T3", date: "2026-09-27", time: "20:20" },
  },
  {
    id: "return-sichuan-1006",
    legIds: ["3U6704-1006", "3U3863-1007"],
    report: { iata: "CAN", terminal: "T2", date: "2026-10-06", time: "14:25" },
  },
];

export function journeyForFlight(flightId: string): Journey | undefined {
  return JOURNEYS.find((journey) => journey.legIds.includes(flightId));
}

/** Row 上挂着哪几段，就解析成哪几条完整旅程（去重、保持出现顺序）。 */
export function journeysForFlights(flightIds: string[]): Journey[] {
  const out: Journey[] = [];
  for (const id of flightIds) {
    const journey = journeyForFlight(id);
    if (journey && !out.includes(journey)) out.push(journey);
  }
  return out;
}

export function legsOf(journey: Journey): FlightSegment[] {
  return journey.legIds
    .map((id) => FLIGHT_MAP[id])
    .filter((leg): leg is FlightSegment => Boolean(leg));
}

/* ------------------------------------------------------------------ */
/* 步骤                                                                */
/* ------------------------------------------------------------------ */

export type JourneyStep =
  | { kind: "report"; point: AirportReport }
  | { kind: "leg"; flight: FlightSegment; index: number; total: number }
  | {
      kind: "transfer";
      iata: AirportCode;
      arriveTerminal: string;
      departTerminal: string;
      arriveDate: string;
      arriveTime: string;
      departDate: string;
      departTime: string;
      minutes: number;
      /** 中转跨零点：到达和起飞不在同一天。 */
      overnight: boolean;
    }
  | { kind: "arrive"; point: FlightPoint };

function toMinutes(date: string, time: string): number {
  const [y, m, d] = date.split("-").map(Number);
  const [hh, mm] = time.split(":").map(Number);
  return Date.UTC(y, m - 1, d, hh, mm) / 60000;
}

/**
 * 中转停留时长。到达和起飞在同一个机场，时区相同，所以直接算分钟差即可，
 * 不需要时区换算。
 */
export function transferMinutes(arrival: FlightPoint, departure: FlightPoint): number {
  return (
    toMinutes(departure.date, departure.time) -
    toMinutes(arrival.date, arrival.time)
  );
}

export function journeySteps(journey: Journey): JourneyStep[] {
  const legs = legsOf(journey);
  if (legs.length === 0) return [];

  const steps: JourneyStep[] = [{ kind: "report", point: journey.report }];

  legs.forEach((leg, index) => {
    steps.push({ kind: "leg", flight: leg, index, total: legs.length });
    const next = legs[index + 1];
    if (!next) return;
    steps.push({
      kind: "transfer",
      iata: leg.to.iata,
      arriveTerminal: leg.to.terminal,
      departTerminal: next.from.terminal,
      arriveDate: leg.to.date,
      arriveTime: leg.to.time,
      departDate: next.from.date,
      departTime: next.from.time,
      minutes: transferMinutes(leg.to, next.from),
      overnight: leg.to.date !== next.from.date,
    });
  });

  steps.push({ kind: "arrive", point: legs[legs.length - 1].to });
  return steps;
}

/* ------------------------------------------------------------------ */
/* 文案                                                                */
/* ------------------------------------------------------------------ */

/** 中转条上的紧凑时长：2 小时 50 分 / 2h 50m / 2 س 50 د。 */
export function shortDuration(minutes: number): L10n {
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return {
    zh: rest ? `${hours} 小时 ${rest} 分` : `${hours} 小时`,
    en: rest ? `${hours}h ${rest}m` : `${hours}h`,
    ar: rest ? `${hours} س ${rest} د` : `${hours} س`,
  };
}

/** 「成都天府中转」这样的短标签。 */
export function transferCityLabel(iata: AirportCode, lang: Lang): string {
  const city = AIRPORTS[iata].city[lang];
  if (lang === "zh") return `${city}中转`;
  if (lang === "en") return `${city} transfer`;
  return `ترانزيت ${city}`;
}

export function durationLabel(minutes: number): L10n {
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return {
    zh: rest ? `停留 ${hours} 小时 ${rest} 分` : `停留 ${hours} 小时`,
    en: rest ? `${hours}h ${rest}m stop` : `${hours}h stop`,
    ar: rest ? `توقف ${hours} س ${rest} د` : `توقف ${hours} س`,
  };
}

function flightCount(total: number): L10n {
  return {
    zh: `${total} 段航班`,
    en: total === 1 ? "1 flight" : `${total} flights`,
    ar: total === 2 ? "رحلتان" : total === 1 ? "رحلة واحدة" : `${total} رحلات`,
  };
}

/** 旅程抬头：起点 → 中转 → 终点 ｜ N 段航班（直飞就写直飞）。 */
export function routeHeadline(journey: Journey, lang: Lang): string {
  const legs = legsOf(journey);
  if (legs.length === 0) return "";
  const from = AIRPORTS[legs[0].from.iata].city[lang];
  const to = AIRPORTS[legs[legs.length - 1].to.iata].city[lang];
  const arrow = lang === "ar" ? "←" : "→";
  const sep = lang === "zh" ? " ｜ " : " · ";

  const middle = legs.slice(0, -1).map((leg) => {
    const city = AIRPORTS[leg.to.iata].city[lang];
    if (lang === "zh") return `${city}中转`;
    if (lang === "en") return `transfer at ${city}`;
    return `ترانزيت في ${city}`;
  });

  const path = [from, ...middle, to].join(` ${arrow} `);

  if (legs.length === 1) {
    const direct =
      lang === "zh" ? "直飞" : lang === "en" ? "direct" : "مباشرة";
    return `${path}${sep}${direct}`;
  }
  return `${path}${sep}${flightCount(legs.length)[lang]}`;
}
