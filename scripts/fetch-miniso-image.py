#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""给「名创优品在广州」一章找一张店铺实景。

owner 说过「搜网上的公开高清大图就行」。维基共享资源上没有 MINISO LAND，
所以按 scripts/fetch-press-images.py 的老办法：读公开报道页的正文首图 / og:image，
下载回来人工过目再决定用不用，来源页照旧记进图片来源一节。
"""
import json
import pathlib
import re
import time
import urllib.parse
import urllib.request

OUT = pathlib.Path(".images/miniso")
OUT.mkdir(parents=True, exist_ok=True)
UA = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/124.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,image/*;q=0.8",
    "Referer": "https://www.baidu.com/",
}

PAGES = [
    "https://xxsb.gz-cmc.com/pages/2026/01/30/afa451fb749c44af8dcef00ce3abdf5a.html",
    "https://m.winshang.com/news739495.html",
    "https://www.miniso.com/",
    "https://ir.miniso.com/",
]

IMG_RE = re.compile(
    r'(?:og:image"?\s*content="([^"]+)"|<img[^>]+(?:data-)?src="([^"]+\.(?:jpg|jpeg|png))")',
    re.I,
)


def get(url, binary=False):
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=30) as r:
        raw = r.read()
    return raw if binary else raw.decode("utf-8", "ignore")


picks = []
for page in PAGES:
    try:
        html = get(page)
    except Exception as exc:
        print(f"打不开 {page[:60]}… {exc}")
        continue
    urls = []
    for m in IMG_RE.finditer(html):
        u = m.group(1) or m.group(2)
        if not u:
            continue
        u = urllib.parse.urljoin(page, u)
        if re.search(r"logo|icon|qr|erweima|footer|share|avatar|blank", u, re.I):
            continue
        if u not in urls:
            urls.append(u)
    print(f"{page[:60]}… 候选 {len(urls)}")
    for u in urls[:10]:
        try:
            data = get(u, binary=True)
        except Exception:
            continue
        if len(data) < 50_000:
            continue
        i = len(picks) + 1
        dest = OUT / f"miniso-{i}.jpg"
        dest.write_bytes(data)
        picks.append({"file": str(dest), "url": u, "page": page, "bytes": len(data)})
        print(f"  ↓ miniso-{i}.jpg {len(data)//1024}KB  {u[:80]}")
        if len(picks) >= 12:
            break
        time.sleep(0.3)
    if len(picks) >= 12:
        break

(OUT / "found.json").write_text(json.dumps(picks, ensure_ascii=False, indent=2), encoding="utf-8")
print(f"共 {len(picks)} 张 → .images/miniso/found.json")
