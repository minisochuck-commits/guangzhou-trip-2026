#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""把「名创优品在广州」一章的配图加进照片清单。

照片：MINISO LAND 广州壹号店开业当天，正佳广场门口排队的人群。
出处：信息时报 2026-01-30《正佳广场MINISO LAND广州壹号店今日开业》，
记者潘敬文摄。来源页授权，按清单里 source=official 的规矩署来源页与提供方，
不冒充 CC。

原图不入仓：先按 assetUrl 取回，放进输入目录，再跑 build-guide-photos.mjs。
"""
import json
import pathlib

MANIFEST = pathlib.Path("scripts/guide-photos.json")
doc = json.loads(MANIFEST.read_text(encoding="utf-8"))

ENTRY = {
    "key": "miniso-land",
    "input": "miniso-land-0.jpg",
    "source": "official",
    "title": "正佳广场 MINISO LAND 广州壹号店开业",
    "artist": "信息时报记者 潘敬文",
    "license": "来源页",
    "assetUrl": "https://oss.gz-cmc.com/pgcr/root/xinxishibao/upload/news/image/2026/01/30/1769770416879066978.jpg",
    "page": "https://xxsb.gz-cmc.com/pages/2026/01/30/afa451fb749c44af8dcef00ce3abdf5a.html",
    "alt": {
        "zh": "正佳广场的外墙被一整面绿底红边的 MINISO 装置盖住，中间是一座高高的拱门，上面挂着 MINISO 招牌和一排卡通角色；门前站满了人，很多人举着手机在拍，远处是几栋玻璃幕墙的高楼。",
        "en": "The outside wall of Grandview Mall covered by a giant green-and-red MINISO installation, a tall decorated archway in the middle carrying the MINISO sign and a row of cartoon characters; a crowd stands in front, many of them holding up phones, and glass towers rise behind.",
        "ar": "جدار غراندفيو مول الخارجي تغطّيه منشأة ضخمة لـ«ميني سو» بالأخضر والأحمر، وفي وسطها قوس مرتفع مزيّن يحمل لافتة «ميني سو» وصفًّا من الشخصيات الكرتونية؛ وأمامها يقف حشد من الناس يرفع كثيرون منهم هواتفهم، وخلفها أبراج زجاجية.",
    },
    "caption": {
        "zh": "开业那天的正佳广场门口。",
        "en": "Outside Grandview Mall on the morning it opened.",
        "ar": "أمام غراندفيو مول صباح الافتتاح.",
    },
}

doc["photos"] = [p for p in doc["photos"] if p["key"] != ENTRY["key"]] + [ENTRY]
MANIFEST.write_text(json.dumps(doc, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print(f"清单共 {len(doc['photos'])} 张，已加 {ENTRY['key']}")
