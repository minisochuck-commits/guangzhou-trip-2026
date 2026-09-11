// 出发前准备的勾选状态：纯逻辑，不碰 DOM、不碰 localStorage。
//
// 组件只负责把整份 JSON 读进来、写回去（见 components/trip/prep-checklist.tsx）；
// 解析、按人隔离、勾/取消、计数都在这里，所以能直接断言（lib/prep-checklist.test.ts）。
//
// 三条规矩：
//   1. 状态按「看的是谁」分桶存。看 Reham 时勾的东西，不会出现在 Rahma 的清单里，
//      「全部」视图（统筹的人自己看）另有一个桶，不会把某个人的准备标成完成。
//   2. 只认这份清单里的 id；存储里多出来的键原样留着（别的桶、以后的版本），
//      但读出来时会被过滤掉，坏数据不会变成一个勾。
//   3. 语言不进存储 —— 换成英文或阿语，勾还在原处。

import { PREP, type PersonId, type PrepItem } from "./trip-data";

/** localStorage 的键。改结构就升版本号，旧值会被当作「没勾过」。 */
export const PREP_STORAGE_KEY = "gz-trip-prep-done.v1";

/**
 * 能勾的那几项：支付、打车、地图、上网、随身物品。
 * 「天气与穿什么」不在清单里 —— 它是提醒，不是一件能做完的事。
 */
export const CHECKABLE_PREP_IDS = [
  "payment",
  "team-payment",
  "taxi",
  "maps",
  "guest-internet",
  "team-internet",
  "essentials",
] as const;

export function isCheckablePrep(id: string): boolean {
  return (CHECKABLE_PREP_IDS as readonly string[]).includes(id);
}

/** 共同操作指引所有人都看得到，只有借卡与备用金按人区分。与指南页同一条规则。 */
export function prepForPerson(person: PersonId | null): PrepItem[] {
  return PREP.filter(
    (item) =>
      !item.audience || person === null || item.audience.includes(person),
  );
}

/** 存储里的一个桶：谁在看。`null`（全部）单独占一个桶，不与任何人共用。 */
export function prepBucket(person: PersonId | null): string {
  return person ?? "all";
}

type Store = Record<string, Record<string, boolean>>;

/** 坏数据一律当成空：解析失败、不是对象、值不是 true，都不算勾过。 */
function parseStore(raw: string | null): Store {
  if (!raw) return {};
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return {};
  }
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
  const out: Store = {};
  for (const [bucket, value] of Object.entries(parsed as object)) {
    if (!value || typeof value !== "object" || Array.isArray(value)) continue;
    const items: Record<string, boolean> = {};
    for (const [id, done] of Object.entries(value as object)) {
      if (done === true && isCheckablePrep(id)) items[id] = true;
    }
    out[bucket] = items;
  }
  return out;
}

/** 只返回这一个人的勾选状态 —— 别人的桶不出现在返回值里。 */
export function prepDoneFor(
  raw: string | null,
  person: PersonId | null,
): Record<string, boolean> {
  return parseStore(raw)[prepBucket(person)] ?? {};
}

/**
 * 勾上 / 取消，返回写回存储的新 JSON。
 * 别的桶原样保留：一台设备上看过几个人的链接，各自的勾互不影响。
 */
export function withPrepDone(
  raw: string | null,
  person: PersonId | null,
  id: string,
  done: boolean,
): string {
  const store = parseStore(raw);
  const bucket = prepBucket(person);
  const items = { ...(store[bucket] ?? {}) };
  if (done && isCheckablePrep(id)) items[id] = true;
  else delete items[id];
  return JSON.stringify({ ...store, [bucket]: items });
}

/** 「3 / 5」里的两个数：只数这个人看得到、且能勾的项。 */
export function prepProgress(
  items: PrepItem[],
  done: Record<string, boolean>,
): { done: number; total: number } {
  const checkable = items.filter((item) => isCheckablePrep(item.id));
  return {
    done: checkable.filter((item) => done[item.id] === true).length,
    total: checkable.length,
  };
}
