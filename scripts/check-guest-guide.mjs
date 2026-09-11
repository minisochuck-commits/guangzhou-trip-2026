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
]) checkLocales(data[key]);
// Routes are guest-facing copy too: the rejected wording must not survive there either.
const copy = JSON.stringify([
  data.CITY_STORY, data.CITY_SCALE, data.CITY_TECH, data.RETAIL_STUDY, data.FOOD_CULTURE,
  data.FOOD_NOTES, data.ROUTES, data.CULTURE_NOTES, data.PAZHOU, data.HALAL_WHERE, data.MOSQUES,
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
].filter(Boolean));
for (const dropped of ['pigeon', 'soup', 'robot', 'robotaxi', 'cbd', 'tianhe']) {
  assert(!imageKeysInUse.has(dropped), `${dropped}.jpg does not show what the text describes`);
}
// The credits list follows the pictures actually on the page, so the retired files do not
// arrive in front of the guest through the credits instead. (`view` is read further down.)
const guideView = fs.readFileSync('components/trip/guide-tab.tsx', 'utf8');
assert(guideView.includes('USED_IMAGE_KEYS'), 'Image credits must be filtered to the images in use');
assert(!/IMAGE_CREDITS\.map/.test(guideView), 'The full asset list must not be printed to the reader');

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
 * The guide opens with a welcome, then preparation, then the hotel block, then the
 * chapters in the order the trip is actually read. The owner agreed this on 2026-09-11;
 * it replaces "hotel first, city story folded away near the end".
 */
const at = (needle) => {
  const index = view.indexOf(needle);
  assert(index > -1, `Missing from the guide: ${needle}`);
  return index;
};
assert(at('id="guide-welcome"') < at('id="prep"'), 'The welcome opens the guide');
assert(at('id="prep"') < at('id="guide-hotel"'), 'Preparation comes before the hotel block');
const CHAPTERS = [
  'addresses', 'pazhou', 'story', 'scale', 'tech', 'halal',
  'food', 'retail', 'routes', 'culture', 'phrases', 'baggage', 'sources',
];
let previous = at('id="guide-hotel"');
for (const id of CHAPTERS) {
  const here = at(`id="${id}"`);
  assert(here > previous, `Chapter out of the agreed reading order: ${id}`);
  previous = here;
}
assert(view.indexOf('id="prep"') < view.indexOf('id="story"'), 'Preparation must precede long reading');

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
 * Dining brands: 21 brands, a brand appearing once however many branches it runs.
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
for (const brand of brands) {
  assert(brand.imageKey, `${brand.id} needs a photograph of its signature dish`);
}
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
// The unit is said once in the intro, not on all 21 rows.
assert(dining.DINING_INTRO.how.zh.includes('人民币') && dining.DINING_INTRO.how.en.includes('CNY'), 'The intro names the currency');
assert(!diningView.includes('元人民币'), 'The per-person line does not repeat the currency on every row');
// 21 copy buttons that all read "copy Chinese name" are indistinguishable to a screen reader.
assert(/label: {\s*zh: `\$\{brand\.chinese\}/.test(diningView), 'Each copy button names its own brand');
assert.equal((diningView.match(/<details/g) ?? []).length, 1, 'Sources sit in one folded list, not one per brand');
assert(diningView.includes('inline'), 'The brand copy button uses the inline variant, not the big address panel');
assert(fs.readFileSync('components/trip/ui.tsx', 'utf8').includes('inline = false'), 'The inline variant must stay opt-in');
/*
 * 2026-09-12, owner: the dishes come first and the brands after them. Read the other
 * way round you scroll past a dozen restaurants before learning what yum cha or a
 * sizzling claypot even is — appetite first, then where to eat it.
 */
assert(view.indexOf('UI.foodIdeas') < view.indexOf('UI.diningBrands'), 'The dishes are introduced before the brands that serve them');

/*
 * robotaxi.jpg used to be Ferrari World in Abu Dhabi, Arabic road signs and all. That
 * file is gone: the key now holds a Guangqi robotaxi photographed in Guangzhou, on a
 * Guangdong plate. The rule behind the old assertion stands — a picture must show the
 * place the text describes — so the credit is checked instead of the key banned.
 */
const credits = fs.readFileSync('lib/image-credits.ts', 'utf8');
assert(/"key": "robotaxi",[\s\S]{0,200}?Guangqi/.test(credits), 'The robotaxi photo must be the Guangzhou one');
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
