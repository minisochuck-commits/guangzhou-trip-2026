#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""把新章接上：import、配图 key，以及两处已经说不准的注释。"""
import pathlib
import sys

view = pathlib.Path("components/trip/guide-tab.tsx")


def once(a: str, b: str, note: str) -> None:
    text = view.read_text(encoding="utf-8")
    if text.count(a) != 1:
        print(f"✗ {note}: 命中 {text.count(a)} 次")
        sys.exit(1)
    view.write_text(text.replace(a, b, 1), encoding="utf-8")
    print(f"✓ {note}")


once("  JUMUAH_NOTE,\n  MOSQUES,\n", "  JUMUAH_NOTE,\n  MINISO_IN_GZ,\n  MOSQUES,\n", "import MINISO_IN_GZ")

once(
    """/**
 * 两章的主图：琶洲塔与怀圣寺的光塔。照片的 alt 与图说在 lib/guide-photos.ts 里，
 * 跟着照片走 —— 这里只说哪一章配哪一张。
 */
const CHAPTER_PHOTOS = { pazhou: "pazhou-pagoda", story: "huaisheng-minaret" };""",
    """/**
 * 三章的主图：琶洲塔、怀圣寺的光塔、开业当天的正佳门口。照片的 alt 与图说在
 * lib/guide-photos.ts 里，跟着照片走 —— 这里只说哪一章配哪一张。
 */
const CHAPTER_PHOTOS = {
  pazhou: "pazhou-pagoda",
  story: "huaisheng-minaret",
  miniso: "miniso-land",
};""",
    "CHAPTER_PHOTOS.miniso",
)

once(
    """    CHAPTER_PHOTOS.pazhou,
    CHAPTER_PHOTOS.story,""",
    """    CHAPTER_PHOTOS.pazhou,
    CHAPTER_PHOTOS.story,
    CHAPTER_PHOTOS.miniso,""",
    "图片来源收录新照片",
)

once(
    "      {/* 欢迎之后紧接着出发前准备 —— 出发前最先要读的就是它，不被酒店块挡住。 */}",
    """      {/* 读完上面那一组再办事：出发前准备排在印象后面、酒店块前面。 */}""",
    "prep 那条注释跟上新顺序",
)

once(
    """      {/*
        其余章节按一次旅行读下来的顺序：先到（机场地址）、住在哪一片（琶洲）、
        这座城是什么（广州与你们 / 体量 / 科技）、日常要用的（礼拜与清真餐 / 吃 / 逛 /
        路线 / 习惯），最后是备查的（短句 / 行李 / 来源）。
      */}""",
    """      {/*
        剩下的都是到了之后要用的：机场地址、礼拜与清真餐、吃、逛、路线、习惯，
        最后是备查的（短句 / 行李 / 来源）。讲这座城的四章已经搬到欢迎卡下面了。
      */}""",
    "末段那条注释跟上新顺序",
)
