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
for (const key of ['PREP', 'CITY_STORY', 'CITY_SCALE', 'CITY_TECH', 'PAZHOU', 'RETAIL_STUDY', 'FOOD_CULTURE', 'FOOD_NOTES', 'MOSQUES', 'ROUTES']) checkLocales(data[key]);
// Routes are guest-facing copy too: the rejected wording must not survive there either.
const copy = JSON.stringify([data.CITY_STORY, data.CITY_SCALE, data.CITY_TECH, data.RETAIL_STUDY, data.FOOD_CULTURE, data.FOOD_NOTES, data.ROUTES]);
for (const rejected of [
  '值得写进报告', '给做商场的人', '做商场的人', '超过埃及全国', '全球至今只有六',
  '都是广东公司', '没有一件货重叠', '粉红才算到位',
  // Guesses about why an operator positioned a mall the way it did, and price/space
  // claims nobody can check on the street.
  '有意错开', '最低', '没人用',
  // Rankings and headline statistics belong to the sources, not to a walking route.
  '第一商圈', '十四家', '世界第二高',
  // Drive times nobody checked: the page tells guests to look at the map instead.
  '过江即到', '打车很近', '短车程',
]) assert(!copy.includes(rejected), `Rejected wording: ${rejected}`);
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

// The welcome itself: always visible, no button, and it owns the Huaisheng photo.
// The chapter behind it keeps the full history and its sources.
const welcomeStart = at('aria-labelledby="guide-welcome"');
const welcome = view.slice(welcomeStart, view.indexOf('</section>', welcomeStart));
assert(welcome.includes('IMG.huaisheng'), 'The welcome carries the Huaisheng photo');
assert(!/Accordion|button|Trigger/.test(welcome), 'The welcome is plain and always open');
assert(!view.includes('photo="huaisheng"'), 'The welcome photo must not be repeated in the story chapter');
for (const kept of ['CITY_STORY.paragraphs', 'CITY_STORY.sources']) {
  assert(view.includes(kept), `The city story keeps ${kept}`);
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

// The header carries one person picker, not a row of six chips, and no watermark.
const header = fs.readFileSync('components/trip/trip-view.tsx', 'utf8');
assert(header.includes('NativeSelect'), 'The person picker must be a compact select');
assert(!header.includes('PersonChip') && !header.includes('trip-kapok'), 'Six-chip scroller and the header watermark are replaced');
assert(!fs.readFileSync('app/globals.css', 'utf8').includes('overflow-x: clip'), 'Overflow must be fixed where it happens, not clipped away');

console.log('PASS: five traveller views, complete three-language prep and routes, rejected copy and rejected layout, one column of chapters at the agreed type scale, compact header, unchanged flight/baggage/hotel facts.');
