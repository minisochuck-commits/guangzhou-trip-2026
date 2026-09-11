#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""把每个主题的候选图拼成一张对比图，方便一眼挑。没有 PIL 就退到生成 HTML 画廊。"""
import json, pathlib, sys

C = pathlib.Path(".images/candidates.json")
data = json.loads(C.read_text(encoding="utf-8"))
OUT = pathlib.Path(".images/sheets"); OUT.mkdir(parents=True, exist_ok=True)

try:
    from PIL import Image, ImageDraw
except ImportError:
    html = ["<meta charset=utf-8><style>body{font:12px sans-serif;margin:8px}figure{display:inline-block;width:300px;margin:4px;vertical-align:top}img{width:300px;height:200px;object-fit:cover}</style>"]
    for key, items in data.items():
        html.append(f"<h2>{key}</h2>")
        for i, m in enumerate(items, 1):
            if not m.get("file"): continue
            html.append(f"<figure><img src='../{m['file']}'><figcaption>{key}-{i} · {m['license']}</figcaption></figure>")
    (OUT / "index.html").write_text("\n".join(html), encoding="utf-8")
    print("无 PIL，已生成 .images/sheets/index.html"); sys.exit(0)

TW, TH, COLS = 420, 280, 3
for key, items in data.items():
    files = [m["file"] for m in items if m.get("file")]
    if not files: continue
    rows = (len(files) + COLS - 1) // COLS
    sheet = Image.new("RGB", (TW * COLS, (TH + 22) * rows), "white")
    d = ImageDraw.Draw(sheet)
    for i, f in enumerate(files):
        try:
            im = Image.open(f).convert("RGB")
        except Exception:
            continue
        im.thumbnail((TW, TH))
        x, y = (i % COLS) * TW, (i // COLS) * (TH + 22)
        sheet.paste(im, (x + (TW - im.width) // 2, y))
        d.text((x + 6, y + TH + 4), f"{key}-{i+1}", fill="black")
    sheet.save(OUT / f"{key}.jpg", quality=82)
    print(f"{key}: {len(files)} 张 → sheets/{key}.jpg")
