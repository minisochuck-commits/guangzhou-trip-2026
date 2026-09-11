#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""按 owner 的要求，从公开网页上取图（维基共享资源之外）。

owner 两次说过「搜网上的公开高清大图就行」，并点名了题材：美团无人机、
飞行汽车、酒店送餐机器人、正佳广场、天环广场。维基共享资源上这几样要么没有，
要么拍的不是中国（送餐机器人只有日本千叶和新加坡的）。

做法：搜到相关网页，读它的 og:image / 正文首图，下载回来人工过目再定用不用。
每一张都记下来源页，页面的「图片来源」一节照旧列出处。
"""
import json
import pathlib
import re
import sys
import time
import urllib.parse
import urllib.request

OUT = pathlib.Path(".images/press")
OUT.mkdir(parents=True, exist_ok=True)
UA = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/124.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,image/*;q=0.8",
}

# 题材 → 候选页面。都是官方或主流媒体的公开页面。
PAGES = {
    "drone": [
        "https://www.gz.gov.cn/zwfw/zxfw/kjcy/content/post_10189840.html",
        "https://www.sfccn.com/2025/1-24/4MMDE0NzNfMTk4NzI4Mw.html",
    ],
    "evtol": [
        "https://www.ehang.com/news/1022.html",
        "https://www.ehang.com/cn/news/1059.html",
        "https://www.gz.gov.cn/ysgz/xwdt/ysdt/content/post_10193139.html",
    ],
    "robot": [
        "https://www.pudurobotics.com/en/solutions/hospitality",
        "https://www.pudutech.com/zh-CN",
    ],
    "grandview": [
        "https://www.gz.gov.cn/zfjgzy/gzswhgdlyj/ggfw/lytj/content/post_2991523.html",
        "http://wglj.gz.gov.cn/ztmb/gzhyn/ajjq/4a/content/post_8929272.html",
    ],
    "parccentral": [
        "http://www.tianheroad.com/index.php?m=Markeshow&a=show&id=24",
        "http://www.thnet.gov.cn/zjth/tzth/zlpt/content/post_9126462.html",
    ],
}

IMG_RE = re.compile(
    r'(?:og:image"?\s*content="([^"]+)"|<img[^>]+src="([^"]+\.(?:jpg|jpeg|png))")',
    re.I,
)


def get(url: str, binary: bool = False):
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=30) as r:
        raw = r.read()
    return raw if binary else raw.decode("utf-8", "ignore")


found = {}
for key, pages in PAGES.items():
    picks = []
    for page in pages:
        try:
            html = get(page)
        except Exception as exc:
            print(f"[{key}] 打不开 {page[:56]}… {exc}")
            continue
        urls = []
        for m in IMG_RE.finditer(html):
            u = m.group(1) or m.group(2)
            if not u:
                continue
            u = urllib.parse.urljoin(page, u)
            if re.search(r"logo|icon|qr|erweima|footer|banner_?top|share", u, re.I):
                continue
            if u not in urls:
                urls.append(u)
        for u in urls[:6]:
            try:
                data = get(u, binary=True)
            except Exception:
                continue
            if len(data) < 60_000:          # 小于 60KB 的多半是图标
                continue
            i = len(picks) + 1
            dest = OUT / f"{key}-{i}.jpg"
            dest.write_bytes(data)
            picks.append({"file": str(dest), "url": u, "page": page, "bytes": len(data)})
            if len(picks) >= 6:
                break
            time.sleep(0.3)
        if len(picks) >= 6:
            break
    found[key] = picks
    print(f"[{key}] {len(picks)} 张 " + " ".join(f"{p['bytes']//1024}KB" for p in picks))

(OUT / "found.json").write_text(json.dumps(found, ensure_ascii=False, indent=2), encoding="utf-8")
print("→ .images/press/found.json")
