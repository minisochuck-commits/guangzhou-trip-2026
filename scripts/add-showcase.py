#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""给指南加「广州有多强」和「食在广州」两大块。

用户这次把目的说清楚了：让埃及同事看到中国有多强大，才会敬仰、给政策、认真对待。
所以这两块要的是体量与分量，不是客气的小品。数字全部出自政府公报 / 世界银行 /
官方新闻，写进 sources；换算美元只做量级对比，标明汇率假设。
"""
import pathlib
import sys

P = pathlib.Path("lib/trip-data.ts")
s = P.read_text(encoding="utf-8")
n0 = len(s)

ANCHOR = "export const MOSQUES: PlaceCard[] = ["
if s.count(ANCHOR) != 1:
    print("锚点未命中"); sys.exit(1)

BLOCK = r'''
/* ------------------------------------------------------------------ */
/* 这座城有多大                                                          */
/*                                                                     */
/* 目的很直接：让客人看到体量。数字一律取最新年度官方口径：             */
/* 2025 年广州统计公报、广州港务局、民航局、广州地铁、广交会官方通报、   */
/* 大湾区门户网；埃及 GDP 取世界银行 2024 年数。美元换算只为量级对比。    */
/* ------------------------------------------------------------------ */

export type StatTile = {
  id: string;
  /** 大字。保持数字本身，不带单位。 */
  value: string;
  /** 数字后面的单位或短语。 */
  unit: L10n;
  /** 这个数字意味着什么，一句。 */
  note: L10n;
};

export const CITY_SCALE: {
  lead: L10n;
  intro: L10n[];
  tiles: StatTile[];
  sources: { label: L10n; url: string }[];
} = {
  lead: {
    zh: "一座城市的经济总量，超过埃及全国。",
    en: "One city with a larger economy than all of Egypt.",
    ar: "مدينةٌ واحدة اقتصادُها أكبر من اقتصاد مصر كلّها.",
  },
  intro: [
    {
      zh: "2025 年广州的地区生产总值是 3.2 万亿元人民币，按 2025 年约 7.2 的汇率折合四千四百多亿美元；世界银行给出的埃及 2024 年全国 GDP 是 3890 亿美元。这只是广州一座城，常住人口一千九百多万。",
      en: "Guangzhou's GDP in 2025 was 3.2 trillion yuan — about 440 billion US dollars at 2025's rate of roughly 7.2. The World Bank puts all of Egypt's GDP for 2024 at 389 billion dollars. This is one city, with just over nineteen million residents.",
      ar: "بلغ الناتج المحلي الإجمالي لقوانغتشو عام 2025 نحو 3.2 تريليون يوان — أي ما يزيد على 440 مليار دولار بسعر صرف 2025 البالغ نحو 7.2. ويقدّر البنك الدولي ناتج مصر كلّها لعام 2024 بـ 389 مليار دولار. وهذه مدينة واحدة، يسكنها ما يزيد قليلًا على تسعة عشر مليون نسمة.",
    },
    {
      zh: "再往外看一圈：广州所在的粤港澳大湾区，十一座城市、八千八百万人，2025 年经济总量 15.3 万亿元 —— 用全国不到 0.6% 的土地，做出全国九分之一的经济。你们这次落地的白云机场、住的琶洲、要去的老城，都在这个圈里。",
      en: "Widen the frame once: the Greater Bay Area that Guangzhou anchors — eleven cities, eighty-eight million people — produced 15.3 trillion yuan in 2025, a ninth of China's economy on less than 0.6 percent of its land. The airport you land at, Pazhou where you stay, the old city you will walk through: all of it sits inside that circle.",
      ar: "وسّع الإطار مرةً واحدة: منطقة الخليج الكبرى التي تتوسّطها قوانغتشو — إحدى عشرة مدينة، ثمانية وثمانون مليون نسمة — أنتجت عام 2025 ما قيمته 15.3 تريليون يوان، أي تُسعَ اقتصاد الصين على أقل من 0.6 بالمئة من أرضها. المطار الذي تهبطون فيه، وبازو حيث تقيمون، والمدينة القديمة التي ستمشون فيها: كلّها داخل هذه الدائرة.",
    },
  ],
  tiles: [
    {
      id: "gdp",
      value: "3.2",
      unit: { zh: "万亿元 · 2025 年 GDP", en: "trillion yuan · GDP, 2025", ar: "تريليون يوان · الناتج المحلي 2025" },
      note: { zh: "全国城市第四，超过埃及全国", en: "Fourth among Chinese cities; more than all of Egypt", ar: "الرابعة بين مدن الصين؛ أكبر من مصر كلّها" },
    },
    {
      id: "pop",
      value: "1,910",
      unit: { zh: "万常住人口", en: "0,000 residents", ar: "0,000 نسمة" },
      note: { zh: "接近开罗大都会区的两倍", en: "Close to twice Greater Cairo", ar: "قرابة ضعف القاهرة الكبرى" },
    },
    {
      id: "airport",
      value: "8,359",
      unit: { zh: "万人次 · 白云机场 2025", en: "0,000 passengers · Baiyun, 2025", ar: "0,000 مسافر · مطار بايون 2025" },
      note: { zh: "全国第二个八千万级机场，你们从这里进出", en: "China's second 80-million airport — the one you fly into", ar: "ثاني مطار في الصين يتجاوز 80 مليونًا — وهو مطاركم" },
    },
    {
      id: "port",
      value: "6.96",
      unit: { zh: "亿吨 · 广州港 2025 货物吞吐", en: "00 million tonnes · Port of Guangzhou, 2025", ar: "00 مليون طن · ميناء قوانغتشو 2025" },
      note: { zh: "集装箱 2,800 万标箱，全球港口前六", en: "28 million TEU; a top-six port worldwide", ar: "28 مليون حاوية؛ من أكبر ستة موانئ في العالم" },
    },
    {
      id: "metro",
      value: "780",
      unit: { zh: "公里地铁 · 2025 年底", en: "km of metro · end of 2025", ar: "كم من المترو · نهاية 2025" },
      note: { zh: "全国第三，一座城的地铁比开罗到亚历山大来回还长", en: "Third in China — longer than Cairo to Alexandria and back", ar: "الثالثة في الصين — أطول من رحلة القاهرة إلى الإسكندرية ذهابًا وإيابًا" },
    },
    {
      id: "tower",
      value: "600",
      unit: { zh: "米 · 广州塔", en: "m · Canton Tower", ar: "م · برج كانتون" },
      note: { zh: "世界第二高塔，就在你们住的海珠区", en: "Second-tallest tower on earth, in your own district of Haizhu", ar: "ثاني أعلى برج في العالم، في منطقتكم هايتشو" },
    },
    {
      id: "fair",
      value: "31",
      unit: { zh: "万境外采购商 · 第 138 届广交会", en: "0,000 overseas buyers · 138th Canton Fair", ar: "0,000 مشترٍ أجنبي · معرض كانتون الـ 138" },
      note: { zh: "来自 223 个国家和地区，展馆就在你们酒店那条路上", en: "From 223 countries and regions — the halls are on your hotel's street", ar: "من 223 دولةً ومنطقة — والقاعات في شارع فندقكم نفسه" },
    },
    {
      id: "gba",
      value: "15.3",
      unit: { zh: "万亿元 · 大湾区 2025", en: "trillion yuan · Greater Bay Area, 2025", ar: "تريليون يوان · منطقة الخليج الكبرى 2025" },
      note: { zh: "十一城八千八百万人，全国九分之一的经济", en: "Eleven cities, 88 million people, a ninth of China's economy", ar: "إحدى عشرة مدينة، 88 مليون نسمة، تُسع اقتصاد الصين" },
    },
  ],
  sources: [
    {
      label: { zh: "2025 年广州市国民经济和社会发展统计公报", en: "Guangzhou 2025 statistical communiqué", ar: "البيان الإحصائي لقوانغتشو 2025" },
      url: "https://www.gz.gov.cn/zwgk/sjfb/tjgb/content/post_10804075.html",
    },
    {
      label: { zh: "世界银行：埃及 GDP（现价美元）", en: "World Bank: Egypt GDP (current US$)", ar: "البنك الدولي: ناتج مصر (بالدولار الجاري)" },
      url: "https://data.worldbank.org/indicator/NY.GDP.MKTP.CD?locations=EG",
    },
    {
      label: { zh: "民航局：白云机场年旅客吞吐量首破八千万", en: "CAAC: Baiyun passes 80 million passengers", ar: "هيئة الطيران المدني: مطار بايون يتجاوز 80 مليون مسافر" },
      url: "http://www.caacnews.com.cn/special/2025zhuanti/8427/kjzg/20dzln4/202512/t20251223_1392071.html",
    },
    {
      label: { zh: "广州市港务局：2025 年广州港货物吞吐量突破 6.96 亿吨", en: "Guangzhou Port Authority: 696 million tonnes in 2025", ar: "هيئة ميناء قوانغتشو: 696 مليون طن عام 2025" },
      url: "https://gwj.gz.gov.cn/xwzx/gzgxw/content/post_10631368.html",
    },
    {
      label: { zh: "广州市交通运输局：2025 年度轨道交通评价（运营里程）", en: "Guangzhou Transport Bureau: 2025 rail transit review (network length)", ar: "هيئة النقل بقوانغتشو: مراجعة النقل بالسكك 2025" },
      url: "https://jtj.gz.gov.cn/gkmlpt/content/10/10694/post_10694346.html",
    },
    {
      label: { zh: "海珠区政府：广州塔", en: "Haizhu District government: Canton Tower", ar: "حكومة منطقة هايتشو: برج كانتون" },
      url: "https://www.haizhu.gov.cn/zjhz/lyck/content/post_7765705.html",
    },
    {
      label: { zh: "人民网：第 138 届广交会闭幕，境外采购商创新高", en: "People's Daily: 138th Canton Fair closes with record overseas buyers", ar: "صحيفة الشعب: اختتام معرض كانتون الـ138 برقم قياسي" },
      url: "http://pic.people.com.cn/n1/2025/1104/c1016-40596777.html",
    },
    {
      label: { zh: "粤港澳大湾区门户网：关于大湾区", en: "Greater Bay Area portal: about the GBA", ar: "بوابة منطقة الخليج الكبرى: عن المنطقة" },
      url: "https://www.cnbayarea.org.cn/introduction/content/post_165071.html",
    },
  ],
};

/* ------------------------------------------------------------------ */
/* 你们住的这块地：琶洲                                                  */
/* ------------------------------------------------------------------ */

export const PAZHOU: { lead: L10n; paragraphs: L10n[]; sources: { label: L10n; url: string }[] } = {
  lead: {
    zh: "酒店在阅江中路 828 号。广交会展馆在 382 号，同一条路。",
    en: "The hotel is at 828 Yuejiang Middle Road. The Canton Fair complex is at 382 — the same road.",
    ar: "الفندق في 828 شارع يوى جيانغ الأوسط. ومجمّع معرض كانتون في الرقم 382 — الشارع نفسه.",
  },
  paragraphs: [
    {
      zh: "琶洲这块地，一千多年前是海上丝绸之路的出海口 —— 你们路线里那个黄埔古港就在旁边。二十年前广交会搬到这里，展馆 155 万平方米；2025 年秋季那一届，三万两千家企业参展，二十三个国家和地区的三十一万境外采购商到场，是有史以来最大的一届。",
      en: "A thousand years ago this stretch of riverbank was where the Maritime Silk Road put to sea — the Huangpu Ancient Port on your route list is next door. Twenty years ago the Canton Fair moved here, into 1.55 million square metres of halls; the autumn 2025 edition drew 32,000 exhibitors and 310,000 overseas buyers from 223 countries and regions, the largest in its history.",
      ar: "قبل أكثر من ألف عام كانت هذه الضفة هي المنفذ البحري لطريق الحرير — وميناء هوانغبو القديم المذكور في مساراتكم يقع بجوارها. وقبل عشرين عامًا انتقل معرض كانتون إلى هنا، في قاعات مساحتها 1.55 مليون متر مربع؛ واستقطبت دورة خريف 2025 اثنين وثلاثين ألف عارض وثلاثمئة وعشرة آلاف مشترٍ أجنبي من 223 دولةً ومنطقة، وهي الأكبر في تاريخه.",
    },
    {
      zh: "展馆背后，是 2015 年起建的人工智能与数字经济试验区：腾讯、阿里巴巴、唯品会的总部大楼都在这里，三万六千多家企业，一年营收四千五百亿元以上。从酒店窗户看出去的那些新楼，就是它们。",
      en: "Behind the halls is the AI and digital-economy zone begun in 2015: the headquarters towers of Tencent, Alibaba and Vipshop stand here, among more than 36,000 companies with combined annual revenue above 450 billion yuan. The new towers you see from the hotel window are those.",
      ar: "وخلف القاعات تقع منطقة الذكاء الاصطناعي والاقتصاد الرقمي التي بدأ بناؤها عام 2015: أبراج المقار الرئيسية لتينسنت وعلي بابا وفيبشوب هنا، بين أكثر من 36 ألف شركة يتجاوز إيرادها السنوي مجتمعةً 450 مليار يوان. والأبراج الجديدة التي ترونها من نافذة الفندق هي تلك.",
    },
  ],
  sources: [
    {
      label: { zh: "广州市政府：魅力琶洲，从海丝起点到创新高地", en: "Guangzhou government: Pazhou, from Silk Road port to innovation hub", ar: "حكومة قوانغتشو: بازو، من ميناء طريق الحرير إلى مركز الابتكار" },
      url: "https://www.gz.gov.cn/ysgz/xwdt/ysdt/content/post_10110019.html",
    },
    {
      label: { zh: "国家数据局：琶洲人工智能与数字经济试验区案例", en: "National Data Administration: the Pazhou zone case study", ar: "هيئة البيانات الوطنية: دراسة حالة منطقة بازو" },
      url: "https://www.nda.gov.cn/sjj/ywpd/szsh/0109/20250109113547618448454_pc.html",
    },
  ],
};

/* ------------------------------------------------------------------ */
/* 食在广州                                                              */
/*                                                                     */
/* 「食在广州」四个字一百年前就传遍全国。这一节讲的是分量：两千年、        */
/* 三大流派、联合国认的美食之都。清真那句提醒在 FOOD_ADVICE 里说过一次，   */
/* 这里只讲好吃。                                                        */
/* ------------------------------------------------------------------ */

export const FOOD_CULTURE: { lead: L10n; paragraphs: L10n[]; sources: { label: L10n; url: string }[] } = {
  lead: {
    zh: "「食在广州」—— 这四个字，一百年前就已经全国皆知。",
    en: "“Eat in Guangzhou” — the whole country was saying it a hundred years ago.",
    ar: "«كُل في قوانغتشو» — عبارةٌ كانت الصين كلُّها تردّدها قبل مئة عام.",
  },
  paragraphs: [
    {
      zh: "1925 年的《广州民国日报》写道：「食在广州一语，几无人不知之。」粤菜是中国八大菜系之一，往上追到两千年前的南越王宫；它由三支组成 —— 广州这边的广府菜、东边海岸的潮汕菜、山里的客家菜 —— 三种完全不同的脾气。",
      en: "In 1925 the Guangzhou Republican Daily wrote: “There is hardly anyone who does not know the saying ‘eat in Guangzhou’.” Cantonese cooking is one of China's eight great cuisines and traces back two thousand years to the kitchens of the Nanyue kings. It comes in three branches — Guangfu cooking here in Guangzhou, Chaoshan cooking on the eastern coast, Hakka cooking in the hills — three quite different temperaments.",
      ar: "كتبت صحيفة «قوانغتشو الجمهورية» عام 1925: «لا يكاد أحدٌ يجهل عبارة: كُل في قوانغتشو». والمطبخ الكانتوني أحد مطابخ الصين الثمانية الكبرى، ويعود ألفي عام إلى مطابخ ملوك نانيوى. وله ثلاثة فروع — مطبخ قوانغفو هنا في قوانغتشو، ومطبخ تشاوشان على الساحل الشرقي، ومطبخ الهاكا في الجبال — ثلاثة أمزجة مختلفة تمامًا.",
    },
    {
      zh: "广府菜讲究「清、鲜、嫩、滑」，什么食材就要吃出什么味道，调料是来帮忙的，不是来盖住的。所以一只鸡可以只用白水浸熟，蘸姜葱吃；一条鱼清蒸，淋一勺热油和豉油就上桌。做得好不好，一口就知道，藏不住。",
      en: "Guangfu cooking prizes clarity, freshness, tenderness and smoothness: an ingredient should taste of itself, and seasoning is there to help, never to hide. So a whole chicken may be simply poached and eaten with ginger and spring onion; a fish is steamed and finished with a spoon of hot oil and soy. Whether the cook is any good is obvious in one mouthful — there is nowhere to hide.",
      ar: "يُعلي مطبخ قوانغفو من الصفاء والطزاجة والطراوة والنعومة: ينبغي أن يكون طعم المكوّن طعمَ نفسه، والتوابل تُعين ولا تُخفي. فقد تُسلق دجاجة كاملة في الماء فحسب وتُؤكل بالزنجبيل والبصل الأخضر؛ وتُطهى سمكة على البخار ثم تُسقى بملعقة زيت ساخن وصويا. وتعرف من اللقمة الأولى إن كان الطاهي بارعًا — إذ لا مكان للاختباء.",
    },
    {
      zh: "离广州一小时的顺德，2014 年被联合国教科文组织评为「世界美食之都」，全球至今只有六座城市拿到这个称号；粤菜的根在那里，双皮奶也是从那儿来的。往东三百公里是潮汕，那里的牛肉火锅要求牛当天现宰，一头牛只有三分之一的肉够格上桌。",
      en: "An hour from Guangzhou is Shunde, named a UNESCO Creative City of Gastronomy in 2014 — only six cities in the world hold the title; Cantonese cooking has its roots there, and so does double-skin milk. Three hundred kilometres east is Chaoshan, whose beef hotpot demands cattle slaughtered the same day, and where only a third of the animal is judged good enough for the table.",
      ar: "وعلى مسافة ساعة من قوانغتشو تقع شوندي التي اختارتها اليونسكو عام 2014 «مدينةً مبدعة في فنون الطهي» — ولا يحمل هذا اللقب سوى ست مدن في العالم؛ وفيها جذور المطبخ الكانتوني، ومنها جاء حليب الطبقتين. وعلى بعد ثلاثمئة كيلومتر شرقًا تقع تشاوشان، حيث يشترط طبق «هوت بوت» اللحم البقري أن تُذبح الأبقار في اليوم نفسه، ولا يُعدّ سوى ثلث الذبيحة صالحًا للمائدة.",
    },
  ],
  sources: [
    {
      label: { zh: "广州市政府：粤菜之美，在于和与合", en: "Guangzhou government: the beauty of Cantonese cuisine", ar: "حكومة قوانغتشو: جمال المطبخ الكانتوني" },
      url: "https://www.gz.gov.cn/zlgz/tsgz/content/post_8033813.html",
    },
    {
      label: { zh: "广东省侨办：追忆粤菜两千年，探寻「食在广州」", en: "Guangdong Overseas Chinese Affairs: two thousand years of Cantonese cooking", ar: "مكتب شؤون المغتربين بقوانغدونغ: ألفا عام من المطبخ الكانتوني" },
      url: "http://www.qb.gd.gov.cn/ztzl/2021ycsf/xwdt/content/post_1028903.html",
    },
    {
      label: { zh: "人民网：联合国教科文组织授予顺德「世界美食之都」", en: "People's Daily: UNESCO names Shunde a City of Gastronomy", ar: "صحيفة الشعب: اليونسكو تمنح شوندي لقب مدينة فنون الطهي" },
      url: "http://cpc.people.com.cn/n/2014/1227/c87228-26284802.html",
    },
  ],
};

export const MOSQUES: PlaceCard[] = ['''

s = s.replace(ANCHOR, BLOCK, 1)

# ── 吃的：再加四样，都是能讲出东西来的 ───────────────────────────
FOOD_ANCHOR = '''  {
    id: "qilou",
    title: { zh: "骑楼是什么", en: "What is a qilou arcade", ar: "ما هي أروقة تشي لو" },'''
if s.count(FOOD_ANCHOR) != 1:
    print("FOOD 锚点未命中"); sys.exit(1)

MORE_FOOD = '''  {
    id: "soup",
    title: { zh: "老火靓汤", en: "Slow-fired soup", ar: "الحساء البطيء" },
    body: {
      zh: "广东人家里的汤是煲出来的：一锅水，几样材料，小火两三个小时，直到汤色变浓、味道全出来。饭桌上第一件事是喝汤，不是吃饭。「饮咗汤未」—— 喝过汤了吗 —— 是广东人的问候语，跟问你吃了没一个意思。",
      en: "In a Cantonese home, soup is not made, it is fired: a pot of water, a few ingredients, two or three hours over a low flame until the broth turns deep and everything has given up its flavour. The first thing at the table is the soup, before the rice. “Have you had your soup?” is how Cantonese ask after you — it means the same as asking whether you have eaten.",
      ar: "في البيت الكانتوني لا يُعدّ الحساء بل يُوقد: قِدر ماء، وبضعة مكوّنات، وساعتان أو ثلاث على نارٍ هادئة حتى يغمق المرق وتبذل المكوّنات كل نكهتها. وأول ما يُقدَّم على المائدة الحساء، قبل الأرز. و«هل شربتَ حساءك؟» هي طريقة الكانتونيين في السؤال عن حالك — وتعني ما تعنيه «هل أكلت؟».",
    },
  },
  {
    id: "chaoshan-beef",
    title: { zh: "潮汕牛肉火锅", en: "Chaoshan beef hotpot", ar: "هوت بوت اللحم البقري على طريقة تشاوشان" },
    body: {
      zh: "一锅清汤，几盘按部位切好的牛肉，涮几秒就吃。规矩是牛必须当天现宰，冻肉不能用；一头牛只有三分之一的部位够格上桌，其余的打成手打牛肉丸。菜单上会看到「吊龙」「匙柄」这些名字 —— 都是部位，一头牛只有两条匙柄。这是广东最适合你们的一顿：全是牛肉，清汤，自己涮。",
      en: "A pot of clear broth and a few plates of beef sliced by cut, dipped for seconds and eaten. The rule is that the animal is slaughtered that day — frozen beef is not allowed — and only a third of it is judged good enough for the table; the rest is pounded into beef balls. The menu lists cuts like diaolong and chibing, the “spoon handle”, of which a cow has just two. Of all Guangdong's meals this is the one most suited to you: all beef, clear soup, cooked by your own hand.",
      ar: "قِدر مرقٍ صافٍ وبضعة أطباق من لحم البقر مقطّعة حسب الجزء، تُغمس ثوانيَ ثم تُؤكل. والقاعدة أن تُذبح البقرة في اليوم نفسه — فاللحم المجمّد ممنوع — ولا يُعدّ سوى ثلثها صالحًا للمائدة؛ والباقي يُدقّ كراتِ لحم. وتجد في القائمة أسماء أجزاء مثل «دياولونغ» و«تشيبينغ» أي «مقبض الملعقة»، وليس في البقرة منه سوى اثنين. ومن بين أطباق قوانغدونغ كلّها هذا أنسبها لكم: لحم بقر كلّه، ومرق صافٍ، وتطهونه بأيديكم.",
    },
    url: "https://zh.wikipedia.org/zh-hans/%E6%BD%AE%E6%B1%95%E7%89%9B%E8%82%89%E7%81%AB%E9%94%85",
  },
  {
    id: "white-cut-chicken",
    title: { zh: "白切鸡", en: "White-cut chicken", ar: "الدجاج المسلوق الكانتوني" },
    body: {
      zh: "整只鸡在将开未开的水里浸熟，捞出来过冷水，皮才会爽脆，肉才会嫩滑，骨头边上还带一点粉红才算到位。不放任何调味，斩件上桌，蘸姜葱蓉。这是广府菜的态度：鸡好，就该吃出鸡的味道。",
      en: "A whole chicken is poached in water held just below the boil, then plunged into cold water so the skin turns taut and the flesh stays silky — a blush of pink at the bone is the mark of it done right. No seasoning at all; it is chopped and served with a ginger-and-spring-onion relish. This is the Guangfu attitude in one dish: if the chicken is good, you should taste the chicken.",
      ar: "تُسلق دجاجة كاملة في ماءٍ يُبقى دون الغليان، ثم تُغمر في ماء بارد فيشتدّ الجلد ويبقى اللحم حريريًا — واحمرارٌ خفيف عند العظم علامة الإتقان. بلا أي توابل؛ تُقطّع وتُقدَّم مع صلصة الزنجبيل والبصل الأخضر. هذا هو مذهب قوانغفو في طبق واحد: إن كانت الدجاجة جيدة فينبغي أن تتذوّق الدجاجة.",
    },
  },
  {
    id: "wok-hei",
    title: { zh: "干炒牛河与「镬气」", en: "Beef chow fun and ‘wok hei’", ar: "شعيرية اللحم المقلية و«نَفَس المقلاة»" },
    body: {
      zh: "宽河粉、牛肉、豆芽、韭黄，猛火快炒。广东人评一碟炒菜好不好，看的是「镬气」—— 铁锅烧到极烫、油和酱在锅边瞬间焦香、每一根粉都均匀上色而不断不糊。炉火不够猛的厨房炒不出来，这是粤菜厨师的看家本领，也是所有广式小炒的魂。",
      en: "Wide rice noodles, beef, bean sprouts and yellow chives, tossed fast over a ferocious flame. Cantonese judge any stir-fry by its wok hei, the “breath of the wok”: the pan heated until it almost glows, oil and sauce searing in an instant at the rim, every noodle evenly browned yet unbroken and unstuck. It cannot be faked on a weak stove — it is the Cantonese cook's signature skill and the soul of every quick-fried dish.",
      ar: "شعيرية أرز عريضة ولحم بقر وبراعم فول وثوم معمّر أصفر، تُقلّب بسرعة فوق لهب عنيف. ويحكم الكانتونيون على أي طبق مقلي بـ«ووك هي»، أي نَفَس المقلاة: تُحمى المقلاة حتى تكاد تتوهّج، فيلفح الزيت والصلصة حافتها في لحظة، وتتلوّن كل خيط شعيرية بالتساوي دون أن ينقطع أو يلتصق. لا يمكن تزييفه على موقد ضعيف — إنه توقيع الطاهي الكانتوني وروح كل طبق مقليّ سريع.",
    },
  },
'''

s = s.replace(FOOD_ANCHOR, MORE_FOOD + FOOD_ANCHOR, 1)

P.write_text(s, encoding="utf-8")
print(f"已写入：CITY_SCALE / PAZHOU / FOOD_CULTURE + 四道菜。{n0} → {len(s)} 字节")
