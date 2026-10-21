// 行合并的自检。
//
// 项目里没有装测试框架，所以这里不依赖任何 runner：`runMergeChecks()` 返回
// 一组 { name, ok, detail } 结果，谁都能跑。`npx tsc --noEmit` 会连它一起类型检查，
// 所以 `mergeRows` / `cardsForPerson` 的签名一变，这个文件就会先报错。
//
// 覆盖三件事：
//   1. 9/20 出发日 —— Guest 1、Guest 2、Guest 3、Guest 4 四个人安排逐字一致，合成一行。
//   2. 住宿 / 活动不同的日子不能因为摘要像就合并。
//   3. 筛单人时只返回他自己那一行，不带出同行的名字。

import { cardsForPerson } from "./person-day-plan";
import { cardSignature, displayedPeople, mergeRows } from "./merge-rows";
import type { PersonId } from "./trip-data";

export type CheckResult = { name: string; ok: boolean; detail: string };

function check(name: string, ok: boolean, detail = ""): CheckResult {
  return { name, ok, detail };
}

function peopleOfRows(date: string, person: PersonId | null): PersonId[][] {
  return mergeRows(date, cardsForPerson(person, date)).map((row) => row.people);
}

export function runMergeChecks(): CheckResult[] {
  const results: CheckResult[] = [];

  /* ---- 1. 9/20 应该合并 ---- */

  const sep20 = peopleOfRows("2026-09-20", null);
  results.push(
    check(
      "9/20 全员视图合并成 2 行（4 人一行 + Guest 5 一行）",
      sep20.length === 2,
      `实际 ${sep20.length} 行：${JSON.stringify(sep20)}`,
    ),
  );
  results.push(
    check(
      "9/20 第一行是 Guest 1 + Guest 2 + Guest 3 + Guest 4",
      JSON.stringify(sep20[0]) ===
        JSON.stringify(["guest1", "guest2", "guest3", "guest4"]),
      JSON.stringify(sep20[0]),
    ),
  );
  results.push(
    check(
      "9/20 Guest 5 单独一行（活动与交通都不同）",
      JSON.stringify(sep20[1]) === JSON.stringify(["guest5"]),
      JSON.stringify(sep20[1]),
    ),
  );

  /* ---- 2. 安排不同的日子不能合并 ---- */

  const sep21 = peopleOfRows("2026-09-21", null);
  results.push(
    check(
      "9/21 不合并：四个人住宿的室友各不相同",
      sep21.length === 4,
      `实际 ${sep21.length} 行：${JSON.stringify(sep21)}`,
    ),
  );

  const sep25 = peopleOfRows("2026-09-25", null);
  results.push(
    check(
      "9/25 不合并：Guest 1 在中国、Guest 2 自由、学习组巡店、Guest 5 自由",
      sep25.length === 4,
      `实际 ${sep25.length} 行：${JSON.stringify(sep25)}`,
    ),
  );

  const sep27 = peopleOfRows("2026-09-27", null);
  results.push(
    check(
      "9/27 不合并：Guest 2 与学习组的机场对接人不同",
      sep27.length === 4,
      `实际 ${sep27.length} 行：${JSON.stringify(sep27)}`,
    ),
  );

  // 直接比签名，说明「不合并」是内容不同导致的，不是靠日期例外。
  const [guest227] = cardsForPerson("guest2", "2026-09-27");
  const [guest327] = cardsForPerson("guest3", "2026-09-27");
  results.push(
    check(
      "9/27 Guest 2 与学习组签名不同（交通对接人不同）",
      cardSignature("2026-09-27", guest227) !==
        cardSignature("2026-09-27", guest327),
      "签名相同就说明合并规则太松",
    ),
  );

  const sep28 = peopleOfRows("2026-09-28", null);
  results.push(
    check(
      "9/28 合并成 3 行：Guest 1 在中国、Guest 2+学习组同一班机、Guest 5 走 MS959",
      sep28.length === 3 &&
        JSON.stringify(sep28[1]) ===
          JSON.stringify(["guest2", "guest3", "guest4"]),
      `实际 ${sep28.length} 行：${JSON.stringify(sep28)}`,
    ),
  );

  /* ---- 3. 筛单人：只返回他自己那一行，首列不带出同行的名字 ---- */

  for (const person of ["guest1", "guest2", "guest3", "guest4"] as PersonId[]) {
    const rows = mergeRows("2026-09-20", cardsForPerson(person, "2026-09-20"));
    const shown = rows.map((row) => displayedPeople(row, person));
    results.push(
      check(
        `9/20 筛 ${person}：一行，且首列只写他自己`,
        rows.length === 1 &&
          shown.length === 1 &&
          shown[0].length === 1 &&
          shown[0][0] === person,
        JSON.stringify(shown),
      ),
    );
  }

  /* ---- 4. 合并后弹窗内容仍然对得上 ---- */

  const [merged20] = mergeRows("2026-09-20", cardsForPerson(null, "2026-09-20"));
  const [guest120] = cardsForPerson("guest1", "2026-09-20");
  results.push(
    check(
      "9/20 合并行的代表卡与被合并者逐字一致（弹窗可直接用）",
      cardSignature("2026-09-20", merged20.card) ===
        cardSignature("2026-09-20", guest120),
      "代表卡与成员不一致，弹窗会显示别人的安排",
    ),
  );

  return results;
}

/** 方便手动跑：返回 true 表示全过。 */
export function mergeChecksPass(): boolean {
  return runMergeChecks().every((result) => result.ok);
}
