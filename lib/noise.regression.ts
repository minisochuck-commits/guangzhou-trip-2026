// 降噪与口径的回归断言。用 `node scripts/check-noise.mjs` 跑。
//
// 覆盖本轮四条要求：
//   1. 完整航程只挂出发日；抵达日不重复同一个航班弹窗，但保留抵达时刻与接机协调。
//   2. 餐饮格没有弹窗按钮，日程里不出现游玩 / 美食建议。
//   3. 9/22–24 参会日交通是「酒店内参会」；国际巡店由 MINISO 统一交通；专项学习交通待确认。
//   4. Reham 9/21–26 是双人标间；Rahma 9/25–26 仍是单间。

import { cardsFor } from "./person-day-plan";
import { cellView, groupKeyOf, type Field, type GroupKey } from "./plan-presentation";

export type CheckResult = { name: string; ok: boolean; detail: string };

function check(name: string, ok: boolean, detail = ""): CheckResult {
  return { name, ok, detail };
}

function cardOf(date: string, group: GroupKey) {
  return cardsFor(date).find((item) => groupKeyOf(item) === group);
}

function viewOf(date: string, group: GroupKey, field: Field) {
  const card = cardOf(date, group);
  return card ? cellView(field, date, card) : undefined;
}

/** 事实层的那一行本身（status + 原文），不是压过的展示短句。 */
function rowOf(date: string, group: GroupKey, field: Field) {
  return cardOf(date, group)?.[field];
}

function zhLines(date: string, group: GroupKey, field: Field): string {
  return (viewOf(date, group, field)?.lines ?? []).map((l) => l.zh).join(" / ");
}

const ALL_DATES = [
  "2026-09-20", "2026-09-21", "2026-09-22", "2026-09-23", "2026-09-24",
  "2026-09-25", "2026-09-26", "2026-09-27", "2026-09-28", "2026-09-29",
  "2026-09-30", "2026-10-01", "2026-10-02", "2026-10-03", "2026-10-04",
  "2026-10-05", "2026-10-06", "2026-10-07",
];

const FIELDS: Field[] = ["lodging", "activity", "dining", "transport"];

export function runNoiseChecks(): CheckResult[] {
  const results: CheckResult[] = [];

  /* ---- 1. 航班弹窗只在出发日 ---- */

  const departures: [string, GroupKey][] = [
    ["2026-09-20", "qiuting"],
    ["2026-09-20", "rahma"],
    ["2026-09-20", "study"],
    ["2026-09-20", "reham"],
    ["2026-09-27", "rahma"],
    ["2026-09-27", "study"],
    ["2026-09-27", "reham"],
    ["2026-10-06", "qiuting"],
  ];
  for (const [date, group] of departures) {
    const view = viewOf(date, group, "transport");
    results.push(
      check(
        `${date} ${group} 出发日保留完整航班弹窗`,
        view?.entry === "flights" && !view?.hideJourney,
        `entry=${view?.entry} hideJourney=${view?.hideJourney}`,
      ),
    );
  }

  const arrivals: [string, GroupKey][] = [
    ["2026-09-21", "qiuting"],
    ["2026-09-21", "rahma"],
    ["2026-09-21", "study"],
    ["2026-09-21", "reham"],
    ["2026-09-28", "rahma"],
    ["2026-09-28", "study"],
    ["2026-09-28", "reham"],
    ["2026-10-07", "qiuting"],
  ];
  for (const [date, group] of arrivals) {
    const view = viewOf(date, group, "transport");
    results.push(
      check(
        `${date} ${group} 抵达日不重复航班弹窗`,
        view?.hideJourney === true && view?.entry !== "flights",
        `entry=${view?.entry} hideJourney=${view?.hideJourney}`,
      ),
    );
  }

  // 抵达日仍要看得到抵达时刻 / 航站楼与接机协调
  results.push(
    check(
      "9/21 四人保留抵达时刻与落地接送待确认",
      zhLines("2026-09-21", "study", "transport").includes("10:25 抵白云 T2") &&
        zhLines("2026-09-21", "study", "transport").includes("落地接送待确认"),
      zhLines("2026-09-21", "study", "transport"),
    ),
  );
  results.push(
    check(
      "9/21 Reham 保留抵达时刻与公司接机对接",
      zhLines("2026-09-21", "reham", "transport").includes("15:30 抵白云 T3") &&
        zhLines("2026-09-21", "reham", "transport").includes("Rahma"),
      zhLines("2026-09-21", "reham", "transport"),
    ),
  );

  /* ---- 2. 餐饮无按钮；日程无游玩 / 美食建议 ---- */

  const groups: GroupKey[] = ["qiuting", "rahma", "study", "reham"];
  let diningEntries = 0;
  let routeEntries = 0;
  for (const date of ALL_DATES) {
    for (const card of cardsFor(date)) {
      for (const field of FIELDS) {
        const view = cellView(field, date, card);
        if (field === "dining" && view.entry !== null) diningEntries += 1;
        if (view.entry === "routes") routeEntries += 1;
      }
    }
  }
  results.push(
    check("餐饮格一个弹窗按钮都没有", diningEntries === 0, `实际 ${diningEntries} 个`),
  );
  results.push(
    check("日程里没有游玩路线入口", routeEntries === 0, `实际 ${routeEntries} 个`),
  );

  // 真实排好的巡店必须留着（含它的协调入口）
  for (const [date, group] of [
    ["2026-09-24", "study"],
    ["2026-09-25", "study"],
    ["2026-09-24", "reham"],
  ] as [string, GroupKey][]) {
    results.push(
      check(
        `${date} ${group} 巡店安排保留`,
        viewOf(date, group, "activity")?.entry === "storeVisit",
        String(viewOf(date, group, "activity")?.entry),
      ),
    );
  }

  /* ---- 3. 参会日交通 = 酒店内参会 ---- */

  const hotelVenue: [string, GroupKey][] = [
    ["2026-09-22", "qiuting"],
    ["2026-09-23", "qiuting"],
    ["2026-09-24", "qiuting"],
    ["2026-09-22", "rahma"],
    ["2026-09-23", "rahma"],
    ["2026-09-24", "rahma"],
    ["2026-09-22", "study"],
    ["2026-09-23", "study"],
    ["2026-09-22", "reham"],
  ];
  for (const [date, group] of hotelVenue) {
    results.push(
      check(
        `${date} ${group} 交通写「酒店内参会」`,
        zhLines(date, group, "transport").includes("酒店内参会"),
        zhLines(date, group, "transport"),
      ),
    );
    // 事实层也必须是已定，不能还挂着 pending 的「往返会场用车待定」
    const factRow = rowOf(date, group, "transport");
    results.push(
      check(
        `${date} ${group} 事实层交通 = confirmed + 酒店内举行`,
        factRow?.status === "confirmed" &&
          factRow.text.zh.includes("住宿酒店内") &&
          factRow.text.en.includes("inside the hotel") &&
          factRow.text.ar.includes("داخل الفندق"),
        `${factRow?.status} / ${factRow?.text.zh}`,
      ),
    );
  }

  // 全站不能再有旧的「往返会场用车待定」
  {
    let stale = 0;
    for (const date of ALL_DATES) {
      for (const card of cardsFor(date)) {
        if (card.transport.text.zh.includes("往返会场")) stale += 1;
      }
    }
    results.push(check("旧的「往返会场用车待定」已全部清除", stale === 0, `残留 ${stale} 条`));
  }

  // Li/Qiuting 9/24 的返乡交通自理细节要留着
  results.push(
    check(
      "9/24 Li/Qiuting 保留返乡交通自理细节",
      (rowOf("2026-09-24", "qiuting", "transport")?.detail ?? []).some((item) =>
        item.zh.includes("返乡"),
      ),
      JSON.stringify(
        (rowOf("2026-09-24", "qiuting", "transport")?.detail ?? []).map((d) => d.zh),
      ),
    ),
  );

  // Reham 9/22：上午酒店内参会 + 下午自理，且不再挂多余弹窗
  {
    const factRow = rowOf("2026-09-22", "reham", "transport");
    results.push(
      check(
        "9/22 Reham 事实层：酒店内参会 + 下午自理，且为 confirmed",
        factRow?.status === "confirmed" &&
          factRow.text.zh.includes("住宿酒店内") &&
          factRow.text.zh.includes("下午自由外出的交通自行安排"),
        `${factRow?.status} / ${factRow?.text.zh}`,
      ),
    );
    results.push(
      check(
        "9/22 Reham 交通格不挂多余弹窗",
        viewOf("2026-09-22", "reham", "transport")?.entry === null,
        String(viewOf("2026-09-22", "reham", "transport")?.entry),
      ),
    );
  }

  // 外出的那几天不能被说成酒店内
  for (const [date, group, must] of [
    ["2026-09-24", "study", "巡店交通"],
    ["2026-09-25", "study", "巡店交通"],

  ] as [string, GroupKey, string][]) {
    const lines = zhLines(date, group, "transport");
    results.push(
      check(
        `${date} ${group} 外出交通仍待定，未被并进酒店内`,
        lines.includes(must) && !lines.includes("酒店内参会"),
        lines,
      ),
    );
    const factRow = rowOf(date, group, "transport");
    results.push(
      check(
        `${date} ${group} 事实层外出交通仍是 pending，且不写酒店内`,
        factRow?.status === "pending" && !factRow.text.zh.includes("酒店内"),
        `${factRow?.status} / ${factRow?.text.zh}`,
      ),
    );
  }

  // 2026-09-16 正式指引 + 用户确认：23国内场、24国际英语场。
  results.push(check("Reham 23日自由，无巡店入口",
    viewOf("2026-09-23", "reham", "activity")?.entry === null &&
    zhLines("2026-09-23", "reham", "activity").includes("自由") &&
    zhLines("2026-09-23", "reham", "transport").includes("自理")));
  const tour = rowOf("2026-09-24", "reham", "activity");
  results.push(check("Reham 24日英语巡店已定、统一交通",
    tour?.status === "confirmed" && tour.text.zh.includes("英语") &&
    tour.text.en.includes("English") && tour.text.ar.includes("الإنجليزية") &&
    rowOf("2026-09-24", "reham", "transport")?.status === "confirmed" &&
    zhLines("2026-09-24", "reham", "transport").includes("MINISO")));
  for (const group of ["qiuting", "rahma"] as GroupKey[]) {
    results.push(check(`24日 ${group} 订货会不是仅上午`, zhLines("2026-09-24", group, "activity").includes("09:00–18:00")));
  }
  results.push(check("仅商品负责人承担订单截止提醒",
    zhLines("2026-09-23", "qiuting", "activity").includes("预订单截止") &&
    zhLines("2026-09-24", "qiuting", "activity").includes("最终订单截止") &&
    !zhLines("2026-09-23", "reham", "activity").includes("订单")));
  results.push(check("25日退房不覆盖Reham续住",
    zhLines("2026-09-25", "rahma", "lodging").includes("12:00") &&
    zhLines("2026-09-25", "study", "lodging").includes("12:00") &&
    !zhLines("2026-09-25", "reham", "lodging").includes("退房")));

  /* ---- 4. Reham 双人标间 ---- */

  for (const date of [
    "2026-09-21", "2026-09-22", "2026-09-23",
    "2026-09-24", "2026-09-25", "2026-09-26",
  ]) {
    results.push(
      check(
        `${date} Reham 住宿写双人标间`,
        zhLines(date, "reham", "lodging").includes("双人标间"),
        zhLines(date, "reham", "lodging"),
      ),
    );
  }
  for (const date of ["2026-09-25", "2026-09-26"]) {
    results.push(
      check(
        `${date} Rahma 仍是公司另订单间`,
        zhLines(date, "rahma", "lodging").includes("单住"),
        zhLines(date, "rahma", "lodging"),
      ),
    );
  }

  // 没有遗漏的分组
  results.push(
    check(
      "9/22 四组都在（筛选与行序未受影响）",
      cardsFor("2026-09-22").map(groupKeyOf).sort().join(",") ===
        [...groups].sort().join(","),
      cardsFor("2026-09-22").map(groupKeyOf).join(","),
    ),
  );

  return results;
}
