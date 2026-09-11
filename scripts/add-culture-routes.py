#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""三件事（用户当次要求）：
1. 出发前准备分人：手机上网 / 翻译与求助 / 支付 是给区域经理与防损（Ahmed、Mohamed）的，
   Reham 不该看到；Reham 单独一份，只写已知适用于她的事，不编。
2. 新增「常见的文化差异」——他们可能会困惑的点。
3. 路线：砍掉黄埔古港；沙面留；花城广场必去；其余换成能看到科技、现代化与繁华的地方。
   门票与营业时间不写未核实的数字，沿用原路线的口径。
"""
import pathlib, re, sys

P = pathlib.Path("lib/trip-data.ts")
s = P.read_text(encoding="utf-8")
n0 = len(s)
miss = []

def rep(a, b, note, count=1):
    global s
    c = s.count(a)
    if c != count:
        miss.append((note, c, a[:70])); return
    s = s.replace(a, b)

# ── 1. PrepItem 加受众 ─────────────────────────────────────────────
rep('export type PrepItem = { id: string; title: L10n; lines: L10n[] };',
    '''/** audience 缺省 = 所有人都看。全员视图（?p=all）不筛，给统筹的人看全貌。 */
export type PrepItem = { id: string; title: L10n; lines: L10n[]; audience?: PersonId[] };''',
    "PrepItem 类型")

# 三条是给 Ahmed / Mohamed 的 —— 只在 PREP 数组内替换（"payment" 这个 id 别处也有）
_ps = s.find("export const PREP: PrepItem[] = [")
_pe = s.find("\n];", _ps) + 3
_block = s[_ps:_pe]
for pid in ("sim", "translate", "payment"):
    a = f'''  {{
    id: "{pid}",
    title: {{'''
    b = f'''  {{
    id: "{pid}",
    audience: ["ahmed", "hassan"],
    title: {{'''
    if _block.count(a) != 1:
        miss.append((f"PREP {pid} 受众", _block.count(a), a[:60]))
    else:
        _block = _block.replace(a, b)
s = s[:_ps] + _block + s[_pe:]

# Reham 单独一份：只写已知的事
rep('''  {
    id: "weather",
    title: {''', '''  {
    id: "reham-transfer",
    audience: ["reham"],
    title: {
      zh: "机场接送",
      en: "Airport transfers",
      ar: "التنقّل من المطار وإليه",
    },
    lines: [
      {
        zh: "去程 9/20 晚 21:20 到开罗 T3，MS958 次日 00:20 起飞，直飞广州 T3，15:30 落地。",
        en: "Outbound: be at Cairo T3 by 21:20 on 20 Sep; MS958 departs 00:20 the next morning, direct to Guangzhou T3, landing 15:30.",
        ar: "الذهاب: الوصول إلى صالة 3 بمطار القاهرة بحلول 21:20 يوم 20 سبتمبر؛ تقلع MS958 في 00:20 صباح اليوم التالي مباشرةً إلى صالة 3 بقوانغتشو، وتهبط 15:30.",
      },
      {
        zh: "广州往返机场的车由公司安排，对接人是 Rahma；车辆和出发时间还没定，定了以行程表为准。",
        en: "Transfers between the airport and the hotel in Guangzhou are arranged by the company; Rahma is your contact. Vehicle and pick-up times are not yet fixed — the itinerary will show them once they are.",
        ar: "تتولّى الشركة ترتيب التنقّل بين المطار والفندق في قوانغتشو، ومنسّقتك هي Rahma. لم تُحدَّد السيارة ومواعيد الانطلاق بعد — وسيظهر ذلك في جدول الرحلة حين يتقرّر.",
      },
      {
        zh: "回程 9/27 夜航 MS959，23:20 从广州 T3 起飞；当天退房后行李寄存或延迟退房还待确认。",
        en: "Return: MS959 on the night of 27 Sep, departing Guangzhou T3 at 23:20; whether the hotel holds your luggage or extends check-out that day is still to be confirmed.",
        ar: "العودة: MS959 ليلة 27 سبتمبر، تقلع من صالة 3 بقوانغتشو في 23:20؛ ولم يُؤكَّد بعد إن كان الفندق سيحفظ أمتعتك أو يمدّد موعد المغادرة ذلك اليوم.",
      },
    ],
  },
  {
    id: "reham-page",
    audience: ["reham"],
    title: {
      zh: "这一页怎么用",
      en: "How to use this page",
      ar: "كيف تستخدمين هذه الصفحة",
    },
    lines: [
      {
        zh: "「可复制的中文地址」和「中文短句」是给司机和店员看的：点开，把手机举给对方，不用会说中文。",
        en: "The Chinese addresses and phrases further down are for showing to drivers and staff: open one, hold up the phone, no Chinese needed.",
        ar: "العناوين والعبارات الصينية أدناه مخصّصة لعرضها على السائقين والعاملين: افتحيها وارفعي الهاتف، ولا حاجة إلى الصينية.",
      },
      {
        zh: "「礼拜与清真餐」里有三座清真寺和一家清真老字号的地址卡；9/25 周五是这趟唯一的主麻日。",
        en: "“Prayer and halal food” holds address cards for three mosques and one long-standing halal restaurant; Friday 25 Sep is the only Jumu'ah of the stay.",
        ar: "في قسم «الصلاة والطعام الحلال» بطاقات عناوين لثلاثة مساجد ومطعم حلال عريق؛ والجمعة 25 سبتمبر هي جمعة الإقامة الوحيدة.",
      },
      {
        zh: "免费行李额一节里有埃航商务舱的标准：票面 2 件托运，每件不超过 32 公斤。",
        en: "The baggage section has the EgyptAir business-class allowance: two checked bags on the ticket, each up to 32 kg.",
        ar: "في قسم الأمتعة مخصّص درجة رجال الأعمال على مصر للطيران: حقيبتان مسجّلتان حسب التذكرة، كل منهما حتى 32 كغ.",
      },
    ],
  },
  {
    id: "weather",
    title: {''', "Reham 两条")

# ── 2. 常见的文化差异 ───────────────────────────────────────────────
CULTURE = '''
/* ------------------------------------------------------------------ */
/* 常见的文化差异                                                        */
/*                                                                     */
/* 用户要的：他们会遇到一些让他们困惑的点，先说在前面。                   */
/* 口吻是「这里的习惯是这样」，不是教训谁；每条都给一个当场能用的办法。   */
/* ------------------------------------------------------------------ */

export type CultureNote = { id: string; title: L10n; body: L10n };

export const CULTURE_NOTES: CultureNote[] = [
  {
    id: "friday",
    title: { zh: "周五是工作日", en: "Friday is a working day", ar: "الجمعة يوم عمل" },
    body: {
      zh: "中国的周末是周六和周日，周五照常上班上课，商场和写字楼没有礼拜安排。主麻要自己留出时间去清真寺，公共场所几乎没有祈祷室 —— 酒店房间是最稳妥的地方。",
      en: "China's weekend is Saturday and Sunday; Friday is an ordinary working day, and offices and malls make no allowance for prayer. Set aside time yourself for Jumu'ah at a mosque, and expect almost no prayer rooms in public places — your hotel room is the reliable option.",
      ar: "عطلة الأسبوع في الصين هي السبت والأحد؛ والجمعة يوم عمل عادي، ولا تُراعي المكاتب والمراكز التجارية أوقات الصلاة. خصّصوا الوقت بأنفسكم لصلاة الجمعة في المسجد، ولا تتوقّعوا وجود مصلّيات في الأماكن العامة — فغرفة الفندق هي الخيار المضمون.",
    },
  },
  {
    id: "halal-concept",
    title: { zh: "「清真」这个词很多人不懂", en: "Most people won't know what halal means", ar: "معظم الناس لا يعرفون معنى «حلال»" },
    body: {
      zh: "在广州，除了清真馆子，普通餐厅的店员大多不知道清真是什么，也不觉得猪油、料酒是需要说明的东西 —— 猪肉在这里是最普通的肉。所以要问的不是「是不是清真」，而是具体问「有没有猪肉、猪油、酒」，本页有现成的中文句子。",
      en: "Outside the halal restaurants, most staff in Guangzhou have never heard of halal and would not think to mention lard or cooking wine — pork is simply the everyday meat here. So the question to ask is not “is it halal” but the concrete one: does it contain pork, lard or alcohol. The Chinese sentence is ready on this page.",
      ar: "خارج مطاعم الحلال، لم يسمع معظم العاملين في قوانغتشو بكلمة «حلال»، ولن يخطر لهم ذكر شحم الخنزير أو نبيذ الطهي — فلحم الخنزير هنا هو اللحم اليومي العادي. لذا السؤال ليس «هل هو حلال» بل السؤال المحدّد: هل فيه لحم خنزير أو شحمه أو كحول. والجملة الصينية جاهزة في هذه الصفحة.",
    },
  },
  {
    id: "toast",
    title: { zh: "酒桌上怎么办", en: "When the toasts start", ar: "حين تبدأ الأنخاب" },
    body: {
      zh: "正式饭局上会有人举杯敬酒，这是表达尊重，不是逼你喝。不喝酒的人举起茶杯或水杯一起碰就行，说一句「我以茶代酒」—— 这是中国人自己也常用的说法，没有人会介意。",
      en: "At a formal dinner people will raise glasses to you; it is a mark of respect, not pressure to drink. Raise your tea or water instead and clink along — the phrase yi cha dai jiu, “tea in place of wine”, is one the Chinese use themselves, and nobody will mind.",
      ar: "في العشاء الرسمي سيرفع الناس أكوابهم لكم؛ وهذا تعبير عن الاحترام لا إلزامٌ بالشرب. ارفعوا كوب الشاي أو الماء وقرعوا به الأكواب — وعبارة «يي تشا داي جيو» أي «الشاي بدل النبيذ» يستخدمها الصينيون أنفسهم، ولن يمانع أحد.",
    },
  },
  {
    id: "no-tip",
    title: { zh: "不用给小费", en: "No tipping", ar: "لا إكراميات" },
    body: {
      zh: "餐厅、出租车、酒店都不收小费，给了对方反而会不知所措，有时会追出来还给你。账单是多少就付多少。",
      en: "Restaurants, taxis and hotels do not take tips; offering one causes confusion, and sometimes the person will chase after you to hand it back. The bill is the bill.",
      ar: "لا تقبل المطاعم وسيارات الأجرة والفنادق الإكراميات؛ وتقديمها يُربك الطرف الآخر، وقد يلحق بكم أحيانًا ليردّها. الفاتورة هي الفاتورة.",
    },
  },
  {
    id: "phone-pay",
    title: { zh: "钱在手机里", en: "Money lives in the phone", ar: "المال في الهاتف" },
    body: {
      zh: "这里几乎所有人用手机付钱：支付宝或微信，扫一下二维码。小店可能找不开大额现金，出租车也更习惯扫码。收款方式有两种 —— 店家扫你手机上的码，或者你扫店家贴出来的码，看对方手势就知道。",
      en: "Almost everyone here pays by phone — Alipay or WeChat, one scan of a QR code. Small shops may not have change for large notes and taxi drivers prefer to scan. It works two ways: the shop scans the code on your phone, or you scan the code the shop has put up — follow whichever way they gesture.",
      ar: "يدفع الجميع هنا تقريبًا بالهاتف — «أليباي» أو «وي تشات»، بمسح رمز QR واحد. وقد لا تملك المتاجر الصغيرة فكّة للأوراق الكبيرة، ويفضّل سائقو الأجرة المسح. ويتمّ بطريقتين: يمسح المتجر الرمز على هاتفكم، أو تمسحون الرمز المعلّق في المتجر — اتّبعوا إشارة الطرف الآخر.",
    },
  },
  {
    id: "handshake",
    title: { zh: "握手与称呼", en: "Handshakes and names", ar: "المصافحة والأسماء" },
    body: {
      zh: "商务场合男女之间握手很普通。不方便握手的话，点头微笑、手放在胸口，对方会明白，不会觉得失礼。称呼上，中国人姓在前名在后；不确定怎么叫时，用「姓 + 总」或「姓 + 经理」最稳妥。",
      en: "In business settings men and women shake hands as a matter of course. If you would rather not, a nod and a smile with a hand to the chest is understood and not taken as rude. Chinese names put the family name first; when unsure, family name plus zong (boss) or jingli (manager) is the safe form.",
      ar: "في المواقف التجارية يتصافح الرجال والنساء بشكل اعتيادي. وإن لم ترغبوا، فإيماءة وابتسامة مع وضع اليد على الصدر مفهومة ولا تُعدّ جفاءً. وتأتي الأسماء الصينية باسم العائلة أولًا؛ وعند الشك، فاسم العائلة مع «تسونغ» (رئيس) أو «جينغلي» (مدير) هو الصيغة الآمنة.",
    },
  },
  {
    id: "personal-questions",
    title: { zh: "有些问题不是冒犯", en: "Some questions are not prying", ar: "بعض الأسئلة ليست فضولًا" },
    body: {
      zh: "初次见面就问你多大、结婚没有、有几个孩子、住哪里，在中国是拉近距离的闲聊，不是打探。不想答就笑着带过，没人会追问。同样，「吃了吗」是打招呼，不是真的要请你吃饭。",
      en: "Being asked on first meeting how old you are, whether you are married, how many children you have or where you live is friendly small talk in China, not interrogation. Smile past anything you would rather not answer; nobody will press. Likewise “have you eaten?” is a greeting, not an invitation.",
      ar: "أن يسألوكم في أول لقاء عن العمر والزواج وعدد الأولاد ومكان السكن هو دردشة ودّية في الصين لا استجواب. تجاوزوا بابتسامة ما لا تودّون الإجابة عنه؛ ولن يُلحّ أحد. وكذلك «هل أكلت؟» تحية لا دعوة.",
    },
  },
  {
    id: "table",
    title: { zh: "饭桌上的规矩", en: "At the table", ar: "على المائدة" },
    body: {
      zh: "菜放在转盘上大家共享，转的时候看一眼别人是否正在夹菜。有的餐厅备「公筷」专门夹菜到自己碗里。主人先动筷再开始；筷子不要竖插在饭里。吃不惯的东西留在盘里没关系，没人会介意。",
      en: "Dishes sit on a turntable and are shared; glance before you turn it, in case someone is mid-reach. Some restaurants provide serving chopsticks for moving food to your bowl. Wait for the host to start; never stand chopsticks upright in rice. Leaving something you do not care for is perfectly fine.",
      ar: "توضع الأطباق على قرص دوّار ويتشاركها الجميع؛ انظروا قبل تدويره لئلا يكون أحد ممتدّ اليد. وتوفّر بعض المطاعم عيدانًا مخصّصة لنقل الطعام إلى الوعاء. انتظروا المضيف ليبدأ؛ ولا تغرزوا العيدان عمودية في الأرز. وترك ما لا تستسيغونه في الطبق أمر طبيعي تمامًا.",
    },
  },
  {
    id: "photos-stares",
    title: { zh: "被拍照、被看", en: "Photos and stares", ar: "التصوير والنظرات" },
    body: {
      zh: "在不常见外国人的地方，有人盯着看、甚至举手机拍你，是好奇，不是敌意。不想被拍就摆摆手，对方通常会收起来。",
      en: "Where foreigners are rare, people may stare or even raise a phone to photograph you. It is curiosity, not hostility. A wave of the hand if you would rather not is usually enough.",
      ar: "حيث يندر الأجانب، قد يحدّق بكم بعضهم أو يرفعون الهاتف لتصويركم. إنه فضول لا عداء. وإشارة باليد إن لم تودّوا ذلك تكفي عادةً.",
    },
  },
  {
    id: "soft-no",
    title: { zh: "「再研究一下」常常是「不」", en: "“Let us look into it” often means no", ar: "«سندرس الأمر» تعني غالبًا «لا»" },
    body: {
      zh: "中国人不太当面说「不行」。「我们再研究一下」「回头再说」「有点困难」这类话，多数时候是委婉的拒绝。听到这些，别等回音，换个方案再谈。反过来，如果对方直接给日期、给人名，那才是真的定了。",
      en: "Chinese rarely say a flat no to your face. “We'll look into it”, “let's talk later”, “that is a little difficult” are, most of the time, polite refusals. When you hear them, do not wait for a follow-up; come back with a different proposal. Conversely, when someone gives you a date and a name, that is when a thing is really settled.",
      ar: "نادرًا ما يقول الصينيون «لا» صريحة في وجهكم. فعبارات «سندرس الأمر» و«نتحدث لاحقًا» و«الأمر صعب قليلًا» هي في الغالب رفض مهذّب. حين تسمعونها فلا تنتظروا ردًّا؛ عودوا باقتراح مختلف. وبالمقابل، حين يعطيكم أحدهم تاريخًا واسمًا فعندها يكون الأمر قد تقرّر فعلًا.",
    },
  },
  {
    id: "punctual",
    title: { zh: "时间就是那个时间", en: "The time means the time", ar: "الموعد هو الموعد" },
    body: {
      zh: "会议、接送、餐叙写几点就是几点，一般不会「弹性半小时」。提前五分钟到是常态；要迟到就先发消息说一声。",
      en: "Meetings, pick-ups and dinners start at the stated time; there is no customary half-hour grace. Arriving five minutes early is normal, and if you will be late, a message ahead is expected.",
      ar: "تبدأ الاجتماعات والمواعيد والعشاءات في الوقت المكتوب؛ ولا يوجد نصف ساعة سماح متعارف عليه. والوصول قبل الموعد بخمس دقائق أمر عادي، وإن كنتم ستتأخرون فيُتوقَّع منكم إرسال رسالة مسبقًا.",
    },
  },
];

/* ------------------------------------------------------------------ */
/* 自由行建议路线（研究已核实官方来源；未预订，时长为规划参考）        */'''
rep('''/* ------------------------------------------------------------------ */
/* 自由行建议路线（研究已核实官方来源；未预订，时长为规划参考）        */''', CULTURE, "插入 CULTURE_NOTES")

# ── 3. 路线：删黄埔古港，加四条现代化的 ───────────────────────────
start = s.find('export const ROUTES: Route[] = [')
hp = s.find('  {\n    id: "huangpu",', start)
xg = s.find('  {\n    id: "xiguan",', start)
if start < 0 or hp < 0 or xg < 0 or not (hp < xg):
    print("ROUTES 锚点未命中", start, hp, xg); sys.exit(1)

NEW_ROUTES = '''  {
    id: "huacheng",
    title: {
      zh: "花城广场 · 新中轴线（必去）",
      en: "Huacheng Square · the new central axis (do not miss)",
      ar: "ساحة هواتشنغ · المحور المركزي الجديد (لا تفوّتوها)",
    },
    duration: {
      zh: "傍晚到夜里，约 3 小时（规划参考）",
      en: "Late afternoon into night, about 3 hours (planning estimate)",
      ar: "من العصر إلى الليل، نحو 3 ساعات (تقدير تخطيطي)",
    },
    bestFor: {
      zh: "天黑前一小时到，看着城市亮起来。这是广州最想给你看的一面。",
      en: "Arrive an hour before dark and watch the city light up. This is the face Guangzhou most wants you to see.",
      ar: "اصلوا قبل الغروب بساعة وشاهدوا المدينة تُضاء. هذا هو الوجه الذي تريد قوانغتشو أن تروه.",
    },
    summary: {
      zh: "五十六公顷的市民广场，是广州最大的一片；两边是东塔（周大福金融中心，530 米，116 层）和西塔（国际金融中心，四百多米），正前方隔江就是 600 米的广州塔。广场上还有扎哈·哈迪德设计的广州大剧院 —— 她是伊拉克裔 —— 和广州图书馆、广东省博物馆。地下整片是花城汇商场，和各座塔楼地下相通。",
      en: "A fifty-six-hectare civic square, the largest in Guangzhou. On either side stand the East Tower (CTF Finance Centre, 530 m, 116 floors) and the West Tower (International Finance Centre, over four hundred metres); straight ahead across the river is the 600-metre Canton Tower. On the square itself are the Guangzhou Opera House by Zaha Hadid — Iraqi-born — the city library and the Guangdong Museum. Beneath it all runs the Huacheng Hui mall, linked underground to the towers.",
      ar: "ساحة مدنية مساحتها ستة وخمسون هكتارًا، هي الأكبر في قوانغتشو. على جانبيها يقوم البرج الشرقي (مركز CTF المالي، 530 مترًا، 116 طابقًا) والبرج الغربي (مركز المال الدولي، أكثر من أربعمئة متر)؛ وأمامكم مباشرة عبر النهر برج كانتون البالغ 600 متر. وفي الساحة نفسها دار أوبرا قوانغتشو من تصميم زها حديد — العراقية المولد — ومكتبة المدينة ومتحف قوانغدونغ. وتحت ذلك كله يمتدّ مركز هواتشنغ هوي التجاري المتصل بالأبراج تحت الأرض.",
    },
    steps: [
      {
        zh: "酒店 → 花城广场北端（广州图书馆 / 大剧院一侧）→ 沿中轴往南走到海心沙 → 江边看广州塔亮灯 → 返回酒店。",
        en: "Hotel → north end of Huacheng Square (library / opera house side) → walk south along the axis to Haixinsha → watch the Canton Tower light up from the riverbank → back to the hotel.",
        ar: "الفندق ← الطرف الشمالي لساحة هواتشنغ (جهة المكتبة ودار الأوبرا) ← المشي جنوبًا على المحور حتى هايشينشا ← مشاهدة إضاءة برج كانتون من ضفة النهر ← العودة إلى الفندق.",
      },
      {
        zh: "步行约一个半小时，其余留给拍照和地下商场。",
        en: "About an hour and a half on foot; the rest for photographs and the mall below.",
        ar: "نحو ساعة ونصف سيرًا، والباقي للتصوير والمركز التجاري تحت الأرض.",
      },
    ],
    transport: {
      zh: "从保利洲际打车过江即到；换住其他酒店后以实际地址导航为准。",
      en: "A short taxi ride across the river from the InterContinental; from any other hotel, go by the actual address in your navigation app.",
      ar: "رحلة أجرة قصيرة عبر النهر من الإنتركونتيننتال؛ ومن أي فندق آخر اعتمدوا على العنوان الفعلي في تطبيق الملاحة.",
    },
    tickets: {
      zh: "广场、海心沙江边免费。大剧院、图书馆、博物馆的开放时间未核实，以官方当日公告为准。",
      en: "The square and the Haixinsha riverbank are free. Opening hours of the opera house, library and museum are not verified — follow each venue's own notice for the day.",
      ar: "الساحة وضفة هايشينشا مجانيتان. مواعيد دار الأوبرا والمكتبة والمتحف غير مُتحقَّق منها — اتبعوا إعلان كل جهة ليومها.",
    },
    copy: [
      {
        id: "huacheng-addr",
        label: { zh: "给司机看：花城广场", en: "Show the driver: Huacheng Square", ar: "أظهرها للسائق: ساحة هواتشنغ" },
        chinese: "请带我去花城广场，广州市天河区珠江新城。",
      },
    ],
    sources: [
      {
        label: { zh: "广州市政府：广州最大市民广场花城广场", en: "Guangzhou government: Huacheng Square, the city's largest civic square", ar: "حكومة قوانغتشو: ساحة هواتشنغ أكبر ساحة مدنية" },
        url: "https://www.gz.gov.cn/zlgz/wlzx/content/post_2834707.html",
      },
      {
        label: { zh: "国资委：广州周大福金融中心（东塔）", en: "SASAC: Guangzhou CTF Finance Centre (East Tower)", ar: "لجنة إدارة أصول الدولة: مركز CTF المالي (البرج الشرقي)" },
        url: "http://www.sasac.gov.cn/n4470048/n8456886/n9678798/n9678803/n9734521/c9767336/content.html",
      },
    ],
  },
  {
    id: "canton-tower",
    title: {
      zh: "登广州塔",
      en: "Up the Canton Tower",
      ar: "الصعود إلى برج كانتون",
    },
    duration: {
      zh: "约 2 小时（规划参考，含排队）",
      en: "About 2 hours (planning estimate, including queues)",
      ar: "نحو ساعتين (تقدير تخطيطي يشمل الانتظار)",
    },
    bestFor: {
      zh: "想一次看清这座城有多大，就上去。傍晚上去能同时看到白天和夜景。",
      en: "If you want to grasp the size of this city in one look, go up. Late afternoon gives you daylight and the night view in one visit.",
      ar: "إن أردتم إدراك حجم هذه المدينة بنظرة واحدة فاصعدوا. والعصر يمنحكم مشهد النهار والليل في زيارة واحدة.",
    },
    summary: {
      zh: "六百米，世界第二高的塔，就在你们住的海珠区。塔身是细腰的双曲面钢网，晚上整座塔换色。观景层在四百多米，塔顶还有一圈高空摩天轮。",
      en: "Six hundred metres, the second-tallest tower in the world, in your own district of Haizhu. Its waisted hyperboloid steel mesh changes colour at night. The observation decks are above four hundred metres, and there is a ring of ferris-wheel cabins near the top.",
      ar: "ستمئة متر، ثاني أعلى برج في العالم، في منطقتكم هايتشو. هيكله الفولاذي الشبكي ذو الخصر النحيل يغيّر لونه ليلًا. ومنصّات المشاهدة فوق أربعمئة متر، وقرب القمة حلقة من مقصورات دولاب هواء.",
    },
    steps: [
      {
        zh: "酒店 → 广州塔 → 观景层 → 出来沿江走到对岸看回来的角度 → 返回。",
        en: "Hotel → Canton Tower → observation deck → afterwards, walk the riverbank for the view of the tower itself → back.",
        ar: "الفندق ← برج كانتون ← منصة المشاهدة ← ثم المشي على ضفة النهر لرؤية البرج نفسه ← العودة.",
      },
    ],
    transport: {
      zh: "和酒店同在海珠区，打车很近；也可以和花城广场排在同一个晚上，一江之隔。",
      en: "Same district as the hotel, a short taxi ride; it pairs naturally with Huacheng Square on the same evening, one river apart.",
      ar: "في منطقة الفندق نفسها، رحلة أجرة قصيرة؛ ويمكن جمعه مع ساحة هواتشنغ في المساء نفسه، فبينهما النهر فقط.",
    },
    tickets: {
      zh: "登塔收费，票价与各层开放时间未核实，以广州塔官方为准；旺季建议提前买票。",
      en: "Admission is charged; prices and opening hours for each level are not verified — go by the tower's official channels, and buy ahead in busy periods.",
      ar: "الدخول برسوم؛ والأسعار ومواعيد كل طابق غير مُتحقَّق منها — اعتمدوا على القنوات الرسمية للبرج، واشتروا التذاكر مسبقًا في المواسم المزدحمة.",
    },
    copy: [
      {
        id: "canton-tower-addr",
        label: { zh: "给司机看：广州塔", en: "Show the driver: Canton Tower", ar: "أظهرها للسائق: برج كانتون" },
        chinese: "请带我去广州塔，广州市海珠区阅江西路222号。",
      },
    ],
    sources: [
      {
        label: { zh: "海珠区政府：广州塔", en: "Haizhu District government: Canton Tower", ar: "حكومة منطقة هايتشو: برج كانتون" },
        url: "https://www.haizhu.gov.cn/zjhz/lyck/content/post_7765705.html",
      },
    ],
  },
  {
    id: "river-cruise",
    title: {
      zh: "珠江夜游",
      en: "Pearl River night cruise",
      ar: "جولة ليلية في نهر اللؤلؤ",
    },
    duration: {
      zh: "船程约 60 分钟，前后约 2 小时（规划参考）",
      en: "About 60 minutes on the water, around 2 hours door to door (planning estimate)",
      ar: "نحو 60 دقيقة على الماء، وقرابة ساعتين من الباب إلى الباب (تقدير تخطيطي)",
    },
    bestFor: {
      zh: "坐着不动，把广州塔、海心沙、珠江两岸的灯光一次看完。适合一天结束的时候。",
      en: "Sit still and take in the Canton Tower, Haixinsha and both lit banks in one pass. Good at the end of a day.",
      ar: "اجلسوا وشاهدوا برج كانتون وهايشينشا والضفتين المضاءتين في جولة واحدة. مناسب لختام اليوم.",
    },
    summary: {
      zh: "船从老城江边出发，往东开到广州塔、海心沙一带再回来。大沙头是最大的游船码头，天字码头是广州用得最久的码头，有两百七十多年。",
      en: "Boats leave from the old-city waterfront, run east past the Canton Tower and Haixinsha and return. Dashatou is the largest cruise pier; Tianzi Pier is the oldest still in use, some two hundred and seventy years.",
      ar: "تنطلق القوارب من واجهة المدينة القديمة، وتتجه شرقًا متجاوزة برج كانتون وهايشينشا ثم تعود. رصيف داشاتو أكبر أرصفة الجولات، ورصيف تيانزي أقدمها المستخدمة، وعمره نحو مئتين وسبعين عامًا.",
    },
    steps: [
      {
        zh: "酒店 → 大沙头码头或天字码头 → 上船约 60 分钟 → 返回酒店。",
        en: "Hotel → Dashatou or Tianzi Pier → about 60 minutes aboard → back to the hotel.",
        ar: "الفندق ← رصيف داشاتو أو تيانزي ← نحو 60 دقيقة على متن القارب ← العودة إلى الفندق.",
      },
    ],
    transport: {
      zh: "打车到码头。以实际地址导航为准。",
      en: "Taxi to the pier; go by the actual address in your navigation app.",
      ar: "سيارة أجرة إلى الرصيف؛ اعتمدوا على العنوان الفعلي في تطبيق الملاحة.",
    },
    tickets: {
      zh: "船票收费，班次与票价未核实，以码头当日公告为准。",
      en: "Tickets are charged; departures and prices are not verified — follow the pier's notice on the day.",
      ar: "التذاكر برسوم؛ والمواعيد والأسعار غير مُتحقَّق منها — اتبعوا إعلان الرصيف في اليوم نفسه.",
    },
    copy: [
      {
        id: "dashatou-addr",
        label: { zh: "给司机看：大沙头码头", en: "Show the driver: Dashatou Pier", ar: "أظهرها للسائق: رصيف داشاتو" },
        chinese: "请带我去大沙头游船码头，广州市越秀区沿江东路466号。",
      },
      {
        id: "tianzi-addr",
        label: { zh: "给司机看：天字码头", en: "Show the driver: Tianzi Pier", ar: "أظهرها للسائق: رصيف تيانزي" },
        chinese: "请带我去天字码头，广州市越秀区沿江中路200号。",
      },
    ],
    sources: [
      {
        label: { zh: "广州本地宝：珠江夜游码头", en: "Guangzhou Bendibao: Pearl River cruise piers", ar: "قوانغتشو بنديباو: أرصفة جولات نهر اللؤلؤ" },
        url: "http://gz.bendibao.com/tour/2024724/ly351887.shtml",
      },
    ],
  },
  {
    id: "tianhe",
    title: {
      zh: "天河路 · 太古汇（看这座城怎么买东西）",
      en: "Tianhe Road · Taikoo Hui (how this city shops)",
      ar: "شارع تيانخه · تايكو هوي (كيف تتسوّق هذه المدينة)",
    },
    duration: {
      zh: "半天，约 3–4 小时（规划参考）",
      en: "Half a day, about 3–4 hours (planning estimate)",
      ar: "نصف يوم، نحو 3–4 ساعات (تقدير تخطيطي)",
    },
    bestFor: {
      zh: "做零售的人一定要看：这是华南第一商圈。",
      en: "Anyone in retail has to see it: the number-one shopping district in South China.",
      ar: "على كل من يعمل في التجزئة أن يراه: منطقة التسوّق الأولى في جنوب الصين.",
    },
    summary: {
      zh: "两点八公里长的一条路，二百四十万平方米商业面积，一天一百五十万人，一年八亿人次、销售额过万亿元；2024 年全国商圈排名第三，高端品牌数量全国第一。太古汇、正佳广场、天河城、天环都在这一条路上，地下由地铁和通道连成一片。",
      en: "A road 2.8 kilometres long carrying 2.4 million square metres of retail, a million and a half people a day, eight hundred million a year and over a trillion yuan in sales; third among China's shopping districts in the 2024 ranking and first for high-end brands. Taikoo Hui, Grandview, Teemall and Parc Central all stand on it, joined underground by metro and walkways.",
      ar: "طريق طوله 2.8 كيلومتر يضمّ 2.4 مليون متر مربع من المساحات التجارية، ويستقبل مليونًا ونصف المليون شخص يوميًا وثمانمئة مليون سنويًا بمبيعات تتجاوز تريليون يوان؛ الثالث بين مناطق التسوّق في الصين في تصنيف 2024 والأول في العلامات الفاخرة. وعليه تقوم تايكو هوي وغراندفيو وتيمول وبارك سنترال، متصلة تحت الأرض بالمترو والممرات.",
    },
    steps: [
      {
        zh: "酒店 → 太古汇 → 沿天河路走到正佳广场、天河城 → 天环 → 返回。",
        en: "Hotel → Taikoo Hui → along Tianhe Road to Grandview and Teemall → Parc Central → back.",
        ar: "الفندق ← تايكو هوي ← على شارع تيانخه إلى غراندفيو وتيمول ← بارك سنترال ← العودة.",
      },
    ],
    transport: {
      zh: "打车到太古汇即可，几家商场之间步行或走地下通道。",
      en: "Taxi to Taikoo Hui; the malls are linked on foot and by underground walkways.",
      ar: "سيارة أجرة إلى تايكو هوي؛ والمراكز متصلة سيرًا وبالممرات تحت الأرض.",
    },
    tickets: {
      zh: "商场免费。营业时间未核实，以各商场公告为准。",
      en: "The malls are free to enter. Opening hours are not verified — go by each mall's own notice.",
      ar: "دخول المراكز مجاني. ومواعيد العمل غير مُتحقَّق منها — اعتمدوا على إعلان كل مركز.",
    },
    copy: [
      {
        id: "taikoo-addr",
        label: { zh: "给司机看：太古汇", en: "Show the driver: Taikoo Hui", ar: "أظهرها للسائق: تايكو هوي" },
        chinese: "请带我去太古汇，广州市天河区天河路383号。",
      },
    ],
    sources: [
      {
        label: { zh: "天河区政府：天河路商圈", en: "Tianhe District government: the Tianhe Road district", ar: "حكومة منطقة تيانخه: منطقة شارع تيانخه" },
        url: "http://www.thnet.gov.cn/zjth/tzth/zlpt/content/post_9126462.html",
      },
    ],
  },
'''
s = s[:hp] + NEW_ROUTES + s[xg:]

# 沙面留着，但标题里去掉「老城慢逛」的味道，突出沙面
rep('''      zh: "西关老城 · 骑楼与沙面",
      en: "Old Xiguan · arcades and Shamian",
      ar: "شيغوان القديمة · الأروقة وشاميان",''',
    '''      zh: "沙面 · 与西关骑楼",
      en: "Shamian · and the Xiguan arcades",
      ar: "شاميان · وأروقة شيغوان",''', "沙面标题")

if miss:
    print(f"未命中 {len(miss)} 处：")
    for n, c, a in miss: print(f"  ✗ [{c}] {n}\n     {a}")
    sys.exit(1)
P.write_text(s, encoding="utf-8")
print(f"OK：PREP 分人 + Reham 两条 + CULTURE_NOTES 11 条 + 路线换 4 条。{n0} → {len(s)} 字节")
print("路线 id：", re.findall(r'^\s{4}id: "([a-z-]+)",\n\s{4}title: \{\n\s{6}zh: "', s, re.M)[-6:])
