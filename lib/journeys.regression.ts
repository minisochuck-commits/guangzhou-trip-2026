// 完整旅程的回归断言。用 `node scripts/check-journeys.mjs` 跑（esbuild 打包后执行）。
//
// 覆盖：
//   1. 去程任意一天进来（9/20 / 9/21）拿到的是同一条完整旅程，两段航班。
//   2. 航段数、时刻、航站楼与票面一致；回程跨零点的中转算得对。
//   3. Reham 直飞不被拼上川航航段。
//   4. 事实没被改：FLIGHTS 的时刻 / 航站楼 / 人员与基线一致。

import { FLIGHT_MAP, FLIGHTS } from "./trip-data";
import {
  JOURNEYS,
  journeySteps,
  journeyForFlight,
  journeysForFlights,
  legsOf,
  transferMinutes,
} from "./journeys";

export type CheckResult = { name: string; ok: boolean; detail: string };

function check(name: string, ok: boolean, detail = ""): CheckResult {
  return { name, ok, detail };
}

function legIdsFor(flightIds: string[]): string[] {
  return journeysForFlights(flightIds).flatMap((journey) => journey.legIds);
}

export function runJourneyChecks(): CheckResult[] {
  const results: CheckResult[] = [];

  /* ---- 1. 两天进来同一条旅程 ---- */

  // 9/20 那天 Row 上只挂了第一段；9/21 挂了两段。结果必须一样。
  const fromSep20 = legIdsFor(["3U3864"]);
  const fromSep21 = legIdsFor(["3U3864", "3U6701"]);
  results.push(
    check(
      "去程：9/20 只挂 3U3864 也能拿到完整两段",
      JSON.stringify(fromSep20) === JSON.stringify(["3U3864", "3U6701"]),
      JSON.stringify(fromSep20),
    ),
  );
  results.push(
    check(
      "去程：9/20 与 9/21 拿到同一条旅程",
      JSON.stringify(fromSep20) === JSON.stringify(fromSep21),
      `${JSON.stringify(fromSep20)} vs ${JSON.stringify(fromSep21)}`,
    ),
  );

  // 回程同理：9/28 只挂第二段，也要看到 9/27 的第一段。
  const fromSep28 = legIdsFor(["3U3863-0928"]);
  results.push(
    check(
      "回程：9/28 只挂 3U3863-0928 也能拿到 9/27 起飞的那一段",
      JSON.stringify(fromSep28) ===
        JSON.stringify(["3U6704-0927", "3U3863-0928"]),
      JSON.stringify(fromSep28),
    ),
  );

  // Li/Qiuting 10/6–10/7 是另一套航段 id，不能串到 9/27 那套。
  const fromOct7 = legIdsFor(["3U3863-1007"]);
  results.push(
    check(
      "Li/Qiuting 回程用 10/6–10/7 的航段 id，不串到 9/27 那套",
      JSON.stringify(fromOct7) ===
        JSON.stringify(["3U6704-1006", "3U3863-1007"]),
      JSON.stringify(fromOct7),
    ),
  );

  /* ---- 2. 步骤、时刻、中转 ---- */

  const outbound = journeyForFlight("3U3864");
  const outboundSteps = outbound ? journeySteps(outbound) : [];
  results.push(
    check(
      "去程 5 步：到机场 / 第 1 段 / 中转 / 第 2 段 / 抵达",
      outboundSteps.length === 5 &&
        outboundSteps.map((step) => step.kind).join(",") ===
          "report,leg,transfer,leg,arrive",
      outboundSteps.map((step) => step.kind).join(","),
    ),
  );
  results.push(
    check(
      "去程到机场：9/20 11:45 CAI T2",
      outbound?.report.date === "2026-09-20" &&
        outbound?.report.time === "11:45" &&
        outbound?.report.iata === "CAI" &&
        outbound?.report.terminal === "T2",
      JSON.stringify(outbound?.report),
    ),
  );

  const outboundTransfer = outboundSteps.find(
    (step) => step.kind === "transfer",
  );
  results.push(
    check(
      "去程中转：成都 T1 → T2，停留 170 分钟，不跨零点",
      outboundTransfer?.kind === "transfer" &&
        outboundTransfer.iata === "TFU" &&
        outboundTransfer.arriveTerminal === "T1" &&
        outboundTransfer.departTerminal === "T2" &&
        outboundTransfer.minutes === 170 &&
        outboundTransfer.overnight === false,
      JSON.stringify(outboundTransfer),
    ),
  );

  const returnJourney = journeyForFlight("3U6704-0927");
  const returnTransfer = (returnJourney ? journeySteps(returnJourney) : []).find(
    (step) => step.kind === "transfer",
  );
  results.push(
    check(
      "回程中转跨零点：成都 T2 → T1，9/27 19:25 到、9/28 01:25 飞，停留 360 分钟",
      returnTransfer?.kind === "transfer" &&
        returnTransfer.arriveTerminal === "T2" &&
        returnTransfer.departTerminal === "T1" &&
        returnTransfer.arriveDate === "2026-09-27" &&
        returnTransfer.departDate === "2026-09-28" &&
        returnTransfer.minutes === 360 &&
        returnTransfer.overnight === true,
      JSON.stringify(returnTransfer),
    ),
  );

  results.push(
    check(
      "回程到机场：9/27 14:25 CAN T2",
      returnJourney?.report.date === "2026-09-27" &&
        returnJourney?.report.time === "14:25" &&
        returnJourney?.report.iata === "CAN" &&
        returnJourney?.report.terminal === "T2",
      JSON.stringify(returnJourney?.report),
    ),
  );

  /* ---- 3. Reham 直飞不被拼段 ---- */

  for (const [flightId, report] of [
    ["MS958", { date: "2026-09-20", time: "21:20", iata: "CAI", terminal: "T3" }],
    ["MS959", { date: "2026-09-27", time: "20:20", iata: "CAN", terminal: "T3" }],
  ] as const) {
    const journey = journeyForFlight(flightId);
    const legs = journey ? legsOf(journey) : [];
    const steps = journey ? journeySteps(journey) : [];
    results.push(
      check(
        `${flightId} 仍是直飞：1 段、无中转步骤`,
        legs.length === 1 &&
          legs[0].id === flightId &&
          steps.every((step) => step.kind !== "transfer"),
        `legs=${legs.map((leg) => leg.id).join(",")} steps=${steps
          .map((step) => step.kind)
          .join(",")}`,
      ),
    );
    results.push(
      check(
        `${flightId} 到机场：${report.date} ${report.time} ${report.iata} ${report.terminal}`,
        journey?.report.date === report.date &&
          journey?.report.time === report.time &&
          journey?.report.iata === report.iata &&
          journey?.report.terminal === report.terminal,
        JSON.stringify(journey?.report),
      ),
    );
  }

  results.push(
    check(
      "Reham 的旅程里没有任何川航航段",
      journeysForFlights(["MS958", "MS959"])
        .flatMap(legsOf)
        .every((leg) => leg.baggage === "egyptairBusiness"),
      "混进了川航航段",
    ),
  );

  /* ---- 4. 事实没被改 ---- */

  const baseline: Record<string, string> = {
    "3U3864": "CAI/T2/2026-09-20/14:45→TFU/T1/2026-09-21/05:10",
    "3U6701": "TFU/T2/2026-09-21/08:00→CAN/T2/2026-09-21/10:25",
    MS958: "CAI/T3/2026-09-21/00:20→CAN/T3/2026-09-21/15:30",
    "3U6704-0927": "CAN/T2/2026-09-27/17:25→TFU/T2/2026-09-27/19:25",
    "3U3863-0928": "TFU/T1/2026-09-28/01:25→CAI/T2/2026-09-28/06:50",
    MS959: "CAN/T3/2026-09-27/23:20→CAI/T3/2026-09-28/04:50",
    "3U6704-1006": "CAN/T2/2026-10-06/17:25→TFU/T2/2026-10-06/19:25",
    "3U3863-1007": "TFU/T1/2026-10-07/01:25→CAI/T2/2026-10-07/06:50",
  };

  results.push(
    check("航段仍是 8 段", FLIGHTS.length === 8, `实际 ${FLIGHTS.length}`),
  );

  for (const [id, expected] of Object.entries(baseline)) {
    const flight = FLIGHT_MAP[id];
    const actual = flight
      ? `${flight.from.iata}/${flight.from.terminal}/${flight.from.date}/${flight.from.time}→${flight.to.iata}/${flight.to.terminal}/${flight.to.date}/${flight.to.time}`
      : "missing";
    results.push(check(`${id} 票面未被改动`, actual === expected, actual));
  }

  /* ---- 5. 每条旅程都能算出中转（相邻两段必须同一机场） ---- */

  for (const journey of JOURNEYS) {
    const legs = legsOf(journey);
    const linked = legs.every(
      (leg, index) =>
        index === legs.length - 1 || leg.to.iata === legs[index + 1].from.iata,
    );
    const positive = legs.every(
      (leg, index) =>
        index === legs.length - 1 ||
        transferMinutes(leg.to, legs[index + 1].from) > 0,
    );
    results.push(
      check(
        `${journey.id} 航段首尾相接且中转时长为正`,
        legs.length > 0 && linked && positive,
        `legs=${legs.length} linked=${linked} positive=${positive}`,
      ),
    );
  }

  return results;
}
