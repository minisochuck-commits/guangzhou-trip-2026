#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""owner 2026-09-12 补充：名创优品国际总部大楼刚刚建成，写进「名创优品在广州」。

这是她在琶洲抬头就能看见的东西，比任何数字都直接，所以放在这一章的开头。

核过的事实与出处：
  · 名创优品国际总部在海珠区琶洲西区 AH040228 地块（广州市规划和自然资源局；
    琶洲西区就在广交会展馆以西，腾讯、阿里巴巴、唯品会的总部楼都在那一片）
  · 287.5 米；2021 年 7 月动工，2025 年 7 月主体结构封顶，中建二局承建；
    建成后是名创优品全球业务、品牌运营、产品研发的功能中心（广州日报大洋网 2025-07-05）
  · 总投资约 35 亿元，占地 6,557 ㎡，总建筑面积约 14 万㎡（羊城派 2021-07-29；
    那篇写的规划高度 250 米是开工时的方案，最终封顶高度以广州日报的 287.5 米为准）
  · 2026 年 8 月 12 日通过竣工验收；美国墨菲扬建筑师事务所设计，「修长巨笔」的意象，
    270 度环幕玻璃幕墙，望得见珠江与广州塔（GA环球建筑 2026-08）

版式：正文分两段落组 —— 前四段讲这座楼和这家公司，然后是正佳门口那张照片，
后三段讲照片里的那家店。照片放中间，上下两头的文字都挨着它说的东西。
（那栋新楼没有能用的公开照片：维基共享资源上琶洲西区的图都拍于 2021–2023 年，
封顶之前；报道里的图查不到作者，不按「来源页」那一档收。）
"""
import pathlib
import sys

data = pathlib.Path("lib/trip-data.ts")
s = data.read_text(encoding="utf-8")

start = s.index("/* ------------------------------------------------------------------ */\n/* 名创优品在广州")
end = s.index("\n};\n", s.index("export const MINISO_IN_GZ")) + len("\n};\n")

BLOCK = '''/* ------------------------------------------------------------------ */
/* 名创优品在广州                                                        */
/*                                                                     */
/* 不是公司简介 —— 货盘、店型、企业实力在会议现场讲。页面只写会议讲不了的：*/
/* 她住的那块地就是这个牌子的家，而且是看得见的：琶洲西区那栋 287.5 米的  */
/* 新楼今年 8 月刚验收，正佳广场里那家店她可以自己走进去。               */
/* 数字都带出处，没出处的说法一律不留。                                   */
/*                                                                     */
/* paragraphs 在照片上面（这座楼、这家公司），store 在照片下面（那家店）。*/
/* ------------------------------------------------------------------ */

export const MINISO_IN_GZ: {
  lead: L10n;
  paragraphs: L10n[];
  /** 照片下面那一组：照片拍的就是这家店。 */
  store: L10n[];
  sources: { label: L10n; url: string }[];
} = {
  lead: {
    zh: "你住的琶洲，就是这个牌子的家。",
    en: "Pazhou, where you are staying, is where this brand lives.",
    ar: "بازو، حيث تقيمون، هي موطن هذه العلامة.",
  },
  paragraphs: [
    {
      zh: "从酒店朝西，隔着广交会的展馆，是琶洲西区 —— 腾讯、阿里巴巴、唯品会的总部楼都在那一片。最新的一栋是名创优品国际总部：287.5 米，地上四十层，一圈 270 度的环幕玻璃从头包到脚，站在里面看得见珠江和广州塔。设计它的人说，想做成一支立起来的笔。",
      en: "West of the hotel, on the far side of the Canton Fair halls, is Pazhou West, where Tencent, Alibaba and Vipshop have their headquarters. The newest tower there is MINISO’s: 287.5 metres, forty floors above ground, wrapped top to bottom in a 270-degree curve of glass that looks out on the Pearl River and the Canton Tower. The architects said they wanted a building shaped like a pen stood on its end.",
      ar: "إلى الغرب من الفندق، خلف قاعات معرض كانتون، تقع بازو الغربية، حيث مقارّ تينسنت وعلي بابا وفيب شوب. وأحدث أبراجها برج «ميني سو»: 287.5 مترًا، وأربعون طابقًا فوق الأرض، ملفوفًا من أعلاه إلى أسفله بانحناءة زجاجية بزاوية 270 درجة تطلّ على نهر اللؤلؤ وبرج كانتون. وقال مصمّموه إنهم أرادوا مبنى على هيئة قلم منتصب.",
    },
    {
      zh: "这栋楼 2021 年 7 月动工，2025 年 7 月封顶，今年 8 月 12 日通过竣工验收 —— 你们到广州的时候，它验收才一个月。投资三十五亿元人民币，占地六千五百多平方米，往上盖出十四万平方米。以后名创优品的全球业务、品牌运营和产品研发都在这栋楼里。",
      en: "Work began in July 2021, the frame topped out in July 2025, and the building passed its completion inspection on 12 August this year — one month before you land. It cost 3.5 billion yuan; it stands on a plot of six and a half thousand square metres and holds a hundred and forty thousand. MINISO’s global operations, brand management and product development are all to sit inside it.",
      ar: "بدأ العمل في يوليو 2021، واكتمل الهيكل في يوليو 2025، واجتاز المبنى فحص الإنجاز في 12 أغسطس من هذا العام — أي قبل شهر من وصولكم. كلفته 3.5 مليار يوان، ويقوم على قطعة أرض مساحتها ستة آلاف ونصف متر مربع ليضمّ مئة وأربعين ألف متر مربع. وستقيم فيه عمليات «ميني سو» العالمية وإدارة العلامة وتطوير المنتجات.",
    },
    {
      zh: "公司官网上写的中国总部地址，现在还是琶洲大道 109 号的铭丰广场。也在琶洲 —— 就是你们这几天开会、吃饭、睡觉的这一片。",
      en: "The address the company still gives for its China head office is Mingfeng Plaza, 109 Pazhou Avenue. Also in Pazhou — the same few streets where you will meet, eat and sleep this week.",
      ar: "أما العنوان الذي ما زالت الشركة تعطيه لمقرّها في الصين فهو مجمع مينغفنغ، 109 شارع بازو. وهو أيضًا في بازو — الشوارع نفسها التي ستجتمعون وتأكلون وتنامون فيها هذا الأسبوع.",
    },
    {
      zh: "2013 年它开张的时候，在广州的一个地下室车库里。十三年过去，名创优品在一百一十二个国家和地区都有店；单是这个牌子，2025 年底有 8,151 家 —— 中国内地 4,568 家，海外 3,583 家 —— 那一年营收 195.2 亿元人民币。",
      en: "When it opened in 2013 it was in a basement garage in Guangzhou. Thirteen years on, MINISO trades in more than a hundred and twelve countries and regions; the brand alone ended 2025 with 8,151 stores — 4,568 in mainland China, 3,583 abroad — on revenue of 19.52 billion yuan for the year.",
      ar: "حين فتحت أبوابها عام 2013 كانت في مرآب تحت الأرض في قوانغتشو. وبعد ثلاثة عشر عامًا صارت «ميني سو» تعمل في أكثر من مئة واثنتي عشرة دولة ومنطقة؛ وعلامتها وحدها أنهت عام 2025 بـ8,151 متجرًا — منها 4,568 في الصين القارية و3,583 في الخارج — بإيراد قدره 19.52 مليار يوان في تلك السنة.",
    },
  ],
  store: [
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
      label: { zh: "广州日报：名创优品国际总部封顶，287.5 米", en: "Guangzhou Daily: the MINISO International Headquarters tops out at 287.5 m", ar: "قوانغتشو دايلي: اكتمال هيكل مقر ميني سو الدولي عند 287.5 مترًا" },
      url: "https://news.dayoo.com/guangzhou/202507/05/139995_54844163.htm",
    },
    {
      label: { zh: "羊城派：项目开工（投资、占地与建筑面积）", en: "Yangcheng Pai: the groundbreaking (investment, site and floor area)", ar: "يانغتشنغ باي: انطلاق المشروع (الاستثمار والمساحة)" },
      url: "https://ycpai.ycwb.com/ycppad/content/2021-07/29/content_40170750.html",
    },
    {
      label: { zh: "广州市规划和自然资源局：项目地块与建设单位", en: "Guangzhou Planning Bureau: the plot and the developer", ar: "هيئة التخطيط بقوانغتشو: قطعة الأرض والجهة المطوّرة" },
      url: "https://ghzyj.gz.gov.cn/ywpd/cxgh/ghxkgsgb/phgbnew/gbt/content/mpost_9189139.html",
    },
    {
      label: { zh: "报道：总部大楼 8 月 12 日通过竣工验收（含设计与幕墙）", en: "Report: the tower passed its completion inspection on 12 August (design and curtain wall)", ar: "تقرير: اجتياز البرج فحص الإنجاز في 12 أغسطس (التصميم والواجهة)" },
      url: "https://www.163.com/dy/article/L4L2GKIQ0514ETGI.html",
    },
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

data.write_text(s[:start] + BLOCK + s[end:], encoding="utf-8")
print("✓ 数据：新总部大楼写进 MINISO_IN_GZ，正文拆成照片上下两组")

# ── 收起时的那一行，跟着改 ─────────────────────────────────────────────
i18n = pathlib.Path("lib/trip-i18n.ts")
t = i18n.read_text(encoding="utf-8")
old = '''      "zh": "总部就在你住的琶洲，旗舰店在你要去的正佳广场",
      "en": "The head office is in Pazhou where you are staying; the flagship store is in the mall you are visiting",
      "ar": "المقر في بازو حيث تقيمون، والمتجر الرئيسي في المركز الذي ستزورونه"'''
new = '''      "zh": "琶洲西区那栋 287.5 米的新楼，和正佳广场里的旗舰店",
      "en": "The new 287.5-metre tower in Pazhou West, and the flagship store inside Grandview Mall",
      "ar": "البرج الجديد بارتفاع 287.5 مترًا في بازو الغربية، والمتجر الرئيسي داخل غراندفيو مول"'''
if t.count(old) != 1:
    print(f"✗ guideHints.miniso: 命中 {t.count(old)} 次")
    sys.exit(1)
i18n.write_text(t.replace(old, new, 1), encoding="utf-8")
print("✓ i18n：章提示改成新楼 + 旗舰店")

# ── 版式：照片夹在两组正文中间 ───────────────────────────────────────────
view = pathlib.Path("components/trip/guide-tab.tsx")
v = view.read_text(encoding="utf-8")
old_section = '''          <Prose
            lead={MINISO_IN_GZ.lead}
            paragraphs={MINISO_IN_GZ.paragraphs}
            sources={MINISO_IN_GZ.sources}
            lang={lang}
            photoKey={CHAPTER_PHOTOS.miniso}
          />'''
new_section = '''          {/* 照片不放在开头：开头讲的是琶洲西区那栋新楼，没有能用的公开照片。
              它夹在两组正文中间 —— 上面刚说完这家公司，下面接着讲照片里的那家店。 */}
          <Prose
            lead={MINISO_IN_GZ.lead}
            paragraphs={MINISO_IN_GZ.paragraphs}
            sources={MINISO_IN_GZ.sources}
            lang={lang}
          >
            <GuideFigure photoKey={CHAPTER_PHOTOS.miniso} lang={lang} />
            <div className="space-y-2.5">
              {MINISO_IN_GZ.store.map((paragraph, index) => (
                <p key={index} className={GUIDE.body}>
                  {t(paragraph, lang)}
                </p>
              ))}
            </div>
          </Prose>'''
if v.count(old_section) != 1:
    print(f"✗ 版式: 命中 {v.count(old_section)} 次")
    sys.exit(1)
view.write_text(v.replace(old_section, new_section, 1), encoding="utf-8")
print("✓ 版式：照片移到两组正文之间")
