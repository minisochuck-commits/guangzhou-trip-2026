// 勾选清单的自检。跑法：`node scripts/check-prep-checklist.mjs`。
//
// 只测纯逻辑（lib/prep-checklist.ts），不重写一遍组件里的实现：
//   1. 勾选按人隔离 —— Reham 的勾不会出现在别人或「全部」视图里。
//   2. 写一个人不会抹掉另一个人已经勾好的。
//   3. 坏数据 / 空存储不炸，也不会凭空变出一个勾。
//   4. 计数只数这个人看得到、且能勾的项（借卡、备用金按人区分）。

import {
  CHECKABLE_PREP_IDS,
  isCheckablePrep,
  prepDoneFor,
  prepForPerson,
  prepProgress,
  withPrepDone,
} from "./prep-checklist";
import type { PersonId } from "./trip-data";

export type CheckResult = { name: string; ok: boolean; detail: string };

function check(name: string, ok: boolean, detail = ""): CheckResult {
  return { name, ok, detail };
}

export function runPrepChecklistChecks(): CheckResult[] {
  const results: CheckResult[] = [];

  /* ---- 1. 按人隔离 ---- */

  const afterReham = withPrepDone(null, "reham", "payment", true);
  results.push(
    check(
      "勾了 Reham 的支付，Reham 自己看得到",
      prepDoneFor(afterReham, "reham").payment === true,
      afterReham,
    ),
  );
  for (const other of ["rahma", "qiuting", "ahmed", "hassan"] as PersonId[]) {
    results.push(
      check(
        `勾了 Reham 的支付，${other} 的清单仍是空的`,
        Object.keys(prepDoneFor(afterReham, other)).length === 0,
        JSON.stringify(prepDoneFor(afterReham, other)),
      ),
    );
  }
  results.push(
    check(
      "勾了 Reham 的支付，「全部」视图不显示成已完成",
      prepProgress(prepForPerson(null), prepDoneFor(afterReham, null)).done === 0,
      JSON.stringify(prepDoneFor(afterReham, null)),
    ),
  );
  results.push(
    check(
      "在「全部」视图勾，也不会算到某个人头上",
      prepDoneFor(withPrepDone(null, null, "taxi", true), "reham").taxi ===
        undefined,
      JSON.stringify(prepDoneFor(withPrepDone(null, null, "taxi", true), "reham")),
    ),
  );

  /* ---- 2. 互不覆盖，取消只取消自己那一条 ---- */

  const two = withPrepDone(afterReham, "rahma", "maps", true);
  results.push(
    check(
      "写 Rahma 不会抹掉 Reham 已经勾好的",
      prepDoneFor(two, "reham").payment === true &&
        prepDoneFor(two, "rahma").maps === true,
      two,
    ),
  );
  const three = withPrepDone(withPrepDone(two, "reham", "taxi", true), "reham", "payment", false);
  results.push(
    check(
      "取消支付后，同一个人的打车仍然勾着",
      prepDoneFor(three, "reham").payment === undefined &&
        prepDoneFor(three, "reham").taxi === true,
      three,
    ),
  );
  results.push(
    check(
      "取消支付不影响 Rahma",
      prepDoneFor(three, "rahma").maps === true,
      three,
    ),
  );

  /* ---- 3. 空值与坏数据 ---- */

  for (const [name, raw] of [
    ["没有存储", null],
    ["空串", ""],
    ["不是 JSON", "{oops"],
    ["是数组", "[1,2,3]"],
    ["桶里放了字符串", '{"reham":"yes"}'],
    ["值不是 true", '{"reham":{"payment":"1"}}'],
    ["不认识的项", '{"reham":{"not-a-prep-item":true}}'],
  ] as [string, string | null][]) {
    results.push(
      check(
        `坏数据不变成勾：${name}`,
        Object.keys(prepDoneFor(raw, "reham")).length === 0,
        JSON.stringify(prepDoneFor(raw, "reham")),
      ),
    );
    results.push(
      check(
        `坏数据之上仍能正常勾：${name}`,
        prepDoneFor(withPrepDone(raw, "reham", "maps", true), "reham").maps ===
          true,
        withPrepDone(raw, "reham", "maps", true),
      ),
    );
  }

  /* ---- 4. 计数只数看得到的项 ---- */

  const rehamItems = prepForPerson("reham");
  const teamItems = prepForPerson("hassan");
  results.push(
    check(
      "Reham 能勾五项：支付 / 打车 / 地图 / 上网 / 随身物品",
      prepProgress(rehamItems, {}).total === 5,
      rehamItems.map((item) => item.id).join(","),
    ),
  );
  results.push(
    check(
      "Mohamed 也是五项，但走的是团队那两条",
      prepProgress(teamItems, {}).total === 5 &&
        teamItems.some((item) => item.id === "team-payment") &&
        teamItems.every((item) => item.id !== "payment"),
      teamItems.map((item) => item.id).join(","),
    ),
  );
  results.push(
    check(
      "天气不计入清单（它是提醒，不是一件能做完的事）",
      !isCheckablePrep("weather") &&
        rehamItems.some((item) => item.id === "weather"),
      CHECKABLE_PREP_IDS.join(","),
    ),
  );
  results.push(
    check(
      "勾别人视图里的项，不会灌进这个人的计数",
      prepProgress(
        rehamItems,
        prepDoneFor(withPrepDone(null, "reham", "team-payment", true), "reham"),
      ).done === 0,
      "team-payment 不在 Reham 的视图里",
    ),
  );
  results.push(
    check(
      "勾满五项就是 5 / 5",
      prepProgress(
        rehamItems,
        prepDoneFor(
          rehamItems
            .filter((item) => isCheckablePrep(item.id))
            .reduce<string | null>(
              (raw, item) => withPrepDone(raw, "reham", item.id, true),
              null,
            ),
          "reham",
        ),
      ).done === 5,
      "",
    ),
  );

  return results;
}

/** 方便手动跑：返回 true 表示全过。 */
export function prepChecklistChecksPass(): boolean {
  return runPrepChecklistChecks().every((result) => result.ok);
}
