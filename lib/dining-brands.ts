// 特色餐饮品牌推荐：按口味分主题，不按商圈。
//
// 边界（写进 docs/GUEST_GUIDE.md，改这份数据前先读）：
//   1. 这里推荐的是**品牌**，不是某一家分店 —— 不写门店地址、电话、营业时间。
//      中文店名可以复制，到地图或点评应用里搜身边那一家。
//   2. 人均是用户给的参考金额（人民币），不声称是刚核过的现价；分店之间会有出入。
//   3. 菜名来自下面每条 source 那一页，只做简短转述，不抄长评、不编新招牌、
//      不承诺某家分店一定供应。
//   4. 不写「谁吃过」「几分」「最好吃」「保证正宗」，也不声称哪家是清真 ——
//      有清真要求，由客人到店自己确认（整节只提醒一次）。
//   5. 不推荐明显含猪肉或酒的菜。
//
// 文案在这里，排版在 components/trip/dining-brands.tsx。

import type { L10n } from "./trip-data";

export type DiningBrand = {
  id: string;
  /** 显示名：中文视图就是中文店名；英文、阿语给译名或音译。 */
  name: L10n;
  /** 中文检索名：复制这一串去搜附近门店。 */
  chinese: string;
  /** 人均参考，人民币。两个数表示一个区间。 */
  budget: number | [number, number];
  /** 一句话说清它是什么。 */
  note: L10n;
  /** 招牌与点单参考，一到两道。 */
  dishes: L10n;
  /** 这条的来源页。 */
  source: string;
};

export type DiningTheme = {
  id: string;
  title: L10n;
  /** 一句话帮人选：什么场合适合这一组。 */
  lead: L10n;
  brands: DiningBrand[];
};

/**
 * 怎么用、金额怎么看、饮食要求怎么问 —— 整节只说这一次，两句话说完。
 * 别再加「每家写了什么」这种解释：下面一眼就看得见。
 * halal 这一条同时收下了「过敏与忌口」：`FOOD_ADVICE` 里原来那句和它重复，
 * 指南页会把那一句滤掉，只留机上特殊餐（见 guide-tab.tsx）。
 */
export const DINING_INTRO: { how: L10n; halal: L10n } = {
  how: {
    zh: "复制中文品牌名，在高德或大众点评搜附近门店。人均为人民币参考，菜品与价格以门店为准。",
    en: "Copy the Chinese brand name to find a nearby branch in Amap or Dianping. Prices are per-person estimates in CNY; check the branch’s menu.",
    ar: "انسخوا اسم العلامة بالصينية للبحث عن فرع قريب في Amap أو Dianping. الأسعار تقديرية للفرد باليوان؛ راجعوا قائمة الفرع.",
  },
  halal: {
    zh: "需清真餐或有过敏、忌口，请向店员确认食材、汤底及烹调用酒。",
    en: "For halal, allergies or other dietary needs, check ingredients, broth and cooking alcohol with staff.",
    ar: "للطعام الحلال أو الحساسية أو القيود الغذائية، تأكدوا مع العاملين من المكوّنات والمرق والكحول المستخدم في الطهي.",
  },
};

export const DINING_THEMES: DiningTheme[] = [
  {
    id: "cantonese",
    title: {
      zh: "粤菜与早茶",
      en: "Cantonese and yum cha",
      ar: "المطبخ الكانتوني واليوم تشا",
    },
    lead: {
      zh: "先从本地这一桌开始。",
      en: "Start with the local table.",
      ar: "ابدؤوا من المائدة المحلية.",
    },
    brands: [
      {
        id: "dagefan",
        name: { zh: "大鸽饭", en: "Da Ge Fan", ar: "دا قه فان" },
        chinese: "大鸽饭",
        budget: 96,
        note: {
          zh: "想尝广州乳鸽，可以从红烧的酥香、盐焗的咸香选起。",
          en: "If you want to try Guangzhou squab, start with the crisp fried one or the salt-baked one.",
          ar: "إن أردتم تجربة حمام قوانغتشو، فابدؤوا بالمقلي المقرمش أو المخبوز بالملح.",
        },
        dishes: {
          zh: "红烧乳鸽、盐焗乳鸽",
          en: "Crispy fried squab; salt-baked squab",
          ar: "حمام مقلي مقرمش؛ حمام مخبوز بالملح",
        },
        source: "https://www.sohu.com/a/525299190_121124454",
      },
      {
        id: "xiaobingsheng",
        name: { zh: "小炳胜", en: "Xiao Bingsheng", ar: "شياو بينغ شنغ" },
        chinese: "小炳胜",
        budget: 78,
        note: {
          zh: "创意粤菜，咸口菜和奶香点心可以搭配着点。",
          en: "Inventive Cantonese cooking; pair a savoury dish with one of the milky pastries.",
          ar: "مطبخ كانتوني مبتكر؛ اجمعوا بين طبق مالح وحلوى بالحليب.",
        },
        dishes: {
          zh: "招积茄子、雪山奶露包",
          en: "Zhaoji aubergine; snow-top milk bun",
          ar: "باذنجان تشاوجي؛ خبز الحليب بقمة بيضاء",
        },
        source:
          "https://gs.ctrip.com/html5/you/foods/fooddetail/152/16995033.html",
      },
      {
        id: "taotaoju",
        name: { zh: "陶陶居酒家", en: "Tao Tao Ju", ar: "تاو تاو جيو" },
        chinese: "陶陶居酒家",
        budget: 101,
        note: {
          zh: "广州的老茶楼。早茶时段点心一笼一笼上桌，配一壶茶慢慢坐。",
          en: "An old Guangzhou teahouse. At yum cha the dim sum arrives basket by basket, with a pot of tea to linger over.",
          ar: "بيت شاي عريق في قوانغتشو. في وقت اليوم تشا تصل الديم سم سلّةً تلو الأخرى مع إبريق شاي للتمهّل.",
        },
        dishes: {
          zh: "大虾饺、现烤蛋挞",
          en: "Large prawn dumplings; freshly baked egg tarts",
          ar: "زلابية الروبيان الكبيرة؛ تارت البيض المخبوز طازجًا",
        },
        source: "https://you.ctrip.com/food/shenzhen26/22404263.html",
      },
      {
        id: "leigarden",
        name: { zh: "利苑酒家", en: "Lei Garden", ar: "لي غاردن" },
        chinese: "利苑酒家",
        budget: 230,
        note: {
          zh: "讲究火候与摆盘的粤菜，点心和甜品也做得细。",
          en: "Careful, refined Cantonese cooking; the dim sum and desserts get the same attention.",
          ar: "مطبخ كانتوني متقن العناية، وللديم سم والحلويات العناية نفسها.",
        },
        dishes: {
          zh: "原汁鲜虾饺、杨枝甘露",
          en: "Fresh prawn dumplings; mango-pomelo sago",
          ar: "زلابية الروبيان الطازج؛ حلوى المانجو والبوملي مع الساغو",
        },
        source: "https://gs.ctrip.com/html5/you/foods/fooddetail/152/444060.html",
      },
    ],
  },
  {
    id: "claypot",
    title: {
      zh: "啫啫煲",
      en: "Sizzling clay pots",
      ar: "القدور الفخارية",
    },
    lead: {
      zh: "砂煲上桌还在滋滋作响，趁热尝一口锅气。",
      en: "The clay pot is still sizzling when it lands — taste it while the heat is still in it.",
      ar: "يصل القدر الفخاري وهو يُصدر أزيزًا — تذوّقوه وهو ساخن.",
    },
    brands: [
      {
        id: "zheba",
        name: { zh: "啫八", en: "Zhe Ba", ar: "تشيه با" },
        chinese: "啫八",
        budget: 120,
        note: {
          zh: "高温砂煲留住肉香，热菜之后可以试试姜味雪糕。",
          en: "Fierce heat in the clay pot keeps the meat aromatic; after the hot dishes, try the ginger ice cream.",
          ar: "الحرارة العالية في القدر تحفظ نكهة اللحم؛ وبعد الأطباق الساخنة جرّبوا آيس كريم الزنجبيل.",
        },
        dishes: {
          zh: "生啫雪花牛、手工姜撞雪糕",
          en: "Sizzling marbled beef; handmade ginger-milk ice cream",
          ar: "لحم بقري مُعرَّق في القدر؛ آيس كريم الزنجبيل والحليب",
        },
        source: "https://www.sohu.com/a/239333595_669482",
      },
      {
        id: "huishijia",
        name: { zh: "惠食佳", en: "Hui Shi Jia", ar: "هوي شي جيا" },
        chinese: "惠食佳",
        budget: 179,
        note: {
          zh: "啫啫黄鳝与黄鳝丝饭，一煲一饭体验两种口感。",
          en: "A sizzling clay pot and a bowl of rice, both of freshwater eel: two textures in one meal.",
          ar: "قدر فخاري يُصدر أزيزًا وطبق أرز، كلاهما بأنقليس المياه العذبة: قوامان في وجبة واحدة.",
        },
        dishes: {
          zh: "啫啫黄鳝、黄鳝丝饭",
          en: "Sizzling freshwater eel clay pot; rice with shredded freshwater eel",
          ar: "أنقليس المياه العذبة في القدر الفخاري؛ أرز بشرائح أنقليس المياه العذبة",
        },
        source: "https://www.gzwxb.gov.cn/context/contextId/200732",
      },
    ],
  },
  {
    id: "sichuan",
    title: { zh: "川菜", en: "Sichuan", ar: "مطبخ سيتشوان" },
    lead: {
      zh: "想吃辣的那一天换个口味。",
      en: "For the day you want some heat.",
      ar: "لليوم الذي ترغبون فيه بشيء حار.",
    },
    brands: [
      {
        id: "tiancheng",
        name: {
          zh: "天成川小馆",
          en: "Tiancheng Sichuan Kitchen",
          ar: "تيان تشنغ للمطبخ السيتشواني",
        },
        chinese: "天成川小馆",
        budget: 96,
        note: {
          zh: "川菜的酸与辣，最后用一碗冰粉收尾。",
          en: "Sichuan sour-and-spicy, finished with a bowl of iced jelly.",
          ar: "نكهات سيتشوان الحامضة والحارة، وتُختتم بوعاء من الهلام المثلج.",
        },
        dishes: {
          zh: "招牌天成酸菜鱼、红糖雪燕冰粉",
          en: "House pickled-cabbage fish; brown-sugar iced jelly",
          ar: "سمك مع الملفوف المخلّل؛ هلام مثلج بالسكر البني",
        },
        source: "https://you.ctrip.com/food/guangzhou152/136446539.html",
      },
      {
        id: "song-sichuan",
        name: { zh: "宋·川菜", en: "Song Sichuan", ar: "سونغ للمطبخ السيتشواني" },
        chinese: "宋川菜",
        budget: 230,
        note: {
          zh: "把川菜的辣用在海鲜上。",
          en: "Sichuan heat applied to seafood.",
          ar: "حرارة سيتشوان مطبَّقة على المأكولات البحرية.",
        },
        dishes: {
          zh: "招牌沸腾老虎斑、秘制香辣蟹",
          en: "Tiger grouper in bubbling chilli oil; house spicy crab",
          ar: "هامور نمري في زيت الفلفل المغلي؛ سلطعون حار على طريقة المطعم",
        },
        source:
          "https://gs.ctrip.com/html5/you/foods/guangzhou152/17647563.html",
      },
    ],
  },
  {
    id: "hotpot",
    title: {
      zh: "火锅与海鲜",
      en: "Hotpot and seafood",
      ar: "القدر الساخن والمأكولات البحرية",
    },
    lead: {
      zh: "一桌人一起吃、边煮边聊的那种饭。",
      en: "The kind of meal a table cooks and talks its way through.",
      ar: "الوجبة التي تُطهى على المائدة ويدور حولها الحديث.",
    },
    brands: [
      {
        id: "chaofa",
        name: {
          zh: "潮发潮汕牛肉店",
          en: "Chaofa Chaoshan Beef",
          ar: "تشاو فا للحم البقر على طريقة تشاوشان",
        },
        chinese: "潮发潮汕牛肉店",
        budget: 89,
        note: {
          zh: "潮汕牛肉火锅按部位分盘，每盘涮多少秒不一样。",
          en: "Chaoshan beef hotpot: each cut comes on its own plate, each with its own dip time.",
          ar: "قدر اللحم على طريقة تشاوشان: كل قطعة في طبقها، ولكل منها زمن سلق خاص.",
        },
        dishes: {
          zh: "吊龙肉、鲜牛肉丸",
          en: "Diaolong loin cut; fresh beef balls",
          ar: "قطع «دياو لونغ» من الخاصرة؛ كرات لحم بقري طازجة",
        },
        source:
          "https://ugo-hk.com/restaurant/7809/%E6%BD%AE%E7%99%BC%E6%BD%AE%E6%B1%95%E7%89%9B%E8%82%89%E5%BA%97-%E4%B8%AD%E8%88%AA%E5%9F%8E%E5%90%9B%E5%B0%9A",
      },
      {
        id: "yelin",
        name: {
          zh: "椰林海鲜码头",
          en: "Yelin Seafood Wharf",
          ar: "رصيف يه لين للمأكولات البحرية",
        },
        chinese: "椰林海鲜码头",
        budget: 142,
        note: {
          zh: "鲜虾、鲍鱼等海鲜有多种做法；点单时先看计价单位。",
          en: "Prawns, abalone and other seafood come cooked several ways; check how each one is priced when you order.",
          ar: "الروبيان وأذن البحر وغيرها تُطهى بطرق عدة؛ وتحقّقوا من وحدة التسعير عند الطلب.",
        },
        dishes: {
          zh: "码头烧罗氏虾、百香果蒸鲍鱼",
          en: "Grilled river prawns; abalone steamed with passion fruit",
          ar: "روبيان نهري مشوي؛ أذن البحر على البخار مع الباشن فروت",
        },
        source: "https://you.ctrip.com/food/huadou143887/7197711-dianping.html",
      },
      {
        id: "yuechenji",
        name: {
          zh: "粤陈记·煲仔粥",
          en: "Yue Chenji Congee Pot",
          ar: "يوي تشن جي لقدر العصيدة",
        },
        chinese: "粤陈记煲仔粥",
        budget: 94,
        note: {
          zh: "粥底火锅：锅底是滚着的粥，涮完再喝那锅粥。",
          en: "Congee hotpot — the broth is rice congee, and you drink it at the end.",
          ar: "قدر ساخن بقاعدة العصيدة: المرق عصيدة أرز، وتُشرب في النهاية.",
        },
        dishes: {
          zh: "罗氏虾、手打虾滑",
          en: "River prawns; hand-beaten prawn paste",
          ar: "روبيان نهري؛ عجينة روبيان مخفوقة يدويًا",
        },
        source:
          "https://gs.ctrip.com/html5/you/foods/fooddetail/120098/63070978.html",
      },
    ],
  },
  {
    id: "asian",
    title: {
      zh: "亚洲其他口味",
      en: "Other Asian kitchens",
      ar: "مطابخ آسيوية أخرى",
    },
    lead: {
      zh: "想换一个国家的口味时看这一组。",
      en: "When you feel like another country's kitchen.",
      ar: "حين تودّون مطبخ بلد آخر.",
    },
    brands: [
      {
        id: "shishijiu",
        name: {
          zh: "狮拾久·现代新加坡料理",
          en: "Shi Shi Jiu, modern Singaporean",
          ar: "شي شي جيو، مطبخ سنغافوري حديث",
        },
        chinese: "狮拾久",
        budget: 210,
        note: {
          zh: "新加坡口味的咖喱与小点。",
          en: "Singapore-style curries and small plates.",
          ar: "كاري وأطباق صغيرة على الطريقة السنغافورية.",
        },
        dishes: {
          zh: "古法咖喱肉蟹、咖椰面包",
          en: "Curry crab; kaya toast",
          ar: "سلطعون بالكاري؛ خبز الكايا",
        },
        source:
          "https://global.hk01.com/%E6%97%85%E6%B8%B8/60325768/%E6%B7%B1%E5%9C%B3%E7%BE%8E%E9%A3%9F-%E6%9C%80%E7%BE%8E%E6%96%B0%E5%8A%A0%E5%9D%A1%E8%8F%9C-%E8%82%89%E9%AA%A8%E8%8C%B6%E6%B1%A4%E5%BA%95%E6%AF%8F%E6%97%A5%E7%8E%B0%E7%86%AC-%E5%92%96%E5%96%B1%E8%82%89%E8%9F%B9%E6%B5%93%E9%A6%99%E8%82%A5%E7%BE%8E",
      },
      {
        id: "antalya",
        name: {
          zh: "安塔利亚土耳其餐厅",
          en: "Antalya Turkish restaurant",
          ar: "مطعم أنطاليا التركي",
        },
        chinese: "安塔利亚土耳其餐厅",
        budget: 149,
        note: {
          zh: "土耳其烤肉配几样蘸酱和饼。",
          en: "Turkish grills with a few dips and bread.",
          ar: "مشاوٍ تركية مع بعض المقبّلات والخبز.",
        },
        dishes: {
          zh: "混合烧烤拼盘、鹰嘴豆酱",
          en: "Mixed grill platter; hummus",
          ar: "طبق مشاوٍ مشكّل؛ حمّص",
        },
        source: "https://you.ctrip.com/food/guangzhou152/18840931-dianping.html",
      },
      {
        id: "mangotree",
        name: { zh: "芒果树餐厅", en: "Mango Tree", ar: "مانجو تري" },
        chinese: "芒果树餐厅",
        budget: [116, 144],
        note: {
          zh: "泰餐的酸辣，配椰香甜品收尾。",
          en: "Thai sour-and-spicy dishes, finished with a coconut dessert.",
          ar: "أطباق تايلاندية حامضة وحارة، وتُختتم بحلوى بجوز الهند.",
        },
        dishes: {
          zh: "冬阴功、芒果彩虹糯米饭",
          en: "Tom yum; mango sticky rice",
          ar: "شوربة توم يام؛ أرز لزج بالمانجو",
        },
        source:
          "https://you.ctrip.com/food/guangzhou152/21723084-dianping182219136.html",
      },
      {
        id: "helanzheng",
        name: {
          zh: "何蘭正·PHO·越泰餐室",
          en: "He Lan Zheng PHO",
          ar: "هه لان تشنغ، فو فيتنامية",
        },
        chinese: "何蘭正",
        budget: 57,
        note: {
          zh: "越式汤粉和米纸卷，一个人吃也好点。",
          en: "Vietnamese pho and rice-paper rolls; easy to order for one.",
          ar: "فو فيتنامية ولفائف ورق الأرز؛ يسهل طلبها لشخص واحد.",
        },
        dishes: {
          zh: "特别牛肉粉、鲜虾纸米卷（鲜虾米纸卷）",
          en: "Special beef pho; fresh prawn rice-paper rolls",
          ar: "فو لحم البقر الخاصة؛ لفائف ورق الأرز بالروبيان الطازج",
        },
        source: "https://m.dianping.com/shop/1524623256",
      },
      {
        id: "datouxia",
        name: {
          zh: "大头虾越式风味餐厅",
          en: "Da Tou Xia, Vietnamese",
          ar: "دا تو شيا، نكهات فيتنامية",
        },
        chinese: "大头虾越式风味餐厅",
        budget: 99,
        note: {
          zh: "越南风味的咖喱，甜品是椰香那一路。",
          en: "Vietnamese-style curry, with coconut on the dessert side.",
          ar: "كاري على الطريقة الفيتنامية، وحلويات بجوز الهند.",
        },
        dishes: {
          zh: "越式咖喱牛腩、椰香糯米芒果饭",
          en: "Vietnamese beef brisket curry; coconut sticky rice with mango",
          ar: "كاري صدر البقر الفيتنامي؛ أرز لزج بجوز الهند والمانجو",
        },
        source: "https://xinjiapo.news/news/124933",
      },
      {
        id: "moda",
        name: { zh: "摩打食堂", en: "Moda Canteen", ar: "مو دا" },
        chinese: "摩打食堂",
        budget: 106,
        note: {
          zh: "做法偏创意的日式小馆。",
          en: "A Japanese kitchen with an inventive streak.",
          ar: "مطبخ ياباني بلمسة ابتكارية.",
        },
        dishes: {
          zh: "明太子烤土豆、火牛寿司",
          en: "Baked potato with spicy pollock roe; seared beef sushi",
          ar: "بطاطا مشوية مع بيض سمك البولّاك المتبّل؛ سوشي لحم بقري مُلهَب",
        },
        source:
          "https://gs.ctrip.com/html5/you/foods/fooddetail/152/22398264.html",
      },
      {
        id: "mapo",
        name: {
          zh: "麻蒲碳烤肉",
          en: "Mapo charcoal barbecue",
          ar: "مابو للشواء على الفحم",
        },
        chinese: "麻蒲碳烤肉",
        budget: 92,
        note: {
          zh: "韩式炭火烤肉，在桌上现烤。",
          en: "Korean charcoal barbecue, grilled at your table.",
          ar: "شواء كوري على الفحم يُطهى على طاولتكم.",
        },
        dishes: {
          zh: "牛肋条、冷面",
          en: "Beef short-rib strips; cold noodles",
          ar: "شرائح ضلع البقر؛ نودلز باردة",
        },
        source: "https://www.cnpp100.com/shop/15904.html",
      },
      {
        id: "sushiro",
        name: { zh: "寿司郎", en: "Sushiro", ar: "سوشيرو" },
        chinese: "寿司郎",
        budget: 95,
        note: {
          zh: "回转寿司按碟计价，适合少量多样地尝。",
          en: "Conveyor-belt sushi priced by the plate — good for trying a little of a lot.",
          ar: "سوشي الحزام الدوّار بسعر لكل طبق — مناسب لتذوّق القليل من كثير.",
        },
        dishes: {
          zh: "三文鱼寿司、虾三味",
          en: "Salmon sushi; a trio of prawn",
          ar: "سوشي السلمون؛ ثلاثية الروبيان",
        },
        source: "https://you.ctrip.com/food/guangzhou152/133902013.html",
      },
    ],
  },
  {
    id: "tea",
    title: { zh: "茶饮", en: "Tea and drinks", ar: "الشاي والمشروبات" },
    lead: {
      zh: "逛累了停下来喝一杯。",
      en: "Somewhere to stop for a drink mid-walk.",
      ar: "محطة لمشروب في منتصف التجوّل.",
    },
    brands: [
      {
        id: "ama",
        name: { zh: "阿嬷手作", en: "A-Ma handmade tea", ar: "آه ما للشاي اليدوي" },
        chinese: "阿嬷手作",
        budget: 26,
        note: {
          zh: "米麻薯的软糯与椰乳的香甜，喝茶也像吃一份甜品。",
          en: "Chewy rice mochi and sweet coconut milk — these tea drinks eat like dessert.",
          ar: "موتشي الأرز اللزج وحلاوة حليب جوز الهند — مشروبات تُشبه الحلوى.",
        },
        dishes: {
          zh: "米麻薯奶茶、老椰清补凉",
          en: "Rice-mochi milk tea; coconut dessert drink with mixed toppings",
          ar: "شاي بالحليب مع موتشي الأرز؛ مشروب حلو بجوز الهند وإضافات متنوعة",
        },
        source:
          "https://you.ctrip.com/food/ctripyouyoustar26/132940197-dianping.html",
      },
      {
        id: "heytea",
        name: { zh: "喜茶", en: "HEYTEA", ar: "هي تي" },
        chinese: "喜茶",
        budget: 27,
        note: {
          zh: "以鲜果入茶的茶饮店。",
          en: "A tea shop that blends fresh fruit into tea.",
          ar: "محل شاي يمزج الفاكهة الطازجة بالشاي.",
        },
        dishes: {
          zh: "多肉葡萄",
          en: "Grape tea with fruit pulp",
          ar: "شاي العنب مع لبّ الفاكهة",
        },
        source: "https://m.drinknewspaper.com/news/318.html",
      },
    ],
  },
];

/** 21 个品牌。检查器按这个数对，别让同一个品牌的两家分店又变成两条。 */
export const DINING_BRANDS: DiningBrand[] = DINING_THEMES.flatMap(
  (theme) => theme.brands,
);
