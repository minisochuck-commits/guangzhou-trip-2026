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
assert(view.indexOf('id="prep"') < view.indexOf('id="story"'), 'Preparation must precede long reading');
assert(view.includes('defaultValue={[]}'), 'Long stories must start collapsed');
assert(!view.includes('UI.retailTakeaways'), 'Report instructions must not be rendered');
// The guide is grouped now — practical entries first, city reading after — and every
// section still opens on demand inside a reused Accordion.
assert(view.indexOf('UI.guideGroups.practical') < view.indexOf('UI.guideGroups.city'), 'Practical group must come first');
assert(view.includes('<PrepChecklist'), 'Preparation must render the tickable checklist');
for (const reused of ['AccordionItem', 'CopyChinese', 'SourceLink']) assert(view.includes(reused), `Must reuse ${reused}`);

// The prep checklist may only be stored per person, on this device, and the all view
// gets the full guidance with no tick boxes — a tick there would read as "this person
// is done", which nobody can know.
const checklist = fs.readFileSync('lib/prep-checklist.ts', 'utf8');
assert(/person \?\? "all"/.test(checklist), 'The all view needs its own bucket, never a traveller\'s');
const component = fs.readFileSync('components/trip/prep-checklist.tsx', 'utf8');
assert(component.includes('catch'), 'Storage failures must not break the page');
assert(component.includes('item.lines'), 'Ticking must not remove the original instructions');
assert(component.includes('const tickable = person !== null'), 'The all view must not offer tick boxes');
assert(component.includes('tickable && isCheckablePrep'), 'Tick boxes are per traveller only');

// Route photos: the watermarked and the unrecognisable one stay unused, and a portrait
// photo is fitted rather than cropped to its middle.
const routes = fs.readFileSync('components/trip/routes.tsx', 'utf8');
assert(routes.includes('object-contain'), 'Portrait route photos must not be cropped to the waist');
const usedImages = new Set(data.ROUTES.map((route) => route.imageKey));
for (const dropped of ['cbd', 'tianhe']) assert(!usedImages.has(dropped), `${dropped}.jpg was rejected on sight`);
for (const kept of ['opera', 'taikoo']) assert(usedImages.has(kept), `${kept}.jpg should carry a route`);

// The header carries one person picker, not a row of six chips, and no watermark.
const header = fs.readFileSync('components/trip/trip-view.tsx', 'utf8');
assert(header.includes('NativeSelect'), 'The person picker must be a compact select');
assert(!header.includes('PersonChip') && !header.includes('trip-kapok'), 'Six-chip scroller and the header watermark are replaced');
assert(!fs.readFileSync('app/globals.css', 'utf8').includes('overflow-x: clip'), 'Overflow must be fixed where it happens, not clipped away');

console.log('PASS: five traveller views, complete three-language prep and routes, rejected copy, grouped practical-first guide, per-person checklist, compact header, unchanged flight/baggage/hotel facts.');
