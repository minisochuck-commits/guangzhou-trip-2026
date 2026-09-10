// 同一天里「安排完全一样」的人合成一行。
//
// 规则只有一条：**四个字段（住宿 / 活动 / 餐饮 / 交通）连同完整细节、待定状态、
// 地址、航班、路线、餐饮建议全都一模一样时才合并。** 摘要看着像不算数 ——
// 同房的人不同、对接人不同、课表不同，就必须各占一行。
//
// 所以这里不写「9/20 特殊处理」这种日期例外，而是把两层内容都规范化成一个
// 签名字符串再比：
//   1. 事实层 `Row`（status / text / detail / flights / copy）
//   2. 展示层 `CellView`（lines / entry / suggestion / hidePending / routeIds / foodNoteIds）
// 展示层也要比，因为它按 group 分支 —— 事实一样但展示不一样的两行合并会骗人。
//
// 事实正本 lib/trip-data.ts 与 lib/person-day-plan.ts 不因为合并而改动。

import type { CopyEntry, L10n, PersonId } from "./trip-data";
import type { PersonDayCard, Row } from "./person-day-plan";
import { cellView, type CellView, type Field } from "./plan-presentation";

export const MERGE_FIELDS: Field[] = [
  "lodging",
  "activity",
  "dining",
  "transport",
];

export type MergedRow = {
  /** React key。用代表卡的 id，稳定且唯一。 */
  key: string;
  date: string;
  /** 合并进这一行的所有人，按原始顺序。 */
  people: PersonId[];
  /** 代表卡：四个字段与被合并的人完全一致，弹窗直接用它就对。 */
  card: PersonDayCard;
};

/* ---------------- 规范化 ---------------- */

// 显式列出每个键，不依赖对象字面量的键顺序 —— 不同常量的书写顺序可能不同。
function l10n(value: L10n): string[] {
  return [value.zh, value.en, value.ar];
}

function l10nList(values: L10n[] | undefined): string[][] {
  return (values ?? []).map(l10n);
}

function copyEntries(entries: CopyEntry[] | undefined): unknown[] {
  return (entries ?? []).map((entry) => [
    entry.id,
    entry.chinese,
    ...l10n(entry.label),
  ]);
}

function rowSignature(row: Row): unknown {
  return [
    row.status,
    l10n(row.text),
    l10nList(row.detail),
    [...(row.flights ?? [])],
    copyEntries(row.copy),
  ];
}

function viewSignature(view: CellView): unknown {
  return [
    view.entry ?? "",
    l10nList(view.lines),
    view.suggestion ? l10n(view.suggestion) : "",
    Boolean(view.hidePending),
    [...(view.routeIds ?? [])],
    [...(view.foodNoteIds ?? [])],
  ];
}

/**
 * 一张卡在某一天的完整签名。签名相同 = 这两个人当天的安排在页面上
 * 逐字一致（含弹窗内容），合并不会丢信息。
 */
export function cardSignature(date: string, card: PersonDayCard): string {
  return JSON.stringify([
    MERGE_FIELDS.map((field) => [
      field,
      rowSignature(card[field]),
      viewSignature(cellView(field, date, card)),
    ]),
    Boolean(card.freeTime),
    [...(card.freeRoutes ?? [])],
  ]);
}

/* ---------------- 合并 ---------------- */

/**
 * 把同一天的卡按签名合并。顺序按第一次出现的位置，合并后的 people 保持原顺序。
 * 单人筛选时每天最多一张卡，这个函数是恒等变换。
 */
export function mergeRows(date: string, cards: PersonDayCard[]): MergedRow[] {
  const out: MergedRow[] = [];
  const seen = new Map<string, MergedRow>();

  for (const card of cards) {
    const signature = cardSignature(date, card);
    const existing = seen.get(signature);
    if (existing) {
      existing.people = [...existing.people, ...card.people];
      continue;
    }
    const merged: MergedRow = {
      key: `${date}-${card.id}`,
      date,
      people: [...card.people],
      card,
    };
    seen.set(signature, merged);
    out.push(merged);
  }

  return out;
}

/**
 * 首列该显示哪些名字。
 * 筛了某个人就**只**显示他 —— 合并行里同行的其他名字不该跟着冒出来。
 * 全员视图才列出合并进这一行的所有人。
 */
export function displayedPeople(
  row: MergedRow,
  person: PersonId | null,
): PersonId[] {
  return person ? [person] : row.people;
}
