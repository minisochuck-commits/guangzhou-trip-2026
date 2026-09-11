#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""把选中的候选图压到 1200 宽、放进 public/images/，并生成 lib/image-credits.ts。

用法：python3 scripts/pick-images.py tower=3 cbd=5 goose=3 ...
每张图的作者与授权都写进 credits，页面「图片来源」一节要列出来 —— CC 授权的条件。
"""
import json, pathlib, subprocess, sys, re

C = json.loads(pathlib.Path(".images/candidates.json").read_text(encoding="utf-8"))
OUT = pathlib.Path("public/images"); OUT.mkdir(parents=True, exist_ok=True)
# 写法：key=n 或 name:key=n（同一主题要两张时给不同输出名）
picks = []
for a in sys.argv[1:]:
    left, n = a.split("=")
    name, key = (left.split(":") + [None])[:2] if ":" in left else (left, left)
    picks.append((name, key or name, int(n)))
if not picks:
    print("用法：pick-images.py key=n name:key=n ..."); sys.exit(1)

credits = []
for name, key, n in picks:
    m = C[key][n - 1]
    src = pathlib.Path(m["file"])
    dest = OUT / f"{name}.jpg"
    # sips 是 macOS 自带的：最长边限 1200，转 JPEG，质量 60 —— 每张一般 80–180 KB
    subprocess.run(["sips", "-s", "format", "jpeg", "-s", "formatOptions", "60",
                    "--resampleHeightWidthMax", "1200", str(src), "--out", str(dest)],
                   check=True, capture_output=True)
    key = name
    size = dest.stat().st_size
    artist = re.sub(r"\s+", " ", m["artist"] or m["credit"] or "").strip()[:80]
    credits.append({
        "key": key,
        "file": f"images/{key}.jpg",
        "title": (m["title"] or "").replace("File:", ""),
        "artist": artist,
        "license": m["license"],
        "page": m["page"],
    })
    print(f"{key:10s} {size/1024:6.0f} KB  {m['license']:12s} {artist[:40]}")

ts = ['// 自动生成：scripts/pick-images.py。图片全部来自维基共享资源，自由授权，',
      '// 作者与授权按 CC 条件在页面「图片来源」列出。不要手改。',
      'export type ImageCredit = { key: string; file: string; title: string; artist: string; license: string; page: string };',
      'export const IMAGE_CREDITS: ImageCredit[] = ' + json.dumps(credits, ensure_ascii=False, indent=2) + ';',
      'export const IMG: Record<string, string> = Object.fromEntries(IMAGE_CREDITS.map((c) => [c.key, "./" + c.file]));',
      '']
pathlib.Path("lib/image-credits.ts").write_text("\n".join(ts), encoding="utf-8")
total = sum((OUT / f"{k[0]}.jpg").stat().st_size for k in picks)
print(f"共 {len(picks)} 张，{total/1024:.0f} KB → public/images/，lib/image-credits.ts 已生成")
