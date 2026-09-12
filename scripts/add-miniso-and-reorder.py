#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""owner 2026-09-12 的两件事。

1. 把「广州与你们 / 这座城有多大 / 科技就在身边」提到欢迎卡正下面。
   之前欢迎卡后面接的是出发前准备、酒店、机场地址 —— 全是办事用的，
   第一次点开链接看到的是行政事务。先给印象，办事的东西往后放。
   「琶洲：你住的这块地」跟着这一组的尾巴：它本来就是从「这座城」
   过渡到「你住哪」的那一节，后面正好接酒店。

2. 新增「名创优品在广州」。会议上讲货盘、店型和企业实力，页面不重复 ——
   这一节只写会议讲不了的两件事：她住的那块地就是这个牌子的总部所在地，
   她要去的正佳广场里有一家她可以自己走进去的 MINISO LAND。

   事实逐条核过（来源写进 sources）：
     · 中国总部 广州市海珠区琶洲大道 109 号铭丰广场 A 栋 3 楼（miniso.cn/contact）
     · 2013 年创办，「诞生在广州一个地下室车库里」（miniso.cn/brand 品牌故事）
     · 2025 年底 名创优品品牌 8,151 家门店（内地 4,568 / 海外 3,583），
       品牌营收 195.2 亿元（赢商网 739495，引 2025 年报）
     · 全球超 112 个国家和地区；MINISO LAND 全球二十多家，都在一线城市
       核心商圈（赢商网 738794）
     · MINISO LAND 广州壹号店 2026-01-30 在正佳广场开业，超 1,100 ㎡ 两层，
       IP 商品占比超 90%（信息时报 2026-01-30）
     · 超 100 个 IP、超 5,500 款商品；一楼伊甸园派对，二楼可爱工厂；
       开业首日门外排满人，YOYO 一代手办不到一分钟售罄（时代周报 327243）

   删掉了上一稿里两处没有出处的说法：「海外同比增长 29.3%」与「近万人排队」。
   报道只说门外挤满了等候的人，没有给数字 —— 照片就是那一幕，不替它编个数。
"""
import pathlib
import sys

def once(path: pathlib.Path, a: str, b: str, note: str) -> None:
    text = path.read_text(encoding="utf-8")
    if text.count(a) != 1:
        print(f"✗ {note}: 命中 {text.count(a)} 次")
        sys.exit(1)
    path.write_text(text.replace(a, b, 1), encoding="utf-8")
    print(f"✓ {note}")


def cut(text: str, start: str) -> tuple[str, str]:
    """把一段 8 格缩进的 <Section>…</Section> 整块取出来。"""
    i = text.index(start)
    end = "\n        </Section>\n"
    j = text.index(end, i) + len(end)
    return text[:i] + text[j:], text[i:j]


# ── 1. 数据：名创优品在广州 ──────────────────────────────────────────────
data = pathlib.Path("lib/trip-data.ts")
head = data.read_text(encoding="utf-8")
start = head.index("/* 名创优品在广州")
start = head.rindex("/* ---", 0, start)
end = head.index("\n};\n", head.index("export const MINISO_IN_GZ")) + len("\n};\n")

MINISO = '''/* ------------------------------------------------------------------ */
/* 名创优品在广州                                                        */
/*                                                                     */
/* 不是公司简介 —— 货盘、店型、企业实力在会议现场讲。页面只写会议讲不了的：*/
/* 她住的那块地就是这个牌子的总部所在地，她要去的正佳广场里有一家店       */
/* 可以自己走进去看。数字都带出处，没出处的说法一律不留。                 */
/* ------------------------------------------------------------------ */

export const MINISO_IN_GZ: {
  lead: L10n;
  paragraphs: L10n[];
  sources: { label: L10n; url: string }[];
} = {
  lead: {
    zh: "你住的琶洲，就是这个牌子的家。",
    en: "Pazhou, where you are staying, is where this brand lives.",
    ar: "بازو، حيث تقيمون، هي موطن هذه العلامة.",
  },
  paragraphs: [
    {
      zh: "出酒店往东走，过了广交会的展馆，琶洲大道 109 号，铭丰广场 A 栋三楼 —— 名创优品的中国总部就在那儿。你们这几天开会、吃饭、睡觉的这一片，是这家公司每天上班的地方。",
      en: "Walk east out of the hotel, past the Canton Fair halls, and at 109 Pazhou Avenue, third floor of Building A in Mingfeng Plaza, you are at MINISO’s China headquarters. The few streets where you will meet, eat and sleep this week are where this company comes to work every morning.",
      ar: "اخرجوا من الفندق شرقًا، وتجاوزوا قاعات معرض كانتون، وعند الرقم 109 في شارع بازو، في الطابق الثالث من المبنى A بمجمع مينغفنغ، تصلون إلى المقر الصيني لـ«ميني سو». فهذه الشوارع القليلة التي ستجتمعون وتأكلون وتنامون فيها هذا الأسبوع هي المكان الذي تأتي إليه الشركة للعمل كل صباح.",
    },
    {
      zh: "它 2013 年开张的时候，在广州的一个地下室车库里。十三年过去，名创优品在一百一十二个国家和地区都有店；单是这个牌子，2025 年底有 8,151 家 —— 中国内地 4,568 家，海外 3,583 家 —— 那一年营收 195.2 亿元人民币。",
      en: "When it started in 2013 it was in a basement garage in Guangzhou. Thirteen years on, MINISO trades in more than a hundred and twelve countries and regions; the brand alone ended 2025 with 8,151 stores — 4,568 in mainland China, 3,583 abroad — on revenue of 19.52 billion yuan for the year.",
      ar: "حين بدأت عام 2013 كانت في مرآب تحت الأرض في قوانغتشو. وبعد ثلاثة عشر عامًا صارت «ميني سو» تعمل في أكثر من مئة واثنتي عشرة دولة ومنطقة؛ وعلامتها وحدها أنهت عام 2025 بـ8,151 متجرًا — منها 4,568 في الصين القارية و3,583 في الخارج — بإيراد قدره 19.52 مليار يوان في تلك السنة.",
    },
    {
      zh: "正佳广场里的那家 MINISO LAND，是这个店型在广州的第一家。全球开了二十多家，家家都在一线城市的核心商圈。广州这家今年 1 月 30 日开门：一千一百多平方米，上下两层。一楼照着「伊甸园派对」做，YOYO、迪士尼、哈利·波特、三丽鸥挤在同一层；二楼叫「可爱工厂」，用乐器引路，货架做成音符的样子。店里九成以上是 IP 商品，一百多个 IP、五千五百多款。",
      en: "The MINISO LAND inside Grandview Mall is the first of its kind in Guangzhou. Barely two dozen exist anywhere, every one of them in the core retail district of a first-tier city. This one opened on 30 January: eleven hundred square metres over two floors. The ground floor is built as an “Eden garden party”, with YOYO, Disney, Harry Potter and Sanrio sharing one room; above it is the “cute factory”, laid out along musical instruments with shelves shaped like notes. More than ninety percent of the stock is licensed IP — over a hundred properties, more than 5,500 items.",
      ar: "متجر «ميني سو لاند» داخل غراندفيو مول هو الأول من نوعه في قوانغتشو. ولا يتجاوز عدد فروع هذا النمط عشرين ونيّفًا في العالم كله، وكلها في قلب المناطق التجارية لمدن الصف الأول. افتُتح فرع قوانغتشو في 30 يناير: ألف ومئة متر مربع على طابقين. بُني الطابق الأرضي على فكرة «حفلة حديقة عدن»، حيث تجتمع YOYO وديزني وهاري بوتر وسانريو في قاعة واحدة؛ وفوقه «مصنع الظرافة»، ممتدّ على خطّ من الآلات الموسيقية وأرففه على هيئة نوتات. وأكثر من تسعين بالمئة من المعروض منتجات بترخيص شخصيات — أكثر من مئة شخصية وما يزيد على 5,500 صنف.",
    },
    {
      zh: "开门那天早上的样子就是上面这张照片：人从门口一直站到广场上。YOYO 一代的手办，开店不到一分钟就没了。",
      en: "The photograph above is that first morning: people standing from the door out across the plaza. The first-generation YOYO figures were gone within a minute of opening.",
      ar: "الصورة أعلاه من ذلك الصباح الأول: الناس واقفون من الباب حتى الساحة. أما مجسّمات YOYO من الجيل الأول فنفدت خلال دقيقة من الافتتاح.",
    },
    {
      zh: "正佳就是商圈那一章里的六家之一。你们去天河路的那天，这家店就在那栋楼里。",
      en: "Grandview is one of the six malls in the shopping-district chapter. On the day you go to Tianhe Road, this store is inside that building.",
      ar: "وغراندفيو أحد المراكز الستة في فصل مناطق التسوّق. ويوم ذهابكم إلى شارع تيانخه، يكون هذا المتجر داخل ذلك المبنى.",
    },
  ],
  sources: [
    {
      label: { zh: "名创优品：联系我们（中国总部地址）", en: "MINISO: contact us (China headquarters address)", ar: "ميني سو: اتصل بنا (عنوان المقر الصيني)" },
      url: "https://www.miniso.cn/contact/",
    },
    {
      label: { zh: "名创优品：品牌故事（2013 年，广州的地下室车库）", en: "MINISO: brand story (2013, a basement garage in Guangzhou)", ar: "ميني سو: قصة العلامة (2013، مرآب تحت الأرض في قوانغتشو)" },
      url: "https://www.miniso.cn/brand/",
    },
    {
      label: { zh: "赢商网：2025 年度业绩与全球门店数", en: "Winshang: the 2025 results and the global store count", ar: "وينشانغ: نتائج 2025 وعدد المتاجر عالميًا" },
      url: "https://m.winshang.com/news739495.html",
    },
    {
      label: { zh: "赢商网：MINISO LAND 的门店布局", en: "Winshang: where the MINISO LAND stores are", ar: "وينشانغ: أين تقع متاجر ميني سو لاند" },
      url: "https://m.winshang.com/news738794.html",
    },
    {
      label: { zh: "信息时报：MINISO LAND 广州壹号店在正佳广场开业", en: "Xinxi Shibao: MINISO LAND Guangzhou opens at Grandview Mall", ar: "شينشي شيباو: افتتاح ميني سو لاند قوانغتشو في غراندفيو مول" },
      url: "https://xxsb.gz-cmc.com/pages/2026/01/30/afa451fb749c44af8dcef00ce3abdf5a.html",
    },
    {
      label: { zh: "时代周报：开业首日的门店实况", en: "Time Weekly: the store on its opening day", ar: "تايم ويكلي: المتجر في يوم افتتاحه" },
      url: "https://time-weekly.com/post/327243",
    },
  ],
};
'''

data.write_text(head[:start] + MINISO + head[end:], encoding="utf-8")
print("✓ 数据：MINISO_IN_GZ 重写（事实逐条对过来源）")

# ── 2. 三语章名与收起时的那一行 ──────────────────────────────────────────
i18n = pathlib.Path("lib/trip-i18n.ts")
once(
    i18n,
    '''  "cityTech": {''',
    '''  "miniso": {
    "zh": "名创优品在广州",
    "en": "MINISO in Guangzhou",
    "ar": "ميني سو في قوانغتشو"
  },
  "cityTech": {''',
    "i18n: UI.miniso",
)
once(
    i18n,
    '''    "tech": {
      "zh": "驾驶位上没有人''',
    '''    "miniso": {
      "zh": "总部就在你住的琶洲，旗舰店在你要去的正佳广场",
      "en": "The head office is in Pazhou where you are staying; the flagship store is in the mall you are visiting",
      "ar": "المقر في بازو حيث تقيمون، والمتجر الرئيسي في المركز الذي ستزورونه"
    },
    "tech": {
      "zh": "驾驶位上没有人''',
    "i18n: guideHints.miniso",
)

# ── 3. 版式：印象在前，办事在后 ─────────────────────────────────────────
view = pathlib.Path("components/trip/guide-tab.tsx")
v = view.read_text(encoding="utf-8")

v, story = cut(v, '        <Section id="story" title={UI.cityStory}')
v, scale = cut(v, '        <Section id="scale" title={UI.cityScale}')
v, tech = cut(v, "        {/* 配图只用真在中国")   # 连着它上面那段说明一起搬
v, pazhou = cut(v, '        <Section\n          id="pazhou"')

MINISO_SECTION = '''        {/* 照片就是开业当天的正佳门口 —— 上一段说门口排了人，图里正好是那一幕。 */}
        <Section
          id="miniso"
          title={UI.miniso}
          hint={UI.guideHints.miniso}
          lang={lang}
        >
          <Prose
            lead={MINISO_IN_GZ.lead}
            paragraphs={MINISO_IN_GZ.paragraphs}
            sources={MINISO_IN_GZ.sources}
            lang={lang}
            photoKey={CHAPTER_PHOTOS.miniso}
          />
        </Section>
'''

IMPRESSION = (
    """      {/*
        欢迎之后先给印象，再办事（owner 2026-09-12 定的顺序）。
        这一组从「这座城和你们的关系」一路读到「你住的这块地」：
        广州与你们 → 这座城有多大 → 科技就在身边 → 名创优品在广州 → 琶洲。
        读完正好接下面的酒店块 —— 琶洲那一节讲的就是酒店脚下这块地。
        上一版这里接的是出发前准备和机场地址，第一次点开看到的是行政事务。
      */}
      <Accordion type="multiple" defaultValue={[]} className="space-y-2.5">
"""
    + story
    + "\n"
    + scale
    + "\n"
    + tech
    + "\n"
    + MINISO_SECTION
    + "\n"
    + pazhou
    + """      </Accordion>

"""
)

ANCHOR = "      {/* 欢迎之后紧接着出发前准备"
i = v.index(ANCHOR)
v = v[:i] + IMPRESSION + v[i:]
view.write_text(v, encoding="utf-8")
print("✓ 版式：印象组搬到欢迎卡下面，名创优品接在科技后面")
