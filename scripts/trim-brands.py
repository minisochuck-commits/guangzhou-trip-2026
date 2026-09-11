#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""把 21 家砍到 14 家，每家挂一张招牌菜照片。

owner 的话：「给 Reham 的是『我替你挑好了』，不是『你自己从 21 家里选』。」
留下的标准：这一味最能代表它、四位穆斯林客人用得上、并且找得到能合法用的菜品图。
"""
import pathlib
import re
import sys

P = pathlib.Path("lib/dining-brands.ts")
s = P.read_text(encoding="utf-8")
n0 = len(s)

# 留下谁 → 配哪张图（public/images/<key>.jpg）
KEEP = {
    "dagefan": "pigeon",        # 红烧乳鸽
    "taotaoju": "dimsum",       # 大虾饺、现烤蛋挞
    "leigarden": "leigarden",   # 原汁鲜虾饺
    "zheba": "claypot",         # 生啫雪花牛
    "huishijia": "claypot",     # 啫啫黄鳝
    "tiancheng": "sichuanfish", # 酸菜鱼
    "song-sichuan": "sichuanspicy",  # 沸腾老虎斑、香辣蟹
    "chaofa": "beef",           # 吊龙、牛肉丸
    "yelin": "seafood",         # 烧罗氏虾、蒸鲍鱼
    "antalya": "turkish",       # 混合烧烤拼盘、鹰嘴豆酱
    "helanzheng": "pho",        # 特别牛肉粉
    "mapo": "koreanbbq",        # 牛肋条
    "ama": "milktea",           # 米麻薯奶茶
    "heytea": "heytea",         # 多肉葡萄
}
# 砍掉：小炳胜、粤陈记、狮拾久、芒果树、大头虾、摩打食堂、寿司郎

# ── 1. 类型加 imageKey ────────────────────────────────────────────
a = """export type DiningBrand = {
  id: string;"""
b = """export type DiningBrand = {
  id: string;
  /** 招牌菜照片，对应 public/images/<imageKey>.jpg，见 lib/image-credits.ts。
      拍的是这一味，不是门脸 —— 本地品牌的门店照片没有可以合法使用的。 */
  imageKey?: string;"""
if s.count(a) != 1:
    print("类型锚点未命中"); sys.exit(1)
s = s.replace(a, b, 1)

# ── 2. 逐个品牌：保留的挂图，其余整块删掉 ──────────────────────────
# 品牌块形如：      {\n        id: "xxx",\n ... \n      },
blocks = list(re.finditer(r'\n      \{\n        id: "([a-z-]+)",\n(?:.*?\n)*?      \},', s))
if not blocks:
    print("找不到品牌块"); sys.exit(1)

removed, kept = [], []
out = s
for m in reversed(blocks):           # 从后往前改，位移不乱
    bid = m.group(1)
    if bid in KEEP:
        seg = m.group(0)
        new = seg.replace(
            f'        id: "{bid}",\n',
            f'        id: "{bid}",\n        imageKey: "{KEEP[bid]}",\n',
            1,
        )
        out = out[: m.start()] + new + out[m.end():]
        kept.append(bid)
    else:
        out = out[: m.start()] + out[m.end():]
        removed.append(bid)
s = out

missing = set(KEEP) - set(kept)
if missing:
    print("这些没找到：", missing); sys.exit(1)

# ── 3. 导语里「人均为人民币参考」改成两种货币都给 ────────────────────
cur = [
    ('复制中文品牌名，在高德或大众点评搜附近门店。人均为人民币参考，菜品与价格以门店为准。',
     '复制中文品牌名，在高德或大众点评搜附近门店。人均按人民币给，括号里是约合美元，菜品与价格以门店为准。'),
    ('Copy the Chinese name and search for the nearest branch in Amap or Dianping. Budgets are a guide in yuan; dishes and prices are whatever the branch says on the day.',
     'Copy the Chinese name and search for the nearest branch in Amap or Dianping. Budgets are per person in yuan with the rough US dollar equivalent in brackets; dishes and prices are whatever the branch says on the day.'),
]
for a2, b2 in cur:
    if s.count(a2) == 1:
        s = s.replace(a2, b2, 1)

P.write_text(s, encoding="utf-8")
print(f"保留 {len(kept)} 家：{', '.join(reversed(kept))}")
print(f"删除 {len(removed)} 家：{', '.join(reversed(removed))}")
print(f"{n0} → {len(s)} 字节")
