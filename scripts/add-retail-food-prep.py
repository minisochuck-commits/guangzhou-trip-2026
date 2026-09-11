#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""用户这一轮：烧鹅乳鸽海鲜、北京路、商圈考察（给他们回去写报告用）、
出发前准备按实操重写（Reham 是中国通不用管）、图片。

数据层改动：
- FoodNote / Route 加 imageKey（对应 public/images/<key>.jpg）
- FOOD_NOTES +3：深井烧鹅、石岐乳鸽、海鲜
- ROUTES +1：北京路
- 新增 RETAIL_STUDY：天河路六家商场定位与业态、北京路、报告要点
- PREP 重写：删 Reham 两条；Ahmed/Mohamed 五条实操
"""
import pathlib, re, sys

P = pathlib.Path("lib/trip-data.ts")
s = P.read_text(encoding="utf-8")
n0 = len(s)
miss = []

def rep(a, b, note):
    global s
    c = s.count(a)
    if c != 1:
        miss.append((note, c, a[:70])); return
    s = s.replace(a, b)

# ── 类型：加 imageKey ──────────────────────────────────────────────
rep("export type FoodNote = { id: string; title: L10n; body: L10n; url?: string };",
    "export type FoodNote = { id: string; title: L10n; body: L10n; url?: string; imageKey?: string };",
    "FoodNote 类型")
rep('''export type Route = {
  id: string;
  title: L10n;''', '''export type Route = {
  id: string;
  /** public/images/<imageKey>.jpg，见 lib/image-credits.ts */
  imageKey?: string;
  title: L10n;''', "Route 类型")

# ── 给已有菜和路线挂图 ─────────────────────────────────────────────
for fid, key in [("morning-tea","dimsum"),("changfen","changfen"),("tingzai","congee"),("dessert","ginger"),
                 ("qilou","arcade"),("soup","soup"),("chaoshan-beef","beef"),("white-cut-chicken","chicken"),
                 ("wok-hei","chowfun")]:
    rep(f'''  {{
    id: "{fid}",
    title: {{''', f'''  {{
    id: "{fid}",
    imageKey: "{key}",
    title: {{''', f"菜 {fid} 挂图")
for rid, key in [("huacheng","cbd"),("canton-tower","tower"),("river-cruise","river"),("tianhe","tianhe"),("xiguan","shamian")]:
    rep(f'''  {{
    id: "{rid}",
    title: {{''', f'''  {{
    id: "{rid}",
    imageKey: "{key}",
    title: {{''', f"路线 {rid} 挂图")

# ── 三道菜：烧鹅、乳鸽、海鲜 ───────────────────────────────────────
MORE = '''  {
    id: "roast-goose",
    imageKey: "goose",
    title: { zh: "烧鹅", en: "Roast goose", ar: "الإوز المشوي" },
    body: {
      zh: "广州最出名的一道烧味。正宗的做法来自黄埔长洲岛的深井村：地上挖一口干井，井底埋缸，缸里烧荔枝木炭，鹅用钩子吊在井口的铁枝上，靠井壁的热力烤熟。出来是金红的皮，一咬脆得有声，底下的肉却是嫩的，肥而不腻。斩件上桌，蘸酸梅酱。",
      en: "Guangzhou's most famous roast. The authentic method comes from Shenjing village on Changzhou Island in Huangpu: a dry well is dug, a clay jar set in its floor, lychee-wood charcoal burned inside, and the geese hung from iron bars across the mouth so the heat of the well walls roasts them. What comes out is skin the colour of amber that cracks audibly when bitten, over meat that is still tender — rich without being heavy. Chopped and served with plum sauce.",
      ar: "أشهر مشويّات قوانغتشو. الطريقة الأصيلة من قرية شنجينغ في جزيرة تشانغتشو بهوانغبو: تُحفر بئر جافة، ويُثبَّت جرّة فخارية في قاعها، ويُحرق فيها فحم خشب الليتشي، وتُعلَّق الإوزّات من قضبان حديدية على فوهتها فتنضج بحرارة جدران البئر. والنتيجة جلد بلون الكهرمان يتكسّر بصوت مسموع عند العضّ، فوق لحم لا يزال طريًّا — غنيٌّ دون ثقل. يُقطَّع ويُقدَّم مع صلصة البرقوق.",
    },
    url: "https://lvyou.ycwb.com/2019-04/19/content_30243026.htm",
  },
  {
    id: "squab",
    imageKey: "pigeon",
    title: { zh: "红烧乳鸽", en: "Roast squab", ar: "الحمام الصغير المشوي" },
    body: {
      zh: "广东人说「一鸽胜九鸡」。最有名的是中山石岐乳鸽 —— 一百多年前华侨从海外带回良种和本地鸽杂交出来的品种，先卤后炸，皮脆得像纸，肉嫩到骨头都是香的。从广州开车一小时就是中山，但广州的粤菜馆几乎都有这道菜，一人一只，用手拿着吃。",
      en: "The Cantonese say one squab beats nine chickens. The most celebrated is the Shiqi squab of Zhongshan — a breed crossed a century ago from birds that returning overseas Chinese brought home — braised, then fried, so the skin turns paper-crisp over meat tender to the bone. Zhongshan is an hour's drive from Guangzhou, but nearly every Cantonese restaurant in the city serves it: one bird each, eaten with the hands.",
      ar: "يقول الكانتونيون إن حمامةً صغيرة تغلب تسع دجاجات. وأشهرها حمام شيتشي من تشونغشان — سلالة هُجّنت قبل قرن من طيور أعادها الصينيون المغتربون — يُطهى في المرق ثم يُقلى فيصبح الجلد رقيقًا كالورق فوق لحمٍ طريّ حتى العظم. تشونغشان على بعد ساعة بالسيارة من قوانغتشو، لكن كل مطعم كانتوني في المدينة تقريبًا يقدّمه: طائر لكل شخص، يُؤكل باليد.",
    },
    url: "https://www.zs.gov.cn/zjzs/lygg/mytc/content/post_2399451.html",
  },
  {
    id: "seafood",
    imageKey: "seafood",
    title: { zh: "海鲜：即捞即食", en: "Seafood, netted and cooked on the spot", ar: "المأكولات البحرية: تُصطاد وتُطهى فورًا" },
    body: {
      zh: "广州人吃海鲜的规矩是「生猛」—— 必须活的。黄沙水产市场从 1994 年开到今天，一年交易三十二万吨，是全国活鲜的价格风向标；很多人直接在市场里挑好活鱼活虾活蟹，拎到旁边的酒楼加工，二十分钟后上桌。一条鱼最经典的做法是清蒸：只放姜丝葱丝，蒸熟淋一勺滚油和豉油，鱼有多新鲜一口就知道。",
      en: "The Cantonese rule for seafood is that it must be alive. Huangsha market has traded since 1994 — 320,000 tonnes a year, the price benchmark for live seafood across China — and many people simply choose their fish, prawns and crab from the tanks and carry them to the restaurants next door, where they are on the table twenty minutes later. The classic treatment for a fish is steaming: ginger and spring onion only, then a spoon of smoking oil and soy over the top. One bite tells you how fresh it was.",
      ar: "قاعدة الكانتونيين في المأكولات البحرية أن تكون حيّة. يعمل سوق هوانغشا منذ 1994 — بحجم تداول 320 ألف طن سنويًا، وهو المرجع السعري للمأكولات البحرية الحيّة في الصين كلّها — ويختار كثيرون أسماكهم وروبيانهم وسرطاناتهم من الأحواض مباشرة ويحملونها إلى المطاعم المجاورة لتكون على المائدة بعد عشرين دقيقة. والطريقة الكلاسيكية للسمك هي التبخير: زنجبيل وبصل أخضر فقط، ثم ملعقة زيت مدخّن وصويا فوقه. ولقمة واحدة تخبرك بمدى طزاجته.",
    },
    url: "https://www.gz.gov.cn/ysgz/xwdt/ysdt/content/post_10421238.html",
  },
'''
rep('''  {
    id: "soup",
    imageKey: "soup",
    title: {''', MORE + '''  {
    id: "soup",
    imageKey: "soup",
    title: {''', "插入三道菜")

# ── 北京路路线 ──────────────────────────────────────────────────────
BJL = '''  {
    id: "beijinglu",
    imageKey: "beijinglu",
    title: {
      zh: "北京路步行街 · 脚下一千年",
      en: "Beijing Road · a thousand years underfoot",
      ar: "شارع بكين · ألف عام تحت الأقدام",
    },
    duration: {
      zh: "约 2–3 小时（规划参考）",
      en: "About 2–3 hours (planning estimate)",
      ar: "نحو 2–3 ساعات (تقدير تخطيطي)",
    },
    bestFor: {
      zh: "想在一条街上同时看到最老的广州和最热闹的广州，来这里；晚上灯亮以后人最多。",
      en: "For the oldest Guangzhou and the busiest Guangzhou on a single street; busiest after the lights come on.",
      ar: "لرؤية أقدم قوانغتشو وأكثرها ازدحامًا في شارع واحد؛ وأشدّ الازدحام بعد إضاءة الأنوار.",
    },
    summary: {
      zh: "广州建城两千二百年，城市中轴线从来没挪过，北京路就是这条中轴的核心段。2002 年修路时挖出了从唐代到民国的十一层路面，现在盖着玻璃让你直接踩在上面走 —— 脚下一千年。主街一公里、步行区四点七公里，一千六百多个品牌、五十二家老字号。",
      en: "Guangzhou was founded twenty-two centuries ago and its central axis has never moved; Beijing Road is the heart of it. Roadworks in 2002 uncovered eleven layers of street surface from the Tang dynasty to the Republic, now sealed under glass so you walk directly over them — a thousand years underfoot. A one-kilometre main street, 4.7 kilometres of pedestrian zone, over sixteen hundred brands and fifty-two long-established shops.",
      ar: "أُسّست قوانغتشو قبل اثنين وعشرين قرنًا ولم يتحرّك محورها المركزي قط؛ وشارع بكين قلبُ هذا المحور. كشفت أعمال الطريق عام 2002 عن إحدى عشرة طبقة من سطح الشارع من عهد تانغ إلى عهد الجمهورية، مغطّاة الآن بالزجاج لتمشوا فوقها مباشرة — ألف عام تحت الأقدام. شارع رئيسي بطول كيلومتر، ومنطقة مشاة 4.7 كيلومترات، وأكثر من ألف وستمئة علامة تجارية واثنان وخمسون متجرًا عريقًا.",
    },
    steps: [
      {
        zh: "酒店 → 北京路北段（千年古道玻璃罩）→ 沿步行街往南 → 老字号与广百 → 返回。",
        en: "Hotel → north end of Beijing Road (the glass over the ancient road) → south along the pedestrian street → the old shops and Guangbai department store → back.",
        ar: "الفندق ← الطرف الشمالي لشارع بكين (الزجاج فوق الطريق القديم) ← جنوبًا عبر شارع المشاة ← المتاجر العريقة ومتجر قوانغباي ← العودة.",
      },
    ],
    transport: {
      zh: "打车到北京路步行街口；街内只能步行。",
      en: "Taxi to the entrance of the pedestrian street; inside it is walking only.",
      ar: "سيارة أجرة إلى مدخل شارع المشاة؛ وداخله المشي فقط.",
    },
    tickets: {
      zh: "免费。古道遗址露天可看；店铺营业时间以现场为准。",
      en: "Free. The ancient-road site is viewable in the open; shop hours as posted.",
      ar: "مجاني. موقع الطريق القديم مكشوف للعيان؛ ومواعيد المتاجر حسب المعلن.",
    },
    copy: [
      {
        id: "beijinglu-addr",
        label: { zh: "给司机看：北京路步行街", en: "Show the driver: Beijing Road", ar: "أظهرها للسائق: شارع بكين" },
        chinese: "请带我去北京路步行街，广州市越秀区北京路。",
      },
    ],
    sources: [
      {
        label: { zh: "越秀区政府：北京路千年古道遗址", en: "Yuexiu District government: the Beijing Road ancient-road site", ar: "حكومة منطقة يوى شيو: موقع الطريق القديم في شارع بكين" },
        url: "http://www.beijinglu.yuexiu.gov.cn/bjl/pc_bjl/lydl_bjl/jd_bjl/qnsy_bjl/20181116/detail-208456.shtml",
      },
    ],
  },
'''
rep('''  {
    id: "xiguan",
    imageKey: "shamian",
    title: {''', BJL + '''  {
    id: "xiguan",
    imageKey: "shamian",
    title: {''', "插入北京路")

# ── 商圈考察 ────────────────────────────────────────────────────────
RETAIL = '''
/* ------------------------------------------------------------------ */
/* 商圈考察                                                              */
/*                                                                     */
/* Reham 做招商、Ahmed 管区域。他们公费来，回去要向老板汇报学到了什么。      */
/* 这一节按「一个做零售的人站在天河路上该看懂什么」写：整体骨架、        */
/* 六家商场各自的位置、北京路作对照、最后四点能直接写进报告。            */
/* 数字出自天河区政府、广州市政府与新华网。                              */
/* ------------------------------------------------------------------ */

export type MallCard = {
  id: string;
  imageKey?: string;
  name: L10n;
  /** 一句话定位。 */
  tier: L10n;
  /** 事实：开业、体量、锚点业态、成绩。 */
  facts: L10n;
};

export const RETAIL_STUDY: {
  lead: L10n;
  intro: L10n[];
  malls: MallCard[];
  beijinglu: L10n;
  takeaways: L10n[];
  sources: { label: L10n; url: string }[];
} = {
  lead: {
    zh: "一条 2.8 公里的路，一年做出一万亿元的生意。",
    en: "A road 2.8 kilometres long that does a trillion yuan of business a year.",
    ar: "طريق طوله 2.8 كيلومتر يحقّق تريليون يوان من الأعمال سنويًا.",
  },
  intro: [
    {
      zh: "天河路商圈西起天河立交、东到岗顶，2.8 公里、4.5 平方公里，商业面积二百四十万平方米，十四家大型综合体。日客流一百五十万、年八亿人次、年销售额过万亿元，全省第一；2024 年全国商圈商业力榜单第三，高端商业载体数量全国第一。业态里零售占 57%、餐饮 24%、商务配套 9%、休闲旅游 8%、文化艺术 2%。",
      en: "The Tianhe Road district runs 2.8 kilometres from the Tianhe interchange to Gangding — 4.5 square kilometres, 2.4 million square metres of retail, fourteen large complexes. A million and a half visitors a day, eight hundred million a year, annual sales above a trillion yuan, first in the province; third in the 2024 national ranking of shopping districts and first for the number of high-end retail properties. The mix is 57 percent retail, 24 percent dining, 9 percent business services, 8 percent leisure and tourism, 2 percent culture and arts.",
      ar: "تمتدّ منطقة شارع تيانخه 2.8 كيلومتر من تقاطع تيانخه إلى قانغدينغ — 4.5 كيلومتر مربع، و2.4 مليون متر مربع من التجزئة، وأربعة عشر مجمّعًا كبيرًا. مليون ونصف زائر يوميًا، وثمانمئة مليون سنويًا، ومبيعات سنوية تتجاوز تريليون يوان، الأولى في المقاطعة؛ والثالثة في التصنيف الوطني لمناطق التسوّق لعام 2024، والأولى في عدد العقارات التجارية الفاخرة. والمزيج: 57% تجزئة، 24% مطاعم، 9% خدمات أعمال، 8% ترفيه وسياحة، 2% ثقافة وفنون.",
    },
    {
      zh: "它的骨架是地铁：1 号线和 3 号线在体育西路站交汇，体育中心站在另一头，各家商场的地下层用通道连成一片，人从地铁出来不上地面就能走完整条路。同一条路上从奢侈品到大众消费分成明确的层次，互不重叠 —— 这是它能容下十四家综合体而不打架的原因。",
      en: "Its skeleton is the metro: Lines 1 and 3 cross at Tiyu Xilu, Tiyu Zhongxin sits at the other end, and the basement levels of the malls are joined by walkways so a person can walk the whole road from the metro without surfacing. Along that one road the positioning steps clearly from luxury down to mass market with little overlap — which is why fourteen complexes can share it without cannibalising one another.",
      ar: "هيكلها هو المترو: يتقاطع الخطان 1 و3 في محطة تييو شيلو، وتقع محطة تييو تشونغشين في الطرف الآخر، وطوابق القبو في المراكز متصلة بممرات بحيث يمكن للمرء أن يقطع الطريق كله من المترو دون أن يصعد إلى السطح. وعلى هذا الطريق الواحد يتدرّج التموضع بوضوح من الفخامة إلى السوق الجماهيرية دون تداخل يُذكر — ولهذا يمكن لأربعة عشر مجمّعًا أن تتقاسمه دون أن يأكل بعضها بعضًا.",
    },
  ],
  malls: [
    {
      id: "taikoo",
      imageKey: "taikoo",
      name: { zh: "太古汇", en: "Taikoo Hui", ar: "تايكو هوي" },
      tier: { zh: "顶端：奢侈品与生活方式", en: "The top: luxury and lifestyle", ar: "القمة: الفخامة وأسلوب الحياة" },
      facts: {
        zh: "2011 年开业，香港太古地产。三十多个奢侈品牌 —— 爱马仕、路易威登、香奈儿、迪奥、普拉达 —— 高档品牌占比 46.8%，商圈最高；楼上是文华东方酒店，里面有方所书店。2021 年销售额一百亿元，全国购物中心第十一。",
        en: "Opened 2011 by Hong Kong's Swire Properties. More than thirty luxury houses — Hermès, Louis Vuitton, Chanel, Dior, Prada — with high-end brands at 46.8 percent of the mix, the highest in the district; the Mandarin Oriental above, the Fangsuo bookshop inside. Sales of ten billion yuan in 2021, eleventh among all malls in China.",
        ar: "افتُتح عام 2011 من شركة سواير العقارية في هونغ كونغ. أكثر من ثلاثين دارًا فاخرة — هيرميس ولوي فيتون وشانيل وديور وبرادا — وتبلغ نسبة العلامات الفاخرة 46.8% من المزيج، وهي الأعلى في المنطقة؛ فندق ماندارين أورينتال فوقه، ومكتبة فانغسوو داخله. مبيعات بعشرة مليارات يوان عام 2021، الحادي عشر بين جميع المراكز في الصين.",
      },
    },
    {
      id: "parc-central",
      name: { zh: "天环 Parc Central", en: "Parc Central", ar: "بارك سنترال" },
      tier: { zh: "中高端：开放式、低密度、体验型", en: "Upper-mid: open-air, low-density, experiential", ar: "فوق المتوسط: مفتوح، منخفض الكثافة، تجريبي" },
      facts: {
        zh: "2016 年开业，十一万平方米，地上只有两层、地下三层，正佳和天河城之间的一片开放式广场。苹果直营店、特斯拉体验中心在这里。它证明了一件事：在最贵的地段上，留白本身就是定位。",
        en: "Opened 2016, 110,000 square metres, only two floors above ground and three below — an open plaza between Grandview and Teemall. The Apple store and the Tesla centre are here. It proves one thing: on the most expensive ground in the city, open space is itself a positioning.",
        ar: "افتُتح عام 2016، بمساحة 110 آلاف متر مربع، طابقان فقط فوق الأرض وثلاثة تحتها — ساحة مفتوحة بين غراندفيو وتيمول. متجر آبل ومركز تسلا هنا. ويثبت أمرًا واحدًا: على أغلى أرض في المدينة، الفضاء المفتوح نفسه تموضعٌ.",
      },
    },
    {
      id: "grandview",
      name: { zh: "正佳广场", en: "Grandview Mall", ar: "غراندفيو مول" },
      tier: { zh: "家庭与游客：用娱乐拉客流的目的地型", en: "Families and visitors: a destination that pulls traffic with entertainment", ar: "العائلات والزوّار: وجهة تجذب الزحام بالترفيه" },
      facts: {
        zh: "2005 年开业，四十二万平方米，地上七层地下两层半。里面有一座室内空中极地海洋馆和一座自然科学博物馆 —— 外地游客和带孩子的家庭为这两样来，顺便把整栋楼逛完。国货美妆在这里卖得特别好。销售额七十五亿元，全国购物中心第十三。",
        en: "Opened 2005, 420,000 square metres, seven floors up and two and a half down. Inside are an indoor aerial polar aquarium and a natural science museum — visitors from other cities and families with children come for those and end up walking the whole building; domestic beauty brands sell especially well here. Sales of 7.5 billion yuan, thirteenth in the country.",
        ar: "افتُتح عام 2005، بمساحة 420 ألف متر مربع، سبعة طوابق فوق الأرض واثنان ونصف تحتها. في داخله حوض قطبي داخلي معلّق ومتحف للعلوم الطبيعية — يأتي زوّار المدن الأخرى والعائلات ذوات الأطفال لأجلهما فينتهون بجولة في المبنى كله؛ وتُباع علامات التجميل المحلية هنا جيدًا. مبيعات بـ7.5 مليارات يوان، الثالث عشر في البلاد.",
      },
    },
    {
      id: "teemall",
      name: { zh: "天河城", en: "Teemall", ar: "تيمول" },
      tier: { zh: "大众中端：流量之王", en: "Mass mid-market: the traffic king", ar: "السوق المتوسطة الجماهيرية: ملك الزحام" },
      facts: {
        zh: "1996 年开业，十六万平方米，中国第一个真正意义上的购物中心，业内叫它「中国第一 MALL」。就在体育西路站正上方，地铁一出来就是它。定位中端，客流常年商圈第一，销售额常年全国购物中心前十 —— 三十年了还在前十。",
        en: "Opened 1996, 160,000 square metres, the first true shopping centre in China — the trade calls it China's first mall. It sits directly over Tiyu Xilu station; the metro exits into it. Mid-market positioning, the highest footfall in the district year after year, and sales that have stayed in the national top ten for thirty years.",
        ar: "افتُتح عام 1996، بمساحة 160 ألف متر مربع، أول مركز تسوّق حقيقي في الصين — يسمّيه أهل المهنة «أول مول في الصين». يقع مباشرة فوق محطة تييو شيلو؛ ومخارج المترو تفضي إليه. تموضع متوسط، وأعلى إقبال في المنطقة عامًا بعد عام، ومبيعات بقيت ضمن العشرة الأوائل وطنيًا طوال ثلاثين عامًا.",
      },
    },
    {
      id: "onelink",
      name: { zh: "万菱汇", en: "Onelink Walk", ar: "وان لينك ووك" },
      tier: { zh: "年轻白领：早午餐与书店", en: "Young professionals: brunch and bookshops", ar: "الشباب المهنيون: الفطور المتأخر والمكتبات" },
      facts: {
        zh: "客群标签是时尚白领。业态上用早午餐、西西弗书店这类「待得住」的东西留人，而不是靠奢侈品。在太古汇隔壁做这个定位，是有意错开。",
        en: "Its crowd is the fashionable office worker. It keeps people with things to linger over — brunch, the Sisyphe bookshop — rather than with luxury goods. Doing that next door to Taikoo Hui is a deliberate sidestep.",
        ar: "جمهوره الموظف الأنيق. يُبقي الناس بأشياء يتمهّلون عندها — الفطور المتأخر، ومكتبة سيزيف — لا بالسلع الفاخرة. وفعل ذلك إلى جوار تايكو هوي انحرافٌ مقصود.",
      },
    },
    {
      id: "fashion-tianhe",
      name: { zh: "时尚天河", en: "Fashion Tianhe", ar: "فاشن تيانخه" },
      tier: { zh: "地下主题街区：平价与游客", en: "An underground themed street: budget and tourists", ar: "شارع تحت الأرض بطابع خاص: أسعار معقولة وسيّاح" },
      facts: {
        zh: "整个开在天河体育中心的地下，做主题街区，客群是外地游客和年轻人，价格带最低。它把体育中心地下这块没人用的空间变成了商圈的一部分。",
        en: "Built entirely beneath the Tianhe Sports Centre as themed streets, aimed at visitors and the young, with the lowest price band on the road. It turned an unused space under the stadium into part of the district.",
        ar: "بُني كليًّا تحت مركز تيانخه الرياضي على هيئة شوارع ذات طابع خاص، موجّهًا للزوّار والشباب، وبأدنى شريحة أسعار في الطريق. حوّل فراغًا غير مستخدم تحت الملعب إلى جزء من المنطقة.",
      },
    },
  ],
  beijinglu: {
    zh: "作对照的是老城的北京路：两千二百年没挪过的城市中轴，主街一公里、步行区四点七公里，一千六百多个品牌里有五十二家老字号，街中间玻璃罩着唐代到民国的十一层路面。天河路靠地铁和综合体，北京路靠历史和步行街 —— 两种完全不同的商圈逻辑，相距四公里。",
    en: "The counterpoint is Beijing Road in the old city: a city axis unmoved for twenty-two centuries, a one-kilometre main street and 4.7 kilometres of pedestrian zone, fifty-two long-established shops among sixteen hundred brands, and eleven layers of road from the Tang dynasty to the Republic under glass in the middle of the street. Tianhe Road runs on the metro and the mega-complex; Beijing Road runs on history and the pedestrian street — two entirely different logics, four kilometres apart.",
    ar: "والنقيض هو شارع بكين في المدينة القديمة: محور مدينة لم يتحرّك اثنين وعشرين قرنًا، شارع رئيسي بطول كيلومتر ومنطقة مشاة 4.7 كيلومترات، واثنان وخمسون متجرًا عريقًا بين ألف وستمئة علامة، وإحدى عشرة طبقة من الطريق من عهد تانغ إلى الجمهورية تحت الزجاج في وسط الشارع. يقوم شارع تيانخه على المترو والمجمّعات الضخمة؛ ويقوم شارع بكين على التاريخ وشارع المشاة — منطقان مختلفان تمامًا، تفصل بينهما أربعة كيلومترات.",
  },
  takeaways: [
    {
      zh: "分层不重叠：同一条路上从太古汇到时尚天河，每家的价格带和客群都不一样，所以十四家综合体能共存。",
      en: "Tiered, not overlapping: from Taikoo Hui down to Fashion Tianhe, each mall on the same road holds a different price band and crowd, which is how fourteen complexes coexist.",
      ar: "متدرّج لا متداخل: من تايكو هوي إلى فاشن تيانخه، يحتلّ كل مركز في الطريق نفسه شريحة أسعار وجمهورًا مختلفين، وهكذا تتعايش أربعة عشر مجمّعًا.",
    },
    {
      zh: "地铁是骨架，地下通道是血管：客流从体育西路站涌出来，在地下就被分配到各家商场。",
      en: "The metro is the skeleton and the underground walkways the veins: footfall pours out of Tiyu Xilu station and is distributed among the malls before it reaches the surface.",
      ar: "المترو هو الهيكل والممرات تحت الأرض هي الأوردة: يتدفّق الزحام من محطة تييو شيلو ويتوزّع على المراكز قبل أن يبلغ السطح.",
    },
    {
      zh: "用体验拉客流：海洋馆、博物馆、苹果店、书店、早午餐 —— 每家都有一样让人专门来、来了就待很久的东西，零售是顺带的。",
      en: "Experience pulls the traffic: an aquarium, a museum, an Apple store, a bookshop, brunch — each mall has one thing people come for specifically and stay long for, and the retail rides on it.",
      ar: "التجربة تجذب الزحام: حوض مائي، متحف، متجر آبل، مكتبة، فطور متأخر — لكل مركز شيء واحد يأتي الناس لأجله تحديدًا ويطيلون المكوث عنده، والتجزئة تركب عليه.",
    },
    {
      zh: "留白也是定位：天环在最贵的地段只盖两层，用开放广场和低密度做出了自己的位置。",
      en: "Open space is a positioning too: Parc Central built only two storeys on the most expensive ground and made its place with a plaza and low density.",
      ar: "الفضاء المفتوح تموضعٌ أيضًا: بنى بارك سنترال طابقين فقط على أغلى أرض وصنع مكانه بساحة وكثافة منخفضة.",
    },
  ],
  sources: [
    {
      label: { zh: "天河区政府：天河路商圈", en: "Tianhe District government: the Tianhe Road district", ar: "حكومة منطقة تيانخه: منطقة شارع تيانخه" },
      url: "http://www.thnet.gov.cn/zjth/tzth/zlpt/content/post_9126462.html",
    },
    {
      label: { zh: "天河区政府：「中国第一 MALL」天河城迎变", en: "Tianhe District government: Teemall, China's first mall", ar: "حكومة منطقة تيانخه: تيمول، أول مول في الصين" },
      url: "http://www.thnet.gov.cn/zjth/tzth/tzdt/tzthtw/content/post_10210007.html",
    },
    {
      label: { zh: "广州市政府：正佳广场", en: "Guangzhou government: Grandview Mall", ar: "حكومة قوانغتشو: غراندفيو مول" },
      url: "https://www.gz.gov.cn/zfjgzy/gzswhgdlyj/ggfw/lytj/content/post_2991523.html",
    },
    {
      label: { zh: "新华网瞭望：广州天河区商圈「流量密码」", en: "Xinhua Outlook: the Tianhe district's traffic formula", ar: "شينخوا أوتلوك: معادلة الزحام في منطقة تيانخه" },
      url: "http://lw.news.cn/2024-03/11/c_1310767201.htm",
    },
    {
      label: { zh: "越秀区政府：北京路千年古道遗址", en: "Yuexiu District government: the Beijing Road ancient-road site", ar: "حكومة منطقة يوى شيو: موقع الطريق القديم في شارع بكين" },
      url: "http://www.beijinglu.yuexiu.gov.cn/bjl/pc_bjl/lydl_bjl/jd_bjl/qnsy_bjl/20181116/detail-208456.shtml",
    },
  ],
};

/* ------------------------------------------------------------------ */
/* 常见的文化差异                                                        */'''
rep('''
/* ------------------------------------------------------------------ */
/* 常见的文化差异                                                        */''', RETAIL, "插入 RETAIL_STUDY")

# ── 出发前准备重写：删 Reham 两条；Ahmed/Mohamed 五条实操 ────────────
ps = s.find("export const PREP: PrepItem[] = [")
pe = s.find("\n];", ps) + 3
PREP = '''export const PREP: PrepItem[] = [
  {
    id: "payment",
    audience: ["ahmed", "hassan"],
    title: { zh: "支付：出发前就把支付宝弄好", en: "Payment: set up Alipay before you fly", ar: "الدفع: جهّزوا أليباي قبل السفر" },
    lines: [
      {
        zh: "在开罗就装好支付宝，用护照实名，绑一张 Visa 或 Mastercard —— 境外手机号能收验证码就行。国际卡付款有手续费（约 3%），单笔约合一千美元、一年约一万美元的额度。",
        en: "Install Alipay in Cairo, verify with your passport, and bind a Visa or Mastercard — a foreign number that receives SMS is enough. International cards carry a fee of about 3 percent, with limits of roughly US$1,000 per payment and US$10,000 a year.",
        ar: "ثبّتوا أليباي في القاهرة، وتحقّقوا بجواز السفر، واربطوا بطاقة فيزا أو ماستركارد — يكفي رقم هاتف أجنبي يستقبل الرسائل. وللبطاقات الدولية رسوم نحو 3%، بحدود نحو ألف دولار للعملية وعشرة آلاف دولار سنويًا.",
      },
      {
        zh: "微信支付也绑一张，有的店只认其中一个。Chuck 的备用金到账后，先在便利店做一笔小额试付。",
        en: "Bind a card to WeChat Pay as well; some shops take only one of the two. Once Chuck's float has arrived, make one small test payment at a convenience store.",
        ar: "اربطوا بطاقة بـ«وي تشات باي» أيضًا؛ فبعض المتاجر لا تقبل إلا أحدهما. وبعد وصول المبلغ الاحتياطي من Chuck، نفّذوا دفعة تجريبية صغيرة في متجر صغير.",
      },
      {
        zh: "带少量现金。这里几乎没人用现金，小店找不开大额纸币。",
        en: "Carry a little cash. Almost nobody uses it here, and small shops cannot break large notes.",
        ar: "احملوا قليلًا من النقد. لا يكاد أحد يستخدمه هنا، والمتاجر الصغيرة لا تملك فكّة للأوراق الكبيرة.",
      },
    ],
  },
  {
    id: "taxi",
    audience: ["ahmed", "hassan"],
    title: { zh: "打车：滴滴有英文", en: "Taxis: DiDi works in English", ar: "سيارات الأجرة: ديدي يعمل بالإنجليزية" },
    lines: [
      {
        zh: "装滴滴，界面切成英文，境外手机号能注册，可以绑外卡；和司机的聊天会自动翻译。支付宝里也有打车入口。",
        en: "Install DiDi, switch it to English, register with your foreign number, bind a foreign card; chat with the driver is translated automatically. Alipay also has a ride-hailing entry inside it.",
        ar: "ثبّتوا ديدي، وحوّلوه إلى الإنجليزية، وسجّلوا برقمكم الأجنبي، واربطوا بطاقة أجنبية؛ والمحادثة مع السائق تُترجم تلقائيًا. وفي أليباي أيضًا مدخل لطلب السيارات.",
      },
      {
        zh: "出租车照样能拦。上车前把本页的中文地址卡举给司机看，下车扫码付。",
        en: "Street taxis can still be hailed. Before getting in, show the driver the Chinese address card from this page; pay by scanning when you get out.",
        ar: "لا يزال بإمكانكم إيقاف سيارات الأجرة في الشارع. قبل الركوب أظهروا للسائق بطاقة العنوان الصينية من هذه الصفحة، وادفعوا بالمسح عند النزول.",
      },
    ],
  },
  {
    id: "maps-vpn",
    audience: ["ahmed", "hassan"],
    title: { zh: "地图与上网", en: "Maps and getting online", ar: "الخرائط والاتصال بالإنترنت" },
    lines: [
      {
        zh: "Google 地图在中国用不了。装高德地图，有英文版；出发前把酒店和要去的地方先收藏好。",
        en: "Google Maps does not work in China. Install Amap, which has an English version, and save the hotel and your destinations before you fly.",
        ar: "خرائط غوغل لا تعمل في الصين. ثبّتوا «أماب» الذي له نسخة إنجليزية، واحفظوا الفندق ووجهاتكم قبل السفر.",
      },
      {
        zh: "WhatsApp、Google、Instagram 在中国都要 VPN，出发前装好并测试一次；不保证一定能用，所以重要联系人也加个微信。",
        en: "WhatsApp, Google and Instagram all need a VPN in China; install and test one before departure. It is not guaranteed to work, so add your key contacts on WeChat as well.",
        ar: "واتساب وغوغل وإنستغرام تحتاج كلها إلى VPN في الصين؛ ثبّتوا واحدًا واختبروه قبل السفر. ولا ضمان لعمله، فأضيفوا جهات اتصالكم المهمة على «وي تشات» أيضًا.",
      },
      {
        zh: "Chuck 给 Mohamed 一张中国 SIM 卡，返程后归还；只有一张，Mohamed 开热点给 Ahmed，落地一起测一次。",
        en: "Chuck gives Mohamed one Chinese SIM, to be returned after the trip; with a single card, Mohamed shares a hotspot with Ahmed — test it together on landing.",
        ar: "يعطي Chuck لـ Mohamed شريحة صينية واحدة تُعاد بعد الرحلة؛ وبشريحة واحدة يشارك Mohamed نقطة اتصال مع Ahmed — اختبروها معًا عند الهبوط.",
      },
    ],
  },
  {
    id: "plug-passport",
    audience: ["ahmed", "hassan"],
    title: { zh: "插头与护照", en: "Plugs and passport", ar: "القوابس وجواز السفر" },
    lines: [
      {
        zh: "中国是 220 伏，插座是 A、C、I 三种型。高档酒店多有万能插座，带一个转换头保险。",
        en: "China runs on 220 volts with type A, C and I sockets. Good hotels mostly have universal outlets, but carry an adapter to be safe.",
        ar: "الصين على 220 فولت بمقابس من الأنواع A وC وI. ومعظم الفنادق الجيدة فيها مقابس عالمية، لكن احملوا محوّلًا احتياطًا.",
      },
      {
        zh: "酒店入住必须用护照原件登记，这是法律规定。护照随身带，景点和火车站有时也查。",
        en: "Hotels must register you with your original passport; that is the law. Keep it on you — attractions and railway stations sometimes ask for it too.",
        ar: "يجب أن تسجّلكم الفنادق بأصل جواز السفر؛ هذا هو القانون. احتفظوا به معكم — فالمعالم ومحطات القطار تطلبه أحيانًا أيضًا.",
      },
    ],
  },
  {
    id: "weather",
    title: {
      zh: "天气与穿什么",
      en: "Weather and what to wear",
      ar: "الطقس وماذا ترتدي",
    },
    lines: [
      {
        zh: "九月下旬的广州还是夏天：往年这个月白天平均 32℃ 上下、夜里 24℃ 上下，空气潮，走一段路就出汗。带轻薄透气的衣服。",
        en: "Late September in Guangzhou is still summer: in an average September the days run around 32°C and the nights around 24°C, and the air is humid enough that a short walk makes you sweat. Pack light, breathable clothes.",
        ar: "أواخر سبتمبر في قوانغتشو لا يزال صيفًا: في سبتمبر المعتاد تبلغ حرارة النهار نحو 32 درجة والليل نحو 24 درجة، والجو رطب إلى حدّ يجعل المشي القصير يُعرِّق. فاحمل ملابس خفيفة تسمح بمرور الهواء.",
      },
      {
        zh: "九月也是雨月，月均降水接近 190 毫米。带一把折叠伞，别指望天天晴。",
        en: "September is also a wet month — close to 190 mm of rain on average. Bring a folding umbrella; don't count on clear days.",
        ar: "وسبتمبر شهر ممطر أيضًا، إذ يبلغ متوسط الأمطار نحو 190 ملم. فخذ مظلة قابلة للطي ولا تعوّل على صفاء الجو.",
      },
      {
        zh: "室内冷气开得足，会议室、商场和车里都偏凉，随身带一件薄外套。",
        en: "Air conditioning indoors is strong — meeting rooms, malls and cars all run cold. Keep a light jacket with you.",
        ar: "والتكييف داخل المباني قوي، فقاعات الاجتماعات والمراكز التجارية والسيارات باردة. احتفظ بسترة خفيفة معك.",
      },
      {
        zh: "以上是往年九月的月平均值，不是这几天的预报。出发前和每天早上看一次当天预报。",
        en: "These are average figures for September in past years, not a forecast for these particular days. Check the actual forecast before you fly and again each morning.",
        ar: "هذه متوسطات سبتمبر في السنوات الماضية وليست توقعًا لهذه الأيام تحديدًا. راجع النشرة الفعلية قبل السفر وكل صباح.",
      },
    ],
  },
];'''
if ps < 0 or pe < 3:
    print("PREP 锚点未命中"); sys.exit(1)
s = s[:ps] + PREP + s[pe:]

if miss:
    print(f"未命中 {len(miss)} 处：")
    for n, c, a in miss: print(f"  ✗ [{c}] {n}\\n     {a}")
    sys.exit(1)
P.write_text(s, encoding="utf-8")
print(f"OK：{n0} → {len(s)} 字节。菜 {s.count('imageKey: ')} 处挂图。")
