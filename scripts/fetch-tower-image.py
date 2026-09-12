#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""找名创优品国际总部（琶洲西区，287.5 米，2026-08-12 通过竣工验收）的照片。

owner 2026-09-12：「新总部大楼刚刚建成，搜一下补进去」。这一栋她在琶洲
抬头就能看见，配图比任何数字都直接。按老办法读公开网页的正文图与 og:image，
下载回来逐张过目，来源页记进图片来源一节。
"""
import json
import pathlib
import re
import time
import urllib.parse
import urllib.request

OUT = pathlib.Path(".images/tower")
OUT.mkdir(parents=True, exist_ok=True)
UA = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/124.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,image/*;q=0.8",
}

PAGES = [
    "https://www.163.com/dy/article/L4L2GKIQ0514ETGI.html",
    "https://news.dayoo.com/guangzhou/202507/05/139995_54844163.htm",
    "https://huacheng.gz-cmc.com/pages/2025/07/05/SF140783523dd6e431e30547848e2130.html",
    "https://www.163.com/dy/article/K7QRGALC0515AKCN.html",
    "http://m.xingfadw.com/mArticle/guangzhoupazhouxindi.html",
    "https://ccpa.com.cn/site/content/12810.html",
]

IMG_RE = re.compile(
    r'(?:og:image"?\s*content="([^"]+)"'
    r'|<img[^>]+(?:data-original|data-src|src)="([^"]+?\.(?:jpg|jpeg|png))")',
    re.I,
)


def get(url, binary=False):
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=25) as r:
        raw = r.read()
        if r.headers.get("Content-Encoding") == "gzip":
            import gzip
            raw = gzip.decompress(raw)
    return raw if binary else raw.decode("utf-8", "ignore")


picks = []
for page in PAGES:
    try:
        html = get(page)
    except Exception as exc:
        print(f"打不开 {page[:56]}… {exc}")
        continue
    urls = []
    for m in IMG_RE.finditer(html):
        u = m.group(1) or m.group(2)
        if not u:
            continue
        u = urllib.parse.urljoin(page, u)
        if re.search(r"logo|icon|qr|erweima|footer|share|avatar|blank|ad_", u, re.I):
            continue
        if u not in urls:
            urls.append(u)
    print(f"{page[:56]}… 候选 {len(urls)}")
    for u in urls[:8]:
        try:
            data = get(u, binary=True)
        except Exception:
            continue
        if len(data) < 40_000:
            continue
        i = len(picks) + 1
        dest = OUT / f"tower-{i}.jpg"
        dest.write_bytes(data)
        picks.append({"file": str(dest), "url": u, "page": page, "bytes": len(data)})
        print(f"  ↓ tower-{i}.jpg {len(data)//1024}KB  {u[:78]}")
        if len(picks) >= 16:
            break
        time.sleep(0.25)
    if len(picks) >= 16:
        break

(OUT / "found.json").write_text(json.dumps(picks, ensure_ascii=False, indent=2), encoding="utf-8")
print(f"共 {len(picks)} 张 → .images/tower/found.json")
