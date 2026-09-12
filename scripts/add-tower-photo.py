#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""owner 2026-09-12：那栋新楼的在建航拍能用，就用它。

我先前把它排除了，理由是「拍的是工地，不是建成的楼」。owner 说照片挺好 ——
他是对的：这张是广州日报新花城记者全杰在主体结构封顶时从空中拍的，署名、
来源页都清楚，按清单里 source=official 那一档收，和怀圣寺光塔那张同一个规矩。
画面里楼顶还是钢结构、架着两台塔吊，下面几十层玻璃幕墙已经装好，四周一圈
琶洲西区的玻璃高楼 —— 一栋 287.5 米的楼在一片已经建成的 CBD 里长出来，
比任何数字都直接。

图说写明是 2025 年 7 月封顶时拍的，正文里也点一句，免得有人以为楼还没盖完
（正文紧接着就说今年 8 月 12 日已经通过竣工验收）。

这一章现在两张图：章首是这栋楼，中间是正佳门口开业那天。
"""
import json
import pathlib
import sys

# ── 1. 照片清单 ────────────────────────────────────────────────────────
MANIFEST = pathlib.Path("scripts/guide-photos.json")
doc = json.loads(MANIFEST.read_text(encoding="utf-8"))

ENTRY = {
    "key": "miniso-tower",
    "input": "miniso-tower-0.jpg",
    "source": "official",
    "title": "名创优品国际总部主体结构封顶",
    "artist": "广州日报新花城记者 全杰",
    "license": "来源页",
    "assetUrl": "https://dayooimg.dayoo.com/www/202507/05/54844163_be67d2e7-7e27-482c-adb6-084da834bd1a.jpg",
    "page": "https://news.dayoo.com/guangzhou/202507/05/139995_54844163.htm",
    "alt": {
        "zh": "从空中往下看名创优品国际总部：楼顶还是裸露的钢结构，架着两台塔吊，下面几十层的玻璃幕墙已经装好；四周是琶洲西区一栋挨一栋的玻璃高楼，中间夹着街道和绿地。",
        "en": "Looking down on the MINISO International Headquarters from the air: the top floors are still bare steel with two tower cranes standing on them, while dozens of glazed floors are finished below; all around it stand the glass towers of Pazhou West, with streets and greenery between them.",
        "ar": "نظرة من الجو إلى مقر «ميني سو» الدولي: الطوابق العليا ما زالت هيكلًا فولاذيًا مكشوفًا تعلوه رافعتان برجيتان، بينما اكتملت عشرات الطوابق الزجاجية تحتها؛ ومن حوله تقف أبراج بازو الغربية الزجاجية وبينها الشوارع والمساحات الخضراء.",
    },
    "caption": {
        "zh": "主体结构封顶时的名创优品国际总部，2025 年 7 月。",
        "en": "The MINISO International Headquarters as its frame topped out, July 2025.",
        "ar": "مقر «ميني سو» الدولي عند اكتمال هيكله، يوليو 2025.",
    },
}

doc["photos"] = [p for p in doc["photos"] if p["key"] != ENTRY["key"]] + [ENTRY]
MANIFEST.write_text(json.dumps(doc, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print(f"✓ 清单共 {len(doc['photos'])} 张，已加 {ENTRY['key']}")


# ── 2. 正文点一句这张照片 ───────────────────────────────────────────────
def once(path: str, a: str, b: str, note: str) -> None:
    p = pathlib.Path(path)
    text = p.read_text(encoding="utf-8")
    if text.count(a) != 1:
        print(f"✗ {note}: 命中 {text.count(a)} 次")
        sys.exit(1)
    p.write_text(text.replace(a, b, 1), encoding="utf-8")
    print(f"✓ {note}")


once(
    "lib/trip-data.ts",
    "你们到广州的时候，它验收才一个月。投资三十五亿元人民币",
    "你们到广州的时候，它验收才一个月 —— 上面那张照片是封顶时从空中拍的，围着它的那一圈玻璃楼就是琶洲西区。投资三十五亿元人民币",
    "中文正文点出照片",
)
once(
    "lib/trip-data.ts",
    "one month before you land. It cost 3.5 billion yuan",
    "one month before you land. The photograph above was taken from the air as the frame topped out; the ring of glass towers around it is Pazhou West. It cost 3.5 billion yuan",
    "英文正文点出照片",
)
once(
    "lib/trip-data.ts",
    "أي قبل شهر من وصولكم. كلفته 3.5 مليار يوان",
    "أي قبل شهر من وصولكم. والصورة أعلاه التُقطت من الجو عند اكتمال الهيكل؛ وحلقة الأبراج الزجاجية المحيطة به هي بازو الغربية. كلفته 3.5 مليار يوان",
    "阿语正文点出照片",
)

# ── 3. 版式：章首放这栋楼 ──────────────────────────────────────────────
once(
    "components/trip/guide-tab.tsx",
    """const CHAPTER_PHOTOS = {
  pazhou: "pazhou-pagoda",
  story: "huaisheng-minaret",
  miniso: "miniso-land",
};""",
    """const CHAPTER_PHOTOS = {
  pazhou: "pazhou-pagoda",
  story: "huaisheng-minaret",
  /** 名创优品那一章两张：章首是琶洲西区那栋新楼，中间是正佳门口开业那天。 */
  miniso: "miniso-tower",
  minisoStore: "miniso-land",
};""",
    "CHAPTER_PHOTOS 加 miniso-tower",
)
once(
    "components/trip/guide-tab.tsx",
    """    CHAPTER_PHOTOS.story,
    CHAPTER_PHOTOS.miniso,""",
    """    CHAPTER_PHOTOS.story,
    CHAPTER_PHOTOS.miniso,
    CHAPTER_PHOTOS.minisoStore,""",
    "图片来源收录两张",
)
once(
    "components/trip/guide-tab.tsx",
    """          {/* 照片不放在开头：开头讲的是琶洲西区那栋新楼，没有能用的公开照片。
              它夹在两组正文中间 —— 上面刚说完这家公司，下面接着讲照片里的那家店。 */}
          <Prose
            lead={MINISO_IN_GZ.lead}
            paragraphs={MINISO_IN_GZ.paragraphs}
            sources={MINISO_IN_GZ.sources}
            lang={lang}
          >
            <GuideFigure photoKey={CHAPTER_PHOTOS.miniso} lang={lang} />""",
    """          {/* 两张图各挨着自己那一段：章首是琶洲西区那栋新楼（封顶时的航拍，
              广州日报），中间那张是正佳门口开业那天，下面接着讲的就是那家店。 */}
          <Prose
            lead={MINISO_IN_GZ.lead}
            paragraphs={MINISO_IN_GZ.paragraphs}
            sources={MINISO_IN_GZ.sources}
            lang={lang}
            photoKey={CHAPTER_PHOTOS.miniso}
          >
            <GuideFigure photoKey={CHAPTER_PHOTOS.minisoStore} lang={lang} />""",
    "章首放新楼那张",
)

# ── 4. 闸门：两张图都要在页面上，别再被换掉 ────────────────────────────
once(
    "scripts/check-guest-guide.mjs",
    """  ['pazhou-pagoda', guideView],
  ['huaisheng-minaret', guideView],""",
    """  ['pazhou-pagoda', guideView],
  ['huaisheng-minaret', guideView],
  // 2026-09-12, the owner: the tower going up is the picture he asked for, and the
  // store on opening day stays with the paragraph that points at it.
  ['miniso-tower', guideView],
  ['miniso-land', guideView],""",
    "闸门：两张图都要在",
)
once(
    "scripts/check-guest-guide.mjs",
    """assert(
  view.indexOf('CHAPTER_PHOTOS.miniso') < view.indexOf('MINISO_IN_GZ.store'),
  'The photo comes before the paragraph that points at it',
);""",
    """assert(
  view.indexOf('CHAPTER_PHOTOS.minisoStore') < view.indexOf('MINISO_IN_GZ.store'),
  'The store photo comes before the paragraph that points at it',
);
assert(
  photoByKey.get('miniso-tower')?.caption.zh.includes('2025 年 7 月'),
  'The tower photo says when it was taken — the text says the building is finished now',
);""",
    "闸门：图说要写明拍摄时间",
)
