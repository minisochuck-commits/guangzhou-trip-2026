// 勾选清单的自检。跑法：`node scripts/check-prep-checklist.mjs`。
//
// 只测纯逻辑（lib/prep-checklist.ts），不重写一遍组件里的实现：
//   1. 勾选按人隔离 —— Guest5 的勾不会出现在别人或「全部」视图里。
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

  const afterGuest5 = withPrepDone(null, "guest5", "payment", true);
  results.push(
    check(
      "勾了 Guest5 的支付，Guest5 自己看得到",
      prepDoneFor(afterGuest5, "guest5").payment === true,
      afterGuest5,
    ),
  );
  for (const other of ["guest2", "guest1", "guest3", "guest4"] as PersonId[]) {
    results.push(
      check(
        `勾了 Guest5 的支付，${other} 的清单仍是空的`,
        Object.keys(prepDoneFor(afterGuest5, other)).length === 0,
        JSON.stringify(prepDoneFor(afterGuest5, other)),
      ),
    );
  }
  results.push(
    check(
      "勾了 Guest5 的支付，「全部」视图不显示成已完成",
      prepProgress(prepForPerson(null), prepDoneFor(afterGuest5, null)).done === 0,
      JSON.stringify(prepDoneFor(afterGuest5, null)),
    ),
  );
  results.push(
    check(
      "在「全部」视图勾，也不会算到某个人头上",
      prepDoneFor(withPrepDone(null, null, "taxi", true), "guest5").taxi ===
        undefined,
      JSON.stringify(prepDoneFor(withPrepDone(null, null, "taxi", true), "guest5")),
    ),
  );

  /* ---- 2. 互不覆盖，取消只取消自己那一条 ---- */

  const two = withPrepDone(afterGuest5, "guest2", "maps", true);
  results.push(
    check(
      "写 Guest2 不会抹掉 Guest5 已经勾好的",
      prepDoneFor(two, "guest5").payment === true &&
        prepDoneFor(two, "guest2").maps === true,
      two,
    ),
  );
  const three = withPrepDone(withPrepDone(two, "guest5", "taxi", true), "guest5", "payment", false);
  results.push(
    check(
      "取消支付后，同一个人的打车仍然勾着",
      prepDoneFor(three, "guest5").payment === undefined &&
        prepDoneFor(three, "guest5").taxi === true,
      three,
    ),
  );
  results.push(
    check(
      "取消支付不影响 Guest2",
      prepDoneFor(three, "guest2").maps === true,
      three,
    ),
  );

  /* ---- 3. 空值与坏数据 ---- */

  for (const [name, raw] of [
    ["没有存储", null],
    ["空串", ""],
    ["不是 JSON", "{oops"],
    ["是数组", "[1,2,3]"],
    ["桶里放了字符串", '{"guest5":"yes"}'],
    ["值不是 true", '{"guest5":{"payment":"1"}}'],
    ["不认识的项", '{"guest5":{"not-a-prep-item":true}}'],
  ] as [string, string | null][]) {
    results.push(
      check(
        `坏数据不变成勾：${name}`,
        Object.keys(prepDoneFor(raw, "guest5")).length === 0,
        JSON.stringify(prepDoneFor(raw, "guest5")),
      ),
    );
    results.push(
      check(
        `坏数据之上仍能正常勾：${name}`,
        prepDoneFor(withPrepDone(raw, "guest5", "maps", true), "guest5").maps ===
          true,
        withPrepDone(raw, "guest5", "maps", true),
      ),
    );
  }

  /* ---- 4. 计数只数看得到的项 ---- */

  const guest5Items = prepForPerson("guest5");
  const teamItems = prepForPerson("guest4");
  results.push(
    check(
      "Guest5 能勾五项：支付 / 打车 / 地图 / 上网 / 随身物品",
      prepProgress(guest5Items, {}).total === 5,
      guest5Items.map((item) => item.id).join(","),
    ),
  );
  results.push(
    check(
      "Guest4 也是五项，但走的是团队那两条",
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
        guest5Items.some((item) => item.id === "weather"),
      CHECKABLE_PREP_IDS.join(","),
    ),
  );
  results.push(
    check(
      "勾别人视图里的项，不会灌进这个人的计数",
      prepProgress(
        guest5Items,
        prepDoneFor(withPrepDone(null, "guest5", "team-payment", true), "guest5"),
      ).done === 0,
      "team-payment 不在 Guest5 的视图里",
    ),
  );
  results.push(
    check(
      "勾满五项就是 5 / 5",
      prepProgress(
        guest5Items,
        prepDoneFor(
          guest5Items
            .filter((item) => isCheckablePrep(item.id))
            .reduce<string | null>(
              (raw, item) => withPrepDone(raw, "guest5", item.id, true),
              null,
            ),
          "guest5",
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
