#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""把「这座城有多大」和「科技就在身边」的分量补回来。

上一轮重写把钩子写好了，但正文从「展示实力」退成了「使用说明」：
体量 8 格剩 4 格，科技 6 条剩 3 条，连「经济总量超过埃及全国」这句定调都没了。
按 owner 定的目的（让客人看到中国有多强），正文才是承载分量的地方。

做法：标题、钩子、「在哪能见到」沿用重写后的版本（确实更好），
事实与数字全部补回，并按 owner 要求补上美元。
"""
import pathlib
import sys

P = pathlib.Path("lib/trip-data.ts")
s = P.read_text(encoding="utf-8")
n0 = len(s)


def replace_block(name: str, new: str) -> None:
    global s
    i = s.find(f"export const {name}")
    if i < 0:
        print(f"✗ 找不到 {name}")
        sys.exit(1)
    j = s.find("\nexport ", i + 10)
    if j < 0:
        print(f"✗ {name} 没有结尾")
        sys.exit(1)
    s = s[:i] + new.strip("\n") + "\n" + s[j:]


CITY_SCALE = '''
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
      zh: "先说一个数：2025 年广州的 GDP 是 3.2 万亿元人民币，按当年约 7.2 的汇率折合四千四百多亿美元。世界银行给埃及 2024 年全国的数是 3890 亿美元。也就是说，你们落地的这一座城，一年做出的经济总量比整个埃及还多 —— 而它只有一千九百多万人。",
      en: "Start with one number. Guangzhou's GDP in 2025 was 3.2 trillion yuan — about 440 billion US dollars at that year's rate of roughly 7.2. The World Bank puts all of Egypt's GDP for 2024 at 389 billion dollars. The single city you are landing in produces more in a year than the whole of Egypt — with just over nineteen million people.",
      ar: "لنبدأ برقم واحد. بلغ الناتج المحلي الإجمالي لقوانغتشو عام 2025 نحو 3.2 تريليون يوان — أي ما يزيد على 440 مليار دولار بسعر صرف ذلك العام البالغ نحو 7.2. ويقدّر البنك الدولي ناتج مصر كلّها لعام 2024 بـ 389 مليار دولار. أي أن المدينة الواحدة التي تهبطون فيها تنتج في السنة أكثر من مصر بأكملها — بسكان لا يتجاوزون تسعة عشر مليونًا إلا قليلًا.",
    },
    {
      zh: "这些数字你们这几天会一个个碰到：从白云机场落地，在琶洲的展馆旁边开会，晚上去江边看那座六百米的塔。",
      en: "You will meet these numbers one by one over the next few days: you land at Baiyun, you meet beside the exhibition halls at Pazhou, and in the evening you go down to the river to see the six-hundred-metre tower.",
      ar: "ستلتقون بهذه الأرقام واحدًا واحدًا خلال الأيام القادمة: تهبطون في مطار بايون، وتجتمعون إلى جوار قاعات المعارض في بازو، وفي المساء تنزلون إلى النهر لرؤية البرج البالغ ستمئة متر.",
    },
    {
      zh: "再往外看一圈：广州所在的粤港澳大湾区，十一座城市、八千八百万人，2025 年经济总量 15.3 万亿元，约合 2.1 万亿美元 —— 用全国不到 0.6% 的土地，做出全国九分之一的经济。",
      en: "Widen the frame once: the Greater Bay Area that Guangzhou anchors — eleven cities, eighty-eight million people — produced 15.3 trillion yuan in 2025, about 2.1 trillion US dollars, a ninth of China's economy on less than 0.6 percent of its land.",
      ar: "وسّع الإطار مرةً واحدة: منطقة الخليج الكبرى التي تتوسّطها قوانغتشو — إحدى عشرة مدينة، ثمانية وثمانون مليون نسمة — أنتجت عام 2025 ما قيمته 15.3 تريليون يوان، أي نحو 2.1 تريليون دولار، وهو تُسع اقتصاد الصين على أقل من 0.6 بالمئة من أرضها.",
    },
  ],
  tiles: [
    {
      id: "gdp",
      value: { zh: "3.2", en: "3.2", ar: "3.2" },
      unit: { zh: "万亿元 · 2025 年 GDP", en: "trillion yuan · GDP, 2025", ar: "تريليون يوان · الناتج المحلي 2025" },
      note: { zh: "约合 4,400 亿美元，全国城市第四，超过埃及全国", en: "About US$440bn — fourth among Chinese cities, more than all of Egypt", ar: "نحو 440 مليار دولار — الرابعة بين مدن الصين، وأكبر من مصر كلّها" },
    },
    {
      id: "pop",
      value: { zh: "1,910", en: "19.1", ar: "19.1" },
      unit: { zh: "万常住人口", en: "million residents", ar: "مليون نسمة" },
      note: { zh: "一座城的人口，比很多国家都多", en: "One city with more people than many countries", ar: "مدينة واحدة يفوق سكانها سكان دول كثيرة" },
    },
    {
      id: "airport",
      value: { zh: "8,359", en: "83.6", ar: "83.6" },
      unit: { zh: "万人次 · 白云机场 2025", en: "million passengers · Baiyun, 2025", ar: "مليون مسافر · مطار بايون 2025" },
      note: { zh: "全国第二个八千万级机场，你们从这里进出", en: "China's second 80-million airport — the one you fly into", ar: "ثاني مطار في الصين يتجاوز 80 مليونًا — وهو مطاركم" },
    },
    {
      id: "port",
      value: { zh: "6.96", en: "696", ar: "696" },
      unit: { zh: "亿吨 · 广州港 2025 货物吞吐", en: "million tonnes · Port of Guangzhou, 2025", ar: "مليون طن · ميناء قوانغتشو 2025" },
      note: { zh: "集装箱 2,800 万标箱，全球港口前六", en: "28 million TEU; a top-six port worldwide", ar: "28 مليون حاوية؛ من أكبر ستة موانئ في العالم" },
    },
    {
      id: "metro",
      value: { zh: "780", en: "780", ar: "780" },
      unit: { zh: "公里地铁 · 2025 年底", en: "km of metro · end of 2025", ar: "كم من المترو · نهاية 2025" },
      note: { zh: "全国第三，比开罗到亚历山大来回还长", en: "Third in China — longer than Cairo to Alexandria and back", ar: "الثالثة في الصين — أطول من رحلة القاهرة إلى الإسكندرية ذهابًا وإيابًا" },
    },
    {
      id: "tower",
      value: { zh: "600", en: "600", ar: "600" },
      unit: { zh: "米 · 广州塔", en: "m · Canton Tower", ar: "م · برج كانتون" },
      note: { zh: "世界第二高塔，就在你们住的海珠区", en: "Second-tallest tower on earth, in your own district of Haizhu", ar: "ثاني أعلى برج في العالم، في منطقتكم هايتشو" },
    },
    {
      id: "fair",
      value: { zh: "31", en: "310,000", ar: "310,000" },
      unit: { zh: "万境外采购商 · 第 138 届广交会", en: "overseas buyers · 138th Canton Fair", ar: "مشترٍ أجنبي · معرض كانتون الـ138" },
      note: { zh: "来自 223 个国家和地区，展馆就在你们酒店那条路上", en: "From 223 countries and regions — the halls are on your hotel's street", ar: "من 223 دولةً ومنطقة — والقاعات في شارع فندقكم نفسه" },
    },
    {
      id: "gba",
      value: { zh: "15.3", en: "15.3", ar: "15.3" },
      unit: { zh: "万亿元 · 大湾区 2025", en: "trillion yuan · Greater Bay Area, 2025", ar: "تريليون يوان · منطقة الخليج الكبرى 2025" },
      note: { zh: "约合 2.1 万亿美元；十一城八千八百万人，全国九分之一的经济", en: "About US$2.1tn; eleven cities, 88 million people, a ninth of China's economy", ar: "نحو 2.1 تريليون دولار؛ إحدى عشرة مدينة، 88 مليون نسمة، تُسع اقتصاد الصين" },
    },
  ],
  sources: [
    { label: { zh: "2025 年广州市国民经济和社会发展统计公报", en: "Guangzhou 2025 statistical communiqué", ar: "البيان الإحصائي لقوانغتشو 2025" }, url: "https://www.gz.gov.cn/zwgk/sjfb/tjgb/content/post_10804075.html" },
    { label: { zh: "世界银行：埃及 GDP（现价美元）", en: "World Bank: Egypt GDP (current US$)", ar: "البنك الدولي: ناتج مصر (بالدولار الجاري)" }, url: "https://data.worldbank.org/indicator/NY.GDP.MKTP.CD?locations=EG" },
    { label: { zh: "民航局：白云机场年旅客吞吐量首破八千万", en: "CAAC: Baiyun passes 80 million passengers", ar: "هيئة الطيران المدني: مطار بايون يتجاوز 80 مليون مسافر" }, url: "http://www.caacnews.com.cn/special/2025zhuanti/8427/kjzg/20dzln4/202512/t20251223_1392071.html" },
    { label: { zh: "广州市港务局：2025 年广州港货物吞吐量突破 6.96 亿吨", en: "Guangzhou Port Authority: 696 million tonnes in 2025", ar: "هيئة ميناء قوانغتشو: 696 مليون طن عام 2025" }, url: "https://gwj.gz.gov.cn/xwzx/gzgxw/content/post_10631368.html" },
    { label: { zh: "广州市交通运输局：2025 年度轨道交通评价（运营里程）", en: "Guangzhou Transport Bureau: 2025 rail transit review", ar: "هيئة النقل بقوانغتشو: مراجعة النقل بالسكك 2025" }, url: "https://jtj.gz.gov.cn/gkmlpt/content/10/10694/post_10694346.html" },
    { label: { zh: "海珠区政府：广州塔", en: "Haizhu District government: Canton Tower", ar: "حكومة منطقة هايتشو: برج كانتون" }, url: "https://www.haizhu.gov.cn/zjhz/lyck/content/post_7765705.html" },
    { label: { zh: "人民网：第 138 届广交会闭幕，境外采购商创新高", en: "People's Daily: 138th Canton Fair closes with record overseas buyers", ar: "صحيفة الشعب: اختتام معرض كانتون الـ138 برقم قياسي" }, url: "http://pic.people.com.cn/n1/2025/1104/c1016-40596777.html" },
    { label: { zh: "粤港澳大湾区门户网：关于大湾区", en: "Greater Bay Area portal: about the GBA", ar: "بوابة منطقة الخليج الكبرى: عن المنطقة" }, url: "https://www.cnbayarea.org.cn/introduction/content/post_165071.html" },
  ],
};
'''

CITY_TECH = '''
export const CITY_TECH: {
  lead: L10n;
  intro: L10n;
  items: TechItem[];
  sources: { label: L10n; url: string }[];
} = {
  lead: {
    zh: "上车之后你会发现，驾驶位上没有人。",
    en: "You get in, and then you notice: nobody is in the driver's seat.",
    ar: "تركبون، ثم تلاحظون: لا أحد في مقعد السائق.",
  },
  intro: {
    zh: "下面这几样，在广州街上是日常，在世界上多数地方还是新闻。不用专门去找，这几天走在路上、坐在车里、吃着饭就会碰到。",
    en: "The things below are everyday on Guangzhou's streets and still headlines almost everywhere else. None of it needs a special trip: over these few days you will run into it on the road, in the car, at the table.",
    ar: "الأشياء أدناه روتين يومي في شوارع قوانغتشو، ولا تزال عناوين أخبار في معظم أنحاء العالم. ولا يحتاج أيٌّ منها إلى رحلة خاصة: خلال هذه الأيام ستصادفونها في الطريق وفي السيارة وعلى المائدة.",
  },
  items: [
    {
      id: "robotaxi",
      imageKey: "robotaxi",
      title: { zh: "坐一次没有司机的车", en: "Ride in a car with no driver", ar: "اركبوا سيارة بلا سائق" },
      where: {
        zh: "微信里搜小程序「WeRide Go」，看看广州能约的上下车点；白云机场、广州南站到市区地标之间有八条示范线，24 小时跑。",
        en: "Search the WeChat mini-program “WeRide Go” for the pickup points open in Guangzhou; eight demonstration routes link Baiyun Airport and Guangzhou South station with city landmarks, running around the clock.",
        ar: "ابحثوا في وي تشات عن تطبيق «WeRide Go» المصغّر لمعرفة نقاط الركوب المتاحة في قوانغتشو؛ وثمانية خطوط تجريبية تربط مطار بايون ومحطة قوانغتشو الجنوبية بمعالم المدينة وتعمل على مدار الساعة.",
      },
      body: {
        zh: "方向盘自己转，车在红灯前停下，转弯、变道、避让行人都由它自己完成。做这件事的公司叫文远知行，总部就在广州：它在广州、北京和阿布扎比跑的都是「车里一个人都没有」的纯无人商业运营，2026 年 1 月全球车队过了一千辆。除了出租车，还有无人小巴和无人环卫车。",
        en: "The wheel turns by itself, the car eases up to a red light, and the turns, lane changes and pauses for pedestrians are its own work. The company behind it is WeRide, headquartered here in Guangzhou: in Guangzhou, Beijing and Abu Dhabi it runs fully driverless commercial service — nobody in the car at all — and in January 2026 its global fleet passed a thousand vehicles. Beyond taxis there are driverless minibuses and street sweepers.",
        ar: "يدور المقود وحده، وتتمهّل السيارة عند الإشارة الحمراء، وتتولّى بنفسها الانعطاف وتغيير المسار والتوقّف للمشاة. والشركة وراء ذلك هي «وي رايد» ومقرّها هنا في قوانغتشو: تشغّل في قوانغتشو وبكين وأبوظبي خدمة تجارية بلا سائق إطلاقًا — لا أحد في السيارة — وفي يناير 2026 تجاوز أسطولها العالمي ألف مركبة. وإلى جانب سيارات الأجرة هناك حافلات صغيرة ومركبات تنظيف شوارع بلا سائق.",
      },
    },
    {
      id: "evtol",
      imageKey: "evtol",
      title: { zh: "载人的无人机", en: "A drone that carries people", ar: "طائرة مسيّرة تحمل الركاب" },
      where: {
        zh: "在黄埔的运营点可以买票坐一趟低空观光。要提前约，不在日程里；但要知道，这东西是广州造的。",
        en: "At the operating site in Huangpu you can buy a ticket for a low-altitude sightseeing flight. It takes booking and is not on the itinerary — but know that this machine is made in Guangzhou.",
        ar: "في موقع التشغيل بهوانغبو يمكن شراء تذكرة لرحلة مشاهدة منخفضة الارتفاع. تحتاج إلى حجز وليست في البرنامج — لكن اعلموا أن هذه الآلة صُنعت في قوانغتشو.",
      },
      body: {
        zh: "亿航智能的 EH216-S，两个座位、十六个旋翼、没有飞行员。它拿到了全球第一张无人驾驶载人航空器的适航证、第一张生产许可证，2025 年又在广州黄埔拿到全球第一张运营合格证 —— 四证齐全，可以卖票载客。",
        en: "EHang's EH216-S: two seats, sixteen rotors, no pilot. It holds the world's first type certificate for a pilotless passenger aircraft, the first production certificate, and in 2025 received the first operator certificate in Guangzhou's Huangpu district — the full set, cleared to sell tickets and carry passengers.",
        ar: "طائرة EH216-S من «إي هانغ»: مقعدان وستة عشر دوّارًا وبلا طيار. تحمل أول شهادة صلاحية طيران في العالم لطائرة ركاب بلا طيار، وأول رخصة إنتاج، وحصلت عام 2025 في منطقة هوانغبو بقوانغتشو على أول شهادة تشغيل في العالم — المجموعة الكاملة، ومصرَّح لها ببيع التذاكر ونقل الركاب.",
      },
    },
    {
      id: "robot",
      imageKey: "robot",
      title: { zh: "会搭电梯的送物小车", en: "A delivery robot that takes the lift", ar: "روبوت توصيل يركب المصعد" },
      where: {
        zh: "很多餐厅里菜是机器人推到桌边的；不少酒店里外卖和毛巾也是它送到房门口，自己坐电梯上来。入住时可以问前台有没有这项服务。",
        en: "In many restaurants the dishes arrive at the table on a robot; in many hotels the takeaway or fresh towels come to your door on one, riding the lift by itself. Ask at the front desk whether your hotel runs them.",
        ar: "في مطاعم كثيرة تصل الأطباق إلى الطاولة على روبوت؛ وفي فنادق كثيرة يصل الطعام الجاهز أو المناشف إلى بابكم على روبوت يركب المصعد بنفسه. اسألوا في الاستقبال إن كان فندقكم يشغّلها.",
      },
      body: {
        zh: "这个行业的两家头部企业普渡和擎朗都是广东公司。普渡一家就占全球商用服务机器人 23% 的份额，累计出货超过十二万台 —— 也就是说，全世界餐厅里每四台这样的小车，就有一台出自广东。",
        en: "The two leaders of this industry, Pudu and Keenon, are both Guangdong companies. Pudu alone holds 23 percent of the world's commercial service-robot market, with more than 120,000 units shipped — roughly one in four of these machines in restaurants anywhere comes from Guangdong.",
        ar: "الشركتان الرائدتان في هذه الصناعة، «بودو» و«كينون»، كلتاهما من قوانغدونغ. وتستحوذ بودو وحدها على 23% من سوق روبوتات الخدمة التجارية في العالم، بأكثر من 120 ألف وحدة مشحونة — أي أن واحدًا من كل أربعة من هذه الروبوتات في مطاعم العالم يأتي من قوانغدونغ.",
      },
    },
    {
      id: "drone-delivery",
      title: { zh: "从天上落下来的外卖", en: "Takeaway that comes down from the sky", ar: "طعام جاهز ينزل من السماء" },
      where: {
        zh: "在开通航线的商圈和公园，点一份外卖，几分钟后从天上落到取餐柜里。广州是开了航线的城市之一。",
        en: "In districts and parks with a route, you order a takeaway and a few minutes later it drops from the sky into a pick-up locker. Guangzhou is one of the cities with routes open.",
        ar: "في الأحياء والحدائق التي فيها خط، تطلبون وجبة جاهزة فتهبط بعد دقائق من السماء في خزانة استلام. وقوانغتشو من المدن التي فُتحت فيها الخطوط.",
      },
      body: {
        zh: "美团无人机到 2024 年底开了 53 条航线，累计送了四十五万单，单 2024 年一年就送了二十万单，比前一年翻了一倍。",
        en: "By the end of 2024 Meituan's drones flew 53 routes and had delivered 450,000 orders — 200,000 of them in 2024 alone, double the year before.",
        ar: "بحلول نهاية 2024 كانت طائرات «مي توان» المسيّرة تطير على 53 خطًا وقد سلّمت 450 ألف طلب — منها 200 ألف في عام 2024 وحده، أي ضعف العام السابق.",
      },
    },
    {
      id: "cashless",
      imageKey: "cashless",
      title: { zh: "一杯茶的小额付款", en: "Paying for a cup of tea", ar: "دفع ثمن كوب شاي" },
      where: {
        zh: "买水、买茶、打车，都是同一个动作：扫一下码。这几天你们大概一张纸币都用不上。",
        en: "Buying water, buying tea, taking a taxi — all the same motion: one scan of a code. You will probably not touch a banknote all week.",
        ar: "شراء الماء أو الشاي أو ركوب سيارة أجرة — الحركة نفسها: مسح رمز واحد. غالبًا لن تلمسوا ورقة نقدية طوال الأسبوع.",
      },
      body: {
        zh: "中国的移动支付普及率 86%，全球第一。街边卖菜的摊子、路边的早餐店、出租车，全都收码不收钞。本页的出发前准备里写了怎么把外卡绑上。",
        en: "China's mobile-payment penetration is 86 percent, the highest in the world. The vegetable stall, the breakfast shop on the corner, the taxi — all take a code and not a note. The preparation section on this page explains how to link a foreign card.",
        ar: "نسبة انتشار الدفع بالهاتف في الصين 86%، الأعلى في العالم. بسطة الخضار ومحل الفطور على الناصية وسيارة الأجرة — جميعها تقبل الرمز لا الورقة النقدية. ويشرح قسم الاستعداد في هذه الصفحة كيفية ربط بطاقة أجنبية.",
      },
    },
    {
      id: "ev-taxi",
      imageKey: "evtaxi",
      title: { zh: "安静的出租车", en: "The quiet taxi", ar: "سيارة الأجرة الهادئة" },
      where: {
        zh: "坐上去没有发动机声、没有尾气 —— 你们这几天叫到的车几乎全是电动的。",
        en: "No engine noise, no exhaust when you get in — almost every car you hail this week will be electric.",
        ar: "لا صوت محرّك ولا عادم حين تركبون — كل سيارة تطلبونها هذا الأسبوع تقريبًا كهربائية.",
      },
      body: {
        zh: "到 2025 年 6 月底，广州网约车电动化率 98%；珠三角新增的出租车和网约车全部是新能源车。广汽自己就是造电动车的大厂，总部也在广州。",
        en: "By the end of June 2025, 98 percent of Guangzhou's ride-hailing cars were electric, and every new taxi or ride-hailing car in the Pearl River Delta must be a new-energy vehicle. GAC, a major EV maker in its own right, is headquartered here too.",
        ar: "بحلول نهاية يونيو 2025 كانت 98% من سيارات النقل التشاركي في قوانغتشو كهربائية، ويجب أن تكون كل سيارة أجرة أو نقل تشاركي جديدة في دلتا نهر اللؤلؤ مركبة طاقة جديدة. وشركة «جي إيه سي»، وهي من كبار صانعي السيارات الكهربائية، مقرّها هنا أيضًا.",
      },
    },
  ],
  sources: [
    { label: { zh: "财新：文远知行在广州市区开通 Robotaxi 服务，24 小时运营", en: "Caixin: WeRide opens 24-hour Robotaxi service in central Guangzhou", ar: "كايشين: وي رايد تفتح خدمة روبوتاكسي على مدار الساعة في قوانغتشو" }, url: "https://companies.caixin.com/2025-05-15/102320039.html" },
    { label: { zh: "新浪科技：文远知行 Robotaxi 车队突破千辆", en: "Sina Tech: WeRide's Robotaxi fleet passes 1,000", ar: "سينا تك: أسطول وي رايد يتجاوز ألف مركبة" }, url: "https://finance.sina.com.cn/tech/digi/2026-01-16/doc-inhhnzaw0673277.shtml" },
    { label: { zh: "广州市政府：全球首张载人 eVTOL 运营合格证落地广州黄埔", en: "Guangzhou government: the world's first passenger-eVTOL operator certificate, Huangpu", ar: "حكومة قوانغتشو: أول شهادة تشغيل لطائرة ركاب كهربائية في العالم، هوانغبو" }, url: "https://www.gz.gov.cn/ysgz/xwdt/ysdt/content/post_10193139.html" },
    { label: { zh: "亿航智能：EH216-S 获民航局标准适航证", en: "EHang: EH216-S receives its type certificate from the CAAC", ar: "إي هانغ: EH216-S تحصل على شهادة الصلاحية من هيئة الطيران" }, url: "https://www.ehang.com/news/1022.html" },
    { label: { zh: "前瞻：2025 年中国餐饮配送机器人行业全景", en: "Qianzhan: China's food-delivery robot industry, 2025", ar: "تشيانتشان: صناعة روبوتات توصيل الطعام في الصين 2025" }, url: "https://ecoapp.qianzhan.com/detials/250530-9cf3847c.html" },
    { label: { zh: "南方财经：美团无人机 2024 年配送超 20 万单", en: "SFC: Meituan drones delivered over 200,000 orders in 2024", ar: "إس إف سي: طائرات مي توان سلّمت أكثر من 200 ألف طلب في 2024" }, url: "https://www.sfccn.com/2025/1-24/4MMDE0NzNfMTk4NzI4Mw.html" },
    { label: { zh: "人民网广东：珠三角新增网约车须为新能源汽车", en: "People's Daily Guangdong: new ride-hailing cars in the Delta must be NEVs", ar: "صحيفة الشعب قوانغدونغ: سيارات النقل التشاركي الجديدة في الدلتا يجب أن تكون كهربائية" }, url: "http://gd.people.com.cn/n2/2024/1212/c123932-41073362.html" },
  ],
};
'''

replace_block("CITY_SCALE", CITY_SCALE)
replace_block("CITY_TECH", CITY_TECH)

P.write_text(s, encoding="utf-8")
print(f"CITY_SCALE 8 格、CITY_TECH 6 条已补回；{n0} → {len(s)} 字节")
