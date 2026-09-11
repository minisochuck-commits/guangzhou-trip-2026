"use client";

import * as React from "react";
import { ChevronDownIcon } from "lucide-react";

import {
  isCheckablePrep,
  PREP_STORAGE_KEY,
  prepDoneFor,
  prepForPerson,
  prepProgress,
  withPrepDone,
} from "@/lib/prep-checklist";
import type { Lang, PersonId } from "@/lib/trip-data";
import { UI, prepCountLabel, t } from "@/lib/trip-i18n";
import { Checkbox } from "@/components/ui/checkbox";
import { BulletList } from "./ui";

/**
 * 出发前准备：一行一件事，勾掉自己已经办好的。
 *
 * 勾的是原来那几条 PREP，不是另抄一份短清单 —— 标题当动作名，
 * 完整说明收在同一行的「怎么做」里，一屏不出现两遍同样的话。
 *
 * 勾选只在这台设备上：写 localStorage，按看的是谁分桶（见 lib/prep-checklist.ts）。
 * 服务端渲染和存储不可用（隐私模式、被禁用）时一律当作「没勾过」，页面照常能用。
 *
 * **「全部」视图不给勾**：那是统筹的人看全貌用的，一个勾容易被当成
 * 「这个人已经办好了」。那里保留完整指引，不出现勾选框，也不报完成数。
 */
export function PrepChecklist({
  lang,
  person,
}: {
  lang: Lang;
  person: PersonId | null;
}) {
  const tickable = person !== null;
  const items = React.useMemo(() => prepForPerson(person), [person]);

  // 存的是整份 JSON（所有桶）。和「看谁 / 哪种语言」一样走 useSyncExternalStore：
  // 服务端快照是 null，首屏和水合都当作没勾过，之后再用真实存储重渲一次 ——
  // 不会有水合不一致，也不用假装服务端有 localStorage。
  const raw = React.useSyncExternalStore(subscribe, getSnapshot, () => null);

  const done = React.useMemo(() => prepDoneFor(raw, person), [raw, person]);
  const count = prepProgress(items, done);

  const toggle = React.useCallback(
    (id: string, next: boolean) => {
      writeStore(withPrepDone(getSnapshot(), person, id, next));
    },
    [person],
  );

  return (
    <div>
      {/* 一行小字，不是进度仪表盘：知道自己还剩几件事就够了。 */}
      {tickable ? (
        <p
          aria-live="polite"
          className="text-sm font-semibold leading-5 text-miniso-red-strong"
        >
          {prepCountLabel(count.done, count.total, lang)}
        </p>
      ) : null}

      <ul className="mt-2 border-t border-card-line">
        {items.map((item) => {
          const checkable = tickable && isCheckablePrep(item.id);
          const checked = done[item.id] === true;
          return (
            <li key={item.id} className="border-b border-card-line py-1">
              {checkable ? (
                <label className="flex min-h-11 cursor-pointer items-center gap-3">
                  <Checkbox
                    checked={checked}
                    onCheckedChange={(next) => toggle(item.id, next === true)}
                    className="size-5 shrink-0 border-navy/35 data-[state=checked]:border-navy data-[state=checked]:bg-navy"
                  />
                  <span className="text-base font-medium leading-6 text-navy">
                    {t(item.title, lang)}
                  </span>
                </label>
              ) : (
                <p className="flex min-h-11 items-center gap-3 text-base font-medium leading-6 text-navy">
                  <span
                    aria-hidden="true"
                    className="inline-block size-2 shrink-0 rounded-full bg-miniso-red/45"
                  />
                  {t(item.title, lang)}
                </p>
              )}

              {/* 勾上不会把说明收走，这里是各自独立的一个展开。 */}
              <details data-prep className="ps-8">
                <summary className="inline-flex min-h-11 cursor-pointer list-none items-center gap-1 text-sm font-medium text-navy-soft [&::-webkit-details-marker]:hidden">
                  {t(UI.prepChecklist.detail, lang)}
                  <ChevronDownIcon
                    aria-hidden="true"
                    className="prep-chevron size-4"
                  />
                </summary>
                <BulletList items={item.lines} lang={lang} className="pb-3" />
              </details>
            </li>
          );
        })}
      </ul>

      {tickable ? (
        <p className="mt-3 text-sm leading-6 text-navy-soft/85">
          {t(UI.prepChecklist.note, lang)}
        </p>
      ) : null}
    </div>
  );
}

/* ---------------- 存储 ---------------- */

/*
 * localStorage 可能整个不可用（隐私模式、被策略禁用、配额满），读写都要能失败。
 * 失败就当作「这台设备不记勾选」——勾还在这次访问里有效，说明和页面都照常用。
 *
 * 快照缓存在模块里：useSyncExternalStore 每次渲染都会调 getSnapshot，
 * 不该每次都去读一次存储；写入和别的标签页改动时才失效。
 */
const listeners = new Set<() => void>();
let snapshot: string | null | undefined;

function readStore(): string | null {
  try {
    return window.localStorage.getItem(PREP_STORAGE_KEY);
  } catch {
    return null;
  }
}

function getSnapshot(): string | null {
  if (snapshot === undefined) snapshot = readStore();
  return snapshot;
}

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  // 同一台设备开了两个标签页：另一边勾了，这边跟着更新。
  const onStorage = (event: StorageEvent) => {
    if (event.key !== null && event.key !== PREP_STORAGE_KEY) return;
    snapshot = readStore();
    listeners.forEach((notify) => notify());
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener("storage", onStorage);
  };
}

function writeStore(value: string) {
  snapshot = value;
  try {
    window.localStorage.setItem(PREP_STORAGE_KEY, value);
  } catch {
    // 存不下就只在这一次访问里有效。
  }
  listeners.forEach((notify) => notify());
}
