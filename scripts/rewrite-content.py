#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""把「说明书口吻」改成「让人想去」的写法。

三件事：
1. 新增 CITY_STORY —— 广州和阿拉伯世界的关系。这是四位埃及客人最该先知道的一段，
   原来完全没写。
2. 清真寺的介绍从「占地多少、容纳多少人」改成先讲故事。
3. 吃的每一条都在重复「不等于清真」——同一句警告出现三遍。那句话在 FOOD_ADVICE
   里已经统一说过一次了，这里只讲值不值得吃、为什么好吃。
"""
import pathlib
import sys

P = pathlib.Path("lib/trip-data.ts")
s = P.read_text(encoding="utf-8")
n0 = len(s)
done, miss = [], []


def rep(a, b, note):
    global s
    c = s.count(a)
    if c != 1:
        miss.append((note, c, a[:70]))
        return
    s = s.replace(a, b)
    done.append(note)


# ── 1. 新增：这座城与阿拉伯世界 ────────────────────────────────
CITY_STORY = '''
/* ------------------------------------------------------------------ */
/* 这座城与阿拉伯世界                                                   */
/*                                                                     */
/* 四位埃及客人来广州，不只是来一座陌生的中国城市 —— 光塔路那一带      */
/* 一千三百年前就是阿拉伯商人的街区。这段该写在指南最前面。             */
/* 数字都出自政府门户：627 年、36 米、开元年间每年八十多万人次。         */
/* 宛葛素的身份按传统说法写，并注明史家有争议 —— 不拿宗教史当定论。      */
/* ------------------------------------------------------------------ */

export const CITY_STORY: { lead: L10n; paragraphs: L10n[]; sources: { label: L10n; url: string }[] } = {
  lead: {
    zh: "你们要去的地方，一千三百年前就有人从你们来的方向到过。",
    en: "People came to this city from your direction thirteen hundred years ago.",
    ar: "وصل إلى هذه المدينة أناسٌ من جهتكم قبل ألفٍ وثلاثمائة عام.",
  },
  paragraphs: [
    {
      zh: "唐贞观元年，公元 627 年，一位叫艾比·宛葛素的传教士到了广州。他和当时侨居在这里的阿拉伯商人一起出钱，建起了怀圣寺，以及寺旁那座三十六米高的光塔 —— 一座阿拉伯样式的砖塔。它到今天还立着，比广州城里几乎所有东西都老。",
      en: "In 627 AD a missionary named Abi Waqqas arrived in Guangzhou. Together with the Arab merchants already living here he paid for the building of Huaisheng Mosque and the thirty-six-metre light tower beside it — a brick minaret in Arab style. It is still standing, older than almost anything else in the city.",
      ar: "في عام 627 للميلاد وصل إلى قوانغتشو داعيةٌ يُدعى أبي وقاص. فتبرّع مع التجار العرب المقيمين هنا ببناء مسجد هوايشنغ والمنارة المجاورة له التي يبلغ ارتفاعها ستة وثلاثين مترًا — منارةٌ من الآجر على الطراز العربي. وهي قائمة إلى اليوم، أقدم من كل شيء تقريبًا في هذه المدينة.",
    },
    {
      zh: "那时的广州是海上丝绸之路的东方起点。官府在城西划出一片「蕃坊」给外商居住，相当于一条反过来的唐人街。开元年间，每年进出广州港的外国商人有八十多万人次，其中大多数是阿拉伯人。他们在这里做买卖、成家、盖清真寺、也把先人葬在这里。",
      en: "Guangzhou was then the eastern end of the Maritime Silk Road. The authorities set aside a quarter in the west of the city, the fanfang, for foreign traders — a Chinatown in reverse. In the Kaiyuan era the port saw more than eight hundred thousand foreign merchant arrivals a year, most of them Arab. They traded here, raised families, built mosques, and buried their dead here.",
      ar: "كانت قوانغتشو حينها الطرف الشرقي لطريق الحرير البحري. وخصّصت السلطات في غرب المدينة حيًّا للتجار الأجانب يُسمّى «فان فانغ» — حيٌّ صيني بالمقلوب. وفي عهد كاي يوان كان الميناء يستقبل أكثر من ثمانمائة ألف زيارة لتجار أجانب سنويًا، معظمهم من العرب. تاجروا هنا، وكوّنوا أسرًا، وبنوا المساجد، ودفنوا موتاهم في هذه الأرض.",
    },
    {
      zh: "中国的传统说法认为，宛葛素就是先知的门弟子赛尔德·本·艾比·宛葛素，是他把伊斯兰带到了中国。史家对这个身份一直有争议，但这个说法本身已经流传了很多个世纪 —— 他的墓，就是你们可以去的先贤古墓。",
      en: "Chinese tradition holds that this Abi Waqqas was Sa'd ibn Abi Waqqas, a companion of the Prophet, and that he brought Islam to China. Historians have long questioned the identification, but the tradition itself is many centuries old — and his tomb is the Xianxian Ancient Tomb you can visit.",
      ar: "يذهب التراث الصيني إلى أن أبا وقاص هذا هو سعد بن أبي وقاص، صحابي النبي، وأنه هو من حمل الإسلام إلى الصين. وقد شكّك المؤرخون طويلًا في صحة هذه النسبة، غير أن الرواية نفسها عمرها قرون — وقبره هو مقبرة شيان شيان التي يمكنكم زيارتها.",
    },
  ],
  sources: [
    {
      label: {
        zh: "广州市人民政府：重走海上丝绸之路",
        en: "Guangzhou municipal government: retracing the Maritime Silk Road",
        ar: "حكومة بلدية قوانغتشو: على خطى طريق الحرير البحري",
      },
      url: "https://www.gz.gov.cn/zlgz/gzly/lyxl/content/post_7730147.html",
    },
    {
      label: {
        zh: "广州市人民政府：海上丝绸之路的起点",
        en: "Guangzhou municipal government: the start of the Maritime Silk Road",
        ar: "حكومة بلدية قوانغتشو: نقطة انطلاق طريق الحرير البحري",
      },
      url: "https://www.gz.gov.cn/zlgz/whgz/content/post_8231821.html",
    },
  ],
};

export const MOSQUES: PlaceCard[] = ['''

rep("export const MOSQUES: PlaceCard[] = [", CITY_STORY, "新增 CITY_STORY")


# ── 2. 清真寺：先讲故事，别先报面积 ──────────────────────────────
rep(
    '''      zh: "唐代来华传教的先贤宛葛素长眠于此，在兰圃公园西侧。2010 年建成的礼拜大殿能容纳近 2500 人，是广东省最大的清真寺，每周五来做主麻的穆斯林约 9000 人。",
      en: "Burial place of Abi Waqqas, who brought Islam to China in the Tang dynasty, just west of Lanpu Park. The prayer hall built in 2010 holds nearly 2,500 people — the largest mosque in Guangdong — and about 9,000 Muslims come for Friday prayer.",
      ar: "هنا يرقد أبو وقاص الذي حمل الإسلام إلى الصين في عهد أسرة تانغ، غربَ حديقة لانبو. تتّسع قاعة الصلاة المبنية عام 2010 لنحو 2500 مصلٍّ، وهي أكبر مسجد في قوانغدونغ، ويحضر صلاة الجمعة نحو 9000 مسلم.",''',
    '''      zh: "宛葛素就葬在这里，兰圃公园西边。把伊斯兰带到中国的那个人 —— 至少传统上是这么说的 —— 长眠在广州城北，已经一千多年。旁边 2010 年建的礼拜大殿能容下近 2500 人，是广东最大的；周五主麻来的人，大约九千。",
      en: "This is where Abi Waqqas lies, just west of Lanpu Park — the man who, by tradition at least, brought Islam to China, resting in the north of Guangzhou for more than a thousand years. The prayer hall built beside the tomb in 2010 holds nearly 2,500 people, the largest in Guangdong; about nine thousand come for Friday prayer.",
      ar: "هنا يرقد أبو وقاص، غربَ حديقة لانبو — الرجل الذي حمل الإسلام إلى الصين، وفق التراث على الأقل، راقدًا في شمال قوانغتشو منذ أكثر من ألف عام. وقاعة الصلاة التي بُنيت إلى جوار القبر عام 2010 تتّسع لنحو 2500 مصلٍّ، وهي الأكبر في قوانغدونغ؛ ويحضر صلاة الجمعة نحو تسعة آلاف.",''',
    "先贤古墓：改成先讲人",
)

rep(
    '''      zh: "始建于唐代，是中国现存最早的清真寺之一；寺里那座光塔立了一千多年，是广州老城的地标。就在老城中心，和光塔路一带的清真馆子挨着。",
      en: "Founded in the Tang dynasty and among the oldest surviving mosques in China. Its light tower has stood for over a thousand years and is a landmark of the old city — right beside the halal eateries around Guangta Road.",
      ar: "أُسّس في عهد أسرة تانغ وهو من أقدم المساجد الباقية في الصين، ومنارته قائمة منذ أكثر من ألف عام وتُعدّ معلمًا للمدينة القديمة — إلى جوار مطاعم الحلال في شارع قوانغتا.",''',
    '''      zh: "627 年，阿拉伯商人出钱建的，中国现存最早的清真寺之一。那座三十六米的光塔是阿拉伯样式，在这条街上站了快一千四百年，整座广州城比它老的东西几乎没有。寺门口就是光塔路，清真馆子都在这一带。",
      en: "Built in 627 with money from Arab merchants, one of the oldest surviving mosques in China. The thirty-six-metre light tower is Arab in form and has stood on this street for nearly fourteen hundred years — almost nothing in Guangzhou is older. Step out of the gate and you are on Guangta Road, where the halal restaurants are.",
      ar: "بُني عام 627 بأموال التجار العرب، وهو من أقدم المساجد الباقية في الصين. ومنارته البالغ ارتفاعها ستة وثلاثين مترًا عربية الطراز، قائمة في هذا الشارع منذ نحو أربعمائة وألف عام — ولا يكاد يوجد في قوانغتشو ما هو أقدم منها. وما إن تخرج من بابه حتى تكون في شارع قوانغتا حيث مطاعم الحلال.",''',
    "怀圣寺：改成先讲 627 年",
)

rep(
    '''      zh: "明朝成化年间所建，五百多年历史，广州市文物保护单位。藏在老城濠畔街的市井当中，比前两处安静。",
      en: "Built in the Chenghua reign of the Ming dynasty, over 500 years old, and a municipal heritage site. Tucked into the everyday streets of Haopan Street — quieter than the other two.",
      ar: "بُني في عهد تشنغهوا من أسرة مينغ قبل أكثر من 500 عام، وهو موقع تراثي بلدي. يقع بين أزقة شارع هاوبان اليومية، وهو أهدأ من المسجدين الآخرين.",''',
    '''      zh: "明朝建的，五百多年。它藏在濠畔街的日常巷子里，没有游客，来礼拜的多是住在附近的人。想安安静静待一会儿，来这座。",
      en: "Ming dynasty, more than five hundred years old. It sits in the ordinary lanes of Haopan Street with no tourists; most of those who pray here live nearby. Come to this one when you want somewhere quiet.",
      ar: "من عهد أسرة مينغ، وعمره أكثر من خمسمائة عام. يقع في أزقة شارع هاوبان العادية بلا سيّاح، ومعظم من يصلّون فيه من سكان الحي. تعالَ إلى هذا المسجد إن أردت مكانًا هادئًا.",''',
    "濠畔清真寺：改成先讲氛围",
)


# ── 3. 吃的：讲好吃，不再每条都重复警告 ──────────────────────────
rep(
    '''      zh: "茶、点心加聊天，是广州的生活方式，可以留 60–90 分钟慢慢吃。先问茶位费和份量再点。",
      en: "Tea, small dishes and conversation — a Guangzhou way of life. Allow 60–90 minutes. Ask about the tea charge and portion sizes before ordering.",
      ar: "شاي وأطباق صغيرة وحديث — أسلوب حياة في قوانغتشو. خصّص 60–90 دقيقة، واسأل عن رسم الشاي وأحجام الأطباق قبل الطلب.",''',
    '''      zh: "一壶茶，几笼点心，坐一个上午。广州人管这叫「叹早茶」，叹就是慢慢享受的意思 —— 这是一件不该赶的事。点心一笼一笼点，吃完再加，留足 60 到 90 分钟。",
      en: "A pot of tea, a few steamer baskets, a whole morning at the table. Cantonese call it taan jou cha — taan meaning to savour slowly. It is not a thing to rush: order a basket at a time and add more as you go. Allow 60 to 90 minutes.",
      ar: "إبريق شاي، وبضع سلال بخار، وصباح كامل حول الطاولة. يسمّيها أهل كانتون «تان جاو تشا»، و«تان» أن تتمهّل وتتلذّذ — فهي ليست مما يُستعجل. اطلب سلة تلو الأخرى وزد كلما أردت، وخصّص لها من 60 إلى 90 دقيقة.",''',
    "早茶：叹早茶",
)

rep(
    '''      zh: "薄薄的米浆蒸皮包着馅料，「肠」不是肠子。常见猪肉、牛肉、鸡蛋、虾等；粥、点心也可能用猪肉、猪油或海鲜，馅料和酱料都要问清楚，名字不等于清真。",
      en: "A thin steamed rice sheet wrapped around a filling — the name does not mean intestines. Fillings are often pork, beef, egg or shrimp; congee and dim sum may also use pork, lard or seafood. Ask about fillings and sauces; a dish name is never a halal guarantee.",
      ar: "طبقة أرز مبخّرة رقيقة تلفّ الحشوة — والاسم لا يعني الأمعاء. الحشوات غالبًا لحم خنزير أو بقر أو بيض أو روبيان، وقد تستخدم العصيدة والديم سم لحم الخنزير أو شحمه أو المأكولات البحرية. اسأل عن الحشوة والصلصة؛ فاسم الطبق ليس ضمانًا للحلال.",''',
    '''      zh: "米浆在蒸屉上摊成极薄的一张皮，卷上馅，淋一勺豉油。刚出锅的时候滑得几乎不用嚼。名字里那个「肠」说的是它卷起来的样子，不是肠子 —— 很多人第一次听都会愣一下。",
      en: "Rice batter is spread into a paper-thin sheet on the steamer, rolled around a filling and finished with a spoonful of soy. Straight out of the steamer it is so slippery you hardly chew. The chang in its name describes the roll, not intestines — the question comes up every time.",
      ar: "يُفرَد خليط الأرز طبقةً رقيقة كالورق فوق البخار، ثم يُلفّ حول الحشوة ويُسقى بملعقة صويا. وحين يخرج من البخار يكون من النعومة بحيث تكاد لا تمضغه. و«تشانغ» في اسمه تصف اللفّة لا الأمعاء — وهو سؤال يتكرر دائمًا.",''',
    "肠粉：讲口感",
)

rep(
    '''      zh: "和珠江上的水上人家有关，是讲广州故事的好例子。但名字里有「鱼 / 艇」不代表不含猪肉或就是清真，仍要问原料和做法。",
      en: "Linked to the boat-dwelling families of the Pearl River — a good story about Guangzhou. But a name mentioning fish or boats does not mean it is pork-free or halal; still ask about ingredients and preparation.",
      ar: "مرتبطة بأهل القوارب في نهر اللؤلؤ، وهي حكاية جميلة عن قوانغتشو. لكن ذكر السمك أو القوارب في الاسم لا يعني خلوّها من لحم الخنزير ولا أنها حلال؛ اسأل دائمًا عن المكوّنات وطريقة الإعداد.",''',
    '''      zh: "从前珠江上住着一整群以船为家的人。他们撑着小艇在江面上卖粥，煮好了从船舷递到岸上或者另一条船上，所以叫艇仔粥。现在都在岸上的店里吃了，名字留了下来。",
      en: "The Pearl River once held a whole population who lived on their boats. They cooked congee on the water and passed the bowls up from sampan to shore — hence sampan congee. It is eaten in shops on dry land now, but the name stayed.",
      ar: "كان في نهر اللؤلؤ يومًا جماعةٌ كاملة تسكن قواربها. كانوا يطبخون العصيدة على الماء ويمدّون الأوعية من القارب إلى الضفة — ومن هنا جاء اسمها «عصيدة القوارب». تُؤكل اليوم في محال على البرّ، لكن الاسم بقي.",''',
    "艇仔粥：讲来历",
)

rep(
    '''      zh: "可以试姜撞奶、双皮奶、绿豆沙、马蹄糕。各店配料不同，奶、蛋、坚果或其他添加物仍要核对。这里只作介绍，不推荐具体店，也不承诺清真。",
      en: "Try ginger milk curd, double-skin milk, mung bean sweet soup or water chestnut cake. Recipes differ by shop, so check for milk, egg, nuts or other additions. This is background only — no specific shop is recommended and no halal claim is made.",
      ar: "جرّب حليب الزنجبيل المخثّر وحليب الطبقتين وحساء الفاصولياء الخضراء وكعكة كستناء الماء. تختلف الوصفات بين المحال، فتحقق من الحليب والبيض والمكسرات وغيرها. هذا تعريف فقط دون ترشيح محل بعينه ودون أي ادعاء بالحلال.",''',
    '''      zh: "姜撞奶值得专门去试一次：滚烫的牛奶冲进一碗姜汁，不搅不动，几分钟后整碗自己凝住，用勺子舀是一块一块的。还有双皮奶、绿豆沙、马蹄糕。广州人把这些统称「糖水」，多半是晚饭以后才去吃的事。",
      en: "Ginger milk curd is worth a trip on its own: scalding milk is poured onto a bowl of ginger juice, left alone, and a few minutes later the whole bowl has set firm enough to lift with a spoon. There is also double-skin milk, mung bean soup and water chestnut cake. Cantonese call all of it tong sui, sugar water, and it is mostly an after-dinner errand.",
      ar: "حليب الزنجبيل المخثّر وحده يستحق رحلة: يُصبّ الحليب المغلي على وعاء من عصير الزنجبيل ويُترك دون تحريك، فإذا به بعد دقائق قد تماسك حتى تستطيع رفعه بالملعقة. وهناك أيضًا حليب الطبقتين وحساء الفاصولياء الخضراء وكعكة كستناء الماء. ويسمّي أهل كانتون ذلك كله «تونغ سوي»، أي ماء السكر، وهو غالبًا مشوارُ ما بعد العشاء.",''',
    "甜品：讲姜撞奶",
)

rep(
    '''      zh: "骑楼是沿街建筑下面那条有顶的走廊，遮阳挡雨，恩宁路一带可以看到。粤剧和手工艺是当地文化的一部分，但不保证当天一定有演出或作坊开放。",
      en: "A qilou is the covered walkway under the street-front buildings, shading you from sun and rain; Enning Road is a good place to see them. Cantonese opera and crafts are part of local life, but no performance or open workshop is guaranteed on any given day.",
      ar: "«تشي لو» ممر مسقوف أسفل المباني المطلّة على الشارع، يقي من الشمس والمطر، وشارع إن نينغ مكان جيد لمشاهدته. وأوبرا كانتون والحِرف جزء من الحياة المحلية، لكن لا ضمان لوجود عرض أو ورشة مفتوحة في يوم بعينه.",''',
    '''      zh: "老城临街的房子把二楼往外挑出去，底下就空出一条有顶的走廊，一家接一家连成几百米 —— 这就是骑楼。广州又晒又多雨，走在骑楼底下可以一路不打伞。恩宁路一带成片，是看骑楼最好的地方。",
      en: "In the old city the upper floors are pushed out over the pavement, leaving a covered walkway underneath that runs from shopfront to shopfront for hundreds of metres — that is a qilou arcade. Guangzhou is hot and wet, and under the arcades you can walk for blocks without an umbrella. Enning Road has the best stretch of them.",
      ar: "في المدينة القديمة تبرز الطوابق العليا فوق الرصيف فيتشكّل تحتها ممرٌّ مسقوف يمتدّ من متجر إلى متجر مئات الأمتار — هذا هو رواق «تشي لو». وقوانغتشو حارّة ممطرة، وتحت هذه الأروقة تمشي أحياءً كاملة دون مظلّة. وأجمل امتدادٍ لها في شارع إن نينغ.",''',
    "骑楼：讲为什么有骑楼",
)

if miss:
    print(f"未命中 {len(miss)} 处：")
    for note, c, a in miss:
        print(f"  ✗ [{c}] {note}\n       {a}")
    sys.exit(1)

P.write_text(s, encoding="utf-8")
print(f"命中 {len(done)} 处：")
for note in done:
    print(f"  ✓ {note}")
print(f"{n0} → {len(s)} 字节")
