#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""用户纠正后的三件事：
1. 新增「科技就在身边」—— 眼睛看得见的强：无人车、载人无人机、送餐机器人、无人机送外卖、
   无现金、电动出租车。每一样都写她这几天在哪能亲眼见到。数字全部有来源。
2. 「这座城有多大」按体验重写口吻；顺手改掉两处不实的话：
   - 「接近开罗大都会区的两倍」是错的（大开罗两千多万人，广州 1910 万），删掉这个比较；
   - 琶洲「从酒店窗户看出去的那些新楼就是它们」—— 窗户朝向没法保证，改成「就在酒店旁边」。
3. 商圈那节改成给商场方看的：他们是 Citystars 的招商，看商圈是他们自己的活、写自己的报告；
   删掉「做零售的人一定要看」这类话。
"""
import pathlib, sys

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

# ── 1. 科技就在身边 ─────────────────────────────────────────────────
TECH = '''
/* ------------------------------------------------------------------ */
/* 科技就在身边                                                          */
/*                                                                     */
/* 「中国很强」不能只写在报表上，要写她这几天亲眼能看到的东西。          */
/* 每一条：是什么、在哪能见到、一个硬数字、来源。不写看不到的。          */
/* ------------------------------------------------------------------ */

export type TechItem = {
  id: string;
  imageKey?: string;
  title: L10n;
  /** 她能在哪、怎么见到。 */
  where: L10n;
  /** 事实与数字。 */
  body: L10n;
};

export const CITY_TECH: {
  lead: L10n;
  intro: L10n;
  items: TechItem[];
  sources: { label: L10n; url: string }[];
} = {
  lead: {
    zh: "有几样东西，在广州街上是日常，在世界上多数地方还是新闻。",
    en: "A few things that are everyday on Guangzhou's streets are still headlines almost everywhere else.",
    ar: "بضعة أشياء هي روتين يومي في شوارع قوانغتشو، لكنها لا تزال عناوين أخبار في معظم أنحاء العالم.",
  },
  intro: {
    zh: "下面这些不用专门去找，这几天走在路上、坐在车里、吃着饭就会碰到。碰到了别惊讶，那就是这座城的日常。",
    en: "None of this needs a special trip. Over these few days you will run into it on the road, in the car, at the table. When you do, don't be surprised — this is simply how the city runs.",
    ar: "لا يحتاج أيٌّ من هذا إلى رحلة خاصة. خلال هذه الأيام ستصادفونه في الطريق وفي السيارة وعلى المائدة. وحين يحدث فلا تندهشوا — فهكذا تعمل هذه المدينة ببساطة.",
  },
  items: [
    {
      id: "robotaxi",
      imageKey: "robotaxi",
      title: { zh: "没有司机的出租车", en: "Taxis with no driver", ar: "سيارات أجرة بلا سائق" },
      where: {
        zh: "白云机场、广州南站到市区地标之间有八条示范线，24 小时跑；市中心也能叫到。车顶一圈传感器、驾驶座空着，就是它。",
        en: "Eight demonstration routes link Baiyun Airport and Guangzhou South station with city landmarks, running around the clock; they can be hailed downtown too. Sensors around the roof, nobody in the driver's seat — that is one.",
        ar: "ثمانية خطوط تجريبية تربط مطار بايون ومحطة قوانغتشو الجنوبية بمعالم المدينة وتعمل على مدار الساعة؛ ويمكن طلبها وسط المدينة أيضًا. مستشعرات حول السقف ومقعد السائق فارغ — تلك هي.",
      },
      body: {
        zh: "做这件事的公司叫文远知行，总部就在广州。它在广州、北京和阿布扎比都跑的是「车里一个人都没有」的纯无人商业运营，2026 年 1 月全球车队过了一千辆。除了出租车，还有无人小巴和无人环卫车。",
        en: "The company is WeRide, headquartered in Guangzhou. In Guangzhou, Beijing and Abu Dhabi it runs fully driverless commercial service — no one in the car at all — and in January 2026 its global fleet passed a thousand vehicles. Beyond taxis there are driverless minibuses and street sweepers.",
        ar: "الشركة هي «وي رايد» ومقرّها في قوانغتشو. وتشغّل في قوانغتشو وبكين وأبوظبي خدمة تجارية بلا سائق إطلاقًا — لا أحد في السيارة — وفي يناير 2026 تجاوز أسطولها العالمي ألف مركبة. وإلى جانب سيارات الأجرة هناك حافلات صغيرة ومركبات تنظيف شوارع بلا سائق.",
      },
    },
    {
      id: "evtol",
      imageKey: "evtol",
      title: { zh: "载人的无人机", en: "A drone that carries people", ar: "طائرة مسيّرة تحمل الركاب" },
      where: {
        zh: "在黄埔的运营点可以买票坐一趟低空观光。想看得先约，不在日程里；但要知道，这东西是广州造的。",
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
      id: "robots",
      imageKey: "robot",
      title: { zh: "送餐的机器人", en: "The robot that brings your food", ar: "الروبوت الذي يجلب طعامكم" },
      where: {
        zh: "很多餐厅里菜是机器人推到桌边的，不少酒店里外卖和毛巾是机器人送到房门口的，自己坐电梯上来。",
        en: "In many restaurants the dishes arrive at the table on a robot; in many hotels the takeaway or fresh towels come to your door on one, riding the lift by itself.",
        ar: "في مطاعم كثيرة تصل الأطباق إلى الطاولة على روبوت؛ وفي فنادق كثيرة يصل الطعام الجاهز أو المناشف إلى بابكم على روبوت يركب المصعد بنفسه.",
      },
      body: {
        zh: "这个行业的两家头部企业普渡和擎朗都是广东公司。普渡一家就占全球商用服务机器人 23% 的份额，累计出货超过十二万台。",
        en: "The two leaders of this industry, Pudu and Keenon, are both Guangdong companies. Pudu alone holds 23 percent of the world's commercial service-robot market, with more than 120,000 units shipped.",
        ar: "الشركتان الرائدتان في هذه الصناعة، «بودو» و«كينون»، كلتاهما من قوانغدونغ. وتستحوذ بودو وحدها على 23% من سوق روبوتات الخدمة التجارية في العالم، بأكثر من 120 ألف وحدة مشحونة.",
      },
    },
    {
      id: "drone-delivery",
      imageKey: "drone",
      title: { zh: "无人机送外卖", en: "Takeaway by drone", ar: "توصيل الطعام بالطائرات المسيّرة" },
      where: {
        zh: "在开通航线的商圈和公园，点一份外卖，几分钟后从天上落到取餐柜里。广州是开了航线的城市之一。",
        en: "In districts and parks with a route, you order a takeaway and a few minutes later it drops from the sky into a pick-up locker. Guangzhou is one of the cities with routes open.",
        ar: "في الأحياء والحدائق التي فيها خط، تطلبون وجبة جاهزة فتهبط بعد دقائق من السماء في خزانة استلام. وقوانغتشو من المدن التي فُتحت فيها الخطوط.",
      },
      body: {
        zh: "美团无人机到 2024 年底开了 53 条航线，累计送了四十五万单，2024 年一年就送了二十万单，翻了一倍。",
        en: "By the end of 2024 Meituan's drones flew 53 routes and had delivered 450,000 orders — 200,000 of them in 2024 alone, double the year before.",
        ar: "بحلول نهاية 2024 كانت طائرات «مي توان» المسيّرة تطير على 53 خطًا وقد سلّمت 450 ألف طلب — منها 200 ألف في عام 2024 وحده، أي ضعف العام السابق.",
      },
    },
    {
      id: "cashless",
      imageKey: "cashless",
      title: { zh: "一个城市不用现金", en: "A city that doesn't use cash", ar: "مدينة لا تستخدم النقد" },
      where: {
        zh: "从早茶店到菜市场到出租车，付钱就是扫一下码。这几天你们大概一张纸币都用不上。",
        en: "From the yum cha house to the wet market to the taxi, paying is one scan of a code. You will probably not touch a banknote all week.",
        ar: "من مطعم اليوم تشا إلى سوق الخضار إلى سيارة الأجرة، الدفع مسحُ رمزٍ واحد. غالبًا لن تلمسوا ورقة نقدية طوال الأسبوع.",
      },
      body: {
        zh: "中国的移动支付普及率 86%，全球第一。本页的出发前准备里写了怎么绑外卡。",
        en: "China's mobile-payment penetration is 86 percent, the highest in the world. The preparation section on this page explains how to link a foreign card.",
        ar: "نسبة انتشار الدفع بالهاتف في الصين 86%، الأعلى في العالم. ويشرح قسم الاستعداد في هذه الصفحة كيفية ربط بطاقة أجنبية.",
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
        zh: "到 2025 年 6 月底，广州网约车电动化率 98%；珠三角新增的出租车和网约车全部是新能源车。广汽自己就是造电动车的大厂。",
        en: "By the end of June 2025, 98 percent of Guangzhou's ride-hailing cars were electric, and every new taxi or ride-hailing car in the Pearl River Delta must be a new-energy vehicle. GAC, the city's own carmaker, is a major EV maker.",
        ar: "بحلول نهاية يونيو 2025 كانت 98% من سيارات النقل التشاركي في قوانغتشو كهربائية، ويجب أن تكون كل سيارة أجرة أو نقل تشاركي جديدة في دلتا نهر اللؤلؤ مركبة طاقة جديدة. وشركة «جي إيه سي»، صانعة السيارات المحلية، من كبار صانعي السيارات الكهربائية.",
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

/* ------------------------------------------------------------------ */
/* 你们住的这块地：琶洲                                                  */'''
rep('''
/* ------------------------------------------------------------------ */
/* 你们住的这块地：琶洲                                                  */''', TECH, "插入 CITY_TECH")

# ── 2. 这座城有多大：口吻与两处不实 ──────────────────────────────────
rep('''      zh: "2025 年广州的地区生产总值是 3.2 万亿元人民币，按 2025 年约 7.2 的汇率折合四千四百多亿美元；世界银行给出的埃及 2024 年全国 GDP 是 3890 亿美元。这只是广州一座城，常住人口一千九百多万。",''',
    '''      zh: "先说一个数：2025 年广州的 GDP 是 3.2 万亿元人民币，按当年约 7.2 的汇率折合四千四百多亿美元。世界银行给埃及 2024 年全国的数是 3890 亿美元。也就是说，你们落地的这一座城，一年做出的经济总量比整个埃及还多 —— 而它只有一千九百多万人。",''',
    "GDP 段口吻")
rep('''      en: "Guangzhou's GDP in 2025 was 3.2 trillion yuan — about 440 billion US dollars at 2025's rate of roughly 7.2. The World Bank puts all of Egypt's GDP for 2024 at 389 billion dollars. This is one city, with just over nineteen million residents.",''',
    '''      en: "Start with one number. Guangzhou's GDP in 2025 was 3.2 trillion yuan — about 440 billion US dollars at that year's rate of roughly 7.2. The World Bank puts all of Egypt's GDP for 2024 at 389 billion dollars. The single city you are landing in produces more in a year than the whole of Egypt — with just over nineteen million people.",''',
    "GDP 段口吻 en")
rep('''      ar: "بلغ الناتج المحلي الإجمالي لقوانغتشو عام 2025 نحو 3.2 تريليون يوان — أي ما يزيد على 440 مليار دولار بسعر صرف 2025 البالغ نحو 7.2. ويقدّر البنك الدولي ناتج مصر كلّها لعام 2024 بـ 389 مليار دولار. وهذه مدينة واحدة، يسكنها ما يزيد قليلًا على تسعة عشر مليون نسمة.",''',
    '''      ar: "لنبدأ برقم واحد. بلغ الناتج المحلي الإجمالي لقوانغتشو عام 2025 نحو 3.2 تريليون يوان — أي ما يزيد على 440 مليار دولار بسعر صرف ذلك العام البالغ نحو 7.2. ويقدّر البنك الدولي ناتج مصر كلّها لعام 2024 بـ 389 مليار دولار. أي أن المدينة الواحدة التي تهبطون فيها تنتج في السنة أكثر من مصر بأكملها — بسكان لا يتجاوزون تسعة عشر مليونًا إلا قليلًا.",''',
    "GDP 段口吻 ar")
# 大开罗两千多万，「两倍」是错的 —— 删掉比较
rep('''      note: { zh: "接近开罗大都会区的两倍", en: "Close to twice Greater Cairo", ar: "قرابة ضعف القاهرة الكبرى" },''',
    '''      note: { zh: "一座城的人口，比很多国家都多", en: "One city with more people than many countries", ar: "مدينة واحدة يفوق سكانها سكان دول كثيرة" },''',
    "人口注解")
# 琶洲：窗户朝向没法保证
rep('''      zh: "展馆背后，是 2015 年起建的人工智能与数字经济试验区：腾讯、阿里巴巴、唯品会的总部大楼都在这里，三万六千多家企业，一年营收四千五百亿元以上。从酒店窗户看出去的那些新楼，就是它们。",''',
    '''      zh: "展馆背后，是 2015 年起建的人工智能与数字经济试验区：腾讯、阿里巴巴、唯品会的总部大楼都在这里，三万六千多家企业，一年营收四千五百亿元以上。酒店周围那些新起的写字楼，就是它们。",''',
    "琶洲 窗户 zh")
rep('''      en: "Behind the halls is the AI and digital-economy zone begun in 2015: the headquarters towers of Tencent, Alibaba and Vipshop stand here, among more than 36,000 companies with combined annual revenue above 450 billion yuan. The new towers you see from the hotel window are those.",''',
    '''      en: "Behind the halls is the AI and digital-economy zone begun in 2015: the headquarters towers of Tencent, Alibaba and Vipshop stand here, among more than 36,000 companies with combined annual revenue above 450 billion yuan. The new office towers around the hotel are those.",''',
    "琶洲 窗户 en")
rep('''      ar: "وخلف القاعات تقع منطقة الذكاء الاصطناعي والاقتصاد الرقمي التي بدأ بناؤها عام 2015: أبراج المقار الرئيسية لتينسنت وعلي بابا وفيبشوب هنا، بين أكثر من 36 ألف شركة يتجاوز إيرادها السنوي مجتمعةً 450 مليار يوان. والأبراج الجديدة التي ترونها من نافذة الفندق هي تلك.",''',
    '''      ar: "وخلف القاعات تقع منطقة الذكاء الاصطناعي والاقتصاد الرقمي التي بدأ بناؤها عام 2015: أبراج المقار الرئيسية لتينسنت وعلي بابا وفيبشوب هنا، بين أكثر من 36 ألف شركة يتجاوز إيرادها السنوي مجتمعةً 450 مليار يوان. وأبراج المكاتب الجديدة حول الفندق هي تلك.",''',
    "琶洲 窗户 ar")

# ── 3. 商圈：给商场方看，是他们自己的报告 ────────────────────────────
rep('''    zh: "一条 2.8 公里的路，一年做出一万亿元的生意。",
    en: "A road 2.8 kilometres long that does a trillion yuan of business a year.",
    ar: "طريق طوله 2.8 كيلومتر يحقّق تريليون يوان من الأعمال سنويًا.",''',
    '''    zh: "一条 2.8 公里的路，十四家商场，一年做出一万亿元的生意 —— 给做商场的人看的一节。",
    en: "A road 2.8 kilometres long, fourteen malls, a trillion yuan of business a year — a section for people who run malls.",
    ar: "طريق طوله 2.8 كيلومتر، أربعة عشر مركزًا تجاريًا، تريليون يوان من الأعمال سنويًا — قسمٌ لمن يديرون المراكز التجارية.",''',
    "商圈 lead")
rep('''      zh: "做零售的人一定要看：这是华南第一商圈。",
      en: "Anyone in retail has to see it: the number-one shopping district in South China.",
      ar: "على كل من يعمل في التجزئة أن يراه: منطقة التسوّق الأولى في جنوب الصين.",''',
    '''      zh: "做商场的人来广州，这里是最该花半天的地方：华南第一商圈，十四家综合体挤在一条路上。",
      en: "For anyone who runs a mall, this is the half day to spend in Guangzhou: the number-one shopping district in South China, fourteen complexes on one road.",
      ar: "لمن يدير مركزًا تجاريًا، هذا هو نصف اليوم الذي يستحق الإنفاق في قوانغتشو: منطقة التسوّق الأولى في جنوب الصين، أربعة عشر مجمّعًا على طريق واحد.",''',
    "天河路路线 bestFor")
rep('''  takeaways: [
    {
      zh: "分层不重叠：同一条路上从太古汇到时尚天河，每家的价格带和客群都不一样，所以十四家综合体能共存。",''',
    '''  takeaways: [
    {
      zh: "招商先定位：同一条路上从太古汇到时尚天河，每家先定自己的价格带和客群，再按这个去招商，所以十四家综合体能共存而不互相抢租户。",''',
    "takeaway 1 zh")
rep('''      en: "Tiered, not overlapping: from Taikoo Hui down to Fashion Tianhe, each mall on the same road holds a different price band and crowd, which is how fourteen complexes coexist.",''',
    '''      en: "Positioning before leasing: from Taikoo Hui down to Fashion Tianhe, each mall on the same road fixes its price band and crowd first and leases to that, which is how fourteen complexes coexist without fighting over tenants.",''',
    "takeaway 1 en")
rep('''      ar: "متدرّج لا متداخل: من تايكو هوي إلى فاشن تيانخه، يحتلّ كل مركز في الطريق نفسه شريحة أسعار وجمهورًا مختلفين، وهكذا تتعايش أربعة عشر مجمّعًا.",''',
    '''      ar: "التموضع قبل التأجير: من تايكو هوي إلى فاشن تيانخه، يحدّد كل مركز في الطريق نفسه شريحة أسعاره وجمهوره أولًا ثم يؤجّر على هذا الأساس، وهكذا تتعايش أربعة عشر مجمّعًا دون تنازع على المستأجرين.",''',
    "takeaway 1 ar")

if miss:
    print(f"未命中 {len(miss)} 处：")
    for n, c, a in miss: print(f"  ✗ [{c}] {n}\\n     {a}")
    sys.exit(1)
P.write_text(s, encoding="utf-8")
print(f"OK：{n0} → {len(s)} 字节")
