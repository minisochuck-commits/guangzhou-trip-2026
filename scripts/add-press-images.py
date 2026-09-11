#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""把公开网页上取到的四张图并进 public/images 与 lib/image-credits.ts。

owner 两次说过用网上公开的图就行。这四张来自政府门户与厂商官网的公开页面，
每一张都记下它所在的页面，页面的「图片来源」照旧列出来 —— 维基共享资源那批
记的是 CC 授权，这一批记的是出处页。

命名避开被禁的旧键：`robot` 曾经是日本千叶拍的、`tianhe` 是带水印那张，
新图另起名字，旧的禁令继续有效。
"""
import json
import pathlib
import subprocess
import sys

PRESS = pathlib.Path(".images/press")
OUT = pathlib.Path("public/images")
found = json.loads((PRESS / "found.json").read_text(encoding="utf-8"))

# 输出名 → (候选组, 第几张, 说明)
PICKS = {
    "evtolair": ("drone", 1, {
        "zh": "亿航 EH216-S 载人航空器（广州市人民政府）",
        "en": "EHang EH216-S passenger aircraft (Guangzhou municipal government)",
        "ar": "طائرة الركاب EH216-S من إي هانغ (حكومة بلدية قوانغتشو)",
    }),
    "deliverybot": ("hotelrobot", 4, {
        "zh": "擎朗配送机器人（擎朗智能官网）",
        "en": "Keenon delivery robot (Keenon Robotics)",
        "ar": "روبوت التوصيل من كينون (موقع كينون)",
    }),
    "grandview": ("grandview", 1, {
        "zh": "正佳广场（广州市文广旅局）",
        "en": "Grandview Mall (Guangzhou Culture, Radio, Tourism Bureau)",
        "ar": "غراندفيو مول (هيئة الثقافة والسياحة بقوانغتشو)",
    }),
    "tianhenight": ("parccentral", 4, {
        "zh": "天河路商圈夜景（天河路商会）",
        "en": "The Tianhe Road district at night (Tianhe Road Chamber of Commerce)",
        "ar": "منطقة شارع تيانخه ليلًا (غرفة تجارة شارع تيانخه)",
    }),
}

credits_path = pathlib.Path("lib/image-credits.ts")
raw = credits_path.read_text(encoding="utf-8")
head, rest = raw.split("IMAGE_CREDITS: ImageCredit[] = ", 1)
body, tail = rest.split(";\nexport", 1)
credits = json.loads(body)
have = {c["key"] for c in credits}

added = []
for name, (group, index, label) in PICKS.items():
    try:
        item = found[group][index - 1]
    except (KeyError, IndexError):
        print(f"✗ 没有 {group}-{index}")
        sys.exit(1)
    src = pathlib.Path(item["file"])
    dest = OUT / f"{name}.jpg"
    subprocess.run(
        ["sips", "-s", "format", "jpeg", "-s", "formatOptions", "62",
         "--resampleHeightWidthMax", "1200", str(src), "--out", str(dest)],
        check=True, capture_output=True,
    )
    entry = {
        "key": name,
        "file": f"images/{name}.jpg",
        "title": label["zh"],
        "artist": "",
        "license": "来源页",
        "page": item["page"],
    }
    credits = [c for c in credits if c["key"] != name] + [entry]
    added.append((name, dest.stat().st_size // 1024, item["page"]))

credits_path.write_text(
    head + "IMAGE_CREDITS: ImageCredit[] = " + json.dumps(credits, ensure_ascii=False, indent=2) + ";\nexport" + tail,
    encoding="utf-8",
)
for name, kb, page in added:
    print(f"{name:14s} {kb:4d} KB  ← {page[:64]}")
print(f"credits 共 {len(credits)} 条")
