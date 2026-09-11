"use client";
/* eslint-disable @next/next/no-img-element -- 静态站、离线可用、相对路径：故意用原生 <img>，不走 next/image 的加载器 */

import * as React from "react";

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
  HALAL_WHERE,
  JUMUAH_NOTE,
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
import { IMAGE_CREDITS, IMG } from "@/lib/image-credits";
import { UI, t } from "@/lib/trip-i18n";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { DINING_THEMES } from "@/lib/dining-brands";
import { DiningBrands } from "./dining-brands";
import { DistrictRoute } from "./district-route";
import { BaggageLines } from "./flight-details";
import { RouteList } from "./routes";
import { BulletList, CopyChinese, GUIDE, SourceLink } from "./ui";

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

/** 开篇那张全景，以及商圈末尾那张北京路 —— 数据里没有，写在这里。 */
const INLINE_IMAGE_KEYS = ["skyline", "beijinglu", "tianhenight"];

/**
 * 页面上真正显示过的图片。图片来源那一段只列这些：
 * `lib/image-credits.ts` 是脚本生成的完整资产清单（不手改），里面还留着弃用的素材。
 */
const USED_IMAGE_KEYS = new Set(
  [
    ...INLINE_IMAGE_KEYS,
    ...ROUTES.map((route) => route.imageKey),
    ...FOOD_NOTES.map((note) => note.imageKey),
    ...RETAIL_STUDY.malls.map((mall) => mall.imageKey),
    ...CITY_TECH.items.map((item) => item.imageKey),
    ...DINING_THEMES.flatMap((theme) => theme.brands).map((brand) => brand.imageKey),
  ].filter((key): key is string => Boolean(key && IMG[key])),
);

const shownCredits = IMAGE_CREDITS.filter((credit) =>
  USED_IMAGE_KEYS.has(credit.key),
);

/**
 * 开篇的一句欢迎。只在这份组件里，不进 lib/trip-data.ts —— 那里放的是事实。
 * 配的是珠江全景（skyline.jpg）；两段话没有新事实，
 * 光塔与蕃坊的完整故事和来源在「广州与你们」一章。
 */
const WELCOME = {
  title: {
    zh: "欢迎来到广州",
    en: "Welcome to Guangzhou",
    ar: "أهلًا بكم في قوانغتشو",
  },
  first: {
    zh: "很高兴在这里与你相见。广州与阿拉伯世界的联系，沿着海上贸易延续了许多个世纪。",
    en: "We are glad to meet you here. Guangzhou’s ties with the Arab world have followed the sea trade routes for many centuries.",
    ar: "يسعدنا لقاؤكم هنا. فصلة قوانغتشو بالعالم العربي امتدّت قرونًا طويلة على طول طرق التجارة البحرية.",
  },
  second: {
    zh: "会议之余，愿你有时间看看珠江夜景，走进老城街巷，慢慢发现属于自己的广州。",
    en: "Between the meetings, we hope you find time for the Pearl River at night, for the lanes of the old city, and for the Guangzhou you discover for yourself.",
    ar: "وبين جلسات المؤتمر، نتمنى أن تجدوا وقتًا لنهر اللؤلؤ ليلًا ولأزقة المدينة القديمة، ولقوانغتشو التي تكتشفونها بأنفسكم.",
  },
} satisfies Record<string, L10n>;

/**
 * 一段要被「读」的文字：一句开头、几段正文、来源。
 * 指南里几处用它 —— 广州与你们、你们住的这块地、食在广州。
 *
 * 正文限宽 44rem：屏幕再宽也只是行数变少，不是字变大、也不是一行拉到底。
 */
function Prose({
  lead,
  paragraphs,
  sources,
  lang,
  photo,
  children,
}: {
  lead: L10n;
  paragraphs: L10n[];
  sources: { label: L10n; url: string }[];
  lang: Lang;
  /** 顶上压一张满宽照片（public/images 的 key）。 */
  photo?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="max-w-[44rem]">
      {photo && IMG[photo] ? (
        <img
          src={IMG[photo]}
          alt=""
          loading="lazy"
          className="trip-photo mb-4 aspect-[16/9] w-full object-cover"
        />
      ) : null}
      <p className={GUIDE.lead}>{t(lead, lang)}</p>
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

/** 一家商场：名字、一句定位、一段边走边看的事实；有图就配一张小图。 */
function MallRow({ mall, lang }: { mall: MallCard; lang: Lang }) {
  return (
    <li className="flex gap-3 border-t border-card-line py-3">
      {mall.imageKey && IMG[mall.imageKey] ? (
        <img
          src={IMG[mall.imageKey]}
          alt=""
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
            alt=""
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

      {/* 欢迎之后紧接着出发前准备 —— 出发前最先要读的就是它，不被酒店块挡住。 */}
      <Accordion type="multiple" defaultValue={[]} className="space-y-2.5">
        <Section id="prep" title={UI.prep} hint={UI.guideHints.prep} lang={lang}>
          {/* 一件事一个小标题，下面直接是原来的说明 ——
              展开这一章就能从支付一路读到天气，不用再逐条点开。 */}
          <div className="max-w-[44rem] space-y-4">
            {prep.map((item) => (
              <div key={item.id}>
                <h3 className={GUIDE.subheading}>{t(item.title, lang)}</h3>
                <BulletList items={item.lines} lang={lang} className="mt-1.5" />
              </div>
            ))}
            <SourceLink
              label={{
                zh: "来华出行与支付指引",
                en: "Official travel and payment guide",
                ar: "الدليل الرسمي للتنقل والدفع",
              }}
              url="https://english.www.gov.cn/2025special/bizexpatsinchina2025"
              lang={lang}
            />
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
      </section>

      {/*
        其余章节按一次旅行读下来的顺序：先到（机场地址）、住在哪一片（琶洲）、
        这座城是什么（广州与你们 / 体量 / 科技）、日常要用的（礼拜与清真餐 / 吃 / 逛 /
        路线 / 习惯），最后是备查的（短句 / 行李 / 来源）。
      */}
      <Accordion type="multiple" defaultValue={[]} className="space-y-2.5">
        <Section
          id="addresses"
          title={{ zh: "机场中文地址", en: "Airport addresses", ar: "عناوين المطار" }}
          hint={{ zh: "白云机场 T2 / T3，按航班选择", en: "Baiyun T2 / T3 — choose your flight’s terminal", ar: "بايون T2 / T3 — اختاري صالة رحلتك" }}
          lang={lang}
        >
          <div className="max-w-[44rem] space-y-3">
            {COPY_ADDRESSES.filter((entry) => entry.id !== "hotel").map((entry) => (
              <CopyChinese key={entry.id} entry={entry} lang={lang} showBig />
            ))}
          </div>
        </Section>

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
          />
        </Section>

        <Section id="story" title={UI.cityStory} hint={CITY_STORY.lead} lang={lang}>
          <Prose
            lead={CITY_STORY.lead}
            paragraphs={CITY_STORY.paragraphs}
            sources={CITY_STORY.sources}
            lang={lang}
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

        {/* 配图只用真在中国、最好在广州拍的：广汽的 Robotaxi（粤A 牌）、扫码付款、
            广汽 Aion 黄的。载人无人机那张是西班牙警用涂装、送餐机器人那张拍于日本千叶，
            都不能当中国实景 —— 那两条宁可不配图。
            （上一版挂的 robotaxi.jpg 拍的是阿布扎比，已换成广汽那张。） */}
        <Section id="tech" title={UI.cityTech} hint={UI.guideHints.tech} lang={lang}>
          <Prose
            lead={CITY_TECH.lead}
            paragraphs={[CITY_TECH.intro]}
            sources={CITY_TECH.sources}
            lang={lang}
          >
            <ul className="mt-4 grid gap-x-5 md:grid-cols-2">
              {CITY_TECH.items.map((item) => (
                <li key={item.id} className="border-t border-card-line py-3">
                  {item.imageKey && IMG[item.imageKey] ? (
                    <img
                      src={IMG[item.imageKey]}
                      alt=""
                      loading="lazy"
                      className="trip-photo mb-2.5 aspect-[16/10] w-full object-cover"
                    />
                  ) : null}
                  <h4 className={GUIDE.subheading}>{t(item.title, lang)}</h4>
                  <p className={cn(GUIDE.note, "mt-0.5 text-navy-soft/85")}>
                    {t(UI.techWhere, lang)}：{t(item.where, lang)}
                  </p>
                  {/* 正文按空行分段：先给一个看得见的画面，再让数字落下来当回响。
                      一段连着写，两个节拍就糊成一句话了。 */}
                  {t(item.body, lang)
                    .split("\n")
                    .map((paragraph, index) => (
                      <p key={index} className={cn(GUIDE.body, "mt-1")}>
                        {paragraph}
                      </p>
                    ))}
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
          <div className="max-w-[44rem]">
            <BulletList items={HALAL_WHERE} lang={lang} />
          </div>

          <SubHeading>{t(UI.mosques, lang)}</SubHeading>
          {MOSQUES.map((place) => (
            <PlaceCardView key={place.id} place={place} lang={lang} />
          ))}
          <p className={cn(GUIDE.body, "trip-card-accent max-w-[44rem] p-3 text-navy")}>
            <span className="font-semibold">{t(UI.jumuah, lang)}：</span>
            {t(JUMUAH_NOTE, lang)}
          </p>

          <SubHeading>{t(UI.halalDining, lang)}</SubHeading>
          {HALAL_DINING.map((place) => (
            <PlaceCardView key={place.id} place={place} lang={lang} />
          ))}
        </Section>

        <Section
          id="food"
          title={UI.foodCulture}
          hint={UI.guideHints.foodCulture}
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
            */}
            <Sources sources={FOOD_CULTURE.sources} lang={lang} />
          </div>

          <SubHeading>{t(UI.foodIdeas, lang)}</SubHeading>
          <div className="grid gap-x-5 md:grid-cols-2">
            {FOOD_NOTES.map((note) => (
              <article
                key={note.id}
                className="border-t border-card-line py-3"
              >
                {note.imageKey && IMG[note.imageKey] ? (
                  <img
                    src={IMG[note.imageKey]}
                    alt=""
                    loading="lazy"
                    className="trip-photo mb-2 aspect-[4/3] w-full object-cover"
                  />
                ) : null}
                <h4 className={GUIDE.subheading}>{t(note.title, lang)}</h4>
                <p className={cn(GUIDE.body, "mt-1")}>{t(note.body, lang)}</p>
                {note.url ? (
                  <div className="mt-1.5">
                    <SourceLink
                      label={{
                        zh: "来源",
                        en: "Source",
                        ar: "المصدر",
                      }}
                      url={note.url}
                      lang={lang}
                    />
                  </div>
                ) : null}
              </article>
            ))}
          </div>

          <SubHeading>{t(UI.diningBrands, lang)}</SubHeading>
          <DiningBrands lang={lang} />
        </Section>

        <Section
          id="retail"
          title={UI.retail}
          hint={UI.guideHints.retail}
          lang={lang}
        >
          <DistrictRoute lang={lang} />

          <div className="max-w-[44rem]">
            {/* 天河路夜景航拍：这一节讲的是「一条路上十四家商场」，
                一张俯瞰比两百字描述管用。 */}
            {IMG.tianhenight ? (
              <img
                src={IMG.tianhenight}
                alt=""
                loading="lazy"
                className="trip-photo mb-3 aspect-[16/9] w-full object-cover"
              />
            ) : null}
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
            {IMG.beijinglu ? (
              <img
                src={IMG.beijinglu}
                alt=""
                loading="lazy"
                className="trip-photo mb-2.5 aspect-[16/9] w-full object-cover"
              />
            ) : null}
            <p className={GUIDE.body}>{t(RETAIL_STUDY.beijinglu, lang)}</p>
            <Sources sources={RETAIL_STUDY.sources} lang={lang} />
          </div>
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
          id="culture"
          title={UI.culture}
          hint={UI.guideHints.culture}
          lang={lang}
        >
          <ul className="max-w-[44rem]">
            {CULTURE_NOTES.map((note) => (
              <li key={note.id} className="border-t border-card-line py-3">
                <h4 className={GUIDE.subheading}>{t(note.title, lang)}</h4>
                <p className={cn(GUIDE.body, "mt-1")}>{t(note.body, lang)}</p>
              </li>
            ))}
          </ul>
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
          id="baggage"
          title={UI.baggage}
          hint={UI.guideHints.baggage}
          lang={lang}
        >
          <div className="max-w-[44rem] space-y-4">
            <BaggageLines profile="sichuanEconomy" lang={lang} />
            <div className="border-t border-card-line pt-4">
              <BaggageLines profile="egyptairBusiness" lang={lang} />
            </div>
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
          {/* CC 授权的条件：作者与授权要列出来。只列页面上真在用的那些 ——
              仓里还留着弃用的旧素材（水印图、日本的机器人、阿布扎比那张），
              全表照搬会把它们端到客人面前。授权清单文件本身不动。 */}
          <SubHeading>{t(UI.imageCredits, lang)}</SubHeading>
          <ul className={cn(GUIDE.note, "max-w-[44rem] space-y-1")}>
            {shownCredits.map((credit) => (
              <li key={credit.key}>
                <a
                  href={credit.page}
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium text-navy underline underline-offset-4"
                >
                  {credit.title}
                </a>
                {" — "}
                {credit.artist || "Wikimedia Commons"}, {credit.license}
              </li>
            ))}
          </ul>
        </Section>
      </Accordion>
    </div>
  );
}
