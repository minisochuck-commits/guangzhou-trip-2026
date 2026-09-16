"use client";
/* eslint-disable @next/next/no-img-element -- 静态站、离线可用、相对路径：故意用原生 <img>，不走 next/image 的加载器 */

import * as React from "react";
import { EVENT_CONTACTS, MEETING_RULES, PRODUCT_PREVIEW } from "@/lib/meeting-guide";

import {
  CITY_SCALE,
  CITY_STORY,
  CITY_TECH,
  COPY_ADDRESSES,
  INTERCONTINENTAL,
  CULTURE_NOTES,
  FOOD_CULTURE,
  FOOD_NOTES,
  HALAL_DINING,
  HALAL_INTRO,
  HALAL_WHERE,
  JUMUAH_NOTE,
  MINISO_IN_GZ,
  MOSQUES,
  OFFICIAL_LINKS,
  PAZHOU,
  PHRASES,
  PREP,
  RETAIL_STUDY,
  ROUTES,
  type L10n,
  type Lang,
  type MallCard,
  type PersonId,
  type PlaceCard,
} from "@/lib/trip-data";
import {
  IMG,
  PHOTO_CREDITS,
  photoAlt,
  photoCaption,
  photoSize,
} from "@/lib/photos";
import { UI, t } from "@/lib/trip-i18n";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { DINING_BRANDS, DINING_THEMES } from "@/lib/dining-brands";
import { DiningBrands } from "./dining-brands";
import { DistrictRoute } from "./district-route";
import { BaggageLines } from "./flight-details";
import { RouteList } from "./routes";
import { BulletList, CopyChinese, Figure, GUIDE, SourceLink } from "./ui";

/** 顶上那张「住哪里、打给谁」用的文案。整份指南只在这里写一次酒店。 */
const HOTEL_LABELS = {
  eyebrow: {
    zh: "住宿与联系",
    en: "Where you stay",
    ar: "مكان الإقامة",
  },
  address: {
    zh: "酒店地址（给司机看）",
    en: "Hotel address (show the driver)",
    ar: "عنوان الفندق (اعرضيه على السائق)",
  },
  reception: {
    zh: "酒店前台",
    en: "Hotel reception",
    ar: "استقبال الفندق",
  },
  transfer: {
    zh: "Reham 的广州机场接送：公司安排，联系 Rahma 确认车辆与出发时间。",
    en: "Reham’s Guangzhou airport transfers are arranged by the company. Confirm the vehicle and departure time with Rahma.",
    ar: "ترتّب الشركة انتقالات Reham من مطار قوانغتشو وإليه. أكّدي السيارة ووقت الانطلاق مع Rahma.",
  },
} satisfies Record<string, L10n>;

const HOTEL_PHONE = "+86 20 8922 8888";

/**
 * 三章的主图：海珠江岸的赤岗塔与广州塔、怀圣寺的光塔、开业当天的正佳门口。
 * 照片的 alt 与图说跟着照片走（lib/guide-photos.ts 与 lib/selected-photos.ts），
 * 这里只说哪一章配哪一张。
 *
 * 琶洲那一章的主图换成了用户自己提供的那张（2026-09-13）：画面里前面是赤岗塔、
 * 后面是广州塔，**不是琶洲塔**。正文里讲琶洲塔的那一段因此单独交代了照片拍的是谁，
 * 免得读者把两座塔看成一座。原来那张 `pazhou-pagoda` 的航拍留在仓里，页面不再用。
 */
const CHAPTER_PHOTOS = {
  pazhou: "chigang-canton-tower",
  story: "huaisheng-minaret",
  /** 名创优品那一章两张：章首是琶洲西区那栋新楼，中间是正佳门口开业那天。 */
  miniso: "miniso-tower",
  minisoStore: "miniso-land",
};

/** 开篇那张全景，商圈末尾那张北京路，文化章开头那张骑楼 —— 数据里没有，写在这里。 */
const INLINE_IMAGE_KEYS = ["skyline", "beijinglu", "arcade"];

/** 上面这几张的三语说明。照片里看得见什么就写什么，不留空 alt。 */
const INLINE_PHOTOS = {
  beijinglu: {
    alt: {
      zh: "北京路步行街挤满了人，两侧竖着一排店铺招牌",
      en: "Beijing Road pedestrian street full of people, a row of shop signs down both sides",
      ar: "شارع بكين للمشاة يعجّ بالناس، وعلى جانبيه صفّ من لافتات المتاجر",
    },
  },
  arcade: {
    alt: {
      zh: "雨后的恩宁路：左边一排骑楼，二楼探出来盖住人行道，底下开着小吃店，街边停着电动车",
      en: "Enning Road after rain: a row of arcade buildings on the left, their upper floors reaching out over the pavement, snack shops underneath and scooters parked along the kerb",
      ar: "شارع إنينغ بعد المطر: صفّ من مباني الأروقة على اليسار، طوابقها العليا تمتدّ فوق الرصيف، وتحتها محال وجبات خفيفة ودراجات كهربائية على الحافة",
    },
    caption: {
      zh: "恩宁路的骑楼：二楼挑出来，底下让出一条走廊。",
      en: "The arcades of Enning Road: the upper floor reaches out and leaves a covered walk beneath.",
      ar: "أروقة شارع إنينغ: الطابق العلوي يمتدّ فيترك ممرًّا مسقوفًا تحته.",
    },
  },
} satisfies Record<string, { alt: L10n; caption?: L10n }>;

/**
 * 页面上真正显示过的图片。图片来源那一段只列这些：
 * `lib/photos.ts` 合并的是两份脚本生成的清单（都不手改），里面还留着弃用的素材。
 */
const USED_IMAGE_KEYS = new Set(
  [
    ...INLINE_IMAGE_KEYS,
    ...ROUTES.map((route) => route.imageKey),
    ...FOOD_NOTES.map((note) => note.imageKey),
    ...RETAIL_STUDY.malls.flatMap((mall) => [mall.imageKey, mall.photoKey]),
    ...MOSQUES.map((place) => place.photoKey),
    ...HALAL_DINING.map((place) => place.photoKey),
    ...CITY_TECH.items.map((item) => item.imageKey),
    // 品牌推荐现在一个主题一张代表菜，不是一家一张 —— 授权清单跟着页面走。
    ...DINING_THEMES.map((theme) => theme.imageKey),
    CHAPTER_PHOTOS.pazhou,
    CHAPTER_PHOTOS.story,
    CHAPTER_PHOTOS.miniso,
    CHAPTER_PHOTOS.minisoStore,
  ].filter((key): key is string => Boolean(key && IMG[key])),
);

const shownCredits = PHOTO_CREDITS.filter((credit) =>
  USED_IMAGE_KEYS.has(credit.key),
);

/**
 * 章提示里的品牌数跟着数据走。文案里写死过 21，品牌早就精选成 14 了 ——
 * 收起来的那一行第一个数字对不上，读者对整章的信任就先掉一截。
 */
const FOOD_HINT: L10n = (() => {
  const count = String(DINING_BRANDS.length);
  const hint = UI.guideHints.foodCulture;
  return {
    zh: hint.zh.replace("{n}", count),
    en: hint.en.replace("{n}", count),
    ar: hint.ar.replace("{n}", count),
  };
})();

/**
 * 开篇的一句欢迎。只在这份组件里，不进 lib/trip-data.ts —— 那里放的是事实。
 * 配的是珠江全景（skyline.jpg）。两段话是招呼，不是概述：
 * 海上贸易与光塔的故事属于「广州与你们」那一章，这里不先讲一遍。
 */
const WELCOME = {
  title: {
    zh: "欢迎来到广州",
    en: "Welcome to Guangzhou",
    ar: "أهلًا بكم في قوانغتشو",
  },
  first: {
    zh: "很高兴在广州与你相见。这几天除了会议，这座城市还有别的等着你：清晨的茶楼、榕树遮着的老街、入夜后亮起来的珠江两岸。",
    en: "We are glad to meet you here in Guangzhou. Beyond the meetings, the city has its own things waiting: teahouses in the morning, old streets under banyan trees, and both banks of the Pearl River lit after dark.",
    ar: "يسعدنا لقاؤكم هنا في قوانغتشو. وإلى جانب الاجتماعات، للمدينة ما تنتظركم به: بيوت الشاي في الصباح، وشوارع قديمة تظلّلها أشجار البانيان، وضفّتا نهر اللؤلؤ مضاءتان بعد المغيب.",
  },
  second: {
    zh: "愿你在忙碌的会程之外，也有时间慢慢逛、好好吃，发现属于自己的广州。",
    en: "Beyond a busy programme, we hope you find time to wander, to eat well, and to discover the Guangzhou that is yours.",
    ar: "ونتمنى أن تجدوا، إلى جانب برنامجكم المزدحم، وقتًا للتجوّل على مهل ولطعام طيّب، ولاكتشاف قوانغتشو التي تخصّكم.",
  },
  /** 照片里看得见什么，三语。读屏的人也该知道开篇那张是什么。 */
  alt: {
    zh: "白天从江对岸看珠江新城，一排高楼沿着岸边站开",
    en: "Zhujiang New Town by day, seen from across the Pearl River: a line of towers along the bank",
    ar: "تشوجيانغ الجديدة نهارًا من الضفة المقابلة لنهر اللؤلؤ: صفّ من الأبراج على طول الضفة",
  },
} satisfies Record<string, L10n>;

/**
 * 一段要被「读」的文字：一句开头、几段正文、来源。
 * 指南里几处用它 —— 广州与你们、你们住的这块地、食在广州。
 *
 * 正文限宽 44rem：屏幕再宽也只是行数变少，不是字变大、也不是一行拉到底。
 */
/**
 * 按 key 取一张照片来放。第二批照片自带三语 alt 与图说（lib/guide-photos.ts），
 * 第一批的说明写在各自的数据条目里，所以这里允许传一个 alt 兜底。
 * 没有说明就不放图 —— 空 alt 对读屏的人等于「跳过」。
 */
function GuideFigure({
  photoKey,
  lang,
  alt,
  caption,
  className,
  imageClassName,
}: {
  photoKey?: string;
  lang: Lang;
  alt?: L10n;
  caption?: L10n;
  className?: string;
  imageClassName?: string;
}) {
  if (!photoKey || !IMG[photoKey]) return null;
  const text = photoAlt(photoKey) ?? alt;
  if (!text) return null;
  const size = photoSize(photoKey);
  return (
    <Figure
      src={IMG[photoKey]}
      alt={text}
      caption={caption ?? photoCaption(photoKey)}
      lang={lang}
      width={size?.width}
      height={size?.height}
      className={className}
      imageClassName={imageClassName}
    />
  );
}

/**
 * 文化那一章里，个别条目自己带一张照片（现在只有骑楼那条）。
 * 说明写在 `INLINE_PHOTOS` 里 —— 第一批素材的 alt 与图说不在照片记录中。
 */
function NotePhoto({ photoKey, lang }: { photoKey?: string; lang: Lang }) {
  if (!photoKey) return null;
  const texts: { alt: L10n; caption?: L10n } | undefined =
    INLINE_PHOTOS[photoKey as keyof typeof INLINE_PHOTOS];
  return (
    <GuideFigure
      photoKey={photoKey}
      alt={texts?.alt}
      caption={texts?.caption}
      lang={lang}
    />
  );
}

function Prose({
  lead,
  paragraphs,
  sources,
  lang,
  photoKey,
  photoImageClassName,
  children,
}: {
  lead: L10n;
  paragraphs: L10n[];
  sources: { label: L10n; url: string }[];
  lang: Lang;
  /** 一章的主图，放在开头那句话下面。 */
  photoKey?: string;
  /** 只给竖构图大场景用的限高覆盖，见 `Figure` 的 `imageClassName`。 */
  photoImageClassName?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="max-w-[44rem]">
      <p className={GUIDE.lead}>{t(lead, lang)}</p>
      <GuideFigure photoKey={photoKey} lang={lang} imageClassName={photoImageClassName} />
      <div className="mt-2.5 space-y-2.5">
        {paragraphs.map((paragraph, index) => (
          <p key={index} className={GUIDE.body}>
            {t(paragraph, lang)}
          </p>
        ))}
      </div>
      {children}
      <Sources sources={sources} lang={lang} />
    </section>
  );
}

/** 来源收起来放在末尾：要核对的人点得开，读文章的人不被链接打断。 */
function Sources({
  sources,
  lang,
}: {
  sources: { label: L10n; url: string }[];
  lang: Lang;
}) {
  if (sources.length === 0) return null;
  return (
    <details className="mt-3">
      <summary
        className={cn(GUIDE.note, "inline-flex min-h-11 cursor-pointer items-center")}
      >
        {lang === "zh" ? "资料来源" : lang === "ar" ? "المصادر" : "Sources"}
      </summary>
      <ul className="flex flex-wrap gap-x-5 gap-y-1 pb-1">
        {sources.map((source) => (
          <li key={source.url}>
            <SourceLink label={source.label} url={source.url} lang={lang} />
          </li>
        ))}
      </ul>
    </details>
  );
}

/**
 * 一段「要用的时候再看」的附加资料：机场中文地址、行李额。
 * 和来源折叠同一个 `<details>` 写法 —— 不是新控件，也不是新的一章：
 * 出发前准备读下来是一条线，这两样翻出来是查表，不该横插在正文中间。
 */
function Fold({
  title,
  lang,
  children,
}: {
  title: L10n;
  lang: Lang;
  children: React.ReactNode;
}) {
  return (
    <details className="border-t border-card-line pt-2">
      {/* 不动 summary 的显示方式：原生的三角标记要留着，读者才看得出这里能点开。 */}
      <summary className={cn(GUIDE.subheading, "min-h-11 cursor-pointer py-2")}>
        {t(title, lang)}
      </summary>
      <div className="space-y-3 pb-1 pt-1.5">{children}</div>
    </details>
  );
}

/** 出发前准备里那两份查表资料的标题。 */
const PREP_FOLDS = {
  addresses: {
    zh: "机场中文地址（白云 T2 / T3）",
    en: "Airport addresses in Chinese (Baiyun T2 / T3)",
    ar: "عناوين المطار بالصينية (بايون T2 / T3)",
  },
} satisfies Record<string, L10n>;

/**
 * 出发前准备的出处：官方来华出行与支付指引，加上带餐刀那句依据的两页航司条款。
 * 条款不抄进正文 —— 正文只说「包好、托运」，要核对的人点开这里。
 */
const PREP_SOURCES = [
  {
    label: {
      zh: "来华出行与支付指引",
      en: "Official travel and payment guide",
      ar: "الدليل الرسمي للتنقل والدفع",
    },
    url: "https://english.www.gov.cn/2025special/bizexpatsinchina2025",
  },
  {
    label: {
      zh: "EgyptAir：运输总条件（刀具不得带进客舱）",
      en: "EgyptAir: conditions of carriage (knives not allowed in the cabin)",
      ar: "مصر للطيران: شروط النقل (السكاكين ممنوعة في المقصورة)",
    },
    url: "https://www.egyptair.com/en/Pages/Conditions-of-Carriage.aspx",
  },
  {
    label: {
      zh: "EgyptAir：行李额（利器须包好放托运）",
      en: "EgyptAir: baggage allowance (sharp objects sheathed in checked baggage)",
      ar: "مصر للطيران: مخصصات الأمتعة (الأدوات الحادة مغلَّفة في الحقيبة المسجَّلة)",
    },
    url: "https://www.egyptair.com/en/fly/baggage/Pages/baggage-allowance.aspx",
  },
] satisfies { label: L10n; url: string }[];

/**
 * 报数的格子。数字自己说话，不加形容词。
 * 24px 就够：这是一段介绍里的数字，不是海报。
 */
function StatTiles({ lang }: { lang: Lang }) {
  return (
    <div className="mt-4">
      <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
        {CITY_SCALE.tiles.map((tile) => (
          <div key={tile.id} className="trip-stat px-3 pb-3 pt-3">
            <p dir="ltr" className="trip-stat-value text-2xl text-navy">
              {t(tile.value, lang)}
            </p>
            <p className={cn(GUIDE.note, "mt-1 font-semibold text-navy")}>
              {t(tile.unit, lang)}
            </p>
            <p className={cn(GUIDE.note, "mt-0.5")}>{t(tile.note, lang)}</p>
          </div>
        ))}
      </div>
      {/* 「数据标注了年份、来源可展开」这种话不用写在页面上 ——
          年份就印在每格里，来源本来就在章尾折叠着。 */}
    </div>
  );
}

/**
 * 一章。收起来只剩标题和一行提示，整份指南就是一张目录；点开才铺内容。
 *
 * 提示只在收起时出现：有几章（「广州与你们」）的提示就是正文开头那句，
 * 展开后标题下面紧跟着同一句话，等于连读两遍。展开时把它收掉，
 * 标题一直在，正文那句只出现一次。所有章一致，不因此多加任何控件。
 *
 * 单列，一章一张卡 —— 不分组、没有组标题、没有快捷入口。
 * 上一版把它们归成「出行随手查 / 认识广州」两组并加了工具化的清单，已被用户否掉。
 */
function Section({
  id,
  title,
  hint,
  lang,
  children,
}: {
  id: string;
  title: L10n;
  hint: L10n;
  lang: Lang;
  children: React.ReactNode;
}) {
  return (
    <AccordionItem
      id={`guide-${id}`}
      value={id}
      className="trip-card border-b-0 px-4 md:px-5"
    >
      <AccordionTrigger className="group/section items-center gap-3 py-3 hover:no-underline">
        <span className="flex min-w-0 flex-col gap-0.5 text-start">
          <span className={GUIDE.heading}>{t(title, lang)}</span>
          <span
            className={cn(
              GUIDE.note,
              "text-navy-soft/85 group-data-[state=open]/section:hidden",
            )}
          >
            {t(hint, lang)}
          </span>
        </span>
      </AccordionTrigger>
      <AccordionContent className="space-y-4 pb-4 pt-0.5">
        {children}
      </AccordionContent>
    </AccordionItem>
  );
}

/** 一章里的小标题，比章标题低一级。 */
function SubHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className={cn(GUIDE.subheading, "pt-1 text-navy-soft")}>{children}</h3>
  );
}

/**
 * 一个地点：名字、一段介绍、给司机看的中文地址、开放信息、来源。
 * 全程打车，所以中文地址那行按「举给司机看」的距离排字号，比正文大。
 */
function PlaceCardView({ place, lang }: { place: PlaceCard; lang: Lang }) {
  return (
    <article className="max-w-[44rem] border-t border-card-line pt-3">
      <h4 className={GUIDE.subheading}>{t(place.name, lang)}</h4>
      <p className={cn(GUIDE.body, "mt-1")}>{t(place.note, lang)}</p>
      <GuideFigure photoKey={place.photoKey} lang={lang} />
      <div className="mt-2.5">
        <CopyChinese entry={place.copy} lang={lang} showBig />
      </div>
      {place.meta ? (
        <p className={cn(GUIDE.note, "mt-2")}>
          <span className="font-semibold">{t(UI.placeMeta, lang)}：</span>
          {t(place.meta, lang)}
        </p>
      ) : null}
      {place.sources.length > 0 ? (
        <ul className="mt-2 space-y-1">
          {place.sources.map((source) => (
            <li key={source.url}>
              <SourceLink label={source.label} url={source.url} lang={lang} />
            </li>
          ))}
        </ul>
      ) : null}
    </article>
  );
}

/**
 * 食在广州这一章的出处：介绍那几段的来源，加上每道菜自己的来源，合成一张表。
 * 链接一条不丢，只是不再一道菜一个红链接地打断阅读；每条用菜名当标签，认得出是哪一道。
 */
const foodSources = [
  ...FOOD_CULTURE.sources,
  ...FOOD_NOTES.filter((note) => note.url).map((note) => ({
    label: note.title,
    url: note.url as string,
  })),
].filter(
  (source, index, all) => all.findIndex((s) => s.url === source.url) === index,
);

/**
 * 当地生活习惯那一章的开场一句：说清这一章为什么值得读，再进条目。
 * 用正文字号，不加标题控件。
 *
 * 不在这里点名「中秋」：紧跟着的第一条标题和正文就是中秋，开场再说一遍，
 * 收起来的章提示、开场、标题会连着重复三次（2026-09-13 主窗口在实际页面上看到的）。
 * 所以这里只说「一个正赶上的节日」，把名字留给它自己那一条。
 */
const CULTURE_INTRO: L10n = {
  zh: "了解一座城市，也可以从人们怎样相聚开始：节日里赏月团圆，茶楼里围桌分享，日常交往中有自己的小礼节。这趟旅程正好赶上一场重视家人团聚的节日；知道它的来历，街头的灯笼和月饼就不只是装饰了。",
  en: "One way to get to know a city is to start with how people come together: watching the moon and gathering as a family at a festival, sharing a table in a teahouse, the small courtesies of everyday dealings. This trip happens to fall on a festival built around family reunion — and once you know where it comes from, the lanterns and mooncakes on the street are more than decoration.",
  ar: "من طرق التعرّف إلى مدينة أن تبدؤوا بكيفية اجتماع الناس: مشاهدة القمر ولَمّ شمل العائلة في العيد، ومشاركة المائدة في بيت الشاي، ومجاملات صغيرة في التعامل اليومي. وتصادف هذه الرحلة عيدًا محوره اجتماع العائلة — ومتى عرفتم أصله، صارت الفوانيس وكعك القمر في الشارع أكثر من زينة.",
};

/** 文化那一章里，个别条目（放假安排、民俗）带着自己的出处，章尾一起折叠。 */
const cultureSources = CULTURE_NOTES.flatMap((note) => note.sources ?? []);

/** 一家商场：名字、一句定位、一段边走边看的事实；有图就配一张小图。 */
function MallRow({ mall, lang }: { mall: MallCard; lang: Lang }) {
  return (
    <li className="flex gap-3 border-t border-card-line py-3">
      {mall.imageKey && IMG[mall.imageKey] ? (
        <img
          src={IMG[mall.imageKey]}
          alt={mall.imageAlt ? t(mall.imageAlt, lang) : ""}
          loading="lazy"
          width={88}
          height={66}
          className="trip-photo h-[66px] w-[88px] shrink-0 object-cover"
        />
      ) : null}
      <div className="min-w-0">
        <h4 className={GUIDE.subheading}>{t(mall.name, lang)}</h4>
        <p className={cn(GUIDE.note, "font-medium text-miniso-red-strong")}>
          {t(mall.tier, lang)}
        </p>
        <p className={cn(GUIDE.body, "mt-1")}>{t(mall.facts, lang)}</p>
        {/* 有成幅照片的那一家（天环的俯瞰）在自己这一行里展开，不去挤小缩略图那一列。 */}
        <GuideFigure photoKey={mall.photoKey} lang={lang} />
      </div>
    </li>
  );
}

export function GuideTab({
  lang,
  person,
}: {
  lang: Lang;
  person: PersonId | null;
}) {
  // 共同操作指引对所有人可见，只有借卡与备用金按人员区分。
  // 全员视图（person === null）不筛，给统筹的人看全貌。
  const prep = PREP.filter(
    (item) =>
      !item.audience || person === null || item.audience.includes(person),
  );
  const hotel = COPY_ADDRESSES.find((entry) => entry.id === "hotel");
  return (
    <div className="guest-guide space-y-2.5">
      {/*
        开篇：一张明亮的珠江城市全景 + 一句欢迎。默认就看得见，不折叠、不加按钮，
        也不占满一屏。照片按 1200×492 的自然比例完整显示，**不裁楼**：
        手机上满宽（约 326×134），桌面左图右文、图宽限 26rem 后同样按比例算高，
        所以两边取景一样。上一版用怀圣寺的屋檐，在 1280px 被拉成一条屋檐，已换掉。
        这张照片整份指南只在这里出现一次 ——「这座城有多大」一章不再重复它。
      */}
      <section
        className="trip-card overflow-hidden md:flex md:items-center md:gap-5 md:p-5"
        aria-labelledby="guide-welcome"
      >
        {IMG.skyline ? (
          <img
            src={IMG.skyline}
            alt={t(WELCOME.alt, lang)}
            width={1200}
            height={492}
            className="h-auto w-full md:w-[26rem] md:shrink-0 md:rounded-lg"
          />
        ) : null}
        <div className="p-4 md:min-w-0 md:flex-1 md:p-0">
          <h2
            id="guide-welcome"
            className="trip-display text-xl font-semibold leading-7 text-navy"
          >
            {t(WELCOME.title, lang)}
          </h2>
          <div className="mt-2 max-w-[44rem] space-y-2">
            <p className={GUIDE.body}>{t(WELCOME.first, lang)}</p>
            <p className={GUIDE.body}>{t(WELCOME.second, lang)}</p>
          </div>
        </div>
      </section>

      {/*
        欢迎之后是出发前准备（owner 2026-09-12 定的顺序）：先把出发前要办的事读完，
        再落到住处，然后才是这座城。机场中文地址与两家航司的行李额都收在准备这一章里
        的折叠详情中 —— 它们是查表，不该横插在正文里各占一章。
      */}
      <Accordion type="multiple" defaultValue={[]} className="space-y-2.5">
        <Section id="prep" title={UI.prep} hint={UI.guideHints.prep} lang={lang}>
          {/* 一件事一个小标题，下面直接是原来的说明 ——
              展开这一章就能从上网一路读到天气，不用再逐条点开。 */}
          <div className="max-w-[44rem] space-y-4">
            <a
              href="./reference/attendee-guide-2026.png"
              className="flex items-center gap-3 rounded-xl border border-card-line p-3 text-navy transition-colors hover:border-navy/40"
            >
              <img
                src="./reference/attendee-guide-cover.jpg"
                alt={t({ zh: "参会指引封面", en: "Attendee guide cover", ar: "غلاف دليل المشاركين" }, lang)}
                width={484}
                height={560}
                loading="lazy"
                className="h-24 w-20 shrink-0 rounded-md object-cover"
              />
              <span className="min-w-0">
                <span className={cn(GUIDE.subheading, "block")}>{t({ zh: "官方参会指引", en: "Official attendee guide", ar: "الدليل الرسمي للمشاركين" }, lang)}</span>
                <span className={cn(GUIDE.note, "mt-1 block text-miniso-red-strong underline underline-offset-4")}>{t({ zh: "点击查看完整原图", en: "Open the full original image", ar: "عرض الصورة الأصلية كاملة" }, lang)}</span>
              </span>
            </a>
            {prep.map((item) => (
              <div key={item.id}>
                <h3 className={GUIDE.subheading}>{t(item.title, lang)}</h3>
                <BulletList items={item.lines} lang={lang} className="mt-1.5" />
              </div>
            ))}

            <Fold title={{ zh: "参会须知", en: "Before entering the venue", ar: "قبل دخول قاعة الفعالية" }} lang={lang}>
              <BulletList items={MEETING_RULES} lang={lang} />
            </Fold>

            <Fold title={PREP_FOLDS.addresses} lang={lang}>
              {COPY_ADDRESSES.filter((entry) => entry.id !== "hotel").map((entry) => (
                <CopyChinese key={entry.id} entry={entry} lang={lang} showBig />
              ))}
            </Fold>

            {/* 两张航司大卡不进主阅读流：要核对额度的人点开这里，`BaggageLines`
                本身的规则一个字没动。 */}
            <Fold title={UI.baggage} lang={lang}>
              <BaggageLines profile="sichuanEconomy" lang={lang} />
              <div className="border-t border-card-line pt-3">
                <BaggageLines profile="egyptairBusiness" lang={lang} />
              </div>
            </Fold>

            <Sources sources={PREP_SOURCES} lang={lang} />
          </div>
        </Section>
      </Accordion>

      {/* 到了之后最先要用的东西：住哪、地址给司机看、前台电话。整份指南只写一次。 */}
      <section className="trip-card p-4 md:p-5" aria-labelledby="guide-hotel">
        <p
          className={cn(
            GUIDE.note,
            "font-medium uppercase tracking-[0.08em] text-navy-soft/80",
          )}
        >
          {t(HOTEL_LABELS.eyebrow, lang)}
        </p>
        <h2 id="guide-hotel" className={cn(GUIDE.heading, "mt-0.5")}>
          {t(INTERCONTINENTAL.name, lang)}
        </h2>
        {hotel ? (
          <div className="mt-2.5 max-w-[44rem]">
            <CopyChinese
              entry={{ ...hotel, label: HOTEL_LABELS.address }}
              lang={lang}
              showBig
            />
          </div>
        ) : null}
        <a
          className={cn(
            GUIDE.body,
            "mt-1 inline-flex min-h-11 items-center gap-2 font-medium text-miniso-red-strong underline underline-offset-4",
          )}
          href={`tel:${HOTEL_PHONE.replace(/\s/g, "")}`}
        >
          {t(HOTEL_LABELS.reception, lang)}
          <bdi dir="ltr">{HOTEL_PHONE}</bdi>
        </a>
        {person === "reham" || person === null ? (
          <p className={cn(GUIDE.body, "mt-1 max-w-[44rem]")}>
            {t(HOTEL_LABELS.transfer, lang)}
          </p>
        ) : null}
        <div className="mt-3 border-t border-card-line pt-3">
          <h3 className={GUIDE.subheading}>{t({ zh: "会务联系", en: "Event assistance", ar: "المساعدة في الفعالية" }, lang)}</h3>
          {EVENT_CONTACTS.map((contact) => (
            <p key={contact.phone} className={cn(GUIDE.note, "mt-1")}>
              {t(contact.language, lang)} · <bdi>{contact.name}</bdi>{" · "}
              <a href={`tel:${contact.phone.replace(/\s/g, "")}`} className="inline-flex min-h-11 items-center text-miniso-red-strong underline"><bdi dir="ltr">{contact.phone}</bdi></a>
            </p>
          ))}
        </div>
      </section>

      {/*
        住处之后就是这块地：琶洲紧挨着上面的酒店卡，讲的就是酒店脚下这一片。
        再往下才是这座城 —— 广州与你们 → 认识今天的广州 → 名创优品 → 科技，
        然后是到了之后要用的（礼拜与清真餐 / 吃 / 习惯 / 逛 / 路线），
        最后是备查的（短句 / 来源）。
      */}
      <Accordion type="multiple" defaultValue={[]} className="space-y-2.5">
        <Section
          id="pazhou"
          title={UI.pazhou}
          hint={UI.guideHints.pazhou}
          lang={lang}
        >
          <Prose
            lead={PAZHOU.lead}
            paragraphs={PAZHOU.paragraphs}
            sources={PAZHOU.sources}
            lang={lang}
            photoKey={CHAPTER_PHOTOS.pazhou}
            /* 竖构图的大场景：按默认限高会缩成一张邮票，这一张单独放宽限高，
               仍然按原比例放全、居中，塔尖与画面里的摄影署名都不裁。 */
            photoImageClassName="max-h-[28rem] md:max-h-[32rem]"
          />
        </Section>

        <Section id="story" title={UI.cityStory} hint={CITY_STORY.lead} lang={lang}>
          <Prose
            lead={CITY_STORY.lead}
            paragraphs={CITY_STORY.paragraphs}
            sources={CITY_STORY.sources}
            lang={lang}
            photoKey={CHAPTER_PHOTOS.story}
          />
        </Section>

        <Section id="scale" title={UI.cityScale} hint={UI.guideHints.cityScale} lang={lang}>
          {/* 照片不再放这里：同一张珠江全景已经是开篇那张，文字与数字照旧。 */}
          <Prose
            lead={CITY_SCALE.lead}
            paragraphs={CITY_SCALE.intro}
            sources={CITY_SCALE.sources}
            lang={lang}
          >
            <StatTiles lang={lang} />
          </Prose>
        </Section>

        {/* 三节各带自己的照片：总部那节配封顶时的航拍，门店那节配开业当天的正佳门口。 */}
        <Section
          id="miniso"
          title={UI.miniso}
          hint={UI.guideHints.miniso}
          lang={lang}
        >
          <section className="max-w-[44rem]">
            <p className={GUIDE.lead}>{t(MINISO_IN_GZ.lead, lang)}</p>
            <p className={cn(GUIDE.body, "mt-2")}>{t(PRODUCT_PREVIEW, lang)}</p>
            {MINISO_IN_GZ.sections.map((part) => (
              <div key={part.id} className="mt-3">
                <h3 className={GUIDE.subheading}>{t(part.title, lang)}</h3>
                <GuideFigure photoKey={part.photoKey} lang={lang} />
                <div className="mt-1.5 space-y-2.5">
                  {part.paragraphs.map((paragraph, index) => (
                    <p key={index} className={GUIDE.body}>
                      {t(paragraph, lang)}
                    </p>
                  ))}
                </div>
              </div>
            ))}
            <Fold title={{ zh: "参会指引推荐门店", en: "Stores highlighted in the event guide", ar: "متاجر يقترحها دليل الفعالية" }} lang={lang}>
              <p className={GUIDE.note}>{t({ zh: "以下为指引推荐门店；9月24日的实际巡店路线以会务安排为准。", en: "These are the guide’s suggested stores. The organiser confirms the actual route for 24 September.", ar: "هذه متاجر يقترحها الدليل؛ ويحدد المنظم المسار الفعلي لجولة 24 سبتمبر." }, lang)}</p>
              <CopyChinese entry={{ id: "event-teemall", label: { zh: "MINISO FRIENDS 天河城店", en: "MINISO FRIENDS · TeeMall", ar: "MINISO FRIENDS · TeeMall" }, chinese: "广州市天河区天河路208号天河城购物中心4楼，MINISO FRIENDS" }} lang={lang} />
              <CopyChinese entry={{ id: "event-junchao", label: { zh: "SUPER MINISO 君超店", en: "SUPER MINISO · Junchao", ar: "SUPER MINISO · Junchao" }, chinese: "广州市天河区棠下二社涌边路1号君超中心F1，SUPER MINISO" }} lang={lang} />
              <CopyChinese entry={{ id: "event-grandview", label: { zh: "MINISO LAND 正佳店", en: "MINISO LAND · Grandview", ar: "MINISO LAND · Grandview" }, chinese: "广州市天河区天河路228号正佳广场1楼北街，MINISO LAND" }} lang={lang} />
            </Fold>
            <Sources sources={MINISO_IN_GZ.sources} lang={lang} />
          </section>
        </Section>

        {/* 配图只用真在中国、最好在广州拍的：街上的 Robotaxi（粤A 牌）、扫码付款、
            黄色电动出租车，载人飞行器那张来自广州市政府。
            送物机器人用普渡官网的产品示例，无人机那张来自海珠区政府。 */}
        <Section id="tech" title={UI.cityTech} hint={UI.guideHints.tech} lang={lang}>
          <Prose
            lead={CITY_TECH.lead}
            paragraphs={[CITY_TECH.intro]}
            sources={CITY_TECH.sources}
            lang={lang}
          >
            {/* 条目顺序就是遇到它们的顺序：先是走在街上就碰得到的三样，
                再是要专门去约、去找的三样（数据里已按这个顺序排）。 */}
            <ul className="mt-4 grid gap-x-5 md:grid-cols-2">
              {CITY_TECH.items.map((item) => (
                <li key={item.id} className="border-t border-card-line py-3">
                  {/* 照片按原比例放全：机身、车顶的传感器、电梯口都不裁。 */}
                  <GuideFigure
                    photoKey={item.imageKey}
                    alt={item.imageAlt}
                    lang={lang}
                    className="mt-0"
                  />
                  <h4 className={GUIDE.subheading}>{t(item.title, lang)}</h4>
                  {/* 正文按空行分段：先给一个看得见的画面，再让数字落下来当回响。
                      一段连着写，两个节拍就糊成一句话了。 */}
                  {t(item.body, lang)
                    .split("\n")
                    .map((paragraph, index) => (
                      <p key={index} className={cn(GUIDE.body, "mt-1")}>
                        {paragraph}
                      </p>
                    ))}
                  {/* 「哪里能碰到」排在故事后面：先读到画面，再拿到入口。
                      放在标题下面时，390px 上先看见的是一条说明书。 */}
                  <p className={cn(GUIDE.note, "mt-1.5 text-navy-soft/85")}>
                    {t(UI.techWhere, lang)}：{t(item.where, lang)}
                  </p>
                </li>
              ))}
            </ul>
          </Prose>
        </Section>


        <Section
          id="halal"
          title={UI.halal}
          hint={UI.guideHints.halal}
          lang={lang}
        >
          {/* 开场两段先说清这一章讲的是一个还在的社区，以及安排一次礼拜和一顿饭
              大致是怎么回事；然后才是这一周真要用的：哪天的主麻、去哪一带、点菜怎么问。
              三座寺各自的样子排在后面 —— 读到那里的人已经知道自己要去哪一带了。 */}
          <div className="max-w-[44rem] space-y-2.5">
            {HALAL_INTRO.map((paragraph, index) => (
              <p key={index} className={GUIDE.body}>
                {t(paragraph, lang)}
              </p>
            ))}
          </div>
          <p className={cn(GUIDE.body, "trip-card-accent mt-3 max-w-[44rem] p-3 text-navy")}>
            <span className="font-semibold">{t(UI.jumuah, lang)}：</span>
            {t(JUMUAH_NOTE, lang)}
          </p>
          <div className="max-w-[44rem]">
            <BulletList items={HALAL_WHERE} lang={lang} />
          </div>

          <SubHeading>{t(UI.mosques, lang)}</SubHeading>
          {MOSQUES.map((place) => (
            <PlaceCardView key={place.id} place={place} lang={lang} />
          ))}

          <SubHeading>{t(UI.halalDining, lang)}</SubHeading>
          {HALAL_DINING.map((place) => (
            <PlaceCardView key={place.id} place={place} lang={lang} />
          ))}
        </Section>

        <Section
          id="food"
          title={UI.foodCulture}
          hint={FOOD_HINT}
          lang={lang}
        >
          {/*
            一句导语 → 饮食介绍 → 十二道菜 → 品牌推荐。
            先让人知道什么是「叹早茶」、什么是啫啫煲，再告诉她去哪吃 ——
            倒过来的话，要划过十几家餐厅才知道这些菜是什么（owner 定的顺序）。
          */}
          <p className={cn(GUIDE.lead, "max-w-[44rem]")}>
            {t(FOOD_CULTURE.lead, lang)}
          </p>

          <div className="max-w-[44rem] space-y-2.5">
            {FOOD_CULTURE.paragraphs.map((paragraph, index) => (
              <p key={index} className={GUIDE.body}>
                {t(paragraph, lang)}
              </p>
            ))}
            {/*
              这一章不再挂那串通用饮食提醒：清真与忌口那句已经并进上面品牌推荐的导语
              （挑店之前就要看到），机上特殊餐那句属于出发前的事，已移到「出发前准备」。
              一章里同一句话说两遍就是噪音。
              来源也不在这里 —— 菜式介绍与每道菜的出处一起，收在下面那一个折叠里。
            */}
          </div>

          <SubHeading>{t(UI.foodIdeas, lang)}</SubHeading>
          {/*
            十一道菜不是十一屏一样的图文：几道给一张看得见的照片（`hero`），
            桌面上图在左、字在右；其余走小图或纯文字的紧凑行。
            顺序按原来的读法走，不按有没有照片重排。
          */}
          <div className="grid gap-x-5 md:grid-cols-2">
            {FOOD_NOTES.map((note) =>
              note.hero ? (
                <article
                  key={note.id}
                  className="border-t border-card-line py-3 md:col-span-2 md:flex md:items-start md:gap-4"
                >
                  {note.imageKey && IMG[note.imageKey] ? (
                    // 主图也按原比例放全：手机上限高 15rem，桌面上放在文字左边。
                    <img
                      src={IMG[note.imageKey]}
                      alt={note.imageAlt ? t(note.imageAlt, lang) : ""}
                      loading="lazy"
                      className="trip-photo mx-auto mb-2 block h-auto max-h-[15rem] w-auto max-w-full md:mx-0 md:mb-0 md:max-h-[13rem] md:shrink-0"
                    />
                  ) : null}
                  <div className="md:min-w-0">
                    <h4 className={GUIDE.subheading}>{t(note.title, lang)}</h4>
                    <p className={cn(GUIDE.body, "mt-1")}>{t(note.body, lang)}</p>
                  </div>
                </article>
              ) : (
                <article
                  key={note.id}
                  className="flex gap-3 border-t border-card-line py-3"
                >
                  {note.imageKey && IMG[note.imageKey] ? (
                    <img
                      src={IMG[note.imageKey]}
                      alt={note.imageAlt ? t(note.imageAlt, lang) : ""}
                      loading="lazy"
                      width={88}
                      height={66}
                      className="trip-photo h-[66px] w-[88px] shrink-0 object-cover"
                    />
                  ) : null}
                  <div className="min-w-0">
                    <h4 className={GUIDE.subheading}>{t(note.title, lang)}</h4>
                    <p className={cn(GUIDE.body, "mt-1")}>{t(note.body, lang)}</p>
                  </div>
                </article>
              ),
            )}
          </div>
          {/* 每道菜下面各挂一个红色「来源」，十一条读下来全是链接。
              出处一条不少，收进这一节末尾的一个折叠里；品牌那一节的「菜品来源」另算。 */}
          <div className="max-w-[44rem]">
            <Sources sources={foodSources} lang={lang} />
          </div>

          <SubHeading>{t(UI.diningBrands, lang)}</SubHeading>
          <DiningBrands lang={lang} />
        </Section>

        <Section
          id="culture"
          title={UI.culture}
          hint={UI.guideHints.culture}
          lang={lang}
        >
          {/* 先一句话说清这一章是干什么的，再是这次正好遇上的节日、餐桌与日常来往，
              街上的骑楼放在最后 —— 骑楼那张照片挨着讲骑楼的那一条。 */}
          <p className={cn(GUIDE.body, "max-w-[44rem]")}>
            {t(CULTURE_INTRO, lang)}
          </p>
          <ul className="max-w-[44rem]">
            {CULTURE_NOTES.map((note) => (
              <li key={note.id} className="border-t border-card-line py-3">
                <h4 className={GUIDE.subheading}>{t(note.title, lang)}</h4>
                {/* 空行分段：像「初次见面」这一条，两小段比一大段好读。 */}
                {t(note.body, lang)
                  .split("\n")
                  .map((paragraph, index) => (
                    <p key={index} className={cn(GUIDE.body, "mt-1")}>
                      {paragraph}
                    </p>
                  ))}
                <NotePhoto photoKey={note.photoKey} lang={lang} />
              </li>
            ))}
          </ul>
          {/* 只有放假安排这类要给出处的条目才有 sources，和别处一样收在章尾一个折叠里。 */}
          <div className="max-w-[44rem]">
            <Sources sources={cultureSources} lang={lang} />
          </div>
        </Section>

        <Section
          id="retail"
          title={UI.retail}
          hint={UI.guideHints.retail}
          lang={lang}
        >
          <div className="max-w-[44rem]">
            {/* 先讲两条街各看什么，再一家一家说；交通示意排在最后 ——
                知道要去哪儿之后，才需要「从酒店怎么走」。 */}
            <p className={GUIDE.lead}>{t(RETAIL_STUDY.lead, lang)}</p>
            <div className="mt-2.5 space-y-2.5">
              {RETAIL_STUDY.intro.map((paragraph, index) => (
                <p key={index} className={GUIDE.body}>
                  {t(paragraph, lang)}
                </p>
              ))}
            </div>
          </div>

          <SubHeading>{t(UI.retailMalls, lang)}</SubHeading>
          <ul className="max-w-[44rem]">
            {RETAIL_STUDY.malls.map((mall) => (
              <MallRow key={mall.id} mall={mall} lang={lang} />
            ))}
          </ul>

          <SubHeading>{t(UI.retailCase, lang)}</SubHeading>
          <div className="max-w-[44rem] space-y-2.5">
            {RETAIL_STUDY.caseStudy.map((paragraph, index) => (
              <p key={index} className={GUIDE.body}>
                {t(paragraph, lang)}
              </p>
            ))}
          </div>

          <div className="max-w-[44rem]">
            <GuideFigure
              photoKey="beijinglu"
              alt={INLINE_PHOTOS.beijinglu.alt}
              lang={lang}
              className="mt-0"
            />
            <p className={GUIDE.body}>{t(RETAIL_STUDY.beijinglu, lang)}</p>
            <Sources sources={RETAIL_STUDY.sources} lang={lang} />
          </div>

          <DistrictRoute lang={lang} />
        </Section>

        <Section
          id="routes"
          title={UI.routes}
          hint={UI.guideHints.routes}
          lang={lang}
        >
          <RouteList lang={lang} />
        </Section>

        <Section
          id="phrases"
          title={UI.phrases}
          hint={UI.guideHints.phrases}
          lang={lang}
        >
          <div className="max-w-[44rem] space-y-3">
            {PHRASES.map((entry) => (
              <CopyChinese key={entry.id} entry={entry} lang={lang} showBig />
            ))}
          </div>
        </Section>

        <Section
          id="sources"
          title={UI.officialSources}
          hint={UI.guideHints.officialSources}
          lang={lang}
        >
          <ul className="max-w-[44rem] space-y-2.5">
            {OFFICIAL_LINKS.map((link) => (
              <li key={link.id}>
                <SourceLink label={link.title} url={link.url} lang={lang} />
                <p className={cn(GUIDE.note, "mt-0.5")}>{t(link.note, lang)}</p>
              </li>
            ))}
          </ul>
          {/* CC 授权的条件：作者与授权要列出来，授权名直接链到条款页。
              维基来源写作者与 CC；政府或官网的图只写来源页与提供方，不冒充 CC；
              用户自己给的原图没有来源页，就只写「用户提供」，不挂链接、不编一个出处。
              只列页面上真在用的那些 —— 仓里还留着弃用的旧素材，全表照搬会把它们
              端到客人面前。三份清单里只有 lib/selected-photos.ts 是手写的。 */}
          <SubHeading>{t(UI.imageCredits, lang)}</SubHeading>
          <ul className={cn(GUIDE.note, "max-w-[44rem] space-y-1")}>
            {shownCredits.map((credit) => (
              <li key={credit.key}>
                {credit.page ? (
                  <a
                    href={credit.page}
                    target="_blank"
                    rel="noreferrer"
                    className="font-medium text-navy underline underline-offset-4"
                  >
                    {credit.title}
                  </a>
                ) : (
                  <span className="font-medium text-navy">{credit.title}</span>
                )}
                {" — "}
                {credit.artist || "Wikimedia Commons"}
                {", "}
                {credit.licenseUrl ? (
                  <a
                    href={credit.licenseUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="underline underline-offset-4"
                  >
                    {credit.license}
                  </a>
                ) : (
                  credit.license
                )}
              </li>
            ))}
          </ul>
        </Section>
      </Accordion>
    </div>
  );
}
