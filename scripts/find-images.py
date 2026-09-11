#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""从维基共享资源找候选图。

只收自由授权（CC0 / CC BY / CC BY-SA / 公有领域），把作者与授权一起记下来，
页面里要标注。下载的是 1400 宽的缩略图到候选目录，人工看过再选。
用法：python3 scripts/find-images.py  →  .images/candidates/*.jpg + candidates.json
"""
import json, pathlib, re, sys, time, urllib.parse, urllib.request

OUT = pathlib.Path(".images/candidates")
OUT.mkdir(parents=True, exist_ok=True)
API = "https://commons.wikimedia.org/w/api.php"
UA = {"User-Agent": "guangzhou-trip-guide/1.0 (image sourcing; contact: minisochuck@gmail.com)"}

SUBJECTS = {
    "tower":     ["Canton Tower night", "Canton Tower Guangzhou"],
    "cbd":       ["Zhujiang New Town skyline", "Huacheng Square Guangzhou", "Guangzhou CBD night"],
    "opera":     ["Guangzhou Opera House"],
    "taikoo":    ["Taikoo Hui Guangzhou", "TaiKoo Hui"],
    "tianhe":    ["Tianhe Road Guangzhou", "Grandview Mall Guangzhou", "Teemall Guangzhou"],
    "beijinglu": ["Beijing Road Guangzhou pedestrian street", "Beijing Lu Guangzhou"],
    "shamian":   ["Shamian Island Guangzhou", "Shamian Island"],
    "river":     ["Pearl River Guangzhou night", "Zhujiang night Guangzhou"],
    "huaisheng": ["Huaisheng Mosque", "Guangta Guangzhou mosque"],
    "goose":     ["Cantonese roast goose", "siu ngo roast goose", "燒鵝"],
    "dimsum":    ["dim sum steamer baskets", "yum cha dim sum Guangzhou", "har gow"],
    "changfen":  ["cheung fun rice noodle roll", "changfen rice noodle roll"],
    "beef":      ["Chaoshan beef hotpot", "Shantou beef hot pot", "牛肉火锅"],
    "chicken":   ["white cut chicken", "bai qie ji"],
    "pigeon":    ["roast squab Cantonese", "Shiqi pigeon", "乳鸽"],
    "ginger":    ["ginger milk curd", "薑撞奶"],
    "seafood":   ["Cantonese steamed fish", "Huangsha seafood market", "Guangzhou seafood restaurant"],
    "soup":      ["Cantonese slow cooked soup", "老火湯"],
    "congee":    ["Cantonese congee", "艇仔粥"],
    "arcade":    ["qilou arcade Guangzhou", "Enning Road Guangzhou"],
}

FREE = re.compile(r"(cc0|cc-by|cc by|public domain|pd-|attribution)", re.I)

def api(params):
    params = dict(params, format="json")
    url = API + "?" + urllib.parse.urlencode(params)
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=40) as r:
        return json.loads(r.read().decode("utf-8"))

def search(term, limit=8):
    d = api({"action": "query", "list": "search", "srsearch": term,
             "srnamespace": 6, "srlimit": limit})
    return [h["title"] for h in d.get("query", {}).get("search", [])]

def info(titles):
    d = api({"action": "query", "titles": "|".join(titles), "prop": "imageinfo",
             "iiprop": "url|extmetadata|size|mime", "iiurlwidth": 1400})
    out = []
    for page in d.get("query", {}).get("pages", {}).values():
        ii = (page.get("imageinfo") or [None])[0]
        if not ii: continue
        md = ii.get("extmetadata", {})
        lic = md.get("LicenseShortName", {}).get("value", "")
        out.append({
            "title": page.get("title"),
            "license": lic,
            "artist": re.sub(r"<[^>]+>", "", md.get("Artist", {}).get("value", "")).strip(),
            "credit": re.sub(r"<[^>]+>", "", md.get("Credit", {}).get("value", "")).strip()[:120],
            "thumb": ii.get("thumburl"),
            "page": ii.get("descriptionurl"),
            "w": ii.get("width"), "h": ii.get("height"), "mime": ii.get("mime"),
        })
    return out

def fetch(url, dest):
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=60) as r, open(dest, "wb") as f:
        f.write(r.read())

results = {}
for key, terms in SUBJECTS.items():
    seen, picked = set(), []
    for term in terms:
        try:
            titles = [t for t in search(term) if t not in seen]
        except Exception as e:
            print(f"[{key}] 搜索失败 {term!r}: {e}"); continue
        seen.update(titles)
        for batch in (titles[i:i+8] for i in range(0, len(titles), 8)):
            try:
                metas = info(batch)
            except Exception as e:
                print(f"[{key}] 取信息失败: {e}"); continue
            for m in metas:
                if not m["thumb"] or not (m["mime"] or "").startswith("image/jp"): continue
                if not FREE.search(m["license"] or ""): continue
                if (m["w"] or 0) < 1000: continue
                picked.append(m)
        if len(picked) >= 6: break
        time.sleep(0.4)
    picked = picked[:6]
    for i, m in enumerate(picked, 1):
        dest = OUT / f"{key}-{i}.jpg"
        try:
            fetch(m["thumb"], dest)
            m["file"] = str(dest)
        except Exception as e:
            m["file"] = None; print(f"[{key}-{i}] 下载失败: {e}")
        time.sleep(0.3)
    results[key] = picked
    print(f"[{key}] {len(picked)} 张候选")

(OUT.parent / "candidates.json").write_text(json.dumps(results, ensure_ascii=False, indent=2), encoding="utf-8")
print("完成 → .images/candidates.json")
