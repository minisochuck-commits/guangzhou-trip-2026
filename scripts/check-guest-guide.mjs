import assert from 'node:assert/strict';
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
import ts from 'typescript';

const evaluate = async (source) => import('data:text/javascript;base64,' + Buffer.from(ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText).toString('base64'));
const data = await evaluate(fs.readFileSync('lib/trip-data.ts', 'utf8'));
const original = await evaluate(execFileSync('git', ['show', '83193d0:lib/trip-data.ts'], { encoding: 'utf8' }));
const prepFor = (person) => data.PREP.filter((item) => !item.audience || person === null || item.audience.includes(person));
for (const person of ['reham', 'rahma', 'qiuting', 'ahmed', 'hassan']) {
  const ids = prepFor(person).map((item) => item.id);
  for (const id of ['taxi', 'maps', 'essentials', 'weather']) assert(ids.includes(id), `${person} missing ${id}`);
  const team = ['ahmed', 'hassan'].includes(person);
  assert(ids.includes(team ? 'team-payment' : 'payment'));
  assert(ids.includes(team ? 'team-internet' : 'guest-internet'));
  assert(!ids.includes(team ? 'guest-internet' : 'team-internet'), 'Borrowed SIM must not leak to guest instructions');
  assert(!ids.includes(team ? 'payment' : 'team-payment'), 'Spending funds must stay scoped');
}
const checkLocales = (value) => {
  if (!value || typeof value !== 'object') return;
  if ('zh' in value) for (const lang of ['zh', 'en', 'ar']) assert(typeof value[lang] === 'string' && value[lang].trim(), `Missing ${lang}`);
  for (const v of Object.values(value)) checkLocales(v);
};
for (const key of [
  'PREP', 'CITY_STORY', 'CITY_SCALE', 'CITY_TECH', 'PAZHOU', 'RETAIL_STUDY',
  'FOOD_CULTURE', 'FOOD_NOTES', 'MOSQUES', 'ROUTES', 'CULTURE_NOTES',
  'HALAL_WHERE', 'HALAL_DINING', 'JUMUAH_NOTE', 'OFFICIAL_LINKS', 'PHRASES',
  'MINISO_IN_GZ',
]) checkLocales(data[key]);
// Routes are guest-facing copy too: the rejected wording must not survive there either.
const copy = JSON.stringify([
  data.CITY_STORY, data.CITY_SCALE, data.CITY_TECH, data.RETAIL_STUDY, data.FOOD_CULTURE,
  data.FOOD_NOTES, data.ROUTES, data.CULTURE_NOTES, data.PAZHOU, data.HALAL_WHERE, data.MOSQUES,
  data.MINISO_IN_GZ,
]);
for (const rejected of [
  '值得写进报告', '给做商场的人', '做商场的人', '超过埃及全国', '全球至今只有六',
  '都是广东公司', '没有一件货重叠', '粉红才算到位',
  // Guesses about why an operator positioned a mall the way it did, and price/space
  // claims nobody can check on the street.
  '有意错开', '最低', '没人用',
  // Rankings and headline statistics belong to the sources, not to a walking route.
  '第一商圈', '十四家', '世界第二高', '五十二家老字号', '中轴线从来没挪过',
  // Drive times nobody checked: the page tells guests to look at the map instead.
  '过江即到', '打车很近', '短车程', '开车一小时',
  // 2026-09-12: speaking for other people's feelings. The guide describes what to do,
  // never what a stranger is thinking.
  '没有人会介意', '没人会介意', '不会觉得失礼', '不是打探', '不是敌意', '没人会追问',
  '多数人不懂', '很多人不懂', '不用等回音',
  // Numbers and promises that were removed for want of a source.
  '三十二万吨', '二十分钟后上桌', '正宗的做法来自',
  // Disclaimers that turned the page into a legal notice.
  '不代替酒店承诺', '未核实，以官方当日公告为准',
  // 2026-09-12 second pass: the rewrite must not swap old disclaimers for new hype.
  '就够记一辈子', '两秒钟', '不会记错', '不用斯文', '一鸽胜九鸡',
  '比任何景点都快', '没有游客', '最舒服', '最方便', '几步就能走完',
  '周末满是', '一路不淋雨', '大家出门不带钱包',
  // The ancient roadway is looked at through the glass, never walked on.
  '站在罩子上', '踩在上面走', '脚下几米', 'on the glass', 'underfoot',
  // Cooking instructions nobody can be held to.
  '几秒钟', '刚刚断生', '差一点就老',
  /*
   * 2026-09-12, the owner's verification pass. Each of these was wrong on the facts,
   * not merely clumsy:
   *   the GXR has no front passenger seat, so "the two seats in front" cannot stay empty;
   *   the operator certificate goes to an operating company, never to an aircraft;
   *   the Pazhou drone flights in the Haizhu report are not Meituan's;
   *   nobody can promise every car hailed will be electric, or six lanes outside a hotel;
   *   the hotel and the Canton Tower are both in Haizhu — the tower is not "across the water";
   *   siu mai is usually pork, so no dim sum order is one that "can hardly go wrong".
   */
  /*
   * 25–27 September 2026 is the Mid-Autumn holiday and Reham is in Guangzhou for it, so
   * "Friday is an ordinary working day" is wrong for this trip. The culture chapter says
   * so with the State Council holiday schedule behind it.
   */
  '周五照常上班', '周五和平常一样上班', 'Friday is a working day', 'Friday runs like any other',
  '两个座位，都是空的', '前面那两个座位', 'seats in front stay empty',
  '拿到运营合格证之后', 'received its operator certificate',
  '美团', 'Meituan',
  '几乎每一辆都是电动', '六车道', '江对岸那一座',
  '几乎不会错', 'rarely go wrong', '一个人吃半只',
]) assert(!copy.includes(rejected), `Rejected wording: ${rejected}`);

/*
 * Photographs must show what the text is talking about. These files stay in the repo
 * with their credits, but none of them may illustrate this guide again:
 *   pigeon.jpg  a boned squab plated in a French restaurant, not Cantonese crisp squab
 *   soup.jpg    pig lung and almond soup — not for these guests, beside slow-fired soup
 *   robot.jpg   a delivery robot in Chiba, Japan
 *   robotaxi.jpg Ferrari World, Abu Dhabi, Arabic road signs and all
 *   cbd.jpg / tianhe.jpg  watermarked, and unrecognisable as a place
 */
const imageKeysInUse = new Set([
  ...data.ROUTES.map((route) => route.imageKey),
  ...data.FOOD_NOTES.map((note) => note.imageKey),
  ...data.RETAIL_STUDY.malls.map((mall) => mall.imageKey),
  ...data.CITY_TECH.items.map((item) => item.imageKey),
].filter(Boolean));
for (const dropped of ['pigeon', 'soup', 'robot', 'robotaxi', 'cbd', 'tianhe']) {
  assert(!imageKeysInUse.has(dropped), `${dropped}.jpg does not show what the text describes`);
}
// The credits list follows the pictures actually on the page, so the retired files do not
// arrive in front of the guest through the credits instead. (`view` is read further down.)
const guideView = fs.readFileSync('components/trip/guide-tab.tsx', 'utf8');
assert(guideView.includes('USED_IMAGE_KEYS'), 'Image credits must be filtered to the images in use');
for (const printsEverything of ['IMAGE_CREDITS.map', 'PHOTO_CREDITS.map']) {
  assert(!guideView.includes(printsEverything), 'The full asset list must not be printed to the reader');
}

/*
 * 2026-09-12 second batch: the owner checked seven photographs one by one and they come
 * with their own three-language alt and caption (lib/guide-photos.ts, written by
 * scripts/build-guide-photos.mjs from scripts/guide-photos.json — neither is hand-edited).
 * Credit has to be honest about where a file comes from: a Wikimedia file carries its
 * author and a link to the licence; a photo taken from a government or company site is
 * credited to that page and must not be dressed up as CC.
 */
const { GUIDE_PHOTOS } = await evaluate(fs.readFileSync('lib/guide-photos.ts', 'utf8'));
const photoByKey = new Map(GUIDE_PHOTOS.map((photo) => [photo.key, photo]));
for (const photo of GUIDE_PHOTOS) {
  for (const field of ['alt', 'caption']) {
    for (const lang of ['zh', 'en', 'ar']) {
      assert(photo[field][lang]?.trim(), `${photo.key}: missing ${lang} ${field}`);
    }
  }
  assert(/^https?:\/\//.test(photo.page), `${photo.key} needs the page it came from`);
  assert(photo.artist.trim(), `${photo.key} needs the photographer or the provider`);
  assert(fs.existsSync(`public/${photo.file}`), `${photo.key}: the file is missing`);
  assert(Math.max(photo.width, photo.height) <= 1400, `${photo.key} is larger than 1400px`);
  if (photo.source === 'wikimedia') {
    assert(/^https:\/\/creativecommons\.org\//.test(photo.licenseUrl ?? ''), `${photo.key} must link its CC licence`);
    assert(photo.page.includes('commons.wikimedia.org'), `${photo.key} claims Wikimedia but does not link it`);
  } else {
    assert(!photo.licenseUrl, `${photo.key} comes from a source page — it must not claim a CC licence`);
    assert(!/creative ?commons|CC BY|CC0/i.test(photo.license), `${photo.key} must not be dressed up as CC`);
  }
}
// The pictures that carry a place: the city chapters, the tomb, Parc Central, and the
// three technology items the owner verified.
for (const [key, where] of [
  ['pazhou-pagoda', guideView],
  ['huaisheng-minaret', guideView],
]) assert(where.includes(key), `The verified photograph ${key} is not on the page`);
assert(data.MOSQUES[0].photoKey === 'xianxian-gate', 'The first mosque card carries the tomb gateway photo');
assert(data.RETAIL_STUDY.malls.some((mall) => mall.photoKey === 'parc-garden'), 'Parc Central carries the aerial of its garden');
const techPhotos = Object.fromEntries(data.CITY_TECH.items.map((item) => [item.id, item.imageKey]));
assert.equal(techPhotos.robotaxi, 'gxr-guangzhou', 'The driverless ride shows the GXR photographed in Guangzhou');
assert.equal(techPhotos.robot, 'hotel-lift-robot', 'The delivery robot shows the lift photo');
assert.equal(techPhotos['drone-delivery'], 'pazhou-drone', 'The drone item shows the Pazhou flight, not a photo from another city');

/*
 * Every photograph says what it shows, in all three languages. An empty alt tells a
 * screen reader "skip this", which is right for decoration and wrong for a picture of
 * the dish the paragraph is about. The text lives next to the key it describes: in the
 * data entry for the first batch, in the photo record for the second.
 */
const withPhotos = [
  ...data.ROUTES,
  ...data.FOOD_NOTES,
  ...data.RETAIL_STUDY.malls,
  ...data.CITY_TECH.items,
];
for (const item of withPhotos) {
  if (!item.imageKey) continue;
  const alt = item.imageAlt ?? photoByKey.get(item.imageKey)?.alt;
  assert(alt, `${item.id}: the photograph needs three-language alt text`);
  for (const lang of ['zh', 'en', 'ar']) {
    assert(alt[lang]?.trim(), `${item.id}: missing ${lang} alt text`);
  }
}
/*
 * The shared Figure is the reason a tower keeps its tip: it bounds the height and lets
 * the picture keep its own proportions, instead of cropping to a fixed ratio.
 */
const uiView = fs.readFileSync('components/trip/ui.tsx', 'utf8');
const figure = uiView.slice(uiView.indexOf('export function Figure'), uiView.indexOf('export function Ltr'));
assert(figure.includes('max-h-[15rem]'), 'A photograph is about 240px tall on a phone');
assert(!figure.includes('object-cover'), 'Figure must never crop a photograph to fit');
assert(!/aspect-\[/.test(figure), 'Figure keeps the natural proportions of the file');

/*
 * Eleven dishes each carrying their own red "source" link is eleven interruptions. The
 * links all survive, folded into one list at the end of the dish section; the brands keep
 * their own "where the dishes come from" fold.
 */
assert(guideView.includes('foodSources'), 'The dish sources are folded into one list');
assert(!/zh: "来源"/.test(guideView), 'No per-dish source link is left hanging off a paragraph');
for (const note of data.FOOD_NOTES) {
  if (!note.url) continue;
  assert(/^https?:\/\//.test(note.url), `${note.id}: the source link must still be reachable`);
}

for (const file of ['guide-tab', 'routes', 'dining-brands']) {
  const source = fs.readFileSync(`components/trip/${file}.tsx`, 'utf8');
  assert(!source.includes('alt=""'), `${file}.tsx: a photograph shipped with an empty alt`);
}

/*
 * 2026-09-12, owner: eleven dishes must not be eleven identical full-width picture
 * blocks. Three or four carry a photograph worth stopping at; the rest are compact.
 */
/*
 * The Mid-Autumn holiday falls inside this trip (25–27 September 2026). A claim about
 * public holidays has to carry the notice it comes from, and the links sit folded at the
 * end of the chapter like every other source in the guide.
 */
const midAutumn = data.CULTURE_NOTES.find((note) => note.id === 'mid-autumn');
assert(midAutumn, 'The culture chapter tells her the week falls on Mid-Autumn');
assert(midAutumn.sources?.length >= 1, 'The holiday dates carry the notice they come from');
assert(JSON.stringify(midAutumn.sources).includes('beijing.gov.cn'), 'The State Council holiday schedule is cited');
assert(guideView.includes('cultureSources'), 'Culture sources are folded in at the end of the chapter');
assert.equal(data.CULTURE_NOTES.length, 9, `The culture chapter keeps nine notes, found ${data.CULTURE_NOTES.length}`);

const heroes = data.FOOD_NOTES.filter((note) => note.hero);
assert(heroes.length >= 3 && heroes.length <= 4, `Three or four hero dishes, found ${heroes.length}`);
assert(guideView.includes('note.hero'), 'The food chapter must render heroes and compact rows differently');
for (const hero of heroes) assert(hero.imageKey, `${hero.id} is a hero dish and needs its photograph`);

/*
 * 2026-09-12: the guide was rewritten to be readable. These are the load-bearing pieces
 * of that rewrite — a later edit may improve the prose, but must not quietly drop them.
 */
for (const [key, needle, why] of [
  ['PAZHOU', '1597', 'Pazhou opens with the pagoda that guided ships in'],
  ['CITY_STORY', '蕃坊', 'The city story tells the Fanfang quarter, not a vague "centuries of ties"'],
  ['CITY_TECH', 'WeRide Go', 'The driverless ride says how to actually book one'],
  ['CITY_SCALE', '23 万', 'The airport figure is tied to something you can picture'],
]) assert(JSON.stringify(data[key]).includes(needle), why);
// The new sources must travel with the new stories.
const allSources = JSON.stringify([data.PAZHOU.sources, data.CITY_STORY.sources, data.CITY_TECH.sources, data.CITY_SCALE.sources, data.ROUTES]);
for (const url of [
  'gz.gov.cn/zlgz/whgz/content/post_8091106.html',
  'gz.gov.cn/zwgk/fggw/szfwj/content/post_10640740.html',
  'gwj.gz.gov.cn/ghzt/gkwh/content/post_10949653.html',
  'tjj.gz.gov.cn/zzfwzq/tjkx/content/post_10804061.html',
  'ir.weride.ai/news-releases',
  'zaha-hadid.com',
  // 2026-09-12 verification pass: each of these carries a fact the text now states.
  'weride.ai/posts/', // the GXR product page — no front passenger seat
  'haizhu.gov.cn', // the Pazhou low-altitude delivery report of 5 February 2026
  'ehang.com/cn/news/1195', // the operator certificates went to operating companies
]) assert(allSources.includes(url), `Missing the source behind a new story: ${url}`);
// This edit must not silently change travellers, flights, baggage or hotel facts.
for (const key of Object.keys(original)) {
  if (/FLIGHT|BAGGAGE|PEOPLE|INTERCONTINENTAL/.test(key)) assert.deepEqual(data[key], original[key], `${key} changed`);
}
const view = fs.readFileSync('components/trip/guide-tab.tsx', 'utf8');
assert(view.includes('defaultValue={[]}'), 'Long stories must start collapsed');
assert(!view.includes('UI.retailTakeaways'), 'Report instructions must not be rendered');
for (const reused of ['AccordionItem', 'CopyChinese', 'SourceLink']) assert(view.includes(reused), `Must reuse ${reused}`);

/*
 * 2026-09-12, the owner: the welcome is followed by the four chapters that say what
 * this city is — Guangzhou and you, how big it is, the technology around you, MINISO
 * in Guangzhou — and then Pazhou, which hands over to the hotel block standing on it.
 * Only after that comes the administration: preparation, the hotel, the addresses.
 * Whoever opens the link for the first time should meet the city, not a to-do list.
 * This replaces the 2026-09-11 order, which put preparation and the hotel first.
 */
const at = (needle) => {
  const index = view.indexOf(needle);
  assert(index > -1, `Missing from the guide: ${needle}`);
  return index;
};
const CHAPTERS = [
  'guide-welcome', 'story', 'scale', 'tech', 'miniso', 'pazhou',
  'prep', 'guide-hotel', 'addresses', 'halal',
  'food', 'retail', 'routes', 'culture', 'phrases', 'baggage', 'sources',
];
let previous = -1;
for (const id of CHAPTERS) {
  const here = at(`id="${id}"`);
  assert(here > previous, `Chapter out of the agreed reading order: ${id}`);
  previous = here;
}
assert(at('id="story"') < at('id="prep"'), 'The city comes before the paperwork');
assert(at('id="pazhou"') < at('id="guide-hotel"'), 'Pazhou hands over to the hotel standing on it');

/*
 * The welcome itself: always visible, no button, and it carries the bright Pearl River
 * skyline at its natural 1200x492 — the owner replaced the Huaisheng eaves photo, which
 * a full-width band cropped down to a strip of roof. No forced height, no crop.
 * Whichever photo opens the guide must not appear again further down.
 */
const welcomeStart = at('aria-labelledby="guide-welcome"');
const welcome = view.slice(welcomeStart, view.indexOf('</section>', welcomeStart));
assert(welcome.includes('IMG.skyline'), 'The welcome carries the skyline photo');
assert(!welcome.includes('IMG.huaisheng'), 'The Huaisheng eaves photo was replaced on the welcome');
assert(!/object-cover|aspect-\[|h-\[\d/.test(welcome), 'The welcome photo keeps its natural proportions');
assert(!/Accordion|button|Trigger/.test(welcome), 'The welcome is plain and always open');
for (const repeated of ['photo="skyline"', 'photo="huaisheng"']) {
  assert(!view.includes(repeated), `The welcome photo must not be repeated in a chapter: ${repeated}`);
}
/*
 * 名创优品那一章的分寸：会议现场讲货盘、店型和企业实力，页面不重复。页面只留
 * 两件会议讲不了的事 —— 她住的琶洲就是中国总部所在地，她要去的正佳广场里有
 * 一家可以自己走进去的 MINISO LAND。每个数字都要有出处；没出处的说法（早先那版
 * 的「海外同比增长 29.3%」「近万人排队」）已经删掉，不许回来。
 */
const miniso = JSON.stringify(data.MINISO_IN_GZ);
for (const needed of ['琶洲大道 109 号', '8,151', '正佳广场', 'MINISO LAND']) {
  assert(miniso.includes(needed), `The MINISO chapter lost a checked fact: ${needed}`);
}
for (const unsourced of ['29.3', '近万人', '万人排队']) {
  assert(!miniso.includes(unsourced), `No source was ever found for this: ${unsourced}`);
}
for (const url of [
  'https://www.miniso.cn/contact/',
  'https://xxsb.gz-cmc.com/pages/2026/01/30/afa451fb749c44af8dcef00ce3abdf5a.html',
]) assert(miniso.includes(url), `The MINISO chapter must keep its source: ${url}`);
assert(view.includes('MINISO_IN_GZ.paragraphs'), 'The MINISO chapter is rendered, not just written');

for (const kept of ['CITY_STORY.paragraphs', 'CITY_STORY.sources', 'CITY_SCALE.intro', 'CITY_SCALE.sources']) {
  assert(view.includes(kept), `The chapter text and sources stay: ${kept}`);
}

// The guide reads as one column of chapters. The owner rejected the grouped
// "travel essentials / getting to know Guangzhou" toolbox and the tickable preparation
// list on sight, so nothing may bring either back.
for (const banned of ['SectionGroup', 'guideGroups', 'PrepChecklist', 'prep-checklist', 'Checkbox', 'prepCountLabel']) {
  assert(!view.includes(banned), `The guide must stay a plain reading list, not ${banned}`);
}
assert(!fs.existsSync('components/trip/prep-checklist.tsx'), 'The tick-box checklist is gone, not parked');
assert(!fs.existsSync('lib/prep-checklist.ts'), 'The checklist storage logic is gone, not parked');
const i18n = fs.readFileSync('lib/trip-i18n.ts', 'utf8');
for (const banned of ['guideGroups', 'prepChecklist', 'prepCountLabel']) {
  assert(!i18n.includes(banned), `Retired interface copy must go too: ${banned}`);
}
/*
 * The number of brands in the collapsed hint comes from the data. It was typed out as 21
 * and stayed 21 after the list was cut to 14 — the first number a guest reads was wrong.
 */
const { UI } = await evaluate(i18n);
for (const lang of ['zh', 'en', 'ar']) {
  assert(UI.guideHints.foodCulture[lang].includes('{n}'), `The ${lang} food hint counts the brands from the data`);
}
assert(view.includes('DINING_BRANDS.length'), 'The chapter hint fills that count in from the brand list');
// Preparation is read, not ticked: every traveller's own PREP text is rendered in full.
assert(/PREP\.filter/.test(view), 'Preparation must render the per-person PREP text');
assert(view.includes('items={item.lines}'), 'Preparation must show the full instructions, not a summary');

// Typography: an introduction, not a poster. The shared GUIDE scale is the only place
// that sets guide sizes, and nothing may go back to the rejected oversized type.
const ui = fs.readFileSync('components/trip/ui.tsx', 'utf8');
assert(/export const GUIDE/.test(ui), 'One shared type scale, not a size on every paragraph');
assert(ui.includes('text-[0.9375rem]'), 'Guide body text is 15px');
assert(!/!important/.test(ui + view), 'Sizes come from the shared scale, not from !important');
for (const oversized of ['text-[1.375rem]', 'text-[1.625rem]', 'text-[1.5rem]', 'md:text-xl', 'md:text-2xl']) {
  assert(!view.includes(oversized), `Rejected oversized guide type: ${oversized}`);
}
const table = fs.readFileSync('components/trip/day-tab.tsx', 'utf8');
assert(!table.includes('md:text-base'), 'The table must not grow to 16px on desktop');
assert(!table.includes('text-xl'), 'The day number was pulled back from 20px');

// Route photos: the watermarked and the unrecognisable one stay unused, and a portrait
// photo is fitted rather than cropped. Collapsed rows are a name and a length only.
const routes = fs.readFileSync('components/trip/routes.tsx', 'utf8');
assert(routes.includes('object-contain'), 'Portrait route photos must not be cropped to the waist');
const collapsedRow = routes.slice(routes.indexOf('<AccordionTrigger'), routes.indexOf('<AccordionContent'));
assert(!collapsedRow.includes('<img'), 'Route photos belong in the opened route, not in the collapsed row');
assert(!collapsedRow.includes('bestFor'), 'The collapsed row is a name and a length, nothing else');
assert(!routes.includes('line-clamp'), 'A clamped teaser in the collapsed row was rejected');
const usedImages = new Set(data.ROUTES.map((route) => route.imageKey));
for (const dropped of ['cbd', 'tianhe']) assert(!usedImages.has(dropped), `${dropped}.jpg was rejected on sight`);
for (const kept of ['opera', 'taikoo']) assert(usedImages.has(kept), `${kept}.jpg should carry a route`);

/*
 * Dining brands: 14 brands, a brand appearing once however many branches it runs.
 * They are recommendations of a *brand*, so no branch address, phone or opening hours,
 * no "we ate here", no score, and nothing claiming a restaurant is halal — the guest
 * asks at the door, and the section says so exactly once.
 */
const dining = await evaluate(fs.readFileSync('lib/dining-brands.ts', 'utf8'));
const brands = dining.DINING_BRANDS;
/*
 * 2026-09-12, owner: cut 21 down to two or three per cuisine. His words: what Reham
 * gets is "I picked for you", not "choose your own from twenty-one". Seven brands were
 * dropped (Xiao Bingsheng, Yue Chen Ji, Shi Shi Jiu, Mango Tree, Da Tou Xia, Mo Da,
 * Sushiro); every remaining brand carries a photograph of the dish it is known for.
 */
assert.equal(brands.length, 14, `Expected 14 brands, found ${brands.length}`);
assert.equal(
  dining.DINING_THEMES.reduce((sum, theme) => sum + theme.brands.length, 0),
  14,
  'Every brand belongs to exactly one theme',
);
for (const theme of dining.DINING_THEMES) {
  assert(theme.brands.length >= 2 && theme.brands.length <= 3, `${theme.id}: two or three brands, found ${theme.brands.length}`);
}
/*
 * 2026-09-12, second pass: one photograph per theme, not one per brand. Fourteen
 * full-width dish photos turned the section into a corridor, and a stock photo of the
 * dish sitting directly under a brand name reads as a photograph of that brand's
 * kitchen — which none of them is. The theme photo is captioned as an example instead.
 */
for (const brand of brands) {
  assert(!brand.imageKey, `${brand.id}: photographs belong to the theme, not to each brand`);
}
const themePhotos = dining.DINING_THEMES.filter((theme) => theme.imageKey);
assert(themePhotos.length >= 4, `Most themes carry a dish photo, found ${themePhotos.length}`);
for (const theme of themePhotos) {
  assert(theme.imageAlt, `${theme.id}: the theme photo needs three-language alt text`);
}
assert(
  !dining.DINING_THEMES.some((theme) => theme.imageKey === 'bubbletea'),
  'bubbletea.jpg is a Mixue cup — it cannot stand in for A-Ma or HEYTEA',
);
for (const key of ['DINING_THEMES', 'DINING_INTRO']) checkLocales(dining[key]);
const brandIds = brands.map((brand) => brand.id);
assert.equal(new Set(brandIds).size, brandIds.length, 'Brand ids must be unique');
const chineseNames = brands.map((brand) => brand.chinese);
assert.equal(new Set(chineseNames).size, chineseNames.length, 'One row per brand, not one per branch');
assert(!chineseNames.some((name) => name.includes('芒果树')), 'Mango Tree was cut in the 2026-09-12 trim');
for (const brand of brands) {
  assert(brand.chinese.trim(), `${brand.id} needs a Chinese name to copy`);
  assert(/^https?:\/\//.test(brand.source), `${brand.id} needs a source link`);
  const budget = Array.isArray(brand.budget) ? brand.budget : [brand.budget];
  assert(budget.every((value) => typeof value === 'number' && value > 0), `${brand.id} needs a per-person figure`);
  // A brand, not a branch: no address, no phone, no opening hours.
  const text = JSON.stringify([brand.name, brand.note, brand.dishes]);
  assert(!/\d+号|电话|营业时间|分店地址|[东南西北]路/.test(text), `${brand.id} must not pin a branch`);
}
// No personal endorsement, no score, no superlative, no halal claim.
const diningCopy = JSON.stringify(dining.DINING_THEMES);
for (const banned of ['Chuck', '吃过', '评分', '星级', '最好吃', '全广州最', '保证正宗', '每桌必点', '本店清真', '清真认证']) {
  assert(!diningCopy.includes(banned), `Rejected dining wording: ${banned}`);
}
// Pork and alcohol stay off the recommendation list.
for (const banned of ['猪', '培根', '火腿', '叉烧', '啤酒', '清酒', '红酒']) {
  assert(!diningCopy.includes(banned), `Dish list must not recommend: ${banned}`);
}
// Tao Tao Ju: the PDF was hard to search for the egg tart, so the source is the menu
// page that lists both dishes by name.
const taotaoju = brands.find((brand) => brand.id === 'taotaoju');
assert(taotaoju.source.includes('you.ctrip.com'), 'Tao Tao Ju cites the menu page, not the PDF');
assert(!JSON.stringify(brands).includes('.pdf'), 'No brand leans on a PDF nobody can search');

// The dietary reminder and the "copy the name and search" note appear once each, and the
// chapter no longer repeats the halal line that FOOD_ADVICE already carried.
const diningView = fs.readFileSync('components/trip/dining-brands.tsx', 'utf8');
assert.equal((diningView.match(/DINING_INTRO\.halal/g) ?? []).length, 1, 'One dietary reminder for the whole section');
assert.equal((diningView.match(/DINING_INTRO\.how/g) ?? []).length, 1, 'One explanation of how to use the names');
// FOOD_ADVICE is gone from the chapter entirely: the halal and allergy line lives in the
// brand intro (seen before you pick a restaurant), and the in-flight special meal belongs
// to the preparation chapter, where you can still act on it.
assert(!view.includes('FOOD_ADVICE'), 'The food chapter must not repeat the dietary bullet list');
assert(/机上.*特殊餐|special meal on board/.test(JSON.stringify(data.PREP)), 'The in-flight special meal note moved into preparation');
for (const kept of ['清真', '过敏']) {
  assert(dining.DINING_INTRO.halal.zh.includes(kept), `The one dietary line keeps ${kept}`);
}
// The unit is said once in the intro, not on every row.
assert(dining.DINING_INTRO.how.zh.includes('人民币') && dining.DINING_INTRO.how.en.includes('CNY'), 'The intro names the currency');
assert(!diningView.includes('元人民币'), 'The per-person line does not repeat the currency on every row');
/*
 * The dollar figure is arithmetic done here at a fixed rate, not a quoted price. The
 * rate belongs to the code that does the sum (and to the documentation) — spelling it
 * out in the intro turned two useful sentences into a paragraph of hedging, which the
 * owner cut on 2026-09-12. What the reader needs is "yuan is the real price, the dollar
 * is approximate, the branch menu decides".
 */
const rate = /CNY_PER_USD = ([\d.]+)/.exec(diningView);
assert(rate, 'The conversion rate is a named constant in the component');
assert(!JSON.stringify(dining.DINING_INTRO).includes(rate[1]), 'The rate is arithmetic, not a sentence in the intro');
for (const [lang, approximately] of [['zh', '约合美元'], ['en', 'approximate US dollar'], ['ar', 'تقريبًا بالدولار']]) {
  assert(dining.DINING_INTRO.how[lang].includes(approximately), `The ${lang} intro marks the dollar figure as approximate`);
}
assert(dining.DINING_INTRO.how.zh.length <= 60, `The intro is two short sentences, found ${dining.DINING_INTRO.how.zh.length} characters`);
// Copy buttons that all read "copy Chinese name" are indistinguishable to a screen reader.
assert(/label: {\s*zh: `\$\{brand\.chinese\}/.test(diningView), 'Each copy button names its own brand');
assert.equal((diningView.match(/<details/g) ?? []).length, 1, 'Sources sit in one folded list, not one per brand');
// The theme photograph is captioned, so an outside photo of a dish is never taken for a
// photograph of the restaurant itself.
assert(diningView.includes('菜式示意'), 'The theme photo is labelled as an example of the dish');
assert(/caption=\{LABELS\.sample\}/.test(diningView), 'The label is the picture caption, not a stray line of text');
assert(/<figcaption/.test(fs.readFileSync('components/trip/ui.tsx', 'utf8')), 'Figure renders its caption as a caption');
assert(diningView.includes('inline'), 'The brand copy button uses the inline variant, not the big address panel');
assert(fs.readFileSync('components/trip/ui.tsx', 'utf8').includes('inline = false'), 'The inline variant must stay opt-in');
/*
 * 2026-09-12, owner: the dishes come first and the brands after them. Read the other
 * way round you scroll past a dozen restaurants before learning what yum cha or a
 * sizzling claypot even is — appetite first, then where to eat it.
 */
assert(view.indexOf('UI.foodIdeas') < view.indexOf('UI.diningBrands'), 'The dishes are introduced before the brands that serve them');

/*
 * The rule behind this one: a picture must show the thing the text describes. The old
 * robotaxi.jpg was Ferrari World in Abu Dhabi; its replacement was a different operator's
 * car from the app the text tells you to use. The driverless ride now shows WeRide's own
 * GXR on a Guangzhou street, credited to the page it came from.
 */
const credits = fs.readFileSync('lib/image-credits.ts', 'utf8');
const gxr = photoByKey.get('gxr-guangzhou');
assert(gxr.page.includes('weride.ai'), 'The GXR photo is credited to WeRide');
assert(/WeRide|文远知行/.test(gxr.artist), 'The GXR photo names its provider');
for (const retired of ['pigeon', 'soup']) {
  assert(!credits.includes(`"key": "${retired}"`), `${retired}.jpg was retired, not left in the credits`);
}
assert(!fs.existsSync('public/images/soup.jpg'), 'The pig-lung soup photo is gone — these guests are Muslim');

// The header carries one person picker, not a row of six chips, and no watermark.
const header = fs.readFileSync('components/trip/trip-view.tsx', 'utf8');
assert(header.includes('NativeSelect'), 'The person picker must be a compact select');
assert(!header.includes('PersonChip') && !header.includes('trip-kapok'), 'Six-chip scroller and the header watermark are replaced');
assert(!fs.readFileSync('app/globals.css', 'utf8').includes('overflow-x: clip'), 'Overflow must be fixed where it happens, not clipped away');

console.log('PASS: five traveller views, complete three-language prep and routes, rejected copy and rejected layout, one column of chapters at the agreed type scale, compact header, unchanged flight/baggage/hotel facts.');
