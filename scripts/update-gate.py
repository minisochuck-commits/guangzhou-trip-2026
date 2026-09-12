#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""闸门跟着 owner 2026-09-12 定的新顺序走，并把新一章纳入检查。"""
import pathlib
import sys

gate = pathlib.Path("scripts/check-guest-guide.mjs")


def once(a: str, b: str, note: str) -> None:
    text = gate.read_text(encoding="utf-8")
    if text.count(a) != 1:
        print(f"✗ {note}: 命中 {text.count(a)} 次")
        sys.exit(1)
    gate.write_text(text.replace(a, b, 1), encoding="utf-8")
    print(f"✓ {note}")


# 新一章也是给客人读的文案：三语齐全、禁用词一样管得到。
once(
    """  'HALAL_WHERE', 'HALAL_DINING', 'JUMUAH_NOTE', 'OFFICIAL_LINKS', 'PHRASES',
]) checkLocales(data[key]);""",
    """  'HALAL_WHERE', 'HALAL_DINING', 'JUMUAH_NOTE', 'OFFICIAL_LINKS', 'PHRASES',
  'MINISO_IN_GZ',
]) checkLocales(data[key]);""",
    "checkLocales 覆盖 MINISO_IN_GZ",
)
once(
    """  data.FOOD_NOTES, data.ROUTES, data.CULTURE_NOTES, data.PAZHOU, data.HALAL_WHERE, data.MOSQUES,
]);""",
    """  data.FOOD_NOTES, data.ROUTES, data.CULTURE_NOTES, data.PAZHOU, data.HALAL_WHERE, data.MOSQUES,
  data.MINISO_IN_GZ,
]);""",
    "禁用词覆盖 MINISO_IN_GZ",
)

# 顺序：印象在前，办事在后。
once(
    """/*
 * The guide opens with a welcome, then preparation, then the hotel block, then the
 * chapters in the order the trip is actually read. The owner agreed this on 2026-09-11;
 * it replaces "hotel first, city story folded away near the end".
 */""",
    """/*
 * 2026-09-12, the owner: the welcome is followed by the four chapters that say what
 * this city is — Guangzhou and you, how big it is, the technology around you, MINISO
 * in Guangzhou — and then Pazhou, which hands over to the hotel block standing on it.
 * Only after that comes the administration: preparation, the hotel, the addresses.
 * Whoever opens the link for the first time should meet the city, not a to-do list.
 * This replaces the 2026-09-11 order, which put preparation and the hotel first.
 */""",
    "顺序注释改写（注明是 owner 的决定与日期）",
)
once(
    """assert(at('id="guide-welcome"') < at('id="prep"'), 'The welcome opens the guide');
assert(at('id="prep"') < at('id="guide-hotel"'), 'Preparation comes before the hotel block');
const CHAPTERS = [
  'addresses', 'pazhou', 'story', 'scale', 'tech', 'halal',
  'food', 'retail', 'routes', 'culture', 'phrases', 'baggage', 'sources',
];
let previous = at('id="guide-hotel"');
for (const id of CHAPTERS) {
  const here = at(`id="${id}"`);
  assert(here > previous, `Chapter out of the agreed reading order: ${id}`);
  previous = here;
}
assert(view.indexOf('id="prep"') < view.indexOf('id="story"'), 'Preparation must precede long reading');""",
    """const CHAPTERS = [
  'guide-welcome', 'story', 'scale', 'tech', 'miniso', 'pazhou',
  'prep', 'guide-hotel', 'addresses', 'halal',
  'food', 'retail', 'routes', 'culture', 'phrases', 'baggage', 'sources',
];
let previous = -1;
for (const id of CHAPTERS) {
  const here = at(`id="${id}"`);
  assert(here > previous, `Chapter out of the agreed reading order: ${id}`);
  previous = here;
}
assert(at('id="story"') < at('id="prep"'), 'The city comes before the paperwork');
assert(at('id="pazhou"') < at('id="guide-hotel"'), 'Pazhou hands over to the hotel standing on it');""",
    "章节顺序断言改写",
)

# 新一章的内容：会议上讲的公司简介不搬到页面，页面只留她自己能走进去的那家店，
# 以及她住的那块地。数字必须带出处。
once(
    """for (const kept of ['CITY_STORY.paragraphs', 'CITY_STORY.sources', 'CITY_SCALE.intro', 'CITY_SCALE.sources']) {""",
    """/*
 * 名创优品那一章的分寸：会议现场讲货盘、店型和企业实力，页面不重复。页面只留
 * 两件会议讲不了的事 —— 她住的琶洲就是中国总部所在地，她要去的正佳广场里有
 * 一家可以自己走进去的 MINISO LAND。每个数字都要有出处；没出处的说法（早先那版
 * 的「海外同比增长 29.3%」「近万人排队」）已经删掉，不许回来。
 */
const miniso = JSON.stringify(data.MINISO_IN_GZ);
for (const needed of ['琶洲大道 109 号', '8,151', '正佳广场', 'MINISO LAND']) {
  assert(miniso.includes(needed), `The MINISO chapter lost a checked fact: ${needed}`);
}
for (const unsourced of ['29.3', '近万人', '万人排队']) {
  assert(!miniso.includes(unsourced), `No source was ever found for this: ${unsourced}`);
}
for (const url of [
  'https://www.miniso.cn/contact/',
  'https://xxsb.gz-cmc.com/pages/2026/01/30/afa451fb749c44af8dcef00ce3abdf5a.html',
]) assert(miniso.includes(url), `The MINISO chapter must keep its source: ${url}`);
assert(view.includes('MINISO_IN_GZ.paragraphs'), 'The MINISO chapter is rendered, not just written');

for (const kept of ['CITY_STORY.paragraphs', 'CITY_STORY.sources', 'CITY_SCALE.intro', 'CITY_SCALE.sources']) {""",
    "新增名创优品一章的事实与出处断言",
)
