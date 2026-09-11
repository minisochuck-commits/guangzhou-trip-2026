#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""把「这座城有多大」和「科技就在身边」重写成有人读得下去的文字。

owner 说了不止一次：标题还行，正文枯燥。前几轮我一直在改结构、事实和配图，
没动文风，这次只动文风。

两条写法上的规矩，来自这个仓已有的质检（scripts/check-guest-guide.mjs）：
  1. 趣味靠具体的场景和细节，不靠形容词和最高级 —— 「最舒服」「不会记错」那类
     已经被 owner 否过，禁用词表里留着。
  2. 先给一个看得见的画面，再让事实落下来当回响；不要先摆结论再补描写。

另外删掉埃及 GDP 的对照。上一轮我以为把「超过埃及全国」换成「作为参照，埃及是
3,890 亿美元」就不算炫耀了 —— owner 指出那是同一句话换个说法。整段拿掉，
只讲广州自己的数。
"""
import pathlib
import sys

P = pathlib.Path("lib/trip-data.ts")
s = P.read_text(encoding="utf-8")
n0 = len(s)


def block(name: str, new: str) -> None:
    global s
    i = s.find(f"export const {name}")
    if i < 0:
        print(f"✗ 找不到 {name}")
        sys.exit(1)
    j = s.find("\nexport ", i + 10)
    s = s[:i] + new.strip("\n") + "\n" + s[j:]


CITY_SCALE = '''
export const CITY_SCALE: {
  lead: L10n;
  intro: L10n[];
  tiles: StatTile[];
  sources: { label: L10n; url: string }[];
} = {
  lead: {
    zh: "一座城，一年四千四百亿美元。",
    en: "One city, 440 billion US dollars a year.",
    ar: "مدينةٌ واحدة، 440 مليار دولار في السنة.",
  },
  intro: [
    {
      zh: "2025 年广州的 GDP 是 3.2 万亿元人民币，按当年约 7.2 的汇率折合四千四百多亿美元，在中国城市里排第四。",
      en: "Guangzhou's GDP in 2025 was 3.2 trillion yuan — about 440 billion US dollars at that year's rate of roughly 7.2 — fourth among Chinese cities.",
      ar: "بلغ الناتج المحلي الإجمالي لقوانغتشو عام 2025 نحو 3.2 تريليون يوان — أي ما يقارب 440 مليار دولار بسعر صرف ذلك العام البالغ نحو 7.2 — وهي الرابعة بين مدن الصين.",
    },
    {
      zh: "这样一个数字是抽象的，但你们这几天会一件一件碰到它。落地的白云机场，一年进出八千三百多万人次，摊到每天是二十三万人 —— 相当于每天有一座小城从这里过境。开会的琶洲，隔一条路就是广交会的展馆。晚上想散步，江对岸那座六百米的塔会在天黑后整个换色。",
      en: "A number like that is abstract until you start bumping into it. Baiyun, where you land, moved more than eighty-three million passengers last year — two hundred and thirty thousand a day, a small city passing through every twenty-four hours. Pazhou, where you meet, is one street away from the Canton Fair halls. And if you walk out in the evening, the six-hundred-metre tower across the water changes colour once it is properly dark.",
      ar: "رقمٌ كهذا يبقى مجرّدًا حتى تبدأوا في الاصطدام به. فمطار بايون الذي تهبطون فيه نقل العام الماضي أكثر من ثلاثة وثمانين مليون مسافر — مئتين وثلاثين ألفًا في اليوم، أي مدينة صغيرة تعبر كل أربع وعشرين ساعة. وبازو حيث تجتمعون يفصله شارع واحد عن قاعات معرض كانتون. وإن خرجتم للتنزّه مساءً، فإن البرج البالغ ستمئة متر على الضفة المقابلة يغيّر لونه كله بعد أن يشتدّ الظلام.",
    },
    {
      zh: "把地图再放大一圈：广州所在的粤港澳大湾区，十一座城市、八千八百万人，2025 年做出 15.3 万亿元，约合 2.1 万亿美元。这片地方占全国不到 0.6% 的面积。",
      en: "Zoom the map out one step. The Greater Bay Area around Guangzhou — eleven cities, eighty-eight million people — produced 15.3 trillion yuan in 2025, about 2.1 trillion US dollars, on less than 0.6 percent of China's land.",
      ar: "وسّعوا الخريطة خطوةً واحدة. فمنطقة الخليج الكبرى حول قوانغتشو — إحدى عشرة مدينة وثمانية وثمانون مليون نسمة — أنتجت عام 2025 ما قيمته 15.3 تريليون يوان، أي نحو 2.1 تريليون دولار، على أقل من 0.6 بالمئة من مساحة الصين.",
    },
  ],
  tiles: [
    {
      id: "gdp",
      value: { zh: "3.2", en: "3.2", ar: "3.2" },
      unit: { zh: "万亿元 · 2025 年 GDP", en: "trillion yuan · GDP, 2025", ar: "تريليون يوان · الناتج المحلي 2025" },
      note: { zh: "约合 4,400 亿美元，全国城市第四", en: "About US$440bn — fourth among Chinese cities", ar: "نحو 440 مليار دولار — الرابعة بين مدن الصين" },
    },
    {
      id: "pop",
      value: { zh: "1,910", en: "19.1", ar: "19.1" },
      unit: { zh: "万常住人口", en: "million residents", ar: "مليون نسمة" },
      note: { zh: "住在这一座城里的人", en: "People living inside this one city", ar: "من يسكنون هذه المدينة وحدها" },
    },
    {
      id: "airport",
      value: { zh: "8,359", en: "83.6", ar: "83.6" },
      unit: { zh: "万人次 · 白云机场 2025", en: "million passengers · Baiyun, 2025", ar: "مليون مسافر · مطار بايون 2025" },
      note: { zh: "折合每天约 23 万人次进出；你们从这里落地", en: "About 230,000 people a day; this is where you land", ar: "نحو 230 ألف شخص يوميًا؛ وهنا تهبطون" },
    },
    {
      id: "port",
      value: { zh: "6.96", en: "696", ar: "696" },
      unit: { zh: "亿吨 · 广州港 2025 货物吞吐", en: "million tonnes · Port of Guangzhou, 2025", ar: "مليون طن · ميناء قوانغتشو 2025" },
      note: { zh: "集装箱 2,800 万标箱，一千多年前这里就在装船", en: "28 million containers — ships have loaded here for a thousand years", ar: "28 مليون حاوية — والسفن تُشحن من هنا منذ ألف عام" },
    },
    {
      id: "metro",
      value: { zh: "780", en: "780", ar: "780" },
      unit: { zh: "公里地铁 · 2025 年底", en: "km of metro · end of 2025", ar: "كم من المترو · نهاية 2025" },
      note: { zh: "一座城的地铁，比开罗到亚历山大来回还长", en: "One city's metro — longer than Cairo to Alexandria and back", ar: "مترو مدينة واحدة — أطول من القاهرة إلى الإسكندرية ذهابًا وإيابًا" },
    },
    {
      id: "tower",
      value: { zh: "600", en: "600", ar: "600" },
      unit: { zh: "米 · 广州塔", en: "m · Canton Tower", ar: "م · برج كانتون" },
      note: { zh: "就在你们住的海珠区，入夜整座塔换色", en: "In Haizhu, your own district; after dark the whole tower changes colour", ar: "في هايتشو، منطقتكم نفسها؛ وبعد الغروب يغيّر البرج كله لونه" },
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
      note: { zh: "约合 2.1 万亿美元，用全国不到 0.6% 的地方做出来", en: "About US$2.1tn, made on under 0.6% of China's land", ar: "نحو 2.1 تريليون دولار، على أقل من 0.6% من أرض الصين" },
    },
  ],
  sources: [
    { label: { zh: "2025 年广州市国民经济和社会发展统计公报", en: "Guangzhou 2025 statistical communiqué", ar: "البيان الإحصائي لقوانغتشو 2025" }, url: "https://www.gz.gov.cn/zwgk/sjfb/tjgb/content/post_10804075.html" },
    { label: { zh: "广州市统计局：2025 年经济运行情况", en: "Guangzhou Statistics Bureau: the 2025 economy", ar: "مكتب إحصاء قوانغتشو: أداء اقتصاد 2025" }, url: "https://tjj.gz.gov.cn/zzfwzq/tjkx/content/post_10804061.html" },
    { label: { zh: "广州市 2026 年政府工作报告", en: "Guangzhou government work report, 2026", ar: "تقرير عمل حكومة قوانغتشو 2026" }, url: "https://www.gzfao.gov.cn/zwgk/gkml/gzrmzf/bmwj/gfxwj/content/post_266425.html" },
    { label: { zh: "民航局：白云机场年旅客吞吐量首破八千万", en: "CAAC: Baiyun passes 80 million passengers", ar: "هيئة الطيران المدني: مطار بايون يتجاوز 80 مليون مسافر" }, url: "http://www.caacnews.com.cn/special/2025zhuanti/8427/kjzg/20dzln4/202512/t20251223_1392071.html" },
    { label: { zh: "广州市港务局：2025 年广州港货物吞吐量突破 6.96 亿吨", en: "Guangzhou Port Authority: 696 million tonnes in 2025", ar: "هيئة ميناء قوانغتشو: 696 مليون طن عام 2025" }, url: "https://gwj.gz.gov.cn/xwzx/gzgxw/content/post_10631368.html" },
    { label: { zh: "广州市交通运输局：2025 年度轨道交通评价", en: "Guangzhou Transport Bureau: 2025 rail transit review", ar: "هيئة النقل بقوانغتشو: مراجعة النقل بالسكك 2025" }, url: "https://jtj.gz.gov.cn/gkmlpt/content/10/10694/post_10694346.html" },
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
    zh: "车到了，你拉开后门坐进去。前排两个座位，都是空的。",
    en: "Your car arrives, you open the back door and get in. Both seats in front are empty.",
    ar: "تصل سيارتكم، تفتحون الباب الخلفي وتركبون. المقعدان في الأمام كلاهما فارغ.",
  },
  intro: {
    zh: "这座城里有几件事就是这样：在别处还上新闻，在这里已经是日常，没人多看一眼。这几天在路上、在电梯口、在结账的时候，它们会自己撞上来。",
    en: "A few things here are like that: still newsworthy elsewhere, so ordinary in this city that nobody looks up. Over the next few days they will come to you — on the road, at the lift, at the moment you pay.",
    ar: "بعض الأشياء هنا على هذه الحال: لا تزال خبرًا في أماكن أخرى، وهي هنا من العادية بحيث لا يرفع أحد رأسه. وخلال الأيام القادمة ستأتيكم هي — في الطريق، وعند المصعد، ولحظة الدفع.",
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
        zh: "方向盘自己转了半圈，转向灯亮起来，车汇进车流。红灯前它提前收油，有人横穿马路它停下来等，等人走过去再起步。全程你坐在后排，前面没有人。\\n做这件事的公司叫文远知行，总部就在广州。同样的车现在也跑在阿布扎比的街上；到 2026 年 1 月，它的无人车在全球超过了一千辆。除了出租车，还有无人小巴和无人扫街车。",
        en: "The wheel turns half a revolution, the indicator comes on, and the car slides into traffic. It lifts off the accelerator before the red light; when someone crosses it stops, waits, and moves off again once they are past. You are in the back the whole time, and there is nobody in front of you.\\nThe company is WeRide, headquartered here in Guangzhou. The same cars now run on the streets of Abu Dhabi; by January 2026 its driverless fleet had passed a thousand vehicles worldwide. Besides taxis there are driverless minibuses and street sweepers.",
        ar: "يدور المقود نصف دورة، ويُضاء إشارة الانعطاف، وتنساب السيارة إلى السير. ترفع قدمها عن الوقود قبل الإشارة الحمراء؛ وإن عبر أحد الطريق توقّفت وانتظرت ثم انطلقت بعد مروره. وأنتم في الخلف طوال الوقت، ولا أحد أمامكم.\\nالشركة هي «وي رايد» ومقرّها هنا في قوانغتشو. والسيارات نفسها تسير اليوم في شوارع أبوظبي؛ وبحلول يناير 2026 تجاوز أسطولها بلا سائق ألف مركبة حول العالم. وإلى جانب سيارات الأجرة هناك حافلات صغيرة ومركبات كنس بلا سائق.",
      },
    },
    {
      id: "evtol",
      title: { zh: "两个座位，没有驾驶舱", en: "Two seats, no cockpit", ar: "مقعدان بلا قمرة قيادة" },
      where: {
        zh: "在黄埔的运营点可以买票坐一趟低空观光，要提前约，不在这次日程里。",
        en: "At the operating site in Huangpu you can buy a ticket for a low-altitude sightseeing flight. It needs booking and is not on this trip's schedule.",
        ar: "في موقع التشغيل بهوانغبو يمكن شراء تذكرة لرحلة مشاهدة منخفضة الارتفاع. تحتاج إلى حجز مسبق وليست ضمن برنامج هذه الرحلة.",
      },
      body: {
        zh: "十六个旋翼一起转起来，机身离地，没有跑道，也没有飞行员 —— 座舱里只有两个乘客的位置，路线是地面给好的。\\n这架飞机叫 EH216-S，广州的亿航智能造的。全球第一张无人驾驶载人航空器适航证是它拿的，第一张生产许可证也是它；2025 年又在广州黄埔拿到全球第一张运营合格证。三张证齐了，它才可以卖票载人。",
        en: "Sixteen rotors spin up together and the aircraft leaves the ground — no runway, and no pilot. Inside there are two passenger seats and nothing else; the route is set from the ground.\\nIt is called the EH216-S, built by EHang here in Guangzhou. It holds the world's first airworthiness certificate for a pilotless passenger aircraft, the world's first production certificate, and in 2025 the world's first operator certificate, issued in Huangpu. Only with all three can it sell a ticket and carry a person.",
        ar: "تدور ستة عشر مروحة معًا فترتفع الطائرة عن الأرض — بلا مدرج وبلا طيار. وفي داخلها مقعدان للركاب لا غير؛ أما المسار فيُحدَّد من الأرض.\\nاسمها EH216-S، وتصنعها «إي هانغ» هنا في قوانغتشو. وهي صاحبة أول شهادة صلاحية طيران في العالم لطائرة ركاب بلا طيار، وأول رخصة إنتاج، وفي 2025 أول شهادة تشغيل في العالم، صدرت في هوانغبو. وبهذه الثلاث مجتمعةً فقط يجوز لها بيع تذكرة وحمل راكب.",
      },
    },
    {
      id: "robot",
      title: { zh: "会自己坐电梯的送物小车", en: "The trolley that takes the lift by itself", ar: "العربة التي تركب المصعد وحدها" },
      where: {
        zh: "很多餐厅的菜是机器人推到桌边的；不少酒店的外卖和毛巾也是它送到房门口。入住时可以问一句前台有没有。",
        en: "In many restaurants the dishes come to the table on a robot; in many hotels the takeaway and the fresh towels arrive at your door the same way. Worth asking at the front desk when you check in.",
        ar: "في مطاعم كثيرة تصل الأطباق إلى الطاولة على روبوت؛ وفي فنادق كثيرة يصل الطعام والمناشف إلى بابكم بالطريقة نفسها. ويستحقّ الأمر سؤالًا في الاستقبال عند الوصول.",
      },
      body: {
        zh: "门铃响，门外站着一台一米来高的小车，肚子上的盖子打开，里面是你点的东西。它刚才自己按了电梯、自己上了楼、自己认了门牌号；你把东西拿走，它关上盖子转身回去。\\n这一行排前两名的普渡和擎朗，总部在深圳和上海。普渡一家占了全球商用服务机器人 23% 的份额，出货超过十二万台。",
        en: "The doorbell goes. Outside stands a trolley about a metre high; a lid opens on its front and your order is inside. It called the lift itself, rode up itself, found your room number itself. You take the order out, the lid closes, and it turns around and goes back.\\nThe two leaders of this industry, Pudu and Keenon, are headquartered in Shenzhen and Shanghai. Pudu alone holds 23 percent of the world's commercial service-robot market, with more than 120,000 units shipped.",
        ar: "يرنّ جرس الباب. في الخارج تقف عربة بارتفاع متر تقريبًا، ينفتح غطاء في مقدمتها وفي داخلها طلبكم. لقد استدعت المصعد بنفسها، وصعدت بنفسها، ووجدت رقم غرفتكم بنفسها. تأخذون الطلب، فينغلق الغطاء وتستدير عائدة.\\nالشركتان الرائدتان في هذا المجال، «بودو» و«كينون»، مقرّاهما في شنتشن وشنغهاي. وتستحوذ بودو وحدها على 23% من سوق روبوتات الخدمة التجارية عالميًا، بأكثر من 120 ألف وحدة مشحونة.",
      },
    },
    {
      id: "drone-delivery",
      title: { zh: "从天上落下来的那一单", en: "The order that comes down from the sky", ar: "الطلب الذي ينزل من السماء" },
      where: {
        zh: "在开了航线的商圈和公园，点一份外卖，几分钟后到取餐柜去拿。广州是开了航线的城市之一。",
        en: "In districts and parks with a route open, you order a takeaway and collect it from a locker a few minutes later. Guangzhou is one of the cities with routes running.",
        ar: "في الأحياء والحدائق التي فُتح فيها خط، تطلبون وجبة وتستلمونها من خزانة بعد دقائق. وقوانغتشو من المدن التي تعمل فيها هذه الخطوط.",
      },
      body: {
        zh: "抬头能看见它过来：一台白色的无人机悬在取餐柜上方，慢慢把一个盒子放进去，然后转身飞走，全程没有人。\\n美团的无人机到 2024 年底开了 53 条航线、累计送了四十五万单；光 2024 那一年就送了二十万单，是前一年的两倍。",
        en: "You can watch it arrive: a white drone hovers over the pick-up locker, lowers a box into it, then turns and flies off. Nobody is involved at any point.\\nBy the end of 2024 Meituan's drones were flying 53 routes and had delivered 450,000 orders — 200,000 of them in 2024 alone, twice the year before.",
        ar: "يمكنكم أن تروها قادمة: طائرة مسيّرة بيضاء تحوم فوق خزانة الاستلام، وتُنزل فيها صندوقًا، ثم تستدير وتطير. ولا يتدخّل بشر في أي لحظة.\\nبحلول نهاية 2024 كانت طائرات «مي توان» تطير على 53 خطًا وقد سلّمت 450 ألف طلب — منها 200 ألف في 2024 وحده، أي ضعف العام السابق.",
      },
    },
    {
      id: "cashless",
      imageKey: "cashless",
      title: { zh: "一杯茶的小额付款", en: "Paying for a cup of tea", ar: "دفع ثمن كوب شاي" },
      where: {
        zh: "买水、买茶、打车、在菜市场买两个芒果，都是同一个动作：扫一下码。",
        en: "Water, tea, a taxi, two mangoes at the market — all the same motion: scan a code.",
        ar: "ماء، شاي، سيارة أجرة، حبتا مانجو من السوق — الحركة نفسها دائمًا: مسح رمز.",
      },
      body: {
        zh: "菜市场的摊子前面立着一块二维码牌，塑封磨白了，边角用胶带补过。你把手机凑过去，扫一下，老板看一眼屏幕点点头，交易就完了 —— 全程没有钞票，也没有找零。\\n中国的移动支付普及率 86%，全球第一。这几天你们大概一张纸币都用不上；怎么把国外的卡绑上，这一页的「出发前准备」里写了。",
        en: "At the market stall a laminated QR code stands propped up, the plastic gone milky, one corner mended with tape. You hold your phone to it, it scans, the stallholder glances at the screen and nods, and that is the transaction — no notes, no change.\\nChina's mobile-payment penetration is 86 percent, the highest in the world. You will probably not touch a banknote all week; how to link a foreign card is in the preparation section of this page.",
        ar: "عند بسطة السوق ينتصب رمز QR مغلَّف بالبلاستيك، وقد شحب غلافه ورُقّع أحد أركانه بشريط لاصق. تقرّبون الهاتف منه فيُمسح، فينظر صاحب البسطة إلى الشاشة ويومئ، وتنتهي المعاملة — بلا أوراق نقدية وبلا فكّة.\\nنسبة انتشار الدفع بالهاتف في الصين 86%، الأعلى في العالم. ولن تلمسوا على الأرجح ورقة نقدية طوال الأسبوع؛ وكيفية ربط بطاقة أجنبية مذكورة في قسم الاستعداد بهذه الصفحة.",
      },
    },
    {
      id: "ev-taxi",
      imageKey: "evtaxi",
      title: { zh: "安静得让人愣一下的出租车", en: "A taxi quiet enough to make you pause", ar: "سيارة أجرة هادئة إلى حدّ يوقفكم لحظة" },
      where: {
        zh: "这几天你们叫到的车，几乎每一辆都是电动的。",
        en: "Almost every car you hail this week will be an electric one.",
        ar: "كل سيارة تستوقفونها هذا الأسبوع تقريبًا ستكون كهربائية.",
      },
      body: {
        zh: "关上门的那一下你可能会愣一下：没有发动机的抖动，没有汽油味，只剩空调的风声。起步的时候车是悄悄滑出去的。\\n到 2025 年 6 月底，广州的网约车 98% 是电动车；珠三角新上路的出租车和网约车，按规定必须是新能源。造这些车的广汽，总部也在广州。",
        en: "The moment the door shuts you may pause: no engine shaking, no smell of petrol, only the sound of the air conditioning. When it pulls away it simply slides.\\nBy the end of June 2025, 98 percent of Guangzhou's ride-hailing cars were electric, and every new taxi or ride-hailing car in the Pearl River Delta must be a new-energy vehicle. GAC, which builds many of them, is headquartered here too.",
        ar: "لحظة إغلاق الباب قد تتوقّفون: لا ارتجاج محرّك، ولا رائحة بنزين، لا شيء سوى صوت المكيّف. وحين تنطلق فإنها تنساب انسيابًا.\\nبحلول نهاية يونيو 2025 كانت 98% من سيارات النقل التشاركي في قوانغتشو كهربائية، ويجب أن تكون كل سيارة أجرة أو نقل تشاركي جديدة في دلتا نهر اللؤلؤ مركبة طاقة جديدة. وشركة «جي إيه سي» التي تصنع كثيرًا منها مقرّها هنا أيضًا.",
      },
    },
  ],
  sources: [
    { label: { zh: "文远知行：广州黄埔开通 7×24 小时全无人 Robotaxi 服务", en: "WeRide: 24/7 fully driverless Robotaxi service in Guangzhou's Huangpu", ar: "وي رايد: خدمة روبوتاكسي بلا سائق على مدار الساعة في هوانغبو" }, url: "https://ir.weride.ai/news-releases/news-release-details/weride-launches-247-fully-driverless-robotaxi-service-guangzhous" },
    { label: { zh: "文远知行：在微信小程序里叫车", en: "WeRide: booking a robotaxi inside WeChat", ar: "وي رايد: حجز روبوتاكسي عبر وي تشات" }, url: "https://ir.weride.ai/news-releases/news-release-details/weride-makes-robotaxi-booking-effortless-tencents-super-app" },
    { label: { zh: "新浪科技：文远知行 Robotaxi 车队突破千辆", en: "Sina Tech: WeRide's Robotaxi fleet passes 1,000", ar: "سينا تك: أسطول وي رايد يتجاوز ألف مركبة" }, url: "https://finance.sina.com.cn/tech/digi/2026-01-16/doc-inhhnzaw0673277.shtml" },
    { label: { zh: "广州市政府：全球首张载人 eVTOL 运营合格证落地广州黄埔", en: "Guangzhou government: the world's first passenger-eVTOL operator certificate, Huangpu", ar: "حكومة قوانغتشو: أول شهادة تشغيل لطائرة ركاب كهربائية في العالم، هوانغبو" }, url: "https://www.gz.gov.cn/ysgz/xwdt/ysdt/content/post_10193139.html" },
    { label: { zh: "亿航智能：EH216-S 获民航局标准适航证", en: "EHang: EH216-S receives its type certificate from the CAAC", ar: "إي هانغ: EH216-S تحصل على شهادة الصلاحية من هيئة الطيران" }, url: "https://www.ehang.com/news/1022.html" },
    { label: { zh: "普渡：酒店配送机器人", en: "Pudu: hospitality delivery robots", ar: "بودو: روبوتات التوصيل الفندقية" }, url: "https://www.pudurobotics.com/en/solutions/hospitality" },
    { label: { zh: "前瞻：2025 年中国餐饮配送机器人行业全景", en: "Qianzhan: China's food-delivery robot industry, 2025", ar: "تشيانتشان: صناعة روبوتات توصيل الطعام في الصين 2025" }, url: "https://ecoapp.qianzhan.com/detials/250530-9cf3847c.html" },
    { label: { zh: "南方财经：美团无人机 2024 年配送超 20 万单", en: "SFC: Meituan drones delivered over 200,000 orders in 2024", ar: "إس إف سي: طائرات مي توان سلّمت أكثر من 200 ألف طلب في 2024" }, url: "https://www.sfccn.com/2025/1-24/4MMDE0NzNfMTk4NzI4Mw.html" },
    { label: { zh: "中国政府网：外籍人士在华支付指南", en: "gov.cn: paying in China as a foreign visitor", ar: "بوابة الحكومة الصينية: الدفع في الصين للزائر الأجنبي" }, url: "https://english.www.gov.cn/2025special/bizexpatsinchina2025" },
    { label: { zh: "人民网广东：珠三角新增网约车须为新能源汽车", en: "People's Daily Guangdong: new ride-hailing cars in the Delta must be NEVs", ar: "صحيفة الشعب قوانغدونغ: سيارات النقل التشاركي الجديدة في الدلتا يجب أن تكون كهربائية" }, url: "http://gd.people.com.cn/n2/2024/1212/c123932-41073362.html" },
  ],
};
'''

block("CITY_SCALE", CITY_SCALE)
block("CITY_TECH", CITY_TECH)
P.write_text(s, encoding="utf-8")
print(f"重写完成：{n0} → {len(s)} 字节")
